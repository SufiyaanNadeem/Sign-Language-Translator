import { Scalar, Tensor1D, Tensor2D } from '../tensor';
export interface LSTMCell {
    (data: Tensor2D, c: Tensor2D, h: Tensor2D): [Tensor2D, Tensor2D];
}
export declare class LSTMOps {
    static multiRNNCell(lstmCells: LSTMCell[], data: Tensor2D, c: Tensor2D[], h: Tensor2D[]): [Tensor2D[], Tensor2D[]];
    static basicLSTMCell(forgetBias: Scalar, lstmKernel: Tensor2D, lstmBias: Tensor1D, data: Tensor2D, c: Tensor2D, h: Tensor2D): [Tensor2D, Tensor2D];
}
