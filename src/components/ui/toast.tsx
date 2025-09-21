"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
  onClose?: () => void
}

const toastVariants = {
  success: {
    icon: CheckCircle,
    className: "border-green-200 bg-green-50 text-green-900",
    iconClassName: "text-green-600"
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-900",
    iconClassName: "text-red-600"
  },
  warning: {
    icon: AlertTriangle,
    className: "border-yellow-200 bg-yellow-50 text-yellow-900",
    iconClassName: "text-yellow-600"
  },
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-900",
    iconClassName: "text-blue-600"
  }
}

export function Toast({ id, title, description, type = "info", onClose }: ToastProps) {
  const Icon = toastVariants[type].icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "relative flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm",
        toastVariants[type].className
      )}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", toastVariants[type].iconClassName)} />
      
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-semibold leading-5">{title}</p>
        )}
        {description && (
          <p className="text-sm leading-5 mt-1 opacity-90">{description}</p>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  )
}

export interface ToastContainerProps {
  toasts: ToastProps[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80 max-w-[calc(100vw-2rem)]">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
