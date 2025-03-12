// hooks/useQrDownload.ts
import type { RefObject } from "react";

export const useQrDownload = (size: number, backColor: string) => {
	const downloadQRCode = (
		text: string,
		qrRef: RefObject<SVGSVGElement | null>,
	) => {
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
			ctx.fillStyle = backColor; // 背景色
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0);

			// データURLを生成し、ダウンロードを開始
			const pngUrl = canvas.toDataURL("image/png");

			handleShare(pngUrl);
		};

		// SVGデータをbase64エンコードしてImageのsrcにセット
		img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
	};

	const handleShare = (pngUrl: string) => {
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
							handleDownload(pngUrl);
						});
				});
		} else {
			// Web Share APIがサポートされていない場合は従来の方法でダウンロード
			handleDownload(pngUrl);
		}
	};

	const handleDownload = (pngUrl: string) => {
		// ダウンロードリンクを作成して自動クリック
		const downloadLink = document.createElement("a");
		downloadLink.href = pngUrl;
		downloadLink.download = "qrcode.png"; // ダウンロードするファイル名
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	};

	return { downloadQRCode };
};
