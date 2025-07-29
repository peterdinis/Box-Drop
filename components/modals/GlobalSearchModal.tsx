"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FC, useState } from "react";


const GlobalSearchModal: FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Search className="w-4 h-4" />
					Search
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Global Search</DialogTitle>
				</DialogHeader>

			TODO		
			</DialogContent>
		</Dialog>
	);
};

export default GlobalSearchModal;
