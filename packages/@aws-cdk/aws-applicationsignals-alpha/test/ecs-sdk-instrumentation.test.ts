import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as appsignals from '../lib';

class SnapshotInstrumentationVersion extends appsignals.InstrumentationVersion {
}

describe('application signals adot sdk agent integration', () => {
  test('should create an init container with default java config', () => {
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
    fargateTaskDefinition.addVolume({
      name: 'test',
    });

    const injector = new appsignals.JavaInjector('test', appsignals.JavaInstrumentationVersion.V2_10_0);
    injector.injectInitContainer(fargateTaskDefinition);
    injector.renderDefaultContainer(fargateTaskDefinition);

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
              Name: 'OTEL_SERVICE_NAME',
              Value: 'TestTaskDefinition',
            },
          ],
          Essential: true,
          Image: 'docker/cdk-test',
          MountPoints: [
            {
              ContainerPath: '/otel-auto-instrumentation',
              ReadOnly: false,
              SourceVolume: 'test',
            },
          ],
          Name: 'app',
        },
        {
          Command: [
            'cp',
            '/javaagent.jar',
            '/otel-auto-instrumentation/javaagent.jar',
          ],
          Essential: false,
          Image: 'public.ecr.aws/aws-observability/adot-autoinstrumentation-java:v2.10.0',
          MountPoints: [
            {
              ContainerPath: '/otel-auto-instrumentation',
              ReadOnly: false,
              SourceVolume: 'test',
            },
          ],
          Name: 'adot-init',
          Cpu: 0,
          Memory: 64,
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
      Volumes: [
        {
          Name: 'test',
        },
      ],
    });
  });

  test('should create an init container with custom java instrumentation version', () => {
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
    fargateTaskDefinition.addVolume({
      name: 'test',
    });

    const injector = new appsignals.JavaInjector(
      'test',
      // override image and increase the memory resource
      new SnapshotInstrumentationVersion(appsignals.JavaInstrumentationVersion.IMAGE_REPO, 'SNAPSHOT', 128),
      // customize service.name and add additional resource attributes
      [{
        name: appsignals.CommonExporting.OTEL_RESOURCE_ATTRIBUTES,
        value: 'service.name=unit,deployment.environment.name=test',
      }],
    );
    injector.injectInitContainer(fargateTaskDefinition);
    injector.renderDefaultContainer(fargateTaskDefinition);

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
              Value: 'service.name=unit,deployment.environment.name=test',
            },
          ],
          Essential: true,
          Image: 'docker/cdk-test',
          MountPoints: [
            {
              ContainerPath: '/otel-auto-instrumentation',
              ReadOnly: false,
              SourceVolume: 'test',
            },
          ],
          Name: 'app',
        },
        {
          Command: [
            'cp',
            '/javaagent.jar',
            '/otel-auto-instrumentation/javaagent.jar',
          ],
          Essential: false,
          Image: 'public.ecr.aws/aws-observability/adot-autoinstrumentation-java:SNAPSHOT',
          MountPoints: [
            {
              ContainerPath: '/otel-auto-instrumentation',
              ReadOnly: false,
              SourceVolume: 'test',
            },
          ],
          Name: 'adot-init',
          Cpu: 0,
          Memory: 128,
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
      Volumes: [
        {
          Name: 'test',
        },
      ],
    });
  });

  test('should create an init container with default python config', () => {
    class TestCase {
      environments: { [key: string]: string };
      expectedPythonPath: string;

      constructor(
        environments: { [key: string]: string },
        expectedPythonPath: string) {
        this.environments = environments;
        this.expectedPythonPath = expectedPythonPath;
      }
    }
    for (const test of [
      new TestCase({}, '/otel-auto-instrumentation-python/opentelemetry/instrumentation/auto_instrumentation:/otel-auto-instrumentation-python'),
      new TestCase({ PYTHONPATH: '/mysite' }, '/otel-auto-instrumentation-python/opentelemetry/instrumentation/auto_instrumentation:/mysite:/otel-auto-instrumentation-python'),
    ]) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const fargateTaskDefinition = new ecs.FargateTaskDefinition(stack, 'TestTaskDefinition', {
        cpu: 256,
        memoryLimitMiB: 512,
      });
      fargateTaskDefinition.addContainer('app', {
        image: ecs.ContainerImage.fromRegistry('docker/cdk-test'),
        environment: test.environments,
      });
      fargateTaskDefinition.addVolume({
        name: 'test',
      });

      const injector = new appsignals.PythonInjector('test', appsignals.PythonInstrumentationVersion.V0_8_0);
      injector.injectInitContainer(fargateTaskDefinition);
      injector.renderDefaultContainer(fargateTaskDefinition);

      const expectedEnvironments = [
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
          Name: 'OTEL_PYTHON_DISTRO',
          Value: 'aws_distro',
        },
        {
          Name: 'OTEL_PYTHON_CONFIGURATOR',
          Value: 'aws_configurator',
        },
        {
          Name: 'OTEL_SERVICE_NAME',
          Value: 'TestTaskDefinition',
        },
      ];
      if (test.environments.PYTHONPATH) {
        expectedEnvironments.unshift({
          Name: 'PYTHONPATH',
          Value: test.expectedPythonPath,
        });
      } else {
        // Insert NODE_OPTIONS before OTEL_SERVICE_NAME
        expectedEnvironments.splice(expectedEnvironments.length-1, 0, {
          Name: 'PYTHONPATH',
          Value: test.expectedPythonPath,
        });
      }

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Environment: expectedEnvironments,
            Essential: true,
            Image: 'docker/cdk-test',
            MountPoints: [
              {
                ContainerPath: '/otel-auto-instrumentation-python',
                ReadOnly: false,
                SourceVolume: 'test',
              },
            ],
            Name: 'app',
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
                SourceVolume: 'test',
              },
            ],
            Name: 'adot-init',
            Cpu: 0,
            Memory: 32,
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
        Volumes: [
          {
            Name: 'test',
          },
        ],
      });
    }
  });

  test('should create an init container with default dotnet on linux', () => {
    class TestCase {
      cpuArch: ecs.CpuArchitecture;
      expectedCoreCLRProfilerPath: string;

      constructor(
        cpuArch: ecs.CpuArchitecture,
        expectedCoreCLRProfilerPath: string) {
        this.cpuArch = cpuArch;
        this.expectedCoreCLRProfilerPath = expectedCoreCLRProfilerPath;
      }
    }

    for (const test of [new TestCase(ecs.CpuArchitecture.ARM64, '/otel-auto-instrumentation-dotnet/linux-arm64/OpenTelemetry.AutoInstrumentation.Native.so' ),
      new TestCase(ecs.CpuArchitecture.X86_64, '/otel-auto-instrumentation-dotnet/linux-x64/OpenTelemetry.AutoInstrumentation.Native.so')]) {
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
      fargateTaskDefinition.addVolume({
        name: 'test',
      });

      const injector = new appsignals.DotNetLinuxInjector('test', appsignals.DotnetInstrumentationVersion.V1_6_0, test.cpuArch);
      injector.injectInitContainer(fargateTaskDefinition);
      injector.renderDefaultContainer(fargateTaskDefinition);

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
                Value: `${test.expectedCoreCLRProfilerPath}`,
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
                Name: 'OTEL_SERVICE_NAME',
                Value: 'TestTaskDefinition',
              },
            ],
            Essential: true,
            Image: 'docker/cdk-test',
            MountPoints: [
              {
                ContainerPath: '/otel-auto-instrumentation-dotnet',
                ReadOnly: false,
                SourceVolume: 'test',
              },
            ],
            Name: 'app',
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
                SourceVolume: 'test',
              },
            ],
            Name: 'adot-init',
            Cpu: 0,
            Memory: 128,
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
        Volumes: [
          {
            Name: 'test',
          },
        ],
      });
    }
  });

  test('should create an init container with default dotnet on windows', () => {
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
    fargateTaskDefinition.addVolume({
      name: 'test',
    });

    const injector = new appsignals.DotNetWindowsInjector('test', appsignals.DotnetInstrumentationVersion.V1_6_0_WINDOWS2022);
    injector.injectInitContainer(fargateTaskDefinition);
    injector.renderDefaultContainer(fargateTaskDefinition);

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
              Name: 'OTEL_SERVICE_NAME',
              Value: 'TestTaskDefinition',
            },
          ],
          Essential: true,
          Image: 'docker/cdk-test',
          MountPoints: [
            {
              ContainerPath: 'C:\\otel-auto-instrumentation-dotnet',
              ReadOnly: false,
              SourceVolume: 'test',
            },
          ],
          Name: 'app',
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
              SourceVolume: 'test',
            },
          ],
          Name: 'adot-init',
          Cpu: 0,
          Memory: 128,
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
      Volumes: [
        {
          Name: 'test',
        },
      ],
    });
  });

  test('should create an init container with default nodejs config', () => {
    class TestCase {
      environments: { [key: string]: string };
      expectedNodeOptions: string;

      constructor(
        environments: { [key: string]: string },
        expectedNodeOptions: string) {
        this.environments = environments;
        this.expectedNodeOptions = expectedNodeOptions;
      }
    }

    for (const test of [
      new TestCase({}, ' --require /otel-auto-instrumentation-nodejs/autoinstrumentation.js'),
      new TestCase({ NODE_OPTIONS: '--max-old-space-size=4096' }, '--max-old-space-size=4096 --require /otel-auto-instrumentation-nodejs/autoinstrumentation.js'),
    ]) {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const fargateTaskDefinition = new ecs.FargateTaskDefinition(stack, 'TestTaskDefinition', {
        cpu: 256,
        memoryLimitMiB: 512,
      });
      fargateTaskDefinition.addContainer('app', {
        image: ecs.ContainerImage.fromRegistry('docker/cdk-test'),
        environment: test.environments,
      });
      fargateTaskDefinition.addVolume({
        name: 'test',
      });

      const injector = new appsignals.NodeInjector('test', appsignals.NodeInstrumentationVersion.V0_5_0);
      injector.injectInitContainer(fargateTaskDefinition);
      injector.renderDefaultContainer(fargateTaskDefinition);

      const expectedEnvironments = [
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
          Name: 'OTEL_SERVICE_NAME',
          Value: 'TestTaskDefinition',
        },
      ];
      if (test.environments.NODE_OPTIONS) {
        expectedEnvironments.unshift({
          Name: 'NODE_OPTIONS',
          Value: test.expectedNodeOptions,
        });
      } else {
        // Insert NODE_OPTIONS before OTEL_SERVICE_NAME
        expectedEnvironments.splice(expectedEnvironments.length-1, 0, {
          Name: 'NODE_OPTIONS',
          Value: test.expectedNodeOptions,
        });
      }
      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [
          {
            Environment: expectedEnvironments,
            Essential: true,
            Image: 'docker/cdk-test',
            MountPoints: [
              {
                ContainerPath: '/otel-auto-instrumentation-nodejs',
                ReadOnly: false,
                SourceVolume: 'test',
              },
            ],
            Name: 'app',
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
                SourceVolume: 'test',
              },
            ],
            Name: 'adot-init',
            Cpu: 0,
            Memory: 128,
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
        Volumes: [
          {
            Name: 'test',
          },
        ],
      });
    }
  });
});

class CustomJavaInjector extends appsignals.JavaInjector {
  get containerPath(): string {
    return '/otel-snapshot';
  }
}

class CustomPythonInjector extends appsignals.PythonInjector {
  get containerPath(): string {
    return '/otel-snapshot';
  }

  protected injectAdditionalEnvironments(envsToInject: { [key: string]: string }, _envsFromTaskDef: { [key: string]: string }): void {
    for (const env of appsignals.PythonInjector.PYTHON_ENVS) {
      envsToInject[env.name] = env.value;
    }
    envsToInject[appsignals.PythonInstrumentation.PYTHONPATH] = `${this.containerPath}/auto_instrumentation:${this.containerPath}`;
  }
}

class CustomDotnetLinuxInjector extends appsignals.DotNetLinuxInjector {
  get containerPath(): string {
    return '/otel-snapshot';
  }
}

class CustomNodeInjector extends appsignals.NodeInjector {
  get containerPath(): string {
    return '/otel-snapshot';
  }
}

describe('application signals custom injector', () => {
  test('should create an init container with custom java injector', () => {
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
    fargateTaskDefinition.addVolume({
      name: 'test',
    });

    const injector = new CustomJavaInjector('test', appsignals.JavaInstrumentationVersion.V2_10_0);
    injector.injectInitContainer(fargateTaskDefinition);
    injector.renderDefaultContainer(fargateTaskDefinition);

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
              Value: ' -javaagent:/otel-snapshot/javaagent.jar',
            },
            {
              Name: 'OTEL_SERVICE_NAME',
              Value: 'TestTaskDefinition',
            },
          ],
          Essential: true,
          Image: 'docker/cdk-test',
          MountPoints: [
            {
              ContainerPath: '/otel-snapshot',
              ReadOnly: false,
              SourceVolume: 'test',
            },
          ],
          Name: 'app',
        },
        {
          Command: [
            'cp',
            '/javaagent.jar',
            '/otel-snapshot/javaagent.jar',
          ],
          Essential: false,
          Image: 'public.ecr.aws/aws-observability/adot-autoinstrumentation-java:v2.10.0',
          MountPoints: [
            {
              ContainerPath: '/otel-snapshot',
              ReadOnly: false,
              SourceVolume: 'test',
            },
          ],
          Name: 'adot-init',
          Cpu: 0,
          Memory: 64,
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
      Volumes: [
        {
          Name: 'test',
        },
      ],
    });
  });

  test('should create an init container with custom python injector', () => {
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
    fargateTaskDefinition.addVolume({
      name: 'test',
    });

    const injector = new CustomPythonInjector('test', appsignals.PythonInstrumentationVersion.V0_8_0);
    injector.injectInitContainer(fargateTaskDefinition);
    injector.renderDefaultContainer(fargateTaskDefinition);

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
              Name: 'OTEL_PYTHON_DISTRO',
              Value: 'aws_distro',
            },
            {
              Name: 'OTEL_PYTHON_CONFIGURATOR',
              Value: 'aws_configurator',
            },
            {
              Name: 'PYTHONPATH',
              Value: '/otel-snapshot/auto_instrumentation:/otel-snapshot',
            },
            {
              Name: 'OTEL_SERVICE_NAME',
              Value: 'TestTaskDefinition',
            },
          ],
          Essential: true,
          Image: 'docker/cdk-test',
          MountPoints: [
            {
              ContainerPath: '/otel-snapshot',
              ReadOnly: false,
              SourceVolume: 'test',
            },
          ],
          Name: 'app',
        },
        {
          Command: [
            'cp',
            '-a',
            '/autoinstrumentation/.',
            '/otel-snapshot',
          ],
          Essential: false,
          Image: 'public.ecr.aws/aws-observability/adot-autoinstrumentation-python:v0.8.0',
          MountPoints: [
            {
              ContainerPath: '/otel-snapshot',
              ReadOnly: false,
              SourceVolume: 'test',
            },
          ],
          Name: 'adot-init',
          Cpu: 0,
          Memory: 32,
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
      Volumes: [
        {
          Name: 'test',
        },
      ],
    });
  });

  test('should create an init container with custom dotnet injector', () => {
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
    fargateTaskDefinition.addVolume({
      name: 'test',
    });

    const injector = new CustomDotnetLinuxInjector('test', appsignals. DotnetInstrumentationVersion.V1_6_0, ecs.CpuArchitecture.X86_64);
    injector.injectInitContainer(fargateTaskDefinition);
    injector.renderDefaultContainer(fargateTaskDefinition);

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
              Value: '/otel-snapshot/linux-x64/OpenTelemetry.AutoInstrumentation.Native.so',
            },
            {
              Name: 'DOTNET_STARTUP_HOOKS',
              Value: '/otel-snapshot/net/OpenTelemetry.AutoInstrumentation.StartupHook.dll',
            },
            {
              Name: 'DOTNET_ADDITIONAL_DEPS',
              Value: '/otel-snapshot/AdditionalDeps',
            },
            {
              Name: 'OTEL_DOTNET_AUTO_HOME',
              Value: '/otel-snapshot',
            },
            {
              Name: 'DOTNET_SHARED_STORE',
              Value: '/otel-snapshot/store',
            },
            {
              Name: 'OTEL_SERVICE_NAME',
              Value: 'TestTaskDefinition',
            },
          ],
          Essential: true,
          Image: 'docker/cdk-test',
          MountPoints: [
            {
              ContainerPath: '/otel-snapshot',
              ReadOnly: false,
              SourceVolume: 'test',
            },
          ],
          Name: 'app',
        },
        {
          Command: [
            'cp',
            '-a',
            '/autoinstrumentation/.',
            '/otel-snapshot',
          ],
          Essential: false,
          Image: 'public.ecr.aws/aws-observability/adot-autoinstrumentation-dotnet:v1.6.0',
          MountPoints: [
            {
              ContainerPath: '/otel-snapshot',
              ReadOnly: false,
              SourceVolume: 'test',
            },
          ],
          Name: 'adot-init',
          Cpu: 0,
          Memory: 128,
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
      Volumes: [
        {
          Name: 'test',
        },
      ],
    });
  });

  test('should create an init container with custom nodejs injector', () => {
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
    fargateTaskDefinition.addVolume({
      name: 'test',
    });

    const injector = new CustomNodeInjector('test', appsignals.NodeInstrumentationVersion.V0_5_0);
    injector.injectInitContainer(fargateTaskDefinition);
    injector.renderDefaultContainer(fargateTaskDefinition);

    const expectedEnvironments = [
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
        Value: ' --require /otel-snapshot/autoinstrumentation.js',
      },
      {
        Name: 'OTEL_SERVICE_NAME',
        Value: 'TestTaskDefinition',
      },
    ];
      // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Environment: expectedEnvironments,
          Essential: true,
          Image: 'docker/cdk-test',
          MountPoints: [
            {
              ContainerPath: '/otel-snapshot',
              ReadOnly: false,
              SourceVolume: 'test',
            },
          ],
          Name: 'app',
        },
        {
          Command: [
            'cp',
            '-a',
            '/autoinstrumentation/.',
            '/otel-snapshot',
          ],
          Essential: false,
          Image: 'public.ecr.aws/aws-observability/adot-autoinstrumentation-node:v0.5.0',
          MountPoints: [
            {
              ContainerPath: '/otel-snapshot',
              ReadOnly: false,
              SourceVolume: 'test',
            },
          ],
          Name: 'adot-init',
          Cpu: 0,
          Memory: 128,
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
      Volumes: [
        {
          Name: 'test',
        },
      ],
    });
  });
});
