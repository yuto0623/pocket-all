"use client";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { FaLink } from "react-icons/fa";

export default function QrGeneratorTool() {
	const [text, setText] = useState("https://example.com");

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
						<input
							type="text"
							className="input w-full"
							required
							placeholder="https://"
							onChange={(e) => setText(e.target.value)}
						/>
						<p className="fieldset-label">URLかテキストを入力</p>
					</fieldset>
					<div className="justify-end card-actions">
						<button type="button" className="btn btn-primary">
							QRコードを生成
						</button>
					</div>
				</div>
			</div>
			<div>
				{text ? (
					<QRCodeSVG
						value={text}
						size={200}
						bgColor="#FFFFFF"
						fgColor="#000000"
						level="M"
						marginSize={3}
					/>
				) : (
					<p className="text-gray-500">テキストを入力してください</p>
				)}
			</div>
		</div>
	);
}
