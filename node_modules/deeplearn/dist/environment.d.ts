import { Engine, MemoryInfo } from './engine';
import { KernelBackend } from './kernels/backend';
import { NDArrayMath } from './math';
export declare enum Type {
    NUMBER = 0,
    BOOLEAN = 1,
    STRING = 2,
}
export interface Features {
    'DEBUG'?: boolean;
    'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION'?: number;
    'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'?: boolean;
    'WEBGL_VERSION'?: number;
    'WEBGL_FLOAT_TEXTURE_ENABLED'?: boolean;
    'WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED'?: boolean;
    'BACKEND'?: BackendType;
}
export declare const URL_PROPERTIES: URLProperty[];
export interface URLProperty {
    name: keyof Features;
    type: Type;
}
export declare type BackendType = 'webgl' | 'cpu' | string;
export declare class Environment {
    private features;
    private globalMath;
    private globalEngine;
    private BACKEND_REGISTRY;
    private backends;
    private currentBackendType;
    constructor(features?: Features);
    static setBackend(backendType: BackendType, safeMode?: boolean): void;
    static getBackend(): BackendType;
    static memory(): MemoryInfo;
    get<K extends keyof Features>(feature: K): Features[K];
    set<K extends keyof Features>(feature: K, value: Features[K]): void;
    getBestBackendType(): BackendType;
    private evaluateFeature<K>(feature);
    setFeatures(features: Features): void;
    reset(): void;
    setMath(math: NDArrayMath, backend?: BackendType | KernelBackend, safeMode?: boolean): void;
    findBackend(name: BackendType): KernelBackend;
    addCustomBackend(name: BackendType, factory: () => KernelBackend): boolean;
    registerBackend(name: BackendType, factory: () => KernelBackend): boolean;
    readonly math: NDArrayMath;
    readonly engine: Engine;
    private initEngine();
}
export declare let ENV: Environment;
