import UnitConverterTool from "@/app/components/Tools/UnitConverterTool/UnitConverterTool";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "単位変換ツール",
	description:
		"長さ、重さ、温度など様々な単位をワンクリックで変換。簡単・正確な単位変換ツール。",
	openGraph: {
		type: "website",
		images: {
			url: "/img/QrGeneratorTool/thumbnail.png",
			type: "image/png",
			width: 1408,
			height: 768,
		},
	},
};

export default function Page() {
	return <UnitConverterTool />;
}
