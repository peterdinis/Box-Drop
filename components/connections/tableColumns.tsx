// components/connections/columns.ts
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Connection } from "@/types/ConnectionTypes"

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
      const status = row.getValue("status") as Connection["status"]
      return <Badge variant={
        status === "accepted"
          ? "default"
          : status === "pending"
          ? "secondary"
          : "destructive"
      }>
        {status}
      </Badge>
    }
  }
]
