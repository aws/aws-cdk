import { IGeneratable } from './generatable';
import { IType } from './type';
import { CM2 } from './cm2';
import { IValue } from './value';
import { SourceFile } from './source-module';
import { Diagnostic } from './diagnostic';
export declare class Enum implements IGeneratable, IType {
    readonly enumName: string;
    readonly typeRefName: string;
    readonly definingModule: SourceFile;
    private readonly members;
    private readonly mappings;
    private cloudFormationMapping?;
    constructor(enumName: string);
    addMember(props: MemberProps): IValue;
    toCloudFormation(value: IValue): IValue;
    generateFiles(): CM2[];
    render(code: CM2): void;
    diagnostics(): never[];
}
export interface MemberProps {
    readonly name: string;
    readonly summary: string;
    readonly details?: string;
    readonly cloudFormationString?: string;
}
export declare class EnumMapping implements IGeneratable {
    private readonly functionName;
    private readonly sourceFile;
    private readonly mapping;
    private fromType?;
    private toType?;
    constructor(functionName: string);
    get hasValues(): boolean;
    addMapping(from: IValue, to: IValue): void;
    diagnostics(): Diagnostic[];
    generateFiles(): CM2[];
    map(value: IValue): IValue;
}
