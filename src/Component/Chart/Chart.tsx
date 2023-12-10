// Import React Framework
import React, { ReactNode } from "react";

// Import Interface & Types & Classes
import { Node, ChartRenderData } from "../../OrgChart/OrgChart";

// Import Customized Component
import Line from "../Line";

// Import CSS
import ChartStyle from "./Chart.module.css";

// Interface
interface ChartPropsInterface<T> {
  data: ChartRenderData<T>;
  card_template: (card: Node<T>) => ReactNode;
  children?: ReactNode | ReactNode[];
}

function Chart<T>(props: ChartPropsInterface<T>) {
  const { data, card_template } = props;

  return (
    <div className={ChartStyle.chart}>
      <>{data.card_list.map((card) => card_template(card))}</>
      {/* todo: key of line should be identified */}
      <>
        {data.line_list.map((line, index) => (
          <Line
            key={index}
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

Chart.defaultProps = {
  card_list: [],
};

export default Chart;
