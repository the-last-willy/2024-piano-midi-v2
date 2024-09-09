class KeyboardLayout {
    whiteKeyCount() {
        return 52;
    }

    blackKeyCount() {
        return 36;
    }

    octaveCount() {
        return 9;
    }

    whiteKeyPerOctave(i) {
        return [2, 7, 7, 7, 7, 7, 7, 7, 1][i];
    }

    cumulatativeWhiteKeyBeforeOctave(i) {
        return [0, 2, 9, 16, 23, 30, 37, 44, 51, 52][i];
    }

    octaveFromBlackKeyIdx(i) {
        return Math.floor(i / 5);
    }

    midiKeyFromWhiteKeyIdx(i) {
        let o = Math.floor(i / 7);
        let k = 12 * o + [0, 2, 3, 5, 7, 8, 10][i % 7];
        return k;
    }

    midiKeyFromBlackKeyIdx(i) {
        let o = this.octaveFromBlackKeyIdx(i);
        let k = 12 * o + [1, 4, 6, 9, 11][i % 5];
        return k;
    }

    midiKeyToIdx(mk) {
        return mk - 21;
    }
}