// use std
use std::cell::RefCell;
use std::collections::VecDeque;
use std::rc::Rc;

//  use local types
use crate::node::Node;

mod generate_id;
pub mod mock_org_chart_data;

pub fn pre_order_traverse_tree<F>(root: Option<Rc<RefCell<Node>>>, mut callback: F)
    where
        F: FnMut(Rc<RefCell<Node>>) -> (),
{
    if root.is_none() {
        return;
    }

    let mut queue = VecDeque::from([root.unwrap()]);

    while !queue.is_empty() {
        let node = queue.pop_back().unwrap();
        callback(Rc::clone(&node));

        let child_len = node.borrow().children.len();
        for i in (0..child_len).rev() {
            queue.push_back(Rc::clone(&node.borrow().children[i]));
        }
    }
}

pub fn pre_order_traverse_tree_with_depth<F>(root: Option<Rc<RefCell<Node>>>, mut callback: F)
    where
        F: FnMut(Rc<RefCell<Node>>, usize) -> (),
{
    if root.is_none() {
        return;
    }

    let mut queue = VecDeque::from([(root.unwrap(), 0)]);

    while !queue.is_empty() {
        let (node, depth) = queue.pop_back().unwrap();
        callback(Rc::clone(&node), depth);

        let children = &node.borrow().children;
        let children_len = children.len();

        for i in (0..children_len).rev() {
            queue.push_back((Rc::clone(&children[i]), depth + 1));
        }
    }
}

pub fn post_order_traverse_tree<F>(root: Option<Rc<RefCell<Node>>>, mut callback: F)
    where
        F: FnMut(Rc<RefCell<Node>>) -> (),
{
    if root.is_none() {
        return;
    }

    let mut pre = root.unwrap();
    let mut stack = VecDeque::from([Rc::clone(&pre)]);

    while !stack.is_empty() {
        let node = Rc::clone(stack.back().unwrap());
        if node.borrow().children.is_empty() || pre.borrow().id == node.borrow().children.last().unwrap().borrow().id {
            stack.pop_back();
            callback(Rc::clone(&node));
        } else {
            let child_len = node.borrow().children.len();
            for i in (0..child_len).rev() {
                stack.push_back(Rc::clone(&node.borrow().children[i]));
            }
        }

        pre = node;
    }
}

pub fn bfs_traverse_tree<F>(root: Option<Rc<RefCell<Node>>>, mut callback: F)
    where
        F: FnMut(Rc<RefCell<Node>>) -> (),
{
    let mut queue = VecDeque::from([root.unwrap()]);

    while !queue.is_empty() {
        let node = queue.pop_front().unwrap();
        callback(Rc::clone(&node));

        for child in &node.borrow().children {
            queue.push_back(Rc::clone(child));
        }
    }
}

pub fn bfs_traverse_tree_with_depth<F>(root: Option<Rc<RefCell<Node>>>, mut callback: F)
    where
        F: FnMut(Rc<RefCell<Node>>, usize) -> (),
{
    let mut level = -1;
    let mut queue = VecDeque::from([root.unwrap()]);

    while !queue.is_empty() {
        let len = queue.len();
        level += 1;

        for _ in 0..len {
            let node = queue.pop_front().unwrap();
            callback(Rc::clone(&node), level as usize);

            for child in &node.borrow().children {
                queue.push_back(Rc::clone(child));
            }
        }
    }
}

pub fn is_leaf(node: Rc<RefCell<Node>>) -> bool {
    node.borrow().children.is_empty()
}

pub fn is_even(num: usize) -> bool {
    num % 2 == 0
}
