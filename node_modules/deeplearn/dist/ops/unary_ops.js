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
var operation_1 = require("./operation");
var ops = require("./ops");
var ops_1 = require("./ops");
var selu_util = require("./selu_util");
var UnaryOps = (function () {
    function UnaryOps() {
    }
    UnaryOps.neg = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.neg(); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.neg(x); }, { x: x }, grad);
    };
    UnaryOps.ceil = function (x) {
        var grad = function (dy) {
            return { x: function () { return ops.zerosLike(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.ceil(x); }, { x: x }, grad);
    };
    UnaryOps.floor = function (x) {
        var grad = function (dy) {
            return { x: function () { return ops.zerosLike(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.floor(x); }, { x: x }, grad);
    };
    UnaryOps.exp = function (x) {
        var bck = function (dy, saved) {
            var y = saved[0];
            return { x: function () { return dy.mulStrict(y); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend, save) { return save(backend.exp(x)); }, { x: x }, bck);
    };
    UnaryOps.log = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.divStrict(x.toFloat()); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.log(x); }, { x: x }, grad);
    };
    UnaryOps.sqrt = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.divStrict(x.toFloat().sqrt().mul(ops.scalar(2))); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.sqrt(x); }, { x: x }, grad);
    };
    UnaryOps.square = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.mulStrict(x.toFloat().mul(ops.scalar(2))); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.square(x); }, { x: x }, grad);
    };
    UnaryOps.abs = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.mulStrict(x.toFloat().step(-1)); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.abs(x); }, { x: x }, grad);
    };
    UnaryOps.clipByValue = function (x, clipValueMin, clipValueMax) {
        util.assert((clipValueMin <= clipValueMax), "Error in clip: min (" + clipValueMin + ") must be" +
            ("less than or equal to max (" + clipValueMax + ")."));
        var grad = function (dy) {
            return {
                x: function () { return dy.where(x.greater(ops.scalar(clipValueMin))
                    .logicalAnd(x.less(ops.scalar(clipValueMax))), ops_1.zerosLike(dy)); },
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.clip(x, clipValueMin, clipValueMax); }, { x: x }, grad);
    };
    UnaryOps.relu = function (x) {
        var grad = function (dy) {
            var stepRes = x.step();
            return { x: function () { return dy.mulStrict(stepRes.toFloat()); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.relu(x); }, { x: x }, grad);
    };
    UnaryOps.elu = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.mulStrict(eluDer(x)); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.elu(x); }, { x: x }, grad);
    };
    UnaryOps.selu = function (x) {
        var grad = function (dy) {
            return {
                x: function () {
                    var mask = x.greater(ops.scalar(0));
                    var scaleAlpha = ops.scalar(selu_util.SELU_SCALEALPHA);
                    var scale = ops.scalar(selu_util.SELU_SCALE);
                    var greaterThanZeroDer = dy.mul(scale);
                    var lessEqualZeroDer = dy.mul(scaleAlpha).mul(x.toFloat().exp());
                    return ops.where(mask, greaterThanZeroDer, lessEqualZeroDer);
                }
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.selu(x); }, { x: x }, grad);
    };
    UnaryOps.leakyRelu = function (x, alpha) {
        if (alpha === void 0) { alpha = 0.2; }
        var grad = function (dy) {
            return { x: function () { return dy.mulStrict(x.step(alpha)); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.leakyRelu(x, alpha); }, { x: x }, grad);
    };
    UnaryOps.prelu = function (x, alpha) {
        var grad = function (dy) {
            return { x: function () { return dy.mulStrict(preluDer(x, alpha)); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.prelu(x, alpha); }, { x: x }, grad);
    };
    UnaryOps.sigmoid = function (x) {
        var grad = function (dy, saved) {
            var y = saved[0];
            return { x: function () { return dy.mulStrict(y.mul(ops.scalar(1).sub(y))); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend, save) { return save(backend.sigmoid(x)); }, { x: x }, grad);
    };
    UnaryOps.sin = function (x) {
        var grad = function (dy) {
            return { x: function () { return x.toFloat().cos().mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.sin(x); }, { x: x }, grad);
    };
    UnaryOps.cos = function (x) {
        var grad = function (dy) {
            return { x: function () { return x.toFloat().sin().neg().mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.cos(x); }, { x: x }, grad);
    };
    UnaryOps.tan = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.divStrict(x.cos().square()); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.tan(x); }, { x: x }, grad);
    };
    UnaryOps.asin = function (x) {
        var grad = function (dy) {
            return {
                x: function () {
                    return dy.divStrict(UnaryOps.sqrt(ops.scalar(1).sub(x.toFloat().square())));
                }
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.asin(x); }, { x: x }, grad);
    };
    UnaryOps.acos = function (x) {
        var grad = function (dy) {
            return {
                x: function () {
                    return dy.divStrict(UnaryOps.sqrt(ops.scalar(1).sub(x.toFloat().square())))
                        .neg();
                }
            };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.acos(x); }, { x: x }, grad);
    };
    UnaryOps.atan = function (x) {
        var grad = function (dy) {
            return { x: function () { return dy.divStrict(ops.scalar(1).add(x.toFloat().square())); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.atan(x); }, { x: x }, grad);
    };
    UnaryOps.sinh = function (x) {
        var grad = function (dy) {
            return { x: function () { return x.toFloat().cosh().mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.sinh(x); }, { x: x }, grad);
    };
    UnaryOps.cosh = function (x) {
        var grad = function (dy) {
            return { x: function () { return x.toFloat().sinh().mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.cosh(x); }, { x: x }, grad);
    };
    UnaryOps.tanh = function (x) {
        var grad = function (dy, saved) {
            var y = saved[0];
            return { x: function () { return ops.scalar(1).sub(y.square()).mulStrict(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend, save) { return save(backend.tanh(x)); }, { x: x }, grad);
    };
    UnaryOps.step = function (x, alpha) {
        if (alpha === void 0) { alpha = 0.0; }
        var grad = function (dy) {
            return { x: function () { return ops.zerosLike(dy); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.step(x, alpha); }, { x: x }, grad);
    };
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "neg", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "ceil", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "floor", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "exp", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "log", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "sqrt", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "square", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "abs", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "clipByValue", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "relu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "elu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "selu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "leakyRelu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "prelu", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "sigmoid", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "sin", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "cos", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "tan", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "asin", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "acos", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "atan", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "sinh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "cosh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "tanh", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Basic math' }),
        operation_1.operation
    ], UnaryOps, "step", null);
    return UnaryOps;
}());
exports.UnaryOps = UnaryOps;
function preluDer(x, alpha) {
    return environment_1.ENV.engine.runKernel(function (backend) { return backend.preluDer(x, alpha); }, { x: x, alpha: alpha });
}
function eluDer(x) {
    return environment_1.ENV.engine.runKernel(function (backend) { return backend.eluDer(x); }, { x: x });
}
