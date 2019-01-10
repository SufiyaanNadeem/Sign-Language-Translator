import { Node } from '../graph/graph';
import { SessionRuntime } from '../graph/session';
import { SummedTensorArrayMap, TensorArrayMap } from '../graph/tensor_array_map';
import { NDArrayMath } from '../math';
import { NamedVariableMap } from '../types';
import { Optimizer } from './optimizer';
export declare class AdamaxOptimizer extends Optimizer {
    protected learningRate: number;
    private c;
    private eps;
    private accBeta1;
    private beta1;
    private beta2;
    private decay;
    private oneMinusBeta1;
    private one;
    private iteration;
    private accumulatedFirstMoment;
    private accumulatedWeightedInfNorm;
    constructor(learningRate: number, beta1: number, beta2: number, epsilon?: number, decay?: number, specifiedVariableList?: Node[]);
    applyGradients(variableGradients: NamedVariableMap): void;
    beforeBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    afterBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    dispose(): void;
    private firstMomentGraph;
    private weightedInfNormGraph;
}
