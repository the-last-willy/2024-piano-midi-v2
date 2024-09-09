import {key, status, velocity} from './midi.mjs';

export class Note {
    constructor() {
        this.timePressed = null;
        this.timeReleased = null;

        this.midiKey = null;

        this.velocityPressed = null;
        this.velocityReleased = null;
    }

    get duration() {
        return this.timeReleased - this.timePressed;
    }
}

export class Recorder {
    constructor() {
        this.eventtarget = new EventTarget();

        this.finishedNotes = [];
        this.ongoingNotes = new Map();

        this.timesource = null;
    }

    static fromOptions(...options) {
        let rec = new Recorder();
        for(let opt of options)
            opt(rec);
        if(rec.timesource === null)
            throw new Error("time source not set");
        return rec;
    }

    static withTimeSource(timeSource) {
        return rec => {
            rec.timesource = timeSource;
        };
    }

    processMidiEv(ev) {
        if(status(ev) === NoteOnEv.status)
            this.processNoteOnMidiEv(ev);
        else if(status(ev) === NoteOffEv.status)
            this.processNoteOffMidiEv(ev);
    }

    processNoteOnMidiEv(ev) {
        let n = new Note();

        this.ongoingNotes.set(key(ev), n);

        n.midiKey = key(ev);

        n.timePressed = this.timesource();
        n.velocityPressed = velocity(ev);
    }

    processNoteOffMidiEv(ev) {
        let n = this.ongoingNotes.get(key(ev));

        this.ongoingNotes.delete(key(ev));
        this.finishedNotes.push(n);

        n.timeReleased = this.timesource();
        n.velocityReleased = velocity(ev);
    }

    // Events

    addOnNotePressed(cb) {

    }

    addOnNoteReleased(cb) {

    }
}