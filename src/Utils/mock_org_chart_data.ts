// Import Utils
import { generate_id, range } from "./generate_id";
import { DoublyLinkedList } from "../OrgChart/DoublyLinkedList";

export interface MockCard {
  id: string;
  name: string;
  children: string[];
  width?: number;
  height?: number;
}

function build_card(): MockCard {
  let id = generate_id();
  return {
    id: id,
    name: id,
    children: [],
    width: range(50, 200),
    height: range(50, 200),
  };
}

export function mock_org_chart_data(count: number = 1, max_child?: number, is_range = false): MockCard[] {
  max_child = max_child || Math.sqrt(count);
  let result = [];
  let queue = new DoublyLinkedList<any>();

  // generated leaf count
  let remain_count = count - 1;

  // build the root leaf
  let root = build_card();

  result.push(root);
  queue.push(root);

  while (!queue.is_empty()) {
    let node = queue.shift();
    let children: string[] = [];
    let children_count = Math.min(max_child, remain_count);
    if (is_range) {
      children_count = range(0, children_count);
    }

    for (let i = 0; i < children_count; i++) {
      remain_count--;
      let card = build_card();
      children.push(card.id);
      queue.push(card);
      result.push(card);
    }

    node!.children = children;

    if (remain_count <= 0) {
      return result;
    }
  }

  return result;
}
