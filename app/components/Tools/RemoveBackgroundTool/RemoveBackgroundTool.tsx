"use client";
import { default as NextImage } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaImage, FaSpinner, FaTimes, FaUpload } from "react-icons/fa";

export default function RemoveBackgroundTool() {
	// 基本的な状態
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [processedImage, setProcessedImage] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

	// 透過設定の状態
	const [tolerance, setTolerance] = useState(30); // 背景色との類似度の許容範囲 (0-100)
	const [samplePoint, setSamplePoint] = useState({ x: 0, y: 0 }); // 背景色サンプル位置
	const [isSampling, setIsSampling] = useState(false); // 背景色サンプリングモード

	// ドラッグ&ドロップ用の状態
	const [isDragging, setIsDragging] = useState(false);

	// 参照
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);

	// 画像の読み込み処理
	const loadImage = useCallback((file: File) => {
		setIsUploading(true);
		setUploadError(null);
		setProcessedImage(null);

		// ファイル形式のチェック
		if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
			setUploadError("JPG、PNG、GIF形式のみアップロードできます");
			setIsUploading(false);
			return;
		}

		// FileReaderでファイルを読み込む
		const reader = new FileReader();

		reader.onload = (event) => {
			const imgUrl = event.target?.result as string;
			setUploadedImage(imgUrl);

			// 画像のサイズを取得
			const img = new Image();
			img.onload = () => {
				setImageSize({ width: img.width, height: img.height });
				// デフォルトのサンプルポイントを画像の左上隅に設定
				setSamplePoint({ x: 0, y: 0 });
				setIsUploading(false);
			};
			img.src = imgUrl;
		};

		reader.onerror = () => {
			setUploadError("ファイルの読み込みに失敗しました");
			setIsUploading(false);
		};

		reader.readAsDataURL(file);
	}, []);

	// ファイルアップロードの処理
	const handleFileUpload = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;
			loadImage(file);
		},
		[loadImage],
	);

	// ドラッグ&ドロップ関連のイベントハンドラ
	const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDragOver = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			if (!isDragging) {
				setIsDragging(true);
			}
		},
		[isDragging],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
				const file = e.dataTransfer.files[0];
				loadImage(file);
			}
		},
		[loadImage],
	);

	// ドロップエリアのクリックでファイル選択ダイアログを開く
	const openFileDialog = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	// 画像プレビュークリックで背景サンプリング位置を設定
	const handlePreviewClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!isSampling || !uploadedImage || !imageRef.current) return;

			const rect = e.currentTarget.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const scaleX = imageSize.width / rect.width;
			const scaleY = imageSize.height / rect.height;

			// 画像の実際のサイズに対する相対位置を計算
			const imgX = Math.floor(x * scaleX);
			const imgY = Math.floor(y * scaleY);

			setSamplePoint({ x: imgX, y: imgY });
			setIsSampling(false);
		},
		[isSampling, uploadedImage, imageSize],
	);

	// 背景透過処理
	const processImage = useCallback(() => {
		if (!uploadedImage || !canvasRef.current) return;

		setIsProcessing(true);

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) {
			setUploadError("キャンバスのコンテキストが取得できません");
			setIsProcessing(false);
			return;
		}

		const img = new Image();
		img.onload = () => {
			// キャンバスのサイズを画像に合わせる
			canvas.width = img.width;
			canvas.height = img.height;

			// 画像をキャンバスに描画
			ctx.drawImage(img, 0, 0);

			// 画像データを取得
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData.data;

			// サンプルポイントの色を取得
			const sampleIdx = (samplePoint.y * canvas.width + samplePoint.x) * 4;
			const sampleR = data[sampleIdx];
			const sampleG = data[sampleIdx + 1];
			const sampleB = data[sampleIdx + 2];

			// 透過処理
			for (let i = 0; i < data.length; i += 4) {
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];

				// 色の差を計算
				const diffR = Math.abs(r - sampleR);
				const diffG = Math.abs(g - sampleG);
				const diffB = Math.abs(b - sampleB);

				// 色の差の平均値を計算 (0-255)
				const diff = (diffR + diffG + diffB) / 3;

				// 許容範囲内ならアルファ値を0に設定（完全透明）
				const maxDiff = (255 * tolerance) / 100;
				if (diff < maxDiff) {
					const alpha = Math.min(255, (diff / maxDiff) * 255);
					data[i + 3] = alpha;
				}
			}

			// 処理した画像データをキャンバスに戻す
			ctx.putImageData(imageData, 0, 0);

			// 処理結果をPNG形式で取得
			const processedDataUrl = canvas.toDataURL("image/png");
			setProcessedImage(processedDataUrl);
			setIsProcessing(false);
		};

		img.onerror = () => {
			setUploadError("画像処理中にエラーが発生しました");
			setIsProcessing(false);
		};

		img.src = uploadedImage;
	}, [uploadedImage, samplePoint, tolerance]);

	// 画像ダウンロード
	const downloadImage = useCallback(() => {
		if (!processedImage) return;

		const link = document.createElement("a");
		link.download = "transparent-image.png";
		link.href = processedImage;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}, [processedImage]);

	// エラーをクリア
	const handleClearUploadError = useCallback(() => {
		setUploadError(null);
	}, []);

	// アップロードした画像をクリア
	const handleClearUploadedImage = useCallback(() => {
		setUploadedImage(null);
		setProcessedImage(null);
		setSamplePoint({ x: 0, y: 0 });
	}, []);

	// サンプリングモードを切り替え
	const toggleSampling = useCallback(() => {
		setIsSampling(!isSampling);
	}, [isSampling]);

	// トレランス（許容値）を変更
	const handleToleranceChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setTolerance(Number(e.target.value));
		},
		[],
	);

	return (
		<div>
			<div className="card">
				<div className="card-body items-center text-center">
					<h2 className="card-title">背景透過ツール</h2>
					<p className="opacity-70 max-w-2xl">
						画像の背景を透明にして、PNG形式で保存できます。画像をアップロードし、背景色をサンプリングして透過処理を行います。
					</p>
				</div>
			</div>

			<div className="flex flex-col-reverse sm:grid sm:grid-cols-2 gap-10 mt-6">
				<div>
					<div className="card card-border">
						<div className="card-body">
							<h2 className="card-title justify-center">設定</h2>

							{/* 非表示のファイル入力 */}
							<input
								id="image-upload-input"
								ref={fileInputRef}
								type="file"
								onChange={handleFileUpload}
								accept="image/jpeg, image/png, image/gif"
								disabled={isUploading || isProcessing}
								className="hidden"
							/>

							{/* ドラッグ&ドロップエリア */}
							{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
							<div
								className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] mt-4 cursor-pointer transition-colors ${
									isDragging
										? "border-primary bg-primary/10"
										: "border-base-content/30 hover:border-primary/50"
								}`}
								onDragEnter={handleDragEnter}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								onClick={openFileDialog}
							>
								<FaUpload size={36} className="mb-4 opacity-70" />
								<p className="text-center mb-2">
									画像をここにドラッグ&ドロップ
								</p>
								<p className="text-center text-sm opacity-70">
									または、クリックしてファイルを選択
								</p>
								{isUploading && (
									<div className="mt-4">
										<FaSpinner className="animate-spin" size={24} />
									</div>
								)}
							</div>

							{/* 透過設定 */}
							{uploadedImage && !isUploading && (
								<>
									<div className="divider">透過設定</div>
									<div className="flex flex-col">
										<label className="mb-3" htmlFor="tolerance-range">
											背景色の許容範囲: {tolerance}%
										</label>
										<input
											id="tolerance-range"
											type="range"
											min={0}
											max={100}
											value={tolerance}
											onChange={handleToleranceChange}
											className="range w-full"
										/>
										<span className="label mt-1">
											高い値ほど背景に近い色も透過されます
										</span>
									</div>

									<button
										type="button"
										className={`btn mt-2 ${isSampling ? "btn-accent" : "btn-outline"}`}
										onClick={toggleSampling}
									>
										{isSampling ? "背景色を選択中..." : "背景色を選択"}
									</button>

									{isSampling && (
										<p className="text-sm mt-2 text-accent">
											プレビュー画像をクリックして背景色をサンプリングしてください
										</p>
									)}

									<button
										type="button"
										className="btn btn-primary w-full mt-4"
										disabled={isProcessing}
										onClick={processImage}
									>
										{isProcessing ? (
											<>
												<FaSpinner className="animate-spin mr-2" /> 処理中...
											</>
										) : (
											"背景を透過する"
										)}
									</button>
								</>
							)}

							{/* エラー表示 */}
							{uploadError && (
								<div className="alert alert-error mt-4">
									<span>{uploadError}</span>
									<button type="button" onClick={handleClearUploadError}>
										<FaTimes size={20} />
									</button>
								</div>
							)}

							{/* クリアボタン */}
							{uploadedImage && (
								<div className="mt-4">
									<button
										type="button"
										className="btn btn-outline w-full"
										onClick={handleClearUploadedImage}
										disabled={isProcessing}
									>
										画像をクリア
									</button>
								</div>
							)}
						</div>
					</div>
				</div>

				<div>
					<div className="card card-border">
						<div className="card-body items-center text-center">
							<h2 className="card-title" id="image-preview">
								プレビュー
							</h2>

							{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
							<div
								className={`relative w-full max-w-md h-64 border border-base-content/20 flex items-center justify-center mb-4 ${isSampling ? "cursor-crosshair" : ""}`}
								onClick={handlePreviewClick}
							>
								{isUploading ? (
									<FaSpinner className="animate-spin" size={32} />
								) : uploadedImage ? (
									<div className="relative w-full h-full">
										<NextImage
											ref={imageRef}
											src={processedImage || uploadedImage}
											alt="画像プレビュー"
											fill
											className="object-contain"
										/>
										{isSampling && (
											<div className="absolute inset-0 bg-black/10 flex items-center justify-center">
												<div className="bg-white/80 p-2 rounded">
													クリックして背景色をサンプリング
												</div>
											</div>
										)}
									</div>
								) : (
									<p className="text-base-content/60">
										画像をアップロードしてください
									</p>
								)}
							</div>

							{/* 非表示のキャンバス（画像処理用） */}
							<canvas ref={canvasRef} className="hidden" />

							{processedImage && (
								<button
									type="button"
									className="btn btn-primary"
									onClick={downloadImage}
								>
									透過画像をダウンロード
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
