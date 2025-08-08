/**
 * Common OpenTelemetry exporter configurations and AWS Application Signals settings.
 * Contains constants for OTLP protocol, resource attributes, and Application Signals enablement.
 */
export class CommonExporting {
  /** Protocol configuration for OpenTelemetry OTLP exporter */
  public static readonly OTEL_EXPORTER_OTLP_PROTOCOL = 'OTEL_EXPORTER_OTLP_PROTOCOL';
  /** HTTP/Protobuf protocol setting for OTLP exporter */
  public static readonly OTEL_EXPORTER_OTLP_PROTOCOL_HTTP_PROTOBUF = 'http/protobuf';
  /** Resource attribute configuration for service.name */
  public static readonly OTEL_SERVICE_NAME = 'OTEL_SERVICE_NAME';
  /** Resource attributes configuration for OpenTelemetry */
  public static readonly OTEL_RESOURCE_ATTRIBUTES = 'OTEL_RESOURCE_ATTRIBUTES';

  /** Flag to enable/disable AWS Application Signals */
  public static readonly OTEL_AWS_APPLICATION_SIGNALS = 'OTEL_AWS_APPLICATION_SIGNALS_ENABLED';
  /** Value to enable AWS Application Signals */
  public static readonly OTEL_AWS_APPLICATION_SIGNALS_ENABLED = 'true';
  /** Value to disable AWS Application Signals */
  public static readonly OTEL_AWS_APPLICATION_SIGNALS_DISABLED = 'false';
  /** Runtime configuration for AWS Application Signals */
  public static readonly OTEL_AWS_APPLICATION_SIGNALS_RUNTIME = 'OTEL_AWS_APPLICATION_SIGNALS_RUNTIME_ENABLED';
  /** Value to enable AWS Application Signals runtime */
  public static readonly OTEL_AWS_APPLICATION_SIGNALS_RUNTIME_ENABLED = 'true';
  /** Value to disable AWS Application Signals runtime */
  public static readonly OTEL_AWS_APPLICATION_SIGNALS_RUNTIME_DISABLED = 'false';

  /** Endpoint configuration for AWS Application Signals exporter */
  public static readonly OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT = 'OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT';
  /** Local CloudWatch Agent endpoint for metrics */
  public static readonly OTEL_AWS_APPLICATION_SIGNALS_EXPORTER_ENDPOINT_LOCAL_CWA = 'http://localhost:4316/v1/metrics';
}

/**
 * OpenTelemetry logs exporter configurations.
 * Contains constants for configuring log export behavior.
 */
export class LogsExporting {
  /** Configuration for OpenTelemetry logs exporter */
  public static readonly OTEL_LOGS_EXPORTER = 'OTEL_LOGS_EXPORTER';
  /** Disable logs export */
  public static readonly OTEL_LOGS_EXPORTER_NONE = 'none';
  /** Enable OTLP logs export */
  public static readonly OTEL_LOGS_EXPORTER_OTLP = 'otlp';
}

/**
 * OpenTelemetry metrics exporter configurations.
 * Contains constants for configuring metrics export behavior.
 */
export class MetricsExporting {
  /** Configuration for OpenTelemetry metrics exporter */
  public static readonly OTEL_METRICS_EXPORTER = 'OTEL_METRICS_EXPORTER';
  /** Disable metrics export */
  public static readonly OTEL_METRICS_EXPORTER_NONE = 'none';
  /** Enable OTLP metrics export */
  public static readonly OTEL_METRICS_EXPORTER_OTLP = 'otlp';
}

/**
 * OpenTelemetry trace exporter and sampling configurations.
 * Contains constants for trace endpoints, sampling strategies, and propagation formats.
 */
export class TraceExporting {
  /** Endpoint configuration for OTLP traces */
  public static readonly OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = 'OTEL_EXPORTER_OTLP_TRACES_ENDPOINT';
  /** Local CloudWatch Agent endpoint for traces */
  public static readonly OTEL_EXPORTER_OTLP_TRACES_ENDPOINT_LOCAL_CWA = 'http://localhost:4316/v1/traces';

  /** Sampling configuration for traces */
  public static readonly OTEL_TRACES_SAMPLER = 'OTEL_TRACES_SAMPLER';
  /** X-Ray sampling strategy */
  public static readonly OTEL_TRACES_SAMPLER_XRAY = 'xray';
  /** Trace ID ratio based sampling */
  public static readonly OTEL_TRACES_SAMPLER_TRACEID_RATIO = 'traceidratio';
  /** Sample all traces */
  public static readonly OTEL_TRACES_SAMPLER_ALWAYS_ON = 'always_on';
  /** Sample no traces */
  public static readonly OTEL_TRACES_SAMPLER_ALWAYS_OFF = 'always_off';
  /** Parent-based trace ID ratio sampling */
  public static readonly OTEL_TRACES_SAMPLER_PARENT_BASED_TRACEID_RATIO = 'parentbased_traceidratio';
  /** Parent-based always on sampling */
  public static readonly OTEL_TRACES_SAMPLER_PARENT_BASED_ALWAYS_ON = 'parentbased_always_on';
  /** Parent-based always off sampling */
  public static readonly OTEL_TRACES_SAMPLER_PARENT_BASED_ALWAYS_OFF = 'parentbased_always_off';

  /** Arguments for trace sampler configuration */
  public static readonly OTEL_TRACES_SAMPLER_ARG = 'OTEL_TRACES_SAMPLER_ARG';
  /** Local CloudWatch Agent endpoint for sampler */
  public static readonly OTEL_TRACES_SAMPLER_ARG_LOCAL_CWA = 'endpoint=http://localhost:2000';

  /** Configuration for trace context propagation */
  public static readonly OTEL_PROPAGATORS = 'OTEL_PROPAGATORS';
  /** Supported propagation formats for Application Signals */
  public static readonly OTEL_PROPAGATORS_APPLICATION_SIGNALS = 'tracecontext,baggage,b3,xray';
}

/**
 * Java-specific OpenTelemetry instrumentation configurations.
 * Contains constants for Java agent setup and tool options.
 */
export class JavaInstrumentation {
  /** Java tool options environment variable */
  public static readonly JAVA_TOOL_OPTIONS = 'JAVA_TOOL_OPTIONS';
}

/**
 * Python-specific OpenTelemetry instrumentation configurations.
 * Contains constants for Python distribution, configurator, and path settings.
 */
export class PythonInstrumentation {
  /** Python OpenTelemetry distribution configuration */
  public static readonly OTEL_PYTHON_DISTRO = 'OTEL_PYTHON_DISTRO';
  /** AWS distribution for Python OpenTelemetry */
  public static readonly OTEL_PYTHON_DISTRO_AWS_DISTRO = 'aws_distro';

  /** Python OpenTelemetry configurator setting */
  public static readonly OTEL_PYTHON_CONFIGURATOR = 'OTEL_PYTHON_CONFIGURATOR';
  /** AWS configurator for Python OpenTelemetry */
  public static readonly OTEL_PYTHON_CONFIGURATOR_AWS_CONFIGURATOR = 'aws_configurator';
  /** Python path environment variable */
  public static readonly PYTHONPATH = 'PYTHONPATH';
}

/**
 * .NET-specific OpenTelemetry instrumentation configurations.
 * Contains constants for .NET runtime settings, profiler configurations, and paths
 * for both Linux and Windows environments.
 */
export class DotnetInstrumentation {
  /** .NET OpenTelemetry distribution configuration */
  public static readonly OTEL_DOTNET_DISTRO = 'OTEL_DOTNET_DISTRO';
  /** AWS distribution for .NET OpenTelemetry */
  public static readonly OTEL_DOTNET_DISTRO_AWS_DISTRO = 'aws_distro';
  /** .NET OpenTelemetry configurator setting */
  public static readonly OTEL_DOTNET_CONFIGURATOR = 'OTEL_DOTNET_CONFIGURATOR';
  /** AWS configurator for .NET OpenTelemetry */
  public static readonly OTEL_DOTNET_CONFIGURATOR_AWS_CONFIGURATOR = 'aws_configurator';
  /** .NET auto-instrumentation plugins configuration */
  public static readonly OTEL_DOTNET_AUTO_PLUGINS = 'OTEL_DOTNET_AUTO_PLUGINS';
  /** ADOT auto-instrumentation plugin for .NET */
  public static readonly OTEL_DOTNET_AUTO_PLUGINS_ADOT = 'AWS.Distro.OpenTelemetry.AutoInstrumentation.Plugin, AWS.Distro.OpenTelemetry.AutoInstrumentation';
  /** CoreCLR profiling enable flag */
  public static readonly CORECLR_ENABLE_PROFILING = 'CORECLR_ENABLE_PROFILING';
  /** Enable CoreCLR profiling */
  public static readonly CORECLR_ENABLE_PROFILING_ENABLED = '1';
  /** Disable CoreCLR profiling */
  public static readonly CORECLR_ENABLE_PROFILING_DISABLED = '0';
  /** CoreCLR profiler GUID */
  public static readonly CORECLR_PROFILER = 'CORECLR_PROFILER';
  /** OpenTelemetry CoreCLR profiler ID */
  public static readonly CORECLR_PROFILER_OTEL = '{918728DD-259F-4A6A-AC2B-B85E1B658318}';
  /** Path to CoreCLR profiler */
  public static readonly CORECLR_PROFILER_PATH = 'CORECLR_PROFILER_PATH';
  /** .NET startup hooks configuration */
  public static readonly DOTNET_STARTUP_HOOKS = 'DOTNET_STARTUP_HOOKS';
  /** Additional .NET dependencies configuration */
  public static readonly DOTNET_ADDITIONAL_DEPS = 'DOTNET_ADDITIONAL_DEPS';

  /** .NET auto-instrumentation home directory */
  public static readonly OTEL_DOTNET_AUTO_HOME = 'OTEL_DOTNET_AUTO_HOME';

  /** .NET shared store configuration */
  public static readonly DOTNET_SHARED_STORE = 'DOTNET_SHARED_STORE';
}

/**
 * Node-specific OpenTelemetry instrumentation configurations.
 * Contains constants for Node.js runtime settings and options.
 */
export class NodeInstrumentation {
  /** Node.js options environment variable */
  public static readonly NODE_OPTIONS = 'NODE_OPTIONS';
}
