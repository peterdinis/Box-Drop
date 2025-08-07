import { Server } from 'socket.io'
import { NextRequest } from 'next/server'

let io: Server | undefined

export function GET(req: NextRequest) {
  if (!(global as any).io) {
    const server = (req as any).socket?.server

    if (!server) return new Response('No server', { status: 500 })

    io = new Server(server, {
      path: '/api/socket',
    })

    io.on('connection', (socket) => {
      console.log('✅ Socket connected:', socket.id)

      socket.on('file:shared', (fileData) => {
        console.log('📁 File shared:', fileData)
        socket.broadcast.emit('file:received', fileData)
      })
    })

    ;(global as any).io = io
  }

  return new Response('Socket server running', { status: 200 })
}
