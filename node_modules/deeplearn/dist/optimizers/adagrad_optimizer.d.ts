import { Node } from '../graph/graph';
import { SessionRuntime } from '../graph/session';
import { SummedTensorArrayMap, TensorArrayMap } from '../graph/tensor_array_map';
import { NDArrayMath } from '../math';
import { NamedVariableMap } from '../types';
import { Optimizer } from './optimizer';
export declare class AdagradOptimizer extends Optimizer {
    protected learningRate: number;
    private initialAccumulatorValue;
    private c;
    private epsilon;
    private accumulatedGrads;
    constructor(learningRate: number, specifiedVariableList?: Node[], initialAccumulatorValue?: number);
    applyGradients(variableGradients: NamedVariableMap): void;
    beforeBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    afterBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    dispose(): void;
    private accumulatedSquaredGradients;
    private one;
}
