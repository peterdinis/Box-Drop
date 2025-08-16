"use client";

import { ArrowRightIcon, Grid3X3, InfoIcon, List } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { type FC, useState } from "react";
import { ITEMS_PER_PAGE } from "@/constants/applicationConstants";
import { useBulkDeleteFiles } from "@/hooks/files/useBulkDelete";
import { useDeleteFile } from "@/hooks/files/useDeleteFile";
import { useMoveFile } from "@/hooks/files/useMoveFile";
import { useToast } from "@/hooks/shared/useToast";
import type { MyFilesProps } from "@/types/FileTypes";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import {
	Pagination,
	PaginationNext,
	PaginationPrevious,
} from "../ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

const MyFiles: FC<MyFilesProps> = ({ files, folders }) => {
	const [fileViewMode, setFileViewMode] = useState<"grid" | "list">("grid");
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
	const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);

	const { toast } = useToast();
	const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile();
	const { mutate: moveFile } = useMoveFile();
	const { mutate: bulkDeleteFiles, isPending: isBulkDeleting } =
		useBulkDeleteFiles();

	const totalFiles = files.length;
	const totalPages = Math.ceil(totalFiles / ITEMS_PER_PAGE);
	const paginatedFiles = files.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	const handleMoveFile = (fileId: string, folderId: string) => {
		moveFile(
			{ fileId, folderId },
			{
				onSuccess: () =>
					toast({ title: "File moved successfully", variant: "default" }),
				onError: () =>
					toast({ title: "Failed to move file", variant: "destructive" }),
			},
		);
	};

	const toggleSelectFile = (fileId: string) => {
		setSelectedFiles((prev) =>
			prev.includes(fileId)
				? prev.filter((id) => id !== fileId)
				: [...prev, fileId],
		);
	};

	const handleBulkDelete = () => {
		bulkDeleteFiles(
			{ fileIds: selectedFiles },
			{
				onSuccess: () => {
					toast({
						title: `Deleted ${selectedFiles.length} files successfully`,
						variant: "default",
					});
					setSelectedFiles([]);
					setOpenBulkDeleteDialog(false);
				},
				onError: () => {
					toast({ title: "Bulk delete failed", variant: "destructive" });
				},
			},
		);
	};

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-lg font-semibold">Recent Files</h3>
				<div className="flex gap-2">
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

					{/* Bulk Delete Trigger */}
					<AlertDialog
						open={openBulkDeleteDialog}
						onOpenChange={setOpenBulkDeleteDialog}
					>
						<AlertDialogTrigger asChild>
							<Button
								variant="destructive"
								disabled={selectedFiles.length === 0}
							>
								Delete Selected ({selectedFiles.length})
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete Selected Files?</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to delete {selectedFiles.length} files?
									This action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleBulkDelete}
									disabled={isBulkDeleting}
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>

			<div
				className={
					fileViewMode === "grid"
						? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
						: "space-y-2"
				}
			>
				{paginatedFiles.map((file) => (
					<Card
						key={file.id}
						className={`group cursor-pointer hover:shadow-hover transition-all duration-200 ${
							fileViewMode === "grid" ? "p-4" : "p-3"
						}`}
					>
						<div className="flex justify-between items-center mb-2">
							<div className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={selectedFiles.includes(file.id)}
									onChange={() => toggleSelectFile(file.id)}
									className="w-4 h-4"
								/>
								<span>{file.name}</span>
							</div>

							<div className="flex gap-2 items-center">
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="ghost" size="icon">
											<InfoIcon className="w-4 h-4 text-blue-600" />
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>File Details</DialogTitle>
											<DialogDescription>
												Info about <strong>{file.name}</strong>
											</DialogDescription>
										</DialogHeader>
										<div className="space-y-4">
											<p>
												<strong>Size:</strong> {prettyBytes(file.size)}
											</p>
											<Select
												onValueChange={(folderId) =>
													handleMoveFile(file.id, folderId)
												}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Move to folder" />
												</SelectTrigger>
												<SelectContent>
													{folders?.items?.map(
														(folder: { id: string; name: string }) => (
															<SelectItem key={folder.id} value={folder.id}>
																{folder.name}{" "}
																<ArrowRightIcon className="w-3 h-3 inline ml-1" />
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
										</div>
										<DialogFooter className="flex justify-between mt-5">
											<Button
												variant="destructive"
												onClick={() => deleteFile(file.id)}
												disabled={isDeleting}
											>
												Delete
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>
						</div>
						<p>{prettyBytes(file.size)}</p>
					</Card>
				))}
			</div>

			<div className="flex justify-center mt-4">
				<Pagination>
					<PaginationPrevious
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
					>
						Prev
					</PaginationPrevious>

					{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
						<span
							key={page}
							onClick={() => setCurrentPage(page)}
							className={`cursor-pointer mt-2 ${page === currentPage ? "font-bold underline" : ""}`}
						>
							{page}
						</span>
					))}

					<PaginationNext
						onClick={() =>
							setCurrentPage((prev) => Math.min(prev + 1, totalPages))
						}
					>
						Next
					</PaginationNext>
				</Pagination>
			</div>
		</Card>
	);
};

export default MyFiles;
