"use client";

import { HardDrive, Share2, TrendingUp } from "lucide-react";
import type { FC } from "react";
import { useFiles } from "@/hooks/files/useFiles";
import { useStorageUsage } from "@/hooks/storage/useStorage";
import ConnectionsWrapper from "../connections/ConnectionsWrapper";
import { Card } from "../ui/card";

const DashboardSidebar: FC = () => {
	const { data: storageUsage } = useStorageUsage();
	const usedFormatted = storageUsage?.usedFormatted;
	const limitFormatted = storageUsage?.limitFormatted;
	const { data: filesData } = useFiles();

	return (
		<div className="space-y-6">
			<Card className="p-6">
				<div className="flex items-center gap-2 mb-4">
					<HardDrive className="w-5 h-5 text-primary" />
					<h3 className="font-semibold">Storage</h3>
				</div>
				<div className="space-y-4">
					<div>
						<div className="flex justify-between text-sm mb-2">
							<span>{usedFormatted} used</span>
							<span>{limitFormatted} total</span>
						</div>
					</div>
				</div>
			</Card>

			<Card className="p-6">
				<h3 className="font-semibold mb-4">Quick Stats</h3>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<TrendingUp className="w-4 h-4 text-green-500" />
							<span className="text-sm">Files uploaded</span>
						</div>
						<span className="font-medium">
							{filesData ? filesData.length : 0}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Share2 className="w-4 h-4 text-blue-500" />
							<span className="text-sm">Files shared</span>
						</div>
						<span className="font-medium">TODO</span>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default DashboardSidebar;
