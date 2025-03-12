// components/QrColorPicker.tsx
import { ColorPicker, type IColor } from "react-color-palette";
import "react-color-palette/css";

type QrColorPickerProps = {
	id: string;
	label: string;
	color: IColor;
	hexInput: string;
	popoverId: string;
	anchorName: string;
	onColorChange: (newColor: IColor) => void;
	onHexInputChange: (value: string) => void;
};

export default function QrColorPicker({
	id,
	label,
	color,
	hexInput,
	popoverId,
	anchorName,
	onColorChange,
	onHexInputChange,
}: QrColorPickerProps) {
	return (
		<div>
			<label htmlFor={id}>{label}</label>
			<div className="flex">
				<button
					type="button"
					popoverTarget={popoverId}
					className={`btn w-10 ${anchorName}`}
					style={{ backgroundColor: color.hex }}
					title={`${label}の選択`}
					id={id}
				/>
				<input
					type="text"
					className="input"
					value={hexInput}
					onChange={(e) => {
						const newValue = e.target.value;
						onHexInputChange(newValue);
					}}
					aria-label={`${label}の16進数カラーコード`}
				/>
			</div>
			<div
				className="dropdown [position-anchor:--anchor-1]"
				popover="auto"
				id={popoverId}
			>
				<ColorPicker
					color={color}
					onChange={onColorChange}
					hideInput={["rgb", "hsv"]}
					hideAlpha
				/>
			</div>
		</div>
	);
}
