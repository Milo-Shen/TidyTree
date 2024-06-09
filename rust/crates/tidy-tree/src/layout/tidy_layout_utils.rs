// use rust std
use std::cell::RefCell;
use std::collections::{HashMap, VecDeque};
use std::rc::{Rc, Weak};

// use local types
use crate::contour::Contour;
use crate::layout::linked_y_list::LinkedYList;
use crate::line::LineType;

// use local types
use crate::node::{Node, TidyInfo};
use crate::utils::{bfs_traverse_tree, bfs_traverse_tree_with_depth, is_leaf, pre_order_traverse_tree, pre_order_traverse_tree_with_depth};

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
        cur_node = children;
    }

    let mut pre = root.unwrap();
    let mut pos_y_list_map: HashMap<i32, LinkedYList> = HashMap::new();

    while !stack.is_empty() {
        let node = Rc::clone(stack.back().unwrap());
        let is_empty_children = node.borrow().children.is_empty();
        let node_id = node.borrow().id;
        let pre_id = pre.borrow().id;
        let pre_index = pre.borrow().index;

        // empty children
        if is_empty_children {
            set_extreme(Rc::clone(&node));
            stack.pop_back();
            pre = node;
            continue;
        }

        let node_first_child = Rc::clone(node.borrow().children.first().unwrap());
        if node_first_child.borrow().id == pre_id {
            let extreme_right_bottom = node_first_child.borrow().tidy.as_ref().unwrap().extreme_right.upgrade().unwrap().borrow().bottom();
            let pos_y_list = LinkedYList::new(0, extreme_right_bottom);
            pos_y_list_map.insert(node_id, pos_y_list);
        }

        if pre.borrow().parent.upgrade().as_ref().unwrap().borrow().id == node_id {
            if pre_index > 0 {
                let mut pos_y_list = pos_y_list_map.remove(&node_id).unwrap();
                let max_y = pre.borrow().tidy.as_ref().unwrap().extreme_left.upgrade().unwrap().borrow().bottom();
                pos_y_list = separate(Rc::clone(&node), pre_index, pos_y_list, h_space);
                pos_y_list = pos_y_list.update(pre_index, max_y);
                pos_y_list_map.insert(node_id, pos_y_list);
            }
        }

        let node_last_child = Rc::clone(node.borrow().children.last().unwrap());
        if node_last_child.borrow().id == pre_id {
            position_root(Rc::clone(&node));
            set_extreme(Rc::clone(&node));
            stack.pop_back();
            pre = node;
            continue;
        }

        let index = pre_index + 1;
        let mut cur_node = node.borrow().children.get(index).map(|x| Rc::clone(x));

        while cur_node.is_some() {
            let node = cur_node.unwrap();
            stack.push_back(Rc::clone(&node));

            let children = node.borrow().children.first().map(|x| Rc::clone(x));
            cur_node = children;
        }

        pre = node;
    }
}

pub fn separate(node: Rc<RefCell<Node>>, child_index: usize, mut pos_y_list: LinkedYList, h_space: f32) -> LinkedYList {
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
            move_subtree(Rc::clone(&node), child_index, pos_y_list.index, dist);
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
        set_left_thread(Rc::clone(&node), child_index, right.get_node(), right.modifier_sum);
    } else if !left.is_none() && right.is_none() {
        set_right_thread(Rc::clone(&node), child_index, left.get_node(), left.modifier_sum);
    }

    pos_y_list
}

pub fn set_extreme(node: Rc<RefCell<Node>>) {
    if node.borrow().tidy.is_none() {
        return;
    }

    let empty_children = node.borrow().children.is_empty();

    // leaf child
    if empty_children {
        let tidy_opt = &mut node.borrow_mut().tidy;
        let tidy = tidy_opt.as_mut().unwrap();
        tidy.extreme_left = Rc::downgrade(&node);
        tidy.extreme_right = Rc::downgrade(&node);
        tidy.modifier_extreme_left = 0.0;
        tidy.modifier_extreme_right = 0.0;
    } else {
        let first_child = Rc::clone(node.borrow().children.first().unwrap());
        let first_tidy_opt = &first_child.borrow().tidy;
        let first_tidy = first_tidy_opt.as_ref().unwrap();

        let last_child = Rc::clone(node.borrow().children.last().unwrap());
        let last_child_opt = &last_child.borrow().tidy;
        let last_tidy = last_child_opt.as_ref().unwrap();

        let tidy_opt = &mut node.borrow_mut().tidy;
        let tidy = tidy_opt.as_mut().unwrap();

        tidy.extreme_left = Weak::clone(&first_tidy.extreme_left);
        tidy.modifier_extreme_left = first_tidy.modifier_to_subtree + first_tidy.modifier_extreme_left;

        tidy.extreme_right = Weak::clone(&last_tidy.extreme_right);
        tidy.modifier_extreme_right = last_tidy.modifier_to_subtree + last_tidy.modifier_extreme_right;
    }
}

pub fn second_walk_without_recursion(root: Option<Rc<RefCell<Node>>>, modified_sum: f32, min_x: &mut f32) {
    pre_order_traverse_tree(root, |node| {
        let parent_opt = node.borrow().parent.upgrade();
        let mut prev_modified_sum = modified_sum;

        if parent_opt.is_some() {
            prev_modified_sum = parent_opt.as_ref().unwrap().borrow().tidy.as_ref().unwrap().prev_modified_sum;
        }

        let cur_modified_sum = prev_modified_sum + node.borrow().tidy.as_ref().unwrap().modifier_to_subtree;
        let node_relative_x = node.borrow().relative_x;
        let node_width = node.borrow().width;

        let new_node_x = node_relative_x + cur_modified_sum;
        node.borrow_mut().x = new_node_x;
        node.borrow_mut().tidy.as_mut().unwrap().prev_modified_sum = cur_modified_sum;

        *min_x = f32::min(*min_x, new_node_x - node_width / 2.0);
        add_child_spacing(Rc::clone(&node));
    })
}

pub fn add_child_spacing(node: Rc<RefCell<Node>>) {
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

pub fn adjust_node_position(root: Option<Rc<RefCell<Node>>>, diff: f32) {
    pre_order_traverse_tree(root, |node| {
        let node_x = node.borrow().x;
        let node_w = node.borrow().width;
        node.borrow_mut().x = node_x - node_w / 2.0 + diff;
    })
}

pub fn position_root(node: Rc<RefCell<Node>>) {
    let first = Rc::clone(node.borrow().children.first().unwrap());
    let first_child_pos = first.borrow().relative_x + first.borrow().tidy.as_ref().unwrap().modifier_to_subtree;
    let last = Rc::clone(node.borrow().children.last().unwrap());
    let last_child_pos = last.borrow().relative_x + last.borrow().tidy.as_ref().unwrap().modifier_to_subtree;

    let node_relative_x = (first_child_pos + last_child_pos) / 2.0;
    node.borrow_mut().relative_x = node_relative_x;

    // make modifier_to_subtree + relative_x = 0
    // there will always be collision in `separation()`'s first loop
    node.borrow_mut().tidy.as_mut().unwrap().modifier_to_subtree = -node_relative_x;
}

pub fn set_left_thread(node: Rc<RefCell<Node>>, current_index: usize, target: Option<Rc<RefCell<Node>>>, modifier: f32) {
    let first = Rc::clone(node.borrow().children.first().unwrap());
    let current = Rc::clone(node.borrow().children.get(current_index).unwrap());
    let diff = modifier - first.borrow().tidy.as_ref().unwrap().modifier_extreme_left - first.borrow().tidy.as_ref().unwrap().modifier_to_subtree;

    let first_tidy_extreme_left_tidy = Rc::clone(first.borrow().tidy.as_ref().unwrap().extreme_left.upgrade().as_ref().unwrap());
    first_tidy_extreme_left_tidy.borrow_mut().tidy.as_mut().unwrap().thread_left = Rc::downgrade(&target.unwrap());
    first_tidy_extreme_left_tidy.borrow_mut().tidy.as_mut().unwrap().modifier_thread_left = diff;

    first.borrow_mut().tidy.as_mut().unwrap().extreme_left = Weak::clone(&current.borrow().tidy.as_ref().unwrap().extreme_left);
    let modifier_extreme_left = current.borrow().tidy.as_ref().unwrap().modifier_extreme_left + current.borrow().tidy.as_ref().unwrap().modifier_to_subtree - first.borrow().tidy.as_ref().unwrap().modifier_to_subtree;
    first.borrow_mut().tidy.as_mut().unwrap().modifier_extreme_left = modifier_extreme_left;
}

pub fn set_right_thread(node: Rc<RefCell<Node>>, current_index: usize, target: Option<Rc<RefCell<Node>>>, modifier: f32) {
    let current = Rc::clone(node.borrow().children.get(current_index).unwrap());
    let diff = modifier - current.borrow().tidy.as_ref().unwrap().modifier_extreme_right - current.borrow().tidy.as_ref().unwrap().modifier_to_subtree;
    let current_tidy_extreme_left_tidy = Rc::clone(current.borrow().tidy.as_ref().unwrap().extreme_left.upgrade().as_ref().unwrap());
    current_tidy_extreme_left_tidy.borrow_mut().tidy.as_mut().unwrap().thread_right = Rc::downgrade(&target.unwrap());
    current_tidy_extreme_left_tidy.borrow_mut().tidy.as_mut().unwrap().modifier_thread_right = diff;

    let prev_node = Rc::clone(node.borrow().children.get(current_index - 1).unwrap());
    let prev_tidy = &prev_node.borrow().tidy;
    current.borrow_mut().tidy.as_mut().unwrap().extreme_right = Weak::clone(&prev_tidy.as_ref().unwrap().extreme_right);
    let modifier_extreme_right = prev_node.borrow().tidy.as_ref().unwrap().modifier_extreme_right + prev_node.borrow().tidy.as_ref().unwrap().modifier_to_subtree - current.borrow().tidy.as_ref().unwrap().modifier_to_subtree;
    current.borrow_mut().tidy.as_mut().unwrap().modifier_extreme_right = modifier_extreme_right;
}

pub fn move_subtree(node: Rc<RefCell<Node>>, current_index: usize, from_index: usize, distance: f32) {
    let child = Rc::clone(node.borrow().children.get(current_index).unwrap());
    let child_tidy_opt = &mut child.borrow_mut().tidy;
    let child_tidy = child_tidy_opt.as_mut().unwrap();
    child_tidy.modifier_to_subtree += distance;

    // distribute extra space to nodes between from_index to current_index
    if from_index != current_index - 1 {
        let index_diff = current_index - from_index;
        let node_child_from = Rc::clone(node.borrow().children.get(from_index + 1).unwrap());
        child_tidy.shift_acceleration -= distance / index_diff as f32;
        child_tidy.shift_change -= distance - distance / index_diff as f32;
        node_child_from.borrow_mut().tidy.as_mut().unwrap().shift_acceleration += distance / index_diff as f32;
    }
}

pub fn calculate_line_pos(root: Option<Rc<RefCell<Node>>>, line_linked_list: &mut Vec<(f32, f32, f32, f32, f32, i32)>, line_width: f32, v_space: f32) {
    bfs_traverse_tree(root, |node| {
        if is_leaf(Rc::clone(&node)) {
            return;
        }

        // create line node
        let children_len = node.borrow().children.len();

        if children_len <= 0 {
            return;
        }

        let first_child = Rc::clone(node.borrow().children.first().unwrap());
        let first_child_x = first_child.borrow().x;
        let first_child_y = first_child.borrow().y;
        let first_child_w = first_child.borrow().width;

        let last_node = Rc::clone(node.borrow().children.last().unwrap());
        let last_node_x = last_node.borrow().x;
        let last_node_w = last_node.borrow().width;

        // node info
        let node_x = node.borrow().x;
        let node_y = node.borrow().y;
        let node_w = node.borrow().width;
        let node_h = node.borrow().height;

        // case one: one parent has one child
        if children_len == 1 {
            let x = node_x + (node_w - line_width) / 2.0;
            let y = node_y + node_h;
            let w = line_width;
            let h = first_child_y - y;
            line_linked_list.push((x, y, w, h, line_width, LineType::LINE as i32));
        } else {
            // case two: one parent has multi children
            // get the mid pos of a card
            let start = first_child_x + (first_child_w - line_width) / 2.0;
            let end = last_node_x + (last_node_w - line_width) / 2.0;

            // update line info
            let x = start;
            let h = (v_space + line_width) / 2.0;
            let y = first_child_y - h;
            let w = end - start;
            line_linked_list.push((x, y, w, h, line_width, LineType::Square as i32));

            // case three: parent to category line
            let x = node_x + (node_w - line_width) / 2.0;
            let y = node_y + node_h;
            let w = line_width;
            let h = first_child_y - y - (v_space + line_width) / 2.0;
            line_linked_list.push((x, y, w, h, line_width, LineType::LINE as i32));

            // case four: parent to node line
            for i in 1..(children_len - 1) {
                let child = &node.borrow().children[i];
                let child_x = child.borrow().x;
                let child_y = child.borrow().y;
                let child_w = child.borrow().width;
                let x = child_x + (child_w - line_width) / 2.0;
                let y = child_y - (v_space + line_width) / 2.0;
                let w = line_width;
                let h = (v_space + line_width) / 2.0;
                line_linked_list.push((x, y, w, h, line_width, LineType::LINE as i32));
            }
        }
    })
}