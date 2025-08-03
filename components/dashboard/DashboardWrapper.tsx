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
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold">Files</h3>
								<div className="flex gap-2">
									<Button
										variant={fileViewMode === "grid" ? "default" : "outline"}
										onClick={() => setFileViewMode("grid")}
										size="sm"
									>
										<Grid3X3 className="w-4 h-4" />
									</Button>
									<Button
										variant={fileViewMode === "list" ? "default" : "outline"}
										onClick={() => setFileViewMode("list")}
										size="sm"
									>
										<List className="w-4 h-4" />
									</Button>
								</div>
							</div>
							{fileViewMode === "grid" ? (
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
									{filesData?.items.map((file) => (
										<Card
											key={file.id}
											className="flex flex-col gap-2 p-4 border border-border rounded-md"
										>
											<div className="flex items-center gap-2">
												{getFileIcon(file.type)}
												<p className="truncate font-medium">{file.name}</p>
											</div>
											<div className="flex justify-between text-sm text-muted-foreground">
												<span>{prettyBytes(file.size, { bits: true })}</span>
												<span>{formatDate(file.modified)}</span>
											</div>
											<div className="flex justify-between mt-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleShareFile(file.name, file.type)}
												>
													<Share2 className="w-4 h-4" />
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleDownloadFile(file.url, file.name)}
												>
													<Download className="w-4 h-4" />
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => deleteFile(file.id)}
													disabled={isPending}
												>
													<TrashIcon className="w-4 h-4 text-red-600" />
												</Button>
											</div>
										</Card>
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
												<TableCell className="flex items-center gap-2">
													{getFileIcon(file.type)}
													{file.name}
												</TableCell>
												<TableCell>
													{prettyBytes(file.size, { bits: true })}
												</TableCell>
												<TableCell>{formatDate(file.modified)}</TableCell>
												<TableCell className="flex gap-2 items-center">
													<Button
														variant="ghost"
														size="icon"
														onClick={() =>
															handleShareFile(file.name, file.type)
														}
													>
														<Share2 className="w-4 h-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() =>
															handleDownloadFile(file.url, file.name)
														}
													>
														<Download className="w-4 h-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => deleteFile(file.id)}
														disabled={isPending}
													>
														<TrashIcon className="w-4 h-4 text-red-600" />
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</Card>
					</div>
					{/* Folders Section */}
					<div className="space-y-6">
						<Card className="p-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold">Folders</h3>
								<div className="flex gap-2">
									<CreateFolderModal />
								</div>
							</div>
							{folderViewMode === "grid" ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{folderData?.items.map((folder) => (
										<Card
											key={folder.id}
											className="p-4 flex items-center justify-between cursor-pointer"
											onClick={() => setOpenFolderId(folder.id)}
										>
											<div className="flex items-center gap-2">
												<FolderIcon className="w-5 h-5 text-primary" />
												<p>{folder.name}</p>
											</div>
											<Button size="sm" variant="outline">
												Open
											</Button>
										</Card>
									))}
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Created</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{folderData?.items.map((folder) => (
											<TableRow key={folder.id} onClick={() => setOpenFolderId(folder.id)}>
												<TableCell>{folder.name}</TableCell>
												<TableCell>{formatDate(folder.createdAt)}</TableCell>
												<TableCell>
													<Button size="sm" variant="outline">
														Open
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</Card>

						<Card className="p-4 text-center text-sm text-muted-foreground">
							Storage used: {usedFormatted} / {limitFormatted}
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardWrapper;