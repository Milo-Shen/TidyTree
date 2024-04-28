// use rust std
use std::cell::RefCell;
use std::collections::{HashMap};
use std::rc::{Rc};

//  use local types
use crate::node::{Node};

#[derive(Debug)]
pub enum LayoutMode {
    Basic,
    Tidy,
    LayeredTidy,
}

pub struct TidyTree {
    pub root: Option<Rc<RefCell<Node>>>,
    pub h_space: f32,
    pub v_space: f32,
    pub layout_mode: LayoutMode,
    pub map: HashMap<i64, Rc<RefCell<Node>>>,
    pub node_linked_list: Vec<Rc<RefCell<Node>>>,
}