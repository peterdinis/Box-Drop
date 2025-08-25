"use client";

import { SharedFile } from "@/types/SharedFileTypes";
import { useQuery } from "@tanstack/react-query";

export const useAllSharedFiles = () => {
	return useQuery<SharedFile[], Error>({
		queryKey: ["sharedFiles"],
		queryFn: async () => {
			const res = await fetch("/api/files/shared");
			if (!res.ok) {
				throw new Error("Failed to fetch shared files");
			}
			return res.json();
		},
		staleTime: Infinity,
	});
};
