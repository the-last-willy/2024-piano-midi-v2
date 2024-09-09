class KeyState {
    constructor() {
        this.startT = null;
        this.endT = null;

        this.velocity = null;
    }
}

class KeyVisualizer {
    constructor() {
        this.timesource = null;
    }

    initialize(parent) {
        this.html = document.createElement('canvas');
        parent.append(this.html);
        this.html.style.position = 'absolute';
        this.html.style.top = '0';

        this.canvas = this.html;
        this.canvas.width = parent.offsetWidth;
        this.canvas.height = 900;

        this.ctx = this.canvas.getContext('2d');

        this.timeWindow = 10 * 1000;
        this.startTime = this.timesource();

        this.redraw();
    }

    press() {
        this.redraw();
    }

    release() {
        this.redraw();
    }

    redraw() {
        this.keyStates = Array.from({length: 88}, () => []);

        for(let n of this.recorder.finishedNotes) {
            let ks = new KeyState();
            ks.startT = n.timePressed;
            ks.endT = n.timeReleased;
            ks.velocity = n.velocityPressed;
            this.keyStates[n.midiKey - 21].push(ks);
        }

        for(let n of this.recorder.ongoingNotes.values()) {
            let ks = new KeyState();
            ks.startT = n.timePressed;
            ks.velocity = n.velocityPressed;
            this.keyStates[n.midiKey - 21].push(ks);
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let layout = new KeyboardLayout();

        let w = this.canvas.width / layout.whiteKeyCount();

        // white key lines
        for (let i = 0; i < layout.whiteKeyCount(); ++i) {
            let x = i * w;

            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);

            this.ctx.strokeWidth = 1;
            this.ctx.strokeStyle = 'lightgrey';
            this.ctx.stroke();
        }

        // octave lines
        for (let i = 0; i < layout.octaveCount() - 1; ++i) {
            let x = 2 * w + i * 7 * w;

            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);

            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'grey';
            this.ctx.stroke();
        }

        // white keys
        for (let i = 0; i < layout.whiteKeyCount(); ++i) {
            let k = layout.midiKeyFromWhiteKeyIdx(i);
            let x0 = i * w;

            for (let ks of this.keyStates[k]) {
                let {startT, endT} = ks;

                if (endT === null)
                    endT = this.timesource() - this.startTime;

                let y0 = this.canvas.height - ((this.timesource() - this.startTime) - startT) / 10_000 * this.canvas.height;
                let y1 = this.canvas.height - ((this.timesource() - this.startTime) - endT) / 10_000 * this.canvas.height;

                // this.ctx.fillStyle = 'grey';
                this.ctx.fillStyle = `rgb(${255 * ks.velocity} ${0} ${255 - 255 * ks.velocity})`;
                this.ctx.fillRect(x0, y0, w, y1 - y0);
            }
        }

        // black keys
        for (let i = 0; i < layout.blackKeyCount(); ++i) {
            let o = layout.octaveFromBlackKeyIdx(i);
            let k = layout.midiKeyFromBlackKeyIdx(i);
            let x0 = o * 7 * w + [0, 2, 3, 5, 6][i % 5] * w + 3 * w / 4;

            for (let ks of this.keyStates[k]) {
                let {startT, endT} = ks;

                if (endT === null)
                    endT = this.timesource() - this.startTime;

                let y0 = this.canvas.height - ((this.timesource() - this.startTime) - startT) / 10_000 * this.canvas.height;
                let y1 = this.canvas.height - ((this.timesource() - this.startTime) - endT) / 10_000 * this.canvas.height;

                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x0, y0, w / 2, y1 - y0);

                // this.ctx.fillStyle = 'dimgray';
                this.ctx.fillStyle = `rgb(${255 * ks.velocity} ${0} ${255 - 255 * ks.velocity})`;
                this.ctx.fillRect(x0, y0, w / 2, y1 - y0);
            }
        }

        // time lines
        for (let i = 0; i < 10; ++i) {
            let x0 = 0;
            let x1 = this.canvas.width;

            let y0 = this.canvas.height - ((this.timesource() - this.startTime) % 1000 + i * 1000) / 10_000 * this.canvas.height;

            this.ctx.beginPath();
            this.ctx.moveTo(x0, y0);
            this.ctx.lineTo(x1, y0);

            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = 'lightgrey';
            this.ctx.stroke();
        }
    }
}