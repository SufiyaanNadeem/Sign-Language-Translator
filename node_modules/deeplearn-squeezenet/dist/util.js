"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function topK(values, k) {
    var valuesAndIndices = [];
    for (var i = 0; i < values.length; i++) {
        valuesAndIndices.push({ value: values[i], index: i });
    }
    valuesAndIndices.sort(function (a, b) {
        return b.value - a.value;
    });
    var topkValues = new Float32Array(k);
    var topkIndices = new Int32Array(k);
    for (var i = 0; i < k; i++) {
        topkValues[i] = valuesAndIndices[i].value;
        topkIndices[i] = valuesAndIndices[i].index;
    }
    return { values: topkValues, indices: topkIndices };
}
exports.topK = topK;
