// Import Classes, Interfaces, Type
import { Node } from "../Node";

// Import Utils
import {
  bfs_traverse_tree,
  bfs_traverse_tree_with_depth,
  pre_order_traverse_tree,
  pre_order_traverse_tree_with_depth,
} from "../TreeUtils";

function tidy_layout(root: Node, v_space: number, h_space: number, is_layered: boolean, depth_to_y: Array<number>) {
  // reset the status of each node
  init_node(root);

  // set pos_y of nodes
  set_pos_y_of_nodes(root, v_space, is_layered, depth_to_y);
}

function init_node(root: Node) {
  bfs_traverse_tree(root, (node) => {
    node.x = 0;
    node.y = 0;
    node.relative_x = 0;
    node.relative_y = 0;
    node.tidy = {
      extreme_left: undefined,
      extreme_right: undefined,
      shift_acceleration: 0,
      shift_change: 0,
      modifier_to_subtree: 0,
      modifier_extreme_left: 0,
      modifier_extreme_right: 0,
      thread_left: undefined,
      thread_right: undefined,
      modifier_thread_left: 0,
      modifier_thread_right: 0,
    };
  });
}

function set_pos_y_of_nodes(root: Node, v_space: number, is_layered: boolean, depth_to_y: Array<number>) {
  if (!is_layered) {
    pre_order_traverse_tree(root, (node) => {
      node.y = node.parent ? (node.y = node.bottom() + v_space) : 0;
    });
  } else {
    depth_to_y.length = 0;

    bfs_traverse_tree_with_depth(root, (node, depth) => {
      while (depth >= depth_to_y.length) {
        depth_to_y.push(0);
      }

      if (!node.parent || depth === 0) {
        node.y = 0;
        return;
      }

      let parent = node.parent;
      depth_to_y[depth] = Math.max(depth_to_y[depth], depth_to_y[depth - 1] + parent.height + v_space);
    });

    pre_order_traverse_tree_with_depth(root, (node, depth) => {
      node.y = depth_to_y[depth];
    });
  }
}

function first_walk(node: Node) {
  // empty children
  if (!node.children.length) {
    return;
  }
}

function second_walk(node: Node, modified_sum: number) {}

export { tidy_layout };
