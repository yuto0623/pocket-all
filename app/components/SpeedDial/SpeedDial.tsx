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
					<button tabIndex={0} type="button" className="btn btn-circle btn-lg">
						<IoChatbubbleEllipsesOutline size={20} />
					</button>
				</li>
				<li>
					<button tabIndex={0} type="button" className="btn btn-circle btn-lg">
						<ThemeSwitcher />
					</button>
				</li>
			</ul>
		</div>
	);
}
