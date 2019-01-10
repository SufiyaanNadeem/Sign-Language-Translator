import { NDArrayMath } from '../../math';
import { ElementWiseCostFunction } from '../cost_functions';
import { SymbolicTensor } from '../graph';
import { SummedTensorArrayMap, TensorArrayMap } from '../tensor_array_map';
import { Operation } from './op';
export declare class ElementWiseCost extends Operation {
    protected x1Tensor: SymbolicTensor;
    protected x2Tensor: SymbolicTensor;
    protected yTensor: SymbolicTensor;
    protected func: ElementWiseCostFunction;
    private oneOverNScalar;
    constructor(x1Tensor: SymbolicTensor, x2Tensor: SymbolicTensor, yTensor: SymbolicTensor, func: ElementWiseCostFunction);
    feedForward(math: NDArrayMath, inferenceArrays: TensorArrayMap): void;
    backProp(math: NDArrayMath, inferenceArrays: TensorArrayMap, gradientArrays: SummedTensorArrayMap): void;
    dispose(): void;
}
export declare class MeanSquaredCost extends ElementWiseCost {
    constructor(x1Tensor: SymbolicTensor, x2Tensor: SymbolicTensor, yTensor: SymbolicTensor);
}
