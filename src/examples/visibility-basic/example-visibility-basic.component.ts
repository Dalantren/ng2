import { Component, ChangeDetectionStrategy, AfterViewInit, ViewChild } from '@angular/core';
import { DataService, Atom } from '../data.service';
import { Observable } from 'rxjs';
import { GridComponent } from 'ng2-qgrid';

@Component({
	selector: 'example-visibility-basic',
	templateUrl: 'example-visibility-basic.component.html',
	styleUrls: ['example-visibility-basic.component.scss'],
	providers: [DataService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleVisibilityBasicComponent implements AfterViewInit {
	@ViewChild(GridComponent) grid: GridComponent;

	rows: Observable<Atom[]>;

	constructor(dataService: DataService) {
		this.rows = dataService.getAtoms();
	}

	ngAfterViewInit() {
		const { model } = this.grid;

		model.visibility({
			foot: false,
			head: false,
			toolbar: {
				bottom: false,
				left: false,
				right: false,
				top: false
			},
		});
	}
}
