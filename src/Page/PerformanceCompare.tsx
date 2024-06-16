// Import React Framework
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useRef, useState, useCallback } from "react"

// Import Types & Interfaces of Tidy Tree
import type { Node } from "../TidyTree/Node"
import { chartRenderDefaultData, TidyTree } from "../TidyTree/TidyTree"
import { LayoutMode } from "../TidyTree/TidyTreeType"
import { TidyConfiguration } from "../TidyTree/TidyTree"
import { LayoutType, TidyLayout } from "../TidyTreeRust/tidy"

// Import Customized Component
import Chart from "../Component/Chart/Chart"
import SimpleOrgChart from "../Component/SimpleOrgChart"

// Import Utils
import { mock_org_chart_data } from "../utils/mock_org_chart_data"
import { range } from "../utils/generate_id"

// Import Styles
import "./PerformanceCompare.css"

function PerformanceCompare() {
  // ref hook
  const layoutRef = useRef<TidyLayout>()

  // state hook
  let [card_js_list, set_js_card_list] = useState(chartRenderDefaultData)
  let [card_rust_list, set_rust_card_list] = useState(chartRenderDefaultData)
  let [count, setCount] = useState(1000)
  let [max_child, set_max_child] = useState(2)
  let [improve, set_improve] = useState("0")

  const fetchCards = useCallback(async () => {
    // create mock data
    let now = performance.now()
    // let raw_data = mock_org_chart_data(range(1000, 2000), range(0, 5), true, [100, 200], [50, 100]);
    let raw_data = mock_org_chart_data(
      count,
      max_child,
      false,
      [100, 200],
      [50, 100],
    )
    console.log(`build mock data time: ${performance.now() - now} ms`)

    // build tidy data
    let tidy_configuration = new TidyConfiguration()
    let chart = new TidyTree(LayoutMode.Tidy, tidy_configuration)
    now = performance.now()
    // chart.initialize_tree_from_raw_data(raw_data);
    chart.initialize_tree_from_raw_data_with_parent(raw_data)
    chart.generate_layout()
    let card_list = chart.get_node_linked_list()
    let line_list = chart.calculate_line_pos(chart.root)
    let js_consume = performance.now() - now
    console.log(`JS process time: ${js_consume} ms`)

    // rust data
    now = performance.now()
    layoutRef.current!.load_data(raw_data)
    let rust_data = layoutRef.current!.layout()
    let rust_consume = performance.now() - now
    console.log(`Rust data time: ${rust_consume} ms`)

    // set state
    set_js_card_list({ card_list: card_list, line_list: line_list } as any)
    set_rust_card_list({
      card_list: rust_data.node_list,
      line_list: rust_data.line_list,
    } as any)
    set_improve(`${((js_consume / rust_consume) * 100).toFixed(2)} %`)
  }, [count, max_child])

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
    <div className="performanceView">
      <div className="controlPanel">
        <div className="leftPanel">
          <span>
            Rust / JS Performance Improvement: {improve}
            <br />
            <br />
            Tree Node Count: {count}
            <br />
            Max Child Count: {max_child}
          </span>
        </div>
      </div>
      <div className="contentPanel">
        <div className="leftPanel">
          <div className="title">Rendered By Javascript</div>
          <div className="chart">
            <Chart
              data={card_js_list}
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
          </div>
        </div>
        <div className="rightPanel">
          <div className="title">Rendered By Rust</div>
          <div className="chart">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceCompare
