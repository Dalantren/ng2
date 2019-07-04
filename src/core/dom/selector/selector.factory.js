import { Matrix } from './matrix';
import { Selector } from './selector';
import { UnitFactory } from './unit.factory';

export class SelectorFactory {
	constructor(bag, selectorMark) {
		this.bag = bag;
		this.selectorMark = selectorMark;
	}

	create() {
		const { bag, selectorMark } = this;
		const markup = new Matrix(tr => bag.elements.has(tr));

		const layout = {
			top: 0,
			bottom: 0,
		};

		const mx_LCR =
			selectorMark.left()
				.concat(selectorMark.center())
				.concat(selectorMark.right())
				.reduce((memo, element) => {
					const mx = markup.build(element);
					if (!memo.length) {
						return mx;
					}

					for (let i = 0, length = mx.length; i < length; i++) {
						memo[i].push(...mx[i]);
					}

					return memo;
				}, []);

		const mx_T_LCR = selectorMark
			.top()
			.reduce((memo, element) => {
				const mx = markup.build(element);
				layout.top = mx.length;

				if (!memo.length) {
					return mx;
				}

				let length = mx.length;
				while (length--) {
					memo.unshift(mx[length]);
				}

				return memo;
			}, mx_LCR);

		const mx_T_LCR_B = selectorMark
			.bottom()
			.reduce((memo, element) => {
				const mx = markup.build(element);
				layout.bottom = mx.length;

				if (!memo.length) {
					return mx;
				}

				for (let i = 0, length = mx.length; i < length; i++) {
					memo.push(mx[i]);
				}

				return memo;
			}, mx_T_LCR);

		const unitFactory = new UnitFactory(0, 0);

		return {
			selector: new Selector(mx_T_LCR_B, bag, unitFactory),
			layout
		};
	}
}
