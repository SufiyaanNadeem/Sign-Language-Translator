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
var BatchNormOps = (function () {
    function BatchNormOps() {
    }
    BatchNormOps.batchNormalization2d = function (x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        util.assert(x.rank === 2, "Error in batchNormalization3D: x must be rank 3 but got rank " +
            (x.rank + "."));
        util.assert(mean.rank === 2 || mean.rank === 1, "Error in batchNormalization2D: mean must be rank 2 or rank 1 but " +
            ("got rank " + mean.rank + "."));
        util.assert(variance.rank === 2 || variance.rank === 1, "Error in batchNormalization2D: variance must be rank 2 or rank 1 " +
            ("but got rank " + variance.rank + "."));
        if (scale != null) {
            util.assert(scale.rank === 2 || scale.rank === 1, "Error in batchNormalization2D: scale must be rank 2 or rank 1 " +
                ("but got rank " + scale.rank + "."));
        }
        if (offset != null) {
            util.assert(offset.rank === 2 || offset.rank === 1, "Error in batchNormalization2D: offset must be rank 2 or rank 1 " +
                ("but got rank " + offset.rank + "."));
        }
        return BatchNormOps.batchNormalization(x, mean, variance, varianceEpsilon, scale, offset);
    };
    BatchNormOps.batchNormalization3d = function (x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        util.assert(x.rank === 3, "Error in batchNormalization3D: x must be rank 3 but got rank " +
            (x.rank + "."));
        util.assert(mean.rank === 3 || mean.rank === 1, "Error in batchNormalization3D: mean must be rank 3 or rank 1 but " +
            ("got rank " + mean.rank + "."));
        util.assert(variance.rank === 3 || variance.rank === 1, "Error in batchNormalization3D: variance must be rank 3 or rank 1 " +
            ("but got rank " + variance.rank + "."));
        if (scale != null) {
            util.assert(scale.rank === 3 || scale.rank === 1, "Error in batchNormalization3D: scale must be rank 3 or rank 1 " +
                ("but got rank " + scale.rank + "."));
        }
        if (offset != null) {
            util.assert(offset.rank === 3 || offset.rank === 1, "Error in batchNormalization3D: offset must be rank 3 or rank 1 " +
                ("but got rank " + offset.rank + "."));
        }
        return BatchNormOps.batchNormalization(x, mean, variance, varianceEpsilon, scale, offset);
    };
    BatchNormOps.batchNormalization4d = function (x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        util.assert(x.rank === 4, "Error in batchNormalization4D: x must be rank 4 but got rank " +
            (x.rank + "."));
        util.assert(mean.rank === 4 || mean.rank === 1, "Error in batchNormalization4D: mean must be rank 4 or rank 1 but " +
            ("got rank " + mean.rank + "."));
        util.assert(variance.rank === 4 || variance.rank === 1, "Error in batchNormalization4D: variance must be rank 4 or rank 1 " +
            ("but got rank " + variance.rank + "."));
        if (scale != null) {
            util.assert(scale.rank === 4 || scale.rank === 1, "Error in batchNormalization4D: scale must be rank 4 or rank 1 " +
                ("but got rank " + scale.rank + "."));
        }
        if (offset != null) {
            util.assert(offset.rank === 4 || offset.rank === 1, "Error in batchNormalization4D: offset must be rank 4 or rank 1 " +
                ("but got rank " + offset.rank + "."));
        }
        return BatchNormOps.batchNormalization(x, mean, variance, varianceEpsilon, scale, offset);
    };
    BatchNormOps.batchNormalization = function (x, mean, variance, varianceEpsilon, scale, offset) {
        if (varianceEpsilon === void 0) { varianceEpsilon = .001; }
        var x4D;
        if (x.rank === 0 || x.rank === 1) {
            x4D = x.as4D(1, 1, 1, x.size);
        }
        else if (x.rank === 2) {
            x4D = x.as4D(1, 1, x.shape[0], x.shape[1]);
        }
        else if (x.rank === 3) {
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        else {
            x4D = x;
        }
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.batchNormalization4D(x4D, batchnormReshape4D(mean), batchnormReshape4D(variance), varianceEpsilon, batchnormReshape4D(scale), batchnormReshape4D(offset)); }, { x: x, mean: mean, variance: variance });
        return res.reshape(x.shape);
    };
    __decorate([
        operation_1.operation
    ], BatchNormOps, "batchNormalization2d", null);
    __decorate([
        operation_1.operation
    ], BatchNormOps, "batchNormalization3d", null);
    __decorate([
        operation_1.operation
    ], BatchNormOps, "batchNormalization4d", null);
    __decorate([
        doc_1.doc({ heading: 'Operations', subheading: 'Normalization' })
    ], BatchNormOps, "batchNormalization", null);
    return BatchNormOps;
}());
exports.BatchNormOps = BatchNormOps;
function batchnormReshape4D(x) {
    if (x == null) {
        return null;
    }
    if (x.rank === 0) {
        return x.as1D();
    }
    else if (x.rank === 1) {
        return x;
    }
    else if (x.rank === 2) {
        return x.as4D(1, 1, x.shape[0], x.shape[1]);
    }
    else if (x.rank === 3) {
        return x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
    }
    return x;
}
