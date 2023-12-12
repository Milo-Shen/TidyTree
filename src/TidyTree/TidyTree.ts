// Import Classes, Interfaces, Type
import { Node } from "./Node";
import { LineNode } from "./Line";
import { LayoutMode } from "./TidyTreeType";

// Import DoublyLinkedList
import { DoublyLinkedList } from "./DoublyLinkedList";

// Import Utils
import { bfs_traverse_tree, post_order_traverse_tree, pre_order_traverse_tree } from "./TreeUtils";

// todo: remove this later
export const chartRenderDefaultData = { card_list: [], line_list: [] };

class TidyTree {
  root?: Node;
  h_space: number;
  v_space: number;
  layout_mode: LayoutMode;
  map: Map<string, Node>;
  node_linked_list: DoublyLinkedList<Node>;

  constructor(root?: Node, layout_mode: LayoutMode = LayoutMode.Basic, h_space: number = 10, v_space: number = 40) {
    this.root = root;
    this.layout_mode = layout_mode;
    this.map = new Map();
    this.h_space = h_space;
    this.v_space = v_space;
    this.node_linked_list = new DoublyLinkedList();
  }

  initialize_tree_from_raw_data(node_list: Array<any>) {
    let node_list_len = node_list.length;
    if (!node_list || node_list_len === 0) {
      return;
    }

    // build card node map
    for (let i = 0; i < node_list_len; i++) {
      let { id, width, height } = node_list[i];
      this.map.set(id, new Node(id, width, height));
    }

    // establish relationship between nodes
    for (let i = 0; i < node_list_len; i++) {
      let { id, children } = node_list[i];
      let node = this.map.get(id)!;

      for (let j = 0; j < children.length; j++) {
        let child = this.map.get(children[j])!;
        child.parent = node;
        node.children.push(child!);
      }
    }

    this.root = this.map.get(node_list[0].id);
  }

  generate_basic_layout() {
    bfs_traverse_tree(this.root, (node) => {
      if (node === this.root) {
        return;
      }

      node.y = node.parent!.y + node.parent!.height + this.v_space;
    });

    post_order_traverse_tree(this.root, (node) => {
      const children_len = node.children.length;
      if (children_len === 0) {
        node.bounding_box_w = node.width;
        node.bounding_box_h = node.height;
        return;
      }

      const children_w = node.children.reduce((w, n) => w + n.width + this.h_space, -this.h_space);
      node.bounding_box_w = Math.max(node.width, children_w);

      let relative_x = (node.width - children_w) / 2;
      for (const child of node.children) {
        child.relative_x = relative_x + child.bounding_box_w / 2 - child.width / 2;
        relative_x += child.bounding_box_w + this.h_space;
      }
    });

    pre_order_traverse_tree(this.root, (node) => {
      if (node === this.root) {
        return;
      }

      node.x = node.parent!.x + node.relative_x;
    });
  }

  get_node_list() {
    let result: Array<Node> = [];

    bfs_traverse_tree(this.root, (node) => {
      result.push(node);
    });

    return result;
  }
}

export { Node, TidyTree };
