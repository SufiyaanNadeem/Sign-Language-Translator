"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var broadcast_util = require("../../ops/broadcast_util");
var CHECK_NAN_SNIPPET = "\n  if (isNaN(a)) return a;\n  if (isNaN(b)) return b;\n";
exports.ADD = 'return a + b;';
exports.SUB = 'return a - b;';
exports.MUL = 'return a * b;';
exports.DIV = 'return a / b;';
exports.POW = "\n  return (round(mod(b, 2.0)) == 0 || round(mod(b, 2.0)) == 2) ?\n      pow(abs(a), b) : sign(a) * pow(abs(a), b);\n";
exports.EQUAL = CHECK_NAN_SNIPPET + "\n  return float(a == b);\n";
exports.NOT_EQUAL = CHECK_NAN_SNIPPET + "\n  return float(a != b);\n";
exports.LESS = CHECK_NAN_SNIPPET + "\n  return float(a < b);\n";
exports.LESS_EQUAL = CHECK_NAN_SNIPPET + "\n  return float(a <= b);\n";
exports.GREATER = CHECK_NAN_SNIPPET + "\n  return float(a > b);\n";
exports.GREATER_EQUAL = CHECK_NAN_SNIPPET + "\n  return float(a >= b);\n";
exports.LOGICAL_AND = CHECK_NAN_SNIPPET + "\n  return float(a >= 1.0 && b >= 1.0);\n";
exports.LOGICAL_OR = CHECK_NAN_SNIPPET + "\n  return float(a >= 1.0 || b >= 1.0);\n";
exports.LOGICAL_XOR = CHECK_NAN_SNIPPET + "\n  return float(a >= 1.0 ^^ b >= 1.0);\n";
exports.PRELU = "\n  return (a >= 0.0) ? a : b * a;\n";
exports.PRELU_DER = "\n  return (a > 0.0) ? 1.0 : ((a < 0.0) ? b : a);\n";
exports.MAX = CHECK_NAN_SNIPPET + "\n  return max(a, b);\n";
exports.MIN = CHECK_NAN_SNIPPET + "\n  return min(a, b);\n";
var BinaryOpProgram = (function () {
    function BinaryOpProgram(op, aShape, bShape) {
        this.variableNames = ['A', 'B'];
        this.supportsBroadcasting = true;
        this.outputShape =
            broadcast_util.assertAndGetBroadcastShape(aShape, bShape);
        this.userCode = "\n      float binaryOperation(float a, float b) {\n        " + op + "\n      }\n\n      void main() {\n        float a = getAAtOutCoords();\n        float b = getBAtOutCoords();\n        setOutput(binaryOperation(a, b));\n      }\n    ";
    }
    return BinaryOpProgram;
}());
exports.BinaryOpProgram = BinaryOpProgram;
