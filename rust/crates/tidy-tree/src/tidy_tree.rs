// use rust std
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

//  use local types
use crate::node::{Node, NodeTupleData};
use crate::line::LineTupleData;

pub enum LayoutMode {
    Basic,
    Tidy,
    LayeredTidy,
}

pub struct TidyConfiguration {
    // margin between sibling nodes
    pub h_space: f32,
    // margin between child and parent node
    pub v_space: f32,
    // set the line width between each node
    pub line_width: f32,
    // all siblings node will be putted on a same pos y layer
    pub is_layered: bool,
    // this is only for layered mode
    pub depth_to_y: Vec<f32>,
}

pub struct TidyTree {
    pub root: Option<Rc<RefCell<Node>>>,
    pub layout_mode: LayoutMode,
    pub map: HashMap<i32, Rc<RefCell<Node>>>,
    // id, x, y, width, height
    pub node_linked_list: Vec<NodeTupleData>,
    // x, y, width, height, border width, mode
    pub line_linked_list: Vec<LineTupleData>,
    pub tidy_configuration: TidyConfiguration,
}
