export interface ConversionDateRange {
	min: Date;
	max: Date;
}

export interface ConversionResult {
	amount: number;
	result: number;
	from: string;
	fromRate: number;
	to: string;
	toRate: number;
	date: Date;
}
