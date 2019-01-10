"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("../doc");
var environment_1 = require("../environment");
var globals_1 = require("../globals");
var tensor_1 = require("../tensor");
var util = require("../util");
var axis_util = require("./axis_util");
var operation_1 = require("./operation");
var ops = require("./ops");
var ReductionOps = (function () {
    function ReductionOps() {
    }
    ReductionOps.logSumExp = function (input, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var axes = axis_util.parseAxisParam(axis, input.shape);
        var xMax = input.max(axes, true);
        var a = input.sub(xMax);
        var b = a.exp();
        var c = b.sum(axes);
        var d = c.log();
        var res = xMax.reshape(d.shape).add(d);
        if (keepDims) {
            var newShape = axis_util.expandShapeToKeepDim(res.shape, axes);
            return res.reshape(newShape);
        }
        return res;
    };
    ReductionOps.sum = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var axes = axis_util.parseAxisParam(axis, x.shape);
        var customOp = globals_1.customGrad(function (x) {
            var permutation = axis_util.getAxesPermutation(axes, x.rank);
            var reductionAxes = axes;
            var permutedX = x;
            if (permutation != null) {
                permutedX = x.transpose(permutation);
                reductionAxes =
                    axis_util.getInnerMostAxes(reductionAxes.length, x.rank);
            }
            var value = environment_1.ENV.engine.runKernel(function (backend) { return backend.sum(permutedX, reductionAxes); }, { permutedX: permutedX });
            if (keepDims) {
                var newShape = axis_util.expandShapeToKeepDim(value.shape, axes);
                value = value.reshape(newShape);
            }
            var gradFunc = function (dy) {
                var expandedDyShape = x.shape.slice();
                axes.forEach(function (axis) {
                    expandedDyShape[axis] = 1;
                });
                var expandedDy = dy.reshape(expandedDyShape);
                var derX = expandedDy.mul(tensor_1.Tensor.ones(x.shape, 'float32'));
                return derX;
            };
            return { value: value, gradFunc: gradFunc };
        });
        return customOp(x);
    };
    ReductionOps.mean = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var axes = axis_util.parseAxisParam(axis, x.shape);
        var shapes = axis_util.computeOutAndReduceShapes(x.shape, axes);
        var reduceShape = shapes[1];
        var reduceSize = util.sizeFromShape(reduceShape);
        var customOp = globals_1.customGrad(function (x) {
            var reduceSizeScalar = ops.scalar(reduceSize);
            var res = x.div(reduceSizeScalar);
            var value = res.sum(axis, keepDims);
            var gradFunc = function (dy) {
                var expandedDyShape = x.shape.slice();
                axes.forEach(function (axis) {
                    expandedDyShape[axis] = 1;
                });
                var expandedDy = dy.reshape(expandedDyShape);
                var derX = expandedDy.mul(tensor_1.Tensor.ones(x.shape, 'float32'))
                    .div(reduceSizeScalar);
                return derX;
            };
            return { value: value, gradFunc: gradFunc };
        });
        return customOp(x);
    };
    ReductionOps.min = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var origAxes = axis_util.parseAxisParam(axis, x.shape);
        var axes = origAxes;
        var permutedAxes = axis_util.getAxesPermutation(axes, x.rank);
        if (permutedAxes != null) {
            x = x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, x.rank);
        }
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.min(x, axes); }, { x: x });
        if (keepDims) {
            var newShape = axis_util.expandShapeToKeepDim(res.shape, origAxes);
            return res.reshape(newShape);
        }
        return res;
    };
    ReductionOps.max = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var origAxes = axis_util.parseAxisParam(axis, x.shape);
        var axes = origAxes;
        var permutedAxes = axis_util.getAxesPermutation(axes, x.rank);
        if (permutedAxes != null) {
            x = x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, x.rank);
        }
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.max(x, axes); }, { x: x });
        if (keepDims) {
            var newShape = axis_util.expandShapeToKeepDim(res.shape, origAxes);
            return res.reshape(newShape);
        }
        return res;
    };
    ReductionOps.argMin = function (x, axis) {
        if (axis === void 0) { axis = null; }
        var axes = axis_util.parseAxisParam(axis, x.shape);
        var permutedAxes = axis_util.getAxesPermutation(axes, x.rank);
        if (permutedAxes != null) {
            x = x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, x.rank);
        }
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.argMin(x, axes); }, { x: x });
    };
    ReductionOps.argMax = function (x, axis) {
        if (axis === void 0) { axis = null; }
        var axes = axis_util.parseAxisParam(axis, x.shape);
        var permutedAxes = axis_util.getAxesPermutation(axes, x.rank);
        if (permutedAxes != null) {
            x = x.transpose(permutedAxes);
            axes = axis_util.getInnerMostAxes(axes.length, x.rank);
        }
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.argMax(x, axes); }, { x: x });
    };
    ReductionOps.moments = function (x, axis, keepDims) {
        if (axis === void 0) { axis = null; }
        if (keepDims === void 0) { keepDims = false; }
        var axes = axis_util.parseAxisParam(axis, x.shape);
        var mean = x.mean(axes, keepDims);
        var keepDimsShape = mean.shape;
        if (!keepDims) {
            keepDimsShape = axis_util.expandShapeToKeepDim(mean.shape, axes);
        }
        var devSquared = x.toFloat().sub(mean.reshape(keepDimsShape)).square();
        var variance = devSquared.mean(axes, keepDims);
        return { mean: mean, variance: variance };
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation_1.operation
    ], ReductionOps, "logSumExp", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation_1.operation
    ], ReductionOps, "sum", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation_1.operation
    ], ReductionOps, "mean", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation_1.operation
    ], ReductionOps, "min", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation_1.operation
    ], ReductionOps, "max", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation_1.operation
    ], ReductionOps, "argMin", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Reduction' }),
        operation_1.operation
    ], ReductionOps, "argMax", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Normalization' }),
        operation_1.operation
    ], ReductionOps, "moments", null);
    return ReductionOps;
}());
exports.ReductionOps = ReductionOps;
