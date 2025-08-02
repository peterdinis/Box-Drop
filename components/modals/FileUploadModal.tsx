"use client";

import { FileText, Image, Music, Upload, Video } from "lucide-react";
import { type FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import FileUploader from "../files/FileUpdloader";

const FileUploadModal: FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	const fileTypes = [
		{
			icon: <Image className="w-6 h-6" />,
			label: "Images",
			types: ".jpg, .png, .gif, .svg",
		},
		{
			icon: <FileText className="w-6 h-6" />,
			label: "Documents",
			types: ".pdf, .doc, .txt",
		},
		{
			icon: <Video className="w-6 h-6" />,
			label: "Videos",
			types: ".mp4, .avi, .mkv",
		},
		{
			icon: <Music className="w-6 h-6" />,
			label: "Audio",
			types: ".mp3, .wav, .flac",
		},
	];

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Upload className="w-4 h-4" />
					Upload Files
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Upload Files</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					<FileUploader/>
					<div>
						<h4 className="font-medium mb-3">Supported file types:</h4>
						<div className="grid grid-cols-2 gap-3">
							{fileTypes.map((type, index) => (
								<div
									key={index}
									className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
								>
									<div className="text-primary">{type.icon}</div>
									<div>
										<p className="font-medium text-sm">{type.label}</p>
										<p className="text-xs text-muted-foreground">
											{type.types}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Upload Limits */}
					<div className="text-sm text-muted-foreground space-y-1">
						<p>• Maximum file size: 100 MB per file</p>
						<p>• Maximum 20 files per upload</p>
						<p>• Total storage limit: 100 GB</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default FileUploadModal;
