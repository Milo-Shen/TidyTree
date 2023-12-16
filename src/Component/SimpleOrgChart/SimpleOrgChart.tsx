// Import React Framework
import React from "react";

// Import CSS
import SimpleOrgChartStyle from "./SimpleOrgChart.module.css";

function SimpleOrgChart(props: any) {
  const { id, parent_id, width, height, pos_x, pos_y, child_count, onClick } = props;
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
      <br />
      parent: {parent_id}
      <br />
      child count: {child_count}
      <br />
    </div>
  );
}

export default SimpleOrgChart;
