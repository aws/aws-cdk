import { CM2 } from './cm2';
export interface IGeneratable {
    generateFiles(): CM2[];
}
export declare function fileFor(typeName: string): string;
