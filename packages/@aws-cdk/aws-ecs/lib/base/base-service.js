"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropagatedTagSource = exports.DeploymentControllerType = exports.LaunchType = exports.BaseService = exports.ListenerConfig = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const appscaling = require("@aws-cdk/aws-applicationautoscaling");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const ec2 = require("@aws-cdk/aws-ec2");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const iam = require("@aws-cdk/aws-iam");
const cloudmap = require("@aws-cdk/aws-servicediscovery");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const scalable_task_count_1 = require("./scalable-task-count");
const task_definition_1 = require("../base/task-definition");
const cluster_1 = require("../cluster");
const ecs_generated_1 = require("../ecs.generated");
/**
 * Base class for configuring listener when registering targets.
 */
class ListenerConfig {
    /**
     * Create a config for adding target group to ALB listener.
     */
    static applicationListener(listener, props) {
        return new ApplicationListenerConfig(listener, props);
    }
    /**
     * Create a config for adding target group to NLB listener.
     */
    static networkListener(listener, props) {
        return new NetworkListenerConfig(listener, props);
    }
}
exports.ListenerConfig = ListenerConfig;
_a = JSII_RTTI_SYMBOL_1;
ListenerConfig[_a] = { fqn: "@aws-cdk/aws-ecs.ListenerConfig", version: "0.0.0" };
/**
 * Class for configuring application load balancer listener when registering targets.
 */
class ApplicationListenerConfig extends ListenerConfig {
    constructor(listener, props) {
        super();
        this.listener = listener;
        this.props = props;
    }
    /**
     * Create and attach a target group to listener.
     */
    addTargets(id, target, service) {
        const props = this.props || {};
        const protocol = props.protocol;
        const port = props.port ?? (protocol === elbv2.ApplicationProtocol.HTTPS ? 443 : 80);
        this.listener.addTargets(id, {
            ...props,
            targets: [
                service.loadBalancerTarget({
                    ...target,
                }),
            ],
            port,
        });
    }
}
/**
 * Class for configuring network load balancer listener when registering targets.
 */
class NetworkListenerConfig extends ListenerConfig {
    constructor(listener, props) {
        super();
        this.listener = listener;
        this.props = props;
    }
    /**
     * Create and attach a target group to listener.
     */
    addTargets(id, target, service) {
        const port = this.props?.port ?? 80;
        this.listener.addTargets(id, {
            ...this.props,
            targets: [
                service.loadBalancerTarget({
                    ...target,
                }),
            ],
            port,
        });
    }
}
/**
 * The base class for Ec2Service and FargateService services.
 */
class BaseService extends core_1.Resource {
    /**
     * Constructs a new instance of the BaseService class.
     */
    constructor(scope, id, props, additionalProps, taskDefinition) {
        super(scope, id, {
            physicalName: props.serviceName,
        });
        /**
         * The security groups which manage the allowed network traffic for the service.
         */
        this.connections = new ec2.Connections();
        /**
         * A list of Elastic Load Balancing load balancer objects, containing the load balancer name, the container
         * name (as it appears in a container definition), and the container port to access from the load balancer.
         */
        this.loadBalancers = new Array();
        /**
         * The details of the service discovery registries to assign to this service.
         * For more information, see Service Discovery.
         */
        this.serviceRegistries = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_BaseServiceProps(props);
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_TaskDefinition(taskDefinition);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BaseService);
            }
            throw error;
        }
        if (props.propagateTags && props.propagateTaskTagsFrom) {
            throw new Error('You can only specify either propagateTags or propagateTaskTagsFrom. Alternatively, you can leave both blank');
        }
        this.taskDefinition = taskDefinition;
        // launchType will set to undefined if using external DeploymentController or capacityProviderStrategies
        const launchType = props.deploymentController?.type === DeploymentControllerType.EXTERNAL ||
            props.capacityProviderStrategies !== undefined ?
            undefined : props.launchType;
        const propagateTagsFromSource = props.propagateTaskTagsFrom ?? props.propagateTags ?? PropagatedTagSource.NONE;
        const deploymentController = this.getDeploymentController(props);
        this.resource = new ecs_generated_1.CfnService(this, 'Service', {
            desiredCount: props.desiredCount,
            serviceName: this.physicalName,
            loadBalancers: core_1.Lazy.any({ produce: () => this.loadBalancers }, { omitEmptyArray: true }),
            deploymentConfiguration: {
                maximumPercent: props.maxHealthyPercent || 200,
                minimumHealthyPercent: props.minHealthyPercent === undefined ? 50 : props.minHealthyPercent,
                deploymentCircuitBreaker: props.circuitBreaker ? {
                    enable: true,
                    rollback: props.circuitBreaker.rollback ?? false,
                } : undefined,
            },
            propagateTags: propagateTagsFromSource === PropagatedTagSource.NONE ? undefined : props.propagateTags,
            enableEcsManagedTags: props.enableECSManagedTags ?? false,
            deploymentController: deploymentController,
            launchType: launchType,
            enableExecuteCommand: props.enableExecuteCommand,
            capacityProviderStrategy: props.capacityProviderStrategies,
            healthCheckGracePeriodSeconds: this.evaluateHealthGracePeriod(props.healthCheckGracePeriod),
            /* role: never specified, supplanted by Service Linked Role */
            networkConfiguration: core_1.Lazy.any({ produce: () => this.networkConfiguration }, { omitEmptyArray: true }),
            serviceRegistries: core_1.Lazy.any({ produce: () => this.serviceRegistries }, { omitEmptyArray: true }),
            serviceConnectConfiguration: core_1.Lazy.any({ produce: () => this._serviceConnectConfig }, { omitEmptyArray: true }),
            ...additionalProps,
        });
        if (props.deploymentController?.type === DeploymentControllerType.EXTERNAL) {
            core_1.Annotations.of(this).addWarning('taskDefinition and launchType are blanked out when using external deployment controller.');
        }
        if (props.circuitBreaker
            && deploymentController
            && deploymentController.type !== DeploymentControllerType.ECS) {
            core_1.Annotations.of(this).addError('Deployment circuit breaker requires the ECS deployment controller.');
        }
        if (props.deploymentController?.type === DeploymentControllerType.CODE_DEPLOY) {
            // Strip the revision ID from the service's task definition property to
            // prevent new task def revisions in the stack from triggering updates
            // to the stack's ECS service resource
            this.resource.taskDefinition = taskDefinition.family;
            this.node.addDependency(taskDefinition);
        }
        this.serviceArn = this.getResourceArnAttribute(this.resource.ref, {
            service: 'ecs',
            resource: 'service',
            resourceName: `${props.cluster.clusterName}/${this.physicalName}`,
        });
        this.serviceName = this.getResourceNameAttribute(this.resource.attrName);
        this.cluster = props.cluster;
        if (props.cloudMapOptions) {
            this.enableCloudMap(props.cloudMapOptions);
        }
        if (props.serviceConnectConfiguration) {
            this.enableServiceConnect(props.serviceConnectConfiguration);
        }
        if (props.enableExecuteCommand) {
            this.enableExecuteCommand();
            const logging = this.cluster.executeCommandConfiguration?.logging ?? cluster_1.ExecuteCommandLogging.DEFAULT;
            if (this.cluster.executeCommandConfiguration?.kmsKey) {
                this.enableExecuteCommandEncryption(logging);
            }
            if (logging !== cluster_1.ExecuteCommandLogging.NONE) {
                this.executeCommandLogConfiguration();
            }
        }
        this.node.defaultChild = this.resource;
    }
    /**
     * Import an existing ECS/Fargate Service using the service cluster format.
     * The format is the "new" format "arn:aws:ecs:region:aws_account_id:service/cluster-name/service-name".
     * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-account-settings.html#ecs-resource-ids
     */
    static fromServiceArnWithCluster(scope, id, serviceArn) {
        const stack = core_1.Stack.of(scope);
        const arn = stack.splitArn(serviceArn, core_1.ArnFormat.SLASH_RESOURCE_NAME);
        const resourceName = arn.resourceName;
        if (!resourceName) {
            throw new Error('Missing resource Name from service ARN: ${serviceArn}');
        }
        const resourceNameParts = resourceName.split('/');
        if (resourceNameParts.length !== 2) {
            throw new Error(`resource name ${resourceName} from service ARN: ${serviceArn} is not using the ARN cluster format`);
        }
        const clusterName = resourceNameParts[0];
        const serviceName = resourceNameParts[1];
        const clusterArn = core_1.Stack.of(scope).formatArn({
            partition: arn.partition,
            region: arn.region,
            account: arn.account,
            service: 'ecs',
            resource: 'cluster',
            resourceName: clusterName,
        });
        const cluster = cluster_1.Cluster.fromClusterArn(scope, `${id}Cluster`, clusterArn);
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.serviceArn = serviceArn;
                this.serviceName = serviceName;
                this.cluster = cluster;
            }
        }
        return new Import(scope, id, {
            environmentFromArn: serviceArn,
        });
    }
    /**   * Enable Service Connect
     */
    enableServiceConnect(config) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ServiceConnectProps(config);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.enableServiceConnect);
            }
            throw error;
        }
        if (this._serviceConnectConfig) {
            throw new Error('Service connect configuration cannot be specified more than once.');
        }
        this.validateServiceConnectConfiguration(config);
        let cfg = config || {};
        /**
         * Namespace already exists as validated in validateServiceConnectConfiguration.
         * Resolve which namespace to use by picking:
         * 1. The namespace defined in service connect config.
         * 2. The namespace defined in the cluster's defaultCloudMapNamespace property.
        */
        let namespace;
        if (this.cluster.defaultCloudMapNamespace) {
            namespace = this.cluster.defaultCloudMapNamespace.namespaceName;
        }
        if (cfg.namespace) {
            namespace = cfg.namespace;
        }
        /**
         * Map services to CFN property types. This block manages:
         * 1. Finding the correct port.
         * 2. Client alias enumeration
         */
        const services = cfg.services?.map(svc => {
            const containerPort = this.taskDefinition.findPortMappingByName(svc.portMappingName)?.containerPort;
            if (!containerPort) {
                throw new Error(`Port mapping with name ${svc.portMappingName} does not exist.`);
            }
            const alias = {
                port: svc.port || containerPort,
                dnsName: svc.dnsName,
            };
            return {
                portName: svc.portMappingName,
                discoveryName: svc.discoveryName,
                ingressPortOverride: svc.ingressPortOverride,
                clientAliases: [alias],
            };
        });
        let logConfig;
        if (cfg.logDriver && this.taskDefinition.defaultContainer) {
            // Default container existence is validated in validateServiceConnectConfiguration.
            // We only need the default container so that bind() can get the task definition from the container definition.
            logConfig = cfg.logDriver.bind(this, this.taskDefinition.defaultContainer);
        }
        this._serviceConnectConfig = {
            enabled: true,
            logConfiguration: logConfig,
            namespace: namespace,
            services: services,
        };
    }
    ;
    /**
     * Validate Service Connect Configuration
     */
    validateServiceConnectConfiguration(config) {
        if (!this.taskDefinition.defaultContainer) {
            throw new Error('Task definition must have at least one container to enable service connect.');
        }
        // Check the implicit enable case; when config isn't specified or namespace isn't specified, we need to check that there is a namespace on the cluster.
        if ((!config || !config.namespace) && !this.cluster.defaultCloudMapNamespace) {
            throw new Error('Namespace must be defined either in serviceConnectConfig or cluster.defaultCloudMapNamespace');
        }
        // When config isn't specified, return.
        if (!config) {
            return;
        }
        if (!config.services) {
            return;
        }
        let portNames = new Map();
        config.services.forEach(serviceConnectService => {
            // port must exist on the task definition
            if (!this.taskDefinition.findPortMappingByName(serviceConnectService.portMappingName)) {
                throw new Error(`Port Mapping '${serviceConnectService.portMappingName}' does not exist on the task definition.`);
            }
            ;
            // Check that no two service connect services use the same discovery name.
            const discoveryName = serviceConnectService.discoveryName || serviceConnectService.portMappingName;
            if (portNames.get(serviceConnectService.portMappingName)?.includes(discoveryName)) {
                throw new Error(`Cannot create multiple services with the discoveryName '${discoveryName}'.`);
            }
            let currentDiscoveries = portNames.get(serviceConnectService.portMappingName);
            if (!currentDiscoveries) {
                portNames.set(serviceConnectService.portMappingName, [discoveryName]);
            }
            else {
                currentDiscoveries.push(discoveryName);
                portNames.set(serviceConnectService.portMappingName, currentDiscoveries);
            }
            // IngressPortOverride should be within the valid port range if it exists.
            if (serviceConnectService.ingressPortOverride && !this.isValidPort(serviceConnectService.ingressPortOverride)) {
                throw new Error(`ingressPortOverride ${serviceConnectService.ingressPortOverride} is not valid.`);
            }
            // clientAlias.port should be within the valid port range
            if (serviceConnectService.port &&
                !this.isValidPort(serviceConnectService.port)) {
                throw new Error(`Client Alias port ${serviceConnectService.port} is not valid.`);
            }
        });
    }
    /**
     * Determines if a port is valid
     *
     * @param port: The port number
     * @returns boolean whether the port is valid
     */
    isValidPort(port) {
        return !!(port && Number.isInteger(port) && port >= BaseService.MIN_PORT && port <= BaseService.MAX_PORT);
    }
    /**
     * The CloudMap service created for this service, if any.
     */
    get cloudMapService() {
        return this.cloudmapService;
    }
    getDeploymentController(props) {
        if (props.deploymentController) {
            // The customer is always right
            return props.deploymentController;
        }
        const disableCircuitBreakerEcsDeploymentControllerFeatureFlag = core_1.FeatureFlags.of(this).isEnabled(cxapi.ECS_DISABLE_EXPLICIT_DEPLOYMENT_CONTROLLER_FOR_CIRCUIT_BREAKER);
        if (!disableCircuitBreakerEcsDeploymentControllerFeatureFlag && props.circuitBreaker) {
            // This is undesirable behavior (the controller is implicitly ECS anyway when left
            // undefined, so specifying it is not necessary but DOES trigger a CFN replacement)
            // but we leave it in for backwards compat.
            return {
                type: DeploymentControllerType.ECS,
            };
        }
        return undefined;
    }
    executeCommandLogConfiguration() {
        const logConfiguration = this.cluster.executeCommandConfiguration?.logConfiguration;
        this.taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
            actions: [
                'logs:DescribeLogGroups',
            ],
            resources: ['*'],
        }));
        const logGroupArn = logConfiguration?.cloudWatchLogGroup ? `arn:${this.stack.partition}:logs:${this.env.region}:${this.env.account}:log-group:${logConfiguration.cloudWatchLogGroup.logGroupName}:*` : '*';
        this.taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
            actions: [
                'logs:CreateLogStream',
                'logs:DescribeLogStreams',
                'logs:PutLogEvents',
            ],
            resources: [logGroupArn],
        }));
        if (logConfiguration?.s3Bucket?.bucketName) {
            this.taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
                actions: [
                    's3:GetBucketLocation',
                ],
                resources: ['*'],
            }));
            this.taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
                actions: [
                    's3:PutObject',
                ],
                resources: [`arn:${this.stack.partition}:s3:::${logConfiguration.s3Bucket.bucketName}/*`],
            }));
            if (logConfiguration.s3EncryptionEnabled) {
                this.taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
                    actions: [
                        's3:GetEncryptionConfiguration',
                    ],
                    resources: [`arn:${this.stack.partition}:s3:::${logConfiguration.s3Bucket.bucketName}`],
                }));
            }
        }
    }
    enableExecuteCommandEncryption(logging) {
        this.taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
            actions: [
                'kms:Decrypt',
                'kms:GenerateDataKey',
            ],
            resources: [`${this.cluster.executeCommandConfiguration?.kmsKey?.keyArn}`],
        }));
        this.cluster.executeCommandConfiguration?.kmsKey?.addToResourcePolicy(new iam.PolicyStatement({
            actions: [
                'kms:*',
            ],
            resources: ['*'],
            principals: [new iam.ArnPrincipal(`arn:${this.stack.partition}:iam::${this.env.account}:root`)],
        }));
        if (logging === cluster_1.ExecuteCommandLogging.DEFAULT || this.cluster.executeCommandConfiguration?.logConfiguration?.cloudWatchEncryptionEnabled) {
            this.cluster.executeCommandConfiguration?.kmsKey?.addToResourcePolicy(new iam.PolicyStatement({
                actions: [
                    'kms:Encrypt*',
                    'kms:Decrypt*',
                    'kms:ReEncrypt*',
                    'kms:GenerateDataKey*',
                    'kms:Describe*',
                ],
                resources: ['*'],
                principals: [new iam.ServicePrincipal(`logs.${this.env.region}.amazonaws.com`)],
                conditions: {
                    ArnLike: { 'kms:EncryptionContext:aws:logs:arn': `arn:${this.stack.partition}:logs:${this.env.region}:${this.env.account}:*` },
                },
            }));
        }
    }
    /**
     * This method is called to attach this service to an Application Load Balancer.
     *
     * Don't call this function directly. Instead, call `listener.addTargets()`
     * to add this service to a load balancer.
     */
    attachToApplicationTargetGroup(targetGroup) {
        return this.defaultLoadBalancerTarget.attachToApplicationTargetGroup(targetGroup);
    }
    /**
     * Registers the service as a target of a Classic Load Balancer (CLB).
     *
     * Don't call this. Call `loadBalancer.addTarget()` instead.
     */
    attachToClassicLB(loadBalancer) {
        return this.defaultLoadBalancerTarget.attachToClassicLB(loadBalancer);
    }
    /**
     * Return a load balancing target for a specific container and port.
     *
     * Use this function to create a load balancer target if you want to load balance to
     * another container than the first essential container or the first mapped port on
     * the container.
     *
     * Use the return value of this function where you would normally use a load balancer
     * target, instead of the `Service` object itself.
     *
     * @example
     *
     * declare const listener: elbv2.ApplicationListener;
     * declare const service: ecs.BaseService;
     * listener.addTargets('ECS', {
     *   port: 80,
     *   targets: [service.loadBalancerTarget({
     *     containerName: 'MyContainer',
     *     containerPort: 1234,
     *   })],
     * });
     */
    loadBalancerTarget(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_LoadBalancerTargetOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.loadBalancerTarget);
            }
            throw error;
        }
        const self = this;
        const target = this.taskDefinition._validateTarget(options);
        const connections = self.connections;
        return {
            attachToApplicationTargetGroup(targetGroup) {
                targetGroup.registerConnectable(self, self.taskDefinition._portRangeFromPortMapping(target.portMapping));
                return self.attachToELBv2(targetGroup, target.containerName, target.portMapping.containerPort);
            },
            attachToNetworkTargetGroup(targetGroup) {
                return self.attachToELBv2(targetGroup, target.containerName, target.portMapping.containerPort);
            },
            connections,
            attachToClassicLB(loadBalancer) {
                return self.attachToELB(loadBalancer, target.containerName, target.portMapping.containerPort);
            },
        };
    }
    /**
     * Use this function to create all load balancer targets to be registered in this service, add them to
     * target groups, and attach target groups to listeners accordingly.
     *
     * Alternatively, you can use `listener.addTargets()` to create targets and add them to target groups.
     *
     * @example
     *
     * declare const listener: elbv2.ApplicationListener;
     * declare const service: ecs.BaseService;
     * service.registerLoadBalancerTargets(
     *   {
     *     containerName: 'web',
     *     containerPort: 80,
     *     newTargetGroupId: 'ECS',
     *     listener: ecs.ListenerConfig.applicationListener(listener, {
     *       protocol: elbv2.ApplicationProtocol.HTTPS
     *     }),
     *   },
     * )
     */
    registerLoadBalancerTargets(...targets) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_EcsTarget(targets);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.registerLoadBalancerTargets);
            }
            throw error;
        }
        for (const target of targets) {
            target.listener.addTargets(target.newTargetGroupId, {
                containerName: target.containerName,
                containerPort: target.containerPort,
                protocol: target.protocol,
            }, this);
        }
    }
    /**
     * This method is called to attach this service to a Network Load Balancer.
     *
     * Don't call this function directly. Instead, call `listener.addTargets()`
     * to add this service to a load balancer.
     */
    attachToNetworkTargetGroup(targetGroup) {
        return this.defaultLoadBalancerTarget.attachToNetworkTargetGroup(targetGroup);
    }
    /**
     * An attribute representing the minimum and maximum task count for an AutoScalingGroup.
     */
    autoScaleTaskCount(props) {
        if (this.scalableTaskCount) {
            throw new Error('AutoScaling of task count already enabled for this service');
        }
        return this.scalableTaskCount = new scalable_task_count_1.ScalableTaskCount(this, 'TaskCount', {
            serviceNamespace: appscaling.ServiceNamespace.ECS,
            resourceId: `service/${this.cluster.clusterName}/${this.serviceName}`,
            dimension: 'ecs:service:DesiredCount',
            role: this.makeAutoScalingRole(),
            ...props,
        });
    }
    /**
     * Enable CloudMap service discovery for the service
     *
     * @returns The created CloudMap service
     */
    enableCloudMap(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_CloudMapOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.enableCloudMap);
            }
            throw error;
        }
        const sdNamespace = options.cloudMapNamespace ?? this.cluster.defaultCloudMapNamespace;
        if (sdNamespace === undefined) {
            throw new Error('Cannot enable service discovery if a Cloudmap Namespace has not been created in the cluster.');
        }
        if (sdNamespace.type === cloudmap.NamespaceType.HTTP) {
            throw new Error('Cannot enable DNS service discovery for HTTP Cloudmap Namespace.');
        }
        // Determine DNS type based on network mode
        const networkMode = this.taskDefinition.networkMode;
        if (networkMode === task_definition_1.NetworkMode.NONE) {
            throw new Error('Cannot use a service discovery if NetworkMode is None. Use Bridge, Host or AwsVpc instead.');
        }
        // Bridge or host network mode requires SRV records
        let dnsRecordType = options.dnsRecordType;
        if (networkMode === task_definition_1.NetworkMode.BRIDGE || networkMode === task_definition_1.NetworkMode.HOST) {
            if (dnsRecordType === undefined) {
                dnsRecordType = cloudmap.DnsRecordType.SRV;
            }
            if (dnsRecordType !== cloudmap.DnsRecordType.SRV) {
                throw new Error('SRV records must be used when network mode is Bridge or Host.');
            }
        }
        // Default DNS record type for AwsVpc network mode is A Records
        if (networkMode === task_definition_1.NetworkMode.AWS_VPC) {
            if (dnsRecordType === undefined) {
                dnsRecordType = cloudmap.DnsRecordType.A;
            }
        }
        const { containerName, containerPort } = determineContainerNameAndPort({
            taskDefinition: this.taskDefinition,
            dnsRecordType: dnsRecordType,
            container: options.container,
            containerPort: options.containerPort,
        });
        const cloudmapService = new cloudmap.Service(this, 'CloudmapService', {
            namespace: sdNamespace,
            name: options.name,
            dnsRecordType: dnsRecordType,
            customHealthCheck: { failureThreshold: options.failureThreshold || 1 },
            dnsTtl: options.dnsTtl,
        });
        const serviceArn = cloudmapService.serviceArn;
        // add Cloudmap service to the ECS Service's serviceRegistry
        this.addServiceRegistry({
            arn: serviceArn,
            containerName,
            containerPort,
        });
        this.cloudmapService = cloudmapService;
        return cloudmapService;
    }
    /**
     * Associates this service with a CloudMap service
     */
    associateCloudMapService(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_AssociateCloudMapServiceOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.associateCloudMapService);
            }
            throw error;
        }
        const service = options.service;
        const { containerName, containerPort } = determineContainerNameAndPort({
            taskDefinition: this.taskDefinition,
            dnsRecordType: service.dnsRecordType,
            container: options.container,
            containerPort: options.containerPort,
        });
        // add Cloudmap service to the ECS Service's serviceRegistry
        this.addServiceRegistry({
            arn: service.serviceArn,
            containerName,
            containerPort,
        });
    }
    /**
     * This method returns the specified CloudWatch metric name for this service.
     */
    metric(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/ECS',
            metricName,
            dimensionsMap: { ClusterName: this.cluster.clusterName, ServiceName: this.serviceName },
            ...props,
        }).attachTo(this);
    }
    /**
     * This method returns the CloudWatch metric for this service's memory utilization.
     *
     * @default average over 5 minutes
     */
    metricMemoryUtilization(props) {
        return this.metric('MemoryUtilization', props);
    }
    /**
     * This method returns the CloudWatch metric for this service's CPU utilization.
     *
     * @default average over 5 minutes
     */
    metricCpuUtilization(props) {
        return this.metric('CPUUtilization', props);
    }
    /**
     * This method is called to create a networkConfiguration.
     * @deprecated use configureAwsVpcNetworkingWithSecurityGroups instead.
     */
    // eslint-disable-next-line max-len
    configureAwsVpcNetworking(vpc, assignPublicIp, vpcSubnets, securityGroup) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-ecs.BaseService#configureAwsVpcNetworking", "use configureAwsVpcNetworkingWithSecurityGroups instead.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.configureAwsVpcNetworking);
            }
            throw error;
        }
        if (vpcSubnets === undefined) {
            vpcSubnets = assignPublicIp ? { subnetType: ec2.SubnetType.PUBLIC } : {};
        }
        if (securityGroup === undefined) {
            securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', { vpc });
        }
        this.connections.addSecurityGroup(securityGroup);
        this.networkConfiguration = {
            awsvpcConfiguration: {
                assignPublicIp: assignPublicIp ? 'ENABLED' : 'DISABLED',
                subnets: vpc.selectSubnets(vpcSubnets).subnetIds,
                securityGroups: core_1.Lazy.list({ produce: () => [securityGroup.securityGroupId] }),
            },
        };
    }
    /**
     * This method is called to create a networkConfiguration.
     */
    // eslint-disable-next-line max-len
    configureAwsVpcNetworkingWithSecurityGroups(vpc, assignPublicIp, vpcSubnets, securityGroups) {
        if (vpcSubnets === undefined) {
            vpcSubnets = assignPublicIp ? { subnetType: ec2.SubnetType.PUBLIC } : {};
        }
        if (securityGroups === undefined || securityGroups.length === 0) {
            securityGroups = [new ec2.SecurityGroup(this, 'SecurityGroup', { vpc })];
        }
        securityGroups.forEach((sg) => { this.connections.addSecurityGroup(sg); }, this);
        this.networkConfiguration = {
            awsvpcConfiguration: {
                assignPublicIp: assignPublicIp ? 'ENABLED' : 'DISABLED',
                subnets: vpc.selectSubnets(vpcSubnets).subnetIds,
                securityGroups: securityGroups.map((sg) => sg.securityGroupId),
            },
        };
    }
    renderServiceRegistry(registry) {
        return {
            registryArn: registry.arn,
            containerName: registry.containerName,
            containerPort: registry.containerPort,
        };
    }
    /**
     * Shared logic for attaching to an ELB
     */
    attachToELB(loadBalancer, containerName, containerPort) {
        if (this.taskDefinition.networkMode === task_definition_1.NetworkMode.AWS_VPC) {
            throw new Error('Cannot use a Classic Load Balancer if NetworkMode is AwsVpc. Use Host or Bridge instead.');
        }
        if (this.taskDefinition.networkMode === task_definition_1.NetworkMode.NONE) {
            throw new Error('Cannot use a Classic Load Balancer if NetworkMode is None. Use Host or Bridge instead.');
        }
        this.loadBalancers.push({
            loadBalancerName: loadBalancer.loadBalancerName,
            containerName,
            containerPort,
        });
    }
    /**
     * Shared logic for attaching to an ELBv2
     */
    attachToELBv2(targetGroup, containerName, containerPort) {
        if (this.taskDefinition.networkMode === task_definition_1.NetworkMode.NONE) {
            throw new Error('Cannot use a load balancer if NetworkMode is None. Use Bridge, Host or AwsVpc instead.');
        }
        this.loadBalancers.push({
            targetGroupArn: targetGroup.targetGroupArn,
            containerName,
            containerPort,
        });
        // Service creation can only happen after the load balancer has
        // been associated with our target group(s), so add ordering dependency.
        this.resource.node.addDependency(targetGroup.loadBalancerAttached);
        const targetType = this.taskDefinition.networkMode === task_definition_1.NetworkMode.AWS_VPC ? elbv2.TargetType.IP : elbv2.TargetType.INSTANCE;
        return { targetType };
    }
    get defaultLoadBalancerTarget() {
        return this.loadBalancerTarget({
            containerName: this.taskDefinition.defaultContainer.containerName,
        });
    }
    /**
     * Generate the role that will be used for autoscaling this service
     */
    makeAutoScalingRole() {
        // Use a Service Linked Role.
        return iam.Role.fromRoleArn(this, 'ScalingRole', core_1.Stack.of(this).formatArn({
            region: '',
            service: 'iam',
            resource: 'role/aws-service-role/ecs.application-autoscaling.amazonaws.com',
            resourceName: 'AWSServiceRoleForApplicationAutoScaling_ECSService',
        }));
    }
    /**
     * Associate Service Discovery (Cloud Map) service
     */
    addServiceRegistry(registry) {
        if (this.serviceRegistries.length >= 1) {
            throw new Error('Cannot associate with the given service discovery registry. ECS supports at most one service registry per service.');
        }
        const sr = this.renderServiceRegistry(registry);
        this.serviceRegistries.push(sr);
    }
    /**
     *  Return the default grace period when load balancers are configured and
     *  healthCheckGracePeriod is not already set
     */
    evaluateHealthGracePeriod(providedHealthCheckGracePeriod) {
        return core_1.Lazy.any({
            produce: () => providedHealthCheckGracePeriod?.toSeconds() ?? (this.loadBalancers.length > 0 ? 60 : undefined),
        });
    }
    enableExecuteCommand() {
        this.taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
            actions: [
                'ssmmessages:CreateControlChannel',
                'ssmmessages:CreateDataChannel',
                'ssmmessages:OpenControlChannel',
                'ssmmessages:OpenDataChannel',
            ],
            resources: ['*'],
        }));
    }
}
exports.BaseService = BaseService;
_b = JSII_RTTI_SYMBOL_1;
BaseService[_b] = { fqn: "@aws-cdk/aws-ecs.BaseService", version: "0.0.0" };
BaseService.MIN_PORT = 1;
BaseService.MAX_PORT = 65535;
/**
 * The launch type of an ECS service
 */
var LaunchType;
(function (LaunchType) {
    /**
     * The service will be launched using the EC2 launch type
     */
    LaunchType["EC2"] = "EC2";
    /**
     * The service will be launched using the FARGATE launch type
     */
    LaunchType["FARGATE"] = "FARGATE";
    /**
     * The service will be launched using the EXTERNAL launch type
     */
    LaunchType["EXTERNAL"] = "EXTERNAL";
})(LaunchType = exports.LaunchType || (exports.LaunchType = {}));
/**
 * The deployment controller type to use for the service.
 */
var DeploymentControllerType;
(function (DeploymentControllerType) {
    /**
     * The rolling update (ECS) deployment type involves replacing the current
     * running version of the container with the latest version.
     */
    DeploymentControllerType["ECS"] = "ECS";
    /**
     * The blue/green (CODE_DEPLOY) deployment type uses the blue/green deployment model powered by AWS CodeDeploy
     */
    DeploymentControllerType["CODE_DEPLOY"] = "CODE_DEPLOY";
    /**
     * The external (EXTERNAL) deployment type enables you to use any third-party deployment controller
     */
    DeploymentControllerType["EXTERNAL"] = "EXTERNAL";
})(DeploymentControllerType = exports.DeploymentControllerType || (exports.DeploymentControllerType = {}));
/**
 * Propagate tags from either service or task definition
 */
var PropagatedTagSource;
(function (PropagatedTagSource) {
    /**
     * Propagate tags from service
     */
    PropagatedTagSource["SERVICE"] = "SERVICE";
    /**
     * Propagate tags from task definition
     */
    PropagatedTagSource["TASK_DEFINITION"] = "TASK_DEFINITION";
    /**
     * Do not propagate
     */
    PropagatedTagSource["NONE"] = "NONE";
})(PropagatedTagSource = exports.PropagatedTagSource || (exports.PropagatedTagSource = {}));
/**
 * Determine the name of the container and port to target for the service registry.
 */
function determineContainerNameAndPort(options) {
    // If the record type is SRV, then provide the containerName and containerPort to target.
    // We use the name of the default container and the default port of the default container
    // unless the user specifies otherwise.
    if (options.dnsRecordType === cloudmap.DnsRecordType.SRV) {
        // Ensure the user-provided container is from the right task definition.
        if (options.container && options.container.taskDefinition != options.taskDefinition) {
            throw new Error('Cannot add discovery for a container from another task definition');
        }
        const container = options.container ?? options.taskDefinition.defaultContainer;
        // Ensure that any port given by the user is mapped.
        if (options.containerPort && !container.portMappings.some(mapping => mapping.containerPort === options.containerPort)) {
            throw new Error('Cannot add discovery for a container port that has not been mapped');
        }
        return {
            containerName: container.containerName,
            containerPort: options.containerPort ?? options.taskDefinition.defaultContainer.containerPort,
        };
    }
    return {};
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFzZS1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGtFQUFrRTtBQUNsRSxzREFBc0Q7QUFDdEQsd0NBQXdDO0FBRXhDLDZEQUE2RDtBQUM3RCx3Q0FBd0M7QUFDeEMsMERBQTBEO0FBQzFELHdDQVV1QjtBQUN2Qix5Q0FBeUM7QUFHekMsK0RBQTBEO0FBQzFELDZEQUFpRztBQUNqRyx3Q0FBZ0c7QUFFaEcsb0RBQThDO0FBbVM5Qzs7R0FFRztBQUNILE1BQXNCLGNBQWM7SUFDbEM7O09BRUc7SUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsUUFBbUMsRUFBRSxLQUF3QztRQUM3RyxPQUFPLElBQUkseUJBQXlCLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3ZEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsZUFBZSxDQUFDLFFBQStCLEVBQUUsS0FBb0M7UUFDakcsT0FBTyxJQUFJLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUNuRDs7QUFiSCx3Q0FtQkM7OztBQUVEOztHQUVHO0FBQ0gsTUFBTSx5QkFBMEIsU0FBUSxjQUFjO0lBQ3BELFlBQTZCLFFBQW1DLEVBQW1CLEtBQXdDO1FBQ3pILEtBQUssRUFBRSxDQUFDO1FBRG1CLGFBQVEsR0FBUixRQUFRLENBQTJCO1FBQW1CLFVBQUssR0FBTCxLQUFLLENBQW1DO0tBRTFIO0lBRUQ7O09BRUc7SUFDSSxVQUFVLENBQUMsRUFBVSxFQUFFLE1BQWlDLEVBQUUsT0FBb0I7UUFDbkYsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDL0IsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUNoQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLEtBQUssQ0FBQyxt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QUFTLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxjQUFjLElBQUksT0FBTyxDQUFDLGNBQWMsRUFBRTtZQUNuRixNQUFNLElBQUksS0FBSyxDQUFDLG1FQUFtRSxDQUFDLENBQUM7U0FDdEY7UUFFRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsZ0JBQWlCLENBQUM7UUFFaEYsb0RBQW9EO1FBQ3BELElBQUksT0FBTyxDQUFDLGFBQWEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLGFBQWEsS0FBSyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDckgsTUFBTSxJQUFJLEtBQUssQ0FBQyxvRUFBb0UsQ0FBQyxDQUFDO1NBQ3ZGO1FBRUQsT0FBTztZQUNMLGFBQWEsRUFBRSxTQUFTLENBQUMsYUFBYTtZQUN0QyxhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWEsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLGdCQUFpQixDQUFDLGFBQWE7U0FDL0YsQ0FBQztLQUNIO0lBRUQsT0FBTyxFQUFFLENBQUM7QUFDWixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXBwc2NhbGluZyBmcm9tICdAYXdzLWNkay9hd3MtYXBwbGljYXRpb25hdXRvc2NhbGluZyc7XG5pbXBvcnQgKiBhcyBjbG91ZHdhdGNoIGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZHdhdGNoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVsYiBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmcnO1xuaW1wb3J0ICogYXMgZWxidjIgZnJvbSAnQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2xvdWRtYXAgZnJvbSAnQGF3cy1jZGsvYXdzLXNlcnZpY2VkaXNjb3ZlcnknO1xuaW1wb3J0IHtcbiAgQW5ub3RhdGlvbnMsXG4gIER1cmF0aW9uLFxuICBJUmVzb2x2YWJsZSxcbiAgSVJlc291cmNlLFxuICBMYXp5LFxuICBSZXNvdXJjZSxcbiAgU3RhY2ssXG4gIEFybkZvcm1hdCxcbiAgRmVhdHVyZUZsYWdzLFxufSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5cbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgU2NhbGFibGVUYXNrQ291bnQgfSBmcm9tICcuL3NjYWxhYmxlLXRhc2stY291bnQnO1xuaW1wb3J0IHsgTG9hZEJhbGFuY2VyVGFyZ2V0T3B0aW9ucywgTmV0d29ya01vZGUsIFRhc2tEZWZpbml0aW9uIH0gZnJvbSAnLi4vYmFzZS90YXNrLWRlZmluaXRpb24nO1xuaW1wb3J0IHsgSUNsdXN0ZXIsIENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneSwgRXhlY3V0ZUNvbW1hbmRMb2dnaW5nLCBDbHVzdGVyIH0gZnJvbSAnLi4vY2x1c3Rlcic7XG5pbXBvcnQgeyBDb250YWluZXJEZWZpbml0aW9uLCBQcm90b2NvbCB9IGZyb20gJy4uL2NvbnRhaW5lci1kZWZpbml0aW9uJztcbmltcG9ydCB7IENmblNlcnZpY2UgfSBmcm9tICcuLi9lY3MuZ2VuZXJhdGVkJztcbmltcG9ydCB7IExvZ0RyaXZlciwgTG9nRHJpdmVyQ29uZmlnIH0gZnJvbSAnLi4vbG9nLWRyaXZlcnMvbG9nLWRyaXZlcic7XG5cbi8qKlxuICogVGhlIGludGVyZmFjZSBmb3IgYSBzZXJ2aWNlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElTZXJ2aWNlIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgc2VydmljZS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgc2VydmljZS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc2VydmljZU5hbWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGUgZGVwbG95bWVudCBjb250cm9sbGVyIHRvIHVzZSBmb3IgdGhlIHNlcnZpY2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGVwbG95bWVudENvbnRyb2xsZXIge1xuICAvKipcbiAgICogVGhlIGRlcGxveW1lbnQgY29udHJvbGxlciB0eXBlIHRvIHVzZS5cbiAgICpcbiAgICogQGRlZmF1bHQgRGVwbG95bWVudENvbnRyb2xsZXJUeXBlLkVDU1xuICAgKi9cbiAgcmVhZG9ubHkgdHlwZT86IERlcGxveW1lbnRDb250cm9sbGVyVHlwZTtcbn1cblxuLyoqXG4gKiBUaGUgZGVwbG95bWVudCBjaXJjdWl0IGJyZWFrZXIgdG8gdXNlIGZvciB0aGUgc2VydmljZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIERlcGxveW1lbnRDaXJjdWl0QnJlYWtlciB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGVuYWJsZSByb2xsYmFjayBvbiBkZXBsb3ltZW50IGZhaWx1cmVcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHJvbGxiYWNrPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFY3NUYXJnZXQge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNvbnRhaW5lci5cbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lck5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHBvcnQgbnVtYmVyIG9mIHRoZSBjb250YWluZXIuIE9ubHkgYXBwbGljYWJsZSB3aGVuIHVzaW5nIGFwcGxpY2F0aW9uL25ldHdvcmsgbG9hZCBiYWxhbmNlcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQ29udGFpbmVyIHBvcnQgb2YgdGhlIGZpcnN0IGFkZGVkIHBvcnQgbWFwcGluZy5cbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lclBvcnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBwcm90b2NvbCB1c2VkIGZvciB0aGUgcG9ydCBtYXBwaW5nLiBPbmx5IGFwcGxpY2FibGUgd2hlbiB1c2luZyBhcHBsaWNhdGlvbiBsb2FkIGJhbGFuY2Vycy5cbiAgICpcbiAgICogQGRlZmF1bHQgUHJvdG9jb2wuVENQXG4gICAqL1xuICByZWFkb25seSBwcm90b2NvbD86IFByb3RvY29sO1xuXG4gIC8qKlxuICAgKiBJRCBmb3IgYSB0YXJnZXQgZ3JvdXAgdG8gYmUgY3JlYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IG5ld1RhcmdldEdyb3VwSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogTGlzdGVuZXIgYW5kIHByb3BlcnRpZXMgZm9yIGFkZGluZyB0YXJnZXQgZ3JvdXAgdG8gdGhlIGxpc3RlbmVyLlxuICAgKi9cbiAgcmVhZG9ubHkgbGlzdGVuZXI6IExpc3RlbmVyQ29uZmlnO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgRUNTIGxvYWQgYmFsYW5jZXIgdGFyZ2V0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElFY3NMb2FkQmFsYW5jZXJUYXJnZXQgZXh0ZW5kcyBlbGJ2Mi5JQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJUYXJnZXQsIGVsYnYyLklOZXR3b3JrTG9hZEJhbGFuY2VyVGFyZ2V0LCBlbGIuSUxvYWRCYWxhbmNlclRhcmdldCB7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBTZXJ2aWNlIENvbm5lY3QgY29uZmlndXJhdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlQ29ubmVjdFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBjbG91ZG1hcCBuYW1lc3BhY2UgdG8gcmVnaXN0ZXIgdGhpcyBzZXJ2aWNlIGludG8uXG4gICAqXG4gICAqIEBkZWZhdWx0IHRoZSBjbG91ZG1hcCBuYW1lc3BhY2Ugc3BlY2lmaWVkIG9uIHRoZSBjbHVzdGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZXNwYWNlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiBTZXJ2aWNlcywgaW5jbHVkaW5nIGEgcG9ydCBtYXBwaW5nLCB0ZXJzZSBjbGllbnQgYWxpYXMsIGFuZCBvcHRpb25hbCBpbnRlcm1lZGlhdGUgRE5TIG5hbWUuXG4gICAqXG4gICAqIFRoaXMgcHJvcGVydHkgbWF5IGJlIGxlZnQgYmxhbmsgaWYgdGhlIGN1cnJlbnQgRUNTIHNlcnZpY2UgZG9lcyBub3QgbmVlZCB0byBhZHZlcnRpc2UgYW55IHBvcnRzIHZpYSBTZXJ2aWNlIENvbm5lY3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VzPzogU2VydmljZUNvbm5lY3RTZXJ2aWNlW107XG5cbiAgLyoqXG4gICAqIFRoZSBsb2cgZHJpdmVyIGNvbmZpZ3VyYXRpb24gdG8gdXNlIGZvciB0aGUgU2VydmljZSBDb25uZWN0IGFnZW50IGxvZ3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgbG9nRHJpdmVyPzogTG9nRHJpdmVyO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3Igc2VydmljZSBjb25uZWN0IFNlcnZpY2UgcHJvcHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2VydmljZUNvbm5lY3RTZXJ2aWNlIHtcbiAgLyoqXG4gICAqIHBvcnRNYXBwaW5nTmFtZSBzcGVjaWZpZXMgd2hpY2ggcG9ydCBhbmQgcHJvdG9jb2wgY29tYmluYXRpb24gc2hvdWxkIGJlIHVzZWQgZm9yIHRoaXNcbiAgICogc2VydmljZSBjb25uZWN0IHNlcnZpY2UuXG4gICAqL1xuICByZWFkb25seSBwb3J0TWFwcGluZ05hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogT3B0aW9uYWxseSBzcGVjaWZpZXMgYW4gaW50ZXJtZWRpYXRlIGRucyBuYW1lIHRvIHJlZ2lzdGVyIGluIHRoZSBDbG91ZE1hcCBuYW1lc3BhY2UuXG4gICAqIFRoaXMgaXMgcmVxdWlyZWQgaWYgeW91IHdpc2ggdG8gdXNlIHRoZSBzYW1lIHBvcnQgbWFwcGluZyBuYW1lIGluIG1vcmUgdGhhbiBvbmUgc2VydmljZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBwb3J0IG1hcHBpbmcgbmFtZVxuICAgKi9cbiAgcmVhZG9ubHkgZGlzY292ZXJ5TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHRlcnNlIEROUyBhbGlhcyB0byB1c2UgZm9yIHRoaXMgcG9ydCBtYXBwaW5nIGluIHRoZSBzZXJ2aWNlIGNvbm5lY3QgbWVzaC5cbiAgICogU2VydmljZSBDb25uZWN0LWVuYWJsZWQgY2xpZW50cyB3aWxsIGJlIGFibGUgdG8gcmVhY2ggdGhpcyBzZXJ2aWNlIGF0XG4gICAqIGh0dHA6Ly9kbnNOYW1lOnBvcnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYWxpYXMgaXMgY3JlYXRlZC4gVGhlIHNlcnZpY2UgaXMgcmVhY2hhYmxlIGF0IGBwb3J0TWFwcGluZ05hbWUubmFtZXNwYWNlOnBvcnRgLlxuICAgKi9cbiAgcmVhZG9ubHkgZG5zTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgIFRoZSBwb3J0IGZvciBjbGllbnRzIHRvIHVzZSB0byBjb21tdW5pY2F0ZSB3aXRoIHRoaXMgc2VydmljZSB2aWEgU2VydmljZSBDb25uZWN0LlxuICAgKlxuICAgKiBAZGVmYXVsdCB0aGUgY29udGFpbmVyIHBvcnQgc3BlY2lmaWVkIGJ5IHRoZSBwb3J0IG1hcHBpbmcgaW4gcG9ydE1hcHBpbmdOYW1lLlxuICAgKi9cbiAgcmVhZG9ubHkgcG9ydD86IG51bWJlcjtcblxuICAvKipcbiAgICogT3B0aW9uYWwuIFRoZSBwb3J0IG9uIHRoZSBTZXJ2aWNlIENvbm5lY3QgYWdlbnQgY29udGFpbmVyIHRvIHVzZSBmb3IgdHJhZmZpYyBpbmdyZXNzIHRvIHRoaXMgc2VydmljZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBpbmdyZXNzUG9ydE92ZXJyaWRlPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIFRoZSBwcm9wZXJ0aWVzIGZvciB0aGUgYmFzZSBFYzJTZXJ2aWNlIG9yIEZhcmdhdGVTZXJ2aWNlIHNlcnZpY2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQmFzZVNlcnZpY2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBjbHVzdGVyIHRoYXQgaG9zdHMgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyOiBJQ2x1c3RlcjtcblxuICAvKipcbiAgICogVGhlIGRlc2lyZWQgbnVtYmVyIG9mIGluc3RhbnRpYXRpb25zIG9mIHRoZSB0YXNrIGRlZmluaXRpb24gdG8ga2VlcCBydW5uaW5nIG9uIHRoZSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFdoZW4gY3JlYXRpbmcgdGhlIHNlcnZpY2UsIGRlZmF1bHQgaXMgMTsgd2hlbiB1cGRhdGluZyB0aGUgc2VydmljZSwgZGVmYXVsdCB1c2VzXG4gICAqIHRoZSBjdXJyZW50IHRhc2sgbnVtYmVyLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzaXJlZENvdW50PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgc2VydmljZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBDbG91ZEZvcm1hdGlvbi1nZW5lcmF0ZWQgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgdGFza3MsIHNwZWNpZmllZCBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIEFtYXpvbiBFQ1NcbiAgICogc2VydmljZSdzIERlc2lyZWRDb3VudCB2YWx1ZSwgdGhhdCBjYW4gcnVuIGluIGEgc2VydmljZSBkdXJpbmcgYVxuICAgKiBkZXBsb3ltZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIDEwMCBpZiBkYWVtb24sIG90aGVyd2lzZSAyMDBcbiAgICovXG4gIHJlYWRvbmx5IG1heEhlYWx0aHlQZXJjZW50PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbWluaW11bSBudW1iZXIgb2YgdGFza3MsIHNwZWNpZmllZCBhcyBhIHBlcmNlbnRhZ2Ugb2ZcbiAgICogdGhlIEFtYXpvbiBFQ1Mgc2VydmljZSdzIERlc2lyZWRDb3VudCB2YWx1ZSwgdGhhdCBtdXN0XG4gICAqIGNvbnRpbnVlIHRvIHJ1biBhbmQgcmVtYWluIGhlYWx0aHkgZHVyaW5nIGEgZGVwbG95bWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSAwIGlmIGRhZW1vbiwgb3RoZXJ3aXNlIDUwXG4gICAqL1xuICByZWFkb25seSBtaW5IZWFsdGh5UGVyY2VudD86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHBlcmlvZCBvZiB0aW1lLCBpbiBzZWNvbmRzLCB0aGF0IHRoZSBBbWF6b24gRUNTIHNlcnZpY2Ugc2NoZWR1bGVyIGlnbm9yZXMgdW5oZWFsdGh5XG4gICAqIEVsYXN0aWMgTG9hZCBCYWxhbmNpbmcgdGFyZ2V0IGhlYWx0aCBjaGVja3MgYWZ0ZXIgYSB0YXNrIGhhcyBmaXJzdCBzdGFydGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGRlZmF1bHRzIHRvIDYwIHNlY29uZHMgaWYgYXQgbGVhc3Qgb25lIGxvYWQgYmFsYW5jZXIgaXMgaW4tdXNlIGFuZCBpdCBpcyBub3QgYWxyZWFkeSBzZXRcbiAgICovXG4gIHJlYWRvbmx5IGhlYWx0aENoZWNrR3JhY2VQZXJpb2Q/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIG9wdGlvbnMgZm9yIGNvbmZpZ3VyaW5nIGFuIEFtYXpvbiBFQ1Mgc2VydmljZSB0byB1c2Ugc2VydmljZSBkaXNjb3ZlcnkuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQVdTIENsb3VkIE1hcCBzZXJ2aWNlIGRpc2NvdmVyeSBpcyBub3QgZW5hYmxlZC5cbiAgICovXG4gIHJlYWRvbmx5IGNsb3VkTWFwT3B0aW9ucz86IENsb3VkTWFwT3B0aW9ucztcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdG8gcHJvcGFnYXRlIHRoZSB0YWdzIGZyb20gdGhlIHRhc2sgZGVmaW5pdGlvbiBvciB0aGUgc2VydmljZSB0byB0aGUgdGFza3MgaW4gdGhlIHNlcnZpY2VcbiAgICpcbiAgICogVmFsaWQgdmFsdWVzIGFyZTogUHJvcGFnYXRlZFRhZ1NvdXJjZS5TRVJWSUNFLCBQcm9wYWdhdGVkVGFnU291cmNlLlRBU0tfREVGSU5JVElPTiBvciBQcm9wYWdhdGVkVGFnU291cmNlLk5PTkVcbiAgICpcbiAgICogQGRlZmF1bHQgUHJvcGFnYXRlZFRhZ1NvdXJjZS5OT05FXG4gICAqL1xuICByZWFkb25seSBwcm9wYWdhdGVUYWdzPzogUHJvcGFnYXRlZFRhZ1NvdXJjZTtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdG8gcHJvcGFnYXRlIHRoZSB0YWdzIGZyb20gdGhlIHRhc2sgZGVmaW5pdGlvbiBvciB0aGUgc2VydmljZSB0byB0aGUgdGFza3MgaW4gdGhlIHNlcnZpY2UuXG4gICAqIFRhZ3MgY2FuIG9ubHkgYmUgcHJvcGFnYXRlZCB0byB0aGUgdGFza3Mgd2l0aGluIHRoZSBzZXJ2aWNlIGR1cmluZyBzZXJ2aWNlIGNyZWF0aW9uLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHByb3BhZ2F0ZVRhZ3NgIGluc3RlYWQuXG4gICAqIEBkZWZhdWx0IFByb3BhZ2F0ZWRUYWdTb3VyY2UuTk9ORVxuICAgKi9cbiAgcmVhZG9ubHkgcHJvcGFnYXRlVGFza1RhZ3NGcm9tPzogUHJvcGFnYXRlZFRhZ1NvdXJjZTtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdG8gZW5hYmxlIEFtYXpvbiBFQ1MgbWFuYWdlZCB0YWdzIGZvciB0aGUgdGFza3Mgd2l0aGluIHRoZSBzZXJ2aWNlLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlXG4gICAqIFtUYWdnaW5nIFlvdXIgQW1hem9uIEVDUyBSZXNvdXJjZXNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2Vjcy11c2luZy10YWdzLmh0bWwpXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBlbmFibGVFQ1NNYW5hZ2VkVGFncz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGljaCBkZXBsb3ltZW50IGNvbnRyb2xsZXIgdG8gdXNlIGZvciB0aGUgc2VydmljZS4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZVxuICAgKiBbQW1hem9uIEVDUyBEZXBsb3ltZW50IFR5cGVzXShodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNTL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9kZXBsb3ltZW50LXR5cGVzLmh0bWwpXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gUm9sbGluZyB1cGRhdGUgKEVDUylcbiAgICovXG4gIHJlYWRvbmx5IGRlcGxveW1lbnRDb250cm9sbGVyPzogRGVwbG95bWVudENvbnRyb2xsZXI7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZW5hYmxlIHRoZSBkZXBsb3ltZW50IGNpcmN1aXQgYnJlYWtlci4gSWYgdGhpcyBwcm9wZXJ0eSBpcyBkZWZpbmVkLCBjaXJjdWl0IGJyZWFrZXIgd2lsbCBiZSBpbXBsaWNpdGx5XG4gICAqIGVuYWJsZWQuXG4gICAqIEBkZWZhdWx0IC0gZGlzYWJsZWRcbiAgICovXG4gIHJlYWRvbmx5IGNpcmN1aXRCcmVha2VyPzogRGVwbG95bWVudENpcmN1aXRCcmVha2VyO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgQ2FwYWNpdHkgUHJvdmlkZXIgc3RyYXRlZ2llcyB1c2VkIHRvIHBsYWNlIGEgc2VydmljZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB1bmRlZmluZWRcbiAgICpcbiAgICovXG4gIHJlYWRvbmx5IGNhcGFjaXR5UHJvdmlkZXJTdHJhdGVnaWVzPzogQ2FwYWNpdHlQcm92aWRlclN0cmF0ZWd5W107XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZW5hYmxlIHRoZSBhYmlsaXR5IHRvIGV4ZWN1dGUgaW50byBhIGNvbnRhaW5lclxuICAgKlxuICAgKiAgQGRlZmF1bHQgLSB1bmRlZmluZWRcbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZUV4ZWN1dGVDb21tYW5kPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBmb3IgU2VydmljZSBDb25uZWN0LlxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBwb3J0cyBhcmUgYWR2ZXJ0aXNlZCB2aWEgU2VydmljZSBDb25uZWN0IG9uIHRoaXMgc2VydmljZSwgYW5kIHRoZSBzZXJ2aWNlXG4gICAqIGNhbm5vdCBtYWtlIHJlcXVlc3RzIHRvIG90aGVyIHNlcnZpY2VzIHZpYSBTZXJ2aWNlIENvbm5lY3QuXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlQ29ubmVjdENvbmZpZ3VyYXRpb24/OiBTZXJ2aWNlQ29ubmVjdFByb3BzO1xufVxuXG4vKipcbiAqIENvbXBsZXRlIGJhc2Ugc2VydmljZSBwcm9wZXJ0aWVzIHRoYXQgYXJlIHJlcXVpcmVkIHRvIGJlIHN1cHBsaWVkIGJ5IHRoZSBpbXBsZW1lbnRhdGlvblxuICogb2YgdGhlIEJhc2VTZXJ2aWNlIGNsYXNzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJhc2VTZXJ2aWNlUHJvcHMgZXh0ZW5kcyBCYXNlU2VydmljZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGxhdW5jaCB0eXBlIG9uIHdoaWNoIHRvIHJ1biB5b3VyIHNlcnZpY2UuXG4gICAqXG4gICAqIExhdW5jaFR5cGUgd2lsbCBiZSBvbWl0dGVkIGlmIGNhcGFjaXR5IHByb3ZpZGVyIHN0cmF0ZWdpZXMgYXJlIHNwZWNpZmllZCBvbiB0aGUgc2VydmljZS5cbiAgICpcbiAgICogQHNlZSAtIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1lY3Mtc2VydmljZS5odG1sI2Nmbi1lY3Mtc2VydmljZS1jYXBhY2l0eXByb3ZpZGVyc3RyYXRlZ3lcbiAgICpcbiAgICogVmFsaWQgdmFsdWVzIGFyZTogTGF1bmNoVHlwZS5FQ1Mgb3IgTGF1bmNoVHlwZS5GQVJHQVRFIG9yIExhdW5jaFR5cGUuRVhURVJOQUxcbiAgICovXG4gIHJlYWRvbmx5IGxhdW5jaFR5cGU6IExhdW5jaFR5cGU7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgY29uZmlndXJpbmcgbGlzdGVuZXIgd2hlbiByZWdpc3RlcmluZyB0YXJnZXRzLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTGlzdGVuZXJDb25maWcge1xuICAvKipcbiAgICogQ3JlYXRlIGEgY29uZmlnIGZvciBhZGRpbmcgdGFyZ2V0IGdyb3VwIHRvIEFMQiBsaXN0ZW5lci5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXBwbGljYXRpb25MaXN0ZW5lcihsaXN0ZW5lcjogZWxidjIuQXBwbGljYXRpb25MaXN0ZW5lciwgcHJvcHM/OiBlbGJ2Mi5BZGRBcHBsaWNhdGlvblRhcmdldHNQcm9wcyk6IExpc3RlbmVyQ29uZmlnIHtcbiAgICByZXR1cm4gbmV3IEFwcGxpY2F0aW9uTGlzdGVuZXJDb25maWcobGlzdGVuZXIsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBjb25maWcgZm9yIGFkZGluZyB0YXJnZXQgZ3JvdXAgdG8gTkxCIGxpc3RlbmVyLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBuZXR3b3JrTGlzdGVuZXIobGlzdGVuZXI6IGVsYnYyLk5ldHdvcmtMaXN0ZW5lciwgcHJvcHM/OiBlbGJ2Mi5BZGROZXR3b3JrVGFyZ2V0c1Byb3BzKTogTGlzdGVuZXJDb25maWcge1xuICAgIHJldHVybiBuZXcgTmV0d29ya0xpc3RlbmVyQ29uZmlnKGxpc3RlbmVyLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuZCBhdHRhY2ggYSB0YXJnZXQgZ3JvdXAgdG8gbGlzdGVuZXIuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgYWRkVGFyZ2V0cyhpZDogc3RyaW5nLCB0YXJnZXQ6IExvYWRCYWxhbmNlclRhcmdldE9wdGlvbnMsIHNlcnZpY2U6IEJhc2VTZXJ2aWNlKTogdm9pZDtcbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgY29uZmlndXJpbmcgYXBwbGljYXRpb24gbG9hZCBiYWxhbmNlciBsaXN0ZW5lciB3aGVuIHJlZ2lzdGVyaW5nIHRhcmdldHMuXG4gKi9cbmNsYXNzIEFwcGxpY2F0aW9uTGlzdGVuZXJDb25maWcgZXh0ZW5kcyBMaXN0ZW5lckNvbmZpZyB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbGlzdGVuZXI6IGVsYnYyLkFwcGxpY2F0aW9uTGlzdGVuZXIsIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM/OiBlbGJ2Mi5BZGRBcHBsaWNhdGlvblRhcmdldHNQcm9wcykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuZCBhdHRhY2ggYSB0YXJnZXQgZ3JvdXAgdG8gbGlzdGVuZXIuXG4gICAqL1xuICBwdWJsaWMgYWRkVGFyZ2V0cyhpZDogc3RyaW5nLCB0YXJnZXQ6IExvYWRCYWxhbmNlclRhcmdldE9wdGlvbnMsIHNlcnZpY2U6IEJhc2VTZXJ2aWNlKSB7XG4gICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzIHx8IHt9O1xuICAgIGNvbnN0IHByb3RvY29sID0gcHJvcHMucHJvdG9jb2w7XG4gICAgY29uc3QgcG9ydCA9IHByb3BzLnBvcnQgPz8gKHByb3RvY29sID09PSBlbGJ2Mi5BcHBsaWNhdGlvblByb3RvY29sLkhUVFBTID8gNDQzIDogODApO1xuICAgIHRoaXMubGlzdGVuZXIuYWRkVGFyZ2V0cyhpZCwge1xuICAgICAgLi4uIHByb3BzLFxuICAgICAgdGFyZ2V0czogW1xuICAgICAgICBzZXJ2aWNlLmxvYWRCYWxhbmNlclRhcmdldCh7XG4gICAgICAgICAgLi4udGFyZ2V0LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgICBwb3J0LFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIGNvbmZpZ3VyaW5nIG5ldHdvcmsgbG9hZCBiYWxhbmNlciBsaXN0ZW5lciB3aGVuIHJlZ2lzdGVyaW5nIHRhcmdldHMuXG4gKi9cbmNsYXNzIE5ldHdvcmtMaXN0ZW5lckNvbmZpZyBleHRlbmRzIExpc3RlbmVyQ29uZmlnIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBsaXN0ZW5lcjogZWxidjIuTmV0d29ya0xpc3RlbmVyLCBwcml2YXRlIHJlYWRvbmx5IHByb3BzPzogZWxidjIuQWRkTmV0d29ya1RhcmdldHNQcm9wcykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGFuZCBhdHRhY2ggYSB0YXJnZXQgZ3JvdXAgdG8gbGlzdGVuZXIuXG4gICAqL1xuICBwdWJsaWMgYWRkVGFyZ2V0cyhpZDogc3RyaW5nLCB0YXJnZXQ6IExvYWRCYWxhbmNlclRhcmdldE9wdGlvbnMsIHNlcnZpY2U6IEJhc2VTZXJ2aWNlKSB7XG4gICAgY29uc3QgcG9ydCA9IHRoaXMucHJvcHM/LnBvcnQgPz8gODA7XG4gICAgdGhpcy5saXN0ZW5lci5hZGRUYXJnZXRzKGlkLCB7XG4gICAgICAuLi4gdGhpcy5wcm9wcyxcbiAgICAgIHRhcmdldHM6IFtcbiAgICAgICAgc2VydmljZS5sb2FkQmFsYW5jZXJUYXJnZXQoe1xuICAgICAgICAgIC4uLnRhcmdldCxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgICAgcG9ydCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBpbnRlcmZhY2UgZm9yIEJhc2VTZXJ2aWNlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElCYXNlU2VydmljZSBleHRlbmRzIElTZXJ2aWNlIHtcbiAgLyoqXG4gICAqIFRoZSBjbHVzdGVyIHRoYXQgaG9zdHMgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyOiBJQ2x1c3Rlcjtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBjbGFzcyBmb3IgRWMyU2VydmljZSBhbmQgRmFyZ2F0ZVNlcnZpY2Ugc2VydmljZXMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlU2VydmljZSBleHRlbmRzIFJlc291cmNlXG4gIGltcGxlbWVudHMgSUJhc2VTZXJ2aWNlLCBlbGJ2Mi5JQXBwbGljYXRpb25Mb2FkQmFsYW5jZXJUYXJnZXQsIGVsYnYyLklOZXR3b3JrTG9hZEJhbGFuY2VyVGFyZ2V0LCBlbGIuSUxvYWRCYWxhbmNlclRhcmdldCB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgRUNTL0ZhcmdhdGUgU2VydmljZSB1c2luZyB0aGUgc2VydmljZSBjbHVzdGVyIGZvcm1hdC5cbiAgICogVGhlIGZvcm1hdCBpcyB0aGUgXCJuZXdcIiBmb3JtYXQgXCJhcm46YXdzOmVjczpyZWdpb246YXdzX2FjY291bnRfaWQ6c2VydmljZS9jbHVzdGVyLW5hbWUvc2VydmljZS1uYW1lXCIuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUy9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvZWNzLWFjY291bnQtc2V0dGluZ3MuaHRtbCNlY3MtcmVzb3VyY2UtaWRzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TZXJ2aWNlQXJuV2l0aENsdXN0ZXIoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgc2VydmljZUFybjogc3RyaW5nKTogSUJhc2VTZXJ2aWNlIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCBhcm4gPSBzdGFjay5zcGxpdEFybihzZXJ2aWNlQXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSk7XG4gICAgY29uc3QgcmVzb3VyY2VOYW1lID0gYXJuLnJlc291cmNlTmFtZTtcbiAgICBpZiAoIXJlc291cmNlTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHJlc291cmNlIE5hbWUgZnJvbSBzZXJ2aWNlIEFSTjogJHtzZXJ2aWNlQXJufScpO1xuICAgIH1cbiAgICBjb25zdCByZXNvdXJjZU5hbWVQYXJ0cyA9IHJlc291cmNlTmFtZS5zcGxpdCgnLycpO1xuICAgIGlmIChyZXNvdXJjZU5hbWVQYXJ0cy5sZW5ndGggIT09IDIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgcmVzb3VyY2UgbmFtZSAke3Jlc291cmNlTmFtZX0gZnJvbSBzZXJ2aWNlIEFSTjogJHtzZXJ2aWNlQXJufSBpcyBub3QgdXNpbmcgdGhlIEFSTiBjbHVzdGVyIGZvcm1hdGApO1xuICAgIH1cbiAgICBjb25zdCBjbHVzdGVyTmFtZSA9IHJlc291cmNlTmFtZVBhcnRzWzBdO1xuICAgIGNvbnN0IHNlcnZpY2VOYW1lID0gcmVzb3VyY2VOYW1lUGFydHNbMV07XG5cbiAgICBjb25zdCBjbHVzdGVyQXJuID0gU3RhY2sub2Yoc2NvcGUpLmZvcm1hdEFybih7XG4gICAgICBwYXJ0aXRpb246IGFybi5wYXJ0aXRpb24sXG4gICAgICByZWdpb246IGFybi5yZWdpb24sXG4gICAgICBhY2NvdW50OiBhcm4uYWNjb3VudCxcbiAgICAgIHNlcnZpY2U6ICdlY3MnLFxuICAgICAgcmVzb3VyY2U6ICdjbHVzdGVyJyxcbiAgICAgIHJlc291cmNlTmFtZTogY2x1c3Rlck5hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gQ2x1c3Rlci5mcm9tQ2x1c3RlckFybihzY29wZSwgYCR7aWR9Q2x1c3RlcmAsIGNsdXN0ZXJBcm4pO1xuXG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJQmFzZVNlcnZpY2Uge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHNlcnZpY2VBcm4gPSBzZXJ2aWNlQXJuO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHNlcnZpY2VOYW1lID0gc2VydmljZU5hbWU7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgY2x1c3RlciA9IGNsdXN0ZXI7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkLCB7XG4gICAgICBlbnZpcm9ubWVudEZyb21Bcm46IHNlcnZpY2VBcm4sXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBNSU5fUE9SVCA9IDE7XG4gIHByaXZhdGUgc3RhdGljIE1BWF9QT1JUID0gNjU1MzU7XG5cbiAgLyoqXG4gICAqIFRoZSBzZWN1cml0eSBncm91cHMgd2hpY2ggbWFuYWdlIHRoZSBhbGxvd2VkIG5ldHdvcmsgdHJhZmZpYyBmb3IgdGhlIHNlcnZpY2UuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvbnM6IGVjMi5Db25uZWN0aW9ucyA9IG5ldyBlYzIuQ29ubmVjdGlvbnMoKTtcblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNlcnZpY2VBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHNlcnZpY2UuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzZXJ2aWNlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdGFzayBkZWZpbml0aW9uIHRvIHVzZSBmb3IgdGFza3MgaW4gdGhlIHNlcnZpY2UuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdGFza0RlZmluaXRpb246IFRhc2tEZWZpbml0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgY2x1c3RlciB0aGF0IGhvc3RzIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXI6IElDbHVzdGVyO1xuXG4gIC8qKlxuICAgKiBUaGUgZGV0YWlscyBvZiB0aGUgQVdTIENsb3VkIE1hcCBzZXJ2aWNlLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNsb3VkbWFwU2VydmljZT86IGNsb3VkbWFwLlNlcnZpY2U7XG5cbiAgLyoqXG4gICAqIEEgbGlzdCBvZiBFbGFzdGljIExvYWQgQmFsYW5jaW5nIGxvYWQgYmFsYW5jZXIgb2JqZWN0cywgY29udGFpbmluZyB0aGUgbG9hZCBiYWxhbmNlciBuYW1lLCB0aGUgY29udGFpbmVyXG4gICAqIG5hbWUgKGFzIGl0IGFwcGVhcnMgaW4gYSBjb250YWluZXIgZGVmaW5pdGlvbiksIGFuZCB0aGUgY29udGFpbmVyIHBvcnQgdG8gYWNjZXNzIGZyb20gdGhlIGxvYWQgYmFsYW5jZXIuXG4gICAqL1xuICBwcm90ZWN0ZWQgbG9hZEJhbGFuY2VycyA9IG5ldyBBcnJheTxDZm5TZXJ2aWNlLkxvYWRCYWxhbmNlclByb3BlcnR5PigpO1xuXG4gIC8qKlxuICAgKiBBIGxpc3Qgb2YgRWxhc3RpYyBMb2FkIEJhbGFuY2luZyBsb2FkIGJhbGFuY2VyIG9iamVjdHMsIGNvbnRhaW5pbmcgdGhlIGxvYWQgYmFsYW5jZXIgbmFtZSwgdGhlIGNvbnRhaW5lclxuICAgKiBuYW1lIChhcyBpdCBhcHBlYXJzIGluIGEgY29udGFpbmVyIGRlZmluaXRpb24pLCBhbmQgdGhlIGNvbnRhaW5lciBwb3J0IHRvIGFjY2VzcyBmcm9tIHRoZSBsb2FkIGJhbGFuY2VyLlxuICAgKi9cbiAgcHJvdGVjdGVkIG5ldHdvcmtDb25maWd1cmF0aW9uPzogQ2ZuU2VydmljZS5OZXR3b3JrQ29uZmlndXJhdGlvblByb3BlcnR5O1xuXG4gIC8qKlxuICAgKiBUaGUgZGV0YWlscyBvZiB0aGUgc2VydmljZSBkaXNjb3ZlcnkgcmVnaXN0cmllcyB0byBhc3NpZ24gdG8gdGhpcyBzZXJ2aWNlLlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFNlcnZpY2UgRGlzY292ZXJ5LlxuICAgKi9cbiAgcHJvdGVjdGVkIHNlcnZpY2VSZWdpc3RyaWVzID0gbmV3IEFycmF5PENmblNlcnZpY2UuU2VydmljZVJlZ2lzdHJ5UHJvcGVydHk+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSBzZXJ2aWNlIGNvbm5lY3QgY29uZmlndXJhdGlvbiBmb3IgdGhpcyBzZXJ2aWNlLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCBfc2VydmljZUNvbm5lY3RDb25maWc/OiBDZm5TZXJ2aWNlLlNlcnZpY2VDb25uZWN0Q29uZmlndXJhdGlvblByb3BlcnR5O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgcmVzb3VyY2U6IENmblNlcnZpY2U7XG4gIHByaXZhdGUgc2NhbGFibGVUYXNrQ291bnQ/OiBTY2FsYWJsZVRhc2tDb3VudDtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgQmFzZVNlcnZpY2UgY2xhc3MuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBzY29wZTogQ29uc3RydWN0LFxuICAgIGlkOiBzdHJpbmcsXG4gICAgcHJvcHM6IEJhc2VTZXJ2aWNlUHJvcHMsXG4gICAgYWRkaXRpb25hbFByb3BzOiBhbnksXG4gICAgdGFza0RlZmluaXRpb246IFRhc2tEZWZpbml0aW9uKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnNlcnZpY2VOYW1lLFxuICAgIH0pO1xuXG4gICAgaWYgKHByb3BzLnByb3BhZ2F0ZVRhZ3MgJiYgcHJvcHMucHJvcGFnYXRlVGFza1RhZ3NGcm9tKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjYW4gb25seSBzcGVjaWZ5IGVpdGhlciBwcm9wYWdhdGVUYWdzIG9yIHByb3BhZ2F0ZVRhc2tUYWdzRnJvbS4gQWx0ZXJuYXRpdmVseSwgeW91IGNhbiBsZWF2ZSBib3RoIGJsYW5rJyk7XG4gICAgfVxuXG4gICAgdGhpcy50YXNrRGVmaW5pdGlvbiA9IHRhc2tEZWZpbml0aW9uO1xuXG4gICAgLy8gbGF1bmNoVHlwZSB3aWxsIHNldCB0byB1bmRlZmluZWQgaWYgdXNpbmcgZXh0ZXJuYWwgRGVwbG95bWVudENvbnRyb2xsZXIgb3IgY2FwYWNpdHlQcm92aWRlclN0cmF0ZWdpZXNcbiAgICBjb25zdCBsYXVuY2hUeXBlID0gcHJvcHMuZGVwbG95bWVudENvbnRyb2xsZXI/LnR5cGUgPT09IERlcGxveW1lbnRDb250cm9sbGVyVHlwZS5FWFRFUk5BTCB8fFxuICAgICAgcHJvcHMuY2FwYWNpdHlQcm92aWRlclN0cmF0ZWdpZXMgIT09IHVuZGVmaW5lZCA/XG4gICAgICB1bmRlZmluZWQgOiBwcm9wcy5sYXVuY2hUeXBlO1xuXG4gICAgY29uc3QgcHJvcGFnYXRlVGFnc0Zyb21Tb3VyY2UgPSBwcm9wcy5wcm9wYWdhdGVUYXNrVGFnc0Zyb20gPz8gcHJvcHMucHJvcGFnYXRlVGFncyA/PyBQcm9wYWdhdGVkVGFnU291cmNlLk5PTkU7XG4gICAgY29uc3QgZGVwbG95bWVudENvbnRyb2xsZXIgPSB0aGlzLmdldERlcGxveW1lbnRDb250cm9sbGVyKHByb3BzKTtcblxuICAgIHRoaXMucmVzb3VyY2UgPSBuZXcgQ2ZuU2VydmljZSh0aGlzLCAnU2VydmljZScsIHtcbiAgICAgIGRlc2lyZWRDb3VudDogcHJvcHMuZGVzaXJlZENvdW50LFxuICAgICAgc2VydmljZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgbG9hZEJhbGFuY2VyczogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLmxvYWRCYWxhbmNlcnMgfSwgeyBvbWl0RW1wdHlBcnJheTogdHJ1ZSB9KSxcbiAgICAgIGRlcGxveW1lbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIG1heGltdW1QZXJjZW50OiBwcm9wcy5tYXhIZWFsdGh5UGVyY2VudCB8fCAyMDAsXG4gICAgICAgIG1pbmltdW1IZWFsdGh5UGVyY2VudDogcHJvcHMubWluSGVhbHRoeVBlcmNlbnQgPT09IHVuZGVmaW5lZCA/IDUwIDogcHJvcHMubWluSGVhbHRoeVBlcmNlbnQsXG4gICAgICAgIGRlcGxveW1lbnRDaXJjdWl0QnJlYWtlcjogcHJvcHMuY2lyY3VpdEJyZWFrZXIgPyB7XG4gICAgICAgICAgZW5hYmxlOiB0cnVlLFxuICAgICAgICAgIHJvbGxiYWNrOiBwcm9wcy5jaXJjdWl0QnJlYWtlci5yb2xsYmFjayA/PyBmYWxzZSxcbiAgICAgICAgfSA6IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgICBwcm9wYWdhdGVUYWdzOiBwcm9wYWdhdGVUYWdzRnJvbVNvdXJjZSA9PT0gUHJvcGFnYXRlZFRhZ1NvdXJjZS5OT05FID8gdW5kZWZpbmVkIDogcHJvcHMucHJvcGFnYXRlVGFncyxcbiAgICAgIGVuYWJsZUVjc01hbmFnZWRUYWdzOiBwcm9wcy5lbmFibGVFQ1NNYW5hZ2VkVGFncyA/PyBmYWxzZSxcbiAgICAgIGRlcGxveW1lbnRDb250cm9sbGVyOiBkZXBsb3ltZW50Q29udHJvbGxlcixcbiAgICAgIGxhdW5jaFR5cGU6IGxhdW5jaFR5cGUsXG4gICAgICBlbmFibGVFeGVjdXRlQ29tbWFuZDogcHJvcHMuZW5hYmxlRXhlY3V0ZUNvbW1hbmQsXG4gICAgICBjYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ3k6IHByb3BzLmNhcGFjaXR5UHJvdmlkZXJTdHJhdGVnaWVzLFxuICAgICAgaGVhbHRoQ2hlY2tHcmFjZVBlcmlvZFNlY29uZHM6IHRoaXMuZXZhbHVhdGVIZWFsdGhHcmFjZVBlcmlvZChwcm9wcy5oZWFsdGhDaGVja0dyYWNlUGVyaW9kKSxcbiAgICAgIC8qIHJvbGU6IG5ldmVyIHNwZWNpZmllZCwgc3VwcGxhbnRlZCBieSBTZXJ2aWNlIExpbmtlZCBSb2xlICovXG4gICAgICBuZXR3b3JrQ29uZmlndXJhdGlvbjogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLm5ldHdvcmtDb25maWd1cmF0aW9uIH0sIHsgb21pdEVtcHR5QXJyYXk6IHRydWUgfSksXG4gICAgICBzZXJ2aWNlUmVnaXN0cmllczogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnNlcnZpY2VSZWdpc3RyaWVzIH0sIHsgb21pdEVtcHR5QXJyYXk6IHRydWUgfSksXG4gICAgICBzZXJ2aWNlQ29ubmVjdENvbmZpZ3VyYXRpb246IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5fc2VydmljZUNvbm5lY3RDb25maWcgfSwgeyBvbWl0RW1wdHlBcnJheTogdHJ1ZSB9KSxcbiAgICAgIC4uLmFkZGl0aW9uYWxQcm9wcyxcbiAgICB9KTtcblxuICAgIGlmIChwcm9wcy5kZXBsb3ltZW50Q29udHJvbGxlcj8udHlwZSA9PT0gRGVwbG95bWVudENvbnRyb2xsZXJUeXBlLkVYVEVSTkFMKSB7XG4gICAgICBBbm5vdGF0aW9ucy5vZih0aGlzKS5hZGRXYXJuaW5nKCd0YXNrRGVmaW5pdGlvbiBhbmQgbGF1bmNoVHlwZSBhcmUgYmxhbmtlZCBvdXQgd2hlbiB1c2luZyBleHRlcm5hbCBkZXBsb3ltZW50IGNvbnRyb2xsZXIuJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmNpcmN1aXRCcmVha2VyXG4gICAgICAgICYmIGRlcGxveW1lbnRDb250cm9sbGVyXG4gICAgICAgICYmIGRlcGxveW1lbnRDb250cm9sbGVyLnR5cGUgIT09IERlcGxveW1lbnRDb250cm9sbGVyVHlwZS5FQ1MpIHtcbiAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZEVycm9yKCdEZXBsb3ltZW50IGNpcmN1aXQgYnJlYWtlciByZXF1aXJlcyB0aGUgRUNTIGRlcGxveW1lbnQgY29udHJvbGxlci4nKTtcbiAgICB9XG4gICAgaWYgKHByb3BzLmRlcGxveW1lbnRDb250cm9sbGVyPy50eXBlID09PSBEZXBsb3ltZW50Q29udHJvbGxlclR5cGUuQ09ERV9ERVBMT1kpIHtcbiAgICAgIC8vIFN0cmlwIHRoZSByZXZpc2lvbiBJRCBmcm9tIHRoZSBzZXJ2aWNlJ3MgdGFzayBkZWZpbml0aW9uIHByb3BlcnR5IHRvXG4gICAgICAvLyBwcmV2ZW50IG5ldyB0YXNrIGRlZiByZXZpc2lvbnMgaW4gdGhlIHN0YWNrIGZyb20gdHJpZ2dlcmluZyB1cGRhdGVzXG4gICAgICAvLyB0byB0aGUgc3RhY2sncyBFQ1Mgc2VydmljZSByZXNvdXJjZVxuICAgICAgdGhpcy5yZXNvdXJjZS50YXNrRGVmaW5pdGlvbiA9IHRhc2tEZWZpbml0aW9uLmZhbWlseTtcbiAgICAgIHRoaXMubm9kZS5hZGREZXBlbmRlbmN5KHRhc2tEZWZpbml0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlcnZpY2VBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHRoaXMucmVzb3VyY2UucmVmLCB7XG4gICAgICBzZXJ2aWNlOiAnZWNzJyxcbiAgICAgIHJlc291cmNlOiAnc2VydmljZScsXG4gICAgICByZXNvdXJjZU5hbWU6IGAke3Byb3BzLmNsdXN0ZXIuY2x1c3Rlck5hbWV9LyR7dGhpcy5waHlzaWNhbE5hbWV9YCxcbiAgICB9KTtcbiAgICB0aGlzLnNlcnZpY2VOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUodGhpcy5yZXNvdXJjZS5hdHRyTmFtZSk7XG5cbiAgICB0aGlzLmNsdXN0ZXIgPSBwcm9wcy5jbHVzdGVyO1xuXG4gICAgaWYgKHByb3BzLmNsb3VkTWFwT3B0aW9ucykge1xuICAgICAgdGhpcy5lbmFibGVDbG91ZE1hcChwcm9wcy5jbG91ZE1hcE9wdGlvbnMpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5zZXJ2aWNlQ29ubmVjdENvbmZpZ3VyYXRpb24pIHtcbiAgICAgIHRoaXMuZW5hYmxlU2VydmljZUNvbm5lY3QocHJvcHMuc2VydmljZUNvbm5lY3RDb25maWd1cmF0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuZW5hYmxlRXhlY3V0ZUNvbW1hbmQpIHtcbiAgICAgIHRoaXMuZW5hYmxlRXhlY3V0ZUNvbW1hbmQoKTtcblxuICAgICAgY29uc3QgbG9nZ2luZyA9IHRoaXMuY2x1c3Rlci5leGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb24/LmxvZ2dpbmcgPz8gRXhlY3V0ZUNvbW1hbmRMb2dnaW5nLkRFRkFVTFQ7XG5cbiAgICAgIGlmICh0aGlzLmNsdXN0ZXIuZXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uPy5rbXNLZXkpIHtcbiAgICAgICAgdGhpcy5lbmFibGVFeGVjdXRlQ29tbWFuZEVuY3J5cHRpb24obG9nZ2luZyk7XG4gICAgICB9XG4gICAgICBpZiAobG9nZ2luZyAhPT0gRXhlY3V0ZUNvbW1hbmRMb2dnaW5nLk5PTkUpIHtcbiAgICAgICAgdGhpcy5leGVjdXRlQ29tbWFuZExvZ0NvbmZpZ3VyYXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5ub2RlLmRlZmF1bHRDaGlsZCA9IHRoaXMucmVzb3VyY2U7XG4gIH1cblxuICAvKiogICAqIEVuYWJsZSBTZXJ2aWNlIENvbm5lY3RcbiAgICovXG4gIHB1YmxpYyBlbmFibGVTZXJ2aWNlQ29ubmVjdChjb25maWc/OiBTZXJ2aWNlQ29ubmVjdFByb3BzKSB7XG4gICAgaWYgKHRoaXMuX3NlcnZpY2VDb25uZWN0Q29uZmlnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlcnZpY2UgY29ubmVjdCBjb25maWd1cmF0aW9uIGNhbm5vdCBiZSBzcGVjaWZpZWQgbW9yZSB0aGFuIG9uY2UuJyk7XG4gICAgfVxuXG4gICAgdGhpcy52YWxpZGF0ZVNlcnZpY2VDb25uZWN0Q29uZmlndXJhdGlvbihjb25maWcpO1xuXG4gICAgbGV0IGNmZyA9IGNvbmZpZyB8fCB7fTtcblxuICAgIC8qKlxuICAgICAqIE5hbWVzcGFjZSBhbHJlYWR5IGV4aXN0cyBhcyB2YWxpZGF0ZWQgaW4gdmFsaWRhdGVTZXJ2aWNlQ29ubmVjdENvbmZpZ3VyYXRpb24uXG4gICAgICogUmVzb2x2ZSB3aGljaCBuYW1lc3BhY2UgdG8gdXNlIGJ5IHBpY2tpbmc6XG4gICAgICogMS4gVGhlIG5hbWVzcGFjZSBkZWZpbmVkIGluIHNlcnZpY2UgY29ubmVjdCBjb25maWcuXG4gICAgICogMi4gVGhlIG5hbWVzcGFjZSBkZWZpbmVkIGluIHRoZSBjbHVzdGVyJ3MgZGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlIHByb3BlcnR5LlxuICAgICovXG4gICAgbGV0IG5hbWVzcGFjZTtcbiAgICBpZiAodGhpcy5jbHVzdGVyLmRlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSkge1xuICAgICAgbmFtZXNwYWNlID0gdGhpcy5jbHVzdGVyLmRlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZS5uYW1lc3BhY2VOYW1lO1xuICAgIH1cblxuICAgIGlmIChjZmcubmFtZXNwYWNlKSB7XG4gICAgICBuYW1lc3BhY2UgPSBjZmcubmFtZXNwYWNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1hcCBzZXJ2aWNlcyB0byBDRk4gcHJvcGVydHkgdHlwZXMuIFRoaXMgYmxvY2sgbWFuYWdlczpcbiAgICAgKiAxLiBGaW5kaW5nIHRoZSBjb3JyZWN0IHBvcnQuXG4gICAgICogMi4gQ2xpZW50IGFsaWFzIGVudW1lcmF0aW9uXG4gICAgICovXG4gICAgY29uc3Qgc2VydmljZXMgPSBjZmcuc2VydmljZXM/Lm1hcChzdmMgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyUG9ydCA9IHRoaXMudGFza0RlZmluaXRpb24uZmluZFBvcnRNYXBwaW5nQnlOYW1lKHN2Yy5wb3J0TWFwcGluZ05hbWUpPy5jb250YWluZXJQb3J0O1xuICAgICAgaWYgKCFjb250YWluZXJQb3J0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgUG9ydCBtYXBwaW5nIHdpdGggbmFtZSAke3N2Yy5wb3J0TWFwcGluZ05hbWV9IGRvZXMgbm90IGV4aXN0LmApO1xuICAgICAgfVxuICAgICAgY29uc3QgYWxpYXMgPSB7XG4gICAgICAgIHBvcnQ6IHN2Yy5wb3J0IHx8IGNvbnRhaW5lclBvcnQsXG4gICAgICAgIGRuc05hbWU6IHN2Yy5kbnNOYW1lLFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9ydE5hbWU6IHN2Yy5wb3J0TWFwcGluZ05hbWUsXG4gICAgICAgIGRpc2NvdmVyeU5hbWU6IHN2Yy5kaXNjb3ZlcnlOYW1lLFxuICAgICAgICBpbmdyZXNzUG9ydE92ZXJyaWRlOiBzdmMuaW5ncmVzc1BvcnRPdmVycmlkZSxcbiAgICAgICAgY2xpZW50QWxpYXNlczogW2FsaWFzXSxcbiAgICAgIH0gYXMgQ2ZuU2VydmljZS5TZXJ2aWNlQ29ubmVjdFNlcnZpY2VQcm9wZXJ0eTtcbiAgICB9KTtcblxuICAgIGxldCBsb2dDb25maWc6IExvZ0RyaXZlckNvbmZpZyB8IHVuZGVmaW5lZDtcbiAgICBpZiAoY2ZnLmxvZ0RyaXZlciAmJiB0aGlzLnRhc2tEZWZpbml0aW9uLmRlZmF1bHRDb250YWluZXIpIHtcbiAgICAgIC8vIERlZmF1bHQgY29udGFpbmVyIGV4aXN0ZW5jZSBpcyB2YWxpZGF0ZWQgaW4gdmFsaWRhdGVTZXJ2aWNlQ29ubmVjdENvbmZpZ3VyYXRpb24uXG4gICAgICAvLyBXZSBvbmx5IG5lZWQgdGhlIGRlZmF1bHQgY29udGFpbmVyIHNvIHRoYXQgYmluZCgpIGNhbiBnZXQgdGhlIHRhc2sgZGVmaW5pdGlvbiBmcm9tIHRoZSBjb250YWluZXIgZGVmaW5pdGlvbi5cbiAgICAgIGxvZ0NvbmZpZyA9IGNmZy5sb2dEcml2ZXIuYmluZCh0aGlzLCB0aGlzLnRhc2tEZWZpbml0aW9uLmRlZmF1bHRDb250YWluZXIpO1xuICAgIH1cblxuICAgIHRoaXMuX3NlcnZpY2VDb25uZWN0Q29uZmlnID0ge1xuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIGxvZ0NvbmZpZ3VyYXRpb246IGxvZ0NvbmZpZyxcbiAgICAgIG5hbWVzcGFjZTogbmFtZXNwYWNlLFxuICAgICAgc2VydmljZXM6IHNlcnZpY2VzLFxuICAgIH07XG4gIH07XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIFNlcnZpY2UgQ29ubmVjdCBDb25maWd1cmF0aW9uXG4gICAqL1xuICBwcml2YXRlIHZhbGlkYXRlU2VydmljZUNvbm5lY3RDb25maWd1cmF0aW9uKGNvbmZpZz86IFNlcnZpY2VDb25uZWN0UHJvcHMpIHtcbiAgICBpZiAoIXRoaXMudGFza0RlZmluaXRpb24uZGVmYXVsdENvbnRhaW5lcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUYXNrIGRlZmluaXRpb24gbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBjb250YWluZXIgdG8gZW5hYmxlIHNlcnZpY2UgY29ubmVjdC4nKTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayB0aGUgaW1wbGljaXQgZW5hYmxlIGNhc2U7IHdoZW4gY29uZmlnIGlzbid0IHNwZWNpZmllZCBvciBuYW1lc3BhY2UgaXNuJ3Qgc3BlY2lmaWVkLCB3ZSBuZWVkIHRvIGNoZWNrIHRoYXQgdGhlcmUgaXMgYSBuYW1lc3BhY2Ugb24gdGhlIGNsdXN0ZXIuXG4gICAgaWYgKCghY29uZmlnIHx8ICFjb25maWcubmFtZXNwYWNlKSAmJiAhdGhpcy5jbHVzdGVyLmRlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOYW1lc3BhY2UgbXVzdCBiZSBkZWZpbmVkIGVpdGhlciBpbiBzZXJ2aWNlQ29ubmVjdENvbmZpZyBvciBjbHVzdGVyLmRlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZScpO1xuICAgIH1cblxuICAgIC8vIFdoZW4gY29uZmlnIGlzbid0IHNwZWNpZmllZCwgcmV0dXJuLlxuICAgIGlmICghY29uZmlnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFjb25maWcuc2VydmljZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHBvcnROYW1lcyA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgICBjb25maWcuc2VydmljZXMuZm9yRWFjaChzZXJ2aWNlQ29ubmVjdFNlcnZpY2UgPT4ge1xuICAgICAgLy8gcG9ydCBtdXN0IGV4aXN0IG9uIHRoZSB0YXNrIGRlZmluaXRpb25cbiAgICAgIGlmICghdGhpcy50YXNrRGVmaW5pdGlvbi5maW5kUG9ydE1hcHBpbmdCeU5hbWUoc2VydmljZUNvbm5lY3RTZXJ2aWNlLnBvcnRNYXBwaW5nTmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBQb3J0IE1hcHBpbmcgJyR7c2VydmljZUNvbm5lY3RTZXJ2aWNlLnBvcnRNYXBwaW5nTmFtZX0nIGRvZXMgbm90IGV4aXN0IG9uIHRoZSB0YXNrIGRlZmluaXRpb24uYCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBDaGVjayB0aGF0IG5vIHR3byBzZXJ2aWNlIGNvbm5lY3Qgc2VydmljZXMgdXNlIHRoZSBzYW1lIGRpc2NvdmVyeSBuYW1lLlxuICAgICAgY29uc3QgZGlzY292ZXJ5TmFtZSA9IHNlcnZpY2VDb25uZWN0U2VydmljZS5kaXNjb3ZlcnlOYW1lIHx8IHNlcnZpY2VDb25uZWN0U2VydmljZS5wb3J0TWFwcGluZ05hbWU7XG4gICAgICBpZiAocG9ydE5hbWVzLmdldChzZXJ2aWNlQ29ubmVjdFNlcnZpY2UucG9ydE1hcHBpbmdOYW1lKT8uaW5jbHVkZXMoZGlzY292ZXJ5TmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgY3JlYXRlIG11bHRpcGxlIHNlcnZpY2VzIHdpdGggdGhlIGRpc2NvdmVyeU5hbWUgJyR7ZGlzY292ZXJ5TmFtZX0nLmApO1xuICAgICAgfVxuXG4gICAgICBsZXQgY3VycmVudERpc2NvdmVyaWVzID0gcG9ydE5hbWVzLmdldChzZXJ2aWNlQ29ubmVjdFNlcnZpY2UucG9ydE1hcHBpbmdOYW1lKTtcbiAgICAgIGlmICghY3VycmVudERpc2NvdmVyaWVzKSB7XG4gICAgICAgIHBvcnROYW1lcy5zZXQoc2VydmljZUNvbm5lY3RTZXJ2aWNlLnBvcnRNYXBwaW5nTmFtZSwgW2Rpc2NvdmVyeU5hbWVdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnREaXNjb3Zlcmllcy5wdXNoKGRpc2NvdmVyeU5hbWUpO1xuICAgICAgICBwb3J0TmFtZXMuc2V0KHNlcnZpY2VDb25uZWN0U2VydmljZS5wb3J0TWFwcGluZ05hbWUsIGN1cnJlbnREaXNjb3Zlcmllcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEluZ3Jlc3NQb3J0T3ZlcnJpZGUgc2hvdWxkIGJlIHdpdGhpbiB0aGUgdmFsaWQgcG9ydCByYW5nZSBpZiBpdCBleGlzdHMuXG4gICAgICBpZiAoc2VydmljZUNvbm5lY3RTZXJ2aWNlLmluZ3Jlc3NQb3J0T3ZlcnJpZGUgJiYgIXRoaXMuaXNWYWxpZFBvcnQoc2VydmljZUNvbm5lY3RTZXJ2aWNlLmluZ3Jlc3NQb3J0T3ZlcnJpZGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgaW5ncmVzc1BvcnRPdmVycmlkZSAke3NlcnZpY2VDb25uZWN0U2VydmljZS5pbmdyZXNzUG9ydE92ZXJyaWRlfSBpcyBub3QgdmFsaWQuYCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGNsaWVudEFsaWFzLnBvcnQgc2hvdWxkIGJlIHdpdGhpbiB0aGUgdmFsaWQgcG9ydCByYW5nZVxuICAgICAgaWYgKHNlcnZpY2VDb25uZWN0U2VydmljZS5wb3J0ICYmXG4gICAgICAgICF0aGlzLmlzVmFsaWRQb3J0KHNlcnZpY2VDb25uZWN0U2VydmljZS5wb3J0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENsaWVudCBBbGlhcyBwb3J0ICR7c2VydmljZUNvbm5lY3RTZXJ2aWNlLnBvcnR9IGlzIG5vdCB2YWxpZC5gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIGEgcG9ydCBpcyB2YWxpZFxuICAgKlxuICAgKiBAcGFyYW0gcG9ydDogVGhlIHBvcnQgbnVtYmVyXG4gICAqIEByZXR1cm5zIGJvb2xlYW4gd2hldGhlciB0aGUgcG9ydCBpcyB2YWxpZFxuICAgKi9cbiAgcHJpdmF0ZSBpc1ZhbGlkUG9ydChwb3J0PzogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhKHBvcnQgJiYgTnVtYmVyLmlzSW50ZWdlcihwb3J0KSAmJiBwb3J0ID49IEJhc2VTZXJ2aWNlLk1JTl9QT1JUICYmIHBvcnQgPD0gQmFzZVNlcnZpY2UuTUFYX1BPUlQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBDbG91ZE1hcCBzZXJ2aWNlIGNyZWF0ZWQgZm9yIHRoaXMgc2VydmljZSwgaWYgYW55LlxuICAgKi9cbiAgcHVibGljIGdldCBjbG91ZE1hcFNlcnZpY2UoKTogY2xvdWRtYXAuSVNlcnZpY2UgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLmNsb3VkbWFwU2VydmljZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGVwbG95bWVudENvbnRyb2xsZXIocHJvcHM6IEJhc2VTZXJ2aWNlUHJvcHMpOiBEZXBsb3ltZW50Q29udHJvbGxlciB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHByb3BzLmRlcGxveW1lbnRDb250cm9sbGVyKSB7XG4gICAgICAvLyBUaGUgY3VzdG9tZXIgaXMgYWx3YXlzIHJpZ2h0XG4gICAgICByZXR1cm4gcHJvcHMuZGVwbG95bWVudENvbnRyb2xsZXI7XG4gICAgfVxuICAgIGNvbnN0IGRpc2FibGVDaXJjdWl0QnJlYWtlckVjc0RlcGxveW1lbnRDb250cm9sbGVyRmVhdHVyZUZsYWcgPVxuICAgICAgICBGZWF0dXJlRmxhZ3Mub2YodGhpcykuaXNFbmFibGVkKGN4YXBpLkVDU19ESVNBQkxFX0VYUExJQ0lUX0RFUExPWU1FTlRfQ09OVFJPTExFUl9GT1JfQ0lSQ1VJVF9CUkVBS0VSKTtcblxuICAgIGlmICghZGlzYWJsZUNpcmN1aXRCcmVha2VyRWNzRGVwbG95bWVudENvbnRyb2xsZXJGZWF0dXJlRmxhZyAmJiBwcm9wcy5jaXJjdWl0QnJlYWtlcikge1xuICAgICAgLy8gVGhpcyBpcyB1bmRlc2lyYWJsZSBiZWhhdmlvciAodGhlIGNvbnRyb2xsZXIgaXMgaW1wbGljaXRseSBFQ1MgYW55d2F5IHdoZW4gbGVmdFxuICAgICAgLy8gdW5kZWZpbmVkLCBzbyBzcGVjaWZ5aW5nIGl0IGlzIG5vdCBuZWNlc3NhcnkgYnV0IERPRVMgdHJpZ2dlciBhIENGTiByZXBsYWNlbWVudClcbiAgICAgIC8vIGJ1dCB3ZSBsZWF2ZSBpdCBpbiBmb3IgYmFja3dhcmRzIGNvbXBhdC5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IERlcGxveW1lbnRDb250cm9sbGVyVHlwZS5FQ1MsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIGV4ZWN1dGVDb21tYW5kTG9nQ29uZmlndXJhdGlvbigpIHtcbiAgICBjb25zdCBsb2dDb25maWd1cmF0aW9uID0gdGhpcy5jbHVzdGVyLmV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbj8ubG9nQ29uZmlndXJhdGlvbjtcbiAgICB0aGlzLnRhc2tEZWZpbml0aW9uLmFkZFRvVGFza1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnbG9nczpEZXNjcmliZUxvZ0dyb3VwcycsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCBsb2dHcm91cEFybiA9IGxvZ0NvbmZpZ3VyYXRpb24/LmNsb3VkV2F0Y2hMb2dHcm91cCA/IGBhcm46JHt0aGlzLnN0YWNrLnBhcnRpdGlvbn06bG9nczoke3RoaXMuZW52LnJlZ2lvbn06JHt0aGlzLmVudi5hY2NvdW50fTpsb2ctZ3JvdXA6JHtsb2dDb25maWd1cmF0aW9uLmNsb3VkV2F0Y2hMb2dHcm91cC5sb2dHcm91cE5hbWV9OipgIDogJyonO1xuICAgIHRoaXMudGFza0RlZmluaXRpb24uYWRkVG9UYXNrUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsXG4gICAgICAgICdsb2dzOkRlc2NyaWJlTG9nU3RyZWFtcycsXG4gICAgICAgICdsb2dzOlB1dExvZ0V2ZW50cycsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbbG9nR3JvdXBBcm5dLFxuICAgIH0pKTtcblxuICAgIGlmIChsb2dDb25maWd1cmF0aW9uPy5zM0J1Y2tldD8uYnVja2V0TmFtZSkge1xuICAgICAgdGhpcy50YXNrRGVmaW5pdGlvbi5hZGRUb1Rhc2tSb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICdzMzpHZXRCdWNrZXRMb2NhdGlvbicsXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICB9KSk7XG4gICAgICB0aGlzLnRhc2tEZWZpbml0aW9uLmFkZFRvVGFza1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogW2Bhcm46JHt0aGlzLnN0YWNrLnBhcnRpdGlvbn06czM6Ojoke2xvZ0NvbmZpZ3VyYXRpb24uczNCdWNrZXQuYnVja2V0TmFtZX0vKmBdLFxuICAgICAgfSkpO1xuICAgICAgaWYgKGxvZ0NvbmZpZ3VyYXRpb24uczNFbmNyeXB0aW9uRW5hYmxlZCkge1xuICAgICAgICB0aGlzLnRhc2tEZWZpbml0aW9uLmFkZFRvVGFza1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICdzMzpHZXRFbmNyeXB0aW9uQ29uZmlndXJhdGlvbicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICByZXNvdXJjZXM6IFtgYXJuOiR7dGhpcy5zdGFjay5wYXJ0aXRpb259OnMzOjo6JHtsb2dDb25maWd1cmF0aW9uLnMzQnVja2V0LmJ1Y2tldE5hbWV9YF0sXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGVuYWJsZUV4ZWN1dGVDb21tYW5kRW5jcnlwdGlvbihsb2dnaW5nOiBFeGVjdXRlQ29tbWFuZExvZ2dpbmcpIHtcbiAgICB0aGlzLnRhc2tEZWZpbml0aW9uLmFkZFRvVGFza1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICAna21zOkRlY3J5cHQnLFxuICAgICAgICAna21zOkdlbmVyYXRlRGF0YUtleScsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbYCR7dGhpcy5jbHVzdGVyLmV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbj8ua21zS2V5Py5rZXlBcm59YF0sXG4gICAgfSkpO1xuXG4gICAgdGhpcy5jbHVzdGVyLmV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbj8ua21zS2V5Py5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ2ttczoqJyxcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQXJuUHJpbmNpcGFsKGBhcm46JHt0aGlzLnN0YWNrLnBhcnRpdGlvbn06aWFtOjoke3RoaXMuZW52LmFjY291bnR9OnJvb3RgKV0sXG4gICAgfSkpO1xuXG4gICAgaWYgKGxvZ2dpbmcgPT09IEV4ZWN1dGVDb21tYW5kTG9nZ2luZy5ERUZBVUxUIHx8IHRoaXMuY2x1c3Rlci5leGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb24/LmxvZ0NvbmZpZ3VyYXRpb24/LmNsb3VkV2F0Y2hFbmNyeXB0aW9uRW5hYmxlZCkge1xuICAgICAgdGhpcy5jbHVzdGVyLmV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbj8ua21zS2V5Py5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICdrbXM6RW5jcnlwdConLFxuICAgICAgICAgICdrbXM6RGVjcnlwdConLFxuICAgICAgICAgICdrbXM6UmVFbmNyeXB0KicsXG4gICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICAna21zOkRlc2NyaWJlKicsXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoYGxvZ3MuJHt0aGlzLmVudi5yZWdpb259LmFtYXpvbmF3cy5jb21gKV0sXG4gICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICBBcm5MaWtlOiB7ICdrbXM6RW5jcnlwdGlvbkNvbnRleHQ6YXdzOmxvZ3M6YXJuJzogYGFybjoke3RoaXMuc3RhY2sucGFydGl0aW9ufTpsb2dzOiR7dGhpcy5lbnYucmVnaW9ufToke3RoaXMuZW52LmFjY291bnR9OipgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCB0byBhdHRhY2ggdGhpcyBzZXJ2aWNlIHRvIGFuIEFwcGxpY2F0aW9uIExvYWQgQmFsYW5jZXIuXG4gICAqXG4gICAqIERvbid0IGNhbGwgdGhpcyBmdW5jdGlvbiBkaXJlY3RseS4gSW5zdGVhZCwgY2FsbCBgbGlzdGVuZXIuYWRkVGFyZ2V0cygpYFxuICAgKiB0byBhZGQgdGhpcyBzZXJ2aWNlIHRvIGEgbG9hZCBiYWxhbmNlci5cbiAgICovXG4gIHB1YmxpYyBhdHRhY2hUb0FwcGxpY2F0aW9uVGFyZ2V0R3JvdXAodGFyZ2V0R3JvdXA6IGVsYnYyLklBcHBsaWNhdGlvblRhcmdldEdyb3VwKTogZWxidjIuTG9hZEJhbGFuY2VyVGFyZ2V0UHJvcHMge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRMb2FkQmFsYW5jZXJUYXJnZXQuYXR0YWNoVG9BcHBsaWNhdGlvblRhcmdldEdyb3VwKHRhcmdldEdyb3VwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgdGhlIHNlcnZpY2UgYXMgYSB0YXJnZXQgb2YgYSBDbGFzc2ljIExvYWQgQmFsYW5jZXIgKENMQikuXG4gICAqXG4gICAqIERvbid0IGNhbGwgdGhpcy4gQ2FsbCBgbG9hZEJhbGFuY2VyLmFkZFRhcmdldCgpYCBpbnN0ZWFkLlxuICAgKi9cbiAgcHVibGljIGF0dGFjaFRvQ2xhc3NpY0xCKGxvYWRCYWxhbmNlcjogZWxiLkxvYWRCYWxhbmNlcik6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRMb2FkQmFsYW5jZXJUYXJnZXQuYXR0YWNoVG9DbGFzc2ljTEIobG9hZEJhbGFuY2VyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBsb2FkIGJhbGFuY2luZyB0YXJnZXQgZm9yIGEgc3BlY2lmaWMgY29udGFpbmVyIGFuZCBwb3J0LlxuICAgKlxuICAgKiBVc2UgdGhpcyBmdW5jdGlvbiB0byBjcmVhdGUgYSBsb2FkIGJhbGFuY2VyIHRhcmdldCBpZiB5b3Ugd2FudCB0byBsb2FkIGJhbGFuY2UgdG9cbiAgICogYW5vdGhlciBjb250YWluZXIgdGhhbiB0aGUgZmlyc3QgZXNzZW50aWFsIGNvbnRhaW5lciBvciB0aGUgZmlyc3QgbWFwcGVkIHBvcnQgb25cbiAgICogdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogVXNlIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhpcyBmdW5jdGlvbiB3aGVyZSB5b3Ugd291bGQgbm9ybWFsbHkgdXNlIGEgbG9hZCBiYWxhbmNlclxuICAgKiB0YXJnZXQsIGluc3RlYWQgb2YgdGhlIGBTZXJ2aWNlYCBvYmplY3QgaXRzZWxmLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBkZWNsYXJlIGNvbnN0IGxpc3RlbmVyOiBlbGJ2Mi5BcHBsaWNhdGlvbkxpc3RlbmVyO1xuICAgKiBkZWNsYXJlIGNvbnN0IHNlcnZpY2U6IGVjcy5CYXNlU2VydmljZTtcbiAgICogbGlzdGVuZXIuYWRkVGFyZ2V0cygnRUNTJywge1xuICAgKiAgIHBvcnQ6IDgwLFxuICAgKiAgIHRhcmdldHM6IFtzZXJ2aWNlLmxvYWRCYWxhbmNlclRhcmdldCh7XG4gICAqICAgICBjb250YWluZXJOYW1lOiAnTXlDb250YWluZXInLFxuICAgKiAgICAgY29udGFpbmVyUG9ydDogMTIzNCxcbiAgICogICB9KV0sXG4gICAqIH0pO1xuICAgKi9cbiAgcHVibGljIGxvYWRCYWxhbmNlclRhcmdldChvcHRpb25zOiBMb2FkQmFsYW5jZXJUYXJnZXRPcHRpb25zKTogSUVjc0xvYWRCYWxhbmNlclRhcmdldCB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpcy50YXNrRGVmaW5pdGlvbi5fdmFsaWRhdGVUYXJnZXQob3B0aW9ucyk7XG4gICAgY29uc3QgY29ubmVjdGlvbnMgPSBzZWxmLmNvbm5lY3Rpb25zO1xuICAgIHJldHVybiB7XG4gICAgICBhdHRhY2hUb0FwcGxpY2F0aW9uVGFyZ2V0R3JvdXAodGFyZ2V0R3JvdXA6IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXApOiBlbGJ2Mi5Mb2FkQmFsYW5jZXJUYXJnZXRQcm9wcyB7XG4gICAgICAgIHRhcmdldEdyb3VwLnJlZ2lzdGVyQ29ubmVjdGFibGUoc2VsZiwgc2VsZi50YXNrRGVmaW5pdGlvbi5fcG9ydFJhbmdlRnJvbVBvcnRNYXBwaW5nKHRhcmdldC5wb3J0TWFwcGluZykpO1xuICAgICAgICByZXR1cm4gc2VsZi5hdHRhY2hUb0VMQnYyKHRhcmdldEdyb3VwLCB0YXJnZXQuY29udGFpbmVyTmFtZSwgdGFyZ2V0LnBvcnRNYXBwaW5nLmNvbnRhaW5lclBvcnQpO1xuICAgICAgfSxcbiAgICAgIGF0dGFjaFRvTmV0d29ya1RhcmdldEdyb3VwKHRhcmdldEdyb3VwOiBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXApOiBlbGJ2Mi5Mb2FkQmFsYW5jZXJUYXJnZXRQcm9wcyB7XG4gICAgICAgIHJldHVybiBzZWxmLmF0dGFjaFRvRUxCdjIodGFyZ2V0R3JvdXAsIHRhcmdldC5jb250YWluZXJOYW1lLCB0YXJnZXQucG9ydE1hcHBpbmcuY29udGFpbmVyUG9ydCk7XG4gICAgICB9LFxuICAgICAgY29ubmVjdGlvbnMsXG4gICAgICBhdHRhY2hUb0NsYXNzaWNMQihsb2FkQmFsYW5jZXI6IGVsYi5Mb2FkQmFsYW5jZXIpOiB2b2lkIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuYXR0YWNoVG9FTEIobG9hZEJhbGFuY2VyLCB0YXJnZXQuY29udGFpbmVyTmFtZSwgdGFyZ2V0LnBvcnRNYXBwaW5nLmNvbnRhaW5lclBvcnQpO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGlzIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhbGwgbG9hZCBiYWxhbmNlciB0YXJnZXRzIHRvIGJlIHJlZ2lzdGVyZWQgaW4gdGhpcyBzZXJ2aWNlLCBhZGQgdGhlbSB0b1xuICAgKiB0YXJnZXQgZ3JvdXBzLCBhbmQgYXR0YWNoIHRhcmdldCBncm91cHMgdG8gbGlzdGVuZXJzIGFjY29yZGluZ2x5LlxuICAgKlxuICAgKiBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIHVzZSBgbGlzdGVuZXIuYWRkVGFyZ2V0cygpYCB0byBjcmVhdGUgdGFyZ2V0cyBhbmQgYWRkIHRoZW0gdG8gdGFyZ2V0IGdyb3Vwcy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogZGVjbGFyZSBjb25zdCBsaXN0ZW5lcjogZWxidjIuQXBwbGljYXRpb25MaXN0ZW5lcjtcbiAgICogZGVjbGFyZSBjb25zdCBzZXJ2aWNlOiBlY3MuQmFzZVNlcnZpY2U7XG4gICAqIHNlcnZpY2UucmVnaXN0ZXJMb2FkQmFsYW5jZXJUYXJnZXRzKFxuICAgKiAgIHtcbiAgICogICAgIGNvbnRhaW5lck5hbWU6ICd3ZWInLFxuICAgKiAgICAgY29udGFpbmVyUG9ydDogODAsXG4gICAqICAgICBuZXdUYXJnZXRHcm91cElkOiAnRUNTJyxcbiAgICogICAgIGxpc3RlbmVyOiBlY3MuTGlzdGVuZXJDb25maWcuYXBwbGljYXRpb25MaXN0ZW5lcihsaXN0ZW5lciwge1xuICAgKiAgICAgICBwcm90b2NvbDogZWxidjIuQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQU1xuICAgKiAgICAgfSksXG4gICAqICAgfSxcbiAgICogKVxuICAgKi9cbiAgcHVibGljIHJlZ2lzdGVyTG9hZEJhbGFuY2VyVGFyZ2V0cyguLi50YXJnZXRzOiBFY3NUYXJnZXRbXSkge1xuICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIHRhcmdldHMpIHtcbiAgICAgIHRhcmdldC5saXN0ZW5lci5hZGRUYXJnZXRzKHRhcmdldC5uZXdUYXJnZXRHcm91cElkLCB7XG4gICAgICAgIGNvbnRhaW5lck5hbWU6IHRhcmdldC5jb250YWluZXJOYW1lLFxuICAgICAgICBjb250YWluZXJQb3J0OiB0YXJnZXQuY29udGFpbmVyUG9ydCxcbiAgICAgICAgcHJvdG9jb2w6IHRhcmdldC5wcm90b2NvbCxcbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgdG8gYXR0YWNoIHRoaXMgc2VydmljZSB0byBhIE5ldHdvcmsgTG9hZCBCYWxhbmNlci5cbiAgICpcbiAgICogRG9uJ3QgY2FsbCB0aGlzIGZ1bmN0aW9uIGRpcmVjdGx5LiBJbnN0ZWFkLCBjYWxsIGBsaXN0ZW5lci5hZGRUYXJnZXRzKClgXG4gICAqIHRvIGFkZCB0aGlzIHNlcnZpY2UgdG8gYSBsb2FkIGJhbGFuY2VyLlxuICAgKi9cbiAgcHVibGljIGF0dGFjaFRvTmV0d29ya1RhcmdldEdyb3VwKHRhcmdldEdyb3VwOiBlbGJ2Mi5JTmV0d29ya1RhcmdldEdyb3VwKTogZWxidjIuTG9hZEJhbGFuY2VyVGFyZ2V0UHJvcHMge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRMb2FkQmFsYW5jZXJUYXJnZXQuYXR0YWNoVG9OZXR3b3JrVGFyZ2V0R3JvdXAodGFyZ2V0R3JvdXApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGF0dHJpYnV0ZSByZXByZXNlbnRpbmcgdGhlIG1pbmltdW0gYW5kIG1heGltdW0gdGFzayBjb3VudCBmb3IgYW4gQXV0b1NjYWxpbmdHcm91cC5cbiAgICovXG4gIHB1YmxpYyBhdXRvU2NhbGVUYXNrQ291bnQocHJvcHM6IGFwcHNjYWxpbmcuRW5hYmxlU2NhbGluZ1Byb3BzKSB7XG4gICAgaWYgKHRoaXMuc2NhbGFibGVUYXNrQ291bnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXV0b1NjYWxpbmcgb2YgdGFzayBjb3VudCBhbHJlYWR5IGVuYWJsZWQgZm9yIHRoaXMgc2VydmljZScpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNjYWxhYmxlVGFza0NvdW50ID0gbmV3IFNjYWxhYmxlVGFza0NvdW50KHRoaXMsICdUYXNrQ291bnQnLCB7XG4gICAgICBzZXJ2aWNlTmFtZXNwYWNlOiBhcHBzY2FsaW5nLlNlcnZpY2VOYW1lc3BhY2UuRUNTLFxuICAgICAgcmVzb3VyY2VJZDogYHNlcnZpY2UvJHt0aGlzLmNsdXN0ZXIuY2x1c3Rlck5hbWV9LyR7dGhpcy5zZXJ2aWNlTmFtZX1gLFxuICAgICAgZGltZW5zaW9uOiAnZWNzOnNlcnZpY2U6RGVzaXJlZENvdW50JyxcbiAgICAgIHJvbGU6IHRoaXMubWFrZUF1dG9TY2FsaW5nUm9sZSgpLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRW5hYmxlIENsb3VkTWFwIHNlcnZpY2UgZGlzY292ZXJ5IGZvciB0aGUgc2VydmljZVxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgY3JlYXRlZCBDbG91ZE1hcCBzZXJ2aWNlXG4gICAqL1xuICBwdWJsaWMgZW5hYmxlQ2xvdWRNYXAob3B0aW9uczogQ2xvdWRNYXBPcHRpb25zKTogY2xvdWRtYXAuU2VydmljZSB7XG4gICAgY29uc3Qgc2ROYW1lc3BhY2UgPSBvcHRpb25zLmNsb3VkTWFwTmFtZXNwYWNlID8/IHRoaXMuY2x1c3Rlci5kZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2U7XG4gICAgaWYgKHNkTmFtZXNwYWNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGVuYWJsZSBzZXJ2aWNlIGRpc2NvdmVyeSBpZiBhIENsb3VkbWFwIE5hbWVzcGFjZSBoYXMgbm90IGJlZW4gY3JlYXRlZCBpbiB0aGUgY2x1c3Rlci4nKTtcbiAgICB9XG5cbiAgICBpZiAoc2ROYW1lc3BhY2UudHlwZSA9PT0gY2xvdWRtYXAuTmFtZXNwYWNlVHlwZS5IVFRQKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBlbmFibGUgRE5TIHNlcnZpY2UgZGlzY292ZXJ5IGZvciBIVFRQIENsb3VkbWFwIE5hbWVzcGFjZS4nKTtcbiAgICB9XG5cbiAgICAvLyBEZXRlcm1pbmUgRE5TIHR5cGUgYmFzZWQgb24gbmV0d29yayBtb2RlXG4gICAgY29uc3QgbmV0d29ya01vZGUgPSB0aGlzLnRhc2tEZWZpbml0aW9uLm5ldHdvcmtNb2RlO1xuICAgIGlmIChuZXR3b3JrTW9kZSA9PT0gTmV0d29ya01vZGUuTk9ORSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXNlIGEgc2VydmljZSBkaXNjb3ZlcnkgaWYgTmV0d29ya01vZGUgaXMgTm9uZS4gVXNlIEJyaWRnZSwgSG9zdCBvciBBd3NWcGMgaW5zdGVhZC4nKTtcbiAgICB9XG5cbiAgICAvLyBCcmlkZ2Ugb3IgaG9zdCBuZXR3b3JrIG1vZGUgcmVxdWlyZXMgU1JWIHJlY29yZHNcbiAgICBsZXQgZG5zUmVjb3JkVHlwZSA9IG9wdGlvbnMuZG5zUmVjb3JkVHlwZTtcblxuICAgIGlmIChuZXR3b3JrTW9kZSA9PT0gTmV0d29ya01vZGUuQlJJREdFIHx8IG5ldHdvcmtNb2RlID09PSBOZXR3b3JrTW9kZS5IT1NUKSB7XG4gICAgICBpZiAoZG5zUmVjb3JkVHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRuc1JlY29yZFR5cGUgPSBjbG91ZG1hcC5EbnNSZWNvcmRUeXBlLlNSVjtcbiAgICAgIH1cbiAgICAgIGlmIChkbnNSZWNvcmRUeXBlICE9PSBjbG91ZG1hcC5EbnNSZWNvcmRUeXBlLlNSVikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NSViByZWNvcmRzIG11c3QgYmUgdXNlZCB3aGVuIG5ldHdvcmsgbW9kZSBpcyBCcmlkZ2Ugb3IgSG9zdC4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEZWZhdWx0IEROUyByZWNvcmQgdHlwZSBmb3IgQXdzVnBjIG5ldHdvcmsgbW9kZSBpcyBBIFJlY29yZHNcbiAgICBpZiAobmV0d29ya01vZGUgPT09IE5ldHdvcmtNb2RlLkFXU19WUEMpIHtcbiAgICAgIGlmIChkbnNSZWNvcmRUeXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZG5zUmVjb3JkVHlwZSA9IGNsb3VkbWFwLkRuc1JlY29yZFR5cGUuQTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB7IGNvbnRhaW5lck5hbWUsIGNvbnRhaW5lclBvcnQgfSA9IGRldGVybWluZUNvbnRhaW5lck5hbWVBbmRQb3J0KHtcbiAgICAgIHRhc2tEZWZpbml0aW9uOiB0aGlzLnRhc2tEZWZpbml0aW9uLFxuICAgICAgZG5zUmVjb3JkVHlwZTogZG5zUmVjb3JkVHlwZSEsXG4gICAgICBjb250YWluZXI6IG9wdGlvbnMuY29udGFpbmVyLFxuICAgICAgY29udGFpbmVyUG9ydDogb3B0aW9ucy5jb250YWluZXJQb3J0LFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2xvdWRtYXBTZXJ2aWNlID0gbmV3IGNsb3VkbWFwLlNlcnZpY2UodGhpcywgJ0Nsb3VkbWFwU2VydmljZScsIHtcbiAgICAgIG5hbWVzcGFjZTogc2ROYW1lc3BhY2UsXG4gICAgICBuYW1lOiBvcHRpb25zLm5hbWUsXG4gICAgICBkbnNSZWNvcmRUeXBlOiBkbnNSZWNvcmRUeXBlISxcbiAgICAgIGN1c3RvbUhlYWx0aENoZWNrOiB7IGZhaWx1cmVUaHJlc2hvbGQ6IG9wdGlvbnMuZmFpbHVyZVRocmVzaG9sZCB8fCAxIH0sXG4gICAgICBkbnNUdGw6IG9wdGlvbnMuZG5zVHRsLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VydmljZUFybiA9IGNsb3VkbWFwU2VydmljZS5zZXJ2aWNlQXJuO1xuXG4gICAgLy8gYWRkIENsb3VkbWFwIHNlcnZpY2UgdG8gdGhlIEVDUyBTZXJ2aWNlJ3Mgc2VydmljZVJlZ2lzdHJ5XG4gICAgdGhpcy5hZGRTZXJ2aWNlUmVnaXN0cnkoe1xuICAgICAgYXJuOiBzZXJ2aWNlQXJuLFxuICAgICAgY29udGFpbmVyTmFtZSxcbiAgICAgIGNvbnRhaW5lclBvcnQsXG4gICAgfSk7XG5cbiAgICB0aGlzLmNsb3VkbWFwU2VydmljZSA9IGNsb3VkbWFwU2VydmljZTtcblxuICAgIHJldHVybiBjbG91ZG1hcFNlcnZpY2U7XG4gIH1cblxuICAvKipcbiAgICogQXNzb2NpYXRlcyB0aGlzIHNlcnZpY2Ugd2l0aCBhIENsb3VkTWFwIHNlcnZpY2VcbiAgICovXG4gIHB1YmxpYyBhc3NvY2lhdGVDbG91ZE1hcFNlcnZpY2Uob3B0aW9uczogQXNzb2NpYXRlQ2xvdWRNYXBTZXJ2aWNlT3B0aW9ucyk6IHZvaWQge1xuICAgIGNvbnN0IHNlcnZpY2UgPSBvcHRpb25zLnNlcnZpY2U7XG5cbiAgICBjb25zdCB7IGNvbnRhaW5lck5hbWUsIGNvbnRhaW5lclBvcnQgfSA9IGRldGVybWluZUNvbnRhaW5lck5hbWVBbmRQb3J0KHtcbiAgICAgIHRhc2tEZWZpbml0aW9uOiB0aGlzLnRhc2tEZWZpbml0aW9uLFxuICAgICAgZG5zUmVjb3JkVHlwZTogc2VydmljZS5kbnNSZWNvcmRUeXBlLFxuICAgICAgY29udGFpbmVyOiBvcHRpb25zLmNvbnRhaW5lcixcbiAgICAgIGNvbnRhaW5lclBvcnQ6IG9wdGlvbnMuY29udGFpbmVyUG9ydCxcbiAgICB9KTtcblxuICAgIC8vIGFkZCBDbG91ZG1hcCBzZXJ2aWNlIHRvIHRoZSBFQ1MgU2VydmljZSdzIHNlcnZpY2VSZWdpc3RyeVxuICAgIHRoaXMuYWRkU2VydmljZVJlZ2lzdHJ5KHtcbiAgICAgIGFybjogc2VydmljZS5zZXJ2aWNlQXJuLFxuICAgICAgY29udGFpbmVyTmFtZSxcbiAgICAgIGNvbnRhaW5lclBvcnQsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgc3BlY2lmaWVkIENsb3VkV2F0Y2ggbWV0cmljIG5hbWUgZm9yIHRoaXMgc2VydmljZS5cbiAgICovXG4gIHB1YmxpYyBtZXRyaWMobWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIG5hbWVzcGFjZTogJ0FXUy9FQ1MnLFxuICAgICAgbWV0cmljTmFtZSxcbiAgICAgIGRpbWVuc2lvbnNNYXA6IHsgQ2x1c3Rlck5hbWU6IHRoaXMuY2x1c3Rlci5jbHVzdGVyTmFtZSwgU2VydmljZU5hbWU6IHRoaXMuc2VydmljZU5hbWUgfSxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pLmF0dGFjaFRvKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIENsb3VkV2F0Y2ggbWV0cmljIGZvciB0aGlzIHNlcnZpY2UncyBtZW1vcnkgdXRpbGl6YXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNNZW1vcnlVdGlsaXphdGlvbihwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWMoJ01lbW9yeVV0aWxpemF0aW9uJywgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIENsb3VkV2F0Y2ggbWV0cmljIGZvciB0aGlzIHNlcnZpY2UncyBDUFUgdXRpbGl6YXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNDcHVVdGlsaXphdGlvbihwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWMoJ0NQVVV0aWxpemF0aW9uJywgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCB0byBjcmVhdGUgYSBuZXR3b3JrQ29uZmlndXJhdGlvbi5cbiAgICogQGRlcHJlY2F0ZWQgdXNlIGNvbmZpZ3VyZUF3c1ZwY05ldHdvcmtpbmdXaXRoU2VjdXJpdHlHcm91cHMgaW5zdGVhZC5cbiAgICovXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gIHByb3RlY3RlZCBjb25maWd1cmVBd3NWcGNOZXR3b3JraW5nKHZwYzogZWMyLklWcGMsIGFzc2lnblB1YmxpY0lwPzogYm9vbGVhbiwgdnBjU3VibmV0cz86IGVjMi5TdWJuZXRTZWxlY3Rpb24sIHNlY3VyaXR5R3JvdXA/OiBlYzIuSVNlY3VyaXR5R3JvdXApIHtcbiAgICBpZiAodnBjU3VibmV0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB2cGNTdWJuZXRzID0gYXNzaWduUHVibGljSXAgPyB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9IDoge307XG4gICAgfVxuICAgIGlmIChzZWN1cml0eUdyb3VwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgJ1NlY3VyaXR5R3JvdXAnLCB7IHZwYyB9KTtcbiAgICB9XG4gICAgdGhpcy5jb25uZWN0aW9ucy5hZGRTZWN1cml0eUdyb3VwKHNlY3VyaXR5R3JvdXApO1xuXG4gICAgdGhpcy5uZXR3b3JrQ29uZmlndXJhdGlvbiA9IHtcbiAgICAgIGF3c3ZwY0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgYXNzaWduUHVibGljSXA6IGFzc2lnblB1YmxpY0lwID8gJ0VOQUJMRUQnIDogJ0RJU0FCTEVEJyxcbiAgICAgICAgc3VibmV0czogdnBjLnNlbGVjdFN1Ym5ldHModnBjU3VibmV0cykuc3VibmV0SWRzLFxuICAgICAgICBzZWN1cml0eUdyb3VwczogTGF6eS5saXN0KHsgcHJvZHVjZTogKCkgPT4gW3NlY3VyaXR5R3JvdXAhLnNlY3VyaXR5R3JvdXBJZF0gfSksXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIHRvIGNyZWF0ZSBhIG5ldHdvcmtDb25maWd1cmF0aW9uLlxuICAgKi9cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgcHJvdGVjdGVkIGNvbmZpZ3VyZUF3c1ZwY05ldHdvcmtpbmdXaXRoU2VjdXJpdHlHcm91cHModnBjOiBlYzIuSVZwYywgYXNzaWduUHVibGljSXA/OiBib29sZWFuLCB2cGNTdWJuZXRzPzogZWMyLlN1Ym5ldFNlbGVjdGlvbiwgc2VjdXJpdHlHcm91cHM/OiBlYzIuSVNlY3VyaXR5R3JvdXBbXSkge1xuICAgIGlmICh2cGNTdWJuZXRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZwY1N1Ym5ldHMgPSBhc3NpZ25QdWJsaWNJcCA/IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDIH0gOiB7fTtcbiAgICB9XG4gICAgaWYgKHNlY3VyaXR5R3JvdXBzID09PSB1bmRlZmluZWQgfHwgc2VjdXJpdHlHcm91cHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBzZWN1cml0eUdyb3VwcyA9IFtuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgJ1NlY3VyaXR5R3JvdXAnLCB7IHZwYyB9KV07XG4gICAgfVxuXG4gICAgc2VjdXJpdHlHcm91cHMuZm9yRWFjaCgoc2cpID0+IHsgdGhpcy5jb25uZWN0aW9ucy5hZGRTZWN1cml0eUdyb3VwKHNnKTsgfSwgdGhpcyk7XG5cbiAgICB0aGlzLm5ldHdvcmtDb25maWd1cmF0aW9uID0ge1xuICAgICAgYXdzdnBjQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBhc3NpZ25QdWJsaWNJcDogYXNzaWduUHVibGljSXAgPyAnRU5BQkxFRCcgOiAnRElTQUJMRUQnLFxuICAgICAgICBzdWJuZXRzOiB2cGMuc2VsZWN0U3VibmV0cyh2cGNTdWJuZXRzKS5zdWJuZXRJZHMsXG4gICAgICAgIHNlY3VyaXR5R3JvdXBzOiBzZWN1cml0eUdyb3Vwcy5tYXAoKHNnKSA9PiBzZy5zZWN1cml0eUdyb3VwSWQpLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJTZXJ2aWNlUmVnaXN0cnkocmVnaXN0cnk6IFNlcnZpY2VSZWdpc3RyeSk6IENmblNlcnZpY2UuU2VydmljZVJlZ2lzdHJ5UHJvcGVydHkge1xuICAgIHJldHVybiB7XG4gICAgICByZWdpc3RyeUFybjogcmVnaXN0cnkuYXJuLFxuICAgICAgY29udGFpbmVyTmFtZTogcmVnaXN0cnkuY29udGFpbmVyTmFtZSxcbiAgICAgIGNvbnRhaW5lclBvcnQ6IHJlZ2lzdHJ5LmNvbnRhaW5lclBvcnQsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGFyZWQgbG9naWMgZm9yIGF0dGFjaGluZyB0byBhbiBFTEJcbiAgICovXG4gIHByaXZhdGUgYXR0YWNoVG9FTEIobG9hZEJhbGFuY2VyOiBlbGIuTG9hZEJhbGFuY2VyLCBjb250YWluZXJOYW1lOiBzdHJpbmcsIGNvbnRhaW5lclBvcnQ6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLnRhc2tEZWZpbml0aW9uLm5ldHdvcmtNb2RlID09PSBOZXR3b3JrTW9kZS5BV1NfVlBDKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2UgYSBDbGFzc2ljIExvYWQgQmFsYW5jZXIgaWYgTmV0d29ya01vZGUgaXMgQXdzVnBjLiBVc2UgSG9zdCBvciBCcmlkZ2UgaW5zdGVhZC4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudGFza0RlZmluaXRpb24ubmV0d29ya01vZGUgPT09IE5ldHdvcmtNb2RlLk5PTkUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVzZSBhIENsYXNzaWMgTG9hZCBCYWxhbmNlciBpZiBOZXR3b3JrTW9kZSBpcyBOb25lLiBVc2UgSG9zdCBvciBCcmlkZ2UgaW5zdGVhZC4nKTtcbiAgICB9XG5cbiAgICB0aGlzLmxvYWRCYWxhbmNlcnMucHVzaCh7XG4gICAgICBsb2FkQmFsYW5jZXJOYW1lOiBsb2FkQmFsYW5jZXIubG9hZEJhbGFuY2VyTmFtZSxcbiAgICAgIGNvbnRhaW5lck5hbWUsXG4gICAgICBjb250YWluZXJQb3J0LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoYXJlZCBsb2dpYyBmb3IgYXR0YWNoaW5nIHRvIGFuIEVMQnYyXG4gICAqL1xuICBwcml2YXRlIGF0dGFjaFRvRUxCdjIodGFyZ2V0R3JvdXA6IGVsYnYyLklUYXJnZXRHcm91cCwgY29udGFpbmVyTmFtZTogc3RyaW5nLCBjb250YWluZXJQb3J0OiBudW1iZXIpOiBlbGJ2Mi5Mb2FkQmFsYW5jZXJUYXJnZXRQcm9wcyB7XG4gICAgaWYgKHRoaXMudGFza0RlZmluaXRpb24ubmV0d29ya01vZGUgPT09IE5ldHdvcmtNb2RlLk5PTkUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHVzZSBhIGxvYWQgYmFsYW5jZXIgaWYgTmV0d29ya01vZGUgaXMgTm9uZS4gVXNlIEJyaWRnZSwgSG9zdCBvciBBd3NWcGMgaW5zdGVhZC4nKTtcbiAgICB9XG5cbiAgICB0aGlzLmxvYWRCYWxhbmNlcnMucHVzaCh7XG4gICAgICB0YXJnZXRHcm91cEFybjogdGFyZ2V0R3JvdXAudGFyZ2V0R3JvdXBBcm4sXG4gICAgICBjb250YWluZXJOYW1lLFxuICAgICAgY29udGFpbmVyUG9ydCxcbiAgICB9KTtcblxuICAgIC8vIFNlcnZpY2UgY3JlYXRpb24gY2FuIG9ubHkgaGFwcGVuIGFmdGVyIHRoZSBsb2FkIGJhbGFuY2VyIGhhc1xuICAgIC8vIGJlZW4gYXNzb2NpYXRlZCB3aXRoIG91ciB0YXJnZXQgZ3JvdXAocyksIHNvIGFkZCBvcmRlcmluZyBkZXBlbmRlbmN5LlxuICAgIHRoaXMucmVzb3VyY2Uubm9kZS5hZGREZXBlbmRlbmN5KHRhcmdldEdyb3VwLmxvYWRCYWxhbmNlckF0dGFjaGVkKTtcblxuICAgIGNvbnN0IHRhcmdldFR5cGUgPSB0aGlzLnRhc2tEZWZpbml0aW9uLm5ldHdvcmtNb2RlID09PSBOZXR3b3JrTW9kZS5BV1NfVlBDID8gZWxidjIuVGFyZ2V0VHlwZS5JUCA6IGVsYnYyLlRhcmdldFR5cGUuSU5TVEFOQ0U7XG4gICAgcmV0dXJuIHsgdGFyZ2V0VHlwZSB9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgZGVmYXVsdExvYWRCYWxhbmNlclRhcmdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkQmFsYW5jZXJUYXJnZXQoe1xuICAgICAgY29udGFpbmVyTmFtZTogdGhpcy50YXNrRGVmaW5pdGlvbi5kZWZhdWx0Q29udGFpbmVyIS5jb250YWluZXJOYW1lLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHRoZSByb2xlIHRoYXQgd2lsbCBiZSB1c2VkIGZvciBhdXRvc2NhbGluZyB0aGlzIHNlcnZpY2VcbiAgICovXG4gIHByaXZhdGUgbWFrZUF1dG9TY2FsaW5nUm9sZSgpOiBpYW0uSVJvbGUge1xuICAgIC8vIFVzZSBhIFNlcnZpY2UgTGlua2VkIFJvbGUuXG4gICAgcmV0dXJuIGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHRoaXMsICdTY2FsaW5nUm9sZScsIFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICByZWdpb246ICcnLFxuICAgICAgc2VydmljZTogJ2lhbScsXG4gICAgICByZXNvdXJjZTogJ3JvbGUvYXdzLXNlcnZpY2Utcm9sZS9lY3MuYXBwbGljYXRpb24tYXV0b3NjYWxpbmcuYW1hem9uYXdzLmNvbScsXG4gICAgICByZXNvdXJjZU5hbWU6ICdBV1NTZXJ2aWNlUm9sZUZvckFwcGxpY2F0aW9uQXV0b1NjYWxpbmdfRUNTU2VydmljZScsXG4gICAgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc29jaWF0ZSBTZXJ2aWNlIERpc2NvdmVyeSAoQ2xvdWQgTWFwKSBzZXJ2aWNlXG4gICAqL1xuICBwcml2YXRlIGFkZFNlcnZpY2VSZWdpc3RyeShyZWdpc3RyeTogU2VydmljZVJlZ2lzdHJ5KSB7XG4gICAgaWYgKHRoaXMuc2VydmljZVJlZ2lzdHJpZXMubGVuZ3RoID49IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFzc29jaWF0ZSB3aXRoIHRoZSBnaXZlbiBzZXJ2aWNlIGRpc2NvdmVyeSByZWdpc3RyeS4gRUNTIHN1cHBvcnRzIGF0IG1vc3Qgb25lIHNlcnZpY2UgcmVnaXN0cnkgcGVyIHNlcnZpY2UuJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3IgPSB0aGlzLnJlbmRlclNlcnZpY2VSZWdpc3RyeShyZWdpc3RyeSk7XG4gICAgdGhpcy5zZXJ2aWNlUmVnaXN0cmllcy5wdXNoKHNyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgUmV0dXJuIHRoZSBkZWZhdWx0IGdyYWNlIHBlcmlvZCB3aGVuIGxvYWQgYmFsYW5jZXJzIGFyZSBjb25maWd1cmVkIGFuZFxuICAgKiAgaGVhbHRoQ2hlY2tHcmFjZVBlcmlvZCBpcyBub3QgYWxyZWFkeSBzZXRcbiAgICovXG4gIHByaXZhdGUgZXZhbHVhdGVIZWFsdGhHcmFjZVBlcmlvZChwcm92aWRlZEhlYWx0aENoZWNrR3JhY2VQZXJpb2Q/OiBEdXJhdGlvbik6IElSZXNvbHZhYmxlIHtcbiAgICByZXR1cm4gTGF6eS5hbnkoe1xuICAgICAgcHJvZHVjZTogKCkgPT4gcHJvdmlkZWRIZWFsdGhDaGVja0dyYWNlUGVyaW9kPy50b1NlY29uZHMoKSA/PyAodGhpcy5sb2FkQmFsYW5jZXJzLmxlbmd0aCA+IDAgPyA2MCA6IHVuZGVmaW5lZCksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGVuYWJsZUV4ZWN1dGVDb21tYW5kKCkge1xuICAgIHRoaXMudGFza0RlZmluaXRpb24uYWRkVG9UYXNrUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICdzc21tZXNzYWdlczpDcmVhdGVDb250cm9sQ2hhbm5lbCcsXG4gICAgICAgICdzc21tZXNzYWdlczpDcmVhdGVEYXRhQ2hhbm5lbCcsXG4gICAgICAgICdzc21tZXNzYWdlczpPcGVuQ29udHJvbENoYW5uZWwnLFxuICAgICAgICAnc3NtbWVzc2FnZXM6T3BlbkRhdGFDaGFubmVsJyxcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIH0pKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBvcHRpb25zIHRvIGVuYWJsaW5nIEFXUyBDbG91ZCBNYXAgZm9yIGFuIEFtYXpvbiBFQ1Mgc2VydmljZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbG91ZE1hcE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIENsb3VkIE1hcCBzZXJ2aWNlIHRvIGF0dGFjaCB0byB0aGUgRUNTIHNlcnZpY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IENsb3VkRm9ybWF0aW9uLWdlbmVyYXRlZCBuYW1lXG4gICAqL1xuICByZWFkb25seSBuYW1lPzogc3RyaW5nLFxuXG4gIC8qKlxuICAgKiBUaGUgc2VydmljZSBkaXNjb3ZlcnkgbmFtZXNwYWNlIGZvciB0aGUgQ2xvdWQgTWFwIHNlcnZpY2UgdG8gYXR0YWNoIHRvIHRoZSBFQ1Mgc2VydmljZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgZGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlIGFzc29jaWF0ZWQgdG8gdGhlIGNsdXN0ZXJcbiAgICovXG4gIHJlYWRvbmx5IGNsb3VkTWFwTmFtZXNwYWNlPzogY2xvdWRtYXAuSU5hbWVzcGFjZTtcblxuICAvKipcbiAgICogVGhlIEROUyByZWNvcmQgdHlwZSB0aGF0IHlvdSB3YW50IEFXUyBDbG91ZCBNYXAgdG8gY3JlYXRlLiBUaGUgc3VwcG9ydGVkIHJlY29yZCB0eXBlcyBhcmUgQSBvciBTUlYuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRG5zUmVjb3JkVHlwZS5BIGlmIFRhc2tEZWZpbml0aW9uLm5ldHdvcmtNb2RlID0gQVdTX1ZQQywgb3RoZXJ3aXNlIERuc1JlY29yZFR5cGUuU1JWXG4gICAqL1xuICByZWFkb25seSBkbnNSZWNvcmRUeXBlPzogY2xvdWRtYXAuRG5zUmVjb3JkVHlwZS5BIHwgY2xvdWRtYXAuRG5zUmVjb3JkVHlwZS5TUlYsXG5cbiAgLyoqXG4gICAqIFRoZSBhbW91bnQgb2YgdGltZSB0aGF0IHlvdSB3YW50IEROUyByZXNvbHZlcnMgdG8gY2FjaGUgdGhlIHNldHRpbmdzIGZvciB0aGlzIHJlY29yZC5cbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24ubWludXRlcygxKVxuICAgKi9cbiAgcmVhZG9ubHkgZG5zVHRsPzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgMzAtc2Vjb25kIGludGVydmFscyB0aGF0IHlvdSB3YW50IENsb3VkIE1hcCB0byB3YWl0IGFmdGVyIHJlY2VpdmluZyBhbiBVcGRhdGVJbnN0YW5jZUN1c3RvbUhlYWx0aFN0YXR1c1xuICAgKiByZXF1ZXN0IGJlZm9yZSBpdCBjaGFuZ2VzIHRoZSBoZWFsdGggc3RhdHVzIG9mIGEgc2VydmljZSBpbnN0YW5jZS5cbiAgICpcbiAgICogTk9URTogVGhpcyBpcyB1c2VkIGZvciBIZWFsdGhDaGVja0N1c3RvbUNvbmZpZ1xuICAgKi9cbiAgcmVhZG9ubHkgZmFpbHVyZVRocmVzaG9sZD86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGNvbnRhaW5lciB0byBwb2ludCB0byBmb3IgYSBTUlYgcmVjb3JkLlxuICAgKiBAZGVmYXVsdCAtIHRoZSB0YXNrIGRlZmluaXRpb24ncyBkZWZhdWx0IGNvbnRhaW5lclxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyPzogQ29udGFpbmVyRGVmaW5pdGlvbjtcblxuICAvKipcbiAgICogVGhlIHBvcnQgdG8gcG9pbnQgdG8gZm9yIGEgU1JWIHJlY29yZC5cbiAgICogQGRlZmF1bHQgLSB0aGUgZGVmYXVsdCBwb3J0IG9mIHRoZSB0YXNrIGRlZmluaXRpb24ncyBkZWZhdWx0IGNvbnRhaW5lclxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyUG9ydD86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBUaGUgb3B0aW9ucyBmb3IgdXNpbmcgYSBjbG91ZG1hcCBzZXJ2aWNlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFzc29jaWF0ZUNsb3VkTWFwU2VydmljZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGNsb3VkbWFwIHNlcnZpY2UgdG8gcmVnaXN0ZXIgd2l0aC5cbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2U6IGNsb3VkbWFwLklTZXJ2aWNlO1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGFpbmVyIHRvIHBvaW50IHRvIGZvciBhIFNSViByZWNvcmQuXG4gICAqIEBkZWZhdWx0IC0gdGhlIHRhc2sgZGVmaW5pdGlvbidzIGRlZmF1bHQgY29udGFpbmVyXG4gICAqL1xuICByZWFkb25seSBjb250YWluZXI/OiBDb250YWluZXJEZWZpbml0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgcG9ydCB0byBwb2ludCB0byBmb3IgYSBTUlYgcmVjb3JkLlxuICAgKiBAZGVmYXVsdCAtIHRoZSBkZWZhdWx0IHBvcnQgb2YgdGhlIHRhc2sgZGVmaW5pdGlvbidzIGRlZmF1bHQgY29udGFpbmVyXG4gICAqL1xuICByZWFkb25seSBjb250YWluZXJQb3J0PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIFNlcnZpY2UgUmVnaXN0cnkgZm9yIEVDUyBzZXJ2aWNlXG4gKi9cbmludGVyZmFjZSBTZXJ2aWNlUmVnaXN0cnkge1xuICAvKipcbiAgICogQXJuIG9mIHRoZSBDbG91ZCBNYXAgU2VydmljZSB0aGF0IHdpbGwgcmVnaXN0ZXIgYSBDbG91ZCBNYXAgSW5zdGFuY2UgZm9yIHlvdXIgRUNTIFNlcnZpY2VcbiAgICovXG4gIHJlYWRvbmx5IGFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY29udGFpbmVyIG5hbWUgdmFsdWUsIGFscmVhZHkgc3BlY2lmaWVkIGluIHRoZSB0YXNrIGRlZmluaXRpb24sIHRvIGJlIHVzZWQgZm9yIHlvdXIgc2VydmljZSBkaXNjb3Zlcnkgc2VydmljZS5cbiAgICogSWYgdGhlIHRhc2sgZGVmaW5pdGlvbiB0aGF0IHlvdXIgc2VydmljZSB0YXNrIHNwZWNpZmllcyB1c2VzIHRoZSBicmlkZ2Ugb3IgaG9zdCBuZXR3b3JrIG1vZGUsXG4gICAqIHlvdSBtdXN0IHNwZWNpZnkgYSBjb250YWluZXJOYW1lIGFuZCBjb250YWluZXJQb3J0IGNvbWJpbmF0aW9uIGZyb20gdGhlIHRhc2sgZGVmaW5pdGlvbi5cbiAgICogSWYgdGhlIHRhc2sgZGVmaW5pdGlvbiB0aGF0IHlvdXIgc2VydmljZSB0YXNrIHNwZWNpZmllcyB1c2VzIHRoZSBhd3N2cGMgbmV0d29yayBtb2RlIGFuZCBhIHR5cGUgU1JWIEROUyByZWNvcmQgaXNcbiAgICogdXNlZCwgeW91IG11c3Qgc3BlY2lmeSBlaXRoZXIgYSBjb250YWluZXJOYW1lIGFuZCBjb250YWluZXJQb3J0IGNvbWJpbmF0aW9uIG9yIGEgcG9ydCB2YWx1ZSwgYnV0IG5vdCBib3RoLlxuICAgKi9cbiAgcmVhZG9ubHkgY29udGFpbmVyTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNvbnRhaW5lciBwb3J0IHZhbHVlLCBhbHJlYWR5IHNwZWNpZmllZCBpbiB0aGUgdGFzayBkZWZpbml0aW9uLCB0byBiZSB1c2VkIGZvciB5b3VyIHNlcnZpY2UgZGlzY292ZXJ5IHNlcnZpY2UuXG4gICAqIElmIHRoZSB0YXNrIGRlZmluaXRpb24gdGhhdCB5b3VyIHNlcnZpY2UgdGFzayBzcGVjaWZpZXMgdXNlcyB0aGUgYnJpZGdlIG9yIGhvc3QgbmV0d29yayBtb2RlLFxuICAgKiB5b3UgbXVzdCBzcGVjaWZ5IGEgY29udGFpbmVyTmFtZSBhbmQgY29udGFpbmVyUG9ydCBjb21iaW5hdGlvbiBmcm9tIHRoZSB0YXNrIGRlZmluaXRpb24uXG4gICAqIElmIHRoZSB0YXNrIGRlZmluaXRpb24gdGhhdCB5b3VyIHNlcnZpY2UgdGFzayBzcGVjaWZpZXMgdXNlcyB0aGUgYXdzdnBjIG5ldHdvcmsgbW9kZSBhbmQgYSB0eXBlIFNSViBETlMgcmVjb3JkIGlzXG4gICAqIHVzZWQsIHlvdSBtdXN0IHNwZWNpZnkgZWl0aGVyIGEgY29udGFpbmVyTmFtZSBhbmQgY29udGFpbmVyUG9ydCBjb21iaW5hdGlvbiBvciBhIHBvcnQgdmFsdWUsIGJ1dCBub3QgYm90aC5cbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lclBvcnQ/OiBudW1iZXI7XG59XG5cbi8qKlxuICogVGhlIGxhdW5jaCB0eXBlIG9mIGFuIEVDUyBzZXJ2aWNlXG4gKi9cbmV4cG9ydCBlbnVtIExhdW5jaFR5cGUge1xuICAvKipcbiAgICogVGhlIHNlcnZpY2Ugd2lsbCBiZSBsYXVuY2hlZCB1c2luZyB0aGUgRUMyIGxhdW5jaCB0eXBlXG4gICAqL1xuICBFQzIgPSAnRUMyJyxcblxuICAvKipcbiAgICogVGhlIHNlcnZpY2Ugd2lsbCBiZSBsYXVuY2hlZCB1c2luZyB0aGUgRkFSR0FURSBsYXVuY2ggdHlwZVxuICAgKi9cbiAgRkFSR0FURSA9ICdGQVJHQVRFJyxcblxuICAvKipcbiAgICogVGhlIHNlcnZpY2Ugd2lsbCBiZSBsYXVuY2hlZCB1c2luZyB0aGUgRVhURVJOQUwgbGF1bmNoIHR5cGVcbiAgICovXG4gIEVYVEVSTkFMID0gJ0VYVEVSTkFMJ1xufVxuXG4vKipcbiAqIFRoZSBkZXBsb3ltZW50IGNvbnRyb2xsZXIgdHlwZSB0byB1c2UgZm9yIHRoZSBzZXJ2aWNlLlxuICovXG5leHBvcnQgZW51bSBEZXBsb3ltZW50Q29udHJvbGxlclR5cGUge1xuICAvKipcbiAgICogVGhlIHJvbGxpbmcgdXBkYXRlIChFQ1MpIGRlcGxveW1lbnQgdHlwZSBpbnZvbHZlcyByZXBsYWNpbmcgdGhlIGN1cnJlbnRcbiAgICogcnVubmluZyB2ZXJzaW9uIG9mIHRoZSBjb250YWluZXIgd2l0aCB0aGUgbGF0ZXN0IHZlcnNpb24uXG4gICAqL1xuICBFQ1MgPSAnRUNTJyxcblxuICAvKipcbiAgICogVGhlIGJsdWUvZ3JlZW4gKENPREVfREVQTE9ZKSBkZXBsb3ltZW50IHR5cGUgdXNlcyB0aGUgYmx1ZS9ncmVlbiBkZXBsb3ltZW50IG1vZGVsIHBvd2VyZWQgYnkgQVdTIENvZGVEZXBsb3lcbiAgICovXG4gIENPREVfREVQTE9ZID0gJ0NPREVfREVQTE9ZJyxcblxuICAvKipcbiAgICogVGhlIGV4dGVybmFsIChFWFRFUk5BTCkgZGVwbG95bWVudCB0eXBlIGVuYWJsZXMgeW91IHRvIHVzZSBhbnkgdGhpcmQtcGFydHkgZGVwbG95bWVudCBjb250cm9sbGVyXG4gICAqL1xuICBFWFRFUk5BTCA9ICdFWFRFUk5BTCdcbn1cblxuLyoqXG4gKiBQcm9wYWdhdGUgdGFncyBmcm9tIGVpdGhlciBzZXJ2aWNlIG9yIHRhc2sgZGVmaW5pdGlvblxuICovXG5leHBvcnQgZW51bSBQcm9wYWdhdGVkVGFnU291cmNlIHtcbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0YWdzIGZyb20gc2VydmljZVxuICAgKi9cbiAgU0VSVklDRSA9ICdTRVJWSUNFJyxcblxuICAvKipcbiAgICogUHJvcGFnYXRlIHRhZ3MgZnJvbSB0YXNrIGRlZmluaXRpb25cbiAgICovXG4gIFRBU0tfREVGSU5JVElPTiA9ICdUQVNLX0RFRklOSVRJT04nLFxuXG4gIC8qKlxuICAgKiBEbyBub3QgcHJvcGFnYXRlXG4gICAqL1xuICBOT05FID0gJ05PTkUnXG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgYGRldGVybWluZUNvbnRhaW5lck5hbWVBbmRQb3J0YFxuICovXG5pbnRlcmZhY2UgRGV0ZXJtaW5lQ29udGFpbmVyTmFtZUFuZFBvcnRPcHRpb25zIHtcbiAgZG5zUmVjb3JkVHlwZTogY2xvdWRtYXAuRG5zUmVjb3JkVHlwZTtcbiAgdGFza0RlZmluaXRpb246IFRhc2tEZWZpbml0aW9uO1xuICBjb250YWluZXI/OiBDb250YWluZXJEZWZpbml0aW9uO1xuICBjb250YWluZXJQb3J0PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIERldGVybWluZSB0aGUgbmFtZSBvZiB0aGUgY29udGFpbmVyIGFuZCBwb3J0IHRvIHRhcmdldCBmb3IgdGhlIHNlcnZpY2UgcmVnaXN0cnkuXG4gKi9cbmZ1bmN0aW9uIGRldGVybWluZUNvbnRhaW5lck5hbWVBbmRQb3J0KG9wdGlvbnM6IERldGVybWluZUNvbnRhaW5lck5hbWVBbmRQb3J0T3B0aW9ucykge1xuICAvLyBJZiB0aGUgcmVjb3JkIHR5cGUgaXMgU1JWLCB0aGVuIHByb3ZpZGUgdGhlIGNvbnRhaW5lck5hbWUgYW5kIGNvbnRhaW5lclBvcnQgdG8gdGFyZ2V0LlxuICAvLyBXZSB1c2UgdGhlIG5hbWUgb2YgdGhlIGRlZmF1bHQgY29udGFpbmVyIGFuZCB0aGUgZGVmYXVsdCBwb3J0IG9mIHRoZSBkZWZhdWx0IGNvbnRhaW5lclxuICAvLyB1bmxlc3MgdGhlIHVzZXIgc3BlY2lmaWVzIG90aGVyd2lzZS5cbiAgaWYgKG9wdGlvbnMuZG5zUmVjb3JkVHlwZSA9PT0gY2xvdWRtYXAuRG5zUmVjb3JkVHlwZS5TUlYpIHtcbiAgICAvLyBFbnN1cmUgdGhlIHVzZXItcHJvdmlkZWQgY29udGFpbmVyIGlzIGZyb20gdGhlIHJpZ2h0IHRhc2sgZGVmaW5pdGlvbi5cbiAgICBpZiAob3B0aW9ucy5jb250YWluZXIgJiYgb3B0aW9ucy5jb250YWluZXIudGFza0RlZmluaXRpb24gIT0gb3B0aW9ucy50YXNrRGVmaW5pdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWRkIGRpc2NvdmVyeSBmb3IgYSBjb250YWluZXIgZnJvbSBhbm90aGVyIHRhc2sgZGVmaW5pdGlvbicpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IG9wdGlvbnMuY29udGFpbmVyID8/IG9wdGlvbnMudGFza0RlZmluaXRpb24uZGVmYXVsdENvbnRhaW5lciE7XG5cbiAgICAvLyBFbnN1cmUgdGhhdCBhbnkgcG9ydCBnaXZlbiBieSB0aGUgdXNlciBpcyBtYXBwZWQuXG4gICAgaWYgKG9wdGlvbnMuY29udGFpbmVyUG9ydCAmJiAhY29udGFpbmVyLnBvcnRNYXBwaW5ncy5zb21lKG1hcHBpbmcgPT4gbWFwcGluZy5jb250YWluZXJQb3J0ID09PSBvcHRpb25zLmNvbnRhaW5lclBvcnQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhZGQgZGlzY292ZXJ5IGZvciBhIGNvbnRhaW5lciBwb3J0IHRoYXQgaGFzIG5vdCBiZWVuIG1hcHBlZCcpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjb250YWluZXJOYW1lOiBjb250YWluZXIuY29udGFpbmVyTmFtZSxcbiAgICAgIGNvbnRhaW5lclBvcnQ6IG9wdGlvbnMuY29udGFpbmVyUG9ydCA/PyBvcHRpb25zLnRhc2tEZWZpbml0aW9uLmRlZmF1bHRDb250YWluZXIhLmNvbnRhaW5lclBvcnQsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7fTtcbn1cbiJdfQ==