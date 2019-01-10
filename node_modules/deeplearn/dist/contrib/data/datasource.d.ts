import { ByteStream } from './streams/byte_stream';
export declare abstract class DataSource {
    abstract getStream(): ByteStream;
}
