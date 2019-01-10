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
var datasource_1 = require("../datasource");
var filereader_stream_1 = require("../streams/filereader_stream");
var FileDataSource = (function (_super) {
    __extends(FileDataSource, _super);
    function FileDataSource(input, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.input = input;
        _this.options = options;
        return _this;
    }
    FileDataSource.prototype.getStream = function () {
        return new filereader_stream_1.FileReaderStream(this.input, this.options);
    };
    return FileDataSource;
}(datasource_1.DataSource));
exports.FileDataSource = FileDataSource;
