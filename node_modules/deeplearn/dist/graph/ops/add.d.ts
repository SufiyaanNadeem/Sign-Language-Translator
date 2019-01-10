import { NDArrayMath } from '../../math';
import { SymbolicTensor } from '../graph';
import { SummedTensorArrayMap, TensorArrayMap } from '../tensor_array_map';
import { Operation } from './op';
export declare class Add extends Operation {
    private x1Tensor;
    private x2Tensor;
    private yTensor;
    private dySizeScalar;
    constructor(x1Tensor: SymbolicTensor, x2Tensor: SymbolicTensor, yTensor: SymbolicTensor);
    feedForward(math: NDArrayMath, inferenceArrays: TensorArrayMap): void;
    backProp(math: NDArrayMath, inferenceArrays: TensorArrayMap, gradientArrays: SummedTensorArrayMap): void;
    dispose(): void;
}
