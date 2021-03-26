import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { Duration } from '@aws-cdk/core';
import * as ga from '../lib';
import { testFixture } from './util';

test('create accelerator', () => {
  // GIVEN
  const { stack } = testFixture();

  // WHEN
  new ga.Accelerator(stack, 'Accelerator');

  // THEN
  expect(stack).to(haveResourceLike('AWS::GlobalAccelerator::Accelerator', {
    Enabled: true,
  }));
});

test('create listener', () => {
  // GIVEN
  const { stack } = testFixture();

  // WHEN
  const accelerator = new ga.Accelerator(stack, 'Accelerator');
  new ga.Listener(stack, 'Listener', {
    accelerator,
    portRanges: [
      {
        fromPort: 80,
        toPort: 80,
      },
    ],
  });

  // THEN
  expect(stack).to(haveResourceLike('AWS::GlobalAccelerator::Listener', {
    AcceleratorArn: {
      'Fn::GetAtt': [
        'Accelerator8EB0B6B1',
        'AcceleratorArn',
      ],
    },
    PortRanges: [
      {
        FromPort: 80,
        ToPort: 80,
      },
    ],
    Protocol: 'TCP',
    ClientAffinity: 'NONE',
  }));
});

test('toPort defaults to fromPort if left out', () => {
  // GIVEN
  const { stack } = testFixture();

  // WHEN
  const accelerator = new ga.Accelerator(stack, 'Accelerator');
  accelerator.addListener('Listener', {
    portRanges: [
      { fromPort: 123 },
    ],
  });

  // THEN
  expect(stack).to(haveResourceLike('AWS::GlobalAccelerator::Listener', {
    PortRanges: [
      {
        FromPort: 123,
        ToPort: 123,
      },
    ],
  }));
});

test('create endpointgroup', () => {
  // GIVEN
  const { stack } = testFixture();

  // WHEN
  const accelerator = new ga.Accelerator(stack, 'Accelerator');
  const listener = new ga.Listener(stack, 'Listener', {
    accelerator,
    portRanges: [
      {
        fromPort: 80,
        toPort: 80,
      },
    ],
  });
  new ga.EndpointGroup(stack, 'Group', { listener });

  // THEN
  expect(stack).to(haveResourceLike('AWS::GlobalAccelerator::EndpointGroup', {
    EndpointGroupRegion: {
      Ref: 'AWS::Region',
    },
    ListenerArn: {
      'Fn::GetAtt': [
        'Listener828B0E81',
        'ListenerArn',
      ],
    },
  }));
});

test('endpointgroup with all parameters', () => {
  // GIVEN
  const { stack } = testFixture();

  // WHEN
  const accelerator = new ga.Accelerator(stack, 'Accelerator');
  const listener = accelerator.addListener('Listener', {
    portRanges: [{ fromPort: 80 }],
  });
  listener.addEndpointGroup('Group', {
    region: 'us-bla-5',
    healthCheckInterval: Duration.seconds(10),
    healthCheckPath: '/ping',
    healthCheckPort: 123,
    healthCheckProtocol: ga.HealthCheckProtocol.HTTPS,
    healthCheckThreshold: 23,
    trafficDialPercentage: 86,
    portOverrides: [
      {
        listenerPort: 80,
        endpointPort: 8080,
      },
    ],
  });

  // THEN
  expect(stack).to(haveResourceLike('AWS::GlobalAccelerator::EndpointGroup', {
    EndpointGroupRegion: 'us-bla-5',
    HealthCheckIntervalSeconds: 10,
    HealthCheckPath: '/ping',
    HealthCheckPort: 123,
    HealthCheckProtocol: 'HTTPS',
    PortOverrides: [
      {
        EndpointPort: 8080,
        ListenerPort: 80,
      },
    ],
    ThresholdCount: 23,
    TrafficDialPercentage: 86,
  }));
});

test('addEndpoint', () => {
  // GIVEN
  const { stack, vpc } = testFixture();

  // WHEN
  const accelerator = new ga.Accelerator(stack, 'Accelerator');
  const listener = new ga.Listener(stack, 'Listener', {
    accelerator,
    portRanges: [
      {
        fromPort: 80,
        toPort: 80,
      },
    ],
  });
  const endpointGroup = new ga.EndpointGroup(stack, 'Group', { listener });
  const instance = new ec2.Instance(stack, 'Instance', {
    vpc,
    machineImage: new ec2.AmazonLinuxImage(),
    instanceType: new ec2.InstanceType('t3.small'),
  });
  endpointGroup.addEndpoint('endpoint', instance.instanceId);

  // THEN
  expect(stack).to(haveResourceLike('AWS::GlobalAccelerator::EndpointGroup', {
    EndpointConfigurations: [
      {
        EndpointId: {
          Ref: 'InstanceC1063A87',
        },
      },
    ],
  }));
});

test('addLoadBalancer', () => {
  // GIVEN
  const { stack, vpc } = testFixture();

  // WHEN
  const accelerator = new ga.Accelerator(stack, 'Accelerator');
  const listener = new ga.Listener(stack, 'Listener', {
    accelerator,
    portRanges: [
      {
        fromPort: 80,
        toPort: 80,
      },
    ],
  });
  const endpointGroup = new ga.EndpointGroup(stack, 'Group', { listener });
  const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc, internetFacing: true });
  endpointGroup.addLoadBalancer('endpoint', alb);

  // THEN
  expect(stack).to(haveResourceLike('AWS::GlobalAccelerator::EndpointGroup', {
    EndpointConfigurations: [
      {
        EndpointId: {
          Ref: 'ALBAEE750D2',
        },
      },
    ],
  }));
});

test('addElasticIpAddress', () => {
  // GIVEN
  const { stack } = testFixture();

  // WHEN
  const accelerator = new ga.Accelerator(stack, 'Accelerator');
  const listener = new ga.Listener(stack, 'Listener', {
    accelerator,
    portRanges: [
      {
        fromPort: 80,
        toPort: 80,
      },
    ],
  });
  const endpointGroup = new ga.EndpointGroup(stack, 'Group', { listener });
  const eip = new ec2.CfnEIP(stack, 'ElasticIpAddress');
  endpointGroup.addElasticIpAddress('endpoint', eip);

  // THEN
  expect(stack).to(haveResourceLike('AWS::GlobalAccelerator::EndpointGroup', {
    EndpointConfigurations: [
      {
        EndpointId: {
          'Fn::GetAtt': [
            'ElasticIpAddress',
            'AllocationId',
          ],
        },
      },
    ],
  }));
});

test('addEc2Instance', () => {
  // GIVEN
  const { stack, vpc } = testFixture();

  // WHEN
  const accelerator = new ga.Accelerator(stack, 'Accelerator');
  const listener = new ga.Listener(stack, 'Listener', {
    accelerator,
    portRanges: [
      {
        fromPort: 80,
        toPort: 80,
      },
    ],
  });
  const endpointGroup = new ga.EndpointGroup(stack, 'Group', { listener });
  const instance = new ec2.Instance(stack, 'Instance', {
    vpc,
    machineImage: new ec2.AmazonLinuxImage(),
    instanceType: new ec2.InstanceType('t3.small'),
  });
  endpointGroup.addEc2Instance('endpoint', instance);

  // THEN
  expect(stack).to(haveResourceLike('AWS::GlobalAccelerator::EndpointGroup', {
    EndpointConfigurations: [
      {
        EndpointId: {
          Ref: 'InstanceC1063A87',
        },
      },
    ],
  }));
});
