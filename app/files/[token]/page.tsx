"use client";

import { useSharedFile } from "@/hooks/files/useShareFile";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function SharedFilePage() {
  const params = useParams();
  const token = params?.token as string;
  const { data, isLoading, isError, error } = useSharedFile(token);

  if (isLoading) return <div>Loading shared file...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!data) return <div>File not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{data.file.name}</h1>
      <p>Size: {data.file.size} bytes</p>
      <Link
        href={data.file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open File
      </Link>
    </div>
  );
}
