"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

type PermissionInput = {
	targetId: string;
	targetType: "file" | "folder";
	userId: string;
	access: "read" | "write";
};

async function addPermission(data: PermissionInput): Promise<string> {
	const res = await fetch("/api/permissions", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
		cache: "no-store",
	});

	if (!res.ok) {
		const message = await res.text();
		throw new Error(message || "Failed to add permission");
	}

	return res.text();
}

export function useAddPermission() {
	const queryClient = useQueryClient();

	return useMutation<string, Error, PermissionInput>({
		mutationFn: addPermission,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["permissions"] });
			queryClient.invalidateQueries({ queryKey: ["folders"] });
			queryClient.invalidateQueries({ queryKey: ["files"] });
		},
	});
}
