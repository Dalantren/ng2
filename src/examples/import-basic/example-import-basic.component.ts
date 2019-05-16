import { AfterViewInit, Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as XLSX from 'xlsx';

import { DataService, Atom } from '../data.service';
import { GridComponent } from 'ng2-qgrid';

@Component({
	selector: 'example-import-basic',
	templateUrl: 'example-import-basic.component.html',
	styleUrls: ['example-import-basic.component.scss'],
	providers: [DataService],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleImportBasicComponent implements AfterViewInit {
	@ViewChild(GridComponent) myGrid: GridComponent;

	rows$: Observable<Atom[]> = of([]);

	ngAfterViewInit() {
		this.myGrid.model.plugin({
			imports: {
				'xlsx': XLSX
			}
		});
	}
}
