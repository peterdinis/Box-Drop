"use client";

import { useState } from "react";

export function useFileDownload() {
	const [isDownloading, setIsDownloading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

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
			})
			.catch((err) => {
				console.error("Download failed:", err);
				setError(err);
			})
			.finally(() => {
				setIsDownloading(false);
			});
	};

	return { downloadFile, isDownloading, error };
}
