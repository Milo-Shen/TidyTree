// Import Classes, Interfaces, Type
import { Node } from "../Node";

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

export { set_extreme };
