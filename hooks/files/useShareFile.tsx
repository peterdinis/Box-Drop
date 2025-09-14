"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { FILES_URL } from "@/constants/applicationConstants";
import type { SharedFileResponse } from "@/types/FileTypes";

export function useSharedFile(token: string) {
	return useQuery<SharedFileResponse, Error>({
		queryKey: ["sharedFile", token],
		queryFn: async () => {
			const res = await fetch(`${FILES_URL}/shared/${token}`);
			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Failed to fetch shared file");
			}
			return res.json();
		},
		enabled: !!token,
	});
}

export function useShareFile() {
	return useMutation({
		mutationKey: ["sharingFile"],
		mutationFn: async (fileId: string) => {
			const res = await fetch(`${FILES_URL}/shared`, {
				method: "POST",
				body: JSON.stringify({ fileId }),
			});
			if (!res.ok) throw new Error("Failed to share file");
			return res.json() as Promise<{ url: string }>;
		},
	});
}
