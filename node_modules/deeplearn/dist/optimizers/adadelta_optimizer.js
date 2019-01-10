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
var AdadeltaOptimizer = (function (_super) {
    __extends(AdadeltaOptimizer, _super);
    function AdadeltaOptimizer(learningRate, rho, specifiedVariableList, epsilon) {
        if (epsilon === void 0) { epsilon = 1e-8; }
        var _this = _super.call(this, learningRate, specifiedVariableList) || this;
        _this.accumulatedGrads = {};
        _this.accumulatedUpdates = {};
        _this.accumulatedSquaredGradientsGraph = new tensor_array_map_1.TensorArrayMap();
        _this.accumulatedUpdatesGraph = new tensor_array_map_1.TensorArrayMap();
        _this.c = globals_1.keep(ops_1.scalar(-learningRate));
        _this.epsilon = globals_1.keep(ops_1.scalar(epsilon));
        _this.rho = globals_1.keep(ops_1.scalar(rho));
        _this.oneMinusRho = globals_1.keep(ops_1.scalar(1 - rho));
        return _this;
    }
    AdadeltaOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var _loop_1 = function (variableName) {
            var value = environment_1.ENV.engine.registeredVariables[variableName];
            if (this_1.accumulatedGrads[variableName] == null) {
                var trainable_1 = false;
                globals_1.tidy(function () {
                    _this.accumulatedGrads[variableName] =
                        ops_1.zerosLike(value).variable(trainable_1);
                });
            }
            if (this_1.accumulatedUpdates[variableName] == null) {
                var trainable_2 = false;
                globals_1.tidy(function () {
                    _this.accumulatedUpdates[variableName] =
                        ops_1.zerosLike(value).variable(trainable_2);
                });
            }
            var gradient = variableGradients[variableName];
            var accumulatedGrad = this_1.accumulatedGrads[variableName];
            var accumulatedUpdate = this_1.accumulatedUpdates[variableName];
            globals_1.tidy(function () {
                var newAccumulatedGrad = _this.rho.mul(accumulatedGrad)
                    .add(_this.oneMinusRho.mul(gradient.square()));
                var updates = accumulatedUpdate.add(_this.epsilon)
                    .sqrt()
                    .div(accumulatedGrad.add(_this.epsilon).sqrt())
                    .mul(gradient);
                var newAccumulatedUpdate = _this.rho.mul(accumulatedUpdate)
                    .add(_this.oneMinusRho.mul(updates.square()));
                _this.accumulatedGrads[variableName].assign(newAccumulatedGrad);
                _this.accumulatedUpdates[variableName].assign(newAccumulatedUpdate);
                var newValue = _this.c.mul(updates).add(value);
                value.assign(newValue);
            });
        };
        var this_1 = this;
        for (var variableName in variableGradients) {
            _loop_1(variableName);
        }
    };
    AdadeltaOptimizer.prototype.beforeBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        _super.prototype.beforeBatch.call(this, math, batchSize, runtime, activationArrayMap, gradientArrayMap);
        if (this.accumulatedSquaredGradientsGraph.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.accumulatedSquaredGradientsGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
                _this.accumulatedUpdatesGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
    };
    AdadeltaOptimizer.prototype.afterBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        if (this.one == null) {
            this.one = globals_1.keep(ops_1.scalar(1));
        }
        globals_1.tidy(function () {
            _this.variableNodes.forEach(function (node) {
                var oldVariable = activationArrayMap.get(node.output);
                var gradient = _this.variableGradients.get(node.output);
                var oldCache = _this.accumulatedSquaredGradientsGraph.get(node.output);
                var oldUpdates = _this.accumulatedUpdatesGraph.get(node.output);
                var gradientSquare = math.multiply(gradient, gradient);
                var cache = math.scaledArrayAdd(_this.rho, oldCache, math.subtract(_this.one, _this.rho), gradientSquare);
                var updates = math.multiply(math.divide(math.sqrt(math.add(oldUpdates, _this.epsilon)), math.sqrt(math.add(oldCache, _this.epsilon))), gradient);
                var variable = math.scaledArrayAdd(_this.cGraph, updates, _this.one, oldVariable);
                var updateSquare = math.multiply(updates, updates);
                var newUpdates = math.scaledArrayAdd(_this.rho, oldUpdates, math.subtract(_this.one, _this.rho), updateSquare);
                _this.accumulatedSquaredGradientsGraph.set(node.output, globals_1.keep(cache));
                _this.accumulatedUpdatesGraph.set(node.output, globals_1.keep(newUpdates));
                activationArrayMap.set(node.output, globals_1.keep(variable));
                node.data = variable;
                oldVariable.dispose();
                oldCache.dispose();
                oldUpdates.dispose();
            });
        });
        this.variableGradients.dispose();
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
    };
    AdadeltaOptimizer.prototype.dispose = function () {
        var _this = this;
        _super.prototype.dispose.call(this);
        this.c.dispose();
        this.epsilon.dispose();
        this.rho.dispose();
        this.oneMinusRho.dispose();
        if (this.one != null) {
            this.one.dispose();
        }
        if (this.accumulatedSquaredGradientsGraph != null) {
            this.accumulatedSquaredGradientsGraph.dispose();
        }
        if (this.accumulatedUpdatesGraph != null) {
            this.accumulatedUpdatesGraph.dispose();
        }
        if (this.accumulatedUpdates != null) {
            Object.keys(this.accumulatedUpdates)
                .forEach(function (name) { return _this.accumulatedUpdates[name].dispose(); });
            Object.keys(this.accumulatedGrads)
                .forEach(function (name) { return _this.accumulatedGrads[name].dispose(); });
        }
    };
    return AdadeltaOptimizer;
}(optimizer_1.Optimizer));
exports.AdadeltaOptimizer = AdadeltaOptimizer;
