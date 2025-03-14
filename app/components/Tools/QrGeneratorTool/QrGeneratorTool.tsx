"use client";
import { default as NextImage } from "next/image";
import type { QRCodeSVG } from "qrcode.react";
import { type ComponentProps, useCallback, useRef, useState } from "react";
import { ColorPicker, type IColor, useColor } from "react-color-palette";
import { FaLink, FaSpinner, FaTimes } from "react-icons/fa";
import QrCodePreview from "./components/QrCodePreview";
import QrColorPicker from "./components/QrColorPicker";
import { useQrColors } from "./hooks/useQrColors";
import { useQrDownload } from "./hooks/useQrDownload";

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

	// カラー関連の状態と関数を取得
	const {
		frontColor,
		backColor,
		frontHexInput,
		backHexInput,
		handleFrontColorChange,
		handleBackColorChange,
		handleFrontHexInputChange,
		handleBackHexInputChange,
	} = useQrColors();

	// ファイルアップロード関連の状態を追加
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	// QRコードをダウンロードする関数を取得
	const { downloadQRCode } = useQrDownload(size, backColor.hex);

	const qrRef = useRef<SVGSVGElement>(null);

	// ファイルアップロードの処理
	const handleFileUpload = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
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
		},
		[],
	);

	//ダウンロードハンドラー
	const handleDownload = useCallback(() => {
		downloadQRCode(text, qrRef);
	}, [downloadQRCode, text]);

	// テキスト入力ハンドラ
	const handleTextChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setText(e.target.value);
		},
		[],
	);

	// サイズ調整ハンドラ
	const handleSizeChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSize(Number.parseInt(e.target.value, 10));
		},
		[],
	);

	// 余白調整ハンドラ
	const handleMarginChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setMargin(Number.parseInt(e.target.value, 10));
		},
		[],
	);

	// エラー訂正レベル変更ハンドラ
	const handleErrorCorrectionChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setErrorCorrectionLevel(e.target.value as QRCodeSVGProps["level"]);
		},
		[],
	);

	// 画像追加トグルハンドラ
	const handleAddImageToggle = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setAddImage(e.target.checked);
		},
		[],
	);

	// 追加画像サイズ変更ハンドラ
	const handleAddImageSizeChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setAddImageSize(Number.parseInt(e.target.value, 10));
		},
		[],
	);

	// アップロードエラークリアハンドラ
	const handleClearUploadError = useCallback(() => {
		setUploadError(null);
	}, []);

	// アップロード画像クリアハンドラ
	const handleClearUploadedImage = useCallback(() => {
		setUploadedImage(null);
	}, []);

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
								id="qr-text-or-url-input"
								type="text"
								required
								placeholder="https://"
								onChange={handleTextChange}
							/>
						</label>
						<p className="fieldset-label">URLかテキストを入力</p>
					</fieldset>
				</div>
			</div>
			<div className="flex flex-col-reverse sm:grid sm:grid-cols-2 gap-10">
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
								value={size}
								onChange={handleSizeChange}
								title="QRコードのサイズ調整"
								aria-label="QRコードのサイズ調整"
							/>
							<p>余白：{margin}px</p>
							<input
								type="range"
								min={0}
								max={50}
								className="range w-full"
								value={margin}
								onChange={handleMarginChange}
								title="QRコードの余白調整"
								aria-label="QRコードの余白調整"
							/>
							<div className="my-5 grid grid-cols-2">
								<QrColorPicker
									id="front-color-picker"
									label="前景色"
									color={frontColor}
									hexInput={frontHexInput}
									popoverId="popover-1"
									anchorName="[anchor-name:--anchor-1]"
									className="dropdown [position-anchor:--anchor-1]"
									onColorChange={handleFrontColorChange}
									onHexInputChange={handleFrontHexInputChange}
								/>
								<QrColorPicker
									id="back-color-picker"
									label="背景色"
									color={backColor}
									hexInput={backHexInput}
									popoverId="popover-2"
									anchorName="[anchor-name:--anchor-2]"
									className="dropdown dropdown-center [position-anchor:--anchor-2]"
									onColorChange={handleBackColorChange}
									onHexInputChange={handleBackHexInputChange}
								/>
							</div>
							<label htmlFor="error-correction-level">エラー訂正レベル</label>
							<select
								className="select w-full"
								value={errorCorrectionLevel}
								onChange={handleErrorCorrectionChange}
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
										onChange={handleAddImageToggle}
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
											value={addImageSize}
											onChange={handleAddImageSizeChange}
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
															onClick={handleClearUploadError}
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
													onClick={handleClearUploadedImage}
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
					<QrCodePreview
						ref={qrRef}
						text={text}
						size={size}
						margin={margin}
						frontColor={frontColor.hex}
						backColor={backColor.hex}
						errorCorrectionLevel={errorCorrectionLevel}
						addImage={addImage}
						uploadedImage={uploadedImage}
						addImageSize={addImageSize}
						onDownload={handleDownload}
					/>
				</div>
			</div>
		</div>
	);
}
