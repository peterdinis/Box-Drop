"use client";

import {
	ArrowRightIcon,
	FileText,
	Ghost,
	Grid3X3,
	InfoIcon,
	List,
} from "lucide-react";
import prettyBytes from "pretty-bytes";
import { type FC, useMemo, useState } from "react";
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

	const paginatedFiles = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return files.slice(start, start + ITEMS_PER_PAGE);
	}, [currentPage, files]);

	const visiblePages = useMemo(() => {
		const delta = 2;
		const start = Math.max(currentPage - delta, 1);
		const end = Math.min(currentPage + delta, totalPages);
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	}, [currentPage, totalPages]);

	const toggleSelectFile = (fileId: string) => {
		setSelectedFiles((prev) =>
			prev.includes(fileId)
				? prev.filter((id) => id !== fileId)
				: [...prev, fileId],
		);
	};

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

	const handleBulkDelete = () => {
		if (selectedFiles.length === 0) return;
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
				onError: () =>
					toast({ title: "Bulk delete failed", variant: "destructive" }),
			},
		);
	};

	const handleSingleDelete = (fileId: string) => {
		deleteFile(fileId, {
			onSuccess: () => {
				toast({ title: "File deleted successfully", variant: "default" });
			},
			onError: () =>
				toast({ title: "Failed to delete file", variant: "destructive" }),
		});
	};

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-lg font-semibold">Recent Files</h3>
				{files.length > 0 && (
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
										Are you sure you want to delete {selectedFiles.length}{" "}
										files? This action cannot be undone.
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
				)}
			</div>

			{files.length === 0 ? (
				<div className="flex flex-col items-center justify-center text-gray-400">
					<Ghost className="w-12 h-12 animate-bounce mb-4" />
					<p>No files uploaded</p>
				</div>
			) : (
				<>
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
														onClick={() => handleSingleDelete(file.id)}
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

							{visiblePages.map((page) => (
								<span
									key={page}
									onClick={() => setCurrentPage(page)}
									className={`cursor-pointer mt-2 px-2 ${page === currentPage ? "font-bold underline" : ""}`}
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
				</>
			)}
		</Card>
	);
};

export default MyFiles;
