import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "placehold.jp",
				port: "",
				pathname: "/**",
				search: "",
			},
		],
	},
};

export default nextConfig;
