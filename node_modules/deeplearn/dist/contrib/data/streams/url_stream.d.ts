import { ByteStream } from './byte_stream';
export declare class URLStream extends ByteStream {
    private impl;
    constructor(url: RequestInfo, options?: {});
    next(): Promise<IteratorResult<Uint8Array>>;
}
