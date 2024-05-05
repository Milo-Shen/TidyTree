// use rust std
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

//  use local types
use crate::node::{Node, NodeType};
use crate::tidy_tree::{LayoutMode, TidyConfiguration, TidyTree};
use crate::utils::mock_org_chart_data::MockChartData;
use crate::utils::{bfs_traverse_tree, post_order_traverse_tree, pre_order_traverse_tree};

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
            tidy_configuration,
        }
    }

    pub fn initialize_tree_from_raw_data(&mut self, node_list: Vec<MockChartData>) {
        let node_list_len = node_list.len();
        if node_list_len == 0 {
            return;
        }

        self.node_linked_list = Vec::with_capacity(node_list_len);

        // build card node map
        for node in &node_list {
            let MockChartData { id, width, height, .. } = node;
            let node = Rc::new(RefCell::new(Node::new(*id, *width, *height, NodeType::NORMAL)));
            self.map.insert(*id, Rc::clone(&node));

            // add node to linked list
            self.node_linked_list.push(Rc::clone(&node));
        }

        // establish relationship between nodes
        for node in &node_list {
            let MockChartData { id, children, .. } = node;
            let node = self.map.get(id).unwrap();

            for (index, child_id) in children.iter().enumerate() {
                let child = self.map.get(child_id).unwrap();
                child.borrow_mut().parent = Rc::downgrade(node);
                child.borrow_mut().index = index as i64;
                node.borrow_mut().children.push(Rc::clone(child));
            }
        }

        let first_node_id = node_list[0].id;
        self.root = Some(Rc::clone(self.map.get(&first_node_id).unwrap()))
    }

    pub fn generate_basic_layout(&self) {
        let mut min_x: f32 = f32::MAX;

        post_order_traverse_tree(self.root.clone(), |node| {
            let node_w = node.borrow().width;
            let node_h = node.borrow().height;

            node.borrow_mut().bounding_box_w = node_w;

            let children_len = node.borrow().children.len();
            if children_len == 0 {
                return;
            }

            let mut temp_x = 0.0;

            for child in &node.borrow().children {
                let child_bounding_box_w = child.borrow().bounding_box_w;
                child.borrow_mut().relative_x = temp_x + child_bounding_box_w / 2.0;
                child.borrow_mut().relative_y = node_h + self.tidy_configuration.v_space;
                temp_x += child_bounding_box_w + self.tidy_configuration.h_space;
            }

            let children_w = temp_x - self.tidy_configuration.h_space;
            let shift_x = -children_w / 2.0;

            for child in &node.borrow().children {
                child.borrow_mut().relative_x += shift_x;
            }

            node.borrow_mut().bounding_box_w = children_w.max(node_w)
        });

        bfs_traverse_tree(self.root.clone(), |node| {
            let node_x = node.borrow().x;
            let node_w = node.borrow().width;

            let parent_opt = node.borrow().parent.upgrade();
            if node.borrow().parent.upgrade().is_none() {
                let final_x = node_x - node_w / 2.0;
                min_x = min_x.min(final_x);
                return;
            }

            let parent = parent_opt.unwrap();
            let node_relative_x = node.borrow().relative_x;
            let node_relative_y = node.borrow().relative_y;

            let new_x = parent.borrow().x + node_relative_x;
            node.borrow_mut().x = new_x;
            node.borrow_mut().y = parent.borrow().y + node_relative_y;

            let final_x = new_x - node_w / 2.0;
            min_x = min_x.min(final_x);
        });

        pre_order_traverse_tree(self.root.clone(), |node| {
            let diff = if min_x < 0.0 { -min_x } else { 0.0 };
            let node_x = node.borrow().x;
            let node_w = node.borrow().width;
            node.borrow_mut().x = node_x - node_w / 2.0 + diff;
        })
    }

    pub fn get_node_linked_list(&self) -> &Vec<Rc<RefCell<Node>>> {
        return &self.node_linked_list;
    }
}
