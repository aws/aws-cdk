import { Template } from 'aws-cdk-lib/assertions';
import { ServiceNetwork, ServiceNetworkAuthType } from '../lib/service-network';
import { Stack } from 'aws-cdk-lib/core';

const SERVICE_NETWORK_CFN_RESOURCE = 'AWS::VpcLattice::ServiceNetwork';

describe('service-network', () => {
  test('default properties', () => {
    const stack = new Stack(undefined, 'Stack');

    new ServiceNetwork(stack, 'ServiceNetwork', {
      serviceNetworkName: 'MyServiceNetwork',
    });

    Template.fromStack(stack).hasResourceProperties(SERVICE_NETWORK_CFN_RESOURCE, {
      Name: 'MyServiceNetwork',
      SharingConfig: {
        enabled: false,
      },
    });
  });

  test('all properties', () => {
    const stack = new Stack(undefined, 'Stack');

    new ServiceNetwork(stack, 'ServiceNetwork', {
      serviceNetworkName: 'MyServiceNetwork',
      authType: ServiceNetworkAuthType.AWS_IAM,
      enableSharing: true,
    });

    Template.fromStack(stack).hasResourceProperties(SERVICE_NETWORK_CFN_RESOURCE, {
      Name: 'MyServiceNetwork',
      AuthType: 'AWS_IAM',
      SharingConfig: {
        enabled: true,
      },
    });
  });
});
