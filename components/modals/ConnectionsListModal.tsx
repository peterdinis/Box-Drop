// components/connections/ConnectionsListModal.tsx

import type { FC } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Connection } from "@/types/ConnectionTypes";
import { DataTable } from "../connections/data-table";
import { columns } from "../connections/tableColumns";

const dummyConnections: Connection[] = [
	{
		id: "1",
		name: "Alice Smith",
		email: "alice@example.com",
		status: "accepted",
		role: "admin",
	},
	{
		id: "2",
		name: "Bob Johnson",
		email: "bob@example.com",
		status: "pending",
		role: "member",
	},
	{
		id: "3",
		name: "Charlie Davis",
		email: "charlie@example.com",
		status: "blocked",
		role: "member",
	},
];

const ConnectionsListModal: FC = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="link">My Connections</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-4xl">
				<DialogHeader>
					<DialogTitle>Your Connections</DialogTitle>
					<DialogDescription>
						List of people you're connected with.
					</DialogDescription>
				</DialogHeader>
				<div className="pt-4">
					<DataTable columns={columns} data={dummyConnections} />
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ConnectionsListModal;
