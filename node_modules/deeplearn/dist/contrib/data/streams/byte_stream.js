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
var utf8 = require("utf8");
var data_stream_1 = require("./data_stream");
var string_stream_1 = require("./string_stream");
var ByteStream = (function (_super) {
    __extends(ByteStream, _super);
    function ByteStream() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ByteStream.prototype.decodeUTF8 = function () {
        return new Utf8Stream(this);
    };
    return ByteStream;
}(data_stream_1.DataStream));
exports.ByteStream = ByteStream;
var Utf8Stream = (function (_super) {
    __extends(Utf8Stream, _super);
    function Utf8Stream(upstream) {
        var _this = _super.call(this) || this;
        _this.impl = new Utf8StreamImpl(upstream);
        return _this;
    }
    Utf8Stream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.impl.next()];
            });
        });
    };
    return Utf8Stream;
}(string_stream_1.StringStream));
var Utf8StreamImpl = (function (_super) {
    __extends(Utf8StreamImpl, _super);
    function Utf8StreamImpl(upstream) {
        var _this = _super.call(this) || this;
        _this.upstream = upstream;
        _this.partial = new Uint8Array([]);
        _this.partialBytesValid = 0;
        return _this;
    }
    Utf8StreamImpl.prototype.pump = function () {
        return __awaiter(this, void 0, void 0, function () {
            var chunkResult, chunk, partialBytesRemaining, nextIndex, okUpToIndex, splitUtfWidth, bulk, reassembled;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.upstream.next()];
                    case 1:
                        chunkResult = _a.sent();
                        if (chunkResult.done) {
                            if (this.partial.length === 0) {
                                return [2, false];
                            }
                            chunk = new Uint8Array([]);
                        }
                        else {
                            chunk = chunkResult.value;
                        }
                        partialBytesRemaining = this.partial.length - this.partialBytesValid;
                        nextIndex = partialBytesRemaining;
                        okUpToIndex = nextIndex;
                        splitUtfWidth = 0;
                        while (nextIndex < chunk.length) {
                            okUpToIndex = nextIndex;
                            splitUtfWidth = utfWidth(chunk[nextIndex]);
                            nextIndex = okUpToIndex + splitUtfWidth;
                        }
                        if (nextIndex === chunk.length) {
                            okUpToIndex = nextIndex;
                        }
                        bulk = utf8.decode(String.fromCharCode.apply(null, chunk.slice(partialBytesRemaining, okUpToIndex)));
                        if (partialBytesRemaining > 0) {
                            this.partial.set(chunk.slice(0, partialBytesRemaining), this.partialBytesValid);
                            reassembled = utf8.decode(String.fromCharCode.apply(null, this.partial));
                            this.outputQueue.push(reassembled + bulk);
                        }
                        else {
                            this.outputQueue.push(bulk);
                        }
                        if (okUpToIndex === chunk.length) {
                            this.partial = new Uint8Array([]);
                            this.partialBytesValid = 0;
                        }
                        else {
                            this.partial = new Uint8Array(new ArrayBuffer(splitUtfWidth));
                            this.partial.set(chunk.slice(okUpToIndex), 0);
                            this.partialBytesValid = chunk.length - okUpToIndex;
                        }
                        return [2, true];
                }
            });
        });
    };
    return Utf8StreamImpl;
}(data_stream_1.QueueStream));
function utfWidth(firstByte) {
    if (firstByte >= 252) {
        return 6;
    }
    else if (firstByte >= 248) {
        return 5;
    }
    else if (firstByte >= 240) {
        return 4;
    }
    else if (firstByte >= 224) {
        return 3;
    }
    else if (firstByte >= 192) {
        return 2;
    }
    else {
        return 1;
    }
}
