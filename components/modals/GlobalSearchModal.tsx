"use client";

import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearch } from "@/hooks/shared/useSearch";

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const GlobalSearchModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = useSearch(query);

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Search className="w-4 h-4" />
          Search
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Global Search</DialogTitle>
        </DialogHeader>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search folders, files, or members..."
          className="w-full border rounded px-3 py-2 mb-4"
          autoFocus
        />

        {isLoading && (
          <div className="flex justify-center">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        )}

        {isError && (
          <p className="text-red-500">Error fetching search results.</p>
        )}

        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              key={query}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
              className="space-y-4 max-h-96 overflow-y-auto"
            >
              <section>
                <h3 className="font-semibold mb-1">Folders</h3>
                {data.folders.length === 0 && <p>No folders found.</p>}
                {data.folders.map((folder) => (
                  <div key={folder.id} className="py-1">
                    {folder.name}
                  </div>
                ))}
              </section>

              <section>
                <h3 className="font-semibold mb-1">Files</h3>
                {data.files.length === 0 && <p>No files found.</p>}
                {data.files.map((file) => (
                  <div key={file.id} className="py-1">
                    {file.name}
                  </div>
                ))}
              </section>

              <section>
                <h3 className="font-semibold mb-1">Members</h3>
                {data.members.length === 0 && <p>No members found.</p>}
                {data.members.map((member) => (
                  <div key={member.id} className="py-1">
                    {member.name} ({member.email})
                  </div>
                ))}
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearchModal;
