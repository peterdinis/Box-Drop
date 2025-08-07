// app/api/socket/route.ts

import type { Server as NetServer } from "http";
import type { NextRequest } from "next/server";
import { Server } from "socket.io";

// This ensures we only create one Socket.IO server instance
let io: Server | undefined;

export function GET(req: NextRequest) {
	if (!(global as any).io) {
		const server = (req as any).socket?.server as NetServer;

		if (!server) {
			console.error("No server found on request");
			return new Response("No server found", { status: 500 });
		}

		io = new Server(server, {
			path: "/api/socket",
			addTrailingSlash: false,
		});

		io.on("connection", (socket) => {
			console.log("🔌 New client connected:", socket.id);

			socket.on("message", (msg) => {
				console.log("📨 Message received:", msg);
				io?.emit("message", msg);
			});

			socket.on("disconnect", () => {
				console.log("❌ Client disconnected:", socket.id);
			});
		});

		(global as any).io = io;
	}

	return new Response("Socket.IO server running", { status: 200 });
}
