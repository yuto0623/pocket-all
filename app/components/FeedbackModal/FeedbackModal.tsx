"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";

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
								ご質問やご要望がございましたら気軽にこちらからお送りください！（機能実装中。まだ送信できません）
							</p>
							<form method="dialog">
								<button
									type="submit"
									className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
								>
									✕
								</button>
							</form>
							<form>
								<div className="flex flex-col gap-4">
									<div>
										<label htmlFor="email" className="label block text-sm">
											返信用メールアドレス
										</label>
										<label className="input validator w-full">
											<IoMailOutline />
											<input
												id="email"
												type="email"
												placeholder="yuto.ryr0623@gmail.com"
												required
											/>
										</label>
										<div className="validator-hint hidden">
											メールアドレスを入力してください
										</div>
									</div>
									<div>
										<label htmlFor="message" className="label block text-sm">
											ご質問やご要望
										</label>
										<textarea
											id="message"
											className="textarea w-full validator"
											placeholder="○○の機能が欲しい / △△のバグを見つけた"
											required
										/>
										<div className="validator-hint hidden">
											ご質問やご要望を入力してください
										</div>
									</div>
								</div>
								<div className="modal-action justify-center">
									<button type="submit" className="btn">
										送信
									</button>
								</div>
							</form>
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
