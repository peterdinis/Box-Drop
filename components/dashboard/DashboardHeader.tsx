"use client"

import { FC } from "react";
import { useUser } from "@clerk/nextjs";
import CreateFolderModal from "../modals/CreateFolderModal";
import FileUploadModal from "../modals/FileUploadModal";
import GlobalSearchModal from "../modals/GlobalSearchModal";
import { Card } from "../ui/card";

const DashboardHeader: FC = () => {
    const { user } = useUser()
    return (
        <Card className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2">
                        Welcome back! {user?.emailAddresses[0]?.emailAddress} 👋
                    </h2>
                </div>
                <div className="hidden md:flex gap-2">
                    <FileUploadModal />
                    <CreateFolderModal />
                    <GlobalSearchModal />
                </div>
            </div>
        </Card>
    )
}

export default DashboardHeader