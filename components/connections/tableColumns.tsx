// components/connections/tableColumns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/shared/useToast";
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
			const { toast } = useToast();

			const changeToViewer = () => {
				toast({
					title: "User permission was change to viewer",
					duration: 2000,
					className: "bg-green-800 text-white font-bold text-base",
				});
			};

			const changeToAdmin = () => {
				toast({
					title: "User permission was change to admin",
					duration: 2000,
					className: "bg-green-800 text-white font-bold text-base",
				});
			};

			const handleDelete = () => {
				toast({
					title: "User was deleted from connections",
					duration: 2000,
					className: "bg-red-800 text-white font-bold text-base",
				});
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => changeToViewer()}>
							Set as Member
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => changeToAdmin()}>
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
