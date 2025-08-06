import { Users2 } from "lucide-react";
import type { FC } from "react";
import AddNewMemberToConnection from "../modals/AddNewMemberToConnection";
import ConnectionsListModal from "../modals/ConnectionsListModal";
import { Card } from "../ui/card";

const ConnectionsWrapper: FC = () => {
	return (
		<Card className="p-6">
			<h3 className="font-semibold mb-4">Connections</h3>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Users2 className="w-4 h-4 text-green-500" />
						<span className="text-sm">My Connections</span>
					</div>
					<span className="font-medium">1234</span>
				</div>
				<div>
					<AddNewMemberToConnection />
					<ConnectionsListModal />
				</div>
			</div>
		</Card>
	);
};

export default ConnectionsWrapper;
