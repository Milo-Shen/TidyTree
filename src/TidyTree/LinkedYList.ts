export class LinkedYList {
  index: number;
  pos_y: number;
  next?: LinkedYList;

  constructor(index: number, pos_y: number, node?: LinkedYList) {
    this.index = index;
    this.pos_y = pos_y;
    this.next = node;
  }

  bottom() {
    return this.pos_y;
  }

  pop() {
    return this.next;
  }

  update(index: number, pos_y: number) {
    let node: LinkedYList = this;

    while (node.pos_y <= pos_y) {
      if (node.next) {
        node = node.next;
      } else {
        return new LinkedYList(index, pos_y);
      }
    }

    new LinkedYList(index, pos_y, node);
  }
}
