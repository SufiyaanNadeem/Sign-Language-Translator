"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LRNProgram = (function () {
    function LRNProgram(xShape, radius, bias, alpha, beta, normRegion) {
        this.variableNames = ['x'];
        this.outputShape = [];
        var rad = radius;
        var maxW = xShape[1] - 1;
        var maxH = xShape[2] - 1;
        var maxD = xShape[3] - 1;
        this.outputShape = xShape;
        var powOperator;
        var basis = "float(" + bias + ") + float(" + alpha + ") * sum";
        if (beta === 0.5) {
            powOperator = "inversesqrt(" + basis + ")";
        }
        else if (beta === 1.0) {
            powOperator = "1.0/(" + basis + ")";
        }
        else {
            powOperator = "exp(log(" + basis + ") * float(-" + beta + "));";
        }
        if (normRegion === 'withinChannel') {
            this.userCode = "\n        void main() {\n          ivec4 coords = getOutputCoords();\n          int b = coords[0];\n          int r = coords[1];\n          int c = coords[2];\n          int d = coords[3];\n          float x = getX(b, r, c, d);\n          float sum = 0.0;\n          for (int u = -" + rad + "; u <= " + rad + "; u++) {\n            for (int v = -" + rad + "; v <= " + rad + "; v++) {\n              int idx = r + u;\n              int idy = c + v;\n              if (idx >= 0 && idx <= " + maxW + " && idy >= 0 && idy <= " + maxH + ") {\n                float z = getX(b, idx, idy, d);\n                sum += z * z;\n              }\n            }\n          }\n          float val = x * " + powOperator + ";\n          setOutput(val);\n        }\n      ";
        }
        else {
            this.userCode = "\n        void main() {\n          ivec4 coords = getOutputCoords();\n          int b = coords[0];\n          int r = coords[1];\n          int c = coords[2];\n          int d = coords[3];\n          float x = getX(b, r, c, d);\n          float sum = 0.0;\n          for (int j = -" + rad + "; j <= " + rad + "; j++) {\n            int idx = d + j;\n            if (idx >= 0 && idx <=  " + maxD + ") {\n              float z = getX(b, r, c, idx);\n              sum += z * z;\n            }\n          }\n          float val = x * " + powOperator + ";\n          setOutput(val);\n        }\n      ";
        }
    }
    return LRNProgram;
}());
exports.LRNProgram = LRNProgram;
