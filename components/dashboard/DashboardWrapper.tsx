"use client";

import {
	Download,
	File,
	FolderIcon,
	Grid3X3,
	List,
	Loader2,
	MoreHorizontal,
	Share2,
	TrashIcon,
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useDeleteFile } from "@/hooks/files/useDeleteFile";
import { useFileDownload } from "@/hooks/files/useDownloadFile";
import { useFiles } from "@/hooks/files/useFiles";
import { useMoveFile } from "@/hooks/files/useMoveFile";
import { useFolder, useFolders } from "@/hooks/folders/useFolders";
import { useToast } from "@/hooks/shared/useToast";
import { formatDate } from "@/utils/format-date";
import FileShareModal from "../modals/FileShareModal";
import SettingsModal from "../modals/SettingsModal";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";

const DashboardWrapper: FC = () => {
	const [fileViewMode, setFileViewMode] = useState<"grid" | "list">("grid");
	const [folderViewMode, setFolderViewMode] = useState<"grid" | "list">("grid");
	const [showSettings, setShowSettings] = useState(false);
	const { data: folderData, isLoading: folderLoading } = useFolders();
	const { data: filesData, isLoading: fileLoading } = useFiles();
	const { mutate: deleteFile, isPending } = useDeleteFile();
	const { mutate: moveFile, isPending: isMoving } = useMoveFile();
	const [shareModal, setShareModal] = useState({
		isOpen: false,
		fileName: "",
		fileType: "",
	});

	const [openFolderId, setOpenFolderId] = useState<string | null>(null);
	const { data: selectedFolder, isLoading: folderDetailLoading } = useFolder(
		openFolderId ?? "",
	);
	const { toast } = useToast();
	const [, setMovingFileId] = useState<string | null>(null);
	const [targetFolderId, setTargetFolderId] = useState<string | null>(null);

	const handleMoveFile = (fileId: string, newFolderId: string) => {
		moveFile(
			{ fileId, folderId: newFolderId },
			{
				onSuccess: () => {
					setMovingFileId(null);
					setTargetFolderId("");
					toast({
						title: "File was moved to another folder",
						duration: 2000,
						className: "bg-green-800 text-white font-bold text-base",
					});
				},
				onError: (error) => {
					toast({
						title: "File was not moved to another folder " + error.message,
						duration: 2000,
						className: "bg-red-800 text-white font-bold text-base",
					});
				},
			},
		);
	};

	const handleShareFile = (fileName: string, fileType: string) => {
		setShareModal({ isOpen: true, fileName, fileType });
	};

	const { downloadFile, isDownloading } = useFileDownload();

	const handleDownloadFile = (fileUrl: string, fileName: string) => {
		downloadFile(fileUrl, fileName);
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
				<DialogContent className="w-full max-h-[100vh] overflow-y-auto">
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
								<strong>Created:</strong> {formatDate(selectedFolder.createdAt)}
							</p>
							{selectedFolder.files && selectedFolder.files.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Size</TableHead>
											<TableHead>Modified</TableHead>
											<TableHead>Delete</TableHead>
											<TableHead>Move to another folder</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{selectedFolder.files.map(
											(file: {
												id: string;
												name: string;
												size: number;
												modified: boolean;
											}) => (
												<TableRow key={file.id}>
													<TableCell>{file.name}</TableCell>
													<TableCell>
														{prettyBytes(file.size, {
															bits: true,
														})}
													</TableCell>
													<TableCell>{file.modified ?? "N/A"}</TableCell>
													<TableCell>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => deleteFile(file.id)}
															disabled={isPending}
														>
															<TrashIcon className="w-4 h-4 text-red-600" />
														</Button>
													</TableCell>
													<TableCell className="flex gap-2 items-center">
														<Select
															value={targetFolderId ?? ""}
															onValueChange={(newFolderId) => {
																if (newFolderId) {
																	setMovingFileId(file.id);
																	setTargetFolderId(newFolderId);
																	handleMoveFile(file.id, newFolderId);
																}
															}}
															disabled={isMoving}
														>
															<SelectTrigger className="w-[200px]">
																<SelectValue placeholder="Move to..." />
															</SelectTrigger>
															<SelectContent className="dark:bg-background bg-stone-600">
																{folderData?.items
																	.filter(
																		(f: { id: string | null }) =>
																			f.id !== openFolderId,
																	)
																	.map(
																		(folder: { id: string; name: string }) => (
																			<SelectItem
																				className="hover:bg-transparent dark:hover:bg-transparent"
																				key={folder.id}
																				value={folder.id}
																			>
																				{folder.name}
																			</SelectItem>
																		),
																	)}
															</SelectContent>
														</Select>
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
						<DashboardHeader />
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
								</div>
							</div>

							<div
								className={
									fileViewMode === "grid"
										? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
										: "space-y-2"
								}
							>
								{filesData?.map(
									(
										file: {
											id: string;
											type: string;
											name: string;
											size: string;
											modified: boolean;
											url: string;
										},
										index: number,
									) => (
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
														<File className="w-5 h-5 text-muted-foreground" />
													</div>
													<h4 className="font-medium text-sm truncate mb-1">
														{file.name}
													</h4>
													<p className="text-xs text-muted-foreground mb-1">
														{prettyBytes(file.size as unknown as number)}
													</p>
													<p className="text-xs text-muted-foreground">
														{file.modified}
													</p>
													<div className="flex justify-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
														<Button
															size="sm"
															variant="ghost"
															onClick={() =>
																handleDownloadFile(file.url, file.name)
															}
															disabled={isDownloading}
														>
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
													</div>
												</div>
											) : (
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-3 flex-1 min-w-0">
														<File className="w-5 h-5 text-muted-foreground" />
														<div className="min-w-0 flex-1">
															<h4 className="font-medium truncate">
																{file.name}
															</h4>
															<p className="text-sm text-muted-foreground">
																{prettyBytes(file.size as unknown as number)}
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
															<MoreHorizontal className="w-4 h-4" />
														</Button>
													</div>
												</div>
											)}
										</Card>
									),
								)}
							</div>
						</Card>

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
								{folderData?.items &&
									folderData?.items?.map(
										(
											folder: {
												id: string;
												name: string;
											},
											index: number,
										) => (
											<Card
												key={folder.id}
												onClick={() =>
													setOpenFolderId(folder.id?.toString() ?? "")
												}
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
										),
									)}
							</div>
						</Card>
					</div>

					<DashboardSidebar />
				</div>
			</div>
		</div>
	);
};

export default DashboardWrapper;
