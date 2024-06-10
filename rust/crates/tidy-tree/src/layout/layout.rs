// use local types
use crate::tidy_tree::{TidyConfiguration, TidyTree, LayoutMode};

impl TidyTree {
    pub fn generate_layout(&mut self) {
        let TidyConfiguration { v_space, h_space, is_layered, .. } = &self.tidy_configuration;
        let layout_mode = &self.layout_mode;

        match *layout_mode {
            LayoutMode::Basic => {
                self.generate_basic_layout();
            }
            LayoutMode::Tidy => {
                self.generate_tidy_layout();
            }
            _ => {}
        }
    }
}
