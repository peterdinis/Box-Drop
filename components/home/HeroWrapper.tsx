"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import FilesSwipper from "../ui/files-swipper";

let socket: Socket;

const HeroWrapper: FC = () => {
	const [connected, setConnected] = useState(false);

	useEffect(() => {
		socket = io("http://localhost:3001", {
			transports: ["websocket"],
		});

		socket.on("connect", () => {
			console.log("✅ Connected to server:", socket.id);
			setConnected(true);
		});

		socket.on("disconnect", () => {
			console.log("❌ Disconnected from server");
			setConnected(false);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	console.log("C", connected);

	return (
		<section className="relative dark:bg-gradient-to-br dark:from-background dark:via-card dark:to-background bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-16 pb-20 overflow-hidden animate-fade-in-up">
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl animate-float"></div>
				<div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-400 rounded-full filter blur-3xl animate-float-delayed"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div className="text-center lg:text-left animate-slide-in-left">
						<h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-sky-100 leading-tight mb-6 animate-fade-in-up stagger-1">
							Your files,
							<span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent animate-gradient-x">
								{" "}
								everywhere{" "}
							</span>
							you go
						</h1>

						<p className="text-xl text-gray-600 dark:text-sky-50 mb-8 leading-relaxed animate-fade-in-up stagger-2">
							Store, sync, and share your files across all your devices. Access
							your content from anywhere with enterprise-grade security and
							seamless collaboration tools.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 animate-fade-in-up stagger-3">
							<button className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 text-lg font-semibold group">
								<Link href="/sign-in">Try now</Link>
								<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
							</button>
						</div>
					</div>

					<div className="relative animate-slide-in-right">
						<FilesSwipper />

						<div className="absolute -top-6 -left-6 bg-white dark:bg-background rounded-xl shadow-lg p-4 transform -rotate-12 hover:rotate-0 transition-all duration-500 hover:scale-110 animate-bounce-subtle">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-blue-100 dark:bg-zinc-600 rounded-full flex items-center justify-center">
									<div className="w-4 h-4 bg-blue-500 rounded-sm animate-pulse"></div>
								</div>
								<div>
									<div className="text-sm font-semibold">Project Files</div>
									<div className="text-xs text-gray-500">256 MB</div>
								</div>
							</div>
						</div>

						<div className="absolute -bottom-6 -right-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-4 transform rotate-12 hover:rotate-0 transition-all duration-500 hover:scale-110 animate-bounce-subtle-delayed">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-teal-100 dark:bg-zinc-600 rounded-full flex items-center justify-center">
									<div className="w-4 h-4 bg-teal-500 rounded-sm animate-pulse"></div>
								</div>
								<div>
									<div className="text-sm font-semibold">Synced</div>
									<div className="text-xs text-gray-500">2 min ago</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroWrapper;
