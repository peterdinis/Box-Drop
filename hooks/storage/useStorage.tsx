import { formatBytes } from "@/utils/format-bytes";
import { useQuery } from "@tanstack/react-query";

const STORAGE_LIMIT_BYTES = 100 * 1024 * 1024 * 1024; // 100 GB

export function useStorageUsage() {
	return useQuery({
		queryKey: ["storage-usage"],
		queryFn: async () => {
			const res = await fetch(`/api/storage`);
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
