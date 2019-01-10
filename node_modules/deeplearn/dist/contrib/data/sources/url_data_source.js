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
var url_stream_1 = require("../streams/url_stream");
var URLDataSource = (function (_super) {
    __extends(URLDataSource, _super);
    function URLDataSource(url, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.url = url;
        _this.options = options;
        return _this;
    }
    URLDataSource.prototype.getStream = function () {
        return new url_stream_1.URLStream(this.url, this.options);
    };
    return URLDataSource;
}(datasource_1.DataSource));
exports.URLDataSource = URLDataSource;
