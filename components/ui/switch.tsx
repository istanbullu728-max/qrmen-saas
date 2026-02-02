"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-rose-500 dark:data-[state=unchecked]:bg-rose-900 focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 group/switch inline-flex shrink-0 items-center rounded-full border border-slate-200 dark:border-slate-800 shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[1.5rem] data-[size=default]:w-10 data-[size=sm]:h-4 data-[size=sm]:w-8",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        data-state={props.checked ? "checked" : "unchecked"}
        className={cn(
          "bg-white pointer-events-none block rounded-full ring-0 transition-transform group-data-[size=default]/switch:size-5 group-data-[size=sm]/switch:size-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-[2px] shadow-sm flex items-center justify-center"
        )}
      >
        {props.checked !== undefined && (
          <div className="transition-all duration-200" key={String(props.checked)}>
            {props.checked ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-emerald-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-rose-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            )}
          </div>
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root >
  )
}

export { Switch }
