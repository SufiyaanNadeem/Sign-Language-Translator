import { NDArrayMath } from '../../math';
import { ActivationFunction } from '../activation_functions';
import { SymbolicTensor } from '../graph';
import { SummedTensorArrayMap, TensorArrayMap } from '../tensor_array_map';
import { Operation } from './op';
export declare class ElementWiseActivation extends Operation {
    protected xTensor: SymbolicTensor;
    protected yTensor: SymbolicTensor;
    private func;
    constructor(xTensor: SymbolicTensor, yTensor: SymbolicTensor, func: ActivationFunction);
    feedForward(math: NDArrayMath, inferenceArrays: TensorArrayMap): void;
    backProp(math: NDArrayMath, inferenceArrays: TensorArrayMap, gradientArrays: SummedTensorArrayMap): void;
    dispose(): void;
}
export declare class ReLU extends ElementWiseActivation {
    constructor(xTensor: SymbolicTensor, yTensor: SymbolicTensor);
}
export declare class LeakyReLU extends ElementWiseActivation {
    constructor(xTensor: SymbolicTensor, yTensor: SymbolicTensor, alpha: number);
}
export declare class TanH extends ElementWiseActivation {
    constructor(xTensor: SymbolicTensor, yTensor: SymbolicTensor);
}
export declare class Sigmoid extends ElementWiseActivation {
    constructor(xTensor: SymbolicTensor, yTensor: SymbolicTensor);
}
export declare class Square extends ElementWiseActivation {
    constructor(xTensor: SymbolicTensor, yTensor: SymbolicTensor);
}
export declare class Elu extends ElementWiseActivation {
    constructor(xTensor: SymbolicTensor, yTensor: SymbolicTensor);
}
export declare class PReLU extends Operation {
    private xTensor;
    private alphaTensor;
    private yTensor;
    constructor(xTensor: SymbolicTensor, alphaTensor: SymbolicTensor, yTensor: SymbolicTensor);
    feedForward(math: NDArrayMath, inferenceArrays: TensorArrayMap): void;
    backProp(math: NDArrayMath, inferenceArrays: TensorArrayMap, gradientArrays: SummedTensorArrayMap): void;
}
