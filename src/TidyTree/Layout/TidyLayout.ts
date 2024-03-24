// Import Classes, Interfaces, Type
import { Node } from "../Node";
import { LinkedYList } from "../LinkedYList";

// Import Utils
import {
  bfs_traverse_tree,
  bfs_traverse_tree_with_depth,
  pre_order_traverse_tree,
  pre_order_traverse_tree_with_depth,
} from "../TreeUtils";
import { set_extreme, separate, position_root, add_child_spacing, adjust_node_position } from "./TidyLayoutUtils";

function tidy_layout(root: Node, v_space: number, h_space: number, is_layered: boolean, depth_to_y: Array<number>) {
  let min_x = { value: Infinity };

  // reset the status of each node
  init_node(root);

  // set pos_y of nodes
  set_pos_y_of_nodes(root, v_space, is_layered, depth_to_y);

  // first walk
  first_walk(root, h_space);

  // second walk
  // second_walk(root, 0, min_x);

  // adjust the position of orgchart
  let diff = min_x.value < 0 ? -min_x.value : 0;
  // adjust_node_position(root, diff);
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

function first_walk(node: Node, h_space: number) {
  // empty children
  if (!node.children.length) {
    set_extreme(node);
    return;
  }

  // todo: enhance the performance here
  first_walk(node.children[0], h_space);

  let extreme_right_bottom = node.children[0].tidy!.extreme_right!.bottom();
  let pos_y_list = new LinkedYList(0, extreme_right_bottom);

  for (let i = 1; i < node.children.length; i++) {
    let child = node.children[i];
    first_walk(child, h_space);
    let max_y = child.tidy!.extreme_left!.bottom();
    pos_y_list = separate(node, i, pos_y_list, h_space);
    pos_y_list = pos_y_list.update(i, max_y);
  }

  position_root(node);
  set_extreme(node);
}

function second_walk(node: Node, modified_sum: number, min_x: { value: number }) {
  modified_sum += node.tidy?.modifier_to_subtree!;
  node.x = node.relative_x + modified_sum;
  min_x.value = Math.min(min_x.value, node.x - node.width / 2);
  add_child_spacing(node);

  for (let i = 0; i < node.children.length; i++) {
    second_walk(node.children[i], modified_sum, min_x);
  }
}

export { tidy_layout };
