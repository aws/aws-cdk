import { CM2 } from './cm2';
import { Diagnostic } from './diagnostic';
export interface IGeneratable {
    generateFiles(): CM2[];
    diagnostics(): Diagnostic[];
}
export declare function fileFor(typeName: string, visibility: 'public' | 'private'): string;
