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
var tensor_1 = require("../tensor");
var tensor_util = require("../tensor_util");
var util = require("../util");
var axis_util_1 = require("./axis_util");
var concat_1 = require("./concat");
var operation_1 = require("./operation");
var rand_1 = require("./rand");
var ArrayOps = (function () {
    function ArrayOps() {
    }
    ArrayOps.tensor = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (shape != null && inferredShape.length !== 1) {
            util.assertShapesMatch(shape, inferredShape, "Error creating a new Tensor. " +
                ("Inferred shape (" + inferredShape + ") does not match the ") +
                ("provided shape (" + shape + "). "));
        }
        if (!util.isTypedArray(values) && !Array.isArray(values)) {
            values = [values];
        }
        shape = shape || inferredShape;
        return tensor_1.Tensor.make(shape, { values: toTypedArray(values, dtype) }, dtype);
    };
    ArrayOps.scalar = function (value, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        if (util.isTypedArray(value) || Array.isArray(value)) {
            throw new Error('Error creating a new Scalar: value must be a primitive ' +
                '(number|boolean)');
        }
        return ArrayOps.tensor(value, [], dtype);
    };
    ArrayOps.tensor1d = function (values, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 1) {
            throw new Error('Error creating a new Tensor1D: values must be a flat/TypedArray');
        }
        return ArrayOps.tensor(values, inferredShape, dtype);
    };
    ArrayOps.tensor2d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 2 && inferredShape.length !== 1) {
            throw new Error('Error creating a new Tensor2D: values must be number[][] ' +
                'or flat/TypedArray');
        }
        shape = shape || inferredShape;
        return ArrayOps.tensor(values, shape, dtype);
    };
    ArrayOps.tensor3d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 3 && inferredShape.length !== 1) {
            throw new Error('Error creating a new Tensor3D: values must be number[][][]' +
                'or flat/TypedArray');
        }
        shape = shape || inferredShape;
        return ArrayOps.tensor(values, shape, dtype);
    };
    ArrayOps.tensor4d = function (values, shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var inferredShape = util.inferShape(values);
        if (inferredShape.length !== 4 && inferredShape.length !== 1) {
            throw new Error('Error creating a new Tensor4D: values must be number[][][][]' +
                'or flat/TypedArray');
        }
        shape = shape || inferredShape;
        return ArrayOps.tensor(values, shape, dtype);
    };
    ArrayOps.ones = function (shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = makeOnesTypedArray(util.sizeFromShape(shape), dtype);
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    ArrayOps.zeros = function (shape, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = makeZerosTypedArray(util.sizeFromShape(shape), dtype);
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    ArrayOps.fill = function (shape, value, dtype) {
        if (dtype === void 0) { dtype = 'float32'; }
        var values = util.getTypedArrayFromDType(dtype, util.sizeFromShape(shape));
        values.fill(value);
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    ArrayOps.onesLike = function (x) {
        return ArrayOps.ones(x.shape, x.dtype);
    };
    ArrayOps.zerosLike = function (x) {
        return ArrayOps.zeros(x.shape, x.dtype);
    };
    ArrayOps.clone = function (x) {
        return tensor_1.Tensor.make(x.shape, { dataId: x.dataId }, x.dtype);
    };
    ArrayOps.randomNormal = function (shape, mean, stdDev, dtype, seed) {
        if (mean === void 0) { mean = 0; }
        if (stdDev === void 0) { stdDev = 1; }
        if (dtype != null && dtype === 'bool') {
            throw new Error("Unsupported data type " + dtype);
        }
        var randGauss = new rand_1.MPRandGauss(mean, stdDev, dtype, false, seed);
        return tensor_1.Tensor.rand(shape, function () { return randGauss.nextValue(); }, dtype);
    };
    ArrayOps.truncatedNormal = function (shape, mean, stdDev, dtype, seed) {
        if (mean === void 0) { mean = 0; }
        if (stdDev === void 0) { stdDev = 1; }
        if (dtype != null && dtype === 'bool') {
            throw new Error("Unsupported data type " + dtype);
        }
        var randGauss = new rand_1.MPRandGauss(mean, stdDev, dtype, true, seed);
        return tensor_1.Tensor.rand(shape, function () { return randGauss.nextValue(); }, dtype);
    };
    ArrayOps.randomUniform = function (shape, minval, maxval, dtype) {
        if (minval === void 0) { minval = 0; }
        if (maxval === void 0) { maxval = 1; }
        if (dtype === void 0) { dtype = 'float32'; }
        return tensor_1.Tensor.rand(shape, function () { return util.randUniform(minval, maxval); }, dtype);
    };
    ArrayOps.rand = function (shape, randFunction, dtype) {
        var size = util.sizeFromShape(shape);
        var values = null;
        if (dtype == null || dtype === 'float32') {
            values = new Float32Array(size);
        }
        else if (dtype === 'int32') {
            values = new Int32Array(size);
        }
        else if (dtype === 'bool') {
            values = new Uint8Array(size);
        }
        else {
            throw new Error("Unknown data type " + dtype);
        }
        for (var i = 0; i < size; i++) {
            values[i] = randFunction();
        }
        return tensor_1.Tensor.make(shape, { values: values }, dtype);
    };
    ArrayOps.multinomial = function (probabilities, numSamples, seed) {
        var numOutcomes = probabilities.size;
        var origRank = probabilities.rank;
        if (numOutcomes < 2) {
            throw new Error("Error in multinomial: you need at least 2 outcomes, but got " +
                (numOutcomes + "."));
        }
        if (origRank > 2) {
            throw new Error("Rank of probabilities must be 1 or 2, but is " + origRank);
        }
        seed = seed || Math.random();
        var prob2D = origRank === 1 ? probabilities.as2D(1, -1) : probabilities;
        var res = environment_1.ENV.engine.runKernel(function (backend) { return backend.multinomial(prob2D, numSamples, seed); }, { prob2D: prob2D });
        return origRank === 1 ? res.as1D() : res;
    };
    ArrayOps.oneHot = function (indices, depth, onValue, offValue) {
        if (onValue === void 0) { onValue = 1; }
        if (offValue === void 0) { offValue = 0; }
        if (depth < 2) {
            throw new Error("Error in oneHot: depth must be >=2, but it is " + depth);
        }
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.oneHot(indices, depth, onValue, offValue); }, { indices: indices });
    };
    ArrayOps.fromPixels = function (pixels, numChannels) {
        if (numChannels === void 0) { numChannels = 3; }
        if (numChannels > 4) {
            throw new Error('Cannot construct Tensor with more than 4 channels from pixels.');
        }
        return environment_1.ENV.engine.fromPixels(pixels, numChannels);
    };
    ArrayOps.reshape = function (x, shape) {
        shape = util.inferFromImplicitShape(shape, x.size);
        util.assert(x.size === util.sizeFromShape(shape), 'new shape and old shape must have the same number of elements.');
        var grad = function (dy) {
            return { x: function () { return dy.reshape(x.shape); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return tensor_1.Tensor.make(shape, { dataId: x.dataId }, x.dtype); }, { x: x }, grad);
    };
    ArrayOps.squeeze = function (x, axis) {
        return ArrayOps.reshape(x, util.squeezeShape(x.shape, axis).newShape);
    };
    ArrayOps.cast = function (x, dtype) {
        var forw = function (backend) {
            if (!util.hasEncodingLoss(x.dtype, dtype)) {
                return tensor_1.Tensor.make(x.shape, { dataId: x.dataId }, dtype);
            }
            if (dtype === 'int32') {
                return backend.int(x);
            }
            else if (dtype === 'bool') {
                return backend.notEqual(x, ArrayOps.scalar(0, x.dtype));
            }
            else {
                throw new Error("Error in Cast: unknown dtype argument (" + dtype + ")");
            }
        };
        var grad = function (dy) {
            return { x: function () { return dy.clone(); } };
        };
        return environment_1.ENV.engine.runKernel(forw, { x: x }, grad);
    };
    ArrayOps.tile = function (x, reps) {
        util.assert(x.rank === reps.length, "Error in transpose: rank of input " + x.rank + " " +
            ("must match length of reps " + reps + "."));
        var grad = function (dy) {
            var derX = function () {
                var xGrad = ArrayOps.zerosLike(x);
                if (x.rank === 1) {
                    for (var i = 0; i < reps[0]; ++i) {
                        xGrad = xGrad.add(dy.slice([i * x.shape[0]], [x.shape[0]]));
                    }
                }
                else if (x.rank === 2) {
                    for (var i = 0; i < reps[0]; ++i) {
                        for (var j = 0; j < reps[1]; ++j) {
                            xGrad = xGrad.add(dy.slice([i * x.shape[0], j * x.shape[1]], [x.shape[0], x.shape[1]]));
                        }
                    }
                }
                else if (x.rank === 3) {
                    for (var i = 0; i < reps[0]; ++i) {
                        for (var j = 0; j < reps[1]; ++j) {
                            for (var k = 0; k < reps[2]; ++k) {
                                xGrad = xGrad.add(dy.slice([i * x.shape[0], j * x.shape[1], k * x.shape[2]], [x.shape[0], x.shape[1], x.shape[2]]));
                            }
                        }
                    }
                }
                else if (x.rank === 4) {
                    for (var i = 0; i < reps[0]; ++i) {
                        for (var j = 0; j < reps[1]; ++j) {
                            for (var k = 0; k < reps[2]; ++k) {
                                for (var l = 0; l < reps[3]; ++l) {
                                    xGrad = xGrad.add(dy.slice([i * x.shape[0], j * x.shape[1], k * x.shape[2],
                                        l * x.shape[3]], [x.shape[0], x.shape[1], x.shape[2], x.shape[3]]));
                                }
                            }
                        }
                    }
                }
                else {
                    throw new Error("Gradient for tile operation is not implemented for rank-" +
                        (x.rank + " tensors yet."));
                }
                return xGrad;
            };
            return { x: derX };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.tile(x, reps); }, { x: x }, grad);
    };
    ArrayOps.gather = function (x, indices, axis) {
        if (axis === void 0) { axis = 0; }
        var axes = axis_util_1.parseAxisParam(axis, x.shape);
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.gather(x, indices, axes[0]); }, { x: x, indices: indices });
    };
    ArrayOps.pad1d = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        util.assert(paddings.length === 2, 'Invalid number of paddings. Must be length of 2.');
        return ArrayOps.pad(x, [paddings], constantValue);
    };
    ArrayOps.pad2d = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        util.assert(paddings.length === 2 && paddings[0].length === 2 &&
            paddings[1].length === 2, 'Invalid number of paddings. Must be length of 2 each.');
        return ArrayOps.pad(x, paddings, constantValue);
    };
    ArrayOps.pad3d = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        util.assert(paddings.length === 3 && paddings[0].length === 2 &&
            paddings[1].length === 2 && paddings[2].length === 2, 'Invalid number of paddings. Must be length of 2 each.');
        return ArrayOps.pad(x, paddings, constantValue);
    };
    ArrayOps.pad4d = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        util.assert(paddings.length === 4 && paddings[0].length === 2 &&
            paddings[1].length === 2 && paddings[2].length === 2 &&
            paddings[3].length === 2, 'Invalid number of paddings. Must be length of 2 each.');
        return ArrayOps.pad(x, paddings, constantValue);
    };
    ArrayOps.pad = function (x, paddings, constantValue) {
        if (constantValue === void 0) { constantValue = 0; }
        if (x.rank === 0) {
            throw new Error('pad(scalar) is not defined. Pass non-scalar to pad');
        }
        var begin = paddings.map(function (p) { return p[0]; });
        var grad = function (dy) {
            return { x: function () { return dy.slice(begin, x.shape); } };
        };
        return environment_1.ENV.engine.runKernel(function (backend) { return backend.pad(x, paddings, constantValue); }, { x: x }, grad);
    };
    ArrayOps.stack = function (tensors, axis) {
        if (axis === void 0) { axis = 0; }
        util.assert(tensors.length >= 2, 'Pass at least two tensors to dl.stack');
        var rank = tensors[0].rank;
        var shape = tensors[0].shape;
        var dtype = tensors[0].dtype;
        util.assert(axis <= rank, 'Axis must be <= rank of the tensor');
        tensors.forEach(function (t) {
            util.assertShapesMatch(shape, t.shape, 'All tensors passed to stack must have matching shapes');
        });
        tensors.forEach(function (t) {
            util.assert(dtype === t.dtype, 'All tensors passed to stack must have matching dtypes');
        });
        var expandedTensors = tensors.map(function (t) { return t.expandDims(axis); });
        return concat_1.ConcatOps.concat(expandedTensors, axis);
    };
    ArrayOps.expandDims = function (x, axis) {
        if (axis === void 0) { axis = 0; }
        util.assert(axis <= x.rank, 'Axis must be <= rank of the tensor');
        var newShape = x.shape.slice();
        newShape.splice(axis, 0, 1);
        return ArrayOps.reshape(x, newShape);
    };
    ArrayOps.linspace = function (start, stop, num) {
        if (num === 0) {
            throw new Error('Cannot request zero samples');
        }
        var step = (stop - start) / (num - 1);
        var values = makeZerosTypedArray(num, 'float32');
        values[0] = start;
        for (var i = 1; i < values.length; i++) {
            values[i] = values[i - 1] + step;
        }
        return tensor_1.Tensor1D.new(values, 'float32');
    };
    ArrayOps.range = function (start, stop, step, dtype) {
        if (step === void 0) { step = 1; }
        if (dtype === void 0) { dtype = 'float32'; }
        if (step === 0) {
            throw new Error('Cannot have a step of zero');
        }
        var sameStartStop = start === stop;
        var increasingRangeNegativeStep = start < stop && step < 0;
        var decreasingRangePositiveStep = stop < start && step > 1;
        if (sameStartStop || increasingRangeNegativeStep ||
            decreasingRangePositiveStep) {
            return ArrayOps.zeros([0], dtype);
        }
        var numElements = Math.abs(Math.ceil((stop - start) / step));
        var values = makeZerosTypedArray(numElements, dtype);
        if (stop < start && step === 1) {
            step = -1;
        }
        values[0] = start;
        for (var i = 1; i < values.length; i++) {
            values[i] = values[i - 1] + step;
        }
        return ArrayOps.tensor1d(values, dtype);
    };
    ArrayOps.buffer = function (shape, dtype, values) {
        if (dtype === void 0) { dtype = 'float32'; }
        return new tensor_1.TensorBuffer(shape, dtype, values);
    };
    ArrayOps.print = function (x, verbose) {
        if (verbose === void 0) { verbose = false; }
        console.log(tensor_util.tensorToString(x, verbose));
    };
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "scalar", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor1d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor2d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor3d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "tensor4d", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "ones", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "zeros", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "fill", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "onesLike", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "zerosLike", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "clone", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "randomNormal", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "truncatedNormal", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "randomUniform", null);
    __decorate([
        operation_1.operation
    ], ArrayOps, "rand", null);
    __decorate([
        operation_1.operation
    ], ArrayOps, "multinomial", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "oneHot", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' }),
        operation_1.operation
    ], ArrayOps, "fromPixels", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation_1.operation
    ], ArrayOps, "reshape", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' })
    ], ArrayOps, "squeeze", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation_1.operation
    ], ArrayOps, "cast", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], ArrayOps, "tile", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], ArrayOps, "gather", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation_1.operation
    ], ArrayOps, "pad", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation_1.operation
    ], ArrayOps, "stack", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Transformations' }),
        operation_1.operation
    ], ArrayOps, "expandDims", null);
    __decorate([
        operation_1.operation,
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "linspace", null);
    __decorate([
        operation_1.operation,
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "range", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "buffer", null);
    __decorate([
        doc_1.doc({ heading: 'Tensors', subheading: 'Creation' })
    ], ArrayOps, "print", null);
    return ArrayOps;
}());
exports.ArrayOps = ArrayOps;
function makeZerosTypedArray(size, dtype) {
    if (dtype == null || dtype === 'float32') {
        return new Float32Array(size);
    }
    else if (dtype === 'int32') {
        return new Int32Array(size);
    }
    else if (dtype === 'bool') {
        return new Uint8Array(size);
    }
    else {
        throw new Error("Unknown data type $ {dtype}");
    }
}
function makeOnesTypedArray(size, dtype) {
    var array = makeZerosTypedArray(size, dtype);
    for (var i = 0; i < array.length; i++) {
        array[i] = 1;
    }
    return array;
}
function toTypedArray(a, dtype) {
    if (noConversionNeeded(a, dtype)) {
        return a;
    }
    if (Array.isArray(a)) {
        a = util.flatten(a);
    }
    return util.copyTypedArray(a, dtype);
}
function noConversionNeeded(a, dtype) {
    return (a instanceof Float32Array && dtype === 'float32') ||
        (a instanceof Int32Array && dtype === 'int32') ||
        (a instanceof Uint8Array && dtype === 'bool');
}
