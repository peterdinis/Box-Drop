"use client";

import { FC, useState } from "react";
import { Grid3X3, List, Trash2 } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import CleanFolderTrash from "../trash/CleanFolderTrash";

interface Folder {
  id: string;
  name: string;
}

interface MyFoldersProps {
  folders?: { items: Folder[] };
}

const MyFolders: FC<MyFoldersProps> = ({ folders }) => {
  const [folderViewMode, setFolderViewMode] = useState<"grid" | "list">("grid");
  const [openTrashForFolder, setOpenTrashForFolder] = useState(false);

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
            {folderViewMode === "grid" ? (
              <List className="w-4 h-4" />
            ) : (
              <Grid3X3 className="w-4 h-4" />
            )}
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
        {folders?.items?.map((folder: Folder) => (
          <Card key={folder.id} className="p-4 cursor-pointer">
            {folder.name}
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default MyFolders;