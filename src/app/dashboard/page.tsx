import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// This is a React component - think of it as a blueprint for a webpage
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Welcome to TeamFlow Pro
        </h1>
        <p className="text-slate-600 text-lg">
          Your modern task management dashboard
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Active Projects Card */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-blue-600">12</CardTitle>
            <CardDescription>Active Projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              +2 this week
            </Badge>
          </CardContent>
        </Card>

        {/* Completed Tasks Card */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-green-600">247</CardTitle>
            <CardDescription>Completed Tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              +12 today
            </Badge>
          </CardContent>
        </Card>

        {/* Team Members Card */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold text-purple-600">8</CardTitle>
            <CardDescription>Team Members</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              2 online now
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
          <CardDescription>What's happening in your workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Activity Item 1 */}
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-slate-50/50">
            <Avatar>
              <AvatarFallback className="bg-blue-500 text-white">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                John Doe completed the task "Design new login page"
              </p>
              <p className="text-xs text-slate-500">2 minutes ago</p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              Completed
            </Badge>
          </div>

          {/* Activity Item 2 */}
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-slate-50/50">
            <Avatar>
              <AvatarFallback className="bg-purple-500 text-white">SM</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                Sarah Miller created new project "Mobile App Redesign"
              </p>
              <p className="text-xs text-slate-500">1 hour ago</p>
            </div>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              New Project
            </Badge>
          </div>

          {/* Activity Item 3 */}
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-slate-50/50">
            <Avatar>
              <AvatarFallback className="bg-orange-500 text-white">MJ</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                Mike Johnson invited 3 new team members
              </p>
              <p className="text-xs text-slate-500">3 hours ago</p>
            </div>
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
              Team Update
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="mt-8 flex space-x-4">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Create New Project
        </Button>
        <Button variant="outline" size="lg">
          Invite Team Members
        </Button>
      </div>
    </div>
  )
}