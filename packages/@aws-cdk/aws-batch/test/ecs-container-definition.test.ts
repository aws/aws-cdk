
import { Template } from '@aws-cdk/assertions';
import * as ecs from '@aws-cdk/aws-ecs';
import { ArnPrincipal, Role } from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import { Size, Stack } from '@aws-cdk/core';
import { capitalizePropertyNames } from '@aws-cdk/core/lib/util';
import { EcsContainerDefinitionProps, EcsEc2ContainerDefinition, EcsJobDefinition, LinuxParameters } from '../lib';
import { CfnJobDefinitionProps } from '../lib/batch.generated';


// GIVEN
const defaultContainerProps: EcsContainerDefinitionProps = {
  cpu: 256,
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryMiB: 2048,
};

const defaultExpectedProps: CfnJobDefinitionProps = {
  type: 'container',
  containerProperties: {
    image: 'amazon/amazon-ecs-sample',
    resourceRequirements: [
      {
        type: 'MEMORY',
        value: '2048',
      },
      {
        type: 'VCPU',
        value: '256',
      },
    ],
  },
};

let stack: Stack;
let pascalCaseExpectedProps: any;

describe('ecs container', () => {
  // GIVEN
  beforeEach(() => {
    stack = new Stack();
    pascalCaseExpectedProps = capitalizePropertyNames(stack, defaultExpectedProps);
  });

  test('ecs container defaults', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
    });
  });

  test('respects command', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        command: ['echo', 'foo'],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        Command: ['echo', 'foo'],
      },
    });
  });

  test('respects privileged', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        privileged: true,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        Privileged: true,
      },
    });
  });

  test('respects environment', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        privileged: true,
        environment: {
          foo: 'bar',
        },
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        Environment: [{
          Name: 'foo',
          Value: 'bar',
        }],
      },
    });
  });

  test('respects executionRole', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        privileged: true,
        executionRole: new Role(stack, 'execRole', {
          assumedBy: new ArnPrincipal('arn:aws:iam:123456789012:user/user-name'),
        }),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        ExecutionRoleArn: {
          'Fn::GetAtt': ['execRole623CB63A', 'Arn'],
        },
      },
    });
  });

  test('respects gpu', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        privileged: true,
        gpu: 12,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        ResourceRequirements: [
          {
            Type: 'GPU',
            Value: '12',
          },
          {
            Type: 'MEMORY',
            Value: '2048',
          },
          {
            Type: 'VCPU',
            Value: '256',
          },
        ],
      },
    });
  });

  test('respects jobRole', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        privileged: true,
        jobRole: new Role(stack, 'jobRole', {
          assumedBy: new ArnPrincipal('arn:aws:iam:123456789012:user/user-name'),
        }),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        JobRoleArn: {
          'Fn::GetAtt': ['jobRoleA2173686', 'Arn'],
        },
      },
    });
  });

  test('respects linuxParameters', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        privileged: true,
        linuxParameters: new LinuxParameters(stack, 'linuxParameters', {
          initProcessEnabled: true,
          maxSwap: Size.kibibytes(4096),
          sharedMemorySize: 256,
          swappiness: 30,
        }),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        LinuxParameters: {
          InitProcessEnabled: true,
          MaxSwap: 4,
          SharedMemorySize: 256,
          Swappiness: 30,
        },
      },
    });
  });

  test('respects logDriver', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        privileged: true,
        logging: ecs.LogDriver.awsLogs({
          datetimeFormat: 'format',
          logRetention: logs.RetentionDays.ONE_MONTH,
          multilinePattern: 'pattern',
          streamPrefix: 'hello',
        }),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        LogConfiguration: {
          Options: {
            'awslogs-datetime-format': 'format',
            'awslogs-group': { Ref: 'EcsEc2ContainerLogGroup7855929B' },
            'awslogs-multiline-pattern': 'pattern',
            'awslogs-region': { Ref: 'AWS::Region' },
            'awslogs-stream-prefix': 'hello',
          },
        },
      },
    });
  });
});
