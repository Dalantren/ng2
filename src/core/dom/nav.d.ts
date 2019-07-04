export declare class Location {
	row: number;
	column: number;
}
export declare class Nav {
	current(): Location;
	left(): Location;
	right(): Location;
	next(): Location;
	previous(): Location;
	upward(): Location;
	downward(): Location;
	home(): Location;
	end(): Location;
	pageUp(): Location;
	pageDown(): Location;
}
