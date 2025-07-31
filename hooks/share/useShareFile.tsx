import { useMutation } from "@tanstack/react-query";

interface GenerateShareLinkInput {
  fileId: string;
  permission: string;
  email?: string;
}

interface GenerateShareLinkResponse {
  shareUrl: string;
}

async function generateShareLinkApi(input: GenerateShareLinkInput): Promise<GenerateShareLinkResponse> {
  const res = await fetch("/api/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to generate share link");
  }

  return res.json();
}

export function useGenerateShareLink() {
  return useMutation({
    mutationKey: ["generate-share"],
    mutationFn: generateShareLinkApi,
  });
}