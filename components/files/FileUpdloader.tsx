"use client";

import { useToast } from "@/hooks/shared/useToast";
import { UploadButton } from "@/lib/uploadthing";

export default function Home() {
	const {toast} = useToast()

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
			<div className="max-w-md w-full rounded-xl border border-gray-200 bg-white p-6 shadow-md">
				<UploadButton
					endpoint="imageUploader"
					appearance={{
						button:
							"bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-sm",
						container: "flex flex-col items-center gap-3",
					}}
					onClientUploadComplete={(res) => {
						toast({
							title: "Upload was completed" + " " + res[0]?.name,
							duration: 2000,
							className: "bg-green-800 text-white font-bold text-xl"
						})
					}}
					onUploadError={(error: Error) => {
						toast({
							title: "Failed to upload file" + " " + error.message,
							duration: 2000,
							className: "bg-green-800 text-white font-bold text-xl"
						})
					}}
				/>
			</div>
		</main>
	);
}