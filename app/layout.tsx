import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import AppClerkProvider from "@/components/providers/AppClerkProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Navigation from "@/components/shared/Navigation";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";

const ubuntu = Ubuntu({
	subsets: ["latin-ext"],
	weight: "500",
});

export const metadata: Metadata = {
	title: {
		default: "Box-Drop",
		template: "%s | Box-Drop",
	},
	description:
		"A secure, modern way to manage files and folders collaboratively.",
	keywords: [
		"file storage",
		"cloud",
		"folders",
		"sharing",
		"Box-Drop",
		"collaboration",
	],
	authors: [{ name: "Box-Drop Team", url: "https://box-drop-etkd.vercel.app/" }],
	creator: "Box-Drop",
	metadataBase: new URL("https://box-drop-etkd.vercel.app/"),

	openGraph: {
		title: "Box-Drop",
		description:
			"A secure, modern way to manage files and folders collaboratively.",
		url: "https://box-drop-etkd.vercel.app/",
		siteName: "Box-Drop",
		locale: "en_US",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${ubuntu} antialiased`}>
				<div className="min-h-screen bg-background">
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<AppClerkProvider>
							<QueryProvider>
								<Navigation />
								{children}
								<Toaster />
								<ScrollToTop />
							</QueryProvider>
						</AppClerkProvider>
					</ThemeProvider>
				</div>
			</body>
		</html>
	);
}
