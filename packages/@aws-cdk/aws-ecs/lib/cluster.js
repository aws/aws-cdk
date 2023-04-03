"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsgCapacityProvider = exports.ExecuteCommandLogging = exports.Cluster = exports.MachineImageType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const autoscaling = require("@aws-cdk/aws-autoscaling");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const cloudmap = require("@aws-cdk/aws-servicediscovery");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const amis_1 = require("./amis");
const instance_drain_hook_1 = require("./drain-hook/instance-drain-hook");
const ecs_canned_metrics_generated_1 = require("./ecs-canned-metrics.generated");
const ecs_generated_1 = require("./ecs.generated");
const CLUSTER_SYMBOL = Symbol.for('@aws-cdk/aws-ecs/lib/cluster.Cluster');
/**
 * The machine image type
 */
var MachineImageType;
(function (MachineImageType) {
    /**
     * Amazon ECS-optimized Amazon Linux 2 AMI
     */
    MachineImageType[MachineImageType["AMAZON_LINUX_2"] = 0] = "AMAZON_LINUX_2";
    /**
     * Bottlerocket AMI
     */
    MachineImageType[MachineImageType["BOTTLEROCKET"] = 1] = "BOTTLEROCKET";
})(MachineImageType = exports.MachineImageType || (exports.MachineImageType = {}));
/**
 * A regional grouping of one or more container instances on which you can run tasks and services.
 */
class Cluster extends core_1.Resource {
    /**
     * Constructs a new instance of the Cluster class.
     */
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.clusterName,
        });
        /**
         * Manage the allowed network connections for the cluster with Security Groups.
         */
        this.connections = new ec2.Connections();
        /**
         * The names of both ASG and Fargate capacity providers associated with the cluster.
         */
        this._capacityProviderNames = [];
        /**
         * The cluster default capacity provider strategy. This takes the form of a list of CapacityProviderStrategy objects.
         */
        this._defaultCapacityProviderStrategy = [];
        /**
         * Specifies whether the cluster has EC2 instance capacity.
         */
        this._hasEc2Capacity = false;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ClusterProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Cluster);
            }
            throw error;
        }
        /**
         * clusterSettings needs to be undefined if containerInsights is not explicitly set in order to allow any
         * containerInsights settings on the account to apply.  See:
         * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-clustersettings.html#cfn-ecs-cluster-clustersettings-value
        */
        let clusterSettings = undefined;
        if (props.containerInsights !== undefined) {
            clusterSettings = [{ name: 'containerInsights', value: props.containerInsights ? ContainerInsights.ENABLED : ContainerInsights.DISABLED }];
        }
        this._capacityProviderNames = props.capacityProviders ?? [];
        if (props.enableFargateCapacityProviders) {
            this.enableFargateCapacityProviders();
        }
        if (props.executeCommandConfiguration) {
            if ((props.executeCommandConfiguration.logging === ExecuteCommandLogging.OVERRIDE) !==
                (props.executeCommandConfiguration.logConfiguration !== undefined)) {
                throw new Error('Execute command log configuration must only be specified when logging is OVERRIDE.');
            }
            this._executeCommandConfiguration = props.executeCommandConfiguration;
        }
        this._cfnCluster = new ecs_generated_1.CfnCluster(this, 'Resource', {
            clusterName: this.physicalName,
            clusterSettings,
            configuration: this._executeCommandConfiguration && this.renderExecuteCommandConfiguration(),
        });
        this.clusterArn = this.getResourceArnAttribute(this._cfnCluster.attrArn, {
            service: 'ecs',
            resource: 'cluster',
            resourceName: this.physicalName,
        });
        this.clusterName = this.getResourceNameAttribute(this._cfnCluster.ref);
        this.vpc = props.vpc || new ec2.Vpc(this, 'Vpc', { maxAzs: 2 });
        this._defaultCloudMapNamespace = props.defaultCloudMapNamespace !== undefined
            ? this.addDefaultCloudMapNamespace(props.defaultCloudMapNamespace)
            : undefined;
        this._autoscalingGroup = props.capacity !== undefined
            ? this.addCapacity('DefaultAutoScalingGroup', props.capacity)
            : undefined;
        // Only create cluster capacity provider associations if there are any EC2
        // capacity providers. Ordinarily we'd just add the construct to the tree
        // since it's harmless, but we'd prefer not to add unexpected new
        // resources to the stack which could surprise users working with
        // brown-field CDK apps and stacks.
        core_1.Aspects.of(this).add(new MaybeCreateCapacityProviderAssociations(this, id));
    }
    /**
      * Return whether the given object is a Cluster
     */
    static isCluster(x) {
        return x !== null && typeof (x) === 'object' && CLUSTER_SYMBOL in x;
    }
    /**
     * Import an existing cluster to the stack from its attributes.
     */
    static fromClusterAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ClusterAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromClusterAttributes);
            }
            throw error;
        }
        return new ImportedCluster(scope, id, attrs);
    }
    /**
     * Import an existing cluster to the stack from the cluster ARN.
     * This does not provide access to the vpc, hasEc2Capacity, or connections -
     * use the `fromClusterAttributes` method to access those properties.
     */
    static fromClusterArn(scope, id, clusterArn) {
        const stack = core_1.Stack.of(scope);
        const arn = stack.splitArn(clusterArn, core_1.ArnFormat.SLASH_RESOURCE_NAME);
        const clusterName = arn.resourceName;
        if (!clusterName) {
            throw new Error(`Missing required Cluster Name from Cluster ARN: ${clusterArn}`);
        }
        const errorSuffix = 'is not available for a Cluster imported using fromClusterArn(), please use fromClusterAttributes() instead.';
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.clusterArn = clusterArn;
                this.clusterName = clusterName;
            }
            get hasEc2Capacity() {
                throw new Error(`hasEc2Capacity ${errorSuffix}`);
            }
            get connections() {
                throw new Error(`connections ${errorSuffix}`);
            }
            get vpc() {
                throw new Error(`vpc ${errorSuffix}`);
            }
        }
        return new Import(scope, id, {
            environmentFromArn: clusterArn,
        });
    }
    /**
     * Enable the Fargate capacity providers for this cluster.
     */
    enableFargateCapacityProviders() {
        for (const provider of ['FARGATE', 'FARGATE_SPOT']) {
            if (!this._capacityProviderNames.includes(provider)) {
                this._capacityProviderNames.push(provider);
            }
        }
    }
    /**
     * Add default capacity provider strategy for this cluster.
     *
     * @param defaultCapacityProviderStrategy cluster default capacity provider strategy. This takes the form of a list of CapacityProviderStrategy objects.
     *
     * For example
     * [
     *   {
     *     capacityProvider: 'FARGATE',
     *     base: 10,
     *     weight: 50
     *   }
     * ]
     */
    addDefaultCapacityProviderStrategy(defaultCapacityProviderStrategy) {
        if (this._defaultCapacityProviderStrategy.length > 0) {
            throw new Error('Cluster default capacity provider strategy is already set.');
        }
        if (defaultCapacityProviderStrategy.some(dcp => dcp.capacityProvider.includes('FARGATE')) && defaultCapacityProviderStrategy.some(dcp => !dcp.capacityProvider.includes('FARGATE'))) {
            throw new Error('A capacity provider strategy cannot contain a mix of capacity providers using Auto Scaling groups and Fargate providers. Specify one or the other and try again.');
        }
        defaultCapacityProviderStrategy.forEach(dcp => {
            if (!this._capacityProviderNames.includes(dcp.capacityProvider)) {
                throw new Error(`Capacity provider ${dcp.capacityProvider} must be added to the cluster with addAsgCapacityProvider() before it can be used in a default capacity provider strategy.`);
            }
        });
        const defaultCapacityProvidersWithBase = defaultCapacityProviderStrategy.filter(dcp => !!dcp.base);
        if (defaultCapacityProvidersWithBase.length > 1) {
            throw new Error('Only 1 capacity provider in a capacity provider strategy can have a nonzero base.');
        }
        this._defaultCapacityProviderStrategy = defaultCapacityProviderStrategy;
    }
    renderExecuteCommandConfiguration() {
        return {
            executeCommandConfiguration: {
                kmsKeyId: this._executeCommandConfiguration?.kmsKey?.keyArn,
                logConfiguration: this._executeCommandConfiguration?.logConfiguration && this.renderExecuteCommandLogConfiguration(),
                logging: this._executeCommandConfiguration?.logging,
            },
        };
    }
    renderExecuteCommandLogConfiguration() {
        const logConfiguration = this._executeCommandConfiguration?.logConfiguration;
        if (logConfiguration?.s3EncryptionEnabled && !logConfiguration?.s3Bucket) {
            throw new Error('You must specify an S3 bucket name in the execute command log configuration to enable S3 encryption.');
        }
        if (logConfiguration?.cloudWatchEncryptionEnabled && !logConfiguration?.cloudWatchLogGroup) {
            throw new Error('You must specify a CloudWatch log group in the execute command log configuration to enable CloudWatch encryption.');
        }
        return {
            cloudWatchEncryptionEnabled: logConfiguration?.cloudWatchEncryptionEnabled,
            cloudWatchLogGroupName: logConfiguration?.cloudWatchLogGroup?.logGroupName,
            s3BucketName: logConfiguration?.s3Bucket?.bucketName,
            s3EncryptionEnabled: logConfiguration?.s3EncryptionEnabled,
            s3KeyPrefix: logConfiguration?.s3KeyPrefix,
        };
    }
    /**
     * Add an AWS Cloud Map DNS namespace for this cluster.
     * NOTE: HttpNamespaces are supported only for use cases involving Service Connect. For use cases involving both Service-
     * Discovery and Service Connect, customers should manage the HttpNamespace outside of the Cluster.addDefaultCloudMapNamespace method.
     */
    addDefaultCloudMapNamespace(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_CloudMapNamespaceOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addDefaultCloudMapNamespace);
            }
            throw error;
        }
        if (this._defaultCloudMapNamespace !== undefined) {
            throw new Error('Can only add default namespace once.');
        }
        const namespaceType = options.type !== undefined
            ? options.type
            : cloudmap.NamespaceType.DNS_PRIVATE;
        let sdNamespace;
        switch (namespaceType) {
            case cloudmap.NamespaceType.DNS_PRIVATE:
                sdNamespace = new cloudmap.PrivateDnsNamespace(this, 'DefaultServiceDiscoveryNamespace', {
                    name: options.name,
                    vpc: this.vpc,
                });
                break;
            case cloudmap.NamespaceType.DNS_PUBLIC:
                sdNamespace = new cloudmap.PublicDnsNamespace(this, 'DefaultServiceDiscoveryNamespace', {
                    name: options.name,
                });
                break;
            case cloudmap.NamespaceType.HTTP:
                sdNamespace = new cloudmap.HttpNamespace(this, 'DefaultServiceDiscoveryNamespace', {
                    name: options.name,
                });
                break;
            default:
                throw new Error(`Namespace type ${namespaceType} is not supported.`);
        }
        this._defaultCloudMapNamespace = sdNamespace;
        if (options.useForServiceConnect) {
            this._cfnCluster.serviceConnectDefaults = {
                namespace: options.name,
            };
        }
        return sdNamespace;
    }
    /**
     * Getter for _defaultCapacityProviderStrategy. This is necessary to correctly create Capacity Provider Associations.
     */
    get defaultCapacityProviderStrategy() {
        return this._defaultCapacityProviderStrategy;
    }
    /**
     * Getter for _capacityProviderNames added to cluster
     */
    get capacityProviderNames() {
        return this._capacityProviderNames;
    }
    /**
     * Getter for namespace added to cluster
     */
    get defaultCloudMapNamespace() {
        return this._defaultCloudMapNamespace;
    }
    /**
     * It is highly recommended to use `Cluster.addAsgCapacityProvider` instead of this method.
     *
     * This method adds compute capacity to a cluster by creating an AutoScalingGroup with the specified options.
     *
     * Returns the AutoScalingGroup so you can add autoscaling settings to it.
     */
    addCapacity(id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_AddCapacityOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addCapacity);
            }
            throw error;
        }
        // Do 2-way defaulting here: if the machineImageType is BOTTLEROCKET, pick the right AMI.
        // Otherwise, determine the machineImageType from the given AMI.
        const machineImage = options.machineImage ??
            (options.machineImageType === MachineImageType.BOTTLEROCKET ? new amis_1.BottleRocketImage({
                architecture: options.instanceType.architecture,
            }) : new amis_1.EcsOptimizedAmi());
        const machineImageType = options.machineImageType ??
            (isBottleRocketImage(machineImage) ? MachineImageType.BOTTLEROCKET : MachineImageType.AMAZON_LINUX_2);
        const autoScalingGroup = new autoscaling.AutoScalingGroup(this, id, {
            vpc: this.vpc,
            machineImage,
            updateType: !!options.updatePolicy ? undefined : options.updateType || autoscaling.UpdateType.REPLACING_UPDATE,
            ...options,
        });
        this.addAutoScalingGroup(autoScalingGroup, {
            machineImageType: machineImageType,
            ...options,
        });
        return autoScalingGroup;
    }
    /**
     * This method adds an Auto Scaling Group Capacity Provider to a cluster.
     *
     * @param provider the capacity provider to add to this cluster.
     */
    addAsgCapacityProvider(provider, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_AsgCapacityProvider(provider);
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_AddAutoScalingGroupCapacityOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAsgCapacityProvider);
            }
            throw error;
        }
        // Don't add the same capacity provider more than once.
        if (this._capacityProviderNames.includes(provider.capacityProviderName)) {
            return;
        }
        this._hasEc2Capacity = true;
        this.configureAutoScalingGroup(provider.autoScalingGroup, {
            ...options,
            machineImageType: provider.machineImageType,
            // Don't enable the instance-draining lifecycle hook if managed termination protection is enabled
            taskDrainTime: provider.enableManagedTerminationProtection ? core_1.Duration.seconds(0) : options.taskDrainTime,
            canContainersAccessInstanceRole: options.canContainersAccessInstanceRole ?? provider.canContainersAccessInstanceRole,
        });
        this._capacityProviderNames.push(provider.capacityProviderName);
    }
    /**
     * This method adds compute capacity to a cluster using the specified AutoScalingGroup.
     *
     * @deprecated Use `Cluster.addAsgCapacityProvider` instead.
     * @param autoScalingGroup the ASG to add to this cluster.
     * [disable-awslint:ref-via-interface] is needed in order to install the ECS
     * agent by updating the ASGs user data.
     */
    addAutoScalingGroup(autoScalingGroup, options = {}) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-ecs.Cluster#addAutoScalingGroup", "Use `Cluster.addAsgCapacityProvider` instead.");
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_AddAutoScalingGroupCapacityOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addAutoScalingGroup);
            }
            throw error;
        }
        this._hasEc2Capacity = true;
        this.connections.connections.addSecurityGroup(...autoScalingGroup.connections.securityGroups);
        this.configureAutoScalingGroup(autoScalingGroup, options);
    }
    configureAutoScalingGroup(autoScalingGroup, options = {}) {
        if (autoScalingGroup.osType === ec2.OperatingSystemType.WINDOWS) {
            this.configureWindowsAutoScalingGroup(autoScalingGroup, options);
        }
        else {
            // Tie instances to cluster
            switch (options.machineImageType) {
                // Bottlerocket AMI
                case MachineImageType.BOTTLEROCKET: {
                    autoScalingGroup.addUserData(
                    // Connect to the cluster
                    // Source: https://github.com/bottlerocket-os/bottlerocket/blob/develop/QUICKSTART-ECS.md#connecting-to-your-cluster
                    '[settings.ecs]', `cluster = "${this.clusterName}"`);
                    // Enabling SSM
                    // Source: https://github.com/bottlerocket-os/bottlerocket/blob/develop/QUICKSTART-ECS.md#enabling-ssm
                    autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));
                    // required managed policy
                    autoScalingGroup.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2ContainerServiceforEC2Role'));
                    break;
                }
                default:
                    // Amazon ECS-optimized AMI for Amazon Linux 2
                    autoScalingGroup.addUserData(`echo ECS_CLUSTER=${this.clusterName} >> /etc/ecs/ecs.config`);
                    if (!options.canContainersAccessInstanceRole) {
                        // Deny containers access to instance metadata service
                        // Source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/instance_IAM_role.html
                        autoScalingGroup.addUserData('sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP');
                        autoScalingGroup.addUserData('sudo service iptables save');
                        // The following is only for AwsVpc networking mode, but doesn't hurt for the other modes.
                        autoScalingGroup.addUserData('echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config');
                    }
                    if (autoScalingGroup.spotPrice && options.spotInstanceDraining) {
                        autoScalingGroup.addUserData('echo ECS_ENABLE_SPOT_INSTANCE_DRAINING=true >> /etc/ecs/ecs.config');
                    }
            }
        }
        // ECS instances must be able to do these things
        // Source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/instance_IAM_role.html
        // But, scoped down to minimal permissions required.
        //  Notes:
        //   - 'ecs:CreateCluster' removed. The cluster already exists.
        autoScalingGroup.addToRolePolicy(new iam.PolicyStatement({
            actions: [
                'ecs:DeregisterContainerInstance',
                'ecs:RegisterContainerInstance',
                'ecs:Submit*',
            ],
            resources: [
                this.clusterArn,
            ],
        }));
        autoScalingGroup.addToRolePolicy(new iam.PolicyStatement({
            actions: [
                // These act on a cluster instance, and the instance doesn't exist until the service starts.
                // Thus, scope to the cluster using a condition.
                // See: https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazonelasticcontainerservice.html
                'ecs:Poll',
                'ecs:StartTelemetrySession',
            ],
            resources: ['*'],
            conditions: {
                ArnEquals: { 'ecs:cluster': this.clusterArn },
            },
        }));
        autoScalingGroup.addToRolePolicy(new iam.PolicyStatement({
            actions: [
                // These do not support resource constraints, and must be resource '*'
                'ecs:DiscoverPollEndpoint',
                'ecr:GetAuthorizationToken',
                // Preserved for backwards compatibility.
                // Users are able to enable cloudwatch agent using CDK. Existing
                // customers might be installing CW agent as part of user-data so if we
                // remove these permissions we will break that customer use cases.
                'logs:CreateLogStream',
                'logs:PutLogEvents',
            ],
            resources: ['*'],
        }));
        // 0 disables, otherwise forward to underlying implementation which picks the sane default
        if (!options.taskDrainTime || options.taskDrainTime.toSeconds() !== 0) {
            new instance_drain_hook_1.InstanceDrainHook(autoScalingGroup, 'DrainECSHook', {
                autoScalingGroup,
                cluster: this,
                drainTime: options.taskDrainTime,
                topicEncryptionKey: options.topicEncryptionKey,
            });
        }
    }
    /**
     * This method enables the Fargate or Fargate Spot capacity providers on the cluster.
     *
     * @param provider the capacity provider to add to this cluster.
     * @deprecated Use `enableFargateCapacityProviders` instead.
     * @see `addAsgCapacityProvider` to add an Auto Scaling Group capacity provider to the cluster.
     */
    addCapacityProvider(provider) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-ecs.Cluster#addCapacityProvider", "Use `enableFargateCapacityProviders` instead.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addCapacityProvider);
            }
            throw error;
        }
        if (!(provider === 'FARGATE' || provider === 'FARGATE_SPOT')) {
            throw new Error('CapacityProvider not supported');
        }
        if (!this._capacityProviderNames.includes(provider)) {
            this._capacityProviderNames.push(provider);
        }
    }
    configureWindowsAutoScalingGroup(autoScalingGroup, options = {}) {
        // clear the cache of the agent
        autoScalingGroup.addUserData('Remove-Item -Recurse C:\\ProgramData\\Amazon\\ECS\\Cache');
        // pull the latest ECS Tools
        autoScalingGroup.addUserData('Import-Module ECSTools');
        // set the cluster name environment variable
        autoScalingGroup.addUserData(`[Environment]::SetEnvironmentVariable("ECS_CLUSTER", "${this.clusterName}", "Machine")`);
        autoScalingGroup.addUserData('[Environment]::SetEnvironmentVariable("ECS_ENABLE_AWSLOGS_EXECUTIONROLE_OVERRIDE", "true", "Machine")');
        // tslint:disable-next-line: max-line-length
        autoScalingGroup.addUserData('[Environment]::SetEnvironmentVariable("ECS_AVAILABLE_LOGGING_DRIVERS", \'["json-file","awslogs"]\', "Machine")');
        // enable instance draining
        if (autoScalingGroup.spotPrice && options.spotInstanceDraining) {
            autoScalingGroup.addUserData('[Environment]::SetEnvironmentVariable("ECS_ENABLE_SPOT_INSTANCE_DRAINING", "true", "Machine")');
        }
        // enable task iam role
        if (!options.canContainersAccessInstanceRole) {
            autoScalingGroup.addUserData('[Environment]::SetEnvironmentVariable("ECS_ENABLE_TASK_IAM_ROLE", "true", "Machine")');
            autoScalingGroup.addUserData(`Initialize-ECSAgent -Cluster '${this.clusterName}' -EnableTaskIAMRole`);
        }
        else {
            autoScalingGroup.addUserData(`Initialize-ECSAgent -Cluster '${this.clusterName}'`);
        }
    }
    /**
     * Getter for autoscaling group added to cluster
     */
    get autoscalingGroup() {
        return this._autoscalingGroup;
    }
    /**
     * Whether the cluster has EC2 capacity associated with it
     */
    get hasEc2Capacity() {
        return this._hasEc2Capacity;
    }
    /**
     * Getter for execute command configuration associated with the cluster.
     */
    get executeCommandConfiguration() {
        return this._executeCommandConfiguration;
    }
    /**
     * This method returns the CloudWatch metric for this clusters CPU reservation.
     *
     * @default average over 5 minutes
     */
    metricCpuReservation(props) {
        return this.cannedMetric(ecs_canned_metrics_generated_1.ECSMetrics.cpuReservationAverage, props);
    }
    /**
     * This method returns the CloudWatch metric for this clusters CPU utilization.
     *
     * @default average over 5 minutes
     */
    metricCpuUtilization(props) {
        return this.cannedMetric(ecs_canned_metrics_generated_1.ECSMetrics.cpuUtilizationAverage, props);
    }
    /**
     * This method returns the CloudWatch metric for this clusters memory reservation.
     *
     * @default average over 5 minutes
     */
    metricMemoryReservation(props) {
        return this.cannedMetric(ecs_canned_metrics_generated_1.ECSMetrics.memoryReservationAverage, props);
    }
    /**
     * This method returns the CloudWatch metric for this clusters memory utilization.
     *
     * @default average over 5 minutes
     */
    metricMemoryUtilization(props) {
        return this.cannedMetric(ecs_canned_metrics_generated_1.ECSMetrics.memoryUtilizationAverage, props);
    }
    /**
     * This method returns the specifed CloudWatch metric for this cluster.
     */
    metric(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/ECS',
            metricName,
            dimensionsMap: { ClusterName: this.clusterName },
            ...props,
        }).attachTo(this);
    }
    cannedMetric(fn, props) {
        return new cloudwatch.Metric({
            ...fn({ ClusterName: this.clusterName }),
            ...props,
        }).attachTo(this);
    }
}
exports.Cluster = Cluster;
_a = JSII_RTTI_SYMBOL_1;
Cluster[_a] = { fqn: "@aws-cdk/aws-ecs.Cluster", version: "0.0.0" };
Object.defineProperty(Cluster.prototype, CLUSTER_SYMBOL, {
    value: true,
    enumerable: false,
    writable: false,
});
/**
 * An Cluster that has been imported
 */
class ImportedCluster extends core_1.Resource {
    /**
     * Constructs a new instance of the ImportedCluster class.
     */
    constructor(scope, id, props) {
        super(scope, id);
        /**
         * Security group of the cluster instances
         */
        this.connections = new ec2.Connections();
        this.clusterName = props.clusterName;
        this.vpc = props.vpc;
        this.hasEc2Capacity = props.hasEc2Capacity !== false;
        this._defaultCloudMapNamespace = props.defaultCloudMapNamespace;
        this._executeCommandConfiguration = props.executeCommandConfiguration;
        this.clusterArn = props.clusterArn ?? core_1.Stack.of(this).formatArn({
            service: 'ecs',
            resource: 'cluster',
            resourceName: props.clusterName,
        });
        this.connections = new ec2.Connections({
            securityGroups: props.securityGroups,
        });
    }
    get defaultCloudMapNamespace() {
        return this._defaultCloudMapNamespace;
    }
    get executeCommandConfiguration() {
        return this._executeCommandConfiguration;
    }
}
var ContainerInsights;
(function (ContainerInsights) {
    /**
     * Enable CloudWatch Container Insights for the cluster
     */
    ContainerInsights["ENABLED"] = "enabled";
    /**
     * Disable CloudWatch Container Insights for the cluster
     */
    ContainerInsights["DISABLED"] = "disabled";
})(ContainerInsights || (ContainerInsights = {}));
/**
 * The log settings to use to for logging the execute command session. For more information, see
 * [Logging] https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-cluster-executecommandconfiguration.html#cfn-ecs-cluster-executecommandconfiguration-logging
 */
var ExecuteCommandLogging;
(function (ExecuteCommandLogging) {
    /**
     * The execute command session is not logged.
     */
    ExecuteCommandLogging["NONE"] = "NONE";
    /**
     * The awslogs configuration in the task definition is used. If no logging parameter is specified, it defaults to this value. If no awslogs log driver is configured in the task definition, the output won't be logged.
     */
    ExecuteCommandLogging["DEFAULT"] = "DEFAULT";
    /**
     * Specify the logging details as a part of logConfiguration.
     */
    ExecuteCommandLogging["OVERRIDE"] = "OVERRIDE";
})(ExecuteCommandLogging = exports.ExecuteCommandLogging || (exports.ExecuteCommandLogging = {}));
/**
 * An Auto Scaling Group Capacity Provider. This allows an ECS cluster to target
 * a specific EC2 Auto Scaling Group for the placement of tasks. Optionally (and
 * recommended), ECS can manage the number of instances in the ASG to fit the
 * tasks, and can ensure that instances are not prematurely terminated while
 * there are still tasks running on them.
 */
class AsgCapacityProvider extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_AsgCapacityProviderProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AsgCapacityProvider);
            }
            throw error;
        }
        this.autoScalingGroup = props.autoScalingGroup;
        this.machineImageType = props.machineImageType ?? MachineImageType.AMAZON_LINUX_2;
        this.canContainersAccessInstanceRole = props.canContainersAccessInstanceRole;
        this.enableManagedTerminationProtection = props.enableManagedTerminationProtection ?? true;
        if (this.enableManagedTerminationProtection && props.enableManagedScaling === false) {
            throw new Error('Cannot enable Managed Termination Protection on a Capacity Provider when Managed Scaling is disabled. Either enable Managed Scaling or disable Managed Termination Protection.');
        }
        if (this.enableManagedTerminationProtection) {
            this.autoScalingGroup.protectNewInstancesFromScaleIn();
        }
        if (props.capacityProviderName) {
            if (!(/^(?!aws|ecs|fargate).+/gm.test(props.capacityProviderName))) {
                throw new Error(`Invalid Capacity Provider Name: ${props.capacityProviderName}, If a name is specified, it cannot start with aws, ecs, or fargate.`);
            }
        }
        const capacityProvider = new ecs_generated_1.CfnCapacityProvider(this, id, {
            name: props.capacityProviderName,
            autoScalingGroupProvider: {
                autoScalingGroupArn: this.autoScalingGroup.autoScalingGroupName,
                managedScaling: props.enableManagedScaling === false ? undefined : {
                    status: 'ENABLED',
                    targetCapacity: props.targetCapacityPercent || 100,
                    maximumScalingStepSize: props.maximumScalingStepSize,
                    minimumScalingStepSize: props.minimumScalingStepSize,
                },
                managedTerminationProtection: this.enableManagedTerminationProtection ? 'ENABLED' : 'DISABLED',
            },
        });
        this.capacityProviderName = capacityProvider.ref;
    }
}
exports.AsgCapacityProvider = AsgCapacityProvider;
_b = JSII_RTTI_SYMBOL_1;
AsgCapacityProvider[_b] = { fqn: "@aws-cdk/aws-ecs.AsgCapacityProvider", version: "0.0.0" };
/**
 * A visitor that adds a capacity provider association to a Cluster only if
 * the caller created any EC2 Capacity Providers.
 */
class MaybeCreateCapacityProviderAssociations {
    constructor(scope, id) {
        this.scope = scope;
        this.id = id;
    }
    visit(node) {
        if (Cluster.isCluster(node)) {
            if ((this.scope.defaultCapacityProviderStrategy.length > 0 || this.scope.capacityProviderNames.length > 0 && !this.resource)) {
                this.resource = new ecs_generated_1.CfnClusterCapacityProviderAssociations(this.scope, this.id, {
                    cluster: node.clusterName,
                    defaultCapacityProviderStrategy: this.scope.defaultCapacityProviderStrategy,
                    capacityProviders: this.scope.capacityProviderNames,
                });
            }
        }
    }
}
function isBottleRocketImage(image) {
    return image instanceof amis_1.BottleRocketImage;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2x1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0RBQXdEO0FBQ3hELHNEQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBSXhDLDBEQUEwRDtBQUMxRCx3Q0FBa0c7QUFDbEcsMkNBQW1EO0FBQ25ELGlDQUE0RDtBQUM1RCwwRUFBcUU7QUFDckUsaUZBQTREO0FBQzVELG1EQUEwRztBQUUxRyxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7QUFpRTFFOztHQUVHO0FBQ0gsSUFBWSxnQkFTWDtBQVRELFdBQVksZ0JBQWdCO0lBQzFCOztPQUVHO0lBQ0gsMkVBQWMsQ0FBQTtJQUNkOztPQUVHO0lBQ0gsdUVBQVksQ0FBQTtBQUNkLENBQUMsRUFUVyxnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQVMzQjtBQUVEOztHQUVHO0FBQ0gsTUFBYSxPQUFRLFNBQVEsZUFBUTtJQTBHbkM7O09BRUc7SUFDSCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFFBQXNCLEVBQUU7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixZQUFZLEVBQUUsS0FBSyxDQUFDLFdBQVc7U0FDaEMsQ0FBQyxDQUFDO1FBN0RMOztXQUVHO1FBQ2EsZ0JBQVcsR0FBb0IsSUFBSSxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7UUFpQnJFOztXQUVHO1FBQ0ssMkJBQXNCLEdBQWEsRUFBRSxDQUFDO1FBRTlDOztXQUVHO1FBQ0sscUNBQWdDLEdBQStCLEVBQUUsQ0FBQztRQU8xRTs7V0FFRztRQUNLLG9CQUFlLEdBQVksS0FBSyxDQUFDOzs7Ozs7K0NBekY5QixPQUFPOzs7O1FBa0hoQjs7OztVQUlFO1FBQ0YsSUFBSSxlQUFlLEdBQUcsU0FBUyxDQUFDO1FBQ2hDLElBQUksS0FBSyxDQUFDLGlCQUFp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QyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUM1SCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksc0RBQXNDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFO29CQUM5RSxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVc7b0JBQ3pCLCtCQUErQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsK0JBQStCO29CQUMzRSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQjtpQkFDcEQsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtLQUNGO0NBQ0Y7QUFHRCxTQUFTLG1CQUFtQixDQUFDLEtBQXdCO0lBQ25ELE9BQU8sS0FBSyxZQUFZLHdCQUFpQixDQUFDO0FBQzVDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhdXRvc2NhbGluZyBmcm9tICdAYXdzLWNkay9hd3MtYXV0b3NjYWxpbmcnO1xuaW1wb3J0ICogYXMgY2xvdWR3YXRjaCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsb2dzIGZyb20gJ0Bhd3MtY2RrL2F3cy1sb2dzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjbG91ZG1hcCBmcm9tICdAYXdzLWNkay9hd3Mtc2VydmljZWRpc2NvdmVyeSc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgSVJlc291cmNlLCBSZXNvdXJjZSwgU3RhY2ssIEFzcGVjdHMsIEFybkZvcm1hdCwgSUFzcGVjdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBCb3R0bGVSb2NrZXRJbWFnZSwgRWNzT3B0aW1pemVkQW1pIH0gZnJvbSAnLi9hbWlzJztcbmltcG9ydCB7IEluc3RhbmNlRHJhaW5Ib29rIH0gZnJvbSAnLi9kcmFpbi1ob29rL2luc3RhbmNlLWRyYWluLWhvb2snO1xuaW1wb3J0IHsgRUNTTWV0cmljcyB9IGZyb20gJy4vZWNzLWNhbm5lZC1tZXRyaWNzLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBDZm5DbHVzdGVyLCBDZm5DYXBhY2l0eVByb3ZpZGVyLCBDZm5DbHVzdGVyQ2FwYWNpdHlQcm92aWRlckFzc29jaWF0aW9ucyB9IGZyb20gJy4vZWNzLmdlbmVyYXRlZCc7XG5cbmNvbnN0IENMVVNURVJfU1lNQk9MID0gU3ltYm9sLmZvcignQGF3cy1jZGsvYXdzLWVjcy9saWIvY2x1c3Rlci5DbHVzdGVyJyk7XG5cbi8qKlxuICogVGhlIHByb3BlcnRpZXMgdXNlZCB0byBkZWZpbmUgYW4gRUNTIGNsdXN0ZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2x1c3RlclByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIGZvciB0aGUgY2x1c3Rlci5cbiAgICpcbiAgICogQGRlZmF1bHQgQ2xvdWRGb3JtYXRpb24tZ2VuZXJhdGVkIG5hbWVcbiAgICovXG4gIHJlYWRvbmx5IGNsdXN0ZXJOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgVlBDIHdoZXJlIHlvdXIgRUNTIGluc3RhbmNlcyB3aWxsIGJlIHJ1bm5pbmcgb3IgeW91ciBFTklzIHdpbGwgYmUgZGVwbG95ZWRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBjcmVhdGVzIGEgbmV3IFZQQyB3aXRoIHR3byBBWnNcbiAgICovXG4gIHJlYWRvbmx5IHZwYz86IGVjMi5JVnBjO1xuXG4gIC8qKlxuICAgKiBUaGUgc2VydmljZSBkaXNjb3ZlcnkgbmFtZXNwYWNlIGNyZWF0ZWQgaW4gdGhpcyBjbHVzdGVyXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gc2VydmljZSBkaXNjb3ZlcnkgbmFtZXNwYWNlIGNyZWF0ZWQsIHlvdSBjYW4gdXNlIGBhZGREZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2VgIHRvIGFkZCBhXG4gICAqIGRlZmF1bHQgc2VydmljZSBkaXNjb3ZlcnkgbmFtZXNwYWNlIGxhdGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlPzogQ2xvdWRNYXBOYW1lc3BhY2VPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBUaGUgZWMyIGNhcGFjaXR5IHRvIGFkZCB0byB0aGUgY2x1c3RlclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIEVDMiBjYXBhY2l0eSB3aWxsIGJlIGFkZGVkLCB5b3UgY2FuIHVzZSBgYWRkQ2FwYWNpdHlgIHRvIGFkZCBjYXBhY2l0eSBsYXRlci5cbiAgICovXG4gIHJlYWRvbmx5IGNhcGFjaXR5PzogQWRkQ2FwYWNpdHlPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBUaGUgY2FwYWNpdHkgcHJvdmlkZXJzIHRvIGFkZCB0byB0aGUgY2x1c3RlclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuIEN1cnJlbnRseSBvbmx5IEZBUkdBVEUgYW5kIEZBUkdBVEVfU1BPVCBhcmUgc3VwcG9ydGVkLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYENsdXN0ZXJQcm9wcy5lbmFibGVGYXJnYXRlQ2FwYWNpdHlQcm92aWRlcnNgIGluc3RlYWQuXG4gICAqL1xuICByZWFkb25seSBjYXBhY2l0eVByb3ZpZGVycz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGVuYWJsZSBGYXJnYXRlIENhcGFjaXR5IFByb3ZpZGVyc1xuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlRmFyZ2F0ZUNhcGFjaXR5UHJvdmlkZXJzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgdHJ1ZSBDbG91ZFdhdGNoIENvbnRhaW5lciBJbnNpZ2h0cyB3aWxsIGJlIGVuYWJsZWQgZm9yIHRoZSBjbHVzdGVyXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQ29udGFpbmVyIEluc2lnaHRzIHdpbGwgYmUgZGlzYWJsZWQgZm9yIHRoaXMgY2x1c3Rlci5cbiAgICovXG4gIHJlYWRvbmx5IGNvbnRhaW5lckluc2lnaHRzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGV4ZWN1dGUgY29tbWFuZCBjb25maWd1cmF0aW9uIGZvciB0aGUgY2x1c3RlclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGNvbmZpZ3VyYXRpb24gd2lsbCBiZSBwcm92aWRlZC5cbiAgICovXG4gIHJlYWRvbmx5IGV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbj86IEV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbjtcbn1cblxuLyoqXG4gKiBUaGUgbWFjaGluZSBpbWFnZSB0eXBlXG4gKi9cbmV4cG9ydCBlbnVtIE1hY2hpbmVJbWFnZVR5cGUge1xuICAvKipcbiAgICogQW1hem9uIEVDUy1vcHRpbWl6ZWQgQW1hem9uIExpbnV4IDIgQU1JXG4gICAqL1xuICBBTUFaT05fTElOVVhfMixcbiAgLyoqXG4gICAqIEJvdHRsZXJvY2tldCBBTUlcbiAgICovXG4gIEJPVFRMRVJPQ0tFVFxufVxuXG4vKipcbiAqIEEgcmVnaW9uYWwgZ3JvdXBpbmcgb2Ygb25lIG9yIG1vcmUgY29udGFpbmVyIGluc3RhbmNlcyBvbiB3aGljaCB5b3UgY2FuIHJ1biB0YXNrcyBhbmQgc2VydmljZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBDbHVzdGVyIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJQ2x1c3RlciB7XG5cbiAgLyoqXG4gICAgKiBSZXR1cm4gd2hldGhlciB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgQ2x1c3RlclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc0NsdXN0ZXIoeDogYW55KSA6IHggaXMgQ2x1c3RlciB7XG4gICAgcmV0dXJuIHggIT09IG51bGwgJiYgdHlwZW9mKHgpID09PSAnb2JqZWN0JyAmJiBDTFVTVEVSX1NZTUJPTCBpbiB4O1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBjbHVzdGVyIHRvIHRoZSBzdGFjayBmcm9tIGl0cyBhdHRyaWJ1dGVzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQ2x1c3RlckF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IENsdXN0ZXJBdHRyaWJ1dGVzKTogSUNsdXN0ZXIge1xuICAgIHJldHVybiBuZXcgSW1wb3J0ZWRDbHVzdGVyKHNjb3BlLCBpZCwgYXR0cnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBjbHVzdGVyIHRvIHRoZSBzdGFjayBmcm9tIHRoZSBjbHVzdGVyIEFSTi5cbiAgICogVGhpcyBkb2VzIG5vdCBwcm92aWRlIGFjY2VzcyB0byB0aGUgdnBjLCBoYXNFYzJDYXBhY2l0eSwgb3IgY29ubmVjdGlvbnMgLVxuICAgKiB1c2UgdGhlIGBmcm9tQ2x1c3RlckF0dHJpYnV0ZXNgIG1ldGhvZCB0byBhY2Nlc3MgdGhvc2UgcHJvcGVydGllcy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUNsdXN0ZXJBcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgY2x1c3RlckFybjogc3RyaW5nKTogSUNsdXN0ZXIge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgIGNvbnN0IGFybiA9IHN0YWNrLnNwbGl0QXJuKGNsdXN0ZXJBcm4sIEFybkZvcm1hdC5TTEFTSF9SRVNPVVJDRV9OQU1FKTtcbiAgICBjb25zdCBjbHVzdGVyTmFtZSA9IGFybi5yZXNvdXJjZU5hbWU7XG5cbiAgICBpZiAoIWNsdXN0ZXJOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgcmVxdWlyZWQgQ2x1c3RlciBOYW1lIGZyb20gQ2x1c3RlciBBUk46ICR7Y2x1c3RlckFybn1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBlcnJvclN1ZmZpeCA9ICdpcyBub3QgYXZhaWxhYmxlIGZvciBhIENsdXN0ZXIgaW1wb3J0ZWQgdXNpbmcgZnJvbUNsdXN0ZXJBcm4oKSwgcGxlYXNlIHVzZSBmcm9tQ2x1c3RlckF0dHJpYnV0ZXMoKSBpbnN0ZWFkLic7XG5cbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElDbHVzdGVyIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBjbHVzdGVyQXJuID0gY2x1c3RlckFybjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBjbHVzdGVyTmFtZSA9IGNsdXN0ZXJOYW1lITtcbiAgICAgIGdldCBoYXNFYzJDYXBhY2l0eSgpOiBib29sZWFuIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBoYXNFYzJDYXBhY2l0eSAke2Vycm9yU3VmZml4fWApO1xuICAgICAgfVxuICAgICAgZ2V0IGNvbm5lY3Rpb25zKCk6IGVjMi5Db25uZWN0aW9ucyB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgY29ubmVjdGlvbnMgJHtlcnJvclN1ZmZpeH1gKTtcbiAgICAgIH1cbiAgICAgIGdldCB2cGMoKTogZWMyLklWcGMge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHZwYyAke2Vycm9yU3VmZml4fWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCwge1xuICAgICAgZW52aXJvbm1lbnRGcm9tQXJuOiBjbHVzdGVyQXJuLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hbmFnZSB0aGUgYWxsb3dlZCBuZXR3b3JrIGNvbm5lY3Rpb25zIGZvciB0aGUgY2x1c3RlciB3aXRoIFNlY3VyaXR5IEdyb3Vwcy5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9uczogZWMyLkNvbm5lY3Rpb25zID0gbmV3IGVjMi5Db25uZWN0aW9ucygpO1xuXG4gIC8qKlxuICAgKiBUaGUgVlBDIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2x1c3Rlci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2cGM6IGVjMi5JVnBjO1xuXG4gIC8qKlxuICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgdGhhdCBpZGVudGlmaWVzIHRoZSBjbHVzdGVyLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXJBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNsdXN0ZXIuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY2x1c3Rlck5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWVzIG9mIGJvdGggQVNHIGFuZCBGYXJnYXRlIGNhcGFjaXR5IHByb3ZpZGVycyBhc3NvY2lhdGVkIHdpdGggdGhlIGNsdXN0ZXIuXG4gICAqL1xuICBwcml2YXRlIF9jYXBhY2l0eVByb3ZpZGVyTmFtZXM6IHN0cmluZ1tdID0gW107XG5cbiAgLyoqXG4gICAqIFRoZSBjbHVzdGVyIGRlZmF1bHQgY2FwYWNpdHkgcHJvdmlkZXIgc3RyYXRlZ3kuIFRoaXMgdGFrZXMgdGhlIGZvcm0gb2YgYSBsaXN0IG9mIENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneSBvYmplY3RzLlxuICAgKi9cbiAgcHJpdmF0ZSBfZGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneTogQ2FwYWNpdHlQcm92aWRlclN0cmF0ZWd5W10gPSBbXTtcblxuICAvKipcbiAgICogVGhlIEFXUyBDbG91ZCBNYXAgbmFtZXNwYWNlIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBjbHVzdGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBfZGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlPzogY2xvdWRtYXAuSU5hbWVzcGFjZTtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdGhlIGNsdXN0ZXIgaGFzIEVDMiBpbnN0YW5jZSBjYXBhY2l0eS5cbiAgICovXG4gIHByaXZhdGUgX2hhc0VjMkNhcGFjaXR5OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSBhdXRvc2NhbGluZyBncm91cCBmb3IgYWRkZWQgRWMyIGNhcGFjaXR5XG4gICAqL1xuICBwcml2YXRlIF9hdXRvc2NhbGluZ0dyb3VwPzogYXV0b3NjYWxpbmcuSUF1dG9TY2FsaW5nR3JvdXA7XG5cbiAgLyoqXG4gICAqIFRoZSBleGVjdXRlIGNvbW1hbmQgY29uZmlndXJhdGlvbiBmb3IgdGhlIGNsdXN0ZXJcbiAgICovXG4gIHByaXZhdGUgX2V4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbj86IEV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbjtcblxuICAvKipcbiAgICogQ2ZuQ2x1c3RlciBpbnN0YW5jZVxuICAgKi9cbiAgcHJpdmF0ZSBfY2ZuQ2x1c3RlcjogQ2ZuQ2x1c3RlcjtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgQ2x1c3RlciBjbGFzcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDbHVzdGVyUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5jbHVzdGVyTmFtZSxcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIGNsdXN0ZXJTZXR0aW5ncyBuZWVkcyB0byBiZSB1bmRlZmluZWQgaWYgY29udGFpbmVySW5zaWdodHMgaXMgbm90IGV4cGxpY2l0bHkgc2V0IGluIG9yZGVyIHRvIGFsbG93IGFueVxuICAgICAqIGNvbnRhaW5lckluc2lnaHRzIHNldHRpbmdzIG9uIHRoZSBhY2NvdW50IHRvIGFwcGx5LiAgU2VlOlxuICAgICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjcy1jbHVzdGVyLWNsdXN0ZXJzZXR0aW5ncy5odG1sI2Nmbi1lY3MtY2x1c3Rlci1jbHVzdGVyc2V0dGluZ3MtdmFsdWVcbiAgICAqL1xuICAgIGxldCBjbHVzdGVyU2V0dGluZ3MgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHByb3BzLmNvbnRhaW5lckluc2lnaHRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsdXN0ZXJTZXR0aW5ncyA9IFt7IG5hbWU6ICdjb250YWluZXJJbnNpZ2h0cycsIHZhbHVlOiBwcm9wcy5jb250YWluZXJJbnNpZ2h0cyA/IENvbnRhaW5lckluc2lnaHRzLkVOQUJMRUQgOiBDb250YWluZXJJbnNpZ2h0cy5ESVNBQkxFRCB9XTtcbiAgICB9XG5cbiAgICB0aGlzLl9jYXBhY2l0eVByb3ZpZGVyTmFtZXMgPSBwcm9wcy5jYXBhY2l0eVByb3ZpZGVycyA/PyBbXTtcbiAgICBpZiAocHJvcHMuZW5hYmxlRmFyZ2F0ZUNhcGFjaXR5UHJvdmlkZXJzKSB7XG4gICAgICB0aGlzLmVuYWJsZUZhcmdhdGVDYXBhY2l0eVByb3ZpZGVycygpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5leGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb24pIHtcbiAgICAgIGlmICgocHJvcHMuZXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uLmxvZ2dpbmcgPT09IEV4ZWN1dGVDb21tYW5kTG9nZ2luZy5PVkVSUklERSkgIT09XG4gICAgICAgIChwcm9wcy5leGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb24ubG9nQ29uZmlndXJhdGlvbiAhPT0gdW5kZWZpbmVkKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4ZWN1dGUgY29tbWFuZCBsb2cgY29uZmlndXJhdGlvbiBtdXN0IG9ubHkgYmUgc3BlY2lmaWVkIHdoZW4gbG9nZ2luZyBpcyBPVkVSUklERS4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2V4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbiA9IHByb3BzLmV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbjtcbiAgICB9XG5cbiAgICB0aGlzLl9jZm5DbHVzdGVyID0gbmV3IENmbkNsdXN0ZXIodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgY2x1c3Rlck5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgY2x1c3RlclNldHRpbmdzLFxuICAgICAgY29uZmlndXJhdGlvbjogdGhpcy5fZXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uICYmIHRoaXMucmVuZGVyRXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uKCksXG4gICAgfSk7XG5cbiAgICB0aGlzLmNsdXN0ZXJBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHRoaXMuX2NmbkNsdXN0ZXIuYXR0ckFybiwge1xuICAgICAgc2VydmljZTogJ2VjcycsXG4gICAgICByZXNvdXJjZTogJ2NsdXN0ZXInLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICB9KTtcbiAgICB0aGlzLmNsdXN0ZXJOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUodGhpcy5fY2ZuQ2x1c3Rlci5yZWYpO1xuXG4gICAgdGhpcy52cGMgPSBwcm9wcy52cGMgfHwgbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHsgbWF4QXpzOiAyIH0pO1xuXG4gICAgdGhpcy5fZGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlID0gcHJvcHMuZGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlICE9PSB1bmRlZmluZWRcbiAgICAgID8gdGhpcy5hZGREZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2UocHJvcHMuZGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlKVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLl9hdXRvc2NhbGluZ0dyb3VwID0gcHJvcHMuY2FwYWNpdHkgIT09IHVuZGVmaW5lZFxuICAgICAgPyB0aGlzLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHByb3BzLmNhcGFjaXR5KVxuICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGNyZWF0ZSBjbHVzdGVyIGNhcGFjaXR5IHByb3ZpZGVyIGFzc29jaWF0aW9ucyBpZiB0aGVyZSBhcmUgYW55IEVDMlxuICAgIC8vIGNhcGFjaXR5IHByb3ZpZGVycy4gT3JkaW5hcmlseSB3ZSdkIGp1c3QgYWRkIHRoZSBjb25zdHJ1Y3QgdG8gdGhlIHRyZWVcbiAgICAvLyBzaW5jZSBpdCdzIGhhcm1sZXNzLCBidXQgd2UnZCBwcmVmZXIgbm90IHRvIGFkZCB1bmV4cGVjdGVkIG5ld1xuICAgIC8vIHJlc291cmNlcyB0byB0aGUgc3RhY2sgd2hpY2ggY291bGQgc3VycHJpc2UgdXNlcnMgd29ya2luZyB3aXRoXG4gICAgLy8gYnJvd24tZmllbGQgQ0RLIGFwcHMgYW5kIHN0YWNrcy5cbiAgICBBc3BlY3RzLm9mKHRoaXMpLmFkZChuZXcgTWF5YmVDcmVhdGVDYXBhY2l0eVByb3ZpZGVyQXNzb2NpYXRpb25zKHRoaXMsIGlkKSk7XG4gIH1cblxuICAvKipcbiAgICogRW5hYmxlIHRoZSBGYXJnYXRlIGNhcGFjaXR5IHByb3ZpZGVycyBmb3IgdGhpcyBjbHVzdGVyLlxuICAgKi9cbiAgcHVibGljIGVuYWJsZUZhcmdhdGVDYXBhY2l0eVByb3ZpZGVycygpIHtcbiAgICBmb3IgKGNvbnN0IHByb3ZpZGVyIG9mIFsnRkFSR0FURScsICdGQVJHQVRFX1NQT1QnXSkge1xuICAgICAgaWYgKCF0aGlzLl9jYXBhY2l0eVByb3ZpZGVyTmFtZXMuaW5jbHVkZXMocHJvdmlkZXIpKSB7XG4gICAgICAgIHRoaXMuX2NhcGFjaXR5UHJvdmlkZXJOYW1lcy5wdXNoKHByb3ZpZGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGRlZmF1bHQgY2FwYWNpdHkgcHJvdmlkZXIgc3RyYXRlZ3kgZm9yIHRoaXMgY2x1c3Rlci5cbiAgICpcbiAgICogQHBhcmFtIGRlZmF1bHRDYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ3kgY2x1c3RlciBkZWZhdWx0IGNhcGFjaXR5IHByb3ZpZGVyIHN0cmF0ZWd5LiBUaGlzIHRha2VzIHRoZSBmb3JtIG9mIGEgbGlzdCBvZiBDYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ3kgb2JqZWN0cy5cbiAgICpcbiAgICogRm9yIGV4YW1wbGVcbiAgICogW1xuICAgKiAgIHtcbiAgICogICAgIGNhcGFjaXR5UHJvdmlkZXI6ICdGQVJHQVRFJyxcbiAgICogICAgIGJhc2U6IDEwLFxuICAgKiAgICAgd2VpZ2h0OiA1MFxuICAgKiAgIH1cbiAgICogXVxuICAgKi9cbiAgcHVibGljIGFkZERlZmF1bHRDYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ3koZGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneTogQ2FwYWNpdHlQcm92aWRlclN0cmF0ZWd5W10pIHtcbiAgICBpZiAodGhpcy5fZGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneS5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NsdXN0ZXIgZGVmYXVsdCBjYXBhY2l0eSBwcm92aWRlciBzdHJhdGVneSBpcyBhbHJlYWR5IHNldC4nKTtcbiAgICB9XG5cbiAgICBpZiAoZGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneS5zb21lKGRjcCA9PiBkY3AuY2FwYWNpdHlQcm92aWRlci5pbmNsdWRlcygnRkFSR0FURScpKSAmJiBkZWZhdWx0Q2FwYWNpdHlQcm92aWRlclN0cmF0ZWd5LnNvbWUoZGNwID0+ICFkY3AuY2FwYWNpdHlQcm92aWRlci5pbmNsdWRlcygnRkFSR0FURScpKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIGNhcGFjaXR5IHByb3ZpZGVyIHN0cmF0ZWd5IGNhbm5vdCBjb250YWluIGEgbWl4IG9mIGNhcGFjaXR5IHByb3ZpZGVycyB1c2luZyBBdXRvIFNjYWxpbmcgZ3JvdXBzIGFuZCBGYXJnYXRlIHByb3ZpZGVycy4gU3BlY2lmeSBvbmUgb3IgdGhlIG90aGVyIGFuZCB0cnkgYWdhaW4uJyk7XG4gICAgfVxuXG4gICAgZGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneS5mb3JFYWNoKGRjcCA9PiB7XG4gICAgICBpZiAoIXRoaXMuX2NhcGFjaXR5UHJvdmlkZXJOYW1lcy5pbmNsdWRlcyhkY3AuY2FwYWNpdHlQcm92aWRlcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYXBhY2l0eSBwcm92aWRlciAke2RjcC5jYXBhY2l0eVByb3ZpZGVyfSBtdXN0IGJlIGFkZGVkIHRvIHRoZSBjbHVzdGVyIHdpdGggYWRkQXNnQ2FwYWNpdHlQcm92aWRlcigpIGJlZm9yZSBpdCBjYW4gYmUgdXNlZCBpbiBhIGRlZmF1bHQgY2FwYWNpdHkgcHJvdmlkZXIgc3RyYXRlZ3kuYCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBkZWZhdWx0Q2FwYWNpdHlQcm92aWRlcnNXaXRoQmFzZSA9IGRlZmF1bHRDYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ3kuZmlsdGVyKGRjcCA9PiAhIWRjcC5iYXNlKTtcbiAgICBpZiAoZGVmYXVsdENhcGFjaXR5UHJvdmlkZXJzV2l0aEJhc2UubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IDEgY2FwYWNpdHkgcHJvdmlkZXIgaW4gYSBjYXBhY2l0eSBwcm92aWRlciBzdHJhdGVneSBjYW4gaGF2ZSBhIG5vbnplcm8gYmFzZS4nKTtcbiAgICB9XG4gICAgdGhpcy5fZGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneSA9IGRlZmF1bHRDYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ3k7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbigpOiBDZm5DbHVzdGVyLkNsdXN0ZXJDb25maWd1cmF0aW9uUHJvcGVydHkge1xuICAgIHJldHVybiB7XG4gICAgICBleGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAga21zS2V5SWQ6IHRoaXMuX2V4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbj8ua21zS2V5Py5rZXlBcm4sXG4gICAgICAgIGxvZ0NvbmZpZ3VyYXRpb246IHRoaXMuX2V4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbj8ubG9nQ29uZmlndXJhdGlvbiAmJiB0aGlzLnJlbmRlckV4ZWN1dGVDb21tYW5kTG9nQ29uZmlndXJhdGlvbigpLFxuICAgICAgICBsb2dnaW5nOiB0aGlzLl9leGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb24/LmxvZ2dpbmcsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckV4ZWN1dGVDb21tYW5kTG9nQ29uZmlndXJhdGlvbigpOiBDZm5DbHVzdGVyLkV4ZWN1dGVDb21tYW5kTG9nQ29uZmlndXJhdGlvblByb3BlcnR5IHtcbiAgICBjb25zdCBsb2dDb25maWd1cmF0aW9uID0gdGhpcy5fZXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uPy5sb2dDb25maWd1cmF0aW9uO1xuICAgIGlmIChsb2dDb25maWd1cmF0aW9uPy5zM0VuY3J5cHRpb25FbmFibGVkICYmICFsb2dDb25maWd1cmF0aW9uPy5zM0J1Y2tldCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBzcGVjaWZ5IGFuIFMzIGJ1Y2tldCBuYW1lIGluIHRoZSBleGVjdXRlIGNvbW1hbmQgbG9nIGNvbmZpZ3VyYXRpb24gdG8gZW5hYmxlIFMzIGVuY3J5cHRpb24uJyk7XG4gICAgfVxuICAgIGlmIChsb2dDb25maWd1cmF0aW9uPy5jbG91ZFdhdGNoRW5jcnlwdGlvbkVuYWJsZWQgJiYgIWxvZ0NvbmZpZ3VyYXRpb24/LmNsb3VkV2F0Y2hMb2dHcm91cCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBzcGVjaWZ5IGEgQ2xvdWRXYXRjaCBsb2cgZ3JvdXAgaW4gdGhlIGV4ZWN1dGUgY29tbWFuZCBsb2cgY29uZmlndXJhdGlvbiB0byBlbmFibGUgQ2xvdWRXYXRjaCBlbmNyeXB0aW9uLicpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgY2xvdWRXYXRjaEVuY3J5cHRpb25FbmFibGVkOiBsb2dDb25maWd1cmF0aW9uPy5jbG91ZFdhdGNoRW5jcnlwdGlvbkVuYWJsZWQsXG4gICAgICBjbG91ZFdhdGNoTG9nR3JvdXBOYW1lOiBsb2dDb25maWd1cmF0aW9uPy5jbG91ZFdhdGNoTG9nR3JvdXA/LmxvZ0dyb3VwTmFtZSxcbiAgICAgIHMzQnVja2V0TmFtZTogbG9nQ29uZmlndXJhdGlvbj8uczNCdWNrZXQ/LmJ1Y2tldE5hbWUsXG4gICAgICBzM0VuY3J5cHRpb25FbmFibGVkOiBsb2dDb25maWd1cmF0aW9uPy5zM0VuY3J5cHRpb25FbmFibGVkLFxuICAgICAgczNLZXlQcmVmaXg6IGxvZ0NvbmZpZ3VyYXRpb24/LnMzS2V5UHJlZml4LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIEFXUyBDbG91ZCBNYXAgRE5TIG5hbWVzcGFjZSBmb3IgdGhpcyBjbHVzdGVyLlxuICAgKiBOT1RFOiBIdHRwTmFtZXNwYWNlcyBhcmUgc3VwcG9ydGVkIG9ubHkgZm9yIHVzZSBjYXNlcyBpbnZvbHZpbmcgU2VydmljZSBDb25uZWN0LiBGb3IgdXNlIGNhc2VzIGludm9sdmluZyBib3RoIFNlcnZpY2UtXG4gICAqIERpc2NvdmVyeSBhbmQgU2VydmljZSBDb25uZWN0LCBjdXN0b21lcnMgc2hvdWxkIG1hbmFnZSB0aGUgSHR0cE5hbWVzcGFjZSBvdXRzaWRlIG9mIHRoZSBDbHVzdGVyLmFkZERlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSBtZXRob2QuXG4gICAqL1xuICBwdWJsaWMgYWRkRGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlKG9wdGlvbnM6IENsb3VkTWFwTmFtZXNwYWNlT3B0aW9ucyk6IGNsb3VkbWFwLklOYW1lc3BhY2Uge1xuICAgIGlmICh0aGlzLl9kZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gb25seSBhZGQgZGVmYXVsdCBuYW1lc3BhY2Ugb25jZS4nKTtcbiAgICB9XG5cbiAgICBjb25zdCBuYW1lc3BhY2VUeXBlID0gb3B0aW9ucy50eXBlICE9PSB1bmRlZmluZWRcbiAgICAgID8gb3B0aW9ucy50eXBlXG4gICAgICA6IGNsb3VkbWFwLk5hbWVzcGFjZVR5cGUuRE5TX1BSSVZBVEU7XG5cbiAgICBsZXQgc2ROYW1lc3BhY2U7XG4gICAgc3dpdGNoIChuYW1lc3BhY2VUeXBlKSB7XG4gICAgICBjYXNlIGNsb3VkbWFwLk5hbWVzcGFjZVR5cGUuRE5TX1BSSVZBVEU6XG4gICAgICAgIHNkTmFtZXNwYWNlID0gbmV3IGNsb3VkbWFwLlByaXZhdGVEbnNOYW1lc3BhY2UodGhpcywgJ0RlZmF1bHRTZXJ2aWNlRGlzY292ZXJ5TmFtZXNwYWNlJywge1xuICAgICAgICAgIG5hbWU6IG9wdGlvbnMubmFtZSxcbiAgICAgICAgICB2cGM6IHRoaXMudnBjLFxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGNsb3VkbWFwLk5hbWVzcGFjZVR5cGUuRE5TX1BVQkxJQzpcbiAgICAgICAgc2ROYW1lc3BhY2UgPSBuZXcgY2xvdWRtYXAuUHVibGljRG5zTmFtZXNwYWNlKHRoaXMsICdEZWZhdWx0U2VydmljZURpc2NvdmVyeU5hbWVzcGFjZScsIHtcbiAgICAgICAgICBuYW1lOiBvcHRpb25zLm5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgY2xvdWRtYXAuTmFtZXNwYWNlVHlwZS5IVFRQOlxuICAgICAgICBzZE5hbWVzcGFjZSA9IG5ldyBjbG91ZG1hcC5IdHRwTmFtZXNwYWNlKHRoaXMsICdEZWZhdWx0U2VydmljZURpc2NvdmVyeU5hbWVzcGFjZScsIHtcbiAgICAgICAgICBuYW1lOiBvcHRpb25zLm5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTmFtZXNwYWNlIHR5cGUgJHtuYW1lc3BhY2VUeXBlfSBpcyBub3Qgc3VwcG9ydGVkLmApO1xuICAgIH1cblxuICAgIHRoaXMuX2RlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSA9IHNkTmFtZXNwYWNlO1xuICAgIGlmIChvcHRpb25zLnVzZUZvclNlcnZpY2VDb25uZWN0KSB7XG4gICAgICB0aGlzLl9jZm5DbHVzdGVyLnNlcnZpY2VDb25uZWN0RGVmYXVsdHMgPSB7XG4gICAgICAgIG5hbWVzcGFjZTogb3B0aW9ucy5uYW1lLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2ROYW1lc3BhY2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfZGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneS4gVGhpcyBpcyBuZWNlc3NhcnkgdG8gY29ycmVjdGx5IGNyZWF0ZSBDYXBhY2l0eSBQcm92aWRlciBBc3NvY2lhdGlvbnMuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGRlZmF1bHRDYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ3koKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRDYXBhY2l0eVByb3ZpZGVyU3RyYXRlZ3k7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY2FwYWNpdHlQcm92aWRlck5hbWVzIGFkZGVkIHRvIGNsdXN0ZXJcbiAgICovXG4gIHB1YmxpYyBnZXQgY2FwYWNpdHlQcm92aWRlck5hbWVzKCkge1xuICAgIHJldHVybiB0aGlzLl9jYXBhY2l0eVByb3ZpZGVyTmFtZXM7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBuYW1lc3BhY2UgYWRkZWQgdG8gY2x1c3RlclxuICAgKi9cbiAgcHVibGljIGdldCBkZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2UoKTogY2xvdWRtYXAuSU5hbWVzcGFjZSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdCBpcyBoaWdobHkgcmVjb21tZW5kZWQgdG8gdXNlIGBDbHVzdGVyLmFkZEFzZ0NhcGFjaXR5UHJvdmlkZXJgIGluc3RlYWQgb2YgdGhpcyBtZXRob2QuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGFkZHMgY29tcHV0ZSBjYXBhY2l0eSB0byBhIGNsdXN0ZXIgYnkgY3JlYXRpbmcgYW4gQXV0b1NjYWxpbmdHcm91cCB3aXRoIHRoZSBzcGVjaWZpZWQgb3B0aW9ucy5cbiAgICpcbiAgICogUmV0dXJucyB0aGUgQXV0b1NjYWxpbmdHcm91cCBzbyB5b3UgY2FuIGFkZCBhdXRvc2NhbGluZyBzZXR0aW5ncyB0byBpdC5cbiAgICovXG4gIHB1YmxpYyBhZGRDYXBhY2l0eShpZDogc3RyaW5nLCBvcHRpb25zOiBBZGRDYXBhY2l0eU9wdGlvbnMpOiBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwIHtcbiAgICAvLyBEbyAyLXdheSBkZWZhdWx0aW5nIGhlcmU6IGlmIHRoZSBtYWNoaW5lSW1hZ2VUeXBlIGlzIEJPVFRMRVJPQ0tFVCwgcGljayB0aGUgcmlnaHQgQU1JLlxuICAgIC8vIE90aGVyd2lzZSwgZGV0ZXJtaW5lIHRoZSBtYWNoaW5lSW1hZ2VUeXBlIGZyb20gdGhlIGdpdmVuIEFNSS5cbiAgICBjb25zdCBtYWNoaW5lSW1hZ2UgPSBvcHRpb25zLm1hY2hpbmVJbWFnZSA/P1xuICAgICAgKG9wdGlvbnMubWFjaGluZUltYWdlVHlwZSA9PT0gTWFjaGluZUltYWdlVHlwZS5CT1RUTEVST0NLRVQgPyBuZXcgQm90dGxlUm9ja2V0SW1hZ2Uoe1xuICAgICAgICBhcmNoaXRlY3R1cmU6IG9wdGlvbnMuaW5zdGFuY2VUeXBlLmFyY2hpdGVjdHVyZSxcbiAgICAgIH0pIDogbmV3IEVjc09wdGltaXplZEFtaSgpKTtcblxuICAgIGNvbnN0IG1hY2hpbmVJbWFnZVR5cGUgPSBvcHRpb25zLm1hY2hpbmVJbWFnZVR5cGUgPz9cbiAgICAgIChpc0JvdHRsZVJvY2tldEltYWdlKG1hY2hpbmVJbWFnZSkgPyBNYWNoaW5lSW1hZ2VUeXBlLkJPVFRMRVJPQ0tFVCA6IE1hY2hpbmVJbWFnZVR5cGUuQU1BWk9OX0xJTlVYXzIpO1xuXG4gICAgY29uc3QgYXV0b1NjYWxpbmdHcm91cCA9IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHRoaXMsIGlkLCB7XG4gICAgICB2cGM6IHRoaXMudnBjLFxuICAgICAgbWFjaGluZUltYWdlLFxuICAgICAgdXBkYXRlVHlwZTogISFvcHRpb25zLnVwZGF0ZVBvbGljeSA/IHVuZGVmaW5lZCA6IG9wdGlvbnMudXBkYXRlVHlwZSB8fCBhdXRvc2NhbGluZy5VcGRhdGVUeXBlLlJFUExBQ0lOR19VUERBVEUsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hZGRBdXRvU2NhbGluZ0dyb3VwKGF1dG9TY2FsaW5nR3JvdXAsIHtcbiAgICAgIG1hY2hpbmVJbWFnZVR5cGU6IG1hY2hpbmVJbWFnZVR5cGUsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGF1dG9TY2FsaW5nR3JvdXA7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgYWRkcyBhbiBBdXRvIFNjYWxpbmcgR3JvdXAgQ2FwYWNpdHkgUHJvdmlkZXIgdG8gYSBjbHVzdGVyLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvdmlkZXIgdGhlIGNhcGFjaXR5IHByb3ZpZGVyIHRvIGFkZCB0byB0aGlzIGNsdXN0ZXIuXG4gICAqL1xuICBwdWJsaWMgYWRkQXNnQ2FwYWNpdHlQcm92aWRlcihwcm92aWRlcjogQXNnQ2FwYWNpdHlQcm92aWRlciwgb3B0aW9uczogQWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5T3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gRG9uJ3QgYWRkIHRoZSBzYW1lIGNhcGFjaXR5IHByb3ZpZGVyIG1vcmUgdGhhbiBvbmNlLlxuICAgIGlmICh0aGlzLl9jYXBhY2l0eVByb3ZpZGVyTmFtZXMuaW5jbHVkZXMocHJvdmlkZXIuY2FwYWNpdHlQcm92aWRlck5hbWUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2hhc0VjMkNhcGFjaXR5ID0gdHJ1ZTtcbiAgICB0aGlzLmNvbmZpZ3VyZUF1dG9TY2FsaW5nR3JvdXAocHJvdmlkZXIuYXV0b1NjYWxpbmdHcm91cCwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIG1hY2hpbmVJbWFnZVR5cGU6IHByb3ZpZGVyLm1hY2hpbmVJbWFnZVR5cGUsXG4gICAgICAvLyBEb24ndCBlbmFibGUgdGhlIGluc3RhbmNlLWRyYWluaW5nIGxpZmVjeWNsZSBob29rIGlmIG1hbmFnZWQgdGVybWluYXRpb24gcHJvdGVjdGlvbiBpcyBlbmFibGVkXG4gICAgICB0YXNrRHJhaW5UaW1lOiBwcm92aWRlci5lbmFibGVNYW5hZ2VkVGVybWluYXRpb25Qcm90ZWN0aW9uID8gRHVyYXRpb24uc2Vjb25kcygwKSA6IG9wdGlvbnMudGFza0RyYWluVGltZSxcbiAgICAgIGNhbkNvbnRhaW5lcnNBY2Nlc3NJbnN0YW5jZVJvbGU6IG9wdGlvbnMuY2FuQ29udGFpbmVyc0FjY2Vzc0luc3RhbmNlUm9sZSA/PyBwcm92aWRlci5jYW5Db250YWluZXJzQWNjZXNzSW5zdGFuY2VSb2xlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5fY2FwYWNpdHlQcm92aWRlck5hbWVzLnB1c2gocHJvdmlkZXIuY2FwYWNpdHlQcm92aWRlck5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGFkZHMgY29tcHV0ZSBjYXBhY2l0eSB0byBhIGNsdXN0ZXIgdXNpbmcgdGhlIHNwZWNpZmllZCBBdXRvU2NhbGluZ0dyb3VwLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYENsdXN0ZXIuYWRkQXNnQ2FwYWNpdHlQcm92aWRlcmAgaW5zdGVhZC5cbiAgICogQHBhcmFtIGF1dG9TY2FsaW5nR3JvdXAgdGhlIEFTRyB0byBhZGQgdG8gdGhpcyBjbHVzdGVyLlxuICAgKiBbZGlzYWJsZS1hd3NsaW50OnJlZi12aWEtaW50ZXJmYWNlXSBpcyBuZWVkZWQgaW4gb3JkZXIgdG8gaW5zdGFsbCB0aGUgRUNTXG4gICAqIGFnZW50IGJ5IHVwZGF0aW5nIHRoZSBBU0dzIHVzZXIgZGF0YS5cbiAgICovXG4gIHB1YmxpYyBhZGRBdXRvU2NhbGluZ0dyb3VwKGF1dG9TY2FsaW5nR3JvdXA6IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAsIG9wdGlvbnM6IEFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eU9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2hhc0VjMkNhcGFjaXR5ID0gdHJ1ZTtcbiAgICB0aGlzLmNvbm5lY3Rpb25zLmNvbm5lY3Rpb25zLmFkZFNlY3VyaXR5R3JvdXAoLi4uYXV0b1NjYWxpbmdHcm91cC5jb25uZWN0aW9ucy5zZWN1cml0eUdyb3Vwcyk7XG4gICAgdGhpcy5jb25maWd1cmVBdXRvU2NhbGluZ0dyb3VwKGF1dG9TY2FsaW5nR3JvdXAsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVBdXRvU2NhbGluZ0dyb3VwKGF1dG9TY2FsaW5nR3JvdXA6IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAsIG9wdGlvbnM6IEFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eU9wdGlvbnMgPSB7fSkge1xuICAgIGlmIChhdXRvU2NhbGluZ0dyb3VwLm9zVHlwZSA9PT0gZWMyLk9wZXJhdGluZ1N5c3RlbVR5cGUuV0lORE9XUykge1xuICAgICAgdGhpcy5jb25maWd1cmVXaW5kb3dzQXV0b1NjYWxpbmdHcm91cChhdXRvU2NhbGluZ0dyb3VwLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGllIGluc3RhbmNlcyB0byBjbHVzdGVyXG4gICAgICBzd2l0Y2ggKG9wdGlvbnMubWFjaGluZUltYWdlVHlwZSkge1xuICAgICAgICAvLyBCb3R0bGVyb2NrZXQgQU1JXG4gICAgICAgIGNhc2UgTWFjaGluZUltYWdlVHlwZS5CT1RUTEVST0NLRVQ6IHtcbiAgICAgICAgICBhdXRvU2NhbGluZ0dyb3VwLmFkZFVzZXJEYXRhKFxuICAgICAgICAgICAgLy8gQ29ubmVjdCB0byB0aGUgY2x1c3RlclxuICAgICAgICAgICAgLy8gU291cmNlOiBodHRwczovL2dpdGh1Yi5jb20vYm90dGxlcm9ja2V0LW9zL2JvdHRsZXJvY2tldC9ibG9iL2RldmVsb3AvUVVJQ0tTVEFSVC1FQ1MubWQjY29ubmVjdGluZy10by15b3VyLWNsdXN0ZXJcbiAgICAgICAgICAgICdbc2V0dGluZ3MuZWNzXScsXG4gICAgICAgICAgICBgY2x1c3RlciA9IFwiJHt0aGlzLmNsdXN0ZXJOYW1lfVwiYCxcbiAgICAgICAgICApO1xuICAgICAgICAgIC8vIEVuYWJsaW5nIFNTTVxuICAgICAgICAgIC8vIFNvdXJjZTogaHR0cHM6Ly9naXRodWIuY29tL2JvdHRsZXJvY2tldC1vcy9ib3R0bGVyb2NrZXQvYmxvYi9kZXZlbG9wL1FVSUNLU1RBUlQtRUNTLm1kI2VuYWJsaW5nLXNzbVxuICAgICAgICAgIGF1dG9TY2FsaW5nR3JvdXAucm9sZS5hZGRNYW5hZ2VkUG9saWN5KGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uU1NNTWFuYWdlZEluc3RhbmNlQ29yZScpKTtcbiAgICAgICAgICAvLyByZXF1aXJlZCBtYW5hZ2VkIHBvbGljeVxuICAgICAgICAgIGF1dG9TY2FsaW5nR3JvdXAucm9sZS5hZGRNYW5hZ2VkUG9saWN5KGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnc2VydmljZS1yb2xlL0FtYXpvbkVDMkNvbnRhaW5lclNlcnZpY2Vmb3JFQzJSb2xlJykpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gQW1hem9uIEVDUy1vcHRpbWl6ZWQgQU1JIGZvciBBbWF6b24gTGludXggMlxuICAgICAgICAgIGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEoYGVjaG8gRUNTX0NMVVNURVI9JHt0aGlzLmNsdXN0ZXJOYW1lfSA+PiAvZXRjL2Vjcy9lY3MuY29uZmlnYCk7XG4gICAgICAgICAgaWYgKCFvcHRpb25zLmNhbkNvbnRhaW5lcnNBY2Nlc3NJbnN0YW5jZVJvbGUpIHtcbiAgICAgICAgICAgIC8vIERlbnkgY29udGFpbmVycyBhY2Nlc3MgdG8gaW5zdGFuY2UgbWV0YWRhdGEgc2VydmljZVxuICAgICAgICAgICAgLy8gU291cmNlOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNTL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9pbnN0YW5jZV9JQU1fcm9sZS5odG1sXG4gICAgICAgICAgICBhdXRvU2NhbGluZ0dyb3VwLmFkZFVzZXJEYXRhKCdzdWRvIGlwdGFibGVzIC0taW5zZXJ0IEZPUldBUkQgMSAtLWluLWludGVyZmFjZSBkb2NrZXIrIC0tZGVzdGluYXRpb24gMTY5LjI1NC4xNjkuMjU0LzMyIC0tanVtcCBEUk9QJyk7XG4gICAgICAgICAgICBhdXRvU2NhbGluZ0dyb3VwLmFkZFVzZXJEYXRhKCdzdWRvIHNlcnZpY2UgaXB0YWJsZXMgc2F2ZScpO1xuICAgICAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBpcyBvbmx5IGZvciBBd3NWcGMgbmV0d29ya2luZyBtb2RlLCBidXQgZG9lc24ndCBodXJ0IGZvciB0aGUgb3RoZXIgbW9kZXMuXG4gICAgICAgICAgICBhdXRvU2NhbGluZ0dyb3VwLmFkZFVzZXJEYXRhKCdlY2hvIEVDU19BV1NWUENfQkxPQ0tfSU1EUz10cnVlID4+IC9ldGMvZWNzL2Vjcy5jb25maWcnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYXV0b1NjYWxpbmdHcm91cC5zcG90UHJpY2UgJiYgb3B0aW9ucy5zcG90SW5zdGFuY2VEcmFpbmluZykge1xuICAgICAgICAgICAgYXV0b1NjYWxpbmdHcm91cC5hZGRVc2VyRGF0YSgnZWNobyBFQ1NfRU5BQkxFX1NQT1RfSU5TVEFOQ0VfRFJBSU5JTkc9dHJ1ZSA+PiAvZXRjL2Vjcy9lY3MuY29uZmlnJyk7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEVDUyBpbnN0YW5jZXMgbXVzdCBiZSBhYmxlIHRvIGRvIHRoZXNlIHRoaW5nc1xuICAgIC8vIFNvdXJjZTogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUy9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvaW5zdGFuY2VfSUFNX3JvbGUuaHRtbFxuICAgIC8vIEJ1dCwgc2NvcGVkIGRvd24gdG8gbWluaW1hbCBwZXJtaXNzaW9ucyByZXF1aXJlZC5cbiAgICAvLyAgTm90ZXM6XG4gICAgLy8gICAtICdlY3M6Q3JlYXRlQ2x1c3RlcicgcmVtb3ZlZC4gVGhlIGNsdXN0ZXIgYWxyZWFkeSBleGlzdHMuXG4gICAgYXV0b1NjYWxpbmdHcm91cC5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICAnZWNzOkRlcmVnaXN0ZXJDb250YWluZXJJbnN0YW5jZScsXG4gICAgICAgICdlY3M6UmVnaXN0ZXJDb250YWluZXJJbnN0YW5jZScsXG4gICAgICAgICdlY3M6U3VibWl0KicsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgIHRoaXMuY2x1c3RlckFybixcbiAgICAgIF0sXG4gICAgfSkpO1xuICAgIGF1dG9TY2FsaW5nR3JvdXAuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgLy8gVGhlc2UgYWN0IG9uIGEgY2x1c3RlciBpbnN0YW5jZSwgYW5kIHRoZSBpbnN0YW5jZSBkb2Vzbid0IGV4aXN0IHVudGlsIHRoZSBzZXJ2aWNlIHN0YXJ0cy5cbiAgICAgICAgLy8gVGh1cywgc2NvcGUgdG8gdGhlIGNsdXN0ZXIgdXNpbmcgYSBjb25kaXRpb24uXG4gICAgICAgIC8vIFNlZTogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL2xpc3RfYW1hem9uZWxhc3RpY2NvbnRhaW5lcnNlcnZpY2UuaHRtbFxuICAgICAgICAnZWNzOlBvbGwnLFxuICAgICAgICAnZWNzOlN0YXJ0VGVsZW1ldHJ5U2Vzc2lvbicsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgQXJuRXF1YWxzOiB7ICdlY3M6Y2x1c3Rlcic6IHRoaXMuY2x1c3RlckFybiB9LFxuICAgICAgfSxcbiAgICB9KSk7XG4gICAgYXV0b1NjYWxpbmdHcm91cC5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICAvLyBUaGVzZSBkbyBub3Qgc3VwcG9ydCByZXNvdXJjZSBjb25zdHJhaW50cywgYW5kIG11c3QgYmUgcmVzb3VyY2UgJyonXG4gICAgICAgICdlY3M6RGlzY292ZXJQb2xsRW5kcG9pbnQnLFxuICAgICAgICAnZWNyOkdldEF1dGhvcml6YXRpb25Ub2tlbicsXG4gICAgICAgIC8vIFByZXNlcnZlZCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIC8vIFVzZXJzIGFyZSBhYmxlIHRvIGVuYWJsZSBjbG91ZHdhdGNoIGFnZW50IHVzaW5nIENESy4gRXhpc3RpbmdcbiAgICAgICAgLy8gY3VzdG9tZXJzIG1pZ2h0IGJlIGluc3RhbGxpbmcgQ1cgYWdlbnQgYXMgcGFydCBvZiB1c2VyLWRhdGEgc28gaWYgd2VcbiAgICAgICAgLy8gcmVtb3ZlIHRoZXNlIHBlcm1pc3Npb25zIHdlIHdpbGwgYnJlYWsgdGhhdCBjdXN0b21lciB1c2UgY2FzZXMuXG4gICAgICAgICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsXG4gICAgICAgICdsb2dzOlB1dExvZ0V2ZW50cycsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICB9KSk7XG5cbiAgICAvLyAwIGRpc2FibGVzLCBvdGhlcndpc2UgZm9yd2FyZCB0byB1bmRlcmx5aW5nIGltcGxlbWVudGF0aW9uIHdoaWNoIHBpY2tzIHRoZSBzYW5lIGRlZmF1bHRcbiAgICBpZiAoIW9wdGlvbnMudGFza0RyYWluVGltZSB8fCBvcHRpb25zLnRhc2tEcmFpblRpbWUudG9TZWNvbmRzKCkgIT09IDApIHtcbiAgICAgIG5ldyBJbnN0YW5jZURyYWluSG9vayhhdXRvU2NhbGluZ0dyb3VwLCAnRHJhaW5FQ1NIb29rJywge1xuICAgICAgICBhdXRvU2NhbGluZ0dyb3VwLFxuICAgICAgICBjbHVzdGVyOiB0aGlzLFxuICAgICAgICBkcmFpblRpbWU6IG9wdGlvbnMudGFza0RyYWluVGltZSxcbiAgICAgICAgdG9waWNFbmNyeXB0aW9uS2V5OiBvcHRpb25zLnRvcGljRW5jcnlwdGlvbktleSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBlbmFibGVzIHRoZSBGYXJnYXRlIG9yIEZhcmdhdGUgU3BvdCBjYXBhY2l0eSBwcm92aWRlcnMgb24gdGhlIGNsdXN0ZXIuXG4gICAqXG4gICAqIEBwYXJhbSBwcm92aWRlciB0aGUgY2FwYWNpdHkgcHJvdmlkZXIgdG8gYWRkIHRvIHRoaXMgY2x1c3Rlci5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBlbmFibGVGYXJnYXRlQ2FwYWNpdHlQcm92aWRlcnNgIGluc3RlYWQuXG4gICAqIEBzZWUgYGFkZEFzZ0NhcGFjaXR5UHJvdmlkZXJgIHRvIGFkZCBhbiBBdXRvIFNjYWxpbmcgR3JvdXAgY2FwYWNpdHkgcHJvdmlkZXIgdG8gdGhlIGNsdXN0ZXIuXG4gICAqL1xuICBwdWJsaWMgYWRkQ2FwYWNpdHlQcm92aWRlcihwcm92aWRlcjogc3RyaW5nKSB7XG4gICAgaWYgKCEocHJvdmlkZXIgPT09ICdGQVJHQVRFJyB8fCBwcm92aWRlciA9PT0gJ0ZBUkdBVEVfU1BPVCcpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhcGFjaXR5UHJvdmlkZXIgbm90IHN1cHBvcnRlZCcpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5fY2FwYWNpdHlQcm92aWRlck5hbWVzLmluY2x1ZGVzKHByb3ZpZGVyKSkge1xuICAgICAgdGhpcy5fY2FwYWNpdHlQcm92aWRlck5hbWVzLnB1c2gocHJvdmlkZXIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY29uZmlndXJlV2luZG93c0F1dG9TY2FsaW5nR3JvdXAoYXV0b1NjYWxpbmdHcm91cDogYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cCwgb3B0aW9uczogQWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5T3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gY2xlYXIgdGhlIGNhY2hlIG9mIHRoZSBhZ2VudFxuICAgIGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEoJ1JlbW92ZS1JdGVtIC1SZWN1cnNlIEM6XFxcXFByb2dyYW1EYXRhXFxcXEFtYXpvblxcXFxFQ1NcXFxcQ2FjaGUnKTtcblxuICAgIC8vIHB1bGwgdGhlIGxhdGVzdCBFQ1MgVG9vbHNcbiAgICBhdXRvU2NhbGluZ0dyb3VwLmFkZFVzZXJEYXRhKCdJbXBvcnQtTW9kdWxlIEVDU1Rvb2xzJyk7XG5cbiAgICAvLyBzZXQgdGhlIGNsdXN0ZXIgbmFtZSBlbnZpcm9ubWVudCB2YXJpYWJsZVxuICAgIGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEoYFtFbnZpcm9ubWVudF06OlNldEVudmlyb25tZW50VmFyaWFibGUoXCJFQ1NfQ0xVU1RFUlwiLCBcIiR7dGhpcy5jbHVzdGVyTmFtZX1cIiwgXCJNYWNoaW5lXCIpYCk7XG4gICAgYXV0b1NjYWxpbmdHcm91cC5hZGRVc2VyRGF0YSgnW0Vudmlyb25tZW50XTo6U2V0RW52aXJvbm1lbnRWYXJpYWJsZShcIkVDU19FTkFCTEVfQVdTTE9HU19FWEVDVVRJT05ST0xFX09WRVJSSURFXCIsIFwidHJ1ZVwiLCBcIk1hY2hpbmVcIiknKTtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG1heC1saW5lLWxlbmd0aFxuICAgIGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEoJ1tFbnZpcm9ubWVudF06OlNldEVudmlyb25tZW50VmFyaWFibGUoXCJFQ1NfQVZBSUxBQkxFX0xPR0dJTkdfRFJJVkVSU1wiLCBcXCdbXCJqc29uLWZpbGVcIixcImF3c2xvZ3NcIl1cXCcsIFwiTWFjaGluZVwiKScpO1xuXG4gICAgLy8gZW5hYmxlIGluc3RhbmNlIGRyYWluaW5nXG4gICAgaWYgKGF1dG9TY2FsaW5nR3JvdXAuc3BvdFByaWNlICYmIG9wdGlvbnMuc3BvdEluc3RhbmNlRHJhaW5pbmcpIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEoJ1tFbnZpcm9ubWVudF06OlNldEVudmlyb25tZW50VmFyaWFibGUoXCJFQ1NfRU5BQkxFX1NQT1RfSU5TVEFOQ0VfRFJBSU5JTkdcIiwgXCJ0cnVlXCIsIFwiTWFjaGluZVwiKScpO1xuICAgIH1cblxuICAgIC8vIGVuYWJsZSB0YXNrIGlhbSByb2xlXG4gICAgaWYgKCFvcHRpb25zLmNhbkNvbnRhaW5lcnNBY2Nlc3NJbnN0YW5jZVJvbGUpIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEoJ1tFbnZpcm9ubWVudF06OlNldEVudmlyb25tZW50VmFyaWFibGUoXCJFQ1NfRU5BQkxFX1RBU0tfSUFNX1JPTEVcIiwgXCJ0cnVlXCIsIFwiTWFjaGluZVwiKScpO1xuICAgICAgYXV0b1NjYWxpbmdHcm91cC5hZGRVc2VyRGF0YShgSW5pdGlhbGl6ZS1FQ1NBZ2VudCAtQ2x1c3RlciAnJHt0aGlzLmNsdXN0ZXJOYW1lfScgLUVuYWJsZVRhc2tJQU1Sb2xlYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXAuYWRkVXNlckRhdGEoYEluaXRpYWxpemUtRUNTQWdlbnQgLUNsdXN0ZXIgJyR7dGhpcy5jbHVzdGVyTmFtZX0nYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgYXV0b3NjYWxpbmcgZ3JvdXAgYWRkZWQgdG8gY2x1c3RlclxuICAgKi9cbiAgcHVibGljIGdldCBhdXRvc2NhbGluZ0dyb3VwKCk6IGF1dG9zY2FsaW5nLklBdXRvU2NhbGluZ0dyb3VwIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fYXV0b3NjYWxpbmdHcm91cDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBjbHVzdGVyIGhhcyBFQzIgY2FwYWNpdHkgYXNzb2NpYXRlZCB3aXRoIGl0XG4gICAqL1xuICBwdWJsaWMgZ2V0IGhhc0VjMkNhcGFjaXR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9oYXNFYzJDYXBhY2l0eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGV4ZWN1dGUgY29tbWFuZCBjb25maWd1cmF0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2x1c3Rlci5cbiAgICovXG4gIHB1YmxpYyBnZXQgZXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uKCk6IEV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2V4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBDbG91ZFdhdGNoIG1ldHJpYyBmb3IgdGhpcyBjbHVzdGVycyBDUFUgcmVzZXJ2YXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNDcHVSZXNlcnZhdGlvbihwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoRUNTTWV0cmljcy5jcHVSZXNlcnZhdGlvbkF2ZXJhZ2UsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBDbG91ZFdhdGNoIG1ldHJpYyBmb3IgdGhpcyBjbHVzdGVycyBDUFUgdXRpbGl6YXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNDcHVVdGlsaXphdGlvbihwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoRUNTTWV0cmljcy5jcHVVdGlsaXphdGlvbkF2ZXJhZ2UsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBDbG91ZFdhdGNoIG1ldHJpYyBmb3IgdGhpcyBjbHVzdGVycyBtZW1vcnkgcmVzZXJ2YXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNNZW1vcnlSZXNlcnZhdGlvbihwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoRUNTTWV0cmljcy5tZW1vcnlSZXNlcnZhdGlvbkF2ZXJhZ2UsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBDbG91ZFdhdGNoIG1ldHJpYyBmb3IgdGhpcyBjbHVzdGVycyBtZW1vcnkgdXRpbGl6YXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNNZW1vcnlVdGlsaXphdGlvbihwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5jYW5uZWRNZXRyaWMoRUNTTWV0cmljcy5tZW1vcnlVdGlsaXphdGlvbkF2ZXJhZ2UsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBzcGVjaWZlZCBDbG91ZFdhdGNoIG1ldHJpYyBmb3IgdGhpcyBjbHVzdGVyLlxuICAgKi9cbiAgcHVibGljIG1ldHJpYyhtZXRyaWNOYW1lOiBzdHJpbmcsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgbmFtZXNwYWNlOiAnQVdTL0VDUycsXG4gICAgICBtZXRyaWNOYW1lLFxuICAgICAgZGltZW5zaW9uc01hcDogeyBDbHVzdGVyTmFtZTogdGhpcy5jbHVzdGVyTmFtZSB9LFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSkuYXR0YWNoVG8odGhpcyk7XG4gIH1cblxuICBwcml2YXRlIGNhbm5lZE1ldHJpYyhcbiAgICBmbjogKGRpbXM6IHsgQ2x1c3Rlck5hbWU6IHN0cmluZyB9KSA9PiBjbG91ZHdhdGNoLk1ldHJpY1Byb3BzLFxuICAgIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWMge1xuICAgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoe1xuICAgICAgLi4uZm4oeyBDbHVzdGVyTmFtZTogdGhpcy5jbHVzdGVyTmFtZSB9KSxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pLmF0dGFjaFRvKHRoaXMpO1xuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShDbHVzdGVyLnByb3RvdHlwZSwgQ0xVU1RFUl9TWU1CT0wsIHtcbiAgdmFsdWU6IHRydWUsXG4gIGVudW1lcmFibGU6IGZhbHNlLFxuICB3cml0YWJsZTogZmFsc2UsXG59KTtcblxuLyoqXG4gKiBBIHJlZ2lvbmFsIGdyb3VwaW5nIG9mIG9uZSBvciBtb3JlIGNvbnRhaW5lciBpbnN0YW5jZXMgb24gd2hpY2ggeW91IGNhbiBydW4gdGFza3MgYW5kIHNlcnZpY2VzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElDbHVzdGVyIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBjbHVzdGVyLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgdGhhdCBpZGVudGlmaWVzIHRoZSBjbHVzdGVyLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBWUEMgYXNzb2NpYXRlZCB3aXRoIHRoZSBjbHVzdGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgdnBjOiBlYzIuSVZwYztcblxuICAvKipcbiAgICogTWFuYWdlIHRoZSBhbGxvd2VkIG5ldHdvcmsgY29ubmVjdGlvbnMgZm9yIHRoZSBjbHVzdGVyIHdpdGggU2VjdXJpdHkgR3JvdXBzLlxuICAgKi9cbiAgcmVhZG9ubHkgY29ubmVjdGlvbnM6IGVjMi5Db25uZWN0aW9ucztcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdGhlIGNsdXN0ZXIgaGFzIEVDMiBpbnN0YW5jZSBjYXBhY2l0eS5cbiAgICovXG4gIHJlYWRvbmx5IGhhc0VjMkNhcGFjaXR5OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgQVdTIENsb3VkIE1hcCBuYW1lc3BhY2UgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGNsdXN0ZXIuXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2U/OiBjbG91ZG1hcC5JTmFtZXNwYWNlO1xuXG4gIC8qKlxuICAgKiBUaGUgYXV0b3NjYWxpbmcgZ3JvdXAgYWRkZWQgdG8gdGhlIGNsdXN0ZXIgaWYgY2FwYWNpdHkgaXMgYXNzb2NpYXRlZCB0byB0aGUgY2x1c3RlclxuICAgKi9cbiAgcmVhZG9ubHkgYXV0b3NjYWxpbmdHcm91cD86IGF1dG9zY2FsaW5nLklBdXRvU2NhbGluZ0dyb3VwO1xuXG4gIC8qKlxuICAgKiBUaGUgZXhlY3V0ZSBjb21tYW5kIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBjbHVzdGVyXG4gICAqL1xuICByZWFkb25seSBleGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb24/OiBFeGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb247XG59XG5cbi8qKlxuICogVGhlIHByb3BlcnRpZXMgdG8gaW1wb3J0IGZyb20gdGhlIEVDUyBjbHVzdGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsdXN0ZXJBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBjbHVzdGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgY2x1c3Rlck5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIHRoYXQgaWRlbnRpZmllcyB0aGUgY2x1c3Rlci5cbiAgICpcbiAgICogQGRlZmF1bHQgRGVyaXZlZCBmcm9tIGNsdXN0ZXJOYW1lXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyQXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgVlBDIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2x1c3Rlci5cbiAgICovXG4gIHJlYWRvbmx5IHZwYzogZWMyLklWcGM7XG5cbiAgLyoqXG4gICAqIFRoZSBzZWN1cml0eSBncm91cHMgYXNzb2NpYXRlZCB3aXRoIHRoZSBjb250YWluZXIgaW5zdGFuY2VzIHJlZ2lzdGVyZWQgdG8gdGhlIGNsdXN0ZXIuXG4gICAqL1xuICByZWFkb25seSBzZWN1cml0eUdyb3VwczogZWMyLklTZWN1cml0eUdyb3VwW107XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRoZSBjbHVzdGVyIGhhcyBFQzIgaW5zdGFuY2UgY2FwYWNpdHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGhhc0VjMkNhcGFjaXR5PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIEFXUyBDbG91ZCBNYXAgbmFtZXNwYWNlIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBjbHVzdGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlZmF1bHQgbmFtZXNwYWNlXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2U/OiBjbG91ZG1hcC5JTmFtZXNwYWNlO1xuXG4gIC8qKlxuICAgKiBBdXRvc2NhbGluZyBncm91cCBhZGRlZCB0byB0aGUgY2x1c3RlciBpZiBjYXBhY2l0eSBpcyBhZGRlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlZmF1bHQgYXV0b3NjYWxpbmcgZ3JvdXBcbiAgICovXG4gIHJlYWRvbmx5IGF1dG9zY2FsaW5nR3JvdXA/OiBhdXRvc2NhbGluZy5JQXV0b1NjYWxpbmdHcm91cDtcblxuICAvKipcbiAgICogVGhlIGV4ZWN1dGUgY29tbWFuZCBjb25maWd1cmF0aW9uIGZvciB0aGUgY2x1c3RlclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmUuXG4gICAqL1xuICByZWFkb25seSBleGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb24/OiBFeGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb247XG59XG5cbi8qKlxuICogQW4gQ2x1c3RlciB0aGF0IGhhcyBiZWVuIGltcG9ydGVkXG4gKi9cbmNsYXNzIEltcG9ydGVkQ2x1c3RlciBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUNsdXN0ZXIge1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgY2x1c3RlclxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXJOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFSTiBvZiB0aGUgY2x1c3RlclxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNsdXN0ZXJBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVlBDIHRoYXQgdGhlIGNsdXN0ZXIgaW5zdGFuY2VzIGFyZSBydW5uaW5nIGluXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdnBjOiBlYzIuSVZwYztcblxuICAvKipcbiAgICogU2VjdXJpdHkgZ3JvdXAgb2YgdGhlIGNsdXN0ZXIgaW5zdGFuY2VzXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvbnMgPSBuZXcgZWMyLkNvbm5lY3Rpb25zKCk7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNsdXN0ZXIgaGFzIEVDMiBjYXBhY2l0eVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGhhc0VjMkNhcGFjaXR5OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBDbG91ZG1hcCBuYW1lc3BhY2UgY3JlYXRlZCBpbiB0aGUgY2x1c3RlclxuICAgKi9cbiAgcHJpdmF0ZSBfZGVmYXVsdENsb3VkTWFwTmFtZXNwYWNlPzogY2xvdWRtYXAuSU5hbWVzcGFjZTtcblxuICAvKipcbiAgICogVGhlIGV4ZWN1dGUgY29tbWFuZCBjb25maWd1cmF0aW9uIGZvciB0aGUgY2x1c3RlclxuICAgKi9cbiAgcHJpdmF0ZSBfZXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uPzogRXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBJbXBvcnRlZENsdXN0ZXIgY2xhc3MuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ2x1c3RlckF0dHJpYnV0ZXMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIHRoaXMuY2x1c3Rlck5hbWUgPSBwcm9wcy5jbHVzdGVyTmFtZTtcbiAgICB0aGlzLnZwYyA9IHByb3BzLnZwYztcbiAgICB0aGlzLmhhc0VjMkNhcGFjaXR5ID0gcHJvcHMuaGFzRWMyQ2FwYWNpdHkgIT09IGZhbHNlO1xuICAgIHRoaXMuX2RlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZSA9IHByb3BzLmRlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZTtcbiAgICB0aGlzLl9leGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb24gPSBwcm9wcy5leGVjdXRlQ29tbWFuZENvbmZpZ3VyYXRpb247XG5cbiAgICB0aGlzLmNsdXN0ZXJBcm4gPSBwcm9wcy5jbHVzdGVyQXJuID8/IFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnZWNzJyxcbiAgICAgIHJlc291cmNlOiAnY2x1c3RlcicsXG4gICAgICByZXNvdXJjZU5hbWU6IHByb3BzLmNsdXN0ZXJOYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5jb25uZWN0aW9ucyA9IG5ldyBlYzIuQ29ubmVjdGlvbnMoe1xuICAgICAgc2VjdXJpdHlHcm91cHM6IHByb3BzLnNlY3VyaXR5R3JvdXBzLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldCBkZWZhdWx0Q2xvdWRNYXBOYW1lc3BhY2UoKTogY2xvdWRtYXAuSU5hbWVzcGFjZSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRDbG91ZE1hcE5hbWVzcGFjZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgZXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uKCk6IEV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2V4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbjtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBwcm9wZXJ0aWVzIGZvciBhZGRpbmcgYW4gQXV0b1NjYWxpbmdHcm91cC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHlPcHRpb25zIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRoZSBjb250YWluZXJzIGNhbiBhY2Nlc3MgdGhlIGNvbnRhaW5lciBpbnN0YW5jZSByb2xlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgY2FuQ29udGFpbmVyc0FjY2Vzc0luc3RhbmNlUm9sZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIHBlcmlvZCB0byB3YWl0IGJlZm9yZSBmb3JjZSB0ZXJtaW5hdGluZyBhbiBpbnN0YW5jZSB0aGF0IGlzIGRyYWluaW5nLlxuICAgKlxuICAgKiBUaGlzIGNyZWF0ZXMgYSBMYW1iZGEgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIGJ5IGEgbGlmZWN5Y2xlIGhvb2sgZm9yIHRoZVxuICAgKiBBdXRvU2NhbGluZ0dyb3VwIHRoYXQgd2lsbCBkZWxheSBpbnN0YW5jZSB0ZXJtaW5hdGlvbiB1bnRpbCBhbGwgRUNTIHRhc2tzXG4gICAqIGhhdmUgZHJhaW5lZCBmcm9tIHRoZSBpbnN0YW5jZS4gU2V0IHRvIDAgdG8gZGlzYWJsZSB0YXNrIGRyYWluaW5nLlxuICAgKlxuICAgKiBTZXQgdG8gMCB0byBkaXNhYmxlIHRhc2sgZHJhaW5pbmcuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFRoZSBsaWZlY3ljbGUgZHJhaW5pbmcgaG9vayBpcyBub3QgY29uZmlndXJlZCBpZiB1c2luZyB0aGUgRUMyIENhcGFjaXR5IFByb3ZpZGVyLiBFbmFibGUgbWFuYWdlZCB0ZXJtaW5hdGlvbiBwcm90ZWN0aW9uIGluc3RlYWQuXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLm1pbnV0ZXMoNSlcbiAgICovXG4gIHJlYWRvbmx5IHRhc2tEcmFpblRpbWU/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogU3BlY2lmeSB3aGV0aGVyIHRvIGVuYWJsZSBBdXRvbWF0ZWQgRHJhaW5pbmcgZm9yIFNwb3QgSW5zdGFuY2VzIHJ1bm5pbmcgQW1hem9uIEVDUyBTZXJ2aWNlcy5cbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbVXNpbmcgU3BvdCBJbnN0YW5jZXNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NvbnRhaW5lci1pbnN0YW5jZS1zcG90Lmh0bWwpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgc3BvdEluc3RhbmNlRHJhaW5pbmc/OiBib29sZWFuXG5cbiAgLyoqXG4gICAqIElmIGBBZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHlPcHRpb25zLnRhc2tEcmFpblRpbWVgIGlzIG5vbi16ZXJvLCB0aGVuIHRoZSBFQ1MgY2x1c3RlciBjcmVhdGVzIGFuXG4gICAqIFNOUyBUb3BpYyB0byBhcyBwYXJ0IG9mIGEgc3lzdGVtIHRvIGRyYWluIGluc3RhbmNlcyBvZiB0YXNrcyB3aGVuIHRoZSBpbnN0YW5jZSBpcyBiZWluZyBzaHV0IGRvd24uXG4gICAqIElmIHRoaXMgcHJvcGVydHkgaXMgcHJvdmlkZWQsIHRoZW4gdGhpcyBrZXkgd2lsbCBiZSB1c2VkIHRvIGVuY3J5cHQgdGhlIGNvbnRlbnRzIG9mIHRoYXQgU05TIFRvcGljLlxuICAgKiBTZWUgW1NOUyBEYXRhIEVuY3J5cHRpb25dKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zbnMvbGF0ZXN0L2RnL3Nucy1kYXRhLWVuY3J5cHRpb24uaHRtbCkgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IFRoZSBTTlMgVG9waWMgd2lsbCBub3QgYmUgZW5jcnlwdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgdG9waWNFbmNyeXB0aW9uS2V5Pzoga21zLklLZXk7XG5cbiAgLyoqXG4gICAqIFdoYXQgdHlwZSBvZiBtYWNoaW5lIGltYWdlIHRoaXMgaXNcbiAgICpcbiAgICogRGVwZW5kaW5nIG9uIHRoZSBzZXR0aW5nLCBkaWZmZXJlbnQgVXNlckRhdGEgd2lsbCBhdXRvbWF0aWNhbGx5IGJlIGFkZGVkXG4gICAqIHRvIHRoZSBgQXV0b1NjYWxpbmdHcm91cGAgdG8gY29uZmlndXJlIGl0IHByb3Blcmx5IGZvciB1c2Ugd2l0aCBFQ1MuXG4gICAqXG4gICAqIElmIHlvdSBjcmVhdGUgYW4gYEF1dG9TY2FsaW5nR3JvdXBgIHlvdXJzZWxmIGFuZCBhcmUgYWRkaW5nIGl0IHZpYVxuICAgKiBgYWRkQXV0b1NjYWxpbmdHcm91cCgpYCwgeW91IG11c3Qgc3BlY2lmeSB0aGlzIHZhbHVlLiBJZiB5b3UgYXJlIGFkZGluZyBhblxuICAgKiBgYXV0b1NjYWxpbmdHcm91cGAgdmlhIGBhZGRDYXBhY2l0eWAsIHRoaXMgdmFsdWUgd2lsbCBiZSBkZXRlcm1pbmVkXG4gICAqIGZyb20gdGhlIGBtYWNoaW5lSW1hZ2VgIHlvdSBwYXNzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lZCBmcm9tIGBtYWNoaW5lSW1hZ2VgLCBpZiBhdmFpbGFibGUsIG90aGVyd2lzZSBgTWFjaGluZUltYWdlVHlwZS5BTUFaT05fTElOVVhfMmAuXG4gICAqL1xuICByZWFkb25seSBtYWNoaW5lSW1hZ2VUeXBlPzogTWFjaGluZUltYWdlVHlwZTtcbn1cblxuLyoqXG4gKiBUaGUgcHJvcGVydGllcyBmb3IgYWRkaW5nIGluc3RhbmNlIGNhcGFjaXR5IHRvIGFuIEF1dG9TY2FsaW5nR3JvdXAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWRkQ2FwYWNpdHlPcHRpb25zIGV4dGVuZHMgQWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5T3B0aW9ucywgYXV0b3NjYWxpbmcuQ29tbW9uQXV0b1NjYWxpbmdHcm91cFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBFQzIgaW5zdGFuY2UgdHlwZSB0byB1c2Ugd2hlbiBsYXVuY2hpbmcgaW5zdGFuY2VzIGludG8gdGhlIEF1dG9TY2FsaW5nR3JvdXAuXG4gICAqL1xuICByZWFkb25seSBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBFQ1Mtb3B0aW1pemVkIEFNSSB2YXJpYW50IHRvIHVzZVxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBpcyB0byB1c2UgYW4gRUNTLW9wdGltaXplZCBBTUkgb2YgQW1hem9uIExpbnV4IDIgd2hpY2ggaXNcbiAgICogYXV0b21hdGljYWxseSB1cGRhdGVkIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvbiBldmVyeSBkZXBsb3ltZW50LiBUaGlzIHdpbGxcbiAgICogcmVwbGFjZSB0aGUgaW5zdGFuY2VzIGluIHRoZSBBdXRvU2NhbGluZ0dyb3VwLiBNYWtlIHN1cmUgeW91IGhhdmUgbm90IGRpc2FibGVkXG4gICAqIHRhc2sgZHJhaW5pbmcsIHRvIGF2b2lkIGRvd250aW1lIHdoZW4gdGhlIEFNSSB1cGRhdGVzLlxuICAgKlxuICAgKiBUbyB1c2UgYW4gaW1hZ2UgdGhhdCBkb2VzIG5vdCB1cGRhdGUgb24gZXZlcnkgZGVwbG95bWVudCwgcGFzczpcbiAgICpcbiAgICogYGBgdHNcbiAgICogY29uc3QgbWFjaGluZUltYWdlID0gZWNzLkVjc09wdGltaXplZEltYWdlLmFtYXpvbkxpbnV4MihlY3MuQW1pSGFyZHdhcmVUeXBlLlNUQU5EQVJELCB7XG4gICAqICAgY2FjaGVkSW5Db250ZXh0OiB0cnVlLFxuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW0FtYXpvbiBFQ1Mtb3B0aW1pemVkXG4gICAqIEFNSXNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2Vjcy1vcHRpbWl6ZWRfQU1JLmh0bWwpLlxuICAgKlxuICAgKiBZb3UgbXVzdCBkZWZpbmUgZWl0aGVyIGBtYWNoaW5lSW1hZ2VgIG9yIGBtYWNoaW5lSW1hZ2VUeXBlYCwgbm90IGJvdGguXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQXV0b21hdGljYWxseSB1cGRhdGVkLCBFQ1Mtb3B0aW1pemVkIEFtYXpvbiBMaW51eCAyXG4gICAqL1xuICByZWFkb25seSBtYWNoaW5lSW1hZ2U/OiBlYzIuSU1hY2hpbmVJbWFnZTtcbn1cblxuLyoqXG4gKiBUaGUgb3B0aW9ucyBmb3IgY3JlYXRpbmcgYW4gQVdTIENsb3VkIE1hcCBuYW1lc3BhY2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xvdWRNYXBOYW1lc3BhY2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBuYW1lc3BhY2UsIHN1Y2ggYXMgZXhhbXBsZS5jb20uXG4gICAqL1xuICByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIENsb3VkTWFwIE5hbWVzcGFjZSB0byBjcmVhdGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IFByaXZhdGVEbnNcbiAgICovXG4gIHJlYWRvbmx5IHR5cGU/OiBjbG91ZG1hcC5OYW1lc3BhY2VUeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgVlBDIHRvIGFzc29jaWF0ZSB0aGUgbmFtZXNwYWNlIHdpdGguIFRoaXMgcHJvcGVydHkgaXMgcmVxdWlyZWQgZm9yIHByaXZhdGUgRE5TIG5hbWVzcGFjZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IFZQQyBvZiB0aGUgY2x1c3RlciBmb3IgUHJpdmF0ZSBETlMgTmFtZXNwYWNlLCBvdGhlcndpc2Ugbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgdnBjPzogZWMyLklWcGM7XG5cbiAgLyoqXG4gICAqIFRoaXMgcHJvcGVydHkgc3BlY2lmaWVzIHdoZXRoZXIgdG8gc2V0IHRoZSBwcm92aWRlZCBuYW1lc3BhY2UgYXMgdGhlIHNlcnZpY2UgY29ubmVjdCBkZWZhdWx0IGluIHRoZSBjbHVzdGVyIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSB1c2VGb3JTZXJ2aWNlQ29ubmVjdD86IGJvb2xlYW47XG5cbn1cblxuZW51bSBDb250YWluZXJJbnNpZ2h0cyB7XG4gIC8qKlxuICAgKiBFbmFibGUgQ2xvdWRXYXRjaCBDb250YWluZXIgSW5zaWdodHMgZm9yIHRoZSBjbHVzdGVyXG4gICAqL1xuXG4gIEVOQUJMRUQgPSAnZW5hYmxlZCcsXG5cbiAgLyoqXG4gICAqIERpc2FibGUgQ2xvdWRXYXRjaCBDb250YWluZXIgSW5zaWdodHMgZm9yIHRoZSBjbHVzdGVyXG4gICAqL1xuICBESVNBQkxFRCA9ICdkaXNhYmxlZCcsXG59XG5cbi8qKlxuICogQSBDYXBhY2l0eSBQcm92aWRlciBzdHJhdGVneSB0byB1c2UgZm9yIHRoZSBzZXJ2aWNlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneSB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgY2FwYWNpdHkgcHJvdmlkZXIuXG4gICAqL1xuICByZWFkb25seSBjYXBhY2l0eVByb3ZpZGVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIHZhbHVlIGRlc2lnbmF0ZXMgaG93IG1hbnkgdGFza3MsIGF0IGEgbWluaW11bSwgdG8gcnVuIG9uIHRoZSBzcGVjaWZpZWQgY2FwYWNpdHkgcHJvdmlkZXIuIE9ubHkgb25lXG4gICAqIGNhcGFjaXR5IHByb3ZpZGVyIGluIGEgY2FwYWNpdHkgcHJvdmlkZXIgc3RyYXRlZ3kgY2FuIGhhdmUgYSBiYXNlIGRlZmluZWQuIElmIG5vIHZhbHVlIGlzIHNwZWNpZmllZCwgdGhlIGRlZmF1bHRcbiAgICogdmFsdWUgb2YgMCBpcyB1c2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGJhc2U/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSB3ZWlnaHQgdmFsdWUgZGVzaWduYXRlcyB0aGUgcmVsYXRpdmUgcGVyY2VudGFnZSBvZiB0aGUgdG90YWwgbnVtYmVyIG9mIHRhc2tzIGxhdW5jaGVkIHRoYXQgc2hvdWxkIHVzZSB0aGVcbiAgICogc3BlY2lmaWVkXG5jYXBhY2l0eSBwcm92aWRlci4gVGhlIHdlaWdodCB2YWx1ZSBpcyB0YWtlbiBpbnRvIGNvbnNpZGVyYXRpb24gYWZ0ZXIgdGhlIGJhc2UgdmFsdWUsIGlmIGRlZmluZWQsIGlzIHNhdGlzZmllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSAwXG4gICAqL1xuICByZWFkb25seSB3ZWlnaHQ/OiBudW1iZXI7XG59XG5cbi8qKlxuICogVGhlIGRldGFpbHMgb2YgdGhlIGV4ZWN1dGUgY29tbWFuZCBjb25maWd1cmF0aW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlXG4gKiBbRXhlY3V0ZUNvbW1hbmRDb25maWd1cmF0aW9uXSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lY3MtY2x1c3Rlci1leGVjdXRlY29tbWFuZGNvbmZpZ3VyYXRpb24uaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV4ZWN1dGVDb21tYW5kQ29uZmlndXJhdGlvbiB7XG4gIC8qKlxuICAgKiBUaGUgQVdTIEtleSBNYW5hZ2VtZW50IFNlcnZpY2Uga2V5IElEIHRvIGVuY3J5cHQgdGhlIGRhdGEgYmV0d2VlbiB0aGUgbG9jYWwgY2xpZW50IGFuZCB0aGUgY29udGFpbmVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGttc0tleT86IGttcy5JS2V5LFxuXG4gIC8qKlxuICAgKiBUaGUgbG9nIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSByZXN1bHRzIG9mIHRoZSBleGVjdXRlIGNvbW1hbmQgYWN0aW9ucy4gVGhlIGxvZ3MgY2FuIGJlIHNlbnQgdG8gQ2xvdWRXYXRjaCBMb2dzIG9yIGFuIEFtYXpvbiBTMyBidWNrZXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgbG9nQ29uZmlndXJhdGlvbj86IEV4ZWN1dGVDb21tYW5kTG9nQ29uZmlndXJhdGlvbixcblxuICAvKipcbiAgICogVGhlIGxvZyBzZXR0aW5ncyB0byB1c2UgZm9yIGxvZ2dpbmcgdGhlIGV4ZWN1dGUgY29tbWFuZCBzZXNzaW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGxvZ2dpbmc/OiBFeGVjdXRlQ29tbWFuZExvZ2dpbmcsXG59XG5cbi8qKlxuICogVGhlIGxvZyBzZXR0aW5ncyB0byB1c2UgdG8gZm9yIGxvZ2dpbmcgdGhlIGV4ZWN1dGUgY29tbWFuZCBzZXNzaW9uLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlXG4gKiBbTG9nZ2luZ10gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWNzLWNsdXN0ZXItZXhlY3V0ZWNvbW1hbmRjb25maWd1cmF0aW9uLmh0bWwjY2ZuLWVjcy1jbHVzdGVyLWV4ZWN1dGVjb21tYW5kY29uZmlndXJhdGlvbi1sb2dnaW5nXG4gKi9cbmV4cG9ydCBlbnVtIEV4ZWN1dGVDb21tYW5kTG9nZ2luZyB7XG4gIC8qKlxuICAgKiBUaGUgZXhlY3V0ZSBjb21tYW5kIHNlc3Npb24gaXMgbm90IGxvZ2dlZC5cbiAgICovXG4gIE5PTkUgPSAnTk9ORScsXG5cbiAgLyoqXG4gICAqIFRoZSBhd3Nsb2dzIGNvbmZpZ3VyYXRpb24gaW4gdGhlIHRhc2sgZGVmaW5pdGlvbiBpcyB1c2VkLiBJZiBubyBsb2dnaW5nIHBhcmFtZXRlciBpcyBzcGVjaWZpZWQsIGl0IGRlZmF1bHRzIHRvIHRoaXMgdmFsdWUuIElmIG5vIGF3c2xvZ3MgbG9nIGRyaXZlciBpcyBjb25maWd1cmVkIGluIHRoZSB0YXNrIGRlZmluaXRpb24sIHRoZSBvdXRwdXQgd29uJ3QgYmUgbG9nZ2VkLlxuICAgKi9cbiAgREVGQVVMVCA9ICdERUZBVUxUJyxcblxuICAvKipcbiAgICogU3BlY2lmeSB0aGUgbG9nZ2luZyBkZXRhaWxzIGFzIGEgcGFydCBvZiBsb2dDb25maWd1cmF0aW9uLlxuICAgKi9cbiAgT1ZFUlJJREUgPSAnT1ZFUlJJREUnLFxufVxuXG4vKipcbiAqIFRoZSBsb2cgY29uZmlndXJhdGlvbiBmb3IgdGhlIHJlc3VsdHMgb2YgdGhlIGV4ZWN1dGUgY29tbWFuZCBhY3Rpb25zLiBUaGUgbG9ncyBjYW4gYmUgc2VudCB0byBDbG91ZFdhdGNoIExvZ3MgYW5kLyBvciBhbiBBbWF6b24gUzMgYnVja2V0LlxuICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBbRXhlY3V0ZUNvbW1hbmRMb2dDb25maWd1cmF0aW9uXSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lY3MtY2x1c3Rlci1leGVjdXRlY29tbWFuZGxvZ2NvbmZpZ3VyYXRpb24uaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV4ZWN1dGVDb21tYW5kTG9nQ29uZmlndXJhdGlvbiB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0byBlbmFibGUgZW5jcnlwdGlvbiBvbiB0aGUgQ2xvdWRXYXRjaCBsb2dzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGVuY3J5cHRpb24gd2lsbCBiZSBkaXNhYmxlZC5cbiAgICovXG4gIHJlYWRvbmx5IGNsb3VkV2F0Y2hFbmNyeXB0aW9uRW5hYmxlZD86IGJvb2xlYW4sXG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBDbG91ZFdhdGNoIGxvZyBncm91cCB0byBzZW5kIGxvZ3MgdG8uIFRoZSBDbG91ZFdhdGNoIGxvZyBncm91cCBtdXN0IGFscmVhZHkgYmUgY3JlYXRlZC5cbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBjbG91ZFdhdGNoTG9nR3JvdXA/OiBsb2dzLklMb2dHcm91cCxcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIFMzIGJ1Y2tldCB0byBzZW5kIGxvZ3MgdG8uIFRoZSBTMyBidWNrZXQgbXVzdCBhbHJlYWR5IGJlIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgczNCdWNrZXQ/OiBzMy5JQnVja2V0LFxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9yIG5vdCB0byBlbmFibGUgZW5jcnlwdGlvbiBvbiB0aGUgQ2xvdWRXYXRjaCBsb2dzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGVuY3J5cHRpb24gd2lsbCBiZSBkaXNhYmxlZC5cbiAgICovXG4gIHJlYWRvbmx5IHMzRW5jcnlwdGlvbkVuYWJsZWQ/OiBib29sZWFuLFxuXG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBmb2xkZXIgaW4gdGhlIFMzIGJ1Y2tldCB0byBwbGFjZSBsb2dzIGluLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHMzS2V5UHJlZml4Pzogc3RyaW5nXG59XG5cbi8qKlxuICogVGhlIG9wdGlvbnMgZm9yIGNyZWF0aW5nIGFuIEF1dG8gU2NhbGluZyBHcm91cCBDYXBhY2l0eSBQcm92aWRlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBc2dDYXBhY2l0eVByb3ZpZGVyUHJvcHMgZXh0ZW5kcyBBZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHlPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBjYXBhY2l0eSBwcm92aWRlci4gSWYgYSBuYW1lIGlzIHNwZWNpZmllZCxcbiAgICogaXQgY2Fubm90IHN0YXJ0IHdpdGggYGF3c2AsIGBlY3NgLCBvciBgZmFyZ2F0ZWAuIElmIG5vIG5hbWUgaXMgc3BlY2lmaWVkLFxuICAgKiBhIGRlZmF1bHQgbmFtZSBpbiB0aGUgQ0ZOU3RhY2tOYW1lLUNGTlJlc291cmNlTmFtZS1SYW5kb21TdHJpbmcgZm9ybWF0IGlzIHVzZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IENsb3VkRm9ybWF0aW9uLWdlbmVyYXRlZCBuYW1lXG4gICAqL1xuICByZWFkb25seSBjYXBhY2l0eVByb3ZpZGVyTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGF1dG9zY2FsaW5nIGdyb3VwIHRvIGFkZCBhcyBhIENhcGFjaXR5IFByb3ZpZGVyLlxuICAgKi9cbiAgcmVhZG9ubHkgYXV0b1NjYWxpbmdHcm91cDogYXV0b3NjYWxpbmcuSUF1dG9TY2FsaW5nR3JvdXA7XG5cbiAgLyoqXG4gICAqIFdoZW4gZW5hYmxlZCB0aGUgc2NhbGUtaW4gYW5kIHNjYWxlLW91dCBhY3Rpb25zIG9mIHRoZSBjbHVzdGVyJ3MgQXV0byBTY2FsaW5nIEdyb3VwIHdpbGwgYmUgbWFuYWdlZCBmb3IgeW91LlxuICAgKiBUaGlzIG1lYW5zIHlvdXIgY2x1c3RlciB3aWxsIGF1dG9tYXRpY2FsbHkgc2NhbGUgaW5zdGFuY2VzIGJhc2VkIG9uIHRoZSBsb2FkIHlvdXIgdGFza3MgcHV0IG9uIHRoZSBjbHVzdGVyLlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtVc2luZyBNYW5hZ2VkIFNjYWxpbmddKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2FzZy1jYXBhY2l0eS1wcm92aWRlcnMuaHRtbCNhc2ctY2FwYWNpdHktcHJvdmlkZXJzLW1hbmFnZWQtc2NhbGluZykgaW4gdGhlIEVDUyBEZXZlbG9wZXIgR3VpZGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZU1hbmFnZWRTY2FsaW5nPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hlbiBlbmFibGVkIHRoZSBBdXRvIFNjYWxpbmcgR3JvdXAgd2lsbCBvbmx5IHRlcm1pbmF0ZSBFQzIgaW5zdGFuY2VzIHRoYXQgbm8gbG9uZ2VyIGhhdmUgcnVubmluZyBub24tZGFlbW9uXG4gICAqIHRhc2tzLlxuICAgKlxuICAgKiBTY2FsZS1pbiBwcm90ZWN0aW9uIHdpbGwgYmUgYXV0b21hdGljYWxseSBlbmFibGVkIG9uIGluc3RhbmNlcy4gV2hlbiBhbGwgbm9uLWRhZW1vbiB0YXNrcyBhcmVcbiAgICogc3RvcHBlZCBvbiBhbiBpbnN0YW5jZSwgRUNTIGluaXRpYXRlcyB0aGUgc2NhbGUtaW4gcHJvY2VzcyBhbmQgdHVybnMgb2ZmIHNjYWxlLWluIHByb3RlY3Rpb24gZm9yIHRoZVxuICAgKiBpbnN0YW5jZS4gVGhlIEF1dG8gU2NhbGluZyBHcm91cCBjYW4gdGhlbiB0ZXJtaW5hdGUgdGhlIGluc3RhbmNlLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgW01hbmFnZWQgdGVybWluYXRpb25cbiAgICogIHByb3RlY3Rpb25dKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NsdXN0ZXItYXV0by1zY2FsaW5nLmh0bWwjbWFuYWdlZC10ZXJtaW5hdGlvbi1wcm90ZWN0aW9uKVxuICAgKiBpbiB0aGUgRUNTIERldmVsb3BlciBHdWlkZS5cbiAgICpcbiAgICogTWFuYWdlZCBzY2FsaW5nIG11c3QgYWxzbyBiZSBlbmFibGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBlbmFibGVNYW5hZ2VkVGVybWluYXRpb25Qcm90ZWN0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogTWF4aW11bSBzY2FsaW5nIHN0ZXAgc2l6ZS4gSW4gbW9zdCBjYXNlcyB0aGlzIHNob3VsZCBiZSBsZWZ0IGFsb25lLlxuICAgKlxuICAgKiBAZGVmYXVsdCAxMDAwXG4gICAqL1xuICByZWFkb25seSBtYXhpbXVtU2NhbGluZ1N0ZXBTaXplPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBNaW5pbXVtIHNjYWxpbmcgc3RlcCBzaXplLiBJbiBtb3N0IGNhc2VzIHRoaXMgc2hvdWxkIGJlIGxlZnQgYWxvbmUuXG4gICAqXG4gICAqIEBkZWZhdWx0IDFcbiAgICovXG4gIHJlYWRvbmx5IG1pbmltdW1TY2FsaW5nU3RlcFNpemU/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRhcmdldCBjYXBhY2l0eSBwZXJjZW50LiBJbiBtb3N0IGNhc2VzIHRoaXMgc2hvdWxkIGJlIGxlZnQgYWxvbmUuXG4gICAqXG4gICAqIEBkZWZhdWx0IDEwMFxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0Q2FwYWNpdHlQZXJjZW50PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIEFuIEF1dG8gU2NhbGluZyBHcm91cCBDYXBhY2l0eSBQcm92aWRlci4gVGhpcyBhbGxvd3MgYW4gRUNTIGNsdXN0ZXIgdG8gdGFyZ2V0XG4gKiBhIHNwZWNpZmljIEVDMiBBdXRvIFNjYWxpbmcgR3JvdXAgZm9yIHRoZSBwbGFjZW1lbnQgb2YgdGFza3MuIE9wdGlvbmFsbHkgKGFuZFxuICogcmVjb21tZW5kZWQpLCBFQ1MgY2FuIG1hbmFnZSB0aGUgbnVtYmVyIG9mIGluc3RhbmNlcyBpbiB0aGUgQVNHIHRvIGZpdCB0aGVcbiAqIHRhc2tzLCBhbmQgY2FuIGVuc3VyZSB0aGF0IGluc3RhbmNlcyBhcmUgbm90IHByZW1hdHVyZWx5IHRlcm1pbmF0ZWQgd2hpbGVcbiAqIHRoZXJlIGFyZSBzdGlsbCB0YXNrcyBydW5uaW5nIG9uIHRoZW0uXG4gKi9cbmV4cG9ydCBjbGFzcyBBc2dDYXBhY2l0eVByb3ZpZGVyIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgLyoqXG4gICAqIENhcGFjaXR5IHByb3ZpZGVyIG5hbWVcbiAgICogQGRlZmF1bHQgQ2hvc2VuIGJ5IENsb3VkRm9ybWF0aW9uXG4gICAqL1xuICByZWFkb25seSBjYXBhY2l0eVByb3ZpZGVyTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBdXRvIFNjYWxpbmcgR3JvdXBcbiAgICovXG4gIHJlYWRvbmx5IGF1dG9TY2FsaW5nR3JvdXA6IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXA7XG5cbiAgLyoqXG4gICAqIEF1dG8gU2NhbGluZyBHcm91cCBtYWNoaW5lSW1hZ2VUeXBlLlxuICAgKi9cbiAgcmVhZG9ubHkgbWFjaGluZUltYWdlVHlwZTogTWFjaGluZUltYWdlVHlwZTtcblxuICAvKipcbiAgICogV2hldGhlciBtYW5hZ2VkIHRlcm1pbmF0aW9uIHByb3RlY3Rpb24gaXMgZW5hYmxlZC5cbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZU1hbmFnZWRUZXJtaW5hdGlvblByb3RlY3Rpb24/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciB0aGUgY29udGFpbmVycyBjYW4gYWNjZXNzIHRoZSBjb250YWluZXIgaW5zdGFuY2Ugcm9sZS5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGNhbkNvbnRhaW5lcnNBY2Nlc3NJbnN0YW5jZVJvbGU/OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBBc2dDYXBhY2l0eVByb3ZpZGVyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIHRoaXMuYXV0b1NjYWxpbmdHcm91cCA9IHByb3BzLmF1dG9TY2FsaW5nR3JvdXAgYXMgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cDtcbiAgICB0aGlzLm1hY2hpbmVJbWFnZVR5cGUgPSBwcm9wcy5tYWNoaW5lSW1hZ2VUeXBlID8/IE1hY2hpbmVJbWFnZVR5cGUuQU1BWk9OX0xJTlVYXzI7XG4gICAgdGhpcy5jYW5Db250YWluZXJzQWNjZXNzSW5zdGFuY2VSb2xlID0gcHJvcHMuY2FuQ29udGFpbmVyc0FjY2Vzc0luc3RhbmNlUm9sZTtcbiAgICB0aGlzLmVuYWJsZU1hbmFnZWRUZXJtaW5hdGlvblByb3RlY3Rpb24gPSBwcm9wcy5lbmFibGVNYW5hZ2VkVGVybWluYXRpb25Qcm90ZWN0aW9uID8/IHRydWU7XG5cbiAgICBpZiAodGhpcy5lbmFibGVNYW5hZ2VkVGVybWluYXRpb25Qcm90ZWN0aW9uICYmIHByb3BzLmVuYWJsZU1hbmFnZWRTY2FsaW5nID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZW5hYmxlIE1hbmFnZWQgVGVybWluYXRpb24gUHJvdGVjdGlvbiBvbiBhIENhcGFjaXR5IFByb3ZpZGVyIHdoZW4gTWFuYWdlZCBTY2FsaW5nIGlzIGRpc2FibGVkLiBFaXRoZXIgZW5hYmxlIE1hbmFnZWQgU2NhbGluZyBvciBkaXNhYmxlIE1hbmFnZWQgVGVybWluYXRpb24gUHJvdGVjdGlvbi4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZW5hYmxlTWFuYWdlZFRlcm1pbmF0aW9uUHJvdGVjdGlvbikge1xuICAgICAgdGhpcy5hdXRvU2NhbGluZ0dyb3VwLnByb3RlY3ROZXdJbnN0YW5jZXNGcm9tU2NhbGVJbigpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5jYXBhY2l0eVByb3ZpZGVyTmFtZSkge1xuICAgICAgaWYgKCEoL14oPyFhd3N8ZWNzfGZhcmdhdGUpLisvZ20udGVzdChwcm9wcy5jYXBhY2l0eVByb3ZpZGVyTmFtZSkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBDYXBhY2l0eSBQcm92aWRlciBOYW1lOiAke3Byb3BzLmNhcGFjaXR5UHJvdmlkZXJOYW1lfSwgSWYgYSBuYW1lIGlzIHNwZWNpZmllZCwgaXQgY2Fubm90IHN0YXJ0IHdpdGggYXdzLCBlY3MsIG9yIGZhcmdhdGUuYCk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGNhcGFjaXR5UHJvdmlkZXIgPSBuZXcgQ2ZuQ2FwYWNpdHlQcm92aWRlcih0aGlzLCBpZCwge1xuICAgICAgbmFtZTogcHJvcHMuY2FwYWNpdHlQcm92aWRlck5hbWUsXG4gICAgICBhdXRvU2NhbGluZ0dyb3VwUHJvdmlkZXI6IHtcbiAgICAgICAgYXV0b1NjYWxpbmdHcm91cEFybjogdGhpcy5hdXRvU2NhbGluZ0dyb3VwLmF1dG9TY2FsaW5nR3JvdXBOYW1lLFxuICAgICAgICBtYW5hZ2VkU2NhbGluZzogcHJvcHMuZW5hYmxlTWFuYWdlZFNjYWxpbmcgPT09IGZhbHNlID8gdW5kZWZpbmVkIDoge1xuICAgICAgICAgIHN0YXR1czogJ0VOQUJMRUQnLFxuICAgICAgICAgIHRhcmdldENhcGFjaXR5OiBwcm9wcy50YXJnZXRDYXBhY2l0eVBlcmNlbnQgfHwgMTAwLFxuICAgICAgICAgIG1heGltdW1TY2FsaW5nU3RlcFNpemU6IHByb3BzLm1heGltdW1TY2FsaW5nU3RlcFNpemUsXG4gICAgICAgICAgbWluaW11bVNjYWxpbmdTdGVwU2l6ZTogcHJvcHMubWluaW11bVNjYWxpbmdTdGVwU2l6ZSxcbiAgICAgICAgfSxcbiAgICAgICAgbWFuYWdlZFRlcm1pbmF0aW9uUHJvdGVjdGlvbjogdGhpcy5lbmFibGVNYW5hZ2VkVGVybWluYXRpb25Qcm90ZWN0aW9uID8gJ0VOQUJMRUQnIDogJ0RJU0FCTEVEJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmNhcGFjaXR5UHJvdmlkZXJOYW1lID0gY2FwYWNpdHlQcm92aWRlci5yZWY7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHZpc2l0b3IgdGhhdCBhZGRzIGEgY2FwYWNpdHkgcHJvdmlkZXIgYXNzb2NpYXRpb24gdG8gYSBDbHVzdGVyIG9ubHkgaWZcbiAqIHRoZSBjYWxsZXIgY3JlYXRlZCBhbnkgRUMyIENhcGFjaXR5IFByb3ZpZGVycy5cbiAqL1xuY2xhc3MgTWF5YmVDcmVhdGVDYXBhY2l0eVByb3ZpZGVyQXNzb2NpYXRpb25zIGltcGxlbWVudHMgSUFzcGVjdCB7XG4gIHByaXZhdGUgc2NvcGU6IENsdXN0ZXI7XG4gIHByaXZhdGUgaWQ6IHN0cmluZztcbiAgcHJpdmF0ZSByZXNvdXJjZT86IENmbkNsdXN0ZXJDYXBhY2l0eVByb3ZpZGVyQXNzb2NpYXRpb25zO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDbHVzdGVyLCBpZDogc3RyaW5nKSB7XG4gICAgdGhpcy5zY29wZSA9IHNjb3BlO1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgfVxuXG4gIHB1YmxpYyB2aXNpdChub2RlOiBJQ29uc3RydWN0KTogdm9pZCB7XG4gICAgaWYgKENsdXN0ZXIuaXNDbHVzdGVyKG5vZGUpKSB7XG4gICAgICBpZiAoKHRoaXMuc2NvcGUuZGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneS5sZW5ndGggPiAwIHx8IHRoaXMuc2NvcGUuY2FwYWNpdHlQcm92aWRlck5hbWVzLmxlbmd0aCA+IDAgJiYgIXRoaXMucmVzb3VyY2UpKSB7XG4gICAgICAgIHRoaXMucmVzb3VyY2UgPSBuZXcgQ2ZuQ2x1c3RlckNhcGFjaXR5UHJvdmlkZXJBc3NvY2lhdGlvbnModGhpcy5zY29wZSwgdGhpcy5pZCwge1xuICAgICAgICAgIGNsdXN0ZXI6IG5vZGUuY2x1c3Rlck5hbWUsXG4gICAgICAgICAgZGVmYXVsdENhcGFjaXR5UHJvdmlkZXJTdHJhdGVneTogdGhpcy5zY29wZS5kZWZhdWx0Q2FwYWNpdHlQcm92aWRlclN0cmF0ZWd5LFxuICAgICAgICAgIGNhcGFjaXR5UHJvdmlkZXJzOiB0aGlzLnNjb3BlLmNhcGFjaXR5UHJvdmlkZXJOYW1lcyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblxuZnVuY3Rpb24gaXNCb3R0bGVSb2NrZXRJbWFnZShpbWFnZTogZWMyLklNYWNoaW5lSW1hZ2UpIHtcbiAgcmV0dXJuIGltYWdlIGluc3RhbmNlb2YgQm90dGxlUm9ja2V0SW1hZ2U7XG59XG4iXX0=