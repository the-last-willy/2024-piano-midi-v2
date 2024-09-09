class MidiEv {
    static CreateNow(bytes) {
        return new MidiEv(bytes, Date.now());
    }

    constructor(bytes, time) {
        this.bytes = bytes;
        this.time = time;
    }

    get status() {
        return status(this.bytes);
    }
}

class NoteOffEv {
    static name = 'Note Off';
    static status = 8;
}

class NoteOnEv {
    static name = 'Note On';
    static status = 9;
}

let allMidiEvs = [
    NoteOffEv,
    NoteOnEv
];

function status(bytes) {
    return Math.floor(bytes[0] / 16);
}

function statusName(s) {
    return allMidiEvs.find(ev => ev.status === s).name;
}

function channel(bytes) {
    return bytes[0] % 16;
}

function note(bytes) {
    return bytes[1];
}

class MidiKeyTranslator {
    toStr(k) {
        let octave = Math.floor((k - 60) / 12) + 4;
        let names = ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
        return `${names[k % 12]} ${octave}`;
    }
}

function noteName(key) {
    return new MidiKeyTranslator().toStr(key);
}

function velocity(bytes) {
    return bytes[2] / 127;
}
