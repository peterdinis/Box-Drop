"use client";

import { useUser } from "@clerk/nextjs";
import { Cloud } from "lucide-react";
import Link from "next/link";
import type { FC } from "react";
import UserProfileDropdown from "../auth/ProfileDropdown";
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggle";

const Navigation: FC = () => {
	const { user } = useUser();
	return (
		<header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
							<Cloud className="w-5 h-5 text-gray-950 dark:text-white" />
						</div>
						<span className="text-xl font-bold">Box-Drop</span>
					</div>
					<div className="flex items-center gap-4">
						{!user ? (
							<>
								<Button variant="ghost">
									<Link href="/sign-in">Sign In</Link>
								</Button>
								<Button variant={"default"}>
									<Link href="/sign-up">Get Started</Link>
								</Button>
							</>
						) : (
							<>
								<UserProfileDropdown />
							</>
						)}
						<ModeToggle />
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navigation;
