// Import React Framework
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react"

// Import UI5 WebComponent React
import { Card, Title, TitleLevel, Label } from "@ui5/webcomponents-react"

// Import CSS
import styles from "./SemanticChart.module.css"

export function SemanticChart(props: any) {
  const { id, parent_id, width, height, pos_x, pos_y, child_count } = props
  return (
    <Card
      className={styles.semanticChart}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${pos_x}px`,
        top: `${pos_y}px`,
      }}
    >
      <div className={styles.avatarSection}>
        <img
          className={styles.avatarImg}
          src="../../../public/avatar_1.png"
          alt="1"
        />
      </div>
      <Title className={styles.userName} level={TitleLevel.H5}>
        Aanya Singh
      </Title>
      <Label className={styles.desc}>Administrative Support</Label>
    </Card>
  )
}
