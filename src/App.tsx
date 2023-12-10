// Import React Framework
import React, { useEffect, useRef, useState } from "react";

// Import Types & Interfaces
import { CardNode, ChartRenderData, chartRenderDefaultData, OrgChart, OrgChartDirection } from "./OrgChart/OrgChart";
import { UI5CardInterface } from "./Component/UI5Card/UI5Card";

// Import Customized Component
import Chart from "./Component/Chart/Chart";
import SimpleOrgChart from "./Component/SimpleOrgChart";

// Import Utils
import { mock_org_chart_data } from "./Utils/mock_org_chart_data";

function App() {
  let is_fetch = useRef(false);

  let [card_list, set_card_list] = useState<ChartRenderData<UI5CardInterface>>(chartRenderDefaultData);

  useEffect(() => {
    if (is_fetch.current) {
      return;
    }

    // todo: test it
    let now = performance.now();
    let data = mock_org_chart_data(~~(Math.random() * 30) + 1, ~~(Math.random() * 5) + 1, true);
    console.log(JSON.stringify(data));
    // let data = mock_org_chart_data(3000, 20, false);
    console.log(`build mock data time: ${performance.now() - now} ms`);
    now = performance.now();
    let chart = new OrgChart<UI5CardInterface>(
      OrgChartDirection.Horizontal,
      data,
      false,
      200,
      100,
      100,
      50,
      10,
      40,
      2,
      "#6A6D70",
      12,
      2
    );

    let render_data = chart.get_render_data();
    console.log(`build org chart time: ${performance.now() - now} ms`);
    set_card_list(render_data);
    console.log(chart);
    console.log(render_data);

    return () => {
      is_fetch.current = true;
    };
  }, []);

  return (
    <div className="App">
      <Chart<UI5CardInterface>
        data={card_list}
        card_template={(card: CardNode<UI5CardInterface>) => (
          <SimpleOrgChart
            onClick={(a: any) => console.log(a)}
            key={card.id}
            id={card.id}
            name={card.name}
            parent_id={card.parent?.id}
            width={card.width}
            height={card.height}
            pos_x={card.pos_x}
            pos_y={card.pos_y}
            child_count={card.total_child_count}
          />
        )}
      />
    </div>
  );
}

export default App;
