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
var util = require("../util");
var broadcast_util = require("./broadcast_util");
var operation_1 = require("./operation");
var ops_1 = require("./ops");
var BinaryOps = (function () {
    function BinaryOps() {
    }
    BinaryOps.add = function (a, b) {
        util.assertTypesMatch(a, b);
        var outShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape(a.shape);
            };
            var derB = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape(b.shape);
            };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.add(a, b); }, { a: a, b: b }, der);
    };
    BinaryOps.addStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in addStrict: ');
        return a.add(b);
    };
    BinaryOps.sub = function (a, b) {
        util.assertTypesMatch(a, b);
        var outShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.reshape(a.shape);
            };
            var derB = function () {
                var res = dy;
                var reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes);
                }
                return res.neg().reshape(b.shape);
            };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.subtract(a, b); }, { a: a, b: b }, der);
    };
    BinaryOps.subStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in subStrict: ');
        return a.sub(b);
    };
    BinaryOps.pow = function (base, exp) {
        broadcast_util.assertAndGetBroadcastShape(base.shape, exp.shape);
        var grad = function (dy) {
            if (!util.arraysEqual(base.shape, exp.shape) &&
                !util.isScalarShape(exp.shape)) {
                throw new Error("Gradient of pow not yet supported for broadcasted shapes.");
            }
            var derBase = function () {
                var expFloat = exp.toFloat();
                var dx = expFloat.mul(base.toFloat().pow(expFloat.sub(ops_1.scalar(1))));
                return dy.mulStrict(dx);
            };
            return { base: derBase };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.pow(base, exp); }, { base: base }, grad);
    };
    BinaryOps.powStrict = function (base, exp) {
        util.assertShapesMatch(base.shape, exp.shape, 'Error in powStrict: ');
        return base.pow(exp);
    };
    BinaryOps.mul = function (a, b) {
        util.assertTypesMatch(a, b);
        var outShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy.mul(b.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape(a.shape);
                }
                return res;
            };
            var derB = function () {
                var res = dy.mul(a.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape(b.shape);
                }
                return res;
            };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.multiply(a, b); }, { a: a, b: b }, der);
    };
    BinaryOps.mulStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in multiplyStrict: ');
        return a.mul(b);
    };
    BinaryOps.div = function (a, b) {
        var outShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy) {
            var derA = function () {
                var res = dy.div(b.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes(a.shape, outShape);
                if (reduceAxes.length > 0) {
                    return res.sum(reduceAxes).reshape(a.shape);
                }
                return res;
            };
            var derB = function () {
                var res = dy.mul(a.toFloat());
                var reduceAxes = broadcast_util.getReductionAxes(b.shape, outShape);
                if (reduceAxes.length > 0) {
                    res = res.sum(reduceAxes).reshape(b.shape);
                }
                var tmp = b.square();
                return res.div(tmp.toFloat()).neg();
            };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.divide(a, b); }, { a: a, b: b }, der);
    };
    BinaryOps.divStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in divideStrict: ');
        return a.div(b);
    };
    BinaryOps.minimum = function (a, b) {
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy) {
            var derA = function () { return dy.mul(a.lessEqual(b).toFloat()); };
            var derB = function () { return dy.mul(a.greater(b).toFloat()); };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.minimum(a, b); }, { a: a, b: b }, der);
    };
    BinaryOps.minimumStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in minimumStrict: ');
        return a.minimum(b);
    };
    BinaryOps.maximum = function (a, b) {
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var der = function (dy) {
            var derA = function () { return dy.mul(a.greaterEqual(b).toFloat()); };
            var derB = function () { return dy.mul(a.less(b).toFloat()); };
            return { a: derA, b: derB };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.maximum(a, b); }, { a: a, b: b }, der);
    };
    BinaryOps.maximumStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in minimumStrict: ');
        return a.maximum(b);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], BinaryOps, "add", null);
    __decorate([
        operation_1.operation
    ], BinaryOps, "addStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], BinaryOps, "sub", null);
    __decorate([
        operation_1.operation
    ], BinaryOps, "subStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], BinaryOps, "pow", null);
    __decorate([
        operation_1.operation
    ], BinaryOps, "powStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], BinaryOps, "mul", null);
    __decorate([
        operation_1.operation
    ], BinaryOps, "mulStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], BinaryOps, "div", null);
    __decorate([
        operation_1.operation
    ], BinaryOps, "divStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], BinaryOps, "minimum", null);
    __decorate([
        operation_1.operation
    ], BinaryOps, "minimumStrict", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Arithmetic' }),
        operation_1.operation
    ], BinaryOps, "maximum", null);
    __decorate([
        operation_1.operation
    ], BinaryOps, "maximumStrict", null);
    return BinaryOps;
}());
exports.BinaryOps = BinaryOps;
