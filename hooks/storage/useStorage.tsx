import { formatBytes } from "@/lib/format-bytes";
import { useQuery } from "@tanstack/react-query";

const STORAGE_LIMIT_BYTES = 100 * 1024 * 1024 * 1024; // 100 GB

export function useStorageUsage(userId: string) {
	return useQuery({
		queryKey: ["storage-usage", userId],
		queryFn: async () => {
			const res = await fetch(`/api/storage-usage?userId=${userId}`);
			if (!res.ok) throw new Error("Failed to fetch storage usage");
			return res.json(); // { usedBytes: number }
		},
		select: (data) => {
			const used = data.usedBytes;
			const percent = Math.min((used / STORAGE_LIMIT_BYTES) * 100, 100);
			return {
				usedBytes: used,
				usedFormatted: formatBytes(used),
				limitFormatted: formatBytes(STORAGE_LIMIT_BYTES),
				percentage: percent.toFixed(2),
			};
		},
	});
}