"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FILES_URL } from "@/constants/applicationConstants";

export function useMoveFile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["moveFile"],
		mutationFn: async ({
			fileId,
			folderId,
		}: {
			fileId: string;
			folderId: string;
		}) => {
			const res = await fetch(`${FILES_URL}/${fileId}/move`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ folderId }),
			});

			if (!res.ok) {
				const error = await res.text();
				throw new Error(error);
			}

			return true;
		},
		onSuccess: (folderId) => {
			queryClient.invalidateQueries({ queryKey: ["folderDetail", folderId] });
		},
	});
}
