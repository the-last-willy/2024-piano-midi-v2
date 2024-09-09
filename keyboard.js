class Keyboard {
    constructor() {

    }

    initialize(parent) {
        this.html = document.createElement('canvas');
        parent.append(this.html);

        this.keyStates = Array.from({length: 88}, () => false);

        let rebuild = () => {
            this.html.width = parent.offsetWidth;
            this.html.height = 80;
            this.html.style.bottom = '0';
            this.html.style.position = 'absolute';

            this.ctx = this.html.getContext('2d');

            this.redraw();
        };

        rebuild();

        new ResizeObserver(rebuild).observe(parent);
    }

    press(midiKey) {
        this.keyStates[midiKey - 21] = true;

        this.redraw();
    }

    release(midiKey) {
        this.keyStates[midiKey - 21] = false;

        this.redraw();
    }

    redraw() {
        let layout = new KeyboardLayout();

        let w = this.html.parentNode.offsetWidth / layout.whiteKeyCount();

        // white keys
        for (let i = 0; i < layout.whiteKeyCount(); ++i) {
            let o = Math.floor(i / 7);

            let k = 12 * o + [0, 2, 3, 5, 7, 8, 10][i % 7];

            let x0 = i * w;

            this.ctx.fillStyle = this.keyStates[k] ? 'grey' : 'white';
            this.ctx.fillRect(x0, 0, w, 80);

            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeRect(x0, 0, w, 80);
        }

        // black keys
        for (let i = 0; i < layout.blackKeyCount(); ++i) {
            let o = Math.floor(i / 5);

            let k = 12 * o + [1, 4, 6, 9, 11][i % 5];

            let x0 = o * 7 * w + [0, 2, 3, 5, 6][i % 5] * w + 3 * w / 4;

            this.ctx.fillStyle = this.keyStates[k] ? 'dimgray' : 'black';
            this.ctx.fillRect(x0, 0, w / 2, 50);

            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = 'black';
            this.ctx.strokeRect(x0, 0, w / 2, 50);
        }
    }
}