import {
	Directive,
	ElementRef,
	ContentChild,
	AfterViewInit,
	Output,
	EventEmitter,
	NgZone
} from '@angular/core';
import { MatChipInput } from '@angular/material';
import { Shortcut } from 'ng2-qgrid';
import { ChipsDirective } from './chips.directive';

@Directive({
	selector: '[qGridChipsPush]'
})
export class ChipsPushDirective implements AfterViewInit {
	@ContentChild(MatChipInput) inputComponent: MatChipInput;
	@ContentChild('qGridInput') inputElement: ElementRef;

	@Output('qGridChipsPush') push = new EventEmitter<string>();

	constructor(private zone: NgZone, private chipsDirective: ChipsDirective) { }

	ngAfterViewInit() {
		this.inputComponent.chipEnd.subscribe(e => {
			// we need to override it to prevent default behavior
		});

		const input = this.inputElement.nativeElement;
		this.zone.runOutsideAngular(() =>
			input.addEventListener('keydown', e => {
				const code = Shortcut.translate(e);
				if (code === 'enter') {
					const value = (input.value || '').trim() as string;
					if (value) {
						this.push.emit(value);

						input.value = '';
						e.stopPropagation();

						this.chipsDirective.tick();
					}
				}
			})
		);
	}
}
