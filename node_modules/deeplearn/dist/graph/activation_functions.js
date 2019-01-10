"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../globals");
var tensor_1 = require("../tensor");
var TanHFunc = (function () {
    function TanHFunc() {
        this.one = tensor_1.Scalar.new(1);
    }
    TanHFunc.prototype.output = function (math, x) {
        return math.tanh(x);
    };
    TanHFunc.prototype.der = function (math, x, y) {
        var _this = this;
        return globals_1.tidy(function () {
            var ySquared = math.multiplyStrict(y, y);
            return math.subtract(_this.one, ySquared);
        });
    };
    TanHFunc.prototype.dispose = function () {
        this.one.dispose();
    };
    return TanHFunc;
}());
exports.TanHFunc = TanHFunc;
var ReLUFunc = (function () {
    function ReLUFunc() {
    }
    ReLUFunc.prototype.output = function (math, x) {
        return math.relu(x);
    };
    ReLUFunc.prototype.der = function (math, x, y) {
        return math.step(x);
    };
    ReLUFunc.prototype.dispose = function () { };
    return ReLUFunc;
}());
exports.ReLUFunc = ReLUFunc;
var LeakyReluFunc = (function () {
    function LeakyReluFunc(alpha) {
        this.alpha = alpha;
    }
    LeakyReluFunc.prototype.output = function (math, x) {
        return math.leakyRelu(x, this.alpha);
    };
    LeakyReluFunc.prototype.der = function (math, x, y) {
        return math.step(x, this.alpha);
    };
    LeakyReluFunc.prototype.dispose = function () { };
    return LeakyReluFunc;
}());
exports.LeakyReluFunc = LeakyReluFunc;
var SigmoidFunc = (function () {
    function SigmoidFunc() {
    }
    SigmoidFunc.prototype.output = function (math, x) {
        return math.sigmoid(x);
    };
    SigmoidFunc.prototype.der = function (math, x, y) {
        return globals_1.tidy(function () {
            var ySquared = math.multiplyStrict(y, y);
            return math.subStrict(y, ySquared);
        });
    };
    SigmoidFunc.prototype.dispose = function () { };
    return SigmoidFunc;
}());
exports.SigmoidFunc = SigmoidFunc;
var SquareFunc = (function () {
    function SquareFunc() {
        this.two = tensor_1.Scalar.new(2);
    }
    SquareFunc.prototype.output = function (math, x) {
        return math.multiplyStrict(x, x);
    };
    SquareFunc.prototype.der = function (math, x, y) {
        return math.multiply(this.two, x);
    };
    SquareFunc.prototype.dispose = function () {
        this.two.dispose();
    };
    return SquareFunc;
}());
exports.SquareFunc = SquareFunc;
var EluFunc = (function () {
    function EluFunc() {
    }
    EluFunc.prototype.output = function (math, x) {
        return math.elu(x);
    };
    EluFunc.prototype.der = function (math, x, y) {
        throw new Error('Not implemented');
    };
    EluFunc.prototype.dispose = function () { };
    return EluFunc;
}());
exports.EluFunc = EluFunc;
