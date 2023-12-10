// Import Classes, Interfaces, Type
import { Node } from "./Node";
import { LineNode } from "./Line";
import { LayoutMode } from "./TidyTreeType";

// Import Utils
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
  root?: Node;
  layout_mode: LayoutMode;
  map: Map<string, string>;
  h_space: number;
  v_space: number;

  constructor(root?: Node, layout_mode: LayoutMode = LayoutMode.Basic, h_space: number = 10, v_space: number = 40) {
    this.root = root;
    this.layout_mode = layout_mode;
    this.map = new Map();
    this.h_space = h_space;
    this.v_space = v_space;
  }

  generate_tree_from_raw_data<T>(node_list: T) {}

  get_render_data(): ChartRenderData {
    // return this.card_list;
    return {
      card_list: [],
      line_list: [],
    };
  }
}

export { Node, TidyTree };
