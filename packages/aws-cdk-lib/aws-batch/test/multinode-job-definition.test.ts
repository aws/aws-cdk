import { Template } from '../../assertions';
import { InstanceClass, InstanceSize, InstanceType } from '../../aws-ec2';
import * as ecs from '../../aws-ecs';
import { Size, Stack } from '../../core';
import { Compatibility, EcsEc2ContainerDefinition, MultiNodeJobDefinition, OptimalInstanceType } from '../lib';

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
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    NodeProperties: {
      MainNode: 5,
      NodeRangeProperties: [{
        Container: { },
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
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    PropagateTags: true,
  });
});

test('MultiNodeJobDefinition respects instanceType', () => {
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
    instanceType: InstanceType.of(InstanceClass.R4, InstanceSize.LARGE),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    NodeProperties: {
      NodeRangeProperties: [{
        Container: {
        },
        TargetNodes: '0:9',
      }],
      NumNodes: 10,
    },
    PlatformCapabilities: [Compatibility.EC2],
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
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    NodeProperties: {
      MainNode: 0,
      NodeRangeProperties: [{
        Container: {
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
  new MultiNodeJobDefinition(stack, 'ECSJobDefn');

  // THEN
  expect(() => Template.fromStack(stack)).toThrow(/multinode job has no containers!/);
});

test('multinode job returns a dummy instance type when accessing `instanceType`', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const jobDef = new MultiNodeJobDefinition(stack, 'ECSJobDefn');

  // THEN
  expect(jobDef.instanceType).toBeInstanceOf(OptimalInstanceType);
});
