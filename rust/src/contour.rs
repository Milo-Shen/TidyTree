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
            let tidy = &node.as_ref().unwrap().borrow().tidy;

            if tidy.is_some() {
                modifier_sum = tidy.as_ref().unwrap().modifier_to_subtree;
            }
        } else {
            panic!("node is not available in Contour");
        }

        Contour { is_left, current: node, modifier_sum }
    }

    pub fn get_node(&self) -> Option<Rc<RefCell<Node>>> {
        self.current.clone()
    }

    pub fn left(&self) -> f32 {
        let node = self.current.as_ref().unwrap().borrow();
        let relative_x = node.relative_x;
        let width = node.width;
        self.modifier_sum + relative_x - width / 2.0
    }

    pub fn right(&self) -> f32 {
        let node = self.current.as_ref().unwrap().borrow();
        let relative_x = node.relative_x;
        let width = node.width;
        self.modifier_sum + relative_x + width / 2.0
    }

    pub fn bottom(&self) -> f32 {
        let node = self.current.as_ref();

        if node.is_none() {
            return 0.0;
        }

        let node_info = node.unwrap().borrow();
        let pos_y = node_info.y;
        let height = node_info.height;

        pos_y + height
    }

    pub fn is_none(&self) -> bool {
        self.current.is_none()
    }

    pub fn next(&mut self) {
        let node_opt = self.current.clone();

        if node_opt.is_none() {
            return;
        }

        let node = node_opt.as_ref().unwrap().borrow();
        let tidy_opt = &node.tidy;

        if tidy_opt.is_none() {
            return;
        }

        let tidy = tidy_opt.as_ref().unwrap();

        let children = &node.children;
        if self.is_left {
            if !children.is_empty() {
                self.current = Some(Rc::clone(children.first().unwrap()));
                self.modifier_sum += self.get_node().unwrap().borrow().tidy.as_ref().unwrap().modifier_to_subtree;
            } else {
                self.modifier_sum += tidy.modifier_thread_left;
                self.current = Some(Rc::clone(&tidy.thread_left.upgrade().unwrap()))
            }
        } else if !children.is_empty() {
            self.current = Some(Rc::clone(children.last().unwrap()));
            self.modifier_sum += self.get_node().unwrap().borrow().tidy.as_ref().unwrap().modifier_to_subtree;
        } else {
            self.modifier_sum += tidy.modifier_thread_right;
            self.current = Some(Rc::clone(&tidy.thread_right.upgrade().unwrap()))
        }
    }
}
