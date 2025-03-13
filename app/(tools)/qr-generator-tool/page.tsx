import QrGeneratorTool from "@/app/components/Tools/QrGeneratorTool/QrGeneratorTool";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "QRコード作成",
	description:
		"完全無料で安全にQRコードを生成。個人情報の収集なし、広告表示なし。URLやテキストを入力するだけで、シンプルかつ安心してご利用いただけます。",
	openGraph: {
		type: "website",
		images: {
			url: "/QrGeneratorTool/thumbnail.png",
			type: "image/png",
			width: 1408,
			height: 768,
		},
	},
};

export default function Page() {
	return <QrGeneratorTool />;
}
