import { Dataset } from './dataset';
import { DataStream } from './streams/data_stream';
import { DatasetBatch } from './types';
export declare class BatchDataset {
    protected base: Dataset;
    protected batchSize: number;
    protected smallLastBatch: boolean;
    constructor(base: Dataset, batchSize: number, smallLastBatch?: boolean);
    getStream(): Promise<DataStream<DatasetBatch>>;
}
