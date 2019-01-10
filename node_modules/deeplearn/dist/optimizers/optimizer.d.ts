import { Node, VariableNode } from '../graph/graph';
import { SessionRuntime } from '../graph/session';
import { SummedTensorArrayMap, TensorArrayMap } from '../graph/tensor_array_map';
import { NDArrayMath } from '../math';
import { Scalar, Variable } from '../tensor';
import { NamedTensorMap } from '../types';
export declare abstract class Optimizer {
    protected learningRate: number;
    protected variableNodes: VariableNode[];
    protected specifiedVariableNodes: VariableNode[] | null;
    constructor(learningRate: number, specifiedVariableList?: Node[]);
    minimize(f: () => Scalar, returnCost?: boolean, varList?: Variable[]): Scalar | null;
    computeGradients(f: () => Scalar, varList?: Variable[]): {
        value: Scalar;
        grads: NamedTensorMap;
    };
    abstract applyGradients(variableGradients: NamedTensorMap): void;
    beforeBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    afterExample(math: NDArrayMath, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    abstract afterBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    dispose(): void;
    protected variableGradients: TensorArrayMap;
    protected prevBatchSize: number;
    protected cGraph: Scalar;
}
