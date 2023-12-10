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
  map: Map<string, Node>;
  h_space: number;
  v_space: number;

  constructor(root?: Node, layout_mode: LayoutMode = LayoutMode.Basic, h_space: number = 10, v_space: number = 40) {
    this.root = root;
    this.layout_mode = layout_mode;
    this.map = new Map();
    this.h_space = h_space;
    this.v_space = v_space;
  }

  generate_tree_from_raw_data(node_list: Array<any>) {
    let node_list_len = node_list.length;

    // build card node map
    for (let i = 1; i < node_list_len; i++) {
      let { id, width, height } = node_list[i];
      this.map.set(id, new Node(id, width, height));
    }

    // establish relationship between nodes
    for (let i = 0; i < node_list_len; i++) {
      let { id, children } = node_list[i];
      let card = this.map.get(id)!;

      for (let j = 0; j < children.length; j++) {
        let child = this.map.get(children[j])!;
        child.parent = card;
        card.children.push(child!);
      }
    }
  }

  get_render_data(): any {
    return {
      card_list: [],
      line_list: [],
    };
  }
}

export { Node, TidyTree };
