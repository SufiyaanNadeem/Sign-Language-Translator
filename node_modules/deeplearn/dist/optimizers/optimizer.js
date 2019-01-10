"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var globals_1 = require("../globals");
var session_util = require("../graph/session_util");
var tensor_array_map_1 = require("../graph/tensor_array_map");
var ops = require("../ops/ops");
var tensor_1 = require("../tensor");
var Optimizer = (function () {
    function Optimizer(learningRate, specifiedVariableList) {
        this.learningRate = learningRate;
        this.variableGradients = new tensor_array_map_1.TensorArrayMap();
        if (specifiedVariableList != null) {
            this.specifiedVariableNodes = specifiedVariableList;
        }
    }
    Optimizer.prototype.minimize = function (f, returnCost, varList) {
        if (returnCost === void 0) { returnCost = false; }
        var _a = this.computeGradients(f, varList), value = _a.value, grads = _a.grads;
        this.applyGradients(grads);
        var varNames = Object.keys(grads);
        varNames.forEach(function (varName) { return grads[varName].dispose(); });
        if (returnCost) {
            return value;
        }
        else {
            value.dispose();
            return null;
        }
    };
    Optimizer.prototype.computeGradients = function (f, varList) {
        return globals_1.variableGrads(f, varList);
    };
    Optimizer.prototype.beforeBatch = function (math, batchSize, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        this.variableNodes = this.specifiedVariableNodes == null ?
            session_util.getVariableNodesFromEvaluationSet(runtime.nodes) :
            this.specifiedVariableNodes;
        if (batchSize !== this.prevBatchSize) {
            if (this.cGraph != null) {
                this.cGraph.dispose();
            }
            this.prevBatchSize = batchSize;
            this.cGraph = math.keep(ops.scalar(-this.learningRate / batchSize));
        }
        this.variableNodes.forEach(function (node) { return _this.variableGradients.set(node.output, math.keep(tensor_1.Tensor.zeros(node.output.shape))); });
    };
    Optimizer.prototype.afterExample = function (math, runtime, activationArrayMap, gradientArrayMap) {
        var _this = this;
        globals_1.tidy(function () {
            _this.variableNodes.forEach(function (node) {
                var gradient = gradientArrayMap.get(node.output);
                var accumulatedGradient = _this.variableGradients.get(node.output);
                _this.variableGradients.set(node.output, globals_1.keep(math.add(gradient, accumulatedGradient)));
                accumulatedGradient.dispose();
            });
        });
    };
    Optimizer.prototype.dispose = function () {
        if (this.cGraph != null) {
            this.cGraph.dispose();
        }
        if (this.variableNodes != null) {
            this.variableNodes.forEach(function (node) {
                node.data.dispose();
            });
        }
        if (this.specifiedVariableNodes != null) {
            this.specifiedVariableNodes.forEach(function (node) {
                node.data.dispose();
            });
        }
    };
    __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Optimizers' })
    ], Optimizer.prototype, "minimize", null);
    Optimizer = __decorate([
        doc_1.doc({ heading: 'Training', subheading: 'Classes', namespace: 'train' })
    ], Optimizer);
    return Optimizer;
}());
exports.Optimizer = Optimizer;
