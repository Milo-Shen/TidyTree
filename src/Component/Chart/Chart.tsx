// Import React Framework
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import type { ReactNode } from "react";

// Import Interface & Types & Classes
import type { Node } from "../../TidyTree/Node";

// Import Customized Component
import Line from "../Line";

// Import CSS
import ChartStyle from "./Chart.module.css";

// Interface
interface ChartPropsInterface {
  data: any;
  card_template: (card: Node) => ReactNode;
  children?: ReactNode | ReactNode[];
}

function Chart(props: ChartPropsInterface) {
  const {
    data = {
      card_list: [],
      line_list: [],
    },
    card_template,
  } = props;

  return (
    <div className={ChartStyle.chart}>
      <>{data.card_list.map((card: any) => card_template(card))}</>
      <>
        {data.line_list.map((line: any) => (
          <Line
            key={line.id}
            width={line.width}
            height={line.height}
            pos_x={line.pos_x}
            pos_y={line.pos_y}
            mode={line.mode}
            color={line.color}
            border_width={line.border_width}
            border_radius={line.border_radius}
          />
        ))}
      </>
    </div>
  );
}

export default Chart;
