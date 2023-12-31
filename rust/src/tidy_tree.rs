// use std
use std::cell::RefCell;
use std::collections::{HashMap};
use std::rc::{Rc, Weak};

//  use local types
use crate::line::{LineNode, LineType};
use crate::mock_org_chart_data::MockChartData;
use crate::utils::{bfs_traverse_tree, post_order_traverse_tree, pre_order_traverse_tree};

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
            relative_x: 0.0,
            relative_y: 0.0,
            bounding_box_w: 0.0,
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
        for node in &node_list {
            let MockChartData { id, width, height, .. } = node;
            let node = Rc::new(RefCell::new(Node::new(*id, *width, *height, NodeType::NORMAL)));
            self.map.insert(*id, Rc::clone(&node));

            // add node to linked list
            self.node_linked_list.push(Rc::clone(&node));
        }

        // establish relationship between nodes
        for node in &node_list {
            let MockChartData { id, children, .. } = node;
            let node = self.map.get(id).unwrap();

            for child_id in children {
                let child = self.map.get(child_id).unwrap();
                child.borrow_mut().parent = Rc::downgrade(node);
                node.borrow_mut().children.push(Rc::clone(child));
            }
        }

        let first_node_id = node_list[0].id;
        self.root = Some(Rc::clone(self.map.get(&first_node_id).unwrap()))
    }

    pub fn generate_basic_layout(&self) {
        let mut min_x: f32 = f32::MAX;

        post_order_traverse_tree(self.root.clone(), |node| {
            let node_w = node.borrow().width;
            let node_h = node.borrow().height;

            node.borrow_mut().bounding_box_w = node_w;

            let children_len = node.borrow().children.len();
            if children_len == 0 {
                return;
            }

            let mut temp_x = 0.0;

            for child in &node.borrow().children {
                let child_bounding_box_w = child.borrow().bounding_box_w;
                child.borrow_mut().relative_x = temp_x + child_bounding_box_w / 2.0;
                child.borrow_mut().relative_y = node_h + self.v_space;
                temp_x += child_bounding_box_w + self.h_space;
            }

            let children_w = temp_x - self.h_space;
            let shift_x = -children_w / 2.0;

            for child in &node.borrow().children {
                child.borrow_mut().relative_x += shift_x;
            }

            node.borrow_mut().bounding_box_w = children_w.max(node_w)
        });

        bfs_traverse_tree(self.root.clone(), |node| {
            let node_x = node.borrow().x;
            let node_w = node.borrow().width;

            let parent_opt = node.borrow().parent.upgrade();
            if node.borrow().parent.upgrade().is_none() {
                let final_x = node_x - node_w / 2.0;
                min_x = min_x.min(final_x);
                return;
            }

            let parent = parent_opt.unwrap();
            let node_relative_x = node.borrow().relative_x;
            let node_relative_y = node.borrow().relative_y;

            let new_x = parent.borrow().x + node_relative_x;
            node.borrow_mut().x = new_x;
            node.borrow_mut().y = parent.borrow().y + node_relative_y;

            let final_x = new_x - node_w / 2.0;
            min_x = min_x.min(final_x);
        });

        pre_order_traverse_tree(self.root.clone(), |node| {
            let diff = if min_x < 0.0 { -min_x } else { 0.0 };
            let node_x = node.borrow().x;
            let node_w = node.borrow().width;
            node.borrow_mut().x = node_x - node_w / 2.0 + diff;
        })
    }

    pub fn get_node_linked_list(&self) -> &Vec<Rc<RefCell<Node>>> {
        return &self.node_linked_list;
    }
}
