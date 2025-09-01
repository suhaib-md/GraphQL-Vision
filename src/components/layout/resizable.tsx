"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ResizablePanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction: "horizontal" | "vertical"
}

const ResizablePanelGroup = React.forwardRef<
  HTMLDivElement,
  ResizablePanelGroupProps
>(({ className, direction, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex w-full h-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    data-panel-group-direction={direction}
    {...props}
  >
    {children}
  </div>
))
ResizablePanelGroup.displayName = "ResizablePanelGroup"

interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number
  minSize?: number
}

const ResizablePanel = React.forwardRef<
  HTMLDivElement,
  ResizablePanelProps
>(({ className, children, defaultSize, minSize, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex flex-col", className)}
    style={{ ...style, flexBasis: 0, flexGrow: defaultSize, overflow: 'hidden' }}
    {...props}
  >
    {children}
  </div>
))
ResizablePanel.displayName = "ResizablePanel"


interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  withHandle?: boolean
}

const ResizableHandle = React.forwardRef<
  HTMLDivElement,
  ResizableHandleProps
>(({ className, withHandle, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-px items-center justify-center bg-border transition-colors hover:bg-primary after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=horizontal]]:cursor-col-resize [&[data-panel-group-direction=vertical]]:cursor-row-resize",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-1 items-center justify-center rounded-sm border bg-card" />
    )}
  </div>
))
ResizableHandle.displayName = "ResizableHandle"

// NOTE: The resizing logic is omitted for brevity as it's complex to implement from scratch.
// This provides the visual structure, and a real implementation would use a library like `react-resizable-panels`.

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
