import Link from "next/link";
import type { ReactNode } from "react";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

export default function Header({
	title,
	subtitle,
}: Readonly<{
	title: ReactNode;
	subtitle?: ReactNode;
}>) {
	return (
		<header className="navbar bg-base-100 shadow-sm">
			<div className="flex-1">
				<Link href="/" className="btn btn-ghost text-xl">
					<h1 className="leading-none">
						{title}
						{subtitle && (
							<small className="inline-block ml-3 text-xs opacity-70">
								{subtitle}
							</small>
						)}
					</h1>
				</Link>
			</div>
			<div className="flex-none">
				<ul className="menu menu-horizontal px-1">
					<li>
						<Link href="/">Link</Link>
					</li>
					{/* <li>
						<details>
							<summary>Parent</summary>
							<ul className="bg-base-100 rounded-t-none p-2">
								<li>
									<a href="/">Link 1</a>
								</li>
								<li>
									<a href="/">Link 2</a>
								</li>
							</ul>
						</details>
					</li> */}
				</ul>
			</div>
			<ThemeSwitcher />
		</header>
	);
}
