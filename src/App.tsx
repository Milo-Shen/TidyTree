// Import React Framework
import React, { useEffect, useRef, useState } from "react";

// Import Types & Interfaces
import { Node, chartRenderDefaultData, TidyTree } from "./TidyTree/TidyTree";
import { UI5CardInterface } from "./Component/UI5Card/UI5Card";

// Import Customized Component
import Chart from "./Component/Chart/Chart";
import SimpleOrgChart from "./Component/SimpleOrgChart";

// Import Utils
import { mock_org_chart_data } from "./Utils/mock_org_chart_data";

function App() {
  let is_fetch = useRef(false);

  let [card_list, set_card_list] = useState(chartRenderDefaultData);

  useEffect(() => {
    if (is_fetch.current) {
      return;
    }

    // todo: test it
    let now = performance.now();
    // let data = mock_org_chart_data(~~(Math.random() * 30) + 1, ~~(Math.random() * 5) + 1, true);
    // console.log(JSON.stringify(data));
    // let data = [
    //   { id: "id=0", children: ["id=1", "id=2"], width: 108, height: 114 },
    //   { id: "id=1", children: ["id=3"], width: 63, height: 126 },
    //   { id: "id=2", children: [], width: 97, height: 136 },
    //   { id: "id=3", children: [], width: 129, height: 75 },
    // ];
    let data = mock_org_chart_data(5, 2, false);
    console.log(`build mock data time: ${performance.now() - now} ms`);
    now = performance.now();
    let chart = new TidyTree();
    chart.initialize_tree_from_raw_data(data);
    chart.generate_tidy_layout();
    chart.generate_basic_layout();
    let card_list = chart.get_node_linked_list();
    let line_list = chart.calculate_line_pos(chart.root);
    console.log(`build org chart time: ${performance.now() - now} ms`);
    console.log(card_list);
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
