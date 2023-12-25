use crate::tidy_tree::LayoutMode;
use std::time::Instant;

mod line;
mod mock_org_chart_data;
mod tidy_tree;
mod utils;

fn main() {
    let start_time = Instant::now();
    let mock_data = mock_org_chart_data::mock_org_chart_data(30, 20, false, 200.0, 200.0);
    let duration = start_time.elapsed();
    println!("mock data: {:?}", duration);
    let start_time = Instant::now();
    let mut chart = tidy_tree::TidyTree::new(LayoutMode::Basic, 0.0, 0.0);
    let duration = start_time.elapsed();
    println!("init org chart: {:?}", duration);
    let start_time = Instant::now();
    chart.initialize_tree_from_raw_data(mock_data);
    chart.generate_basic_layout();
    let duration = start_time.elapsed();
    println!("build org chart time {:?}", duration);
    let data = chart.get_node_linked_list();
    println!("{:#?}", data);
    println!("Hello, world!");
}
