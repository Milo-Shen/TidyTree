// Import Types, Classes and Interfaces
import { Node } from "./TidyTree";

// Import LinkedList
import { DoublyLinkedList } from "./DoublyLinkedList";

export function is_even(num: number): boolean {
  return num % 2 === 0;
}

export function is_leaf<T>(node: Node<T>) {
  return !node.children.length;
}

export function is_most_left_leaf_of_a_sub_tree<T>(node: Node<T>) {
  return node && is_leaf(node) && node.previous === undefined;
}

export function traverse_tree_by_level<T>(node: Node<T>, callback: (node: Node<T>) => void) {
  if (!node) {
    return;
  }

  let queue = DoublyLinkedList.from_array<Node<T>>([node]);

  while (!queue.is_empty()) {
    let card = queue.shift()!;
    callback(card);

    let children = card!.children;
    for (let j = 0; j < children.length; j++) {
      queue.push(children[j]);
    }
  }
}

export function traverse_tree_by_dfs<T>(root: Node<T>, callback: (node: Node<T>) => void) {
  if (!root) {
    return;
  }

  let pre = root;
  let stack = DoublyLinkedList.from_array<Node<T>>([root]);

  while (!stack.is_empty()) {
    let node = stack.last()!;
    if (!node.children.length || pre === node.children[node.children.length - 1]) {
      stack.pop();
      callback(node);
    } else {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }

    pre = node;
  }
}

export default class Comparator {
  compare: Function;

  constructor(compareFunction?: Function) {
    this.compare = compareFunction || Comparator.defaultCompareFunction;
  }

  static defaultCompareFunction(a: number, b: number) {
    if (a === b) {
      return 0;
    }

    return a < b ? -1 : 1;
  }

  equal(a: number, b: number) {
    return this.compare(a, b) === 0;
  }

  lessThan(a: number, b: number) {
    return this.compare(a, b) < 0;
  }

  greaterThan(a: number, b: number) {
    return this.compare(a, b) > 0;
  }

  lessThanOrEqual(a: number, b: number) {
    return this.lessThan(a, b) || this.equal(a, b);
  }

  greaterThanOrEqual(a: number, b: number) {
    return this.greaterThan(a, b) || this.equal(a, b);
  }

  reverse() {
    const compareOriginal = this.compare;
    this.compare = (a: number, b: number) => compareOriginal(b, a);
  }
}
