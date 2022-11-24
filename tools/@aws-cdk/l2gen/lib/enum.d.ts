import { IGeneratable } from './generatable';
import { IType } from './type';
import { CM2 } from './cm2';
import { IValue } from './value';
import { ISourceModule } from './source-module';
export declare class Enum implements IGeneratable, IType {
    readonly enumName: string;
    readonly typeRefName: string;
    readonly definingModule: ISourceModule;
    private readonly members;
    constructor(enumName: string);
    addMember(props: MemberProps): IValue;
    generateFiles(): CM2[];
    render(code: CM2): void;
    diagnostics(): never[];
}
export interface MemberProps {
    readonly name: string;
    readonly summary: string;
    readonly details?: string;
}
