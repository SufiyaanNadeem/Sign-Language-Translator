"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
var array_ops_1 = require("./ops/array_ops");
var batchnorm_1 = require("./ops/batchnorm");
var binary_ops_1 = require("./ops/binary_ops");
var compare_1 = require("./ops/compare");
var conv_1 = require("./ops/conv");
var image_ops_1 = require("./ops/image_ops");
var logical_ops_1 = require("./ops/logical_ops");
var lrn_1 = require("./ops/lrn");
var lstm_1 = require("./ops/lstm");
var matmul_1 = require("./ops/matmul");
var norm_1 = require("./ops/norm");
var ops = require("./ops/ops");
var pool_1 = require("./ops/pool");
var reduction_ops_1 = require("./ops/reduction_ops");
var reverse_1 = require("./ops/reverse");
var slice_1 = require("./ops/slice");
var softmax_1 = require("./ops/softmax");
var transpose_1 = require("./ops/transpose");
var unary_ops_1 = require("./ops/unary_ops");
var tracking_1 = require("./tracking");
var util = require("./util");
var tidy = tracking_1.Tracking.tidy;
var keep = tracking_1.Tracking.keep;
var NDArrayMath = (function () {
    function NDArrayMath(backend, safeMode) {
        this.matMul = matmul_1.MatmulOps.matMul;
        this.vectorTimesMatrix = matmul_1.MatmulOps.vectorTimesMatrix;
        this.outerProduct = matmul_1.MatmulOps.outerProduct;
        this.matrixTimesVector = matmul_1.MatmulOps.matrixTimesVector;
        this.dotProduct = matmul_1.MatmulOps.dotProduct;
        this.slice = slice_1.SliceOps.slice;
        this.slice1D = slice_1.SliceOps.slice1d;
        this.slice2D = slice_1.SliceOps.slice2d;
        this.slice3D = slice_1.SliceOps.slice3d;
        this.slice4D = slice_1.SliceOps.slice4d;
        this.reverse = reverse_1.ReverseOps.reverse;
        this.reverse1D = reverse_1.ReverseOps.reverse1d;
        this.reverse2D = reverse_1.ReverseOps.reverse2d;
        this.reverse3D = reverse_1.ReverseOps.reverse3d;
        this.reverse4D = reverse_1.ReverseOps.reverse4d;
        this.batchNormalization = batchnorm_1.BatchNormOps.batchNormalization;
        this.batchNormalization2D = batchnorm_1.BatchNormOps.batchNormalization2d;
        this.batchNormalization3D = batchnorm_1.BatchNormOps.batchNormalization3d;
        this.batchNormalization4D = batchnorm_1.BatchNormOps.batchNormalization4d;
        this.avgPool = pool_1.PoolOps.avgPool;
        this.maxPool = pool_1.PoolOps.maxPool;
        this.minPool = pool_1.PoolOps.minPool;
        this.maxPoolBackprop = pool_1.PoolOps.maxPoolBackprop;
        this.conv2dTranspose = conv_1.ConvOps.conv2dTranspose;
        this.depthwiseConv2D = conv_1.ConvOps.depthwiseConv2d;
        this.conv2dDerFilter = conv_1.ConvOps.conv2dDerFilter;
        this.conv2dDerInput = conv_1.ConvOps.conv2dDerInput;
        this.argMax = reduction_ops_1.ReductionOps.argMax;
        this.argMin = reduction_ops_1.ReductionOps.argMin;
        this.logSumExp = reduction_ops_1.ReductionOps.logSumExp;
        this.max = reduction_ops_1.ReductionOps.max;
        this.mean = reduction_ops_1.ReductionOps.mean;
        this.min = reduction_ops_1.ReductionOps.min;
        this.moments = reduction_ops_1.ReductionOps.moments;
        this.sum = reduction_ops_1.ReductionOps.sum;
        this.add = binary_ops_1.BinaryOps.add;
        this.addStrict = binary_ops_1.BinaryOps.addStrict;
        this.div = binary_ops_1.BinaryOps.div;
        this.divide = this.div;
        this.divStrict = binary_ops_1.BinaryOps.divStrict;
        this.divideStrict = this.divStrict;
        this.maximum = binary_ops_1.BinaryOps.maximum;
        this.maximumStrict = binary_ops_1.BinaryOps.maximumStrict;
        this.minimum = binary_ops_1.BinaryOps.minimum;
        this.minimumStrict = binary_ops_1.BinaryOps.minimumStrict;
        this.mul = binary_ops_1.BinaryOps.mul;
        this.multiply = this.mul;
        this.mulStrict = binary_ops_1.BinaryOps.mulStrict;
        this.multiplyStrict = this.mulStrict;
        this.pow = binary_ops_1.BinaryOps.pow;
        this.powStrict = binary_ops_1.BinaryOps.powStrict;
        this.sub = binary_ops_1.BinaryOps.sub;
        this.subtract = this.sub;
        this.subStrict = binary_ops_1.BinaryOps.subStrict;
        this.logicalNot = logical_ops_1.LogicalOps.logicalNot;
        this.logicalAnd = logical_ops_1.LogicalOps.logicalAnd;
        this.logicalOr = logical_ops_1.LogicalOps.logicalOr;
        this.logicalXor = logical_ops_1.LogicalOps.logicalXor;
        this.where = logical_ops_1.LogicalOps.where;
        this.transpose = transpose_1.TransposeOps.transpose;
        this.equal = compare_1.CompareOps.equal;
        this.equalStrict = compare_1.CompareOps.equalStrict;
        this.greater = compare_1.CompareOps.greater;
        this.greaterStrict = compare_1.CompareOps.greaterStrict;
        this.greaterEqual = compare_1.CompareOps.greaterEqual;
        this.greaterEqualStrict = compare_1.CompareOps.greaterEqualStrict;
        this.less = compare_1.CompareOps.less;
        this.lessStrict = compare_1.CompareOps.lessStrict;
        this.lessEqual = compare_1.CompareOps.lessEqual;
        this.lessEqualStrict = compare_1.CompareOps.lessEqualStrict;
        this.notEqual = compare_1.CompareOps.notEqual;
        this.notEqualStrict = compare_1.CompareOps.notEqualStrict;
        this.abs = unary_ops_1.UnaryOps.abs;
        this.acos = unary_ops_1.UnaryOps.acos;
        this.asin = unary_ops_1.UnaryOps.asin;
        this.atan = unary_ops_1.UnaryOps.atan;
        this.ceil = unary_ops_1.UnaryOps.ceil;
        this.clip = unary_ops_1.UnaryOps.clipByValue;
        this.cos = unary_ops_1.UnaryOps.cos;
        this.cosh = unary_ops_1.UnaryOps.cosh;
        this.elu = unary_ops_1.UnaryOps.elu;
        this.exp = unary_ops_1.UnaryOps.exp;
        this.floor = unary_ops_1.UnaryOps.floor;
        this.leakyRelu = unary_ops_1.UnaryOps.leakyRelu;
        this.log = unary_ops_1.UnaryOps.log;
        this.neg = unary_ops_1.UnaryOps.neg;
        this.prelu = unary_ops_1.UnaryOps.prelu;
        this.relu = unary_ops_1.UnaryOps.relu;
        this.selu = unary_ops_1.UnaryOps.selu;
        this.sigmoid = unary_ops_1.UnaryOps.sigmoid;
        this.sin = unary_ops_1.UnaryOps.sin;
        this.sinh = unary_ops_1.UnaryOps.sinh;
        this.sqrt = unary_ops_1.UnaryOps.sqrt;
        this.square = unary_ops_1.UnaryOps.square;
        this.step = unary_ops_1.UnaryOps.step;
        this.tan = unary_ops_1.UnaryOps.tan;
        this.tanh = unary_ops_1.UnaryOps.tanh;
        this.norm = norm_1.NormOps.norm;
        this.basicLSTMCell = lstm_1.LSTMOps.basicLSTMCell;
        this.multiRNNCell = lstm_1.LSTMOps.multiRNNCell;
        this.softmax = softmax_1.SoftmaxOps.softmax;
        this.softmaxCrossEntropy = softmax_1.SoftmaxOps.softmaxCrossEntropy;
        this.cast = array_ops_1.ArrayOps.cast;
        this.clone = array_ops_1.ArrayOps.clone;
        this.gather = array_ops_1.ArrayOps.gather;
        this.reshape = array_ops_1.ArrayOps.reshape;
        this.tile = array_ops_1.ArrayOps.tile;
        this.oneHot = array_ops_1.ArrayOps.oneHot;
        this.multinomial = array_ops_1.ArrayOps.multinomial;
        this.pad1D = array_ops_1.ArrayOps.pad1d;
        this.pad2D = array_ops_1.ArrayOps.pad2d;
        this.resizeBilinear3D = image_ops_1.ImageOps.resizeBilinear;
        this.localResponseNormalization3D = lrn_1.LRNOps.localResponseNormalization;
        this.localResponseNormalization4D = lrn_1.LRNOps.localResponseNormalization;
        this.keep = tracking_1.Tracking.keep;
        environment_1.ENV.setMath(this, backend, safeMode);
        this.engine = environment_1.ENV.engine;
        this.dispose = environment_1.ENV.engine.dispose.bind(environment_1.ENV.engine);
        this.registeredVariables = environment_1.ENV.engine.registeredVariables;
        this.startScope = environment_1.ENV.engine.startScope.bind(environment_1.ENV.engine);
        this.endScope = environment_1.ENV.engine.endScope.bind(environment_1.ENV.engine);
    }
    NDArrayMath.prototype.scope = function (scopeFn) {
        var keepFn = function (tensor) { return keep(tensor); };
        var trackFn = function (tensor) { return tensor; };
        return tidy(function () { return scopeFn(keepFn, trackFn); });
    };
    NDArrayMath.prototype.track = function (result) {
        return result;
    };
    NDArrayMath.prototype.topK = function (x, k) {
        util.assert(k <= x.size, "Error in topK: k value (" + k + ") must be less than size of input " +
            ("tensor, got shape " + x.shape + "."));
        var values;
        var indices;
        tidy('topK', function () {
            values = environment_1.ENV.engine.runKernel(function (backend) { return backend.topKValues(x, k); }, { x: x });
            indices = environment_1.ENV.engine.runKernel(function (backend) { return backend.topKIndices(x, k); }, { x: x });
            return values;
        });
        var result = { values: values, indices: indices };
        return result;
    };
    NDArrayMath.prototype.elementWiseMul = function (a, b) {
        return a.mulStrict(b);
    };
    NDArrayMath.prototype.scalarDividedByArray = function (c, a) {
        util.assert(c.size === 1, "Error in scalarDividedByArray: first argument must be rank 0, but " +
            ("got Tensor of rank " + c.rank + "."));
        return c.div(a);
    };
    NDArrayMath.prototype.arrayDividedByScalar = function (a, c) {
        util.assert(c.size === 1, "Error in arrayDividedByScalar: second argument must be rank 0, " +
            ("but got Tensor of rank " + c.rank + "."));
        return a.div(c);
    };
    NDArrayMath.prototype.switchDim = function (x, perm) {
        return ops.transpose(x, perm);
    };
    NDArrayMath.prototype.scalarPlusArray = function (c, a) {
        util.assert(c.size === 1, "Error in scalarPlusArray: first argument must be rank 0, but got " +
            ("rank " + c.rank + "."));
        return this.add(c, a);
    };
    NDArrayMath.prototype.scalarMinusArray = function (c, a) {
        util.assert(c.size === 1, "Error in scalarMinusArray: first argument must be rank 0, but got " +
            ("rank " + c.rank + "."));
        return this.subtract(c, a);
    };
    NDArrayMath.prototype.arrayMinusScalar = function (a, c) {
        util.assert(c.size === 1, "Error in arrayMinusScalar: second argument must be rank 0, but " +
            ("got rank " + c.rank + "."));
        return this.subtract(a, c);
    };
    NDArrayMath.prototype.scaledArrayAdd = function (c1, a, c2, b) {
        var _this = this;
        util.assert(c1.size === 1, "Error in scaledArrayAdd: first argument must rank 0, but got " +
            (" rank " + c1.rank + "."));
        util.assert(c2.size === 1, "Error in scaledArrayAdd: third argument must be rank 0, but got " +
            ("Tensor of rank " + c2.rank + "."));
        util.assertShapesMatch(a.shape, b.shape, 'Error in scaledArrayAdd: ');
        return tidy('scaledArrayAdd', function () {
            return _this.add(_this.multiply(c1, a), _this.multiply(c2, b));
        });
    };
    NDArrayMath.prototype.scalarTimesArray = function (c, a) {
        util.assert(c.size === 1, "Error in arrayDividedByScalar: first argument must be rank 0, but " +
            ("got rank " + c.rank + "."));
        return this.multiply(c, a);
    };
    NDArrayMath.prototype.concat = function (a, b, axis) {
        return ops.concat([a, b], axis);
    };
    NDArrayMath.prototype.concat1D = function (a, b) {
        return ops.concat1d([a, b]);
    };
    NDArrayMath.prototype.concat2D = function (a, b, axis) {
        return ops.concat2d([a, b], axis);
    };
    NDArrayMath.prototype.concat3D = function (a, b, axis) {
        return ops.concat3d([a, b], axis);
    };
    NDArrayMath.prototype.concat4D = function (a, b, axis) {
        return ops.concat4d([a, b], axis);
    };
    NDArrayMath.prototype.conv1d = function (input, filter, bias, stride, pad, dimRoundingMode) {
        if (bias != null) {
            util.assert(bias.rank === 1, "Error in conv1d: bias must be rank 1, but got rank " +
                (bias.rank + "."));
        }
        var res = ops.conv1d(input, filter, stride, pad, dimRoundingMode);
        return res.add(bias);
    };
    NDArrayMath.prototype.conv2d = function (x, filter, bias, strides, pad, dimRoundingMode) {
        if (bias != null) {
            util.assert(bias.rank === 1, "Error in conv2d: bias must be rank 1, but got rank " +
                (bias.rank + "."));
        }
        var res = ops.conv2d(x, filter, strides, pad, dimRoundingMode);
        return res.add(bias);
    };
    NDArrayMath.prototype.argMaxEquals = function (x1, x2) {
        util.assertShapesMatch(x1.shape, x2.shape, 'Error in argMaxEquals: ');
        return x1.argMax().equal(x2.argMax());
    };
    return NDArrayMath;
}());
exports.NDArrayMath = NDArrayMath;
