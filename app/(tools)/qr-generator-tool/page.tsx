import QrGeneratorTool from "@/app/components/Tools/QrGeneratorTool/QrGeneratorTool";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "QRコードジェネレーター",
	description:
		"完全無料で安全にQRコードを生成。個人情報の収集なし、広告表示なし。URLやテキストを入力するだけで、シンプルかつ安心してご利用いただけます。",
};

export default function Page() {
	return <QrGeneratorTool />;
}
