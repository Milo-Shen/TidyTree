// use local types
use crate::tidy_tree::{TidyTree};
use crate::utils::{bfs_traverse_tree, post_order_traverse_tree, pre_order_traverse_tree};
use crate::layout::tidy_layout_utils::init_node;

impl TidyTree {
    pub fn generate_tidy_layout(&self) {
        // reset the status of each node
        init_node(self.root.clone());
    }
}
