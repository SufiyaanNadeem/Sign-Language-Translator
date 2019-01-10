export declare class RingBuffer<T> {
    capacity: number;
    protected begin: number;
    protected end: number;
    protected doubledCapacity: number;
    protected data: T[];
    constructor(capacity: number);
    protected wrap(index: number): number;
    protected get(index: number): T;
    protected set(index: number, value: T): void;
    length(): number;
    isFull(): boolean;
    isEmpty(): boolean;
    push(value: T): void;
    pop(): T;
    unshift(value: T): void;
    shift(): T;
    shuffleExcise(relativeIndex: number): T;
}
