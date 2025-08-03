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
	TrashIcon,
	TrendingUp,
	Video,
} from "lucide-react";
import prettyBytes from "pretty-bytes";
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
import { formatDate } from "@/utils/format-date";
import { useDeleteFile } from "@/hooks/files/useDeleteFile";
import { useMoveFile } from "@/hooks/files/useMoveFile";

const DashboardWrapper: FC = () => {
	const [fileViewMode, setFileViewMode] = useState<"grid" | "list">("grid");
	const [folderViewMode, setFolderViewMode] = useState<"grid" | "list">("grid");
	const [showSettings, setShowSettings] = useState(false);
	const { data: folderData, isLoading: folderLoading } = useFolders();
	const { data: filesData, isLoading: fileLoading } = useFiles();
	const { user } = useUser();
	const { data: storageUsage } = useStorageUsage();
	const { mutate: deleteFile, isPending } = useDeleteFile();

	const { mutate: moveFile, isPending: isMoving } = useMoveFile();

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

	const [movingFileId, setMovingFileId] = useState<string | null>(null);
	const [targetFolderId, setTargetFolderId] = useState<string | null>(null);

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

	const handleDownloadFile = (fileUrl: string, fileName: string) => {
		const link = document.createElement("a");
		link.href = fileUrl;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleMoveFile = (fileId: string, newFolderId: string) => {
		moveFile(
			{ fileId, newFolderId },
			{
				onSuccess: () => {
					setMovingFileId(null);
					setTargetFolderId(null);
					// případně refresh dat přes useFiles/useFolders nebo refetch
				},
				onError: (error) => {
					// tady můžeš přidat notifikaci o chybě
					console.error("Error moving file:", error);
				},
			},
		);
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
								{formatDate(selectedFolder.createdAt)}
							</p>
							{selectedFolder.files && selectedFolder.files.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Size</TableHead>
											<TableHead>Modified</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{selectedFolder.files.map(
											(file: {
												id: string;
												name: string;
												size: number;
												modified: string | boolean;
											}) => (
												<TableRow key={file.id}>
													<TableCell>{file.name}</TableCell>
													<TableCell>
														{prettyBytes(file.size, {
															bits: true,
														})}
													</TableCell>
													<TableCell>{file.modified ?? "N/A"}</TableCell>
													<TableCell className="flex gap-2 items-center">
														<Button
															variant="ghost"
															size="icon"
															onClick={() => deleteFile(file.id)}
															disabled={isPending}
														>
															<TrashIcon className="w-4 h-4 text-red-600" />
														</Button>

														{/* Move File Select */}
														<select
															value={targetFolderId ?? ""}
															onChange={(e) => {
																const newFolderId = e.target.value;
																if (newFolderId) {
																	setMovingFileId(file.id);
																	setTargetFolderId(newFolderId);
																	handleMoveFile(file.id, newFolderId);
																}
															}}
															disabled={isMoving}
															className="border rounded px-2 py-1 text-sm"
														>
															<option value="">Move to...</option>
															{folderData?.items
																.filter((f) => f.id !== openFolderId)
																.map((folder) => (
																	<option key={folder.id} value={folder.id}>
																		{folder.name}
																	</option>
																))}
														</select>
													</TableCell>
												</TableRow>
											),
										)}
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
								<h3 className="text-xl font-semibold">Files</h3>
								<div className="flex gap-2">
									<Button
										size="sm"
										variant={fileViewMode === "grid" ? "default" : "outline"}
										onClick={() => setFileViewMode("grid")}
									>
										<Grid3X3 className="w-4 h-4" />
									</Button>
									<Button
										size="sm"
										variant={fileViewMode === "list" ? "default" : "outline"}
										onClick={() => setFileViewMode("list")}
									>
										<List className="w-4 h-4" />
									</Button>
								</div>
							</div>

							{fileViewMode === "grid" ? (
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
									{filesData?.items.length === 0 && (
										<p className="text-muted-foreground">
											No files uploaded yet.
										</p>
									)}
									{filesData?.items.map((file) => (
										<div
											key={file.id}
											className="relative rounded border p-4 flex flex-col gap-2 hover:shadow-md"
										>
											<div className="flex justify-between items-center">
												<div className="flex items-center gap-2">
													{getFileIcon(file.type)}
													<span className="truncate max-w-[10rem]">{file.name}</span>
												</div>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => deleteFile(file.id)}
													disabled={isPending}
												>
													<TrashIcon className="w-4 h-4 text-red-600" />
												</Button>
											</div>
											<div className="flex justify-between text-sm text-muted-foreground">
												<span>{prettyBytes(file.size)}</span>
												<span>{formatDate(file.modified)}</span>
											</div>
											<div className="flex gap-2 mt-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														handleShareFile(file.name, file.type)
													}
												>
													<Share2 className="w-4 h-4" />
													Share
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														handleDownloadFile(file.url, file.name)
													}
												>
													<Download className="w-4 h-4" />
													Download
												</Button>
											</div>
										</div>
									))}
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Size</TableHead>
											<TableHead>Modified</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filesData?.items.map((file) => (
											<TableRow key={file.id}>
												<TableCell>{file.name}</TableCell>
												<TableCell>{prettyBytes(file.size)}</TableCell>
												<TableCell>{formatDate(file.modified)}</TableCell>
												<TableCell className="flex gap-2 items-center">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => deleteFile(file.id)}
														disabled={isPending}
													>
														<TrashIcon className="w-4 h-4 text-red-600" />
													</Button>
													{/* Move File Select */}
													<select
														value={targetFolderId ?? ""}
														onChange={(e) => {
															const newFolderId = e.target.value;
															if (newFolderId) {
																setMovingFileId(file.id);
																setTargetFolderId(newFolderId);
																handleMoveFile(file.id, newFolderId);
															}
														}}
														disabled={isMoving}
														className="border rounded px-2 py-1 text-sm"
													>
														<option value="">Move to...</option>
														{folderData?.items
															.filter((f) => f.id !== file.folderId)
															.map((folder) => (
																<option key={folder.id} value={folder.id}>
																	{folder.name}
																</option>
															))}
													</select>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</Card>
					</div>

					{/* Folders Section */}
					<div>
						<Card className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-xl font-semibold">Folders</h3>
								<Button size="sm" onClick={() => setShowSettings(true)}>
									Settings
								</Button>
							</div>
							{folderViewMode === "grid" ? (
								<div className="grid grid-cols-2 gap-4">
									{folderData?.items.length === 0 && (
										<p className="text-muted-foreground">No folders created.</p>
									)}
									{folderData?.items.map((folder) => (
										<div
											key={folder.id}
											className="border rounded p-4 cursor-pointer hover:shadow-md"
											onClick={() => setOpenFolderId(folder.id)}
										>
											<div className="flex items-center gap-2">
												<FolderIcon className="w-6 h-6 text-primary" />
												<span className="font-semibold">{folder.name}</span>
											</div>
											<p className="text-sm text-muted-foreground mt-1">
												{folder.fileCount} files
											</p>
										</div>
									))}
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>File Count</TableHead>
											<TableHead>Created</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{folderData?.items.map((folder) => (
											<TableRow
												key={folder.id}
												className="cursor-pointer"
												onClick={() => setOpenFolderId(folder.id)}
											>
												<TableCell>{folder.name}</TableCell>
												<TableCell>{folder.fileCount}</TableCell>
												<TableCell>{formatDate(folder.createdAt)}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
							<div className="mt-4 flex gap-2">
								<Button
									size="sm"
									variant={folderViewMode === "grid" ? "default" : "outline"}
									onClick={() => setFolderViewMode("grid")}
								>
									<Grid3X3 className="w-4 h-4" />
								</Button>
								<Button
									size="sm"
									variant={folderViewMode === "list" ? "default" : "outline"}
									onClick={() => setFolderViewMode("list")}
								>
									<List className="w-4 h-4" />
								</Button>
							</div>
						</Card>

						<Card className="mt-6 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
							<p>
								Storage used:{" "}
								<span className="font-semibold">{usedFormatted}</span> /{" "}
								<span className="font-semibold">{limitFormatted}</span>
							</p>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardWrapper;
