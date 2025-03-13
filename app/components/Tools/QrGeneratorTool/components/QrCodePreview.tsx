"use client";
import { QRCodeSVG } from "qrcode.react";
import { type ComponentProps, forwardRef } from "react";
import React from "react";

type QrCodePreviewProps = {
	text: string;
	size: number;
	margin: number;
	frontColor: string;
	backColor: string;
	errorCorrectionLevel: ComponentProps<typeof QRCodeSVG>["level"];
	addImage: boolean;
	uploadedImage: string | null;
	addImageSize: number;
	onDownload: () => void;
};

function QrCodePreviewComponent(
	{
		text,
		size,
		margin,
		frontColor,
		backColor,
		errorCorrectionLevel,
		addImage,
		uploadedImage,
		addImageSize,
		onDownload,
	}: QrCodePreviewProps,
	ref: React.Ref<SVGSVGElement> | undefined,
) {
	return (
		<div className="card card-border">
			<div className="card-body items-center text-center">
				<h2 className="card-title" id="qr-code-preview">
					QRコードプレビュー
				</h2>
				{text ? (
					<QRCodeSVG
						ref={ref}
						value={text}
						size={size}
						bgColor={backColor}
						fgColor={frontColor}
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
					<label
						htmlFor="qr-text-or-url-input"
						style={{
							width: `${size}px`,
							height: `${size}px`,
						}}
						className="bg-base-content flex items-center justify-center"
					>
						<p className="text-white dark:text-gray-800">
							URLかテキストを入力してください
						</p>
					</label>
				)}
				<p className="text-sm text-base-content/60 mb-5">
					{size} x {size} ピクセル
				</p>
				<button type="button" className="btn btn-primary" onClick={onDownload}>
					ダウンロードする
				</button>
			</div>
		</div>
	);
}

// forwardRefを使ってrefを転送し、React.memoでメモ化
const QrCodePreview = React.memo(forwardRef(QrCodePreviewComponent));

export default QrCodePreview;
