import { FaGithub } from "react-icons/fa";

export default function Footer() {
	return (
		<footer className="footer sm:footer-horizontal bg-neutral text-neutral-content items-center p-4">
			<aside
				className="grid-flow-col items-center mx-auto sm:mx-0
      "
			>
				<p className="">
					Copyright © {new Date().getFullYear()} Yuto Shintani All right
					reserved
				</p>
			</aside>
			<nav className="grid-flow-col gap-4 place-self-center justify-self-end">
				<a
					href="https://github.com/yuto0623/pocket-all"
					target="_blank"
					rel="noopener noreferrer"
				>
					<FaGithub size={25} />
				</a>
			</nav>
		</footer>
	);
}
