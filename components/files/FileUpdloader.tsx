"use client";
import { useQueryClient } from "@tanstack/react-query";
import type { FC } from "react";
import { useToast } from "@/hooks/shared/useToast";
import { UploadButton } from "@/lib/uploadthing";

const FileUploader: FC = () => {
	const { toast } = useToast();
	const queryClient = useQueryClient();

	return (
		<main>
			<div className="max-w-md w-full rounded-xl p-6">
				<UploadButton
					endpoint="imageUploader"
					appearance={{
						container:
							"border border-muted rounded-xl bg-background p-6 shadow-sm flex flex-col items-center gap-4",
						button:
							"bg-muted hover:bg-muted/80 text-sm font-medium px-4 py-2 rounded-md transition-colors",
					}}
					onClientUploadComplete={() => {
						toast({
							title: "Upload was completed",
							duration: 2000,
							className: "bg-green-800 text-white font-bold text-xl",
						});
						queryClient.invalidateQueries({
							queryKey: ["files"],
						});
						queryClient.invalidateQueries({
							queryKey: ["storage-usage"],
						});
					}}
					onUploadError={(error: Error) => {
						toast({
							title: "Failed to upload file: " + error.message,
							duration: 5000, // Longer duration to see the error
							className: "bg-red-800 text-white font-bold text-xl", // RED for errors!
						});
					}}
				/>
			</div>
		</main>
	);
};

export default FileUploader;
