import Image from "next/image";
import Card from "./components/Card/Card";
import Header from "./components/Header/Header";

type Tool = {
	title: string;
	href: string;
	image: React.ReactNode;
	indicator?: string;
	description: string;
};

const Tools: Tool[] = [
	{
		title: "QRコード作成",
		href: "/qr-generator-tool",
		image: (
			<Image
				src="/img/QrGeneratorTool/thumbnail.png"
				width={1408}
				height={768}
				alt=""
				priority
			/>
		),
		description:
			"完全無料で安全にQRコードを生成。URLやテキストを入力するだけで、シンプルかつ安心してご利用いただけます。",
	},
	{
		title: "画像透過",
		href: "/remove-background-tool",
		image: (
			<Image
				src="/img/RemoveBackgroundTool/thumbnail.png"
				width={1408}
				height={768}
				alt=""
			/>
		),
		// indicator: "制作中",
		description:
			"完全無料で簡単に画像の背景を透過。画像をアップロードするだけで、透過処理を行います。ワンクリックで透過画像をダウンロード可能。",
	},
	{
		title: "画像圧縮",
		href: "/image-compressor-tool",
		image: (
			<Image
				src="/img/ImageCompressorTool/thumbnail.jpg"
				width={1408}
				height={768}
				alt=""
			/>
		),
		// indicator: "制作中",
		description:
			"画像をアップロードして簡単に圧縮。ファイルサイズを削減しながら、画質のバランスを調整できます。",
	},
	{
		title: "単位変換",
		href: "/unit-converter-tool",
		image: (
			<Image
				src="/img/UnitConverterTool/thumbnail.jpg"
				width={1408}
				height={768}
				alt=""
			/>
		),
		// indicator: "制作中",
		description:
			"長さ、重さ、温度など様々な単位をワンクリックで変換。簡単・正確な単位変換ツール。",
	},
];

export default function Home() {
	return (
		<>
			<Header title="PocketALL(仮)" />
			<div>
				<div className="flex flex-col">
					<div className="max-w-5xl mx-auto text-center py-12 px-6">
						<h1 className="text-4xl font-bold mb-4">PocketALL</h1>
						<p className="text-xl mb-6 text-base-content/90">
							必要なツールをポケットから取り出すように、すぐに使える便利なWebツール集。
							あなたの日常をもっと快適に、もっとシンプルに。
						</p>
						<p className="text-md text-base-content/60">
							QRコード作成、画像透過、画像圧縮など、
							さまざまな実用的なツールをブラウザひとつで。
							いつでも、どこでも、すぐに使えます。
						</p>
					</div>
					<div className="divider" />
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-[1600px] mx-auto mb-10">
						{Tools.map((tool) => (
							<Card
								key={tool.title}
								title={tool.title}
								href={tool.href}
								image={tool.image}
								indicator={tool.indicator}
							>
								<p>{tool.description}</p>
							</Card>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
