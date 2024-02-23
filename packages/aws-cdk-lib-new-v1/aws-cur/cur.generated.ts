/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The definition of AWS Cost and Usage Report.
 *
 * You can specify the report name, time unit, report format, compression format, S3 bucket, additional artifacts, and schema elements in the definition.
 *
 * @cloudformationResource AWS::CUR::ReportDefinition
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html
 */
export class CfnReportDefinition extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CUR::ReportDefinition";

  /**
   * Build a CfnReportDefinition from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReportDefinition {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnReportDefinitionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnReportDefinition(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A list of manifests that you want AWS to create for this report.
   */
  public additionalArtifacts?: Array<string>;

  /**
   * A list of strings that indicate additional content that AWS includes in the report, such as individual resource IDs.
   */
  public additionalSchemaElements?: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the billing view.
   */
  public billingViewArn?: string;

  /**
   * The compression format that Amazon Web Services uses for the report.
   */
  public compression: string;

  /**
   * The format that Amazon Web Services saves the report in.
   */
  public format: string;

  /**
   * Whether you want AWS to update your reports after they have been finalized if AWS detects charges related to previous months.
   */
  public refreshClosedReports: boolean | cdk.IResolvable;

  /**
   * The name of the report that you want to create.
   */
  public reportName: string;

  /**
   * Whether you want AWS to overwrite the previous version of each report or to deliver the report in addition to the previous versions.
   */
  public reportVersioning: string;

  /**
   * The S3 bucket where Amazon Web Services delivers the report.
   */
  public s3Bucket: string;

  /**
   * The prefix that Amazon Web Services adds to the report name when Amazon Web Services delivers the report.
   */
  public s3Prefix: string;

  /**
   * The Region of the S3 bucket that Amazon Web Services delivers the report into.
   */
  public s3Region: string;

  /**
   * The granularity of the line items in the report.
   */
  public timeUnit: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnReportDefinitionProps) {
    super(scope, id, {
      "type": CfnReportDefinition.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "compression", this);
    cdk.requireProperty(props, "format", this);
    cdk.requireProperty(props, "refreshClosedReports", this);
    cdk.requireProperty(props, "reportName", this);
    cdk.requireProperty(props, "reportVersioning", this);
    cdk.requireProperty(props, "s3Bucket", this);
    cdk.requireProperty(props, "s3Prefix", this);
    cdk.requireProperty(props, "s3Region", this);
    cdk.requireProperty(props, "timeUnit", this);

    this.additionalArtifacts = props.additionalArtifacts;
    this.additionalSchemaElements = props.additionalSchemaElements;
    this.billingViewArn = props.billingViewArn;
    this.compression = props.compression;
    this.format = props.format;
    this.refreshClosedReports = props.refreshClosedReports;
    this.reportName = props.reportName;
    this.reportVersioning = props.reportVersioning;
    this.s3Bucket = props.s3Bucket;
    this.s3Prefix = props.s3Prefix;
    this.s3Region = props.s3Region;
    this.timeUnit = props.timeUnit;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "additionalArtifacts": this.additionalArtifacts,
      "additionalSchemaElements": this.additionalSchemaElements,
      "billingViewArn": this.billingViewArn,
      "compression": this.compression,
      "format": this.format,
      "refreshClosedReports": this.refreshClosedReports,
      "reportName": this.reportName,
      "reportVersioning": this.reportVersioning,
      "s3Bucket": this.s3Bucket,
      "s3Prefix": this.s3Prefix,
      "s3Region": this.s3Region,
      "timeUnit": this.timeUnit
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnReportDefinition.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnReportDefinitionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnReportDefinition`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html
 */
export interface CfnReportDefinitionProps {
  /**
   * A list of manifests that you want AWS to create for this report.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-additionalartifacts
   */
  readonly additionalArtifacts?: Array<string>;

  /**
   * A list of strings that indicate additional content that AWS includes in the report, such as individual resource IDs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-additionalschemaelements
   */
  readonly additionalSchemaElements?: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the billing view.
   *
   * You can get this value by using the billing view service public APIs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-billingviewarn
   */
  readonly billingViewArn?: string;

  /**
   * The compression format that Amazon Web Services uses for the report.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-compression
   */
  readonly compression: string;

  /**
   * The format that Amazon Web Services saves the report in.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-format
   */
  readonly format: string;

  /**
   * Whether you want AWS to update your reports after they have been finalized if AWS detects charges related to previous months.
   *
   * These charges can include refunds, credits, or support fees.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-refreshclosedreports
   */
  readonly refreshClosedReports: boolean | cdk.IResolvable;

  /**
   * The name of the report that you want to create.
   *
   * The name must be unique, is case sensitive, and can't include spaces.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-reportname
   */
  readonly reportName: string;

  /**
   * Whether you want AWS to overwrite the previous version of each report or to deliver the report in addition to the previous versions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-reportversioning
   */
  readonly reportVersioning: string;

  /**
   * The S3 bucket where Amazon Web Services delivers the report.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-s3bucket
   */
  readonly s3Bucket: string;

  /**
   * The prefix that Amazon Web Services adds to the report name when Amazon Web Services delivers the report.
   *
   * Your prefix can't include spaces.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-s3prefix
   */
  readonly s3Prefix: string;

  /**
   * The Region of the S3 bucket that Amazon Web Services delivers the report into.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-s3region
   */
  readonly s3Region: string;

  /**
   * The granularity of the line items in the report.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cur-reportdefinition.html#cfn-cur-reportdefinition-timeunit
   */
  readonly timeUnit: string;
}

/**
 * Determine whether the given properties match those of a `CfnReportDefinitionProps`
 *
 * @param properties - the TypeScript properties of a `CfnReportDefinitionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReportDefinitionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("additionalArtifacts", cdk.listValidator(cdk.validateString))(properties.additionalArtifacts));
  errors.collect(cdk.propertyValidator("additionalSchemaElements", cdk.listValidator(cdk.validateString))(properties.additionalSchemaElements));
  errors.collect(cdk.propertyValidator("billingViewArn", cdk.validateString)(properties.billingViewArn));
  errors.collect(cdk.propertyValidator("compression", cdk.requiredValidator)(properties.compression));
  errors.collect(cdk.propertyValidator("compression", cdk.validateString)(properties.compression));
  errors.collect(cdk.propertyValidator("format", cdk.requiredValidator)(properties.format));
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  errors.collect(cdk.propertyValidator("refreshClosedReports", cdk.requiredValidator)(properties.refreshClosedReports));
  errors.collect(cdk.propertyValidator("refreshClosedReports", cdk.validateBoolean)(properties.refreshClosedReports));
  errors.collect(cdk.propertyValidator("reportName", cdk.requiredValidator)(properties.reportName));
  errors.collect(cdk.propertyValidator("reportName", cdk.validateString)(properties.reportName));
  errors.collect(cdk.propertyValidator("reportVersioning", cdk.requiredValidator)(properties.reportVersioning));
  errors.collect(cdk.propertyValidator("reportVersioning", cdk.validateString)(properties.reportVersioning));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.requiredValidator)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.validateString)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Prefix", cdk.requiredValidator)(properties.s3Prefix));
  errors.collect(cdk.propertyValidator("s3Prefix", cdk.validateString)(properties.s3Prefix));
  errors.collect(cdk.propertyValidator("s3Region", cdk.requiredValidator)(properties.s3Region));
  errors.collect(cdk.propertyValidator("s3Region", cdk.validateString)(properties.s3Region));
  errors.collect(cdk.propertyValidator("timeUnit", cdk.requiredValidator)(properties.timeUnit));
  errors.collect(cdk.propertyValidator("timeUnit", cdk.validateString)(properties.timeUnit));
  return errors.wrap("supplied properties not correct for \"CfnReportDefinitionProps\"");
}

// @ts-ignore TS6133
function convertCfnReportDefinitionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReportDefinitionPropsValidator(properties).assertSuccess();
  return {
    "AdditionalArtifacts": cdk.listMapper(cdk.stringToCloudFormation)(properties.additionalArtifacts),
    "AdditionalSchemaElements": cdk.listMapper(cdk.stringToCloudFormation)(properties.additionalSchemaElements),
    "BillingViewArn": cdk.stringToCloudFormation(properties.billingViewArn),
    "Compression": cdk.stringToCloudFormation(properties.compression),
    "Format": cdk.stringToCloudFormation(properties.format),
    "RefreshClosedReports": cdk.booleanToCloudFormation(properties.refreshClosedReports),
    "ReportName": cdk.stringToCloudFormation(properties.reportName),
    "ReportVersioning": cdk.stringToCloudFormation(properties.reportVersioning),
    "S3Bucket": cdk.stringToCloudFormation(properties.s3Bucket),
    "S3Prefix": cdk.stringToCloudFormation(properties.s3Prefix),
    "S3Region": cdk.stringToCloudFormation(properties.s3Region),
    "TimeUnit": cdk.stringToCloudFormation(properties.timeUnit)
  };
}

// @ts-ignore TS6133
function CfnReportDefinitionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReportDefinitionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReportDefinitionProps>();
  ret.addPropertyResult("additionalArtifacts", "AdditionalArtifacts", (properties.AdditionalArtifacts != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AdditionalArtifacts) : undefined));
  ret.addPropertyResult("additionalSchemaElements", "AdditionalSchemaElements", (properties.AdditionalSchemaElements != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AdditionalSchemaElements) : undefined));
  ret.addPropertyResult("billingViewArn", "BillingViewArn", (properties.BillingViewArn != null ? cfn_parse.FromCloudFormation.getString(properties.BillingViewArn) : undefined));
  ret.addPropertyResult("compression", "Compression", (properties.Compression != null ? cfn_parse.FromCloudFormation.getString(properties.Compression) : undefined));
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addPropertyResult("refreshClosedReports", "RefreshClosedReports", (properties.RefreshClosedReports != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RefreshClosedReports) : undefined));
  ret.addPropertyResult("reportName", "ReportName", (properties.ReportName != null ? cfn_parse.FromCloudFormation.getString(properties.ReportName) : undefined));
  ret.addPropertyResult("reportVersioning", "ReportVersioning", (properties.ReportVersioning != null ? cfn_parse.FromCloudFormation.getString(properties.ReportVersioning) : undefined));
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.S3Bucket) : undefined));
  ret.addPropertyResult("s3Prefix", "S3Prefix", (properties.S3Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3Prefix) : undefined));
  ret.addPropertyResult("s3Region", "S3Region", (properties.S3Region != null ? cfn_parse.FromCloudFormation.getString(properties.S3Region) : undefined));
  ret.addPropertyResult("timeUnit", "TimeUnit", (properties.TimeUnit != null ? cfn_parse.FromCloudFormation.getString(properties.TimeUnit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}