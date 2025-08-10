import { Server as IOServer } from "socket.io";
import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";

declare global {
  var io: IOServer | undefined;
}

export async function GET(req: Request, ctx: { res: NextApiResponse }) {
  const res: any = ctx.res;

  if (!res.socket?.server) {
    return NextResponse.json({ error: "No server object" }, { status: 500 });
  }

  if (!global.io) {
    console.log("Initializing Socket.IO...");
    const io = new IOServer(res.socket.server);
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
    });
    global.io = io;
  }

  return NextResponse.json({ message: "Socket.IO running" });
}
