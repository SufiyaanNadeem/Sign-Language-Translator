import { BatchDataset } from './batch_dataset';
import { DatasetStatistics } from './statistics';
import { DataStream } from './streams/data_stream';
import { DatasetElement } from './types';
export declare abstract class Dataset {
    abstract getStream(): DataStream<DatasetElement>;
    computeStatistics(sampleSize?: number, shuffleWindowSize?: number): Promise<DatasetStatistics>;
    filter(filterer: (value: DatasetElement) => boolean): Dataset;
    map(transform: (value: DatasetElement) => DatasetElement): Dataset;
    batch(batchSize: number, smallLastBatch?: boolean): BatchDataset;
    concatenate(dataset: Dataset): Dataset;
    repeat(count?: number): Dataset;
    take(count: number): Dataset;
    skip(count: number): Dataset;
    shuffle(bufferSize: number, seed?: string, reshuffleEachIteration?: boolean): Dataset;
    prefetch(bufferSize: number): Dataset;
    collectAll(): Promise<DatasetElement[]>;
    forEach(f: (input: DatasetElement) => void): Promise<void>;
}
export declare function datasetFromStreamFn(getStreamFn: () => DataStream<DatasetElement>): Dataset;
export declare function datasetFromElements(items: DatasetElement[]): Dataset;
