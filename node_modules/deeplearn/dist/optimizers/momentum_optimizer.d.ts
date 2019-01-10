import { Node } from '../graph/graph';
import { SessionRuntime } from '../graph/session';
import { SummedTensorArrayMap, TensorArrayMap } from '../graph/tensor_array_map';
import { NDArrayMath } from '../math';
import { NamedVariableMap } from '../types';
import { SGDOptimizer } from './sgd_optimizer';
export declare class MomentumOptimizer extends SGDOptimizer {
    protected learningRate: number;
    private momentum;
    private useNesterov;
    private m;
    private accumulations;
    constructor(learningRate: number, momentum: number, specifiedVariableList?: Node[], useNesterov?: boolean);
    applyGradients(variableGradients: NamedVariableMap): void;
    beforeBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    afterBatch(math: NDArrayMath, batchSize: number, runtime: SessionRuntime, activationArrayMap: TensorArrayMap, gradientArrayMap: SummedTensorArrayMap): void;
    dispose(): void;
    setMomentum(momentum: number): void;
    private variableVelocitiesGraph;
}
