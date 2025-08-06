// components/connections/tableColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Connection } from "@/types/ConnectionTypes";

export const columns: ColumnDef<Connection>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.getValue("status") as Connection["status"];
			return (
				<Badge
					variant={
						status === "accepted"
							? "default"
							: status === "pending"
								? "secondary"
								: "destructive"
					}
				>
					{status}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const connection = row.original;

			const handleChangeRole = (newRole: "member" | "admin") => {
				console.log(`Change role for ${connection.name} to ${newRole}`);
				// Add your mutation or API call here
			};

			const handleDelete = () => {
				console.log(`Delete connection ${connection.name}`);
				// Add your mutation or API call here
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => handleChangeRole("member")}>
							Set as Member
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleChangeRole("admin")}>
							Set as Admin
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleDelete}
							className="text-red-600 focus:text-red-600"
						>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
