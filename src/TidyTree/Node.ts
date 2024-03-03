export class TidyInfo {
  public thread_left?: Node;
  public thread_right?: Node;
  public extreme_left?: Node;
  public extreme_right?: Node;
  public shift_acceleration: number;
  public shift_change: number;
  public modifier_to_subtree: number;
  public modifier_thread_left: number;
  public modifier_thread_right: number;
  public modifier_extreme_left: number;
  public modifier_extreme_right: number;

  constructor() {
    this.thread_left = undefined;
    this.thread_left = undefined;
    this.thread_left = undefined;
    this.thread_left = undefined;
    this.shift_acceleration = 0;
    this.shift_change = 0;
    this.modifier_to_subtree = 0;
    this.modifier_thread_left = 0;
    this.modifier_thread_right = 0;
    this.modifier_extreme_left = 0;
    this.modifier_extreme_right = 0;
  }
}

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
  tidy?: TidyInfo;

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
    this.tidy = undefined;
  }

  clone() {
    let node = new Node(this.id);
    node.width = this.width;
    node.height = this.height;
    node.x = this.x;
    node.y = this.y;
    node.relative_x = this.relative_x;
    node.relative_y = this.relative_y;
    node.bounding_box_w = this.bounding_box_w;
    node.parent = this.parent;
    node.children = this.children;
    node.tidy = this.tidy;
    return node;
  }

  set_extreme() {
    if (this.children.length) {
    }
  }
}

export class Contour {
  is_left: boolean;
  current?: Node;
  modifier_sum: number;

  constructor(is_left: boolean = false, node: Node) {
    this.is_left = is_left;
    this.current = node;
    this.modifier_sum = node.modifier_to_subtree;
  }

  left() {
    let node = this.current!;
    return this.modifier_sum + node.relative_x - node.width / 2;
  }

  right() {
    let node = this.current!;
    return this.modifier_sum + node.relative_x + node.width / 2;
  }

  bottom() {
    let node = this.current;
    if (!node) {
      return 0;
    }
    return node.y + node.height;
  }

  next() {
    if (!this.current) {
      return;
    }

    let node = this.current;

    if (this.is_left) {
      if (node.children.length) {
        this.current = node.children[0];
        this.modifier_sum += node.modifier_to_subtree;
      } else {
        this.modifier_sum += node.modifier_thread_left;
        this.current = node.thread_left;
      }
    } else if (node.children.length) {
      this.current = node.children[node.children.length - 1];
      this.modifier_sum += node.modifier_to_subtree;
    } else {
      this.modifier_sum += node.modifier_thread_right;
      this.current = node.thread_right;
    }
  }
}
