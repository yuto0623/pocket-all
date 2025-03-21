"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Toast, { type ToastProps, type ToastType } from "./Toast";

interface ToastContainerProps {
	toasts: Array<{
		id: string;
		message: string;
		type: ToastType;
		duration?: number;
	}>;
	removeToast: (id: string) => void;
}

export default function ToastContainer({
	toasts,
	removeToast,
}: ToastContainerProps) {
	const [isMounted, setIsMounted] = useState(false);

	// クライアントサイドでのマウント検出 - useEffect を使用
	useEffect(() => {
		setIsMounted(true);
		return () => setIsMounted(false);
	}, []);

	// クライアントサイドでマウントされていない場合は何も表示しない
	if (!isMounted) {
		return null;
	}

	// マウント後のみ createPortal を実行
	return createPortal(
		<div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					id={toast.id}
					message={toast.message}
					type={toast.type}
					duration={toast.duration}
					onClose={removeToast}
				/>
			))}
		</div>,
		document.body,
	);
}
