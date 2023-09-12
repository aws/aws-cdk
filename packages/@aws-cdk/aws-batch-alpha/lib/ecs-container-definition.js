"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcsFargateContainerDefinition = exports.EcsEc2ContainerDefinition = exports.UlimitName = exports.HostVolume = exports.EfsVolume = exports.EcsVolume = exports.Secret = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("aws-cdk-lib/aws-iam");
const core_1 = require("aws-cdk-lib/core");
const constructs_1 = require("constructs");
const aws_logs_1 = require("aws-cdk-lib/aws-logs");
const EFS_VOLUME_SYMBOL = Symbol.for('aws-cdk-lib/aws-batch/lib/container-definition.EfsVolume');
const HOST_VOLUME_SYMBOL = Symbol.for('aws-cdk-lib/aws-batch/lib/container-definition.HostVolume');
/**
 * A secret environment variable.
 */
class Secret {
    /**
     * Creates an environment variable value from a parameter stored in AWS
     * Systems Manager Parameter Store.
     */
    static fromSsmParameter(parameter) {
        return {
            arn: parameter.parameterArn,
            grantRead: grantee => parameter.grantRead(grantee),
        };
    }
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
    static fromSecretsManager(secret, field) {
        return {
            arn: field ? `${secret.secretArn}:${field}::` : secret.secretArn,
            hasField: !!field,
            grantRead: grantee => secret.grantRead(grantee),
        };
    }
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
    static fromSecretsManagerVersion(secret, versionInfo, field) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_SecretVersionInfo(versionInfo);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromSecretsManagerVersion);
            }
            throw error;
        }
        return {
            arn: `${secret.secretArn}:${field ?? ''}:${versionInfo.versionStage ?? ''}:${versionInfo.versionId ?? ''}`,
            hasField: !!field,
            grantRead: grantee => secret.grantRead(grantee),
        };
    }
}
exports.Secret = Secret;
_a = JSII_RTTI_SYMBOL_1;
Secret[_a] = { fqn: "@aws-cdk/aws-batch-alpha.Secret", version: "0.0.0" };
/**
 * Represents a Volume that can be mounted to a container that uses ECS
 */
class EcsVolume {
    /**
     * Creates a Volume that uses an AWS Elastic File System (EFS); this volume can grow and shrink as needed
     *
     * @see https://docs.aws.amazon.com/batch/latest/userguide/efs-volumes.html
     */
    static efs(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_EfsVolumeOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.efs);
            }
            throw error;
        }
        return new EfsVolume(options);
    }
    /**
     * Creates a Host volume. This volume will persist on the host at the specified `hostPath`.
     * If the `hostPath` is not specified, Docker will choose the host path. In this case,
     * the data may not persist after the containers that use it stop running.
     */
    static host(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_HostVolumeOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.host);
            }
            throw error;
        }
        return new HostVolume(options);
    }
    constructor(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_EcsVolumeOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EcsVolume);
            }
            throw error;
        }
        this.name = options.name;
        this.containerPath = options.containerPath;
        this.readonly = options.readonly;
    }
}
exports.EcsVolume = EcsVolume;
_b = JSII_RTTI_SYMBOL_1;
EcsVolume[_b] = { fqn: "@aws-cdk/aws-batch-alpha.EcsVolume", version: "0.0.0" };
/**
 * A Volume that uses an AWS Elastic File System (EFS); this volume can grow and shrink as needed
 */
class EfsVolume extends EcsVolume {
    /**
     * Returns true if x is an EfsVolume, false otherwise
     */
    static isEfsVolume(x) {
        return x !== null && typeof (x) === 'object' && EFS_VOLUME_SYMBOL in x;
    }
    constructor(options) {
        super(options);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_EfsVolumeOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EfsVolume);
            }
            throw error;
        }
        this.fileSystem = options.fileSystem;
        this.rootDirectory = options.rootDirectory;
        this.enableTransitEncryption = options.enableTransitEncryption;
        this.transitEncryptionPort = options.transitEncryptionPort;
        this.accessPointId = options.accessPointId;
        this.useJobRole = options.useJobRole;
    }
}
exports.EfsVolume = EfsVolume;
_c = JSII_RTTI_SYMBOL_1;
EfsVolume[_c] = { fqn: "@aws-cdk/aws-batch-alpha.EfsVolume", version: "0.0.0" };
Object.defineProperty(EfsVolume.prototype, EFS_VOLUME_SYMBOL, {
    value: true,
    enumerable: false,
    writable: false,
});
/**
 * Creates a Host volume. This volume will persist on the host at the specified `hostPath`.
 * If the `hostPath` is not specified, Docker will choose the host path. In this case,
 * the data may not persist after the containers that use it stop running.
 */
class HostVolume extends EcsVolume {
    /**
     * returns `true` if `x` is a `HostVolume`, `false` otherwise
     */
    static isHostVolume(x) {
        return x !== null && typeof (x) === 'object' && HOST_VOLUME_SYMBOL in x;
    }
    constructor(options) {
        super(options);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_HostVolumeOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, HostVolume);
            }
            throw error;
        }
        this.hostPath = options.hostPath;
    }
}
exports.HostVolume = HostVolume;
_d = JSII_RTTI_SYMBOL_1;
HostVolume[_d] = { fqn: "@aws-cdk/aws-batch-alpha.HostVolume", version: "0.0.0" };
Object.defineProperty(HostVolume.prototype, HOST_VOLUME_SYMBOL, {
    value: true,
    enumerable: false,
    writable: false,
});
/**
 * Abstract base class for ECS Containers
 */
class EcsContainerDefinitionBase extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.image = props.image;
        this.cpu = props.cpu;
        this.command = props.command;
        this.environment = props.environment;
        this.executionRole = props.executionRole ?? createExecutionRole(this, 'ExecutionRole', props.logging ? true : false);
        this.jobRole = props.jobRole;
        this.linuxParameters = props.linuxParameters;
        this.memory = props.memory;
        if (props.logging) {
            this.logDriverConfig = props.logging.bind(this, {
                ...this,
                // TS!
                taskDefinition: {
                    obtainExecutionRole: () => this.executionRole,
                },
            });
        }
        this.readonlyRootFilesystem = props.readonlyRootFilesystem ?? false;
        this.secrets = props.secrets;
        this.user = props.user;
        this.volumes = props.volumes ?? [];
        this.imageConfig = props.image.bind(this, {
            ...this,
            taskDefinition: {
                obtainExecutionRole: () => this.executionRole,
            },
        });
    }
    /**
     * @internal
     */
    _renderContainerDefinition() {
        return {
            image: this.imageConfig.imageName,
            command: this.command,
            environment: Object.keys(this.environment ?? {}).map((envKey) => ({
                name: envKey,
                value: (this.environment ?? {})[envKey],
            })),
            jobRoleArn: this.jobRole?.roleArn,
            executionRoleArn: this.executionRole?.roleArn,
            linuxParameters: this.linuxParameters && this.linuxParameters.renderLinuxParameters(),
            logConfiguration: this.logDriverConfig,
            readonlyRootFilesystem: this.readonlyRootFilesystem,
            resourceRequirements: this._renderResourceRequirements(),
            secrets: this.secrets ? Object.entries(this.secrets).map(([name, secret]) => {
                secret.grantRead(this.executionRole);
                return {
                    name,
                    valueFrom: secret.arn,
                };
            }) : undefined,
            mountPoints: core_1.Lazy.any({
                produce: () => {
                    if (this.volumes.length === 0) {
                        return undefined;
                    }
                    return this.volumes.map((volume) => {
                        return {
                            containerPath: volume.containerPath,
                            readOnly: volume.readonly,
                            sourceVolume: volume.name,
                        };
                    });
                },
            }),
            volumes: core_1.Lazy.any({
                produce: () => {
                    if (this.volumes.length === 0) {
                        return undefined;
                    }
                    return this.volumes.map((volume) => {
                        if (EfsVolume.isEfsVolume(volume)) {
                            return {
                                name: volume.name,
                                efsVolumeConfiguration: {
                                    fileSystemId: volume.fileSystem.fileSystemId,
                                    rootDirectory: volume.rootDirectory,
                                    transitEncryption: volume.enableTransitEncryption ? 'ENABLED' : (volume.enableTransitEncryption === false ? 'DISABLED' : undefined),
                                    transitEncryptionPort: volume.transitEncryptionPort,
                                    authorizationConfig: volume.accessPointId || volume.useJobRole ? {
                                        accessPointId: volume.accessPointId,
                                        iam: volume.useJobRole ? 'ENABLED' : (volume.useJobRole === false ? 'DISABLED' : undefined),
                                    } : undefined,
                                },
                            };
                        }
                        else if (HostVolume.isHostVolume(volume)) {
                            return {
                                name: volume.name,
                                host: {
                                    sourcePath: volume.hostPath,
                                },
                            };
                        }
                        throw new Error('unsupported Volume encountered');
                    });
                },
            }),
            user: this.user,
        };
    }
    addVolume(volume) {
        this.volumes.push(volume);
    }
    /**
     * @internal
     */
    _renderResourceRequirements() {
        const resourceRequirements = [];
        resourceRequirements.push({
            type: 'MEMORY',
            value: this.memory.toMebibytes().toString(),
        });
        resourceRequirements.push({
            type: 'VCPU',
            value: this.cpu.toString(),
        });
        return resourceRequirements;
    }
}
/**
 * The resources to be limited
 */
var UlimitName;
(function (UlimitName) {
    /**
     * max core dump file size
     */
    UlimitName["CORE"] = "core";
    /**
     * max cpu time (seconds) for a process
     */
    UlimitName["CPU"] = "cpu";
    /**
     * max data segment size
     */
    UlimitName["DATA"] = "data";
    /**
     * max file size
     */
    UlimitName["FSIZE"] = "fsize";
    /**
     * max number of file locks
     */
    UlimitName["LOCKS"] = "locks";
    /**
     * max locked memory
     */
    UlimitName["MEMLOCK"] = "memlock";
    /**
     * max POSIX message queue size
     */
    UlimitName["MSGQUEUE"] = "msgqueue";
    /**
     * max nice value for any process this user is running
     */
    UlimitName["NICE"] = "nice";
    /**
     * maximum number of open file descriptors
     */
    UlimitName["NOFILE"] = "nofile";
    /**
     * maximum number of processes
     */
    UlimitName["NPROC"] = "nproc";
    /**
     * size of the process' resident set (in pages)
     */
    UlimitName["RSS"] = "rss";
    /**
     * max realtime priority
     */
    UlimitName["RTPRIO"] = "rtprio";
    /**
     * timeout for realtime tasks
     */
    UlimitName["RTTIME"] = "rttime";
    /**
     * max number of pending signals
     */
    UlimitName["SIGPENDING"] = "sigpending";
    /**
     * max stack size (in bytes)
     */
    UlimitName["STACK"] = "stack";
})(UlimitName || (exports.UlimitName = UlimitName = {}));
/**
 * A container orchestrated by ECS that uses EC2 resources
 */
class EcsEc2ContainerDefinition extends EcsContainerDefinitionBase {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_EcsEc2ContainerDefinitionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EcsEc2ContainerDefinition);
            }
            throw error;
        }
        this.privileged = props.privileged;
        this.ulimits = props.ulimits ?? [];
        this.gpu = props.gpu;
    }
    /**
     * @internal
     */
    _renderContainerDefinition() {
        return {
            ...super._renderContainerDefinition(),
            ulimits: core_1.Lazy.any({
                produce: () => {
                    if (this.ulimits.length === 0) {
                        return undefined;
                    }
                    return this.ulimits.map((ulimit) => ({
                        hardLimit: ulimit.hardLimit,
                        name: ulimit.name,
                        softLimit: ulimit.softLimit,
                    }));
                },
            }),
            privileged: this.privileged,
            resourceRequirements: this._renderResourceRequirements(),
        };
    }
    ;
    /**
     * Add a ulimit to this container
     */
    addUlimit(ulimit) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_Ulimit(ulimit);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addUlimit);
            }
            throw error;
        }
        this.ulimits.push(ulimit);
    }
    /**
     * @internal
     */
    _renderResourceRequirements() {
        const resourceRequirements = super._renderResourceRequirements();
        if (this.gpu) {
            resourceRequirements.push({
                type: 'GPU',
                value: this.gpu.toString(),
            });
        }
        return resourceRequirements;
    }
}
exports.EcsEc2ContainerDefinition = EcsEc2ContainerDefinition;
_e = JSII_RTTI_SYMBOL_1;
EcsEc2ContainerDefinition[_e] = { fqn: "@aws-cdk/aws-batch-alpha.EcsEc2ContainerDefinition", version: "0.0.0" };
/**
 * A container orchestrated by ECS that uses Fargate resources
 */
class EcsFargateContainerDefinition extends EcsContainerDefinitionBase {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_batch_alpha_EcsFargateContainerDefinitionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EcsFargateContainerDefinition);
            }
            throw error;
        }
        this.assignPublicIp = props.assignPublicIp;
        this.fargatePlatformVersion = props.fargatePlatformVersion;
        this.ephemeralStorageSize = props.ephemeralStorageSize;
        // validates ephemeralStorageSize is within limits
        if (props.ephemeralStorageSize) {
            if (props.ephemeralStorageSize.toGibibytes() > 200) {
                throw new Error(`ECS Fargate container '${id}' specifies 'ephemeralStorageSize' at ${props.ephemeralStorageSize.toGibibytes()} > 200 GB`);
            }
            else if (props.ephemeralStorageSize.toGibibytes() < 21) {
                throw new Error(`ECS Fargate container '${id}' specifies 'ephemeralStorageSize' at ${props.ephemeralStorageSize.toGibibytes()} < 21 GB`);
            }
        }
    }
    /**
     * @internal
     */
    _renderContainerDefinition() {
        return {
            ...super._renderContainerDefinition(),
            ephemeralStorage: this.ephemeralStorageSize ? {
                sizeInGiB: this.ephemeralStorageSize?.toGibibytes(),
            } : undefined,
            fargatePlatformConfiguration: {
                platformVersion: this.fargatePlatformVersion?.toString(),
            },
            networkConfiguration: {
                assignPublicIp: this.assignPublicIp ? 'ENABLED' : 'DISABLED',
            },
        };
    }
    ;
}
exports.EcsFargateContainerDefinition = EcsFargateContainerDefinition;
_f = JSII_RTTI_SYMBOL_1;
EcsFargateContainerDefinition[_f] = { fqn: "@aws-cdk/aws-batch-alpha.EcsFargateContainerDefinition", version: "0.0.0" };
function createExecutionRole(scope, id, logging) {
    const execRole = new iam.Role(scope, id, {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        // needed for cross-account access with TagParameterContainerImage
        roleName: core_1.PhysicalName.GENERATE_IF_NEEDED,
    });
    if (!logging) {
        // all jobs will fail without this if they produce any output at all when no logging is specified
        aws_logs_1.LogGroup.fromLogGroupName(scope, 'batchDefaultLogGroup', '/aws/batch/job').grantWrite(execRole);
    }
    return execRole;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWNvbnRhaW5lci1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWNzLWNvbnRhaW5lci1kZWZpbml0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLDJDQUEyQztBQUczQywyQ0FBNEQ7QUFDNUQsMkNBQW1EO0FBR25ELG1EQUFnRDtBQUVoRCxNQUFNLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsMERBQTBELENBQUMsQ0FBQztBQUNqRyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkRBQTJELENBQUMsQ0FBQztBQW9Cbkc7O0dBRUc7QUFDSCxNQUFzQixNQUFNO0lBQzFCOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUF5QjtRQUN0RCxPQUFPO1lBQ0wsR0FBRyxFQUFFLFNBQVMsQ0FBQyxZQUFZO1lBQzNCLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1NBQ25ELENBQUM7S0FDSDtJQUVEOzs7Ozs7Ozs7T0FTRztJQUNJLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUE4QixFQUFFLEtBQWM7UUFDN0UsT0FBTztZQUNMLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVM7WUFDaEUsUUFBUSxFQUFFLENBQUMsQ0FBQyxLQUFLO1lBQ2pCLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1NBQ2hELENBQUM7S0FDSDtJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSSxNQUFNLENBQUMseUJBQXlCLENBQUMsTUFBOEIsRUFBRSxXQUE4QixFQUFFLEtBQWM7Ozs7Ozs7Ozs7UUFDcEgsT0FBTztZQUNMLEdBQUcsRUFBRSxH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U0FDRjtLQUNGO0lBRUQ7O09BRUc7SUFDSSwwQkFBMEI7UUFDL0IsT0FBTztZQUNMLEdBQUcsS0FBSyxDQUFDLDBCQUEwQixFQUFFO1lBQ3JDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQSxDQUFDLENBQUM7Z0JBQzNDLFNBQVMsRUFBRSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsV0FBVyxFQUFFO2FBQ3BELENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDYiw0QkFBNEIsRUFBRTtnQkFDNUIsZUFBZSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLEVBQUU7YUFDekQ7WUFDRCxvQkFBb0IsRUFBRTtnQkFDcEIsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsVUFBVTthQUM3RDtTQUNGLENBQUM7S0FDSDtJQUFBLENBQUM7O0FBckNKLHNFQXNDQzs7O0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxPQUFnQjtJQUN6RSxNQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtRQUN2QyxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMseUJBQXlCLENBQUM7UUFDOUQsa0VBQWtFO1FBQ2xFLFFBQVEsRUFBRSxtQkFBWSxDQUFDLGtCQUFrQjtLQUMxQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1osaUdBQWlHO1FBQ2pHLG1CQUFRLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLHNCQUFzQixFQUFFLGdCQUFnQixDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2pHO0lBRUQsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCB7IElGaWxlU3lzdGVtIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVmcyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnYXdzLWNkay1saWIvYXdzLXNzbSc7XG5pbXBvcnQgKiBhcyBzZWNyZXRzbWFuYWdlciBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc2VjcmV0c21hbmFnZXInO1xuaW1wb3J0IHsgTGF6eSwgUGh5c2ljYWxOYW1lLCBTaXplIH0gZnJvbSAnYXdzLWNkay1saWIvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkpvYkRlZmluaXRpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYmF0Y2gnO1xuaW1wb3J0IHsgTGludXhQYXJhbWV0ZXJzIH0gZnJvbSAnLi9saW51eC1wYXJhbWV0ZXJzJztcbmltcG9ydCB7IExvZ0dyb3VwIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWxvZ3MnO1xuXG5jb25zdCBFRlNfVk9MVU1FX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ2F3cy1jZGstbGliL2F3cy1iYXRjaC9saWIvY29udGFpbmVyLWRlZmluaXRpb24uRWZzVm9sdW1lJyk7XG5jb25zdCBIT1NUX1ZPTFVNRV9TWU1CT0wgPSBTeW1ib2wuZm9yKCdhd3MtY2RrLWxpYi9hd3MtYmF0Y2gvbGliL2NvbnRhaW5lci1kZWZpbml0aW9uLkhvc3RWb2x1bWUnKTtcblxuLyoqXG4gKiBTcGVjaWZ5IHRoZSBzZWNyZXQncyB2ZXJzaW9uIGlkIG9yIHZlcnNpb24gc3RhZ2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZWNyZXRWZXJzaW9uSW5mbyB7XG4gIC8qKlxuICAgKiB2ZXJzaW9uIGlkIG9mIHRoZSBzZWNyZXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSB1c2UgZGVmYXVsdCB2ZXJzaW9uIGlkXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uSWQ/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiB2ZXJzaW9uIHN0YWdlIG9mIHRoZSBzZWNyZXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSB1c2UgZGVmYXVsdCB2ZXJzaW9uIHN0YWdlXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uU3RhZ2U/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBzZWNyZXQgZW52aXJvbm1lbnQgdmFyaWFibGUuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTZWNyZXQge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBlbnZpcm9ubWVudCB2YXJpYWJsZSB2YWx1ZSBmcm9tIGEgcGFyYW1ldGVyIHN0b3JlZCBpbiBBV1NcbiAgICogU3lzdGVtcyBNYW5hZ2VyIFBhcmFtZXRlciBTdG9yZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNzbVBhcmFtZXRlcihwYXJhbWV0ZXI6IHNzbS5JUGFyYW1ldGVyKTogU2VjcmV0IHtcbiAgICByZXR1cm4ge1xuICAgICAgYXJuOiBwYXJhbWV0ZXIucGFyYW1ldGVyQXJuLFxuICAgICAgZ3JhbnRSZWFkOiBncmFudGVlID0+IHBhcmFtZXRlci5ncmFudFJlYWQoZ3JhbnRlZSksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZW52aXJvbm1lbnQgdmFyaWFibGUgdmFsdWUgZnJvbSBhIHNlY3JldCBzdG9yZWQgaW4gQVdTIFNlY3JldHNcbiAgICogTWFuYWdlci5cbiAgICpcbiAgICogQHBhcmFtIHNlY3JldCB0aGUgc2VjcmV0IHN0b3JlZCBpbiBBV1MgU2VjcmV0cyBNYW5hZ2VyXG4gICAqIEBwYXJhbSBmaWVsZCB0aGUgbmFtZSBvZiB0aGUgZmllbGQgd2l0aCB0aGUgdmFsdWUgdGhhdCB5b3Ugd2FudCB0byBzZXQgYXNcbiAgICogdGhlIGVudmlyb25tZW50IHZhcmlhYmxlIHZhbHVlLiBPbmx5IHZhbHVlcyBpbiBKU09OIGZvcm1hdCBhcmUgc3VwcG9ydGVkLlxuICAgKiBJZiB5b3UgZG8gbm90IHNwZWNpZnkgYSBKU09OIGZpZWxkLCB0aGVuIHRoZSBmdWxsIGNvbnRlbnQgb2YgdGhlIHNlY3JldCBpc1xuICAgKiB1c2VkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU2VjcmV0c01hbmFnZXIoc2VjcmV0OiBzZWNyZXRzbWFuYWdlci5JU2VjcmV0LCBmaWVsZD86IHN0cmluZyk6IFNlY3JldCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFybjogZmllbGQgPyBgJHtzZWNyZXQuc2VjcmV0QXJufToke2ZpZWxkfTo6YCA6IHNlY3JldC5zZWNyZXRBcm4sXG4gICAgICBoYXNGaWVsZDogISFmaWVsZCxcbiAgICAgIGdyYW50UmVhZDogZ3JhbnRlZSA9PiBzZWNyZXQuZ3JhbnRSZWFkKGdyYW50ZWUpLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGVudmlyb25tZW50IHZhcmlhYmxlIHZhbHVlIGZyb20gYSBzZWNyZXQgc3RvcmVkIGluIEFXUyBTZWNyZXRzXG4gICAqIE1hbmFnZXIuXG4gICAqXG4gICAqIEBwYXJhbSBzZWNyZXQgdGhlIHNlY3JldCBzdG9yZWQgaW4gQVdTIFNlY3JldHMgTWFuYWdlclxuICAgKiBAcGFyYW0gdmVyc2lvbkluZm8gdGhlIHZlcnNpb24gaW5mb3JtYXRpb24gdG8gcmVmZXJlbmNlIHRoZSBzZWNyZXRcbiAgICogQHBhcmFtIGZpZWxkIHRoZSBuYW1lIG9mIHRoZSBmaWVsZCB3aXRoIHRoZSB2YWx1ZSB0aGF0IHlvdSB3YW50IHRvIHNldCBhc1xuICAgKiB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGUgdmFsdWUuIE9ubHkgdmFsdWVzIGluIEpTT04gZm9ybWF0IGFyZSBzdXBwb3J0ZWQuXG4gICAqIElmIHlvdSBkbyBub3Qgc3BlY2lmeSBhIEpTT04gZmllbGQsIHRoZW4gdGhlIGZ1bGwgY29udGVudCBvZiB0aGUgc2VjcmV0IGlzXG4gICAqIHVzZWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TZWNyZXRzTWFuYWdlclZlcnNpb24oc2VjcmV0OiBzZWNyZXRzbWFuYWdlci5JU2VjcmV0LCB2ZXJzaW9uSW5mbzogU2VjcmV0VmVyc2lvbkluZm8sIGZpZWxkPzogc3RyaW5nKTogU2VjcmV0IHtcbiAgICByZXR1cm4ge1xuICAgICAgYXJuOiBgJHtzZWNyZXQuc2VjcmV0QXJufToke2ZpZWxkID8/ICcnfToke3ZlcnNpb25JbmZvLnZlcnNpb25TdGFnZSA/PyAnJ306JHt2ZXJzaW9uSW5mby52ZXJzaW9uSWQgPz8gJyd9YCxcbiAgICAgIGhhc0ZpZWxkOiAhIWZpZWxkLFxuICAgICAgZ3JhbnRSZWFkOiBncmFudGVlID0+IHNlY3JldC5ncmFudFJlYWQoZ3JhbnRlZSksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBzZWNyZXRcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBhcm46IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIHNlY3JldCB1c2VzIGEgc3BlY2lmaWMgSlNPTiBmaWVsZFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGhhc0ZpZWxkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogR3JhbnRzIHJlYWRpbmcgdGhlIHNlY3JldCB0byBhIHByaW5jaXBhbFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IGdyYW50UmVhZChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudDtcbn1cblxuLyoqXG4gKiBPcHRpb25zIHRvIGNvbmZpZ3VyZSBhbiBFY3NWb2x1bWVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFY3NWb2x1bWVPcHRpb25zIHtcbiAgLyoqXG4gICAqIHRoZSBuYW1lIG9mIHRoaXMgdm9sdW1lXG4gICAqL1xuICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIHRoZSBwYXRoIG9uIHRoZSBjb250YWluZXIgd2hlcmUgdGhpcyB2b2x1bWUgaXMgbW91bnRlZFxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyUGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBpZiBzZXQsIHRoZSBjb250YWluZXIgd2lsbCBoYXZlIHJlYWRvbmx5IGFjY2VzcyB0byB0aGUgdm9sdW1lXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSByZWFkb25seT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIFZvbHVtZSB0aGF0IGNhbiBiZSBtb3VudGVkIHRvIGEgY29udGFpbmVyIHRoYXQgdXNlcyBFQ1NcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVjc1ZvbHVtZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgVm9sdW1lIHRoYXQgdXNlcyBhbiBBV1MgRWxhc3RpYyBGaWxlIFN5c3RlbSAoRUZTKTsgdGhpcyB2b2x1bWUgY2FuIGdyb3cgYW5kIHNocmluayBhcyBuZWVkZWRcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYmF0Y2gvbGF0ZXN0L3VzZXJndWlkZS9lZnMtdm9sdW1lcy5odG1sXG4gICAqL1xuICBzdGF0aWMgZWZzKG9wdGlvbnM6IEVmc1ZvbHVtZU9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IEVmc1ZvbHVtZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgSG9zdCB2b2x1bWUuIFRoaXMgdm9sdW1lIHdpbGwgcGVyc2lzdCBvbiB0aGUgaG9zdCBhdCB0aGUgc3BlY2lmaWVkIGBob3N0UGF0aGAuXG4gICAqIElmIHRoZSBgaG9zdFBhdGhgIGlzIG5vdCBzcGVjaWZpZWQsIERvY2tlciB3aWxsIGNob29zZSB0aGUgaG9zdCBwYXRoLiBJbiB0aGlzIGNhc2UsXG4gICAqIHRoZSBkYXRhIG1heSBub3QgcGVyc2lzdCBhZnRlciB0aGUgY29udGFpbmVycyB0aGF0IHVzZSBpdCBzdG9wIHJ1bm5pbmcuXG4gICAqL1xuICBzdGF0aWMgaG9zdChvcHRpb25zOiBIb3N0Vm9sdW1lT3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgSG9zdFZvbHVtZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGlzIHZvbHVtZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHBhdGggb24gdGhlIGNvbnRhaW5lciB0aGF0IHRoaXMgdm9sdW1lIHdpbGwgYmUgbW91bnRlZCB0b1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbnRhaW5lclBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhlIGNvbnRhaW5lciBoYXMgcmVhZG9ubHkgYWNjZXNzIHRvIHRoaXMgdm9sdW1lXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcmVhZG9ubHk/OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEVjc1ZvbHVtZU9wdGlvbnMpIHtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdGhpcy5jb250YWluZXJQYXRoID0gb3B0aW9ucy5jb250YWluZXJQYXRoO1xuICAgIHRoaXMucmVhZG9ubHkgPSBvcHRpb25zLnJlYWRvbmx5O1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgY29uZmlndXJpbmcgYW4gRWZzVm9sdW1lXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWZzVm9sdW1lT3B0aW9ucyBleHRlbmRzIEVjc1ZvbHVtZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIEVGUyBGaWxlIFN5c3RlbSB0aGF0IHN1cHBvcnRzIHRoaXMgdm9sdW1lXG4gICAqL1xuICByZWFkb25seSBmaWxlU3lzdGVtOiBJRmlsZVN5c3RlbTtcblxuICAvKipcbiAgICogVGhlIGRpcmVjdG9yeSB3aXRoaW4gdGhlIEFtYXpvbiBFRlMgZmlsZSBzeXN0ZW0gdG8gbW91bnQgYXMgdGhlIHJvb3QgZGlyZWN0b3J5IGluc2lkZSB0aGUgaG9zdC5cbiAgICogSWYgdGhpcyBwYXJhbWV0ZXIgaXMgb21pdHRlZCwgdGhlIHJvb3Qgb2YgdGhlIEFtYXpvbiBFRlMgdm9sdW1lIGlzIHVzZWQgaW5zdGVhZC5cbiAgICogU3BlY2lmeWluZyBgL2AgaGFzIHRoZSBzYW1lIGVmZmVjdCBhcyBvbWl0dGluZyB0aGlzIHBhcmFtZXRlci5cbiAgICogVGhlIG1heGltdW0gbGVuZ3RoIGlzIDQsMDk2IGNoYXJhY3RlcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gcm9vdCBvZiB0aGUgRUZTIEZpbGUgU3lzdGVtXG4gICAqL1xuICByZWFkb25seSByb290RGlyZWN0b3J5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBFbmFibGVzIGVuY3J5cHRpb24gZm9yIEFtYXpvbiBFRlMgZGF0YSBpbiB0cmFuc2l0IGJldHdlZW4gdGhlIEFtYXpvbiBFQ1MgaG9zdCBhbmQgdGhlIEFtYXpvbiBFRlMgc2VydmVyXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vmcy9sYXRlc3QvdWcvZW5jcnlwdGlvbi1pbi10cmFuc2l0Lmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZVRyYW5zaXRFbmNyeXB0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHBvcnQgdG8gdXNlIHdoZW4gc2VuZGluZyBlbmNyeXB0ZWQgZGF0YSBiZXR3ZWVuIHRoZSBBbWF6b24gRUNTIGhvc3QgYW5kIHRoZSBBbWF6b24gRUZTIHNlcnZlci5cbiAgICogVGhlIHZhbHVlIG11c3QgYmUgYmV0d2VlbiAwIGFuZCA2NSw1MzUuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vmcy9sYXRlc3QvdWcvZWZzLW1vdW50LWhlbHBlci5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gY2hvc2VuIGJ5IHRoZSBFRlMgTW91bnQgSGVscGVyXG4gICAqL1xuICByZWFkb25seSB0cmFuc2l0RW5jcnlwdGlvblBvcnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBBbWF6b24gRUZTIGFjY2VzcyBwb2ludCBJRCB0byB1c2UuXG4gICAqIElmIGFuIGFjY2VzcyBwb2ludCBpcyBzcGVjaWZpZWQsIGByb290RGlyZWN0b3J5YCBtdXN0IGVpdGhlciBiZSBvbWl0dGVkIG9yIHNldCB0byBgL2BcbiAgICogd2hpY2ggZW5mb3JjZXMgdGhlIHBhdGggc2V0IG9uIHRoZSBFRlMgYWNjZXNzIHBvaW50LlxuICAgKiBJZiBhbiBhY2Nlc3MgcG9pbnQgaXMgdXNlZCwgYGVuYWJsZVRyYW5zaXRFbmNyeXB0aW9uYCBtdXN0IGJlIGB0cnVlYC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWZzL2xhdGVzdC91Zy9lZnMtYWNjZXNzLXBvaW50cy5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYWNjZXNzUG9pbnRJZFxuICAgKi9cbiAgcmVhZG9ubHkgYWNjZXNzUG9pbnRJZD86IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdG8gdXNlIHRoZSBBV1MgQmF0Y2ggam9iIElBTSByb2xlIGRlZmluZWQgaW4gYSBqb2IgZGVmaW5pdGlvbiB3aGVuIG1vdW50aW5nIHRoZSBBbWF6b24gRUZTIGZpbGUgc3lzdGVtLlxuICAgKiBJZiBzcGVjaWZpZWQsIGBlbmFibGVUcmFuc2l0RW5jcnlwdGlvbmAgbXVzdCBiZSBgdHJ1ZWAuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2JhdGNoL2xhdGVzdC91c2VyZ3VpZGUvZWZzLXZvbHVtZXMuaHRtbCNlZnMtdm9sdW1lLWFjY2Vzc3BvaW50c1xuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgdXNlSm9iUm9sZT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBWb2x1bWUgdGhhdCB1c2VzIGFuIEFXUyBFbGFzdGljIEZpbGUgU3lzdGVtIChFRlMpOyB0aGlzIHZvbHVtZSBjYW4gZ3JvdyBhbmQgc2hyaW5rIGFzIG5lZWRlZFxuICovXG5leHBvcnQgY2xhc3MgRWZzVm9sdW1lIGV4dGVuZHMgRWNzVm9sdW1lIHtcbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB4IGlzIGFuIEVmc1ZvbHVtZSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzRWZzVm9sdW1lKHg6IGFueSkgOiB4IGlzIEVmc1ZvbHVtZSB7XG4gICAgcmV0dXJuIHggIT09IG51bGwgJiYgdHlwZW9mKHgpID09PSAnb2JqZWN0JyAmJiBFRlNfVk9MVU1FX1NZTUJPTCBpbiB4O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBFRlMgRmlsZSBTeXN0ZW0gdGhhdCBzdXBwb3J0cyB0aGlzIHZvbHVtZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGZpbGVTeXN0ZW06IElGaWxlU3lzdGVtO1xuXG4gIC8qKlxuICAgKiBUaGUgZGlyZWN0b3J5IHdpdGhpbiB0aGUgQW1hem9uIEVGUyBmaWxlIHN5c3RlbSB0byBtb3VudCBhcyB0aGUgcm9vdCBkaXJlY3RvcnkgaW5zaWRlIHRoZSBob3N0LlxuICAgKiBJZiB0aGlzIHBhcmFtZXRlciBpcyBvbWl0dGVkLCB0aGUgcm9vdCBvZiB0aGUgQW1hem9uIEVGUyB2b2x1bWUgaXMgdXNlZCBpbnN0ZWFkLlxuICAgKiBTcGVjaWZ5aW5nIGAvYCBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzIG9taXR0aW5nIHRoaXMgcGFyYW1ldGVyLlxuICAgKiBUaGUgbWF4aW11bSBsZW5ndGggaXMgNCwwOTYgY2hhcmFjdGVycy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSByb290IG9mIHRoZSBFRlMgRmlsZSBTeXN0ZW1cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSByb290RGlyZWN0b3J5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBFbmFibGVzIGVuY3J5cHRpb24gZm9yIEFtYXpvbiBFRlMgZGF0YSBpbiB0cmFuc2l0IGJldHdlZW4gdGhlIEFtYXpvbiBFQ1MgaG9zdCBhbmQgdGhlIEFtYXpvbiBFRlMgc2VydmVyXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Vmcy9sYXRlc3QvdWcvZW5jcnlwdGlvbi1pbi10cmFuc2l0Lmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBlbmFibGVUcmFuc2l0RW5jcnlwdGlvbj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBwb3J0IHRvIHVzZSB3aGVuIHNlbmRpbmcgZW5jcnlwdGVkIGRhdGEgYmV0d2VlbiB0aGUgQW1hem9uIEVDUyBob3N0IGFuZCB0aGUgQW1hem9uIEVGUyBzZXJ2ZXIuXG4gICAqIFRoZSB2YWx1ZSBtdXN0IGJlIGJldHdlZW4gMCBhbmQgNjUsNTM1LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lZnMvbGF0ZXN0L3VnL2Vmcy1tb3VudC1oZWxwZXIuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGNob3NlbiBieSB0aGUgRUZTIE1vdW50IEhlbHBlclxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHRyYW5zaXRFbmNyeXB0aW9uUG9ydD86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBFRlMgYWNjZXNzIHBvaW50IElEIHRvIHVzZS5cbiAgICogSWYgYW4gYWNjZXNzIHBvaW50IGlzIHNwZWNpZmllZCwgYHJvb3REaXJlY3RvcnlgIG11c3QgZWl0aGVyIGJlIG9taXR0ZWQgb3Igc2V0IHRvIGAvYFxuICAgKiB3aGljaCBlbmZvcmNlcyB0aGUgcGF0aCBzZXQgb24gdGhlIEVGUyBhY2Nlc3MgcG9pbnQuXG4gICAqIElmIGFuIGFjY2VzcyBwb2ludCBpcyB1c2VkLCBgZW5hYmxlVHJhbnNpdEVuY3J5cHRpb25gIG11c3QgYmUgYHRydWVgLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lZnMvbGF0ZXN0L3VnL2Vmcy1hY2Nlc3MtcG9pbnRzLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBhY2Nlc3NQb2ludElkXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYWNjZXNzUG9pbnRJZD86IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdG8gdXNlIHRoZSBBV1MgQmF0Y2ggam9iIElBTSByb2xlIGRlZmluZWQgaW4gYSBqb2IgZGVmaW5pdGlvbiB3aGVuIG1vdW50aW5nIHRoZSBBbWF6b24gRUZTIGZpbGUgc3lzdGVtLlxuICAgKiBJZiBzcGVjaWZpZWQsIGBlbmFibGVUcmFuc2l0RW5jcnlwdGlvbmAgbXVzdCBiZSBgdHJ1ZWAuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2JhdGNoL2xhdGVzdC91c2VyZ3VpZGUvZWZzLXZvbHVtZXMuaHRtbCNlZnMtdm9sdW1lLWFjY2Vzc3BvaW50c1xuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHVzZUpvYlJvbGU/OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEVmc1ZvbHVtZU9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIHRoaXMuZmlsZVN5c3RlbSA9IG9wdGlvbnMuZmlsZVN5c3RlbTtcbiAgICB0aGlzLnJvb3REaXJlY3RvcnkgPSBvcHRpb25zLnJvb3REaXJlY3Rvcnk7XG4gICAgdGhpcy5lbmFibGVUcmFuc2l0RW5jcnlwdGlvbiA9IG9wdGlvbnMuZW5hYmxlVHJhbnNpdEVuY3J5cHRpb247XG4gICAgdGhpcy50cmFuc2l0RW5jcnlwdGlvblBvcnQgPSBvcHRpb25zLnRyYW5zaXRFbmNyeXB0aW9uUG9ydDtcbiAgICB0aGlzLmFjY2Vzc1BvaW50SWQgPSBvcHRpb25zLmFjY2Vzc1BvaW50SWQ7XG4gICAgdGhpcy51c2VKb2JSb2xlID0gb3B0aW9ucy51c2VKb2JSb2xlO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShFZnNWb2x1bWUucHJvdG90eXBlLCBFRlNfVk9MVU1FX1NZTUJPTCwge1xuICB2YWx1ZTogdHJ1ZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiBmYWxzZSxcbn0pO1xuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGNvbmZpZ3VyaW5nIGFuIEVDUyBIb3N0Vm9sdW1lXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSG9zdFZvbHVtZU9wdGlvbnMgZXh0ZW5kcyBFY3NWb2x1bWVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwYXRoIG9uIHRoZSBob3N0IG1hY2hpbmUgdGhpcyBjb250YWluZXIgd2lsbCBoYXZlIGFjY2VzcyB0b1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIERvY2tlciB3aWxsIGNob29zZSB0aGUgaG9zdCBwYXRoLlxuICAgKiBUaGUgZGF0YSBtYXkgbm90IHBlcnNpc3QgYWZ0ZXIgdGhlIGNvbnRhaW5lcnMgdGhhdCB1c2UgaXQgc3RvcCBydW5uaW5nLlxuICAgKi9cbiAgcmVhZG9ubHkgaG9zdFBhdGg/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIEhvc3Qgdm9sdW1lLiBUaGlzIHZvbHVtZSB3aWxsIHBlcnNpc3Qgb24gdGhlIGhvc3QgYXQgdGhlIHNwZWNpZmllZCBgaG9zdFBhdGhgLlxuICogSWYgdGhlIGBob3N0UGF0aGAgaXMgbm90IHNwZWNpZmllZCwgRG9ja2VyIHdpbGwgY2hvb3NlIHRoZSBob3N0IHBhdGguIEluIHRoaXMgY2FzZSxcbiAqIHRoZSBkYXRhIG1heSBub3QgcGVyc2lzdCBhZnRlciB0aGUgY29udGFpbmVycyB0aGF0IHVzZSBpdCBzdG9wIHJ1bm5pbmcuXG4gKi9cbmV4cG9ydCBjbGFzcyBIb3N0Vm9sdW1lIGV4dGVuZHMgRWNzVm9sdW1lIHtcbiAgLyoqXG4gICAqIHJldHVybnMgYHRydWVgIGlmIGB4YCBpcyBhIGBIb3N0Vm9sdW1lYCwgYGZhbHNlYCBvdGhlcndpc2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNIb3N0Vm9sdW1lKHg6IGFueSk6IHggaXMgSG9zdFZvbHVtZSB7XG4gICAgcmV0dXJuIHggIT09IG51bGwgJiYgdHlwZW9mICh4KSA9PT0gJ29iamVjdCcgJiYgSE9TVF9WT0xVTUVfU1lNQk9MIGluIHg7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHBhdGggb24gdGhlIGhvc3QgbWFjaGluZSB0aGlzIGNvbnRhaW5lciB3aWxsIGhhdmUgYWNjZXNzIHRvXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaG9zdFBhdGg/OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogSG9zdFZvbHVtZU9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgICB0aGlzLmhvc3RQYXRoID0gb3B0aW9ucy5ob3N0UGF0aDtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoSG9zdFZvbHVtZS5wcm90b3R5cGUsIEhPU1RfVk9MVU1FX1NZTUJPTCwge1xuICB2YWx1ZTogdHJ1ZSxcbiAgZW51bWVyYWJsZTogZmFsc2UsXG4gIHdyaXRhYmxlOiBmYWxzZSxcbn0pO1xuXG4vKipcbiAqIEEgY29udGFpbmVyIHRoYXQgY2FuIGJlIHJ1biB3aXRoIEVDUyBvcmNoZXN0cmF0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUVjc0NvbnRhaW5lckRlZmluaXRpb24gZXh0ZW5kcyBJQ29uc3RydWN0IHtcbiAgLyoqXG4gICAqIFRoZSBpbWFnZSB0aGF0IHRoaXMgY29udGFpbmVyIHdpbGwgcnVuXG4gICAqL1xuICByZWFkb25seSBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHZDUFVzIHJlc2VydmVkIGZvciB0aGUgY29udGFpbmVyLlxuICAgKiBFYWNoIHZDUFUgaXMgZXF1aXZhbGVudCB0byAxLDAyNCBDUFUgc2hhcmVzLlxuICAgKiBGb3IgY29udGFpbmVycyBydW5uaW5nIG9uIEVDMiByZXNvdXJjZXMsIHlvdSBtdXN0IHNwZWNpZnkgYXQgbGVhc3Qgb25lIHZDUFUuXG4gICAqL1xuICByZWFkb25seSBjcHU6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIG1lbW9yeSBoYXJkIGxpbWl0IHByZXNlbnQgdG8gdGhlIGNvbnRhaW5lci5cbiAgICogSWYgeW91ciBjb250YWluZXIgYXR0ZW1wdHMgdG8gZXhjZWVkIHRoZSBtZW1vcnkgc3BlY2lmaWVkLCB0aGUgY29udGFpbmVyIGlzIHRlcm1pbmF0ZWQuXG4gICAqIFlvdSBtdXN0IHNwZWNpZnkgYXQgbGVhc3QgNCBNaUIgb2YgbWVtb3J5IGZvciBhIGpvYi5cbiAgICovXG4gIHJlYWRvbmx5IG1lbW9yeTogU2l6ZTtcblxuICAvKipcbiAgICogVGhlIGNvbW1hbmQgdGhhdCdzIHBhc3NlZCB0byB0aGUgY29udGFpbmVyXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9idWlsZGVyLyNjbWRcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1hbmQ/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIGVudmlyb25tZW50IHZhcmlhYmxlcyB0byBwYXNzIHRvIGEgY29udGFpbmVyLlxuICAgKiBDYW5ub3Qgc3RhcnQgd2l0aCBgQVdTX0JBVENIYC5cbiAgICogV2UgZG9uJ3QgcmVjb21tZW5kIHVzaW5nIHBsYWludGV4dCBlbnZpcm9ubWVudCB2YXJpYWJsZXMgZm9yIHNlbnNpdGl2ZSBpbmZvcm1hdGlvbiwgc3VjaCBhcyBjcmVkZW50aWFsIGRhdGEuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gICAqL1xuICByZWFkb25seSBlbnZpcm9ubWVudD86IHsgW2tleTpzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogVGhlIHJvbGUgdXNlZCBieSBBbWF6b24gRUNTIGNvbnRhaW5lciBhbmQgQVdTIEZhcmdhdGUgYWdlbnRzIHRvIG1ha2UgQVdTIEFQSSBjYWxscyBvbiB5b3VyIGJlaGFsZi5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYmF0Y2gvbGF0ZXN0L3VzZXJndWlkZS9leGVjdXRpb24tSUFNLXJvbGUuaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgZXhlY3V0aW9uUm9sZTogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgcm9sZSB0aGF0IHRoZSBjb250YWluZXIgY2FuIGFzc3VtZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBqb2JSb2xlXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUy9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdGFzay1pYW0tcm9sZXMuaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgam9iUm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogTGludXgtc3BlY2lmaWMgbW9kaWZpY2F0aW9ucyB0aGF0IGFyZSBhcHBsaWVkIHRvIHRoZSBjb250YWluZXIsIHN1Y2ggYXMgZGV0YWlscyBmb3IgZGV2aWNlIG1hcHBpbmdzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBub25lXG4gICAqL1xuICByZWFkb25seSBsaW51eFBhcmFtZXRlcnM/OiBMaW51eFBhcmFtZXRlcnM7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSBsb2cgZHJpdmVyXG4gICAqL1xuICByZWFkb25seSBsb2dEcml2ZXJDb25maWc/OiBlY3MuTG9nRHJpdmVyQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBHaXZlcyB0aGUgY29udGFpbmVyIHJlYWRvbmx5IGFjY2VzcyB0byBpdHMgcm9vdCBmaWxlc3lzdGVtLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVhZG9ubHlSb290RmlsZXN5c3RlbT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgbWFwIGZyb20gZW52aXJvbm1lbnQgdmFyaWFibGUgbmFtZXMgdG8gdGhlIHNlY3JldHMgZm9yIHRoZSBjb250YWluZXIuIEFsbG93cyB5b3VyIGpvYiBkZWZpbml0aW9uc1xuICAgKiB0byByZWZlcmVuY2UgdGhlIHNlY3JldCBieSB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGUgbmFtZSBkZWZpbmVkIGluIHRoaXMgcHJvcGVydHkuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2JhdGNoL2xhdGVzdC91c2VyZ3VpZGUvc3BlY2lmeWluZy1zZW5zaXRpdmUtZGF0YS5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gc2VjcmV0c1xuICAgKi9cbiAgcmVhZG9ubHkgc2VjcmV0cz86IHsgW2VudlZhck5hbWU6IHN0cmluZ106IFNlY3JldCB9O1xuXG4gIC8qKlxuICAgKiBUaGUgdXNlciBuYW1lIHRvIHVzZSBpbnNpZGUgdGhlIGNvbnRhaW5lclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHVzZXJcbiAgICovXG4gIHJlYWRvbmx5IHVzZXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB2b2x1bWVzIHRvIG1vdW50IHRvIHRoaXMgY29udGFpbmVyLiBBdXRvbWF0aWNhbGx5IGFkZGVkIHRvIHRoZSBqb2IgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyB2b2x1bWVzXG4gICAqL1xuICByZWFkb25seSB2b2x1bWVzOiBFY3NWb2x1bWVbXTtcblxuICAvKipcbiAgICogUmVuZGVycyB0aGlzIGNvbnRhaW5lciB0byBDbG91ZEZvcm1hdGlvblxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9yZW5kZXJDb250YWluZXJEZWZpbml0aW9uKCk6IENmbkpvYkRlZmluaXRpb24uQ29udGFpbmVyUHJvcGVydGllc1Byb3BlcnR5O1xuXG4gIC8qKlxuICAgKiBBZGQgYSBWb2x1bWUgdG8gdGhpcyBjb250YWluZXJcbiAgICovXG4gIGFkZFZvbHVtZSh2b2x1bWU6IEVjc1ZvbHVtZSk6IHZvaWQ7XG59XG5cbi8qKlxuICogUHJvcHMgdG8gY29uZmlndXJlIGFuIEVjc0NvbnRhaW5lckRlZmluaXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFY3NDb250YWluZXJEZWZpbml0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIGltYWdlIHRoYXQgdGhpcyBjb250YWluZXIgd2lsbCBydW5cbiAgICovXG4gIHJlYWRvbmx5IGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2U7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgdkNQVXMgcmVzZXJ2ZWQgZm9yIHRoZSBjb250YWluZXIuXG4gICAqIEVhY2ggdkNQVSBpcyBlcXVpdmFsZW50IHRvIDEsMDI0IENQVSBzaGFyZXMuXG4gICAqIEZvciBjb250YWluZXJzIHJ1bm5pbmcgb24gRUMyIHJlc291cmNlcywgeW91IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgdkNQVS5cbiAgICovXG4gIHJlYWRvbmx5IGNwdTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbWVtb3J5IGhhcmQgbGltaXQgcHJlc2VudCB0byB0aGUgY29udGFpbmVyLlxuICAgKiBJZiB5b3VyIGNvbnRhaW5lciBhdHRlbXB0cyB0byBleGNlZWQgdGhlIG1lbW9yeSBzcGVjaWZpZWQsIHRoZSBjb250YWluZXIgaXMgdGVybWluYXRlZC5cbiAgICogWW91IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCA0IE1pQiBvZiBtZW1vcnkgZm9yIGEgam9iLlxuICAgKi9cbiAgcmVhZG9ubHkgbWVtb3J5OiBTaXplO1xuXG4gIC8qKlxuICAgKiBUaGUgY29tbWFuZCB0aGF0J3MgcGFzc2VkIHRvIHRoZSBjb250YWluZXJcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2J1aWxkZXIvI2NtZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGNvbW1hbmRcbiAgICovXG4gIHJlYWRvbmx5IGNvbW1hbmQ/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIGVudmlyb25tZW50IHZhcmlhYmxlcyB0byBwYXNzIHRvIGEgY29udGFpbmVyLlxuICAgKiBDYW5ub3Qgc3RhcnQgd2l0aCBgQVdTX0JBVENIYC5cbiAgICogV2UgZG9uJ3QgcmVjb21tZW5kIHVzaW5nIHBsYWludGV4dCBlbnZpcm9ubWVudCB2YXJpYWJsZXMgZm9yIHNlbnNpdGl2ZSBpbmZvcm1hdGlvbiwgc3VjaCBhcyBjcmVkZW50aWFsIGRhdGEuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gZW52aXJvbm1lbnQgdmFyaWFibGVzXG4gICAqL1xuICByZWFkb25seSBlbnZpcm9ubWVudD86IHsgW2tleTpzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogVGhlIHJvbGUgdXNlZCBieSBBbWF6b24gRUNTIGNvbnRhaW5lciBhbmQgQVdTIEZhcmdhdGUgYWdlbnRzIHRvIG1ha2UgQVdTIEFQSSBjYWxscyBvbiB5b3VyIGJlaGFsZi5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYmF0Y2gvbGF0ZXN0L3VzZXJndWlkZS9leGVjdXRpb24tSUFNLXJvbGUuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGEgUm9sZSB3aWxsIGJlIGNyZWF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IGV4ZWN1dGlvblJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFRoZSByb2xlIHRoYXQgdGhlIGNvbnRhaW5lciBjYW4gYXNzdW1lLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3Rhc2staWFtLXJvbGVzLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBqb2Igcm9sZVxuICAgKi9cbiAgcmVhZG9ubHkgam9iUm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogTGludXgtc3BlY2lmaWMgbW9kaWZpY2F0aW9ucyB0aGF0IGFyZSBhcHBsaWVkIHRvIHRoZSBjb250YWluZXIsIHN1Y2ggYXMgZGV0YWlscyBmb3IgZGV2aWNlIG1hcHBpbmdzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBub25lXG4gICAqL1xuICByZWFkb25seSBsaW51eFBhcmFtZXRlcnM/OiBMaW51eFBhcmFtZXRlcnM7XG5cbiAgLyoqXG4gICAqIFRoZSBsb2dpbmcgY29uZmlndXJhdGlvbiBmb3IgdGhpcyBKb2JcbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgbG9nIGNvbmZpZ3VyYXRpb24gb2YgdGhlIERvY2tlciBkYWVtb25cbiAgICovXG4gIHJlYWRvbmx5IGxvZ2dpbmc/OiBlY3MuTG9nRHJpdmVyO1xuXG4gIC8qKlxuICAgKiBHaXZlcyB0aGUgY29udGFpbmVyIHJlYWRvbmx5IGFjY2VzcyB0byBpdHMgcm9vdCBmaWxlc3lzdGVtLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVhZG9ubHlSb290RmlsZXN5c3RlbT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgbWFwIGZyb20gZW52aXJvbm1lbnQgdmFyaWFibGUgbmFtZXMgdG8gdGhlIHNlY3JldHMgZm9yIHRoZSBjb250YWluZXIuIEFsbG93cyB5b3VyIGpvYiBkZWZpbml0aW9uc1xuICAgKiB0byByZWZlcmVuY2UgdGhlIHNlY3JldCBieSB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGUgbmFtZSBkZWZpbmVkIGluIHRoaXMgcHJvcGVydHkuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2JhdGNoL2xhdGVzdC91c2VyZ3VpZGUvc3BlY2lmeWluZy1zZW5zaXRpdmUtZGF0YS5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gc2VjcmV0c1xuICAgKi9cbiAgcmVhZG9ubHkgc2VjcmV0cz86IHsgW2VudlZhck5hbWU6IHN0cmluZ106IFNlY3JldCB9O1xuXG4gIC8qKlxuICAgKiBUaGUgdXNlciBuYW1lIHRvIHVzZSBpbnNpZGUgdGhlIGNvbnRhaW5lclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHVzZXJcbiAgICovXG4gIHJlYWRvbmx5IHVzZXI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB2b2x1bWVzIHRvIG1vdW50IHRvIHRoaXMgY29udGFpbmVyLiBBdXRvbWF0aWNhbGx5IGFkZGVkIHRvIHRoZSBqb2IgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyB2b2x1bWVzXG4gICAqL1xuICByZWFkb25seSB2b2x1bWVzPzogRWNzVm9sdW1lW107XG59XG5cbi8qKlxuICogQWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgRUNTIENvbnRhaW5lcnNcbiAqL1xuYWJzdHJhY3QgY2xhc3MgRWNzQ29udGFpbmVyRGVmaW5pdGlvbkJhc2UgZXh0ZW5kcyBDb25zdHJ1Y3QgaW1wbGVtZW50cyBJRWNzQ29udGFpbmVyRGVmaW5pdGlvbiB7XG4gIHB1YmxpYyByZWFkb25seSBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlO1xuICBwdWJsaWMgcmVhZG9ubHkgY3B1OiBudW1iZXI7XG4gIHB1YmxpYyByZWFkb25seSBtZW1vcnk6IFNpemU7XG4gIHB1YmxpYyByZWFkb25seSBjb21tYW5kPzogc3RyaW5nW107XG4gIHB1YmxpYyByZWFkb25seSBlbnZpcm9ubWVudD86IHsgW2tleTpzdHJpbmddOiBzdHJpbmcgfTtcbiAgcHVibGljIHJlYWRvbmx5IGV4ZWN1dGlvblJvbGU6IGlhbS5JUm9sZTtcbiAgcHVibGljIHJlYWRvbmx5IGpvYlJvbGU/OiBpYW0uSVJvbGU7XG4gIHB1YmxpYyByZWFkb25seSBsaW51eFBhcmFtZXRlcnM/OiBMaW51eFBhcmFtZXRlcnM7XG4gIHB1YmxpYyByZWFkb25seSBsb2dEcml2ZXJDb25maWc/OiBlY3MuTG9nRHJpdmVyQ29uZmlnO1xuICBwdWJsaWMgcmVhZG9ubHkgcmVhZG9ubHlSb290RmlsZXN5c3RlbT86IGJvb2xlYW47XG4gIHB1YmxpYyByZWFkb25seSBzZWNyZXRzPzogeyBbZW52VmFyTmFtZTogc3RyaW5nXTogU2VjcmV0IH07XG4gIHB1YmxpYyByZWFkb25seSB1c2VyPzogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgdm9sdW1lczogRWNzVm9sdW1lW107XG5cbiAgcHJpdmF0ZSByZWFkb25seSBpbWFnZUNvbmZpZzogZWNzLkNvbnRhaW5lckltYWdlQ29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBFY3NDb250YWluZXJEZWZpbml0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy5pbWFnZSA9IHByb3BzLmltYWdlO1xuICAgIHRoaXMuY3B1ID0gcHJvcHMuY3B1O1xuICAgIHRoaXMuY29tbWFuZCA9IHByb3BzLmNvbW1hbmQ7XG4gICAgdGhpcy5lbnZpcm9ubWVudCA9IHByb3BzLmVudmlyb25tZW50O1xuICAgIHRoaXMuZXhlY3V0aW9uUm9sZSA9IHByb3BzLmV4ZWN1dGlvblJvbGUgPz8gY3JlYXRlRXhlY3V0aW9uUm9sZSh0aGlzLCAnRXhlY3V0aW9uUm9sZScsIHByb3BzLmxvZ2dpbmcgPyB0cnVlIDogZmFsc2UpO1xuICAgIHRoaXMuam9iUm9sZSA9IHByb3BzLmpvYlJvbGU7XG4gICAgdGhpcy5saW51eFBhcmFtZXRlcnMgPSBwcm9wcy5saW51eFBhcmFtZXRlcnM7XG4gICAgdGhpcy5tZW1vcnkgPSBwcm9wcy5tZW1vcnk7XG5cbiAgICBpZiAocHJvcHMubG9nZ2luZykge1xuICAgICAgdGhpcy5sb2dEcml2ZXJDb25maWcgPSBwcm9wcy5sb2dnaW5nLmJpbmQodGhpcywge1xuICAgICAgICAuLi50aGlzIGFzIGFueSxcbiAgICAgICAgLy8gVFMhXG4gICAgICAgIHRhc2tEZWZpbml0aW9uOiB7XG4gICAgICAgICAgb2J0YWluRXhlY3V0aW9uUm9sZTogKCkgPT4gdGhpcy5leGVjdXRpb25Sb2xlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWFkb25seVJvb3RGaWxlc3lzdGVtID0gcHJvcHMucmVhZG9ubHlSb290RmlsZXN5c3RlbSA/PyBmYWxzZTtcbiAgICB0aGlzLnNlY3JldHMgPSBwcm9wcy5zZWNyZXRzO1xuICAgIHRoaXMudXNlciA9IHByb3BzLnVzZXI7XG4gICAgdGhpcy52b2x1bWVzID0gcHJvcHMudm9sdW1lcyA/PyBbXTtcblxuICAgIHRoaXMuaW1hZ2VDb25maWcgPSBwcm9wcy5pbWFnZS5iaW5kKHRoaXMsIHtcbiAgICAgIC4uLnRoaXMgYXMgYW55LFxuICAgICAgdGFza0RlZmluaXRpb246IHtcbiAgICAgICAgb2J0YWluRXhlY3V0aW9uUm9sZTogKCkgPT4gdGhpcy5leGVjdXRpb25Sb2xlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfcmVuZGVyQ29udGFpbmVyRGVmaW5pdGlvbigpOiBDZm5Kb2JEZWZpbml0aW9uLkNvbnRhaW5lclByb3BlcnRpZXNQcm9wZXJ0eSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGltYWdlOiB0aGlzLmltYWdlQ29uZmlnLmltYWdlTmFtZSxcbiAgICAgIGNvbW1hbmQ6IHRoaXMuY29tbWFuZCxcbiAgICAgIGVudmlyb25tZW50OiBPYmplY3Qua2V5cyh0aGlzLmVudmlyb25tZW50ID8/IHt9KS5tYXAoKGVudktleSkgPT4gKHtcbiAgICAgICAgbmFtZTogZW52S2V5LFxuICAgICAgICB2YWx1ZTogKHRoaXMuZW52aXJvbm1lbnQgPz8ge30pW2VudktleV0sXG4gICAgICB9KSksXG4gICAgICBqb2JSb2xlQXJuOiB0aGlzLmpvYlJvbGU/LnJvbGVBcm4sXG4gICAgICBleGVjdXRpb25Sb2xlQXJuOiB0aGlzLmV4ZWN1dGlvblJvbGU/LnJvbGVBcm4sXG4gICAgICBsaW51eFBhcmFtZXRlcnM6IHRoaXMubGludXhQYXJhbWV0ZXJzICYmIHRoaXMubGludXhQYXJhbWV0ZXJzLnJlbmRlckxpbnV4UGFyYW1ldGVycygpLFxuICAgICAgbG9nQ29uZmlndXJhdGlvbjogdGhpcy5sb2dEcml2ZXJDb25maWcsXG4gICAgICByZWFkb25seVJvb3RGaWxlc3lzdGVtOiB0aGlzLnJlYWRvbmx5Um9vdEZpbGVzeXN0ZW0sXG4gICAgICByZXNvdXJjZVJlcXVpcmVtZW50czogdGhpcy5fcmVuZGVyUmVzb3VyY2VSZXF1aXJlbWVudHMoKSxcbiAgICAgIHNlY3JldHM6IHRoaXMuc2VjcmV0cyA/IE9iamVjdC5lbnRyaWVzKHRoaXMuc2VjcmV0cykubWFwKChbbmFtZSwgc2VjcmV0XSkgPT4ge1xuICAgICAgICBzZWNyZXQuZ3JhbnRSZWFkKHRoaXMuZXhlY3V0aW9uUm9sZSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIHZhbHVlRnJvbTogc2VjcmV0LmFybixcbiAgICAgICAgfTtcbiAgICAgIH0pIDogdW5kZWZpbmVkLFxuICAgICAgbW91bnRQb2ludHM6IExhenkuYW55KHtcbiAgICAgICAgcHJvZHVjZTogKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnZvbHVtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhpcy52b2x1bWVzLm1hcCgodm9sdW1lKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBjb250YWluZXJQYXRoOiB2b2x1bWUuY29udGFpbmVyUGF0aCxcbiAgICAgICAgICAgICAgcmVhZE9ubHk6IHZvbHVtZS5yZWFkb25seSxcbiAgICAgICAgICAgICAgc291cmNlVm9sdW1lOiB2b2x1bWUubmFtZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIHZvbHVtZXM6IExhenkuYW55KHtcbiAgICAgICAgcHJvZHVjZTogKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnZvbHVtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB0aGlzLnZvbHVtZXMubWFwKCh2b2x1bWUpID0+IHtcbiAgICAgICAgICAgIGlmIChFZnNWb2x1bWUuaXNFZnNWb2x1bWUodm9sdW1lKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5hbWU6IHZvbHVtZS5uYW1lLFxuICAgICAgICAgICAgICAgIGVmc1ZvbHVtZUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICAgICAgICAgIGZpbGVTeXN0ZW1JZDogdm9sdW1lLmZpbGVTeXN0ZW0uZmlsZVN5c3RlbUlkLFxuICAgICAgICAgICAgICAgICAgcm9vdERpcmVjdG9yeTogdm9sdW1lLnJvb3REaXJlY3RvcnksXG4gICAgICAgICAgICAgICAgICB0cmFuc2l0RW5jcnlwdGlvbjogdm9sdW1lLmVuYWJsZVRyYW5zaXRFbmNyeXB0aW9uID8gJ0VOQUJMRUQnIDogKHZvbHVtZS5lbmFibGVUcmFuc2l0RW5jcnlwdGlvbiA9PT0gZmFsc2UgPyAnRElTQUJMRUQnIDogdW5kZWZpbmVkKSxcbiAgICAgICAgICAgICAgICAgIHRyYW5zaXRFbmNyeXB0aW9uUG9ydDogdm9sdW1lLnRyYW5zaXRFbmNyeXB0aW9uUG9ydCxcbiAgICAgICAgICAgICAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHZvbHVtZS5hY2Nlc3NQb2ludElkIHx8IHZvbHVtZS51c2VKb2JSb2xlID8ge1xuICAgICAgICAgICAgICAgICAgICBhY2Nlc3NQb2ludElkOiB2b2x1bWUuYWNjZXNzUG9pbnRJZCxcbiAgICAgICAgICAgICAgICAgICAgaWFtOiB2b2x1bWUudXNlSm9iUm9sZSA/ICdFTkFCTEVEJyA6ICh2b2x1bWUudXNlSm9iUm9sZSA9PT0gZmFsc2UgPyAnRElTQUJMRUQnIDogdW5kZWZpbmVkKSxcbiAgICAgICAgICAgICAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoSG9zdFZvbHVtZS5pc0hvc3RWb2x1bWUodm9sdW1lKSkge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5hbWU6IHZvbHVtZS5uYW1lLFxuICAgICAgICAgICAgICAgIGhvc3Q6IHtcbiAgICAgICAgICAgICAgICAgIHNvdXJjZVBhdGg6IHZvbHVtZS5ob3N0UGF0aCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vuc3VwcG9ydGVkIFZvbHVtZSBlbmNvdW50ZXJlZCcpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICB1c2VyOiB0aGlzLnVzZXIsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRWb2x1bWUodm9sdW1lOiBFY3NWb2x1bWUpOiB2b2lkIHtcbiAgICB0aGlzLnZvbHVtZXMucHVzaCh2b2x1bWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIF9yZW5kZXJSZXNvdXJjZVJlcXVpcmVtZW50cygpIHtcbiAgICBjb25zdCByZXNvdXJjZVJlcXVpcmVtZW50cyA9IFtdO1xuXG4gICAgcmVzb3VyY2VSZXF1aXJlbWVudHMucHVzaCh7XG4gICAgICB0eXBlOiAnTUVNT1JZJyxcbiAgICAgIHZhbHVlOiB0aGlzLm1lbW9yeS50b01lYmlieXRlcygpLnRvU3RyaW5nKCksXG4gICAgfSk7XG5cbiAgICByZXNvdXJjZVJlcXVpcmVtZW50cy5wdXNoKHtcbiAgICAgIHR5cGU6ICdWQ1BVJyxcbiAgICAgIHZhbHVlOiB0aGlzLmNwdS50b1N0cmluZygpLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc291cmNlUmVxdWlyZW1lbnRzO1xuICB9XG59XG5cbi8qKlxuICogU2V0cyBsaW1pdHMgZm9yIGEgcmVzb3VyY2Ugd2l0aCBgdWxpbWl0YCBvbiBsaW51eCBzeXN0ZW1zLlxuICogVXNlZCBieSB0aGUgRG9ja2VyIGRhZW1vbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVbGltaXQge1xuICAvKipcbiAgICogVGhlIGhhcmQgbGltaXQgZm9yIHRoaXMgcmVzb3VyY2UuIFRoZSBjb250YWluZXIgd2lsbFxuICAgKiBiZSB0ZXJtaW5hdGVkIGlmIGl0IGV4Y2VlZHMgdGhpcyBsaW1pdC5cbiAgICovXG4gIHJlYWRvbmx5IGhhcmRMaW1pdDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVzb3VyY2UgdG8gbGltaXRcbiAgICovXG4gIHJlYWRvbmx5IG5hbWU6IFVsaW1pdE5hbWU7XG5cbiAgLyoqXG4gICAqIFRoZSByZXNlcnZhdGlvbiBmb3IgdGhpcyByZXNvdXJjZS4gVGhlIGNvbnRhaW5lciB3aWxsXG4gICAqIG5vdCBiZSB0ZXJtaW5hdGVkIGlmIGl0IGV4Y2VlZHMgdGhpcyBsaW1pdC5cbiAgICovXG4gIHJlYWRvbmx5IHNvZnRMaW1pdDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFRoZSByZXNvdXJjZXMgdG8gYmUgbGltaXRlZFxuICovXG5leHBvcnQgZW51bSBVbGltaXROYW1lIHtcbiAgLyoqXG4gICAqIG1heCBjb3JlIGR1bXAgZmlsZSBzaXplXG4gICAqL1xuICBDT1JFID0gJ2NvcmUnLFxuXG4gIC8qKlxuICAgKiBtYXggY3B1IHRpbWUgKHNlY29uZHMpIGZvciBhIHByb2Nlc3NcbiAgICovXG4gIENQVSA9ICdjcHUnLFxuXG4gIC8qKlxuICAgKiBtYXggZGF0YSBzZWdtZW50IHNpemVcbiAgICovXG4gIERBVEEgPSAnZGF0YScsXG5cbiAgLyoqXG4gICAqIG1heCBmaWxlIHNpemVcbiAgICovXG4gIEZTSVpFID0gJ2ZzaXplJyxcblxuICAvKipcbiAgICogbWF4IG51bWJlciBvZiBmaWxlIGxvY2tzXG4gICAqL1xuICBMT0NLUyA9ICdsb2NrcycsXG5cbiAgLyoqXG4gICAqIG1heCBsb2NrZWQgbWVtb3J5XG4gICAqL1xuICBNRU1MT0NLID0gJ21lbWxvY2snLFxuXG4gIC8qKlxuICAgKiBtYXggUE9TSVggbWVzc2FnZSBxdWV1ZSBzaXplXG4gICAqL1xuICBNU0dRVUVVRSA9ICdtc2dxdWV1ZScsXG5cbiAgLyoqXG4gICAqIG1heCBuaWNlIHZhbHVlIGZvciBhbnkgcHJvY2VzcyB0aGlzIHVzZXIgaXMgcnVubmluZ1xuICAgKi9cbiAgTklDRSA9ICduaWNlJyxcblxuICAvKipcbiAgICogbWF4aW11bSBudW1iZXIgb2Ygb3BlbiBmaWxlIGRlc2NyaXB0b3JzXG4gICAqL1xuICBOT0ZJTEUgPSAnbm9maWxlJyxcblxuICAvKipcbiAgICogbWF4aW11bSBudW1iZXIgb2YgcHJvY2Vzc2VzXG4gICAqL1xuICBOUFJPQyA9ICducHJvYycsXG5cbiAgLyoqXG4gICAqIHNpemUgb2YgdGhlIHByb2Nlc3MnIHJlc2lkZW50IHNldCAoaW4gcGFnZXMpXG4gICAqL1xuICBSU1MgPSAncnNzJyxcblxuICAvKipcbiAgICogbWF4IHJlYWx0aW1lIHByaW9yaXR5XG4gICAqL1xuICBSVFBSSU8gPSAncnRwcmlvJyxcblxuICAvKipcbiAgICogdGltZW91dCBmb3IgcmVhbHRpbWUgdGFza3NcbiAgICovXG4gIFJUVElNRSA9ICdydHRpbWUnLFxuXG4gIC8qKlxuICAgKiBtYXggbnVtYmVyIG9mIHBlbmRpbmcgc2lnbmFsc1xuICAgKi9cbiAgU0lHUEVORElORyA9ICdzaWdwZW5kaW5nJyxcblxuICAvKipcbiAgICogbWF4IHN0YWNrIHNpemUgKGluIGJ5dGVzKVxuICAgKi9cbiAgU1RBQ0sgPSAnc3RhY2snLFxufVxuXG4vKipcbiAqIEEgY29udGFpbmVyIG9yY2hlc3RyYXRlZCBieSBFQ1MgdGhhdCB1c2VzIEVDMiByZXNvdXJjZXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbiBleHRlbmRzIElFY3NDb250YWluZXJEZWZpbml0aW9uIHtcbiAgLyoqXG4gICAqIFdoZW4gdGhpcyBwYXJhbWV0ZXIgaXMgdHJ1ZSwgdGhlIGNvbnRhaW5lciBpcyBnaXZlbiBlbGV2YXRlZCBwZXJtaXNzaW9ucyBvbiB0aGUgaG9zdCBjb250YWluZXIgaW5zdGFuY2UgKHNpbWlsYXIgdG8gdGhlIHJvb3QgdXNlcikuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwcml2aWxlZ2VkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogTGltaXRzIHRvIHNldCBmb3IgdGhlIHVzZXIgdGhpcyBkb2NrZXIgY29udGFpbmVyIHdpbGwgcnVuIGFzXG4gICAqL1xuICByZWFkb25seSB1bGltaXRzOiBVbGltaXRbXTtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBwaHlzaWNhbCBHUFVzIHRvIHJlc2VydmUgZm9yIHRoZSBjb250YWluZXIuXG4gICAqIE1ha2Ugc3VyZSB0aGF0IHRoZSBudW1iZXIgb2YgR1BVcyByZXNlcnZlZCBmb3IgYWxsIGNvbnRhaW5lcnMgaW4gYSBqb2IgZG9lc24ndCBleGNlZWRcbiAgICogdGhlIG51bWJlciBvZiBhdmFpbGFibGUgR1BVcyBvbiB0aGUgY29tcHV0ZSByZXNvdXJjZSB0aGF0IHRoZSBqb2IgaXMgbGF1bmNoZWQgb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gZ3B1c1xuICAgKi9cbiAgcmVhZG9ubHkgZ3B1PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBZGQgYSB1bGltaXQgdG8gdGhpcyBjb250YWluZXJcbiAgICovXG4gIGFkZFVsaW1pdCh1bGltaXQ6IFVsaW1pdCk6IHZvaWQ7XG59XG5cbi8qKlxuICogUHJvcHMgdG8gY29uZmlndXJlIGFuIEVjc0VjMkNvbnRhaW5lckRlZmluaXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFY3NFYzJDb250YWluZXJEZWZpbml0aW9uUHJvcHMgZXh0ZW5kcyBFY3NDb250YWluZXJEZWZpbml0aW9uUHJvcHMge1xuICAvKipcbiAgICogV2hlbiB0aGlzIHBhcmFtZXRlciBpcyB0cnVlLCB0aGUgY29udGFpbmVyIGlzIGdpdmVuIGVsZXZhdGVkIHBlcm1pc3Npb25zIG9uIHRoZSBob3N0IGNvbnRhaW5lciBpbnN0YW5jZSAoc2ltaWxhciB0byB0aGUgcm9vdCB1c2VyKS5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHByaXZpbGVnZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBMaW1pdHMgdG8gc2V0IGZvciB0aGUgdXNlciB0aGlzIGRvY2tlciBjb250YWluZXIgd2lsbCBydW4gYXNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyB1bGltaXRzXG4gICAqL1xuICByZWFkb25seSB1bGltaXRzPzogVWxpbWl0W107XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgcGh5c2ljYWwgR1BVcyB0byByZXNlcnZlIGZvciB0aGUgY29udGFpbmVyLlxuICAgKiBNYWtlIHN1cmUgdGhhdCB0aGUgbnVtYmVyIG9mIEdQVXMgcmVzZXJ2ZWQgZm9yIGFsbCBjb250YWluZXJzIGluIGEgam9iIGRvZXNuJ3QgZXhjZWVkXG4gICAqIHRoZSBudW1iZXIgb2YgYXZhaWxhYmxlIEdQVXMgb24gdGhlIGNvbXB1dGUgcmVzb3VyY2UgdGhhdCB0aGUgam9iIGlzIGxhdW5jaGVkIG9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGdwdXNcbiAgICovXG4gIHJlYWRvbmx5IGdwdT86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBBIGNvbnRhaW5lciBvcmNoZXN0cmF0ZWQgYnkgRUNTIHRoYXQgdXNlcyBFQzIgcmVzb3VyY2VzXG4gKi9cbmV4cG9ydCBjbGFzcyBFY3NFYzJDb250YWluZXJEZWZpbml0aW9uIGV4dGVuZHMgRWNzQ29udGFpbmVyRGVmaW5pdGlvbkJhc2UgaW1wbGVtZW50cyBJRWNzRWMyQ29udGFpbmVyRGVmaW5pdGlvbiB7XG4gIHB1YmxpYyByZWFkb25seSBwcml2aWxlZ2VkPzogYm9vbGVhbjtcbiAgcHVibGljIHJlYWRvbmx5IHVsaW1pdHM6IFVsaW1pdFtdO1xuICBwdWJsaWMgcmVhZG9ubHkgZ3B1PzogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBFY3NFYzJDb250YWluZXJEZWZpbml0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICB0aGlzLnByaXZpbGVnZWQgPSBwcm9wcy5wcml2aWxlZ2VkO1xuICAgIHRoaXMudWxpbWl0cyA9IHByb3BzLnVsaW1pdHMgPz8gW107XG4gICAgdGhpcy5ncHUgPSBwcm9wcy5ncHU7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3JlbmRlckNvbnRhaW5lckRlZmluaXRpb24oKTogQ2ZuSm9iRGVmaW5pdGlvbi5Db250YWluZXJQcm9wZXJ0aWVzUHJvcGVydHkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci5fcmVuZGVyQ29udGFpbmVyRGVmaW5pdGlvbigpLFxuICAgICAgdWxpbWl0czogTGF6eS5hbnkoe1xuICAgICAgICBwcm9kdWNlOiAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMudWxpbWl0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRoaXMudWxpbWl0cy5tYXAoKHVsaW1pdCkgPT4gKHtcbiAgICAgICAgICAgIGhhcmRMaW1pdDogdWxpbWl0LmhhcmRMaW1pdCxcbiAgICAgICAgICAgIG5hbWU6IHVsaW1pdC5uYW1lLFxuICAgICAgICAgICAgc29mdExpbWl0OiB1bGltaXQuc29mdExpbWl0LFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgcHJpdmlsZWdlZDogdGhpcy5wcml2aWxlZ2VkLFxuICAgICAgcmVzb3VyY2VSZXF1aXJlbWVudHM6IHRoaXMuX3JlbmRlclJlc291cmNlUmVxdWlyZW1lbnRzKCksXG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogQWRkIGEgdWxpbWl0IHRvIHRoaXMgY29udGFpbmVyXG4gICAqL1xuICBhZGRVbGltaXQodWxpbWl0OiBVbGltaXQpOiB2b2lkIHtcbiAgICB0aGlzLnVsaW1pdHMucHVzaCh1bGltaXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIF9yZW5kZXJSZXNvdXJjZVJlcXVpcmVtZW50cygpIHtcbiAgICBjb25zdCByZXNvdXJjZVJlcXVpcmVtZW50cyA9IHN1cGVyLl9yZW5kZXJSZXNvdXJjZVJlcXVpcmVtZW50cygpO1xuICAgIGlmICh0aGlzLmdwdSkge1xuICAgICAgcmVzb3VyY2VSZXF1aXJlbWVudHMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdHUFUnLFxuICAgICAgICB2YWx1ZTogdGhpcy5ncHUudG9TdHJpbmcoKSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXNvdXJjZVJlcXVpcmVtZW50cztcbiAgfVxufVxuXG4vKipcbiAqIEEgY29udGFpbmVyIG9yY2hlc3RyYXRlZCBieSBFQ1MgdGhhdCB1c2VzIEZhcmdhdGUgcmVzb3VyY2VzIGFuZCBpcyBvcmNoZXN0cmF0ZWQgYnkgRUNTXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUVjc0ZhcmdhdGVDb250YWluZXJEZWZpbml0aW9uIGV4dGVuZHMgSUVjc0NvbnRhaW5lckRlZmluaXRpb24ge1xuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGpvYiBoYXMgYSBwdWJsaWMgSVAgYWRkcmVzcy5cbiAgICogRm9yIGEgam9iIHRoYXQncyBydW5uaW5nIG9uIEZhcmdhdGUgcmVzb3VyY2VzIGluIGEgcHJpdmF0ZSBzdWJuZXQgdG8gc2VuZCBvdXRib3VuZCB0cmFmZmljIHRvIHRoZSBpbnRlcm5ldFxuICAgKiAoZm9yIGV4YW1wbGUsIHRvIHB1bGwgY29udGFpbmVyIGltYWdlcyksIHRoZSBwcml2YXRlIHN1Ym5ldCByZXF1aXJlcyBhIE5BVCBnYXRld2F5IGJlIGF0dGFjaGVkIHRvIHJvdXRlIHJlcXVlc3RzIHRvIHRoZSBpbnRlcm5ldC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNTL2xhdGVzdC9kZXZlbG9wZXJndWlkZS90YXNrLW5ldHdvcmtpbmcuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgYXNzaWduUHVibGljSXA/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGljaCB2ZXJzaW9uIG9mIEZhcmdhdGUgdG8gdXNlIHdoZW4gcnVubmluZyB0aGlzIGNvbnRhaW5lclxuICAgKlxuICAgKiBAZGVmYXVsdCBMQVRFU1RcbiAgICovXG4gIHJlYWRvbmx5IGZhcmdhdGVQbGF0Zm9ybVZlcnNpb24/OiBlY3MuRmFyZ2F0ZVBsYXRmb3JtVmVyc2lvbjtcblxuICAvKipcbiAgICogVGhlIHNpemUgZm9yIGVwaGVtZXJhbCBzdG9yYWdlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIDIwIEdpQlxuICAgKi9cbiAgcmVhZG9ubHkgZXBoZW1lcmFsU3RvcmFnZVNpemU/OiBTaXplO1xufVxuXG4vKipcbiAqIFByb3BzIHRvIGNvbmZpZ3VyZSBhbiBFY3NGYXJnYXRlQ29udGFpbmVyRGVmaW5pdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVjc0ZhcmdhdGVDb250YWluZXJEZWZpbml0aW9uUHJvcHMgZXh0ZW5kcyBFY3NDb250YWluZXJEZWZpbml0aW9uUHJvcHMge1xuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGpvYiBoYXMgYSBwdWJsaWMgSVAgYWRkcmVzcy5cbiAgICogRm9yIGEgam9iIHRoYXQncyBydW5uaW5nIG9uIEZhcmdhdGUgcmVzb3VyY2VzIGluIGEgcHJpdmF0ZSBzdWJuZXQgdG8gc2VuZCBvdXRib3VuZCB0cmFmZmljIHRvIHRoZSBpbnRlcm5ldFxuICAgKiAoZm9yIGV4YW1wbGUsIHRvIHB1bGwgY29udGFpbmVyIGltYWdlcyksIHRoZSBwcml2YXRlIHN1Ym5ldCByZXF1aXJlcyBhIE5BVCBnYXRld2F5IGJlIGF0dGFjaGVkIHRvIHJvdXRlIHJlcXVlc3RzIHRvIHRoZSBpbnRlcm5ldC5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNTL2xhdGVzdC9kZXZlbG9wZXJndWlkZS90YXNrLW5ldHdvcmtpbmcuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgYXNzaWduUHVibGljSXA/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGljaCB2ZXJzaW9uIG9mIEZhcmdhdGUgdG8gdXNlIHdoZW4gcnVubmluZyB0aGlzIGNvbnRhaW5lclxuICAgKlxuICAgKiBAZGVmYXVsdCBMQVRFU1RcbiAgICovXG4gIHJlYWRvbmx5IGZhcmdhdGVQbGF0Zm9ybVZlcnNpb24/OiBlY3MuRmFyZ2F0ZVBsYXRmb3JtVmVyc2lvbjtcblxuICAvKipcbiAgICogVGhlIHNpemUgZm9yIGVwaGVtZXJhbCBzdG9yYWdlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIDIwIEdpQlxuICAgKi9cbiAgcmVhZG9ubHkgZXBoZW1lcmFsU3RvcmFnZVNpemU/OiBTaXplO1xufVxuXG4vKipcbiAqIEEgY29udGFpbmVyIG9yY2hlc3RyYXRlZCBieSBFQ1MgdGhhdCB1c2VzIEZhcmdhdGUgcmVzb3VyY2VzXG4gKi9cbmV4cG9ydCBjbGFzcyBFY3NGYXJnYXRlQ29udGFpbmVyRGVmaW5pdGlvbiBleHRlbmRzIEVjc0NvbnRhaW5lckRlZmluaXRpb25CYXNlIGltcGxlbWVudHMgSUVjc0ZhcmdhdGVDb250YWluZXJEZWZpbml0aW9uIHtcbiAgcHVibGljIHJlYWRvbmx5IGZhcmdhdGVQbGF0Zm9ybVZlcnNpb24/OiBlY3MuRmFyZ2F0ZVBsYXRmb3JtVmVyc2lvbjtcbiAgcHVibGljIHJlYWRvbmx5IGFzc2lnblB1YmxpY0lwPzogYm9vbGVhbjtcbiAgcHVibGljIHJlYWRvbmx5IGVwaGVtZXJhbFN0b3JhZ2VTaXplPzogU2l6ZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRWNzRmFyZ2F0ZUNvbnRhaW5lckRlZmluaXRpb25Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICAgIHRoaXMuYXNzaWduUHVibGljSXAgPSBwcm9wcy5hc3NpZ25QdWJsaWNJcDtcbiAgICB0aGlzLmZhcmdhdGVQbGF0Zm9ybVZlcnNpb24gPSBwcm9wcy5mYXJnYXRlUGxhdGZvcm1WZXJzaW9uO1xuICAgIHRoaXMuZXBoZW1lcmFsU3RvcmFnZVNpemUgPSBwcm9wcy5lcGhlbWVyYWxTdG9yYWdlU2l6ZTtcblxuICAgIC8vIHZhbGlkYXRlcyBlcGhlbWVyYWxTdG9yYWdlU2l6ZSBpcyB3aXRoaW4gbGltaXRzXG4gICAgaWYgKHByb3BzLmVwaGVtZXJhbFN0b3JhZ2VTaXplKSB7XG4gICAgICBpZiAocHJvcHMuZXBoZW1lcmFsU3RvcmFnZVNpemUudG9HaWJpYnl0ZXMoKSA+IDIwMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVDUyBGYXJnYXRlIGNvbnRhaW5lciAnJHtpZH0nIHNwZWNpZmllcyAnZXBoZW1lcmFsU3RvcmFnZVNpemUnIGF0ICR7cHJvcHMuZXBoZW1lcmFsU3RvcmFnZVNpemUudG9HaWJpYnl0ZXMoKX0gPiAyMDAgR0JgKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvcHMuZXBoZW1lcmFsU3RvcmFnZVNpemUudG9HaWJpYnl0ZXMoKSA8IDIxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgRUNTIEZhcmdhdGUgY29udGFpbmVyICcke2lkfScgc3BlY2lmaWVzICdlcGhlbWVyYWxTdG9yYWdlU2l6ZScgYXQgJHtwcm9wcy5lcGhlbWVyYWxTdG9yYWdlU2l6ZS50b0dpYmlieXRlcygpfSA8IDIxIEdCYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9yZW5kZXJDb250YWluZXJEZWZpbml0aW9uKCk6IENmbkpvYkRlZmluaXRpb24uQ29udGFpbmVyUHJvcGVydGllc1Byb3BlcnR5IHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3VwZXIuX3JlbmRlckNvbnRhaW5lckRlZmluaXRpb24oKSxcbiAgICAgIGVwaGVtZXJhbFN0b3JhZ2U6IHRoaXMuZXBoZW1lcmFsU3RvcmFnZVNpemU/IHtcbiAgICAgICAgc2l6ZUluR2lCOiB0aGlzLmVwaGVtZXJhbFN0b3JhZ2VTaXplPy50b0dpYmlieXRlcygpLFxuICAgICAgfSA6IHVuZGVmaW5lZCxcbiAgICAgIGZhcmdhdGVQbGF0Zm9ybUNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgcGxhdGZvcm1WZXJzaW9uOiB0aGlzLmZhcmdhdGVQbGF0Zm9ybVZlcnNpb24/LnRvU3RyaW5nKCksXG4gICAgICB9LFxuICAgICAgbmV0d29ya0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgYXNzaWduUHVibGljSXA6IHRoaXMuYXNzaWduUHVibGljSXAgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnLFxuICAgICAgfSxcbiAgICB9O1xuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFeGVjdXRpb25Sb2xlKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGxvZ2dpbmc6IGJvb2xlYW4pOiBpYW0uSVJvbGUge1xuICBjb25zdCBleGVjUm9sZSA9IG5ldyBpYW0uUm9sZShzY29wZSwgaWQsIHtcbiAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWNzLXRhc2tzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAvLyBuZWVkZWQgZm9yIGNyb3NzLWFjY291bnQgYWNjZXNzIHdpdGggVGFnUGFyYW1ldGVyQ29udGFpbmVySW1hZ2VcbiAgICByb2xlTmFtZTogUGh5c2ljYWxOYW1lLkdFTkVSQVRFX0lGX05FRURFRCxcbiAgfSk7XG5cbiAgaWYgKCFsb2dnaW5nKSB7XG4gICAgLy8gYWxsIGpvYnMgd2lsbCBmYWlsIHdpdGhvdXQgdGhpcyBpZiB0aGV5IHByb2R1Y2UgYW55IG91dHB1dCBhdCBhbGwgd2hlbiBubyBsb2dnaW5nIGlzIHNwZWNpZmllZFxuICAgIExvZ0dyb3VwLmZyb21Mb2dHcm91cE5hbWUoc2NvcGUsICdiYXRjaERlZmF1bHRMb2dHcm91cCcsICcvYXdzL2JhdGNoL2pvYicpLmdyYW50V3JpdGUoZXhlY1JvbGUpO1xuICB9XG5cbiAgcmV0dXJuIGV4ZWNSb2xlO1xufVxuIl19