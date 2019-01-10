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
var globals_1 = require("../../globals");
var concat_util = require("../../ops/concat_util");
var util = require("../../util");
var op_1 = require("./op");
var Concat1D = (function (_super) {
    __extends(Concat1D, _super);
    function Concat1D(x1Tensor, x2Tensor, yTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.yTensor = yTensor;
        return _this;
    }
    Concat1D.prototype.feedForward = function (math, inferecenArrays) {
        var _this = this;
        var x1 = inferecenArrays.get(this.x1Tensor);
        var x2 = inferecenArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            var concatResult = math.concat1D(x1, x2);
            inferecenArrays.set(_this.yTensor, globals_1.keep(concatResult));
        });
    };
    Concat1D.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        globals_1.tidy(function () {
            concatBackProp(math, _this.x1Tensor, _this.x2Tensor, _this.yTensor, 0, gradientArrays, inferenceArrays);
        });
    };
    return Concat1D;
}(op_1.Operation));
exports.Concat1D = Concat1D;
var Concat2D = (function (_super) {
    __extends(Concat2D, _super);
    function Concat2D(x1Tensor, x2Tensor, axis, yTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.axis = axis;
        _this.yTensor = yTensor;
        concat_util.assertParams(x1Tensor.shape, x2Tensor.shape, axis);
        return _this;
    }
    Concat2D.prototype.feedForward = function (math, inferecenArrays) {
        var _this = this;
        var x1 = inferecenArrays.get(this.x1Tensor);
        var x2 = inferecenArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            var concatResult = math.concat2D(x1, x2, _this.axis);
            inferecenArrays.set(_this.yTensor, globals_1.keep(concatResult));
        });
    };
    Concat2D.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        globals_1.tidy(function () {
            concatBackProp(math, _this.x1Tensor, _this.x2Tensor, _this.yTensor, _this.axis, gradientArrays, inferenceArrays);
        });
    };
    return Concat2D;
}(op_1.Operation));
exports.Concat2D = Concat2D;
var Concat3D = (function (_super) {
    __extends(Concat3D, _super);
    function Concat3D(x1Tensor, x2Tensor, axis, yTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.axis = axis;
        _this.yTensor = yTensor;
        concat_util.assertParams(x1Tensor.shape, x2Tensor.shape, axis);
        return _this;
    }
    Concat3D.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x1 = inferenceArrays.get(this.x1Tensor);
        var x2 = inferenceArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            var concatResult = math.concat3D(x1, x2, _this.axis);
            inferenceArrays.set(_this.yTensor, globals_1.keep(concatResult));
        });
    };
    Concat3D.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        globals_1.tidy(function () {
            concatBackProp(math, _this.x1Tensor, _this.x2Tensor, _this.yTensor, _this.axis, gradientArrays, inferenceArrays);
        });
    };
    return Concat3D;
}(op_1.Operation));
exports.Concat3D = Concat3D;
var Concat4D = (function (_super) {
    __extends(Concat4D, _super);
    function Concat4D(x1Tensor, x2Tensor, axis, yTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.axis = axis;
        _this.yTensor = yTensor;
        concat_util.assertParams(x1Tensor.shape, x2Tensor.shape, axis);
        return _this;
    }
    Concat4D.prototype.feedForward = function (math, inferecenArrays) {
        var _this = this;
        var x1 = inferecenArrays.get(this.x1Tensor);
        var x2 = inferecenArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            var concatResult = math.concat4D(x1, x2, _this.axis);
            inferecenArrays.set(_this.yTensor, globals_1.keep(concatResult));
        });
    };
    Concat4D.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        globals_1.tidy(function () {
            concatBackProp(math, _this.x1Tensor, _this.x2Tensor, _this.yTensor, _this.axis, gradientArrays, inferenceArrays);
        });
    };
    return Concat4D;
}(op_1.Operation));
exports.Concat4D = Concat4D;
function concatBackProp(math, aTensor, bTensor, yTensor, axis, gradArrays, infArrays) {
    var dy = gradArrays.get(yTensor);
    var a = infArrays.get(aTensor);
    var b = infArrays.get(bTensor);
    var a2D = a.as2D(-1, util.sizeFromShape(a.shape.slice(axis)));
    var b2D = b.as2D(-1, util.sizeFromShape(b.shape.slice(axis)));
    var _a = concat_util.computeGradientSliceShapes(a2D.shape, b2D.shape), aBegin = _a.aBegin, aSize = _a.aSize, bBegin = _a.bBegin, bSize = _a.bSize;
    var dy2D = dy.as2D(-1, a2D.shape[1] + b2D.shape[1]);
    var slice1Result = math.slice2D(dy2D, aBegin, aSize).reshapeAs(a);
    var slice2Result = math.slice2D(dy2D, bBegin, bSize).reshapeAs(b);
    gradArrays.add(aTensor, slice1Result);
    gradArrays.add(bTensor, slice2Result);
}
