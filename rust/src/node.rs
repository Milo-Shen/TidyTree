use std::cell::RefCell;
use std::rc::{Rc, Weak};

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
    pub relative_x: f32,
    pub relative_y: f32,
    pub bounding_box_w: f32,
    pub parent: Weak<RefCell<Node>>,
    pub children: Vec<Rc<RefCell<Node>>>,
    pub mode: NodeType,
}