import { DefaultTokenResolver, Size, StringConcat, Stack, Tokenization } from '../..';
import { Template } from '../../assertions';
import { Vpc } from '../../aws-ec2';
import * as ecs from '../../aws-ecs';
import * as iam from '../../aws-iam';
import { Compatibility, EcsEc2ContainerDefinition, EcsFargateContainerDefinition, EcsJobDefinition, JobQueue, ManagedEc2EcsComputeEnvironment } from '../lib';

test('EcsJobDefinition respects propagateTags', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EcsJobDefinition(stack, 'JobDefn', {
    propagateTags: true,
    container: new EcsEc2ContainerDefinition(stack, 'EcsContainer', {
      cpu: 256,
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memory: Size.mebibytes(2048),
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    PropagateTags: true,
  });
});

test('EcsJobDefinition uses Compatibility.EC2 for EC2 containers', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EcsJobDefinition(stack, 'ECSJobDefn', {
    container: new EcsEc2ContainerDefinition(stack, 'EcsContainer', {
      cpu: 256,
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memory: Size.mebibytes(2048),
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    PlatformCapabilities: [Compatibility.EC2],
  });
});

test('EcsJobDefinition uses Compatibility.FARGATE for Fargate containers', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EcsJobDefinition(stack, 'ECSJobDefn', {
    container: new EcsFargateContainerDefinition(stack, 'EcsContainer', {
      cpu: 256,
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memory: Size.mebibytes(2048),
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    PlatformCapabilities: [Compatibility.FARGATE],
  });
});

test('EcsJobDefinition uses runtimePlatform for Fargate containers', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new EcsJobDefinition(stack, 'ECSJobDefn', {
    container: new EcsFargateContainerDefinition(stack, 'EcsContainer', {
      cpu: 256,
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memory: Size.mebibytes(2048),
      fargateCpuArchitecture: ecs.CpuArchitecture.ARM64,
      fargateOperatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
    PlatformCapabilities: [Compatibility.FARGATE],
  });
});

test('can be imported from ARN', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const importedJob = EcsJobDefinition.fromJobDefinitionArn(stack, 'importedJobDefinition',
    'arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');

  // THEN
  expect(importedJob.jobDefinitionArn).toEqual('arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');
});

test('JobDefinitionName is parsed from arn', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const jobDefinition = new EcsJobDefinition(stack, 'JobDefn', {
    propagateTags: true,
    container: new EcsEc2ContainerDefinition(stack, 'EcsContainer', {
      cpu: 256,
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memory: Size.mebibytes(2048),
    }),
  });

  // THEN
  expect(Tokenization.resolve(jobDefinition.jobDefinitionName, {
    scope: stack,
    resolver: new DefaultTokenResolver(new StringConcat()),
  })).toEqual({
    'Fn::Select': [
      1,
      {
        'Fn::Split': [
          '/',
          {
            'Fn::Select': [
              5,
              {
                'Fn::Split': [
                  ':',
                  {
                    Ref: 'JobDefnA747EE6E',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
});

test('JobDefinitionName is parsed from arn in imported job', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  const importedJob = EcsJobDefinition.fromJobDefinitionArn(stack, 'importedJobDefinition',
    'arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');

  // THEN
  expect(importedJob.jobDefinitionName).toEqual('job-def-name');
});

test('grantSubmitJob() grants the job role the correct actions', () => {
  // GIVEN
  const stack = new Stack();
  const ecsJob = new EcsJobDefinition(stack, 'ECSJob', {
    container: new EcsFargateContainerDefinition(stack, 'EcsContainer', {
      cpu: 256,
      memory: Size.mebibytes(2048),
      image: ecs.ContainerImage.fromRegistry('foorepo/fooimage'),
    }),
  });
  const queue = new JobQueue(stack, 'queue');

  queue.addComputeEnvironment(
    new ManagedEc2EcsComputeEnvironment(stack, 'env', {
      vpc: new Vpc(stack, 'VPC'),
    }),
    1,
  );

  const user = new iam.User(stack, 'MyUser');

  // WHEN
  ecsJob.grantSubmitJob(user, queue);

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [{
        Action: 'batch:SubmitJob',
        Effect: 'Allow',
        Resource: [
          { Ref: 'ECSJobFFFEA569' },
          { 'Fn::GetAtt': ['queue276F7297', 'JobQueueArn'] },
        ],
      }],
      Version: '2012-10-17',
    },
    PolicyName: 'MyUserDefaultPolicy7B897426',
  });
});
