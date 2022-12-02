import { IGeneratable } from './generatable';
import { CM2, IRenderable } from './cm2';
import { IValue } from './value';
import { Diagnostic } from './diagnostic';
import { InterfaceField } from './private/interfacetype';
import { IType } from './type';
import { WireableProps } from './integrationtype';
export declare class L2Gen implements IGeneratable {
    readonly cloudFormationResourceType: string;
    /**
     * Return a reference to the L1 type for the given property
     */
    static genTypeForProperty(typeName: string, ...propertyPath: string[]): IType;
    static genTypeForPropertyType(typeName: string, propertyTypeName: string): IType;
    static define(typeName: string, cb: (x: L2Gen) => void): L2Gen;
    private readonly props;
    private readonly baseProps;
    private readonly interfaceType;
    private readonly attributesType;
    private readonly l1Props;
    private readonly genClassName;
    private readonly sourceFile;
    private readonly interfaceProperties;
    private readonly statics;
    private readonly baseClassName;
    constructor(cloudFormationResourceType: string);
    addProperty(prop: PropertyProps): IValue;
    addPrivateProperty(prop: PropertyProps): IValue;
    addLazyPrivateProperty(prop: PropertyProps): {
        readonly factory: IRenderable;
        readonly lazyValue: IRenderable;
    };
    wire(props: Record<string, IRenderable>): void;
    private interfaceProperty;
    identification(ident: ResourceIdentification): void;
    generateFiles(): CM2[];
    private generateGenClassFile;
    diagnostics(): Diagnostic[];
    private uncoveredPropDiagnostics;
}
export declare type PropertyProps = InterfaceField & WireableProps;
export interface InterfacePropertyProps extends InterfaceField {
    readonly sourceProperty: string;
    readonly splitSelect?: number;
}
export interface ResourceIdentification {
    /**
     * ARN format in a string with placeholders, like this:
     *
     * ```
     * arn:${Partition}:wafv2:${Region}:${Account}:${Scope}/webacl/${Name}/${Id}
     * ```
     *
     * Get this from https://docs.aws.amazon.com/service-authorization/latest/reference/reference.html
     */
    readonly arnFormat: string;
    readonly fields: Record<string, IdentifierField>;
    readonly arnProperty: IdentifierField;
}
export interface IdentifierField {
    readonly name: string;
    readonly summary: string;
    readonly sourceProperty: string;
    readonly splitSelect?: number;
}
