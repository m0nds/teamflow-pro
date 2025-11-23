import { auth, currentUser } from '@clerk/nextjs/server'

export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth()
  return userId
}

export async function getCurrentUser() {
  const user = await currentUser()
  return user
}

export async function requireAuth() {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }
  
  return userId
}