// Import Utils
import type { ReactNode } from "react";

export type NodeType<T> = DoublyLinkedListNode<T> | undefined;

class Comparator {
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

export class DoublyLinkedListNode<T> {
  value: T;
  next?: DoublyLinkedListNode<T>;
  previous?: DoublyLinkedListNode<T>;

  constructor(value: T, next?: DoublyLinkedListNode<T>, previous?: DoublyLinkedListNode<T>) {
    this.value = value;
    this.next = next;
    this.previous = previous;
  }

  to_string(callback: Function) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}

export class DoublyLinkedList<T> {
  head?: DoublyLinkedListNode<T>;
  tail?: DoublyLinkedListNode<T>;
  compare: Comparator;
  length: number;

  constructor(comparatorFunction?: Function) {
    this.head = undefined;
    this.tail = undefined;
    this.length = 0;
    this.compare = new Comparator(comparatorFunction);
  }

  static from_array<T>(values: any) {
    let linked_list = new DoublyLinkedList<T>();
    values.forEach((value: any) => linked_list.push(value));
    return linked_list;
  }

  first() {
    return this.head?.value;
  }

  last() {
    return this.tail?.value;
  }

  is_empty() {
    return !this.tail;
  }

  get_length() {
    return this.length;
  }

  unshift(value: any) {
    // update the length of linked list
    this.length++;

    // make new node to be a head.
    const new_node = new DoublyLinkedListNode(value, this.head);

    // if there is head, then it won't be head anymore.
    // therefore, make its previous reference to be new node (new head).
    // then mark the new node as head.
    if (this.head) {
      this.head.previous = new_node;
    }

    this.head = new_node;

    // if there is no tail yet let's make new node a tail.
    if (!this.tail) {
      this.tail = new_node;
    }

    return this;
  }

  push(value: any) {
    // update the length of linked list
    this.length++;

    const new_node = new DoublyLinkedListNode<T>(value);

    // if there is no head yet let's make new node a head.
    if (!this.head) {
      this.head = new_node;
      this.tail = new_node;
      return this;
    }

    // attach new node to the end of linked list.
    this.tail!.next = new_node;

    // attach current tail to the new node's previous reference.
    new_node.previous = this.tail;

    // set new node to be the tail of linked list.
    this.tail = new_node;

    return this;
  }

  delete(value: any) {
    if (!this.head) {
      return undefined;
    }

    let deleted_node = undefined;
    let current_node: NodeType<T> = this.head;

    while (current_node) {
      if (this.compare.equal(current_node.value as number, value)) {
        deleted_node = current_node;

        if (deleted_node === this.head) {
          // if head is going to be deleted...

          // set head to second node, which will become new head.
          this.head = deleted_node.next;

          // Set new head's previous to undefined.
          if (this.head) {
            this.head.previous = undefined;
          }

          // If all the nodes in list has same value that is passed as argument
          // then all nodes will get deleted, therefore tail needs to be updated.
          if (deleted_node === this.tail) {
            this.tail = undefined;
          }
        } else if (deleted_node === this.tail) {
          // if tail is going to be deleted...
          // set tail to second last node, which will become new tail.
          this.tail = deleted_node.previous;
          this.tail!.next = undefined;
        } else {
          // if middle node is going to be deleted...
          const previous_node = deleted_node.previous;
          const next_node = deleted_node.next;

          previous_node!.next = next_node;
          next_node!.previous = previous_node;
        }

        // update the length of linked list
        this.length--;
      }

      current_node = current_node.next;
    }

    return deleted_node?.value;
  }

  find(value = undefined, callback: Function) {
    if (!this.head) {
      return undefined;
    }

    let current_node: NodeType<T> = this.head;

    while (current_node) {
      // if callback is specified then try to find node by callback.
      if (callback && callback(current_node.value)) {
        return current_node?.value;
      }

      // if value is specified then try to compare by value...
      if (value !== undefined && this.compare.equal(current_node.value as number, value)) {
        return current_node?.value;
      }

      current_node = current_node.next;
    }

    return undefined;
  }

  pop() {
    if (!this.tail) {
      // No tail to delete.
      return undefined;
    }

    if (this.head === this.tail) {
      // There is only one node in linked list.
      const deleted_tail = this.tail;
      this.head = undefined;
      this.tail = undefined;

      // update the length of linked list
      this.length--;
      return deleted_tail?.value;
    }

    // If there are many nodes in linked list...
    const deleted_tail = this.tail;

    this.tail = this.tail.previous;
    this.tail!.next = undefined;

    // update the length of linked list
    this.length--;
    return deleted_tail?.value;
  }

  shift() {
    if (!this.head) {
      return undefined;
    }

    const deleted_head = this.head;

    if (this.head.next) {
      this.head = this.head.next;
      this.head.previous = undefined;
    } else {
      this.head = undefined;
      this.tail = undefined;
    }

    // update the length of linked list
    this.length--;

    return deleted_head?.value;
  }

  to_array() {
    const nodes = [];

    let current_node = this.head;

    while (current_node) {
      nodes.push(current_node);
      current_node = current_node.next;
    }

    return nodes;
  }

  to_string(callback: Function) {
    return this.to_array()
      .map(node => node.to_string(callback))
      .toString();
  }

  reverse() {
    let curr_node = this.head;
    let prev_node = undefined;
    let next_node = undefined;

    while (curr_node) {
      // store next node.
      next_node = curr_node.next;
      prev_node = curr_node.previous;

      // change next node of the current node, so it would link to previous node.
      curr_node.next = prev_node;
      curr_node.previous = next_node;

      // move prev_node and curr_node nodes one step forward.
      prev_node = curr_node;
      curr_node = next_node;
    }

    // reset head and tail.
    this.tail = this.head;
    this.head = prev_node;

    return this;
  }

  map(callback: (card: T) => ReactNode): ReactNode {
    // todo: to enhance the performance
    let result: ReactNode[] = [];

    let p = this.head;

    while (p && p.value) {
      result.push(callback(p.value as T));
      p = p.next;
    }

    return result;
  }

  for_each(callback: (card: T) => void) {
    let p = this.head;

    while (p && p.value) {
      callback(p.value as T);
      p = p.next;
    }
  }
}
