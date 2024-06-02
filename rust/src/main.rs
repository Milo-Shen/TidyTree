// use rust std
use std::time::Instant;

//  use local types
use tidy_tree::{LayoutMode, TidyConfiguration};
use utils::mock_org_chart_data;

mod contour;
mod layout;
mod line;
mod node;
mod tidy_tree;
mod tidy_tree_impl;
mod utils;

fn main() {
    let start_time = Instant::now();
    let mock_data = mock_org_chart_data::mock_org_chart_data(20, 5, false, 200.0, 100.0);
    let duration = start_time.elapsed();
    println!("mock data: {:?}", duration);
    let start_time = Instant::now();
    let tidy_configuration = TidyConfiguration::new(10.0, 40.0, 2.0, false, vec![]);
    let mut chart = tidy_tree::TidyTree::new(LayoutMode::Tidy, tidy_configuration);
    let duration = start_time.elapsed();
    println!("init org chart: {:?}", duration);
    let start_time = Instant::now();
    chart.initialize_tree_from_raw_data(mock_data);
    chart.generate_tidy_layout();
    let data = chart.get_node_linked_list();
    let duration = start_time.elapsed();
    println!("build org chart time {:?}", duration);
    println!("{:#?}", data);
    println!("Hello, world!");
}
