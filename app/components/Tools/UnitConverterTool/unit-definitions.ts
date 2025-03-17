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
	// 他のカテゴリーも同様に定義...
];
