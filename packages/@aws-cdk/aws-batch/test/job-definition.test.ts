import { throws } from 'assert';
import { Match, Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import * as batch from '../lib';
import { PlatformCapabilities } from '../lib';

describe('Batch Job Definition', () => {
  let stack: cdk.Stack;
  let jobDefProps: batch.JobDefinitionProps;

  beforeEach(() => {
    stack = new cdk.Stack();

    const role = new iam.Role(stack, 'job-role', {
      assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
    });

    const linuxParams = new ecs.LinuxParameters(stack, 'job-linux-params', {
      initProcessEnabled: true,
      sharedMemorySize: 1,
    });

    const logConfiguration: batch.LogConfiguration = {
      logDriver: batch.LogDriver.AWSLOGS,
      options: { 'awslogs-region': 'us-east-1' },
    };

    const secret = new secretsmanager.Secret(stack, 'test-secret');
    const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'test-parameter', {
      parameterName: '/name',
      version: 1,
    });

    jobDefProps = {
      jobDefinitionName: 'test-job',
      container: {
        command: ['echo "Hello World"'],
        environment: {
          foo: 'bar',
        },
        secrets: {
          SECRET: ecs.Secret.fromSecretsManager(secret),
          PARAMETER: ecs.Secret.fromSsmParameter(parameter),
        },
        jobRole: role,
        gpuCount: 1,
        image: ecs.EcrImage.fromRegistry('docker/whalesay'),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
        linuxParams,
        logConfiguration,
        memoryLimitMiB: 1,
        mountPoints: new Array<ecs.MountPoint>(),
        privileged: true,
        readOnly: true,
        ulimits: new Array<ecs.Ulimit>(),
        user: 'root',
        vcpus: 2,
        volumes: new Array<ecs.Volume>(),
      },
      nodeProps: {
        count: 2,
        mainNode: 1,
        rangeProps: new Array<batch.INodeRangeProps>(),
      },
      parameters: {
        foo: 'bar',
      },
      retryAttempts: 2,
      timeout: cdk.Duration.seconds(30),
      platformCapabilities: [batch.PlatformCapabilities.EC2],
    };
  });

  test('renders the correct cloudformation properties', () => {
    // WHEN
    new batch.JobDefinition(stack, 'job-def', jobDefProps);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      JobDefinitionName: jobDefProps.jobDefinitionName,
      ContainerProperties: jobDefProps.container ? {
        Command: jobDefProps.container.command,
        Environment: [
          {
            Name: 'foo',
            Value: 'bar',
          },
        ],
        Secrets: [
          {
            Name: 'SECRET',
            ValueFrom: {
              Ref: Match.stringLikeRegexp('^testsecret[0-9A-Z]{8}$'),
            },
          },
          {
            Name: 'PARAMETER',
            ValueFrom: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ssm:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':parameter/name',
                ],
              ],
            },
          },
        ],
        InstanceType: jobDefProps.container.instanceType ? jobDefProps.container.instanceType.toString() : '',
        LinuxParameters: {},
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-region': 'us-east-1',
          },
        },
        MountPoints: [],
        Privileged: jobDefProps.container.privileged,
        ReadonlyRootFilesystem: jobDefProps.container.readOnly,
        ResourceRequirements: [
          { Type: 'VCPU', Value: String(jobDefProps.container.vcpus) },
          { Type: 'MEMORY', Value: String(jobDefProps.container.memoryLimitMiB) },
          { Type: 'GPU', Value: String(jobDefProps.container.gpuCount) },
        ],
        Ulimits: [],
        User: jobDefProps.container.user,
        Volumes: [],
      } : undefined,
      NodeProperties: jobDefProps.nodeProps ? {
        MainNode: jobDefProps.nodeProps.mainNode,
        NodeRangeProperties: [],
        NumNodes: jobDefProps.nodeProps.count,
      } : undefined,
      Parameters: {
        foo: 'bar',
      },
      RetryStrategy: {
        Attempts: jobDefProps.retryAttempts,
      },
      Timeout: {
        AttemptDurationSeconds: jobDefProps.timeout ? jobDefProps.timeout.toSeconds() : -1,
      },
      Type: 'container',
      PlatformCapabilities: ['EC2'],
    });
  });

  test('renders the correct cloudformation properties for a Fargate job definition', () => {
    // WHEN
    const executionRole = new iam.Role(stack, 'execution-role', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    new batch.JobDefinition(stack, 'job-def', {
      ...jobDefProps,
      container: { ...jobDefProps.container, executionRole, gpuCount: undefined },
      platformCapabilities: [PlatformCapabilities.FARGATE],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      JobDefinitionName: jobDefProps.jobDefinitionName,
      ContainerProperties: jobDefProps.container ? {
        Command: jobDefProps.container.command,
        Environment: [
          {
            Name: 'foo',
            Value: 'bar',
          },
        ],
        Secrets: [
          {
            Name: 'SECRET',
            ValueFrom: {
              Ref: Match.stringLikeRegexp('^testsecret[0-9A-Z]{8}$'),
            },
          },
          {
            Name: 'PARAMETER',
            ValueFrom: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':ssm:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':parameter/name',
                ],
              ],
            },
          },
        ],
        ExecutionRoleArn: {
          'Fn::GetAtt': [
            'executionroleD9A39BE6',
            'Arn',
          ],
        },
        InstanceType: jobDefProps.container.instanceType ? jobDefProps.container.instanceType.toString() : '',
        LinuxParameters: {},
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-region': 'us-east-1',
          },
        },
        MountPoints: [],
        Privileged: jobDefProps.container.privileged,
        ReadonlyRootFilesystem: jobDefProps.container.readOnly,
        ResourceRequirements: [
          { Type: 'VCPU', Value: String(jobDefProps.container.vcpus) },
          { Type: 'MEMORY', Value: String(jobDefProps.container.memoryLimitMiB) },
        ],
        Ulimits: [],
        User: jobDefProps.container.user,
        Volumes: [],
      } : undefined,
      NodeProperties: jobDefProps.nodeProps ? {
        MainNode: jobDefProps.nodeProps.mainNode,
        NodeRangeProperties: [],
        NumNodes: jobDefProps.nodeProps.count,
      } : undefined,
      Parameters: {
        foo: 'bar',
      },
      RetryStrategy: {
        Attempts: jobDefProps.retryAttempts,
      },
      Timeout: {
        AttemptDurationSeconds: jobDefProps.timeout ? jobDefProps.timeout.toSeconds() : -1,
      },
      Type: 'container',
      PlatformCapabilities: ['FARGATE'],
    });
  });

  test('can use an ecr image', () => {
    // WHEN
    const repo = new ecr.Repository(stack, 'image-repo');

    new batch.JobDefinition(stack, 'job-def', {
      container: {
        image: ecs.ContainerImage.fromEcrRepository(repo),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ContainerProperties: {
        Image: {
          'Fn::Join': [
            '',
            [
              {
                'Fn::Select': [
                  4,
                  {
                    'Fn::Split': [
                      ':',
                      {
                        'Fn::GetAtt': [
                          'imagerepoD116FAF0',
                          'Arn',
                        ],
                      },
                    ],
                  },
                ],
              },
              '.dkr.ecr.',
              {
                'Fn::Select': [
                  3,
                  {
                    'Fn::Split': [
                      ':',
                      {
                        'Fn::GetAtt': [
                          'imagerepoD116FAF0',
                          'Arn',
                        ],
                      },
                    ],
                  },
                ],
              },
              '.',
              {
                Ref: 'AWS::URLSuffix',
              },
              '/',
              {
                Ref: 'imagerepoD116FAF0',
              },
              ':latest',
            ],
          ],
        },
        Privileged: false,
        ReadonlyRootFilesystem: false,
        ResourceRequirements: [
          { Type: 'VCPU', Value: '1' },
          { Type: 'MEMORY', Value: '4' },
        ],
      },
    });
  });

  test('can use a registry image', () => {
    // WHEN
    new batch.JobDefinition(stack, 'job-def', {
      container: {
        image: ecs.ContainerImage.fromRegistry('docker/whalesay'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ContainerProperties: {
        Image: 'docker/whalesay',
        Privileged: false,
        ReadonlyRootFilesystem: false,
        ResourceRequirements: [
          { Type: 'VCPU', Value: '1' },
          { Type: 'MEMORY', Value: '4' },
        ],
      },
    });
  });

  test('can be imported from an ARN', () => {
    // WHEN
    const importedJob = batch.JobDefinition.fromJobDefinitionArn(stack, 'job-def-clone',
      'arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');

    // THEN
    expect(importedJob.jobDefinitionName).toEqual('job-def-name:1');
    expect(importedJob.jobDefinitionArn).toEqual('arn:aws:batch:us-east-1:123456789012:job-definition/job-def-name:1');
  });

  test('can be imported from a name', () => {
    // WHEN
    const importedJob = batch.JobDefinition.fromJobDefinitionName(stack, 'job-def-clone', 'job-def-name');

    // THEN
    expect(importedJob.jobDefinitionName).toEqual('job-def-name');
    expect(importedJob.jobDefinitionArn)
      .toEqual(`arn:${cdk.Aws.PARTITION}:batch:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:job-definition/job-def-name`);
  });

  test('can configure log configuration secrets properly', () => {
    // GIVEN
    const secretArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret-f3gDy9';

    const logConfiguration: batch.LogConfiguration = {
      logDriver: batch.LogDriver.AWSLOGS,
      options: { 'awslogs-region': 'us-east-1' },
      secretOptions: [
        batch.ExposedSecret.fromSecretsManager('abc', secretsmanager.Secret.fromSecretCompleteArn(stack, 'secret', secretArn)),
        batch.ExposedSecret.fromParametersStore('xyz', ssm.StringParameter.fromStringParameterName(stack, 'parameter', 'xyz')),
      ],
    };

    // WHEN
    new batch.JobDefinition(stack, 'job-def', {
      container: {
        image: ecs.EcrImage.fromRegistry('docker/whalesay'),
        logConfiguration,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ContainerProperties: {
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-region': 'us-east-1',
          },
          SecretOptions: [
            {
              Name: 'abc',
              ValueFrom: secretArn,
            },
            {
              Name: 'xyz',
              ValueFrom: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':ssm:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    {
                      Ref: 'AWS::AccountId',
                    },
                    ':parameter/xyz',
                  ],
                ],
              },
            },
          ],
        },
      },
    });
  });
  describe('using fargate job definition', () => {
    test('can configure platform configuration properly', () => {
      // GIVEN
      const executionRole = new iam.Role(stack, 'execution-role', {
        assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
      });
      // WHEN
      new batch.JobDefinition(stack, 'job-def', {
        platformCapabilities: [batch.PlatformCapabilities.FARGATE],
        container: {
          image: ecs.EcrImage.fromRegistry('docker/whalesay'),
          platformVersion: ecs.FargatePlatformVersion.LATEST,
          executionRole: executionRole,
        },
      });
      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
        ContainerProperties: {
          FargatePlatformConfiguration: {
            PlatformVersion: 'LATEST',
          },
        },
      });
    });
    test('must require executionRole', () => {
      throws(() => {
        // WHEN
        new batch.JobDefinition(stack, 'job-def', {
          platformCapabilities: [batch.PlatformCapabilities.FARGATE],
          container: {
            image: ecs.EcrImage.fromRegistry('docker/whalesay'),
          },
        });
      });
    });
  });
});
