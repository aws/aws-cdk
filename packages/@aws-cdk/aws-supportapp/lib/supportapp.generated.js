"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnSlackWorkspaceConfiguration = exports.CfnSlackChannelConfiguration = exports.CfnAccountAlias = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("@aws-cdk/core");
const cfn_parse = require("@aws-cdk/core/lib/helpers-internal");
/**
 * Determine whether the given properties match those of a `CfnAccountAliasProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccountAliasProps`
 *
 * @returns the result of the validation.
 */
function CfnAccountAliasPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('accountAlias', cdk.requiredValidator)(properties.accountAlias));
    errors.collect(cdk.propertyValidator('accountAlias', cdk.validateString)(properties.accountAlias));
    return errors.wrap('supplied properties not correct for "CfnAccountAliasProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::SupportApp::AccountAlias` resource
 *
 * @param properties - the TypeScript properties of a `CfnAccountAliasProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SupportApp::AccountAlias` resource.
 */
// @ts-ignore TS6133
function cfnAccountAliasPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnAccountAliasPropsValidator(properties).assertSuccess();
    return {
        AccountAlias: cdk.stringToCloudFormation(properties.accountAlias),
    };
}
// @ts-ignore TS6133
function CfnAccountAliasPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('accountAlias', 'AccountAlias', cfn_parse.FromCloudFormation.getString(properties.AccountAlias));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
class CfnAccountAlias extends cdk.CfnResource {
    /**
     * Create a new `AWS::SupportApp::AccountAlias`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnAccountAlias.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_supportapp_CfnAccountAliasProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnAccountAlias);
            }
            throw error;
        }
        cdk.requireProperty(props, 'accountAlias', this);
        this.attrAccountAliasResourceId = cdk.Token.asString(this.getAtt('AccountAliasResourceId', cdk.ResolutionTypeHint.STRING));
        this.accountAlias = props.accountAlias;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnAccountAliasPropsFromCloudFormation(resourceProperties);
        const ret = new CfnAccountAlias(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccountAlias.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            accountAlias: this.accountAlias,
        };
    }
    renderProperties(props) {
        return cfnAccountAliasPropsToCloudFormation(props);
    }
}
exports.CfnAccountAlias = CfnAccountAlias;
_a = JSII_RTTI_SYMBOL_1;
CfnAccountAlias[_a] = { fqn: "@aws-cdk/aws-supportapp.CfnAccountAlias", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnAccountAlias.CFN_RESOURCE_TYPE_NAME = "AWS::SupportApp::AccountAlias";
/**
 * Determine whether the given properties match those of a `CfnSlackChannelConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnSlackChannelConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnSlackChannelConfigurationPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('channelId', cdk.requiredValidator)(properties.channelId));
    errors.collect(cdk.propertyValidator('channelId', cdk.validateString)(properties.channelId));
    errors.collect(cdk.propertyValidator('channelName', cdk.validateString)(properties.channelName));
    errors.collect(cdk.propertyValidator('channelRoleArn', cdk.requiredValidator)(properties.channelRoleArn));
    errors.collect(cdk.propertyValidator('channelRoleArn', cdk.validateString)(properties.channelRoleArn));
    errors.collect(cdk.propertyValidator('notifyOnAddCorrespondenceToCase', cdk.validateBoolean)(properties.notifyOnAddCorrespondenceToCase));
    errors.collect(cdk.propertyValidator('notifyOnCaseSeverity', cdk.requiredValidator)(properties.notifyOnCaseSeverity));
    errors.collect(cdk.propertyValidator('notifyOnCaseSeverity', cdk.validateString)(properties.notifyOnCaseSeverity));
    errors.collect(cdk.propertyValidator('notifyOnCreateOrReopenCase', cdk.validateBoolean)(properties.notifyOnCreateOrReopenCase));
    errors.collect(cdk.propertyValidator('notifyOnResolveCase', cdk.validateBoolean)(properties.notifyOnResolveCase));
    errors.collect(cdk.propertyValidator('teamId', cdk.requiredValidator)(properties.teamId));
    errors.collect(cdk.propertyValidator('teamId', cdk.validateString)(properties.teamId));
    return errors.wrap('supplied properties not correct for "CfnSlackChannelConfigurationProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::SupportApp::SlackChannelConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CfnSlackChannelConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SupportApp::SlackChannelConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnSlackChannelConfigurationPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSlackChannelConfigurationPropsValidator(properties).assertSuccess();
    return {
        ChannelId: cdk.stringToCloudFormation(properties.channelId),
        ChannelRoleArn: cdk.stringToCloudFormation(properties.channelRoleArn),
        NotifyOnCaseSeverity: cdk.stringToCloudFormation(properties.notifyOnCaseSeverity),
        TeamId: cdk.stringToCloudFormation(properties.teamId),
        ChannelName: cdk.stringToCloudFormation(properties.channelName),
        NotifyOnAddCorrespondenceToCase: cdk.booleanToCloudFormation(properties.notifyOnAddCorrespondenceToCase),
        NotifyOnCreateOrReopenCase: cdk.booleanToCloudFormation(properties.notifyOnCreateOrReopenCase),
        NotifyOnResolveCase: cdk.booleanToCloudFormation(properties.notifyOnResolveCase),
    };
}
// @ts-ignore TS6133
function CfnSlackChannelConfigurationPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('channelId', 'ChannelId', cfn_parse.FromCloudFormation.getString(properties.ChannelId));
    ret.addPropertyResult('channelRoleArn', 'ChannelRoleArn', cfn_parse.FromCloudFormation.getString(properties.ChannelRoleArn));
    ret.addPropertyResult('notifyOnCaseSeverity', 'NotifyOnCaseSeverity', cfn_parse.FromCloudFormation.getString(properties.NotifyOnCaseSeverity));
    ret.addPropertyResult('teamId', 'TeamId', cfn_parse.FromCloudFormation.getString(properties.TeamId));
    ret.addPropertyResult('channelName', 'ChannelName', properties.ChannelName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelName) : undefined);
    ret.addPropertyResult('notifyOnAddCorrespondenceToCase', 'NotifyOnAddCorrespondenceToCase', properties.NotifyOnAddCorrespondenceToCase != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NotifyOnAddCorrespondenceToCase) : undefined);
    ret.addPropertyResult('notifyOnCreateOrReopenCase', 'NotifyOnCreateOrReopenCase', properties.NotifyOnCreateOrReopenCase != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NotifyOnCreateOrReopenCase) : undefined);
    ret.addPropertyResult('notifyOnResolveCase', 'NotifyOnResolveCase', properties.NotifyOnResolveCase != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NotifyOnResolveCase) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
class CfnSlackChannelConfiguration extends cdk.CfnResource {
    /**
     * Create a new `AWS::SupportApp::SlackChannelConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnSlackChannelConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_supportapp_CfnSlackChannelConfigurationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnSlackChannelConfiguration);
            }
            throw error;
        }
        cdk.requireProperty(props, 'channelId', this);
        cdk.requireProperty(props, 'channelRoleArn', this);
        cdk.requireProperty(props, 'notifyOnCaseSeverity', this);
        cdk.requireProperty(props, 'teamId', this);
        this.channelId = props.channelId;
        this.channelRoleArn = props.channelRoleArn;
        this.notifyOnCaseSeverity = props.notifyOnCaseSeverity;
        this.teamId = props.teamId;
        this.channelName = props.channelName;
        this.notifyOnAddCorrespondenceToCase = props.notifyOnAddCorrespondenceToCase;
        this.notifyOnCreateOrReopenCase = props.notifyOnCreateOrReopenCase;
        this.notifyOnResolveCase = props.notifyOnResolveCase;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSlackChannelConfigurationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSlackChannelConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSlackChannelConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            channelId: this.channelId,
            channelRoleArn: this.channelRoleArn,
            notifyOnCaseSeverity: this.notifyOnCaseSeverity,
            teamId: this.teamId,
            channelName: this.channelName,
            notifyOnAddCorrespondenceToCase: this.notifyOnAddCorrespondenceToCase,
            notifyOnCreateOrReopenCase: this.notifyOnCreateOrReopenCase,
            notifyOnResolveCase: this.notifyOnResolveCase,
        };
    }
    renderProperties(props) {
        return cfnSlackChannelConfigurationPropsToCloudFormation(props);
    }
}
exports.CfnSlackChannelConfiguration = CfnSlackChannelConfiguration;
_b = JSII_RTTI_SYMBOL_1;
CfnSlackChannelConfiguration[_b] = { fqn: "@aws-cdk/aws-supportapp.CfnSlackChannelConfiguration", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnSlackChannelConfiguration.CFN_RESOURCE_TYPE_NAME = "AWS::SupportApp::SlackChannelConfiguration";
/**
 * Determine whether the given properties match those of a `CfnSlackWorkspaceConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnSlackWorkspaceConfigurationProps`
 *
 * @returns the result of the validation.
 */
function CfnSlackWorkspaceConfigurationPropsValidator(properties) {
    if (!cdk.canInspect(properties)) {
        return cdk.VALIDATION_SUCCESS;
    }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('teamId', cdk.requiredValidator)(properties.teamId));
    errors.collect(cdk.propertyValidator('teamId', cdk.validateString)(properties.teamId));
    errors.collect(cdk.propertyValidator('versionId', cdk.validateString)(properties.versionId));
    return errors.wrap('supplied properties not correct for "CfnSlackWorkspaceConfigurationProps"');
}
/**
 * Renders the AWS CloudFormation properties of an `AWS::SupportApp::SlackWorkspaceConfiguration` resource
 *
 * @param properties - the TypeScript properties of a `CfnSlackWorkspaceConfigurationProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SupportApp::SlackWorkspaceConfiguration` resource.
 */
// @ts-ignore TS6133
function cfnSlackWorkspaceConfigurationPropsToCloudFormation(properties) {
    if (!cdk.canInspect(properties)) {
        return properties;
    }
    CfnSlackWorkspaceConfigurationPropsValidator(properties).assertSuccess();
    return {
        TeamId: cdk.stringToCloudFormation(properties.teamId),
        VersionId: cdk.stringToCloudFormation(properties.versionId),
    };
}
// @ts-ignore TS6133
function CfnSlackWorkspaceConfigurationPropsFromCloudFormation(properties) {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject();
    ret.addPropertyResult('teamId', 'TeamId', cfn_parse.FromCloudFormation.getString(properties.TeamId));
    ret.addPropertyResult('versionId', 'VersionId', properties.VersionId != null ? cfn_parse.FromCloudFormation.getString(properties.VersionId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
class CfnSlackWorkspaceConfiguration extends cdk.CfnResource {
    /**
     * Create a new `AWS::SupportApp::SlackWorkspaceConfiguration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope, id, props) {
        super(scope, id, { type: CfnSlackWorkspaceConfiguration.CFN_RESOURCE_TYPE_NAME, properties: props });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_supportapp_CfnSlackWorkspaceConfigurationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CfnSlackWorkspaceConfiguration);
            }
            throw error;
        }
        cdk.requireProperty(props, 'teamId', this);
        this.teamId = props.teamId;
        this.versionId = props.versionId;
    }
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope, id, resourceAttributes, options) {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSlackWorkspaceConfigurationPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSlackWorkspaceConfiguration(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSlackWorkspaceConfiguration.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }
    get cfnProperties() {
        return {
            teamId: this.teamId,
            versionId: this.versionId,
        };
    }
    renderProperties(props) {
        return cfnSlackWorkspaceConfigurationPropsToCloudFormation(props);
    }
}
exports.CfnSlackWorkspaceConfiguration = CfnSlackWorkspaceConfiguration;
_c = JSII_RTTI_SYMBOL_1;
CfnSlackWorkspaceConfiguration[_c] = { fqn: "@aws-cdk/aws-supportapp.CfnSlackWorkspaceConfiguration", version: "0.0.0" };
/**
 * The CloudFormation resource type name for this resource class.
 */
CfnSlackWorkspaceConfiguration.CFN_RESOURCE_TYPE_NAME = "AWS::SupportApp::SlackWorkspaceConfiguration";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwcG9ydGFwcC5nZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdXBwb3J0YXBwLmdlbmVyYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFRQSxxQ0FBcUM7QUFDckMsZ0VBQWdFO0FBb0JoRTs7Ozs7O0dBTUc7QUFDSCxTQUFTLDZCQUE2QixDQUFDLFVBQWU7SUFDbEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFBRSxPQUFPLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQztLQUFFO0lBQ25FLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvRztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUN0RyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ25HLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO0FBQ3JGLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxvQkFBb0I7QUFDcEIsU0FBUyxvQ0FBb0MsQ0FBQyxVQUFlO0lBQ3pELElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQUUsT0FBTyxVQUFVLENB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NkIsRUFBRSw4QkFBOEIsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1FBQzdHLFNBQVMsQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQzlFO0lBRUQsSUFBYyxhQUFhO1FBQ3ZCLE9BQU87WUFDSCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTO1NBQzVCLENBQUM7S0FDTDtJQUVTLGdCQUFnQixDQUFDLEtBQTJCO1FBQ2xELE9BQU8sbURBQW1ELENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckU7O0FBMUVMLHdFQTJFQzs7O0FBMUVHOztHQUVHO0FBQ29CLHFEQUFzQixHQUFHLDhDQUE4QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTItMjAyMyBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy8gR2VuZXJhdGVkIGZyb20gdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBSZXNvdXJjZSBTcGVjaWZpY2F0aW9uXG4vLyBTZWU6IGRvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9jZm4tcmVzb3VyY2Utc3BlY2lmaWNhdGlvbi5odG1sXG4vLyBAY2ZuMnRzOm1ldGFAIHtcImdlbmVyYXRlZFwiOlwiMjAyMy0wMS0yMlQwOTo1NDoyMy42NDhaXCIsXCJmaW5nZXJwcmludFwiOlwiSlR4SG9vdHEwdGNGNGJXdzB4QkY1dG53V1hQV2tBVmQvN2ppR0hZdHVtUT1cIn1cblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqLyAvLyBUaGlzIGlzIGdlbmVyYXRlZCBjb2RlIC0gbGluZSBsZW5ndGhzIGFyZSBkaWZmaWN1bHQgdG8gY29udHJvbFxuXG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY2ZuX3BhcnNlIGZyb20gJ0Bhd3MtY2RrL2NvcmUvbGliL2hlbHBlcnMtaW50ZXJuYWwnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGRlZmluaW5nIGEgYENmbkFjY291bnRBbGlhc2BcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc3VwcG9ydGFwcC1hY2NvdW50YWxpYXMuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENmbkFjY291bnRBbGlhc1Byb3BzIHtcblxuICAgIC8qKlxuICAgICAqIEFuIGFsaWFzIG9yIHNob3J0IG5hbWUgZm9yIGFuIEFXUyBhY2NvdW50IC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXN1cHBvcnRhcHAtYWNjb3VudGFsaWFzLmh0bWwjY2ZuLXN1cHBvcnRhcHAtYWNjb3VudGFsaWFzLWFjY291bnRhbGlhc1xuICAgICAqL1xuICAgIHJlYWRvbmx5IGFjY291bnRBbGlhczogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmbkFjY291bnRBbGlhc1Byb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5BY2NvdW50QWxpYXNQcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5BY2NvdW50QWxpYXNQcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2FjY291bnRBbGlhcycsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5hY2NvdW50QWxpYXMpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2FjY291bnRBbGlhcycsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5hY2NvdW50QWxpYXMpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuQWNjb3VudEFsaWFzUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlN1cHBvcnRBcHA6OkFjY291bnRBbGlhc2AgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuQWNjb3VudEFsaWFzUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlN1cHBvcnRBcHA6OkFjY291bnRBbGlhc2AgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5BY2NvdW50QWxpYXNQcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuQWNjb3VudEFsaWFzUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIEFjY291bnRBbGlhczogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5hY2NvdW50QWxpYXMpLFxuICAgIH07XG59XG5cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBDZm5BY2NvdW50QWxpYXNQcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmbkFjY291bnRBbGlhc1Byb3BzPiB7XG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgPT0gbnVsbCA/IHt9IDogcHJvcGVydGllcztcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBuZXcgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdChwcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgY29uc3QgcmV0ID0gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25Qcm9wZXJ0eU9iamVjdDxDZm5BY2NvdW50QWxpYXNQcm9wcz4oKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ2FjY291bnRBbGlhcycsICdBY2NvdW50QWxpYXMnLCBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldFN0cmluZyhwcm9wZXJ0aWVzLkFjY291bnRBbGlhcykpO1xuICAgIHJldC5hZGRVbnJlY29nbml6ZWRQcm9wZXJ0aWVzQXNFeHRyYShwcm9wZXJ0aWVzKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgQ2xvdWRGb3JtYXRpb24gYEFXUzo6U3VwcG9ydEFwcDo6QWNjb3VudEFsaWFzYFxuICpcbiAqIFlvdSBjYW4gdXNlIHRoZSBgQVdTOjpTdXBwb3J0QXBwOjpBY2NvdW50QWxpYXNgIHJlc291cmNlIHRvIHNwZWNpZnkgeW91ciBBV1MgYWNjb3VudCB3aGVuIHlvdSBjb25maWd1cmUgdGhlIEFXUyBTdXBwb3J0IEFwcCBpbiBTbGFjay4gWW91ciBhbGlhcyBuYW1lIGFwcGVhcnMgb24gdGhlIEFXUyBTdXBwb3J0IEFwcCBwYWdlIGluIHRoZSBTdXBwb3J0IENlbnRlciBDb25zb2xlIGFuZCBpbiBtZXNzYWdlcyBmcm9tIHRoZSBBV1MgU3VwcG9ydCBBcHAuIFlvdSBjYW4gdXNlIHRoaXMgYWxpYXMgdG8gaWRlbnRpZnkgdGhlIGFjY291bnQgeW91J3ZlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgQVdTIFN1cHBvcnQgQXBwIC5cbiAqXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIFtBV1MgU3VwcG9ydCBBcHAgaW4gU2xhY2tdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hd3NzdXBwb3J0L2xhdGVzdC91c2VyL2F3cy1zdXBwb3J0LWFwcC1mb3Itc2xhY2suaHRtbCkgaW4gdGhlICpBV1MgU3VwcG9ydCBVc2VyIEd1aWRlKiAuXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpTdXBwb3J0QXBwOjpBY2NvdW50QWxpYXNcbiAqIEBzdGFiaWxpdHkgZXh0ZXJuYWxcbiAqXG4gKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zdXBwb3J0YXBwLWFjY291bnRhbGlhcy5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBDZm5BY2NvdW50QWxpYXMgZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpTdXBwb3J0QXBwOjpBY2NvdW50QWxpYXNcIjtcblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSBtZXRob2QgdGhhdCBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZnJvbSBhbiBvYmplY3RcbiAgICAgKiBjb250YWluaW5nIHRoZSBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAgICogVXNlZCBpbiB0aGUgQGF3cy1jZGsvY2xvdWRmb3JtYXRpb24taW5jbHVkZSBtb2R1bGUuXG4gICAgICpcbiAgICAgKiBAaW50ZXJuYWxcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIF9mcm9tQ2xvdWRGb3JtYXRpb24oc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBpZDogc3RyaW5nLCByZXNvdXJjZUF0dHJpYnV0ZXM6IGFueSwgb3B0aW9uczogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbk9wdGlvbnMpOiBDZm5BY2NvdW50QWxpYXMge1xuICAgICAgICByZXNvdXJjZUF0dHJpYnV0ZXMgPSByZXNvdXJjZUF0dHJpYnV0ZXMgfHwge307XG4gICAgICAgIGNvbnN0IHJlc291cmNlUHJvcGVydGllcyA9IG9wdGlvbnMucGFyc2VyLnBhcnNlVmFsdWUocmVzb3VyY2VBdHRyaWJ1dGVzLlByb3BlcnRpZXMpO1xuICAgICAgICBjb25zdCBwcm9wc1Jlc3VsdCA9IENmbkFjY291bnRBbGlhc1Byb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHJlc291cmNlUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBDZm5BY2NvdW50QWxpYXMoc2NvcGUsIGlkLCBwcm9wc1Jlc3VsdC52YWx1ZSk7XG4gICAgICAgIGZvciAoY29uc3QgW3Byb3BLZXksIHByb3BWYWxdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BzUmVzdWx0LmV4dHJhUHJvcGVydGllcykpICB7XG4gICAgICAgICAgICByZXQuYWRkUHJvcGVydHlPdmVycmlkZShwcm9wS2V5LCBwcm9wVmFsKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnBhcnNlci5oYW5kbGVBdHRyaWJ1dGVzKHJldCwgcmVzb3VyY2VBdHRyaWJ1dGVzLCBpZCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGBBY2NvdW50QWxpYXNgIHJlc291cmNlIHR5cGUgaGFzIGFuIGF0dHJpYnV0ZSBgQWNjb3VudEFsaWFzUmVzb3VyY2VJZGAgLiBZb3UgY2FuIHVzZSB0aGlzIGF0dHJpYnV0ZSB0byBpZGVudGlmeSB0aGUgcmVzb3VyY2UuXG4gICAgICpcbiAgICAgKiBUaGUgYEFjY291bnRBbGlhc1Jlc291cmNlSWRgIHdpbGwgYmUgYEFjY291bnRBbGlhc19mb3JfYWNjb3VudElkYCAuIEluIHRoaXMgZXhhbXBsZSwgYEFjY291bnRBbGlhc19mb3JfYCBpcyB0aGUgcHJlZml4IGFuZCBgYWNjb3VudElkYCBpcyB5b3VyIEFXUyBhY2NvdW50IG51bWJlciwgc3VjaCBhcyBgQWNjb3VudEFsaWFzX2Zvcl8xMjM0NTY3ODkwMTJgIC5cbiAgICAgKiBAY2xvdWRmb3JtYXRpb25BdHRyaWJ1dGUgQWNjb3VudEFsaWFzUmVzb3VyY2VJZFxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhdHRyQWNjb3VudEFsaWFzUmVzb3VyY2VJZDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQW4gYWxpYXMgb3Igc2hvcnQgbmFtZSBmb3IgYW4gQVdTIGFjY291bnQgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc3VwcG9ydGFwcC1hY2NvdW50YWxpYXMuaHRtbCNjZm4tc3VwcG9ydGFwcC1hY2NvdW50YWxpYXMtYWNjb3VudGFsaWFzXG4gICAgICovXG4gICAgcHVibGljIGFjY291bnRBbGlhczogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OlN1cHBvcnRBcHA6OkFjY291bnRBbGlhc2AuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NvcGUgLSBzY29wZSBpbiB3aGljaCB0aGlzIHJlc291cmNlIGlzIGRlZmluZWRcbiAgICAgKiBAcGFyYW0gaWQgICAgLSBzY29wZWQgaWQgb2YgdGhlIHJlc291cmNlXG4gICAgICogQHBhcmFtIHByb3BzIC0gcmVzb3VyY2UgcHJvcGVydGllc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENmbkFjY291bnRBbGlhc1Byb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgeyB0eXBlOiBDZm5BY2NvdW50QWxpYXMuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdhY2NvdW50QWxpYXMnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRyQWNjb3VudEFsaWFzUmVzb3VyY2VJZCA9IGNkay5Ub2tlbi5hc1N0cmluZyh0aGlzLmdldEF0dCgnQWNjb3VudEFsaWFzUmVzb3VyY2VJZCcsIGNkay5SZXNvbHV0aW9uVHlwZUhpbnQuU1RSSU5HKSk7XG5cbiAgICAgICAgdGhpcy5hY2NvdW50QWxpYXMgPSBwcm9wcy5hY2NvdW50QWxpYXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5BY2NvdW50QWxpYXMuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSk7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnByb3BzXCIsIHRoaXMuY2ZuUHJvcGVydGllcyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBjZm5Qcm9wZXJ0aWVzKCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFjY291bnRBbGlhczogdGhpcy5hY2NvdW50QWxpYXMsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcHM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSAge1xuICAgICAgICByZXR1cm4gY2ZuQWNjb3VudEFsaWFzUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BzKTtcbiAgICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgZGVmaW5pbmcgYSBgQ2ZuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbmBcbiAqXG4gKiBAc3RydWN0XG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc3VwcG9ydGFwcC1zbGFja2NoYW5uZWxjb25maWd1cmF0aW9uLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5TbGFja0NoYW5uZWxDb25maWd1cmF0aW9uUHJvcHMge1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNoYW5uZWwgSUQgaW4gU2xhY2suIFRoaXMgSUQgaWRlbnRpZmllcyBhIGNoYW5uZWwgd2l0aGluIGEgU2xhY2sgd29ya3NwYWNlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc3VwcG9ydGFwcC1zbGFja2NoYW5uZWxjb25maWd1cmF0aW9uLmh0bWwjY2ZuLXN1cHBvcnRhcHAtc2xhY2tjaGFubmVsY29uZmlndXJhdGlvbi1jaGFubmVsaWRcbiAgICAgKi9cbiAgICByZWFkb25seSBjaGFubmVsSWQ6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgSUFNIHJvbGUgZm9yIHRoaXMgU2xhY2sgY2hhbm5lbCBjb25maWd1cmF0aW9uLiBUaGUgQVdTIFN1cHBvcnQgQXBwIHVzZXMgdGhpcyByb2xlIHRvIHBlcmZvcm0gQVdTIFN1cHBvcnQgYW5kIFNlcnZpY2UgUXVvdGFzIGFjdGlvbnMgb24geW91ciBiZWhhbGYuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zdXBwb3J0YXBwLXNsYWNrY2hhbm5lbGNvbmZpZ3VyYXRpb24uaHRtbCNjZm4tc3VwcG9ydGFwcC1zbGFja2NoYW5uZWxjb25maWd1cmF0aW9uLWNoYW5uZWxyb2xlYXJuXG4gICAgICovXG4gICAgcmVhZG9ubHkgY2hhbm5lbFJvbGVBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBjYXNlIHNldmVyaXR5IGZvciB5b3VyIHN1cHBvcnQgY2FzZXMgdGhhdCB5b3Ugd2FudCB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnMuIFlvdSBjYW4gc3BlY2lmeSBgbm9uZWAgLCBgYWxsYCAsIG9yIGBoaWdoYCAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zdXBwb3J0YXBwLXNsYWNrY2hhbm5lbGNvbmZpZ3VyYXRpb24uaHRtbCNjZm4tc3VwcG9ydGFwcC1zbGFja2NoYW5uZWxjb25maWd1cmF0aW9uLW5vdGlmeW9uY2FzZXNldmVyaXR5XG4gICAgICovXG4gICAgcmVhZG9ubHkgbm90aWZ5T25DYXNlU2V2ZXJpdHk6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSB0ZWFtIElEIGluIFNsYWNrLiBUaGlzIElEIHVuaXF1ZWx5IGlkZW50aWZpZXMgYSBTbGFjayB3b3Jrc3BhY2UuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zdXBwb3J0YXBwLXNsYWNrY2hhbm5lbGNvbmZpZ3VyYXRpb24uaHRtbCNjZm4tc3VwcG9ydGFwcC1zbGFja2NoYW5uZWxjb25maWd1cmF0aW9uLXRlYW1pZFxuICAgICAqL1xuICAgIHJlYWRvbmx5IHRlYW1JZDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNoYW5uZWwgbmFtZSBpbiBTbGFjay4gVGhpcyBpcyB0aGUgY2hhbm5lbCB3aGVyZSB5b3UgaW52aXRlIHRoZSBBV1MgU3VwcG9ydCBBcHAgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc3VwcG9ydGFwcC1zbGFja2NoYW5uZWxjb25maWd1cmF0aW9uLmh0bWwjY2ZuLXN1cHBvcnRhcHAtc2xhY2tjaGFubmVsY29uZmlndXJhdGlvbi1jaGFubmVsbmFtZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IGNoYW5uZWxOYW1lPzogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBnZXQgbm90aWZpZWQgd2hlbiBhIGNvcnJlc3BvbmRlbmNlIGlzIGFkZGVkIHRvIHlvdXIgc3VwcG9ydCBjYXNlcy5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXN1cHBvcnRhcHAtc2xhY2tjaGFubmVsY29uZmlndXJhdGlvbi5odG1sI2Nmbi1zdXBwb3J0YXBwLXNsYWNrY2hhbm5lbGNvbmZpZ3VyYXRpb24tbm90aWZ5b25hZGRjb3JyZXNwb25kZW5jZXRvY2FzZVxuICAgICAqL1xuICAgIHJlYWRvbmx5IG5vdGlmeU9uQWRkQ29ycmVzcG9uZGVuY2VUb0Nhc2U/OiBib29sZWFuIHwgY2RrLklSZXNvbHZhYmxlO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byBnZXQgbm90aWZpZWQgd2hlbiB5b3VyIHN1cHBvcnQgY2FzZXMgYXJlIGNyZWF0ZWQgb3IgcmVvcGVuZWRcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXN1cHBvcnRhcHAtc2xhY2tjaGFubmVsY29uZmlndXJhdGlvbi5odG1sI2Nmbi1zdXBwb3J0YXBwLXNsYWNrY2hhbm5lbGNvbmZpZ3VyYXRpb24tbm90aWZ5b25jcmVhdGVvcnJlb3BlbmNhc2VcbiAgICAgKi9cbiAgICByZWFkb25seSBub3RpZnlPbkNyZWF0ZU9yUmVvcGVuQ2FzZT86IGJvb2xlYW4gfCBjZGsuSVJlc29sdmFibGU7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIGdldCBub3RpZmllZCB3aGVuIHlvdXIgc3VwcG9ydCBjYXNlcyBhcmUgcmVzb2x2ZWQuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zdXBwb3J0YXBwLXNsYWNrY2hhbm5lbGNvbmZpZ3VyYXRpb24uaHRtbCNjZm4tc3VwcG9ydGFwcC1zbGFja2NoYW5uZWxjb25maWd1cmF0aW9uLW5vdGlmeW9ucmVzb2x2ZWNhc2VcbiAgICAgKi9cbiAgICByZWFkb25seSBub3RpZnlPblJlc29sdmVDYXNlPzogYm9vbGVhbiB8IGNkay5JUmVzb2x2YWJsZTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydGllcyBtYXRjaCB0aG9zZSBvZiBhIGBDZm5TbGFja0NoYW5uZWxDb25maWd1cmF0aW9uUHJvcHNgXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25Qcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5TbGFja0NoYW5uZWxDb25maWd1cmF0aW9uUHJvcHNWYWxpZGF0b3IocHJvcGVydGllczogYW55KTogY2RrLlZhbGlkYXRpb25SZXN1bHQge1xuICAgIGlmICghY2RrLmNhbkluc3BlY3QocHJvcGVydGllcykpIHsgcmV0dXJuIGNkay5WQUxJREFUSU9OX1NVQ0NFU1M7IH1cbiAgICBjb25zdCBlcnJvcnMgPSBuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHRzKCk7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBlcnJvcnMuY29sbGVjdChuZXcgY2RrLlZhbGlkYXRpb25SZXN1bHQoJ0V4cGVjdGVkIGFuIG9iamVjdCwgYnV0IHJlY2VpdmVkOiAnICsgSlNPTi5zdHJpbmdpZnkocHJvcGVydGllcykpKTtcbiAgICB9XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjaGFubmVsSWQnLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuY2hhbm5lbElkKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjaGFubmVsSWQnLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMuY2hhbm5lbElkKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdjaGFubmVsTmFtZScsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy5jaGFubmVsTmFtZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignY2hhbm5lbFJvbGVBcm4nLCBjZGsucmVxdWlyZWRWYWxpZGF0b3IpKHByb3BlcnRpZXMuY2hhbm5lbFJvbGVBcm4pKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ2NoYW5uZWxSb2xlQXJuJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLmNoYW5uZWxSb2xlQXJuKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdub3RpZnlPbkFkZENvcnJlc3BvbmRlbmNlVG9DYXNlJywgY2RrLnZhbGlkYXRlQm9vbGVhbikocHJvcGVydGllcy5ub3RpZnlPbkFkZENvcnJlc3BvbmRlbmNlVG9DYXNlKSk7XG4gICAgZXJyb3JzLmNvbGxlY3QoY2RrLnByb3BlcnR5VmFsaWRhdG9yKCdub3RpZnlPbkNhc2VTZXZlcml0eScsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy5ub3RpZnlPbkNhc2VTZXZlcml0eSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbm90aWZ5T25DYXNlU2V2ZXJpdHknLCBjZGsudmFsaWRhdGVTdHJpbmcpKHByb3BlcnRpZXMubm90aWZ5T25DYXNlU2V2ZXJpdHkpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ25vdGlmeU9uQ3JlYXRlT3JSZW9wZW5DYXNlJywgY2RrLnZhbGlkYXRlQm9vbGVhbikocHJvcGVydGllcy5ub3RpZnlPbkNyZWF0ZU9yUmVvcGVuQ2FzZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcignbm90aWZ5T25SZXNvbHZlQ2FzZScsIGNkay52YWxpZGF0ZUJvb2xlYW4pKHByb3BlcnRpZXMubm90aWZ5T25SZXNvbHZlQ2FzZSkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGVhbUlkJywgY2RrLnJlcXVpcmVkVmFsaWRhdG9yKShwcm9wZXJ0aWVzLnRlYW1JZCkpO1xuICAgIGVycm9ycy5jb2xsZWN0KGNkay5wcm9wZXJ0eVZhbGlkYXRvcigndGVhbUlkJywgY2RrLnZhbGlkYXRlU3RyaW5nKShwcm9wZXJ0aWVzLnRlYW1JZCkpO1xuICAgIHJldHVybiBlcnJvcnMud3JhcCgnc3VwcGxpZWQgcHJvcGVydGllcyBub3QgY29ycmVjdCBmb3IgXCJDZm5TbGFja0NoYW5uZWxDb25maWd1cmF0aW9uUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlN1cHBvcnRBcHA6OlNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25gIHJlc291cmNlXG4gKlxuICogQHBhcmFtIHByb3BlcnRpZXMgLSB0aGUgVHlwZVNjcmlwdCBwcm9wZXJ0aWVzIG9mIGEgYENmblNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25Qcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgQVdTIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgYW4gYEFXUzo6U3VwcG9ydEFwcDo6U2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5TbGFja0NoYW5uZWxDb25maWd1cmF0aW9uUHJvcHNUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXM6IGFueSk6IGFueSB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gcHJvcGVydGllczsgfVxuICAgIENmblNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzKS5hc3NlcnRTdWNjZXNzKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgQ2hhbm5lbElkOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmNoYW5uZWxJZCksXG4gICAgICAgIENoYW5uZWxSb2xlQXJuOiBjZGsuc3RyaW5nVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLmNoYW5uZWxSb2xlQXJuKSxcbiAgICAgICAgTm90aWZ5T25DYXNlU2V2ZXJpdHk6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubm90aWZ5T25DYXNlU2V2ZXJpdHkpLFxuICAgICAgICBUZWFtSWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudGVhbUlkKSxcbiAgICAgICAgQ2hhbm5lbE5hbWU6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMuY2hhbm5lbE5hbWUpLFxuICAgICAgICBOb3RpZnlPbkFkZENvcnJlc3BvbmRlbmNlVG9DYXNlOiBjZGsuYm9vbGVhblRvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy5ub3RpZnlPbkFkZENvcnJlc3BvbmRlbmNlVG9DYXNlKSxcbiAgICAgICAgTm90aWZ5T25DcmVhdGVPclJlb3BlbkNhc2U6IGNkay5ib29sZWFuVG9DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzLm5vdGlmeU9uQ3JlYXRlT3JSZW9wZW5DYXNlKSxcbiAgICAgICAgTm90aWZ5T25SZXNvbHZlQ2FzZTogY2RrLmJvb2xlYW5Ub0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMubm90aWZ5T25SZXNvbHZlQ2FzZSksXG4gICAgfTtcbn1cblxuLy8gQHRzLWlnbm9yZSBUUzYxMzNcbmZ1bmN0aW9uIENmblNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25Qcm9wc0Zyb21DbG91ZEZvcm1hdGlvbihwcm9wZXJ0aWVzOiBhbnkpOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUmVzdWx0PENmblNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25Qcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvblByb3BzPigpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnY2hhbm5lbElkJywgJ0NoYW5uZWxJZCcsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuQ2hhbm5lbElkKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdjaGFubmVsUm9sZUFybicsICdDaGFubmVsUm9sZUFybicsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuQ2hhbm5lbFJvbGVBcm4pKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ25vdGlmeU9uQ2FzZVNldmVyaXR5JywgJ05vdGlmeU9uQ2FzZVNldmVyaXR5JywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5Ob3RpZnlPbkNhc2VTZXZlcml0eSkpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgndGVhbUlkJywgJ1RlYW1JZCcsIGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuVGVhbUlkKSk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCdjaGFubmVsTmFtZScsICdDaGFubmVsTmFtZScsIHByb3BlcnRpZXMuQ2hhbm5lbE5hbWUgIT0gbnVsbCA/IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb24uZ2V0U3RyaW5nKHByb3BlcnRpZXMuQ2hhbm5lbE5hbWUpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ25vdGlmeU9uQWRkQ29ycmVzcG9uZGVuY2VUb0Nhc2UnLCAnTm90aWZ5T25BZGRDb3JyZXNwb25kZW5jZVRvQ2FzZScsIHByb3BlcnRpZXMuTm90aWZ5T25BZGRDb3JyZXNwb25kZW5jZVRvQ2FzZSAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRCb29sZWFuKHByb3BlcnRpZXMuTm90aWZ5T25BZGRDb3JyZXNwb25kZW5jZVRvQ2FzZSkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbm90aWZ5T25DcmVhdGVPclJlb3BlbkNhc2UnLCAnTm90aWZ5T25DcmVhdGVPclJlb3BlbkNhc2UnLCBwcm9wZXJ0aWVzLk5vdGlmeU9uQ3JlYXRlT3JSZW9wZW5DYXNlICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEJvb2xlYW4ocHJvcGVydGllcy5Ob3RpZnlPbkNyZWF0ZU9yUmVvcGVuQ2FzZSkgOiB1bmRlZmluZWQpO1xuICAgIHJldC5hZGRQcm9wZXJ0eVJlc3VsdCgnbm90aWZ5T25SZXNvbHZlQ2FzZScsICdOb3RpZnlPblJlc29sdmVDYXNlJywgcHJvcGVydGllcy5Ob3RpZnlPblJlc29sdmVDYXNlICE9IG51bGwgPyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uLmdldEJvb2xlYW4ocHJvcGVydGllcy5Ob3RpZnlPblJlc29sdmVDYXNlKSA6IHVuZGVmaW5lZCk7XG4gICAgcmV0LmFkZFVucmVjb2duaXplZFByb3BlcnRpZXNBc0V4dHJhKHByb3BlcnRpZXMpO1xuICAgIHJldHVybiByZXQ7XG59XG5cbi8qKlxuICogQSBDbG91ZEZvcm1hdGlvbiBgQVdTOjpTdXBwb3J0QXBwOjpTbGFja0NoYW5uZWxDb25maWd1cmF0aW9uYFxuICpcbiAqIFlvdSBjYW4gdXNlIHRoZSBgQVdTOjpTdXBwb3J0QXBwOjpTbGFja0NoYW5uZWxDb25maWd1cmF0aW9uYCByZXNvdXJjZSB0byBzcGVjaWZ5IHlvdXIgQVdTIGFjY291bnQgd2hlbiB5b3UgY29uZmlndXJlIHRoZSBBV1MgU3VwcG9ydCBBcHAgLiBUaGlzIHJlc291cmNlIGluY2x1ZGVzIHRoZSBmb2xsb3dpbmcgaW5mb3JtYXRpb246XG4gKlxuICogLSBUaGUgU2xhY2sgY2hhbm5lbCBuYW1lIGFuZCBJRFxuICogLSBUaGUgdGVhbSBJRCBpbiBTbGFja1xuICogLSBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIEFXUyBJZGVudGl0eSBhbmQgQWNjZXNzIE1hbmFnZW1lbnQgKCBJQU0gKSByb2xlXG4gKiAtIFdoZXRoZXIgeW91IHdhbnQgdGhlIEFXUyBTdXBwb3J0IEFwcCB0byBub3RpZnkgeW91IHdoZW4geW91ciBzdXBwb3J0IGNhc2VzIGFyZSBjcmVhdGVkLCB1cGRhdGVkLCByZXNvbHZlZCwgb3IgcmVvcGVuZWRcbiAqIC0gVGhlIGNhc2Ugc2V2ZXJpdHkgdGhhdCB5b3Ugd2FudCB0byBnZXQgbm90aWZpZWQgZm9yXG4gKlxuICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSB0aGUgZm9sbG93aW5nIHRvcGljcyBpbiB0aGUgKkFXUyBTdXBwb3J0IFVzZXIgR3VpZGUqIDpcbiAqXG4gKiAtIFtBV1MgU3VwcG9ydCBBcHAgaW4gU2xhY2tdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hd3NzdXBwb3J0L2xhdGVzdC91c2VyL2F3cy1zdXBwb3J0LWFwcC1mb3Itc2xhY2suaHRtbClcbiAqIC0gW0NyZWF0aW5nIEFXUyBTdXBwb3J0IEFwcCBpbiBTbGFjayByZXNvdXJjZXMgd2l0aCBBV1MgQ2xvdWRGb3JtYXRpb25dKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hd3NzdXBwb3J0L2xhdGVzdC91c2VyL2NyZWF0aW5nLXJlc291cmNlcy13aXRoLWNsb3VkZm9ybWF0aW9uLmh0bWwpXG4gKlxuICogQGNsb3VkZm9ybWF0aW9uUmVzb3VyY2UgQVdTOjpTdXBwb3J0QXBwOjpTbGFja0NoYW5uZWxDb25maWd1cmF0aW9uXG4gKiBAc3RhYmlsaXR5IGV4dGVybmFsXG4gKlxuICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc3VwcG9ydGFwcC1zbGFja2NoYW5uZWxjb25maWd1cmF0aW9uLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmblNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb24gZXh0ZW5kcyBjZGsuQ2ZuUmVzb3VyY2UgaW1wbGVtZW50cyBjZGsuSUluc3BlY3RhYmxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2xvdWRGb3JtYXRpb24gcmVzb3VyY2UgdHlwZSBuYW1lIGZvciB0aGlzIHJlc291cmNlIGNsYXNzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSA9IFwiQVdTOjpTdXBwb3J0QXBwOjpTbGFja0NoYW5uZWxDb25maWd1cmF0aW9uXCI7XG5cbiAgICAvKipcbiAgICAgKiBBIGZhY3RvcnkgbWV0aG9kIHRoYXQgY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZyb20gYW4gb2JqZWN0XG4gICAgICogY29udGFpbmluZyB0aGUgQ2xvdWRGb3JtYXRpb24gcHJvcGVydGllcyBvZiB0aGlzIHJlc291cmNlLlxuICAgICAqIFVzZWQgaW4gdGhlIEBhd3MtY2RrL2Nsb3VkZm9ybWF0aW9uLWluY2x1ZGUgbW9kdWxlLlxuICAgICAqXG4gICAgICogQGludGVybmFsXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBfZnJvbUNsb3VkRm9ybWF0aW9uKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcmVzb3VyY2VBdHRyaWJ1dGVzOiBhbnksIG9wdGlvbnM6IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25PcHRpb25zKTogQ2ZuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvbiB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuU2xhY2tDaGFubmVsQ29uZmlndXJhdGlvblByb3BzRnJvbUNsb3VkRm9ybWF0aW9uKHJlc291cmNlUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHJldCA9IG5ldyBDZm5TbGFja0NoYW5uZWxDb25maWd1cmF0aW9uKHNjb3BlLCBpZCwgcHJvcHNSZXN1bHQudmFsdWUpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wS2V5LCBwcm9wVmFsXSBvZiBPYmplY3QuZW50cmllcyhwcm9wc1Jlc3VsdC5leHRyYVByb3BlcnRpZXMpKSAge1xuICAgICAgICAgICAgcmV0LmFkZFByb3BlcnR5T3ZlcnJpZGUocHJvcEtleSwgcHJvcFZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wYXJzZXIuaGFuZGxlQXR0cmlidXRlcyhyZXQsIHJlc291cmNlQXR0cmlidXRlcywgaWQpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBjaGFubmVsIElEIGluIFNsYWNrLiBUaGlzIElEIGlkZW50aWZpZXMgYSBjaGFubmVsIHdpdGhpbiBhIFNsYWNrIHdvcmtzcGFjZS5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXN1cHBvcnRhcHAtc2xhY2tjaGFubmVsY29uZmlndXJhdGlvbi5odG1sI2Nmbi1zdXBwb3J0YXBwLXNsYWNrY2hhbm5lbGNvbmZpZ3VyYXRpb24tY2hhbm5lbGlkXG4gICAgICovXG4gICAgcHVibGljIGNoYW5uZWxJZDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBJQU0gcm9sZSBmb3IgdGhpcyBTbGFjayBjaGFubmVsIGNvbmZpZ3VyYXRpb24uIFRoZSBBV1MgU3VwcG9ydCBBcHAgdXNlcyB0aGlzIHJvbGUgdG8gcGVyZm9ybSBBV1MgU3VwcG9ydCBhbmQgU2VydmljZSBRdW90YXMgYWN0aW9ucyBvbiB5b3VyIGJlaGFsZi5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXN1cHBvcnRhcHAtc2xhY2tjaGFubmVsY29uZmlndXJhdGlvbi5odG1sI2Nmbi1zdXBwb3J0YXBwLXNsYWNrY2hhbm5lbGNvbmZpZ3VyYXRpb24tY2hhbm5lbHJvbGVhcm5cbiAgICAgKi9cbiAgICBwdWJsaWMgY2hhbm5lbFJvbGVBcm46IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBjYXNlIHNldmVyaXR5IGZvciB5b3VyIHN1cHBvcnQgY2FzZXMgdGhhdCB5b3Ugd2FudCB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnMuIFlvdSBjYW4gc3BlY2lmeSBgbm9uZWAgLCBgYWxsYCAsIG9yIGBoaWdoYCAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zdXBwb3J0YXBwLXNsYWNrY2hhbm5lbGNvbmZpZ3VyYXRpb24uaHRtbCNjZm4tc3VwcG9ydGFwcC1zbGFja2NoYW5uZWxjb25maWd1cmF0aW9uLW5vdGlmeW9uY2FzZXNldmVyaXR5XG4gICAgICovXG4gICAgcHVibGljIG5vdGlmeU9uQ2FzZVNldmVyaXR5OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdGVhbSBJRCBpbiBTbGFjay4gVGhpcyBJRCB1bmlxdWVseSBpZGVudGlmaWVzIGEgU2xhY2sgd29ya3NwYWNlLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc3VwcG9ydGFwcC1zbGFja2NoYW5uZWxjb25maWd1cmF0aW9uLmh0bWwjY2ZuLXN1cHBvcnRhcHAtc2xhY2tjaGFubmVsY29uZmlndXJhdGlvbi10ZWFtaWRcbiAgICAgKi9cbiAgICBwdWJsaWMgdGVhbUlkOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY2hhbm5lbCBuYW1lIGluIFNsYWNrLiBUaGlzIGlzIHRoZSBjaGFubmVsIHdoZXJlIHlvdSBpbnZpdGUgdGhlIEFXUyBTdXBwb3J0IEFwcCAuXG4gICAgICpcbiAgICAgKiBAbGluayBodHRwOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1zdXBwb3J0YXBwLXNsYWNrY2hhbm5lbGNvbmZpZ3VyYXRpb24uaHRtbCNjZm4tc3VwcG9ydGFwcC1zbGFja2NoYW5uZWxjb25maWd1cmF0aW9uLWNoYW5uZWxuYW1lXG4gICAgICovXG4gICAgcHVibGljIGNoYW5uZWxOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIGdldCBub3RpZmllZCB3aGVuIGEgY29ycmVzcG9uZGVuY2UgaXMgYWRkZWQgdG8geW91ciBzdXBwb3J0IGNhc2VzLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc3VwcG9ydGFwcC1zbGFja2NoYW5uZWxjb25maWd1cmF0aW9uLmh0bWwjY2ZuLXN1cHBvcnRhcHAtc2xhY2tjaGFubmVsY29uZmlndXJhdGlvbi1ub3RpZnlvbmFkZGNvcnJlc3BvbmRlbmNldG9jYXNlXG4gICAgICovXG4gICAgcHVibGljIG5vdGlmeU9uQWRkQ29ycmVzcG9uZGVuY2VUb0Nhc2U6IGJvb2xlYW4gfCBjZGsuSVJlc29sdmFibGUgfCB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIGdldCBub3RpZmllZCB3aGVuIHlvdXIgc3VwcG9ydCBjYXNlcyBhcmUgY3JlYXRlZCBvciByZW9wZW5lZFxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc3VwcG9ydGFwcC1zbGFja2NoYW5uZWxjb25maWd1cmF0aW9uLmh0bWwjY2ZuLXN1cHBvcnRhcHAtc2xhY2tjaGFubmVsY29uZmlndXJhdGlvbi1ub3RpZnlvbmNyZWF0ZW9ycmVvcGVuY2FzZVxuICAgICAqL1xuICAgIHB1YmxpYyBub3RpZnlPbkNyZWF0ZU9yUmVvcGVuQ2FzZTogYm9vbGVhbiB8IGNkay5JUmVzb2x2YWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gZ2V0IG5vdGlmaWVkIHdoZW4geW91ciBzdXBwb3J0IGNhc2VzIGFyZSByZXNvbHZlZC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXN1cHBvcnRhcHAtc2xhY2tjaGFubmVsY29uZmlndXJhdGlvbi5odG1sI2Nmbi1zdXBwb3J0YXBwLXNsYWNrY2hhbm5lbGNvbmZpZ3VyYXRpb24tbm90aWZ5b25yZXNvbHZlY2FzZVxuICAgICAqL1xuICAgIHB1YmxpYyBub3RpZnlPblJlc29sdmVDYXNlOiBib29sZWFuIHwgY2RrLklSZXNvbHZhYmxlIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IGBBV1M6OlN1cHBvcnRBcHA6OlNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25gLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5TbGFja0NoYW5uZWxDb25maWd1cmF0aW9uUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCB7IHR5cGU6IENmblNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb24uQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwgcHJvcGVydGllczogcHJvcHMgfSk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdjaGFubmVsSWQnLCB0aGlzKTtcbiAgICAgICAgY2RrLnJlcXVpcmVQcm9wZXJ0eShwcm9wcywgJ2NoYW5uZWxSb2xlQXJuJywgdGhpcyk7XG4gICAgICAgIGNkay5yZXF1aXJlUHJvcGVydHkocHJvcHMsICdub3RpZnlPbkNhc2VTZXZlcml0eScsIHRoaXMpO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAndGVhbUlkJywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5jaGFubmVsSWQgPSBwcm9wcy5jaGFubmVsSWQ7XG4gICAgICAgIHRoaXMuY2hhbm5lbFJvbGVBcm4gPSBwcm9wcy5jaGFubmVsUm9sZUFybjtcbiAgICAgICAgdGhpcy5ub3RpZnlPbkNhc2VTZXZlcml0eSA9IHByb3BzLm5vdGlmeU9uQ2FzZVNldmVyaXR5O1xuICAgICAgICB0aGlzLnRlYW1JZCA9IHByb3BzLnRlYW1JZDtcbiAgICAgICAgdGhpcy5jaGFubmVsTmFtZSA9IHByb3BzLmNoYW5uZWxOYW1lO1xuICAgICAgICB0aGlzLm5vdGlmeU9uQWRkQ29ycmVzcG9uZGVuY2VUb0Nhc2UgPSBwcm9wcy5ub3RpZnlPbkFkZENvcnJlc3BvbmRlbmNlVG9DYXNlO1xuICAgICAgICB0aGlzLm5vdGlmeU9uQ3JlYXRlT3JSZW9wZW5DYXNlID0gcHJvcHMubm90aWZ5T25DcmVhdGVPclJlb3BlbkNhc2U7XG4gICAgICAgIHRoaXMubm90aWZ5T25SZXNvbHZlQ2FzZSA9IHByb3BzLm5vdGlmeU9uUmVzb2x2ZUNhc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhhbWluZXMgdGhlIENsb3VkRm9ybWF0aW9uIHJlc291cmNlIGFuZCBkaXNjbG9zZXMgYXR0cmlidXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpbnNwZWN0b3IgLSB0cmVlIGluc3BlY3RvciB0byBjb2xsZWN0IGFuZCBwcm9jZXNzIGF0dHJpYnV0ZXNcbiAgICAgKlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnNwZWN0KGluc3BlY3RvcjogY2RrLlRyZWVJbnNwZWN0b3IpIHtcbiAgICAgICAgaW5zcGVjdG9yLmFkZEF0dHJpYnV0ZShcImF3czpjZGs6Y2xvdWRmb3JtYXRpb246dHlwZVwiLCBDZm5TbGFja0NoYW5uZWxDb25maWd1cmF0aW9uLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjaGFubmVsSWQ6IHRoaXMuY2hhbm5lbElkLFxuICAgICAgICAgICAgY2hhbm5lbFJvbGVBcm46IHRoaXMuY2hhbm5lbFJvbGVBcm4sXG4gICAgICAgICAgICBub3RpZnlPbkNhc2VTZXZlcml0eTogdGhpcy5ub3RpZnlPbkNhc2VTZXZlcml0eSxcbiAgICAgICAgICAgIHRlYW1JZDogdGhpcy50ZWFtSWQsXG4gICAgICAgICAgICBjaGFubmVsTmFtZTogdGhpcy5jaGFubmVsTmFtZSxcbiAgICAgICAgICAgIG5vdGlmeU9uQWRkQ29ycmVzcG9uZGVuY2VUb0Nhc2U6IHRoaXMubm90aWZ5T25BZGRDb3JyZXNwb25kZW5jZVRvQ2FzZSxcbiAgICAgICAgICAgIG5vdGlmeU9uQ3JlYXRlT3JSZW9wZW5DYXNlOiB0aGlzLm5vdGlmeU9uQ3JlYXRlT3JSZW9wZW5DYXNlLFxuICAgICAgICAgICAgbm90aWZ5T25SZXNvbHZlQ2FzZTogdGhpcy5ub3RpZnlPblJlc29sdmVDYXNlLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByb3RlY3RlZCByZW5kZXJQcm9wZXJ0aWVzKHByb3BzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gIHtcbiAgICAgICAgcmV0dXJuIGNmblNsYWNrQ2hhbm5lbENvbmZpZ3VyYXRpb25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBkZWZpbmluZyBhIGBDZm5TbGFja1dvcmtzcGFjZUNvbmZpZ3VyYXRpb25gXG4gKlxuICogQHN0cnVjdFxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXN1cHBvcnRhcHAtc2xhY2t3b3Jrc3BhY2Vjb25maWd1cmF0aW9uLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDZm5TbGFja1dvcmtzcGFjZUNvbmZpZ3VyYXRpb25Qcm9wcyB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdGVhbSBJRCBpbiBTbGFjay4gVGhpcyBJRCB1bmlxdWVseSBpZGVudGlmaWVzIGEgU2xhY2sgd29ya3NwYWNlLCBzdWNoIGFzIGBUMDEyQUJDREVGR2AgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc3VwcG9ydGFwcC1zbGFja3dvcmtzcGFjZWNvbmZpZ3VyYXRpb24uaHRtbCNjZm4tc3VwcG9ydGFwcC1zbGFja3dvcmtzcGFjZWNvbmZpZ3VyYXRpb24tdGVhbWlkXG4gICAgICovXG4gICAgcmVhZG9ubHkgdGVhbUlkOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBbiBpZGVudGlmaWVyIHVzZWQgdG8gdXBkYXRlIGFuIGV4aXN0aW5nIFNsYWNrIHdvcmtzcGFjZSBjb25maWd1cmF0aW9uIGluIEFXUyBDbG91ZEZvcm1hdGlvbiAsIHN1Y2ggYXMgYDEwMGAgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc3VwcG9ydGFwcC1zbGFja3dvcmtzcGFjZWNvbmZpZ3VyYXRpb24uaHRtbCNjZm4tc3VwcG9ydGFwcC1zbGFja3dvcmtzcGFjZWNvbmZpZ3VyYXRpb24tdmVyc2lvbmlkXG4gICAgICovXG4gICAgcmVhZG9ubHkgdmVyc2lvbklkPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERldGVybWluZSB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG1hdGNoIHRob3NlIG9mIGEgYENmblNsYWNrV29ya3NwYWNlQ29uZmlndXJhdGlvblByb3BzYFxuICpcbiAqIEBwYXJhbSBwcm9wZXJ0aWVzIC0gdGhlIFR5cGVTY3JpcHQgcHJvcGVydGllcyBvZiBhIGBDZm5TbGFja1dvcmtzcGFjZUNvbmZpZ3VyYXRpb25Qcm9wc2BcbiAqXG4gKiBAcmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSB2YWxpZGF0aW9uLlxuICovXG5mdW5jdGlvbiBDZm5TbGFja1dvcmtzcGFjZUNvbmZpZ3VyYXRpb25Qcm9wc1ZhbGlkYXRvcihwcm9wZXJ0aWVzOiBhbnkpOiBjZGsuVmFsaWRhdGlvblJlc3VsdCB7XG4gICAgaWYgKCFjZGsuY2FuSW5zcGVjdChwcm9wZXJ0aWVzKSkgeyByZXR1cm4gY2RrLlZBTElEQVRJT05fU1VDQ0VTUzsgfVxuICAgIGNvbnN0IGVycm9ycyA9IG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdHMoKTtcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIGVycm9ycy5jb2xsZWN0KG5ldyBjZGsuVmFsaWRhdGlvblJlc3VsdCgnRXhwZWN0ZWQgYW4gb2JqZWN0LCBidXQgcmVjZWl2ZWQ6ICcgKyBKU09OLnN0cmluZ2lmeShwcm9wZXJ0aWVzKSkpO1xuICAgIH1cbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RlYW1JZCcsIGNkay5yZXF1aXJlZFZhbGlkYXRvcikocHJvcGVydGllcy50ZWFtSWQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3RlYW1JZCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy50ZWFtSWQpKTtcbiAgICBlcnJvcnMuY29sbGVjdChjZGsucHJvcGVydHlWYWxpZGF0b3IoJ3ZlcnNpb25JZCcsIGNkay52YWxpZGF0ZVN0cmluZykocHJvcGVydGllcy52ZXJzaW9uSWQpKTtcbiAgICByZXR1cm4gZXJyb3JzLndyYXAoJ3N1cHBsaWVkIHByb3BlcnRpZXMgbm90IGNvcnJlY3QgZm9yIFwiQ2ZuU2xhY2tXb3Jrc3BhY2VDb25maWd1cmF0aW9uUHJvcHNcIicpO1xufVxuXG4vKipcbiAqIFJlbmRlcnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlN1cHBvcnRBcHA6OlNsYWNrV29ya3NwYWNlQ29uZmlndXJhdGlvbmAgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gcHJvcGVydGllcyAtIHRoZSBUeXBlU2NyaXB0IHByb3BlcnRpZXMgb2YgYSBgQ2ZuU2xhY2tXb3Jrc3BhY2VDb25maWd1cmF0aW9uUHJvcHNgXG4gKlxuICogQHJldHVybnMgdGhlIEFXUyBDbG91ZEZvcm1hdGlvbiBwcm9wZXJ0aWVzIG9mIGFuIGBBV1M6OlN1cHBvcnRBcHA6OlNsYWNrV29ya3NwYWNlQ29uZmlndXJhdGlvbmAgcmVzb3VyY2UuXG4gKi9cbi8vIEB0cy1pZ25vcmUgVFM2MTMzXG5mdW5jdGlvbiBjZm5TbGFja1dvcmtzcGFjZUNvbmZpZ3VyYXRpb25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogYW55IHtcbiAgICBpZiAoIWNkay5jYW5JbnNwZWN0KHByb3BlcnRpZXMpKSB7IHJldHVybiBwcm9wZXJ0aWVzOyB9XG4gICAgQ2ZuU2xhY2tXb3Jrc3BhY2VDb25maWd1cmF0aW9uUHJvcHNWYWxpZGF0b3IocHJvcGVydGllcykuYXNzZXJ0U3VjY2VzcygpO1xuICAgIHJldHVybiB7XG4gICAgICAgIFRlYW1JZDogY2RrLnN0cmluZ1RvQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllcy50ZWFtSWQpLFxuICAgICAgICBWZXJzaW9uSWQ6IGNkay5zdHJpbmdUb0Nsb3VkRm9ybWF0aW9uKHByb3BlcnRpZXMudmVyc2lvbklkKSxcbiAgICB9O1xufVxuXG4vLyBAdHMtaWdub3JlIFRTNjEzM1xuZnVuY3Rpb24gQ2ZuU2xhY2tXb3Jrc3BhY2VDb25maWd1cmF0aW9uUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocHJvcGVydGllczogYW55KTogY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvblJlc3VsdDxDZm5TbGFja1dvcmtzcGFjZUNvbmZpZ3VyYXRpb25Qcm9wcz4ge1xuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzID09IG51bGwgPyB7fSA6IHByb3BlcnRpZXM7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IGNmbl9wYXJzZS5Gcm9tQ2xvdWRGb3JtYXRpb25SZXN1bHQocHJvcGVydGllcyk7XG4gICAgfVxuICAgIGNvbnN0IHJldCA9IG5ldyBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uUHJvcGVydHlPYmplY3Q8Q2ZuU2xhY2tXb3Jrc3BhY2VDb25maWd1cmF0aW9uUHJvcHM+KCk7XG4gICAgcmV0LmFkZFByb3BlcnR5UmVzdWx0KCd0ZWFtSWQnLCAnVGVhbUlkJywgY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5UZWFtSWQpKTtcbiAgICByZXQuYWRkUHJvcGVydHlSZXN1bHQoJ3ZlcnNpb25JZCcsICdWZXJzaW9uSWQnLCBwcm9wZXJ0aWVzLlZlcnNpb25JZCAhPSBudWxsID8gY2ZuX3BhcnNlLkZyb21DbG91ZEZvcm1hdGlvbi5nZXRTdHJpbmcocHJvcGVydGllcy5WZXJzaW9uSWQpIDogdW5kZWZpbmVkKTtcbiAgICByZXQuYWRkVW5yZWNvZ25pemVkUHJvcGVydGllc0FzRXh0cmEocHJvcGVydGllcyk7XG4gICAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBBIENsb3VkRm9ybWF0aW9uIGBBV1M6OlN1cHBvcnRBcHA6OlNsYWNrV29ya3NwYWNlQ29uZmlndXJhdGlvbmBcbiAqXG4gKiBZb3UgY2FuIHVzZSB0aGUgYEFXUzo6U3VwcG9ydEFwcDo6U2xhY2tXb3Jrc3BhY2VDb25maWd1cmF0aW9uYCByZXNvdXJjZSB0byBzcGVjaWZ5IHlvdXIgU2xhY2sgd29ya3NwYWNlIGNvbmZpZ3VyYXRpb24uIFRoaXMgcmVzb3VyY2UgY29uZmlndXJlcyB5b3VyIEFXUyBhY2NvdW50IHNvIHRoYXQgeW91IGNhbiB1c2UgdGhlIHNwZWNpZmllZCBTbGFjayB3b3Jrc3BhY2UgaW4gdGhlIEFXUyBTdXBwb3J0IEFwcCAuIFRoaXMgcmVzb3VyY2UgaW5jbHVkZXMgdGhlIGZvbGxvd2luZyBpbmZvcm1hdGlvbjpcbiAqXG4gKiAtIFRoZSB0ZWFtIElEIGZvciB0aGUgU2xhY2sgd29ya3NwYWNlXG4gKiAtIFRoZSB2ZXJzaW9uIElEIG9mIHRoZSByZXNvdXJjZSB0byB1c2Ugd2l0aCBBV1MgQ2xvdWRGb3JtYXRpb25cbiAqXG4gKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIHRoZSBmb2xsb3dpbmcgdG9waWNzIGluIHRoZSAqQVdTIFN1cHBvcnQgVXNlciBHdWlkZSogOlxuICpcbiAqIC0gW0FXUyBTdXBwb3J0IEFwcCBpbiBTbGFja10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2F3c3N1cHBvcnQvbGF0ZXN0L3VzZXIvYXdzLXN1cHBvcnQtYXBwLWZvci1zbGFjay5odG1sKVxuICogLSBbQ3JlYXRpbmcgQVdTIFN1cHBvcnQgQXBwIGluIFNsYWNrIHJlc291cmNlcyB3aXRoIEFXUyBDbG91ZEZvcm1hdGlvbl0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2F3c3N1cHBvcnQvbGF0ZXN0L3VzZXIvY3JlYXRpbmctcmVzb3VyY2VzLXdpdGgtY2xvdWRmb3JtYXRpb24uaHRtbClcbiAqXG4gKiBAY2xvdWRmb3JtYXRpb25SZXNvdXJjZSBBV1M6OlN1cHBvcnRBcHA6OlNsYWNrV29ya3NwYWNlQ29uZmlndXJhdGlvblxuICogQHN0YWJpbGl0eSBleHRlcm5hbFxuICpcbiAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXN1cHBvcnRhcHAtc2xhY2t3b3Jrc3BhY2Vjb25maWd1cmF0aW9uLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIENmblNsYWNrV29ya3NwYWNlQ29uZmlndXJhdGlvbiBleHRlbmRzIGNkay5DZm5SZXNvdXJjZSBpbXBsZW1lbnRzIGNkay5JSW5zcGVjdGFibGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSB0eXBlIG5hbWUgZm9yIHRoaXMgcmVzb3VyY2UgY2xhc3MuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBDRk5fUkVTT1VSQ0VfVFlQRV9OQU1FID0gXCJBV1M6OlN1cHBvcnRBcHA6OlNsYWNrV29ya3NwYWNlQ29uZmlndXJhdGlvblwiO1xuXG4gICAgLyoqXG4gICAgICogQSBmYWN0b3J5IG1ldGhvZCB0aGF0IGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmcm9tIGFuIG9iamVjdFxuICAgICAqIGNvbnRhaW5pbmcgdGhlIENsb3VkRm9ybWF0aW9uIHByb3BlcnRpZXMgb2YgdGhpcyByZXNvdXJjZS5cbiAgICAgKiBVc2VkIGluIHRoZSBAYXdzLWNkay9jbG91ZGZvcm1hdGlvbi1pbmNsdWRlIG1vZHVsZS5cbiAgICAgKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgX2Zyb21DbG91ZEZvcm1hdGlvbihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHJlc291cmNlQXR0cmlidXRlczogYW55LCBvcHRpb25zOiBjZm5fcGFyc2UuRnJvbUNsb3VkRm9ybWF0aW9uT3B0aW9ucyk6IENmblNsYWNrV29ya3NwYWNlQ29uZmlndXJhdGlvbiB7XG4gICAgICAgIHJlc291cmNlQXR0cmlidXRlcyA9IHJlc291cmNlQXR0cmlidXRlcyB8fCB7fTtcbiAgICAgICAgY29uc3QgcmVzb3VyY2VQcm9wZXJ0aWVzID0gb3B0aW9ucy5wYXJzZXIucGFyc2VWYWx1ZShyZXNvdXJjZUF0dHJpYnV0ZXMuUHJvcGVydGllcyk7XG4gICAgICAgIGNvbnN0IHByb3BzUmVzdWx0ID0gQ2ZuU2xhY2tXb3Jrc3BhY2VDb25maWd1cmF0aW9uUHJvcHNGcm9tQ2xvdWRGb3JtYXRpb24ocmVzb3VyY2VQcm9wZXJ0aWVzKTtcbiAgICAgICAgY29uc3QgcmV0ID0gbmV3IENmblNsYWNrV29ya3NwYWNlQ29uZmlndXJhdGlvbihzY29wZSwgaWQsIHByb3BzUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgZm9yIChjb25zdCBbcHJvcEtleSwgcHJvcFZhbF0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHNSZXN1bHQuZXh0cmFQcm9wZXJ0aWVzKSkgIHtcbiAgICAgICAgICAgIHJldC5hZGRQcm9wZXJ0eU92ZXJyaWRlKHByb3BLZXksIHByb3BWYWwpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucGFyc2VyLmhhbmRsZUF0dHJpYnV0ZXMocmV0LCByZXNvdXJjZUF0dHJpYnV0ZXMsIGlkKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdGVhbSBJRCBpbiBTbGFjay4gVGhpcyBJRCB1bmlxdWVseSBpZGVudGlmaWVzIGEgU2xhY2sgd29ya3NwYWNlLCBzdWNoIGFzIGBUMDEyQUJDREVGR2AgLlxuICAgICAqXG4gICAgICogQGxpbmsgaHR0cDovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2Utc3VwcG9ydGFwcC1zbGFja3dvcmtzcGFjZWNvbmZpZ3VyYXRpb24uaHRtbCNjZm4tc3VwcG9ydGFwcC1zbGFja3dvcmtzcGFjZWNvbmZpZ3VyYXRpb24tdGVhbWlkXG4gICAgICovXG4gICAgcHVibGljIHRlYW1JZDogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQW4gaWRlbnRpZmllciB1c2VkIHRvIHVwZGF0ZSBhbiBleGlzdGluZyBTbGFjayB3b3Jrc3BhY2UgY29uZmlndXJhdGlvbiBpbiBBV1MgQ2xvdWRGb3JtYXRpb24gLCBzdWNoIGFzIGAxMDBgIC5cbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHA6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLXN1cHBvcnRhcHAtc2xhY2t3b3Jrc3BhY2Vjb25maWd1cmF0aW9uLmh0bWwjY2ZuLXN1cHBvcnRhcHAtc2xhY2t3b3Jrc3BhY2Vjb25maWd1cmF0aW9uLXZlcnNpb25pZFxuICAgICAqL1xuICAgIHB1YmxpYyB2ZXJzaW9uSWQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQVdTOjpTdXBwb3J0QXBwOjpTbGFja1dvcmtzcGFjZUNvbmZpZ3VyYXRpb25gLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjb3BlIC0gc2NvcGUgaW4gd2hpY2ggdGhpcyByZXNvdXJjZSBpcyBkZWZpbmVkXG4gICAgICogQHBhcmFtIGlkICAgIC0gc2NvcGVkIGlkIG9mIHRoZSByZXNvdXJjZVxuICAgICAqIEBwYXJhbSBwcm9wcyAtIHJlc291cmNlIHByb3BlcnRpZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDZm5TbGFja1dvcmtzcGFjZUNvbmZpZ3VyYXRpb25Qcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHsgdHlwZTogQ2ZuU2xhY2tXb3Jrc3BhY2VDb25maWd1cmF0aW9uLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHByb3BlcnRpZXM6IHByb3BzIH0pO1xuICAgICAgICBjZGsucmVxdWlyZVByb3BlcnR5KHByb3BzLCAndGVhbUlkJywgdGhpcyk7XG5cbiAgICAgICAgdGhpcy50ZWFtSWQgPSBwcm9wcy50ZWFtSWQ7XG4gICAgICAgIHRoaXMudmVyc2lvbklkID0gcHJvcHMudmVyc2lvbklkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4YW1pbmVzIHRoZSBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZSBhbmQgZGlzY2xvc2VzIGF0dHJpYnV0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW5zcGVjdG9yIC0gdHJlZSBpbnNwZWN0b3IgdG8gY29sbGVjdCBhbmQgcHJvY2VzcyBhdHRyaWJ1dGVzXG4gICAgICpcbiAgICAgKi9cbiAgICBwdWJsaWMgaW5zcGVjdChpbnNwZWN0b3I6IGNkay5UcmVlSW5zcGVjdG9yKSB7XG4gICAgICAgIGluc3BlY3Rvci5hZGRBdHRyaWJ1dGUoXCJhd3M6Y2RrOmNsb3VkZm9ybWF0aW9uOnR5cGVcIiwgQ2ZuU2xhY2tXb3Jrc3BhY2VDb25maWd1cmF0aW9uLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUpO1xuICAgICAgICBpbnNwZWN0b3IuYWRkQXR0cmlidXRlKFwiYXdzOmNkazpjbG91ZGZvcm1hdGlvbjpwcm9wc1wiLCB0aGlzLmNmblByb3BlcnRpZXMpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgY2ZuUHJvcGVydGllcygpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0ZWFtSWQ6IHRoaXMudGVhbUlkLFxuICAgICAgICAgICAgdmVyc2lvbklkOiB0aGlzLnZlcnNpb25JZCxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvcGVydGllcyhwcm9wczoge1trZXk6IHN0cmluZ106IGFueX0pOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ICB7XG4gICAgICAgIHJldHVybiBjZm5TbGFja1dvcmtzcGFjZUNvbmZpZ3VyYXRpb25Qcm9wc1RvQ2xvdWRGb3JtYXRpb24ocHJvcHMpO1xuICAgIH1cbn1cbiJdfQ==