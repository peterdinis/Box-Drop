import { useQuery } from "@tanstack/react-query";

export const useFileQuery = (id: string, userId: string) => {
  return useQuery({
    queryKey: ["file", id],
    queryFn: async () => {
      const res = await fetch(`/api/files/${id}`, {
        headers: {
          "x-user-id": userId,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch file");
      return res.json();
    },
    enabled: !!id && !!userId,
  });
};