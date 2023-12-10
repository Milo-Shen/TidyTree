// Import Types, Classes and Interfaces from Nodes
import { Node } from "./Node";

// Import LinkedList
import { DoublyLinkedList } from "./DoublyLinkedList";

export function is_even(num: number): boolean {
  return num % 2 === 0;
}

export function is_leaf(node: Node) {
  return !node.children.length;
}

export function bfs_traverse_tree(node: Node, callback: (node: Node) => void) {
  if (!node) {
    return;
  }

  let queue = DoublyLinkedList.from_array<Node>([node]);

  while (!queue.is_empty()) {
    let card = queue.shift()!;
    callback(card);

    let children = card!.children;
    for (let j = 0; j < children.length; j++) {
      queue.push(children[j]);
    }
  }
}

export function post_order_traverse_tree(root: Node, callback: (node: Node) => void) {
  if (!root) {
    return;
  }

  let pre = root;
  let stack = DoublyLinkedList.from_array<Node>([root]);

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
