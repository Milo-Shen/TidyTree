// Import React Framework
import React, { ReactNode } from "react"

// Import Interface & Types & Classes
import { Node } from "../../TidyTree/Node"

// Import Customized Component
import Line from "../Line"

// Import CSS
import ChartStyle from "./Chart.module.css"

// Interface
interface ChartPropsInterface {
  data: any
  card_template: (card: Node) => ReactNode
  children?: ReactNode | ReactNode[]
}

function Chart(props: ChartPropsInterface) {
  const {
    data = {
      card_list: [],
      line_list: [],
    },
    card_template,
  } = props

  return (
    <div className={ChartStyle.chart}>
      <>{data.card_list.map((card: any) => card_template(card))}</>
      {/* todo: key of line should be identified */}
      <>
        {data.line_list.map((line: any, index: number) => (
          <Line
            key={index}
            width={line.width}
            height={line.height}
            pos_x={line.pos_x}
            pos_y={line.pos_y}
            mode={line.mode}
            color={line.color}
            border_width={line.border_width}
            border_radius={line.border_radius}
          />
        ))}
      </>
    </div>
  )
}

export default Chart
