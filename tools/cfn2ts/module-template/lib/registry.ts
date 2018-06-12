export interface PropertySpecification {
    readonly isRequired: boolean;
    readonly updateType: 'Conditional' | 'Immutable' | 'Mutable';
}

export interface ResourceClass {
    readonly RESOURCE_PROPERTIES: { [name: string]: PropertySpecification | undefined };
    readonly RESOURCE_TYPE_NAME: string;
}

const catalog: { [resourceType: string]: ResourceClass } = {};

/**
 * Register a new binding from a CloudFormation resource type name to the Resource implementation.
 *
 * @param resourceType  the CloudFormation resource type name.
 * @param resourceClass the corresponding Resource implementation.
 */
export function registerResourceType(resourceClass: ResourceClass) {
    const typeName = resourceClass.RESOURCE_TYPE_NAME;
    if (catalog.hasOwnProperty(typeName)) {
        throw new Error(`Attempted to re-define CloudFormation resource ${typeName}`);
    }
    catalog[typeName] = resourceClass;
}

/**
 * Find the resource implementation class for a given CloudFormation resource type name.
 *
 * @param resourceType the CloudFormation resource type name being looked for.
 *
 * @returns a resource implementation class, or undefined if this resource type is not declared.
 */
export function resourceImplementationFor(resourceType: string): ResourceClass | undefined {
    return catalog[resourceType];
}