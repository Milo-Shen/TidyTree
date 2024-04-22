// Import React Framework
import React, { useEffect, useRef, useState } from "react";

// Import Types & Interfaces & Tidy Tree
import { chartRenderDefaultData, Node, TidyTree } from "./TidyTree/TidyTree";
import { LayoutMode } from "./TidyTree/TidyTreeType";

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
    // let data = mock_org_chart_data(range(1, 10), range(0, 3), true, [100, 200], [50, 100]);
    let data = [
      { id: "id=0", children: ["id=1"], width: 113, height: 84 },
      { id: "id=1", children: ["id=2", "id=3", "id=4"], width: 191, height: 57 },
      { id: "id=2", children: ["id=5"], width: 146, height: 63 },
      { id: "id=3", children: ["id=6"], width: 149, height: 64 },
      { id: "id=4", children: ["id=7"], width: 185, height: 72 },
      { id: "id=5", children: [], width: 137, height: 74 },
      { id: "id=6", children: [], width: 141, height: 79 },
      { id: "id=7", children: [], width: 194, height: 78 },
    ];
    console.log(JSON.stringify(data));
    console.log(`build mock data time: ${performance.now() - now} ms`);
    now = performance.now();
    let chart1 = new TidyTree(LayoutMode.Tidy, 10, 40, 2, false);
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
