use std::time::Instant;
use crate::tidy_tree::LayoutMode;

mod line;
mod mock_org_chart_data;
mod tidy_tree;
mod utils;

fn main() {
    let start_time = Instant::now();
    let mock_data = mock_org_chart_data::mock_org_chart_data(300000, 20, false);
    let duration = start_time.elapsed();
    println!("mock data: {:?}", duration);
    let start_time = Instant::now();
    let mut chart = tidy_tree::TidyTree::new(LayoutMode::Basic, 0.0, 0.0);
    let duration = start_time.elapsed();
    println!("init org chart: {:?}", duration);
    let start_time = Instant::now();
    chart.initialize_tree_from_raw_data(mock_data);
    let duration = start_time.elapsed();
    println!("build org chart time {:?}", duration);
    // let data = chart.get_render_data();
    // println!("{:#?}", data.0);
    println!("Hello, world!");
}
