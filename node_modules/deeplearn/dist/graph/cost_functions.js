"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("../globals");
var ops = require("../ops/ops");
var SquareCostFunc = (function () {
    function SquareCostFunc() {
        this.halfOne = globals_1.keep(ops.scalar(0.5));
    }
    SquareCostFunc.prototype.cost = function (x1, x2) {
        var diff = x1.subStrict(x2);
        var diffSquared = diff.square();
        var result = this.halfOne.mul(diffSquared);
        diff.dispose();
        diffSquared.dispose();
        return result;
    };
    SquareCostFunc.prototype.der = function (x1, x2) {
        return x1.subStrict(x2);
    };
    SquareCostFunc.prototype.dispose = function () {
        this.halfOne.dispose();
    };
    return SquareCostFunc;
}());
exports.SquareCostFunc = SquareCostFunc;
