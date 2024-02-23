/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specifies a lifecycle policy, which is used to automate operations on Amazon EBS resources.
 *
 * The properties are required when you add a lifecycle policy and optional when you update a lifecycle policy.
 *
 * @cloudformationResource AWS::DLM::LifecyclePolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html
 */
export class CfnLifecyclePolicy extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DLM::LifecyclePolicy";

  /**
   * Build a CfnLifecyclePolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLifecyclePolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLifecyclePolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLifecyclePolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the lifecycle policy.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * *[Default policies only]* Indicates whether the policy should copy tags from the source resource to the snapshot or AMI.
   */
  public copyTags?: boolean | cdk.IResolvable;

  /**
   * *[Default policies only]* Specifies how often the policy should run and create snapshots or AMIs.
   */
  public createInterval?: number;

  /**
   * *[Default policies only]* Specifies destination Regions for snapshot or AMI copies.
   */
  public crossRegionCopyTargets?: any | cdk.IResolvable;

  /**
   * *[Default policies only]* Specify the type of default policy to create.
   */
  public defaultPolicy?: string;

  /**
   * A description of the lifecycle policy.
   */
  public description?: string;

  /**
   * *[Default policies only]* Specifies exclusion parameters for volumes or instances for which you do not want to create snapshots or AMIs.
   */
  public exclusions?: CfnLifecyclePolicy.ExclusionsProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the IAM role used to run the operations specified by the lifecycle policy.
   */
  public executionRoleArn?: string;

  /**
   * *[Default policies only]* Defines the snapshot or AMI retention behavior for the policy if the source volume or instance is deleted, or if the policy enters the error, disabled, or deleted state.
   */
  public extendDeletion?: boolean | cdk.IResolvable;

  /**
   * The configuration details of the lifecycle policy.
   */
  public policyDetails?: cdk.IResolvable | CfnLifecyclePolicy.PolicyDetailsProperty;

  /**
   * *[Default policies only]* Specifies how long the policy should retain snapshots or AMIs before deleting them.
   */
  public retainInterval?: number;

  /**
   * The activation state of the lifecycle policy.
   */
  public state?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to apply to the lifecycle policy during creation.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLifecyclePolicyProps = {}) {
    super(scope, id, {
      "type": CfnLifecyclePolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.copyTags = props.copyTags;
    this.createInterval = props.createInterval;
    this.crossRegionCopyTargets = props.crossRegionCopyTargets;
    this.defaultPolicy = props.defaultPolicy;
    this.description = props.description;
    this.exclusions = props.exclusions;
    this.executionRoleArn = props.executionRoleArn;
    this.extendDeletion = props.extendDeletion;
    this.policyDetails = props.policyDetails;
    this.retainInterval = props.retainInterval;
    this.state = props.state;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DLM::LifecyclePolicy", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "copyTags": this.copyTags,
      "createInterval": this.createInterval,
      "crossRegionCopyTargets": this.crossRegionCopyTargets,
      "defaultPolicy": this.defaultPolicy,
      "description": this.description,
      "exclusions": this.exclusions,
      "executionRoleArn": this.executionRoleArn,
      "extendDeletion": this.extendDeletion,
      "policyDetails": this.policyDetails,
      "retainInterval": this.retainInterval,
      "state": this.state,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLifecyclePolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLifecyclePolicyPropsToCloudFormation(props);
  }
}

export namespace CfnLifecyclePolicy {
  /**
   * Specifies the configuration of a lifecycle policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html
   */
  export interface PolicyDetailsProperty {
    /**
     * *[Event-based policies only]* The actions to be performed when the event-based policy is activated.
     *
     * You can specify only one action per policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-actions
     */
    readonly actions?: Array<CfnLifecyclePolicy.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * *[Default policies only]* Indicates whether the policy should copy tags from the source resource to the snapshot or AMI.
     *
     * If you do not specify a value, the default is `false` .
     *
     * Default: false
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-copytags
     */
    readonly copyTags?: boolean | cdk.IResolvable;

    /**
     * *[Default policies only]* Specifies how often the policy should run and create snapshots or AMIs.
     *
     * The creation frequency can range from 1 to 7 days. If you do not specify a value, the default is 1.
     *
     * Default: 1
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-createinterval
     */
    readonly createInterval?: number;

    /**
     * *[Default policies only]* Specifies destination Regions for snapshot or AMI copies.
     *
     * You can specify up to 3 destination Regions. If you do not want to create cross-Region copies, omit this parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-crossregioncopytargets
     */
    readonly crossRegionCopyTargets?: any | cdk.IResolvable;

    /**
     * *[Event-based policies only]* The event that activates the event-based policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-eventsource
     */
    readonly eventSource?: CfnLifecyclePolicy.EventSourceProperty | cdk.IResolvable;

    /**
     * *[Default policies only]* Specifies exclusion parameters for volumes or instances for which you do not want to create snapshots or AMIs.
     *
     * The policy will not create snapshots or AMIs for target resources that match any of the specified exclusion parameters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-exclusions
     */
    readonly exclusions?: CfnLifecyclePolicy.ExclusionsProperty | cdk.IResolvable;

    /**
     * *[Default policies only]* Defines the snapshot or AMI retention behavior for the policy if the source volume or instance is deleted, or if the policy enters the error, disabled, or deleted state.
     *
     * By default ( *ExtendDeletion=false* ):
     *
     * - If a source resource is deleted, Amazon Data Lifecycle Manager will continue to delete previously created snapshots or AMIs, up to but not including the last one, based on the specified retention period. If you want Amazon Data Lifecycle Manager to delete all snapshots or AMIs, including the last one, specify `true` .
     * - If a policy enters the error, disabled, or deleted state, Amazon Data Lifecycle Manager stops deleting snapshots and AMIs. If you want Amazon Data Lifecycle Manager to continue deleting snapshots or AMIs, including the last one, if the policy enters one of these states, specify `true` .
     *
     * If you enable extended deletion ( *ExtendDeletion=true* ), you override both default behaviors simultaneously.
     *
     * If you do not specify a value, the default is `false` .
     *
     * Default: false
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-extenddeletion
     */
    readonly extendDeletion?: boolean | cdk.IResolvable;

    /**
     * *[Custom snapshot and AMI policies only]* A set of optional parameters for snapshot and AMI lifecycle policies.
     *
     * > If you are modifying a policy that was created or previously modified using the Amazon Data Lifecycle Manager console, then you must include this parameter and specify either the default values or the new values that you require. You can't omit this parameter or set its values to null.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-parameters
     */
    readonly parameters?: cdk.IResolvable | CfnLifecyclePolicy.ParametersProperty;

    /**
     * The type of policy to create. Specify one of the following:.
     *
     * - `SIMPLIFIED` To create a default policy.
     * - `STANDARD` To create a custom policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-policylanguage
     */
    readonly policyLanguage?: string;

    /**
     * The type of policy.
     *
     * Specify `EBS_SNAPSHOT_MANAGEMENT` to create a lifecycle policy that manages the lifecycle of Amazon EBS snapshots. Specify `IMAGE_MANAGEMENT` to create a lifecycle policy that manages the lifecycle of EBS-backed AMIs. Specify `EVENT_BASED_POLICY` to create an event-based policy that performs specific actions when a defined event occurs in your AWS account .
     *
     * The default is `EBS_SNAPSHOT_MANAGEMENT` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-policytype
     */
    readonly policyType?: string;

    /**
     * *[Custom snapshot and AMI policies only]* The location of the resources to backup.
     *
     * If the source resources are located in an AWS Region , specify `CLOUD` . If the source resources are located on an Outpost in your account, specify `OUTPOST` .
     *
     * If you specify `OUTPOST` , Amazon Data Lifecycle Manager backs up all resources of the specified type with matching target tags across all of the Outposts in your account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-resourcelocations
     */
    readonly resourceLocations?: Array<string>;

    /**
     * *[Default policies only]* Specify the type of default policy to create.
     *
     * - To create a default policy for EBS snapshots, that creates snapshots of all volumes in the Region that do not have recent backups, specify `VOLUME` .
     * - To create a default policy for EBS-backed AMIs, that creates EBS-backed AMIs from all instances in the Region that do not have recent backups, specify `INSTANCE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-resourcetype
     */
    readonly resourceType?: string;

    /**
     * *[Custom snapshot policies only]* The target resource type for snapshot and AMI lifecycle policies.
     *
     * Use `VOLUME` to create snapshots of individual volumes or use `INSTANCE` to create multi-volume snapshots from the volumes for an instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-resourcetypes
     */
    readonly resourceTypes?: Array<string>;

    /**
     * *[Default policies only]* Specifies how long the policy should retain snapshots or AMIs before deleting them.
     *
     * The retention period can range from 2 to 14 days, but it must be greater than the creation frequency to ensure that the policy retains at least 1 snapshot or AMI at any given time. If you do not specify a value, the default is 7.
     *
     * Default: 7
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-retaininterval
     */
    readonly retainInterval?: number;

    /**
     * *[Custom snapshot and AMI policies only]* The schedules of policy-defined actions for snapshot and AMI lifecycle policies.
     *
     * A policy can have up to four schedules—one mandatory schedule and up to three optional schedules.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-schedules
     */
    readonly schedules?: Array<cdk.IResolvable | CfnLifecyclePolicy.ScheduleProperty> | cdk.IResolvable;

    /**
     * *[Custom snapshot and AMI policies only]* The single tag that identifies targeted resources for this policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-targettags
     */
    readonly targetTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * *[Custom snapshot and AMI policies only]* Specifies a schedule for a snapshot or AMI lifecycle policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html
   */
  export interface ScheduleProperty {
    /**
     * *[Custom snapshot policies that target volumes only]* The snapshot archiving rule for the schedule.
     *
     * When you specify an archiving rule, snapshots are automatically moved from the standard tier to the archive tier once the schedule's retention threshold is met. Snapshots are then retained in the archive tier for the archive retention period that you specify.
     *
     * For more information about using snapshot archiving, see [Considerations for snapshot lifecycle policies](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-ami-policy.html#dlm-archive) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-archiverule
     */
    readonly archiveRule?: CfnLifecyclePolicy.ArchiveRuleProperty | cdk.IResolvable;

    /**
     * Copy all user-defined tags on a source volume to snapshots of the volume created by this policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-copytags
     */
    readonly copyTags?: boolean | cdk.IResolvable;

    /**
     * The creation rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-createrule
     */
    readonly createRule?: CfnLifecyclePolicy.CreateRuleProperty | cdk.IResolvable;

    /**
     * Specifies a rule for copying snapshots or AMIs across regions.
     *
     * > You can't specify cross-Region copy rules for policies that create snapshots on an Outpost. If the policy creates snapshots in a Region, then snapshots can be copied to up to three Regions or Outposts.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-crossregioncopyrules
     */
    readonly crossRegionCopyRules?: Array<CfnLifecyclePolicy.CrossRegionCopyRuleProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * *[Custom AMI policies only]* The AMI deprecation rule for the schedule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-deprecaterule
     */
    readonly deprecateRule?: CfnLifecyclePolicy.DeprecateRuleProperty | cdk.IResolvable;

    /**
     * *[Custom snapshot policies only]* The rule for enabling fast snapshot restore.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-fastrestorerule
     */
    readonly fastRestoreRule?: CfnLifecyclePolicy.FastRestoreRuleProperty | cdk.IResolvable;

    /**
     * The name of the schedule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-name
     */
    readonly name?: string;

    /**
     * The retention rule for snapshots or AMIs created by the policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-retainrule
     */
    readonly retainRule?: cdk.IResolvable | CfnLifecyclePolicy.RetainRuleProperty;

    /**
     * *[Custom snapshot policies only]* The rule for sharing snapshots with other AWS accounts .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-sharerules
     */
    readonly shareRules?: Array<cdk.IResolvable | CfnLifecyclePolicy.ShareRuleProperty> | cdk.IResolvable;

    /**
     * The tags to apply to policy-created resources.
     *
     * These user-defined tags are in addition to the AWS -added lifecycle tags.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-tagstoadd
     */
    readonly tagsToAdd?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

    /**
     * *[AMI policies and snapshot policies that target instances only]* A collection of key/value pairs with values determined dynamically when the policy is executed.
     *
     * Keys may be any valid Amazon EC2 tag key. Values must be in one of the two following formats: `$(instance-id)` or `$(timestamp)` . Variable tags are only valid for EBS Snapshot Management – Instance policies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-variabletags
     */
    readonly variableTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * *[Custom snapshot policies only]* Specifies a rule for sharing snapshots across AWS accounts .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-sharerule.html
   */
  export interface ShareRuleProperty {
    /**
     * The IDs of the AWS accounts with which to share the snapshots.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-sharerule.html#cfn-dlm-lifecyclepolicy-sharerule-targetaccounts
     */
    readonly targetAccounts?: Array<string>;

    /**
     * The period after which snapshots that are shared with other AWS accounts are automatically unshared.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-sharerule.html#cfn-dlm-lifecyclepolicy-sharerule-unshareinterval
     */
    readonly unshareInterval?: number;

    /**
     * The unit of time for the automatic unsharing interval.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-sharerule.html#cfn-dlm-lifecyclepolicy-sharerule-unshareintervalunit
     */
    readonly unshareIntervalUnit?: string;
  }

  /**
   * *[Custom AMI policies only]* Specifies an AMI deprecation rule for AMIs created by an AMI lifecycle policy.
   *
   * For age-based schedules, you must specify *Interval* and *IntervalUnit* . For count-based schedules, you must specify *Count* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-deprecaterule.html
   */
  export interface DeprecateRuleProperty {
    /**
     * If the schedule has a count-based retention rule, this parameter specifies the number of oldest AMIs to deprecate.
     *
     * The count must be less than or equal to the schedule's retention count, and it can't be greater than 1000.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-deprecaterule.html#cfn-dlm-lifecyclepolicy-deprecaterule-count
     */
    readonly count?: number;

    /**
     * If the schedule has an age-based retention rule, this parameter specifies the period after which to deprecate AMIs created by the schedule.
     *
     * The period must be less than or equal to the schedule's retention period, and it can't be greater than 10 years. This is equivalent to 120 months, 520 weeks, or 3650 days.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-deprecaterule.html#cfn-dlm-lifecyclepolicy-deprecaterule-interval
     */
    readonly interval?: number;

    /**
     * The unit of time in which to measure the *Interval* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-deprecaterule.html#cfn-dlm-lifecyclepolicy-deprecaterule-intervalunit
     */
    readonly intervalUnit?: string;
  }

  /**
   * *[Custom snapshot and AMI policies only]* Specifies when the policy should create snapshots or AMIs.
   *
   * > - You must specify either *CronExpression* , or *Interval* , *IntervalUnit* , and *Times* .
   * > - If you need to specify an [ArchiveRule](https://docs.aws.amazon.com/dlm/latest/APIReference/API_ArchiveRule.html) for the schedule, then you must specify a creation frequency of at least 28 days.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html
   */
  export interface CreateRuleProperty {
    /**
     * The schedule, as a Cron expression.
     *
     * The schedule interval must be between 1 hour and 1 year. For more information, see [Cron expressions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions) in the *Amazon CloudWatch User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-cronexpression
     */
    readonly cronExpression?: string;

    /**
     * The interval between snapshots.
     *
     * The supported values are 1, 2, 3, 4, 6, 8, 12, and 24.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-interval
     */
    readonly interval?: number;

    /**
     * The interval unit.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-intervalunit
     */
    readonly intervalUnit?: string;

    /**
     * *[Custom snapshot policies only]* Specifies the destination for snapshots created by the policy.
     *
     * To create snapshots in the same Region as the source resource, specify `CLOUD` . To create snapshots on the same Outpost as the source resource, specify `OUTPOST_LOCAL` . If you omit this parameter, `CLOUD` is used by default.
     *
     * If the policy targets resources in an AWS Region , then you must create snapshots in the same Region as the source resource. If the policy targets resources on an Outpost, then you can create snapshots on the same Outpost as the source resource, or in the Region of that Outpost.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-location
     */
    readonly location?: string;

    /**
     * *[Custom snapshot policies that target instances only]* Specifies pre and/or post scripts for a snapshot lifecycle policy that targets instances.
     *
     * This is useful for creating application-consistent snapshots, or for performing specific administrative tasks before or after Amazon Data Lifecycle Manager initiates snapshot creation.
     *
     * For more information, see [Automating application-consistent snapshots with pre and post scripts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/automate-app-consistent-backups.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-scripts
     */
    readonly scripts?: Array<cdk.IResolvable | CfnLifecyclePolicy.ScriptProperty> | cdk.IResolvable;

    /**
     * The time, in UTC, to start the operation. The supported format is hh:mm.
     *
     * The operation occurs within a one-hour window following the specified time. If you do not specify a time, Amazon Data Lifecycle Manager selects a time within the next 24 hours.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-times
     */
    readonly times?: Array<string>;
  }

  /**
   * *[Custom snapshot policies that target instances only]* Information about pre and/or post scripts for a snapshot lifecycle policy that targets instances.
   *
   * For more information, see [Automating application-consistent snapshots with pre and post scripts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/automate-app-consistent-backups.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-script.html
   */
  export interface ScriptProperty {
    /**
     * Indicates whether Amazon Data Lifecycle Manager should default to crash-consistent snapshots if the pre script fails.
     *
     * - To default to crash consistent snapshot if the pre script fails, specify `true` .
     * - To skip the instance for snapshot creation if the pre script fails, specify `false` .
     *
     * This parameter is supported only if you run a pre script. If you run a post script only, omit this parameter.
     *
     * Default: true
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-script.html#cfn-dlm-lifecyclepolicy-script-executeoperationonscriptfailure
     */
    readonly executeOperationOnScriptFailure?: boolean | cdk.IResolvable;

    /**
     * The SSM document that includes the pre and/or post scripts to run.
     *
     * - If you are automating VSS backups, specify `AWS_VSS_BACKUP` . In this case, Amazon Data Lifecycle Manager automatically uses the `AWSEC2-CreateVssSnapshot` SSM document.
     * - If you are automating application-consistent snapshots for SAP HANA workloads, specify `AWSSystemsManagerSAP-CreateDLMSnapshotForSAPHANA` .
     * - If you are using a custom SSM document that you own, specify either the name or ARN of the SSM document. If you are using a custom SSM document that is shared with you, specify the ARN of the SSM document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-script.html#cfn-dlm-lifecyclepolicy-script-executionhandler
     */
    readonly executionHandler?: string;

    /**
     * Indicates the service used to execute the pre and/or post scripts.
     *
     * - If you are using custom SSM documents or automating application-consistent snapshots of SAP HANA workloads, specify `AWS_SYSTEMS_MANAGER` .
     * - If you are automating VSS Backups, omit this parameter.
     *
     * Default: AWS_SYSTEMS_MANAGER
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-script.html#cfn-dlm-lifecyclepolicy-script-executionhandlerservice
     */
    readonly executionHandlerService?: string;

    /**
     * Specifies a timeout period, in seconds, after which Amazon Data Lifecycle Manager fails the script run attempt if it has not completed.
     *
     * If a script does not complete within its timeout period, Amazon Data Lifecycle Manager fails the attempt. The timeout period applies to the pre and post scripts individually.
     *
     * If you are automating VSS Backups, omit this parameter.
     *
     * Default: 10
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-script.html#cfn-dlm-lifecyclepolicy-script-executiontimeout
     */
    readonly executionTimeout?: number;

    /**
     * Specifies the number of times Amazon Data Lifecycle Manager should retry scripts that fail.
     *
     * - If the pre script fails, Amazon Data Lifecycle Manager retries the entire snapshot creation process, including running the pre and post scripts.
     * - If the post script fails, Amazon Data Lifecycle Manager retries the post script only; in this case, the pre script will have completed and the snapshot might have been created.
     *
     * If you do not want Amazon Data Lifecycle Manager to retry failed scripts, specify `0` .
     *
     * Default: 0
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-script.html#cfn-dlm-lifecyclepolicy-script-maximumretrycount
     */
    readonly maximumRetryCount?: number;

    /**
     * Indicate which scripts Amazon Data Lifecycle Manager should run on target instances.
     *
     * Pre scripts run before Amazon Data Lifecycle Manager initiates snapshot creation. Post scripts run after Amazon Data Lifecycle Manager initiates snapshot creation.
     *
     * - To run a pre script only, specify `PRE` . In this case, Amazon Data Lifecycle Manager calls the SSM document with the `pre-script` parameter before initiating snapshot creation.
     * - To run a post script only, specify `POST` . In this case, Amazon Data Lifecycle Manager calls the SSM document with the `post-script` parameter after initiating snapshot creation.
     * - To run both pre and post scripts, specify both `PRE` and `POST` . In this case, Amazon Data Lifecycle Manager calls the SSM document with the `pre-script` parameter before initiating snapshot creation, and then it calls the SSM document again with the `post-script` parameter after initiating snapshot creation.
     *
     * If you are automating VSS Backups, omit this parameter.
     *
     * Default: PRE and POST
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-script.html#cfn-dlm-lifecyclepolicy-script-stages
     */
    readonly stages?: Array<string>;
  }

  /**
   * *[Custom snapshot policies only]* Specifies a rule for enabling fast snapshot restore for snapshots created by snapshot policies.
   *
   * You can enable fast snapshot restore based on either a count or a time interval.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html
   */
  export interface FastRestoreRuleProperty {
    /**
     * The Availability Zones in which to enable fast snapshot restore.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html#cfn-dlm-lifecyclepolicy-fastrestorerule-availabilityzones
     */
    readonly availabilityZones?: Array<string>;

    /**
     * The number of snapshots to be enabled with fast snapshot restore.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html#cfn-dlm-lifecyclepolicy-fastrestorerule-count
     */
    readonly count?: number;

    /**
     * The amount of time to enable fast snapshot restore.
     *
     * The maximum is 100 years. This is equivalent to 1200 months, 5200 weeks, or 36500 days.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html#cfn-dlm-lifecyclepolicy-fastrestorerule-interval
     */
    readonly interval?: number;

    /**
     * The unit of time for enabling fast snapshot restore.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html#cfn-dlm-lifecyclepolicy-fastrestorerule-intervalunit
     */
    readonly intervalUnit?: string;
  }

  /**
   * *[Custom snapshot policies only]* Specifies a snapshot archiving rule for a schedule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-archiverule.html
   */
  export interface ArchiveRuleProperty {
    /**
     * Information about the retention period for the snapshot archiving rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-archiverule.html#cfn-dlm-lifecyclepolicy-archiverule-retainrule
     */
    readonly retainRule: CfnLifecyclePolicy.ArchiveRetainRuleProperty | cdk.IResolvable;
  }

  /**
   * *[Custom snapshot policies only]* Specifies information about the archive storage tier retention period.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-archiveretainrule.html
   */
  export interface ArchiveRetainRuleProperty {
    /**
     * Information about retention period in the Amazon EBS Snapshots Archive.
     *
     * For more information, see [Archive Amazon EBS snapshots](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/snapshot-archive.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-archiveretainrule.html#cfn-dlm-lifecyclepolicy-archiveretainrule-retentionarchivetier
     */
    readonly retentionArchiveTier: cdk.IResolvable | CfnLifecyclePolicy.RetentionArchiveTierProperty;
  }

  /**
   * *[Custom snapshot policies only]* Describes the retention rule for archived snapshots.
   *
   * Once the archive retention threshold is met, the snapshots are permanently deleted from the archive tier.
   *
   * > The archive retention rule must retain snapshots in the archive tier for a minimum of 90 days.
   *
   * For *count-based schedules* , you must specify *Count* . For *age-based schedules* , you must specify *Interval* and *IntervalUnit* .
   *
   * For more information about using snapshot archiving, see [Considerations for snapshot lifecycle policies](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-ami-policy.html#dlm-archive) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retentionarchivetier.html
   */
  export interface RetentionArchiveTierProperty {
    /**
     * The maximum number of snapshots to retain in the archive storage tier for each volume.
     *
     * The count must ensure that each snapshot remains in the archive tier for at least 90 days. For example, if the schedule creates snapshots every 30 days, you must specify a count of 3 or more to ensure that each snapshot is archived for at least 90 days.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retentionarchivetier.html#cfn-dlm-lifecyclepolicy-retentionarchivetier-count
     */
    readonly count?: number;

    /**
     * Specifies the period of time to retain snapshots in the archive tier.
     *
     * After this period expires, the snapshot is permanently deleted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retentionarchivetier.html#cfn-dlm-lifecyclepolicy-retentionarchivetier-interval
     */
    readonly interval?: number;

    /**
     * The unit of time in which to measure the *Interval* .
     *
     * For example, to retain a snapshots in the archive tier for 6 months, specify `Interval=6` and `IntervalUnit=MONTHS` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retentionarchivetier.html#cfn-dlm-lifecyclepolicy-retentionarchivetier-intervalunit
     */
    readonly intervalUnit?: string;
  }

  /**
   * *[Custom snapshot and AMI policies only]* Specifies a retention rule for snapshots created by snapshot policies, or for AMIs created by AMI policies.
   *
   * > For snapshot policies that have an [ArchiveRule](https://docs.aws.amazon.com/dlm/latest/APIReference/API_ArchiveRule.html) , this retention rule applies to standard tier retention. When the retention threshold is met, snapshots are moved from the standard to the archive tier.
   * >
   * > For snapshot policies that do not have an *ArchiveRule* , snapshots are permanently deleted when this retention threshold is met.
   *
   * You can retain snapshots based on either a count or a time interval.
   *
   * - *Count-based retention*
   *
   * You must specify *Count* . If you specify an [ArchiveRule](https://docs.aws.amazon.com/dlm/latest/APIReference/API_ArchiveRule.html) for the schedule, then you can specify a retention count of `0` to archive snapshots immediately after creation. If you specify a [FastRestoreRule](https://docs.aws.amazon.com/dlm/latest/APIReference/API_FastRestoreRule.html) , [ShareRule](https://docs.aws.amazon.com/dlm/latest/APIReference/API_ShareRule.html) , or a [CrossRegionCopyRule](https://docs.aws.amazon.com/dlm/latest/APIReference/API_CrossRegionCopyRule.html) , then you must specify a retention count of `1` or more.
   * - *Age-based retention*
   *
   * You must specify *Interval* and *IntervalUnit* . If you specify an [ArchiveRule](https://docs.aws.amazon.com/dlm/latest/APIReference/API_ArchiveRule.html) for the schedule, then you can specify a retention interval of `0` days to archive snapshots immediately after creation. If you specify a [FastRestoreRule](https://docs.aws.amazon.com/dlm/latest/APIReference/API_FastRestoreRule.html) , [ShareRule](https://docs.aws.amazon.com/dlm/latest/APIReference/API_ShareRule.html) , or a [CrossRegionCopyRule](https://docs.aws.amazon.com/dlm/latest/APIReference/API_CrossRegionCopyRule.html) , then you must specify a retention interval of `1` day or more.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retainrule.html
   */
  export interface RetainRuleProperty {
    /**
     * The number of snapshots to retain for each volume, up to a maximum of 1000.
     *
     * For example if you want to retain a maximum of three snapshots, specify `3` . When the fourth snapshot is created, the oldest retained snapshot is deleted, or it is moved to the archive tier if you have specified an [ArchiveRule](https://docs.aws.amazon.com/dlm/latest/APIReference/API_ArchiveRule.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retainrule.html#cfn-dlm-lifecyclepolicy-retainrule-count
     */
    readonly count?: number;

    /**
     * The amount of time to retain each snapshot.
     *
     * The maximum is 100 years. This is equivalent to 1200 months, 5200 weeks, or 36500 days.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retainrule.html#cfn-dlm-lifecyclepolicy-retainrule-interval
     */
    readonly interval?: number;

    /**
     * The unit of time for time-based retention.
     *
     * For example, to retain snapshots for 3 months, specify `Interval=3` and `IntervalUnit=MONTHS` . Once the snapshot has been retained for 3 months, it is deleted, or it is moved to the archive tier if you have specified an [ArchiveRule](https://docs.aws.amazon.com/dlm/latest/APIReference/API_ArchiveRule.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retainrule.html#cfn-dlm-lifecyclepolicy-retainrule-intervalunit
     */
    readonly intervalUnit?: string;
  }

  /**
   * *[Custom snapshot and AMI policies only]* Specifies a cross-Region copy rule for a snapshot and AMI policies.
   *
   * > To specify a cross-Region copy action for event-based polices, use [CrossRegionCopyAction](https://docs.aws.amazon.com/dlm/latest/APIReference/API_CrossRegionCopyAction.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html
   */
  export interface CrossRegionCopyRuleProperty {
    /**
     * The Amazon Resource Name (ARN) of the AWS KMS key to use for EBS encryption.
     *
     * If this parameter is not specified, the default KMS key for the account is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-cmkarn
     */
    readonly cmkArn?: string;

    /**
     * Indicates whether to copy all user-defined tags from the source snapshot or AMI to the cross-Region copy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-copytags
     */
    readonly copyTags?: boolean | cdk.IResolvable;

    /**
     * *[Custom AMI policies only]* The AMI deprecation rule for cross-Region AMI copies created by the rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-deprecaterule
     */
    readonly deprecateRule?: CfnLifecyclePolicy.CrossRegionCopyDeprecateRuleProperty | cdk.IResolvable;

    /**
     * To encrypt a copy of an unencrypted snapshot if encryption by default is not enabled, enable encryption using this parameter.
     *
     * Copies of encrypted snapshots are encrypted, even if this parameter is false or if encryption by default is not enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-encrypted
     */
    readonly encrypted: boolean | cdk.IResolvable;

    /**
     * The retention rule that indicates how long the cross-Region snapshot or AMI copies are to be retained in the destination Region.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-retainrule
     */
    readonly retainRule?: CfnLifecyclePolicy.CrossRegionCopyRetainRuleProperty | cdk.IResolvable;

    /**
     * > Use this parameter for snapshot policies only. For AMI policies, use *TargetRegion* instead.
     *
     * *[Custom snapshot policies only]* The target Region or the Amazon Resource Name (ARN) of the target Outpost for the snapshot copies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-target
     */
    readonly target?: string;

    /**
     * > Use this parameter for AMI policies only.
     *
     * For snapshot policies, use *Target* instead. For snapshot policies created before the *Target* parameter was introduced, this parameter indicates the target Region for snapshot copies.
     *
     * *[Custom AMI policies only]* The target Region or the Amazon Resource Name (ARN) of the target Outpost for the snapshot copies.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-targetregion
     */
    readonly targetRegion?: string;
  }

  /**
   * *[Custom AMI policies only]* Specifies an AMI deprecation rule for cross-Region AMI copies created by an AMI policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopydeprecaterule.html
   */
  export interface CrossRegionCopyDeprecateRuleProperty {
    /**
     * The period after which to deprecate the cross-Region AMI copies.
     *
     * The period must be less than or equal to the cross-Region AMI copy retention period, and it can't be greater than 10 years. This is equivalent to 120 months, 520 weeks, or 3650 days.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopydeprecaterule.html#cfn-dlm-lifecyclepolicy-crossregioncopydeprecaterule-interval
     */
    readonly interval: number;

    /**
     * The unit of time in which to measure the *Interval* .
     *
     * For example, to deprecate a cross-Region AMI copy after 3 months, specify `Interval=3` and `IntervalUnit=MONTHS` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopydeprecaterule.html#cfn-dlm-lifecyclepolicy-crossregioncopydeprecaterule-intervalunit
     */
    readonly intervalUnit: string;
  }

  /**
   * Specifies a retention rule for cross-Region snapshot copies created by snapshot or event-based policies, or cross-Region AMI copies created by AMI policies.
   *
   * After the retention period expires, the cross-Region copy is deleted.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyretainrule.html
   */
  export interface CrossRegionCopyRetainRuleProperty {
    /**
     * The amount of time to retain a cross-Region snapshot or AMI copy.
     *
     * The maximum is 100 years. This is equivalent to 1200 months, 5200 weeks, or 36500 days.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyretainrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyretainrule-interval
     */
    readonly interval: number;

    /**
     * The unit of time for time-based retention.
     *
     * For example, to retain a cross-Region copy for 3 months, specify `Interval=3` and `IntervalUnit=MONTHS` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyretainrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyretainrule-intervalunit
     */
    readonly intervalUnit: string;
  }

  /**
   * *[Event-based policies only]* Specifies an event that activates an event-based policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventsource.html
   */
  export interface EventSourceProperty {
    /**
     * Information about the event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventsource.html#cfn-dlm-lifecyclepolicy-eventsource-parameters
     */
    readonly parameters?: CfnLifecyclePolicy.EventParametersProperty | cdk.IResolvable;

    /**
     * The source of the event.
     *
     * Currently only managed CloudWatch Events rules are supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventsource.html#cfn-dlm-lifecyclepolicy-eventsource-type
     */
    readonly type: string;
  }

  /**
   * *[Event-based policies only]* Specifies an event that activates an event-based policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventparameters.html
   */
  export interface EventParametersProperty {
    /**
     * The snapshot description that can trigger the policy.
     *
     * The description pattern is specified using a regular expression. The policy runs only if a snapshot with a description that matches the specified pattern is shared with your account.
     *
     * For example, specifying `^.*Created for policy: policy-1234567890abcdef0.*$` configures the policy to run only if snapshots created by policy `policy-1234567890abcdef0` are shared with your account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventparameters.html#cfn-dlm-lifecyclepolicy-eventparameters-descriptionregex
     */
    readonly descriptionRegex?: string;

    /**
     * The type of event.
     *
     * Currently, only snapshot sharing events are supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventparameters.html#cfn-dlm-lifecyclepolicy-eventparameters-eventtype
     */
    readonly eventType: string;

    /**
     * The IDs of the AWS accounts that can trigger policy by sharing snapshots with your account.
     *
     * The policy only runs if one of the specified AWS accounts shares a snapshot with your account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventparameters.html#cfn-dlm-lifecyclepolicy-eventparameters-snapshotowner
     */
    readonly snapshotOwner: Array<string>;
  }

  /**
   * *[Custom snapshot and AMI policies only]* Specifies optional parameters for snapshot and AMI policies.
   *
   * The set of valid parameters depends on the combination of policy type and target resource type.
   *
   * If you choose to exclude boot volumes and you specify tags that consequently exclude all of the additional data volumes attached to an instance, then Amazon Data Lifecycle Manager will not create any snapshots for the affected instance, and it will emit a `SnapshotsCreateFailed` Amazon CloudWatch metric. For more information, see [Monitor your policies using Amazon CloudWatch](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitor-dlm-cw-metrics.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-parameters.html
   */
  export interface ParametersProperty {
    /**
     * *[Custom snapshot policies that target instances only]* Indicates whether to exclude the root volume from multi-volume snapshot sets.
     *
     * The default is `false` . If you specify `true` , then the root volumes attached to targeted instances will be excluded from the multi-volume snapshot sets created by the policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-parameters.html#cfn-dlm-lifecyclepolicy-parameters-excludebootvolume
     */
    readonly excludeBootVolume?: boolean | cdk.IResolvable;

    /**
     * *[Custom snapshot policies that target instances only]* The tags used to identify data (non-root) volumes to exclude from multi-volume snapshot sets.
     *
     * If you create a snapshot lifecycle policy that targets instances and you specify tags for this parameter, then data volumes with the specified tags that are attached to targeted instances will be excluded from the multi-volume snapshot sets created by the policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-parameters.html#cfn-dlm-lifecyclepolicy-parameters-excludedatavolumetags
     */
    readonly excludeDataVolumeTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

    /**
     * *[Custom AMI policies only]* Indicates whether targeted instances are rebooted when the lifecycle policy runs.
     *
     * `true` indicates that targeted instances are not rebooted when the policy runs. `false` indicates that target instances are rebooted when the policy runs. The default is `true` (instances are not rebooted).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-parameters.html#cfn-dlm-lifecyclepolicy-parameters-noreboot
     */
    readonly noReboot?: boolean | cdk.IResolvable;
  }

  /**
   * *[Event-based policies only]* Specifies an action for an event-based policy.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-action.html
   */
  export interface ActionProperty {
    /**
     * The rule for copying shared snapshots across Regions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-action.html#cfn-dlm-lifecyclepolicy-action-crossregioncopy
     */
    readonly crossRegionCopy: Array<CfnLifecyclePolicy.CrossRegionCopyActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A descriptive name for the action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-action.html#cfn-dlm-lifecyclepolicy-action-name
     */
    readonly name: string;
  }

  /**
   * *[Event-based policies only]* Specifies a cross-Region copy action for event-based policies.
   *
   * > To specify a cross-Region copy rule for snapshot and AMI policies, use [CrossRegionCopyRule](https://docs.aws.amazon.com/dlm/latest/APIReference/API_CrossRegionCopyRule.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyaction.html
   */
  export interface CrossRegionCopyActionProperty {
    /**
     * The encryption settings for the copied snapshot.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyaction.html#cfn-dlm-lifecyclepolicy-crossregioncopyaction-encryptionconfiguration
     */
    readonly encryptionConfiguration: CfnLifecyclePolicy.EncryptionConfigurationProperty | cdk.IResolvable;

    /**
     * Specifies a retention rule for cross-Region snapshot copies created by snapshot or event-based policies, or cross-Region AMI copies created by AMI policies.
     *
     * After the retention period expires, the cross-Region copy is deleted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyaction.html#cfn-dlm-lifecyclepolicy-crossregioncopyaction-retainrule
     */
    readonly retainRule?: CfnLifecyclePolicy.CrossRegionCopyRetainRuleProperty | cdk.IResolvable;

    /**
     * The target Region.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyaction.html#cfn-dlm-lifecyclepolicy-crossregioncopyaction-target
     */
    readonly target: string;
  }

  /**
   * *[Event-based policies only]* Specifies the encryption settings for cross-Region snapshot copies created by event-based policies.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-encryptionconfiguration.html
   */
  export interface EncryptionConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the AWS KMS key to use for EBS encryption.
     *
     * If this parameter is not specified, the default KMS key for the account is used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-encryptionconfiguration.html#cfn-dlm-lifecyclepolicy-encryptionconfiguration-cmkarn
     */
    readonly cmkArn?: string;

    /**
     * To encrypt a copy of an unencrypted snapshot when encryption by default is not enabled, enable encryption using this parameter.
     *
     * Copies of encrypted snapshots are encrypted, even if this parameter is false or when encryption by default is not enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-encryptionconfiguration.html#cfn-dlm-lifecyclepolicy-encryptionconfiguration-encrypted
     */
    readonly encrypted: boolean | cdk.IResolvable;
  }

  /**
   * *[Default policies only]* Specifies exclusion parameters for volumes or instances for which you do not want to create snapshots or AMIs.
   *
   * The policy will not create snapshots or AMIs for target resources that match any of the specified exclusion parameters.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-exclusions.html
   */
  export interface ExclusionsProperty {
    /**
     * *[Default policies for EBS snapshots only]* Indicates whether to exclude volumes that are attached to instances as the boot volume.
     *
     * If you exclude boot volumes, only volumes attached as data (non-boot) volumes will be backed up by the policy. To exclude boot volumes, specify `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-exclusions.html#cfn-dlm-lifecyclepolicy-exclusions-excludebootvolumes
     */
    readonly excludeBootVolumes?: boolean | cdk.IResolvable;

    /**
     * *[Default policies for EBS-backed AMIs only]* Specifies whether to exclude volumes that have specific tags.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-exclusions.html#cfn-dlm-lifecyclepolicy-exclusions-excludetags
     */
    readonly excludeTags?: any | cdk.IResolvable;

    /**
     * *[Default policies for EBS snapshots only]* Specifies the volume types to exclude.
     *
     * Volumes of the specified types will not be targeted by the policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-exclusions.html#cfn-dlm-lifecyclepolicy-exclusions-excludevolumetypes
     */
    readonly excludeVolumeTypes?: any | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnLifecyclePolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html
 */
export interface CfnLifecyclePolicyProps {
  /**
   * *[Default policies only]* Indicates whether the policy should copy tags from the source resource to the snapshot or AMI.
   *
   * If you do not specify a value, the default is `false` .
   *
   * Default: false
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-copytags
   */
  readonly copyTags?: boolean | cdk.IResolvable;

  /**
   * *[Default policies only]* Specifies how often the policy should run and create snapshots or AMIs.
   *
   * The creation frequency can range from 1 to 7 days. If you do not specify a value, the default is 1.
   *
   * Default: 1
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-createinterval
   */
  readonly createInterval?: number;

  /**
   * *[Default policies only]* Specifies destination Regions for snapshot or AMI copies.
   *
   * You can specify up to 3 destination Regions. If you do not want to create cross-Region copies, omit this parameter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-crossregioncopytargets
   */
  readonly crossRegionCopyTargets?: any | cdk.IResolvable;

  /**
   * *[Default policies only]* Specify the type of default policy to create.
   *
   * - To create a default policy for EBS snapshots, that creates snapshots of all volumes in the Region that do not have recent backups, specify `VOLUME` .
   * - To create a default policy for EBS-backed AMIs, that creates EBS-backed AMIs from all instances in the Region that do not have recent backups, specify `INSTANCE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-defaultpolicy
   */
  readonly defaultPolicy?: string;

  /**
   * A description of the lifecycle policy.
   *
   * The characters ^[0-9A-Za-z _-]+$ are supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-description
   */
  readonly description?: string;

  /**
   * *[Default policies only]* Specifies exclusion parameters for volumes or instances for which you do not want to create snapshots or AMIs.
   *
   * The policy will not create snapshots or AMIs for target resources that match any of the specified exclusion parameters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-exclusions
   */
  readonly exclusions?: CfnLifecyclePolicy.ExclusionsProperty | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the IAM role used to run the operations specified by the lifecycle policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-executionrolearn
   */
  readonly executionRoleArn?: string;

  /**
   * *[Default policies only]* Defines the snapshot or AMI retention behavior for the policy if the source volume or instance is deleted, or if the policy enters the error, disabled, or deleted state.
   *
   * By default ( *ExtendDeletion=false* ):
   *
   * - If a source resource is deleted, Amazon Data Lifecycle Manager will continue to delete previously created snapshots or AMIs, up to but not including the last one, based on the specified retention period. If you want Amazon Data Lifecycle Manager to delete all snapshots or AMIs, including the last one, specify `true` .
   * - If a policy enters the error, disabled, or deleted state, Amazon Data Lifecycle Manager stops deleting snapshots and AMIs. If you want Amazon Data Lifecycle Manager to continue deleting snapshots or AMIs, including the last one, if the policy enters one of these states, specify `true` .
   *
   * If you enable extended deletion ( *ExtendDeletion=true* ), you override both default behaviors simultaneously.
   *
   * If you do not specify a value, the default is `false` .
   *
   * Default: false
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-extenddeletion
   */
  readonly extendDeletion?: boolean | cdk.IResolvable;

  /**
   * The configuration details of the lifecycle policy.
   *
   * > If you create a default policy, you can specify the request parameters either in the request body, or in the PolicyDetails request structure, but not both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-policydetails
   */
  readonly policyDetails?: cdk.IResolvable | CfnLifecyclePolicy.PolicyDetailsProperty;

  /**
   * *[Default policies only]* Specifies how long the policy should retain snapshots or AMIs before deleting them.
   *
   * The retention period can range from 2 to 14 days, but it must be greater than the creation frequency to ensure that the policy retains at least 1 snapshot or AMI at any given time. If you do not specify a value, the default is 7.
   *
   * Default: 7
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-retaininterval
   */
  readonly retainInterval?: number;

  /**
   * The activation state of the lifecycle policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-state
   */
  readonly state?: string;

  /**
   * The tags to apply to the lifecycle policy during creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ShareRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ShareRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyShareRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetAccounts", cdk.listValidator(cdk.validateString))(properties.targetAccounts));
  errors.collect(cdk.propertyValidator("unshareInterval", cdk.validateNumber)(properties.unshareInterval));
  errors.collect(cdk.propertyValidator("unshareIntervalUnit", cdk.validateString)(properties.unshareIntervalUnit));
  return errors.wrap("supplied properties not correct for \"ShareRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyShareRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyShareRulePropertyValidator(properties).assertSuccess();
  return {
    "TargetAccounts": cdk.listMapper(cdk.stringToCloudFormation)(properties.targetAccounts),
    "UnshareInterval": cdk.numberToCloudFormation(properties.unshareInterval),
    "UnshareIntervalUnit": cdk.stringToCloudFormation(properties.unshareIntervalUnit)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyShareRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLifecyclePolicy.ShareRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ShareRuleProperty>();
  ret.addPropertyResult("targetAccounts", "TargetAccounts", (properties.TargetAccounts != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TargetAccounts) : undefined));
  ret.addPropertyResult("unshareInterval", "UnshareInterval", (properties.UnshareInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.UnshareInterval) : undefined));
  ret.addPropertyResult("unshareIntervalUnit", "UnshareIntervalUnit", (properties.UnshareIntervalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.UnshareIntervalUnit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeprecateRuleProperty`
 *
 * @param properties - the TypeScript properties of a `DeprecateRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyDeprecateRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("count", cdk.validateNumber)(properties.count));
  errors.collect(cdk.propertyValidator("interval", cdk.validateNumber)(properties.interval));
  errors.collect(cdk.propertyValidator("intervalUnit", cdk.validateString)(properties.intervalUnit));
  return errors.wrap("supplied properties not correct for \"DeprecateRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyDeprecateRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyDeprecateRulePropertyValidator(properties).assertSuccess();
  return {
    "Count": cdk.numberToCloudFormation(properties.count),
    "Interval": cdk.numberToCloudFormation(properties.interval),
    "IntervalUnit": cdk.stringToCloudFormation(properties.intervalUnit)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyDeprecateRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.DeprecateRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.DeprecateRuleProperty>();
  ret.addPropertyResult("count", "Count", (properties.Count != null ? cfn_parse.FromCloudFormation.getNumber(properties.Count) : undefined));
  ret.addPropertyResult("interval", "Interval", (properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined));
  ret.addPropertyResult("intervalUnit", "IntervalUnit", (properties.IntervalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.IntervalUnit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScriptProperty`
 *
 * @param properties - the TypeScript properties of a `ScriptProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyScriptPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("executeOperationOnScriptFailure", cdk.validateBoolean)(properties.executeOperationOnScriptFailure));
  errors.collect(cdk.propertyValidator("executionHandler", cdk.validateString)(properties.executionHandler));
  errors.collect(cdk.propertyValidator("executionHandlerService", cdk.validateString)(properties.executionHandlerService));
  errors.collect(cdk.propertyValidator("executionTimeout", cdk.validateNumber)(properties.executionTimeout));
  errors.collect(cdk.propertyValidator("maximumRetryCount", cdk.validateNumber)(properties.maximumRetryCount));
  errors.collect(cdk.propertyValidator("stages", cdk.listValidator(cdk.validateString))(properties.stages));
  return errors.wrap("supplied properties not correct for \"ScriptProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyScriptPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyScriptPropertyValidator(properties).assertSuccess();
  return {
    "ExecuteOperationOnScriptFailure": cdk.booleanToCloudFormation(properties.executeOperationOnScriptFailure),
    "ExecutionHandler": cdk.stringToCloudFormation(properties.executionHandler),
    "ExecutionHandlerService": cdk.stringToCloudFormation(properties.executionHandlerService),
    "ExecutionTimeout": cdk.numberToCloudFormation(properties.executionTimeout),
    "MaximumRetryCount": cdk.numberToCloudFormation(properties.maximumRetryCount),
    "Stages": cdk.listMapper(cdk.stringToCloudFormation)(properties.stages)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyScriptPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLifecyclePolicy.ScriptProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ScriptProperty>();
  ret.addPropertyResult("executeOperationOnScriptFailure", "ExecuteOperationOnScriptFailure", (properties.ExecuteOperationOnScriptFailure != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExecuteOperationOnScriptFailure) : undefined));
  ret.addPropertyResult("executionHandler", "ExecutionHandler", (properties.ExecutionHandler != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionHandler) : undefined));
  ret.addPropertyResult("executionHandlerService", "ExecutionHandlerService", (properties.ExecutionHandlerService != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionHandlerService) : undefined));
  ret.addPropertyResult("executionTimeout", "ExecutionTimeout", (properties.ExecutionTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.ExecutionTimeout) : undefined));
  ret.addPropertyResult("maximumRetryCount", "MaximumRetryCount", (properties.MaximumRetryCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRetryCount) : undefined));
  ret.addPropertyResult("stages", "Stages", (properties.Stages != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Stages) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CreateRuleProperty`
 *
 * @param properties - the TypeScript properties of a `CreateRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyCreateRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cronExpression", cdk.validateString)(properties.cronExpression));
  errors.collect(cdk.propertyValidator("interval", cdk.validateNumber)(properties.interval));
  errors.collect(cdk.propertyValidator("intervalUnit", cdk.validateString)(properties.intervalUnit));
  errors.collect(cdk.propertyValidator("location", cdk.validateString)(properties.location));
  errors.collect(cdk.propertyValidator("scripts", cdk.listValidator(CfnLifecyclePolicyScriptPropertyValidator))(properties.scripts));
  errors.collect(cdk.propertyValidator("times", cdk.listValidator(cdk.validateString))(properties.times));
  return errors.wrap("supplied properties not correct for \"CreateRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyCreateRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyCreateRulePropertyValidator(properties).assertSuccess();
  return {
    "CronExpression": cdk.stringToCloudFormation(properties.cronExpression),
    "Interval": cdk.numberToCloudFormation(properties.interval),
    "IntervalUnit": cdk.stringToCloudFormation(properties.intervalUnit),
    "Location": cdk.stringToCloudFormation(properties.location),
    "Scripts": cdk.listMapper(convertCfnLifecyclePolicyScriptPropertyToCloudFormation)(properties.scripts),
    "Times": cdk.listMapper(cdk.stringToCloudFormation)(properties.times)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyCreateRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.CreateRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.CreateRuleProperty>();
  ret.addPropertyResult("cronExpression", "CronExpression", (properties.CronExpression != null ? cfn_parse.FromCloudFormation.getString(properties.CronExpression) : undefined));
  ret.addPropertyResult("interval", "Interval", (properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined));
  ret.addPropertyResult("intervalUnit", "IntervalUnit", (properties.IntervalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.IntervalUnit) : undefined));
  ret.addPropertyResult("location", "Location", (properties.Location != null ? cfn_parse.FromCloudFormation.getString(properties.Location) : undefined));
  ret.addPropertyResult("scripts", "Scripts", (properties.Scripts != null ? cfn_parse.FromCloudFormation.getArray(CfnLifecyclePolicyScriptPropertyFromCloudFormation)(properties.Scripts) : undefined));
  ret.addPropertyResult("times", "Times", (properties.Times != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Times) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FastRestoreRuleProperty`
 *
 * @param properties - the TypeScript properties of a `FastRestoreRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyFastRestoreRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityZones", cdk.listValidator(cdk.validateString))(properties.availabilityZones));
  errors.collect(cdk.propertyValidator("count", cdk.validateNumber)(properties.count));
  errors.collect(cdk.propertyValidator("interval", cdk.validateNumber)(properties.interval));
  errors.collect(cdk.propertyValidator("intervalUnit", cdk.validateString)(properties.intervalUnit));
  return errors.wrap("supplied properties not correct for \"FastRestoreRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyFastRestoreRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyFastRestoreRulePropertyValidator(properties).assertSuccess();
  return {
    "AvailabilityZones": cdk.listMapper(cdk.stringToCloudFormation)(properties.availabilityZones),
    "Count": cdk.numberToCloudFormation(properties.count),
    "Interval": cdk.numberToCloudFormation(properties.interval),
    "IntervalUnit": cdk.stringToCloudFormation(properties.intervalUnit)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyFastRestoreRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.FastRestoreRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.FastRestoreRuleProperty>();
  ret.addPropertyResult("availabilityZones", "AvailabilityZones", (properties.AvailabilityZones != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AvailabilityZones) : undefined));
  ret.addPropertyResult("count", "Count", (properties.Count != null ? cfn_parse.FromCloudFormation.getNumber(properties.Count) : undefined));
  ret.addPropertyResult("interval", "Interval", (properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined));
  ret.addPropertyResult("intervalUnit", "IntervalUnit", (properties.IntervalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.IntervalUnit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RetentionArchiveTierProperty`
 *
 * @param properties - the TypeScript properties of a `RetentionArchiveTierProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyRetentionArchiveTierPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("count", cdk.validateNumber)(properties.count));
  errors.collect(cdk.propertyValidator("interval", cdk.validateNumber)(properties.interval));
  errors.collect(cdk.propertyValidator("intervalUnit", cdk.validateString)(properties.intervalUnit));
  return errors.wrap("supplied properties not correct for \"RetentionArchiveTierProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyRetentionArchiveTierPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyRetentionArchiveTierPropertyValidator(properties).assertSuccess();
  return {
    "Count": cdk.numberToCloudFormation(properties.count),
    "Interval": cdk.numberToCloudFormation(properties.interval),
    "IntervalUnit": cdk.stringToCloudFormation(properties.intervalUnit)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyRetentionArchiveTierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLifecyclePolicy.RetentionArchiveTierProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.RetentionArchiveTierProperty>();
  ret.addPropertyResult("count", "Count", (properties.Count != null ? cfn_parse.FromCloudFormation.getNumber(properties.Count) : undefined));
  ret.addPropertyResult("interval", "Interval", (properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined));
  ret.addPropertyResult("intervalUnit", "IntervalUnit", (properties.IntervalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.IntervalUnit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ArchiveRetainRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ArchiveRetainRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyArchiveRetainRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("retentionArchiveTier", cdk.requiredValidator)(properties.retentionArchiveTier));
  errors.collect(cdk.propertyValidator("retentionArchiveTier", CfnLifecyclePolicyRetentionArchiveTierPropertyValidator)(properties.retentionArchiveTier));
  return errors.wrap("supplied properties not correct for \"ArchiveRetainRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyArchiveRetainRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyArchiveRetainRulePropertyValidator(properties).assertSuccess();
  return {
    "RetentionArchiveTier": convertCfnLifecyclePolicyRetentionArchiveTierPropertyToCloudFormation(properties.retentionArchiveTier)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyArchiveRetainRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.ArchiveRetainRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ArchiveRetainRuleProperty>();
  ret.addPropertyResult("retentionArchiveTier", "RetentionArchiveTier", (properties.RetentionArchiveTier != null ? CfnLifecyclePolicyRetentionArchiveTierPropertyFromCloudFormation(properties.RetentionArchiveTier) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ArchiveRuleProperty`
 *
 * @param properties - the TypeScript properties of a `ArchiveRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyArchiveRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("retainRule", cdk.requiredValidator)(properties.retainRule));
  errors.collect(cdk.propertyValidator("retainRule", CfnLifecyclePolicyArchiveRetainRulePropertyValidator)(properties.retainRule));
  return errors.wrap("supplied properties not correct for \"ArchiveRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyArchiveRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyArchiveRulePropertyValidator(properties).assertSuccess();
  return {
    "RetainRule": convertCfnLifecyclePolicyArchiveRetainRulePropertyToCloudFormation(properties.retainRule)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyArchiveRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.ArchiveRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ArchiveRuleProperty>();
  ret.addPropertyResult("retainRule", "RetainRule", (properties.RetainRule != null ? CfnLifecyclePolicyArchiveRetainRulePropertyFromCloudFormation(properties.RetainRule) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RetainRuleProperty`
 *
 * @param properties - the TypeScript properties of a `RetainRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyRetainRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("count", cdk.validateNumber)(properties.count));
  errors.collect(cdk.propertyValidator("interval", cdk.validateNumber)(properties.interval));
  errors.collect(cdk.propertyValidator("intervalUnit", cdk.validateString)(properties.intervalUnit));
  return errors.wrap("supplied properties not correct for \"RetainRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyRetainRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyRetainRulePropertyValidator(properties).assertSuccess();
  return {
    "Count": cdk.numberToCloudFormation(properties.count),
    "Interval": cdk.numberToCloudFormation(properties.interval),
    "IntervalUnit": cdk.stringToCloudFormation(properties.intervalUnit)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyRetainRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLifecyclePolicy.RetainRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.RetainRuleProperty>();
  ret.addPropertyResult("count", "Count", (properties.Count != null ? cfn_parse.FromCloudFormation.getNumber(properties.Count) : undefined));
  ret.addPropertyResult("interval", "Interval", (properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined));
  ret.addPropertyResult("intervalUnit", "IntervalUnit", (properties.IntervalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.IntervalUnit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CrossRegionCopyDeprecateRuleProperty`
 *
 * @param properties - the TypeScript properties of a `CrossRegionCopyDeprecateRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyCrossRegionCopyDeprecateRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("interval", cdk.requiredValidator)(properties.interval));
  errors.collect(cdk.propertyValidator("interval", cdk.validateNumber)(properties.interval));
  errors.collect(cdk.propertyValidator("intervalUnit", cdk.requiredValidator)(properties.intervalUnit));
  errors.collect(cdk.propertyValidator("intervalUnit", cdk.validateString)(properties.intervalUnit));
  return errors.wrap("supplied properties not correct for \"CrossRegionCopyDeprecateRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyCrossRegionCopyDeprecateRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyCrossRegionCopyDeprecateRulePropertyValidator(properties).assertSuccess();
  return {
    "Interval": cdk.numberToCloudFormation(properties.interval),
    "IntervalUnit": cdk.stringToCloudFormation(properties.intervalUnit)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyCrossRegionCopyDeprecateRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.CrossRegionCopyDeprecateRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.CrossRegionCopyDeprecateRuleProperty>();
  ret.addPropertyResult("interval", "Interval", (properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined));
  ret.addPropertyResult("intervalUnit", "IntervalUnit", (properties.IntervalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.IntervalUnit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CrossRegionCopyRetainRuleProperty`
 *
 * @param properties - the TypeScript properties of a `CrossRegionCopyRetainRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyCrossRegionCopyRetainRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("interval", cdk.requiredValidator)(properties.interval));
  errors.collect(cdk.propertyValidator("interval", cdk.validateNumber)(properties.interval));
  errors.collect(cdk.propertyValidator("intervalUnit", cdk.requiredValidator)(properties.intervalUnit));
  errors.collect(cdk.propertyValidator("intervalUnit", cdk.validateString)(properties.intervalUnit));
  return errors.wrap("supplied properties not correct for \"CrossRegionCopyRetainRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyCrossRegionCopyRetainRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyCrossRegionCopyRetainRulePropertyValidator(properties).assertSuccess();
  return {
    "Interval": cdk.numberToCloudFormation(properties.interval),
    "IntervalUnit": cdk.stringToCloudFormation(properties.intervalUnit)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyCrossRegionCopyRetainRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.CrossRegionCopyRetainRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.CrossRegionCopyRetainRuleProperty>();
  ret.addPropertyResult("interval", "Interval", (properties.Interval != null ? cfn_parse.FromCloudFormation.getNumber(properties.Interval) : undefined));
  ret.addPropertyResult("intervalUnit", "IntervalUnit", (properties.IntervalUnit != null ? cfn_parse.FromCloudFormation.getString(properties.IntervalUnit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CrossRegionCopyRuleProperty`
 *
 * @param properties - the TypeScript properties of a `CrossRegionCopyRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyCrossRegionCopyRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cmkArn", cdk.validateString)(properties.cmkArn));
  errors.collect(cdk.propertyValidator("copyTags", cdk.validateBoolean)(properties.copyTags));
  errors.collect(cdk.propertyValidator("deprecateRule", CfnLifecyclePolicyCrossRegionCopyDeprecateRulePropertyValidator)(properties.deprecateRule));
  errors.collect(cdk.propertyValidator("encrypted", cdk.requiredValidator)(properties.encrypted));
  errors.collect(cdk.propertyValidator("encrypted", cdk.validateBoolean)(properties.encrypted));
  errors.collect(cdk.propertyValidator("retainRule", CfnLifecyclePolicyCrossRegionCopyRetainRulePropertyValidator)(properties.retainRule));
  errors.collect(cdk.propertyValidator("target", cdk.validateString)(properties.target));
  errors.collect(cdk.propertyValidator("targetRegion", cdk.validateString)(properties.targetRegion));
  return errors.wrap("supplied properties not correct for \"CrossRegionCopyRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyCrossRegionCopyRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyCrossRegionCopyRulePropertyValidator(properties).assertSuccess();
  return {
    "CmkArn": cdk.stringToCloudFormation(properties.cmkArn),
    "CopyTags": cdk.booleanToCloudFormation(properties.copyTags),
    "DeprecateRule": convertCfnLifecyclePolicyCrossRegionCopyDeprecateRulePropertyToCloudFormation(properties.deprecateRule),
    "Encrypted": cdk.booleanToCloudFormation(properties.encrypted),
    "RetainRule": convertCfnLifecyclePolicyCrossRegionCopyRetainRulePropertyToCloudFormation(properties.retainRule),
    "Target": cdk.stringToCloudFormation(properties.target),
    "TargetRegion": cdk.stringToCloudFormation(properties.targetRegion)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyCrossRegionCopyRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.CrossRegionCopyRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.CrossRegionCopyRuleProperty>();
  ret.addPropertyResult("cmkArn", "CmkArn", (properties.CmkArn != null ? cfn_parse.FromCloudFormation.getString(properties.CmkArn) : undefined));
  ret.addPropertyResult("copyTags", "CopyTags", (properties.CopyTags != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTags) : undefined));
  ret.addPropertyResult("deprecateRule", "DeprecateRule", (properties.DeprecateRule != null ? CfnLifecyclePolicyCrossRegionCopyDeprecateRulePropertyFromCloudFormation(properties.DeprecateRule) : undefined));
  ret.addPropertyResult("encrypted", "Encrypted", (properties.Encrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted) : undefined));
  ret.addPropertyResult("retainRule", "RetainRule", (properties.RetainRule != null ? CfnLifecyclePolicyCrossRegionCopyRetainRulePropertyFromCloudFormation(properties.RetainRule) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined));
  ret.addPropertyResult("targetRegion", "TargetRegion", (properties.TargetRegion != null ? cfn_parse.FromCloudFormation.getString(properties.TargetRegion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScheduleProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicySchedulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("archiveRule", CfnLifecyclePolicyArchiveRulePropertyValidator)(properties.archiveRule));
  errors.collect(cdk.propertyValidator("copyTags", cdk.validateBoolean)(properties.copyTags));
  errors.collect(cdk.propertyValidator("createRule", CfnLifecyclePolicyCreateRulePropertyValidator)(properties.createRule));
  errors.collect(cdk.propertyValidator("crossRegionCopyRules", cdk.listValidator(CfnLifecyclePolicyCrossRegionCopyRulePropertyValidator))(properties.crossRegionCopyRules));
  errors.collect(cdk.propertyValidator("deprecateRule", CfnLifecyclePolicyDeprecateRulePropertyValidator)(properties.deprecateRule));
  errors.collect(cdk.propertyValidator("fastRestoreRule", CfnLifecyclePolicyFastRestoreRulePropertyValidator)(properties.fastRestoreRule));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("retainRule", CfnLifecyclePolicyRetainRulePropertyValidator)(properties.retainRule));
  errors.collect(cdk.propertyValidator("shareRules", cdk.listValidator(CfnLifecyclePolicyShareRulePropertyValidator))(properties.shareRules));
  errors.collect(cdk.propertyValidator("tagsToAdd", cdk.listValidator(cdk.validateCfnTag))(properties.tagsToAdd));
  errors.collect(cdk.propertyValidator("variableTags", cdk.listValidator(cdk.validateCfnTag))(properties.variableTags));
  return errors.wrap("supplied properties not correct for \"ScheduleProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicySchedulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicySchedulePropertyValidator(properties).assertSuccess();
  return {
    "ArchiveRule": convertCfnLifecyclePolicyArchiveRulePropertyToCloudFormation(properties.archiveRule),
    "CopyTags": cdk.booleanToCloudFormation(properties.copyTags),
    "CreateRule": convertCfnLifecyclePolicyCreateRulePropertyToCloudFormation(properties.createRule),
    "CrossRegionCopyRules": cdk.listMapper(convertCfnLifecyclePolicyCrossRegionCopyRulePropertyToCloudFormation)(properties.crossRegionCopyRules),
    "DeprecateRule": convertCfnLifecyclePolicyDeprecateRulePropertyToCloudFormation(properties.deprecateRule),
    "FastRestoreRule": convertCfnLifecyclePolicyFastRestoreRulePropertyToCloudFormation(properties.fastRestoreRule),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RetainRule": convertCfnLifecyclePolicyRetainRulePropertyToCloudFormation(properties.retainRule),
    "ShareRules": cdk.listMapper(convertCfnLifecyclePolicyShareRulePropertyToCloudFormation)(properties.shareRules),
    "TagsToAdd": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tagsToAdd),
    "VariableTags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.variableTags)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicySchedulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLifecyclePolicy.ScheduleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ScheduleProperty>();
  ret.addPropertyResult("archiveRule", "ArchiveRule", (properties.ArchiveRule != null ? CfnLifecyclePolicyArchiveRulePropertyFromCloudFormation(properties.ArchiveRule) : undefined));
  ret.addPropertyResult("copyTags", "CopyTags", (properties.CopyTags != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTags) : undefined));
  ret.addPropertyResult("createRule", "CreateRule", (properties.CreateRule != null ? CfnLifecyclePolicyCreateRulePropertyFromCloudFormation(properties.CreateRule) : undefined));
  ret.addPropertyResult("crossRegionCopyRules", "CrossRegionCopyRules", (properties.CrossRegionCopyRules != null ? cfn_parse.FromCloudFormation.getArray(CfnLifecyclePolicyCrossRegionCopyRulePropertyFromCloudFormation)(properties.CrossRegionCopyRules) : undefined));
  ret.addPropertyResult("deprecateRule", "DeprecateRule", (properties.DeprecateRule != null ? CfnLifecyclePolicyDeprecateRulePropertyFromCloudFormation(properties.DeprecateRule) : undefined));
  ret.addPropertyResult("fastRestoreRule", "FastRestoreRule", (properties.FastRestoreRule != null ? CfnLifecyclePolicyFastRestoreRulePropertyFromCloudFormation(properties.FastRestoreRule) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("retainRule", "RetainRule", (properties.RetainRule != null ? CfnLifecyclePolicyRetainRulePropertyFromCloudFormation(properties.RetainRule) : undefined));
  ret.addPropertyResult("shareRules", "ShareRules", (properties.ShareRules != null ? cfn_parse.FromCloudFormation.getArray(CfnLifecyclePolicyShareRulePropertyFromCloudFormation)(properties.ShareRules) : undefined));
  ret.addPropertyResult("tagsToAdd", "TagsToAdd", (properties.TagsToAdd != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.TagsToAdd) : undefined));
  ret.addPropertyResult("variableTags", "VariableTags", (properties.VariableTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.VariableTags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventParametersProperty`
 *
 * @param properties - the TypeScript properties of a `EventParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyEventParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("descriptionRegex", cdk.validateString)(properties.descriptionRegex));
  errors.collect(cdk.propertyValidator("eventType", cdk.requiredValidator)(properties.eventType));
  errors.collect(cdk.propertyValidator("eventType", cdk.validateString)(properties.eventType));
  errors.collect(cdk.propertyValidator("snapshotOwner", cdk.requiredValidator)(properties.snapshotOwner));
  errors.collect(cdk.propertyValidator("snapshotOwner", cdk.listValidator(cdk.validateString))(properties.snapshotOwner));
  return errors.wrap("supplied properties not correct for \"EventParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyEventParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyEventParametersPropertyValidator(properties).assertSuccess();
  return {
    "DescriptionRegex": cdk.stringToCloudFormation(properties.descriptionRegex),
    "EventType": cdk.stringToCloudFormation(properties.eventType),
    "SnapshotOwner": cdk.listMapper(cdk.stringToCloudFormation)(properties.snapshotOwner)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyEventParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.EventParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.EventParametersProperty>();
  ret.addPropertyResult("descriptionRegex", "DescriptionRegex", (properties.DescriptionRegex != null ? cfn_parse.FromCloudFormation.getString(properties.DescriptionRegex) : undefined));
  ret.addPropertyResult("eventType", "EventType", (properties.EventType != null ? cfn_parse.FromCloudFormation.getString(properties.EventType) : undefined));
  ret.addPropertyResult("snapshotOwner", "SnapshotOwner", (properties.SnapshotOwner != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SnapshotOwner) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventSourceProperty`
 *
 * @param properties - the TypeScript properties of a `EventSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyEventSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("parameters", CfnLifecyclePolicyEventParametersPropertyValidator)(properties.parameters));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"EventSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyEventSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyEventSourcePropertyValidator(properties).assertSuccess();
  return {
    "Parameters": convertCfnLifecyclePolicyEventParametersPropertyToCloudFormation(properties.parameters),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyEventSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.EventSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.EventSourceProperty>();
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? CfnLifecyclePolicyEventParametersPropertyFromCloudFormation(properties.Parameters) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ParametersProperty`
 *
 * @param properties - the TypeScript properties of a `ParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("excludeBootVolume", cdk.validateBoolean)(properties.excludeBootVolume));
  errors.collect(cdk.propertyValidator("excludeDataVolumeTags", cdk.listValidator(cdk.validateCfnTag))(properties.excludeDataVolumeTags));
  errors.collect(cdk.propertyValidator("noReboot", cdk.validateBoolean)(properties.noReboot));
  return errors.wrap("supplied properties not correct for \"ParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyParametersPropertyValidator(properties).assertSuccess();
  return {
    "ExcludeBootVolume": cdk.booleanToCloudFormation(properties.excludeBootVolume),
    "ExcludeDataVolumeTags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.excludeDataVolumeTags),
    "NoReboot": cdk.booleanToCloudFormation(properties.noReboot)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLifecyclePolicy.ParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ParametersProperty>();
  ret.addPropertyResult("excludeBootVolume", "ExcludeBootVolume", (properties.ExcludeBootVolume != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExcludeBootVolume) : undefined));
  ret.addPropertyResult("excludeDataVolumeTags", "ExcludeDataVolumeTags", (properties.ExcludeDataVolumeTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.ExcludeDataVolumeTags) : undefined));
  ret.addPropertyResult("noReboot", "NoReboot", (properties.NoReboot != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NoReboot) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cmkArn", cdk.validateString)(properties.cmkArn));
  errors.collect(cdk.propertyValidator("encrypted", cdk.requiredValidator)(properties.encrypted));
  errors.collect(cdk.propertyValidator("encrypted", cdk.validateBoolean)(properties.encrypted));
  return errors.wrap("supplied properties not correct for \"EncryptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyEncryptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CmkArn": cdk.stringToCloudFormation(properties.cmkArn),
    "Encrypted": cdk.booleanToCloudFormation(properties.encrypted)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.EncryptionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.EncryptionConfigurationProperty>();
  ret.addPropertyResult("cmkArn", "CmkArn", (properties.CmkArn != null ? cfn_parse.FromCloudFormation.getString(properties.CmkArn) : undefined));
  ret.addPropertyResult("encrypted", "Encrypted", (properties.Encrypted != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Encrypted) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CrossRegionCopyActionProperty`
 *
 * @param properties - the TypeScript properties of a `CrossRegionCopyActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyCrossRegionCopyActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryptionConfiguration", cdk.requiredValidator)(properties.encryptionConfiguration));
  errors.collect(cdk.propertyValidator("encryptionConfiguration", CfnLifecyclePolicyEncryptionConfigurationPropertyValidator)(properties.encryptionConfiguration));
  errors.collect(cdk.propertyValidator("retainRule", CfnLifecyclePolicyCrossRegionCopyRetainRulePropertyValidator)(properties.retainRule));
  errors.collect(cdk.propertyValidator("target", cdk.requiredValidator)(properties.target));
  errors.collect(cdk.propertyValidator("target", cdk.validateString)(properties.target));
  return errors.wrap("supplied properties not correct for \"CrossRegionCopyActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyCrossRegionCopyActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyCrossRegionCopyActionPropertyValidator(properties).assertSuccess();
  return {
    "EncryptionConfiguration": convertCfnLifecyclePolicyEncryptionConfigurationPropertyToCloudFormation(properties.encryptionConfiguration),
    "RetainRule": convertCfnLifecyclePolicyCrossRegionCopyRetainRulePropertyToCloudFormation(properties.retainRule),
    "Target": cdk.stringToCloudFormation(properties.target)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyCrossRegionCopyActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.CrossRegionCopyActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.CrossRegionCopyActionProperty>();
  ret.addPropertyResult("encryptionConfiguration", "EncryptionConfiguration", (properties.EncryptionConfiguration != null ? CfnLifecyclePolicyEncryptionConfigurationPropertyFromCloudFormation(properties.EncryptionConfiguration) : undefined));
  ret.addPropertyResult("retainRule", "RetainRule", (properties.RetainRule != null ? CfnLifecyclePolicyCrossRegionCopyRetainRulePropertyFromCloudFormation(properties.RetainRule) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("crossRegionCopy", cdk.requiredValidator)(properties.crossRegionCopy));
  errors.collect(cdk.propertyValidator("crossRegionCopy", cdk.listValidator(CfnLifecyclePolicyCrossRegionCopyActionPropertyValidator))(properties.crossRegionCopy));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyActionPropertyValidator(properties).assertSuccess();
  return {
    "CrossRegionCopy": cdk.listMapper(convertCfnLifecyclePolicyCrossRegionCopyActionPropertyToCloudFormation)(properties.crossRegionCopy),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ActionProperty>();
  ret.addPropertyResult("crossRegionCopy", "CrossRegionCopy", (properties.CrossRegionCopy != null ? cfn_parse.FromCloudFormation.getArray(CfnLifecyclePolicyCrossRegionCopyActionPropertyFromCloudFormation)(properties.CrossRegionCopy) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExclusionsProperty`
 *
 * @param properties - the TypeScript properties of a `ExclusionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyExclusionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("excludeBootVolumes", cdk.validateBoolean)(properties.excludeBootVolumes));
  errors.collect(cdk.propertyValidator("excludeTags", cdk.validateObject)(properties.excludeTags));
  errors.collect(cdk.propertyValidator("excludeVolumeTypes", cdk.validateObject)(properties.excludeVolumeTypes));
  return errors.wrap("supplied properties not correct for \"ExclusionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyExclusionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyExclusionsPropertyValidator(properties).assertSuccess();
  return {
    "ExcludeBootVolumes": cdk.booleanToCloudFormation(properties.excludeBootVolumes),
    "ExcludeTags": cdk.objectToCloudFormation(properties.excludeTags),
    "ExcludeVolumeTypes": cdk.objectToCloudFormation(properties.excludeVolumeTypes)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyExclusionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicy.ExclusionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.ExclusionsProperty>();
  ret.addPropertyResult("excludeBootVolumes", "ExcludeBootVolumes", (properties.ExcludeBootVolumes != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExcludeBootVolumes) : undefined));
  ret.addPropertyResult("excludeTags", "ExcludeTags", (properties.ExcludeTags != null ? cfn_parse.FromCloudFormation.getAny(properties.ExcludeTags) : undefined));
  ret.addPropertyResult("excludeVolumeTypes", "ExcludeVolumeTypes", (properties.ExcludeVolumeTypes != null ? cfn_parse.FromCloudFormation.getAny(properties.ExcludeVolumeTypes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PolicyDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `PolicyDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyPolicyDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.listValidator(CfnLifecyclePolicyActionPropertyValidator))(properties.actions));
  errors.collect(cdk.propertyValidator("copyTags", cdk.validateBoolean)(properties.copyTags));
  errors.collect(cdk.propertyValidator("createInterval", cdk.validateNumber)(properties.createInterval));
  errors.collect(cdk.propertyValidator("crossRegionCopyTargets", cdk.validateObject)(properties.crossRegionCopyTargets));
  errors.collect(cdk.propertyValidator("eventSource", CfnLifecyclePolicyEventSourcePropertyValidator)(properties.eventSource));
  errors.collect(cdk.propertyValidator("exclusions", CfnLifecyclePolicyExclusionsPropertyValidator)(properties.exclusions));
  errors.collect(cdk.propertyValidator("extendDeletion", cdk.validateBoolean)(properties.extendDeletion));
  errors.collect(cdk.propertyValidator("parameters", CfnLifecyclePolicyParametersPropertyValidator)(properties.parameters));
  errors.collect(cdk.propertyValidator("policyLanguage", cdk.validateString)(properties.policyLanguage));
  errors.collect(cdk.propertyValidator("policyType", cdk.validateString)(properties.policyType));
  errors.collect(cdk.propertyValidator("resourceLocations", cdk.listValidator(cdk.validateString))(properties.resourceLocations));
  errors.collect(cdk.propertyValidator("resourceType", cdk.validateString)(properties.resourceType));
  errors.collect(cdk.propertyValidator("resourceTypes", cdk.listValidator(cdk.validateString))(properties.resourceTypes));
  errors.collect(cdk.propertyValidator("retainInterval", cdk.validateNumber)(properties.retainInterval));
  errors.collect(cdk.propertyValidator("schedules", cdk.listValidator(CfnLifecyclePolicySchedulePropertyValidator))(properties.schedules));
  errors.collect(cdk.propertyValidator("targetTags", cdk.listValidator(cdk.validateCfnTag))(properties.targetTags));
  return errors.wrap("supplied properties not correct for \"PolicyDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyPolicyDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyPolicyDetailsPropertyValidator(properties).assertSuccess();
  return {
    "Actions": cdk.listMapper(convertCfnLifecyclePolicyActionPropertyToCloudFormation)(properties.actions),
    "CopyTags": cdk.booleanToCloudFormation(properties.copyTags),
    "CreateInterval": cdk.numberToCloudFormation(properties.createInterval),
    "CrossRegionCopyTargets": cdk.objectToCloudFormation(properties.crossRegionCopyTargets),
    "EventSource": convertCfnLifecyclePolicyEventSourcePropertyToCloudFormation(properties.eventSource),
    "Exclusions": convertCfnLifecyclePolicyExclusionsPropertyToCloudFormation(properties.exclusions),
    "ExtendDeletion": cdk.booleanToCloudFormation(properties.extendDeletion),
    "Parameters": convertCfnLifecyclePolicyParametersPropertyToCloudFormation(properties.parameters),
    "PolicyLanguage": cdk.stringToCloudFormation(properties.policyLanguage),
    "PolicyType": cdk.stringToCloudFormation(properties.policyType),
    "ResourceLocations": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceLocations),
    "ResourceType": cdk.stringToCloudFormation(properties.resourceType),
    "ResourceTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceTypes),
    "RetainInterval": cdk.numberToCloudFormation(properties.retainInterval),
    "Schedules": cdk.listMapper(convertCfnLifecyclePolicySchedulePropertyToCloudFormation)(properties.schedules),
    "TargetTags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.targetTags)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyPolicyDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLifecyclePolicy.PolicyDetailsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicy.PolicyDetailsProperty>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(CfnLifecyclePolicyActionPropertyFromCloudFormation)(properties.Actions) : undefined));
  ret.addPropertyResult("copyTags", "CopyTags", (properties.CopyTags != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTags) : undefined));
  ret.addPropertyResult("createInterval", "CreateInterval", (properties.CreateInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.CreateInterval) : undefined));
  ret.addPropertyResult("crossRegionCopyTargets", "CrossRegionCopyTargets", (properties.CrossRegionCopyTargets != null ? cfn_parse.FromCloudFormation.getAny(properties.CrossRegionCopyTargets) : undefined));
  ret.addPropertyResult("eventSource", "EventSource", (properties.EventSource != null ? CfnLifecyclePolicyEventSourcePropertyFromCloudFormation(properties.EventSource) : undefined));
  ret.addPropertyResult("exclusions", "Exclusions", (properties.Exclusions != null ? CfnLifecyclePolicyExclusionsPropertyFromCloudFormation(properties.Exclusions) : undefined));
  ret.addPropertyResult("extendDeletion", "ExtendDeletion", (properties.ExtendDeletion != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExtendDeletion) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? CfnLifecyclePolicyParametersPropertyFromCloudFormation(properties.Parameters) : undefined));
  ret.addPropertyResult("policyLanguage", "PolicyLanguage", (properties.PolicyLanguage != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyLanguage) : undefined));
  ret.addPropertyResult("policyType", "PolicyType", (properties.PolicyType != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyType) : undefined));
  ret.addPropertyResult("resourceLocations", "ResourceLocations", (properties.ResourceLocations != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourceLocations) : undefined));
  ret.addPropertyResult("resourceType", "ResourceType", (properties.ResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceType) : undefined));
  ret.addPropertyResult("resourceTypes", "ResourceTypes", (properties.ResourceTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourceTypes) : undefined));
  ret.addPropertyResult("retainInterval", "RetainInterval", (properties.RetainInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetainInterval) : undefined));
  ret.addPropertyResult("schedules", "Schedules", (properties.Schedules != null ? cfn_parse.FromCloudFormation.getArray(CfnLifecyclePolicySchedulePropertyFromCloudFormation)(properties.Schedules) : undefined));
  ret.addPropertyResult("targetTags", "TargetTags", (properties.TargetTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.TargetTags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLifecyclePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnLifecyclePolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLifecyclePolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("copyTags", cdk.validateBoolean)(properties.copyTags));
  errors.collect(cdk.propertyValidator("createInterval", cdk.validateNumber)(properties.createInterval));
  errors.collect(cdk.propertyValidator("crossRegionCopyTargets", cdk.validateObject)(properties.crossRegionCopyTargets));
  errors.collect(cdk.propertyValidator("defaultPolicy", cdk.validateString)(properties.defaultPolicy));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("exclusions", CfnLifecyclePolicyExclusionsPropertyValidator)(properties.exclusions));
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.validateString)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("extendDeletion", cdk.validateBoolean)(properties.extendDeletion));
  errors.collect(cdk.propertyValidator("policyDetails", CfnLifecyclePolicyPolicyDetailsPropertyValidator)(properties.policyDetails));
  errors.collect(cdk.propertyValidator("retainInterval", cdk.validateNumber)(properties.retainInterval));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLifecyclePolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnLifecyclePolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLifecyclePolicyPropsValidator(properties).assertSuccess();
  return {
    "CopyTags": cdk.booleanToCloudFormation(properties.copyTags),
    "CreateInterval": cdk.numberToCloudFormation(properties.createInterval),
    "CrossRegionCopyTargets": cdk.objectToCloudFormation(properties.crossRegionCopyTargets),
    "DefaultPolicy": cdk.stringToCloudFormation(properties.defaultPolicy),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Exclusions": convertCfnLifecyclePolicyExclusionsPropertyToCloudFormation(properties.exclusions),
    "ExecutionRoleArn": cdk.stringToCloudFormation(properties.executionRoleArn),
    "ExtendDeletion": cdk.booleanToCloudFormation(properties.extendDeletion),
    "PolicyDetails": convertCfnLifecyclePolicyPolicyDetailsPropertyToCloudFormation(properties.policyDetails),
    "RetainInterval": cdk.numberToCloudFormation(properties.retainInterval),
    "State": cdk.stringToCloudFormation(properties.state),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLifecyclePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLifecyclePolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLifecyclePolicyProps>();
  ret.addPropertyResult("copyTags", "CopyTags", (properties.CopyTags != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CopyTags) : undefined));
  ret.addPropertyResult("createInterval", "CreateInterval", (properties.CreateInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.CreateInterval) : undefined));
  ret.addPropertyResult("crossRegionCopyTargets", "CrossRegionCopyTargets", (properties.CrossRegionCopyTargets != null ? cfn_parse.FromCloudFormation.getAny(properties.CrossRegionCopyTargets) : undefined));
  ret.addPropertyResult("defaultPolicy", "DefaultPolicy", (properties.DefaultPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultPolicy) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("exclusions", "Exclusions", (properties.Exclusions != null ? CfnLifecyclePolicyExclusionsPropertyFromCloudFormation(properties.Exclusions) : undefined));
  ret.addPropertyResult("executionRoleArn", "ExecutionRoleArn", (properties.ExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn) : undefined));
  ret.addPropertyResult("extendDeletion", "ExtendDeletion", (properties.ExtendDeletion != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ExtendDeletion) : undefined));
  ret.addPropertyResult("policyDetails", "PolicyDetails", (properties.PolicyDetails != null ? CfnLifecyclePolicyPolicyDetailsPropertyFromCloudFormation(properties.PolicyDetails) : undefined));
  ret.addPropertyResult("retainInterval", "RetainInterval", (properties.RetainInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetainInterval) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}