import { NDArrayMath } from '../../math';
import { Scalar, Tensor1D } from '../../tensor';
import { SymbolicTensor } from '../graph';
import { SummedTensorArrayMap, TensorArrayMap } from '../tensor_array_map';
import { Operation } from './op';
export declare class Softmax extends Operation {
    private logitsTensor;
    private output;
    constructor(logitsTensor: SymbolicTensor, output: SymbolicTensor);
    feedForward(math: NDArrayMath, inferenceArrays: TensorArrayMap): void;
    backProp(math: NDArrayMath, inferenceArrays: TensorArrayMap, gradientArrays: SummedTensorArrayMap): void;
}
export declare class SoftmaxCrossEntropyCost extends Operation {
    private logitsTensor;
    private labelTensor;
    private yTensor;
    constructor(logitsTensor: SymbolicTensor, labelTensor: SymbolicTensor, yTensor: SymbolicTensor);
    feedForward(math: NDArrayMath, inferenceArrays: TensorArrayMap): void;
    backProp(math: NDArrayMath, inferenceArrays: TensorArrayMap, gradientArrays: SummedTensorArrayMap): void;
    disposeTransientArrays(inferenceArrays: TensorArrayMap, gradientArrays: SummedTensorArrayMap): void;
    dispose(): void;
    private softmaxTensor;
    private epsilon;
}
export declare function crossEntropyCost(math: NDArrayMath, y: Tensor1D, target: Tensor1D, epsilon: Scalar): Scalar;
