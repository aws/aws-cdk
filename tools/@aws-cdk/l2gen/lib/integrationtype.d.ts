import { IType } from './type';
import { IGeneratable } from './generatable';
import { CM2, IRenderable } from './cm2';
import { Diagnostic } from './diagnostic';
import { SourceFile } from './source-module';
import { InterfaceField, InterfaceTypeDefinition } from './private/interfacetype';
import { ArgumentOptions, Arguments } from './arguments';
import { IValue } from './value';
export declare class IntegrationType implements IGeneratable, IType {
    readonly className: string;
    readonly typeRefName: string;
    readonly definingModule: SourceFile;
    readonly bindOptionsType: InterfaceTypeDefinition;
    readonly bindResultType: InterfaceTypeDefinition;
    private readonly integrations;
    constructor(className: string);
    integration(name: string, build: IntegrationBuilder): this;
    bindOption(opt: InterfaceField): IValue;
    bindResult(opt: InterfaceField): void;
    generateFiles(): CM2[];
    private generateThis;
    bindArguments(): Arguments;
    bindReturnType(): import("./type").StandardType | InterfaceTypeDefinition;
    diagnostics(): Diagnostic[];
    render(code: CM2): void;
    toString(): string;
}
export declare type IntegrationBuilder = (x: Integration) => void;
export declare class Integration implements IGeneratable {
    private readonly parent;
    readonly name: string;
    private readonly positionalArgs;
    private readonly optionsType;
    private readonly sourceFile;
    private readonly bindResult;
    constructor(parent: IntegrationType, name: string);
    private constructorArguments;
    wireBindResult(props: Record<string, IValue>): void;
    generateFiles(): CM2[];
    diagnostics(): Diagnostic[];
    positional(name: string, type: IType, options?: ArgumentOptions): IValue;
    option(opt: InterfaceField): IValue;
}
export declare type ValueTransform = (x: IRenderable) => IRenderable;
export interface WireableProps {
    readonly wire?: string;
    readonly wireTransform?: ValueTransform;
}
export interface IWireable {
    wire(props: Record<string, IRenderable>): void;
}
export declare function maybeWire<A extends IRenderable>(receiver: IWireable, props: WireableProps, value: A): A;
