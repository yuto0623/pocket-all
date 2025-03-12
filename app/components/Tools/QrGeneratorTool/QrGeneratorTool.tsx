"use client";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { FaLink } from "react-icons/fa";

export default function QrGeneratorTool() {
	const [text, setText] = useState("https://example.com");
	const [size, setSize] = useState(40);
	const qrRef = useRef(null);

	// QRコードをダウンロードする関数
	const downloadQRCode = () => {
		if (!text.trim()) return;

		// SVG要素を取得
		const svgElement = qrRef.current;
		if (!svgElement) return;

		// SVGをXML文字列に変換
		const svgData = new XMLSerializer().serializeToString(svgElement);

		// データURLへ変換するためにCanvas要素とImage要素を使用
		const canvas = document.createElement("canvas");
		const img = new Image();

		// 画像がロードされた後の処理
		img.onload = () => {
			// Canvasのサイズを設定
			canvas.width = 250;
			canvas.height = 250;

			// CanvasにQRコードを描画
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.fillStyle = "#FFFFFF"; // 背景色
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0);

			// データURLを生成し、ダウンロードを開始
			const pngUrl = canvas.toDataURL("image/png");

			// ダウンロードリンクを作成して自動クリック
			const downloadLink = document.createElement("a");
			downloadLink.href = pngUrl;
			downloadLink.download = "qrcode.png"; // ダウンロードするファイル名
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		};

		// SVGデータをbase64エンコードしてImageのsrcにセット
		img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
	};

	return (
		<div>
			<div className="card">
				<div className="card-body items-center text-center">
					<h2 className="card-title">
						データ入力
						{/* <div className="badge badge-neutral">Primary</div> */}
					</h2>
					<fieldset className="fieldset w-full max-w-3xl mx-auto">
						<legend className="fieldset-legend mr-auto">URL</legend>
						<label className="input w-full">
							<FaLink className="opacity-70" />
							<input
								type="text"
								required
								placeholder="https://"
								onChange={(e) => setText(e.target.value)}
							/>
						</label>
						<p className="fieldset-label">URLかテキストを入力</p>
					</fieldset>
					<div className="justify-end card-actions">
						<button type="button" className="btn btn-primary">
							QRコードを生成
						</button>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
				<div>
					<div className="card card-border">
						<div className="card-body">
							<h2 className="card-title justify-center">QRコードの詳細設定</h2>
							<p>画像サイズ：{size}px</p>
							<input
								type="range"
								min={128}
								max={512}
								className="range w-full"
								defaultValue={size}
								onChange={(e) => setSize(Number.parseInt(e.target.value, 10))}
							/>
						</div>
					</div>
				</div>
				<div>
					{text ? (
						<div className="card card-border">
							<div className="card-body items-center text-center">
								<h2 className="card-title">QRコードプレビュー</h2>
								<QRCodeSVG
									ref={qrRef}
									value={text}
									size={size}
									bgColor="#FFFFFF"
									fgColor="#000000"
									level="M"
									marginSize={3}
								/>
								<p className="text-sm text-gray-500 mb-5">
									{size}px x {size}px
								</p>
								<button
									type="button"
									className="btn btn-primary"
									onClick={downloadQRCode}
								>
									ダウンロードする
								</button>
							</div>
						</div>
					) : (
						<p className="text-gray-500">テキストを入力してください</p>
					)}
				</div>
			</div>
		</div>
	);
}
