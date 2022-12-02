import { ISourceModule } from './source-module';
import { IRenderable, CM2 } from './cm2';
export interface IType extends IRenderable {
    readonly typeRefName: string;
    readonly definingModule: ISourceModule | undefined;
    toString(): string;
}
export declare function existingType(typeRefName: string, definingModule: ISourceModule): StandardType;
export declare function builtinType(typeRefName: string): StandardType;
export declare function arrayOf(type: IType): IType;
export declare class StandardType implements IType {
    readonly typeRefName: string;
    readonly definingModule: ISourceModule | undefined;
    constructor(typeRefName: string, definingModule: ISourceModule | undefined);
    render(code: CM2): void;
    toString(): string;
}
/**
 * FIXME: Needs to be factored differently, me no likey
 */
export declare function standardTypeRender(type: IType, code: CM2): void;
export declare const STRING: StandardType;
export declare const NUMBER: StandardType;
export declare const BOOLEAN: StandardType;
export declare const ANY: StandardType;
export declare const VOID: StandardType;
