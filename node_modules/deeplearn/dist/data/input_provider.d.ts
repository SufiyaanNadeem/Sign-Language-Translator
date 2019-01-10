import { Tensor } from '../tensor';
export interface InputProvider {
    getNextCopy(): Tensor;
    disposeCopy(copy: Tensor): void;
}
export interface ShuffledInputProviderBuilder {
    getInputProviders(): InputProvider[];
}
export declare abstract class InMemoryShuffledInputProviderBuilder implements ShuffledInputProviderBuilder {
    protected inputs: Tensor[][];
    protected shuffledIndices: Uint32Array;
    protected numInputs: number;
    protected idx: number;
    protected inputCounter: number;
    protected epoch: number;
    constructor(inputs: Tensor[][]);
    protected getCurrentExampleIndex(): number;
    protected getNextInput(inputId: number): Tensor;
    getEpoch(): number;
    getInputProviders(): InputProvider[];
    abstract getInputProvider(inputId: number): InputProvider;
}
export declare class InCPUMemoryShuffledInputProviderBuilder extends InMemoryShuffledInputProviderBuilder {
    getInputProvider(inputId: number): InputProvider;
}
export declare class InGPUMemoryShuffledInputProviderBuilder extends InMemoryShuffledInputProviderBuilder {
    getInputProvider(inputId: number): InputProvider;
}
