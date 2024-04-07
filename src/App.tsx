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
    // let data = mock_org_chart_data(50, 5, true, [100, 200], [50, 100]);
    let data = [
      { id: "id=0", children: ["id=1", "id=2", "id=3", "id=4"], width: 199, height: 52 },
      { id: "id=1", children: ["id=5", "id=6", "id=7"], width: 144, height: 63 },
      { id: "id=2", children: ["id=8"], width: 108, height: 57 },
      { id: "id=3", children: ["id=9"], width: 188, height: 97 },
      { id: "id=4", children: ["id=10"], width: 136, height: 83 },
      { id: "id=5", children: ["id=11", "id=12", "id=13"], width: 191, height: 89 },
      { id: "id=6", children: ["id=14", "id=15", "id=16", "id=17"], width: 173, height: 69 },
      { id: "id=7", children: ["id=18", "id=19", "id=20", "id=21", "id=22"], width: 165, height: 59 },
      { id: "id=8", children: ["id=23", "id=24"], width: 127, height: 98 },
      { id: "id=9", children: ["id=25", "id=26", "id=27", "id=28", "id=29"], width: 117, height: 86 },
      { id: "id=10", children: ["id=30"], width: 160, height: 91 },
      { id: "id=11", children: ["id=31"], width: 141, height: 55 },
      { id: "id=12", children: ["id=32", "id=33", "id=34", "id=35"], width: 191, height: 55 },
      { id: "id=13", children: ["id=36", "id=37", "id=38", "id=39"], width: 160, height: 68 },
      { id: "id=14", children: ["id=40", "id=41", "id=42", "id=43", "id=44"], width: 190, height: 86 },
      { id: "id=15", children: ["id=45"], width: 153, height: 86 },
      { id: "id=16", children: ["id=46", "id=47", "id=48", "id=49"], width: 137, height: 83 },
      { id: "id=17", children: [], width: 142, height: 86 },
      { id: "id=18", children: [], width: 165, height: 63 },
      { id: "id=19", children: [], width: 115, height: 62 },
      { id: "id=20", children: [], width: 110, height: 82 },
      { id: "id=21", children: [], width: 163, height: 62 },
      { id: "id=22", children: [], width: 115, height: 75 },
      { id: "id=23", children: [], width: 176, height: 79 },
      { id: "id=24", children: [], width: 180, height: 72 },
      { id: "id=25", children: [], width: 109, height: 63 },
      { id: "id=26", children: [], width: 156, height: 88 },
      { id: "id=27", children: [], width: 149, height: 76 },
      { id: "id=28", children: [], width: 152, height: 93 },
      { id: "id=29", children: [], width: 144, height: 85 },
      { id: "id=30", children: [], width: 117, height: 70 },
      { id: "id=31", children: [], width: 138, height: 60 },
      { id: "id=32", children: [], width: 133, height: 57 },
      { id: "id=33", children: [], width: 147, height: 97 },
      { id: "id=34", children: [], width: 184, height: 77 },
      { id: "id=35", children: [], width: 166, height: 100 },
      { id: "id=36", children: [], width: 147, height: 56 },
      { id: "id=37", children: [], width: 128, height: 77 },
      { id: "id=38", children: [], width: 178, height: 88 },
      { id: "id=39", children: [], width: 172, height: 85 },
      { id: "id=40", children: [], width: 135, height: 94 },
      { id: "id=41", children: [], width: 147, height: 83 },
      { id: "id=42", children: [], width: 149, height: 59 },
      { id: "id=43", children: [], width: 102, height: 63 },
      { id: "id=44", children: [], width: 162, height: 74 },
      { id: "id=45", children: [], width: 111, height: 100 },
      { id: "id=46", children: [], width: 149, height: 78 },
      { id: "id=47", children: [], width: 184, height: 73 },
      { id: "id=48", children: [], width: 174, height: 69 },
      { id: "id=49", children: [], width: 108, height: 68 },
    ];
    console.log(JSON.stringify(data));
    console.log(`build mock data time: ${performance.now() - now} ms`);
    now = performance.now();
    let chart1 = new TidyTree(LayoutMode.Tidy, 10, 40, 2, true);
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
