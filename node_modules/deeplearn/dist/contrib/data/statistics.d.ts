import { Dataset } from './dataset';
import { ElementArray } from './types';
export declare type NumericColumnStatistics = {
    min: number;
    max: number;
};
export declare type DatasetStatistics = {
    [key: string]: NumericColumnStatistics;
};
export declare function scaleTo01(min: number, max: number): (value: ElementArray) => ElementArray;
export declare function computeDatasetStatistics(dataset: Dataset, sampleSize?: number, shuffleWindowSize?: number): Promise<DatasetStatistics>;
