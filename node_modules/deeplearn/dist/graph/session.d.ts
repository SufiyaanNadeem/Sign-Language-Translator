import { InputProvider } from '../data/input_provider';
import { NDArrayMath } from '../math';
import { Optimizer } from '../optimizers/optimizer';
import { Scalar, Tensor } from '../tensor';
import { Graph, Node, SymbolicTensor } from './graph';
import { Operation } from './ops/op';
import { SummedTensorArrayMap, TensorArrayMap } from './tensor_array_map';
export declare type FeedEntry = {
    tensor: SymbolicTensor;
    data: Tensor | InputProvider;
};
export declare class FeedDictionary {
    dict: {
        [tensorID: number]: FeedEntry;
    };
    constructor(feedEntries?: FeedEntry[]);
}
export declare enum CostReduction {
    NONE = 0,
    SUM = 1,
    MEAN = 2,
}
export declare class Session {
    private math;
    constructor(graph: Graph, math: NDArrayMath);
    dispose(): void;
    evalAll(tensors: SymbolicTensor[], feedEntries: FeedEntry[]): Tensor[];
    eval(tensor: SymbolicTensor, feedEntries: FeedEntry[]): Tensor;
    train(costTensor: SymbolicTensor, feedEntries: FeedEntry[], batchSize: number, optimizer: Optimizer, costReduction?: CostReduction): Scalar;
    private updateCostForExample(totalCost, currCost, costReduction);
    private updateCostForBatch(totalCost, costReduction);
    private getOrCreateRuntime(tensors, feed);
    private makeRuntimeCacheKey(tensors, feed);
    activationArrayMap: TensorArrayMap;
    gradientArrayMap: SummedTensorArrayMap;
    private runtimeCache;
    private prevBatchSize;
    private batchSizeScalar;
    private oneScalar;
}
export declare type SessionRuntime = {
    nodes: Node[];
    operations: Operation[];
};
