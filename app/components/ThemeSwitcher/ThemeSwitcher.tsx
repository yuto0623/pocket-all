"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LuSun } from "react-icons/lu";
import { LuMoon } from "react-icons/lu";

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// コンポーネントがマウントされた後にのみレンダリング
	// これはハイドレーションエラーを防ぐために必要らしい？
	useEffect(() => {
		setMounted(true);
	}, []);

	//コンポーネントがマウントされてないと時はダミーボタンを表示
	if (!mounted) {
		return (
			<button
				type="button"
				className="btn btn-circle"
				aria-label="テーマ切り替え"
				title="テーマ切り替え"
			>
				<LuSun size={20} />
			</button>
		);
	}

	return (
		<button
			type="button"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className="btn btn-circle"
			aria-label="テーマ切り替え"
			title="テーマ切り替え"
		>
			{theme === "dark" ? <LuSun size={20} /> : <LuMoon size={20} />}
		</button>
	);
}
