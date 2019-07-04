import { Component } from '@angular/core';
import { ViewCoreService } from '../view/view-core.service';
import { ColumnView } from 'ng2-qgrid/core/scene/view/column.view';
import { NgComponent } from '../../../infrastructure/component/ng.component';
import { TableCoreComponent } from '../table/table-core.component';

@Component({
	// tslint:disable-next-line
	selector: 'tfoot[q-grid-core-foot]',
	templateUrl: './foot-core.component.html'
})
export class FootCoreComponent extends NgComponent {
	constructor(
		public $view: ViewCoreService,
		public $table: TableCoreComponent,
	) {
		super();
	}

	columnId(index: number, item: ColumnView) {
		return item.model.key;
	}

	rowId(index: number) {
		return index;
	}
}
