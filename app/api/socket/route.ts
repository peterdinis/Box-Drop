import { type NextRequest, NextResponse } from "next/server";
import { Server as IOServer } from "socket.io";

declare global {
	// To avoid multiple instances of Socket.IO server in dev mode
	var io: IOServer | undefined;
}

export async function GET(req: NextRequest) {
	const { socket, server } = (req as any).socket || {};

	if (!socket) {
		return NextResponse.json(
			{ error: "No socket object found" },
			{ status: 500 },
		);
	}

	// If Socket.IO server already exists, reuse it
	if (!global.io) {
		console.log("Initializing Socket.IO server...");

		// @ts-ignore
		const io = new IOServer(server);

		io.on("connection", (socket) => {
			console.log("Client connected:", socket.id);

			socket.on("joinRoom", (userId: string) => {
				socket.join(userId);
				console.log(`Socket ${socket.id} joined room ${userId}`);
			});

			socket.on("disconnect", () => {
				console.log("Client disconnected:", socket.id);
			});
		});

		global.io = io;
	}

	return NextResponse.json({ message: "Socket.IO server running" });
}
