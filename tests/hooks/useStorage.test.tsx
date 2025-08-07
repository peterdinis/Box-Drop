import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { useStorageUsage } from "@/hooks/storage/useStorage";
import { wrapper } from "../utils/query-wrapper";

describe("useStorageUsage", () => {
	beforeAll(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("returns formatted usage data", async () => {
		(global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
			{
				ok: true,
				json: async () => ({ usedBytes: 10_000_000 }),
			},
		);

		const { result } = renderHook(() => useStorageUsage(), { wrapper });

		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		expect(result.current.data?.usedBytes).toBe(10_000_000);
		expect(result.current.data?.usedFormatted).toMatch(/MB|GB/);
		expect(result.current.data?.percentage).toBeDefined();
	});
});
