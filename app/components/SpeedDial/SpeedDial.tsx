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
						onClick={() =>
							(
								document.getElementById("my_modal_2") as HTMLDialogElement
							)?.showModal()
						}
					>
						<IoChatbubbleEllipsesOutline size={20} />
						open modal
					</button>
					<dialog id="my_modal_2" className="modal">
						<div className="modal-box">
							<h3 className="font-bold text-lg">Hello!</h3>
							<p className="py-4">Press ESC key or click outside to close</p>
						</div>
						<form method="dialog" className="modal-backdrop">
							<button type="button">close</button>
						</form>
					</dialog>
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
