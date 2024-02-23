/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates an annotation store.
 *
 * @cloudformationResource AWS::Omics::AnnotationStore
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-annotationstore.html
 */
export class CfnAnnotationStore extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Omics::AnnotationStore";

  /**
   * Build a CfnAnnotationStore from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAnnotationStore {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAnnotationStorePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAnnotationStore(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * When the store was created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The store's ID.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The store's status.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The store's status message.
   *
   * @cloudformationAttribute StatusMessage
   */
  public readonly attrStatusMessage: string;

  /**
   * The store's ARN.
   *
   * @cloudformationAttribute StoreArn
   */
  public readonly attrStoreArn: string;

  /**
   * The store's size in bytes.
   *
   * @cloudformationAttribute StoreSizeBytes
   */
  public readonly attrStoreSizeBytes: cdk.IResolvable;

  /**
   * When the store was updated.
   *
   * @cloudformationAttribute UpdateTime
   */
  public readonly attrUpdateTime: string;

  /**
   * A description for the store.
   */
  public description?: string;

  /**
   * The name of the Annotation Store.
   */
  public name: string;

  /**
   * The genome reference for the store's annotations.
   */
  public reference?: cdk.IResolvable | CfnAnnotationStore.ReferenceItemProperty;

  /**
   * The store's server-side encryption (SSE) settings.
   */
  public sseConfig?: cdk.IResolvable | CfnAnnotationStore.SseConfigProperty;

  /**
   * The annotation file format of the store.
   */
  public storeFormat: string;

  /**
   * File parsing options for the annotation store.
   */
  public storeOptions?: cdk.IResolvable | CfnAnnotationStore.StoreOptionsProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags for the store.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAnnotationStoreProps) {
    super(scope, id, {
      "type": CfnAnnotationStore.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "storeFormat", this);

    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attrStatusMessage = cdk.Token.asString(this.getAtt("StatusMessage", cdk.ResolutionTypeHint.STRING));
    this.attrStoreArn = cdk.Token.asString(this.getAtt("StoreArn", cdk.ResolutionTypeHint.STRING));
    this.attrStoreSizeBytes = this.getAtt("StoreSizeBytes", cdk.ResolutionTypeHint.NUMBER);
    this.attrUpdateTime = cdk.Token.asString(this.getAtt("UpdateTime", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.reference = props.reference;
    this.sseConfig = props.sseConfig;
    this.storeFormat = props.storeFormat;
    this.storeOptions = props.storeOptions;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Omics::AnnotationStore", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "reference": this.reference,
      "sseConfig": this.sseConfig,
      "storeFormat": this.storeFormat,
      "storeOptions": this.storeOptions,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAnnotationStore.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAnnotationStorePropsToCloudFormation(props);
  }
}

export namespace CfnAnnotationStore {
  /**
   * A genome reference.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-annotationstore-referenceitem.html
   */
  export interface ReferenceItemProperty {
    /**
     * The reference's ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-annotationstore-referenceitem.html#cfn-omics-annotationstore-referenceitem-referencearn
     */
    readonly referenceArn: string;
  }

  /**
   * Server-side encryption (SSE) settings for a store.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-annotationstore-sseconfig.html
   */
  export interface SseConfigProperty {
    /**
     * An encryption key ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-annotationstore-sseconfig.html#cfn-omics-annotationstore-sseconfig-keyarn
     */
    readonly keyArn?: string;

    /**
     * The encryption type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-annotationstore-sseconfig.html#cfn-omics-annotationstore-sseconfig-type
     */
    readonly type: string;
  }

  /**
   * The store's file parsing options.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-annotationstore-storeoptions.html
   */
  export interface StoreOptionsProperty {
    /**
     * Formatting options for a TSV file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-annotationstore-storeoptions.html#cfn-omics-annotationstore-storeoptions-tsvstoreoptions
     */
    readonly tsvStoreOptions: cdk.IResolvable | CfnAnnotationStore.TsvStoreOptionsProperty;
  }

  /**
   * The store's parsing options.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-annotationstore-tsvstoreoptions.html
   */
  export interface TsvStoreOptionsProperty {
    /**
     * The store's annotation type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-annotationstore-tsvstoreoptions.html#cfn-omics-annotationstore-tsvstoreoptions-annotationtype
     */
    readonly annotationType?: string;

    /**
     * The store's header key to column name mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-annotationstore-tsvstoreoptions.html#cfn-omics-annotationstore-tsvstoreoptions-formattoheader
     */
    readonly formatToHeader?: cdk.IResolvable | Record<string, string>;

    /**
     * The schema of an annotation store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-annotationstore-tsvstoreoptions.html#cfn-omics-annotationstore-tsvstoreoptions-schema
     */
    readonly schema?: any | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnAnnotationStore`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-annotationstore.html
 */
export interface CfnAnnotationStoreProps {
  /**
   * A description for the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-annotationstore.html#cfn-omics-annotationstore-description
   */
  readonly description?: string;

  /**
   * The name of the Annotation Store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-annotationstore.html#cfn-omics-annotationstore-name
   */
  readonly name: string;

  /**
   * The genome reference for the store's annotations.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-annotationstore.html#cfn-omics-annotationstore-reference
   */
  readonly reference?: cdk.IResolvable | CfnAnnotationStore.ReferenceItemProperty;

  /**
   * The store's server-side encryption (SSE) settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-annotationstore.html#cfn-omics-annotationstore-sseconfig
   */
  readonly sseConfig?: cdk.IResolvable | CfnAnnotationStore.SseConfigProperty;

  /**
   * The annotation file format of the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-annotationstore.html#cfn-omics-annotationstore-storeformat
   */
  readonly storeFormat: string;

  /**
   * File parsing options for the annotation store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-annotationstore.html#cfn-omics-annotationstore-storeoptions
   */
  readonly storeOptions?: cdk.IResolvable | CfnAnnotationStore.StoreOptionsProperty;

  /**
   * Tags for the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-annotationstore.html#cfn-omics-annotationstore-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `ReferenceItemProperty`
 *
 * @param properties - the TypeScript properties of a `ReferenceItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnnotationStoreReferenceItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("referenceArn", cdk.requiredValidator)(properties.referenceArn));
  errors.collect(cdk.propertyValidator("referenceArn", cdk.validateString)(properties.referenceArn));
  return errors.wrap("supplied properties not correct for \"ReferenceItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnnotationStoreReferenceItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnnotationStoreReferenceItemPropertyValidator(properties).assertSuccess();
  return {
    "ReferenceArn": cdk.stringToCloudFormation(properties.referenceArn)
  };
}

// @ts-ignore TS6133
function CfnAnnotationStoreReferenceItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnnotationStore.ReferenceItemProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnnotationStore.ReferenceItemProperty>();
  ret.addPropertyResult("referenceArn", "ReferenceArn", (properties.ReferenceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ReferenceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SseConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SseConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnnotationStoreSseConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyArn", cdk.validateString)(properties.keyArn));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"SseConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnnotationStoreSseConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnnotationStoreSseConfigPropertyValidator(properties).assertSuccess();
  return {
    "KeyArn": cdk.stringToCloudFormation(properties.keyArn),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAnnotationStoreSseConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnnotationStore.SseConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnnotationStore.SseConfigProperty>();
  ret.addPropertyResult("keyArn", "KeyArn", (properties.KeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KeyArn) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TsvStoreOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `TsvStoreOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnnotationStoreTsvStoreOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("annotationType", cdk.validateString)(properties.annotationType));
  errors.collect(cdk.propertyValidator("formatToHeader", cdk.hashValidator(cdk.validateString))(properties.formatToHeader));
  errors.collect(cdk.propertyValidator("schema", cdk.validateObject)(properties.schema));
  return errors.wrap("supplied properties not correct for \"TsvStoreOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnnotationStoreTsvStoreOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnnotationStoreTsvStoreOptionsPropertyValidator(properties).assertSuccess();
  return {
    "AnnotationType": cdk.stringToCloudFormation(properties.annotationType),
    "FormatToHeader": cdk.hashMapper(cdk.stringToCloudFormation)(properties.formatToHeader),
    "Schema": cdk.objectToCloudFormation(properties.schema)
  };
}

// @ts-ignore TS6133
function CfnAnnotationStoreTsvStoreOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnnotationStore.TsvStoreOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnnotationStore.TsvStoreOptionsProperty>();
  ret.addPropertyResult("annotationType", "AnnotationType", (properties.AnnotationType != null ? cfn_parse.FromCloudFormation.getString(properties.AnnotationType) : undefined));
  ret.addPropertyResult("formatToHeader", "FormatToHeader", (properties.FormatToHeader != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.FormatToHeader) : undefined));
  ret.addPropertyResult("schema", "Schema", (properties.Schema != null ? cfn_parse.FromCloudFormation.getAny(properties.Schema) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StoreOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `StoreOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnnotationStoreStoreOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("tsvStoreOptions", cdk.requiredValidator)(properties.tsvStoreOptions));
  errors.collect(cdk.propertyValidator("tsvStoreOptions", CfnAnnotationStoreTsvStoreOptionsPropertyValidator)(properties.tsvStoreOptions));
  return errors.wrap("supplied properties not correct for \"StoreOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnnotationStoreStoreOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnnotationStoreStoreOptionsPropertyValidator(properties).assertSuccess();
  return {
    "TsvStoreOptions": convertCfnAnnotationStoreTsvStoreOptionsPropertyToCloudFormation(properties.tsvStoreOptions)
  };
}

// @ts-ignore TS6133
function CfnAnnotationStoreStoreOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnnotationStore.StoreOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnnotationStore.StoreOptionsProperty>();
  ret.addPropertyResult("tsvStoreOptions", "TsvStoreOptions", (properties.TsvStoreOptions != null ? CfnAnnotationStoreTsvStoreOptionsPropertyFromCloudFormation(properties.TsvStoreOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAnnotationStoreProps`
 *
 * @param properties - the TypeScript properties of a `CfnAnnotationStoreProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnnotationStorePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("reference", CfnAnnotationStoreReferenceItemPropertyValidator)(properties.reference));
  errors.collect(cdk.propertyValidator("sseConfig", CfnAnnotationStoreSseConfigPropertyValidator)(properties.sseConfig));
  errors.collect(cdk.propertyValidator("storeFormat", cdk.requiredValidator)(properties.storeFormat));
  errors.collect(cdk.propertyValidator("storeFormat", cdk.validateString)(properties.storeFormat));
  errors.collect(cdk.propertyValidator("storeOptions", CfnAnnotationStoreStoreOptionsPropertyValidator)(properties.storeOptions));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAnnotationStoreProps\"");
}

// @ts-ignore TS6133
function convertCfnAnnotationStorePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnnotationStorePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Reference": convertCfnAnnotationStoreReferenceItemPropertyToCloudFormation(properties.reference),
    "SseConfig": convertCfnAnnotationStoreSseConfigPropertyToCloudFormation(properties.sseConfig),
    "StoreFormat": cdk.stringToCloudFormation(properties.storeFormat),
    "StoreOptions": convertCfnAnnotationStoreStoreOptionsPropertyToCloudFormation(properties.storeOptions),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAnnotationStorePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnnotationStoreProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnnotationStoreProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("reference", "Reference", (properties.Reference != null ? CfnAnnotationStoreReferenceItemPropertyFromCloudFormation(properties.Reference) : undefined));
  ret.addPropertyResult("sseConfig", "SseConfig", (properties.SseConfig != null ? CfnAnnotationStoreSseConfigPropertyFromCloudFormation(properties.SseConfig) : undefined));
  ret.addPropertyResult("storeFormat", "StoreFormat", (properties.StoreFormat != null ? cfn_parse.FromCloudFormation.getString(properties.StoreFormat) : undefined));
  ret.addPropertyResult("storeOptions", "StoreOptions", (properties.StoreOptions != null ? CfnAnnotationStoreStoreOptionsPropertyFromCloudFormation(properties.StoreOptions) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a reference store.
 *
 * @cloudformationResource AWS::Omics::ReferenceStore
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-referencestore.html
 */
export class CfnReferenceStore extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Omics::ReferenceStore";

  /**
   * Build a CfnReferenceStore from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReferenceStore {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnReferenceStorePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnReferenceStore(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The store's ARN.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * When the store was created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The store's ID.
   *
   * @cloudformationAttribute ReferenceStoreId
   */
  public readonly attrReferenceStoreId: string;

  /**
   * A description for the store.
   */
  public description?: string;

  /**
   * A name for the store.
   */
  public name: string;

  /**
   * Server-side encryption (SSE) settings for the store.
   */
  public sseConfig?: cdk.IResolvable | CfnReferenceStore.SseConfigProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags for the store.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnReferenceStoreProps) {
    super(scope, id, {
      "type": CfnReferenceStore.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrReferenceStoreId = cdk.Token.asString(this.getAtt("ReferenceStoreId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.sseConfig = props.sseConfig;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Omics::ReferenceStore", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "sseConfig": this.sseConfig,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnReferenceStore.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnReferenceStorePropsToCloudFormation(props);
  }
}

export namespace CfnReferenceStore {
  /**
   * Server-side encryption (SSE) settings for a store.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-referencestore-sseconfig.html
   */
  export interface SseConfigProperty {
    /**
     * An encryption key ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-referencestore-sseconfig.html#cfn-omics-referencestore-sseconfig-keyarn
     */
    readonly keyArn?: string;

    /**
     * The encryption type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-referencestore-sseconfig.html#cfn-omics-referencestore-sseconfig-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnReferenceStore`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-referencestore.html
 */
export interface CfnReferenceStoreProps {
  /**
   * A description for the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-referencestore.html#cfn-omics-referencestore-description
   */
  readonly description?: string;

  /**
   * A name for the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-referencestore.html#cfn-omics-referencestore-name
   */
  readonly name: string;

  /**
   * Server-side encryption (SSE) settings for the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-referencestore.html#cfn-omics-referencestore-sseconfig
   */
  readonly sseConfig?: cdk.IResolvable | CfnReferenceStore.SseConfigProperty;

  /**
   * Tags for the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-referencestore.html#cfn-omics-referencestore-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `SseConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SseConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReferenceStoreSseConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyArn", cdk.validateString)(properties.keyArn));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"SseConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnReferenceStoreSseConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReferenceStoreSseConfigPropertyValidator(properties).assertSuccess();
  return {
    "KeyArn": cdk.stringToCloudFormation(properties.keyArn),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnReferenceStoreSseConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReferenceStore.SseConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReferenceStore.SseConfigProperty>();
  ret.addPropertyResult("keyArn", "KeyArn", (properties.KeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KeyArn) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnReferenceStoreProps`
 *
 * @param properties - the TypeScript properties of a `CfnReferenceStoreProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReferenceStorePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("sseConfig", CfnReferenceStoreSseConfigPropertyValidator)(properties.sseConfig));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnReferenceStoreProps\"");
}

// @ts-ignore TS6133
function convertCfnReferenceStorePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReferenceStorePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SseConfig": convertCfnReferenceStoreSseConfigPropertyToCloudFormation(properties.sseConfig),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnReferenceStorePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReferenceStoreProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReferenceStoreProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("sseConfig", "SseConfig", (properties.SseConfig != null ? CfnReferenceStoreSseConfigPropertyFromCloudFormation(properties.SseConfig) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a run group.
 *
 * @cloudformationResource AWS::Omics::RunGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-rungroup.html
 */
export class CfnRunGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Omics::RunGroup";

  /**
   * Build a CfnRunGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRunGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRunGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRunGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The run group's ARN.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * When the run group was created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The run group's ID.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The group's maximum CPU count setting.
   */
  public maxCpus?: number;

  /**
   * The group's maximum duration setting in minutes.
   */
  public maxDuration?: number;

  /**
   * The maximum GPUs that can be used by a run group.
   */
  public maxGpus?: number;

  /**
   * The group's maximum concurrent run setting.
   */
  public maxRuns?: number;

  /**
   * The group's name.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags for the group.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRunGroupProps = {}) {
    super(scope, id, {
      "type": CfnRunGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.maxCpus = props.maxCpus;
    this.maxDuration = props.maxDuration;
    this.maxGpus = props.maxGpus;
    this.maxRuns = props.maxRuns;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Omics::RunGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "maxCpus": this.maxCpus,
      "maxDuration": this.maxDuration,
      "maxGpus": this.maxGpus,
      "maxRuns": this.maxRuns,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRunGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRunGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnRunGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-rungroup.html
 */
export interface CfnRunGroupProps {
  /**
   * The group's maximum CPU count setting.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-rungroup.html#cfn-omics-rungroup-maxcpus
   */
  readonly maxCpus?: number;

  /**
   * The group's maximum duration setting in minutes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-rungroup.html#cfn-omics-rungroup-maxduration
   */
  readonly maxDuration?: number;

  /**
   * The maximum GPUs that can be used by a run group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-rungroup.html#cfn-omics-rungroup-maxgpus
   */
  readonly maxGpus?: number;

  /**
   * The group's maximum concurrent run setting.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-rungroup.html#cfn-omics-rungroup-maxruns
   */
  readonly maxRuns?: number;

  /**
   * The group's name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-rungroup.html#cfn-omics-rungroup-name
   */
  readonly name?: string;

  /**
   * Tags for the group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-rungroup.html#cfn-omics-rungroup-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `CfnRunGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnRunGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRunGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxCpus", cdk.validateNumber)(properties.maxCpus));
  errors.collect(cdk.propertyValidator("maxDuration", cdk.validateNumber)(properties.maxDuration));
  errors.collect(cdk.propertyValidator("maxGpus", cdk.validateNumber)(properties.maxGpus));
  errors.collect(cdk.propertyValidator("maxRuns", cdk.validateNumber)(properties.maxRuns));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRunGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnRunGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRunGroupPropsValidator(properties).assertSuccess();
  return {
    "MaxCpus": cdk.numberToCloudFormation(properties.maxCpus),
    "MaxDuration": cdk.numberToCloudFormation(properties.maxDuration),
    "MaxGpus": cdk.numberToCloudFormation(properties.maxGpus),
    "MaxRuns": cdk.numberToCloudFormation(properties.maxRuns),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRunGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRunGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRunGroupProps>();
  ret.addPropertyResult("maxCpus", "MaxCpus", (properties.MaxCpus != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCpus) : undefined));
  ret.addPropertyResult("maxDuration", "MaxDuration", (properties.MaxDuration != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxDuration) : undefined));
  ret.addPropertyResult("maxGpus", "MaxGpus", (properties.MaxGpus != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxGpus) : undefined));
  ret.addPropertyResult("maxRuns", "MaxRuns", (properties.MaxRuns != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxRuns) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a sequence store.
 *
 * @cloudformationResource AWS::Omics::SequenceStore
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-sequencestore.html
 */
export class CfnSequenceStore extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Omics::SequenceStore";

  /**
   * Build a CfnSequenceStore from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSequenceStore {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSequenceStorePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSequenceStore(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The store's ARN.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * When the store was created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The store's ID.
   *
   * @cloudformationAttribute SequenceStoreId
   */
  public readonly attrSequenceStoreId: string;

  /**
   * A description for the store.
   */
  public description?: string;

  /**
   * An S3 location that is used to store files that have failed a direct upload.
   */
  public fallbackLocation?: string;

  /**
   * A name for the store.
   */
  public name: string;

  /**
   * Server-side encryption (SSE) settings for the store.
   */
  public sseConfig?: cdk.IResolvable | CfnSequenceStore.SseConfigProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags for the store.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSequenceStoreProps) {
    super(scope, id, {
      "type": CfnSequenceStore.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrSequenceStoreId = cdk.Token.asString(this.getAtt("SequenceStoreId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.fallbackLocation = props.fallbackLocation;
    this.name = props.name;
    this.sseConfig = props.sseConfig;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Omics::SequenceStore", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "fallbackLocation": this.fallbackLocation,
      "name": this.name,
      "sseConfig": this.sseConfig,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSequenceStore.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSequenceStorePropsToCloudFormation(props);
  }
}

export namespace CfnSequenceStore {
  /**
   * Server-side encryption (SSE) settings for a store.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-sequencestore-sseconfig.html
   */
  export interface SseConfigProperty {
    /**
     * An encryption key ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-sequencestore-sseconfig.html#cfn-omics-sequencestore-sseconfig-keyarn
     */
    readonly keyArn?: string;

    /**
     * The encryption type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-sequencestore-sseconfig.html#cfn-omics-sequencestore-sseconfig-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnSequenceStore`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-sequencestore.html
 */
export interface CfnSequenceStoreProps {
  /**
   * A description for the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-sequencestore.html#cfn-omics-sequencestore-description
   */
  readonly description?: string;

  /**
   * An S3 location that is used to store files that have failed a direct upload.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-sequencestore.html#cfn-omics-sequencestore-fallbacklocation
   */
  readonly fallbackLocation?: string;

  /**
   * A name for the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-sequencestore.html#cfn-omics-sequencestore-name
   */
  readonly name: string;

  /**
   * Server-side encryption (SSE) settings for the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-sequencestore.html#cfn-omics-sequencestore-sseconfig
   */
  readonly sseConfig?: cdk.IResolvable | CfnSequenceStore.SseConfigProperty;

  /**
   * Tags for the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-sequencestore.html#cfn-omics-sequencestore-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `SseConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SseConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSequenceStoreSseConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyArn", cdk.validateString)(properties.keyArn));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"SseConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnSequenceStoreSseConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSequenceStoreSseConfigPropertyValidator(properties).assertSuccess();
  return {
    "KeyArn": cdk.stringToCloudFormation(properties.keyArn),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnSequenceStoreSseConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSequenceStore.SseConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSequenceStore.SseConfigProperty>();
  ret.addPropertyResult("keyArn", "KeyArn", (properties.KeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KeyArn) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSequenceStoreProps`
 *
 * @param properties - the TypeScript properties of a `CfnSequenceStoreProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSequenceStorePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("fallbackLocation", cdk.validateString)(properties.fallbackLocation));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("sseConfig", CfnSequenceStoreSseConfigPropertyValidator)(properties.sseConfig));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSequenceStoreProps\"");
}

// @ts-ignore TS6133
function convertCfnSequenceStorePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSequenceStorePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "FallbackLocation": cdk.stringToCloudFormation(properties.fallbackLocation),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SseConfig": convertCfnSequenceStoreSseConfigPropertyToCloudFormation(properties.sseConfig),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSequenceStorePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSequenceStoreProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSequenceStoreProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("fallbackLocation", "FallbackLocation", (properties.FallbackLocation != null ? cfn_parse.FromCloudFormation.getString(properties.FallbackLocation) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("sseConfig", "SseConfig", (properties.SseConfig != null ? CfnSequenceStoreSseConfigPropertyFromCloudFormation(properties.SseConfig) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Create a store for variant data.
 *
 * @cloudformationResource AWS::Omics::VariantStore
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-variantstore.html
 */
export class CfnVariantStore extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Omics::VariantStore";

  /**
   * Build a CfnVariantStore from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVariantStore {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVariantStorePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVariantStore(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * When the store was created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The store's ID.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The store's status.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The store's status message.
   *
   * @cloudformationAttribute StatusMessage
   */
  public readonly attrStatusMessage: string;

  /**
   * The store's ARN.
   *
   * @cloudformationAttribute StoreArn
   */
  public readonly attrStoreArn: string;

  /**
   * The store's size in bytes.
   *
   * @cloudformationAttribute StoreSizeBytes
   */
  public readonly attrStoreSizeBytes: cdk.IResolvable;

  /**
   * When the store was updated.
   *
   * @cloudformationAttribute UpdateTime
   */
  public readonly attrUpdateTime: string;

  /**
   * A description for the store.
   */
  public description?: string;

  /**
   * A name for the store.
   */
  public name: string;

  /**
   * The genome reference for the store's variants.
   */
  public reference: cdk.IResolvable | CfnVariantStore.ReferenceItemProperty;

  /**
   * Server-side encryption (SSE) settings for the store.
   */
  public sseConfig?: cdk.IResolvable | CfnVariantStore.SseConfigProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags for the store.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVariantStoreProps) {
    super(scope, id, {
      "type": CfnVariantStore.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "reference", this);

    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attrStatusMessage = cdk.Token.asString(this.getAtt("StatusMessage", cdk.ResolutionTypeHint.STRING));
    this.attrStoreArn = cdk.Token.asString(this.getAtt("StoreArn", cdk.ResolutionTypeHint.STRING));
    this.attrStoreSizeBytes = this.getAtt("StoreSizeBytes", cdk.ResolutionTypeHint.NUMBER);
    this.attrUpdateTime = cdk.Token.asString(this.getAtt("UpdateTime", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.reference = props.reference;
    this.sseConfig = props.sseConfig;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Omics::VariantStore", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "reference": this.reference,
      "sseConfig": this.sseConfig,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVariantStore.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVariantStorePropsToCloudFormation(props);
  }
}

export namespace CfnVariantStore {
  /**
   * The read set's genome reference ARN.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-variantstore-referenceitem.html
   */
  export interface ReferenceItemProperty {
    /**
     * The reference's ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-variantstore-referenceitem.html#cfn-omics-variantstore-referenceitem-referencearn
     */
    readonly referenceArn: string;
  }

  /**
   * Server-side encryption (SSE) settings for a store.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-variantstore-sseconfig.html
   */
  export interface SseConfigProperty {
    /**
     * An encryption key ARN.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-variantstore-sseconfig.html#cfn-omics-variantstore-sseconfig-keyarn
     */
    readonly keyArn?: string;

    /**
     * The encryption type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-variantstore-sseconfig.html#cfn-omics-variantstore-sseconfig-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnVariantStore`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-variantstore.html
 */
export interface CfnVariantStoreProps {
  /**
   * A description for the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-variantstore.html#cfn-omics-variantstore-description
   */
  readonly description?: string;

  /**
   * A name for the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-variantstore.html#cfn-omics-variantstore-name
   */
  readonly name: string;

  /**
   * The genome reference for the store's variants.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-variantstore.html#cfn-omics-variantstore-reference
   */
  readonly reference: cdk.IResolvable | CfnVariantStore.ReferenceItemProperty;

  /**
   * Server-side encryption (SSE) settings for the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-variantstore.html#cfn-omics-variantstore-sseconfig
   */
  readonly sseConfig?: cdk.IResolvable | CfnVariantStore.SseConfigProperty;

  /**
   * Tags for the store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-variantstore.html#cfn-omics-variantstore-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `ReferenceItemProperty`
 *
 * @param properties - the TypeScript properties of a `ReferenceItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVariantStoreReferenceItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("referenceArn", cdk.requiredValidator)(properties.referenceArn));
  errors.collect(cdk.propertyValidator("referenceArn", cdk.validateString)(properties.referenceArn));
  return errors.wrap("supplied properties not correct for \"ReferenceItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnVariantStoreReferenceItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVariantStoreReferenceItemPropertyValidator(properties).assertSuccess();
  return {
    "ReferenceArn": cdk.stringToCloudFormation(properties.referenceArn)
  };
}

// @ts-ignore TS6133
function CfnVariantStoreReferenceItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVariantStore.ReferenceItemProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVariantStore.ReferenceItemProperty>();
  ret.addPropertyResult("referenceArn", "ReferenceArn", (properties.ReferenceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ReferenceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SseConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SseConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVariantStoreSseConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyArn", cdk.validateString)(properties.keyArn));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"SseConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnVariantStoreSseConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVariantStoreSseConfigPropertyValidator(properties).assertSuccess();
  return {
    "KeyArn": cdk.stringToCloudFormation(properties.keyArn),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnVariantStoreSseConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnVariantStore.SseConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVariantStore.SseConfigProperty>();
  ret.addPropertyResult("keyArn", "KeyArn", (properties.KeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KeyArn) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnVariantStoreProps`
 *
 * @param properties - the TypeScript properties of a `CfnVariantStoreProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVariantStorePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("reference", cdk.requiredValidator)(properties.reference));
  errors.collect(cdk.propertyValidator("reference", CfnVariantStoreReferenceItemPropertyValidator)(properties.reference));
  errors.collect(cdk.propertyValidator("sseConfig", CfnVariantStoreSseConfigPropertyValidator)(properties.sseConfig));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnVariantStoreProps\"");
}

// @ts-ignore TS6133
function convertCfnVariantStorePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVariantStorePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Reference": convertCfnVariantStoreReferenceItemPropertyToCloudFormation(properties.reference),
    "SseConfig": convertCfnVariantStoreSseConfigPropertyToCloudFormation(properties.sseConfig),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnVariantStorePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVariantStoreProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVariantStoreProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("reference", "Reference", (properties.Reference != null ? CfnVariantStoreReferenceItemPropertyFromCloudFormation(properties.Reference) : undefined));
  ret.addPropertyResult("sseConfig", "SseConfig", (properties.SseConfig != null ? CfnVariantStoreSseConfigPropertyFromCloudFormation(properties.SseConfig) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a workflow.
 *
 * @cloudformationResource AWS::Omics::Workflow
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-workflow.html
 */
export class CfnWorkflow extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Omics::Workflow";

  /**
   * Build a CfnWorkflow from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkflow {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWorkflowPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWorkflow(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN for the workflow.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * When the workflow was created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The workflow's ID.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The workflow's status.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The workflow's type.
   *
   * @cloudformationAttribute Type
   */
  public readonly attrType: string;

  public accelerators?: string;

  /**
   * The URI of a definition for the workflow.
   */
  public definitionUri?: string;

  /**
   * The parameter's description.
   */
  public description?: string;

  /**
   * An engine for the workflow.
   */
  public engine?: string;

  /**
   * The path of the main definition file for the workflow.
   */
  public main?: string;

  /**
   * The workflow's name.
   */
  public name?: string;

  /**
   * The workflow's parameter template.
   */
  public parameterTemplate?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnWorkflow.WorkflowParameterProperty>;

  /**
   * A storage capacity for the workflow in gibibytes.
   */
  public storageCapacity?: number;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags for the workflow.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWorkflowProps = {}) {
    super(scope, id, {
      "type": CfnWorkflow.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attrType = cdk.Token.asString(this.getAtt("Type", cdk.ResolutionTypeHint.STRING));
    this.accelerators = props.accelerators;
    this.definitionUri = props.definitionUri;
    this.description = props.description;
    this.engine = props.engine;
    this.main = props.main;
    this.name = props.name;
    this.parameterTemplate = props.parameterTemplate;
    this.storageCapacity = props.storageCapacity;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Omics::Workflow", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accelerators": this.accelerators,
      "definitionUri": this.definitionUri,
      "description": this.description,
      "engine": this.engine,
      "main": this.main,
      "name": this.name,
      "parameterTemplate": this.parameterTemplate,
      "storageCapacity": this.storageCapacity,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkflow.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWorkflowPropsToCloudFormation(props);
  }
}

export namespace CfnWorkflow {
  /**
   * A workflow parameter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-workflow-workflowparameter.html
   */
  export interface WorkflowParameterProperty {
    /**
     * The parameter's description.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-workflow-workflowparameter.html#cfn-omics-workflow-workflowparameter-description
     */
    readonly description?: string;

    /**
     * Whether the parameter is optional.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-omics-workflow-workflowparameter.html#cfn-omics-workflow-workflowparameter-optional
     */
    readonly optional?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnWorkflow`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-workflow.html
 */
export interface CfnWorkflowProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-workflow.html#cfn-omics-workflow-accelerators
   */
  readonly accelerators?: string;

  /**
   * The URI of a definition for the workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-workflow.html#cfn-omics-workflow-definitionuri
   */
  readonly definitionUri?: string;

  /**
   * The parameter's description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-workflow.html#cfn-omics-workflow-description
   */
  readonly description?: string;

  /**
   * An engine for the workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-workflow.html#cfn-omics-workflow-engine
   */
  readonly engine?: string;

  /**
   * The path of the main definition file for the workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-workflow.html#cfn-omics-workflow-main
   */
  readonly main?: string;

  /**
   * The workflow's name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-workflow.html#cfn-omics-workflow-name
   */
  readonly name?: string;

  /**
   * The workflow's parameter template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-workflow.html#cfn-omics-workflow-parametertemplate
   */
  readonly parameterTemplate?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnWorkflow.WorkflowParameterProperty>;

  /**
   * A storage capacity for the workflow in gibibytes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-workflow.html#cfn-omics-workflow-storagecapacity
   */
  readonly storageCapacity?: number;

  /**
   * Tags for the workflow.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-omics-workflow.html#cfn-omics-workflow-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `WorkflowParameterProperty`
 *
 * @param properties - the TypeScript properties of a `WorkflowParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowWorkflowParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("optional", cdk.validateBoolean)(properties.optional));
  return errors.wrap("supplied properties not correct for \"WorkflowParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowWorkflowParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowWorkflowParameterPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Optional": cdk.booleanToCloudFormation(properties.optional)
  };
}

// @ts-ignore TS6133
function CfnWorkflowWorkflowParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkflow.WorkflowParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflow.WorkflowParameterProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("optional", "Optional", (properties.Optional != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Optional) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnWorkflowProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkflowProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkflowPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accelerators", cdk.validateString)(properties.accelerators));
  errors.collect(cdk.propertyValidator("definitionUri", cdk.validateString)(properties.definitionUri));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("engine", cdk.validateString)(properties.engine));
  errors.collect(cdk.propertyValidator("main", cdk.validateString)(properties.main));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("parameterTemplate", cdk.hashValidator(CfnWorkflowWorkflowParameterPropertyValidator))(properties.parameterTemplate));
  errors.collect(cdk.propertyValidator("storageCapacity", cdk.validateNumber)(properties.storageCapacity));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnWorkflowProps\"");
}

// @ts-ignore TS6133
function convertCfnWorkflowPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkflowPropsValidator(properties).assertSuccess();
  return {
    "Accelerators": cdk.stringToCloudFormation(properties.accelerators),
    "DefinitionUri": cdk.stringToCloudFormation(properties.definitionUri),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Engine": cdk.stringToCloudFormation(properties.engine),
    "Main": cdk.stringToCloudFormation(properties.main),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ParameterTemplate": cdk.hashMapper(convertCfnWorkflowWorkflowParameterPropertyToCloudFormation)(properties.parameterTemplate),
    "StorageCapacity": cdk.numberToCloudFormation(properties.storageCapacity),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnWorkflowPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkflowProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkflowProps>();
  ret.addPropertyResult("accelerators", "Accelerators", (properties.Accelerators != null ? cfn_parse.FromCloudFormation.getString(properties.Accelerators) : undefined));
  ret.addPropertyResult("definitionUri", "DefinitionUri", (properties.DefinitionUri != null ? cfn_parse.FromCloudFormation.getString(properties.DefinitionUri) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("engine", "Engine", (properties.Engine != null ? cfn_parse.FromCloudFormation.getString(properties.Engine) : undefined));
  ret.addPropertyResult("main", "Main", (properties.Main != null ? cfn_parse.FromCloudFormation.getString(properties.Main) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("parameterTemplate", "ParameterTemplate", (properties.ParameterTemplate != null ? cfn_parse.FromCloudFormation.getMap(CfnWorkflowWorkflowParameterPropertyFromCloudFormation)(properties.ParameterTemplate) : undefined));
  ret.addPropertyResult("storageCapacity", "StorageCapacity", (properties.StorageCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.StorageCapacity) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}