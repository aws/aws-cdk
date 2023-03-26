import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnRuleGroupsNamespace`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html
 */
export interface CfnRuleGroupsNamespaceProps {
    /**
     * The rules definition file for this namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-data
     */
    readonly data: string;
    /**
     * The name of the rule groups namespace. This property is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-name
     */
    readonly name: string;
    /**
     * The ARN of the workspace that contains this rule groups namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-workspace
     */
    readonly workspace: string;
    /**
     * A list of key and value pairs for the workspace resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::APS::RuleGroupsNamespace`
 *
 * The `AWS::APS::RuleGroupsNamespace` resource creates or updates a rule groups namespace within a Amazon Managed Service for Prometheus workspace. For more information, see [Recording rules and alerting rules](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-Ruler.html) .
 *
 * @cloudformationResource AWS::APS::RuleGroupsNamespace
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html
 */
export declare class CfnRuleGroupsNamespace extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::APS::RuleGroupsNamespace";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRuleGroupsNamespace;
    /**
     * The ARN of the rules group namespace. For example, `arn:aws:aps:us-west-2:123456789012:rulegroupsnamespace/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f/amp=rules`
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The rules definition file for this namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-data
     */
    data: string;
    /**
     * The name of the rule groups namespace. This property is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-name
     */
    name: string;
    /**
     * The ARN of the workspace that contains this rule groups namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-workspace
     */
    workspace: string;
    /**
     * A list of key and value pairs for the workspace resources.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::APS::RuleGroupsNamespace`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRuleGroupsNamespaceProps);
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
/**
 * Properties for defining a `CfnWorkspace`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html
 */
export interface CfnWorkspaceProps {
    /**
     * The alert manager definition for the workspace, as a string. For more information, see [Alert manager and templating](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alert-manager.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-alertmanagerdefinition
     */
    readonly alertManagerDefinition?: string;
    /**
     * An alias that you assign to this workspace to help you identify it. It does not need to be unique.
     *
     * The alias can be as many as 100 characters and can include any type of characters. Amazon Managed Service for Prometheus automatically strips any blank spaces from the beginning and end of the alias that you specify.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-alias
     */
    readonly alias?: string;
    /**
     * The LoggingConfiguration attribute is used to set the logging configuration for the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-loggingconfiguration
     */
    readonly loggingConfiguration?: CfnWorkspace.LoggingConfigurationProperty | cdk.IResolvable;
    /**
     * A list of tag keys and values to associate with the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::APS::Workspace`
 *
 * The `AWS::APS::Workspace` type specifies an Amazon Managed Service for Prometheus ( Amazon Managed Service for Prometheus ) workspace. A *workspace* is a logical and isolated Prometheus server dedicated to Prometheus resources such as metrics. You can have one or more workspaces in each Region in your account.
 *
 * @cloudformationResource AWS::APS::Workspace
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html
 */
export declare class CfnWorkspace extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::APS::Workspace";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkspace;
    /**
     * The ARN of the workspace. For example: `arn:aws:aps:us-west-2:123456789012:workspace/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The Prometheus endpoint attribute of the workspace. This is the endpoint prefix without the remote_write or query API appended. For example: `https://aps-workspaces.us-west-2.amazonaws.com/workspaces/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f/` .
     * @cloudformationAttribute PrometheusEndpoint
     */
    readonly attrPrometheusEndpoint: string;
    /**
     * The workspace ID. For example: `ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f` .
     * @cloudformationAttribute WorkspaceId
     */
    readonly attrWorkspaceId: string;
    /**
     * The alert manager definition for the workspace, as a string. For more information, see [Alert manager and templating](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alert-manager.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-alertmanagerdefinition
     */
    alertManagerDefinition: string | undefined;
    /**
     * An alias that you assign to this workspace to help you identify it. It does not need to be unique.
     *
     * The alias can be as many as 100 characters and can include any type of characters. Amazon Managed Service for Prometheus automatically strips any blank spaces from the beginning and end of the alias that you specify.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-alias
     */
    alias: string | undefined;
    /**
     * The LoggingConfiguration attribute is used to set the logging configuration for the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-loggingconfiguration
     */
    loggingConfiguration: CfnWorkspace.LoggingConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * A list of tag keys and values to associate with the workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::APS::Workspace`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnWorkspaceProps);
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
export declare namespace CfnWorkspace {
    /**
     * The LoggingConfiguration attribute sets the logging configuration for the workspace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-aps-workspace-loggingconfiguration.html
     */
    interface LoggingConfigurationProperty {
        /**
         * The Amazon Resource Name (ARN) of the CloudWatch log group the logs are emitted to.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-aps-workspace-loggingconfiguration.html#cfn-aps-workspace-loggingconfiguration-loggrouparn
         */
        readonly logGroupArn?: string;
    }
}
