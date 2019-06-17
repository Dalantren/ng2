import {
	Directive,
	ContentChild,
	EventEmitter,
	Output,
	Input,
	AfterViewInit
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

@Directive({
	selector: '[qGridMenuTrigger]'
})
export class MenuTriggerDirective implements AfterViewInit {
	@ContentChild(MatMenuTrigger) trigger: MatMenuTrigger;
	@Output('qGridMenuTrigger') onClose = new EventEmitter<any>();

	constructor() {}

	ngAfterViewInit() {
		Promise.resolve(null).then(() => this.trigger.openMenu());

		this.trigger.menuClosed.subscribe(() => {
			if (this.onClose) {
				setTimeout(() => this.onClose.emit(), 10);
			}
		});
	}
}
