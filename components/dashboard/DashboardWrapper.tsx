"use client";

import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import {
	Archive,
	Download,
	Edit,
	Eye,
	File,
	FileText,
	FolderIcon,
	Grid3X3,
	HardDrive,
	Image,
	List,
	MoreHorizontal,
	Music,
	Share2,
	Shield,
	Star,
	TrendingUp,
	User,
	Video,
} from "lucide-react";
import Link from "next/link";
import {
	type FC,
	type Key,
	useState,
} from "react";
import { useTeam } from "@/context/TeamContext";
import { useFolders } from "@/hooks/folders/useFolders";
import CreateFolderModal from "../modals/CreateFolderModal";
import FileShareModal from "../modals/FileShareModal";
import FileUploadModal from "../modals/FileUploadModal";
import SettingsModal from "../modals/SettingsModal";
import NotificationPanel from "../notifications/NotificationsPanel";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import GlobalSearchModal from "../modals/GlobalSearchModal";

const DashboardWrapper: FC = () => {
	const [fileViewMode, setFileViewMode] = useState<"grid" | "list">("grid");
	const [folderViewMode, setFolderViewMode] = useState<"grid" | "list">("grid");

	const [showNotifications, setShowNotifications] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const { data: folderData } = useFolders();

	const [shareModal, setShareModal] = useState<{
		isOpen: boolean;
		fileName: string;
		fileType: string;
	}>({
		isOpen: false,
		fileName: "",
		fileType: "",
	});

	const recentFiles = [
		{
			id: "1",
			name: "Project Proposal.pdf",
			type: "document",
			size: "2.4 MB",
			modified: "2 hours ago",
			starred: true,
		},
		{
			id: "2",
			name: "Team Photo.jpg",
			type: "image",
			size: "5.1 MB",
			modified: "1 day ago",
			starred: false,
		},
		{
			id: "3",
			name: "Budget 2024.xlsx",
			type: "document",
			size: "1.2 MB",
			modified: "3 days ago",
			starred: true,
		},
		{
			id: "4",
			name: "Demo Video.mp4",
			type: "video",
			size: "25.8 MB",
			modified: "1 week ago",
			starred: false,
		},
	];

	const quickActions = [
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
		{
			icon: <Star className="w-5 h-5" />,
			label: "Starred",
			color: "text-yellow-500",
			component: false,
		},
	];

	const storageData = {
		used: 15.6,
		total: 100,
		percentage: 15.6,
	};

	const { teamMembers } = useTeam();

	const getFileIcon = (type: string) => {
		switch (type) {
			case "image":
				return <Image className="w-5 h-5 text-green-500" />;
			case "video":
				return <Video className="w-5 h-5 text-red-500" />;
			case "audio":
				return <Music className="w-5 h-5 text-purple-500" />;
			case "archive":
				return <Archive className="w-5 h-5 text-orange-500" />;
			case "document":
				return <FileText className="w-5 h-5 text-blue-500" />;
			default:
				return <File className="w-5 h-5 text-muted-foreground" />;
		}
	};

	const handleShareFile = (fileName: string, fileType: string) => {
		setShareModal({ isOpen: true, fileName, fileType });
	};

	const [showGlobalSearch, setShowGlobalSearch] = useState(false);

	const { user } = useUser();

	return (
		<div className="min-h-screen bg-background">
			<NotificationPanel
				isOpen={showNotifications}
				onClose={() => setShowNotifications(false)}
			/>
			<SettingsModal
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
			/>
			<FileShareModal
				isOpen={shareModal.isOpen}
				onClose={() =>
					setShareModal({ isOpen: false, fileName: "", fileType: "" })
				}
				fileName={shareModal.fileName}
				fileType={shareModal.fileType}
			/>

			<div className="container mx-auto px-6 py-6">
				<div className="grid lg:grid-cols-4 gap-6">
					<div className="lg:col-span-3 space-y-6">
						<Card className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-2xl font-bold mb-2">
										Welcome back! {user?.emailAddresses[0]?.emailAddress}👋
									</h2>
									<p className="text-muted-foreground">
										You have {recentFiles.length} recent files and{" "}
										{storageData.used} GB of storage used.
									</p>
								</div>
								<div className="hidden md:flex gap-2">
									<FileUploadModal />
									<CreateFolderModal />
									<GlobalSearchModal />
								</div>
							</div>
						</Card>

						{/* Quick Actions */}
						<div className="grid grid-cols-2 md:grid-cols-2 gap-4">
							{quickActions.slice(2).map((action, index) => (
								<Card
									key={index + 2}
									className="p-4 hover:shadow-hover transition-all duration-200 cursor-pointer group animate-scale-in"
									style={{ animationDelay: `${(index + 2) * 0.1}s` }}
								>
									<div className="text-center">
										<div
											className={`${action.color} mb-3 flex justify-center group-hover:scale-110 transition-transform`}
										>
											{action.icon}
										</div>
										<p className="text-sm font-medium">{action.label}</p>
									</div>
								</Card>
							))}
						</div>

						{/* Recent Files */}
						<Card className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-lg font-semibold">Recent Files</h3>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											setFileViewMode(fileViewMode === "grid" ? "list" : "grid")
										}
									>
										{fileViewMode === "grid" ? (
											<List className="w-4 h-4" />
										) : (
											<Grid3X3 className="w-4 h-4" />
										)}
									</Button>
									<Button variant="outline" size="sm">
										<Link href="/files">View All</Link>
									</Button>
								</div>
							</div>

							<div
								className={
									fileViewMode === "grid"
										? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
										: "space-y-2"
								}
							>
								{recentFiles.map((file, index) => (
									<Card
										key={file.id}
										className={`group cursor-pointer hover:shadow-hover transition-all duration-200 animate-fade-in ${fileViewMode === "grid" ? "p-4" : "p-3"
											}`}
										style={{ animationDelay: `${index * 0.1}s` }}
									>
										{fileViewMode === "grid" ? (
											<div className="text-center">
												<div className="flex justify-center mb-3">
													{getFileIcon(file.type)}
												</div>
												<h4 className="font-medium text-sm truncate mb-1">
													{file.name}
												</h4>
												<p className="text-xs text-muted-foreground mb-1">
													{file.size}
												</p>
												<p className="text-xs text-muted-foreground">
													{file.modified}
												</p>
												<div className="flex justify-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
													<Button size="sm" variant="ghost">
														<Download className="w-3 h-3" />
													</Button>
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															handleShareFile(file.name, file.type)
														}
													>
														<Share2 className="w-3 h-3" />
													</Button>
													<Button size="sm" variant="ghost">
														<Star
															className={`w-3 h-3 ${file.starred ? "fill-yellow-400 text-yellow-400" : ""}`}
														/>
													</Button>
												</div>
											</div>
										) : (
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3 flex-1 min-w-0">
													{getFileIcon(file.type)}
													<div className="min-w-0 flex-1">
														<h4 className="font-medium truncate">
															{file.name}
														</h4>
														<p className="text-sm text-muted-foreground">
															{file.modified} • {file.size}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															handleShareFile(file.name, file.type)
														}
													>
														<Share2 className="w-4 h-4" />
													</Button>
													<Button size="sm" variant="ghost">
														<Star
															className={`w-4 h-4 ${file.starred ? "fill-yellow-400 text-yellow-400" : ""}`}
														/>
													</Button>
													<Button size="sm" variant="ghost">
														<MoreHorizontal className="w-4 h-4" />
													</Button>
												</div>
											</div>
										)}
									</Card>
								))}
							</div>
						</Card>

						<Card className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-lg font-semibold">Recent Folders</h3>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											setFolderViewMode(
												folderViewMode === "grid" ? "list" : "grid",
											)
										}
									>
										{folderViewMode === "grid" ? (
											<List className="w-4 h-4" />
										) : (
											<Grid3X3 className="w-4 h-4" />
										)}
									</Button>
								</div>
							</div>

							<div
								className={
									folderViewMode === "grid"
										? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
										: "space-y-2"
								}
							>
								{folderData?.map(
									(
										folder: {
											id: Key | null | undefined;
											name: string
											createdAt: string | number | Date;
										},
										index: number,
									) => (
										<Card
											key={folder.id}
											className={`group cursor-pointer hover:shadow-hover transition-all duration-200 animate-fade-in ${folderViewMode === "grid" ? "p-4" : "p-3"
												}`}
											style={{ animationDelay: `${index * 0.1}s` }}
										>
											{folderViewMode === "grid" ? (
												<div className="text-center">
													<div className="flex justify-center mb-3">
														<FolderIcon className="w-5 h-5 text-yellow-500" />
													</div>
													<h4 className="font-medium text-sm truncate mb-1">
														{folder.name}
													</h4>
													<p className="text-xs text-muted-foreground mb-1">
														{folder.createdAt
															? format(new Date(folder.createdAt), "PPP") // e.g. "Jul 28, 2025"
															: "—"}
													</p>
												</div>
											) : (
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-3 flex-1 min-w-0">
														<FolderIcon className="w-5 h-5 text-yellow-500" />
														<div className="min-w-0 flex-1">
															<h4 className="font-medium truncate">
																{folder.name}
															</h4>
															<p className="text-xs text-muted-foreground mb-1">
																{folder.createdAt
																	? format(new Date(folder.createdAt), "PPP") // e.g. "Jul 28, 2025"
																	: "—"}
															</p>
														</div>
													</div>
													<div className="flex items-center gap-2">
														<Button size="sm" variant="ghost">
															<MoreHorizontal className="w-4 h-4" />
														</Button>
													</div>
												</div>
											)}
										</Card>
									),
								)}
							</div>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Storage Usage */}
						<Card className="p-6">
							<div className="flex items-center gap-2 mb-4">
								<HardDrive className="w-5 h-5 text-primary" />
								<h3 className="font-semibold">Storage</h3>
							</div>

							<div className="space-y-4">
								<div>
									<div className="flex justify-between text-sm mb-2">
										<span>{storageData.used} GB used</span>
										<span>{storageData.total} GB total</span>
									</div>
									<div className="w-full bg-muted rounded-full h-2">
										<div
											className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
											style={{ width: `${storageData.percentage}%` }}
										/>
									</div>
								</div>
							</div>
						</Card>

						{/* Quick Stats */}
						<Card className="p-6">
							<h3 className="font-semibold mb-4">Quick Stats</h3>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<TrendingUp className="w-4 h-4 text-green-500" />
										<span className="text-sm">Files uploaded</span>
									</div>
									<span className="font-medium">24</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Share2 className="w-4 h-4 text-blue-500" />
										<span className="text-sm">Files shared</span>
									</div>
									<span className="font-medium">8</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Shield className="w-4 h-4 text-purple-500" />
										<span className="text-sm">Security score</span>
									</div>
									<span className="font-medium text-green-500">98%</span>
								</div>
							</div>
						</Card>

						{/* Team Members */}
						<Card className="p-6">
							<h3 className="font-semibold mb-4">Team Members</h3>
							<div className="space-y-3">
								{teamMembers.slice(0, 4).map((member, index) => (
									<div
										key={member.id}
										className="flex items-center gap-3 animate-fade-in"
										style={{ animationDelay: `${index * 0.1}s` }}
									>
										<div className="relative">
											<div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
												<User className="w-4 h-4 text-primary" />
											</div>
											<div
												className={`absolute -bottom-1 -right-1 w-3 h-3 ${member.status === "online"
														? "bg-green-500"
														: member.status === "away"
															? "bg-yellow-500"
															: "bg-gray-400"
													} rounded-full border-2 border-background`}
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate">
												{member.name}
											</p>
											<div className="flex items-center gap-1">
												<Badge variant="outline" className="text-xs">
													{member.role}
												</Badge>
												<div className="flex gap-1 ml-1">
													{member.permissions.canView && (
														<Eye className="w-3 h-3 text-green-500" />
													)}
													{member.permissions.canEdit && (
														<Edit className="w-3 h-3 text-purple-500" />
													)}
												</div>
											</div>
										</div>
									</div>
								))}
								<Button variant="outline" size="sm" className="w-full mt-3">
									View All Members
								</Button>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardWrapper;
