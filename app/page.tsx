import Image from "next/image";
import Card from "./components/Card/Card";
import Header from "./components/Header/Header";

export default function Home() {
	return (
		<div>
			<div className="flex flex-col">
				<div className="max-w-5xl mx-auto text-center py-12 px-6">
					<h1 className="text-4xl font-bold mb-4">PocketALL</h1>
					<p className="text-xl mb-6 text-base-content/90">
						必要なツールをポケットから取り出すように、すぐに使える便利なWebツール集。
						あなたの日常をもっと快適に、もっとシンプルに。
					</p>
					<p className="text-md text-base-content/60">
						計算機、メモ帳、単位変換、タイマー、カラーピッカーなど、
						さまざまな実用的なツールをブラウザひとつで。
						いつでも、どこでも、すぐに使えます。
					</p>
				</div>
				<div className="divider" />
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-[1600px] mx-auto mb-10">
					<Card
						title="QRコード作成"
						href="/qr-generator-tool"
						image={
							<Image
								src="https://placehold.jp/928x548.png"
								width={928}
								height={548}
								alt="Shoes"
							/>
						}
					>
						<p>
							完全無料で安全にQRコードを生成。個人情報の収集なし、広告表示なし。
							URLやテキストを入力するだけで、シンプルかつ安心してご利用いただけます。
						</p>
					</Card>
					<Card
						title="QRコード作成"
						href="/"
						image={
							<Image
								src="https://placehold.jp/928x548.png"
								width={928}
								height={548}
								alt="Shoes"
							/>
						}
					>
						<p>がいよう</p>
					</Card>
					<Card
						title="QRコード作成"
						href="/"
						image={
							<Image
								src="https://placehold.jp/928x548.png"
								width={928}
								height={548}
								alt="Shoes"
							/>
						}
					>
						<p>がいよう</p>
					</Card>
					<Card
						title="QRコード作成"
						href="/"
						image={
							<Image
								src="https://placehold.jp/928x548.png"
								width={928}
								height={548}
								alt="Shoes"
							/>
						}
					>
						<p>がいよう</p>
					</Card>
					<Card
						title="QRコード作成"
						href="/"
						image={
							<Image
								src="https://placehold.jp/928x548.png"
								width={928}
								height={548}
								alt="Shoes"
							/>
						}
					>
						<p>がいよう</p>
					</Card>
				</div>
			</div>
		</div>
	);
}
