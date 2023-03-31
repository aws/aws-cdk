import { Template } from '@aws-cdk/assertions';
import { InstanceClass, InstanceSize, InstanceType } from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { /*Aws,*/ Duration, Size, Stack } from '@aws-cdk/core';
import { capitalizePropertyNames } from '@aws-cdk/core/lib/util';
import { Action, EksContainerDefinition, EcsJobDefinition, Reason, RetryStrategy, EcsEc2ContainerDefinition, EksJobDefinition, EcsJobDefinitionProps, EksJobDefinitionProps, Compatibility, MultiNodeJobDefinitionProps, MultiNodeJobDefinition } from '../lib';
import { CfnJobDefinitionProps } from '../lib/batch.generated';

const defaultExpectedEcsProps: CfnJobDefinitionProps = {
  type: 'container',
  platformCapabilities: [Compatibility.EC2],
};
const defaultExpectedEksProps: CfnJobDefinitionProps = {
  type: 'container',
};
const defaultExpectedMultiNodeProps: CfnJobDefinitionProps = {
  type: 'multinode',
};

let stack: Stack;

let pascalCaseExpectedEcsProps: any;
let pascalCaseExpectedEksProps: any;
let pascalCaseExpectedMultiNodeProps: any;

let defaultEcsProps: EcsJobDefinitionProps;
let defaultEksProps: EksJobDefinitionProps;
let defaultMultiNodeProps: MultiNodeJobDefinitionProps;

let expectedProps: any;
let defaultProps: any;

describe.each([EcsJobDefinition, EksJobDefinition, MultiNodeJobDefinition])('%p type JobDefinition', (JobDefinition) => {
  // GIVEN
  beforeEach(() => {
    stack = new Stack();

    pascalCaseExpectedEcsProps = capitalizePropertyNames(stack, defaultExpectedEcsProps);
    pascalCaseExpectedEksProps = capitalizePropertyNames(stack, defaultExpectedEksProps);
    pascalCaseExpectedMultiNodeProps = capitalizePropertyNames(stack, defaultExpectedMultiNodeProps);

    defaultEcsProps = {
      container: new EcsEc2ContainerDefinition(stack, 'EcsContainer', {
        cpu: 256,
        memory: Size.mebibytes(2048),
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      }),
    };
    defaultEksProps = {
      container: new EksContainerDefinition(stack, 'EksContainer', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      }),
    };
    defaultMultiNodeProps = {
      containers: [{
        container: new EcsEc2ContainerDefinition(stack, 'MultinodeEcsContainer', {
          cpu: 256,
          memory: Size.mebibytes(2048),
          image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        }),
        startNode: 0,
        endNode: 10,
      }],
      mainNode: 0,
      instanceType: InstanceType.of(InstanceClass.R4, InstanceSize.LARGE),
    };
    switch (JobDefinition) {
      case EcsJobDefinition:
        expectedProps = pascalCaseExpectedEcsProps;
        defaultProps = defaultEcsProps;
        break;
      case EksJobDefinition:
        expectedProps = pascalCaseExpectedEksProps;
        defaultProps = defaultEksProps;
        break;
      case MultiNodeJobDefinition:
        expectedProps = pascalCaseExpectedMultiNodeProps;
        defaultProps = defaultMultiNodeProps;
        break;
    }
  });

  test('JobDefinition respects name', () => {
    // WHEN
    new JobDefinition(stack, 'JobDefn', {
      ...defaultProps,
      jobDefinitionName: 'myEcsJob',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...expectedProps,
      JobDefinitionName: 'myEcsJob',
    });
  });

  test('JobDefinition respects parameters', () => {
    // WHEN
    new JobDefinition(stack, 'JobDefn', {
      ...defaultProps,
      parameters: {
        foo: 'bar',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...expectedProps,
      Parameters: {
        foo: 'bar',
      },
    });
  });

  test('JobDefinition respects retryAttempts', () => {
    // WHEN
    new JobDefinition(stack, 'JobDefn', {
      ...defaultProps,
      retryAttempts: 8,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...expectedProps,
      RetryStrategy: {
        Attempts: 8,
      },
    });
  });

  test('JobDefinition respects retryStrategies', () => {
    // WHEN
    new JobDefinition(stack, 'JobDefn', {
      ...defaultProps,
      retryStrategies: [
        RetryStrategy.of(Action.EXIT, Reason.CANNOT_PULL_CONTAINER),
        RetryStrategy.of(Action.RETRY, Reason.NON_ZERO_EXIT_CODE),
        RetryStrategy.of(Action.RETRY, Reason.SPOT_INSTANCE_RECLAIMED),
        RetryStrategy.of(Action.RETRY, Reason.custom({
          onExitCode: '40*',
          onReason: 'reason*',
          onStatusReason: 'statusReason',
        })),
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...expectedProps,
      RetryStrategy: {
        EvaluateOnExit: [
          {
            Action: 'EXIT',
            OnReason: 'CannotPullContainerError:*',
          },
          {
            Action: 'RETRY',
            OnExitCode: '*',
          },
          {
            Action: 'RETRY',
            OnStatusReason: 'Host EC2*',
          },
          {
            Action: 'RETRY',
            OnExitCode: '40*',
            OnReason: 'reason*',
            OnStatusReason: 'statusReason',
          },
        ],
      },
    });
  });

  test('JobDefinition respects schedulingPriority', () => {
    // WHEN
    new JobDefinition(stack, 'JobDefn', {
      ...defaultProps,
      schedulingPriority: 10,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...expectedProps,
      SchedulingPriority: 10,
    });
  });

  test('JobDefinition respects schedulingPriority', () => {
    // WHEN
    new JobDefinition(stack, 'JobDefn', {
      ...defaultProps,
      timeout: Duration.minutes(10),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...expectedProps,
      Timeout: {
        AttemptDurationSeconds: 600,
      },
    });
  });

  test('JobDefinition respects addRetryStrategy()', () => {
    // WHEN
    const jobDefn = new JobDefinition(stack, 'JobDefn', {
      ...defaultProps,
    });

    jobDefn.addRetryStrategy(RetryStrategy.of(Action.RETRY, Reason.SPOT_INSTANCE_RECLAIMED));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...expectedProps,
      RetryStrategy: {
        EvaluateOnExit: [
          {
            Action: 'RETRY',
            OnStatusReason: 'Host EC2*',
          },
        ],
      },
    });
  });

  /*
  test('can be imported from name', () => {
    // WHEN
    const importedJob = JobDefinition.fromJobDefinitionName(stack, 'job-def-clone', 'job-def-name');

    // THEN
    expect(importedJob.jobDefinitionName).toEqual('job-def-name');
    expect(importedJob.jobDefinitionArn)
      .toEqual(`arn:${Aws.PARTITION}:batch:${Aws.REGION}:${Aws.ACCOUNT_ID}:job-definition/job-def-name`);
  });
  */
});
