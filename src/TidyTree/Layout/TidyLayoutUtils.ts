// Import Classes, Interfaces, Type
import { Node } from "../Node";
import { LinkedYList } from "../LinkedYList";
import { Contour } from "../Contour";

function set_extreme(node: Node) {
  let tidy = node.tidy!;

  // leaf child
  if (!node.children.length) {
    tidy.extreme_left = node;
    tidy.extreme_right = node;
    tidy.modifier_extreme_left = 0;
    tidy.modifier_extreme_right = 0;
  } else {
    let first_tidy = node.children[0].tidy!;
    tidy.extreme_left = first_tidy.extreme_left;
    tidy.modifier_extreme_left = first_tidy.modifier_to_subtree + first_tidy.modifier_extreme_left;
    let last_tidy = node.children[node.children.length - 1].tidy!;
    tidy.extreme_right = last_tidy.extreme_right;
    tidy.modifier_extreme_right = last_tidy.modifier_to_subtree + last_tidy.modifier_extreme_right;
  }
}

function separate(node: Node, child_index: number, pos_y_list: LinkedYList, h_space: number): LinkedYList {
  // right contour of the left node
  let left = new Contour(false, node.children[child_index - 1]);
  // left contour of the right node
  let right = new Contour(true, node.children[child_index]);

  while (!left.is_none() && !right.is_none()) {
    let y_list_bottom = pos_y_list.bottom();
    if (left.bottom() > y_list_bottom) {
      let top = pos_y_list.pop();
      if (!top) {
        console.error(
          `error occurred, node id: ${node.id}, left bottom: ${left.bottom()}, y list bottom: ${y_list_bottom}`
        );
      }

      pos_y_list = top!;
    }

    let dist = left.right() - right.left() + h_space;
    if (dist > 0) {
      // left node and right node are too close. move right part with distance of dist
      right.modifier_sum += dist;
      move_subtree(node, child_index, pos_y_list.index, dist);
    }

    let left_bottom = left.bottom();
    let right_bottom = right.bottom();

    if (left_bottom <= right_bottom) {
      left.next();
    }

    if (left_bottom >= right_bottom) {
      right.next();
    }
  }

  if (left.is_none() && !right.is_none()) {
    set_left_thread(node, child_index, right.node(), right.modifier_sum);
  } else if (!left.is_none() && right.is_none()) {
    set_right_thread(node, child_index, left.node(), left.modifier_sum);
  }

  return pos_y_list;
}

function position_root(node: Node) {
  let first = node.children[0];
  let first_child_pos = first.relative_x + first.tidy!.modifier_to_subtree;
  let last = node.children[node.children.length - 1];
  let last_child_pos = last.relative_x + last.tidy!.modifier_to_subtree;
  node.relative_x = (first_child_pos + last_child_pos) / 2;
  // make modifier_to_subtree + relative_x = 0
  // there will always be collision in `separation()`'s first loop
  node.tidy!.modifier_to_subtree = -node.relative_x;
}

function move_subtree(node: Node, current_index: number, from_index: number, distance: number) {
  let child = node.children[current_index];
  let child_tidy = child.tidy!;
  child_tidy.modifier_to_subtree += distance;

  // distribute extra space to nodes between from_index to current_index
  if (from_index !== current_index - 1) {
    let index_diff = current_index - from_index;
    node.children[from_index + 1].tidy!.shift_acceleration += distance / index_diff;
    node.children[current_index].tidy!.shift_acceleration -= distance / index_diff;
    node.children[current_index].tidy!.shift_change -= distance - distance / index_diff;
  }
}

function set_left_thread(node: Node, current_index: number, target: Node, modifier: number) {
  let first = node.children[0];
  let current = node.children[current_index];
  let diff = modifier - first.tidy!.modifier_extreme_left - first.tidy!.modifier_to_subtree;

  first.tidy!.extreme_left!.tidy!.thread_left = target;
  first.tidy!.extreme_left!.tidy!.modifier_thread_left = diff;
  first.tidy!.extreme_left = current.tidy!.extreme_left;
  first.tidy!.modifier_extreme_left =
    current.tidy!.modifier_extreme_left + current.tidy!.modifier_to_subtree - first.tidy!.modifier_to_subtree;
}

function set_right_thread(node: Node, current_index: number, target: Node, modifier: number) {
  let current = node.children[current_index];

  let diff = modifier - current.tidy!.modifier_extreme_right - current.tidy!.modifier_to_subtree;
  current.tidy!.extreme_left!.tidy!.thread_right = target;
  current.tidy!.extreme_left!.tidy!.modifier_thread_right = diff;

  let prev = node.children[current_index - 1].tidy!;
  current.tidy!.extreme_right = prev.extreme_right;
  current.tidy!.modifier_extreme_right =
    prev.modifier_extreme_right + prev.modifier_to_subtree - current.tidy!.modifier_to_subtree;
}

function add_child_spacing(node: Node) {
  let speed = 0;
  let delta = 0;

  for (let i = 0; i < node.children.length; i++) {
    let child = node.children[i];
    speed += child.tidy!.shift_acceleration;
    delta += speed + child.tidy!.shift_change;
    child.tidy!.modifier_to_subtree += delta;
    child.tidy!.shift_acceleration = 0;
    child.tidy!.shift_change = 0;
  }
}

export { set_extreme, separate, position_root, add_child_spacing };
