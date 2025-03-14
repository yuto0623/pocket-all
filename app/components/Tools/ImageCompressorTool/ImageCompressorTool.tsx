"use client";
import imageCompression from "browser-image-compression";
import { default as NextImage } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaImage, FaSpinner, FaTimes, FaUpload } from "react-icons/fa";

export default function ImageCompressorTool() {
	// 基本的な状態
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [originalFile, setOriginalFile] = useState<File | null>(null);
	const [compressedImage, setCompressedImage] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	// ファイル情報
	const [originalSize, setOriginalSize] = useState<number>(0); // バイト単位
	const [compressedSize, setCompressedSize] = useState<number>(0); // バイト単位
	const [compressionRate, setCompressionRate] = useState<number>(0); // 圧縮率

	// 圧縮設定（実際の値）
	const [quality, setQuality] = useState<number>(80); // 0-100
	const [maxWidth, setMaxWidth] = useState<number>(1920); // 最大幅
	const [outputFormat, setOutputFormat] = useState<"jpeg" | "png" | "webp">(
		"jpeg",
	);

	// 一時的な値（UI表示用）
	const [pendingQuality, setPendingQuality] = useState<number>(80);
	const [pendingMaxWidth, setPendingMaxWidth] = useState<number>(1920);
	const [pendingFormat, setPendingFormat] = useState<"jpeg" | "png" | "webp">(
		"jpeg",
	);

	// 参照
	const fileInputRef = useRef<HTMLInputElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const blobCache = useRef<Blob | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// 画像の読み込み処理
	const loadImage = useCallback((file: File) => {
		setIsUploading(true);
		setUploadError(null);
		setCompressedImage(null);
		setOriginalSize(file.size);
		setOriginalFile(file);

		// ファイル形式のチェック
		if (
			!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
				file.type,
			)
		) {
			setUploadError("JPG、PNG、GIF、WEBP形式のみアップロードできます");
			setIsUploading(false);
			return;
		}

		// FileReaderでファイルを読み込む
		const reader = new FileReader();

		reader.onload = (event) => {
			const imgUrl = event.target?.result as string;
			setUploadedImage(imgUrl);
			setIsUploading(false);
		};

		reader.onerror = () => {
			setUploadError("ファイルの読み込みに失敗しました");
			setIsUploading(false);
		};

		reader.readAsDataURL(file);
	}, []);

	// 画像圧縮処理
	const compressImage = useCallback(async () => {
		if (!uploadedImage || !originalFile) return;

		setIsProcessing(true);

		try {
			const options = {
				maxSizeMB: 10, // 最大サイズ (MB)
				maxWidthOrHeight: maxWidth, // 最大幅
				initialQuality: quality / 100, // 品質
				useWebWorker: true, // WebWorkerを使用
				fileType: `image/${outputFormat}`, // 出力フォーマット
				alwaysKeepResolution: true, // 解像度を維持するか
			};

			// 圧縮を実行
			const compressedFile = await imageCompression(originalFile, options);

			// 圧縮されたファイルをBlob形式で保存
			blobCache.current = compressedFile;

			// 圧縮サイズと圧縮率を計算
			setCompressedSize(compressedFile.size);
			setCompressionRate(
				Math.round((1 - compressedFile.size / originalSize) * 100),
			);

			// 表示用のURLを生成
			const compressedUrl =
				await imageCompression.getDataUrlFromFile(compressedFile);
			setCompressedImage(compressedUrl);
		} catch (error) {
			console.error("圧縮処理に失敗しました:", error);
			setUploadError(
				`圧縮処理に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
			);
		} finally {
			setIsProcessing(false);
		}
	}, [
		uploadedImage,
		quality,
		maxWidth,
		outputFormat,
		originalSize,
		originalFile,
	]);

	// 設定が変更されたら圧縮処理を実行
	useEffect(() => {
		if (uploadedImage && !isUploading) {
			compressImage();
		}
	}, [compressImage, uploadedImage, isUploading]);

	// UI設定変更ハンドラー
	const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPendingQuality(Number.parseInt(e.target.value));
	};

	const handleQualityChangeComplete = () => {
		setQuality(pendingQuality);
	};

	const handleMaxWidthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setPendingMaxWidth(Number.parseInt(e.target.value));
		setMaxWidth(Number.parseInt(e.target.value));
	};

	const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setPendingFormat(e.target.value as "jpeg" | "png" | "webp");
		setOutputFormat(e.target.value as "jpeg" | "png" | "webp");
	};

	// スムーズな変更のための遅延処理
	const handleQualityChangeWithDebounce = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setPendingQuality(Number.parseInt(e.target.value));

		// 前回のタイマーをクリア
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		// 新しいタイマーをセット（500ms後に実行）
		timeoutRef.current = setTimeout(() => {
			setQuality(Number.parseInt(e.target.value));
		}, 500);
	};

	// コンポーネントのアンマウント時にタイマーをクリア
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
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

	// 画像ダウンロード
	const downloadImage = useCallback(() => {
		if (!compressedImage) return;

		// 拡張子の設定
		const extensions = {
			jpeg: "jpg",
			png: "png",
			webp: "webp",
		};

		const extension = extensions[outputFormat];
		const filename = originalFile
			? `compressed-${originalFile.name.split(".")[0]}.${extension}`
			: `compressed-image.${extension}`;

		// Web Share APIが使える場合（主にモバイル）
		if (
			navigator.share &&
			/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
		) {
			try {
				// Blobからファイルを作成
				if (blobCache.current) {
					const file = new File([blobCache.current], filename, {
						type: `image/${outputFormat}`,
					});

					// ファイルがシェア可能かチェック
					if (navigator.canShare({ files: [file] })) {
						navigator
							.share({
								files: [file],
								title: "圧縮画像",
								text: "圧縮された画像です",
							})
							.catch((error) => {
								// シェアがキャンセルされた場合など
								console.error("シェアに失敗しました:", error);
								// フォールバック処理
							});
						return;
					}
				}
			} catch (error) {
				console.error("シェアに失敗しました:", error);
			}
		}

		// 通常のダウンロード処理
		const link = document.createElement("a");
		link.download = filename;

		if (blobCache.current) {
			// Blobを直接使用
			link.href = URL.createObjectURL(blobCache.current);
		} else {
			// 画像URLを使用
			link.href = compressedImage;
		}

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// URLオブジェクトを解放
		if (link.href.startsWith("blob:")) {
			URL.revokeObjectURL(link.href);
		}
	}, [compressedImage, outputFormat, originalFile]);

	// エラーをクリア
	const handleClearUploadError = useCallback(() => {
		setUploadError(null);
	}, []);

	// アップロードした画像をクリア
	const handleClearUploadedImage = useCallback(() => {
		setUploadedImage(null);
		setCompressedImage(null);
		setOriginalFile(null);
		setOriginalSize(0);
		setCompressedSize(0);
		setCompressionRate(0);

		// Blobキャッシュをクリア
		if (blobCache.current && blobCache.current instanceof Blob) {
			URL.revokeObjectURL(URL.createObjectURL(blobCache.current));
			blobCache.current = null;
		}
	}, []);

	// ファイルサイズを読みやすい形式に変換する関数
	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	};

	return (
		<div>
			<div className="card">
				<div className="card-body items-center text-center">
					<h2 className="card-title">画像圧縮</h2>
					<p className="opacity-70 max-w-2xl">
						画像をアップロードして簡単に圧縮。ファイルサイズを削減しながら、画質のバランスを調整できます。
					</p>
				</div>
			</div>

			<div className="flex flex-col sm:grid sm:grid-cols-2 gap-10 mt-6">
				<div>
					<div className="card card-border">
						<div className="card-body">
							<h2 className="card-title justify-center mb-3">
								画像アップロード
							</h2>

							{/* 非表示のファイル入力 */}
							<input
								id="image-upload-input"
								ref={fileInputRef}
								type="file"
								onChange={handleFileUpload}
								accept="image/jpeg, image/png, image/gif, image/webp"
								disabled={isUploading || isProcessing}
								className="hidden"
							/>

							{/* ドラッグ&ドロップエリア */}
							{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
							<div
								className={`border-2 border-dashed h-64 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
									isDragging
										? "border-primary bg-primary/10"
										: "border-base-content/30 hover:border-primary/50"
								} ${isUploading || isProcessing ? "opacity-50 pointer-events-none" : ""}`}
								onDragEnter={handleDragEnter}
								onDragOver={handleDragOver}
								onDragLeave={handleDragLeave}
								onDrop={handleDrop}
								onClick={openFileDialog}
							>
								{!isUploading && !isProcessing && (
									<>
										<FaUpload size={36} className="mb-4 text-base-content/70" />
										<p className="text-center mb-2 flex-grow-0">
											画像をここにドラッグ&ドロップ
										</p>
										<p className="text-center text-sm text-base-content/60 flex-grow-0">
											または、クリックしてファイルを選択
										</p>
									</>
								)}

								{isUploading && (
									<div className="flex flex-col items-center">
										<FaSpinner className="animate-spin" size={24} />
										<p className="mt-2">アップロード中...</p>
									</div>
								)}

								{isProcessing && (
									<div className="flex flex-col items-center w-full">
										<FaSpinner className="animate-spin" size={24} />
										<p className="my-2">圧縮処理中...</p>
										<progress
											className="progress w-full max-w-sm"
											value={50}
											max="100"
										/>
									</div>
								)}
							</div>

							{/* 圧縮設定 */}
							{uploadedImage && !isUploading && (
								<div className="mt-6">
									<h3 className="font-semibold mb-2">圧縮設定</h3>

									<div className="form-control">
										<label className="label" htmlFor="quality-range">
											<span className="label-text">
												画質: {pendingQuality}%
											</span>
										</label>
										<input
											type="range"
											min={1}
											max={100}
											value={pendingQuality}
											onChange={handleQualityChangeWithDebounce}
											onMouseUp={handleQualityChangeComplete}
											onTouchEnd={handleQualityChangeComplete}
											className="range"
											disabled={isProcessing}
											id="quality-range"
										/>
										<div className="flex justify-between text-xs px-1">
											<span>低画質・小サイズ</span>
											<span>高画質・大サイズ</span>
										</div>
									</div>

									<div className="form-control mt-4">
										<label className="label" htmlFor="max-width-select">
											<span className="label-text">最大幅: {maxWidth}px</span>
										</label>
										<select
											value={maxWidth}
											onChange={handleMaxWidthChange}
											className="select select-bordered w-full"
											disabled={isProcessing}
											id="max-width-select"
										>
											<option value={7680}>8K (7680px)</option>
											<option value={3840}>4K (3840px)</option>
											<option value={1920}>Full HD (1920px)</option>
											<option value={1280}>HD (1280px)</option>
											<option value={800}>小 (800px)</option>
											<option value={400}>極小 (400px)</option>
										</select>
									</div>

									<div className="form-control mt-4">
										<label className="label" htmlFor="output-format-select">
											<span className="label-text">出力形式</span>
										</label>
										<select
											value={outputFormat}
											onChange={handleFormatChange}
											className="select select-bordered w-full"
											disabled={isProcessing}
											id="output-format-select"
										>
											<option value="jpeg">JPEG (.jpg)</option>
											<option value="png">PNG (.png)</option>
											<option value="webp">WebP (.webp)</option>
										</select>
									</div>

									{/* ファイルサイズ情報 */}
									{originalSize > 0 && (
										<div className="mt-6 p-4 bg-base-200 rounded-lg">
											<h4 className="font-semibold mb-2">ファイル情報</h4>
											<div className="grid grid-cols-2 gap-2 text-sm">
												<span>元のサイズ:</span>
												<span className="text-right">
													{formatFileSize(originalSize)}
												</span>

												{compressedSize > 0 && (
													<>
														<span>圧縮後サイズ:</span>
														<span className="text-right">
															{formatFileSize(compressedSize)}
														</span>

														<span>削減率:</span>
														<span className="text-right font-bold text-success">
															{compressionRate}%
														</span>
													</>
												)}
											</div>
										</div>
									)}
								</div>
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
							<h2 className="card-title mb-3" id="image-preview">
								プレビュー
							</h2>

							<div className="relative w-full h-64 border border-base-content/20 flex items-center justify-center mb-4">
								{isUploading ? (
									<FaSpinner className="animate-spin" size={32} />
								) : isProcessing ? (
									<div className="flex flex-col items-center">
										<FaSpinner className="animate-spin" size={32} />
										<p className="mt-4">圧縮処理中...</p>
									</div>
								) : uploadedImage ? (
									<div className="relative w-full h-full">
										<NextImage
											src={compressedImage || uploadedImage}
											alt="画像プレビュー"
											fill
											className="object-contain"
										/>
									</div>
								) : (
									<p className="text-base-content/60">
										画像をアップロードしてください
									</p>
								)}
							</div>

							{/* 非表示のキャンバス要素 */}
							<canvas ref={canvasRef} className="hidden" />

							{compressedImage && (
								<button
									type="button"
									className="btn btn-primary"
									onClick={downloadImage}
								>
									圧縮画像をダウンロード
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
