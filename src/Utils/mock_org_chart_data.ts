// Import Utils
import { generate_id, range } from "./generate_id"
import { DoublyLinkedList } from "../TidyTree/DoublyLinkedList"

export interface MockCard {
  id: number
  parent: number
  children: string[]
  width: number
  height: number
}

function build_card(
  width: number | Array<number>,
  height: number | Array<number>,
  parent: number = -1,
): MockCard {
  let _width = width instanceof Array ? range(width[0], width[1]) : width
  let _height = height instanceof Array ? range(height[0], height[1]) : height
  let id = generate_id()
  return {
    id: id,
    children: [],
    width: _width,
    height: _height,
    parent,
  }
}

export function mock_org_chart_data(
  count: number = 1,
  max_child?: number,
  is_range = false,
  width: number | Array<number> = 200,
  height: number | Array<number> = 100,
): MockCard[] {
  max_child = max_child || Math.sqrt(count)
  let result = []
  let queue = new DoublyLinkedList<any>()

  // generated leaf count
  let remain_count = count - 1

  // build the root leaf
  let root = build_card(width, height)

  result.push(root)
  queue.push(root)

  while (!queue.is_empty()) {
    let node = queue.shift()
    let children: number[] = []
    let children_count = Math.min(max_child, remain_count)
    if (is_range) {
      children_count = range(0, children_count)
    }

    for (let i = 0; i < children_count; i++) {
      let card = build_card(width, height, node.id)
      children.push(card.id)
      queue.push(card)
      result.push(card)
      remain_count--
    }

    node!.children = children

    if (remain_count <= 0) {
      return result
    }
  }

  return result
}
