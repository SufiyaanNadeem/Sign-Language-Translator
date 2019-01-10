import { DataStream } from './data_stream';
import { StringStream } from './string_stream';
export declare abstract class ByteStream extends DataStream<Uint8Array> {
    decodeUTF8(): StringStream;
}
