import * as path from 'path';
import { Match, Template } from '@aws-cdk/assertions';
import * as ecr_assets from '@aws-cdk/aws-ecr-assets';
import * as s3 from '@aws-cdk/aws-s3';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import { testLegacyBehavior } from '@aws-cdk/cdk-build-tools/lib/feature-flag';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as ecs from '../lib';

describe('container definition', () => {
  describe('When creating a Task Definition', () => {
    test('add a container using default props', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      new ecs.ContainerDefinition(stack, 'Container', {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        taskDefinition,
        memoryLimitMiB: 2048,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Essential: true,
            Image: '/aws/aws-example-app',
            Memory: 2048,
            Name: 'Container',
          },
        ],
      });


    });

    test('add a container using all props', () => {
      // GIVEN
      const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new cdk.Stack(app);
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
      const secret = new secretsmanager.Secret(stack, 'Secret');
      new ecs.ContainerDefinition(stack, 'Container', {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        taskDefinition,
        memoryLimitMiB: 1024,
        memoryReservationMiB: 512,
        containerName: 'Example Container',
        command: ['CMD-SHELL'],
        cpu: 128,
        disableNetworking: true,
        dnsSearchDomains: ['example.com'],
        dnsServers: ['host.com'],
        dockerLabels: {
          key: 'fooLabel',
          value: 'barLabel',
        },
        dockerSecurityOptions: ['ECS_SELINUX_CAPABLE=true'],
        entryPoint: ['top', '-b'],
        environment: {
          key: 'foo',
          value: 'bar',
        },
        environmentFiles: [ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles/test-envfile.env'))],
        essential: true,
        extraHosts: {
          name: 'dev-db.hostname.pvt',
        },
        gpuCount: 256,
        hostname: 'host.example.com',
        privileged: true,
        readonlyRootFilesystem: true,
        startTimeout: cdk.Duration.millis(2000),
        stopTimeout: cdk.Duration.millis(5000),
        user: 'rootUser',
        workingDirectory: 'a/b/c',
        healthCheck: {
          command: ['curl localhost:8000'],
        },
        linuxParameters: new ecs.LinuxParameters(stack, 'LinuxParameters'),
        logging: new ecs.AwsLogDriver({ streamPrefix: 'prefix' }),
        secrets: {
          SECRET: ecs.Secret.fromSecretsManager(secret),
        },
        systemControls: [
          { namespace: 'SomeNamespace', value: 'SomeValue' },
        ],
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Command: [
              'CMD-SHELL',
            ],
            Cpu: 128,
            DisableNetworking: true,
            DnsSearchDomains: [
              'example.com',
            ],
            DnsServers: [
              'host.com',
            ],
            DockerLabels: {
              key: 'fooLabel',
              value: 'barLabel',
            },
            DockerSecurityOptions: [
              'ECS_SELINUX_CAPABLE=true',
            ],
            EntryPoint: [
              'top',
              '-b',
            ],
            Environment: [
              {
                Name: 'key',
                Value: 'foo',
              },
              {
                Name: 'value',
                Value: 'bar',
              },
            ],
            EnvironmentFiles: [{
              Type: 's3',
              Value: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':s3:::',
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
                Hostname: 'name',
                IpAddress: 'dev-db.hostname.pvt',
              },
            ],
            HealthCheck: {
              Command: [
                'CMD-SHELL',
                'curl localhost:8000',
              ],
              Interval: 30,
              Retries: 3,
              Timeout: 5,
            },
            Hostname: 'host.example.com',
            Image: '/aws/aws-example-app',
            LinuxParameters: {
              Capabilities: {},
            },
            LogConfiguration: {
              LogDriver: 'awslogs',
              Options: {
                'awslogs-group': {
                  Ref: 'ContainerLogGroupE6FD74A4',
                },
                'awslogs-stream-prefix': 'prefix',
                'awslogs-region': {
                  Ref: 'AWS::Region',
                },
              },
            },
            Memory: 1024,
            MemoryReservation: 512,
            Name: 'Example Container',
            Privileged: true,
            ReadonlyRootFilesystem: true,
            ResourceRequirements: [
              {
                Type: 'GPU',
                Value: '256',
              },
            ],
            Secrets: [
              {
                Name: 'SECRET',
                ValueFrom: {
                  Ref: 'SecretA720EF05',
                },
              },
            ],
            StartTimeout: 2,
            StopTimeout: 5,
            SystemControls: [
              {
                Namespace: 'SomeNamespace',
                Value: 'SomeValue',
              },
            ],
            User: 'rootUser',
            WorkingDirectory: 'a/b/c',
          },
        ],
      });


    });

    test('throws when MemoryLimit is less than MemoryReservationLimit', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // THEN
      expect(() => {
        new ecs.ContainerDefinition(stack, 'Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          taskDefinition,
          memoryLimitMiB: 512,
          memoryReservationMiB: 1024,
        });
      }).toThrow(/MemoryLimitMiB should not be less than MemoryReservationMiB./);


    });

    describe('With network mode AwsVpc', () => {
      test('throws when Host port is different from container port', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.AWS_VPC,
        });

        const container = taskDefinition.addContainer('Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        // THEN
        expect(() => {
          container.addPortMappings({
            containerPort: 8080,
            hostPort: 8081,
          });
        }).toThrow();


      });

      test('Host port is the same as container port', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.AWS_VPC,
        });

        const container = taskDefinition.addContainer('Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        container.addPortMappings({
          containerPort: 8080,
          hostPort: 8080,
        });

        // THEN no exception raised

      });

      test('Host port can be empty ', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.AWS_VPC,
        });

        const container = taskDefinition.addContainer('Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        // WHEN
        container.addPortMappings({
          containerPort: 8080,
        });

        // THEN no exception raised

      });
    });

    describe('With network mode Host ', () => {
      test('throws when Host port is different from container port', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.HOST,
        });

        const container = taskDefinition.addContainer('Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        // THEN
        expect(() => {
          container.addPortMappings({
            containerPort: 8080,
            hostPort: 8081,
          });
        }).toThrow();


      });

      test('when host port is the same as container port', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.HOST,
        });

        const container = taskDefinition.addContainer('Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        container.addPortMappings({
          containerPort: 8080,
          hostPort: 8080,
        });

        // THEN no exception raised

      });

      test('Host port can be empty ', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.HOST,
        });

        const container = taskDefinition.addContainer('Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        // WHEN
        container.addPortMappings({
          containerPort: 8080,
        });

        // THEN no exception raised

      });

      test('errors when adding links', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.HOST,
        });

        const container = taskDefinition.addContainer('Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        const logger = taskDefinition.addContainer('LoggingContainer', {
          image: ecs.ContainerImage.fromRegistry('myLogger'),
          memoryLimitMiB: 1024,
        });

        // THEN
        expect(() => {
          container.addLink(logger);
        }).toThrow();


      });
    });

    describe('With network mode Bridge', () => {
      test('when Host port is empty ', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.BRIDGE,
        });

        const container = taskDefinition.addContainer('Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        container.addPortMappings({
          containerPort: 8080,
        });

        // THEN no exception raises

      });

      test('when Host port is not empty ', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.BRIDGE,
        });

        const container = taskDefinition.addContainer('Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        container.addPortMappings({
          containerPort: 8080,
          hostPort: 8084,
        });

        // THEN no exception raises

      });

      test('allows adding links', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.BRIDGE,
        });

        const container = taskDefinition.addContainer('Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        const logger = taskDefinition.addContainer('LoggingContainer', {
          image: ecs.ContainerImage.fromRegistry('myLogger'),
          memoryLimitMiB: 1024,
        });

        // THEN
        container.addLink(logger);


      });
    });

    describe('With network mode NAT', () => {
      test('produces undefined CF networkMode property', () => {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new ecs.TaskDefinition(stack, 'TD', {
          compatibility: ecs.Compatibility.EC2,
          networkMode: ecs.NetworkMode.NAT,
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
          NetworkMode: Match.absent(),
        });
      });
    });
  });

  describe('Container Port', () => {
    test('should return the first container port in PortMappings', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
        networkMode: ecs.NetworkMode.AWS_VPC,
      });

      const container = taskDefinition.addContainer('Container', {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        memoryLimitMiB: 2048,
      });

      // WHEN
      container.addPortMappings({
        containerPort: 8080,
      });

      container.addPortMappings({
        containerPort: 8081,
      });
      const actual = container.containerPort;

      // THEN
      const expected = 8080;
      expect(actual).toEqual(expected);

    });

    test('throws when calling containerPort with no PortMappings', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
        networkMode: ecs.NetworkMode.AWS_VPC,
      });

      const container = taskDefinition.addContainer('MyContainer', {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        memoryLimitMiB: 2048,
      });

      // THEN
      expect(() => {
        const actual = container.containerPort;
        const expected = 8080;
        expect(actual).toEqual(expected);
      }).toThrow(/Container MyContainer hasn't defined any ports. Call addPortMappings\(\)./);


    });
  });

  describe('Ingress Port', () => {
    describe('With network mode AwsVpc', () => {
      test('Ingress port should be the same as container port', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.AWS_VPC,
        });

        const container = taskDefinition.addContainer('Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        // WHEN
        container.addPortMappings({
          containerPort: 8080,
        });
        const actual = container.ingressPort;

        // THEN
        const expected = 8080;
        expect(actual).toEqual(expected);

      });

      test('throws when calling ingressPort with no PortMappings', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.AWS_VPC,
        });

        const container = taskDefinition.addContainer('MyContainer', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        // THEN
        expect(() => {
          const actual = container.ingressPort;
          const expected = 8080;
          expect(actual).toEqual(expected);
        }).toThrow(/Container MyContainer hasn't defined any ports. Call addPortMappings\(\)./);


      });
    });

    describe('With network mode Host ', () => {
      test('Ingress port should be the same as container port', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.HOST,
        });

        const container = taskDefinition.addContainer('Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        // WHEN
        container.addPortMappings({
          containerPort: 8080,
        });
        const actual = container.ingressPort;

        // THEN
        const expected = 8080;
        expect(actual).toEqual( expected);

      });
    });

    describe('With network mode Bridge', () => {
      test('Ingress port should be the same as host port if supplied', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.BRIDGE,
        });

        const container = taskDefinition.addContainer('Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        // WHEN
        container.addPortMappings({
          containerPort: 8080,
          hostPort: 8081,
        });
        const actual = container.ingressPort;

        // THEN
        const expected = 8081;
        expect(actual).toEqual( expected);

      });

      test('Ingress port should be 0 if not supplied', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.BRIDGE,
        });

        const container = taskDefinition.addContainer('Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          memoryLimitMiB: 2048,
        });

        // WHEN
        container.addPortMappings({
          containerPort: 8081,
        });
        const actual = container.ingressPort;

        // THEN
        const expected = 0;
        expect(actual).toEqual(expected);

      });
    });
  });

  test('can add environment variables to the container definition', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

    // WHEN
    const container = taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      environment: {
        TEST_ENVIRONMENT_VARIABLE: 'test environment variable value',
      },
    });
    container.addEnvironment('SECOND_ENVIRONEMENT_VARIABLE', 'second test value');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Environment: [{
            Name: 'TEST_ENVIRONMENT_VARIABLE',
            Value: 'test environment variable value',
          },
          {
            Name: 'SECOND_ENVIRONEMENT_VARIABLE',
            Value: 'second test value',
          }],
        }),
      ],
    });
  });

  test('can add environment variables to container definition with no environment', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

    // WHEN
    const container = taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
    });
    container.addEnvironment('SECOND_ENVIRONEMENT_VARIABLE', 'second test value');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Environment: [{
            Name: 'SECOND_ENVIRONEMENT_VARIABLE',
            Value: 'second test value',
          }],
        }),
      ],
    });
  });

  test('can add port mappings to the container definition by props', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      portMappings: [{ containerPort: 80 }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          PortMappings: [Match.objectLike({ ContainerPort: 80 })],
        }),
      ],
    });
  });

  test('can add port mappings using props and addPortMappings and both are included', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

    // WHEN
    const containerDefinition = taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      portMappings: [{ containerPort: 80 }],
    });

    containerDefinition.addPortMappings({ containerPort: 443 });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          PortMappings: [
            Match.objectLike({ ContainerPort: 80 }),
            Match.objectLike({ ContainerPort: 443 }),
          ],
        }),
      ],
    });
  });

  test('can specify system controls', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      systemControls: [
        { namespace: 'SomeNamespace1', value: 'SomeValue1' },
        { namespace: 'SomeNamespace2', value: 'SomeValue2' },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          SystemControls: [
            {
              Namespace: 'SomeNamespace1',
              Value: 'SomeValue1',
            },
            {
              Namespace: 'SomeNamespace2',
              Value: 'SomeValue2',
            },
          ],
        }),
      ],
    });
  });

  describe('Environment Files', () => {
    describe('with EC2 task definitions', () => {
      test('can add asset environment file to the container definition', () => {
        // GIVEN
        const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new cdk.Stack(app);
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

        // WHEN
        taskDefinition.addContainer('cont', {
          image: ecs.ContainerImage.fromRegistry('test'),
          memoryLimitMiB: 1024,
          environmentFiles: [ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles/test-envfile.env'))],
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
          ContainerDefinitions: [
            Match.objectLike({
              EnvironmentFiles: [{
                Type: 's3',
                Value: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':s3:::',
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
            }),
          ],
        });

      });
      test('can add s3 bucket environment file to the container definition', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'Bucket', {
          bucketName: 'test-bucket',
        });
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

        // WHEN
        taskDefinition.addContainer('cont', {
          image: ecs.ContainerImage.fromRegistry('test'),
          memoryLimitMiB: 1024,
          environmentFiles: [ecs.EnvironmentFile.fromBucket(bucket, 'test-key')],
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
          ContainerDefinitions: [
            Match.objectLike({
              EnvironmentFiles: [{
                Type: 's3',
                Value: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':s3:::',
                      {
                        Ref: 'Bucket83908E77',
                      },
                      '/test-key',
                    ],
                  ],
                },
              }],
            }),
          ],
        });
      });
    });

    describe('with Fargate task definitions', () => {
      test('can add asset environment file to the container definition', () => {
        // GIVEN
        const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new cdk.Stack(app);
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

        // WHEN
        taskDefinition.addContainer('cont', {
          image: ecs.ContainerImage.fromRegistry('test'),
          memoryLimitMiB: 1024,
          environmentFiles: [ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles/test-envfile.env'))],
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
          ContainerDefinitions: [
            Match.objectLike({
              EnvironmentFiles: [{
                Type: 's3',
                Value: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':s3:::',
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
            }),
          ],
        });
      });

      test('can add s3 bucket environment file to the container definition', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'Bucket', {
          bucketName: 'test-bucket',
        });
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

        // WHEN
        taskDefinition.addContainer('cont', {
          image: ecs.ContainerImage.fromRegistry('test'),
          memoryLimitMiB: 1024,
          environmentFiles: [ecs.EnvironmentFile.fromBucket(bucket, 'test-key')],
        });

        // THEN
        Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
          ContainerDefinitions: [
            Match.objectLike({
              EnvironmentFiles: [{
                Type: 's3',
                Value: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':s3:::',
                      {
                        Ref: 'Bucket83908E77',
                      },
                      '/test-key',
                    ],
                  ],
                },
              }],
            }),
          ],
        });
      });
    });
  });

  describe('Given GPU count parameter', () => {
    test('will add resource requirements to container definition', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // WHEN
      taskDefinition.addContainer('cont', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        gpuCount: 4,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            Image: 'test',
            ResourceRequirements: [
              {
                Type: 'GPU',
                Value: '4',
              },
            ],
          }),
        ],
      });
    });
  });

  describe('Given InferenceAccelerator resource parameter', () => {
    test('correctly adds resource requirements to container definition using inference accelerator resource property', () => {
      // GIVEN
      const stack = new cdk.Stack();

      const inferenceAccelerators = [{
        deviceName: 'device1',
        deviceType: 'eia2.medium',
      }];

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        inferenceAccelerators,
      });

      const inferenceAcceleratorResources = ['device1'];

      // WHEN
      taskDefinition.addContainer('cont', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        inferenceAcceleratorResources,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        Family: 'Ec2TaskDef',
        InferenceAccelerators: [{
          DeviceName: 'device1',
          DeviceType: 'eia2.medium',
        }],
        ContainerDefinitions: [
          Match.objectLike({
            Image: 'test',
            ResourceRequirements: [
              {
                Type: 'InferenceAccelerator',
                Value: 'device1',
              },
            ],
          }),
        ],
      });
    });

    test('correctly adds resource requirements to container definition using both props and addInferenceAcceleratorResource method', () => {
      // GIVEN
      const stack = new cdk.Stack();

      const inferenceAccelerators = [{
        deviceName: 'device1',
        deviceType: 'eia2.medium',
      }, {
        deviceName: 'device2',
        deviceType: 'eia2.large',
      }];

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        inferenceAccelerators,
      });

      const inferenceAcceleratorResources = ['device1'];

      const container = taskDefinition.addContainer('cont', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        inferenceAcceleratorResources,
      });

      // WHEN
      container.addInferenceAcceleratorResource('device2');

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        Family: 'Ec2TaskDef',
        InferenceAccelerators: [{
          DeviceName: 'device1',
          DeviceType: 'eia2.medium',
        }, {
          DeviceName: 'device2',
          DeviceType: 'eia2.large',
        }],
        ContainerDefinitions: [
          Match.objectLike({
            Image: 'test',
            ResourceRequirements: [
              {
                Type: 'InferenceAccelerator',
                Value: 'device1',
              },
              {
                Type: 'InferenceAccelerator',
                Value: 'device2',
              },
            ],
          }),
        ],
      });
    });

    test('throws when the value of inference accelerator resource does not match any inference accelerators defined in the Task Definition', () => {
      // GIVEN
      const stack = new cdk.Stack();

      const inferenceAccelerators = [{
        deviceName: 'device1',
        deviceType: 'eia2.medium',
      }];

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        inferenceAccelerators,
      });

      const inferenceAcceleratorResources = ['device2'];

      // THEN
      expect(() => {
        taskDefinition.addContainer('cont', {
          image: ecs.ContainerImage.fromRegistry('test'),
          memoryLimitMiB: 1024,
          inferenceAcceleratorResources,
        });
      }).toThrow(/Resource value device2 in container definition doesn't match any inference accelerator device name in the task definition./);
    });
  });

  test('adds resource requirements when both inference accelerator and gpu count are defined in the container definition', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const inferenceAccelerators = [{
      deviceName: 'device1',
      deviceType: 'eia2.medium',
    }];

    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
      inferenceAccelerators,
    });

    const inferenceAcceleratorResources = ['device1'];

    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      gpuCount: 2,
      inferenceAcceleratorResources,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      Family: 'Ec2TaskDef',
      InferenceAccelerators: [{
        DeviceName: 'device1',
        DeviceType: 'eia2.medium',
      }],
      ContainerDefinitions: [
        Match.objectLike({
          Image: 'test',
          ResourceRequirements: [{
            Type: 'InferenceAccelerator',
            Value: 'device1',
          }, {
            Type: 'GPU',
            Value: '2',
          }],
        }),
      ],
    });
  });

  test('can add secret environment variables to the container definition', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

    const secret = new secretsmanager.Secret(stack, 'Secret');
    const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Parameter', {
      parameterName: '/name',
      version: 1,
    });

    // WHEN
    const container = taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      secrets: {
        SECRET: ecs.Secret.fromSecretsManager(secret),
        PARAMETER: ecs.Secret.fromSsmParameter(parameter),
        SECRET_ID: ecs.Secret.fromSecretsManagerVersion(secret, { versionId: 'version-id' }),
        SECRET_STAGE: ecs.Secret.fromSecretsManagerVersion(secret, { versionStage: 'version-stage' }),
      },
    });
    container.addSecret('LATER_SECRET', ecs.Secret.fromSecretsManager(secret, 'field'));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
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
            {
              Name: 'SECRET_ID',
              ValueFrom: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'SecretA720EF05',
                    },
                    ':::version-id',
                  ],
                ],
              },
            },
            {
              Name: 'SECRET_STAGE',
              ValueFrom: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'SecretA720EF05',
                    },
                    '::version-stage:',
                  ],
                ],
              },
            },
            {
              Name: 'LATER_SECRET',
              ValueFrom: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'SecretA720EF05',
                    },
                    ':field::',
                  ],
                ],
              },
            },
          ],
        }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'secretsmanager:GetSecretValue',
              'secretsmanager:DescribeSecret',
            ],
            Effect: 'Allow',
            Resource: {
              Ref: 'SecretA720EF05',
            },
          },
          {
            Action: [
              'ssm:DescribeParameters',
              'ssm:GetParameters',
              'ssm:GetParameter',
              'ssm:GetParameterHistory',
            ],
            Effect: 'Allow',
            Resource: {
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
        Version: '2012-10-17',
      },
    });
  });

  test('use a specific secret JSON key as environment variable', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

    const secret = new secretsmanager.Secret(stack, 'Secret');

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      secrets: {
        SECRET_KEY: ecs.Secret.fromSecretsManager(secret, 'specificKey'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Secrets: [
            {
              Name: 'SECRET_KEY',
              ValueFrom: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'SecretA720EF05',
                    },
                    ':specificKey::',
                  ],
                ],
              },
            },
          ],
        }),
      ],
    });
  });

  test('use a specific secret JSON field as environment variable for a Fargate task', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

    const secret = new secretsmanager.Secret(stack, 'Secret');

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      secrets: {
        SECRET_KEY: ecs.Secret.fromSecretsManager(secret, 'specificKey'),
        SECRET_KEY_ID: ecs.Secret.fromSecretsManagerVersion(secret, { versionId: 'version-id' }, 'specificKey'),
        SECRET_KEY_STAGE: ecs.Secret.fromSecretsManagerVersion(secret, { versionStage: 'version-stage' }, 'specificKey'),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Secrets: [
            {
              Name: 'SECRET_KEY',
              ValueFrom: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'SecretA720EF05',
                    },
                    ':specificKey::',
                  ],
                ],
              },
            },
            {
              Name: 'SECRET_KEY_ID',
              ValueFrom: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'SecretA720EF05',
                    },
                    ':specificKey::version-id',
                  ],
                ],
              },
            },
            {
              Name: 'SECRET_KEY_STAGE',
              ValueFrom: {
                'Fn::Join': [
                  '',
                  [
                    {
                      Ref: 'SecretA720EF05',
                    },
                    ':specificKey:version-stage:',
                  ],
                ],
              },
            },
          ],
        }),
      ],
    });
  });

  test('can add AWS logging to container definition', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      logging: new ecs.AwsLogDriver({ streamPrefix: 'prefix' }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': { Ref: 'TaskDefcontLogGroup4E10DCBF' },
              'awslogs-stream-prefix': 'prefix',
              'awslogs-region': { Ref: 'AWS::Region' },
            },
          },
        }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': ['TaskDefcontLogGroup4E10DCBF', 'Arn'] },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('can set Health Check with defaults', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
    const hcCommand = 'curl localhost:8000';

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      healthCheck: {
        command: [hcCommand],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          HealthCheck: {
            Command: ['CMD-SHELL', hcCommand],
            Interval: 30,
            Retries: 3,
            Timeout: 5,
          },
        }),
      ],
    });
  });

  test('throws when setting Health Check with no commands', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      healthCheck: {
        command: [],
      },
    });

    // THEN
    expect(() => {
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            HealthCheck: {
              Command: [],
              Interval: 30,
              Retries: 3,
              Timeout: 5,
            },
          },
        ],
      });
    }).toThrow(/At least one argument must be supplied for health check command./);


  });

  test('can specify Health Check values in shell form', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
    const hcCommand = 'curl localhost:8000';

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      healthCheck: {
        command: [hcCommand],
        interval: cdk.Duration.seconds(20),
        retries: 5,
        startPeriod: cdk.Duration.seconds(10),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          HealthCheck: {
            Command: ['CMD-SHELL', hcCommand],
            Interval: 20,
            Retries: 5,
            Timeout: 5,
            StartPeriod: 10,
          },
        }),
      ],
    });
  });

  test('can specify Health Check values in array form starting with CMD-SHELL', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
    const hcCommand = 'curl localhost:8000';

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      healthCheck: {
        command: ['CMD-SHELL', hcCommand],
        interval: cdk.Duration.seconds(20),
        retries: 5,
        startPeriod: cdk.Duration.seconds(10),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          HealthCheck: {
            Command: ['CMD-SHELL', hcCommand],
            Interval: 20,
            Retries: 5,
            Timeout: 5,
            StartPeriod: 10,
          },
        }),
      ],
    });
  });

  test('can specify Health Check values in array form starting with CMD', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
    const hcCommand = 'curl localhost:8000';

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      healthCheck: {
        command: ['CMD', hcCommand],
        interval: cdk.Duration.seconds(20),
        retries: 5,
        startPeriod: cdk.Duration.seconds(10),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          HealthCheck: {
            Command: ['CMD', hcCommand],
            Interval: 20,
            Retries: 5,
            Timeout: 5,
            StartPeriod: 10,
          },
        }),
      ],
    });
  });

  test('can specify private registry credentials', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
    const mySecretArn = 'arn:aws:secretsmanager:region:1234567890:secret:MyRepoSecret-6f8hj3';

    const repoCreds = secretsmanager.Secret.fromSecretCompleteArn(stack, 'MyRepoSecret', mySecretArn);

    // WHEN
    taskDefinition.addContainer('Container', {
      image: ecs.ContainerImage.fromRegistry('user-x/my-app', {
        credentials: repoCreds,
      }),
      memoryLimitMiB: 2048,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        Match.objectLike({
          Image: 'user-x/my-app',
          RepositoryCredentials: {
            CredentialsParameter: mySecretArn,
          },
        }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'secretsmanager:GetSecretValue',
              'secretsmanager:DescribeSecret',
            ],
            Effect: 'Allow',
            Resource: mySecretArn,
          },
        ],
      },
    });
  });

  describe('_linkContainer works properly', () => {
    test('when the props passed in is an essential container', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // WHEN
      const container = taskDefinition.addContainer('cont', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        essential: true,
      });

      // THEN
      expect(taskDefinition.defaultContainer).toEqual( container);


    });

    test('when the props passed in is not an essential container', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // WHEN
      taskDefinition.addContainer('cont', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        essential: false,
      });

      // THEN
      expect(taskDefinition.defaultContainer).toEqual( undefined);


    });
  });

  describe('Can specify linux parameters', () => {
    test('validation throws with out of range params', () => {
      // GIVEN
      const stack = new cdk.Stack();

      const swappinessValues = [-1, 30.5, 101];
      swappinessValues.forEach(swappiness => expect(() =>
        new ecs.LinuxParameters(stack, `LinuxParametersWithSwappiness(${swappiness})`, { swappiness }))
        .toThrowError(`swappiness: Must be an integer between 0 and 100; received ${swappiness}.`));
    });

    test('with only required properties set, it correctly sets default properties', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters');

      // WHEN
      taskDefinition.addContainer('cont', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        linuxParameters,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            Image: 'test',
            LinuxParameters: {
              Capabilities: {},
            },
          }),
        ],
      });
    });

    test('before calling addContainer', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters', {
        initProcessEnabled: true,
        sharedMemorySize: 1024,
        maxSwap: cdk.Size.gibibytes(5),
        swappiness: 90,
      });

      linuxParameters.addCapabilities(ecs.Capability.ALL);
      linuxParameters.dropCapabilities(ecs.Capability.KILL);

      // WHEN
      taskDefinition.addContainer('cont', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        linuxParameters,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            Image: 'test',
            LinuxParameters: {
              Capabilities: {
                Add: ['ALL'],
                Drop: ['KILL'],
              },
              InitProcessEnabled: true,
              MaxSwap: 5 * 1024,
              SharedMemorySize: 1024,
              Swappiness: 90,
            },
          }),
        ],
      });
    });

    test('after calling addContainer', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters', {
        initProcessEnabled: true,
        sharedMemorySize: 1024,
        maxSwap: cdk.Size.gibibytes(5),
        swappiness: 90,
      });

      linuxParameters.addCapabilities(ecs.Capability.ALL);

      // WHEN
      taskDefinition.addContainer('cont', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        linuxParameters,
      });

      // Mutate linuxParameter after added to a container
      linuxParameters.dropCapabilities(ecs.Capability.SETUID);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            Image: 'test',
            LinuxParameters: {
              Capabilities: {
                Add: ['ALL'],
                Drop: ['SETUID'],
              },
              InitProcessEnabled: true,
              MaxSwap: 5 * 1024,
              SharedMemorySize: 1024,
              Swappiness: 90,
            },
          }),
        ],
      });
    });

    test('with one or more host devices', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters', {
        initProcessEnabled: true,
        sharedMemorySize: 1024,
        maxSwap: cdk.Size.gibibytes(5),
        swappiness: 90,
      });

      // WHEN
      linuxParameters.addDevices({
        hostPath: 'a/b/c',
      });

      taskDefinition.addContainer('cont', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        linuxParameters,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            Image: 'test',
            LinuxParameters: {
              Devices: [
                {
                  HostPath: 'a/b/c',
                },
              ],
              InitProcessEnabled: true,
              MaxSwap: 5 * 1024,
              SharedMemorySize: 1024,
              Swappiness: 90,
            },
          }),
        ],
      });
    });

    test('with the tmpfs mount for a container', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters', {
        initProcessEnabled: true,
        sharedMemorySize: 1024,
        maxSwap: cdk.Size.gibibytes(5),
        swappiness: 90,
      });

      // WHEN
      linuxParameters.addTmpfs({
        containerPath: 'a/b/c',
        size: 1024,
      });

      taskDefinition.addContainer('cont', {
        image: ecs.ContainerImage.fromRegistry('test'),
        memoryLimitMiB: 1024,
        linuxParameters,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          Match.objectLike({
            Image: 'test',
            LinuxParameters: {
              Tmpfs: [
                {
                  ContainerPath: 'a/b/c',
                  Size: 1024,
                },
              ],
              InitProcessEnabled: true,
              MaxSwap: 5 * 1024,
              SharedMemorySize: 1024,
              Swappiness: 90,
            },
          }),
        ],
      });
    });
  });

  class MyApp extends cdk.App {
    constructor() {
      super({
        context: {
          [cxapi.DOCKER_IGNORE_SUPPORT]: true,
        },
      });
    }
  }

  testLegacyBehavior('can use a DockerImageAsset directly for a container image', MyApp, (app) => {
    // GIVEN
    const stack = new cdk.Stack(app, 'Stack');
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
    const asset = new ecr_assets.DockerImageAsset(stack, 'MyDockerImage', {
      directory: path.join(__dirname, 'demo-image'),
    });

    // WHEN
    taskDefinition.addContainer('default', {
      image: ecs.ContainerImage.fromDockerImageAsset(asset),
      memoryLimitMiB: 1024,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Essential: true,
          Image: {
            'Fn::Join': [
              '',
              [
                { Ref: 'AWS::AccountId' },
                '.dkr.ecr.',
                { Ref: 'AWS::Region' },
                '.',
                { Ref: 'AWS::URLSuffix' },
                '/aws-cdk/assets:0a3355be12051c9984bf2b0b2bba4e6ea535968e5b6e7396449701732fe5ed14',
              ],
            ],
          },
          Memory: 1024,
          Name: 'default',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'ecr:BatchCheckLayerAvailability',
              'ecr:GetDownloadUrlForLayer',
              'ecr:BatchGetImage',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                ['arn:', { Ref: 'AWS::Partition' }, ':ecr:', { Ref: 'AWS::Region' }, ':', { Ref: 'AWS::AccountId' }, ':repository/aws-cdk/assets'],
              ],
            },
          },
          {
            Action: 'ecr:GetAuthorizationToken',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });

  });

  testLegacyBehavior('docker image asset options can be used when using container image', MyApp, (app) => {
    // GIVEN
    const stack = new cdk.Stack(app, 'MyStack');
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

    // WHEN
    taskDefinition.addContainer('default', {
      memoryLimitMiB: 1024,
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, 'demo-image'), {
        file: 'index.py', // just because it's there already
        target: 'build-target',
      }),
    });

    // THEN
    const asm = app.synth();
    expect(asm.getStackArtifact(stack.artifactId).assets[0]).toEqual({
      repositoryName: 'aws-cdk/assets',
      imageTag: '8b0801d3f897d960240bf5bf3d5a3e367e50a17e04101717320bfd52ebc9d64a',
      id: '8b0801d3f897d960240bf5bf3d5a3e367e50a17e04101717320bfd52ebc9d64a',
      packaging: 'container-image',
      path: 'asset.8b0801d3f897d960240bf5bf3d5a3e367e50a17e04101717320bfd52ebc9d64a',
      sourceHash: '8b0801d3f897d960240bf5bf3d5a3e367e50a17e04101717320bfd52ebc9d64a',
      target: 'build-target',
      file: 'index.py',
    });

  });

  testLegacyBehavior('exposes image name', cdk.App, (app) => {
    // GIVEN
    const stack = new cdk.Stack(app, 'MyStack');
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

    // WHEN
    const container = taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, 'demo-image')),
    });

    // THEN
    expect(stack.resolve(container.imageName)).toEqual({
      'Fn::Sub': '${AWS::AccountId}.dkr.ecr.${AWS::Region}.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-${AWS::AccountId}-${AWS::Region}:aba53d5f05c76afcd7e420dc8cd283ddc31657866bb4ba4ce221e13d8128d92c',
    });
  });
});
