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
var byte_stream_1 = require("./byte_stream");
var FileReaderStream = (function (_super) {
    __extends(FileReaderStream, _super);
    function FileReaderStream(file, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.file = file;
        _this.options = options;
        _this.offset = options.offset || 0;
        _this.chunkSize = options.chunkSize || 1024 * 1024;
        return _this;
    }
    FileReaderStream.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var chunk, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.offset >= this.file.size) {
                            return [2, { value: null, done: true }];
                        }
                        chunk = new Promise(function (resolve, reject) {
                            var fileReader = new FileReader();
                            fileReader.onload = function (event) {
                                var data = fileReader.result;
                                if (data instanceof ArrayBuffer) {
                                    data = new Uint8Array(data);
                                }
                                if (!(data instanceof Uint8Array)) {
                                    return reject(new TypeError('FileReader returned unknown type.'));
                                }
                                resolve(data);
                            };
                            fileReader.onabort = function (event) {
                                return reject(new Error('Aborted'));
                            };
                            fileReader.onerror = function (event) {
                                return reject(new Error(event.error));
                            };
                            var end = _this.offset + _this.chunkSize;
                            var slice = _this.file.slice(_this.offset, end);
                            fileReader.readAsArrayBuffer(slice);
                            _this.offset = end;
                        });
                        _a = {};
                        return [4, chunk];
                    case 1: return [2, (_a.value = (_b.sent()), _a.done = false, _a)];
                }
            });
        });
    };
    return FileReaderStream;
}(byte_stream_1.ByteStream));
exports.FileReaderStream = FileReaderStream;
