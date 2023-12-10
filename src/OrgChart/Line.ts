export enum LineType {
  Line = "Line",
  Square = "Square",
}

export class LineNode {
  pos_x: number;
  pos_y: number;
  width: number;
  height: number;
  border_width: number;
  border_radius: number;
  color: string;
  mode: LineType;

  constructor(
    x = -Infinity,
    y = Infinity,
    w = 0,
    h = 0,
    mode = LineType.Line,
    color = "#6A6D70",
    border_width = 0,
    border_radius = 0
  ) {
    this.pos_x = x;
    this.pos_y = y;
    this.width = w;
    this.height = h;
    this.mode = mode;
    this.color = color;
    this.border_width = border_width;
    this.border_radius = border_radius;
  }
}
