import { ByteStream } from './byte_stream';
export interface FileReaderStreamOptions {
    offset?: number;
    chunkSize?: number;
}
export declare class FileReaderStream extends ByteStream {
    protected file: File | Blob;
    protected options: FileReaderStreamOptions;
    offset: number;
    chunkSize: number;
    constructor(file: File | Blob, options?: FileReaderStreamOptions);
    next(): Promise<IteratorResult<Uint8Array>>;
}
