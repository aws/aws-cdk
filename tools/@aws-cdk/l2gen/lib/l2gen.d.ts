import { IGeneratable } from './generatable';
import { CM2 } from './cm2';
import { IValue } from './value';
import { Diagnostic } from './diagnostic';
import { InterfaceProperty } from './private/interfacetype';
import { IType } from './type';
export declare class L2Gen implements IGeneratable {
    readonly cloudFormationResourceType: string;
    /**
     * Return a reference to the L1 type for the given property
     */
    static genTypeForProperty(typeName: string, ...propertyPath: string[]): IType;
    static define(typeName: string, cb: (x: L2Gen) => void): L2Gen;
    private readonly props;
    private readonly l1Props;
    private readonly genClassName;
    private readonly sourceFile;
    constructor(cloudFormationResourceType: string);
    addProperty(prop: PropertyProps): IValue;
    wire(props: Record<string, IValue>): void;
    generateFiles(): CM2[];
    diagnostics(): Diagnostic[];
    private uncoveredPropDiagnostics;
}
export interface PropertyProps extends InterfaceProperty {
    readonly wire?: string;
}
