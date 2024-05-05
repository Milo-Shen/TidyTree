// use local types
use crate::tidy_tree::{TidyConfiguration, TidyTree};
use crate::layout::tidy_layout_utils::{init_node, set_pos_y_of_nodes};

impl TidyTree {
    pub fn generate_tidy_layout(&mut self) {
        // reset the status of each node
        init_node(self.root.clone());

        // set pos_y of nodes
        let TidyConfiguration { v_space, is_layered, .. } = &self.tidy_configuration;
        set_pos_y_of_nodes(self.root.clone(), *v_space, *is_layered, &mut self.tidy_configuration.depth_to_y);

        // first walk
    }
}
