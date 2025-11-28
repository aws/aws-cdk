import { Resource } from '@aws-cdk/service-spec-types';

/**
 * Find an ARN property for a given resource
 *
 * Returns `undefined` if no ARN property is found, or if the ARN property is already
 * included in the primary identifier.
 */
export function findNonIdentifierArnProperty(resource: Resource) {
  return findArnProperty(resource, (name) => !resource.primaryIdentifier?.includes(name));
}

export function findArnProperty(resource: Resource, filter: (name: string) => boolean = () => true): any {
  const possibleArnNames = ['Arn', `${resource.name}Arn`];
  for (const name of possibleArnNames) {
    const prop = resource.attributes[name];
    if (prop && filter(name)) {
      return name;
    }
  }
  return undefined;
}

