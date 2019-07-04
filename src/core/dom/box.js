import { Row } from './row';
import { Column } from './column';
import { Cell } from './cell';
import { SelectorFactory } from './selector/selector.factory';

export class Box {
	constructor(context, model, selectorMark) {
		this.context = context;
		this.model = model;

		const selectFactory = new SelectorFactory(context.bag, selectorMark);
		this.invalidate(selectFactory);

		model.sceneChanged.on(e => {
			if (e.hasChanges('status')) {
				if (e.state.status === 'stop') {
					this.invalidate(selectFactory);
				}
			}
		})
	}

	invalidate(selectFactory) {
		const { selector, layout } = selectFactory.create();

		this.selector = selector;
		this.layout = layout;
	}

	materialize(pin, rowIndex) {
		const base = this.context.mapper.viewToRow(rowIndex);
		switch (pin) {
			case 'top': {
				return base;
			}
			case 'bottom': {
				return base + this.selector.rowCount() - this.layout.bottom;
			}
			default: {
				return base + this.layout.top;
			}
		}
	}

	columnCount(rowIndex) {
		return this.selector.columnCount(rowIndex);
	}

	column(columnIndex) {
		return this.createColumnCore(columnIndex);
	}

	columns(rowIndex) {
		return this.selector
			.rowCells(rowIndex)
			.map(cell => this.createColumnCore(cell.columnIndex));
	}

	row(rowIndex, columnIndex) {
		return this.rowCore(rowIndex, columnIndex);
	}

	rows(columnIndex) {
		return this.selector.rows(columnIndex).map(row => this.createRowCore(row.index, row.element));
	}

	rowCount(columnIndex) {
		return this.selector.rowCount(columnIndex);
	}

	cell(rowIndex, columnIndex) {
		return this.cellCore(rowIndex, columnIndex);
	}

	getElements() {
		return [];
	}

	rowCore(rowIndex, columnIndex) {
		return this.createRowCore(rowIndex, this.selector.row(rowIndex, columnIndex).element);
	}

	cellCore(rowIndex, columnIndex) {
		const cell = this.selector.cell(rowIndex, columnIndex);
		return this.createCellCore(cell.rowIndex, cell.columnIndex, cell.element);
	}

	rowCellsCore(rowIndex) {
		return this.selector
			.rowCells(rowIndex)
			.map(cell => this.createCellCore(cell.rowIndex, cell.columnIndex, cell.element));
	}

	columnCellsCore(columnIndex) {
		return this.selector
			.columnCells(columnIndex)
			.map(cell => this.createCellCore(cell.rowIndex, cell.columnIndex, cell.element));
	}

	createRowCore(index, element) {
		return new Row(this, index, element);
	}

	createColumnCore(index) {
		return new Column(this, index);
	}

	createCellCore(rowIndex, columnIndex, element) {
		return new Cell(this.context, rowIndex, columnIndex, element);
	}
}
