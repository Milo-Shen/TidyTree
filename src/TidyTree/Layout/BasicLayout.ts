// Import Classes, Interfaces, Type
import { Node } from "../Node";

// Import Utils
import { bfs_traverse_tree, post_order_traverse_tree } from "../TreeUtils";
import { adjust_node_position } from "./TidyLayoutUtils";

function basic_layout(root: Node, v_space: number, h_space: number) {
  let min_x = Infinity;

  post_order_traverse_tree(root, (node) => {
    node.bounding_box_w = node.width;

    const children_len = node.children.length;
    if (children_len === 0) {
      return;
    }

    let temp_x = 0;

    for (let child of node.children) {
      child.relative_x = temp_x + child.bounding_box_w / 2;
      child.relative_y = node.height + v_space;
      temp_x += child.bounding_box_w + h_space;
    }

    let children_w = temp_x - h_space;
    let shift_x = -children_w / 2;

    for (let child of node.children) {
      child.relative_x += shift_x;
    }

    node.bounding_box_w = Math.max(children_w, node.width);
  });

  bfs_traverse_tree(root, (node) => {
    if (node === root) {
      min_x = Math.min(min_x, node.x - node.width / 2);
      return;
    }

    node.x = node.parent!.x + node.relative_x;
    node.y = node.parent!.y + node.relative_y;

    min_x = Math.min(min_x, node.x - node.width / 2);
  });

  let diff = min_x < 0 ? -min_x : 0;
  adjust_node_position(root, diff);
}

export { basic_layout };
