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
	subsets: ["latin"],
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
	authors: [{ name: "Box-Drop Team", url: "https://box-drop.app" }],
	creator: "Box-Drop",
	metadataBase: new URL("https://box-drop.app"),

	openGraph: {
		title: "Box-Drop",
		description:
			"A secure, modern way to manage files and folders collaboratively.",
		url: "https://box-drop.app",
		siteName: "Box-Drop",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Box-Drop preview",
			},
		],
		locale: "en_US",
		type: "website",
	},

	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},

	manifest: "/site.webmanifest",
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
