// Import Types, Classes and Interfaces from Nodes
import type { Node } from "./Node";

// Import LinkedList
import { DoublyLinkedList } from "./DoublyLinkedList";

// Interface Definition
interface NodeWithDepth {
  node: Node;
  depth: number;
}

export function is_even(num: number): boolean {
  return num % 2 === 0;
}

export function is_leaf(node: Node) {
  return !node.children.length;
}

export function bfs_traverse_tree(root: Node | undefined, callback: (node: Node) => void) {
  if (!root) {
    return;
  }

  let queue = DoublyLinkedList.from_array<Node>([root]);

  while (!queue.is_empty()) {
    let card = queue.shift()!;
    callback(card);

    let children = card!.children;
    for (let i = 0; i < children.length; i++) {
      queue.push(children[i]);
    }
  }
}

export function bfs_traverse_tree_with_depth(root: Node | undefined, callback: (node: Node, depth: number) => void) {
  if (!root) {
    return;
  }

  let level = -1;
  let queue = DoublyLinkedList.from_array<Node>([root]);

  while (!queue.is_empty()) {
    let len = queue.length;
    level++;

    for (let i = 0; i < len; i++) {
      let card = queue.shift()!;
      callback(card, level);

      let children = card!.children;
      for (let j = 0; j < children.length; j++) {
        queue.push(children[j]);
      }
    }
  }
}

export function post_order_traverse_tree(root: Node | undefined, callback: (node: Node) => void) {
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

export function pre_order_traverse_tree(root: Node | undefined, callback: (node: Node) => void) {
  if (!root) {
    return;
  }

  let queue = DoublyLinkedList.from_array<Node>([root]);

  while (!queue.is_empty()) {
    let card = queue.pop()!;
    callback(card);

    let children = card!.children;
    for (let i = children.length - 1; i >= 0; i--) {
      queue.push(children[i]);
    }
  }
}

export function pre_order_traverse_tree_with_depth(
  root: Node | undefined,
  callback: (node: Node, depth: number) => void,
) {
  if (!root) {
    return;
  }

  let rootWithDepth: NodeWithDepth = { node: root, depth: 0 };
  let queue = DoublyLinkedList.from_array<NodeWithDepth>([rootWithDepth]);

  while (!queue.is_empty()) {
    let nodeWithDepth = queue.pop()!;
    callback(nodeWithDepth.node, nodeWithDepth.depth);

    let children = nodeWithDepth.node!.children;
    for (let i = children.length - 1; i >= 0; i--) {
      queue.push({ node: children[i], depth: nodeWithDepth.depth + 1 });
    }
  }
}
