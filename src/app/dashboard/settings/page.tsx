"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/upload/image-upload'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    image: ''
  })

  // Load user data
  useEffect(() => {
    if (!isLoaded || !user?.id) return

    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/users/${user.id}`)
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format')
        }

        const result = await response.json()

        if (result.success) {
          setFormData({
            name: result.data.name || '',
            email: result.data.email || '',
            bio: result.data.bio || '',
            image: result.data.image || ''
          })
        } else {
          // If user doesn't exist, show a message but don't error
          if (response.status === 404) {
            console.log('User not found in database, will be created on first action')
            // Set form with Clerk user data as fallback
            const clerkName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || ''
            const clerkEmail = user.primaryEmailAddress?.emailAddress || ''
            const clerkImage = user.imageUrl || ''
            
            setFormData({
              name: clerkName,
              email: clerkEmail,
              bio: '',
              image: clerkImage
            })
          } else {
            toast.error(result.error || 'Failed to load profile')
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        // If it's a JSON parse error, the API might be returning HTML
        if (error instanceof SyntaxError) {
          toast.error('Server error: Invalid response format. Please refresh the page.')
        } else {
          toast.error('Failed to load profile')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      toast.error('User not authenticated')
      return
    }
    
    setIsSaving(true)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })


      const result = await response.json()

      if (result.success) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Please sign in to view settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your profile and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Upload a profile picture to personalize your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
              onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
              folder="teamflow/avatars"
            />
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}