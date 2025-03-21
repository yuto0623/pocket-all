import RemoveBackgroundTool from "@/app/components/Tools/RemoveBackgroundTool/RemoveBackgroundTool";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "画像透過",
	description:
		"完全無料で簡単に画像の背景を透過。画像をアップロードするだけで、透過処理を行います。ワンクリックで透過画像をダウンロード可能。",
	openGraph: {
		type: "website",
		images: {
			url: "/img/RemoveBackgroundTool/thumbnail.png",
			type: "image/png",
			width: 1408,
			height: 768,
		},
	},
};

export default function Page() {
	return <RemoveBackgroundTool />;
}
