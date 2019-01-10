import { DataSource } from '../datasource';
import { ByteStream } from '../streams/byte_stream';
import { FileReaderStreamOptions } from '../streams/filereader_stream';
export declare class FileDataSource extends DataSource {
    protected readonly input: File | Blob;
    protected readonly options: FileReaderStreamOptions;
    constructor(input: File | Blob, options?: FileReaderStreamOptions);
    getStream(): ByteStream;
}
