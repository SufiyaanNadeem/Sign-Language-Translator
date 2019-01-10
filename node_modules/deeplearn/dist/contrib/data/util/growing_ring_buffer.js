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
var ring_buffer_1 = require("./ring_buffer");
var GrowingRingBuffer = (function (_super) {
    __extends(GrowingRingBuffer, _super);
    function GrowingRingBuffer() {
        return _super.call(this, GrowingRingBuffer.INITIAL_CAPACITY) || this;
    }
    GrowingRingBuffer.prototype.isFull = function () {
        return false;
    };
    GrowingRingBuffer.prototype.push = function (value) {
        if (_super.prototype.isFull.call(this)) {
            this.expand();
        }
        _super.prototype.push.call(this, value);
    };
    GrowingRingBuffer.prototype.unshift = function (value) {
        if (_super.prototype.isFull.call(this)) {
            this.expand();
        }
        _super.prototype.unshift.call(this, value);
    };
    GrowingRingBuffer.prototype.expand = function () {
        var newCapacity = this.capacity * 2;
        var newData = new Array(newCapacity);
        var len = this.length();
        for (var i = 0; i < len; i++) {
            newData[i] = this.get(this.wrap(this.begin + i));
        }
        this.data = newData;
        this.capacity = newCapacity;
        this.doubledCapacity = 2 * this.capacity;
        this.begin = 0;
        this.end = len;
    };
    GrowingRingBuffer.INITIAL_CAPACITY = 32;
    return GrowingRingBuffer;
}(ring_buffer_1.RingBuffer));
exports.GrowingRingBuffer = GrowingRingBuffer;
