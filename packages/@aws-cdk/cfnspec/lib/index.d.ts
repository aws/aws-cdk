import * as schema from './schema';
export { schema };
export * from './canned-metrics';
/**
 * The complete AWS CloudFormation Resource specification, having any CDK patches and enhancements included in it.
 */
export declare function specification(): schema.Specification;
/**
 * The complete AWS CloudFormation Resource specification, having any CDK patches and enhancements included in it.
 */
export declare function docs(): schema.CloudFormationDocsFile;
/**
 * Return the resource specification for the given typename
 *
 * Validates that the resource exists. If you don't want this validating behavior, read from
 * specification() directly.
 */
export declare function resourceSpecification(typeName: string): schema.ResourceType;
/**
 * Return documentation for the given type
 */
export declare function typeDocs(resourceName: string, propertyTypeName?: string): schema.CloudFormationTypeDocs;
/**
 * Get the resource augmentations for a given type
 */
export declare function resourceAugmentation(typeName: string): schema.ResourceAugmentation;
/**
 * Get the resource augmentations for a given type
 */
export declare function cfnLintAnnotations(typeName: string): schema.CfnLintResourceAnnotations;
/**
 * Return the property specification for the given resource's property
 */
export declare function propertySpecification(typeName: string, propertyName: string): schema.Property;
/**
 * The list of resource type names defined in the ``specification``.
 */
export declare function resourceTypes(): string[];
/**
 * The list of namespaces defined in the ``specification``, that is resource name prefixes down to the second ``::``.
 */
export declare function namespaces(): string[];
/**
 * Obtain a filtered version of the AWS CloudFormation specification.
 *
 * @param filter the predicate to be used in order to filter which resource types from the ``Specification`` to extract.
 *         When passed as a ``string``, only the specified resource type will be extracted. When passed as a
 *         ``RegExp``, all matching resource types will be extracted. When passed as a ``function``, all resource
 *         types for which the function returned ``true`` will be extracted.
 *
 * @return a coherent sub-set of the AWS CloudFormation Resource specification, including all property types related
 *     to the selected resource types.
 */
export declare function filteredSpecification(filter: string | RegExp | Filter): schema.Specification;
export type Filter = (name: string) => boolean;
/**
 * Return the properties of the given type that require the given scrutiny type
 */
export declare function scrutinizablePropertyNames(resourceType: string, scrutinyTypes: schema.PropertyScrutinyType[]): string[];
/**
 * Return the names of the resource types that need to be subjected to additional scrutiny
 */
export declare function scrutinizableResourceTypes(scrutinyTypes: schema.ResourceScrutinyType[]): string[];
