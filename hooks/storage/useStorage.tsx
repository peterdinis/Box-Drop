import { useQuery } from "@tanstack/react-query";
import { STORAGE_LIMIT_BYTES, STORAGE_URL } from "@/constants/applicationConstants";
import { formatBytes } from "@/utils/format-bytes";

export function useStorageUsage() {
	return useQuery({
		queryKey: ["storage-usage"],
		queryFn: async () => {
			const res = await fetch(STORAGE_URL);
			if (!res.ok) throw new Error("Failed to fetch storage usage");
			return res.json();
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
