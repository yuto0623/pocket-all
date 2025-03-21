"use client";
import { useEffect, useState } from "react";
import {
	IoCheckmarkCircleOutline,
	IoClose,
	IoCloseCircleOutline,
	IoInformationCircleOutline,
	IoWarningOutline,
} from "react-icons/io5";

export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastProps {
	id: string;
	message: string;
	type: ToastType;
	duration?: number; // ミリ秒単位
	onClose?: (id: string) => void;
}

export default function Toast({
	id,
	message,
	type,
	duration = 5000,
	onClose,
}: ToastProps) {
	// 表示状態を管理するstate
	const [isVisible, setIsVisible] = useState(false);

	// マウント時にアニメーションのために非同期で表示状態をtrueに変更
	useEffect(() => {
		// マウント後にアニメーションが適用されるよう少し遅延させる
		const showTimer = setTimeout(() => {
			setIsVisible(true);
		}, 10);

		// 自動で閉じるタイマー
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => {
				onClose?.(id);
			}, 500); // アニメーション完了後に削除（時間を長くして滑らかに）
		}, duration);

		return () => {
			clearTimeout(timer);
			clearTimeout(showTimer);
		};
	}, [duration, id, onClose]);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => {
			onClose?.(id);
		}, 500);
	};

	const getIcon = () => {
		switch (type) {
			case "success":
				return <IoCheckmarkCircleOutline size={20} />;
			case "info":
				return <IoInformationCircleOutline size={20} />;
			case "warning":
				return <IoWarningOutline size={20} />;
			case "error":
				return <IoCloseCircleOutline size={20} />;
		}
	};

	const getColorClass = () => {
		switch (type) {
			case "success":
				return "alert-success";
			case "info":
				return "alert-info";
			case "warning":
				return "alert-warning";
			case "error":
				return "alert-error";
		}
	};

	return (
		<div
			className={`
        alert ${getColorClass()} shadow-lg mb-2 max-w-md 
        transition-all duration-500 ease-in-out
        ${
					isVisible
						? "opacity-100 translate-y-0 scale-100"
						: "opacity-0 translate-y-8 scale-95"
				}
      `}
			style={{
				transformOrigin: "bottom right",
			}}
		>
			<div className="flex justify-between w-full items-center">
				<div className="flex items-center gap-2">
					{getIcon()}
					<span>{message}</span>
				</div>
				<button
					className="btn btn-ghost btn-sm btn-circle"
					onClick={handleClose}
					aria-label="閉じる"
					type="button"
				>
					<IoClose size={18} />
				</button>
			</div>
		</div>
	);
}
