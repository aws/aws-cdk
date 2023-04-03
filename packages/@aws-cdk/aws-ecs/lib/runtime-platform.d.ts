/**
 * The CpuArchitecture for Fargate Runtime Platform.
 */
export declare class CpuArchitecture {
    readonly _cpuArchitecture: string;
    /**
     * ARM64
     */
    static readonly ARM64: CpuArchitecture;
    /**
     * X86_64
     */
    static readonly X86_64: CpuArchitecture;
    /**
     * Other cpu architecture.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-runtimeplatform.html#cfn-ecs-taskdefinition-runtimeplatform-cpuarchitecture for all available cpu architecture.
     *
     * @param cpuArchitecture cpu architecture.
     *
     */
    static of(cpuArchitecture: string): CpuArchitecture;
    /**
     *
     * @param _cpuArchitecture The CPU architecture.
     */
    private constructor();
}
/**
 * The operating system for Fargate Runtime Platform.
 */
export declare class OperatingSystemFamily {
    readonly _operatingSystemFamily: string;
    /**
     * LINUX
     */
    static readonly LINUX: OperatingSystemFamily;
    /**
     * WINDOWS_SERVER_2004_CORE
     */
    static readonly WINDOWS_SERVER_2004_CORE: OperatingSystemFamily;
    /**
     * WINDOWS_SERVER_2016_FULL
     */
    static readonly WINDOWS_SERVER_2016_FULL: OperatingSystemFamily;
    /**
     * WINDOWS_SERVER_2019_CORE
     */
    static readonly WINDOWS_SERVER_2019_CORE: OperatingSystemFamily;
    /**
     * WINDOWS_SERVER_2019_FULL
     */
    static readonly WINDOWS_SERVER_2019_FULL: OperatingSystemFamily;
    /**
     * WINDOWS_SERVER_2022_CORE
     */
    static readonly WINDOWS_SERVER_2022_CORE: OperatingSystemFamily;
    /**
     * WINDOWS_SERVER_2022_FULL
     */
    static readonly WINDOWS_SERVER_2022_FULL: OperatingSystemFamily;
    /**
     * WINDOWS_SERVER_20H2_CORE
     */
    static readonly WINDOWS_SERVER_20H2_CORE: OperatingSystemFamily;
    /**
     * Other operating system family.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-runtimeplatform.html#cfn-ecs-taskdefinition-runtimeplatform-operatingsystemfamily for all available operating system family.
     *
     * @param family operating system family.
     *
     */
    static of(family: string): OperatingSystemFamily;
    /**
     *
     * @param _operatingSystemFamily The operating system family.
     */
    private constructor();
}
/**
 * The interface for Runtime Platform.
 */
export interface RuntimePlatform {
    /**
     * The CpuArchitecture for Fargate Runtime Platform.
     *
     * @default - Undefined.
     */
    readonly cpuArchitecture?: CpuArchitecture;
    /**
     * The operating system for Fargate Runtime Platform.
     *
     * @default - Undefined.
     */
    readonly operatingSystemFamily?: OperatingSystemFamily;
}
