// Import Classes, Interfaces, Type
import { Node, TidyInfo } from "../Node";
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
  // first_walk(root, h_space);
  first_walk_stack(root, h_space);

  // second walk
  second_walk_stack(root, 0, min_x);

  // adjust the position of orgchart
  let diff = min_x.value < 0 ? -min_x.value : 0;
  adjust_node_position(root, diff);
}

function init_node(root: Node) {
  bfs_traverse_tree(root, (node) => {
    node.x = 0;
    node.y = 0;
    node.relative_x = 0;
    node.relative_y = 0;
    node.tidy = new TidyInfo();
  });
}

function set_pos_y_of_nodes(root: Node, v_space: number, is_layered: boolean, depth_to_y: Array<number>) {
  if (!is_layered) {
    pre_order_traverse_tree(root, (node) => {
      node.y = node.parent ? (node.y = node.parent.bottom() + v_space) : 0;
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

// todo: still has issues
function first_walk_stack(root: Node, h_space: number) {
  let stack: Node[] = [];

  let cur_node: Node | undefined = root;
  while (cur_node !== undefined) {
    stack.push(cur_node);
    cur_node = cur_node.children.length ? cur_node.children[0] : undefined;
  }

  let pre = root;
  let pos_y_list_map: Map<string, LinkedYList> = new Map();
  let child_index = 1;

  while (stack.length) {
    let node = stack[stack.length - 1];

    console.log(JSON.stringify(stack.map((x) => x.id)), node.id);

    // empty children
    if (!node.children.length) {
      set_extreme(node);
      stack.pop();
      pre = node;
      continue;
    }

    if (node.children[0] === pre) {
      let extreme_right_bottom = node.children[0].tidy!.extreme_right!.bottom();
      let pos_y_list = new LinkedYList(0, extreme_right_bottom);
      pos_y_list_map.set(node.id, pos_y_list);
      child_index = 1;
    }

    if (pre.parent === node) {
      let index = node.children.indexOf(pre)!;
      if (index > 0) {
        let pos_y_list = pos_y_list_map.get(node.id);
        let max_y = pre.tidy!.extreme_left!.bottom();
        pos_y_list = separate(node, index, pos_y_list!, h_space);
        pos_y_list = pos_y_list.update(index, max_y);
      }
    }

    if (node.children[node.children.length - 1] === pre) {
      position_root(node);
      set_extreme(node);

      stack.pop();
      pre = node;

      continue;
    }

    let index = node.children.indexOf(pre)! + 1;
    let cur_node: Node | undefined = node.children[index];
    while (cur_node !== undefined) {
      stack.push(cur_node);
      cur_node = cur_node.children.length ? cur_node.children[0] : undefined;
    }

    pre = node;
  }
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

function second_walk_stack(root: Node, modified_sum: number, min_x: { value: number }) {
  pre_order_traverse_tree(root, (node) => {
    let prev_modified_sum = node.parent ? node.parent.tidy!.prev_modified_sum : modified_sum;
    let cur_modified_sum = prev_modified_sum + node.tidy?.modifier_to_subtree!;
    node.x = node.relative_x + cur_modified_sum;
    node.tidy!.prev_modified_sum = cur_modified_sum;
    min_x.value = Math.min(min_x.value, node.x - node.width / 2);
    add_child_spacing(node);
  });
}

export { tidy_layout };
