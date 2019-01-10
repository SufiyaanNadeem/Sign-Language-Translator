"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./environment");
var backend_cpu_1 = require("./kernels/backend_cpu");
var backend_webgl_1 = require("./kernels/backend_webgl");
var tensor_1 = require("./tensor");
var util = require("./util");
exports.WEBGL_ENVS = [
    { 'BACKEND': 'webgl', 'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1 },
    { 'BACKEND': 'webgl', 'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2 },
];
exports.CPU_ENVS = [{ 'BACKEND': 'cpu' }];
exports.ALL_ENVS = exports.WEBGL_ENVS.concat(exports.CPU_ENVS);
exports.TEST_EPSILON = 1e-3;
function expectArraysClose(actual, expected, epsilon) {
    if (epsilon === void 0) { epsilon = exports.TEST_EPSILON; }
    if (!(actual instanceof tensor_1.Tensor) && !(expected instanceof tensor_1.Tensor)) {
        var aType = actual.constructor.name;
        var bType = expected.constructor.name;
        if (aType !== bType) {
            throw new Error("Arrays are of different type actual: " + aType + " " +
                ("vs expected: " + bType));
        }
    }
    else if (actual instanceof tensor_1.Tensor && expected instanceof tensor_1.Tensor) {
        if (actual.dtype !== expected.dtype) {
            throw new Error("Arrays are of different type actual: " + actual.dtype + " " +
                ("vs expected: " + expected.dtype + "."));
        }
        if (!util.arraysEqual(actual.shape, expected.shape)) {
            throw new Error("Arrays are of different shape actual: " + actual.shape + " " +
                ("vs expected: " + expected.shape + "."));
        }
    }
    var actualValues;
    var expectedValues;
    if (actual instanceof tensor_1.Tensor) {
        actualValues = actual.dataSync();
    }
    else {
        actualValues = actual;
    }
    if (expected instanceof tensor_1.Tensor) {
        expectedValues = expected.dataSync();
    }
    else {
        expectedValues = expected;
    }
    if (actualValues.length !== expectedValues.length) {
        throw new Error("Arrays have different lengths actual: " + actualValues.length + " vs " +
            ("expected: " + expectedValues.length + ".\n") +
            ("Actual:   " + actualValues + ".\n") +
            ("Expected: " + expectedValues + "."));
    }
    for (var i = 0; i < expectedValues.length; ++i) {
        var a = actualValues[i];
        var e = expectedValues[i];
        if (!areClose(a, Number(e), epsilon)) {
            throw new Error("Arrays differ: actual[" + i + "] = " + a + ", expected[" + i + "] = " + e + ".\n" +
                ("Actual:   " + actualValues + ".\n") +
                ("Expected: " + expectedValues + "."));
        }
    }
}
exports.expectArraysClose = expectArraysClose;
function expectArraysEqual(actual, expected) {
    return expectArraysClose(actual, expected, 0);
}
exports.expectArraysEqual = expectArraysEqual;
function expectNumbersClose(a, e, epsilon) {
    if (epsilon === void 0) { epsilon = exports.TEST_EPSILON; }
    if (!areClose(a, e, epsilon)) {
        throw new Error("Numbers differ: actual === " + a + ", expected === " + e);
    }
}
exports.expectNumbersClose = expectNumbersClose;
function areClose(a, e, epsilon) {
    if (isNaN(a) && isNaN(e)) {
        return true;
    }
    if (isNaN(a) || isNaN(e) || Math.abs(a - e) > epsilon) {
        return false;
    }
    return true;
}
function expectValuesInRange(actual, low, high) {
    var actualVals;
    if (actual instanceof tensor_1.Tensor) {
        actualVals = actual.dataSync();
    }
    else {
        actualVals = actual;
    }
    for (var i = 0; i < actualVals.length; i++) {
        if (actualVals[i] < low || actualVals[i] > high) {
            throw new Error("Value out of range:" + actualVals[i] + " low: " + low + ", high: " + high);
        }
    }
}
exports.expectValuesInRange = expectValuesInRange;
function describeWithFlags(name, featuresList, tests) {
    featuresList.forEach(function (features) {
        var testName = name + ' ' + JSON.stringify(features);
        executeTests(testName, tests, features);
    });
}
exports.describeWithFlags = describeWithFlags;
function executeTests(testName, tests, features) {
    describe(testName, function () {
        beforeEach(function () {
            environment_1.ENV.setFeatures(features || {});
            environment_1.ENV.addCustomBackend('webgl', function () { return new backend_webgl_1.MathBackendWebGL(); });
            environment_1.ENV.addCustomBackend('cpu', function () { return new backend_cpu_1.MathBackendCPU(); });
            if (features && features.BACKEND != null) {
                environment_1.Environment.setBackend(features.BACKEND);
            }
            environment_1.ENV.engine.startScope();
        });
        afterEach(function () {
            environment_1.ENV.engine.endScope(null);
            environment_1.ENV.reset();
        });
        tests();
    });
}
function assertIsNan(val, dtype) {
    if (!util.isValNaN(val, dtype)) {
        throw new Error("Value " + val + " does not represent NaN for dtype " + dtype);
    }
}
exports.assertIsNan = assertIsNan;
