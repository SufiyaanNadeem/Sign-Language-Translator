import { Tensor } from '../tensor';
export declare class UnaryOps {
    static neg<T extends Tensor>(x: T): T;
    static ceil<T extends Tensor>(x: T): T;
    static floor<T extends Tensor>(x: T): T;
    static exp<T extends Tensor>(x: T): T;
    static log<T extends Tensor>(x: T): T;
    static sqrt<T extends Tensor>(x: T): T;
    static square<T extends Tensor>(x: T): T;
    static abs<T extends Tensor>(x: T): T;
    static clipByValue<T extends Tensor>(x: T, clipValueMin: number, clipValueMax: number): T;
    static relu<T extends Tensor>(x: T): T;
    static elu<T extends Tensor>(x: T): T;
    static selu<T extends Tensor>(x: T): T;
    static leakyRelu<T extends Tensor>(x: T, alpha?: number): T;
    static prelu<T extends Tensor>(x: T, alpha: T): T;
    static sigmoid<T extends Tensor>(x: T): T;
    static sin<T extends Tensor>(x: T): T;
    static cos<T extends Tensor>(x: T): T;
    static tan<T extends Tensor>(x: T): T;
    static asin<T extends Tensor>(x: T): T;
    static acos<T extends Tensor>(x: T): T;
    static atan<T extends Tensor>(x: T): T;
    static sinh<T extends Tensor>(x: T): T;
    static cosh<T extends Tensor>(x: T): T;
    static tanh<T extends Tensor>(x: T): T;
    static step<T extends Tensor>(x: T, alpha?: number): T;
}
