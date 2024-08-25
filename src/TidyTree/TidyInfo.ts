import { Node } from "./Node";

export class TidyInfo {
  public thread_left?: Node;
  public thread_right?: Node;
  public extreme_left?: Node;
  public extreme_right?: Node;
  public shift_acceleration: number;
  public shift_change: number;
  public modifier_to_subtree: number;
  public modifier_thread_left: number;
  public modifier_thread_right: number;
  public modifier_extreme_left: number;
  public modifier_extreme_right: number;
  public prev_modified_sum: number;

  constructor() {
    this.thread_left = undefined;
    this.thread_right = undefined;
    this.extreme_left = undefined;
    this.extreme_right = undefined;
    this.shift_acceleration = 0;
    this.shift_change = 0;
    this.modifier_to_subtree = 0;
    this.modifier_thread_left = 0;
    this.modifier_thread_right = 0;
    this.modifier_extreme_left = 0;
    this.modifier_extreme_right = 0;

    // to accelerate the speed of second walk
    this.prev_modified_sum = 0;
  }
}
