"use client";

import { useUser } from "@clerk/nextjs";
import type { FC } from "react";
import CreateFolderModal from "../modals/CreateFolderModal";
import FileUploadModal from "../modals/FileUploadModal";
import GlobalSearchModal from "../modals/GlobalSearchModal";
import { Card } from "../ui/card";

const DashboardHeader: FC = () => {
	const { user } = useUser();

	return (
		<Card className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-xl sm:text-2xl font-bold">
						Welcome back!{" "}
						{user?.emailAddresses?.[0]?.emailAddress} 👋
					</h2>
				</div>
				<div className="flex flex-wrap gap-2">
					<FileUploadModal />
					<CreateFolderModal />
					<GlobalSearchModal />
				</div>
			</div>
		</Card>
	);
};

export default DashboardHeader;
