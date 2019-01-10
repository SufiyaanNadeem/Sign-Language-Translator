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
var ops_1 = require("../../ops/ops");
var optimizer_1 = require("../../optimizers/optimizer");
var tensor_1 = require("../../tensor");
var tensor_array_map_1 = require("../tensor_array_map");
var AdamOptimizer = (function (_super) {
    __extends(AdamOptimizer, _super);
    function AdamOptimizer(learningRate, beta1, beta2, specifiedVariableList) {
        var _this = _super.call(this, learningRate, specifiedVariableList) || this;
        _this.learningRate = learningRate;
        _this.beta1 = beta1;
        _this.beta2 = beta2;
        _this.firstMoment = new tensor_array_map_1.TensorArrayMap();
        _this.secondMoment = new tensor_array_map_1.TensorArrayMap();
        _this.eps = ops_1.scalar(1e-8);
        _this.b1 = ops_1.scalar(_this.beta1);
        _this.b2 = ops_1.scalar(_this.beta2);
        _this.accB1 = ops_1.scalar(_this.beta1);
        _this.accB2 = ops_1.scalar(_this.beta2);
        _this.one = ops_1.scalar(1);
        return _this;
    }
    AdamOptimizer.prototype.applyGradients = function (variableGradients) {
        throw new Error("Adam optimizer not yet implemented for eager mode.");
    };
    AdamOptimizer.prototype.beforeBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        _super.prototype.beforeBatch.call(this, math, batchSize, runtime, activationArrayMap, gradientArrayMap);
        if (this.firstMoment.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.firstMoment.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
        if (this.secondMoment.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.secondMoment.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
    };
    AdamOptimizer.prototype.afterBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        globals_1.tidy(function () {
            _this.variableNodes.forEach(function (node) {
                var oldVariable = activationArrayMap.get(node.output);
                var gradient = _this.variableGradients.get(node.output);
                var oldFirstMoment = _this.firstMoment.get(node.output);
                var oldSecondMoment = _this.secondMoment.get(node.output);
                var newFirstMoment = math.scaledArrayAdd(_this.b1, oldFirstMoment, math.subtract(_this.one, _this.b1), gradient);
                var gradientSquare = math.multiply(gradient, gradient);
                var newSecondMoment = math.scaledArrayAdd(_this.b2, oldSecondMoment, math.subtract(_this.one, _this.b2), gradientSquare);
                var biasCorrectedFirstMoment = math.divide(newFirstMoment, math.subtract(_this.one, _this.accB1));
                var biasCorrectedSecondMoment = math.divide(newSecondMoment, math.subtract(_this.one, _this.accB2));
                var variable = math.scaledArrayAdd(_this.cGraph, math.divide(biasCorrectedFirstMoment, math.add(math.sqrt(biasCorrectedSecondMoment), _this.eps)), _this.one, oldVariable);
                activationArrayMap.set(node.output, globals_1.keep(variable));
                node.data = variable;
                _this.firstMoment.set(node.output, globals_1.keep(newFirstMoment));
                _this.secondMoment.set(node.output, globals_1.keep(newSecondMoment));
                oldVariable.dispose();
                gradient.dispose();
                oldFirstMoment.dispose();
                oldSecondMoment.dispose();
            });
            var oldAccB1 = _this.accB1;
            var oldAccB2 = _this.accB2;
            _this.accB1 = globals_1.keep(math.multiply(_this.accB1, _this.b1));
            _this.accB2 = globals_1.keep(math.multiply(_this.accB2, _this.b2));
            oldAccB1.dispose();
            oldAccB2.dispose();
        });
        this.variableGradients.dispose();
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
    };
    AdamOptimizer.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.firstMoment.dispose();
        this.secondMoment.dispose();
        this.eps.dispose();
        this.b1.dispose();
        this.b2.dispose();
        this.accB1.dispose();
        this.accB2.dispose();
    };
    return AdamOptimizer;
}(optimizer_1.Optimizer));
exports.AdamOptimizer = AdamOptimizer;
