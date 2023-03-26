import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnAccountAlias`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-accountalias.html
 */
export interface CfnAccountAliasProps {
    /**
     * An alias or short name for an AWS account .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-accountalias.html#cfn-supportapp-accountalias-accountalias
     */
    readonly accountAlias: string;
}
/**
 * A CloudFormation `AWS::SupportApp::AccountAlias`
 *
 * You can use the `AWS::SupportApp::AccountAlias` resource to specify your AWS account when you configure the AWS Support App in Slack. Your alias name appears on the AWS Support App page in the Support Center Console and in messages from the AWS Support App. You can use this alias to identify the account you've configured with the AWS Support App .
 *
 * For more information, see [AWS Support App in Slack](https://docs.aws.amazon.com/awssupport/latest/user/aws-support-app-for-slack.html) in the *AWS Support User Guide* .
 *
 * @cloudformationResource AWS::SupportApp::AccountAlias
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-accountalias.html
 */
export declare class CfnAccountAlias extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SupportApp::AccountAlias";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccountAlias;
    /**
     * The `AccountAlias` resource type has an attribute `AccountAliasResourceId` . You can use this attribute to identify the resource.
     *
     * The `AccountAliasResourceId` will be `AccountAlias_for_accountId` . In this example, `AccountAlias_for_` is the prefix and `accountId` is your AWS account number, such as `AccountAlias_for_123456789012` .
     * @cloudformationAttribute AccountAliasResourceId
     */
    readonly attrAccountAliasResourceId: string;
    /**
     * An alias or short name for an AWS account .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-accountalias.html#cfn-supportapp-accountalias-accountalias
     */
    accountAlias: string;
    /**
     * Create a new `AWS::SupportApp::AccountAlias`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAccountAliasProps);
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
 * Properties for defining a `CfnSlackChannelConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html
 */
export interface CfnSlackChannelConfigurationProps {
    /**
     * The channel ID in Slack. This ID identifies a channel within a Slack workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-channelid
     */
    readonly channelId: string;
    /**
     * The Amazon Resource Name (ARN) of the IAM role for this Slack channel configuration. The AWS Support App uses this role to perform AWS Support and Service Quotas actions on your behalf.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-channelrolearn
     */
    readonly channelRoleArn: string;
    /**
     * The case severity for your support cases that you want to receive notifications. You can specify `none` , `all` , or `high` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-notifyoncaseseverity
     */
    readonly notifyOnCaseSeverity: string;
    /**
     * The team ID in Slack. This ID uniquely identifies a Slack workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-teamid
     */
    readonly teamId: string;
    /**
     * The channel name in Slack. This is the channel where you invite the AWS Support App .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-channelname
     */
    readonly channelName?: string;
    /**
     * Whether to get notified when a correspondence is added to your support cases.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-notifyonaddcorrespondencetocase
     */
    readonly notifyOnAddCorrespondenceToCase?: boolean | cdk.IResolvable;
    /**
     * Whether to get notified when your support cases are created or reopened
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-notifyoncreateorreopencase
     */
    readonly notifyOnCreateOrReopenCase?: boolean | cdk.IResolvable;
    /**
     * Whether to get notified when your support cases are resolved.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-notifyonresolvecase
     */
    readonly notifyOnResolveCase?: boolean | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::SupportApp::SlackChannelConfiguration`
 *
 * You can use the `AWS::SupportApp::SlackChannelConfiguration` resource to specify your AWS account when you configure the AWS Support App . This resource includes the following information:
 *
 * - The Slack channel name and ID
 * - The team ID in Slack
 * - The Amazon Resource Name (ARN) of the AWS Identity and Access Management ( IAM ) role
 * - Whether you want the AWS Support App to notify you when your support cases are created, updated, resolved, or reopened
 * - The case severity that you want to get notified for
 *
 * For more information, see the following topics in the *AWS Support User Guide* :
 *
 * - [AWS Support App in Slack](https://docs.aws.amazon.com/awssupport/latest/user/aws-support-app-for-slack.html)
 * - [Creating AWS Support App in Slack resources with AWS CloudFormation](https://docs.aws.amazon.com/awssupport/latest/user/creating-resources-with-cloudformation.html)
 *
 * @cloudformationResource AWS::SupportApp::SlackChannelConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html
 */
export declare class CfnSlackChannelConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SupportApp::SlackChannelConfiguration";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSlackChannelConfiguration;
    /**
     * The channel ID in Slack. This ID identifies a channel within a Slack workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-channelid
     */
    channelId: string;
    /**
     * The Amazon Resource Name (ARN) of the IAM role for this Slack channel configuration. The AWS Support App uses this role to perform AWS Support and Service Quotas actions on your behalf.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-channelrolearn
     */
    channelRoleArn: string;
    /**
     * The case severity for your support cases that you want to receive notifications. You can specify `none` , `all` , or `high` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-notifyoncaseseverity
     */
    notifyOnCaseSeverity: string;
    /**
     * The team ID in Slack. This ID uniquely identifies a Slack workspace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-teamid
     */
    teamId: string;
    /**
     * The channel name in Slack. This is the channel where you invite the AWS Support App .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-channelname
     */
    channelName: string | undefined;
    /**
     * Whether to get notified when a correspondence is added to your support cases.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-notifyonaddcorrespondencetocase
     */
    notifyOnAddCorrespondenceToCase: boolean | cdk.IResolvable | undefined;
    /**
     * Whether to get notified when your support cases are created or reopened
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-notifyoncreateorreopencase
     */
    notifyOnCreateOrReopenCase: boolean | cdk.IResolvable | undefined;
    /**
     * Whether to get notified when your support cases are resolved.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-notifyonresolvecase
     */
    notifyOnResolveCase: boolean | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::SupportApp::SlackChannelConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSlackChannelConfigurationProps);
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
 * Properties for defining a `CfnSlackWorkspaceConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackworkspaceconfiguration.html
 */
export interface CfnSlackWorkspaceConfigurationProps {
    /**
     * The team ID in Slack. This ID uniquely identifies a Slack workspace, such as `T012ABCDEFG` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackworkspaceconfiguration.html#cfn-supportapp-slackworkspaceconfiguration-teamid
     */
    readonly teamId: string;
    /**
     * An identifier used to update an existing Slack workspace configuration in AWS CloudFormation , such as `100` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackworkspaceconfiguration.html#cfn-supportapp-slackworkspaceconfiguration-versionid
     */
    readonly versionId?: string;
}
/**
 * A CloudFormation `AWS::SupportApp::SlackWorkspaceConfiguration`
 *
 * You can use the `AWS::SupportApp::SlackWorkspaceConfiguration` resource to specify your Slack workspace configuration. This resource configures your AWS account so that you can use the specified Slack workspace in the AWS Support App . This resource includes the following information:
 *
 * - The team ID for the Slack workspace
 * - The version ID of the resource to use with AWS CloudFormation
 *
 * For more information, see the following topics in the *AWS Support User Guide* :
 *
 * - [AWS Support App in Slack](https://docs.aws.amazon.com/awssupport/latest/user/aws-support-app-for-slack.html)
 * - [Creating AWS Support App in Slack resources with AWS CloudFormation](https://docs.aws.amazon.com/awssupport/latest/user/creating-resources-with-cloudformation.html)
 *
 * @cloudformationResource AWS::SupportApp::SlackWorkspaceConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackworkspaceconfiguration.html
 */
export declare class CfnSlackWorkspaceConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SupportApp::SlackWorkspaceConfiguration";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSlackWorkspaceConfiguration;
    /**
     * The team ID in Slack. This ID uniquely identifies a Slack workspace, such as `T012ABCDEFG` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackworkspaceconfiguration.html#cfn-supportapp-slackworkspaceconfiguration-teamid
     */
    teamId: string;
    /**
     * An identifier used to update an existing Slack workspace configuration in AWS CloudFormation , such as `100` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackworkspaceconfiguration.html#cfn-supportapp-slackworkspaceconfiguration-versionid
     */
    versionId: string | undefined;
    /**
     * Create a new `AWS::SupportApp::SlackWorkspaceConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSlackWorkspaceConfigurationProps);
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
