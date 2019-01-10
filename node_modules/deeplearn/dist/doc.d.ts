export interface HeadingMap {
    'Tensors': 'Creation' | 'Classes' | 'Transformations' | 'Slicing and Joining';
    'Operations': 'Arithmetic' | 'Basic math' | 'Matrices' | 'Convolution' | 'Normalization' | 'Images' | 'Logical' | 'RNN' | 'Reduction' | 'Classification';
    'Training': 'Gradients' | 'Optimizers' | 'Losses' | 'Classes';
    'Performance': 'Memory' | 'Timing';
    'Environment': '';
}
export declare type Heading = keyof HeadingMap;
export declare type Namespace = 'losses' | 'image' | 'train';
export interface DocInfo<H extends Heading> {
    heading: H;
    subheading?: HeadingMap[H];
    namespace?: Namespace;
    subclasses?: string[];
}
export declare function doc<H extends Heading>(info: DocInfo<H>): (...args: any[]) => void;
