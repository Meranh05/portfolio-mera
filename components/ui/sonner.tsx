"use client"

import type React from "react"

import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "#1e293b",
          "--normal-text": "#f8fafc",
          "--normal-border": "#334155",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
