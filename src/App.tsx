// Import React Framework
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react"

// Import Customized Component
import PerformanceCompare from "./Page/PerformanceCompare"

import { createHashRouter, RouterProvider } from "react-router-dom"

const router = createHashRouter([
  {
    path: "/",
    element: <PerformanceCompare />,
  },
])

function RouterConfig() {
  return <RouterProvider router={router} />
}

export default RouterConfig
