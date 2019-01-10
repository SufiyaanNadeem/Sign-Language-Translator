import { RingBuffer } from './ring_buffer';
export declare class GrowingRingBuffer<T> extends RingBuffer<T> {
    private static INITIAL_CAPACITY;
    constructor();
    isFull(): boolean;
    push(value: T): void;
    unshift(value: T): void;
    private expand();
}
