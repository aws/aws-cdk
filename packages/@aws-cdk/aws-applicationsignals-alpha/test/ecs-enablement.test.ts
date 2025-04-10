
import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { ApplicationSignalsIntegration, DotnetInstrumentationVersion, PythonInstrumentationVersion, JavaInstrumentationVersion, NodeInstrumentationVersion } from '../lib';

describe('application signals integration', () => {
  test('should create basic application signals configurations with java', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const fargateTaskDefinition = new ecs.FargateTaskDefinition(stack, 'TestTaskDefinition', {
      cpu: 256,
      memoryLimitMiB: 512,
    });
    fargateTaskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
    });
    new ApplicationSignalsIntegration(stack, 'TestIntegration', {
      taskDefinition: fargateTaskDefinition,
      instrumentation: {
        sdkVersion: JavaInstrumentationVersion.V1_32_6,
      },
      cloudWatchAgentSidecar: {
        containerName: 'cloudwatch-agent',
        enableLogging: true,
        memoryReservationMiB: 50,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: 'OTEL_LOGS_EXPORTER',
              Value: 'none',
            },
            {
              Name: 'OTEL_METRICS_EXPORTER',
              Value: 'none',
            },
            {
              Name: 'OTEL_EXPORTER_OTLP_PROTOCOL',
              Value: 'http/protobuf',
            },
            {
              Name: 'OTEL_AWS_APPLICATION_SIGNALS_ENABLED',
              Value: 'true',
            },
            {
              Name: 'OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT',
              Value: 'http://localhost:4316/v1/metrics',
            },
            {
              Name: 'OTEL_EXPORTER_OTLP_TRACES_ENDPOINT',
              Value: 'http://localhost:4316/v1/traces',
            },
            {
              Name: 'OTEL_TRACES_SAMPLER',
              Value: 'xray',
            },
            {
              Name: 'OTEL_TRACES_SAMPLER_ARG',
              Value: 'endpoint=http://localhost:2000',
            },
            {
              Name: 'OTEL_PROPAGATORS',
              Value: 'tracecontext,baggage,b3,xray',
            },
            {
              Name: 'JAVA_TOOL_OPTIONS',
              Value: ' -javaagent:/otel-auto-instrumentation/javaagent.jar',
            },
            {
              Name: 'OTEL_RESOURCE_ATTRIBUTES',
              Value: 'service.name=TestTaskDefinition',
            },
          ],
          Essential: true,
          Image: 'nathanpeck/name',
          MountPoints: [
            {
              ContainerPath: '/otel-auto-instrumentation',
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
          Command: [
            'cp',
            '/javaagent.jar',
            '/otel-auto-instrumentation/javaagent.jar',
          ],
          Essential: false,
          Image: 'public.ecr.aws/aws-observability/adot-autoinstrumentation-java:v1.32.6',
          MountPoints: [
            {
              ContainerPath: '/otel-auto-instrumentation',
              ReadOnly: false,
              SourceVolume: 'opentelemetry-auto-instrumentation',
            },
          ],
          Name: 'adot-init',
          Cpu: 0,
          Memory: 64,
        },
        {
          Environment: [
            {
              Name: 'CW_CONFIG_CONTENT',
              Value: '{"logs":{"metrics_collected":{"application_signals":{"enabled":true}}},"traces":{"traces_collected":{"application_signals":{"enabled":true}}}}',
            },
          ],
          Essential: true,
          Image: 'amazon/cloudwatch-agent:latest',
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
          MemoryReservation: 50,
          Name: 'cloudwatch-agent',
          User: '0:1338',
        },
      ],
      Cpu: '256',
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          'TestTaskDefinitionExecutionRole7F5683B5',
          'Arn',
        ],
      },
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
      Volumes: [
        {
          Name: 'opentelemetry-auto-instrumentation',
        },
      ],
    });
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
        image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
      });
      new ApplicationSignalsIntegration(stack, 'TestFailure', {
        taskDefinition: fargateTaskDefinition,
        instrumentation: {
          sdkVersion: JavaInstrumentationVersion.V1_32_6,
        },
        serviceName: 'demo',
      });
    }).toThrow(/Fargate tasks must deploy CloudWatch Agent as a sidecar container/);
  });

  test('should create application signals configurations with python and external cwagent', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const ec2TaskDefinition = new ecs.Ec2TaskDefinition(stack, 'TestTaskDefinition', {
      networkMode: ecs.NetworkMode.HOST,
    });
    const defaultContainer = ec2TaskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
      cpu: 0,
      memoryLimitMiB: 512,
    });
    defaultContainer.addEnvironment('PYTHONPATH', '/mysite');

    new ApplicationSignalsIntegration(stack, 'TestIntegration', {
      taskDefinition: ec2TaskDefinition,
      instrumentation: {
        sdkVersion: PythonInstrumentationVersion.V0_8_0,
      },
      serviceName: 'demo',
      overrideEnvironments: [
        {
          name: 'OTEL_RESOURCE_ATTRIBUTES',
          value: 'service.name=overriden-demo',
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
          Environment: [
            {
              Name: 'PYTHONPATH',
              Value: '/otel-auto-instrumentation-python/opentelemetry/instrumentation/auto_instrumentation:/mysite:/otel-auto-instrumentation-python',
            },
            {
              Name: 'OTEL_LOGS_EXPORTER',
              Value: 'none',
            },
            {
              Name: 'OTEL_METRICS_EXPORTER',
              Value: 'none',
            },
            {
              Name: 'OTEL_EXPORTER_OTLP_PROTOCOL',
              Value: 'http/protobuf',
            },
            {
              Name: 'OTEL_AWS_APPLICATION_SIGNALS_ENABLED',
              Value: 'true',
            },
            {
              Name: 'OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT',
              Value: 'http://cwagent.local:4316/v1/metrics',
            },
            {
              Name: 'OTEL_EXPORTER_OTLP_TRACES_ENDPOINT',
              Value: 'http://cwagent.local:4316/v1/traces',
            },
            {
              Name: 'OTEL_TRACES_SAMPLER',
              Value: 'xray',
            },
            {
              Name: 'OTEL_TRACES_SAMPLER_ARG',
              Value: 'endpoint=http://cwagent.local:2000',
            },
            {
              Name: 'OTEL_PROPAGATORS',
              Value: 'tracecontext,baggage,b3,xray',
            },
            {
              Name: 'OTEL_PYTHON_DISTRO',
              Value: 'aws_distro',
            },
            {
              Name: 'OTEL_PYTHON_CONFIGURATOR',
              Value: 'aws_configurator',
            },
            {
              Name: 'OTEL_RESOURCE_ATTRIBUTES',
              Value: 'service.name=overriden-demo',
            },
          ],
          Essential: true,
          Image: 'nathanpeck/name',
          MountPoints: [
            {
              ContainerPath: '/otel-auto-instrumentation-python',
              ReadOnly: false,
              SourceVolume: 'opentelemetry-auto-instrumentation',
            },
          ],
          Cpu: 0,
          Memory: 512,
          Name: 'app',
          DependsOn: [
            {
              Condition: 'SUCCESS',
              ContainerName: 'adot-init',
            },
          ],
        },
        {
          Command: [
            'cp',
            '-a',
            '/autoinstrumentation/.',
            '/otel-auto-instrumentation-python',
          ],
          Essential: false,
          Image: 'public.ecr.aws/aws-observability/adot-autoinstrumentation-python:v0.8.0',
          MountPoints: [
            {
              ContainerPath: '/otel-auto-instrumentation-python',
              ReadOnly: false,
              SourceVolume: 'opentelemetry-auto-instrumentation',
            },
          ],
          Name: 'adot-init',
          Cpu: 0,
          Memory: 32,
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

  test('should create application signals configurations with dotnet on linux', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const ec2TaskDefinition = new ecs.Ec2TaskDefinition(stack, 'TestTaskDefinition', {
      networkMode: ecs.NetworkMode.HOST,
    });
    ec2TaskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
      cpu: 0,
      memoryLimitMiB: 512,
    });

    new ApplicationSignalsIntegration(stack, 'TestIntegration', {
      taskDefinition: ec2TaskDefinition,
      instrumentation: {
        sdkVersion: DotnetInstrumentationVersion.V1_6_0,
      },
      serviceName: 'demo',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: 'OTEL_LOGS_EXPORTER',
              Value: 'none',
            },
            {
              Name: 'OTEL_METRICS_EXPORTER',
              Value: 'none',
            },
            {
              Name: 'OTEL_EXPORTER_OTLP_PROTOCOL',
              Value: 'http/protobuf',
            },
            {
              Name: 'OTEL_AWS_APPLICATION_SIGNALS_ENABLED',
              Value: 'true',
            },
            {
              Name: 'OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT',
              Value: 'http://localhost:4316/v1/metrics',
            },
            {
              Name: 'OTEL_EXPORTER_OTLP_TRACES_ENDPOINT',
              Value: 'http://localhost:4316/v1/traces',
            },
            {
              Name: 'OTEL_TRACES_SAMPLER',
              Value: 'xray',
            },
            {
              Name: 'OTEL_TRACES_SAMPLER_ARG',
              Value: 'endpoint=http://localhost:2000',
            },
            {
              Name: 'OTEL_PROPAGATORS',
              Value: 'tracecontext,baggage,b3,xray',
            },
            {
              Name: 'OTEL_DOTNET_DISTRO',
              Value: 'aws_distro',
            },
            {
              Name: 'OTEL_DOTNET_CONFIGURATOR',
              Value: 'aws_configurator',
            },
            {
              Name: 'OTEL_DOTNET_AUTO_PLUGINS',
              Value: 'AWS.Distro.OpenTelemetry.AutoInstrumentation.Plugin, AWS.Distro.OpenTelemetry.AutoInstrumentation',
            },
            {
              Name: 'CORECLR_PROFILER_PATH',
              Value: '/otel-auto-instrumentation-dotnet/linux-x64/OpenTelemetry.AutoInstrumentation.Native.so',
            },
            {
              Name: 'CORECLR_ENABLE_PROFILING',
              Value: '1',
            },
            {
              Name: 'CORECLR_PROFILER',
              Value: '{918728DD-259F-4A6A-AC2B-B85E1B658318}',
            },
            {
              Name: 'DOTNET_STARTUP_HOOKS',
              Value: '/otel-auto-instrumentation-dotnet/net/OpenTelemetry.AutoInstrumentation.StartupHook.dll',
            },
            {
              Name: 'DOTNET_ADDITIONAL_DEPS',
              Value: '/otel-auto-instrumentation-dotnet/AdditionalDeps',
            },
            {
              Name: 'OTEL_DOTNET_AUTO_HOME',
              Value: '/otel-auto-instrumentation-dotnet',
            },
            {
              Name: 'DOTNET_SHARED_STORE',
              Value: '/otel-auto-instrumentation-dotnet/store',
            },
            {
              Name: 'OTEL_RESOURCE_ATTRIBUTES',
              Value: 'service.name=demo',
            },
          ],
          Essential: true,
          Image: 'nathanpeck/name',
          MountPoints: [
            {
              ContainerPath: '/otel-auto-instrumentation-dotnet',
              ReadOnly: false,
              SourceVolume: 'opentelemetry-auto-instrumentation',
            },
          ],
          Cpu: 0,
          Memory: 512,
          Name: 'app',
          DependsOn: [
            {
              Condition: 'SUCCESS',
              ContainerName: 'adot-init',
            },
          ],
        },
        {
          Command: [
            'cp',
            '-a',
            '/autoinstrumentation/.',
            '/otel-auto-instrumentation-dotnet',
          ],
          Essential: false,
          Image: 'public.ecr.aws/aws-observability/adot-autoinstrumentation-dotnet:v1.6.0',
          MountPoints: [
            {
              ContainerPath: '/otel-auto-instrumentation-dotnet',
              ReadOnly: false,
              SourceVolume: 'opentelemetry-auto-instrumentation',
            },
          ],
          Name: 'adot-init',
          Cpu: 0,
          Memory: 128,
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

  test('should create application signals configurations with dotnet on windows2019', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const ec2TaskDefinition = new ecs.Ec2TaskDefinition(stack, 'TestTaskDefinition', {
      networkMode: ecs.NetworkMode.HOST,
    });
    ec2TaskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
      cpu: 0,
      memoryLimitMiB: 512,
    });

    new ApplicationSignalsIntegration(stack, 'TestIntegration', {
      taskDefinition: ec2TaskDefinition,
      instrumentation: {
        sdkVersion: DotnetInstrumentationVersion.V1_6_0_WINDOWS2019,
        runtimePlatform: {
          operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE,
        },
      },
      serviceName: 'demo',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: 'OTEL_LOGS_EXPORTER',
              Value: 'none',
            },
            {
              Name: 'OTEL_METRICS_EXPORTER',
              Value: 'none',
            },
            {
              Name: 'OTEL_EXPORTER_OTLP_PROTOCOL',
              Value: 'http/protobuf',
            },
            {
              Name: 'OTEL_AWS_APPLICATION_SIGNALS_ENABLED',
              Value: 'true',
            },
            {
              Name: 'OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT',
              Value: 'http://localhost:4316/v1/metrics',
            },
            {
              Name: 'OTEL_EXPORTER_OTLP_TRACES_ENDPOINT',
              Value: 'http://localhost:4316/v1/traces',
            },
            {
              Name: 'OTEL_TRACES_SAMPLER',
              Value: 'xray',
            },
            {
              Name: 'OTEL_TRACES_SAMPLER_ARG',
              Value: 'endpoint=http://localhost:2000',
            },
            {
              Name: 'OTEL_PROPAGATORS',
              Value: 'tracecontext,baggage,b3,xray',
            },
            {
              Name: 'OTEL_DOTNET_DISTRO',
              Value: 'aws_distro',
            },
            {
              Name: 'OTEL_DOTNET_CONFIGURATOR',
              Value: 'aws_configurator',
            },
            {
              Name: 'OTEL_DOTNET_AUTO_PLUGINS',
              Value: 'AWS.Distro.OpenTelemetry.AutoInstrumentation.Plugin, AWS.Distro.OpenTelemetry.AutoInstrumentation',
            },
            {
              Name: 'CORECLR_ENABLE_PROFILING',
              Value: '1',
            },
            {
              Name: 'CORECLR_PROFILER',
              Value: '{918728DD-259F-4A6A-AC2B-B85E1B658318}',
            },
            {
              Name: 'CORECLR_PROFILER_PATH',
              Value: 'C:\\otel-auto-instrumentation-dotnet\\win-x64\\OpenTelemetry.AutoInstrumentation.Native.dll',
            },
            {
              Name: 'DOTNET_STARTUP_HOOKS',
              Value: 'C:\\otel-auto-instrumentation-dotnet\\net\\OpenTelemetry.AutoInstrumentation.StartupHook.dll',
            },
            {
              Name: 'DOTNET_ADDITIONAL_DEPS',
              Value: 'C:\\otel-auto-instrumentation-dotnet\\AdditionalDeps',
            },
            {
              Name: 'OTEL_DOTNET_AUTO_HOME',
              Value: 'C:\\otel-auto-instrumentation-dotnet',
            },
            {
              Name: 'DOTNET_SHARED_STORE',
              Value: 'C:\\otel-auto-instrumentation-dotnet\\store',
            },
            {
              Name: 'OTEL_RESOURCE_ATTRIBUTES',
              Value: 'service.name=demo',
            },
          ],
          Essential: true,
          Image: 'nathanpeck/name',
          MountPoints: [
            {
              ContainerPath: 'C:\\otel-auto-instrumentation-dotnet',
              ReadOnly: false,
              SourceVolume: 'opentelemetry-auto-instrumentation',
            },
          ],
          Cpu: 0,
          Memory: 512,
          Name: 'app',
          DependsOn: [
            {
              Condition: 'SUCCESS',
              ContainerName: 'adot-init',
            },
          ],
        },
        {
          Command: [
            'CMD',
            '/c',
            'xcopy',
            '/e',
            'C:\\autoinstrumentation\\*',
            'C:\\otel-auto-instrumentation-dotnet',
            '&&',
            'icacls',
            'C:\\otel-auto-instrumentation-dotnet',
            '/grant',
            '*S-1-1-0:R',
            '/T',
          ],
          Essential: false,
          Image: 'public.ecr.aws/aws-observability/adot-autoinstrumentation-dotnet:v1.6.0-windows2019',
          MountPoints: [
            {
              ContainerPath: 'C:\\otel-auto-instrumentation-dotnet',
              ReadOnly: false,
              SourceVolume: 'opentelemetry-auto-instrumentation',
            },
          ],
          Name: 'adot-init',
          Cpu: 0,
          Memory: 128,
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

  test('should create application signals configurations with dotnet on windows2022', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const ec2TaskDefinition = new ecs.Ec2TaskDefinition(stack, 'TestTaskDefinition', {
      networkMode: ecs.NetworkMode.HOST,
    });
    ec2TaskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
      cpu: 0,
      memoryLimitMiB: 512,
    });

    new ApplicationSignalsIntegration(stack, 'TestIntegration', {
      taskDefinition: ec2TaskDefinition,
      instrumentation: {
        sdkVersion: DotnetInstrumentationVersion.V1_6_0_WINDOWS2022,
        runtimePlatform: {
          operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2022_CORE,
        },
      },
      serviceName: 'demo',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: 'OTEL_LOGS_EXPORTER',
              Value: 'none',
            },
            {
              Name: 'OTEL_METRICS_EXPORTER',
              Value: 'none',
            },
            {
              Name: 'OTEL_EXPORTER_OTLP_PROTOCOL',
              Value: 'http/protobuf',
            },
            {
              Name: 'OTEL_AWS_APPLICATION_SIGNALS_ENABLED',
              Value: 'true',
            },
            {
              Name: 'OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT',
              Value: 'http://localhost:4316/v1/metrics',
            },
            {
              Name: 'OTEL_EXPORTER_OTLP_TRACES_ENDPOINT',
              Value: 'http://localhost:4316/v1/traces',
            },
            {
              Name: 'OTEL_TRACES_SAMPLER',
              Value: 'xray',
            },
            {
              Name: 'OTEL_TRACES_SAMPLER_ARG',
              Value: 'endpoint=http://localhost:2000',
            },
            {
              Name: 'OTEL_PROPAGATORS',
              Value: 'tracecontext,baggage,b3,xray',
            },
            {
              Name: 'OTEL_DOTNET_DISTRO',
              Value: 'aws_distro',
            },
            {
              Name: 'OTEL_DOTNET_CONFIGURATOR',
              Value: 'aws_configurator',
            },
            {
              Name: 'OTEL_DOTNET_AUTO_PLUGINS',
              Value: 'AWS.Distro.OpenTelemetry.AutoInstrumentation.Plugin, AWS.Distro.OpenTelemetry.AutoInstrumentation',
            },
            {
              Name: 'CORECLR_ENABLE_PROFILING',
              Value: '1',
            },
            {
              Name: 'CORECLR_PROFILER',
              Value: '{918728DD-259F-4A6A-AC2B-B85E1B658318}',
            },
            {
              Name: 'CORECLR_PROFILER_PATH',
              Value: 'C:\\otel-auto-instrumentation-dotnet\\win-x64\\OpenTelemetry.AutoInstrumentation.Native.dll',
            },
            {
              Name: 'DOTNET_STARTUP_HOOKS',
              Value: 'C:\\otel-auto-instrumentation-dotnet\\net\\OpenTelemetry.AutoInstrumentation.StartupHook.dll',
            },
            {
              Name: 'DOTNET_ADDITIONAL_DEPS',
              Value: 'C:\\otel-auto-instrumentation-dotnet\\AdditionalDeps',
            },
            {
              Name: 'OTEL_DOTNET_AUTO_HOME',
              Value: 'C:\\otel-auto-instrumentation-dotnet',
            },
            {
              Name: 'DOTNET_SHARED_STORE',
              Value: 'C:\\otel-auto-instrumentation-dotnet\\store',
            },
            {
              Name: 'OTEL_RESOURCE_ATTRIBUTES',
              Value: 'service.name=demo',
            },
          ],
          Essential: true,
          Image: 'nathanpeck/name',
          MountPoints: [
            {
              ContainerPath: 'C:\\otel-auto-instrumentation-dotnet',
              ReadOnly: false,
              SourceVolume: 'opentelemetry-auto-instrumentation',
            },
          ],
          Cpu: 0,
          Memory: 512,
          Name: 'app',
          DependsOn: [
            {
              Condition: 'SUCCESS',
              ContainerName: 'adot-init',
            },
          ],
        },
        {
          Command: [
            'CMD',
            '/c',
            'xcopy',
            '/e',
            'C:\\autoinstrumentation\\*',
            'C:\\otel-auto-instrumentation-dotnet',
            '&&',
            'icacls',
            'C:\\otel-auto-instrumentation-dotnet',
            '/grant',
            '*S-1-1-0:R',
            '/T',
          ],
          Essential: false,
          Image: 'public.ecr.aws/aws-observability/adot-autoinstrumentation-dotnet:v1.6.0-windows2022',
          MountPoints: [
            {
              ContainerPath: 'C:\\otel-auto-instrumentation-dotnet',
              ReadOnly: false,
              SourceVolume: 'opentelemetry-auto-instrumentation',
            },
          ],
          Name: 'adot-init',
          Cpu: 0,
          Memory: 128,
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

  test('should create application signals configurations with node', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const ec2TaskDefinition = new ecs.Ec2TaskDefinition(stack, 'TestTaskDefinition', {
      networkMode: ecs.NetworkMode.HOST,
    });
    ec2TaskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
      cpu: 0,
      memoryLimitMiB: 512,
    });

    new ApplicationSignalsIntegration(stack, 'TestIntegration', {
      taskDefinition: ec2TaskDefinition,
      instrumentation: {
        sdkVersion: NodeInstrumentationVersion.V0_5_0,

      },
      serviceName: 'demo',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: 'OTEL_LOGS_EXPORTER',
              Value: 'none',
            },
            {
              Name: 'OTEL_METRICS_EXPORTER',
              Value: 'none',
            },
            {
              Name: 'OTEL_EXPORTER_OTLP_PROTOCOL',
              Value: 'http/protobuf',
            },
            {
              Name: 'OTEL_AWS_APPLICATION_SIGNALS_ENABLED',
              Value: 'true',
            },
            {
              Name: 'OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT',
              Value: 'http://localhost:4316/v1/metrics',
            },
            {
              Name: 'OTEL_EXPORTER_OTLP_TRACES_ENDPOINT',
              Value: 'http://localhost:4316/v1/traces',
            },
            {
              Name: 'OTEL_TRACES_SAMPLER',
              Value: 'xray',
            },
            {
              Name: 'OTEL_TRACES_SAMPLER_ARG',
              Value: 'endpoint=http://localhost:2000',
            },
            {
              Name: 'OTEL_PROPAGATORS',
              Value: 'tracecontext,baggage,b3,xray',
            },
            {
              Name: 'NODE_OPTIONS',
              Value: ' --require /otel-auto-instrumentation-nodejs/autoinstrumentation.js',
            },
            {
              Name: 'OTEL_RESOURCE_ATTRIBUTES',
              Value: 'service.name=demo',
            },
          ],
          Essential: true,
          Image: 'nathanpeck/name',
          MountPoints: [
            {
              ContainerPath: '/otel-auto-instrumentation-nodejs',
              ReadOnly: false,
              SourceVolume: 'opentelemetry-auto-instrumentation',
            },
          ],
          Cpu: 0,
          Memory: 512,
          Name: 'app',
          DependsOn: [
            {
              Condition: 'SUCCESS',
              ContainerName: 'adot-init',
            },
          ],
        },
        {
          Command: [
            'cp',
            '-a',
            '/autoinstrumentation/.',
            '/otel-auto-instrumentation-nodejs',
          ],
          Essential: false,
          Image: 'public.ecr.aws/aws-observability/adot-autoinstrumentation-node:v0.5.0',
          MountPoints: [
            {
              ContainerPath: '/otel-auto-instrumentation-nodejs',
              ReadOnly: false,
              SourceVolume: 'opentelemetry-auto-instrumentation',
            },
          ],
          Name: 'adot-init',
          Cpu: 0,
          Memory: 128,
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

  test('should create application signals configurations with custom node options', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const ec2TaskDefinition = new ecs.Ec2TaskDefinition(stack, 'TestTaskDefinition', {
      networkMode: ecs.NetworkMode.HOST,
    });
    ec2TaskDefinition.addContainer('app', {
      image: ecs.ContainerImage.fromRegistry('nathanpeck/name'),
      cpu: 0,
      memoryLimitMiB: 512,
      environment: {
        NODE_OPTIONS: '--max-old-space-size=4096',
      },
    });

    new ApplicationSignalsIntegration(stack, 'TestIntegration', {
      taskDefinition: ec2TaskDefinition,
      instrumentation: {
        sdkVersion: NodeInstrumentationVersion.V0_5_0,

      },
      serviceName: 'demo',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: [
            {
              Name: 'NODE_OPTIONS',
              Value: '--max-old-space-size=4096 --require /otel-auto-instrumentation-nodejs/autoinstrumentation.js',
            },
            {
              Name: 'OTEL_LOGS_EXPORTER',
              Value: 'none',
            },
            {
              Name: 'OTEL_METRICS_EXPORTER',
              Value: 'none',
            },
            {
              Name: 'OTEL_EXPORTER_OTLP_PROTOCOL',
              Value: 'http/protobuf',
            },
            {
              Name: 'OTEL_AWS_APPLICATION_SIGNALS_ENABLED',
              Value: 'true',
            },
            {
              Name: 'OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT',
              Value: 'http://localhost:4316/v1/metrics',
            },
            {
              Name: 'OTEL_EXPORTER_OTLP_TRACES_ENDPOINT',
              Value: 'http://localhost:4316/v1/traces',
            },
            {
              Name: 'OTEL_TRACES_SAMPLER',
              Value: 'xray',
            },
            {
              Name: 'OTEL_TRACES_SAMPLER_ARG',
              Value: 'endpoint=http://localhost:2000',
            },
            {
              Name: 'OTEL_PROPAGATORS',
              Value: 'tracecontext,baggage,b3,xray',
            },
            {
              Name: 'OTEL_RESOURCE_ATTRIBUTES',
              Value: 'service.name=demo',
            },
          ],
          Essential: true,
          Image: 'nathanpeck/name',
          MountPoints: [
            {
              ContainerPath: '/otel-auto-instrumentation-nodejs',
              ReadOnly: false,
              SourceVolume: 'opentelemetry-auto-instrumentation',
            },
          ],
          Cpu: 0,
          Memory: 512,
          Name: 'app',
          DependsOn: [
            {
              Condition: 'SUCCESS',
              ContainerName: 'adot-init',
            },
          ],
        },
        {
          Command: [
            'cp',
            '-a',
            '/autoinstrumentation/.',
            '/otel-auto-instrumentation-nodejs',
          ],
          Essential: false,
          Image: 'public.ecr.aws/aws-observability/adot-autoinstrumentation-node:v0.5.0',
          MountPoints: [
            {
              ContainerPath: '/otel-auto-instrumentation-nodejs',
              ReadOnly: false,
              SourceVolume: 'opentelemetry-auto-instrumentation',
            },
          ],
          Name: 'adot-init',
          Cpu: 0,
          Memory: 128,
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
