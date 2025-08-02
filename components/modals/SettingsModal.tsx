import {
	Bell,
	Download,
	Globe,
	HardDrive,
	Mail,
	Monitor,
	Moon,
	Palette,
	Settings,
	Shield,
	Smartphone,
	Sun,
	Upload,
	User,
	Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/shared/use-toast";

interface SettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
	const { theme, setTheme } = useTheme();
	const { toast } = useToast();

	const [settings, setSettings] = useState({
		profile: {
			name: "John Doe",
			email: "john@company.com",
			company: "Tech Corp",
		},
		notifications: {
			emailNotifications: true,
			pushNotifications: true,
			fileSharing: true,
			storageAlerts: true,
			weeklyReports: false,
		},
		privacy: {
			profileVisibility: true,
			activityStatus: true,
			fileIndexing: true,
			analyticsOptIn: false,
		},
		storage: {
			autoSync: true,
			compressionEnabled: true,
			bandwidthLimit: false,
			offlineAccess: true,
		},
	});

	const updateSetting = (
		category: keyof typeof settings,
		key: string,
		value: any,
	) => {
		setSettings((prev) => ({
			...prev,
			[category]: {
				...prev[category],
				[key]: value,
			},
		}));
	};

	const saveSettings = () => {
		toast({
			title: "Settings saved",
			description: "Your preferences have been updated.",
			className: "bg-green-800 text-white font-bold text-xl",
		});
	};

	const themeOptions = [
		{ value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
		{ value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
		{ value: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
	];

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Settings className="w-5 h-5" />
						Settings
					</DialogTitle>
				</DialogHeader>

				<Tabs defaultValue="profile" className="w-full">
					<TabsList className="grid w-full grid-cols-5">
						<TabsTrigger value="profile">Profile</TabsTrigger>
						<TabsTrigger value="appearance">Theme</TabsTrigger>
						<TabsTrigger value="notifications">Alerts</TabsTrigger>
						<TabsTrigger value="privacy">Privacy</TabsTrigger>
						<TabsTrigger value="storage">Storage</TabsTrigger>
					</TabsList>

					{/* Profile Tab */}
					<TabsContent value="profile" className="space-y-4">
						<Card className="p-4">
							<div className="flex items-center gap-4 mb-4">
								<div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
									<User className="w-8 h-8 text-white" />
								</div>
								<div>
									<h3 className="font-semibold">Profile Picture</h3>
									<p className="text-sm text-muted-foreground">
										Update your profile image
									</p>
									<Button variant="outline" size="sm" className="mt-2">
										Change Photo
									</Button>
								</div>
							</div>
						</Card>

						<div className="space-y-4">
							<div>
								<Label htmlFor="name">Full Name</Label>
								<Input
									id="name"
									value={settings.profile.name}
									onChange={(e) =>
										updateSetting("profile", "name", e.target.value)
									}
								/>
							</div>
							<div>
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									value={settings.profile.email}
									onChange={(e) =>
										updateSetting("profile", "email", e.target.value)
									}
								/>
							</div>
							<div>
								<Label htmlFor="company">Company</Label>
								<Input
									id="company"
									value={settings.profile.company}
									onChange={(e) =>
										updateSetting("profile", "company", e.target.value)
									}
								/>
							</div>
						</div>
					</TabsContent>

					{/* Appearance Tab */}
					<TabsContent value="appearance" className="space-y-4">
						<div>
							<h3 className="font-medium mb-3">Theme Preference</h3>
							<div className="grid gap-3">
								{themeOptions.map((option) => (
									<Card
										key={option.value}
										className={`p-4 cursor-pointer transition-all duration-200 ${
											theme === option.value
												? "ring-2 ring-primary bg-primary/5"
												: "hover:bg-muted/50"
										}`}
										onClick={() => setTheme(option.value)}
									>
										<div className="flex items-center gap-3">
											<div className="text-primary">{option.icon}</div>
											<div>
												<p className="font-medium">{option.label}</p>
												<p className="text-sm text-muted-foreground">
													{option.value === "system"
														? "Adapts to your system preference"
														: `Use ${option.label.toLowerCase()} theme`}
												</p>
											</div>
										</div>
									</Card>
								))}
							</div>
						</div>

						<Card className="p-4">
							<div className="flex items-center gap-3">
								<Palette className="w-5 h-5 text-primary" />
								<div>
									<h4 className="font-medium">Color Scheme</h4>
									<p className="text-sm text-muted-foreground">
										Customize your interface colors
									</p>
								</div>
								<Button variant="outline" size="sm" className="ml-auto">
									Customize
								</Button>
							</div>
						</Card>
					</TabsContent>

					{/* Notifications Tab */}
					<TabsContent value="notifications" className="space-y-4">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Mail className="w-5 h-5 text-primary" />
									<div>
										<Label>Email Notifications</Label>
										<p className="text-sm text-muted-foreground">
											Receive updates via email
										</p>
									</div>
								</div>
								<Switch
									checked={settings.notifications.emailNotifications}
									onCheckedChange={(checked) =>
										updateSetting(
											"notifications",
											"emailNotifications",
											checked,
										)
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Smartphone className="w-5 h-5 text-primary" />
									<div>
										<Label>Push Notifications</Label>
										<p className="text-sm text-muted-foreground">
											Get notified on your device
										</p>
									</div>
								</div>
								<Switch
									checked={settings.notifications.pushNotifications}
									onCheckedChange={(checked) =>
										updateSetting("notifications", "pushNotifications", checked)
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Globe className="w-5 h-5 text-primary" />
									<div>
										<Label>File Sharing Updates</Label>
										<p className="text-sm text-muted-foreground">
											When files are shared with you
										</p>
									</div>
								</div>
								<Switch
									checked={settings.notifications.fileSharing}
									onCheckedChange={(checked) =>
										updateSetting("notifications", "fileSharing", checked)
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<HardDrive className="w-5 h-5 text-primary" />
									<div>
										<Label>Storage Alerts</Label>
										<p className="text-sm text-muted-foreground">
											Low storage warnings
										</p>
									</div>
								</div>
								<Switch
									checked={settings.notifications.storageAlerts}
									onCheckedChange={(checked) =>
										updateSetting("notifications", "storageAlerts", checked)
									}
								/>
							</div>
						</div>
					</TabsContent>

					{/* Privacy Tab */}
					<TabsContent value="privacy" className="space-y-4">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<User className="w-5 h-5 text-primary" />
									<div>
										<Label>Profile Visibility</Label>
										<p className="text-sm text-muted-foreground">
											Show your profile to team members
										</p>
									</div>
								</div>
								<Switch
									checked={settings.privacy.profileVisibility}
									onCheckedChange={(checked) =>
										updateSetting("privacy", "profileVisibility", checked)
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Zap className="w-5 h-5 text-primary" />
									<div>
										<Label>Activity Status</Label>
										<p className="text-sm text-muted-foreground">
											Show when you're online
										</p>
									</div>
								</div>
								<Switch
									checked={settings.privacy.activityStatus}
									onCheckedChange={(checked) =>
										updateSetting("privacy", "activityStatus", checked)
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Shield className="w-5 h-5 text-primary" />
									<div>
										<Label>File Indexing</Label>
										<p className="text-sm text-muted-foreground">
											Allow file content search
										</p>
									</div>
								</div>
								<Switch
									checked={settings.privacy.fileIndexing}
									onCheckedChange={(checked) =>
										updateSetting("privacy", "fileIndexing", checked)
									}
								/>
							</div>
						</div>
					</TabsContent>

					{/* Storage Tab */}
					<TabsContent value="storage" className="space-y-4">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Download className="w-5 h-5 text-primary" />
									<div>
										<Label>Auto Sync</Label>
										<p className="text-sm text-muted-foreground">
											Automatically sync files
										</p>
									</div>
								</div>
								<Switch
									checked={settings.storage.autoSync}
									onCheckedChange={(checked) =>
										updateSetting("storage", "autoSync", checked)
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Upload className="w-5 h-5 text-primary" />
									<div>
										<Label>File Compression</Label>
										<p className="text-sm text-muted-foreground">
											Compress files to save space
										</p>
									</div>
								</div>
								<Switch
									checked={settings.storage.compressionEnabled}
									onCheckedChange={(checked) =>
										updateSetting("storage", "compressionEnabled", checked)
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Zap className="w-5 h-5 text-primary" />
									<div>
										<Label>Offline Access</Label>
										<p className="text-sm text-muted-foreground">
											Cache files for offline use
										</p>
									</div>
								</div>
								<Switch
									checked={settings.storage.offlineAccess}
									onCheckedChange={(checked) =>
										updateSetting("storage", "offlineAccess", checked)
									}
								/>
							</div>
						</div>

						<Card className="p-4 bg-muted/50">
							<h4 className="font-medium mb-2">Storage Usage</h4>
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span>Used: 15.6 GB</span>
									<span>Available: 84.4 GB</span>
								</div>
								<div className="w-full bg-muted rounded-full h-2">
									<div className="bg-gradient-primary h-2 rounded-full w-[15.6%]" />
								</div>
							</div>
						</Card>
					</TabsContent>
				</Tabs>

				<div className="flex justify-end gap-2 pt-4 border-t">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={saveSettings}>Save Changes</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default SettingsModal;
