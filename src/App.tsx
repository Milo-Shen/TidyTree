// Import React Framework
import React, { useEffect, useRef, useState } from "react";

// Import Types & Interfaces
import { Node, chartRenderDefaultData, TidyTree } from "./TidyTree/TidyTree";
import { UI5CardInterface } from "./Component/UI5Card/UI5Card";

// Import Customized Component
import Chart from "./Component/Chart/Chart";
import SimpleOrgChart from "./Component/SimpleOrgChart";

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
    // let data = [
    //   { id: "id=0", name: "id=0", children: ["id=1"], width: 147, height: 171 },
    //   { id: "id=1", name: "id=1", children: ["id=2", "id=3", "id=4"], width: 161, height: 200 },
    //   { id: "id=2", name: "id=2", children: ["id=5"], width: 150, height: 164 },
    //   { id: "id=3", name: "id=3", children: ["id=6"], width: 197, height: 187 },
    //   { id: "id=4", name: "id=4", children: ["id=7", "id=8", "id=9"], width: 58, height: 67 },
    //   { id: "id=5", name: "id=5", children: ["id=10"], width: 94, height: 100 },
    //   { id: "id=6", name: "id=6", children: ["id=11", "id=12", "id=13"], width: 117, height: 154 },
    //   { id: "id=7", name: "id=7", children: ["id=14"], width: 190, height: 53 },
    //   { id: "id=8", name: "id=8", children: [], width: 163, height: 58 },
    //   { id: "id=9", name: "id=9", children: [], width: 192, height: 56 },
    //   { id: "id=10", name: "id=10", children: [], width: 110, height: 71 },
    //   { id: "id=11", name: "id=11", children: [], width: 100, height: 62 },
    //   { id: "id=12", name: "id=12", children: [], width: 132, height: 192 },
    //   { id: "id=13", name: "id=13", children: [], width: 200, height: 139 },
    //   { id: "id=14", name: "id=14", children: [], width: 122, height: 65 },
    // ];
    let data = [
      { id: "id=0", name: "id=0", children: ["id=1", "id=2", "id=3"], width: 100, height: 100 },
      { id: "id=1", name: "id=1", children: [], width: 100, height: 100 },
      { id: "id=2", name: "id=2", children: [], width: 100, height: 100 },
      { id: "id=3", name: "id=3", children: [], width: 100, height: 100 },
    ];
    // console.log(JSON.stringify(data));
    // let data = mock_org_chart_data(3000, 20, false);
    console.log(`build mock data time: ${performance.now() - now} ms`);
    now = performance.now();
    let chart = new TidyTree();
    chart.initialize_tree_from_raw_data(data);
    chart.generate_basic_layout();
    let card_list = chart.get_node_list();
    console.log(`build org chart time: ${performance.now() - now} ms`);
    console.log(card_list);
    set_card_list({ card_list: card_list, line_list: [] } as any);

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
