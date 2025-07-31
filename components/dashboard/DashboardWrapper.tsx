"use client";

import { useUser } from "@clerk/nextjs";
import {
	Archive,
	Download,
	File,
	FileText,
	FolderIcon,
	Grid3X3,
	HardDrive,
	Image,
	List,
	Loader2,
	MoreHorizontal,
	Music,
	Share2,
	Shield,
	Star,
	TrendingUp,
	Video,
} from "lucide-react";
import Link from "next/link";
import { type FC, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useFiles } from "@/hooks/files/useFiles";
import { useFolder, useFolders } from "@/hooks/folders/useFolders";
import { useStorageUsage } from "@/hooks/storage/useStorage";
import CreateFolderModal from "../modals/CreateFolderModal";
import FileShareModal from "../modals/FileShareModal";
import FileUploadModal from "../modals/FileUploadModal";
import GlobalSearchModal from "../modals/GlobalSearchModal";
import SettingsModal from "../modals/SettingsModal";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const DashboardWrapper: FC = () => {
	const [fileViewMode, setFileViewMode] = useState<"grid" | "list">("grid");
	const [folderViewMode, setFolderViewMode] = useState<"grid" | "list">("grid");
	const [showNotifications, setShowNotifications] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const { data: folderData, isLoading: folderLoading } = useFolders();
	console.log("F", folderData)
	const { data: filesData, isLoading: fileLoading } = useFiles();
	const { user } = useUser();
	const { data: storageUsage } = useStorageUsage();

	const usedFormatted = storageUsage?.usedFormatted;
	const limitFormatted = storageUsage?.limitFormatted;

	const [shareModal, setShareModal] = useState({
		isOpen: false,
		fileName: "",
		fileType: "",
	});

	const [openFolderId, setOpenFolderId] = useState<string | null>(null);
	const { data: selectedFolder, isLoading: folderDetailLoading } = useFolder(
		openFolderId ?? "",
	);

	const getFileIcon = (type: string) => {
		switch (type) {
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

	const handleShareFile = (fileName: string, fileType: string) => {
		setShareModal({ isOpen: true, fileName, fileType });
	};

	if (fileLoading || folderLoading)
		return <Loader2 className="animate-spin w-8 h-8" />;

	return (
		<div className="min-h-screen bg-background">
			<SettingsModal
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
			/>
			<FileShareModal
				isOpen={shareModal.isOpen}
				onClose={() =>
					setShareModal({ isOpen: false, fileName: "", fileType: "" })
				}
				fileName={shareModal.fileName}
				fileType={shareModal.fileType}
			/>

			<Dialog open={!!openFolderId} onOpenChange={() => setOpenFolderId(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Folder Details</DialogTitle>
					</DialogHeader>
					{folderDetailLoading ? (
						<Loader2 className="w-5 h-5 animate-spin" />
					) : selectedFolder ? (
						<div className="space-y-2">
							<p>
								<strong>Name:</strong> {selectedFolder.name}
							</p>
							<p>
								<strong>Created:</strong>{" "}
								{new Date(selectedFolder.createdAt).toLocaleString()}
							</p>
							{selectedFolder.files && selectedFolder.files.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Type</TableHead>
											<TableHead>Size</TableHead>
											<TableHead>Modified</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{selectedFolder.files.map((file: any) => (
											<TableRow key={file.id}>
												<TableCell>{file.name}</TableCell>
												<TableCell className="capitalize">
													{file.type}
												</TableCell>
												<TableCell>{file.size}</TableCell>
												<TableCell>{file.modified ?? "N/A"}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<p className="text-sm text-muted-foreground">
									No files in this folder.
								</p>
							)}
						</div>
					) : (
						<p className="text-sm text-muted-foreground">Folder not found.</p>
					)}
				</DialogContent>
			</Dialog>

			<div className="container mx-auto px-6 py-6">
				<div className="grid lg:grid-cols-4 gap-6">
					<div className="lg:col-span-3 space-y-6">
						<Card className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-2xl font-bold mb-2">
										Welcome back! {user?.emailAddresses[0]?.emailAddress} 👋
									</h2>
								</div>
								<div className="hidden md:flex gap-2">
									<FileUploadModal />
									<CreateFolderModal />
									<GlobalSearchModal />
								</div>
							</div>
						</Card>

						{/* Files Section */}
						<Card className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-lg font-semibold">Recent Files</h3>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											setFileViewMode(fileViewMode === "grid" ? "list" : "grid")
										}
									>
										{fileViewMode === "grid" ? (
											<List className="w-4 h-4" />
										) : (
											<Grid3X3 className="w-4 h-4" />
										)}
									</Button>
									<Button variant="outline" size="sm">
										<Link href="/files">View All</Link>
									</Button>
								</div>
							</div>

							<div
								className={
									fileViewMode === "grid"
										? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
										: "space-y-2"
								}
							>
								{filesData?.map((file, index) => (
									<Card
										key={file.id}
										className={`group cursor-pointer hover:shadow-hover transition-all duration-200 animate-fade-in ${
											fileViewMode === "grid" ? "p-4" : "p-3"
										}`}
										style={{ animationDelay: `${index * 0.1}s` }}
									>
										{fileViewMode === "grid" ? (
											<div className="text-center">
												<div className="flex justify-center mb-3">
													{getFileIcon(file.type)}
												</div>
												<h4 className="font-medium text-sm truncate mb-1">
													{file.name}
												</h4>
												<p className="text-xs text-muted-foreground mb-1">
													{file.size}
												</p>
												<p className="text-xs text-muted-foreground">
													{file.modified}
												</p>
												<div className="flex justify-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
													<Button size="sm" variant="ghost">
														<Download className="w-3 h-3" />
													</Button>
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															handleShareFile(file.name, file.type)
														}
													>
														<Share2 className="w-3 h-3" />
													</Button>
													<Button size="sm" variant="ghost">
														<Star
															className={`w-3 h-3 ${file.starred ? "fill-yellow-400 text-yellow-400" : ""}`}
														/>
													</Button>
												</div>
											</div>
										) : (
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3 flex-1 min-w-0">
													{getFileIcon(file.type)}
													<div className="min-w-0 flex-1">
														<h4 className="font-medium truncate">
															{file.name}
														</h4>
														<p className="text-sm text-muted-foreground">
															{file.modified} • {file.size}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															handleShareFile(file.name, file.type)
														}
													>
														<Share2 className="w-4 h-4" />
													</Button>
													<Button size="sm" variant="ghost">
														<Star
															className={`w-4 h-4 ${file.starred ? "fill-yellow-400 text-yellow-400" : ""}`}
														/>
													</Button>
													<Button size="sm" variant="ghost">
														<MoreHorizontal className="w-4 h-4" />
													</Button>
												</div>
											</div>
										)}
									</Card>
								))}
							</div>
						</Card>

						{/* Recent Folders */}
						<Card className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-lg font-semibold">Recent Folders</h3>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setFolderViewMode(
											folderViewMode === "grid" ? "list" : "grid",
										)
									}
								>
									{folderViewMode === "grid" ? (
										<List className="w-4 h-4" />
									) : (
										<Grid3X3 className="w-4 h-4" />
									)}
								</Button>
							</div>

							<div
								className={
									folderViewMode === "grid"
										? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
										: "space-y-2"
								}
							>
								{/*
{folderData.map((folder, index) => (
	<Card
		key={folder.id}
		onClick={() => setOpenFolderId(folder.id?.toString() ?? "")}
		className={`group cursor-pointer hover:shadow-hover transition-all duration-200 animate-fade-in ${
			folderViewMode === "grid" ? "p-4" : "p-3"
		}`}
		style={{ animationDelay: `${index * 0.1}s` }}
	>
		{folderViewMode === "grid" ? (
			<div className="text-center">
				<div className="flex justify-center mb-3">
					<FolderIcon className="w-5 h-5 text-yellow-500" />
				</div>
				<h4 className="font-medium text-sm truncate mb-1">
					{folder.name}
				</h4>
			</div>
		) : (
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3 flex-1 min-w-0">
					<FolderIcon className="w-5 h-5 text-yellow-500" />
					<h4 className="font-medium truncate">
						{folder.name}
					</h4>
				</div>
				<Button size="sm" variant="ghost">
					<MoreHorizontal className="w-4 h-4" />
				</Button>
			</div>
		)}
	</Card>
))}
*/}
							</div>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						<Card className="p-6">
							<div className="flex items-center gap-2 mb-4">
								<HardDrive className="w-5 h-5 text-primary" />
								<h3 className="font-semibold">Storage</h3>
							</div>
							<div className="space-y-4">
								<div>
									<div className="flex justify-between text-sm mb-2">
										<span>{usedFormatted} used</span>
										<span>{limitFormatted} total</span>
									</div>
								</div>
							</div>
						</Card>

						<Card className="p-6">
							<h3 className="font-semibold mb-4">Quick Stats</h3>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<TrendingUp className="w-4 h-4 text-green-500" />
										<span className="text-sm">Files uploaded</span>
									</div>
									<span className="font-medium">24</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Share2 className="w-4 h-4 text-blue-500" />
										<span className="text-sm">Files shared</span>
									</div>
									<span className="font-medium">8</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Shield className="w-4 h-4 text-purple-500" />
										<span className="text-sm">Security score</span>
									</div>
									<span className="font-medium text-green-500">98%</span>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardWrapper;
