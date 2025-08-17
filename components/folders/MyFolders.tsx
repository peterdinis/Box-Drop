"use client";

import { Folder, Grid3X3, List, Trash2 } from "lucide-react";
import { type FC, useState, useMemo } from "react";
import type { FolderItem, MyFoldersProps } from "@/types/FoldersTypes";
import CleanFolderTrash from "../trash/CleanFolderTrash";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/shared/useToast";
import { useUpdateFolder } from "@/hooks/folders/useFolders";

const MyFolders: FC<MyFoldersProps> = ({ folders, pageSize = 6 }) => {
  const [folderViewMode, setFolderViewMode] = useState<"grid" | "list">("grid");
  const [openTrashForFolder, setOpenTrashForFolder] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<FolderItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newFolderName, setNewFolderName] = useState<string>("");

  const { toast } = useToast();
  const { mutate: updateFolder, isPending: isUpdating } = useUpdateFolder();

  const totalFolders = folders?.items?.length || 0;
  const totalPages = Math.ceil(totalFolders / pageSize);

  const paginatedFolders = folders?.items?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleUpdateFolder = () => {
    if (!selectedFolder || !newFolderName || newFolderName === selectedFolder.name)
      return;

    updateFolder(
      { id: selectedFolder.id, name: newFolderName },
      {
        onSuccess: () => {
          toast({
            title: "Folder name updated",
            duration: 2000,
            className: "bg-green-800 text-white font-bold text-base",
          });
          setSelectedFolder(null);
        },
        onError: (error: any) => {
          toast({
            title: "Failed to update folder: " + error.message,
            duration: 2000,
            className: "bg-red-800 text-white font-bold text-base",
          });
        },
      },
    );
  };

  // Presunuté do useMemo
  const visiblePages = useMemo(() => {
    const delta = 2;
    const start = Math.max(currentPage - delta, 1);
    const end = Math.min(currentPage + delta, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Folders</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFolderViewMode(folderViewMode === "grid" ? "list" : "grid")
            }
          >
            {folderViewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </Button>
          <Button onClick={() => setOpenTrashForFolder(true)}>
            <Trash2 />
          </Button>
          <CleanFolderTrash
            open={openTrashForFolder}
            onOpenChange={setOpenTrashForFolder}
          />
        </div>
      </div>

      <div
        className={
          folderViewMode === "grid"
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-2"
        }
      >
        {paginatedFolders?.map((folder: FolderItem) => (
          <Card
            key={folder.id}
            className="p-4 cursor-pointer flex items-center gap-2"
            onClick={() => {
              setSelectedFolder(folder);
              setNewFolderName(folder.name);
            }}
          >
            <Folder className="w-5 h-5 text-gray-500" />
            <span>{folder.name}</span>
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
              className={`mt-2 cursor-pointer px-2 ${
                page === currentPage ? "font-bold text-blue-600" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </span>
          ))}

          <PaginationNext
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </PaginationNext>
        </Pagination>
      </div>

      <Dialog
        open={!!selectedFolder}
        onOpenChange={() => setSelectedFolder(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Folder Details</DialogTitle>
          </DialogHeader>

          {selectedFolder && (
            <div className="space-y-4">
              <p className="flex items-center gap-2">
                <strong>Name:</strong>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  disabled={isUpdating}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUpdateFolder}
                  disabled={isUpdating}
                >
                  Update
                </Button>
              </p>

              <div>
                <h4 className="font-semibold mb-2">Files</h4>
                {selectedFolder.files && selectedFolder.files.length > 0 ? (
                  <ul className="space-y-1">
                    {selectedFolder.files.map((file) => (
                      <li key={file.id} className="flex items-center gap-2">
                        <span>📄</span>
                        {file.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No files in this folder.</p>
                )}
              </div>
            </div>
          )}

          <DialogClose asChild>
            <Button className="mt-4">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MyFolders;
