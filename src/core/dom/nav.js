export class Nav {
    constructor(model, body) {
        this.model = model;
        this.body = body;
    }

    current() {
        const { rowIndex, columnIndex } = this.model.navigation();
        return { row: rowIndex, column: columnIndex }
    }

    left() {

    }

    right() {

    }

    next() { }
    previous() { }
    upward() { }
    downward() { }
    home() { }
    end() { }
    pageUp() { }
    pageDown() { }
}