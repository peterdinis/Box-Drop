"use client";

import {
	FileArchive,
	FileAudio,
	FileCode2,
	FileSpreadsheet,
	FileText,
	Image,
	Music,
	Video,
} from "lucide-react";
import { ImageSwiper } from "./image-swipper";

const cardData = [
	{ id: 1, icon: Image, title: "PNG Image" },
	{ id: 2, icon: Video, title: "MP4 Video" },
	{ id: 3, icon: FileText, title: "PDF Document" },
	{ id: 4, icon: Music, title: "MP3 Audio" },
	{ id: 5, icon: FileAudio, title: "WAV File" },
	{ id: 6, icon: FileArchive, title: "ZIP Archive" },
	{ id: 7, icon: FileCode2, title: "Code Snippet" },
	{ id: 8, icon: FileSpreadsheet, title: "Excel Sheet" },
];

export default function FilesSwipper() {
	return (
		<div className="text-white w-full flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
			<ImageSwiper cards={cardData} />
		</div>
	);
}
