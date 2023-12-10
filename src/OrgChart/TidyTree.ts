// Import Classes, Interfaces, Type
import { LineNode, LineType } from "./Line";
import { Node } from "./Node";
import { Direction, LayoutMode } from "./TidyTreeType";

// Import Utils
import {
  is_even,
  is_leaf,
  is_most_left_leaf_of_a_sub_tree,
  traverse_tree_by_dfs,
  traverse_tree_by_level,
} from "./utils";
import { DoublyLinkedList } from "./DoublyLinkedList";

// Export Classes, Interfaces, Type
export type ChartRenderData = {
  card_list: Node[] | DoublyLinkedList<Node>;
  // todo: may convert line_list to linked list later
  line_list: LineNode[];
};

// Export Constants
export const chartRenderDefaultData = { card_list: [], line_list: [] };

class TidyTree {
  constructor() {}

  get_render_data(): ChartRenderData {
    // return this.card_list;
    return {
      card_list: [],
      line_list: [],
    };
  }
}

export { Node, TidyTree };
