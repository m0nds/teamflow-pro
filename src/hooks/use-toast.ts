"use client"

import { useState, useCallback } from "react"
import { ToastProps } from "@/components/ui/toast"

let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((toast: Omit<ToastProps, "id">) => {
    const id = `toast-${++toastCount}`
    const newToast: ToastProps = {
      id,
      duration: 5000,
      ...toast
    }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback((title: string, description?: string) => {
    return addToast({ type: "success", title, description })
  }, [addToast])

  const error = useCallback((title: string, description?: string) => {
    return addToast({ type: "error", title, description })
  }, [addToast])

  const warning = useCallback((title: string, description?: string) => {
    return addToast({ type: "warning", title, description })
  }, [addToast])

  const info = useCallback((title: string, description?: string) => {
    return addToast({ type: "info", title, description })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}
