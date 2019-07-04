import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { ViewCoreService } from '../view/view-core.service';
import { ColumnView } from 'ng2-qgrid/core/scene/view/column.view';
import { EventListener } from 'ng2-qgrid/core/infrastructure/event.listener';
import { EventManager } from 'ng2-qgrid/core/infrastructure/event.manager';
import { HeadCtrl } from 'ng2-qgrid/core/head/head.ctrl';
import { RootService } from '../../../infrastructure/component/root.service';
import { NgComponent } from '../../../infrastructure/component/ng.component';
import { TableCoreComponent } from '../table/table-core.component';

@Component({
	// tslint:disable-next-line
	selector: 'thead[q-grid-core-head]',
	templateUrl: './head-core.component.html'
})
export class HeadCoreComponent extends NgComponent implements OnInit {
	constructor(
		public $view: ViewCoreService,
		public $table: TableCoreComponent,
		private root: RootService,
		private elementRef: ElementRef,
		private zone: NgZone,
	) {
		super();
	}

	ngOnInit() {
		const { model } = this.root;

		const element = this.elementRef.nativeElement;
		const ctrl = new HeadCtrl(model, this.$view, this.root.bag);
		const listener = new EventListener(element, new EventManager(this));

		this.zone.runOutsideAngular(() => {
			this.using(listener.on('mousemove', e => ctrl.onMouseMove(e)));
			this.using(listener.on('mouseleave', e => ctrl.onMouseLeave(e)));
		});
	}

	columnId(index: number, item: ColumnView) {
		return item.model.key;
	}

	rowId(index: number) {
		return index;
	}
}
