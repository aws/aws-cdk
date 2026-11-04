import type { Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import type { GenerateServiceRequest } from '../generate';
import type { ModuleMapScope } from '../module-topology';

/**
 * Whether the CloudFormation namespace of the service is, or is nested under, one of the given namespaces.
 *
 * For example, `AWS::S3` belongs to `AWS` and to `AWS::S3`, but not to `AWSome`.
 *
 * @param namespaces namespaces without the trailing separator, e.g. `AWS`
 */
function belongsToNamespace(service: Service, namespaces: string[]): boolean {
  return namespaces.some((namespace) => `${service.cloudFormationNamespace}::`.startsWith(`${namespace}::`));
}

/**
 * All services that belong to one of the given namespaces.
 *
 * @param namespaces namespaces without the trailing separator, e.g. `AWS`. All services if not given.
 */
export function getAllServices(db: SpecDatabase, namespaces?: string[]) {
  const services = db.all('service');
  return namespaces ? services.filter((s) => belongsToNamespace(s, namespaces)) : services;
}

export function getServicesByCloudFormationNamespace(db: SpecDatabase, cloudFormationNamespaces: string[], namespaces: string[]) {
  return cloudFormationNamespaces
    .flatMap((ns) => db.lookup('service', 'cloudFormationNamespace', 'equals', ns))
    .filter((s) => belongsToNamespace(s, namespaces));
}

export function getServicesByGenerateServiceRequest(
  db: SpecDatabase,
  requests: GenerateServiceRequest[],
  namespaces: string[],
): Array<[GenerateServiceRequest, Service]> {
  const requestMap = new Map(requests.map(s => [s.namespace, s]));
  return requests
    .flatMap((s) => db.lookup('service', 'cloudFormationNamespace', 'equals', s.namespace))
    .filter((s) => belongsToNamespace(s, namespaces))
    .map(
      (service) => [requestMap.get(service.cloudFormationNamespace)!, service] as [GenerateServiceRequest, Service],
    );
}

/**
 * The scopes of all services that belong to one of the given namespaces.
 *
 * @param namespaces namespaces without the trailing separator, e.g. `AWS`. All services if not given.
 */
export function getAllScopes(db: SpecDatabase, namespaces?: string[], field: keyof Service = 'name'): ModuleMapScope[] {
  return getAllServices(db, namespaces).map((s) => ({ namespace: s[field] }));
}
