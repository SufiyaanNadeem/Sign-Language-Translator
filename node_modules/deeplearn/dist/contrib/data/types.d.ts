import { Tensor } from '../../tensor';
export declare type ElementArray = number | number[] | Tensor | string;
export declare type BatchArray = Tensor | string[];
export declare type DatasetElement = {
    [key: string]: ElementArray;
};
export declare type DatasetBatch = {
    [key: string]: BatchArray;
};
