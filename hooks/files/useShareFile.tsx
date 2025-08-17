"use client";

import { useMutation } from "@tanstack/react-query";

export function useShareFile() {
	return useMutation({
		mutationKey: ["sharingFile"],
		mutationFn: async (fileId: string) => {
			const res = await fetch("/api/files/shared", {
				method: "POST",
				body: JSON.stringify({ fileId }),
			});
			if (!res.ok) throw new Error("Failed to share file");
			return res.json() as Promise<{ url: string }>;
		},
	});
}
