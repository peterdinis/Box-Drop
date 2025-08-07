import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAddPermission } from "@/hooks/permissions/useAddPermission";
import { wrapper } from "../utils/query-wrapper";

describe("useAddPermission", () => {
	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("successfully adds permission and invalidates related queries", async () => {
		const mockResponse = "Permission added";
		const invalidateQueries = vi.fn();

		const queryClient = new QueryClient();
		queryClient.invalidateQueries = invalidateQueries;

		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: true,
			text: async () => mockResponse,
		});

		const { result } = renderHook(() => useAddPermission(), {
			wrapper: ({ children }) => (
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			),
		});

		result.current.mutate({
			targetId: "123",
			targetType: "file",
			userId: "user-1",
			access: "read",
		});

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(global.fetch).toHaveBeenCalledWith(
			"/api/permissions",
			expect.objectContaining({
				method: "POST",
			}),
		);

		expect(result.current.data).toBe(mockResponse);
		expect(invalidateQueries).toHaveBeenCalledWith({
			queryKey: ["permissions"],
		});
		expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["folders"] });
		expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ["files"] });
	});

	it("handles error if request fails", async () => {
		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
			ok: false,
			text: async () => "Something went wrong",
		});

		const { result } = renderHook(() => useAddPermission(), { wrapper });

		result.current.mutate({
			targetId: "456",
			targetType: "folder",
			userId: "user-2",
			access: "write",
		});

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeInstanceOf(Error);
		expect(result.current.error?.message).toBe("Something went wrong");
	});
});
