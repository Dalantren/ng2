export declare class UnitFactory {
	constructor(rowStart: number, columnStart: number);

	cell(element: any, rowIndex: number, columnIndex: number): { element: any, rowIndex: number, columnIndex: number };
	row(element: any, rowIndex: number): { element: any, index: number };
}
