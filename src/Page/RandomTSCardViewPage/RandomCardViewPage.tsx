// Import React Framework
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState, useCallback } from "react";

// Import Types & Interfaces of Tidy Tree
import type { Node } from "../../TidyTree/Node";
import { chartRenderDefaultData, TidyConfiguration, TidyTree } from "../../TidyTree/TidyTree";

// Import Customized Component
import Chart from "../../Component/Chart/Chart";
import SimpleOrgChart from "../../Component/SimpleOrgChart";

// Import Utils
import { mock_org_chart_data } from "../../utils/mock_org_chart_data";
import { LayoutMode } from "../../TidyTree/TidyTreeType";
import { execution_time } from "../../utils/execution_time";

export default function RandomCardViewPage() {
  // state hook
  let [card_rust_list, set_rust_card_list] = useState(chartRenderDefaultData);

  const fetchCards = useCallback(async () => {
    // create mock data
    let raw_data = execution_time("build mock data time: ", () => {
      return mock_org_chart_data(20, 3, true, [100, 200], [50, 100]);
    });
    console.log(raw_data);

    // build tidy data
    let { card_list, line_list } = execution_time("JS process time: ", () => {
      let tidy_configuration = new TidyConfiguration();
      let chart = new TidyTree(LayoutMode.Tidy, tidy_configuration);
      chart.initialize_tree_from_raw_data(raw_data);
      chart.generate_layout();
      let card_list = chart.get_node_linked_list();
      let line_list = chart.calculate_line_pos(chart.root);
      return { card_list, line_list };
    });

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
      card_template={(card: Node) => {
        return (
          <SimpleOrgChart
            onClick={(a: any) => console.log(a)}
            key={card.id}
            id={card.id}
            parent_id={card.parent?.id || -1}
            width={card.width}
            height={card.height}
            pos_x={card.x}
            pos_y={card.y}
            collapse={card.collapse}
            child_count={card.children.length}
          />
        );
      }}
    />
  );
}
