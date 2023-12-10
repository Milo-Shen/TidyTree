// Import Classes, Interfaces, Type
import { LineNode, LineType } from "./Line";
import { Node } from "./Node";

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
export type ChartRenderData<T> = {
  card_list: Node<T>[] | DoublyLinkedList<Node<T>>;
  // todo: may convert line_list to linked list later
  line_list: LineNode[];
};

export enum OrgChartDirection {
  Horizontal = "Horizontal",
  Vertical = "Vertical",
}

export enum OrgChartMode {
  Compact = "Compact",
  Loose = "Loose",
}

// Export Constants
export const chartRenderDefaultData = { card_list: [], line_list: [] };

class Node<T> {
  id: string;
  content?: T;
  children: Array<Node<T>>;
  total_child_count: number;
  parent?: Node<T>;
  previous?: Node<T>;
  level?: number;
  level_previous?: Node<T>;
  level_first?: Node<T>;
  width: number;
  height: number;
  pos_x: number;
  pos_y: number;
  mode: CardNodeType;

  constructor(
    id: string,
    w: number = 0,
    h: number = 0,
    mode: CardNodeType = CardNodeType.NORMAL,
    content: T = undefined as T
  ) {
    this.id = id;
    this.children = [];
    this.parent = undefined;
    this.previous = undefined;
    this.level_previous = undefined;
    this.level_first = undefined;
    this.level = 0;
    this.width = w;
    this.height = h;
    this.pos_x = 0;
    this.pos_y = 0;
    this.content = content;
    this.mode = mode;
    this.total_child_count = 0;
  }
}

class OrgChart<T> {
  root?: Node<T>;
  previous_card?: Node<T>;
  card_map: Map<string, Node<T>>;
  most_right_map: Map<string, number>;
  traversed_nodes: DoublyLinkedList<Node<T>>;
  card_list: Array<Node<T>>;
  card_linked_list: DoublyLinkedList<Node<T>>;
  line_list: Array<LineNode>;
  line_width: number;
  line_color: string;
  line_radius: number;
  fixed_size: boolean;
  fixed_width?: number;
  fixed_height?: number;
  lite_width?: number;
  lite_height?: number;
  horizon_gap: number;
  vertical_gap: number;
  batch_column_capacity: number;
  direction?: OrgChartDirection;
  mode?: OrgChartMode;

  constructor(
    direction: OrgChartDirection = OrgChartDirection.Vertical,
    card_raw_list: Array<any>,
    // todo: typescript enhancement
    fixed_size: boolean = true,
    fixed_width?: number,
    fixed_height?: number,
    lite_width?: number,
    lite_height?: number,
    horizon_gap: number = 10,
    vertical_gap: number = 40,
    line_width: number = 1,
    line_color: string = "#6A6D70",
    line_radius: number = 0,
    batch_column_capacity: number = 6,
    mode: OrgChartMode = OrgChartMode.Compact
  ) {
    // initialization
    this.card_list = [];
    this.line_list = [];
    this.card_map = new Map();
    this.most_right_map = new Map();
    this.traversed_nodes = new DoublyLinkedList();
    this.line_width = line_width;
    this.line_color = line_color;
    this.line_radius = line_radius;
    this.fixed_size = fixed_size;
    this.fixed_width = fixed_width;
    this.fixed_height = fixed_height;
    this.lite_width = lite_width;
    this.lite_height = lite_height;
    this.horizon_gap = horizon_gap;
    this.vertical_gap = vertical_gap;
    this.card_linked_list = new DoublyLinkedList();
    this.previous_card = undefined;
    this.batch_column_capacity = batch_column_capacity;
    this.direction = direction;
    this.mode = mode;

    // process exception
    if (!card_raw_list || !card_raw_list.length) {
      return;
    }

    // create the root node
    let root_data = card_raw_list[0];
    let { id, width, height } = root_data;
    this.root = new Node<T>(id, width, height);
    this.root.pos_y = 0;

    // generate the horizon x position and lines
    // this.generate_horizon_pos_and_lines();
  }

  calculate_line_pos(root: Node<T>) {
    traverse_tree_by_level(root, (node) => {
      if (is_leaf(node)) {
        return;
      }

      // create line node
      let children_len = node.children.length;

      // case one: one parent has one child
      if (children_len === 1) {
        let x = node.pos_x + (node.width - this.line_width) / 2;
        let y = node.pos_y + node.height;
        let w = this.line_width;
        let h = this.vertical_gap;
        let line_node = this.create_line_node(LineType.Line, x, y, w, h);
        this.line_list.push(line_node);
      } else {
        // case two: one parent has multi children
        let first = node.children[0];
        let last = node.children[node.children.length - 1];

        // get the mid pos of a card
        let start = first.pos_x + (first.width - this.line_width) / 2;
        let end = last.pos_x + (last.width - this.line_width) / 2;

        // update line info
        let x = start;
        let h = (this.vertical_gap + this.line_width) / 2;
        let y = first.pos_y - h;
        let w = end - start;
        let square_node = this.create_line_node(LineType.Square, x, y, w, h);
        this.line_list.push(square_node);

        // case three: parent to category line
        x = node.pos_x + (node.width - this.line_width) / 2;
        y = node.pos_y + node.height;
        w = this.line_width;
        h = (this.vertical_gap - this.line_width) / 2;
        let p_to_c_line = this.create_line_node(LineType.Line, x, y, w, h);
        this.line_list.push(p_to_c_line);

        // case four: parent to node line
        for (let i = 1; i < node.children.length - 1; i++) {
          let child = node.children[i];
          let x = child.pos_x + (child.width - this.line_width) / 2;
          let y = child.pos_y - (this.vertical_gap + this.line_width) / 2;
          let w = this.line_width;
          let h = (this.vertical_gap + this.line_width) / 2;
          let p_to_n_line = this.create_line_node(LineType.Line, x, y, w, h);
          this.line_list.push(p_to_n_line);
        }
      }
    });
  }

  create_line_node(type: LineType, x: number, y: number, w: number, h: number) {
    let line_node = new LineNode();
    line_node.mode = type;
    line_node.color = this.line_color;
    line_node.border_width = this.line_width;
    line_node.border_radius = this.line_radius;
    line_node.pos_x = x;
    line_node.pos_y = y;
    line_node.width = w;
    line_node.height = h;
    return line_node;
  }

  get_render_data(): ChartRenderData<T> {
    // return this.card_list;
    return {
      card_list: this.card_linked_list,
      line_list: this.line_list,
    };
  }
}

export { Node, OrgChart };
