/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Use the `AWS::EventSchemas::Discoverer` resource to specify a *discoverer* that is associated with an event bus.
 *
 * A discoverer allows the Amazon EventBridge Schema Registry to automatically generate schemas based on events on an event bus.
 *
 * @cloudformationResource AWS::EventSchemas::Discoverer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html
 */
export class CfnDiscoverer extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EventSchemas::Discoverer";

  /**
   * Build a CfnDiscoverer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDiscoverer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDiscovererPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDiscoverer(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute CrossAccount
   */
  public readonly attrCrossAccount: cdk.IResolvable;

  /**
   * The ARN of the discoverer.
   *
   * @cloudformationAttribute DiscovererArn
   */
  public readonly attrDiscovererArn: string;

  /**
   * The ID of the discoverer.
   *
   * @cloudformationAttribute DiscovererId
   */
  public readonly attrDiscovererId: string;

  /**
   * The state of the discoverer.
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * Allows for the discovery of the event schemas that are sent to the event bus from another account.
   */
  public crossAccount?: boolean | cdk.IResolvable;

  /**
   * A description for the discoverer.
   */
  public description?: string;

  /**
   * The ARN of the event bus.
   */
  public sourceArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags associated with the resource.
   */
  public tagsRaw?: Array<CfnDiscoverer.TagsEntryProperty>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDiscovererProps) {
    super(scope, id, {
      "type": CfnDiscoverer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "sourceArn", this);

    this.attrCrossAccount = this.getAtt("CrossAccount");
    this.attrDiscovererArn = cdk.Token.asString(this.getAtt("DiscovererArn", cdk.ResolutionTypeHint.STRING));
    this.attrDiscovererId = cdk.Token.asString(this.getAtt("DiscovererId", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.crossAccount = props.crossAccount;
    this.description = props.description;
    this.sourceArn = props.sourceArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EventSchemas::Discoverer", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "crossAccount": this.crossAccount,
      "description": this.description,
      "sourceArn": this.sourceArn,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDiscoverer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDiscovererPropsToCloudFormation(props);
  }
}

export namespace CfnDiscoverer {
  /**
   * Tags to associate with the discoverer.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-discoverer-tagsentry.html
   */
  export interface TagsEntryProperty {
    /**
     * The key of a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-discoverer-tagsentry.html#cfn-eventschemas-discoverer-tagsentry-key
     */
    readonly key: string;

    /**
     * The value of a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-discoverer-tagsentry.html#cfn-eventschemas-discoverer-tagsentry-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnDiscoverer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html
 */
export interface CfnDiscovererProps {
  /**
   * Allows for the discovery of the event schemas that are sent to the event bus from another account.
   *
   * @default - true
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html#cfn-eventschemas-discoverer-crossaccount
   */
  readonly crossAccount?: boolean | cdk.IResolvable;

  /**
   * A description for the discoverer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html#cfn-eventschemas-discoverer-description
   */
  readonly description?: string;

  /**
   * The ARN of the event bus.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html#cfn-eventschemas-discoverer-sourcearn
   */
  readonly sourceArn: string;

  /**
   * Tags associated with the resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-discoverer.html#cfn-eventschemas-discoverer-tags
   */
  readonly tags?: Array<CfnDiscoverer.TagsEntryProperty>;
}

/**
 * Determine whether the given properties match those of a `TagsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDiscovererTagsEntryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsEntryProperty\"");
}

// @ts-ignore TS6133
function convertCfnDiscovererTagsEntryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDiscovererTagsEntryPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnDiscovererTagsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDiscoverer.TagsEntryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDiscoverer.TagsEntryProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDiscovererProps`
 *
 * @param properties - the TypeScript properties of a `CfnDiscovererProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDiscovererPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("crossAccount", cdk.validateBoolean)(properties.crossAccount));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("sourceArn", cdk.requiredValidator)(properties.sourceArn));
  errors.collect(cdk.propertyValidator("sourceArn", cdk.validateString)(properties.sourceArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnDiscovererTagsEntryPropertyValidator))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDiscovererProps\"");
}

// @ts-ignore TS6133
function convertCfnDiscovererPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDiscovererPropsValidator(properties).assertSuccess();
  return {
    "CrossAccount": cdk.booleanToCloudFormation(properties.crossAccount),
    "Description": cdk.stringToCloudFormation(properties.description),
    "SourceArn": cdk.stringToCloudFormation(properties.sourceArn),
    "Tags": cdk.listMapper(convertCfnDiscovererTagsEntryPropertyToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDiscovererPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDiscovererProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDiscovererProps>();
  ret.addPropertyResult("crossAccount", "CrossAccount", (properties.CrossAccount != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CrossAccount) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("sourceArn", "SourceArn", (properties.SourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnDiscovererTagsEntryPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::EventSchemas::Registry` to specify a schema registry.
 *
 * Schema registries are containers for Schemas. Registries collect and organize schemas so that your schemas are in logical groups.
 *
 * @cloudformationResource AWS::EventSchemas::Registry
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registry.html
 */
export class CfnRegistry extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EventSchemas::Registry";

  /**
   * Build a CfnRegistry from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRegistry {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRegistryPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRegistry(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the registry.
   *
   * @cloudformationAttribute RegistryArn
   */
  public readonly attrRegistryArn: string;

  /**
   * The name of the registry.
   *
   * @cloudformationAttribute RegistryName
   */
  public readonly attrRegistryName: string;

  /**
   * A description of the registry to be created.
   */
  public description?: string;

  /**
   * The name of the schema registry.
   */
  public registryName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags to associate with the registry.
   */
  public tagsRaw?: Array<CfnRegistry.TagsEntryProperty>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRegistryProps = {}) {
    super(scope, id, {
      "type": CfnRegistry.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrRegistryArn = cdk.Token.asString(this.getAtt("RegistryArn", cdk.ResolutionTypeHint.STRING));
    this.attrRegistryName = cdk.Token.asString(this.getAtt("RegistryName", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.registryName = props.registryName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EventSchemas::Registry", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "registryName": this.registryName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRegistry.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRegistryPropsToCloudFormation(props);
  }
}

export namespace CfnRegistry {
  /**
   * Tags to associate with the schema registry.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-registry-tagsentry.html
   */
  export interface TagsEntryProperty {
    /**
     * The key of a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-registry-tagsentry.html#cfn-eventschemas-registry-tagsentry-key
     */
    readonly key: string;

    /**
     * The value of a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-registry-tagsentry.html#cfn-eventschemas-registry-tagsentry-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnRegistry`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registry.html
 */
export interface CfnRegistryProps {
  /**
   * A description of the registry to be created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registry.html#cfn-eventschemas-registry-description
   */
  readonly description?: string;

  /**
   * The name of the schema registry.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registry.html#cfn-eventschemas-registry-registryname
   */
  readonly registryName?: string;

  /**
   * Tags to associate with the registry.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registry.html#cfn-eventschemas-registry-tags
   */
  readonly tags?: Array<CfnRegistry.TagsEntryProperty>;
}

/**
 * Determine whether the given properties match those of a `TagsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRegistryTagsEntryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsEntryProperty\"");
}

// @ts-ignore TS6133
function convertCfnRegistryTagsEntryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRegistryTagsEntryPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnRegistryTagsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRegistry.TagsEntryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRegistry.TagsEntryProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRegistryProps`
 *
 * @param properties - the TypeScript properties of a `CfnRegistryProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRegistryPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("registryName", cdk.validateString)(properties.registryName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnRegistryTagsEntryPropertyValidator))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRegistryProps\"");
}

// @ts-ignore TS6133
function convertCfnRegistryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRegistryPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "RegistryName": cdk.stringToCloudFormation(properties.registryName),
    "Tags": cdk.listMapper(convertCfnRegistryTagsEntryPropertyToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRegistryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRegistryProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRegistryProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("registryName", "RegistryName", (properties.RegistryName != null ? cfn_parse.FromCloudFormation.getString(properties.RegistryName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnRegistryTagsEntryPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::EventSchemas::RegistryPolicy` resource to specify resource-based policies for an EventBridge Schema Registry.
 *
 * @cloudformationResource AWS::EventSchemas::RegistryPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registrypolicy.html
 */
export class CfnRegistryPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EventSchemas::RegistryPolicy";

  /**
   * Build a CfnRegistryPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRegistryPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRegistryPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRegistryPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the policy.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A resource-based policy.
   */
  public policy: any | cdk.IResolvable;

  /**
   * The name of the registry.
   */
  public registryName: string;

  /**
   * The revision ID of the policy.
   */
  public revisionId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRegistryPolicyProps) {
    super(scope, id, {
      "type": CfnRegistryPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policy", this);
    cdk.requireProperty(props, "registryName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.policy = props.policy;
    this.registryName = props.registryName;
    this.revisionId = props.revisionId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policy": this.policy,
      "registryName": this.registryName,
      "revisionId": this.revisionId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRegistryPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRegistryPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRegistryPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registrypolicy.html
 */
export interface CfnRegistryPolicyProps {
  /**
   * A resource-based policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registrypolicy.html#cfn-eventschemas-registrypolicy-policy
   */
  readonly policy: any | cdk.IResolvable;

  /**
   * The name of the registry.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registrypolicy.html#cfn-eventschemas-registrypolicy-registryname
   */
  readonly registryName: string;

  /**
   * The revision ID of the policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-registrypolicy.html#cfn-eventschemas-registrypolicy-revisionid
   */
  readonly revisionId?: string;
}

/**
 * Determine whether the given properties match those of a `CfnRegistryPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnRegistryPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRegistryPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateObject)(properties.policy));
  errors.collect(cdk.propertyValidator("registryName", cdk.requiredValidator)(properties.registryName));
  errors.collect(cdk.propertyValidator("registryName", cdk.validateString)(properties.registryName));
  errors.collect(cdk.propertyValidator("revisionId", cdk.validateString)(properties.revisionId));
  return errors.wrap("supplied properties not correct for \"CfnRegistryPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnRegistryPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRegistryPolicyPropsValidator(properties).assertSuccess();
  return {
    "Policy": cdk.objectToCloudFormation(properties.policy),
    "RegistryName": cdk.stringToCloudFormation(properties.registryName),
    "RevisionId": cdk.stringToCloudFormation(properties.revisionId)
  };
}

// @ts-ignore TS6133
function CfnRegistryPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRegistryPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRegistryPolicyProps>();
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined));
  ret.addPropertyResult("registryName", "RegistryName", (properties.RegistryName != null ? cfn_parse.FromCloudFormation.getString(properties.RegistryName) : undefined));
  ret.addPropertyResult("revisionId", "RevisionId", (properties.RevisionId != null ? cfn_parse.FromCloudFormation.getString(properties.RevisionId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the `AWS::EventSchemas::Schema` resource to specify an event schema.
 *
 * @cloudformationResource AWS::EventSchemas::Schema
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html
 */
export class CfnSchema extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EventSchemas::Schema";

  /**
   * Build a CfnSchema from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSchema {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSchemaPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSchema(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The date and time that schema was modified.
   *
   * @cloudformationAttribute LastModified
   */
  public readonly attrLastModified: string;

  /**
   * The ARN of the schema.
   *
   * @cloudformationAttribute SchemaArn
   */
  public readonly attrSchemaArn: string;

  /**
   * The name of the schema.
   *
   * @cloudformationAttribute SchemaName
   */
  public readonly attrSchemaName: string;

  /**
   * The version number of the schema.
   *
   * @cloudformationAttribute SchemaVersion
   */
  public readonly attrSchemaVersion: string;

  /**
   * The date the schema version was created.
   *
   * @cloudformationAttribute VersionCreatedDate
   */
  public readonly attrVersionCreatedDate: string;

  /**
   * The source of the schema definition.
   */
  public content: string;

  /**
   * A description of the schema.
   */
  public description?: string;

  /**
   * The name of the schema registry.
   */
  public registryName: string;

  /**
   * The name of the schema.
   */
  public schemaName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags associated with the schema.
   */
  public tagsRaw?: Array<CfnSchema.TagsEntryProperty>;

  /**
   * The type of schema.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSchemaProps) {
    super(scope, id, {
      "type": CfnSchema.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "content", this);
    cdk.requireProperty(props, "registryName", this);
    cdk.requireProperty(props, "type", this);

    this.attrLastModified = cdk.Token.asString(this.getAtt("LastModified", cdk.ResolutionTypeHint.STRING));
    this.attrSchemaArn = cdk.Token.asString(this.getAtt("SchemaArn", cdk.ResolutionTypeHint.STRING));
    this.attrSchemaName = cdk.Token.asString(this.getAtt("SchemaName", cdk.ResolutionTypeHint.STRING));
    this.attrSchemaVersion = cdk.Token.asString(this.getAtt("SchemaVersion", cdk.ResolutionTypeHint.STRING));
    this.attrVersionCreatedDate = cdk.Token.asString(this.getAtt("VersionCreatedDate", cdk.ResolutionTypeHint.STRING));
    this.content = props.content;
    this.description = props.description;
    this.registryName = props.registryName;
    this.schemaName = props.schemaName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EventSchemas::Schema", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "content": this.content,
      "description": this.description,
      "registryName": this.registryName,
      "schemaName": this.schemaName,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSchema.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSchemaPropsToCloudFormation(props);
  }
}

export namespace CfnSchema {
  /**
   * Tags to associate with the schema.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-schema-tagsentry.html
   */
  export interface TagsEntryProperty {
    /**
     * The key of a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-schema-tagsentry.html#cfn-eventschemas-schema-tagsentry-key
     */
    readonly key: string;

    /**
     * The value of a key-value pair.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eventschemas-schema-tagsentry.html#cfn-eventschemas-schema-tagsentry-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnSchema`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html
 */
export interface CfnSchemaProps {
  /**
   * The source of the schema definition.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-content
   */
  readonly content: string;

  /**
   * A description of the schema.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-description
   */
  readonly description?: string;

  /**
   * The name of the schema registry.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-registryname
   */
  readonly registryName: string;

  /**
   * The name of the schema.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-schemaname
   */
  readonly schemaName?: string;

  /**
   * Tags associated with the schema.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-tags
   */
  readonly tags?: Array<CfnSchema.TagsEntryProperty>;

  /**
   * The type of schema.
   *
   * Valid types include `OpenApi3` and `JSONSchemaDraft4` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eventschemas-schema.html#cfn-eventschemas-schema-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `TagsEntryProperty`
 *
 * @param properties - the TypeScript properties of a `TagsEntryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchemaTagsEntryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsEntryProperty\"");
}

// @ts-ignore TS6133
function convertCfnSchemaTagsEntryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchemaTagsEntryPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnSchemaTagsEntryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSchema.TagsEntryProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchema.TagsEntryProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSchemaProps`
 *
 * @param properties - the TypeScript properties of a `CfnSchemaProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchemaPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("content", cdk.requiredValidator)(properties.content));
  errors.collect(cdk.propertyValidator("content", cdk.validateString)(properties.content));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("registryName", cdk.requiredValidator)(properties.registryName));
  errors.collect(cdk.propertyValidator("registryName", cdk.validateString)(properties.registryName));
  errors.collect(cdk.propertyValidator("schemaName", cdk.validateString)(properties.schemaName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnSchemaTagsEntryPropertyValidator))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnSchemaProps\"");
}

// @ts-ignore TS6133
function convertCfnSchemaPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchemaPropsValidator(properties).assertSuccess();
  return {
    "Content": cdk.stringToCloudFormation(properties.content),
    "Description": cdk.stringToCloudFormation(properties.description),
    "RegistryName": cdk.stringToCloudFormation(properties.registryName),
    "SchemaName": cdk.stringToCloudFormation(properties.schemaName),
    "Tags": cdk.listMapper(convertCfnSchemaTagsEntryPropertyToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnSchemaPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSchemaProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSchemaProps>();
  ret.addPropertyResult("content", "Content", (properties.Content != null ? cfn_parse.FromCloudFormation.getString(properties.Content) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("registryName", "RegistryName", (properties.RegistryName != null ? cfn_parse.FromCloudFormation.getString(properties.RegistryName) : undefined));
  ret.addPropertyResult("schemaName", "SchemaName", (properties.SchemaName != null ? cfn_parse.FromCloudFormation.getString(properties.SchemaName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnSchemaTagsEntryPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}