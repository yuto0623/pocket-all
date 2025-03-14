import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import Footer from "./components/Footer/Footer";

const mPlusRounded1c = M_PLUS_Rounded_1c({
	weight: ["400", "700"],
	variable: "--font-m-plus-rounded-1c",
	subsets: ["latin"],
});

// 環境に基づいてベースURLを決定
const baseUrl =
	process.env.NEXT_PUBLIC_BASE_URL ||
	(process.env.NODE_ENV === "production"
		? "https://pocket-all.vercel.app"
		: "http://localhost:3000");

export const metadata: Metadata = {
	title: {
		template: "%s | PocketALL",
		default: "PocketALL",
	},
	description:
		"PocketALLはポケットから取り出すみたいに簡単に使えるツール集です。",
	metadataBase: new URL(baseUrl),
	//Google Search Consoleの所有権確認用のメタタグ
	verification: {
		google: "aGp-DvVylOKM2oA_o6jFswCH7LwYnPcYNi38QViwXdw",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja" suppressHydrationWarning>
			<GoogleTagManager gtmId="GTM-WGF6R8WB" />
			<body className={`${mPlusRounded1c.variable} antialiased`}>
				<ThemeProvider>
					{children}
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
