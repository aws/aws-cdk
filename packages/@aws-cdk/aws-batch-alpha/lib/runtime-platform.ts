/**
 * The CpuArchitecture for Runtime Platform.
 */
export class CpuArchitecture {
  /**
  * ARM64
  * */
  public static readonly ARM64 = CpuArchitecture.of('ARM64');

  /**
   * X86_64
  */
  public static readonly X86_64 = CpuArchitecture.of('X86_64');

  /**
   * Other cpu architecture.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-runtimeplatform.html#cfn-ecs-taskdefinition-runtimeplatform-cpuarchitecture for all available cpu architecture.
   *
   * @param cpuArchitecture cpu architecture.
   *
  */
  public static of(cpuArchitecture: string) { return new CpuArchitecture(cpuArchitecture); }

  /**
   *
   * @param _cpuArchitecture The CPU architecture.
   */
  private constructor(public readonly _cpuArchitecture: string) { }
}

/**
 * The operating system for Fargate Runtime Platform.
 */
export class OperatingSystemFamily {
  /*
   * Other operating system family.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-runtimeplatform.html#cfn-ecs-taskdefinition-runtimeplatform-operatingsystemfamily for all available operating system family.
   *
   * @param family operating system family.
   *
   */
  public static of(family: string) { return new OperatingSystemFamily(family); }

  /**
   *
   * @param _operatingSystemFamily The operating system family.
   */
  private constructor(public readonly _operatingSystemFamily: string) { }
}

/**
 * The interface for Runtime Platform.
 */
export interface RuntimePlatform {
/**
 * The CpuArchitecture for Fargate Runtime Platform
 *
 * @default - Undefined.
 */
  readonly cpuArchitecture?: CpuArchitecture,

  /**
   * The operating system for Fargate Runtime Platform.
   *
   * @default - Undefined.
   */
  readonly operatingSystemFamily?: OperatingSystemFamily,
}