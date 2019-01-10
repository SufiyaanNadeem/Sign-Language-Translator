import { DataSource } from '../datasource';
import { ByteStream } from '../streams/byte_stream';
export declare class URLDataSource extends DataSource {
    protected readonly url: RequestInfo;
    protected readonly options: RequestInit;
    constructor(url: RequestInfo, options?: RequestInit);
    getStream(): ByteStream;
}
