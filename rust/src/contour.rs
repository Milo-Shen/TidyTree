// use rust std
use std::cell::RefCell;
use std::rc::Rc;

//  use local types
use crate::node::Node;

#[derive(Debug)]
pub struct Contour {
    is_left: bool,
    current: Rc<RefCell<Node>>,
    modifier_sum: f32,
}

impl Contour {
    pub fn new(is_left: bool, node: Rc<RefCell<Node>>) -> Contour {
        let mut modifier_sum = 0.0;

        if node.is_some() {
            let tidy = node.borrow().tidy.as_ref();
            
            if tidy.is_some() {
                modifier_sum = tidy.unwrap().modifier_to_subtree;
            }
        }

        Contour {
            is_left,
            current: node,
            modifier_sum,
        }
    }
}