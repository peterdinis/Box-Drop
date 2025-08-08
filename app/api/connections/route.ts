import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db' // Adjust path to your Drizzle db instance
import { connections } from '@/db/schema' // Adjust to your actual path
import { eq, or } from 'drizzle-orm'

// GET: Get all connections for a user (either requester or receiver)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const result = await db.query.connections.findMany({
    where: or(
      eq(connections.requesterId, userId),
      eq(connections.receiverId, userId)
    ),
    with: {
      requester: true,
      receiver: true,
    },
  })

  return NextResponse.json(result)
}

// POST: Create a new connection
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { requesterId, receiverId } = body

  if (!requesterId || !receiverId) {
    return NextResponse.json({ error: 'Missing requesterId or receiverId' }, { status: 400 })
  }

  // Optionally prevent duplicates
  const existing = await db.query.connections.findFirst({
    where: or(
      eq(connections.requesterId, requesterId),
      eq(connections.receiverId, receiverId)
    ),
  })

  if (existing) {
    return NextResponse.json({ error: 'Connection already exists' }, { status: 409 })
  }

  const created = await db.insert(connections).values({
    requesterId,
    receiverId,
    status: 'pending',
    createdAt: new Date(),
  })

  return NextResponse.json({ message: 'Connection created', created }, { status: 201 })
}