export function key(bytes) {
    return bytes[1];
}

export function velocity(bytes) {
    // Convert from [0, 127] to [0, 1].
    return bytes[2] / 127;
}

export function status(bytes) {
    return Math.floor(bytes[0] / 16);
}
