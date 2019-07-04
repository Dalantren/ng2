import { Range } from '../../infrastructure/range';

export class SelectorMark {
	constructor(model, markup, name) {
		this.model = model;
		this.name = name;
		this.markup = markup;
	}

	left() {
		const result = [];
		const addNext = this.addFactory(result);

		addNext('left');

		return result;
	}

	center() {
		const result = [];
		const addNext = this.addFactory(result);

		addNext(null);

		return result;
	}

	right() {
		const result = [];
		const addNext = this.addFactory(result);

		addNext('right');

		return result;
	}

	top() {
		const result = [];
		const addNext = this.addFactory(result);

		addNext('top');

		return result;
	}

	bottom() {
		const result = [];
		const addNext = this.addFactory(result);

		addNext('bottom');

		return result;
	}

	addFactory(result) {
		return pin => {
			const name = pin ? `${this.name}-${pin}` : this.name;
			const element = this.markup[name];
			if (element) {
				result.push(element);
			}

			return result;
		};
	}
}