"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "/api/folders";

export function useFolders(page = 0, limit = 10) {
	return useQuery({
		queryKey: ["folders", page, limit],
		queryFn: async () => {
			const res = await fetch(
				`/api/folders?limit=${limit}&offset=${page * limit}`,
			);
			if (!res.ok) throw new Error("Failed to fetch folders");
			return res.json();
		},
	});
}

export function useFolder(folderId: string) {
	return useQuery({
		queryKey: ["folders", folderId],
		queryFn: async () => {
			const res = await fetch(`${BASE_URL}/${folderId}`);
			if (!res.ok) throw new Error("Folder not found");
			return res.json();
		},
		enabled: !!folderId,
	});
}

export function useCreateFolder() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (name: string) => {
			const res = await fetch(BASE_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});
			if (!res.ok) throw new Error("Failed to create folder");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["folders"] });
		},
	});
}

export function useUpdateFolder() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, name }: { id: string; name: string }) => {
			const res = await fetch(`${BASE_URL}/${id}`, {
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
		mutationFn: async () => {
			const res = await fetch(`${BASE_URL}/delete`, {
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