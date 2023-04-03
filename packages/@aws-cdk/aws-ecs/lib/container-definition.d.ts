import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { NetworkMode, TaskDefinition } from './base/task-definition';
import { ContainerImage } from './container-image';
import { CfnTaskDefinition } from './ecs.generated';
import { EnvironmentFile, EnvironmentFileConfig } from './environment-file';
import { LinuxParameters } from './linux-parameters';
import { LogDriver, LogDriverConfig } from './log-drivers/log-driver';
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
export interface ContainerDefinitionOptions {
    /**
     * The image used to start a container.
     *
     * This string is passed directly to the Docker daemon.
     * Images in the Docker Hub registry are available by default.
     * Other repositories are specified with either repository-url/image:tag or repository-url/image@digest.
     * TODO: Update these to specify using classes of IContainerImage
     */
    readonly image: ContainerImage;
    /**
     * The name of the container.
     *
     * @default - id of node associated with ContainerDefinition.
     */
    readonly containerName?: string;
    /**
     * The command that is passed to the container.
     *
     * If you provide a shell command as a single string, you have to quote command-line arguments.
     *
     * @default - CMD value built into container image.
     */
    readonly command?: string[];
    /**
     * The minimum number of CPU units to reserve for the container.
     *
     * @default - No minimum CPU units reserved.
     */
    readonly cpu?: number;
    /**
     * Specifies whether networking is disabled within the container.
     *
     * When this parameter is true, networking is disabled within the container.
     *
     * @default false
     */
    readonly disableNetworking?: boolean;
    /**
     * A list of DNS search domains that are presented to the container.
     *
     * @default - No search domains.
     */
    readonly dnsSearchDomains?: string[];
    /**
     * A list of DNS servers that are presented to the container.
     *
     * @default - Default DNS servers.
     */
    readonly dnsServers?: string[];
    /**
     * A key/value map of labels to add to the container.
     *
     * @default - No labels.
     */
    readonly dockerLabels?: {
        [key: string]: string;
    };
    /**
     * A list of strings to provide custom labels for SELinux and AppArmor multi-level security systems.
     *
     * @default - No security labels.
     */
    readonly dockerSecurityOptions?: string[];
    /**
     * The ENTRYPOINT value to pass to the container.
     *
     * @see https://docs.docker.com/engine/reference/builder/#entrypoint
     *
     * @default - Entry point configured in container.
     */
    readonly entryPoint?: string[];
    /**
     * The environment variables to pass to the container.
     *
     * @default - No environment variables.
     */
    readonly environment?: {
        [key: string]: string;
    };
    /**
     * The environment files to pass to the container.
     *
     * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/taskdef-envfiles.html
     *
     * @default - No environment files.
     */
    readonly environmentFiles?: EnvironmentFile[];
    /**
     * The secret environment variables to pass to the container.
     *
     * @default - No secret environment variables.
     */
    readonly secrets?: {
        [key: string]: Secret;
    };
    /**
     * Time duration (in seconds) to wait before giving up on resolving dependencies for a container.
     *
     * @default - none
     */
    readonly startTimeout?: cdk.Duration;
    /**
     * Time duration (in seconds) to wait before the container is forcefully killed if it doesn't exit normally on its own.
     *
     * @default - none
     */
    readonly stopTimeout?: cdk.Duration;
    /**
     * Specifies whether the container is marked essential.
     *
     * If the essential parameter of a container is marked as true, and that container fails
     * or stops for any reason, all other containers that are part of the task are stopped.
     * If the essential parameter of a container is marked as false, then its failure does not
     * affect the rest of the containers in a task. All tasks must have at least one essential container.
     *
     * If this parameter is omitted, a container is assumed to be essential.
     *
     * @default true
     */
    readonly essential?: boolean;
    /**
     * A list of hostnames and IP address mappings to append to the /etc/hosts file on the container.
     *
     * @default - No extra hosts.
     */
    readonly extraHosts?: {
        [name: string]: string;
    };
    /**
     * The health check command and associated configuration parameters for the container.
     *
     * @default - Health check configuration from container.
     */
    readonly healthCheck?: HealthCheck;
    /**
     * The hostname to use for your container.
     *
     * @default - Automatic hostname.
     */
    readonly hostname?: string;
    /**
     * The amount (in MiB) of memory to present to the container.
     *
     * If your container attempts to exceed the allocated memory, the container
     * is terminated.
     *
     * At least one of memoryLimitMiB and memoryReservationMiB is required for non-Fargate services.
     *
     * @default - No memory limit.
     */
    readonly memoryLimitMiB?: number;
    /**
     * The soft limit (in MiB) of memory to reserve for the container.
     *
     * When system memory is under heavy contention, Docker attempts to keep the
     * container memory to this soft limit. However, your container can consume more
     * memory when it needs to, up to either the hard limit specified with the memory
     * parameter (if applicable), or all of the available memory on the container
     * instance, whichever comes first.
     *
     * At least one of memoryLimitMiB and memoryReservationMiB is required for non-Fargate services.
     *
     * @default - No memory reserved.
     */
    readonly memoryReservationMiB?: number;
    /**
     * Specifies whether the container is marked as privileged.
     * When this parameter is true, the container is given elevated privileges on the host container instance (similar to the root user).
     *
     * @default false
     */
    readonly privileged?: boolean;
    /**
     * When this parameter is true, the container is given read-only access to its root file system.
     *
     * @default false
     */
    readonly readonlyRootFilesystem?: boolean;
    /**
     * The user name to use inside the container.
     *
     * @default root
     */
    readonly user?: string;
    /**
     * The working directory in which to run commands inside the container.
     *
     * @default /
     */
    readonly workingDirectory?: string;
    /**
     * The log configuration specification for the container.
     *
     * @default - Containers use the same logging driver that the Docker daemon uses.
     */
    readonly logging?: LogDriver;
    /**
     * Linux-specific modifications that are applied to the container, such as Linux kernel capabilities.
     * For more information see [KernelCapabilities](https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_KernelCapabilities.html).
     *
     * @default - No Linux parameters.
     */
    readonly linuxParameters?: LinuxParameters;
    /**
     * The number of GPUs assigned to the container.
     *
     * @default - No GPUs assigned.
     */
    readonly gpuCount?: number;
    /**
     * The port mappings to add to the container definition.
     * @default - No ports are mapped.
     */
    readonly portMappings?: PortMapping[];
    /**
     * The inference accelerators referenced by the container.
     * @default - No inference accelerators assigned.
     */
    readonly inferenceAcceleratorResources?: string[];
    /**
     * A list of namespaced kernel parameters to set in the container.
     *
     * @default - No system controls are set.
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-systemcontrol.html
     * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#container_definition_systemcontrols
     */
    readonly systemControls?: SystemControl[];
}
/**
 * The properties in a container definition.
 */
export interface ContainerDefinitionProps extends ContainerDefinitionOptions {
    /**
     * The name of the task definition that includes this container definition.
     *
     * [disable-awslint:ref-via-interface]
     */
    readonly taskDefinition: TaskDefinition;
}
/**
 * A container definition is used in a task definition to describe the containers that are launched as part of a task.
 */
export declare class ContainerDefinition extends Construct {
    private readonly props;
    /**
     * The Linux-specific modifications that are applied to the container, such as Linux kernel capabilities.
     */
    readonly linuxParameters?: LinuxParameters;
    /**
     * The mount points for data volumes in your container.
     */
    readonly mountPoints: MountPoint[];
    /**
     * The list of port mappings for the container. Port mappings allow containers to access ports
     * on the host container instance to send or receive traffic.
     */
    readonly portMappings: PortMapping[];
    /**
     * The data volumes to mount from another container in the same task definition.
     */
    readonly volumesFrom: VolumeFrom[];
    /**
     * An array of ulimits to set in the container.
     */
    readonly ulimits: Ulimit[];
    /**
     * An array dependencies defined for container startup and shutdown.
     */
    readonly containerDependencies: ContainerDependency[];
    /**
     * Specifies whether the container will be marked essential.
     *
     * If the essential parameter of a container is marked as true, and that container
     * fails or stops for any reason, all other containers that are part of the task are
     * stopped. If the essential parameter of a container is marked as false, then its
     * failure does not affect the rest of the containers in a task.
     *
     * If this parameter is omitted, a container is assumed to be essential.
     */
    readonly essential: boolean;
    /**
     * The name of this container
     */
    readonly containerName: string;
    /**
     * Whether there was at least one memory limit specified in this definition
     */
    readonly memoryLimitSpecified: boolean;
    /**
     * The name of the task definition that includes this container definition.
     */
    readonly taskDefinition: TaskDefinition;
    /**
     * The environment files for this container
     */
    readonly environmentFiles?: EnvironmentFileConfig[];
    /**
     * The log configuration specification for the container.
     */
    readonly logDriverConfig?: LogDriverConfig;
    /**
     * The name of the image referenced by this container.
     */
    readonly imageName: string;
    /**
     * The inference accelerators referenced by this container.
     */
    private readonly inferenceAcceleratorResources;
    /**
     * The configured container links
     */
    private readonly links;
    private readonly imageConfig;
    private readonly secrets;
    private readonly environment;
    private _namedPorts;
    /**
     * Constructs a new instance of the ContainerDefinition class.
     */
    constructor(scope: Construct, id: string, props: ContainerDefinitionProps);
    /**
     * This method adds a link which allows containers to communicate with each other without the need for port mappings.
     *
     * This parameter is only supported if the task definition is using the bridge network mode.
     * Warning: The --link flag is a legacy feature of Docker. It may eventually be removed.
     */
    addLink(container: ContainerDefinition, alias?: string): void;
    /**
     * This method adds one or more mount points for data volumes to the container.
     */
    addMountPoints(...mountPoints: MountPoint[]): void;
    /**
     * This method mounts temporary disk space to the container.
     *
     * This adds the correct container mountPoint and task definition volume.
     */
    addScratch(scratch: ScratchSpace): void;
    /**
     * This method adds one or more port mappings to the container.
     */
    addPortMappings(...portMappings: PortMapping[]): void;
    /**
     * This method adds an environment variable to the container.
     */
    addEnvironment(name: string, value: string): void;
    /**
     * This method adds a secret as environment variable to the container.
     */
    addSecret(name: string, secret: Secret): void;
    /**
     * This method adds one or more resources to the container.
     */
    addInferenceAcceleratorResource(...inferenceAcceleratorResources: string[]): void;
    /**
     * This method adds one or more ulimits to the container.
     */
    addUlimits(...ulimits: Ulimit[]): void;
    /**
     * This method adds one or more container dependencies to the container.
     */
    addContainerDependencies(...containerDependencies: ContainerDependency[]): void;
    /**
     * This method adds one or more volumes to the container.
     */
    addVolumesFrom(...volumesFrom: VolumeFrom[]): void;
    /**
     * This method adds the specified statement to the IAM task execution policy in the task definition.
     */
    addToExecutionPolicy(statement: iam.PolicyStatement): void;
    /**
     * Returns the host port for the requested container port if it exists
     */
    findPortMapping(containerPort: number, protocol: Protocol): PortMapping | undefined;
    /**
     * Returns the port mapping with the given name, if it exists.
     */
    findPortMappingByName(name: string): PortMapping | undefined;
    /**
     * This method adds an namedPort
     */
    private setNamedPort;
    /**
     * Set HostPort to 0 When netowork mode is Brdige
     */
    private addHostPortIfNeeded;
    /**
     * Whether this container definition references a specific JSON field of a secret
     * stored in Secrets Manager.
     */
    get referencesSecretJsonField(): boolean | undefined;
    /**
     * The inbound rules associated with the security group the task or service will use.
     *
     * This property is only used for tasks that use the awsvpc network mode.
     */
    get ingressPort(): number;
    /**
     * The port the container will listen on.
     */
    get containerPort(): number;
    /**
     * Render this container definition to a CloudFormation object
     *
     * @param _taskDefinition [disable-awslint:ref-via-interface] (unused but kept to avoid breaking change)
     */
    renderContainerDefinition(_taskDefinition?: TaskDefinition): CfnTaskDefinition.ContainerDefinitionProperty;
}
/**
 * The health check command and associated configuration parameters for the container.
 */
export interface HealthCheck {
    /**
     * A string array representing the command that the container runs to determine if it is healthy.
     * The string array must start with CMD to execute the command arguments directly, or
     * CMD-SHELL to run the command with the container's default shell.
     *
     * For example: [ "CMD-SHELL", "curl -f http://localhost/ || exit 1" ]
     */
    readonly command: string[];
    /**
     * The time period in seconds between each health check execution.
     *
     * You may specify between 5 and 300 seconds.
     *
     * @default Duration.seconds(30)
     */
    readonly interval?: cdk.Duration;
    /**
     * The number of times to retry a failed health check before the container is considered unhealthy.
     *
     * You may specify between 1 and 10 retries.
     *
     * @default 3
     */
    readonly retries?: number;
    /**
     * The optional grace period within which to provide containers time to bootstrap before
     * failed health checks count towards the maximum number of retries.
     *
     * You may specify between 0 and 300 seconds.
     *
     * @default No start period
     */
    readonly startPeriod?: cdk.Duration;
    /**
     * The time period in seconds to wait for a health check to succeed before it is considered a failure.
     *
     * You may specify between 2 and 60 seconds.
     *
     * @default Duration.seconds(5)
     */
    readonly timeout?: cdk.Duration;
}
/**
 * The ulimit settings to pass to the container.
 *
 * NOTE: Does not work for Windows containers.
 */
export interface Ulimit {
    /**
     * The type of the ulimit.
     *
     * For more information, see [UlimitName](https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-ecs/ulimitname.html#aws_ecs_UlimitName).
     */
    readonly name: UlimitName;
    /**
     * The soft limit for the ulimit type.
     */
    readonly softLimit: number;
    /**
     * The hard limit for the ulimit type.
     */
    readonly hardLimit: number;
}
/**
 * Type of resource to set a limit on
 */
export declare enum UlimitName {
    CORE = "core",
    CPU = "cpu",
    DATA = "data",
    FSIZE = "fsize",
    LOCKS = "locks",
    MEMLOCK = "memlock",
    MSGQUEUE = "msgqueue",
    NICE = "nice",
    NOFILE = "nofile",
    NPROC = "nproc",
    RSS = "rss",
    RTPRIO = "rtprio",
    RTTIME = "rttime",
    SIGPENDING = "sigpending",
    STACK = "stack"
}
/**
 * The details of a dependency on another container in the task definition.
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ContainerDependency.html
 */
export interface ContainerDependency {
    /**
     * The container to depend on.
     */
    readonly container: ContainerDefinition;
    /**
     * The state the container needs to be in to satisfy the dependency and proceed with startup.
     * Valid values are ContainerDependencyCondition.START, ContainerDependencyCondition.COMPLETE,
     * ContainerDependencyCondition.SUCCESS and ContainerDependencyCondition.HEALTHY.
     *
     * @default ContainerDependencyCondition.HEALTHY
     */
    readonly condition?: ContainerDependencyCondition;
}
export declare enum ContainerDependencyCondition {
    /**
     * This condition emulates the behavior of links and volumes today.
     * It validates that a dependent container is started before permitting other containers to start.
     */
    START = "START",
    /**
     * This condition validates that a dependent container runs to completion (exits) before permitting other containers to start.
     * This can be useful for nonessential containers that run a script and then exit.
     */
    COMPLETE = "COMPLETE",
    /**
     * This condition is the same as COMPLETE, but it also requires that the container exits with a zero status.
     */
    SUCCESS = "SUCCESS",
    /**
     * This condition validates that the dependent container passes its Docker health check before permitting other containers to start.
     * This requires that the dependent container has health checks configured. This condition is confirmed only at task startup.
     */
    HEALTHY = "HEALTHY"
}
/**
 * Port mappings allow containers to access ports on the host container instance to send or receive traffic.
 */
export interface PortMapping {
    /**
     * The port number on the container that is bound to the user-specified or automatically assigned host port.
     *
     * If you are using containers in a task with the awsvpc or host network mode, exposed ports should be specified using containerPort.
     * If you are using containers in a task with the bridge network mode and you specify a container port and not a host port,
     * your container automatically receives a host port in the ephemeral port range.
     *
     * For more information, see hostPort.
     * Port mappings that are automatically assigned in this way do not count toward the 100 reserved ports limit of a container instance.
     */
    readonly containerPort: number;
    /**
     * The port number on the container instance to reserve for your container.
     *
     * If you are using containers in a task with the awsvpc or host network mode,
     * the hostPort can either be left blank or set to the same value as the containerPort.
     *
     * If you are using containers in a task with the bridge network mode,
     * you can specify a non-reserved host port for your container port mapping, or
     * you can omit the hostPort (or set it to 0) while specifying a containerPort and
     * your container automatically receives a port in the ephemeral port range for
     * your container instance operating system and Docker version.
     */
    readonly hostPort?: number;
    /**
     * The protocol used for the port mapping. Valid values are Protocol.TCP and Protocol.UDP.
     *
     * @default TCP
     */
    readonly protocol?: Protocol;
    /**
     * The name to give the port mapping.
     *
     * Name is required in order to use the port mapping with ECS Service Connect.
     * This field may only be set when the task definition uses Bridge or Awsvpc network modes.
     *
     * @default - no port mapping name
     */
    readonly name?: string;
    /**
     * The protocol used by Service Connect. Valid values are AppProtocol.http, AppProtocol.http2, and
     * AppProtocol.grpc. The protocol determines what telemetry will be shown in the ECS Console for
     * Service Connect services using this port mapping.
     *
     * This field may only be set when the task definition uses Bridge or Awsvpc network modes.
     *
     * @default - no app protocol
     */
    readonly appProtocol?: AppProtocol;
}
/**
 * PortMap ValueObjectClass having by ContainerDefinition
 */
export declare class PortMap {
    /**
     * The networking mode to use for the containers in the task.
     */
    readonly networkmode: NetworkMode;
    /**
     * Port mappings allow containers to access ports on the host container instance to send or receive traffic.
     */
    readonly portmapping: PortMapping;
    constructor(networkmode: NetworkMode, pm: PortMapping);
    /**
     * validate invalid portmapping and networkmode parameters.
     * throw Error when invalid parameters.
     */
    validate(): void;
    private isvalidPortName;
    private isValidPorts;
}
/**
 * ServiceConnect ValueObjectClass having by ContainerDefinition
 */
export declare class ServiceConnect {
    /**
     * Port mappings allow containers to access ports on the host container instance to send or receive traffic.
     */
    readonly portmapping: PortMapping;
    /**
     * The networking mode to use for the containers in the task.
     */
    readonly networkmode: NetworkMode;
    constructor(networkmode: NetworkMode, pm: PortMapping);
    /**
     * Judge parameters can be serviceconnect logick.
     * If parameters can be serviceConnect return true.
     */
    isServiceConnect(): boolean;
    /**
     * Judge serviceconnect parametes are valid.
     * If invalid, throw Error.
     */
    validate(): void;
    private isValidNetworkmode;
    private isValidPortName;
}
/**
 * Network protocol
 */
export declare enum Protocol {
    /**
     * TCP
     */
    TCP = "tcp",
    /**
     * UDP
     */
    UDP = "udp"
}
/**
 * Service connect app protocol.
 */
export declare class AppProtocol {
    /**
     * HTTP app protocol.
     */
    static http: AppProtocol;
    /**
     * HTTP2 app protocol.
     */
    static http2: AppProtocol;
    /**
     * GRPC app protocol.
     */
    static grpc: AppProtocol;
    /**
     * Custom value.
     */
    readonly value: string;
    protected constructor(value: string);
}
/**
 * The temporary disk space mounted to the container.
 */
export interface ScratchSpace {
    /**
     * The path on the container to mount the scratch volume at.
     */
    readonly containerPath: string;
    /**
     * Specifies whether to give the container read-only access to the scratch volume.
     *
     * If this value is true, the container has read-only access to the scratch volume.
     * If this value is false, then the container can write to the scratch volume.
     */
    readonly readOnly: boolean;
    readonly sourcePath: string;
    /**
     * The name of the scratch volume to mount. Must be a volume name referenced in the name parameter of task definition volume.
     */
    readonly name: string;
}
/**
 * The details of data volume mount points for a container.
 */
export interface MountPoint {
    /**
     * The path on the container to mount the host volume at.
     */
    readonly containerPath: string;
    /**
     * Specifies whether to give the container read-only access to the volume.
     *
     * If this value is true, the container has read-only access to the volume.
     * If this value is false, then the container can write to the volume.
     */
    readonly readOnly: boolean;
    /**
     * The name of the volume to mount.
     *
     * Must be a volume name referenced in the name parameter of task definition volume.
     */
    readonly sourceVolume: string;
}
/**
 * The details on a data volume from another container in the same task definition.
 */
export interface VolumeFrom {
    /**
     * The name of another container within the same task definition from which to mount volumes.
     */
    readonly sourceContainer: string;
    /**
     * Specifies whether the container has read-only access to the volume.
     *
     * If this value is true, the container has read-only access to the volume.
     * If this value is false, then the container can write to the volume.
     */
    readonly readOnly: boolean;
}
/**
 * Kernel parameters to set in the container
 */
export interface SystemControl {
    /**
     * The namespaced kernel parameter for which to set a value.
     */
    readonly namespace: string;
    /**
     * The value for the namespaced kernel parameter specified in namespace.
     */
    readonly value: string;
}
