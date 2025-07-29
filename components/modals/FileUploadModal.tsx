"use client";

import { FileText, FileUp, Image, Music, Upload, Video } from "lucide-react";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useNotifications } from "@/context/NotificationContext";
import { useToast } from "@/hooks/shared/use-toast";

interface FileUploadModalProps {
	onFilesUpload?: (files: File[]) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ onFilesUpload }) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const [isDragOver, setIsDragOver] = React.useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { addNotification } = useNotifications();
	const { toast } = useToast();

	const handleFiles = (files: FileList | null) => {
		if (!files) return;

		const fileArray = Array.from(files);
		onFilesUpload?.(fileArray);

		addNotification({
			title: "Files Uploaded",
			message: `${fileArray.length} file(s) have been uploaded successfully.`,
			type: "success",
		});

		toast({
			title: "Upload complete",
			description: `${fileArray.length} file(s) added to your storage.`,
		});

		setIsOpen(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		handleFiles(e.dataTransfer.files);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

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
					{/* Drag & Drop Area */}
					<Card
						className={`border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer ${
							isDragOver
								? "border-primary bg-upload-zone"
								: "border-upload-zone-border bg-gradient-upload hover:border-primary/50"
						}`}
						onDrop={handleDrop}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onClick={() => fileInputRef.current?.click()}
					>
						<FileUp
							className={`w-12 h-12 mx-auto mb-4 ${isDragOver ? "text-primary" : "text-muted-foreground"}`}
						/>
						<h3 className="text-lg font-medium mb-2">Drop files here</h3>
						<p className="text-muted-foreground mb-4">
							Or click to browse files from your computer
						</p>
						<Button variant="outline" size="sm">
							Browse Files
						</Button>
					</Card>

					{/* Supported File Types */}
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

					<input
						ref={fileInputRef}
						type="file"
						multiple
						onChange={(e) => handleFiles(e.target.files)}
						className="hidden"
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default FileUploadModal;
