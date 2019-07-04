import { Model } from '../../infrastructure/model';

export declare class SelectorMark {
	constructor(model: Model, markup: { [key: string]: HTMLElement }, name: string);

	left(): HTMLElement[];
	center(): HTMLElement[];
	right(): HTMLElement[];
}
