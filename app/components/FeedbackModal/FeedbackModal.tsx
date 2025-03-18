"use client";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoMailOutline } from "react-icons/io5";

export default function FeedbackModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<{
		success?: boolean;
		message?: string;
	}>({});

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
			const handleClose = () => {
				setIsOpen(false);
				// submitStatusをクリア
				setSubmitStatus({});
				// オプション: フォームもリセット
				setEmail("");
				setMessage("");
			};
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

	// フォーム送信処理
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!email || !message) {
			return setSubmitStatus({
				success: false,
				message: "すべてのフィールドを入力してください。",
			});
		}

		setIsSubmitting(true);
		setSubmitStatus({});

		try {
			const response = await fetch("/api/send-feedback", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, message }),
			});

			const data = await response.json();

			if (response.ok) {
				setSubmitStatus({
					success: true,
					message: "ご意見ありがとうございました！",
				});
				setEmail("");
				setMessage("");
			} else {
				setSubmitStatus({
					success: false,
					message: data.error || "送信エラーが発生しました。",
				});
			}
		} catch (error) {
			setSubmitStatus({
				success: false,
				message: "サーバーとの通信に失敗しました。",
			});
		} finally {
			setIsSubmitting(false);
		}
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

							{submitStatus.message && (
								<div
									className={`alert ${submitStatus.success ? "alert-success" : "alert-error"} mb-4`}
								>
									{submitStatus.message}
								</div>
							)}
							{!submitStatus.success && (
								<form onSubmit={handleSubmit}>
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
													placeholder="メールアドレス"
													required
													value={email}
													onChange={(e) => setEmail(e.target.value)}
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
												value={message}
												onChange={(e) => setMessage(e.target.value)}
											/>
											<div className="validator-hint hidden">
												ご質問やご要望を入力してください
											</div>
										</div>
									</div>
									<div className="modal-action justify-center">
										<button
											type="submit"
											className="btn btn-primary"
											disabled={isSubmitting}
										>
											{isSubmitting ? "送信中..." : "送信"}
										</button>
									</div>
								</form>
							)}
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
