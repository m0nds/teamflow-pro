"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FolderOpen, Users, Calendar, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { CreateProjectModal } from '@/components/projects/create-project-modal'
import Link from 'next/link'

// TypeScript types for our data
type Project = {
  id: string
  title: string
  description: string | null
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: string | null
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const result = await response.json()
      
      if (result.success) {
        setProjects(result.data)
      } else {
        console.error('Failed to fetch projects:', result.error)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load projects when component mounts
  useEffect(() => {
    fetchProjects()
  }, [])

  // Refresh projects when a new one is created
  const handleProjectCreated = () => {
    fetchProjects()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-700'
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-700'
      case 'HIGH':
        return 'bg-orange-100 text-orange-700'
      case 'URGENT':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-slate-600">Loading projects...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600 mt-1">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} in your workspace
          </p>
        </div>
        <CreateProjectModal onProjectCreated={handleProjectCreated} />
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No projects yet</h3>
          <p className="text-slate-600 mb-4">Get started by creating your first project</p>
          <CreateProjectModal onProjectCreated={handleProjectCreated} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <FolderOpen className="w-8 h-8 text-blue-600" />
                    <div className="flex space-x-2">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription>
                    {project.description || 'No description provided'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {/* Project Info */}
                  <div className="space-y-3">
                    {/* Created by */}
                    <div className="flex items-center text-sm text-slate-600">
                      <Avatar className="w-6 h-6 mr-2">
                        <AvatarFallback className="text-xs">
                          {project.user.name?.charAt(0) || project.user.email.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      Created by {project.user.name || project.user.email}
                    </div>

                    {/* Due date */}
                    {project.dueDate && (
                      <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Due {new Date(project.dueDate).toLocaleDateString()}
                      </div>
                    )}

                    {/* Created date */}
                    <div className="text-xs text-slate-500">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}