import { IType } from './type';
import { IGeneratable } from './generatable';
import { CM2, IRenderable } from './cm2';
import { Diagnostic } from './diagnostic';
import { SourceFile } from './source-module';
import { InterfaceField } from './private/interfacetype';
import { ArgumentOptions } from './arguments';
import { IValue } from './value';
import { WireableProps } from './integrationtype';
export interface EnumClassProps {
    readonly declaredReturnType?: IType;
    readonly typeCheckedReturnType?: IType;
    readonly private?: boolean;
}
export declare class EnumClass implements IGeneratable, IType {
    readonly className: string;
    private readonly props;
    readonly typeRefName: string;
    readonly definingModule: SourceFile;
    private readonly alternatives;
    private readonly _summary;
    private readonly _details;
    constructor(className: string, props?: EnumClassProps);
    summary(summary: string): void;
    details(...lines: string[]): void;
    alternative(name: string, build: AlternativeBuilder): this;
    generateFiles(): CM2[];
    diagnostics(): Diagnostic[];
    render(code: CM2): void;
    unfold(v: IRenderable): IValue;
    toString(): string;
}
export declare type AlternativeBuilder = (x: Alternative) => void;
export declare class Alternative {
    private readonly parent;
    readonly name: string;
    private readonly positionalArgs;
    private readonly optionsType;
    private readonly retVal;
    private readonly _summary;
    private readonly _details;
    constructor(parent: EnumClass, name: string);
    summary(summary: string): void;
    details(...lines: string[]): void;
    positional(arg: PositionalArg): IRenderable;
    option(opt: InterfaceField & WireableProps): IValue;
    wire(props: Record<string, IRenderable>): void;
    factoryMethod(typeCheckedReturnType?: IType): IRenderable;
    private factoryArguments;
}
export interface PositionalArg extends ArgumentOptions, WireableProps {
    readonly name: string;
    readonly type: IType;
}
