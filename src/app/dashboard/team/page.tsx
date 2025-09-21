import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Mail, MoreHorizontal } from "lucide-react"

const teamMembers = [
  {
    name: "Sarah Johnson",
    email: "sarah@teamflow.com",
    role: "Product Manager",
    avatar: "https://github.com/shadcn.png",
    status: "online",
    tasksCompleted: 24
  },
  {
    name: "Mike Chen",
    email: "mike@teamflow.com", 
    role: "Senior Developer",
    avatar: "https://github.com/vercel.png",
    status: "away",
    tasksCompleted: 18
  },
  {
    name: "Emily Davis",
    email: "emily@teamflow.com",
    role: "Designer",
    avatar: "https://github.com/nextjs.png", 
    status: "offline",
    tasksCompleted: 31
  }
]

export default function TeamPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team</h1>
          <p className="text-slate-600 mt-1">Manage your team members</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                  member.status === 'online' ? 'bg-green-500' :
                  member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
              </div>
              <CardTitle className="text-lg">{member.name}</CardTitle>
              <Badge variant="secondary">{member.role}</Badge>
            </CardHeader>
            
            <CardContent className="text-center space-y-3">
              <div className="flex items-center justify-center text-sm text-slate-600">
                <Mail className="w-4 h-4 mr-2" />
                {member.email}
              </div>
              
              <div className="text-sm">
                <span className="font-medium">{member.tasksCompleted}</span>
                <span className="text-slate-600"> tasks completed</span>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <MoreHorizontal className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}