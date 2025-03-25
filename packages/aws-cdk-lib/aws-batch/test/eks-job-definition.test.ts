import { Template } from '../../assertions';
import * as ecs from '../../aws-ecs';
import { Stack } from '../../core';
import { DnsPolicy, EksContainerDefinition, EksJobDefinition } from '../lib';

test('EcsJobDefinition respects dnsPolicy', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EksJobDefinition(stack, 'EKSJobDefn', {
    container: new EksContainerDefinition(stack, 'EksContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    }),
    dnsPolicy: DnsPolicy.CLUSTER_FIRST,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    EksProperties: {
      PodProperties: {
        DnsPolicy: DnsPolicy.CLUSTER_FIRST,
      },
    },
  });
});

test('EcsJobDefinition respects useHostNetwork', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EksJobDefinition(stack, 'EKSJobDefn', {
    container: new EksContainerDefinition(stack, 'EksContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    }),
    useHostNetwork: true,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    EksProperties: {
      PodProperties: {
        HostNetwork: true,
      },
    },
  });
});

test('EcsJobDefinition respects serviceAccount', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EksJobDefinition(stack, 'EKSJobDefn', {
    container: new EksContainerDefinition(stack, 'EksContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    }),
    serviceAccount: 'my-service-account',
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    EksProperties: {
      PodProperties: {
        ServiceAccountName: 'my-service-account',
      },
    },
  });
});

test('can be imported from ARN', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const importedJob = EksJobDefinition.fromEksJobDefinitionArn(stack, 'importedJobDefinition',
    'arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');

  // THEN
  expect(importedJob.jobDefinitionArn).toEqual('arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');
});

// Tests for EcsJobDefinition consumable resources property
import { Match } from '../../assertions';
import { Compatibility, EcsJobDefinition } from '../lib';

test('EcsJobDefinition with consumableResources property', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EcsJobDefinition(stack, 'EcsJobDefn', {
    container: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memory: 1024,
      vcpus: 1,
    },
    consumableResources: {
      resources: [
        {
          resource: 'arn:aws:license-manager:us-east-1:123456789012:license-configuration:lic-123456789012',
          quantity: 1,
        },
      ],
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    ConsumableResourceProperties: {
      ConsumableResourceList: [
        {
          ConsumableResource: 'arn:aws:license-manager:us-east-1:123456789012:license-configuration:lic-123456789012',
          Quantity: 1,
        },
      ],
    },
  });
});

test('EcsJobDefinition without consumableResources property', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EcsJobDefinition(stack, 'EcsJobDefn', {
    container: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memory: 1024,
      vcpus: 1,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    ConsumableResourceProperties: Match.absent(),
  });
});

test('EcsJobDefinition with multiple consumableResources', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EcsJobDefinition(stack, 'EcsJobDefn', {
    container: {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memory: 1024,
      vcpus: 1,
    },
    consumableResources: {
      resources: [
        {
          resource: 'arn:aws:license-manager:us-east-1:123456789012:license-configuration:lic-123456789012',
          quantity: 1,
        },
        {
          resource: 'arn:aws:license-manager:us-east-1:123456789012:license-configuration:lic-987654321098',
          quantity: 2,
        },
      ],
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    ConsumableResourceProperties: {
      ConsumableResourceList: [
        {
          ConsumableResource: 'arn:aws:license-manager:us-east-1:123456789012:license-configuration:lic-123456789012',
          Quantity: 1,
        },
        {
          ConsumableResource: 'arn:aws:license-manager:us-east-1:123456789012:license-configuration:lic-987654321098',
          Quantity: 2,
        },
      ],
    },
  });
});

