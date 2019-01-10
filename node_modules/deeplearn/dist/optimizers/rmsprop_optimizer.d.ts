import { Node } from '../graph/graph';
import { SessionRuntime } from '../graph/session';
import { SummedTensorArrayMap, TensorArrayMap } from '../graph/tensor_array_map';
import { NDArrayMath } from '../math';
import { NamedVariableMap } from '../types';
import { Optimizer } from './optimizer';
export declare class RMSPropOptimizer extends Optimizer {
    protected learningRate: number;
    private c;
    private epsilon;
    private decay;
    private momentum;
    private oneMinusDecay;
    private accumulatedMeanSquares;
    private accumulatedMoments;
    constructor(learningRate: number, decay?: number, momentum?: number, specifiedVariableList?: Node[], epsilon?: number);
    applyGradients(variableGradients: NamedVariableMap): void;
    beforeBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    afterBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    dispose(): void;
    private accumulatedMeanSquaredGraph;
    private accumulatedMomentGraph;
}
