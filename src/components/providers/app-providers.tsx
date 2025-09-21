"use client"

import { ToastProvider } from "@/components/providers/toast-provider"
import { SocketProvider } from "@/contexts/socket-context"
import { SessionProvider } from "next-auth/react"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SocketProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </SocketProvider>
    </SessionProvider>
  )
}


