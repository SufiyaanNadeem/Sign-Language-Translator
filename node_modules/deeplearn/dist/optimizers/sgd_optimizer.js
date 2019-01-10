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
var optimizer_1 = require("./optimizer");
var SGDOptimizer = (function (_super) {
    __extends(SGDOptimizer, _super);
    function SGDOptimizer(learningRate, specifiedVariableList) {
        var _this = _super.call(this, learningRate, specifiedVariableList) || this;
        _this.learningRate = learningRate;
        _this.setLearningRate(learningRate);
        return _this;
    }
    SGDOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var varNames = Object.keys(variableGradients);
        varNames.forEach(function (varName) {
            var gradient = variableGradients[varName];
            var value = environment_1.ENV.engine.registeredVariables[varName];
            globals_1.tidy(function () {
                var newValue = _this.c.mul(gradient).add(value);
                value.assign(newValue);
            });
        });
    };
    SGDOptimizer.prototype.setLearningRate = function (learningRate) {
        this.learningRate = learningRate;
        if (this.c != null) {
            this.c.dispose();
        }
        this.c = environment_1.ENV.math.keep(ops_1.scalar(-learningRate));
    };
    SGDOptimizer.prototype.dispose = function () {
        this.c.dispose();
        if (this.one != null) {
            this.one.dispose();
        }
        _super.prototype.dispose.call(this);
    };
    SGDOptimizer.prototype.afterBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        if (this.one == null) {
            this.one = globals_1.keep(ops_1.scalar(1));
        }
        globals_1.tidy(function () {
            _this.variableNodes.forEach(function (node) {
                var oldVariable = activationArrayMap.get(node.output);
                var gradient = _this.variableGradients.get(node.output);
                var variable = math.scaledArrayAdd(_this.cGraph, gradient, _this.one, oldVariable);
                activationArrayMap.set(node.output, globals_1.keep(variable));
                node.data = variable;
                oldVariable.dispose();
            });
        });
        this.variableGradients.dispose();
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
    };
    return SGDOptimizer;
}(optimizer_1.Optimizer));
exports.SGDOptimizer = SGDOptimizer;
