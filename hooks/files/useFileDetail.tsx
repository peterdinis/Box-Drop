"use client";

import { useQuery } from "@tanstack/react-query";
import { FILES_URL } from "@/constants/applicationConstants";

export const useFileQuery = (id: string, userId: string) => {
	return useQuery({
		queryKey: ["fileDetail", id],
		queryFn: async () => {
			const res = await fetch(`${FILES_URL}/${id}`, {
				headers: {
					"x-user-id": userId,
				},
			});
			if (!res.ok) throw new Error("Failed to fetch file");
			return res.json();
		},
		enabled: !!id && !!userId,
	});
};
