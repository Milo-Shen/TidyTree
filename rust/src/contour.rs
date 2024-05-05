// use rust std
use std::cell::RefCell;
use std::rc::Rc;

//  use local types
use crate::node::Node;

#[derive(Debug)]
pub struct Contour {
    is_left: bool,
    current: Option<Rc<RefCell<Node>>>,
    modifier_sum: f32,
}

impl Contour {
    pub fn new(is_left: bool, node: Option<Rc<RefCell<Node>>>) -> Contour {
        let mut modifier_sum = 0.0;

        if node.is_some() {
            let is_tidy_available = node.as_ref().unwrap().borrow().tidy.as_ref().is_some();

            if is_tidy_available {
                modifier_sum = node.as_ref().unwrap().borrow().tidy.as_ref().unwrap().modifier_to_subtree
            }
        }

        Contour {
            is_left,
            current: node,
            modifier_sum,
        }
    }

    pub fn get_node(&self) -> Option<Rc<RefCell<Node>>> {
        self.current.clone()
    }
}