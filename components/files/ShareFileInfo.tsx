"use client"

import { useSharedFile } from "@/hooks/files/useShareFile";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FC } from "react";

const ShareFileInfo: FC = () => {
    const params = useParams();
    const token = params?.token as string;
    const { data, isLoading, isError, error } = useSharedFile(token);

    if (isLoading) return <Loader2 className="animate-spin w-8 h-8" />
    if (isError) return <div className="text-xl font-bold text-red-900">Error: {error?.message}</div>;
    if (!data) return <div>File not found</div>;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-6 bg-white rounded shadow-md text-center">
                <h1 className="text-2xl font-bold mb-2">{data.file.name}</h1>
                <p className="mb-4">Size: {data.file.size} bytes</p>
                <Link
                    href={data.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Open File
                </Link>
            </div>
        </div>
    )
}

export default ShareFileInfo