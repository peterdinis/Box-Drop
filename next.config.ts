import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	experimental: {
		viewTransition: true,
		browserDebugInfoInTerminal: true,
		devtoolSegmentExplorer: true,
	},
};

export default nextConfig;
