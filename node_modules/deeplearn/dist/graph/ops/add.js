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
var util = require("../../util");
var graph_util = require("../graph_util");
var op_1 = require("./op");
var Add = (function (_super) {
    __extends(Add, _super);
    function Add(x1Tensor, x2Tensor, yTensor) {
        var _this = _super.call(this) || this;
        _this.x1Tensor = x1Tensor;
        _this.x2Tensor = x2Tensor;
        _this.yTensor = yTensor;
        util.assert(util.sizeFromShape(x1Tensor.shape) === 1 ||
            util.sizeFromShape(x2Tensor.shape) === 1 ||
            util.arraysEqual(x1Tensor.shape, x2Tensor.shape) ||
            (x1Tensor.shape.length === 2 && x2Tensor.shape.length === 1 &&
                x1Tensor.shape[1] === x2Tensor.shape[0]) ||
            (x1Tensor.shape.length === 1 && x2Tensor.shape.length === 2 &&
                x1Tensor.shape[0] === x2Tensor.shape[1]), 'One of t1 or t2 must be a scalar, or t1 and t2 must have ' +
            'the same shape, ' +
            'or one of them can be broadcasted (2D and 1D).');
        return _this;
    }
    Add.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x1 = inferenceArrays.get(this.x1Tensor);
        var x2 = inferenceArrays.get(this.x2Tensor);
        globals_1.tidy(function () {
            var result;
            if (util.isScalarShape(x1.shape)) {
                result = math.scalarPlusArray(x1, x2);
            }
            else if (util.isScalarShape(x2.shape)) {
                result = math.scalarPlusArray(x2, x1);
            }
            else {
                result = math.add(x1, x2);
            }
            inferenceArrays.set(_this.yTensor, globals_1.keep(result));
        });
    };
    Add.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        var dy = gradientArrays.get(this.yTensor);
        globals_1.tidy(function () {
            if (graph_util.shouldBackProp(_this.x1Tensor)) {
                if (_this.x1Tensor.shape.length === 1 &&
                    _this.x2Tensor.shape.length === 2 &&
                    _this.x1Tensor.shape[0] === _this.x2Tensor.shape[1]) {
                    var sum = math.sum(dy, 0);
                    gradientArrays.add(_this.x1Tensor, sum);
                }
                else if (util.isScalarShape(_this.x1Tensor.shape)) {
                    var sum = math.sum(dy);
                    gradientArrays.add(_this.x1Tensor, sum);
                }
                else {
                    gradientArrays.add(_this.x1Tensor, math.clone(dy));
                }
            }
            if (graph_util.shouldBackProp(_this.x2Tensor)) {
                if (_this.x1Tensor.shape.length === 2 &&
                    _this.x2Tensor.shape.length === 1 &&
                    _this.x1Tensor.shape[1] === _this.x2Tensor.shape[0]) {
                    var sum = math.sum(dy, 0);
                    gradientArrays.add(_this.x2Tensor, sum);
                }
                else if (util.isScalarShape(_this.x2Tensor.shape)) {
                    var sum = math.sum(dy);
                    gradientArrays.add(_this.x2Tensor, sum);
                }
                else {
                    gradientArrays.add(_this.x2Tensor, math.clone(dy));
                }
            }
        });
    };
    Add.prototype.dispose = function () {
        if (this.dySizeScalar != null) {
            this.dySizeScalar.dispose();
        }
    };
    return Add;
}(op_1.Operation));
exports.Add = Add;
