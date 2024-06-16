// Import React Framework
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react"
import { createHashRouter, RouterProvider } from "react-router-dom"

// Import Customized Component
import PerformanceCompare from "./Page/PerformanceCompare/PerformanceCompare"
import CardViewPage from "./Page/CardViewPage/CardViewPage"

const router = createHashRouter([
  {
    path: "/",
    element: <PerformanceCompare />,
  },
  {
    path: "/cards",
    element: <CardViewPage />,
  },
])

function RouterConfig() {
  return <RouterProvider router={router} />
}

export default RouterConfig
