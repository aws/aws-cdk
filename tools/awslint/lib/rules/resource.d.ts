import * as reflect from 'jsii-reflect';
import { Linter } from '../linter';
import { CfnResourceReflection } from './cfn-resource';
import { ConstructReflection } from './construct';
import { CoreTypes } from './core-types';
export declare const resourceLinter: Linter<ResourceReflection>;
export interface Attribute {
    site: AttributeSite;
    property: reflect.Property;
    cfnAttributeNames: string[];
}
export declare enum AttributeSite {
    Interface = "interface",
    Class = "class"
}
export declare class ResourceReflection {
    readonly construct: ConstructReflection;
    /**
     * @returns all resource constructs (everything that extends `cdk.Resource`)
     */
    static findAll(assembly: reflect.Assembly): ResourceReflection[];
    readonly attributes: Attribute[];
    readonly fqn: string;
    readonly assembly: reflect.Assembly;
    readonly sys: reflect.TypeSystem;
    readonly cfn: CfnResourceReflection;
    readonly basename: string;
    readonly core: CoreTypes;
    readonly physicalNameProp?: reflect.Property;
    constructor(construct: ConstructReflection);
    private findPhysicalNameProp;
    /**
     * Attribute properties are all the properties that begin with the type name (e.g. bucketXxx).
     */
    private findAttributeProperties;
}
