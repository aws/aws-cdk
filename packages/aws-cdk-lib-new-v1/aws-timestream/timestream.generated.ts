/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a new Timestream database.
 *
 * If the AWS KMS key is not specified, the database will be encrypted with a Timestream managed AWS KMS key located in your account. Refer to [AWS managed AWS KMS keys](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#aws-managed-cmk) for more info. [Service quotas apply](https://docs.aws.amazon.com/timestream/latest/developerguide/ts-limits.html) . See [code sample](https://docs.aws.amazon.com/timestream/latest/developerguide/code-samples.create-db.html) for details.
 *
 * @cloudformationResource AWS::Timestream::Database
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html
 */
export class CfnDatabase extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Timestream::Database";

  /**
   * Build a CfnDatabase from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDatabase {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDatabasePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDatabase(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The `arn` of the database.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the Timestream database.
   */
  public databaseName?: string;

  /**
   * The identifier of the AWS KMS key used to encrypt the data stored in the database.
   */
  public kmsKeyId?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to add to the database.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDatabaseProps = {}) {
    super(scope, id, {
      "type": CfnDatabase.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.databaseName = props.databaseName;
    this.kmsKeyId = props.kmsKeyId;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Timestream::Database", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "databaseName": this.databaseName,
      "kmsKeyId": this.kmsKeyId,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDatabase.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDatabasePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDatabase`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html
 */
export interface CfnDatabaseProps {
  /**
   * The name of the Timestream database.
   *
   * *Length Constraints* : Minimum length of 3 bytes. Maximum length of 256 bytes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html#cfn-timestream-database-databasename
   */
  readonly databaseName?: string;

  /**
   * The identifier of the AWS KMS key used to encrypt the data stored in the database.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html#cfn-timestream-database-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * The tags to add to the database.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-database.html#cfn-timestream-database-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnDatabaseProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatabaseProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatabasePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDatabaseProps\"");
}

// @ts-ignore TS6133
function convertCfnDatabasePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatabasePropsValidator(properties).assertSuccess();
  return {
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDatabasePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatabaseProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatabaseProps>();
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Create a scheduled query that will be run on your behalf at the configured schedule.
 *
 * Timestream assumes the execution role provided as part of the `ScheduledQueryExecutionRoleArn` parameter to run the query. You can use the `NotificationConfiguration` parameter to configure notification for your scheduled query operations.
 *
 * @cloudformationResource AWS::Timestream::ScheduledQuery
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html
 */
export class CfnScheduledQuery extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Timestream::ScheduledQuery";

  /**
   * Build a CfnScheduledQuery from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnScheduledQuery {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnScheduledQueryPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnScheduledQuery(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The `ARN` of the scheduled query.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The scheduled query error reporting configuration.
   *
   * @cloudformationAttribute SQErrorReportConfiguration
   */
  public readonly attrSqErrorReportConfiguration: string;

  /**
   * The KMS key used to encrypt the query resource, if a customer managed KMS key was provided.
   *
   * @cloudformationAttribute SQKmsKeyId
   */
  public readonly attrSqKmsKeyId: string;

  /**
   * The scheduled query name.
   *
   * @cloudformationAttribute SQName
   */
  public readonly attrSqName: string;

  /**
   * The scheduled query notification configuration.
   *
   * @cloudformationAttribute SQNotificationConfiguration
   */
  public readonly attrSqNotificationConfiguration: string;

  /**
   * The scheduled query string..
   *
   * @cloudformationAttribute SQQueryString
   */
  public readonly attrSqQueryString: string;

  /**
   * The scheduled query schedule configuration.
   *
   * @cloudformationAttribute SQScheduleConfiguration
   */
  public readonly attrSqScheduleConfiguration: string;

  /**
   * The ARN of the IAM role that will be used by Timestream to run the query.
   *
   * @cloudformationAttribute SQScheduledQueryExecutionRoleArn
   */
  public readonly attrSqScheduledQueryExecutionRoleArn: string;

  /**
   * The configuration for query output.
   *
   * @cloudformationAttribute SQTargetConfiguration
   */
  public readonly attrSqTargetConfiguration: string;

  /**
   * Using a ClientToken makes the call to CreateScheduledQuery idempotent, in other words, making the same request repeatedly will produce the same result.
   */
  public clientToken?: string;

  /**
   * Configuration for error reporting.
   */
  public errorReportConfiguration: CfnScheduledQuery.ErrorReportConfigurationProperty | cdk.IResolvable;

  /**
   * The Amazon KMS key used to encrypt the scheduled query resource, at-rest.
   */
  public kmsKeyId?: string;

  /**
   * Notification configuration for the scheduled query.
   */
  public notificationConfiguration: cdk.IResolvable | CfnScheduledQuery.NotificationConfigurationProperty;

  /**
   * The query string to run.
   */
  public queryString: string;

  /**
   * Schedule configuration.
   */
  public scheduleConfiguration: cdk.IResolvable | CfnScheduledQuery.ScheduleConfigurationProperty;

  /**
   * The ARN for the IAM role that Timestream will assume when running the scheduled query.
   */
  public scheduledQueryExecutionRoleArn: string;

  /**
   * A name for the query.
   */
  public scheduledQueryName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of key-value pairs to label the scheduled query.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Scheduled query target store configuration.
   */
  public targetConfiguration?: cdk.IResolvable | CfnScheduledQuery.TargetConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnScheduledQueryProps) {
    super(scope, id, {
      "type": CfnScheduledQuery.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "errorReportConfiguration", this);
    cdk.requireProperty(props, "notificationConfiguration", this);
    cdk.requireProperty(props, "queryString", this);
    cdk.requireProperty(props, "scheduleConfiguration", this);
    cdk.requireProperty(props, "scheduledQueryExecutionRoleArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrSqErrorReportConfiguration = cdk.Token.asString(this.getAtt("SQErrorReportConfiguration", cdk.ResolutionTypeHint.STRING));
    this.attrSqKmsKeyId = cdk.Token.asString(this.getAtt("SQKmsKeyId", cdk.ResolutionTypeHint.STRING));
    this.attrSqName = cdk.Token.asString(this.getAtt("SQName", cdk.ResolutionTypeHint.STRING));
    this.attrSqNotificationConfiguration = cdk.Token.asString(this.getAtt("SQNotificationConfiguration", cdk.ResolutionTypeHint.STRING));
    this.attrSqQueryString = cdk.Token.asString(this.getAtt("SQQueryString", cdk.ResolutionTypeHint.STRING));
    this.attrSqScheduleConfiguration = cdk.Token.asString(this.getAtt("SQScheduleConfiguration", cdk.ResolutionTypeHint.STRING));
    this.attrSqScheduledQueryExecutionRoleArn = cdk.Token.asString(this.getAtt("SQScheduledQueryExecutionRoleArn", cdk.ResolutionTypeHint.STRING));
    this.attrSqTargetConfiguration = cdk.Token.asString(this.getAtt("SQTargetConfiguration", cdk.ResolutionTypeHint.STRING));
    this.clientToken = props.clientToken;
    this.errorReportConfiguration = props.errorReportConfiguration;
    this.kmsKeyId = props.kmsKeyId;
    this.notificationConfiguration = props.notificationConfiguration;
    this.queryString = props.queryString;
    this.scheduleConfiguration = props.scheduleConfiguration;
    this.scheduledQueryExecutionRoleArn = props.scheduledQueryExecutionRoleArn;
    this.scheduledQueryName = props.scheduledQueryName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Timestream::ScheduledQuery", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targetConfiguration = props.targetConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "clientToken": this.clientToken,
      "errorReportConfiguration": this.errorReportConfiguration,
      "kmsKeyId": this.kmsKeyId,
      "notificationConfiguration": this.notificationConfiguration,
      "queryString": this.queryString,
      "scheduleConfiguration": this.scheduleConfiguration,
      "scheduledQueryExecutionRoleArn": this.scheduledQueryExecutionRoleArn,
      "scheduledQueryName": this.scheduledQueryName,
      "tags": this.tags.renderTags(),
      "targetConfiguration": this.targetConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnScheduledQuery.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnScheduledQueryPropsToCloudFormation(props);
  }
}

export namespace CfnScheduledQuery {
  /**
   * Configuration required for error reporting.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-errorreportconfiguration.html
   */
  export interface ErrorReportConfigurationProperty {
    /**
     * The S3 configuration for the error reports.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-errorreportconfiguration.html#cfn-timestream-scheduledquery-errorreportconfiguration-s3configuration
     */
    readonly s3Configuration: cdk.IResolvable | CfnScheduledQuery.S3ConfigurationProperty;
  }

  /**
   * Details on S3 location for error reports that result from running a query.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-s3configuration.html
   */
  export interface S3ConfigurationProperty {
    /**
     * Name of the S3 bucket under which error reports will be created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-s3configuration.html#cfn-timestream-scheduledquery-s3configuration-bucketname
     */
    readonly bucketName: string;

    /**
     * Encryption at rest options for the error reports.
     *
     * If no encryption option is specified, Timestream will choose SSE_S3 as default.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-s3configuration.html#cfn-timestream-scheduledquery-s3configuration-encryptionoption
     */
    readonly encryptionOption?: string;

    /**
     * Prefix for the error report key.
     *
     * Timestream by default adds the following prefix to the error report path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-s3configuration.html#cfn-timestream-scheduledquery-s3configuration-objectkeyprefix
     */
    readonly objectKeyPrefix?: string;
  }

  /**
   * Configuration of the schedule of the query.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-scheduleconfiguration.html
   */
  export interface ScheduleConfigurationProperty {
    /**
     * An expression that denotes when to trigger the scheduled query run.
     *
     * This can be a cron expression or a rate expression.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-scheduleconfiguration.html#cfn-timestream-scheduledquery-scheduleconfiguration-scheduleexpression
     */
    readonly scheduleExpression: string;
  }

  /**
   * Configuration used for writing the output of a query.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-targetconfiguration.html
   */
  export interface TargetConfigurationProperty {
    /**
     * Configuration needed to write data into the Timestream database and table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-targetconfiguration.html#cfn-timestream-scheduledquery-targetconfiguration-timestreamconfiguration
     */
    readonly timestreamConfiguration: cdk.IResolvable | CfnScheduledQuery.TimestreamConfigurationProperty;
  }

  /**
   * Configuration to write data into Timestream database and table.
   *
   * This configuration allows the user to map the query result select columns into the destination table columns.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html
   */
  export interface TimestreamConfigurationProperty {
    /**
     * Name of Timestream database to which the query result will be written.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html#cfn-timestream-scheduledquery-timestreamconfiguration-databasename
     */
    readonly databaseName: string;

    /**
     * This is to allow mapping column(s) from the query result to the dimension in the destination table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html#cfn-timestream-scheduledquery-timestreamconfiguration-dimensionmappings
     */
    readonly dimensionMappings: Array<CfnScheduledQuery.DimensionMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Name of the measure column.
     *
     * Also see `MultiMeasureMappings` and `MixedMeasureMappings` for how measure name properties on those relate to `MeasureNameColumn` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html#cfn-timestream-scheduledquery-timestreamconfiguration-measurenamecolumn
     */
    readonly measureNameColumn?: string;

    /**
     * Specifies how to map measures to multi-measure records.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html#cfn-timestream-scheduledquery-timestreamconfiguration-mixedmeasuremappings
     */
    readonly mixedMeasureMappings?: Array<cdk.IResolvable | CfnScheduledQuery.MixedMeasureMappingProperty> | cdk.IResolvable;

    /**
     * Multi-measure mappings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html#cfn-timestream-scheduledquery-timestreamconfiguration-multimeasuremappings
     */
    readonly multiMeasureMappings?: cdk.IResolvable | CfnScheduledQuery.MultiMeasureMappingsProperty;

    /**
     * Name of Timestream table that the query result will be written to.
     *
     * The table should be within the same database that is provided in Timestream configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html#cfn-timestream-scheduledquery-timestreamconfiguration-tablename
     */
    readonly tableName: string;

    /**
     * Column from query result that should be used as the time column in destination table.
     *
     * Column type for this should be TIMESTAMP.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-timestreamconfiguration.html#cfn-timestream-scheduledquery-timestreamconfiguration-timecolumn
     */
    readonly timeColumn: string;
  }

  /**
   * This type is used to map column(s) from the query result to a dimension in the destination table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-dimensionmapping.html
   */
  export interface DimensionMappingProperty {
    /**
     * Type for the dimension: VARCHAR.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-dimensionmapping.html#cfn-timestream-scheduledquery-dimensionmapping-dimensionvaluetype
     */
    readonly dimensionValueType: string;

    /**
     * Column name from query result.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-dimensionmapping.html#cfn-timestream-scheduledquery-dimensionmapping-name
     */
    readonly name: string;
  }

  /**
   * MixedMeasureMappings are mappings that can be used to ingest data into a mixture of narrow and multi measures in the derived table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-mixedmeasuremapping.html
   */
  export interface MixedMeasureMappingProperty {
    /**
     * Refers to the value of measure_name in a result row.
     *
     * This field is required if MeasureNameColumn is provided.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-mixedmeasuremapping.html#cfn-timestream-scheduledquery-mixedmeasuremapping-measurename
     */
    readonly measureName?: string;

    /**
     * Type of the value that is to be read from sourceColumn.
     *
     * If the mapping is for MULTI, use MeasureValueType.MULTI.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-mixedmeasuremapping.html#cfn-timestream-scheduledquery-mixedmeasuremapping-measurevaluetype
     */
    readonly measureValueType: string;

    /**
     * Required when measureValueType is MULTI.
     *
     * Attribute mappings for MULTI value measures.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-mixedmeasuremapping.html#cfn-timestream-scheduledquery-mixedmeasuremapping-multimeasureattributemappings
     */
    readonly multiMeasureAttributeMappings?: Array<cdk.IResolvable | CfnScheduledQuery.MultiMeasureAttributeMappingProperty> | cdk.IResolvable;

    /**
     * This field refers to the source column from which measure-value is to be read for result materialization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-mixedmeasuremapping.html#cfn-timestream-scheduledquery-mixedmeasuremapping-sourcecolumn
     */
    readonly sourceColumn?: string;

    /**
     * Target measure name to be used.
     *
     * If not provided, the target measure name by default would be measure-name if provided, or sourceColumn otherwise.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-mixedmeasuremapping.html#cfn-timestream-scheduledquery-mixedmeasuremapping-targetmeasurename
     */
    readonly targetMeasureName?: string;
  }

  /**
   * Attribute mapping for MULTI value measures.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasureattributemapping.html
   */
  export interface MultiMeasureAttributeMappingProperty {
    /**
     * Type of the attribute to be read from the source column.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasureattributemapping.html#cfn-timestream-scheduledquery-multimeasureattributemapping-measurevaluetype
     */
    readonly measureValueType: string;

    /**
     * Source column from where the attribute value is to be read.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasureattributemapping.html#cfn-timestream-scheduledquery-multimeasureattributemapping-sourcecolumn
     */
    readonly sourceColumn: string;

    /**
     * Custom name to be used for attribute name in derived table.
     *
     * If not provided, source column name would be used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasureattributemapping.html#cfn-timestream-scheduledquery-multimeasureattributemapping-targetmultimeasureattributename
     */
    readonly targetMultiMeasureAttributeName?: string;
  }

  /**
   * Only one of MixedMeasureMappings or MultiMeasureMappings is to be provided.
   *
   * MultiMeasureMappings can be used to ingest data as multi measures in the derived table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasuremappings.html
   */
  export interface MultiMeasureMappingsProperty {
    /**
     * Required.
     *
     * Attribute mappings to be used for mapping query results to ingest data for multi-measure attributes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasuremappings.html#cfn-timestream-scheduledquery-multimeasuremappings-multimeasureattributemappings
     */
    readonly multiMeasureAttributeMappings: Array<cdk.IResolvable | CfnScheduledQuery.MultiMeasureAttributeMappingProperty> | cdk.IResolvable;

    /**
     * The name of the target multi-measure name in the derived table.
     *
     * This input is required when measureNameColumn is not provided. If MeasureNameColumn is provided, then value from that column will be used as multi-measure name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-multimeasuremappings.html#cfn-timestream-scheduledquery-multimeasuremappings-targetmultimeasurename
     */
    readonly targetMultiMeasureName?: string;
  }

  /**
   * Notification configuration for a scheduled query.
   *
   * A notification is sent by Timestream when a scheduled query is created, its state is updated or when it is deleted.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-notificationconfiguration.html
   */
  export interface NotificationConfigurationProperty {
    /**
     * Details on SNS configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-notificationconfiguration.html#cfn-timestream-scheduledquery-notificationconfiguration-snsconfiguration
     */
    readonly snsConfiguration: cdk.IResolvable | CfnScheduledQuery.SnsConfigurationProperty;
  }

  /**
   * Details on SNS that are required to send the notification.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-snsconfiguration.html
   */
  export interface SnsConfigurationProperty {
    /**
     * SNS topic ARN that the scheduled query status notifications will be sent to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-scheduledquery-snsconfiguration.html#cfn-timestream-scheduledquery-snsconfiguration-topicarn
     */
    readonly topicArn: string;
  }
}

/**
 * Properties for defining a `CfnScheduledQuery`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html
 */
export interface CfnScheduledQueryProps {
  /**
   * Using a ClientToken makes the call to CreateScheduledQuery idempotent, in other words, making the same request repeatedly will produce the same result.
   *
   * Making multiple identical CreateScheduledQuery requests has the same effect as making a single request.
   *
   * - If CreateScheduledQuery is called without a `ClientToken` , the Query SDK generates a `ClientToken` on your behalf.
   * - After 8 hours, any request with the same `ClientToken` is treated as a new request.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-clienttoken
   */
  readonly clientToken?: string;

  /**
   * Configuration for error reporting.
   *
   * Error reports will be generated when a problem is encountered when writing the query results.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-errorreportconfiguration
   */
  readonly errorReportConfiguration: CfnScheduledQuery.ErrorReportConfigurationProperty | cdk.IResolvable;

  /**
   * The Amazon KMS key used to encrypt the scheduled query resource, at-rest.
   *
   * If the Amazon KMS key is not specified, the scheduled query resource will be encrypted with a Timestream owned Amazon KMS key. To specify a KMS key, use the key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix the name with *alias/*
   *
   * If ErrorReportConfiguration uses `SSE_KMS` as encryption type, the same KmsKeyId is used to encrypt the error report at rest.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * Notification configuration for the scheduled query.
   *
   * A notification is sent by Timestream when a query run finishes, when the state is updated or when you delete it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-notificationconfiguration
   */
  readonly notificationConfiguration: cdk.IResolvable | CfnScheduledQuery.NotificationConfigurationProperty;

  /**
   * The query string to run.
   *
   * Parameter names can be specified in the query string `@` character followed by an identifier. The named Parameter `@scheduled_runtime` is reserved and can be used in the query to get the time at which the query is scheduled to run.
   *
   * The timestamp calculated according to the ScheduleConfiguration parameter, will be the value of `@scheduled_runtime` paramater for each query run. For example, consider an instance of a scheduled query executing on 2021-12-01 00:00:00. For this instance, the `@scheduled_runtime` parameter is initialized to the timestamp 2021-12-01 00:00:00 when invoking the query.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-querystring
   */
  readonly queryString: string;

  /**
   * Schedule configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-scheduleconfiguration
   */
  readonly scheduleConfiguration: cdk.IResolvable | CfnScheduledQuery.ScheduleConfigurationProperty;

  /**
   * The ARN for the IAM role that Timestream will assume when running the scheduled query.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-scheduledqueryexecutionrolearn
   */
  readonly scheduledQueryExecutionRoleArn: string;

  /**
   * A name for the query.
   *
   * Scheduled query names must be unique within each Region.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-scheduledqueryname
   */
  readonly scheduledQueryName?: string;

  /**
   * A list of key-value pairs to label the scheduled query.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Scheduled query target store configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-scheduledquery.html#cfn-timestream-scheduledquery-targetconfiguration
   */
  readonly targetConfiguration?: cdk.IResolvable | CfnScheduledQuery.TargetConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `S3ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `S3ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledQueryS3ConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("encryptionOption", cdk.validateString)(properties.encryptionOption));
  errors.collect(cdk.propertyValidator("objectKeyPrefix", cdk.validateString)(properties.objectKeyPrefix));
  return errors.wrap("supplied properties not correct for \"S3ConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledQueryS3ConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledQueryS3ConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "EncryptionOption": cdk.stringToCloudFormation(properties.encryptionOption),
    "ObjectKeyPrefix": cdk.stringToCloudFormation(properties.objectKeyPrefix)
  };
}

// @ts-ignore TS6133
function CfnScheduledQueryS3ConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScheduledQuery.S3ConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.S3ConfigurationProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("encryptionOption", "EncryptionOption", (properties.EncryptionOption != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionOption) : undefined));
  ret.addPropertyResult("objectKeyPrefix", "ObjectKeyPrefix", (properties.ObjectKeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectKeyPrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ErrorReportConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ErrorReportConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledQueryErrorReportConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Configuration", cdk.requiredValidator)(properties.s3Configuration));
  errors.collect(cdk.propertyValidator("s3Configuration", CfnScheduledQueryS3ConfigurationPropertyValidator)(properties.s3Configuration));
  return errors.wrap("supplied properties not correct for \"ErrorReportConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledQueryErrorReportConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledQueryErrorReportConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "S3Configuration": convertCfnScheduledQueryS3ConfigurationPropertyToCloudFormation(properties.s3Configuration)
  };
}

// @ts-ignore TS6133
function CfnScheduledQueryErrorReportConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQuery.ErrorReportConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.ErrorReportConfigurationProperty>();
  ret.addPropertyResult("s3Configuration", "S3Configuration", (properties.S3Configuration != null ? CfnScheduledQueryS3ConfigurationPropertyFromCloudFormation(properties.S3Configuration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScheduleConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledQueryScheduleConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.requiredValidator)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.validateString)(properties.scheduleExpression));
  return errors.wrap("supplied properties not correct for \"ScheduleConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledQueryScheduleConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledQueryScheduleConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ScheduleExpression": cdk.stringToCloudFormation(properties.scheduleExpression)
  };
}

// @ts-ignore TS6133
function CfnScheduledQueryScheduleConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScheduledQuery.ScheduleConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.ScheduleConfigurationProperty>();
  ret.addPropertyResult("scheduleExpression", "ScheduleExpression", (properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DimensionMappingProperty`
 *
 * @param properties - the TypeScript properties of a `DimensionMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledQueryDimensionMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensionValueType", cdk.requiredValidator)(properties.dimensionValueType));
  errors.collect(cdk.propertyValidator("dimensionValueType", cdk.validateString)(properties.dimensionValueType));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"DimensionMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledQueryDimensionMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledQueryDimensionMappingPropertyValidator(properties).assertSuccess();
  return {
    "DimensionValueType": cdk.stringToCloudFormation(properties.dimensionValueType),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnScheduledQueryDimensionMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQuery.DimensionMappingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.DimensionMappingProperty>();
  ret.addPropertyResult("dimensionValueType", "DimensionValueType", (properties.DimensionValueType != null ? cfn_parse.FromCloudFormation.getString(properties.DimensionValueType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MultiMeasureAttributeMappingProperty`
 *
 * @param properties - the TypeScript properties of a `MultiMeasureAttributeMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledQueryMultiMeasureAttributeMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("measureValueType", cdk.requiredValidator)(properties.measureValueType));
  errors.collect(cdk.propertyValidator("measureValueType", cdk.validateString)(properties.measureValueType));
  errors.collect(cdk.propertyValidator("sourceColumn", cdk.requiredValidator)(properties.sourceColumn));
  errors.collect(cdk.propertyValidator("sourceColumn", cdk.validateString)(properties.sourceColumn));
  errors.collect(cdk.propertyValidator("targetMultiMeasureAttributeName", cdk.validateString)(properties.targetMultiMeasureAttributeName));
  return errors.wrap("supplied properties not correct for \"MultiMeasureAttributeMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledQueryMultiMeasureAttributeMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledQueryMultiMeasureAttributeMappingPropertyValidator(properties).assertSuccess();
  return {
    "MeasureValueType": cdk.stringToCloudFormation(properties.measureValueType),
    "SourceColumn": cdk.stringToCloudFormation(properties.sourceColumn),
    "TargetMultiMeasureAttributeName": cdk.stringToCloudFormation(properties.targetMultiMeasureAttributeName)
  };
}

// @ts-ignore TS6133
function CfnScheduledQueryMultiMeasureAttributeMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScheduledQuery.MultiMeasureAttributeMappingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.MultiMeasureAttributeMappingProperty>();
  ret.addPropertyResult("measureValueType", "MeasureValueType", (properties.MeasureValueType != null ? cfn_parse.FromCloudFormation.getString(properties.MeasureValueType) : undefined));
  ret.addPropertyResult("sourceColumn", "SourceColumn", (properties.SourceColumn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceColumn) : undefined));
  ret.addPropertyResult("targetMultiMeasureAttributeName", "TargetMultiMeasureAttributeName", (properties.TargetMultiMeasureAttributeName != null ? cfn_parse.FromCloudFormation.getString(properties.TargetMultiMeasureAttributeName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MixedMeasureMappingProperty`
 *
 * @param properties - the TypeScript properties of a `MixedMeasureMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledQueryMixedMeasureMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("measureName", cdk.validateString)(properties.measureName));
  errors.collect(cdk.propertyValidator("measureValueType", cdk.requiredValidator)(properties.measureValueType));
  errors.collect(cdk.propertyValidator("measureValueType", cdk.validateString)(properties.measureValueType));
  errors.collect(cdk.propertyValidator("multiMeasureAttributeMappings", cdk.listValidator(CfnScheduledQueryMultiMeasureAttributeMappingPropertyValidator))(properties.multiMeasureAttributeMappings));
  errors.collect(cdk.propertyValidator("sourceColumn", cdk.validateString)(properties.sourceColumn));
  errors.collect(cdk.propertyValidator("targetMeasureName", cdk.validateString)(properties.targetMeasureName));
  return errors.wrap("supplied properties not correct for \"MixedMeasureMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledQueryMixedMeasureMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledQueryMixedMeasureMappingPropertyValidator(properties).assertSuccess();
  return {
    "MeasureName": cdk.stringToCloudFormation(properties.measureName),
    "MeasureValueType": cdk.stringToCloudFormation(properties.measureValueType),
    "MultiMeasureAttributeMappings": cdk.listMapper(convertCfnScheduledQueryMultiMeasureAttributeMappingPropertyToCloudFormation)(properties.multiMeasureAttributeMappings),
    "SourceColumn": cdk.stringToCloudFormation(properties.sourceColumn),
    "TargetMeasureName": cdk.stringToCloudFormation(properties.targetMeasureName)
  };
}

// @ts-ignore TS6133
function CfnScheduledQueryMixedMeasureMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScheduledQuery.MixedMeasureMappingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.MixedMeasureMappingProperty>();
  ret.addPropertyResult("measureName", "MeasureName", (properties.MeasureName != null ? cfn_parse.FromCloudFormation.getString(properties.MeasureName) : undefined));
  ret.addPropertyResult("measureValueType", "MeasureValueType", (properties.MeasureValueType != null ? cfn_parse.FromCloudFormation.getString(properties.MeasureValueType) : undefined));
  ret.addPropertyResult("multiMeasureAttributeMappings", "MultiMeasureAttributeMappings", (properties.MultiMeasureAttributeMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnScheduledQueryMultiMeasureAttributeMappingPropertyFromCloudFormation)(properties.MultiMeasureAttributeMappings) : undefined));
  ret.addPropertyResult("sourceColumn", "SourceColumn", (properties.SourceColumn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceColumn) : undefined));
  ret.addPropertyResult("targetMeasureName", "TargetMeasureName", (properties.TargetMeasureName != null ? cfn_parse.FromCloudFormation.getString(properties.TargetMeasureName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MultiMeasureMappingsProperty`
 *
 * @param properties - the TypeScript properties of a `MultiMeasureMappingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledQueryMultiMeasureMappingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("multiMeasureAttributeMappings", cdk.requiredValidator)(properties.multiMeasureAttributeMappings));
  errors.collect(cdk.propertyValidator("multiMeasureAttributeMappings", cdk.listValidator(CfnScheduledQueryMultiMeasureAttributeMappingPropertyValidator))(properties.multiMeasureAttributeMappings));
  errors.collect(cdk.propertyValidator("targetMultiMeasureName", cdk.validateString)(properties.targetMultiMeasureName));
  return errors.wrap("supplied properties not correct for \"MultiMeasureMappingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledQueryMultiMeasureMappingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledQueryMultiMeasureMappingsPropertyValidator(properties).assertSuccess();
  return {
    "MultiMeasureAttributeMappings": cdk.listMapper(convertCfnScheduledQueryMultiMeasureAttributeMappingPropertyToCloudFormation)(properties.multiMeasureAttributeMappings),
    "TargetMultiMeasureName": cdk.stringToCloudFormation(properties.targetMultiMeasureName)
  };
}

// @ts-ignore TS6133
function CfnScheduledQueryMultiMeasureMappingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScheduledQuery.MultiMeasureMappingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.MultiMeasureMappingsProperty>();
  ret.addPropertyResult("multiMeasureAttributeMappings", "MultiMeasureAttributeMappings", (properties.MultiMeasureAttributeMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnScheduledQueryMultiMeasureAttributeMappingPropertyFromCloudFormation)(properties.MultiMeasureAttributeMappings) : undefined));
  ret.addPropertyResult("targetMultiMeasureName", "TargetMultiMeasureName", (properties.TargetMultiMeasureName != null ? cfn_parse.FromCloudFormation.getString(properties.TargetMultiMeasureName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TimestreamConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TimestreamConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledQueryTimestreamConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("dimensionMappings", cdk.requiredValidator)(properties.dimensionMappings));
  errors.collect(cdk.propertyValidator("dimensionMappings", cdk.listValidator(CfnScheduledQueryDimensionMappingPropertyValidator))(properties.dimensionMappings));
  errors.collect(cdk.propertyValidator("measureNameColumn", cdk.validateString)(properties.measureNameColumn));
  errors.collect(cdk.propertyValidator("mixedMeasureMappings", cdk.listValidator(CfnScheduledQueryMixedMeasureMappingPropertyValidator))(properties.mixedMeasureMappings));
  errors.collect(cdk.propertyValidator("multiMeasureMappings", CfnScheduledQueryMultiMeasureMappingsPropertyValidator)(properties.multiMeasureMappings));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  errors.collect(cdk.propertyValidator("timeColumn", cdk.requiredValidator)(properties.timeColumn));
  errors.collect(cdk.propertyValidator("timeColumn", cdk.validateString)(properties.timeColumn));
  return errors.wrap("supplied properties not correct for \"TimestreamConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledQueryTimestreamConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledQueryTimestreamConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "DimensionMappings": cdk.listMapper(convertCfnScheduledQueryDimensionMappingPropertyToCloudFormation)(properties.dimensionMappings),
    "MeasureNameColumn": cdk.stringToCloudFormation(properties.measureNameColumn),
    "MixedMeasureMappings": cdk.listMapper(convertCfnScheduledQueryMixedMeasureMappingPropertyToCloudFormation)(properties.mixedMeasureMappings),
    "MultiMeasureMappings": convertCfnScheduledQueryMultiMeasureMappingsPropertyToCloudFormation(properties.multiMeasureMappings),
    "TableName": cdk.stringToCloudFormation(properties.tableName),
    "TimeColumn": cdk.stringToCloudFormation(properties.timeColumn)
  };
}

// @ts-ignore TS6133
function CfnScheduledQueryTimestreamConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScheduledQuery.TimestreamConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.TimestreamConfigurationProperty>();
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("dimensionMappings", "DimensionMappings", (properties.DimensionMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnScheduledQueryDimensionMappingPropertyFromCloudFormation)(properties.DimensionMappings) : undefined));
  ret.addPropertyResult("measureNameColumn", "MeasureNameColumn", (properties.MeasureNameColumn != null ? cfn_parse.FromCloudFormation.getString(properties.MeasureNameColumn) : undefined));
  ret.addPropertyResult("mixedMeasureMappings", "MixedMeasureMappings", (properties.MixedMeasureMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnScheduledQueryMixedMeasureMappingPropertyFromCloudFormation)(properties.MixedMeasureMappings) : undefined));
  ret.addPropertyResult("multiMeasureMappings", "MultiMeasureMappings", (properties.MultiMeasureMappings != null ? CfnScheduledQueryMultiMeasureMappingsPropertyFromCloudFormation(properties.MultiMeasureMappings) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addPropertyResult("timeColumn", "TimeColumn", (properties.TimeColumn != null ? cfn_parse.FromCloudFormation.getString(properties.TimeColumn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TargetConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledQueryTargetConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("timestreamConfiguration", cdk.requiredValidator)(properties.timestreamConfiguration));
  errors.collect(cdk.propertyValidator("timestreamConfiguration", CfnScheduledQueryTimestreamConfigurationPropertyValidator)(properties.timestreamConfiguration));
  return errors.wrap("supplied properties not correct for \"TargetConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledQueryTargetConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledQueryTargetConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "TimestreamConfiguration": convertCfnScheduledQueryTimestreamConfigurationPropertyToCloudFormation(properties.timestreamConfiguration)
  };
}

// @ts-ignore TS6133
function CfnScheduledQueryTargetConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScheduledQuery.TargetConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.TargetConfigurationProperty>();
  ret.addPropertyResult("timestreamConfiguration", "TimestreamConfiguration", (properties.TimestreamConfiguration != null ? CfnScheduledQueryTimestreamConfigurationPropertyFromCloudFormation(properties.TimestreamConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SnsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SnsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledQuerySnsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("topicArn", cdk.requiredValidator)(properties.topicArn));
  errors.collect(cdk.propertyValidator("topicArn", cdk.validateString)(properties.topicArn));
  return errors.wrap("supplied properties not correct for \"SnsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledQuerySnsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledQuerySnsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "TopicArn": cdk.stringToCloudFormation(properties.topicArn)
  };
}

// @ts-ignore TS6133
function CfnScheduledQuerySnsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScheduledQuery.SnsConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.SnsConfigurationProperty>();
  ret.addPropertyResult("topicArn", "TopicArn", (properties.TopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.TopicArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotificationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledQueryNotificationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("snsConfiguration", cdk.requiredValidator)(properties.snsConfiguration));
  errors.collect(cdk.propertyValidator("snsConfiguration", CfnScheduledQuerySnsConfigurationPropertyValidator)(properties.snsConfiguration));
  return errors.wrap("supplied properties not correct for \"NotificationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnScheduledQueryNotificationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledQueryNotificationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "SnsConfiguration": convertCfnScheduledQuerySnsConfigurationPropertyToCloudFormation(properties.snsConfiguration)
  };
}

// @ts-ignore TS6133
function CfnScheduledQueryNotificationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnScheduledQuery.NotificationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQuery.NotificationConfigurationProperty>();
  ret.addPropertyResult("snsConfiguration", "SnsConfiguration", (properties.SnsConfiguration != null ? CfnScheduledQuerySnsConfigurationPropertyFromCloudFormation(properties.SnsConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnScheduledQueryProps`
 *
 * @param properties - the TypeScript properties of a `CfnScheduledQueryProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnScheduledQueryPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("clientToken", cdk.validateString)(properties.clientToken));
  errors.collect(cdk.propertyValidator("errorReportConfiguration", cdk.requiredValidator)(properties.errorReportConfiguration));
  errors.collect(cdk.propertyValidator("errorReportConfiguration", CfnScheduledQueryErrorReportConfigurationPropertyValidator)(properties.errorReportConfiguration));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("notificationConfiguration", cdk.requiredValidator)(properties.notificationConfiguration));
  errors.collect(cdk.propertyValidator("notificationConfiguration", CfnScheduledQueryNotificationConfigurationPropertyValidator)(properties.notificationConfiguration));
  errors.collect(cdk.propertyValidator("queryString", cdk.requiredValidator)(properties.queryString));
  errors.collect(cdk.propertyValidator("queryString", cdk.validateString)(properties.queryString));
  errors.collect(cdk.propertyValidator("scheduleConfiguration", cdk.requiredValidator)(properties.scheduleConfiguration));
  errors.collect(cdk.propertyValidator("scheduleConfiguration", CfnScheduledQueryScheduleConfigurationPropertyValidator)(properties.scheduleConfiguration));
  errors.collect(cdk.propertyValidator("scheduledQueryExecutionRoleArn", cdk.requiredValidator)(properties.scheduledQueryExecutionRoleArn));
  errors.collect(cdk.propertyValidator("scheduledQueryExecutionRoleArn", cdk.validateString)(properties.scheduledQueryExecutionRoleArn));
  errors.collect(cdk.propertyValidator("scheduledQueryName", cdk.validateString)(properties.scheduledQueryName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("targetConfiguration", CfnScheduledQueryTargetConfigurationPropertyValidator)(properties.targetConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnScheduledQueryProps\"");
}

// @ts-ignore TS6133
function convertCfnScheduledQueryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnScheduledQueryPropsValidator(properties).assertSuccess();
  return {
    "ClientToken": cdk.stringToCloudFormation(properties.clientToken),
    "ErrorReportConfiguration": convertCfnScheduledQueryErrorReportConfigurationPropertyToCloudFormation(properties.errorReportConfiguration),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "NotificationConfiguration": convertCfnScheduledQueryNotificationConfigurationPropertyToCloudFormation(properties.notificationConfiguration),
    "QueryString": cdk.stringToCloudFormation(properties.queryString),
    "ScheduleConfiguration": convertCfnScheduledQueryScheduleConfigurationPropertyToCloudFormation(properties.scheduleConfiguration),
    "ScheduledQueryExecutionRoleArn": cdk.stringToCloudFormation(properties.scheduledQueryExecutionRoleArn),
    "ScheduledQueryName": cdk.stringToCloudFormation(properties.scheduledQueryName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TargetConfiguration": convertCfnScheduledQueryTargetConfigurationPropertyToCloudFormation(properties.targetConfiguration)
  };
}

// @ts-ignore TS6133
function CfnScheduledQueryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduledQueryProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduledQueryProps>();
  ret.addPropertyResult("clientToken", "ClientToken", (properties.ClientToken != null ? cfn_parse.FromCloudFormation.getString(properties.ClientToken) : undefined));
  ret.addPropertyResult("errorReportConfiguration", "ErrorReportConfiguration", (properties.ErrorReportConfiguration != null ? CfnScheduledQueryErrorReportConfigurationPropertyFromCloudFormation(properties.ErrorReportConfiguration) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("notificationConfiguration", "NotificationConfiguration", (properties.NotificationConfiguration != null ? CfnScheduledQueryNotificationConfigurationPropertyFromCloudFormation(properties.NotificationConfiguration) : undefined));
  ret.addPropertyResult("queryString", "QueryString", (properties.QueryString != null ? cfn_parse.FromCloudFormation.getString(properties.QueryString) : undefined));
  ret.addPropertyResult("scheduleConfiguration", "ScheduleConfiguration", (properties.ScheduleConfiguration != null ? CfnScheduledQueryScheduleConfigurationPropertyFromCloudFormation(properties.ScheduleConfiguration) : undefined));
  ret.addPropertyResult("scheduledQueryExecutionRoleArn", "ScheduledQueryExecutionRoleArn", (properties.ScheduledQueryExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduledQueryExecutionRoleArn) : undefined));
  ret.addPropertyResult("scheduledQueryName", "ScheduledQueryName", (properties.ScheduledQueryName != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduledQueryName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("targetConfiguration", "TargetConfiguration", (properties.TargetConfiguration != null ? CfnScheduledQueryTargetConfigurationPropertyFromCloudFormation(properties.TargetConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The CreateTable operation adds a new table to an existing database in your account.
 *
 * In an AWS account, table names must be at least unique within each Region if they are in the same database. You may have identical table names in the same Region if the tables are in separate databases. While creating the table, you must specify the table name, database name, and the retention properties. [Service quotas apply](https://docs.aws.amazon.com/timestream/latest/developerguide/ts-limits.html) . See [code sample](https://docs.aws.amazon.com/timestream/latest/developerguide/code-samples.create-table.html) for details.
 *
 * @cloudformationResource AWS::Timestream::Table
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html
 */
export class CfnTable extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Timestream::Table";

  /**
   * Build a CfnTable from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTable {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTablePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTable(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The `arn` of the table.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the table.
   *
   * @cloudformationAttribute Name
   */
  public readonly attrName: string;

  /**
   * The name of the Timestream database that contains this table.
   */
  public databaseName: string;

  /**
   * Contains properties to set on the table when enabling magnetic store writes.
   */
  public magneticStoreWriteProperties?: any | cdk.IResolvable;

  /**
   * The retention duration for the memory store and magnetic store. This object has the following attributes:.
   */
  public retentionProperties?: any | cdk.IResolvable;

  /**
   * The schema of the table.
   */
  public schema?: cdk.IResolvable | CfnTable.SchemaProperty;

  /**
   * The name of the Timestream table.
   */
  public tableName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to add to the table.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTableProps) {
    super(scope, id, {
      "type": CfnTable.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "databaseName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrName = cdk.Token.asString(this.getAtt("Name", cdk.ResolutionTypeHint.STRING));
    this.databaseName = props.databaseName;
    this.magneticStoreWriteProperties = props.magneticStoreWriteProperties;
    this.retentionProperties = props.retentionProperties;
    this.schema = props.schema;
    this.tableName = props.tableName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Timestream::Table", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "databaseName": this.databaseName,
      "magneticStoreWriteProperties": this.magneticStoreWriteProperties,
      "retentionProperties": this.retentionProperties,
      "schema": this.schema,
      "tableName": this.tableName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTable.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTablePropsToCloudFormation(props);
  }
}

export namespace CfnTable {
  /**
   * Retention properties contain the duration for which your time-series data must be stored in the magnetic store and the memory store.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-retentionproperties.html
   */
  export interface RetentionPropertiesProperty {
    /**
     * The duration for which data must be stored in the magnetic store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-retentionproperties.html#cfn-timestream-table-retentionproperties-magneticstoreretentionperiodindays
     */
    readonly magneticStoreRetentionPeriodInDays?: string;

    /**
     * The duration for which data must be stored in the memory store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-retentionproperties.html#cfn-timestream-table-retentionproperties-memorystoreretentionperiodinhours
     */
    readonly memoryStoreRetentionPeriodInHours?: string;
  }

  /**
   * A Schema specifies the expected data model of the table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-schema.html
   */
  export interface SchemaProperty {
    /**
     * A non-empty list of partition keys defining the attributes used to partition the table data.
     *
     * The order of the list determines the partition hierarchy. The name and type of each partition key as well as the partition key order cannot be changed after the table is created. However, the enforcement level of each partition key can be changed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-schema.html#cfn-timestream-table-schema-compositepartitionkey
     */
    readonly compositePartitionKey?: Array<cdk.IResolvable | CfnTable.PartitionKeyProperty> | cdk.IResolvable;
  }

  /**
   * An attribute used in partitioning data in a table.
   *
   * A dimension key partitions data using the values of the dimension specified by the dimension-name as partition key, while a measure key partitions data using measure names (values of the 'measure_name' column).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-partitionkey.html
   */
  export interface PartitionKeyProperty {
    /**
     * The level of enforcement for the specification of a dimension key in ingested records.
     *
     * Options are REQUIRED (dimension key must be specified) and OPTIONAL (dimension key does not have to be specified).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-partitionkey.html#cfn-timestream-table-partitionkey-enforcementinrecord
     */
    readonly enforcementInRecord?: string;

    /**
     * The name of the attribute used for a dimension key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-partitionkey.html#cfn-timestream-table-partitionkey-name
     */
    readonly name?: string;

    /**
     * The type of the partition key.
     *
     * Options are DIMENSION (dimension key) and MEASURE (measure key).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-partitionkey.html#cfn-timestream-table-partitionkey-type
     */
    readonly type: string;
  }

  /**
   * The set of properties on a table for configuring magnetic store writes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-magneticstorewriteproperties.html
   */
  export interface MagneticStoreWritePropertiesProperty {
    /**
     * A flag to enable magnetic store writes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-magneticstorewriteproperties.html#cfn-timestream-table-magneticstorewriteproperties-enablemagneticstorewrites
     */
    readonly enableMagneticStoreWrites: boolean | cdk.IResolvable;

    /**
     * The location to write error reports for records rejected asynchronously during magnetic store writes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-magneticstorewriteproperties.html#cfn-timestream-table-magneticstorewriteproperties-magneticstorerejecteddatalocation
     */
    readonly magneticStoreRejectedDataLocation?: cdk.IResolvable | CfnTable.MagneticStoreRejectedDataLocationProperty;
  }

  /**
   * The location to write error reports for records rejected, asynchronously, during magnetic store writes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-magneticstorerejecteddatalocation.html
   */
  export interface MagneticStoreRejectedDataLocationProperty {
    /**
     * Configuration of an S3 location to write error reports for records rejected, asynchronously, during magnetic store writes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-magneticstorerejecteddatalocation.html#cfn-timestream-table-magneticstorerejecteddatalocation-s3configuration
     */
    readonly s3Configuration?: cdk.IResolvable | CfnTable.S3ConfigurationProperty;
  }

  /**
   * The configuration that specifies an S3 location.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-s3configuration.html
   */
  export interface S3ConfigurationProperty {
    /**
     * The bucket name of the customer S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-s3configuration.html#cfn-timestream-table-s3configuration-bucketname
     */
    readonly bucketName: string;

    /**
     * The encryption option for the customer S3 location.
     *
     * Options are S3 server-side encryption with an S3 managed key or AWS managed key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-s3configuration.html#cfn-timestream-table-s3configuration-encryptionoption
     */
    readonly encryptionOption: string;

    /**
     * The AWS KMS key ID for the customer S3 location when encrypting with an AWS managed key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-s3configuration.html#cfn-timestream-table-s3configuration-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * The object key preview for the customer S3 location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-timestream-table-s3configuration.html#cfn-timestream-table-s3configuration-objectkeyprefix
     */
    readonly objectKeyPrefix?: string;
  }
}

/**
 * Properties for defining a `CfnTable`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html
 */
export interface CfnTableProps {
  /**
   * The name of the Timestream database that contains this table.
   *
   * *Length Constraints* : Minimum length of 3 bytes. Maximum length of 256 bytes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-databasename
   */
  readonly databaseName: string;

  /**
   * Contains properties to set on the table when enabling magnetic store writes.
   *
   * This object has the following attributes:
   *
   * - *EnableMagneticStoreWrites* : A `boolean` flag to enable magnetic store writes.
   * - *MagneticStoreRejectedDataLocation* : The location to write error reports for records rejected, asynchronously, during magnetic store writes. Only `S3Configuration` objects are allowed. The `S3Configuration` object has the following attributes:
   *
   * - *BucketName* : The name of the S3 bucket.
   * - *EncryptionOption* : The encryption option for the S3 location. Valid values are S3 server-side encryption with an S3 managed key ( `SSE_S3` ) or AWS managed key ( `SSE_KMS` ).
   * - *KmsKeyId* : The AWS KMS key ID to use when encrypting with an AWS managed key.
   * - *ObjectKeyPrefix* : The prefix to use option for the objects stored in S3.
   *
   * Both `BucketName` and `EncryptionOption` are *required* when `S3Configuration` is specified. If you specify `SSE_KMS` as your `EncryptionOption` then `KmsKeyId` is *required* .
   *
   * `EnableMagneticStoreWrites` attribute is *required* when `MagneticStoreWriteProperties` is specified. `MagneticStoreRejectedDataLocation` attribute is *required* when `EnableMagneticStoreWrites` is set to `true` .
   *
   * See the following examples:
   *
   * *JSON*
   *
   * ```json
   * { "Type" : AWS::Timestream::Table", "Properties":{ "DatabaseName":"TestDatabase", "TableName":"TestTable", "MagneticStoreWriteProperties":{ "EnableMagneticStoreWrites":true, "MagneticStoreRejectedDataLocation":{ "S3Configuration":{ "BucketName":"testbucket", "EncryptionOption":"SSE_KMS", "KmsKeyId":"1234abcd-12ab-34cd-56ef-1234567890ab", "ObjectKeyPrefix":"prefix" } } } }
   * }
   * ```
   *
   * *YAML*
   *
   * ```
   * Type: AWS::Timestream::Table
   * DependsOn: TestDatabase
   * Properties: TableName: "TestTable" DatabaseName: "TestDatabase" MagneticStoreWriteProperties: EnableMagneticStoreWrites: true MagneticStoreRejectedDataLocation: S3Configuration: BucketName: "testbucket" EncryptionOption: "SSE_KMS" KmsKeyId: "1234abcd-12ab-34cd-56ef-1234567890ab" ObjectKeyPrefix: "prefix"
   * ```
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-magneticstorewriteproperties
   */
  readonly magneticStoreWriteProperties?: any | cdk.IResolvable;

  /**
   * The retention duration for the memory store and magnetic store. This object has the following attributes:.
   *
   * - *MemoryStoreRetentionPeriodInHours* : Retention duration for memory store, in hours.
   * - *MagneticStoreRetentionPeriodInDays* : Retention duration for magnetic store, in days.
   *
   * Both attributes are of type `string` . Both attributes are *required* when `RetentionProperties` is specified.
   *
   * See the following examples:
   *
   * *JSON*
   *
   * `{ "Type" : AWS::Timestream::Table", "Properties" : { "DatabaseName" : "TestDatabase", "TableName" : "TestTable", "RetentionProperties" : { "MemoryStoreRetentionPeriodInHours": "24", "MagneticStoreRetentionPeriodInDays": "7" } } }`
   *
   * *YAML*
   *
   * ```
   * Type: AWS::Timestream::Table
   * DependsOn: TestDatabase
   * Properties: TableName: "TestTable" DatabaseName: "TestDatabase" RetentionProperties: MemoryStoreRetentionPeriodInHours: "24" MagneticStoreRetentionPeriodInDays: "7"
   * ```
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-retentionproperties
   */
  readonly retentionProperties?: any | cdk.IResolvable;

  /**
   * The schema of the table.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-schema
   */
  readonly schema?: cdk.IResolvable | CfnTable.SchemaProperty;

  /**
   * The name of the Timestream table.
   *
   * *Length Constraints* : Minimum length of 3 bytes. Maximum length of 256 bytes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-tablename
   */
  readonly tableName?: string;

  /**
   * The tags to add to the table.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-timestream-table.html#cfn-timestream-table-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `RetentionPropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `RetentionPropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableRetentionPropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("magneticStoreRetentionPeriodInDays", cdk.validateString)(properties.magneticStoreRetentionPeriodInDays));
  errors.collect(cdk.propertyValidator("memoryStoreRetentionPeriodInHours", cdk.validateString)(properties.memoryStoreRetentionPeriodInHours));
  return errors.wrap("supplied properties not correct for \"RetentionPropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableRetentionPropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableRetentionPropertiesPropertyValidator(properties).assertSuccess();
  return {
    "MagneticStoreRetentionPeriodInDays": cdk.stringToCloudFormation(properties.magneticStoreRetentionPeriodInDays),
    "MemoryStoreRetentionPeriodInHours": cdk.stringToCloudFormation(properties.memoryStoreRetentionPeriodInHours)
  };
}

// @ts-ignore TS6133
function CfnTableRetentionPropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.RetentionPropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.RetentionPropertiesProperty>();
  ret.addPropertyResult("magneticStoreRetentionPeriodInDays", "MagneticStoreRetentionPeriodInDays", (properties.MagneticStoreRetentionPeriodInDays != null ? cfn_parse.FromCloudFormation.getString(properties.MagneticStoreRetentionPeriodInDays) : undefined));
  ret.addPropertyResult("memoryStoreRetentionPeriodInHours", "MemoryStoreRetentionPeriodInHours", (properties.MemoryStoreRetentionPeriodInHours != null ? cfn_parse.FromCloudFormation.getString(properties.MemoryStoreRetentionPeriodInHours) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PartitionKeyProperty`
 *
 * @param properties - the TypeScript properties of a `PartitionKeyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTablePartitionKeyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enforcementInRecord", cdk.validateString)(properties.enforcementInRecord));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PartitionKeyProperty\"");
}

// @ts-ignore TS6133
function convertCfnTablePartitionKeyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTablePartitionKeyPropertyValidator(properties).assertSuccess();
  return {
    "EnforcementInRecord": cdk.stringToCloudFormation(properties.enforcementInRecord),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnTablePartitionKeyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.PartitionKeyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.PartitionKeyProperty>();
  ret.addPropertyResult("enforcementInRecord", "EnforcementInRecord", (properties.EnforcementInRecord != null ? cfn_parse.FromCloudFormation.getString(properties.EnforcementInRecord) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SchemaProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableSchemaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("compositePartitionKey", cdk.listValidator(CfnTablePartitionKeyPropertyValidator))(properties.compositePartitionKey));
  return errors.wrap("supplied properties not correct for \"SchemaProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableSchemaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableSchemaPropertyValidator(properties).assertSuccess();
  return {
    "CompositePartitionKey": cdk.listMapper(convertCfnTablePartitionKeyPropertyToCloudFormation)(properties.compositePartitionKey)
  };
}

// @ts-ignore TS6133
function CfnTableSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.SchemaProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.SchemaProperty>();
  ret.addPropertyResult("compositePartitionKey", "CompositePartitionKey", (properties.CompositePartitionKey != null ? cfn_parse.FromCloudFormation.getArray(CfnTablePartitionKeyPropertyFromCloudFormation)(properties.CompositePartitionKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `S3ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableS3ConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("encryptionOption", cdk.requiredValidator)(properties.encryptionOption));
  errors.collect(cdk.propertyValidator("encryptionOption", cdk.validateString)(properties.encryptionOption));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("objectKeyPrefix", cdk.validateString)(properties.objectKeyPrefix));
  return errors.wrap("supplied properties not correct for \"S3ConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableS3ConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableS3ConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "EncryptionOption": cdk.stringToCloudFormation(properties.encryptionOption),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "ObjectKeyPrefix": cdk.stringToCloudFormation(properties.objectKeyPrefix)
  };
}

// @ts-ignore TS6133
function CfnTableS3ConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.S3ConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.S3ConfigurationProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("encryptionOption", "EncryptionOption", (properties.EncryptionOption != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionOption) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("objectKeyPrefix", "ObjectKeyPrefix", (properties.ObjectKeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectKeyPrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MagneticStoreRejectedDataLocationProperty`
 *
 * @param properties - the TypeScript properties of a `MagneticStoreRejectedDataLocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableMagneticStoreRejectedDataLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Configuration", CfnTableS3ConfigurationPropertyValidator)(properties.s3Configuration));
  return errors.wrap("supplied properties not correct for \"MagneticStoreRejectedDataLocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableMagneticStoreRejectedDataLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableMagneticStoreRejectedDataLocationPropertyValidator(properties).assertSuccess();
  return {
    "S3Configuration": convertCfnTableS3ConfigurationPropertyToCloudFormation(properties.s3Configuration)
  };
}

// @ts-ignore TS6133
function CfnTableMagneticStoreRejectedDataLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.MagneticStoreRejectedDataLocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.MagneticStoreRejectedDataLocationProperty>();
  ret.addPropertyResult("s3Configuration", "S3Configuration", (properties.S3Configuration != null ? CfnTableS3ConfigurationPropertyFromCloudFormation(properties.S3Configuration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MagneticStoreWritePropertiesProperty`
 *
 * @param properties - the TypeScript properties of a `MagneticStoreWritePropertiesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTableMagneticStoreWritePropertiesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enableMagneticStoreWrites", cdk.requiredValidator)(properties.enableMagneticStoreWrites));
  errors.collect(cdk.propertyValidator("enableMagneticStoreWrites", cdk.validateBoolean)(properties.enableMagneticStoreWrites));
  errors.collect(cdk.propertyValidator("magneticStoreRejectedDataLocation", CfnTableMagneticStoreRejectedDataLocationPropertyValidator)(properties.magneticStoreRejectedDataLocation));
  return errors.wrap("supplied properties not correct for \"MagneticStoreWritePropertiesProperty\"");
}

// @ts-ignore TS6133
function convertCfnTableMagneticStoreWritePropertiesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTableMagneticStoreWritePropertiesPropertyValidator(properties).assertSuccess();
  return {
    "EnableMagneticStoreWrites": cdk.booleanToCloudFormation(properties.enableMagneticStoreWrites),
    "MagneticStoreRejectedDataLocation": convertCfnTableMagneticStoreRejectedDataLocationPropertyToCloudFormation(properties.magneticStoreRejectedDataLocation)
  };
}

// @ts-ignore TS6133
function CfnTableMagneticStoreWritePropertiesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTable.MagneticStoreWritePropertiesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTable.MagneticStoreWritePropertiesProperty>();
  ret.addPropertyResult("enableMagneticStoreWrites", "EnableMagneticStoreWrites", (properties.EnableMagneticStoreWrites != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableMagneticStoreWrites) : undefined));
  ret.addPropertyResult("magneticStoreRejectedDataLocation", "MagneticStoreRejectedDataLocation", (properties.MagneticStoreRejectedDataLocation != null ? CfnTableMagneticStoreRejectedDataLocationPropertyFromCloudFormation(properties.MagneticStoreRejectedDataLocation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTableProps`
 *
 * @param properties - the TypeScript properties of a `CfnTableProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTablePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("magneticStoreWriteProperties", cdk.validateObject)(properties.magneticStoreWriteProperties));
  errors.collect(cdk.propertyValidator("retentionProperties", cdk.validateObject)(properties.retentionProperties));
  errors.collect(cdk.propertyValidator("schema", CfnTableSchemaPropertyValidator)(properties.schema));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnTableProps\"");
}

// @ts-ignore TS6133
function convertCfnTablePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTablePropsValidator(properties).assertSuccess();
  return {
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "MagneticStoreWriteProperties": cdk.objectToCloudFormation(properties.magneticStoreWriteProperties),
    "RetentionProperties": cdk.objectToCloudFormation(properties.retentionProperties),
    "Schema": convertCfnTableSchemaPropertyToCloudFormation(properties.schema),
    "TableName": cdk.stringToCloudFormation(properties.tableName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnTablePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTableProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTableProps>();
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("magneticStoreWriteProperties", "MagneticStoreWriteProperties", (properties.MagneticStoreWriteProperties != null ? cfn_parse.FromCloudFormation.getAny(properties.MagneticStoreWriteProperties) : undefined));
  ret.addPropertyResult("retentionProperties", "RetentionProperties", (properties.RetentionProperties != null ? cfn_parse.FromCloudFormation.getAny(properties.RetentionProperties) : undefined));
  ret.addPropertyResult("schema", "Schema", (properties.Schema != null ? CfnTableSchemaPropertyFromCloudFormation(properties.Schema) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}