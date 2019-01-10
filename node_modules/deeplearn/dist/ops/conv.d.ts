import { Tensor2D, Tensor3D, Tensor4D } from '../tensor';
export declare class ConvOps {
    static conv1d<T extends Tensor2D | Tensor3D>(input: T, filter: Tensor3D, stride: number, pad: 'valid' | 'same' | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): T;
    static conv2d<T extends Tensor3D | Tensor4D>(x: T, filter: Tensor4D, strides: [number, number] | number, pad: 'valid' | 'same' | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): T;
    static conv2dDerInput<T extends Tensor3D | Tensor4D>(xShape: [number, number, number, number] | [number, number, number], dy: T, filter: Tensor4D, strides: [number, number] | number, pad: 'valid' | 'same' | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): T;
    static conv2dDerFilter<T extends Tensor3D | Tensor4D>(x: T, dy: T, filterShape: [number, number, number, number], strides: [number, number] | number, pad: 'valid' | 'same' | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): Tensor4D;
    static conv2dTranspose<T extends Tensor3D | Tensor4D>(x: T, filter: Tensor4D, outputShape: [number, number, number, number] | [number, number, number], strides: [number, number] | number, pad: 'valid' | 'same' | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): T;
    static depthwiseConv2d<T extends Tensor3D | Tensor4D>(input: T, filter: Tensor4D, strides: [number, number] | number, pad: 'valid' | 'same' | number, dilations?: [number, number] | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): T;
}
