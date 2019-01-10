import { Tensor } from '../tensor';
export interface ElementWiseCostFunction {
    cost<T extends Tensor>(x1: T, x2: T): T;
    der<T extends Tensor>(x1: T, x2: T): T;
    dispose(): void;
}
export declare class SquareCostFunc implements ElementWiseCostFunction {
    constructor();
    private halfOne;
    cost<T extends Tensor>(x1: T, x2: T): T;
    der<T extends Tensor>(x1: T, x2: T): T;
    dispose(): void;
}
