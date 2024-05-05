// use rust std
use std::cell::RefCell;
use std::rc::Rc;

// use local types
use crate::node::{Node, TidyInfo};
use crate::utils::{bfs_traverse_tree, pre_order_traverse_tree};

pub fn init_node(root: Option<Rc<RefCell<Node>>>) {
    bfs_traverse_tree(root, |node| {
        let mut node_mut = node.borrow_mut();
        node_mut.x = 0.0;
        node_mut.y = 0.0;
        node_mut.relative_x = 0.0;
        node_mut.relative_y = 0.0;
        node_mut.tidy = Some(TidyInfo::new());
    });
}

pub fn set_pos_y_of_nodes(root: Option<Rc<RefCell<Node>>>, v_space: f32, is_layered: bool, depth_to_y: &mut Vec<f32>) {
    if !is_layered {
        pre_order_traverse_tree(root, |node| {
            node.borrow_mut().y = 0.0;

            let parent_opt = node.borrow().parent.upgrade();
            if parent_opt.is_some() {
                let parent_bottom = parent_opt.unwrap().borrow().bottom();
                node.borrow_mut().y = parent_bottom + v_space;
            }
        })
    } else {
        depth_to_y.clear();
    }
}