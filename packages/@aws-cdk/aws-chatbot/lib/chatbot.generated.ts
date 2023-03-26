// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-01-22T09:57:17.891Z","fingerprint":"3LE1OngVgvWZKD1uVFo648HBWi+E5+m0x2XcBNizovA="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnSlackChannelConfiguration`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html
 */
export interface CfnSlackChannelConfigurationProps {

    /**
     * The name of the configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-configurationname
     */
    readonly configurationName: string;

    /**
     * The ARN of the IAM role that defines the permissions for AWS Chatbot .
     *
     * This is a user-defined role that AWS Chatbot will assume. This is not the service-linked role. For more information, see [IAM Policies for AWS Chatbot](https://docs.aws.amazon.com/chatbot/latest/adminguide/chatbot-iam-policies.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-iamrolearn
     */
    readonly iamRoleArn: string;

    /**
     * The ID of the Slack channel.
     *
     * To get the ID, open Slack, right click on the channel name in the left pane, then choose Copy Link. The channel ID is the 9-character string at the end of the URL. For example, `ABCBBLZZZ` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-slackchannelid
     */
    readonly slackChannelId: string;

    /**
     * The ID of the Slack workspace authorized with AWS Chatbot .
     *
     * To get the workspace ID, you must perform the initial authorization flow with Slack in the AWS Chatbot console. Then you can copy and paste the workspace ID from the console. For more details, see steps 1-4 in [Setting Up AWS Chatbot with Slack](https://docs.aws.amazon.com/chatbot/latest/adminguide/setting-up.html#Setup_intro) in the *AWS Chatbot User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-slackworkspaceid
     */
    readonly slackWorkspaceId: string;

    /**
     * The list of IAM policy ARNs that are applied as channel guardrails. The AWS managed 'AdministratorAccess' policy is applied as a default if this is not set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-guardrailpolicies
     */
    readonly guardrailPolicies?: string[];

    /**
     * Specifies the logging level for this configuration. This property affects the log entries pushed to Amazon CloudWatch Logs.
     *
     * Logging levels include `ERROR` , `INFO` , or `NONE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-logginglevel
     */
    readonly loggingLevel?: string;

    /**
     * The ARNs of the SNS topics that deliver notifications to AWS Chatbot .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-snstopicarns
     */
    readonly snsTopicArns?: string[];

    /**
     * Enables use of a user role requirement in your chat configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-userrolerequired
     */
    readonly userRoleRequired?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnSlackChannelConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnSlackChannelConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnSlackChannelConfigurationPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('configurationName', cdk.requiredValidator)(properties.configurationName));
    errors.collect(cdk.propertyValidator('configurationName', cdk.validateString)(properties.configurationName));
    errors.collect(cdk.propertyValidator('guardrailPolicies', cdk.listValidator(cdk.validateString))(properties.guardrailPolicies));
    errors.collect(cdk.propertyValidator('iamRoleArn', cdk.requiredValidator)(properties.iamRoleArn));
    errors.collect(cdk.propertyValidator('iamRoleArn', cdk.validateString)(properties.iamRoleArn));
    errors.collect(cdk.propertyValidator('loggingLevel', cdk.validateString)(properties.loggingLevel));
    errors.collect(cdk.propertyValidator('slackChannelId', cdk.requiredValidator)(properties.slackChannelId));
    errors.collect(cdk.propertyValidator('slackChannelId', cdk.validateString)(properties.slackChannelId));
    errors.collect(cdk.propertyValidator('slackWorkspaceId', cdk.requiredValidator)(properties.slackWorkspaceId));
    errors.collect(cdk.propertyValidator('slackWorkspaceId', cdk.validateString)(properties.slackWorkspaceId));
    errors.collect(cdk.propertyValidator('snsTopicArns', cdk.listValidator(cdk.validateString))(properties.snsTopicArns));
    errors.collect(cdk.propertyValidator('userRoleRequired', cdk.validateBoolean)(properties.userRoleRequired));
    return errors.wrap('supplied properties not correct for "CfnSlackChannelConfigurationProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::Chatbot::SlackChannelConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CfnSlackChannelConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::Chatbot::SlackChannelConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnSlackChannelConfigurationPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSlackChannelConfigurationPropsValidator(properties).assertSuccess();
    return {
        ConfigurationName: cdk.stringToCloudFormation(properties.configurationName),
        IamRoleArn: cdk.stringToCloudFormation(properties.iamRoleArn),
        SlackChannelId: cdk.stringToCloudFormation(properties.slackChannelId),
        SlackWorkspaceId: cdk.stringToCloudFormation(properties.slackWorkspaceId),
        GuardrailPolicies: cdk.listMapper(cdk.stringToCloudFormation)(properties.guardrailPolicies),
        LoggingLevel: cdk.stringToCloudFormation(properties.loggingLevel),
        SnsTopicArns: cdk.listMapper(cdk.stringToCloudFormation)(properties.snsTopicArns),
        UserRoleRequired: cdk.booleanToCloudFormation(properties.userRoleRequired),
    };
}

// @ts-ignore TS6133
function CfnSlackChannelConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSlackChannelConfigurationProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSlackChannelConfigurationProps>();
    ret.addPropertyResult('configurationName', 'ConfigurationName', cfn_parse.FromCloudFormation.getString(properties.ConfigurationName));
    ret.addPropertyResult('iamRoleArn', 'IamRoleArn', cfn_parse.FromCloudFormation.getString(properties.IamRoleArn));
    ret.addPropertyResult('slackChannelId', 'SlackChannelId', cfn_parse.FromCloudFormation.getString(properties.SlackChannelId));
    ret.addPropertyResult('slackWorkspaceId', 'SlackWorkspaceId', cfn_parse.FromCloudFormation.getString(properties.SlackWorkspaceId));
    ret.addPropertyResult('guardrailPolicies', 'GuardrailPolicies', properties.GuardrailPolicies != null ? cfn_parse.FromCloudFormation.getStringArray(properties.GuardrailPolicies) : undefined);
    ret.addPropertyResult('loggingLevel', 'LoggingLevel', properties.LoggingLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingLevel) : undefined);
    ret.addPropertyResult('snsTopicArns', 'SnsTopicArns', properties.SnsTopicArns != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SnsTopicArns) : undefined);
    ret.addPropertyResult('userRoleRequired', 'UserRoleRequired', properties.UserRoleRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UserRoleRequired) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::Chatbot::SlackChannelConfiguration`
 *
 * The `AWS::Chatbot::SlackChannelConfiguration` resource configures a Slack channel to allow users to use AWS Chatbot with AWS CloudFormation templates.
 *
 * This resource requires some setup to be done in the AWS Chatbot console. To provide the required Slack workspace ID, you must perform the initial authorization flow with Slack in the AWS Chatbot console, then copy and paste the workspace ID from the console. For more details, see steps 1-4 in [Setting Up AWS Chatbot with Slack](https://docs.aws.amazon.com/chatbot/latest/adminguide/setting-up.html#Setup_intro) in the *AWS Chatbot User Guide* .
 *
 * @cloudformationResource AWS::Chatbot::SlackChannelConfiguration
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html
 */
export class CfnSlackChannelConfiguration extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Chatbot::SlackChannelConfiguration";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSlackChannelConfiguration {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSlackChannelConfigurationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSlackChannelConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     *
     * @cloudformationAttribute Arn
     */
    public readonly attrArn: string;

    /**
     * The name of the configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-configurationname
     */
    public configurationName: string;

    /**
     * The ARN of the IAM role that defines the permissions for AWS Chatbot .
     *
     * This is a user-defined role that AWS Chatbot will assume. This is not the service-linked role. For more information, see [IAM Policies for AWS Chatbot](https://docs.aws.amazon.com/chatbot/latest/adminguide/chatbot-iam-policies.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-iamrolearn
     */
    public iamRoleArn: string;

    /**
     * The ID of the Slack channel.
     *
     * To get the ID, open Slack, right click on the channel name in the left pane, then choose Copy Link. The channel ID is the 9-character string at the end of the URL. For example, `ABCBBLZZZ` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-slackchannelid
     */
    public slackChannelId: string;

    /**
     * The ID of the Slack workspace authorized with AWS Chatbot .
     *
     * To get the workspace ID, you must perform the initial authorization flow with Slack in the AWS Chatbot console. Then you can copy and paste the workspace ID from the console. For more details, see steps 1-4 in [Setting Up AWS Chatbot with Slack](https://docs.aws.amazon.com/chatbot/latest/adminguide/setting-up.html#Setup_intro) in the *AWS Chatbot User Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-slackworkspaceid
     */
    public slackWorkspaceId: string;

    /**
     * The list of IAM policy ARNs that are applied as channel guardrails. The AWS managed 'AdministratorAccess' policy is applied as a default if this is not set.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-guardrailpolicies
     */
    public guardrailPolicies: string[] | undefined;

    /**
     * Specifies the logging level for this configuration. This property affects the log entries pushed to Amazon CloudWatch Logs.
     *
     * Logging levels include `ERROR` , `INFO` , or `NONE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-logginglevel
     */
    public loggingLevel: string | undefined;

    /**
     * The ARNs of the SNS topics that deliver notifications to AWS Chatbot .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-snstopicarns
     */
    public snsTopicArns: string[] | undefined;

    /**
     * Enables use of a user role requirement in your chat configuration.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-userrolerequired
     */
    public userRoleRequired: boolean | cdk.IResolvable | undefined;

    /**
     * Create a new `AWS::Chatbot::SlackChannelConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSlackChannelConfigurationProps) {
        super(scope, id, { type: CfnSlackChannelConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'configurationName', this);
        cdk.requireProperty(props, 'iamRoleArn', this);
        cdk.requireProperty(props, 'slackChannelId', this);
        cdk.requireProperty(props, 'slackWorkspaceId', this);
        this.attrArn = cdk.Token.asString(this.getAtt('Arn', cdk.ResolutionTypeHint.STRING));

        this.configurationName = props.configurationName;
        this.iamRoleArn = props.iamRoleArn;
        this.slackChannelId = props.slackChannelId;
        this.slackWorkspaceId = props.slackWorkspaceId;
        this.guardrailPolicies = props.guardrailPolicies;
        this.loggingLevel = props.loggingLevel;
        this.snsTopicArns = props.snsTopicArns;
        this.userRoleRequired = props.userRoleRequired;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSlackChannelConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            configurationName: this.configurationName,
            iamRoleArn: this.iamRoleArn,
            slackChannelId: this.slackChannelId,
            slackWorkspaceId: this.slackWorkspaceId,
            guardrailPolicies: this.guardrailPolicies,
            loggingLevel: this.loggingLevel,
            snsTopicArns: this.snsTopicArns,
            userRoleRequired: this.userRoleRequired,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSlackChannelConfigurationPropsToCloudFormation(props);
    }
}
