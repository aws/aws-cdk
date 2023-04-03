"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExternalCompatible = exports.isFargateCompatible = exports.isEc2Compatible = exports.Compatibility = exports.Scope = exports.PidMode = exports.IpcMode = exports.NetworkMode = exports.TaskDefinition = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const _imported_task_definition_1 = require("./_imported-task-definition");
const container_definition_1 = require("../container-definition");
const ecs_generated_1 = require("../ecs.generated");
const firelens_log_router_1 = require("../firelens-log-router");
const aws_log_driver_1 = require("../log-drivers/aws-log-driver");
class TaskDefinitionBase extends core_1.Resource {
    /**
     * Return true if the task definition can be run on an EC2 cluster
     */
    get isEc2Compatible() {
        return isEc2Compatible(this.compatibility);
    }
    /**
     * Return true if the task definition can be run on a Fargate cluster
     */
    get isFargateCompatible() {
        return isFargateCompatible(this.compatibility);
    }
    /**
     * Return true if the task definition can be run on a ECS anywhere cluster
     */
    get isExternalCompatible() {
        return isExternalCompatible(this.compatibility);
    }
}
/**
 * The base class for all task definitions.
 */
class TaskDefinition extends TaskDefinitionBase {
    /**
     * Constructs a new instance of the TaskDefinition class.
     */
    constructor(scope, id, props) {
        super(scope, id);
        /**
         * The container definitions.
         */
        this.containers = new Array();
        /**
         * All volumes
         */
        this.volumes = [];
        /**
         * Placement constraints for task instances
         */
        this.placementConstraints = new Array();
        /**
         * Inference accelerators for task instances
         */
        this._inferenceAccelerators = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_TaskDefinitionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, TaskDefinition);
            }
            throw error;
        }
        this.family = props.family || core_1.Names.uniqueId(this);
        this.compatibility = props.compatibility;
        if (props.volumes) {
            props.volumes.forEach(v => this.addVolume(v));
        }
        this.networkMode = props.networkMode ?? (this.isFargateCompatible ? NetworkMode.AWS_VPC : NetworkMode.BRIDGE);
        if (this.isFargateCompatible && this.networkMode !== NetworkMode.AWS_VPC) {
            throw new Error(`Fargate tasks can only have AwsVpc network mode, got: ${this.networkMode}`);
        }
        if (props.proxyConfiguration && this.networkMode !== NetworkMode.AWS_VPC) {
            throw new Error(`ProxyConfiguration can only be used with AwsVpc network mode, got: ${this.networkMode}`);
        }
        if (props.placementConstraints && props.placementConstraints.length > 0 && this.isFargateCompatible) {
            throw new Error('Cannot set placement constraints on tasks that run on Fargate');
        }
        if (this.isFargateCompatible && (!props.cpu || !props.memoryMiB)) {
            throw new Error(`Fargate-compatible tasks require both CPU (${props.cpu}) and memory (${props.memoryMiB}) specifications`);
        }
        if (props.inferenceAccelerators && props.inferenceAccelerators.length > 0 && this.isFargateCompatible) {
            throw new Error('Cannot use inference accelerators on tasks that run on Fargate');
        }
        if (this.isExternalCompatible && ![NetworkMode.BRIDGE, NetworkMode.HOST, NetworkMode.NONE].includes(this.networkMode)) {
            throw new Error(`External tasks can only have Bridge, Host or None network mode, got: ${this.networkMode}`);
        }
        if (!this.isFargateCompatible && props.runtimePlatform) {
            throw new Error('Cannot specify runtimePlatform in non-Fargate compatible tasks');
        }
        this._executionRole = props.executionRole;
        this.taskRole = props.taskRole || new iam.Role(this, 'TaskRole', {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        });
        if (props.inferenceAccelerators) {
            props.inferenceAccelerators.forEach(ia => this.addInferenceAccelerator(ia));
        }
        this.ephemeralStorageGiB = props.ephemeralStorageGiB;
        // validate the cpu and memory size for the Windows operation system family.
        if (props.runtimePlatform?.operatingSystemFamily?._operatingSystemFamily.includes('WINDOWS')) {
            // We know that props.cpu and props.memoryMiB are defined because an error would have been thrown previously if they were not.
            // But, typescript is not able to figure this out, so using the `!` operator here to let the type-checker know they are defined.
            this.checkFargateWindowsBasedTasksSize(props.cpu, props.memoryMiB, props.runtimePlatform);
        }
        this.runtimePlatform = props.runtimePlatform;
        const taskDef = new ecs_generated_1.CfnTaskDefinition(this, 'Resource', {
            containerDefinitions: core_1.Lazy.any({ produce: () => this.renderContainers() }, { omitEmptyArray: true }),
            volumes: core_1.Lazy.any({ produce: () => this.renderVolumes() }, { omitEmptyArray: true }),
            executionRoleArn: core_1.Lazy.string({ produce: () => this.executionRole && this.executionRole.roleArn }),
            family: this.family,
            taskRoleArn: this.taskRole.roleArn,
            requiresCompatibilities: [
                ...(isEc2Compatible(props.compatibility) ? ['EC2'] : []),
                ...(isFargateCompatible(props.compatibility) ? ['FARGATE'] : []),
                ...(isExternalCompatible(props.compatibility) ? ['EXTERNAL'] : []),
            ],
            networkMode: this.renderNetworkMode(this.networkMode),
            placementConstraints: core_1.Lazy.any({
                produce: () => !isFargateCompatible(this.compatibility) ? this.placementConstraints : undefined,
            }, { omitEmptyArray: true }),
            proxyConfiguration: props.proxyConfiguration ? props.proxyConfiguration.bind(this.stack, this) : undefined,
            cpu: props.cpu,
            memory: props.memoryMiB,
            ipcMode: props.ipcMode,
            pidMode: props.pidMode,
            inferenceAccelerators: core_1.Lazy.any({
                produce: () => !isFargateCompatible(this.compatibility) ? this.renderInferenceAccelerators() : undefined,
            }, { omitEmptyArray: true }),
            ephemeralStorage: this.ephemeralStorageGiB ? {
                sizeInGiB: this.ephemeralStorageGiB,
            } : undefined,
            runtimePlatform: this.isFargateCompatible && this.runtimePlatform ? {
                cpuArchitecture: this.runtimePlatform?.cpuArchitecture?._cpuArchitecture,
                operatingSystemFamily: this.runtimePlatform?.operatingSystemFamily?._operatingSystemFamily,
            } : undefined,
        });
        if (props.placementConstraints) {
            props.placementConstraints.forEach(pc => this.addPlacementConstraint(pc));
        }
        this.taskDefinitionArn = taskDef.ref;
        this.node.addValidation({ validate: () => this.validateTaskDefinition() });
    }
    /**
     * Imports a task definition from the specified task definition ARN.
     *
     * The task will have a compatibility of EC2+Fargate.
     */
    static fromTaskDefinitionArn(scope, id, taskDefinitionArn) {
        return new _imported_task_definition_1.ImportedTaskDefinition(scope, id, { taskDefinitionArn: taskDefinitionArn });
    }
    /**
     * Create a task definition from a task definition reference
     */
    static fromTaskDefinitionAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_TaskDefinitionAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromTaskDefinitionAttributes);
            }
            throw error;
        }
        return new _imported_task_definition_1.ImportedTaskDefinition(scope, id, {
            taskDefinitionArn: attrs.taskDefinitionArn,
            compatibility: attrs.compatibility,
            networkMode: attrs.networkMode,
            taskRole: attrs.taskRole,
        });
    }
    get executionRole() {
        return this._executionRole;
    }
    /**
     * Public getter method to access list of inference accelerators attached to the instance.
     */
    get inferenceAccelerators() {
        return this._inferenceAccelerators;
    }
    renderVolumes() {
        return this.volumes.map(renderVolume);
        function renderVolume(spec) {
            return {
                host: spec.host,
                name: spec.name,
                dockerVolumeConfiguration: spec.dockerVolumeConfiguration && {
                    autoprovision: spec.dockerVolumeConfiguration.autoprovision,
                    driver: spec.dockerVolumeConfiguration.driver,
                    driverOpts: spec.dockerVolumeConfiguration.driverOpts,
                    labels: spec.dockerVolumeConfiguration.labels,
                    scope: spec.dockerVolumeConfiguration.scope,
                },
                efsVolumeConfiguration: spec.efsVolumeConfiguration && {
                    filesystemId: spec.efsVolumeConfiguration.fileSystemId,
                    authorizationConfig: spec.efsVolumeConfiguration.authorizationConfig,
                    rootDirectory: spec.efsVolumeConfiguration.rootDirectory,
                    transitEncryption: spec.efsVolumeConfiguration.transitEncryption,
                    transitEncryptionPort: spec.efsVolumeConfiguration.transitEncryptionPort,
                },
            };
        }
    }
    renderInferenceAccelerators() {
        return this._inferenceAccelerators.map(renderInferenceAccelerator);
        function renderInferenceAccelerator(inferenceAccelerator) {
            return {
                deviceName: inferenceAccelerator.deviceName,
                deviceType: inferenceAccelerator.deviceType,
            };
        }
    }
    /**
     * Validate the existence of the input target and set default values.
     *
     * @internal
     */
    _validateTarget(options) {
        const targetContainer = this.findContainer(options.containerName);
        if (targetContainer === undefined) {
            throw new Error(`No container named '${options.containerName}'. Did you call "addContainer()"?`);
        }
        const targetProtocol = options.protocol || container_definition_1.Protocol.TCP;
        const targetContainerPort = options.containerPort || targetContainer.containerPort;
        const portMapping = targetContainer.findPortMapping(targetContainerPort, targetProtocol);
        if (portMapping === undefined) {
            // eslint-disable-next-line max-len
            throw new Error(`Container '${targetContainer}' has no mapping for port ${options.containerPort} and protocol ${targetProtocol}. Did you call "container.addPortMappings()"?`);
        }
        return {
            containerName: options.containerName,
            portMapping,
        };
    }
    /**
     * Returns the port range to be opened that match the provided container name and container port.
     *
     * @internal
     */
    _portRangeFromPortMapping(portMapping) {
        if (portMapping.hostPort !== undefined && portMapping.hostPort !== 0) {
            return portMapping.protocol === container_definition_1.Protocol.UDP ? ec2.Port.udp(portMapping.hostPort) : ec2.Port.tcp(portMapping.hostPort);
        }
        if (this.networkMode === NetworkMode.BRIDGE || this.networkMode === NetworkMode.NAT) {
            return EPHEMERAL_PORT_RANGE;
        }
        return portMapping.protocol === container_definition_1.Protocol.UDP ? ec2.Port.udp(portMapping.containerPort) : ec2.Port.tcp(portMapping.containerPort);
    }
    /**
     * Adds a policy statement to the task IAM role.
     */
    addToTaskRolePolicy(statement) {
        this.taskRole.addToPrincipalPolicy(statement);
    }
    /**
     * Adds a policy statement to the task execution IAM role.
     */
    addToExecutionRolePolicy(statement) {
        this.obtainExecutionRole().addToPrincipalPolicy(statement);
    }
    /**
     * Adds a new container to the task definition.
     */
    addContainer(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ContainerDefinitionOptions(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addContainer);
            }
            throw error;
        }
        return new container_definition_1.ContainerDefinition(this, id, { taskDefinition: this, ...props });
    }
    /**
     * Adds a firelens log router to the task definition.
     */
    addFirelensLogRouter(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_FirelensLogRouterDefinitionOptions(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addFirelensLogRouter);
            }
            throw error;
        }
        // only one firelens log router is allowed in each task.
        if (this.containers.find(x => x instanceof firelens_log_router_1.FirelensLogRouter)) {
            throw new Error('Firelens log router is already added in this task.');
        }
        return new firelens_log_router_1.FirelensLogRouter(this, id, { taskDefinition: this, ...props });
    }
    /**
     * Links a container to this task definition.
     * @internal
     */
    _linkContainer(container) {
        this.containers.push(container);
        if (this.defaultContainer === undefined && container.essential) {
            this.defaultContainer = container;
        }
    }
    /**
     * Adds a volume to the task definition.
     */
    addVolume(volume) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_Volume(volume);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addVolume);
            }
            throw error;
        }
        this.volumes.push(volume);
    }
    /**
     * Adds the specified placement constraint to the task definition.
     */
    addPlacementConstraint(constraint) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_PlacementConstraint(constraint);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addPlacementConstraint);
            }
            throw error;
        }
        if (isFargateCompatible(this.compatibility)) {
            throw new Error('Cannot set placement constraints on tasks that run on Fargate');
        }
        this.placementConstraints.push(...constraint.toJson());
    }
    /**
     * Adds the specified extension to the task definition.
     *
     * Extension can be used to apply a packaged modification to
     * a task definition.
     */
    addExtension(extension) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ITaskDefinitionExtension(extension);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addExtension);
            }
            throw error;
        }
        extension.extend(this);
    }
    /**
     * Adds an inference accelerator to the task definition.
     */
    addInferenceAccelerator(inferenceAccelerator) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_InferenceAccelerator(inferenceAccelerator);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addInferenceAccelerator);
            }
            throw error;
        }
        if (isFargateCompatible(this.compatibility)) {
            throw new Error('Cannot use inference accelerators on tasks that run on Fargate');
        }
        this._inferenceAccelerators.push(inferenceAccelerator);
    }
    /**
     * Grants permissions to run this task definition
     *
     * This will grant the following permissions:
     *
     *   - ecs:RunTask
     *   - iam:PassRole
     *
     * @param grantee Principal to grant consume rights to
     */
    grantRun(grantee) {
        grantee.grantPrincipal.addToPrincipalPolicy(this.passRoleStatement);
        return iam.Grant.addToPrincipal({
            grantee,
            actions: ['ecs:RunTask'],
            resourceArns: [this.taskDefinitionArn],
        });
    }
    /**
     * Creates the task execution IAM role if it doesn't already exist.
     */
    obtainExecutionRole() {
        if (!this._executionRole) {
            this._executionRole = new iam.Role(this, 'ExecutionRole', {
                assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
                // needed for cross-account access with TagParameterContainerImage
                roleName: core_1.PhysicalName.GENERATE_IF_NEEDED,
            });
            this.passRoleStatement.addResources(this._executionRole.roleArn);
        }
        return this._executionRole;
    }
    /**
     * Whether this task definition has at least a container that references a
     * specific JSON field of a secret stored in Secrets Manager.
     */
    get referencesSecretJsonField() {
        for (const container of this.containers) {
            if (container.referencesSecretJsonField) {
                return true;
            }
        }
        return false;
    }
    /**
     * Validates the task definition.
     */
    validateTaskDefinition() {
        const ret = new Array();
        if (isEc2Compatible(this.compatibility)) {
            // EC2 mode validations
            // Container sizes
            for (const container of this.containers) {
                if (!container.memoryLimitSpecified) {
                    ret.push(`ECS Container ${container.containerName} must have at least one of 'memoryLimitMiB' or 'memoryReservationMiB' specified`);
                }
            }
        }
        // Validate that there are no named port mapping conflicts for Service Connect.
        const portMappingNames = new Map(); // Map from port mapping name to most recent container it appears in.
        this.containers.forEach(container => {
            for (const pm of container.portMappings) {
                if (pm.name) {
                    if (portMappingNames.has(pm.name)) {
                        ret.push(`Port mapping name '${pm.name}' cannot appear in both '${container.containerName}' and '${portMappingNames.get(pm.name)}'`);
                    }
                    portMappingNames.set(pm.name, container.containerName);
                }
            }
        });
        return ret;
    }
    /**
     * Determine the existing port mapping for the provided name.
     * @param name: port mapping name
     * @returns PortMapping for the provided name, if it exists.
     */
    findPortMappingByName(name) {
        let portMapping;
        this.containers.forEach(container => {
            const pm = container.findPortMappingByName(name);
            if (pm) {
                portMapping = pm;
            }
            ;
        });
        return portMapping;
    }
    /**
     * Returns the container that match the provided containerName.
     */
    findContainer(containerName) {
        return this.containers.find(c => c.containerName === containerName);
    }
    get passRoleStatement() {
        if (!this._passRoleStatement) {
            this._passRoleStatement = new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['iam:PassRole'],
                resources: this.executionRole ? [this.taskRole.roleArn, this.executionRole.roleArn] : [this.taskRole.roleArn],
                conditions: {
                    StringLike: { 'iam:PassedToService': 'ecs-tasks.amazonaws.com' },
                },
            });
        }
        return this._passRoleStatement;
    }
    renderNetworkMode(networkMode) {
        return (networkMode === NetworkMode.NAT) ? undefined : networkMode;
    }
    renderContainers() {
        // add firelens log router container if any application container is using firelens log driver,
        // also check if already created log router container
        for (const container of this.containers) {
            if (container.logDriverConfig && container.logDriverConfig.logDriver === 'awsfirelens'
                && !this.containers.find(x => x instanceof firelens_log_router_1.FirelensLogRouter)) {
                this.addFirelensLogRouter('log-router', {
                    image: firelens_log_router_1.obtainDefaultFluentBitECRImage(this, container.logDriverConfig),
                    firelensConfig: {
                        type: firelens_log_router_1.FirelensLogRouterType.FLUENTBIT,
                    },
                    logging: new aws_log_driver_1.AwsLogDriver({ streamPrefix: 'firelens' }),
                    memoryReservationMiB: 50,
                });
                break;
            }
        }
        return this.containers.map(x => x.renderContainerDefinition());
    }
    checkFargateWindowsBasedTasksSize(cpu, memory, runtimePlatform) {
        if (Number(cpu) === 1024) {
            if (Number(memory) < 1024 || Number(memory) > 8192 || (Number(memory) % 1024 !== 0)) {
                throw new Error(`If provided cpu is ${cpu}, then memoryMiB must have a min of 1024 and a max of 8192, in 1024 increments. Provided memoryMiB was ${Number(memory)}.`);
            }
        }
        else if (Number(cpu) === 2048) {
            if (Number(memory) < 4096 || Number(memory) > 16384 || (Number(memory) % 1024 !== 0)) {
                throw new Error(`If provided cpu is ${cpu}, then memoryMiB must have a min of 4096 and max of 16384, in 1024 increments. Provided memoryMiB ${Number(memory)}.`);
            }
        }
        else if (Number(cpu) === 4096) {
            if (Number(memory) < 8192 || Number(memory) > 30720 || (Number(memory) % 1024 !== 0)) {
                throw new Error(`If provided cpu is ${cpu}, then memoryMiB must have a min of 8192 and a max of 30720, in 1024 increments.Provided memoryMiB was ${Number(memory)}.`);
            }
        }
        else {
            throw new Error(`If operatingSystemFamily is ${runtimePlatform.operatingSystemFamily._operatingSystemFamily}, then cpu must be in 1024 (1 vCPU), 2048 (2 vCPU), or 4096 (4 vCPU). Provided value was: ${cpu}`);
        }
    }
    ;
}
exports.TaskDefinition = TaskDefinition;
_a = JSII_RTTI_SYMBOL_1;
TaskDefinition[_a] = { fqn: "@aws-cdk/aws-ecs.TaskDefinition", version: "0.0.0" };
/**
 * The port range to open up for dynamic port mapping
 */
const EPHEMERAL_PORT_RANGE = ec2.Port.tcpRange(32768, 65535);
/**
 * The networking mode to use for the containers in the task.
 */
var NetworkMode;
(function (NetworkMode) {
    /**
     * The task's containers do not have external connectivity and port mappings can't be specified in the container definition.
     */
    NetworkMode["NONE"] = "none";
    /**
     * The task utilizes Docker's built-in virtual network which runs inside each container instance.
     */
    NetworkMode["BRIDGE"] = "bridge";
    /**
     * The task is allocated an elastic network interface.
     */
    NetworkMode["AWS_VPC"] = "awsvpc";
    /**
     * The task bypasses Docker's built-in virtual network and maps container ports directly to the EC2 instance's network interface directly.
     *
     * In this mode, you can't run multiple instantiations of the same task on a
     * single container instance when port mappings are used.
     */
    NetworkMode["HOST"] = "host";
    /**
     * The task utilizes NAT network mode required by Windows containers.
     *
     * This is the only supported network mode for Windows containers. For more information, see
     * [Task Definition Parameters](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#network_mode).
     */
    NetworkMode["NAT"] = "nat";
})(NetworkMode = exports.NetworkMode || (exports.NetworkMode = {}));
/**
 * The IPC resource namespace to use for the containers in the task.
 */
var IpcMode;
(function (IpcMode) {
    /**
     * If none is specified, then IPC resources within the containers of a task are private and not
     * shared with other containers in a task or on the container instance
     */
    IpcMode["NONE"] = "none";
    /**
     * If host is specified, then all containers within the tasks that specified the host IPC mode on
     * the same container instance share the same IPC resources with the host Amazon EC2 instance.
     */
    IpcMode["HOST"] = "host";
    /**
     * If task is specified, all containers within the specified task share the same IPC resources.
     */
    IpcMode["TASK"] = "task";
})(IpcMode = exports.IpcMode || (exports.IpcMode = {}));
/**
 * The process namespace to use for the containers in the task.
 */
var PidMode;
(function (PidMode) {
    /**
     * If host is specified, then all containers within the tasks that specified the host PID mode
     * on the same container instance share the same process namespace with the host Amazon EC2 instance.
     */
    PidMode["HOST"] = "host";
    /**
     * If task is specified, all containers within the specified task share the same process namespace.
     */
    PidMode["TASK"] = "task";
})(PidMode = exports.PidMode || (exports.PidMode = {}));
/**
 * The scope for the Docker volume that determines its lifecycle.
 * Docker volumes that are scoped to a task are automatically provisioned when the task starts and destroyed when the task stops.
 * Docker volumes that are scoped as shared persist after the task stops.
 */
var Scope;
(function (Scope) {
    /**
     * Docker volumes that are scoped to a task are automatically provisioned when the task starts and destroyed when the task stops.
     */
    Scope["TASK"] = "task";
    /**
     * Docker volumes that are scoped as shared persist after the task stops.
     */
    Scope["SHARED"] = "shared";
})(Scope = exports.Scope || (exports.Scope = {}));
/**
 * The task launch type compatibility requirement.
 */
var Compatibility;
(function (Compatibility) {
    /**
     * The task should specify the EC2 launch type.
     */
    Compatibility[Compatibility["EC2"] = 0] = "EC2";
    /**
     * The task should specify the Fargate launch type.
     */
    Compatibility[Compatibility["FARGATE"] = 1] = "FARGATE";
    /**
     * The task can specify either the EC2 or Fargate launch types.
     */
    Compatibility[Compatibility["EC2_AND_FARGATE"] = 2] = "EC2_AND_FARGATE";
    /**
     * The task should specify the External launch type.
     */
    Compatibility[Compatibility["EXTERNAL"] = 3] = "EXTERNAL";
})(Compatibility = exports.Compatibility || (exports.Compatibility = {}));
/**
 * Return true if the given task definition can be run on an EC2 cluster
 */
function isEc2Compatible(compatibility) {
    return [Compatibility.EC2, Compatibility.EC2_AND_FARGATE].includes(compatibility);
}
exports.isEc2Compatible = isEc2Compatible;
/**
 * Return true if the given task definition can be run on a Fargate cluster
 */
function isFargateCompatible(compatibility) {
    return [Compatibility.FARGATE, Compatibility.EC2_AND_FARGATE].includes(compatibility);
}
exports.isFargateCompatible = isFargateCompatible;
/**
 * Return true if the given task definition can be run on a ECS Anywhere cluster
 */
function isExternalCompatible(compatibility) {
    return [Compatibility.EXTERNAL].includes(compatibility);
}
exports.isExternalCompatible = isExternalCompatible;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGFzay1kZWZpbml0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsd0NBQStFO0FBRS9FLDJFQUFxRTtBQUNyRSxrRUFBaUg7QUFDakgsb0RBQXFEO0FBQ3JELGdFQUFzSjtBQUN0SixrRUFBNkQ7QUFrUTdELE1BQWUsa0JBQW1CLFNBQVEsZUFBUTtJQVFoRDs7T0FFRztJQUNILElBQVcsZUFBZTtRQUN4QixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDNUM7SUFFRDs7T0FFRztJQUNILElBQVcsbUJBQW1CO1FBQzVCLE9BQU8sbUJBQW1CLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ2hEO0lBRUQ7O09BRUc7SUFDSCxJQUFXLG9CQUFvQjtRQUM3QixPQUFPLG9CQUFvQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUNqRDtDQUNGO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLGNBQWUsU0FBUSxrQkFBa0I7SUE0RnBEOztPQUVHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBOUJuQjs7V0FFRztRQUNnQixlQUFVLEdBQUcsSUFBSSxLQUFLLEVBQXVCLENBQUM7UUFFakU7O1dBRUc7UUFDYyxZQUFPLEdBQWEsRUFBRSxDQUFDO1FBRXhDOztXQUVHO1FBQ2MseUJBQW9CLEdBQUcsSUFBSSxLQUFLLEVBQStELENBQUM7UUFFakg7O1dBRUc7UUFDYywyQkFBc0IsR0FBMkIsRUFBRSxDQUFDOzs7Ozs7K0NBcEYxRCxjQUFjOzs7O1FBa0d2QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksWUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENB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SUFFUDs7T0FFRztJQUNILHVFQUFlLENBQUE7SUFFZjs7T0FFRztJQUNILHlEQUFRLENBQUE7QUFDVixDQUFDLEVBcEJXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBb0J4QjtBQW9CRDs7R0FFRztBQUNILFNBQWdCLGVBQWUsQ0FBQyxhQUE0QjtJQUMxRCxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3BGLENBQUM7QUFGRCwwQ0FFQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsbUJBQW1CLENBQUMsYUFBNEI7SUFDOUQsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN4RixDQUFDO0FBRkQsa0RBRUM7QUFFRDs7R0FFRztBQUNILFNBQWdCLG9CQUFvQixDQUFDLGFBQTRCO0lBQy9ELE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFGRCxvREFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IElSZXNvdXJjZSwgTGF6eSwgTmFtZXMsIFBoeXNpY2FsTmFtZSwgUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSW1wb3J0ZWRUYXNrRGVmaW5pdGlvbiB9IGZyb20gJy4vX2ltcG9ydGVkLXRhc2stZGVmaW5pdGlvbic7XG5pbXBvcnQgeyBDb250YWluZXJEZWZpbml0aW9uLCBDb250YWluZXJEZWZpbml0aW9uT3B0aW9ucywgUG9ydE1hcHBpbmcsIFByb3RvY29sIH0gZnJvbSAnLi4vY29udGFpbmVyLWRlZmluaXRpb24nO1xuaW1wb3J0IHsgQ2ZuVGFza0RlZmluaXRpb24gfSBmcm9tICcuLi9lY3MuZ2VuZXJhdGVkJztcbmltcG9ydCB7IEZpcmVsZW5zTG9nUm91dGVyLCBGaXJlbGVuc0xvZ1JvdXRlckRlZmluaXRpb25PcHRpb25zLCBGaXJlbGVuc0xvZ1JvdXRlclR5cGUsIG9idGFpbkRlZmF1bHRGbHVlbnRCaXRFQ1JJbWFnZSB9IGZyb20gJy4uL2ZpcmVsZW5zLWxvZy1yb3V0ZXInO1xuaW1wb3J0IHsgQXdzTG9nRHJpdmVyIH0gZnJvbSAnLi4vbG9nLWRyaXZlcnMvYXdzLWxvZy1kcml2ZXInO1xuaW1wb3J0IHsgUGxhY2VtZW50Q29uc3RyYWludCB9IGZyb20gJy4uL3BsYWNlbWVudCc7XG5pbXBvcnQgeyBQcm94eUNvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi9wcm94eS1jb25maWd1cmF0aW9uL3Byb3h5LWNvbmZpZ3VyYXRpb24nO1xuaW1wb3J0IHsgUnVudGltZVBsYXRmb3JtIH0gZnJvbSAnLi4vcnVudGltZS1wbGF0Zm9ybSc7XG5cbi8qKlxuICogVGhlIGludGVyZmFjZSBmb3IgYWxsIHRhc2sgZGVmaW5pdGlvbnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVRhc2tEZWZpbml0aW9uIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIEFSTiBvZiB0aGlzIHRhc2sgZGVmaW5pdGlvblxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSB0YXNrRGVmaW5pdGlvbkFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBFeGVjdXRpb24gcm9sZSBmb3IgdGhpcyB0YXNrIGRlZmluaXRpb25cbiAgICovXG4gIHJlYWRvbmx5IGV4ZWN1dGlvblJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFdoYXQgbGF1bmNoIHR5cGVzIHRoaXMgdGFzayBkZWZpbml0aW9uIHNob3VsZCBiZSBjb21wYXRpYmxlIHdpdGguXG4gICAqL1xuICByZWFkb25seSBjb21wYXRpYmlsaXR5OiBDb21wYXRpYmlsaXR5O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdGFzayBkZWZpbml0aW9uIGNhbiBiZSBydW4gb24gYW4gRUMyIGNsdXN0ZXJcbiAgICovXG4gIHJlYWRvbmx5IGlzRWMyQ29tcGF0aWJsZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHRhc2sgZGVmaW5pdGlvbiBjYW4gYmUgcnVuIG9uIGEgRmFyZ2F0ZSBjbHVzdGVyXG4gICAqL1xuICByZWFkb25seSBpc0ZhcmdhdGVDb21wYXRpYmxlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdGFzayBkZWZpbml0aW9uIGNhbiBiZSBydW4gb24gYSBFQ1MgQW55d2hlcmUgY2x1c3RlclxuICAgKi9cbiAgcmVhZG9ubHkgaXNFeHRlcm5hbENvbXBhdGlibGU6IGJvb2xlYW47XG5cblxuICAvKipcbiAgICogVGhlIG5ldHdvcmtpbmcgbW9kZSB0byB1c2UgZm9yIHRoZSBjb250YWluZXJzIGluIHRoZSB0YXNrLlxuICAgKi9cbiAgcmVhZG9ubHkgbmV0d29ya01vZGU6IE5ldHdvcmtNb2RlO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgSUFNIHJvbGUgdGhhdCBncmFudHMgY29udGFpbmVycyBpbiB0aGUgdGFzayBwZXJtaXNzaW9uIHRvIGNhbGwgQVdTIEFQSXMgb24geW91ciBiZWhhbGYuXG4gICAqL1xuICByZWFkb25seSB0YXNrUm9sZTogaWFtLklSb2xlO1xufVxuXG4vKipcbiAqIFRoZSBjb21tb24gcHJvcGVydGllcyBmb3IgYWxsIHRhc2sgZGVmaW5pdGlvbnMuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWVcbiAqIFtUYXNrIERlZmluaXRpb24gUGFyYW1ldGVyc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUy9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdGFza19kZWZpbml0aW9uX3BhcmFtZXRlcnMuaHRtbCkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29tbW9uVGFza0RlZmluaXRpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiBhIGZhbWlseSB0aGF0IHRoaXMgdGFzayBkZWZpbml0aW9uIGlzIHJlZ2lzdGVyZWQgdG8uIEEgZmFtaWx5IGdyb3VwcyBtdWx0aXBsZSB2ZXJzaW9ucyBvZiBhIHRhc2sgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlZCBuYW1lLlxuICAgKi9cbiAgcmVhZG9ubHkgZmFtaWx5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgSUFNIHRhc2sgZXhlY3V0aW9uIHJvbGUgdGhhdCBncmFudHMgdGhlIEVDUyBhZ2VudCBwZXJtaXNzaW9uIHRvIGNhbGwgQVdTIEFQSXMgb24geW91ciBiZWhhbGYuXG4gICAqXG4gICAqIFRoZSByb2xlIHdpbGwgYmUgdXNlZCB0byByZXRyaWV2ZSBjb250YWluZXIgaW1hZ2VzIGZyb20gRUNSIGFuZCBjcmVhdGUgQ2xvdWRXYXRjaCBsb2cgZ3JvdXBzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFuIGV4ZWN1dGlvbiByb2xlIHdpbGwgYmUgYXV0b21hdGljYWxseSBjcmVhdGVkIGlmIHlvdSB1c2UgRUNSIGltYWdlcyBpbiB5b3VyIHRhc2sgZGVmaW5pdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGV4ZWN1dGlvblJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBJQU0gcm9sZSB0aGF0IGdyYW50cyBjb250YWluZXJzIGluIHRoZSB0YXNrIHBlcm1pc3Npb24gdG8gY2FsbCBBV1MgQVBJcyBvbiB5b3VyIGJlaGFsZi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIHRhc2sgcm9sZSBpcyBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQgZm9yIHlvdS5cbiAgICovXG4gIHJlYWRvbmx5IHRhc2tSb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBkZXRhaWxzIGZvciB0aGUgQXBwIE1lc2ggcHJveHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gcHJveHkgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHByb3h5Q29uZmlndXJhdGlvbj86IFByb3h5Q29uZmlndXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIGxpc3Qgb2Ygdm9sdW1lIGRlZmluaXRpb25zIGZvciB0aGUgdGFzay4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZVxuICAgKiBbVGFzayBEZWZpbml0aW9uIFBhcmFtZXRlciBWb2x1bWVzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNTL2xhdGVzdC9kZXZlbG9wZXJndWlkZS8vdGFza19kZWZpbml0aW9uX3BhcmFtZXRlcnMuaHRtbCN2b2x1bWVzKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyB2b2x1bWVzIGFyZSBwYXNzZWQgdG8gdGhlIERvY2tlciBkYWVtb24gb24gYSBjb250YWluZXIgaW5zdGFuY2UuXG4gICAqL1xuICByZWFkb25seSB2b2x1bWVzPzogVm9sdW1lW107XG59XG5cbi8qKlxuICogVGhlIHByb3BlcnRpZXMgZm9yIHRhc2sgZGVmaW5pdGlvbnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVGFza0RlZmluaXRpb25Qcm9wcyBleHRlbmRzIENvbW1vblRhc2tEZWZpbml0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIG5ldHdvcmtpbmcgbW9kZSB0byB1c2UgZm9yIHRoZSBjb250YWluZXJzIGluIHRoZSB0YXNrLlxuICAgKlxuICAgKiBPbiBGYXJnYXRlLCB0aGUgb25seSBzdXBwb3J0ZWQgbmV0d29ya2luZyBtb2RlIGlzIEF3c1ZwYy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOZXR3b3JrTW9kZS5CcmlkZ2UgZm9yIEVDMiAmIEV4dGVybmFsIHRhc2tzLCBBd3NWcGMgZm9yIEZhcmdhdGUgdGFza3MuXG4gICAqL1xuICByZWFkb25seSBuZXR3b3JrTW9kZT86IE5ldHdvcmtNb2RlO1xuXG4gIC8qKlxuICAgKiBUaGUgcGxhY2VtZW50IGNvbnN0cmFpbnRzIHRvIHVzZSBmb3IgdGFza3MgaW4gdGhlIHNlcnZpY2UuXG4gICAqXG4gICAqIFlvdSBjYW4gc3BlY2lmeSBhIG1heGltdW0gb2YgMTAgY29uc3RyYWludHMgcGVyIHRhc2sgKHRoaXMgbGltaXQgaW5jbHVkZXNcbiAgICogY29uc3RyYWludHMgaW4gdGhlIHRhc2sgZGVmaW5pdGlvbiBhbmQgdGhvc2Ugc3BlY2lmaWVkIGF0IHJ1biB0aW1lKS5cbiAgICpcbiAgICogTm90IHN1cHBvcnRlZCBpbiBGYXJnYXRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHBsYWNlbWVudCBjb25zdHJhaW50cy5cbiAgICovXG4gIHJlYWRvbmx5IHBsYWNlbWVudENvbnN0cmFpbnRzPzogUGxhY2VtZW50Q29uc3RyYWludFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgdGFzayBsYXVuY2ggdHlwZSBjb21wYXRpYmxpdHkgcmVxdWlyZW1lbnQuXG4gICAqL1xuICByZWFkb25seSBjb21wYXRpYmlsaXR5OiBDb21wYXRpYmlsaXR5O1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGNwdSB1bml0cyB1c2VkIGJ5IHRoZSB0YXNrLlxuICAgKlxuICAgKiBJZiB5b3UgYXJlIHVzaW5nIHRoZSBFQzIgbGF1bmNoIHR5cGUsIHRoaXMgZmllbGQgaXMgb3B0aW9uYWwgYW5kIGFueSB2YWx1ZSBjYW4gYmUgdXNlZC5cbiAgICogSWYgeW91IGFyZSB1c2luZyB0aGUgRmFyZ2F0ZSBsYXVuY2ggdHlwZSwgdGhpcyBmaWVsZCBpcyByZXF1aXJlZCBhbmQgeW91IG11c3QgdXNlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlcyxcbiAgICogd2hpY2ggZGV0ZXJtaW5lcyB5b3VyIHJhbmdlIG9mIHZhbGlkIHZhbHVlcyBmb3IgdGhlIG1lbW9yeSBwYXJhbWV0ZXI6XG4gICAqXG4gICAqIDI1NiAoLjI1IHZDUFUpIC0gQXZhaWxhYmxlIG1lbW9yeSB2YWx1ZXM6IDUxMiAoMC41IEdCKSwgMTAyNCAoMSBHQiksIDIwNDggKDIgR0IpXG4gICAqXG4gICAqIDUxMiAoLjUgdkNQVSkgLSBBdmFpbGFibGUgbWVtb3J5IHZhbHVlczogMTAyNCAoMSBHQiksIDIwNDggKDIgR0IpLCAzMDcyICgzIEdCKSwgNDA5NiAoNCBHQilcbiAgICpcbiAgICogMTAyNCAoMSB2Q1BVKSAtIEF2YWlsYWJsZSBtZW1vcnkgdmFsdWVzOiAyMDQ4ICgyIEdCKSwgMzA3MiAoMyBHQiksIDQwOTYgKDQgR0IpLCA1MTIwICg1IEdCKSwgNjE0NCAoNiBHQiksIDcxNjggKDcgR0IpLCA4MTkyICg4IEdCKVxuICAgKlxuICAgKiAyMDQ4ICgyIHZDUFUpIC0gQXZhaWxhYmxlIG1lbW9yeSB2YWx1ZXM6IEJldHdlZW4gNDA5NiAoNCBHQikgYW5kIDE2Mzg0ICgxNiBHQikgaW4gaW5jcmVtZW50cyBvZiAxMDI0ICgxIEdCKVxuICAgKlxuICAgKiA0MDk2ICg0IHZDUFUpIC0gQXZhaWxhYmxlIG1lbW9yeSB2YWx1ZXM6IEJldHdlZW4gODE5MiAoOCBHQikgYW5kIDMwNzIwICgzMCBHQikgaW4gaW5jcmVtZW50cyBvZiAxMDI0ICgxIEdCKVxuICAgKlxuICAgKiA4MTkyICg4IHZDUFUpIC0gQXZhaWxhYmxlIG1lbW9yeSB2YWx1ZXM6IEJldHdlZW4gMTYzODQgKDE2IEdCKSBhbmQgNjE0NDAgKDYwIEdCKSBpbiBpbmNyZW1lbnRzIG9mIDQwOTYgKDQgR0IpXG4gICAqXG4gICAqIDE2Mzg0ICgxNiB2Q1BVKSAtIEF2YWlsYWJsZSBtZW1vcnkgdmFsdWVzOiBCZXR3ZWVuIDMyNzY4ICgzMiBHQikgYW5kIDEyMjg4MCAoMTIwIEdCKSBpbiBpbmNyZW1lbnRzIG9mIDgxOTIgKDggR0IpXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQ1BVIHVuaXRzIGFyZSBub3Qgc3BlY2lmaWVkLlxuICAgKi9cbiAgcmVhZG9ubHkgY3B1Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IChpbiBNaUIpIG9mIG1lbW9yeSB1c2VkIGJ5IHRoZSB0YXNrLlxuICAgKlxuICAgKiBJZiB1c2luZyB0aGUgRUMyIGxhdW5jaCB0eXBlLCB0aGlzIGZpZWxkIGlzIG9wdGlvbmFsIGFuZCBhbnkgdmFsdWUgY2FuIGJlIHVzZWQuXG4gICAqIElmIHVzaW5nIHRoZSBGYXJnYXRlIGxhdW5jaCB0eXBlLCB0aGlzIGZpZWxkIGlzIHJlcXVpcmVkIGFuZCB5b3UgbXVzdCB1c2Ugb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzLFxuICAgKiB3aGljaCBkZXRlcm1pbmVzIHlvdXIgcmFuZ2Ugb2YgdmFsaWQgdmFsdWVzIGZvciB0aGUgY3B1IHBhcmFtZXRlcjpcbiAgICpcbiAgICogNTEyICgwLjUgR0IpLCAxMDI0ICgxIEdCKSwgMjA0OCAoMiBHQikgLSBBdmFpbGFibGUgY3B1IHZhbHVlczogMjU2ICguMjUgdkNQVSlcbiAgICpcbiAgICogMTAyNCAoMSBHQiksIDIwNDggKDIgR0IpLCAzMDcyICgzIEdCKSwgNDA5NiAoNCBHQikgLSBBdmFpbGFibGUgY3B1IHZhbHVlczogNTEyICguNSB2Q1BVKVxuICAgKlxuICAgKiAyMDQ4ICgyIEdCKSwgMzA3MiAoMyBHQiksIDQwOTYgKDQgR0IpLCA1MTIwICg1IEdCKSwgNjE0NCAoNiBHQiksIDcxNjggKDcgR0IpLCA4MTkyICg4IEdCKSAtIEF2YWlsYWJsZSBjcHUgdmFsdWVzOiAxMDI0ICgxIHZDUFUpXG4gICAqXG4gICAqIEJldHdlZW4gNDA5NiAoNCBHQikgYW5kIDE2Mzg0ICgxNiBHQikgaW4gaW5jcmVtZW50cyBvZiAxMDI0ICgxIEdCKSAtIEF2YWlsYWJsZSBjcHUgdmFsdWVzOiAyMDQ4ICgyIHZDUFUpXG4gICAqXG4gICAqIEJldHdlZW4gODE5MiAoOCBHQikgYW5kIDMwNzIwICgzMCBHQikgaW4gaW5jcmVtZW50cyBvZiAxMDI0ICgxIEdCKSAtIEF2YWlsYWJsZSBjcHUgdmFsdWVzOiA0MDk2ICg0IHZDUFUpXG4gICAqXG4gICAqIEJldHdlZW4gMTYzODQgKDE2IEdCKSBhbmQgNjE0NDAgKDYwIEdCKSBpbiBpbmNyZW1lbnRzIG9mIDQwOTYgKDQgR0IpIC0gQXZhaWxhYmxlIGNwdSB2YWx1ZXM6IDgxOTIgKDggdkNQVSlcbiAgICpcbiAgICogQmV0d2VlbiAzMjc2OCAoMzIgR0IpIGFuZCAxMjI4ODAgKDEyMCBHQikgaW4gaW5jcmVtZW50cyBvZiA4MTkyICg4IEdCKSAtIEF2YWlsYWJsZSBjcHUgdmFsdWVzOiAxNjM4NCAoMTYgdkNQVSlcbiAgICpcbiAgICogQGRlZmF1bHQgLSBNZW1vcnkgdXNlZCBieSB0YXNrIGlzIG5vdCBzcGVjaWZpZWQuXG4gICAqL1xuICByZWFkb25seSBtZW1vcnlNaUI/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJUEMgcmVzb3VyY2UgbmFtZXNwYWNlIHRvIHVzZSBmb3IgdGhlIGNvbnRhaW5lcnMgaW4gdGhlIHRhc2suXG4gICAqXG4gICAqIE5vdCBzdXBwb3J0ZWQgaW4gRmFyZ2F0ZSBhbmQgV2luZG93cyBjb250YWluZXJzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIElwY01vZGUgdXNlZCBieSB0aGUgdGFzayBpcyBub3Qgc3BlY2lmaWVkXG4gICAqL1xuICByZWFkb25seSBpcGNNb2RlPzogSXBjTW9kZTtcblxuICAvKipcbiAgICogVGhlIHByb2Nlc3MgbmFtZXNwYWNlIHRvIHVzZSBmb3IgdGhlIGNvbnRhaW5lcnMgaW4gdGhlIHRhc2suXG4gICAqXG4gICAqIE5vdCBzdXBwb3J0ZWQgaW4gRmFyZ2F0ZSBhbmQgV2luZG93cyBjb250YWluZXJzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFBpZE1vZGUgdXNlZCBieSB0aGUgdGFzayBpcyBub3Qgc3BlY2lmaWVkXG4gICAqL1xuICByZWFkb25seSBwaWRNb2RlPzogUGlkTW9kZTtcblxuICAvKipcbiAgICogVGhlIGluZmVyZW5jZSBhY2NlbGVyYXRvcnMgdG8gdXNlIGZvciB0aGUgY29udGFpbmVycyBpbiB0aGUgdGFzay5cbiAgICpcbiAgICogTm90IHN1cHBvcnRlZCBpbiBGYXJnYXRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGluZmVyZW5jZSBhY2NlbGVyYXRvcnMuXG4gICAqL1xuICByZWFkb25seSBpbmZlcmVuY2VBY2NlbGVyYXRvcnM/OiBJbmZlcmVuY2VBY2NlbGVyYXRvcltdO1xuXG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IChpbiBHaUIpIG9mIGVwaGVtZXJhbCBzdG9yYWdlIHRvIGJlIGFsbG9jYXRlZCB0byB0aGUgdGFzay5cbiAgICpcbiAgICogT25seSBzdXBwb3J0ZWQgaW4gRmFyZ2F0ZSBwbGF0Zm9ybSB2ZXJzaW9uIDEuNC4wIG9yIGxhdGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFVuZGVmaW5lZCwgaW4gd2hpY2ggY2FzZSwgdGhlIHRhc2sgd2lsbCByZWNlaXZlIDIwR2lCIGVwaGVtZXJhbCBzdG9yYWdlLlxuICAgKi9cbiAgcmVhZG9ubHkgZXBoZW1lcmFsU3RvcmFnZUdpQj86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIG9wZXJhdGluZyBzeXN0ZW0gdGhhdCB5b3VyIHRhc2sgZGVmaW5pdGlvbnMgYXJlIHJ1bm5pbmcgb24uXG4gICAqIEEgcnVudGltZVBsYXRmb3JtIGlzIHN1cHBvcnRlZCBvbmx5IGZvciB0YXNrcyB1c2luZyB0aGUgRmFyZ2F0ZSBsYXVuY2ggdHlwZS5cbiAgICpcbiAgICpcbiAgICogQGRlZmF1bHQgLSBVbmRlZmluZWQuXG4gICAqL1xuICByZWFkb25seSBydW50aW1lUGxhdGZvcm0/OiBSdW50aW1lUGxhdGZvcm07XG59XG5cbi8qKlxuICogVGhlIGNvbW1vbiB0YXNrIGRlZmluaXRpb24gYXR0cmlidXRlcyB1c2VkIGFjcm9zcyBhbGwgdHlwZXMgb2YgdGFzayBkZWZpbml0aW9ucy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb21tb25UYXNrRGVmaW5pdGlvbkF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIGFybiBvZiB0aGUgdGFzayBkZWZpbml0aW9uXG4gICAqL1xuICByZWFkb25seSB0YXNrRGVmaW5pdGlvbkFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmV0d29ya2luZyBtb2RlIHRvIHVzZSBmb3IgdGhlIGNvbnRhaW5lcnMgaW4gdGhlIHRhc2suXG4gICAqXG4gICAqIEBkZWZhdWx0IE5ldHdvcmsgbW9kZSBjYW5ub3QgYmUgcHJvdmlkZWQgdG8gdGhlIGltcG9ydGVkIHRhc2suXG4gICAqL1xuICByZWFkb25seSBuZXR3b3JrTW9kZT86IE5ldHdvcmtNb2RlO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgSUFNIHJvbGUgdGhhdCBncmFudHMgY29udGFpbmVycyBpbiB0aGUgdGFzayBwZXJtaXNzaW9uIHRvIGNhbGwgQVdTIEFQSXMgb24geW91ciBiZWhhbGYuXG4gICAqXG4gICAqIEBkZWZhdWx0IFBlcm1pc3Npb25zIGNhbm5vdCBiZSBncmFudGVkIHRvIHRoZSBpbXBvcnRlZCB0YXNrLlxuICAgKi9cbiAgcmVhZG9ubHkgdGFza1JvbGU/OiBpYW0uSVJvbGU7XG59XG5cbi8qKlxuICogIEEgcmVmZXJlbmNlIHRvIGFuIGV4aXN0aW5nIHRhc2sgZGVmaW5pdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIFRhc2tEZWZpbml0aW9uQXR0cmlidXRlcyBleHRlbmRzIENvbW1vblRhc2tEZWZpbml0aW9uQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBXaGF0IGxhdW5jaCB0eXBlcyB0aGlzIHRhc2sgZGVmaW5pdGlvbiBzaG91bGQgYmUgY29tcGF0aWJsZSB3aXRoLlxuICAgKlxuICAgKiBAZGVmYXVsdCBDb21wYXRpYmlsaXR5LkVDMl9BTkRfRkFSR0FURVxuICAgKi9cbiAgcmVhZG9ubHkgY29tcGF0aWJpbGl0eT86IENvbXBhdGliaWxpdHk7XG59XG5cbmFic3RyYWN0IGNsYXNzIFRhc2tEZWZpbml0aW9uQmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVRhc2tEZWZpbml0aW9uIHtcblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgY29tcGF0aWJpbGl0eTogQ29tcGF0aWJpbGl0eTtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IG5ldHdvcmtNb2RlOiBOZXR3b3JrTW9kZTtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHRhc2tEZWZpbml0aW9uQXJuOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSB0YXNrUm9sZTogaWFtLklSb2xlO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZXhlY3V0aW9uUm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHRhc2sgZGVmaW5pdGlvbiBjYW4gYmUgcnVuIG9uIGFuIEVDMiBjbHVzdGVyXG4gICAqL1xuICBwdWJsaWMgZ2V0IGlzRWMyQ29tcGF0aWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNFYzJDb21wYXRpYmxlKHRoaXMuY29tcGF0aWJpbGl0eSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRydWUgaWYgdGhlIHRhc2sgZGVmaW5pdGlvbiBjYW4gYmUgcnVuIG9uIGEgRmFyZ2F0ZSBjbHVzdGVyXG4gICAqL1xuICBwdWJsaWMgZ2V0IGlzRmFyZ2F0ZUNvbXBhdGlibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGlzRmFyZ2F0ZUNvbXBhdGlibGUodGhpcy5jb21wYXRpYmlsaXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdGFzayBkZWZpbml0aW9uIGNhbiBiZSBydW4gb24gYSBFQ1MgYW55d2hlcmUgY2x1c3RlclxuICAgKi9cbiAgcHVibGljIGdldCBpc0V4dGVybmFsQ29tcGF0aWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNFeHRlcm5hbENvbXBhdGlibGUodGhpcy5jb21wYXRpYmlsaXR5KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBiYXNlIGNsYXNzIGZvciBhbGwgdGFzayBkZWZpbml0aW9ucy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRhc2tEZWZpbml0aW9uIGV4dGVuZHMgVGFza0RlZmluaXRpb25CYXNlIHtcblxuICAvKipcbiAgICogSW1wb3J0cyBhIHRhc2sgZGVmaW5pdGlvbiBmcm9tIHRoZSBzcGVjaWZpZWQgdGFzayBkZWZpbml0aW9uIEFSTi5cbiAgICpcbiAgICogVGhlIHRhc2sgd2lsbCBoYXZlIGEgY29tcGF0aWJpbGl0eSBvZiBFQzIrRmFyZ2F0ZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVRhc2tEZWZpbml0aW9uQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHRhc2tEZWZpbml0aW9uQXJuOiBzdHJpbmcpOiBJVGFza0RlZmluaXRpb24ge1xuICAgIHJldHVybiBuZXcgSW1wb3J0ZWRUYXNrRGVmaW5pdGlvbihzY29wZSwgaWQsIHsgdGFza0RlZmluaXRpb25Bcm46IHRhc2tEZWZpbml0aW9uQXJuIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHRhc2sgZGVmaW5pdGlvbiBmcm9tIGEgdGFzayBkZWZpbml0aW9uIHJlZmVyZW5jZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tVGFza0RlZmluaXRpb25BdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBUYXNrRGVmaW5pdGlvbkF0dHJpYnV0ZXMpOiBJVGFza0RlZmluaXRpb24ge1xuICAgIHJldHVybiBuZXcgSW1wb3J0ZWRUYXNrRGVmaW5pdGlvbihzY29wZSwgaWQsIHtcbiAgICAgIHRhc2tEZWZpbml0aW9uQXJuOiBhdHRycy50YXNrRGVmaW5pdGlvbkFybixcbiAgICAgIGNvbXBhdGliaWxpdHk6IGF0dHJzLmNvbXBhdGliaWxpdHksXG4gICAgICBuZXR3b3JrTW9kZTogYXR0cnMubmV0d29ya01vZGUsXG4gICAgICB0YXNrUm9sZTogYXR0cnMudGFza1JvbGUsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgYSBmYW1pbHkgdGhhdCB0aGlzIHRhc2sgZGVmaW5pdGlvbiBpcyByZWdpc3RlcmVkIHRvLlxuICAgKiBBIGZhbWlseSBncm91cHMgbXVsdGlwbGUgdmVyc2lvbnMgb2YgYSB0YXNrIGRlZmluaXRpb24uXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZmFtaWx5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBmdWxsIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSB0YXNrIGRlZmluaXRpb24uXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0YXNrRGVmaW5pdGlvbkFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgSUFNIHJvbGUgdGhhdCBncmFudHMgY29udGFpbmVycyBpbiB0aGUgdGFzayBwZXJtaXNzaW9uIHRvIGNhbGwgQVdTIEFQSXMgb24geW91ciBiZWhhbGYuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdGFza1JvbGU6IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogVGhlIG5ldHdvcmtpbmcgbW9kZSB0byB1c2UgZm9yIHRoZSBjb250YWluZXJzIGluIHRoZSB0YXNrLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG5ldHdvcmtNb2RlOiBOZXR3b3JrTW9kZTtcblxuICAvKipcbiAgICogRGVmYXVsdCBjb250YWluZXIgZm9yIHRoaXMgdGFza1xuICAgKlxuICAgKiBMb2FkIGJhbGFuY2VycyB3aWxsIHNlbmQgdHJhZmZpYyB0byB0aGlzIGNvbnRhaW5lci4gVGhlIGZpcnN0XG4gICAqIGVzc2VudGlhbCBjb250YWluZXIgdGhhdCBpcyBhZGRlZCB0byB0aGlzIHRhc2sgd2lsbCBiZWNvbWUgdGhlIGRlZmF1bHRcbiAgICogY29udGFpbmVyLlxuICAgKi9cbiAgcHVibGljIGRlZmF1bHRDb250YWluZXI/OiBDb250YWluZXJEZWZpbml0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgdGFzayBsYXVuY2ggdHlwZSBjb21wYXRpYmlsaXR5IHJlcXVpcmVtZW50LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbXBhdGliaWxpdHk6IENvbXBhdGliaWxpdHk7XG5cbiAgLyoqXG4gICAqIFRoZSBhbW91bnQgKGluIEdpQikgb2YgZXBoZW1lcmFsIHN0b3JhZ2UgdG8gYmUgYWxsb2NhdGVkIHRvIHRoZSB0YXNrLlxuICAgKlxuICAgKiBPbmx5IHN1cHBvcnRlZCBpbiBGYXJnYXRlIHBsYXRmb3JtIHZlcnNpb24gMS40LjAgb3IgbGF0ZXIuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZXBoZW1lcmFsU3RvcmFnZUdpQj86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGNvbnRhaW5lciBkZWZpbml0aW9ucy5cbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSBjb250YWluZXJzID0gbmV3IEFycmF5PENvbnRhaW5lckRlZmluaXRpb24+KCk7XG5cbiAgLyoqXG4gICAqIEFsbCB2b2x1bWVzXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHZvbHVtZXM6IFZvbHVtZVtdID0gW107XG5cbiAgLyoqXG4gICAqIFBsYWNlbWVudCBjb25zdHJhaW50cyBmb3IgdGFzayBpbnN0YW5jZXNcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgcGxhY2VtZW50Q29uc3RyYWludHMgPSBuZXcgQXJyYXk8Q2ZuVGFza0RlZmluaXRpb24uVGFza0RlZmluaXRpb25QbGFjZW1lbnRDb25zdHJhaW50UHJvcGVydHk+KCk7XG5cbiAgLyoqXG4gICAqIEluZmVyZW5jZSBhY2NlbGVyYXRvcnMgZm9yIHRhc2sgaW5zdGFuY2VzXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9pbmZlcmVuY2VBY2NlbGVyYXRvcnM6IEluZmVyZW5jZUFjY2VsZXJhdG9yW10gPSBbXTtcblxuICBwcml2YXRlIF9leGVjdXRpb25Sb2xlPzogaWFtLklSb2xlO1xuXG4gIHByaXZhdGUgX3Bhc3NSb2xlU3RhdGVtZW50PzogaWFtLlBvbGljeVN0YXRlbWVudDtcblxuICBwcml2YXRlIHJ1bnRpbWVQbGF0Zm9ybT86IFJ1bnRpbWVQbGF0Zm9ybTtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgVGFza0RlZmluaXRpb24gY2xhc3MuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogVGFza0RlZmluaXRpb25Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLmZhbWlseSA9IHByb3BzLmZhbWlseSB8fCBOYW1lcy51bmlxdWVJZCh0aGlzKTtcbiAgICB0aGlzLmNvbXBhdGliaWxpdHkgPSBwcm9wcy5jb21wYXRpYmlsaXR5O1xuXG4gICAgaWYgKHByb3BzLnZvbHVtZXMpIHtcbiAgICAgIHByb3BzLnZvbHVtZXMuZm9yRWFjaCh2ID0+IHRoaXMuYWRkVm9sdW1lKHYpKTtcbiAgICB9XG5cbiAgICB0aGlzLm5ldHdvcmtNb2RlID0gcHJvcHMubmV0d29ya01vZGUgPz8gKHRoaXMuaXNGYXJnYXRlQ29tcGF0aWJsZSA/IE5ldHdvcmtNb2RlLkFXU19WUEMgOiBOZXR3b3JrTW9kZS5CUklER0UpO1xuICAgIGlmICh0aGlzLmlzRmFyZ2F0ZUNvbXBhdGlibGUgJiYgdGhpcy5uZXR3b3JrTW9kZSAhPT0gTmV0d29ya01vZGUuQVdTX1ZQQykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYXJnYXRlIHRhc2tzIGNhbiBvbmx5IGhhdmUgQXdzVnBjIG5ldHdvcmsgbW9kZSwgZ290OiAke3RoaXMubmV0d29ya01vZGV9YCk7XG4gICAgfVxuICAgIGlmIChwcm9wcy5wcm94eUNvbmZpZ3VyYXRpb24gJiYgdGhpcy5uZXR3b3JrTW9kZSAhPT0gTmV0d29ya01vZGUuQVdTX1ZQQykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQcm94eUNvbmZpZ3VyYXRpb24gY2FuIG9ubHkgYmUgdXNlZCB3aXRoIEF3c1ZwYyBuZXR3b3JrIG1vZGUsIGdvdDogJHt0aGlzLm5ldHdvcmtNb2RlfWApO1xuICAgIH1cbiAgICBpZiAocHJvcHMucGxhY2VtZW50Q29uc3RyYWludHMgJiYgcHJvcHMucGxhY2VtZW50Q29uc3RyYWludHMubGVuZ3RoID4gMCAmJiB0aGlzLmlzRmFyZ2F0ZUNvbXBhdGlibGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNldCBwbGFjZW1lbnQgY29uc3RyYWludHMgb24gdGFza3MgdGhhdCBydW4gb24gRmFyZ2F0ZScpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRmFyZ2F0ZUNvbXBhdGlibGUgJiYgKCFwcm9wcy5jcHUgfHwgIXByb3BzLm1lbW9yeU1pQikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRmFyZ2F0ZS1jb21wYXRpYmxlIHRhc2tzIHJlcXVpcmUgYm90aCBDUFUgKCR7cHJvcHMuY3B1fSkgYW5kIG1lbW9yeSAoJHtwcm9wcy5tZW1vcnlNaUJ9KSBzcGVjaWZpY2F0aW9uc2ApO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5pbmZlcmVuY2VBY2NlbGVyYXRvcnMgJiYgcHJvcHMuaW5mZXJlbmNlQWNjZWxlcmF0b3JzLmxlbmd0aCA+IDAgJiYgdGhpcy5pc0ZhcmdhdGVDb21wYXRpYmxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2UgaW5mZXJlbmNlIGFjY2VsZXJhdG9ycyBvbiB0YXNrcyB0aGF0IHJ1biBvbiBGYXJnYXRlJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNFeHRlcm5hbENvbXBhdGlibGUgJiYgIVtOZXR3b3JrTW9kZS5CUklER0UsIE5ldHdvcmtNb2RlLkhPU1QsIE5ldHdvcmtNb2RlLk5PTkVdLmluY2x1ZGVzKHRoaXMubmV0d29ya01vZGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4dGVybmFsIHRhc2tzIGNhbiBvbmx5IGhhdmUgQnJpZGdlLCBIb3N0IG9yIE5vbmUgbmV0d29yayBtb2RlLCBnb3Q6ICR7dGhpcy5uZXR3b3JrTW9kZX1gKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNGYXJnYXRlQ29tcGF0aWJsZSAmJiBwcm9wcy5ydW50aW1lUGxhdGZvcm0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNwZWNpZnkgcnVudGltZVBsYXRmb3JtIGluIG5vbi1GYXJnYXRlIGNvbXBhdGlibGUgdGFza3MnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9leGVjdXRpb25Sb2xlID0gcHJvcHMuZXhlY3V0aW9uUm9sZTtcblxuICAgIHRoaXMudGFza1JvbGUgPSBwcm9wcy50YXNrUm9sZSB8fCBuZXcgaWFtLlJvbGUodGhpcywgJ1Rhc2tSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICBpZiAocHJvcHMuaW5mZXJlbmNlQWNjZWxlcmF0b3JzKSB7XG4gICAgICBwcm9wcy5pbmZlcmVuY2VBY2NlbGVyYXRvcnMuZm9yRWFjaChpYSA9PiB0aGlzLmFkZEluZmVyZW5jZUFjY2VsZXJhdG9yKGlhKSk7XG4gICAgfVxuXG4gICAgdGhpcy5lcGhlbWVyYWxTdG9yYWdlR2lCID0gcHJvcHMuZXBoZW1lcmFsU3RvcmFnZUdpQjtcblxuICAgIC8vIHZhbGlkYXRlIHRoZSBjcHUgYW5kIG1lbW9yeSBzaXplIGZvciB0aGUgV2luZG93cyBvcGVyYXRpb24gc3lzdGVtIGZhbWlseS5cbiAgICBpZiAocHJvcHMucnVudGltZVBsYXRmb3JtPy5vcGVyYXRpbmdTeXN0ZW1GYW1pbHk/Ll9vcGVyYXRpbmdTeXN0ZW1GYW1pbHkuaW5jbHVkZXMoJ1dJTkRPV1MnKSkge1xuICAgICAgLy8gV2Uga25vdyB0aGF0IHByb3BzLmNwdSBhbmQgcHJvcHMubWVtb3J5TWlCIGFyZSBkZWZpbmVkIGJlY2F1c2UgYW4gZXJyb3Igd291bGQgaGF2ZSBiZWVuIHRocm93biBwcmV2aW91c2x5IGlmIHRoZXkgd2VyZSBub3QuXG4gICAgICAvLyBCdXQsIHR5cGVzY3JpcHQgaXMgbm90IGFibGUgdG8gZmlndXJlIHRoaXMgb3V0LCBzbyB1c2luZyB0aGUgYCFgIG9wZXJhdG9yIGhlcmUgdG8gbGV0IHRoZSB0eXBlLWNoZWNrZXIga25vdyB0aGV5IGFyZSBkZWZpbmVkLlxuICAgICAgdGhpcy5jaGVja0ZhcmdhdGVXaW5kb3dzQmFzZWRUYXNrc1NpemUocHJvcHMuY3B1ISwgcHJvcHMubWVtb3J5TWlCISwgcHJvcHMucnVudGltZVBsYXRmb3JtISk7XG4gICAgfVxuXG4gICAgdGhpcy5ydW50aW1lUGxhdGZvcm0gPSBwcm9wcy5ydW50aW1lUGxhdGZvcm07XG5cbiAgICBjb25zdCB0YXNrRGVmID0gbmV3IENmblRhc2tEZWZpbml0aW9uKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGNvbnRhaW5lckRlZmluaXRpb25zOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucmVuZGVyQ29udGFpbmVycygpIH0sIHsgb21pdEVtcHR5QXJyYXk6IHRydWUgfSksXG4gICAgICB2b2x1bWVzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucmVuZGVyVm9sdW1lcygpIH0sIHsgb21pdEVtcHR5QXJyYXk6IHRydWUgfSksXG4gICAgICBleGVjdXRpb25Sb2xlQXJuOiBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IHRoaXMuZXhlY3V0aW9uUm9sZSAmJiB0aGlzLmV4ZWN1dGlvblJvbGUucm9sZUFybiB9KSxcbiAgICAgIGZhbWlseTogdGhpcy5mYW1pbHksXG4gICAgICB0YXNrUm9sZUFybjogdGhpcy50YXNrUm9sZS5yb2xlQXJuLFxuICAgICAgcmVxdWlyZXNDb21wYXRpYmlsaXRpZXM6IFtcbiAgICAgICAgLi4uKGlzRWMyQ29tcGF0aWJsZShwcm9wcy5jb21wYXRpYmlsaXR5KSA/IFsnRUMyJ10gOiBbXSksXG4gICAgICAgIC4uLihpc0ZhcmdhdGVDb21wYXRpYmxlKHByb3BzLmNvbXBhdGliaWxpdHkpID8gWydGQVJHQVRFJ10gOiBbXSksXG4gICAgICAgIC4uLihpc0V4dGVybmFsQ29tcGF0aWJsZShwcm9wcy5jb21wYXRpYmlsaXR5KSA/IFsnRVhURVJOQUwnXSA6IFtdKSxcbiAgICAgIF0sXG4gICAgICBuZXR3b3JrTW9kZTogdGhpcy5yZW5kZXJOZXR3b3JrTW9kZSh0aGlzLm5ldHdvcmtNb2RlKSxcbiAgICAgIHBsYWNlbWVudENvbnN0cmFpbnRzOiBMYXp5LmFueSh7XG4gICAgICAgIHByb2R1Y2U6ICgpID0+XG4gICAgICAgICAgIWlzRmFyZ2F0ZUNvbXBhdGlibGUodGhpcy5jb21wYXRpYmlsaXR5KSA/IHRoaXMucGxhY2VtZW50Q29uc3RyYWludHMgOiB1bmRlZmluZWQsXG4gICAgICB9LCB7IG9taXRFbXB0eUFycmF5OiB0cnVlIH0pLFxuICAgICAgcHJveHlDb25maWd1cmF0aW9uOiBwcm9wcy5wcm94eUNvbmZpZ3VyYXRpb24gPyBwcm9wcy5wcm94eUNvbmZpZ3VyYXRpb24uYmluZCh0aGlzLnN0YWNrLCB0aGlzKSA6IHVuZGVmaW5lZCxcbiAgICAgIGNwdTogcHJvcHMuY3B1LFxuICAgICAgbWVtb3J5OiBwcm9wcy5tZW1vcnlNaUIsXG4gICAgICBpcGNNb2RlOiBwcm9wcy5pcGNNb2RlLFxuICAgICAgcGlkTW9kZTogcHJvcHMucGlkTW9kZSxcbiAgICAgIGluZmVyZW5jZUFjY2VsZXJhdG9yczogTGF6eS5hbnkoe1xuICAgICAgICBwcm9kdWNlOiAoKSA9PlxuICAgICAgICAgICFpc0ZhcmdhdGVDb21wYXRpYmxlKHRoaXMuY29tcGF0aWJpbGl0eSkgPyB0aGlzLnJlbmRlckluZmVyZW5jZUFjY2VsZXJhdG9ycygpIDogdW5kZWZpbmVkLFxuICAgICAgfSwgeyBvbWl0RW1wdHlBcnJheTogdHJ1ZSB9KSxcbiAgICAgIGVwaGVtZXJhbFN0b3JhZ2U6IHRoaXMuZXBoZW1lcmFsU3RvcmFnZUdpQiA/IHtcbiAgICAgICAgc2l6ZUluR2lCOiB0aGlzLmVwaGVtZXJhbFN0b3JhZ2VHaUIsXG4gICAgICB9IDogdW5kZWZpbmVkLFxuICAgICAgcnVudGltZVBsYXRmb3JtOiB0aGlzLmlzRmFyZ2F0ZUNvbXBhdGlibGUgJiYgdGhpcy5ydW50aW1lUGxhdGZvcm0gPyB7XG4gICAgICAgIGNwdUFyY2hpdGVjdHVyZTogdGhpcy5ydW50aW1lUGxhdGZvcm0/LmNwdUFyY2hpdGVjdHVyZT8uX2NwdUFyY2hpdGVjdHVyZSxcbiAgICAgICAgb3BlcmF0aW5nU3lzdGVtRmFtaWx5OiB0aGlzLnJ1bnRpbWVQbGF0Zm9ybT8ub3BlcmF0aW5nU3lzdGVtRmFtaWx5Py5fb3BlcmF0aW5nU3lzdGVtRmFtaWx5LFxuICAgICAgfSA6IHVuZGVmaW5lZCxcbiAgICB9KTtcblxuICAgIGlmIChwcm9wcy5wbGFjZW1lbnRDb25zdHJhaW50cykge1xuICAgICAgcHJvcHMucGxhY2VtZW50Q29uc3RyYWludHMuZm9yRWFjaChwYyA9PiB0aGlzLmFkZFBsYWNlbWVudENvbnN0cmFpbnQocGMpKTtcbiAgICB9XG5cbiAgICB0aGlzLnRhc2tEZWZpbml0aW9uQXJuID0gdGFza0RlZi5yZWY7XG4gICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oeyB2YWxpZGF0ZTogKCkgPT4gdGhpcy52YWxpZGF0ZVRhc2tEZWZpbml0aW9uKCkgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGV4ZWN1dGlvblJvbGUoKTogaWFtLklSb2xlIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fZXhlY3V0aW9uUm9sZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWMgZ2V0dGVyIG1ldGhvZCB0byBhY2Nlc3MgbGlzdCBvZiBpbmZlcmVuY2UgYWNjZWxlcmF0b3JzIGF0dGFjaGVkIHRvIHRoZSBpbnN0YW5jZS5cbiAgICovXG4gIHB1YmxpYyBnZXQgaW5mZXJlbmNlQWNjZWxlcmF0b3JzKCk6IEluZmVyZW5jZUFjY2VsZXJhdG9yW10ge1xuICAgIHJldHVybiB0aGlzLl9pbmZlcmVuY2VBY2NlbGVyYXRvcnM7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclZvbHVtZXMoKTogQ2ZuVGFza0RlZmluaXRpb24uVm9sdW1lUHJvcGVydHlbXSB7XG4gICAgcmV0dXJuIHRoaXMudm9sdW1lcy5tYXAocmVuZGVyVm9sdW1lKTtcblxuICAgIGZ1bmN0aW9uIHJlbmRlclZvbHVtZShzcGVjOiBWb2x1bWUpOiBDZm5UYXNrRGVmaW5pdGlvbi5Wb2x1bWVQcm9wZXJ0eSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBob3N0OiBzcGVjLmhvc3QsXG4gICAgICAgIG5hbWU6IHNwZWMubmFtZSxcbiAgICAgICAgZG9ja2VyVm9sdW1lQ29uZmlndXJhdGlvbjogc3BlYy5kb2NrZXJWb2x1bWVDb25maWd1cmF0aW9uICYmIHtcbiAgICAgICAgICBhdXRvcHJvdmlzaW9uOiBzcGVjLmRvY2tlclZvbHVtZUNvbmZpZ3VyYXRpb24uYXV0b3Byb3Zpc2lvbixcbiAgICAgICAgICBkcml2ZXI6IHNwZWMuZG9ja2VyVm9sdW1lQ29uZmlndXJhdGlvbi5kcml2ZXIsXG4gICAgICAgICAgZHJpdmVyT3B0czogc3BlYy5kb2NrZXJWb2x1bWVDb25maWd1cmF0aW9uLmRyaXZlck9wdHMsXG4gICAgICAgICAgbGFiZWxzOiBzcGVjLmRvY2tlclZvbHVtZUNvbmZpZ3VyYXRpb24ubGFiZWxzLFxuICAgICAgICAgIHNjb3BlOiBzcGVjLmRvY2tlclZvbHVtZUNvbmZpZ3VyYXRpb24uc2NvcGUsXG4gICAgICAgIH0sXG4gICAgICAgIGVmc1ZvbHVtZUNvbmZpZ3VyYXRpb246IHNwZWMuZWZzVm9sdW1lQ29uZmlndXJhdGlvbiAmJiB7XG4gICAgICAgICAgZmlsZXN5c3RlbUlkOiBzcGVjLmVmc1ZvbHVtZUNvbmZpZ3VyYXRpb24uZmlsZVN5c3RlbUlkLFxuICAgICAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHNwZWMuZWZzVm9sdW1lQ29uZmlndXJhdGlvbi5hdXRob3JpemF0aW9uQ29uZmlnLFxuICAgICAgICAgIHJvb3REaXJlY3Rvcnk6IHNwZWMuZWZzVm9sdW1lQ29uZmlndXJhdGlvbi5yb290RGlyZWN0b3J5LFxuICAgICAgICAgIHRyYW5zaXRFbmNyeXB0aW9uOiBzcGVjLmVmc1ZvbHVtZUNvbmZpZ3VyYXRpb24udHJhbnNpdEVuY3J5cHRpb24sXG4gICAgICAgICAgdHJhbnNpdEVuY3J5cHRpb25Qb3J0OiBzcGVjLmVmc1ZvbHVtZUNvbmZpZ3VyYXRpb24udHJhbnNpdEVuY3J5cHRpb25Qb3J0LFxuXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVySW5mZXJlbmNlQWNjZWxlcmF0b3JzKCk6IENmblRhc2tEZWZpbml0aW9uLkluZmVyZW5jZUFjY2VsZXJhdG9yUHJvcGVydHlbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2luZmVyZW5jZUFjY2VsZXJhdG9ycy5tYXAocmVuZGVySW5mZXJlbmNlQWNjZWxlcmF0b3IpO1xuXG4gICAgZnVuY3Rpb24gcmVuZGVySW5mZXJlbmNlQWNjZWxlcmF0b3IoaW5mZXJlbmNlQWNjZWxlcmF0b3I6IEluZmVyZW5jZUFjY2VsZXJhdG9yKSA6IENmblRhc2tEZWZpbml0aW9uLkluZmVyZW5jZUFjY2VsZXJhdG9yUHJvcGVydHkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZGV2aWNlTmFtZTogaW5mZXJlbmNlQWNjZWxlcmF0b3IuZGV2aWNlTmFtZSxcbiAgICAgICAgZGV2aWNlVHlwZTogaW5mZXJlbmNlQWNjZWxlcmF0b3IuZGV2aWNlVHlwZSxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoZSBleGlzdGVuY2Ugb2YgdGhlIGlucHV0IHRhcmdldCBhbmQgc2V0IGRlZmF1bHQgdmFsdWVzLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfdmFsaWRhdGVUYXJnZXQob3B0aW9uczogTG9hZEJhbGFuY2VyVGFyZ2V0T3B0aW9ucyk6IExvYWRCYWxhbmNlclRhcmdldCB7XG4gICAgY29uc3QgdGFyZ2V0Q29udGFpbmVyID0gdGhpcy5maW5kQ29udGFpbmVyKG9wdGlvbnMuY29udGFpbmVyTmFtZSk7XG4gICAgaWYgKHRhcmdldENvbnRhaW5lciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGNvbnRhaW5lciBuYW1lZCAnJHtvcHRpb25zLmNvbnRhaW5lck5hbWV9Jy4gRGlkIHlvdSBjYWxsIFwiYWRkQ29udGFpbmVyKClcIj9gKTtcbiAgICB9XG4gICAgY29uc3QgdGFyZ2V0UHJvdG9jb2wgPSBvcHRpb25zLnByb3RvY29sIHx8IFByb3RvY29sLlRDUDtcbiAgICBjb25zdCB0YXJnZXRDb250YWluZXJQb3J0ID0gb3B0aW9ucy5jb250YWluZXJQb3J0IHx8IHRhcmdldENvbnRhaW5lci5jb250YWluZXJQb3J0O1xuICAgIGNvbnN0IHBvcnRNYXBwaW5nID0gdGFyZ2V0Q29udGFpbmVyLmZpbmRQb3J0TWFwcGluZyh0YXJnZXRDb250YWluZXJQb3J0LCB0YXJnZXRQcm90b2NvbCk7XG4gICAgaWYgKHBvcnRNYXBwaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbnRhaW5lciAnJHt0YXJnZXRDb250YWluZXJ9JyBoYXMgbm8gbWFwcGluZyBmb3IgcG9ydCAke29wdGlvbnMuY29udGFpbmVyUG9ydH0gYW5kIHByb3RvY29sICR7dGFyZ2V0UHJvdG9jb2x9LiBEaWQgeW91IGNhbGwgXCJjb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKClcIj9gKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRhaW5lck5hbWU6IG9wdGlvbnMuY29udGFpbmVyTmFtZSxcbiAgICAgIHBvcnRNYXBwaW5nLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcG9ydCByYW5nZSB0byBiZSBvcGVuZWQgdGhhdCBtYXRjaCB0aGUgcHJvdmlkZWQgY29udGFpbmVyIG5hbWUgYW5kIGNvbnRhaW5lciBwb3J0LlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfcG9ydFJhbmdlRnJvbVBvcnRNYXBwaW5nKHBvcnRNYXBwaW5nOiBQb3J0TWFwcGluZyk6IGVjMi5Qb3J0IHtcbiAgICBpZiAocG9ydE1hcHBpbmcuaG9zdFBvcnQgIT09IHVuZGVmaW5lZCAmJiBwb3J0TWFwcGluZy5ob3N0UG9ydCAhPT0gMCkge1xuICAgICAgcmV0dXJuIHBvcnRNYXBwaW5nLnByb3RvY29sID09PSBQcm90b2NvbC5VRFAgPyBlYzIuUG9ydC51ZHAocG9ydE1hcHBpbmcuaG9zdFBvcnQpIDogZWMyLlBvcnQudGNwKHBvcnRNYXBwaW5nLmhvc3RQb3J0KTtcbiAgICB9XG4gICAgaWYgKHRoaXMubmV0d29ya01vZGUgPT09IE5ldHdvcmtNb2RlLkJSSURHRSB8fCB0aGlzLm5ldHdvcmtNb2RlID09PSBOZXR3b3JrTW9kZS5OQVQpIHtcbiAgICAgIHJldHVybiBFUEhFTUVSQUxfUE9SVF9SQU5HRTtcbiAgICB9XG4gICAgcmV0dXJuIHBvcnRNYXBwaW5nLnByb3RvY29sID09PSBQcm90b2NvbC5VRFAgPyBlYzIuUG9ydC51ZHAocG9ydE1hcHBpbmcuY29udGFpbmVyUG9ydCkgOiBlYzIuUG9ydC50Y3AocG9ydE1hcHBpbmcuY29udGFpbmVyUG9ydCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHBvbGljeSBzdGF0ZW1lbnQgdG8gdGhlIHRhc2sgSUFNIHJvbGUuXG4gICAqL1xuICBwdWJsaWMgYWRkVG9UYXNrUm9sZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpIHtcbiAgICB0aGlzLnRhc2tSb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHBvbGljeSBzdGF0ZW1lbnQgdG8gdGhlIHRhc2sgZXhlY3V0aW9uIElBTSByb2xlLlxuICAgKi9cbiAgcHVibGljIGFkZFRvRXhlY3V0aW9uUm9sZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpIHtcbiAgICB0aGlzLm9idGFpbkV4ZWN1dGlvblJvbGUoKS5hZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgY29udGFpbmVyIHRvIHRoZSB0YXNrIGRlZmluaXRpb24uXG4gICAqL1xuICBwdWJsaWMgYWRkQ29udGFpbmVyKGlkOiBzdHJpbmcsIHByb3BzOiBDb250YWluZXJEZWZpbml0aW9uT3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgQ29udGFpbmVyRGVmaW5pdGlvbih0aGlzLCBpZCwgeyB0YXNrRGVmaW5pdGlvbjogdGhpcywgLi4ucHJvcHMgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGZpcmVsZW5zIGxvZyByb3V0ZXIgdG8gdGhlIHRhc2sgZGVmaW5pdGlvbi5cbiAgICovXG4gIHB1YmxpYyBhZGRGaXJlbGVuc0xvZ1JvdXRlcihpZDogc3RyaW5nLCBwcm9wczogRmlyZWxlbnNMb2dSb3V0ZXJEZWZpbml0aW9uT3B0aW9ucykge1xuICAgIC8vIG9ubHkgb25lIGZpcmVsZW5zIGxvZyByb3V0ZXIgaXMgYWxsb3dlZCBpbiBlYWNoIHRhc2suXG4gICAgaWYgKHRoaXMuY29udGFpbmVycy5maW5kKHggPT4geCBpbnN0YW5jZW9mIEZpcmVsZW5zTG9nUm91dGVyKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaXJlbGVucyBsb2cgcm91dGVyIGlzIGFscmVhZHkgYWRkZWQgaW4gdGhpcyB0YXNrLicpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRmlyZWxlbnNMb2dSb3V0ZXIodGhpcywgaWQsIHsgdGFza0RlZmluaXRpb246IHRoaXMsIC4uLnByb3BzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExpbmtzIGEgY29udGFpbmVyIHRvIHRoaXMgdGFzayBkZWZpbml0aW9uLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfbGlua0NvbnRhaW5lcihjb250YWluZXI6IENvbnRhaW5lckRlZmluaXRpb24pIHtcbiAgICB0aGlzLmNvbnRhaW5lcnMucHVzaChjb250YWluZXIpO1xuICAgIGlmICh0aGlzLmRlZmF1bHRDb250YWluZXIgPT09IHVuZGVmaW5lZCAmJiBjb250YWluZXIuZXNzZW50aWFsKSB7XG4gICAgICB0aGlzLmRlZmF1bHRDb250YWluZXIgPSBjb250YWluZXI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSB2b2x1bWUgdG8gdGhlIHRhc2sgZGVmaW5pdGlvbi5cbiAgICovXG4gIHB1YmxpYyBhZGRWb2x1bWUodm9sdW1lOiBWb2x1bWUpIHtcbiAgICB0aGlzLnZvbHVtZXMucHVzaCh2b2x1bWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhlIHNwZWNpZmllZCBwbGFjZW1lbnQgY29uc3RyYWludCB0byB0aGUgdGFzayBkZWZpbml0aW9uLlxuICAgKi9cbiAgcHVibGljIGFkZFBsYWNlbWVudENvbnN0cmFpbnQoY29uc3RyYWludDogUGxhY2VtZW50Q29uc3RyYWludCkge1xuICAgIGlmIChpc0ZhcmdhdGVDb21wYXRpYmxlKHRoaXMuY29tcGF0aWJpbGl0eSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNldCBwbGFjZW1lbnQgY29uc3RyYWludHMgb24gdGFza3MgdGhhdCBydW4gb24gRmFyZ2F0ZScpO1xuICAgIH1cbiAgICB0aGlzLnBsYWNlbWVudENvbnN0cmFpbnRzLnB1c2goLi4uY29uc3RyYWludC50b0pzb24oKSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgc3BlY2lmaWVkIGV4dGVuc2lvbiB0byB0aGUgdGFzayBkZWZpbml0aW9uLlxuICAgKlxuICAgKiBFeHRlbnNpb24gY2FuIGJlIHVzZWQgdG8gYXBwbHkgYSBwYWNrYWdlZCBtb2RpZmljYXRpb24gdG9cbiAgICogYSB0YXNrIGRlZmluaXRpb24uXG4gICAqL1xuICBwdWJsaWMgYWRkRXh0ZW5zaW9uKGV4dGVuc2lvbjogSVRhc2tEZWZpbml0aW9uRXh0ZW5zaW9uKSB7XG4gICAgZXh0ZW5zaW9uLmV4dGVuZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGluZmVyZW5jZSBhY2NlbGVyYXRvciB0byB0aGUgdGFzayBkZWZpbml0aW9uLlxuICAgKi9cbiAgcHVibGljIGFkZEluZmVyZW5jZUFjY2VsZXJhdG9yKGluZmVyZW5jZUFjY2VsZXJhdG9yOiBJbmZlcmVuY2VBY2NlbGVyYXRvcikge1xuICAgIGlmIChpc0ZhcmdhdGVDb21wYXRpYmxlKHRoaXMuY29tcGF0aWJpbGl0eSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVzZSBpbmZlcmVuY2UgYWNjZWxlcmF0b3JzIG9uIHRhc2tzIHRoYXQgcnVuIG9uIEZhcmdhdGUnKTtcbiAgICB9XG4gICAgdGhpcy5faW5mZXJlbmNlQWNjZWxlcmF0b3JzLnB1c2goaW5mZXJlbmNlQWNjZWxlcmF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50cyBwZXJtaXNzaW9ucyB0byBydW4gdGhpcyB0YXNrIGRlZmluaXRpb25cbiAgICpcbiAgICogVGhpcyB3aWxsIGdyYW50IHRoZSBmb2xsb3dpbmcgcGVybWlzc2lvbnM6XG4gICAqXG4gICAqICAgLSBlY3M6UnVuVGFza1xuICAgKiAgIC0gaWFtOlBhc3NSb2xlXG4gICAqXG4gICAqIEBwYXJhbSBncmFudGVlIFByaW5jaXBhbCB0byBncmFudCBjb25zdW1lIHJpZ2h0cyB0b1xuICAgKi9cbiAgcHVibGljIGdyYW50UnVuKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKSB7XG4gICAgZ3JhbnRlZS5ncmFudFByaW5jaXBhbC5hZGRUb1ByaW5jaXBhbFBvbGljeSh0aGlzLnBhc3NSb2xlU3RhdGVtZW50KTtcbiAgICByZXR1cm4gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWUsXG4gICAgICBhY3Rpb25zOiBbJ2VjczpSdW5UYXNrJ10sXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLnRhc2tEZWZpbml0aW9uQXJuXSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHRoZSB0YXNrIGV4ZWN1dGlvbiBJQU0gcm9sZSBpZiBpdCBkb2Vzbid0IGFscmVhZHkgZXhpc3QuXG4gICAqL1xuICBwdWJsaWMgb2J0YWluRXhlY3V0aW9uUm9sZSgpOiBpYW0uSVJvbGUge1xuICAgIGlmICghdGhpcy5fZXhlY3V0aW9uUm9sZSkge1xuICAgICAgdGhpcy5fZXhlY3V0aW9uUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnRXhlY3V0aW9uUm9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgIC8vIG5lZWRlZCBmb3IgY3Jvc3MtYWNjb3VudCBhY2Nlc3Mgd2l0aCBUYWdQYXJhbWV0ZXJDb250YWluZXJJbWFnZVxuICAgICAgICByb2xlTmFtZTogUGh5c2ljYWxOYW1lLkdFTkVSQVRFX0lGX05FRURFRCxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5wYXNzUm9sZVN0YXRlbWVudC5hZGRSZXNvdXJjZXModGhpcy5fZXhlY3V0aW9uUm9sZS5yb2xlQXJuKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2V4ZWN1dGlvblJvbGU7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGlzIHRhc2sgZGVmaW5pdGlvbiBoYXMgYXQgbGVhc3QgYSBjb250YWluZXIgdGhhdCByZWZlcmVuY2VzIGFcbiAgICogc3BlY2lmaWMgSlNPTiBmaWVsZCBvZiBhIHNlY3JldCBzdG9yZWQgaW4gU2VjcmV0cyBNYW5hZ2VyLlxuICAgKi9cbiAgcHVibGljIGdldCByZWZlcmVuY2VzU2VjcmV0SnNvbkZpZWxkKCk6IGJvb2xlYW4gfCB1bmRlZmluZWQge1xuICAgIGZvciAoY29uc3QgY29udGFpbmVyIG9mIHRoaXMuY29udGFpbmVycykge1xuICAgICAgaWYgKGNvbnRhaW5lci5yZWZlcmVuY2VzU2VjcmV0SnNvbkZpZWxkKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGVzIHRoZSB0YXNrIGRlZmluaXRpb24uXG4gICAqL1xuICBwcml2YXRlIHZhbGlkYXRlVGFza0RlZmluaXRpb24oKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHJldCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICBpZiAoaXNFYzJDb21wYXRpYmxlKHRoaXMuY29tcGF0aWJpbGl0eSkpIHtcbiAgICAgIC8vIEVDMiBtb2RlIHZhbGlkYXRpb25zXG5cbiAgICAgIC8vIENvbnRhaW5lciBzaXplc1xuICAgICAgZm9yIChjb25zdCBjb250YWluZXIgb2YgdGhpcy5jb250YWluZXJzKSB7XG4gICAgICAgIGlmICghY29udGFpbmVyLm1lbW9yeUxpbWl0U3BlY2lmaWVkKSB7XG4gICAgICAgICAgcmV0LnB1c2goYEVDUyBDb250YWluZXIgJHtjb250YWluZXIuY29udGFpbmVyTmFtZX0gbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBvZiAnbWVtb3J5TGltaXRNaUInIG9yICdtZW1vcnlSZXNlcnZhdGlvbk1pQicgc3BlY2lmaWVkYCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBWYWxpZGF0ZSB0aGF0IHRoZXJlIGFyZSBubyBuYW1lZCBwb3J0IG1hcHBpbmcgY29uZmxpY3RzIGZvciBTZXJ2aWNlIENvbm5lY3QuXG4gICAgY29uc3QgcG9ydE1hcHBpbmdOYW1lcyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7IC8vIE1hcCBmcm9tIHBvcnQgbWFwcGluZyBuYW1lIHRvIG1vc3QgcmVjZW50IGNvbnRhaW5lciBpdCBhcHBlYXJzIGluLlxuICAgIHRoaXMuY29udGFpbmVycy5mb3JFYWNoKGNvbnRhaW5lciA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHBtIG9mIGNvbnRhaW5lci5wb3J0TWFwcGluZ3MpIHtcbiAgICAgICAgaWYgKHBtLm5hbWUpIHtcbiAgICAgICAgICBpZiAocG9ydE1hcHBpbmdOYW1lcy5oYXMocG0ubmFtZSkpIHtcbiAgICAgICAgICAgIHJldC5wdXNoKGBQb3J0IG1hcHBpbmcgbmFtZSAnJHtwbS5uYW1lfScgY2Fubm90IGFwcGVhciBpbiBib3RoICcke2NvbnRhaW5lci5jb250YWluZXJOYW1lfScgYW5kICcke3BvcnRNYXBwaW5nTmFtZXMuZ2V0KHBtLm5hbWUpfSdgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcG9ydE1hcHBpbmdOYW1lcy5zZXQocG0ubmFtZSwgY29udGFpbmVyLmNvbnRhaW5lck5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRoZSBleGlzdGluZyBwb3J0IG1hcHBpbmcgZm9yIHRoZSBwcm92aWRlZCBuYW1lLlxuICAgKiBAcGFyYW0gbmFtZTogcG9ydCBtYXBwaW5nIG5hbWVcbiAgICogQHJldHVybnMgUG9ydE1hcHBpbmcgZm9yIHRoZSBwcm92aWRlZCBuYW1lLCBpZiBpdCBleGlzdHMuXG4gICAqL1xuICBwdWJsaWMgZmluZFBvcnRNYXBwaW5nQnlOYW1lKG5hbWU6IHN0cmluZyk6IFBvcnRNYXBwaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBsZXQgcG9ydE1hcHBpbmc7XG5cbiAgICB0aGlzLmNvbnRhaW5lcnMuZm9yRWFjaChjb250YWluZXIgPT4ge1xuICAgICAgY29uc3QgcG0gPSBjb250YWluZXIuZmluZFBvcnRNYXBwaW5nQnlOYW1lKG5hbWUpO1xuICAgICAgaWYgKHBtKSB7XG4gICAgICAgIHBvcnRNYXBwaW5nID0gcG07XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHBvcnRNYXBwaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGNvbnRhaW5lciB0aGF0IG1hdGNoIHRoZSBwcm92aWRlZCBjb250YWluZXJOYW1lLlxuICAgKi9cbiAgcHVibGljIGZpbmRDb250YWluZXIoY29udGFpbmVyTmFtZTogc3RyaW5nKTogQ29udGFpbmVyRGVmaW5pdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuY29udGFpbmVycy5maW5kKGMgPT4gYy5jb250YWluZXJOYW1lID09PSBjb250YWluZXJOYW1lKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IHBhc3NSb2xlU3RhdGVtZW50KCkge1xuICAgIGlmICghdGhpcy5fcGFzc1JvbGVTdGF0ZW1lbnQpIHtcbiAgICAgIHRoaXMuX3Bhc3NSb2xlU3RhdGVtZW50ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIGFjdGlvbnM6IFsnaWFtOlBhc3NSb2xlJ10sXG4gICAgICAgIHJlc291cmNlczogdGhpcy5leGVjdXRpb25Sb2xlID8gW3RoaXMudGFza1JvbGUucm9sZUFybiwgdGhpcy5leGVjdXRpb25Sb2xlLnJvbGVBcm5dIDogW3RoaXMudGFza1JvbGUucm9sZUFybl0sXG4gICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICBTdHJpbmdMaWtlOiB7ICdpYW06UGFzc2VkVG9TZXJ2aWNlJzogJ2Vjcy10YXNrcy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3Bhc3NSb2xlU3RhdGVtZW50O1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJOZXR3b3JrTW9kZShuZXR3b3JrTW9kZTogTmV0d29ya01vZGUpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiAobmV0d29ya01vZGUgPT09IE5ldHdvcmtNb2RlLk5BVCkgPyB1bmRlZmluZWQgOiBuZXR3b3JrTW9kZTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyQ29udGFpbmVycygpIHtcbiAgICAvLyBhZGQgZmlyZWxlbnMgbG9nIHJvdXRlciBjb250YWluZXIgaWYgYW55IGFwcGxpY2F0aW9uIGNvbnRhaW5lciBpcyB1c2luZyBmaXJlbGVucyBsb2cgZHJpdmVyLFxuICAgIC8vIGFsc28gY2hlY2sgaWYgYWxyZWFkeSBjcmVhdGVkIGxvZyByb3V0ZXIgY29udGFpbmVyXG4gICAgZm9yIChjb25zdCBjb250YWluZXIgb2YgdGhpcy5jb250YWluZXJzKSB7XG4gICAgICBpZiAoY29udGFpbmVyLmxvZ0RyaXZlckNvbmZpZyAmJiBjb250YWluZXIubG9nRHJpdmVyQ29uZmlnLmxvZ0RyaXZlciA9PT0gJ2F3c2ZpcmVsZW5zJ1xuICAgICAgICAmJiAhdGhpcy5jb250YWluZXJzLmZpbmQoeCA9PiB4IGluc3RhbmNlb2YgRmlyZWxlbnNMb2dSb3V0ZXIpKSB7XG4gICAgICAgIHRoaXMuYWRkRmlyZWxlbnNMb2dSb3V0ZXIoJ2xvZy1yb3V0ZXInLCB7XG4gICAgICAgICAgaW1hZ2U6IG9idGFpbkRlZmF1bHRGbHVlbnRCaXRFQ1JJbWFnZSh0aGlzLCBjb250YWluZXIubG9nRHJpdmVyQ29uZmlnKSxcbiAgICAgICAgICBmaXJlbGVuc0NvbmZpZzoge1xuICAgICAgICAgICAgdHlwZTogRmlyZWxlbnNMb2dSb3V0ZXJUeXBlLkZMVUVOVEJJVCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxvZ2dpbmc6IG5ldyBBd3NMb2dEcml2ZXIoeyBzdHJlYW1QcmVmaXg6ICdmaXJlbGVucycgfSksXG4gICAgICAgICAgbWVtb3J5UmVzZXJ2YXRpb25NaUI6IDUwLFxuICAgICAgICB9KTtcblxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb250YWluZXJzLm1hcCh4ID0+IHgucmVuZGVyQ29udGFpbmVyRGVmaW5pdGlvbigpKTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tGYXJnYXRlV2luZG93c0Jhc2VkVGFza3NTaXplKGNwdTogc3RyaW5nLCBtZW1vcnk6IHN0cmluZywgcnVudGltZVBsYXRmb3JtOiBSdW50aW1lUGxhdGZvcm0pIHtcbiAgICBpZiAoTnVtYmVyKGNwdSkgPT09IDEwMjQpIHtcbiAgICAgIGlmIChOdW1iZXIobWVtb3J5KSA8IDEwMjQgfHwgTnVtYmVyKG1lbW9yeSkgPiA4MTkyIHx8IChOdW1iZXIobWVtb3J5KSUgMTAyNCAhPT0gMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJZiBwcm92aWRlZCBjcHUgaXMgJHtjcHV9LCB0aGVuIG1lbW9yeU1pQiBtdXN0IGhhdmUgYSBtaW4gb2YgMTAyNCBhbmQgYSBtYXggb2YgODE5MiwgaW4gMTAyNCBpbmNyZW1lbnRzLiBQcm92aWRlZCBtZW1vcnlNaUIgd2FzICR7TnVtYmVyKG1lbW9yeSl9LmApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoTnVtYmVyKGNwdSkgPT09IDIwNDgpIHtcbiAgICAgIGlmIChOdW1iZXIobWVtb3J5KSA8IDQwOTYgfHwgTnVtYmVyKG1lbW9yeSkgPiAxNjM4NCB8fCAoTnVtYmVyKG1lbW9yeSkgJSAxMDI0ICE9PSAwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYElmIHByb3ZpZGVkIGNwdSBpcyAke2NwdX0sIHRoZW4gbWVtb3J5TWlCIG11c3QgaGF2ZSBhIG1pbiBvZiA0MDk2IGFuZCBtYXggb2YgMTYzODQsIGluIDEwMjQgaW5jcmVtZW50cy4gUHJvdmlkZWQgbWVtb3J5TWlCICR7TnVtYmVyKG1lbW9yeSl9LmApO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoTnVtYmVyKGNwdSkgPT09IDQwOTYpIHtcbiAgICAgIGlmIChOdW1iZXIobWVtb3J5KSA8IDgxOTIgfHwgTnVtYmVyKG1lbW9yeSkgPiAzMDcyMCB8fCAoTnVtYmVyKG1lbW9yeSkgJSAxMDI0ICE9PSAwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYElmIHByb3ZpZGVkIGNwdSBpcyAkeyBjcHUgfSwgdGhlbiBtZW1vcnlNaUIgbXVzdCBoYXZlIGEgbWluIG9mIDgxOTIgYW5kIGEgbWF4IG9mIDMwNzIwLCBpbiAxMDI0IGluY3JlbWVudHMuUHJvdmlkZWQgbWVtb3J5TWlCIHdhcyAkeyBOdW1iZXIobWVtb3J5KSB9LmApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYElmIG9wZXJhdGluZ1N5c3RlbUZhbWlseSBpcyAke3J1bnRpbWVQbGF0Zm9ybS5vcGVyYXRpbmdTeXN0ZW1GYW1pbHkhLl9vcGVyYXRpbmdTeXN0ZW1GYW1pbHl9LCB0aGVuIGNwdSBtdXN0IGJlIGluIDEwMjQgKDEgdkNQVSksIDIwNDggKDIgdkNQVSksIG9yIDQwOTYgKDQgdkNQVSkuIFByb3ZpZGVkIHZhbHVlIHdhczogJHtjcHV9YCk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIFRoZSBwb3J0IHJhbmdlIHRvIG9wZW4gdXAgZm9yIGR5bmFtaWMgcG9ydCBtYXBwaW5nXG4gKi9cbmNvbnN0IEVQSEVNRVJBTF9QT1JUX1JBTkdFID0gZWMyLlBvcnQudGNwUmFuZ2UoMzI3NjgsIDY1NTM1KTtcblxuLyoqXG4gKiBUaGUgbmV0d29ya2luZyBtb2RlIHRvIHVzZSBmb3IgdGhlIGNvbnRhaW5lcnMgaW4gdGhlIHRhc2suXG4gKi9cbmV4cG9ydCBlbnVtIE5ldHdvcmtNb2RlIHtcbiAgLyoqXG4gICAqIFRoZSB0YXNrJ3MgY29udGFpbmVycyBkbyBub3QgaGF2ZSBleHRlcm5hbCBjb25uZWN0aXZpdHkgYW5kIHBvcnQgbWFwcGluZ3MgY2FuJ3QgYmUgc3BlY2lmaWVkIGluIHRoZSBjb250YWluZXIgZGVmaW5pdGlvbi5cbiAgICovXG4gIE5PTkUgPSAnbm9uZScsXG5cbiAgLyoqXG4gICAqIFRoZSB0YXNrIHV0aWxpemVzIERvY2tlcidzIGJ1aWx0LWluIHZpcnR1YWwgbmV0d29yayB3aGljaCBydW5zIGluc2lkZSBlYWNoIGNvbnRhaW5lciBpbnN0YW5jZS5cbiAgICovXG4gIEJSSURHRSA9ICdicmlkZ2UnLFxuXG4gIC8qKlxuICAgKiBUaGUgdGFzayBpcyBhbGxvY2F0ZWQgYW4gZWxhc3RpYyBuZXR3b3JrIGludGVyZmFjZS5cbiAgICovXG4gIEFXU19WUEMgPSAnYXdzdnBjJyxcblxuICAvKipcbiAgICogVGhlIHRhc2sgYnlwYXNzZXMgRG9ja2VyJ3MgYnVpbHQtaW4gdmlydHVhbCBuZXR3b3JrIGFuZCBtYXBzIGNvbnRhaW5lciBwb3J0cyBkaXJlY3RseSB0byB0aGUgRUMyIGluc3RhbmNlJ3MgbmV0d29yayBpbnRlcmZhY2UgZGlyZWN0bHkuXG4gICAqXG4gICAqIEluIHRoaXMgbW9kZSwgeW91IGNhbid0IHJ1biBtdWx0aXBsZSBpbnN0YW50aWF0aW9ucyBvZiB0aGUgc2FtZSB0YXNrIG9uIGFcbiAgICogc2luZ2xlIGNvbnRhaW5lciBpbnN0YW5jZSB3aGVuIHBvcnQgbWFwcGluZ3MgYXJlIHVzZWQuXG4gICAqL1xuICBIT1NUID0gJ2hvc3QnLFxuXG4gIC8qKlxuICAgKiBUaGUgdGFzayB1dGlsaXplcyBOQVQgbmV0d29yayBtb2RlIHJlcXVpcmVkIGJ5IFdpbmRvd3MgY29udGFpbmVycy5cbiAgICpcbiAgICogVGhpcyBpcyB0aGUgb25seSBzdXBwb3J0ZWQgbmV0d29yayBtb2RlIGZvciBXaW5kb3dzIGNvbnRhaW5lcnMuIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWVcbiAgICogW1Rhc2sgRGVmaW5pdGlvbiBQYXJhbWV0ZXJzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNTL2xhdGVzdC9kZXZlbG9wZXJndWlkZS90YXNrX2RlZmluaXRpb25fcGFyYW1ldGVycy5odG1sI25ldHdvcmtfbW9kZSkuXG4gICAqL1xuICBOQVQgPSAnbmF0J1xufVxuXG4vKipcbiAqIFRoZSBJUEMgcmVzb3VyY2UgbmFtZXNwYWNlIHRvIHVzZSBmb3IgdGhlIGNvbnRhaW5lcnMgaW4gdGhlIHRhc2suXG4gKi9cbmV4cG9ydCBlbnVtIElwY01vZGUge1xuICAvKipcbiAgICogSWYgbm9uZSBpcyBzcGVjaWZpZWQsIHRoZW4gSVBDIHJlc291cmNlcyB3aXRoaW4gdGhlIGNvbnRhaW5lcnMgb2YgYSB0YXNrIGFyZSBwcml2YXRlIGFuZCBub3RcbiAgICogc2hhcmVkIHdpdGggb3RoZXIgY29udGFpbmVycyBpbiBhIHRhc2sgb3Igb24gdGhlIGNvbnRhaW5lciBpbnN0YW5jZVxuICAgKi9cbiAgTk9ORSA9ICdub25lJyxcblxuICAvKipcbiAgICogSWYgaG9zdCBpcyBzcGVjaWZpZWQsIHRoZW4gYWxsIGNvbnRhaW5lcnMgd2l0aGluIHRoZSB0YXNrcyB0aGF0IHNwZWNpZmllZCB0aGUgaG9zdCBJUEMgbW9kZSBvblxuICAgKiB0aGUgc2FtZSBjb250YWluZXIgaW5zdGFuY2Ugc2hhcmUgdGhlIHNhbWUgSVBDIHJlc291cmNlcyB3aXRoIHRoZSBob3N0IEFtYXpvbiBFQzIgaW5zdGFuY2UuXG4gICAqL1xuICBIT1NUID0gJ2hvc3QnLFxuXG4gIC8qKlxuICAgKiBJZiB0YXNrIGlzIHNwZWNpZmllZCwgYWxsIGNvbnRhaW5lcnMgd2l0aGluIHRoZSBzcGVjaWZpZWQgdGFzayBzaGFyZSB0aGUgc2FtZSBJUEMgcmVzb3VyY2VzLlxuICAgKi9cbiAgVEFTSyA9ICd0YXNrJyxcbn1cblxuLyoqXG4gKiBUaGUgcHJvY2VzcyBuYW1lc3BhY2UgdG8gdXNlIGZvciB0aGUgY29udGFpbmVycyBpbiB0aGUgdGFzay5cbiAqL1xuZXhwb3J0IGVudW0gUGlkTW9kZSB7XG4gIC8qKlxuICAgKiBJZiBob3N0IGlzIHNwZWNpZmllZCwgdGhlbiBhbGwgY29udGFpbmVycyB3aXRoaW4gdGhlIHRhc2tzIHRoYXQgc3BlY2lmaWVkIHRoZSBob3N0IFBJRCBtb2RlXG4gICAqIG9uIHRoZSBzYW1lIGNvbnRhaW5lciBpbnN0YW5jZSBzaGFyZSB0aGUgc2FtZSBwcm9jZXNzIG5hbWVzcGFjZSB3aXRoIHRoZSBob3N0IEFtYXpvbiBFQzIgaW5zdGFuY2UuXG4gICAqL1xuICBIT1NUID0gJ2hvc3QnLFxuXG4gIC8qKlxuICAgKiBJZiB0YXNrIGlzIHNwZWNpZmllZCwgYWxsIGNvbnRhaW5lcnMgd2l0aGluIHRoZSBzcGVjaWZpZWQgdGFzayBzaGFyZSB0aGUgc2FtZSBwcm9jZXNzIG5hbWVzcGFjZS5cbiAgICovXG4gIFRBU0sgPSAndGFzaycsXG59XG5cbi8qKlxuICogRWxhc3RpYyBJbmZlcmVuY2UgQWNjZWxlcmF0b3IuXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtFbGFzdGljIEluZmVyZW5jZSBCYXNpY3NdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lbGFzdGljLWluZmVyZW5jZS9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvYmFzaWNzLmh0bWwpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW5mZXJlbmNlQWNjZWxlcmF0b3Ige1xuICAvKipcbiAgICogVGhlIEVsYXN0aWMgSW5mZXJlbmNlIGFjY2VsZXJhdG9yIGRldmljZSBuYW1lLlxuICAgKiBAZGVmYXVsdCAtIGVtcHR5XG4gICAqL1xuICByZWFkb25seSBkZXZpY2VOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgRWxhc3RpYyBJbmZlcmVuY2UgYWNjZWxlcmF0b3IgdHlwZSB0byB1c2UuIFRoZSBhbGxvd2VkIHZhbHVlcyBhcmU6IGVpYTIubWVkaXVtLCBlaWEyLmxhcmdlIGFuZCBlaWEyLnhsYXJnZS5cbiAgICogQGRlZmF1bHQgLSBlbXB0eVxuICAgKi9cbiAgcmVhZG9ubHkgZGV2aWNlVHlwZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIGRhdGEgdm9sdW1lIHVzZWQgaW4gYSB0YXNrIGRlZmluaXRpb24uXG4gKlxuICogRm9yIHRhc2tzIHRoYXQgdXNlIGEgRG9ja2VyIHZvbHVtZSwgc3BlY2lmeSBhIERvY2tlclZvbHVtZUNvbmZpZ3VyYXRpb24uXG4gKiBGb3IgdGFza3MgdGhhdCB1c2UgYSBiaW5kIG1vdW50IGhvc3Qgdm9sdW1lLCBzcGVjaWZ5IGEgaG9zdCBhbmQgb3B0aW9uYWwgc291cmNlUGF0aC5cbiAqXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtVc2luZyBEYXRhIFZvbHVtZXMgaW4gVGFza3NdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzaW5nX2RhdGFfdm9sdW1lcy5odG1sKS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWb2x1bWUge1xuICAvKipcbiAgICogVGhpcyBwcm9wZXJ0eSBpcyBzcGVjaWZpZWQgd2hlbiB5b3UgYXJlIHVzaW5nIGJpbmQgbW91bnQgaG9zdCB2b2x1bWVzLlxuICAgKlxuICAgKiBCaW5kIG1vdW50IGhvc3Qgdm9sdW1lcyBhcmUgc3VwcG9ydGVkIHdoZW4geW91IGFyZSB1c2luZyBlaXRoZXIgdGhlIEVDMiBvciBGYXJnYXRlIGxhdW5jaCB0eXBlcy5cbiAgICogVGhlIGNvbnRlbnRzIG9mIHRoZSBob3N0IHBhcmFtZXRlciBkZXRlcm1pbmUgd2hldGhlciB5b3VyIGJpbmQgbW91bnQgaG9zdCB2b2x1bWUgcGVyc2lzdHMgb24gdGhlXG4gICAqIGhvc3QgY29udGFpbmVyIGluc3RhbmNlIGFuZCB3aGVyZSBpdCBpcyBzdG9yZWQuIElmIHRoZSBob3N0IHBhcmFtZXRlciBpcyBlbXB0eSwgdGhlbiB0aGUgRG9ja2VyXG4gICAqIGRhZW1vbiBhc3NpZ25zIGEgaG9zdCBwYXRoIGZvciB5b3VyIGRhdGEgdm9sdW1lLiBIb3dldmVyLCB0aGUgZGF0YSBpcyBub3QgZ3VhcmFudGVlZCB0byBwZXJzaXN0XG4gICAqIGFmdGVyIHRoZSBjb250YWluZXJzIGFzc29jaWF0ZWQgd2l0aCBpdCBzdG9wIHJ1bm5pbmcuXG4gICAqL1xuICByZWFkb25seSBob3N0PzogSG9zdDtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHZvbHVtZS5cbiAgICpcbiAgICogVXAgdG8gMjU1IGxldHRlcnMgKHVwcGVyY2FzZSBhbmQgbG93ZXJjYXNlKSwgbnVtYmVycywgYW5kIGh5cGhlbnMgYXJlIGFsbG93ZWQuXG4gICAqIFRoaXMgbmFtZSBpcyByZWZlcmVuY2VkIGluIHRoZSBzb3VyY2VWb2x1bWUgcGFyYW1ldGVyIG9mIGNvbnRhaW5lciBkZWZpbml0aW9uIG1vdW50UG9pbnRzLlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGlzIHByb3BlcnR5IGlzIHNwZWNpZmllZCB3aGVuIHlvdSBhcmUgdXNpbmcgRG9ja2VyIHZvbHVtZXMuXG4gICAqXG4gICAqIERvY2tlciB2b2x1bWVzIGFyZSBvbmx5IHN1cHBvcnRlZCB3aGVuIHlvdSBhcmUgdXNpbmcgdGhlIEVDMiBsYXVuY2ggdHlwZS5cbiAgICogV2luZG93cyBjb250YWluZXJzIG9ubHkgc3VwcG9ydCB0aGUgdXNlIG9mIHRoZSBsb2NhbCBkcml2ZXIuXG4gICAqIFRvIHVzZSBiaW5kIG1vdW50cywgc3BlY2lmeSBhIGhvc3QgaW5zdGVhZC5cbiAgICovXG4gIHJlYWRvbmx5IGRvY2tlclZvbHVtZUNvbmZpZ3VyYXRpb24/OiBEb2NrZXJWb2x1bWVDb25maWd1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGlzIHByb3BlcnR5IGlzIHNwZWNpZmllZCB3aGVuIHlvdSBhcmUgdXNpbmcgQW1hem9uIEVGUy5cbiAgICpcbiAgICogV2hlbiBzcGVjaWZ5aW5nIEFtYXpvbiBFRlMgdm9sdW1lcyBpbiB0YXNrcyB1c2luZyB0aGUgRmFyZ2F0ZSBsYXVuY2ggdHlwZSxcbiAgICogRmFyZ2F0ZSBjcmVhdGVzIGEgc3VwZXJ2aXNvciBjb250YWluZXIgdGhhdCBpcyByZXNwb25zaWJsZSBmb3IgbWFuYWdpbmcgdGhlIEFtYXpvbiBFRlMgdm9sdW1lLlxuICAgKiBUaGUgc3VwZXJ2aXNvciBjb250YWluZXIgdXNlcyBhIHNtYWxsIGFtb3VudCBvZiB0aGUgdGFzaydzIG1lbW9yeS5cbiAgICogVGhlIHN1cGVydmlzb3IgY29udGFpbmVyIGlzIHZpc2libGUgd2hlbiBxdWVyeWluZyB0aGUgdGFzayBtZXRhZGF0YSB2ZXJzaW9uIDQgZW5kcG9pbnQsXG4gICAqIGJ1dCBpcyBub3QgdmlzaWJsZSBpbiBDbG91ZFdhdGNoIENvbnRhaW5lciBJbnNpZ2h0cy5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gRWxhc3RpYyBGaWxlU3lzdGVtIGlzIHNldHVwXG4gICAqL1xuICByZWFkb25seSBlZnNWb2x1bWVDb25maWd1cmF0aW9uPzogRWZzVm9sdW1lQ29uZmlndXJhdGlvbjtcbn1cblxuLyoqXG4gKiBUaGUgZGV0YWlscyBvbiBhIGNvbnRhaW5lciBpbnN0YW5jZSBiaW5kIG1vdW50IGhvc3Qgdm9sdW1lLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEhvc3Qge1xuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSBwYXRoIG9uIHRoZSBob3N0IGNvbnRhaW5lciBpbnN0YW5jZSB0aGF0IGlzIHByZXNlbnRlZCB0byB0aGUgY29udGFpbmVyLlxuICAgKiBJZiB0aGUgc291cmNlUGF0aCB2YWx1ZSBkb2VzIG5vdCBleGlzdCBvbiB0aGUgaG9zdCBjb250YWluZXIgaW5zdGFuY2UsIHRoZSBEb2NrZXIgZGFlbW9uIGNyZWF0ZXMgaXQuXG4gICAqIElmIHRoZSBsb2NhdGlvbiBkb2VzIGV4aXN0LCB0aGUgY29udGVudHMgb2YgdGhlIHNvdXJjZSBwYXRoIGZvbGRlciBhcmUgZXhwb3J0ZWQuXG4gICAqXG4gICAqIFRoaXMgcHJvcGVydHkgaXMgbm90IHN1cHBvcnRlZCBmb3IgdGFza3MgdGhhdCB1c2UgdGhlIEZhcmdhdGUgbGF1bmNoIHR5cGUuXG4gICAqL1xuICByZWFkb25seSBzb3VyY2VQYXRoPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGFuIEVDUyB0YXJnZXQuXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTG9hZEJhbGFuY2VyVGFyZ2V0IHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBjb250YWluZXIuXG4gICAqL1xuICByZWFkb25seSBjb250YWluZXJOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwb3J0IG1hcHBpbmcgb2YgdGhlIHRhcmdldC5cbiAgICovXG4gIHJlYWRvbmx5IHBvcnRNYXBwaW5nOiBQb3J0TWFwcGluZ1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGFuIEVDUyB0YXJnZXQuIFRoZSBwb3J0IG1hcHBpbmcgZm9yIGl0IG11c3QgYWxyZWFkeSBoYXZlIGJlZW4gY3JlYXRlZCB0aHJvdWdoIGFkZFBvcnRNYXBwaW5nKCkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTG9hZEJhbGFuY2VyVGFyZ2V0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgY29udGFpbmVyLlxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcG9ydCBudW1iZXIgb2YgdGhlIGNvbnRhaW5lci4gT25seSBhcHBsaWNhYmxlIHdoZW4gdXNpbmcgYXBwbGljYXRpb24vbmV0d29yayBsb2FkIGJhbGFuY2Vycy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBDb250YWluZXIgcG9ydCBvZiB0aGUgZmlyc3QgYWRkZWQgcG9ydCBtYXBwaW5nLlxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyUG9ydD86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHByb3RvY29sIHVzZWQgZm9yIHRoZSBwb3J0IG1hcHBpbmcuIE9ubHkgYXBwbGljYWJsZSB3aGVuIHVzaW5nIGFwcGxpY2F0aW9uIGxvYWQgYmFsYW5jZXJzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBQcm90b2NvbC5UQ1BcbiAgICovXG4gIHJlYWRvbmx5IHByb3RvY29sPzogUHJvdG9jb2w7XG59XG5cbi8qKlxuICogVGhlIGNvbmZpZ3VyYXRpb24gZm9yIGEgRG9ja2VyIHZvbHVtZS4gRG9ja2VyIHZvbHVtZXMgYXJlIG9ubHkgc3VwcG9ydGVkIHdoZW4geW91IGFyZSB1c2luZyB0aGUgRUMyIGxhdW5jaCB0eXBlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIERvY2tlclZvbHVtZUNvbmZpZ3VyYXRpb24ge1xuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdGhlIERvY2tlciB2b2x1bWUgc2hvdWxkIGJlIGNyZWF0ZWQgaWYgaXQgZG9lcyBub3QgYWxyZWFkeSBleGlzdC5cbiAgICogSWYgdHJ1ZSBpcyBzcGVjaWZpZWQsIHRoZSBEb2NrZXIgdm9sdW1lIHdpbGwgYmUgY3JlYXRlZCBmb3IgeW91LlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgYXV0b3Byb3Zpc2lvbj86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBUaGUgRG9ja2VyIHZvbHVtZSBkcml2ZXIgdG8gdXNlLlxuICAgKi9cbiAgcmVhZG9ubHkgZHJpdmVyOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBIG1hcCBvZiBEb2NrZXIgZHJpdmVyLXNwZWNpZmljIG9wdGlvbnMgcGFzc2VkIHRocm91Z2guXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIG9wdGlvbnNcbiAgICovXG4gIHJlYWRvbmx5IGRyaXZlck9wdHM/OiB7W2tleTogc3RyaW5nXTogc3RyaW5nfTtcbiAgLyoqXG4gICAqIEN1c3RvbSBtZXRhZGF0YSB0byBhZGQgdG8geW91ciBEb2NrZXIgdm9sdW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBsYWJlbHNcbiAgICovXG4gIHJlYWRvbmx5IGxhYmVscz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nOyB9XG4gIC8qKlxuICAgKiBUaGUgc2NvcGUgZm9yIHRoZSBEb2NrZXIgdm9sdW1lIHRoYXQgZGV0ZXJtaW5lcyBpdHMgbGlmZWN5Y2xlLlxuICAgKi9cbiAgcmVhZG9ubHkgc2NvcGU6IFNjb3BlO1xufVxuXG4vKipcbiAqIFRoZSBhdXRob3JpemF0aW9uIGNvbmZpZ3VyYXRpb24gZGV0YWlscyBmb3IgdGhlIEFtYXpvbiBFRlMgZmlsZSBzeXN0ZW0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXV0aG9yaXphdGlvbkNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgYWNjZXNzIHBvaW50IElEIHRvIHVzZS5cbiAgICogSWYgYW4gYWNjZXNzIHBvaW50IGlzIHNwZWNpZmllZCwgdGhlIHJvb3QgZGlyZWN0b3J5IHZhbHVlIHdpbGwgYmVcbiAgICogcmVsYXRpdmUgdG8gdGhlIGRpcmVjdG9yeSBzZXQgZm9yIHRoZSBhY2Nlc3MgcG9pbnQuXG4gICAqIElmIHNwZWNpZmllZCwgdHJhbnNpdCBlbmNyeXB0aW9uIG11c3QgYmUgZW5hYmxlZCBpbiB0aGUgRUZTVm9sdW1lQ29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gaWRcbiAgICovXG4gIHJlYWRvbmx5IGFjY2Vzc1BvaW50SWQ/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0byB1c2UgdGhlIEFtYXpvbiBFQ1MgdGFzayBJQU0gcm9sZSBkZWZpbmVkXG4gICAqIGluIGEgdGFzayBkZWZpbml0aW9uIHdoZW4gbW91bnRpbmcgdGhlIEFtYXpvbiBFRlMgZmlsZSBzeXN0ZW0uXG4gICAqIElmIGVuYWJsZWQsIHRyYW5zaXQgZW5jcnlwdGlvbiBtdXN0IGJlIGVuYWJsZWQgaW4gdGhlIEVGU1ZvbHVtZUNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIFZhbGlkIHZhbHVlczogRU5BQkxFRCB8IERJU0FCTEVEXG4gICAqXG4gICAqIEBkZWZhdWx0IElmIHRoaXMgcGFyYW1ldGVyIGlzIG9taXR0ZWQsIHRoZSBkZWZhdWx0IHZhbHVlIG9mIERJU0FCTEVEIGlzIHVzZWQuXG4gICAqL1xuICByZWFkb25seSBpYW0/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIGNvbmZpZ3VyYXRpb24gZm9yIGFuIEVsYXN0aWMgRmlsZVN5c3RlbSB2b2x1bWUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWZzVm9sdW1lQ29uZmlndXJhdGlvbiB7XG4gIC8qKlxuICAgKiBUaGUgQW1hem9uIEVGUyBmaWxlIHN5c3RlbSBJRCB0byB1c2UuXG4gICAqL1xuICByZWFkb25seSBmaWxlU3lzdGVtSWQ6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBkaXJlY3Rvcnkgd2l0aGluIHRoZSBBbWF6b24gRUZTIGZpbGUgc3lzdGVtIHRvIG1vdW50IGFzIHRoZSByb290IGRpcmVjdG9yeSBpbnNpZGUgdGhlIGhvc3QuXG4gICAqIFNwZWNpZnlpbmcgLyB3aWxsIGhhdmUgdGhlIHNhbWUgZWZmZWN0IGFzIG9taXR0aW5nIHRoaXMgcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCBUaGUgcm9vdCBvZiB0aGUgQW1hem9uIEVGUyB2b2x1bWVcbiAgICovXG4gIHJlYWRvbmx5IHJvb3REaXJlY3Rvcnk/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0byBlbmFibGUgZW5jcnlwdGlvbiBmb3IgQW1hem9uIEVGUyBkYXRhIGluIHRyYW5zaXQgYmV0d2VlblxuICAgKiB0aGUgQW1hem9uIEVDUyBob3N0IGFuZCB0aGUgQW1hem9uIEVGUyBzZXJ2ZXIuXG4gICAqIFRyYW5zaXQgZW5jcnlwdGlvbiBtdXN0IGJlIGVuYWJsZWQgaWYgQW1hem9uIEVGUyBJQU0gYXV0aG9yaXphdGlvbiBpcyB1c2VkLlxuICAgKlxuICAgKiBWYWxpZCB2YWx1ZXM6IEVOQUJMRUQgfCBESVNBQkxFRFxuICAgKlxuICAgKiBAZGVmYXVsdCBESVNBQkxFRFxuICAgKi9cbiAgcmVhZG9ubHkgdHJhbnNpdEVuY3J5cHRpb24/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgcG9ydCB0byB1c2Ugd2hlbiBzZW5kaW5nIGVuY3J5cHRlZCBkYXRhIGJldHdlZW5cbiAgICogdGhlIEFtYXpvbiBFQ1MgaG9zdCBhbmQgdGhlIEFtYXpvbiBFRlMgc2VydmVyLiBFRlMgbW91bnQgaGVscGVyIHVzZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IFBvcnQgc2VsZWN0aW9uIHN0cmF0ZWd5IHRoYXQgdGhlIEFtYXpvbiBFRlMgbW91bnQgaGVscGVyIHVzZXMuXG4gICAqL1xuICByZWFkb25seSB0cmFuc2l0RW5jcnlwdGlvblBvcnQ/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBUaGUgYXV0aG9yaXphdGlvbiBjb25maWd1cmF0aW9uIGRldGFpbHMgZm9yIHRoZSBBbWF6b24gRUZTIGZpbGUgc3lzdGVtLlxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgYXV0aG9yaXphdGlvbkNvbmZpZz86IEF1dGhvcml6YXRpb25Db25maWc7XG59XG5cbi8qKlxuICogVGhlIHNjb3BlIGZvciB0aGUgRG9ja2VyIHZvbHVtZSB0aGF0IGRldGVybWluZXMgaXRzIGxpZmVjeWNsZS5cbiAqIERvY2tlciB2b2x1bWVzIHRoYXQgYXJlIHNjb3BlZCB0byBhIHRhc2sgYXJlIGF1dG9tYXRpY2FsbHkgcHJvdmlzaW9uZWQgd2hlbiB0aGUgdGFzayBzdGFydHMgYW5kIGRlc3Ryb3llZCB3aGVuIHRoZSB0YXNrIHN0b3BzLlxuICogRG9ja2VyIHZvbHVtZXMgdGhhdCBhcmUgc2NvcGVkIGFzIHNoYXJlZCBwZXJzaXN0IGFmdGVyIHRoZSB0YXNrIHN0b3BzLlxuICovXG5leHBvcnQgZW51bSBTY29wZSB7XG4gIC8qKlxuICAgKiBEb2NrZXIgdm9sdW1lcyB0aGF0IGFyZSBzY29wZWQgdG8gYSB0YXNrIGFyZSBhdXRvbWF0aWNhbGx5IHByb3Zpc2lvbmVkIHdoZW4gdGhlIHRhc2sgc3RhcnRzIGFuZCBkZXN0cm95ZWQgd2hlbiB0aGUgdGFzayBzdG9wcy5cbiAgICovXG4gIFRBU0sgPSAndGFzaycsXG5cbiAgLyoqXG4gICAqIERvY2tlciB2b2x1bWVzIHRoYXQgYXJlIHNjb3BlZCBhcyBzaGFyZWQgcGVyc2lzdCBhZnRlciB0aGUgdGFzayBzdG9wcy5cbiAgICovXG4gIFNIQVJFRCA9ICdzaGFyZWQnXG59XG5cbi8qKlxuICogVGhlIHRhc2sgbGF1bmNoIHR5cGUgY29tcGF0aWJpbGl0eSByZXF1aXJlbWVudC5cbiAqL1xuZXhwb3J0IGVudW0gQ29tcGF0aWJpbGl0eSB7XG4gIC8qKlxuICAgKiBUaGUgdGFzayBzaG91bGQgc3BlY2lmeSB0aGUgRUMyIGxhdW5jaCB0eXBlLlxuICAgKi9cbiAgRUMyLFxuXG4gIC8qKlxuICAgKiBUaGUgdGFzayBzaG91bGQgc3BlY2lmeSB0aGUgRmFyZ2F0ZSBsYXVuY2ggdHlwZS5cbiAgICovXG4gIEZBUkdBVEUsXG5cbiAgLyoqXG4gICAqIFRoZSB0YXNrIGNhbiBzcGVjaWZ5IGVpdGhlciB0aGUgRUMyIG9yIEZhcmdhdGUgbGF1bmNoIHR5cGVzLlxuICAgKi9cbiAgRUMyX0FORF9GQVJHQVRFLFxuXG4gIC8qKlxuICAgKiBUaGUgdGFzayBzaG91bGQgc3BlY2lmeSB0aGUgRXh0ZXJuYWwgbGF1bmNoIHR5cGUuXG4gICAqL1xuICBFWFRFUk5BTFxufVxuXG4vKipcbiAqIEFuIGV4dGVuc2lvbiBmb3IgVGFzayBEZWZpbml0aW9uc1xuICpcbiAqIENsYXNzZXMgdGhhdCB3YW50IHRvIG1ha2UgY2hhbmdlcyB0byBhIFRhc2tEZWZpbml0aW9uIChzdWNoIGFzXG4gKiBhZGRpbmcgaGVscGVyIGNvbnRhaW5lcnMpIGNhbiBpbXBsZW1lbnQgdGhpcyBpbnRlcmZhY2UsIGFuZCBjYW5cbiAqIHRoZW4gYmUgXCJhZGRlZFwiIHRvIGEgVGFza0RlZmluaXRpb24gbGlrZSBzbzpcbiAqXG4gKiAgICB0YXNrRGVmaW5pdGlvbi5hZGRFeHRlbnNpb24obmV3IE15RXh0ZW5zaW9uKFwic29tZV9wYXJhbWV0ZXJcIikpO1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElUYXNrRGVmaW5pdGlvbkV4dGVuc2lvbiB7XG4gIC8qKlxuICAgKiBBcHBseSB0aGUgZXh0ZW5zaW9uIHRvIHRoZSBnaXZlbiBUYXNrRGVmaW5pdGlvblxuICAgKlxuICAgKiBAcGFyYW0gdGFza0RlZmluaXRpb24gW2Rpc2FibGUtYXdzbGludDpyZWYtdmlhLWludGVyZmFjZV1cbiAgICovXG4gIGV4dGVuZCh0YXNrRGVmaW5pdGlvbjogVGFza0RlZmluaXRpb24pOiB2b2lkO1xufVxuXG4vKipcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBnaXZlbiB0YXNrIGRlZmluaXRpb24gY2FuIGJlIHJ1biBvbiBhbiBFQzIgY2x1c3RlclxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNFYzJDb21wYXRpYmxlKGNvbXBhdGliaWxpdHk6IENvbXBhdGliaWxpdHkpOiBib29sZWFuIHtcbiAgcmV0dXJuIFtDb21wYXRpYmlsaXR5LkVDMiwgQ29tcGF0aWJpbGl0eS5FQzJfQU5EX0ZBUkdBVEVdLmluY2x1ZGVzKGNvbXBhdGliaWxpdHkpO1xufVxuXG4vKipcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBnaXZlbiB0YXNrIGRlZmluaXRpb24gY2FuIGJlIHJ1biBvbiBhIEZhcmdhdGUgY2x1c3RlclxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGYXJnYXRlQ29tcGF0aWJsZShjb21wYXRpYmlsaXR5OiBDb21wYXRpYmlsaXR5KTogYm9vbGVhbiB7XG4gIHJldHVybiBbQ29tcGF0aWJpbGl0eS5GQVJHQVRFLCBDb21wYXRpYmlsaXR5LkVDMl9BTkRfRkFSR0FURV0uaW5jbHVkZXMoY29tcGF0aWJpbGl0eSk7XG59XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIGdpdmVuIHRhc2sgZGVmaW5pdGlvbiBjYW4gYmUgcnVuIG9uIGEgRUNTIEFueXdoZXJlIGNsdXN0ZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRXh0ZXJuYWxDb21wYXRpYmxlKGNvbXBhdGliaWxpdHk6IENvbXBhdGliaWxpdHkpOiBib29sZWFuIHtcbiAgcmV0dXJuIFtDb21wYXRpYmlsaXR5LkVYVEVSTkFMXS5pbmNsdWRlcyhjb21wYXRpYmlsaXR5KTtcbn1cbiJdfQ==