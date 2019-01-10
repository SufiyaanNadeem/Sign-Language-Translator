import { Dataset } from '../dataset';
import { DataSource } from '../datasource';
import { DataStream } from '../streams/data_stream';
import { DatasetElement } from '../types';
import { TextLineDataset } from './text_line_dataset';
export declare enum CsvHeaderConfig {
    READ_FIRST_LINE = 0,
    NUMBERED = 1,
}
export declare class CSVDataset extends Dataset {
    protected readonly input: DataSource;
    base: TextLineDataset;
    static textColumnName: string;
    private hasHeaderLine;
    private _csvColumnNames;
    private constructor();
    readonly csvColumnNames: string[];
    private setCsvColumnNames(csvColumnNames);
    static create(input: DataSource, csvColumnNames?: CsvHeaderConfig | string[]): Promise<CSVDataset>;
    getStream(): DataStream<DatasetElement>;
    makeDatasetElement(element: DatasetElement): DatasetElement;
}
