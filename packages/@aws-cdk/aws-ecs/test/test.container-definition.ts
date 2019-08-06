import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import ssm = require('@aws-cdk/aws-ssm');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import ecs = require('../lib');

export = {
  "When creating a Task Definition": {
    // Validating portMapping inputs
    "With network mode AwsVpc": {
      "Host port should be the same as container port"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.AWS_VPC,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });

        // THEN
        test.throws(() => {
          container.addPortMappings({
            containerPort: 8080,
            hostPort: 8081
          });
        });

        test.done();
      },

      "Host port can be empty "(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.AWS_VPC,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
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

    "With network mode Host ": {
      "Host port should be the same as container port"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.HOST,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });

        // THEN
        test.throws(() => {
          container.addPortMappings({
            containerPort: 8080,
            hostPort: 8081
          });
        });

        test.done();
      },

      "Host port can be empty "(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.HOST,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });

        // WHEN
        container.addPortMappings({
          containerPort: 8080,
        });

        // THEN no exception raised
        test.done();
      },

      "errors when adding links"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.HOST,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });

        const logger = taskDefinition.addContainer("LoggingContainer", {
          image: ecs.ContainerImage.fromRegistry("myLogger"),
          memoryLimitMiB: 1024,
        });

        // THEN
        test.throws(() => {
          container.addLink(logger);
        });

        test.done();
      },
    },

    "With network mode Bridge": {
      "allows adding links"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.BRIDGE,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });

        const logger = taskDefinition.addContainer("LoggingContainer", {
          image: ecs.ContainerImage.fromRegistry("myLogger"),
          memoryLimitMiB: 1024,
        });

        // THEN
        container.addLink(logger);

        test.done();
      },
    }
  },

  "Ingress Port": {
    "With network mode AwsVpc": {
      "Ingress port should be the same as container port"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.AWS_VPC,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });

        // WHEN
        container.addPortMappings({
          containerPort: 8080,
        });
        const actual = container.ingressPort;

        // THEN
        const expected = 8080;
        test.equal(actual, expected, "Ingress port should be the same as container port");
        test.done();
      },
    },

    "With network mode Host ": {
      "Ingress port should be the same as container port"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.HOST,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
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

    "With network mode Bridge": {
      "Ingress port should be the same as host port if supplied"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.BRIDGE,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
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

      "Ingress port should be 0 if not supplied"(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef', {
          networkMode: ecs.NetworkMode.BRIDGE,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromRegistry("/aws/aws-example-app"),
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
        TEST_ENVIRONMENT_VARIABLE: "test environment variable value"
      }
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [{
            Name: "TEST_ENVIRONMENT_VARIABLE",
            Value: "test environment variable value"
          }]
        }
      ]
    }));

    test.done();

  },

  'can add secret environment variables to the container definition'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

    const secret = new secretsmanager.Secret(stack, 'Secret');
    const parameter = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Parameter', {
      parameterName: '/name',
      version: 1
    });

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      secrets: {
        SECRET: ecs.Secret.fromSecretsManager(secret),
        PARAMETER: ecs.Secret.fromSsmParameter(parameter),
      }
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Secrets: [
            {
              Name: "SECRET",
              ValueFrom: {
                Ref: "SecretA720EF05"
              }
            },
            {
              Name: "PARAMETER",
              ValueFrom: {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    {
                      Ref: "AWS::Partition"
                    },
                    ":ssm:",
                    {
                      Ref: "AWS::Region"
                    },
                    ":",
                    {
                      Ref: "AWS::AccountId"
                    },
                    ":parameter/name"
                  ]
                ]
              }
            },
          ]
        }
      ]
    }));

    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'secretsmanager:GetSecretValue',
            Effect: 'Allow',
            Resource: {
              Ref: 'SecretA720EF05'
            }
          },
          {
            Action: [
              'ssm:DescribeParameters',
              'ssm:GetParameters',
              'ssm:GetParameter',
              'ssm:GetParameterHistory'
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition'
                  },
                  ':ssm:',
                  {
                    Ref: 'AWS::Region'
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId'
                  },
                  ':parameter/name'
                ]
              ]
            }
          }
        ],
        Version: '2012-10-17'
      }
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
      logging: new ecs.AwsLogDriver({ streamPrefix: 'prefix' })
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: "awslogs",
            Options: {
              "awslogs-group": { Ref: "TaskDefcontLogGroup4E10DCBF" },
              "awslogs-stream-prefix": "prefix",
              "awslogs-region": { Ref: "AWS::Region" }
            }
          },
        }
      ]
    }));

    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
            Effect: "Allow",
            Resource: { "Fn::GetAtt": ["TaskDefcontLogGroup4E10DCBF", "Arn"] }
          }
        ],
        Version: "2012-10-17"
      }
    }));

    test.done();
  },
  'can set Health Check with defaults'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
    const hcCommand = "curl localhost:8000";

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      healthCheck: {
        command: [hcCommand]
      }
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          HealthCheck: {
            Command: ["CMD-SHELL", hcCommand],
            Interval: 30,
            Retries: 3,
            Timeout: 5
          },
        }
      ]
    }));

    test.done();
  },

  'can specify Health Check values in shell form'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
    const hcCommand = "curl localhost:8000";

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      healthCheck: {
        command: [hcCommand],
        interval: cdk.Duration.seconds(20),
        retries: 5,
        startPeriod: cdk.Duration.seconds(10)
      }
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          HealthCheck: {
            Command: ["CMD-SHELL", hcCommand],
            Interval: 20,
            Retries: 5,
            Timeout: 5,
            StartPeriod: 10
          },
        }
      ]
    }));

    test.done();
  },

  'can specify Health Check values in array form starting with CMD-SHELL'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
    const hcCommand = "curl localhost:8000";

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      healthCheck: {
        command: ["CMD-SHELL", hcCommand],
        interval: cdk.Duration.seconds(20),
        retries: 5,
        startPeriod: cdk.Duration.seconds(10)
      }
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          HealthCheck: {
            Command: ["CMD-SHELL", hcCommand],
            Interval: 20,
            Retries: 5,
            Timeout: 5,
            StartPeriod: 10
          },
        }
      ]
    }));

    test.done();
  },

  'can specify Health Check values in array form starting with CMD'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
    const hcCommand = "curl localhost:8000";

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromRegistry('test'),
      memoryLimitMiB: 1024,
      healthCheck: {
        command: ["CMD", hcCommand],
        interval: cdk.Duration.seconds(20),
        retries: 5,
        startPeriod: cdk.Duration.seconds(10)
      }
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          HealthCheck: {
            Command: ["CMD", hcCommand],
            Interval: 20,
            Retries: 5,
            Timeout: 5,
            StartPeriod: 10
          },
        }
      ]
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
        credentials: repoCreds
      }),
      memoryLimitMiB: 2048,
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Image: 'user-x/my-app',
          RepositoryCredentials: {
            CredentialsParameter: mySecretArn
          },
        }
      ]
    }));

    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: "secretsmanager:GetSecretValue",
            Effect: "Allow",
            Resource: mySecretArn
          }
        ]
      }
    }));

    test.done();
  },

  'Can specify linux parameters': {
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
                Add: ["ALL"],
                Drop: ["KILL"]
              },
              Devices: [],
              Tmpfs: [],
              InitProcessEnabled: true,
              SharedMemorySize: 1024,
            },
          }
        ]
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
                Add: ["ALL"],
                Drop: ["SETUID"]
              },
              Devices: [],
              Tmpfs: [],
              InitProcessEnabled: true,
              SharedMemorySize: 1024,
            },
          }
        ]
      }));

      test.done();
    },

    "with one or more host devices"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters', {
        initProcessEnabled: true,
        sharedMemorySize: 1024,
      });

      // WHEN
      linuxParameters.addDevices({
        hostPath: "a/b/c",
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
                  HostPath: "a/b/c"
                }
              ],
              Tmpfs: [],
              InitProcessEnabled: true,
              SharedMemorySize: 1024,
            },
          }
        ]
      }));

      test.done();
    },

    "with the tmpfs mount for a container"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

      const linuxParameters = new ecs.LinuxParameters(stack, 'LinuxParameters', {
        initProcessEnabled: true,
        sharedMemorySize: 1024,
      });

      // WHEN
      linuxParameters.addTmpfs({
        containerPath: "a/b/c",
        size: 1024
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
              Devices: [],
              Tmpfs: [
                {
                  ContainerPath: "a/b/c",
                  Size: 1024
                }
              ],
              InitProcessEnabled: true,
              SharedMemorySize: 1024,
            },
          }
        ]
      }));

      test.done();
    }
  },

  // render extra hosts test
};
