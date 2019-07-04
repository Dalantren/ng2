import { Directive, ElementRef, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { RootService } from '../../../infrastructure/component/root.service';
import { TableCoreComponent } from '../table/table-core.component';

@Directive({
	selector: '[q-grid-markup]'
})
export class MarkupDirective implements OnInit, OnDestroy {
	@Input('q-grid-markup') name = '';

	constructor(
		private root: RootService,
		private elementRef: ElementRef,
		@Optional() private table: TableCoreComponent
	) { }

	ngOnInit() {
		this.root.markup[this.getName()] = this.elementRef.nativeElement;
	}

	ngOnDestroy() {
		delete this.root.markup[this.getName()];
	}

	private getName() {
		if (this.table && this.table.pin) {
			return `${this.name}-${this.table.pin}`;
		}

		return this.name;
	}
}
