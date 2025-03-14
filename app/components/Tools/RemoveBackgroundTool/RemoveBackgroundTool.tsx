"use client";
import { removeBackground } from "@imgly/background-removal";
import { default as NextImage } from "next/image";
import { useCallback, useRef, useState } from "react";
import { FaImage, FaSpinner, FaTimes, FaUpload } from "react-icons/fa";

export default function RemoveBackgroundTool() {
	// 基本的な状態
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [processedImage, setProcessedImage] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [processingProgress, setProcessingProgress] = useState({
		progress: 0,
		text: "",
	});
	const [uploadError, setUploadError] = useState<string | null>(null);

	// ドラッグ&ドロップ用の状態
	const [isDragging, setIsDragging] = useState(false);

	// 参照
	const fileInputRef = useRef<HTMLInputElement>(null);
	const blobCache = useRef<Blob | null>(null);

	// 画像の読み込みと処理
	const loadAndProcessImage = useCallback(async (file: File) => {
		setIsUploading(true);
		setUploadError(null);
		setProcessedImage(null);
		setProcessingProgress({ progress: 0, text: "" });

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

		try {
			// 元の画像を表示
			const reader = new FileReader();
			reader.onload = async (event) => {
				const imgUrl = event.target?.result as string;
				setUploadedImage(imgUrl);
				setIsUploading(false);

				// 画像が読み込まれたらバックグラウンド削除処理を開始
				await processImageWithBackgroundRemoval(file);
			};
			reader.onerror = () => {
				setUploadError("ファイルの読み込みに失敗しました");
				setIsUploading(false);
			};
			reader.readAsDataURL(file);
		} catch (error) {
			setUploadError("画像の処理中にエラーが発生しました");
			setIsUploading(false);
		}
	}, []);

	// 背景除去処理
	const processImageWithBackgroundRemoval = useCallback(async (file: File) => {
		try {
			setIsProcessing(true);

			// @imgly/background-removal を使用して背景を削除
			const blob = await removeBackground(file, {
				debug: true,
				progress: (key, current, total) => {
					// 進捗状況を更新 (0-100%)
					setProcessingProgress({
						progress: Math.round((current / total) * 100),
						text: `Downloading ${key}: ${current} of ${total}`,
					});
					console.log(`Downloading ${key}: ${current} of ${total}`);
				},
			});

			blobCache.current = blob;

			// Blobから画像URLを作成
			const processedImageUrl = URL.createObjectURL(blob);
			setProcessedImage(processedImageUrl);
		} catch (error) {
			console.error("背景除去処理に失敗しました:", error);
			setUploadError(
				`背景除去処理に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`,
			);
		} finally {
			setIsProcessing(false);
			setProcessingProgress({ progress: 0, text: "" });
		}
	}, []);

	// ファイルアップロードの処理
	const handleFileUpload = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;
			loadAndProcessImage(file);
		},
		[loadAndProcessImage],
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
				loadAndProcessImage(file);
			}
		},
		[loadAndProcessImage],
	);

	// ドロップエリアのクリックでファイル選択ダイアログを開く
	const openFileDialog = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	// 画像ダウンロード
	const downloadImage = useCallback(() => {
		if (!processedImage) return;

		const link = document.createElement("a");
		link.download = "transparent-image.png";

		if (blobCache.current) {
			// Blobを直接使用
			link.href = URL.createObjectURL(blobCache.current);
		} else {
			// 画像URLを使用
			link.href = processedImage;
		}

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// URLオブジェクトを解放
		if (link.href.startsWith("blob:")) {
			URL.revokeObjectURL(link.href);
		}
	}, [processedImage]);

	// エラーをクリア
	const handleClearUploadError = useCallback(() => {
		setUploadError(null);
	}, []);

	// アップロードした画像をクリア
	const handleClearUploadedImage = useCallback(() => {
		setUploadedImage(null);
		setProcessedImage(null);

		// Blobキャッシュをクリア
		if (blobCache.current) {
			URL.revokeObjectURL(URL.createObjectURL(blobCache.current));
			blobCache.current = null;
		}
	}, []);

	return (
		<div>
			<div className="card">
				<div className="card-body items-center text-center">
					<h2 className="card-title">画像透過</h2>
					<p className="opacity-70 max-w-2xl">
						画像をアップロードするだけで自動的に背景を透明化し、PNG形式で保存できます。
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
										<FaUpload size={36} className="mb-4 opacity-70" />
										<p className="text-center mb-2">
											画像をここにドラッグ&ドロップ
										</p>
										<p className="text-center text-sm opacity-70">
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
										<p className="mt-2">
											{processingProgress.text}... {processingProgress.progress}
											%
										</p>
										<div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
											<div
												className="bg-primary h-2.5 rounded-full"
												style={{ width: `${processingProgress}%` }}
											/>
										</div>
									</div>
								)}
							</div>

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
										<p className="mt-4">背景を除去しています...</p>
										<p className="mt-2 text-sm opacity-70">
											初回実行時はモデルをダウンロードするため時間がかかる場合があります
										</p>
									</div>
								) : uploadedImage ? (
									<div className="relative w-full h-full">
										<NextImage
											src={processedImage || uploadedImage}
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
