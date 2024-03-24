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
import { range } from "./Utils/generate_id";

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
    //   { id: "id=0", children: ["id=1", "id=2"], width: 200, height: 100 },
    //   { id: "id=1", children: ["id=4"], width: 200, height: 100 },
    //   { id: "id=2", children: ["id=5", "id=6"], width: 200, height: 100 },
    //   // { id: "id=3", children: ["id=7"], width: 200, height: 100 },
    //   { id: "id=4", children: [], width: 200, height: 100 },
    //   { id: "id=5", children: [], width: 200, height: 100 },
    //   { id: "id=6", children: [], width: 200, height: 100 },
    //   // { id: "id=7", children: [], width: 200, height: 100 },
    // ];
    let data = mock_org_chart_data(20, 5, true);
    // console.log(JSON.stringify(data));
    console.log(`build mock data time: ${performance.now() - now} ms`);
    now = performance.now();
    let chart1 = new TidyTree();
    chart1.initialize_tree_from_raw_data(data);
    chart1.generate_tidy_layout();
    // chart1.generate_basic_layout();
    let card_list = chart1.get_node_linked_list();
    let card_array_list = chart1.get_node_array_list();
    let line_list = chart1.calculate_line_pos(chart1.root);
    console.log(`build org chart time: ${performance.now() - now} ms`);
    console.log(card_array_list);
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
