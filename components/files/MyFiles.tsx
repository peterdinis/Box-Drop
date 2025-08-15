"use client";

import { FC, useState } from "react";
import { Grid3X3, List, TrashIcon } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "@/hooks/shared/useToast";
import { useDeleteFile } from "@/hooks/files/useDeleteFile";
import { useMoveFile } from "@/hooks/files/useMoveFile";
import { Folder } from "@/types/SearchTypes";

interface File {
  id: string;
  type: string;
  name: string;
  size: number;
  modified?: boolean;
  url: string;
}

interface MyFilesProps {
  files: File[];
  folders: any
}

const MyFiles: FC<MyFilesProps> = ({ files, folders }) => {
  const [fileViewMode, setFileViewMode] = useState<"grid" | "list">("grid");
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);
  const [, setMovingFileId] = useState<string | null>(null);

  const { toast } = useToast();
  const { mutate: deleteFile, isPending } = useDeleteFile();
  const { mutate: moveFile, isPending: isMoving } = useMoveFile();

  const handleMoveFile = (fileId: string, newFolderId: string) => {
    moveFile(
      { fileId, folderId: newFolderId },
      {
        onSuccess: () => {
          setMovingFileId(null);
          setTargetFolderId("");
          toast({ title: "File moved successfully", duration: 2000, className: "bg-green-800 text-white font-bold" });
        },
        onError: (error) => {
          toast({ title: "Error moving file: " + error.message, duration: 2000, className: "bg-red-800 text-white font-bold" });
        },
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
          onClick={() => setFileViewMode(fileViewMode === "grid" ? "list" : "grid")}
        >
          {fileViewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
        </Button>
      </div>

      <div className={fileViewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
        {files.map((file, index) => (
          <Card key={file.id} className={`group cursor-pointer hover:shadow-hover transition-all duration-200 ${fileViewMode === "grid" ? "p-4" : "p-3"}`}>
            <div className="flex justify-between items-center mb-2">
              <span>{file.name}</span>
              <Button variant="ghost" size="icon" onClick={() => deleteFile(file.id)} disabled={isPending}>
                <TrashIcon className="w-4 h-4 text-red-600" />
              </Button>
            </div>
            <p>{prettyBytes(file.size)}</p>
            {fileViewMode === "list" && (
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
                  {folders.items && folders.items?.map((folder: {
                    id: string;
                    name: string;
                  }) => (
                    <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default MyFiles;