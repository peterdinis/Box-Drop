"use client";

import { Loader2, Trash2, TrashIcon } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { type FC, useCallback, useState } from "react";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDeleteFile } from "@/hooks/files/useDeleteFile";
import { useFileDownload } from "@/hooks/files/useDownloadFile";
import { useFiles } from "@/hooks/files/useFiles";
import { useMoveFile } from "@/hooks/files/useMoveFile";
import { useFolder, useFolders } from "@/hooks/folders/useFolders";
import { useToast } from "@/hooks/shared/useToast";
import { formatDate } from "@/utils/format-date";
import MyFiles from "../files/MyFiles";
import MyFolders from "../folders/MyFolders";
import FileShareModal from "../modals/FileShareModal";
import SettingsModal from "../modals/SettingsModal";
import { Button } from "../ui/button";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";

const DashboardWrapper: FC = () => {
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

	const handleMoveFile = useCallback(
		(fileId: string, newFolderId: string) => {
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
		},
		[moveFile, toast],
	);

	const { downloadFile } = useFileDownload();

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
				<DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Folder Details</DialogTitle>
					</DialogHeader>
					<span className="mt-5">
						<Tooltip>
							<TooltipTrigger>
								<Trash2 />
							</TooltipTrigger>
							<TooltipContent>Delete Folder</TooltipContent>
						</Tooltip>
					</span>
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
						<MyFiles files={filesData} folders={folderData} />
						<MyFolders folders={folderData} />
					</div>

					<DashboardSidebar />
				</div>
			</div>
		</div>
	);
};

export default DashboardWrapper;
