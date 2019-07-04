import { Command } from '../command/command';

export class Navigation {
	constructor(model, table) {
		this.model = model;
		this.table = table;
	}

	positon(y, direction) {
		const table = this.table;
		const body = table.body;
		const lastRow = this.lastRow;
		const lower = table.view.scrollHeight() - table.view.height();

		let index = 0;
		let offset = 0;

		// TODO: improve performance
		while (index <= lastRow && offset <= y) {
			offset += body.row(index).height();
			index++;
		}

		if (direction === 'down' && body.row(index)) {
			offset -= body.row(index).height();
			index--;
		}

		const row = Math.max(this.firstRow, Math.min(lastRow, index));
		offset = Math.min(offset, lower);
		return { row, offset };
	}

	goTo(rowIndex, columnIndex, source = 'navigation') {
		let cell = this.cell(rowIndex, columnIndex);
		if (!cell) {
			// TODO: make it better, right it just a huck for row-details,
			// need to support rowspan and colspan
			cell = this.cell(rowIndex, this.firstColumn);
		}

		this.model.navigation({ cell }, { source });
		return true;
	}

	columns(rowIndex) {
		const columns = this.table.body.columns(rowIndex);
		const index = [];
		for (let i = 0, length = columns.length; i < length; i++) {
			const column = columns[i];
			if (column.model().canFocus) {
				index.push(column.index);
			}
		}
		return index;
	}

	get currentColumn() {
		const columns = this.columns(this.currentRow);
		const columnIndex = this.model.navigation().columnIndex;
		const index = columns.indexOf(columnIndex);
		return columns.length ? columns[Math.max(index, 0)] : -1;
	}

	get nextColumn() {
		const columns = this.columns(this.currentRow);
		const index = columns.indexOf(this.currentColumn);
		return index >= 0 && index < columns.length - 1 ? columns[index + 1] : -1;
	}

	get prevColumn() {
		const columns = this.columns(this.currentRow);
		const index = columns.indexOf(this.currentColumn);
		return index > 0 && index < columns.length ? columns[index - 1] : -1;
	}

	get lastColumn() {
		const columns = this.columns(this.currentRow);
		const index = columns.length - 1;
		return index >= 0 ? columns[index] : -1;
	}

	get firstColumn() {
		const columns = this.columns(this.currentRow);
		return columns.length ? columns[0] : -1;
	}

	get currentRow() {
		const { rowIndex } = this.model.navigation();
		if (rowIndex < 0) {
			return this.model.scene().rows.length ? 0 : -1;
		}

		return rowIndex;
	}

	get nextRow() {
		const row = this.currentRow + 1;
		return row <= this.lastRow ? row : -1;
	}

	get prevRow() {
		const row = this.currentRow - 1;
		return row >= 0 ? row : -1;
	}

	get firstRow() {
		return Math.min(0, this.lastRow);
	}

	get lastRow() {
		return this.table.body.rowCount(this.currentColumn) - 1;
	}

	cell(rowIndex, columnIndex) {
		const cell = this.table.body.cell(rowIndex, columnIndex);
		const model = cell.model();
		if (model) {
			const { row, column } = model;
			return {
				rowIndex,
				columnIndex,
				row,
				column
			};
		}

		return null;
	}

	context(type, settings) {
		const model = this.model;
		const oldRow = this.currentRow;
		const oldColumn = this.currentColumn;
		const keyCode = model.action().shortcut.keyCode;

		return Object.assign({
			model,
			type,
			oldRow,
			oldColumn,
			keyCode
		}, settings);
	}

	get commands() {
		const { model, table } = this;
		const { edit } = model;
		const { nav } = table;
		const { go, shortcut } = model.navigation();

		const createCommand = where =>
			new Command({
				source: 'navigation',
				shortcut: shortcut[where],
				canExecute: () => {
					if (edit().state === 'view') {
						return true;
					}

					const { column: currentColumn } = nav.current();
					const column = table.body.column(currentColumn).model();
					if (column && (column.editorOptions.trigger === 'focus' || column.editorOptions.cruise === 'transparent')) {
						const navigate = nav[where];
						const { column: newColumn, row: newRow } = navigate();
						return newRow >= 0
							&& newColumn >= 0
							&& go.canExecute(this.context(where, { newRow, newColumn }));
					}

					return false;
				},
				execute: () => {
					const navigate = nav[where];
					const { column: newColumn, row: newRow } = navigate();
					return go.execute(this.context(where, { newRow, newColumn })) && this.goTo(newRow, newColumn);
				}
			});

		const commands = {
			goDown: createCommand('down'),
			goUp: createCommand('up'),
			goRight: createCommand('right'),
			goLeft: createCommand('left'),
			goNext: createCommand('next'),
			goPrevious: createCommand('previous'),
			home: createCommand('home'),
			end: createCommand('end'),
			upward: createCommand('upward'),
			downward: createCommand('downward'),
			pageUp: createCommand('pageUp'),
			pageDown: createCommand('pageDown'),
		};

		return new Map(Object.entries(commands));
	}
}