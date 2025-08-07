"use client";

import { ArrowUp } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button"; 

export function ScrollToTop() {
	const [visible, setVisible] = React.useState(false);

	React.useEffect(() => {
		const handleScroll = () => {
			if (window.pageYOffset > 300) {
				setVisible(true);
			} else {
				setVisible(false);
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	if (!visible) return null;

	return (
		<div className="fixed bottom-8 right-8">
			<Button
				variant="default"
				size="icon"
				onClick={scrollToTop}
				className="rounded-full p-3 shadow-lg"
			>
				<ArrowUp />
			</Button>
		</div>
	);
}
