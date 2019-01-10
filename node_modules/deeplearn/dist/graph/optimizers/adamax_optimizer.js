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
var AdamaxOptimizer = (function (_super) {
    __extends(AdamaxOptimizer, _super);
    function AdamaxOptimizer(learningRate, beta1, beta2, specifiedVariableList) {
        var _this = _super.call(this, learningRate, specifiedVariableList) || this;
        _this.learningRate = learningRate;
        _this.beta1 = beta1;
        _this.beta2 = beta2;
        _this.firstMoment = new tensor_array_map_1.TensorArrayMap();
        _this.weightedInfNorm = new tensor_array_map_1.TensorArrayMap();
        _this.eps = tensor_1.Scalar.new(1e-8);
        _this.b1 = ops_1.scalar(_this.beta1);
        _this.b2 = ops_1.scalar(_this.beta2);
        _this.accB1 = ops_1.scalar(_this.beta1);
        _this.one = ops_1.scalar(1);
        return _this;
    }
    AdamaxOptimizer.prototype.applyGradients = function (variableGradients) {
        throw new Error("Adamax optimizer not yet implemented for eager mode.");
    };
    AdamaxOptimizer.prototype.beforeBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        _super.prototype.beforeBatch.call(this, math, batchSize, runtime, activationArrayMap, gradientArrayMap);
        if (this.firstMoment.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.firstMoment.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
        if (this.weightedInfNorm.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.weightedInfNorm.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
    };
    AdamaxOptimizer.prototype.afterBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        globals_1.tidy(function () {
            _this.variableNodes.forEach(function (node) {
                var oldVariable = activationArrayMap.get(node.output);
                var gradient = _this.variableGradients.get(node.output);
                var oldFirstMoment = _this.firstMoment.get(node.output);
                var oldWeightedInfNorm = _this.weightedInfNorm.get(node.output);
                var newFirstMoment = math.scaledArrayAdd(_this.b1, oldFirstMoment, math.subtract(_this.one, _this.b1), gradient);
                var ut0 = math.multiply(_this.b2, oldWeightedInfNorm);
                var ut1 = math.abs(gradient);
                var newWeightedInfNorm = math.add(math.relu(math.subtract(ut0, ut1)), ut1);
                var variable = math.scaledArrayAdd(_this.one, oldVariable, math.divideStrict(_this.cGraph, math.subtract(_this.one, _this.accB1)), math.divide(newFirstMoment, math.add(_this.eps, newWeightedInfNorm)));
                activationArrayMap.set(node.output, globals_1.keep(variable));
                node.data = variable;
                _this.firstMoment.set(node.output, globals_1.keep(newFirstMoment));
                _this.weightedInfNorm.set(node.output, globals_1.keep(newWeightedInfNorm));
                oldVariable.dispose();
                gradient.dispose();
                oldFirstMoment.dispose();
                oldWeightedInfNorm.dispose();
            });
            var oldAccB1 = _this.accB1;
            _this.accB1 = globals_1.keep(math.multiply(_this.accB1, _this.b1));
            oldAccB1.dispose();
        });
        this.variableGradients.dispose();
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
    };
    AdamaxOptimizer.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.firstMoment.dispose();
        this.weightedInfNorm.dispose();
        this.eps.dispose();
        this.accB1.dispose();
        this.b1.dispose();
        this.b2.dispose();
    };
    return AdamaxOptimizer;
}(optimizer_1.Optimizer));
exports.AdamaxOptimizer = AdamaxOptimizer;
