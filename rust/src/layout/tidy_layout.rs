// use local types
use crate::tidy_tree::{TidyTree};
use crate::utils::{bfs_traverse_tree, post_order_traverse_tree, pre_order_traverse_tree};
use crate::layout::tidy_layout_utils::{init_node, set_pos_y_of_nodes};

impl TidyTree {
    pub fn generate_tidy_layout(&self) {
        // reset the status of each node
        init_node(self.root.clone());

        // set pos_y of nodes
        set_pos_y_of_nodes(self.root.clone());
    }
}
