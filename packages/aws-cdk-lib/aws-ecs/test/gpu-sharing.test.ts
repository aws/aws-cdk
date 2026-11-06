import { acknowledgeTestValidationRules } from './util';
import { Match, Template } from '../../assertions';
import * as cdk from '../../core';
import { Size } from '../../core';
import * as ecs from '../lib';

describe('gpu sharing', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
    acknowledgeTestValidationRules(stack);
  });

  describe('rendering', () => {
    test('renders NVIDIA MPS sharing strategy with memory in MiB and maxComputePercent', () => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // WHEN
      taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 8192,
        gpuSharing: ecs.GpuSharing.nvidiaMps({
          memory: Size.gibibytes(4),
          maxComputePercent: 50,
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            Name: 'Model',
            ResourceRequirements: [
              {
                Type: 'GPU',
                SharingStrategy: {
                  NvidiaMps: {
                    Memory: 4096,
                    MaxComputePercent: 50,
                  },
                },
              },
            ],
          }),
        ],
      });
    });

    test('omits maxComputePercent and Value when not set', () => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // WHEN
      taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.mebibytes(1) }),
      });

      // THEN
      const template = Template.fromStack(stack);
      const taskDefs = template.findResources('AWS::ECS::TaskDefinition');
      const container = Object.values(taskDefs)[0].Properties.ContainerDefinitions[0];
      expect(container.ResourceRequirements).toEqual([
        {
          Type: 'GPU',
          SharingStrategy: { NvidiaMps: { Memory: 1 } },
        },
      ]);
    });

    test('renders alongside inference accelerator resources', () => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
        inferenceAccelerators: [{ deviceName: 'device1', deviceType: 'eia2.medium' }],
      });

      // WHEN
      taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        inferenceAcceleratorResources: ['device1'],
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.mebibytes(2048) }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            ResourceRequirements: [
              { Type: 'InferenceAccelerator', Value: 'device1' },
              { Type: 'GPU', SharingStrategy: { NvidiaMps: { Memory: 2048 } } },
            ],
          }),
        ],
      });
    });

    test('allows multiple containers that share GPUs', () => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // WHEN
      taskDefinition.addContainer('ModelA', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(2), maxComputePercent: 25 }),
      });
      taskDefinition.addContainer('ModelB', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(6), maxComputePercent: 75 }),
      });
      taskDefinition.addContainer('Sidecar', {
        image: ecs.ContainerImage.fromRegistry('sidecar'),
        memoryLimitMiB: 256,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            Name: 'ModelA',
            ResourceRequirements: [{ Type: 'GPU', SharingStrategy: { NvidiaMps: { Memory: 2048, MaxComputePercent: 25 } } }],
          }),
          Match.objectLike({
            Name: 'ModelB',
            ResourceRequirements: [{ Type: 'GPU', SharingStrategy: { NvidiaMps: { Memory: 6144, MaxComputePercent: 75 } } }],
          }),
          Match.objectLike({
            Name: 'Sidecar',
            ResourceRequirements: Match.absent(),
          }),
        ],
      });
    });

    test('is supported on Managed Instances task definitions', () => {
      // GIVEN
      const taskDefinition = new ecs.TaskDefinition(stack, 'TaskDef', {
        compatibility: ecs.Compatibility.MANAGED_INSTANCES,
        cpu: '1024',
        memoryMiB: '4096',
      });

      // WHEN
      taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(4) }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        RequiresCompatibilities: ['MANAGED_INSTANCES'],
        ContainerDefinitions: [
          Match.objectLike({
            ResourceRequirements: [{ Type: 'GPU', SharingStrategy: { NvidiaMps: { Memory: 4096 } } }],
          }),
        ],
      });
    });
  });

  describe('backwards compatibility', () => {
    test('a container with only gpuCount renders a GPU resource requirement with a value', () => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // WHEN
      taskDefinition.addContainer('Training', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuCount: 2,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            ResourceRequirements: Match.exact([{ Type: 'GPU', Value: '2' }]),
          }),
        ],
      });
    });
  });

  describe('tokens', () => {
    test('passes through unresolved memory in MiB and maxComputePercent', () => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
      const memory = new cdk.CfnParameter(stack, 'GpuMemory', { type: 'Number' });
      const compute = new cdk.CfnParameter(stack, 'GpuCompute', { type: 'Number' });

      // WHEN
      taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuSharing: ecs.GpuSharing.nvidiaMps({
          memory: Size.mebibytes(memory.valueAsNumber),
          maxComputePercent: compute.valueAsNumber,
        }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            ResourceRequirements: [{
              Type: 'GPU',
              SharingStrategy: {
                NvidiaMps: {
                  Memory: { Ref: 'GpuMemory' },
                  MaxComputePercent: { Ref: 'GpuCompute' },
                },
              },
            }],
          }),
        ],
      });
    });

    test('skips the maxComputePercent range check for tokens', () => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
      const compute = new cdk.CfnParameter(stack, 'GpuCompute', { type: 'Number' });

      // WHEN
      taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(1), maxComputePercent: compute.valueAsNumber }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            ResourceRequirements: [{ Type: 'GPU', SharingStrategy: { NvidiaMps: { Memory: 1024, MaxComputePercent: { Ref: 'GpuCompute' } } } }],
          }),
        ],
      });
    });

    test('throws when an unresolved memory amount is not expressed in MiB', () => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
      const memory = new cdk.CfnParameter(stack, 'GpuMemory', { type: 'Number' });

      // THEN
      expect(() => taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(memory.valueAsNumber) }),
      })).toThrow(/Size must be specified as 'Size.mebibytes\(\)'/);
    });
  });

  describe('container validation', () => {
    test('throws when both gpuCount and gpuSharing are set', () => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // THEN
      expect(() => taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuCount: 1,
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(4) }),
      })).toThrow('cannot specify both gpuCount and gpuSharing on a container');
    });

    test('accepts a gpuCount of 0 together with gpuSharing and renders only the sharing requirement', () => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // WHEN
      taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuCount: 0,
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(4) }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            ResourceRequirements: Match.exact([{ Type: 'GPU', SharingStrategy: { NvidiaMps: { Memory: 4096 } } }]),
          }),
        ],
      });
    });

    test.each([
      ['zero', Size.mebibytes(0)],
      ['fractional MiB', Size.kibibytes(1536)],
      ['less than 1 MiB', Size.kibibytes(512)],
    ])('throws when memory is %s', (_, memory) => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // THEN
      expect(() => taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory }),
      })).toThrow(/gpuSharing memory must be a whole number of MiB and at least 1 MiB, got Size\.\w+\(/);
    });

    test.each([0, 101, -5, 50.5])('throws when maxComputePercent is %s', (maxComputePercent) => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // THEN
      expect(() => taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(1), maxComputePercent }),
      })).toThrow(`gpuSharing maxComputePercent must be an integer between 1 and 100, got ${maxComputePercent}`);
    });

    test.each([1, 100])('accepts maxComputePercent of %s', (maxComputePercent) => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // WHEN
      taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(1), maxComputePercent }),
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            ResourceRequirements: [{ Type: 'GPU', SharingStrategy: { NvidiaMps: { Memory: 1024, MaxComputePercent: maxComputePercent } } }],
          }),
        ],
      });
    });
  });

  describe('task definition validation', () => {
    test('throws when containers mix gpuSharing and gpuCount', () => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // WHEN
      taskDefinition.addContainer('Shared', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(4) }),
      });
      taskDefinition.addContainer('Exclusive', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuCount: 1,
      });

      // THEN
      expect(() => Template.fromStack(stack)).toThrow(
        'all containers that request GPUs must either all use gpuSharing or all use gpuCount; found gpuSharing on [Shared] and gpuCount on [Exclusive]',
      );
    });

    test('does not count gpuCount of 0 as an exclusive GPU request', () => {
      // GIVEN
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // WHEN
      taskDefinition.addContainer('Shared', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(4) }),
      });
      taskDefinition.addContainer('NoGpu', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuCount: 0,
      });

      // THEN
      expect(() => Template.fromStack(stack)).not.toThrow();
    });

    test('throws for EXTERNAL task definitions', () => {
      // GIVEN
      const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'TaskDef');

      // WHEN
      taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(4) }),
      });

      // THEN
      expect(() => Template.fromStack(stack)).toThrow(
        'gpuSharing is not supported for task definitions that are compatible with EXTERNAL; found gpuSharing on containers: Model',
      );
    });

    test('throws for EC2_AND_FARGATE task definitions', () => {
      // GIVEN
      const taskDefinition = new ecs.TaskDefinition(stack, 'TaskDef', {
        compatibility: ecs.Compatibility.EC2_AND_FARGATE,
        networkMode: ecs.NetworkMode.AWS_VPC,
        cpu: '1024',
        memoryMiB: '4096',
      });

      // WHEN
      taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(4) }),
      });

      // THEN
      expect(() => Template.fromStack(stack)).toThrow(/gpuSharing is not supported for task definitions that are compatible with FARGATE/);
    });

    test('throws for FARGATE_AND_MANAGED_INSTANCES task definitions', () => {
      // GIVEN
      const taskDefinition = new ecs.TaskDefinition(stack, 'TaskDef', {
        compatibility: ecs.Compatibility.FARGATE_AND_MANAGED_INSTANCES,
        cpu: '1024',
        memoryMiB: '4096',
      });

      // WHEN
      taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(4) }),
      });

      // THEN
      expect(() => Template.fromStack(stack)).toThrow(/gpuSharing is not supported for task definitions that are compatible with FARGATE/);
    });

    test('throws for Fargate task definitions', () => {
      // GIVEN
      const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

      // WHEN
      taskDefinition.addContainer('Model', {
        image: ecs.ContainerImage.fromRegistry('test'),
        gpuSharing: ecs.GpuSharing.nvidiaMps({ memory: Size.gibibytes(4) }),
      });

      // THEN
      expect(() => Template.fromStack(stack)).toThrow(/gpuSharing is not supported for task definitions that are compatible with FARGATE/);
    });
  });
});
