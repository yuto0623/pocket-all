import Link from "next/link";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

export default function Header() {
	return (
		<header className="navbar bg-base-100 shadow-sm">
			<div className="flex-1">
				<Link href="/" className="btn btn-ghost text-xl">
					<h1>PocketALL(仮)</h1>
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
