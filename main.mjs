import midi from "./midi.mjs"
import * as solfege from "./solfege/dist/index.js";

navigator.requestMIDIAccess().then((access) => {
    // Get lists of available MIDI controllers
    const inputs = access.inputs.values();

    let last = undefined;
    for (let i of inputs)
        last = i;

    last.onmidimessage = process;
});

function process(ev) {
    console.log(`${midi.typeName(ev.data)} ${midi.noteName(ev.data)}${midi.octave(ev.data)}`);

    let con = document.getElementById('next');
    if(midi.noteName(ev.data) === con.innerHTML) {
        con.innerHTML = midi.next(midi.noteName(ev.data));
    }
}

document.addEventListener("DOMContentLoaded", (event) => {

});