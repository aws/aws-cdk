/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * You can use the `AWS::SupportApp::AccountAlias` resource to specify your AWS account when you configure the AWS Support App in Slack.
 *
 * Your alias name appears on the AWS Support App page in the Support Center Console and in messages from the AWS Support App. You can use this alias to identify the account you've configured with the AWS Support App .
 *
 * For more information, see [AWS Support App in Slack](https://docs.aws.amazon.com/awssupport/latest/user/aws-support-app-for-slack.html) in the *AWS Support User Guide* .
 *
 * @cloudformationResource AWS::SupportApp::AccountAlias
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-accountalias.html
 */
export class CfnAccountAlias extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SupportApp::AccountAlias";

  /**
   * Build a CfnAccountAlias from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccountAlias {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAccountAliasPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAccountAlias(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The `AccountAlias` resource type has an attribute `AccountAliasResourceId` . You can use this attribute to identify the resource.
   *
   * The `AccountAliasResourceId` will be `AccountAlias_for_accountId` . In this example, `AccountAlias_for_` is the prefix and `accountId` is your AWS account number, such as `AccountAlias_for_123456789012` .
   *
   * @cloudformationAttribute AccountAliasResourceId
   */
  public readonly attrAccountAliasResourceId: string;

  /**
   * An alias or short name for an AWS account .
   */
  public accountAlias: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAccountAliasProps) {
    super(scope, id, {
      "type": CfnAccountAlias.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "accountAlias", this);

    this.attrAccountAliasResourceId = cdk.Token.asString(this.getAtt("AccountAliasResourceId", cdk.ResolutionTypeHint.STRING));
    this.accountAlias = props.accountAlias;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accountAlias": this.accountAlias
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAccountAlias.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAccountAliasPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAccountAlias`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-accountalias.html
 */
export interface CfnAccountAliasProps {
  /**
   * An alias or short name for an AWS account .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-accountalias.html#cfn-supportapp-accountalias-accountalias
   */
  readonly accountAlias: string;
}

/**
 * Determine whether the given properties match those of a `CfnAccountAliasProps`
 *
 * @param properties - the TypeScript properties of a `CfnAccountAliasProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAccountAliasPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accountAlias", cdk.requiredValidator)(properties.accountAlias));
  errors.collect(cdk.propertyValidator("accountAlias", cdk.validateString)(properties.accountAlias));
  return errors.wrap("supplied properties not correct for \"CfnAccountAliasProps\"");
}

// @ts-ignore TS6133
function convertCfnAccountAliasPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAccountAliasPropsValidator(properties).assertSuccess();
  return {
    "AccountAlias": cdk.stringToCloudFormation(properties.accountAlias)
  };
}

// @ts-ignore TS6133
function CfnAccountAliasPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAccountAliasProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAccountAliasProps>();
  ret.addPropertyResult("accountAlias", "AccountAlias", (properties.AccountAlias != null ? cfn_parse.FromCloudFormation.getString(properties.AccountAlias) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * You can use the `AWS::SupportApp::SlackChannelConfiguration` resource to specify your AWS account when you configure the AWS Support App .
 *
 * This resource includes the following information:
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html
 */
export class CfnSlackChannelConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SupportApp::SlackChannelConfiguration";

  /**
   * Build a CfnSlackChannelConfiguration from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSlackChannelConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The channel ID in Slack.
   */
  public channelId: string;

  /**
   * The channel name in Slack.
   */
  public channelName?: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role for this Slack channel configuration.
   */
  public channelRoleArn: string;

  /**
   * Whether to get notified when a correspondence is added to your support cases.
   */
  public notifyOnAddCorrespondenceToCase?: boolean | cdk.IResolvable;

  /**
   * The case severity for your support cases that you want to receive notifications.
   */
  public notifyOnCaseSeverity: string;

  /**
   * Whether to get notified when your support cases are created or reopened.
   */
  public notifyOnCreateOrReopenCase?: boolean | cdk.IResolvable;

  /**
   * Whether to get notified when your support cases are resolved.
   */
  public notifyOnResolveCase?: boolean | cdk.IResolvable;

  /**
   * The team ID in Slack.
   */
  public teamId: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSlackChannelConfigurationProps) {
    super(scope, id, {
      "type": CfnSlackChannelConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "channelId", this);
    cdk.requireProperty(props, "channelRoleArn", this);
    cdk.requireProperty(props, "notifyOnCaseSeverity", this);
    cdk.requireProperty(props, "teamId", this);

    this.channelId = props.channelId;
    this.channelName = props.channelName;
    this.channelRoleArn = props.channelRoleArn;
    this.notifyOnAddCorrespondenceToCase = props.notifyOnAddCorrespondenceToCase;
    this.notifyOnCaseSeverity = props.notifyOnCaseSeverity;
    this.notifyOnCreateOrReopenCase = props.notifyOnCreateOrReopenCase;
    this.notifyOnResolveCase = props.notifyOnResolveCase;
    this.teamId = props.teamId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "channelId": this.channelId,
      "channelName": this.channelName,
      "channelRoleArn": this.channelRoleArn,
      "notifyOnAddCorrespondenceToCase": this.notifyOnAddCorrespondenceToCase,
      "notifyOnCaseSeverity": this.notifyOnCaseSeverity,
      "notifyOnCreateOrReopenCase": this.notifyOnCreateOrReopenCase,
      "notifyOnResolveCase": this.notifyOnResolveCase,
      "teamId": this.teamId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSlackChannelConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSlackChannelConfigurationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSlackChannelConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html
 */
export interface CfnSlackChannelConfigurationProps {
  /**
   * The channel ID in Slack.
   *
   * This ID identifies a channel within a Slack workspace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-channelid
   */
  readonly channelId: string;

  /**
   * The channel name in Slack.
   *
   * This is the channel where you invite the AWS Support App .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-channelname
   */
  readonly channelName?: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role for this Slack channel configuration.
   *
   * The AWS Support App uses this role to perform AWS Support and Service Quotas actions on your behalf.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-channelrolearn
   */
  readonly channelRoleArn: string;

  /**
   * Whether to get notified when a correspondence is added to your support cases.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-notifyonaddcorrespondencetocase
   */
  readonly notifyOnAddCorrespondenceToCase?: boolean | cdk.IResolvable;

  /**
   * The case severity for your support cases that you want to receive notifications.
   *
   * You can specify `none` , `all` , or `high` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-notifyoncaseseverity
   */
  readonly notifyOnCaseSeverity: string;

  /**
   * Whether to get notified when your support cases are created or reopened.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-notifyoncreateorreopencase
   */
  readonly notifyOnCreateOrReopenCase?: boolean | cdk.IResolvable;

  /**
   * Whether to get notified when your support cases are resolved.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-notifyonresolvecase
   */
  readonly notifyOnResolveCase?: boolean | cdk.IResolvable;

  /**
   * The team ID in Slack.
   *
   * This ID uniquely identifies a Slack workspace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackchannelconfiguration.html#cfn-supportapp-slackchannelconfiguration-teamid
   */
  readonly teamId: string;
}

/**
 * Determine whether the given properties match those of a `CfnSlackChannelConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnSlackChannelConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSlackChannelConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelId", cdk.requiredValidator)(properties.channelId));
  errors.collect(cdk.propertyValidator("channelId", cdk.validateString)(properties.channelId));
  errors.collect(cdk.propertyValidator("channelName", cdk.validateString)(properties.channelName));
  errors.collect(cdk.propertyValidator("channelRoleArn", cdk.requiredValidator)(properties.channelRoleArn));
  errors.collect(cdk.propertyValidator("channelRoleArn", cdk.validateString)(properties.channelRoleArn));
  errors.collect(cdk.propertyValidator("notifyOnAddCorrespondenceToCase", cdk.validateBoolean)(properties.notifyOnAddCorrespondenceToCase));
  errors.collect(cdk.propertyValidator("notifyOnCaseSeverity", cdk.requiredValidator)(properties.notifyOnCaseSeverity));
  errors.collect(cdk.propertyValidator("notifyOnCaseSeverity", cdk.validateString)(properties.notifyOnCaseSeverity));
  errors.collect(cdk.propertyValidator("notifyOnCreateOrReopenCase", cdk.validateBoolean)(properties.notifyOnCreateOrReopenCase));
  errors.collect(cdk.propertyValidator("notifyOnResolveCase", cdk.validateBoolean)(properties.notifyOnResolveCase));
  errors.collect(cdk.propertyValidator("teamId", cdk.requiredValidator)(properties.teamId));
  errors.collect(cdk.propertyValidator("teamId", cdk.validateString)(properties.teamId));
  return errors.wrap("supplied properties not correct for \"CfnSlackChannelConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnSlackChannelConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSlackChannelConfigurationPropsValidator(properties).assertSuccess();
  return {
    "ChannelId": cdk.stringToCloudFormation(properties.channelId),
    "ChannelName": cdk.stringToCloudFormation(properties.channelName),
    "ChannelRoleArn": cdk.stringToCloudFormation(properties.channelRoleArn),
    "NotifyOnAddCorrespondenceToCase": cdk.booleanToCloudFormation(properties.notifyOnAddCorrespondenceToCase),
    "NotifyOnCaseSeverity": cdk.stringToCloudFormation(properties.notifyOnCaseSeverity),
    "NotifyOnCreateOrReopenCase": cdk.booleanToCloudFormation(properties.notifyOnCreateOrReopenCase),
    "NotifyOnResolveCase": cdk.booleanToCloudFormation(properties.notifyOnResolveCase),
    "TeamId": cdk.stringToCloudFormation(properties.teamId)
  };
}

// @ts-ignore TS6133
function CfnSlackChannelConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSlackChannelConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSlackChannelConfigurationProps>();
  ret.addPropertyResult("channelId", "ChannelId", (properties.ChannelId != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelId) : undefined));
  ret.addPropertyResult("channelName", "ChannelName", (properties.ChannelName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelName) : undefined));
  ret.addPropertyResult("channelRoleArn", "ChannelRoleArn", (properties.ChannelRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelRoleArn) : undefined));
  ret.addPropertyResult("notifyOnAddCorrespondenceToCase", "NotifyOnAddCorrespondenceToCase", (properties.NotifyOnAddCorrespondenceToCase != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NotifyOnAddCorrespondenceToCase) : undefined));
  ret.addPropertyResult("notifyOnCaseSeverity", "NotifyOnCaseSeverity", (properties.NotifyOnCaseSeverity != null ? cfn_parse.FromCloudFormation.getString(properties.NotifyOnCaseSeverity) : undefined));
  ret.addPropertyResult("notifyOnCreateOrReopenCase", "NotifyOnCreateOrReopenCase", (properties.NotifyOnCreateOrReopenCase != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NotifyOnCreateOrReopenCase) : undefined));
  ret.addPropertyResult("notifyOnResolveCase", "NotifyOnResolveCase", (properties.NotifyOnResolveCase != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NotifyOnResolveCase) : undefined));
  ret.addPropertyResult("teamId", "TeamId", (properties.TeamId != null ? cfn_parse.FromCloudFormation.getString(properties.TeamId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * You can use the `AWS::SupportApp::SlackWorkspaceConfiguration` resource to specify your Slack workspace configuration.
 *
 * This resource configures your AWS account so that you can use the specified Slack workspace in the AWS Support App . This resource includes the following information:
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackworkspaceconfiguration.html
 */
export class CfnSlackWorkspaceConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SupportApp::SlackWorkspaceConfiguration";

  /**
   * Build a CfnSlackWorkspaceConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSlackWorkspaceConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSlackWorkspaceConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSlackWorkspaceConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The team ID in Slack.
   */
  public teamId: string;

  /**
   * An identifier used to update an existing Slack workspace configuration in AWS CloudFormation , such as `100` .
   */
  public versionId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSlackWorkspaceConfigurationProps) {
    super(scope, id, {
      "type": CfnSlackWorkspaceConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "teamId", this);

    this.teamId = props.teamId;
    this.versionId = props.versionId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "teamId": this.teamId,
      "versionId": this.versionId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSlackWorkspaceConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSlackWorkspaceConfigurationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSlackWorkspaceConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackworkspaceconfiguration.html
 */
export interface CfnSlackWorkspaceConfigurationProps {
  /**
   * The team ID in Slack.
   *
   * This ID uniquely identifies a Slack workspace, such as `T012ABCDEFG` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackworkspaceconfiguration.html#cfn-supportapp-slackworkspaceconfiguration-teamid
   */
  readonly teamId: string;

  /**
   * An identifier used to update an existing Slack workspace configuration in AWS CloudFormation , such as `100` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-supportapp-slackworkspaceconfiguration.html#cfn-supportapp-slackworkspaceconfiguration-versionid
   */
  readonly versionId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSlackWorkspaceConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnSlackWorkspaceConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSlackWorkspaceConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("teamId", cdk.requiredValidator)(properties.teamId));
  errors.collect(cdk.propertyValidator("teamId", cdk.validateString)(properties.teamId));
  errors.collect(cdk.propertyValidator("versionId", cdk.validateString)(properties.versionId));
  return errors.wrap("supplied properties not correct for \"CfnSlackWorkspaceConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnSlackWorkspaceConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSlackWorkspaceConfigurationPropsValidator(properties).assertSuccess();
  return {
    "TeamId": cdk.stringToCloudFormation(properties.teamId),
    "VersionId": cdk.stringToCloudFormation(properties.versionId)
  };
}

// @ts-ignore TS6133
function CfnSlackWorkspaceConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSlackWorkspaceConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSlackWorkspaceConfigurationProps>();
  ret.addPropertyResult("teamId", "TeamId", (properties.TeamId != null ? cfn_parse.FromCloudFormation.getString(properties.TeamId) : undefined));
  ret.addPropertyResult("versionId", "VersionId", (properties.VersionId != null ? cfn_parse.FromCloudFormation.getString(properties.VersionId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}