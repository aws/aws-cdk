/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates and persists a DataIntegration resource.
 *
 * @cloudformationResource AWS::AppIntegrations::DataIntegration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html
 */
export class CfnDataIntegration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppIntegrations::DataIntegration";

  /**
   * Build a CfnDataIntegration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataIntegration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDataIntegrationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDataIntegration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) for the DataIntegration.
   *
   * @cloudformationAttribute DataIntegrationArn
   */
  public readonly attrDataIntegrationArn: string;

  /**
   * A unique identifier.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A description of the DataIntegration.
   */
  public description?: string;

  /**
   * The configuration for what files should be pulled from the source.
   */
  public fileConfiguration?: CfnDataIntegration.FileConfigurationProperty | cdk.IResolvable;

  /**
   * The KMS key for the DataIntegration.
   */
  public kmsKey: string;

  /**
   * The name of the DataIntegration.
   */
  public name: string;

  /**
   * The configuration for what data should be pulled from the source.
   */
  public objectConfiguration?: any | cdk.IResolvable;

  /**
   * The name of the data and how often it should be pulled from the source.
   */
  public scheduleConfig?: cdk.IResolvable | CfnDataIntegration.ScheduleConfigProperty;

  /**
   * The URI of the data source.
   */
  public sourceUri: string;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnDataIntegrationProps) {
    super(scope, id, {
      "type": CfnDataIntegration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "kmsKey", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "sourceUri", this);

    this.attrDataIntegrationArn = cdk.Token.asString(this.getAtt("DataIntegrationArn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.fileConfiguration = props.fileConfiguration;
    this.kmsKey = props.kmsKey;
    this.name = props.name;
    this.objectConfiguration = props.objectConfiguration;
    this.scheduleConfig = props.scheduleConfig;
    this.sourceUri = props.sourceUri;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppIntegrations::DataIntegration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "fileConfiguration": this.fileConfiguration,
      "kmsKey": this.kmsKey,
      "name": this.name,
      "objectConfiguration": this.objectConfiguration,
      "scheduleConfig": this.scheduleConfig,
      "sourceUri": this.sourceUri,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataIntegration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDataIntegrationPropsToCloudFormation(props);
  }
}

export namespace CfnDataIntegration {
  /**
   * The name of the data and how often it should be pulled from the source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-dataintegration-scheduleconfig.html
   */
  export interface ScheduleConfigProperty {
    /**
     * The start date for objects to import in the first flow run as an Unix/epoch timestamp in milliseconds or in ISO-8601 format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-dataintegration-scheduleconfig.html#cfn-appintegrations-dataintegration-scheduleconfig-firstexecutionfrom
     */
    readonly firstExecutionFrom?: string;

    /**
     * The name of the object to pull from the data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-dataintegration-scheduleconfig.html#cfn-appintegrations-dataintegration-scheduleconfig-object
     */
    readonly object?: string;

    /**
     * How often the data should be pulled from data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-dataintegration-scheduleconfig.html#cfn-appintegrations-dataintegration-scheduleconfig-scheduleexpression
     */
    readonly scheduleExpression: string;
  }

  /**
   * The configuration for what files should be pulled from the source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-dataintegration-fileconfiguration.html
   */
  export interface FileConfigurationProperty {
    /**
     * Restrictions for what files should be pulled from the source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-dataintegration-fileconfiguration.html#cfn-appintegrations-dataintegration-fileconfiguration-filters
     */
    readonly filters?: any | cdk.IResolvable;

    /**
     * Identifiers for the source folders to pull all files from recursively.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-dataintegration-fileconfiguration.html#cfn-appintegrations-dataintegration-fileconfiguration-folders
     */
    readonly folders: Array<string>;
  }
}

/**
 * Properties for defining a `CfnDataIntegration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html
 */
export interface CfnDataIntegrationProps {
  /**
   * A description of the DataIntegration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-description
   */
  readonly description?: string;

  /**
   * The configuration for what files should be pulled from the source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-fileconfiguration
   */
  readonly fileConfiguration?: CfnDataIntegration.FileConfigurationProperty | cdk.IResolvable;

  /**
   * The KMS key for the DataIntegration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-kmskey
   */
  readonly kmsKey: string;

  /**
   * The name of the DataIntegration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-name
   */
  readonly name: string;

  /**
   * The configuration for what data should be pulled from the source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-objectconfiguration
   */
  readonly objectConfiguration?: any | cdk.IResolvable;

  /**
   * The name of the data and how often it should be pulled from the source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-scheduleconfig
   */
  readonly scheduleConfig?: cdk.IResolvable | CfnDataIntegration.ScheduleConfigProperty;

  /**
   * The URI of the data source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-sourceuri
   */
  readonly sourceUri: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-dataintegration.html#cfn-appintegrations-dataintegration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ScheduleConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataIntegrationScheduleConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("firstExecutionFrom", cdk.validateString)(properties.firstExecutionFrom));
  errors.collect(cdk.propertyValidator("object", cdk.validateString)(properties.object));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.requiredValidator)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.validateString)(properties.scheduleExpression));
  return errors.wrap("supplied properties not correct for \"ScheduleConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataIntegrationScheduleConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataIntegrationScheduleConfigPropertyValidator(properties).assertSuccess();
  return {
    "FirstExecutionFrom": cdk.stringToCloudFormation(properties.firstExecutionFrom),
    "Object": cdk.stringToCloudFormation(properties.object),
    "ScheduleExpression": cdk.stringToCloudFormation(properties.scheduleExpression)
  };
}

// @ts-ignore TS6133
function CfnDataIntegrationScheduleConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataIntegration.ScheduleConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataIntegration.ScheduleConfigProperty>();
  ret.addPropertyResult("firstExecutionFrom", "FirstExecutionFrom", (properties.FirstExecutionFrom != null ? cfn_parse.FromCloudFormation.getString(properties.FirstExecutionFrom) : undefined));
  ret.addPropertyResult("object", "Object", (properties.Object != null ? cfn_parse.FromCloudFormation.getString(properties.Object) : undefined));
  ret.addPropertyResult("scheduleExpression", "ScheduleExpression", (properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FileConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FileConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataIntegrationFileConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filters", cdk.validateObject)(properties.filters));
  errors.collect(cdk.propertyValidator("folders", cdk.requiredValidator)(properties.folders));
  errors.collect(cdk.propertyValidator("folders", cdk.listValidator(cdk.validateString))(properties.folders));
  return errors.wrap("supplied properties not correct for \"FileConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataIntegrationFileConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataIntegrationFileConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Filters": cdk.objectToCloudFormation(properties.filters),
    "Folders": cdk.listMapper(cdk.stringToCloudFormation)(properties.folders)
  };
}

// @ts-ignore TS6133
function CfnDataIntegrationFileConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataIntegration.FileConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataIntegration.FileConfigurationProperty>();
  ret.addPropertyResult("filters", "Filters", (properties.Filters != null ? cfn_parse.FromCloudFormation.getAny(properties.Filters) : undefined));
  ret.addPropertyResult("folders", "Folders", (properties.Folders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Folders) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDataIntegrationProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataIntegrationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataIntegrationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("fileConfiguration", CfnDataIntegrationFileConfigurationPropertyValidator)(properties.fileConfiguration));
  errors.collect(cdk.propertyValidator("kmsKey", cdk.requiredValidator)(properties.kmsKey));
  errors.collect(cdk.propertyValidator("kmsKey", cdk.validateString)(properties.kmsKey));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("objectConfiguration", cdk.validateObject)(properties.objectConfiguration));
  errors.collect(cdk.propertyValidator("scheduleConfig", CfnDataIntegrationScheduleConfigPropertyValidator)(properties.scheduleConfig));
  errors.collect(cdk.propertyValidator("sourceUri", cdk.requiredValidator)(properties.sourceUri));
  errors.collect(cdk.propertyValidator("sourceUri", cdk.validateString)(properties.sourceUri));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDataIntegrationProps\"");
}

// @ts-ignore TS6133
function convertCfnDataIntegrationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataIntegrationPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "FileConfiguration": convertCfnDataIntegrationFileConfigurationPropertyToCloudFormation(properties.fileConfiguration),
    "KmsKey": cdk.stringToCloudFormation(properties.kmsKey),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ObjectConfiguration": cdk.objectToCloudFormation(properties.objectConfiguration),
    "ScheduleConfig": convertCfnDataIntegrationScheduleConfigPropertyToCloudFormation(properties.scheduleConfig),
    "SourceURI": cdk.stringToCloudFormation(properties.sourceUri),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDataIntegrationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataIntegrationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataIntegrationProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("fileConfiguration", "FileConfiguration", (properties.FileConfiguration != null ? CfnDataIntegrationFileConfigurationPropertyFromCloudFormation(properties.FileConfiguration) : undefined));
  ret.addPropertyResult("kmsKey", "KmsKey", (properties.KmsKey != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKey) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("objectConfiguration", "ObjectConfiguration", (properties.ObjectConfiguration != null ? cfn_parse.FromCloudFormation.getAny(properties.ObjectConfiguration) : undefined));
  ret.addPropertyResult("scheduleConfig", "ScheduleConfig", (properties.ScheduleConfig != null ? CfnDataIntegrationScheduleConfigPropertyFromCloudFormation(properties.ScheduleConfig) : undefined));
  ret.addPropertyResult("sourceUri", "SourceURI", (properties.SourceURI != null ? cfn_parse.FromCloudFormation.getString(properties.SourceURI) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an event integration.
 *
 * You provide a name, description, and a reference to an Amazon EventBridge bus in your account and a partner event source that will push events to that bus. No objects are created in your account, only metadata that is persisted on the EventIntegration control plane.
 *
 * @cloudformationResource AWS::AppIntegrations::EventIntegration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html
 */
export class CfnEventIntegration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::AppIntegrations::EventIntegration";

  /**
   * Build a CfnEventIntegration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEventIntegration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEventIntegrationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEventIntegration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the event integration.
   *
   * @cloudformationAttribute EventIntegrationArn
   */
  public readonly attrEventIntegrationArn: string;

  /**
   * The event integration description.
   */
  public description?: string;

  /**
   * The Amazon EventBridge bus for the event integration.
   */
  public eventBridgeBus: string;

  /**
   * The event integration filter.
   */
  public eventFilter: CfnEventIntegration.EventFilterProperty | cdk.IResolvable;

  /**
   * The name of the event integration.
   */
  public name: string;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnEventIntegrationProps) {
    super(scope, id, {
      "type": CfnEventIntegration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "eventBridgeBus", this);
    cdk.requireProperty(props, "eventFilter", this);
    cdk.requireProperty(props, "name", this);

    this.attrEventIntegrationArn = cdk.Token.asString(this.getAtt("EventIntegrationArn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.eventBridgeBus = props.eventBridgeBus;
    this.eventFilter = props.eventFilter;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::AppIntegrations::EventIntegration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "eventBridgeBus": this.eventBridgeBus,
      "eventFilter": this.eventFilter,
      "name": this.name,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEventIntegration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEventIntegrationPropsToCloudFormation(props);
  }
}

export namespace CfnEventIntegration {
  /**
   * The event integration filter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-eventintegration-eventfilter.html
   */
  export interface EventFilterProperty {
    /**
     * The source of the events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appintegrations-eventintegration-eventfilter.html#cfn-appintegrations-eventintegration-eventfilter-source
     */
    readonly source: string;
  }
}

/**
 * Properties for defining a `CfnEventIntegration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html
 */
export interface CfnEventIntegrationProps {
  /**
   * The event integration description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-description
   */
  readonly description?: string;

  /**
   * The Amazon EventBridge bus for the event integration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-eventbridgebus
   */
  readonly eventBridgeBus: string;

  /**
   * The event integration filter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-eventfilter
   */
  readonly eventFilter: CfnEventIntegration.EventFilterProperty | cdk.IResolvable;

  /**
   * The name of the event integration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-name
   */
  readonly name: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appintegrations-eventintegration.html#cfn-appintegrations-eventintegration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `EventFilterProperty`
 *
 * @param properties - the TypeScript properties of a `EventFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventIntegrationEventFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("source", cdk.requiredValidator)(properties.source));
  errors.collect(cdk.propertyValidator("source", cdk.validateString)(properties.source));
  return errors.wrap("supplied properties not correct for \"EventFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnEventIntegrationEventFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventIntegrationEventFilterPropertyValidator(properties).assertSuccess();
  return {
    "Source": cdk.stringToCloudFormation(properties.source)
  };
}

// @ts-ignore TS6133
function CfnEventIntegrationEventFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventIntegration.EventFilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventIntegration.EventFilterProperty>();
  ret.addPropertyResult("source", "Source", (properties.Source != null ? cfn_parse.FromCloudFormation.getString(properties.Source) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEventIntegrationProps`
 *
 * @param properties - the TypeScript properties of a `CfnEventIntegrationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEventIntegrationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("eventBridgeBus", cdk.requiredValidator)(properties.eventBridgeBus));
  errors.collect(cdk.propertyValidator("eventBridgeBus", cdk.validateString)(properties.eventBridgeBus));
  errors.collect(cdk.propertyValidator("eventFilter", cdk.requiredValidator)(properties.eventFilter));
  errors.collect(cdk.propertyValidator("eventFilter", CfnEventIntegrationEventFilterPropertyValidator)(properties.eventFilter));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnEventIntegrationProps\"");
}

// @ts-ignore TS6133
function convertCfnEventIntegrationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEventIntegrationPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "EventBridgeBus": cdk.stringToCloudFormation(properties.eventBridgeBus),
    "EventFilter": convertCfnEventIntegrationEventFilterPropertyToCloudFormation(properties.eventFilter),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnEventIntegrationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEventIntegrationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEventIntegrationProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("eventBridgeBus", "EventBridgeBus", (properties.EventBridgeBus != null ? cfn_parse.FromCloudFormation.getString(properties.EventBridgeBus) : undefined));
  ret.addPropertyResult("eventFilter", "EventFilter", (properties.EventFilter != null ? CfnEventIntegrationEventFilterPropertyFromCloudFormation(properties.EventFilter) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}