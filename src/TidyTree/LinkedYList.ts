// Import Linked List
import { DoublyLinkedListNode } from "./DoublyLinkedList";

export class LinkedYList extends DoublyLinkedListNode<number> {
  index: number;
  constructor(index: number, pos_y: number) {
    super(pos_y);
    this.index = index;
  }
}
