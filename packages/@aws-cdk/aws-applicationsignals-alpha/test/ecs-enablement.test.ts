
import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as appsignals from '../lib';

describe('application signals integration', () => {
  test('should create container dependencies with different instrumentation versions', () => {
    class TestCase {
      instrumentationVersion: appsignals.InstrumentationVersion;
      // container path is different in each injector
      containerPath: string;
      windows: boolean;

      constructor(
        instrumentationVersion: appsignals.InstrumentationVersion,
        containerPath: string,
        windows?: boolean) {
        this.instrumentationVersion = instrumentationVersion;
        this.containerPath = containerPath;
        this.windows = windows || false;
      }

      get runtimePlatform(): ecs.RuntimePlatform {
        return this.windows? {
          operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2022_CORE,
        }: {
        };
      }

      get expectedCWAgentImage(): string {
        return this.windows?appsignals.CloudWatchAgentVersion.CLOUDWATCH_AGENT_IMAGE_WIN2022:appsignals.CloudWatchAgentVersion.CLOUDWATCH_AGENT_IMAGE;
      }
    }

    for (const test of [new TestCase(appsignals.JavaInstrumentationVersion.V1_32_6, '/otel-auto-instrumentation'),
      new TestCase(appsignals.PythonInstrumentationVersion.V0_8_0, '/otel-auto-instrumentation-python'),
      new TestCase(appsignals.DotnetInstrumentationVersion.V1_6_0, '/otel-auto-instrumentation-dotnet'),
      new TestCase(appsignals.DotnetInstrumentationVersion.V1_6_0_WINDOWS2022, 'C:\\otel-auto-instrumentation-dotnet', true),
      new TestCase(appsignals.NodeInstrumentationVersion.V0_5_0, '/otel-auto-instrumentation-nodejs')]) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const fargateTaskDefinition = new ecs.FargateTaskDefinition(stack, 'TestTaskDefinition', {
        cpu: 2048,
        memoryLimitMiB: 4096,
        runtimePlatform: test.runtimePlatform,
      });
      fargateTaskDefinition.addContainer('app', {
        image: ecs.ContainerImage.fromRegistry('docker/cdk-test'),
      });
      new appsignals.ApplicationSignalsIntegration(stack, 'TestIntegration', {
        taskDefinition: fargateTaskDefinition,
        instrumentation: {
          sdkVersion: test.instrumentationVersion,
        },
        cloudWatchAgentSidecar: {
          containerName: 'cloudwatch-agent',
          operatingSystemFamily: test.runtimePlatform.operatingSystemFamily,
          memoryReservationMiB: 50,
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Essential: true,
            Image: 'docker/cdk-test',
            MountPoints: [
              {
                ContainerPath: test.containerPath,
                ReadOnly: false,
                SourceVolume: 'opentelemetry-auto-instrumentation',
              },
            ],
            Name: 'app',
            DependsOn: [
              {
                Condition: 'SUCCESS',
                ContainerName: 'adot-init',
              },
              {
                Condition: 'START',
                ContainerName: 'cloudwatch-agent',
              },
            ],
          },
          {
            Name: 'adot-init',
            Image: test.instrumentationVersion.imageURI(),
            Cpu: 0,
            Memory: test.instrumentationVersion.memoryLimitMiB(),
          },
          {
            MemoryReservation: 50,
            Name: 'cloudwatch-agent',
            Image: test.expectedCWAgentImage,
            User: '0:1338',
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
        Volumes: [
          {
            Name: 'opentelemetry-auto-instrumentation',
          },
        ],
      });
    }
  });

  test('should fail if fargate task definition does not have a sidecar', () => {
    expect(() => {
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
      new appsignals.ApplicationSignalsIntegration(stack, 'TestFailure', {
        taskDefinition: fargateTaskDefinition,
        instrumentation: {
          sdkVersion: appsignals.JavaInstrumentationVersion.V1_32_6,
        },
        serviceName: 'overriden-demo',
      });
    }).toThrow(/Fargate tasks must deploy CloudWatch Agent as a sidecar container/);
  });

  test('should no cwagent container with external cwagent endpoint', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const ec2TaskDefinition = new ecs.Ec2TaskDefinition(stack, 'TestTaskDefinition', {
      networkMode: ecs.NetworkMode.HOST,
    });
    ec2TaskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('docker/cdk-test'),
      cpu: 0,
      memoryLimitMiB: 512,
    });

    new appsignals.ApplicationSignalsIntegration(stack, 'TestIntegration', {
      taskDefinition: ec2TaskDefinition,
      instrumentation: {
        sdkVersion: appsignals.PythonInstrumentationVersion.V0_8_0,
      },
      serviceName: 'overriden-demo',
      overrideEnvironments: [
        {
          name: 'OTEL_RESOURCE_ATTRIBUTES',
          value: 'service.name=demo',
        },
        {
          name: 'OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT',
          value: 'http://cwagent.local:4316/v1/metrics',
        }, {
          name: 'OTEL_EXPORTER_OTLP_TRACES_ENDPOINT',
          value: 'http://cwagent.local:4316/v1/traces',
        }, {
          name: 'OTEL_TRACES_SAMPLER_ARG',
          value: 'endpoint=http://cwagent.local:2000',
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Essential: true,
          Image: 'docker/cdk-test',
          Name: 'app',
          DependsOn: [
            {
              Condition: 'SUCCESS',
              ContainerName: 'adot-init',
            },
          ],
        },
        {
          Name: 'adot-init',
        },
      ],
      Family: 'TestTaskDefinition',
      NetworkMode: 'host',
      RequiresCompatibilities: [
        'EC2',
      ],
      TaskRoleArn: {
        'Fn::GetAtt': [
          'TestTaskDefinitionTaskRole38EA0D26',
          'Arn',
        ],
      },
      Volumes: [
        {
          Name: 'opentelemetry-auto-instrumentation',
        },
      ],
    });
  });
});
