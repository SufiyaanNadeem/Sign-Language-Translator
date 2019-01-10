import { Tensor } from './tensor';
export interface Model {
    load(): Promise<void | void[]>;
    predict(input: Tensor): Tensor;
    dispose(): void;
}
