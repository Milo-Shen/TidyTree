export class LinkedYList {
  index: number;
  pos_y: number;
  next?: LinkedYList;

  constructor(index: number, pos_y: number) {
    this.index = index;
    this.pos_y = pos_y;
    this.next = undefined;
  }

  bottom() {
    return this.pos_y;
  }

  pop() {
    return this.next;
  }
}
