// use local types
use crate::layout::tidy_layout_utils::{adjust_node_position, first_walk_stack_without_recursion, init_node, second_walk_without_recursion, set_pos_y_of_nodes};
use crate::tidy_tree::{TidyConfiguration, TidyTree};

impl TidyTree {
    pub fn generate_tidy_layout(&mut self) {
        // reset the status of each node
        init_node(self.root.clone());

        // set pos_y of nodes
        let TidyConfiguration { v_space, h_space, is_layered, .. } = &self.tidy_configuration;
        let h_space = *h_space;
        set_pos_y_of_nodes(self.root.clone(), *v_space, *is_layered, &mut self.tidy_configuration.depth_to_y);

        // first walk
        first_walk_stack_without_recursion(self.root.clone(), h_space);

        // second walk
        let mut min_x = 0.0;
        second_walk_without_recursion(self.root.clone(), 0.0, &mut min_x);

        // adjust the position of orgchart
        let diff = if min_x < 0.0 { -min_x } else { 0.0 };
        adjust_node_position(self.root.clone(), diff);
    }
}
