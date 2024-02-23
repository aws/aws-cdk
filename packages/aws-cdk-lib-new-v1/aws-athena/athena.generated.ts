/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specifies a capacity reservation with the provided name and number of requested data processing units.
 *
 * @cloudformationResource AWS::Athena::CapacityReservation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-capacityreservation.html
 */
export class CfnCapacityReservation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Athena::CapacityReservation";

  /**
   * Build a CfnCapacityReservation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCapacityReservation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCapacityReservationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCapacityReservation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The number of data processing units currently allocated.
   *
   * @cloudformationAttribute AllocatedDpus
   */
  public readonly attrAllocatedDpus: number;

  /**
   * The ARN of the capacity reservation.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The time in UTC epoch millis when the capacity reservation was created.
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * The time of the most recent capacity allocation that succeeded.
   *
   * @cloudformationAttribute LastSuccessfulAllocationTime
   */
  public readonly attrLastSuccessfulAllocationTime: string;

  /**
   * The status of the capacity reservation.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * Assigns Athena workgroups (and hence their queries) to capacity reservations.
   */
  public capacityAssignmentConfiguration?: CfnCapacityReservation.CapacityAssignmentConfigurationProperty | cdk.IResolvable;

  /**
   * The name of the capacity reservation.
   */
  public name: string;

  /**
   * An array of key-value pairs to apply to the capacity reservation.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The number of data processing units requested.
   */
  public targetDpus: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCapacityReservationProps) {
    super(scope, id, {
      "type": CfnCapacityReservation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "targetDpus", this);

    this.attrAllocatedDpus = cdk.Token.asNumber(this.getAtt("AllocatedDpus", cdk.ResolutionTypeHint.NUMBER));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrLastSuccessfulAllocationTime = cdk.Token.asString(this.getAtt("LastSuccessfulAllocationTime", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.capacityAssignmentConfiguration = props.capacityAssignmentConfiguration;
    this.name = props.name;
    this.tags = props.tags;
    this.targetDpus = props.targetDpus;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "capacityAssignmentConfiguration": this.capacityAssignmentConfiguration,
      "name": this.name,
      "tags": this.tags,
      "targetDpus": this.targetDpus
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCapacityReservation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCapacityReservationPropsToCloudFormation(props);
  }
}

export namespace CfnCapacityReservation {
  /**
   * Assigns Athena workgroups (and hence their queries) to capacity reservations.
   *
   * A capacity reservation can have only one capacity assignment configuration, but the capacity assignment configuration can be made up of multiple individual assignments. Each assignment specifies how Athena queries can consume capacity from the capacity reservation that their workgroup is mapped to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-capacityreservation-capacityassignmentconfiguration.html
   */
  export interface CapacityAssignmentConfigurationProperty {
    /**
     * The list of assignments that make up the capacity assignment configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-capacityreservation-capacityassignmentconfiguration.html#cfn-athena-capacityreservation-capacityassignmentconfiguration-capacityassignments
     */
    readonly capacityAssignments: Array<CfnCapacityReservation.CapacityAssignmentProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * A mapping between one or more workgroups and a capacity reservation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-capacityreservation-capacityassignment.html
   */
  export interface CapacityAssignmentProperty {
    /**
     * The list of workgroup names for the capacity assignment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-capacityreservation-capacityassignment.html#cfn-athena-capacityreservation-capacityassignment-workgroupnames
     */
    readonly workgroupNames: Array<string>;
  }
}

/**
 * Properties for defining a `CfnCapacityReservation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-capacityreservation.html
 */
export interface CfnCapacityReservationProps {
  /**
   * Assigns Athena workgroups (and hence their queries) to capacity reservations.
   *
   * A capacity reservation can have only one capacity assignment configuration, but the capacity assignment configuration can be made up of multiple individual assignments. Each assignment specifies how Athena queries can consume capacity from the capacity reservation that their workgroup is mapped to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-capacityreservation.html#cfn-athena-capacityreservation-capacityassignmentconfiguration
   */
  readonly capacityAssignmentConfiguration?: CfnCapacityReservation.CapacityAssignmentConfigurationProperty | cdk.IResolvable;

  /**
   * The name of the capacity reservation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-capacityreservation.html#cfn-athena-capacityreservation-name
   */
  readonly name: string;

  /**
   * An array of key-value pairs to apply to the capacity reservation.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-capacityreservation.html#cfn-athena-capacityreservation-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The number of data processing units requested.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-capacityreservation.html#cfn-athena-capacityreservation-targetdpus
   */
  readonly targetDpus: number;
}

/**
 * Determine whether the given properties match those of a `CapacityAssignmentProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityAssignmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCapacityReservationCapacityAssignmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("workgroupNames", cdk.requiredValidator)(properties.workgroupNames));
  errors.collect(cdk.propertyValidator("workgroupNames", cdk.listValidator(cdk.validateString))(properties.workgroupNames));
  return errors.wrap("supplied properties not correct for \"CapacityAssignmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnCapacityReservationCapacityAssignmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCapacityReservationCapacityAssignmentPropertyValidator(properties).assertSuccess();
  return {
    "WorkgroupNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.workgroupNames)
  };
}

// @ts-ignore TS6133
function CfnCapacityReservationCapacityAssignmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCapacityReservation.CapacityAssignmentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCapacityReservation.CapacityAssignmentProperty>();
  ret.addPropertyResult("workgroupNames", "WorkgroupNames", (properties.WorkgroupNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.WorkgroupNames) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CapacityAssignmentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityAssignmentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCapacityReservationCapacityAssignmentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capacityAssignments", cdk.requiredValidator)(properties.capacityAssignments));
  errors.collect(cdk.propertyValidator("capacityAssignments", cdk.listValidator(CfnCapacityReservationCapacityAssignmentPropertyValidator))(properties.capacityAssignments));
  return errors.wrap("supplied properties not correct for \"CapacityAssignmentConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnCapacityReservationCapacityAssignmentConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCapacityReservationCapacityAssignmentConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CapacityAssignments": cdk.listMapper(convertCfnCapacityReservationCapacityAssignmentPropertyToCloudFormation)(properties.capacityAssignments)
  };
}

// @ts-ignore TS6133
function CfnCapacityReservationCapacityAssignmentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCapacityReservation.CapacityAssignmentConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCapacityReservation.CapacityAssignmentConfigurationProperty>();
  ret.addPropertyResult("capacityAssignments", "CapacityAssignments", (properties.CapacityAssignments != null ? cfn_parse.FromCloudFormation.getArray(CfnCapacityReservationCapacityAssignmentPropertyFromCloudFormation)(properties.CapacityAssignments) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCapacityReservationProps`
 *
 * @param properties - the TypeScript properties of a `CfnCapacityReservationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCapacityReservationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capacityAssignmentConfiguration", CfnCapacityReservationCapacityAssignmentConfigurationPropertyValidator)(properties.capacityAssignmentConfiguration));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("targetDpus", cdk.requiredValidator)(properties.targetDpus));
  errors.collect(cdk.propertyValidator("targetDpus", cdk.validateNumber)(properties.targetDpus));
  return errors.wrap("supplied properties not correct for \"CfnCapacityReservationProps\"");
}

// @ts-ignore TS6133
function convertCfnCapacityReservationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCapacityReservationPropsValidator(properties).assertSuccess();
  return {
    "CapacityAssignmentConfiguration": convertCfnCapacityReservationCapacityAssignmentConfigurationPropertyToCloudFormation(properties.capacityAssignmentConfiguration),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TargetDpus": cdk.numberToCloudFormation(properties.targetDpus)
  };
}

// @ts-ignore TS6133
function CfnCapacityReservationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCapacityReservationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCapacityReservationProps>();
  ret.addPropertyResult("capacityAssignmentConfiguration", "CapacityAssignmentConfiguration", (properties.CapacityAssignmentConfiguration != null ? CfnCapacityReservationCapacityAssignmentConfigurationPropertyFromCloudFormation(properties.CapacityAssignmentConfiguration) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("targetDpus", "TargetDpus", (properties.TargetDpus != null ? cfn_parse.FromCloudFormation.getNumber(properties.TargetDpus) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::Athena::DataCatalog resource specifies an Amazon Athena data catalog, which contains a name, description, type, parameters, and tags.
 *
 * For more information, see [DataCatalog](https://docs.aws.amazon.com/athena/latest/APIReference/API_DataCatalog.html) in the *Amazon Athena API Reference* .
 *
 * @cloudformationResource AWS::Athena::DataCatalog
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html
 */
export class CfnDataCatalog extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Athena::DataCatalog";

  /**
   * Build a CfnDataCatalog from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataCatalog {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDataCatalogPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDataCatalog(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A description of the data catalog.
   */
  public description?: string;

  /**
   * The name of the data catalog.
   */
  public name: string;

  /**
   * Specifies the Lambda function or functions to use for the data catalog.
   */
  public parameters?: cdk.IResolvable | Record<string, string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags (key-value pairs) to associate with this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The type of data catalog: `LAMBDA` for a federated catalog, `GLUE` for AWS Glue Catalog, or `HIVE` for an external hive metastore.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDataCatalogProps) {
    super(scope, id, {
      "type": CfnDataCatalog.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "type", this);

    this.description = props.description;
    this.name = props.name;
    this.parameters = props.parameters;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Athena::DataCatalog", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "parameters": this.parameters,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataCatalog.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDataCatalogPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDataCatalog`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html
 */
export interface CfnDataCatalogProps {
  /**
   * A description of the data catalog.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-description
   */
  readonly description?: string;

  /**
   * The name of the data catalog.
   *
   * The catalog name must be unique for the AWS account and can use a maximum of 128 alphanumeric, underscore, at sign, or hyphen characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-name
   */
  readonly name: string;

  /**
   * Specifies the Lambda function or functions to use for the data catalog.
   *
   * The mapping used depends on the catalog type.
   *
   * - The `HIVE` data catalog type uses the following syntax. The `metadata-function` parameter is required. `The sdk-version` parameter is optional and defaults to the currently supported version.
   *
   * `metadata-function= *lambda_arn* , sdk-version= *version_number*`
   * - The `LAMBDA` data catalog type uses one of the following sets of required parameters, but not both.
   *
   * - When one Lambda function processes metadata and another Lambda function reads data, the following syntax is used. Both parameters are required.
   *
   * `metadata-function= *lambda_arn* , record-function= *lambda_arn*`
   * - A composite Lambda function that processes both metadata and data uses the following syntax.
   *
   * `function= *lambda_arn*`
   * - The `GLUE` type takes a catalog ID parameter and is required. The `*catalog_id*` is the account ID of the AWS account to which the Glue catalog belongs.
   *
   * `catalog-id= *catalog_id*`
   *
   * - The `GLUE` data catalog type also applies to the default `AwsDataCatalog` that already exists in your account, of which you can have only one and cannot modify.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-parameters
   */
  readonly parameters?: cdk.IResolvable | Record<string, string>;

  /**
   * The tags (key-value pairs) to associate with this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The type of data catalog: `LAMBDA` for a federated catalog, `GLUE` for AWS Glue Catalog, or `HIVE` for an external hive metastore.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-datacatalog.html#cfn-athena-datacatalog-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `CfnDataCatalogProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataCatalogProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataCatalogPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("parameters", cdk.hashValidator(cdk.validateString))(properties.parameters));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnDataCatalogProps\"");
}

// @ts-ignore TS6133
function convertCfnDataCatalogPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataCatalogPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Parameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDataCatalogPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataCatalogProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataCatalogProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Athena::NamedQuery` resource specifies an Amazon Athena saved query, where `QueryString` contains the SQL query statements that make up the query.
 *
 * @cloudformationResource AWS::Athena::NamedQuery
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html
 */
export class CfnNamedQuery extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Athena::NamedQuery";

  /**
   * Build a CfnNamedQuery from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnNamedQuery {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnNamedQueryPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnNamedQuery(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique ID of the query.
   *
   * @cloudformationAttribute NamedQueryId
   */
  public readonly attrNamedQueryId: string;

  /**
   * The database to which the query belongs.
   */
  public database: string;

  /**
   * The query description.
   */
  public description?: string;

  /**
   * The query name.
   */
  public name?: string;

  /**
   * The SQL statements that make up the query.
   */
  public queryString: string;

  /**
   * The name of the workgroup that contains the named query.
   */
  public workGroup?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnNamedQueryProps) {
    super(scope, id, {
      "type": CfnNamedQuery.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "database", this);
    cdk.requireProperty(props, "queryString", this);

    this.attrNamedQueryId = cdk.Token.asString(this.getAtt("NamedQueryId", cdk.ResolutionTypeHint.STRING));
    this.database = props.database;
    this.description = props.description;
    this.name = props.name;
    this.queryString = props.queryString;
    this.workGroup = props.workGroup;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "database": this.database,
      "description": this.description,
      "name": this.name,
      "queryString": this.queryString,
      "workGroup": this.workGroup
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnNamedQuery.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnNamedQueryPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnNamedQuery`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html
 */
export interface CfnNamedQueryProps {
  /**
   * The database to which the query belongs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-database
   */
  readonly database: string;

  /**
   * The query description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-description
   */
  readonly description?: string;

  /**
   * The query name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-name
   */
  readonly name?: string;

  /**
   * The SQL statements that make up the query.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-querystring
   */
  readonly queryString: string;

  /**
   * The name of the workgroup that contains the named query.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-namedquery.html#cfn-athena-namedquery-workgroup
   */
  readonly workGroup?: string;
}

/**
 * Determine whether the given properties match those of a `CfnNamedQueryProps`
 *
 * @param properties - the TypeScript properties of a `CfnNamedQueryProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnNamedQueryPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("database", cdk.requiredValidator)(properties.database));
  errors.collect(cdk.propertyValidator("database", cdk.validateString)(properties.database));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("queryString", cdk.requiredValidator)(properties.queryString));
  errors.collect(cdk.propertyValidator("queryString", cdk.validateString)(properties.queryString));
  errors.collect(cdk.propertyValidator("workGroup", cdk.validateString)(properties.workGroup));
  return errors.wrap("supplied properties not correct for \"CfnNamedQueryProps\"");
}

// @ts-ignore TS6133
function convertCfnNamedQueryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnNamedQueryPropsValidator(properties).assertSuccess();
  return {
    "Database": cdk.stringToCloudFormation(properties.database),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "QueryString": cdk.stringToCloudFormation(properties.queryString),
    "WorkGroup": cdk.stringToCloudFormation(properties.workGroup)
  };
}

// @ts-ignore TS6133
function CfnNamedQueryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnNamedQueryProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnNamedQueryProps>();
  ret.addPropertyResult("database", "Database", (properties.Database != null ? cfn_parse.FromCloudFormation.getString(properties.Database) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("queryString", "QueryString", (properties.QueryString != null ? cfn_parse.FromCloudFormation.getString(properties.QueryString) : undefined));
  ret.addPropertyResult("workGroup", "WorkGroup", (properties.WorkGroup != null ? cfn_parse.FromCloudFormation.getString(properties.WorkGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a prepared statement for use with SQL queries in Athena.
 *
 * @cloudformationResource AWS::Athena::PreparedStatement
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html
 */
export class CfnPreparedStatement extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Athena::PreparedStatement";

  /**
   * Build a CfnPreparedStatement from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPreparedStatement {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPreparedStatementPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPreparedStatement(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The description of the prepared statement.
   */
  public description?: string;

  /**
   * The query string for the prepared statement.
   */
  public queryStatement: string;

  /**
   * The name of the prepared statement.
   */
  public statementName: string;

  /**
   * The workgroup to which the prepared statement belongs.
   */
  public workGroup: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPreparedStatementProps) {
    super(scope, id, {
      "type": CfnPreparedStatement.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "queryStatement", this);
    cdk.requireProperty(props, "statementName", this);
    cdk.requireProperty(props, "workGroup", this);

    this.description = props.description;
    this.queryStatement = props.queryStatement;
    this.statementName = props.statementName;
    this.workGroup = props.workGroup;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "queryStatement": this.queryStatement,
      "statementName": this.statementName,
      "workGroup": this.workGroup
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPreparedStatement.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPreparedStatementPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnPreparedStatement`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html
 */
export interface CfnPreparedStatementProps {
  /**
   * The description of the prepared statement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html#cfn-athena-preparedstatement-description
   */
  readonly description?: string;

  /**
   * The query string for the prepared statement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html#cfn-athena-preparedstatement-querystatement
   */
  readonly queryStatement: string;

  /**
   * The name of the prepared statement.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html#cfn-athena-preparedstatement-statementname
   */
  readonly statementName: string;

  /**
   * The workgroup to which the prepared statement belongs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-preparedstatement.html#cfn-athena-preparedstatement-workgroup
   */
  readonly workGroup: string;
}

/**
 * Determine whether the given properties match those of a `CfnPreparedStatementProps`
 *
 * @param properties - the TypeScript properties of a `CfnPreparedStatementProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPreparedStatementPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("queryStatement", cdk.requiredValidator)(properties.queryStatement));
  errors.collect(cdk.propertyValidator("queryStatement", cdk.validateString)(properties.queryStatement));
  errors.collect(cdk.propertyValidator("statementName", cdk.requiredValidator)(properties.statementName));
  errors.collect(cdk.propertyValidator("statementName", cdk.validateString)(properties.statementName));
  errors.collect(cdk.propertyValidator("workGroup", cdk.requiredValidator)(properties.workGroup));
  errors.collect(cdk.propertyValidator("workGroup", cdk.validateString)(properties.workGroup));
  return errors.wrap("supplied properties not correct for \"CfnPreparedStatementProps\"");
}

// @ts-ignore TS6133
function convertCfnPreparedStatementPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPreparedStatementPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "QueryStatement": cdk.stringToCloudFormation(properties.queryStatement),
    "StatementName": cdk.stringToCloudFormation(properties.statementName),
    "WorkGroup": cdk.stringToCloudFormation(properties.workGroup)
  };
}

// @ts-ignore TS6133
function CfnPreparedStatementPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPreparedStatementProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPreparedStatementProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("queryStatement", "QueryStatement", (properties.QueryStatement != null ? cfn_parse.FromCloudFormation.getString(properties.QueryStatement) : undefined));
  ret.addPropertyResult("statementName", "StatementName", (properties.StatementName != null ? cfn_parse.FromCloudFormation.getString(properties.StatementName) : undefined));
  ret.addPropertyResult("workGroup", "WorkGroup", (properties.WorkGroup != null ? cfn_parse.FromCloudFormation.getString(properties.WorkGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::Athena::WorkGroup resource specifies an Amazon Athena workgroup, which contains a name, description, creation time, state, and other configuration, listed under `WorkGroupConfiguration` .
 *
 * Each workgroup enables you to isolate queries for you or your group from other queries in the same account. For more information, see [CreateWorkGroup](https://docs.aws.amazon.com/athena/latest/APIReference/API_CreateWorkGroup.html) in the *Amazon Athena API Reference* .
 *
 * @cloudformationResource AWS::Athena::WorkGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html
 */
export class CfnWorkGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Athena::WorkGroup";

  /**
   * Build a CfnWorkGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnWorkGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnWorkGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnWorkGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The date and time the workgroup was created, as a UNIX timestamp in seconds. For example: `1582761016` .
   *
   * @cloudformationAttribute CreationTime
   */
  public readonly attrCreationTime: string;

  /**
   * Read only. The engine version on which the query runs. If the user requests a valid engine version other than Auto, the effective engine version is the same as the engine version that the user requested. If the user requests Auto, the effective engine version is chosen by Athena. When a request to update the engine version is made by a CreateWorkGroup or UpdateWorkGroup operation, the EffectiveEngineVersion field is ignored.
   *
   * @cloudformationAttribute WorkGroupConfiguration.EngineVersion.EffectiveEngineVersion
   */
  public readonly attrWorkGroupConfigurationEngineVersionEffectiveEngineVersion: string;

  /**
   * Read only. The engine version on which the query runs. If the user requests a valid engine version other than Auto, the effective engine version is the same as the engine version that the user requested. If the user requests Auto, the effective engine version is chosen by Athena. When a request to update the engine version is made by a `CreateWorkGroup` or `UpdateWorkGroup` operation, the `EffectiveEngineVersion` field is ignored.
   *
   * @cloudformationAttribute WorkGroupConfigurationUpdates.EngineVersion.EffectiveEngineVersion
   */
  public readonly attrWorkGroupConfigurationUpdatesEngineVersionEffectiveEngineVersion: string;

  /**
   * The workgroup description.
   */
  public description?: string;

  /**
   * The workgroup name.
   */
  public name: string;

  /**
   * The option to delete a workgroup and its contents even if the workgroup contains any named queries.
   */
  public recursiveDeleteOption?: boolean | cdk.IResolvable;

  /**
   * The state of the workgroup: ENABLED or DISABLED.
   */
  public state?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags (key-value pairs) to associate with this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The configuration of the workgroup, which includes the location in Amazon S3 where query results are stored, the encryption option, if any, used for query results, whether Amazon CloudWatch Metrics are enabled for the workgroup, and the limit for the amount of bytes scanned (cutoff) per query, if it is specified.
   */
  public workGroupConfiguration?: cdk.IResolvable | CfnWorkGroup.WorkGroupConfigurationProperty;

  /**
   * The configuration information that will be updated for this workgroup, which includes the location in Amazon S3 where query results are stored, the encryption option, if any, used for query results, whether the Amazon CloudWatch Metrics are enabled for the workgroup, whether the workgroup settings override the client-side settings, and the data usage limit for the amount of bytes scanned per query, if it is specified.
   *
   * @deprecated this property has been deprecated
   */
  public workGroupConfigurationUpdates?: cdk.IResolvable | CfnWorkGroup.WorkGroupConfigurationUpdatesProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnWorkGroupProps) {
    super(scope, id, {
      "type": CfnWorkGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrCreationTime = cdk.Token.asString(this.getAtt("CreationTime", cdk.ResolutionTypeHint.STRING));
    this.attrWorkGroupConfigurationEngineVersionEffectiveEngineVersion = cdk.Token.asString(this.getAtt("WorkGroupConfiguration.EngineVersion.EffectiveEngineVersion", cdk.ResolutionTypeHint.STRING));
    this.attrWorkGroupConfigurationUpdatesEngineVersionEffectiveEngineVersion = cdk.Token.asString(this.getAtt("WorkGroupConfigurationUpdates.EngineVersion.EffectiveEngineVersion", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.name = props.name;
    this.recursiveDeleteOption = props.recursiveDeleteOption;
    this.state = props.state;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Athena::WorkGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.workGroupConfiguration = props.workGroupConfiguration;
    this.workGroupConfigurationUpdates = props.workGroupConfigurationUpdates;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "recursiveDeleteOption": this.recursiveDeleteOption,
      "state": this.state,
      "tags": this.tags.renderTags(),
      "workGroupConfiguration": this.workGroupConfiguration,
      "workGroupConfigurationUpdates": this.workGroupConfigurationUpdates
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnWorkGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnWorkGroupPropsToCloudFormation(props);
  }
}

export namespace CfnWorkGroup {
  /**
   * The configuration of the workgroup, which includes the location in Amazon S3 where query results are stored, the encryption option, if any, used for query results, whether Amazon CloudWatch Metrics are enabled for the workgroup, and the limit for the amount of bytes scanned (cutoff) per query, if it is specified.
   *
   * The `EnforceWorkGroupConfiguration` option determines whether workgroup settings override client-side query settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html
   */
  export interface WorkGroupConfigurationProperty {
    /**
     * Specifies a user defined JSON string that is passed to the session engine.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-additionalconfiguration
     */
    readonly additionalConfiguration?: string;

    /**
     * The upper limit (cutoff) for the amount of bytes a single query in a workgroup is allowed to scan.
     *
     * No default is defined.
     *
     * > This property currently supports integer types. Support for long values is planned.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-bytesscannedcutoffperquery
     */
    readonly bytesScannedCutoffPerQuery?: number;

    /**
     * Specifies the KMS key that is used to encrypt the user's data stores in Athena.
     *
     * This setting does not apply to Athena SQL workgroups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-customercontentencryptionconfiguration
     */
    readonly customerContentEncryptionConfiguration?: CfnWorkGroup.CustomerContentEncryptionConfigurationProperty | cdk.IResolvable;

    /**
     * If set to "true", the settings for the workgroup override client-side settings.
     *
     * If set to "false", client-side settings are used. For more information, see [Workgroup Settings Override Client-Side Settings](https://docs.aws.amazon.com/athena/latest/ug/workgroups-settings-override.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-enforceworkgroupconfiguration
     */
    readonly enforceWorkGroupConfiguration?: boolean | cdk.IResolvable;

    /**
     * The engine version that all queries running on the workgroup use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-engineversion
     */
    readonly engineVersion?: CfnWorkGroup.EngineVersionProperty | cdk.IResolvable;

    /**
     * Role used to access user resources in an Athena for Apache Spark session.
     *
     * This property applies only to Spark-enabled workgroups in Athena.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-executionrole
     */
    readonly executionRole?: string;

    /**
     * Indicates that the Amazon CloudWatch metrics are enabled for the workgroup.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-publishcloudwatchmetricsenabled
     */
    readonly publishCloudWatchMetricsEnabled?: boolean | cdk.IResolvable;

    /**
     * If set to `true` , allows members assigned to a workgroup to reference Amazon S3 Requester Pays buckets in queries.
     *
     * If set to `false` , workgroup members cannot query data from Requester Pays buckets, and queries that retrieve data from Requester Pays buckets cause an error. The default is `false` . For more information about Requester Pays buckets, see [Requester Pays Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/RequesterPaysBuckets.html) in the *Amazon Simple Storage Service Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-requesterpaysenabled
     */
    readonly requesterPaysEnabled?: boolean | cdk.IResolvable;

    /**
     * Specifies the location in Amazon S3 where query results are stored and the encryption option, if any, used for query results.
     *
     * For more information, see [Working with Query Results, Output Files, and Query History](https://docs.aws.amazon.com/athena/latest/ug/querying.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfiguration.html#cfn-athena-workgroup-workgroupconfiguration-resultconfiguration
     */
    readonly resultConfiguration?: cdk.IResolvable | CfnWorkGroup.ResultConfigurationProperty;
  }

  /**
   * The Athena engine version for running queries, or the PySpark engine version for running sessions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-engineversion.html
   */
  export interface EngineVersionProperty {
    /**
     * Read only.
     *
     * The engine version on which the query runs. If the user requests a valid engine version other than Auto, the effective engine version is the same as the engine version that the user requested. If the user requests Auto, the effective engine version is chosen by Athena. When a request to update the engine version is made by a `CreateWorkGroup` or `UpdateWorkGroup` operation, the `EffectiveEngineVersion` field is ignored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-engineversion.html#cfn-athena-workgroup-engineversion-effectiveengineversion
     */
    readonly effectiveEngineVersion?: string;

    /**
     * The engine version requested by the user.
     *
     * Possible values are determined by the output of `ListEngineVersions` , including AUTO. The default is AUTO.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-engineversion.html#cfn-athena-workgroup-engineversion-selectedengineversion
     */
    readonly selectedEngineVersion?: string;
  }

  /**
   * The location in Amazon S3 where query and calculation results are stored and the encryption option, if any, used for query and calculation results.
   *
   * These are known as "client-side settings". If workgroup settings override client-side settings, then the query uses the workgroup settings.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfiguration.html
   */
  export interface ResultConfigurationProperty {
    /**
     * Indicates that an Amazon S3 canned ACL should be set to control ownership of stored query results.
     *
     * Currently the only supported canned ACL is `BUCKET_OWNER_FULL_CONTROL` . This is a client-side setting. If workgroup settings override client-side settings, then the query uses the ACL configuration that is specified for the workgroup, and also uses the location for storing query results specified in the workgroup. See `EnforceWorkGroupConfiguration` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfiguration.html#cfn-athena-workgroup-resultconfiguration-aclconfiguration
     */
    readonly aclConfiguration?: CfnWorkGroup.AclConfigurationProperty | cdk.IResolvable;

    /**
     * If query results are encrypted in Amazon S3, indicates the encryption option used (for example, `SSE_KMS` or `CSE_KMS` ) and key information.
     *
     * This is a client-side setting. If workgroup settings override client-side settings, then the query uses the encryption configuration that is specified for the workgroup, and also uses the location for storing query results specified in the workgroup. See `EnforceWorkGroupConfiguration` and [Workgroup Settings Override Client-Side Settings](https://docs.aws.amazon.com/athena/latest/ug/workgroups-settings-override.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfiguration.html#cfn-athena-workgroup-resultconfiguration-encryptionconfiguration
     */
    readonly encryptionConfiguration?: CfnWorkGroup.EncryptionConfigurationProperty | cdk.IResolvable;

    /**
     * The account ID that you expect to be the owner of the Amazon S3 bucket specified by `ResultConfiguration:OutputLocation` .
     *
     * If set, Athena uses the value for `ExpectedBucketOwner` when it makes Amazon S3 calls to your specified output location. If the `ExpectedBucketOwner` account ID does not match the actual owner of the Amazon S3 bucket, the call fails with a permissions error.
     *
     * This is a client-side setting. If workgroup settings override client-side settings, then the query uses the `ExpectedBucketOwner` setting that is specified for the workgroup, and also uses the location for storing query results specified in the workgroup. See `EnforceWorkGroupConfiguration` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfiguration.html#cfn-athena-workgroup-resultconfiguration-expectedbucketowner
     */
    readonly expectedBucketOwner?: string;

    /**
     * The location in Amazon S3 where your query results are stored, such as `s3://path/to/query/bucket/` .
     *
     * To run a query, you must specify the query results location using either a client-side setting for individual queries or a location specified by the workgroup. If workgroup settings override client-side settings, then the query uses the location specified for the workgroup. If no query location is set, Athena issues an error. For more information, see [Working with Query Results, Output Files, and Query History](https://docs.aws.amazon.com/athena/latest/ug/querying.html) and `EnforceWorkGroupConfiguration` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfiguration.html#cfn-athena-workgroup-resultconfiguration-outputlocation
     */
    readonly outputLocation?: string;
  }

  /**
   * If query results are encrypted in Amazon S3, indicates the encryption option used (for example, `SSE_KMS` or `CSE_KMS` ) and key information.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-encryptionconfiguration.html
   */
  export interface EncryptionConfigurationProperty {
    /**
     * Indicates whether Amazon S3 server-side encryption with Amazon S3-managed keys ( `SSE_S3` ), server-side encryption with KMS-managed keys ( `SSE_KMS` ), or client-side encryption with KMS-managed keys ( `CSE_KMS` ) is used.
     *
     * If a query runs in a workgroup and the workgroup overrides client-side settings, then the workgroup's setting for encryption is used. It specifies whether query results must be encrypted, for all queries that run in this workgroup.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-encryptionconfiguration.html#cfn-athena-workgroup-encryptionconfiguration-encryptionoption
     */
    readonly encryptionOption: string;

    /**
     * For `SSE_KMS` and `CSE_KMS` , this is the KMS key ARN or ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-encryptionconfiguration.html#cfn-athena-workgroup-encryptionconfiguration-kmskey
     */
    readonly kmsKey?: string;
  }

  /**
   * Indicates that an Amazon S3 canned ACL should be set to control ownership of stored query results.
   *
   * When Athena stores query results in Amazon S3, the canned ACL is set with the `x-amz-acl` request header. For more information about S3 Object Ownership, see [Object Ownership settings](https://docs.aws.amazon.com/AmazonS3/latest/userguide/about-object-ownership.html#object-ownership-overview) in the *Amazon S3 User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-aclconfiguration.html
   */
  export interface AclConfigurationProperty {
    /**
     * The Amazon S3 canned ACL that Athena should specify when storing query results.
     *
     * Currently the only supported canned ACL is `BUCKET_OWNER_FULL_CONTROL` . If a query runs in a workgroup and the workgroup overrides client-side settings, then the Amazon S3 canned ACL specified in the workgroup's settings is used for all queries that run in the workgroup. For more information about Amazon S3 canned ACLs, see [Canned ACL](https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#canned-acl) in the *Amazon S3 User Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-aclconfiguration.html#cfn-athena-workgroup-aclconfiguration-s3acloption
     */
    readonly s3AclOption: string;
  }

  /**
   * Specifies the customer managed KMS key that is used to encrypt the user's data stores in Athena.
   *
   * When an AWS managed key is used, this value is null. This setting does not apply to Athena SQL workgroups.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-customercontentencryptionconfiguration.html
   */
  export interface CustomerContentEncryptionConfigurationProperty {
    /**
     * The customer managed KMS key that is used to encrypt the user's data stores in Athena.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-customercontentencryptionconfiguration.html#cfn-athena-workgroup-customercontentencryptionconfiguration-kmskey
     */
    readonly kmsKey: string;
  }

  /**
   * The configuration information that will be updated for this workgroup, which includes the location in Amazon S3 where query results are stored, the encryption option, if any, used for query results, whether the Amazon CloudWatch Metrics are enabled for the workgroup, whether the workgroup settings override the client-side settings, and the data usage limit for the amount of bytes scanned per query, if it is specified.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfigurationupdates.html
   */
  export interface WorkGroupConfigurationUpdatesProperty {
    /**
     * Additional Configuration that are passed to Athena Spark Calculations running in this workgroup.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfigurationupdates.html#cfn-athena-workgroup-workgroupconfigurationupdates-additionalconfiguration
     */
    readonly additionalConfiguration?: string;

    /**
     * The upper data usage limit (cutoff) for the amount of bytes a single query in a workgroup is allowed to scan.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfigurationupdates.html#cfn-athena-workgroup-workgroupconfigurationupdates-bytesscannedcutoffperquery
     */
    readonly bytesScannedCutoffPerQuery?: number;

    /**
     * Indicates the KMS key for encrypting notebook content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfigurationupdates.html#cfn-athena-workgroup-workgroupconfigurationupdates-customercontentencryptionconfiguration
     */
    readonly customerContentEncryptionConfiguration?: CfnWorkGroup.CustomerContentEncryptionConfigurationProperty | cdk.IResolvable;

    /**
     * If set to "true", the settings for the workgroup override client-side settings.
     *
     * If set to "false", client-side settings are used
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfigurationupdates.html#cfn-athena-workgroup-workgroupconfigurationupdates-enforceworkgroupconfiguration
     */
    readonly enforceWorkGroupConfiguration?: boolean | cdk.IResolvable;

    /**
     * The Athena engine version for running queries.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfigurationupdates.html#cfn-athena-workgroup-workgroupconfigurationupdates-engineversion
     */
    readonly engineVersion?: CfnWorkGroup.EngineVersionProperty | cdk.IResolvable;

    /**
     * Execution Role ARN required to run Athena Spark Calculations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfigurationupdates.html#cfn-athena-workgroup-workgroupconfigurationupdates-executionrole
     */
    readonly executionRole?: string;

    /**
     * Indicates that the Amazon CloudWatch metrics are enabled for the workgroup.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfigurationupdates.html#cfn-athena-workgroup-workgroupconfigurationupdates-publishcloudwatchmetricsenabled
     */
    readonly publishCloudWatchMetricsEnabled?: boolean | cdk.IResolvable;

    /**
     * Indicates that the data usage control limit per query is removed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfigurationupdates.html#cfn-athena-workgroup-workgroupconfigurationupdates-removebytesscannedcutoffperquery
     */
    readonly removeBytesScannedCutoffPerQuery?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfigurationupdates.html#cfn-athena-workgroup-workgroupconfigurationupdates-removecustomercontentencryptionconfiguration
     */
    readonly removeCustomerContentEncryptionConfiguration?: boolean | cdk.IResolvable;

    /**
     * If set to true, allows members assigned to a workgroup to reference Amazon S3 Requester Pays buckets in queries.
     *
     * If set to false, workgroup members cannot query data from Requester Pays buckets, and queries that retrieve data from Requester Pays buckets cause an error.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfigurationupdates.html#cfn-athena-workgroup-workgroupconfigurationupdates-requesterpaysenabled
     */
    readonly requesterPaysEnabled?: boolean | cdk.IResolvable;

    /**
     * The result configuration information about the queries in this workgroup that will be updated.
     *
     * Includes the updated results location and an updated option for encrypting query results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-workgroupconfigurationupdates.html#cfn-athena-workgroup-workgroupconfigurationupdates-resultconfigurationupdates
     */
    readonly resultConfigurationUpdates?: cdk.IResolvable | CfnWorkGroup.ResultConfigurationUpdatesProperty;
  }

  /**
   * The information about the updates in the query results, such as output location and encryption configuration for the query results.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfigurationupdates.html
   */
  export interface ResultConfigurationUpdatesProperty {
    /**
     * The ACL configuration for the query results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfigurationupdates.html#cfn-athena-workgroup-resultconfigurationupdates-aclconfiguration
     */
    readonly aclConfiguration?: CfnWorkGroup.AclConfigurationProperty | cdk.IResolvable;

    /**
     * The encryption configuration for the query results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfigurationupdates.html#cfn-athena-workgroup-resultconfigurationupdates-encryptionconfiguration
     */
    readonly encryptionConfiguration?: CfnWorkGroup.EncryptionConfigurationProperty | cdk.IResolvable;

    /**
     * The AWS account ID that you expect to be the owner of the Amazon S3 bucket specified by `ResultConfiguration$OutputLocation` .
     *
     * If set, Athena uses the value for `ExpectedBucketOwner` when it makes Amazon S3 calls to your specified output location. If the `ExpectedBucketOwner` AWS account ID does not match the actual owner of the Amazon S3 bucket, the call fails with a permissions error.
     *
     * If workgroup settings override client-side settings, then the query uses the `ExpectedBucketOwner` setting that is specified for the workgroup, and also uses the location for storing query results specified in the workgroup. See `WorkGroupConfiguration$EnforceWorkGroupConfiguration` and [Workgroup Settings Override Client-Side Settings](https://docs.aws.amazon.com/athena/latest/ug/workgroups-settings-override.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfigurationupdates.html#cfn-athena-workgroup-resultconfigurationupdates-expectedbucketowner
     */
    readonly expectedBucketOwner?: string;

    /**
     * The location in Amazon S3 where your query results are stored, such as `s3://path/to/query/bucket/` .
     *
     * For more information, see [Query Results](https://docs.aws.amazon.com/athena/latest/ug/querying.html) If workgroup settings override client-side settings, then the query uses the location for the query results and the encryption configuration that are specified for the workgroup. The "workgroup settings override" is specified in EnforceWorkGroupConfiguration (true/false) in the WorkGroupConfiguration. See `EnforceWorkGroupConfiguration` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfigurationupdates.html#cfn-athena-workgroup-resultconfigurationupdates-outputlocation
     */
    readonly outputLocation?: string;

    /**
     * If set to `true` , indicates that the previously-specified ACL configuration for queries in this workgroup should be ignored and set to null.
     *
     * If set to `false` or not set, and a value is present in the `AclConfiguration` of `ResultConfigurationUpdates` , the `AclConfiguration` in the workgroup's `ResultConfiguration` is updated with the new value. For more information, see [Workgroup Settings Override Client-Side Settings](https://docs.aws.amazon.com/athena/latest/ug/workgroups-settings-override.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfigurationupdates.html#cfn-athena-workgroup-resultconfigurationupdates-removeaclconfiguration
     */
    readonly removeAclConfiguration?: boolean | cdk.IResolvable;

    /**
     * If set to "true", indicates that the previously-specified encryption configuration (also known as the client-side setting) for queries in this workgroup should be ignored and set to null.
     *
     * If set to "false" or not set, and a value is present in the EncryptionConfiguration in ResultConfigurationUpdates (the client-side setting), the EncryptionConfiguration in the workgroup's ResultConfiguration will be updated with the new value. For more information, see [Workgroup Settings Override Client-Side Settings](https://docs.aws.amazon.com/athena/latest/ug/workgroups-settings-override.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfigurationupdates.html#cfn-athena-workgroup-resultconfigurationupdates-removeencryptionconfiguration
     */
    readonly removeEncryptionConfiguration?: boolean | cdk.IResolvable;

    /**
     * If set to "true", removes the AWS account ID previously specified for `ResultConfiguration$ExpectedBucketOwner` .
     *
     * If set to "false" or not set, and a value is present in the `ExpectedBucketOwner` in `ResultConfigurationUpdates` (the client-side setting), the `ExpectedBucketOwner` in the workgroup's `ResultConfiguration` is updated with the new value. For more information, see [Workgroup Settings Override Client-Side Settings](https://docs.aws.amazon.com/athena/latest/ug/workgroups-settings-override.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfigurationupdates.html#cfn-athena-workgroup-resultconfigurationupdates-removeexpectedbucketowner
     */
    readonly removeExpectedBucketOwner?: boolean | cdk.IResolvable;

    /**
     * If set to "true", indicates that the previously-specified query results location (also known as a client-side setting) for queries in this workgroup should be ignored and set to null.
     *
     * If set to "false" or not set, and a value is present in the OutputLocation in ResultConfigurationUpdates (the client-side setting), the OutputLocation in the workgroup's ResultConfiguration will be updated with the new value. For more information, see [Workgroup Settings Override Client-Side Settings](https://docs.aws.amazon.com/athena/latest/ug/workgroups-settings-override.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-athena-workgroup-resultconfigurationupdates.html#cfn-athena-workgroup-resultconfigurationupdates-removeoutputlocation
     */
    readonly removeOutputLocation?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnWorkGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html
 */
export interface CfnWorkGroupProps {
  /**
   * The workgroup description.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-description
   */
  readonly description?: string;

  /**
   * The workgroup name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-name
   */
  readonly name: string;

  /**
   * The option to delete a workgroup and its contents even if the workgroup contains any named queries.
   *
   * The default is false.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-recursivedeleteoption
   */
  readonly recursiveDeleteOption?: boolean | cdk.IResolvable;

  /**
   * The state of the workgroup: ENABLED or DISABLED.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-state
   */
  readonly state?: string;

  /**
   * The tags (key-value pairs) to associate with this resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The configuration of the workgroup, which includes the location in Amazon S3 where query results are stored, the encryption option, if any, used for query results, whether Amazon CloudWatch Metrics are enabled for the workgroup, and the limit for the amount of bytes scanned (cutoff) per query, if it is specified.
   *
   * The `EnforceWorkGroupConfiguration` option determines whether workgroup settings override client-side query settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-workgroupconfiguration
   */
  readonly workGroupConfiguration?: cdk.IResolvable | CfnWorkGroup.WorkGroupConfigurationProperty;

  /**
   * The configuration information that will be updated for this workgroup, which includes the location in Amazon S3 where query results are stored, the encryption option, if any, used for query results, whether the Amazon CloudWatch Metrics are enabled for the workgroup, whether the workgroup settings override the client-side settings, and the data usage limit for the amount of bytes scanned per query, if it is specified.
   *
   * @deprecated this property has been deprecated
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html#cfn-athena-workgroup-workgroupconfigurationupdates
   */
  readonly workGroupConfigurationUpdates?: cdk.IResolvable | CfnWorkGroup.WorkGroupConfigurationUpdatesProperty;
}

/**
 * Determine whether the given properties match those of a `EngineVersionProperty`
 *
 * @param properties - the TypeScript properties of a `EngineVersionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkGroupEngineVersionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("effectiveEngineVersion", cdk.validateString)(properties.effectiveEngineVersion));
  errors.collect(cdk.propertyValidator("selectedEngineVersion", cdk.validateString)(properties.selectedEngineVersion));
  return errors.wrap("supplied properties not correct for \"EngineVersionProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkGroupEngineVersionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkGroupEngineVersionPropertyValidator(properties).assertSuccess();
  return {
    "EffectiveEngineVersion": cdk.stringToCloudFormation(properties.effectiveEngineVersion),
    "SelectedEngineVersion": cdk.stringToCloudFormation(properties.selectedEngineVersion)
  };
}

// @ts-ignore TS6133
function CfnWorkGroupEngineVersionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkGroup.EngineVersionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkGroup.EngineVersionProperty>();
  ret.addPropertyResult("effectiveEngineVersion", "EffectiveEngineVersion", (properties.EffectiveEngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.EffectiveEngineVersion) : undefined));
  ret.addPropertyResult("selectedEngineVersion", "SelectedEngineVersion", (properties.SelectedEngineVersion != null ? cfn_parse.FromCloudFormation.getString(properties.SelectedEngineVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkGroupEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryptionOption", cdk.requiredValidator)(properties.encryptionOption));
  errors.collect(cdk.propertyValidator("encryptionOption", cdk.validateString)(properties.encryptionOption));
  errors.collect(cdk.propertyValidator("kmsKey", cdk.validateString)(properties.kmsKey));
  return errors.wrap("supplied properties not correct for \"EncryptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkGroupEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkGroupEncryptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EncryptionOption": cdk.stringToCloudFormation(properties.encryptionOption),
    "KmsKey": cdk.stringToCloudFormation(properties.kmsKey)
  };
}

// @ts-ignore TS6133
function CfnWorkGroupEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkGroup.EncryptionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkGroup.EncryptionConfigurationProperty>();
  ret.addPropertyResult("encryptionOption", "EncryptionOption", (properties.EncryptionOption != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionOption) : undefined));
  ret.addPropertyResult("kmsKey", "KmsKey", (properties.KmsKey != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AclConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AclConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkGroupAclConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3AclOption", cdk.requiredValidator)(properties.s3AclOption));
  errors.collect(cdk.propertyValidator("s3AclOption", cdk.validateString)(properties.s3AclOption));
  return errors.wrap("supplied properties not correct for \"AclConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkGroupAclConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkGroupAclConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "S3AclOption": cdk.stringToCloudFormation(properties.s3AclOption)
  };
}

// @ts-ignore TS6133
function CfnWorkGroupAclConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkGroup.AclConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkGroup.AclConfigurationProperty>();
  ret.addPropertyResult("s3AclOption", "S3AclOption", (properties.S3AclOption != null ? cfn_parse.FromCloudFormation.getString(properties.S3AclOption) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResultConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ResultConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkGroupResultConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aclConfiguration", CfnWorkGroupAclConfigurationPropertyValidator)(properties.aclConfiguration));
  errors.collect(cdk.propertyValidator("encryptionConfiguration", CfnWorkGroupEncryptionConfigurationPropertyValidator)(properties.encryptionConfiguration));
  errors.collect(cdk.propertyValidator("expectedBucketOwner", cdk.validateString)(properties.expectedBucketOwner));
  errors.collect(cdk.propertyValidator("outputLocation", cdk.validateString)(properties.outputLocation));
  return errors.wrap("supplied properties not correct for \"ResultConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkGroupResultConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkGroupResultConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AclConfiguration": convertCfnWorkGroupAclConfigurationPropertyToCloudFormation(properties.aclConfiguration),
    "EncryptionConfiguration": convertCfnWorkGroupEncryptionConfigurationPropertyToCloudFormation(properties.encryptionConfiguration),
    "ExpectedBucketOwner": cdk.stringToCloudFormation(properties.expectedBucketOwner),
    "OutputLocation": cdk.stringToCloudFormation(properties.outputLocation)
  };
}

// @ts-ignore TS6133
function CfnWorkGroupResultConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkGroup.ResultConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkGroup.ResultConfigurationProperty>();
  ret.addPropertyResult("aclConfiguration", "AclConfiguration", (properties.AclConfiguration != null ? CfnWorkGroupAclConfigurationPropertyFromCloudFormation(properties.AclConfiguration) : undefined));
  ret.addPropertyResult("encryptionConfiguration", "EncryptionConfiguration", (properties.EncryptionConfiguration != null ? CfnWorkGroupEncryptionConfigurationPropertyFromCloudFormation(properties.EncryptionConfiguration) : undefined));
  ret.addPropertyResult("expectedBucketOwner", "ExpectedBucketOwner", (properties.ExpectedBucketOwner != null ? cfn_parse.FromCloudFormation.getString(properties.ExpectedBucketOwner) : undefined));
  ret.addPropertyResult("outputLocation", "OutputLocation", (properties.OutputLocation != null ? cfn_parse.FromCloudFormation.getString(properties.OutputLocation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomerContentEncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CustomerContentEncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkGroupCustomerContentEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKey", cdk.requiredValidator)(properties.kmsKey));
  errors.collect(cdk.propertyValidator("kmsKey", cdk.validateString)(properties.kmsKey));
  return errors.wrap("supplied properties not correct for \"CustomerContentEncryptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkGroupCustomerContentEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkGroupCustomerContentEncryptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "KmsKey": cdk.stringToCloudFormation(properties.kmsKey)
  };
}

// @ts-ignore TS6133
function CfnWorkGroupCustomerContentEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkGroup.CustomerContentEncryptionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkGroup.CustomerContentEncryptionConfigurationProperty>();
  ret.addPropertyResult("kmsKey", "KmsKey", (properties.KmsKey != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkGroupConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WorkGroupConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkGroupWorkGroupConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalConfiguration", cdk.validateString)(properties.additionalConfiguration));
  errors.collect(cdk.propertyValidator("bytesScannedCutoffPerQuery", cdk.validateNumber)(properties.bytesScannedCutoffPerQuery));
  errors.collect(cdk.propertyValidator("customerContentEncryptionConfiguration", CfnWorkGroupCustomerContentEncryptionConfigurationPropertyValidator)(properties.customerContentEncryptionConfiguration));
  errors.collect(cdk.propertyValidator("enforceWorkGroupConfiguration", cdk.validateBoolean)(properties.enforceWorkGroupConfiguration));
  errors.collect(cdk.propertyValidator("engineVersion", CfnWorkGroupEngineVersionPropertyValidator)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("executionRole", cdk.validateString)(properties.executionRole));
  errors.collect(cdk.propertyValidator("publishCloudWatchMetricsEnabled", cdk.validateBoolean)(properties.publishCloudWatchMetricsEnabled));
  errors.collect(cdk.propertyValidator("requesterPaysEnabled", cdk.validateBoolean)(properties.requesterPaysEnabled));
  errors.collect(cdk.propertyValidator("resultConfiguration", CfnWorkGroupResultConfigurationPropertyValidator)(properties.resultConfiguration));
  return errors.wrap("supplied properties not correct for \"WorkGroupConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkGroupWorkGroupConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkGroupWorkGroupConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AdditionalConfiguration": cdk.stringToCloudFormation(properties.additionalConfiguration),
    "BytesScannedCutoffPerQuery": cdk.numberToCloudFormation(properties.bytesScannedCutoffPerQuery),
    "CustomerContentEncryptionConfiguration": convertCfnWorkGroupCustomerContentEncryptionConfigurationPropertyToCloudFormation(properties.customerContentEncryptionConfiguration),
    "EnforceWorkGroupConfiguration": cdk.booleanToCloudFormation(properties.enforceWorkGroupConfiguration),
    "EngineVersion": convertCfnWorkGroupEngineVersionPropertyToCloudFormation(properties.engineVersion),
    "ExecutionRole": cdk.stringToCloudFormation(properties.executionRole),
    "PublishCloudWatchMetricsEnabled": cdk.booleanToCloudFormation(properties.publishCloudWatchMetricsEnabled),
    "RequesterPaysEnabled": cdk.booleanToCloudFormation(properties.requesterPaysEnabled),
    "ResultConfiguration": convertCfnWorkGroupResultConfigurationPropertyToCloudFormation(properties.resultConfiguration)
  };
}

// @ts-ignore TS6133
function CfnWorkGroupWorkGroupConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkGroup.WorkGroupConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkGroup.WorkGroupConfigurationProperty>();
  ret.addPropertyResult("additionalConfiguration", "AdditionalConfiguration", (properties.AdditionalConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.AdditionalConfiguration) : undefined));
  ret.addPropertyResult("bytesScannedCutoffPerQuery", "BytesScannedCutoffPerQuery", (properties.BytesScannedCutoffPerQuery != null ? cfn_parse.FromCloudFormation.getNumber(properties.BytesScannedCutoffPerQuery) : undefined));
  ret.addPropertyResult("customerContentEncryptionConfiguration", "CustomerContentEncryptionConfiguration", (properties.CustomerContentEncryptionConfiguration != null ? CfnWorkGroupCustomerContentEncryptionConfigurationPropertyFromCloudFormation(properties.CustomerContentEncryptionConfiguration) : undefined));
  ret.addPropertyResult("enforceWorkGroupConfiguration", "EnforceWorkGroupConfiguration", (properties.EnforceWorkGroupConfiguration != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnforceWorkGroupConfiguration) : undefined));
  ret.addPropertyResult("engineVersion", "EngineVersion", (properties.EngineVersion != null ? CfnWorkGroupEngineVersionPropertyFromCloudFormation(properties.EngineVersion) : undefined));
  ret.addPropertyResult("executionRole", "ExecutionRole", (properties.ExecutionRole != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRole) : undefined));
  ret.addPropertyResult("publishCloudWatchMetricsEnabled", "PublishCloudWatchMetricsEnabled", (properties.PublishCloudWatchMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PublishCloudWatchMetricsEnabled) : undefined));
  ret.addPropertyResult("requesterPaysEnabled", "RequesterPaysEnabled", (properties.RequesterPaysEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequesterPaysEnabled) : undefined));
  ret.addPropertyResult("resultConfiguration", "ResultConfiguration", (properties.ResultConfiguration != null ? CfnWorkGroupResultConfigurationPropertyFromCloudFormation(properties.ResultConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResultConfigurationUpdatesProperty`
 *
 * @param properties - the TypeScript properties of a `ResultConfigurationUpdatesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkGroupResultConfigurationUpdatesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aclConfiguration", CfnWorkGroupAclConfigurationPropertyValidator)(properties.aclConfiguration));
  errors.collect(cdk.propertyValidator("encryptionConfiguration", CfnWorkGroupEncryptionConfigurationPropertyValidator)(properties.encryptionConfiguration));
  errors.collect(cdk.propertyValidator("expectedBucketOwner", cdk.validateString)(properties.expectedBucketOwner));
  errors.collect(cdk.propertyValidator("outputLocation", cdk.validateString)(properties.outputLocation));
  errors.collect(cdk.propertyValidator("removeAclConfiguration", cdk.validateBoolean)(properties.removeAclConfiguration));
  errors.collect(cdk.propertyValidator("removeEncryptionConfiguration", cdk.validateBoolean)(properties.removeEncryptionConfiguration));
  errors.collect(cdk.propertyValidator("removeExpectedBucketOwner", cdk.validateBoolean)(properties.removeExpectedBucketOwner));
  errors.collect(cdk.propertyValidator("removeOutputLocation", cdk.validateBoolean)(properties.removeOutputLocation));
  return errors.wrap("supplied properties not correct for \"ResultConfigurationUpdatesProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkGroupResultConfigurationUpdatesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkGroupResultConfigurationUpdatesPropertyValidator(properties).assertSuccess();
  return {
    "AclConfiguration": convertCfnWorkGroupAclConfigurationPropertyToCloudFormation(properties.aclConfiguration),
    "EncryptionConfiguration": convertCfnWorkGroupEncryptionConfigurationPropertyToCloudFormation(properties.encryptionConfiguration),
    "ExpectedBucketOwner": cdk.stringToCloudFormation(properties.expectedBucketOwner),
    "OutputLocation": cdk.stringToCloudFormation(properties.outputLocation),
    "RemoveAclConfiguration": cdk.booleanToCloudFormation(properties.removeAclConfiguration),
    "RemoveEncryptionConfiguration": cdk.booleanToCloudFormation(properties.removeEncryptionConfiguration),
    "RemoveExpectedBucketOwner": cdk.booleanToCloudFormation(properties.removeExpectedBucketOwner),
    "RemoveOutputLocation": cdk.booleanToCloudFormation(properties.removeOutputLocation)
  };
}

// @ts-ignore TS6133
function CfnWorkGroupResultConfigurationUpdatesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkGroup.ResultConfigurationUpdatesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkGroup.ResultConfigurationUpdatesProperty>();
  ret.addPropertyResult("aclConfiguration", "AclConfiguration", (properties.AclConfiguration != null ? CfnWorkGroupAclConfigurationPropertyFromCloudFormation(properties.AclConfiguration) : undefined));
  ret.addPropertyResult("encryptionConfiguration", "EncryptionConfiguration", (properties.EncryptionConfiguration != null ? CfnWorkGroupEncryptionConfigurationPropertyFromCloudFormation(properties.EncryptionConfiguration) : undefined));
  ret.addPropertyResult("expectedBucketOwner", "ExpectedBucketOwner", (properties.ExpectedBucketOwner != null ? cfn_parse.FromCloudFormation.getString(properties.ExpectedBucketOwner) : undefined));
  ret.addPropertyResult("outputLocation", "OutputLocation", (properties.OutputLocation != null ? cfn_parse.FromCloudFormation.getString(properties.OutputLocation) : undefined));
  ret.addPropertyResult("removeAclConfiguration", "RemoveAclConfiguration", (properties.RemoveAclConfiguration != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RemoveAclConfiguration) : undefined));
  ret.addPropertyResult("removeEncryptionConfiguration", "RemoveEncryptionConfiguration", (properties.RemoveEncryptionConfiguration != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RemoveEncryptionConfiguration) : undefined));
  ret.addPropertyResult("removeExpectedBucketOwner", "RemoveExpectedBucketOwner", (properties.RemoveExpectedBucketOwner != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RemoveExpectedBucketOwner) : undefined));
  ret.addPropertyResult("removeOutputLocation", "RemoveOutputLocation", (properties.RemoveOutputLocation != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RemoveOutputLocation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkGroupConfigurationUpdatesProperty`
 *
 * @param properties - the TypeScript properties of a `WorkGroupConfigurationUpdatesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkGroupWorkGroupConfigurationUpdatesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalConfiguration", cdk.validateString)(properties.additionalConfiguration));
  errors.collect(cdk.propertyValidator("bytesScannedCutoffPerQuery", cdk.validateNumber)(properties.bytesScannedCutoffPerQuery));
  errors.collect(cdk.propertyValidator("customerContentEncryptionConfiguration", CfnWorkGroupCustomerContentEncryptionConfigurationPropertyValidator)(properties.customerContentEncryptionConfiguration));
  errors.collect(cdk.propertyValidator("enforceWorkGroupConfiguration", cdk.validateBoolean)(properties.enforceWorkGroupConfiguration));
  errors.collect(cdk.propertyValidator("engineVersion", CfnWorkGroupEngineVersionPropertyValidator)(properties.engineVersion));
  errors.collect(cdk.propertyValidator("executionRole", cdk.validateString)(properties.executionRole));
  errors.collect(cdk.propertyValidator("publishCloudWatchMetricsEnabled", cdk.validateBoolean)(properties.publishCloudWatchMetricsEnabled));
  errors.collect(cdk.propertyValidator("removeBytesScannedCutoffPerQuery", cdk.validateBoolean)(properties.removeBytesScannedCutoffPerQuery));
  errors.collect(cdk.propertyValidator("removeCustomerContentEncryptionConfiguration", cdk.validateBoolean)(properties.removeCustomerContentEncryptionConfiguration));
  errors.collect(cdk.propertyValidator("requesterPaysEnabled", cdk.validateBoolean)(properties.requesterPaysEnabled));
  errors.collect(cdk.propertyValidator("resultConfigurationUpdates", CfnWorkGroupResultConfigurationUpdatesPropertyValidator)(properties.resultConfigurationUpdates));
  return errors.wrap("supplied properties not correct for \"WorkGroupConfigurationUpdatesProperty\"");
}

// @ts-ignore TS6133
function convertCfnWorkGroupWorkGroupConfigurationUpdatesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkGroupWorkGroupConfigurationUpdatesPropertyValidator(properties).assertSuccess();
  return {
    "AdditionalConfiguration": cdk.stringToCloudFormation(properties.additionalConfiguration),
    "BytesScannedCutoffPerQuery": cdk.numberToCloudFormation(properties.bytesScannedCutoffPerQuery),
    "CustomerContentEncryptionConfiguration": convertCfnWorkGroupCustomerContentEncryptionConfigurationPropertyToCloudFormation(properties.customerContentEncryptionConfiguration),
    "EnforceWorkGroupConfiguration": cdk.booleanToCloudFormation(properties.enforceWorkGroupConfiguration),
    "EngineVersion": convertCfnWorkGroupEngineVersionPropertyToCloudFormation(properties.engineVersion),
    "ExecutionRole": cdk.stringToCloudFormation(properties.executionRole),
    "PublishCloudWatchMetricsEnabled": cdk.booleanToCloudFormation(properties.publishCloudWatchMetricsEnabled),
    "RemoveBytesScannedCutoffPerQuery": cdk.booleanToCloudFormation(properties.removeBytesScannedCutoffPerQuery),
    "RemoveCustomerContentEncryptionConfiguration": cdk.booleanToCloudFormation(properties.removeCustomerContentEncryptionConfiguration),
    "RequesterPaysEnabled": cdk.booleanToCloudFormation(properties.requesterPaysEnabled),
    "ResultConfigurationUpdates": convertCfnWorkGroupResultConfigurationUpdatesPropertyToCloudFormation(properties.resultConfigurationUpdates)
  };
}

// @ts-ignore TS6133
function CfnWorkGroupWorkGroupConfigurationUpdatesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnWorkGroup.WorkGroupConfigurationUpdatesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkGroup.WorkGroupConfigurationUpdatesProperty>();
  ret.addPropertyResult("additionalConfiguration", "AdditionalConfiguration", (properties.AdditionalConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.AdditionalConfiguration) : undefined));
  ret.addPropertyResult("bytesScannedCutoffPerQuery", "BytesScannedCutoffPerQuery", (properties.BytesScannedCutoffPerQuery != null ? cfn_parse.FromCloudFormation.getNumber(properties.BytesScannedCutoffPerQuery) : undefined));
  ret.addPropertyResult("customerContentEncryptionConfiguration", "CustomerContentEncryptionConfiguration", (properties.CustomerContentEncryptionConfiguration != null ? CfnWorkGroupCustomerContentEncryptionConfigurationPropertyFromCloudFormation(properties.CustomerContentEncryptionConfiguration) : undefined));
  ret.addPropertyResult("enforceWorkGroupConfiguration", "EnforceWorkGroupConfiguration", (properties.EnforceWorkGroupConfiguration != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnforceWorkGroupConfiguration) : undefined));
  ret.addPropertyResult("engineVersion", "EngineVersion", (properties.EngineVersion != null ? CfnWorkGroupEngineVersionPropertyFromCloudFormation(properties.EngineVersion) : undefined));
  ret.addPropertyResult("executionRole", "ExecutionRole", (properties.ExecutionRole != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRole) : undefined));
  ret.addPropertyResult("publishCloudWatchMetricsEnabled", "PublishCloudWatchMetricsEnabled", (properties.PublishCloudWatchMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PublishCloudWatchMetricsEnabled) : undefined));
  ret.addPropertyResult("removeBytesScannedCutoffPerQuery", "RemoveBytesScannedCutoffPerQuery", (properties.RemoveBytesScannedCutoffPerQuery != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RemoveBytesScannedCutoffPerQuery) : undefined));
  ret.addPropertyResult("removeCustomerContentEncryptionConfiguration", "RemoveCustomerContentEncryptionConfiguration", (properties.RemoveCustomerContentEncryptionConfiguration != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RemoveCustomerContentEncryptionConfiguration) : undefined));
  ret.addPropertyResult("requesterPaysEnabled", "RequesterPaysEnabled", (properties.RequesterPaysEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RequesterPaysEnabled) : undefined));
  ret.addPropertyResult("resultConfigurationUpdates", "ResultConfigurationUpdates", (properties.ResultConfigurationUpdates != null ? CfnWorkGroupResultConfigurationUpdatesPropertyFromCloudFormation(properties.ResultConfigurationUpdates) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnWorkGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnWorkGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnWorkGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("recursiveDeleteOption", cdk.validateBoolean)(properties.recursiveDeleteOption));
  errors.collect(cdk.propertyValidator("state", cdk.validateString)(properties.state));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("workGroupConfiguration", CfnWorkGroupWorkGroupConfigurationPropertyValidator)(properties.workGroupConfiguration));
  errors.collect(cdk.propertyValidator("workGroupConfigurationUpdates", CfnWorkGroupWorkGroupConfigurationUpdatesPropertyValidator)(properties.workGroupConfigurationUpdates));
  return errors.wrap("supplied properties not correct for \"CfnWorkGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnWorkGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnWorkGroupPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RecursiveDeleteOption": cdk.booleanToCloudFormation(properties.recursiveDeleteOption),
    "State": cdk.stringToCloudFormation(properties.state),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "WorkGroupConfiguration": convertCfnWorkGroupWorkGroupConfigurationPropertyToCloudFormation(properties.workGroupConfiguration),
    "WorkGroupConfigurationUpdates": convertCfnWorkGroupWorkGroupConfigurationUpdatesPropertyToCloudFormation(properties.workGroupConfigurationUpdates)
  };
}

// @ts-ignore TS6133
function CfnWorkGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnWorkGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnWorkGroupProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("recursiveDeleteOption", "RecursiveDeleteOption", (properties.RecursiveDeleteOption != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RecursiveDeleteOption) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? cfn_parse.FromCloudFormation.getString(properties.State) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("workGroupConfiguration", "WorkGroupConfiguration", (properties.WorkGroupConfiguration != null ? CfnWorkGroupWorkGroupConfigurationPropertyFromCloudFormation(properties.WorkGroupConfiguration) : undefined));
  ret.addPropertyResult("workGroupConfigurationUpdates", "WorkGroupConfigurationUpdates", (properties.WorkGroupConfigurationUpdates != null ? CfnWorkGroupWorkGroupConfigurationUpdatesPropertyFromCloudFormation(properties.WorkGroupConfigurationUpdates) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}