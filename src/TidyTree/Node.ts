export class Node {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  relative_x: number;
  relative_y: number;
  bounding_box_w: number;
  parent?: Node;
  children: Array<Node>;
  // define the tidy info
  thread_left?: Node;
  thread_right?: Node;
  extreme_left?: Node;
  extreme_right?: Node;
  shift_acceleration: number;
  shift_change: number;
  modifier_to_subtree: number;
  modifier_thread_left: number;
  modifier_thread_right: number;
  modifier_extreme_left: number;
  modifier_extreme_right: number;

  constructor(id: string, w: number = 0, h: number = 0) {
    this.id = id;
    this.width = w;
    this.height = h;
    this.x = 0;
    this.y = 0;
    this.relative_x = 0;
    this.relative_y = 0;
    this.bounding_box_w = 0;
    this.parent = undefined;
    this.children = [];
    this.shift_acceleration = 0;
    this.shift_change = 0;
    this.modifier_to_subtree = 0;
    this.modifier_thread_left = 0;
    this.modifier_thread_right = 0;
    this.modifier_extreme_left = 0;
    this.modifier_extreme_right = 0;
  }
}
