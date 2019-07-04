import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Tr } from 'ng2-qgrid/core/dom/tr';
import { ViewCoreService } from '../view/view-core.service';
import { RootService } from '../../../infrastructure/component/root.service';
import { BodyCoreComponent } from '../body/body-core.component';

@Directive({
	selector: '[q-grid-core-tr]'
})
export class TrCoreDirective implements Tr, OnInit, OnDestroy {
	@Input('q-grid-core-index') viewIndex: number;
	@Input('q-grid-core-tr') model: any;
	@Input('q-grid-core-source') source: string;

	element: HTMLElement;

	constructor(
		public $view: ViewCoreService,
		private $body: BodyCoreComponent,
		private root: RootService,
		elementRef: ElementRef
	) {
		this.element = elementRef.nativeElement;
	}

	get index() {
		return this.root.table.body.materialize(this.$body.pin, this.viewIndex);
	}

	ngOnInit() {
		this.root.bag[this.source].addRow(this);
	}

	ngOnDestroy() {
		this.root.bag[this.source].deleteRow(this);
	}
}
