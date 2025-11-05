"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  CreditCard,
  BarChart3,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreateProjectModal } from '@/components/projects/create-project-modal'
import { useEffect, useState } from "react"

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings }
]

const DEMO_USER_ID = 'demo-user-id'

// Demo user for portfolio demonstration
const DEMO_USER = {
  name: "Demo User",
  email: "demo@teamflow.pro",
  initials: "DU",
  image: ""  // Added this
}

export function Sidebar() {
  const pathname = usePathname()
  const [userData, setUserData] = useState(DEMO_USER)

  useEffect(() => {
    // Fetch real user data
    fetch(`/api/users/${DEMO_USER_ID}`)
      .then(res => {
        return res.json()
      })
      .then(result => {
        if (result.success) {
          setUserData({
            name: result.data.name || 'Demo User',
            email: result.data.email || 'demo@teamflow.pro',
            initials: result.data.name?.charAt(0) || 'D',
            image: result.data.image
          })
        }
      })
  }, [])


  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">TeamFlow Pro</h1>
        <p className="text-sm text-slate-500">Demo Workspace</p>
      </div>

      {/* Quick Action Button */}
      <div className="p-4">
        <CreateProjectModal />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <motion.div
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    {item.name}
                  </motion.div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Demo User Profile Section */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar>
            {userData.image ? (
              <AvatarImage src={userData.image} alt={userData.name} />
            ) : (
              <AvatarFallback className="bg-blue-500 text-white">
                {userData.initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {userData.name}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {userData.email}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-slate-500 hover:text-slate-700"
          size="sm"
        >
          <User className="w-4 h-4 mr-2" />
          Profile Settings
        </Button>
      </div>
    </div>
  )
}