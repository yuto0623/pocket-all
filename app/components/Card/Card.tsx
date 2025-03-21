import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type CardProps = {
	title: string;
	image: ReactNode;
	children: ReactNode;
	href: string;
	indicator?: string;
};

export default function Card({
	title,
	image,
	children,
	href,
	indicator,
}: CardProps) {
	return (
		<div className="indicator w-full">
			{indicator && (
				<span className="indicator-item indicator-center badge badge-base-200">
					{indicator}
				</span>
			)}
			<div className={`card card-border ${indicator ? "opacity-50" : ""}`}>
				<figure>{image}</figure>
				<div className="card-body">
					<h2 className="card-title">
						{title}
						{/* <div className="badge badge-neutral">Primary</div> */}
					</h2>
					<div className="leading-6">{children}</div>
					<div className="justify-end card-actions">
						<Link href={href} className="btn btn-outline">
							このツールを使う
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
