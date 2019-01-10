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
var environment_1 = require("../../environment");
var globals_1 = require("../../globals");
var tensor_1 = require("../../tensor");
var util = require("../../util");
var graph_util = require("../graph_util");
var op_1 = require("./op");
var ReduceSum = (function (_super) {
    __extends(ReduceSum, _super);
    function ReduceSum(x, outTensor) {
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.outTensor = outTensor;
        util.assertShapesMatch(outTensor.shape, []);
        _this.ones = environment_1.ENV.math.keep(tensor_1.Tensor.ones(x.shape));
        return _this;
    }
    ReduceSum.prototype.feedForward = function (math, inferenceArrays) {
        var _this = this;
        var x = inferenceArrays.get(this.x);
        globals_1.tidy(function () {
            inferenceArrays.set(_this.outTensor, globals_1.keep(math.sum(x)));
        });
    };
    ReduceSum.prototype.backProp = function (math, inferenceArrays, gradientArrays) {
        var _this = this;
        if (!graph_util.shouldBackProp(this.x)) {
            return;
        }
        globals_1.tidy(function () {
            var dy = gradientArrays.get(_this.outTensor);
            gradientArrays.add(_this.x, math.scalarTimesArray(dy, _this.ones));
        });
    };
    ReduceSum.prototype.dispose = function () {
        this.ones.dispose();
    };
    return ReduceSum;
}(op_1.Operation));
exports.ReduceSum = ReduceSum;
