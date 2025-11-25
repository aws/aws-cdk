import { Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { GenerateServiceRequest } from '../generate';
import { ModuleMapScope } from '../module-topology';

export function getAllServices(db: SpecDatabase) {
  return db.all('service');
}

export function getServicesByCloudFormationNamespace(db: SpecDatabase, namespaces: string[]) {
  return namespaces.flatMap((ns) => db.lookup('service', 'cloudFormationNamespace', 'equals', ns));
}

export function getServicesByGenerateServiceRequest(db: SpecDatabase, requests: GenerateServiceRequest[]): Array<[GenerateServiceRequest, Service]> {
  const requestMap = new Map(requests.map(s => [s.namespace, s]));
  return requests
    .flatMap((s) => db.lookup('service', 'cloudFormationNamespace', 'equals', s.namespace))
    .map(
      (service) => [requestMap.get(service.cloudFormationNamespace)!, service] as [GenerateServiceRequest, Service],
    );
}

export function getAllScopes(db: SpecDatabase, field: keyof Service = 'name'): ModuleMapScope[] {
  return db.all('service').map((s) => ({ namespace: s[field] }));
}
