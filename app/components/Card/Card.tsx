import Link from "next/link";
import type { ReactNode } from "react";

type CardProps = {
	title: string;
	children: ReactNode;
	href: string;
};

export default function Card({ title, children, href }: CardProps) {
	return (
		<div className="card card-border">
			<div className="card-body">
				<h2 className="card-title">
					{title}
					{/* <div className="badge badge-neutral">Primary</div> */}
				</h2>
				<div>{children}</div>
				<div className="justify-end card-actions">
					<Link href={href} className="btn btn-primary">
						このツールを使う
					</Link>
				</div>
			</div>
		</div>
	);
}
