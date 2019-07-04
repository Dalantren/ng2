import { Component, Input } from '@angular/core';
import { VisibilityModel } from 'ng2-qgrid/core/visibility/visibility.model';
import { RootService } from '../../../infrastructure/component/root.service';
import { ViewCoreService } from '../view/view-core.service';

@Component({
	selector: 'q-grid-core-table',
	templateUrl: './table-core.component.html',
})
export class TableCoreComponent {
	@Input() pin = null;

	constructor(
		public $view: ViewCoreService,
		private root: RootService,
	) {
	}

	get visibility(): VisibilityModel {
		return this.root.model.visibility();
	}
}
