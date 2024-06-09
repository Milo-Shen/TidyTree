// use third party lib
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
use tidy_tree::tidy_tree::{LayoutMode, TidyConfiguration, TidyTree};

#[wasm_bindgen]
pub struct Tidy(TidyTree);

#[wasm_bindgen]
pub enum WasmLayoutType {
    Basic,
    Tidy,
    LayeredTidy,
}

#[wasm_bindgen]
impl Tidy {
    pub fn with_tidy_layout(h_space: f32, v_space: f32, line_width: f32) -> Self {
        let tidy_configuration = TidyConfiguration::new(h_space, v_space, line_width, false);
        let tidy_chart = TidyTree::new(LayoutMode::Tidy, tidy_configuration);
        Tidy(tidy_chart)
    }

    pub fn initialize_tree_from_js_code(&mut self, ids: &[i32], width: &[f32], height: &[f32], parents: &[i32]) {
        self.0.initialize_tree_from_js_code(ids, width, height, parents)
    }

    pub fn generate_tidy_layout(&mut self) {
        self.0.generate_tidy_layout();
    }

    pub fn get_node_linked_list(&self) -> Vec<f32> {
        let node_linked_list = self.0.get_node_linked_list();
        let len = node_linked_list.len();
        let mut result = Vec::with_capacity(len * 5);

        for node in node_linked_list {
            result.push(node.0 as f32);
            result.push(node.1);
            result.push(node.2);
            result.push(node.3);
            result.push(node.4);
        }

        result
    }

    pub fn get_line_linked_list(&self) -> Vec<f32> {
        let line_linked_list = self.0.get_line_linked_list();
        let len = line_linked_list.len();
        let mut result = Vec::with_capacity(len * 6);

        for node in line_linked_list {
            result.push(node.0);
            result.push(node.1);
            result.push(node.2);
            result.push(node.3);
            result.push(node.4);
            result.push(node.5 as f32);
        }

        result
    }
}
