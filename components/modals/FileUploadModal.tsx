"use client";

import { Upload } from "lucide-react";
import { type FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import FileUploader from "../files/FileUpdloader";
import FileSupportedTypes from "../files/FileSupportedTypes";

const FileUploadModal: FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Upload className="w-4 h-4" />
					Upload Files
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Upload Files</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					<FileUploader />
				</div>

				<div className="space-x-6">
					<FileSupportedTypes />
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default FileUploadModal;
