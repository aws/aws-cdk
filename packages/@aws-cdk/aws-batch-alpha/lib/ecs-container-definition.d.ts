import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IFileSystem } from 'aws-cdk-lib/aws-efs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Size } from 'aws-cdk-lib/core';
import { Construct, IConstruct } from 'constructs';
import { CfnJobDefinition } from 'aws-cdk-lib/aws-batch';
import { LinuxParameters } from './linux-parameters';
/**
 * Specify the secret's version id or version stage
 */
export interface SecretVersionInfo {
    /**
     * version id of the secret
     *
     * @default - use default version id
     */
    readonly versionId?: string;
    /**
     * version stage of the secret
     *
     * @default - use default version stage
     */
    readonly versionStage?: string;
}
/**
 * A secret environment variable.
 */
export declare abstract class Secret {
    /**
     * Creates an environment variable value from a parameter stored in AWS
     * Systems Manager Parameter Store.
     */
    static fromSsmParameter(parameter: ssm.IParameter): Secret;
    /**
     * Creates a environment variable value from a secret stored in AWS Secrets
     * Manager.
     *
     * @param secret the secret stored in AWS Secrets Manager
     * @param field the name of the field with the value that you want to set as
     * the environment variable value. Only values in JSON format are supported.
     * If you do not specify a JSON field, then the full content of the secret is
     * used.
     */
    static fromSecretsManager(secret: secretsmanager.ISecret, field?: string): Secret;
    /**
     * Creates a environment variable value from a secret stored in AWS Secrets
     * Manager.
     *
     * @param secret the secret stored in AWS Secrets Manager
     * @param versionInfo the version information to reference the secret
     * @param field the name of the field with the value that you want to set as
     * the environment variable value. Only values in JSON format are supported.
     * If you do not specify a JSON field, then the full content of the secret is
     * used.
     */
    static fromSecretsManagerVersion(secret: secretsmanager.ISecret, versionInfo: SecretVersionInfo, field?: string): Secret;
    /**
     * The ARN of the secret
     */
    abstract readonly arn: string;
    /**
     * Whether this secret uses a specific JSON field
     */
    abstract readonly hasField?: boolean;
    /**
     * Grants reading the secret to a principal
     */
    abstract grantRead(grantee: iam.IGrantable): iam.Grant;
}
/**
 * Options to configure an EcsVolume
 */
export interface EcsVolumeOptions {
    /**
     * the name of this volume
     */
    readonly name: string;
    /**
     * the path on the container where this volume is mounted
     */
    readonly containerPath: string;
    /**
     * if set, the container will have readonly access to the volume
     *
     * @default false
     */
    readonly readonly?: boolean;
}
/**
 * Represents a Volume that can be mounted to a container that uses ECS
 */
export declare abstract class EcsVolume {
    /**
     * Creates a Volume that uses an AWS Elastic File System (EFS); this volume can grow and shrink as needed
     *
     * @see https://docs.aws.amazon.com/batch/latest/userguide/efs-volumes.html
     */
    static efs(options: EfsVolumeOptions): EfsVolume;
    /**
     * Creates a Host volume. This volume will persist on the host at the specified `hostPath`.
     * If the `hostPath` is not specified, Docker will choose the host path. In this case,
     * the data may not persist after the containers that use it stop running.
     */
    static host(options: HostVolumeOptions): HostVolume;
    /**
     * The name of this volume
     */
    readonly name: string;
    /**
     * The path on the container that this volume will be mounted to
     */
    readonly containerPath: string;
    /**
     * Whether or not the container has readonly access to this volume
     *
     * @default false
     */
    readonly readonly?: boolean;
    constructor(options: EcsVolumeOptions);
}
/**
 * Options for configuring an EfsVolume
 */
export interface EfsVolumeOptions extends EcsVolumeOptions {
    /**
     * The EFS File System that supports this volume
     */
    readonly fileSystem: IFileSystem;
    /**
     * The directory within the Amazon EFS file system to mount as the root directory inside the host.
     * If this parameter is omitted, the root of the Amazon EFS volume is used instead.
     * Specifying `/` has the same effect as omitting this parameter.
     * The maximum length is 4,096 characters.
     *
     * @default - root of the EFS File System
     */
    readonly rootDirectory?: string;
    /**
     * Enables encryption for Amazon EFS data in transit between the Amazon ECS host and the Amazon EFS server
     *
     * @see https://docs.aws.amazon.com/efs/latest/ug/encryption-in-transit.html
     *
     * @default false
     */
    readonly enableTransitEncryption?: boolean;
    /**
     * The port to use when sending encrypted data between the Amazon ECS host and the Amazon EFS server.
     * The value must be between 0 and 65,535.
     *
     * @see https://docs.aws.amazon.com/efs/latest/ug/efs-mount-helper.html
     *
     * @default - chosen by the EFS Mount Helper
     */
    readonly transitEncryptionPort?: number;
    /**
     * The Amazon EFS access point ID to use.
     * If an access point is specified, `rootDirectory` must either be omitted or set to `/`
     * which enforces the path set on the EFS access point.
     * If an access point is used, `enableTransitEncryption` must be `true`.
     *
     * @see https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html
     *
     * @default - no accessPointId
     */
    readonly accessPointId?: string;
    /**
     * Whether or not to use the AWS Batch job IAM role defined in a job definition when mounting the Amazon EFS file system.
     * If specified, `enableTransitEncryption` must be `true`.
     *
     * @see https://docs.aws.amazon.com/batch/latest/userguide/efs-volumes.html#efs-volume-accesspoints
     *
     * @default false
     */
    readonly useJobRole?: boolean;
}
/**
 * A Volume that uses an AWS Elastic File System (EFS); this volume can grow and shrink as needed
 */
export declare class EfsVolume extends EcsVolume {
    /**
     * Returns true if x is an EfsVolume, false otherwise
     */
    static isEfsVolume(x: any): x is EfsVolume;
    /**
     * The EFS File System that supports this volume
     */
    readonly fileSystem: IFileSystem;
    /**
     * The directory within the Amazon EFS file system to mount as the root directory inside the host.
     * If this parameter is omitted, the root of the Amazon EFS volume is used instead.
     * Specifying `/` has the same effect as omitting this parameter.
     * The maximum length is 4,096 characters.
     *
     * @default - root of the EFS File System
     */
    readonly rootDirectory?: string;
    /**
     * Enables encryption for Amazon EFS data in transit between the Amazon ECS host and the Amazon EFS server
     *
     * @see https://docs.aws.amazon.com/efs/latest/ug/encryption-in-transit.html
     *
     * @default false
     */
    readonly enableTransitEncryption?: boolean;
    /**
     * The port to use when sending encrypted data between the Amazon ECS host and the Amazon EFS server.
     * The value must be between 0 and 65,535.
     *
     * @see https://docs.aws.amazon.com/efs/latest/ug/efs-mount-helper.html
     *
     * @default - chosen by the EFS Mount Helper
     */
    readonly transitEncryptionPort?: number;
    /**
     * The Amazon EFS access point ID to use.
     * If an access point is specified, `rootDirectory` must either be omitted or set to `/`
     * which enforces the path set on the EFS access point.
     * If an access point is used, `enableTransitEncryption` must be `true`.
     *
     * @see https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html
     *
     * @default - no accessPointId
     */
    readonly accessPointId?: string;
    /**
     * Whether or not to use the AWS Batch job IAM role defined in a job definition when mounting the Amazon EFS file system.
     * If specified, `enableTransitEncryption` must be `true`.
     *
     * @see https://docs.aws.amazon.com/batch/latest/userguide/efs-volumes.html#efs-volume-accesspoints
     *
     * @default false
     */
    readonly useJobRole?: boolean;
    constructor(options: EfsVolumeOptions);
}
/**
 * Options for configuring an ECS HostVolume
 */
export interface HostVolumeOptions extends EcsVolumeOptions {
    /**
     * The path on the host machine this container will have access to
     *
     * @default - Docker will choose the host path.
     * The data may not persist after the containers that use it stop running.
     */
    readonly hostPath?: string;
}
/**
 * Creates a Host volume. This volume will persist on the host at the specified `hostPath`.
 * If the `hostPath` is not specified, Docker will choose the host path. In this case,
 * the data may not persist after the containers that use it stop running.
 */
export declare class HostVolume extends EcsVolume {
    /**
     * returns `true` if `x` is a `HostVolume`, `false` otherwise
     */
    static isHostVolume(x: any): x is HostVolume;
    /**
     * The path on the host machine this container will have access to
     */
    readonly hostPath?: string;
    constructor(options: HostVolumeOptions);
}
/**
 * A container that can be run with ECS orchestration
 */
export interface IEcsContainerDefinition extends IConstruct {
    /**
     * The image that this container will run
     */
    readonly image: ecs.ContainerImage;
    /**
     * The number of vCPUs reserved for the container.
     * Each vCPU is equivalent to 1,024 CPU shares.
     * For containers running on EC2 resources, you must specify at least one vCPU.
     */
    readonly cpu: number;
    /**
     * The memory hard limit present to the container.
     * If your container attempts to exceed the memory specified, the container is terminated.
     * You must specify at least 4 MiB of memory for a job.
     */
    readonly memory: Size;
    /**
     * The command that's passed to the container
     *
     * @see https://docs.docker.com/engine/reference/builder/#cmd
     */
    readonly command?: string[];
    /**
     * The environment variables to pass to a container.
     * Cannot start with `AWS_BATCH`.
     * We don't recommend using plaintext environment variables for sensitive information, such as credential data.
     *
     * @default - no environment variables
     */
    readonly environment?: {
        [key: string]: string;
    };
    /**
     * The role used by Amazon ECS container and AWS Fargate agents to make AWS API calls on your behalf.
     *
     * @see https://docs.aws.amazon.com/batch/latest/userguide/execution-IAM-role.html
     */
    readonly executionRole: iam.IRole;
    /**
     * The role that the container can assume.
     *
     * @default - no jobRole
     *
     * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html
     */
    readonly jobRole?: iam.IRole;
    /**
     * Linux-specific modifications that are applied to the container, such as details for device mappings.
     *
     * @default none
     */
    readonly linuxParameters?: LinuxParameters;
    /**
     * The configuration of the log driver
     */
    readonly logDriverConfig?: ecs.LogDriverConfig;
    /**
     * Gives the container readonly access to its root filesystem.
     *
     * @default false
     */
    readonly readonlyRootFilesystem?: boolean;
    /**
     * A map from environment variable names to the secrets for the container. Allows your job definitions
     * to reference the secret by the environment variable name defined in this property.
     *
     * @see https://docs.aws.amazon.com/batch/latest/userguide/specifying-sensitive-data.html
     *
     * @default - no secrets
     */
    readonly secrets?: {
        [envVarName: string]: Secret;
    };
    /**
     * The user name to use inside the container
     *
     * @default - no user
     */
    readonly user?: string;
    /**
     * The volumes to mount to this container. Automatically added to the job definition.
     *
     * @default - no volumes
     */
    readonly volumes: EcsVolume[];
    /**
     * Renders this container to CloudFormation
     *
     * @internal
     */
    _renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty;
    /**
     * Add a Volume to this container
     */
    addVolume(volume: EcsVolume): void;
}
/**
 * Props to configure an EcsContainerDefinition
 */
export interface EcsContainerDefinitionProps {
    /**
     * The image that this container will run
     */
    readonly image: ecs.ContainerImage;
    /**
     * The number of vCPUs reserved for the container.
     * Each vCPU is equivalent to 1,024 CPU shares.
     * For containers running on EC2 resources, you must specify at least one vCPU.
     */
    readonly cpu: number;
    /**
     * The memory hard limit present to the container.
     * If your container attempts to exceed the memory specified, the container is terminated.
     * You must specify at least 4 MiB of memory for a job.
     */
    readonly memory: Size;
    /**
     * The command that's passed to the container
     *
     * @see https://docs.docker.com/engine/reference/builder/#cmd
     *
     * @default - no command
     */
    readonly command?: string[];
    /**
     * The environment variables to pass to a container.
     * Cannot start with `AWS_BATCH`.
     * We don't recommend using plaintext environment variables for sensitive information, such as credential data.
     *
     * @default - no environment variables
     */
    readonly environment?: {
        [key: string]: string;
    };
    /**
     * The role used by Amazon ECS container and AWS Fargate agents to make AWS API calls on your behalf.
     *
     * @see https://docs.aws.amazon.com/batch/latest/userguide/execution-IAM-role.html
     *
     * @default - a Role will be created
     */
    readonly executionRole?: iam.IRole;
    /**
     * The role that the container can assume.
     *
     * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html
     *
     * @default - no job role
     */
    readonly jobRole?: iam.IRole;
    /**
     * Linux-specific modifications that are applied to the container, such as details for device mappings.
     *
     * @default none
     */
    readonly linuxParameters?: LinuxParameters;
    /**
     * The loging configuration for this Job
     *
     * @default - the log configuration of the Docker daemon
     */
    readonly logging?: ecs.LogDriver;
    /**
     * Gives the container readonly access to its root filesystem.
     *
     * @default false
     */
    readonly readonlyRootFilesystem?: boolean;
    /**
     * A map from environment variable names to the secrets for the container. Allows your job definitions
     * to reference the secret by the environment variable name defined in this property.
     *
     * @see https://docs.aws.amazon.com/batch/latest/userguide/specifying-sensitive-data.html
     *
     * @default - no secrets
     */
    readonly secrets?: {
        [envVarName: string]: Secret;
    };
    /**
     * The user name to use inside the container
     *
     * @default - no user
     */
    readonly user?: string;
    /**
     * The volumes to mount to this container. Automatically added to the job definition.
     *
     * @default - no volumes
     */
    readonly volumes?: EcsVolume[];
}
/**
 * Abstract base class for ECS Containers
 */
declare abstract class EcsContainerDefinitionBase extends Construct implements IEcsContainerDefinition {
    readonly image: ecs.ContainerImage;
    readonly cpu: number;
    readonly memory: Size;
    readonly command?: string[];
    readonly environment?: {
        [key: string]: string;
    };
    readonly executionRole: iam.IRole;
    readonly jobRole?: iam.IRole;
    readonly linuxParameters?: LinuxParameters;
    readonly logDriverConfig?: ecs.LogDriverConfig;
    readonly readonlyRootFilesystem?: boolean;
    readonly secrets?: {
        [envVarName: string]: Secret;
    };
    readonly user?: string;
    readonly volumes: EcsVolume[];
    private readonly imageConfig;
    constructor(scope: Construct, id: string, props: EcsContainerDefinitionProps);
    /**
     * @internal
     */
    _renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty;
    addVolume(volume: EcsVolume): void;
    /**
     * @internal
     */
    protected _renderResourceRequirements(): {
        type: string;
        value: string;
    }[];
}
/**
 * Sets limits for a resource with `ulimit` on linux systems.
 * Used by the Docker daemon.
 */
export interface Ulimit {
    /**
     * The hard limit for this resource. The container will
     * be terminated if it exceeds this limit.
     */
    readonly hardLimit: number;
    /**
     * The resource to limit
     */
    readonly name: UlimitName;
    /**
     * The reservation for this resource. The container will
     * not be terminated if it exceeds this limit.
     */
    readonly softLimit: number;
}
/**
 * The resources to be limited
 */
export declare enum UlimitName {
    /**
     * max core dump file size
     */
    CORE = "core",
    /**
     * max cpu time (seconds) for a process
     */
    CPU = "cpu",
    /**
     * max data segment size
     */
    DATA = "data",
    /**
     * max file size
     */
    FSIZE = "fsize",
    /**
     * max number of file locks
     */
    LOCKS = "locks",
    /**
     * max locked memory
     */
    MEMLOCK = "memlock",
    /**
     * max POSIX message queue size
     */
    MSGQUEUE = "msgqueue",
    /**
     * max nice value for any process this user is running
     */
    NICE = "nice",
    /**
     * maximum number of open file descriptors
     */
    NOFILE = "nofile",
    /**
     * maximum number of processes
     */
    NPROC = "nproc",
    /**
     * size of the process' resident set (in pages)
     */
    RSS = "rss",
    /**
     * max realtime priority
     */
    RTPRIO = "rtprio",
    /**
     * timeout for realtime tasks
     */
    RTTIME = "rttime",
    /**
     * max number of pending signals
     */
    SIGPENDING = "sigpending",
    /**
     * max stack size (in bytes)
     */
    STACK = "stack"
}
/**
 * A container orchestrated by ECS that uses EC2 resources
 */
export interface IEcsEc2ContainerDefinition extends IEcsContainerDefinition {
    /**
     * When this parameter is true, the container is given elevated permissions on the host container instance (similar to the root user).
     *
     * @default false
     */
    readonly privileged?: boolean;
    /**
     * Limits to set for the user this docker container will run as
     */
    readonly ulimits: Ulimit[];
    /**
     * The number of physical GPUs to reserve for the container.
     * Make sure that the number of GPUs reserved for all containers in a job doesn't exceed
     * the number of available GPUs on the compute resource that the job is launched on.
     *
     * @default - no gpus
     */
    readonly gpu?: number;
    /**
     * Add a ulimit to this container
     */
    addUlimit(ulimit: Ulimit): void;
}
/**
 * Props to configure an EcsEc2ContainerDefinition
 */
export interface EcsEc2ContainerDefinitionProps extends EcsContainerDefinitionProps {
    /**
     * When this parameter is true, the container is given elevated permissions on the host container instance (similar to the root user).
     *
     * @default false
     */
    readonly privileged?: boolean;
    /**
     * Limits to set for the user this docker container will run as
     *
     * @default - no ulimits
     */
    readonly ulimits?: Ulimit[];
    /**
     * The number of physical GPUs to reserve for the container.
     * Make sure that the number of GPUs reserved for all containers in a job doesn't exceed
     * the number of available GPUs on the compute resource that the job is launched on.
     *
     * @default - no gpus
     */
    readonly gpu?: number;
}
/**
 * A container orchestrated by ECS that uses EC2 resources
 */
export declare class EcsEc2ContainerDefinition extends EcsContainerDefinitionBase implements IEcsEc2ContainerDefinition {
    readonly privileged?: boolean;
    readonly ulimits: Ulimit[];
    readonly gpu?: number;
    constructor(scope: Construct, id: string, props: EcsEc2ContainerDefinitionProps);
    /**
     * @internal
     */
    _renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty;
    /**
     * Add a ulimit to this container
     */
    addUlimit(ulimit: Ulimit): void;
    /**
     * @internal
     */
    protected _renderResourceRequirements(): {
        type: string;
        value: string;
    }[];
}
/**
 * A container orchestrated by ECS that uses Fargate resources and is orchestrated by ECS
 */
export interface IEcsFargateContainerDefinition extends IEcsContainerDefinition {
    /**
     * Indicates whether the job has a public IP address.
     * For a job that's running on Fargate resources in a private subnet to send outbound traffic to the internet
     * (for example, to pull container images), the private subnet requires a NAT gateway be attached to route requests to the internet.
     *
     * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html
     *
     * @default false
     */
    readonly assignPublicIp?: boolean;
    /**
     * Which version of Fargate to use when running this container
     *
     * @default LATEST
     */
    readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;
    /**
     * The size for ephemeral storage.
     *
     * @default - 20 GiB
     */
    readonly ephemeralStorageSize?: Size;
}
/**
 * Props to configure an EcsFargateContainerDefinition
 */
export interface EcsFargateContainerDefinitionProps extends EcsContainerDefinitionProps {
    /**
     * Indicates whether the job has a public IP address.
     * For a job that's running on Fargate resources in a private subnet to send outbound traffic to the internet
     * (for example, to pull container images), the private subnet requires a NAT gateway be attached to route requests to the internet.
     *
     * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html
     *
     * @default false
     */
    readonly assignPublicIp?: boolean;
    /**
     * Which version of Fargate to use when running this container
     *
     * @default LATEST
     */
    readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;
    /**
     * The size for ephemeral storage.
     *
     * @default - 20 GiB
     */
    readonly ephemeralStorageSize?: Size;
}
/**
 * A container orchestrated by ECS that uses Fargate resources
 */
export declare class EcsFargateContainerDefinition extends EcsContainerDefinitionBase implements IEcsFargateContainerDefinition {
    readonly fargatePlatformVersion?: ecs.FargatePlatformVersion;
    readonly assignPublicIp?: boolean;
    readonly ephemeralStorageSize?: Size;
    constructor(scope: Construct, id: string, props: EcsFargateContainerDefinitionProps);
    /**
     * @internal
     */
    _renderContainerDefinition(): CfnJobDefinition.ContainerPropertiesProperty;
}
export {};
