import { GPGPUProgram } from './gpgpu_math';
export declare const ADD = "return a + b;";
export declare const SUB = "return a - b;";
export declare const MUL = "return a * b;";
export declare const DIV = "return a / b;";
export declare const POW = "\n  return (round(mod(b, 2.0)) == 0 || round(mod(b, 2.0)) == 2) ?\n      pow(abs(a), b) : sign(a) * pow(abs(a), b);\n";
export declare const EQUAL: string;
export declare const NOT_EQUAL: string;
export declare const LESS: string;
export declare const LESS_EQUAL: string;
export declare const GREATER: string;
export declare const GREATER_EQUAL: string;
export declare const LOGICAL_AND: string;
export declare const LOGICAL_OR: string;
export declare const LOGICAL_XOR: string;
export declare const PRELU = "\n  return (a >= 0.0) ? a : b * a;\n";
export declare const PRELU_DER = "\n  return (a > 0.0) ? 1.0 : ((a < 0.0) ? b : a);\n";
export declare const MAX: string;
export declare const MIN: string;
export declare class BinaryOpProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    supportsBroadcasting: boolean;
    constructor(op: string, aShape: number[], bShape: number[]);
}
