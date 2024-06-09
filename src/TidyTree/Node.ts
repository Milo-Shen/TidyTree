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
  public prev_modified_sum: number;

  constructor() {
    this.thread_left = undefined;
    this.thread_right = undefined;
    this.extreme_left = undefined;
    this.extreme_right = undefined;
    this.shift_acceleration = 0;
    this.shift_change = 0;
    this.modifier_to_subtree = 0;
    this.modifier_thread_left = 0;
    this.modifier_thread_right = 0;
    this.modifier_extreme_left = 0;
    this.modifier_extreme_right = 0;

    // to accelerate the speed of second walk
    this.prev_modified_sum = 0;
  }
}

export class Node {
  id: number;
  width: number;
  height: number;
  x: number;
  y: number;
  index: number;
  relative_x: number;
  relative_y: number;
  bounding_box_w: number;
  parent?: Node;
  children: Array<Node>;
  tidy?: TidyInfo;

  constructor(id: number, w: number = 0, h: number = 0) {
    this.id = id;
    this.width = w;
    this.height = h;
    this.x = 0;
    this.y = 0;
    this.index = 0;
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
    node.index = this.index;
    node.relative_x = this.relative_x;
    node.relative_y = this.relative_y;
    node.bounding_box_w = this.bounding_box_w;
    node.parent = this.parent;
    node.children = this.children;
    node.tidy = this.tidy;
    return node;
  }

  depth() {
    let depth = 0;
    let node: Node = this;

    while (node.parent) {
      node = node.parent;
      depth += 1;
    }

    return depth;
  }

  bottom() {
    return this.height + this.y;
  }

  append_child(node: Node) {
    node.parent = this;
    this.children.push(node);
  }

  intersects(other: Node) {
    return (
      this.x - this.width / 2 < other.x + other.width / 2 &&
      this.x + this.width / 2 > other.x - other.width / 2 &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  remove_child(id: number) {
    let index = this.children.findIndex((x) => x.id === id);

    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }
}
