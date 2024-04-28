use std::cell::RefCell;
use std::rc::{Rc, Weak};

#[derive(Debug)]
pub struct TidyInfo {
    pub thread_left: Option<Node>,
    pub thread_right: Option<Node>,
    pub extreme_left: Option<Node>,
    pub extreme_right: Option<Node>,
    pub shift_acceleration: f32,
    pub shift_change: f32,
    pub modifier_to_subtree: f32,
    pub modifier_thread_left: f32,
    pub modifier_thread_right: f32,
    pub modifier_extreme_left: f32,
    pub modifier_extreme_right: f32,
    // to accelerate the speed of second walk
    pub prev_modified_sum: f32,
}

impl TidyInfo {
    pub fn new() -> TidyInfo {
        TidyInfo {
            thread_left: None,
            thread_right: None,
            extreme_left: None,
            extreme_right: None,
            shift_acceleration: 0.0,
            shift_change: 0.0,
            modifier_to_subtree: 0.0,
            modifier_thread_left: 0.0,
            modifier_thread_right: 0.0,
            modifier_extreme_left: 0.0,
            modifier_extreme_right: 0.0,
            // to accelerate the speed of second walk
            prev_modified_sum: 0.0,
        }
    }
}

#[derive(Debug)]
pub enum NodeType {
    NORMAL,
    LITE,
    BATCH,
    EXTEND,
}

#[derive(Debug)]
pub struct Node {
    pub id: i64,
    pub width: f32,
    pub height: f32,
    pub x: f32,
    pub y: f32,
    pub index: i64,
    pub relative_x: f32,
    pub relative_y: f32,
    pub bounding_box_w: f32,
    pub parent: Weak<RefCell<Node>>,
    pub children: Vec<Rc<RefCell<Node>>>,
    pub mode: NodeType,
    pub tidy: Option<TidyInfo>,
}

impl Node {
    pub fn new(id: i64, w: f32, h: f32, mode: NodeType) -> Node {
        Node {
            id,
            children: Vec::new(),
            parent: Weak::new(),
            width: w,
            height: h,
            x: 0.0,
            y: 0.0,
            index: 0,
            relative_x: 0.0,
            relative_y: 0.0,
            bounding_box_w: 0.0,
            mode,
            tidy: None,
        }
    }
}