// Import React Framework
import React from "react";

// Import CSS
import UI5CardStyle from "./UI5Card.module.css";

export interface UI5CardInterface {
  avatar: string;
  position?: string;
  total_subordinate: number;
  actual_subordinate: number;
}

function UI5Card(props: any) {
  const { name, parent_id, width, height, pos_x, pos_y } = props;
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${pos_x}px`,
        top: `${pos_y}px`,
      }}
      className={UI5CardStyle.simple_org_chart}
    >
      id: {name}
      <br />
      parent: {parent_id}
    </div>
  );
}

export default UI5Card;
