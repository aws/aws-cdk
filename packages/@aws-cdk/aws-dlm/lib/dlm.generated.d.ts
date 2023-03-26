import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnLifecyclePolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html
 */
export interface CfnLifecyclePolicyProps {
    /**
     * A description of the lifecycle policy. The characters ^[0-9A-Za-z _-]+$ are supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-description
     */
    readonly description?: string;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used to run the operations specified by the lifecycle policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-executionrolearn
     */
    readonly executionRoleArn?: string;
    /**
     * The configuration details of the lifecycle policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-policydetails
     */
    readonly policyDetails?: CfnLifecyclePolicy.PolicyDetailsProperty | cdk.IResolvable;
    /**
     * The activation state of the lifecycle policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-state
     */
    readonly state?: string;
    /**
     * The tags to apply to the lifecycle policy during creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::DLM::LifecyclePolicy`
 *
 * Specifies a lifecycle policy, which is used to automate operations on Amazon EBS resources.
 *
 * The properties are required when you add a lifecycle policy and optional when you update a lifecycle policy.
 *
 * @cloudformationResource AWS::DLM::LifecyclePolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html
 */
export declare class CfnLifecyclePolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::DLM::LifecyclePolicy";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLifecyclePolicy;
    /**
     * The Amazon Resource Name (ARN) of the lifecycle policy.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * A description of the lifecycle policy. The characters ^[0-9A-Za-z _-]+$ are supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-description
     */
    description: string | undefined;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used to run the operations specified by the lifecycle policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-executionrolearn
     */
    executionRoleArn: string | undefined;
    /**
     * The configuration details of the lifecycle policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-policydetails
     */
    policyDetails: CfnLifecyclePolicy.PolicyDetailsProperty | cdk.IResolvable | undefined;
    /**
     * The activation state of the lifecycle policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-state
     */
    state: string | undefined;
    /**
     * The tags to apply to the lifecycle policy during creation.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dlm-lifecyclepolicy.html#cfn-dlm-lifecyclepolicy-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::DLM::LifecyclePolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnLifecyclePolicyProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Event-based policies only]* Specifies an action for an event-based policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-action.html
     */
    interface ActionProperty {
        /**
         * The rule for copying shared snapshots across Regions.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-action.html#cfn-dlm-lifecyclepolicy-action-crossregioncopy
         */
        readonly crossRegionCopy: Array<CfnLifecyclePolicy.CrossRegionCopyActionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * A descriptive name for the action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-action.html#cfn-dlm-lifecyclepolicy-action-name
         */
        readonly name: string;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot policies only]* Specifies information about the archive storage tier retention period.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-archiveretainrule.html
     */
    interface ArchiveRetainRuleProperty {
        /**
         * Information about retention period in the Amazon EBS Snapshots Archive. For more information, see [Archive Amazon EBS snapshots](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/snapshot-archive.html) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-archiveretainrule.html#cfn-dlm-lifecyclepolicy-archiveretainrule-retentionarchivetier
         */
        readonly retentionArchiveTier: CfnLifecyclePolicy.RetentionArchiveTierProperty | cdk.IResolvable;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot policies only]* Specifies a snapshot archiving rule for a schedule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-archiverule.html
     */
    interface ArchiveRuleProperty {
        /**
         * Information about the retention period for the snapshot archiving rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-archiverule.html#cfn-dlm-lifecyclepolicy-archiverule-retainrule
         */
        readonly retainRule: CfnLifecyclePolicy.ArchiveRetainRuleProperty | cdk.IResolvable;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot and AMI policies only]* Specifies when the policy should create snapshots or AMIs.
     *
     * > - You must specify either *CronExpression* , or *Interval* , *IntervalUnit* , and *Times* .
     * > - If you need to specify an `ArchiveRule` for the schedule, then you must specify a creation frequency of at least 28 days.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html
     */
    interface CreateRuleProperty {
        /**
         * The schedule, as a Cron expression. The schedule interval must be between 1 hour and 1 year. For more information, see [Cron expressions](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions) in the *Amazon CloudWatch User Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-cronexpression
         */
        readonly cronExpression?: string;
        /**
         * The interval between snapshots. The supported values are 1, 2, 3, 4, 6, 8, 12, and 24.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-interval
         */
        readonly interval?: number;
        /**
         * The interval unit.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-intervalunit
         */
        readonly intervalUnit?: string;
        /**
         * *[Snapshot policies only]* Specifies the destination for snapshots created by the policy. To create snapshots in the same Region as the source resource, specify `CLOUD` . To create snapshots on the same Outpost as the source resource, specify `OUTPOST_LOCAL` . If you omit this parameter, `CLOUD` is used by default.
         *
         * If the policy targets resources in an AWS Region , then you must create snapshots in the same Region as the source resource. If the policy targets resources on an Outpost, then you can create snapshots on the same Outpost as the source resource, or in the Region of that Outpost.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-location
         */
        readonly location?: string;
        /**
         * The time, in UTC, to start the operation. The supported format is hh:mm.
         *
         * The operation occurs within a one-hour window following the specified time. If you do not specify a time, Amazon Data Lifecycle Manager selects a time within the next 24 hours.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-createrule.html#cfn-dlm-lifecyclepolicy-createrule-times
         */
        readonly times?: string[];
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Event-based policies only]* Specifies a cross-Region copy action for event-based policies.
     *
     * > To specify a cross-Region copy rule for snapshot and AMI policies, use `CrossRegionCopyRule` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyaction.html
     */
    interface CrossRegionCopyActionProperty {
        /**
         * The encryption settings for the copied snapshot.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyaction.html#cfn-dlm-lifecyclepolicy-crossregioncopyaction-encryptionconfiguration
         */
        readonly encryptionConfiguration: CfnLifecyclePolicy.EncryptionConfigurationProperty | cdk.IResolvable;
        /**
         * Specifies a retention rule for cross-Region snapshot copies created by snapshot or event-based policies, or cross-Region AMI copies created by AMI policies. After the retention period expires, the cross-Region copy is deleted.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyaction.html#cfn-dlm-lifecyclepolicy-crossregioncopyaction-retainrule
         */
        readonly retainRule?: CfnLifecyclePolicy.CrossRegionCopyRetainRuleProperty | cdk.IResolvable;
        /**
         * The target Region.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyaction.html#cfn-dlm-lifecyclepolicy-crossregioncopyaction-target
         */
        readonly target: string;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[AMI policies only]* Specifies an AMI deprecation rule for cross-Region AMI copies created by an AMI policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopydeprecaterule.html
     */
    interface CrossRegionCopyDeprecateRuleProperty {
        /**
         * The period after which to deprecate the cross-Region AMI copies. The period must be less than or equal to the cross-Region AMI copy retention period, and it can't be greater than 10 years. This is equivalent to 120 months, 520 weeks, or 3650 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopydeprecaterule.html#cfn-dlm-lifecyclepolicy-crossregioncopydeprecaterule-interval
         */
        readonly interval: number;
        /**
         * The unit of time in which to measure the *Interval* . For example, to deprecate a cross-Region AMI copy after 3 months, specify `Interval=3` and `IntervalUnit=MONTHS` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopydeprecaterule.html#cfn-dlm-lifecyclepolicy-crossregioncopydeprecaterule-intervalunit
         */
        readonly intervalUnit: string;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * Specifies a retention rule for cross-Region snapshot copies created by snapshot or event-based policies, or cross-Region AMI copies created by AMI policies. After the retention period expires, the cross-Region copy is deleted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyretainrule.html
     */
    interface CrossRegionCopyRetainRuleProperty {
        /**
         * The amount of time to retain a cross-Region snapshot or AMI copy. The maximum is 100 years. This is equivalent to 1200 months, 5200 weeks, or 36500 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyretainrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyretainrule-interval
         */
        readonly interval: number;
        /**
         * The unit of time for time-based retention. For example, to retain a cross-Region copy for 3 months, specify `Interval=3` and `IntervalUnit=MONTHS` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyretainrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyretainrule-intervalunit
         */
        readonly intervalUnit: string;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot and AMI policies only]* Specifies a cross-Region copy rule for snapshot and AMI policies.
     *
     * > To specify a cross-Region copy action for event-based polices, use `CrossRegionCopyAction` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html
     */
    interface CrossRegionCopyRuleProperty {
        /**
         * The Amazon Resource Name (ARN) of the AWS KMS key to use for EBS encryption. If this parameter is not specified, the default KMS key for the account is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-cmkarn
         */
        readonly cmkArn?: string;
        /**
         * Indicates whether to copy all user-defined tags from the source snapshot or AMI to the cross-Region copy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-copytags
         */
        readonly copyTags?: boolean | cdk.IResolvable;
        /**
         * *[AMI policies only]* The AMI deprecation rule for cross-Region AMI copies created by the rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-deprecaterule
         */
        readonly deprecateRule?: CfnLifecyclePolicy.CrossRegionCopyDeprecateRuleProperty | cdk.IResolvable;
        /**
         * To encrypt a copy of an unencrypted snapshot if encryption by default is not enabled, enable encryption using this parameter. Copies of encrypted snapshots are encrypted, even if this parameter is false or if encryption by default is not enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-encrypted
         */
        readonly encrypted: boolean | cdk.IResolvable;
        /**
         * The retention rule that indicates how long the cross-Region snapshot or AMI copies are to be retained in the destination Region.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-retainrule
         */
        readonly retainRule?: CfnLifecyclePolicy.CrossRegionCopyRetainRuleProperty | cdk.IResolvable;
        /**
         * The target Region or the Amazon Resource Name (ARN) of the target Outpost for the snapshot copies.
         *
         * Use this parameter instead of *TargetRegion* . Do not specify both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-target
         */
        readonly target?: string;
        /**
         * > Avoid using this parameter when creating new policies. Instead, use *Target* to specify a target Region or a target Outpost for snapshot copies.
         * >
         * > For policies created before the *Target* parameter was introduced, this parameter indicates the target Region for snapshot copies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-crossregioncopyrule.html#cfn-dlm-lifecyclepolicy-crossregioncopyrule-targetregion
         */
        readonly targetRegion?: string;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[AMI policies only]* Specifies an AMI deprecation rule for AMIs created by an AMI lifecycle policy.
     *
     * For age-based schedules, you must specify *Interval* and *IntervalUnit* . For count-based schedules, you must specify *Count* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-deprecaterule.html
     */
    interface DeprecateRuleProperty {
        /**
         * If the schedule has a count-based retention rule, this parameter specifies the number of oldest AMIs to deprecate. The count must be less than or equal to the schedule's retention count, and it can't be greater than 1000.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-deprecaterule.html#cfn-dlm-lifecyclepolicy-deprecaterule-count
         */
        readonly count?: number;
        /**
         * If the schedule has an age-based retention rule, this parameter specifies the period after which to deprecate AMIs created by the schedule. The period must be less than or equal to the schedule's retention period, and it can't be greater than 10 years. This is equivalent to 120 months, 520 weeks, or 3650 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-deprecaterule.html#cfn-dlm-lifecyclepolicy-deprecaterule-interval
         */
        readonly interval?: number;
        /**
         * The unit of time in which to measure the *Interval* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-deprecaterule.html#cfn-dlm-lifecyclepolicy-deprecaterule-intervalunit
         */
        readonly intervalUnit?: string;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Event-based policies only]* Specifies the encryption settings for cross-Region snapshot copies created by event-based policies.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-encryptionconfiguration.html
     */
    interface EncryptionConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) of the AWS KMS key to use for EBS encryption. If this parameter is not specified, the default KMS key for the account is used.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-encryptionconfiguration.html#cfn-dlm-lifecyclepolicy-encryptionconfiguration-cmkarn
         */
        readonly cmkArn?: string;
        /**
         * To encrypt a copy of an unencrypted snapshot when encryption by default is not enabled, enable encryption using this parameter. Copies of encrypted snapshots are encrypted, even if this parameter is false or when encryption by default is not enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-encryptionconfiguration.html#cfn-dlm-lifecyclepolicy-encryptionconfiguration-encrypted
         */
        readonly encrypted: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Event-based policies only]* Specifies an event that activates an event-based policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventparameters.html
     */
    interface EventParametersProperty {
        /**
         * The snapshot description that can trigger the policy. The description pattern is specified using a regular expression. The policy runs only if a snapshot with a description that matches the specified pattern is shared with your account.
         *
         * For example, specifying `^.*Created for policy: policy-1234567890abcdef0.*$` configures the policy to run only if snapshots created by policy `policy-1234567890abcdef0` are shared with your account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventparameters.html#cfn-dlm-lifecyclepolicy-eventparameters-descriptionregex
         */
        readonly descriptionRegex?: string;
        /**
         * The type of event. Currently, only snapshot sharing events are supported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventparameters.html#cfn-dlm-lifecyclepolicy-eventparameters-eventtype
         */
        readonly eventType: string;
        /**
         * The IDs of the AWS accounts that can trigger policy by sharing snapshots with your account. The policy only runs if one of the specified AWS accounts shares a snapshot with your account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventparameters.html#cfn-dlm-lifecyclepolicy-eventparameters-snapshotowner
         */
        readonly snapshotOwner: string[];
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Event-based policies only]* Specifies an event that activates an event-based policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventsource.html
     */
    interface EventSourceProperty {
        /**
         * Information about the event.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventsource.html#cfn-dlm-lifecyclepolicy-eventsource-parameters
         */
        readonly parameters?: CfnLifecyclePolicy.EventParametersProperty | cdk.IResolvable;
        /**
         * The source of the event. Currently only managed CloudWatch Events rules are supported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-eventsource.html#cfn-dlm-lifecyclepolicy-eventsource-type
         */
        readonly type: string;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot policies only]* Specifies a rule for enabling fast snapshot restore for snapshots created by snapshot policies. You can enable fast snapshot restore based on either a count or a time interval.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html
     */
    interface FastRestoreRuleProperty {
        /**
         * The Availability Zones in which to enable fast snapshot restore.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html#cfn-dlm-lifecyclepolicy-fastrestorerule-availabilityzones
         */
        readonly availabilityZones?: string[];
        /**
         * The number of snapshots to be enabled with fast snapshot restore.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html#cfn-dlm-lifecyclepolicy-fastrestorerule-count
         */
        readonly count?: number;
        /**
         * The amount of time to enable fast snapshot restore. The maximum is 100 years. This is equivalent to 1200 months, 5200 weeks, or 36500 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html#cfn-dlm-lifecyclepolicy-fastrestorerule-interval
         */
        readonly interval?: number;
        /**
         * The unit of time for enabling fast snapshot restore.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-fastrestorerule.html#cfn-dlm-lifecyclepolicy-fastrestorerule-intervalunit
         */
        readonly intervalUnit?: string;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot and AMI policies only]* Specifies optional parameters for snapshot and AMI policies. The set of valid parameters depends on the combination of policy type and target resource type.
     *
     * If you choose to exclude boot volumes and you specify tags that consequently exclude all of the additional data volumes attached to an instance, then Amazon Data Lifecycle Manager will not create any snapshots for the affected instance, and it will emit a `SnapshotsCreateFailed` Amazon CloudWatch metric. For more information, see [Monitor your policies using Amazon CloudWatch](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitor-dlm-cw-metrics.html) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-parameters.html
     */
    interface ParametersProperty {
        /**
         * *[Snapshot policies that target instances only]* Indicates whether to exclude the root volume from multi-volume snapshot sets. The default is `false` . If you specify `true` , then the root volumes attached to targeted instances will be excluded from the multi-volume snapshot sets created by the policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-parameters.html#cfn-dlm-lifecyclepolicy-parameters-excludebootvolume
         */
        readonly excludeBootVolume?: boolean | cdk.IResolvable;
        /**
         * *[Snapshot policies that target instances only]* The tags used to identify data (non-root) volumes to exclude from multi-volume snapshot sets.
         *
         * If you create a snapshot lifecycle policy that targets instances and you specify tags for this parameter, then data volumes with the specified tags that are attached to targeted instances will be excluded from the multi-volume snapshot sets created by the policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-parameters.html#cfn-dlm-lifecyclepolicy-parameters-excludedatavolumetags
         */
        readonly excludeDataVolumeTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
        /**
         * *[AMI policies only]* Indicates whether targeted instances are rebooted when the lifecycle policy runs. `true` indicates that targeted instances are not rebooted when the policy runs. `false` indicates that target instances are rebooted when the policy runs. The default is `true` (instances are not rebooted).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-parameters.html#cfn-dlm-lifecyclepolicy-parameters-noreboot
         */
        readonly noReboot?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[All policy types]* Specifies the configuration of a lifecycle policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html
     */
    interface PolicyDetailsProperty {
        /**
         * *[Event-based policies only]* The actions to be performed when the event-based policy is activated. You can specify only one action per policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-actions
         */
        readonly actions?: Array<CfnLifecyclePolicy.ActionProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * *[Event-based policies only]* The event that activates the event-based policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-eventsource
         */
        readonly eventSource?: CfnLifecyclePolicy.EventSourceProperty | cdk.IResolvable;
        /**
         * *[Snapshot and AMI policies only]* A set of optional parameters for snapshot and AMI lifecycle policies.
         *
         * > If you are modifying a policy that was created or previously modified using the Amazon Data Lifecycle Manager console, then you must include this parameter and specify either the default values or the new values that you require. You can't omit this parameter or set its values to null.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-parameters
         */
        readonly parameters?: CfnLifecyclePolicy.ParametersProperty | cdk.IResolvable;
        /**
         * *[All policy types]* The valid target resource types and actions a policy can manage. Specify `EBS_SNAPSHOT_MANAGEMENT` to create a lifecycle policy that manages the lifecycle of Amazon EBS snapshots. Specify `IMAGE_MANAGEMENT` to create a lifecycle policy that manages the lifecycle of EBS-backed AMIs. Specify `EVENT_BASED_POLICY` to create an event-based policy that performs specific actions when a defined event occurs in your AWS account .
         *
         * The default is `EBS_SNAPSHOT_MANAGEMENT` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-policytype
         */
        readonly policyType?: string;
        /**
         * *[Snapshot and AMI policies only]* The location of the resources to backup. If the source resources are located in an AWS Region , specify `CLOUD` . If the source resources are located on an Outpost in your account, specify `OUTPOST` .
         *
         * If you specify `OUTPOST` , Amazon Data Lifecycle Manager backs up all resources of the specified type with matching target tags across all of the Outposts in your account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-resourcelocations
         */
        readonly resourceLocations?: string[];
        /**
         * *[Snapshot policies only]* The target resource type for snapshot and AMI lifecycle policies. Use `VOLUME` to create snapshots of individual volumes or use `INSTANCE` to create multi-volume snapshots from the volumes for an instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-resourcetypes
         */
        readonly resourceTypes?: string[];
        /**
         * *[Snapshot and AMI policies only]* The schedules of policy-defined actions for snapshot and AMI lifecycle policies. A policy can have up to four schedules—one mandatory schedule and up to three optional schedules.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-schedules
         */
        readonly schedules?: Array<CfnLifecyclePolicy.ScheduleProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * *[Snapshot and AMI policies only]* The single tag that identifies targeted resources for this policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-policydetails.html#cfn-dlm-lifecyclepolicy-policydetails-targettags
         */
        readonly targetTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot and AMI policies only]* Specifies a retention rule for snapshots created by snapshot policies, or for AMIs created by AMI policies.
     *
     * > For snapshot policies that have an `ArchiveRule` , this retention rule applies to standard tier retention. When the retention threshold is met, snapshots are moved from the standard to the archive tier.
     * >
     * > For snapshot policies that do not have an *ArchiveRule* , snapshots are permanently deleted when this retention threshold is met.
     *
     * You can retain snapshots based on either a count or a time interval.
     *
     * - *Count-based retention*
     *
     * You must specify *Count* . If you specify an `ArchiveRule` for the schedule, then you can specify a retention count of `0` to archive snapshots immediately after creation. If you specify a `FastRestoreRule` , `ShareRule` , or a `CrossRegionCopyRule` , then you must specify a retention count of `1` or more.
     * - *Age-based retention*
     *
     * You must specify *Interval* and *IntervalUnit* . If you specify an `ArchiveRule` for the schedule, then you can specify a retention interval of `0` days to archive snapshots immediately after creation. If you specify a `FastRestoreRule` , `ShareRule` , or a `CrossRegionCopyRule` , then you must specify a retention interval of `1` day or more.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retainrule.html
     */
    interface RetainRuleProperty {
        /**
         * The number of snapshots to retain for each volume, up to a maximum of 1000. For example if you want to retain a maximum of three snapshots, specify `3` . When the fourth snapshot is created, the oldest retained snapshot is deleted, or it is moved to the archive tier if you have specified an `ArchiveRule` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retainrule.html#cfn-dlm-lifecyclepolicy-retainrule-count
         */
        readonly count?: number;
        /**
         * The amount of time to retain each snapshot. The maximum is 100 years. This is equivalent to 1200 months, 5200 weeks, or 36500 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retainrule.html#cfn-dlm-lifecyclepolicy-retainrule-interval
         */
        readonly interval?: number;
        /**
         * The unit of time for time-based retention. For example, to retain snapshots for 3 months, specify `Interval=3` and `IntervalUnit=MONTHS` . Once the snapshot has been retained for 3 months, it is deleted, or it is moved to the archive tier if you have specified an `ArchiveRule` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retainrule.html#cfn-dlm-lifecyclepolicy-retainrule-intervalunit
         */
        readonly intervalUnit?: string;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot policies only]* Describes the retention rule for archived snapshots. Once the archive retention threshold is met, the snapshots are permanently deleted from the archive tier.
     *
     * > The archive retention rule must retain snapshots in the archive tier for a minimum of 90 days.
     *
     * For *count-based schedules* , you must specify *Count* . For *age-based schedules* , you must specify *Interval* and *IntervalUnit* .
     *
     * For more information about using snapshot archiving, see [Considerations for snapshot lifecycle policies](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-ami-policy.html#dlm-archive) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retentionarchivetier.html
     */
    interface RetentionArchiveTierProperty {
        /**
         * The maximum number of snapshots to retain in the archive storage tier for each volume. The count must ensure that each snapshot remains in the archive tier for at least 90 days. For example, if the schedule creates snapshots every 30 days, you must specify a count of 3 or more to ensure that each snapshot is archived for at least 90 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retentionarchivetier.html#cfn-dlm-lifecyclepolicy-retentionarchivetier-count
         */
        readonly count?: number;
        /**
         * Specifies the period of time to retain snapshots in the archive tier. After this period expires, the snapshot is permanently deleted.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retentionarchivetier.html#cfn-dlm-lifecyclepolicy-retentionarchivetier-interval
         */
        readonly interval?: number;
        /**
         * The unit of time in which to measure the *Interval* . For example, to retain a snapshots in the archive tier for 6 months, specify `Interval=6` and `IntervalUnit=MONTHS` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-retentionarchivetier.html#cfn-dlm-lifecyclepolicy-retentionarchivetier-intervalunit
         */
        readonly intervalUnit?: string;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot and AMI policies only]* Specifies a schedule for a snapshot or AMI lifecycle policy.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html
     */
    interface ScheduleProperty {
        /**
         * *[Snapshot policies that target volumes only]* The snapshot archiving rule for the schedule. When you specify an archiving rule, snapshots are automatically moved from the standard tier to the archive tier once the schedule's retention threshold is met. Snapshots are then retained in the archive tier for the archive retention period that you specify.
         *
         * For more information about using snapshot archiving, see [Considerations for snapshot lifecycle policies](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-ami-policy.html#dlm-archive) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-archiverule
         */
        readonly archiveRule?: CfnLifecyclePolicy.ArchiveRuleProperty | cdk.IResolvable;
        /**
         * Copy all user-defined tags on a source volume to snapshots of the volume created by this policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-copytags
         */
        readonly copyTags?: boolean | cdk.IResolvable;
        /**
         * The creation rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-createrule
         */
        readonly createRule?: CfnLifecyclePolicy.CreateRuleProperty | cdk.IResolvable;
        /**
         * Specifies a rule for copying snapshots or AMIs across regions.
         *
         * > You can't specify cross-Region copy rules for policies that create snapshots on an Outpost. If the policy creates snapshots in a Region, then snapshots can be copied to up to three Regions or Outposts.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-crossregioncopyrules
         */
        readonly crossRegionCopyRules?: Array<CfnLifecyclePolicy.CrossRegionCopyRuleProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * *[AMI policies only]* The AMI deprecation rule for the schedule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-deprecaterule
         */
        readonly deprecateRule?: CfnLifecyclePolicy.DeprecateRuleProperty | cdk.IResolvable;
        /**
         * *[Snapshot policies only]* The rule for enabling fast snapshot restore.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-fastrestorerule
         */
        readonly fastRestoreRule?: CfnLifecyclePolicy.FastRestoreRuleProperty | cdk.IResolvable;
        /**
         * The name of the schedule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-name
         */
        readonly name?: string;
        /**
         * The retention rule for snapshots or AMIs created by the policy.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-retainrule
         */
        readonly retainRule?: CfnLifecyclePolicy.RetainRuleProperty | cdk.IResolvable;
        /**
         * *[Snapshot policies only]* The rule for sharing snapshots with other AWS accounts .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-sharerules
         */
        readonly shareRules?: Array<CfnLifecyclePolicy.ShareRuleProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The tags to apply to policy-created resources. These user-defined tags are in addition to the AWS -added lifecycle tags.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-tagstoadd
         */
        readonly tagsToAdd?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
        /**
         * *[AMI policies and snapshot policies that target instances only]* A collection of key/value pairs with values determined dynamically when the policy is executed. Keys may be any valid Amazon EC2 tag key. Values must be in one of the two following formats: `$(instance-id)` or `$(timestamp)` . Variable tags are only valid for EBS Snapshot Management – Instance policies.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-schedule.html#cfn-dlm-lifecyclepolicy-schedule-variabletags
         */
        readonly variableTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnLifecyclePolicy {
    /**
     * *[Snapshot policies only]* Specifies a rule for sharing snapshots across AWS accounts .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-sharerule.html
     */
    interface ShareRuleProperty {
        /**
         * The IDs of the AWS accounts with which to share the snapshots.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-sharerule.html#cfn-dlm-lifecyclepolicy-sharerule-targetaccounts
         */
        readonly targetAccounts?: string[];
        /**
         * The period after which snapshots that are shared with other AWS accounts are automatically unshared.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-sharerule.html#cfn-dlm-lifecyclepolicy-sharerule-unshareinterval
         */
        readonly unshareInterval?: number;
        /**
         * The unit of time for the automatic unsharing interval.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dlm-lifecyclepolicy-sharerule.html#cfn-dlm-lifecyclepolicy-sharerule-unshareintervalunit
         */
        readonly unshareIntervalUnit?: string;
    }
}
