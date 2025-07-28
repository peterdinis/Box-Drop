import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	experimental: {
		viewTransition: true,
		browserDebugInfoInTerminal: true,
		devtoolSegmentExplorer: true,
		turbopackPersistentCaching: true,
	}
};

export default nextConfig;
