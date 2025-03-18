"use client";
import { useState, useEffect, useRef } from "react";
import { CgMenuCake } from "react-icons/cg";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

export default function SpeedDial() {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div ref={containerRef} className="fixed bottom-6 right-4 z-10">
			<button
				type="button"
				className="btn btn-circle btn-lg shadow-sm"
				title="メニュー"
				onClick={() => setIsOpen(!isOpen)}
			>
				<CgMenuCake size={30} />
			</button>

			<ul
				className={`
          absolute bottom-full right-0 mb-2 flex flex-col gap-2 items-center
          transition-all duration-200 ease-out origin-bottom
          ${
						isOpen
							? "opacity-100 scale-100 translate-y-0"
							: "opacity-0 scale-95 translate-y-2 pointer-events-none"
					}
        `}
			>
				<li>
					<FeedbackModal />
				</li>
				<li>
					<div className="btn btn-circle btn-lg">
						<ThemeSwitcher />
					</div>
				</li>
			</ul>
		</div>
	);
}
