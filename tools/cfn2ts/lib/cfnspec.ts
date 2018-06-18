import * as util from './util';

export enum PrimitiveType {
    String = 'String',
    Long = 'Long',
    Integer = 'Integer',
    Double = 'Double',
    Boolean = 'Boolean',
    Timestamp = 'Timestamp',
    Json = 'Json'
}

/**
 * For the meaning of these fields, see:
 *
 * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification-format.html
 */
export interface PropertySpec {
    Required: boolean
    Documentation: string
    DuplicatesAllowed?: boolean
    UpdateType?: string

    /**
     * Property type's name, in case of a non-primitive type
     *
     * Exactly one of Type or PrimitiveType will be set
     */
    Type?: string

    /**
     * Property type's primitive name (by enum), in case of a primitive type
     *
     * Exactly one of Type or PrimitiveType will be set
     */
    PrimitiveType?: PrimitiveType

    /**
     * Property's element type, in case of a list of non-primitive types
     *
     * Exactly one of ItemType or PrimitiveItemType will be set if Type == "List" | "Map"
     */
    ItemType?: string

    /**
     * Property's element type, in case of a list of primitive types
     *
     * Exactly one of ItemType or PrimitiveItemType will be set if Type == "List" | "Map"
     */
    PrimitiveItemType?: PrimitiveType

    // The following fields are (sometimes) used in the SAM specification
    //
    // They seem to mean the following:
    //
    // - If [Item]Type and Primitive[Item]Type are both set, both are acceptable. We will always use the
    //   non-primitive type for maximum type safety.
    // - If [Primitive]ItemTypes and [Primitive]Types are both set, both a list as well as a scalar value
    //   are acceptable. We will always use the list for maximum arity compatibility.
    // - If there are multiple values in the arrays, all of them are acceptable. There is no discriminator
    //   field unfortunately.
    Types?: string[]
    PrimitiveTypes?: PrimitiveType[]
    ItemTypes?: string[]
    PrimitiveItemTypes?: PrimitiveType[]
}

export function isList(spec: PropertySpec) {
    // First case covers CloudFormation specs, the other two cover SAM specs
    return spec.Type === "List" || spec.ItemTypes || spec.PrimitiveItemTypes;
}

export function isMap(spec: PropertySpec) {
    return spec.Type === "Map";
}

export function isCollection(spec: PropertySpec) {
    return isList(spec) || isMap(spec);
}

export function isScalar(spec: PropertySpec) {
    return (spec.Type && spec.Type !== "List" && spec.Type !== "Map")
        || spec.PrimitiveType
        || spec.Types
        || spec.PrimitiveTypes;
}

export function isPrimitive(typeName: string): boolean {
    return (typeName === PrimitiveType.String
        || typeName === PrimitiveType.Long
        || typeName === PrimitiveType.Integer
        || typeName === PrimitiveType.Double
        || typeName === PrimitiveType.Boolean
        || typeName === PrimitiveType.Timestamp
        || typeName === PrimitiveType.Json);
}

export function complexScalarTypeNames(spec: PropertySpec): string[] {
    let ret = [];
    if (spec.Type && spec.Type !== "List" && spec.Type !== "Map") { ret.push(spec.Type); }
    if (spec.Types) { ret = ret.concat(spec.Types); }
    return ret;
}

export function primitiveScalarTypeNames(spec: PropertySpec): string[] {
    let ret = [];
    if (spec.PrimitiveType) { ret.push(spec.PrimitiveType); }
    if (spec.PrimitiveTypes) { ret = ret.concat(spec.PrimitiveTypes); }
    return ret;
}

/**
 * Return a list of all allowable types (either primitive or complex), if this spec refers to a scalar type
 */
export function scalarTypeNames(spec: PropertySpec): string[] {
    return complexScalarTypeNames(spec).concat(primitiveScalarTypeNames(spec));
}

export function complexItemTypeNames(spec: PropertySpec): string[] {
    let ret = [];
    if (spec.ItemType) { ret.push(spec.ItemType); }
    if (spec.ItemTypes) { ret = ret.concat(spec.ItemTypes); }
    return ret;
}

export function primitiveItemTypeNames(spec: PropertySpec): string[] {
    let ret = [];
    if (spec.PrimitiveItemType) { ret.push(spec.PrimitiveItemType); }
    if (spec.PrimitiveItemTypes) { ret = ret.concat(spec.PrimitiveItemTypes); }
    return ret;
}

/**
 * Return a list of all allowable item types (either primitive or complex), if this spec refers to a collection type
 */
export function itemTypeNames(spec: PropertySpec): string[] {
    return complexItemTypeNames(spec).concat(primitiveItemTypeNames(spec));
}

/**
 * Whether the indicated property type is a primtive type, or a collection composed only of primitive types
 */
export function isDeeplyPrimitive(spec: PropertySpec) {
    return (!spec.Type || spec.Type === "Map" || spec.Type === "List")
        && (!spec.ItemType || spec.ItemType === "Tag")
        && !spec.Types
        && !spec.ItemTypes;
}

/**
 * Whether the given type is a union type (i.e., allows more than one type in this place)
 */
export function isUnionType(spec: PropertySpec) {
    return scalarTypeNames(spec).length > 1;
}

export function complexType(spec: PropertySpec) {
    if (spec.Types) { return spec.Types[0]; }
    if (spec.Type) { return spec.Type; }
    throw new Error("No complex type type found in " + spec);
}

export type PropertySpecs = { [name: string]: PropertySpec };

export interface PropertyType {
    Documentation: string
    Properties: PropertySpecs
}

// tslint:disable:no-empty-interface
export interface AttributeSpec extends PropertySpec {
}
// tslint:enable:no-empty-interface

export interface ResourceType {
    Documentation: string
    Properties: PropertySpecs
    Attributes: { [attributeName: string]: AttributeSpec }

    /**
     * Indicates if this resource requires a transform at the template level.
     */
    RequiredTransform?: string
}

// tslint:disable:variable-name
export class Spec {
    /**
     * Property type definitions.
     */
    public PropertyTypes: { [propertyName: string]: PropertyType } = { };

    /**
     * Resource type definitions.
     */
    public ResourceTypes: { [resourceName: string]: ResourceType } = { };

    /**
     * The resource spec version.
     */
    public ResourceSpecificationVersion: string = '';

    /**
     * The transform that needs to be applied for all resources in this spec.
     */
    public ResourceSpecificationTransform?: string;
}
// tslint:enable:variable-name

/**
 * Name of an object in the CloudFormation spec
 *
 * This refers to a Resource, parsed from a string like 'AWS::S3::Bucket'.
 */
export class SpecName {
    /**
     * Parse a string representing a name from the CloudFormation spec to a CfnName object
     */
    public static parse(cfnName: string): SpecName {
        const parts = cfnName.split('::');
        const module = parts.slice(0, parts.length - 1).join('::');

        const lastParts = parts[parts.length - 1].split('.');

        if (lastParts.length === 1) {
            // Resource name, looks like A::B::C
            return new SpecName(module, lastParts[0]);
        }

        throw new Error("Not a CloudFormation resource name: " + cfnName);
    }

    constructor(readonly module: string, readonly resourceName: string) {
    }

    public get fqn() {
        return this.module + '::' + this.resourceName;
    }

    public relativeName(propName: string): PropertyAttributeName {
        return new PropertyAttributeName(this.module, this.resourceName, propName);
    }
}

/**
 * Name of a property type or attribute in the CloudFormation spec.
 *
 * These are scoped to a resource, parsed from a string like 'AWS::S3::Bucket.LifecycleConfiguration'.
 */
export class PropertyAttributeName extends SpecName {
    public static parse(cfnName: string): PropertyAttributeName {
        if (cfnName === "Tag") {
            // Crazy
            return new PropertyAttributeName('', '', 'Tag');
        }

        const parts = cfnName.split('::');
        const module = parts.slice(0, parts.length - 1).join('::');

        const lastParts = parts[parts.length - 1].split('.');

        if (lastParts.length === 2) {
            // PropertyType name, looks like A::B::C.D
            return new PropertyAttributeName(module, lastParts[0], lastParts[1]);
        }

        throw new Error("Not a recognized PropertyType name: " + cfnName);
    }

    constructor(module: string, resourceName: string, readonly propAttrName: string) {
        super(module, resourceName);
    }

    public get fqn() {
        return util.joinIf(super.fqn, '.',  this.propAttrName);
    }
}