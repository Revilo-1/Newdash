import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DatabaseService } from '@/lib/database'

export async function PUT(
  request: NextRequest,
  { params }: { params: { loanId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    const carLoan = await DatabaseService.updateCarLoan(session.user.id, params.loanId, updates)
    
    return NextResponse.json({ carLoan })
  } catch (error: any) {
    console.error('Error updating car loan:', error)
    return NextResponse.json({ error: error.message || 'Failed to update car loan' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { loanId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await DatabaseService.deleteCarLoan(session.user.id, params.loanId)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting car loan:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete car loan' }, { status: 500 })
  }
}
