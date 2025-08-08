import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (): Socket => {
	if (!socket) {
		socket = io({
			path: "/api/socket",
		});

		socket.on("connect", () => {
			console.log("✅ Connected to socket:", socket?.id);
		});
	}

	return socket;
};
