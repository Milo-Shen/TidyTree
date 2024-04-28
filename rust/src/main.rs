use crate::tidy_tree::LayoutMode;
use std::time::Instant;

mod line;
mod mock_org_chart_data;
mod tidy_tree;
mod utils;
mod contour;
mod node;

fn main() {
    let start_time = Instant::now();
    let mock_data = mock_org_chart_data::mock_org_chart_data(5, 2, false, 200.0, 100.0);
    let duration = start_time.elapsed();
    println!("mock data: {:?}", duration);
    let start_time = Instant::now();
    let mut chart = tidy_tree::TidyTree::new(LayoutMode::Basic, 10.0, 40.0);
    let duration = start_time.elapsed();
    println!("init org chart: {:?}", duration);
    let start_time = Instant::now();
    chart.initialize_tree_from_raw_data(mock_data);
    chart.generate_basic_layout();
    let data = chart.get_node_linked_list();
    let duration = start_time.elapsed();
    println!("build org chart time {:?}", duration);
    let print: Vec<_> = data.iter().map(|x| (x.borrow().id, x.borrow().x, x.borrow().y)).collect();
    println!("{:#?}", print);
    println!("Hello, world!");
}
