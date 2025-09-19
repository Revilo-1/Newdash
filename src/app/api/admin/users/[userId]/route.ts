import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminApi } from '@/lib/adminApi'

// DELETE /api/admin/users/[userId] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { userId } = params
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }
    
    // Prevent admin from deleting themselves
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }
    
    const result = await AdminApi.deleteUser(userId)
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 })
    }
    
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}

// PUT /api/admin/users/[userId] - Update user role
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { userId } = params
    const body = await request.json()
    const { role } = body
    
    if (!userId || !role) {
      return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 })
    }
    
    // Prevent admin from changing their own role
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 })
    }
    
    const result = await AdminApi.updateUserRole(userId, role)
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 })
    }
    
    return NextResponse.json({ message: 'User role updated successfully' })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 })
  }
}
