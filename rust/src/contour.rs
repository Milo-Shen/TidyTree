//  use local types
use crate::node::Node;

#[derive(Debug)]
pub struct Contour {
    is_left: bool,
    current: Option<Node>,
    modifier_sum: f32,
}

impl Contour {
    pub fn new(is_left: bool, node: Option<Node>) -> Contour {
        let mut modifier_sum = 0.0;

        if node.is_some() {
            let tidy = node.as_ref().unwrap();
        }

        Contour {
            is_left,
            current: node,
            modifier_sum,
        }
    }
}