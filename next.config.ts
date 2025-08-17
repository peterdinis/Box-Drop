import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	experimental: {
		viewTransition: true,
		browserDebugInfoInTerminal: true,
		devtoolSegmentExplorer: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "<APP_ID>.ufs.sh",
				pathname: "/f/*",
			},
		],
	},
};

export default nextConfig;
