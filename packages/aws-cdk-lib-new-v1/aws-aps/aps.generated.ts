/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::APS::RuleGroupsNamespace` resource creates or updates a rule groups namespace within a Amazon Managed Service for Prometheus workspace.
 *
 * For more information, see [Recording rules and alerting rules](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-Ruler.html) .
 *
 * @cloudformationResource AWS::APS::RuleGroupsNamespace
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html
 */
export class CfnRuleGroupsNamespace extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::APS::RuleGroupsNamespace";

  /**
   * Build a CfnRuleGroupsNamespace from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRuleGroupsNamespace {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRuleGroupsNamespacePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRuleGroupsNamespace(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the rules group namespace. For example, `arn:aws:aps:us-west-2:123456789012:rulegroupsnamespace/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f/amp=rules`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The rules definition file for this namespace.
   */
  public data: string;

  /**
   * The name of the rule groups namespace.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of key and value pairs for the workspace resources.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The ARN of the workspace that contains this rule groups namespace.
   */
  public workspace: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRuleGroupsNamespaceProps) {
    super(scope, id, {
      "type": CfnRuleGroupsNamespace.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "data", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "workspace", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.data = props.data;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::APS::RuleGroupsNamespace", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.workspace = props.workspace;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "data": this.data,
      "name": this.name,
      "tags": this.tags.renderTags(),
      "workspace": this.workspace
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRuleGroupsNamespace.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRuleGroupsNamespacePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRuleGroupsNamespace`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html
 */
export interface CfnRuleGroupsNamespaceProps {
  /**
   * The rules definition file for this namespace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-data
   */
  readonly data: string;

  /**
   * The name of the rule groups namespace.
   *
   * This property is required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-name
   */
  readonly name: string;

  /**
   * A list of key and value pairs for the workspace resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The ARN of the workspace that contains this rule groups namespace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-rulegroupsnamespace.html#cfn-aps-rulegroupsnamespace-workspace
   */
  readonly workspace: string;
}

/**
 * Determine whether the given properties match those of a `CfnRuleGroupsNamespaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnRuleGroupsNamespaceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleGroupsNamespacePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("data", cdk.requiredValidator)(properties.data));
  errors.collect(cdk.propertyValidator("data", cdk.validateString)(properties.data));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("workspace", cdk.requiredValidator)(properties.workspace));
  errors.collect(cdk.propertyValidator("workspace", cdk.validateString)(properties.workspace));
  return errors.wrap("supplied properties not correct for \"CfnRuleGroupsNamespaceProps\"");
}

// @ts-ignore TS6133
function convertCfnRuleGroupsNamespacePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleGroupsNamespacePropsValidator(properties).assertSuccess();
  return {
    "Data": cdk.stringToCloudFormation(properties.data),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Workspace": cdk.stringToCloudFormation(properties.workspace)
  };
}

// @ts-ignore TS6133
function CfnRuleGroupsNamespacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleGroupsNamespaceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleGroupsNamespaceProps>();
  ret.addPropertyResult("data", "Data", (properties.Data != null ? cfn_parse.FromCloudFormation.getString(properties.Data) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("workspace", "Workspace", (properties.Workspace != null ? cfn_parse.FromCloudFormation.getString(properties.Workspace) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::APS::Workspace` type specifies an Amazon Managed Service for Prometheus ( Amazon Managed Service for Prometheus ) workspace.
 *
 * A *workspace* is a logical and isolated Prometheus server dedicated to Prometheus resources such as metrics. You can have one or more workspaces in each Region in your account.
 *
 * @cloudformationResource AWS::APS::Workspace
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html
 */
export class CfnWorkspace extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::APS::Workspace";

  /**
   * Build a CfnWorkspace from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkspace {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWorkspacePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWorkspace(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the workspace. For example: `arn:aws:aps:us-west-2:123456789012:workspace/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The Prometheus endpoint attribute of the workspace. This is the endpoint prefix without the remote_write or query API appended. For example: `https://aps-workspaces.us-west-2.amazonaws.com/workspaces/ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f/` .
   *
   * @cloudformationAttribute PrometheusEndpoint
   */
  public readonly attrPrometheusEndpoint: string;

  /**
   * The workspace ID. For example: `ws-EXAMPLE-3687-4ac9-853c-EXAMPLEe8f` .
   *
   * @cloudformationAttribute WorkspaceId
   */
  public readonly attrWorkspaceId: string;

  /**
   * The alert manager definition for the workspace, as a string.
   */
  public alertManagerDefinition?: string;

  /**
   * An alias that you assign to this workspace to help you identify it.
   */
  public alias?: string;

  /**
   * KMS Key ARN used to encrypt and decrypt AMP workspace data.
   */
  public kmsKeyArn?: string;

  /**
   * The LoggingConfiguration attribute is used to set the logging configuration for the workspace.
   */
  public loggingConfiguration?: cdk.IResolvable | CfnWorkspace.LoggingConfigurationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tag keys and values to associate with the workspace.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWorkspaceProps = {}) {
    super(scope, id, {
      "type": CfnWorkspace.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrPrometheusEndpoint = cdk.Token.asString(this.getAtt("PrometheusEndpoint", cdk.ResolutionTypeHint.STRING));
    this.attrWorkspaceId = cdk.Token.asString(this.getAtt("WorkspaceId", cdk.ResolutionTypeHint.STRING));
    this.alertManagerDefinition = props.alertManagerDefinition;
    this.alias = props.alias;
    this.kmsKeyArn = props.kmsKeyArn;
    this.loggingConfiguration = props.loggingConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::APS::Workspace", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "alertManagerDefinition": this.alertManagerDefinition,
      "alias": this.alias,
      "kmsKeyArn": this.kmsKeyArn,
      "loggingConfiguration": this.loggingConfiguration,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkspace.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWorkspacePropsToCloudFormation(props);
  }
}

export namespace CfnWorkspace {
  /**
   * The LoggingConfiguration attribute sets the logging configuration for the workspace.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-aps-workspace-loggingconfiguration.html
   */
  export interface LoggingConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the CloudWatch log group the logs are emitted to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-aps-workspace-loggingconfiguration.html#cfn-aps-workspace-loggingconfiguration-loggrouparn
     */
    readonly logGroupArn?: string;
  }
}

/**
 * Properties for defining a `CfnWorkspace`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html
 */
export interface CfnWorkspaceProps {
  /**
   * The alert manager definition for the workspace, as a string.
   *
   * For more information, see [Alert manager and templating](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-alert-manager.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-alertmanagerdefinition
   */
  readonly alertManagerDefinition?: string;

  /**
   * An alias that you assign to this workspace to help you identify it.
   *
   * It does not need to be unique.
   *
   * The alias can be as many as 100 characters and can include any type of characters. Amazon Managed Service for Prometheus automatically strips any blank spaces from the beginning and end of the alias that you specify.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-alias
   */
  readonly alias?: string;

  /**
   * KMS Key ARN used to encrypt and decrypt AMP workspace data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-kmskeyarn
   */
  readonly kmsKeyArn?: string;

  /**
   * The LoggingConfiguration attribute is used to set the logging configuration for the workspace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-loggingconfiguration
   */
  readonly loggingConfiguration?: cdk.IResolvable | CfnWorkspace.LoggingConfigurationProperty;

  /**
   * A list of tag keys and values to associate with the workspace.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-aps-workspace.html#cfn-aps-workspace-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `LoggingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkspaceLoggingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupArn", cdk.validateString)(properties.logGroupArn));
  return errors.wrap("supplied properties not correct for \"LoggingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkspaceLoggingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkspaceLoggingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "LogGroupArn": cdk.stringToCloudFormation(properties.logGroupArn)
  };
}

// @ts-ignore TS6133
function CfnWorkspaceLoggingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkspace.LoggingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspace.LoggingConfigurationProperty>();
  ret.addPropertyResult("logGroupArn", "LogGroupArn", (properties.LogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnWorkspaceProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkspaceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkspacePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alertManagerDefinition", cdk.validateString)(properties.alertManagerDefinition));
  errors.collect(cdk.propertyValidator("alias", cdk.validateString)(properties.alias));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("loggingConfiguration", CfnWorkspaceLoggingConfigurationPropertyValidator)(properties.loggingConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnWorkspaceProps\"");
}

// @ts-ignore TS6133
function convertCfnWorkspacePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkspacePropsValidator(properties).assertSuccess();
  return {
    "AlertManagerDefinition": cdk.stringToCloudFormation(properties.alertManagerDefinition),
    "Alias": cdk.stringToCloudFormation(properties.alias),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "LoggingConfiguration": convertCfnWorkspaceLoggingConfigurationPropertyToCloudFormation(properties.loggingConfiguration),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnWorkspacePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkspaceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkspaceProps>();
  ret.addPropertyResult("alertManagerDefinition", "AlertManagerDefinition", (properties.AlertManagerDefinition != null ? cfn_parse.FromCloudFormation.getString(properties.AlertManagerDefinition) : undefined));
  ret.addPropertyResult("alias", "Alias", (properties.Alias != null ? cfn_parse.FromCloudFormation.getString(properties.Alias) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addPropertyResult("loggingConfiguration", "LoggingConfiguration", (properties.LoggingConfiguration != null ? CfnWorkspaceLoggingConfigurationPropertyFromCloudFormation(properties.LoggingConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}