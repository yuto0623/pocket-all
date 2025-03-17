export type UnitCategory = {
	id: string;
	name: string;
	units: UnitDefinition[];
	commonConversions?: [string, string][];
};

export type UnitDefinition = {
	id: string;
	name: string;
	toBase: (value: number) => number;
	fromBase: (value: number) => number;
};

export const categories: UnitCategory[] = [
	{
		id: "length",
		name: "長さ",
		units: [
			{
				id: "meter",
				name: "メートル (m)",
				toBase: (v) => v,
				fromBase: (v) => v,
			},
			{
				id: "kilometer",
				name: "キロメートル (km)",
				toBase: (v) => v * 1000,
				fromBase: (v) => v / 1000,
			},
			{
				id: "centimeter",
				name: "センチメートル (cm)",
				toBase: (v) => v / 100,
				fromBase: (v) => v * 100,
			},
			{
				id: "millimeter",
				name: "ミリメートル (mm)",
				toBase: (v) => v / 1000,
				fromBase: (v) => v * 1000,
			},
			{
				id: "inch",
				name: "インチ (in)",
				toBase: (v) => v * 0.0254,
				fromBase: (v) => v / 0.0254,
			},
			{
				id: "foot",
				name: "フィート (ft)",
				toBase: (v) => v * 0.3048,
				fromBase: (v) => v / 0.3048,
			},
			{
				id: "yard",
				name: "ヤード (yd)",
				toBase: (v) => v * 0.9144,
				fromBase: (v) => v / 0.9144,
			},
			{
				id: "mile",
				name: "マイル (mi)",
				toBase: (v) => v * 1609.344,
				fromBase: (v) => v / 1609.344,
			},
		],
		commonConversions: [
			["centimeter", "inch"],
			["meter", "foot"],
			["kilometer", "mile"],
		],
	},
	{
		id: "weight",
		name: "重さ",
		units: [
			{
				id: "gram",
				name: "グラム (g)",
				toBase: (v) => v,
				fromBase: (v) => v,
			},
			{
				id: "kilogram",
				name: "キログラム (kg)",
				toBase: (v) => v * 1000,
				fromBase: (v) => v / 1000,
			},
			{
				id: "milligram",
				name: "ミリグラム (mg)",
				toBase: (v) => v / 1000,
				fromBase: (v) => v * 1000,
			},
			{
				id: "ton",
				name: "トン (t)",
				toBase: (v) => v * 1000000,
				fromBase: (v) => v / 1000000,
			},
			{
				id: "pound",
				name: "ポンド (lb)",
				toBase: (v) => v * 453.59237,
				fromBase: (v) => v / 453.59237,
			},
			{
				id: "ounce",
				name: "オンス (oz)",
				toBase: (v) => v * 28.349523125,
				fromBase: (v) => v / 28.349523125,
			},
		],
		commonConversions: [
			["kilogram", "pound"],
			["gram", "ounce"],
			["ton", "pound"],
		],
	},
	{
		id: "volume",
		name: "体積・容量",
		units: [
			{
				id: "liter",
				name: "リットル (L)",
				toBase: (v) => v,
				fromBase: (v) => v,
			},
			{
				id: "milliliter",
				name: "ミリリットル (mL)",
				toBase: (v) => v / 1000,
				fromBase: (v) => v * 1000,
			},
			{
				id: "cubicMeter",
				name: "立方メートル (m³)",
				toBase: (v) => v * 1000,
				fromBase: (v) => v / 1000,
			},
			{
				id: "cup",
				name: "カップ (日本)",
				toBase: (v) => v * 0.2,
				fromBase: (v) => v / 0.2,
			},
			{
				id: "usCup",
				name: "カップ (米国)",
				toBase: (v) => v * 0.24,
				fromBase: (v) => v / 0.24,
			},
			{
				id: "usGallon",
				name: "ガロン (US)",
				toBase: (v) => v * 3.78541,
				fromBase: (v) => v / 3.78541,
			},
			{
				id: "usFluidOunce",
				name: "液量オンス (US)",
				toBase: (v) => v * 0.0295735,
				fromBase: (v) => v / 0.0295735,
			},
		],
		commonConversions: [
			["liter", "usGallon"],
			["milliliter", "usFluidOunce"],
			["cup", "usCup"],
		],
	},
	{
		id: "area",
		name: "面積",
		units: [
			{
				id: "squareMeter",
				name: "平方メートル (m²)",
				toBase: (v) => v,
				fromBase: (v) => v,
			},
			{
				id: "squareKilometer",
				name: "平方キロメートル (km²)",
				toBase: (v) => v * 1000000,
				fromBase: (v) => v / 1000000,
			},
			{
				id: "hectare",
				name: "ヘクタール (ha)",
				toBase: (v) => v * 10000,
				fromBase: (v) => v / 10000,
			},
			{
				id: "squareFoot",
				name: "平方フィート (ft²)",
				toBase: (v) => v * 0.09290304,
				fromBase: (v) => v / 0.09290304,
			},
			{
				id: "squareYard",
				name: "平方ヤード (yd²)",
				toBase: (v) => v * 0.83612736,
				fromBase: (v) => v / 0.83612736,
			},
			{
				id: "acre",
				name: "エーカー (acre)",
				toBase: (v) => v * 4046.8564224,
				fromBase: (v) => v / 4046.8564224,
			},
			{
				id: "tsubo",
				name: "坪",
				toBase: (v) => v * 3.305785,
				fromBase: (v) => v / 3.305785,
			},
		],
		commonConversions: [
			["squareMeter", "squareFoot"],
			["hectare", "acre"],
			["squareMeter", "tsubo"],
		],
	},
	{
		id: "temperature",
		name: "温度",
		units: [
			{
				id: "celsius",
				name: "摂氏 (°C)",
				toBase: (v) => v,
				fromBase: (v) => v,
			},
			{
				id: "fahrenheit",
				name: "華氏 (°F)",
				toBase: (v) => ((v - 32) * 5) / 9,
				fromBase: (v) => (v * 9) / 5 + 32,
			},
			{
				id: "kelvin",
				name: "ケルビン (K)",
				toBase: (v) => v - 273.15,
				fromBase: (v) => v + 273.15,
			},
		],
		commonConversions: [
			["celsius", "fahrenheit"],
			["celsius", "kelvin"],
		],
	},
	{
		id: "time",
		name: "時間",
		units: [
			{
				id: "second",
				name: "秒 (s)",
				toBase: (v) => v,
				fromBase: (v) => v,
			},
			{
				id: "minute",
				name: "分 (min)",
				toBase: (v) => v * 60,
				fromBase: (v) => v / 60,
			},
			{
				id: "hour",
				name: "時間 (h)",
				toBase: (v) => v * 3600,
				fromBase: (v) => v / 3600,
			},
			{
				id: "day",
				name: "日 (d)",
				toBase: (v) => v * 86400,
				fromBase: (v) => v / 86400,
			},
			{
				id: "week",
				name: "週",
				toBase: (v) => v * 604800,
				fromBase: (v) => v / 604800,
			},
			{
				id: "month",
				name: "月 (平均)",
				toBase: (v) => v * 2629800,
				fromBase: (v) => v / 2629800,
			},
			{
				id: "year",
				name: "年 (365日)",
				toBase: (v) => v * 31536000,
				fromBase: (v) => v / 31536000,
			},
		],
		commonConversions: [
			["minute", "second"],
			["hour", "minute"],
			["day", "hour"],
		],
	},
	{
		id: "speed",
		name: "速度",
		units: [
			{
				id: "meterPerSecond",
				name: "メートル毎秒 (m/s)",
				toBase: (v) => v,
				fromBase: (v) => v,
			},
			{
				id: "kilometerPerHour",
				name: "キロメートル毎時 (km/h)",
				toBase: (v) => v / 3.6,
				fromBase: (v) => v * 3.6,
			},
			{
				id: "milePerHour",
				name: "マイル毎時 (mph)",
				toBase: (v) => v * 0.44704,
				fromBase: (v) => v / 0.44704,
			},
			{
				id: "knot",
				name: "ノット (knot)",
				toBase: (v) => v * 0.514444,
				fromBase: (v) => v / 0.514444,
			},
			{
				id: "footPerSecond",
				name: "フィート毎秒 (ft/s)",
				toBase: (v) => v * 0.3048,
				fromBase: (v) => v / 0.3048,
			},
		],
		commonConversions: [
			["kilometerPerHour", "milePerHour"],
			["meterPerSecond", "kilometerPerHour"],
			["kilometerPerHour", "knot"],
		],
	},
	{
		id: "data",
		name: "データ容量",
		units: [
			{
				id: "byte",
				name: "バイト (B)",
				toBase: (v) => v,
				fromBase: (v) => v,
			},
			{
				id: "kilobyte",
				name: "キロバイト (KB)",
				toBase: (v) => v * 1024,
				fromBase: (v) => v / 1024,
			},
			{
				id: "megabyte",
				name: "メガバイト (MB)",
				toBase: (v) => v * 1048576,
				fromBase: (v) => v / 1048576,
			},
			{
				id: "gigabyte",
				name: "ギガバイト (GB)",
				toBase: (v) => v * 1073741824,
				fromBase: (v) => v / 1073741824,
			},
			{
				id: "terabyte",
				name: "テラバイト (TB)",
				toBase: (v) => v * 1099511627776,
				fromBase: (v) => v / 1099511627776,
			},
			{
				id: "bit",
				name: "ビット (bit)",
				toBase: (v) => v / 8,
				fromBase: (v) => v * 8,
			},
			{
				id: "kibibyte",
				name: "キビバイト (KiB)",
				toBase: (v) => v * 1024,
				fromBase: (v) => v / 1024,
			},
			{
				id: "mebibyte",
				name: "メビバイト (MiB)",
				toBase: (v) => v * 1048576,
				fromBase: (v) => v / 1048576,
			},
		],
		commonConversions: [
			["megabyte", "mebibyte"],
			["byte", "bit"],
			["gigabyte", "megabyte"],
		],
	},
	{
		id: "fuel",
		name: "燃費",
		units: [
			{
				id: "kmPerLiter",
				name: "km/L",
				toBase: (v) => v,
				fromBase: (v) => v,
			},
			{
				id: "milesPerGallon",
				name: "マイル/ガロン (US)",
				toBase: (v) => v * 0.425144,
				fromBase: (v) => v / 0.425144,
			},
			{
				id: "milesPerGallonImp",
				name: "マイル/ガロン (UK)",
				toBase: (v) => v * 0.354006,
				fromBase: (v) => v / 0.354006,
			},
			{
				id: "literPer100km",
				name: "L/100km",
				toBase: (v) => 100 / v,
				fromBase: (v) => 100 / v,
			},
		],
		commonConversions: [
			["kmPerLiter", "milesPerGallon"],
			["kmPerLiter", "literPer100km"],
		],
	},
];
