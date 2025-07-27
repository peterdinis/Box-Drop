"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Folder, Search, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";

interface GlobalSearchModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const mockResults = [
	{ type: "file", name: "Marketing Plan.pdf" },
	{ type: "file", name: "Q3 Budget.xlsx" },
	{ type: "folder", name: "Design Assets" },
	{ type: "folder", name: "Reports 2024" },
	{ type: "user", name: "Jane Doe" },
	{ type: "user", name: "John Smith" },
];

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
	const [query, setQuery] = useState("");

	useEffect(() => {
		if (!isOpen) {
			setQuery("");
		}
	}, [isOpen]);

	const filteredResults = useMemo(() => {
		if (!query.trim()) return [];
		const q = query.toLowerCase();
		return mockResults.filter((item) => item.name.toLowerCase().includes(q));
	}, [query]);

	const getIcon = (type: string) => {
		switch (type) {
			case "file":
				return <FileText className="w-4 h-4 text-blue-500" />;
			case "folder":
				return <Folder className="w-4 h-4 text-yellow-500" />;
			case "user":
				return <User className="w-4 h-4 text-green-500" />;
			default:
				return null;
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTrigger>
                <Button className="gap-2">
					<Search className="w-4 h-4" />
					Search for files
				</Button>
            </DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Global Search</DialogTitle>
				</DialogHeader>
				<Input
					autoFocus
					placeholder="Search files, folders, team members..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<ScrollArea className="mt-4 max-h-60 space-y-2">
					{filteredResults.length === 0 ? (
						<p className="text-sm text-muted-foreground px-1">No results found.</p>
					) : (
						filteredResults.map((item, index) => (
							<div
								key={index}
								className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted cursor-pointer transition-colors"
							>
								{getIcon(item.type)}
								<span className="text-sm">{item.name}</span>
							</div>
						))
					)}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default GlobalSearchModal;
