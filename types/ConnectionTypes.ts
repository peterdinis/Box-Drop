export type Connection = {
  id: string
  name: string
  email: string
  status: "accepted" | "pending" | "blocked"
  role?: "member" | "admin"
}