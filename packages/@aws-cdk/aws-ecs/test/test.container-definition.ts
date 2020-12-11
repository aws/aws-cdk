import * as path from 'path';
import { expect, haveResource, haveResourceLike, InspectionFailure } from '@aws-cdk/assert';
import * as ecr_assets from '@aws-cdk/aws-ecr-assets';
import * as s3 from '@aws-cdk/aws-s3';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ecs from '../lib';

export = {
  'When creating a Task Definition': {
    'add a container using default props'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      new ecs.ContainerDefinition(stack, 'Container', {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        taskDefinition,
        memoryLimitMiB: 2048,
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Essential: true,
            Image: '/aws/aws-example-app',
            Memory: 2048,
            Name: 'Container',
          },
        ],
      }));

      test.done();
    },

    'add a container using all props'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
      const secret = new secretsmanager.Secret(stack, 'Secret');
      new ecs.ContainerDefinition(stack, 'Container', {
        image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
        taskDefinition,
        memoryLimitMiB: 1024,
        memoryReservationMiB: 512,
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
      });

      // THEN
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
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
            Name: 'Container',
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
            User: 'rootUser',
            WorkingDirectory: 'a/b/c',
          },
        ],
      }));

      test.done();
    },

    'throws when MemoryLimit is less than MemoryReservationLimit'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      // THEN
      test.throws(() => {
        new ecs.ContainerDefinition(stack, 'Container', {
          image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
          taskDefinition,
          memoryLimitMiB: 512,
          memoryReservationMiB: 1024,
        });
      }, /MemoryLimitMiB should not be less than MemoryReservationMiB./);

      test.done();
    },

    'With network mode AwsVpc': {
      'throws when Host port is different from container port'(test: Test) {
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
        test.throws(() => {
          container.addPortMappings({
            containerPort: 8080,
            hostPort: 8081,
          });
        });

        test.done();
      },

      'Host port is the same as container port'(test: Test) {
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
        test.done();
      },

      'Host port can be empty '(test: Test) {
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
        test.done();
      },
    },

    'With network mode Host ': {
      'throws when Host port is different from container port'(test: Test) {
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
        test.throws(() => {
          container.addPortMappings({
            containerPort: 8080,
            hostPort: 8081,
          });
        });

        test.done();
      },

      'when host port is the same as container port'(test: Test) {
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
        test.done();
      },

      'Host port can be empty '(test: Test) {
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
        test.done();
      },

      'errors when adding links'(test: Test) {
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
        test.throws(() => {
          container.addLink(logger);
        });

        test.done();
      },
    },

    'With network mode Bridge': {
      'when Host port is empty '(test: Test) {
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
        test.done();
      },

      'when Host port is not empty '(test: Test) {
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
        test.done();
      },

      'allows adding links'(test: Test) {
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

        test.done();
      },
    },

    'With network mode NAT': {
      'produces undefined CF networkMode property'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();

        // WHEN
        new ecs.TaskDefinition(stack, 'TD', {
          compatibility: ecs.Compatibility.EC2,
          networkMode: ecs.NetworkMode.NAT,
        });

        // THEN
        expect(stack).to(haveResource('AWS::ECS::TaskDefinition', (props: any, inspection: InspectionFailure) => {
          if (props.NetworkMode === undefined) {
            return true;
          }

          inspection.failureReason = 'CF template should not have NetworkMode defined for a task definition that relies on NAT network mode.';
          return false;
        }));

        test.done();
      },
    },
  },

  'Container Port': {
    'should return the first container port in PortMappings'(test: Test) {
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
      test.equal(actual, expected, 'containerPort should return the first container port in PortMappings');
      test.done();
    },

    'throws when calling containerPort with no PortMappings'(test: Test) {
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
      test.throws(() => {
        const actual = container.containerPort;
        const expected = 8080;
        test.equal(actual, expected);
      }, /Container MyContainer hasn't defined any ports. Call addPortMappings()./);

      test.done();
    },
  },

  'Ingress Port': {
    'With network mode AwsVpc': {
      'Ingress port should be the same as container port'(test: Test) {
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
        test.equal(actual, expected, 'Ingress port should be the same as container port');
        test.done();
      },

      'throws when calling ingressPort with no PortMappings'(test: Test) {
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
        test.throws(() => {
          const actual = container.ingressPort;
          const expected = 8080;
          test.equal(actual, expected);
        }, /Container MyContainer hasn't defined any ports. Call addPortMappings()./);

        test.done();
      },
    },

    'With network mode Host ': {
      'Ingress port should be the same as container port'(test: Test) {
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
        test.equal(actual, expected);
        test.done();
      },
    },

    'With network mode Bridge': {
      'Ingress port should be the same as host port if supplied'(test: Test) {
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
        test.equal(actual, expected);
        test.done();
      },

      'Ingress port should be 0 if not supplied'(test: Test) {
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
        test.equal(actual, expected);
        test.done();
      },
    },
  },

  'can add environment variables to the container definition'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      environment: {
        TEST_ENVIRONMENT_VARIABLE: 'test environment variable value',
      },
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [{
            Name: 'TEST_ENVIRONMENT_VARIABLE',
            Value: 'test environment variable value',
          }],
        },
      ],
    }));

    test.done();

  },

  'Environment Files': {
    'with EC2 task definitions': {
      'can add asset environment file to the container definition'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

        // WHEN
        taskDefinition.addContainer('cont', {
          image: ecs.ContainerImage.fromRegistry('test'),
          memoryLimitMiB: 1024,
          environmentFiles: [ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles/test-envfile.env'))],
        });

        // THEN
        expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
          ContainerDefinitions: [
            {
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
            },
          ],
        }));

        test.done();
      },
      'can add s3 bucket environment file to the container definition'(test: Test) {
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
        expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
          ContainerDefinitions: [
            {
              EnvironmentFiles: [{
                Type: 's3',
                Value: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:aws:s3:::',
                      {
                        Ref: 'Bucket83908E77',
                      },
                      '/test-key',
                    ],
                  ],
                },
              }],
            },
          ],
        }));

        test.done();
      },
    },
    'with Fargate task definitions': {
      'can add asset environment file to the container definition'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

        // WHEN
        taskDefinition.addContainer('cont', {
          image: ecs.ContainerImage.fromRegistry('test'),
          memoryLimitMiB: 1024,
          environmentFiles: [ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles/test-envfile.env'))],
        });

        // THEN
        expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
          ContainerDefinitions: [
            {
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
            },
          ],
        }));

        test.done();
      },
      'can add s3 bucket environment file to the container definition'(test: Test) {
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
        expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
          ContainerDefinitions: [
            {
              EnvironmentFiles: [{
                Type: 's3',
                Value: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:aws:s3:::',
                      {
                        Ref: 'Bucket83908E77',
                      },
                      '/test-key',
                    ],
                  ],
                },
              }],
            },
          ],
        }));

        test.done();
      },
    },
  },

  'Given GPU count parameter': {
    'will add resource requirements to container definition'(test: Test) {
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
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Image: 'test',
            ResourceRequirements: [
              {
                Type: 'GPU',
                Value: '4',
              },
            ],
          },
        ],
      }));

      test.done();
    },
  },

  'can add secret environment variables to the container definition'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

    const secret = new secretsmanager.Secret(stack, 'Secret');
    const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Parameter', {
      parameterName: '/name',
      version: 1,
    });

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      secrets: {
        SECRET: ecs.Secret.fromSecretsManager(secret),
        PARAMETER: ecs.Secret.fromSsmParameter(parameter),
      },
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
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
        },
      ],
    }));

    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
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
    }));

    test.done();

  },

  'use a specific secret JSON key as environment variable'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
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
        },
      ],
    }));

    test.done();

  },

  'use a specific secret JSON field as environment variable for a Fargate task'(test: Test) {
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
      },
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
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
        },
      ],
    }));

    test.done();
  },

  'can add AWS logging to container definition'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': { Ref: 'TaskDefcontLogGroup4E10DCBF' },
              'awslogs-stream-prefix': 'prefix',
              'awslogs-region': { Ref: 'AWS::Region' },
            },
          },
        },
      ],
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
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
    }));

    test.done();
  },

  'can set Health Check with defaults'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          HealthCheck: {
            Command: ['CMD-SHELL', hcCommand],
            Interval: 30,
            Retries: 3,
            Timeout: 5,
          },
        },
      ],
    }));

    test.done();
  },

  'throws when setting Health Check with no commands'(test: Test) {
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
    test.throws(() => {
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
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
      }));
    }, /At least one argument must be supplied for health check command./);

    test.done();
  },

  'can specify Health Check values in shell form'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          HealthCheck: {
            Command: ['CMD-SHELL', hcCommand],
            Interval: 20,
            Retries: 5,
            Timeout: 5,
            StartPeriod: 10,
          },
        },
      ],
    }));

    test.done();
  },

  'can specify Health Check values in array form starting with CMD-SHELL'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          HealthCheck: {
            Command: ['CMD-SHELL', hcCommand],
            Interval: 20,
            Retries: 5,
            Timeout: 5,
            StartPeriod: 10,
          },
        },
      ],
    }));

    test.done();
  },

  'can specify Health Check values in array form starting with CMD'(test: Test) {
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
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          HealthCheck: {
            Command: ['CMD', hcCommand],
            Interval: 20,
            Retries: 5,
            Timeout: 5,
            StartPeriod: 10,
          },
        },
      ],
    }));

    test.done();
  },

  'can specify private registry credentials'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
    const mySecretArn = 'arn:aws:secretsmanager:region:1234567890:secret:MyRepoSecret-6f8hj3';

    const repoCreds = secretsmanager.Secret.fromSecretArn(stack, 'MyRepoSecret', mySecretArn);

    // WHEN
    taskDefinition.addContainer('Container', {
      image: ecs.ContainerImage.fromRegistry('user-x/my-app', {
        credentials: repoCreds,
      }),
      memoryLimitMiB: 2048,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Image: 'user-x/my-app',
          RepositoryCredentials: {
            CredentialsParameter: mySecretArn,
          },
        },
      ],
    }));

    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
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
    }));

    test.done();
  },

  '_linkContainer works properly': {
    'when the props passed in is an essential container'(test: Test) {
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
      test.equal(taskDefinition.defaultContainer, container);

      test.done();
    },

    'when the props passed in is not an essential container'(test: Test) {
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
      test.equal(taskDefinition.defaultContainer, undefined);

      test.done();
    },
  },

  'Can specify linux parameters': {
    'with only required properties set, it correctly sets default properties'(test: Test) {
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
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Image: 'test',
            LinuxParameters: {
              Capabilities: {},
            },
          },
        ],
      }));

      test.done();
    },

    'before calling addContainer'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters', {
        initProcessEnabled: true,
        sharedMemorySize: 1024,
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
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Image: 'test',
            LinuxParameters: {
              Capabilities: {
                Add: ['ALL'],
                Drop: ['KILL'],
              },
              InitProcessEnabled: true,
              SharedMemorySize: 1024,
            },
          },
        ],
      }));

      test.done();
    },

    'after calling addContainer'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters', {
        initProcessEnabled: true,
        sharedMemorySize: 1024,
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
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Image: 'test',
            LinuxParameters: {
              Capabilities: {
                Add: ['ALL'],
                Drop: ['SETUID'],
              },
              InitProcessEnabled: true,
              SharedMemorySize: 1024,
            },
          },
        ],
      }));

      test.done();
    },

    'with one or more host devices'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters', {
        initProcessEnabled: true,
        sharedMemorySize: 1024,
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
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Image: 'test',
            LinuxParameters: {
              Devices: [
                {
                  HostPath: 'a/b/c',
                },
              ],
              InitProcessEnabled: true,
              SharedMemorySize: 1024,
            },
          },
        ],
      }));

      test.done();
    },

    'with the tmpfs mount for a container'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters', {
        initProcessEnabled: true,
        sharedMemorySize: 1024,
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
      expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Image: 'test',
            LinuxParameters: {
              Tmpfs: [
                {
                  ContainerPath: 'a/b/c',
                  Size: 1024,
                },
              ],
              InitProcessEnabled: true,
              SharedMemorySize: 1024,
            },
          },
        ],
      }));

      test.done();
    },
  },

  'can use a DockerImageAsset directly for a container image'(test: Test) {
    // GIVEN
    const app = new cdk.App({
      context: {
        '@aws-cdk/aws-ecr-assets:dockerIgnoreSupport': true,
      },
    });
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
    expect(stack).to(haveResource('AWS::ECS::TaskDefinition', {
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
                '/aws-cdk/assets:b2c69bfbfe983b634456574587443159b3b7258849856a118ad3d2772238f1a5',
              ],
            ],
          },
          Memory: 1024,
          Name: 'default',
        },
      ],
    }));
    expect(stack).to(haveResource('AWS::IAM::Policy', {
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
    }));
    test.done();
  },

  'docker image asset options can be used when using container image'(test: Test) {
    // GIVEN
    const app = new cdk.App({
      context: {
        '@aws-cdk/aws-ecr-assets:dockerIgnoreSupport': true,
      },
    });
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
    test.deepEqual(asm.getStackArtifact(stack.artifactId).assets[0], {
      repositoryName: 'aws-cdk/assets',
      imageTag: 'ce3419d7c5d2d44e2789b13ccbd2d54ddf682557669f68bcee753231f5f1c0a5',
      id: 'ce3419d7c5d2d44e2789b13ccbd2d54ddf682557669f68bcee753231f5f1c0a5',
      packaging: 'container-image',
      path: 'asset.ce3419d7c5d2d44e2789b13ccbd2d54ddf682557669f68bcee753231f5f1c0a5',
      sourceHash: 'ce3419d7c5d2d44e2789b13ccbd2d54ddf682557669f68bcee753231f5f1c0a5',
      target: 'build-target',
      file: 'index.py',
    });
    test.done();
  },
};
