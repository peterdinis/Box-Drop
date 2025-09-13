"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
	BulkDeleteFilesParams,
	BulkDeleteFilesResponse,
} from "@/types/BulkFilesTypes";

export const useBulkDeleteFiles = () => {
	const queryClient = useQueryClient();

	return useMutation<BulkDeleteFilesResponse, Error, BulkDeleteFilesParams>({
		mutationKey: ["bulkDeleteFiles"],
		mutationFn: async ({ fileIds }) => {
			const res = await fetch("/api/files/delete", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ fileIds }),
			});

			if (!res.ok) {
				throw new Error("Failed to delete files");
			}

			return (await res.json()) as BulkDeleteFilesResponse;
		},
		onSuccess: async (_, { fileIds }) => {
			// invalidate the files query
			await queryClient.invalidateQueries({ queryKey: ["files"] });
		},
		onError: (err) => {
			console.error("Bulk delete failed:", err);
		},
	});
};
