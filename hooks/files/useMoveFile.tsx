import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMoveFile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			fileId,
			folderId,
		}: {
			fileId: string;
			folderId: string;
		}) => {
			const res = await fetch(`/api/files/${fileId}/move`, {
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
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["files"] });
		},
	});
}