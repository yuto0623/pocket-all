"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggler() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// コンポーネントがマウントされた後にのみレンダリング
	// これはハイドレーションエラーを防ぐために必要
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div className="flex items-center">
			<button
				type="button"
				onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				className="btn"
				aria-label="テーマ切り替え"
			>
				{theme === "dark" ? "🌞 ライトモード" : "🌙 ダークモード"}
			</button>
		</div>
	);
}
