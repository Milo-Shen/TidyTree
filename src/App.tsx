// Import React Framework
import React, { useEffect, useRef, useState } from "react";

// Import Types & Interfaces of Tidy Tree
import { chartRenderDefaultData, Node, TidyTree } from "./TidyTree/TidyTree";
import { LayoutMode } from "./TidyTree/TidyTreeType";
import { TidyConfiguration } from "./TidyTree/TidyTree";

// Import Customized Component
import Chart from "./Component/Chart/Chart";
import SimpleOrgChart from "./Component/SimpleOrgChart";

// Import Utils
import { mock_org_chart_data } from "./Utils/mock_org_chart_data";
import { range } from "./Utils/generate_id";

function App() {
  let is_fetch = useRef(false);

  let [card_list, set_card_list] = useState(chartRenderDefaultData);

  useEffect(() => {
    if (is_fetch.current) {
      return;
    }

    // create mock data
    let now = performance.now();
    let data = mock_org_chart_data(range(1, 30), range(0, 5), true, [100, 200], [50, 100]);
    // let data = mock_org_chart_data(5, 2, false, 200.0, 100.0);
    console.log(`build mock data time: ${performance.now() - now} ms`);

    // build tidy data
    now = performance.now();
    let tidy_configuration = new TidyConfiguration();
    let chart = new TidyTree(LayoutMode.Tidy, tidy_configuration);
    // chart.initialize_tree_from_raw_data(data);
    chart.initialize_tree_from_raw_data_with_parent(data);
    chart.generate_layout();
    let card_list = chart.get_node_linked_list();
    let card_array_list = chart.get_node_array_list();
    let line_list = chart.calculate_line_pos(chart.root);
    console.log(`process time: ${performance.now() - now} ms`);

    // set to react dom
    console.log(card_array_list, line_list);
    set_card_list({ card_list: card_list, line_list: line_list } as any);

    return () => {
      is_fetch.current = true;
    };
  }, []);

  return (
    <div className="App">
      <Chart
        data={card_list}
        card_template={(card: Node) => (
          <SimpleOrgChart
            onClick={(a: any) => console.log(a)}
            key={card.id}
            id={card.id}
            parent_id={card.parent?.id}
            width={card.width}
            height={card.height}
            pos_x={card.x}
            pos_y={card.y}
            child_count={-1}
          />
        )}
      />
    </div>
  );
}

export default App;
