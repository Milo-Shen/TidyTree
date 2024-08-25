// Import React Framework
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useRef } from "react";

// Import Tidy
import { LayoutType, TidyLayout } from "./tidy";

interface Props {
  rawData: any;
  layoutType: LayoutType;
}

function getLayoutType(type?: LayoutType) {
  switch (type) {
    case LayoutType.Basic:
      return LayoutType.Basic;
    case LayoutType.Tidy:
      return LayoutType.Tidy;
    case LayoutType.LayeredTidy:
      return LayoutType.LayeredTidy;
    default:
      throw new Error("tidy type is missing");
  }
}

const TidyComponent = ({ rawData, layoutType }: Props) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<TidyLayout>();

  // Hooks
  useEffect(() => {
    let done = false;
    const type = getLayoutType(layoutType);

    (async () => {
      let now = performance.now();
      layoutRef.current = await TidyLayout.create(type);
      console.log(`init rust environment time: ${performance.now() - now} ms`);

      if (done) {
        return;
      }

      now = performance.now();
      layoutRef.current.load_data(rawData);
      console.log(`convert data to rust type time: ${performance.now() - now} ms`);

      now = performance.now();
      layoutRef.current.layout();
      console.log(`process rust data time: ${performance.now() - now} ms`);
    })();

    return () => {
      done = true;
      layoutRef.current?.dispose();
      layoutRef.current = undefined;
    };
  }, [layoutType, rawData]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default TidyComponent;
