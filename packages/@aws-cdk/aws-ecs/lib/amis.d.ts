import * as ec2 from '@aws-cdk/aws-ec2';
import { Construct } from 'constructs';
/**
 * The ECS-optimized AMI variant to use. For more information, see
 * [Amazon ECS-optimized AMIs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html).
 */
export declare enum AmiHardwareType {
    /**
     * Use the standard Amazon ECS-optimized AMI.
     */
    STANDARD = "Standard",
    /**
     * Use the Amazon ECS GPU-optimized AMI.
     */
    GPU = "GPU",
    /**
     * Use the Amazon ECS-optimized Amazon Linux 2 (arm64) AMI.
     */
    ARM = "ARM64"
}
/**
 * ECS-optimized Windows version list
 */
export declare enum WindowsOptimizedVersion {
    SERVER_2019 = "2019",
    SERVER_2016 = "2016"
}
/**
 * The properties that define which ECS-optimized AMI is used.
 *
 * @deprecated see `EcsOptimizedImage`
 */
export interface EcsOptimizedAmiProps {
    /**
     * The Amazon Linux generation to use.
     *
     * @default AmazonLinuxGeneration.AmazonLinux2
     */
    readonly generation?: ec2.AmazonLinuxGeneration;
    /**
     * The Windows Server version to use.
     *
     * @default none, uses Linux generation
     */
    readonly windowsVersion?: WindowsOptimizedVersion;
    /**
     * The ECS-optimized AMI variant to use.
     *
     * @default AmiHardwareType.Standard
     */
    readonly hardwareType?: AmiHardwareType;
    /**
     * Whether the AMI ID is cached to be stable between deployments
     *
     * By default, the newest image is used on each deployment. This will cause
     * instances to be replaced whenever a new version is released, and may cause
     * downtime if there aren't enough running instances in the AutoScalingGroup
     * to reschedule the tasks on.
     *
     * If set to true, the AMI ID will be cached in `cdk.context.json` and the
     * same value will be used on future runs. Your instances will not be replaced
     * but your AMI version will grow old over time. To refresh the AMI lookup,
     * you will have to evict the value from the cache using the `cdk context`
     * command. See https://docs.aws.amazon.com/cdk/latest/guide/context.html for
     * more information.
     *
     * Can not be set to `true` in environment-agnostic stacks.
     *
     * @default false
     */
    readonly cachedInContext?: boolean;
}
/**
 * Construct a Linux or Windows machine image from the latest ECS Optimized AMI published in SSM
 *
 * @deprecated see `EcsOptimizedImage#amazonLinux`, `EcsOptimizedImage#amazonLinux` and `EcsOptimizedImage#windows`
 */
export declare class EcsOptimizedAmi implements ec2.IMachineImage {
    private readonly generation?;
    private readonly windowsVersion?;
    private readonly hwType;
    private readonly amiParameterName;
    private readonly cachedInContext;
    /**
     * Constructs a new instance of the EcsOptimizedAmi class.
     */
    constructor(props?: EcsOptimizedAmiProps);
    /**
     * Return the correct image
     */
    getImage(scope: Construct): ec2.MachineImageConfig;
}
/**
 * Additional configuration properties for EcsOptimizedImage factory functions
 */
export interface EcsOptimizedImageOptions {
    /**
     * Whether the AMI ID is cached to be stable between deployments
     *
     * By default, the newest image is used on each deployment. This will cause
     * instances to be replaced whenever a new version is released, and may cause
     * downtime if there aren't enough running instances in the AutoScalingGroup
     * to reschedule the tasks on.
     *
     * If set to true, the AMI ID will be cached in `cdk.context.json` and the
     * same value will be used on future runs. Your instances will not be replaced
     * but your AMI version will grow old over time. To refresh the AMI lookup,
     * you will have to evict the value from the cache using the `cdk context`
     * command. See https://docs.aws.amazon.com/cdk/latest/guide/context.html for
     * more information.
     *
     * Can not be set to `true` in environment-agnostic stacks.
     *
     * @default false
     */
    readonly cachedInContext?: boolean;
}
/**
 * Construct a Linux or Windows machine image from the latest ECS Optimized AMI published in SSM
 */
export declare class EcsOptimizedImage implements ec2.IMachineImage {
    /**
     * Construct an Amazon Linux 2 image from the latest ECS Optimized AMI published in SSM
     *
     * @param hardwareType ECS-optimized AMI variant to use
     */
    static amazonLinux2(hardwareType?: AmiHardwareType, options?: EcsOptimizedImageOptions): EcsOptimizedImage;
    /**
     * Construct an Amazon Linux AMI image from the latest ECS Optimized AMI published in SSM
     */
    static amazonLinux(options?: EcsOptimizedImageOptions): EcsOptimizedImage;
    /**
     * Construct a Windows image from the latest ECS Optimized AMI published in SSM
     *
     * @param windowsVersion Windows Version to use
     */
    static windows(windowsVersion: WindowsOptimizedVersion, options?: EcsOptimizedImageOptions): EcsOptimizedImage;
    private readonly generation?;
    private readonly windowsVersion?;
    private readonly hwType?;
    private readonly amiParameterName;
    private readonly cachedInContext;
    /**
     * Constructs a new instance of the EcsOptimizedAmi class.
     */
    private constructor();
    /**
     * Return the correct image
     */
    getImage(scope: Construct): ec2.MachineImageConfig;
}
/**
 * Amazon ECS variant
 */
export declare enum BottlerocketEcsVariant {
    /**
     * aws-ecs-1 variant
     */
    AWS_ECS_1 = "aws-ecs-1"
}
/**
 * Properties for BottleRocketImage
 */
export interface BottleRocketImageProps {
    /**
     * The Amazon ECS variant to use.
     * Only `aws-ecs-1` is currently available
     *
     * @default - BottlerocketEcsVariant.AWS_ECS_1
     */
    readonly variant?: BottlerocketEcsVariant;
    /**
     * The CPU architecture
     *
     * @default - x86_64
     */
    readonly architecture?: ec2.InstanceArchitecture;
    /**
     * Whether the AMI ID is cached to be stable between deployments
     *
     * By default, the newest image is used on each deployment. This will cause
     * instances to be replaced whenever a new version is released, and may cause
     * downtime if there aren't enough running instances in the AutoScalingGroup
     * to reschedule the tasks on.
     *
     * If set to true, the AMI ID will be cached in `cdk.context.json` and the
     * same value will be used on future runs. Your instances will not be replaced
     * but your AMI version will grow old over time. To refresh the AMI lookup,
     * you will have to evict the value from the cache using the `cdk context`
     * command. See https://docs.aws.amazon.com/cdk/latest/guide/context.html for
     * more information.
     *
     * Can not be set to `true` in environment-agnostic stacks.
     *
     * @default false
     */
    readonly cachedInContext?: boolean;
}
/**
 * Construct an Bottlerocket image from the latest AMI published in SSM
 */
export declare class BottleRocketImage implements ec2.IMachineImage {
    private readonly amiParameterName;
    /**
     * Amazon ECS variant for Bottlerocket AMI
     */
    private readonly variant;
    /**
     * Instance architecture
     */
    private readonly architecture;
    private readonly cachedInContext;
    /**
     * Constructs a new instance of the BottleRocketImage class.
     */
    constructor(props?: BottleRocketImageProps);
    /**
     * Return the correct image
     */
    getImage(scope: Construct): ec2.MachineImageConfig;
}
