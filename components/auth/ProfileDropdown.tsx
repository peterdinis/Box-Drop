"use client";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type React from "react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { HelpCircle, LogOut } from "../shared/Icons";

// Dropdown Components
interface DropdownMenuProps {
	children: ReactNode;
	trigger: ReactNode;
}

const DropdownMenu = ({ children, trigger }: DropdownMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleTriggerClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsOpen(!isOpen);
	};

	return (
		<div className="relative inline-block text-left" ref={dropdownRef}>
			<div onClick={handleTriggerClick} className="cursor-pointer">
				{trigger}
			</div>
			{isOpen && (
				<div
					className="origin-top-right absolute right-0 mt-2 w-72 rounded-xl shadow-xl bg-white dark:bg-zinc-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in-0 zoom-in-95 p-2"
					role="menu"
					aria-orientation="vertical"
				>
					{children}
				</div>
			)}
		</div>
	);
};

interface DropdownMenuItemProps {
	children: ReactNode;
	onClick?: () => void;
}

const DropdownMenuItem = ({ children, onClick }: DropdownMenuItemProps) => (
	<a
		href="#"
		onClick={(e: React.MouseEvent) => {
			e.preventDefault();
			if (onClick) onClick();
		}}
		className="text-zinc-700 dark:text-zinc-300 group flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150"
		role="menuitem"
	>
		{children}
	</a>
);

export default function UserProfileDropdown() {
	const { user } = useUser();
	const { signOut } = useClerk();
	const router = useRouter();
	return (
		<div className="flex items-center justify-center font-sans">
			<DropdownMenu
				trigger={
					<button className="flex items-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
						<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
							{`${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`}
						</div>
					</button>
				}
			>
				<div className="py-1">
					<DropdownMenuItem
						onClick={() => {
							router.push("/dashboard");
						}}
					>
						<HelpCircle className="mr-3 h-4 w-4 text-zinc-500" />
						Dashboard
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => signOut()}>
						<LogOut className="mr-3 h-4 w-4 text-zinc-500" />
						Sign Out
					</DropdownMenuItem>
				</div>
			</DropdownMenu>
		</div>
	);
}
