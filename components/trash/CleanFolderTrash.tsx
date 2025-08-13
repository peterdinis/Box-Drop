"use client"

import type { FC } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CleanFolderTrash: FC<Props> = ({ open, onOpenChange }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to delete folders:", err);
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <AlertDialogContent asChild>
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-background rounded-xl shadow-lg p-6"
            >
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {success ? "✅ All folders deleted!" : "⚠️ Are you absolutely sure?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {success
                    ? "All folders in your trash have been permanently removed."
                    : "This action cannot be undone. This will permanently delete all folders and their contents from your trash."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              {!success && (
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin w-8 h-8" /> : "Continue 🗑️"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              )}
            </motion.div>
          </AlertDialogContent>
        )}
      </AnimatePresence>
    </AlertDialog>
  );
};

export default CleanFolderTrash;
