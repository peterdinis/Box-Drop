"use client";

import { useQuery } from "@tanstack/react-query";
import { FILES_URL } from "@/constants/applicationConstants";

export const useFiles = () => {
	return useQuery({
		queryKey: ["files"],
		queryFn: async () => {
			const res = await fetch(FILES_URL);
			if (!res.ok) throw new Error("Failed to fetch files");
			return res.json();
		},
	});
};
