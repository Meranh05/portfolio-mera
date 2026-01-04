"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/Sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {children}
      </main>
    </div>
  )
}
