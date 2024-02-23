/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Instantiates a capability based on the specified parameters.
 *
 * A trading capability contains the information required to transform incoming EDI documents into JSON or XML outputs.
 *
 * @cloudformationResource AWS::B2BI::Capability
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-capability.html
 */
export class CfnCapability extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::B2BI::Capability";

  /**
   * Build a CfnCapability from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCapability {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCapabilityPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCapability(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns an Amazon Resource Name (ARN) for a specific AWS resource, such as a capability, partnership, profile, or transformer.
   *
   * @cloudformationAttribute CapabilityArn
   */
  public readonly attrCapabilityArn: string;

  /**
   * Returns a system-assigned unique identifier for the capability.
   *
   * @cloudformationAttribute CapabilityId
   */
  public readonly attrCapabilityId: string;

  /**
   * Returns a timestamp for creation date and time of the capability.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * Returns a timestamp that identifies the most recent date and time that the capability was modified.
   *
   * @cloudformationAttribute ModifiedAt
   */
  public readonly attrModifiedAt: string;

  /**
   * Specifies a structure that contains the details for a capability.
   */
  public configuration: CfnCapability.CapabilityConfigurationProperty | cdk.IResolvable;

  /**
   * Specifies one or more locations in Amazon S3, each specifying an EDI document that can be used with this capability.
   */
  public instructionsDocuments?: Array<cdk.IResolvable | CfnCapability.S3LocationProperty> | cdk.IResolvable;

  /**
   * The display name of the capability.
   */
  public name: string;

  /**
   * Specifies the key-value pairs assigned to ARNs that you can use to group and search for resources by type.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * Returns the type of the capability.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCapabilityProps) {
    super(scope, id, {
      "type": CfnCapability.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "configuration", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "type", this);

    this.attrCapabilityArn = cdk.Token.asString(this.getAtt("CapabilityArn", cdk.ResolutionTypeHint.STRING));
    this.attrCapabilityId = cdk.Token.asString(this.getAtt("CapabilityId", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrModifiedAt = cdk.Token.asString(this.getAtt("ModifiedAt", cdk.ResolutionTypeHint.STRING));
    this.configuration = props.configuration;
    this.instructionsDocuments = props.instructionsDocuments;
    this.name = props.name;
    this.tags = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "configuration": this.configuration,
      "instructionsDocuments": this.instructionsDocuments,
      "name": this.name,
      "tags": this.tags,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCapability.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCapabilityPropsToCloudFormation(props);
  }
}

export namespace CfnCapability {
  /**
   * A capability object.
   *
   * Currently, only EDI (electronic data interchange) capabilities are supported. A trading capability contains the information required to transform incoming EDI documents into JSON or XML outputs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-capabilityconfiguration.html
   */
  export interface CapabilityConfigurationProperty {
    /**
     * An EDI (electronic data interchange) configuration object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-capabilityconfiguration.html#cfn-b2bi-capability-capabilityconfiguration-edi
     */
    readonly edi: CfnCapability.EdiConfigurationProperty | cdk.IResolvable;
  }

  /**
   * Specifies the details for the EDI (electronic data interchange) transformation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-ediconfiguration.html
   */
  export interface EdiConfigurationProperty {
    /**
     * Contains the Amazon S3 bucket and prefix for the location of the input file, which is contained in an `S3Location` object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-ediconfiguration.html#cfn-b2bi-capability-ediconfiguration-inputlocation
     */
    readonly inputLocation: cdk.IResolvable | CfnCapability.S3LocationProperty;

    /**
     * Contains the Amazon S3 bucket and prefix for the location of the output file, which is contained in an `S3Location` object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-ediconfiguration.html#cfn-b2bi-capability-ediconfiguration-outputlocation
     */
    readonly outputLocation: cdk.IResolvable | CfnCapability.S3LocationProperty;

    /**
     * Returns the system-assigned unique identifier for the transformer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-ediconfiguration.html#cfn-b2bi-capability-ediconfiguration-transformerid
     */
    readonly transformerId: string;

    /**
     * Returns the type of the capability.
     *
     * Currently, only `edi` is supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-ediconfiguration.html#cfn-b2bi-capability-ediconfiguration-type
     */
    readonly type: CfnCapability.EdiTypeProperty | cdk.IResolvable;
  }

  /**
   * Specifies the details for the EDI standard that is being used for the transformer.
   *
   * Currently, only X12 is supported. X12 is a set of standards and corresponding messages that define specific business documents.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-editype.html
   */
  export interface EdiTypeProperty {
    /**
     * Returns the details for the EDI standard that is being used for the transformer.
     *
     * Currently, only X12 is supported. X12 is a set of standards and corresponding messages that define specific business documents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-editype.html#cfn-b2bi-capability-editype-x12details
     */
    readonly x12Details: cdk.IResolvable | CfnCapability.X12DetailsProperty;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-x12details.html
   */
  export interface X12DetailsProperty {
    /**
     * Returns an enumerated type where each value identifies an X12 transaction set.
     *
     * Transaction sets are maintained by the X12 Accredited Standards Committee.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-x12details.html#cfn-b2bi-capability-x12details-transactionset
     */
    readonly transactionSet?: string;

    /**
     * Returns the version to use for the specified X12 transaction set.
     *
     * Supported versions are `4010` , `4030` , and `5010` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-x12details.html#cfn-b2bi-capability-x12details-version
     */
    readonly version?: string;
  }

  /**
   * Specifies the details for the Amazon S3 file location that is being used with AWS B2BI Data Interchange.
   *
   * File locations in Amazon S3 are identified using a combination of the bucket and key.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * Specifies the name of the Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-s3location.html#cfn-b2bi-capability-s3location-bucketname
     */
    readonly bucketName?: string;

    /**
     * Specifies the Amazon S3 key for the file location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-capability-s3location.html#cfn-b2bi-capability-s3location-key
     */
    readonly key?: string;
  }
}

/**
 * Properties for defining a `CfnCapability`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-capability.html
 */
export interface CfnCapabilityProps {
  /**
   * Specifies a structure that contains the details for a capability.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-capability.html#cfn-b2bi-capability-configuration
   */
  readonly configuration: CfnCapability.CapabilityConfigurationProperty | cdk.IResolvable;

  /**
   * Specifies one or more locations in Amazon S3, each specifying an EDI document that can be used with this capability.
   *
   * Each item contains the name of the bucket and the key, to identify the document's location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-capability.html#cfn-b2bi-capability-instructionsdocuments
   */
  readonly instructionsDocuments?: Array<cdk.IResolvable | CfnCapability.S3LocationProperty> | cdk.IResolvable;

  /**
   * The display name of the capability.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-capability.html#cfn-b2bi-capability-name
   */
  readonly name: string;

  /**
   * Specifies the key-value pairs assigned to ARNs that you can use to group and search for resources by type.
   *
   * You can attach this metadata to resources (capabilities, partnerships, and so on) for any purpose.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-capability.html#cfn-b2bi-capability-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Returns the type of the capability.
   *
   * Currently, only `edi` is supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-capability.html#cfn-b2bi-capability-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `X12DetailsProperty`
 *
 * @param properties - the TypeScript properties of a `X12DetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCapabilityX12DetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("transactionSet", cdk.validateString)(properties.transactionSet));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"X12DetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnCapabilityX12DetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCapabilityX12DetailsPropertyValidator(properties).assertSuccess();
  return {
    "TransactionSet": cdk.stringToCloudFormation(properties.transactionSet),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnCapabilityX12DetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCapability.X12DetailsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCapability.X12DetailsProperty>();
  ret.addPropertyResult("transactionSet", "TransactionSet", (properties.TransactionSet != null ? cfn_parse.FromCloudFormation.getString(properties.TransactionSet) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EdiTypeProperty`
 *
 * @param properties - the TypeScript properties of a `EdiTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCapabilityEdiTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("x12Details", cdk.requiredValidator)(properties.x12Details));
  errors.collect(cdk.propertyValidator("x12Details", CfnCapabilityX12DetailsPropertyValidator)(properties.x12Details));
  return errors.wrap("supplied properties not correct for \"EdiTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnCapabilityEdiTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCapabilityEdiTypePropertyValidator(properties).assertSuccess();
  return {
    "X12Details": convertCfnCapabilityX12DetailsPropertyToCloudFormation(properties.x12Details)
  };
}

// @ts-ignore TS6133
function CfnCapabilityEdiTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCapability.EdiTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCapability.EdiTypeProperty>();
  ret.addPropertyResult("x12Details", "X12Details", (properties.X12Details != null ? CfnCapabilityX12DetailsPropertyFromCloudFormation(properties.X12Details) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCapabilityS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnCapabilityS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCapabilityS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "Key": cdk.stringToCloudFormation(properties.key)
  };
}

// @ts-ignore TS6133
function CfnCapabilityS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCapability.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCapability.S3LocationProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EdiConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EdiConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCapabilityEdiConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("inputLocation", cdk.requiredValidator)(properties.inputLocation));
  errors.collect(cdk.propertyValidator("inputLocation", CfnCapabilityS3LocationPropertyValidator)(properties.inputLocation));
  errors.collect(cdk.propertyValidator("outputLocation", cdk.requiredValidator)(properties.outputLocation));
  errors.collect(cdk.propertyValidator("outputLocation", CfnCapabilityS3LocationPropertyValidator)(properties.outputLocation));
  errors.collect(cdk.propertyValidator("transformerId", cdk.requiredValidator)(properties.transformerId));
  errors.collect(cdk.propertyValidator("transformerId", cdk.validateString)(properties.transformerId));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", CfnCapabilityEdiTypePropertyValidator)(properties.type));
  return errors.wrap("supplied properties not correct for \"EdiConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnCapabilityEdiConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCapabilityEdiConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "InputLocation": convertCfnCapabilityS3LocationPropertyToCloudFormation(properties.inputLocation),
    "OutputLocation": convertCfnCapabilityS3LocationPropertyToCloudFormation(properties.outputLocation),
    "TransformerId": cdk.stringToCloudFormation(properties.transformerId),
    "Type": convertCfnCapabilityEdiTypePropertyToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnCapabilityEdiConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCapability.EdiConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCapability.EdiConfigurationProperty>();
  ret.addPropertyResult("inputLocation", "InputLocation", (properties.InputLocation != null ? CfnCapabilityS3LocationPropertyFromCloudFormation(properties.InputLocation) : undefined));
  ret.addPropertyResult("outputLocation", "OutputLocation", (properties.OutputLocation != null ? CfnCapabilityS3LocationPropertyFromCloudFormation(properties.OutputLocation) : undefined));
  ret.addPropertyResult("transformerId", "TransformerId", (properties.TransformerId != null ? cfn_parse.FromCloudFormation.getString(properties.TransformerId) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? CfnCapabilityEdiTypePropertyFromCloudFormation(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CapabilityConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CapabilityConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCapabilityCapabilityConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("edi", cdk.requiredValidator)(properties.edi));
  errors.collect(cdk.propertyValidator("edi", CfnCapabilityEdiConfigurationPropertyValidator)(properties.edi));
  return errors.wrap("supplied properties not correct for \"CapabilityConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnCapabilityCapabilityConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCapabilityCapabilityConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Edi": convertCfnCapabilityEdiConfigurationPropertyToCloudFormation(properties.edi)
  };
}

// @ts-ignore TS6133
function CfnCapabilityCapabilityConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCapability.CapabilityConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCapability.CapabilityConfigurationProperty>();
  ret.addPropertyResult("edi", "Edi", (properties.Edi != null ? CfnCapabilityEdiConfigurationPropertyFromCloudFormation(properties.Edi) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCapabilityProps`
 *
 * @param properties - the TypeScript properties of a `CfnCapabilityProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCapabilityPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configuration", cdk.requiredValidator)(properties.configuration));
  errors.collect(cdk.propertyValidator("configuration", CfnCapabilityCapabilityConfigurationPropertyValidator)(properties.configuration));
  errors.collect(cdk.propertyValidator("instructionsDocuments", cdk.listValidator(CfnCapabilityS3LocationPropertyValidator))(properties.instructionsDocuments));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnCapabilityProps\"");
}

// @ts-ignore TS6133
function convertCfnCapabilityPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCapabilityPropsValidator(properties).assertSuccess();
  return {
    "Configuration": convertCfnCapabilityCapabilityConfigurationPropertyToCloudFormation(properties.configuration),
    "InstructionsDocuments": cdk.listMapper(convertCfnCapabilityS3LocationPropertyToCloudFormation)(properties.instructionsDocuments),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnCapabilityPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCapabilityProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCapabilityProps>();
  ret.addPropertyResult("configuration", "Configuration", (properties.Configuration != null ? CfnCapabilityCapabilityConfigurationPropertyFromCloudFormation(properties.Configuration) : undefined));
  ret.addPropertyResult("instructionsDocuments", "InstructionsDocuments", (properties.InstructionsDocuments != null ? cfn_parse.FromCloudFormation.getArray(CfnCapabilityS3LocationPropertyFromCloudFormation)(properties.InstructionsDocuments) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a partnership between a customer and a trading partner, based on the supplied parameters.
 *
 * A partnership represents the connection between you and your trading partner. It ties together a profile and one or more trading capabilities.
 *
 * @cloudformationResource AWS::B2BI::Partnership
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-partnership.html
 */
export class CfnPartnership extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::B2BI::Partnership";

  /**
   * Build a CfnPartnership from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPartnership {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPartnershipPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPartnership(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns a timestamp for creation date and time of the partnership.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * Returns a timestamp that identifies the most recent date and time that the partnership was modified.
   *
   * @cloudformationAttribute ModifiedAt
   */
  public readonly attrModifiedAt: string;

  /**
   * Returns an Amazon Resource Name (ARN) for a specific AWS resource, such as a capability, partnership, profile, or transformer.
   *
   * @cloudformationAttribute PartnershipArn
   */
  public readonly attrPartnershipArn: string;

  /**
   * Returns the unique, system-generated identifier for a partnership.
   *
   * @cloudformationAttribute PartnershipId
   */
  public readonly attrPartnershipId: string;

  /**
   * Returns the unique, system-generated identifier for a trading partner.
   *
   * @cloudformationAttribute TradingPartnerId
   */
  public readonly attrTradingPartnerId: string;

  /**
   * Returns one or more capabilities associated with this partnership.
   */
  public capabilities?: Array<string>;

  public email: string;

  /**
   * Returns the name of the partnership.
   */
  public name: string;

  public phone?: string;

  /**
   * Returns the unique, system-generated identifier for the profile connected to this partnership.
   */
  public profileId: string;

  /**
   * A key-value pair for a specific partnership.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPartnershipProps) {
    super(scope, id, {
      "type": CfnPartnership.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "email", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "profileId", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrModifiedAt = cdk.Token.asString(this.getAtt("ModifiedAt", cdk.ResolutionTypeHint.STRING));
    this.attrPartnershipArn = cdk.Token.asString(this.getAtt("PartnershipArn", cdk.ResolutionTypeHint.STRING));
    this.attrPartnershipId = cdk.Token.asString(this.getAtt("PartnershipId", cdk.ResolutionTypeHint.STRING));
    this.attrTradingPartnerId = cdk.Token.asString(this.getAtt("TradingPartnerId", cdk.ResolutionTypeHint.STRING));
    this.capabilities = props.capabilities;
    this.email = props.email;
    this.name = props.name;
    this.phone = props.phone;
    this.profileId = props.profileId;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "capabilities": this.capabilities,
      "email": this.email,
      "name": this.name,
      "phone": this.phone,
      "profileId": this.profileId,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPartnership.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPartnershipPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPartnership`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-partnership.html
 */
export interface CfnPartnershipProps {
  /**
   * Returns one or more capabilities associated with this partnership.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-partnership.html#cfn-b2bi-partnership-capabilities
   */
  readonly capabilities?: Array<string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-partnership.html#cfn-b2bi-partnership-email
   */
  readonly email: string;

  /**
   * Returns the name of the partnership.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-partnership.html#cfn-b2bi-partnership-name
   */
  readonly name: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-partnership.html#cfn-b2bi-partnership-phone
   */
  readonly phone?: string;

  /**
   * Returns the unique, system-generated identifier for the profile connected to this partnership.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-partnership.html#cfn-b2bi-partnership-profileid
   */
  readonly profileId: string;

  /**
   * A key-value pair for a specific partnership.
   *
   * Tags are metadata that you can use to search for and group capabilities for various purposes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-partnership.html#cfn-b2bi-partnership-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnPartnershipProps`
 *
 * @param properties - the TypeScript properties of a `CfnPartnershipProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPartnershipPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capabilities", cdk.listValidator(cdk.validateString))(properties.capabilities));
  errors.collect(cdk.propertyValidator("email", cdk.requiredValidator)(properties.email));
  errors.collect(cdk.propertyValidator("email", cdk.validateString)(properties.email));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("phone", cdk.validateString)(properties.phone));
  errors.collect(cdk.propertyValidator("profileId", cdk.requiredValidator)(properties.profileId));
  errors.collect(cdk.propertyValidator("profileId", cdk.validateString)(properties.profileId));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPartnershipProps\"");
}

// @ts-ignore TS6133
function convertCfnPartnershipPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPartnershipPropsValidator(properties).assertSuccess();
  return {
    "Capabilities": cdk.listMapper(cdk.stringToCloudFormation)(properties.capabilities),
    "Email": cdk.stringToCloudFormation(properties.email),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Phone": cdk.stringToCloudFormation(properties.phone),
    "ProfileId": cdk.stringToCloudFormation(properties.profileId),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPartnershipPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPartnershipProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPartnershipProps>();
  ret.addPropertyResult("capabilities", "Capabilities", (properties.Capabilities != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Capabilities) : undefined));
  ret.addPropertyResult("email", "Email", (properties.Email != null ? cfn_parse.FromCloudFormation.getString(properties.Email) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("phone", "Phone", (properties.Phone != null ? cfn_parse.FromCloudFormation.getString(properties.Phone) : undefined));
  ret.addPropertyResult("profileId", "ProfileId", (properties.ProfileId != null ? cfn_parse.FromCloudFormation.getString(properties.ProfileId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a customer profile.
 *
 * You can have up to five customer profiles, each representing a distinct private network. A profile is the mechanism used to create the concept of a private network.
 *
 * @cloudformationResource AWS::B2BI::Profile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-profile.html
 */
export class CfnProfile extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::B2BI::Profile";

  /**
   * Build a CfnProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the timestamp for creation date and time of the profile.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * Returns the name of the logging group.
   *
   * @cloudformationAttribute LogGroupName
   */
  public readonly attrLogGroupName: string;

  /**
   * Returns the timestamp that identifies the most recent date and time that the profile was modified.
   *
   * @cloudformationAttribute ModifiedAt
   */
  public readonly attrModifiedAt: string;

  /**
   * Returns an Amazon Resource Name (ARN) for the profile.
   *
   * @cloudformationAttribute ProfileArn
   */
  public readonly attrProfileArn: string;

  /**
   * @cloudformationAttribute ProfileId
   */
  public readonly attrProfileId: string;

  /**
   * Returns the name for the business associated with this profile.
   */
  public businessName: string;

  public email?: string;

  /**
   * Specifies whether or not logging is enabled for this profile.
   */
  public logging: string;

  /**
   * Returns the display name for profile.
   */
  public name: string;

  public phone: string;

  /**
   * A key-value pair for a specific profile.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnProfileProps) {
    super(scope, id, {
      "type": CfnProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "businessName", this);
    cdk.requireProperty(props, "logging", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "phone", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrLogGroupName = cdk.Token.asString(this.getAtt("LogGroupName", cdk.ResolutionTypeHint.STRING));
    this.attrModifiedAt = cdk.Token.asString(this.getAtt("ModifiedAt", cdk.ResolutionTypeHint.STRING));
    this.attrProfileArn = cdk.Token.asString(this.getAtt("ProfileArn", cdk.ResolutionTypeHint.STRING));
    this.attrProfileId = cdk.Token.asString(this.getAtt("ProfileId", cdk.ResolutionTypeHint.STRING));
    this.businessName = props.businessName;
    this.email = props.email;
    this.logging = props.logging;
    this.name = props.name;
    this.phone = props.phone;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "businessName": this.businessName,
      "email": this.email,
      "logging": this.logging,
      "name": this.name,
      "phone": this.phone,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnProfilePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-profile.html
 */
export interface CfnProfileProps {
  /**
   * Returns the name for the business associated with this profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-profile.html#cfn-b2bi-profile-businessname
   */
  readonly businessName: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-profile.html#cfn-b2bi-profile-email
   */
  readonly email?: string;

  /**
   * Specifies whether or not logging is enabled for this profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-profile.html#cfn-b2bi-profile-logging
   */
  readonly logging: string;

  /**
   * Returns the display name for profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-profile.html#cfn-b2bi-profile-name
   */
  readonly name: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-profile.html#cfn-b2bi-profile-phone
   */
  readonly phone: string;

  /**
   * A key-value pair for a specific profile.
   *
   * Tags are metadata that you can use to search for and group capabilities for various purposes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-profile.html#cfn-b2bi-profile-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("businessName", cdk.requiredValidator)(properties.businessName));
  errors.collect(cdk.propertyValidator("businessName", cdk.validateString)(properties.businessName));
  errors.collect(cdk.propertyValidator("email", cdk.validateString)(properties.email));
  errors.collect(cdk.propertyValidator("logging", cdk.requiredValidator)(properties.logging));
  errors.collect(cdk.propertyValidator("logging", cdk.validateString)(properties.logging));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("phone", cdk.requiredValidator)(properties.phone));
  errors.collect(cdk.propertyValidator("phone", cdk.validateString)(properties.phone));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProfilePropsValidator(properties).assertSuccess();
  return {
    "BusinessName": cdk.stringToCloudFormation(properties.businessName),
    "Email": cdk.stringToCloudFormation(properties.email),
    "Logging": cdk.stringToCloudFormation(properties.logging),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Phone": cdk.stringToCloudFormation(properties.phone),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProfileProps>();
  ret.addPropertyResult("businessName", "BusinessName", (properties.BusinessName != null ? cfn_parse.FromCloudFormation.getString(properties.BusinessName) : undefined));
  ret.addPropertyResult("email", "Email", (properties.Email != null ? cfn_parse.FromCloudFormation.getString(properties.Email) : undefined));
  ret.addPropertyResult("logging", "Logging", (properties.Logging != null ? cfn_parse.FromCloudFormation.getString(properties.Logging) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("phone", "Phone", (properties.Phone != null ? cfn_parse.FromCloudFormation.getString(properties.Phone) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a transformer.
 *
 * A transformer describes how to process the incoming EDI documents and extract the necessary information to the output file.
 *
 * @cloudformationResource AWS::B2BI::Transformer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-transformer.html
 */
export class CfnTransformer extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::B2BI::Transformer";

  /**
   * Build a CfnTransformer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTransformer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTransformerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTransformer(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns a timestamp indicating when the transformer was created. For example, `2023-07-20T19:58:44.624Z` .
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * Returns an Amazon Resource Name (ARN) for a specific transformer.
   *
   * @cloudformationAttribute TransformerArn
   */
  public readonly attrTransformerArn: string;

  /**
   * The system-assigned unique identifier for the transformer.
   *
   * @cloudformationAttribute TransformerId
   */
  public readonly attrTransformerId: string;

  /**
   * Returns the details for the EDI standard that is being used for the transformer.
   */
  public ediType: CfnTransformer.EdiTypeProperty | cdk.IResolvable;

  /**
   * Returns that the currently supported file formats for EDI transformations are `JSON` and `XML` .
   */
  public fileFormat: string;

  /**
   * Returns a sample EDI document that is used by a transformer as a guide for processing the EDI data.
   */
  public mappingTemplate: string;

  /**
   * Returns a timestamp representing the date and time for the most recent change for the transformer object.
   */
  public modifiedAt?: string;

  /**
   * Returns the descriptive name for the transformer.
   */
  public name: string;

  /**
   * Returns a sample EDI document that is used by a transformer as a guide for processing the EDI data.
   */
  public sampleDocument?: string;

  /**
   * Returns the state of the newly created transformer.
   */
  public status: string;

  /**
   * A key-value pair for a specific transformer.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTransformerProps) {
    super(scope, id, {
      "type": CfnTransformer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "ediType", this);
    cdk.requireProperty(props, "fileFormat", this);
    cdk.requireProperty(props, "mappingTemplate", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "status", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrTransformerArn = cdk.Token.asString(this.getAtt("TransformerArn", cdk.ResolutionTypeHint.STRING));
    this.attrTransformerId = cdk.Token.asString(this.getAtt("TransformerId", cdk.ResolutionTypeHint.STRING));
    this.ediType = props.ediType;
    this.fileFormat = props.fileFormat;
    this.mappingTemplate = props.mappingTemplate;
    this.modifiedAt = props.modifiedAt;
    this.name = props.name;
    this.sampleDocument = props.sampleDocument;
    this.status = props.status;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "ediType": this.ediType,
      "fileFormat": this.fileFormat,
      "mappingTemplate": this.mappingTemplate,
      "modifiedAt": this.modifiedAt,
      "name": this.name,
      "sampleDocument": this.sampleDocument,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTransformer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTransformerPropsToCloudFormation(props);
  }
}

export namespace CfnTransformer {
  /**
   * Specifies the details for the EDI standard that is being used for the transformer.
   *
   * Currently, only X12 is supported. X12 is a set of standards and corresponding messages that define specific business documents.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-transformer-editype.html
   */
  export interface EdiTypeProperty {
    /**
     * Returns the details for the EDI standard that is being used for the transformer.
     *
     * Currently, only X12 is supported. X12 is a set of standards and corresponding messages that define specific business documents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-transformer-editype.html#cfn-b2bi-transformer-editype-x12details
     */
    readonly x12Details: cdk.IResolvable | CfnTransformer.X12DetailsProperty;
  }

  /**
   * A structure that contains the X12 transaction set and version.
   *
   * The X12 structure is used when the system transforms an EDI (electronic data interchange) file.
   *
   * > If an EDI input file contains more than one transaction, each transaction must have the same transaction set and version, for example 214/4010. If not, the transformer cannot parse the file.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-transformer-x12details.html
   */
  export interface X12DetailsProperty {
    /**
     * Returns an enumerated type where each value identifies an X12 transaction set.
     *
     * Transaction sets are maintained by the X12 Accredited Standards Committee.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-transformer-x12details.html#cfn-b2bi-transformer-x12details-transactionset
     */
    readonly transactionSet?: string;

    /**
     * Returns the version to use for the specified X12 transaction set.
     *
     * Supported versions are `4010` , `4030` , and `5010` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-b2bi-transformer-x12details.html#cfn-b2bi-transformer-x12details-version
     */
    readonly version?: string;
  }
}

/**
 * Properties for defining a `CfnTransformer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-transformer.html
 */
export interface CfnTransformerProps {
  /**
   * Returns the details for the EDI standard that is being used for the transformer.
   *
   * Currently, only X12 is supported. X12 is a set of standards and corresponding messages that define specific business documents.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-transformer.html#cfn-b2bi-transformer-editype
   */
  readonly ediType: CfnTransformer.EdiTypeProperty | cdk.IResolvable;

  /**
   * Returns that the currently supported file formats for EDI transformations are `JSON` and `XML` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-transformer.html#cfn-b2bi-transformer-fileformat
   */
  readonly fileFormat: string;

  /**
   * Returns a sample EDI document that is used by a transformer as a guide for processing the EDI data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-transformer.html#cfn-b2bi-transformer-mappingtemplate
   */
  readonly mappingTemplate: string;

  /**
   * Returns a timestamp representing the date and time for the most recent change for the transformer object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-transformer.html#cfn-b2bi-transformer-modifiedat
   */
  readonly modifiedAt?: string;

  /**
   * Returns the descriptive name for the transformer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-transformer.html#cfn-b2bi-transformer-name
   */
  readonly name: string;

  /**
   * Returns a sample EDI document that is used by a transformer as a guide for processing the EDI data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-transformer.html#cfn-b2bi-transformer-sampledocument
   */
  readonly sampleDocument?: string;

  /**
   * Returns the state of the newly created transformer.
   *
   * The transformer can be either `active` or `inactive` . For the transformer to be used in a capability, its status must `active` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-transformer.html#cfn-b2bi-transformer-status
   */
  readonly status: string;

  /**
   * A key-value pair for a specific transformer.
   *
   * Tags are metadata that you can use to search for and group capabilities for various purposes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-b2bi-transformer.html#cfn-b2bi-transformer-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `X12DetailsProperty`
 *
 * @param properties - the TypeScript properties of a `X12DetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTransformerX12DetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("transactionSet", cdk.validateString)(properties.transactionSet));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"X12DetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnTransformerX12DetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTransformerX12DetailsPropertyValidator(properties).assertSuccess();
  return {
    "TransactionSet": cdk.stringToCloudFormation(properties.transactionSet),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnTransformerX12DetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTransformer.X12DetailsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTransformer.X12DetailsProperty>();
  ret.addPropertyResult("transactionSet", "TransactionSet", (properties.TransactionSet != null ? cfn_parse.FromCloudFormation.getString(properties.TransactionSet) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EdiTypeProperty`
 *
 * @param properties - the TypeScript properties of a `EdiTypeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTransformerEdiTypePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("x12Details", cdk.requiredValidator)(properties.x12Details));
  errors.collect(cdk.propertyValidator("x12Details", CfnTransformerX12DetailsPropertyValidator)(properties.x12Details));
  return errors.wrap("supplied properties not correct for \"EdiTypeProperty\"");
}

// @ts-ignore TS6133
function convertCfnTransformerEdiTypePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTransformerEdiTypePropertyValidator(properties).assertSuccess();
  return {
    "X12Details": convertCfnTransformerX12DetailsPropertyToCloudFormation(properties.x12Details)
  };
}

// @ts-ignore TS6133
function CfnTransformerEdiTypePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTransformer.EdiTypeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTransformer.EdiTypeProperty>();
  ret.addPropertyResult("x12Details", "X12Details", (properties.X12Details != null ? CfnTransformerX12DetailsPropertyFromCloudFormation(properties.X12Details) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTransformerProps`
 *
 * @param properties - the TypeScript properties of a `CfnTransformerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTransformerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ediType", cdk.requiredValidator)(properties.ediType));
  errors.collect(cdk.propertyValidator("ediType", CfnTransformerEdiTypePropertyValidator)(properties.ediType));
  errors.collect(cdk.propertyValidator("fileFormat", cdk.requiredValidator)(properties.fileFormat));
  errors.collect(cdk.propertyValidator("fileFormat", cdk.validateString)(properties.fileFormat));
  errors.collect(cdk.propertyValidator("mappingTemplate", cdk.requiredValidator)(properties.mappingTemplate));
  errors.collect(cdk.propertyValidator("mappingTemplate", cdk.validateString)(properties.mappingTemplate));
  errors.collect(cdk.propertyValidator("modifiedAt", cdk.validateString)(properties.modifiedAt));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("sampleDocument", cdk.validateString)(properties.sampleDocument));
  errors.collect(cdk.propertyValidator("status", cdk.requiredValidator)(properties.status));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnTransformerProps\"");
}

// @ts-ignore TS6133
function convertCfnTransformerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTransformerPropsValidator(properties).assertSuccess();
  return {
    "EdiType": convertCfnTransformerEdiTypePropertyToCloudFormation(properties.ediType),
    "FileFormat": cdk.stringToCloudFormation(properties.fileFormat),
    "MappingTemplate": cdk.stringToCloudFormation(properties.mappingTemplate),
    "ModifiedAt": cdk.stringToCloudFormation(properties.modifiedAt),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SampleDocument": cdk.stringToCloudFormation(properties.sampleDocument),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnTransformerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTransformerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTransformerProps>();
  ret.addPropertyResult("ediType", "EdiType", (properties.EdiType != null ? CfnTransformerEdiTypePropertyFromCloudFormation(properties.EdiType) : undefined));
  ret.addPropertyResult("fileFormat", "FileFormat", (properties.FileFormat != null ? cfn_parse.FromCloudFormation.getString(properties.FileFormat) : undefined));
  ret.addPropertyResult("mappingTemplate", "MappingTemplate", (properties.MappingTemplate != null ? cfn_parse.FromCloudFormation.getString(properties.MappingTemplate) : undefined));
  ret.addPropertyResult("modifiedAt", "ModifiedAt", (properties.ModifiedAt != null ? cfn_parse.FromCloudFormation.getString(properties.ModifiedAt) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("sampleDocument", "SampleDocument", (properties.SampleDocument != null ? cfn_parse.FromCloudFormation.getString(properties.SampleDocument) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}