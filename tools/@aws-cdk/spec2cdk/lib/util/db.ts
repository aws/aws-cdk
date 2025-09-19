import { Service, SpecDatabase } from '@aws-cdk/service-spec-types';
import { GenerateServiceRequest } from '../generate';

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
