import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnExperimentTemplate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html
 */
export interface CfnExperimentTemplateProps {
    /**
     * A description for the experiment template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-description
     */
    readonly description: string;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that grants the AWS FIS service permission to perform service actions on your behalf.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-rolearn
     */
    readonly roleArn: string;
    /**
     * The stop conditions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-stopconditions
     */
    readonly stopConditions: Array<CfnExperimentTemplate.ExperimentTemplateStopConditionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The tags to apply to the experiment template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-tags
     */
    readonly tags: {
        [key: string]: (string);
    };
    /**
     * The targets for the experiment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-targets
     */
    readonly targets: {
        [key: string]: (CfnExperimentTemplate.ExperimentTemplateTargetProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * The actions for the experiment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-actions
     */
    readonly actions?: {
        [key: string]: (CfnExperimentTemplate.ExperimentTemplateActionProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * The configuration for experiment logging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-logconfiguration
     */
    readonly logConfiguration?: CfnExperimentTemplate.ExperimentTemplateLogConfigurationProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::FIS::ExperimentTemplate`
 *
 * Specifies an experiment template.
 *
 * An experiment template includes the following components:
 *
 * - *Targets* : A target can be a specific resource in your AWS environment, or one or more resources that match criteria that you specify, for example, resources that have specific tags.
 * - *Actions* : The actions to carry out on the target. You can specify multiple actions, the duration of each action, and when to start each action during an experiment.
 * - *Stop conditions* : If a stop condition is triggered while an experiment is running, the experiment is automatically stopped. You can define a stop condition as a CloudWatch alarm.
 *
 * For more information, see [Experiment templates](https://docs.aws.amazon.com/fis/latest/userguide/experiment-templates.html) in the *AWS Fault Injection Simulator User Guide* .
 *
 * @cloudformationResource AWS::FIS::ExperimentTemplate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html
 */
export declare class CfnExperimentTemplate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FIS::ExperimentTemplate";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnExperimentTemplate;
    /**
     * The ID of the experiment template.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * A description for the experiment template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-description
     */
    description: string;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that grants the AWS FIS service permission to perform service actions on your behalf.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-rolearn
     */
    roleArn: string;
    /**
     * The stop conditions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-stopconditions
     */
    stopConditions: Array<CfnExperimentTemplate.ExperimentTemplateStopConditionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The tags to apply to the experiment template.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The targets for the experiment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-targets
     */
    targets: {
        [key: string]: (CfnExperimentTemplate.ExperimentTemplateTargetProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * The actions for the experiment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-actions
     */
    actions: {
        [key: string]: (CfnExperimentTemplate.ExperimentTemplateActionProperty | cdk.IResolvable);
    } | cdk.IResolvable | undefined;
    /**
     * The configuration for experiment logging.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fis-experimenttemplate.html#cfn-fis-experimenttemplate-logconfiguration
     */
    logConfiguration: CfnExperimentTemplate.ExperimentTemplateLogConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::FIS::ExperimentTemplate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnExperimentTemplateProps);
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
export declare namespace CfnExperimentTemplate {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-cloudwatchlogsconfiguration.html
     */
    interface CloudWatchLogsConfigurationProperty {
        /**
         * `CfnExperimentTemplate.CloudWatchLogsConfigurationProperty.LogGroupArn`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-cloudwatchlogsconfiguration.html#cfn-fis-experimenttemplate-cloudwatchlogsconfiguration-loggrouparn
         */
        readonly logGroupArn: string;
    }
}
export declare namespace CfnExperimentTemplate {
    /**
     * Specifies an action for an experiment template.
     *
     * For more information, see [Actions](https://docs.aws.amazon.com/fis/latest/userguide/actions.html) in the *AWS Fault Injection Simulator User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html
     */
    interface ExperimentTemplateActionProperty {
        /**
         * The ID of the action. The format of the action ID is: aws: *service-name* : *action-type* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-actionid
         */
        readonly actionId: string;
        /**
         * A description for the action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-description
         */
        readonly description?: string;
        /**
         * The parameters for the action, if applicable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-parameters
         */
        readonly parameters?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The name of the action that must be completed before the current action starts. Omit this parameter to run the action at the start of the experiment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-startafter
         */
        readonly startAfter?: string[];
        /**
         * The targets for the action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplateaction.html#cfn-fis-experimenttemplate-experimenttemplateaction-targets
         */
        readonly targets?: {
            [key: string]: (string);
        } | cdk.IResolvable;
    }
}
export declare namespace CfnExperimentTemplate {
    /**
     * Specifies the configuration for experiment logging.
     *
     * For more information, see [Experiment logging](https://docs.aws.amazon.com/fis/latest/userguide/monitoring-logging.html) in the *AWS Fault Injection Simulator User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatelogconfiguration.html
     */
    interface ExperimentTemplateLogConfigurationProperty {
        /**
         * The configuration for experiment logging to Amazon CloudWatch Logs. The supported field is `LogGroupArn` . For example:
         *
         * `{"LogGroupArn": "aws:arn:logs: *region_name* : *account_id* :log-group: *log_group_name* "}`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatelogconfiguration.html#cfn-fis-experimenttemplate-experimenttemplatelogconfiguration-cloudwatchlogsconfiguration
         */
        readonly cloudWatchLogsConfiguration?: any | cdk.IResolvable;
        /**
         * The schema version. The supported value is 1.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatelogconfiguration.html#cfn-fis-experimenttemplate-experimenttemplatelogconfiguration-logschemaversion
         */
        readonly logSchemaVersion: number;
        /**
         * The configuration for experiment logging to Amazon S3. The following fields are supported:
         *
         * - `bucketName` - The name of the destination bucket.
         * - `prefix` - An optional bucket prefix.
         *
         * For example:
         *
         * `{"BucketName": " *my-s3-bucket* ", "Prefix": " *log-folder* "}`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatelogconfiguration.html#cfn-fis-experimenttemplate-experimenttemplatelogconfiguration-s3configuration
         */
        readonly s3Configuration?: any | cdk.IResolvable;
    }
}
export declare namespace CfnExperimentTemplate {
    /**
     * Specifies a stop condition for an experiment template.
     *
     * For more information, see [Stop conditions](https://docs.aws.amazon.com/fis/latest/userguide/stop-conditions.html) in the *AWS Fault Injection Simulator User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatestopcondition.html
     */
    interface ExperimentTemplateStopConditionProperty {
        /**
         * The source for the stop condition. Specify `aws:cloudwatch:alarm` if the stop condition is defined by a CloudWatch alarm. Specify `none` if there is no stop condition.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatestopcondition.html#cfn-fis-experimenttemplate-experimenttemplatestopcondition-source
         */
        readonly source: string;
        /**
         * The Amazon Resource Name (ARN) of the CloudWatch alarm. This is required if the source is a CloudWatch alarm.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatestopcondition.html#cfn-fis-experimenttemplate-experimenttemplatestopcondition-value
         */
        readonly value?: string;
    }
}
export declare namespace CfnExperimentTemplate {
    /**
     * Specifies a target for an experiment. You must specify at least one Amazon Resource Name (ARN) or at least one resource tag. You cannot specify both ARNs and tags.
     *
     * For more information, see [Targets](https://docs.aws.amazon.com/fis/latest/userguide/targets.html) in the *AWS Fault Injection Simulator User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html
     */
    interface ExperimentTemplateTargetProperty {
        /**
         * The filters to apply to identify target resources using specific attributes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-filters
         */
        readonly filters?: Array<CfnExperimentTemplate.ExperimentTemplateTargetFilterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The parameters for the resource type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-parameters
         */
        readonly parameters?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The Amazon Resource Names (ARNs) of the resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-resourcearns
         */
        readonly resourceArns?: string[];
        /**
         * The tags for the target resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-resourcetags
         */
        readonly resourceTags?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The resource type. The resource type must be supported for the specified action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-resourcetype
         */
        readonly resourceType: string;
        /**
         * Scopes the identified resources to a specific count of the resources at random, or a percentage of the resources. All identified resources are included in the target.
         *
         * - ALL - Run the action on all identified targets. This is the default.
         * - COUNT(n) - Run the action on the specified number of targets, chosen from the identified targets at random. For example, COUNT(1) selects one of the targets.
         * - PERCENT(n) - Run the action on the specified percentage of targets, chosen from the identified targets at random. For example, PERCENT(25) selects 25% of the targets.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetarget.html#cfn-fis-experimenttemplate-experimenttemplatetarget-selectionmode
         */
        readonly selectionMode: string;
    }
}
export declare namespace CfnExperimentTemplate {
    /**
     * Specifies a filter used for the target resource input in an experiment template.
     *
     * For more information, see [Resource filters](https://docs.aws.amazon.com/fis/latest/userguide/targets.html#target-filters) in the *AWS Fault Injection Simulator User Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetargetfilter.html
     */
    interface ExperimentTemplateTargetFilterProperty {
        /**
         * The attribute path for the filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetargetfilter.html#cfn-fis-experimenttemplate-experimenttemplatetargetfilter-path
         */
        readonly path: string;
        /**
         * The attribute values for the filter.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-experimenttemplatetargetfilter.html#cfn-fis-experimenttemplate-experimenttemplatetargetfilter-values
         */
        readonly values: string[];
    }
}
export declare namespace CfnExperimentTemplate {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-s3configuration.html
     */
    interface S3ConfigurationProperty {
        /**
         * `CfnExperimentTemplate.S3ConfigurationProperty.BucketName`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-s3configuration.html#cfn-fis-experimenttemplate-s3configuration-bucketname
         */
        readonly bucketName: string;
        /**
         * `CfnExperimentTemplate.S3ConfigurationProperty.Prefix`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-fis-experimenttemplate-s3configuration.html#cfn-fis-experimenttemplate-s3configuration-prefix
         */
        readonly prefix?: string;
    }
}
