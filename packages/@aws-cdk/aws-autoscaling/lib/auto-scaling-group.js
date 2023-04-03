"use strict";
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheck = exports.ScalingProcess = exports.ScalingEvents = exports.ScalingEvent = exports.UpdateType = exports.AutoScalingGroup = exports.GroupMetric = exports.GroupMetrics = exports.UpdatePolicy = exports.Signals = exports.SpotAllocationStrategy = exports.OnDemandAllocationStrategy = exports.Monitoring = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const ec2 = require("@aws-cdk/aws-ec2");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const aspects_1 = require("./aspects");
const autoscaling_generated_1 = require("./autoscaling.generated");
const lifecycle_hook_1 = require("./lifecycle-hook");
const scheduled_action_1 = require("./scheduled-action");
const step_scaling_policy_1 = require("./step-scaling-policy");
const target_tracking_scaling_policy_1 = require("./target-tracking-scaling-policy");
const volume_1 = require("./volume");
const warm_pool_1 = require("./warm-pool");
/**
 * Name tag constant
 */
const NAME_TAG = 'Name';
/**
 * The monitoring mode for instances launched in an autoscaling group
 */
var Monitoring;
(function (Monitoring) {
    /**
     * Generates metrics every 5 minutes
     */
    Monitoring[Monitoring["BASIC"] = 0] = "BASIC";
    /**
     * Generates metrics every minute
     */
    Monitoring[Monitoring["DETAILED"] = 1] = "DETAILED";
})(Monitoring = exports.Monitoring || (exports.Monitoring = {}));
/**
 * Indicates how to allocate instance types to fulfill On-Demand capacity.
 */
var OnDemandAllocationStrategy;
(function (OnDemandAllocationStrategy) {
    /**
     * This strategy uses the order of instance types in the LaunchTemplateOverrides to define the launch
     * priority of each instance type. The first instance type in the array is prioritized higher than the
     * last. If all your On-Demand capacity cannot be fulfilled using your highest priority instance, then
     * the Auto Scaling group launches the remaining capacity using the second priority instance type, and
     * so on.
     */
    OnDemandAllocationStrategy["PRIORITIZED"] = "prioritized";
})(OnDemandAllocationStrategy = exports.OnDemandAllocationStrategy || (exports.OnDemandAllocationStrategy = {}));
/**
 * Indicates how to allocate instance types to fulfill Spot capacity.
 */
var SpotAllocationStrategy;
(function (SpotAllocationStrategy) {
    /**
     * The Auto Scaling group launches instances using the Spot pools with the lowest price, and evenly
     * allocates your instances across the number of Spot pools that you specify.
     */
    SpotAllocationStrategy["LOWEST_PRICE"] = "lowest-price";
    /**
     * The Auto Scaling group launches instances using Spot pools that are optimally chosen based on the
     * available Spot capacity.
     *
     * Recommended.
     */
    SpotAllocationStrategy["CAPACITY_OPTIMIZED"] = "capacity-optimized";
    /**
     * When you use this strategy, you need to set the order of instance types in the list of launch template
     * overrides from highest to lowest priority (from first to last in the list). Amazon EC2 Auto Scaling
     * honors the instance type priorities on a best-effort basis but optimizes for capacity first.
     */
    SpotAllocationStrategy["CAPACITY_OPTIMIZED_PRIORITIZED"] = "capacity-optimized-prioritized";
    /**
     * The price and capacity optimized allocation strategy looks at both price and
     * capacity to select the Spot Instance pools that are the least likely to be
     * interrupted and have the lowest possible price.
     */
    SpotAllocationStrategy["PRICE_CAPACITY_OPTIMIZED"] = "price-capacity-optimized";
})(SpotAllocationStrategy = exports.SpotAllocationStrategy || (exports.SpotAllocationStrategy = {}));
/**
 * Configure whether the AutoScalingGroup waits for signals
 *
 * If you do configure waiting for signals, you should make sure the instances
 * invoke `cfn-signal` somewhere in their UserData to signal that they have
 * started up (either successfully or unsuccessfully).
 *
 * Signals are used both during intial creation and subsequent updates.
 */
class Signals {
    /**
     * Wait for the desiredCapacity of the AutoScalingGroup amount of signals to have been received
     *
     * If no desiredCapacity has been configured, wait for minCapacity signals intead.
     *
     * This number is used during initial creation and during replacing updates.
     * During rolling updates, all updated instances must send a signal.
     */
    static waitForAll(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_SignalsOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.waitForAll);
            }
            throw error;
        }
        validatePercentage(options.minSuccessPercentage);
        return new class extends Signals {
            renderCreationPolicy(renderOptions) {
                return this.doRender(options, renderOptions.desiredCapacity ?? renderOptions.minCapacity);
            }
        }();
    }
    /**
     * Wait for the minCapacity of the AutoScalingGroup amount of signals to have been received
     *
     * This number is used during initial creation and during replacing updates.
     * During rolling updates, all updated instances must send a signal.
     */
    static waitForMinCapacity(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_SignalsOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.waitForMinCapacity);
            }
            throw error;
        }
        validatePercentage(options.minSuccessPercentage);
        return new class extends Signals {
            renderCreationPolicy(renderOptions) {
                return this.doRender(options, renderOptions.minCapacity);
            }
        }();
    }
    /**
     * Wait for a specific amount of signals to have been received
     *
     * You should send one signal per instance, so this represents the number of
     * instances to wait for.
     *
     * This number is used during initial creation and during replacing updates.
     * During rolling updates, all updated instances must send a signal.
     */
    static waitForCount(count, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_SignalsOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.waitForCount);
            }
            throw error;
        }
        validatePercentage(options.minSuccessPercentage);
        return new class extends Signals {
            renderCreationPolicy() {
                return this.doRender(options, count);
            }
        }();
    }
    /**
     * Helper to render the actual creation policy, as the logic between them is quite similar
     */
    doRender(options, count) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_SignalsOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.doRender);
            }
            throw error;
        }
        const minSuccessfulInstancesPercent = validatePercentage(options.minSuccessPercentage);
        return {
            ...options.minSuccessPercentage !== undefined ? { autoScalingCreationPolicy: { minSuccessfulInstancesPercent } } : {},
            resourceSignal: {
                count,
                timeout: options.timeout?.toIsoString(),
            },
        };
    }
}
exports.Signals = Signals;
_a = JSII_RTTI_SYMBOL_1;
Signals[_a] = { fqn: "@aws-cdk/aws-autoscaling.Signals", version: "0.0.0" };
/**
 * How existing instances should be updated
 */
class UpdatePolicy {
    /**
     * Create a new AutoScalingGroup and switch over to it
     */
    static replacingUpdate() {
        return new class extends UpdatePolicy {
            _renderUpdatePolicy() {
                return {
                    autoScalingReplacingUpdate: { willReplace: true },
                };
            }
        }();
    }
    /**
     * Replace the instances in the AutoScalingGroup one by one, or in batches
     */
    static rollingUpdate(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_RollingUpdateOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.rollingUpdate);
            }
            throw error;
        }
        const minSuccessPercentage = validatePercentage(options.minSuccessPercentage);
        return new class extends UpdatePolicy {
            _renderUpdatePolicy(renderOptions) {
                return {
                    autoScalingRollingUpdate: {
                        maxBatchSize: options.maxBatchSize,
                        minInstancesInService: options.minInstancesInService,
                        suspendProcesses: options.suspendProcesses ?? DEFAULT_SUSPEND_PROCESSES,
                        minSuccessfulInstancesPercent: minSuccessPercentage ?? renderOptions.creationPolicy?.autoScalingCreationPolicy?.minSuccessfulInstancesPercent,
                        waitOnResourceSignals: options.waitOnResourceSignals ?? renderOptions.creationPolicy?.resourceSignal !== undefined ? true : undefined,
                        pauseTime: options.pauseTime?.toIsoString() ?? renderOptions.creationPolicy?.resourceSignal?.timeout,
                    },
                };
            }
        }();
    }
}
exports.UpdatePolicy = UpdatePolicy;
_b = JSII_RTTI_SYMBOL_1;
UpdatePolicy[_b] = { fqn: "@aws-cdk/aws-autoscaling.UpdatePolicy", version: "0.0.0" };
/**
 * A set of group metrics
 */
class GroupMetrics {
    constructor(...metrics) {
        /**
         * @internal
         */
        this._metrics = new Set();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_GroupMetric(metrics);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, GroupMetrics);
            }
            throw error;
        }
        metrics?.forEach(metric => this._metrics.add(metric));
    }
    /**
     * Report all group metrics.
     */
    static all() {
        return new GroupMetrics();
    }
}
exports.GroupMetrics = GroupMetrics;
_c = JSII_RTTI_SYMBOL_1;
GroupMetrics[_c] = { fqn: "@aws-cdk/aws-autoscaling.GroupMetrics", version: "0.0.0" };
/**
 * Group metrics that an Auto Scaling group sends to Amazon CloudWatch.
 */
class GroupMetric {
    constructor(name) {
        this.name = name;
    }
}
exports.GroupMetric = GroupMetric;
_d = JSII_RTTI_SYMBOL_1;
GroupMetric[_d] = { fqn: "@aws-cdk/aws-autoscaling.GroupMetric", version: "0.0.0" };
/**
 * The minimum size of the Auto Scaling group
 */
GroupMetric.MIN_SIZE = new GroupMetric('GroupMinSize');
/**
 * The maximum size of the Auto Scaling group
 */
GroupMetric.MAX_SIZE = new GroupMetric('GroupMaxSize');
/**
 * The number of instances that the Auto Scaling group attempts to maintain
 */
GroupMetric.DESIRED_CAPACITY = new GroupMetric('GroupDesiredCapacity');
/**
 * The number of instances that are running as part of the Auto Scaling group
 * This metric does not include instances that are pending or terminating
 */
GroupMetric.IN_SERVICE_INSTANCES = new GroupMetric('GroupInServiceInstances');
/**
 * The number of instances that are pending
 * A pending instance is not yet in service, this metric does not include instances that are in service or terminating
 */
GroupMetric.PENDING_INSTANCES = new GroupMetric('GroupPendingInstances');
/**
 * The number of instances that are in a Standby state
 * Instances in this state are still running but are not actively in service
 */
GroupMetric.STANDBY_INSTANCES = new GroupMetric('GroupStandbyInstances');
/**
 * The number of instances that are in the process of terminating
 * This metric does not include instances that are in service or pending
 */
GroupMetric.TERMINATING_INSTANCES = new GroupMetric('GroupTerminatingInstances');
/**
 * The total number of instances in the Auto Scaling group
 * This metric identifies the number of instances that are in service, pending, and terminating
 */
GroupMetric.TOTAL_INSTANCES = new GroupMetric('GroupTotalInstances');
class AutoScalingGroupBase extends core_1.Resource {
    constructor() {
        super(...arguments);
        this.grantPrincipal = new iam.UnknownPrincipal({ resource: this });
        this.hasCalledScaleOnRequestCount = false;
    }
    /**
     * Send a message to either an SQS queue or SNS topic when instances launch or terminate
     */
    addLifecycleHook(id, props) {
        return new lifecycle_hook_1.LifecycleHook(this, `LifecycleHook${id}`, {
            autoScalingGroup: this,
            ...props,
        });
    }
    /**
     * Add a pool of pre-initialized EC2 instances that sits alongside an Auto Scaling group
     */
    addWarmPool(options) {
        return new warm_pool_1.WarmPool(this, 'WarmPool', {
            autoScalingGroup: this,
            ...options,
        });
    }
    /**
     * Scale out or in based on time
     */
    scaleOnSchedule(id, props) {
        return new scheduled_action_1.ScheduledAction(this, `ScheduledAction${id}`, {
            autoScalingGroup: this,
            ...props,
        });
    }
    /**
     * Scale out or in to achieve a target CPU utilization
     */
    scaleOnCpuUtilization(id, props) {
        return new target_tracking_scaling_policy_1.TargetTrackingScalingPolicy(this, `ScalingPolicy${id}`, {
            autoScalingGroup: this,
            predefinedMetric: target_tracking_scaling_policy_1.PredefinedMetric.ASG_AVERAGE_CPU_UTILIZATION,
            targetValue: props.targetUtilizationPercent,
            ...props,
        });
    }
    /**
     * Scale out or in to achieve a target network ingress rate
     */
    scaleOnIncomingBytes(id, props) {
        return new target_tracking_scaling_policy_1.TargetTrackingScalingPolicy(this, `ScalingPolicy${id}`, {
            autoScalingGroup: this,
            predefinedMetric: target_tracking_scaling_policy_1.PredefinedMetric.ASG_AVERAGE_NETWORK_IN,
            targetValue: props.targetBytesPerSecond,
            ...props,
        });
    }
    /**
     * Scale out or in to achieve a target network egress rate
     */
    scaleOnOutgoingBytes(id, props) {
        return new target_tracking_scaling_policy_1.TargetTrackingScalingPolicy(this, `ScalingPolicy${id}`, {
            autoScalingGroup: this,
            predefinedMetric: target_tracking_scaling_policy_1.PredefinedMetric.ASG_AVERAGE_NETWORK_OUT,
            targetValue: props.targetBytesPerSecond,
            ...props,
        });
    }
    /**
     * Scale out or in to achieve a target request handling rate
     *
     * The AutoScalingGroup must have been attached to an Application Load Balancer
     * in order to be able to call this.
     */
    scaleOnRequestCount(id, props) {
        if (this.albTargetGroup === undefined) {
            throw new Error('Attach the AutoScalingGroup to a non-imported Application Load Balancer before calling scaleOnRequestCount()');
        }
        const resourceLabel = `${this.albTargetGroup.firstLoadBalancerFullName}/${this.albTargetGroup.targetGroupFullName}`;
        if ((props.targetRequestsPerMinute === undefined) === (props.targetRequestsPerSecond === undefined)) {
            throw new Error('Specify exactly one of \'targetRequestsPerMinute\' or \'targetRequestsPerSecond\'');
        }
        let rpm;
        if (props.targetRequestsPerSecond !== undefined) {
            if (core_1.Token.isUnresolved(props.targetRequestsPerSecond)) {
                throw new Error('\'targetRequestsPerSecond\' cannot be an unresolved value; use \'targetRequestsPerMinute\' instead.');
            }
            rpm = props.targetRequestsPerSecond * 60;
        }
        else {
            rpm = props.targetRequestsPerMinute;
        }
        const policy = new target_tracking_scaling_policy_1.TargetTrackingScalingPolicy(this, `ScalingPolicy${id}`, {
            autoScalingGroup: this,
            predefinedMetric: target_tracking_scaling_policy_1.PredefinedMetric.ALB_REQUEST_COUNT_PER_TARGET,
            targetValue: rpm,
            resourceLabel,
            ...props,
        });
        policy.node.addDependency(this.albTargetGroup.loadBalancerAttached);
        this.hasCalledScaleOnRequestCount = true;
        return policy;
    }
    /**
     * Scale out or in in order to keep a metric around a target value
     */
    scaleToTrackMetric(id, props) {
        return new target_tracking_scaling_policy_1.TargetTrackingScalingPolicy(this, `ScalingPolicy${id}`, {
            autoScalingGroup: this,
            customMetric: props.metric,
            ...props,
        });
    }
    /**
     * Scale out or in, in response to a metric
     */
    scaleOnMetric(id, props) {
        return new step_scaling_policy_1.StepScalingPolicy(this, id, { ...props, autoScalingGroup: this });
    }
    addUserData(..._commands) {
    }
}
/**
 * A Fleet represents a managed set of EC2 instances
 *
 * The Fleet models a number of AutoScalingGroups, a launch configuration, a
 * security group and an instance role.
 *
 * It allows adding arbitrary commands to the startup scripts of the instances
 * in the fleet.
 *
 * The ASG spans the availability zones specified by vpcSubnets, falling back to
 * the Vpc default strategy if not specified.
 */
class AutoScalingGroup extends AutoScalingGroupBase {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.autoScalingGroupName,
        });
        this.loadBalancerNames = [];
        this.targetGroupArns = [];
        this.groupMetrics = [];
        this.notifications = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_AutoScalingGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AutoScalingGroup);
            }
            throw error;
        }
        this.newInstancesProtectedFromScaleIn = props.newInstancesProtectedFromScaleIn;
        if (props.initOptions && !props.init) {
            throw new Error('Setting \'initOptions\' requires that \'init\' is also set');
        }
        if (props.groupMetrics) {
            this.groupMetrics.push(...props.groupMetrics);
        }
        let launchConfig = undefined;
        if (props.launchTemplate || props.mixedInstancesPolicy) {
            this.verifyNoLaunchConfigPropIsGiven(props);
            const bareLaunchTemplate = props.launchTemplate;
            const mixedInstancesPolicy = props.mixedInstancesPolicy;
            if (bareLaunchTemplate && mixedInstancesPolicy) {
                throw new Error('Setting \'mixedInstancesPolicy\' must not be set when \'launchTemplate\' is set');
            }
            if (bareLaunchTemplate && bareLaunchTemplate instanceof ec2.LaunchTemplate) {
                if (!bareLaunchTemplate.instanceType) {
                    throw new Error('Setting \'launchTemplate\' requires its \'instanceType\' to be set');
                }
                if (!bareLaunchTemplate.imageId) {
                    throw new Error('Setting \'launchTemplate\' requires its \'machineImage\' to be set');
                }
                this.launchTemplate = bareLaunchTemplate;
            }
            if (mixedInstancesPolicy && mixedInstancesPolicy.launchTemplate instanceof ec2.LaunchTemplate) {
                if (!mixedInstancesPolicy.launchTemplate.imageId) {
                    throw new Error('Setting \'mixedInstancesPolicy.launchTemplate\' requires its \'machineImage\' to be set');
                }
                this.launchTemplate = mixedInstancesPolicy.launchTemplate;
            }
            this._role = this.launchTemplate?.role;
            this.grantPrincipal = this._role || new iam.UnknownPrincipal({ resource: this });
            this.osType = this.launchTemplate?.osType ?? ec2.OperatingSystemType.UNKNOWN;
        }
        else {
            if (!props.machineImage) {
                throw new Error('Setting \'machineImage\' is required when \'launchTemplate\' and \'mixedInstancesPolicy\' is not set');
            }
            if (!props.instanceType) {
                throw new Error('Setting \'instanceType\' is required when \'launchTemplate\' and \'mixedInstancesPolicy\' is not set');
            }
            this.securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'InstanceSecurityGroup', {
                vpc: props.vpc,
                allowAllOutbound: props.allowAllOutbound !== false,
            });
            this._connections = new ec2.Connections({ securityGroups: [this.securityGroup] });
            this.securityGroups = [this.securityGroup];
            core_1.Tags.of(this).add(NAME_TAG, this.node.path);
            this._role = props.role || new iam.Role(this, 'InstanceRole', {
                roleName: core_1.PhysicalName.GENERATE_IF_NEEDED,
                assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            });
            this.grantPrincipal = this._role;
            const iamProfile = new iam.CfnInstanceProfile(this, 'InstanceProfile', {
                roles: [this.role.roleName],
            });
            // use delayed evaluation
            const imageConfig = props.machineImage.getImage(this);
            this._userData = props.userData ?? imageConfig.userData;
            const userDataToken = core_1.Lazy.string({ produce: () => core_1.Fn.base64(this.userData.render()) });
            const securityGroupsToken = core_1.Lazy.list({ produce: () => this.securityGroups.map(sg => sg.securityGroupId) });
            launchConfig = new autoscaling_generated_1.CfnLaunchConfiguration(this, 'LaunchConfig', {
                imageId: imageConfig.imageId,
                keyName: props.keyName,
                instanceType: props.instanceType.toString(),
                instanceMonitoring: (props.instanceMonitoring !== undefined ? (props.instanceMonitoring === Monitoring.DETAILED) : undefined),
                securityGroups: securityGroupsToken,
                iamInstanceProfile: iamProfile.ref,
                userData: userDataToken,
                associatePublicIpAddress: props.associatePublicIpAddress,
                spotPrice: props.spotPrice,
                blockDeviceMappings: (props.blockDevices !== undefined ?
                    synthesizeBlockDeviceMappings(this, props.blockDevices) : undefined),
            });
            launchConfig.node.addDependency(this.role);
            this.osType = imageConfig.osType;
        }
        // desiredCapacity just reflects what the user has supplied.
        const desiredCapacity = props.desiredCapacity;
        const minCapacity = props.minCapacity ?? 1;
        const maxCapacity = props.maxCapacity ?? desiredCapacity ?? Math.max(minCapacity, 1);
        core_1.withResolved(minCapacity, maxCapacity, (min, max) => {
            if (min > max) {
                throw new Error(`minCapacity (${min}) should be <= maxCapacity (${max})`);
            }
        });
        core_1.withResolved(desiredCapacity, minCapacity, (desired, min) => {
            if (desired === undefined) {
                return;
            }
            if (desired < min) {
                throw new Error(`Should have minCapacity (${min}) <= desiredCapacity (${desired})`);
            }
        });
        core_1.withResolved(desiredCapacity, maxCapacity, (desired, max) => {
            if (desired === undefined) {
                return;
            }
            if (max < desired) {
                throw new Error(`Should have desiredCapacity (${desired}) <= maxCapacity (${max})`);
            }
        });
        if (desiredCapacity !== undefined) {
            core_1.Annotations.of(this).addWarning('desiredCapacity has been configured. Be aware this will reset the size of your AutoScalingGroup on every deployment. See https://github.com/aws/aws-cdk/issues/5215');
        }
        this.maxInstanceLifetime = props.maxInstanceLifetime;
        // See https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-max-instance-lifetime.html for details on max instance lifetime.
        if (this.maxInstanceLifetime && !this.maxInstanceLifetime.isUnresolved() &&
            (this.maxInstanceLifetime.toSeconds() !== 0) &&
            (this.maxInstanceLifetime.toSeconds() < 86400 || this.maxInstanceLifetime.toSeconds() > 31536000)) {
            throw new Error('maxInstanceLifetime must be between 1 and 365 days (inclusive)');
        }
        if (props.notificationsTopic && props.notifications) {
            throw new Error('Cannot set \'notificationsTopic\' and \'notifications\', \'notificationsTopic\' is deprecated use \'notifications\' instead');
        }
        if (props.notificationsTopic) {
            this.notifications = [{
                    topic: props.notificationsTopic,
                }];
        }
        if (props.notifications) {
            this.notifications = props.notifications.map(nc => ({
                topic: nc.topic,
                scalingEvents: nc.scalingEvents ?? ScalingEvents.ALL,
            }));
        }
        const { subnetIds, hasPublic } = props.vpc.selectSubnets(props.vpcSubnets);
        const asgProps = {
            autoScalingGroupName: this.physicalName,
            cooldown: props.cooldown?.toSeconds().toString(),
            minSize: core_1.Tokenization.stringifyNumber(minCapacity),
            maxSize: core_1.Tokenization.stringifyNumber(maxCapacity),
            desiredCapacity: desiredCapacity !== undefined ? core_1.Tokenization.stringifyNumber(desiredCapacity) : undefined,
            loadBalancerNames: core_1.Lazy.list({ produce: () => this.loadBalancerNames }, { omitEmpty: true }),
            targetGroupArns: core_1.Lazy.list({ produce: () => this.targetGroupArns }, { omitEmpty: true }),
            notificationConfigurations: this.renderNotificationConfiguration(),
            metricsCollection: core_1.Lazy.any({ produce: () => this.renderMetricsCollection() }),
            vpcZoneIdentifier: subnetIds,
            healthCheckType: props.healthCheck && props.healthCheck.type,
            healthCheckGracePeriod: props.healthCheck && props.healthCheck.gracePeriod && props.healthCheck.gracePeriod.toSeconds(),
            maxInstanceLifetime: this.maxInstanceLifetime ? this.maxInstanceLifetime.toSeconds() : undefined,
            newInstancesProtectedFromScaleIn: core_1.Lazy.any({ produce: () => this.newInstancesProtectedFromScaleIn }),
            terminationPolicies: props.terminationPolicies,
            defaultInstanceWarmup: props.defaultInstanceWarmup?.toSeconds(),
            capacityRebalance: props.capacityRebalance,
            ...this.getLaunchSettings(launchConfig, props.launchTemplate, props.mixedInstancesPolicy),
        };
        if (!hasPublic && props.associatePublicIpAddress) {
            throw new Error("To set 'associatePublicIpAddress: true' you must select Public subnets (vpcSubnets: { subnetType: SubnetType.PUBLIC })");
        }
        this.autoScalingGroup = new autoscaling_generated_1.CfnAutoScalingGroup(this, 'ASG', asgProps);
        this.autoScalingGroupName = this.getResourceNameAttribute(this.autoScalingGroup.ref),
            this.autoScalingGroupArn = core_1.Stack.of(this).formatArn({
                service: 'autoscaling',
                resource: 'autoScalingGroup:*:autoScalingGroupName',
                resourceName: this.autoScalingGroupName,
            });
        this.node.defaultChild = this.autoScalingGroup;
        this.applyUpdatePolicies(props, { desiredCapacity, minCapacity });
        if (props.init) {
            this.applyCloudFormationInit(props.init, props.initOptions);
        }
        this.spotPrice = props.spotPrice;
        if (props.requireImdsv2) {
            core_1.Aspects.of(this).add(new aspects_1.AutoScalingGroupRequireImdsv2Aspect());
        }
        this.node.addValidation({ validate: () => this.validateTargetGroup() });
    }
    static fromAutoScalingGroupName(scope, id, autoScalingGroupName) {
        class Import extends AutoScalingGroupBase {
            constructor() {
                super(...arguments);
                this.autoScalingGroupName = autoScalingGroupName;
                this.autoScalingGroupArn = core_1.Stack.of(this).formatArn({
                    service: 'autoscaling',
                    resource: 'autoScalingGroup:*:autoScalingGroupName',
                    resourceName: this.autoScalingGroupName,
                });
                this.osType = ec2.OperatingSystemType.UNKNOWN;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Add the security group to all instances via the launch configuration
     * security groups array.
     *
     * @param securityGroup: The security group to add
     */
    addSecurityGroup(securityGroup) {
        if (!this.securityGroups) {
            throw new Error('You cannot add security groups when the Auto Scaling Group is created from a Launch Template.');
        }
        this.securityGroups.push(securityGroup);
    }
    /**
     * Attach to a classic load balancer
     */
    attachToClassicLB(loadBalancer) {
        this.loadBalancerNames.push(loadBalancer.loadBalancerName);
    }
    /**
     * Attach to ELBv2 Application Target Group
     */
    attachToApplicationTargetGroup(targetGroup) {
        this.targetGroupArns.push(targetGroup.targetGroupArn);
        if (targetGroup instanceof elbv2.ApplicationTargetGroup) {
            // Copy onto self if it's a concrete type. We need this for autoscaling
            // based on request count, which we cannot do with an imported TargetGroup.
            this.albTargetGroup = targetGroup;
        }
        targetGroup.registerConnectable(this);
        return { targetType: elbv2.TargetType.INSTANCE };
    }
    /**
     * Attach to ELBv2 Application Target Group
     */
    attachToNetworkTargetGroup(targetGroup) {
        this.targetGroupArns.push(targetGroup.targetGroupArn);
        return { targetType: elbv2.TargetType.INSTANCE };
    }
    addUserData(...commands) {
        this.userData.addCommands(...commands);
    }
    /**
     * Adds a statement to the IAM role assumed by instances of this fleet.
     */
    addToRolePolicy(statement) {
        this.role.addToPrincipalPolicy(statement);
    }
    /**
     * Use a CloudFormation Init configuration at instance startup
     *
     * This does the following:
     *
     * - Attaches the CloudFormation Init metadata to the AutoScalingGroup resource.
     * - Add commands to the UserData to run `cfn-init` and `cfn-signal`.
     * - Update the instance's CreationPolicy to wait for `cfn-init` to finish
     *   before reporting success.
     */
    applyCloudFormationInit(init, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_ApplyCloudFormationInitOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.applyCloudFormationInit);
            }
            throw error;
        }
        if (!this.autoScalingGroup.cfnOptions.creationPolicy?.resourceSignal) {
            throw new Error('When applying CloudFormationInit, you must also configure signals by supplying \'signals\' at instantiation time.');
        }
        init.attach(this.autoScalingGroup, {
            platform: this.osType,
            instanceRole: this.role,
            userData: this.userData,
            configSets: options.configSets,
            embedFingerprint: options.embedFingerprint,
            printLog: options.printLog,
            ignoreFailures: options.ignoreFailures,
            includeRole: options.includeRole,
            includeUrl: options.includeUrl,
        });
    }
    /**
     * Ensures newly-launched instances are protected from scale-in.
     */
    protectNewInstancesFromScaleIn() {
        this.newInstancesProtectedFromScaleIn = true;
    }
    /**
     * Returns `true` if newly-launched instances are protected from scale-in.
     */
    areNewInstancesProtectedFromScaleIn() {
        return this.newInstancesProtectedFromScaleIn === true;
    }
    /**
     * The network connections associated with this resource.
     */
    get connections() {
        if (this._connections) {
            return this._connections;
        }
        if (this.launchTemplate) {
            return this.launchTemplate.connections;
        }
        throw new Error('AutoScalingGroup can only be used as IConnectable if it is not created from an imported Launch Template.');
    }
    /**
     * The Base64-encoded user data to make available to the launched EC2 instances.
     *
     * @throws an error if a launch template is given and it does not provide a non-null `userData`
     */
    get userData() {
        if (this._userData) {
            return this._userData;
        }
        if (this.launchTemplate?.userData) {
            return this.launchTemplate.userData;
        }
        throw new Error('The provided launch template does not expose its user data.');
    }
    /**
     * The IAM Role in the instance profile
     *
     * @throws an error if a launch template is given
     */
    get role() {
        if (this._role) {
            return this._role;
        }
        throw new Error('The provided launch template does not expose or does not define its role.');
    }
    verifyNoLaunchConfigPropIsGiven(props) {
        if (props.machineImage) {
            throw new Error('Setting \'machineImage\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
        }
        if (props.instanceType) {
            throw new Error('Setting \'instanceType\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
        }
        if (props.role) {
            throw new Error('Setting \'role\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
        }
        if (props.userData) {
            throw new Error('Setting \'userData\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
        }
        if (props.securityGroup) {
            throw new Error('Setting \'securityGroup\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
        }
        if (props.keyName) {
            throw new Error('Setting \'keyName\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
        }
        if (props.instanceMonitoring) {
            throw new Error('Setting \'instanceMonitoring\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
        }
        if (props.associatePublicIpAddress !== undefined) {
            throw new Error('Setting \'associatePublicIpAddress\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
        }
        if (props.spotPrice) {
            throw new Error('Setting \'spotPrice\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
        }
        if (props.blockDevices) {
            throw new Error('Setting \'blockDevices\' must not be set when \'launchTemplate\' or \'mixedInstancesPolicy\' is set');
        }
    }
    /**
     * Apply CloudFormation update policies for the AutoScalingGroup
     */
    applyUpdatePolicies(props, signalOptions) {
        // Make sure people are not using the old and new properties together
        const oldProps = [
            'updateType',
            'rollingUpdateConfiguration',
            'resourceSignalCount',
            'resourceSignalTimeout',
            'replacingUpdateMinSuccessfulInstancesPercent',
        ];
        for (const prop of oldProps) {
            if ((props.signals || props.updatePolicy) && props[prop] !== undefined) {
                throw new Error(`Cannot set 'signals'/'updatePolicy' and '${prop}' together. Prefer 'signals'/'updatePolicy'`);
            }
        }
        // Reify updatePolicy to `rollingUpdate` default in case it is combined with `init`
        props = {
            ...props,
            updatePolicy: props.updatePolicy ?? (props.init ? UpdatePolicy.rollingUpdate() : undefined),
        };
        if (props.signals || props.updatePolicy) {
            this.applyNewSignalUpdatePolicies(props, signalOptions);
        }
        else {
            this.applyLegacySignalUpdatePolicies(props);
        }
        // The following is technically part of the "update policy" but it's also a completely
        // separate aspect of rolling/replacing update, so it's just its own top-level property.
        // Default is 'true' because that's what you're most likely to want
        if (props.ignoreUnmodifiedSizeProperties !== false) {
            this.autoScalingGroup.cfnOptions.updatePolicy = {
                ...this.autoScalingGroup.cfnOptions.updatePolicy,
                autoScalingScheduledAction: { ignoreUnmodifiedGroupSizeProperties: true },
            };
        }
        if (props.signals && !props.init) {
            // To be able to send a signal using `cfn-init`, the execution role needs
            // `cloudformation:SignalResource`. Normally the binding of CfnInit would
            // grant that permissions and another one, but if the user wants to use
            // `signals` without `init`, add the permissions here.
            //
            // If they call `applyCloudFormationInit()` after construction, nothing bad
            // happens either, we'll just have a duplicate statement which doesn't hurt.
            this.addToRolePolicy(new iam.PolicyStatement({
                actions: ['cloudformation:SignalResource'],
                resources: [core_1.Aws.STACK_ID],
            }));
        }
    }
    /**
     * Use 'signals' and 'updatePolicy' to determine the creation and update policies
     */
    applyNewSignalUpdatePolicies(props, signalOptions) {
        this.autoScalingGroup.cfnOptions.creationPolicy = props.signals?.renderCreationPolicy(signalOptions);
        this.autoScalingGroup.cfnOptions.updatePolicy = props.updatePolicy?._renderUpdatePolicy({
            creationPolicy: this.autoScalingGroup.cfnOptions.creationPolicy,
        });
    }
    applyLegacySignalUpdatePolicies(props) {
        if (props.updateType === UpdateType.REPLACING_UPDATE) {
            this.autoScalingGroup.cfnOptions.updatePolicy = {
                ...this.autoScalingGroup.cfnOptions.updatePolicy,
                autoScalingReplacingUpdate: {
                    willReplace: true,
                },
            };
            if (props.replacingUpdateMinSuccessfulInstancesPercent !== undefined) {
                // Yes, this goes on CreationPolicy, not as a process parameter to ReplacingUpdate.
                // It's a little confusing, but the docs seem to explicitly state it will only be used
                // during the update?
                //
                // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-creationpolicy.html
                this.autoScalingGroup.cfnOptions.creationPolicy = {
                    ...this.autoScalingGroup.cfnOptions.creationPolicy,
                    autoScalingCreationPolicy: {
                        minSuccessfulInstancesPercent: validatePercentage(props.replacingUpdateMinSuccessfulInstancesPercent),
                    },
                };
            }
        }
        else if (props.updateType === UpdateType.ROLLING_UPDATE) {
            this.autoScalingGroup.cfnOptions.updatePolicy = {
                ...this.autoScalingGroup.cfnOptions.updatePolicy,
                autoScalingRollingUpdate: renderRollingUpdateConfig(props.rollingUpdateConfiguration),
            };
        }
        if (props.resourceSignalCount !== undefined || props.resourceSignalTimeout !== undefined) {
            this.autoScalingGroup.cfnOptions.creationPolicy = {
                ...this.autoScalingGroup.cfnOptions.creationPolicy,
                resourceSignal: {
                    count: props.resourceSignalCount,
                    timeout: props.resourceSignalTimeout && props.resourceSignalTimeout.toIsoString(),
                },
            };
        }
    }
    renderNotificationConfiguration() {
        if (this.notifications.length === 0) {
            return undefined;
        }
        return this.notifications.map(notification => ({
            topicArn: notification.topic.topicArn,
            notificationTypes: notification.scalingEvents ? notification.scalingEvents._types : ScalingEvents.ALL._types,
        }));
    }
    renderMetricsCollection() {
        if (this.groupMetrics.length === 0) {
            return undefined;
        }
        return this.groupMetrics.map(group => ({
            granularity: '1Minute',
            metrics: group._metrics?.size !== 0 ? [...group._metrics].map(m => m.name) : undefined,
        }));
    }
    getLaunchSettings(launchConfig, launchTemplate, mixedInstancesPolicy) {
        if (launchConfig) {
            return {
                launchConfigurationName: launchConfig.ref,
            };
        }
        if (launchTemplate) {
            return {
                launchTemplate: this.convertILaunchTemplateToSpecification(launchTemplate),
            };
        }
        if (mixedInstancesPolicy) {
            let instancesDistribution = undefined;
            if (mixedInstancesPolicy.instancesDistribution) {
                const dist = mixedInstancesPolicy.instancesDistribution;
                instancesDistribution = {
                    onDemandAllocationStrategy: dist.onDemandAllocationStrategy?.toString(),
                    onDemandBaseCapacity: dist.onDemandBaseCapacity,
                    onDemandPercentageAboveBaseCapacity: dist.onDemandPercentageAboveBaseCapacity,
                    spotAllocationStrategy: dist.spotAllocationStrategy?.toString(),
                    spotInstancePools: dist.spotInstancePools,
                    spotMaxPrice: dist.spotMaxPrice,
                };
            }
            return {
                mixedInstancesPolicy: {
                    instancesDistribution,
                    launchTemplate: {
                        launchTemplateSpecification: this.convertILaunchTemplateToSpecification(mixedInstancesPolicy.launchTemplate),
                        ...(mixedInstancesPolicy.launchTemplateOverrides ? {
                            overrides: mixedInstancesPolicy.launchTemplateOverrides.map(override => {
                                if (override.weightedCapacity && Math.floor(override.weightedCapacity) !== override.weightedCapacity) {
                                    throw new Error('Weight must be an integer');
                                }
                                return {
                                    instanceType: override.instanceType.toString(),
                                    launchTemplateSpecification: override.launchTemplate
                                        ? this.convertILaunchTemplateToSpecification(override.launchTemplate)
                                        : undefined,
                                    weightedCapacity: override.weightedCapacity?.toString(),
                                };
                            }),
                        } : {}),
                    },
                },
            };
        }
        throw new Error('Either launchConfig, launchTemplate or mixedInstancesPolicy needs to be specified.');
    }
    convertILaunchTemplateToSpecification(launchTemplate) {
        if (launchTemplate.launchTemplateId) {
            return {
                launchTemplateId: launchTemplate.launchTemplateId,
                version: launchTemplate.versionNumber,
            };
        }
        else {
            return {
                launchTemplateName: launchTemplate.launchTemplateName,
                version: launchTemplate.versionNumber,
            };
        }
    }
    validateTargetGroup() {
        const errors = new Array();
        if (this.hasCalledScaleOnRequestCount && this.targetGroupArns.length > 1) {
            errors.push('Cannon use multiple target groups if `scaleOnRequestCount()` is being used.');
        }
        return errors;
    }
}
exports.AutoScalingGroup = AutoScalingGroup;
_e = JSII_RTTI_SYMBOL_1;
AutoScalingGroup[_e] = { fqn: "@aws-cdk/aws-autoscaling.AutoScalingGroup", version: "0.0.0" };
/**
 * The type of update to perform on instances in this AutoScalingGroup
 *
 * @deprecated Use UpdatePolicy instead
 */
var UpdateType;
(function (UpdateType) {
    /**
     * Don't do anything
     */
    UpdateType["NONE"] = "None";
    /**
     * Replace the entire AutoScalingGroup
     *
     * Builds a new AutoScalingGroup first, then delete the old one.
     */
    UpdateType["REPLACING_UPDATE"] = "Replace";
    /**
     * Replace the instances in the AutoScalingGroup.
     */
    UpdateType["ROLLING_UPDATE"] = "RollingUpdate";
})(UpdateType = exports.UpdateType || (exports.UpdateType = {}));
/**
 * Fleet scaling events
 */
var ScalingEvent;
(function (ScalingEvent) {
    /**
     * Notify when an instance was launched
     */
    ScalingEvent["INSTANCE_LAUNCH"] = "autoscaling:EC2_INSTANCE_LAUNCH";
    /**
     * Notify when an instance was terminated
     */
    ScalingEvent["INSTANCE_TERMINATE"] = "autoscaling:EC2_INSTANCE_TERMINATE";
    /**
     * Notify when an instance failed to terminate
     */
    ScalingEvent["INSTANCE_TERMINATE_ERROR"] = "autoscaling:EC2_INSTANCE_TERMINATE_ERROR";
    /**
     * Notify when an instance failed to launch
     */
    ScalingEvent["INSTANCE_LAUNCH_ERROR"] = "autoscaling:EC2_INSTANCE_LAUNCH_ERROR";
    /**
     * Send a test notification to the topic
     */
    ScalingEvent["TEST_NOTIFICATION"] = "autoscaling:TEST_NOTIFICATION";
})(ScalingEvent = exports.ScalingEvent || (exports.ScalingEvent = {}));
/**
 * A list of ScalingEvents, you can use one of the predefined lists, such as ScalingEvents.ERRORS
 * or create a custom group by instantiating a `NotificationTypes` object, e.g: `new NotificationTypes(`NotificationType.INSTANCE_LAUNCH`)`.
 */
class ScalingEvents {
    constructor(...types) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_ScalingEvent(types);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ScalingEvents);
            }
            throw error;
        }
        this._types = types;
    }
}
exports.ScalingEvents = ScalingEvents;
_f = JSII_RTTI_SYMBOL_1;
ScalingEvents[_f] = { fqn: "@aws-cdk/aws-autoscaling.ScalingEvents", version: "0.0.0" };
/**
 * Fleet scaling errors
 */
ScalingEvents.ERRORS = new ScalingEvents(ScalingEvent.INSTANCE_LAUNCH_ERROR, ScalingEvent.INSTANCE_TERMINATE_ERROR);
/**
 * All fleet scaling events
 */
ScalingEvents.ALL = new ScalingEvents(ScalingEvent.INSTANCE_LAUNCH, ScalingEvent.INSTANCE_LAUNCH_ERROR, ScalingEvent.INSTANCE_TERMINATE, ScalingEvent.INSTANCE_TERMINATE_ERROR);
/**
 * Fleet scaling launch events
 */
ScalingEvents.LAUNCH_EVENTS = new ScalingEvents(ScalingEvent.INSTANCE_LAUNCH, ScalingEvent.INSTANCE_LAUNCH_ERROR);
/**
 * Fleet termination launch events
 */
ScalingEvents.TERMINATION_EVENTS = new ScalingEvents(ScalingEvent.INSTANCE_TERMINATE, ScalingEvent.INSTANCE_TERMINATE_ERROR);
var ScalingProcess;
(function (ScalingProcess) {
    ScalingProcess["LAUNCH"] = "Launch";
    ScalingProcess["TERMINATE"] = "Terminate";
    ScalingProcess["HEALTH_CHECK"] = "HealthCheck";
    ScalingProcess["REPLACE_UNHEALTHY"] = "ReplaceUnhealthy";
    ScalingProcess["AZ_REBALANCE"] = "AZRebalance";
    ScalingProcess["ALARM_NOTIFICATION"] = "AlarmNotification";
    ScalingProcess["SCHEDULED_ACTIONS"] = "ScheduledActions";
    ScalingProcess["ADD_TO_LOAD_BALANCER"] = "AddToLoadBalancer";
})(ScalingProcess = exports.ScalingProcess || (exports.ScalingProcess = {}));
// Recommended list of processes to suspend from here:
// https://aws.amazon.com/premiumsupport/knowledge-center/auto-scaling-group-rolling-updates/
const DEFAULT_SUSPEND_PROCESSES = [ScalingProcess.HEALTH_CHECK, ScalingProcess.REPLACE_UNHEALTHY, ScalingProcess.AZ_REBALANCE,
    ScalingProcess.ALARM_NOTIFICATION, ScalingProcess.SCHEDULED_ACTIONS];
/**
 * Health check settings
 */
class HealthCheck {
    constructor(type, gracePeriod) {
        this.type = type;
        this.gracePeriod = gracePeriod;
    }
    /**
     * Use EC2 for health checks
     *
     * @param options EC2 health check options
     */
    static ec2(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_Ec2HealthCheckOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.ec2);
            }
            throw error;
        }
        return new HealthCheck(HealthCheckType.EC2, options.grace);
    }
    /**
     * Use ELB for health checks.
     * It considers the instance unhealthy if it fails either the EC2 status checks or the load balancer health checks.
     *
     * @param options ELB health check options
     */
    static elb(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_autoscaling_ElbHealthCheckOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.elb);
            }
            throw error;
        }
        return new HealthCheck(HealthCheckType.ELB, options.grace);
    }
}
exports.HealthCheck = HealthCheck;
_g = JSII_RTTI_SYMBOL_1;
HealthCheck[_g] = { fqn: "@aws-cdk/aws-autoscaling.HealthCheck", version: "0.0.0" };
var HealthCheckType;
(function (HealthCheckType) {
    HealthCheckType["EC2"] = "EC2";
    HealthCheckType["ELB"] = "ELB";
})(HealthCheckType || (HealthCheckType = {}));
/**
 * Render the rolling update configuration into the appropriate object
 */
function renderRollingUpdateConfig(config = {}) {
    const waitOnResourceSignals = config.minSuccessfulInstancesPercent !== undefined;
    const pauseTime = config.pauseTime || (waitOnResourceSignals ? core_1.Duration.minutes(5) : core_1.Duration.seconds(0));
    return {
        maxBatchSize: config.maxBatchSize,
        minInstancesInService: config.minInstancesInService,
        minSuccessfulInstancesPercent: validatePercentage(config.minSuccessfulInstancesPercent),
        waitOnResourceSignals,
        pauseTime: pauseTime && pauseTime.toIsoString(),
        suspendProcesses: config.suspendProcesses ?? DEFAULT_SUSPEND_PROCESSES,
    };
}
function validatePercentage(x) {
    if (x === undefined || (0 <= x && x <= 100)) {
        return x;
    }
    throw new Error(`Expected: a percentage 0..100, got: ${x}`);
}
/**
 * Synthesize an array of block device mappings from a list of block device
 *
 * @param construct the instance/asg construct, used to host any warning
 * @param blockDevices list of block devices
 */
function synthesizeBlockDeviceMappings(construct, blockDevices) {
    return blockDevices.map(({ deviceName, volume, mappingEnabled }) => {
        const { virtualName, ebsDevice: ebs } = volume;
        if (volume === volume_1.BlockDeviceVolume._NO_DEVICE || mappingEnabled === false) {
            return {
                deviceName,
                noDevice: true,
            };
        }
        if (ebs) {
            const { iops, volumeType, throughput } = ebs;
            if (throughput) {
                const throughputRange = { Min: 125, Max: 1000 };
                const { Min, Max } = throughputRange;
                if (volumeType != volume_1.EbsDeviceVolumeType.GP3) {
                    throw new Error('throughput property requires volumeType: EbsDeviceVolumeType.GP3');
                }
                if (throughput < Min || throughput > Max) {
                    throw new Error(`throughput property takes a minimum of ${Min} and a maximum of ${Max}`);
                }
                const maximumThroughputRatio = 0.25;
                if (iops) {
                    const iopsRatio = (throughput / iops);
                    if (iopsRatio > maximumThroughputRatio) {
                        throw new Error(`Throughput (MiBps) to iops ratio of ${iopsRatio} is too high; maximum is ${maximumThroughputRatio} MiBps per iops`);
                    }
                }
            }
            if (!iops) {
                if (volumeType === volume_1.EbsDeviceVolumeType.IO1) {
                    throw new Error('iops property is required with volumeType: EbsDeviceVolumeType.IO1');
                }
            }
            else if (volumeType !== volume_1.EbsDeviceVolumeType.IO1) {
                core_1.Annotations.of(construct).addWarning('iops will be ignored without volumeType: EbsDeviceVolumeType.IO1');
            }
        }
        return {
            deviceName, ebs, virtualName,
        };
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1zY2FsaW5nLWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXV0by1zY2FsaW5nLWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdDQUF3QztBQUV4Qyw2REFBNkQ7QUFDN0Qsd0NBQXdDO0FBR3hDLHdDQVF1QjtBQUV2Qix1Q0FBZ0U7QUFDaEUsbUVBQWdIO0FBQ2hILHFEQUEwRTtBQUMxRSx5REFBZ0Y7QUFDaEYsK0RBQXVGO0FBQ3ZGLHFGQUEwSDtBQUUxSCxxQ0FBK0U7QUFDL0UsMkNBQXdEO0FBRXhEOztHQUVHO0FBQ0gsTUFBTSxRQUFRLEdBQVcsTUFBTSxDQUFDO0FBRWhDOztHQUVHO0FBQ0gsSUFBWSxVQVVYO0FBVkQsV0FBWSxVQUFVO0lBQ3BCOztPQUVHO0lBQ0gsNkNBQUssQ0FBQTtJQUVMOztPQUVHO0lBQ0gsbURBQVEsQ0FBQTtBQUNWLENBQUMsRUFWVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQVVyQjtBQW9XRDs7R0FFRztBQUNILElBQVksMEJBU1g7QUFURCxXQUFZLDBCQUEwQjtJQUNwQzs7Ozs7O09BTUc7SUFDSCx5REFBMkIsQ0FBQTtBQUM3QixDQUFDLEVBVFcsMEJBQTBCLEdBQTFCLGtDQUEwQixLQUExQixrQ0FBMEIsUUFTckM7QUFFRDs7R0FFRztBQUNILElBQVksc0JBNEJYO0FBNUJELFdBQVksc0JBQXNCO0lBQ2hDOzs7T0FHRztJQUNILHVEQUE2QixDQUFBO0lBRTdCOzs7OztPQUtHO0lBQ0gsbUVBQXlDLENBQUE7SUFFekM7Ozs7T0FJRztJQUNILDJGQUFpRSxDQUFBO0lBRWpFOzs7O09BSUc7SUFDSCwrRUFBcUQsQ0FBQTtBQUN2RCxDQUFDLEVBNUJXLHNCQUFzQixHQUF0Qiw4QkFBc0IsS0FBdEIsOEJBQXNCLFFBNEJqQztBQWtPRDs7Ozs7Ozs7R0FRRztBQUNILE1BQXNCLE9BQU87SUFDM0I7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENB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LEVBQUU7b0JBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQ2IsMENBQTBDLEdBQUcscUJBQXFCLEdBQUcsRUFBRSxDQUN4RSxDQUFDO2lCQUNIO2dCQUVELE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxDQUFDO2dCQUNwQyxJQUFJLElBQUksRUFBRTtvQkFDUixNQUFNLFNBQVMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxTQUFTLEdBQUcsc0JBQXNCLEVBQUU7d0JBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLFNBQVMsNEJBQTRCLHNCQUFzQixpQkFBaUIsQ0FBQyxDQUFDO3FCQUN0STtpQkFDRjthQUNGO1lBR0QsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDVCxJQUFJLFVBQVUsS0FBSyw0QkFBbUIsQ0FBQyxHQUFHLEVBQUU7b0JBQzFDLE1BQU0sSUFBSSxLQUFLLENBQUMsb0VBQW9FLENBQUMsQ0FBQztpQkFDdkY7YUFDRjtpQkFBTSxJQUFJLFVBQVUsS0FBSyw0QkFBbUIsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2pELGtCQUFXLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO2FBQzFHO1NBQ0Y7UUFFRCxPQUFPO1lBQ0wsVUFBVSxFQUFFLEdBQUcsRUFBRSxXQUFXO1NBQzdCLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZHdhdGNoIGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZHdhdGNoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVsYiBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmcnO1xuaW1wb3J0ICogYXMgZWxidjIgZnJvbSAnQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1zbnMnO1xuXG5pbXBvcnQge1xuICBBbm5vdGF0aW9ucyxcbiAgQXNwZWN0cyxcbiAgQXdzLFxuICBDZm5BdXRvU2NhbGluZ1JvbGxpbmdVcGRhdGUsIENmbkNyZWF0aW9uUG9saWN5LCBDZm5VcGRhdGVQb2xpY3ksXG4gIER1cmF0aW9uLCBGbiwgSVJlc291cmNlLCBMYXp5LCBQaHlzaWNhbE5hbWUsIFJlc291cmNlLCBTdGFjaywgVGFncyxcbiAgVG9rZW4sXG4gIFRva2VuaXphdGlvbiwgd2l0aFJlc29sdmVkLFxufSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQXV0b1NjYWxpbmdHcm91cFJlcXVpcmVJbWRzdjJBc3BlY3QgfSBmcm9tICcuL2FzcGVjdHMnO1xuaW1wb3J0IHsgQ2ZuQXV0b1NjYWxpbmdHcm91cCwgQ2ZuQXV0b1NjYWxpbmdHcm91cFByb3BzLCBDZm5MYXVuY2hDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9hdXRvc2NhbGluZy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQmFzaWNMaWZlY3ljbGVIb29rUHJvcHMsIExpZmVjeWNsZUhvb2sgfSBmcm9tICcuL2xpZmVjeWNsZS1ob29rJztcbmltcG9ydCB7IEJhc2ljU2NoZWR1bGVkQWN0aW9uUHJvcHMsIFNjaGVkdWxlZEFjdGlvbiB9IGZyb20gJy4vc2NoZWR1bGVkLWFjdGlvbic7XG5pbXBvcnQgeyBCYXNpY1N0ZXBTY2FsaW5nUG9saWN5UHJvcHMsIFN0ZXBTY2FsaW5nUG9saWN5IH0gZnJvbSAnLi9zdGVwLXNjYWxpbmctcG9saWN5JztcbmltcG9ydCB7IEJhc2VUYXJnZXRUcmFja2luZ1Byb3BzLCBQcmVkZWZpbmVkTWV0cmljLCBUYXJnZXRUcmFja2luZ1NjYWxpbmdQb2xpY3kgfSBmcm9tICcuL3RhcmdldC10cmFja2luZy1zY2FsaW5nLXBvbGljeSc7XG5pbXBvcnQgeyBUZXJtaW5hdGlvblBvbGljeSB9IGZyb20gJy4vdGVybWluYXRpb24tcG9saWN5JztcbmltcG9ydCB7IEJsb2NrRGV2aWNlLCBCbG9ja0RldmljZVZvbHVtZSwgRWJzRGV2aWNlVm9sdW1lVHlwZSB9IGZyb20gJy4vdm9sdW1lJztcbmltcG9ydCB7IFdhcm1Qb29sLCBXYXJtUG9vbE9wdGlvbnMgfSBmcm9tICcuL3dhcm0tcG9vbCc7XG5cbi8qKlxuICogTmFtZSB0YWcgY29uc3RhbnRcbiAqL1xuY29uc3QgTkFNRV9UQUc6IHN0cmluZyA9ICdOYW1lJztcblxuLyoqXG4gKiBUaGUgbW9uaXRvcmluZyBtb2RlIGZvciBpbnN0YW5jZXMgbGF1bmNoZWQgaW4gYW4gYXV0b3NjYWxpbmcgZ3JvdXBcbiAqL1xuZXhwb3J0IGVudW0gTW9uaXRvcmluZyB7XG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgbWV0cmljcyBldmVyeSA1IG1pbnV0ZXNcbiAgICovXG4gIEJBU0lDLFxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgbWV0cmljcyBldmVyeSBtaW51dGVcbiAgICovXG4gIERFVEFJTEVELFxufVxuXG4vKipcbiAqIEJhc2ljIHByb3BlcnRpZXMgb2YgYW4gQXV0b1NjYWxpbmdHcm91cCwgZXhjZXB0IHRoZSBleGFjdCBtYWNoaW5lcyB0byBydW4gYW5kIHdoZXJlIHRoZXkgc2hvdWxkIHJ1blxuICpcbiAqIENvbnN0cnVjdHMgdGhhdCB3YW50IHRvIGNyZWF0ZSBBdXRvU2NhbGluZ0dyb3VwcyBjYW4gaW5oZXJpdFxuICogdGhpcyBpbnRlcmZhY2UgYW5kIHNwZWNpYWxpemUgdGhlIGVzc2VudGlhbCBwYXJ0cyBpbiB2YXJpb3VzIHdheXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29tbW9uQXV0b1NjYWxpbmdHcm91cFByb3BzIHtcbiAgLyoqXG4gICAqIE1pbmltdW0gbnVtYmVyIG9mIGluc3RhbmNlcyBpbiB0aGUgZmxlZXRcbiAgICpcbiAgICogQGRlZmF1bHQgMVxuICAgKi9cbiAgcmVhZG9ubHkgbWluQ2FwYWNpdHk/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIE1heGltdW0gbnVtYmVyIG9mIGluc3RhbmNlcyBpbiB0aGUgZmxlZXRcbiAgICpcbiAgICogQGRlZmF1bHQgZGVzaXJlZENhcGFjaXR5XG4gICAqL1xuICByZWFkb25seSBtYXhDYXBhY2l0eT86IG51bWJlcjtcblxuICAvKipcbiAgICogSW5pdGlhbCBhbW91bnQgb2YgaW5zdGFuY2VzIGluIHRoZSBmbGVldFxuICAgKlxuICAgKiBJZiB0aGlzIGlzIHNldCB0byBhIG51bWJlciwgZXZlcnkgZGVwbG95bWVudCB3aWxsIHJlc2V0IHRoZSBhbW91bnQgb2ZcbiAgICogaW5zdGFuY2VzIHRvIHRoaXMgbnVtYmVyLiBJdCBpcyByZWNvbW1lbmRlZCB0byBsZWF2ZSB0aGlzIHZhbHVlIGJsYW5rLlxuICAgKlxuICAgKiBAZGVmYXVsdCBtaW5DYXBhY2l0eSwgYW5kIGxlYXZlIHVuY2hhbmdlZCBkdXJpbmcgZGVwbG95bWVudFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWFzLWdyb3VwLmh0bWwjY2ZuLWFzLWdyb3VwLWRlc2lyZWRjYXBhY2l0eVxuICAgKi9cbiAgcmVhZG9ubHkgZGVzaXJlZENhcGFjaXR5PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIFNTSCBrZXlwYWlyIHRvIGdyYW50IGFjY2VzcyB0byBpbnN0YW5jZXNcbiAgICpcbiAgICogYGxhdW5jaFRlbXBsYXRlYCBhbmQgYG1peGVkSW5zdGFuY2VzUG9saWN5YCBtdXN0IG5vdCBiZSBzcGVjaWZpZWQgd2hlbiB0aGlzIHByb3BlcnR5IGlzIHNwZWNpZmllZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIFNTSCBhY2Nlc3Mgd2lsbCBiZSBwb3NzaWJsZS5cbiAgICovXG4gIHJlYWRvbmx5IGtleU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXJlIHRvIHBsYWNlIGluc3RhbmNlcyB3aXRoaW4gdGhlIFZQQ1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFsbCBQcml2YXRlIHN1Ym5ldHMuXG4gICAqL1xuICByZWFkb25seSB2cGNTdWJuZXRzPzogZWMyLlN1Ym5ldFNlbGVjdGlvbjtcblxuICAvKipcbiAgICogU05TIHRvcGljIHRvIHNlbmQgbm90aWZpY2F0aW9ucyBhYm91dCBmbGVldCBjaGFuZ2VzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZmxlZXQgY2hhbmdlIG5vdGlmaWNhdGlvbnMgd2lsbCBiZSBzZW50LlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYG5vdGlmaWNhdGlvbnNgXG4gICAqL1xuICByZWFkb25seSBub3RpZmljYXRpb25zVG9waWM/OiBzbnMuSVRvcGljO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmUgYXV0b3NjYWxpbmcgZ3JvdXAgdG8gc2VuZCBub3RpZmljYXRpb25zIGFib3V0IGZsZWV0IGNoYW5nZXMgdG8gYW4gU05TIHRvcGljKHMpXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtYXMtZ3JvdXAuaHRtbCNjZm4tYXMtZ3JvdXAtbm90aWZpY2F0aW9uY29uZmlndXJhdGlvbnNcbiAgICogQGRlZmF1bHQgLSBObyBmbGVldCBjaGFuZ2Ugbm90aWZpY2F0aW9ucyB3aWxsIGJlIHNlbnQuXG4gICAqL1xuICByZWFkb25seSBub3RpZmljYXRpb25zPzogTm90aWZpY2F0aW9uQ29uZmlndXJhdGlvbltdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBpbnN0YW5jZXMgY2FuIGluaXRpYXRlIGNvbm5lY3Rpb25zIHRvIGFueXdoZXJlIGJ5IGRlZmF1bHRcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxsb3dBbGxPdXRib3VuZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoYXQgdG8gZG8gd2hlbiBhbiBBdXRvU2NhbGluZ0dyb3VwJ3MgaW5zdGFuY2UgY29uZmlndXJhdGlvbiBpcyBjaGFuZ2VkXG4gICAqXG4gICAqIFRoaXMgaXMgYXBwbGllZCB3aGVuIGFueSBvZiB0aGUgc2V0dGluZ3Mgb24gdGhlIEFTRyBhcmUgY2hhbmdlZCB0aGF0XG4gICAqIGFmZmVjdCBob3cgdGhlIGluc3RhbmNlcyBzaG91bGQgYmUgY3JlYXRlZCAoVlBDLCBpbnN0YW5jZSB0eXBlLCBzdGFydHVwXG4gICAqIHNjcmlwdHMsIGV0Yy4pLiBJdCBpbmRpY2F0ZXMgaG93IHRoZSBleGlzdGluZyBpbnN0YW5jZXMgc2hvdWxkIGJlXG4gICAqIHJlcGxhY2VkIHdpdGggbmV3IGluc3RhbmNlcyBtYXRjaGluZyB0aGUgbmV3IGNvbmZpZy4gQnkgZGVmYXVsdCxcbiAgICogYHVwZGF0ZVBvbGljeWAgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIGB1cGRhdGVUeXBlYC5cbiAgICpcbiAgICogQGRlZmF1bHQgVXBkYXRlVHlwZS5SRVBMQUNJTkdfVVBEQVRFLCB1bmxlc3MgdXBkYXRlUG9saWN5IGhhcyBiZWVuIHNldFxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHVwZGF0ZVBvbGljeWAgaW5zdGVhZFxuICAgKi9cbiAgcmVhZG9ubHkgdXBkYXRlVHlwZT86IFVwZGF0ZVR5cGU7XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gZm9yIHJvbGxpbmcgdXBkYXRlc1xuICAgKlxuICAgKiBPbmx5IHVzZWQgaWYgdXBkYXRlVHlwZSA9PSBVcGRhdGVUeXBlLlJvbGxpbmdVcGRhdGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gUm9sbGluZ1VwZGF0ZUNvbmZpZ3VyYXRpb24gd2l0aCBkZWZhdWx0cy5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIGB1cGRhdGVQb2xpY3lgIGluc3RlYWRcbiAgICovXG4gIHJlYWRvbmx5IHJvbGxpbmdVcGRhdGVDb25maWd1cmF0aW9uPzogUm9sbGluZ1VwZGF0ZUNvbmZpZ3VyYXRpb247XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gZm9yIHJlcGxhY2luZyB1cGRhdGVzLlxuICAgKlxuICAgKiBPbmx5IHVzZWQgaWYgdXBkYXRlVHlwZSA9PSBVcGRhdGVUeXBlLlJlcGxhY2luZ1VwZGF0ZS4gU3BlY2lmaWVzIGhvd1xuICAgKiBtYW55IGluc3RhbmNlcyBtdXN0IHNpZ25hbCBzdWNjZXNzIGZvciB0aGUgdXBkYXRlIHRvIHN1Y2NlZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IG1pblN1Y2Nlc3NmdWxJbnN0YW5jZXNQZXJjZW50XG4gICAqIEBkZXByZWNhdGVkIFVzZSBgc2lnbmFsc2AgaW5zdGVhZFxuICAgKi9cbiAgcmVhZG9ubHkgcmVwbGFjaW5nVXBkYXRlTWluU3VjY2Vzc2Z1bEluc3RhbmNlc1BlcmNlbnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIElmIHRoZSBBU0cgaGFzIHNjaGVkdWxlZCBhY3Rpb25zLCBkb24ndCByZXNldCB1bmNoYW5nZWQgZ3JvdXAgc2l6ZXNcbiAgICpcbiAgICogT25seSB1c2VkIGlmIHRoZSBBU0cgaGFzIHNjaGVkdWxlZCBhY3Rpb25zICh3aGljaCBtYXkgc2NhbGUgeW91ciBBU0cgdXBcbiAgICogb3IgZG93biByZWdhcmRsZXNzIG9mIGNkayBkZXBsb3ltZW50cykuIElmIHRydWUsIHRoZSBzaXplIG9mIHRoZSBncm91cFxuICAgKiB3aWxsIG9ubHkgYmUgcmVzZXQgaWYgaXQgaGFzIGJlZW4gY2hhbmdlZCBpbiB0aGUgQ0RLIGFwcC4gSWYgZmFsc2UsIHRoZVxuICAgKiBzaXplcyB3aWxsIGFsd2F5cyBiZSBjaGFuZ2VkIGJhY2sgdG8gd2hhdCB0aGV5IHdlcmUgaW4gdGhlIENESyBhcHBcbiAgICogb24gZGVwbG95bWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgaWdub3JlVW5tb2RpZmllZFNpemVQcm9wZXJ0aWVzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSG93IG1hbnkgUmVzb3VyY2VTaWduYWwgY2FsbHMgQ2xvdWRGb3JtYXRpb24gZXhwZWN0cyBiZWZvcmUgdGhlIHJlc291cmNlIGlzIGNvbnNpZGVyZWQgY3JlYXRlZFxuICAgKlxuICAgKiBAZGVmYXVsdCAxIGlmIHJlc291cmNlU2lnbmFsVGltZW91dCBpcyBzZXQsIDAgb3RoZXJ3aXNlXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgc2lnbmFsc2AgaW5zdGVhZC5cbiAgICovXG4gIHJlYWRvbmx5IHJlc291cmNlU2lnbmFsQ291bnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBsZW5ndGggb2YgdGltZSB0byB3YWl0IGZvciB0aGUgcmVzb3VyY2VTaWduYWxDb3VudFxuICAgKlxuICAgKiBUaGUgbWF4aW11bSB2YWx1ZSBpcyA0MzIwMCAoMTIgaG91cnMpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taW51dGVzKDUpIGlmIHJlc291cmNlU2lnbmFsQ291bnQgaXMgc2V0LCBOL0Egb3RoZXJ3aXNlXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgc2lnbmFsc2AgaW5zdGVhZC5cbiAgICovXG4gIHJlYWRvbmx5IHJlc291cmNlU2lnbmFsVGltZW91dD86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHNjYWxpbmcgY29vbGRvd24gZm9yIHRoaXMgQXV0b1NjYWxpbmdHcm91cFxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taW51dGVzKDUpXG4gICAqL1xuICByZWFkb25seSBjb29sZG93bj86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGluc3RhbmNlcyBpbiB0aGUgQXV0byBTY2FsaW5nIEdyb3VwIHNob3VsZCBoYXZlIHB1YmxpY1xuICAgKiBJUCBhZGRyZXNzZXMgYXNzb2NpYXRlZCB3aXRoIHRoZW0uXG4gICAqXG4gICAqIGBsYXVuY2hUZW1wbGF0ZWAgYW5kIGBtaXhlZEluc3RhbmNlc1BvbGljeWAgbXVzdCBub3QgYmUgc3BlY2lmaWVkIHdoZW4gdGhpcyBwcm9wZXJ0eSBpcyBzcGVjaWZpZWRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBVc2Ugc3VibmV0IHNldHRpbmcuXG4gICAqL1xuICByZWFkb25seSBhc3NvY2lhdGVQdWJsaWNJcEFkZHJlc3M/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgbWF4aW11bSBob3VybHkgcHJpY2UgKGluIFVTRCkgdG8gYmUgcGFpZCBmb3IgYW55IFNwb3QgSW5zdGFuY2UgbGF1bmNoZWQgdG8gZnVsZmlsbCB0aGUgcmVxdWVzdC4gU3BvdCBJbnN0YW5jZXMgYXJlXG4gICAqIGxhdW5jaGVkIHdoZW4gdGhlIHByaWNlIHlvdSBzcGVjaWZ5IGV4Y2VlZHMgdGhlIGN1cnJlbnQgU3BvdCBtYXJrZXQgcHJpY2UuXG4gICAqXG4gICAqIGBsYXVuY2hUZW1wbGF0ZWAgYW5kIGBtaXhlZEluc3RhbmNlc1BvbGljeWAgbXVzdCBub3QgYmUgc3BlY2lmaWVkIHdoZW4gdGhpcyBwcm9wZXJ0eSBpcyBzcGVjaWZpZWRcbiAgICpcbiAgICogQGRlZmF1bHQgbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgc3BvdFByaWNlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGZvciBoZWFsdGggY2hlY2tzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSGVhbHRoQ2hlY2suZWMyIHdpdGggbm8gZ3JhY2UgcGVyaW9kXG4gICAqL1xuICByZWFkb25seSBoZWFsdGhDaGVjaz86IEhlYWx0aENoZWNrO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgaG93IGJsb2NrIGRldmljZXMgYXJlIGV4cG9zZWQgdG8gdGhlIGluc3RhbmNlLiBZb3UgY2FuIHNwZWNpZnkgdmlydHVhbCBkZXZpY2VzIGFuZCBFQlMgdm9sdW1lcy5cbiAgICpcbiAgICogRWFjaCBpbnN0YW5jZSB0aGF0IGlzIGxhdW5jaGVkIGhhcyBhbiBhc3NvY2lhdGVkIHJvb3QgZGV2aWNlIHZvbHVtZSxcbiAgICogZWl0aGVyIGFuIEFtYXpvbiBFQlMgdm9sdW1lIG9yIGFuIGluc3RhbmNlIHN0b3JlIHZvbHVtZS5cbiAgICogWW91IGNhbiB1c2UgYmxvY2sgZGV2aWNlIG1hcHBpbmdzIHRvIHNwZWNpZnkgYWRkaXRpb25hbCBFQlMgdm9sdW1lcyBvclxuICAgKiBpbnN0YW5jZSBzdG9yZSB2b2x1bWVzIHRvIGF0dGFjaCB0byBhbiBpbnN0YW5jZSB3aGVuIGl0IGlzIGxhdW5jaGVkLlxuICAgKlxuICAgKiBgbGF1bmNoVGVtcGxhdGVgIGFuZCBgbWl4ZWRJbnN0YW5jZXNQb2xpY3lgIG11c3Qgbm90IGJlIHNwZWNpZmllZCB3aGVuIHRoaXMgcHJvcGVydHkgaXMgc3BlY2lmaWVkXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvVXNlckd1aWRlL2Jsb2NrLWRldmljZS1tYXBwaW5nLWNvbmNlcHRzLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBVc2VzIHRoZSBibG9jayBkZXZpY2UgbWFwcGluZyBvZiB0aGUgQU1JXG4gICAqL1xuICByZWFkb25seSBibG9ja0RldmljZXM/OiBCbG9ja0RldmljZVtdO1xuXG4gIC8qKlxuICAgKiBUaGUgbWF4aW11bSBhbW91bnQgb2YgdGltZSB0aGF0IGFuIGluc3RhbmNlIGNhbiBiZSBpbiBzZXJ2aWNlLiBUaGUgbWF4aW11bSBkdXJhdGlvbiBhcHBsaWVzXG4gICAqIHRvIGFsbCBjdXJyZW50IGFuZCBmdXR1cmUgaW5zdGFuY2VzIGluIHRoZSBncm91cC4gQXMgYW4gaW5zdGFuY2UgYXBwcm9hY2hlcyBpdHMgbWF4aW11bSBkdXJhdGlvbixcbiAgICogaXQgaXMgdGVybWluYXRlZCBhbmQgcmVwbGFjZWQsIGFuZCBjYW5ub3QgYmUgdXNlZCBhZ2Fpbi5cbiAgICpcbiAgICogWW91IG11c3Qgc3BlY2lmeSBhIHZhbHVlIG9mIGF0IGxlYXN0IDYwNCw4MDAgc2Vjb25kcyAoNyBkYXlzKS4gVG8gY2xlYXIgYSBwcmV2aW91c2x5IHNldCB2YWx1ZSxcbiAgICogbGVhdmUgdGhpcyBwcm9wZXJ0eSB1bmRlZmluZWQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2F1dG9zY2FsaW5nL2VjMi91c2VyZ3VpZGUvYXNnLW1heC1pbnN0YW5jZS1saWZldGltZS5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IG1heEluc3RhbmNlTGlmZXRpbWU/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogQ29udHJvbHMgd2hldGhlciBpbnN0YW5jZXMgaW4gdGhpcyBncm91cCBhcmUgbGF1bmNoZWQgd2l0aCBkZXRhaWxlZCBvciBiYXNpYyBtb25pdG9yaW5nLlxuICAgKlxuICAgKiBXaGVuIGRldGFpbGVkIG1vbml0b3JpbmcgaXMgZW5hYmxlZCwgQW1hem9uIENsb3VkV2F0Y2ggZ2VuZXJhdGVzIG1ldHJpY3MgZXZlcnkgbWludXRlIGFuZCB5b3VyIGFjY291bnRcbiAgICogaXMgY2hhcmdlZCBhIGZlZS4gV2hlbiB5b3UgZGlzYWJsZSBkZXRhaWxlZCBtb25pdG9yaW5nLCBDbG91ZFdhdGNoIGdlbmVyYXRlcyBtZXRyaWNzIGV2ZXJ5IDUgbWludXRlcy5cbiAgICpcbiAgICogYGxhdW5jaFRlbXBsYXRlYCBhbmQgYG1peGVkSW5zdGFuY2VzUG9saWN5YCBtdXN0IG5vdCBiZSBzcGVjaWZpZWQgd2hlbiB0aGlzIHByb3BlcnR5IGlzIHNwZWNpZmllZFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hdXRvc2NhbGluZy9sYXRlc3QvdXNlcmd1aWRlL2FzLWluc3RhbmNlLW1vbml0b3JpbmcuaHRtbCNlbmFibGUtYXMtaW5zdGFuY2UtbWV0cmljc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE1vbml0b3JpbmcuREVUQUlMRURcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlTW9uaXRvcmluZz86IE1vbml0b3Jpbmc7XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBtb25pdG9yaW5nIGZvciBncm91cCBtZXRyaWNzLCB0aGVzZSBtZXRyaWNzIGRlc2NyaWJlIHRoZSBncm91cCByYXRoZXIgdGhhbiBhbnkgb2YgaXRzIGluc3RhbmNlcy5cbiAgICogVG8gcmVwb3J0IGFsbCBncm91cCBtZXRyaWNzIHVzZSBgR3JvdXBNZXRyaWNzLmFsbCgpYFxuICAgKiBHcm91cCBtZXRyaWNzIGFyZSByZXBvcnRlZCBpbiBhIGdyYW51bGFyaXR5IG9mIDEgbWludXRlIGF0IG5vIGFkZGl0aW9uYWwgY2hhcmdlLlxuICAgKiBAZGVmYXVsdCAtIG5vIGdyb3VwIG1ldHJpY3Mgd2lsbCBiZSByZXBvcnRlZFxuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgZ3JvdXBNZXRyaWNzPzogR3JvdXBNZXRyaWNzW107XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB3YWl0aW5nIGZvciBzaWduYWxzIGR1cmluZyBkZXBsb3ltZW50XG4gICAqXG4gICAqIFVzZSB0aGlzIHRvIHBhdXNlIHRoZSBDbG91ZEZvcm1hdGlvbiBkZXBsb3ltZW50IHRvIHdhaXQgZm9yIHRoZSBpbnN0YW5jZXNcbiAgICogaW4gdGhlIEF1dG9TY2FsaW5nR3JvdXAgdG8gcmVwb3J0IHN1Y2Nlc3NmdWwgc3RhcnR1cCBkdXJpbmdcbiAgICogY3JlYXRpb24gYW5kIHVwZGF0ZXMuIFRoZSBVc2VyRGF0YSBzY3JpcHQgbmVlZHMgdG8gaW52b2tlIGBjZm4tc2lnbmFsYFxuICAgKiB3aXRoIGEgc3VjY2VzcyBvciBmYWlsdXJlIGNvZGUgYWZ0ZXIgaXQgaXMgZG9uZSBzZXR0aW5nIHVwIHRoZSBpbnN0YW5jZS5cbiAgICpcbiAgICogV2l0aG91dCB3YWl0aW5nIGZvciBzaWduYWxzLCB0aGUgQ2xvdWRGb3JtYXRpb24gZGVwbG95bWVudCB3aWxsIHByb2NlZWQgYXNcbiAgICogc29vbiBhcyB0aGUgQXV0b1NjYWxpbmdHcm91cCBoYXMgYmVlbiBjcmVhdGVkIG9yIHVwZGF0ZWQgYnV0IGJlZm9yZSB0aGVcbiAgICogaW5zdGFuY2VzIGluIHRoZSBncm91cCBoYXZlIGJlZW4gc3RhcnRlZC5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHRvIGhhdmUgaW5zdGFuY2VzIHdhaXQgZm9yIGFuIEVsYXN0aWMgTG9hZCBCYWxhbmNpbmcgaGVhbHRoIGNoZWNrIGJlZm9yZVxuICAgKiB0aGV5IHNpZ25hbCBzdWNjZXNzLCBhZGQgYSBoZWFsdGgtY2hlY2sgdmVyaWZpY2F0aW9uIGJ5IHVzaW5nIHRoZVxuICAgKiBjZm4taW5pdCBoZWxwZXIgc2NyaXB0LiBGb3IgYW4gZXhhbXBsZSwgc2VlIHRoZSB2ZXJpZnlfaW5zdGFuY2VfaGVhbHRoXG4gICAqIGNvbW1hbmQgaW4gdGhlIEF1dG8gU2NhbGluZyByb2xsaW5nIHVwZGF0ZXMgc2FtcGxlIHRlbXBsYXRlOlxuICAgKlxuICAgKiBodHRwczovL2dpdGh1Yi5jb20vYXdzbGFicy9hd3MtY2xvdWRmb3JtYXRpb24tdGVtcGxhdGVzL2Jsb2IvbWFzdGVyL2F3cy9zZXJ2aWNlcy9BdXRvU2NhbGluZy9BdXRvU2NhbGluZ1JvbGxpbmdVcGRhdGVzLnlhbWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBEbyBub3Qgd2FpdCBmb3Igc2lnbmFsc1xuICAgKi9cbiAgcmVhZG9ubHkgc2lnbmFscz86IFNpZ25hbHM7XG5cbiAgLyoqXG4gICAqIFdoYXQgdG8gZG8gd2hlbiBhbiBBdXRvU2NhbGluZ0dyb3VwJ3MgaW5zdGFuY2UgY29uZmlndXJhdGlvbiBpcyBjaGFuZ2VkXG4gICAqXG4gICAqIFRoaXMgaXMgYXBwbGllZCB3aGVuIGFueSBvZiB0aGUgc2V0dGluZ3Mgb24gdGhlIEFTRyBhcmUgY2hhbmdlZCB0aGF0XG4gICAqIGFmZmVjdCBob3cgdGhlIGluc3RhbmNlcyBzaG91bGQgYmUgY3JlYXRlZCAoVlBDLCBpbnN0YW5jZSB0eXBlLCBzdGFydHVwXG4gICAqIHNjcmlwdHMsIGV0Yy4pLiBJdCBpbmRpY2F0ZXMgaG93IHRoZSBleGlzdGluZyBpbnN0YW5jZXMgc2hvdWxkIGJlXG4gICAqIHJlcGxhY2VkIHdpdGggbmV3IGluc3RhbmNlcyBtYXRjaGluZyB0aGUgbmV3IGNvbmZpZy4gQnkgZGVmYXVsdCwgbm90aGluZ1xuICAgKiBpcyBkb25lIGFuZCBvbmx5IG5ldyBpbnN0YW5jZXMgYXJlIGxhdW5jaGVkIHdpdGggdGhlIG5ldyBjb25maWcuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYFVwZGF0ZVBvbGljeS5yb2xsaW5nVXBkYXRlKClgIGlmIHVzaW5nIGBpbml0YCwgYFVwZGF0ZVBvbGljeS5ub25lKClgIG90aGVyd2lzZVxuICAgKi9cbiAgcmVhZG9ubHkgdXBkYXRlUG9saWN5PzogVXBkYXRlUG9saWN5O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG5ld2x5LWxhdW5jaGVkIGluc3RhbmNlcyBhcmUgcHJvdGVjdGVkIGZyb20gdGVybWluYXRpb24gYnkgQW1hem9uXG4gICAqIEVDMiBBdXRvIFNjYWxpbmcgd2hlbiBzY2FsaW5nIGluLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBBdXRvIFNjYWxpbmcgY2FuIHRlcm1pbmF0ZSBhbiBpbnN0YW5jZSBhdCBhbnkgdGltZSBhZnRlciBsYXVuY2hcbiAgICogd2hlbiBzY2FsaW5nIGluIGFuIEF1dG8gU2NhbGluZyBHcm91cCwgc3ViamVjdCB0byB0aGUgZ3JvdXAncyB0ZXJtaW5hdGlvblxuICAgKiBwb2xpY3kuIEhvd2V2ZXIsIHlvdSBtYXkgd2lzaCB0byBwcm90ZWN0IG5ld2x5LWxhdW5jaGVkIGluc3RhbmNlcyBmcm9tXG4gICAqIGJlaW5nIHNjYWxlZCBpbiBpZiB0aGV5IGFyZSBnb2luZyB0byBydW4gY3JpdGljYWwgYXBwbGljYXRpb25zIHRoYXQgc2hvdWxkXG4gICAqIG5vdCBiZSBwcmVtYXR1cmVseSB0ZXJtaW5hdGVkLlxuICAgKlxuICAgKiBUaGlzIGZsYWcgbXVzdCBiZSBlbmFibGVkIGlmIHRoZSBBdXRvIFNjYWxpbmcgR3JvdXAgd2lsbCBiZSBhc3NvY2lhdGVkIHdpdGhcbiAgICogYW4gRUNTIENhcGFjaXR5IFByb3ZpZGVyIHdpdGggbWFuYWdlZCB0ZXJtaW5hdGlvbiBwcm90ZWN0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgbmV3SW5zdGFuY2VzUHJvdGVjdGVkRnJvbVNjYWxlSW4/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgQXV0byBTY2FsaW5nIGdyb3VwLiBUaGlzIG5hbWUgbXVzdCBiZSB1bmlxdWUgcGVyIFJlZ2lvbiBwZXIgYWNjb3VudC5cbiAgICogQGRlZmF1bHQgLSBBdXRvIGdlbmVyYXRlZCBieSBDbG91ZEZvcm1hdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgYXV0b1NjYWxpbmdHcm91cE5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgcG9saWN5IG9yIGEgbGlzdCBvZiBwb2xpY2llcyB0aGF0IGFyZSB1c2VkIHRvIHNlbGVjdCB0aGUgaW5zdGFuY2VzIHRvXG4gICAqIHRlcm1pbmF0ZS4gVGhlIHBvbGljaWVzIGFyZSBleGVjdXRlZCBpbiB0aGUgb3JkZXIgdGhhdCB5b3UgbGlzdCB0aGVtLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hdXRvc2NhbGluZy9lYzIvdXNlcmd1aWRlL2FzLWluc3RhbmNlLXRlcm1pbmF0aW9uLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBgVGVybWluYXRpb25Qb2xpY3kuREVGQVVMVGBcbiAgICovXG4gIHJlYWRvbmx5IHRlcm1pbmF0aW9uUG9saWNpZXM/OiBUZXJtaW5hdGlvblBvbGljeVtdO1xuXG4gIC8qKlxuICAgKiBUaGUgYW1vdW50IG9mIHRpbWUsIGluIHNlY29uZHMsIHVudGlsIGEgbmV3bHkgbGF1bmNoZWQgaW5zdGFuY2UgY2FuIGNvbnRyaWJ1dGUgdG8gdGhlIEFtYXpvbiBDbG91ZFdhdGNoIG1ldHJpY3MuXG4gICAqIFRoaXMgZGVsYXkgbGV0cyBhbiBpbnN0YW5jZSBmaW5pc2ggaW5pdGlhbGl6aW5nIGJlZm9yZSBBbWF6b24gRUMyIEF1dG8gU2NhbGluZyBhZ2dyZWdhdGVzIGluc3RhbmNlIG1ldHJpY3MsXG4gICAqIHJlc3VsdGluZyBpbiBtb3JlIHJlbGlhYmxlIHVzYWdlIGRhdGEuIFNldCB0aGlzIHZhbHVlIGVxdWFsIHRvIHRoZSBhbW91bnQgb2YgdGltZSB0aGF0IGl0IHRha2VzIGZvciByZXNvdXJjZVxuICAgKiBjb25zdW1wdGlvbiB0byBiZWNvbWUgc3RhYmxlIGFmdGVyIGFuIGluc3RhbmNlIHJlYWNoZXMgdGhlIEluU2VydmljZSBzdGF0ZS5cbiAgICpcbiAgICogVG8gb3B0aW1pemUgdGhlIHBlcmZvcm1hbmNlIG9mIHNjYWxpbmcgcG9saWNpZXMgdGhhdCBzY2FsZSBjb250aW51b3VzbHksIHN1Y2ggYXMgdGFyZ2V0IHRyYWNraW5nIGFuZFxuICAgKiBzdGVwIHNjYWxpbmcgcG9saWNpZXMsIHdlIHN0cm9uZ2x5IHJlY29tbWVuZCB0aGF0IHlvdSBlbmFibGUgdGhlIGRlZmF1bHQgaW5zdGFuY2Ugd2FybXVwLCBldmVuIGlmIGl0cyB2YWx1ZSBpcyBzZXQgdG8gMCBzZWNvbmRzXG4gICAqXG4gICAqIERlZmF1bHQgaW5zdGFuY2Ugd2FybXVwIHdpbGwgbm90IGJlIGFkZGVkIGlmIG5vIHZhbHVlIGlzIHNwZWNpZmllZFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hdXRvc2NhbGluZy9lYzIvdXNlcmd1aWRlL2VjMi1hdXRvLXNjYWxpbmctZGVmYXVsdC1pbnN0YW5jZS13YXJtdXAuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCBOb25lXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0SW5zdGFuY2VXYXJtdXA/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgQ2FwYWNpdHkgUmViYWxhbmNpbmcgaXMgZW5hYmxlZC4gV2hlbiB5b3UgdHVybiBvbiBDYXBhY2l0eSBSZWJhbGFuY2luZywgQW1hem9uIEVDMiBBdXRvIFNjYWxpbmdcbiAgICogYXR0ZW1wdHMgdG8gbGF1bmNoIGEgU3BvdCBJbnN0YW5jZSB3aGVuZXZlciBBbWF6b24gRUMyIG5vdGlmaWVzIHRoYXQgYSBTcG90IEluc3RhbmNlIGlzIGF0IGFuIGVsZXZhdGVkIHJpc2sgb2ZcbiAgICogaW50ZXJydXB0aW9uLiBBZnRlciBsYXVuY2hpbmcgYSBuZXcgaW5zdGFuY2UsIGl0IHRoZW4gdGVybWluYXRlcyBhbiBvbGQgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtYXMtZ3JvdXAuaHRtbCNjZm4tYXMtZ3JvdXAtY2FwYWNpdHlyZWJhbGFuY2VcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICpcbiAgICovXG4gIHJlYWRvbmx5IGNhcGFjaXR5UmViYWxhbmNlPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBNaXhlZEluc3RhbmNlc1BvbGljeSBhbGxvd3MgeW91IHRvIGNvbmZpZ3VyZSBhIGdyb3VwIHRoYXQgZGl2ZXJzaWZpZXMgYWNyb3NzIE9uLURlbWFuZCBJbnN0YW5jZXNcbiAqIGFuZCBTcG90IEluc3RhbmNlcyBvZiBtdWx0aXBsZSBpbnN0YW5jZSB0eXBlcy4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBBdXRvIFNjYWxpbmcgZ3JvdXBzIHdpdGhcbiAqIG11bHRpcGxlIGluc3RhbmNlIHR5cGVzIGFuZCBwdXJjaGFzZSBvcHRpb25zIGluIHRoZSBBbWF6b24gRUMyIEF1dG8gU2NhbGluZyBVc2VyIEd1aWRlOlxuICpcbiAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hdXRvc2NhbGluZy9lYzIvdXNlcmd1aWRlL2FzZy1wdXJjaGFzZS1vcHRpb25zLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNaXhlZEluc3RhbmNlc1BvbGljeSB7XG4gIC8qKlxuICAgKiBJbnN0YW5jZXNEaXN0cmlidXRpb24gdG8gdXNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSB2YWx1ZSBmb3IgZWFjaCBwcm9wZXJ0eSBpbiBpdCB1c2VzIGEgZGVmYXVsdCB2YWx1ZS5cbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlc0Rpc3RyaWJ1dGlvbj86IEluc3RhbmNlc0Rpc3RyaWJ1dGlvbjtcblxuICAvKipcbiAgICogTGF1bmNoIHRlbXBsYXRlIHRvIHVzZS5cbiAgICovXG4gIHJlYWRvbmx5IGxhdW5jaFRlbXBsYXRlOiBlYzIuSUxhdW5jaFRlbXBsYXRlO1xuXG4gIC8qKlxuICAgKiBMYXVuY2ggdGVtcGxhdGUgb3ZlcnJpZGVzLlxuICAgKlxuICAgKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgaW5zdGFuY2UgdHlwZXMgdGhhdCBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGFuIEF1dG8gU2NhbGluZyBncm91cCBpcyA0MC5cbiAgICpcbiAgICogVGhlIG1heGltdW0gbnVtYmVyIG9mIGRpc3RpbmN0IGxhdW5jaCB0ZW1wbGF0ZXMgeW91IGNhbiBkZWZpbmUgZm9yIGFuIEF1dG8gU2NhbGluZyBncm91cCBpcyAyMC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBEbyBub3QgcHJvdmlkZSBhbnkgb3ZlcnJpZGVzXG4gICAqL1xuICByZWFkb25seSBsYXVuY2hUZW1wbGF0ZU92ZXJyaWRlcz86IExhdW5jaFRlbXBsYXRlT3ZlcnJpZGVzW107XG59XG5cbi8qKlxuICogSW5kaWNhdGVzIGhvdyB0byBhbGxvY2F0ZSBpbnN0YW5jZSB0eXBlcyB0byBmdWxmaWxsIE9uLURlbWFuZCBjYXBhY2l0eS5cbiAqL1xuZXhwb3J0IGVudW0gT25EZW1hbmRBbGxvY2F0aW9uU3RyYXRlZ3kge1xuICAvKipcbiAgICogVGhpcyBzdHJhdGVneSB1c2VzIHRoZSBvcmRlciBvZiBpbnN0YW5jZSB0eXBlcyBpbiB0aGUgTGF1bmNoVGVtcGxhdGVPdmVycmlkZXMgdG8gZGVmaW5lIHRoZSBsYXVuY2hcbiAgICogcHJpb3JpdHkgb2YgZWFjaCBpbnN0YW5jZSB0eXBlLiBUaGUgZmlyc3QgaW5zdGFuY2UgdHlwZSBpbiB0aGUgYXJyYXkgaXMgcHJpb3JpdGl6ZWQgaGlnaGVyIHRoYW4gdGhlXG4gICAqIGxhc3QuIElmIGFsbCB5b3VyIE9uLURlbWFuZCBjYXBhY2l0eSBjYW5ub3QgYmUgZnVsZmlsbGVkIHVzaW5nIHlvdXIgaGlnaGVzdCBwcmlvcml0eSBpbnN0YW5jZSwgdGhlblxuICAgKiB0aGUgQXV0byBTY2FsaW5nIGdyb3VwIGxhdW5jaGVzIHRoZSByZW1haW5pbmcgY2FwYWNpdHkgdXNpbmcgdGhlIHNlY29uZCBwcmlvcml0eSBpbnN0YW5jZSB0eXBlLCBhbmRcbiAgICogc28gb24uXG4gICAqL1xuICBQUklPUklUSVpFRCA9ICdwcmlvcml0aXplZCcsXG59XG5cbi8qKlxuICogSW5kaWNhdGVzIGhvdyB0byBhbGxvY2F0ZSBpbnN0YW5jZSB0eXBlcyB0byBmdWxmaWxsIFNwb3QgY2FwYWNpdHkuXG4gKi9cbmV4cG9ydCBlbnVtIFNwb3RBbGxvY2F0aW9uU3RyYXRlZ3kge1xuICAvKipcbiAgICogVGhlIEF1dG8gU2NhbGluZyBncm91cCBsYXVuY2hlcyBpbnN0YW5jZXMgdXNpbmcgdGhlIFNwb3QgcG9vbHMgd2l0aCB0aGUgbG93ZXN0IHByaWNlLCBhbmQgZXZlbmx5XG4gICAqIGFsbG9jYXRlcyB5b3VyIGluc3RhbmNlcyBhY3Jvc3MgdGhlIG51bWJlciBvZiBTcG90IHBvb2xzIHRoYXQgeW91IHNwZWNpZnkuXG4gICAqL1xuICBMT1dFU1RfUFJJQ0UgPSAnbG93ZXN0LXByaWNlJyxcblxuICAvKipcbiAgICogVGhlIEF1dG8gU2NhbGluZyBncm91cCBsYXVuY2hlcyBpbnN0YW5jZXMgdXNpbmcgU3BvdCBwb29scyB0aGF0IGFyZSBvcHRpbWFsbHkgY2hvc2VuIGJhc2VkIG9uIHRoZVxuICAgKiBhdmFpbGFibGUgU3BvdCBjYXBhY2l0eS5cbiAgICpcbiAgICogUmVjb21tZW5kZWQuXG4gICAqL1xuICBDQVBBQ0lUWV9PUFRJTUlaRUQgPSAnY2FwYWNpdHktb3B0aW1pemVkJyxcblxuICAvKipcbiAgICogV2hlbiB5b3UgdXNlIHRoaXMgc3RyYXRlZ3ksIHlvdSBuZWVkIHRvIHNldCB0aGUgb3JkZXIgb2YgaW5zdGFuY2UgdHlwZXMgaW4gdGhlIGxpc3Qgb2YgbGF1bmNoIHRlbXBsYXRlXG4gICAqIG92ZXJyaWRlcyBmcm9tIGhpZ2hlc3QgdG8gbG93ZXN0IHByaW9yaXR5IChmcm9tIGZpcnN0IHRvIGxhc3QgaW4gdGhlIGxpc3QpLiBBbWF6b24gRUMyIEF1dG8gU2NhbGluZ1xuICAgKiBob25vcnMgdGhlIGluc3RhbmNlIHR5cGUgcHJpb3JpdGllcyBvbiBhIGJlc3QtZWZmb3J0IGJhc2lzIGJ1dCBvcHRpbWl6ZXMgZm9yIGNhcGFjaXR5IGZpcnN0LlxuICAgKi9cbiAgQ0FQQUNJVFlfT1BUSU1JWkVEX1BSSU9SSVRJWkVEID0gJ2NhcGFjaXR5LW9wdGltaXplZC1wcmlvcml0aXplZCcsXG5cbiAgLyoqXG4gICAqIFRoZSBwcmljZSBhbmQgY2FwYWNpdHkgb3B0aW1pemVkIGFsbG9jYXRpb24gc3RyYXRlZ3kgbG9va3MgYXQgYm90aCBwcmljZSBhbmRcbiAgICogY2FwYWNpdHkgdG8gc2VsZWN0IHRoZSBTcG90IEluc3RhbmNlIHBvb2xzIHRoYXQgYXJlIHRoZSBsZWFzdCBsaWtlbHkgdG8gYmVcbiAgICogaW50ZXJydXB0ZWQgYW5kIGhhdmUgdGhlIGxvd2VzdCBwb3NzaWJsZSBwcmljZS5cbiAgICovXG4gIFBSSUNFX0NBUEFDSVRZX09QVElNSVpFRCA9ICdwcmljZS1jYXBhY2l0eS1vcHRpbWl6ZWQnLFxufVxuXG4vKipcbiAqIEluc3RhbmNlc0Rpc3RyaWJ1dGlvbiBpcyBhIHN1YnByb3BlcnR5IG9mIE1peGVkSW5zdGFuY2VzUG9saWN5IHRoYXQgZGVzY3JpYmVzIGFuIGluc3RhbmNlcyBkaXN0cmlidXRpb25cbiAqIGZvciBhbiBBdXRvIFNjYWxpbmcgZ3JvdXAuIFRoZSBpbnN0YW5jZXMgZGlzdHJpYnV0aW9uIHNwZWNpZmllcyB0aGUgZGlzdHJpYnV0aW9uIG9mIE9uLURlbWFuZCBJbnN0YW5jZXNcbiAqIGFuZCBTcG90IEluc3RhbmNlcywgdGhlIG1heGltdW0gcHJpY2UgdG8gcGF5IGZvciBTcG90IEluc3RhbmNlcywgYW5kIGhvdyB0aGUgQXV0byBTY2FsaW5nIGdyb3VwIGFsbG9jYXRlc1xuICogaW5zdGFuY2UgdHlwZXMgdG8gZnVsZmlsbCBPbi1EZW1hbmQgYW5kIFNwb3QgY2FwYWNpdGllcy5cbiAqXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhbmQgZXhhbXBsZSBjb25maWd1cmF0aW9ucywgc2VlIEF1dG8gU2NhbGluZyBncm91cHMgd2l0aCBtdWx0aXBsZSBpbnN0YW5jZSB0eXBlc1xuICogYW5kIHB1cmNoYXNlIG9wdGlvbnMgaW4gdGhlIEFtYXpvbiBFQzIgQXV0byBTY2FsaW5nIFVzZXIgR3VpZGU6XG4gKlxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2F1dG9zY2FsaW5nL2VjMi91c2VyZ3VpZGUvYXNnLXB1cmNoYXNlLW9wdGlvbnMuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEluc3RhbmNlc0Rpc3RyaWJ1dGlvbiB7XG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaG93IHRvIGFsbG9jYXRlIGluc3RhbmNlIHR5cGVzIHRvIGZ1bGZpbGwgT24tRGVtYW5kIGNhcGFjaXR5LiBUaGUgb25seSB2YWxpZCB2YWx1ZSBpcyBwcmlvcml0aXplZCxcbiAgICogd2hpY2ggaXMgYWxzbyB0aGUgZGVmYXVsdCB2YWx1ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgT25EZW1hbmRBbGxvY2F0aW9uU3RyYXRlZ3kuUFJJT1JJVElaRURcbiAgICovXG4gIHJlYWRvbmx5IG9uRGVtYW5kQWxsb2NhdGlvblN0cmF0ZWd5PzogT25EZW1hbmRBbGxvY2F0aW9uU3RyYXRlZ3ksXG5cbiAgLyoqXG4gICAqIFRoZSBtaW5pbXVtIGFtb3VudCBvZiB0aGUgQXV0byBTY2FsaW5nIGdyb3VwJ3MgY2FwYWNpdHkgdGhhdCBtdXN0IGJlIGZ1bGZpbGxlZCBieSBPbi1EZW1hbmQgSW5zdGFuY2VzLiBUaGlzXG4gICAqIGJhc2UgcG9ydGlvbiBpcyBwcm92aXNpb25lZCBmaXJzdCBhcyB5b3VyIGdyb3VwIHNjYWxlcy4gRGVmYXVsdHMgdG8gMCBpZiBub3Qgc3BlY2lmaWVkLiBJZiB5b3Ugc3BlY2lmeSB3ZWlnaHRzXG4gICAqIGZvciB0aGUgaW5zdGFuY2UgdHlwZXMgaW4gdGhlIG92ZXJyaWRlcywgc2V0IHRoZSB2YWx1ZSBvZiBPbkRlbWFuZEJhc2VDYXBhY2l0eSBpbiB0ZXJtcyBvZiB0aGUgbnVtYmVyIG9mXG4gICAqIGNhcGFjaXR5IHVuaXRzLCBhbmQgbm90IHRoZSBudW1iZXIgb2YgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAwXG4gICAqL1xuICByZWFkb25seSBvbkRlbWFuZEJhc2VDYXBhY2l0eT86IG51bWJlcixcblxuICAvKipcbiAgICogQ29udHJvbHMgdGhlIHBlcmNlbnRhZ2VzIG9mIE9uLURlbWFuZCBJbnN0YW5jZXMgYW5kIFNwb3QgSW5zdGFuY2VzIGZvciB5b3VyIGFkZGl0aW9uYWwgY2FwYWNpdHkgYmV5b25kXG4gICAqIE9uRGVtYW5kQmFzZUNhcGFjaXR5LiBFeHByZXNzZWQgYXMgYSBudW1iZXIgKGZvciBleGFtcGxlLCAyMCBzcGVjaWZpZXMgMjAlIE9uLURlbWFuZCBJbnN0YW5jZXMsIDgwJSBTcG90IEluc3RhbmNlcykuXG4gICAqIERlZmF1bHRzIHRvIDEwMCBpZiBub3Qgc3BlY2lmaWVkLiBJZiBzZXQgdG8gMTAwLCBvbmx5IE9uLURlbWFuZCBJbnN0YW5jZXMgYXJlIHByb3Zpc2lvbmVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAxMDBcbiAgICovXG4gIHJlYWRvbmx5IG9uRGVtYW5kUGVyY2VudGFnZUFib3ZlQmFzZUNhcGFjaXR5PzogbnVtYmVyLFxuXG4gIC8qKlxuICAgKiBJZiB0aGUgYWxsb2NhdGlvbiBzdHJhdGVneSBpcyBsb3dlc3QtcHJpY2UsIHRoZSBBdXRvIFNjYWxpbmcgZ3JvdXAgbGF1bmNoZXMgaW5zdGFuY2VzIHVzaW5nIHRoZSBTcG90IHBvb2xzIHdpdGggdGhlXG4gICAqIGxvd2VzdCBwcmljZSwgYW5kIGV2ZW5seSBhbGxvY2F0ZXMgeW91ciBpbnN0YW5jZXMgYWNyb3NzIHRoZSBudW1iZXIgb2YgU3BvdCBwb29scyB0aGF0IHlvdSBzcGVjaWZ5LiBEZWZhdWx0cyB0b1xuICAgKiBsb3dlc3QtcHJpY2UgaWYgbm90IHNwZWNpZmllZC5cbiAgICpcbiAgICogSWYgdGhlIGFsbG9jYXRpb24gc3RyYXRlZ3kgaXMgY2FwYWNpdHktb3B0aW1pemVkIChyZWNvbW1lbmRlZCksIHRoZSBBdXRvIFNjYWxpbmcgZ3JvdXAgbGF1bmNoZXMgaW5zdGFuY2VzIHVzaW5nIFNwb3RcbiAgICogcG9vbHMgdGhhdCBhcmUgb3B0aW1hbGx5IGNob3NlbiBiYXNlZCBvbiB0aGUgYXZhaWxhYmxlIFNwb3QgY2FwYWNpdHkuIEFsdGVybmF0aXZlbHksIHlvdSBjYW4gdXNlIGNhcGFjaXR5LW9wdGltaXplZC1wcmlvcml0aXplZFxuICAgKiBhbmQgc2V0IHRoZSBvcmRlciBvZiBpbnN0YW5jZSB0eXBlcyBpbiB0aGUgbGlzdCBvZiBsYXVuY2ggdGVtcGxhdGUgb3ZlcnJpZGVzIGZyb20gaGlnaGVzdCB0byBsb3dlc3QgcHJpb3JpdHlcbiAgICogKGZyb20gZmlyc3QgdG8gbGFzdCBpbiB0aGUgbGlzdCkuIEFtYXpvbiBFQzIgQXV0byBTY2FsaW5nIGhvbm9ycyB0aGUgaW5zdGFuY2UgdHlwZSBwcmlvcml0aWVzIG9uIGEgYmVzdC1lZmZvcnQgYmFzaXMgYnV0XG4gICAqIG9wdGltaXplcyBmb3IgY2FwYWNpdHkgZmlyc3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IFNwb3RBbGxvY2F0aW9uU3RyYXRlZ3kuTE9XRVNUX1BSSUNFXG4gICAqL1xuICByZWFkb25seSBzcG90QWxsb2NhdGlvblN0cmF0ZWd5PzogU3BvdEFsbG9jYXRpb25TdHJhdGVneSxcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBTcG90IEluc3RhbmNlIHBvb2xzIHRvIHVzZSB0byBhbGxvY2F0ZSB5b3VyIFNwb3QgY2FwYWNpdHkuIFRoZSBTcG90IHBvb2xzIGFyZSBkZXRlcm1pbmVkIGZyb20gdGhlIGRpZmZlcmVudCBpbnN0YW5jZVxuICAgKiB0eXBlcyBpbiB0aGUgb3ZlcnJpZGVzLiBWYWxpZCBvbmx5IHdoZW4gdGhlIFNwb3QgYWxsb2NhdGlvbiBzdHJhdGVneSBpcyBsb3dlc3QtcHJpY2UuIFZhbHVlIG11c3QgYmUgaW4gdGhlIHJhbmdlIG9mIDEgdG8gMjAuXG4gICAqIERlZmF1bHRzIHRvIDIgaWYgbm90IHNwZWNpZmllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgMlxuICAgKi9cbiAgcmVhZG9ubHkgc3BvdEluc3RhbmNlUG9vbHM/OiBudW1iZXIsXG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIHByaWNlIHBlciB1bml0IGhvdXIgdGhhdCB5b3UgYXJlIHdpbGxpbmcgdG8gcGF5IGZvciBhIFNwb3QgSW5zdGFuY2UuIElmIHlvdSBsZWF2ZSB0aGUgdmFsdWUgYXQgaXRzIGRlZmF1bHQgKGVtcHR5KSxcbiAgICogQW1hem9uIEVDMiBBdXRvIFNjYWxpbmcgdXNlcyB0aGUgT24tRGVtYW5kIHByaWNlIGFzIHRoZSBtYXhpbXVtIFNwb3QgcHJpY2UuIFRvIHJlbW92ZSBhIHZhbHVlIHRoYXQgeW91IHByZXZpb3VzbHkgc2V0LCBpbmNsdWRlXG4gICAqIHRoZSBwcm9wZXJ0eSBidXQgc3BlY2lmeSBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGZvciB0aGUgdmFsdWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IFwiXCIgLSBPbi1EZW1hbmQgcHJpY2VcbiAgICovXG4gIHJlYWRvbmx5IHNwb3RNYXhQcmljZT86IHN0cmluZ1xufVxuXG4vKipcbiAqIExhdW5jaFRlbXBsYXRlT3ZlcnJpZGVzIGlzIGEgc3VicHJvcGVydHkgb2YgTGF1bmNoVGVtcGxhdGUgdGhhdCBkZXNjcmliZXMgYW4gb3ZlcnJpZGUgZm9yIGEgbGF1bmNoIHRlbXBsYXRlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIExhdW5jaFRlbXBsYXRlT3ZlcnJpZGVzIHtcbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSB0eXBlLCBzdWNoIGFzIG0zLnhsYXJnZS4gWW91IG11c3QgdXNlIGFuIGluc3RhbmNlIHR5cGUgdGhhdCBpcyBzdXBwb3J0ZWQgaW4geW91ciByZXF1ZXN0ZWQgUmVnaW9uXG4gICAqIGFuZCBBdmFpbGFiaWxpdHkgWm9uZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRG8gbm90IG92ZXJyaWRlIGluc3RhbmNlIHR5cGVcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZSxcblxuICAvKipcbiAgICogUHJvdmlkZXMgdGhlIGxhdW5jaCB0ZW1wbGF0ZSB0byBiZSB1c2VkIHdoZW4gbGF1bmNoaW5nIHRoZSBpbnN0YW5jZSB0eXBlLiBGb3IgZXhhbXBsZSwgc29tZSBpbnN0YW5jZSB0eXBlcyBtaWdodFxuICAgKiByZXF1aXJlIGEgbGF1bmNoIHRlbXBsYXRlIHdpdGggYSBkaWZmZXJlbnQgQU1JLiBJZiBub3QgcHJvdmlkZWQsIEFtYXpvbiBFQzIgQXV0byBTY2FsaW5nIHVzZXMgdGhlIGxhdW5jaCB0ZW1wbGF0ZVxuICAgKiB0aGF0J3MgZGVmaW5lZCBmb3IgeW91ciBtaXhlZCBpbnN0YW5jZXMgcG9saWN5LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERvIG5vdCBvdmVycmlkZSBsYXVuY2ggdGVtcGxhdGVcbiAgICovXG4gIHJlYWRvbmx5IGxhdW5jaFRlbXBsYXRlPzogZWMyLklMYXVuY2hUZW1wbGF0ZSxcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBjYXBhY2l0eSB1bml0cyBwcm92aWRlZCBieSB0aGUgc3BlY2lmaWVkIGluc3RhbmNlIHR5cGUgaW4gdGVybXMgb2YgdmlydHVhbCBDUFVzLCBtZW1vcnksIHN0b3JhZ2UsXG4gICAqIHRocm91Z2hwdXQsIG9yIG90aGVyIHJlbGF0aXZlIHBlcmZvcm1hbmNlIGNoYXJhY3RlcmlzdGljLiBXaGVuIGEgU3BvdCBvciBPbi1EZW1hbmQgSW5zdGFuY2UgaXMgcHJvdmlzaW9uZWQsIHRoZVxuICAgKiBjYXBhY2l0eSB1bml0cyBjb3VudCB0b3dhcmQgdGhlIGRlc2lyZWQgY2FwYWNpdHkuIEFtYXpvbiBFQzIgQXV0byBTY2FsaW5nIHByb3Zpc2lvbnMgaW5zdGFuY2VzIHVudGlsIHRoZSBkZXNpcmVkXG4gICAqIGNhcGFjaXR5IGlzIHRvdGFsbHkgZnVsZmlsbGVkLCBldmVuIGlmIHRoaXMgcmVzdWx0cyBpbiBhbiBvdmVyYWdlLiBWYWx1ZSBtdXN0IGJlIGluIHRoZSByYW5nZSBvZiAxIHRvIDk5OS5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIElmIHRoZXJlIGFyZSAyIHVuaXRzIHJlbWFpbmluZyB0byBmdWxmaWxsIGNhcGFjaXR5LCBhbmQgQW1hem9uIEVDMiBBdXRvIFNjYWxpbmcgY2FuIG9ubHkgcHJvdmlzaW9uXG4gICAqIGFuIGluc3RhbmNlIHdpdGggYSBXZWlnaHRlZENhcGFjaXR5IG9mIDUgdW5pdHMsIHRoZSBpbnN0YW5jZSBpcyBwcm92aXNpb25lZCwgYW5kIHRoZSBkZXNpcmVkIGNhcGFjaXR5IGlzIGV4Y2VlZGVkXG4gICAqIGJ5IDMgdW5pdHMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2F1dG9zY2FsaW5nL2VjMi91c2VyZ3VpZGUvYXNnLWluc3RhbmNlLXdlaWdodGluZy5odG1sXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRG8gbm90IHByb3ZpZGUgd2VpZ2h0XG4gICAqL1xuICByZWFkb25seSB3ZWlnaHRlZENhcGFjaXR5PzogbnVtYmVyXG59XG5cbi8qKlxuICogUHJvcGVydGllcyBvZiBhIEZsZWV0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXV0b1NjYWxpbmdHcm91cFByb3BzIGV4dGVuZHMgQ29tbW9uQXV0b1NjYWxpbmdHcm91cFByb3BzIHtcbiAgLyoqXG4gICAqIFZQQyB0byBsYXVuY2ggdGhlc2UgaW5zdGFuY2VzIGluLlxuICAgKi9cbiAgcmVhZG9ubHkgdnBjOiBlYzIuSVZwYztcblxuICAvKipcbiAgICogTGF1bmNoIHRlbXBsYXRlIHRvIHVzZS5cbiAgICpcbiAgICogTGF1bmNoIGNvbmZpZ3VyYXRpb24gcmVsYXRlZCBzZXR0aW5ncyBhbmQgTWl4ZWRJbnN0YW5jZXNQb2xpY3kgbXVzdCBub3QgYmUgc3BlY2lmaWVkIHdoZW4gYVxuICAgKiBsYXVuY2ggdGVtcGxhdGUgaXMgc3BlY2lmaWVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERvIG5vdCBwcm92aWRlIGFueSBsYXVuY2ggdGVtcGxhdGVcbiAgICovXG4gIHJlYWRvbmx5IGxhdW5jaFRlbXBsYXRlPzogZWMyLklMYXVuY2hUZW1wbGF0ZTtcblxuICAvKipcbiAgICogTWl4ZWQgSW5zdGFuY2VzIFBvbGljeSB0byB1c2UuXG4gICAqXG4gICAqIExhdW5jaCBjb25maWd1cmF0aW9uIHJlbGF0ZWQgc2V0dGluZ3MgYW5kIExhdW5jaCBUZW1wbGF0ZSAgbXVzdCBub3QgYmUgc3BlY2lmaWVkIHdoZW4gYVxuICAgKiBNaXhlZEluc3RhbmNlc1BvbGljeSBpcyBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRG8gbm90IHByb3ZpZGUgYW55IE1peGVkSW5zdGFuY2VzUG9saWN5XG4gICAqL1xuICByZWFkb25seSBtaXhlZEluc3RhbmNlc1BvbGljeT86IE1peGVkSW5zdGFuY2VzUG9saWN5O1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIGluc3RhbmNlIHRvIGxhdW5jaFxuICAgKlxuICAgKiBgbGF1bmNoVGVtcGxhdGVgIGFuZCBgbWl4ZWRJbnN0YW5jZXNQb2xpY3lgIG11c3Qgbm90IGJlIHNwZWNpZmllZCB3aGVuIHRoaXMgcHJvcGVydHkgaXMgc3BlY2lmaWVkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRG8gbm90IHByb3ZpZGUgYW55IGluc3RhbmNlIHR5cGVcbiAgICovXG4gIHJlYWRvbmx5IGluc3RhbmNlVHlwZT86IGVjMi5JbnN0YW5jZVR5cGU7XG5cbiAgLyoqXG4gICAqIEFNSSB0byBsYXVuY2hcbiAgICpcbiAgICogYGxhdW5jaFRlbXBsYXRlYCBhbmQgYG1peGVkSW5zdGFuY2VzUG9saWN5YCBtdXN0IG5vdCBiZSBzcGVjaWZpZWQgd2hlbiB0aGlzIHByb3BlcnR5IGlzIHNwZWNpZmllZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERvIG5vdCBwcm92aWRlIGFueSBtYWNoaW5lIGltYWdlXG4gICAqL1xuICByZWFkb25seSBtYWNoaW5lSW1hZ2U/OiBlYzIuSU1hY2hpbmVJbWFnZTtcblxuICAvKipcbiAgICogU2VjdXJpdHkgZ3JvdXAgdG8gbGF1bmNoIHRoZSBpbnN0YW5jZXMgaW4uXG4gICAqXG4gICAqIGBsYXVuY2hUZW1wbGF0ZWAgYW5kIGBtaXhlZEluc3RhbmNlc1BvbGljeWAgbXVzdCBub3QgYmUgc3BlY2lmaWVkIHdoZW4gdGhpcyBwcm9wZXJ0eSBpcyBzcGVjaWZpZWRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIFNlY3VyaXR5R3JvdXAgd2lsbCBiZSBjcmVhdGVkIGlmIG5vbmUgaXMgc3BlY2lmaWVkLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cD86IGVjMi5JU2VjdXJpdHlHcm91cDtcblxuICAvKipcbiAgICogU3BlY2lmaWMgVXNlckRhdGEgdG8gdXNlXG4gICAqXG4gICAqIFRoZSBVc2VyRGF0YSBtYXkgc3RpbGwgYmUgbXV0YXRlZCBhZnRlciBjcmVhdGlvbi5cbiAgICpcbiAgICogYGxhdW5jaFRlbXBsYXRlYCBhbmQgYG1peGVkSW5zdGFuY2VzUG9saWN5YCBtdXN0IG5vdCBiZSBzcGVjaWZpZWQgd2hlbiB0aGlzIHByb3BlcnR5IGlzIHNwZWNpZmllZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgVXNlckRhdGEgb2JqZWN0IGFwcHJvcHJpYXRlIGZvciB0aGUgTWFjaGluZUltYWdlJ3NcbiAgICogT3BlcmF0aW5nIFN5c3RlbSBpcyBjcmVhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgdXNlckRhdGE/OiBlYzIuVXNlckRhdGE7XG5cbiAgLyoqXG4gICAqIEFuIElBTSByb2xlIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBpbnN0YW5jZSBwcm9maWxlIGFzc2lnbmVkIHRvIHRoaXMgQXV0byBTY2FsaW5nIEdyb3VwLlxuICAgKlxuICAgKiBUaGUgcm9sZSBtdXN0IGJlIGFzc3VtYWJsZSBieSB0aGUgc2VydmljZSBwcmluY2lwYWwgYGVjMi5hbWF6b25hd3MuY29tYDpcbiAgICpcbiAgICogYGxhdW5jaFRlbXBsYXRlYCBhbmQgYG1peGVkSW5zdGFuY2VzUG9saWN5YCBtdXN0IG5vdCBiZSBzcGVjaWZpZWQgd2hlbiB0aGlzIHByb3BlcnR5IGlzIHNwZWNpZmllZFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdNeVJvbGUnLCB7XG4gICAqICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VjMi5hbWF6b25hd3MuY29tJylcbiAgICogICAgfSk7XG4gICAqXG4gICAqIEBkZWZhdWx0IEEgcm9sZSB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgY3JlYXRlZCwgaXQgY2FuIGJlIGFjY2Vzc2VkIHZpYSB0aGUgYHJvbGVgIHByb3BlcnR5XG4gICAqL1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBBcHBseSB0aGUgZ2l2ZW4gQ2xvdWRGb3JtYXRpb24gSW5pdCBjb25maWd1cmF0aW9uIHRvIHRoZSBpbnN0YW5jZXMgaW4gdGhlIEF1dG9TY2FsaW5nR3JvdXAgYXQgc3RhcnR1cFxuICAgKlxuICAgKiBJZiB5b3Ugc3BlY2lmeSBgaW5pdGAsIHlvdSBtdXN0IGFsc28gc3BlY2lmeSBgc2lnbmFsc2AgdG8gY29uZmlndXJlXG4gICAqIHRoZSBudW1iZXIgb2YgaW5zdGFuY2VzIHRvIHdhaXQgZm9yIGFuZCB0aGUgdGltZW91dCBmb3Igd2FpdGluZyBmb3IgdGhlXG4gICAqIGluaXQgcHJvY2Vzcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBDbG91ZEZvcm1hdGlvbiBpbml0XG4gICAqL1xuICByZWFkb25seSBpbml0PzogZWMyLkNsb3VkRm9ybWF0aW9uSW5pdDtcblxuICAvKipcbiAgICogVXNlIHRoZSBnaXZlbiBvcHRpb25zIGZvciBhcHBseWluZyBDbG91ZEZvcm1hdGlvbiBJbml0XG4gICAqXG4gICAqIERlc2NyaWJlcyB0aGUgY29uZmlnc2V0cyB0byB1c2UgYW5kIHRoZSB0aW1lb3V0IHRvIHdhaXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBkZWZhdWx0IG9wdGlvbnNcbiAgICovXG4gIHJlYWRvbmx5IGluaXRPcHRpb25zPzogQXBwbHlDbG91ZEZvcm1hdGlvbkluaXRPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIElNRFN2MiBzaG91bGQgYmUgcmVxdWlyZWQgb24gbGF1bmNoZWQgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVxdWlyZUltZHN2Mj86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQ29uZmlndXJlIHdoZXRoZXIgdGhlIEF1dG9TY2FsaW5nR3JvdXAgd2FpdHMgZm9yIHNpZ25hbHNcbiAqXG4gKiBJZiB5b3UgZG8gY29uZmlndXJlIHdhaXRpbmcgZm9yIHNpZ25hbHMsIHlvdSBzaG91bGQgbWFrZSBzdXJlIHRoZSBpbnN0YW5jZXNcbiAqIGludm9rZSBgY2ZuLXNpZ25hbGAgc29tZXdoZXJlIGluIHRoZWlyIFVzZXJEYXRhIHRvIHNpZ25hbCB0aGF0IHRoZXkgaGF2ZVxuICogc3RhcnRlZCB1cCAoZWl0aGVyIHN1Y2Nlc3NmdWxseSBvciB1bnN1Y2Nlc3NmdWxseSkuXG4gKlxuICogU2lnbmFscyBhcmUgdXNlZCBib3RoIGR1cmluZyBpbnRpYWwgY3JlYXRpb24gYW5kIHN1YnNlcXVlbnQgdXBkYXRlcy5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNpZ25hbHMge1xuICAvKipcbiAgICogV2FpdCBmb3IgdGhlIGRlc2lyZWRDYXBhY2l0eSBvZiB0aGUgQXV0b1NjYWxpbmdHcm91cCBhbW91bnQgb2Ygc2lnbmFscyB0byBoYXZlIGJlZW4gcmVjZWl2ZWRcbiAgICpcbiAgICogSWYgbm8gZGVzaXJlZENhcGFjaXR5IGhhcyBiZWVuIGNvbmZpZ3VyZWQsIHdhaXQgZm9yIG1pbkNhcGFjaXR5IHNpZ25hbHMgaW50ZWFkLlxuICAgKlxuICAgKiBUaGlzIG51bWJlciBpcyB1c2VkIGR1cmluZyBpbml0aWFsIGNyZWF0aW9uIGFuZCBkdXJpbmcgcmVwbGFjaW5nIHVwZGF0ZXMuXG4gICAqIER1cmluZyByb2xsaW5nIHVwZGF0ZXMsIGFsbCB1cGRhdGVkIGluc3RhbmNlcyBtdXN0IHNlbmQgYSBzaWduYWwuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHdhaXRGb3JBbGwob3B0aW9uczogU2lnbmFsc09wdGlvbnMgPSB7fSk6IFNpZ25hbHMge1xuICAgIHZhbGlkYXRlUGVyY2VudGFnZShvcHRpb25zLm1pblN1Y2Nlc3NQZXJjZW50YWdlKTtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgU2lnbmFscyB7XG4gICAgICBwdWJsaWMgcmVuZGVyQ3JlYXRpb25Qb2xpY3kocmVuZGVyT3B0aW9uczogUmVuZGVyU2lnbmFsc09wdGlvbnMpOiBDZm5DcmVhdGlvblBvbGljeSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvUmVuZGVyKG9wdGlvbnMsIHJlbmRlck9wdGlvbnMuZGVzaXJlZENhcGFjaXR5ID8/IHJlbmRlck9wdGlvbnMubWluQ2FwYWNpdHkpO1xuICAgICAgfVxuICAgIH0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXYWl0IGZvciB0aGUgbWluQ2FwYWNpdHkgb2YgdGhlIEF1dG9TY2FsaW5nR3JvdXAgYW1vdW50IG9mIHNpZ25hbHMgdG8gaGF2ZSBiZWVuIHJlY2VpdmVkXG4gICAqXG4gICAqIFRoaXMgbnVtYmVyIGlzIHVzZWQgZHVyaW5nIGluaXRpYWwgY3JlYXRpb24gYW5kIGR1cmluZyByZXBsYWNpbmcgdXBkYXRlcy5cbiAgICogRHVyaW5nIHJvbGxpbmcgdXBkYXRlcywgYWxsIHVwZGF0ZWQgaW5zdGFuY2VzIG11c3Qgc2VuZCBhIHNpZ25hbC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgd2FpdEZvck1pbkNhcGFjaXR5KG9wdGlvbnM6IFNpZ25hbHNPcHRpb25zID0ge30pOiBTaWduYWxzIHtcbiAgICB2YWxpZGF0ZVBlcmNlbnRhZ2Uob3B0aW9ucy5taW5TdWNjZXNzUGVyY2VudGFnZSk7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIFNpZ25hbHMge1xuICAgICAgcHVibGljIHJlbmRlckNyZWF0aW9uUG9saWN5KHJlbmRlck9wdGlvbnM6IFJlbmRlclNpZ25hbHNPcHRpb25zKTogQ2ZuQ3JlYXRpb25Qb2xpY3kge1xuICAgICAgICByZXR1cm4gdGhpcy5kb1JlbmRlcihvcHRpb25zLCByZW5kZXJPcHRpb25zLm1pbkNhcGFjaXR5KTtcbiAgICAgIH1cbiAgICB9KCk7XG4gIH1cblxuICAvKipcbiAgICogV2FpdCBmb3IgYSBzcGVjaWZpYyBhbW91bnQgb2Ygc2lnbmFscyB0byBoYXZlIGJlZW4gcmVjZWl2ZWRcbiAgICpcbiAgICogWW91IHNob3VsZCBzZW5kIG9uZSBzaWduYWwgcGVyIGluc3RhbmNlLCBzbyB0aGlzIHJlcHJlc2VudHMgdGhlIG51bWJlciBvZlxuICAgKiBpbnN0YW5jZXMgdG8gd2FpdCBmb3IuXG4gICAqXG4gICAqIFRoaXMgbnVtYmVyIGlzIHVzZWQgZHVyaW5nIGluaXRpYWwgY3JlYXRpb24gYW5kIGR1cmluZyByZXBsYWNpbmcgdXBkYXRlcy5cbiAgICogRHVyaW5nIHJvbGxpbmcgdXBkYXRlcywgYWxsIHVwZGF0ZWQgaW5zdGFuY2VzIG11c3Qgc2VuZCBhIHNpZ25hbC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgd2FpdEZvckNvdW50KGNvdW50OiBudW1iZXIsIG9wdGlvbnM6IFNpZ25hbHNPcHRpb25zID0ge30pOiBTaWduYWxzIHtcbiAgICB2YWxpZGF0ZVBlcmNlbnRhZ2Uob3B0aW9ucy5taW5TdWNjZXNzUGVyY2VudGFnZSk7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIFNpZ25hbHMge1xuICAgICAgcHVibGljIHJlbmRlckNyZWF0aW9uUG9saWN5KCk6IENmbkNyZWF0aW9uUG9saWN5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9SZW5kZXIob3B0aW9ucywgY291bnQpO1xuICAgICAgfVxuICAgIH0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIEFTRydzIENyZWF0aW9uUG9saWN5XG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVuZGVyQ3JlYXRpb25Qb2xpY3kocmVuZGVyT3B0aW9uczogUmVuZGVyU2lnbmFsc09wdGlvbnMpOiBDZm5DcmVhdGlvblBvbGljeTtcblxuICAvKipcbiAgICogSGVscGVyIHRvIHJlbmRlciB0aGUgYWN0dWFsIGNyZWF0aW9uIHBvbGljeSwgYXMgdGhlIGxvZ2ljIGJldHdlZW4gdGhlbSBpcyBxdWl0ZSBzaW1pbGFyXG4gICAqL1xuICBwcm90ZWN0ZWQgZG9SZW5kZXIob3B0aW9uczogU2lnbmFsc09wdGlvbnMsIGNvdW50PzogbnVtYmVyKTogQ2ZuQ3JlYXRpb25Qb2xpY3kge1xuICAgIGNvbnN0IG1pblN1Y2Nlc3NmdWxJbnN0YW5jZXNQZXJjZW50ID0gdmFsaWRhdGVQZXJjZW50YWdlKG9wdGlvbnMubWluU3VjY2Vzc1BlcmNlbnRhZ2UpO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vcHRpb25zLm1pblN1Y2Nlc3NQZXJjZW50YWdlICE9PSB1bmRlZmluZWQgPyB7IGF1dG9TY2FsaW5nQ3JlYXRpb25Qb2xpY3k6IHsgbWluU3VjY2Vzc2Z1bEluc3RhbmNlc1BlcmNlbnQgfSB9IDogeyB9LFxuICAgICAgcmVzb3VyY2VTaWduYWw6IHtcbiAgICAgICAgY291bnQsXG4gICAgICAgIHRpbWVvdXQ6IG9wdGlvbnMudGltZW91dD8udG9Jc29TdHJpbmcoKSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG59XG5cbi8qKlxuICogSW5wdXQgZm9yIFNpZ25hbHMucmVuZGVyQ3JlYXRpb25Qb2xpY3lcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZW5kZXJTaWduYWxzT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgZGVzaXJlZENhcGFjaXR5IG9mIHRoZSBBU0dcbiAgICpcbiAgICogQGRlZmF1bHQgLSBkZXNpcmVkIGNhcGFjaXR5IG5vdCBjb25maWd1cmVkXG4gICAqL1xuICByZWFkb25seSBkZXNpcmVkQ2FwYWNpdHk/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBtaW5TaXplIG9mIHRoZSBBU0dcbiAgICpcbiAgICogQGRlZmF1bHQgLSBtaW5DYXBhY2l0eSBub3QgY29uZmlndXJlZFxuICAgKi9cbiAgcmVhZG9ubHkgbWluQ2FwYWNpdHk/OiBudW1iZXI7XG59XG5cbi8qKlxuICogQ3VzdG9taXphdGlvbiBvcHRpb25zIGZvciBTaWduYWwgaGFuZGxpbmdcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTaWduYWxzT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGVyY2VudGFnZSBvZiBzaWduYWxzIHRoYXQgbmVlZCB0byBiZSBzdWNjZXNzZnVsXG4gICAqXG4gICAqIElmIHRoaXMgbnVtYmVyIGlzIGxlc3MgdGhhbiAxMDAsIGEgcGVyY2VudGFnZSBvZiBzaWduYWxzIG1heSBiZSBmYWlsdXJlXG4gICAqIHNpZ25hbHMgd2hpbGUgc3RpbGwgc3VjY2VlZGluZyB0aGUgY3JlYXRpb24gb3IgdXBkYXRlIGluIENsb3VkRm9ybWF0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAxMDBcbiAgICovXG4gIHJlYWRvbmx5IG1pblN1Y2Nlc3NQZXJjZW50YWdlPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBIb3cgbG9uZyB0byB3YWl0IGZvciB0aGUgc2lnbmFscyB0byBiZSBzZW50XG4gICAqXG4gICAqIFRoaXMgc2hvdWxkIHJlZmxlY3QgaG93IGxvbmcgaXQgdGFrZXMgeW91ciBpbnN0YW5jZXMgdG8gc3RhcnQgdXBcbiAgICogKGluY2x1ZGluZyBpbnN0YW5jZSBzdGFydCB0aW1lIGFuZCBpbnN0YW5jZSBpbml0aWFsaXphdGlvbiB0aW1lKS5cbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24ubWludXRlcyg1KVxuICAgKi9cbiAgcmVhZG9ubHkgdGltZW91dD86IER1cmF0aW9uO1xufVxuXG4vKipcbiAqIEhvdyBleGlzdGluZyBpbnN0YW5jZXMgc2hvdWxkIGJlIHVwZGF0ZWRcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFVwZGF0ZVBvbGljeSB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgQXV0b1NjYWxpbmdHcm91cCBhbmQgc3dpdGNoIG92ZXIgdG8gaXRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVwbGFjaW5nVXBkYXRlKCk6IFVwZGF0ZVBvbGljeSB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIFVwZGF0ZVBvbGljeSB7XG4gICAgICBwdWJsaWMgX3JlbmRlclVwZGF0ZVBvbGljeSgpOiBDZm5VcGRhdGVQb2xpY3kge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGF1dG9TY2FsaW5nUmVwbGFjaW5nVXBkYXRlOiB7IHdpbGxSZXBsYWNlOiB0cnVlIH0sXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgdGhlIGluc3RhbmNlcyBpbiB0aGUgQXV0b1NjYWxpbmdHcm91cCBvbmUgYnkgb25lLCBvciBpbiBiYXRjaGVzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJvbGxpbmdVcGRhdGUob3B0aW9uczogUm9sbGluZ1VwZGF0ZU9wdGlvbnMgPSB7fSk6IFVwZGF0ZVBvbGljeSB7XG4gICAgY29uc3QgbWluU3VjY2Vzc1BlcmNlbnRhZ2UgPSB2YWxpZGF0ZVBlcmNlbnRhZ2Uob3B0aW9ucy5taW5TdWNjZXNzUGVyY2VudGFnZSk7XG5cbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgVXBkYXRlUG9saWN5IHtcbiAgICAgIHB1YmxpYyBfcmVuZGVyVXBkYXRlUG9saWN5KHJlbmRlck9wdGlvbnM6IFJlbmRlclVwZGF0ZU9wdGlvbnMpOiBDZm5VcGRhdGVQb2xpY3kge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGF1dG9TY2FsaW5nUm9sbGluZ1VwZGF0ZToge1xuICAgICAgICAgICAgbWF4QmF0Y2hTaXplOiBvcHRpb25zLm1heEJhdGNoU2l6ZSxcbiAgICAgICAgICAgIG1pbkluc3RhbmNlc0luU2VydmljZTogb3B0aW9ucy5taW5JbnN0YW5jZXNJblNlcnZpY2UsXG4gICAgICAgICAgICBzdXNwZW5kUHJvY2Vzc2VzOiBvcHRpb25zLnN1c3BlbmRQcm9jZXNzZXMgPz8gREVGQVVMVF9TVVNQRU5EX1BST0NFU1NFUyxcbiAgICAgICAgICAgIG1pblN1Y2Nlc3NmdWxJbnN0YW5jZXNQZXJjZW50OlxuICAgICAgICAgICAgICBtaW5TdWNjZXNzUGVyY2VudGFnZSA/PyByZW5kZXJPcHRpb25zLmNyZWF0aW9uUG9saWN5Py5hdXRvU2NhbGluZ0NyZWF0aW9uUG9saWN5Py5taW5TdWNjZXNzZnVsSW5zdGFuY2VzUGVyY2VudCxcbiAgICAgICAgICAgIHdhaXRPblJlc291cmNlU2lnbmFsczogb3B0aW9ucy53YWl0T25SZXNvdXJjZVNpZ25hbHMgPz8gcmVuZGVyT3B0aW9ucy5jcmVhdGlvblBvbGljeT8ucmVzb3VyY2VTaWduYWwgIT09IHVuZGVmaW5lZCA/IHRydWUgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBwYXVzZVRpbWU6IG9wdGlvbnMucGF1c2VUaW1lPy50b0lzb1N0cmluZygpID8/IHJlbmRlck9wdGlvbnMuY3JlYXRpb25Qb2xpY3k/LnJlc291cmNlU2lnbmFsPy50aW1lb3V0LFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgQVNHJ3MgQ3JlYXRpb25Qb2xpY3lcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgX3JlbmRlclVwZGF0ZVBvbGljeShyZW5kZXJPcHRpb25zOiBSZW5kZXJVcGRhdGVPcHRpb25zKTogQ2ZuVXBkYXRlUG9saWN5O1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHJlbmRlcmluZyBVcGRhdGVQb2xpY3lcbiAqL1xuaW50ZXJmYWNlIFJlbmRlclVwZGF0ZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIENyZWF0aW9uIFBvbGljeSBhbHJlYWR5IGNyZWF0ZWRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBDcmVhdGlvblBvbGljeSBjb25maWd1cmVkXG4gICAqL1xuICByZWFkb25seSBjcmVhdGlvblBvbGljeT86IENmbkNyZWF0aW9uUG9saWN5O1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGN1c3RvbWl6aW5nIHRoZSByb2xsaW5nIHVwZGF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJvbGxpbmdVcGRhdGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiBpbnN0YW5jZXMgdGhhdCBBV1MgQ2xvdWRGb3JtYXRpb24gdXBkYXRlcyBhdCBvbmNlLlxuICAgKlxuICAgKiBUaGlzIG51bWJlciBhZmZlY3RzIHRoZSBzcGVlZCBvZiB0aGUgcmVwbGFjZW1lbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IDFcbiAgICovXG4gIHJlYWRvbmx5IG1heEJhdGNoU2l6ZT86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIG1pbmltdW0gbnVtYmVyIG9mIGluc3RhbmNlcyB0aGF0IG11c3QgYmUgaW4gc2VydmljZSBiZWZvcmUgbW9yZSBpbnN0YW5jZXMgYXJlIHJlcGxhY2VkLlxuICAgKlxuICAgKiBUaGlzIG51bWJlciBhZmZlY3RzIHRoZSBzcGVlZCBvZiB0aGUgcmVwbGFjZW1lbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IDBcbiAgICovXG4gIHJlYWRvbmx5IG1pbkluc3RhbmNlc0luU2VydmljZT86IG51bWJlcjtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSBBdXRvIFNjYWxpbmcgcHJvY2Vzc2VzIHRvIHN1c3BlbmQgZHVyaW5nIGEgc3RhY2sgdXBkYXRlLlxuICAgKlxuICAgKiBTdXNwZW5kaW5nIHByb2Nlc3NlcyBwcmV2ZW50cyBBdXRvIFNjYWxpbmcgZnJvbSBpbnRlcmZlcmluZyB3aXRoIGEgc3RhY2tcbiAgICogdXBkYXRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBIZWFsdGhDaGVjaywgUmVwbGFjZVVuaGVhbHRoeSwgQVpSZWJhbGFuY2UsIEFsYXJtTm90aWZpY2F0aW9uLCBTY2hlZHVsZWRBY3Rpb25zLlxuICAgKi9cbiAgcmVhZG9ubHkgc3VzcGVuZFByb2Nlc3Nlcz86IFNjYWxpbmdQcm9jZXNzW107XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRoZSBBdXRvIFNjYWxpbmcgZ3JvdXAgd2FpdHMgb24gc2lnbmFscyBmcm9tIG5ldyBpbnN0YW5jZXMgZHVyaW5nIGFuIHVwZGF0ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZSBpZiB5b3UgY29uZmlndXJlZCBgc2lnbmFsc2Agb24gdGhlIEF1dG9TY2FsaW5nR3JvdXAsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgcmVhZG9ubHkgd2FpdE9uUmVzb3VyY2VTaWduYWxzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHBhdXNlIHRpbWUgYWZ0ZXIgbWFraW5nIGEgY2hhbmdlIHRvIGEgYmF0Y2ggb2YgaW5zdGFuY2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBgdGltZW91dGAgY29uZmlndXJlZCBmb3IgYHNpZ25hbHNgIG9uIHRoZSBBdXRvU2NhbGluZ0dyb3VwXG4gICAqL1xuICByZWFkb25seSBwYXVzZVRpbWU/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIHBlcmNlbnRhZ2Ugb2YgaW5zdGFuY2VzIHRoYXQgbXVzdCBzaWduYWwgc3VjY2VzcyBmb3IgdGhlIHVwZGF0ZSB0byBzdWNjZWVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBgbWluU3VjY2Vzc1BlcmNlbnRhZ2VgIGNvbmZpZ3VyZWQgZm9yIGBzaWduYWxzYCBvbiB0aGUgQXV0b1NjYWxpbmdHcm91cFxuICAgKi9cbiAgcmVhZG9ubHkgbWluU3VjY2Vzc1BlcmNlbnRhZ2U/OiBudW1iZXI7XG59XG5cbi8qKlxuICogQSBzZXQgb2YgZ3JvdXAgbWV0cmljc1xuICovXG5leHBvcnQgY2xhc3MgR3JvdXBNZXRyaWNzIHtcblxuICAvKipcbiAgICogUmVwb3J0IGFsbCBncm91cCBtZXRyaWNzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhbGwoKTogR3JvdXBNZXRyaWNzIHtcbiAgICByZXR1cm4gbmV3IEdyb3VwTWV0cmljcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9tZXRyaWNzID0gbmV3IFNldDxHcm91cE1ldHJpYz4oKTtcblxuICBjb25zdHJ1Y3RvciguLi5tZXRyaWNzOiBHcm91cE1ldHJpY1tdKSB7XG4gICAgbWV0cmljcz8uZm9yRWFjaChtZXRyaWMgPT4gdGhpcy5fbWV0cmljcy5hZGQobWV0cmljKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBHcm91cCBtZXRyaWNzIHRoYXQgYW4gQXV0byBTY2FsaW5nIGdyb3VwIHNlbmRzIHRvIEFtYXpvbiBDbG91ZFdhdGNoLlxuICovXG5leHBvcnQgY2xhc3MgR3JvdXBNZXRyaWMge1xuXG4gIC8qKlxuICAgKiBUaGUgbWluaW11bSBzaXplIG9mIHRoZSBBdXRvIFNjYWxpbmcgZ3JvdXBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTUlOX1NJWkUgPSBuZXcgR3JvdXBNZXRyaWMoJ0dyb3VwTWluU2l6ZScpO1xuXG4gIC8qKlxuICAgKiBUaGUgbWF4aW11bSBzaXplIG9mIHRoZSBBdXRvIFNjYWxpbmcgZ3JvdXBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTUFYX1NJWkUgPSBuZXcgR3JvdXBNZXRyaWMoJ0dyb3VwTWF4U2l6ZScpO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGluc3RhbmNlcyB0aGF0IHRoZSBBdXRvIFNjYWxpbmcgZ3JvdXAgYXR0ZW1wdHMgdG8gbWFpbnRhaW5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVTSVJFRF9DQVBBQ0lUWSA9IG5ldyBHcm91cE1ldHJpYygnR3JvdXBEZXNpcmVkQ2FwYWNpdHknKTtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBpbnN0YW5jZXMgdGhhdCBhcmUgcnVubmluZyBhcyBwYXJ0IG9mIHRoZSBBdXRvIFNjYWxpbmcgZ3JvdXBcbiAgICogVGhpcyBtZXRyaWMgZG9lcyBub3QgaW5jbHVkZSBpbnN0YW5jZXMgdGhhdCBhcmUgcGVuZGluZyBvciB0ZXJtaW5hdGluZ1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBJTl9TRVJWSUNFX0lOU1RBTkNFUyA9IG5ldyBHcm91cE1ldHJpYygnR3JvdXBJblNlcnZpY2VJbnN0YW5jZXMnKTtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBpbnN0YW5jZXMgdGhhdCBhcmUgcGVuZGluZ1xuICAgKiBBIHBlbmRpbmcgaW5zdGFuY2UgaXMgbm90IHlldCBpbiBzZXJ2aWNlLCB0aGlzIG1ldHJpYyBkb2VzIG5vdCBpbmNsdWRlIGluc3RhbmNlcyB0aGF0IGFyZSBpbiBzZXJ2aWNlIG9yIHRlcm1pbmF0aW5nXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBFTkRJTkdfSU5TVEFOQ0VTID0gbmV3IEdyb3VwTWV0cmljKCdHcm91cFBlbmRpbmdJbnN0YW5jZXMnKTtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBpbnN0YW5jZXMgdGhhdCBhcmUgaW4gYSBTdGFuZGJ5IHN0YXRlXG4gICAqIEluc3RhbmNlcyBpbiB0aGlzIHN0YXRlIGFyZSBzdGlsbCBydW5uaW5nIGJ1dCBhcmUgbm90IGFjdGl2ZWx5IGluIHNlcnZpY2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU1RBTkRCWV9JTlNUQU5DRVMgPSBuZXcgR3JvdXBNZXRyaWMoJ0dyb3VwU3RhbmRieUluc3RhbmNlcycpO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGluc3RhbmNlcyB0aGF0IGFyZSBpbiB0aGUgcHJvY2VzcyBvZiB0ZXJtaW5hdGluZ1xuICAgKiBUaGlzIG1ldHJpYyBkb2VzIG5vdCBpbmNsdWRlIGluc3RhbmNlcyB0aGF0IGFyZSBpbiBzZXJ2aWNlIG9yIHBlbmRpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVEVSTUlOQVRJTkdfSU5TVEFOQ0VTID0gbmV3IEdyb3VwTWV0cmljKCdHcm91cFRlcm1pbmF0aW5nSW5zdGFuY2VzJyk7XG5cbiAgLyoqXG4gICAqIFRoZSB0b3RhbCBudW1iZXIgb2YgaW5zdGFuY2VzIGluIHRoZSBBdXRvIFNjYWxpbmcgZ3JvdXBcbiAgICogVGhpcyBtZXRyaWMgaWRlbnRpZmllcyB0aGUgbnVtYmVyIG9mIGluc3RhbmNlcyB0aGF0IGFyZSBpbiBzZXJ2aWNlLCBwZW5kaW5nLCBhbmQgdGVybWluYXRpbmdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVE9UQUxfSU5TVEFOQ0VTID0gbmV3IEdyb3VwTWV0cmljKCdHcm91cFRvdGFsSW5zdGFuY2VzJyk7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBncm91cCBtZXRyaWNcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgfVxufVxuXG5hYnN0cmFjdCBjbGFzcyBBdXRvU2NhbGluZ0dyb3VwQmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUF1dG9TY2FsaW5nR3JvdXAge1xuXG4gIHB1YmxpYyBhYnN0cmFjdCBhdXRvU2NhbGluZ0dyb3VwTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgYXV0b1NjYWxpbmdHcm91cEFybjogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgb3NUeXBlOiBlYzIuT3BlcmF0aW5nU3lzdGVtVHlwZTtcbiAgcHJvdGVjdGVkIGFsYlRhcmdldEdyb3VwPzogZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cDtcbiAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBpYW0uSVByaW5jaXBhbCA9IG5ldyBpYW0uVW5rbm93blByaW5jaXBhbCh7IHJlc291cmNlOiB0aGlzIH0pO1xuICBwcm90ZWN0ZWQgaGFzQ2FsbGVkU2NhbGVPblJlcXVlc3RDb3VudDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBTZW5kIGEgbWVzc2FnZSB0byBlaXRoZXIgYW4gU1FTIHF1ZXVlIG9yIFNOUyB0b3BpYyB3aGVuIGluc3RhbmNlcyBsYXVuY2ggb3IgdGVybWluYXRlXG4gICAqL1xuICBwdWJsaWMgYWRkTGlmZWN5Y2xlSG9vayhpZDogc3RyaW5nLCBwcm9wczogQmFzaWNMaWZlY3ljbGVIb29rUHJvcHMpOiBMaWZlY3ljbGVIb29rIHtcbiAgICByZXR1cm4gbmV3IExpZmVjeWNsZUhvb2sodGhpcywgYExpZmVjeWNsZUhvb2ske2lkfWAsIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXA6IHRoaXMsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBwb29sIG9mIHByZS1pbml0aWFsaXplZCBFQzIgaW5zdGFuY2VzIHRoYXQgc2l0cyBhbG9uZ3NpZGUgYW4gQXV0byBTY2FsaW5nIGdyb3VwXG4gICAqL1xuICBwdWJsaWMgYWRkV2FybVBvb2wob3B0aW9ucz86IFdhcm1Qb29sT3B0aW9ucyk6IFdhcm1Qb29sIHtcbiAgICByZXR1cm4gbmV3IFdhcm1Qb29sKHRoaXMsICdXYXJtUG9vbCcsIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXA6IHRoaXMsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYWxlIG91dCBvciBpbiBiYXNlZCBvbiB0aW1lXG4gICAqL1xuICBwdWJsaWMgc2NhbGVPblNjaGVkdWxlKGlkOiBzdHJpbmcsIHByb3BzOiBCYXNpY1NjaGVkdWxlZEFjdGlvblByb3BzKTogU2NoZWR1bGVkQWN0aW9uIHtcbiAgICByZXR1cm4gbmV3IFNjaGVkdWxlZEFjdGlvbih0aGlzLCBgU2NoZWR1bGVkQWN0aW9uJHtpZH1gLCB7XG4gICAgICBhdXRvU2NhbGluZ0dyb3VwOiB0aGlzLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2NhbGUgb3V0IG9yIGluIHRvIGFjaGlldmUgYSB0YXJnZXQgQ1BVIHV0aWxpemF0aW9uXG4gICAqL1xuICBwdWJsaWMgc2NhbGVPbkNwdVV0aWxpemF0aW9uKGlkOiBzdHJpbmcsIHByb3BzOiBDcHVVdGlsaXphdGlvblNjYWxpbmdQcm9wcyk6IFRhcmdldFRyYWNraW5nU2NhbGluZ1BvbGljeSB7XG4gICAgcmV0dXJuIG5ldyBUYXJnZXRUcmFja2luZ1NjYWxpbmdQb2xpY3kodGhpcywgYFNjYWxpbmdQb2xpY3kke2lkfWAsIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXA6IHRoaXMsXG4gICAgICBwcmVkZWZpbmVkTWV0cmljOiBQcmVkZWZpbmVkTWV0cmljLkFTR19BVkVSQUdFX0NQVV9VVElMSVpBVElPTixcbiAgICAgIHRhcmdldFZhbHVlOiBwcm9wcy50YXJnZXRVdGlsaXphdGlvblBlcmNlbnQsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY2FsZSBvdXQgb3IgaW4gdG8gYWNoaWV2ZSBhIHRhcmdldCBuZXR3b3JrIGluZ3Jlc3MgcmF0ZVxuICAgKi9cbiAgcHVibGljIHNjYWxlT25JbmNvbWluZ0J5dGVzKGlkOiBzdHJpbmcsIHByb3BzOiBOZXR3b3JrVXRpbGl6YXRpb25TY2FsaW5nUHJvcHMpOiBUYXJnZXRUcmFja2luZ1NjYWxpbmdQb2xpY3kge1xuICAgIHJldHVybiBuZXcgVGFyZ2V0VHJhY2tpbmdTY2FsaW5nUG9saWN5KHRoaXMsIGBTY2FsaW5nUG9saWN5JHtpZH1gLCB7XG4gICAgICBhdXRvU2NhbGluZ0dyb3VwOiB0aGlzLFxuICAgICAgcHJlZGVmaW5lZE1ldHJpYzogUHJlZGVmaW5lZE1ldHJpYy5BU0dfQVZFUkFHRV9ORVRXT1JLX0lOLFxuICAgICAgdGFyZ2V0VmFsdWU6IHByb3BzLnRhcmdldEJ5dGVzUGVyU2Vjb25kLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2NhbGUgb3V0IG9yIGluIHRvIGFjaGlldmUgYSB0YXJnZXQgbmV0d29yayBlZ3Jlc3MgcmF0ZVxuICAgKi9cbiAgcHVibGljIHNjYWxlT25PdXRnb2luZ0J5dGVzKGlkOiBzdHJpbmcsIHByb3BzOiBOZXR3b3JrVXRpbGl6YXRpb25TY2FsaW5nUHJvcHMpOiBUYXJnZXRUcmFja2luZ1NjYWxpbmdQb2xpY3kge1xuICAgIHJldHVybiBuZXcgVGFyZ2V0VHJhY2tpbmdTY2FsaW5nUG9saWN5KHRoaXMsIGBTY2FsaW5nUG9saWN5JHtpZH1gLCB7XG4gICAgICBhdXRvU2NhbGluZ0dyb3VwOiB0aGlzLFxuICAgICAgcHJlZGVmaW5lZE1ldHJpYzogUHJlZGVmaW5lZE1ldHJpYy5BU0dfQVZFUkFHRV9ORVRXT1JLX09VVCxcbiAgICAgIHRhcmdldFZhbHVlOiBwcm9wcy50YXJnZXRCeXRlc1BlclNlY29uZCxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYWxlIG91dCBvciBpbiB0byBhY2hpZXZlIGEgdGFyZ2V0IHJlcXVlc3QgaGFuZGxpbmcgcmF0ZVxuICAgKlxuICAgKiBUaGUgQXV0b1NjYWxpbmdHcm91cCBtdXN0IGhhdmUgYmVlbiBhdHRhY2hlZCB0byBhbiBBcHBsaWNhdGlvbiBMb2FkIEJhbGFuY2VyXG4gICAqIGluIG9yZGVyIHRvIGJlIGFibGUgdG8gY2FsbCB0aGlzLlxuICAgKi9cbiAgcHVibGljIHNjYWxlT25SZXF1ZXN0Q291bnQoaWQ6IHN0cmluZywgcHJvcHM6IFJlcXVlc3RDb3VudFNjYWxpbmdQcm9wcyk6IFRhcmdldFRyYWNraW5nU2NhbGluZ1BvbGljeSB7XG4gICAgaWYgKHRoaXMuYWxiVGFyZ2V0R3JvdXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdHRhY2ggdGhlIEF1dG9TY2FsaW5nR3JvdXAgdG8gYSBub24taW1wb3J0ZWQgQXBwbGljYXRpb24gTG9hZCBCYWxhbmNlciBiZWZvcmUgY2FsbGluZyBzY2FsZU9uUmVxdWVzdENvdW50KCknKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNvdXJjZUxhYmVsID0gYCR7dGhpcy5hbGJUYXJnZXRHcm91cC5maXJzdExvYWRCYWxhbmNlckZ1bGxOYW1lfS8ke3RoaXMuYWxiVGFyZ2V0R3JvdXAudGFyZ2V0R3JvdXBGdWxsTmFtZX1gO1xuXG4gICAgaWYgKChwcm9wcy50YXJnZXRSZXF1ZXN0c1Blck1pbnV0ZSA9PT0gdW5kZWZpbmVkKSA9PT0gKHByb3BzLnRhcmdldFJlcXVlc3RzUGVyU2Vjb25kID09PSB1bmRlZmluZWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NwZWNpZnkgZXhhY3RseSBvbmUgb2YgXFwndGFyZ2V0UmVxdWVzdHNQZXJNaW51dGVcXCcgb3IgXFwndGFyZ2V0UmVxdWVzdHNQZXJTZWNvbmRcXCcnKTtcbiAgICB9XG5cbiAgICBsZXQgcnBtOiBudW1iZXI7XG4gICAgaWYgKHByb3BzLnRhcmdldFJlcXVlc3RzUGVyU2Vjb25kICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQocHJvcHMudGFyZ2V0UmVxdWVzdHNQZXJTZWNvbmQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXFwndGFyZ2V0UmVxdWVzdHNQZXJTZWNvbmRcXCcgY2Fubm90IGJlIGFuIHVucmVzb2x2ZWQgdmFsdWU7IHVzZSBcXCd0YXJnZXRSZXF1ZXN0c1Blck1pbnV0ZVxcJyBpbnN0ZWFkLicpO1xuICAgICAgfVxuICAgICAgcnBtID0gcHJvcHMudGFyZ2V0UmVxdWVzdHNQZXJTZWNvbmQgKiA2MDtcbiAgICB9IGVsc2Uge1xuICAgICAgcnBtID0gcHJvcHMudGFyZ2V0UmVxdWVzdHNQZXJNaW51dGUhO1xuICAgIH1cblxuICAgIGNvbnN0IHBvbGljeSA9IG5ldyBUYXJnZXRUcmFja2luZ1NjYWxpbmdQb2xpY3kodGhpcywgYFNjYWxpbmdQb2xpY3kke2lkfWAsIHtcbiAgICAgIGF1dG9TY2FsaW5nR3JvdXA6IHRoaXMsXG4gICAgICBwcmVkZWZpbmVkTWV0cmljOiBQcmVkZWZpbmVkTWV0cmljLkFMQl9SRVFVRVNUX0NPVU5UX1BFUl9UQVJHRVQsXG4gICAgICB0YXJnZXRWYWx1ZTogcnBtLFxuICAgICAgcmVzb3VyY2VMYWJlbCxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuXG4gICAgcG9saWN5Lm5vZGUuYWRkRGVwZW5kZW5jeSh0aGlzLmFsYlRhcmdldEdyb3VwLmxvYWRCYWxhbmNlckF0dGFjaGVkKTtcbiAgICB0aGlzLmhhc0NhbGxlZFNjYWxlT25SZXF1ZXN0Q291bnQgPSB0cnVlO1xuICAgIHJldHVybiBwb2xpY3k7XG4gIH1cblxuICAvKipcbiAgICogU2NhbGUgb3V0IG9yIGluIGluIG9yZGVyIHRvIGtlZXAgYSBtZXRyaWMgYXJvdW5kIGEgdGFyZ2V0IHZhbHVlXG4gICAqL1xuICBwdWJsaWMgc2NhbGVUb1RyYWNrTWV0cmljKGlkOiBzdHJpbmcsIHByb3BzOiBNZXRyaWNUYXJnZXRUcmFja2luZ1Byb3BzKTogVGFyZ2V0VHJhY2tpbmdTY2FsaW5nUG9saWN5IHtcbiAgICByZXR1cm4gbmV3IFRhcmdldFRyYWNraW5nU2NhbGluZ1BvbGljeSh0aGlzLCBgU2NhbGluZ1BvbGljeSR7aWR9YCwge1xuICAgICAgYXV0b1NjYWxpbmdHcm91cDogdGhpcyxcbiAgICAgIGN1c3RvbU1ldHJpYzogcHJvcHMubWV0cmljLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2NhbGUgb3V0IG9yIGluLCBpbiByZXNwb25zZSB0byBhIG1ldHJpY1xuICAgKi9cbiAgcHVibGljIHNjYWxlT25NZXRyaWMoaWQ6IHN0cmluZywgcHJvcHM6IEJhc2ljU3RlcFNjYWxpbmdQb2xpY3lQcm9wcyk6IFN0ZXBTY2FsaW5nUG9saWN5IHtcbiAgICByZXR1cm4gbmV3IFN0ZXBTY2FsaW5nUG9saWN5KHRoaXMsIGlkLCB7IC4uLnByb3BzLCBhdXRvU2NhbGluZ0dyb3VwOiB0aGlzIH0pO1xuICB9XG5cbiAgcHVibGljIGFkZFVzZXJEYXRhKC4uLl9jb21tYW5kczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICAvLyBkbyBub3RoaW5nXG4gIH1cbn1cblxuLyoqXG4gKiBBIEZsZWV0IHJlcHJlc2VudHMgYSBtYW5hZ2VkIHNldCBvZiBFQzIgaW5zdGFuY2VzXG4gKlxuICogVGhlIEZsZWV0IG1vZGVscyBhIG51bWJlciBvZiBBdXRvU2NhbGluZ0dyb3VwcywgYSBsYXVuY2ggY29uZmlndXJhdGlvbiwgYVxuICogc2VjdXJpdHkgZ3JvdXAgYW5kIGFuIGluc3RhbmNlIHJvbGUuXG4gKlxuICogSXQgYWxsb3dzIGFkZGluZyBhcmJpdHJhcnkgY29tbWFuZHMgdG8gdGhlIHN0YXJ0dXAgc2NyaXB0cyBvZiB0aGUgaW5zdGFuY2VzXG4gKiBpbiB0aGUgZmxlZXQuXG4gKlxuICogVGhlIEFTRyBzcGFucyB0aGUgYXZhaWxhYmlsaXR5IHpvbmVzIHNwZWNpZmllZCBieSB2cGNTdWJuZXRzLCBmYWxsaW5nIGJhY2sgdG9cbiAqIHRoZSBWcGMgZGVmYXVsdCBzdHJhdGVneSBpZiBub3Qgc3BlY2lmaWVkLlxuICovXG5leHBvcnQgY2xhc3MgQXV0b1NjYWxpbmdHcm91cCBleHRlbmRzIEF1dG9TY2FsaW5nR3JvdXBCYXNlIGltcGxlbWVudHNcbiAgZWxiLklMb2FkQmFsYW5jZXJUYXJnZXQsXG4gIGVjMi5JQ29ubmVjdGFibGUsXG4gIGVsYnYyLklBcHBsaWNhdGlvbkxvYWRCYWxhbmNlclRhcmdldCxcbiAgZWxidjIuSU5ldHdvcmtMb2FkQmFsYW5jZXJUYXJnZXQge1xuXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUF1dG9TY2FsaW5nR3JvdXBOYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF1dG9TY2FsaW5nR3JvdXBOYW1lOiBzdHJpbmcpOiBJQXV0b1NjYWxpbmdHcm91cCB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgQXV0b1NjYWxpbmdHcm91cEJhc2Uge1xuICAgICAgcHVibGljIGF1dG9TY2FsaW5nR3JvdXBOYW1lID0gYXV0b1NjYWxpbmdHcm91cE5hbWU7XG4gICAgICBwdWJsaWMgYXV0b1NjYWxpbmdHcm91cEFybiA9IFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICAgIHNlcnZpY2U6ICdhdXRvc2NhbGluZycsXG4gICAgICAgIHJlc291cmNlOiAnYXV0b1NjYWxpbmdHcm91cDoqOmF1dG9TY2FsaW5nR3JvdXBOYW1lJyxcbiAgICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLmF1dG9TY2FsaW5nR3JvdXBOYW1lLFxuICAgICAgfSk7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgb3NUeXBlID0gZWMyLk9wZXJhdGluZ1N5c3RlbVR5cGUuVU5LTk9XTjtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIE9TIGluc3RhbmNlcyBvZiB0aGlzIGZsZWV0IGFyZSBydW5uaW5nLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG9zVHlwZTogZWMyLk9wZXJhdGluZ1N5c3RlbVR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBwcmluY2lwYWwgdG8gZ3JhbnQgcGVybWlzc2lvbnMgdG9cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBncmFudFByaW5jaXBhbDogaWFtLklQcmluY2lwYWw7XG5cbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIEF1dG9TY2FsaW5nR3JvdXBcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhdXRvU2NhbGluZ0dyb3VwTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBcm4gb2YgdGhlIEF1dG9TY2FsaW5nR3JvdXBcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhdXRvU2NhbGluZ0dyb3VwQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIHNwb3QgcHJpY2UgY29uZmlndXJlZCBmb3IgdGhlIGF1dG9zY2FsaW5nIGdyb3VwLiBgdW5kZWZpbmVkYFxuICAgKiBpbmRpY2F0ZXMgdGhhdCB0aGlzIGdyb3VwIHVzZXMgb24tZGVtYW5kIGNhcGFjaXR5LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNwb3RQcmljZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG1heGltdW0gYW1vdW50IG9mIHRpbWUgdGhhdCBhbiBpbnN0YW5jZSBjYW4gYmUgaW4gc2VydmljZS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBtYXhJbnN0YW5jZUxpZmV0aW1lPzogRHVyYXRpb247XG5cbiAgcHJpdmF0ZSByZWFkb25seSBhdXRvU2NhbGluZ0dyb3VwOiBDZm5BdXRvU2NhbGluZ0dyb3VwO1xuICBwcml2YXRlIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXA/OiBlYzIuSVNlY3VyaXR5R3JvdXA7XG4gIHByaXZhdGUgcmVhZG9ubHkgc2VjdXJpdHlHcm91cHM/OiBlYzIuSVNlY3VyaXR5R3JvdXBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBsb2FkQmFsYW5jZXJOYW1lczogc3RyaW5nW10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSB0YXJnZXRHcm91cEFybnM6IHN0cmluZ1tdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgZ3JvdXBNZXRyaWNzOiBHcm91cE1ldHJpY3NbXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IG5vdGlmaWNhdGlvbnM6IE5vdGlmaWNhdGlvbkNvbmZpZ3VyYXRpb25bXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IGxhdW5jaFRlbXBsYXRlPzogZWMyLkxhdW5jaFRlbXBsYXRlO1xuICBwcml2YXRlIHJlYWRvbmx5IF9jb25uZWN0aW9ucz86IGVjMi5Db25uZWN0aW9ucztcbiAgcHJpdmF0ZSByZWFkb25seSBfdXNlckRhdGE/OiBlYzIuVXNlckRhdGE7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3JvbGU/OiBpYW0uSVJvbGU7XG5cbiAgcHJvdGVjdGVkIG5ld0luc3RhbmNlc1Byb3RlY3RlZEZyb21TY2FsZUluPzogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQXV0b1NjYWxpbmdHcm91cFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLmF1dG9TY2FsaW5nR3JvdXBOYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5uZXdJbnN0YW5jZXNQcm90ZWN0ZWRGcm9tU2NhbGVJbiA9IHByb3BzLm5ld0luc3RhbmNlc1Byb3RlY3RlZEZyb21TY2FsZUluO1xuXG4gICAgaWYgKHByb3BzLmluaXRPcHRpb25zICYmICFwcm9wcy5pbml0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmcgXFwnaW5pdE9wdGlvbnNcXCcgcmVxdWlyZXMgdGhhdCBcXCdpbml0XFwnIGlzIGFsc28gc2V0Jyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmdyb3VwTWV0cmljcykge1xuICAgICAgdGhpcy5ncm91cE1ldHJpY3MucHVzaCguLi5wcm9wcy5ncm91cE1ldHJpY3MpO1xuICAgIH1cblxuICAgIGxldCBsYXVuY2hDb25maWc6IENmbkxhdW5jaENvbmZpZ3VyYXRpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHByb3BzLmxhdW5jaFRlbXBsYXRlIHx8IHByb3BzLm1peGVkSW5zdGFuY2VzUG9saWN5KSB7XG4gICAgICB0aGlzLnZlcmlmeU5vTGF1bmNoQ29uZmlnUHJvcElzR2l2ZW4ocHJvcHMpO1xuXG4gICAgICBjb25zdCBiYXJlTGF1bmNoVGVtcGxhdGUgPSBwcm9wcy5sYXVuY2hUZW1wbGF0ZTtcbiAgICAgIGNvbnN0IG1peGVkSW5zdGFuY2VzUG9saWN5ID0gcHJvcHMubWl4ZWRJbnN0YW5jZXNQb2xpY3k7XG5cbiAgICAgIGlmIChiYXJlTGF1bmNoVGVtcGxhdGUgJiYgbWl4ZWRJbnN0YW5jZXNQb2xpY3kpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXR0aW5nIFxcJ21peGVkSW5zdGFuY2VzUG9saWN5XFwnIG11c3Qgbm90IGJlIHNldCB3aGVuIFxcJ2xhdW5jaFRlbXBsYXRlXFwnIGlzIHNldCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYmFyZUxhdW5jaFRlbXBsYXRlICYmIGJhcmVMYXVuY2hUZW1wbGF0ZSBpbnN0YW5jZW9mIGVjMi5MYXVuY2hUZW1wbGF0ZSkge1xuICAgICAgICBpZiAoIWJhcmVMYXVuY2hUZW1wbGF0ZS5pbnN0YW5jZVR5cGUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmcgXFwnbGF1bmNoVGVtcGxhdGVcXCcgcmVxdWlyZXMgaXRzIFxcJ2luc3RhbmNlVHlwZVxcJyB0byBiZSBzZXQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYmFyZUxhdW5jaFRlbXBsYXRlLmltYWdlSWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmcgXFwnbGF1bmNoVGVtcGxhdGVcXCcgcmVxdWlyZXMgaXRzIFxcJ21hY2hpbmVJbWFnZVxcJyB0byBiZSBzZXQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGF1bmNoVGVtcGxhdGUgPSBiYXJlTGF1bmNoVGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChtaXhlZEluc3RhbmNlc1BvbGljeSAmJiBtaXhlZEluc3RhbmNlc1BvbGljeS5sYXVuY2hUZW1wbGF0ZSBpbnN0YW5jZW9mIGVjMi5MYXVuY2hUZW1wbGF0ZSkge1xuICAgICAgICBpZiAoIW1peGVkSW5zdGFuY2VzUG9saWN5LmxhdW5jaFRlbXBsYXRlLmltYWdlSWQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmcgXFwnbWl4ZWRJbnN0YW5jZXNQb2xpY3kubGF1bmNoVGVtcGxhdGVcXCcgcmVxdWlyZXMgaXRzIFxcJ21hY2hpbmVJbWFnZVxcJyB0byBiZSBzZXQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGF1bmNoVGVtcGxhdGUgPSBtaXhlZEluc3RhbmNlc1BvbGljeS5sYXVuY2hUZW1wbGF0ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcm9sZSA9IHRoaXMubGF1bmNoVGVtcGxhdGU/LnJvbGU7XG4gICAgICB0aGlzLmdyYW50UHJpbmNpcGFsID0gdGhpcy5fcm9sZSB8fCBuZXcgaWFtLlVua25vd25QcmluY2lwYWwoeyByZXNvdXJjZTogdGhpcyB9KTtcblxuICAgICAgdGhpcy5vc1R5cGUgPSB0aGlzLmxhdW5jaFRlbXBsYXRlPy5vc1R5cGUgPz8gZWMyLk9wZXJhdGluZ1N5c3RlbVR5cGUuVU5LTk9XTjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFwcm9wcy5tYWNoaW5lSW1hZ2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXR0aW5nIFxcJ21hY2hpbmVJbWFnZVxcJyBpcyByZXF1aXJlZCB3aGVuIFxcJ2xhdW5jaFRlbXBsYXRlXFwnIGFuZCBcXCdtaXhlZEluc3RhbmNlc1BvbGljeVxcJyBpcyBub3Qgc2V0Jyk7XG4gICAgICB9XG4gICAgICBpZiAoIXByb3BzLmluc3RhbmNlVHlwZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmcgXFwnaW5zdGFuY2VUeXBlXFwnIGlzIHJlcXVpcmVkIHdoZW4gXFwnbGF1bmNoVGVtcGxhdGVcXCcgYW5kIFxcJ21peGVkSW5zdGFuY2VzUG9saWN5XFwnIGlzIG5vdCBzZXQnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWN1cml0eUdyb3VwID0gcHJvcHMuc2VjdXJpdHlHcm91cCB8fCBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgJ0luc3RhbmNlU2VjdXJpdHlHcm91cCcsIHtcbiAgICAgICAgdnBjOiBwcm9wcy52cGMsXG4gICAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHByb3BzLmFsbG93QWxsT3V0Ym91bmQgIT09IGZhbHNlLFxuICAgICAgfSk7XG4gICAgICB0aGlzLl9jb25uZWN0aW9ucyA9IG5ldyBlYzIuQ29ubmVjdGlvbnMoeyBzZWN1cml0eUdyb3VwczogW3RoaXMuc2VjdXJpdHlHcm91cF0gfSk7XG4gICAgICB0aGlzLnNlY3VyaXR5R3JvdXBzID0gW3RoaXMuc2VjdXJpdHlHcm91cF07XG4gICAgICBUYWdzLm9mKHRoaXMpLmFkZChOQU1FX1RBRywgdGhpcy5ub2RlLnBhdGgpO1xuXG4gICAgICB0aGlzLl9yb2xlID0gcHJvcHMucm9sZSB8fCBuZXcgaWFtLlJvbGUodGhpcywgJ0luc3RhbmNlUm9sZScsIHtcbiAgICAgICAgcm9sZU5hbWU6IFBoeXNpY2FsTmFtZS5HRU5FUkFURV9JRl9ORUVERUQsXG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlYzIuYW1hem9uYXdzLmNvbScpLFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZ3JhbnRQcmluY2lwYWwgPSB0aGlzLl9yb2xlO1xuXG4gICAgICBjb25zdCBpYW1Qcm9maWxlID0gbmV3IGlhbS5DZm5JbnN0YW5jZVByb2ZpbGUodGhpcywgJ0luc3RhbmNlUHJvZmlsZScsIHtcbiAgICAgICAgcm9sZXM6IFt0aGlzLnJvbGUucm9sZU5hbWVdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHVzZSBkZWxheWVkIGV2YWx1YXRpb25cbiAgICAgIGNvbnN0IGltYWdlQ29uZmlnID0gcHJvcHMubWFjaGluZUltYWdlLmdldEltYWdlKHRoaXMpO1xuICAgICAgdGhpcy5fdXNlckRhdGEgPSBwcm9wcy51c2VyRGF0YSA/PyBpbWFnZUNvbmZpZy51c2VyRGF0YTtcbiAgICAgIGNvbnN0IHVzZXJEYXRhVG9rZW4gPSBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+IEZuLmJhc2U2NCh0aGlzLnVzZXJEYXRhIS5yZW5kZXIoKSkgfSk7XG4gICAgICBjb25zdCBzZWN1cml0eUdyb3Vwc1Rva2VuID0gTGF6eS5saXN0KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5zZWN1cml0eUdyb3VwcyEubWFwKHNnID0+IHNnLnNlY3VyaXR5R3JvdXBJZCkgfSk7XG5cbiAgICAgIGxhdW5jaENvbmZpZyA9IG5ldyBDZm5MYXVuY2hDb25maWd1cmF0aW9uKHRoaXMsICdMYXVuY2hDb25maWcnLCB7XG4gICAgICAgIGltYWdlSWQ6IGltYWdlQ29uZmlnLmltYWdlSWQsXG4gICAgICAgIGtleU5hbWU6IHByb3BzLmtleU5hbWUsXG4gICAgICAgIGluc3RhbmNlVHlwZTogcHJvcHMuaW5zdGFuY2VUeXBlLnRvU3RyaW5nKCksXG4gICAgICAgIGluc3RhbmNlTW9uaXRvcmluZzogKHByb3BzLmluc3RhbmNlTW9uaXRvcmluZyAhPT0gdW5kZWZpbmVkID8gKHByb3BzLmluc3RhbmNlTW9uaXRvcmluZyA9PT0gTW9uaXRvcmluZy5ERVRBSUxFRCkgOiB1bmRlZmluZWQpLFxuICAgICAgICBzZWN1cml0eUdyb3Vwczogc2VjdXJpdHlHcm91cHNUb2tlbixcbiAgICAgICAgaWFtSW5zdGFuY2VQcm9maWxlOiBpYW1Qcm9maWxlLnJlZixcbiAgICAgICAgdXNlckRhdGE6IHVzZXJEYXRhVG9rZW4sXG4gICAgICAgIGFzc29jaWF0ZVB1YmxpY0lwQWRkcmVzczogcHJvcHMuYXNzb2NpYXRlUHVibGljSXBBZGRyZXNzLFxuICAgICAgICBzcG90UHJpY2U6IHByb3BzLnNwb3RQcmljZSxcbiAgICAgICAgYmxvY2tEZXZpY2VNYXBwaW5nczogKHByb3BzLmJsb2NrRGV2aWNlcyAhPT0gdW5kZWZpbmVkID9cbiAgICAgICAgICBzeW50aGVzaXplQmxvY2tEZXZpY2VNYXBwaW5ncyh0aGlzLCBwcm9wcy5ibG9ja0RldmljZXMpIDogdW5kZWZpbmVkKSxcbiAgICAgIH0pO1xuXG4gICAgICBsYXVuY2hDb25maWcubm9kZS5hZGREZXBlbmRlbmN5KHRoaXMucm9sZSk7XG4gICAgICB0aGlzLm9zVHlwZSA9IGltYWdlQ29uZmlnLm9zVHlwZTtcbiAgICB9XG5cbiAgICAvLyBkZXNpcmVkQ2FwYWNpdHkganVzdCByZWZsZWN0cyB3aGF0IHRoZSB1c2VyIGhhcyBzdXBwbGllZC5cbiAgICBjb25zdCBkZXNpcmVkQ2FwYWNpdHkgPSBwcm9wcy5kZXNpcmVkQ2FwYWNpdHk7XG4gICAgY29uc3QgbWluQ2FwYWNpdHkgPSBwcm9wcy5taW5DYXBhY2l0eSA/PyAxO1xuICAgIGNvbnN0IG1heENhcGFjaXR5ID0gcHJvcHMubWF4Q2FwYWNpdHkgPz8gZGVzaXJlZENhcGFjaXR5ID8/IE1hdGgubWF4KG1pbkNhcGFjaXR5LCAxKTtcblxuICAgIHdpdGhSZXNvbHZlZChtaW5DYXBhY2l0eSwgbWF4Q2FwYWNpdHksIChtaW4sIG1heCkgPT4ge1xuICAgICAgaWYgKG1pbiA+IG1heCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYG1pbkNhcGFjaXR5ICgke21pbn0pIHNob3VsZCBiZSA8PSBtYXhDYXBhY2l0eSAoJHttYXh9KWApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHdpdGhSZXNvbHZlZChkZXNpcmVkQ2FwYWNpdHksIG1pbkNhcGFjaXR5LCAoZGVzaXJlZCwgbWluKSA9PiB7XG4gICAgICBpZiAoZGVzaXJlZCA9PT0gdW5kZWZpbmVkKSB7IHJldHVybjsgfVxuICAgICAgaWYgKGRlc2lyZWQgPCBtaW4pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTaG91bGQgaGF2ZSBtaW5DYXBhY2l0eSAoJHttaW59KSA8PSBkZXNpcmVkQ2FwYWNpdHkgKCR7ZGVzaXJlZH0pYCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgd2l0aFJlc29sdmVkKGRlc2lyZWRDYXBhY2l0eSwgbWF4Q2FwYWNpdHksIChkZXNpcmVkLCBtYXgpID0+IHtcbiAgICAgIGlmIChkZXNpcmVkID09PSB1bmRlZmluZWQpIHsgcmV0dXJuOyB9XG4gICAgICBpZiAobWF4IDwgZGVzaXJlZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNob3VsZCBoYXZlIGRlc2lyZWRDYXBhY2l0eSAoJHtkZXNpcmVkfSkgPD0gbWF4Q2FwYWNpdHkgKCR7bWF4fSlgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChkZXNpcmVkQ2FwYWNpdHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZygnZGVzaXJlZENhcGFjaXR5IGhhcyBiZWVuIGNvbmZpZ3VyZWQuIEJlIGF3YXJlIHRoaXMgd2lsbCByZXNldCB0aGUgc2l6ZSBvZiB5b3VyIEF1dG9TY2FsaW5nR3JvdXAgb24gZXZlcnkgZGVwbG95bWVudC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9pc3N1ZXMvNTIxNScpO1xuICAgIH1cblxuICAgIHRoaXMubWF4SW5zdGFuY2VMaWZldGltZSA9IHByb3BzLm1heEluc3RhbmNlTGlmZXRpbWU7XG4gICAgLy8gU2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hdXRvc2NhbGluZy9lYzIvdXNlcmd1aWRlL2FzZy1tYXgtaW5zdGFuY2UtbGlmZXRpbWUuaHRtbCBmb3IgZGV0YWlscyBvbiBtYXggaW5zdGFuY2UgbGlmZXRpbWUuXG4gICAgaWYgKHRoaXMubWF4SW5zdGFuY2VMaWZldGltZSAmJiAhdGhpcy5tYXhJbnN0YW5jZUxpZmV0aW1lLmlzVW5yZXNvbHZlZCgpICYmXG4gICAgICAodGhpcy5tYXhJbnN0YW5jZUxpZmV0aW1lLnRvU2Vjb25kcygpICE9PSAwKSAmJlxuICAgICAgKHRoaXMubWF4SW5zdGFuY2VMaWZldGltZS50b1NlY29uZHMoKSA8IDg2NDAwIHx8IHRoaXMubWF4SW5zdGFuY2VMaWZldGltZS50b1NlY29uZHMoKSA+IDMxNTM2MDAwKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXhJbnN0YW5jZUxpZmV0aW1lIG11c3QgYmUgYmV0d2VlbiAxIGFuZCAzNjUgZGF5cyAoaW5jbHVzaXZlKScpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5ub3RpZmljYXRpb25zVG9waWMgJiYgcHJvcHMubm90aWZpY2F0aW9ucykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc2V0IFxcJ25vdGlmaWNhdGlvbnNUb3BpY1xcJyBhbmQgXFwnbm90aWZpY2F0aW9uc1xcJywgXFwnbm90aWZpY2F0aW9uc1RvcGljXFwnIGlzIGRlcHJlY2F0ZWQgdXNlIFxcJ25vdGlmaWNhdGlvbnNcXCcgaW5zdGVhZCcpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5ub3RpZmljYXRpb25zVG9waWMpIHtcbiAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IFt7XG4gICAgICAgIHRvcGljOiBwcm9wcy5ub3RpZmljYXRpb25zVG9waWMsXG4gICAgICB9XTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMubm90aWZpY2F0aW9ucykge1xuICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gcHJvcHMubm90aWZpY2F0aW9ucy5tYXAobmMgPT4gKHtcbiAgICAgICAgdG9waWM6IG5jLnRvcGljLFxuICAgICAgICBzY2FsaW5nRXZlbnRzOiBuYy5zY2FsaW5nRXZlbnRzID8/IFNjYWxpbmdFdmVudHMuQUxMLFxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIGNvbnN0IHsgc3VibmV0SWRzLCBoYXNQdWJsaWMgfSA9IHByb3BzLnZwYy5zZWxlY3RTdWJuZXRzKHByb3BzLnZwY1N1Ym5ldHMpO1xuICAgIGNvbnN0IGFzZ1Byb3BzOiBDZm5BdXRvU2NhbGluZ0dyb3VwUHJvcHMgPSB7XG4gICAgICBhdXRvU2NhbGluZ0dyb3VwTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBjb29sZG93bjogcHJvcHMuY29vbGRvd24/LnRvU2Vjb25kcygpLnRvU3RyaW5nKCksXG4gICAgICBtaW5TaXplOiBUb2tlbml6YXRpb24uc3RyaW5naWZ5TnVtYmVyKG1pbkNhcGFjaXR5KSxcbiAgICAgIG1heFNpemU6IFRva2VuaXphdGlvbi5zdHJpbmdpZnlOdW1iZXIobWF4Q2FwYWNpdHkpLFxuICAgICAgZGVzaXJlZENhcGFjaXR5OiBkZXNpcmVkQ2FwYWNpdHkgIT09IHVuZGVmaW5lZCA/IFRva2VuaXphdGlvbi5zdHJpbmdpZnlOdW1iZXIoZGVzaXJlZENhcGFjaXR5KSA6IHVuZGVmaW5lZCxcbiAgICAgIGxvYWRCYWxhbmNlck5hbWVzOiBMYXp5Lmxpc3QoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLmxvYWRCYWxhbmNlck5hbWVzIH0sIHsgb21pdEVtcHR5OiB0cnVlIH0pLFxuICAgICAgdGFyZ2V0R3JvdXBBcm5zOiBMYXp5Lmxpc3QoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLnRhcmdldEdyb3VwQXJucyB9LCB7IG9taXRFbXB0eTogdHJ1ZSB9KSxcbiAgICAgIG5vdGlmaWNhdGlvbkNvbmZpZ3VyYXRpb25zOiB0aGlzLnJlbmRlck5vdGlmaWNhdGlvbkNvbmZpZ3VyYXRpb24oKSxcbiAgICAgIG1ldHJpY3NDb2xsZWN0aW9uOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucmVuZGVyTWV0cmljc0NvbGxlY3Rpb24oKSB9KSxcbiAgICAgIHZwY1pvbmVJZGVudGlmaWVyOiBzdWJuZXRJZHMsXG4gICAgICBoZWFsdGhDaGVja1R5cGU6IHByb3BzLmhlYWx0aENoZWNrICYmIHByb3BzLmhlYWx0aENoZWNrLnR5cGUsXG4gICAgICBoZWFsdGhDaGVja0dyYWNlUGVyaW9kOiBwcm9wcy5oZWFsdGhDaGVjayAmJiBwcm9wcy5oZWFsdGhDaGVjay5ncmFjZVBlcmlvZCAmJiBwcm9wcy5oZWFsdGhDaGVjay5ncmFjZVBlcmlvZC50b1NlY29uZHMoKSxcbiAgICAgIG1heEluc3RhbmNlTGlmZXRpbWU6IHRoaXMubWF4SW5zdGFuY2VMaWZldGltZSA/IHRoaXMubWF4SW5zdGFuY2VMaWZldGltZS50b1NlY29uZHMoKSA6IHVuZGVmaW5lZCxcbiAgICAgIG5ld0luc3RhbmNlc1Byb3RlY3RlZEZyb21TY2FsZUluOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMubmV3SW5zdGFuY2VzUHJvdGVjdGVkRnJvbVNjYWxlSW4gfSksXG4gICAgICB0ZXJtaW5hdGlvblBvbGljaWVzOiBwcm9wcy50ZXJtaW5hdGlvblBvbGljaWVzLFxuICAgICAgZGVmYXVsdEluc3RhbmNlV2FybXVwOiBwcm9wcy5kZWZhdWx0SW5zdGFuY2VXYXJtdXA/LnRvU2Vjb25kcygpLFxuICAgICAgY2FwYWNpdHlSZWJhbGFuY2U6IHByb3BzLmNhcGFjaXR5UmViYWxhbmNlLFxuICAgICAgLi4udGhpcy5nZXRMYXVuY2hTZXR0aW5ncyhsYXVuY2hDb25maWcsIHByb3BzLmxhdW5jaFRlbXBsYXRlLCBwcm9wcy5taXhlZEluc3RhbmNlc1BvbGljeSksXG4gICAgfTtcblxuICAgIGlmICghaGFzUHVibGljICYmIHByb3BzLmFzc29jaWF0ZVB1YmxpY0lwQWRkcmVzcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVG8gc2V0ICdhc3NvY2lhdGVQdWJsaWNJcEFkZHJlc3M6IHRydWUnIHlvdSBtdXN0IHNlbGVjdCBQdWJsaWMgc3VibmV0cyAodnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyB9KVwiKTtcbiAgICB9XG5cbiAgICB0aGlzLmF1dG9TY2FsaW5nR3JvdXAgPSBuZXcgQ2ZuQXV0b1NjYWxpbmdHcm91cCh0aGlzLCAnQVNHJywgYXNnUHJvcHMpO1xuICAgIHRoaXMuYXV0b1NjYWxpbmdHcm91cE5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZSh0aGlzLmF1dG9TY2FsaW5nR3JvdXAucmVmKSxcbiAgICB0aGlzLmF1dG9TY2FsaW5nR3JvdXBBcm4gPSBTdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2F1dG9zY2FsaW5nJyxcbiAgICAgIHJlc291cmNlOiAnYXV0b1NjYWxpbmdHcm91cDoqOmF1dG9TY2FsaW5nR3JvdXBOYW1lJyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5hdXRvU2NhbGluZ0dyb3VwTmFtZSxcbiAgICB9KTtcbiAgICB0aGlzLm5vZGUuZGVmYXVsdENoaWxkID0gdGhpcy5hdXRvU2NhbGluZ0dyb3VwO1xuXG4gICAgdGhpcy5hcHBseVVwZGF0ZVBvbGljaWVzKHByb3BzLCB7IGRlc2lyZWRDYXBhY2l0eSwgbWluQ2FwYWNpdHkgfSk7XG4gICAgaWYgKHByb3BzLmluaXQpIHtcbiAgICAgIHRoaXMuYXBwbHlDbG91ZEZvcm1hdGlvbkluaXQocHJvcHMuaW5pdCwgcHJvcHMuaW5pdE9wdGlvbnMpO1xuICAgIH1cblxuICAgIHRoaXMuc3BvdFByaWNlID0gcHJvcHMuc3BvdFByaWNlO1xuXG4gICAgaWYgKHByb3BzLnJlcXVpcmVJbWRzdjIpIHtcbiAgICAgIEFzcGVjdHMub2YodGhpcykuYWRkKG5ldyBBdXRvU2NhbGluZ0dyb3VwUmVxdWlyZUltZHN2MkFzcGVjdCgpKTtcbiAgICB9XG5cbiAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7IHZhbGlkYXRlOiAoKSA9PiB0aGlzLnZhbGlkYXRlVGFyZ2V0R3JvdXAoKSB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIHNlY3VyaXR5IGdyb3VwIHRvIGFsbCBpbnN0YW5jZXMgdmlhIHRoZSBsYXVuY2ggY29uZmlndXJhdGlvblxuICAgKiBzZWN1cml0eSBncm91cHMgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBzZWN1cml0eUdyb3VwOiBUaGUgc2VjdXJpdHkgZ3JvdXAgdG8gYWRkXG4gICAqL1xuICBwdWJsaWMgYWRkU2VjdXJpdHlHcm91cChzZWN1cml0eUdyb3VwOiBlYzIuSVNlY3VyaXR5R3JvdXApOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2VjdXJpdHlHcm91cHMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGNhbm5vdCBhZGQgc2VjdXJpdHkgZ3JvdXBzIHdoZW4gdGhlIEF1dG8gU2NhbGluZyBHcm91cCBpcyBjcmVhdGVkIGZyb20gYSBMYXVuY2ggVGVtcGxhdGUuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZWN1cml0eUdyb3Vwcy5wdXNoKHNlY3VyaXR5R3JvdXApO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaCB0byBhIGNsYXNzaWMgbG9hZCBiYWxhbmNlclxuICAgKi9cbiAgcHVibGljIGF0dGFjaFRvQ2xhc3NpY0xCKGxvYWRCYWxhbmNlcjogZWxiLkxvYWRCYWxhbmNlcik6IHZvaWQge1xuICAgIHRoaXMubG9hZEJhbGFuY2VyTmFtZXMucHVzaChsb2FkQmFsYW5jZXIubG9hZEJhbGFuY2VyTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoIHRvIEVMQnYyIEFwcGxpY2F0aW9uIFRhcmdldCBHcm91cFxuICAgKi9cbiAgcHVibGljIGF0dGFjaFRvQXBwbGljYXRpb25UYXJnZXRHcm91cCh0YXJnZXRHcm91cDogZWxidjIuSUFwcGxpY2F0aW9uVGFyZ2V0R3JvdXApOiBlbGJ2Mi5Mb2FkQmFsYW5jZXJUYXJnZXRQcm9wcyB7XG4gICAgdGhpcy50YXJnZXRHcm91cEFybnMucHVzaCh0YXJnZXRHcm91cC50YXJnZXRHcm91cEFybik7XG4gICAgaWYgKHRhcmdldEdyb3VwIGluc3RhbmNlb2YgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cCkge1xuICAgICAgLy8gQ29weSBvbnRvIHNlbGYgaWYgaXQncyBhIGNvbmNyZXRlIHR5cGUuIFdlIG5lZWQgdGhpcyBmb3IgYXV0b3NjYWxpbmdcbiAgICAgIC8vIGJhc2VkIG9uIHJlcXVlc3QgY291bnQsIHdoaWNoIHdlIGNhbm5vdCBkbyB3aXRoIGFuIGltcG9ydGVkIFRhcmdldEdyb3VwLlxuICAgICAgdGhpcy5hbGJUYXJnZXRHcm91cCA9IHRhcmdldEdyb3VwO1xuICAgIH1cblxuICAgIHRhcmdldEdyb3VwLnJlZ2lzdGVyQ29ubmVjdGFibGUodGhpcyk7XG4gICAgcmV0dXJuIHsgdGFyZ2V0VHlwZTogZWxidjIuVGFyZ2V0VHlwZS5JTlNUQU5DRSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGFjaCB0byBFTEJ2MiBBcHBsaWNhdGlvbiBUYXJnZXQgR3JvdXBcbiAgICovXG4gIHB1YmxpYyBhdHRhY2hUb05ldHdvcmtUYXJnZXRHcm91cCh0YXJnZXRHcm91cDogZWxidjIuSU5ldHdvcmtUYXJnZXRHcm91cCk6IGVsYnYyLkxvYWRCYWxhbmNlclRhcmdldFByb3BzIHtcbiAgICB0aGlzLnRhcmdldEdyb3VwQXJucy5wdXNoKHRhcmdldEdyb3VwLnRhcmdldEdyb3VwQXJuKTtcbiAgICByZXR1cm4geyB0YXJnZXRUeXBlOiBlbGJ2Mi5UYXJnZXRUeXBlLklOU1RBTkNFIH07XG4gIH1cblxuICBwdWJsaWMgYWRkVXNlckRhdGEoLi4uY29tbWFuZHM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdGhpcy51c2VyRGF0YS5hZGRDb21tYW5kcyguLi5jb21tYW5kcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHN0YXRlbWVudCB0byB0aGUgSUFNIHJvbGUgYXNzdW1lZCBieSBpbnN0YW5jZXMgb2YgdGhpcyBmbGVldC5cbiAgICovXG4gIHB1YmxpYyBhZGRUb1JvbGVQb2xpY3koc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KSB7XG4gICAgdGhpcy5yb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KHN0YXRlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIGEgQ2xvdWRGb3JtYXRpb24gSW5pdCBjb25maWd1cmF0aW9uIGF0IGluc3RhbmNlIHN0YXJ0dXBcbiAgICpcbiAgICogVGhpcyBkb2VzIHRoZSBmb2xsb3dpbmc6XG4gICAqXG4gICAqIC0gQXR0YWNoZXMgdGhlIENsb3VkRm9ybWF0aW9uIEluaXQgbWV0YWRhdGEgdG8gdGhlIEF1dG9TY2FsaW5nR3JvdXAgcmVzb3VyY2UuXG4gICAqIC0gQWRkIGNvbW1hbmRzIHRvIHRoZSBVc2VyRGF0YSB0byBydW4gYGNmbi1pbml0YCBhbmQgYGNmbi1zaWduYWxgLlxuICAgKiAtIFVwZGF0ZSB0aGUgaW5zdGFuY2UncyBDcmVhdGlvblBvbGljeSB0byB3YWl0IGZvciBgY2ZuLWluaXRgIHRvIGZpbmlzaFxuICAgKiAgIGJlZm9yZSByZXBvcnRpbmcgc3VjY2Vzcy5cbiAgICovXG4gIHB1YmxpYyBhcHBseUNsb3VkRm9ybWF0aW9uSW5pdChpbml0OiBlYzIuQ2xvdWRGb3JtYXRpb25Jbml0LCBvcHRpb25zOiBBcHBseUNsb3VkRm9ybWF0aW9uSW5pdE9wdGlvbnMgPSB7fSkge1xuICAgIGlmICghdGhpcy5hdXRvU2NhbGluZ0dyb3VwLmNmbk9wdGlvbnMuY3JlYXRpb25Qb2xpY3k/LnJlc291cmNlU2lnbmFsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1doZW4gYXBwbHlpbmcgQ2xvdWRGb3JtYXRpb25Jbml0LCB5b3UgbXVzdCBhbHNvIGNvbmZpZ3VyZSBzaWduYWxzIGJ5IHN1cHBseWluZyBcXCdzaWduYWxzXFwnIGF0IGluc3RhbnRpYXRpb24gdGltZS4nKTtcbiAgICB9XG5cbiAgICBpbml0LmF0dGFjaCh0aGlzLmF1dG9TY2FsaW5nR3JvdXAsIHtcbiAgICAgIHBsYXRmb3JtOiB0aGlzLm9zVHlwZSxcbiAgICAgIGluc3RhbmNlUm9sZTogdGhpcy5yb2xlLFxuICAgICAgdXNlckRhdGE6IHRoaXMudXNlckRhdGEsXG4gICAgICBjb25maWdTZXRzOiBvcHRpb25zLmNvbmZpZ1NldHMsXG4gICAgICBlbWJlZEZpbmdlcnByaW50OiBvcHRpb25zLmVtYmVkRmluZ2VycHJpbnQsXG4gICAgICBwcmludExvZzogb3B0aW9ucy5wcmludExvZyxcbiAgICAgIGlnbm9yZUZhaWx1cmVzOiBvcHRpb25zLmlnbm9yZUZhaWx1cmVzLFxuICAgICAgaW5jbHVkZVJvbGU6IG9wdGlvbnMuaW5jbHVkZVJvbGUsXG4gICAgICBpbmNsdWRlVXJsOiBvcHRpb25zLmluY2x1ZGVVcmwsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRW5zdXJlcyBuZXdseS1sYXVuY2hlZCBpbnN0YW5jZXMgYXJlIHByb3RlY3RlZCBmcm9tIHNjYWxlLWluLlxuICAgKi9cbiAgcHVibGljIHByb3RlY3ROZXdJbnN0YW5jZXNGcm9tU2NhbGVJbigpIHtcbiAgICB0aGlzLm5ld0luc3RhbmNlc1Byb3RlY3RlZEZyb21TY2FsZUluID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGB0cnVlYCBpZiBuZXdseS1sYXVuY2hlZCBpbnN0YW5jZXMgYXJlIHByb3RlY3RlZCBmcm9tIHNjYWxlLWluLlxuICAgKi9cbiAgcHVibGljIGFyZU5ld0luc3RhbmNlc1Byb3RlY3RlZEZyb21TY2FsZUluKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm5ld0luc3RhbmNlc1Byb3RlY3RlZEZyb21TY2FsZUluID09PSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBuZXR3b3JrIGNvbm5lY3Rpb25zIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHJlc291cmNlLlxuICAgKi9cbiAgcHVibGljIGdldCBjb25uZWN0aW9ucygpOiBlYzIuQ29ubmVjdGlvbnMge1xuICAgIGlmICh0aGlzLl9jb25uZWN0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25zO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmxhdW5jaFRlbXBsYXRlKSB7XG4gICAgICByZXR1cm4gdGhpcy5sYXVuY2hUZW1wbGF0ZS5jb25uZWN0aW9ucztcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0F1dG9TY2FsaW5nR3JvdXAgY2FuIG9ubHkgYmUgdXNlZCBhcyBJQ29ubmVjdGFibGUgaWYgaXQgaXMgbm90IGNyZWF0ZWQgZnJvbSBhbiBpbXBvcnRlZCBMYXVuY2ggVGVtcGxhdGUuJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIEJhc2U2NC1lbmNvZGVkIHVzZXIgZGF0YSB0byBtYWtlIGF2YWlsYWJsZSB0byB0aGUgbGF1bmNoZWQgRUMyIGluc3RhbmNlcy5cbiAgICpcbiAgICogQHRocm93cyBhbiBlcnJvciBpZiBhIGxhdW5jaCB0ZW1wbGF0ZSBpcyBnaXZlbiBhbmQgaXQgZG9lcyBub3QgcHJvdmlkZSBhIG5vbi1udWxsIGB1c2VyRGF0YWBcbiAgICovXG4gIHB1YmxpYyBnZXQgdXNlckRhdGEoKTogZWMyLlVzZXJEYXRhIHtcbiAgICBpZiAodGhpcy5fdXNlckRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLl91c2VyRGF0YTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5sYXVuY2hUZW1wbGF0ZT8udXNlckRhdGEpIHtcbiAgICAgIHJldHVybiB0aGlzLmxhdW5jaFRlbXBsYXRlLnVzZXJEYXRhO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcignVGhlIHByb3ZpZGVkIGxhdW5jaCB0ZW1wbGF0ZSBkb2VzIG5vdCBleHBvc2UgaXRzIHVzZXIgZGF0YS4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgSUFNIFJvbGUgaW4gdGhlIGluc3RhbmNlIHByb2ZpbGVcbiAgICpcbiAgICogQHRocm93cyBhbiBlcnJvciBpZiBhIGxhdW5jaCB0ZW1wbGF0ZSBpcyBnaXZlblxuICAgKi9cbiAgcHVibGljIGdldCByb2xlKCk6IGlhbS5JUm9sZSB7XG4gICAgaWYgKHRoaXMuX3JvbGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yb2xlO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcignVGhlIHByb3ZpZGVkIGxhdW5jaCB0ZW1wbGF0ZSBkb2VzIG5vdCBleHBvc2Ugb3IgZG9lcyBub3QgZGVmaW5lIGl0cyByb2xlLicpO1xuICB9XG5cbiAgcHJpdmF0ZSB2ZXJpZnlOb0xhdW5jaENvbmZpZ1Byb3BJc0dpdmVuKHByb3BzOiBBdXRvU2NhbGluZ0dyb3VwUHJvcHMpIHtcbiAgICBpZiAocHJvcHMubWFjaGluZUltYWdlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmcgXFwnbWFjaGluZUltYWdlXFwnIG11c3Qgbm90IGJlIHNldCB3aGVuIFxcJ2xhdW5jaFRlbXBsYXRlXFwnIG9yIFxcJ21peGVkSW5zdGFuY2VzUG9saWN5XFwnIGlzIHNldCcpO1xuICAgIH1cbiAgICBpZiAocHJvcHMuaW5zdGFuY2VUeXBlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmcgXFwnaW5zdGFuY2VUeXBlXFwnIG11c3Qgbm90IGJlIHNldCB3aGVuIFxcJ2xhdW5jaFRlbXBsYXRlXFwnIG9yIFxcJ21peGVkSW5zdGFuY2VzUG9saWN5XFwnIGlzIHNldCcpO1xuICAgIH1cbiAgICBpZiAocHJvcHMucm9sZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXR0aW5nIFxcJ3JvbGVcXCcgbXVzdCBub3QgYmUgc2V0IHdoZW4gXFwnbGF1bmNoVGVtcGxhdGVcXCcgb3IgXFwnbWl4ZWRJbnN0YW5jZXNQb2xpY3lcXCcgaXMgc2V0Jyk7XG4gICAgfVxuICAgIGlmIChwcm9wcy51c2VyRGF0YSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXR0aW5nIFxcJ3VzZXJEYXRhXFwnIG11c3Qgbm90IGJlIHNldCB3aGVuIFxcJ2xhdW5jaFRlbXBsYXRlXFwnIG9yIFxcJ21peGVkSW5zdGFuY2VzUG9saWN5XFwnIGlzIHNldCcpO1xuICAgIH1cbiAgICBpZiAocHJvcHMuc2VjdXJpdHlHcm91cCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXR0aW5nIFxcJ3NlY3VyaXR5R3JvdXBcXCcgbXVzdCBub3QgYmUgc2V0IHdoZW4gXFwnbGF1bmNoVGVtcGxhdGVcXCcgb3IgXFwnbWl4ZWRJbnN0YW5jZXNQb2xpY3lcXCcgaXMgc2V0Jyk7XG4gICAgfVxuICAgIGlmIChwcm9wcy5rZXlOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmcgXFwna2V5TmFtZVxcJyBtdXN0IG5vdCBiZSBzZXQgd2hlbiBcXCdsYXVuY2hUZW1wbGF0ZVxcJyBvciBcXCdtaXhlZEluc3RhbmNlc1BvbGljeVxcJyBpcyBzZXQnKTtcbiAgICB9XG4gICAgaWYgKHByb3BzLmluc3RhbmNlTW9uaXRvcmluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXR0aW5nIFxcJ2luc3RhbmNlTW9uaXRvcmluZ1xcJyBtdXN0IG5vdCBiZSBzZXQgd2hlbiBcXCdsYXVuY2hUZW1wbGF0ZVxcJyBvciBcXCdtaXhlZEluc3RhbmNlc1BvbGljeVxcJyBpcyBzZXQnKTtcbiAgICB9XG4gICAgaWYgKHByb3BzLmFzc29jaWF0ZVB1YmxpY0lwQWRkcmVzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmcgXFwnYXNzb2NpYXRlUHVibGljSXBBZGRyZXNzXFwnIG11c3Qgbm90IGJlIHNldCB3aGVuIFxcJ2xhdW5jaFRlbXBsYXRlXFwnIG9yIFxcJ21peGVkSW5zdGFuY2VzUG9saWN5XFwnIGlzIHNldCcpO1xuICAgIH1cbiAgICBpZiAocHJvcHMuc3BvdFByaWNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmcgXFwnc3BvdFByaWNlXFwnIG11c3Qgbm90IGJlIHNldCB3aGVuIFxcJ2xhdW5jaFRlbXBsYXRlXFwnIG9yIFxcJ21peGVkSW5zdGFuY2VzUG9saWN5XFwnIGlzIHNldCcpO1xuICAgIH1cbiAgICBpZiAocHJvcHMuYmxvY2tEZXZpY2VzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NldHRpbmcgXFwnYmxvY2tEZXZpY2VzXFwnIG11c3Qgbm90IGJlIHNldCB3aGVuIFxcJ2xhdW5jaFRlbXBsYXRlXFwnIG9yIFxcJ21peGVkSW5zdGFuY2VzUG9saWN5XFwnIGlzIHNldCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBDbG91ZEZvcm1hdGlvbiB1cGRhdGUgcG9saWNpZXMgZm9yIHRoZSBBdXRvU2NhbGluZ0dyb3VwXG4gICAqL1xuICBwcml2YXRlIGFwcGx5VXBkYXRlUG9saWNpZXMocHJvcHM6IEF1dG9TY2FsaW5nR3JvdXBQcm9wcywgc2lnbmFsT3B0aW9uczogUmVuZGVyU2lnbmFsc09wdGlvbnMpIHtcbiAgICAvLyBNYWtlIHN1cmUgcGVvcGxlIGFyZSBub3QgdXNpbmcgdGhlIG9sZCBhbmQgbmV3IHByb3BlcnRpZXMgdG9nZXRoZXJcbiAgICBjb25zdCBvbGRQcm9wczogQXJyYXk8a2V5b2YgQXV0b1NjYWxpbmdHcm91cFByb3BzPiA9IFtcbiAgICAgICd1cGRhdGVUeXBlJyxcbiAgICAgICdyb2xsaW5nVXBkYXRlQ29uZmlndXJhdGlvbicsXG4gICAgICAncmVzb3VyY2VTaWduYWxDb3VudCcsXG4gICAgICAncmVzb3VyY2VTaWduYWxUaW1lb3V0JyxcbiAgICAgICdyZXBsYWNpbmdVcGRhdGVNaW5TdWNjZXNzZnVsSW5zdGFuY2VzUGVyY2VudCcsXG4gICAgXTtcbiAgICBmb3IgKGNvbnN0IHByb3Agb2Ygb2xkUHJvcHMpIHtcbiAgICAgIGlmICgocHJvcHMuc2lnbmFscyB8fCBwcm9wcy51cGRhdGVQb2xpY3kpICYmIHByb3BzW3Byb3BdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3Qgc2V0ICdzaWduYWxzJy8ndXBkYXRlUG9saWN5JyBhbmQgJyR7cHJvcH0nIHRvZ2V0aGVyLiBQcmVmZXIgJ3NpZ25hbHMnLyd1cGRhdGVQb2xpY3knYCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVpZnkgdXBkYXRlUG9saWN5IHRvIGByb2xsaW5nVXBkYXRlYCBkZWZhdWx0IGluIGNhc2UgaXQgaXMgY29tYmluZWQgd2l0aCBgaW5pdGBcbiAgICBwcm9wcyA9IHtcbiAgICAgIC4uLnByb3BzLFxuICAgICAgdXBkYXRlUG9saWN5OiBwcm9wcy51cGRhdGVQb2xpY3kgPz8gKHByb3BzLmluaXQgPyBVcGRhdGVQb2xpY3kucm9sbGluZ1VwZGF0ZSgpIDogdW5kZWZpbmVkKSxcbiAgICB9O1xuXG4gICAgaWYgKHByb3BzLnNpZ25hbHMgfHwgcHJvcHMudXBkYXRlUG9saWN5KSB7XG4gICAgICB0aGlzLmFwcGx5TmV3U2lnbmFsVXBkYXRlUG9saWNpZXMocHJvcHMsIHNpZ25hbE9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFwcGx5TGVnYWN5U2lnbmFsVXBkYXRlUG9saWNpZXMocHJvcHMpO1xuICAgIH1cblxuICAgIC8vIFRoZSBmb2xsb3dpbmcgaXMgdGVjaG5pY2FsbHkgcGFydCBvZiB0aGUgXCJ1cGRhdGUgcG9saWN5XCIgYnV0IGl0J3MgYWxzbyBhIGNvbXBsZXRlbHlcbiAgICAvLyBzZXBhcmF0ZSBhc3BlY3Qgb2Ygcm9sbGluZy9yZXBsYWNpbmcgdXBkYXRlLCBzbyBpdCdzIGp1c3QgaXRzIG93biB0b3AtbGV2ZWwgcHJvcGVydHkuXG4gICAgLy8gRGVmYXVsdCBpcyAndHJ1ZScgYmVjYXVzZSB0aGF0J3Mgd2hhdCB5b3UncmUgbW9zdCBsaWtlbHkgdG8gd2FudFxuICAgIGlmIChwcm9wcy5pZ25vcmVVbm1vZGlmaWVkU2l6ZVByb3BlcnRpZXMgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmF1dG9TY2FsaW5nR3JvdXAuY2ZuT3B0aW9ucy51cGRhdGVQb2xpY3kgPSB7XG4gICAgICAgIC4uLnRoaXMuYXV0b1NjYWxpbmdHcm91cC5jZm5PcHRpb25zLnVwZGF0ZVBvbGljeSxcbiAgICAgICAgYXV0b1NjYWxpbmdTY2hlZHVsZWRBY3Rpb246IHsgaWdub3JlVW5tb2RpZmllZEdyb3VwU2l6ZVByb3BlcnRpZXM6IHRydWUgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnNpZ25hbHMgJiYgIXByb3BzLmluaXQpIHtcbiAgICAgIC8vIFRvIGJlIGFibGUgdG8gc2VuZCBhIHNpZ25hbCB1c2luZyBgY2ZuLWluaXRgLCB0aGUgZXhlY3V0aW9uIHJvbGUgbmVlZHNcbiAgICAgIC8vIGBjbG91ZGZvcm1hdGlvbjpTaWduYWxSZXNvdXJjZWAuIE5vcm1hbGx5IHRoZSBiaW5kaW5nIG9mIENmbkluaXQgd291bGRcbiAgICAgIC8vIGdyYW50IHRoYXQgcGVybWlzc2lvbnMgYW5kIGFub3RoZXIgb25lLCBidXQgaWYgdGhlIHVzZXIgd2FudHMgdG8gdXNlXG4gICAgICAvLyBgc2lnbmFsc2Agd2l0aG91dCBgaW5pdGAsIGFkZCB0aGUgcGVybWlzc2lvbnMgaGVyZS5cbiAgICAgIC8vXG4gICAgICAvLyBJZiB0aGV5IGNhbGwgYGFwcGx5Q2xvdWRGb3JtYXRpb25Jbml0KClgIGFmdGVyIGNvbnN0cnVjdGlvbiwgbm90aGluZyBiYWRcbiAgICAgIC8vIGhhcHBlbnMgZWl0aGVyLCB3ZSdsbCBqdXN0IGhhdmUgYSBkdXBsaWNhdGUgc3RhdGVtZW50IHdoaWNoIGRvZXNuJ3QgaHVydC5cbiAgICAgIHRoaXMuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWydjbG91ZGZvcm1hdGlvbjpTaWduYWxSZXNvdXJjZSddLFxuICAgICAgICByZXNvdXJjZXM6IFtBd3MuU1RBQ0tfSURdLFxuICAgICAgfSkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgJ3NpZ25hbHMnIGFuZCAndXBkYXRlUG9saWN5JyB0byBkZXRlcm1pbmUgdGhlIGNyZWF0aW9uIGFuZCB1cGRhdGUgcG9saWNpZXNcbiAgICovXG4gIHByaXZhdGUgYXBwbHlOZXdTaWduYWxVcGRhdGVQb2xpY2llcyhwcm9wczogQXV0b1NjYWxpbmdHcm91cFByb3BzLCBzaWduYWxPcHRpb25zOiBSZW5kZXJTaWduYWxzT3B0aW9ucykge1xuICAgIHRoaXMuYXV0b1NjYWxpbmdHcm91cC5jZm5PcHRpb25zLmNyZWF0aW9uUG9saWN5ID0gcHJvcHMuc2lnbmFscz8ucmVuZGVyQ3JlYXRpb25Qb2xpY3koc2lnbmFsT3B0aW9ucyk7XG4gICAgdGhpcy5hdXRvU2NhbGluZ0dyb3VwLmNmbk9wdGlvbnMudXBkYXRlUG9saWN5ID0gcHJvcHMudXBkYXRlUG9saWN5Py5fcmVuZGVyVXBkYXRlUG9saWN5KHtcbiAgICAgIGNyZWF0aW9uUG9saWN5OiB0aGlzLmF1dG9TY2FsaW5nR3JvdXAuY2ZuT3B0aW9ucy5jcmVhdGlvblBvbGljeSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXBwbHlMZWdhY3lTaWduYWxVcGRhdGVQb2xpY2llcyhwcm9wczogQXV0b1NjYWxpbmdHcm91cFByb3BzKSB7XG4gICAgaWYgKHByb3BzLnVwZGF0ZVR5cGUgPT09IFVwZGF0ZVR5cGUuUkVQTEFDSU5HX1VQREFURSkge1xuICAgICAgdGhpcy5hdXRvU2NhbGluZ0dyb3VwLmNmbk9wdGlvbnMudXBkYXRlUG9saWN5ID0ge1xuICAgICAgICAuLi50aGlzLmF1dG9TY2FsaW5nR3JvdXAuY2ZuT3B0aW9ucy51cGRhdGVQb2xpY3ksXG4gICAgICAgIGF1dG9TY2FsaW5nUmVwbGFjaW5nVXBkYXRlOiB7XG4gICAgICAgICAgd2lsbFJlcGxhY2U6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICBpZiAocHJvcHMucmVwbGFjaW5nVXBkYXRlTWluU3VjY2Vzc2Z1bEluc3RhbmNlc1BlcmNlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBZZXMsIHRoaXMgZ29lcyBvbiBDcmVhdGlvblBvbGljeSwgbm90IGFzIGEgcHJvY2VzcyBwYXJhbWV0ZXIgdG8gUmVwbGFjaW5nVXBkYXRlLlxuICAgICAgICAvLyBJdCdzIGEgbGl0dGxlIGNvbmZ1c2luZywgYnV0IHRoZSBkb2NzIHNlZW0gdG8gZXhwbGljaXRseSBzdGF0ZSBpdCB3aWxsIG9ubHkgYmUgdXNlZFxuICAgICAgICAvLyBkdXJpbmcgdGhlIHVwZGF0ZT9cbiAgICAgICAgLy9cbiAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLWF0dHJpYnV0ZS1jcmVhdGlvbnBvbGljeS5odG1sXG4gICAgICAgIHRoaXMuYXV0b1NjYWxpbmdHcm91cC5jZm5PcHRpb25zLmNyZWF0aW9uUG9saWN5ID0ge1xuICAgICAgICAgIC4uLnRoaXMuYXV0b1NjYWxpbmdHcm91cC5jZm5PcHRpb25zLmNyZWF0aW9uUG9saWN5LFxuICAgICAgICAgIGF1dG9TY2FsaW5nQ3JlYXRpb25Qb2xpY3k6IHtcbiAgICAgICAgICAgIG1pblN1Y2Nlc3NmdWxJbnN0YW5jZXNQZXJjZW50OiB2YWxpZGF0ZVBlcmNlbnRhZ2UocHJvcHMucmVwbGFjaW5nVXBkYXRlTWluU3VjY2Vzc2Z1bEluc3RhbmNlc1BlcmNlbnQpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChwcm9wcy51cGRhdGVUeXBlID09PSBVcGRhdGVUeXBlLlJPTExJTkdfVVBEQVRFKSB7XG4gICAgICB0aGlzLmF1dG9TY2FsaW5nR3JvdXAuY2ZuT3B0aW9ucy51cGRhdGVQb2xpY3kgPSB7XG4gICAgICAgIC4uLnRoaXMuYXV0b1NjYWxpbmdHcm91cC5jZm5PcHRpb25zLnVwZGF0ZVBvbGljeSxcbiAgICAgICAgYXV0b1NjYWxpbmdSb2xsaW5nVXBkYXRlOiByZW5kZXJSb2xsaW5nVXBkYXRlQ29uZmlnKHByb3BzLnJvbGxpbmdVcGRhdGVDb25maWd1cmF0aW9uKSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnJlc291cmNlU2lnbmFsQ291bnQgIT09IHVuZGVmaW5lZCB8fCBwcm9wcy5yZXNvdXJjZVNpZ25hbFRpbWVvdXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5hdXRvU2NhbGluZ0dyb3VwLmNmbk9wdGlvbnMuY3JlYXRpb25Qb2xpY3kgPSB7XG4gICAgICAgIC4uLnRoaXMuYXV0b1NjYWxpbmdHcm91cC5jZm5PcHRpb25zLmNyZWF0aW9uUG9saWN5LFxuICAgICAgICByZXNvdXJjZVNpZ25hbDoge1xuICAgICAgICAgIGNvdW50OiBwcm9wcy5yZXNvdXJjZVNpZ25hbENvdW50LFxuICAgICAgICAgIHRpbWVvdXQ6IHByb3BzLnJlc291cmNlU2lnbmFsVGltZW91dCAmJiBwcm9wcy5yZXNvdXJjZVNpZ25hbFRpbWVvdXQudG9Jc29TdHJpbmcoKSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJOb3RpZmljYXRpb25Db25maWd1cmF0aW9uKCk6IENmbkF1dG9TY2FsaW5nR3JvdXAuTm90aWZpY2F0aW9uQ29uZmlndXJhdGlvblByb3BlcnR5W10gfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLm5vdGlmaWNhdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm5vdGlmaWNhdGlvbnMubWFwKG5vdGlmaWNhdGlvbiA9PiAoe1xuICAgICAgdG9waWNBcm46IG5vdGlmaWNhdGlvbi50b3BpYy50b3BpY0FybixcbiAgICAgIG5vdGlmaWNhdGlvblR5cGVzOiBub3RpZmljYXRpb24uc2NhbGluZ0V2ZW50cyA/IG5vdGlmaWNhdGlvbi5zY2FsaW5nRXZlbnRzLl90eXBlcyA6IFNjYWxpbmdFdmVudHMuQUxMLl90eXBlcyxcbiAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlck1ldHJpY3NDb2xsZWN0aW9uKCk6IENmbkF1dG9TY2FsaW5nR3JvdXAuTWV0cmljc0NvbGxlY3Rpb25Qcm9wZXJ0eVtdIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5ncm91cE1ldHJpY3MubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmdyb3VwTWV0cmljcy5tYXAoZ3JvdXAgPT4gKHtcbiAgICAgIGdyYW51bGFyaXR5OiAnMU1pbnV0ZScsXG4gICAgICBtZXRyaWNzOiBncm91cC5fbWV0cmljcz8uc2l6ZSAhPT0gMCA/IFsuLi5ncm91cC5fbWV0cmljc10ubWFwKG0gPT4gbS5uYW1lKSA6IHVuZGVmaW5lZCxcbiAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIGdldExhdW5jaFNldHRpbmdzKGxhdW5jaENvbmZpZz86IENmbkxhdW5jaENvbmZpZ3VyYXRpb24sIGxhdW5jaFRlbXBsYXRlPzogZWMyLklMYXVuY2hUZW1wbGF0ZSwgbWl4ZWRJbnN0YW5jZXNQb2xpY3k/OiBNaXhlZEluc3RhbmNlc1BvbGljeSlcbiAgICA6IFBpY2s8Q2ZuQXV0b1NjYWxpbmdHcm91cFByb3BzLCAnbGF1bmNoQ29uZmlndXJhdGlvbk5hbWUnPlxuICAgIHwgUGljazxDZm5BdXRvU2NhbGluZ0dyb3VwUHJvcHMsICdsYXVuY2hUZW1wbGF0ZSc+XG4gICAgfCBQaWNrPENmbkF1dG9TY2FsaW5nR3JvdXBQcm9wcywgJ21peGVkSW5zdGFuY2VzUG9saWN5Jz4ge1xuICAgIGlmIChsYXVuY2hDb25maWcpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxhdW5jaENvbmZpZ3VyYXRpb25OYW1lOiBsYXVuY2hDb25maWcucmVmLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAobGF1bmNoVGVtcGxhdGUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxhdW5jaFRlbXBsYXRlOiB0aGlzLmNvbnZlcnRJTGF1bmNoVGVtcGxhdGVUb1NwZWNpZmljYXRpb24obGF1bmNoVGVtcGxhdGUpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAobWl4ZWRJbnN0YW5jZXNQb2xpY3kpIHtcbiAgICAgIGxldCBpbnN0YW5jZXNEaXN0cmlidXRpb246IENmbkF1dG9TY2FsaW5nR3JvdXAuSW5zdGFuY2VzRGlzdHJpYnV0aW9uUHJvcGVydHkgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICBpZiAobWl4ZWRJbnN0YW5jZXNQb2xpY3kuaW5zdGFuY2VzRGlzdHJpYnV0aW9uKSB7XG4gICAgICAgIGNvbnN0IGRpc3QgPSBtaXhlZEluc3RhbmNlc1BvbGljeS5pbnN0YW5jZXNEaXN0cmlidXRpb247XG4gICAgICAgIGluc3RhbmNlc0Rpc3RyaWJ1dGlvbiA9IHtcbiAgICAgICAgICBvbkRlbWFuZEFsbG9jYXRpb25TdHJhdGVneTogZGlzdC5vbkRlbWFuZEFsbG9jYXRpb25TdHJhdGVneT8udG9TdHJpbmcoKSxcbiAgICAgICAgICBvbkRlbWFuZEJhc2VDYXBhY2l0eTogZGlzdC5vbkRlbWFuZEJhc2VDYXBhY2l0eSxcbiAgICAgICAgICBvbkRlbWFuZFBlcmNlbnRhZ2VBYm92ZUJhc2VDYXBhY2l0eTogZGlzdC5vbkRlbWFuZFBlcmNlbnRhZ2VBYm92ZUJhc2VDYXBhY2l0eSxcbiAgICAgICAgICBzcG90QWxsb2NhdGlvblN0cmF0ZWd5OiBkaXN0LnNwb3RBbGxvY2F0aW9uU3RyYXRlZ3k/LnRvU3RyaW5nKCksXG4gICAgICAgICAgc3BvdEluc3RhbmNlUG9vbHM6IGRpc3Quc3BvdEluc3RhbmNlUG9vbHMsXG4gICAgICAgICAgc3BvdE1heFByaWNlOiBkaXN0LnNwb3RNYXhQcmljZSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG1peGVkSW5zdGFuY2VzUG9saWN5OiB7XG4gICAgICAgICAgaW5zdGFuY2VzRGlzdHJpYnV0aW9uLFxuICAgICAgICAgIGxhdW5jaFRlbXBsYXRlOiB7XG4gICAgICAgICAgICBsYXVuY2hUZW1wbGF0ZVNwZWNpZmljYXRpb246IHRoaXMuY29udmVydElMYXVuY2hUZW1wbGF0ZVRvU3BlY2lmaWNhdGlvbihtaXhlZEluc3RhbmNlc1BvbGljeS5sYXVuY2hUZW1wbGF0ZSksXG4gICAgICAgICAgICAuLi4obWl4ZWRJbnN0YW5jZXNQb2xpY3kubGF1bmNoVGVtcGxhdGVPdmVycmlkZXMgPyB7XG4gICAgICAgICAgICAgIG92ZXJyaWRlczogbWl4ZWRJbnN0YW5jZXNQb2xpY3kubGF1bmNoVGVtcGxhdGVPdmVycmlkZXMubWFwKG92ZXJyaWRlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAob3ZlcnJpZGUud2VpZ2h0ZWRDYXBhY2l0eSAmJiBNYXRoLmZsb29yKG92ZXJyaWRlLndlaWdodGVkQ2FwYWNpdHkpICE9PSBvdmVycmlkZS53ZWlnaHRlZENhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dlaWdodCBtdXN0IGJlIGFuIGludGVnZXInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgIGluc3RhbmNlVHlwZTogb3ZlcnJpZGUuaW5zdGFuY2VUeXBlLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICBsYXVuY2hUZW1wbGF0ZVNwZWNpZmljYXRpb246IG92ZXJyaWRlLmxhdW5jaFRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5jb252ZXJ0SUxhdW5jaFRlbXBsYXRlVG9TcGVjaWZpY2F0aW9uKG92ZXJyaWRlLmxhdW5jaFRlbXBsYXRlKVxuICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgIHdlaWdodGVkQ2FwYWNpdHk6IG92ZXJyaWRlLndlaWdodGVkQ2FwYWNpdHk/LnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB9IDoge30pLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcignRWl0aGVyIGxhdW5jaENvbmZpZywgbGF1bmNoVGVtcGxhdGUgb3IgbWl4ZWRJbnN0YW5jZXNQb2xpY3kgbmVlZHMgdG8gYmUgc3BlY2lmaWVkLicpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb252ZXJ0SUxhdW5jaFRlbXBsYXRlVG9TcGVjaWZpY2F0aW9uKGxhdW5jaFRlbXBsYXRlOiBlYzIuSUxhdW5jaFRlbXBsYXRlKTogQ2ZuQXV0b1NjYWxpbmdHcm91cC5MYXVuY2hUZW1wbGF0ZVNwZWNpZmljYXRpb25Qcm9wZXJ0eSB7XG4gICAgaWYgKGxhdW5jaFRlbXBsYXRlLmxhdW5jaFRlbXBsYXRlSWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxhdW5jaFRlbXBsYXRlSWQ6IGxhdW5jaFRlbXBsYXRlLmxhdW5jaFRlbXBsYXRlSWQsXG4gICAgICAgIHZlcnNpb246IGxhdW5jaFRlbXBsYXRlLnZlcnNpb25OdW1iZXIsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBsYXVuY2hUZW1wbGF0ZU5hbWU6IGxhdW5jaFRlbXBsYXRlLmxhdW5jaFRlbXBsYXRlTmFtZSxcbiAgICAgICAgdmVyc2lvbjogbGF1bmNoVGVtcGxhdGUudmVyc2lvbk51bWJlcixcbiAgICAgIH07XG4gICAgfVxuICB9XG5cblxuICBwcml2YXRlIHZhbGlkYXRlVGFyZ2V0R3JvdXAoKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgaWYgKHRoaXMuaGFzQ2FsbGVkU2NhbGVPblJlcXVlc3RDb3VudCAmJiB0aGlzLnRhcmdldEdyb3VwQXJucy5sZW5ndGggPiAxKSB7XG4gICAgICBlcnJvcnMucHVzaCgnQ2Fubm9uIHVzZSBtdWx0aXBsZSB0YXJnZXQgZ3JvdXBzIGlmIGBzY2FsZU9uUmVxdWVzdENvdW50KClgIGlzIGJlaW5nIHVzZWQuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVycm9ycztcbiAgfVxufVxuXG4vKipcbiAqIFRoZSB0eXBlIG9mIHVwZGF0ZSB0byBwZXJmb3JtIG9uIGluc3RhbmNlcyBpbiB0aGlzIEF1dG9TY2FsaW5nR3JvdXBcbiAqXG4gKiBAZGVwcmVjYXRlZCBVc2UgVXBkYXRlUG9saWN5IGluc3RlYWRcbiAqL1xuZXhwb3J0IGVudW0gVXBkYXRlVHlwZSB7XG4gIC8qKlxuICAgKiBEb24ndCBkbyBhbnl0aGluZ1xuICAgKi9cbiAgTk9ORSA9ICdOb25lJyxcblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgZW50aXJlIEF1dG9TY2FsaW5nR3JvdXBcbiAgICpcbiAgICogQnVpbGRzIGEgbmV3IEF1dG9TY2FsaW5nR3JvdXAgZmlyc3QsIHRoZW4gZGVsZXRlIHRoZSBvbGQgb25lLlxuICAgKi9cbiAgUkVQTEFDSU5HX1VQREFURSA9ICdSZXBsYWNlJyxcblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgaW5zdGFuY2VzIGluIHRoZSBBdXRvU2NhbGluZ0dyb3VwLlxuICAgKi9cbiAgUk9MTElOR19VUERBVEUgPSAnUm9sbGluZ1VwZGF0ZScsXG59XG5cbi8qKlxuICogQXV0b1NjYWxpbmdHcm91cCBmbGVldCBjaGFuZ2Ugbm90aWZpY2F0aW9ucyBjb25maWd1cmF0aW9ucy5cbiAqIFlvdSBjYW4gY29uZmlndXJlIEF1dG9TY2FsaW5nIHRvIHNlbmQgYW4gU05TIG5vdGlmaWNhdGlvbiB3aGVuZXZlciB5b3VyIEF1dG8gU2NhbGluZyBncm91cCBzY2FsZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTm90aWZpY2F0aW9uQ29uZmlndXJhdGlvbiB7XG4gIC8qKlxuICAgKiBTTlMgdG9waWMgdG8gc2VuZCBub3RpZmljYXRpb25zIGFib3V0IGZsZWV0IHNjYWxpbmcgZXZlbnRzXG4gICAqL1xuICByZWFkb25seSB0b3BpYzogc25zLklUb3BpYztcblxuICAvKipcbiAgICogV2hpY2ggZmxlZXQgc2NhbGluZyBldmVudHMgdHJpZ2dlcnMgYSBub3RpZmljYXRpb25cbiAgICogQGRlZmF1bHQgU2NhbGluZ0V2ZW50cy5BTExcbiAgICovXG4gIHJlYWRvbmx5IHNjYWxpbmdFdmVudHM/OiBTY2FsaW5nRXZlbnRzO1xufVxuXG4vKipcbiAqIEZsZWV0IHNjYWxpbmcgZXZlbnRzXG4gKi9cbmV4cG9ydCBlbnVtIFNjYWxpbmdFdmVudCB7XG4gIC8qKlxuICAgKiBOb3RpZnkgd2hlbiBhbiBpbnN0YW5jZSB3YXMgbGF1bmNoZWRcbiAgICovXG4gIElOU1RBTkNFX0xBVU5DSCA9ICdhdXRvc2NhbGluZzpFQzJfSU5TVEFOQ0VfTEFVTkNIJyxcblxuICAvKipcbiAgICogTm90aWZ5IHdoZW4gYW4gaW5zdGFuY2Ugd2FzIHRlcm1pbmF0ZWRcbiAgICovXG4gIElOU1RBTkNFX1RFUk1JTkFURSA9ICdhdXRvc2NhbGluZzpFQzJfSU5TVEFOQ0VfVEVSTUlOQVRFJyxcblxuICAvKipcbiAgICogTm90aWZ5IHdoZW4gYW4gaW5zdGFuY2UgZmFpbGVkIHRvIHRlcm1pbmF0ZVxuICAgKi9cbiAgSU5TVEFOQ0VfVEVSTUlOQVRFX0VSUk9SID0gJ2F1dG9zY2FsaW5nOkVDMl9JTlNUQU5DRV9URVJNSU5BVEVfRVJST1InLFxuXG4gIC8qKlxuICAgKiBOb3RpZnkgd2hlbiBhbiBpbnN0YW5jZSBmYWlsZWQgdG8gbGF1bmNoXG4gICAqL1xuICBJTlNUQU5DRV9MQVVOQ0hfRVJST1IgPSAnYXV0b3NjYWxpbmc6RUMyX0lOU1RBTkNFX0xBVU5DSF9FUlJPUicsXG5cbiAgLyoqXG4gICAqIFNlbmQgYSB0ZXN0IG5vdGlmaWNhdGlvbiB0byB0aGUgdG9waWNcbiAgICovXG4gIFRFU1RfTk9USUZJQ0FUSU9OID0gJ2F1dG9zY2FsaW5nOlRFU1RfTk9USUZJQ0FUSU9OJ1xufVxuXG4vKipcbiAqIEFkZGl0aW9uYWwgc2V0dGluZ3Mgd2hlbiBhIHJvbGxpbmcgdXBkYXRlIGlzIHNlbGVjdGVkXG4gKiBAZGVwcmVjYXRlZCB1c2UgYFVwZGF0ZVBvbGljeS5yb2xsaW5nVXBkYXRlKClgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUm9sbGluZ1VwZGF0ZUNvbmZpZ3VyYXRpb24ge1xuICAvKipcbiAgICogVGhlIG1heGltdW0gbnVtYmVyIG9mIGluc3RhbmNlcyB0aGF0IEFXUyBDbG91ZEZvcm1hdGlvbiB1cGRhdGVzIGF0IG9uY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IDFcbiAgICovXG4gIHJlYWRvbmx5IG1heEJhdGNoU2l6ZT86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIG1pbmltdW0gbnVtYmVyIG9mIGluc3RhbmNlcyB0aGF0IG11c3QgYmUgaW4gc2VydmljZSBiZWZvcmUgbW9yZSBpbnN0YW5jZXMgYXJlIHJlcGxhY2VkLlxuICAgKlxuICAgKiBUaGlzIG51bWJlciBhZmZlY3RzIHRoZSBzcGVlZCBvZiB0aGUgcmVwbGFjZW1lbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IDBcbiAgICovXG4gIHJlYWRvbmx5IG1pbkluc3RhbmNlc0luU2VydmljZT86IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHBlcmNlbnRhZ2Ugb2YgaW5zdGFuY2VzIHRoYXQgbXVzdCBzaWduYWwgc3VjY2VzcyBmb3IgYW4gdXBkYXRlIHRvIHN1Y2NlZWQuXG4gICAqXG4gICAqIElmIGFuIGluc3RhbmNlIGRvZXNuJ3Qgc2VuZCBhIHNpZ25hbCB3aXRoaW4gdGhlIHRpbWUgc3BlY2lmaWVkIGluIHRoZVxuICAgKiBwYXVzZVRpbWUgcHJvcGVydHksIEFXUyBDbG91ZEZvcm1hdGlvbiBhc3N1bWVzIHRoYXQgdGhlIGluc3RhbmNlIHdhc24ndFxuICAgKiB1cGRhdGVkLlxuICAgKlxuICAgKiBUaGlzIG51bWJlciBhZmZlY3RzIHRoZSBzdWNjZXNzIG9mIHRoZSByZXBsYWNlbWVudC5cbiAgICpcbiAgICogSWYgeW91IHNwZWNpZnkgdGhpcyBwcm9wZXJ0eSwgeW91IG11c3QgYWxzbyBlbmFibGUgdGhlXG4gICAqIHdhaXRPblJlc291cmNlU2lnbmFscyBhbmQgcGF1c2VUaW1lIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IDEwMFxuICAgKi9cbiAgcmVhZG9ubHkgbWluU3VjY2Vzc2Z1bEluc3RhbmNlc1BlcmNlbnQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXVzZSB0aW1lIGFmdGVyIG1ha2luZyBhIGNoYW5nZSB0byBhIGJhdGNoIG9mIGluc3RhbmNlcy5cbiAgICpcbiAgICogVGhpcyBpcyBpbnRlbmRlZCB0byBnaXZlIHRob3NlIGluc3RhbmNlcyB0aW1lIHRvIHN0YXJ0IHNvZnR3YXJlIGFwcGxpY2F0aW9ucy5cbiAgICpcbiAgICogU3BlY2lmeSBQYXVzZVRpbWUgaW4gdGhlIElTTzg2MDEgZHVyYXRpb24gZm9ybWF0IChpbiB0aGUgZm9ybWF0XG4gICAqIFBUI0gjTSNTLCB3aGVyZSBlYWNoICMgaXMgdGhlIG51bWJlciBvZiBob3VycywgbWludXRlcywgYW5kIHNlY29uZHMsXG4gICAqIHJlc3BlY3RpdmVseSkuIFRoZSBtYXhpbXVtIFBhdXNlVGltZSBpcyBvbmUgaG91ciAoUFQxSCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLm1pbnV0ZXMoNSkgaWYgdGhlIHdhaXRPblJlc291cmNlU2lnbmFscyBwcm9wZXJ0eSBpcyB0cnVlLCBvdGhlcndpc2UgMFxuICAgKi9cbiAgcmVhZG9ubHkgcGF1c2VUaW1lPzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRoZSBBdXRvIFNjYWxpbmcgZ3JvdXAgd2FpdHMgb24gc2lnbmFscyBmcm9tIG5ldyBpbnN0YW5jZXMgZHVyaW5nIGFuIHVwZGF0ZS5cbiAgICpcbiAgICogQVdTIENsb3VkRm9ybWF0aW9uIG11c3QgcmVjZWl2ZSBhIHNpZ25hbCBmcm9tIGVhY2ggbmV3IGluc3RhbmNlIHdpdGhpblxuICAgKiB0aGUgc3BlY2lmaWVkIFBhdXNlVGltZSBiZWZvcmUgY29udGludWluZyB0aGUgdXBkYXRlLlxuICAgKlxuICAgKiBUbyBoYXZlIGluc3RhbmNlcyB3YWl0IGZvciBhbiBFbGFzdGljIExvYWQgQmFsYW5jaW5nIGhlYWx0aCBjaGVjayBiZWZvcmVcbiAgICogdGhleSBzaWduYWwgc3VjY2VzcywgYWRkIGEgaGVhbHRoLWNoZWNrIHZlcmlmaWNhdGlvbiBieSB1c2luZyB0aGVcbiAgICogY2ZuLWluaXQgaGVscGVyIHNjcmlwdC4gRm9yIGFuIGV4YW1wbGUsIHNlZSB0aGUgdmVyaWZ5X2luc3RhbmNlX2hlYWx0aFxuICAgKiBjb21tYW5kIGluIHRoZSBBdXRvIFNjYWxpbmcgcm9sbGluZyB1cGRhdGVzIHNhbXBsZSB0ZW1wbGF0ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZSBpZiB5b3Ugc3BlY2lmaWVkIHRoZSBtaW5TdWNjZXNzZnVsSW5zdGFuY2VzUGVyY2VudCBwcm9wZXJ0eSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICByZWFkb25seSB3YWl0T25SZXNvdXJjZVNpZ25hbHM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIEF1dG8gU2NhbGluZyBwcm9jZXNzZXMgdG8gc3VzcGVuZCBkdXJpbmcgYSBzdGFjayB1cGRhdGUuXG4gICAqXG4gICAqIFN1c3BlbmRpbmcgcHJvY2Vzc2VzIHByZXZlbnRzIEF1dG8gU2NhbGluZyBmcm9tIGludGVyZmVyaW5nIHdpdGggYSBzdGFja1xuICAgKiB1cGRhdGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IEhlYWx0aENoZWNrLCBSZXBsYWNlVW5oZWFsdGh5LCBBWlJlYmFsYW5jZSwgQWxhcm1Ob3RpZmljYXRpb24sIFNjaGVkdWxlZEFjdGlvbnMuXG4gICAqL1xuICByZWFkb25seSBzdXNwZW5kUHJvY2Vzc2VzPzogU2NhbGluZ1Byb2Nlc3NbXTtcbn1cblxuLyoqXG4gKiBBIGxpc3Qgb2YgU2NhbGluZ0V2ZW50cywgeW91IGNhbiB1c2Ugb25lIG9mIHRoZSBwcmVkZWZpbmVkIGxpc3RzLCBzdWNoIGFzIFNjYWxpbmdFdmVudHMuRVJST1JTXG4gKiBvciBjcmVhdGUgYSBjdXN0b20gZ3JvdXAgYnkgaW5zdGFudGlhdGluZyBhIGBOb3RpZmljYXRpb25UeXBlc2Agb2JqZWN0LCBlLmc6IGBuZXcgTm90aWZpY2F0aW9uVHlwZXMoYE5vdGlmaWNhdGlvblR5cGUuSU5TVEFOQ0VfTEFVTkNIYClgLlxuICovXG5leHBvcnQgY2xhc3MgU2NhbGluZ0V2ZW50cyB7XG4gIC8qKlxuICAgKiBGbGVldCBzY2FsaW5nIGVycm9yc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBFUlJPUlMgPSBuZXcgU2NhbGluZ0V2ZW50cyhTY2FsaW5nRXZlbnQuSU5TVEFOQ0VfTEFVTkNIX0VSUk9SLCBTY2FsaW5nRXZlbnQuSU5TVEFOQ0VfVEVSTUlOQVRFX0VSUk9SKTtcblxuICAvKipcbiAgICogQWxsIGZsZWV0IHNjYWxpbmcgZXZlbnRzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEFMTCA9IG5ldyBTY2FsaW5nRXZlbnRzKFNjYWxpbmdFdmVudC5JTlNUQU5DRV9MQVVOQ0gsXG4gICAgU2NhbGluZ0V2ZW50LklOU1RBTkNFX0xBVU5DSF9FUlJPUixcbiAgICBTY2FsaW5nRXZlbnQuSU5TVEFOQ0VfVEVSTUlOQVRFLFxuICAgIFNjYWxpbmdFdmVudC5JTlNUQU5DRV9URVJNSU5BVEVfRVJST1IpO1xuXG4gIC8qKlxuICAgKiBGbGVldCBzY2FsaW5nIGxhdW5jaCBldmVudHNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTEFVTkNIX0VWRU5UUyA9IG5ldyBTY2FsaW5nRXZlbnRzKFNjYWxpbmdFdmVudC5JTlNUQU5DRV9MQVVOQ0gsIFNjYWxpbmdFdmVudC5JTlNUQU5DRV9MQVVOQ0hfRVJST1IpO1xuXG4gIC8qKlxuICAgKiBGbGVldCB0ZXJtaW5hdGlvbiBsYXVuY2ggZXZlbnRzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRFUk1JTkFUSU9OX0VWRU5UUyA9IG5ldyBTY2FsaW5nRXZlbnRzKFNjYWxpbmdFdmVudC5JTlNUQU5DRV9URVJNSU5BVEUsIFNjYWxpbmdFdmVudC5JTlNUQU5DRV9URVJNSU5BVEVfRVJST1IpO1xuXG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IF90eXBlczogU2NhbGluZ0V2ZW50W107XG5cbiAgY29uc3RydWN0b3IoLi4udHlwZXM6IFNjYWxpbmdFdmVudFtdKSB7XG4gICAgdGhpcy5fdHlwZXMgPSB0eXBlcztcbiAgfVxufVxuXG5leHBvcnQgZW51bSBTY2FsaW5nUHJvY2VzcyB7XG4gIExBVU5DSCA9ICdMYXVuY2gnLFxuICBURVJNSU5BVEUgPSAnVGVybWluYXRlJyxcbiAgSEVBTFRIX0NIRUNLID0gJ0hlYWx0aENoZWNrJyxcbiAgUkVQTEFDRV9VTkhFQUxUSFkgPSAnUmVwbGFjZVVuaGVhbHRoeScsXG4gIEFaX1JFQkFMQU5DRSA9ICdBWlJlYmFsYW5jZScsXG4gIEFMQVJNX05PVElGSUNBVElPTiA9ICdBbGFybU5vdGlmaWNhdGlvbicsXG4gIFNDSEVEVUxFRF9BQ1RJT05TID0gJ1NjaGVkdWxlZEFjdGlvbnMnLFxuICBBRERfVE9fTE9BRF9CQUxBTkNFUiA9ICdBZGRUb0xvYWRCYWxhbmNlcidcbn1cblxuLy8gUmVjb21tZW5kZWQgbGlzdCBvZiBwcm9jZXNzZXMgdG8gc3VzcGVuZCBmcm9tIGhlcmU6XG4vLyBodHRwczovL2F3cy5hbWF6b24uY29tL3ByZW1pdW1zdXBwb3J0L2tub3dsZWRnZS1jZW50ZXIvYXV0by1zY2FsaW5nLWdyb3VwLXJvbGxpbmctdXBkYXRlcy9cbmNvbnN0IERFRkFVTFRfU1VTUEVORF9QUk9DRVNTRVMgPSBbU2NhbGluZ1Byb2Nlc3MuSEVBTFRIX0NIRUNLLCBTY2FsaW5nUHJvY2Vzcy5SRVBMQUNFX1VOSEVBTFRIWSwgU2NhbGluZ1Byb2Nlc3MuQVpfUkVCQUxBTkNFLFxuICBTY2FsaW5nUHJvY2Vzcy5BTEFSTV9OT1RJRklDQVRJT04sIFNjYWxpbmdQcm9jZXNzLlNDSEVEVUxFRF9BQ1RJT05TXTtcblxuLyoqXG4gKiBFQzIgSGVhdGggY2hlY2sgb3B0aW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEVjMkhlYWx0aENoZWNrT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZWQgdGhlIHRpbWUgQXV0byBTY2FsaW5nIHdhaXRzIGJlZm9yZSBjaGVja2luZyB0aGUgaGVhbHRoIHN0YXR1cyBvZiBhbiBFQzIgaW5zdGFuY2UgdGhhdCBoYXMgY29tZSBpbnRvIHNlcnZpY2VcbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24uc2Vjb25kcygwKVxuICAgKi9cbiAgcmVhZG9ubHkgZ3JhY2U/OiBEdXJhdGlvbjtcbn1cblxuLyoqXG4gKiBFTEIgSGVhdGggY2hlY2sgb3B0aW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEVsYkhlYWx0aENoZWNrT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZWQgdGhlIHRpbWUgQXV0byBTY2FsaW5nIHdhaXRzIGJlZm9yZSBjaGVja2luZyB0aGUgaGVhbHRoIHN0YXR1cyBvZiBhbiBFQzIgaW5zdGFuY2UgdGhhdCBoYXMgY29tZSBpbnRvIHNlcnZpY2VcbiAgICpcbiAgICogVGhpcyBvcHRpb24gaXMgcmVxdWlyZWQgZm9yIEVMQiBoZWFsdGggY2hlY2tzLlxuICAgKi9cbiAgcmVhZG9ubHkgZ3JhY2U6IER1cmF0aW9uO1xufVxuXG4vKipcbiAqIEhlYWx0aCBjaGVjayBzZXR0aW5nc1xuICovXG5leHBvcnQgY2xhc3MgSGVhbHRoQ2hlY2sge1xuICAvKipcbiAgICogVXNlIEVDMiBmb3IgaGVhbHRoIGNoZWNrc1xuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBFQzIgaGVhbHRoIGNoZWNrIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZWMyKG9wdGlvbnM6IEVjMkhlYWx0aENoZWNrT3B0aW9ucyA9IHt9KTogSGVhbHRoQ2hlY2sge1xuICAgIHJldHVybiBuZXcgSGVhbHRoQ2hlY2soSGVhbHRoQ2hlY2tUeXBlLkVDMiwgb3B0aW9ucy5ncmFjZSk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIEVMQiBmb3IgaGVhbHRoIGNoZWNrcy5cbiAgICogSXQgY29uc2lkZXJzIHRoZSBpbnN0YW5jZSB1bmhlYWx0aHkgaWYgaXQgZmFpbHMgZWl0aGVyIHRoZSBFQzIgc3RhdHVzIGNoZWNrcyBvciB0aGUgbG9hZCBiYWxhbmNlciBoZWFsdGggY2hlY2tzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBFTEIgaGVhbHRoIGNoZWNrIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZWxiKG9wdGlvbnM6IEVsYkhlYWx0aENoZWNrT3B0aW9ucyk6IEhlYWx0aENoZWNrIHtcbiAgICByZXR1cm4gbmV3IEhlYWx0aENoZWNrKEhlYWx0aENoZWNrVHlwZS5FTEIsIG9wdGlvbnMuZ3JhY2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdHlwZTogc3RyaW5nLCBwdWJsaWMgcmVhZG9ubHkgZ3JhY2VQZXJpb2Q/OiBEdXJhdGlvbikgeyB9XG59XG5cbmVudW0gSGVhbHRoQ2hlY2tUeXBlIHtcbiAgRUMyID0gJ0VDMicsXG4gIEVMQiA9ICdFTEInLFxufVxuXG4vKipcbiAqIFJlbmRlciB0aGUgcm9sbGluZyB1cGRhdGUgY29uZmlndXJhdGlvbiBpbnRvIHRoZSBhcHByb3ByaWF0ZSBvYmplY3RcbiAqL1xuZnVuY3Rpb24gcmVuZGVyUm9sbGluZ1VwZGF0ZUNvbmZpZyhjb25maWc6IFJvbGxpbmdVcGRhdGVDb25maWd1cmF0aW9uID0ge30pOiBDZm5BdXRvU2NhbGluZ1JvbGxpbmdVcGRhdGUge1xuICBjb25zdCB3YWl0T25SZXNvdXJjZVNpZ25hbHMgPSBjb25maWcubWluU3VjY2Vzc2Z1bEluc3RhbmNlc1BlcmNlbnQgIT09IHVuZGVmaW5lZDtcbiAgY29uc3QgcGF1c2VUaW1lID0gY29uZmlnLnBhdXNlVGltZSB8fCAod2FpdE9uUmVzb3VyY2VTaWduYWxzID8gRHVyYXRpb24ubWludXRlcyg1KSA6IER1cmF0aW9uLnNlY29uZHMoMCkpO1xuXG4gIHJldHVybiB7XG4gICAgbWF4QmF0Y2hTaXplOiBjb25maWcubWF4QmF0Y2hTaXplLFxuICAgIG1pbkluc3RhbmNlc0luU2VydmljZTogY29uZmlnLm1pbkluc3RhbmNlc0luU2VydmljZSxcbiAgICBtaW5TdWNjZXNzZnVsSW5zdGFuY2VzUGVyY2VudDogdmFsaWRhdGVQZXJjZW50YWdlKGNvbmZpZy5taW5TdWNjZXNzZnVsSW5zdGFuY2VzUGVyY2VudCksXG4gICAgd2FpdE9uUmVzb3VyY2VTaWduYWxzLFxuICAgIHBhdXNlVGltZTogcGF1c2VUaW1lICYmIHBhdXNlVGltZS50b0lzb1N0cmluZygpLFxuICAgIHN1c3BlbmRQcm9jZXNzZXM6IGNvbmZpZy5zdXNwZW5kUHJvY2Vzc2VzID8/IERFRkFVTFRfU1VTUEVORF9QUk9DRVNTRVMsXG4gIH07XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlUGVyY2VudGFnZSh4PzogbnVtYmVyKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgaWYgKHggPT09IHVuZGVmaW5lZCB8fCAoMCA8PSB4ICYmIHggPD0gMTAwKSkgeyByZXR1cm4geDsgfVxuICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkOiBhIHBlcmNlbnRhZ2UgMC4uMTAwLCBnb3Q6ICR7eH1gKTtcbn1cblxuLyoqXG4gKiBBbiBBdXRvU2NhbGluZ0dyb3VwXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUF1dG9TY2FsaW5nR3JvdXAgZXh0ZW5kcyBJUmVzb3VyY2UsIGlhbS5JR3JhbnRhYmxlIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBBdXRvU2NhbGluZ0dyb3VwXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGF1dG9TY2FsaW5nR3JvdXBOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBhcm4gb2YgdGhlIEF1dG9TY2FsaW5nR3JvdXBcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYXV0b1NjYWxpbmdHcm91cEFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgb3BlcmF0aW5nIHN5c3RlbSBmYW1pbHkgdGhhdCB0aGUgaW5zdGFuY2VzIGluIHRoaXMgYXV0by1zY2FsaW5nIGdyb3VwIGJlbG9uZyB0by5cbiAgICogSXMgJ1VOS05PV04nIGZvciBpbXBvcnRlZCBBU0dzLlxuICAgKi9cbiAgcmVhZG9ubHkgb3NUeXBlOiBlYzIuT3BlcmF0aW5nU3lzdGVtVHlwZTtcblxuICAvKipcbiAgICogQWRkIGNvbW1hbmQgdG8gdGhlIHN0YXJ0dXAgc2NyaXB0IG9mIGZsZWV0IGluc3RhbmNlcy5cbiAgICogVGhlIGNvbW1hbmQgbXVzdCBiZSBpbiB0aGUgc2NyaXB0aW5nIGxhbmd1YWdlIHN1cHBvcnRlZCBieSB0aGUgZmxlZXQncyBPUyAoaS5lLiBMaW51eC9XaW5kb3dzKS5cbiAgICogRG9lcyBub3RoaW5nIGZvciBpbXBvcnRlZCBBU0dzLlxuICAgKi9cbiAgYWRkVXNlckRhdGEoLi4uY29tbWFuZHM6IHN0cmluZ1tdKTogdm9pZDtcblxuICAvKipcbiAgICogU2VuZCBhIG1lc3NhZ2UgdG8gZWl0aGVyIGFuIFNRUyBxdWV1ZSBvciBTTlMgdG9waWMgd2hlbiBpbnN0YW5jZXMgbGF1bmNoIG9yIHRlcm1pbmF0ZVxuICAgKi9cbiAgYWRkTGlmZWN5Y2xlSG9vayhpZDogc3RyaW5nLCBwcm9wczogQmFzaWNMaWZlY3ljbGVIb29rUHJvcHMpOiBMaWZlY3ljbGVIb29rO1xuXG4gIC8qKlxuICAgKiBBZGQgYSBwb29sIG9mIHByZS1pbml0aWFsaXplZCBFQzIgaW5zdGFuY2VzIHRoYXQgc2l0cyBhbG9uZ3NpZGUgYW4gQXV0byBTY2FsaW5nIGdyb3VwXG4gICAqL1xuICBhZGRXYXJtUG9vbChvcHRpb25zPzogV2FybVBvb2xPcHRpb25zKTogV2FybVBvb2w7XG5cbiAgLyoqXG4gICAqIFNjYWxlIG91dCBvciBpbiBiYXNlZCBvbiB0aW1lXG4gICAqL1xuICBzY2FsZU9uU2NoZWR1bGUoaWQ6IHN0cmluZywgcHJvcHM6IEJhc2ljU2NoZWR1bGVkQWN0aW9uUHJvcHMpOiBTY2hlZHVsZWRBY3Rpb247XG5cbiAgLyoqXG4gICAqIFNjYWxlIG91dCBvciBpbiB0byBhY2hpZXZlIGEgdGFyZ2V0IENQVSB1dGlsaXphdGlvblxuICAgKi9cbiAgc2NhbGVPbkNwdVV0aWxpemF0aW9uKGlkOiBzdHJpbmcsIHByb3BzOiBDcHVVdGlsaXphdGlvblNjYWxpbmdQcm9wcyk6IFRhcmdldFRyYWNraW5nU2NhbGluZ1BvbGljeTtcblxuICAvKipcbiAgICogU2NhbGUgb3V0IG9yIGluIHRvIGFjaGlldmUgYSB0YXJnZXQgbmV0d29yayBpbmdyZXNzIHJhdGVcbiAgICovXG4gIHNjYWxlT25JbmNvbWluZ0J5dGVzKGlkOiBzdHJpbmcsIHByb3BzOiBOZXR3b3JrVXRpbGl6YXRpb25TY2FsaW5nUHJvcHMpOiBUYXJnZXRUcmFja2luZ1NjYWxpbmdQb2xpY3k7XG5cbiAgLyoqXG4gICAqIFNjYWxlIG91dCBvciBpbiB0byBhY2hpZXZlIGEgdGFyZ2V0IG5ldHdvcmsgZWdyZXNzIHJhdGVcbiAgICovXG4gIHNjYWxlT25PdXRnb2luZ0J5dGVzKGlkOiBzdHJpbmcsIHByb3BzOiBOZXR3b3JrVXRpbGl6YXRpb25TY2FsaW5nUHJvcHMpOiBUYXJnZXRUcmFja2luZ1NjYWxpbmdQb2xpY3k7XG5cbiAgLyoqXG4gICAqIFNjYWxlIG91dCBvciBpbiBpbiBvcmRlciB0byBrZWVwIGEgbWV0cmljIGFyb3VuZCBhIHRhcmdldCB2YWx1ZVxuICAgKi9cbiAgc2NhbGVUb1RyYWNrTWV0cmljKGlkOiBzdHJpbmcsIHByb3BzOiBNZXRyaWNUYXJnZXRUcmFja2luZ1Byb3BzKTogVGFyZ2V0VHJhY2tpbmdTY2FsaW5nUG9saWN5O1xuXG4gIC8qKlxuICAgKiBTY2FsZSBvdXQgb3IgaW4sIGluIHJlc3BvbnNlIHRvIGEgbWV0cmljXG4gICAqL1xuICBzY2FsZU9uTWV0cmljKGlkOiBzdHJpbmcsIHByb3BzOiBCYXNpY1N0ZXBTY2FsaW5nUG9saWN5UHJvcHMpOiBTdGVwU2NhbGluZ1BvbGljeTtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBlbmFibGluZyBzY2FsaW5nIGJhc2VkIG9uIENQVSB1dGlsaXphdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIENwdVV0aWxpemF0aW9uU2NhbGluZ1Byb3BzIGV4dGVuZHMgQmFzZVRhcmdldFRyYWNraW5nUHJvcHMge1xuICAvKipcbiAgICogVGFyZ2V0IGF2ZXJhZ2UgQ1BVIHV0aWxpemF0aW9uIGFjcm9zcyB0aGUgdGFza1xuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0VXRpbGl6YXRpb25QZXJjZW50OiBudW1iZXI7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZW5hYmxpbmcgc2NhbGluZyBiYXNlZCBvbiBuZXR3b3JrIHV0aWxpemF0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya1V0aWxpemF0aW9uU2NhbGluZ1Byb3BzIGV4dGVuZHMgQmFzZVRhcmdldFRyYWNraW5nUHJvcHMge1xuICAvKipcbiAgICogVGFyZ2V0IGF2ZXJhZ2UgYnl0ZXMvc2Vjb25kcyBvbiBlYWNoIGluc3RhbmNlXG4gICAqL1xuICByZWFkb25seSB0YXJnZXRCeXRlc1BlclNlY29uZDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGVuYWJsaW5nIHNjYWxpbmcgYmFzZWQgb24gcmVxdWVzdC9zZWNvbmRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0Q291bnRTY2FsaW5nUHJvcHMgZXh0ZW5kcyBCYXNlVGFyZ2V0VHJhY2tpbmdQcm9wcyB7XG4gIC8qKlxuICAgKiBUYXJnZXQgYXZlcmFnZSByZXF1ZXN0cy9zZWNvbmRzIG9uIGVhY2ggaW5zdGFuY2VcbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlICd0YXJnZXRSZXF1ZXN0c1Blck1pbnV0ZScgaW5zdGVhZFxuICAgKiBAZGVmYXVsdCAtIFNwZWNpZnkgZXhhY3RseSBvbmUgb2YgJ3RhcmdldFJlcXVlc3RzUGVyTWludXRlJyBhbmQgJ3RhcmdldFJlcXVlc3RzUGVyU2Vjb25kJ1xuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0UmVxdWVzdHNQZXJTZWNvbmQ/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRhcmdldCBhdmVyYWdlIHJlcXVlc3RzL21pbnV0ZSBvbiBlYWNoIGluc3RhbmNlXG4gICAqIEBkZWZhdWx0IC0gU3BlY2lmeSBleGFjdGx5IG9uZSBvZiAndGFyZ2V0UmVxdWVzdHNQZXJNaW51dGUnIGFuZCAndGFyZ2V0UmVxdWVzdHNQZXJTZWNvbmQnXG4gICAqL1xuICByZWFkb25seSB0YXJnZXRSZXF1ZXN0c1Blck1pbnV0ZT86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBlbmFibGluZyB0cmFja2luZyBvZiBhbiBhcmJpdHJhcnkgbWV0cmljXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWV0cmljVGFyZ2V0VHJhY2tpbmdQcm9wcyBleHRlbmRzIEJhc2VUYXJnZXRUcmFja2luZ1Byb3BzIHtcbiAgLyoqXG4gICAqIE1ldHJpYyB0byB0cmFja1xuICAgKlxuICAgKiBUaGUgbWV0cmljIG11c3QgcmVwcmVzZW50IGEgdXRpbGl6YXRpb24sIHNvIHRoYXQgaWYgaXQncyBoaWdoZXIgdGhhbiB0aGVcbiAgICogdGFyZ2V0IHZhbHVlLCB5b3VyIEFTRyBzaG91bGQgc2NhbGUgb3V0LCBhbmQgaWYgaXQncyBsb3dlciBpdCBzaG91bGRcbiAgICogc2NhbGUgaW4uXG4gICAqL1xuICByZWFkb25seSBtZXRyaWM6IGNsb3Vkd2F0Y2guSU1ldHJpYztcblxuICAvKipcbiAgICogVmFsdWUgdG8ga2VlcCB0aGUgbWV0cmljIGFyb3VuZFxuICAgKi9cbiAgcmVhZG9ubHkgdGFyZ2V0VmFsdWU6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBTeW50aGVzaXplIGFuIGFycmF5IG9mIGJsb2NrIGRldmljZSBtYXBwaW5ncyBmcm9tIGEgbGlzdCBvZiBibG9jayBkZXZpY2VcbiAqXG4gKiBAcGFyYW0gY29uc3RydWN0IHRoZSBpbnN0YW5jZS9hc2cgY29uc3RydWN0LCB1c2VkIHRvIGhvc3QgYW55IHdhcm5pbmdcbiAqIEBwYXJhbSBibG9ja0RldmljZXMgbGlzdCBvZiBibG9jayBkZXZpY2VzXG4gKi9cbmZ1bmN0aW9uIHN5bnRoZXNpemVCbG9ja0RldmljZU1hcHBpbmdzKGNvbnN0cnVjdDogQ29uc3RydWN0LCBibG9ja0RldmljZXM6IEJsb2NrRGV2aWNlW10pOiBDZm5MYXVuY2hDb25maWd1cmF0aW9uLkJsb2NrRGV2aWNlTWFwcGluZ1Byb3BlcnR5W10ge1xuICByZXR1cm4gYmxvY2tEZXZpY2VzLm1hcDxDZm5MYXVuY2hDb25maWd1cmF0aW9uLkJsb2NrRGV2aWNlTWFwcGluZ1Byb3BlcnR5PigoeyBkZXZpY2VOYW1lLCB2b2x1bWUsIG1hcHBpbmdFbmFibGVkIH0pID0+IHtcbiAgICBjb25zdCB7IHZpcnR1YWxOYW1lLCBlYnNEZXZpY2U6IGVicyB9ID0gdm9sdW1lO1xuXG4gICAgaWYgKHZvbHVtZSA9PT0gQmxvY2tEZXZpY2VWb2x1bWUuX05PX0RFVklDRSB8fCBtYXBwaW5nRW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRldmljZU5hbWUsXG4gICAgICAgIG5vRGV2aWNlOiB0cnVlLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoZWJzKSB7XG4gICAgICBjb25zdCB7IGlvcHMsIHZvbHVtZVR5cGUsIHRocm91Z2hwdXQgfSA9IGVicztcblxuICAgICAgaWYgKHRocm91Z2hwdXQpIHtcbiAgICAgICAgY29uc3QgdGhyb3VnaHB1dFJhbmdlID0geyBNaW46IDEyNSwgTWF4OiAxMDAwIH07XG4gICAgICAgIGNvbnN0IHsgTWluLCBNYXggfSA9IHRocm91Z2hwdXRSYW5nZTtcblxuICAgICAgICBpZiAodm9sdW1lVHlwZSAhPSBFYnNEZXZpY2VWb2x1bWVUeXBlLkdQMykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGhyb3VnaHB1dCBwcm9wZXJ0eSByZXF1aXJlcyB2b2x1bWVUeXBlOiBFYnNEZXZpY2VWb2x1bWVUeXBlLkdQMycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRocm91Z2hwdXQgPCBNaW4gfHwgdGhyb3VnaHB1dCA+IE1heCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGB0aHJvdWdocHV0IHByb3BlcnR5IHRha2VzIGEgbWluaW11bSBvZiAke01pbn0gYW5kIGEgbWF4aW11bSBvZiAke01heH1gLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXhpbXVtVGhyb3VnaHB1dFJhdGlvID0gMC4yNTtcbiAgICAgICAgaWYgKGlvcHMpIHtcbiAgICAgICAgICBjb25zdCBpb3BzUmF0aW8gPSAodGhyb3VnaHB1dCAvIGlvcHMpO1xuICAgICAgICAgIGlmIChpb3BzUmF0aW8gPiBtYXhpbXVtVGhyb3VnaHB1dFJhdGlvKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRocm91Z2hwdXQgKE1pQnBzKSB0byBpb3BzIHJhdGlvIG9mICR7aW9wc1JhdGlvfSBpcyB0b28gaGlnaDsgbWF4aW11bSBpcyAke21heGltdW1UaHJvdWdocHV0UmF0aW99IE1pQnBzIHBlciBpb3BzYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgICAgaWYgKCFpb3BzKSB7XG4gICAgICAgIGlmICh2b2x1bWVUeXBlID09PSBFYnNEZXZpY2VWb2x1bWVUeXBlLklPMSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW9wcyBwcm9wZXJ0eSBpcyByZXF1aXJlZCB3aXRoIHZvbHVtZVR5cGU6IEVic0RldmljZVZvbHVtZVR5cGUuSU8xJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodm9sdW1lVHlwZSAhPT0gRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzEpIHtcbiAgICAgICAgQW5ub3RhdGlvbnMub2YoY29uc3RydWN0KS5hZGRXYXJuaW5nKCdpb3BzIHdpbGwgYmUgaWdub3JlZCB3aXRob3V0IHZvbHVtZVR5cGU6IEVic0RldmljZVZvbHVtZVR5cGUuSU8xJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRldmljZU5hbWUsIGVicywgdmlydHVhbE5hbWUsXG4gICAgfTtcbiAgfSk7XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgYXBwbHlpbmcgQ2xvdWRGb3JtYXRpb24gaW5pdCB0byBhbiBpbnN0YW5jZSBvciBpbnN0YW5jZSBncm91cFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFwcGx5Q2xvdWRGb3JtYXRpb25Jbml0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBDb25maWdTZXQgdG8gYWN0aXZhdGVcbiAgICpcbiAgICogQGRlZmF1bHQgWydkZWZhdWx0J11cbiAgICovXG4gIHJlYWRvbmx5IGNvbmZpZ1NldHM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogRm9yY2UgaW5zdGFuY2UgcmVwbGFjZW1lbnQgYnkgZW1iZWRkaW5nIGEgY29uZmlnIGZpbmdlcnByaW50XG4gICAqXG4gICAqIElmIGB0cnVlYCAodGhlIGRlZmF1bHQpLCBhIGhhc2ggb2YgdGhlIGNvbmZpZyB3aWxsIGJlIGVtYmVkZGVkIGludG8gdGhlXG4gICAqIFVzZXJEYXRhLCBzbyB0aGF0IGlmIHRoZSBjb25maWcgY2hhbmdlcywgdGhlIFVzZXJEYXRhIGNoYW5nZXMgYW5kXG4gICAqIGluc3RhbmNlcyB3aWxsIGJlIHJlcGxhY2VkIChnaXZlbiBhbiBVcGRhdGVQb2xpY3kgaGFzIGJlZW4gY29uZmlndXJlZCBvblxuICAgKiB0aGUgQXV0b1NjYWxpbmdHcm91cCkuXG4gICAqXG4gICAqIElmIGBmYWxzZWAsIG5vIHN1Y2ggaGFzaCB3aWxsIGJlIGVtYmVkZGVkLCBhbmQgaWYgdGhlIENsb3VkRm9ybWF0aW9uIEluaXRcbiAgICogY29uZmlnIGNoYW5nZXMgbm90aGluZyB3aWxsIGhhcHBlbiB0byB0aGUgcnVubmluZyBpbnN0YW5jZXMuIElmIGFcbiAgICogY29uZmlnIHVwZGF0ZSBpbnRyb2R1Y2VzIGVycm9ycywgeW91IHdpbGwgbm90IG5vdGljZSB1bnRpbCBhZnRlciB0aGVcbiAgICogQ2xvdWRGb3JtYXRpb24gZGVwbG95bWVudCBzdWNjZXNzZnVsbHkgZmluaXNoZXMgYW5kIHRoZSBuZXh0IGluc3RhbmNlXG4gICAqIGZhaWxzIHRvIGxhdW5jaC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgZW1iZWRGaW5nZXJwcmludD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFByaW50IHRoZSByZXN1bHRzIG9mIHJ1bm5pbmcgY2ZuLWluaXQgdG8gdGhlIEluc3RhbmNlIFN5c3RlbSBMb2dcbiAgICpcbiAgICogQnkgZGVmYXVsdCwgdGhlIG91dHB1dCBvZiBydW5uaW5nIGNmbi1pbml0IGlzIHdyaXR0ZW4gdG8gYSBsb2cgZmlsZVxuICAgKiBvbiB0aGUgaW5zdGFuY2UuIFNldCB0aGlzIHRvIGB0cnVlYCB0byBwcmludCBpdCB0byB0aGUgU3lzdGVtIExvZ1xuICAgKiAodmlzaWJsZSBmcm9tIHRoZSBFQzIgQ29uc29sZSksIGBmYWxzZWAgdG8gbm90IHByaW50IGl0LlxuICAgKlxuICAgKiAoQmUgYXdhcmUgdGhhdCB0aGUgc3lzdGVtIGxvZyBpcyByZWZyZXNoZWQgYXQgY2VydGFpbiBwb2ludHMgaW5cbiAgICogdGltZSBvZiB0aGUgaW5zdGFuY2UgbGlmZSBjeWNsZSwgYW5kIHN1Y2Nlc3NmdWwgZXhlY3V0aW9uIG1heVxuICAgKiBub3QgYWx3YXlzIHNob3cgdXApLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBwcmludExvZz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIERvbid0IGZhaWwgdGhlIGluc3RhbmNlIGNyZWF0aW9uIHdoZW4gY2ZuLWluaXQgZmFpbHNcbiAgICpcbiAgICogWW91IGNhbiB1c2UgdGhpcyB0byBwcmV2ZW50IENsb3VkRm9ybWF0aW9uIGZyb20gcm9sbGluZyBiYWNrIHdoZW5cbiAgICogaW5zdGFuY2VzIGZhaWwgdG8gc3RhcnQgdXAsIHRvIGhlbHAgaW4gZGVidWdnaW5nLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgaWdub3JlRmFpbHVyZXM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJbmNsdWRlIC0tdXJsIGFyZ3VtZW50IHdoZW4gcnVubmluZyBjZm4taW5pdCBhbmQgY2ZuLXNpZ25hbCBjb21tYW5kc1xuICAgKlxuICAgKiBUaGlzIHdpbGwgYmUgdGhlIGNsb3VkZm9ybWF0aW9uIGVuZHBvaW50IGluIHRoZSBkZXBsb3llZCByZWdpb25cbiAgICogZS5nLiBodHRwczovL2Nsb3VkZm9ybWF0aW9uLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBpbmNsdWRlVXJsPzogYm9vbGVhbjtcblxuICAvKipcbiAgKiBJbmNsdWRlIC0tcm9sZSBhcmd1bWVudCB3aGVuIHJ1bm5pbmcgY2ZuLWluaXQgYW5kIGNmbi1zaWduYWwgY29tbWFuZHNcbiAgKlxuICAqIFRoaXMgd2lsbCBiZSB0aGUgSUFNIGluc3RhbmNlIHByb2ZpbGUgYXR0YWNoZWQgdG8gdGhlIEVDMiBpbnN0YW5jZVxuICAqXG4gICogQGRlZmF1bHQgZmFsc2VcbiAgKi9cbiAgcmVhZG9ubHkgaW5jbHVkZVJvbGU/OiBib29sZWFuO1xufVxuIl19