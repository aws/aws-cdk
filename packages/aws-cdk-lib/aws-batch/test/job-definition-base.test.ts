import { capitalizePropertyNames } from './utils';
import { Template } from '../../assertions';
import { CfnJobDefinitionProps } from '../../aws-batch';
import { InstanceClass, InstanceSize, InstanceType } from '../../aws-ec2';
import * as ecs from '../../aws-ecs';
import { Duration, Size, Stack } from '../../core';
import * as batch from '../lib';

const defaultExpectedEcsProps: CfnJobDefinitionProps = {
  type: 'container',
  platformCapabilities: [batch.Compatibility.EC2],
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

let defaultEcsProps: batch.EcsJobDefinitionProps;
let defaultEksProps: batch.EksJobDefinitionProps;
let defaultMultiNodeProps: batch.MultiNodeJobDefinitionProps;

let expectedProps: any;
let defaultProps: any;

describe.each([batch.EcsJobDefinition, batch.EksJobDefinition, batch.MultiNodeJobDefinition])('%p type JobDefinition', (JobDefinition) => {
  // GIVEN
  beforeEach(() => {
    stack = new Stack();

    pascalCaseExpectedEcsProps = capitalizePropertyNames(stack, defaultExpectedEcsProps);
    pascalCaseExpectedEksProps = capitalizePropertyNames(stack, defaultExpectedEksProps);
    pascalCaseExpectedMultiNodeProps = capitalizePropertyNames(stack, defaultExpectedMultiNodeProps);

    defaultEcsProps = {
      container: new batch.EcsEc2ContainerDefinition(stack, 'EcsContainer', {
        cpu: 256,
        memory: Size.mebibytes(2048),
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      }),
    };
    defaultEksProps = {
      container: new batch.EksContainerDefinition(stack, 'EksContainer', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      }),
    };
    defaultMultiNodeProps = {
      containers: [{
        container: new batch.EcsEc2ContainerDefinition(stack, 'MultinodeEcsContainer', {
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
      case batch.EcsJobDefinition:
        expectedProps = pascalCaseExpectedEcsProps;
        defaultProps = defaultEcsProps;
        break;
      case batch.EksJobDefinition:
        expectedProps = pascalCaseExpectedEksProps;
        defaultProps = defaultEksProps;
        break;
      case batch.MultiNodeJobDefinition:
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
        batch.RetryStrategy.of(batch.Action.EXIT, batch.Reason.CANNOT_PULL_CONTAINER),
        batch.RetryStrategy.of(batch.Action.RETRY, batch.Reason.NON_ZERO_EXIT_CODE),
        batch.RetryStrategy.of(batch.Action.RETRY, batch.Reason.SPOT_INSTANCE_RECLAIMED),
        batch.RetryStrategy.of(batch.Action.RETRY, batch.Reason.custom({
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

    jobDefn.addRetryStrategy(batch.RetryStrategy.of(batch.Action.RETRY, batch.Reason.SPOT_INSTANCE_RECLAIMED));

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
});
