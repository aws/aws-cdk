import { PromisedRegionInfo } from "./promised-region-info";

export async function servicePrincipal(service: string, region: PromisedRegionInfo): Promise<string> {
  switch (service) {
    // Services with a regional AND partitional principal
    case 'codedeploy':
    case 'logs':
      return `${service}.${region.name}.${await region.domainSuffix}`;

    // Services with a partitional principal
    case 'application-autoscaling':
    case 'autoscaling':
    case 'ec2':
    case 'events':
    case 'lambda':
      return `${service}.${await region.domainSuffix}`;

    // Services with a regional principal
    case 'states':
      return `${service}.${region.name}.amazonaws.com`;

    // Services with a universal principal across all regions/partitions
    case 'sns':
    case 'sqs':
    default:
      return `${service}.amazonaws.com`;
  }
}
