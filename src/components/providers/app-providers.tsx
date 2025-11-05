"use client"

import { ToastProvider } from "@/components/providers/toast-provider"
import { SocketProvider } from "@/contexts/socket-context"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </SocketProvider>
  )
}


