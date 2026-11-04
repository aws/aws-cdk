import type { Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import type { GenerateServiceRequest } from '../generate';
import type { ModuleMapScope } from '../module-topology';

function belongsToOrg(service: Service, orgs: string[]): boolean {
  return orgs.some((org) => `${service.cloudFormationNamespace}::`.startsWith(`${org}::`));
}

export function getAllServices(db: SpecDatabase, orgs?: string[]) {
  const services = db.all('service');
  return orgs ? services.filter((s) => belongsToOrg(s, orgs)) : services;
}

export function getServicesByCloudFormationNamespace(db: SpecDatabase, namespaces: string[], orgs: string[]) {
  return namespaces
    .flatMap((ns) => db.lookup('service', 'cloudFormationNamespace', 'equals', ns))
    .filter((s) => belongsToOrg(s, orgs));
}

export function getServicesByGenerateServiceRequest(
  db: SpecDatabase,
  requests: GenerateServiceRequest[],
  orgs?: string[],
): Array<[GenerateServiceRequest, Service]> {
  const requestMap = new Map(requests.map(s => [s.namespace, s]));
  return requests
    .flatMap((s) => db.lookup('service', 'cloudFormationNamespace', 'equals', s.namespace))
    .filter((s) => !orgs || belongsToOrg(s, orgs))
    .map(
      (service) => [requestMap.get(service.cloudFormationNamespace)!, service] as [GenerateServiceRequest, Service],
    );
}

export function getAllScopes(db: SpecDatabase, orgs?: string[], field: keyof Service = 'name'): ModuleMapScope[] {
  return getAllServices(db, orgs).map((s) => ({ namespace: s[field] }));
}
