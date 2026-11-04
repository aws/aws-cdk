import type { Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import type { GenerateServiceRequest } from '../generate';
import type { ModuleMapScope } from '../module-topology';

/**
 * Whether the CloudFormation namespace of the service starts with one of the given prefixes.
 *
 * @param namespacePrefixes prefixes that include the separator, e.g. `AWS::`
 */
function hasNamespacePrefix(service: Service, namespacePrefixes: string[]): boolean {
  return namespacePrefixes.some((prefix) => `${service.cloudFormationNamespace}::`.startsWith(prefix));
}

/**
 * All services whose CloudFormation namespace starts with one of the given prefixes.
 *
 * @param namespacePrefixes prefixes that include the separator, e.g. `AWS::`. All services if not given.
 */
export function getAllServices(db: SpecDatabase, namespacePrefixes?: string[]) {
  const services = db.all('service');
  return namespacePrefixes ? services.filter((s) => hasNamespacePrefix(s, namespacePrefixes)) : services;
}

export function getServicesByCloudFormationNamespace(db: SpecDatabase, namespaces: string[], namespacePrefixes: string[]) {
  return namespaces
    .flatMap((ns) => db.lookup('service', 'cloudFormationNamespace', 'equals', ns))
    .filter((s) => hasNamespacePrefix(s, namespacePrefixes));
}

export function getServicesByGenerateServiceRequest(
  db: SpecDatabase,
  requests: GenerateServiceRequest[],
  namespacePrefixes: string[],
): Array<[GenerateServiceRequest, Service]> {
  const requestMap = new Map(requests.map(s => [s.namespace, s]));
  return requests
    .flatMap((s) => db.lookup('service', 'cloudFormationNamespace', 'equals', s.namespace))
    .filter((s) => hasNamespacePrefix(s, namespacePrefixes))
    .map(
      (service) => [requestMap.get(service.cloudFormationNamespace)!, service] as [GenerateServiceRequest, Service],
    );
}

/**
 * The scopes of all services whose CloudFormation namespace starts with one of the given prefixes.
 *
 * @param namespacePrefixes prefixes that include the separator, e.g. `AWS::`. All services if not given.
 */
export function getAllScopes(db: SpecDatabase, namespacePrefixes?: string[], field: keyof Service = 'name'): ModuleMapScope[] {
  return getAllServices(db, namespacePrefixes).map((s) => ({ namespace: s[field] }));
}
