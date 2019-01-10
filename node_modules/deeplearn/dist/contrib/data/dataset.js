"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var seedrandom = require("seedrandom");
var globals_1 = require("../../globals");
var batch_dataset_1 = require("./batch_dataset");
var statistics_1 = require("./statistics");
var data_stream_1 = require("./streams/data_stream");
var data_stream_2 = require("./streams/data_stream");
var data_stream_3 = require("./streams/data_stream");
var Dataset = (function () {
    function Dataset() {
    }
    Dataset.prototype.computeStatistics = function (sampleSize, shuffleWindowSize) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, statistics_1.computeDatasetStatistics(this, sampleSize, shuffleWindowSize)];
            });
        });
    };
    Dataset.prototype.filter = function (filterer) {
        var base = this;
        return datasetFromStreamFn(function () {
            return base.getStream().filter(function (x) { return globals_1.tidy(function () { return filterer(x); }); });
        });
    };
    Dataset.prototype.map = function (transform) {
        var base = this;
        return datasetFromStreamFn(function () {
            return base.getStream().map(function (x) { return globals_1.tidy(function () { return transform(x); }); });
        });
    };
    Dataset.prototype.batch = function (batchSize, smallLastBatch) {
        if (smallLastBatch === void 0) { smallLastBatch = true; }
        return new batch_dataset_1.BatchDataset(this, batchSize, smallLastBatch);
    };
    Dataset.prototype.concatenate = function (dataset) {
        var base = this;
        return datasetFromStreamFn(function () { return base.getStream().concatenate(dataset.getStream()); });
    };
    Dataset.prototype.repeat = function (count) {
        var base = this;
        return datasetFromStreamFn(function () {
            var streamStream = data_stream_1.streamFromFunction(function () { return ({ value: base.getStream(), done: false }); });
            return data_stream_2.streamFromConcatenated(streamStream.take(count));
        });
    };
    Dataset.prototype.take = function (count) {
        var base = this;
        return datasetFromStreamFn(function () { return base.getStream().take(count); });
    };
    Dataset.prototype.skip = function (count) {
        var base = this;
        return datasetFromStreamFn(function () { return base.getStream().skip(count); });
    };
    Dataset.prototype.shuffle = function (bufferSize, seed, reshuffleEachIteration) {
        if (reshuffleEachIteration === void 0) { reshuffleEachIteration = true; }
        var base = this;
        var random = seedrandom(seed);
        return datasetFromStreamFn(function () {
            var seed2 = random.int32();
            if (reshuffleEachIteration) {
                seed2 += random.int32();
            }
            return base.getStream().shuffle(bufferSize, seed2.toString());
        });
    };
    Dataset.prototype.prefetch = function (bufferSize) {
        var base = this;
        return datasetFromStreamFn(function () { return base.getStream().prefetch(bufferSize); });
    };
    Dataset.prototype.collectAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.getStream().collectRemaining()];
            });
        });
    };
    Dataset.prototype.forEach = function (f) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.getStream().forEach(f)];
            });
        });
    };
    return Dataset;
}());
exports.Dataset = Dataset;
function datasetFromStreamFn(getStreamFn) {
    return new (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.getStream = function () {
            return getStreamFn();
        };
        return class_1;
    }(Dataset))();
}
exports.datasetFromStreamFn = datasetFromStreamFn;
function datasetFromElements(items) {
    return datasetFromStreamFn(function () { return data_stream_3.streamFromItems(items); });
}
exports.datasetFromElements = datasetFromElements;
