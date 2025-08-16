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

	return useMutation<BulkDeleteFilesResponse, Error, BulkDeleteFilesParams>(
		async ({ fileIds }) => {
			const res = await fetch("/api/files/bulk-delete", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ fileIds }),
			});

			if (!res.ok) {
				throw new Error("Failed to delete files");
			}

			return res.json();
		},
		{
			onSuccess: (_, { fileIds }) => {
				// Invalidate files queries to refetch updated list
				queryClient.invalidateQueries(["files"]);

				// Optionally, show a toast or notification
				console.log(`Deleted ${fileIds.length} files successfully`);
			},
			onError: (err) => {
				console.error("Bulk delete failed:", err);
			},
		},
	);
};
