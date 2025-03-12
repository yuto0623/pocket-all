"use client";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

export default function QrGeneratorTool() {
	return (
		<div>
			<div className="card card-border">
				<div className="card-body items-center text-center">
					<h2 className="card-title">
						データ入力
						{/* <div className="badge badge-neutral">Primary</div> */}
					</h2>
					<div className="leading-6">
						<p>hello</p>
					</div>
					<div className="justify-end card-actions">
						<button type="button" className="btn btn-primary">
							QRコードを生成
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
