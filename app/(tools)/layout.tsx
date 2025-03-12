"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();

	const breadcrumbs = useMemo(() => {
		// パスを分割して配列に変換（空の要素を除去）
		const segments = pathname
			.split("/")
			.filter((segment) => segment !== "" && segment !== "(tools)");

		// 先頭に Home を追加
		const crumbs = [{ label: "Home", path: "/" }];

		// パスの各セグメントに対応するパンくず項目を作成
		let currentPath = "";
		for (const segment of segments) {
			currentPath += `/${segment}`;

			// ルートセグメント名をきれいな表示名に変換
			let label = segment;
			// ハイフンをスペースに置き換え、各単語の先頭を大文字に
			label = label
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");

			crumbs.push({ label, path: currentPath });
		}

		return crumbs;
	}, [pathname]);

	return (
		<div className="w-full max-w-[1200px] mx-auto px-4 my-6">
			<div className="breadcrumbs text-sm mb-10">
				<ul>
					{breadcrumbs.map((crumb, index) => {
						// 最後の項目はリンクではなくテキストとして表示
						const isLast = index === breadcrumbs.length - 1;

						return (
							<li key={crumb.path}>
								{isLast ? (
									<span>{crumb.label}</span>
								) : (
									<Link href={crumb.path}>{crumb.label}</Link>
								)}
							</li>
						);
					})}
				</ul>
			</div>
			{children}
		</div>
	);
}
