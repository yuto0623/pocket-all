"use client";
import { useToast } from "@/app/components/Toast/ToastContext";

export default function SomePage() {
	const { showToast } = useToast();

	const handleSuccess = () => {
		showToast("操作が成功しました", "success");
	};

	return (
		<div>
			<button type="button" onClick={handleSuccess} className="btn btn-primary">
				成功通知を表示
			</button>
		</div>
	);
}
