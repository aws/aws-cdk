import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as constants from './constants';
import * as inst from './instrumentation-versions';

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
 * Injector is a base class for all SDK injects to mutate the task definition
 * to inject the ADOT init container and configure the application container with
 * the necessary environment variables.
 */
export abstract class Injector {
  protected static readonly DEFAULT_ENVS: EnvironmentExtension[] = [
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

  protected sharedVolumeName: string;
  protected instrumentationVersion: inst.InstrumentationVersion;
  private overrideEnvironments?: EnvironmentExtension[];

  public constructor(
    sharedVolumeName: string,
    instrumentationVersion: inst.InstrumentationVersion,
    overrideEnvironments?: EnvironmentExtension[]) {
    this.sharedVolumeName = sharedVolumeName;
    this.instrumentationVersion = instrumentationVersion;
    this.overrideEnvironments = overrideEnvironments;
  }

  /**
   * The command to run the init container.
   */
  abstract get command(): string[];
  /**
   * The path to ADOT SDK agent in the init container.
   */
  abstract get containerPath(): string;
  /**
   * Inject additional environment variables to the application container other than the DEFAULT_ENVS.
   */
  protected abstract injectAdditionalEnvironments(envsToInject: { [key: string]: string }, envsFromTaskDef: { [key: string]: string }): void;
  /**
   * Override environment variables in the application container.
   */
  protected abstract overrideAdditionalEnvironments(envsToOverride: { [key: string]: string }, envsFromTaskDef: { [key: string]: string }): void;

  /**
   * Inject ADOT SDK agent init container.
   * @param taskDefinition The TaskDefinition to render
   * @returns The created ContainerDefinition
   */
  public injectInitContainer(taskDefinition: ecs.TaskDefinition): ecs.ContainerDefinition {
    const initContainer = taskDefinition.addContainer('adot-init', {
      image: ecs.ContainerImage.fromRegistry(this.instrumentationVersion.imageURI()),
      essential: false,
      command: this.command,
      cpu: 0,
      memoryLimitMiB: this.instrumentationVersion.memoryLimitMiB(),
    });
    initContainer.addMountPoints({
      sourceVolume: this.sharedVolumeName,
      containerPath: this.containerPath,
      // double check
      readOnly: false,
    });
    return initContainer;
  }

  /**
   * Render the application container for SDK instrumentation.
   * @param taskDefinition The TaskDefinition to render
   */
  public renderDefaultContainer(taskDefinition: ecs.TaskDefinition): void {
    let container = taskDefinition.defaultContainer!;

    const envsToInject: { [key: string]: string } = {};
    const envsFromTaskDef = (container as any).environment;

    for (const env of Injector.DEFAULT_ENVS) {
      envsToInject[env.name] = env.value;
    }
    this.injectAdditionalEnvironments(envsToInject, envsFromTaskDef);

    const envsToOverride: { [key: string]: string } = {};
    this.overrideAdditionalEnvironments(envsToOverride, envsFromTaskDef);

    for (const [key, value] of Object.entries(envsToInject)) {
      if (!envsFromTaskDef[key]) {
        container.addEnvironment(key, value);
      }
    }

    for (const [key, value] of Object.entries(envsToOverride)) {
      container.addEnvironment(key, value);
    }
    for (const env of this.overrideEnvironments ?? []) {
      container.addEnvironment(env.name, env.value);
    }

    if (!envsFromTaskDef[constants.CommonExporting.OTEL_SERVICE_NAME]) {
      let resourceAttributesVal = (envsFromTaskDef[constants.CommonExporting.OTEL_RESOURCE_ATTRIBUTES] || '') as string;
      if (resourceAttributesVal.indexOf('service.name') < 0) {
        // Configure service.name to be task definition family name if undefined.
        container.addEnvironment(constants.CommonExporting.OTEL_SERVICE_NAME, taskDefinition.family);
      }
    }

    container.addMountPoints({
      sourceVolume: this.sharedVolumeName,
      containerPath: this.containerPath,
      // double check
      readOnly: false,
    });
  }
}

/**
 * Java-specific implementation of the SDK injector.
 * Handles Java agent configuration and environment setup.
 */
export class JavaInjector extends Injector {
  get command(): string[] {
    return ['cp', '/javaagent.jar', `${this.containerPath}/javaagent.jar`];
  }

  get containerPath(): string {
    return '/otel-auto-instrumentation';
  }

  protected injectAdditionalEnvironments(envsToInject: { [key: string]: string }, _envsFromTaskDef: { [key: string]: string }): void {
    envsToInject[constants.JavaInstrumentation.JAVA_TOOL_OPTIONS] = ` -javaagent:${this.containerPath}/javaagent.jar`;
  }

  protected overrideAdditionalEnvironments(_envsToOverride: { [key: string]: string }, _overrideEnvironments: { [key: string]: string }): void {
    // No additional overrides needed for Java
  }
}

/**
 * Python-specific implementation of the SDK injector.
 * Handles Python auto-instrumentation setup and PYTHONPATH configuration.
 */
export class PythonInjector extends Injector {
  protected static readonly PYTHON_ENVS: EnvironmentExtension[] = [
    {
      name: constants.PythonInstrumentation.OTEL_PYTHON_DISTRO,
      value: constants.PythonInstrumentation.OTEL_PYTHON_DISTRO_AWS_DISTRO,
    },
    {
      name: constants.PythonInstrumentation.OTEL_PYTHON_CONFIGURATOR,
      value: constants.PythonInstrumentation.OTEL_PYTHON_CONFIGURATOR_AWS_CONFIGURATOR,
    },
  ];
  get command(): string[] {
    return ['cp', '-a', '/autoinstrumentation/.', this.containerPath];
  }

  protected injectAdditionalEnvironments(envsToInject: { [key: string]: string }, _envsFromTaskDef: { [key: string]: string }): void {
    for (const env of PythonInjector.PYTHON_ENVS) {
      envsToInject[env.name] = env.value;
    }
    envsToInject[constants.PythonInstrumentation.PYTHONPATH] = `${this.containerPath}/opentelemetry/instrumentation/auto_instrumentation:${this.containerPath}`;
  }

  get containerPath(): string {
    return '/otel-auto-instrumentation-python';
  }

  protected overrideAdditionalEnvironments(envsToOverride: { [key: string]: string }, envsFromTaskDef: { [key: string]: string }): void {
    if (envsFromTaskDef[constants.PythonInstrumentation.PYTHONPATH]) {
      const pythonPath = envsFromTaskDef[constants.PythonInstrumentation.PYTHONPATH];
      envsToOverride[constants.PythonInstrumentation.PYTHONPATH] = `${this.containerPath}/opentelemetry/instrumentation/auto_instrumentation:${pythonPath}:${this.containerPath}`;
    }
  }
}

/**
 * Base class for .NET SDK injectors.
 * Contains common .NET configuration settings used by both Windows and Linux implementations.
 */
export abstract class DotNetInjector extends Injector {
  protected static readonly DOTNET_COMMON_ENVS: EnvironmentExtension[] = [
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
}

/**
 * Linux-specific implementation of the .NET SDK injector.
 * Handles CoreCLR profiler setup and paths for Linux environments.
 */
export class DotNetLinuxInjector extends DotNetInjector {
  protected static readonly DOTNET_LINUX_ENVS: EnvironmentExtension[] = [
    {
      name: constants.DotnetInstrumentation.CORECLR_ENABLE_PROFILING,
      value: constants.DotnetInstrumentation.CORECLR_ENABLE_PROFILING_ENABLED,
    },
    {
      name: constants.DotnetInstrumentation.CORECLR_PROFILER,
      value: constants.DotnetInstrumentation.CORECLR_PROFILER_OTEL,
    },
  ];

  private cpuArch: ecs.CpuArchitecture;

  constructor(
    sharedVolumeName: string,
    instrumentationVersion: inst.InstrumentationVersion,
    cpuArch: ecs.CpuArchitecture,
    overrideEnvironments?: EnvironmentExtension[]) {
    super(sharedVolumeName, instrumentationVersion, overrideEnvironments);
    this.cpuArch = cpuArch;
  }

  get command(): string[] {
    return ['cp', '-a', '/autoinstrumentation/.', this.containerPath];
  }

  protected injectAdditionalEnvironments(envsToInject: { [key: string]: string }, envsFromTaskDef: { [key: string]: string }): void {
    if (envsFromTaskDef[constants.DotnetInstrumentation.OTEL_DOTNET_AUTO_HOME]) {
      // If OTEL_DOTNET_AUTO_HOME env var is already set, we will assume that .NET Auto-instrumentation is already configured.
      return;
    }

    for (const env of DotNetInjector.DOTNET_COMMON_ENVS) {
      envsToInject[env.name] = env.value;
    }
    for (const env of DotNetLinuxInjector.DOTNET_LINUX_ENVS) {
      envsToInject[env.name] = env.value;
    }

    envsToInject[constants.DotnetInstrumentation.CORECLR_PROFILER_PATH] = this.getCoreCLRProfilerPath();
    envsToInject[constants.DotnetInstrumentation.DOTNET_STARTUP_HOOKS] = `${this.containerPath}/net/OpenTelemetry.AutoInstrumentation.StartupHook.dll`;
    envsToInject[constants.DotnetInstrumentation.DOTNET_ADDITIONAL_DEPS] = `${this.containerPath}/AdditionalDeps`;
    envsToInject[constants.DotnetInstrumentation.OTEL_DOTNET_AUTO_HOME] = `${this.containerPath}`;
    envsToInject[constants.DotnetInstrumentation.DOTNET_SHARED_STORE] = `${this.containerPath}/store`;
  }

  get containerPath(): string {
    return '/otel-auto-instrumentation-dotnet';
  }

  protected overrideAdditionalEnvironments(_envsToOverride: { [key: string]: string }, _envsFromTaskDef: { [key: string]: string }): void {
    // No additional overrides needed for .NET on Linux
  }

  private getCoreCLRProfilerPath() {
    const subPath = this.cpuArch == ecs.CpuArchitecture.ARM64 ? 'linux-arm64': 'linux-x64';
    return `${this.containerPath}/${subPath}/OpenTelemetry.AutoInstrumentation.Native.so`;
  }
}

/**
 * Windows-specific implementation of the .NET SDK injector.
 * Handles CoreCLR profiler setup and paths for Windows environments.
 */
export class DotNetWindowsInjector extends DotNetInjector {
  protected static readonly DOTNET_WINDOWS_ENVS: EnvironmentExtension[] = [
    {
      name: constants.DotnetInstrumentation.CORECLR_ENABLE_PROFILING,
      value: constants.DotnetInstrumentation.CORECLR_ENABLE_PROFILING_ENABLED,
    },
    {
      name: constants.DotnetInstrumentation.CORECLR_PROFILER,
      value: constants.DotnetInstrumentation.CORECLR_PROFILER_OTEL,
    },
  ];

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

  protected injectAdditionalEnvironments(envsToInject: { [key: string]: string }, envsFromTaskDef: { [key: string]: string }): void {
    if (envsFromTaskDef[constants.DotnetInstrumentation.OTEL_DOTNET_AUTO_HOME]) {
      // If OTEL_DOTNET_AUTO_HOME env var is already set, we will assume that .NET Auto-instrumentation is already configured.
      return;
    }
    for (const env of DotNetInjector.DOTNET_COMMON_ENVS) {
      envsToInject[env.name] = env.value;
    }
    for (const env of DotNetWindowsInjector.DOTNET_WINDOWS_ENVS) {
      envsToInject[env.name] = env.value;
    }
    envsToInject[constants.DotnetInstrumentation.CORECLR_PROFILER_PATH] = `${this.containerPath}\\win-x64\\OpenTelemetry.AutoInstrumentation.Native.dll`;
    envsToInject[constants.DotnetInstrumentation.DOTNET_STARTUP_HOOKS] = `${this.containerPath}\\net\\OpenTelemetry.AutoInstrumentation.StartupHook.dll`;
    envsToInject[constants.DotnetInstrumentation.DOTNET_ADDITIONAL_DEPS] = `${this.containerPath}\\AdditionalDeps`;
    envsToInject[constants.DotnetInstrumentation.OTEL_DOTNET_AUTO_HOME] = `${this.containerPath}`;
    envsToInject[constants.DotnetInstrumentation.DOTNET_SHARED_STORE] = `${this.containerPath}\\store`;
  }

  get containerPath(): string {
    return 'C:\\otel-auto-instrumentation-dotnet';
  }

  protected overrideAdditionalEnvironments(_envsToOverride: { [key: string]: string }, _envsFromTaskDef: { [key: string]: string }): void {
    // No additional overrides needed for .NET on Windows
  }
}

/**
 * Node.js-specific implementation of the SDK injector.
 * Handles Node.js auto-instrumentation setup and NODE_OPTIONS configuration.
 */
export class NodeInjector extends Injector {
  get command(): string[] {
    return ['cp', '-a', '/autoinstrumentation/.', this.containerPath];
  }

  protected injectAdditionalEnvironments(envsToInject: { [key: string]: string }, _envsFromTaskDef: { [key: string]: string }): void {
    envsToInject[constants.NodeInstrumentation.NODE_OPTIONS] = ` --require ${this.containerPath}/autoinstrumentation.js`;
  }

  get containerPath(): string {
    return '/otel-auto-instrumentation-nodejs';
  }

  protected overrideAdditionalEnvironments(envsToOverride: { [key: string]: string }, envsFromTaskDef: { [key: string]: string }): void {
    if (envsFromTaskDef[constants.NodeInstrumentation.NODE_OPTIONS]) {
      const originalNodeOptions = envsFromTaskDef[constants.NodeInstrumentation.NODE_OPTIONS] ?? '';
      let renderedNodeOptions = `${originalNodeOptions} --require ${this.containerPath}/autoinstrumentation.js`;
      envsToOverride[constants.NodeInstrumentation.NODE_OPTIONS] = renderedNodeOptions;
    }
  }
}
