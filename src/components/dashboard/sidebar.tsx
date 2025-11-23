"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  CreditCard,
  BarChart3,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreateProjectModal } from '@/components/projects/create-project-modal'

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Team", href: "/dashboard/team", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings }
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">TeamFlow Pro</h1>
        <p className="text-sm text-slate-500">
          {user?.firstName ? `${user.firstName}'s Workspace` : 'Your Workspace'}
        </p>
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

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-200">
        {!isLoaded ? (
          <div className="animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3 bg-slate-200 rounded mb-1"></div>
                <div className="h-2 bg-slate-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ) : user ? (
          <>
            <div className="flex items-center space-x-3 mb-3">
              <Avatar>
                <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
                <AvatarFallback className="bg-blue-500 text-white">
                  {user.firstName?.charAt(0) || user.emailAddresses[0].emailAddress.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user.fullName || 'User'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
            
            <Link href="/dashboard/settings">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-500 hover:text-slate-700 mb-1"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-500 hover:text-slate-700"
              onClick={() => signOut()}
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )
}