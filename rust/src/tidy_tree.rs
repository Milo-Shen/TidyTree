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

#[derive(Debug)]
pub struct TidyTree {
    pub root: Option<Rc<RefCell<Node>>>,
    pub h_space: f32,
    pub v_space: f32,
    pub layout_mode: LayoutMode,
    pub map: HashMap<i64, Rc<RefCell<Node>>>,
    pub node_linked_list: Vec<Rc<RefCell<Node>>>,
}

pub struct TidyConfiguration {
    // margin between sibling nodes
    pub h_space: f32,
    // margin between child and parent node
    pub v_space: f32,
    // all siblings node will be putted on a same pos y layer
    pub is_layered: bool,
    // this is only for layered mode
    pub depth_to_y: Vec<f32>,
}