import * as path from 'path';
import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import { Protocol } from '@aws-cdk/aws-ec2';
import { Repository } from '@aws-cdk/aws-ecr';
import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ecs from '../../lib';

export = {
  'When creating an ECS TaskDefinition': {
    'with only required properties set, it correctly sets default properties'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      // THEN
      expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
        Family: 'Ec2TaskDef',
        NetworkMode: ecs.NetworkMode.BRIDGE,
        RequiresCompatibilities: ['EC2'],
      }));

      // test error if no container defs?
      test.done();
    },

    'with all properties set'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        executionRole: new iam.Role(stack, 'ExecutionRole', {
          path: '/',
          assumedBy: new iam.CompositePrincipal(
            new iam.ServicePrincipal('ecs.amazonaws.com'),
            new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
          ),
        }),
        family: 'ecs-tasks',
        networkMode: ecs.NetworkMode.AWS_VPC,
        ipcMode: ecs.IpcMode.HOST,
        pidMode: ecs.PidMode.TASK,
        placementConstraints: [ecs.PlacementConstraint.memberOf('attribute:ecs.instance-type =~ t2.*')],
        taskRole: new iam.Role(stack, 'TaskRole', {
          assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        }),
        volumes: [{
          host: {
            sourcePath: '/tmp/cache',
          },
          name: 'scratch',
        }],
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
        ExecutionRoleArn: {
          'Fn::GetAtt': [
            'ExecutionRole605A040B',
            'Arn',
          ],
        },
        Family: 'ecs-tasks',
        NetworkMode: 'awsvpc',
        IpcMode: 'host',
        PidMode: 'task',
        PlacementConstraints: [
          {
            Expression: 'attribute:ecs.instance-type =~ t2.*',
            Type: 'memberOf',
          },
        ],
        RequiresCompatibilities: [
          'EC2',
        ],
        TaskRoleArn: {
          'Fn::GetAtt': [
            'TaskRole30FC0FBB',
            'Arn',
          ],
        },
        Volumes: [
          {
            Host: {
              SourcePath: '/tmp/cache',
            },
            Name: 'scratch',
          },
        ],
      }));

      test.done();
    },

    'correctly sets placement constraint'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      // WHEN
      taskDefinition.addPlacementConstraint(ecs.PlacementConstraint.memberOf('attribute:ecs.instance-type =~ t2.*'));

      // THEN
      expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
        PlacementConstraints: [
          {
            Expression: 'attribute:ecs.instance-type =~ t2.*',
            Type: 'memberOf',
          },
        ],

      }));

      test.done();
    },

    'correctly sets network mode'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        networkMode: ecs.NetworkMode.AWS_VPC,
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
        NetworkMode: ecs.NetworkMode.AWS_VPC,
      }));

      test.done();
    },

    'correctly sets ipc mode'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        ipcMode: ecs.IpcMode.TASK,
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
        IpcMode: ecs.IpcMode.TASK,
      }));

      test.done();
    },

    'correctly sets pid mode'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        pidMode: ecs.PidMode.HOST,
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
        PidMode: ecs.PidMode.HOST,
      }));

      test.done();
    },

    'correctly sets containers'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      const container = taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512, // add validation?
      });

      container.addPortMappings({
        containerPort: 3000,
      });

      container.addUlimits({
        hardLimit: 128,
        name: ecs.UlimitName.RSS,
        softLimit: 128,
      });

      container.addVolumesFrom({
        sourceContainer: 'foo',
        readOnly: true,
      });

      container.addToExecutionPolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['ecs:*'],
      }));

      // THEN
      expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
        Family: 'Ec2TaskDef',
        ContainerDefinitions: [{
          Essential: true,
          Memory: 512,
          Image: 'amazon/amazon-ecs-sample',
          Name: 'web',
          PortMappings: [{
            ContainerPort: 3000,
            HostPort: 0,
            Protocol: Protocol.TCP,
          }],
          Ulimits: [
            {
              HardLimit: 128,
              Name: 'rss',
              SoftLimit: 128,
            },
          ],
          VolumesFrom: [
            {
              ReadOnly: true,
              SourceContainer: 'foo',
            },
          ],
        }],
      }));

      expect(stack).to(haveResource('AWS::IAM::Policy', {
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'ecs:*',
              Effect: 'Allow',
              Resource: '*',
            },
          ],
        },
      }));

      test.done();
    },

    'all container definition options defined'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');
      const secret = new secretsmanager.Secret(stack, 'Secret');
      const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Parameter', {
        parameterName: '/name',
        version: 1,
      });

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 2048,
        cpu: 256,
        disableNetworking: true,
        command: ['CMD env'],
        dnsSearchDomains: ['0.0.0.0'],
        dnsServers: ['1.1.1.1'],
        dockerLabels: { LABEL: 'label' },
        dockerSecurityOptions: ['ECS_SELINUX_CAPABLE=true'],
        entryPoint: ['/app/node_modules/.bin/cdk'],
        environment: { TEST_ENVIRONMENT_VARIABLE: 'test environment variable value' },
        environmentFiles: [ecs.EnvironmentFile.fromAsset(path.join(__dirname, '../demo-envfiles/test-envfile.env'))],
        essential: true,
        extraHosts: { EXTRAHOST: 'extra host' },
        healthCheck: {
          command: ['curl localhost:8000'],
          interval: cdk.Duration.seconds(20),
          retries: 5,
          startPeriod: cdk.Duration.seconds(10),
        },
        hostname: 'webHost',
        linuxParameters: new ecs.LinuxParameters(stack, 'LinuxParameters', {
          initProcessEnabled: true,
          sharedMemorySize: 1024,
        }),
        logging: new ecs.AwsLogDriver({ streamPrefix: 'prefix' }),
        memoryReservationMiB: 1024,
        privileged: true,
        readonlyRootFilesystem: true,
        secrets: {
          SECRET: ecs.Secret.fromSecretsManager(secret),
          PARAMETER: ecs.Secret.fromSsmParameter(parameter),
        },
        user: 'amazon',
        workingDirectory: 'app/',
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
        Family: 'Ec2TaskDef',
        ContainerDefinitions: [
          {
            Command: [
              'CMD env',
            ],
            Cpu: 256,
            DisableNetworking: true,
            DnsSearchDomains: [
              '0.0.0.0',
            ],
            DnsServers: [
              '1.1.1.1',
            ],
            DockerLabels: {
              LABEL: 'label',
            },
            DockerSecurityOptions: [
              'ECS_SELINUX_CAPABLE=true',
            ],
            EntryPoint: [
              '/app/node_modules/.bin/cdk',
            ],
            Environment: [
              {
                Name: 'TEST_ENVIRONMENT_VARIABLE',
                Value: 'test environment variable value',
              },
            ],
            EnvironmentFiles: [{
              Type: 's3',
              Value: {
                'Fn::Join': [
                  '',
                  [
                    'arn:aws:s3:::',
                    {
                      Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3Bucket7B2069B7',
                    },
                    '/',
                    {
                      'Fn::Select': [
                        0,
                        {
                          'Fn::Split': [
                            '||',
                            {
                              Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3VersionKey40E12C15',
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
                            '||',
                            {
                              Ref: 'AssetParameters872561bf078edd1685d50c9ff821cdd60d2b2ddfb0013c4087e79bf2bb50724dS3VersionKey40E12C15',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                ],
              },
            }],
            Essential: true,
            ExtraHosts: [
              {
                Hostname: 'EXTRAHOST',
                IpAddress: 'extra host',
              },
            ],
            HealthCheck: {
              Command: [
                'CMD-SHELL',
                'curl localhost:8000',
              ],
              Interval: 20,
              Retries: 5,
              StartPeriod: 10,
              Timeout: 5,
            },
            Hostname: 'webHost',
            Image: 'amazon/amazon-ecs-sample',
            LinuxParameters: {
              Capabilities: {},
              InitProcessEnabled: true,
              SharedMemorySize: 1024,
            },
            LogConfiguration: {
              LogDriver: 'awslogs',
              Options: {
                'awslogs-group': {
                  Ref: 'Ec2TaskDefwebLogGroup7F786C6B',
                },
                'awslogs-stream-prefix': 'prefix',
                'awslogs-region': {
                  Ref: 'AWS::Region',
                },
              },
            },
            Memory: 2048,
            MemoryReservation: 1024,
            Name: 'web',
            Privileged: true,
            ReadonlyRootFilesystem: true,
            Secrets: [
              {
                Name: 'SECRET',
                ValueFrom: {
                  Ref: 'SecretA720EF05',
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
            User: 'amazon',
            WorkingDirectory: 'app/',
          },
        ],
      }));

      test.done();
    },

    'correctly sets containers from ECR repository using all props'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromEcrRepository(new Repository(stack, 'myECRImage', {
          lifecycleRegistryId: '123456789101',
          lifecycleRules: [{
            rulePriority: 10,
            tagPrefixList: ['abc'],
            maxImageCount: 1,
          }],
          removalPolicy: cdk.RemovalPolicy.DESTROY,
          repositoryName: 'project-a/amazon-ecs-sample',
        })),
        memoryLimitMiB: 512,
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECR::Repository', {
        LifecyclePolicy: {
          // eslint-disable-next-line max-len
          LifecyclePolicyText: '{"rules":[{"rulePriority":10,"selection":{"tagStatus":"tagged","tagPrefixList":["abc"],"countType":"imageCountMoreThan","countNumber":1},"action":{"type":"expire"}}]}',
          RegistryId: '123456789101',
        },
        RepositoryName: 'project-a/amazon-ecs-sample',
      }));

      expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
        Family: 'Ec2TaskDef',
        ContainerDefinitions: [{
          Essential: true,
          Memory: 512,
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
                            'myECRImage7DEAE474',
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
                            'myECRImage7DEAE474',
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
                  Ref: 'myECRImage7DEAE474',
                },
                ':latest',
              ],
            ],
          },
          Name: 'web',
        }],
      }));

      test.done();
    },

    'correctly sets containers from ECR repository using default props'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      // WHEN
      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromEcrRepository(new Repository(stack, 'myECRImage')),
        memoryLimitMiB: 512,
      });

      // THEN
      expect(stack).notTo(haveResource('AWS::ECR::Repository', {}));

      test.done();
    },

    'warns when setting containers from ECR repository using fromRegistry method'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      // WHEN
      const container = taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY'),
        memoryLimitMiB: 512,
      });

      // THEN
      test.deepEqual(container.node.metadata[0].data, "Proper policies need to be attached before pulling from ECR repository, or use 'fromEcrRepository'.");
      test.done();
    },

    'warns when setting containers from ECR repository by creating a RepositoryImage class'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      const repo = new ecs.RepositoryImage('ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY');

      // WHEN
      const container = taskDefinition.addContainer('web', {
        image: repo,
        memoryLimitMiB: 512,
      });

      // THEN
      test.deepEqual(container.node.metadata[0].data, "Proper policies need to be attached before pulling from ECR repository, or use 'fromEcrRepository'.");

      test.done();
    },

    'correctly sets containers from asset using default props'(test: Test) {
      // GIVEN
      const app = new cdk.App({
        context: {
          '@aws-cdk/aws-ecr-assets:dockerIgnoreSupport': true,
        },
      });
      const stack = new cdk.Stack(app, 'Stack');

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      // WHEN
      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromAsset(path.join(__dirname, '..', 'demo-image')),
        memoryLimitMiB: 512,
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
        Family: 'StackEc2TaskDefF03698CF',
        ContainerDefinitions: [
          {
            Essential: true,
            Image: {
              'Fn::Join': [
                '',
                [
                  {
                    Ref: 'AWS::AccountId',
                  },
                  '.dkr.ecr.',
                  {
                    Ref: 'AWS::Region',
                  },
                  '.',
                  {
                    Ref: 'AWS::URLSuffix',
                  },
                  '/aws-cdk/assets:b2c69bfbfe983b634456574587443159b3b7258849856a118ad3d2772238f1a5',
                ],
              ],
            },
            Memory: 512,
            Name: 'web',
          },
        ],
      }));

      test.done();
    },

    'correctly sets containers from asset using all props'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromAsset(path.join(__dirname, '..', 'demo-image'), {
          buildArgs: { HTTP_PROXY: 'http://10.20.30.2:1234' },
        }),
        memoryLimitMiB: 512,
      });

      test.done();
    },

    'correctly sets scratch space'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      const container = taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      container.addScratch({
        containerPath: './cache',
        readOnly: true,
        sourcePath: '/tmp/cache',
        name: 'scratch',
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        Family: 'Ec2TaskDef',
        ContainerDefinitions: [{
          MountPoints: [
            {
              ContainerPath: './cache',
              ReadOnly: true,
              SourceVolume: 'scratch',
            },
          ],
        }],
        Volumes: [{
          Host: {
            SourcePath: '/tmp/cache',
          },
          Name: 'scratch',
        }],
      }));

      test.done();
    },
    'correctly sets container dependenices'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      const dependency1 = taskDefinition.addContainer('dependency1', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      const dependency2 = taskDefinition.addContainer('dependency2', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      const container = taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      container.addContainerDependencies({
        container: dependency1,
      },
      {
        container: dependency2,
        condition: ecs.ContainerDependencyCondition.SUCCESS,
      },
      );

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        Family: 'Ec2TaskDef',
        ContainerDefinitions: [{
          Name: 'dependency1',
        },
        {
          Name: 'dependency2',
        },
        {
          Name: 'web',
          DependsOn: [{
            Condition: 'HEALTHY',
            ContainerName: 'dependency1',
          },
          {
            Condition: 'SUCCESS',
            ContainerName: 'dependency2',
          }],
        }],
      }));

      test.done();
    },
    'correctly sets links'(test: Test) {
      const stack = new cdk.Stack();

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        networkMode: ecs.NetworkMode.BRIDGE,
      });

      const container = taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      const linkedContainer1 = taskDefinition.addContainer('linked1', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      const linkedContainer2 = taskDefinition.addContainer('linked2', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      container.addLink(linkedContainer1, 'linked');
      container.addLink(linkedContainer2);

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Links: [
              'linked1:linked',
              'linked2',
            ],
            Name: 'web',
          },
          {
            Name: 'linked1',
          },
          {
            Name: 'linked2',
          },
        ],
      }));

      test.done();
    },

    'correctly set policy statement to the task IAM role'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      // WHEN
      taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
        actions: ['test:SpecialName'],
        resources: ['*'],
      }));

      // THEN
      expect(stack).to(haveResource('AWS::IAM::Policy', {
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'test:SpecialName',
              Effect: 'Allow',
              Resource: '*',
            },
          ],
        },
      }));

      test.done();
    },
    'correctly sets volumes from'(test: Test) {
      const stack = new cdk.Stack();

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {});

      const container = taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      container.addVolumesFrom({
        sourceContainer: 'SourceContainer',
        readOnly: true,
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [{
          VolumesFrom: [
            {
              SourceContainer: 'SourceContainer',
              ReadOnly: true,
            },
          ],
        }],
      }));

      test.done();
    },

    'correctly set policy statement to the task execution IAM role'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      // WHEN
      taskDefinition.addToExecutionRolePolicy(new iam.PolicyStatement({
        actions: ['test:SpecialName'],
        resources: ['*'],
      }));

      // THEN
      expect(stack).to(haveResource('AWS::IAM::Policy', {
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'test:SpecialName',
              Effect: 'Allow',
              Resource: '*',
            },
          ],
        },
      }));

      test.done();
    },

    'correctly sets volumes'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const volume = {
        host: {
          sourcePath: '/tmp/cache',
        },
        name: 'scratch',
      };

      // Adding volumes via props is a bit clunky
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        volumes: [volume],
      });

      const container = taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      // this needs to be a better API -- should auto-add volumes
      container.addMountPoints({
        containerPath: './cache',
        readOnly: true,
        sourceVolume: 'scratch',
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        Family: 'Ec2TaskDef',
        ContainerDefinitions: [{
          MountPoints: [
            {
              ContainerPath: './cache',
              ReadOnly: true,
              SourceVolume: 'scratch',
            },
          ],
        }],
        Volumes: [{
          Host: {
            SourcePath: '/tmp/cache',
          },
          Name: 'scratch',
        }],
      }));

      test.done();
    },

    'correctly sets placement constraints'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        placementConstraints: [
          ecs.PlacementConstraint.memberOf('attribute:ecs.instance-type =~ t2.*'),
        ],
      });

      taskDefinition.addContainer('web', {
        memoryLimitMiB: 1024,
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      });

      // THEN
      expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
        PlacementConstraints: [
          {
            Expression: 'attribute:ecs.instance-type =~ t2.*',
            Type: 'memberOf',
          },
        ],
      }));

      test.done();
    },

    'correctly sets taskRole'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        taskRole: new iam.Role(stack, 'TaskRole', {
          assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        }),
      });

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        TaskRoleArn: stack.resolve(taskDefinition.taskRole.roleArn),
      }));

      test.done();
    },

    'automatically sets taskRole by default'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        TaskRoleArn: stack.resolve(taskDefinition.taskRole.roleArn),
      }));

      test.done();
    },

    'correctly sets dockerVolumeConfiguration'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const volume = {
        name: 'scratch',
        dockerVolumeConfiguration: {
          driver: 'local',
          scope: ecs.Scope.TASK,
          driverOpts: {
            key1: 'value',
          },
        },
      };

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        volumes: [volume],
      });

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        Family: 'Ec2TaskDef',
        Volumes: [{
          Name: 'scratch',
          DockerVolumeConfiguration: {
            Driver: 'local',
            Scope: 'task',
            DriverOpts: {
              key1: 'value',
            },
          },
        }],
      }));

      test.done();
    },

    'correctly sets efsVolumeConfiguration'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const volume = {
        name: 'scratch',
        efsVolumeConfiguration: {
          fileSystemId: 'local',
        },
      };

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        volumes: [volume],
      });

      taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        Family: 'Ec2TaskDef',
        Volumes: [{
          Name: 'scratch',
          EfsVolumeConfiguration: {
            FileSystemId: 'local',
          },
        }],
      }));

      test.done();
    },
  },

  'throws when setting proxyConfiguration without networkMode AWS_VPC'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const proxyConfiguration = ecs.ProxyConfigurations.appMeshProxyConfiguration({
      containerName: 'envoy',
      properties: {
        ignoredUID: 1337,
        proxyIngressPort: 15000,
        proxyEgressPort: 15001,
        appPorts: [9080, 9081],
        egressIgnoredIPs: ['169.254.170.2', '169.254.169.254'],
      },
    });

    // THEN
    test.throws(() => {
      new ecs.Ec2TaskDefinition(stack, 'TaskDef', { networkMode: ecs.NetworkMode.BRIDGE, proxyConfiguration });
    }, /ProxyConfiguration can only be used with AwsVpc network mode, got: bridge/);

    test.done();
  },
};
