"use client";
import { CgMenuCake } from "react-icons/cg";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

export default function SpeedDial() {
	return (
		<div className="dropdown dropdown-top dropdown-end fixed bottom-6 right-4 z-10">
			<button
				tabIndex={0}
				type="button"
				className="btn btn-circle btn-lg shadow-sm"
				title="メニュー"
			>
				<CgMenuCake size={30} />
			</button>
			<ul className="dropdown-content flex flex-col mb-4 gap-2">
				<li>
					{/* Open the modal using document.getElementById('ID').showModal() method */}
					<button
						type="button"
						className="btn btn-circle btn-lg"
						onClick={(e) => {
							e.stopPropagation(); // イベントの伝播を止める
							(
								document.getElementById("contact_modal") as HTMLDialogElement
							)?.showModal();
						}}
					>
						<IoChatbubbleEllipsesOutline size={20} />
					</button>
				</li>
				<li>
					<div className="btn btn-circle btn-lg">
						<ThemeSwitcher />
					</div>
				</li>
			</ul>
			{/* Modal */}
			<dialog id="contact_modal" className="modal z-index-50">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Hello!</h3>
					<p className="py-4">Press ESC key or click outside to close</p>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button type="submit">close</button>
				</form>
			</dialog>
		</div>
	);
}
