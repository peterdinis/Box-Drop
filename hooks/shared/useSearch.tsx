"use client";

import { useQuery } from "@tanstack/react-query";
import type { SearchResult } from "@/types/SearchTypes";

const fetchSearchResults = async (query: string): Promise<SearchResult> => {
	const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

	if (!res.ok) {
		throw new Error("Failed to fetch search results");
	}

	return res.json();
};

export const useSearch = (query: string) => {
	return useQuery({
		queryKey: ["search", query],
		queryFn: () => fetchSearchResults(query),
		enabled: !!query,
	});
};
