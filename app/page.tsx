import Image from "next/image";
import Header from "./components/Header/Header";
import ThemeToggler from "./components/test";

export default function Home() {
	return (
		<div>
			<Header />
			<button type="button" className="btn">
				Default
			</button>
			<ThemeToggler />
		</div>
	);
}
