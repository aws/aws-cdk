import ec2 = require('@aws-cdk/aws-ec2');
import elb = require('@aws-cdk/aws-elasticloadbalancing');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import iam = require('@aws-cdk/aws-iam');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');

import { cloudformation } from './autoscaling.generated';

/**
 * Name tag constant
 */
const NAME_TAG: string = 'Name';

/**
 * Properties of a Fleet
 */
export interface AutoScalingGroupProps {
  /**
   * Type of instance to launch
   */
  instanceType: ec2.InstanceType;

  /**
   * Minimum number of instances in the fleet
   * @default 1
   */
  minSize?: number;

  /**
   * Maximum number of instances in the fleet
   * @default 1
   */
  maxSize?: number;

  /**
   * Initial amount of instances in the fleet
   * @default 1
   */
  desiredCapacity?: number;

  /**
   * Name of SSH keypair to grant access to instances
   * @default No SSH access will be possible
   */
  keyName?: string;

  /**
   * AMI to launch
   */
  machineImage: ec2.IMachineImageSource;

  /**
   * VPC to launch these instances in.
   */
  vpc: ec2.VpcNetworkRef;

  /**
   * Where to place instances within the VPC
   */
  vpcPlacement?: ec2.VpcPlacementStrategy;

  /**
   * SNS topic to send notifications about fleet changes
   * @default No fleet change notifications will be sent.
   */
  notificationsTopic?: sns.TopicRef;

  /**
   * Whether the instances can initiate connections to anywhere by default
   *
   * @default true
   */
  allowAllOutbound?: boolean;

  /**
   * What to do when an AutoScalingGroup's instance configuration is changed
   *
   * This is applied when any of the settings on the ASG are changed that
   * affect how the instances should be created (VPC, instance type, startup
   * scripts, etc.). It indicates how the existing instances should be
   * replaced with new instances matching the new config. By default, nothing
   * is done and only new instances are launched with the new config.
   *
   * @default UpdateType.None
   */
  updateType?: UpdateType;

  /**
   * Configuration for rolling updates
   *
   * Only used if updateType == UpdateType.RollingUpdate.
   */
  rollingUpdateConfiguration?: RollingUpdateConfiguration;

  /**
   * Configuration for replacing updates.
   *
   * Only used if updateType == UpdateType.ReplacingUpdate. Specifies how
   * many instances must signal success for the update to succeed.
   */
  replacingUpdateMinSuccessfulInstancesPercent?: number;

  /**
   * If the ASG has scheduled actions, don't reset unchanged group sizes
   *
   * Only used if the ASG has scheduled actions (which may scale your ASG up
   * or down regardless of cdk deployments). If true, the size of the group
   * will only be reset if it has been changed in the CDK app. If false, the
   * sizes will always be changed back to what they were in the CDK app
   * on deployment.
   *
   * @default true
   */
  ignoreUnmodifiedSizeProperties?: boolean;

  /**
   * How many ResourceSignal calls CloudFormation expects before the resource is considered created
   *
   * @default 1
   */
  resourceSignalCount?: number;

  /**
   * The length of time to wait for the resourceSignalCount
   *
   * The maximum value is 43200 (12 hours).
   *
   * @default 300 (5 minutes)
   */
  resourceSignalTimeoutSec?: number;

  /**
   * The AWS resource tags to associate with the ASG.
   */
  tags?: cdk.Tags;
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
 * The ASG spans all availability zones.
 */
export class AutoScalingGroup extends cdk.Construct implements cdk.ITaggable, elb.ILoadBalancerTarget, ec2.IConnectable,
  elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget {
  /**
   * The type of OS instances of this fleet are running.
   */
  public readonly osType: ec2.OperatingSystemType;

  /**
   * Allows specify security group connections for instances of this fleet.
   */
  public readonly connections: ec2.Connections;

  /**
   * The IAM role assumed by instances of this fleet.
   */
  public readonly role: iam.Role;

  /**
   * Manage tags for this construct and children
   */
  public readonly tags: cdk.TagManager;

  private readonly userDataLines = new Array<string>();
  private readonly autoScalingGroup: cloudformation.AutoScalingGroupResource;
  private readonly securityGroup: ec2.SecurityGroupRef;
  private readonly securityGroups: ec2.SecurityGroupRef[] = [];
  private readonly loadBalancerNames: string[] = [];
  private readonly targetGroupArns: string[] = [];

  constructor(parent: cdk.Construct, name: string, props: AutoScalingGroupProps) {
    super(parent, name);

    this.securityGroup = new ec2.SecurityGroup(this, 'InstanceSecurityGroup', { vpc: props.vpc });
    this.connections = new ec2.Connections({ securityGroup: this.securityGroup });
    this.securityGroups.push(this.securityGroup);
    this.tags = new TagManager(this, {initialTags: props.tags});
    this.tags.setTag(NAME_TAG, this.path, { overwrite: false });

    if (props.allowAllOutbound !== false) {
      this.connections.allowTo(new ec2.AnyIPv4(), new ec2.AllConnections(), 'Outbound traffic allowed by default');
    }

    this.role = new iam.Role(this, 'InstanceRole', {
      assumedBy: new cdk.ServicePrincipal('ec2.amazonaws.com')
    });

    const iamProfile = new iam.cloudformation.InstanceProfileResource(this, 'InstanceProfile', {
      roles: [ this.role.roleName ]
    });

    // use delayed evaluation
    const machineImage = props.machineImage.getImage(this);
    const userDataToken = new cdk.Token(() => new cdk.FnBase64((machineImage.os.createUserData(this.userDataLines))));
    const securityGroupsToken = new cdk.Token(() => this.securityGroups.map(sg => sg.securityGroupId));

    const launchConfig = new cloudformation.LaunchConfigurationResource(this, 'LaunchConfig', {
      imageId: machineImage.imageId,
      keyName: props.keyName,
      instanceType: props.instanceType.toString(),
      securityGroups: securityGroupsToken,
      iamInstanceProfile: iamProfile.ref,
      userData: userDataToken
    });

    launchConfig.addDependency(this.role);

    const minSize = props.minSize || 1;
    const maxSize = props.maxSize || 1;
    const desiredCapacity = props.desiredCapacity || 1;

    if (desiredCapacity < minSize || desiredCapacity > maxSize) {
      throw new Error(`Should have minSize (${minSize}) <= desiredCapacity (${desiredCapacity}) <= maxSize (${maxSize})`);
    }

    const asgProps: cloudformation.AutoScalingGroupResourceProps = {
      minSize: minSize.toString(),
      maxSize: maxSize.toString(),
      desiredCapacity: desiredCapacity.toString(),
      launchConfigurationName: launchConfig.ref,
      loadBalancerNames: new cdk.Token(() => this.loadBalancerNames.length > 0 ? this.loadBalancerNames : undefined),
      targetGroupArns: new cdk.Token(() => this.targetGroupArns.length > 0 ? this.targetGroupArns : undefined),
      tags: this.tags,
    };

    if (props.notificationsTopic) {
      asgProps.notificationConfigurations = [];
      asgProps.notificationConfigurations.push({
        topicArn: props.notificationsTopic.topicArn,
        notificationTypes: [
          "autoscaling:EC2_INSTANCE_LAUNCH",
          "autoscaling:EC2_INSTANCE_LAUNCH_ERROR",
          "autoscaling:EC2_INSTANCE_TERMINATE",
          "autoscaling:EC2_INSTANCE_TERMINATE_ERROR"
        ],
      });
    }

    const subnets = props.vpc.subnets(props.vpcPlacement);
    asgProps.vpcZoneIdentifier = subnets.map(n => n.subnetId);

    this.autoScalingGroup = new cloudformation.AutoScalingGroupResource(this, 'ASG', asgProps);
    this.osType = machineImage.os.type;

    this.applyUpdatePolicies(props);
  }

  /**
   * Add the security group to all instances via the launch configuration
   * security groups array.
   *
   * @param securityGroup: The SecurityGroupRef to add
   */
  public addSecurityGroup(securityGroup: ec2.SecurityGroupRef): void {
    this.securityGroups.push(securityGroup);
  }

  /**
   * Attach to a classic load balancer
   */
  public attachToClassicLB(loadBalancer: elb.LoadBalancer): void {
    this.loadBalancerNames.push(loadBalancer.loadBalancerName);
  }

  /**
   * Attach to ELBv2 Application Target Group
   */
  public attachToApplicationTargetGroup(targetGroup: elbv2.ApplicationTargetGroup): elbv2.LoadBalancerTargetProps {
    this.targetGroupArns.push(targetGroup.targetGroupArn);
    targetGroup.registerConnectable(this);
    return { targetType: elbv2.TargetType.SelfRegistering };
  }

  /**
   * Attach to ELBv2 Application Target Group
   */
  public attachToNetworkTargetGroup(targetGroup: elbv2.NetworkTargetGroup): elbv2.LoadBalancerTargetProps {
    this.targetGroupArns.push(targetGroup.targetGroupArn);
    return { targetType: elbv2.TargetType.SelfRegistering };
  }

  /**
   * Add command to the startup script of fleet instances.
   * The command must be in the scripting language supported by the fleet's OS (i.e. Linux/Windows).
   */
  public addUserData(...scriptLines: string[]) {
    scriptLines.forEach(scriptLine => this.userDataLines.push(scriptLine));
  }

  public autoScalingGroupName() {
    return this.autoScalingGroup.ref;
  }

  /**
   * Adds a statement to the IAM role assumed by instances of this fleet.
   */
  public addToRolePolicy(statement: cdk.PolicyStatement) {
    this.role.addToPolicy(statement);
  }

  /**
   * Apply CloudFormation update policies for the AutoScalingGroup
   */
  private applyUpdatePolicies(props: AutoScalingGroupProps) {
    if (props.updateType === UpdateType.ReplacingUpdate) {
      this.asgUpdatePolicy.autoScalingReplacingUpdate = { willReplace: true };

      if (props.replacingUpdateMinSuccessfulInstancesPercent !== undefined) {
        // Yes, this goes on CreationPolicy, not as a process parameter to ReplacingUpdate.
        // It's a little confusing, but the docs seem to explicitly state it will only be used
        // during the update?
        //
        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-creationpolicy.html
        this.asgCreationPolicy.autoScalingCreationPolicy = {
          minSuccessfulInstancesPercent: validatePercentage(props.replacingUpdateMinSuccessfulInstancesPercent)
        };
      }
    } else if (props.updateType === UpdateType.RollingUpdate) {
      this.asgUpdatePolicy.autoScalingRollingUpdate = renderRollingUpdateConfig(props.rollingUpdateConfiguration);
    }

    // undefined is treated as 'true'
    if (props.ignoreUnmodifiedSizeProperties !== false) {
      this.asgUpdatePolicy.autoScalingScheduledAction = { ignoreUnmodifiedGroupSizeProperties: true };
    }

    if (props.resourceSignalCount !== undefined || props.resourceSignalTimeoutSec !== undefined) {
      this.asgCreationPolicy.resourceSignal = {
        count: props.resourceSignalCount,
        timeout: props.resourceSignalTimeoutSec !== undefined ? renderIsoDuration(props.resourceSignalTimeoutSec) : undefined,
      };
    }
  }

  /**
   * Create and return the ASG update policy
   */
  private get asgUpdatePolicy() {
    if (this.autoScalingGroup.options.updatePolicy === undefined) {
      this.autoScalingGroup.options.updatePolicy = {};
    }
    return this.autoScalingGroup.options.updatePolicy;
  }

  /**
   * Create and return the ASG creation policy
   */
  private get asgCreationPolicy() {
    if (this.autoScalingGroup.options.creationPolicy === undefined) {
      this.autoScalingGroup.options.creationPolicy = {};
    }
    return this.autoScalingGroup.options.creationPolicy;
  }
}

/**
 * The type of update to perform on instances in this AutoScalingGroup
 */
export enum UpdateType {
  /**
   * Don't do anything
   */
  None = 'None',

  /**
   * Replace the entire AutoScalingGroup
   *
   * Builds a new AutoScalingGroup first, then delete the old one.
   */
  ReplacingUpdate = 'Replace',

  /**
   * Replace the instances in the AutoScalingGroup.
   */
  RollingUpdate = 'RollingUpdate',
}

/**
 * Additional settings when a rolling update is selected
 */
export interface RollingUpdateConfiguration {
  /**
   * The maximum number of instances that AWS CloudFormation updates at once.
   *
   * @default 1
   */
  maxBatchSize?: number;

  /**
   * The minimum number of instances that must be in service before more instances are replaced.
   *
   * This number affects the speed of the replacement.
   *
   * @default 0
   */
  minInstancesInService?: number;

  /**
   * The percentage of instances that must signal success for an update to succeed.
   *
   * If an instance doesn't send a signal within the time specified in the
   * pauseTime property, AWS CloudFormation assumes that the instance wasn't
   * updated.
   *
   * This number affects the success of the replacement.
   *
   * If you specify this property, you must also enable the
   * waitOnResourceSignals and pauseTime properties.
   *
   * @default 100
   */
  minSuccessfulInstancesPercent?: number;

  /**
   * The pause time after making a change to a batch of instances.
   *
   * This is intended to give those instances time to start software applications.
   *
   * Specify PauseTime in the ISO8601 duration format (in the format
   * PT#H#M#S, where each # is the number of hours, minutes, and seconds,
   * respectively). The maximum PauseTime is one hour (PT1H).
   *
   * @default 300 if the waitOnResourceSignals property is true, otherwise 0
   */
  pauseTimeSec?: number;

  /**
   * Specifies whether the Auto Scaling group waits on signals from new instances during an update.
   *
   * AWS CloudFormation must receive a signal from each new instance within
   * the specified PauseTime before continuing the update.
   *
   * To have instances wait for an Elastic Load Balancing health check before
   * they signal success, add a health-check verification by using the
   * cfn-init helper script. For an example, see the verify_instance_health
   * command in the Auto Scaling rolling updates sample template.
   *
   * @default true if you specified the minSuccessfulInstancesPercent property, false otherwise
   */
  waitOnResourceSignals?: boolean;

  /**
   * Specifies the Auto Scaling processes to suspend during a stack update.
   *
   * Suspending processes prevents Auto Scaling from interfering with a stack
   * update.
   *
   * @default HealthCheck, ReplaceUnhealthy, AZRebalance, AlarmNotification, ScheduledActions.
   */
  suspendProcesses?: ScalingProcess[];
}

export enum ScalingProcess {
  Launch = 'Launch',
  Terminate = 'Terminate',
  HealthCheck = 'HealthCheck',
  ReplaceUnhealthy = 'ReplaceUnhealthy',
  AZRebalance = 'AZRebalance',
  AlarmNotification = 'AlarmNotification',
  ScheduledActions = 'ScheduledActions',
  AddToLoadBalancer = 'AddToLoadBalancer'
}

/**
 * Render the rolling update configuration into the appropriate object
 */
function renderRollingUpdateConfig(config: RollingUpdateConfiguration = {}): cdk.AutoScalingRollingUpdate {
  const waitOnResourceSignals = config.minSuccessfulInstancesPercent !== undefined ? true : false;
  const pauseTimeSec = config.pauseTimeSec !== undefined ? config.pauseTimeSec : (waitOnResourceSignals ? 300 : 0);

  return {
    maxBatchSize: config.maxBatchSize,
    minInstancesInService: config.minInstancesInService,
    minSuccessfulInstancesPercent: validatePercentage(config.minSuccessfulInstancesPercent),
    waitOnResourceSignals,
    pauseTime: renderIsoDuration(pauseTimeSec),
    suspendProcesses: config.suspendProcesses !== undefined ? config.suspendProcesses :
      // Recommended list of processes to suspend from here:
      // https://aws.amazon.com/premiumsupport/knowledge-center/auto-scaling-group-rolling-updates/
      [ScalingProcess.HealthCheck, ScalingProcess.ReplaceUnhealthy, ScalingProcess.AZRebalance,
        ScalingProcess.AlarmNotification, ScalingProcess.ScheduledActions],
  };
}

class TagManager extends cdk.TagManager {
  protected tagFormatResolve(tagGroups: cdk.TagGroups): any {
    const tags = {...tagGroups.nonStickyTags, ...tagGroups.ancestorTags, ...tagGroups.stickyTags};
    return Object.keys(tags).map( (key) => {
      const propagateAtLaunch = !!tagGroups.propagateTags[key] || !!tagGroups.ancestorTags[key];
      return {key, value: tags[key], propagateAtLaunch};
    });
  }
}

/**
 * Render a number of seconds to a PTnX string.
 */
function renderIsoDuration(seconds: number): string {
  const ret: string[] = [];

  if (seconds >= 3600) {
    ret.push(`${Math.floor(seconds / 3600)}H`);
    seconds %= 3600;
  }
  if (seconds >= 60) {
    ret.push(`${Math.floor(seconds / 60)}M`);
    seconds %= 60;
  }
  if (seconds > 0) {
    ret.push(`${seconds}S`);
  }

  return 'PT' + ret.join('');
}

function validatePercentage(x?: number): number | undefined {
  if (x === undefined || (0 <= x && x <= 100)) { return x; }
  throw new Error(`Expected: a percentage 0..100, got: ${x}`);
}
