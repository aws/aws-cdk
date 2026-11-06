import type { Resource } from '@aws-cdk/service-spec-types';

/**
 * Find an ARN property for a given resource
 *
 * Returns `undefined` if no ARN property is found, or if the ARN property is already
 * included in the primary identifier.
 */
export function findNonIdentifierArnProperty(resource: Resource) {
  const refIdentifier = resource.cfnRefIdentifier ?? resource.primaryIdentifier;
  return findArnProperty(resource, (name) => !refIdentifier?.includes(name));
}

export function findArnProperty(resource: Resource, filter: (name: string) => boolean = () => true): string | undefined {
  const prefixes = ['', resource.name];
  const suffixes = ['Arn', 'ARN'];
  const primaryIdentifierSuffixes = ['Id', 'ID'];

  const refIdentifier = resource.cfnRefIdentifier ?? resource.primaryIdentifier;

  // if the primary identifier uses a prefix that is different than the resource name, we add that to the list
  if (refIdentifier?.length === 1) {
    for (const suffix of primaryIdentifierSuffixes) {
      if (refIdentifier[0].endsWith(suffix)) {
        const prefix = refIdentifier[0].slice(0, -suffix.length);
        if (prefix && !prefixes.includes(prefix)) {
          prefixes.push(prefix);
        }
        break;
      }
    }
  }

  // this is a combination of all prefixes with all suffixes, order by prefixes as they appear in the list
  const possibleArnNames = prefixes.flatMap(prefix => suffixes.map(suffix => prefix + suffix));

  for (const name of possibleArnNames) {
    const prop = resource.attributes[name];
    if (prop && filter(name)) {
      return name;
    }
  }
  return undefined;
}

/**
 * Extracts all variables from an ARN Format template
 *
 * @example
 * extractVariablesFromArnFormat("arn:${Partition}:sagemaker:${Region}:${Account}:workteam/${WorkteamName}")
 * // returns ['Partition', 'Region', 'Account', 'WorkteamName']
 */
export function extractVariablesFromArnFormat(format: string): string[] {
  return (format.match(/\${([^{}]+)}/g) || []).map(match => match.slice(2, -1));
}

/**
 * Extracts all resource specific variables from an ARN Format template.
 *
 * To get all variables, use `extractVariablesFromArnFormat(format)`
 *
 * @example
 * extractVariablesFromArnFormat("arn:${Partition}:sagemaker:${Region}:${Account}:workteam/${WorkteamName}")
 * // returns ['WorkteamName']
 */
export function extractResourceVariablesFromArnFormat(format: string) {
  const [_arn, _partition, _service, _region, _account, ...rest] = format.split(':');
  return extractVariablesFromArnFormat(rest.join(':'));
}
