// use local types
use crate::tidy_tree::TidyTree;
use crate::utils::{bfs_traverse_tree, post_order_traverse_tree, pre_order_traverse_tree};

impl TidyTree {
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
                child.borrow_mut().relative_y = node_h + self.tidy_configuration.v_space;
                temp_x += child_bounding_box_w + self.tidy_configuration.h_space;
            }

            let children_w = temp_x - self.tidy_configuration.h_space;
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
}
