import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminApi } from '@/lib/adminApi'

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const users = await AdminApi.getAllUsers()
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST /api/admin/users - Invite a new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { email, name, role } = body
    
    if (!email || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const result = await AdminApi.inviteUser({ email, name, role })
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 })
    }
    
    return NextResponse.json({ user: result.user, message: 'User invited successfully' })
  } catch (error) {
    console.error('Error inviting user:', error)
    return NextResponse.json({ error: 'Failed to invite user' }, { status: 500 })
  }
}
