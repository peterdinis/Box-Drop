"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteFile(fileId: string): Promise<void> {
	const res = await fetch(`/api/files/${fileId}/delete`, {
		method: "DELETE",
	});

	if (!res.ok) {
		const message = await res.text();
		throw new Error(message || "Failed to delete file");
	}
}

export function useDeleteFile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteFile,
		onSuccess: () => {
			// Po zmazaní môžeš refetch-nuť files/folders, prípadne permissions
			queryClient.invalidateQueries({ queryKey: ["files"] });
			queryClient.invalidateQueries({ queryKey: ["folders"] });
			queryClient.invalidateQueries({ queryKey: ["permissions"] });
		},

		onError: () => {
			throw new Error("Something went wrong in deleting files")
		},
	});
}
