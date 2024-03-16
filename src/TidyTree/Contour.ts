import { Node } from "./Node";

export class Contour {
  is_left: boolean;
  current?: Node;
  modifier_sum: number;

  constructor(is_left: boolean = false, node?: Node) {
    this.is_left = is_left;
    this.current = node;
    this.modifier_sum = node?.tidy?.modifier_to_subtree ?? 0;
  }

  node() {
    if (!this.current) {
      throw new Error("node is not available in Contour");
    }

    return this.current;
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

  is_none() {
    return !this.current;
  }

  next() {
    let node = this.current;
    let node_tidy = node?.tidy;

    if (!node || !node_tidy) {
      return;
    }

    if (this.is_left) {
      if (node.children.length) {
        this.current = node.children[0];
        this.modifier_sum += node_tidy.modifier_to_subtree;
      } else {
        this.modifier_sum += node_tidy.modifier_thread_left;
        this.current = node_tidy.thread_left;
      }
    } else if (node.children.length) {
      this.current = node.children[node.children.length - 1];
      this.modifier_sum += node_tidy.modifier_to_subtree;
    } else {
      this.modifier_sum += node_tidy.modifier_thread_right;
      this.current = node_tidy.thread_right;
    }
  }
}
