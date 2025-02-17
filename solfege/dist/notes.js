export class Note {
    constructor() {
        this.semitones = 0;
    }
    static middleC() {
        return new Note();
    }
    octave() {
        return 4 + Math.floor(this.semitones / 12);
    }
    toString() {
        return ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'][this.semitones % 12] + this.octave();
    }
}
