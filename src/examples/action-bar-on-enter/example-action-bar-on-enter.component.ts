import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DataService, Atom } from '../data.service';
import { Observable } from 'rxjs';
import { GridModel, Action, GridService, Command, Grid } from 'ng2-qgrid';

@Component({
	selector: 'example-action-bar-on-enter',
	templateUrl: 'example-action-bar-on-enter.component.html',
	styleUrls: ['example-action-bar-on-enter.component.scss'],
	providers: [DataService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleActionBarOnEnterComponent {
	rows$: Observable<Atom[]>;
	gridModel: GridModel;
	gridService: GridService;

	rowOptions = {
		trigger: 'focus',
		actions: [
			new Action(new Command(), 'Hello'),
			new Action(new Command(), 'World')
		]
	};

	pickCommand = new Command({
		execute: () => {
			const { rowIndex, columnIndex } = this.gridModel.navigation();
			const { columns } = this.gridModel.view();

			const newColumnIndex = columns.findIndex(c => c.key === 'rowOptions');

			this.gridService.focus(rowIndex, newColumnIndex);

			// Comment this out if don't need to revert focus back after action
			this.gridModel.editChanged.watch((e, off) => {
				if (e.hasChanges('state') && e.state.state === 'view') {
					this.gridService.focus(rowIndex, columnIndex);
					off();
				}
			});
		},
		canExecute: () => {
			const { items } = this.gridModel.selection();
			return items.length > 0;
		},
		shortcut: 'enter'
	});

	constructor(dataService: DataService, grid: Grid) {
		this.rows$ = dataService.getAtoms();
		this.gridModel = grid.model();
		this.gridService = grid.service(this.gridModel);

		this.gridModel.navigationChanged.watch(e => {
			if (e.hasChanges('cell') && e.state.cell) {
				this.gridModel.selection({
					items: [e.state.row]
				});
			}
		});
	}
}
