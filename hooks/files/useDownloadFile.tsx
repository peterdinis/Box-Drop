"use client";

import { useState } from "react";
import { useToast } from "../shared/useToast";

export function useFileDownload() {
	const [isDownloading, setIsDownloading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const {toast} = useToast()

	const downloadFile = (fileUrl: string, fileName: string) => {
		setIsDownloading(true);
		setError(null);

		fetch(fileUrl)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.blob();
			})
			.then((blob) => {
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", fileName);
				document.body.appendChild(link);
				link.click();
				link.remove();
				window.URL.revokeObjectURL(url);
				toast({
					title: "Downloading file...",
					duration: 2000,
					className: "bg-green-800 text-white font-bold text-base"
				})
			})
			.catch((err) => {
				console.error("Download failed:", err);
				setError(err);
				toast({
					title: "Failed to dowload the file",
					duration: 2000,
					className: "bg-red-800 text-white font-bold text-base"
				})
			})
			.finally(() => {
				setIsDownloading(false);
			});
	};

	return { downloadFile, isDownloading, error };
}
