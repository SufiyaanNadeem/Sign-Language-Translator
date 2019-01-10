import { NDArrayMath } from '../../math';
import { Tensor } from '../../tensor';
import { SymbolicTensor } from '../graph';
import { SummedTensorArrayMap, TensorArrayMap } from '../tensor_array_map';
import { Operation } from './op';
export declare class Reshape<T1 extends Tensor, T2 extends Tensor> extends Operation {
    private xTensor;
    private yTensor;
    constructor(xTensor: SymbolicTensor, yTensor: SymbolicTensor);
    feedForward(math: NDArrayMath, inferenceArrays: TensorArrayMap): void;
    backProp(math: NDArrayMath, inferenceArrays: TensorArrayMap, gradientArrays: SummedTensorArrayMap): void;
}
