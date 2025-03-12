import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";

const mPlusRounded1c = M_PLUS_Rounded_1c({
	weight: ["400", "700"],
	variable: "--font-m-plus-rounded-1c",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		template: "%s | PocketALL",
		default: "PocketALL",
	},
	description:
		"PocketALLはポケットから取り出すみたいに簡単に使えるツール集です。",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja" suppressHydrationWarning>
			<body className={`${mPlusRounded1c.variable} antialiased`}>
				<ThemeProvider>
					<Header />
					{children}
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
