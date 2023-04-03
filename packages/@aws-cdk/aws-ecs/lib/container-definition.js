"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppProtocol = exports.Protocol = exports.ServiceConnect = exports.PortMap = exports.ContainerDependencyCondition = exports.UlimitName = exports.ContainerDefinition = exports.Secret = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const task_definition_1 = require("./base/task-definition");
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
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_SecretVersionInfo(versionInfo);
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
Secret[_a] = { fqn: "@aws-cdk/aws-ecs.Secret", version: "0.0.0" };
/**
 * A container definition is used in a task definition to describe the containers that are launched as part of a task.
 */
class ContainerDefinition extends constructs_1.Construct {
    /**
     * Constructs a new instance of the ContainerDefinition class.
     */
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        /**
         * The mount points for data volumes in your container.
         */
        this.mountPoints = new Array();
        /**
         * The list of port mappings for the container. Port mappings allow containers to access ports
         * on the host container instance to send or receive traffic.
         */
        this.portMappings = new Array();
        /**
         * The data volumes to mount from another container in the same task definition.
         */
        this.volumesFrom = new Array();
        /**
         * An array of ulimits to set in the container.
         */
        this.ulimits = new Array();
        /**
         * An array dependencies defined for container startup and shutdown.
         */
        this.containerDependencies = new Array();
        /**
         * The inference accelerators referenced by this container.
         */
        this.inferenceAcceleratorResources = [];
        /**
         * The configured container links
         */
        this.links = new Array();
        this.secrets = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ContainerDefinitionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ContainerDefinition);
            }
            throw error;
        }
        if (props.memoryLimitMiB !== undefined && props.memoryReservationMiB !== undefined) {
            if (props.memoryLimitMiB < props.memoryReservationMiB) {
                throw new Error('MemoryLimitMiB should not be less than MemoryReservationMiB.');
            }
        }
        this.essential = props.essential ?? true;
        this.taskDefinition = props.taskDefinition;
        this.memoryLimitSpecified = props.memoryLimitMiB !== undefined || props.memoryReservationMiB !== undefined;
        this.linuxParameters = props.linuxParameters;
        this.containerName = props.containerName ?? this.node.id;
        this.imageConfig = props.image.bind(this, this);
        this.imageName = this.imageConfig.imageName;
        this._namedPorts = new Map();
        if (props.logging) {
            this.logDriverConfig = props.logging.bind(this, this);
        }
        if (props.secrets) {
            for (const [name, secret] of Object.entries(props.secrets)) {
                this.addSecret(name, secret);
            }
        }
        if (props.environment) {
            this.environment = { ...props.environment };
        }
        else {
            this.environment = {};
        }
        if (props.environmentFiles) {
            this.environmentFiles = [];
            for (const environmentFile of props.environmentFiles) {
                this.environmentFiles.push(environmentFile.bind(this));
            }
        }
        props.taskDefinition._linkContainer(this);
        if (props.portMappings) {
            this.addPortMappings(...props.portMappings);
        }
        if (props.inferenceAcceleratorResources) {
            this.addInferenceAcceleratorResource(...props.inferenceAcceleratorResources);
        }
    }
    /**
     * This method adds a link which allows containers to communicate with each other without the need for port mappings.
     *
     * This parameter is only supported if the task definition is using the bridge network mode.
     * Warning: The --link flag is a legacy feature of Docker. It may eventually be removed.
     */
    addLink(container, alias) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ContainerDefinition(container);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addLink);
            }
            throw error;
        }
        if (this.taskDefinition.networkMode !== task_definition_1.NetworkMode.BRIDGE) {
            throw new Error('You must use network mode Bridge to add container links.');
        }
        if (alias !== undefined) {
            this.links.push(`${container.containerName}:${alias}`);
        }
        else {
            this.links.push(`${container.containerName}`);
        }
    }
    /**
     * This method adds one or more mount points for data volumes to the container.
     */
    addMountPoints(...mountPoints) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_MountPoint(mountPoints);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addMountPoints);
            }
            throw error;
        }
        this.mountPoints.push(...mountPoints);
    }
    /**
     * This method mounts temporary disk space to the container.
     *
     * This adds the correct container mountPoint and task definition volume.
     */
    addScratch(scratch) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ScratchSpace(scratch);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addScratch);
            }
            throw error;
        }
        const mountPoint = {
            containerPath: scratch.containerPath,
            readOnly: scratch.readOnly,
            sourceVolume: scratch.name,
        };
        const volume = {
            host: {
                sourcePath: scratch.sourcePath,
            },
            name: scratch.name,
        };
        this.taskDefinition.addVolume(volume);
        this.addMountPoints(mountPoint);
    }
    /**
     * This method adds one or more port mappings to the container.
     */
    addPortMappings(...portMappings) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_PortMapping(portMappings);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addPortMappings);
            }
            throw error;
        }
        this.portMappings.push(...portMappings.map(pm => {
            const portMap = new PortMap(this.taskDefinition.networkMode, pm);
            portMap.validate();
            const serviceConnect = new ServiceConnect(this.taskDefinition.networkMode, pm);
            if (serviceConnect.isServiceConnect()) {
                serviceConnect.validate();
                this.setNamedPort(pm);
            }
            const sanitizedPM = this.addHostPortIfNeeded(pm);
            return sanitizedPM;
        }));
    }
    /**
     * This method adds an environment variable to the container.
     */
    addEnvironment(name, value) {
        this.environment[name] = value;
    }
    /**
     * This method adds a secret as environment variable to the container.
     */
    addSecret(name, secret) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_Secret(secret);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addSecret);
            }
            throw error;
        }
        secret.grantRead(this.taskDefinition.obtainExecutionRole());
        this.secrets.push({
            name,
            valueFrom: secret.arn,
        });
    }
    /**
     * This method adds one or more resources to the container.
     */
    addInferenceAcceleratorResource(...inferenceAcceleratorResources) {
        this.inferenceAcceleratorResources.push(...inferenceAcceleratorResources.map(resource => {
            for (const inferenceAccelerator of this.taskDefinition.inferenceAccelerators) {
                if (resource === inferenceAccelerator.deviceName) {
                    return resource;
                }
            }
            throw new Error(`Resource value ${resource} in container definition doesn't match any inference accelerator device name in the task definition.`);
        }));
    }
    /**
     * This method adds one or more ulimits to the container.
     */
    addUlimits(...ulimits) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_Ulimit(ulimits);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addUlimits);
            }
            throw error;
        }
        this.ulimits.push(...ulimits);
    }
    /**
     * This method adds one or more container dependencies to the container.
     */
    addContainerDependencies(...containerDependencies) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ContainerDependency(containerDependencies);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addContainerDependencies);
            }
            throw error;
        }
        this.containerDependencies.push(...containerDependencies);
    }
    /**
     * This method adds one or more volumes to the container.
     */
    addVolumesFrom(...volumesFrom) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_VolumeFrom(volumesFrom);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addVolumesFrom);
            }
            throw error;
        }
        this.volumesFrom.push(...volumesFrom);
    }
    /**
     * This method adds the specified statement to the IAM task execution policy in the task definition.
     */
    addToExecutionPolicy(statement) {
        this.taskDefinition.addToExecutionRolePolicy(statement);
    }
    /**
     * Returns the host port for the requested container port if it exists
     */
    findPortMapping(containerPort, protocol) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_Protocol(protocol);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.findPortMapping);
            }
            throw error;
        }
        for (const portMapping of this.portMappings) {
            const p = portMapping.protocol || Protocol.TCP;
            const c = portMapping.containerPort;
            if (c === containerPort && p === protocol) {
                return portMapping;
            }
        }
        return undefined;
    }
    /**
     * Returns the port mapping with the given name, if it exists.
     */
    findPortMappingByName(name) {
        return this._namedPorts.get(name);
    }
    /**
     * This method adds an namedPort
     */
    setNamedPort(pm) {
        if (!pm.name)
            return;
        if (this._namedPorts.has(pm.name)) {
            throw new Error(`Port mapping name '${pm.name}' already exists on this container`);
        }
        this._namedPorts.set(pm.name, pm);
    }
    /**
     * Set HostPort to 0 When netowork mode is Brdige
     */
    addHostPortIfNeeded(pm) {
        const newPM = {
            ...pm,
        };
        if (this.taskDefinition.networkMode !== task_definition_1.NetworkMode.BRIDGE)
            return newPM;
        if (pm.hostPort !== undefined)
            return newPM;
        newPM.hostPort = 0;
        return newPM;
    }
    /**
     * Whether this container definition references a specific JSON field of a secret
     * stored in Secrets Manager.
     */
    get referencesSecretJsonField() {
        for (const secret of this.secrets) {
            if (secret.valueFrom.endsWith('::')) {
                return true;
            }
        }
        return false;
    }
    /**
     * The inbound rules associated with the security group the task or service will use.
     *
     * This property is only used for tasks that use the awsvpc network mode.
     */
    get ingressPort() {
        if (this.portMappings.length === 0) {
            throw new Error(`Container ${this.containerName} hasn't defined any ports. Call addPortMappings().`);
        }
        const defaultPortMapping = this.portMappings[0];
        if (defaultPortMapping.hostPort !== undefined && defaultPortMapping.hostPort !== 0) {
            return defaultPortMapping.hostPort;
        }
        if (this.taskDefinition.networkMode === task_definition_1.NetworkMode.BRIDGE) {
            return 0;
        }
        return defaultPortMapping.containerPort;
    }
    /**
     * The port the container will listen on.
     */
    get containerPort() {
        if (this.portMappings.length === 0) {
            throw new Error(`Container ${this.containerName} hasn't defined any ports. Call addPortMappings().`);
        }
        const defaultPortMapping = this.portMappings[0];
        return defaultPortMapping.containerPort;
    }
    /**
     * Render this container definition to a CloudFormation object
     *
     * @param _taskDefinition [disable-awslint:ref-via-interface] (unused but kept to avoid breaking change)
     */
    renderContainerDefinition(_taskDefinition) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_TaskDefinition(_taskDefinition);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.renderContainerDefinition);
            }
            throw error;
        }
        return {
            command: this.props.command,
            cpu: this.props.cpu,
            disableNetworking: this.props.disableNetworking,
            dependsOn: cdk.Lazy.any({ produce: () => this.containerDependencies.map(renderContainerDependency) }, { omitEmptyArray: true }),
            dnsSearchDomains: this.props.dnsSearchDomains,
            dnsServers: this.props.dnsServers,
            dockerLabels: this.props.dockerLabels,
            dockerSecurityOptions: this.props.dockerSecurityOptions,
            entryPoint: this.props.entryPoint,
            essential: this.essential,
            hostname: this.props.hostname,
            image: this.imageConfig.imageName,
            memory: this.props.memoryLimitMiB,
            memoryReservation: this.props.memoryReservationMiB,
            mountPoints: cdk.Lazy.any({ produce: () => this.mountPoints.map(renderMountPoint) }, { omitEmptyArray: true }),
            name: this.containerName,
            portMappings: cdk.Lazy.any({ produce: () => this.portMappings.map(renderPortMapping) }, { omitEmptyArray: true }),
            privileged: this.props.privileged,
            readonlyRootFilesystem: this.props.readonlyRootFilesystem,
            repositoryCredentials: this.imageConfig.repositoryCredentials,
            startTimeout: this.props.startTimeout && this.props.startTimeout.toSeconds(),
            stopTimeout: this.props.stopTimeout && this.props.stopTimeout.toSeconds(),
            ulimits: cdk.Lazy.any({ produce: () => this.ulimits.map(renderUlimit) }, { omitEmptyArray: true }),
            user: this.props.user,
            volumesFrom: cdk.Lazy.any({ produce: () => this.volumesFrom.map(renderVolumeFrom) }, { omitEmptyArray: true }),
            workingDirectory: this.props.workingDirectory,
            logConfiguration: this.logDriverConfig,
            environment: this.environment && Object.keys(this.environment).length ? renderKV(this.environment, 'name', 'value') : undefined,
            environmentFiles: this.environmentFiles && renderEnvironmentFiles(cdk.Stack.of(this).partition, this.environmentFiles),
            secrets: this.secrets.length ? this.secrets : undefined,
            extraHosts: this.props.extraHosts && renderKV(this.props.extraHosts, 'hostname', 'ipAddress'),
            healthCheck: this.props.healthCheck && renderHealthCheck(this.props.healthCheck),
            links: cdk.Lazy.list({ produce: () => this.links }, { omitEmpty: true }),
            linuxParameters: this.linuxParameters && this.linuxParameters.renderLinuxParameters(),
            resourceRequirements: (!this.props.gpuCount && this.inferenceAcceleratorResources.length == 0) ? undefined :
                renderResourceRequirements(this.props.gpuCount, this.inferenceAcceleratorResources),
            systemControls: this.props.systemControls && renderSystemControls(this.props.systemControls),
        };
    }
}
exports.ContainerDefinition = ContainerDefinition;
_b = JSII_RTTI_SYMBOL_1;
ContainerDefinition[_b] = { fqn: "@aws-cdk/aws-ecs.ContainerDefinition", version: "0.0.0" };
function renderKV(env, keyName, valueName) {
    const ret = [];
    for (const [key, value] of Object.entries(env)) {
        ret.push({ [keyName]: key, [valueName]: value });
    }
    return ret;
}
function renderEnvironmentFiles(partition, environmentFiles) {
    const ret = [];
    for (const environmentFile of environmentFiles) {
        const s3Location = environmentFile.s3Location;
        if (!s3Location) {
            throw Error('Environment file must specify an S3 location');
        }
        ret.push({
            type: environmentFile.fileType,
            value: `arn:${partition}:s3:::${s3Location.bucketName}/${s3Location.objectKey}`,
        });
    }
    return ret;
}
function renderHealthCheck(hc) {
    if (hc.interval?.toSeconds() !== undefined) {
        if (5 > hc.interval?.toSeconds() || hc.interval?.toSeconds() > 300) {
            throw new Error('Interval must be between 5 seconds and 300 seconds.');
        }
    }
    if (hc.timeout?.toSeconds() !== undefined) {
        if (2 > hc.timeout?.toSeconds() || hc.timeout?.toSeconds() > 120) {
            throw new Error('Timeout must be between 2 seconds and 120 seconds.');
        }
    }
    if (hc.interval?.toSeconds() !== undefined && hc.timeout?.toSeconds() !== undefined) {
        if (hc.interval?.toSeconds() < hc.timeout?.toSeconds()) {
            throw new Error('Health check interval should be longer than timeout.');
        }
    }
    return {
        command: getHealthCheckCommand(hc),
        interval: hc.interval?.toSeconds() ?? 30,
        retries: hc.retries ?? 3,
        startPeriod: hc.startPeriod?.toSeconds(),
        timeout: hc.timeout?.toSeconds() ?? 5,
    };
}
function getHealthCheckCommand(hc) {
    const cmd = hc.command;
    const hcCommand = new Array();
    if (cmd.length === 0) {
        throw new Error('At least one argument must be supplied for health check command.');
    }
    if (cmd.length === 1) {
        hcCommand.push('CMD-SHELL', cmd[0]);
        return hcCommand;
    }
    if (cmd[0] !== 'CMD' && cmd[0] !== 'CMD-SHELL') {
        hcCommand.push('CMD');
    }
    return hcCommand.concat(cmd);
}
function renderResourceRequirements(gpuCount = 0, inferenceAcceleratorResources = []) {
    const ret = [];
    for (const resource of inferenceAcceleratorResources) {
        ret.push({
            type: 'InferenceAccelerator',
            value: resource,
        });
    }
    if (gpuCount > 0) {
        ret.push({
            type: 'GPU',
            value: gpuCount.toString(),
        });
    }
    return ret;
}
/**
 * Type of resource to set a limit on
 */
var UlimitName;
(function (UlimitName) {
    UlimitName["CORE"] = "core";
    UlimitName["CPU"] = "cpu";
    UlimitName["DATA"] = "data";
    UlimitName["FSIZE"] = "fsize";
    UlimitName["LOCKS"] = "locks";
    UlimitName["MEMLOCK"] = "memlock";
    UlimitName["MSGQUEUE"] = "msgqueue";
    UlimitName["NICE"] = "nice";
    UlimitName["NOFILE"] = "nofile";
    UlimitName["NPROC"] = "nproc";
    UlimitName["RSS"] = "rss";
    UlimitName["RTPRIO"] = "rtprio";
    UlimitName["RTTIME"] = "rttime";
    UlimitName["SIGPENDING"] = "sigpending";
    UlimitName["STACK"] = "stack";
})(UlimitName = exports.UlimitName || (exports.UlimitName = {}));
function renderUlimit(ulimit) {
    return {
        name: ulimit.name,
        softLimit: ulimit.softLimit,
        hardLimit: ulimit.hardLimit,
    };
}
var ContainerDependencyCondition;
(function (ContainerDependencyCondition) {
    /**
     * This condition emulates the behavior of links and volumes today.
     * It validates that a dependent container is started before permitting other containers to start.
     */
    ContainerDependencyCondition["START"] = "START";
    /**
     * This condition validates that a dependent container runs to completion (exits) before permitting other containers to start.
     * This can be useful for nonessential containers that run a script and then exit.
     */
    ContainerDependencyCondition["COMPLETE"] = "COMPLETE";
    /**
     * This condition is the same as COMPLETE, but it also requires that the container exits with a zero status.
     */
    ContainerDependencyCondition["SUCCESS"] = "SUCCESS";
    /**
     * This condition validates that the dependent container passes its Docker health check before permitting other containers to start.
     * This requires that the dependent container has health checks configured. This condition is confirmed only at task startup.
     */
    ContainerDependencyCondition["HEALTHY"] = "HEALTHY";
})(ContainerDependencyCondition = exports.ContainerDependencyCondition || (exports.ContainerDependencyCondition = {}));
function renderContainerDependency(containerDependency) {
    return {
        containerName: containerDependency.container.containerName,
        condition: containerDependency.condition || ContainerDependencyCondition.HEALTHY,
    };
}
/**
 * PortMap ValueObjectClass having by ContainerDefinition
 */
class PortMap {
    constructor(networkmode, pm) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_NetworkMode(networkmode);
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_PortMapping(pm);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PortMap);
            }
            throw error;
        }
        this.networkmode = networkmode;
        this.portmapping = pm;
    }
    /**
     * validate invalid portmapping and networkmode parameters.
     * throw Error when invalid parameters.
     */
    validate() {
        if (!this.isvalidPortName()) {
            throw new Error('Port mapping name cannot be an empty string.');
        }
        if (!this.isValidPorts()) {
            const pm = this.portmapping;
            throw new Error(`Host port (${pm.hostPort}) must be left out or equal to container port ${pm.containerPort} for network mode ${this.networkmode}`);
        }
    }
    isvalidPortName() {
        if (this.portmapping.name === '') {
            return false;
        }
        return true;
    }
    isValidPorts() {
        const isAwsVpcMode = this.networkmode == task_definition_1.NetworkMode.AWS_VPC;
        const isHostMode = this.networkmode == task_definition_1.NetworkMode.HOST;
        if (!isAwsVpcMode && !isHostMode)
            return true;
        const hostPort = this.portmapping.hostPort;
        const containerPort = this.portmapping.containerPort;
        if (containerPort !== hostPort && hostPort !== undefined)
            return false;
        return true;
    }
}
exports.PortMap = PortMap;
_c = JSII_RTTI_SYMBOL_1;
PortMap[_c] = { fqn: "@aws-cdk/aws-ecs.PortMap", version: "0.0.0" };
/**
 * ServiceConnect ValueObjectClass having by ContainerDefinition
 */
class ServiceConnect {
    constructor(networkmode, pm) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_NetworkMode(networkmode);
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_PortMapping(pm);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ServiceConnect);
            }
            throw error;
        }
        this.portmapping = pm;
        this.networkmode = networkmode;
    }
    /**
     * Judge parameters can be serviceconnect logick.
     * If parameters can be serviceConnect return true.
     */
    isServiceConnect() {
        const hasPortname = this.portmapping.name;
        const hasAppProtcol = this.portmapping.appProtocol;
        if (hasPortname || hasAppProtcol)
            return true;
        return false;
    }
    /**
     * Judge serviceconnect parametes are valid.
     * If invalid, throw Error.
     */
    validate() {
        if (!this.isValidNetworkmode()) {
            throw new Error(`Service connect related port mapping fields 'name' and 'appProtocol' are not supported for network mode ${this.networkmode}`);
        }
        if (!this.isValidPortName()) {
            throw new Error('Service connect-related port mapping field \'appProtocol\' cannot be set without \'name\'');
        }
    }
    isValidNetworkmode() {
        const isAwsVpcMode = this.networkmode == task_definition_1.NetworkMode.AWS_VPC;
        const isBridgeMode = this.networkmode == task_definition_1.NetworkMode.BRIDGE;
        if (isAwsVpcMode || isBridgeMode)
            return true;
        return false;
    }
    isValidPortName() {
        if (!this.portmapping.name)
            return false;
        return true;
    }
}
exports.ServiceConnect = ServiceConnect;
_d = JSII_RTTI_SYMBOL_1;
ServiceConnect[_d] = { fqn: "@aws-cdk/aws-ecs.ServiceConnect", version: "0.0.0" };
/**
 * Network protocol
 */
var Protocol;
(function (Protocol) {
    /**
     * TCP
     */
    Protocol["TCP"] = "tcp";
    /**
     * UDP
     */
    Protocol["UDP"] = "udp";
})(Protocol = exports.Protocol || (exports.Protocol = {}));
/**
 * Service connect app protocol.
 */
class AppProtocol {
    constructor(value) {
        this.value = value;
    }
}
exports.AppProtocol = AppProtocol;
_e = JSII_RTTI_SYMBOL_1;
AppProtocol[_e] = { fqn: "@aws-cdk/aws-ecs.AppProtocol", version: "0.0.0" };
/**
 * HTTP app protocol.
 */
AppProtocol.http = new AppProtocol('http');
/**
 * HTTP2 app protocol.
 */
AppProtocol.http2 = new AppProtocol('http2');
/**
 * GRPC app protocol.
 */
AppProtocol.grpc = new AppProtocol('grpc');
function renderPortMapping(pm) {
    return {
        containerPort: pm.containerPort,
        hostPort: pm.hostPort,
        protocol: pm.protocol || Protocol.TCP,
        appProtocol: pm.appProtocol?.value,
        name: pm.name ? pm.name : undefined,
    };
}
function renderMountPoint(mp) {
    return {
        containerPath: mp.containerPath,
        readOnly: mp.readOnly,
        sourceVolume: mp.sourceVolume,
    };
}
function renderVolumeFrom(vf) {
    return {
        sourceContainer: vf.sourceContainer,
        readOnly: vf.readOnly,
    };
}
function renderSystemControls(systemControls) {
    return systemControls.map(sc => ({
        namespace: sc.namespace,
        value: sc.value,
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGFpbmVyLWRlZmluaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb250YWluZXItZGVmaW5pdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQSxxQ0FBcUM7QUFDckMsMkNBQXVDO0FBQ3ZDLDREQUFxRTtBQXlCckU7O0dBRUc7QUFDSCxNQUFzQixNQUFNO0lBQzFCOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUF5QjtRQUN0RCxPQUFPO1lBQ0wsR0FBRyxFQUFFLFNBQVMsQ0FBQyxZQUFZO1lBQzNCLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1NBQ25ELENBQUM7S0FDSDtJQUVEOzs7Ozs7Ozs7T0FTRztJQUNJLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUE4QixFQUFFLEtBQWM7UUFDN0UsT0FBTztZQUNMLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVM7WUFDaEUsUUFBUSxFQUFFLENBQUMsQ0FBQyxLQUFLO1lBQ2pCLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO1NBQ2hELENBQUM7S0FDSDtJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSSxNQUFNLENBQUMseUJBQXlCLENBQUMsTUFBOEIsRUFBRSxXQUE4QixFQUFFLEtBQWM7Ozs7Ozs7Ozs7UUFDcEgsT0FBTztZQUNMLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksS0FBSyxJQUFJLEVBQUUsSUFBSSxXQUFXLENBQUMsWUFBWSxJQUFJLEVBQUUsSUFBSSxXQUFXLENBQUMsU0FBUyxJQUFJLEVBQUUsRUFBRTtZQUMxRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEtBQUs7WUFDakIs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Q3JDLFdBQVcsRUFBRSxFQUFFLENBQUMsV0FBVyxFQUFFLEtBQUs7UUFDbEMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVM7S0FDcEMsQ0FBQztBQUNKLENBQUM7QUErQ0QsU0FBUyxnQkFBZ0IsQ0FBQyxFQUFjO0lBQ3RDLE9BQU87UUFDTCxhQUFhLEVBQUUsRUFBRSxDQUFDLGFBQWE7UUFDL0IsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRO1FBQ3JCLFlBQVksRUFBRSxFQUFFLENBQUMsWUFBWTtLQUM5QixDQUFDO0FBQ0osQ0FBQztBQW9CRCxTQUFTLGdCQUFnQixDQUFDLEVBQWM7SUFDdEMsT0FBTztRQUNMLGVBQWUsRUFBRSxFQUFFLENBQUMsZUFBZTtRQUNuQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVE7S0FDdEIsQ0FBQztBQUNKLENBQUM7QUFpQkQsU0FBUyxvQkFBb0IsQ0FBQyxjQUErQjtJQUMzRCxPQUFPLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9CLFNBQVMsRUFBRSxFQUFFLENBQUMsU0FBUztRQUN2QixLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUs7S0FDaEIsQ0FBQyxDQUFDLENBQUM7QUFDTixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgc2VjcmV0c21hbmFnZXIgZnJvbSAnQGF3cy1jZGsvYXdzLXNlY3JldHNtYW5hZ2VyJztcbmltcG9ydCAqIGFzIHNzbSBmcm9tICdAYXdzLWNkay9hd3Mtc3NtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgTmV0d29ya01vZGUsIFRhc2tEZWZpbml0aW9uIH0gZnJvbSAnLi9iYXNlL3Rhc2stZGVmaW5pdGlvbic7XG5pbXBvcnQgeyBDb250YWluZXJJbWFnZSwgQ29udGFpbmVySW1hZ2VDb25maWcgfSBmcm9tICcuL2NvbnRhaW5lci1pbWFnZSc7XG5pbXBvcnQgeyBDZm5UYXNrRGVmaW5pdGlvbiB9IGZyb20gJy4vZWNzLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBFbnZpcm9ubWVudEZpbGUsIEVudmlyb25tZW50RmlsZUNvbmZpZyB9IGZyb20gJy4vZW52aXJvbm1lbnQtZmlsZSc7XG5pbXBvcnQgeyBMaW51eFBhcmFtZXRlcnMgfSBmcm9tICcuL2xpbnV4LXBhcmFtZXRlcnMnO1xuaW1wb3J0IHsgTG9nRHJpdmVyLCBMb2dEcml2ZXJDb25maWcgfSBmcm9tICcuL2xvZy1kcml2ZXJzL2xvZy1kcml2ZXInO1xuXG4vKipcbiAqIFNwZWNpZnkgdGhlIHNlY3JldCdzIHZlcnNpb24gaWQgb3IgdmVyc2lvbiBzdGFnZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlY3JldFZlcnNpb25JbmZvIHtcbiAgLyoqXG4gICAqIHZlcnNpb24gaWQgb2YgdGhlIHNlY3JldFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHVzZSBkZWZhdWx0IHZlcnNpb24gaWRcbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb25JZD86IHN0cmluZztcbiAgLyoqXG4gICAqIHZlcnNpb24gc3RhZ2Ugb2YgdGhlIHNlY3JldFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHVzZSBkZWZhdWx0IHZlcnNpb24gc3RhZ2VcbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb25TdGFnZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIHNlY3JldCBlbnZpcm9ubWVudCB2YXJpYWJsZS5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNlY3JldCB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGVudmlyb25tZW50IHZhcmlhYmxlIHZhbHVlIGZyb20gYSBwYXJhbWV0ZXIgc3RvcmVkIGluIEFXU1xuICAgKiBTeXN0ZW1zIE1hbmFnZXIgUGFyYW1ldGVyIFN0b3JlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU3NtUGFyYW1ldGVyKHBhcmFtZXRlcjogc3NtLklQYXJhbWV0ZXIpOiBTZWNyZXQge1xuICAgIHJldHVybiB7XG4gICAgICBhcm46IHBhcmFtZXRlci5wYXJhbWV0ZXJBcm4sXG4gICAgICBncmFudFJlYWQ6IGdyYW50ZWUgPT4gcGFyYW1ldGVyLmdyYW50UmVhZChncmFudGVlKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBlbnZpcm9ubWVudCB2YXJpYWJsZSB2YWx1ZSBmcm9tIGEgc2VjcmV0IHN0b3JlZCBpbiBBV1MgU2VjcmV0c1xuICAgKiBNYW5hZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gc2VjcmV0IHRoZSBzZWNyZXQgc3RvcmVkIGluIEFXUyBTZWNyZXRzIE1hbmFnZXJcbiAgICogQHBhcmFtIGZpZWxkIHRoZSBuYW1lIG9mIHRoZSBmaWVsZCB3aXRoIHRoZSB2YWx1ZSB0aGF0IHlvdSB3YW50IHRvIHNldCBhc1xuICAgKiB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGUgdmFsdWUuIE9ubHkgdmFsdWVzIGluIEpTT04gZm9ybWF0IGFyZSBzdXBwb3J0ZWQuXG4gICAqIElmIHlvdSBkbyBub3Qgc3BlY2lmeSBhIEpTT04gZmllbGQsIHRoZW4gdGhlIGZ1bGwgY29udGVudCBvZiB0aGUgc2VjcmV0IGlzXG4gICAqIHVzZWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TZWNyZXRzTWFuYWdlcihzZWNyZXQ6IHNlY3JldHNtYW5hZ2VyLklTZWNyZXQsIGZpZWxkPzogc3RyaW5nKTogU2VjcmV0IHtcbiAgICByZXR1cm4ge1xuICAgICAgYXJuOiBmaWVsZCA/IGAke3NlY3JldC5zZWNyZXRBcm59OiR7ZmllbGR9OjpgIDogc2VjcmV0LnNlY3JldEFybixcbiAgICAgIGhhc0ZpZWxkOiAhIWZpZWxkLFxuICAgICAgZ3JhbnRSZWFkOiBncmFudGVlID0+IHNlY3JldC5ncmFudFJlYWQoZ3JhbnRlZSksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZW52aXJvbm1lbnQgdmFyaWFibGUgdmFsdWUgZnJvbSBhIHNlY3JldCBzdG9yZWQgaW4gQVdTIFNlY3JldHNcbiAgICogTWFuYWdlci5cbiAgICpcbiAgICogQHBhcmFtIHNlY3JldCB0aGUgc2VjcmV0IHN0b3JlZCBpbiBBV1MgU2VjcmV0cyBNYW5hZ2VyXG4gICAqIEBwYXJhbSB2ZXJzaW9uSW5mbyB0aGUgdmVyc2lvbiBpbmZvcm1hdGlvbiB0byByZWZlcmVuY2UgdGhlIHNlY3JldFxuICAgKiBAcGFyYW0gZmllbGQgdGhlIG5hbWUgb2YgdGhlIGZpZWxkIHdpdGggdGhlIHZhbHVlIHRoYXQgeW91IHdhbnQgdG8gc2V0IGFzXG4gICAqIHRoZSBlbnZpcm9ubWVudCB2YXJpYWJsZSB2YWx1ZS4gT25seSB2YWx1ZXMgaW4gSlNPTiBmb3JtYXQgYXJlIHN1cHBvcnRlZC5cbiAgICogSWYgeW91IGRvIG5vdCBzcGVjaWZ5IGEgSlNPTiBmaWVsZCwgdGhlbiB0aGUgZnVsbCBjb250ZW50IG9mIHRoZSBzZWNyZXQgaXNcbiAgICogdXNlZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNlY3JldHNNYW5hZ2VyVmVyc2lvbihzZWNyZXQ6IHNlY3JldHNtYW5hZ2VyLklTZWNyZXQsIHZlcnNpb25JbmZvOiBTZWNyZXRWZXJzaW9uSW5mbywgZmllbGQ/OiBzdHJpbmcpOiBTZWNyZXQge1xuICAgIHJldHVybiB7XG4gICAgICBhcm46IGAke3NlY3JldC5zZWNyZXRBcm59OiR7ZmllbGQgPz8gJyd9OiR7dmVyc2lvbkluZm8udmVyc2lvblN0YWdlID8/ICcnfToke3ZlcnNpb25JbmZvLnZlcnNpb25JZCA/PyAnJ31gLFxuICAgICAgaGFzRmllbGQ6ICEhZmllbGQsXG4gICAgICBncmFudFJlYWQ6IGdyYW50ZWUgPT4gc2VjcmV0LmdyYW50UmVhZChncmFudGVlKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIHNlY3JldFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoaXMgc2VjcmV0IHVzZXMgYSBzcGVjaWZpYyBKU09OIGZpZWxkXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgaGFzRmllbGQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBHcmFudHMgcmVhZGluZyB0aGUgc2VjcmV0IHRvIGEgcHJpbmNpcGFsXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgZ3JhbnRSZWFkKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50O1xufVxuXG4vKlxuICogVGhlIG9wdGlvbnMgZm9yIGNyZWF0aW5nIGEgY29udGFpbmVyIGRlZmluaXRpb24uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGFpbmVyRGVmaW5pdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGltYWdlIHVzZWQgdG8gc3RhcnQgYSBjb250YWluZXIuXG4gICAqXG4gICAqIFRoaXMgc3RyaW5nIGlzIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgRG9ja2VyIGRhZW1vbi5cbiAgICogSW1hZ2VzIGluIHRoZSBEb2NrZXIgSHViIHJlZ2lzdHJ5IGFyZSBhdmFpbGFibGUgYnkgZGVmYXVsdC5cbiAgICogT3RoZXIgcmVwb3NpdG9yaWVzIGFyZSBzcGVjaWZpZWQgd2l0aCBlaXRoZXIgcmVwb3NpdG9yeS11cmwvaW1hZ2U6dGFnIG9yIHJlcG9zaXRvcnktdXJsL2ltYWdlQGRpZ2VzdC5cbiAgICogVE9ETzogVXBkYXRlIHRoZXNlIHRvIHNwZWNpZnkgdXNpbmcgY2xhc3NlcyBvZiBJQ29udGFpbmVySW1hZ2VcbiAgICovXG4gIHJlYWRvbmx5IGltYWdlOiBDb250YWluZXJJbWFnZTtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBpZCBvZiBub2RlIGFzc29jaWF0ZWQgd2l0aCBDb250YWluZXJEZWZpbml0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNvbW1hbmQgdGhhdCBpcyBwYXNzZWQgdG8gdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogSWYgeW91IHByb3ZpZGUgYSBzaGVsbCBjb21tYW5kIGFzIGEgc2luZ2xlIHN0cmluZywgeW91IGhhdmUgdG8gcXVvdGUgY29tbWFuZC1saW5lIGFyZ3VtZW50cy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBDTUQgdmFsdWUgYnVpbHQgaW50byBjb250YWluZXIgaW1hZ2UuXG4gICAqL1xuICByZWFkb25seSBjb21tYW5kPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBtaW5pbXVtIG51bWJlciBvZiBDUFUgdW5pdHMgdG8gcmVzZXJ2ZSBmb3IgdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBtaW5pbXVtIENQVSB1bml0cyByZXNlcnZlZC5cbiAgICovXG4gIHJlYWRvbmx5IGNwdT86IG51bWJlcjtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgbmV0d29ya2luZyBpcyBkaXNhYmxlZCB3aXRoaW4gdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogV2hlbiB0aGlzIHBhcmFtZXRlciBpcyB0cnVlLCBuZXR3b3JraW5nIGlzIGRpc2FibGVkIHdpdGhpbiB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZGlzYWJsZU5ldHdvcmtpbmc/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgRE5TIHNlYXJjaCBkb21haW5zIHRoYXQgYXJlIHByZXNlbnRlZCB0byB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHNlYXJjaCBkb21haW5zLlxuICAgKi9cbiAgcmVhZG9ubHkgZG5zU2VhcmNoRG9tYWlucz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgRE5TIHNlcnZlcnMgdGhhdCBhcmUgcHJlc2VudGVkIHRvIHRoZSBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGVmYXVsdCBETlMgc2VydmVycy5cbiAgICovXG4gIHJlYWRvbmx5IGRuc1NlcnZlcnM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogQSBrZXkvdmFsdWUgbWFwIG9mIGxhYmVscyB0byBhZGQgdG8gdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBsYWJlbHMuXG4gICAqL1xuICByZWFkb25seSBkb2NrZXJMYWJlbHM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2Ygc3RyaW5ncyB0byBwcm92aWRlIGN1c3RvbSBsYWJlbHMgZm9yIFNFTGludXggYW5kIEFwcEFybW9yIG11bHRpLWxldmVsIHNlY3VyaXR5IHN5c3RlbXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gc2VjdXJpdHkgbGFiZWxzLlxuICAgKi9cbiAgcmVhZG9ubHkgZG9ja2VyU2VjdXJpdHlPcHRpb25zPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBFTlRSWVBPSU5UIHZhbHVlIHRvIHBhc3MgdG8gdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuZG9ja2VyLmNvbS9lbmdpbmUvcmVmZXJlbmNlL2J1aWxkZXIvI2VudHJ5cG9pbnRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBFbnRyeSBwb2ludCBjb25maWd1cmVkIGluIGNvbnRhaW5lci5cbiAgICovXG4gIHJlYWRvbmx5IGVudHJ5UG9pbnQ/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhlIGVudmlyb25tZW50IHZhcmlhYmxlcyB0byBwYXNzIHRvIHRoZSBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICAgKi9cbiAgcmVhZG9ubHkgZW52aXJvbm1lbnQ/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIC8qKlxuICAgKiBUaGUgZW52aXJvbm1lbnQgZmlsZXMgdG8gcGFzcyB0byB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3Rhc2tkZWYtZW52ZmlsZXMuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGVudmlyb25tZW50IGZpbGVzLlxuICAgKi9cbiAgcmVhZG9ubHkgZW52aXJvbm1lbnRGaWxlcz86IEVudmlyb25tZW50RmlsZVtdO1xuXG4gIC8qKlxuICAgKiBUaGUgc2VjcmV0IGVudmlyb25tZW50IHZhcmlhYmxlcyB0byBwYXNzIHRvIHRoZSBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gc2VjcmV0IGVudmlyb25tZW50IHZhcmlhYmxlcy5cbiAgICovXG4gIHJlYWRvbmx5IHNlY3JldHM/OiB7IFtrZXk6IHN0cmluZ106IFNlY3JldCB9O1xuXG4gIC8qKlxuICAgKiBUaW1lIGR1cmF0aW9uIChpbiBzZWNvbmRzKSB0byB3YWl0IGJlZm9yZSBnaXZpbmcgdXAgb24gcmVzb2x2aW5nIGRlcGVuZGVuY2llcyBmb3IgYSBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgc3RhcnRUaW1lb3V0PzogY2RrLkR1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaW1lIGR1cmF0aW9uIChpbiBzZWNvbmRzKSB0byB3YWl0IGJlZm9yZSB0aGUgY29udGFpbmVyIGlzIGZvcmNlZnVsbHkga2lsbGVkIGlmIGl0IGRvZXNuJ3QgZXhpdCBub3JtYWxseSBvbiBpdHMgb3duLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHN0b3BUaW1lb3V0PzogY2RrLkR1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciB0aGUgY29udGFpbmVyIGlzIG1hcmtlZCBlc3NlbnRpYWwuXG4gICAqXG4gICAqIElmIHRoZSBlc3NlbnRpYWwgcGFyYW1ldGVyIG9mIGEgY29udGFpbmVyIGlzIG1hcmtlZCBhcyB0cnVlLCBhbmQgdGhhdCBjb250YWluZXIgZmFpbHNcbiAgICogb3Igc3RvcHMgZm9yIGFueSByZWFzb24sIGFsbCBvdGhlciBjb250YWluZXJzIHRoYXQgYXJlIHBhcnQgb2YgdGhlIHRhc2sgYXJlIHN0b3BwZWQuXG4gICAqIElmIHRoZSBlc3NlbnRpYWwgcGFyYW1ldGVyIG9mIGEgY29udGFpbmVyIGlzIG1hcmtlZCBhcyBmYWxzZSwgdGhlbiBpdHMgZmFpbHVyZSBkb2VzIG5vdFxuICAgKiBhZmZlY3QgdGhlIHJlc3Qgb2YgdGhlIGNvbnRhaW5lcnMgaW4gYSB0YXNrLiBBbGwgdGFza3MgbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBlc3NlbnRpYWwgY29udGFpbmVyLlxuICAgKlxuICAgKiBJZiB0aGlzIHBhcmFtZXRlciBpcyBvbWl0dGVkLCBhIGNvbnRhaW5lciBpcyBhc3N1bWVkIHRvIGJlIGVzc2VudGlhbC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgZXNzZW50aWFsPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBsaXN0IG9mIGhvc3RuYW1lcyBhbmQgSVAgYWRkcmVzcyBtYXBwaW5ncyB0byBhcHBlbmQgdG8gdGhlIC9ldGMvaG9zdHMgZmlsZSBvbiB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGV4dHJhIGhvc3RzLlxuICAgKi9cbiAgcmVhZG9ubHkgZXh0cmFIb3N0cz86IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIC8qKlxuICAgKiBUaGUgaGVhbHRoIGNoZWNrIGNvbW1hbmQgYW5kIGFzc29jaWF0ZWQgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzIGZvciB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEhlYWx0aCBjaGVjayBjb25maWd1cmF0aW9uIGZyb20gY29udGFpbmVyLlxuICAgKi9cbiAgcmVhZG9ubHkgaGVhbHRoQ2hlY2s/OiBIZWFsdGhDaGVjaztcblxuICAvKipcbiAgICogVGhlIGhvc3RuYW1lIHRvIHVzZSBmb3IgeW91ciBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQXV0b21hdGljIGhvc3RuYW1lLlxuICAgKi9cbiAgcmVhZG9ubHkgaG9zdG5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBhbW91bnQgKGluIE1pQikgb2YgbWVtb3J5IHRvIHByZXNlbnQgdG8gdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogSWYgeW91ciBjb250YWluZXIgYXR0ZW1wdHMgdG8gZXhjZWVkIHRoZSBhbGxvY2F0ZWQgbWVtb3J5LCB0aGUgY29udGFpbmVyXG4gICAqIGlzIHRlcm1pbmF0ZWQuXG4gICAqXG4gICAqIEF0IGxlYXN0IG9uZSBvZiBtZW1vcnlMaW1pdE1pQiBhbmQgbWVtb3J5UmVzZXJ2YXRpb25NaUIgaXMgcmVxdWlyZWQgZm9yIG5vbi1GYXJnYXRlIHNlcnZpY2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIG1lbW9yeSBsaW1pdC5cbiAgICovXG4gIHJlYWRvbmx5IG1lbW9yeUxpbWl0TWlCPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgc29mdCBsaW1pdCAoaW4gTWlCKSBvZiBtZW1vcnkgdG8gcmVzZXJ2ZSBmb3IgdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogV2hlbiBzeXN0ZW0gbWVtb3J5IGlzIHVuZGVyIGhlYXZ5IGNvbnRlbnRpb24sIERvY2tlciBhdHRlbXB0cyB0byBrZWVwIHRoZVxuICAgKiBjb250YWluZXIgbWVtb3J5IHRvIHRoaXMgc29mdCBsaW1pdC4gSG93ZXZlciwgeW91ciBjb250YWluZXIgY2FuIGNvbnN1bWUgbW9yZVxuICAgKiBtZW1vcnkgd2hlbiBpdCBuZWVkcyB0bywgdXAgdG8gZWl0aGVyIHRoZSBoYXJkIGxpbWl0IHNwZWNpZmllZCB3aXRoIHRoZSBtZW1vcnlcbiAgICogcGFyYW1ldGVyIChpZiBhcHBsaWNhYmxlKSwgb3IgYWxsIG9mIHRoZSBhdmFpbGFibGUgbWVtb3J5IG9uIHRoZSBjb250YWluZXJcbiAgICogaW5zdGFuY2UsIHdoaWNoZXZlciBjb21lcyBmaXJzdC5cbiAgICpcbiAgICogQXQgbGVhc3Qgb25lIG9mIG1lbW9yeUxpbWl0TWlCIGFuZCBtZW1vcnlSZXNlcnZhdGlvbk1pQiBpcyByZXF1aXJlZCBmb3Igbm9uLUZhcmdhdGUgc2VydmljZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gbWVtb3J5IHJlc2VydmVkLlxuICAgKi9cbiAgcmVhZG9ubHkgbWVtb3J5UmVzZXJ2YXRpb25NaUI/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRoZSBjb250YWluZXIgaXMgbWFya2VkIGFzIHByaXZpbGVnZWQuXG4gICAqIFdoZW4gdGhpcyBwYXJhbWV0ZXIgaXMgdHJ1ZSwgdGhlIGNvbnRhaW5lciBpcyBnaXZlbiBlbGV2YXRlZCBwcml2aWxlZ2VzIG9uIHRoZSBob3N0IGNvbnRhaW5lciBpbnN0YW5jZSAoc2ltaWxhciB0byB0aGUgcm9vdCB1c2VyKS5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHByaXZpbGVnZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGVuIHRoaXMgcGFyYW1ldGVyIGlzIHRydWUsIHRoZSBjb250YWluZXIgaXMgZ2l2ZW4gcmVhZC1vbmx5IGFjY2VzcyB0byBpdHMgcm9vdCBmaWxlIHN5c3RlbS5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHJlYWRvbmx5Um9vdEZpbGVzeXN0ZW0/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgdXNlciBuYW1lIHRvIHVzZSBpbnNpZGUgdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgcm9vdFxuICAgKi9cbiAgcmVhZG9ubHkgdXNlcj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHdvcmtpbmcgZGlyZWN0b3J5IGluIHdoaWNoIHRvIHJ1biBjb21tYW5kcyBpbnNpZGUgdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgL1xuICAgKi9cbiAgcmVhZG9ubHkgd29ya2luZ0RpcmVjdG9yeT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGxvZyBjb25maWd1cmF0aW9uIHNwZWNpZmljYXRpb24gZm9yIHRoZSBjb250YWluZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQ29udGFpbmVycyB1c2UgdGhlIHNhbWUgbG9nZ2luZyBkcml2ZXIgdGhhdCB0aGUgRG9ja2VyIGRhZW1vbiB1c2VzLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9nZ2luZz86IExvZ0RyaXZlcjtcblxuICAvKipcbiAgICogTGludXgtc3BlY2lmaWMgbW9kaWZpY2F0aW9ucyB0aGF0IGFyZSBhcHBsaWVkIHRvIHRoZSBjb250YWluZXIsIHN1Y2ggYXMgTGludXgga2VybmVsIGNhcGFiaWxpdGllcy5cbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIFtLZXJuZWxDYXBhYmlsaXRpZXNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfS2VybmVsQ2FwYWJpbGl0aWVzLmh0bWwpLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIExpbnV4IHBhcmFtZXRlcnMuXG4gICAqL1xuICByZWFkb25seSBsaW51eFBhcmFtZXRlcnM/OiBMaW51eFBhcmFtZXRlcnM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgR1BVcyBhc3NpZ25lZCB0byB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIEdQVXMgYXNzaWduZWQuXG4gICAqL1xuICByZWFkb25seSBncHVDb3VudD86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHBvcnQgbWFwcGluZ3MgdG8gYWRkIHRvIHRoZSBjb250YWluZXIgZGVmaW5pdGlvbi5cbiAgICogQGRlZmF1bHQgLSBObyBwb3J0cyBhcmUgbWFwcGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgcG9ydE1hcHBpbmdzPzogUG9ydE1hcHBpbmdbXTtcblxuICAvKipcbiAgICogVGhlIGluZmVyZW5jZSBhY2NlbGVyYXRvcnMgcmVmZXJlbmNlZCBieSB0aGUgY29udGFpbmVyLlxuICAgKiBAZGVmYXVsdCAtIE5vIGluZmVyZW5jZSBhY2NlbGVyYXRvcnMgYXNzaWduZWQuXG4gICAqL1xuICByZWFkb25seSBpbmZlcmVuY2VBY2NlbGVyYXRvclJlc291cmNlcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgbmFtZXNwYWNlZCBrZXJuZWwgcGFyYW1ldGVycyB0byBzZXQgaW4gdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBzeXN0ZW0gY29udHJvbHMgYXJlIHNldC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lY3MtdGFza2RlZmluaXRpb24tc3lzdGVtY29udHJvbC5odG1sXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUy9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdGFza19kZWZpbml0aW9uX3BhcmFtZXRlcnMuaHRtbCNjb250YWluZXJfZGVmaW5pdGlvbl9zeXN0ZW1jb250cm9sc1xuICAgKi9cbiAgcmVhZG9ubHkgc3lzdGVtQ29udHJvbHM/OiBTeXN0ZW1Db250cm9sW107XG59XG5cbi8qKlxuICogVGhlIHByb3BlcnRpZXMgaW4gYSBjb250YWluZXIgZGVmaW5pdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb250YWluZXJEZWZpbml0aW9uUHJvcHMgZXh0ZW5kcyBDb250YWluZXJEZWZpbml0aW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgdGFzayBkZWZpbml0aW9uIHRoYXQgaW5jbHVkZXMgdGhpcyBjb250YWluZXIgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogW2Rpc2FibGUtYXdzbGludDpyZWYtdmlhLWludGVyZmFjZV1cbiAgICovXG4gIHJlYWRvbmx5IHRhc2tEZWZpbml0aW9uOiBUYXNrRGVmaW5pdGlvbjtcbn1cblxuLyoqXG4gKiBBIGNvbnRhaW5lciBkZWZpbml0aW9uIGlzIHVzZWQgaW4gYSB0YXNrIGRlZmluaXRpb24gdG8gZGVzY3JpYmUgdGhlIGNvbnRhaW5lcnMgdGhhdCBhcmUgbGF1bmNoZWQgYXMgcGFydCBvZiBhIHRhc2suXG4gKi9cbmV4cG9ydCBjbGFzcyBDb250YWluZXJEZWZpbml0aW9uIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgLyoqXG4gICAqIFRoZSBMaW51eC1zcGVjaWZpYyBtb2RpZmljYXRpb25zIHRoYXQgYXJlIGFwcGxpZWQgdG8gdGhlIGNvbnRhaW5lciwgc3VjaCBhcyBMaW51eCBrZXJuZWwgY2FwYWJpbGl0aWVzLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGxpbnV4UGFyYW1ldGVycz86IExpbnV4UGFyYW1ldGVycztcblxuICAvKipcbiAgICogVGhlIG1vdW50IHBvaW50cyBmb3IgZGF0YSB2b2x1bWVzIGluIHlvdXIgY29udGFpbmVyLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG1vdW50UG9pbnRzID0gbmV3IEFycmF5PE1vdW50UG9pbnQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIHBvcnQgbWFwcGluZ3MgZm9yIHRoZSBjb250YWluZXIuIFBvcnQgbWFwcGluZ3MgYWxsb3cgY29udGFpbmVycyB0byBhY2Nlc3MgcG9ydHNcbiAgICogb24gdGhlIGhvc3QgY29udGFpbmVyIGluc3RhbmNlIHRvIHNlbmQgb3IgcmVjZWl2ZSB0cmFmZmljLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHBvcnRNYXBwaW5ncyA9IG5ldyBBcnJheTxQb3J0TWFwcGluZz4oKTtcblxuICAvKipcbiAgICogVGhlIGRhdGEgdm9sdW1lcyB0byBtb3VudCBmcm9tIGFub3RoZXIgY29udGFpbmVyIGluIHRoZSBzYW1lIHRhc2sgZGVmaW5pdGlvbi5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2b2x1bWVzRnJvbSA9IG5ldyBBcnJheTxWb2x1bWVGcm9tPigpO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiB1bGltaXRzIHRvIHNldCBpbiB0aGUgY29udGFpbmVyLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHVsaW1pdHMgPSBuZXcgQXJyYXk8VWxpbWl0PigpO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBkZXBlbmRlbmNpZXMgZGVmaW5lZCBmb3IgY29udGFpbmVyIHN0YXJ0dXAgYW5kIHNodXRkb3duLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbnRhaW5lckRlcGVuZGVuY2llcyA9IG5ldyBBcnJheTxDb250YWluZXJEZXBlbmRlbmN5PigpO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciB0aGUgY29udGFpbmVyIHdpbGwgYmUgbWFya2VkIGVzc2VudGlhbC5cbiAgICpcbiAgICogSWYgdGhlIGVzc2VudGlhbCBwYXJhbWV0ZXIgb2YgYSBjb250YWluZXIgaXMgbWFya2VkIGFzIHRydWUsIGFuZCB0aGF0IGNvbnRhaW5lclxuICAgKiBmYWlscyBvciBzdG9wcyBmb3IgYW55IHJlYXNvbiwgYWxsIG90aGVyIGNvbnRhaW5lcnMgdGhhdCBhcmUgcGFydCBvZiB0aGUgdGFzayBhcmVcbiAgICogc3RvcHBlZC4gSWYgdGhlIGVzc2VudGlhbCBwYXJhbWV0ZXIgb2YgYSBjb250YWluZXIgaXMgbWFya2VkIGFzIGZhbHNlLCB0aGVuIGl0c1xuICAgKiBmYWlsdXJlIGRvZXMgbm90IGFmZmVjdCB0aGUgcmVzdCBvZiB0aGUgY29udGFpbmVycyBpbiBhIHRhc2suXG4gICAqXG4gICAqIElmIHRoaXMgcGFyYW1ldGVyIGlzIG9taXR0ZWQsIGEgY29udGFpbmVyIGlzIGFzc3VtZWQgdG8gYmUgZXNzZW50aWFsLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGVzc2VudGlhbDogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhpcyBjb250YWluZXJcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjb250YWluZXJOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlcmUgd2FzIGF0IGxlYXN0IG9uZSBtZW1vcnkgbGltaXQgc3BlY2lmaWVkIGluIHRoaXMgZGVmaW5pdGlvblxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG1lbW9yeUxpbWl0U3BlY2lmaWVkOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgdGFzayBkZWZpbml0aW9uIHRoYXQgaW5jbHVkZXMgdGhpcyBjb250YWluZXIgZGVmaW5pdGlvbi5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0YXNrRGVmaW5pdGlvbjogVGFza0RlZmluaXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBlbnZpcm9ubWVudCBmaWxlcyBmb3IgdGhpcyBjb250YWluZXJcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBlbnZpcm9ubWVudEZpbGVzPzogRW52aXJvbm1lbnRGaWxlQ29uZmlnW107XG5cbiAgLyoqXG4gICAqIFRoZSBsb2cgY29uZmlndXJhdGlvbiBzcGVjaWZpY2F0aW9uIGZvciB0aGUgY29udGFpbmVyLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGxvZ0RyaXZlckNvbmZpZz86IExvZ0RyaXZlckNvbmZpZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGltYWdlIHJlZmVyZW5jZWQgYnkgdGhpcyBjb250YWluZXIuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW1hZ2VOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBpbmZlcmVuY2UgYWNjZWxlcmF0b3JzIHJlZmVyZW5jZWQgYnkgdGhpcyBjb250YWluZXIuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGluZmVyZW5jZUFjY2VsZXJhdG9yUmVzb3VyY2VzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgY29uZmlndXJlZCBjb250YWluZXIgbGlua3NcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgbGlua3MgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgaW1hZ2VDb25maWc6IENvbnRhaW5lckltYWdlQ29uZmlnO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgc2VjcmV0czogQ2ZuVGFza0RlZmluaXRpb24uU2VjcmV0UHJvcGVydHlbXSA9IFtdO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZW52aXJvbm1lbnQ6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG5cbiAgcHJpdmF0ZSBfbmFtZWRQb3J0czogTWFwPHN0cmluZywgUG9ydE1hcHBpbmc+O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBDb250YWluZXJEZWZpbml0aW9uIGNsYXNzLlxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBwcm9wczogQ29udGFpbmVyRGVmaW5pdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICBpZiAocHJvcHMubWVtb3J5TGltaXRNaUIgIT09IHVuZGVmaW5lZCAmJiBwcm9wcy5tZW1vcnlSZXNlcnZhdGlvbk1pQiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAocHJvcHMubWVtb3J5TGltaXRNaUIgPCBwcm9wcy5tZW1vcnlSZXNlcnZhdGlvbk1pQikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01lbW9yeUxpbWl0TWlCIHNob3VsZCBub3QgYmUgbGVzcyB0aGFuIE1lbW9yeVJlc2VydmF0aW9uTWlCLicpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmVzc2VudGlhbCA9IHByb3BzLmVzc2VudGlhbCA/PyB0cnVlO1xuICAgIHRoaXMudGFza0RlZmluaXRpb24gPSBwcm9wcy50YXNrRGVmaW5pdGlvbjtcbiAgICB0aGlzLm1lbW9yeUxpbWl0U3BlY2lmaWVkID0gcHJvcHMubWVtb3J5TGltaXRNaUIgIT09IHVuZGVmaW5lZCB8fCBwcm9wcy5tZW1vcnlSZXNlcnZhdGlvbk1pQiAhPT0gdW5kZWZpbmVkO1xuICAgIHRoaXMubGludXhQYXJhbWV0ZXJzID0gcHJvcHMubGludXhQYXJhbWV0ZXJzO1xuICAgIHRoaXMuY29udGFpbmVyTmFtZSA9IHByb3BzLmNvbnRhaW5lck5hbWUgPz8gdGhpcy5ub2RlLmlkO1xuXG4gICAgdGhpcy5pbWFnZUNvbmZpZyA9IHByb3BzLmltYWdlLmJpbmQodGhpcywgdGhpcyk7XG4gICAgdGhpcy5pbWFnZU5hbWUgPSB0aGlzLmltYWdlQ29uZmlnLmltYWdlTmFtZTtcblxuICAgIHRoaXMuX25hbWVkUG9ydHMgPSBuZXcgTWFwPHN0cmluZywgUG9ydE1hcHBpbmc+KCk7XG5cbiAgICBpZiAocHJvcHMubG9nZ2luZykge1xuICAgICAgdGhpcy5sb2dEcml2ZXJDb25maWcgPSBwcm9wcy5sb2dnaW5nLmJpbmQodGhpcywgdGhpcyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnNlY3JldHMpIHtcbiAgICAgIGZvciAoY29uc3QgW25hbWUsIHNlY3JldF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHMuc2VjcmV0cykpIHtcbiAgICAgICAgdGhpcy5hZGRTZWNyZXQobmFtZSwgc2VjcmV0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJvcHMuZW52aXJvbm1lbnQpIHtcbiAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSB7IC4uLnByb3BzLmVudmlyb25tZW50IH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW52aXJvbm1lbnQgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuZW52aXJvbm1lbnRGaWxlcykge1xuICAgICAgdGhpcy5lbnZpcm9ubWVudEZpbGVzID0gW107XG5cbiAgICAgIGZvciAoY29uc3QgZW52aXJvbm1lbnRGaWxlIG9mIHByb3BzLmVudmlyb25tZW50RmlsZXMpIHtcbiAgICAgICAgdGhpcy5lbnZpcm9ubWVudEZpbGVzLnB1c2goZW52aXJvbm1lbnRGaWxlLmJpbmQodGhpcykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHByb3BzLnRhc2tEZWZpbml0aW9uLl9saW5rQ29udGFpbmVyKHRoaXMpO1xuXG4gICAgaWYgKHByb3BzLnBvcnRNYXBwaW5ncykge1xuICAgICAgdGhpcy5hZGRQb3J0TWFwcGluZ3MoLi4ucHJvcHMucG9ydE1hcHBpbmdzKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuaW5mZXJlbmNlQWNjZWxlcmF0b3JSZXNvdXJjZXMpIHtcbiAgICAgIHRoaXMuYWRkSW5mZXJlbmNlQWNjZWxlcmF0b3JSZXNvdXJjZSguLi5wcm9wcy5pbmZlcmVuY2VBY2NlbGVyYXRvclJlc291cmNlcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGFkZHMgYSBsaW5rIHdoaWNoIGFsbG93cyBjb250YWluZXJzIHRvIGNvbW11bmljYXRlIHdpdGggZWFjaCBvdGhlciB3aXRob3V0IHRoZSBuZWVkIGZvciBwb3J0IG1hcHBpbmdzLlxuICAgKlxuICAgKiBUaGlzIHBhcmFtZXRlciBpcyBvbmx5IHN1cHBvcnRlZCBpZiB0aGUgdGFzayBkZWZpbml0aW9uIGlzIHVzaW5nIHRoZSBicmlkZ2UgbmV0d29yayBtb2RlLlxuICAgKiBXYXJuaW5nOiBUaGUgLS1saW5rIGZsYWcgaXMgYSBsZWdhY3kgZmVhdHVyZSBvZiBEb2NrZXIuIEl0IG1heSBldmVudHVhbGx5IGJlIHJlbW92ZWQuXG4gICAqL1xuICBwdWJsaWMgYWRkTGluayhjb250YWluZXI6IENvbnRhaW5lckRlZmluaXRpb24sIGFsaWFzPzogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMudGFza0RlZmluaXRpb24ubmV0d29ya01vZGUgIT09IE5ldHdvcmtNb2RlLkJSSURHRSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCB1c2UgbmV0d29yayBtb2RlIEJyaWRnZSB0byBhZGQgY29udGFpbmVyIGxpbmtzLicpO1xuICAgIH1cbiAgICBpZiAoYWxpYXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5saW5rcy5wdXNoKGAke2NvbnRhaW5lci5jb250YWluZXJOYW1lfToke2FsaWFzfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxpbmtzLnB1c2goYCR7Y29udGFpbmVyLmNvbnRhaW5lck5hbWV9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGFkZHMgb25lIG9yIG1vcmUgbW91bnQgcG9pbnRzIGZvciBkYXRhIHZvbHVtZXMgdG8gdGhlIGNvbnRhaW5lci5cbiAgICovXG4gIHB1YmxpYyBhZGRNb3VudFBvaW50cyguLi5tb3VudFBvaW50czogTW91bnRQb2ludFtdKSB7XG4gICAgdGhpcy5tb3VudFBvaW50cy5wdXNoKC4uLm1vdW50UG9pbnRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBtb3VudHMgdGVtcG9yYXJ5IGRpc2sgc3BhY2UgdG8gdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogVGhpcyBhZGRzIHRoZSBjb3JyZWN0IGNvbnRhaW5lciBtb3VudFBvaW50IGFuZCB0YXNrIGRlZmluaXRpb24gdm9sdW1lLlxuICAgKi9cbiAgcHVibGljIGFkZFNjcmF0Y2goc2NyYXRjaDogU2NyYXRjaFNwYWNlKSB7XG4gICAgY29uc3QgbW91bnRQb2ludCA9IHtcbiAgICAgIGNvbnRhaW5lclBhdGg6IHNjcmF0Y2guY29udGFpbmVyUGF0aCxcbiAgICAgIHJlYWRPbmx5OiBzY3JhdGNoLnJlYWRPbmx5LFxuICAgICAgc291cmNlVm9sdW1lOiBzY3JhdGNoLm5hbWUsXG4gICAgfTtcblxuICAgIGNvbnN0IHZvbHVtZSA9IHtcbiAgICAgIGhvc3Q6IHtcbiAgICAgICAgc291cmNlUGF0aDogc2NyYXRjaC5zb3VyY2VQYXRoLFxuICAgICAgfSxcbiAgICAgIG5hbWU6IHNjcmF0Y2gubmFtZSxcbiAgICB9O1xuXG4gICAgdGhpcy50YXNrRGVmaW5pdGlvbi5hZGRWb2x1bWUodm9sdW1lKTtcbiAgICB0aGlzLmFkZE1vdW50UG9pbnRzKG1vdW50UG9pbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGFkZHMgb25lIG9yIG1vcmUgcG9ydCBtYXBwaW5ncyB0byB0aGUgY29udGFpbmVyLlxuICAgKi9cbiAgcHVibGljIGFkZFBvcnRNYXBwaW5ncyguLi5wb3J0TWFwcGluZ3M6IFBvcnRNYXBwaW5nW10pIHtcbiAgICB0aGlzLnBvcnRNYXBwaW5ncy5wdXNoKC4uLnBvcnRNYXBwaW5ncy5tYXAocG0gPT4ge1xuICAgICAgY29uc3QgcG9ydE1hcCA9IG5ldyBQb3J0TWFwKHRoaXMudGFza0RlZmluaXRpb24ubmV0d29ya01vZGUsIHBtKTtcbiAgICAgIHBvcnRNYXAudmFsaWRhdGUoKTtcbiAgICAgIGNvbnN0IHNlcnZpY2VDb25uZWN0ID0gbmV3IFNlcnZpY2VDb25uZWN0KHRoaXMudGFza0RlZmluaXRpb24ubmV0d29ya01vZGUsIHBtKTtcbiAgICAgIGlmIChzZXJ2aWNlQ29ubmVjdC5pc1NlcnZpY2VDb25uZWN0KCkpIHtcbiAgICAgICAgc2VydmljZUNvbm5lY3QudmFsaWRhdGUoKTtcbiAgICAgICAgdGhpcy5zZXROYW1lZFBvcnQocG0pO1xuICAgICAgfVxuICAgICAgY29uc3Qgc2FuaXRpemVkUE0gPSB0aGlzLmFkZEhvc3RQb3J0SWZOZWVkZWQocG0pO1xuICAgICAgcmV0dXJuIHNhbml0aXplZFBNO1xuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBhZGRzIGFuIGVudmlyb25tZW50IHZhcmlhYmxlIHRvIHRoZSBjb250YWluZXIuXG4gICAqL1xuICBwdWJsaWMgYWRkRW52aXJvbm1lbnQobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5lbnZpcm9ubWVudFtuYW1lXSA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGFkZHMgYSBzZWNyZXQgYXMgZW52aXJvbm1lbnQgdmFyaWFibGUgdG8gdGhlIGNvbnRhaW5lci5cbiAgICovXG4gIHB1YmxpYyBhZGRTZWNyZXQobmFtZTogc3RyaW5nLCBzZWNyZXQ6IFNlY3JldCkge1xuICAgIHNlY3JldC5ncmFudFJlYWQodGhpcy50YXNrRGVmaW5pdGlvbi5vYnRhaW5FeGVjdXRpb25Sb2xlKCkpO1xuXG4gICAgdGhpcy5zZWNyZXRzLnB1c2goe1xuICAgICAgbmFtZSxcbiAgICAgIHZhbHVlRnJvbTogc2VjcmV0LmFybixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBhZGRzIG9uZSBvciBtb3JlIHJlc291cmNlcyB0byB0aGUgY29udGFpbmVyLlxuICAgKi9cbiAgcHVibGljIGFkZEluZmVyZW5jZUFjY2VsZXJhdG9yUmVzb3VyY2UoLi4uaW5mZXJlbmNlQWNjZWxlcmF0b3JSZXNvdXJjZXM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5pbmZlcmVuY2VBY2NlbGVyYXRvclJlc291cmNlcy5wdXNoKC4uLmluZmVyZW5jZUFjY2VsZXJhdG9yUmVzb3VyY2VzLm1hcChyZXNvdXJjZSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGluZmVyZW5jZUFjY2VsZXJhdG9yIG9mIHRoaXMudGFza0RlZmluaXRpb24uaW5mZXJlbmNlQWNjZWxlcmF0b3JzKSB7XG4gICAgICAgIGlmIChyZXNvdXJjZSA9PT0gaW5mZXJlbmNlQWNjZWxlcmF0b3IuZGV2aWNlTmFtZSkge1xuICAgICAgICAgIHJldHVybiByZXNvdXJjZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZXNvdXJjZSB2YWx1ZSAke3Jlc291cmNlfSBpbiBjb250YWluZXIgZGVmaW5pdGlvbiBkb2Vzbid0IG1hdGNoIGFueSBpbmZlcmVuY2UgYWNjZWxlcmF0b3IgZGV2aWNlIG5hbWUgaW4gdGhlIHRhc2sgZGVmaW5pdGlvbi5gKTtcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgYWRkcyBvbmUgb3IgbW9yZSB1bGltaXRzIHRvIHRoZSBjb250YWluZXIuXG4gICAqL1xuICBwdWJsaWMgYWRkVWxpbWl0cyguLi51bGltaXRzOiBVbGltaXRbXSkge1xuICAgIHRoaXMudWxpbWl0cy5wdXNoKC4uLnVsaW1pdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGFkZHMgb25lIG9yIG1vcmUgY29udGFpbmVyIGRlcGVuZGVuY2llcyB0byB0aGUgY29udGFpbmVyLlxuICAgKi9cbiAgcHVibGljIGFkZENvbnRhaW5lckRlcGVuZGVuY2llcyguLi5jb250YWluZXJEZXBlbmRlbmNpZXM6IENvbnRhaW5lckRlcGVuZGVuY3lbXSkge1xuICAgIHRoaXMuY29udGFpbmVyRGVwZW5kZW5jaWVzLnB1c2goLi4uY29udGFpbmVyRGVwZW5kZW5jaWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBhZGRzIG9uZSBvciBtb3JlIHZvbHVtZXMgdG8gdGhlIGNvbnRhaW5lci5cbiAgICovXG4gIHB1YmxpYyBhZGRWb2x1bWVzRnJvbSguLi52b2x1bWVzRnJvbTogVm9sdW1lRnJvbVtdKSB7XG4gICAgdGhpcy52b2x1bWVzRnJvbS5wdXNoKC4uLnZvbHVtZXNGcm9tKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBhZGRzIHRoZSBzcGVjaWZpZWQgc3RhdGVtZW50IHRvIHRoZSBJQU0gdGFzayBleGVjdXRpb24gcG9saWN5IGluIHRoZSB0YXNrIGRlZmluaXRpb24uXG4gICAqL1xuICBwdWJsaWMgYWRkVG9FeGVjdXRpb25Qb2xpY3koc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KSB7XG4gICAgdGhpcy50YXNrRGVmaW5pdGlvbi5hZGRUb0V4ZWN1dGlvblJvbGVQb2xpY3koc3RhdGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBob3N0IHBvcnQgZm9yIHRoZSByZXF1ZXN0ZWQgY29udGFpbmVyIHBvcnQgaWYgaXQgZXhpc3RzXG4gICAqL1xuICBwdWJsaWMgZmluZFBvcnRNYXBwaW5nKGNvbnRhaW5lclBvcnQ6IG51bWJlciwgcHJvdG9jb2w6IFByb3RvY29sKTogUG9ydE1hcHBpbmcgfCB1bmRlZmluZWQge1xuICAgIGZvciAoY29uc3QgcG9ydE1hcHBpbmcgb2YgdGhpcy5wb3J0TWFwcGluZ3MpIHtcbiAgICAgIGNvbnN0IHAgPSBwb3J0TWFwcGluZy5wcm90b2NvbCB8fCBQcm90b2NvbC5UQ1A7XG4gICAgICBjb25zdCBjID0gcG9ydE1hcHBpbmcuY29udGFpbmVyUG9ydDtcbiAgICAgIGlmIChjID09PSBjb250YWluZXJQb3J0ICYmIHAgPT09IHByb3RvY29sKSB7XG4gICAgICAgIHJldHVybiBwb3J0TWFwcGluZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBwb3J0IG1hcHBpbmcgd2l0aCB0aGUgZ2l2ZW4gbmFtZSwgaWYgaXQgZXhpc3RzLlxuICAgKi9cbiAgcHVibGljIGZpbmRQb3J0TWFwcGluZ0J5TmFtZShuYW1lOiBzdHJpbmcpOiBQb3J0TWFwcGluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWVkUG9ydHMuZ2V0KG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGFkZHMgYW4gbmFtZWRQb3J0XG4gICAqL1xuICBwcml2YXRlIHNldE5hbWVkUG9ydChwbTogUG9ydE1hcHBpbmcpIDp2b2lkIHtcbiAgICBpZiAoIXBtLm5hbWUpIHJldHVybjtcbiAgICBpZiAodGhpcy5fbmFtZWRQb3J0cy5oYXMocG0ubmFtZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUG9ydCBtYXBwaW5nIG5hbWUgJyR7cG0ubmFtZX0nIGFscmVhZHkgZXhpc3RzIG9uIHRoaXMgY29udGFpbmVyYCk7XG4gICAgfVxuICAgIHRoaXMuX25hbWVkUG9ydHMuc2V0KHBtLm5hbWUsIHBtKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFNldCBIb3N0UG9ydCB0byAwIFdoZW4gbmV0b3dvcmsgbW9kZSBpcyBCcmRpZ2VcbiAgICovXG4gIHByaXZhdGUgYWRkSG9zdFBvcnRJZk5lZWRlZChwbTogUG9ydE1hcHBpbmcpIDpQb3J0TWFwcGluZyB7XG4gICAgY29uc3QgbmV3UE0gPSB7XG4gICAgICAuLi5wbSxcbiAgICB9O1xuICAgIGlmICh0aGlzLnRhc2tEZWZpbml0aW9uLm5ldHdvcmtNb2RlICE9PSBOZXR3b3JrTW9kZS5CUklER0UpIHJldHVybiBuZXdQTTtcbiAgICBpZiAocG0uaG9zdFBvcnQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIG5ld1BNO1xuICAgIG5ld1BNLmhvc3RQb3J0ID0gMDtcbiAgICByZXR1cm4gbmV3UE07XG4gIH1cblxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoaXMgY29udGFpbmVyIGRlZmluaXRpb24gcmVmZXJlbmNlcyBhIHNwZWNpZmljIEpTT04gZmllbGQgb2YgYSBzZWNyZXRcbiAgICogc3RvcmVkIGluIFNlY3JldHMgTWFuYWdlci5cbiAgICovXG4gIHB1YmxpYyBnZXQgcmVmZXJlbmNlc1NlY3JldEpzb25GaWVsZCgpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICBmb3IgKGNvbnN0IHNlY3JldCBvZiB0aGlzLnNlY3JldHMpIHtcbiAgICAgIGlmIChzZWNyZXQudmFsdWVGcm9tLmVuZHNXaXRoKCc6OicpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGluYm91bmQgcnVsZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBzZWN1cml0eSBncm91cCB0aGUgdGFzayBvciBzZXJ2aWNlIHdpbGwgdXNlLlxuICAgKlxuICAgKiBUaGlzIHByb3BlcnR5IGlzIG9ubHkgdXNlZCBmb3IgdGFza3MgdGhhdCB1c2UgdGhlIGF3c3ZwYyBuZXR3b3JrIG1vZGUuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGluZ3Jlc3NQb3J0KCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMucG9ydE1hcHBpbmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb250YWluZXIgJHt0aGlzLmNvbnRhaW5lck5hbWV9IGhhc24ndCBkZWZpbmVkIGFueSBwb3J0cy4gQ2FsbCBhZGRQb3J0TWFwcGluZ3MoKS5gKTtcbiAgICB9XG4gICAgY29uc3QgZGVmYXVsdFBvcnRNYXBwaW5nID0gdGhpcy5wb3J0TWFwcGluZ3NbMF07XG5cbiAgICBpZiAoZGVmYXVsdFBvcnRNYXBwaW5nLmhvc3RQb3J0ICE9PSB1bmRlZmluZWQgJiYgZGVmYXVsdFBvcnRNYXBwaW5nLmhvc3RQb3J0ICE9PSAwKSB7XG4gICAgICByZXR1cm4gZGVmYXVsdFBvcnRNYXBwaW5nLmhvc3RQb3J0O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRhc2tEZWZpbml0aW9uLm5ldHdvcmtNb2RlID09PSBOZXR3b3JrTW9kZS5CUklER0UpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gZGVmYXVsdFBvcnRNYXBwaW5nLmNvbnRhaW5lclBvcnQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHBvcnQgdGhlIGNvbnRhaW5lciB3aWxsIGxpc3RlbiBvbi5cbiAgICovXG4gIHB1YmxpYyBnZXQgY29udGFpbmVyUG9ydCgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLnBvcnRNYXBwaW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ29udGFpbmVyICR7dGhpcy5jb250YWluZXJOYW1lfSBoYXNuJ3QgZGVmaW5lZCBhbnkgcG9ydHMuIENhbGwgYWRkUG9ydE1hcHBpbmdzKCkuYCk7XG4gICAgfVxuICAgIGNvbnN0IGRlZmF1bHRQb3J0TWFwcGluZyA9IHRoaXMucG9ydE1hcHBpbmdzWzBdO1xuICAgIHJldHVybiBkZWZhdWx0UG9ydE1hcHBpbmcuY29udGFpbmVyUG9ydDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhpcyBjb250YWluZXIgZGVmaW5pdGlvbiB0byBhIENsb3VkRm9ybWF0aW9uIG9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0gX3Rhc2tEZWZpbml0aW9uIFtkaXNhYmxlLWF3c2xpbnQ6cmVmLXZpYS1pbnRlcmZhY2VdICh1bnVzZWQgYnV0IGtlcHQgdG8gYXZvaWQgYnJlYWtpbmcgY2hhbmdlKVxuICAgKi9cbiAgcHVibGljIHJlbmRlckNvbnRhaW5lckRlZmluaXRpb24oX3Rhc2tEZWZpbml0aW9uPzogVGFza0RlZmluaXRpb24pOiBDZm5UYXNrRGVmaW5pdGlvbi5Db250YWluZXJEZWZpbml0aW9uUHJvcGVydHkge1xuICAgIHJldHVybiB7XG4gICAgICBjb21tYW5kOiB0aGlzLnByb3BzLmNvbW1hbmQsXG4gICAgICBjcHU6IHRoaXMucHJvcHMuY3B1LFxuICAgICAgZGlzYWJsZU5ldHdvcmtpbmc6IHRoaXMucHJvcHMuZGlzYWJsZU5ldHdvcmtpbmcsXG4gICAgICBkZXBlbmRzT246IGNkay5MYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMuY29udGFpbmVyRGVwZW5kZW5jaWVzLm1hcChyZW5kZXJDb250YWluZXJEZXBlbmRlbmN5KSB9LCB7IG9taXRFbXB0eUFycmF5OiB0cnVlIH0pLFxuICAgICAgZG5zU2VhcmNoRG9tYWluczogdGhpcy5wcm9wcy5kbnNTZWFyY2hEb21haW5zLFxuICAgICAgZG5zU2VydmVyczogdGhpcy5wcm9wcy5kbnNTZXJ2ZXJzLFxuICAgICAgZG9ja2VyTGFiZWxzOiB0aGlzLnByb3BzLmRvY2tlckxhYmVscyxcbiAgICAgIGRvY2tlclNlY3VyaXR5T3B0aW9uczogdGhpcy5wcm9wcy5kb2NrZXJTZWN1cml0eU9wdGlvbnMsXG4gICAgICBlbnRyeVBvaW50OiB0aGlzLnByb3BzLmVudHJ5UG9pbnQsXG4gICAgICBlc3NlbnRpYWw6IHRoaXMuZXNzZW50aWFsLFxuICAgICAgaG9zdG5hbWU6IHRoaXMucHJvcHMuaG9zdG5hbWUsXG4gICAgICBpbWFnZTogdGhpcy5pbWFnZUNvbmZpZy5pbWFnZU5hbWUsXG4gICAgICBtZW1vcnk6IHRoaXMucHJvcHMubWVtb3J5TGltaXRNaUIsXG4gICAgICBtZW1vcnlSZXNlcnZhdGlvbjogdGhpcy5wcm9wcy5tZW1vcnlSZXNlcnZhdGlvbk1pQixcbiAgICAgIG1vdW50UG9pbnRzOiBjZGsuTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLm1vdW50UG9pbnRzLm1hcChyZW5kZXJNb3VudFBvaW50KSB9LCB7IG9taXRFbXB0eUFycmF5OiB0cnVlIH0pLFxuICAgICAgbmFtZTogdGhpcy5jb250YWluZXJOYW1lLFxuICAgICAgcG9ydE1hcHBpbmdzOiBjZGsuTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnBvcnRNYXBwaW5ncy5tYXAocmVuZGVyUG9ydE1hcHBpbmcpIH0sIHsgb21pdEVtcHR5QXJyYXk6IHRydWUgfSksXG4gICAgICBwcml2aWxlZ2VkOiB0aGlzLnByb3BzLnByaXZpbGVnZWQsXG4gICAgICByZWFkb25seVJvb3RGaWxlc3lzdGVtOiB0aGlzLnByb3BzLnJlYWRvbmx5Um9vdEZpbGVzeXN0ZW0sXG4gICAgICByZXBvc2l0b3J5Q3JlZGVudGlhbHM6IHRoaXMuaW1hZ2VDb25maWcucmVwb3NpdG9yeUNyZWRlbnRpYWxzLFxuICAgICAgc3RhcnRUaW1lb3V0OiB0aGlzLnByb3BzLnN0YXJ0VGltZW91dCAmJiB0aGlzLnByb3BzLnN0YXJ0VGltZW91dC50b1NlY29uZHMoKSxcbiAgICAgIHN0b3BUaW1lb3V0OiB0aGlzLnByb3BzLnN0b3BUaW1lb3V0ICYmIHRoaXMucHJvcHMuc3RvcFRpbWVvdXQudG9TZWNvbmRzKCksXG4gICAgICB1bGltaXRzOiBjZGsuTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnVsaW1pdHMubWFwKHJlbmRlclVsaW1pdCkgfSwgeyBvbWl0RW1wdHlBcnJheTogdHJ1ZSB9KSxcbiAgICAgIHVzZXI6IHRoaXMucHJvcHMudXNlcixcbiAgICAgIHZvbHVtZXNGcm9tOiBjZGsuTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnZvbHVtZXNGcm9tLm1hcChyZW5kZXJWb2x1bWVGcm9tKSB9LCB7IG9taXRFbXB0eUFycmF5OiB0cnVlIH0pLFxuICAgICAgd29ya2luZ0RpcmVjdG9yeTogdGhpcy5wcm9wcy53b3JraW5nRGlyZWN0b3J5LFxuICAgICAgbG9nQ29uZmlndXJhdGlvbjogdGhpcy5sb2dEcml2ZXJDb25maWcsXG4gICAgICBlbnZpcm9ubWVudDogdGhpcy5lbnZpcm9ubWVudCAmJiBPYmplY3Qua2V5cyh0aGlzLmVudmlyb25tZW50KS5sZW5ndGggPyByZW5kZXJLVih0aGlzLmVudmlyb25tZW50LCAnbmFtZScsICd2YWx1ZScpIDogdW5kZWZpbmVkLFxuICAgICAgZW52aXJvbm1lbnRGaWxlczogdGhpcy5lbnZpcm9ubWVudEZpbGVzICYmIHJlbmRlckVudmlyb25tZW50RmlsZXMoY2RrLlN0YWNrLm9mKHRoaXMpLnBhcnRpdGlvbiwgdGhpcy5lbnZpcm9ubWVudEZpbGVzKSxcbiAgICAgIHNlY3JldHM6IHRoaXMuc2VjcmV0cy5sZW5ndGggPyB0aGlzLnNlY3JldHMgOiB1bmRlZmluZWQsXG4gICAgICBleHRyYUhvc3RzOiB0aGlzLnByb3BzLmV4dHJhSG9zdHMgJiYgcmVuZGVyS1YodGhpcy5wcm9wcy5leHRyYUhvc3RzLCAnaG9zdG5hbWUnLCAnaXBBZGRyZXNzJyksXG4gICAgICBoZWFsdGhDaGVjazogdGhpcy5wcm9wcy5oZWFsdGhDaGVjayAmJiByZW5kZXJIZWFsdGhDaGVjayh0aGlzLnByb3BzLmhlYWx0aENoZWNrKSxcbiAgICAgIGxpbmtzOiBjZGsuTGF6eS5saXN0KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5saW5rcyB9LCB7IG9taXRFbXB0eTogdHJ1ZSB9KSxcbiAgICAgIGxpbnV4UGFyYW1ldGVyczogdGhpcy5saW51eFBhcmFtZXRlcnMgJiYgdGhpcy5saW51eFBhcmFtZXRlcnMucmVuZGVyTGludXhQYXJhbWV0ZXJzKCksXG4gICAgICByZXNvdXJjZVJlcXVpcmVtZW50czogKCF0aGlzLnByb3BzLmdwdUNvdW50ICYmIHRoaXMuaW5mZXJlbmNlQWNjZWxlcmF0b3JSZXNvdXJjZXMubGVuZ3RoID09IDAgKSA/IHVuZGVmaW5lZCA6XG4gICAgICAgIHJlbmRlclJlc291cmNlUmVxdWlyZW1lbnRzKHRoaXMucHJvcHMuZ3B1Q291bnQsIHRoaXMuaW5mZXJlbmNlQWNjZWxlcmF0b3JSZXNvdXJjZXMpLFxuICAgICAgc3lzdGVtQ29udHJvbHM6IHRoaXMucHJvcHMuc3lzdGVtQ29udHJvbHMgJiYgcmVuZGVyU3lzdGVtQ29udHJvbHModGhpcy5wcm9wcy5zeXN0ZW1Db250cm9scyksXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBoZWFsdGggY2hlY2sgY29tbWFuZCBhbmQgYXNzb2NpYXRlZCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgZm9yIHRoZSBjb250YWluZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSGVhbHRoQ2hlY2sge1xuICAvKipcbiAgICogQSBzdHJpbmcgYXJyYXkgcmVwcmVzZW50aW5nIHRoZSBjb21tYW5kIHRoYXQgdGhlIGNvbnRhaW5lciBydW5zIHRvIGRldGVybWluZSBpZiBpdCBpcyBoZWFsdGh5LlxuICAgKiBUaGUgc3RyaW5nIGFycmF5IG11c3Qgc3RhcnQgd2l0aCBDTUQgdG8gZXhlY3V0ZSB0aGUgY29tbWFuZCBhcmd1bWVudHMgZGlyZWN0bHksIG9yXG4gICAqIENNRC1TSEVMTCB0byBydW4gdGhlIGNvbW1hbmQgd2l0aCB0aGUgY29udGFpbmVyJ3MgZGVmYXVsdCBzaGVsbC5cbiAgICpcbiAgICogRm9yIGV4YW1wbGU6IFsgXCJDTUQtU0hFTExcIiwgXCJjdXJsIC1mIGh0dHA6Ly9sb2NhbGhvc3QvIHx8IGV4aXQgMVwiIF1cbiAgICovXG4gIHJlYWRvbmx5IGNvbW1hbmQ6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBUaGUgdGltZSBwZXJpb2QgaW4gc2Vjb25kcyBiZXR3ZWVuIGVhY2ggaGVhbHRoIGNoZWNrIGV4ZWN1dGlvbi5cbiAgICpcbiAgICogWW91IG1heSBzcGVjaWZ5IGJldHdlZW4gNSBhbmQgMzAwIHNlY29uZHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLnNlY29uZHMoMzApXG4gICAqL1xuICByZWFkb25seSBpbnRlcnZhbD86IGNkay5EdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiB0aW1lcyB0byByZXRyeSBhIGZhaWxlZCBoZWFsdGggY2hlY2sgYmVmb3JlIHRoZSBjb250YWluZXIgaXMgY29uc2lkZXJlZCB1bmhlYWx0aHkuXG4gICAqXG4gICAqIFlvdSBtYXkgc3BlY2lmeSBiZXR3ZWVuIDEgYW5kIDEwIHJldHJpZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IDNcbiAgICovXG4gIHJlYWRvbmx5IHJldHJpZXM/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBvcHRpb25hbCBncmFjZSBwZXJpb2Qgd2l0aGluIHdoaWNoIHRvIHByb3ZpZGUgY29udGFpbmVycyB0aW1lIHRvIGJvb3RzdHJhcCBiZWZvcmVcbiAgICogZmFpbGVkIGhlYWx0aCBjaGVja3MgY291bnQgdG93YXJkcyB0aGUgbWF4aW11bSBudW1iZXIgb2YgcmV0cmllcy5cbiAgICpcbiAgICogWW91IG1heSBzcGVjaWZ5IGJldHdlZW4gMCBhbmQgMzAwIHNlY29uZHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIHN0YXJ0IHBlcmlvZFxuICAgKi9cbiAgcmVhZG9ubHkgc3RhcnRQZXJpb2Q/OiBjZGsuRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIHBlcmlvZCBpbiBzZWNvbmRzIHRvIHdhaXQgZm9yIGEgaGVhbHRoIGNoZWNrIHRvIHN1Y2NlZWQgYmVmb3JlIGl0IGlzIGNvbnNpZGVyZWQgYSBmYWlsdXJlLlxuICAgKlxuICAgKiBZb3UgbWF5IHNwZWNpZnkgYmV0d2VlbiAyIGFuZCA2MCBzZWNvbmRzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5zZWNvbmRzKDUpXG4gICAqL1xuICByZWFkb25seSB0aW1lb3V0PzogY2RrLkR1cmF0aW9uO1xufVxuXG5mdW5jdGlvbiByZW5kZXJLVihlbnY6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0sIGtleU5hbWU6IHN0cmluZywgdmFsdWVOYW1lOiBzdHJpbmcpOiBhbnlbXSB7XG4gIGNvbnN0IHJldCA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhlbnYpKSB7XG4gICAgcmV0LnB1c2goeyBba2V5TmFtZV06IGtleSwgW3ZhbHVlTmFtZV06IHZhbHVlIH0pO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIHJlbmRlckVudmlyb25tZW50RmlsZXMocGFydGl0aW9uOiBzdHJpbmcsIGVudmlyb25tZW50RmlsZXM6IEVudmlyb25tZW50RmlsZUNvbmZpZ1tdKTogYW55W10ge1xuICBjb25zdCByZXQgPSBbXTtcbiAgZm9yIChjb25zdCBlbnZpcm9ubWVudEZpbGUgb2YgZW52aXJvbm1lbnRGaWxlcykge1xuICAgIGNvbnN0IHMzTG9jYXRpb24gPSBlbnZpcm9ubWVudEZpbGUuczNMb2NhdGlvbjtcblxuICAgIGlmICghczNMb2NhdGlvbikge1xuICAgICAgdGhyb3cgRXJyb3IoJ0Vudmlyb25tZW50IGZpbGUgbXVzdCBzcGVjaWZ5IGFuIFMzIGxvY2F0aW9uJyk7XG4gICAgfVxuXG4gICAgcmV0LnB1c2goe1xuICAgICAgdHlwZTogZW52aXJvbm1lbnRGaWxlLmZpbGVUeXBlLFxuICAgICAgdmFsdWU6IGBhcm46JHtwYXJ0aXRpb259OnMzOjo6JHtzM0xvY2F0aW9uLmJ1Y2tldE5hbWV9LyR7czNMb2NhdGlvbi5vYmplY3RLZXl9YCxcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiByZW5kZXJIZWFsdGhDaGVjayhoYzogSGVhbHRoQ2hlY2spOiBDZm5UYXNrRGVmaW5pdGlvbi5IZWFsdGhDaGVja1Byb3BlcnR5IHtcbiAgaWYgKGhjLmludGVydmFsPy50b1NlY29uZHMoKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKDUgPiBoYy5pbnRlcnZhbD8udG9TZWNvbmRzKCkgfHwgaGMuaW50ZXJ2YWw/LnRvU2Vjb25kcygpID4gMzAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludGVydmFsIG11c3QgYmUgYmV0d2VlbiA1IHNlY29uZHMgYW5kIDMwMCBzZWNvbmRzLicpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChoYy50aW1lb3V0Py50b1NlY29uZHMoKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKDIgPiBoYy50aW1lb3V0Py50b1NlY29uZHMoKSB8fCBoYy50aW1lb3V0Py50b1NlY29uZHMoKSA+IDEyMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaW1lb3V0IG11c3QgYmUgYmV0d2VlbiAyIHNlY29uZHMgYW5kIDEyMCBzZWNvbmRzLicpO1xuICAgIH1cbiAgfVxuICBpZiAoaGMuaW50ZXJ2YWw/LnRvU2Vjb25kcygpICE9PSB1bmRlZmluZWQgJiYgaGMudGltZW91dD8udG9TZWNvbmRzKCkgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChoYy5pbnRlcnZhbD8udG9TZWNvbmRzKCkgPCBoYy50aW1lb3V0Py50b1NlY29uZHMoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdIZWFsdGggY2hlY2sgaW50ZXJ2YWwgc2hvdWxkIGJlIGxvbmdlciB0aGFuIHRpbWVvdXQuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjb21tYW5kOiBnZXRIZWFsdGhDaGVja0NvbW1hbmQoaGMpLFxuICAgIGludGVydmFsOiBoYy5pbnRlcnZhbD8udG9TZWNvbmRzKCkgPz8gMzAsXG4gICAgcmV0cmllczogaGMucmV0cmllcyA/PyAzLFxuICAgIHN0YXJ0UGVyaW9kOiBoYy5zdGFydFBlcmlvZD8udG9TZWNvbmRzKCksXG4gICAgdGltZW91dDogaGMudGltZW91dD8udG9TZWNvbmRzKCkgPz8gNSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0SGVhbHRoQ2hlY2tDb21tYW5kKGhjOiBIZWFsdGhDaGVjayk6IHN0cmluZ1tdIHtcbiAgY29uc3QgY21kID0gaGMuY29tbWFuZDtcbiAgY29uc3QgaGNDb21tYW5kID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICBpZiAoY21kLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIGFyZ3VtZW50IG11c3QgYmUgc3VwcGxpZWQgZm9yIGhlYWx0aCBjaGVjayBjb21tYW5kLicpO1xuICB9XG5cbiAgaWYgKGNtZC5sZW5ndGggPT09IDEpIHtcbiAgICBoY0NvbW1hbmQucHVzaCgnQ01ELVNIRUxMJywgY21kWzBdKTtcbiAgICByZXR1cm4gaGNDb21tYW5kO1xuICB9XG5cbiAgaWYgKGNtZFswXSAhPT0gJ0NNRCcgJiYgY21kWzBdICE9PSAnQ01ELVNIRUxMJykge1xuICAgIGhjQ29tbWFuZC5wdXNoKCdDTUQnKTtcbiAgfVxuXG4gIHJldHVybiBoY0NvbW1hbmQuY29uY2F0KGNtZCk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclJlc291cmNlUmVxdWlyZW1lbnRzKGdwdUNvdW50OiBudW1iZXIgPSAwLCBpbmZlcmVuY2VBY2NlbGVyYXRvclJlc291cmNlczogc3RyaW5nW10gPSBbXSk6XG5DZm5UYXNrRGVmaW5pdGlvbi5SZXNvdXJjZVJlcXVpcmVtZW50UHJvcGVydHlbXSB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHJldCA9IFtdO1xuICBmb3IgKGNvbnN0IHJlc291cmNlIG9mIGluZmVyZW5jZUFjY2VsZXJhdG9yUmVzb3VyY2VzKSB7XG4gICAgcmV0LnB1c2goe1xuICAgICAgdHlwZTogJ0luZmVyZW5jZUFjY2VsZXJhdG9yJyxcbiAgICAgIHZhbHVlOiByZXNvdXJjZSxcbiAgICB9KTtcbiAgfVxuICBpZiAoZ3B1Q291bnQgPiAwKSB7XG4gICAgcmV0LnB1c2goe1xuICAgICAgdHlwZTogJ0dQVScsXG4gICAgICB2YWx1ZTogZ3B1Q291bnQudG9TdHJpbmcoKSxcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIFRoZSB1bGltaXQgc2V0dGluZ3MgdG8gcGFzcyB0byB0aGUgY29udGFpbmVyLlxuICpcbiAqIE5PVEU6IERvZXMgbm90IHdvcmsgZm9yIFdpbmRvd3MgY29udGFpbmVycy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVbGltaXQge1xuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdGhlIHVsaW1pdC5cbiAgICpcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbVWxpbWl0TmFtZV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvbGF0ZXN0L3R5cGVzY3JpcHQvYXBpL2F3cy1lY3MvdWxpbWl0bmFtZS5odG1sI2F3c19lY3NfVWxpbWl0TmFtZSkuXG4gICAqL1xuICByZWFkb25seSBuYW1lOiBVbGltaXROYW1lLFxuXG4gIC8qKlxuICAgKiBUaGUgc29mdCBsaW1pdCBmb3IgdGhlIHVsaW1pdCB0eXBlLlxuICAgKi9cbiAgcmVhZG9ubHkgc29mdExpbWl0OiBudW1iZXIsXG5cbiAgLyoqXG4gICAqIFRoZSBoYXJkIGxpbWl0IGZvciB0aGUgdWxpbWl0IHR5cGUuXG4gICAqL1xuICByZWFkb25seSBoYXJkTGltaXQ6IG51bWJlcixcbn1cblxuLyoqXG4gKiBUeXBlIG9mIHJlc291cmNlIHRvIHNldCBhIGxpbWl0IG9uXG4gKi9cbmV4cG9ydCBlbnVtIFVsaW1pdE5hbWUge1xuICBDT1JFID0gJ2NvcmUnLFxuICBDUFUgPSAnY3B1JyxcbiAgREFUQSA9ICdkYXRhJyxcbiAgRlNJWkUgPSAnZnNpemUnLFxuICBMT0NLUyA9ICdsb2NrcycsXG4gIE1FTUxPQ0sgPSAnbWVtbG9jaycsXG4gIE1TR1FVRVVFID0gJ21zZ3F1ZXVlJyxcbiAgTklDRSA9ICduaWNlJyxcbiAgTk9GSUxFID0gJ25vZmlsZScsXG4gIE5QUk9DID0gJ25wcm9jJyxcbiAgUlNTID0gJ3JzcycsXG4gIFJUUFJJTyA9ICdydHByaW8nLFxuICBSVFRJTUUgPSAncnR0aW1lJyxcbiAgU0lHUEVORElORyA9ICdzaWdwZW5kaW5nJyxcbiAgU1RBQ0sgPSAnc3RhY2snXG59XG5cbmZ1bmN0aW9uIHJlbmRlclVsaW1pdCh1bGltaXQ6IFVsaW1pdCk6IENmblRhc2tEZWZpbml0aW9uLlVsaW1pdFByb3BlcnR5IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiB1bGltaXQubmFtZSxcbiAgICBzb2Z0TGltaXQ6IHVsaW1pdC5zb2Z0TGltaXQsXG4gICAgaGFyZExpbWl0OiB1bGltaXQuaGFyZExpbWl0LFxuICB9O1xufVxuLyoqXG4gKiBUaGUgZGV0YWlscyBvZiBhIGRlcGVuZGVuY3kgb24gYW5vdGhlciBjb250YWluZXIgaW4gdGhlIHRhc2sgZGVmaW5pdGlvbi5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfQ29udGFpbmVyRGVwZW5kZW5jeS5odG1sXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGFpbmVyRGVwZW5kZW5jeSB7XG4gIC8qKlxuICAgKiBUaGUgY29udGFpbmVyIHRvIGRlcGVuZCBvbi5cbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lcjogQ29udGFpbmVyRGVmaW5pdGlvbjtcblxuICAvKipcbiAgICogVGhlIHN0YXRlIHRoZSBjb250YWluZXIgbmVlZHMgdG8gYmUgaW4gdG8gc2F0aXNmeSB0aGUgZGVwZW5kZW5jeSBhbmQgcHJvY2VlZCB3aXRoIHN0YXJ0dXAuXG4gICAqIFZhbGlkIHZhbHVlcyBhcmUgQ29udGFpbmVyRGVwZW5kZW5jeUNvbmRpdGlvbi5TVEFSVCwgQ29udGFpbmVyRGVwZW5kZW5jeUNvbmRpdGlvbi5DT01QTEVURSxcbiAgICogQ29udGFpbmVyRGVwZW5kZW5jeUNvbmRpdGlvbi5TVUNDRVNTIGFuZCBDb250YWluZXJEZXBlbmRlbmN5Q29uZGl0aW9uLkhFQUxUSFkuXG4gICAqXG4gICAqIEBkZWZhdWx0IENvbnRhaW5lckRlcGVuZGVuY3lDb25kaXRpb24uSEVBTFRIWVxuICAgKi9cbiAgcmVhZG9ubHkgY29uZGl0aW9uPzogQ29udGFpbmVyRGVwZW5kZW5jeUNvbmRpdGlvbjtcbn1cblxuZXhwb3J0IGVudW0gQ29udGFpbmVyRGVwZW5kZW5jeUNvbmRpdGlvbiB7XG4gIC8qKlxuICAgKiBUaGlzIGNvbmRpdGlvbiBlbXVsYXRlcyB0aGUgYmVoYXZpb3Igb2YgbGlua3MgYW5kIHZvbHVtZXMgdG9kYXkuXG4gICAqIEl0IHZhbGlkYXRlcyB0aGF0IGEgZGVwZW5kZW50IGNvbnRhaW5lciBpcyBzdGFydGVkIGJlZm9yZSBwZXJtaXR0aW5nIG90aGVyIGNvbnRhaW5lcnMgdG8gc3RhcnQuXG4gICAqL1xuICBTVEFSVCA9ICdTVEFSVCcsXG5cbiAgLyoqXG4gICAqIFRoaXMgY29uZGl0aW9uIHZhbGlkYXRlcyB0aGF0IGEgZGVwZW5kZW50IGNvbnRhaW5lciBydW5zIHRvIGNvbXBsZXRpb24gKGV4aXRzKSBiZWZvcmUgcGVybWl0dGluZyBvdGhlciBjb250YWluZXJzIHRvIHN0YXJ0LlxuICAgKiBUaGlzIGNhbiBiZSB1c2VmdWwgZm9yIG5vbmVzc2VudGlhbCBjb250YWluZXJzIHRoYXQgcnVuIGEgc2NyaXB0IGFuZCB0aGVuIGV4aXQuXG4gICAqL1xuICBDT01QTEVURSA9ICdDT01QTEVURScsXG5cbiAgLyoqXG4gICAqIFRoaXMgY29uZGl0aW9uIGlzIHRoZSBzYW1lIGFzIENPTVBMRVRFLCBidXQgaXQgYWxzbyByZXF1aXJlcyB0aGF0IHRoZSBjb250YWluZXIgZXhpdHMgd2l0aCBhIHplcm8gc3RhdHVzLlxuICAgKi9cbiAgU1VDQ0VTUyA9ICdTVUNDRVNTJyxcblxuICAvKipcbiAgICogVGhpcyBjb25kaXRpb24gdmFsaWRhdGVzIHRoYXQgdGhlIGRlcGVuZGVudCBjb250YWluZXIgcGFzc2VzIGl0cyBEb2NrZXIgaGVhbHRoIGNoZWNrIGJlZm9yZSBwZXJtaXR0aW5nIG90aGVyIGNvbnRhaW5lcnMgdG8gc3RhcnQuXG4gICAqIFRoaXMgcmVxdWlyZXMgdGhhdCB0aGUgZGVwZW5kZW50IGNvbnRhaW5lciBoYXMgaGVhbHRoIGNoZWNrcyBjb25maWd1cmVkLiBUaGlzIGNvbmRpdGlvbiBpcyBjb25maXJtZWQgb25seSBhdCB0YXNrIHN0YXJ0dXAuXG4gICAqL1xuICBIRUFMVEhZID0gJ0hFQUxUSFknLFxufVxuXG5mdW5jdGlvbiByZW5kZXJDb250YWluZXJEZXBlbmRlbmN5KGNvbnRhaW5lckRlcGVuZGVuY3k6IENvbnRhaW5lckRlcGVuZGVuY3kpOiBDZm5UYXNrRGVmaW5pdGlvbi5Db250YWluZXJEZXBlbmRlbmN5UHJvcGVydHkge1xuICByZXR1cm4ge1xuICAgIGNvbnRhaW5lck5hbWU6IGNvbnRhaW5lckRlcGVuZGVuY3kuY29udGFpbmVyLmNvbnRhaW5lck5hbWUsXG4gICAgY29uZGl0aW9uOiBjb250YWluZXJEZXBlbmRlbmN5LmNvbmRpdGlvbiB8fCBDb250YWluZXJEZXBlbmRlbmN5Q29uZGl0aW9uLkhFQUxUSFksXG4gIH07XG59XG5cbi8qKlxuICogUG9ydCBtYXBwaW5ncyBhbGxvdyBjb250YWluZXJzIHRvIGFjY2VzcyBwb3J0cyBvbiB0aGUgaG9zdCBjb250YWluZXIgaW5zdGFuY2UgdG8gc2VuZCBvciByZWNlaXZlIHRyYWZmaWMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUG9ydE1hcHBpbmcge1xuICAvKipcbiAgICogVGhlIHBvcnQgbnVtYmVyIG9uIHRoZSBjb250YWluZXIgdGhhdCBpcyBib3VuZCB0byB0aGUgdXNlci1zcGVjaWZpZWQgb3IgYXV0b21hdGljYWxseSBhc3NpZ25lZCBob3N0IHBvcnQuXG4gICAqXG4gICAqIElmIHlvdSBhcmUgdXNpbmcgY29udGFpbmVycyBpbiBhIHRhc2sgd2l0aCB0aGUgYXdzdnBjIG9yIGhvc3QgbmV0d29yayBtb2RlLCBleHBvc2VkIHBvcnRzIHNob3VsZCBiZSBzcGVjaWZpZWQgdXNpbmcgY29udGFpbmVyUG9ydC5cbiAgICogSWYgeW91IGFyZSB1c2luZyBjb250YWluZXJzIGluIGEgdGFzayB3aXRoIHRoZSBicmlkZ2UgbmV0d29yayBtb2RlIGFuZCB5b3Ugc3BlY2lmeSBhIGNvbnRhaW5lciBwb3J0IGFuZCBub3QgYSBob3N0IHBvcnQsXG4gICAqIHlvdXIgY29udGFpbmVyIGF1dG9tYXRpY2FsbHkgcmVjZWl2ZXMgYSBob3N0IHBvcnQgaW4gdGhlIGVwaGVtZXJhbCBwb3J0IHJhbmdlLlxuICAgKlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIGhvc3RQb3J0LlxuICAgKiBQb3J0IG1hcHBpbmdzIHRoYXQgYXJlIGF1dG9tYXRpY2FsbHkgYXNzaWduZWQgaW4gdGhpcyB3YXkgZG8gbm90IGNvdW50IHRvd2FyZCB0aGUgMTAwIHJlc2VydmVkIHBvcnRzIGxpbWl0IG9mIGEgY29udGFpbmVyIGluc3RhbmNlLlxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyUG9ydDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgcG9ydCBudW1iZXIgb24gdGhlIGNvbnRhaW5lciBpbnN0YW5jZSB0byByZXNlcnZlIGZvciB5b3VyIGNvbnRhaW5lci5cbiAgICpcbiAgICogSWYgeW91IGFyZSB1c2luZyBjb250YWluZXJzIGluIGEgdGFzayB3aXRoIHRoZSBhd3N2cGMgb3IgaG9zdCBuZXR3b3JrIG1vZGUsXG4gICAqIHRoZSBob3N0UG9ydCBjYW4gZWl0aGVyIGJlIGxlZnQgYmxhbmsgb3Igc2V0IHRvIHRoZSBzYW1lIHZhbHVlIGFzIHRoZSBjb250YWluZXJQb3J0LlxuICAgKlxuICAgKiBJZiB5b3UgYXJlIHVzaW5nIGNvbnRhaW5lcnMgaW4gYSB0YXNrIHdpdGggdGhlIGJyaWRnZSBuZXR3b3JrIG1vZGUsXG4gICAqIHlvdSBjYW4gc3BlY2lmeSBhIG5vbi1yZXNlcnZlZCBob3N0IHBvcnQgZm9yIHlvdXIgY29udGFpbmVyIHBvcnQgbWFwcGluZywgb3JcbiAgICogeW91IGNhbiBvbWl0IHRoZSBob3N0UG9ydCAob3Igc2V0IGl0IHRvIDApIHdoaWxlIHNwZWNpZnlpbmcgYSBjb250YWluZXJQb3J0IGFuZFxuICAgKiB5b3VyIGNvbnRhaW5lciBhdXRvbWF0aWNhbGx5IHJlY2VpdmVzIGEgcG9ydCBpbiB0aGUgZXBoZW1lcmFsIHBvcnQgcmFuZ2UgZm9yXG4gICAqIHlvdXIgY29udGFpbmVyIGluc3RhbmNlIG9wZXJhdGluZyBzeXN0ZW0gYW5kIERvY2tlciB2ZXJzaW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgaG9zdFBvcnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBwcm90b2NvbCB1c2VkIGZvciB0aGUgcG9ydCBtYXBwaW5nLiBWYWxpZCB2YWx1ZXMgYXJlIFByb3RvY29sLlRDUCBhbmQgUHJvdG9jb2wuVURQLlxuICAgKlxuICAgKiBAZGVmYXVsdCBUQ1BcbiAgICovXG4gIHJlYWRvbmx5IHByb3RvY29sPzogUHJvdG9jb2w7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIHRvIGdpdmUgdGhlIHBvcnQgbWFwcGluZy5cbiAgICpcbiAgICogTmFtZSBpcyByZXF1aXJlZCBpbiBvcmRlciB0byB1c2UgdGhlIHBvcnQgbWFwcGluZyB3aXRoIEVDUyBTZXJ2aWNlIENvbm5lY3QuXG4gICAqIFRoaXMgZmllbGQgbWF5IG9ubHkgYmUgc2V0IHdoZW4gdGhlIHRhc2sgZGVmaW5pdGlvbiB1c2VzIEJyaWRnZSBvciBBd3N2cGMgbmV0d29yayBtb2Rlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBwb3J0IG1hcHBpbmcgbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHByb3RvY29sIHVzZWQgYnkgU2VydmljZSBDb25uZWN0LiBWYWxpZCB2YWx1ZXMgYXJlIEFwcFByb3RvY29sLmh0dHAsIEFwcFByb3RvY29sLmh0dHAyLCBhbmRcbiAgICogQXBwUHJvdG9jb2wuZ3JwYy4gVGhlIHByb3RvY29sIGRldGVybWluZXMgd2hhdCB0ZWxlbWV0cnkgd2lsbCBiZSBzaG93biBpbiB0aGUgRUNTIENvbnNvbGUgZm9yXG4gICAqIFNlcnZpY2UgQ29ubmVjdCBzZXJ2aWNlcyB1c2luZyB0aGlzIHBvcnQgbWFwcGluZy5cbiAgICpcbiAgICogVGhpcyBmaWVsZCBtYXkgb25seSBiZSBzZXQgd2hlbiB0aGUgdGFzayBkZWZpbml0aW9uIHVzZXMgQnJpZGdlIG9yIEF3c3ZwYyBuZXR3b3JrIG1vZGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGFwcCBwcm90b2NvbFxuICAgKi9cbiAgcmVhZG9ubHkgYXBwUHJvdG9jb2w/OiBBcHBQcm90b2NvbDtcbn1cblxuLyoqXG4gKiBQb3J0TWFwIFZhbHVlT2JqZWN0Q2xhc3MgaGF2aW5nIGJ5IENvbnRhaW5lckRlZmluaXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIFBvcnRNYXAge1xuXG4gIC8qKlxuICAgKiBUaGUgbmV0d29ya2luZyBtb2RlIHRvIHVzZSBmb3IgdGhlIGNvbnRhaW5lcnMgaW4gdGhlIHRhc2suXG4gICAqL1xuICByZWFkb25seSBuZXR3b3JrbW9kZTogTmV0d29ya01vZGU7XG5cbiAgLyoqXG4gICAqIFBvcnQgbWFwcGluZ3MgYWxsb3cgY29udGFpbmVycyB0byBhY2Nlc3MgcG9ydHMgb24gdGhlIGhvc3QgY29udGFpbmVyIGluc3RhbmNlIHRvIHNlbmQgb3IgcmVjZWl2ZSB0cmFmZmljLlxuICAgKi9cbiAgcmVhZG9ubHkgcG9ydG1hcHBpbmc6IFBvcnRNYXBwaW5nO1xuXG4gIGNvbnN0cnVjdG9yKG5ldHdvcmttb2RlOiBOZXR3b3JrTW9kZSwgcG06IFBvcnRNYXBwaW5nKSB7XG4gICAgdGhpcy5uZXR3b3JrbW9kZSA9IG5ldHdvcmttb2RlO1xuICAgIHRoaXMucG9ydG1hcHBpbmcgPSBwbTtcbiAgfVxuXG4gIC8qKlxuICAgKiB2YWxpZGF0ZSBpbnZhbGlkIHBvcnRtYXBwaW5nIGFuZCBuZXR3b3JrbW9kZSBwYXJhbWV0ZXJzLlxuICAgKiB0aHJvdyBFcnJvciB3aGVuIGludmFsaWQgcGFyYW1ldGVycy5cbiAgICovXG4gIHB1YmxpYyB2YWxpZGF0ZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXN2YWxpZFBvcnROYW1lKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUG9ydCBtYXBwaW5nIG5hbWUgY2Fubm90IGJlIGFuIGVtcHR5IHN0cmluZy4nKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzVmFsaWRQb3J0cygpKSB7XG4gICAgICBjb25zdCBwbSA9IHRoaXMucG9ydG1hcHBpbmc7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEhvc3QgcG9ydCAoJHtwbS5ob3N0UG9ydH0pIG11c3QgYmUgbGVmdCBvdXQgb3IgZXF1YWwgdG8gY29udGFpbmVyIHBvcnQgJHtwbS5jb250YWluZXJQb3J0fSBmb3IgbmV0d29yayBtb2RlICR7dGhpcy5uZXR3b3JrbW9kZX1gKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGlzdmFsaWRQb3J0TmFtZSgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5wb3J0bWFwcGluZy5uYW1lID09PSAnJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgaXNWYWxpZFBvcnRzKCkgOmJvb2xlYW4ge1xuICAgIGNvbnN0IGlzQXdzVnBjTW9kZSA9IHRoaXMubmV0d29ya21vZGUgPT0gTmV0d29ya01vZGUuQVdTX1ZQQztcbiAgICBjb25zdCBpc0hvc3RNb2RlID0gdGhpcy5uZXR3b3JrbW9kZSA9PSBOZXR3b3JrTW9kZS5IT1NUO1xuICAgIGlmICghaXNBd3NWcGNNb2RlICYmICFpc0hvc3RNb2RlKSByZXR1cm4gdHJ1ZTtcbiAgICBjb25zdCBob3N0UG9ydCA9IHRoaXMucG9ydG1hcHBpbmcuaG9zdFBvcnQ7XG4gICAgY29uc3QgY29udGFpbmVyUG9ydCA9IHRoaXMucG9ydG1hcHBpbmcuY29udGFpbmVyUG9ydDtcbiAgICBpZiAoY29udGFpbmVyUG9ydCAhPT0gaG9zdFBvcnQgJiYgaG9zdFBvcnQgIT09IHVuZGVmaW5lZCApIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG59XG5cblxuLyoqXG4gKiBTZXJ2aWNlQ29ubmVjdCBWYWx1ZU9iamVjdENsYXNzIGhhdmluZyBieSBDb250YWluZXJEZWZpbml0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBTZXJ2aWNlQ29ubmVjdCB7XG4gIC8qKlxuICAgKiBQb3J0IG1hcHBpbmdzIGFsbG93IGNvbnRhaW5lcnMgdG8gYWNjZXNzIHBvcnRzIG9uIHRoZSBob3N0IGNvbnRhaW5lciBpbnN0YW5jZSB0byBzZW5kIG9yIHJlY2VpdmUgdHJhZmZpYy5cbiAgICovXG4gIHJlYWRvbmx5IHBvcnRtYXBwaW5nOiBQb3J0TWFwcGluZztcblxuICAvKipcbiAgICogVGhlIG5ldHdvcmtpbmcgbW9kZSB0byB1c2UgZm9yIHRoZSBjb250YWluZXJzIGluIHRoZSB0YXNrLlxuICAgKi9cbiAgcmVhZG9ubHkgbmV0d29ya21vZGU6IE5ldHdvcmtNb2RlO1xuXG4gIGNvbnN0cnVjdG9yKG5ldHdvcmttb2RlOiBOZXR3b3JrTW9kZSwgcG06IFBvcnRNYXBwaW5nKSB7XG4gICAgdGhpcy5wb3J0bWFwcGluZyA9IHBtO1xuICAgIHRoaXMubmV0d29ya21vZGUgPSBuZXR3b3JrbW9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBKdWRnZSBwYXJhbWV0ZXJzIGNhbiBiZSBzZXJ2aWNlY29ubmVjdCBsb2dpY2suXG4gICAqIElmIHBhcmFtZXRlcnMgY2FuIGJlIHNlcnZpY2VDb25uZWN0IHJldHVybiB0cnVlLlxuICAgKi9cbiAgcHVibGljIGlzU2VydmljZUNvbm5lY3QoKSA6Ym9vbGVhbiB7XG4gICAgY29uc3QgaGFzUG9ydG5hbWUgPSB0aGlzLnBvcnRtYXBwaW5nLm5hbWU7XG4gICAgY29uc3QgaGFzQXBwUHJvdGNvbCA9IHRoaXMucG9ydG1hcHBpbmcuYXBwUHJvdG9jb2w7XG4gICAgaWYgKGhhc1BvcnRuYW1lIHx8IGhhc0FwcFByb3Rjb2wpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBKdWRnZSBzZXJ2aWNlY29ubmVjdCBwYXJhbWV0ZXMgYXJlIHZhbGlkLlxuICAgKiBJZiBpbnZhbGlkLCB0aHJvdyBFcnJvci5cbiAgICovXG4gIHB1YmxpYyB2YWxpZGF0ZSgpIDp2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNWYWxpZE5ldHdvcmttb2RlKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU2VydmljZSBjb25uZWN0IHJlbGF0ZWQgcG9ydCBtYXBwaW5nIGZpZWxkcyAnbmFtZScgYW5kICdhcHBQcm90b2NvbCcgYXJlIG5vdCBzdXBwb3J0ZWQgZm9yIG5ldHdvcmsgbW9kZSAke3RoaXMubmV0d29ya21vZGV9YCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5pc1ZhbGlkUG9ydE5hbWUoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXJ2aWNlIGNvbm5lY3QtcmVsYXRlZCBwb3J0IG1hcHBpbmcgZmllbGQgXFwnYXBwUHJvdG9jb2xcXCcgY2Fubm90IGJlIHNldCB3aXRob3V0IFxcJ25hbWVcXCcnKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGlzVmFsaWROZXR3b3JrbW9kZSgpIDpib29sZWFuIHtcbiAgICBjb25zdCBpc0F3c1ZwY01vZGUgPSB0aGlzLm5ldHdvcmttb2RlID09IE5ldHdvcmtNb2RlLkFXU19WUEM7XG4gICAgY29uc3QgaXNCcmlkZ2VNb2RlID0gdGhpcy5uZXR3b3JrbW9kZSA9PSBOZXR3b3JrTW9kZS5CUklER0U7XG4gICAgaWYgKGlzQXdzVnBjTW9kZSB8fCBpc0JyaWRnZU1vZGUpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgaXNWYWxpZFBvcnROYW1lKCkgOmJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5wb3J0bWFwcGluZy5uYW1lKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBOZXR3b3JrIHByb3RvY29sXG4gKi9cbmV4cG9ydCBlbnVtIFByb3RvY29sIHtcbiAgLyoqXG4gICAqIFRDUFxuICAgKi9cbiAgVENQID0gJ3RjcCcsXG5cbiAgLyoqXG4gICAqIFVEUFxuICAgKi9cbiAgVURQID0gJ3VkcCcsXG59XG5cblxuLyoqXG4gKiBTZXJ2aWNlIGNvbm5lY3QgYXBwIHByb3RvY29sLlxuICovXG5leHBvcnQgY2xhc3MgQXBwUHJvdG9jb2wge1xuICAvKipcbiAgICogSFRUUCBhcHAgcHJvdG9jb2wuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGh0dHAgPSBuZXcgQXBwUHJvdG9jb2woJ2h0dHAnKTtcbiAgLyoqXG4gICAqIEhUVFAyIGFwcCBwcm90b2NvbC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaHR0cDIgPSBuZXcgQXBwUHJvdG9jb2woJ2h0dHAyJyk7XG4gIC8qKlxuICAgKiBHUlBDIGFwcCBwcm90b2NvbC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ3JwYyA9IG5ldyBBcHBQcm90b2NvbCgnZ3JwYycpO1xuXG4gIC8qKlxuICAgKiBDdXN0b20gdmFsdWUuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdmFsdWU6IHN0cmluZztcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJQb3J0TWFwcGluZyhwbTogUG9ydE1hcHBpbmcpOiBDZm5UYXNrRGVmaW5pdGlvbi5Qb3J0TWFwcGluZ1Byb3BlcnR5IHtcbiAgcmV0dXJuIHtcbiAgICBjb250YWluZXJQb3J0OiBwbS5jb250YWluZXJQb3J0LFxuICAgIGhvc3RQb3J0OiBwbS5ob3N0UG9ydCxcbiAgICBwcm90b2NvbDogcG0ucHJvdG9jb2wgfHwgUHJvdG9jb2wuVENQLFxuICAgIGFwcFByb3RvY29sOiBwbS5hcHBQcm90b2NvbD8udmFsdWUsXG4gICAgbmFtZTogcG0ubmFtZSA/IHBtLm5hbWUgOiB1bmRlZmluZWQsXG4gIH07XG59XG5cbi8qKlxuICogVGhlIHRlbXBvcmFyeSBkaXNrIHNwYWNlIG1vdW50ZWQgdG8gdGhlIGNvbnRhaW5lci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTY3JhdGNoU3BhY2Uge1xuICAvKipcbiAgICogVGhlIHBhdGggb24gdGhlIGNvbnRhaW5lciB0byBtb3VudCB0aGUgc2NyYXRjaCB2b2x1bWUgYXQuXG4gICAqL1xuICByZWFkb25seSBjb250YWluZXJQYXRoOiBzdHJpbmcsXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciB0byBnaXZlIHRoZSBjb250YWluZXIgcmVhZC1vbmx5IGFjY2VzcyB0byB0aGUgc2NyYXRjaCB2b2x1bWUuXG4gICAqXG4gICAqIElmIHRoaXMgdmFsdWUgaXMgdHJ1ZSwgdGhlIGNvbnRhaW5lciBoYXMgcmVhZC1vbmx5IGFjY2VzcyB0byB0aGUgc2NyYXRjaCB2b2x1bWUuXG4gICAqIElmIHRoaXMgdmFsdWUgaXMgZmFsc2UsIHRoZW4gdGhlIGNvbnRhaW5lciBjYW4gd3JpdGUgdG8gdGhlIHNjcmF0Y2ggdm9sdW1lLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVhZE9ubHk6IGJvb2xlYW4sXG4gIHJlYWRvbmx5IHNvdXJjZVBhdGg6IHN0cmluZyxcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzY3JhdGNoIHZvbHVtZSB0byBtb3VudC4gTXVzdCBiZSBhIHZvbHVtZSBuYW1lIHJlZmVyZW5jZWQgaW4gdGhlIG5hbWUgcGFyYW1ldGVyIG9mIHRhc2sgZGVmaW5pdGlvbiB2b2x1bWUuXG4gICAqL1xuICByZWFkb25seSBuYW1lOiBzdHJpbmcsXG59XG5cbi8qKlxuICogVGhlIGRldGFpbHMgb2YgZGF0YSB2b2x1bWUgbW91bnQgcG9pbnRzIGZvciBhIGNvbnRhaW5lci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNb3VudFBvaW50IHtcbiAgLyoqXG4gICAqIFRoZSBwYXRoIG9uIHRoZSBjb250YWluZXIgdG8gbW91bnQgdGhlIGhvc3Qgdm9sdW1lIGF0LlxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyUGF0aDogc3RyaW5nLFxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdG8gZ2l2ZSB0aGUgY29udGFpbmVyIHJlYWQtb25seSBhY2Nlc3MgdG8gdGhlIHZvbHVtZS5cbiAgICpcbiAgICogSWYgdGhpcyB2YWx1ZSBpcyB0cnVlLCB0aGUgY29udGFpbmVyIGhhcyByZWFkLW9ubHkgYWNjZXNzIHRvIHRoZSB2b2x1bWUuXG4gICAqIElmIHRoaXMgdmFsdWUgaXMgZmFsc2UsIHRoZW4gdGhlIGNvbnRhaW5lciBjYW4gd3JpdGUgdG8gdGhlIHZvbHVtZS5cbiAgICovXG4gIHJlYWRvbmx5IHJlYWRPbmx5OiBib29sZWFuLFxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHZvbHVtZSB0byBtb3VudC5cbiAgICpcbiAgICogTXVzdCBiZSBhIHZvbHVtZSBuYW1lIHJlZmVyZW5jZWQgaW4gdGhlIG5hbWUgcGFyYW1ldGVyIG9mIHRhc2sgZGVmaW5pdGlvbiB2b2x1bWUuXG4gICAqL1xuICByZWFkb25seSBzb3VyY2VWb2x1bWU6IHN0cmluZyxcbn1cblxuZnVuY3Rpb24gcmVuZGVyTW91bnRQb2ludChtcDogTW91bnRQb2ludCk6IENmblRhc2tEZWZpbml0aW9uLk1vdW50UG9pbnRQcm9wZXJ0eSB7XG4gIHJldHVybiB7XG4gICAgY29udGFpbmVyUGF0aDogbXAuY29udGFpbmVyUGF0aCxcbiAgICByZWFkT25seTogbXAucmVhZE9ubHksXG4gICAgc291cmNlVm9sdW1lOiBtcC5zb3VyY2VWb2x1bWUsXG4gIH07XG59XG5cbi8qKlxuICogVGhlIGRldGFpbHMgb24gYSBkYXRhIHZvbHVtZSBmcm9tIGFub3RoZXIgY29udGFpbmVyIGluIHRoZSBzYW1lIHRhc2sgZGVmaW5pdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWb2x1bWVGcm9tIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIGFub3RoZXIgY29udGFpbmVyIHdpdGhpbiB0aGUgc2FtZSB0YXNrIGRlZmluaXRpb24gZnJvbSB3aGljaCB0byBtb3VudCB2b2x1bWVzLlxuICAgKi9cbiAgcmVhZG9ubHkgc291cmNlQ29udGFpbmVyOiBzdHJpbmcsXG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRoZSBjb250YWluZXIgaGFzIHJlYWQtb25seSBhY2Nlc3MgdG8gdGhlIHZvbHVtZS5cbiAgICpcbiAgICogSWYgdGhpcyB2YWx1ZSBpcyB0cnVlLCB0aGUgY29udGFpbmVyIGhhcyByZWFkLW9ubHkgYWNjZXNzIHRvIHRoZSB2b2x1bWUuXG4gICAqIElmIHRoaXMgdmFsdWUgaXMgZmFsc2UsIHRoZW4gdGhlIGNvbnRhaW5lciBjYW4gd3JpdGUgdG8gdGhlIHZvbHVtZS5cbiAgICovXG4gIHJlYWRvbmx5IHJlYWRPbmx5OiBib29sZWFuLFxufVxuXG5mdW5jdGlvbiByZW5kZXJWb2x1bWVGcm9tKHZmOiBWb2x1bWVGcm9tKTogQ2ZuVGFza0RlZmluaXRpb24uVm9sdW1lRnJvbVByb3BlcnR5IHtcbiAgcmV0dXJuIHtcbiAgICBzb3VyY2VDb250YWluZXI6IHZmLnNvdXJjZUNvbnRhaW5lcixcbiAgICByZWFkT25seTogdmYucmVhZE9ubHksXG4gIH07XG59XG5cbi8qKlxuICogS2VybmVsIHBhcmFtZXRlcnMgdG8gc2V0IGluIHRoZSBjb250YWluZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTeXN0ZW1Db250cm9sIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lc3BhY2VkIGtlcm5lbCBwYXJhbWV0ZXIgZm9yIHdoaWNoIHRvIHNldCBhIHZhbHVlLlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZXNwYWNlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB2YWx1ZSBmb3IgdGhlIG5hbWVzcGFjZWQga2VybmVsIHBhcmFtZXRlciBzcGVjaWZpZWQgaW4gbmFtZXNwYWNlLlxuICAgKi9cbiAgcmVhZG9ubHkgdmFsdWU6IHN0cmluZztcbn1cblxuZnVuY3Rpb24gcmVuZGVyU3lzdGVtQ29udHJvbHMoc3lzdGVtQ29udHJvbHM6IFN5c3RlbUNvbnRyb2xbXSk6IENmblRhc2tEZWZpbml0aW9uLlN5c3RlbUNvbnRyb2xQcm9wZXJ0eVtdIHtcbiAgcmV0dXJuIHN5c3RlbUNvbnRyb2xzLm1hcChzYyA9PiAoe1xuICAgIG5hbWVzcGFjZTogc2MubmFtZXNwYWNlLFxuICAgIHZhbHVlOiBzYy52YWx1ZSxcbiAgfSkpO1xufVxuIl19