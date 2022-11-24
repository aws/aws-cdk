import { IType } from './type';
import { IGeneratable } from './generatable';
import { CM2, IRenderable } from './cm2';
import { Diagnostic } from './diagnostic';
import { SourceFile } from './source-module';
import { InterfaceProperty } from './private/interfacetype';
import { ArgumentOptions } from './arguments';
import { IValue } from './value';
export interface EnumClassProps {
    readonly declaredReturnType?: IType;
    readonly typeCheckedReturnType?: IType;
}
export declare class EnumClass implements IGeneratable, IType {
    readonly className: string;
    private readonly props;
    readonly typeRefName: string;
    readonly definingModule: SourceFile;
    private readonly alternatives;
    constructor(className: string, props?: EnumClassProps);
    alternative(name: string, build: AlternativeBuilder): this;
    generateFiles(): CM2[];
    diagnostics(): Diagnostic[];
    render(code: CM2): void;
    unfold(v: IValue): IValue;
    toString(): string;
}
export declare type AlternativeBuilder = (x: Alternative) => void;
export declare class Alternative {
    private readonly parent;
    readonly name: string;
    private readonly positionalArgs;
    private readonly optionsType;
    private readonly retVal;
    constructor(parent: EnumClass, name: string);
    positional(name: string, type: IType, options?: ArgumentOptions): IValue;
    option(opt: InterfaceProperty): IValue;
    wire(props: Record<string, IValue>): void;
    factoryMethod(typeCheckedReturnType?: IType): IRenderable;
}
