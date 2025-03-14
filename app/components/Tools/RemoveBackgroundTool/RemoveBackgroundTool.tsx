"use client";
import { removeBackground } from "@imgly/background-removal";
import { default as NextImage } from "next/image";
import Image from "next/image";
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
				debug: false,
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
			handleClearUploadedImage;
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
	const downloadImage = useCallback(async () => {
		if (!processedImage) return;
		// Web Share APIが使える場合（主にモバイル）
		if (
			navigator.share &&
			/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
		) {
			try {
				// Blobからファイルを作成
				const file = blobCache.current
					? new File([blobCache.current], "transparent-image.png", {
							type: "image/png",
						})
					: await (async () => {
							// processedImageからBlobを取得
							const response = await fetch(processedImage);
							const blob = await response.blob();
							return new File([blob], "transparent-image.png", {
								type: "image/png",
							});
						})();

				// ファイルがシェア可能かチェック
				if (navigator.canShare({ files: [file] })) {
					await navigator.share({
						files: [file],
						title: "透過画像",
						text: "背景を透過した画像です",
					});
					return; // シェア成功したら終了
				}
			} catch (error) {
				if (error instanceof Error && error.name !== "AbortError") {
					console.error("シェアに失敗しました:", error);
					// フォールバック：通常のダウンロードを試みる
				}
			}
		}

		// Web Share APIが使用できない場合や失敗した場合は従来のダウンロード方法
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
										<p className="my-2">
											{processingProgress.text} ...{" "}
											{processingProgress.progress}%
										</p>
										<progress
											className="progress w-full max-w-sm"
											value={processingProgress.progress}
											max="100"
										/>
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
											className="object-contain bg-white
											[background-image:linear-gradient(45deg,#ddd_25%,transparent_25%,transparent_75%,#ddd_75%,#ddd),linear-gradient(45deg,#ddd_25%,transparent_25%,transparent_75%,#ddd_75%,#ddd)]
											[background-size:18px_18px]
											[background-position:0_0,9px_9px]
											overflow-hidden"
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
			<h3 className="text-center text-xl font-bold mt-10">サンプル</h3>
			<figure
				className="diff aspect-16/9 max-w-[600px] mx-auto mt-8 bg-white
											[background-image:linear-gradient(45deg,#ddd_25%,transparent_25%,transparent_75%,#ddd_75%,#ddd),linear-gradient(45deg,#ddd_25%,transparent_25%,transparent_75%,#ddd_75%,#ddd)]
											[background-size:18px_18px]
											[background-position:0_0,9px_9px]
											overflow-hidden"
			>
				<div className="diff-item-1" role="img">
					<Image
						src="/img/RemoveBackgroundTool/sample.jpg"
						alt="example"
						width={1920}
						height={1280}
					/>
				</div>
				<div className="diff-item-2" role="img">
					<Image
						src="/img/RemoveBackgroundTool/transparent-sample.png"
						alt="example"
						width={1920}
						height={1280}
					/>
				</div>
				<div className="diff-resizer" />
			</figure>
		</div>
	);
}
