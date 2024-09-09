class MidiKeyOnList {
    constructor() {
        this.events = [];

        this.htmlRoot = null;
    }

    add(ev) {
        this.events.push(ev);

        let body = this.htmlRoot.querySelector('tbody');
        let row = document.createElement('tr');
        row.innerHTML =
            `<td>${(ev.time / 1000).toFixed(2)}</td>` +
            `<td>${noteName(note(ev.bytes))}</td>` +
            `<td>${velocity(ev.bytes).toFixed(2)}</td>`;
        body.append(row);

    }

    buildHtml() {
        this.htmlRoot = document.createElement('div');
        this.htmlRoot.innerHTML = '<table class="table table-sm" style="overflow: auto; height: 500px;">' +
            '<thead style="position: sticky; top: 0;">' +
            '<th scope="col">Time</th>' +
            '<th scope="col">Key</th>' +
            '<th scope="col">Velocity</th>' +
            '</thead>' +
            '<tbody>' +
            '</tbody>' +
            '</table>';

        return this.htmlRoot;
    }
}
