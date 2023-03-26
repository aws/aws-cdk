import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnReplicationSet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html
 */
export interface CfnReplicationSetProps {
    /**
     * Specifies the Regions of the replication set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-regions
     */
    readonly regions: Array<CfnReplicationSet.ReplicationRegionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Determines if the replication set deletion protection is enabled or not. If deletion protection is enabled, you can't delete the last Region in the replication set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-deletionprotected
     */
    readonly deletionProtected?: boolean | cdk.IResolvable;
    /**
     * A list of tags to add to the replication set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::SSMIncidents::ReplicationSet`
 *
 * The `AWS::SSMIncidents::ReplicationSet` resource specifies a set of Regions that Incident Manager data is replicated to and the KMS key used to encrypt the data.
 *
 * @cloudformationResource AWS::SSMIncidents::ReplicationSet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html
 */
export declare class CfnReplicationSet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSMIncidents::ReplicationSet";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReplicationSet;
    /**
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Specifies the Regions of the replication set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-regions
     */
    regions: Array<CfnReplicationSet.ReplicationRegionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Determines if the replication set deletion protection is enabled or not. If deletion protection is enabled, you can't delete the last Region in the replication set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-deletionprotected
     */
    deletionProtected: boolean | cdk.IResolvable | undefined;
    /**
     * A list of tags to add to the replication set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::SSMIncidents::ReplicationSet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnReplicationSetProps);
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
export declare namespace CfnReplicationSet {
    /**
     * The `RegionConfiguration` property specifies the Region and KMS key to add to the replication set.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-regionconfiguration.html
     */
    interface RegionConfigurationProperty {
        /**
         * The KMS key ID to use to encrypt your replication set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-regionconfiguration.html#cfn-ssmincidents-replicationset-regionconfiguration-ssekmskeyid
         */
        readonly sseKmsKeyId: string;
    }
}
export declare namespace CfnReplicationSet {
    /**
     * The `ReplicationRegion` property type specifies the Region and KMS key to add to the replication set.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-replicationregion.html
     */
    interface ReplicationRegionProperty {
        /**
         * Specifies the Region configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-replicationregion.html#cfn-ssmincidents-replicationset-replicationregion-regionconfiguration
         */
        readonly regionConfiguration?: CfnReplicationSet.RegionConfigurationProperty | cdk.IResolvable;
        /**
         * Specifies the region name to add to the replication set.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-replicationregion.html#cfn-ssmincidents-replicationset-replicationregion-regionname
         */
        readonly regionName?: string;
    }
}
/**
 * Properties for defining a `CfnResponsePlan`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html
 */
export interface CfnResponsePlanProps {
    /**
     * Details used to create an incident when using this response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-incidenttemplate
     */
    readonly incidentTemplate: CfnResponsePlan.IncidentTemplateProperty | cdk.IResolvable;
    /**
     * The name of the response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-name
     */
    readonly name: string;
    /**
     * The actions that the response plan starts at the beginning of an incident.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-actions
     */
    readonly actions?: Array<CfnResponsePlan.ActionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The AWS Chatbot chat channel used for collaboration during an incident.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-chatchannel
     */
    readonly chatChannel?: CfnResponsePlan.ChatChannelProperty | cdk.IResolvable;
    /**
     * The human readable name of the response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-displayname
     */
    readonly displayName?: string;
    /**
     * The Amazon Resource Name (ARN) for the contacts and escalation plans that the response plan engages during an incident.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-engagements
     */
    readonly engagements?: string[];
    /**
     * Information about third-party services integrated into the response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-integrations
     */
    readonly integrations?: Array<CfnResponsePlan.IntegrationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::SSMIncidents::ResponsePlan`
 *
 * The `AWS::SSMIncidents::ResponsePlan` resource specifies the details of the response plan that are used when creating an incident.
 *
 * @cloudformationResource AWS::SSMIncidents::ResponsePlan
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html
 */
export declare class CfnResponsePlan extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSMIncidents::ResponsePlan";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResponsePlan;
    /**
     *
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * Details used to create an incident when using this response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-incidenttemplate
     */
    incidentTemplate: CfnResponsePlan.IncidentTemplateProperty | cdk.IResolvable;
    /**
     * The name of the response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-name
     */
    name: string;
    /**
     * The actions that the response plan starts at the beginning of an incident.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-actions
     */
    actions: Array<CfnResponsePlan.ActionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The AWS Chatbot chat channel used for collaboration during an incident.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-chatchannel
     */
    chatChannel: CfnResponsePlan.ChatChannelProperty | cdk.IResolvable | undefined;
    /**
     * The human readable name of the response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-displayname
     */
    displayName: string | undefined;
    /**
     * The Amazon Resource Name (ARN) for the contacts and escalation plans that the response plan engages during an incident.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-engagements
     */
    engagements: string[] | undefined;
    /**
     * Information about third-party services integrated into the response plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-integrations
     */
    integrations: Array<CfnResponsePlan.IntegrationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::SSMIncidents::ResponsePlan`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnResponsePlanProps);
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
export declare namespace CfnResponsePlan {
    /**
     * The `Action` property type specifies the configuration to launch.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-action.html
     */
    interface ActionProperty {
        /**
         * Details about the Systems Manager automation document that will be used as a runbook during an incident.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-action.html#cfn-ssmincidents-responseplan-action-ssmautomation
         */
        readonly ssmAutomation?: CfnResponsePlan.SsmAutomationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnResponsePlan {
    /**
     * The AWS Chatbot chat channel used for collaboration during an incident.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-chatchannel.html
     */
    interface ChatChannelProperty {
        /**
         * The SNS targets that AWS Chatbot uses to notify the chat channel of updates to an incident. You can also make updates to the incident through the chat channel by using the SNS topics
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-chatchannel.html#cfn-ssmincidents-responseplan-chatchannel-chatbotsns
         */
        readonly chatbotSns?: string[];
    }
}
export declare namespace CfnResponsePlan {
    /**
     * When you add a runbook to a response plan, you can specify the parameters the runbook should use at runtime. Response plans support parameters with both static and dynamic values. For static values, you enter the value when you define the parameter in the response plan. For dynamic values, the system determines the correct parameter value by collecting information from the incident. Incident Manager supports the following dynamic parameters:
     *
     * *Incident ARN*
     *
     * When Incident Manager creates an incident, the system captures the Amazon Resource Name (ARN) of the corresponding incident record and enters it for this parameter in the runbook.
     *
     * > This value can only be assigned to parameters of type `String` . If assigned to a parameter of any other type, the runbook fails to run.
     *
     * *Involved resources*
     *
     * When Incident Manager creates an incident, the system captures the ARNs of the resources involved in the incident. These resource ARNs are then assigned to this parameter in the runbook.
     *
     * > This value can only be assigned to parameters of type `StringList` . If assigned to a parameter of any other type, the runbook fails to run.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparameter.html
     */
    interface DynamicSsmParameterProperty {
        /**
         * The key parameter to use when running the Systems Manager Automation runbook.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparameter.html#cfn-ssmincidents-responseplan-dynamicssmparameter-key
         */
        readonly key: string;
        /**
         * The dynamic parameter value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparameter.html#cfn-ssmincidents-responseplan-dynamicssmparameter-value
         */
        readonly value: CfnResponsePlan.DynamicSsmParameterValueProperty | cdk.IResolvable;
    }
}
export declare namespace CfnResponsePlan {
    /**
     * The dynamic parameter value.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparametervalue.html
     */
    interface DynamicSsmParameterValueProperty {
        /**
         * Variable dynamic parameters. A parameter value is determined when an incident is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparametervalue.html#cfn-ssmincidents-responseplan-dynamicssmparametervalue-variable
         */
        readonly variable?: string;
    }
}
export declare namespace CfnResponsePlan {
    /**
     * The `IncidentTemplate` property type specifies details used to create an incident when using this response plan.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html
     */
    interface IncidentTemplateProperty {
        /**
         * Used to create only one incident record for an incident.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-dedupestring
         */
        readonly dedupeString?: string;
        /**
         * Defines the impact to the customers. Providing an impact overwrites the impact provided by a response plan.
         *
         * **Possible impacts:** - `1` - Critical impact, this typically relates to full application failure that impacts many to all customers.
         * - `2` - High impact, partial application failure with impact to many customers.
         * - `3` - Medium impact, the application is providing reduced service to customers.
         * - `4` - Low impact, customer might aren't impacted by the problem yet.
         * - `5` - No impact, customers aren't currently impacted but urgent action is needed to avoid impact.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-impact
         */
        readonly impact: number;
        /**
         * Tags to assign to the template. When the `StartIncident` API action is called, Incident Manager assigns the tags specified in the template to the incident.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-incidenttags
         */
        readonly incidentTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The SNS targets that AWS Chatbot uses to notify the chat channel of updates to an incident. You can also make updates to the incident through the chat channel using the SNS topics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-notificationtargets
         */
        readonly notificationTargets?: Array<CfnResponsePlan.NotificationTargetItemProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The summary describes what has happened during the incident.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-summary
         */
        readonly summary?: string;
        /**
         * The title of the incident is a brief and easily recognizable.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-title
         */
        readonly title: string;
    }
}
export declare namespace CfnResponsePlan {
    /**
     * Information about third-party services integrated into a response plan.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-integration.html
     */
    interface IntegrationProperty {
        /**
         * Information about the PagerDuty service where the response plan creates an incident.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-integration.html#cfn-ssmincidents-responseplan-integration-pagerdutyconfiguration
         */
        readonly pagerDutyConfiguration: CfnResponsePlan.PagerDutyConfigurationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnResponsePlan {
    /**
     * The SNS topic that's used by AWS Chatbot to notify the incidents chat channel.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-notificationtargetitem.html
     */
    interface NotificationTargetItemProperty {
        /**
         * The Amazon Resource Name (ARN) of the SNS topic.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-notificationtargetitem.html#cfn-ssmincidents-responseplan-notificationtargetitem-snstopicarn
         */
        readonly snsTopicArn?: string;
    }
}
export declare namespace CfnResponsePlan {
    /**
     * Details about the PagerDuty configuration for a response plan.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyconfiguration.html
     */
    interface PagerDutyConfigurationProperty {
        /**
         * The name of the PagerDuty configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyconfiguration.html#cfn-ssmincidents-responseplan-pagerdutyconfiguration-name
         */
        readonly name: string;
        /**
         * Details about the PagerDuty service associated with the configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyconfiguration.html#cfn-ssmincidents-responseplan-pagerdutyconfiguration-pagerdutyincidentconfiguration
         */
        readonly pagerDutyIncidentConfiguration: CfnResponsePlan.PagerDutyIncidentConfigurationProperty | cdk.IResolvable;
        /**
         * The ID of the AWS Secrets Manager secret that stores your PagerDuty key, either a General Access REST API Key or User Token REST API Key, and other user credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyconfiguration.html#cfn-ssmincidents-responseplan-pagerdutyconfiguration-secretid
         */
        readonly secretId: string;
    }
}
export declare namespace CfnResponsePlan {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyincidentconfiguration.html
     */
    interface PagerDutyIncidentConfigurationProperty {
        /**
         * The ID of the PagerDuty service that the response plan associates with an incident when it launches.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyincidentconfiguration.html#cfn-ssmincidents-responseplan-pagerdutyincidentconfiguration-serviceid
         */
        readonly serviceId: string;
    }
}
export declare namespace CfnResponsePlan {
    /**
     * The `SsmAutomation` property type specifies details about the Systems Manager automation document that will be used as a runbook during an incident.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html
     */
    interface SsmAutomationProperty {
        /**
         * The automation document's name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-documentname
         */
        readonly documentName: string;
        /**
         * The automation document's version to use when running.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-documentversion
         */
        readonly documentVersion?: string;
        /**
         * The key-value pairs to resolve dynamic parameter values when processing a Systems Manager Automation runbook.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-dynamicparameters
         */
        readonly dynamicParameters?: Array<CfnResponsePlan.DynamicSsmParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The key-value pair parameters to use when running the automation document.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-parameters
         */
        readonly parameters?: Array<CfnResponsePlan.SsmParameterProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the role that the automation document will assume when running commands.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-rolearn
         */
        readonly roleArn: string;
        /**
         * The account that the automation document will be run in. This can be in either the management account or an application account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-targetaccount
         */
        readonly targetAccount?: string;
    }
}
export declare namespace CfnResponsePlan {
    /**
     * The key-value pair parameters to use when running the automation document.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmparameter.html
     */
    interface SsmParameterProperty {
        /**
         * The key parameter to use when running the automation document.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmparameter.html#cfn-ssmincidents-responseplan-ssmparameter-key
         */
        readonly key: string;
        /**
         * The value parameter to use when running the automation document.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmparameter.html#cfn-ssmincidents-responseplan-ssmparameter-values
         */
        readonly values: string[];
    }
}
