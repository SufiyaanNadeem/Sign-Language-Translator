"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RingBuffer = (function () {
    function RingBuffer(capacity) {
        this.capacity = capacity;
        this.begin = 0;
        this.end = 0;
        if (capacity < 1) {
            throw new RangeError('Can\'t create ring buffer of capacity < 1.');
        }
        this.data = new Array(capacity);
        this.doubledCapacity = 2 * capacity;
    }
    RingBuffer.prototype.wrap = function (index) {
        while (index < 0) {
            index += this.doubledCapacity;
        }
        return index % this.doubledCapacity;
    };
    RingBuffer.prototype.get = function (index) {
        if (index < 0) {
            throw new RangeError('Can\'t get item at a negative index.');
        }
        return this.data[index % this.capacity];
    };
    RingBuffer.prototype.set = function (index, value) {
        if (index < 0) {
            throw new RangeError('Can\'t set item at a negative index.');
        }
        this.data[index % this.capacity] = value;
    };
    RingBuffer.prototype.length = function () {
        var length = this.end - this.begin;
        if (length < 0) {
            length = this.doubledCapacity + length;
        }
        return length;
    };
    RingBuffer.prototype.isFull = function () {
        return this.length() === this.capacity;
    };
    RingBuffer.prototype.isEmpty = function () {
        return this.length() === 0;
    };
    RingBuffer.prototype.push = function (value) {
        if (this.isFull()) {
            throw new RangeError('Ring buffer is full.');
        }
        this.set(this.end, value);
        this.end = this.wrap(this.end + 1);
    };
    RingBuffer.prototype.pop = function () {
        if (this.isEmpty()) {
            throw new RangeError('Ring buffer is empty.');
        }
        this.end = this.wrap(this.end - 1);
        var result = this.get(this.end);
        this.set(this.end, undefined);
        return result;
    };
    RingBuffer.prototype.unshift = function (value) {
        if (this.isFull()) {
            throw new RangeError('Ring buffer is full.');
        }
        this.begin = this.wrap(this.begin - 1);
        this.set(this.begin, value);
    };
    RingBuffer.prototype.shift = function () {
        if (this.isEmpty()) {
            throw new RangeError('Ring buffer is empty.');
        }
        var result = this.get(this.begin);
        this.set(this.begin, undefined);
        this.begin = this.wrap(this.begin + 1);
        return result;
    };
    RingBuffer.prototype.shuffleExcise = function (relativeIndex) {
        if (this.isEmpty()) {
            throw new RangeError('Ring buffer is empty.');
        }
        var index = this.wrap(this.begin + relativeIndex);
        var result = this.get(index);
        this.set(index, this.pop());
        return result;
    };
    return RingBuffer;
}());
exports.RingBuffer = RingBuffer;
