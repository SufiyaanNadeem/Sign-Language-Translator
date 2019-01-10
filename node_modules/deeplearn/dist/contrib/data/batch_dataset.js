"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../../globals");
var tensor_1 = require("../../tensor");
var util = require("../../util");
var BatchDataset = (function () {
    function BatchDataset(base, batchSize, smallLastBatch) {
        if (smallLastBatch === void 0) { smallLastBatch = true; }
        this.base = base;
        this.batchSize = batchSize;
        this.smallLastBatch = smallLastBatch;
    }
    BatchDataset.prototype.getStream = function () {
        return __awaiter(this, void 0, void 0, function () {
            var batchesAsArrays;
            return __generator(this, function (_a) {
                batchesAsArrays = this.base.getStream().batch(this.batchSize, this.smallLastBatch);
                return [2, batchesAsArrays.map(makeDatasetBatch)];
            });
        });
    };
    return BatchDataset;
}());
exports.BatchDataset = BatchDataset;
function makeDatasetBatch(elements) {
    var rotated = {};
    var firstElement = elements[0];
    var keys = Object.keys(firstElement);
    keys.forEach(function (key) {
        rotated[key] = [];
    });
    var _loop_1 = function (e) {
        keys.forEach(function (key) {
            var value = e[key];
            rotated[key].push(value);
        });
    };
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var e = elements_1[_i];
        _loop_1(e);
    }
    var result = {};
    keys.forEach(function (key) {
        if (rotated[key].length !== elements.length) {
            throw new Error("Batching failed to get a '" + key + "' value for each element.");
        }
        if (typeof rotated[key][0] === 'string') {
            result[key] = rotated[key];
        }
        else {
            result[key] = batchConcat(rotated[key]);
        }
    });
    elements.forEach(globals_1.dispose);
    return result;
}
function batchConcat(arrays) {
    var elementShape = shapeAndValues(arrays[0])[0];
    var batchShape = [arrays.length].concat(elementShape);
    var resultVals = new Float32Array(batchShape.reduce(function (x, y) { return x * y; }));
    var offset = 0;
    for (var _i = 0, arrays_1 = arrays; _i < arrays_1.length; _i++) {
        var a = arrays_1[_i];
        var _a = shapeAndValues(a), aShape = _a[0], aVals = _a[1];
        if (!util.arraysEqual(aShape, elementShape)) {
            throw new Error('Elements must have the same shape to be batched');
        }
        resultVals.set(aVals, offset);
        offset += aVals.length;
    }
    var result = tensor_1.Tensor.make(batchShape, { values: resultVals });
    return result;
}
function shapeAndValues(array) {
    if (array instanceof tensor_1.Tensor) {
        return [array.shape, array.dataSync()];
    }
    else if (Array.isArray(array)) {
        return [[array.length], array];
    }
    else {
        return [[], [array]];
    }
}
