
import { Template } from '@aws-cdk/assertions';
import { Vpc } from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as efs from '@aws-cdk/aws-efs';
import { ArnPrincipal, Role } from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import { Secret } from '@aws-cdk/aws-secretsmanager';
import { Size, Stack } from '@aws-cdk/core';
import { capitalizePropertyNames } from '@aws-cdk/core/lib/util';
import { EcsContainerDefinitionProps, EcsEc2ContainerDefinition, EcsJobDefinition, EcsVolume, LinuxParameters, UlimitName } from '../lib';
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

  test('respects readonlyRootFilesystem', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        readonlyRootFilesystem: true,
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        ReadonlyRootFilesystem: true,
      },
    });
  });

  test('respects secrets', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        secrets: [
          new Secret(stack, 'testSecret'),
        ],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        Secrets: [
          {
            Name: {
              'Fn::Join': [
                '-',
                [
                  {
                    'Fn::Select': [
                      0,
                      {
                        'Fn::Split': [
                          '-',
                          {
                            'Fn::Select': [
                              6,
                              {
                                'Fn::Split': [
                                  ':',
                                  {
                                    Ref: 'testSecretB96AD12C',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    'Fn::Select': [
                      1,
                      {
                        'Fn::Split': [
                          '-',
                          {
                            'Fn::Select': [
                              6,
                              {
                                'Fn::Split': [
                                  ':',
                                  {
                                    Ref: 'testSecretB96AD12C',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
            ValueFrom: { Ref: 'testSecretB96AD12C' },
          },
        ],
      },
    });
  });

  test('respects user', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        user: 'foo',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        User: 'foo',
      },
    });
  });

  test('respects ulimits', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        ulimits: [
          {
            hardLimit: 100,
            name: UlimitName.CORE,
            softLimit: 10,
          },
        ],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        Ulimits: [
          {
            HardLimit: 100,
            Name: 'core',
            SoftLimit: 10,
          },
        ],
      },
    });
  });

  test('respects efs volumes', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        volumes: [
          EcsVolume.efs({
            containerPath: '/first/path',
            fileSystem: new efs.FileSystem(stack, 'efs', {
              vpc: new Vpc(stack, 'vpc'),
            }),
            name: 'firstEfsVolume',
            accessPointId: 'EfsVolumeAccessPointId',
            readonly: true,
            rootDirectory: 'efsRootDir',
            enableTransitEncryption: true,
            transitEncryptionPort: 20181,
            useJobDefinitionRole: true,
          }),
          EcsVolume.efs({
            containerPath: '/second/path',
            fileSystem: new efs.FileSystem(stack, 'efs2', {
              vpc: new Vpc(stack, 'vpc2'),
            }),
            name: 'secondEfsVolume',
          }),
        ],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        Volumes: [
          {
            EfsVolumeConfiguration: {
              FileSystemId: {
                Ref: 'efs6C17982A',
              },
              RootDirectory: 'efsRootDir',
              TransitEncryptionPort: 20181,
              AuthorizationConfig: {
                AccessPointId: 'EfsVolumeAccessPointId',
                Iam: 'ENABLED',
              },
            },
            Name: 'firstEfsVolume',
          },
          {
            EfsVolumeConfiguration: {
              FileSystemId: {
                Ref: 'efs2CB3916C1',
              },
            },
            Name: 'secondEfsVolume',
          },
        ],
        MountPoints: [
          {
            ContainerPath: '/first/path',
            ReadOnly: true,
            SourceVolume: 'firstEfsVolume',
          },
          {
            ContainerPath: '/second/path',
            SourceVolume: 'secondEfsVolume',
          },
        ],
      },
    });
  });

  test('respects host volumes', () => {
    // WHEN
    new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
        volumes: [
          EcsVolume.host({
            containerPath: '/container/path',
            name: 'EcsHostPathVolume',
            hostPath: '/host/path',
          }),
        ],
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        Volumes: [
          {
            Name: 'EcsHostPathVolume',
            Host: {
              SourcePath: '/host/path',
            },
          },
        ],
        MountPoints: [
          {
            ContainerPath: '/container/path',
            SourceVolume: 'EcsHostPathVolume',
          },
        ],
      },
    });
  });

  test('respects addEfsVolume()', () => {
    // GIVEN
    const jobDefn = new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
      }),
    });

    // WHEN
    jobDefn.containerDefinition.addEfsVolume({
      containerPath: '/container/path',
      fileSystem: new efs.FileSystem(stack, 'efs', {
        vpc: new Vpc(stack, 'vpc'),
      }),
      name: 'AddedEfsVolume',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        Volumes: [{
          Name: 'AddedEfsVolume',
          EfsVolumeConfiguration: {
            FileSystemId: {
              Ref: 'efs6C17982A',
            },
          },
        }],
        MountPoints: [{
          ContainerPath: '/container/path',
          SourceVolume: 'AddedEfsVolume',
        }],
      },
    });
  });

  test('respects addHostVolume()', () => {
    // GIVEN
    const jobDefn = new EcsJobDefinition(stack, 'ECSJobDefn', {
      containerDefinition: new EcsEc2ContainerDefinition(stack, 'EcsEc2Container', {
        ...defaultContainerProps,
      }),
    });

    // WHEN
    jobDefn.containerDefinition.addHostVolume({
      containerPath: '/container/path/new',
      name: 'hostName',
      hostPath: '/host/path',
      readonly: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Batch::JobDefinition', {
      ...pascalCaseExpectedProps,
      ContainerProperties: {
        ...pascalCaseExpectedProps.ContainerProperties,
        Volumes: [{
          Name: 'hostName',
          Host: {
            SourcePath: '/host/path',
          },
        }],
        MountPoints: [{
          ContainerPath: '/container/path/new',
          SourceVolume: 'hostName',
        }],
      },
    });
  });
});
