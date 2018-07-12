import { PathService } from '../path/path.service';
import { Log } from '../infrastructure/log';
import { Command } from '../command/command';
import * as columnService from '../column/column.service';
import { FilterRowColumn } from '../column-type/filter.row.column';
import { clone, isUndefined } from '../utility/kit';
import { GRID_PREFIX } from '../definition';
import { copy, find } from '../node/node.service';

export class HeadView {
	constructor(model, table, tagName) {
		this.model = model;
		this.table = table;
		this.tagName = tagName;
		this.rows = [];

		const pathFinder = new PathService(table.context.bag.head);

		this.drop = new Command({
			source: 'head.view',
			canExecute: e => {
				if (e.action === 'end') {
					return true;
				}

				const cell = pathFinder.cell(e.path);
				return cell && cell.column.canMove;
			},
			execute: e => {
				const sourceKey = e.dragData;
				switch (e.action) {
					case 'over': {
						const th = pathFinder.cell(e.path);
						if (!e.inAreaX(th.element)) {
							return;
						}

						const targetKey = th.column.key;
						if (sourceKey !== targetKey) {
							const { columnList } = model;
							const index = copy(columnList().index);

							const oldPos = find(index, node => node.key.model.key === sourceKey);
							const newPos = find(index, node => node.key.model.key === targetKey);
							if (oldPos && newPos) {
								const { path } = oldPos;
								const hostIndex = path.reverse().findIndex(node => node.children.length > 1);
								if (hostIndex < 0) {
									return;
								}

								const parent = path[hostIndex];
								const node = path[hostIndex + 1] || oldPos.node;
								const index = parent.children.indexOf(node);
								const spring = { parent, index, node };

								console.log('---------------------------------');
								console.log(`source: ${oldPos.node.key.model.key}`);
								console.log(`actual: ${spring.node.key.model.key}`);
								console.log(`near: ${newPos.node.key.model.key}`);

								spring.parent.children.splice(spring.index, 1);
								newPos.parent.children.splice(newPos.index, 0, spring.node);

								columnList({ index }, { source: 'head.view' });
							}
						}
						break;
					}
					case 'end':
					case 'drop': {
						const { index } = model.columnList();
						const oldPos = find(index, node => node.key.model.key === sourceKey);
						if (oldPos) {
							const oldColumn = table.body.column(oldPos.node.key.columnIndex);
							oldColumn.removeClass(`${GRID_PREFIX}-drag`);
						}
						break;
					}
				}
			}
		});

		this.drag = new Command({
			source: 'head.view',
			execute: e => {
				const sourceKey = e.data;
				const { index } = model.columnList();
				const pos = find(index, node => node.key.model.key === sourceKey);
				if (pos) {
					const column = table.body.column(pos.node.key.columnIndex);
					column.addClass(`${GRID_PREFIX}-drag`);
				}
			},
			canExecute: e => {
				const sourceKey = e.data;
				const { index } = model.columnList();
				const pos = find(index, node => node.key.model.key === sourceKey);
				return pos && pos.node.key.model.canMove
			}
		});

		this.resize = new Command({
			source: 'head.view',
			canExecute: e => {
				const key = e.data;
				const map = table.data.columnMap();
				return map.hasOwnProperty(key) && map[key].canResize !== false;
			}
		});

		this.filter = new Command({
			source: 'head.view',
			canExecute: () => true,
			execute: (column, search) => {
				const filter = this.model.filter;
				const by = clone(filter().by);
				const key = column.key;
				if (!isUndefined(search) && search !== '') {
					by[key] = {
						expression: {
							kind: 'group',
							op: 'and',
							left: {
								kind: 'condition',
								left: key,
								op: 'like',
								right: search
							},
							right: null
						}
					};
				}
				else {
					delete by[key];
				}

				filter({ by });
			}
		});

		model.dataChanged.watch(e => {
			if (e.hasChanges('columns')) {
				const line = columnService.flatten(e.state.columns);
				model.columnList({ line }, { source: 'head.view' });
			}
		});

		model.sceneChanged.watch(e => {
			if (e.hasChanges('column')) {
				this.invalidate();
			}
		});

		model.filterChanged.watch(e => {
			if (e.hasChanges('unit')) {
				this.invalidate();
			}
		});
	}

	columns(row, pin) {
		return row.filter(c => c.model.pin === pin);
	}

	invalidate() {
		Log.info('view.head', 'invalidate');

		const model = this.model;
		this.rows = Array.from(model.scene().column.rows);

		if (this.rows.length > 1) {
			this.table.view.addClass(`${GRID_PREFIX}-head-multi`);
		} else {
			this.table.view.removeClass(`${GRID_PREFIX}-head-multi`);
		}

		if (model.filter().unit === 'row') {
			const filterRow = this.table.data.columns().map(c => new FilterRowColumn(c));
			this.rows.push(filterRow);
		}
	}
}