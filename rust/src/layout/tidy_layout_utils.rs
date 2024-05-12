// use rust std
use std::cell::RefCell;
use std::rc::{Rc, Weak};
use crate::layout::linked_y_list::LinkedYList;

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

pub fn first_walk(node: &Rc<RefCell<Node>>, h_space: f32) {
    let children = &node.borrow().children;

    // empty children
    if children.is_empty() {
        set_extreme(node);
        return;
    }

    let first_child = children.first().unwrap();
    first_walk(first_child, h_space);

    let extreme_right_bottom = first_child.borrow().tidy.as_ref().unwrap().extreme_right.upgrade().as_ref().unwrap().borrow().bottom();
    let mut pos_y_list = LinkedYList::new(0, extreme_right_bottom);

    for i in 1..children.len() {
        let child = &children[i];
        first_walk(child, h_space);
        let max_y = child.borrow().tidy.as_ref().unwrap().extreme_left.upgrade().as_ref().unwrap().borrow().bottom();
        pos_y_list = separate(node, i, pos_y_list, h_space);
        pos_y_list = pos_y_list.update(i, max_y);
    }

    position_root(node);
    set_extreme(node);
}

pub fn position_root(node: &Rc<RefCell<Node>>) {
    let children = &node.borrow().children;
    let first = children.first().unwrap();
    let first_child_pos = first.borrow().relative_x + first.borrow().tidy.as_ref().unwrap().modifier_to_subtree;
    let last = children.last().unwrap();
    let last_child_pos = last.borrow().relative_x + last.borrow().tidy.as_ref().unwrap().modifier_to_subtree;

    let node_relative_x = (first_child_pos + last_child_pos) / 2.0;
    node.borrow_mut().relative_x = node_relative_x;
    node.borrow_mut().tidy.as_mut().unwrap().modifier_to_subtree = -node_relative_x;
}

pub fn separate(node: &Rc<RefCell<Node>>, child_index: usize, mut pos_y_list: LinkedYList, h_space: f32) -> LinkedYList {
    LinkedYList::new(0, 0.0)
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