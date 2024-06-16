// Import React Framework
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react"
import { createHashRouter, RouterProvider } from "react-router-dom"

// Import Customized Component
import PerformanceCompare from "./Page/PerformanceCompare/PerformanceCompare"
import RandomCardViewPage from "./Page/RandomCardViewPage/RandomCardViewPage"
import SemanticCardViewPage from "./Page/SemanticCardViewPage/SemanticCardViewPage"

const router = createHashRouter([
  {
    path: "/",
    element: <PerformanceCompare />,
  },
  {
    path: "/rust_random_cards",
    element: <RandomCardViewPage />,
  },
  {
    path: "/rust_cards",
    element: <SemanticCardViewPage />,
  },
])

function RouterConfig() {
  return <RouterProvider router={router} />
}

export default RouterConfig
