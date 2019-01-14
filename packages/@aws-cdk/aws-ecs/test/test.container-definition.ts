import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
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
          networkMode: ecs.NetworkMode.AwsVpc,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromDockerHub("/aws/aws-example-app"),
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
          networkMode: ecs.NetworkMode.AwsVpc,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromDockerHub("/aws/aws-example-app"),
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
          networkMode: ecs.NetworkMode.Host,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromDockerHub("/aws/aws-example-app"),
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
          networkMode: ecs.NetworkMode.Host,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromDockerHub("/aws/aws-example-app"),
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
          networkMode: ecs.NetworkMode.Host,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromDockerHub("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });

        const logger = taskDefinition.addContainer("LoggingContainer", {
          image: ecs.ContainerImage.fromDockerHub("myLogger"),
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
          networkMode: ecs.NetworkMode.Bridge,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromDockerHub("/aws/aws-example-app"),
          memoryLimitMiB: 2048,
        });

        const logger = taskDefinition.addContainer("LoggingContainer", {
          image: ecs.ContainerImage.fromDockerHub("myLogger"),
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
          networkMode: ecs.NetworkMode.AwsVpc,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromDockerHub("/aws/aws-example-app"),
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
          networkMode: ecs.NetworkMode.Host,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromDockerHub("/aws/aws-example-app"),
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
          networkMode: ecs.NetworkMode.Bridge,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromDockerHub("/aws/aws-example-app"),
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
          networkMode: ecs.NetworkMode.Bridge,
        });

        const container = taskDefinition.addContainer("Container", {
          image: ecs.ContainerImage.fromDockerHub("/aws/aws-example-app"),
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
      image: ecs.ContainerImage.fromDockerHub('test'),
      memoryLimitMiB: 1024,
      environment: {
        TEST_ENVIRONMENT_VARIABLE: "test environment variable value"
      }
    });

    // THEN
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

  'can add AWS logging to container definition'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromDockerHub('test'),
      memoryLimitMiB: 1024,
      logging: new ecs.AwsLogDriver(stack, 'Logging', { streamPrefix: 'prefix' })
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          LogConfiguration: {
            LogDriver: "awslogs",
            Options: {
              "awslogs-group": { Ref: "LoggingLogGroupC6B8E20B" },
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
            Resource: { "Fn::GetAtt": ["LoggingLogGroupC6B8E20B", "Arn"] }
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
      image: ecs.ContainerImage.fromDockerHub('test'),
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

  'can specify Health Check values'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
    const hcCommand = "curl localhost:8000";

    // WHEN
    taskDefinition.addContainer('cont', {
      image: ecs.ContainerImage.fromDockerHub('test'),
      memoryLimitMiB: 1024,
      healthCheck: {
        command: [hcCommand],
        intervalSeconds: 20,
        retries: 5,
        startPeriod: 10
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

  // render extra hosts test
};
