import { Tensor } from '../tensor';
import { InMemoryDataset } from './dataset';
export interface TensorInfo {
    path: string;
    name: string;
    dataType: 'uint8' | 'float32' | 'png';
    shape: number[];
}
export interface XhrDatasetConfig {
    data: TensorInfo[];
    labelClassNames?: string[];
    modelConfigs: {
        [modelName: string]: XhrModelConfig;
    };
}
export interface XhrModelConfig {
    path: string;
}
export declare function getXhrDatasetConfig(jsonConfigPath: string): Promise<{
    [datasetName: string]: XhrDatasetConfig;
}>;
export declare class XhrDataset extends InMemoryDataset {
    protected xhrDatasetConfig: XhrDatasetConfig;
    constructor(xhrDatasetConfig: XhrDatasetConfig);
    protected getTensor<T extends Tensor>(info: TensorInfo): Promise<T[]>;
    fetchData(): Promise<void>;
}
