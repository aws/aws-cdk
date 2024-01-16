import { Template } from '../../assertions';
import { Stack } from '../../core';
import { AmazonLinuxImage, CpuCredits, InstanceClass, InstanceSize, InstanceType, NatInstanceProvider, NatProvider, Vpc } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('natInstance', () => {
  test('burstable instance with explicit credit specification', () => {
    // WHEN
    const natInstanceProvider = NatProvider.instance({
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
      machineImage: new AmazonLinuxImage(),
      creditSpecification: CpuCredits.STANDARD,
    });
    new Vpc(stack, 'VPC', {
      natGatewayProvider: natInstanceProvider,
      // The 'natGateways' parameter now controls the number of NAT instances
      natGateways: 1,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
      InstanceType: 't3.large',
      CreditSpecification: {
        CPUCredits: 'standard',
      },
    });
  });
});

