// use rust std
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
use crate::line::LineType;

//  use local types
use crate::node::{Node, NodeType};
use crate::tidy_tree::{LayoutMode, TidyConfiguration, TidyTree};
use crate::utils::mock_org_chart_data::MockChartData;

// implementations
impl TidyConfiguration {
    pub fn new(h_space: f32, v_space: f32, line_width: f32, is_layered: bool, depth_to_y: Vec<f32>) -> TidyConfiguration {
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
            let node = Rc::new(RefCell::new(Node::new(*id, *width, *height, NodeType::NORMAL)));
            self.map.insert(*id, Rc::clone(&node));

            // add node to linked list
            self.node_linked_list.push(node.borrow().to_array());
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

    pub fn get_node_linked_list(&self) -> &Vec<(i64, f32, f32, f32, f32)> {
        return &self.node_linked_list;
    }

    pub fn get_line_linked_list(&self) -> &Vec<(f32, f32, f32, f32, f32, i32)> {
        return &self.line_linked_list;
    }
}
