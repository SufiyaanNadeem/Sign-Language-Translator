import { Dataset } from '../dataset';
import { DataSource } from '../datasource';
import { DataStream } from '../streams/data_stream';
import { DatasetElement } from '../types';
export declare class TextLineDataset extends Dataset {
    protected readonly input: DataSource;
    protected readonly columnName: string;
    constructor(input: DataSource, columnName?: string);
    getStream(): DataStream<DatasetElement>;
}
