import ImageCompressorTool from "@/app/components/Tools/ImageCompressorTool/ImageCompressorTool";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "画像圧縮",
	description:
		"画像をアップロードして簡単に圧縮。ファイルサイズを削減しながら、画質のバランスを調整できます。",
	openGraph: {
		type: "website",
		images: {
			url: "/img/ImageCompressorTool/thumbnail.jpg",
			type: "image/png",
			width: 1408,
			height: 768,
		},
	},
};

export default function Page() {
	return <ImageCompressorTool />;
}
