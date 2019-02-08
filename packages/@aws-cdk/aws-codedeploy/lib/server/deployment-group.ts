import autoscaling = require('@aws-cdk/aws-autoscaling');
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import codedeploylb = require('@aws-cdk/aws-codedeploy-api');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { CfnDeploymentGroup } from '../codedeploy.generated';
import { CommonPipelineDeployActionProps, PipelineDeployAction } from '../pipeline-action';
import { AutoRollbackConfig } from '../rollback-config';
import { deploymentGroupNameToArn, renderAlarmConfiguration, renderAutoRollbackConfiguration } from '../utils';
import { IServerApplication, ServerApplication } from './application';
import { IServerDeploymentConfig, ServerDeploymentConfig } from './deployment-config';

export interface IServerDeploymentGroup extends cdk.IConstruct {
  readonly application: IServerApplication;
  readonly role?: iam.Role;
  readonly deploymentGroupName: string;
  readonly deploymentGroupArn: string;
  readonly deploymentConfig: IServerDeploymentConfig;
  readonly autoScalingGroups?: autoscaling.AutoScalingGroup[];
  export(): ServerDeploymentGroupImportProps;

  /**
   * Convenience method for creating a new {@link PipelineDeployAction}.
   *
   * @param props the construction properties of the new Action
   * @returns the newly created {@link PipelineDeployAction}
   */
  toCodePipelineDeployAction(props: CommonPipelineDeployActionProps): PipelineDeployAction;
}

/**
 * Properties of a reference to a CodeDeploy EC2/on-premise Deployment Group.
 *
 * @see ServerDeploymentGroup#import
 * @see IServerDeploymentGroup#export
 */
export interface ServerDeploymentGroupImportProps {
  /**
   * The reference to the CodeDeploy EC2/on-premise Application
   * that this Deployment Group belongs to.
   */
  application: IServerApplication;

  /**
   * The physical, human-readable name of the CodeDeploy EC2/on-premise Deployment Group
   * that we are referencing.
   */
  deploymentGroupName: string;

  /**
   * The Deployment Configuration this Deployment Group uses.
   *
   * @default ServerDeploymentConfig#OneAtATime
   */
  deploymentConfig?: IServerDeploymentConfig;
}

/**
 * Represents a reference to a CodeDeploy EC2/on-premise Deployment Group.
 *
 * If you're managing the Deployment Group alongside the rest of your CDK resources,
 * use the {@link ServerDeploymentGroup} class.
 *
 * If you want to reference an already existing Deployment Group,
 * or one defined in a different CDK Stack,
 * use the {@link #import} method.
 */
export abstract class ServerDeploymentGroupBase extends cdk.Construct implements IServerDeploymentGroup {
  public abstract readonly application: IServerApplication;
  public abstract readonly role?: iam.Role;
  public abstract readonly deploymentGroupName: string;
  public abstract readonly deploymentGroupArn: string;
  public readonly deploymentConfig: IServerDeploymentConfig;
  public abstract readonly autoScalingGroups?: autoscaling.AutoScalingGroup[];

  constructor(scope: cdk.Construct, id: string, deploymentConfig?: IServerDeploymentConfig) {
    super(scope, id);
    this.deploymentConfig = deploymentConfig || ServerDeploymentConfig.OneAtATime;
  }

  public abstract export(): ServerDeploymentGroupImportProps;

  public toCodePipelineDeployAction(props: CommonPipelineDeployActionProps):
      PipelineDeployAction {
    return new PipelineDeployAction({
      ...props,
      deploymentGroup: this,
    });
  }
}

class ImportedServerDeploymentGroup extends ServerDeploymentGroupBase {
  public readonly application: IServerApplication;
  public readonly role?: iam.Role = undefined;
  public readonly deploymentGroupName: string;
  public readonly deploymentGroupArn: string;
  public readonly autoScalingGroups?: autoscaling.AutoScalingGroup[] = undefined;

  constructor(scope: cdk.Construct, id: string, private readonly props: ServerDeploymentGroupImportProps) {
    super(scope, id, props.deploymentConfig);

    this.application = props.application;
    this.deploymentGroupName = props.deploymentGroupName;
    this.deploymentGroupArn = deploymentGroupNameToArn(props.application.applicationName,
      props.deploymentGroupName, this);
  }

  public export() {
    return this.props;
  }
}

/**
 * Represents a group of instance tags.
 * An instance will match a group if it has a tag matching
 * any of the group's tags by key and any of the provided values -
 * in other words, tag groups follow 'or' semantics.
 * If the value for a given key is an empty array,
 * an instance will match when it has a tag with the given key,
 * regardless of the value.
 * If the key is an empty string, any tag,
 * regardless of its key, with any of the given values, will match.
 */
export type InstanceTagGroup = {[key: string]: string[]};

/**
 * Represents a set of instance tag groups.
 * An instance will match a set if it matches all of the groups in the set -
 * in other words, sets follow 'and' semantics.
 * You can have a maximum of 3 tag groups inside a set.
 */
export class InstanceTagSet {
  private readonly _instanceTagGroups: InstanceTagGroup[];

  constructor(...instanceTagGroups: InstanceTagGroup[]) {
    if (instanceTagGroups.length > 3) {
      throw new Error('An instance tag set can have a maximum of 3 instance tag groups, ' +
        `but ${instanceTagGroups.length} were provided`);
    }
    this._instanceTagGroups = instanceTagGroups;
  }

  public get instanceTagGroups(): InstanceTagGroup[] {
    return this._instanceTagGroups.slice();
  }
}

/**
 * Construction properties for {@link ServerDeploymentGroup}.
 */
export interface ServerDeploymentGroupProps {
  /**
   * The CodeDeploy EC2/on-premise Application this Deployment Group belongs to.
   * If you don't provide one, a new Application will be created.
   */
  application?: IServerApplication;

  /**
   * The service Role of this Deployment Group.
   * If you don't provide one, a new Role will be created.
   */
  role?: iam.Role;

  /**
   * The physical, human-readable name of the CodeDeploy Deployment Group.
   *
   * @default an auto-generated name will be used
   */
  deploymentGroupName?: string;

  /**
   * The EC2/on-premise Deployment Configuration to use for this Deployment Group.
   *
   * @default ServerDeploymentConfig#OneAtATime
   */
  deploymentConfig?: IServerDeploymentConfig;

  /**
   * The auto-scaling groups belonging to this Deployment Group.
   *
   * Auto-scaling groups can also be added after the Deployment Group is created using the {@link #addAutoScalingGroup} method.
   *
   * @default []
   */
  autoScalingGroups?: autoscaling.AutoScalingGroup[];

  /**
   * If you've provided any auto-scaling groups with the {@link #autoScalingGroups} property,
   * you can set this property to add User Data that installs the CodeDeploy agent on the instances.
   *
   * @default true
   * @see https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-install.html
   */
  installAgent?: boolean;

  /**
   * The load balancer to place in front of this Deployment Group.
   * Can be either a classic Elastic Load Balancer,
   * or an Application Load Balancer / Network Load Balancer Target Group.
   *
   * @default the Deployment Group will not have a load balancer defined
   */
  loadBalancer?: codedeploylb.ILoadBalancer;

  /**
   * All EC2 instances matching the given set of tags when a deployment occurs will be added to this Deployment Group.
   *
   * @default no additional EC2 instances will be added to the Deployment Group
   */
  ec2InstanceTags?: InstanceTagSet;

  /**
   * All on-premise instances matching the given set of tags when a deployment occurs will be added to this Deployment Group.
   *
   * @default no additional on-premise instances will be added to the Deployment Group
   */
  onPremiseInstanceTags?: InstanceTagSet;

  /**
   * The CloudWatch alarms associated with this Deployment Group.
   * CodeDeploy will stop (and optionally roll back)
   * a deployment if during it any of the alarms trigger.
   *
   * Alarms can also be added after the Deployment Group is created using the {@link #addAlarm} method.
   *
   * @default []
   * @see https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-create-alarms.html
   */
  alarms?: cloudwatch.Alarm[];

  /**
   * Whether to continue a deployment even if fetching the alarm status from CloudWatch failed.
   *
   * @default false
   */
  ignorePollAlarmsFailure?: boolean;

  /**
   * The auto-rollback configuration for this Deployment Group.
   */
  autoRollback?: AutoRollbackConfig;
}

/**
 * A CodeDeploy Deployment Group that deploys to EC2/on-premise instances.
 */
export class ServerDeploymentGroup extends ServerDeploymentGroupBase {
  /**
   * Import an EC2/on-premise Deployment Group defined either outside the CDK,
   * or in a different CDK Stack and exported using the {@link #export} method.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param props the properties of the referenced Deployment Group
   * @returns a Construct representing a reference to an existing Deployment Group
   */
  public static import(scope: cdk.Construct, id: string, props: ServerDeploymentGroupImportProps): IServerDeploymentGroup {
    return new ImportedServerDeploymentGroup(scope, id, props);
  }

  public readonly application: IServerApplication;
  public readonly role?: iam.Role;
  public readonly deploymentGroupArn: string;
  public readonly deploymentGroupName: string;

  private readonly _autoScalingGroups: autoscaling.AutoScalingGroup[];
  private readonly installAgent: boolean;
  private readonly codeDeployBucket: s3.IBucket;
  private readonly alarms: cloudwatch.Alarm[];

  constructor(scope: cdk.Construct, id: string, props: ServerDeploymentGroupProps = {}) {
    super(scope, id, props.deploymentConfig);

    this.application = props.application || new ServerApplication(this, 'Application');

    this.role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('codedeploy.amazonaws.com'),
      managedPolicyArns: ['arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole'],
    });

    this._autoScalingGroups = props.autoScalingGroups || [];
    this.installAgent = props.installAgent === undefined ? true : props.installAgent;
    const stack = cdk.Stack.find(this);
    this.codeDeployBucket = s3.Bucket.import(this, 'CodeDeployBucket', {
      bucketName: `aws-codedeploy-${stack.region}`,
    });
    for (const asg of this._autoScalingGroups) {
      this.addCodeDeployAgentInstallUserData(asg);
    }

    this.alarms = props.alarms || [];

    const resource = new CfnDeploymentGroup(this, 'Resource', {
      applicationName: this.application.applicationName,
      deploymentGroupName: props.deploymentGroupName,
      serviceRoleArn: this.role.roleArn,
      deploymentConfigName: props.deploymentConfig &&
        props.deploymentConfig.deploymentConfigName,
      autoScalingGroups: new cdk.Token(() =>
        this._autoScalingGroups.length === 0
          ? undefined
          : this._autoScalingGroups.map(asg => asg.autoScalingGroupName)),
      loadBalancerInfo: this.loadBalancerInfo(props.loadBalancer),
      deploymentStyle: props.loadBalancer === undefined
        ? undefined
        : {
          deploymentOption: 'WITH_TRAFFIC_CONTROL',
        },
      ec2TagSet: this.ec2TagSet(props.ec2InstanceTags),
      onPremisesTagSet: this.onPremiseTagSet(props.onPremiseInstanceTags),
      alarmConfiguration: new cdk.Token(() => renderAlarmConfiguration(this.alarms, props.ignorePollAlarmsFailure)),
      autoRollbackConfiguration: new cdk.Token(() => renderAutoRollbackConfiguration(this.alarms, props.autoRollback)),
    });

    this.deploymentGroupName = resource.deploymentGroupName;
    this.deploymentGroupArn = deploymentGroupNameToArn(this.application.applicationName,
      this.deploymentGroupName, this);
  }

  public export(): ServerDeploymentGroupImportProps {
    return {
      application: this.application,
      deploymentGroupName: new cdk.Output(this, 'DeploymentGroupName', {
        value: this.deploymentGroupName
      }).makeImportValue().toString(),
      deploymentConfig: this.deploymentConfig,
    };
  }

  /**
   * Adds an additional auto-scaling group to this Deployment Group.
   *
   * @param asg the auto-scaling group to add to this Deployment Group
   */
  public addAutoScalingGroup(asg: autoscaling.AutoScalingGroup): void {
    this._autoScalingGroups.push(asg);
    this.addCodeDeployAgentInstallUserData(asg);
  }

  /**
   * Associates an additional alarm with this Deployment Group.
   *
   * @param alarm the alarm to associate with this Deployment Group
   */
  public addAlarm(alarm: cloudwatch.Alarm): void {
    this.alarms.push(alarm);
  }

  public get autoScalingGroups(): autoscaling.AutoScalingGroup[] | undefined {
    return this._autoScalingGroups.slice();
  }

  private addCodeDeployAgentInstallUserData(asg: autoscaling.AutoScalingGroup): void {
    if (!this.installAgent) {
      return;
    }

    this.codeDeployBucket.grantRead(asg.role, 'latest/*');

    const stack = cdk.Stack.find(this);
    switch (asg.osType) {
      case ec2.OperatingSystemType.Linux:
        asg.addUserData(
          'PKG_CMD=`which yum 2>/dev/null`',
          'if [ -z "$PKG_CMD" ]; then',
            'PKG_CMD=apt-get',
          'else',
            'PKG=CMD=yum',
          'fi',
          '$PKG_CMD update -y',
          '$PKG_CMD install -y ruby2.0',
          'if [ $? -ne 0 ]; then',
            '$PKG_CMD install -y ruby',
          'fi',
          '$PKG_CMD install -y awscli',
          'TMP_DIR=`mktemp -d`',
          'cd $TMP_DIR',
          `aws s3 cp s3://aws-codedeploy-${stack.region}/latest/install . --region ${stack.region}`,
          'chmod +x ./install',
          './install auto',
          'rm -fr $TMP_DIR',
        );
        break;
      case ec2.OperatingSystemType.Windows:
        asg.addUserData(
          'Set-Variable -Name TEMPDIR -Value (New-TemporaryFile).DirectoryName',
          `aws s3 cp s3://aws-codedeploy-${stack.region}/latest/codedeploy-agent.msi $TEMPDIR\\codedeploy-agent.msi`,
          '$TEMPDIR\\codedeploy-agent.msi /quiet /l c:\\temp\\host-agent-install-log.txt',
        );
        break;
    }
  }

  private loadBalancerInfo(lbProvider?: codedeploylb.ILoadBalancer):
      CfnDeploymentGroup.LoadBalancerInfoProperty | undefined {
    if (!lbProvider) {
      return undefined;
    }

    const lb = lbProvider.asCodeDeployLoadBalancer();

    switch (lb.generation) {
      case codedeploylb.LoadBalancerGeneration.First:
        return {
          elbInfoList: [
            { name: lb.name },
          ],
        };
      case codedeploylb.LoadBalancerGeneration.Second:
        return {
          targetGroupInfoList: [
            { name: lb.name },
          ]
        };
    }
  }

  private ec2TagSet(tagSet?: InstanceTagSet):
      CfnDeploymentGroup.EC2TagSetProperty | undefined {
    if (!tagSet || tagSet.instanceTagGroups.length === 0) {
      return undefined;
    }

    return {
      ec2TagSetList: tagSet.instanceTagGroups.map(tagGroup => {
        return {
          ec2TagGroup: this.tagGroup2TagsArray(tagGroup) as
            CfnDeploymentGroup.EC2TagFilterProperty[],
        };
      }),
    };
  }

  private onPremiseTagSet(tagSet?: InstanceTagSet):
      CfnDeploymentGroup.OnPremisesTagSetProperty | undefined {
    if (!tagSet || tagSet.instanceTagGroups.length === 0) {
      return undefined;
    }

    return {
      onPremisesTagSetList: tagSet.instanceTagGroups.map(tagGroup => {
        return {
          onPremisesTagGroup: this.tagGroup2TagsArray(tagGroup) as
            CfnDeploymentGroup.TagFilterProperty[],
        };
      }),
    };
  }

  private tagGroup2TagsArray(tagGroup: InstanceTagGroup): any[] {
    const tagsInGroup = [];
    for (const tagKey in tagGroup) {
      if (tagGroup.hasOwnProperty(tagKey)) {
        const tagValues = tagGroup[tagKey];
        if (tagKey.length > 0) {
          if (tagValues.length > 0) {
            for (const tagValue of tagValues) {
              tagsInGroup.push({
                key: tagKey,
                value: tagValue,
                type: 'KEY_AND_VALUE',
              });
            }
          } else {
            tagsInGroup.push({
              key: tagKey,
              type: 'KEY_ONLY',
            });
          }
        } else {
          if (tagValues.length > 0) {
            for (const tagValue of tagValues) {
              tagsInGroup.push({
                value: tagValue,
                type: 'VALUE_ONLY',
              });
            }
          } else {
            throw new Error('Cannot specify both an empty key and no values for an instance tag filter');
          }
        }
      }
    }
    return tagsInGroup;
  }
}
