"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

export default function FeedbackModal() {
	const [isOpen, setIsOpen] = useState(false);
	const modalRef = useRef<HTMLDialogElement | null>(null);
	const [isMounted, setIsMounted] = useState(false);

	// クライアントサイドでのマウント検出
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// モーダル表示制御
	useEffect(() => {
		if (!modalRef.current) return;

		if (isOpen) {
			modalRef.current.showModal();

			// モーダルが閉じられたときの処理
			const handleClose = () => setIsOpen(false);
			modalRef.current.addEventListener("close", handleClose);

			return () => {
				modalRef.current?.removeEventListener("close", handleClose);
			};
		}
		modalRef.current.close();
	}, [isOpen]);

	// モーダルを開く処理
	const openModal = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsOpen(true);
	};

	return (
		<>
			<button
				type="button"
				className="btn btn-circle btn-lg"
				onClick={openModal}
			>
				<IoChatbubbleEllipsesOutline size={20} />
			</button>

			{isMounted &&
				createPortal(
					<dialog ref={modalRef} id="contact_modal" className="modal z-50">
						<div className="modal-box">
							<h3 className="font-bold text-lg">お問い合わせ</h3>
							<p className="py-4">
								ご質問やご要望がございましたら気軽にこちらからお送りください！
							</p>
							<form method="dialog">
								<button
									type="submit"
									className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
								>
									✕
								</button>
							</form>
							<div className="modal-action">
								<form method="dialog">
									<button type="submit" className="btn">
										閉じる
									</button>
								</form>
							</div>
						</div>
						<form method="dialog" className="modal-backdrop">
							<button type="submit">閉じる</button>
						</form>
					</dialog>,
					document.body,
				)}
		</>
	);
}
