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
 * Return a list of all allowable item types (either primitive or complex).
 */
export declare function itemTypeNames(spec: schema.CollectionProperty): string[];
/**
 * Return a list of all allowable types (either primitive or complex).
 */
export declare function scalarTypeNames(spec: schema.ScalarProperty): string[];
