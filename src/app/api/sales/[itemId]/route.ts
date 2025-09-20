import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DatabaseService } from '@/lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    const salesItem = await DatabaseService.updateSalesItem(session.user.id, params.itemId, updates)
    
    return NextResponse.json({ salesItem })
  } catch (error: any) {
    console.error('Error updating sales item:', error)
    return NextResponse.json({ error: error.message || 'Failed to update sales item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await DatabaseService.deleteSalesItem(session.user.id, params.itemId)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting sales item:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete sales item' }, { status: 500 })
  }
}
