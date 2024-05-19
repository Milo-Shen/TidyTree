// use rust std
use std::cell::RefCell;
use std::collections::{HashMap, VecDeque};
use std::rc::{Rc, Weak};

// use local types
use crate::contour::Contour;
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

pub fn first_walk_stack_without_recursion(root: Option<Rc<RefCell<Node>>>, h_space: f32) {
    let mut stack = VecDeque::new();

    let mut cur_node = root.clone();

    while cur_node.is_some() {
        let node = cur_node.unwrap();
        stack.push_back(Rc::clone(&node));

        let children = node.borrow().children.first().map(|x| Rc::clone(x));
        cur_node = children
    }

    let mut pre = root.unwrap();
    let mut pos_y_list_map: HashMap<i64, LinkedYList> = HashMap::new();
}

pub fn set_extreme(node: Rc<RefCell<Node>>) {
    if node.borrow().tidy.is_none() {
        return;
    }

    // let children = &node.borrow().children;
    node.borrow_mut().tidy.as_mut().unwrap().extreme_left = Rc::downgrade(&node);

    // // leaf child
    // if children.is_empty() {
    //     node.borrow_mut().tidy.as_mut().unwrap().extreme_left = Rc::downgrade(node);
    //     tidy.extreme_right = Rc::downgrade(node);
    //     tidy.modifier_extreme_left = 0.0;
    //     tidy.modifier_extreme_right = 0.0;
    // } else {
    //     let first_child = children.first().unwrap();
    //     let first_tidy_opt = &first_child.borrow().tidy;
    //     let first_tidy = first_tidy_opt.as_ref().unwrap();
    //     tidy.extreme_left = Weak::clone(&first_tidy.extreme_left);
    //     tidy.modifier_extreme_left = first_tidy.modifier_to_subtree + first_tidy.modifier_extreme_left;
    //     let last_child = children.last().unwrap();
    //     let last_child_opt = &last_child.borrow().tidy;
    //     let last_tidy = last_child_opt.as_ref().unwrap();
    //     tidy.extreme_right = Weak::clone(&last_tidy.extreme_right);
    //     tidy.modifier_extreme_right = last_tidy.modifier_to_subtree + last_tidy.modifier_extreme_right;
    // }
}

pub fn second_walk(node: &Rc<RefCell<Node>>, modified_sum: &mut f32, min_x: &mut f32) {
    *modified_sum = *modified_sum + node.borrow().tidy.as_ref().unwrap().modifier_to_subtree;
    let node_relative_x = node.borrow().relative_x;

    node.borrow_mut().x = node_relative_x + *modified_sum;
    *min_x = f32::min(*min_x, node.borrow().x - node.borrow().width / 2.0);
    add_child_spacing(node);

    for child in &node.borrow().children {
        second_walk(child, modified_sum, min_x);
    }
}

pub fn add_child_spacing(node: &Rc<RefCell<Node>>) {
    let mut speed = 0.0;
    let mut delta = 0.0;

    for child in &node.borrow().children {
        speed += child.borrow().tidy.as_ref().unwrap().shift_acceleration;
        delta += speed + child.borrow().tidy.as_ref().unwrap().shift_change;
        child.borrow_mut().tidy.as_mut().unwrap().modifier_to_subtree += delta;
        child.borrow_mut().tidy.as_mut().unwrap().shift_acceleration = 0.0;
        child.borrow_mut().tidy.as_mut().unwrap().shift_change = 0.0;
    }
}

pub fn position_root(node: &Rc<RefCell<Node>>) {
    let children = &node.borrow().children;
    let first = children.first().unwrap();
    let first_child_pos = first.borrow().relative_x + first.borrow().tidy.as_ref().unwrap().modifier_to_subtree;
    let last = children.last().unwrap();
    let last_child_pos = last.borrow().relative_x + last.borrow().tidy.as_ref().unwrap().modifier_to_subtree;

    let node_relative_x = (first_child_pos + last_child_pos) / 2.0;
    node.borrow_mut().relative_x = node_relative_x;

    // make modifier_to_subtree + relative_x = 0
    // there will always be collision in `separation()`'s first loop
    node.borrow_mut().tidy.as_mut().unwrap().modifier_to_subtree = -node_relative_x;
}

pub fn separate(node: &Rc<RefCell<Node>>, child_index: usize, mut pos_y_list: LinkedYList, h_space: f32) -> LinkedYList {
    // right contour of the left node
    let mut left = Contour::new(false, Some(Rc::clone(&node.borrow().children[child_index - 1])));

    // right contour of the left node
    let mut right = Contour::new(true, Some(Rc::clone(&node.borrow().children[child_index])));

    while !left.is_none() && !right.is_none() {
        let y_list_bottom = pos_y_list.bottom();

        if left.bottom() > y_list_bottom {
            let top = pos_y_list.pop();

            if top.is_none() {
                println!("error occurred in separate");
            }

            pos_y_list = top.unwrap();
        }

        let dist = left.right() - right.left() + h_space;
        if dist > 0.0 {
            // left node and right node are too close. move right part with distance of dist
            right.modifier_sum += dist;
            move_subtree(node, child_index, pos_y_list.index, dist);
        }

        let left_bottom = left.bottom();
        let right_bottom = right.bottom();

        if left_bottom <= right_bottom {
            left.next();
        }

        if left_bottom >= right_bottom {
            right.next();
        }
    }

    if left.is_none() && !right.is_none() {
        set_left_thread(node, child_index, right.get_node(), right.modifier_sum);
    } else if !left.is_none() && right.is_none() {
        set_right_thread(node, child_index, left.get_node(), left.modifier_sum);
    }

    pos_y_list
}

pub fn set_left_thread(node: &Rc<RefCell<Node>>, current_index: usize, target: Option<Rc<RefCell<Node>>>, modifier: f32) {
    let children = &node.borrow().children;
    let first = &children[0];
    let current = &children[current_index];
    let diff = modifier - first.borrow().tidy.as_ref().unwrap().modifier_extreme_left - first.borrow().tidy.as_ref().unwrap().modifier_to_subtree;

    first.borrow_mut().tidy.as_mut().unwrap().extreme_left.upgrade().as_mut().unwrap().borrow_mut().tidy.as_mut().unwrap().thread_left = Rc::downgrade(&target.unwrap());
    first.borrow_mut().tidy.as_mut().unwrap().extreme_left.upgrade().as_mut().unwrap().borrow_mut().tidy.as_mut().unwrap().modifier_thread_left = diff;
    first.borrow_mut().tidy.as_mut().unwrap().extreme_left = Weak::clone(&current.borrow().tidy.as_ref().unwrap().extreme_left);
    let modifier_extreme_left = current.borrow().tidy.as_ref().unwrap().modifier_extreme_left + current.borrow().tidy.as_ref().unwrap().modifier_to_subtree - first.borrow().tidy.as_ref().unwrap().modifier_to_subtree;
    first.borrow_mut().tidy.as_mut().unwrap().modifier_extreme_left = modifier_extreme_left;
}

pub fn set_right_thread(node: &Rc<RefCell<Node>>, current_index: usize, target: Option<Rc<RefCell<Node>>>, modifier: f32) {
    let children = &node.borrow().children;
    let current = &children[current_index];

    let diff = modifier - current.borrow().tidy.as_ref().unwrap().modifier_extreme_right - current.borrow().tidy.as_ref().unwrap().modifier_to_subtree;
    current.borrow_mut().tidy.as_mut().unwrap().extreme_left.upgrade().as_mut().unwrap().borrow_mut().tidy.as_mut().unwrap().thread_right = Rc::downgrade(&target.unwrap());
    current.borrow_mut().tidy.as_mut().unwrap().extreme_left.upgrade().as_mut().unwrap().borrow_mut().tidy.as_mut().unwrap().modifier_thread_right = diff;

    let prev_node = &children[current_index - 1];
    let prev_tidy = &prev_node.borrow().tidy;
    current.borrow_mut().tidy.as_mut().unwrap().extreme_right = Weak::clone(&prev_tidy.as_ref().unwrap().extreme_right);
    let modifier_extreme_right = prev_node.borrow().tidy.as_ref().unwrap().modifier_extreme_right + prev_node.borrow().tidy.as_ref().unwrap().modifier_to_subtree - current.borrow().tidy.as_ref().unwrap().modifier_to_subtree;
    current.borrow_mut().tidy.as_mut().unwrap().modifier_extreme_right = modifier_extreme_right;
}

pub fn move_subtree(node: &Rc<RefCell<Node>>, current_index: usize, from_index: usize, distance: f32) {
    let child = &node.borrow().children[current_index];
    let child_tidy_opt = &mut child.borrow_mut().tidy;
    let child_tidy = child_tidy_opt.as_mut().unwrap();
    child_tidy.modifier_to_subtree += distance;

    // distribute extra space to nodes between from_index to current_index
    if from_index != current_index - 1 {
        let index_diff = current_index - from_index;
        node.borrow().children[from_index + 1].borrow_mut().tidy.as_mut().unwrap().shift_acceleration += distance / index_diff as f32;
        node.borrow().children[current_index].borrow_mut().tidy.as_mut().unwrap().shift_acceleration -= distance / index_diff as f32;
        node.borrow().children[current_index].borrow_mut().tidy.as_mut().unwrap().shift_change -= distance - distance / index_diff as f32;
    }
}

