import { NDArrayMath } from '../../math';
import { SymbolicTensor } from '../graph';
import { SummedTensorArrayMap, TensorArrayMap } from '../tensor_array_map';
import { Operation } from './op';
export declare class Concat1D extends Operation {
    private x1Tensor;
    private x2Tensor;
    private yTensor;
    constructor(x1Tensor: SymbolicTensor, x2Tensor: SymbolicTensor, yTensor: SymbolicTensor);
    feedForward(math: NDArrayMath, inferecenArrays: TensorArrayMap): void;
    backProp(math: NDArrayMath, inferenceArrays: TensorArrayMap, gradientArrays: SummedTensorArrayMap): void;
}
export declare class Concat2D extends Operation {
    private x1Tensor;
    private x2Tensor;
    private axis;
    private yTensor;
    constructor(x1Tensor: SymbolicTensor, x2Tensor: SymbolicTensor, axis: number, yTensor: SymbolicTensor);
    feedForward(math: NDArrayMath, inferecenArrays: TensorArrayMap): void;
    backProp(math: NDArrayMath, inferenceArrays: TensorArrayMap, gradientArrays: SummedTensorArrayMap): void;
}
export declare class Concat3D extends Operation {
    private x1Tensor;
    private x2Tensor;
    private axis;
    private yTensor;
    constructor(x1Tensor: SymbolicTensor, x2Tensor: SymbolicTensor, axis: number, yTensor: SymbolicTensor);
    feedForward(math: NDArrayMath, inferenceArrays: TensorArrayMap): void;
    backProp(math: NDArrayMath, inferenceArrays: TensorArrayMap, gradientArrays: SummedTensorArrayMap): void;
}
export declare class Concat4D extends Operation {
    private x1Tensor;
    private x2Tensor;
    private axis;
    private yTensor;
    constructor(x1Tensor: SymbolicTensor, x2Tensor: SymbolicTensor, axis: number, yTensor: SymbolicTensor);
    feedForward(math: NDArrayMath, inferecenArrays: TensorArrayMap): void;
    backProp(math: NDArrayMath, inferenceArrays: TensorArrayMap, gradientArrays: SummedTensorArrayMap): void;
}
