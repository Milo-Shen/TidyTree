// use rust std
use std::cell::RefCell;
use std::rc::{Rc, Weak};

// use local types
use crate::node::{Node, TidyInfo};
use crate::utils::{bfs_traverse_tree, bfs_traverse_tree_with_depth, pre_order_traverse_tree, pre_order_traverse_tree_with_depth};

pub fn init_node(root: Option<Rc<RefCell<Node>>>) {
    bfs_traverse_tree(root, |node| {
        let mut node_mut = node.borrow_mut();
        node_mut.x = 0.0;
        node_mut.y = 0.0;
        node_mut.relative_x = 0.0;
        node_mut.relative_y = 0.0;
        node_mut.tidy = Some(TidyInfo::new());
    });
}

pub fn set_pos_y_of_nodes(root: Option<Rc<RefCell<Node>>>, v_space: f32, is_layered: bool, depth_to_y: &mut Vec<f32>) {
    if !is_layered {
        pre_order_traverse_tree(root, |node| {
            node.borrow_mut().y = 0.0;

            let parent_opt = node.borrow().parent.upgrade();
            if parent_opt.is_some() {
                let parent_bottom = parent_opt.unwrap().borrow().bottom();
                node.borrow_mut().y = parent_bottom + v_space;
            }
        })
    } else {
        depth_to_y.clear();

        bfs_traverse_tree_with_depth(root.clone(), |node, depth| {
            while depth >= depth_to_y.len() {
                depth_to_y.push(0.0);
            }

            if node.borrow().parent.upgrade().is_none() || depth == 0 {
                node.borrow_mut().y = 0.0;
                return;
            }

            let parent_h = node.borrow().parent.upgrade().as_ref().unwrap().borrow().height;
            depth_to_y[depth] = depth_to_y[depth].max(depth_to_y[depth - 1] + parent_h + v_space);
        });

        pre_order_traverse_tree_with_depth(root.clone(), |node, depth| {
            node.borrow_mut().y = depth_to_y[depth];
        })
    }
}

pub fn first_walk(root: Option<Rc<RefCell<Node>>>, h_space: f32) {
    if root.is_none() {
        return;
    }

    let node = root.as_ref().unwrap();
    let children = &node.borrow().children;

    // empty children
    if children.is_empty() {
        set_extreme(node);
        return;
    }
}

pub fn set_extreme(node: &Rc<RefCell<Node>>) {
    let tidy_opt = &mut node.borrow_mut().tidy;

    if tidy_opt.is_none() {
        return;
    }

    let mut tidy = tidy_opt.as_mut().unwrap();
    let children = &node.borrow().children;

    // leaf child
    if children.is_empty() {
        tidy.extreme_left = Rc::downgrade(node);
        tidy.extreme_right = Rc::downgrade(node);
        tidy.modifier_extreme_left = 0.0;
        tidy.modifier_extreme_right = 0.0;
    } else {
        let first_child = children.first().unwrap();
        let first_tidy_opt = &mut first_child.borrow_mut().tidy;
        let first_tidy = first_tidy_opt.as_mut().unwrap();
        tidy.extreme_left = Weak::clone(&first_tidy.extreme_left);
        tidy.modifier_extreme_left = first_tidy.modifier_to_subtree + first_tidy.modifier_extreme_left;
        let last_child = children.last().unwrap();
        let last_child_opt = &mut last_child.borrow_mut().tidy;
        let last_tidy = last_child_opt.as_mut().unwrap();
        tidy.extreme_right = Weak::clone(&last_tidy.extreme_right);
        tidy.modifier_extreme_right = last_tidy.modifier_to_subtree + last_tidy.modifier_extreme_right;
    }
}