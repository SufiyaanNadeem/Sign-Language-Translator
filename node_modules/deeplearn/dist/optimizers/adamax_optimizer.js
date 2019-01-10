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
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var tensor_array_map_1 = require("../graph/tensor_array_map");
var ops_1 = require("../ops/ops");
var tensor_1 = require("../tensor");
var optimizer_1 = require("./optimizer");
var AdamaxOptimizer = (function (_super) {
    __extends(AdamaxOptimizer, _super);
    function AdamaxOptimizer(learningRate, beta1, beta2, epsilon, decay, specifiedVariableList) {
        if (epsilon === void 0) { epsilon = 1e-8; }
        if (decay === void 0) { decay = 0.0; }
        var _this = _super.call(this, learningRate, specifiedVariableList) || this;
        _this.learningRate = learningRate;
        _this.accumulatedFirstMoment = {};
        _this.accumulatedWeightedInfNorm = {};
        _this.firstMomentGraph = new tensor_array_map_1.TensorArrayMap();
        _this.weightedInfNormGraph = new tensor_array_map_1.TensorArrayMap();
        _this.c = globals_1.keep(ops_1.scalar(-learningRate));
        _this.eps = globals_1.keep(ops_1.scalar(epsilon));
        _this.beta1 = globals_1.keep(ops_1.scalar(beta1));
        _this.beta2 = globals_1.keep(ops_1.scalar(beta2));
        _this.decay = globals_1.keep(ops_1.scalar(decay));
        globals_1.tidy(function () {
            _this.iteration = ops_1.scalar(0).variable();
            _this.accBeta1 = ops_1.scalar(beta1).variable();
        });
        _this.oneMinusBeta1 = globals_1.keep(ops_1.scalar(1 - beta1));
        _this.one = globals_1.keep(ops_1.scalar(1));
        return _this;
    }
    AdamaxOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        globals_1.tidy(function () {
            var oneMinusAccBeta1 = _this.one.sub(_this.accBeta1);
            var lr = _this.c.div(_this.one.add(_this.decay.mul(_this.iteration)));
            for (var variableName in variableGradients) {
                var value = environment_1.ENV.engine.registeredVariables[variableName];
                if (_this.accumulatedFirstMoment[variableName] == null) {
                    var trainable = false;
                    _this.accumulatedFirstMoment[variableName] =
                        ops_1.zerosLike(value).variable(trainable);
                }
                if (_this.accumulatedWeightedInfNorm[variableName] == null) {
                    var trainable = false;
                    _this.accumulatedWeightedInfNorm[variableName] =
                        ops_1.zerosLike(value).variable(trainable);
                }
                var gradient = variableGradients[variableName];
                var firstMoment = _this.accumulatedFirstMoment[variableName];
                var weightedInfNorm = _this.accumulatedWeightedInfNorm[variableName];
                var newFirstMoment = _this.beta1.mul(firstMoment).add(_this.oneMinusBeta1.mul(gradient));
                var ut0 = _this.beta2.mul(weightedInfNorm);
                var ut1 = gradient.abs();
                var newWeightedInfNorm = ut0.maximum(ut1);
                _this.accumulatedFirstMoment[variableName].assign(newFirstMoment);
                _this.accumulatedWeightedInfNorm[variableName].assign(newWeightedInfNorm);
                var newValue = lr.div(oneMinusAccBeta1)
                    .mul(newFirstMoment.div(_this.eps.add(newWeightedInfNorm)))
                    .add(value);
                value.assign(newValue);
            }
            _this.iteration.assign(_this.iteration.add(_this.one));
            _this.accBeta1.assign(_this.accBeta1.mul(_this.beta1));
        });
    };
    AdamaxOptimizer.prototype.beforeBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        _super.prototype.beforeBatch.call(this, math, batchSize, runtime, activationArrayMap, gradientArrayMap);
        if (this.firstMomentGraph.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.firstMomentGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
        if (this.weightedInfNormGraph.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.weightedInfNormGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
    };
    AdamaxOptimizer.prototype.afterBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        globals_1.tidy(function () {
            var lr = _this.cGraph.div(_this.one.add(_this.decay.mul(_this.iteration)));
            _this.variableNodes.forEach(function (node) {
                var oldVariable = activationArrayMap.get(node.output);
                var gradient = _this.variableGradients.get(node.output);
                var oldFirstMoment = _this.firstMomentGraph.get(node.output);
                var oldWeightedInfNorm = _this.weightedInfNormGraph.get(node.output);
                var newFirstMoment = math.scaledArrayAdd(_this.beta1, oldFirstMoment, _this.oneMinusBeta1, gradient);
                var ut0 = _this.beta2.mul(oldWeightedInfNorm);
                var ut1 = gradient.abs();
                var newWeightedInfNorm = ut0.maximum(ut1);
                var variable = math.scaledArrayAdd(_this.one, oldVariable, lr.div(_this.one.sub(_this.accBeta1)), newFirstMoment.div(_this.eps.add(newWeightedInfNorm)));
                activationArrayMap.set(node.output, globals_1.keep(variable));
                node.data = variable;
                _this.firstMomentGraph.set(node.output, globals_1.keep(newFirstMoment));
                _this.weightedInfNormGraph.set(node.output, globals_1.keep(newWeightedInfNorm));
                oldVariable.dispose();
                gradient.dispose();
                oldFirstMoment.dispose();
                oldWeightedInfNorm.dispose();
            });
            _this.iteration.assign(_this.iteration.add(_this.one));
            _this.accBeta1.assign(_this.accBeta1.mul(_this.beta1));
        });
        this.variableGradients.dispose();
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
    };
    AdamaxOptimizer.prototype.dispose = function () {
        var _this = this;
        _super.prototype.dispose.call(this);
        this.c.dispose();
        this.eps.dispose();
        this.accBeta1.dispose();
        this.beta1.dispose();
        this.beta2.dispose();
        this.oneMinusBeta1.dispose();
        this.decay.dispose();
        this.iteration.dispose();
        this.one.dispose();
        if (this.firstMomentGraph != null) {
            this.firstMomentGraph.dispose();
        }
        if (this.weightedInfNormGraph != null) {
            this.weightedInfNormGraph.dispose();
        }
        if (this.accumulatedFirstMoment != null) {
            Object.keys(this.accumulatedFirstMoment)
                .forEach(function (name) { return _this.accumulatedFirstMoment[name].dispose(); });
        }
        if (this.accumulatedWeightedInfNorm != null) {
            Object.keys(this.accumulatedWeightedInfNorm)
                .forEach(function (name) { return _this.accumulatedWeightedInfNorm[name].dispose(); });
        }
    };
    return AdamaxOptimizer;
}(optimizer_1.Optimizer));
exports.AdamaxOptimizer = AdamaxOptimizer;
