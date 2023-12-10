export class Node {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  relative_x: number;
  relative_y: number;
  bounding_box_w: number;
  bounding_box_h: number;
  parent?: Node;
  children: Array<Node>;

  constructor(id: string, w: number = 0, h: number = 0) {
    this.id = id;
    this.width = w;
    this.height = h;
    this.x = 0;
    this.y = 0;
    this.relative_x = 0;
    this.relative_y = 0;
    this.bounding_box_w = 0;
    this.bounding_box_h = 0;
    this.parent = undefined;
    this.children = [];
  }
}
