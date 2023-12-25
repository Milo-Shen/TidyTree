// Import Classes, Interfaces, Type
import { Node } from "./Node";
import { LineNode, LineType } from "./Line";
import { LayoutMode } from "./TidyTreeType";

// Import DoublyLinkedList
import { DoublyLinkedList } from "./DoublyLinkedList";

// Import Utils
import { bfs_traverse_tree, post_order_traverse_tree, pre_order_traverse_tree, is_leaf } from "./TreeUtils";

// todo: remove this later
export const chartRenderDefaultData = { card_list: [], line_list: [] };

class TidyTree {
  root?: Node;
  h_space: number;
  v_space: number;
  layout_mode: LayoutMode;
  map: Map<string, Node>;
  node_linked_list: DoublyLinkedList<Node>;
  line_list: Array<LineNode>;
  line_width: number;

  constructor(
    root?: Node,
    layout_mode: LayoutMode = LayoutMode.Basic,
    h_space: number = 10,
    v_space: number = 40,
    line_width: number = 2
  ) {
    this.root = root;
    this.layout_mode = layout_mode;
    this.map = new Map();
    this.h_space = h_space;
    this.v_space = v_space;
    this.node_linked_list = new DoublyLinkedList();
    this.line_list = [];
    this.line_width = line_width;
  }

  initialize_tree_from_raw_data(node_list: Array<any>) {
    let node_list_len = node_list.length;
    if (!node_list || node_list_len === 0) {
      return;
    }

    // build card node map
    for (let i = 0; i < node_list_len; i++) {
      let { id, width, height } = node_list[i];
      let node = new Node(id, width, height);
      this.map.set(id, node);

      // add node to linked list
      this.node_linked_list.push(node);
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
    let min_x = Infinity;

    post_order_traverse_tree(this.root, (node) => {
      node.bounding_box_w = node.width;

      const children_len = node.children.length;
      if (children_len === 0) {
        return;
      }

      let temp_x = 0;

      for (let child of node.children) {
        child.relative_x = temp_x + child.bounding_box_w / 2;
        child.relative_y = node.height + this.v_space;
        temp_x += child.bounding_box_w + this.h_space;
      }

      let children_w = temp_x - this.h_space;
      let shift_x = -children_w / 2;

      for (let child of node.children) {
        child.relative_x += shift_x;
      }

      node.bounding_box_w = Math.max(children_w, node.width);
    });

    bfs_traverse_tree(this.root, (node) => {
      if (node === this.root) {
        min_x = Math.min(min_x, node.x - node.width / 2);
        return;
      }

      node.x = node.parent!.x + node.relative_x;
      node.y = node.parent!.y + node.relative_y;

      min_x = Math.min(min_x, node.x - node.width / 2);
    });

    pre_order_traverse_tree(this.root, (node) => {
      let diff = min_x < 0 ? -min_x : 0;
      node.x = node.x - node.width / 2 + diff;
    });
  }

  calculate_line_pos(root: Node | undefined) {
    bfs_traverse_tree(root, (node) => {
      if (is_leaf(node)) {
        return;
      }

      // create line node
      let children_len = node.children.length;

      // case one: one parent has one child
      if (children_len === 1) {
        let x = node.x + (node.width - this.line_width) / 2;
        let y = node.y + node.height;
        let w = this.line_width;
        let h = this.v_space;
        let line_node = this.create_line_node(LineType.Line, x, y, w, h);
        this.line_list.push(line_node);
      } else {
        // case two: one parent has multi children
        let first = node.children[0];
        let last = node.children[node.children.length - 1];

        // get the mid pos of a card
        let start = first.x + (first.width - this.line_width) / 2;
        let end = last.x + (last.width - this.line_width) / 2;

        // update line info
        let x = start;
        let h = (this.v_space + this.line_width) / 2;
        let y = first.y - h;
        let w = end - start;
        let square_node = this.create_line_node(LineType.Square, x, y, w, h);
        this.line_list.push(square_node);

        // case three: parent to category line
        x = node.x + (node.width - this.line_width) / 2;
        y = node.y + node.height;
        w = this.line_width;
        h = (this.v_space - this.line_width) / 2;
        let p_to_c_line = this.create_line_node(LineType.Line, x, y, w, h);
        this.line_list.push(p_to_c_line);

        // case four: parent to node line
        for (let i = 1; i < node.children.length - 1; i++) {
          let child = node.children[i];
          let x = child.x + (child.width - this.line_width) / 2;
          let y = child.y - (this.v_space + this.line_width) / 2;
          let w = this.line_width;
          let h = (this.v_space + this.line_width) / 2;
          let p_to_n_line = this.create_line_node(LineType.Line, x, y, w, h);
          this.line_list.push(p_to_n_line);
        }
      }
    });

    return this.line_list;
  }

  create_line_node(type: LineType, x: number, y: number, w: number, h: number) {
    let line_node = new LineNode();
    line_node.mode = type;
    line_node.color = "#6A6D70";
    line_node.border_width = this.line_width;
    line_node.border_radius = 12;
    line_node.pos_x = x;
    line_node.pos_y = y;
    line_node.width = w;
    line_node.height = h;
    return line_node;
  }

  get_node_linked_list() {
    return this.node_linked_list;
  }
}

export { Node, TidyTree };
