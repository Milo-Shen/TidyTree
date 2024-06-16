// Import React Framework
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useRef, useState, useCallback } from "react"

// Import Types & Interfaces of Tidy Tree
import type { Node } from "../../TidyTree/Node"
import { chartRenderDefaultData } from "../../TidyTree/TidyTree"
import { LayoutType, TidyLayout } from "../../TidyTreeRust/tidy"

// Import Customized Component
import Chart from "../../Component/Chart/Chart"
import SimpleOrgChart from "../../Component/SimpleOrgChart"

// Import Utils
import { mock_org_chart_data } from "../../utils/mock_org_chart_data"

export default function RandomCardViewPage() {
  // ref hook
  const layoutRef = useRef<TidyLayout>()

  // state hook
  let [card_rust_list, set_rust_card_list] = useState(chartRenderDefaultData)
  const fetchCards = useCallback(async () => {
    // create mock data
    let now = performance.now()
    let raw_data = mock_org_chart_data(20, 3, true, [100, 200], [50, 100])
    console.log(`build mock data time: ${performance.now() - now} ms`)

    // rust data
    now = performance.now()
    layoutRef.current!.load_data(raw_data)
    let rust_data = layoutRef.current!.layout()
    let rust_consume = performance.now() - now
    console.log(`Rust data time: ${rust_consume} ms`)

    // set state
    set_rust_card_list({
      card_list: rust_data.node_list,
      line_list: rust_data.line_list,
    } as any)
  }, [])

  useEffect(() => {
    ;(async () => {
      layoutRef.current = await TidyLayout.create(LayoutType.Tidy)
      await fetchCards()
    })()

    return () => {
      console.log("clean")
      layoutRef.current?.dispose()
      layoutRef.current = undefined
    }
  }, [fetchCards])

  return (
    <Chart
      data={card_rust_list}
      card_template={(card: Node) => (
        <SimpleOrgChart
          onClick={(a: any) => console.log(a)}
          key={card.id}
          id={card.id}
          parent_id={card.parent?.id}
          width={card.width}
          height={card.height}
          pos_x={card.x}
          pos_y={card.y}
          child_count={-1}
        />
      )}
    />
  )
}
