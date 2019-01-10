import { Tensor } from '../tensor';
export interface Initializer {
    initialize(weightsShape: number[], inputUnits: number, outputUnits: number): Tensor;
}
export declare class VarianceScalingInitializer implements Initializer {
    private scale;
    private mode;
    private distribution;
    constructor(scale?: number, mode?: 'fan_in' | 'fan_out' | 'fan_avg', distribution?: 'uniform' | 'normal');
    initialize(weightsShape: number[], inputUnits: number, outputUnits: number): Tensor;
}
export declare class ZerosInitializer implements Initializer {
    constructor();
    initialize(weightsShape: number[], inputUnits: number, outputUnits: number): Tensor;
}
export declare class OnesInitializer implements Initializer {
    constructor();
    initialize(weightsShape: number[], inputUnits: number, outputUnits: number): Tensor;
}
export declare class ConstantInitializer implements Initializer {
    private value;
    constructor(value?: number);
    initialize(weightsShape: number[], inputUnits: number, outputUnits: number): Tensor;
}
export declare class TensorInitializer implements Initializer {
    private tensor;
    constructor(tensor: Tensor);
    initialize(weightsShape: number[], inputUnits: number, outputUnits: number): Tensor;
}
export declare class RandomNormalInitializer implements Initializer {
    private mean;
    private stdev;
    constructor(mean?: number, stdev?: number);
    initialize(weightsShape: number[], inputUnits: number, outputUnits: number): Tensor;
}
export declare class RandomTruncatedNormalInitializer implements Initializer {
    private mean;
    private stdev;
    constructor(mean?: number, stdev?: number);
    initialize(weightsShape: number[], inputUnits: number, outputUnits: number): Tensor;
}
export declare class RandomUniformInitializer implements Initializer {
    private minval;
    private maxval;
    constructor(minval?: number, maxval?: number);
    initialize(weightsShape: number[], inputUnits: number, outputUnits: number): Tensor;
}
