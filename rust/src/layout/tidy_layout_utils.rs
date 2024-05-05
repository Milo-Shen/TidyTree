// use rust std
use std::cell::RefCell;
use std::rc::Rc;

// use local types
use crate::node::Node;
use crate::utils::bfs_traverse_tree;

pub fn init_node(root: Option<Rc<RefCell<Node>>>) {
    bfs_traverse_tree(root, |node| {
        node.borrow().x = 0.0;
    });
}