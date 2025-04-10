/**
 * Base class for instrumentation versions.
 * Provides functionality to generate image URIs for different instrumentation types.
 */
export abstract class InstrumentationVersion {
  public constructor(protected readonly imageRepo: string, protected readonly version: string, protected readonly memoryLimit: number) { }

  /**
   * Get the image URI for the instrumentation version.
   * @returns The image URI.
   */
  public imageURI(): string {
    return `${this.imageRepo}:${this.version}`;
  }

  /**
   * Get the memory limit in MiB for the instrumentation version.
   * @returns The memory limit
   */
  public memoryLimitMiB(): number {
    return this.memoryLimit;
  }
}

/**
 * Available versions for Java instrumentation.
 */
export class JavaInstrumentationVersion extends InstrumentationVersion {
  /**
   * The image repository for Java instrumentation.
   */
  public static readonly IMAGE_REPO = 'public.ecr.aws/aws-observability/adot-autoinstrumentation-java';

  /**
   * The default memory limit of the Java instrumentation.
   */
  public static readonly DEFAULT_MEMORY_LIMIT_MIB = 64;
  /**
   * ADOT Java Instrumentation version 1.33.0
   */
  public static readonly V1_33_0 = new JavaInstrumentationVersion(JavaInstrumentationVersion.IMAGE_REPO, 'v1.33.0', JavaInstrumentationVersion.DEFAULT_MEMORY_LIMIT_MIB);
  /**
   * ADOT Java Instrumentation version 1.32.6
   */
  public static readonly V1_32_6 = new JavaInstrumentationVersion(JavaInstrumentationVersion.IMAGE_REPO, 'v1.32.6', JavaInstrumentationVersion.DEFAULT_MEMORY_LIMIT_MIB);
}

/**
 * Available versions for .NET instrumentation.
 */
/**
 * Available versions for Python instrumentation.
 */
export class PythonInstrumentationVersion extends InstrumentationVersion {
  /**
   * The image repository for Python instrumentation.
   */
  public static readonly IMAGE_REPO = 'public.ecr.aws/aws-observability/adot-autoinstrumentation-python';

  /**
   * The default memory limit of the Python instrumentation.
   */
  public static readonly DEFAULT_MEMORY_LIMIT_MIB = 32;

  /**
   * ADOT Python Instrumentation version 0.8.0
   */
  public static readonly V0_8_0 = new PythonInstrumentationVersion(PythonInstrumentationVersion.IMAGE_REPO, 'v0.8.0', PythonInstrumentationVersion.DEFAULT_MEMORY_LIMIT_MIB);
}

/**
 * Available versions for .NET instrumentation.
 */
export class DotnetInstrumentationVersion extends InstrumentationVersion {
  /**
   * The image repository for .NET instrumentation.
   */
  public static readonly IMAGE_REPO = 'public.ecr.aws/aws-observability/adot-autoinstrumentation-dotnet';

  /**
   * The default memory limit of the .NET instrumentation.
   */
  public static readonly DEFAULT_MEMORY_LIMIT_MIB = 128;
  /**
   * ADOT .NET Instrumentation version 1.6.0
   */
  public static readonly V1_6_0 = new DotnetInstrumentationVersion(DotnetInstrumentationVersion.IMAGE_REPO, 'v1.6.0', DotnetInstrumentationVersion.DEFAULT_MEMORY_LIMIT_MIB);
  /**
   * ADOT .NET Instrumentation version 1.6.0 for ARM64
   */
  public static readonly V1_6_0_ARM64 = new DotnetInstrumentationVersion(DotnetInstrumentationVersion.IMAGE_REPO, 'v1.6.0-arm64', DotnetInstrumentationVersion.DEFAULT_MEMORY_LIMIT_MIB);
  /**
   * ADOT .NET Instrumentation version 1.6.0 for AMD64
   */
  public static readonly V1_6_0_AMD64 = new DotnetInstrumentationVersion(DotnetInstrumentationVersion.IMAGE_REPO, 'v1.6.0-amd64', DotnetInstrumentationVersion.DEFAULT_MEMORY_LIMIT_MIB);
  /**
   * ADOT .NET Instrumentation version 1.6.0 for Windows 2022
   */
  public static readonly V1_6_0_WINDOWS2022 = new DotnetInstrumentationVersion(DotnetInstrumentationVersion.IMAGE_REPO, 'v1.6.0-windows2022', DotnetInstrumentationVersion.DEFAULT_MEMORY_LIMIT_MIB);
  /**
   * ADOT .NET Instrumentation version 1.6.0 for Windows 2019
   */
  public static readonly V1_6_0_WINDOWS2019 = new DotnetInstrumentationVersion(DotnetInstrumentationVersion.IMAGE_REPO, 'v1.6.0-windows2019', DotnetInstrumentationVersion.DEFAULT_MEMORY_LIMIT_MIB);
}

/**
 * Available versions for Node.js instrumentation.
 */
export class NodeInstrumentationVersion extends InstrumentationVersion {
  /**
   * The image repository for Node.js instrumentation.
   */
  public static readonly IMAGE_REPO = 'public.ecr.aws/aws-observability/adot-autoinstrumentation-node';

  /**
   * The default memory limit of the Node.js instrumentation.
   */
  public static readonly DEFAULT_MEMORY_LIMIT_MIB = 128;
  /**
   * ADOT Node.js Instrumentation version 0.5.0
   */
  public static readonly V0_5_0 = new NodeInstrumentationVersion(NodeInstrumentationVersion.IMAGE_REPO, 'v0.5.0', NodeInstrumentationVersion.DEFAULT_MEMORY_LIMIT_MIB);
}
