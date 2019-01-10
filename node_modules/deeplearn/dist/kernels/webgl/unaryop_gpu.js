"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var selu_util = require("../../ops/selu_util");
var UnaryOpProgram = (function () {
    function UnaryOpProgram(aShape, opSnippet) {
        this.variableNames = ['A'];
        this.outputShape = aShape;
        this.userCode = "\n      float unaryOperation(float x) {\n        " + opSnippet + "\n      }\n\n      void main() {\n        float x = getAAtOutCoords();\n        float y = unaryOperation(x);\n\n        setOutput(y);\n      }\n    ";
    }
    return UnaryOpProgram;
}());
exports.UnaryOpProgram = UnaryOpProgram;
var CHECK_NAN_SNIPPET = "\n  if (isNaN(x)) return x;\n";
exports.ABS = "\n  return abs(x);\n";
exports.RELU = CHECK_NAN_SNIPPET + "\n  return (x < 0.0) ? 0.0 : x;\n";
exports.ELU = "\n  return (x >= 0.0) ? x : (exp(x) - 1.0);\n";
exports.ELU_DER = "\n  return (x >= 0.0) ? 1.0 : exp(x);\n";
exports.SELU = "\n  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.\n  // see: https://arxiv.org/abs/1706.02515\n  float scaleAlpha = " + selu_util.SELU_SCALEALPHA + ";\n  float scale = " + selu_util.SELU_SCALE + ";\n  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);\n";
function LEAKY_RELU(alpha) {
    return "\n    return (x >= 0.0) ? x : " + alpha + " * x;\n  ";
}
exports.LEAKY_RELU = LEAKY_RELU;
function STEP(alpha) {
    if (alpha === void 0) { alpha = 0.0; }
    return CHECK_NAN_SNIPPET + ("\n    return x > 0.0 ? 1.0 : float(" + alpha + ");\n  ");
}
exports.STEP = STEP;
exports.NEG = "\n  return -x;\n";
exports.CEIL = "\n  return ceil(x);\n";
exports.FLOOR = "\n  return floor(x);\n";
exports.EXP = "\n  return exp(x);\n";
exports.LOG = "\n  return log(x);\n";
exports.SQRT = CHECK_NAN_SNIPPET + "\n  return sqrt(x);\n";
exports.SIGMOID = "\n  return 1.0 / (1.0 + exp(-1.0 * x));\n";
exports.SIN = CHECK_NAN_SNIPPET + "\n  return sin(x);\n";
exports.COS = CHECK_NAN_SNIPPET + "\n  return cos(x);\n";
exports.TAN = "\n  return tan(x);\n";
exports.ASIN = CHECK_NAN_SNIPPET + "\n  return asin(x);\n";
exports.ACOS = CHECK_NAN_SNIPPET + "\n  return acos(x);\n";
exports.ATAN = CHECK_NAN_SNIPPET + "\n  return atan(x);\n";
exports.SINH = "\n  float e2x = exp(x);\n  return (e2x - 1.0 / e2x) / 2.0;\n";
exports.COSH = "\n  float e2x = exp(-x);\n  return (e2x + 1.0 / e2x) / 2.0;\n";
exports.TANH = "\n  float e2x = exp(-2.0 * abs(x));\n  return sign(x) * (1.0 - e2x) / (1.0 + e2x);\n";
exports.SQUARE = "\n  return x * x;\n";
exports.LOGICAL_NOT = CHECK_NAN_SNIPPET + "\n  return float(!(x >= 1.0));\n";
exports.TO_INT = "\n  return float(int(x));\n";
