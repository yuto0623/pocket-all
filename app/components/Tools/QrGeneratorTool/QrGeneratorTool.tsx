"use client";
import { QRCodeSVG } from "qrcode.react";
import { type ComponentProps, useRef, useState } from "react";
import { ColorPicker, type IColor, useColor } from "react-color-palette";
import { FaLink } from "react-icons/fa";
import "react-color-palette/css";

export default function QrGeneratorTool() {
	// Define type for QRCodeSVG props
	type QRCodeSVGProps = ComponentProps<typeof QRCodeSVG>;

	const [text, setText] = useState("");
	const [size, setSize] = useState(256);
	const [margin, setMargin] = useState(2);

	//QRコードに画像を追加するかどうか
	const [addImage, setAddImage] = useState(false);

	// QRコードのエラー訂正レベル
	const [errorCorrectionLevel, setErrorCorrectionLevel] =
		useState<QRCodeSVGProps["level"]>("M");

	const initialFrontColor = "#000000";
	const initialBackColor = "#FFFFFF";

	const [frontColor, setFrontColor] = useColor(initialFrontColor);
	const [frontHexInput, setFrontHexInput] = useState(initialFrontColor);
	const [backColor, setBackColor] = useColor(initialBackColor);
	const [backHexInput, setBackHexInput] = useState(initialBackColor);

	const qrRef = useRef(null);

	// カラーピッカーが変更されたときにhexInputも更新
	const handleFrontColorChange = (newColor: IColor) => {
		setFrontColor(newColor);
		setFrontHexInput(newColor.hex);
	};
	const handleBackColorChange = (newColor: IColor) => {
		setBackColor(newColor);
		setBackHexInput(newColor.hex);
	};

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
			canvas.width = size;
			canvas.height = size;

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
							<p>余白：{margin}px</p>
							<input
								type="range"
								min={0}
								max={50}
								className="range w-full"
								defaultValue={margin}
								onChange={(e) => setMargin(Number.parseInt(e.target.value, 10))}
							/>
							<div className="card card-border">
								<div className="card-body grid grid-cols-2">
									<div>
										<p>前景色</p>
										<div className="flex">
											<button
												type="button"
												popoverTarget="popover-1"
												className="btn w-10 [anchor-name:--anchor-1]"
												style={{ backgroundColor: `${frontColor.hex}` }}
											/>
											<input
												type="text"
												className="input"
												value={frontHexInput}
												onChange={(e) => {
													const newValue = e.target.value;
													setFrontHexInput(newValue);

													// 有効な16進数カラーコードの場合のみfrontColorを更新
													if (
														/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)
													) {
														setFrontColor({
															hex: newValue,
															rgb: frontColor.rgb,
															hsv: frontColor.hsv,
														});
													}
												}}
											/>
										</div>
										<div
											className="dropdown [position-anchor:--anchor-1]"
											popover="auto"
											id="popover-1"
										>
											<ColorPicker
												color={frontColor}
												onChange={handleFrontColorChange}
												hideInput={["rgb", "hsv"]}
												hideAlpha
											/>
										</div>
									</div>
									<div>
										<p>背景色</p>
										<div className="flex">
											<button
												type="button"
												popoverTarget="popover-2"
												className="btn w-10 [anchor-name:--anchor-2]"
												style={{ backgroundColor: `${backColor.hex}` }}
											/>
											<input
												type="text"
												className="input"
												value={backHexInput}
												onChange={(e) => {
													const newValue = e.target.value;
													setBackHexInput(newValue);

													// 有効な16進数カラーコードの場合のみfrontColorを更新
													if (
														/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)
													) {
														setBackColor({
															hex: newValue,
															rgb: backColor.rgb,
															hsv: backColor.hsv,
														});
													}
												}}
											/>
										</div>
										<div
											className="dropdown [position-anchor:--anchor-2]"
											popover="auto"
											id="popover-2"
										>
											<ColorPicker
												color={backColor}
												onChange={handleBackColorChange}
												hideInput={["rgb", "hsv"]}
												hideAlpha
											/>
										</div>
									</div>
								</div>
							</div>
							<p>エラー訂正レベル</p>
							<select
								className="select w-full"
								value={errorCorrectionLevel}
								onChange={(e) =>
									setErrorCorrectionLevel(
										e.target.value as QRCodeSVGProps["level"],
									)
								}
							>
								<option value="L">L:低 (約7％のエラー訂正)</option>
								<option value="M">M：中 (約15%のエラー訂正)</option>
								<option value="Q">Q：標準 (約25%のエラー訂正)</option>
								<option value="H">H：高 (約30%のエラー訂正)</option>
							</select>
							<p className="text-base-content/60">
								エラー訂正レベルが高いほどQRコードの一部が失われても読み取れる可能性が上がります。
								<br />
								また、エラー訂正レベルが高いほどQRコードがより複雑になります。
							</p>
							<div className="card card-border">
								<div className="card-body">
									<div className="flex flex-row mb-5">
										<input
											type="checkbox"
											className="toggle"
											onChange={(e) => setAddImage(e.target.checked)}
										/>
										<p>QRコードの中央に画像を追加</p>
									</div>
									{addImage && (
										<div>
											<p>test</p>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className="card card-border">
						<div className="card-body items-center text-center">
							<h2 className="card-title">QRコードプレビュー</h2>
							{text ? (
								<QRCodeSVG
									ref={qrRef}
									value={text}
									size={size}
									bgColor={backColor.hex}
									fgColor={frontColor.hex}
									level={errorCorrectionLevel}
									marginSize={margin}
									className="border border-base-content"
								/>
							) : (
								<div
									style={{
										width: `${size}px`,
										height: `${size}px`,
									}}
									className="bg-base-content flex items-center justify-center"
								>
									<p className="text-white dark:text-gray-800">
										QRコードがありません
									</p>
								</div>
							)}
							<p className="text-sm text-base-content/60 mb-5">
								{size} x {size} ピクセル
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
				</div>
			</div>
		</div>
	);
}
