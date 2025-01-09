import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import * as constants from './constants';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';

/**
 * Supported instrumentation languages for Application Signals.
 */
export enum InstrumentationLanguage {
  /**
   * Java instrumentation language.
   */
  JAVA,
  /**
   * Python instrumentation language.
   */
  PYTHON,
  /**
   * .NET instrumentation language.
   */
  DOTNET,
  /**
   * Node.js instrumentation language.
   */
  NODEJS,
}

/**
 * Base class for instrumentation versions.
 * Provides functionality to generate image URIs for different instrumentation types.
 */
export abstract class InstrumentationVersion {
  public constructor(protected readonly imageRepo: string, protected readonly version: string) {}

  /**
   * Get the image URI for the instrumentation version.
   * @returns The image URI.
   */
  public imageURI(): string {
    return `${this.imageRepo}:${this.version}`;
  }
}

/**
 * Available versions for Java instrumentation.
 */
/* eslint-disable @typescript-eslint/member-ordering */
export class JavaInstrumentationVersion extends InstrumentationVersion {
  private static readonly IMAGE_REPO = 'public.ecr.aws/aws-observability/adot-autoinstrumentation-java';
  /**
   * ADOT Java Instrumentation version 1.33.0
   */
  public static readonly V1_33_0 = new JavaInstrumentationVersion(JavaInstrumentationVersion.IMAGE_REPO, 'v1.33.0');
  /**
   * ADOT Java Instrumentation version 1.32.6
   */
  public static readonly V1_32_6 = new JavaInstrumentationVersion(JavaInstrumentationVersion.IMAGE_REPO, 'v1.32.6');
}
/* eslint-enable */

/**
 * Available versions for .NET instrumentation.
 */
/**
 * Available versions for Python instrumentation.
 */
/* eslint-disable @typescript-eslint/member-ordering */
export class PythonInstrumentationVersion extends InstrumentationVersion {
  private static readonly IMAGE_REPO = 'public.ecr.aws/aws-observability/adot-autoinstrumentation-python';
  /**
   * ADOT Python Instrumentation version 0.8.0
   */
  public static readonly V0_8_0 = new PythonInstrumentationVersion(PythonInstrumentationVersion.IMAGE_REPO, 'v0.8.0');
}
/* eslint-enable */

/**
 * Available versions for .NET instrumentation.
 */
/* eslint-disable @typescript-eslint/member-ordering */
export class DotnetInstrumentationVersion extends InstrumentationVersion {
  private static readonly IMAGE_REPO = 'public.ecr.aws/aws-observability/adot-autoinstrumentation-dotnet';
  /**
   * ADOT .NET Instrumentation version 1.6.0
   */
  public static readonly V1_6_0 = new DotnetInstrumentationVersion(DotnetInstrumentationVersion.IMAGE_REPO, 'v1.6.0');
  /**
   * ADOT .NET Instrumentation version 1.6.0 for ARM64
   */
  public static readonly V1_6_0_ARM64 = new DotnetInstrumentationVersion(DotnetInstrumentationVersion.IMAGE_REPO, 'v1.6.0-arm64');
  /**
   * ADOT .NET Instrumentation version 1.6.0 for AMD64
   */
  public static readonly V1_6_0_AMD64 = new DotnetInstrumentationVersion(DotnetInstrumentationVersion.IMAGE_REPO, 'v1.6.0-amd64');
  /**
   * ADOT .NET Instrumentation version 1.6.0 for Windows 2022
   */
  public static readonly V1_6_0_WINDOWS2022 = new DotnetInstrumentationVersion(DotnetInstrumentationVersion.IMAGE_REPO, 'v1.6.0-windows2022');
  /**
   * ADOT .NET Instrumentation version 1.6.0 for Windows 2019
   */
  public static readonly V1_6_0_WINDOWS2019 = new DotnetInstrumentationVersion(DotnetInstrumentationVersion.IMAGE_REPO, 'v1.6.0-windows2019');
}
/* eslint-enable */

/**
 * Available versions for Node.js instrumentation.
 */
/* eslint-disable @typescript-eslint/member-ordering */
export class NodeInstrumentationVersion extends InstrumentationVersion {
  private static readonly IMAGE_REPO = 'public.ecr.aws/aws-observability/adot-autoinstrumentation-node';
  /**
   * ADOT Node.js Instrumentation version 0.5.0
   */
  public static readonly V0_5_0 = new NodeInstrumentationVersion(NodeInstrumentationVersion.IMAGE_REPO, 'v0.5.0');
}
/* eslint-enable */

/**
 * Interface for environment extensions.
 */
export interface EnvironmentExtension {
  /**
   * The name of the environment variable.
   */
  readonly name: string;
  /**
   * The value of the environment variable.
   */
  readonly value: string;
}

/**
 * Interface for instrumentation properties.
 */
export interface InstrumentationProps {
  /**
   * The language of the instrumentation.
   */
  readonly language: InstrumentationLanguage;
  /**
   * The version of the instrumentation.
   */
  readonly sdkVersion: InstrumentationVersion;
  /**
   * The runtime platform of the instrumentation.
   *
   * @default - the runtime platform specified through the input TaskDefinition.
   */
  readonly runtimePlatform?: ecs.RuntimePlatform;
}

/**
 * Interface for Application Signals properties.
 */
export interface ApplicationSignalsIntegrationProps {

  /**
   * The name of the service.
   *
   * @default - task definition family name
   */
  readonly serviceName?: string;

  /**
   * The task definition to integrate Application Signals into.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly taskDefinition: ecs.TaskDefinition;

  /**
   * The instrumentation properties.
   */
  readonly instrumentation: InstrumentationProps;

  /**
   * The environment variables to override.
   *
   * @default - no environment variables to override.
   */
  readonly overrideEnvironments?: EnvironmentExtension[];

  /**
   * The CloudWatch Agent properties.
   *
   * @default - a basic agent sidecar container with latest public image
   */
  readonly cloudWatchAgent?: CloudWatchAgentProps;
}

/**
 * Interface for CloudWatch Agent properties.
 */
export interface CloudWatchAgentProps {

  /**
   * Whether to enable the CloudWatch Agent sidecar.
   *
   * @default - true
   */
  readonly enableSidecar: boolean;

  /**
   * The container definition options for the CloudWatch Agent.
   *
   * @default - a basic CloudWatch Agent container with latest public image.
   */
  readonly container?: ecs.ContainerDefinitionOptions;
}

const DEFAULT_ENVS = [
  {
    name: constants.LogsExporting.OTEL_LOGS_EXPORTER,
    value: constants.LogsExporting.OTEL_LOGS_EXPORTER_NONE,
  },
  {
    name: constants.MetricsExporting.OTEL_METRICS_EXPORTER,
    value: constants.MetricsExporting.OTEL_METRICS_EXPORTER_NONE,
  },
  {
    name: constants.CommonExporting.OTEL_EXPORTER_OTLP_PROTOCOL,
    value: constants.CommonExporting.OTEL_EXPORTER_OTLP_PROTOCOL_HTTP_PROTOBUF,
  },
  {
    name: constants.CommonExporting.OTEL_AWS_APPLICATION_SIGNALS,
    value: constants.CommonExporting.OTEL_AWS_APPLICATION_SIGNALS_ENABLED,
  },
  {
    name: constants.CommonExporting.OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT,
    value: constants.CommonExporting.OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT_LOCAL_CWA,
  },
  {
    name: constants.TraceExporting.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
    value: constants.TraceExporting.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT_LOCAL_CWA,
  },
  {
    name: constants.TraceExporting.OTEL_TRACES_SAMPLER,
    value: constants.TraceExporting.OTEL_TRACES_SAMPLER_XRAY,
  },
  {
    name: constants.TraceExporting.OTEL_TRACES_SAMPLER_ARG,
    value: constants.TraceExporting.OTEL_TRACES_SAMPLER_ARG_LOCAL_CWA,
  },
  {
    name: constants.TraceExporting.OTEL_PROPAGATORS,
    value: constants.TraceExporting.OTEL_PROPAGATORS_APPLICATION_SIGNALS,
  },
];

const JAVA_ENVS = [
  {
    name: constants.JavaInstrumentation.JAVA_TOOL_OPTIONS,
    value: constants.JavaInstrumentation.JAVA_TOOL_OPTIONS_ADOT,
  },
];

const PYTHON_ENVS = [
  {
    name: constants.PythonInstrumentation.OTEL_PYTHON_DISTRO,
    value: constants.PythonInstrumentation.OTEL_PYTHON_DISTRO_AWS_DISTRO,
  },
  {
    name: constants.PythonInstrumentation.OTEL_PYTHON_CONFIGURATOR,
    value: constants.PythonInstrumentation.OTEL_PYTHON_CONFIGURATOR_AWS_CONFIGURATOR,
  },
  {
    name: constants.PythonInstrumentation.PYTHONPATH,
    value: constants.PythonInstrumentation.PYTHONPATH_ADOT,
  },
];

const DOTNET_COMMON_ENVS = [
  {
    name: constants.DotnetInstrumentation.OTEL_DOTNET_DISTRO,
    value: constants.DotnetInstrumentation.OTEL_DOTNET_DISTRO_AWS_DISTRO,
  },
  {
    name: constants.DotnetInstrumentation.OTEL_DOTNET_CONFIGURATOR,
    value: constants.DotnetInstrumentation.OTEL_DOTNET_CONFIGURATOR_AWS_CONFIGURATOR,
  },
  {
    name: constants.DotnetInstrumentation.OTEL_DOTNET_AUTO_PLUGINS,
    value: constants.DotnetInstrumentation.OTEL_DOTNET_AUTO_PLUGINS_ADOT,
  },
];

const DOTNET_LINUX_ENVS = [
  {
    name: constants.DotnetInstrumentation.CORECLR_ENABLE_PROFILING,
    value: constants.DotnetInstrumentation.CORECLR_ENABLE_PROFILING_ENABLED,
  },
  {
    name: constants.DotnetInstrumentation.CORECLR_PROFILER,
    value: constants.DotnetInstrumentation.CORECLR_PROFILER_OTEL,
  },
  {
    name: constants.DotnetInstrumentation.CORECLR_PROFILER_PATH,
    value: constants.DotnetInstrumentation.CORECLR_PROFILER_PATH_LINUX_X64,
  },
  {
    name: constants.DotnetInstrumentation.DOTNET_STARTUP_HOOKS,
    value: constants.DotnetInstrumentation.DOTNET_STARTUP_HOOKS_LINUX_ADOT,
  },
  {
    name: constants.DotnetInstrumentation.DOTNET_ADDITIONAL_DEPS,
    value: constants.DotnetInstrumentation.DOTNET_ADDITIONAL_DEPS_LINUX_ADOT,
  },
  {
    name: constants.DotnetInstrumentation.OTEL_DOTNET_AUTO_HOME,
    value: constants.DotnetInstrumentation.OTEL_DOTNET_AUTO_HOME_LINUX_ADOT,
  },
  {
    name: constants.DotnetInstrumentation.DOTNET_SHARED_STORE,
    value: constants.DotnetInstrumentation.DOTNET_SHARED_STORE_LINUX_ADOT,
  },
];

const DOTNET_WINDOWS_ENVS = [
  {
    name: constants.DotnetInstrumentation.CORECLR_ENABLE_PROFILING,
    value: constants.DotnetInstrumentation.CORECLR_ENABLE_PROFILING_ENABLED,
  },
  {
    name: constants.DotnetInstrumentation.CORECLR_PROFILER,
    value: constants.DotnetInstrumentation.CORECLR_PROFILER_OTEL,
  },
  {
    name: constants.DotnetInstrumentation.CORECLR_PROFILER_PATH,
    value: constants.DotnetInstrumentation.CORECLR_PROFILER_PATH_WINDOWS_X64,
  },
  {
    name: constants.DotnetInstrumentation.DOTNET_STARTUP_HOOKS,
    value: constants.DotnetInstrumentation.DOTNET_STARTUP_HOOKS_WINDOWS_ADOT,
  },
  {
    name: constants.DotnetInstrumentation.DOTNET_ADDITIONAL_DEPS,
    value: constants.DotnetInstrumentation.DOTNET_ADDITIONAL_DEPS_WINDOWS_ADOT,
  },
  {
    name: constants.DotnetInstrumentation.OTEL_DOTNET_AUTO_HOME,
    value: constants.DotnetInstrumentation.OTEL_DOTNET_AUTO_HOME_WINDOWS_ADOT,
  },
  {
    name: constants.DotnetInstrumentation.DOTNET_SHARED_STORE,
    value: constants.DotnetInstrumentation.DOTNET_SHARED_STORE_WINDOWS_ADOT,
  },
];

abstract class SDKInject {
  protected taskDefinition: ecs.TaskDefinition;
  protected sharedVolumeName: string;
  protected adotImage: string;
  private overrideEnvironments?: EnvironmentExtension[];

  constructor(
    taskDefinition: ecs.TaskDefinition,
    sharedVolumeName: string,
    adotImage: string,
    overrideEnvironments?: EnvironmentExtension[]) {
    this.taskDefinition = taskDefinition;
    this.sharedVolumeName = sharedVolumeName;
    this.adotImage = adotImage;
    this.overrideEnvironments = overrideEnvironments;
  }

  abstract get command(): string[];
  abstract get memoryLimitMiB(): number;

  protected abstract get containerPath(): string;
  protected abstract applyAdditionalEnvironments(container: ecs.ContainerDefinition): void;

  public injectInitContainer(): ecs.ContainerDefinition {
    const initContainer = this.taskDefinition.addContainer('adot-init', {
      image: ecs.ContainerImage.fromRegistry(this.adotImage),
      essential: false,
      command: this.command,
      cpu: 0,
      memoryLimitMiB: this.memoryLimitMiB,
    });
    initContainer.addMountPoints({
      sourceVolume: this.sharedVolumeName,
      containerPath: this.containerPath,
      // double check
      readOnly: false,
    });
    return initContainer;
  }

  public renderDefaultContainer(container: ecs.ContainerDefinition) {
    for (const env of DEFAULT_ENVS) {
      container.addEnvironment(env.name, env.value);
    }
    this.applyAdditionalEnvironments(container);
    for (const env of this.overrideEnvironments??[]) {
      container.addEnvironment(env.name, env.value);
    }
    container.addMountPoints({
      sourceVolume: this.sharedVolumeName,
      containerPath: this.containerPath,
      // double check
      readOnly: false,
    });
  }
}

class JavaSDKInject extends SDKInject {
  get command(): string[] {
    return ['cp', '/javaagent.jar', '/otel-auto-instrumentation/javaagent.jar'];
  }

  get memoryLimitMiB(): number {
    return 64;
  }

  protected get containerPath(): string {
    return '/otel-auto-instrumentation';
  }

  protected applyAdditionalEnvironments(container: ecs.ContainerDefinition) {
    const environments = (container as any).environment;
    for (const env of JAVA_ENVS) {
      if (!environments[env.name]) {
        container.addEnvironment(env.name, env.value);
      }
    }
  }
}

class PythonSDKInject extends SDKInject {
  get command(): string[] {
    return ['cp', '-a', '/autoinstrumentation/.', '/otel-auto-instrumentation-python'];
  }

  get memoryLimitMiB(): number {
    return 32;
  }

  public applyAdditionalEnvironments(container: ecs.ContainerDefinition): void {
    const environments = (container as any).environment;
    for (const env of PYTHON_ENVS) {
      if (!environments[env.name]) {
        container.addEnvironment(env.name, env.value);
      } else if ('PYTHONPATH' === env.name) {
        const pythonPath = environments[env.name];
        container.addEnvironment(env.name, `/otel-auto-instrumentation-python/opentelemetry/instrumentation/auto_instrumentation:${pythonPath}:/otel-auto-instrumentation-python`);
      }
    }
  }

  protected get containerPath(): string {
    return '/otel-auto-instrumentation-python';
  }
}

class DotNetSDKOnLinuxInject extends SDKInject {
  private cpuArch: ecs.CpuArchitecture;

  constructor(
    taskDefinition: ecs.TaskDefinition,
    sharedVolumeName: string,
    adotImage: string,
    cpuArch: ecs.CpuArchitecture,
    overrideEnvironments?: EnvironmentExtension[]) {
    super(taskDefinition, sharedVolumeName, adotImage, overrideEnvironments);
    this.cpuArch = cpuArch;
  }

  get command(): string[] {
    return ['cp', '-a', '/autoinstrumentation/.', '/otel-auto-instrumentation-dotnet'];
  }

  get memoryLimitMiB(): number {
    return 128;
  }

  public applyAdditionalEnvironments(container: ecs.ContainerDefinition): void {
    const environments = (container as any).environment;
    let libPath = 'linux-x64';
    if (this.cpuArch == ecs.CpuArchitecture.ARM64) {
      libPath = 'linux-arm64';
    }
    for (const env of [...DOTNET_COMMON_ENVS, {
      name: 'CORECLR_PROFILER_PATH',
      value: `/otel-auto-instrumentation-dotnet/${libPath}/OpenTelemetry.AutoInstrumentation.Native.so`,
    }]) {
      if (!environments[env.name]) {
        container.addEnvironment(env.name, env.value);
      }
    }

    if (environments.OTEL_DOTNET_AUTO_HOME) {
      // If OTEL_DOTNET_AUTO_HOME env var is already set, we will assume that .NET Auto-instrumentation is already configured.
      return;
    }

    for (const env of DOTNET_LINUX_ENVS) {
      if (!environments[env.name]) {
        container.addEnvironment(env.name, env.value);
      }
    }
  }

  protected get containerPath(): string {
    return '/otel-auto-instrumentation-dotnet';
  }
}

class DotNetSDKOnWindowsInject extends SDKInject {
  get command(): string[] {
    return ['CMD',
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
      '/T'];
  }

  get memoryLimitMiB(): number {
    return 128;
  }

  public applyAdditionalEnvironments(container: ecs.ContainerDefinition): void {
    const environments = (container as any).environment;
    for (const env of DOTNET_COMMON_ENVS) {
      if (!environments[env.name]) {
        container.addEnvironment(env.name, env.value);
      }
    }
    if (environments.OTEL_DOTNET_AUTO_HOME) {
      // If OTEL_DOTNET_AUTO_HOME env var is already set, we will assume that .NET Auto-instrumentation is already configured.
      return;
    }
    for (const env of DOTNET_WINDOWS_ENVS) {
      if (!environments[env.name]) {
        container.addEnvironment(env.name, env.value);
      }
    }
  }

  protected get containerPath(): string {
    return 'C:\\otel-auto-instrumentation-dotnet';
  }
}

class NodeSDKInject extends SDKInject {
  get command(): string[] {
    return ['cp', '-a', '/autoinstrumentation/.', '/otel-auto-instrumentation-nodejs'];
  }

  get memoryLimitMiB(): number {
    return 128;
  }

  public applyAdditionalEnvironments(container: ecs.ContainerDefinition): void {
    const environments = (container as any).environment;
    const originalNodeOptions = environments.NODE_OPTIONS ?? '';
    let renderedNodeOptions = `${originalNodeOptions} --require /otel-auto-instrumentation-nodejs/autoinstrumentation.js`;
    container.addEnvironment('NODE_OPTIONS', renderedNodeOptions);
  }

  protected get containerPath(): string {
    return '/otel-auto-instrumentation-nodejs';
  }
}

const CLOUDWATCH_AGENT_IMAGE = 'amazon/cloudwatch-agent:latest';
const CLOUDWATCH_AGENT_IMAGE_WIN2019 = 'public.ecr.aws/cloudwatch-agent/cloudwatch-agent:latest-windowsservercore2019';
const CLOUDWATCH_AGENT_IMAGE_WIN2022 ='public.ecr.aws/cloudwatch-agent/cloudwatch-agent:latest-windowsservercore2022';
const CW_CONFIG_CONTENT = {
  logs: {
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

/**
 * Class for integrating Application Signals into an ECS task definition.
 */
export class ApplicationSignalsIntegration extends Construct {
  private sdkInject?: SDKInject;
  private mountVolumeName: string = 'opentelemetry-auto-instrumentation';

  constructor(
    scope: Construct,
    id: string,
    props: ApplicationSignalsIntegrationProps) {
    super(scope, id);
    let serviceName = props.serviceName;
    if (!serviceName) {
      serviceName = props.taskDefinition.family;
    }

    let overrideEnvironments: EnvironmentExtension[] = [{
      name: constants.CommonExporting.OTEL_RESOURCE_ATTRIBUTES,
      value: `service.name=${serviceName}`,
    }];

    let runtimePlatformObj = props.instrumentation.runtimePlatform ?? (props.taskDefinition as any).runtimePlatform;
    let cloudWatchAgentImage = CLOUDWATCH_AGENT_IMAGE;
    let cpuArch = ecs.CpuArchitecture.X86_64;
    let isWindows = false;
    if (runtimePlatformObj) {
      const runtimePlatform = runtimePlatformObj as ecs.RuntimePlatform;
      if (runtimePlatform.operatingSystemFamily) {
        switch (runtimePlatform.operatingSystemFamily) {
          case ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE:
          case ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_FULL:
            cloudWatchAgentImage = CLOUDWATCH_AGENT_IMAGE_WIN2019;
            isWindows = true;
            break;
          case ecs.OperatingSystemFamily.WINDOWS_SERVER_2022_CORE:
          case ecs.OperatingSystemFamily.WINDOWS_SERVER_2022_FULL:
            cloudWatchAgentImage = CLOUDWATCH_AGENT_IMAGE_WIN2022;
            isWindows = true;
            break;
        }
        if (runtimePlatform.cpuArchitecture) {
          cpuArch = runtimePlatform.cpuArchitecture;
        }
      }
    }

    const cloudWatchAgentConfig = props.cloudWatchAgent ?? { enableSidecar: true };

    if (props.taskDefinition.compatibility === ecs.Compatibility.FARGATE && !cloudWatchAgentConfig.enableSidecar) {
      throw new Error('Fargate tasks must deploy CloudWatch Agent as a sidecar container');
    }
    if (cloudWatchAgentConfig.enableSidecar) {
      props.taskDefinition.taskRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy'));
    }

    overrideEnvironments.push(...props.overrideEnvironments ?? []);
    switch (props.instrumentation.language) {
      case InstrumentationLanguage.JAVA:
        this.sdkInject = new JavaSDKInject(
          props.taskDefinition,
          this.mountVolumeName,
          props.instrumentation.sdkVersion.imageURI(),
          overrideEnvironments,
        );
        break;
      case InstrumentationLanguage.PYTHON:
        this.sdkInject = new PythonSDKInject(
          props.taskDefinition,
          this.mountVolumeName,
          props.instrumentation.sdkVersion.imageURI(),
          overrideEnvironments,
        );
        break;
      case InstrumentationLanguage.DOTNET:
        if (isWindows) {
          this.sdkInject = new DotNetSDKOnWindowsInject(
            props.taskDefinition,
            this.mountVolumeName,
            props.instrumentation.sdkVersion.imageURI(),
            overrideEnvironments,
          );
        } else {
          this.sdkInject = new DotNetSDKOnLinuxInject(
            props.taskDefinition,
            this.mountVolumeName,
            props.instrumentation.sdkVersion.imageURI(),
            cpuArch,
            overrideEnvironments,
          );
        }
        break;
      case InstrumentationLanguage.NODEJS:
        this.sdkInject = new NodeSDKInject(
          props.taskDefinition,
          this.mountVolumeName,
          props.instrumentation.sdkVersion.imageURI(),
          overrideEnvironments,
        );
        break;
    }

    let cwaContainer: ecs.ContainerDefinitionOptions | undefined;
    if (cloudWatchAgentConfig.enableSidecar) {
      cwaContainer = cloudWatchAgentConfig.container ?? this.getCloudWatchAgentContainer(cloudWatchAgentImage);
    }

    this.mutateTaskDefinition(props.taskDefinition, cwaContainer);
  }

  private mutateTaskDefinition(taskDefinition: ecs.TaskDefinition, cwaContainer?: ecs.ContainerDefinitionOptions) {
    taskDefinition.addVolume({
      name: this.mountVolumeName,
    });

    let defaultContainer = taskDefinition.defaultContainer!;
    if (this.sdkInject) {
      this.sdkInject.renderDefaultContainer(defaultContainer);
      let initContainer = this.sdkInject.injectInitContainer();
      defaultContainer.addContainerDependencies({
        container: initContainer,
        condition: ecs.ContainerDependencyCondition.SUCCESS,
      });
    }

    if (cwaContainer) {
      let cwagentContainer = taskDefinition.addContainer('cloudwatch-agent', cwaContainer);
      defaultContainer.addContainerDependencies({
        container: cwagentContainer,
        condition: ecs.ContainerDependencyCondition.START,
      });
    }
  }

  private getCloudWatchAgentContainer(image: string): ecs.ContainerDefinitionOptions {
    return {
      image: ecs.ContainerImage.fromRegistry(image),
      environment: {
        CW_CONFIG_CONTENT: JSON.stringify(CW_CONFIG_CONTENT),
      },
      logging: new ecs.AwsLogDriver({ streamPrefix: 'cloudwatch-agent' }),
      user: '0:1338',
      memoryReservationMiB: 50,
      portMappings: [
        {
          containerPort: 4316,
          hostPort: 4316,
        },
        {
          containerPort: 2000,
          hostPort: 2000,
        },
      ],
    };
  }
}
