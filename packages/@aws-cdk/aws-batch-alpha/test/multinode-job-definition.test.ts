import { Template } from 'aws-cdk-lib/assertions';
import { InstanceClass, InstanceSize, InstanceType } from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Size, Stack } from 'aws-cdk-lib';
import { Compatibility, EcsEc2ContainerDefinition, MultiNodeJobDefinition } from '../lib';

test('MultiNodeJobDefinition respects mainNode', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new MultiNodeJobDefinition(stack, 'ECSJobDefn', {
    containers: [{
      container: new EcsEc2ContainerDefinition(stack, 'MultinodeContainer', {
        cpu: 256,
        memory: Size.mebibytes(2048),
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      }),
      startNode: 0,
      endNode: 9,
    }],
    mainNode: 5,
    instanceType: InstanceType.of(InstanceClass.R4, InstanceSize.LARGE),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    NodeProperties: {
      MainNode: 5,
      NodeRangeProperties: [{
        Container: {
          InstanceType: 'r4.large',
        },
        TargetNodes: '0:9',
      }],
      NumNodes: 10,
    },
    PlatformCapabilities: [Compatibility.EC2],
  });
});

test('EcsJobDefinition respects propagateTags', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new MultiNodeJobDefinition(stack, 'ECSJobDefn', {
    propagateTags: true,
    containers: [{
      container: new EcsEc2ContainerDefinition(stack, 'MultinodeContainer', {
        cpu: 256,
        memory: Size.mebibytes(2048),
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      }),
      startNode: 0,
      endNode: 9,
    }],
    mainNode: 0,
    instanceType: InstanceType.of(InstanceClass.R4, InstanceSize.LARGE),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    PropagateTags: true,
  });
});

test('MultiNodeJobDefinition one container', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new MultiNodeJobDefinition(stack, 'ECSJobDefn', {
    containers: [{
      container: new EcsEc2ContainerDefinition(stack, 'MultinodeContainer', {
        cpu: 256,
        memory: Size.mebibytes(2048),
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      }),
      startNode: 0,
      endNode: 9,
    }],
    mainNode: 0,
    instanceType: InstanceType.of(InstanceClass.R4, InstanceSize.LARGE),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    NodeProperties: {
      MainNode: 0,
      NodeRangeProperties: [{
        Container: {
          InstanceType: 'r4.large',
        },
        TargetNodes: '0:9',
      }],
      NumNodes: 10,
    },
    PlatformCapabilities: [Compatibility.EC2],
  });
});

test('MultiNodeJobDefinition two containers', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new MultiNodeJobDefinition(stack, 'ECSJobDefn', {
    containers: [
      {
        container: new EcsEc2ContainerDefinition(stack, 'MultinodeContainer1', {
          cpu: 256,
          memory: Size.mebibytes(2048),
          image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        }),
        startNode: 0,
        endNode: 9,
      },
      {
        container: new EcsEc2ContainerDefinition(stack, 'MultinodeContainer2', {
          cpu: 512,
          memory: Size.mebibytes(4096),
          image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        }),
        startNode: 10,
        endNode: 14,
      },
    ],
    instanceType: InstanceType.of(InstanceClass.R4, InstanceSize.LARGE),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    NodeProperties: {
      MainNode: 0,
      NodeRangeProperties: [
        {
          Container: {
            InstanceType: 'r4.large',
          },
          TargetNodes: '0:9',
        },
        {
          Container: {
            InstanceType: 'r4.large',
          },
          TargetNodes: '10:14',
        },

      ],
      NumNodes: 15,
    },
    PlatformCapabilities: [Compatibility.EC2],
  });
});

test('multinode job requires at least one container', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new MultiNodeJobDefinition(stack, 'ECSJobDefn', {
    instanceType: InstanceType.of(InstanceClass.C4, InstanceSize.LARGE),
  });

  // THEN
  expect(() => Template.fromStack(stack)).toThrow(/multinode job has no containers!/);
});
