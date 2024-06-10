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
    // create mock data
    let start_time = Instant::now();
    let mock_data = mock_org_chart_data::mock_org_chart_data(15, 5, false, 200.0, 100.0);
    println!("mock data: {:?}", start_time.elapsed());

    // init basic tree time
    let start_time = Instant::now();
    let tidy_configuration = TidyConfiguration::new(10.0, 40.0, 2.0, false);
    let mut basic_chart = tidy_tree::TidyTree::new(LayoutMode::Basic, tidy_configuration);
    println!("init tree: {:?}", start_time.elapsed());

    // build basic tree time
    let start_time = Instant::now();
    basic_chart.initialize_tree_from_raw_data(mock_data);
    basic_chart.generate_layout();
    let basic_node_data = basic_chart.get_node_linked_list();
    let basic_line_data = basic_chart.get_line_linked_list();
    println!("build tree time {:?}", start_time.elapsed());
    // println!("{:#?}", basic_node_data);
    // println!("{:#?}", basic_line_data);

    println!("------------------------------------");

    // create mock data
    let start_time = Instant::now();
    let mock_data = mock_org_chart_data::mock_org_chart_data(15, 5, false, 200.0, 100.0);
    println!("mock data: {:?}", start_time.elapsed());

    // init tidy tree time
    let start_time = Instant::now();
    let tidy_configuration = TidyConfiguration::new(10.0, 40.0, 2.0, false);
    let mut tidy_chart = tidy_tree::TidyTree::new(LayoutMode::Tidy, tidy_configuration);
    println!("init tree: {:?}", start_time.elapsed());

    // build tidy tree time
    let start_time = Instant::now();
    tidy_chart.initialize_tree_from_raw_data(mock_data);
    tidy_chart.generate_layout();
    let tidy_node_data = tidy_chart.get_node_linked_list();
    let tidy_line_data = tidy_chart.get_line_linked_list();
    println!("build tree time {:?}", start_time.elapsed());
    // println!("{:#?}", tidy_node_data);
    // println!("{:#?}", tidy_line_data);

    println!("------------------------------------");
    let start_time = Instant::now();
    let tidy_configuration = TidyConfiguration::new(10.0, 40.0, 2.0, false);
    let mut tidy_chart = tidy_tree::TidyTree::new(LayoutMode::Tidy, tidy_configuration);
    let ids = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    let width = [200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0, 200.0];
    let height = [100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0];
    let parents = [-1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2];
    tidy_chart.initialize_tree_from_js_code(&ids, &width, &height, &parents);
    tidy_chart.generate_layout();
    let tidy_node_data = tidy_chart.get_node_linked_list();
    let tidy_line_data = tidy_chart.get_line_linked_list();
    println!("build tree time {:?}", start_time.elapsed());
    // println!("{:#?}", tidy_node_data);
    // println!("{:#?}", tidy_line_data);
}
