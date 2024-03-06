// Import Classes, Interfaces, Type
import { Node } from "../Node";

// Import Utils
import { bfs_traverse_tree, post_order_traverse_tree, pre_order_traverse_tree } from "../TreeUtils";

function tidy_layout(root: Node, v_space: number, h_space: number) {
  // reset the status of each node
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

  // set_y_recursive
}

export { tidy_layout };
