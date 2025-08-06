import { type FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/shared/useToast";

const AddNewMemberToConnection: FC = () => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) {
			toast({
				title: "Invalid input",
				description: "Please enter a valid email.",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);
		try {
			// Send the request here (e.g., via fetch or mutation)
			await new Promise((res) => setTimeout(res, 1000)); // simulate API call

			toast({
				title: "Request sent",
				description: `Invitation sent to ${email}`,
			});
			setEmail("");
		} catch (error) {
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="link">Add new member to connection list</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite a new member</DialogTitle>
					<DialogDescription>
						Enter the email of the user you want to invite to your connection
						list.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid gap-2">
						<Label htmlFor="email">User Email</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="user@example.com"
							required
						/>
					</div>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Sending..." : "Send Invite"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddNewMemberToConnection;
