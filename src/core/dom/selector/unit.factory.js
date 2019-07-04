export class UnitFactory {
	constructor(rowStart, columnStart) {
		this.rowStart;
		this.columnStart;
	}

	cell(element, rowIndex, columnIndex) {
		return {
			element,
			rowIndex: rowIndex + this.rowStart,
			columnIndex: columnIndex + this.columnStart
		};
	}

	row(element, rowIndex) {
		return {
			element,
			index: rowIndex + this.rowStart
		};
	}
}