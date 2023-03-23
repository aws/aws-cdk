import { Template } from '@aws-cdk/assertions';
import * as ecs from '@aws-cdk/aws-ecs';
import { Stack } from '@aws-cdk/core';
import { DnsPolicy, EksContainerDefinition, EksJobDefinition } from '../lib';


test('EcsJobDefinition respects dnsPolicy', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EksJobDefinition(stack, 'EKSJobDefn', {
    containerDefinition: new EksContainerDefinition(stack, 'EksContainer', {
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
    containerDefinition: new EksContainerDefinition(stack, 'EksContainer', {
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
    containerDefinition: new EksContainerDefinition(stack, 'EksContainer', {
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
