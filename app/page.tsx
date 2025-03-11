import Image from "next/image";
import Header from "./components/Header/Header";
import Card from "./components/Card/Card";

export default function Home() {
	return (
		<div>
			<Header />
			<div className="flex flex-col gap-10">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-[1600px] mx-auto">
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
				</div>
				<button type="button" className="btn">
					Default
				</button>
			</div>
		</div>
	);
}
