"use client";
import { useEffect, useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";

// 単位定義と変換ロジック
import { categories } from "./unit-definitions";

export default function UnitConverterTool() {
	const [selectedCategory, setSelectedCategory] = useState("length");
	const [fromUnit, setFromUnit] = useState("");
	const [toUnit, setToUnit] = useState("");
	const [inputValue, setInputValue] = useState<number>(1);
	const [outputValue, setOutputValue] = useState<number>(0);

	// カテゴリが変更されたら最初の単位をセット
	useEffect(() => {
		const category = categories.find((c) => c.id === selectedCategory);
		if (category && category.units.length >= 2) {
			setFromUnit(category.units[0].id);
			setToUnit(category.units[1].id);
		}
	}, [selectedCategory]);

	// 変換計算
	useEffect(() => {
		if (!inputValue && inputValue !== 0) return;

		const category = categories.find((c) => c.id === selectedCategory);
		if (!category) return;

		const fromUnitDef = category.units.find((u) => u.id === fromUnit);
		const toUnitDef = category.units.find((u) => u.id === toUnit);

		if (fromUnitDef && toUnitDef) {
			// 基準単位に変換してから、目標単位に変換
			const baseValue = fromUnitDef.toBase(inputValue);
			const result = toUnitDef.fromBase(baseValue);
			setOutputValue(result);
		}
	}, [selectedCategory, fromUnit, toUnit, inputValue]);

	// 単位の入れ替え
	const swapUnits = () => {
		const temp = fromUnit;
		setFromUnit(toUnit);
		setToUnit(temp);
	};

	return (
		<div>
			<div className="card">
				<div className="card-body items-center text-center">
					<h2 className="card-title">単位変換ツール</h2>
					<p className="opacity-70 max-w-2xl">
						長さ、重さ、温度など様々な単位をワンクリックで変換。簡単・正確な単位変換ツール。
					</p>
				</div>
			</div>

			<div className="card card-border mt-6">
				<div className="card-body">
					{/* カテゴリ選択 */}
					<div className="form-control">
						<label className="label" htmlFor="category">
							<span className="label-text">カテゴリー</span>
						</label>
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="select select-bordered w-full"
							id="category"
						>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-[1fr_100px_1fr] gap-4 mt-4 relative">
						{/* 変換元単位 */}
						<div className="form-control">
							<label className="label" htmlFor="fromUnit">
								<span className="label-text">変換元</span>
							</label>
							<select
								value={fromUnit}
								onChange={(e) => setFromUnit(e.target.value)}
								className="select select-bordered w-full"
								id="fromUnit"
							>
								{categories
									.find((c) => c.id === selectedCategory)
									?.units.map((unit) => (
										<option key={unit.id} value={unit.id}>
											{unit.name}
										</option>
									))}
							</select>
							<input
								type="number"
								value={inputValue}
								onChange={(e) => setInputValue(Number(e.target.value))}
								className="input input-bordered mt-2"
								min="0"
								step="any"
							/>
						</div>

						{/* 入れ替えボタン */}
						<div className="justify-center items-center flex-col flex">
							<button
								className="btn btn-circle btn-sm flex justify-center items-center"
								onClick={swapUnits}
								type="button"
							>
								<FaExchangeAlt />
							</button>
							入れ替え
						</div>

						{/* 変換先単位 */}
						<div className="form-control">
							<label className="label" htmlFor="toUnit">
								<span className="label-text">変換先</span>
							</label>
							<select
								value={toUnit}
								onChange={(e) => setToUnit(e.target.value)}
								className="select select-bordered w-full"
								id="toUnit"
							>
								{categories
									.find((c) => c.id === selectedCategory)
									?.units.map((unit) => (
										<option key={unit.id} value={unit.id}>
											{unit.name}
										</option>
									))}
							</select>
							<input
								type="text"
								value={formatNumber(outputValue)}
								className="input input-bordered mt-2"
								readOnly
							/>
						</div>
					</div>

					{/* 変換情報の表示 */}
					<div className="mt-6 text-center text-sm opacity-70">
						<p>
							{inputValue} {getUnitName(selectedCategory, fromUnit)} ={" "}
							{formatNumber(outputValue)}{" "}
							{getUnitName(selectedCategory, toUnit)}
						</p>
					</div>
				</div>
			</div>

			{/* 一般的な変換の例 */}
			<div className="card card-border mt-6">
				<div className="card-body">
					<h3 className="font-bold text-lg mb-2">よく使われる変換</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<CommonConversion
							category={selectedCategory}
							onClick={(from, to) => {
								setFromUnit(from);
								setToUnit(to);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// 数値フォーマット関数
function formatNumber(num: number): string {
	if (Number.isNaN(num) || !Number.isFinite(num)) return "変換できません";

	// 非常に小さい値や大きい値は指数表記に
	if (Math.abs(num) < 0.000001 || Math.abs(num) > 1000000) {
		return num.toExponential(6);
	}

	// 小数点以下の桁数を適切に制限
	return num.toLocaleString(undefined, {
		maximumFractionDigits: 10,
		useGrouping: true,
	});
}

// 単位IDから名前を取得する関数
function getUnitName(categoryId: string, unitId: string): string {
	const category = categories.find((c) => c.id === categoryId);
	if (!category) return unitId;

	const unit = category.units.find((u) => u.id === unitId);
	if (!unit) return unitId;

	// 括弧を除いた単位名を返す（例：「メートル (m)」→「メートル」）
	const nameWithoutUnit = unit.name.split("(")[0].trim();
	return nameWithoutUnit;
}

// よく使われる変換のコンポーネント
function CommonConversion({
	category,
	onClick,
}: {
	category: string;
	onClick: (from: string, to: string) => void;
}) {
	const currentCategory = categories.find((c) => c.id === category);

	if (
		!currentCategory ||
		!currentCategory.commonConversions ||
		currentCategory.commonConversions.length === 0
	) {
		return (
			<div className="text-center text-sm opacity-70">
				このカテゴリーのよく使われる変換はありません
			</div>
		);
	}

	return (
		<>
			{currentCategory.commonConversions.map(([from, to], index) => {
				const fromUnit = currentCategory.units.find((u) => u.id === from);
				const toUnit = currentCategory.units.find((u) => u.id === to);

				if (!fromUnit || !toUnit) return null;

				return (
					<button
						key={from + to}
						onClick={() => onClick(from, to)}
						className="btn btn-outline btn-sm"
						type="button"
					>
						{fromUnit.name.split("(")[0].trim()} から{" "}
						{toUnit.name.split("(")[0].trim()}
					</button>
				);
			})}
		</>
	);
}
