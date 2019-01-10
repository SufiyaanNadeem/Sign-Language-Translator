import { DataStream } from './data_stream';
export declare abstract class StringStream extends DataStream<string> {
    split(separator: string): StringStream;
}
