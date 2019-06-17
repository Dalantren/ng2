import { Directive, Input, OnDestroy, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Command } from 'ng2-qgrid/core/command/command';
import { CommandManager } from 'ng2-qgrid/core/command/command.manager';
import { Shortcut } from 'ng2-qgrid/core/shortcut/shortcut';
import { ShortcutDispatcher } from 'ng2-qgrid/core/shortcut/shortcut.dispatcher';


@Directive({
	selector: '[qGridCommand]'
})
export class CommandDirective implements OnInit, OnDestroy {
	private shortcut = new Shortcut(new ShortcutDispatcher());
	private shortcutOff: () => void;

	@Input('qGridCommand') command: Command;
	@Input('qGridCommandContext') commandContext: any;
	@Output('qGridCommandExecute') execute = new EventEmitter();

	constructor() {
	}

	ngOnInit() {
		const command = this.command;
		if (command && command.shortcut) {
			const manager = new CommandManager(f => {
				f();
				this.execute.emit();
			}, this.commandContext);

			this.shortcutOff = this.shortcut.register(manager, [command]);
		}
	}

	@HostListener('document:keydown', ['$event'])
	onKeyDown(e: KeyboardEvent) {
		if (this.shortcutOff) {
			this.shortcut.keyDown(e, 'command');
		}
	}

	ngOnDestroy() {
		if (this.shortcutOff) {
			this.shortcutOff();
			this.shortcutOff = null;
		}
	}
}
