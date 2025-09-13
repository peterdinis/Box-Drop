"use client";

import { FolderPlus } from "lucide-react";
import { type FC, type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateFolder } from "@/hooks/folders/useFolders";
import { useToast } from "@/hooks/shared/useToast";

interface CreateFolderModalProps {
	onFolderCreate?: (folderName: string) => void;
}

const CreateFolderModal: FC<CreateFolderModalProps> = ({ onFolderCreate }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [folderName, setFolderName] = useState("");
	const { toast } = useToast()
	const createFolder = useCreateFolder();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!folderName.trim()) return;

		createFolder.mutate(folderName, {
			onSuccess: () => {
				onFolderCreate?.(folderName);

				toast({
					title: "Folder created",
					description: `"${folderName}" has been added to your files.`,
					className: "bg-green-800 text-white font-bold text-base",
				});

				setFolderName("");
				setIsOpen(false);
			},
			onError: (err) => {
				toast({
					title: "Error",
					description: err?.message ?? "Something went wrong.",
					variant: "destructive",
					className: "bg-red-800 text-white font-bold text-base",
				});
			},
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="gap-2">
					<FolderPlus className="w-4 h-4" />
					New Folder
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Create New Folder</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="text-sm font-medium mb-2 block">
							Folder Name
						</label>
						<Input
							placeholder="Enter folder name"
							value={folderName}
							onChange={(e) => setFolderName(e.target.value)}
							autoFocus
							disabled={createFolder.isPending}
						/>
					</div>
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsOpen(false)}
							disabled={createFolder.isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={!folderName.trim() || createFolder.isPending}
						>
							{createFolder.isPending ? "Creating..." : "Create Folder"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateFolderModal;
