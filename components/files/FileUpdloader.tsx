"use client";

import type { FC } from "react";
import { useToast } from "@/hooks/shared/useToast";
import { UploadButton } from "@/lib/uploadthing";

const FileUploader: FC = () => {
	const { toast } = useToast();

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
					onClientUploadComplete={(res) => {
						toast({
							title: "Upload was completed" + " " + res[0]?.name,
							duration: 2000,
							className: "bg-green-800 text-white font-bold text-xl",
						});
						window.location.replace("/dashboard");
					}}
					onUploadError={(error: Error) => {
						toast({
							title: "Failed to upload file" + " " + error.message,
							duration: 2000,
							className: "bg-green-800 text-white font-bold text-xl",
						});
					}}
				/>
			</div>
		</main>
	);
};

export default FileUploader;
