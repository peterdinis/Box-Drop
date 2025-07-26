import { FC, useState } from "react";
import { Button } from "../ui/button";
import { Activity, Badge, Bell, Cloud, Home, LogOut, Search, Settings, Users } from "lucide-react";
import { Input } from "../ui/input";
import { useNotifications } from "@/context/NotificationContext";

const DashboardHeader: FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const { unreadCount } = useNotifications();
    return (
        <header className="border-b bg-card sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <Cloud className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold">Cloud Chest</h1>
                        </div>

                        <nav className="hidden md:flex items-center gap-6">
                            <Button variant="ghost" className="gap-2">
                                <Home className="w-4 h-4" />
                                Home
                            </Button>
                            <Button variant="ghost" className="gap-2">
                                <Users className="w-4 h-4" />
                                Shared
                            </Button>
                            <Button variant="ghost" className="gap-2">
                                <Activity className="w-4 h-4" />
                                Recent
                            </Button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search files..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 w-64"
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowNotifications(true)}
                            className="relative"
                        >
                            <Bell className="w-4 h-4" />
                            {unreadCount > 0 && (
                                <Badge
                                    className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center"
                                >
                                    {unreadCount}
                                </Badge>
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSettings(true)}
                        >
                            <Settings className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden md:inline">Sign Out</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default DashboardHeader