"use client";

import {
	AlertTriangle,
	Bell,
	Check,
	CheckCheck,
	CheckCircle,
	Info,
	Trash2,
	X,
	XCircle,
} from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/context/NotificationContext";

interface NotificationPanelProps {
	isOpen: boolean;
	onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
	isOpen,
	onClose,
}) => {
	const {
		notifications,
		markAsRead,
		markAllAsRead,
		deleteNotification,
		unreadCount,
	} = useNotifications();

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case "success":
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case "warning":
				return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
			case "error":
				return <XCircle className="w-4 h-4 text-red-500" />;
			default:
				return <Info className="w-4 h-4 text-blue-500" />;
		}
	};

	const formatTimestamp = (timestamp: Date) => {
		const now = new Date();
		const diffInMinutes = Math.floor(
			(now.getTime() - timestamp.getTime()) / (1000 * 60),
		);

		if (diffInMinutes < 1) return "Just now";
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
		if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
		return `${Math.floor(diffInMinutes / 1440)}d ago`;
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md max-h-[80vh]">
				<DialogHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Bell className="w-5 h-5" />
							<DialogTitle>Notifications</DialogTitle>
							{unreadCount > 0 && (
								<Badge
									variant="secondary"
									className="bg-primary text-primary-foreground"
								>
									{unreadCount}
								</Badge>
							)}
						</div>
						{notifications.length > 0 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={markAllAsRead}
								className="gap-2"
							>
								<CheckCheck className="w-4 h-4" />
								Mark all read
							</Button>
						)}
					</div>
				</DialogHeader>

				<ScrollArea className="max-h-96">
					{notifications.length === 0 ? (
						<Card className="p-6 text-center">
							<Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
							<h3 className="font-medium mb-1">No notifications</h3>
							<p className="text-sm text-muted-foreground">
								You're all caught up! We'll notify you when something new
								happens.
							</p>
						</Card>
					) : (
						<div className="space-y-2">
							{notifications.map((notification) => (
								<Card
									key={notification.id}
									className={`p-4 transition-all duration-200 hover:shadow-hover ${
										!notification.read ? "bg-primary/5 border-primary/20" : ""
									}`}
								>
									<div className="flex items-start gap-3">
										{getNotificationIcon(notification.type)}
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-2">
												<div className="flex-1 min-w-0">
													<h4 className="font-medium text-sm mb-1">
														{notification.title}
													</h4>
													<p className="text-sm text-muted-foreground mb-2 line-clamp-2">
														{notification.message}
													</p>
													<p className="text-xs text-muted-foreground">
														{formatTimestamp(notification.timestamp)}
													</p>
												</div>
												<div className="flex items-center gap-1">
													{!notification.read && (
														<Button
															variant="ghost"
															size="sm"
															onClick={() => markAsRead(notification.id)}
															className="w-6 h-6 p-0"
														>
															<Check className="w-3 h-3" />
														</Button>
													)}
													<Button
														variant="ghost"
														size="sm"
														onClick={() => deleteNotification(notification.id)}
														className="w-6 h-6 p-0 text-muted-foreground hover:text-destructive"
													>
														<X className="w-3 h-3" />
													</Button>
												</div>
											</div>
										</div>
									</div>
								</Card>
							))}
						</div>
					)}
				</ScrollArea>

				{notifications.length > 0 && (
					<div className="flex justify-center pt-4 border-t">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								notifications.forEach((n) => deleteNotification(n.id));
							}}
							className="gap-2 text-muted-foreground hover:text-destructive"
						>
							<Trash2 className="w-4 h-4" />
							Clear all
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default NotificationPanel;
