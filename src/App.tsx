// Import React Framework
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react"
import { createHashRouter, RouterProvider } from "react-router-dom"

// Import Customized Component
import PerformanceCompare from "./Page/PerformanceCompare/PerformanceCompare"
import RandomRustCardViewPage from "./Page/RandomRustCardViewPage/RandomCardViewPage"
import RandomTSCardViewPage from "./Page/RandomTSCardViewPage/RandomCardViewPage"
import SemanticCardViewPage from "./Page/SemanticCardViewPage/SemanticCardViewPage"

const router = createHashRouter([
  {
    path: "/",
    element: <PerformanceCompare />,
  },
  {
    path: "/rust_random_cards",
    element: <RandomRustCardViewPage />,
  },
  {
    path: "/ts_random_cards",
    element: <RandomTSCardViewPage />,
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
