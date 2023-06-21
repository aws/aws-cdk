import * as cdk from 'aws-cdk-lib';

export function serviceNetworkArnComponents(serviceNetworkName: string): cdk.ArnComponents {
  return {
    service: 'vpclattice',
    resource: 'servicenetwork',
    resourceName: serviceNetworkName,
  };
}
