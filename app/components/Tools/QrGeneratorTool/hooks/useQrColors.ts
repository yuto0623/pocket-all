// hooks/useQrColors.ts
import { useCallback, useState } from "react";
import { type IColor, useColor } from "react-color-palette";

export function useQrColors() {
	// 初期値
	const initialFrontColor = "#000000";
	const initialBackColor = "#FFFFFF";

	// useColorフックは特殊な動作をする可能性があるため、通常の状態管理に変更
	const [frontColor, setFrontColor] = useState({
		hex: initialFrontColor,
		rgb: { r: 0, g: 0, b: 0, a: 1 },
		hsv: { h: 0, s: 0, v: 0, a: 1 },
	});
	const [backColor, setBackColor] = useState({
		hex: initialBackColor,
		rgb: { r: 255, g: 255, b: 255, a: 1 },
		hsv: { h: 0, s: 0, v: 100, a: 1 },
	});

	const [frontHexInput, setFrontHexInput] = useState(initialFrontColor);
	const [backHexInput, setBackHexInput] = useState(initialBackColor);

	// 関数形式で更新して依存関係をなくす
	const handleFrontColorChange = useCallback((newColor: IColor) => {
		setFrontColor(newColor);
		setFrontHexInput(newColor.hex);
	}, []);

	const handleBackColorChange = useCallback((newColor: IColor) => {
		setBackColor(newColor);
		setBackHexInput(newColor.hex);
	}, []);

	const handleFrontHexInputChange = useCallback((newValue: string) => {
		setFrontHexInput(newValue);
		if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
			setFrontColor((prevColor) => ({
				hex: newValue,
				rgb: prevColor.rgb,
				hsv: prevColor.hsv,
			}));
		}
	}, []);

	const handleBackHexInputChange = useCallback((newValue: string) => {
		setBackHexInput(newValue);
		if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
			setBackColor((prevColor) => ({
				hex: newValue,
				rgb: prevColor.rgb,
				hsv: prevColor.hsv,
			}));
		}
	}, []);

	return {
		frontColor,
		backColor,
		frontHexInput,
		backHexInput,
		handleFrontColorChange,
		handleBackColorChange,
		handleFrontHexInputChange,
		handleBackHexInputChange,
	};
}
