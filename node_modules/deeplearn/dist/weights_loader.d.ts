import { NamedTensorMap } from './types';
export declare type WeightsManifestConfig = WeightsManifestGroupConfig[];
export interface WeightsManifestGroupConfig {
    paths: string[];
    weights: WeightsManifestEntry[];
}
export interface WeightsManifestEntry {
    name: string;
    shape: number[];
    dtype: 'float32' | 'int32';
}
export declare function loadWeights(manifest: WeightsManifestConfig, filePathPrefix?: string, weightNames?: string[]): Promise<NamedTensorMap>;
