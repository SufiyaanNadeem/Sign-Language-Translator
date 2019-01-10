import { NDArrayMath } from '../../math';
import { SymbolicTensor } from '../graph';
import { SummedTensorArrayMap, TensorArrayMap } from '../tensor_array_map';
import { Operation } from './op';
export declare class MaxPool extends Operation {
    private xTensor;
    private yTensor;
    private fieldSize;
    private stride;
    private pad;
    constructor(xTensor: SymbolicTensor, yTensor: SymbolicTensor, fieldSize: number, stride?: number, pad?: number);
    feedForward(math: NDArrayMath, inferenceArrays: TensorArrayMap): void;
    backProp(math: NDArrayMath, inferenceArrays: TensorArrayMap, gradientArrays: SummedTensorArrayMap): void;
}
