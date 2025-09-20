import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DatabaseService } from '@/lib/database'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const salesItems = await DatabaseService.getSalesItems(session.user.id)
    const salesStats = await DatabaseService.getSalesStats(session.user.id)
    
    return NextResponse.json({ salesItems, salesStats })
  } catch (error: any) {
    console.error('Error fetching sales items:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch sales items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const salesData = await request.json()
    
    // Validate required fields
    if (!salesData.item_name || !salesData.sale_price || !salesData.sale_platform || !salesData.sale_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const salesItem = await DatabaseService.saveSalesItem(session.user.id, salesData)
    return NextResponse.json({ salesItem }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating sales item:', error)
    return NextResponse.json({ error: error.message || 'Failed to create sales item' }, { status: 500 })
  }
}
