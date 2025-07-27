"use client";

import {
	Archive,
	ChevronRight,
	Download,
	File,
	FileText,
	Folder,
	FolderPlus,
	Grid3X3,
	Home,
	Image,
	List,
	MoreHorizontal,
	Music,
	Search,
	Trash2,
	Upload,
	Video,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface FileItem {
	id: string;
	name: string;
	type: "file" | "folder";
	size?: number;
	uploadDate: Date;
	fileType?: string;
}

const FileManager = () => {
	const [files, setFiles] = useState<FileItem[]>([
		{
			id: "1",
			name: "Documents",
			type: "folder",
			uploadDate: new Date("2024-01-15"),
		},
		{
			id: "2",
			name: "Photos",
			type: "folder",
			uploadDate: new Date("2024-01-10"),
		},
		{
			id: "3",
			name: "presentation.pdf",
			type: "file",
			size: 2457600,
			uploadDate: new Date("2024-01-20"),
			fileType: "pdf",
		},
		{
			id: "4",
			name: "vacation.jpg",
			type: "file",
			size: 5242880,
			uploadDate: new Date("2024-01-18"),
			fileType: "image",
		},
	]);

	const [currentPath, setCurrentPath] = useState(["Home"]);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [searchQuery, setSearchQuery] = useState("");
	const [isDragOver, setIsDragOver] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();

	const handleFileUpload = (uploadedFiles: FileList | null) => {
		if (!uploadedFiles) return;

		Array.from(uploadedFiles).forEach((file) => {
			const newFile: FileItem = {
				id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
				name: file.name,
				type: "file",
				size: file.size,
				uploadDate: new Date(),
				fileType: getFileType(file.name),
			};

			setFiles((prev) => [...prev, newFile]);
		});

		toast({
			title: "Files uploaded successfully",
			description: `${uploadedFiles.length} file(s) added to your storage.`,
		});
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		handleFileUpload(e.dataTransfer.files);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const createFolder = () => {
		const folderName = prompt("Enter folder name:");
		if (folderName) {
			const newFolder: FileItem = {
				id: Date.now().toString(),
				name: folderName,
				type: "folder",
				uploadDate: new Date(),
			};
			setFiles((prev) => [...prev, newFolder]);
			toast({
				title: "Folder created",
				description: `"${folderName}" folder has been created.`,
			});
		}
	};

	const getFileType = (fileName: string): string => {
		const extension = fileName.split(".").pop()?.toLowerCase();
		if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension || ""))
			return "image";
		if (["mp4", "avi", "mkv", "mov", "wmv"].includes(extension || ""))
			return "video";
		if (["mp3", "wav", "flac", "aac"].includes(extension || "")) return "audio";
		if (["zip", "rar", "7z", "tar", "gz"].includes(extension || ""))
			return "archive";
		if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension || ""))
			return "document";
		return "file";
	};

	const getFileIcon = (item: FileItem) => {
		if (item.type === "folder")
			return <Folder className="w-5 h-5 text-primary" />;

		switch (item.fileType) {
			case "image":
				return <Image className="w-5 h-5 text-green-500" />;
			case "video":
				return <Video className="w-5 h-5 text-red-500" />;
			case "audio":
				return <Music className="w-5 h-5 text-purple-500" />;
			case "archive":
				return <Archive className="w-5 h-5 text-orange-500" />;
			case "document":
				return <FileText className="w-5 h-5 text-blue-500" />;
			default:
				return <File className="w-5 h-5 text-muted-foreground" />;
		}
	};

	const formatFileSize = (bytes: number): string => {
		const sizes = ["Bytes", "KB", "MB", "GB"];
		if (bytes === 0) return "0 Byte";
		const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
		return Math.round((bytes / 1024 ** i) * 100) / 100 + " " + sizes[i];
	};

	const filteredFiles = files.filter((file) =>
		file.name.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="border-b bg-card">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between mb-4">
						<h1 className="text-2xl font-semibold text-foreground">Box-Drop</h1>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setViewMode(viewMode === "grid" ? "list" : "grid")
								}
							>
								{viewMode === "grid" ? (
									<List className="w-4 h-4" />
								) : (
									<Grid3X3 className="w-4 h-4" />
								)}
							</Button>
						</div>
					</div>

					{/* Breadcrumb */}
					<div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
						<Home className="w-4 h-4" />
						{currentPath.map((path, index) => (
							<div key={index} className="flex items-center gap-2">
								{index > 0 && <ChevronRight className="w-4 h-4" />}
								<span
									className={
										index === currentPath.length - 1
											? "text-foreground font-medium"
											: "hover:text-foreground cursor-pointer"
									}
								>
									{path}
								</span>
							</div>
						))}
					</div>

					{/* Search and Actions */}
					<div className="flex items-center gap-4 flex-wrap">
						<div className="relative flex-1 min-w-64">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search files and folders..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Button onClick={createFolder} variant="outline" className="gap-2">
							<FolderPlus className="w-4 h-4" />
							New Folder
						</Button>
						<Button
							onClick={() => fileInputRef.current?.click()}
							className="gap-2"
						>
							<Upload className="w-4 h-4" />
							Upload Files
						</Button>
						<input
							ref={fileInputRef}
							type="file"
							multiple
							onChange={(e) => handleFileUpload(e.target.files)}
							className="hidden"
						/>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-6">
				{/* Upload Zone */}
				<Card
					className={`mb-6 border-2 border-dashed transition-all duration-200 ${
						isDragOver
							? "border-primary bg-upload-zone"
							: "border-upload-zone-border bg-gradient-upload"
					}`}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
				>
					<div className="flex flex-col items-center justify-center py-12 px-6 text-center">
						<Upload
							className={`w-12 h-12 mb-4 ${isDragOver ? "text-primary" : "text-muted-foreground"}`}
						/>
						<h3 className="text-lg font-medium mb-2">
							Drop files here to upload
						</h3>
						<p className="text-muted-foreground">
							Or{" "}
							<button
								onClick={() => fileInputRef.current?.click()}
								className="text-primary hover:underline font-medium"
							>
								browse files
							</button>{" "}
							from your computer
						</p>
					</div>
				</Card>

				{/* Files Grid/List */}
				{filteredFiles.length === 0 ? (
					<Card className="p-12 text-center">
						<div className="text-muted-foreground">
							<Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
							<h3 className="text-lg font-medium mb-2">No files found</h3>
							<p>Upload some files or create a folder to get started.</p>
						</div>
					</Card>
				) : (
					<div
						className={
							viewMode === "grid"
								? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
								: "space-y-2"
						}
					>
						{filteredFiles.map((item) => (
							<Card
								key={item.id}
								className={`group cursor-pointer transition-all duration-200 hover:shadow-hover hover:bg-file-hover ${
									viewMode === "grid" ? "p-4" : "p-3"
								}`}
							>
								{viewMode === "grid" ? (
									<div className="text-center">
										<div className="flex justify-center mb-3">
											{getFileIcon(item)}
										</div>
										<h3 className="font-medium text-sm truncate mb-1">
											{item.name}
										</h3>
										<p className="text-xs text-muted-foreground">
											{item.size ? formatFileSize(item.size) : "—"}
										</p>
										<p className="text-xs text-muted-foreground">
											{item.uploadDate.toLocaleDateString()}
										</p>
									</div>
								) : (
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3 flex-1 min-w-0">
											{getFileIcon(item)}
											<div className="min-w-0 flex-1">
												<h3 className="font-medium truncate">{item.name}</h3>
												<p className="text-sm text-muted-foreground">
													{item.uploadDate.toLocaleDateString()} •{" "}
													{item.size ? formatFileSize(item.size) : "Folder"}
												</p>
											</div>
										</div>
										<Button
											variant="ghost"
											size="sm"
											className="opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<MoreHorizontal className="w-4 h-4" />
										</Button>
									</div>
								)}
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default FileManager;
