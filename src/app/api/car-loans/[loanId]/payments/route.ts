import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DatabaseService } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { loanId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payments = await DatabaseService.getCarLoanPayments(session.user.id, params.loanId)
    return NextResponse.json({ payments })
  } catch (error: any) {
    console.error('Error fetching car loan payments:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch payments' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { loanId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const paymentData = await request.json()
    
    // Validate required fields
    if (!paymentData.payment_date || !paymentData.amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Add car_loan_id to payment data
    const fullPaymentData = {
      ...paymentData,
      car_loan_id: params.loanId
    }

    const payment = await DatabaseService.saveCarLoanPayment(session.user.id, fullPaymentData)
    return NextResponse.json({ payment }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating car loan payment:', error)
    return NextResponse.json({ error: error.message || 'Failed to create payment' }, { status: 500 })
  }
}
