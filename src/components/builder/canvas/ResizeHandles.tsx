import React from "react"

const HANDLES = ["nw", "n", "ne", "w", "e", "sw", "s", "se"] as const

export function ResizeHandles({
  onMouseDown,
}: {
  onMouseDown: (e: React.MouseEvent, handle: string) => void
}) {
  return (
    <>
      {HANDLES.map((h) => (
        <div
          key={h}
          onMouseDown={(e) => onMouseDown(e, h)}
          className={`absolute z-10 h-2.5 w-2.5 rounded-sm border border-white bg-blue-500 shadow ${
            h.includes("n")
              ? "-top-1.5"
              : h.includes("s")
                ? "-bottom-1.5"
                : "top-1/2 -translate-y-1/2"
          } ${
            h.includes("w")
              ? "-left-1.5"
              : h.includes("e")
                ? "-right-1.5"
                : "left-1/2 -translate-x-1/2"
          }`}
          style={{
            cursor: `${h.includes("n") ? "n" : h.includes("s") ? "s" : ""}${
              h.includes("w") ? "w" : h.includes("e") ? "e" : ""
            }-resize`,
          }}
        />
      ))}
    </>
  )
}
