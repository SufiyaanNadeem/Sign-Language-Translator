import { Node } from '../graph/graph';
import { SessionRuntime } from '../graph/session';
import { SummedTensorArrayMap, TensorArrayMap } from '../graph/tensor_array_map';
import { NDArrayMath } from '../math';
import { NamedVariableMap } from '../types';
import { Optimizer } from './optimizer';
export declare class AdadeltaOptimizer extends Optimizer {
    private c;
    private epsilon;
    private rho;
    private oneMinusRho;
    private accumulatedGrads;
    private accumulatedUpdates;
    constructor(learningRate: number, rho: number, specifiedVariableList?: Node[], epsilon?: number);
    applyGradients(variableGradients: NamedVariableMap): void;
    beforeBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    afterBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    dispose(): void;
    private accumulatedSquaredGradientsGraph;
    private accumulatedUpdatesGraph;
    private one;
}
