"use client";

import { SharedFileResponse } from "@/types/FileTypes";
import { useMutation, useQuery } from "@tanstack/react-query";

interface File {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: number;
}

export function useSharedFile(token: string) {
  return useQuery<SharedFileResponse, Error>({
    queryKey: ["sharedFile", token],
    queryFn: async () => {
      const res = await fetch(`/api/share/${token}`);
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
			const res = await fetch("/api/files/shared", {
				method: "POST",
				body: JSON.stringify({ fileId }),
			});
			if (!res.ok) throw new Error("Failed to share file");
			return res.json() as Promise<{ url: string }>;
		},
	});
}
