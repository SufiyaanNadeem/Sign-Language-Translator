import { Node } from '../graph/graph';
import { SessionRuntime } from '../graph/session';
import { SummedTensorArrayMap, TensorArrayMap } from '../graph/tensor_array_map';
import { NDArrayMath } from '../math';
import { Scalar } from '../tensor';
import { NamedTensorMap } from '../types';
import { Optimizer } from './optimizer';
export declare class SGDOptimizer extends Optimizer {
    protected learningRate: number;
    protected c: Scalar;
    constructor(learningRate: number, specifiedVariableList?: Node[]);
    applyGradients(variableGradients: NamedTensorMap): void;
    setLearningRate(learningRate: number): void;
    dispose(): void;
    afterBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    protected one: Scalar;
}
