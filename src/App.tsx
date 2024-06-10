// Import React Framework
import React, { useEffect, useRef, useState, useMemo } from "react";

// Import Types & Interfaces of Tidy Tree
import { chartRenderDefaultData, Node, TidyTree } from "./TidyTree/TidyTree";
import { LayoutMode } from "./TidyTree/TidyTreeType";
import { TidyConfiguration } from "./TidyTree/TidyTree";
import { LayoutType } from "./TidyTreeRust/tidy";

// Import Customized Component
import Chart from "./Component/Chart/Chart";
import SimpleOrgChart from "./Component/SimpleOrgChart";
import TidyComponent from "./TidyTreeRust/TidyComponent";

// Import Utils
import { mock_org_chart_data } from "./Utils/mock_org_chart_data";
import { range } from "./Utils/generate_id";

// Import WASM
import _initWasm, { Tidy as TidyWasm } from "./wasm_dist/wasm";

function App() {
  let is_fetch = useRef(false);

  let [card_list, set_card_list] = useState(chartRenderDefaultData);
  const [raw_data, set_raw_data] = useState<any>([]);

  useEffect(() => {
    if (is_fetch.current) {
      return;
    }

    (async () => {
      // create mock data
      let now = performance.now();
      // let data = mock_org_chart_data(range(1, 30), range(0, 5), true, [100, 200], [50, 100]);
      let raw_data = mock_org_chart_data(5, 2, false, 200.0, 100.0);
      console.log(`build mock data time: ${performance.now() - now} ms`);

      // build tidy data
      now = performance.now();
      let tidy_configuration = new TidyConfiguration();
      let chart = new TidyTree(LayoutMode.Tidy, tidy_configuration);
      chart.initialize_tree_from_raw_data(raw_data);
      // chart.initialize_tree_from_raw_data_with_parent(data);
      chart.generate_layout();
      let card_list = chart.get_node_linked_list();
      let line_list = chart.calculate_line_pos(chart.root);
      console.log(`process time: ${performance.now() - now} ms`);

      // set state
      set_raw_data(raw_data);
      set_card_list({ card_list: card_list, line_list: line_list } as any);
    })();

    return () => {
      is_fetch.current = true;
    };
  }, []);

  const tidyComponentMemo = useMemo(
    () => <TidyComponent rawData={raw_data} layoutType={LayoutType.Tidy} />,
    [raw_data]
  );

  return (
    <div className="App">
      <div>
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
      <div>{tidyComponentMemo}</div>
    </div>
  );
}

export default App;
