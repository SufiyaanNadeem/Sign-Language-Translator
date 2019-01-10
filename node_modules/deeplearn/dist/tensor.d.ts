import { RandNormalDataTypes } from './ops/rand';
import { DataType, DataTypeMap, Rank, ShapeMap, TypedArray } from './types';
export interface TensorData {
    dataId?: DataId;
    values?: TypedArray;
}
export declare class TensorBuffer<R extends Rank> {
    shape: ShapeMap[R];
    dtype: DataType;
    values: TypedArray;
    size: number;
    private strides;
    constructor(shape: ShapeMap[R], dtype: DataType, values: TypedArray);
    set(value: number, ...locs: number[]): void;
    get(...locs: number[]): number;
    locToIndex(locs: number[]): number;
    indexToLoc(index: number): number[];
    readonly rank: number;
    toTensor(): Tensor<R>;
}
export declare type DataId = object;
export declare class Tensor<R extends Rank = Rank> {
    private static nextId;
    readonly id: number;
    dataId: DataId;
    readonly shape: ShapeMap[R];
    readonly size: number;
    readonly dtype: DataType;
    readonly rankType: R;
    readonly strides: number[];
    protected constructor(shape: ShapeMap[R], dtype: DataType, values?: TypedArray, dataId?: DataId);
    static ones<R extends Rank>(shape: ShapeMap[R], dtype?: DataType): Tensor<R>;
    static zeros<R extends Rank>(shape: ShapeMap[R], dtype?: DataType): Tensor<R>;
    static onesLike<T extends Tensor>(x: T): T;
    static zerosLike<T extends Tensor>(x: T): T;
    static like<T extends Tensor>(x: T): T;
    static make<T extends Tensor<R>, D extends DataType = 'float32', R extends Rank = Rank>(shape: ShapeMap[R], data: TensorData, dtype?: D): T;
    static fromPixels(pixels: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, numChannels?: number): Tensor3D;
    static rand<R extends Rank>(shape: ShapeMap[R], randFunction: () => number, dtype?: DataType): Tensor<R>;
    static randNormal<R extends Rank>(shape: ShapeMap[R], mean?: number, stdDev?: number, dtype?: keyof RandNormalDataTypes, seed?: number): Tensor<R>;
    static randTruncatedNormal<R extends Rank>(shape: ShapeMap[R], mean?: number, stdDev?: number, dtype?: keyof RandNormalDataTypes, seed?: number): Tensor<R>;
    static randUniform<R extends Rank>(shape: ShapeMap[R], a: number, b: number, dtype?: DataType): Tensor<R>;
    flatten(): Tensor1D;
    asScalar(): Scalar;
    as1D(): Tensor1D;
    as2D(rows: number, columns: number): Tensor2D;
    as3D(rows: number, columns: number, depth: number): Tensor3D;
    as4D(rows: number, columns: number, depth: number, depth2: number): Tensor4D;
    asType<T extends this>(this: T, dtype: DataType): T;
    readonly rank: number;
    get(...locs: number[]): number;
    val(...locs: number[]): Promise<number>;
    locToIndex(locs: number[]): number;
    indexToLoc(index: number): number[];
    getValues(): TypedArray;
    getValuesAsync(): Promise<TypedArray>;
    buffer(): TensorBuffer<R>;
    data(): Promise<TypedArray>;
    dataSync(): TypedArray;
    dispose(): void;
    private isDisposed;
    protected throwIfDisposed(): void;
    toFloat<T extends this>(this: T): T;
    toInt(): this;
    toBool(): this;
    print(verbose?: boolean): void;
    reshape<R2 extends Rank>(newShape: ShapeMap[R2]): Tensor<R2>;
    reshapeAs<T extends Tensor>(x: T): T;
    expandDims<R2 extends Rank>(axis?: number): Tensor<R2>;
    squeeze<T extends Tensor>(axis?: number[]): T;
    clone<T extends Tensor>(this: T): T;
    toString(): string;
    tile<T extends this>(this: T, reps: number[]): T;
    gather<T extends this>(this: T, indices: Tensor1D, axis?: number): T;
    matMul(b: Tensor2D, transposeA?: boolean, transposeB?: boolean): Tensor2D;
    norm(ord?: number | 'euclidean' | 'fro', axis?: number | number[], keepDims?: boolean): Tensor;
    slice<T extends Tensor<R>>(this: T, begin: ShapeMap[R], size: ShapeMap[R]): T;
    reverse<T extends Tensor>(this: T, axis?: number | number[]): T;
    concat<T extends Tensor>(this: T, x: T, axis?: number): T;
    stack(x: Tensor, axis?: number): Tensor;
    pad<T extends Tensor>(this: T, paddings: Array<[number, number]>, constantValue?: number): T;
    batchNormalization(mean: Tensor<R> | Tensor1D, variance: Tensor<R> | Tensor1D, varianceEpsilon?: number, scale?: Tensor<R> | Tensor1D, offset?: Tensor<R> | Tensor1D): Tensor<R>;
    logSumExp<T extends Tensor>(axis?: number | number[], keepDims?: boolean): T;
    sum<T extends Tensor>(axis?: number | number[], keepDims?: boolean): T;
    mean<T extends Tensor>(axis?: number | number[], keepDims?: boolean): T;
    min<T extends Tensor>(axis?: number | number[], keepDims?: boolean): T;
    max<T extends Tensor>(axis?: number | number[], keepDims?: boolean): T;
    argMin<T extends Tensor>(axis?: number): T;
    argMax<T extends Tensor>(axis?: number): T;
    add<T extends Tensor>(x: Tensor): T;
    addStrict<T extends this>(this: T, x: T): T;
    sub<T extends Tensor>(x: Tensor): T;
    subStrict<T extends this>(this: T, x: T): T;
    pow<T extends Tensor>(this: T, exp: Tensor): T;
    powStrict(exp: Tensor): Tensor<R>;
    mul<T extends Tensor>(x: Tensor): T;
    mulStrict<T extends this>(this: T, x: T): T;
    div<T extends Tensor>(x: Tensor): T;
    divStrict<T extends this>(this: T, x: T): T;
    minimum<T extends Tensor>(x: Tensor): T;
    minimumStrict<T extends this>(this: T, x: T): T;
    maximum<T extends Tensor>(x: Tensor): T;
    maximumStrict<T extends this>(this: T, x: T): T;
    transpose<T extends Tensor>(this: T, perm?: number[]): T;
    notEqual<T extends Tensor>(x: Tensor): T;
    notEqualStrict<T extends this>(this: T, x: T): T;
    less<T extends Tensor>(x: Tensor): T;
    lessStrict<T extends this>(this: T, x: T): T;
    equal<T extends Tensor>(x: Tensor): T;
    equalStrict<T extends this>(this: T, x: T): T;
    lessEqual<T extends Tensor>(x: Tensor): T;
    lessEqualStrict<T extends this>(this: T, x: T): T;
    greater<T extends Tensor>(x: Tensor): T;
    greaterStrict<T extends this>(this: T, x: T): T;
    greaterEqual<T extends Tensor>(x: Tensor): T;
    greaterEqualStrict<T extends this>(this: T, x: T): T;
    logicalAnd(x: Tensor): Tensor;
    logicalOr(x: Tensor): Tensor;
    logicalXor(x: Tensor): Tensor;
    where(condition: Tensor, x: Tensor): Tensor;
    neg<T extends Tensor>(this: T): T;
    ceil<T extends Tensor>(this: T): T;
    floor<T extends Tensor>(this: T): T;
    exp<T extends Tensor>(this: T): T;
    log<T extends Tensor>(this: T): T;
    sqrt<T extends Tensor>(this: T): T;
    square<T extends Tensor>(this: T): T;
    abs<T extends Tensor>(this: T): T;
    clipByValue(min: number, max: number): Tensor<R>;
    relu<T extends Tensor>(this: T): T;
    elu<T extends Tensor>(this: T): T;
    selu<T extends Tensor>(this: T): T;
    leakyRelu(alpha?: number): Tensor<R>;
    prelu(alpha: Tensor<R>): Tensor<R>;
    sigmoid<T extends Tensor>(this: T): T;
    sin<T extends Tensor>(this: T): T;
    cos<T extends Tensor>(this: T): T;
    tan<T extends Tensor>(this: T): T;
    asin<T extends Tensor>(this: T): T;
    acos<T extends Tensor>(this: T): T;
    atan<T extends Tensor>(this: T): T;
    sinh<T extends Tensor>(this: T): T;
    cosh<T extends Tensor>(this: T): T;
    tanh<T extends Tensor>(this: T): T;
    step<T extends Tensor>(this: T, alpha?: number): T;
    softmax<T extends this>(this: T, dim?: number): T;
    resizeBilinear<T extends Tensor3D | Tensor4D>(this: T, newShape2D: [number, number], alignCorners?: boolean): T;
    conv1d<T extends Tensor2D | Tensor3D>(this: T, filter: Tensor3D, stride: number, pad: 'valid' | 'same' | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): T;
    conv2d<T extends Tensor3D | Tensor4D>(this: T, filter: Tensor4D, strides: [number, number] | number, pad: 'valid' | 'same' | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): T;
    conv2dTranspose<T extends Tensor3D | Tensor4D>(this: T, filter: Tensor4D, outputShape: [number, number, number, number] | [number, number, number], strides: [number, number] | number, pad: 'valid' | 'same' | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): T;
    depthwiseConv2D<T extends Tensor3D | Tensor4D>(this: T, filter: Tensor4D, strides: [number, number] | number, pad: 'valid' | 'same' | number, dilations?: [number, number] | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): T;
    avgPool<T extends Tensor3D | Tensor4D>(this: T, filterSize: [number, number] | number, strides: [number, number] | number, pad: 'valid' | 'same' | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): T;
    maxPool<T extends Tensor3D | Tensor4D>(this: T, filterSize: [number, number] | number, strides: [number, number] | number, pad: 'valid' | 'same' | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): T;
    minPool<T extends Tensor3D | Tensor4D>(this: T, filterSize: [number, number] | number, strides: [number, number] | number, pad: 'valid' | 'same' | number, dimRoundingMode?: 'floor' | 'round' | 'ceil'): T;
    localResponseNormalization<T extends Tensor3D | Tensor4D>(this: T, radius?: number, bias?: number, alpha?: number, beta?: number, normRegion?: 'acrossChannels' | 'withinChannel'): T;
    variable(trainable?: boolean, name?: string, dtype?: DataType): Variable<R>;
}
export declare class Scalar extends Tensor<Rank.R0> {
    static new(value: number | boolean, dtype?: DataType): Scalar;
}
export declare class Tensor1D extends Tensor<Rank.R1> {
    static new<D extends DataType = 'float32'>(values: DataTypeMap[D] | number[] | boolean[], dtype?: D): Tensor1D;
}
export declare class Tensor2D extends Tensor<Rank.R2> {
    static new<D extends DataType = 'float32'>(shape: [number, number], values: DataTypeMap[D] | number[] | number[][] | boolean[] | boolean[][], dtype?: D): Tensor2D;
}
export declare class Tensor3D extends Tensor<Rank.R3> {
    static new<D extends DataType = 'float32'>(shape: [number, number, number], values: DataTypeMap[D] | number[] | number[][][] | boolean[] | boolean[][][], dtype?: D): Tensor3D;
}
export declare class Tensor4D extends Tensor<Rank.R4> {
    static new<D extends DataType = 'float32'>(shape: [number, number, number, number], values: DataTypeMap[D] | number[] | number[][][][] | boolean[] | boolean[][][][], dtype?: D): Tensor4D;
}
export declare class Variable<R extends Rank = Rank> extends Tensor<R> {
    trainable: boolean;
    private static nextVarId;
    name: string;
    private constructor();
    static variable<R extends Rank>(initialValue: Tensor<R>, trainable?: boolean, name?: string, dtype?: DataType): Variable<R>;
    assign(newValue: Tensor<R>): void;
}
declare const variable: typeof Variable.variable;
export { variable };
export { Tensor as NDArray, Tensor1D as Array1D, Tensor2D as Array2D, Tensor3D as Array3D, Tensor4D as Array4D };
