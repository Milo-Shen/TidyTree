// use std
use std::cell::RefCell;
use std::collections::{HashMap, VecDeque};
use std::rc::{Rc, Weak};

//  use local types
use crate::line::{LineNode, LineType};
use crate::mock_org_chart_data::MockChartData;
use crate::utils::{is_even, is_leaf, traverse_tree_by_dfs};

#[derive(Debug)]
pub enum NodeType {
    NORMAL,
    LITE,
    BATCH,
    EXTEND,
}

#[derive(Debug)]
pub enum LayoutMode {
    Basic,
    Tidy,
    LayeredTidy,
}

#[derive(Debug)]
pub struct Node {
    pub id: i64,
    pub children: Vec<Rc<RefCell<Node>>>,
    pub parent: Weak<RefCell<Node>>,
    pub width: f32,
    pub height: f32,
    pub x: f32,
    pub y: f32,
    pub mode: NodeType,
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
            mode,
        }
    }
}

pub struct TidyTree {
    pub root: Option<Rc<RefCell<Node>>>,
    h_space: f32,
    v_space: f32,
    layout_mode: LayoutMode,
    map: HashMap<i64, Rc<RefCell<Node>>>,
    node_linked_list: Vec<Rc<RefCell<Node>>>,
}

impl TidyTree {
    pub fn new(layout_mode: LayoutMode, h_space: f32, v_space: f32) -> TidyTree {
        TidyTree {
            root: None,
            h_space,
            v_space,
            layout_mode: LayoutMode::Basic,
            map: HashMap::new(),
            node_linked_list: vec![],
        }
    }

    pub fn initialize_tree_from_raw_data(&mut self, node_list: Vec<MockChartData>) {
        let node_list_len = node_list.len();
        if node_list_len == 0 {
            return;
        }

        self.node_linked_list = Vec::with_capacity(node_list_len);

        // build card node map
        for node in node_list {
            let MockChartData { id, width, height, .. } = node;
            let node = Rc::new(RefCell::new(Node::new(id, width, height, NodeType::NORMAL)));
            self.map.insert(id, node);

            // add node to linked list
            self.node_linked_list.push(Rc::clone(&node));
        }

        // establish relationship between nodes
        for node in node_list {
            let MockChartData { id, children, .. } = node;
            let node = self.map.get(&id).unwrap();

            for child_id in children {
                let child = self.map.get(&child_id).unwrap();
                child.borrow_mut().parent = Rc::downgrade(node);
                node.borrow_mut().children.push(Rc::clone(child));
            }
        }

        self.root = Some(Rc::clone(self.map.get(&node_list[0].id).unwrap()))
    }
}
