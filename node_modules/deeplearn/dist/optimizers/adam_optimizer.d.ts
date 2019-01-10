import { Node } from '../graph/graph';
import { SessionRuntime } from '../graph/session';
import { SummedTensorArrayMap, TensorArrayMap } from '../graph/tensor_array_map';
import { NDArrayMath } from '../math';
import { NamedVariableMap } from '../types';
import { Optimizer } from './optimizer';
export declare class AdamOptimizer extends Optimizer {
    protected learningRate: number;
    private c;
    private eps;
    private beta1;
    private beta2;
    private accBeta1;
    private accBeta2;
    private oneMinusBeta1;
    private oneMinusBeta2;
    private one;
    private accumulatedFirstMoment;
    private accumulatedSecondMoment;
    constructor(learningRate: number, beta1: number, beta2: number, epsilon?: number, specifiedVariableList?: Node[]);
    applyGradients(variableGradients: NamedVariableMap): void;
    beforeBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    afterBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    dispose(): void;
    private firstMomentGraph;
    private secondMomentGraph;
}
