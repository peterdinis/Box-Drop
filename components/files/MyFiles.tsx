"use client";

import { FC, Key, useState } from "react";
import { Grid3X3, List, InfoIcon, ArrowRightIcon } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { useToast } from "@/hooks/shared/useToast";
import { useDeleteFile } from "@/hooks/files/useDeleteFile";
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
import { useMoveFile } from "@/hooks/files/useMoveFile";
import { MyFilesProps } from "@/types/FileTypes";
import { ITEMS_PER_PAGE } from "@/constants/applicationConstants";

const MyFiles: FC<MyFilesProps> = ({ files, folders }) => {
  const [fileViewMode, setFileViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const { toast } = useToast();
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile();
  const { mutate: moveFile } = useMoveFile();

  const totalFiles = files.length;
  const totalPages = Math.ceil(totalFiles / ITEMS_PER_PAGE);
  const paginatedFiles = files.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleMoveFile = (fileId: string, folderId: string) => {
    moveFile(
      { fileId, folderId },
      {
        onSuccess: () =>
          toast({ title: "File moved successfully", variant: "default" }),
        onError: () =>
          toast({ title: "Failed to move file", variant: "destructive" }),
      }
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Files</h3>
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
              <span>{file.name}</span>
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
                        <strong>Type:</strong> {file.type}
                      </p>
                      <p>
                        <strong>Size:</strong> {prettyBytes(file.size)}
                      </p>
                      <Select
                        onValueChange={(folderId) =>
                          handleMoveFile(file.id, folderId)
                        }
                      >
                        <SelectTrigger className="w-56">
                          <SelectValue placeholder="Move to folder" />
                        </SelectTrigger>
                        <SelectContent>
                          {folders?.items?.map((folder: {
                            id: string
                            name: string
                          }) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              {folder.name}{" "}
                              <ArrowRightIcon className="w-3 h-3 inline ml-1" />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter className="flex justify-between">
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

      {/* Updated Pagination (same style as MyFolders) */}
      {totalPages > 1 && (
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
                className={`cursor-pointer px-2 ${
                  page === currentPage ? "font-bold underline" : ""
                }`}
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
      )}
    </Card>
  );
};

export default MyFiles;
