"use client";
import { default as NextImage } from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { type ComponentProps, useRef, useState } from "react";
import { ColorPicker, type IColor, useColor } from "react-color-palette";
import { FaLink, FaSpinner, FaTimes } from "react-icons/fa";
import { Link as Scroll } from "react-scroll";

export default function QrGeneratorTool() {
	// Define type for QRCodeSVG props
	type QRCodeSVGProps = ComponentProps<typeof QRCodeSVG>;

	const [text, setText] = useState("");
	const [size, setSize] = useState(256);
	const [margin, setMargin] = useState(2);

	//QRコードに画像を追加するかどうか
	const [addImage, setAddImage] = useState(false);
	const [addImageSize, setAddImageSize] = useState(50);

	// QRコードのエラー訂正レベル
	const [errorCorrectionLevel, setErrorCorrectionLevel] =
		useState<QRCodeSVGProps["level"]>("M");

	const initialFrontColor = "#000000";
	const initialBackColor = "#FFFFFF";

	const [frontColor, setFrontColor] = useColor(initialFrontColor);
	const [frontHexInput, setFrontHexInput] = useState(initialFrontColor);
	const [backColor, setBackColor] = useColor(initialBackColor);
	const [backHexInput, setBackHexInput] = useState(initialBackColor);

	// ファイルアップロード関連の状態を追加
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

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

			// Web Share APIが利用可能かチェック
			if (
				navigator.share &&
				/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
			) {
				// ファイル名と型を設定
				const fileName = "qrcode.png";

				// Base64データURLをBlobに変換
				fetch(pngUrl)
					.then((res) => res.blob())
					.then((blob) => {
						// ファイルオブジェクトを作成
						const file = new File([blob], fileName, { type: "image/png" });

						// Web Share APIでファイルを共有
						navigator
							.share({
								title: "QRコード",
								text: "生成したQRコードを共有します",
								files: [file],
							})
							.catch((error) => {
								console.error("共有に失敗しました", error);
								// 共有に失敗した場合、従来のダウンロード方法を試みる
							});
					});
			} else {
				// Web Share APIがサポートされていない場合は従来の方法でダウンロード

				// ダウンロードリンクを作成して自動クリック
				const downloadLink = document.createElement("a");
				downloadLink.href = pngUrl;
				downloadLink.download = "qrcode.png"; // ダウンロードするファイル名
				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);
			}
		};

		// SVGデータをbase64エンコードしてImageのsrcにセット
		img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
	};

	// ファイルアップロードの処理
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		setUploadError(null);

		// ファイル形式のチェック
		if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
			setUploadError("JPG、PNG、GIF形式のみアップロードできます");
			setIsUploading(false);
			return;
		}

		// FileReaderでファイルを読み込む
		const reader = new FileReader();

		reader.onload = (event) => {
			setUploadedImage(event.target?.result as string);
			setIsUploading(false);
		};

		reader.onerror = () => {
			setUploadError("ファイルの読み込みに失敗しました");
			setIsUploading(false);
		};

		// ファイルの読み込みを開始
		reader.readAsDataURL(file);
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
					<div className="justify-end card-actions sm:hidden">
						<Scroll
							to="qr-code-preview"
							smooth={true}
							className="btn btn-primary"
						>
							QRコードをプレビュー
						</Scroll>
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
								title="QRコードのサイズ調整"
								aria-label="QRコードのサイズ調整"
							/>
							<p>余白：{margin}px</p>
							<input
								type="range"
								min={0}
								max={50}
								className="range w-full"
								defaultValue={margin}
								onChange={(e) => setMargin(Number.parseInt(e.target.value, 10))}
								title="QRコードの余白調整"
								aria-label="QRコードの余白調整"
							/>
							<div className="card card-border">
								<div className="card-body grid grid-cols-2">
									<div>
										<label htmlFor="front-color-picker">前景色</label>
										<div className="flex">
											<button
												type="button"
												popoverTarget="popover-1"
												className="btn w-10 [anchor-name:--anchor-1]"
												style={{ backgroundColor: `${frontColor.hex}` }}
												title="前景色の選択"
												id="front-color-picker"
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
												aria-label="前景色の16進数カラーコード"
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
										<label htmlFor="back-color-picker">背景色</label>
										<div className="flex">
											<button
												type="button"
												popoverTarget="popover-2"
												className="btn w-10 [anchor-name:--anchor-2]"
												style={{ backgroundColor: `${backColor.hex}` }}
												title="背景色の選択"
												id="back-color-picker"
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
												aria-label="背景色の16進数カラーコード"
											/>
										</div>
										<div
											className="dropdown dropdown-center [position-anchor:--anchor-2]"
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
							<label htmlFor="error-correction-level">エラー訂正レベル</label>
							<select
								className="select w-full"
								value={errorCorrectionLevel}
								onChange={(e) =>
									setErrorCorrectionLevel(
										e.target.value as QRCodeSVGProps["level"],
									)
								}
								id="error-correction-level"
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
							<span className="divider" />
							<div className="">
								<div className="flex flex-row gap-3 mb-5">
									<input
										type="checkbox"
										className="toggle"
										onChange={(e) => setAddImage(e.target.checked)}
										id="add-image-checkbox"
									/>
									<label htmlFor="add-image-checkbox">
										QRコードの中央に画像を追加
									</label>
								</div>
								{addImage && (
									<div>
										<p className="mb-2">画像サイズ：{addImageSize}px</p>
										<input
											type="range"
											min={20}
											max={150}
											className="range w-full mb-5"
											defaultValue={addImageSize}
											onChange={(e) =>
												setAddImageSize(Number.parseInt(e.target.value, 10))
											}
											title="QRコードに追加する画像のサイズ調整"
											aria-label="QRコードに追加する画像のサイズ調整"
										/>
										<p className="text-base-content/60 mb-5">
											QRコードが上手く読み取れない場合は中央の画像サイズを小さくし、エラー訂正レベルを高く設定してください。
										</p>
										<div className="flex items-center gap-5">
											<input
												type="file"
												className="file-input mb-5"
												onChange={handleFileUpload}
												accept="image/jpeg, image/png, image/gif"
												disabled={isUploading}
											/>
											{isUploading && (
												<div className="">
													<FaSpinner className="animate-spin" size={20} />
												</div>
											)}
											{uploadError && (
												<div className="toast">
													<div className="alert alert-error">
														<span>{uploadError}</span>
														<FaTimes
															size={20}
															onClick={() => setUploadError(null)}
														/>
													</div>
												</div>
											)}
										</div>
										{uploadedImage && !isUploading && !uploadError && (
											<div className="flex justify-center sm:justify-start items-center gap-5">
												<NextImage
													src={uploadedImage}
													alt="Uploaded image"
													width={80}
													height={80}
												/>
												<button
													className="btn"
													type="reset"
													onClick={() => setUploadedImage(null)}
												>
													クリア
												</button>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className="card card-border">
						<div className="card-body items-center text-center">
							<h2 className="card-title" id="qr-code-preview">
								QRコードプレビュー
							</h2>
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
									imageSettings={
										addImage && uploadedImage
											? {
													excavate: true,
													src: uploadedImage,
													height: addImageSize,
													width: addImageSize,
												}
											: undefined
									}
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
										URLかテキストを入力してください
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
