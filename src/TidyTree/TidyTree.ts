// Import Classes, Interfaces, Type
import { Node } from "./Node";
import { LineNode, LineType } from "./Line";
import { LayoutMode } from "./TidyTreeType";

// Import DoublyLinkedList
import { DoublyLinkedList } from "./DoublyLinkedList";

// Import Layout
import { basic_layout } from "./Layout/BasicLayout";
import { tidy_layout } from "./Layout/TidyLayout";

// Import Utils
import { bfs_traverse_tree, is_leaf } from "./TreeUtils";

// todo: remove this later
export const chartRenderDefaultData = { card_list: [], line_list: [] };

class TidyConfiguration {
  // the layout mode of tidy tree
  public layout_mode: LayoutMode;
  // margin between sibling nodes
  public h_space: number;
  // margin between child and parent node
  public v_space: number;
  // set the line width between each node
  public line_width: number;
  // all siblings node will be putted on a same pos y layer
  public is_layered: boolean;
  // this is only for layered mode
  public depth_to_y: Array<number>;

  constructor(
    layout_mode = LayoutMode.Tidy,
    h_space = 10,
    v_space = 40,
    line_width = 2,
    is_layered = false,
    depth_to_y = []
  ) {
    this.layout_mode = layout_mode;
    this.h_space = h_space;
    this.v_space = v_space;
    this.line_width = line_width;
    this.is_layered = is_layered;
    this.depth_to_y = depth_to_y;
  }
}

class TidyTree {
  root?: Node;
  layout_mode: LayoutMode;
  map: Map<string, Node>;
  node_linked_list: DoublyLinkedList<Node>;
  // todo: node_linked_list is only in testing
  node_array_list: Array<Node>;
  line_list: Array<LineNode>;
  tidy_configuration: TidyConfiguration;

  constructor(layout_mode: LayoutMode = LayoutMode.Tidy, tidy_configuration = new TidyConfiguration()) {
    this.root = undefined;
    this.layout_mode = layout_mode;
    this.map = new Map();
    // todo: node_array_list is only in testing
    this.node_array_list = [];
    this.node_linked_list = new DoublyLinkedList();
    this.line_list = [];
    this.tidy_configuration = tidy_configuration;
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
      // todo: node_array_list is only in testing
      this.node_array_list.push(node);
    }

    // establish relationship between nodes
    for (let i = 0; i < node_list_len; i++) {
      let { id, children } = node_list[i];
      let node = this.map.get(id)!;

      for (let j = 0; j < children.length; j++) {
        let child = this.map.get(children[j])!;
        child.parent = node;
        child.index = j;
        node.children.push(child!);
      }
    }

    this.root = this.map.get(node_list[0].id);
  }

  generate_layout() {
    if (this.layout_mode === LayoutMode.Basic) {
      basic_layout(this.root!, this.tidy_configuration.v_space, this.tidy_configuration.h_space);
      return;
    }

    if (this.layout_mode === LayoutMode.Tidy) {
      tidy_layout(
        this.root!,
        this.tidy_configuration.v_space,
        this.tidy_configuration.h_space,
        this.tidy_configuration.is_layered,
        this.tidy_configuration.depth_to_y
      );
    }
  }

  generate_basic_layout() {
    basic_layout(this.root!, this.tidy_configuration.v_space, this.tidy_configuration.h_space);
  }

  generate_tidy_layout() {
    tidy_layout(
      this.root!,
      this.tidy_configuration.v_space,
      this.tidy_configuration.h_space,
      this.tidy_configuration.is_layered,
      this.tidy_configuration.depth_to_y
    );
  }

  calculate_line_pos(root: Node | undefined) {
    bfs_traverse_tree(root, (node) => {
      if (is_leaf(node)) {
        return;
      }

      // create line node
      let children_len = node.children.length;

      if (children_len <= 0) {
        return;
      }

      let child_y = node.children[0].y;
      // case one: one parent has one child
      if (children_len === 1) {
        let x = node.x + (node.width - this.tidy_configuration.line_width) / 2;
        let y = node.y + node.height;
        let w = this.tidy_configuration.line_width;
        let h = child_y - y;
        let line_node = this.create_line_node(LineType.Line, x, y, w, h);
        this.line_list.push(line_node);
      } else {
        // case two: one parent has multi children
        let first = node.children[0];
        let last = node.children[node.children.length - 1];

        // get the mid pos of a card
        let start = first.x + (first.width - this.tidy_configuration.line_width) / 2;
        let end = last.x + (last.width - this.tidy_configuration.line_width) / 2;

        // update line info
        let x = start;
        let h = (this.tidy_configuration.v_space + this.tidy_configuration.line_width) / 2;
        let y = first.y - h;
        let w = end - start;
        let square_node = this.create_line_node(LineType.Square, x, y, w, h);
        this.line_list.push(square_node);

        // case three: parent to category line
        x = node.x + (node.width - this.tidy_configuration.line_width) / 2;
        y = node.y + node.height;
        w = this.tidy_configuration.line_width;
        // h = (this.tidy_configuration.v_space - this.line_width) / 2;
        h = child_y - y - (this.tidy_configuration.v_space + this.tidy_configuration.line_width) / 2;
        let p_to_c_line = this.create_line_node(LineType.Line, x, y, w, h);
        this.line_list.push(p_to_c_line);

        // case four: parent to node line
        for (let i = 1; i < node.children.length - 1; i++) {
          let child = node.children[i];
          let x = child.x + (child.width - this.tidy_configuration.line_width) / 2;
          let y = child.y - (this.tidy_configuration.v_space + this.tidy_configuration.line_width) / 2;
          let w = this.tidy_configuration.line_width;
          let h = (this.tidy_configuration.v_space + this.tidy_configuration.line_width) / 2;
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
    line_node.border_width = this.tidy_configuration.line_width;
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

  // todo: node_array_list is only for testing
  get_node_array_list() {
    return this.node_array_list;
  }
}

export { Node, TidyTree, TidyConfiguration };
