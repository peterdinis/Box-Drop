"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FOLDER_URL } from "@/constants/applicationConstants";

export function useFolders(page = 0, limit = 10) {
	return useQuery({
		queryKey: ["folders", page, limit],
		queryFn: async () => {
			const res = await fetch(
				`${FOLDER_URL}?limit=${limit}&offset=${page * limit}`,
			);
			if (!res.ok) throw new Error("Failed to fetch folders");
			return res.json();
		},
	});
}

export function useFolder(folderId: string) {
	return useQuery({
		queryKey: ["folderDetail", folderId],
		queryFn: async () => {
			const res = await fetch(`${FOLDER_URL}/${folderId}`);
			if (!res.ok) throw new Error("Folder not found");
			return res.json();
		},
		enabled: !!folderId,
	});
}

export function useCreateFolder() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["newFolder"],
		mutationFn: async (name: string) => {
			const res = await fetch(FOLDER_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});
			if (!res.ok) throw new Error("Failed to create folder");
			return res.json();
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["folders"] });
		},
	});
}

export function useUpdateFolder() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["updateFolder"],
		mutationFn: async ({ id, name }: { id: string; name: string }) => {
			const res = await fetch(`${FOLDER_URL}/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});
			if (!res.ok) throw new Error("Failed to update folder");
			return res.json();
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["folders"] });
			queryClient.invalidateQueries({ queryKey: ["folders", variables.id] });
		},
	});
}

export function useDeleteAllFolders() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteFolder"],
		mutationFn: async () => {
			const res = await fetch(`${FOLDER_URL}/delete`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Failed to delete folders");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["folders"] });
			queryClient.invalidateQueries({ queryKey: ["files"] });
		},
		onError: (error) => {
			console.error("Failed to delete folders:", error);
		},
	});
}
