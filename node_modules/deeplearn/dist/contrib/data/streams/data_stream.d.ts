import { RingBuffer } from '../util/ring_buffer';
export declare function streamFromItems<T>(items: T[]): DataStream<T>;
export declare function streamFromIncrementing(start: number): DataStream<number>;
export declare function streamFromFunction<T>(func: () => IteratorResult<T> | Promise<IteratorResult<T>>): DataStream<T>;
export declare function streamFromConcatenated<T>(baseStreams: DataStream<DataStream<T>>): DataStream<T>;
export declare function streamFromConcatenatedFunction<T>(streamFunc: () => IteratorResult<DataStream<T>>, count: number): DataStream<T>;
export declare abstract class DataStream<T> {
    abstract next(): Promise<IteratorResult<T>>;
    collectRemaining(): Promise<T[]>;
    resolveFully(): Promise<void>;
    filter(predicate: (value: T) => boolean): DataStream<T>;
    map<O>(transform: (value: T) => O): DataStream<O>;
    forEach(f: (value: T) => void): Promise<void>;
    batch(batchSize: number, smallLastBatch?: boolean): DataStream<T[]>;
    concatenate(stream: DataStream<T>): DataStream<T>;
    take(count: number): DataStream<T>;
    skip(count: number): DataStream<T>;
    prefetch(bufferSize: number): DataStream<T>;
    shuffle(windowSize: number, seed?: string): DataStream<T>;
}
export declare abstract class QueueStream<T> extends DataStream<T> {
    protected outputQueue: RingBuffer<T>;
    constructor();
    protected abstract pump(): Promise<boolean>;
    next(): Promise<IteratorResult<T>>;
}
export declare class ChainedStream<T> extends DataStream<T> {
    private stream;
    private moreStreams;
    private lastRead;
    static create<T>(streams: DataStream<DataStream<T>>): ChainedStream<T>;
    next(): Promise<IteratorResult<T>>;
    private readFromChain(lastRead);
}
export declare class PrefetchStream<T> extends DataStream<T> {
    protected upstream: DataStream<T>;
    protected bufferSize: number;
    protected buffer: RingBuffer<Promise<IteratorResult<T>>>;
    total: number;
    constructor(upstream: DataStream<T>, bufferSize: number);
    protected refill(): void;
    next(): Promise<IteratorResult<T>>;
}
export declare class ShuffleStream<T> extends PrefetchStream<T> {
    protected upstream: DataStream<T>;
    protected windowSize: number;
    private random;
    private upstreamExhausted;
    constructor(upstream: DataStream<T>, windowSize: number, seed?: string);
    private randomInt(max);
    protected chooseIndex(): number;
    next(): Promise<IteratorResult<T>>;
}
