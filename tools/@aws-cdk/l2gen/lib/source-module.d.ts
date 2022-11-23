import { CM2 } from './cm2';
export interface ISourceModule {
    readonly identifier: string;
    importName(code: CM2): string;
    equals(rhs: ISourceModule): boolean;
}
export declare class SourceFile implements ISourceModule {
    readonly fileName: string;
    readonly identifier: string;
    constructor(fileName: string);
    importName(code: CM2): string;
    equals(rhs: ISourceModule): boolean;
}
export declare class InstalledModule implements ISourceModule {
    readonly moduleName: string;
    readonly identifier: string;
    constructor(moduleName: string);
    importName(): string;
    equals(rhs: ISourceModule): boolean;
}
