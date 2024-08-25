// Import Types
import type { TidyInfo } from "./TidyInfo";

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

  constructor(id: number, w: number = 0, h: number = 0, x: number = 0, y: number = 0) {
    this.id = id;
    this.width = w;
    this.height = h;
    this.x = x;
    this.y = y;
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
    let index = this.children.findIndex(x => x.id === id);

    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }
}
