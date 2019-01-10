import { Tensor } from '../tensor';
export interface DataStats {
    exampleCount: number;
    inputMin: number;
    inputMax: number;
    shape: number[];
}
export declare abstract class InMemoryDataset {
    protected dataShapes: number[][];
    protected dataset: Tensor[][] | null;
    private normalizationInfo;
    constructor(dataShapes: number[][]);
    getDataShape(dataIndex: number): number[];
    abstract fetchData(): Promise<void>;
    getData(): Tensor[][] | null;
    getStats(): DataStats[];
    private getStatsForData(data);
    private normalizeExamplesToRange(examples, curLowerBounds, curUpperBounds, newLowerBounds, newUpperBounds);
    private computeBounds(dataIndex);
    normalizeWithinBounds(dataIndex: number, lowerBound: number, upperBound: number): void;
    private isNormalized(dataIndex);
    removeNormalization(dataIndex: number): void;
    unnormalizeExamples(examples: Tensor[], dataIndex: number): Tensor[];
    dispose(): void;
}
