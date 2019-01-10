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
var session_util = require("../graph/session_util");
var tensor_array_map_1 = require("../graph/tensor_array_map");
var ops_1 = require("../ops/ops");
var tensor_1 = require("../tensor");
var optimizer_1 = require("./optimizer");
var RMSPropOptimizer = (function (_super) {
    __extends(RMSPropOptimizer, _super);
    function RMSPropOptimizer(learningRate, decay, momentum, specifiedVariableList, epsilon) {
        if (decay === void 0) { decay = 0.9; }
        if (momentum === void 0) { momentum = 0.0; }
        if (epsilon === void 0) { epsilon = 1e-8; }
        var _this = _super.call(this, learningRate, specifiedVariableList) || this;
        _this.learningRate = learningRate;
        _this.accumulatedMeanSquares = {};
        _this.accumulatedMoments = {};
        _this.accumulatedMeanSquaredGraph = new tensor_array_map_1.TensorArrayMap();
        _this.accumulatedMomentGraph = new tensor_array_map_1.TensorArrayMap();
        _this.c = globals_1.keep(ops_1.scalar(learningRate));
        _this.epsilon = globals_1.keep(ops_1.scalar(epsilon));
        _this.decay = globals_1.keep(ops_1.scalar(decay));
        _this.momentum = globals_1.keep(ops_1.scalar(momentum));
        _this.oneMinusDecay = globals_1.keep(ops_1.scalar(1 - decay));
        return _this;
    }
    RMSPropOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var _loop_1 = function (variableName) {
            var value = environment_1.ENV.engine.registeredVariables[variableName];
            if (this_1.accumulatedMeanSquares[variableName] == null) {
                var trainable_1 = false;
                globals_1.tidy(function () {
                    _this.accumulatedMeanSquares[variableName] =
                        ops_1.zerosLike(value).variable(trainable_1);
                });
            }
            if (this_1.accumulatedMoments[variableName] == null) {
                var trainable_2 = false;
                globals_1.tidy(function () {
                    _this.accumulatedMoments[variableName] =
                        ops_1.zerosLike(value).variable(trainable_2);
                });
            }
            var accumulatedMeanSquare = this_1.accumulatedMeanSquares[variableName];
            var accumulatedMoments = this_1.accumulatedMoments[variableName];
            var gradient = variableGradients[variableName];
            globals_1.tidy(function () {
                var newAccumulatedMeanSquare = _this.decay.mul(accumulatedMeanSquare)
                    .add(_this.oneMinusDecay.mul(gradient.square()));
                var newAccumulatedMoments = _this.momentum.mul(accumulatedMoments)
                    .add(_this.c.mul(gradient).div(newAccumulatedMeanSquare.add(_this.epsilon).sqrt()));
                _this.accumulatedMeanSquares[variableName].assign(newAccumulatedMeanSquare);
                _this.accumulatedMoments[variableName].assign(newAccumulatedMoments);
                var newValue = value.sub(newAccumulatedMoments);
                value.assign(newValue);
            });
        };
        var this_1 = this;
        for (var variableName in variableGradients) {
            _loop_1(variableName);
        }
    };
    RMSPropOptimizer.prototype.beforeBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        this.variableNodes = this.specifiedVariableNodes == null ?
            session_util.getVariableNodesFromEvaluationSet(runtime.nodes) :
            this.specifiedVariableNodes;
        if (batchSize !== this.prevBatchSize) {
            if (this.cGraph != null) {
                this.cGraph.dispose();
            }
            this.prevBatchSize = batchSize;
            this.cGraph = math.keep(ops_1.scalar(this.learningRate / batchSize));
        }
        this.variableNodes.forEach(function (node) { return _this.variableGradients.set(node.output, math.keep(tensor_1.Tensor.zeros(node.output.shape))); });
        if (this.accumulatedMeanSquaredGraph.size() === 0) {
            this.variableNodes.forEach(function (node) {
                _this.accumulatedMeanSquaredGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
                _this.accumulatedMomentGraph.set(node.output, tensor_1.Tensor.zeros(node.output.shape));
            });
        }
    };
    RMSPropOptimizer.prototype.afterBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        globals_1.tidy(function () {
            _this.variableNodes.forEach(function (node) {
                var oldVariable = activationArrayMap.get(node.output);
                var gradient = _this.variableGradients.get(node.output);
                var oldMeanSquare = _this.accumulatedMeanSquaredGraph.get(node.output);
                var oldMoment = _this.accumulatedMomentGraph.get(node.output);
                var meanSquare = math.scaledArrayAdd(_this.decay, oldMeanSquare, _this.oneMinusDecay, gradient.square());
                var moment = math.scaledArrayAdd(_this.momentum, oldMoment, _this.cGraph, gradient.div(meanSquare.add(_this.epsilon).sqrt()));
                var variable = oldVariable.sub(moment);
                _this.accumulatedMeanSquaredGraph.set(node.output, globals_1.keep(meanSquare));
                _this.accumulatedMomentGraph.set(node.output, globals_1.keep(moment));
                activationArrayMap.set(node.output, globals_1.keep(variable));
                node.data = variable;
                oldVariable.dispose();
                oldMeanSquare.dispose();
                oldMoment.dispose();
            });
        });
        this.variableGradients.dispose();
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
    };
    RMSPropOptimizer.prototype.dispose = function () {
        var _this = this;
        _super.prototype.dispose.call(this);
        this.c.dispose();
        this.epsilon.dispose();
        this.decay.dispose();
        this.momentum.dispose();
        this.oneMinusDecay.dispose();
        if (this.accumulatedMeanSquaredGraph != null) {
            this.accumulatedMeanSquaredGraph.dispose();
        }
        if (this.accumulatedMomentGraph != null) {
            this.accumulatedMomentGraph.dispose();
        }
        if (this.accumulatedMeanSquares != null) {
            Object.keys(this.accumulatedMeanSquares)
                .forEach(function (name) { return _this.accumulatedMeanSquares[name].dispose(); });
        }
        if (this.accumulatedMoments != null) {
            Object.keys(this.accumulatedMoments)
                .forEach(function (name) { return _this.accumulatedMoments[name].dispose(); });
        }
    };
    return RMSPropOptimizer;
}(optimizer_1.Optimizer));
exports.RMSPropOptimizer = RMSPropOptimizer;
