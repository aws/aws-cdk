import { schema } from '@aws-cdk/cfnspec';
/**
 * Name of an object in the CloudFormation spec
 *
 * This refers to a Resource, parsed from a string like 'AWS::S3::Bucket'.
 */
export declare class SpecName {
    readonly module: string;
    readonly resourceName: string;
    /**
     * Parse a string representing a name from the CloudFormation spec to a CfnName object
     */
    static parse(cfnName: string): SpecName;
    constructor(module: string, resourceName: string);
    get fqn(): string;
    relativeName(propName: string): PropertyAttributeName;
}
/**
 * Name of a property type or attribute in the CloudFormation spec.
 *
 * These are scoped to a resource, parsed from a string like 'AWS::S3::Bucket.LifecycleConfiguration'.
 */
export declare class PropertyAttributeName extends SpecName {
    readonly propAttrName: string;
    static parse(cfnName: string): PropertyAttributeName;
    constructor(module: string, resourceName: string, propAttrName: string);
    get fqn(): string;
}
/**
 * Return a list of all allowable item types, separating out primitive and complex
 * types because sometimes a complex type can have the same name as a primitive type.
 * If we only return the names in this case then the primitive type will always override
 * the complex type (not what we want).
 *
 * @returns type name and whether the type is a complex type (true) or primitive type (false)
 */
export declare function itemTypeNames(spec: schema.CollectionProperty): {
    [name: string]: boolean;
};
/**
 * Return a list of all allowable item types, separating out primitive and complex
 * types because sometimes a complex type can have the same name as a primitive type.
 * If we only return the names in this case then the primitive type will always override
 * the complex type (not what we want).
 *
 * @returns type name and whether the type is a complex type (true) or primitive type (false)
 */
export declare function scalarTypeNames(spec: schema.ScalarProperty): {
    [name: string]: boolean;
};
