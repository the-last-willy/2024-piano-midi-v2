import * as solfege from "./solfege/dist/index.js"

export default {
    key,
    noteName,
    octave,
    status,
    typeName,
    velocity,

    next,
}

export function key(bytes) {
    return bytes[1];
}

export function noteName(bytes) {
    return ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'][key(bytes) % 12];
}

export function octave(bytes) {
    let k = key(bytes);
    return Math.floor((k - 12) / 12);
}

export function status(bytes) {
    return Math.floor(bytes[0] / 16);
}

export function typeName(bytes) {
    switch (status(bytes)) {
        case 8: return 'KeyOff';
        case 9: return 'KeyOn';
    }
}

export function velocity(bytes) {
    // Convert from [0, 127] to [0, 1].
    return bytes[2] / 127;
}

//

export function next(note) {
    let notes = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si', 'Do'];
    return notes[notes.indexOf(note) + 1];
}

console.log(solfege.majorScale(solfege.Notes.C).map(x => solfege.Notes[x]));
