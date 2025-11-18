"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Toaster } from "sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationCenter />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}