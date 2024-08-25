// Import React Framework
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

// Import Third Party Lib
import classNames from "classnames";

// Import CSS
import LineStyle from "./Line.module.css";

// Interface & Enums
import { LineType } from "../../TidyTree/Line";

// Interface
export interface LinePropsInterface {
  width: number;
  height: number;
  pos_x: number;
  pos_y: number;
  mode: LineType;
  color: string;
  border_width: number;
  border_radius: number;
}

function Line(props: LinePropsInterface) {
  const { width, height, pos_x, pos_y, mode, color, border_width, border_radius } = props;

  let style: any = {
    width: `${width}px`,
    height: `${height}px`,
    top: `${pos_y}px`,
    left: `${pos_x}px`,
  };

  if (mode === LineType.Line) {
    style.background = color;
  } else {
    style.borderColor = color;
    style.borderWidth = border_width;
    style.borderTopLeftRadius = border_radius;
    style.borderTopRightRadius = border_radius;
  }

  return (
    <div
      className={classNames(LineStyle.basic, mode === LineType.Line ? LineStyle.line_type : LineStyle.square_type)}
      style={style}
    ></div>
  );
}

export default Line;
