import { schema } from '@aws-cdk/cfnspec';
import { PropertyAttributeName, SpecName } from './spec-utils';
export declare const CONSTRUCTS_NAMESPACE = "constructs";
export declare const CORE_NAMESPACE = "cdk";
export declare const CFN_PARSE_NAMESPACE = "cfn_parse";
/**
 * The name of a class or method in the generated code.
 *
 * Has constructor functions to generate them from the CloudFormation specification.
 *
 * This refers to TypeScript constructs (typically a class)
 */
export declare class CodeName {
    readonly packageName: string;
    readonly namespace: string;
    readonly className: string;
    readonly specName?: SpecName | undefined;
    readonly methodName?: string | undefined;
    static forCfnResource(specName: SpecName, affix: string): CodeName;
    static forResourceProperties(resourceName: CodeName): CodeName;
    static forPropertyType(specName: PropertyAttributeName, resourceClass: CodeName): CodeName;
    static forPrimitive(primitiveName: string): CodeName;
    constructor(packageName: string, namespace: string, className: string, specName?: SpecName | undefined, methodName?: string | undefined);
    /**
     * Alias for className
     *
     * Simply returns the top-level declaration name,  but reads better at the call site if
     * we're generating a function instead of a class.
     */
    get functionName(): string;
    /**
     * Return the fully qualified name of the TypeScript object
     *
     * (When referred to it from the same package)
     */
    get fqn(): string;
    referToMethod(methodName: string): CodeName;
    /**
     * Return a relative name from a given name to this name.
     *
     * Strips off the namespace if they're the same, otherwise leaves the namespace on.
     */
    relativeTo(fromName: CodeName): CodeName;
}
export declare const TAG_NAME: CodeName;
export declare const TOKEN_NAME: CodeName;
/**
 * Resource attribute
 */
export declare class Attribute {
    readonly propertyName: string;
    readonly attributeType: string;
    readonly constructorArguments: string;
    constructor(propertyName: string, attributeType: string, constructorArguments: string);
}
/**
 * Return the package in which this CfnName should be stored
 *
 * The "aws-cdk-" part is implicit.
 *
 * Example: AWS::EC2 -> ec2
 */
export declare function packageName(module: SpecName | string): string;
/**
 * Return the name by which the cloudformation-property mapping function will be defined
 *
 * It will not be defined in a namespace, because otherwise we would have to export it and
 * we don't want to expose it to clients.
 */
export declare function cfnMapperName(typeName: CodeName): CodeName;
/**
 * Return the name of the function that converts a pure CloudFormation value
 * to the appropriate CDK struct instance.
 */
export declare function fromCfnFactoryName(typeName: CodeName): CodeName;
/**
 * Return the name for the type-checking method
 */
export declare function validatorName(typeName: CodeName): CodeName;
/**
 * Determine how we will render a CloudFormation attribute in the code
 *
 * This consists of:
 *
 * - The type we will generate for the attribute, including its base class and docs.
 * - The property name we will use to refer to the attribute.
 */
export declare function attributeDefinition(attributeName: string, spec: schema.Attribute): Attribute;
/**
 * Convert a CloudFormation name to a nice TypeScript name
 *
 * We use a library to camelcase, and fix up some things that translate incorrectly.
 *
 * For example, the library breaks when pluralizing an abbreviation, such as "ProviderARNs" -> "providerArNs".
 *
 * We currently recognize "ARNs", "MBs" and "AZs".
 */
export declare function cloudFormationToScriptName(name: string): string;
export declare function isPrimitive(type: CodeName): boolean;
/**
 * Translate a list of type references in a resource context to a list of code names
 *
 * @param resourceContext
 * @param types name and whether the type is a complex type (true) or primitive type (false)
 */
export declare function specTypesToCodeTypes(resourceContext: CodeName, types: {
    [name: string]: boolean;
}): CodeName[];
export interface PropertyVisitor<T> {
    /**
     * A single type (either built-in or complex)
     */
    visitAtom(type: CodeName): T;
    /**
     * A union of atomic types
     */
    visitAtomUnion(types: CodeName[]): T;
    /**
     * A list of atoms
     */
    visitList(itemType: CodeName): T;
    /**
     * List of unions
     */
    visitUnionList(itemTypes: CodeName[]): T;
    /**
     * Map of atoms
     */
    visitMap(itemType: CodeName): T;
    /**
     * Map of unions
     */
    visitUnionMap(itemTypes: CodeName[]): T;
    /**
     * Map of lists
     */
    visitMapOfLists(itemType: CodeName): T;
    /**
     * Union of list type and atom type
     */
    visitListOrAtom(scalarTypes: CodeName[], itemTypes: CodeName[]): any;
}
/**
 * Invoke the right visitor method for the given property, depending on its type
 *
 * We use the term "atom" in this context to mean a type that can only accept a single
 * value of a given type. This is to contrast it with collections and unions.
 */
export declare function typeDispatch<T>(resourceContext: CodeName, spec: schema.Property, visitor: PropertyVisitor<T>): T;
