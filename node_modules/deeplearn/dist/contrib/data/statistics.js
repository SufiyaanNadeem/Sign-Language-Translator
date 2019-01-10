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
var tensor_1 = require("../../tensor");
function scaleTo01(min, max) {
    var range = max - min;
    var minTensor = tensor_1.Scalar.new(min);
    var rangeTensor = tensor_1.Scalar.new(range);
    return function (value) {
        if (typeof (value) === 'string') {
            throw new Error('Can\'t scale a string.');
        }
        else {
            if (value instanceof tensor_1.Tensor) {
                var result = value.sub(minTensor).div(rangeTensor);
                return result;
            }
            else if (value instanceof Array) {
                return value.map(function (v) { return (v - min) / range; });
            }
            else {
                return (value - min) / range;
            }
        }
    };
}
exports.scaleTo01 = scaleTo01;
function computeDatasetStatistics(dataset, sampleSize, shuffleWindowSize) {
    return __awaiter(this, void 0, void 0, function () {
        var sampleDataset, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sampleDataset = dataset;
                    if (shuffleWindowSize != null) {
                        sampleDataset = sampleDataset.shuffle(shuffleWindowSize);
                    }
                    if (sampleSize != null) {
                        sampleDataset = sampleDataset.take(sampleSize);
                    }
                    result = {};
                    return [4, sampleDataset.forEach(function (e) {
                            for (var key in e) {
                                var value = e[key];
                                if (typeof (value) === 'string') {
                                }
                                else {
                                    var recordMin = void 0;
                                    var recordMax = void 0;
                                    if (value instanceof tensor_1.Tensor) {
                                        recordMin = value.min().dataSync()[0];
                                        recordMax = value.max().dataSync()[0];
                                    }
                                    else if (value instanceof Array) {
                                        recordMin = value.reduce(function (a, b) { return Math.min(a, b); });
                                        recordMax = value.reduce(function (a, b) { return Math.max(a, b); });
                                    }
                                    else if (!isNaN(value) && isFinite(value)) {
                                        recordMin = value;
                                        recordMax = value;
                                    }
                                    else {
                                        throw new Error("Cannot compute statistics: " + key + " = " + value);
                                    }
                                    var columnStats = result[key];
                                    if (columnStats == null) {
                                        columnStats = {
                                            min: Number.POSITIVE_INFINITY,
                                            max: Number.NEGATIVE_INFINITY
                                        };
                                        result[key] = columnStats;
                                    }
                                    columnStats.min = Math.min(columnStats.min, recordMin);
                                    columnStats.max = Math.max(columnStats.max, recordMax);
                                }
                            }
                        })];
                case 1:
                    _a.sent();
                    return [2, result];
            }
        });
    });
}
exports.computeDatasetStatistics = computeDatasetStatistics;
