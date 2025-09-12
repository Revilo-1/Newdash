import { useSession } from 'next-auth/react'

export function useAdmin() {
  const { data: session, status } = useSession()
  
  const isAdmin = session?.user?.role === 'super_admin'
  const isAuthenticated = status === 'authenticated'
  
  return {
    isAdmin,
    isAuthenticated,
    user: session?.user,
    role: session?.user?.role
  }
}
