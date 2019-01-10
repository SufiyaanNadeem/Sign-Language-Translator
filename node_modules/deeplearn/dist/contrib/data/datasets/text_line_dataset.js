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
Object.defineProperty(exports, "__esModule", { value: true });
var dataset_1 = require("../dataset");
var TextLineDataset = (function (_super) {
    __extends(TextLineDataset, _super);
    function TextLineDataset(input, columnName) {
        if (columnName === void 0) { columnName = 'line'; }
        var _this = _super.call(this) || this;
        _this.input = input;
        _this.columnName = columnName;
        return _this;
    }
    TextLineDataset.prototype.getStream = function () {
        var _this = this;
        var readStream = this.input.getStream();
        var utf8Stream = readStream.decodeUTF8();
        var lineStream = utf8Stream.split('\n');
        return lineStream.map(function (x) {
            return (_a = {}, _a[_this.columnName] = x, _a);
            var _a;
        });
    };
    return TextLineDataset;
}(dataset_1.Dataset));
exports.TextLineDataset = TextLineDataset;
