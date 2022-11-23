import { ISourceModule } from './source-module';
import { IRenderable, CM2 } from './cm2';
export interface IType extends IRenderable {
    readonly typeRefName: string;
    readonly definingModule: ISourceModule | undefined;
    toString(): string;
}
export declare function existingType(typeRefName: string, definingModule: ISourceModule): IType;
export declare function ambientType(typeRefName: string): IType;
/**
 * FIXME: Needs to be factored differently, me no likey
 */
export declare function standardTypeRender(type: IType, code: CM2): void;
