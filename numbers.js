const N = [];
N[0] = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1]
];

N[1] = [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1]
];

N[2] = [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1]
];

N[3] = [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 1],
    [0, 0, 1],
    [1, 1, 1]
];

N[4] = [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1]
];

N[5] = [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1]
];

N[6] = [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
];

N[7] = [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1]
];

N[8] = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
];

N[9] = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1]
];

function drawNumber(number, x, y, width, height, colour, alpha) {
    const digits = number.toString(10).split("").map(function (t) { return parseInt(t) });
    const len = digits.length;
    const bw = Math.floor(width / (len * 3 + len - 1));
    const bh = Math.floor(height / 5);

    drawBatchStart();
    for (let i = 0; i < len; i++) {
        for (let xx = 0; xx < 3; xx++) {
            for (let yy = 0; yy < 5; yy++) {
                if (N[digits[i]][yy][xx] == 1) {
                    drawRectangle(Math.floor(x + xx * bw + i * 4 * bw), Math.floor(y + yy * bh), bw, bh, colour, alpha);
                }
            }
        }
    }
    drawBatchEnd();
}