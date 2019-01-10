import { Tensor } from '../tensor';
import { Initializer } from './initializers';
export declare class GraphLayers {
    private g;
    constructor(g: Graph);
    dense(name: string, x: SymbolicTensor, units: number, activation?: ((x: SymbolicTensor) => SymbolicTensor) | null, useBias?: boolean, kernelInitializer?: Initializer, biasInitializer?: Initializer): SymbolicTensor;
}
export declare class Graph {
    layers: GraphLayers;
    constructor();
    variable(name: string, data: Tensor): SymbolicTensor;
    placeholder(name: string, shape: number[]): SymbolicTensor;
    constant(value: ArrayData): SymbolicTensor;
    reshape(x: SymbolicTensor, shape: number[]): SymbolicTensor;
    fusedLinearCombination(x1: SymbolicTensor, x2: SymbolicTensor, c1: SymbolicTensor, c2: SymbolicTensor): SymbolicTensor;
    add(x1: SymbolicTensor, x2: SymbolicTensor): SymbolicTensor;
    subtract(x1: SymbolicTensor, x2: SymbolicTensor): SymbolicTensor;
    multiply(x1: SymbolicTensor, x2: SymbolicTensor): SymbolicTensor;
    divide(x1: SymbolicTensor, x2: SymbolicTensor): SymbolicTensor;
    reduceSum(x: SymbolicTensor): SymbolicTensor;
    concat1d(x1: SymbolicTensor, x2: SymbolicTensor): SymbolicTensor;
    concat2d(x1: SymbolicTensor, x2: SymbolicTensor, axis: number): SymbolicTensor;
    concat3d(x1: SymbolicTensor, x2: SymbolicTensor, axis: number): SymbolicTensor;
    concat4d(x1: SymbolicTensor, x2: SymbolicTensor, axis: number): SymbolicTensor;
    matmul(x1: SymbolicTensor, x2: SymbolicTensor): SymbolicTensor;
    conv2d(x: SymbolicTensor, w: SymbolicTensor, b: SymbolicTensor, fieldSize: number, outputDepth: number, stride?: number, zeroPad?: number): SymbolicTensor;
    maxPool(x: SymbolicTensor, fieldSize: number, stride?: number, zeroPad?: number): SymbolicTensor;
    exp(x: SymbolicTensor): SymbolicTensor;
    log(x: SymbolicTensor): SymbolicTensor;
    relu(x: SymbolicTensor): SymbolicTensor;
    leakyRelu(x: SymbolicTensor, alpha: number): SymbolicTensor;
    prelu(x: SymbolicTensor, alpha: SymbolicTensor): SymbolicTensor;
    elu(x: SymbolicTensor): SymbolicTensor;
    tanh(x: SymbolicTensor): SymbolicTensor;
    sigmoid(x: SymbolicTensor): SymbolicTensor;
    square(x: SymbolicTensor): SymbolicTensor;
    softmax(x: SymbolicTensor): SymbolicTensor;
    softmaxCrossEntropyCost(x: SymbolicTensor, target: SymbolicTensor): SymbolicTensor;
    meanSquaredCost(label: SymbolicTensor, prediction: SymbolicTensor): SymbolicTensor;
    argmax(x: SymbolicTensor): SymbolicTensor;
    argmaxEquals(x1: SymbolicTensor, x2: SymbolicTensor): SymbolicTensor;
    private addNodeAndReturnOutput(node);
    getNodes(): Node[];
    private nodes;
}
export declare class SymbolicTensor extends Tensor {
    shape: number[];
    node: Node;
    id: number;
    constructor(shape: number[]);
    private static nextID;
}
export declare abstract class Node {
    graph: Graph;
    name: string;
    inputs: {
        [name: string]: SymbolicTensor;
    };
    output: SymbolicTensor;
    constructor(graph: Graph, name: string, inputs: {
        [name: string]: SymbolicTensor;
    }, output: SymbolicTensor);
    abstract validate(): void;
    id: number;
    private static nextID;
}
export declare class VariableNode extends Node {
    data: Tensor;
    constructor(graph: Graph, name: string, data: Tensor);
    validate(): void;
}
export declare class PlaceholderNode extends Node {
    constructor(graph: Graph, name: string, shape: number[]);
    validate(): void;
}
export declare class ConstantNode extends Node {
    data: Tensor;
    constructor(graph: Graph, data: Tensor);
    validate(): void;
}
export declare class ReshapeNode extends Node {
    name: string;
    private x;
    private shape;
    static readonly X: string;
    constructor(graph: Graph, name: string, x: SymbolicTensor, shape: number[]);
    validate(): void;
}
export declare class FusedLinearCombinationNode extends Node {
    private t1;
    private t2;
    private c1;
    private c2;
    static readonly T1: string;
    static readonly T2: string;
    static readonly C1: string;
    static readonly C2: string;
    constructor(graph: Graph, t1: SymbolicTensor, t2: SymbolicTensor, c1: SymbolicTensor, c2: SymbolicTensor);
    validate(): void;
}
export declare class AddNode extends Node {
    private t1;
    private t2;
    static readonly T1: string;
    static readonly T2: string;
    constructor(graph: Graph, t1: SymbolicTensor, t2: SymbolicTensor);
    validate(): void;
}
export declare class SubtractNode extends Node {
    private t1;
    private t2;
    static readonly T1: string;
    static readonly T2: string;
    constructor(graph: Graph, t1: SymbolicTensor, t2: SymbolicTensor);
    validate(): void;
}
export declare class MultiplyNode extends Node {
    private t1;
    private t2;
    static readonly T1: string;
    static readonly T2: string;
    constructor(graph: Graph, t1: SymbolicTensor, t2: SymbolicTensor);
    validate(): void;
}
export declare class DivideNode extends Node {
    private t1;
    private t2;
    static readonly T1: string;
    static readonly T2: string;
    constructor(graph: Graph, t1: SymbolicTensor, t2: SymbolicTensor);
    validate(): void;
}
export declare class ReduceSumNode extends Node {
    static readonly X: string;
    constructor(graph: Graph, x: SymbolicTensor);
    validate(): void;
}
export declare class Concat1DNode extends Node {
    static readonly X1: string;
    static readonly X2: string;
    constructor(graph: Graph, x1: SymbolicTensor, x2: SymbolicTensor);
    validate(): void;
}
export declare class Concat2DNode extends Node {
    private x1;
    private x2;
    axis: number;
    static readonly X1: string;
    static readonly X2: string;
    static readonly AXIS: string;
    constructor(graph: Graph, x1: SymbolicTensor, x2: SymbolicTensor, axis: number);
    validate(): void;
}
export declare class Concat3DNode extends Node {
    private x1;
    private x2;
    axis: number;
    static readonly X1: string;
    static readonly X2: string;
    static readonly AXIS: string;
    constructor(graph: Graph, x1: SymbolicTensor, x2: SymbolicTensor, axis: number);
    validate(): void;
}
export declare class Concat4DNode extends Node {
    private x1;
    private x2;
    axis: number;
    static readonly X1: string;
    static readonly X2: string;
    static readonly AXIS: string;
    constructor(graph: Graph, x1: SymbolicTensor, x2: SymbolicTensor, axis: number);
    validate(): void;
}
export declare class MatMulNode extends Node {
    private x1;
    private x2;
    static readonly X1: string;
    static readonly X2: string;
    constructor(graph: Graph, x1: SymbolicTensor, x2: SymbolicTensor);
    validate(): void;
}
export declare class Convolution2DNode extends Node {
    private x;
    private w;
    private b;
    fieldSize: number;
    outputDepth: number;
    stride: number;
    zeroPad: number;
    static readonly X: string;
    static readonly W: string;
    static readonly B: string;
    constructor(graph: Graph, x: SymbolicTensor, w: SymbolicTensor, b: SymbolicTensor, fieldSize: number, outputDepth: number, stride?: number, zeroPad?: number);
    validate(): void;
}
export declare class MaxPoolNode extends Node {
    private x;
    fieldSize: number;
    stride: number;
    zeroPad: number;
    static readonly X: string;
    constructor(graph: Graph, x: SymbolicTensor, fieldSize: number, stride?: number, zeroPad?: number);
    validate(): void;
}
export declare class ReLUNode extends Node {
    static readonly X: string;
    constructor(graph: Graph, x: SymbolicTensor);
    validate(): void;
}
export declare class LeakyReLUNode extends Node {
    static readonly X: string;
    alpha: number;
    constructor(graph: Graph, x: SymbolicTensor, alpha: number);
    validate(): void;
}
export declare class PReLUNode extends Node {
    private x;
    private alpha;
    static readonly X: string;
    static readonly ALPHA: string;
    constructor(graph: Graph, x: SymbolicTensor, alpha: SymbolicTensor);
    validate(): void;
}
export declare class EluNode extends Node {
    static readonly X: string;
    constructor(graph: Graph, x: SymbolicTensor);
    validate(): void;
}
export declare class ExpNode extends Node {
    static readonly X: string;
    constructor(graph: Graph, x: SymbolicTensor);
    validate(): void;
}
export declare class LogNode extends Node {
    static readonly X: string;
    constructor(graph: Graph, x: SymbolicTensor);
    validate(): void;
}
export declare class TanHNode extends Node {
    static readonly X: string;
    constructor(graph: Graph, x: SymbolicTensor);
    validate(): void;
}
export declare class SigmoidNode extends Node {
    static readonly X: string;
    constructor(graph: Graph, x: SymbolicTensor);
    validate(): void;
}
export declare class SquareNode extends Node {
    static readonly X: string;
    constructor(graph: Graph, x: SymbolicTensor);
    validate(): void;
}
export declare class SoftmaxCrossEntropyCostNode extends Node {
    private x;
    private target;
    static readonly X: string;
    static readonly TARGET: string;
    constructor(graph: Graph, x: SymbolicTensor, target: SymbolicTensor);
    validate(): void;
}
export declare class SoftmaxNode extends Node {
    private x;
    static readonly X: string;
    constructor(graph: Graph, x: SymbolicTensor);
    validate(): void;
}
export declare class MeanSquaredCostNode extends Node {
    private label;
    private prediction;
    static readonly LABEL: string;
    static readonly PREDICTION: string;
    constructor(graph: Graph, label: SymbolicTensor, prediction: SymbolicTensor);
    validate(): void;
}
export declare class ArgMaxNode extends Node {
    x: SymbolicTensor;
    static readonly X: string;
    constructor(graph: Graph, x: SymbolicTensor);
    validate(): void;
}
export declare class ArgMaxEqualsNode extends Node {
    private x1;
    private x2;
    static readonly X1: string;
    static readonly X2: string;
    constructor(graph: Graph, x1: SymbolicTensor, x2: SymbolicTensor);
    validate(): void;
}
export declare type ArrayData = Tensor | number | number[] | number[][] | number[][][] | number[][][][];
