// use rust std
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

//  use local types
use crate::node::{Node, NodeType, NodeTupleData};
use crate::line::LineTupleData;
use crate::tidy_tree::{LayoutMode, TidyConfiguration, TidyTree};
use crate::utils::mock_org_chart_data::MockChartData;

// implementations
impl TidyConfiguration {
    pub fn new(h_space: f32, v_space: f32, line_width: f32, is_layered: bool) -> TidyConfiguration {
        let depth_to_y = Vec::new();
        TidyConfiguration {
            h_space,
            v_space,
            line_width,
            is_layered,
            depth_to_y,
        }
    }
}

impl TidyTree {
    pub fn new(layout_mode: LayoutMode, tidy_configuration: TidyConfiguration) -> TidyTree {
        TidyTree {
            root: None,
            layout_mode,
            map: HashMap::new(),
            node_linked_list: vec![],
            line_linked_list: vec![],
            tidy_configuration,
        }
    }

    pub fn initialize_tree_from_raw_data(&mut self, node_list: Vec<MockChartData>) {
        let node_list_len = node_list.len();
        if node_list_len == 0 {
            return;
        }

        self.node_linked_list = Vec::with_capacity(node_list_len);
        self.line_linked_list = Vec::with_capacity(node_list_len);

        // build card node map
        for node in &node_list {
            let MockChartData { id, width, height, .. } = node;
            let new_node = Rc::new(RefCell::new(Node::new(*id, *width, *height, NodeType::NORMAL)));
            self.map.insert(*id, Rc::clone(&new_node));

            // add node to linked list
            self.node_linked_list.push(Rc::clone(&new_node));
        }

        // establish relationship between nodes
        for node in &node_list {
            let MockChartData { id, children, .. } = node;
            let node = self.map.get(id).unwrap();

            for (index, child_id) in children.iter().enumerate() {
                let child = self.map.get(child_id).unwrap();
                child.borrow_mut().parent = Rc::downgrade(node);
                child.borrow_mut().index = index;
                node.borrow_mut().children.push(Rc::clone(child));
            }
        }

        let first_node_id = node_list[0].id;
        self.root = Some(Rc::clone(self.map.get(&first_node_id).unwrap()))
    }

    pub fn initialize_tree_from_js_code(&mut self, ids: &[i32], width: &[f32], height: &[f32], parents: &[i32]) {
        let node_list_len = ids.len();

        if node_list_len == 0 {
            return;
        }

        self.map.clear();
        self.node_linked_list = Vec::with_capacity(node_list_len);
        self.line_linked_list = Vec::with_capacity(node_list_len);

        // build card node map
        for i in 0..node_list_len {
            let id = ids[i];
            let width = width[i];
            let height = height[i];
            let node = Rc::new(RefCell::new(Node::new(id, width, height, NodeType::NORMAL)));
            self.map.insert(id, Rc::clone(&node));

            // add node to linked list
            self.node_linked_list.push(Rc::clone(&node));
        }

        // establish relationship between nodes by parent information
        for i in 0..node_list_len {
            let id = ids[i];
            let parent = parents[i];

            if parent == -1 {
                continue;
            }

            let current_node = Rc::clone(self.map.get(&id).unwrap());
            let parent_node = Rc::clone(self.map.get(&parent).unwrap());
            let index = parent_node.borrow().children.len();
            current_node.borrow_mut().parent = Rc::downgrade(&parent_node);
            current_node.borrow_mut().index = index;
            parent_node.borrow_mut().children.push(current_node);
        }

        let first_node_id = ids[0];
        self.root = Some(Rc::clone(self.map.get(&first_node_id).unwrap()))
    }

    pub fn get_node_linked_list(&self) -> Vec<NodeTupleData> {
        let len = self.node_linked_list.len();
        let mut result = Vec::with_capacity(len);

        for node in &self.node_linked_list {
            result.push(node.borrow().to_array())
        }

        result
    }

    pub fn get_line_linked_list(&self) -> &Vec<LineTupleData> {
        return &self.line_linked_list;
    }
}
