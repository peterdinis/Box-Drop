"use client"

import { useQuery } from "@tanstack/react-query";

export const useFiles = () => {
	return useQuery({
		queryKey: ["files"],
		queryFn: async () => {
			const res = await fetch("/api/files");
			if (!res.ok) throw new Error("Failed to fetch files");
			return res.json();
		},
	});
};
