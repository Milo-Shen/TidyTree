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

function separate(node: Node, child_index: number, pos_y_list: LinkedYList): LinkedYList {
  let left = new Contour(false, node.children[child_index - 1]);
  let right = new Contour(true, node.children[child_index]);

  while (!left.is_none() && !right.is_none()) {
    let y_list_bottom = pos_y_list.bottom();
    if (left.bottom() > y_list_bottom) {
      let bottom = y_list_bottom;
      let top = pos_y_list.pop();
    }
  }

  return pos_y_list;
}

function position_root(node: Node) {}

export { set_extreme, separate, position_root };
