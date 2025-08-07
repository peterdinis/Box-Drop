import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSearch } from "@/hooks/shared/useSearch";
import { wrapper } from "../utils/query-wrapper";

describe("useSearch", () => {
	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("should not run query if query string is empty", () => {
		renderHook(() => useSearch(""), { wrapper });
		expect(global.fetch).not.toHaveBeenCalled();
	});

	it("should fetch and return search results", async () => {
		const mockData = { results: ["Item 1", "Item 2"] };

		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			json: async () => mockData,
		});

		const { result } = renderHook(() => useSearch("test query"), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(global.fetch).toHaveBeenCalledWith("/api/search?q=test%20query");
		expect(result.current.data).toEqual(mockData);
	});

	it("should handle API failure", async () => {
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: false,
			status: 500,
		});

		const { result } = renderHook(() => useSearch("fail query"), { wrapper });

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeInstanceOf(Error);
		expect(result.current.error?.message).toBe(
			"Failed to fetch search results",
		);
	});
});
