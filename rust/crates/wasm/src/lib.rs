// use third party lib
extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;
use tidy_tree::tidy_tree::TidyTree;

#[wasm_bindgen]
pub struct Tidy(TidyTree);