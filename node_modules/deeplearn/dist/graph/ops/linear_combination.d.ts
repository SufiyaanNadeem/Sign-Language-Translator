import { NDArrayMath } from '../../math';
import { SymbolicTensor } from '../graph';
import { SummedTensorArrayMap, TensorArrayMap } from '../tensor_array_map';
import { Operation } from './op';
export declare class LinearCombination extends Operation {
    private x1Tensor;
    private x2Tensor;
    private c1Tensor;
    private c2Tensor;
    private outTensor;
    constructor(x1Tensor: SymbolicTensor, x2Tensor: SymbolicTensor, c1Tensor: SymbolicTensor, c2Tensor: SymbolicTensor, outTensor: SymbolicTensor);
    feedForward(math: NDArrayMath, inferenceArrays: TensorArrayMap): void;
    backProp(math: NDArrayMath, inferenceArrays: TensorArrayMap, gradientArrays: SummedTensorArrayMap): void;
}
