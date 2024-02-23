/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The approved origin for the instance.
 *
 * @cloudformationResource AWS::Connect::ApprovedOrigin
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-approvedorigin.html
 */
export class CfnApprovedOrigin extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::ApprovedOrigin";

  /**
   * Build a CfnApprovedOrigin from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApprovedOrigin {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApprovedOriginPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApprovedOrigin(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the instance.
   */
  public instanceId: string;

  /**
   * Domain name to be added to the allow-list of the instance.
   */
  public origin: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApprovedOriginProps) {
    super(scope, id, {
      "type": CfnApprovedOrigin.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceId", this);
    cdk.requireProperty(props, "origin", this);

    this.instanceId = props.instanceId;
    this.origin = props.origin;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "instanceId": this.instanceId,
      "origin": this.origin
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApprovedOrigin.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApprovedOriginPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnApprovedOrigin`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-approvedorigin.html
 */
export interface CfnApprovedOriginProps {
  /**
   * The Amazon Resource Name (ARN) of the instance.
   *
   * *Minimum* : `1`
   *
   * *Maximum* : `100`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-approvedorigin.html#cfn-connect-approvedorigin-instanceid
   */
  readonly instanceId: string;

  /**
   * Domain name to be added to the allow-list of the instance.
   *
   * *Maximum* : `267`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-approvedorigin.html#cfn-connect-approvedorigin-origin
   */
  readonly origin: string;
}

/**
 * Determine whether the given properties match those of a `CfnApprovedOriginProps`
 *
 * @param properties - the TypeScript properties of a `CfnApprovedOriginProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApprovedOriginPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceId", cdk.requiredValidator)(properties.instanceId));
  errors.collect(cdk.propertyValidator("instanceId", cdk.validateString)(properties.instanceId));
  errors.collect(cdk.propertyValidator("origin", cdk.requiredValidator)(properties.origin));
  errors.collect(cdk.propertyValidator("origin", cdk.validateString)(properties.origin));
  return errors.wrap("supplied properties not correct for \"CfnApprovedOriginProps\"");
}

// @ts-ignore TS6133
function convertCfnApprovedOriginPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApprovedOriginPropsValidator(properties).assertSuccess();
  return {
    "InstanceId": cdk.stringToCloudFormation(properties.instanceId),
    "Origin": cdk.stringToCloudFormation(properties.origin)
  };
}

// @ts-ignore TS6133
function CfnApprovedOriginPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApprovedOriginProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApprovedOriginProps>();
  ret.addPropertyResult("instanceId", "InstanceId", (properties.InstanceId != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceId) : undefined));
  ret.addPropertyResult("origin", "Origin", (properties.Origin != null ? cfn_parse.FromCloudFormation.getString(properties.Origin) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a flow for an Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::ContactFlow
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html
 */
export class CfnContactFlow extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::ContactFlow";

  /**
   * Build a CfnContactFlow from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContactFlow {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnContactFlowPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnContactFlow(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * `Ref` returns the Amazon Resource Name (ARN) of the flow. For example:
   *
   * `{ "Ref": "myFlowArn" }`
   *
   * @cloudformationAttribute ContactFlowArn
   */
  public readonly attrContactFlowArn: string;

  /**
   * The content of the flow.
   */
  public content: string;

  /**
   * The description of the flow.
   */
  public description?: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon Connect instance.
   */
  public instanceArn: string;

  /**
   * The name of the flow.
   */
  public name: string;

  /**
   * The state of the flow.
   */
  public state?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The type of the flow.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnContactFlowProps) {
    super(scope, id, {
      "type": CfnContactFlow.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "content", this);
    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "type", this);

    this.attrContactFlowArn = cdk.Token.asString(this.getAtt("ContactFlowArn", cdk.ResolutionTypeHint.STRING));
    this.content = props.content;
    this.description = props.description;
    this.instanceArn = props.instanceArn;
    this.name = props.name;
    this.state = props.state;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::ContactFlow", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "content": this.content,
      "description": this.description,
      "instanceArn": this.instanceArn,
      "name": this.name,
      "state": this.state,
      "tags": this.tags.renderTags(),
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnContactFlow.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnContactFlowPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnContactFlow`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html
 */
export interface CfnContactFlowProps {
  /**
   * The content of the flow.
   *
   * For more information, see [Amazon Connect Flow language](https://docs.aws.amazon.com/connect/latest/adminguide/flow-language.html) in the *Amazon Connect Administrator Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-content
   */
  readonly content: string;

  /**
   * The description of the flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-description
   */
  readonly description?: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon Connect instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-instancearn
   */
  readonly instanceArn: string;

  /**
   * The name of the flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-name
   */
  readonly name: string;

  /**
   * The state of the flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-state
   */
  readonly state?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The type of the flow.
   *
   * For descriptions of the available types, see [Choose a flow type](https://docs.aws.amazon.com/connect/latest/adminguide/create-contact-flow.html#contact-flow-types) in the *Amazon Connect Administrator Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflow.html#cfn-connect-contactflow-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `CfnContactFlowProps`
 *
 * @param properties - the TypeScript properties of a `CfnContactFlowProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContactFlowPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("content", cdk.requiredValidator)(properties.content));
  errors.collect(cdk.propertyValidator("content", cdk.validateString)(properties.content));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnContactFlowProps\"");
}

// @ts-ignore TS6133
function convertCfnContactFlowPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContactFlowPropsValidator(properties).assertSuccess();
  return {
    "Content": cdk.stringToCloudFormation(properties.content),
    "Description": cdk.stringToCloudFormation(properties.description),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "State": cdk.stringToCloudFormation(properties.state),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnContactFlowPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContactFlowProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContactFlowProps>();
  ret.addPropertyResult("content", "Content", (properties.Content != null ? cfn_parse.FromCloudFormation.getString(properties.Content) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a flow module for an Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::ContactFlowModule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html
 */
export class CfnContactFlowModule extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::ContactFlowModule";

  /**
   * Build a CfnContactFlowModule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContactFlowModule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnContactFlowModulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnContactFlowModule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * `Ref` returns the Amazon Resource Name (ARN) of the flow module. For example:
   *
   * `{ "Ref": "myFlowModuleArn" }`
   *
   * @cloudformationAttribute ContactFlowModuleArn
   */
  public readonly attrContactFlowModuleArn: string;

  /**
   * The status of the contact flow module.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The content of the flow module.
   */
  public content: string;

  /**
   * The description of the flow module.
   */
  public description?: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon Connect instance.
   */
  public instanceArn: string;

  /**
   * The name of the flow module.
   */
  public name: string;

  /**
   * The state of the flow module.
   */
  public state?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnContactFlowModuleProps) {
    super(scope, id, {
      "type": CfnContactFlowModule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "content", this);
    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "name", this);

    this.attrContactFlowModuleArn = cdk.Token.asString(this.getAtt("ContactFlowModuleArn", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.content = props.content;
    this.description = props.description;
    this.instanceArn = props.instanceArn;
    this.name = props.name;
    this.state = props.state;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::ContactFlowModule", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "content": this.content,
      "description": this.description,
      "instanceArn": this.instanceArn,
      "name": this.name,
      "state": this.state,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnContactFlowModule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnContactFlowModulePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnContactFlowModule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html
 */
export interface CfnContactFlowModuleProps {
  /**
   * The content of the flow module.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-content
   */
  readonly content: string;

  /**
   * The description of the flow module.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-description
   */
  readonly description?: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon Connect instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-instancearn
   */
  readonly instanceArn: string;

  /**
   * The name of the flow module.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-name
   */
  readonly name: string;

  /**
   * The state of the flow module.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-state
   */
  readonly state?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-contactflowmodule.html#cfn-connect-contactflowmodule-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnContactFlowModuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnContactFlowModuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContactFlowModulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("content", cdk.requiredValidator)(properties.content));
  errors.collect(cdk.propertyValidator("content", cdk.validateString)(properties.content));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnContactFlowModuleProps\"");
}

// @ts-ignore TS6133
function convertCfnContactFlowModulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContactFlowModulePropsValidator(properties).assertSuccess();
  return {
    "Content": cdk.stringToCloudFormation(properties.content),
    "Description": cdk.stringToCloudFormation(properties.description),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "State": cdk.stringToCloudFormation(properties.state),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnContactFlowModulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContactFlowModuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContactFlowModuleProps>();
  ret.addPropertyResult("content", "Content", (properties.Content != null ? cfn_parse.FromCloudFormation.getString(properties.Content) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an evaluation form for the specified Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::EvaluationForm
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-evaluationform.html
 */
export class CfnEvaluationForm extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::EvaluationForm";

  /**
   * Build a CfnEvaluationForm from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEvaluationForm {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEvaluationFormPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEvaluationForm(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the evaluation form.
   *
   * @cloudformationAttribute EvaluationFormArn
   */
  public readonly attrEvaluationFormArn: string;

  /**
   * The description of the evaluation form.
   */
  public description?: string;

  /**
   * The identifier of the Amazon Connect instance.
   */
  public instanceArn: string;

  /**
   * Items that are part of the evaluation form.
   */
  public items: Array<CfnEvaluationForm.EvaluationFormBaseItemProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A scoring strategy of the evaluation form.
   */
  public scoringStrategy?: cdk.IResolvable | CfnEvaluationForm.ScoringStrategyProperty;

  /**
   * The status of the evaluation form.
   */
  public status: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A title of the evaluation form.
   */
  public title: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEvaluationFormProps) {
    super(scope, id, {
      "type": CfnEvaluationForm.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "items", this);
    cdk.requireProperty(props, "status", this);
    cdk.requireProperty(props, "title", this);

    this.attrEvaluationFormArn = cdk.Token.asString(this.getAtt("EvaluationFormArn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.instanceArn = props.instanceArn;
    this.items = props.items;
    this.scoringStrategy = props.scoringStrategy;
    this.status = props.status;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::EvaluationForm", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.title = props.title;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "instanceArn": this.instanceArn,
      "items": this.items,
      "scoringStrategy": this.scoringStrategy,
      "status": this.status,
      "tags": this.tags.renderTags(),
      "title": this.title
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEvaluationForm.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEvaluationFormPropsToCloudFormation(props);
  }
}

export namespace CfnEvaluationForm {
  /**
   * A scoring strategy of the evaluation form.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-scoringstrategy.html
   */
  export interface ScoringStrategyProperty {
    /**
     * The scoring mode of the evaluation form.
     *
     * *Allowed values* : `QUESTION_ONLY` | `SECTION_ONLY`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-scoringstrategy.html#cfn-connect-evaluationform-scoringstrategy-mode
     */
    readonly mode: string;

    /**
     * The scoring status of the evaluation form.
     *
     * *Allowed values* : `ENABLED` | `DISABLED`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-scoringstrategy.html#cfn-connect-evaluationform-scoringstrategy-status
     */
    readonly status: string;
  }

  /**
   * An item at the root level.
   *
   * All items must be sections.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformbaseitem.html
   */
  export interface EvaluationFormBaseItemProperty {
    /**
     * A subsection or inner section of an item.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformbaseitem.html#cfn-connect-evaluationform-evaluationformbaseitem-section
     */
    readonly section: CfnEvaluationForm.EvaluationFormSectionProperty | cdk.IResolvable;
  }

  /**
   * Information about a section from an evaluation form.
   *
   * A section can contain sections and/or questions. Evaluation forms can only contain sections and subsections (two level nesting).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsection.html
   */
  export interface EvaluationFormSectionProperty {
    /**
     * The instructions of the section.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsection.html#cfn-connect-evaluationform-evaluationformsection-instructions
     */
    readonly instructions?: string;

    /**
     * The items of the section.
     *
     * *Minimum* : 1
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsection.html#cfn-connect-evaluationform-evaluationformsection-items
     */
    readonly items?: Array<CfnEvaluationForm.EvaluationFormItemProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The identifier of the section. An identifier must be unique within the evaluation form.
     *
     * *Length Constraints* : Minimum length of 1. Maximum length of 40.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsection.html#cfn-connect-evaluationform-evaluationformsection-refid
     */
    readonly refId: string;

    /**
     * The title of the section.
     *
     * *Length Constraints* : Minimum length of 1. Maximum length of 128.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsection.html#cfn-connect-evaluationform-evaluationformsection-title
     */
    readonly title: string;

    /**
     * The scoring weight of the section.
     *
     * *Minimum* : 0
     *
     * *Maximum* : 100
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsection.html#cfn-connect-evaluationform-evaluationformsection-weight
     */
    readonly weight?: number;
  }

  /**
   * Items that are part of the evaluation form.
   *
   * The total number of sections and questions must not exceed 100 each. Questions must be contained in a section.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformitem.html
   */
  export interface EvaluationFormItemProperty {
    /**
     * The information of the question.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformitem.html#cfn-connect-evaluationform-evaluationformitem-question
     */
    readonly question?: CfnEvaluationForm.EvaluationFormQuestionProperty | cdk.IResolvable;

    /**
     * The information of the section.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformitem.html#cfn-connect-evaluationform-evaluationformitem-section
     */
    readonly section?: CfnEvaluationForm.EvaluationFormSectionProperty | cdk.IResolvable;
  }

  /**
   * Information about a question from an evaluation form.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformquestion.html
   */
  export interface EvaluationFormQuestionProperty {
    /**
     * The instructions of the section.
     *
     * *Length Constraints* : Minimum length of 0. Maximum length of 1024.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformquestion.html#cfn-connect-evaluationform-evaluationformquestion-instructions
     */
    readonly instructions?: string;

    /**
     * The flag to enable not applicable answers to the question.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformquestion.html#cfn-connect-evaluationform-evaluationformquestion-notapplicableenabled
     */
    readonly notApplicableEnabled?: boolean | cdk.IResolvable;

    /**
     * The type of the question.
     *
     * *Allowed values* : `NUMERIC` | `SINGLESELECT` | `TEXT`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformquestion.html#cfn-connect-evaluationform-evaluationformquestion-questiontype
     */
    readonly questionType: string;

    /**
     * The properties of the type of question.
     *
     * Text questions do not have to define question type properties.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformquestion.html#cfn-connect-evaluationform-evaluationformquestion-questiontypeproperties
     */
    readonly questionTypeProperties?: CfnEvaluationForm.EvaluationFormQuestionTypePropertiesProperty | cdk.IResolvable;

    /**
     * The identifier of the question. An identifier must be unique within the evaluation form.
     *
     * *Length Constraints* : Minimum length of 1. Maximum length of 40.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformquestion.html#cfn-connect-evaluationform-evaluationformquestion-refid
     */
    readonly refId: string;

    /**
     * The title of the question.
     *
     * *Length Constraints* : Minimum length of 1. Maximum length of 350.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformquestion.html#cfn-connect-evaluationform-evaluationformquestion-title
     */
    readonly title: string;

    /**
     * The scoring weight of the section.
     *
     * *Minimum* : 0
     *
     * *Maximum* : 100
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformquestion.html#cfn-connect-evaluationform-evaluationformquestion-weight
     */
    readonly weight?: number;
  }

  /**
   * Information about properties for a question in an evaluation form.
   *
   * The question type properties must be either for a numeric question or a single select question.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformquestiontypeproperties.html
   */
  export interface EvaluationFormQuestionTypePropertiesProperty {
    /**
     * The properties of the numeric question.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformquestiontypeproperties.html#cfn-connect-evaluationform-evaluationformquestiontypeproperties-numeric
     */
    readonly numeric?: CfnEvaluationForm.EvaluationFormNumericQuestionPropertiesProperty | cdk.IResolvable;

    /**
     * The properties of the numeric question.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformquestiontypeproperties.html#cfn-connect-evaluationform-evaluationformquestiontypeproperties-singleselect
     */
    readonly singleSelect?: CfnEvaluationForm.EvaluationFormSingleSelectQuestionPropertiesProperty | cdk.IResolvable;
  }

  /**
   * Information about properties for a numeric question in an evaluation form.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformnumericquestionproperties.html
   */
  export interface EvaluationFormNumericQuestionPropertiesProperty {
    /**
     * The automation properties of the numeric question.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformnumericquestionproperties.html#cfn-connect-evaluationform-evaluationformnumericquestionproperties-automation
     */
    readonly automation?: CfnEvaluationForm.EvaluationFormNumericQuestionAutomationProperty | cdk.IResolvable;

    /**
     * The maximum answer value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformnumericquestionproperties.html#cfn-connect-evaluationform-evaluationformnumericquestionproperties-maxvalue
     */
    readonly maxValue: number;

    /**
     * The minimum answer value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformnumericquestionproperties.html#cfn-connect-evaluationform-evaluationformnumericquestionproperties-minvalue
     */
    readonly minValue: number;

    /**
     * The scoring options of the numeric question.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformnumericquestionproperties.html#cfn-connect-evaluationform-evaluationformnumericquestionproperties-options
     */
    readonly options?: Array<CfnEvaluationForm.EvaluationFormNumericQuestionOptionProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Information about the option range used for scoring in numeric questions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformnumericquestionoption.html
   */
  export interface EvaluationFormNumericQuestionOptionProperty {
    /**
     * The flag to mark the option as automatic fail.
     *
     * If an automatic fail answer is provided, the overall evaluation gets a score of 0.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformnumericquestionoption.html#cfn-connect-evaluationform-evaluationformnumericquestionoption-automaticfail
     */
    readonly automaticFail?: boolean | cdk.IResolvable;

    /**
     * The maximum answer value of the range option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformnumericquestionoption.html#cfn-connect-evaluationform-evaluationformnumericquestionoption-maxvalue
     */
    readonly maxValue: number;

    /**
     * The minimum answer value of the range option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformnumericquestionoption.html#cfn-connect-evaluationform-evaluationformnumericquestionoption-minvalue
     */
    readonly minValue: number;

    /**
     * The score assigned to answer values within the range option.
     *
     * *Minimum* : 0
     *
     * *Maximum* : 10
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformnumericquestionoption.html#cfn-connect-evaluationform-evaluationformnumericquestionoption-score
     */
    readonly score?: number;
  }

  /**
   * Information about the automation configuration in numeric questions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformnumericquestionautomation.html
   */
  export interface EvaluationFormNumericQuestionAutomationProperty {
    /**
     * The property value of the automation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformnumericquestionautomation.html#cfn-connect-evaluationform-evaluationformnumericquestionautomation-propertyvalue
     */
    readonly propertyValue: cdk.IResolvable | CfnEvaluationForm.NumericQuestionPropertyValueAutomationProperty;
  }

  /**
   * Information about the property value used in automation of a numeric questions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-numericquestionpropertyvalueautomation.html
   */
  export interface NumericQuestionPropertyValueAutomationProperty {
    /**
     * The property label of the automation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-numericquestionpropertyvalueautomation.html#cfn-connect-evaluationform-numericquestionpropertyvalueautomation-label
     */
    readonly label: string;
  }

  /**
   * Information about the options in single select questions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsingleselectquestionproperties.html
   */
  export interface EvaluationFormSingleSelectQuestionPropertiesProperty {
    /**
     * The display mode of the single select question.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsingleselectquestionproperties.html#cfn-connect-evaluationform-evaluationformsingleselectquestionproperties-automation
     */
    readonly automation?: CfnEvaluationForm.EvaluationFormSingleSelectQuestionAutomationProperty | cdk.IResolvable;

    /**
     * The display mode of the single select question.
     *
     * *Allowed values* : `DROPDOWN` | `RADIO`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsingleselectquestionproperties.html#cfn-connect-evaluationform-evaluationformsingleselectquestionproperties-displayas
     */
    readonly displayAs?: string;

    /**
     * The answer options of the single select question.
     *
     * *Minimum* : 2
     *
     * *Maximum* : 256
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsingleselectquestionproperties.html#cfn-connect-evaluationform-evaluationformsingleselectquestionproperties-options
     */
    readonly options: Array<CfnEvaluationForm.EvaluationFormSingleSelectQuestionOptionProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Information about the automation configuration in single select questions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsingleselectquestionoption.html
   */
  export interface EvaluationFormSingleSelectQuestionOptionProperty {
    /**
     * The flag to mark the option as automatic fail.
     *
     * If an automatic fail answer is provided, the overall evaluation gets a score of 0.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsingleselectquestionoption.html#cfn-connect-evaluationform-evaluationformsingleselectquestionoption-automaticfail
     */
    readonly automaticFail?: boolean | cdk.IResolvable;

    /**
     * The identifier of the answer option. An identifier must be unique within the question.
     *
     * *Length Constraints* : Minimum length of 1. Maximum length of 40.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsingleselectquestionoption.html#cfn-connect-evaluationform-evaluationformsingleselectquestionoption-refid
     */
    readonly refId: string;

    /**
     * The score assigned to the answer option.
     *
     * *Minimum* : 0
     *
     * *Maximum* : 10
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsingleselectquestionoption.html#cfn-connect-evaluationform-evaluationformsingleselectquestionoption-score
     */
    readonly score?: number;

    /**
     * The title of the answer option.
     *
     * *Length Constraints* : Minimum length of 1. Maximum length of 128.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsingleselectquestionoption.html#cfn-connect-evaluationform-evaluationformsingleselectquestionoption-text
     */
    readonly text: string;
  }

  /**
   * Information about the automation configuration in single select questions.
   *
   * Automation options are evaluated in order, and the first matched option is applied. If no automation option matches, and there is a default option, then the default option is applied.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsingleselectquestionautomation.html
   */
  export interface EvaluationFormSingleSelectQuestionAutomationProperty {
    /**
     * The identifier of the default answer option, when none of the automation options match the criteria.
     *
     * *Length Constraints* : Minimum length of 1. Maximum length of 40.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsingleselectquestionautomation.html#cfn-connect-evaluationform-evaluationformsingleselectquestionautomation-defaultoptionrefid
     */
    readonly defaultOptionRefId?: string;

    /**
     * The automation options of the single select question.
     *
     * *Minimum* : 1
     *
     * *Maximum* : 20
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsingleselectquestionautomation.html#cfn-connect-evaluationform-evaluationformsingleselectquestionautomation-options
     */
    readonly options: Array<CfnEvaluationForm.EvaluationFormSingleSelectQuestionAutomationOptionProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The automation options of the single select question.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsingleselectquestionautomationoption.html
   */
  export interface EvaluationFormSingleSelectQuestionAutomationOptionProperty {
    /**
     * The automation option based on a rule category for the single select question.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-evaluationformsingleselectquestionautomationoption.html#cfn-connect-evaluationform-evaluationformsingleselectquestionautomationoption-rulecategory
     */
    readonly ruleCategory: cdk.IResolvable | CfnEvaluationForm.SingleSelectQuestionRuleCategoryAutomationProperty;
  }

  /**
   * Information about the automation option based on a rule category for a single select question.
   *
   * *Length Constraints* : Minimum length of 1. Maximum length of 50.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-singleselectquestionrulecategoryautomation.html
   */
  export interface SingleSelectQuestionRuleCategoryAutomationProperty {
    /**
     * The category name, as defined in Rules.
     *
     * *Minimum* : 1
     *
     * *Maximum* : 50
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-singleselectquestionrulecategoryautomation.html#cfn-connect-evaluationform-singleselectquestionrulecategoryautomation-category
     */
    readonly category: string;

    /**
     * The condition to apply for the automation option.
     *
     * If the condition is PRESENT, then the option is applied when the contact data includes the category. Similarly, if the condition is NOT_PRESENT, then the option is applied when the contact data does not include the category.
     *
     * *Allowed values* : `PRESENT` | `NOT_PRESENT`
     *
     * *Maximum* : 50
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-singleselectquestionrulecategoryautomation.html#cfn-connect-evaluationform-singleselectquestionrulecategoryautomation-condition
     */
    readonly condition: string;

    /**
     * The identifier of the answer option. An identifier must be unique within the question.
     *
     * *Length Constraints* : Minimum length of 1. Maximum length of 40.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-evaluationform-singleselectquestionrulecategoryautomation.html#cfn-connect-evaluationform-singleselectquestionrulecategoryautomation-optionrefid
     */
    readonly optionRefId: string;
  }
}

/**
 * Properties for defining a `CfnEvaluationForm`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-evaluationform.html
 */
export interface CfnEvaluationFormProps {
  /**
   * The description of the evaluation form.
   *
   * *Length Constraints* : Minimum length of 0. Maximum length of 1024.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-evaluationform.html#cfn-connect-evaluationform-description
   */
  readonly description?: string;

  /**
   * The identifier of the Amazon Connect instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-evaluationform.html#cfn-connect-evaluationform-instancearn
   */
  readonly instanceArn: string;

  /**
   * Items that are part of the evaluation form.
   *
   * The total number of sections and questions must not exceed 100 each. Questions must be contained in a section.
   *
   * *Minimum size* : 1
   *
   * *Maximum size* : 100
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-evaluationform.html#cfn-connect-evaluationform-items
   */
  readonly items: Array<CfnEvaluationForm.EvaluationFormBaseItemProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A scoring strategy of the evaluation form.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-evaluationform.html#cfn-connect-evaluationform-scoringstrategy
   */
  readonly scoringStrategy?: cdk.IResolvable | CfnEvaluationForm.ScoringStrategyProperty;

  /**
   * The status of the evaluation form.
   *
   * *Allowed values* : `DRAFT` | `ACTIVE`
   *
   * @default - "DRAFT"
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-evaluationform.html#cfn-connect-evaluationform-status
   */
  readonly status: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * For example, { "tags": {"key1":"value1", "key2":"value2"} }.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-evaluationform.html#cfn-connect-evaluationform-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A title of the evaluation form.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-evaluationform.html#cfn-connect-evaluationform-title
   */
  readonly title: string;
}

/**
 * Determine whether the given properties match those of a `ScoringStrategyProperty`
 *
 * @param properties - the TypeScript properties of a `ScoringStrategyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormScoringStrategyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mode", cdk.requiredValidator)(properties.mode));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"ScoringStrategyProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormScoringStrategyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormScoringStrategyPropertyValidator(properties).assertSuccess();
  return {
    "Mode": cdk.stringToCloudFormation(properties.mode),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormScoringStrategyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEvaluationForm.ScoringStrategyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.ScoringStrategyProperty>();
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EvaluationFormNumericQuestionOptionProperty`
 *
 * @param properties - the TypeScript properties of a `EvaluationFormNumericQuestionOptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormNumericQuestionOptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("automaticFail", cdk.validateBoolean)(properties.automaticFail));
  errors.collect(cdk.propertyValidator("maxValue", cdk.requiredValidator)(properties.maxValue));
  errors.collect(cdk.propertyValidator("maxValue", cdk.validateNumber)(properties.maxValue));
  errors.collect(cdk.propertyValidator("minValue", cdk.requiredValidator)(properties.minValue));
  errors.collect(cdk.propertyValidator("minValue", cdk.validateNumber)(properties.minValue));
  errors.collect(cdk.propertyValidator("score", cdk.validateNumber)(properties.score));
  return errors.wrap("supplied properties not correct for \"EvaluationFormNumericQuestionOptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormEvaluationFormNumericQuestionOptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormEvaluationFormNumericQuestionOptionPropertyValidator(properties).assertSuccess();
  return {
    "AutomaticFail": cdk.booleanToCloudFormation(properties.automaticFail),
    "MaxValue": cdk.numberToCloudFormation(properties.maxValue),
    "MinValue": cdk.numberToCloudFormation(properties.minValue),
    "Score": cdk.numberToCloudFormation(properties.score)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormNumericQuestionOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEvaluationForm.EvaluationFormNumericQuestionOptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.EvaluationFormNumericQuestionOptionProperty>();
  ret.addPropertyResult("automaticFail", "AutomaticFail", (properties.AutomaticFail != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutomaticFail) : undefined));
  ret.addPropertyResult("maxValue", "MaxValue", (properties.MaxValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxValue) : undefined));
  ret.addPropertyResult("minValue", "MinValue", (properties.MinValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinValue) : undefined));
  ret.addPropertyResult("score", "Score", (properties.Score != null ? cfn_parse.FromCloudFormation.getNumber(properties.Score) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NumericQuestionPropertyValueAutomationProperty`
 *
 * @param properties - the TypeScript properties of a `NumericQuestionPropertyValueAutomationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormNumericQuestionPropertyValueAutomationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("label", cdk.requiredValidator)(properties.label));
  errors.collect(cdk.propertyValidator("label", cdk.validateString)(properties.label));
  return errors.wrap("supplied properties not correct for \"NumericQuestionPropertyValueAutomationProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormNumericQuestionPropertyValueAutomationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormNumericQuestionPropertyValueAutomationPropertyValidator(properties).assertSuccess();
  return {
    "Label": cdk.stringToCloudFormation(properties.label)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormNumericQuestionPropertyValueAutomationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEvaluationForm.NumericQuestionPropertyValueAutomationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.NumericQuestionPropertyValueAutomationProperty>();
  ret.addPropertyResult("label", "Label", (properties.Label != null ? cfn_parse.FromCloudFormation.getString(properties.Label) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EvaluationFormNumericQuestionAutomationProperty`
 *
 * @param properties - the TypeScript properties of a `EvaluationFormNumericQuestionAutomationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormNumericQuestionAutomationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("propertyValue", cdk.requiredValidator)(properties.propertyValue));
  errors.collect(cdk.propertyValidator("propertyValue", CfnEvaluationFormNumericQuestionPropertyValueAutomationPropertyValidator)(properties.propertyValue));
  return errors.wrap("supplied properties not correct for \"EvaluationFormNumericQuestionAutomationProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormEvaluationFormNumericQuestionAutomationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormEvaluationFormNumericQuestionAutomationPropertyValidator(properties).assertSuccess();
  return {
    "PropertyValue": convertCfnEvaluationFormNumericQuestionPropertyValueAutomationPropertyToCloudFormation(properties.propertyValue)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormNumericQuestionAutomationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEvaluationForm.EvaluationFormNumericQuestionAutomationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.EvaluationFormNumericQuestionAutomationProperty>();
  ret.addPropertyResult("propertyValue", "PropertyValue", (properties.PropertyValue != null ? CfnEvaluationFormNumericQuestionPropertyValueAutomationPropertyFromCloudFormation(properties.PropertyValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EvaluationFormNumericQuestionPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `EvaluationFormNumericQuestionPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormNumericQuestionPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("automation", CfnEvaluationFormEvaluationFormNumericQuestionAutomationPropertyValidator)(properties.automation));
  errors.collect(cdk.propertyValidator("maxValue", cdk.requiredValidator)(properties.maxValue));
  errors.collect(cdk.propertyValidator("maxValue", cdk.validateNumber)(properties.maxValue));
  errors.collect(cdk.propertyValidator("minValue", cdk.requiredValidator)(properties.minValue));
  errors.collect(cdk.propertyValidator("minValue", cdk.validateNumber)(properties.minValue));
  errors.collect(cdk.propertyValidator("options", cdk.listValidator(CfnEvaluationFormEvaluationFormNumericQuestionOptionPropertyValidator))(properties.options));
  return errors.wrap("supplied properties not correct for \"EvaluationFormNumericQuestionPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormEvaluationFormNumericQuestionPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormEvaluationFormNumericQuestionPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Automation": convertCfnEvaluationFormEvaluationFormNumericQuestionAutomationPropertyToCloudFormation(properties.automation),
    "MaxValue": cdk.numberToCloudFormation(properties.maxValue),
    "MinValue": cdk.numberToCloudFormation(properties.minValue),
    "Options": cdk.listMapper(convertCfnEvaluationFormEvaluationFormNumericQuestionOptionPropertyToCloudFormation)(properties.options)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormNumericQuestionPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEvaluationForm.EvaluationFormNumericQuestionPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.EvaluationFormNumericQuestionPropertiesProperty>();
  ret.addPropertyResult("automation", "Automation", (properties.Automation != null ? CfnEvaluationFormEvaluationFormNumericQuestionAutomationPropertyFromCloudFormation(properties.Automation) : undefined));
  ret.addPropertyResult("maxValue", "MaxValue", (properties.MaxValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxValue) : undefined));
  ret.addPropertyResult("minValue", "MinValue", (properties.MinValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinValue) : undefined));
  ret.addPropertyResult("options", "Options", (properties.Options != null ? cfn_parse.FromCloudFormation.getArray(CfnEvaluationFormEvaluationFormNumericQuestionOptionPropertyFromCloudFormation)(properties.Options) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EvaluationFormSingleSelectQuestionOptionProperty`
 *
 * @param properties - the TypeScript properties of a `EvaluationFormSingleSelectQuestionOptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormSingleSelectQuestionOptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("automaticFail", cdk.validateBoolean)(properties.automaticFail));
  errors.collect(cdk.propertyValidator("refId", cdk.requiredValidator)(properties.refId));
  errors.collect(cdk.propertyValidator("refId", cdk.validateString)(properties.refId));
  errors.collect(cdk.propertyValidator("score", cdk.validateNumber)(properties.score));
  errors.collect(cdk.propertyValidator("text", cdk.requiredValidator)(properties.text));
  errors.collect(cdk.propertyValidator("text", cdk.validateString)(properties.text));
  return errors.wrap("supplied properties not correct for \"EvaluationFormSingleSelectQuestionOptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormEvaluationFormSingleSelectQuestionOptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormEvaluationFormSingleSelectQuestionOptionPropertyValidator(properties).assertSuccess();
  return {
    "AutomaticFail": cdk.booleanToCloudFormation(properties.automaticFail),
    "RefId": cdk.stringToCloudFormation(properties.refId),
    "Score": cdk.numberToCloudFormation(properties.score),
    "Text": cdk.stringToCloudFormation(properties.text)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormSingleSelectQuestionOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEvaluationForm.EvaluationFormSingleSelectQuestionOptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.EvaluationFormSingleSelectQuestionOptionProperty>();
  ret.addPropertyResult("automaticFail", "AutomaticFail", (properties.AutomaticFail != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutomaticFail) : undefined));
  ret.addPropertyResult("refId", "RefId", (properties.RefId != null ? cfn_parse.FromCloudFormation.getString(properties.RefId) : undefined));
  ret.addPropertyResult("score", "Score", (properties.Score != null ? cfn_parse.FromCloudFormation.getNumber(properties.Score) : undefined));
  ret.addPropertyResult("text", "Text", (properties.Text != null ? cfn_parse.FromCloudFormation.getString(properties.Text) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SingleSelectQuestionRuleCategoryAutomationProperty`
 *
 * @param properties - the TypeScript properties of a `SingleSelectQuestionRuleCategoryAutomationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormSingleSelectQuestionRuleCategoryAutomationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("category", cdk.requiredValidator)(properties.category));
  errors.collect(cdk.propertyValidator("category", cdk.validateString)(properties.category));
  errors.collect(cdk.propertyValidator("condition", cdk.requiredValidator)(properties.condition));
  errors.collect(cdk.propertyValidator("condition", cdk.validateString)(properties.condition));
  errors.collect(cdk.propertyValidator("optionRefId", cdk.requiredValidator)(properties.optionRefId));
  errors.collect(cdk.propertyValidator("optionRefId", cdk.validateString)(properties.optionRefId));
  return errors.wrap("supplied properties not correct for \"SingleSelectQuestionRuleCategoryAutomationProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormSingleSelectQuestionRuleCategoryAutomationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormSingleSelectQuestionRuleCategoryAutomationPropertyValidator(properties).assertSuccess();
  return {
    "Category": cdk.stringToCloudFormation(properties.category),
    "Condition": cdk.stringToCloudFormation(properties.condition),
    "OptionRefId": cdk.stringToCloudFormation(properties.optionRefId)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormSingleSelectQuestionRuleCategoryAutomationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEvaluationForm.SingleSelectQuestionRuleCategoryAutomationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.SingleSelectQuestionRuleCategoryAutomationProperty>();
  ret.addPropertyResult("category", "Category", (properties.Category != null ? cfn_parse.FromCloudFormation.getString(properties.Category) : undefined));
  ret.addPropertyResult("condition", "Condition", (properties.Condition != null ? cfn_parse.FromCloudFormation.getString(properties.Condition) : undefined));
  ret.addPropertyResult("optionRefId", "OptionRefId", (properties.OptionRefId != null ? cfn_parse.FromCloudFormation.getString(properties.OptionRefId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EvaluationFormSingleSelectQuestionAutomationOptionProperty`
 *
 * @param properties - the TypeScript properties of a `EvaluationFormSingleSelectQuestionAutomationOptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormSingleSelectQuestionAutomationOptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ruleCategory", cdk.requiredValidator)(properties.ruleCategory));
  errors.collect(cdk.propertyValidator("ruleCategory", CfnEvaluationFormSingleSelectQuestionRuleCategoryAutomationPropertyValidator)(properties.ruleCategory));
  return errors.wrap("supplied properties not correct for \"EvaluationFormSingleSelectQuestionAutomationOptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormEvaluationFormSingleSelectQuestionAutomationOptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormEvaluationFormSingleSelectQuestionAutomationOptionPropertyValidator(properties).assertSuccess();
  return {
    "RuleCategory": convertCfnEvaluationFormSingleSelectQuestionRuleCategoryAutomationPropertyToCloudFormation(properties.ruleCategory)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormSingleSelectQuestionAutomationOptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEvaluationForm.EvaluationFormSingleSelectQuestionAutomationOptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.EvaluationFormSingleSelectQuestionAutomationOptionProperty>();
  ret.addPropertyResult("ruleCategory", "RuleCategory", (properties.RuleCategory != null ? CfnEvaluationFormSingleSelectQuestionRuleCategoryAutomationPropertyFromCloudFormation(properties.RuleCategory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EvaluationFormSingleSelectQuestionAutomationProperty`
 *
 * @param properties - the TypeScript properties of a `EvaluationFormSingleSelectQuestionAutomationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormSingleSelectQuestionAutomationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultOptionRefId", cdk.validateString)(properties.defaultOptionRefId));
  errors.collect(cdk.propertyValidator("options", cdk.requiredValidator)(properties.options));
  errors.collect(cdk.propertyValidator("options", cdk.listValidator(CfnEvaluationFormEvaluationFormSingleSelectQuestionAutomationOptionPropertyValidator))(properties.options));
  return errors.wrap("supplied properties not correct for \"EvaluationFormSingleSelectQuestionAutomationProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormEvaluationFormSingleSelectQuestionAutomationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormEvaluationFormSingleSelectQuestionAutomationPropertyValidator(properties).assertSuccess();
  return {
    "DefaultOptionRefId": cdk.stringToCloudFormation(properties.defaultOptionRefId),
    "Options": cdk.listMapper(convertCfnEvaluationFormEvaluationFormSingleSelectQuestionAutomationOptionPropertyToCloudFormation)(properties.options)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormSingleSelectQuestionAutomationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEvaluationForm.EvaluationFormSingleSelectQuestionAutomationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.EvaluationFormSingleSelectQuestionAutomationProperty>();
  ret.addPropertyResult("defaultOptionRefId", "DefaultOptionRefId", (properties.DefaultOptionRefId != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultOptionRefId) : undefined));
  ret.addPropertyResult("options", "Options", (properties.Options != null ? cfn_parse.FromCloudFormation.getArray(CfnEvaluationFormEvaluationFormSingleSelectQuestionAutomationOptionPropertyFromCloudFormation)(properties.Options) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EvaluationFormSingleSelectQuestionPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `EvaluationFormSingleSelectQuestionPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormSingleSelectQuestionPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("automation", CfnEvaluationFormEvaluationFormSingleSelectQuestionAutomationPropertyValidator)(properties.automation));
  errors.collect(cdk.propertyValidator("displayAs", cdk.validateString)(properties.displayAs));
  errors.collect(cdk.propertyValidator("options", cdk.requiredValidator)(properties.options));
  errors.collect(cdk.propertyValidator("options", cdk.listValidator(CfnEvaluationFormEvaluationFormSingleSelectQuestionOptionPropertyValidator))(properties.options));
  return errors.wrap("supplied properties not correct for \"EvaluationFormSingleSelectQuestionPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormEvaluationFormSingleSelectQuestionPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormEvaluationFormSingleSelectQuestionPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Automation": convertCfnEvaluationFormEvaluationFormSingleSelectQuestionAutomationPropertyToCloudFormation(properties.automation),
    "DisplayAs": cdk.stringToCloudFormation(properties.displayAs),
    "Options": cdk.listMapper(convertCfnEvaluationFormEvaluationFormSingleSelectQuestionOptionPropertyToCloudFormation)(properties.options)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormSingleSelectQuestionPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEvaluationForm.EvaluationFormSingleSelectQuestionPropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.EvaluationFormSingleSelectQuestionPropertiesProperty>();
  ret.addPropertyResult("automation", "Automation", (properties.Automation != null ? CfnEvaluationFormEvaluationFormSingleSelectQuestionAutomationPropertyFromCloudFormation(properties.Automation) : undefined));
  ret.addPropertyResult("displayAs", "DisplayAs", (properties.DisplayAs != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayAs) : undefined));
  ret.addPropertyResult("options", "Options", (properties.Options != null ? cfn_parse.FromCloudFormation.getArray(CfnEvaluationFormEvaluationFormSingleSelectQuestionOptionPropertyFromCloudFormation)(properties.Options) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EvaluationFormQuestionTypePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `EvaluationFormQuestionTypePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormQuestionTypePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("numeric", CfnEvaluationFormEvaluationFormNumericQuestionPropertiesPropertyValidator)(properties.numeric));
  errors.collect(cdk.propertyValidator("singleSelect", CfnEvaluationFormEvaluationFormSingleSelectQuestionPropertiesPropertyValidator)(properties.singleSelect));
  return errors.wrap("supplied properties not correct for \"EvaluationFormQuestionTypePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormEvaluationFormQuestionTypePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormEvaluationFormQuestionTypePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "Numeric": convertCfnEvaluationFormEvaluationFormNumericQuestionPropertiesPropertyToCloudFormation(properties.numeric),
    "SingleSelect": convertCfnEvaluationFormEvaluationFormSingleSelectQuestionPropertiesPropertyToCloudFormation(properties.singleSelect)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormQuestionTypePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEvaluationForm.EvaluationFormQuestionTypePropertiesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.EvaluationFormQuestionTypePropertiesProperty>();
  ret.addPropertyResult("numeric", "Numeric", (properties.Numeric != null ? CfnEvaluationFormEvaluationFormNumericQuestionPropertiesPropertyFromCloudFormation(properties.Numeric) : undefined));
  ret.addPropertyResult("singleSelect", "SingleSelect", (properties.SingleSelect != null ? CfnEvaluationFormEvaluationFormSingleSelectQuestionPropertiesPropertyFromCloudFormation(properties.SingleSelect) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EvaluationFormQuestionProperty`
 *
 * @param properties - the TypeScript properties of a `EvaluationFormQuestionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormQuestionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instructions", cdk.validateString)(properties.instructions));
  errors.collect(cdk.propertyValidator("notApplicableEnabled", cdk.validateBoolean)(properties.notApplicableEnabled));
  errors.collect(cdk.propertyValidator("questionType", cdk.requiredValidator)(properties.questionType));
  errors.collect(cdk.propertyValidator("questionType", cdk.validateString)(properties.questionType));
  errors.collect(cdk.propertyValidator("questionTypeProperties", CfnEvaluationFormEvaluationFormQuestionTypePropertiesPropertyValidator)(properties.questionTypeProperties));
  errors.collect(cdk.propertyValidator("refId", cdk.requiredValidator)(properties.refId));
  errors.collect(cdk.propertyValidator("refId", cdk.validateString)(properties.refId));
  errors.collect(cdk.propertyValidator("title", cdk.requiredValidator)(properties.title));
  errors.collect(cdk.propertyValidator("title", cdk.validateString)(properties.title));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"EvaluationFormQuestionProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormEvaluationFormQuestionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormEvaluationFormQuestionPropertyValidator(properties).assertSuccess();
  return {
    "Instructions": cdk.stringToCloudFormation(properties.instructions),
    "NotApplicableEnabled": cdk.booleanToCloudFormation(properties.notApplicableEnabled),
    "QuestionType": cdk.stringToCloudFormation(properties.questionType),
    "QuestionTypeProperties": convertCfnEvaluationFormEvaluationFormQuestionTypePropertiesPropertyToCloudFormation(properties.questionTypeProperties),
    "RefId": cdk.stringToCloudFormation(properties.refId),
    "Title": cdk.stringToCloudFormation(properties.title),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormQuestionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEvaluationForm.EvaluationFormQuestionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.EvaluationFormQuestionProperty>();
  ret.addPropertyResult("instructions", "Instructions", (properties.Instructions != null ? cfn_parse.FromCloudFormation.getString(properties.Instructions) : undefined));
  ret.addPropertyResult("notApplicableEnabled", "NotApplicableEnabled", (properties.NotApplicableEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NotApplicableEnabled) : undefined));
  ret.addPropertyResult("questionType", "QuestionType", (properties.QuestionType != null ? cfn_parse.FromCloudFormation.getString(properties.QuestionType) : undefined));
  ret.addPropertyResult("questionTypeProperties", "QuestionTypeProperties", (properties.QuestionTypeProperties != null ? CfnEvaluationFormEvaluationFormQuestionTypePropertiesPropertyFromCloudFormation(properties.QuestionTypeProperties) : undefined));
  ret.addPropertyResult("refId", "RefId", (properties.RefId != null ? cfn_parse.FromCloudFormation.getString(properties.RefId) : undefined));
  ret.addPropertyResult("title", "Title", (properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EvaluationFormItemProperty`
 *
 * @param properties - the TypeScript properties of a `EvaluationFormItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("question", CfnEvaluationFormEvaluationFormQuestionPropertyValidator)(properties.question));
  errors.collect(cdk.propertyValidator("section", CfnEvaluationFormEvaluationFormSectionPropertyValidator)(properties.section));
  return errors.wrap("supplied properties not correct for \"EvaluationFormItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormEvaluationFormItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormEvaluationFormItemPropertyValidator(properties).assertSuccess();
  return {
    "Question": convertCfnEvaluationFormEvaluationFormQuestionPropertyToCloudFormation(properties.question),
    "Section": convertCfnEvaluationFormEvaluationFormSectionPropertyToCloudFormation(properties.section)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEvaluationForm.EvaluationFormItemProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.EvaluationFormItemProperty>();
  ret.addPropertyResult("question", "Question", (properties.Question != null ? CfnEvaluationFormEvaluationFormQuestionPropertyFromCloudFormation(properties.Question) : undefined));
  ret.addPropertyResult("section", "Section", (properties.Section != null ? CfnEvaluationFormEvaluationFormSectionPropertyFromCloudFormation(properties.Section) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EvaluationFormSectionProperty`
 *
 * @param properties - the TypeScript properties of a `EvaluationFormSectionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormSectionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instructions", cdk.validateString)(properties.instructions));
  errors.collect(cdk.propertyValidator("items", cdk.listValidator(CfnEvaluationFormEvaluationFormItemPropertyValidator))(properties.items));
  errors.collect(cdk.propertyValidator("refId", cdk.requiredValidator)(properties.refId));
  errors.collect(cdk.propertyValidator("refId", cdk.validateString)(properties.refId));
  errors.collect(cdk.propertyValidator("title", cdk.requiredValidator)(properties.title));
  errors.collect(cdk.propertyValidator("title", cdk.validateString)(properties.title));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"EvaluationFormSectionProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormEvaluationFormSectionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormEvaluationFormSectionPropertyValidator(properties).assertSuccess();
  return {
    "Instructions": cdk.stringToCloudFormation(properties.instructions),
    "Items": cdk.listMapper(convertCfnEvaluationFormEvaluationFormItemPropertyToCloudFormation)(properties.items),
    "RefId": cdk.stringToCloudFormation(properties.refId),
    "Title": cdk.stringToCloudFormation(properties.title),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormSectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEvaluationForm.EvaluationFormSectionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.EvaluationFormSectionProperty>();
  ret.addPropertyResult("instructions", "Instructions", (properties.Instructions != null ? cfn_parse.FromCloudFormation.getString(properties.Instructions) : undefined));
  ret.addPropertyResult("items", "Items", (properties.Items != null ? cfn_parse.FromCloudFormation.getArray(CfnEvaluationFormEvaluationFormItemPropertyFromCloudFormation)(properties.Items) : undefined));
  ret.addPropertyResult("refId", "RefId", (properties.RefId != null ? cfn_parse.FromCloudFormation.getString(properties.RefId) : undefined));
  ret.addPropertyResult("title", "Title", (properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EvaluationFormBaseItemProperty`
 *
 * @param properties - the TypeScript properties of a `EvaluationFormBaseItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormBaseItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("section", cdk.requiredValidator)(properties.section));
  errors.collect(cdk.propertyValidator("section", CfnEvaluationFormEvaluationFormSectionPropertyValidator)(properties.section));
  return errors.wrap("supplied properties not correct for \"EvaluationFormBaseItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormEvaluationFormBaseItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormEvaluationFormBaseItemPropertyValidator(properties).assertSuccess();
  return {
    "Section": convertCfnEvaluationFormEvaluationFormSectionPropertyToCloudFormation(properties.section)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormEvaluationFormBaseItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEvaluationForm.EvaluationFormBaseItemProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationForm.EvaluationFormBaseItemProperty>();
  ret.addPropertyResult("section", "Section", (properties.Section != null ? CfnEvaluationFormEvaluationFormSectionPropertyFromCloudFormation(properties.Section) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEvaluationFormProps`
 *
 * @param properties - the TypeScript properties of a `CfnEvaluationFormProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEvaluationFormPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("items", cdk.requiredValidator)(properties.items));
  errors.collect(cdk.propertyValidator("items", cdk.listValidator(CfnEvaluationFormEvaluationFormBaseItemPropertyValidator))(properties.items));
  errors.collect(cdk.propertyValidator("scoringStrategy", CfnEvaluationFormScoringStrategyPropertyValidator)(properties.scoringStrategy));
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("title", cdk.requiredValidator)(properties.title));
  errors.collect(cdk.propertyValidator("title", cdk.validateString)(properties.title));
  return errors.wrap("supplied properties not correct for \"CfnEvaluationFormProps\"");
}

// @ts-ignore TS6133
function convertCfnEvaluationFormPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEvaluationFormPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "Items": cdk.listMapper(convertCfnEvaluationFormEvaluationFormBaseItemPropertyToCloudFormation)(properties.items),
    "ScoringStrategy": convertCfnEvaluationFormScoringStrategyPropertyToCloudFormation(properties.scoringStrategy),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Title": cdk.stringToCloudFormation(properties.title)
  };
}

// @ts-ignore TS6133
function CfnEvaluationFormPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEvaluationFormProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEvaluationFormProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("items", "Items", (properties.Items != null ? cfn_parse.FromCloudFormation.getArray(CfnEvaluationFormEvaluationFormBaseItemPropertyFromCloudFormation)(properties.Items) : undefined));
  ret.addPropertyResult("scoringStrategy", "ScoringStrategy", (properties.ScoringStrategy != null ? CfnEvaluationFormScoringStrategyPropertyFromCloudFormation(properties.ScoringStrategy) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("title", "Title", (properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies hours of operation.
 *
 * @cloudformationResource AWS::Connect::HoursOfOperation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html
 */
export class CfnHoursOfOperation extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::HoursOfOperation";

  /**
   * Build a CfnHoursOfOperation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHoursOfOperation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnHoursOfOperationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnHoursOfOperation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the hours of operation.
   *
   * @cloudformationAttribute HoursOfOperationArn
   */
  public readonly attrHoursOfOperationArn: string;

  /**
   * Configuration information for the hours of operation.
   */
  public config: Array<CfnHoursOfOperation.HoursOfOperationConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description for the hours of operation.
   */
  public description?: string;

  /**
   * The Amazon Resource Name (ARN) of the instance.
   */
  public instanceArn: string;

  /**
   * The name for the hours of operation.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The time zone for the hours of operation.
   */
  public timeZone: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnHoursOfOperationProps) {
    super(scope, id, {
      "type": CfnHoursOfOperation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "config", this);
    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "timeZone", this);

    this.attrHoursOfOperationArn = cdk.Token.asString(this.getAtt("HoursOfOperationArn", cdk.ResolutionTypeHint.STRING));
    this.config = props.config;
    this.description = props.description;
    this.instanceArn = props.instanceArn;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::HoursOfOperation", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.timeZone = props.timeZone;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "config": this.config,
      "description": this.description,
      "instanceArn": this.instanceArn,
      "name": this.name,
      "tags": this.tags.renderTags(),
      "timeZone": this.timeZone
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnHoursOfOperation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnHoursOfOperationPropsToCloudFormation(props);
  }
}

export namespace CfnHoursOfOperation {
  /**
   * Contains information about the hours of operation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationconfig.html
   */
  export interface HoursOfOperationConfigProperty {
    /**
     * The day that the hours of operation applies to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationconfig.html#cfn-connect-hoursofoperation-hoursofoperationconfig-day
     */
    readonly day: string;

    /**
     * The end time that your contact center closes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationconfig.html#cfn-connect-hoursofoperation-hoursofoperationconfig-endtime
     */
    readonly endTime: CfnHoursOfOperation.HoursOfOperationTimeSliceProperty | cdk.IResolvable;

    /**
     * The start time that your contact center opens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationconfig.html#cfn-connect-hoursofoperation-hoursofoperationconfig-starttime
     */
    readonly startTime: CfnHoursOfOperation.HoursOfOperationTimeSliceProperty | cdk.IResolvable;
  }

  /**
   * The start time or end time for an hours of operation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationtimeslice.html
   */
  export interface HoursOfOperationTimeSliceProperty {
    /**
     * The hours.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationtimeslice.html#cfn-connect-hoursofoperation-hoursofoperationtimeslice-hours
     */
    readonly hours: number;

    /**
     * The minutes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-hoursofoperation-hoursofoperationtimeslice.html#cfn-connect-hoursofoperation-hoursofoperationtimeslice-minutes
     */
    readonly minutes: number;
  }
}

/**
 * Properties for defining a `CfnHoursOfOperation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html
 */
export interface CfnHoursOfOperationProps {
  /**
   * Configuration information for the hours of operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-config
   */
  readonly config: Array<CfnHoursOfOperation.HoursOfOperationConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description for the hours of operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-description
   */
  readonly description?: string;

  /**
   * The Amazon Resource Name (ARN) of the instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-instancearn
   */
  readonly instanceArn: string;

  /**
   * The name for the hours of operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-name
   */
  readonly name: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * For example, { "Tags": {"key1":"value1", "key2":"value2"} }.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The time zone for the hours of operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-hoursofoperation.html#cfn-connect-hoursofoperation-timezone
   */
  readonly timeZone: string;
}

/**
 * Determine whether the given properties match those of a `HoursOfOperationTimeSliceProperty`
 *
 * @param properties - the TypeScript properties of a `HoursOfOperationTimeSliceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHoursOfOperationHoursOfOperationTimeSlicePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hours", cdk.requiredValidator)(properties.hours));
  errors.collect(cdk.propertyValidator("hours", cdk.validateNumber)(properties.hours));
  errors.collect(cdk.propertyValidator("minutes", cdk.requiredValidator)(properties.minutes));
  errors.collect(cdk.propertyValidator("minutes", cdk.validateNumber)(properties.minutes));
  return errors.wrap("supplied properties not correct for \"HoursOfOperationTimeSliceProperty\"");
}

// @ts-ignore TS6133
function convertCfnHoursOfOperationHoursOfOperationTimeSlicePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHoursOfOperationHoursOfOperationTimeSlicePropertyValidator(properties).assertSuccess();
  return {
    "Hours": cdk.numberToCloudFormation(properties.hours),
    "Minutes": cdk.numberToCloudFormation(properties.minutes)
  };
}

// @ts-ignore TS6133
function CfnHoursOfOperationHoursOfOperationTimeSlicePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHoursOfOperation.HoursOfOperationTimeSliceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHoursOfOperation.HoursOfOperationTimeSliceProperty>();
  ret.addPropertyResult("hours", "Hours", (properties.Hours != null ? cfn_parse.FromCloudFormation.getNumber(properties.Hours) : undefined));
  ret.addPropertyResult("minutes", "Minutes", (properties.Minutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.Minutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HoursOfOperationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HoursOfOperationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHoursOfOperationHoursOfOperationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("day", cdk.requiredValidator)(properties.day));
  errors.collect(cdk.propertyValidator("day", cdk.validateString)(properties.day));
  errors.collect(cdk.propertyValidator("endTime", cdk.requiredValidator)(properties.endTime));
  errors.collect(cdk.propertyValidator("endTime", CfnHoursOfOperationHoursOfOperationTimeSlicePropertyValidator)(properties.endTime));
  errors.collect(cdk.propertyValidator("startTime", cdk.requiredValidator)(properties.startTime));
  errors.collect(cdk.propertyValidator("startTime", CfnHoursOfOperationHoursOfOperationTimeSlicePropertyValidator)(properties.startTime));
  return errors.wrap("supplied properties not correct for \"HoursOfOperationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnHoursOfOperationHoursOfOperationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHoursOfOperationHoursOfOperationConfigPropertyValidator(properties).assertSuccess();
  return {
    "Day": cdk.stringToCloudFormation(properties.day),
    "EndTime": convertCfnHoursOfOperationHoursOfOperationTimeSlicePropertyToCloudFormation(properties.endTime),
    "StartTime": convertCfnHoursOfOperationHoursOfOperationTimeSlicePropertyToCloudFormation(properties.startTime)
  };
}

// @ts-ignore TS6133
function CfnHoursOfOperationHoursOfOperationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHoursOfOperation.HoursOfOperationConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHoursOfOperation.HoursOfOperationConfigProperty>();
  ret.addPropertyResult("day", "Day", (properties.Day != null ? cfn_parse.FromCloudFormation.getString(properties.Day) : undefined));
  ret.addPropertyResult("endTime", "EndTime", (properties.EndTime != null ? CfnHoursOfOperationHoursOfOperationTimeSlicePropertyFromCloudFormation(properties.EndTime) : undefined));
  ret.addPropertyResult("startTime", "StartTime", (properties.StartTime != null ? CfnHoursOfOperationHoursOfOperationTimeSlicePropertyFromCloudFormation(properties.StartTime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnHoursOfOperationProps`
 *
 * @param properties - the TypeScript properties of a `CfnHoursOfOperationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHoursOfOperationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("config", cdk.requiredValidator)(properties.config));
  errors.collect(cdk.propertyValidator("config", cdk.listValidator(CfnHoursOfOperationHoursOfOperationConfigPropertyValidator))(properties.config));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("timeZone", cdk.requiredValidator)(properties.timeZone));
  errors.collect(cdk.propertyValidator("timeZone", cdk.validateString)(properties.timeZone));
  return errors.wrap("supplied properties not correct for \"CfnHoursOfOperationProps\"");
}

// @ts-ignore TS6133
function convertCfnHoursOfOperationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHoursOfOperationPropsValidator(properties).assertSuccess();
  return {
    "Config": cdk.listMapper(convertCfnHoursOfOperationHoursOfOperationConfigPropertyToCloudFormation)(properties.config),
    "Description": cdk.stringToCloudFormation(properties.description),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TimeZone": cdk.stringToCloudFormation(properties.timeZone)
  };
}

// @ts-ignore TS6133
function CfnHoursOfOperationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHoursOfOperationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHoursOfOperationProps>();
  ret.addPropertyResult("config", "Config", (properties.Config != null ? cfn_parse.FromCloudFormation.getArray(CfnHoursOfOperationHoursOfOperationConfigPropertyFromCloudFormation)(properties.Config) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("timeZone", "TimeZone", (properties.TimeZone != null ? cfn_parse.FromCloudFormation.getString(properties.TimeZone) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * *This is a preview release for Amazon Connect . It is subject to change.*.
 *
 * Initiates an Amazon Connect instance with all the supported channels enabled. It does not attach any storage, such as Amazon Simple Storage Service (Amazon S3) or Amazon Kinesis.
 *
 * Amazon Connect enforces a limit on the total number of instances that you can create or delete in 30 days. If you exceed this limit, you will get an error message indicating there has been an excessive number of attempts at creating or deleting instances. You must wait 30 days before you can restart creating and deleting instances in your account.
 *
 * @cloudformationResource AWS::Connect::Instance
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html
 */
export class CfnInstance extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::Instance";

  /**
   * Build a CfnInstance from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstance {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnInstancePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnInstance(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the instance.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * When the instance was created.
   *
   * @cloudformationAttribute CreatedTime
   */
  public readonly attrCreatedTime: string;

  /**
   * The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The state of the instance.
   *
   * @cloudformationAttribute InstanceStatus
   */
  public readonly attrInstanceStatus: string;

  /**
   * The service role of the instance.
   *
   * @cloudformationAttribute ServiceRole
   */
  public readonly attrServiceRole: string;

  /**
   * A toggle for an individual feature at the instance level.
   */
  public attributes: CfnInstance.AttributesProperty | cdk.IResolvable;

  /**
   * The identifier for the directory.
   */
  public directoryId?: string;

  /**
   * The identity management type.
   */
  public identityManagementType: string;

  /**
   * The alias of instance.
   */
  public instanceAlias?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnInstanceProps) {
    super(scope, id, {
      "type": CfnInstance.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "attributes", this);
    cdk.requireProperty(props, "identityManagementType", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedTime = cdk.Token.asString(this.getAtt("CreatedTime", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrInstanceStatus = cdk.Token.asString(this.getAtt("InstanceStatus", cdk.ResolutionTypeHint.STRING));
    this.attrServiceRole = cdk.Token.asString(this.getAtt("ServiceRole", cdk.ResolutionTypeHint.STRING));
    this.attributes = props.attributes;
    this.directoryId = props.directoryId;
    this.identityManagementType = props.identityManagementType;
    this.instanceAlias = props.instanceAlias;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "attributes": this.attributes,
      "directoryId": this.directoryId,
      "identityManagementType": this.identityManagementType,
      "instanceAlias": this.instanceAlias,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstance.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnInstancePropsToCloudFormation(props);
  }
}

export namespace CfnInstance {
  /**
   * *This is a preview release for Amazon Connect .
   *
   * It is subject to change.*
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html
   */
  export interface AttributesProperty {
    /**
     * Boolean flag which enables AUTO_RESOLVE_BEST_VOICES on an instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-autoresolvebestvoices
     */
    readonly autoResolveBestVoices?: boolean | cdk.IResolvable;

    /**
     * Boolean flag which enables CONTACTFLOW_LOGS on an instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-contactflowlogs
     */
    readonly contactflowLogs?: boolean | cdk.IResolvable;

    /**
     * Boolean flag which enables CONTACT_LENS on an instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-contactlens
     */
    readonly contactLens?: boolean | cdk.IResolvable;

    /**
     * Boolean flag which enables EARLY_MEDIA on an instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-earlymedia
     */
    readonly earlyMedia?: boolean | cdk.IResolvable;

    /**
     * Mandatory element which enables inbound calls on new instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-inboundcalls
     */
    readonly inboundCalls: boolean | cdk.IResolvable;

    /**
     * Mandatory element which enables outbound calls on new instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-outboundcalls
     */
    readonly outboundCalls: boolean | cdk.IResolvable;

    /**
     * Boolean flag which enables USE_CUSTOM_TTS_VOICES on an instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instance-attributes.html#cfn-connect-instance-attributes-usecustomttsvoices
     */
    readonly useCustomTtsVoices?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnInstance`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html
 */
export interface CfnInstanceProps {
  /**
   * A toggle for an individual feature at the instance level.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-attributes
   */
  readonly attributes: CfnInstance.AttributesProperty | cdk.IResolvable;

  /**
   * The identifier for the directory.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-directoryid
   */
  readonly directoryId?: string;

  /**
   * The identity management type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-identitymanagementtype
   */
  readonly identityManagementType: string;

  /**
   * The alias of instance.
   *
   * `InstanceAlias` is only required when `IdentityManagementType` is `CONNECT_MANAGED` or `SAML` . `InstanceAlias` is not required when `IdentityManagementType` is `EXISTING_DIRECTORY` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-instancealias
   */
  readonly instanceAlias?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instance.html#cfn-connect-instance-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AttributesProperty`
 *
 * @param properties - the TypeScript properties of a `AttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("autoResolveBestVoices", cdk.validateBoolean)(properties.autoResolveBestVoices));
  errors.collect(cdk.propertyValidator("contactLens", cdk.validateBoolean)(properties.contactLens));
  errors.collect(cdk.propertyValidator("contactflowLogs", cdk.validateBoolean)(properties.contactflowLogs));
  errors.collect(cdk.propertyValidator("earlyMedia", cdk.validateBoolean)(properties.earlyMedia));
  errors.collect(cdk.propertyValidator("inboundCalls", cdk.requiredValidator)(properties.inboundCalls));
  errors.collect(cdk.propertyValidator("inboundCalls", cdk.validateBoolean)(properties.inboundCalls));
  errors.collect(cdk.propertyValidator("outboundCalls", cdk.requiredValidator)(properties.outboundCalls));
  errors.collect(cdk.propertyValidator("outboundCalls", cdk.validateBoolean)(properties.outboundCalls));
  errors.collect(cdk.propertyValidator("useCustomTtsVoices", cdk.validateBoolean)(properties.useCustomTtsVoices));
  return errors.wrap("supplied properties not correct for \"AttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceAttributesPropertyValidator(properties).assertSuccess();
  return {
    "AutoResolveBestVoices": cdk.booleanToCloudFormation(properties.autoResolveBestVoices),
    "ContactLens": cdk.booleanToCloudFormation(properties.contactLens),
    "ContactflowLogs": cdk.booleanToCloudFormation(properties.contactflowLogs),
    "EarlyMedia": cdk.booleanToCloudFormation(properties.earlyMedia),
    "InboundCalls": cdk.booleanToCloudFormation(properties.inboundCalls),
    "OutboundCalls": cdk.booleanToCloudFormation(properties.outboundCalls),
    "UseCustomTTSVoices": cdk.booleanToCloudFormation(properties.useCustomTtsVoices)
  };
}

// @ts-ignore TS6133
function CfnInstanceAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.AttributesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.AttributesProperty>();
  ret.addPropertyResult("autoResolveBestVoices", "AutoResolveBestVoices", (properties.AutoResolveBestVoices != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoResolveBestVoices) : undefined));
  ret.addPropertyResult("contactflowLogs", "ContactflowLogs", (properties.ContactflowLogs != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ContactflowLogs) : undefined));
  ret.addPropertyResult("contactLens", "ContactLens", (properties.ContactLens != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ContactLens) : undefined));
  ret.addPropertyResult("earlyMedia", "EarlyMedia", (properties.EarlyMedia != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EarlyMedia) : undefined));
  ret.addPropertyResult("inboundCalls", "InboundCalls", (properties.InboundCalls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.InboundCalls) : undefined));
  ret.addPropertyResult("outboundCalls", "OutboundCalls", (properties.OutboundCalls != null ? cfn_parse.FromCloudFormation.getBoolean(properties.OutboundCalls) : undefined));
  ret.addPropertyResult("useCustomTtsVoices", "UseCustomTTSVoices", (properties.UseCustomTTSVoices != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseCustomTTSVoices) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnInstanceProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstancePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.requiredValidator)(properties.attributes));
  errors.collect(cdk.propertyValidator("attributes", CfnInstanceAttributesPropertyValidator)(properties.attributes));
  errors.collect(cdk.propertyValidator("directoryId", cdk.validateString)(properties.directoryId));
  errors.collect(cdk.propertyValidator("identityManagementType", cdk.requiredValidator)(properties.identityManagementType));
  errors.collect(cdk.propertyValidator("identityManagementType", cdk.validateString)(properties.identityManagementType));
  errors.collect(cdk.propertyValidator("instanceAlias", cdk.validateString)(properties.instanceAlias));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnInstanceProps\"");
}

// @ts-ignore TS6133
function convertCfnInstancePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstancePropsValidator(properties).assertSuccess();
  return {
    "Attributes": convertCfnInstanceAttributesPropertyToCloudFormation(properties.attributes),
    "DirectoryId": cdk.stringToCloudFormation(properties.directoryId),
    "IdentityManagementType": cdk.stringToCloudFormation(properties.identityManagementType),
    "InstanceAlias": cdk.stringToCloudFormation(properties.instanceAlias),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnInstancePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceProps>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? CfnInstanceAttributesPropertyFromCloudFormation(properties.Attributes) : undefined));
  ret.addPropertyResult("directoryId", "DirectoryId", (properties.DirectoryId != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryId) : undefined));
  ret.addPropertyResult("identityManagementType", "IdentityManagementType", (properties.IdentityManagementType != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityManagementType) : undefined));
  ret.addPropertyResult("instanceAlias", "InstanceAlias", (properties.InstanceAlias != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceAlias) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The storage configuration for the instance.
 *
 * @cloudformationResource AWS::Connect::InstanceStorageConfig
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html
 */
export class CfnInstanceStorageConfig extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::InstanceStorageConfig";

  /**
   * Build a CfnInstanceStorageConfig from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstanceStorageConfig {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnInstanceStorageConfigPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnInstanceStorageConfig(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The existing association identifier that uniquely identifies the resource type and storage config for the given instance ID.
   *
   * @cloudformationAttribute AssociationId
   */
  public readonly attrAssociationId: string;

  /**
   * The Amazon Resource Name (ARN) of the instance.
   */
  public instanceArn: string;

  /**
   * The configuration of the Kinesis Firehose delivery stream.
   */
  public kinesisFirehoseConfig?: cdk.IResolvable | CfnInstanceStorageConfig.KinesisFirehoseConfigProperty;

  /**
   * The configuration of the Kinesis data stream.
   */
  public kinesisStreamConfig?: cdk.IResolvable | CfnInstanceStorageConfig.KinesisStreamConfigProperty;

  /**
   * The configuration of the Kinesis video stream.
   */
  public kinesisVideoStreamConfig?: cdk.IResolvable | CfnInstanceStorageConfig.KinesisVideoStreamConfigProperty;

  /**
   * A valid resource type.
   */
  public resourceType: string;

  /**
   * The S3 bucket configuration.
   */
  public s3Config?: cdk.IResolvable | CfnInstanceStorageConfig.S3ConfigProperty;

  /**
   * A valid storage type.
   */
  public storageType: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnInstanceStorageConfigProps) {
    super(scope, id, {
      "type": CfnInstanceStorageConfig.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "resourceType", this);
    cdk.requireProperty(props, "storageType", this);

    this.attrAssociationId = cdk.Token.asString(this.getAtt("AssociationId", cdk.ResolutionTypeHint.STRING));
    this.instanceArn = props.instanceArn;
    this.kinesisFirehoseConfig = props.kinesisFirehoseConfig;
    this.kinesisStreamConfig = props.kinesisStreamConfig;
    this.kinesisVideoStreamConfig = props.kinesisVideoStreamConfig;
    this.resourceType = props.resourceType;
    this.s3Config = props.s3Config;
    this.storageType = props.storageType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "instanceArn": this.instanceArn,
      "kinesisFirehoseConfig": this.kinesisFirehoseConfig,
      "kinesisStreamConfig": this.kinesisStreamConfig,
      "kinesisVideoStreamConfig": this.kinesisVideoStreamConfig,
      "resourceType": this.resourceType,
      "s3Config": this.s3Config,
      "storageType": this.storageType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstanceStorageConfig.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnInstanceStorageConfigPropsToCloudFormation(props);
  }
}

export namespace CfnInstanceStorageConfig {
  /**
   * Configuration information of a Kinesis data stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisstreamconfig.html
   */
  export interface KinesisStreamConfigProperty {
    /**
     * The Amazon Resource Name (ARN) of the data stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisstreamconfig.html#cfn-connect-instancestorageconfig-kinesisstreamconfig-streamarn
     */
    readonly streamArn: string;
  }

  /**
   * Information about the Amazon Simple Storage Service (Amazon S3) storage type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-s3config.html
   */
  export interface S3ConfigProperty {
    /**
     * The S3 bucket name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-s3config.html#cfn-connect-instancestorageconfig-s3config-bucketname
     */
    readonly bucketName: string;

    /**
     * The S3 bucket prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-s3config.html#cfn-connect-instancestorageconfig-s3config-bucketprefix
     */
    readonly bucketPrefix: string;

    /**
     * The Amazon S3 encryption configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-s3config.html#cfn-connect-instancestorageconfig-s3config-encryptionconfig
     */
    readonly encryptionConfig?: CfnInstanceStorageConfig.EncryptionConfigProperty | cdk.IResolvable;
  }

  /**
   * The encryption configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-encryptionconfig.html
   */
  export interface EncryptionConfigProperty {
    /**
     * The type of encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-encryptionconfig.html#cfn-connect-instancestorageconfig-encryptionconfig-encryptiontype
     */
    readonly encryptionType: string;

    /**
     * The full ARN of the encryption key.
     *
     * > Be sure to provide the full ARN of the encryption key, not just the ID.
     * >
     * > Amazon Connect supports only KMS keys with the default key spec of [`SYMMETRIC_DEFAULT`](https://docs.aws.amazon.com/kms/latest/developerguide/asymmetric-key-specs.html#key-spec-symmetric-default) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-encryptionconfig.html#cfn-connect-instancestorageconfig-encryptionconfig-keyid
     */
    readonly keyId: string;
  }

  /**
   * Configuration information of a Kinesis video stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisvideostreamconfig.html
   */
  export interface KinesisVideoStreamConfigProperty {
    /**
     * The encryption configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisvideostreamconfig.html#cfn-connect-instancestorageconfig-kinesisvideostreamconfig-encryptionconfig
     */
    readonly encryptionConfig: CfnInstanceStorageConfig.EncryptionConfigProperty | cdk.IResolvable;

    /**
     * The prefix of the video stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisvideostreamconfig.html#cfn-connect-instancestorageconfig-kinesisvideostreamconfig-prefix
     */
    readonly prefix: string;

    /**
     * The number of hours data is retained in the stream.
     *
     * Kinesis Video Streams retains the data in a data store that is associated with the stream.
     *
     * The default value is 0, indicating that the stream does not persist data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisvideostreamconfig.html#cfn-connect-instancestorageconfig-kinesisvideostreamconfig-retentionperiodhours
     */
    readonly retentionPeriodHours: number;
  }

  /**
   * Configuration information of a Kinesis Data Firehose delivery stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisfirehoseconfig.html
   */
  export interface KinesisFirehoseConfigProperty {
    /**
     * The Amazon Resource Name (ARN) of the delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-instancestorageconfig-kinesisfirehoseconfig.html#cfn-connect-instancestorageconfig-kinesisfirehoseconfig-firehosearn
     */
    readonly firehoseArn: string;
  }
}

/**
 * Properties for defining a `CfnInstanceStorageConfig`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html
 */
export interface CfnInstanceStorageConfigProps {
  /**
   * The Amazon Resource Name (ARN) of the instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-instancearn
   */
  readonly instanceArn: string;

  /**
   * The configuration of the Kinesis Firehose delivery stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisfirehoseconfig
   */
  readonly kinesisFirehoseConfig?: cdk.IResolvable | CfnInstanceStorageConfig.KinesisFirehoseConfigProperty;

  /**
   * The configuration of the Kinesis data stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisstreamconfig
   */
  readonly kinesisStreamConfig?: cdk.IResolvable | CfnInstanceStorageConfig.KinesisStreamConfigProperty;

  /**
   * The configuration of the Kinesis video stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-kinesisvideostreamconfig
   */
  readonly kinesisVideoStreamConfig?: cdk.IResolvable | CfnInstanceStorageConfig.KinesisVideoStreamConfigProperty;

  /**
   * A valid resource type.
   *
   * Following are the valid resource types: `CHAT_TRANSCRIPTS` | `CALL_RECORDINGS` | `SCHEDULED_REPORTS` | `MEDIA_STREAMS` | `CONTACT_TRACE_RECORDS` | `AGENT_EVENTS`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-resourcetype
   */
  readonly resourceType: string;

  /**
   * The S3 bucket configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-s3config
   */
  readonly s3Config?: cdk.IResolvable | CfnInstanceStorageConfig.S3ConfigProperty;

  /**
   * A valid storage type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-instancestorageconfig.html#cfn-connect-instancestorageconfig-storagetype
   */
  readonly storageType: string;
}

/**
 * Determine whether the given properties match those of a `KinesisStreamConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisStreamConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceStorageConfigKinesisStreamConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("streamArn", cdk.requiredValidator)(properties.streamArn));
  errors.collect(cdk.propertyValidator("streamArn", cdk.validateString)(properties.streamArn));
  return errors.wrap("supplied properties not correct for \"KinesisStreamConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceStorageConfigKinesisStreamConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceStorageConfigKinesisStreamConfigPropertyValidator(properties).assertSuccess();
  return {
    "StreamArn": cdk.stringToCloudFormation(properties.streamArn)
  };
}

// @ts-ignore TS6133
function CfnInstanceStorageConfigKinesisStreamConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstanceStorageConfig.KinesisStreamConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceStorageConfig.KinesisStreamConfigProperty>();
  ret.addPropertyResult("streamArn", "StreamArn", (properties.StreamArn != null ? cfn_parse.FromCloudFormation.getString(properties.StreamArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceStorageConfigEncryptionConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryptionType", cdk.requiredValidator)(properties.encryptionType));
  errors.collect(cdk.propertyValidator("encryptionType", cdk.validateString)(properties.encryptionType));
  errors.collect(cdk.propertyValidator("keyId", cdk.requiredValidator)(properties.keyId));
  errors.collect(cdk.propertyValidator("keyId", cdk.validateString)(properties.keyId));
  return errors.wrap("supplied properties not correct for \"EncryptionConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceStorageConfigEncryptionConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceStorageConfigEncryptionConfigPropertyValidator(properties).assertSuccess();
  return {
    "EncryptionType": cdk.stringToCloudFormation(properties.encryptionType),
    "KeyId": cdk.stringToCloudFormation(properties.keyId)
  };
}

// @ts-ignore TS6133
function CfnInstanceStorageConfigEncryptionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceStorageConfig.EncryptionConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceStorageConfig.EncryptionConfigProperty>();
  ret.addPropertyResult("encryptionType", "EncryptionType", (properties.EncryptionType != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionType) : undefined));
  ret.addPropertyResult("keyId", "KeyId", (properties.KeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3ConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3ConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceStorageConfigS3ConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.requiredValidator)(properties.bucketPrefix));
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.validateString)(properties.bucketPrefix));
  errors.collect(cdk.propertyValidator("encryptionConfig", CfnInstanceStorageConfigEncryptionConfigPropertyValidator)(properties.encryptionConfig));
  return errors.wrap("supplied properties not correct for \"S3ConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceStorageConfigS3ConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceStorageConfigS3ConfigPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "BucketPrefix": cdk.stringToCloudFormation(properties.bucketPrefix),
    "EncryptionConfig": convertCfnInstanceStorageConfigEncryptionConfigPropertyToCloudFormation(properties.encryptionConfig)
  };
}

// @ts-ignore TS6133
function CfnInstanceStorageConfigS3ConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstanceStorageConfig.S3ConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceStorageConfig.S3ConfigProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("bucketPrefix", "BucketPrefix", (properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined));
  ret.addPropertyResult("encryptionConfig", "EncryptionConfig", (properties.EncryptionConfig != null ? CfnInstanceStorageConfigEncryptionConfigPropertyFromCloudFormation(properties.EncryptionConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KinesisVideoStreamConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisVideoStreamConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceStorageConfigKinesisVideoStreamConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryptionConfig", cdk.requiredValidator)(properties.encryptionConfig));
  errors.collect(cdk.propertyValidator("encryptionConfig", CfnInstanceStorageConfigEncryptionConfigPropertyValidator)(properties.encryptionConfig));
  errors.collect(cdk.propertyValidator("prefix", cdk.requiredValidator)(properties.prefix));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("retentionPeriodHours", cdk.requiredValidator)(properties.retentionPeriodHours));
  errors.collect(cdk.propertyValidator("retentionPeriodHours", cdk.validateNumber)(properties.retentionPeriodHours));
  return errors.wrap("supplied properties not correct for \"KinesisVideoStreamConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceStorageConfigKinesisVideoStreamConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceStorageConfigKinesisVideoStreamConfigPropertyValidator(properties).assertSuccess();
  return {
    "EncryptionConfig": convertCfnInstanceStorageConfigEncryptionConfigPropertyToCloudFormation(properties.encryptionConfig),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "RetentionPeriodHours": cdk.numberToCloudFormation(properties.retentionPeriodHours)
  };
}

// @ts-ignore TS6133
function CfnInstanceStorageConfigKinesisVideoStreamConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstanceStorageConfig.KinesisVideoStreamConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceStorageConfig.KinesisVideoStreamConfigProperty>();
  ret.addPropertyResult("encryptionConfig", "EncryptionConfig", (properties.EncryptionConfig != null ? CfnInstanceStorageConfigEncryptionConfigPropertyFromCloudFormation(properties.EncryptionConfig) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("retentionPeriodHours", "RetentionPeriodHours", (properties.RetentionPeriodHours != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetentionPeriodHours) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KinesisFirehoseConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceStorageConfigKinesisFirehoseConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("firehoseArn", cdk.requiredValidator)(properties.firehoseArn));
  errors.collect(cdk.propertyValidator("firehoseArn", cdk.validateString)(properties.firehoseArn));
  return errors.wrap("supplied properties not correct for \"KinesisFirehoseConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceStorageConfigKinesisFirehoseConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceStorageConfigKinesisFirehoseConfigPropertyValidator(properties).assertSuccess();
  return {
    "FirehoseArn": cdk.stringToCloudFormation(properties.firehoseArn)
  };
}

// @ts-ignore TS6133
function CfnInstanceStorageConfigKinesisFirehoseConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstanceStorageConfig.KinesisFirehoseConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceStorageConfig.KinesisFirehoseConfigProperty>();
  ret.addPropertyResult("firehoseArn", "FirehoseArn", (properties.FirehoseArn != null ? cfn_parse.FromCloudFormation.getString(properties.FirehoseArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnInstanceStorageConfigProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceStorageConfigProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceStorageConfigPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("kinesisFirehoseConfig", CfnInstanceStorageConfigKinesisFirehoseConfigPropertyValidator)(properties.kinesisFirehoseConfig));
  errors.collect(cdk.propertyValidator("kinesisStreamConfig", CfnInstanceStorageConfigKinesisStreamConfigPropertyValidator)(properties.kinesisStreamConfig));
  errors.collect(cdk.propertyValidator("kinesisVideoStreamConfig", CfnInstanceStorageConfigKinesisVideoStreamConfigPropertyValidator)(properties.kinesisVideoStreamConfig));
  errors.collect(cdk.propertyValidator("resourceType", cdk.requiredValidator)(properties.resourceType));
  errors.collect(cdk.propertyValidator("resourceType", cdk.validateString)(properties.resourceType));
  errors.collect(cdk.propertyValidator("s3Config", CfnInstanceStorageConfigS3ConfigPropertyValidator)(properties.s3Config));
  errors.collect(cdk.propertyValidator("storageType", cdk.requiredValidator)(properties.storageType));
  errors.collect(cdk.propertyValidator("storageType", cdk.validateString)(properties.storageType));
  return errors.wrap("supplied properties not correct for \"CfnInstanceStorageConfigProps\"");
}

// @ts-ignore TS6133
function convertCfnInstanceStorageConfigPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceStorageConfigPropsValidator(properties).assertSuccess();
  return {
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "KinesisFirehoseConfig": convertCfnInstanceStorageConfigKinesisFirehoseConfigPropertyToCloudFormation(properties.kinesisFirehoseConfig),
    "KinesisStreamConfig": convertCfnInstanceStorageConfigKinesisStreamConfigPropertyToCloudFormation(properties.kinesisStreamConfig),
    "KinesisVideoStreamConfig": convertCfnInstanceStorageConfigKinesisVideoStreamConfigPropertyToCloudFormation(properties.kinesisVideoStreamConfig),
    "ResourceType": cdk.stringToCloudFormation(properties.resourceType),
    "S3Config": convertCfnInstanceStorageConfigS3ConfigPropertyToCloudFormation(properties.s3Config),
    "StorageType": cdk.stringToCloudFormation(properties.storageType)
  };
}

// @ts-ignore TS6133
function CfnInstanceStorageConfigPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceStorageConfigProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceStorageConfigProps>();
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("kinesisFirehoseConfig", "KinesisFirehoseConfig", (properties.KinesisFirehoseConfig != null ? CfnInstanceStorageConfigKinesisFirehoseConfigPropertyFromCloudFormation(properties.KinesisFirehoseConfig) : undefined));
  ret.addPropertyResult("kinesisStreamConfig", "KinesisStreamConfig", (properties.KinesisStreamConfig != null ? CfnInstanceStorageConfigKinesisStreamConfigPropertyFromCloudFormation(properties.KinesisStreamConfig) : undefined));
  ret.addPropertyResult("kinesisVideoStreamConfig", "KinesisVideoStreamConfig", (properties.KinesisVideoStreamConfig != null ? CfnInstanceStorageConfigKinesisVideoStreamConfigPropertyFromCloudFormation(properties.KinesisVideoStreamConfig) : undefined));
  ret.addPropertyResult("resourceType", "ResourceType", (properties.ResourceType != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceType) : undefined));
  ret.addPropertyResult("s3Config", "S3Config", (properties.S3Config != null ? CfnInstanceStorageConfigS3ConfigPropertyFromCloudFormation(properties.S3Config) : undefined));
  ret.addPropertyResult("storageType", "StorageType", (properties.StorageType != null ? cfn_parse.FromCloudFormation.getString(properties.StorageType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies the association of an AWS resource such as Lex bot (both v1 and v2) and Lambda function with an Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::IntegrationAssociation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-integrationassociation.html
 */
export class CfnIntegrationAssociation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::IntegrationAssociation";

  /**
   * Build a CfnIntegrationAssociation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIntegrationAssociation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIntegrationAssociationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIntegrationAssociation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Identifier of the association with an Amazon Connect instance.
   *
   * @cloudformationAttribute IntegrationAssociationId
   */
  public readonly attrIntegrationAssociationId: string;

  /**
   * The Amazon Resource Name (ARN) of the instance.
   */
  public instanceId: string;

  /**
   * ARN of the integration being associated with the instance.
   */
  public integrationArn: string;

  /**
   * Specifies the integration type to be associated with the instance.
   */
  public integrationType: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIntegrationAssociationProps) {
    super(scope, id, {
      "type": CfnIntegrationAssociation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceId", this);
    cdk.requireProperty(props, "integrationArn", this);
    cdk.requireProperty(props, "integrationType", this);

    this.attrIntegrationAssociationId = cdk.Token.asString(this.getAtt("IntegrationAssociationId", cdk.ResolutionTypeHint.STRING));
    this.instanceId = props.instanceId;
    this.integrationArn = props.integrationArn;
    this.integrationType = props.integrationType;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "instanceId": this.instanceId,
      "integrationArn": this.integrationArn,
      "integrationType": this.integrationType
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIntegrationAssociation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIntegrationAssociationPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnIntegrationAssociation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-integrationassociation.html
 */
export interface CfnIntegrationAssociationProps {
  /**
   * The Amazon Resource Name (ARN) of the instance.
   *
   * *Minimum* : `1`
   *
   * *Maximum* : `100`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-integrationassociation.html#cfn-connect-integrationassociation-instanceid
   */
  readonly instanceId: string;

  /**
   * ARN of the integration being associated with the instance.
   *
   * *Minimum* : `1`
   *
   * *Maximum* : `140`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-integrationassociation.html#cfn-connect-integrationassociation-integrationarn
   */
  readonly integrationArn: string;

  /**
   * Specifies the integration type to be associated with the instance.
   *
   * *Allowed Values* : `LEX_BOT` | `LAMBDA_FUNCTION`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-integrationassociation.html#cfn-connect-integrationassociation-integrationtype
   */
  readonly integrationType: string;
}

/**
 * Determine whether the given properties match those of a `CfnIntegrationAssociationProps`
 *
 * @param properties - the TypeScript properties of a `CfnIntegrationAssociationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIntegrationAssociationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceId", cdk.requiredValidator)(properties.instanceId));
  errors.collect(cdk.propertyValidator("instanceId", cdk.validateString)(properties.instanceId));
  errors.collect(cdk.propertyValidator("integrationArn", cdk.requiredValidator)(properties.integrationArn));
  errors.collect(cdk.propertyValidator("integrationArn", cdk.validateString)(properties.integrationArn));
  errors.collect(cdk.propertyValidator("integrationType", cdk.requiredValidator)(properties.integrationType));
  errors.collect(cdk.propertyValidator("integrationType", cdk.validateString)(properties.integrationType));
  return errors.wrap("supplied properties not correct for \"CfnIntegrationAssociationProps\"");
}

// @ts-ignore TS6133
function convertCfnIntegrationAssociationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIntegrationAssociationPropsValidator(properties).assertSuccess();
  return {
    "InstanceId": cdk.stringToCloudFormation(properties.instanceId),
    "IntegrationArn": cdk.stringToCloudFormation(properties.integrationArn),
    "IntegrationType": cdk.stringToCloudFormation(properties.integrationType)
  };
}

// @ts-ignore TS6133
function CfnIntegrationAssociationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIntegrationAssociationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIntegrationAssociationProps>();
  ret.addPropertyResult("instanceId", "InstanceId", (properties.InstanceId != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceId) : undefined));
  ret.addPropertyResult("integrationArn", "IntegrationArn", (properties.IntegrationArn != null ? cfn_parse.FromCloudFormation.getString(properties.IntegrationArn) : undefined));
  ret.addPropertyResult("integrationType", "IntegrationType", (properties.IntegrationType != null ? cfn_parse.FromCloudFormation.getString(properties.IntegrationType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Claims a phone number to the specified Amazon Connect instance or traffic distribution group.
 *
 * @cloudformationResource AWS::Connect::PhoneNumber
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html
 */
export class CfnPhoneNumber extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::PhoneNumber";

  /**
   * Build a CfnPhoneNumber from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPhoneNumber {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPhoneNumberPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPhoneNumber(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The phone number, in E.164 format.
   *
   * @cloudformationAttribute Address
   */
  public readonly attrAddress: string;

  /**
   * The Amazon Resource Name (ARN) of the phone number.
   *
   * @cloudformationAttribute PhoneNumberArn
   */
  public readonly attrPhoneNumberArn: string;

  /**
   * The ISO country code.
   */
  public countryCode?: string;

  /**
   * The description of the phone number.
   */
  public description?: string;

  /**
   * The prefix of the phone number. If provided, it must contain `+` as part of the country code.
   */
  public prefix?: string;

  /**
   * The claimed phone number ARN that was previously imported from the external service, such as Amazon Pinpoint.
   */
  public sourcePhoneNumberArn?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The Amazon Resource Name (ARN) for Amazon Connect instances or traffic distribution group that phone numbers are claimed to.
   */
  public targetArn: string;

  /**
   * The type of phone number.
   */
  public type?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPhoneNumberProps) {
    super(scope, id, {
      "type": CfnPhoneNumber.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "targetArn", this);

    this.attrAddress = cdk.Token.asString(this.getAtt("Address", cdk.ResolutionTypeHint.STRING));
    this.attrPhoneNumberArn = cdk.Token.asString(this.getAtt("PhoneNumberArn", cdk.ResolutionTypeHint.STRING));
    this.countryCode = props.countryCode;
    this.description = props.description;
    this.prefix = props.prefix;
    this.sourcePhoneNumberArn = props.sourcePhoneNumberArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::PhoneNumber", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targetArn = props.targetArn;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "countryCode": this.countryCode,
      "description": this.description,
      "prefix": this.prefix,
      "sourcePhoneNumberArn": this.sourcePhoneNumberArn,
      "tags": this.tags.renderTags(),
      "targetArn": this.targetArn,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPhoneNumber.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPhoneNumberPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPhoneNumber`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html
 */
export interface CfnPhoneNumberProps {
  /**
   * The ISO country code.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-countrycode
   */
  readonly countryCode?: string;

  /**
   * The description of the phone number.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-description
   */
  readonly description?: string;

  /**
   * The prefix of the phone number. If provided, it must contain `+` as part of the country code.
   *
   * *Pattern* : `^\\+[0-9]{1,15}`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-prefix
   */
  readonly prefix?: string;

  /**
   * The claimed phone number ARN that was previously imported from the external service, such as Amazon Pinpoint.
   *
   * If it is from Amazon Pinpoint, it looks like the ARN of the phone number that was imported from Amazon Pinpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-sourcephonenumberarn
   */
  readonly sourcePhoneNumberArn?: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * For example, { "tags": {"key1":"value1", "key2":"value2"} }.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The Amazon Resource Name (ARN) for Amazon Connect instances or traffic distribution group that phone numbers are claimed to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-targetarn
   */
  readonly targetArn: string;

  /**
   * The type of phone number.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-phonenumber.html#cfn-connect-phonenumber-type
   */
  readonly type?: string;
}

/**
 * Determine whether the given properties match those of a `CfnPhoneNumberProps`
 *
 * @param properties - the TypeScript properties of a `CfnPhoneNumberProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPhoneNumberPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("countryCode", cdk.validateString)(properties.countryCode));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("sourcePhoneNumberArn", cdk.validateString)(properties.sourcePhoneNumberArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("targetArn", cdk.requiredValidator)(properties.targetArn));
  errors.collect(cdk.propertyValidator("targetArn", cdk.validateString)(properties.targetArn));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnPhoneNumberProps\"");
}

// @ts-ignore TS6133
function convertCfnPhoneNumberPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPhoneNumberPropsValidator(properties).assertSuccess();
  return {
    "CountryCode": cdk.stringToCloudFormation(properties.countryCode),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "SourcePhoneNumberArn": cdk.stringToCloudFormation(properties.sourcePhoneNumberArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TargetArn": cdk.stringToCloudFormation(properties.targetArn),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnPhoneNumberPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPhoneNumberProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPhoneNumberProps>();
  ret.addPropertyResult("countryCode", "CountryCode", (properties.CountryCode != null ? cfn_parse.FromCloudFormation.getString(properties.CountryCode) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("sourcePhoneNumberArn", "SourcePhoneNumberArn", (properties.SourcePhoneNumberArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourcePhoneNumberArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("targetArn", "TargetArn", (properties.TargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetArn) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a prompt for the specified Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::Prompt
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-prompt.html
 */
export class CfnPrompt extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::Prompt";

  /**
   * Build a CfnPrompt from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPrompt {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPromptPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPrompt(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the prompt.
   *
   * @cloudformationAttribute PromptArn
   */
  public readonly attrPromptArn: string;

  /**
   * The description of the prompt.
   */
  public description?: string;

  /**
   * The identifier of the Amazon Connect instance.
   */
  public instanceArn: string;

  /**
   * The name of the prompt.
   */
  public name: string;

  /**
   * The URI for the S3 bucket where the prompt is stored.
   */
  public s3Uri?: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPromptProps) {
    super(scope, id, {
      "type": CfnPrompt.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "name", this);

    this.attrPromptArn = cdk.Token.asString(this.getAtt("PromptArn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.instanceArn = props.instanceArn;
    this.name = props.name;
    this.s3Uri = props.s3Uri;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "instanceArn": this.instanceArn,
      "name": this.name,
      "s3Uri": this.s3Uri,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPrompt.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPromptPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPrompt`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-prompt.html
 */
export interface CfnPromptProps {
  /**
   * The description of the prompt.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-prompt.html#cfn-connect-prompt-description
   */
  readonly description?: string;

  /**
   * The identifier of the Amazon Connect instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-prompt.html#cfn-connect-prompt-instancearn
   */
  readonly instanceArn: string;

  /**
   * The name of the prompt.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-prompt.html#cfn-connect-prompt-name
   */
  readonly name: string;

  /**
   * The URI for the S3 bucket where the prompt is stored.
   *
   * This property is required when you create a prompt.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-prompt.html#cfn-connect-prompt-s3uri
   */
  readonly s3Uri?: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * For example, { "tags": {"key1":"value1", "key2":"value2"} }.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-prompt.html#cfn-connect-prompt-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnPromptProps`
 *
 * @param properties - the TypeScript properties of a `CfnPromptProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPromptPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("s3Uri", cdk.validateString)(properties.s3Uri));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPromptProps\"");
}

// @ts-ignore TS6133
function convertCfnPromptPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPromptPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "S3Uri": cdk.stringToCloudFormation(properties.s3Uri),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPromptPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPromptProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPromptProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("s3Uri", "S3Uri", (properties.S3Uri != null ? cfn_parse.FromCloudFormation.getString(properties.S3Uri) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Contains information about a queue.
 *
 * @cloudformationResource AWS::Connect::Queue
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-queue.html
 */
export class CfnQueue extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::Queue";

  /**
   * Build a CfnQueue from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnQueue {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnQueuePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnQueue(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the queue.
   *
   * @cloudformationAttribute QueueArn
   */
  public readonly attrQueueArn: string;

  /**
   * The type of queue.
   *
   * @cloudformationAttribute Type
   */
  public readonly attrType: string;

  /**
   * The description of the queue.
   */
  public description?: string;

  /**
   * The Amazon Resource Name (ARN) of the hours of operation.
   */
  public hoursOfOperationArn: string;

  /**
   * The identifier of the Amazon Connect instance.
   */
  public instanceArn: string;

  /**
   * The maximum number of contacts that can be in the queue before it is considered full.
   */
  public maxContacts?: number;

  /**
   * The name of the queue.
   */
  public name: string;

  /**
   * The outbound caller ID name, number, and outbound whisper flow.
   */
  public outboundCallerConfig?: cdk.IResolvable | CfnQueue.OutboundCallerConfigProperty;

  /**
   * The Amazon Resource Names (ARN) of the of the quick connects available to agents who are working the queue.
   */
  public quickConnectArns?: Array<string>;

  /**
   * The status of the queue.
   */
  public status?: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnQueueProps) {
    super(scope, id, {
      "type": CfnQueue.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "hoursOfOperationArn", this);
    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "name", this);

    this.attrQueueArn = cdk.Token.asString(this.getAtt("QueueArn", cdk.ResolutionTypeHint.STRING));
    this.attrType = cdk.Token.asString(this.getAtt("Type", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.hoursOfOperationArn = props.hoursOfOperationArn;
    this.instanceArn = props.instanceArn;
    this.maxContacts = props.maxContacts;
    this.name = props.name;
    this.outboundCallerConfig = props.outboundCallerConfig;
    this.quickConnectArns = props.quickConnectArns;
    this.status = props.status;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "hoursOfOperationArn": this.hoursOfOperationArn,
      "instanceArn": this.instanceArn,
      "maxContacts": this.maxContacts,
      "name": this.name,
      "outboundCallerConfig": this.outboundCallerConfig,
      "quickConnectArns": this.quickConnectArns,
      "status": this.status,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnQueue.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnQueuePropsToCloudFormation(props);
  }
}

export namespace CfnQueue {
  /**
   * The outbound caller ID name, number, and outbound whisper flow.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-queue-outboundcallerconfig.html
   */
  export interface OutboundCallerConfigProperty {
    /**
     * The caller ID name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-queue-outboundcallerconfig.html#cfn-connect-queue-outboundcallerconfig-outboundcalleridname
     */
    readonly outboundCallerIdName?: string;

    /**
     * The Amazon Resource Name (ARN) of the outbound caller ID number.
     *
     * > Only use the phone number ARN format that doesn't contain `instance` in the path, for example, `arn:aws:connect:us-east-1:1234567890:phone-number/uuid` . This is the same ARN format that is returned when you create a phone number using CloudFormation , or when you call the [ListPhoneNumbersV2](https://docs.aws.amazon.com/connect/latest/APIReference/API_ListPhoneNumbersV2.html) API.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-queue-outboundcallerconfig.html#cfn-connect-queue-outboundcallerconfig-outboundcalleridnumberarn
     */
    readonly outboundCallerIdNumberArn?: string;

    /**
     * The Amazon Resource Name (ARN) of the outbound flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-queue-outboundcallerconfig.html#cfn-connect-queue-outboundcallerconfig-outboundflowarn
     */
    readonly outboundFlowArn?: string;
  }
}

/**
 * Properties for defining a `CfnQueue`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-queue.html
 */
export interface CfnQueueProps {
  /**
   * The description of the queue.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-queue.html#cfn-connect-queue-description
   */
  readonly description?: string;

  /**
   * The Amazon Resource Name (ARN) of the hours of operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-queue.html#cfn-connect-queue-hoursofoperationarn
   */
  readonly hoursOfOperationArn: string;

  /**
   * The identifier of the Amazon Connect instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-queue.html#cfn-connect-queue-instancearn
   */
  readonly instanceArn: string;

  /**
   * The maximum number of contacts that can be in the queue before it is considered full.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-queue.html#cfn-connect-queue-maxcontacts
   */
  readonly maxContacts?: number;

  /**
   * The name of the queue.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-queue.html#cfn-connect-queue-name
   */
  readonly name: string;

  /**
   * The outbound caller ID name, number, and outbound whisper flow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-queue.html#cfn-connect-queue-outboundcallerconfig
   */
  readonly outboundCallerConfig?: cdk.IResolvable | CfnQueue.OutboundCallerConfigProperty;

  /**
   * The Amazon Resource Names (ARN) of the of the quick connects available to agents who are working the queue.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-queue.html#cfn-connect-queue-quickconnectarns
   */
  readonly quickConnectArns?: Array<string>;

  /**
   * The status of the queue.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-queue.html#cfn-connect-queue-status
   */
  readonly status?: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * For example, { "Tags": {"key1":"value1", "key2":"value2"} }.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-queue.html#cfn-connect-queue-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `OutboundCallerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OutboundCallerConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnQueueOutboundCallerConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("outboundCallerIdName", cdk.validateString)(properties.outboundCallerIdName));
  errors.collect(cdk.propertyValidator("outboundCallerIdNumberArn", cdk.validateString)(properties.outboundCallerIdNumberArn));
  errors.collect(cdk.propertyValidator("outboundFlowArn", cdk.validateString)(properties.outboundFlowArn));
  return errors.wrap("supplied properties not correct for \"OutboundCallerConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnQueueOutboundCallerConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnQueueOutboundCallerConfigPropertyValidator(properties).assertSuccess();
  return {
    "OutboundCallerIdName": cdk.stringToCloudFormation(properties.outboundCallerIdName),
    "OutboundCallerIdNumberArn": cdk.stringToCloudFormation(properties.outboundCallerIdNumberArn),
    "OutboundFlowArn": cdk.stringToCloudFormation(properties.outboundFlowArn)
  };
}

// @ts-ignore TS6133
function CfnQueueOutboundCallerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnQueue.OutboundCallerConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQueue.OutboundCallerConfigProperty>();
  ret.addPropertyResult("outboundCallerIdName", "OutboundCallerIdName", (properties.OutboundCallerIdName != null ? cfn_parse.FromCloudFormation.getString(properties.OutboundCallerIdName) : undefined));
  ret.addPropertyResult("outboundCallerIdNumberArn", "OutboundCallerIdNumberArn", (properties.OutboundCallerIdNumberArn != null ? cfn_parse.FromCloudFormation.getString(properties.OutboundCallerIdNumberArn) : undefined));
  ret.addPropertyResult("outboundFlowArn", "OutboundFlowArn", (properties.OutboundFlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.OutboundFlowArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnQueueProps`
 *
 * @param properties - the TypeScript properties of a `CfnQueueProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnQueuePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("hoursOfOperationArn", cdk.requiredValidator)(properties.hoursOfOperationArn));
  errors.collect(cdk.propertyValidator("hoursOfOperationArn", cdk.validateString)(properties.hoursOfOperationArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("maxContacts", cdk.validateNumber)(properties.maxContacts));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("outboundCallerConfig", CfnQueueOutboundCallerConfigPropertyValidator)(properties.outboundCallerConfig));
  errors.collect(cdk.propertyValidator("quickConnectArns", cdk.listValidator(cdk.validateString))(properties.quickConnectArns));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnQueueProps\"");
}

// @ts-ignore TS6133
function convertCfnQueuePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnQueuePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "HoursOfOperationArn": cdk.stringToCloudFormation(properties.hoursOfOperationArn),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "MaxContacts": cdk.numberToCloudFormation(properties.maxContacts),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OutboundCallerConfig": convertCfnQueueOutboundCallerConfigPropertyToCloudFormation(properties.outboundCallerConfig),
    "QuickConnectArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.quickConnectArns),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnQueuePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnQueueProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQueueProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("hoursOfOperationArn", "HoursOfOperationArn", (properties.HoursOfOperationArn != null ? cfn_parse.FromCloudFormation.getString(properties.HoursOfOperationArn) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("maxContacts", "MaxContacts", (properties.MaxContacts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxContacts) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("outboundCallerConfig", "OutboundCallerConfig", (properties.OutboundCallerConfig != null ? CfnQueueOutboundCallerConfigPropertyFromCloudFormation(properties.OutboundCallerConfig) : undefined));
  ret.addPropertyResult("quickConnectArns", "QuickConnectArns", (properties.QuickConnectArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.QuickConnectArns) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a quick connect for an Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::QuickConnect
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html
 */
export class CfnQuickConnect extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::QuickConnect";

  /**
   * Build a CfnQuickConnect from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnQuickConnect {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnQuickConnectPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnQuickConnect(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) for the quick connect.
   *
   * @cloudformationAttribute QuickConnectArn
   */
  public readonly attrQuickConnectArn: string;

  /**
   * The type of quick connect. In the Amazon Connect admin website, when you create a quick connect, you are prompted to assign one of the following types: Agent (USER), External (PHONE_NUMBER), or Queue (QUEUE).
   *
   * @cloudformationAttribute QuickConnectType
   */
  public readonly attrQuickConnectType: string;

  /**
   * The description of the quick connect.
   */
  public description?: string;

  /**
   * The Amazon Resource Name (ARN) of the instance.
   */
  public instanceArn: string;

  /**
   * The name of the quick connect.
   */
  public name: string;

  /**
   * Contains information about the quick connect.
   */
  public quickConnectConfig: cdk.IResolvable | CfnQuickConnect.QuickConnectConfigProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnQuickConnectProps) {
    super(scope, id, {
      "type": CfnQuickConnect.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "quickConnectConfig", this);

    this.attrQuickConnectArn = cdk.Token.asString(this.getAtt("QuickConnectArn", cdk.ResolutionTypeHint.STRING));
    this.attrQuickConnectType = cdk.Token.asString(this.getAtt("QuickConnectType", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.instanceArn = props.instanceArn;
    this.name = props.name;
    this.quickConnectConfig = props.quickConnectConfig;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::QuickConnect", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "instanceArn": this.instanceArn,
      "name": this.name,
      "quickConnectConfig": this.quickConnectConfig,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnQuickConnect.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnQuickConnectPropsToCloudFormation(props);
  }
}

export namespace CfnQuickConnect {
  /**
   * Contains configuration settings for a quick connect.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html
   */
  export interface QuickConnectConfigProperty {
    /**
     * The phone configuration.
     *
     * This is required only if QuickConnectType is PHONE_NUMBER.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html#cfn-connect-quickconnect-quickconnectconfig-phoneconfig
     */
    readonly phoneConfig?: cdk.IResolvable | CfnQuickConnect.PhoneNumberQuickConnectConfigProperty;

    /**
     * The queue configuration.
     *
     * This is required only if QuickConnectType is QUEUE.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html#cfn-connect-quickconnect-quickconnectconfig-queueconfig
     */
    readonly queueConfig?: cdk.IResolvable | CfnQuickConnect.QueueQuickConnectConfigProperty;

    /**
     * The type of quick connect.
     *
     * In the Amazon Connect console, when you create a quick connect, you are prompted to assign one of the following types: Agent (USER), External (PHONE_NUMBER), or Queue (QUEUE).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html#cfn-connect-quickconnect-quickconnectconfig-quickconnecttype
     */
    readonly quickConnectType: string;

    /**
     * The user configuration.
     *
     * This is required only if QuickConnectType is USER.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-quickconnectconfig.html#cfn-connect-quickconnect-quickconnectconfig-userconfig
     */
    readonly userConfig?: cdk.IResolvable | CfnQuickConnect.UserQuickConnectConfigProperty;
  }

  /**
   * Contains information about a queue for a quick connect.
   *
   * The flow must be of type Transfer to Queue.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-queuequickconnectconfig.html
   */
  export interface QueueQuickConnectConfigProperty {
    /**
     * The Amazon Resource Name (ARN) of the flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-queuequickconnectconfig.html#cfn-connect-quickconnect-queuequickconnectconfig-contactflowarn
     */
    readonly contactFlowArn: string;

    /**
     * The Amazon Resource Name (ARN) of the queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-queuequickconnectconfig.html#cfn-connect-quickconnect-queuequickconnectconfig-queuearn
     */
    readonly queueArn: string;
  }

  /**
   * Contains information about a phone number for a quick connect.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-phonenumberquickconnectconfig.html
   */
  export interface PhoneNumberQuickConnectConfigProperty {
    /**
     * The phone number in E.164 format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-phonenumberquickconnectconfig.html#cfn-connect-quickconnect-phonenumberquickconnectconfig-phonenumber
     */
    readonly phoneNumber: string;
  }

  /**
   * Contains information about the quick connect configuration settings for a user.
   *
   * The contact flow must be of type Transfer to Agent.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-userquickconnectconfig.html
   */
  export interface UserQuickConnectConfigProperty {
    /**
     * The Amazon Resource Name (ARN) of the flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-userquickconnectconfig.html#cfn-connect-quickconnect-userquickconnectconfig-contactflowarn
     */
    readonly contactFlowArn: string;

    /**
     * The Amazon Resource Name (ARN) of the user.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-quickconnect-userquickconnectconfig.html#cfn-connect-quickconnect-userquickconnectconfig-userarn
     */
    readonly userArn: string;
  }
}

/**
 * Properties for defining a `CfnQuickConnect`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html
 */
export interface CfnQuickConnectProps {
  /**
   * The description of the quick connect.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-description
   */
  readonly description?: string;

  /**
   * The Amazon Resource Name (ARN) of the instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-instancearn
   */
  readonly instanceArn: string;

  /**
   * The name of the quick connect.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-name
   */
  readonly name: string;

  /**
   * Contains information about the quick connect.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-quickconnectconfig
   */
  readonly quickConnectConfig: cdk.IResolvable | CfnQuickConnect.QuickConnectConfigProperty;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * For example, { "Tags": {"key1":"value1", "key2":"value2"} }.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-quickconnect.html#cfn-connect-quickconnect-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `QueueQuickConnectConfigProperty`
 *
 * @param properties - the TypeScript properties of a `QueueQuickConnectConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnQuickConnectQueueQuickConnectConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contactFlowArn", cdk.requiredValidator)(properties.contactFlowArn));
  errors.collect(cdk.propertyValidator("contactFlowArn", cdk.validateString)(properties.contactFlowArn));
  errors.collect(cdk.propertyValidator("queueArn", cdk.requiredValidator)(properties.queueArn));
  errors.collect(cdk.propertyValidator("queueArn", cdk.validateString)(properties.queueArn));
  return errors.wrap("supplied properties not correct for \"QueueQuickConnectConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnQuickConnectQueueQuickConnectConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnQuickConnectQueueQuickConnectConfigPropertyValidator(properties).assertSuccess();
  return {
    "ContactFlowArn": cdk.stringToCloudFormation(properties.contactFlowArn),
    "QueueArn": cdk.stringToCloudFormation(properties.queueArn)
  };
}

// @ts-ignore TS6133
function CfnQuickConnectQueueQuickConnectConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnQuickConnect.QueueQuickConnectConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQuickConnect.QueueQuickConnectConfigProperty>();
  ret.addPropertyResult("contactFlowArn", "ContactFlowArn", (properties.ContactFlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.ContactFlowArn) : undefined));
  ret.addPropertyResult("queueArn", "QueueArn", (properties.QueueArn != null ? cfn_parse.FromCloudFormation.getString(properties.QueueArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PhoneNumberQuickConnectConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PhoneNumberQuickConnectConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnQuickConnectPhoneNumberQuickConnectConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("phoneNumber", cdk.requiredValidator)(properties.phoneNumber));
  errors.collect(cdk.propertyValidator("phoneNumber", cdk.validateString)(properties.phoneNumber));
  return errors.wrap("supplied properties not correct for \"PhoneNumberQuickConnectConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnQuickConnectPhoneNumberQuickConnectConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnQuickConnectPhoneNumberQuickConnectConfigPropertyValidator(properties).assertSuccess();
  return {
    "PhoneNumber": cdk.stringToCloudFormation(properties.phoneNumber)
  };
}

// @ts-ignore TS6133
function CfnQuickConnectPhoneNumberQuickConnectConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnQuickConnect.PhoneNumberQuickConnectConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQuickConnect.PhoneNumberQuickConnectConfigProperty>();
  ret.addPropertyResult("phoneNumber", "PhoneNumber", (properties.PhoneNumber != null ? cfn_parse.FromCloudFormation.getString(properties.PhoneNumber) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UserQuickConnectConfigProperty`
 *
 * @param properties - the TypeScript properties of a `UserQuickConnectConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnQuickConnectUserQuickConnectConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contactFlowArn", cdk.requiredValidator)(properties.contactFlowArn));
  errors.collect(cdk.propertyValidator("contactFlowArn", cdk.validateString)(properties.contactFlowArn));
  errors.collect(cdk.propertyValidator("userArn", cdk.requiredValidator)(properties.userArn));
  errors.collect(cdk.propertyValidator("userArn", cdk.validateString)(properties.userArn));
  return errors.wrap("supplied properties not correct for \"UserQuickConnectConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnQuickConnectUserQuickConnectConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnQuickConnectUserQuickConnectConfigPropertyValidator(properties).assertSuccess();
  return {
    "ContactFlowArn": cdk.stringToCloudFormation(properties.contactFlowArn),
    "UserArn": cdk.stringToCloudFormation(properties.userArn)
  };
}

// @ts-ignore TS6133
function CfnQuickConnectUserQuickConnectConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnQuickConnect.UserQuickConnectConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQuickConnect.UserQuickConnectConfigProperty>();
  ret.addPropertyResult("contactFlowArn", "ContactFlowArn", (properties.ContactFlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.ContactFlowArn) : undefined));
  ret.addPropertyResult("userArn", "UserArn", (properties.UserArn != null ? cfn_parse.FromCloudFormation.getString(properties.UserArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `QuickConnectConfigProperty`
 *
 * @param properties - the TypeScript properties of a `QuickConnectConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnQuickConnectQuickConnectConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("phoneConfig", CfnQuickConnectPhoneNumberQuickConnectConfigPropertyValidator)(properties.phoneConfig));
  errors.collect(cdk.propertyValidator("queueConfig", CfnQuickConnectQueueQuickConnectConfigPropertyValidator)(properties.queueConfig));
  errors.collect(cdk.propertyValidator("quickConnectType", cdk.requiredValidator)(properties.quickConnectType));
  errors.collect(cdk.propertyValidator("quickConnectType", cdk.validateString)(properties.quickConnectType));
  errors.collect(cdk.propertyValidator("userConfig", CfnQuickConnectUserQuickConnectConfigPropertyValidator)(properties.userConfig));
  return errors.wrap("supplied properties not correct for \"QuickConnectConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnQuickConnectQuickConnectConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnQuickConnectQuickConnectConfigPropertyValidator(properties).assertSuccess();
  return {
    "PhoneConfig": convertCfnQuickConnectPhoneNumberQuickConnectConfigPropertyToCloudFormation(properties.phoneConfig),
    "QueueConfig": convertCfnQuickConnectQueueQuickConnectConfigPropertyToCloudFormation(properties.queueConfig),
    "QuickConnectType": cdk.stringToCloudFormation(properties.quickConnectType),
    "UserConfig": convertCfnQuickConnectUserQuickConnectConfigPropertyToCloudFormation(properties.userConfig)
  };
}

// @ts-ignore TS6133
function CfnQuickConnectQuickConnectConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnQuickConnect.QuickConnectConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQuickConnect.QuickConnectConfigProperty>();
  ret.addPropertyResult("phoneConfig", "PhoneConfig", (properties.PhoneConfig != null ? CfnQuickConnectPhoneNumberQuickConnectConfigPropertyFromCloudFormation(properties.PhoneConfig) : undefined));
  ret.addPropertyResult("queueConfig", "QueueConfig", (properties.QueueConfig != null ? CfnQuickConnectQueueQuickConnectConfigPropertyFromCloudFormation(properties.QueueConfig) : undefined));
  ret.addPropertyResult("quickConnectType", "QuickConnectType", (properties.QuickConnectType != null ? cfn_parse.FromCloudFormation.getString(properties.QuickConnectType) : undefined));
  ret.addPropertyResult("userConfig", "UserConfig", (properties.UserConfig != null ? CfnQuickConnectUserQuickConnectConfigPropertyFromCloudFormation(properties.UserConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnQuickConnectProps`
 *
 * @param properties - the TypeScript properties of a `CfnQuickConnectProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnQuickConnectPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("quickConnectConfig", cdk.requiredValidator)(properties.quickConnectConfig));
  errors.collect(cdk.propertyValidator("quickConnectConfig", CfnQuickConnectQuickConnectConfigPropertyValidator)(properties.quickConnectConfig));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnQuickConnectProps\"");
}

// @ts-ignore TS6133
function convertCfnQuickConnectPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnQuickConnectPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "QuickConnectConfig": convertCfnQuickConnectQuickConnectConfigPropertyToCloudFormation(properties.quickConnectConfig),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnQuickConnectPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnQuickConnectProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQuickConnectProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("quickConnectConfig", "QuickConnectConfig", (properties.QuickConnectConfig != null ? CfnQuickConnectQuickConnectConfigPropertyFromCloudFormation(properties.QuickConnectConfig) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a new routing profile.
 *
 * @cloudformationResource AWS::Connect::RoutingProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-routingprofile.html
 */
export class CfnRoutingProfile extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::RoutingProfile";

  /**
   * Build a CfnRoutingProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRoutingProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRoutingProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRoutingProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the routing profile.
   *
   * @cloudformationAttribute RoutingProfileArn
   */
  public readonly attrRoutingProfileArn: string;

  /**
   * Whether agents with this routing profile will have their routing order calculated based on *time since their last inbound contact* or *longest idle time* .
   */
  public agentAvailabilityTimer?: string;

  /**
   * The Amazon Resource Name (ARN) of the default outbound queue for the routing profile.
   */
  public defaultOutboundQueueArn: string;

  /**
   * The description of the routing profile.
   */
  public description: string;

  /**
   * The identifier of the Amazon Connect instance.
   */
  public instanceArn: string;

  /**
   * The channels agents can handle in the Contact Control Panel (CCP) for this routing profile.
   */
  public mediaConcurrencies: Array<cdk.IResolvable | CfnRoutingProfile.MediaConcurrencyProperty> | cdk.IResolvable;

  /**
   * The name of the routing profile.
   */
  public name: string;

  /**
   * The inbound queues associated with the routing profile.
   */
  public queueConfigs?: Array<cdk.IResolvable | CfnRoutingProfile.RoutingProfileQueueConfigProperty> | cdk.IResolvable;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRoutingProfileProps) {
    super(scope, id, {
      "type": CfnRoutingProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "defaultOutboundQueueArn", this);
    cdk.requireProperty(props, "description", this);
    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "mediaConcurrencies", this);
    cdk.requireProperty(props, "name", this);

    this.attrRoutingProfileArn = cdk.Token.asString(this.getAtt("RoutingProfileArn", cdk.ResolutionTypeHint.STRING));
    this.agentAvailabilityTimer = props.agentAvailabilityTimer;
    this.defaultOutboundQueueArn = props.defaultOutboundQueueArn;
    this.description = props.description;
    this.instanceArn = props.instanceArn;
    this.mediaConcurrencies = props.mediaConcurrencies;
    this.name = props.name;
    this.queueConfigs = props.queueConfigs;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "agentAvailabilityTimer": this.agentAvailabilityTimer,
      "defaultOutboundQueueArn": this.defaultOutboundQueueArn,
      "description": this.description,
      "instanceArn": this.instanceArn,
      "mediaConcurrencies": this.mediaConcurrencies,
      "name": this.name,
      "queueConfigs": this.queueConfigs,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRoutingProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRoutingProfilePropsToCloudFormation(props);
  }
}

export namespace CfnRoutingProfile {
  /**
   * Contains information about which channels are supported, and how many contacts an agent can have on a channel simultaneously.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-routingprofile-mediaconcurrency.html
   */
  export interface MediaConcurrencyProperty {
    /**
     * The channels that agents can handle in the Contact Control Panel (CCP).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-routingprofile-mediaconcurrency.html#cfn-connect-routingprofile-mediaconcurrency-channel
     */
    readonly channel: string;

    /**
     * The number of contacts an agent can have on a channel simultaneously.
     *
     * Valid Range for `VOICE` : Minimum value of 1. Maximum value of 1.
     *
     * Valid Range for `CHAT` : Minimum value of 1. Maximum value of 10.
     *
     * Valid Range for `TASK` : Minimum value of 1. Maximum value of 10.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-routingprofile-mediaconcurrency.html#cfn-connect-routingprofile-mediaconcurrency-concurrency
     */
    readonly concurrency: number;

    /**
     * Defines the cross-channel routing behavior for each channel that is enabled for this Routing Profile.
     *
     * For example, this allows you to offer an agent a different contact from another channel when they are currently working with a contact from a Voice channel.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-routingprofile-mediaconcurrency.html#cfn-connect-routingprofile-mediaconcurrency-crosschannelbehavior
     */
    readonly crossChannelBehavior?: CfnRoutingProfile.CrossChannelBehaviorProperty | cdk.IResolvable;
  }

  /**
   * Defines the cross-channel routing behavior that allows an agent working on a contact in one channel to be offered a contact from a different channel.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-routingprofile-crosschannelbehavior.html
   */
  export interface CrossChannelBehaviorProperty {
    /**
     * Specifies the other channels that can be routed to an agent handling their current channel.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-routingprofile-crosschannelbehavior.html#cfn-connect-routingprofile-crosschannelbehavior-behaviortype
     */
    readonly behaviorType: string;
  }

  /**
   * Contains information about the queue and channel for which priority and delay can be set.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-routingprofile-routingprofilequeueconfig.html
   */
  export interface RoutingProfileQueueConfigProperty {
    /**
     * The delay, in seconds, a contact should be in the queue before they are routed to an available agent.
     *
     * For more information, see [Queues: priority and delay](https://docs.aws.amazon.com/connect/latest/adminguide/concepts-routing-profiles-priority.html) in the *Amazon Connect Administrator Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-routingprofile-routingprofilequeueconfig.html#cfn-connect-routingprofile-routingprofilequeueconfig-delay
     */
    readonly delay: number;

    /**
     * The order in which contacts are to be handled for the queue.
     *
     * For more information, see [Queues: priority and delay](https://docs.aws.amazon.com/connect/latest/adminguide/concepts-routing-profiles-priority.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-routingprofile-routingprofilequeueconfig.html#cfn-connect-routingprofile-routingprofilequeueconfig-priority
     */
    readonly priority: number;

    /**
     * Contains information about a queue resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-routingprofile-routingprofilequeueconfig.html#cfn-connect-routingprofile-routingprofilequeueconfig-queuereference
     */
    readonly queueReference: cdk.IResolvable | CfnRoutingProfile.RoutingProfileQueueReferenceProperty;
  }

  /**
   * Contains the channel and queue identifier for a routing profile.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-routingprofile-routingprofilequeuereference.html
   */
  export interface RoutingProfileQueueReferenceProperty {
    /**
     * The channels agents can handle in the Contact Control Panel (CCP) for this routing profile.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-routingprofile-routingprofilequeuereference.html#cfn-connect-routingprofile-routingprofilequeuereference-channel
     */
    readonly channel: string;

    /**
     * The Amazon Resource Name (ARN) of the queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-routingprofile-routingprofilequeuereference.html#cfn-connect-routingprofile-routingprofilequeuereference-queuearn
     */
    readonly queueArn: string;
  }
}

/**
 * Properties for defining a `CfnRoutingProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-routingprofile.html
 */
export interface CfnRoutingProfileProps {
  /**
   * Whether agents with this routing profile will have their routing order calculated based on *time since their last inbound contact* or *longest idle time* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-routingprofile.html#cfn-connect-routingprofile-agentavailabilitytimer
   */
  readonly agentAvailabilityTimer?: string;

  /**
   * The Amazon Resource Name (ARN) of the default outbound queue for the routing profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-routingprofile.html#cfn-connect-routingprofile-defaultoutboundqueuearn
   */
  readonly defaultOutboundQueueArn: string;

  /**
   * The description of the routing profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-routingprofile.html#cfn-connect-routingprofile-description
   */
  readonly description: string;

  /**
   * The identifier of the Amazon Connect instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-routingprofile.html#cfn-connect-routingprofile-instancearn
   */
  readonly instanceArn: string;

  /**
   * The channels agents can handle in the Contact Control Panel (CCP) for this routing profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-routingprofile.html#cfn-connect-routingprofile-mediaconcurrencies
   */
  readonly mediaConcurrencies: Array<cdk.IResolvable | CfnRoutingProfile.MediaConcurrencyProperty> | cdk.IResolvable;

  /**
   * The name of the routing profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-routingprofile.html#cfn-connect-routingprofile-name
   */
  readonly name: string;

  /**
   * The inbound queues associated with the routing profile.
   *
   * If no queue is added, the agent can make only outbound calls.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-routingprofile.html#cfn-connect-routingprofile-queueconfigs
   */
  readonly queueConfigs?: Array<cdk.IResolvable | CfnRoutingProfile.RoutingProfileQueueConfigProperty> | cdk.IResolvable;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * For example, { "Tags": {"key1":"value1", "key2":"value2"} }.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-routingprofile.html#cfn-connect-routingprofile-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CrossChannelBehaviorProperty`
 *
 * @param properties - the TypeScript properties of a `CrossChannelBehaviorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRoutingProfileCrossChannelBehaviorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("behaviorType", cdk.requiredValidator)(properties.behaviorType));
  errors.collect(cdk.propertyValidator("behaviorType", cdk.validateString)(properties.behaviorType));
  return errors.wrap("supplied properties not correct for \"CrossChannelBehaviorProperty\"");
}

// @ts-ignore TS6133
function convertCfnRoutingProfileCrossChannelBehaviorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRoutingProfileCrossChannelBehaviorPropertyValidator(properties).assertSuccess();
  return {
    "BehaviorType": cdk.stringToCloudFormation(properties.behaviorType)
  };
}

// @ts-ignore TS6133
function CfnRoutingProfileCrossChannelBehaviorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoutingProfile.CrossChannelBehaviorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoutingProfile.CrossChannelBehaviorProperty>();
  ret.addPropertyResult("behaviorType", "BehaviorType", (properties.BehaviorType != null ? cfn_parse.FromCloudFormation.getString(properties.BehaviorType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MediaConcurrencyProperty`
 *
 * @param properties - the TypeScript properties of a `MediaConcurrencyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRoutingProfileMediaConcurrencyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channel", cdk.requiredValidator)(properties.channel));
  errors.collect(cdk.propertyValidator("channel", cdk.validateString)(properties.channel));
  errors.collect(cdk.propertyValidator("concurrency", cdk.requiredValidator)(properties.concurrency));
  errors.collect(cdk.propertyValidator("concurrency", cdk.validateNumber)(properties.concurrency));
  errors.collect(cdk.propertyValidator("crossChannelBehavior", CfnRoutingProfileCrossChannelBehaviorPropertyValidator)(properties.crossChannelBehavior));
  return errors.wrap("supplied properties not correct for \"MediaConcurrencyProperty\"");
}

// @ts-ignore TS6133
function convertCfnRoutingProfileMediaConcurrencyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRoutingProfileMediaConcurrencyPropertyValidator(properties).assertSuccess();
  return {
    "Channel": cdk.stringToCloudFormation(properties.channel),
    "Concurrency": cdk.numberToCloudFormation(properties.concurrency),
    "CrossChannelBehavior": convertCfnRoutingProfileCrossChannelBehaviorPropertyToCloudFormation(properties.crossChannelBehavior)
  };
}

// @ts-ignore TS6133
function CfnRoutingProfileMediaConcurrencyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRoutingProfile.MediaConcurrencyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoutingProfile.MediaConcurrencyProperty>();
  ret.addPropertyResult("channel", "Channel", (properties.Channel != null ? cfn_parse.FromCloudFormation.getString(properties.Channel) : undefined));
  ret.addPropertyResult("concurrency", "Concurrency", (properties.Concurrency != null ? cfn_parse.FromCloudFormation.getNumber(properties.Concurrency) : undefined));
  ret.addPropertyResult("crossChannelBehavior", "CrossChannelBehavior", (properties.CrossChannelBehavior != null ? CfnRoutingProfileCrossChannelBehaviorPropertyFromCloudFormation(properties.CrossChannelBehavior) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RoutingProfileQueueReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `RoutingProfileQueueReferenceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRoutingProfileRoutingProfileQueueReferencePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channel", cdk.requiredValidator)(properties.channel));
  errors.collect(cdk.propertyValidator("channel", cdk.validateString)(properties.channel));
  errors.collect(cdk.propertyValidator("queueArn", cdk.requiredValidator)(properties.queueArn));
  errors.collect(cdk.propertyValidator("queueArn", cdk.validateString)(properties.queueArn));
  return errors.wrap("supplied properties not correct for \"RoutingProfileQueueReferenceProperty\"");
}

// @ts-ignore TS6133
function convertCfnRoutingProfileRoutingProfileQueueReferencePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRoutingProfileRoutingProfileQueueReferencePropertyValidator(properties).assertSuccess();
  return {
    "Channel": cdk.stringToCloudFormation(properties.channel),
    "QueueArn": cdk.stringToCloudFormation(properties.queueArn)
  };
}

// @ts-ignore TS6133
function CfnRoutingProfileRoutingProfileQueueReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRoutingProfile.RoutingProfileQueueReferenceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoutingProfile.RoutingProfileQueueReferenceProperty>();
  ret.addPropertyResult("channel", "Channel", (properties.Channel != null ? cfn_parse.FromCloudFormation.getString(properties.Channel) : undefined));
  ret.addPropertyResult("queueArn", "QueueArn", (properties.QueueArn != null ? cfn_parse.FromCloudFormation.getString(properties.QueueArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RoutingProfileQueueConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RoutingProfileQueueConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRoutingProfileRoutingProfileQueueConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("delay", cdk.requiredValidator)(properties.delay));
  errors.collect(cdk.propertyValidator("delay", cdk.validateNumber)(properties.delay));
  errors.collect(cdk.propertyValidator("priority", cdk.requiredValidator)(properties.priority));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  errors.collect(cdk.propertyValidator("queueReference", cdk.requiredValidator)(properties.queueReference));
  errors.collect(cdk.propertyValidator("queueReference", CfnRoutingProfileRoutingProfileQueueReferencePropertyValidator)(properties.queueReference));
  return errors.wrap("supplied properties not correct for \"RoutingProfileQueueConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnRoutingProfileRoutingProfileQueueConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRoutingProfileRoutingProfileQueueConfigPropertyValidator(properties).assertSuccess();
  return {
    "Delay": cdk.numberToCloudFormation(properties.delay),
    "Priority": cdk.numberToCloudFormation(properties.priority),
    "QueueReference": convertCfnRoutingProfileRoutingProfileQueueReferencePropertyToCloudFormation(properties.queueReference)
  };
}

// @ts-ignore TS6133
function CfnRoutingProfileRoutingProfileQueueConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRoutingProfile.RoutingProfileQueueConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoutingProfile.RoutingProfileQueueConfigProperty>();
  ret.addPropertyResult("delay", "Delay", (properties.Delay != null ? cfn_parse.FromCloudFormation.getNumber(properties.Delay) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addPropertyResult("queueReference", "QueueReference", (properties.QueueReference != null ? CfnRoutingProfileRoutingProfileQueueReferencePropertyFromCloudFormation(properties.QueueReference) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRoutingProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnRoutingProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRoutingProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("agentAvailabilityTimer", cdk.validateString)(properties.agentAvailabilityTimer));
  errors.collect(cdk.propertyValidator("defaultOutboundQueueArn", cdk.requiredValidator)(properties.defaultOutboundQueueArn));
  errors.collect(cdk.propertyValidator("defaultOutboundQueueArn", cdk.validateString)(properties.defaultOutboundQueueArn));
  errors.collect(cdk.propertyValidator("description", cdk.requiredValidator)(properties.description));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("mediaConcurrencies", cdk.requiredValidator)(properties.mediaConcurrencies));
  errors.collect(cdk.propertyValidator("mediaConcurrencies", cdk.listValidator(CfnRoutingProfileMediaConcurrencyPropertyValidator))(properties.mediaConcurrencies));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("queueConfigs", cdk.listValidator(CfnRoutingProfileRoutingProfileQueueConfigPropertyValidator))(properties.queueConfigs));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRoutingProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnRoutingProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRoutingProfilePropsValidator(properties).assertSuccess();
  return {
    "AgentAvailabilityTimer": cdk.stringToCloudFormation(properties.agentAvailabilityTimer),
    "DefaultOutboundQueueArn": cdk.stringToCloudFormation(properties.defaultOutboundQueueArn),
    "Description": cdk.stringToCloudFormation(properties.description),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "MediaConcurrencies": cdk.listMapper(convertCfnRoutingProfileMediaConcurrencyPropertyToCloudFormation)(properties.mediaConcurrencies),
    "Name": cdk.stringToCloudFormation(properties.name),
    "QueueConfigs": cdk.listMapper(convertCfnRoutingProfileRoutingProfileQueueConfigPropertyToCloudFormation)(properties.queueConfigs),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRoutingProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoutingProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoutingProfileProps>();
  ret.addPropertyResult("agentAvailabilityTimer", "AgentAvailabilityTimer", (properties.AgentAvailabilityTimer != null ? cfn_parse.FromCloudFormation.getString(properties.AgentAvailabilityTimer) : undefined));
  ret.addPropertyResult("defaultOutboundQueueArn", "DefaultOutboundQueueArn", (properties.DefaultOutboundQueueArn != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultOutboundQueueArn) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("mediaConcurrencies", "MediaConcurrencies", (properties.MediaConcurrencies != null ? cfn_parse.FromCloudFormation.getArray(CfnRoutingProfileMediaConcurrencyPropertyFromCloudFormation)(properties.MediaConcurrencies) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("queueConfigs", "QueueConfigs", (properties.QueueConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnRoutingProfileRoutingProfileQueueConfigPropertyFromCloudFormation)(properties.QueueConfigs) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a rule for the specified Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::Rule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html
 */
export class CfnRule extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::Rule";

  /**
   * Build a CfnRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the rule.
   *
   * @cloudformationAttribute RuleArn
   */
  public readonly attrRuleArn: string;

  /**
   * A list of actions to be run when the rule is triggered.
   */
  public actions: CfnRule.ActionsProperty | cdk.IResolvable;

  /**
   * The conditions of the rule.
   */
  public function: string;

  /**
   * The Amazon Resource Name (ARN) of the instance.
   */
  public instanceArn: string;

  /**
   * The name of the rule.
   */
  public name: string;

  /**
   * The publish status of the rule.
   */
  public publishStatus: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The event source to trigger the rule.
   */
  public triggerEventSource: cdk.IResolvable | CfnRule.RuleTriggerEventSourceProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRuleProps) {
    super(scope, id, {
      "type": CfnRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "actions", this);
    cdk.requireProperty(props, "function", this);
    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "publishStatus", this);
    cdk.requireProperty(props, "triggerEventSource", this);

    this.attrRuleArn = cdk.Token.asString(this.getAtt("RuleArn", cdk.ResolutionTypeHint.STRING));
    this.actions = props.actions;
    this.function = props.function;
    this.instanceArn = props.instanceArn;
    this.name = props.name;
    this.publishStatus = props.publishStatus;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::Rule", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.triggerEventSource = props.triggerEventSource;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "actions": this.actions,
      "function": this.function,
      "instanceArn": this.instanceArn,
      "name": this.name,
      "publishStatus": this.publishStatus,
      "tags": this.tags.renderTags(),
      "triggerEventSource": this.triggerEventSource
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRulePropsToCloudFormation(props);
  }
}

export namespace CfnRule {
  /**
   * The name of the event source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-ruletriggereventsource.html
   */
  export interface RuleTriggerEventSourceProperty {
    /**
     * The name of the event source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-ruletriggereventsource.html#cfn-connect-rule-ruletriggereventsource-eventsourcename
     */
    readonly eventSourceName: string;

    /**
     * The Amazon Resource Name (ARN) of the integration association.
     *
     * `IntegrationAssociationArn` is required if `TriggerEventSource` is one of the following values: `OnZendeskTicketCreate` | `OnZendeskTicketStatusUpdate` | `OnSalesforceCaseCreate`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-ruletriggereventsource.html#cfn-connect-rule-ruletriggereventsource-integrationassociationarn
     */
    readonly integrationAssociationArn?: string;
  }

  /**
   * A list of actions to be run when the rule is triggered.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html
   */
  export interface ActionsProperty {
    /**
     * Information about the contact category action.
     *
     * The syntax can be empty, for example, `{}` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-assigncontactcategoryactions
     */
    readonly assignContactCategoryActions?: Array<any | cdk.IResolvable> | cdk.IResolvable;

    /**
     * This action will create a case when a rule is triggered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-createcaseactions
     */
    readonly createCaseActions?: Array<CfnRule.CreateCaseActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * This action will end associated tasks when a rule is triggered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-endassociatedtaskactions
     */
    readonly endAssociatedTaskActions?: Array<any | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Information about the EventBridge action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-eventbridgeactions
     */
    readonly eventBridgeActions?: Array<CfnRule.EventBridgeActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Information about the send notification action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-sendnotificationactions
     */
    readonly sendNotificationActions?: Array<cdk.IResolvable | CfnRule.SendNotificationActionProperty> | cdk.IResolvable;

    /**
     * Information about the task action.
     *
     * This field is required if `TriggerEventSource` is one of the following values: `OnZendeskTicketCreate` | `OnZendeskTicketStatusUpdate` | `OnSalesforceCaseCreate`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-taskactions
     */
    readonly taskActions?: Array<cdk.IResolvable | CfnRule.TaskActionProperty> | cdk.IResolvable;

    /**
     * This action will update a case when a rule is triggered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-actions.html#cfn-connect-rule-actions-updatecaseactions
     */
    readonly updateCaseActions?: Array<cdk.IResolvable | CfnRule.UpdateCaseActionProperty> | cdk.IResolvable;
  }

  /**
   * The EventBridge action definition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-eventbridgeaction.html
   */
  export interface EventBridgeActionProperty {
    /**
     * The name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-eventbridgeaction.html#cfn-connect-rule-eventbridgeaction-name
     */
    readonly name: string;
  }

  /**
   * Information about the task action.
   *
   * This field is required if `TriggerEventSource` is one of the following values: `OnZendeskTicketCreate` | `OnZendeskTicketStatusUpdate` | `OnSalesforceCaseCreate`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html
   */
  export interface TaskActionProperty {
    /**
     * The Amazon Resource Name (ARN) of the flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html#cfn-connect-rule-taskaction-contactflowarn
     */
    readonly contactFlowArn: string;

    /**
     * The description.
     *
     * Supports variable injection. For more information, see [JSONPath reference](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-variable-injection.html) in the *Amazon Connect Administrators Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html#cfn-connect-rule-taskaction-description
     */
    readonly description?: string;

    /**
     * The name.
     *
     * Supports variable injection. For more information, see [JSONPath reference](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-variable-injection.html) in the *Amazon Connect Administrators Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html#cfn-connect-rule-taskaction-name
     */
    readonly name: string;

    /**
     * Information about the reference when the `referenceType` is `URL` .
     *
     * Otherwise, null. `URL` is the only accepted type. (Supports variable injection in the `Value` field.)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-taskaction.html#cfn-connect-rule-taskaction-references
     */
    readonly references?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnRule.ReferenceProperty>;
  }

  /**
   * Information about the reference when the `referenceType` is `URL` .
   *
   * Otherwise, null. (Supports variable injection in the `Value` field.)
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-reference.html
   */
  export interface ReferenceProperty {
    /**
     * The type of the reference. `DATE` must be of type Epoch timestamp.
     *
     * *Allowed values* : `URL` | `ATTACHMENT` | `NUMBER` | `STRING` | `DATE` | `EMAIL`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-reference.html#cfn-connect-rule-reference-type
     */
    readonly type: string;

    /**
     * A valid value for the reference.
     *
     * For example, for a URL reference, a formatted URL that is displayed to an agent in the Contact Control Panel (CCP).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-reference.html#cfn-connect-rule-reference-value
     */
    readonly value: string;
  }

  /**
   * Information about the send notification action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html
   */
  export interface SendNotificationActionProperty {
    /**
     * Notification content.
     *
     * Supports variable injection. For more information, see [JSONPath reference](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-variable-injection.html) in the *Amazon Connect Administrators Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-content
     */
    readonly content: string;

    /**
     * Content type format.
     *
     * *Allowed value* : `PLAIN_TEXT`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-contenttype
     */
    readonly contentType: string;

    /**
     * Notification delivery method.
     *
     * *Allowed value* : `EMAIL`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-deliverymethod
     */
    readonly deliveryMethod: string;

    /**
     * Notification recipient.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-recipient
     */
    readonly recipient: cdk.IResolvable | CfnRule.NotificationRecipientTypeProperty;

    /**
     * The subject of the email if the delivery method is `EMAIL` .
     *
     * Supports variable injection. For more information, see [JSONPath reference](https://docs.aws.amazon.com/connect/latest/adminguide/contact-lens-variable-injection.html) in the *Amazon Connect Administrators Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-sendnotificationaction.html#cfn-connect-rule-sendnotificationaction-subject
     */
    readonly subject?: string;
  }

  /**
   * The type of notification recipient.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-notificationrecipienttype.html
   */
  export interface NotificationRecipientTypeProperty {
    /**
     * The Amazon Resource Name (ARN) of the user account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-notificationrecipienttype.html#cfn-connect-rule-notificationrecipienttype-userarns
     */
    readonly userArns?: Array<string>;

    /**
     * The tags used to organize, track, or control access for this resource.
     *
     * For example, { "tags": {"key1":"value1", "key2":"value2"} }. Amazon Connect users with the specified tags will be notified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-notificationrecipienttype.html#cfn-connect-rule-notificationrecipienttype-usertags
     */
    readonly userTags?: cdk.IResolvable | Record<string, string>;
  }

  /**
   * The definition for create case action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-createcaseaction.html
   */
  export interface CreateCaseActionProperty {
    /**
     * An array of case fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-createcaseaction.html#cfn-connect-rule-createcaseaction-fields
     */
    readonly fields: Array<CfnRule.FieldProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Id of template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-createcaseaction.html#cfn-connect-rule-createcaseaction-templateid
     */
    readonly templateId: string;
  }

  /**
   * The field of the case.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-field.html
   */
  export interface FieldProperty {
    /**
     * The Id of the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-field.html#cfn-connect-rule-field-id
     */
    readonly id: string;

    /**
     * The value of the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-field.html#cfn-connect-rule-field-value
     */
    readonly value: CfnRule.FieldValueProperty | cdk.IResolvable;
  }

  /**
   * The value of the field.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-fieldvalue.html
   */
  export interface FieldValueProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-fieldvalue.html#cfn-connect-rule-fieldvalue-booleanvalue
     */
    readonly booleanValue?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-fieldvalue.html#cfn-connect-rule-fieldvalue-doublevalue
     */
    readonly doubleValue?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-fieldvalue.html#cfn-connect-rule-fieldvalue-emptyvalue
     */
    readonly emptyValue?: any | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-fieldvalue.html#cfn-connect-rule-fieldvalue-stringvalue
     */
    readonly stringValue?: string;
  }

  /**
   * The definition for update case action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-updatecaseaction.html
   */
  export interface UpdateCaseActionProperty {
    /**
     * An array of case fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-rule-updatecaseaction.html#cfn-connect-rule-updatecaseaction-fields
     */
    readonly fields: Array<CfnRule.FieldProperty | cdk.IResolvable> | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html
 */
export interface CfnRuleProps {
  /**
   * A list of actions to be run when the rule is triggered.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-actions
   */
  readonly actions: CfnRule.ActionsProperty | cdk.IResolvable;

  /**
   * The conditions of the rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-function
   */
  readonly function: string;

  /**
   * The Amazon Resource Name (ARN) of the instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-instancearn
   */
  readonly instanceArn: string;

  /**
   * The name of the rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-name
   */
  readonly name: string;

  /**
   * The publish status of the rule.
   *
   * *Allowed values* : `DRAFT` | `PUBLISHED`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-publishstatus
   */
  readonly publishStatus: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * For example, { "tags": {"key1":"value1", "key2":"value2"} }.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The event source to trigger the rule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-rule.html#cfn-connect-rule-triggereventsource
   */
  readonly triggerEventSource: cdk.IResolvable | CfnRule.RuleTriggerEventSourceProperty;
}

/**
 * Determine whether the given properties match those of a `RuleTriggerEventSourceProperty`
 *
 * @param properties - the TypeScript properties of a `RuleTriggerEventSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleRuleTriggerEventSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventSourceName", cdk.requiredValidator)(properties.eventSourceName));
  errors.collect(cdk.propertyValidator("eventSourceName", cdk.validateString)(properties.eventSourceName));
  errors.collect(cdk.propertyValidator("integrationAssociationArn", cdk.validateString)(properties.integrationAssociationArn));
  return errors.wrap("supplied properties not correct for \"RuleTriggerEventSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleRuleTriggerEventSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleRuleTriggerEventSourcePropertyValidator(properties).assertSuccess();
  return {
    "EventSourceName": cdk.stringToCloudFormation(properties.eventSourceName),
    "IntegrationAssociationArn": cdk.stringToCloudFormation(properties.integrationAssociationArn)
  };
}

// @ts-ignore TS6133
function CfnRuleRuleTriggerEventSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.RuleTriggerEventSourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.RuleTriggerEventSourceProperty>();
  ret.addPropertyResult("eventSourceName", "EventSourceName", (properties.EventSourceName != null ? cfn_parse.FromCloudFormation.getString(properties.EventSourceName) : undefined));
  ret.addPropertyResult("integrationAssociationArn", "IntegrationAssociationArn", (properties.IntegrationAssociationArn != null ? cfn_parse.FromCloudFormation.getString(properties.IntegrationAssociationArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventBridgeActionProperty`
 *
 * @param properties - the TypeScript properties of a `EventBridgeActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleEventBridgeActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"EventBridgeActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleEventBridgeActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleEventBridgeActionPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnRuleEventBridgeActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.EventBridgeActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.EventBridgeActionProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReferenceProperty`
 *
 * @param properties - the TypeScript properties of a `ReferenceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleReferencePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ReferenceProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleReferencePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleReferencePropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnRuleReferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.ReferenceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.ReferenceProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TaskActionProperty`
 *
 * @param properties - the TypeScript properties of a `TaskActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleTaskActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contactFlowArn", cdk.requiredValidator)(properties.contactFlowArn));
  errors.collect(cdk.propertyValidator("contactFlowArn", cdk.validateString)(properties.contactFlowArn));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("references", cdk.hashValidator(CfnRuleReferencePropertyValidator))(properties.references));
  return errors.wrap("supplied properties not correct for \"TaskActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleTaskActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleTaskActionPropertyValidator(properties).assertSuccess();
  return {
    "ContactFlowArn": cdk.stringToCloudFormation(properties.contactFlowArn),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "References": cdk.hashMapper(convertCfnRuleReferencePropertyToCloudFormation)(properties.references)
  };
}

// @ts-ignore TS6133
function CfnRuleTaskActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.TaskActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.TaskActionProperty>();
  ret.addPropertyResult("contactFlowArn", "ContactFlowArn", (properties.ContactFlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.ContactFlowArn) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("references", "References", (properties.References != null ? cfn_parse.FromCloudFormation.getMap(CfnRuleReferencePropertyFromCloudFormation)(properties.References) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotificationRecipientTypeProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationRecipientTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleNotificationRecipientTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("userArns", cdk.listValidator(cdk.validateString))(properties.userArns));
  errors.collect(cdk.propertyValidator("userTags", cdk.hashValidator(cdk.validateString))(properties.userTags));
  return errors.wrap("supplied properties not correct for \"NotificationRecipientTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleNotificationRecipientTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleNotificationRecipientTypePropertyValidator(properties).assertSuccess();
  return {
    "UserArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.userArns),
    "UserTags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.userTags)
  };
}

// @ts-ignore TS6133
function CfnRuleNotificationRecipientTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.NotificationRecipientTypeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.NotificationRecipientTypeProperty>();
  ret.addPropertyResult("userArns", "UserArns", (properties.UserArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.UserArns) : undefined));
  ret.addPropertyResult("userTags", "UserTags", (properties.UserTags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.UserTags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SendNotificationActionProperty`
 *
 * @param properties - the TypeScript properties of a `SendNotificationActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleSendNotificationActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("content", cdk.requiredValidator)(properties.content));
  errors.collect(cdk.propertyValidator("content", cdk.validateString)(properties.content));
  errors.collect(cdk.propertyValidator("contentType", cdk.requiredValidator)(properties.contentType));
  errors.collect(cdk.propertyValidator("contentType", cdk.validateString)(properties.contentType));
  errors.collect(cdk.propertyValidator("deliveryMethod", cdk.requiredValidator)(properties.deliveryMethod));
  errors.collect(cdk.propertyValidator("deliveryMethod", cdk.validateString)(properties.deliveryMethod));
  errors.collect(cdk.propertyValidator("recipient", cdk.requiredValidator)(properties.recipient));
  errors.collect(cdk.propertyValidator("recipient", CfnRuleNotificationRecipientTypePropertyValidator)(properties.recipient));
  errors.collect(cdk.propertyValidator("subject", cdk.validateString)(properties.subject));
  return errors.wrap("supplied properties not correct for \"SendNotificationActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleSendNotificationActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleSendNotificationActionPropertyValidator(properties).assertSuccess();
  return {
    "Content": cdk.stringToCloudFormation(properties.content),
    "ContentType": cdk.stringToCloudFormation(properties.contentType),
    "DeliveryMethod": cdk.stringToCloudFormation(properties.deliveryMethod),
    "Recipient": convertCfnRuleNotificationRecipientTypePropertyToCloudFormation(properties.recipient),
    "Subject": cdk.stringToCloudFormation(properties.subject)
  };
}

// @ts-ignore TS6133
function CfnRuleSendNotificationActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.SendNotificationActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.SendNotificationActionProperty>();
  ret.addPropertyResult("content", "Content", (properties.Content != null ? cfn_parse.FromCloudFormation.getString(properties.Content) : undefined));
  ret.addPropertyResult("contentType", "ContentType", (properties.ContentType != null ? cfn_parse.FromCloudFormation.getString(properties.ContentType) : undefined));
  ret.addPropertyResult("deliveryMethod", "DeliveryMethod", (properties.DeliveryMethod != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryMethod) : undefined));
  ret.addPropertyResult("recipient", "Recipient", (properties.Recipient != null ? CfnRuleNotificationRecipientTypePropertyFromCloudFormation(properties.Recipient) : undefined));
  ret.addPropertyResult("subject", "Subject", (properties.Subject != null ? cfn_parse.FromCloudFormation.getString(properties.Subject) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FieldValueProperty`
 *
 * @param properties - the TypeScript properties of a `FieldValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleFieldValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("booleanValue", cdk.validateBoolean)(properties.booleanValue));
  errors.collect(cdk.propertyValidator("doubleValue", cdk.validateNumber)(properties.doubleValue));
  errors.collect(cdk.propertyValidator("emptyValue", cdk.validateObject)(properties.emptyValue));
  errors.collect(cdk.propertyValidator("stringValue", cdk.validateString)(properties.stringValue));
  return errors.wrap("supplied properties not correct for \"FieldValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleFieldValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleFieldValuePropertyValidator(properties).assertSuccess();
  return {
    "BooleanValue": cdk.booleanToCloudFormation(properties.booleanValue),
    "DoubleValue": cdk.numberToCloudFormation(properties.doubleValue),
    "EmptyValue": cdk.objectToCloudFormation(properties.emptyValue),
    "StringValue": cdk.stringToCloudFormation(properties.stringValue)
  };
}

// @ts-ignore TS6133
function CfnRuleFieldValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.FieldValueProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.FieldValueProperty>();
  ret.addPropertyResult("booleanValue", "BooleanValue", (properties.BooleanValue != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BooleanValue) : undefined));
  ret.addPropertyResult("doubleValue", "DoubleValue", (properties.DoubleValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.DoubleValue) : undefined));
  ret.addPropertyResult("emptyValue", "EmptyValue", (properties.EmptyValue != null ? cfn_parse.FromCloudFormation.getAny(properties.EmptyValue) : undefined));
  ret.addPropertyResult("stringValue", "StringValue", (properties.StringValue != null ? cfn_parse.FromCloudFormation.getString(properties.StringValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FieldProperty`
 *
 * @param properties - the TypeScript properties of a `FieldProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleFieldPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", CfnRuleFieldValuePropertyValidator)(properties.value));
  return errors.wrap("supplied properties not correct for \"FieldProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleFieldPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleFieldPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Value": convertCfnRuleFieldValuePropertyToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnRuleFieldPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.FieldProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.FieldProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? CfnRuleFieldValuePropertyFromCloudFormation(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CreateCaseActionProperty`
 *
 * @param properties - the TypeScript properties of a `CreateCaseActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleCreateCaseActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fields", cdk.requiredValidator)(properties.fields));
  errors.collect(cdk.propertyValidator("fields", cdk.listValidator(CfnRuleFieldPropertyValidator))(properties.fields));
  errors.collect(cdk.propertyValidator("templateId", cdk.requiredValidator)(properties.templateId));
  errors.collect(cdk.propertyValidator("templateId", cdk.validateString)(properties.templateId));
  return errors.wrap("supplied properties not correct for \"CreateCaseActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleCreateCaseActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleCreateCaseActionPropertyValidator(properties).assertSuccess();
  return {
    "Fields": cdk.listMapper(convertCfnRuleFieldPropertyToCloudFormation)(properties.fields),
    "TemplateId": cdk.stringToCloudFormation(properties.templateId)
  };
}

// @ts-ignore TS6133
function CfnRuleCreateCaseActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.CreateCaseActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.CreateCaseActionProperty>();
  ret.addPropertyResult("fields", "Fields", (properties.Fields != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleFieldPropertyFromCloudFormation)(properties.Fields) : undefined));
  ret.addPropertyResult("templateId", "TemplateId", (properties.TemplateId != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UpdateCaseActionProperty`
 *
 * @param properties - the TypeScript properties of a `UpdateCaseActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleUpdateCaseActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fields", cdk.requiredValidator)(properties.fields));
  errors.collect(cdk.propertyValidator("fields", cdk.listValidator(CfnRuleFieldPropertyValidator))(properties.fields));
  return errors.wrap("supplied properties not correct for \"UpdateCaseActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleUpdateCaseActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleUpdateCaseActionPropertyValidator(properties).assertSuccess();
  return {
    "Fields": cdk.listMapper(convertCfnRuleFieldPropertyToCloudFormation)(properties.fields)
  };
}

// @ts-ignore TS6133
function CfnRuleUpdateCaseActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRule.UpdateCaseActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.UpdateCaseActionProperty>();
  ret.addPropertyResult("fields", "Fields", (properties.Fields != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleFieldPropertyFromCloudFormation)(properties.Fields) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionsProperty`
 *
 * @param properties - the TypeScript properties of a `ActionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRuleActionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("assignContactCategoryActions", cdk.listValidator(cdk.validateObject))(properties.assignContactCategoryActions));
  errors.collect(cdk.propertyValidator("createCaseActions", cdk.listValidator(CfnRuleCreateCaseActionPropertyValidator))(properties.createCaseActions));
  errors.collect(cdk.propertyValidator("endAssociatedTaskActions", cdk.listValidator(cdk.validateObject))(properties.endAssociatedTaskActions));
  errors.collect(cdk.propertyValidator("eventBridgeActions", cdk.listValidator(CfnRuleEventBridgeActionPropertyValidator))(properties.eventBridgeActions));
  errors.collect(cdk.propertyValidator("sendNotificationActions", cdk.listValidator(CfnRuleSendNotificationActionPropertyValidator))(properties.sendNotificationActions));
  errors.collect(cdk.propertyValidator("taskActions", cdk.listValidator(CfnRuleTaskActionPropertyValidator))(properties.taskActions));
  errors.collect(cdk.propertyValidator("updateCaseActions", cdk.listValidator(CfnRuleUpdateCaseActionPropertyValidator))(properties.updateCaseActions));
  return errors.wrap("supplied properties not correct for \"ActionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnRuleActionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRuleActionsPropertyValidator(properties).assertSuccess();
  return {
    "AssignContactCategoryActions": cdk.listMapper(cdk.objectToCloudFormation)(properties.assignContactCategoryActions),
    "CreateCaseActions": cdk.listMapper(convertCfnRuleCreateCaseActionPropertyToCloudFormation)(properties.createCaseActions),
    "EndAssociatedTaskActions": cdk.listMapper(cdk.objectToCloudFormation)(properties.endAssociatedTaskActions),
    "EventBridgeActions": cdk.listMapper(convertCfnRuleEventBridgeActionPropertyToCloudFormation)(properties.eventBridgeActions),
    "SendNotificationActions": cdk.listMapper(convertCfnRuleSendNotificationActionPropertyToCloudFormation)(properties.sendNotificationActions),
    "TaskActions": cdk.listMapper(convertCfnRuleTaskActionPropertyToCloudFormation)(properties.taskActions),
    "UpdateCaseActions": cdk.listMapper(convertCfnRuleUpdateCaseActionPropertyToCloudFormation)(properties.updateCaseActions)
  };
}

// @ts-ignore TS6133
function CfnRuleActionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRule.ActionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRule.ActionsProperty>();
  ret.addPropertyResult("assignContactCategoryActions", "AssignContactCategoryActions", (properties.AssignContactCategoryActions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getAny)(properties.AssignContactCategoryActions) : undefined));
  ret.addPropertyResult("createCaseActions", "CreateCaseActions", (properties.CreateCaseActions != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleCreateCaseActionPropertyFromCloudFormation)(properties.CreateCaseActions) : undefined));
  ret.addPropertyResult("endAssociatedTaskActions", "EndAssociatedTaskActions", (properties.EndAssociatedTaskActions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getAny)(properties.EndAssociatedTaskActions) : undefined));
  ret.addPropertyResult("eventBridgeActions", "EventBridgeActions", (properties.EventBridgeActions != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleEventBridgeActionPropertyFromCloudFormation)(properties.EventBridgeActions) : undefined));
  ret.addPropertyResult("sendNotificationActions", "SendNotificationActions", (properties.SendNotificationActions != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleSendNotificationActionPropertyFromCloudFormation)(properties.SendNotificationActions) : undefined));
  ret.addPropertyResult("taskActions", "TaskActions", (properties.TaskActions != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleTaskActionPropertyFromCloudFormation)(properties.TaskActions) : undefined));
  ret.addPropertyResult("updateCaseActions", "UpdateCaseActions", (properties.UpdateCaseActions != null ? cfn_parse.FromCloudFormation.getArray(CfnRuleUpdateCaseActionPropertyFromCloudFormation)(properties.UpdateCaseActions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.requiredValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("actions", CfnRuleActionsPropertyValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("function", cdk.requiredValidator)(properties.function));
  errors.collect(cdk.propertyValidator("function", cdk.validateString)(properties.function));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("publishStatus", cdk.requiredValidator)(properties.publishStatus));
  errors.collect(cdk.propertyValidator("publishStatus", cdk.validateString)(properties.publishStatus));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("triggerEventSource", cdk.requiredValidator)(properties.triggerEventSource));
  errors.collect(cdk.propertyValidator("triggerEventSource", CfnRuleRuleTriggerEventSourcePropertyValidator)(properties.triggerEventSource));
  return errors.wrap("supplied properties not correct for \"CfnRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRulePropsValidator(properties).assertSuccess();
  return {
    "Actions": convertCfnRuleActionsPropertyToCloudFormation(properties.actions),
    "Function": cdk.stringToCloudFormation(properties.function),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PublishStatus": cdk.stringToCloudFormation(properties.publishStatus),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TriggerEventSource": convertCfnRuleRuleTriggerEventSourcePropertyToCloudFormation(properties.triggerEventSource)
  };
}

// @ts-ignore TS6133
function CfnRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleProps>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? CfnRuleActionsPropertyFromCloudFormation(properties.Actions) : undefined));
  ret.addPropertyResult("function", "Function", (properties.Function != null ? cfn_parse.FromCloudFormation.getString(properties.Function) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("publishStatus", "PublishStatus", (properties.PublishStatus != null ? cfn_parse.FromCloudFormation.getString(properties.PublishStatus) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("triggerEventSource", "TriggerEventSource", (properties.TriggerEventSource != null ? CfnRuleRuleTriggerEventSourcePropertyFromCloudFormation(properties.TriggerEventSource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The security key for the instance.
 *
 * > Only two security keys are allowed per Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::SecurityKey
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-securitykey.html
 */
export class CfnSecurityKey extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::SecurityKey";

  /**
   * Build a CfnSecurityKey from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSecurityKey {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSecurityKeyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSecurityKey(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * An `AssociationId` is automatically generated when a storage config is associated with an instance.
   *
   * @cloudformationAttribute AssociationId
   */
  public readonly attrAssociationId: string;

  /**
   * The Amazon Resource Name (ARN) of the instance.
   */
  public instanceId: string;

  /**
   * A valid security key in PEM format. For example:.
   */
  public key: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSecurityKeyProps) {
    super(scope, id, {
      "type": CfnSecurityKey.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceId", this);
    cdk.requireProperty(props, "key", this);

    this.attrAssociationId = cdk.Token.asString(this.getAtt("AssociationId", cdk.ResolutionTypeHint.STRING));
    this.instanceId = props.instanceId;
    this.key = props.key;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "instanceId": this.instanceId,
      "key": this.key
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSecurityKey.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSecurityKeyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSecurityKey`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-securitykey.html
 */
export interface CfnSecurityKeyProps {
  /**
   * The Amazon Resource Name (ARN) of the instance.
   *
   * *Minimum* : `1`
   *
   * *Maximum* : `100`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-securitykey.html#cfn-connect-securitykey-instanceid
   */
  readonly instanceId: string;

  /**
   * A valid security key in PEM format. For example:.
   *
   * `"-----BEGIN PUBLIC KEY-----\ [a lot of characters] ----END PUBLIC KEY-----"`
   *
   * *Minimum* : `1`
   *
   * *Maximum* : `1024`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-securitykey.html#cfn-connect-securitykey-key
   */
  readonly key: string;
}

/**
 * Determine whether the given properties match those of a `CfnSecurityKeyProps`
 *
 * @param properties - the TypeScript properties of a `CfnSecurityKeyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityKeyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceId", cdk.requiredValidator)(properties.instanceId));
  errors.collect(cdk.propertyValidator("instanceId", cdk.validateString)(properties.instanceId));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  return errors.wrap("supplied properties not correct for \"CfnSecurityKeyProps\"");
}

// @ts-ignore TS6133
function convertCfnSecurityKeyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityKeyPropsValidator(properties).assertSuccess();
  return {
    "InstanceId": cdk.stringToCloudFormation(properties.instanceId),
    "Key": cdk.stringToCloudFormation(properties.key)
  };
}

// @ts-ignore TS6133
function CfnSecurityKeyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityKeyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityKeyProps>();
  ret.addPropertyResult("instanceId", "InstanceId", (properties.InstanceId != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceId) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a security profile.
 *
 * @cloudformationResource AWS::Connect::SecurityProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-securityprofile.html
 */
export class CfnSecurityProfile extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::SecurityProfile";

  /**
   * Build a CfnSecurityProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSecurityProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSecurityProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSecurityProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the security profile.
   *
   * @cloudformationAttribute SecurityProfileArn
   */
  public readonly attrSecurityProfileArn: string;

  /**
   * The list of tags that a security profile uses to restrict access to resources in Amazon Connect.
   */
  public allowedAccessControlTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the security profile.
   */
  public description?: string;

  /**
   * The identifier of the Amazon Connect instance.
   */
  public instanceArn: string;

  /**
   * Permissions assigned to the security profile.
   */
  public permissions?: Array<string>;

  /**
   * The name for the security profile.
   */
  public securityProfileName: string;

  /**
   * The list of resources that a security profile applies tag restrictions to in Amazon Connect.
   */
  public tagRestrictedResources?: Array<string>;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSecurityProfileProps) {
    super(scope, id, {
      "type": CfnSecurityProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "securityProfileName", this);

    this.attrSecurityProfileArn = cdk.Token.asString(this.getAtt("SecurityProfileArn", cdk.ResolutionTypeHint.STRING));
    this.allowedAccessControlTags = props.allowedAccessControlTags;
    this.description = props.description;
    this.instanceArn = props.instanceArn;
    this.permissions = props.permissions;
    this.securityProfileName = props.securityProfileName;
    this.tagRestrictedResources = props.tagRestrictedResources;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "allowedAccessControlTags": this.allowedAccessControlTags,
      "description": this.description,
      "instanceArn": this.instanceArn,
      "permissions": this.permissions,
      "securityProfileName": this.securityProfileName,
      "tagRestrictedResources": this.tagRestrictedResources,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSecurityProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSecurityProfilePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSecurityProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-securityprofile.html
 */
export interface CfnSecurityProfileProps {
  /**
   * The list of tags that a security profile uses to restrict access to resources in Amazon Connect.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-securityprofile.html#cfn-connect-securityprofile-allowedaccesscontroltags
   */
  readonly allowedAccessControlTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the security profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-securityprofile.html#cfn-connect-securityprofile-description
   */
  readonly description?: string;

  /**
   * The identifier of the Amazon Connect instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-securityprofile.html#cfn-connect-securityprofile-instancearn
   */
  readonly instanceArn: string;

  /**
   * Permissions assigned to the security profile.
   *
   * For a list of valid permissions, see [List of security profile permissions](https://docs.aws.amazon.com/connect/latest/adminguide/security-profile-list.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-securityprofile.html#cfn-connect-securityprofile-permissions
   */
  readonly permissions?: Array<string>;

  /**
   * The name for the security profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-securityprofile.html#cfn-connect-securityprofile-securityprofilename
   */
  readonly securityProfileName: string;

  /**
   * The list of resources that a security profile applies tag restrictions to in Amazon Connect.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-securityprofile.html#cfn-connect-securityprofile-tagrestrictedresources
   */
  readonly tagRestrictedResources?: Array<string>;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * For example, { "Tags": {"key1":"value1", "key2":"value2"} }.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-securityprofile.html#cfn-connect-securityprofile-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnSecurityProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnSecurityProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSecurityProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedAccessControlTags", cdk.listValidator(cdk.validateCfnTag))(properties.allowedAccessControlTags));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("permissions", cdk.listValidator(cdk.validateString))(properties.permissions));
  errors.collect(cdk.propertyValidator("securityProfileName", cdk.requiredValidator)(properties.securityProfileName));
  errors.collect(cdk.propertyValidator("securityProfileName", cdk.validateString)(properties.securityProfileName));
  errors.collect(cdk.propertyValidator("tagRestrictedResources", cdk.listValidator(cdk.validateString))(properties.tagRestrictedResources));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSecurityProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnSecurityProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSecurityProfilePropsValidator(properties).assertSuccess();
  return {
    "AllowedAccessControlTags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.allowedAccessControlTags),
    "Description": cdk.stringToCloudFormation(properties.description),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "Permissions": cdk.listMapper(cdk.stringToCloudFormation)(properties.permissions),
    "SecurityProfileName": cdk.stringToCloudFormation(properties.securityProfileName),
    "TagRestrictedResources": cdk.listMapper(cdk.stringToCloudFormation)(properties.tagRestrictedResources),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSecurityProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSecurityProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSecurityProfileProps>();
  ret.addPropertyResult("allowedAccessControlTags", "AllowedAccessControlTags", (properties.AllowedAccessControlTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.AllowedAccessControlTags) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("permissions", "Permissions", (properties.Permissions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Permissions) : undefined));
  ret.addPropertyResult("securityProfileName", "SecurityProfileName", (properties.SecurityProfileName != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityProfileName) : undefined));
  ret.addPropertyResult("tagRestrictedResources", "TagRestrictedResources", (properties.TagRestrictedResources != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TagRestrictedResources) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a task template for a Amazon Connect instance.
 *
 * @cloudformationResource AWS::Connect::TaskTemplate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html
 */
export class CfnTaskTemplate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::TaskTemplate";

  /**
   * Build a CfnTaskTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTaskTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTaskTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTaskTemplate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the task template.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
   */
  public clientToken?: string;

  /**
   * Constraints that are applicable to the fields listed.
   */
  public constraints?: any | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the flow that runs by default when a task is created by referencing this template.
   */
  public contactFlowArn?: string;

  /**
   * The default values for fields when a task is created by referencing this template.
   */
  public defaults?: Array<CfnTaskTemplate.DefaultFieldValueProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the task template.
   */
  public description?: string;

  /**
   * Fields that are part of the template.
   */
  public fields?: Array<CfnTaskTemplate.FieldProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the Amazon Connect instance.
   */
  public instanceArn: string;

  /**
   * The name of the task template.
   */
  public name?: string;

  /**
   * The status of the task template.
   */
  public status?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTaskTemplateProps) {
    super(scope, id, {
      "type": CfnTaskTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.clientToken = props.clientToken;
    this.constraints = props.constraints;
    this.contactFlowArn = props.contactFlowArn;
    this.defaults = props.defaults;
    this.description = props.description;
    this.fields = props.fields;
    this.instanceArn = props.instanceArn;
    this.name = props.name;
    this.status = props.status;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::TaskTemplate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clientToken": this.clientToken,
      "constraints": this.constraints,
      "contactFlowArn": this.contactFlowArn,
      "defaults": this.defaults,
      "description": this.description,
      "fields": this.fields,
      "instanceArn": this.instanceArn,
      "name": this.name,
      "status": this.status,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTaskTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTaskTemplatePropsToCloudFormation(props);
  }
}

export namespace CfnTaskTemplate {
  /**
   * Describes constraints that apply to the template fields.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-constraints.html
   */
  export interface ConstraintsProperty {
    /**
     * Lists the fields that are invisible to agents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-constraints.html#cfn-connect-tasktemplate-constraints-invisiblefields
     */
    readonly invisibleFields?: Array<CfnTaskTemplate.InvisibleFieldInfoProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Lists the fields that are read-only to agents, and cannot be edited.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-constraints.html#cfn-connect-tasktemplate-constraints-readonlyfields
     */
    readonly readOnlyFields?: Array<cdk.IResolvable | CfnTaskTemplate.ReadOnlyFieldInfoProperty> | cdk.IResolvable;

    /**
     * Lists the fields that are required to be filled by agents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-constraints.html#cfn-connect-tasktemplate-constraints-requiredfields
     */
    readonly requiredFields?: Array<cdk.IResolvable | CfnTaskTemplate.RequiredFieldInfoProperty> | cdk.IResolvable;
  }

  /**
   * Indicates a field that is read-only to an agent.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-readonlyfieldinfo.html
   */
  export interface ReadOnlyFieldInfoProperty {
    /**
     * Identifier of the read-only field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-readonlyfieldinfo.html#cfn-connect-tasktemplate-readonlyfieldinfo-id
     */
    readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;
  }

  /**
   * The identifier of the task template field.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-fieldidentifier.html
   */
  export interface FieldIdentifierProperty {
    /**
     * The name of the task template field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-fieldidentifier.html#cfn-connect-tasktemplate-fieldidentifier-name
     */
    readonly name: string;
  }

  /**
   * A field that is invisible to an agent.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-invisiblefieldinfo.html
   */
  export interface InvisibleFieldInfoProperty {
    /**
     * Identifier of the invisible field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-invisiblefieldinfo.html#cfn-connect-tasktemplate-invisiblefieldinfo-id
     */
    readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;
  }

  /**
   * Information about a required field.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-requiredfieldinfo.html
   */
  export interface RequiredFieldInfoProperty {
    /**
     * The unique identifier for the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-requiredfieldinfo.html#cfn-connect-tasktemplate-requiredfieldinfo-id
     */
    readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;
  }

  /**
   * Describes a default field and its corresponding value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-defaultfieldvalue.html
   */
  export interface DefaultFieldValueProperty {
    /**
     * Default value for the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-defaultfieldvalue.html#cfn-connect-tasktemplate-defaultfieldvalue-defaultvalue
     */
    readonly defaultValue: string;

    /**
     * Identifier of a field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-defaultfieldvalue.html#cfn-connect-tasktemplate-defaultfieldvalue-id
     */
    readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;
  }

  /**
   * Describes a single task template field.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html
   */
  export interface FieldProperty {
    /**
     * The description of the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html#cfn-connect-tasktemplate-field-description
     */
    readonly description?: string;

    /**
     * The unique identifier for the field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html#cfn-connect-tasktemplate-field-id
     */
    readonly id: CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable;

    /**
     * A list of options for a single select field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html#cfn-connect-tasktemplate-field-singleselectoptions
     */
    readonly singleSelectOptions?: Array<string>;

    /**
     * Indicates the type of field.
     *
     * Following are the valid field types: `NAME` `DESCRIPTION` | `SCHEDULED_TIME` | `QUICK_CONNECT` | `URL` | `NUMBER` | `TEXT` | `TEXT_AREA` | `DATE_TIME` | `BOOLEAN` | `SINGLE_SELECT` | `EMAIL`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-tasktemplate-field.html#cfn-connect-tasktemplate-field-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnTaskTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html
 */
export interface CfnTaskTemplateProps {
  /**
   * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-clienttoken
   */
  readonly clientToken?: string;

  /**
   * Constraints that are applicable to the fields listed.
   *
   * The values can be represented in either JSON or YAML format. For an example of the JSON configuration, see *Examples* at the bottom of this page.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-constraints
   */
  readonly constraints?: any | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the flow that runs by default when a task is created by referencing this template.
   *
   * `ContactFlowArn` is not required when there is a field with `fieldType` = `QUICK_CONNECT` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-contactflowarn
   */
  readonly contactFlowArn?: string;

  /**
   * The default values for fields when a task is created by referencing this template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-defaults
   */
  readonly defaults?: Array<CfnTaskTemplate.DefaultFieldValueProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The description of the task template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-description
   */
  readonly description?: string;

  /**
   * Fields that are part of the template.
   *
   * A template requires at least one field that has type `Name` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-fields
   */
  readonly fields?: Array<CfnTaskTemplate.FieldProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the Amazon Connect instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-instancearn
   */
  readonly instanceArn: string;

  /**
   * The name of the task template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-name
   */
  readonly name?: string;

  /**
   * The status of the task template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-status
   */
  readonly status?: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-tasktemplate.html#cfn-connect-tasktemplate-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `FieldIdentifierProperty`
 *
 * @param properties - the TypeScript properties of a `FieldIdentifierProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskTemplateFieldIdentifierPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"FieldIdentifierProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskTemplateFieldIdentifierPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskTemplateFieldIdentifierPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnTaskTemplateFieldIdentifierPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskTemplate.FieldIdentifierProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplate.FieldIdentifierProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReadOnlyFieldInfoProperty`
 *
 * @param properties - the TypeScript properties of a `ReadOnlyFieldInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskTemplateReadOnlyFieldInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", CfnTaskTemplateFieldIdentifierPropertyValidator)(properties.id));
  return errors.wrap("supplied properties not correct for \"ReadOnlyFieldInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskTemplateReadOnlyFieldInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskTemplateReadOnlyFieldInfoPropertyValidator(properties).assertSuccess();
  return {
    "Id": convertCfnTaskTemplateFieldIdentifierPropertyToCloudFormation(properties.id)
  };
}

// @ts-ignore TS6133
function CfnTaskTemplateReadOnlyFieldInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskTemplate.ReadOnlyFieldInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplate.ReadOnlyFieldInfoProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? CfnTaskTemplateFieldIdentifierPropertyFromCloudFormation(properties.Id) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InvisibleFieldInfoProperty`
 *
 * @param properties - the TypeScript properties of a `InvisibleFieldInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskTemplateInvisibleFieldInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", CfnTaskTemplateFieldIdentifierPropertyValidator)(properties.id));
  return errors.wrap("supplied properties not correct for \"InvisibleFieldInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskTemplateInvisibleFieldInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskTemplateInvisibleFieldInfoPropertyValidator(properties).assertSuccess();
  return {
    "Id": convertCfnTaskTemplateFieldIdentifierPropertyToCloudFormation(properties.id)
  };
}

// @ts-ignore TS6133
function CfnTaskTemplateInvisibleFieldInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskTemplate.InvisibleFieldInfoProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplate.InvisibleFieldInfoProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? CfnTaskTemplateFieldIdentifierPropertyFromCloudFormation(properties.Id) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RequiredFieldInfoProperty`
 *
 * @param properties - the TypeScript properties of a `RequiredFieldInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskTemplateRequiredFieldInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", CfnTaskTemplateFieldIdentifierPropertyValidator)(properties.id));
  return errors.wrap("supplied properties not correct for \"RequiredFieldInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskTemplateRequiredFieldInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskTemplateRequiredFieldInfoPropertyValidator(properties).assertSuccess();
  return {
    "Id": convertCfnTaskTemplateFieldIdentifierPropertyToCloudFormation(properties.id)
  };
}

// @ts-ignore TS6133
function CfnTaskTemplateRequiredFieldInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTaskTemplate.RequiredFieldInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplate.RequiredFieldInfoProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? CfnTaskTemplateFieldIdentifierPropertyFromCloudFormation(properties.Id) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConstraintsProperty`
 *
 * @param properties - the TypeScript properties of a `ConstraintsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskTemplateConstraintsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("invisibleFields", cdk.listValidator(CfnTaskTemplateInvisibleFieldInfoPropertyValidator))(properties.invisibleFields));
  errors.collect(cdk.propertyValidator("readOnlyFields", cdk.listValidator(CfnTaskTemplateReadOnlyFieldInfoPropertyValidator))(properties.readOnlyFields));
  errors.collect(cdk.propertyValidator("requiredFields", cdk.listValidator(CfnTaskTemplateRequiredFieldInfoPropertyValidator))(properties.requiredFields));
  return errors.wrap("supplied properties not correct for \"ConstraintsProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskTemplateConstraintsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskTemplateConstraintsPropertyValidator(properties).assertSuccess();
  return {
    "InvisibleFields": cdk.listMapper(convertCfnTaskTemplateInvisibleFieldInfoPropertyToCloudFormation)(properties.invisibleFields),
    "ReadOnlyFields": cdk.listMapper(convertCfnTaskTemplateReadOnlyFieldInfoPropertyToCloudFormation)(properties.readOnlyFields),
    "RequiredFields": cdk.listMapper(convertCfnTaskTemplateRequiredFieldInfoPropertyToCloudFormation)(properties.requiredFields)
  };
}

// @ts-ignore TS6133
function CfnTaskTemplateConstraintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskTemplate.ConstraintsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplate.ConstraintsProperty>();
  ret.addPropertyResult("invisibleFields", "InvisibleFields", (properties.InvisibleFields != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskTemplateInvisibleFieldInfoPropertyFromCloudFormation)(properties.InvisibleFields) : undefined));
  ret.addPropertyResult("readOnlyFields", "ReadOnlyFields", (properties.ReadOnlyFields != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskTemplateReadOnlyFieldInfoPropertyFromCloudFormation)(properties.ReadOnlyFields) : undefined));
  ret.addPropertyResult("requiredFields", "RequiredFields", (properties.RequiredFields != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskTemplateRequiredFieldInfoPropertyFromCloudFormation)(properties.RequiredFields) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DefaultFieldValueProperty`
 *
 * @param properties - the TypeScript properties of a `DefaultFieldValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskTemplateDefaultFieldValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultValue", cdk.requiredValidator)(properties.defaultValue));
  errors.collect(cdk.propertyValidator("defaultValue", cdk.validateString)(properties.defaultValue));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", CfnTaskTemplateFieldIdentifierPropertyValidator)(properties.id));
  return errors.wrap("supplied properties not correct for \"DefaultFieldValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskTemplateDefaultFieldValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskTemplateDefaultFieldValuePropertyValidator(properties).assertSuccess();
  return {
    "DefaultValue": cdk.stringToCloudFormation(properties.defaultValue),
    "Id": convertCfnTaskTemplateFieldIdentifierPropertyToCloudFormation(properties.id)
  };
}

// @ts-ignore TS6133
function CfnTaskTemplateDefaultFieldValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskTemplate.DefaultFieldValueProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplate.DefaultFieldValueProperty>();
  ret.addPropertyResult("defaultValue", "DefaultValue", (properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? CfnTaskTemplateFieldIdentifierPropertyFromCloudFormation(properties.Id) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FieldProperty`
 *
 * @param properties - the TypeScript properties of a `FieldProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskTemplateFieldPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", CfnTaskTemplateFieldIdentifierPropertyValidator)(properties.id));
  errors.collect(cdk.propertyValidator("singleSelectOptions", cdk.listValidator(cdk.validateString))(properties.singleSelectOptions));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"FieldProperty\"");
}

// @ts-ignore TS6133
function convertCfnTaskTemplateFieldPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskTemplateFieldPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Id": convertCfnTaskTemplateFieldIdentifierPropertyToCloudFormation(properties.id),
    "SingleSelectOptions": cdk.listMapper(cdk.stringToCloudFormation)(properties.singleSelectOptions),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnTaskTemplateFieldPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskTemplate.FieldProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplate.FieldProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? CfnTaskTemplateFieldIdentifierPropertyFromCloudFormation(properties.Id) : undefined));
  ret.addPropertyResult("singleSelectOptions", "SingleSelectOptions", (properties.SingleSelectOptions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SingleSelectOptions) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTaskTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnTaskTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTaskTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientToken", cdk.validateString)(properties.clientToken));
  errors.collect(cdk.propertyValidator("constraints", cdk.validateObject)(properties.constraints));
  errors.collect(cdk.propertyValidator("contactFlowArn", cdk.validateString)(properties.contactFlowArn));
  errors.collect(cdk.propertyValidator("defaults", cdk.listValidator(CfnTaskTemplateDefaultFieldValuePropertyValidator))(properties.defaults));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("fields", cdk.listValidator(CfnTaskTemplateFieldPropertyValidator))(properties.fields));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnTaskTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnTaskTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTaskTemplatePropsValidator(properties).assertSuccess();
  return {
    "ClientToken": cdk.stringToCloudFormation(properties.clientToken),
    "Constraints": cdk.objectToCloudFormation(properties.constraints),
    "ContactFlowArn": cdk.stringToCloudFormation(properties.contactFlowArn),
    "Defaults": cdk.listMapper(convertCfnTaskTemplateDefaultFieldValuePropertyToCloudFormation)(properties.defaults),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Fields": cdk.listMapper(convertCfnTaskTemplateFieldPropertyToCloudFormation)(properties.fields),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnTaskTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTaskTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTaskTemplateProps>();
  ret.addPropertyResult("clientToken", "ClientToken", (properties.ClientToken != null ? cfn_parse.FromCloudFormation.getString(properties.ClientToken) : undefined));
  ret.addPropertyResult("constraints", "Constraints", (properties.Constraints != null ? cfn_parse.FromCloudFormation.getAny(properties.Constraints) : undefined));
  ret.addPropertyResult("contactFlowArn", "ContactFlowArn", (properties.ContactFlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.ContactFlowArn) : undefined));
  ret.addPropertyResult("defaults", "Defaults", (properties.Defaults != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskTemplateDefaultFieldValuePropertyFromCloudFormation)(properties.Defaults) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("fields", "Fields", (properties.Fields != null ? cfn_parse.FromCloudFormation.getArray(CfnTaskTemplateFieldPropertyFromCloudFormation)(properties.Fields) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Information about a traffic distribution group.
 *
 * @cloudformationResource AWS::Connect::TrafficDistributionGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-trafficdistributiongroup.html
 */
export class CfnTrafficDistributionGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::TrafficDistributionGroup";

  /**
   * Build a CfnTrafficDistributionGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTrafficDistributionGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTrafficDistributionGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTrafficDistributionGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Describes whether this is the default traffic distribution group.
   *
   * @cloudformationAttribute IsDefault
   */
  public readonly attrIsDefault: cdk.IResolvable;

  /**
   * The status of the traffic distribution group.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The Amazon Resource Name (ARN) of the traffic distribution group.
   *
   * @cloudformationAttribute TrafficDistributionGroupArn
   */
  public readonly attrTrafficDistributionGroupArn: string;

  /**
   * The description of the traffic distribution group.
   */
  public description?: string;

  /**
   * The Amazon Resource Name (ARN).
   */
  public instanceArn: string;

  /**
   * The name of the traffic distribution group.
   */
  public name: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTrafficDistributionGroupProps) {
    super(scope, id, {
      "type": CfnTrafficDistributionGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "name", this);

    this.attrIsDefault = this.getAtt("IsDefault");
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attrTrafficDistributionGroupArn = cdk.Token.asString(this.getAtt("TrafficDistributionGroupArn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.instanceArn = props.instanceArn;
    this.name = props.name;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "instanceArn": this.instanceArn,
      "name": this.name,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTrafficDistributionGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTrafficDistributionGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnTrafficDistributionGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-trafficdistributiongroup.html
 */
export interface CfnTrafficDistributionGroupProps {
  /**
   * The description of the traffic distribution group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-trafficdistributiongroup.html#cfn-connect-trafficdistributiongroup-description
   */
  readonly description?: string;

  /**
   * The Amazon Resource Name (ARN).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-trafficdistributiongroup.html#cfn-connect-trafficdistributiongroup-instancearn
   */
  readonly instanceArn: string;

  /**
   * The name of the traffic distribution group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-trafficdistributiongroup.html#cfn-connect-trafficdistributiongroup-name
   */
  readonly name: string;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * For example, {"tags": {"key1":"value1", "key2":"value2"} }.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-trafficdistributiongroup.html#cfn-connect-trafficdistributiongroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnTrafficDistributionGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnTrafficDistributionGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTrafficDistributionGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnTrafficDistributionGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnTrafficDistributionGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTrafficDistributionGroupPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnTrafficDistributionGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTrafficDistributionGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrafficDistributionGroupProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a user account for an Amazon Connect instance.
 *
 * For information about how to create user accounts using the Amazon Connect console, see [Add Users](https://docs.aws.amazon.com/connect/latest/adminguide/user-management.html) in the *Amazon Connect Administrator Guide* .
 *
 * @cloudformationResource AWS::Connect::User
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html
 */
export class CfnUser extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::User";

  /**
   * Build a CfnUser from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUser {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUser(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the user.
   *
   * @cloudformationAttribute UserArn
   */
  public readonly attrUserArn: string;

  /**
   * The identifier of the user account in the directory used for identity management.
   */
  public directoryUserId?: string;

  /**
   * The Amazon Resource Name (ARN) of the user's hierarchy group.
   */
  public hierarchyGroupArn?: string;

  /**
   * Information about the user identity.
   */
  public identityInfo?: cdk.IResolvable | CfnUser.UserIdentityInfoProperty;

  /**
   * The Amazon Resource Name (ARN) of the instance.
   */
  public instanceArn: string;

  /**
   * The user's password.
   */
  public password?: string;

  /**
   * Information about the phone configuration for the user.
   */
  public phoneConfig: cdk.IResolvable | CfnUser.UserPhoneConfigProperty;

  /**
   * The Amazon Resource Name (ARN) of the user's routing profile.
   */
  public routingProfileArn: string;

  /**
   * The Amazon Resource Name (ARN) of the user's security profile.
   */
  public securityProfileArns: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The user name assigned to the user account.
   */
  public username: string;

  /**
   * One or more predefined attributes assigned to a user, with a numeric value that indicates how their level of skill in a specified area.
   */
  public userProficiencies?: Array<cdk.IResolvable | CfnUser.UserProficiencyProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserProps) {
    super(scope, id, {
      "type": CfnUser.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "phoneConfig", this);
    cdk.requireProperty(props, "routingProfileArn", this);
    cdk.requireProperty(props, "securityProfileArns", this);
    cdk.requireProperty(props, "username", this);

    this.attrUserArn = cdk.Token.asString(this.getAtt("UserArn", cdk.ResolutionTypeHint.STRING));
    this.directoryUserId = props.directoryUserId;
    this.hierarchyGroupArn = props.hierarchyGroupArn;
    this.identityInfo = props.identityInfo;
    this.instanceArn = props.instanceArn;
    this.password = props.password;
    this.phoneConfig = props.phoneConfig;
    this.routingProfileArn = props.routingProfileArn;
    this.securityProfileArns = props.securityProfileArns;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Connect::User", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.username = props.username;
    this.userProficiencies = props.userProficiencies;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "directoryUserId": this.directoryUserId,
      "hierarchyGroupArn": this.hierarchyGroupArn,
      "identityInfo": this.identityInfo,
      "instanceArn": this.instanceArn,
      "password": this.password,
      "phoneConfig": this.phoneConfig,
      "routingProfileArn": this.routingProfileArn,
      "securityProfileArns": this.securityProfileArns,
      "tags": this.tags.renderTags(),
      "username": this.username,
      "userProficiencies": this.userProficiencies
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUser.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserPropsToCloudFormation(props);
  }
}

export namespace CfnUser {
  /**
   * Contains information about the phone configuration settings for a user.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html
   */
  export interface UserPhoneConfigProperty {
    /**
     * The After Call Work (ACW) timeout setting, in seconds.
     *
     * > When returned by a `SearchUsers` call, `AfterContactWorkTimeLimit` is returned in milliseconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html#cfn-connect-user-userphoneconfig-aftercontactworktimelimit
     */
    readonly afterContactWorkTimeLimit?: number;

    /**
     * The Auto accept setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html#cfn-connect-user-userphoneconfig-autoaccept
     */
    readonly autoAccept?: boolean | cdk.IResolvable;

    /**
     * The phone number for the user's desk phone.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html#cfn-connect-user-userphoneconfig-deskphonenumber
     */
    readonly deskPhoneNumber?: string;

    /**
     * The phone type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userphoneconfig.html#cfn-connect-user-userphoneconfig-phonetype
     */
    readonly phoneType: string;
  }

  /**
   * Contains information about the identity of a user.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html
   */
  export interface UserIdentityInfoProperty {
    /**
     * The email address.
     *
     * If you are using SAML for identity management and include this parameter, an error is returned.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-email
     */
    readonly email?: string;

    /**
     * The first name.
     *
     * This is required if you are using Amazon Connect or SAML for identity management.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-firstname
     */
    readonly firstName?: string;

    /**
     * The last name.
     *
     * This is required if you are using Amazon Connect or SAML for identity management.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-lastname
     */
    readonly lastName?: string;

    /**
     * The user's mobile number.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-mobile
     */
    readonly mobile?: string;

    /**
     * The user's secondary email address.
     *
     * If you provide a secondary email, the user receives email notifications -- other than password reset notifications -- to this email address instead of to their primary email address.
     *
     * *Pattern* : `(?=^.{0,265}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-useridentityinfo.html#cfn-connect-user-useridentityinfo-secondaryemail
     */
    readonly secondaryEmail?: string;
  }

  /**
   * > A predefined attribute must be created before using `UserProficiencies` in the Cloudformation *User* template.
   *
   * For more information, see [Predefined attributes](https://docs.aws.amazon.com/connect/latest/adminguide/predefined-attributes.html) .
   *
   * Proficiency of a user.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userproficiency.html
   */
  export interface UserProficiencyProperty {
    /**
     * The name of user’s proficiency.
     *
     * You must use a predefined attribute name that is present in the Amazon Connect instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userproficiency.html#cfn-connect-user-userproficiency-attributename
     */
    readonly attributeName: string;

    /**
     * The value of user’s proficiency.
     *
     * You must use a predefined attribute value that is present in the Amazon Connect instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userproficiency.html#cfn-connect-user-userproficiency-attributevalue
     */
    readonly attributeValue: string;

    /**
     * The level of the proficiency.
     *
     * The valid values are 1, 2, 3, 4 and 5.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-user-userproficiency.html#cfn-connect-user-userproficiency-level
     */
    readonly level: number;
  }
}

/**
 * Properties for defining a `CfnUser`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html
 */
export interface CfnUserProps {
  /**
   * The identifier of the user account in the directory used for identity management.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-directoryuserid
   */
  readonly directoryUserId?: string;

  /**
   * The Amazon Resource Name (ARN) of the user's hierarchy group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-hierarchygrouparn
   */
  readonly hierarchyGroupArn?: string;

  /**
   * Information about the user identity.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-identityinfo
   */
  readonly identityInfo?: cdk.IResolvable | CfnUser.UserIdentityInfoProperty;

  /**
   * The Amazon Resource Name (ARN) of the instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-instancearn
   */
  readonly instanceArn: string;

  /**
   * The user's password.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-password
   */
  readonly password?: string;

  /**
   * Information about the phone configuration for the user.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-phoneconfig
   */
  readonly phoneConfig: cdk.IResolvable | CfnUser.UserPhoneConfigProperty;

  /**
   * The Amazon Resource Name (ARN) of the user's routing profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-routingprofilearn
   */
  readonly routingProfileArn: string;

  /**
   * The Amazon Resource Name (ARN) of the user's security profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-securityprofilearns
   */
  readonly securityProfileArns: Array<string>;

  /**
   * The tags.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The user name assigned to the user account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-username
   */
  readonly username: string;

  /**
   * One or more predefined attributes assigned to a user, with a numeric value that indicates how their level of skill in a specified area.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-user.html#cfn-connect-user-userproficiencies
   */
  readonly userProficiencies?: Array<cdk.IResolvable | CfnUser.UserProficiencyProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `UserPhoneConfigProperty`
 *
 * @param properties - the TypeScript properties of a `UserPhoneConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserUserPhoneConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("afterContactWorkTimeLimit", cdk.validateNumber)(properties.afterContactWorkTimeLimit));
  errors.collect(cdk.propertyValidator("autoAccept", cdk.validateBoolean)(properties.autoAccept));
  errors.collect(cdk.propertyValidator("deskPhoneNumber", cdk.validateString)(properties.deskPhoneNumber));
  errors.collect(cdk.propertyValidator("phoneType", cdk.requiredValidator)(properties.phoneType));
  errors.collect(cdk.propertyValidator("phoneType", cdk.validateString)(properties.phoneType));
  return errors.wrap("supplied properties not correct for \"UserPhoneConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserUserPhoneConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserUserPhoneConfigPropertyValidator(properties).assertSuccess();
  return {
    "AfterContactWorkTimeLimit": cdk.numberToCloudFormation(properties.afterContactWorkTimeLimit),
    "AutoAccept": cdk.booleanToCloudFormation(properties.autoAccept),
    "DeskPhoneNumber": cdk.stringToCloudFormation(properties.deskPhoneNumber),
    "PhoneType": cdk.stringToCloudFormation(properties.phoneType)
  };
}

// @ts-ignore TS6133
function CfnUserUserPhoneConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUser.UserPhoneConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUser.UserPhoneConfigProperty>();
  ret.addPropertyResult("afterContactWorkTimeLimit", "AfterContactWorkTimeLimit", (properties.AfterContactWorkTimeLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.AfterContactWorkTimeLimit) : undefined));
  ret.addPropertyResult("autoAccept", "AutoAccept", (properties.AutoAccept != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AutoAccept) : undefined));
  ret.addPropertyResult("deskPhoneNumber", "DeskPhoneNumber", (properties.DeskPhoneNumber != null ? cfn_parse.FromCloudFormation.getString(properties.DeskPhoneNumber) : undefined));
  ret.addPropertyResult("phoneType", "PhoneType", (properties.PhoneType != null ? cfn_parse.FromCloudFormation.getString(properties.PhoneType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UserIdentityInfoProperty`
 *
 * @param properties - the TypeScript properties of a `UserIdentityInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserUserIdentityInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("email", cdk.validateString)(properties.email));
  errors.collect(cdk.propertyValidator("firstName", cdk.validateString)(properties.firstName));
  errors.collect(cdk.propertyValidator("lastName", cdk.validateString)(properties.lastName));
  errors.collect(cdk.propertyValidator("mobile", cdk.validateString)(properties.mobile));
  errors.collect(cdk.propertyValidator("secondaryEmail", cdk.validateString)(properties.secondaryEmail));
  return errors.wrap("supplied properties not correct for \"UserIdentityInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserUserIdentityInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserUserIdentityInfoPropertyValidator(properties).assertSuccess();
  return {
    "Email": cdk.stringToCloudFormation(properties.email),
    "FirstName": cdk.stringToCloudFormation(properties.firstName),
    "LastName": cdk.stringToCloudFormation(properties.lastName),
    "Mobile": cdk.stringToCloudFormation(properties.mobile),
    "SecondaryEmail": cdk.stringToCloudFormation(properties.secondaryEmail)
  };
}

// @ts-ignore TS6133
function CfnUserUserIdentityInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUser.UserIdentityInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUser.UserIdentityInfoProperty>();
  ret.addPropertyResult("email", "Email", (properties.Email != null ? cfn_parse.FromCloudFormation.getString(properties.Email) : undefined));
  ret.addPropertyResult("firstName", "FirstName", (properties.FirstName != null ? cfn_parse.FromCloudFormation.getString(properties.FirstName) : undefined));
  ret.addPropertyResult("lastName", "LastName", (properties.LastName != null ? cfn_parse.FromCloudFormation.getString(properties.LastName) : undefined));
  ret.addPropertyResult("mobile", "Mobile", (properties.Mobile != null ? cfn_parse.FromCloudFormation.getString(properties.Mobile) : undefined));
  ret.addPropertyResult("secondaryEmail", "SecondaryEmail", (properties.SecondaryEmail != null ? cfn_parse.FromCloudFormation.getString(properties.SecondaryEmail) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UserProficiencyProperty`
 *
 * @param properties - the TypeScript properties of a `UserProficiencyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserUserProficiencyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributeName", cdk.requiredValidator)(properties.attributeName));
  errors.collect(cdk.propertyValidator("attributeName", cdk.validateString)(properties.attributeName));
  errors.collect(cdk.propertyValidator("attributeValue", cdk.requiredValidator)(properties.attributeValue));
  errors.collect(cdk.propertyValidator("attributeValue", cdk.validateString)(properties.attributeValue));
  errors.collect(cdk.propertyValidator("level", cdk.requiredValidator)(properties.level));
  errors.collect(cdk.propertyValidator("level", cdk.validateNumber)(properties.level));
  return errors.wrap("supplied properties not correct for \"UserProficiencyProperty\"");
}

// @ts-ignore TS6133
function convertCfnUserUserProficiencyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserUserProficiencyPropertyValidator(properties).assertSuccess();
  return {
    "AttributeName": cdk.stringToCloudFormation(properties.attributeName),
    "AttributeValue": cdk.stringToCloudFormation(properties.attributeValue),
    "Level": cdk.numberToCloudFormation(properties.level)
  };
}

// @ts-ignore TS6133
function CfnUserUserProficiencyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnUser.UserProficiencyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUser.UserProficiencyProperty>();
  ret.addPropertyResult("attributeName", "AttributeName", (properties.AttributeName != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeName) : undefined));
  ret.addPropertyResult("attributeValue", "AttributeValue", (properties.AttributeValue != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeValue) : undefined));
  ret.addPropertyResult("level", "Level", (properties.Level != null ? cfn_parse.FromCloudFormation.getNumber(properties.Level) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnUserProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("directoryUserId", cdk.validateString)(properties.directoryUserId));
  errors.collect(cdk.propertyValidator("hierarchyGroupArn", cdk.validateString)(properties.hierarchyGroupArn));
  errors.collect(cdk.propertyValidator("identityInfo", CfnUserUserIdentityInfoPropertyValidator)(properties.identityInfo));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("phoneConfig", cdk.requiredValidator)(properties.phoneConfig));
  errors.collect(cdk.propertyValidator("phoneConfig", CfnUserUserPhoneConfigPropertyValidator)(properties.phoneConfig));
  errors.collect(cdk.propertyValidator("routingProfileArn", cdk.requiredValidator)(properties.routingProfileArn));
  errors.collect(cdk.propertyValidator("routingProfileArn", cdk.validateString)(properties.routingProfileArn));
  errors.collect(cdk.propertyValidator("securityProfileArns", cdk.requiredValidator)(properties.securityProfileArns));
  errors.collect(cdk.propertyValidator("securityProfileArns", cdk.listValidator(cdk.validateString))(properties.securityProfileArns));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("userProficiencies", cdk.listValidator(CfnUserUserProficiencyPropertyValidator))(properties.userProficiencies));
  errors.collect(cdk.propertyValidator("username", cdk.requiredValidator)(properties.username));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"CfnUserProps\"");
}

// @ts-ignore TS6133
function convertCfnUserPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserPropsValidator(properties).assertSuccess();
  return {
    "DirectoryUserId": cdk.stringToCloudFormation(properties.directoryUserId),
    "HierarchyGroupArn": cdk.stringToCloudFormation(properties.hierarchyGroupArn),
    "IdentityInfo": convertCfnUserUserIdentityInfoPropertyToCloudFormation(properties.identityInfo),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "Password": cdk.stringToCloudFormation(properties.password),
    "PhoneConfig": convertCfnUserUserPhoneConfigPropertyToCloudFormation(properties.phoneConfig),
    "RoutingProfileArn": cdk.stringToCloudFormation(properties.routingProfileArn),
    "SecurityProfileArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityProfileArns),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UserProficiencies": cdk.listMapper(convertCfnUserUserProficiencyPropertyToCloudFormation)(properties.userProficiencies),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnUserPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserProps>();
  ret.addPropertyResult("directoryUserId", "DirectoryUserId", (properties.DirectoryUserId != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryUserId) : undefined));
  ret.addPropertyResult("hierarchyGroupArn", "HierarchyGroupArn", (properties.HierarchyGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.HierarchyGroupArn) : undefined));
  ret.addPropertyResult("identityInfo", "IdentityInfo", (properties.IdentityInfo != null ? CfnUserUserIdentityInfoPropertyFromCloudFormation(properties.IdentityInfo) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("phoneConfig", "PhoneConfig", (properties.PhoneConfig != null ? CfnUserUserPhoneConfigPropertyFromCloudFormation(properties.PhoneConfig) : undefined));
  ret.addPropertyResult("routingProfileArn", "RoutingProfileArn", (properties.RoutingProfileArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoutingProfileArn) : undefined));
  ret.addPropertyResult("securityProfileArns", "SecurityProfileArns", (properties.SecurityProfileArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityProfileArns) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addPropertyResult("userProficiencies", "UserProficiencies", (properties.UserProficiencies != null ? cfn_parse.FromCloudFormation.getArray(CfnUserUserProficiencyPropertyFromCloudFormation)(properties.UserProficiencies) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a new user hierarchy group.
 *
 * @cloudformationResource AWS::Connect::UserHierarchyGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html
 */
export class CfnUserHierarchyGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::UserHierarchyGroup";

  /**
   * Build a CfnUserHierarchyGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnUserHierarchyGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnUserHierarchyGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnUserHierarchyGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the user hierarchy group.
   *
   * @cloudformationAttribute UserHierarchyGroupArn
   */
  public readonly attrUserHierarchyGroupArn: string;

  /**
   * The Amazon Resource Name (ARN) of the user hierarchy group.
   */
  public instanceArn: string;

  /**
   * The name of the user hierarchy group.
   */
  public name: string;

  /**
   * The Amazon Resource Name (ARN) of the parent group.
   */
  public parentGroupArn?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnUserHierarchyGroupProps) {
    super(scope, id, {
      "type": CfnUserHierarchyGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "name", this);

    this.attrUserHierarchyGroupArn = cdk.Token.asString(this.getAtt("UserHierarchyGroupArn", cdk.ResolutionTypeHint.STRING));
    this.instanceArn = props.instanceArn;
    this.name = props.name;
    this.parentGroupArn = props.parentGroupArn;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "instanceArn": this.instanceArn,
      "name": this.name,
      "parentGroupArn": this.parentGroupArn,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnUserHierarchyGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnUserHierarchyGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnUserHierarchyGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html
 */
export interface CfnUserHierarchyGroupProps {
  /**
   * The Amazon Resource Name (ARN) of the user hierarchy group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-instancearn
   */
  readonly instanceArn: string;

  /**
   * The name of the user hierarchy group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-name
   */
  readonly name: string;

  /**
   * The Amazon Resource Name (ARN) of the parent group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-parentgrouparn
   */
  readonly parentGroupArn?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-userhierarchygroup.html#cfn-connect-userhierarchygroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnUserHierarchyGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnUserHierarchyGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnUserHierarchyGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("parentGroupArn", cdk.validateString)(properties.parentGroupArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnUserHierarchyGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnUserHierarchyGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnUserHierarchyGroupPropsValidator(properties).assertSuccess();
  return {
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ParentGroupArn": cdk.stringToCloudFormation(properties.parentGroupArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnUserHierarchyGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnUserHierarchyGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnUserHierarchyGroupProps>();
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("parentGroupArn", "ParentGroupArn", (properties.ParentGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.ParentGroupArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a customer-managed view in the published state within the specified instance.
 *
 * @cloudformationResource AWS::Connect::View
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-view.html
 */
export class CfnView extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::View";

  /**
   * Build a CfnView from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnView {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnViewPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnView(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unqualified Amazon Resource Name (ARN) of the view.
   *
   * For example:
   *
   * `arn:<partition>:connect:<region>:<accountId>:instance/00000000-0000-0000-0000-000000000000/view/00000000-0000-0000-0000-000000000000`
   *
   * @cloudformationAttribute ViewArn
   */
  public readonly attrViewArn: string;

  /**
   * Indicates the checksum value of the latest published view content.
   *
   * @cloudformationAttribute ViewContentSha256
   */
  public readonly attrViewContentSha256: string;

  /**
   * The identifier of the view.
   *
   * @cloudformationAttribute ViewId
   */
  public readonly attrViewId: string;

  /**
   * A list of actions possible from the view.
   */
  public actions: Array<string>;

  /**
   * The description of the view.
   */
  public description?: string;

  /**
   * The Amazon Resource Name (ARN) of the instance.
   */
  public instanceArn: string;

  /**
   * The name of the view.
   */
  public name: string;

  /**
   * The tags associated with the view resource (not specific to view version).
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The view template representing the structure of the view.
   */
  public template: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnViewProps) {
    super(scope, id, {
      "type": CfnView.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "actions", this);
    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "template", this);

    this.attrViewArn = cdk.Token.asString(this.getAtt("ViewArn", cdk.ResolutionTypeHint.STRING));
    this.attrViewContentSha256 = cdk.Token.asString(this.getAtt("ViewContentSha256", cdk.ResolutionTypeHint.STRING));
    this.attrViewId = cdk.Token.asString(this.getAtt("ViewId", cdk.ResolutionTypeHint.STRING));
    this.actions = props.actions;
    this.description = props.description;
    this.instanceArn = props.instanceArn;
    this.name = props.name;
    this.tags = props.tags;
    this.template = props.template;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "actions": this.actions,
      "description": this.description,
      "instanceArn": this.instanceArn,
      "name": this.name,
      "tags": this.tags,
      "template": this.template
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnView.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnViewPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnView`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-view.html
 */
export interface CfnViewProps {
  /**
   * A list of actions possible from the view.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-view.html#cfn-connect-view-actions
   */
  readonly actions: Array<string>;

  /**
   * The description of the view.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-view.html#cfn-connect-view-description
   */
  readonly description?: string;

  /**
   * The Amazon Resource Name (ARN) of the instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-view.html#cfn-connect-view-instancearn
   */
  readonly instanceArn: string;

  /**
   * The name of the view.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-view.html#cfn-connect-view-name
   */
  readonly name: string;

  /**
   * The tags associated with the view resource (not specific to view version).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-view.html#cfn-connect-view-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The view template representing the structure of the view.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-view.html#cfn-connect-view-template
   */
  readonly template: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnViewProps`
 *
 * @param properties - the TypeScript properties of a `CfnViewProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnViewPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.requiredValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("actions", cdk.listValidator(cdk.validateString))(properties.actions));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("template", cdk.requiredValidator)(properties.template));
  errors.collect(cdk.propertyValidator("template", cdk.validateObject)(properties.template));
  return errors.wrap("supplied properties not correct for \"CfnViewProps\"");
}

// @ts-ignore TS6133
function convertCfnViewPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnViewPropsValidator(properties).assertSuccess();
  return {
    "Actions": cdk.listMapper(cdk.stringToCloudFormation)(properties.actions),
    "Description": cdk.stringToCloudFormation(properties.description),
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Template": cdk.objectToCloudFormation(properties.template)
  };
}

// @ts-ignore TS6133
function CfnViewPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnViewProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnViewProps>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Actions) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("template", "Template", (properties.Template != null ? cfn_parse.FromCloudFormation.getAny(properties.Template) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a version for the specified customer-managed view within the specified instance.
 *
 * @cloudformationResource AWS::Connect::ViewVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-viewversion.html
 */
export class CfnViewVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::ViewVersion";

  /**
   * Build a CfnViewVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnViewVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnViewVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnViewVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Current version of the view.
   *
   * @cloudformationAttribute Version
   */
  public readonly attrVersion: number;

  /**
   * The Amazon Resource Name (ARN) of the view version.
   *
   * @cloudformationAttribute ViewVersionArn
   */
  public readonly attrViewVersionArn: string;

  /**
   * The description of the view version.
   */
  public versionDescription?: string;

  /**
   * The unqualified Amazon Resource Name (ARN) of the view.
   */
  public viewArn: string;

  /**
   * Indicates the checksum value of the latest published view content.
   */
  public viewContentSha256?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnViewVersionProps) {
    super(scope, id, {
      "type": CfnViewVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "viewArn", this);

    this.attrVersion = cdk.Token.asNumber(this.getAtt("Version", cdk.ResolutionTypeHint.NUMBER));
    this.attrViewVersionArn = cdk.Token.asString(this.getAtt("ViewVersionArn", cdk.ResolutionTypeHint.STRING));
    this.versionDescription = props.versionDescription;
    this.viewArn = props.viewArn;
    this.viewContentSha256 = props.viewContentSha256;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "versionDescription": this.versionDescription,
      "viewArn": this.viewArn,
      "viewContentSha256": this.viewContentSha256
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnViewVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnViewVersionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnViewVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-viewversion.html
 */
export interface CfnViewVersionProps {
  /**
   * The description of the view version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-viewversion.html#cfn-connect-viewversion-versiondescription
   */
  readonly versionDescription?: string;

  /**
   * The unqualified Amazon Resource Name (ARN) of the view.
   *
   * For example:
   *
   * `arn:<partition>:connect:<region>:<accountId>:instance/00000000-0000-0000-0000-000000000000/view/00000000-0000-0000-0000-000000000000`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-viewversion.html#cfn-connect-viewversion-viewarn
   */
  readonly viewArn: string;

  /**
   * Indicates the checksum value of the latest published view content.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-viewversion.html#cfn-connect-viewversion-viewcontentsha256
   */
  readonly viewContentSha256?: string;
}

/**
 * Determine whether the given properties match those of a `CfnViewVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnViewVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnViewVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("versionDescription", cdk.validateString)(properties.versionDescription));
  errors.collect(cdk.propertyValidator("viewArn", cdk.requiredValidator)(properties.viewArn));
  errors.collect(cdk.propertyValidator("viewArn", cdk.validateString)(properties.viewArn));
  errors.collect(cdk.propertyValidator("viewContentSha256", cdk.validateString)(properties.viewContentSha256));
  return errors.wrap("supplied properties not correct for \"CfnViewVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnViewVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnViewVersionPropsValidator(properties).assertSuccess();
  return {
    "VersionDescription": cdk.stringToCloudFormation(properties.versionDescription),
    "ViewArn": cdk.stringToCloudFormation(properties.viewArn),
    "ViewContentSha256": cdk.stringToCloudFormation(properties.viewContentSha256)
  };
}

// @ts-ignore TS6133
function CfnViewVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnViewVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnViewVersionProps>();
  ret.addPropertyResult("versionDescription", "VersionDescription", (properties.VersionDescription != null ? cfn_parse.FromCloudFormation.getString(properties.VersionDescription) : undefined));
  ret.addPropertyResult("viewArn", "ViewArn", (properties.ViewArn != null ? cfn_parse.FromCloudFormation.getString(properties.ViewArn) : undefined));
  ret.addPropertyResult("viewContentSha256", "ViewContentSha256", (properties.ViewContentSha256 != null ? cfn_parse.FromCloudFormation.getString(properties.ViewContentSha256) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Textual or numeric value that describes an attribute.
 *
 * @cloudformationResource AWS::Connect::PredefinedAttribute
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-predefinedattribute.html
 */
export class CfnPredefinedAttribute extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Connect::PredefinedAttribute";

  /**
   * Build a CfnPredefinedAttribute from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPredefinedAttribute {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPredefinedAttributePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPredefinedAttribute(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the instance.
   */
  public instanceArn: string;

  /**
   * The name of the predefined attribute.
   */
  public name: string;

  /**
   * The values of a predefined attribute.
   */
  public values: cdk.IResolvable | CfnPredefinedAttribute.ValuesProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPredefinedAttributeProps) {
    super(scope, id, {
      "type": CfnPredefinedAttribute.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instanceArn", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "values", this);

    this.instanceArn = props.instanceArn;
    this.name = props.name;
    this.values = props.values;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "instanceArn": this.instanceArn,
      "name": this.name,
      "values": this.values
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPredefinedAttribute.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPredefinedAttributePropsToCloudFormation(props);
  }
}

export namespace CfnPredefinedAttribute {
  /**
   * The values of a predefined attribute.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-predefinedattribute-values.html
   */
  export interface ValuesProperty {
    /**
     * Predefined attribute values of type string list.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connect-predefinedattribute-values.html#cfn-connect-predefinedattribute-values-stringlist
     */
    readonly stringList?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnPredefinedAttribute`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-predefinedattribute.html
 */
export interface CfnPredefinedAttributeProps {
  /**
   * The Amazon Resource Name (ARN) of the instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-predefinedattribute.html#cfn-connect-predefinedattribute-instancearn
   */
  readonly instanceArn: string;

  /**
   * The name of the predefined attribute.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-predefinedattribute.html#cfn-connect-predefinedattribute-name
   */
  readonly name: string;

  /**
   * The values of a predefined attribute.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connect-predefinedattribute.html#cfn-connect-predefinedattribute-values
   */
  readonly values: cdk.IResolvable | CfnPredefinedAttribute.ValuesProperty;
}

/**
 * Determine whether the given properties match those of a `ValuesProperty`
 *
 * @param properties - the TypeScript properties of a `ValuesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPredefinedAttributeValuesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("stringList", cdk.listValidator(cdk.validateString))(properties.stringList));
  return errors.wrap("supplied properties not correct for \"ValuesProperty\"");
}

// @ts-ignore TS6133
function convertCfnPredefinedAttributeValuesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPredefinedAttributeValuesPropertyValidator(properties).assertSuccess();
  return {
    "StringList": cdk.listMapper(cdk.stringToCloudFormation)(properties.stringList)
  };
}

// @ts-ignore TS6133
function CfnPredefinedAttributeValuesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPredefinedAttribute.ValuesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPredefinedAttribute.ValuesProperty>();
  ret.addPropertyResult("stringList", "StringList", (properties.StringList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StringList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPredefinedAttributeProps`
 *
 * @param properties - the TypeScript properties of a `CfnPredefinedAttributeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPredefinedAttributePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instanceArn", cdk.requiredValidator)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("instanceArn", cdk.validateString)(properties.instanceArn));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("values", cdk.requiredValidator)(properties.values));
  errors.collect(cdk.propertyValidator("values", CfnPredefinedAttributeValuesPropertyValidator)(properties.values));
  return errors.wrap("supplied properties not correct for \"CfnPredefinedAttributeProps\"");
}

// @ts-ignore TS6133
function convertCfnPredefinedAttributePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPredefinedAttributePropsValidator(properties).assertSuccess();
  return {
    "InstanceArn": cdk.stringToCloudFormation(properties.instanceArn),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Values": convertCfnPredefinedAttributeValuesPropertyToCloudFormation(properties.values)
  };
}

// @ts-ignore TS6133
function CfnPredefinedAttributePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPredefinedAttributeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPredefinedAttributeProps>();
  ret.addPropertyResult("instanceArn", "InstanceArn", (properties.InstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceArn) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? CfnPredefinedAttributeValuesPropertyFromCloudFormation(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}