// Import React Framework
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useRef, useState, useCallback } from "react";

// Import Types & Interfaces of Tidy Tree
import type { Node } from "../../TidyTree/Node";
import { chartRenderDefaultData, TidyConfiguration, TidyTree } from "../../TidyTree/TidyTree";
import { LayoutType, TidyLayout } from "../../TidyTreeRust/tidy";

// Import Customized Component
import Chart from "../../Component/Chart/Chart";
import SimpleOrgChart from "../../Component/SimpleOrgChart";

// Import Utils
import { mock_org_chart_data } from "../../utils/mock_org_chart_data";
import { LayoutMode } from "../../TidyTree/TidyTreeType";

export default function RandomCardViewPage() {
  // state hook
  let [card_rust_list, set_rust_card_list] = useState(chartRenderDefaultData);
  const fetchCards = useCallback(async () => {
    // create mock data
    let now = performance.now();
    let raw_data = mock_org_chart_data(20, 3, true, [100, 200], [50, 100]);
    console.log(`build mock data time: ${performance.now() - now} ms`);

    // build tidy data
    let tidy_configuration = new TidyConfiguration();
    let chart = new TidyTree(LayoutMode.Tidy, tidy_configuration);
    now = performance.now();
    // chart.initialize_tree_from_raw_data(raw_data);
    chart.initialize_tree_from_raw_data_with_parent(raw_data);
    chart.generate_layout();
    let card_list = chart.get_node_linked_list();
    let line_list = chart.calculate_line_pos(chart.root);
    let js_consume = performance.now() - now;
    console.log(`JS process time: ${js_consume} ms`);
    console.log(card_list);
    console.log(line_list);

    // set state
    set_rust_card_list({
      card_list: card_list,
      line_list: line_list,
    } as any);
  }, []);

  useEffect(() => {
    (async () => {
      await fetchCards();
    })();
  }, [fetchCards]);

  return (
    <Chart
      data={card_rust_list}
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
  );
}
