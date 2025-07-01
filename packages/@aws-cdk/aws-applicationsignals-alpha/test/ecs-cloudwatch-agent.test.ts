
import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { CloudWatchAgentIntegration } from '../lib';

describe('application signals cloudwatch agent integration', () => {
  test('should create a sidecar container with default config', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const fargateTaskDefinition = new ecs.FargateTaskDefinition(stack, 'TestTaskDefinition', {
      cpu: 256,
      memoryLimitMiB: 512,
    });
    fargateTaskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('docker/cdk-test'),
    });
    new CloudWatchAgentIntegration(stack, 'AddCloudWatchAgent', {
      containerName: 'cloudwatch-agent',
      taskDefinition: fargateTaskDefinition,
      memoryReservationMiB: 50,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Essential: true,
          Image: 'docker/cdk-test',
        },
        {
          Environment: [
            {
              Name: 'CW_CONFIG_CONTENT',
              Value: '{"logs":{"metrics_collected":{"application_signals":{"enabled":true}}},"traces":{"traces_collected":{"application_signals":{"enabled":true}}}}',
            },
          ],
          Essential: true,
          Image: 'public.ecr.aws/cloudwatch-agent/cloudwatch-agent:latest',
          MemoryReservation: 50,
          Name: 'cloudwatch-agent',
          User: '0:1338',
        },
      ],
      Cpu: '256',
      Family: 'TestTaskDefinition',
      Memory: '512',
      NetworkMode: 'awsvpc',
      RequiresCompatibilities: [
        'FARGATE',
      ],
      TaskRoleArn: {
        'Fn::GetAtt': [
          'TestTaskDefinitionTaskRole38EA0D26',
          'Arn',
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/CloudWatchAgentServerPolicy',
            ],
          ],
        },
      ],
    });
  });

  test('should create a sidecar container with customized config', () => {
    // GIVEN
    const stack = new Stack();
    const cwagentConfig = {
      logs: {
        agent: {
          debug: true,
        },
        metrics_collected: {
          application_signals: {
            enabled: true,
          },
        },
      },
      traces: {
        traces_collected: {
          application_signals: {
            enabled: true,
          },
        },
      },
    };

    // WHEN
    const fargateTaskDefinition = new ecs.FargateTaskDefinition(stack, 'TestTaskDefinition', {
      cpu: 256,
      memoryLimitMiB: 512,
    });
    fargateTaskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('docker/cdk-test'),
    });
    new CloudWatchAgentIntegration(stack, 'AddCloudWatchAgent', {
      containerName: 'cloudwatch-agent',
      essential: false,
      agentConfig: JSON.stringify(cwagentConfig),
      enableLogging: true,
      cpu: 64,
      taskDefinition: fargateTaskDefinition,
      memoryReservationMiB: 50,
      memoryLimitMiB: 128,
      portMappings: [{
        name: 'cwagent-4316',
        containerPort: 4316,
        hostPort: 4316,
      }],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Essential: true,
          Image: 'docker/cdk-test',
        },
        {
          Environment: [
            {
              Name: 'CW_CONFIG_CONTENT',
              Value: JSON.stringify(cwagentConfig),
            },
          ],
          Essential: true,
          Image: 'public.ecr.aws/cloudwatch-agent/cloudwatch-agent:latest',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: 'TestTaskDefinitioncloudwatchagentLogGroupE9E41850',
              },
              'awslogs-stream-prefix': 'cloudwatch-agent',
              'awslogs-region': {
                Ref: 'AWS::Region',
              },
            },
          },
          Cpu: 64,
          MemoryReservation: 50,
          Memory: 128,
          Name: 'cloudwatch-agent',
          User: '0:1338',
          PortMappings: [{
            Name: 'cwagent-4316',
            ContainerPort: 4316,
            HostPort: 4316,
          }],
        },
      ],
      Cpu: '256',
      Family: 'TestTaskDefinition',
      Memory: '512',
      NetworkMode: 'awsvpc',
      RequiresCompatibilities: [
        'FARGATE',
      ],
      TaskRoleArn: {
        'Fn::GetAtt': [
          'TestTaskDefinitionTaskRole38EA0D26',
          'Arn',
        ],
      },
    });
  });

  test('should create a sidecar container on windows', () => {
    class TestCase {
      osFamily: ecs.OperatingSystemFamily;
      expectedImage: string;

      constructor(
        osFamily: ecs.OperatingSystemFamily,
        expectedImage: string) {
        this.osFamily = osFamily;
        this.expectedImage = expectedImage;
      }
    }
    for (const test of [new TestCase(ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE, 'public.ecr.aws/cloudwatch-agent/cloudwatch-agent:latest-windowsservercore2019' ),
      new TestCase(ecs.OperatingSystemFamily.WINDOWS_SERVER_2022_FULL, 'public.ecr.aws/cloudwatch-agent/cloudwatch-agent:latest-windowsservercore2022' )]) {
    // GIVEN
      const stack = new Stack();

      // WHEN
      const fargateTaskDefinition = new ecs.FargateTaskDefinition(stack, 'TestTaskDefinition', {
        runtimePlatform: {
          operatingSystemFamily: test.osFamily,
        },
        cpu: 2048,
        memoryLimitMiB: 4096,
      });
      fargateTaskDefinition.addContainer('app', {
        image: ecs.ContainerImage.fromRegistry('docker/cdk-test'),
      });
      new CloudWatchAgentIntegration(stack, 'AddCloudWatchAgent', {
        containerName: 'cloudwatch-agent',
        taskDefinition: fargateTaskDefinition,
        cpu: 1024,
        memoryLimitMiB: 2048,
        operatingSystemFamily: test.osFamily,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Essential: true,
            Image: 'docker/cdk-test',
          },
          {
            Environment: [
              {
                Name: 'CW_CONFIG_CONTENT',
                Value: '{"logs":{"metrics_collected":{"application_signals":{"enabled":true}}},"traces":{"traces_collected":{"application_signals":{"enabled":true}}}}',
              },
            ],
            Essential: true,
            Image: test.expectedImage,
            Name: 'cloudwatch-agent',
            User: '0:1338',
            Cpu: 1024,
            Memory: 2048,
          },
        ],
        Cpu: '2048',
        Family: 'TestTaskDefinition',
        Memory: '4096',
        NetworkMode: 'awsvpc',
        RequiresCompatibilities: [
          'FARGATE',
        ],
        TaskRoleArn: {
          'Fn::GetAtt': [
            'TestTaskDefinitionTaskRole38EA0D26',
            'Arn',
          ],
        },
      });
    }
  });
});
