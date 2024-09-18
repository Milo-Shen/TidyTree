// Import React Framework
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

// Import CSS
import SimpleOrgChartStyle from "./SimpleOrgChart.module.css";

function SimpleOrgChart(props: any) {
  const { id, parent_id, width, height, pos_x, pos_y, child_count, collapse, onClick } = props;
  return (
    <div
      onClick={() => {
        onClick(id);
      }}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${pos_x}px`,
        top: `${pos_y}px`,
      }}
      className={SimpleOrgChartStyle.simple_org_chart}
    >
      id: {id}
      {/*id: {id}, parent: {parent_id}*/}
      {/*<br />*/}
      {/*collapse: {String(collapse)}*/}
      {/*<br />*/}
      {/*child count: {child_count}*/}
      {/*<br />*/}
    </div>
  );
}

export default SimpleOrgChart;
