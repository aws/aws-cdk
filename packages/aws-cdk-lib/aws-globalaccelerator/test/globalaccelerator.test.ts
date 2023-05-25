import { testFixture } from './util';
import { Template } from '../../assertions';
import { Duration } from '../../core';
import * as ga from '../lib';

test('create accelerator', () => {
  // GIVEN
  const { stack } = testFixture();

  // WHEN
  new ga.Accelerator(stack, 'Accelerator');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::Accelerator', {
    Enabled: true,
  });
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
  Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::Listener', {
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
  });
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
  Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::Listener', {
    PortRanges: [
      {
        FromPort: 123,
        ToPort: 123,
      },
    ],
  });
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
  Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::EndpointGroup', {
    EndpointGroupRegion: {
      Ref: 'AWS::Region',
    },
    ListenerArn: {
      'Fn::GetAtt': [
        'Listener828B0E81',
        'ListenerArn',
      ],
    },
  });
});

test('endpointgroup region is the first endpoint\'s region', () => {
  // GIVEN
  const { stack } = testFixture();

  // WHEN
  const accelerator = new ga.Accelerator(stack, 'Accelerator');
  const listener = new ga.Listener(stack, 'Listener', {
    accelerator,
    portRanges: [{ fromPort: 80 }],
  });
  listener.addEndpointGroup('Group', {
    endpoints: [
      new ga.RawEndpoint({
        endpointId: 'x-123',
        region: 'us-bla-5',
      }),
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::EndpointGroup', {
    EndpointGroupRegion: 'us-bla-5',
  });
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
  Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::EndpointGroup', {
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
  });
});

test('addEndpoint', () => {
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

  listener.addEndpointGroup('Group', {
    endpoints: [
      new ga.RawEndpoint({
        endpointId: 'i-123',
        preserveClientIp: true,
        weight: 30,
      }),
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::EndpointGroup', {
    EndpointConfigurations: [
      {
        EndpointId: 'i-123',
        ClientIPPreservationEnabled: true,
        Weight: 30,
      },
    ],
  });
});

test('create accelerator with uniqueResourceName if acceleratorName is not specified', () => {
  // GIVEN
  const { stack } = testFixture();

  // WHEN
  new ga.Accelerator(stack, 'Accelerator');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::GlobalAccelerator::Accelerator', {
    Enabled: true,
    Name: 'StackAccelerator472129D8',
  });
});

test('should validate acceleratorName minimum and maximum length', () => {
  const { stack } = testFixture();

  expect(() => {
    new ga.Accelerator(stack, 'AcceleratorShort', {
      acceleratorName: '',
    });
  }).toThrowError(/must have length between 1 and 64/);
  expect(() => {
    new ga.Accelerator(stack, 'AcceleratorLong', {
      acceleratorName: 'a'.repeat(100),
    });
  }).toThrowError(/must have length between 1 and 64/);
});
