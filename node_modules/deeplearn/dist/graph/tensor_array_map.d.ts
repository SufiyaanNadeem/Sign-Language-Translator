import { NDArrayMath } from '../math';
import { Tensor } from '../tensor';
import { SymbolicTensor } from './graph';
export declare abstract class TensorArrayMapBase {
    get(tensor: SymbolicTensor, skipChecks?: boolean): Tensor;
    delete(tensor: SymbolicTensor): void;
    nullify(tensor: SymbolicTensor): void;
    disposeArray(tensor: SymbolicTensor): void;
    size(): number;
    dispose(): void;
    hasNullArray(tensor: SymbolicTensor): boolean;
    protected dict: {
        [tensorID: number]: Tensor | null;
    };
}
export declare class TensorArrayMap extends TensorArrayMapBase {
    set(tensor: SymbolicTensor, array: Tensor | null): void;
}
export declare class SummedTensorArrayMap extends TensorArrayMapBase {
    private math;
    constructor(math: NDArrayMath);
    add(tensor: SymbolicTensor, array: Tensor): void;
}
