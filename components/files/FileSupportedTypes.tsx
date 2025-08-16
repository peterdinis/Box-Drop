"use client";
import { motion } from "framer-motion";
import { FileCode, FileImage, FileJson, FileText, Video } from "lucide-react";
import type { FC, JSX } from "react";

interface FileTypeConfig {
	maxFileSize: string;
	maxFileCount: number;
	icon: JSX.Element;
}

const supportedFiles: Record<string, FileTypeConfig> = {
	"application/msword": {
		maxFileSize: "8MB",
		maxFileCount: 5,
		icon: <FileText className="w-6 h-6 text-blue-500" />,
	},
	pdf: {
		maxFileSize: "8MB",
		maxFileCount: 5,
		icon: <FileText className="w-6 h-6 text-red-500" />,
	},
	"application/json": {
		maxFileSize: "8MB",
		maxFileCount: 5,
		icon: <FileJson className="w-6 h-6 text-green-500" />,
	},
	"application/javascript": {
		maxFileSize: "8MB",
		maxFileCount: 5,
		icon: <FileCode className="w-6 h-6 text-yellow-500" />,
	},
	"application/node": {
		maxFileSize: "8MB",
		maxFileCount: 5,
		icon: <FileCode className="w-6 h-6 text-green-600" />,
	},
	"application/express": {
		maxFileSize: "16MB",
		maxFileCount: 5,
		icon: <FileCode className="w-6 h-6 text-purple-500" />,
	},
	"video/jpeg": {
		maxFileSize: "8MB",
		maxFileCount: 5,
		icon: <Video className="w-6 h-6 text-pink-500" />,
	},
	"text/css": {
		maxFileSize: "8MB",
		maxFileCount: 5,
		icon: <FileCode className="w-6 h-6 text-blue-400" />,
	},
	"text/html": {
		maxFileSize: "8MB",
		maxFileCount: 5,
		icon: <FileCode className="w-6 h-6 text-orange-500" />,
	},
	"text/markdown": {
		maxFileSize: "8MB",
		maxFileCount: 5,
		icon: <FileText className="w-6 h-6 text-gray-600" />,
	},
	"image/png": {
		maxFileSize: "8MB",
		maxFileCount: 5,
		icon: <FileImage className="w-6 h-6 text-green-400" />,
	},
	"image/jpeg": {
		maxFileSize: "8MB",
		maxFileCount: 5,
		icon: <FileImage className="w-6 h-6 text-blue-400" />,
	},
	"image/gif": {
		maxFileSize: "8MB",
		maxFileCount: 5,
		icon: <FileImage className="w-6 h-6 text-pink-400" />,
	},
};

const FileSupportedTypes: FC = () => {
	const sortedFiles = Object.entries(supportedFiles).sort(([a], [b]) =>
		a.localeCompare(b),
	);

	return (
		<div>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
				{sortedFiles.map(([type, config], index) => (
					<motion.div
						key={type}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05, duration: 0.3 }}
						className="flex flex-col items-center justify-center bg-white dark:bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-center p-3 sm:p-4 border border-gray-100 dark:border-gray-800 min-h-[100px] sm:min-h-[120px]"
					>
						<div className="mb-2">{config.icon}</div>
						<span className="font-medium text-xs sm:text-sm text-gray-800 dark:text-sky-50 mb-1 px-1 leading-tight break-all">
							{type}
						</span>
						<span className="text-xs text-gray-500 dark:text-sky-200">
							Max {config.maxFileCount} / {config.maxFileSize}
						</span>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default FileSupportedTypes;
