/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::Chatbot::MicrosoftTeamsChannelConfiguration` resource configures a Microsoft Teams channel to allow users to use AWS Chatbot with AWS CloudFormation templates.
 *
 * This resource requires some setup to be done in the AWS Chatbot console. To provide the required Microsoft Teams team and tenant IDs, you must perform the initial authorization flow with Microsoft Teams in the AWS Chatbot console, then copy and paste the IDs from the console. For more details, see steps 1-4 in [Setting Up AWS Chatbot with Microsoft Teams](https://docs.aws.amazon.com/chatbot/latest/adminguide/teams-setup.html#teams-client-setup) in the *AWS Chatbot Administrator Guide* .
 *
 * @cloudformationResource AWS::Chatbot::MicrosoftTeamsChannelConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-microsoftteamschannelconfiguration.html
 */
export class CfnMicrosoftTeamsChannelConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Chatbot::MicrosoftTeamsChannelConfiguration";

  /**
   * Build a CfnMicrosoftTeamsChannelConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMicrosoftTeamsChannelConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMicrosoftTeamsChannelConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMicrosoftTeamsChannelConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Amazon Resource Name (ARN) of the configuration
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the configuration.
   */
  public configurationName: string;

  /**
   * The list of IAM policy ARNs that are applied as channel guardrails.
   */
  public guardrailPolicies?: Array<string>;

  /**
   * The ARN of the IAM role that defines the permissions for AWS Chatbot .
   */
  public iamRoleArn: string;

  /**
   * Specifies the logging level for this configuration. This property affects the log entries pushed to Amazon CloudWatch Logs.
   */
  public loggingLevel?: string;

  /**
   * The ARNs of the SNS topics that deliver notifications to AWS Chatbot .
   */
  public snsTopicArns?: Array<string>;

  /**
   * The ID of the Microsoft Team authorized with AWS Chatbot .
   */
  public teamId: string;

  /**
   * The id of the Microsoft Teams channel.
   */
  public teamsChannelId: string;

  /**
   * The ID of the Microsoft Teams tenant.
   */
  public teamsTenantId: string;

  /**
   * Enables use of a user role requirement in your chat configuration.
   */
  public userRoleRequired?: boolean | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMicrosoftTeamsChannelConfigurationProps) {
    super(scope, id, {
      "type": CfnMicrosoftTeamsChannelConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "configurationName", this);
    cdk.requireProperty(props, "iamRoleArn", this);
    cdk.requireProperty(props, "teamId", this);
    cdk.requireProperty(props, "teamsChannelId", this);
    cdk.requireProperty(props, "teamsTenantId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.configurationName = props.configurationName;
    this.guardrailPolicies = props.guardrailPolicies;
    this.iamRoleArn = props.iamRoleArn;
    this.loggingLevel = props.loggingLevel;
    this.snsTopicArns = props.snsTopicArns;
    this.teamId = props.teamId;
    this.teamsChannelId = props.teamsChannelId;
    this.teamsTenantId = props.teamsTenantId;
    this.userRoleRequired = props.userRoleRequired;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "configurationName": this.configurationName,
      "guardrailPolicies": this.guardrailPolicies,
      "iamRoleArn": this.iamRoleArn,
      "loggingLevel": this.loggingLevel,
      "snsTopicArns": this.snsTopicArns,
      "teamId": this.teamId,
      "teamsChannelId": this.teamsChannelId,
      "teamsTenantId": this.teamsTenantId,
      "userRoleRequired": this.userRoleRequired
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMicrosoftTeamsChannelConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMicrosoftTeamsChannelConfigurationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnMicrosoftTeamsChannelConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-microsoftteamschannelconfiguration.html
 */
export interface CfnMicrosoftTeamsChannelConfigurationProps {
  /**
   * The name of the configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-microsoftteamschannelconfiguration.html#cfn-chatbot-microsoftteamschannelconfiguration-configurationname
   */
  readonly configurationName: string;

  /**
   * The list of IAM policy ARNs that are applied as channel guardrails.
   *
   * The AWS managed 'AdministratorAccess' policy is applied as a default if this is not set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-microsoftteamschannelconfiguration.html#cfn-chatbot-microsoftteamschannelconfiguration-guardrailpolicies
   */
  readonly guardrailPolicies?: Array<string>;

  /**
   * The ARN of the IAM role that defines the permissions for AWS Chatbot .
   *
   * This is a user-defined role that AWS Chatbot will assume. This is not the service-linked role. For more information, see [IAM Policies for AWS Chatbot](https://docs.aws.amazon.com/chatbot/latest/adminguide/chatbot-iam-policies.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-microsoftteamschannelconfiguration.html#cfn-chatbot-microsoftteamschannelconfiguration-iamrolearn
   */
  readonly iamRoleArn: string;

  /**
   * Specifies the logging level for this configuration. This property affects the log entries pushed to Amazon CloudWatch Logs.
   *
   * Logging levels include `ERROR` , `INFO` , or `NONE` .
   *
   * @default - "NONE"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-microsoftteamschannelconfiguration.html#cfn-chatbot-microsoftteamschannelconfiguration-logginglevel
   */
  readonly loggingLevel?: string;

  /**
   * The ARNs of the SNS topics that deliver notifications to AWS Chatbot .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-microsoftteamschannelconfiguration.html#cfn-chatbot-microsoftteamschannelconfiguration-snstopicarns
   */
  readonly snsTopicArns?: Array<string>;

  /**
   * The ID of the Microsoft Team authorized with AWS Chatbot .
   *
   * To get the team ID, you must perform the initial authorization flow with Microsoft Teams in the AWS Chatbot console. Then you can copy and paste the team ID from the console. For more details, see steps 1-4 in [Get started with Microsoft Teams](https://docs.aws.amazon.com/chatbot/latest/adminguide/teams-setup.html#teams-client-setup) in the *AWS Chatbot Administrator Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-microsoftteamschannelconfiguration.html#cfn-chatbot-microsoftteamschannelconfiguration-teamid
   */
  readonly teamId: string;

  /**
   * The id of the Microsoft Teams channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-microsoftteamschannelconfiguration.html#cfn-chatbot-microsoftteamschannelconfiguration-teamschannelid
   */
  readonly teamsChannelId: string;

  /**
   * The ID of the Microsoft Teams tenant.
   *
   * To get the tenant ID, you must perform the initial authorization flow with Microsoft Teams in the AWS Chatbot console. Then you can copy and paste the tenant ID from the console. For more details, see steps 1-4 in [Get started with Microsoft Teams](https://docs.aws.amazon.com/chatbot/latest/adminguide/teams-setup.html#teams-client-setup) in the *AWS Chatbot Administrator Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-microsoftteamschannelconfiguration.html#cfn-chatbot-microsoftteamschannelconfiguration-teamstenantid
   */
  readonly teamsTenantId: string;

  /**
   * Enables use of a user role requirement in your chat configuration.
   *
   * @default - false
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-microsoftteamschannelconfiguration.html#cfn-chatbot-microsoftteamschannelconfiguration-userrolerequired
   */
  readonly userRoleRequired?: boolean | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnMicrosoftTeamsChannelConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnMicrosoftTeamsChannelConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMicrosoftTeamsChannelConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configurationName", cdk.requiredValidator)(properties.configurationName));
  errors.collect(cdk.propertyValidator("configurationName", cdk.validateString)(properties.configurationName));
  errors.collect(cdk.propertyValidator("guardrailPolicies", cdk.listValidator(cdk.validateString))(properties.guardrailPolicies));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.requiredValidator)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.validateString)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("loggingLevel", cdk.validateString)(properties.loggingLevel));
  errors.collect(cdk.propertyValidator("snsTopicArns", cdk.listValidator(cdk.validateString))(properties.snsTopicArns));
  errors.collect(cdk.propertyValidator("teamId", cdk.requiredValidator)(properties.teamId));
  errors.collect(cdk.propertyValidator("teamId", cdk.validateString)(properties.teamId));
  errors.collect(cdk.propertyValidator("teamsChannelId", cdk.requiredValidator)(properties.teamsChannelId));
  errors.collect(cdk.propertyValidator("teamsChannelId", cdk.validateString)(properties.teamsChannelId));
  errors.collect(cdk.propertyValidator("teamsTenantId", cdk.requiredValidator)(properties.teamsTenantId));
  errors.collect(cdk.propertyValidator("teamsTenantId", cdk.validateString)(properties.teamsTenantId));
  errors.collect(cdk.propertyValidator("userRoleRequired", cdk.validateBoolean)(properties.userRoleRequired));
  return errors.wrap("supplied properties not correct for \"CfnMicrosoftTeamsChannelConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnMicrosoftTeamsChannelConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMicrosoftTeamsChannelConfigurationPropsValidator(properties).assertSuccess();
  return {
    "ConfigurationName": cdk.stringToCloudFormation(properties.configurationName),
    "GuardrailPolicies": cdk.listMapper(cdk.stringToCloudFormation)(properties.guardrailPolicies),
    "IamRoleArn": cdk.stringToCloudFormation(properties.iamRoleArn),
    "LoggingLevel": cdk.stringToCloudFormation(properties.loggingLevel),
    "SnsTopicArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.snsTopicArns),
    "TeamId": cdk.stringToCloudFormation(properties.teamId),
    "TeamsChannelId": cdk.stringToCloudFormation(properties.teamsChannelId),
    "TeamsTenantId": cdk.stringToCloudFormation(properties.teamsTenantId),
    "UserRoleRequired": cdk.booleanToCloudFormation(properties.userRoleRequired)
  };
}

// @ts-ignore TS6133
function CfnMicrosoftTeamsChannelConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMicrosoftTeamsChannelConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMicrosoftTeamsChannelConfigurationProps>();
  ret.addPropertyResult("configurationName", "ConfigurationName", (properties.ConfigurationName != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationName) : undefined));
  ret.addPropertyResult("guardrailPolicies", "GuardrailPolicies", (properties.GuardrailPolicies != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.GuardrailPolicies) : undefined));
  ret.addPropertyResult("iamRoleArn", "IamRoleArn", (properties.IamRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.IamRoleArn) : undefined));
  ret.addPropertyResult("loggingLevel", "LoggingLevel", (properties.LoggingLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingLevel) : undefined));
  ret.addPropertyResult("snsTopicArns", "SnsTopicArns", (properties.SnsTopicArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SnsTopicArns) : undefined));
  ret.addPropertyResult("teamId", "TeamId", (properties.TeamId != null ? cfn_parse.FromCloudFormation.getString(properties.TeamId) : undefined));
  ret.addPropertyResult("teamsChannelId", "TeamsChannelId", (properties.TeamsChannelId != null ? cfn_parse.FromCloudFormation.getString(properties.TeamsChannelId) : undefined));
  ret.addPropertyResult("teamsTenantId", "TeamsTenantId", (properties.TeamsTenantId != null ? cfn_parse.FromCloudFormation.getString(properties.TeamsTenantId) : undefined));
  ret.addPropertyResult("userRoleRequired", "UserRoleRequired", (properties.UserRoleRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UserRoleRequired) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Chatbot::SlackChannelConfiguration` resource configures a Slack channel to allow users to use AWS Chatbot with AWS CloudFormation templates.
 *
 * This resource requires some setup to be done in the AWS Chatbot console. To provide the required Slack workspace ID, you must perform the initial authorization flow with Slack in the AWS Chatbot console, then copy and paste the workspace ID from the console. For more details, see steps 1-4 in [Setting Up AWS Chatbot with Slack](https://docs.aws.amazon.com/chatbot/latest/adminguide/setting-up.html#Setup_intro) in the *AWS Chatbot User Guide* .
 *
 * @cloudformationResource AWS::Chatbot::SlackChannelConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html
 */
export class CfnSlackChannelConfiguration extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Chatbot::SlackChannelConfiguration";

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
   * Amazon Resource Name (ARN) of the configuration
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the configuration.
   */
  public configurationName: string;

  /**
   * The list of IAM policy ARNs that are applied as channel guardrails.
   */
  public guardrailPolicies?: Array<string>;

  /**
   * The ARN of the IAM role that defines the permissions for AWS Chatbot .
   */
  public iamRoleArn: string;

  /**
   * Specifies the logging level for this configuration. This property affects the log entries pushed to Amazon CloudWatch Logs.
   */
  public loggingLevel?: string;

  /**
   * The ID of the Slack channel.
   */
  public slackChannelId: string;

  /**
   * The ID of the Slack workspace authorized with AWS Chatbot .
   */
  public slackWorkspaceId: string;

  /**
   * The ARNs of the SNS topics that deliver notifications to AWS Chatbot .
   */
  public snsTopicArns?: Array<string>;

  /**
   * Enables use of a user role requirement in your chat configuration.
   */
  public userRoleRequired?: boolean | cdk.IResolvable;

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

    cdk.requireProperty(props, "configurationName", this);
    cdk.requireProperty(props, "iamRoleArn", this);
    cdk.requireProperty(props, "slackChannelId", this);
    cdk.requireProperty(props, "slackWorkspaceId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.configurationName = props.configurationName;
    this.guardrailPolicies = props.guardrailPolicies;
    this.iamRoleArn = props.iamRoleArn;
    this.loggingLevel = props.loggingLevel;
    this.slackChannelId = props.slackChannelId;
    this.slackWorkspaceId = props.slackWorkspaceId;
    this.snsTopicArns = props.snsTopicArns;
    this.userRoleRequired = props.userRoleRequired;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "configurationName": this.configurationName,
      "guardrailPolicies": this.guardrailPolicies,
      "iamRoleArn": this.iamRoleArn,
      "loggingLevel": this.loggingLevel,
      "slackChannelId": this.slackChannelId,
      "slackWorkspaceId": this.slackWorkspaceId,
      "snsTopicArns": this.snsTopicArns,
      "userRoleRequired": this.userRoleRequired
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
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html
 */
export interface CfnSlackChannelConfigurationProps {
  /**
   * The name of the configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-configurationname
   */
  readonly configurationName: string;

  /**
   * The list of IAM policy ARNs that are applied as channel guardrails.
   *
   * The AWS managed 'AdministratorAccess' policy is applied as a default if this is not set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-guardrailpolicies
   */
  readonly guardrailPolicies?: Array<string>;

  /**
   * The ARN of the IAM role that defines the permissions for AWS Chatbot .
   *
   * This is a user-defined role that AWS Chatbot will assume. This is not the service-linked role. For more information, see [IAM Policies for AWS Chatbot](https://docs.aws.amazon.com/chatbot/latest/adminguide/chatbot-iam-policies.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-iamrolearn
   */
  readonly iamRoleArn: string;

  /**
   * Specifies the logging level for this configuration. This property affects the log entries pushed to Amazon CloudWatch Logs.
   *
   * Logging levels include `ERROR` , `INFO` , or `NONE` .
   *
   * @default - "NONE"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-logginglevel
   */
  readonly loggingLevel?: string;

  /**
   * The ID of the Slack channel.
   *
   * To get the ID, open Slack, right click on the channel name in the left pane, then choose Copy Link. The channel ID is the 9-character string at the end of the URL. For example, `ABCBBLZZZ` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-slackchannelid
   */
  readonly slackChannelId: string;

  /**
   * The ID of the Slack workspace authorized with AWS Chatbot .
   *
   * To get the workspace ID, you must perform the initial authorization flow with Slack in the AWS Chatbot console. Then you can copy and paste the workspace ID from the console. For more details, see steps 1-4 in [Setting Up AWS Chatbot with Slack](https://docs.aws.amazon.com/chatbot/latest/adminguide/setting-up.html#Setup_intro) in the *AWS Chatbot User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-slackworkspaceid
   */
  readonly slackWorkspaceId: string;

  /**
   * The ARNs of the SNS topics that deliver notifications to AWS Chatbot .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-snstopicarns
   */
  readonly snsTopicArns?: Array<string>;

  /**
   * Enables use of a user role requirement in your chat configuration.
   *
   * @default - false
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-chatbot-slackchannelconfiguration.html#cfn-chatbot-slackchannelconfiguration-userrolerequired
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
// @ts-ignore TS6133
function CfnSlackChannelConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configurationName", cdk.requiredValidator)(properties.configurationName));
  errors.collect(cdk.propertyValidator("configurationName", cdk.validateString)(properties.configurationName));
  errors.collect(cdk.propertyValidator("guardrailPolicies", cdk.listValidator(cdk.validateString))(properties.guardrailPolicies));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.requiredValidator)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.validateString)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("loggingLevel", cdk.validateString)(properties.loggingLevel));
  errors.collect(cdk.propertyValidator("slackChannelId", cdk.requiredValidator)(properties.slackChannelId));
  errors.collect(cdk.propertyValidator("slackChannelId", cdk.validateString)(properties.slackChannelId));
  errors.collect(cdk.propertyValidator("slackWorkspaceId", cdk.requiredValidator)(properties.slackWorkspaceId));
  errors.collect(cdk.propertyValidator("slackWorkspaceId", cdk.validateString)(properties.slackWorkspaceId));
  errors.collect(cdk.propertyValidator("snsTopicArns", cdk.listValidator(cdk.validateString))(properties.snsTopicArns));
  errors.collect(cdk.propertyValidator("userRoleRequired", cdk.validateBoolean)(properties.userRoleRequired));
  return errors.wrap("supplied properties not correct for \"CfnSlackChannelConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnSlackChannelConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSlackChannelConfigurationPropsValidator(properties).assertSuccess();
  return {
    "ConfigurationName": cdk.stringToCloudFormation(properties.configurationName),
    "GuardrailPolicies": cdk.listMapper(cdk.stringToCloudFormation)(properties.guardrailPolicies),
    "IamRoleArn": cdk.stringToCloudFormation(properties.iamRoleArn),
    "LoggingLevel": cdk.stringToCloudFormation(properties.loggingLevel),
    "SlackChannelId": cdk.stringToCloudFormation(properties.slackChannelId),
    "SlackWorkspaceId": cdk.stringToCloudFormation(properties.slackWorkspaceId),
    "SnsTopicArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.snsTopicArns),
    "UserRoleRequired": cdk.booleanToCloudFormation(properties.userRoleRequired)
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
  ret.addPropertyResult("configurationName", "ConfigurationName", (properties.ConfigurationName != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationName) : undefined));
  ret.addPropertyResult("guardrailPolicies", "GuardrailPolicies", (properties.GuardrailPolicies != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.GuardrailPolicies) : undefined));
  ret.addPropertyResult("iamRoleArn", "IamRoleArn", (properties.IamRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.IamRoleArn) : undefined));
  ret.addPropertyResult("loggingLevel", "LoggingLevel", (properties.LoggingLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingLevel) : undefined));
  ret.addPropertyResult("slackChannelId", "SlackChannelId", (properties.SlackChannelId != null ? cfn_parse.FromCloudFormation.getString(properties.SlackChannelId) : undefined));
  ret.addPropertyResult("slackWorkspaceId", "SlackWorkspaceId", (properties.SlackWorkspaceId != null ? cfn_parse.FromCloudFormation.getString(properties.SlackWorkspaceId) : undefined));
  ret.addPropertyResult("snsTopicArns", "SnsTopicArns", (properties.SnsTopicArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SnsTopicArns) : undefined));
  ret.addPropertyResult("userRoleRequired", "UserRoleRequired", (properties.UserRoleRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UserRoleRequired) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}