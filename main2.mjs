import {Histogram} from "./histogram.mjs";
import {Recorder} from "./recorder.mjs";

class TimeProvider {
    constructor() {
        this.origin = Date.now();
    }

    now() {
        return Date.now() - this.origin;
    }
}

let timeProvider = new TimeProvider();

class ChordDetector extends EventTarget {
    constructor(timeSource) {
        super();

        this.timeSource = timeSource;

        this.currentChord = [];
        this.currentTimeout = null;
    }

    process(keyon) {
        if (this.currentTimeout === null)
            this.currentTimeout = setTimeout(() => this.#dispatchChord(), 50);

        this.currentChord.push(keyon.detail);
    }

    addOnMidiEvChord(cb) {
        this.addEventListener('chord', cb);
    }

    #dispatchChord() {
        this.dispatchEvent(new CustomEvent('chord', {detail: this.currentChord}));

        this.currentChord = [];
        this.currentTimeout = null;
    }
}

class MidiMsgToEv extends EventTarget {
    static onMidiEvName = 'onmidiev';

    constructor() {
        super();
    }


    process(msg) {
        dispatchEvent(new CustomEvent(MidiMsgToEv.onMidiEvName, {detail: MidiEv.CreateNow(msg.data)}));
    }

    addOnMidiEv(cb) {
        addEventListener(MidiMsgToEv.onMidiEvName, cb);
    }
}

class KeyboardActivityTracker extends EventTarget {
    constructor() {
        super();
        this.pressedKeys = new Set();
    }

    process(ev) {
        let s = status(ev.bytes);
        if (s === NoteOffEv.status) {
            this.pressedKeys.delete(note(ev.bytes));
            if (this.pressedKeys.size === 0)
                this.dispatchActivity(false);
        } else if (s === NoteOnEv.status) {
            this.pressedKeys.add(note(ev.bytes));
            if (this.pressedKeys.size === 1)
                this.dispatchActivity(true);
        }
    }

    addOnActivity(cb) {
        this.addEventListener('activity', cb);
    }

    dispatchActivity(b) {
        this.dispatchEvent(new CustomEvent('activity', {detail: b}));
    }
}

class MidiEvSplitter extends EventTarget {
    process(ev) {
        for (let midiEv of allMidiEvs) {
            if (ev.detail.status === midiEv.status) {
                this.dispatchEvent(new CustomEvent(midiEv.name, {detail: ev.detail}));
            }
        }
    }

    addOnNoteOff(cb) {
        this.addEventListener(NoteOffEv.name, cb);
    }

    addOnNoteOn(cb) {
        this.addEventListener(NoteOnEv.name, cb);
    }
}

function midiWorkflow() {
    let source = ev => {
        msgToEv.process(ev);
        recorder.processMidiEv(ev.data);
    };

    let msgToEv = new MidiMsgToEv();
    msgToEv.addOnMidiEv(ev => keyOnList.add(ev.detail));
    msgToEv.addOnMidiEv(ev => activityTracker.process(ev.detail));

    let splitter = new MidiEvSplitter();
    msgToEv.addOnMidiEv(ev => splitter.process(ev));

    splitter.addOnNoteOn(ev => histogram.addVelocity(velocity(ev.detail.bytes)));

    splitter.addOnNoteOn(ev => keyboard.press(note(ev.detail.bytes)));
    splitter.addOnNoteOff(ev => keyboard.release(note(ev.detail.bytes)));

    splitter.addOnNoteOn(ev => keyVisualizer.press(note(ev.detail.bytes), velocity(ev.detail.bytes)));
    splitter.addOnNoteOff(ev => keyVisualizer.release(note(ev.detail.bytes)));

    let chordDectector = new ChordDetector(timeProvider);
    splitter.addOnNoteOn(ev => chordDectector.process(ev));

    return source;
}

navigator.requestMIDIAccess().then((access) => {
    // Get lists of available MIDI controllers
    const inputs = access.inputs.values();

    let last = undefined;
    for (let i of inputs)
        last = i;

    last.onmidimessage = midiWorkflow();
});

let chronometer = new Chronometer(() => Date.now());
let activityTracker = new KeyboardActivityTracker();
let keyOnList = new MidiKeyOnList();
let keyboard = new Keyboard();
let keyVisualizer = new KeyVisualizer();
let histogram = new Histogram(document.getElementById('histogram'));
let recorder = Recorder.fromOptions(
    Recorder.withTimeSource(() => chronometer.time())
);

addEventListener("DOMContentLoaded", () => {
    let timeout;
    activityTracker.addOnActivity(b => {
        if(b.detail) {
            clearTimeout(timeout);
            chronometer.start();
        } else {
            timeout = setTimeout(() => chronometer.stop(), 500);
        }
    });

    document.getElementById('container').append(keyOnList.buildHtml());

    keyVisualizer.timesource = () => chronometer.time();
    keyVisualizer.recorder = recorder;
    keyVisualizer.initialize(document.getElementById('keyboard'))
    keyboard.initialize(document.getElementById('keyboard'));

    let onanimation = () => {
        keyVisualizer.redraw();
        window.requestAnimationFrame(onanimation);
    };
    window.requestAnimationFrame(onanimation);
});
