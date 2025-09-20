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

    const carLoans = await DatabaseService.getCarLoans(session.user.id)
    return NextResponse.json({ carLoans })
  } catch (error: any) {
    console.error('Error fetching car loans:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch car loans' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const loanData = await request.json()
    
    // Validate required fields
    if (!loanData.car_name || !loanData.loan_amount || !loanData.monthly_payment || !loanData.interest_rate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const carLoan = await DatabaseService.saveCarLoan(session.user.id, loanData)
    return NextResponse.json({ carLoan }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating car loan:', error)
    return NextResponse.json({ error: error.message || 'Failed to create car loan' }, { status: 500 })
  }
}
