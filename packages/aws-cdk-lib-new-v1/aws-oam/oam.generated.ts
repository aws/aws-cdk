/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a link between a source account and a sink that you have created in a monitoring account.
 *
 * Before you create a link, you must create a sink in the monitoring account. The sink must have a sink policy that permits the source account to link to it. You can grant permission to source accounts by granting permission to an entire organization, an organizational unit, or to individual accounts.
 *
 * For more information, see [CreateSink](https://docs.aws.amazon.com/OAM/latest/APIReference/API_CreateSink.html) and [PutSinkPolicy](https://docs.aws.amazon.com/OAM/latest/APIReference/API_PutSinkPolicy.html) .
 *
 * Each monitoring account can be linked to as many as 100,000 source accounts.
 *
 * Each source account can be linked to as many as five monitoring accounts.
 *
 * @cloudformationResource AWS::Oam::Link
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-oam-link.html
 */
export class CfnLink extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Oam::Link";

  /**
   * Build a CfnLink from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLink {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLinkPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLink(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the link. For example, `arn:aws:oam:us-west-1:111111111111:link:abcd1234-a123-456a-a12b-a123b456c789`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The friendly human-readable name used to identify this source account when it is viewed from the monitoring account. For example, `my-account1` .
   *
   * @cloudformationAttribute Label
   */
  public readonly attrLabel: string;

  /**
   * Specify a friendly human-readable name to use to identify this source account when you are viewing data from it in the monitoring account.
   */
  public labelTemplate?: string;

  /**
   * An array of strings that define which types of data that the source account shares with the monitoring account.
   */
  public resourceTypes: Array<string>;

  /**
   * The ARN of the sink in the monitoring account that you want to link to.
   */
  public sinkIdentifier: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to the link.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLinkProps) {
    super(scope, id, {
      "type": CfnLink.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "resourceTypes", this);
    cdk.requireProperty(props, "sinkIdentifier", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrLabel = cdk.Token.asString(this.getAtt("Label", cdk.ResolutionTypeHint.STRING));
    this.labelTemplate = props.labelTemplate;
    this.resourceTypes = props.resourceTypes;
    this.sinkIdentifier = props.sinkIdentifier;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Oam::Link", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "labelTemplate": this.labelTemplate,
      "resourceTypes": this.resourceTypes,
      "sinkIdentifier": this.sinkIdentifier,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLink.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLinkPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLink`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-oam-link.html
 */
export interface CfnLinkProps {
  /**
   * Specify a friendly human-readable name to use to identify this source account when you are viewing data from it in the monitoring account.
   *
   * You can include the following variables in your template:
   *
   * - `$AccountName` is the name of the account
   * - `$AccountEmail` is a globally-unique email address, which includes the email domain, such as `mariagarcia@example.com`
   * - `$AccountEmailNoDomain` is an email address without the domain name, such as `mariagarcia`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-oam-link.html#cfn-oam-link-labeltemplate
   */
  readonly labelTemplate?: string;

  /**
   * An array of strings that define which types of data that the source account shares with the monitoring account.
   *
   * Valid values are `AWS::CloudWatch::Metric | AWS::Logs::LogGroup | AWS::XRay::Trace | AWS::ApplicationInsights::Application` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-oam-link.html#cfn-oam-link-resourcetypes
   */
  readonly resourceTypes: Array<string>;

  /**
   * The ARN of the sink in the monitoring account that you want to link to.
   *
   * You can use [ListSinks](https://docs.aws.amazon.com/OAM/latest/APIReference/API_ListSinks.html) to find the ARNs of sinks.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-oam-link.html#cfn-oam-link-sinkidentifier
   */
  readonly sinkIdentifier: string;

  /**
   * An array of key-value pairs to apply to the link.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-oam-link.html#cfn-oam-link-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `CfnLinkProps`
 *
 * @param properties - the TypeScript properties of a `CfnLinkProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLinkPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("labelTemplate", cdk.validateString)(properties.labelTemplate));
  errors.collect(cdk.propertyValidator("resourceTypes", cdk.requiredValidator)(properties.resourceTypes));
  errors.collect(cdk.propertyValidator("resourceTypes", cdk.listValidator(cdk.validateString))(properties.resourceTypes));
  errors.collect(cdk.propertyValidator("sinkIdentifier", cdk.requiredValidator)(properties.sinkIdentifier));
  errors.collect(cdk.propertyValidator("sinkIdentifier", cdk.validateString)(properties.sinkIdentifier));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLinkProps\"");
}

// @ts-ignore TS6133
function convertCfnLinkPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLinkPropsValidator(properties).assertSuccess();
  return {
    "LabelTemplate": cdk.stringToCloudFormation(properties.labelTemplate),
    "ResourceTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourceTypes),
    "SinkIdentifier": cdk.stringToCloudFormation(properties.sinkIdentifier),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLinkPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLinkProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLinkProps>();
  ret.addPropertyResult("labelTemplate", "LabelTemplate", (properties.LabelTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.LabelTemplate) : undefined));
  ret.addPropertyResult("resourceTypes", "ResourceTypes", (properties.ResourceTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourceTypes) : undefined));
  ret.addPropertyResult("sinkIdentifier", "SinkIdentifier", (properties.SinkIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.SinkIdentifier) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates or updates a *sink* in the current account, so that it can be used as a monitoring account in CloudWatch cross-account observability.
 *
 * A sink is a resource that represents an attachment point in a monitoring account, which source accounts can link to to be able to send observability data.
 *
 * After you create a sink, you must create a sink policy that allows source accounts to attach to it. For more information, see [PutSinkPolicy](https://docs.aws.amazon.com/OAM/latest/APIReference/API_PutSinkPolicy.html) .
 *
 * An account can have one sink.
 *
 * @cloudformationResource AWS::Oam::Sink
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-oam-sink.html
 */
export class CfnSink extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Oam::Sink";

  /**
   * Build a CfnSink from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSink {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSinkPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSink(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the sink. For example, `arn:aws:oam:us-west-1:111111111111:sink:abcd1234-a123-456a-a12b-a123b456c789`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A name for the sink.
   */
  public name: string;

  /**
   * The IAM policy that grants permissions to source accounts to link to this sink.
   */
  public policy?: any | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to the sink.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSinkProps) {
    super(scope, id, {
      "type": CfnSink.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.policy = props.policy;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Oam::Sink", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "policy": this.policy,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSink.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSinkPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSink`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-oam-sink.html
 */
export interface CfnSinkProps {
  /**
   * A name for the sink.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-oam-sink.html#cfn-oam-sink-name
   */
  readonly name: string;

  /**
   * The IAM policy that grants permissions to source accounts to link to this sink.
   *
   * The policy can grant permission in the following ways:
   *
   * - Include organization IDs or organization paths to permit all accounts in an organization
   * - Include account IDs to permit the specified accounts
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-oam-sink.html#cfn-oam-sink-policy
   */
  readonly policy?: any | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to the sink.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-oam-sink.html#cfn-oam-sink-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `CfnSinkProps`
 *
 * @param properties - the TypeScript properties of a `CfnSinkProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSinkPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("policy", cdk.validateObject)(properties.policy));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSinkProps\"");
}

// @ts-ignore TS6133
function convertCfnSinkPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSinkPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Policy": cdk.objectToCloudFormation(properties.policy),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSinkPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSinkProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSinkProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}