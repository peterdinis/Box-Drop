import { useMutation, useQueryClient } from "@tanstack/react-query";

interface BulkDeleteFilesParams {
	fileIds: string[];
}

interface BulkDeleteFilesResponse {
	success: boolean;
	deleted: number;
}

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

			console.log(`Deleted ${fileIds.length} files successfully`);
		},
		onError: (err) => {
			console.error("Bulk delete failed:", err);
		},
	});
};
