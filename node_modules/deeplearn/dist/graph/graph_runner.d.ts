import { NDArrayMath } from '../math';
import { Optimizer } from '../optimizers/optimizer';
import { Scalar, Tensor } from '../tensor';
import { SymbolicTensor } from './graph';
import { FeedEntry, Session } from './session';
export interface GraphRunnerEventObserver {
    batchesTrainedCallback?: (totalBatchesTrained: number) => void;
    avgCostCallback?: (avgCost: Scalar) => void;
    metricCallback?: (metric: Tensor) => void;
    inferenceExamplesCallback?: (feeds: FeedEntry[][], inferenceValues: Tensor[]) => void;
    inferenceExamplesPerSecCallback?: (examplesPerSec: number) => void;
    trainExamplesPerSecCallback?: (examplesPerSec: number) => void;
    totalTimeCallback?: (totalTimeSec: number) => void;
    doneTrainingCallback?: () => void;
}
export declare enum MetricReduction {
    SUM = 0,
    MEAN = 1,
}
export declare class GraphRunner {
    private math;
    private session;
    private eventObserver;
    private costTensor;
    private trainFeedEntries;
    private batchSize;
    private optimizer;
    private currentTrainLoopNumBatches;
    private costIntervalMs;
    private metricTensor;
    private metricFeedEntries;
    private metricBatchSize;
    private metricReduction;
    private metricIntervalMs;
    private inferenceTensor;
    private inferenceFeedEntries;
    private inferenceExampleIntervalMs;
    private inferenceExampleCount;
    private isTraining;
    private totalBatchesTrained;
    private batchesTrainedThisRun;
    private lastComputedMetric;
    private isInferring;
    private lastInferTimeoutID;
    private currentInferenceLoopNumPasses;
    private inferencePassesThisRun;
    private trainStartTimestamp;
    private lastCostTimestamp;
    private lastEvalTimestamp;
    private zeroScalar;
    private metricBatchSizeScalar;
    constructor(math: NDArrayMath, session: Session, eventObserver: GraphRunnerEventObserver);
    resetStatistics(): void;
    train(costTensor: SymbolicTensor, trainFeedEntries: FeedEntry[], batchSize: number, optimizer: Optimizer, numBatches?: number, metricTensor?: SymbolicTensor, metricFeedEntries?: FeedEntry[], metricBatchSize?: number, metricReduction?: MetricReduction, evalIntervalMs?: number, costIntervalMs?: number): void;
    stopTraining(): void;
    resumeTraining(): void;
    private trainNetwork();
    infer(inferenceTensor: SymbolicTensor, inferenceFeedEntries: FeedEntry[], inferenceExampleIntervalMs?: number, inferenceExampleCount?: number, numPasses?: number): void;
    private inferNetwork();
    stopInferring(): void;
    isInferenceRunning(): boolean;
    computeMetric(): Scalar;
    getTotalBatchesTrained(): number;
    getLastComputedMetric(): Scalar;
    setMath(math: NDArrayMath): void;
    setSession(session: Session): void;
    setInferenceTensor(inferenceTensor: SymbolicTensor): void;
    setInferenceExampleCount(inferenceExampleCount: number): void;
}
