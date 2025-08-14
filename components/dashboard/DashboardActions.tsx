import { Share2 } from "lucide-react";
import CreateFolderModal from "../modals/CreateFolderModal";
import FileUploadModal from "../modals/FileUploadModal";

export const quickActions = [
	{
		icon: <FileUploadModal />,
		label: "Upload Files",
		color: "text-blue-500",
		component: true,
	},
	{
		icon: <CreateFolderModal />,
		label: "New Folder",
		color: "text-green-500",
		component: true,
	},
	{
		icon: <Share2 className="w-5 h-5" />,
		label: "Share",
		color: "text-purple-500",
		component: false,
	},
];
