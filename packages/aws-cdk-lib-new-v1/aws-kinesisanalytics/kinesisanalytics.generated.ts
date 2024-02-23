/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::KinesisAnalytics::Application` resource creates an Amazon Kinesis Data Analytics application.
 *
 * For more information, see the [Amazon Kinesis Data Analytics Developer Guide](https://docs.aws.amazon.com//kinesisanalytics/latest/dev/what-is.html) .
 *
 * @cloudformationResource AWS::KinesisAnalytics::Application
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::KinesisAnalytics::Application";

  /**
   * Build a CfnApplication from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplication(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * One or more SQL statements that read input data, transform it, and generate output.
   */
  public applicationCode?: string;

  /**
   * Summary description of the application.
   */
  public applicationDescription?: string;

  /**
   * Name of your Amazon Kinesis Analytics application (for example, `sample-app` ).
   */
  public applicationName?: string;

  /**
   * Use this parameter to configure the application input.
   */
  public inputs: Array<CfnApplication.InputProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
    super(scope, id, {
      "type": CfnApplication.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "inputs", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationCode = props.applicationCode;
    this.applicationDescription = props.applicationDescription;
    this.applicationName = props.applicationName;
    this.inputs = props.inputs;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationCode": this.applicationCode,
      "applicationDescription": this.applicationDescription,
      "applicationName": this.applicationName,
      "inputs": this.inputs
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplication.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationPropsToCloudFormation(props);
  }
}

export namespace CfnApplication {
  /**
   * When you configure the application input, you specify the streaming source, the in-application stream name that is created, and the mapping between the two.
   *
   * For more information, see [Configuring Application Input](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-input.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html
   */
  export interface InputProperty {
    /**
     * Describes the number of in-application streams to create.
     *
     * Data from your source is routed to these in-application input streams.
     *
     * See [Configuring Application Input](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-input.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-inputparallelism
     */
    readonly inputParallelism?: CfnApplication.InputParallelismProperty | cdk.IResolvable;

    /**
     * The [InputProcessingConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputprocessingconfiguration.html) for the input. An input processor transforms records as they are received from the stream, before the application's SQL code executes. Currently, the only input processing configuration available is [InputLambdaProcessor](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputlambdaprocessor.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-inputprocessingconfiguration
     */
    readonly inputProcessingConfiguration?: CfnApplication.InputProcessingConfigurationProperty | cdk.IResolvable;

    /**
     * Describes the format of the data in the streaming source, and how each data element maps to corresponding columns in the in-application stream that is being created.
     *
     * Also used to describe the format of the reference data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-inputschema
     */
    readonly inputSchema: CfnApplication.InputSchemaProperty | cdk.IResolvable;

    /**
     * If the streaming source is an Amazon Kinesis Firehose delivery stream, identifies the delivery stream's ARN and an IAM role that enables Amazon Kinesis Analytics to access the stream on your behalf.
     *
     * Note: Either `KinesisStreamsInput` or `KinesisFirehoseInput` is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-kinesisfirehoseinput
     */
    readonly kinesisFirehoseInput?: cdk.IResolvable | CfnApplication.KinesisFirehoseInputProperty;

    /**
     * If the streaming source is an Amazon Kinesis stream, identifies the stream's Amazon Resource Name (ARN) and an IAM role that enables Amazon Kinesis Analytics to access the stream on your behalf.
     *
     * Note: Either `KinesisStreamsInput` or `KinesisFirehoseInput` is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-kinesisstreamsinput
     */
    readonly kinesisStreamsInput?: cdk.IResolvable | CfnApplication.KinesisStreamsInputProperty;

    /**
     * Name prefix to use when creating an in-application stream.
     *
     * Suppose that you specify a prefix "MyInApplicationStream." Amazon Kinesis Analytics then creates one or more (as per the `InputParallelism` count you specified) in-application streams with names "MyInApplicationStream_001," "MyInApplicationStream_002," and so on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-input.html#cfn-kinesisanalytics-application-input-nameprefix
     */
    readonly namePrefix: string;
  }

  /**
   * Describes the format of the data in the streaming source, and how each data element maps to corresponding columns in the in-application stream that is being created.
   *
   * Also used to describe the format of the reference data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputschema.html
   */
  export interface InputSchemaProperty {
    /**
     * A list of `RecordColumn` objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputschema.html#cfn-kinesisanalytics-application-inputschema-recordcolumns
     */
    readonly recordColumns: Array<cdk.IResolvable | CfnApplication.RecordColumnProperty> | cdk.IResolvable;

    /**
     * Specifies the encoding of the records in the streaming source.
     *
     * For example, UTF-8.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputschema.html#cfn-kinesisanalytics-application-inputschema-recordencoding
     */
    readonly recordEncoding?: string;

    /**
     * Specifies the format of the records on the streaming source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputschema.html#cfn-kinesisanalytics-application-inputschema-recordformat
     */
    readonly recordFormat: cdk.IResolvable | CfnApplication.RecordFormatProperty;
  }

  /**
   * Describes the mapping of each data element in the streaming source to the corresponding column in the in-application stream.
   *
   * Also used to describe the format of the reference data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordcolumn.html
   */
  export interface RecordColumnProperty {
    /**
     * Reference to the data element in the streaming input or the reference data source.
     *
     * This element is required if the [RecordFormatType](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/API_RecordFormat.html#analytics-Type-RecordFormat-RecordFormatTypel) is `JSON` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordcolumn.html#cfn-kinesisanalytics-application-recordcolumn-mapping
     */
    readonly mapping?: string;

    /**
     * Name of the column created in the in-application input stream or reference table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordcolumn.html#cfn-kinesisanalytics-application-recordcolumn-name
     */
    readonly name: string;

    /**
     * Type of column created in the in-application input stream or reference table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordcolumn.html#cfn-kinesisanalytics-application-recordcolumn-sqltype
     */
    readonly sqlType: string;
  }

  /**
   * Describes the record format and relevant mapping information that should be applied to schematize the records on the stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordformat.html
   */
  export interface RecordFormatProperty {
    /**
     * When configuring application input at the time of creating or updating an application, provides additional mapping information specific to the record format (such as JSON, CSV, or record fields delimited by some delimiter) on the streaming source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordformat.html#cfn-kinesisanalytics-application-recordformat-mappingparameters
     */
    readonly mappingParameters?: cdk.IResolvable | CfnApplication.MappingParametersProperty;

    /**
     * The type of record format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-recordformat.html#cfn-kinesisanalytics-application-recordformat-recordformattype
     */
    readonly recordFormatType: string;
  }

  /**
   * When configuring application input at the time of creating or updating an application, provides additional mapping information specific to the record format (such as JSON, CSV, or record fields delimited by some delimiter) on the streaming source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html
   */
  export interface MappingParametersProperty {
    /**
     * Provides additional mapping information when the record format uses delimiters (for example, CSV).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html#cfn-kinesisanalytics-application-mappingparameters-csvmappingparameters
     */
    readonly csvMappingParameters?: CfnApplication.CSVMappingParametersProperty | cdk.IResolvable;

    /**
     * Provides additional mapping information when JSON is the record format on the streaming source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-mappingparameters.html#cfn-kinesisanalytics-application-mappingparameters-jsonmappingparameters
     */
    readonly jsonMappingParameters?: cdk.IResolvable | CfnApplication.JSONMappingParametersProperty;
  }

  /**
   * Provides additional mapping information when JSON is the record format on the streaming source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-jsonmappingparameters.html
   */
  export interface JSONMappingParametersProperty {
    /**
     * Path to the top-level parent that contains the records.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-jsonmappingparameters.html#cfn-kinesisanalytics-application-jsonmappingparameters-recordrowpath
     */
    readonly recordRowPath: string;
  }

  /**
   * Provides additional mapping information when the record format uses delimiters, such as CSV.
   *
   * For example, the following sample records use CSV format, where the records use the *'\n'* as the row delimiter and a comma (",") as the column delimiter:
   *
   * `"name1", "address1"`
   *
   * `"name2", "address2"`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-csvmappingparameters.html
   */
  export interface CSVMappingParametersProperty {
    /**
     * Column delimiter.
     *
     * For example, in a CSV format, a comma (",") is the typical column delimiter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-csvmappingparameters.html#cfn-kinesisanalytics-application-csvmappingparameters-recordcolumndelimiter
     */
    readonly recordColumnDelimiter: string;

    /**
     * Row delimiter.
     *
     * For example, in a CSV format, *'\n'* is the typical row delimiter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-csvmappingparameters.html#cfn-kinesisanalytics-application-csvmappingparameters-recordrowdelimiter
     */
    readonly recordRowDelimiter: string;
  }

  /**
   * Identifies an Amazon Kinesis stream as the streaming source.
   *
   * You provide the stream's Amazon Resource Name (ARN) and an IAM role ARN that enables Amazon Kinesis Analytics to access the stream on your behalf.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-kinesisstreamsinput.html
   */
  export interface KinesisStreamsInputProperty {
    /**
     * ARN of the input Amazon Kinesis stream to read.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-kinesisstreamsinput.html#cfn-kinesisanalytics-application-kinesisstreamsinput-resourcearn
     */
    readonly resourceArn: string;

    /**
     * ARN of the IAM role that Amazon Kinesis Analytics can assume to access the stream on your behalf.
     *
     * You need to grant the necessary permissions to this role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-kinesisstreamsinput.html#cfn-kinesisanalytics-application-kinesisstreamsinput-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Identifies an Amazon Kinesis Firehose delivery stream as the streaming source.
   *
   * You provide the delivery stream's Amazon Resource Name (ARN) and an IAM role ARN that enables Amazon Kinesis Analytics to access the stream on your behalf.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-kinesisfirehoseinput.html
   */
  export interface KinesisFirehoseInputProperty {
    /**
     * ARN of the input delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-kinesisfirehoseinput.html#cfn-kinesisanalytics-application-kinesisfirehoseinput-resourcearn
     */
    readonly resourceArn: string;

    /**
     * ARN of the IAM role that Amazon Kinesis Analytics can assume to access the stream on your behalf.
     *
     * You need to make sure that the role has the necessary permissions to access the stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-kinesisfirehoseinput.html#cfn-kinesisanalytics-application-kinesisfirehoseinput-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Provides a description of a processor that is used to preprocess the records in the stream before being processed by your application code.
   *
   * Currently, the only input processor available is [AWS Lambda](https://docs.aws.amazon.com/lambda/) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputprocessingconfiguration.html
   */
  export interface InputProcessingConfigurationProperty {
    /**
     * The [InputLambdaProcessor](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputlambdaprocessor.html) that is used to preprocess the records in the stream before being processed by your application code.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputprocessingconfiguration.html#cfn-kinesisanalytics-application-inputprocessingconfiguration-inputlambdaprocessor
     */
    readonly inputLambdaProcessor?: CfnApplication.InputLambdaProcessorProperty | cdk.IResolvable;
  }

  /**
   * An object that contains the Amazon Resource Name (ARN) of the [AWS Lambda](https://docs.aws.amazon.com/lambda/) function that is used to preprocess records in the stream, and the ARN of the IAM role that is used to access the AWS Lambda function.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputlambdaprocessor.html
   */
  export interface InputLambdaProcessorProperty {
    /**
     * The ARN of the [AWS Lambda](https://docs.aws.amazon.com/lambda/) function that operates on records in the stream.
     *
     * > To specify an earlier version of the Lambda function than the latest, include the Lambda function version in the Lambda function ARN. For more information about Lambda ARNs, see [Example ARNs: AWS Lambda](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html#arn-syntax-lambda)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputlambdaprocessor.html#cfn-kinesisanalytics-application-inputlambdaprocessor-resourcearn
     */
    readonly resourceArn: string;

    /**
     * The ARN of the IAM role that is used to access the AWS Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputlambdaprocessor.html#cfn-kinesisanalytics-application-inputlambdaprocessor-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Describes the number of in-application streams to create for a given streaming source.
   *
   * For information about parallelism, see [Configuring Application Input](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-input.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputparallelism.html
   */
  export interface InputParallelismProperty {
    /**
     * Number of in-application streams to create.
     *
     * For more information, see [Limits](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/limits.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-application-inputparallelism.html#cfn-kinesisanalytics-application-inputparallelism-count
     */
    readonly count?: number;
  }
}

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html
 */
export interface CfnApplicationProps {
  /**
   * One or more SQL statements that read input data, transform it, and generate output.
   *
   * For example, you can write a SQL statement that reads data from one in-application stream, generates a running average of the number of advertisement clicks by vendor, and insert resulting rows in another in-application stream using pumps. For more information about the typical pattern, see [Application Code](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-app-code.html) .
   *
   * You can provide such series of SQL statements, where output of one statement can be used as the input for the next statement. You store intermediate results by creating in-application streams and pumps.
   *
   * Note that the application code must create the streams with names specified in the `Outputs` . For example, if your `Outputs` defines output streams named `ExampleOutputStream1` and `ExampleOutputStream2` , then your application code must create these streams.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-applicationcode
   */
  readonly applicationCode?: string;

  /**
   * Summary description of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-applicationdescription
   */
  readonly applicationDescription?: string;

  /**
   * Name of your Amazon Kinesis Analytics application (for example, `sample-app` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-applicationname
   */
  readonly applicationName?: string;

  /**
   * Use this parameter to configure the application input.
   *
   * You can configure your application to receive input from a single streaming source. In this configuration, you map this streaming source to an in-application stream that is created. Your application code can then query the in-application stream like a table (you can think of it as a constantly updating table).
   *
   * For the streaming source, you provide its Amazon Resource Name (ARN) and format of data on the stream (for example, JSON, CSV, etc.). You also must provide an IAM role that Amazon Kinesis Analytics can assume to read this stream on your behalf.
   *
   * To create the in-application stream, you need to specify a schema to transform your data into a schematized version used in SQL. In the schema, you provide the necessary mapping of the data elements in the streaming source to record columns in the in-app stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-application.html#cfn-kinesisanalytics-application-inputs
   */
  readonly inputs: Array<CfnApplication.InputProperty | cdk.IResolvable> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `RecordColumnProperty`
 *
 * @param properties - the TypeScript properties of a `RecordColumnProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationRecordColumnPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mapping", cdk.validateString)(properties.mapping));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("sqlType", cdk.requiredValidator)(properties.sqlType));
  errors.collect(cdk.propertyValidator("sqlType", cdk.validateString)(properties.sqlType));
  return errors.wrap("supplied properties not correct for \"RecordColumnProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationRecordColumnPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationRecordColumnPropertyValidator(properties).assertSuccess();
  return {
    "Mapping": cdk.stringToCloudFormation(properties.mapping),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SqlType": cdk.stringToCloudFormation(properties.sqlType)
  };
}

// @ts-ignore TS6133
function CfnApplicationRecordColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.RecordColumnProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.RecordColumnProperty>();
  ret.addPropertyResult("mapping", "Mapping", (properties.Mapping != null ? cfn_parse.FromCloudFormation.getString(properties.Mapping) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("sqlType", "SqlType", (properties.SqlType != null ? cfn_parse.FromCloudFormation.getString(properties.SqlType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JSONMappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `JSONMappingParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationJSONMappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("recordRowPath", cdk.requiredValidator)(properties.recordRowPath));
  errors.collect(cdk.propertyValidator("recordRowPath", cdk.validateString)(properties.recordRowPath));
  return errors.wrap("supplied properties not correct for \"JSONMappingParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationJSONMappingParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationJSONMappingParametersPropertyValidator(properties).assertSuccess();
  return {
    "RecordRowPath": cdk.stringToCloudFormation(properties.recordRowPath)
  };
}

// @ts-ignore TS6133
function CfnApplicationJSONMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.JSONMappingParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.JSONMappingParametersProperty>();
  ret.addPropertyResult("recordRowPath", "RecordRowPath", (properties.RecordRowPath != null ? cfn_parse.FromCloudFormation.getString(properties.RecordRowPath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CSVMappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `CSVMappingParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationCSVMappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("recordColumnDelimiter", cdk.requiredValidator)(properties.recordColumnDelimiter));
  errors.collect(cdk.propertyValidator("recordColumnDelimiter", cdk.validateString)(properties.recordColumnDelimiter));
  errors.collect(cdk.propertyValidator("recordRowDelimiter", cdk.requiredValidator)(properties.recordRowDelimiter));
  errors.collect(cdk.propertyValidator("recordRowDelimiter", cdk.validateString)(properties.recordRowDelimiter));
  return errors.wrap("supplied properties not correct for \"CSVMappingParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationCSVMappingParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationCSVMappingParametersPropertyValidator(properties).assertSuccess();
  return {
    "RecordColumnDelimiter": cdk.stringToCloudFormation(properties.recordColumnDelimiter),
    "RecordRowDelimiter": cdk.stringToCloudFormation(properties.recordRowDelimiter)
  };
}

// @ts-ignore TS6133
function CfnApplicationCSVMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.CSVMappingParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.CSVMappingParametersProperty>();
  ret.addPropertyResult("recordColumnDelimiter", "RecordColumnDelimiter", (properties.RecordColumnDelimiter != null ? cfn_parse.FromCloudFormation.getString(properties.RecordColumnDelimiter) : undefined));
  ret.addPropertyResult("recordRowDelimiter", "RecordRowDelimiter", (properties.RecordRowDelimiter != null ? cfn_parse.FromCloudFormation.getString(properties.RecordRowDelimiter) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MappingParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationMappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("csvMappingParameters", CfnApplicationCSVMappingParametersPropertyValidator)(properties.csvMappingParameters));
  errors.collect(cdk.propertyValidator("jsonMappingParameters", CfnApplicationJSONMappingParametersPropertyValidator)(properties.jsonMappingParameters));
  return errors.wrap("supplied properties not correct for \"MappingParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationMappingParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationMappingParametersPropertyValidator(properties).assertSuccess();
  return {
    "CSVMappingParameters": convertCfnApplicationCSVMappingParametersPropertyToCloudFormation(properties.csvMappingParameters),
    "JSONMappingParameters": convertCfnApplicationJSONMappingParametersPropertyToCloudFormation(properties.jsonMappingParameters)
  };
}

// @ts-ignore TS6133
function CfnApplicationMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.MappingParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.MappingParametersProperty>();
  ret.addPropertyResult("csvMappingParameters", "CSVMappingParameters", (properties.CSVMappingParameters != null ? CfnApplicationCSVMappingParametersPropertyFromCloudFormation(properties.CSVMappingParameters) : undefined));
  ret.addPropertyResult("jsonMappingParameters", "JSONMappingParameters", (properties.JSONMappingParameters != null ? CfnApplicationJSONMappingParametersPropertyFromCloudFormation(properties.JSONMappingParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RecordFormatProperty`
 *
 * @param properties - the TypeScript properties of a `RecordFormatProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationRecordFormatPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mappingParameters", CfnApplicationMappingParametersPropertyValidator)(properties.mappingParameters));
  errors.collect(cdk.propertyValidator("recordFormatType", cdk.requiredValidator)(properties.recordFormatType));
  errors.collect(cdk.propertyValidator("recordFormatType", cdk.validateString)(properties.recordFormatType));
  return errors.wrap("supplied properties not correct for \"RecordFormatProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationRecordFormatPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationRecordFormatPropertyValidator(properties).assertSuccess();
  return {
    "MappingParameters": convertCfnApplicationMappingParametersPropertyToCloudFormation(properties.mappingParameters),
    "RecordFormatType": cdk.stringToCloudFormation(properties.recordFormatType)
  };
}

// @ts-ignore TS6133
function CfnApplicationRecordFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.RecordFormatProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.RecordFormatProperty>();
  ret.addPropertyResult("mappingParameters", "MappingParameters", (properties.MappingParameters != null ? CfnApplicationMappingParametersPropertyFromCloudFormation(properties.MappingParameters) : undefined));
  ret.addPropertyResult("recordFormatType", "RecordFormatType", (properties.RecordFormatType != null ? cfn_parse.FromCloudFormation.getString(properties.RecordFormatType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InputSchemaProperty`
 *
 * @param properties - the TypeScript properties of a `InputSchemaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationInputSchemaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("recordColumns", cdk.requiredValidator)(properties.recordColumns));
  errors.collect(cdk.propertyValidator("recordColumns", cdk.listValidator(CfnApplicationRecordColumnPropertyValidator))(properties.recordColumns));
  errors.collect(cdk.propertyValidator("recordEncoding", cdk.validateString)(properties.recordEncoding));
  errors.collect(cdk.propertyValidator("recordFormat", cdk.requiredValidator)(properties.recordFormat));
  errors.collect(cdk.propertyValidator("recordFormat", CfnApplicationRecordFormatPropertyValidator)(properties.recordFormat));
  return errors.wrap("supplied properties not correct for \"InputSchemaProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationInputSchemaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationInputSchemaPropertyValidator(properties).assertSuccess();
  return {
    "RecordColumns": cdk.listMapper(convertCfnApplicationRecordColumnPropertyToCloudFormation)(properties.recordColumns),
    "RecordEncoding": cdk.stringToCloudFormation(properties.recordEncoding),
    "RecordFormat": convertCfnApplicationRecordFormatPropertyToCloudFormation(properties.recordFormat)
  };
}

// @ts-ignore TS6133
function CfnApplicationInputSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputSchemaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputSchemaProperty>();
  ret.addPropertyResult("recordColumns", "RecordColumns", (properties.RecordColumns != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationRecordColumnPropertyFromCloudFormation)(properties.RecordColumns) : undefined));
  ret.addPropertyResult("recordEncoding", "RecordEncoding", (properties.RecordEncoding != null ? cfn_parse.FromCloudFormation.getString(properties.RecordEncoding) : undefined));
  ret.addPropertyResult("recordFormat", "RecordFormat", (properties.RecordFormat != null ? CfnApplicationRecordFormatPropertyFromCloudFormation(properties.RecordFormat) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KinesisStreamsInputProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisStreamsInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationKinesisStreamsInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"KinesisStreamsInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationKinesisStreamsInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationKinesisStreamsInputPropertyValidator(properties).assertSuccess();
  return {
    "ResourceARN": cdk.stringToCloudFormation(properties.resourceArn),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnApplicationKinesisStreamsInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.KinesisStreamsInputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.KinesisStreamsInputProperty>();
  ret.addPropertyResult("resourceArn", "ResourceARN", (properties.ResourceARN != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceARN) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KinesisFirehoseInputProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationKinesisFirehoseInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"KinesisFirehoseInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationKinesisFirehoseInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationKinesisFirehoseInputPropertyValidator(properties).assertSuccess();
  return {
    "ResourceARN": cdk.stringToCloudFormation(properties.resourceArn),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnApplicationKinesisFirehoseInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.KinesisFirehoseInputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.KinesisFirehoseInputProperty>();
  ret.addPropertyResult("resourceArn", "ResourceARN", (properties.ResourceARN != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceARN) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InputLambdaProcessorProperty`
 *
 * @param properties - the TypeScript properties of a `InputLambdaProcessorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationInputLambdaProcessorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"InputLambdaProcessorProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationInputLambdaProcessorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationInputLambdaProcessorPropertyValidator(properties).assertSuccess();
  return {
    "ResourceARN": cdk.stringToCloudFormation(properties.resourceArn),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnApplicationInputLambdaProcessorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputLambdaProcessorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputLambdaProcessorProperty>();
  ret.addPropertyResult("resourceArn", "ResourceARN", (properties.ResourceARN != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceARN) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InputProcessingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `InputProcessingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationInputProcessingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("inputLambdaProcessor", CfnApplicationInputLambdaProcessorPropertyValidator)(properties.inputLambdaProcessor));
  return errors.wrap("supplied properties not correct for \"InputProcessingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationInputProcessingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationInputProcessingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "InputLambdaProcessor": convertCfnApplicationInputLambdaProcessorPropertyToCloudFormation(properties.inputLambdaProcessor)
  };
}

// @ts-ignore TS6133
function CfnApplicationInputProcessingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputProcessingConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputProcessingConfigurationProperty>();
  ret.addPropertyResult("inputLambdaProcessor", "InputLambdaProcessor", (properties.InputLambdaProcessor != null ? CfnApplicationInputLambdaProcessorPropertyFromCloudFormation(properties.InputLambdaProcessor) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InputParallelismProperty`
 *
 * @param properties - the TypeScript properties of a `InputParallelismProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationInputParallelismPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("count", cdk.validateNumber)(properties.count));
  return errors.wrap("supplied properties not correct for \"InputParallelismProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationInputParallelismPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationInputParallelismPropertyValidator(properties).assertSuccess();
  return {
    "Count": cdk.numberToCloudFormation(properties.count)
  };
}

// @ts-ignore TS6133
function CfnApplicationInputParallelismPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputParallelismProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputParallelismProperty>();
  ret.addPropertyResult("count", "Count", (properties.Count != null ? cfn_parse.FromCloudFormation.getNumber(properties.Count) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InputProperty`
 *
 * @param properties - the TypeScript properties of a `InputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("inputParallelism", CfnApplicationInputParallelismPropertyValidator)(properties.inputParallelism));
  errors.collect(cdk.propertyValidator("inputProcessingConfiguration", CfnApplicationInputProcessingConfigurationPropertyValidator)(properties.inputProcessingConfiguration));
  errors.collect(cdk.propertyValidator("inputSchema", cdk.requiredValidator)(properties.inputSchema));
  errors.collect(cdk.propertyValidator("inputSchema", CfnApplicationInputSchemaPropertyValidator)(properties.inputSchema));
  errors.collect(cdk.propertyValidator("kinesisFirehoseInput", CfnApplicationKinesisFirehoseInputPropertyValidator)(properties.kinesisFirehoseInput));
  errors.collect(cdk.propertyValidator("kinesisStreamsInput", CfnApplicationKinesisStreamsInputPropertyValidator)(properties.kinesisStreamsInput));
  errors.collect(cdk.propertyValidator("namePrefix", cdk.requiredValidator)(properties.namePrefix));
  errors.collect(cdk.propertyValidator("namePrefix", cdk.validateString)(properties.namePrefix));
  return errors.wrap("supplied properties not correct for \"InputProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationInputPropertyValidator(properties).assertSuccess();
  return {
    "InputParallelism": convertCfnApplicationInputParallelismPropertyToCloudFormation(properties.inputParallelism),
    "InputProcessingConfiguration": convertCfnApplicationInputProcessingConfigurationPropertyToCloudFormation(properties.inputProcessingConfiguration),
    "InputSchema": convertCfnApplicationInputSchemaPropertyToCloudFormation(properties.inputSchema),
    "KinesisFirehoseInput": convertCfnApplicationKinesisFirehoseInputPropertyToCloudFormation(properties.kinesisFirehoseInput),
    "KinesisStreamsInput": convertCfnApplicationKinesisStreamsInputPropertyToCloudFormation(properties.kinesisStreamsInput),
    "NamePrefix": cdk.stringToCloudFormation(properties.namePrefix)
  };
}

// @ts-ignore TS6133
function CfnApplicationInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InputProperty>();
  ret.addPropertyResult("inputParallelism", "InputParallelism", (properties.InputParallelism != null ? CfnApplicationInputParallelismPropertyFromCloudFormation(properties.InputParallelism) : undefined));
  ret.addPropertyResult("inputProcessingConfiguration", "InputProcessingConfiguration", (properties.InputProcessingConfiguration != null ? CfnApplicationInputProcessingConfigurationPropertyFromCloudFormation(properties.InputProcessingConfiguration) : undefined));
  ret.addPropertyResult("inputSchema", "InputSchema", (properties.InputSchema != null ? CfnApplicationInputSchemaPropertyFromCloudFormation(properties.InputSchema) : undefined));
  ret.addPropertyResult("kinesisFirehoseInput", "KinesisFirehoseInput", (properties.KinesisFirehoseInput != null ? CfnApplicationKinesisFirehoseInputPropertyFromCloudFormation(properties.KinesisFirehoseInput) : undefined));
  ret.addPropertyResult("kinesisStreamsInput", "KinesisStreamsInput", (properties.KinesisStreamsInput != null ? CfnApplicationKinesisStreamsInputPropertyFromCloudFormation(properties.KinesisStreamsInput) : undefined));
  ret.addPropertyResult("namePrefix", "NamePrefix", (properties.NamePrefix != null ? cfn_parse.FromCloudFormation.getString(properties.NamePrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationCode", cdk.validateString)(properties.applicationCode));
  errors.collect(cdk.propertyValidator("applicationDescription", cdk.validateString)(properties.applicationDescription));
  errors.collect(cdk.propertyValidator("applicationName", cdk.validateString)(properties.applicationName));
  errors.collect(cdk.propertyValidator("inputs", cdk.requiredValidator)(properties.inputs));
  errors.collect(cdk.propertyValidator("inputs", cdk.listValidator(CfnApplicationInputPropertyValidator))(properties.inputs));
  return errors.wrap("supplied properties not correct for \"CfnApplicationProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationPropsValidator(properties).assertSuccess();
  return {
    "ApplicationCode": cdk.stringToCloudFormation(properties.applicationCode),
    "ApplicationDescription": cdk.stringToCloudFormation(properties.applicationDescription),
    "ApplicationName": cdk.stringToCloudFormation(properties.applicationName),
    "Inputs": cdk.listMapper(convertCfnApplicationInputPropertyToCloudFormation)(properties.inputs)
  };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
  ret.addPropertyResult("applicationCode", "ApplicationCode", (properties.ApplicationCode != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationCode) : undefined));
  ret.addPropertyResult("applicationDescription", "ApplicationDescription", (properties.ApplicationDescription != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationDescription) : undefined));
  ret.addPropertyResult("applicationName", "ApplicationName", (properties.ApplicationName != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationName) : undefined));
  ret.addPropertyResult("inputs", "Inputs", (properties.Inputs != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationInputPropertyFromCloudFormation)(properties.Inputs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Adds an external destination to your Amazon Kinesis Analytics application.
 *
 * If you want Amazon Kinesis Analytics to deliver data from an in-application stream within your application to an external destination (such as an Amazon Kinesis stream, an Amazon Kinesis Firehose delivery stream, or an Amazon Lambda function), you add the relevant configuration to your application using this operation. You can configure one or more outputs for your application. Each output configuration maps an in-application stream and an external destination.
 *
 * You can use one of the output configurations to deliver data from your in-application error stream to an external destination so that you can analyze the errors. For more information, see [Understanding Application Output (Destination)](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-output.html) .
 *
 * Any configuration update, including adding a streaming source using this operation, results in a new version of the application. You can use the `DescribeApplication` operation to find the current application version.
 *
 * For the limits on the number of application inputs and outputs you can configure, see [Limits](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/limits.html) .
 *
 * This operation requires permissions to perform the `kinesisanalytics:AddApplicationOutput` action.
 *
 * @cloudformationResource AWS::KinesisAnalytics::ApplicationOutput
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html
 */
export class CfnApplicationOutput extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::KinesisAnalytics::ApplicationOutput";

  /**
   * Build a CfnApplicationOutput from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationOutput {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationOutputPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplicationOutput(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Name of the application to which you want to add the output configuration.
   */
  public applicationName: string;

  /**
   * An array of objects, each describing one output configuration.
   */
  public output: cdk.IResolvable | CfnApplicationOutput.OutputProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationOutputProps) {
    super(scope, id, {
      "type": CfnApplicationOutput.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationName", this);
    cdk.requireProperty(props, "output", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationName = props.applicationName;
    this.output = props.output;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationName": this.applicationName,
      "output": this.output
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplicationOutput.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationOutputPropsToCloudFormation(props);
  }
}

export namespace CfnApplicationOutput {
  /**
   * Describes application output configuration in which you identify an in-application stream and a destination where you want the in-application stream data to be written.
   *
   * The destination can be an Amazon Kinesis stream or an Amazon Kinesis Firehose delivery stream.
   *
   * For limits on how many destinations an application can write and other limitations, see [Limits](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/limits.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html
   */
  export interface OutputProperty {
    /**
     * Describes the data format when records are written to the destination.
     *
     * For more information, see [Configuring Application Output](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-output.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-destinationschema
     */
    readonly destinationSchema: CfnApplicationOutput.DestinationSchemaProperty | cdk.IResolvable;

    /**
     * Identifies an Amazon Kinesis Firehose delivery stream as the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-kinesisfirehoseoutput
     */
    readonly kinesisFirehoseOutput?: cdk.IResolvable | CfnApplicationOutput.KinesisFirehoseOutputProperty;

    /**
     * Identifies an Amazon Kinesis stream as the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-kinesisstreamsoutput
     */
    readonly kinesisStreamsOutput?: cdk.IResolvable | CfnApplicationOutput.KinesisStreamsOutputProperty;

    /**
     * Identifies an AWS Lambda function as the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-lambdaoutput
     */
    readonly lambdaOutput?: cdk.IResolvable | CfnApplicationOutput.LambdaOutputProperty;

    /**
     * Name of the in-application stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-output.html#cfn-kinesisanalytics-applicationoutput-output-name
     */
    readonly name?: string;
  }

  /**
   * Describes the data format when records are written to the destination.
   *
   * For more information, see [Configuring Application Output](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-output.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-destinationschema.html
   */
  export interface DestinationSchemaProperty {
    /**
     * Specifies the format of the records on the output stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-destinationschema.html#cfn-kinesisanalytics-applicationoutput-destinationschema-recordformattype
     */
    readonly recordFormatType?: string;
  }

  /**
   * When configuring application output, identifies an AWS Lambda function as the destination.
   *
   * You provide the function Amazon Resource Name (ARN) and also an IAM role ARN that Amazon Kinesis Analytics can use to write to the function on your behalf.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-lambdaoutput.html
   */
  export interface LambdaOutputProperty {
    /**
     * Amazon Resource Name (ARN) of the destination Lambda function to write to.
     *
     * > To specify an earlier version of the Lambda function than the latest, include the Lambda function version in the Lambda function ARN. For more information about Lambda ARNs, see [Example ARNs: AWS Lambda](https://docs.aws.amazon.com//general/latest/gr/aws-arns-and-namespaces.html#arn-syntax-lambda)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-lambdaoutput.html#cfn-kinesisanalytics-applicationoutput-lambdaoutput-resourcearn
     */
    readonly resourceArn: string;

    /**
     * ARN of the IAM role that Amazon Kinesis Analytics can assume to write to the destination function on your behalf.
     *
     * You need to grant the necessary permissions to this role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-lambdaoutput.html#cfn-kinesisanalytics-applicationoutput-lambdaoutput-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * When configuring application output, identifies an Amazon Kinesis Firehose delivery stream as the destination.
   *
   * You provide the stream Amazon Resource Name (ARN) and an IAM role that enables Amazon Kinesis Analytics to write to the stream on your behalf.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-kinesisfirehoseoutput.html
   */
  export interface KinesisFirehoseOutputProperty {
    /**
     * ARN of the destination Amazon Kinesis Firehose delivery stream to write to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-kinesisfirehoseoutput.html#cfn-kinesisanalytics-applicationoutput-kinesisfirehoseoutput-resourcearn
     */
    readonly resourceArn: string;

    /**
     * ARN of the IAM role that Amazon Kinesis Analytics can assume to write to the destination stream on your behalf.
     *
     * You need to grant the necessary permissions to this role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-kinesisfirehoseoutput.html#cfn-kinesisanalytics-applicationoutput-kinesisfirehoseoutput-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * When configuring application output, identifies an Amazon Kinesis stream as the destination.
   *
   * You provide the stream Amazon Resource Name (ARN) and also an IAM role ARN that Amazon Kinesis Analytics can use to write to the stream on your behalf.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-kinesisstreamsoutput.html
   */
  export interface KinesisStreamsOutputProperty {
    /**
     * ARN of the destination Amazon Kinesis stream to write to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-kinesisstreamsoutput.html#cfn-kinesisanalytics-applicationoutput-kinesisstreamsoutput-resourcearn
     */
    readonly resourceArn: string;

    /**
     * ARN of the IAM role that Amazon Kinesis Analytics can assume to write to the destination stream on your behalf.
     *
     * You need to grant the necessary permissions to this role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationoutput-kinesisstreamsoutput.html#cfn-kinesisanalytics-applicationoutput-kinesisstreamsoutput-rolearn
     */
    readonly roleArn: string;
  }
}

/**
 * Properties for defining a `CfnApplicationOutput`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html
 */
export interface CfnApplicationOutputProps {
  /**
   * Name of the application to which you want to add the output configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html#cfn-kinesisanalytics-applicationoutput-applicationname
   */
  readonly applicationName: string;

  /**
   * An array of objects, each describing one output configuration.
   *
   * In the output configuration, you specify the name of an in-application stream, a destination (that is, an Amazon Kinesis stream, an Amazon Kinesis Firehose delivery stream, or an AWS Lambda function), and record the formation to use when writing to the destination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationoutput.html#cfn-kinesisanalytics-applicationoutput-output
   */
  readonly output: cdk.IResolvable | CfnApplicationOutput.OutputProperty;
}

/**
 * Determine whether the given properties match those of a `DestinationSchemaProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationSchemaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationOutputDestinationSchemaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("recordFormatType", cdk.validateString)(properties.recordFormatType));
  return errors.wrap("supplied properties not correct for \"DestinationSchemaProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationOutputDestinationSchemaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationOutputDestinationSchemaPropertyValidator(properties).assertSuccess();
  return {
    "RecordFormatType": cdk.stringToCloudFormation(properties.recordFormatType)
  };
}

// @ts-ignore TS6133
function CfnApplicationOutputDestinationSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationOutput.DestinationSchemaProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.DestinationSchemaProperty>();
  ret.addPropertyResult("recordFormatType", "RecordFormatType", (properties.RecordFormatType != null ? cfn_parse.FromCloudFormation.getString(properties.RecordFormatType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaOutputProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaOutputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationOutputLambdaOutputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"LambdaOutputProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationOutputLambdaOutputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationOutputLambdaOutputPropertyValidator(properties).assertSuccess();
  return {
    "ResourceARN": cdk.stringToCloudFormation(properties.resourceArn),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnApplicationOutputLambdaOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationOutput.LambdaOutputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.LambdaOutputProperty>();
  ret.addPropertyResult("resourceArn", "ResourceARN", (properties.ResourceARN != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceARN) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KinesisFirehoseOutputProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseOutputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationOutputKinesisFirehoseOutputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"KinesisFirehoseOutputProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationOutputKinesisFirehoseOutputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationOutputKinesisFirehoseOutputPropertyValidator(properties).assertSuccess();
  return {
    "ResourceARN": cdk.stringToCloudFormation(properties.resourceArn),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnApplicationOutputKinesisFirehoseOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationOutput.KinesisFirehoseOutputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.KinesisFirehoseOutputProperty>();
  ret.addPropertyResult("resourceArn", "ResourceARN", (properties.ResourceARN != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceARN) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KinesisStreamsOutputProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisStreamsOutputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationOutputKinesisStreamsOutputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("resourceArn", cdk.requiredValidator)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("resourceArn", cdk.validateString)(properties.resourceArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"KinesisStreamsOutputProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationOutputKinesisStreamsOutputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationOutputKinesisStreamsOutputPropertyValidator(properties).assertSuccess();
  return {
    "ResourceARN": cdk.stringToCloudFormation(properties.resourceArn),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnApplicationOutputKinesisStreamsOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationOutput.KinesisStreamsOutputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.KinesisStreamsOutputProperty>();
  ret.addPropertyResult("resourceArn", "ResourceARN", (properties.ResourceARN != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceARN) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OutputProperty`
 *
 * @param properties - the TypeScript properties of a `OutputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationOutputOutputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationSchema", cdk.requiredValidator)(properties.destinationSchema));
  errors.collect(cdk.propertyValidator("destinationSchema", CfnApplicationOutputDestinationSchemaPropertyValidator)(properties.destinationSchema));
  errors.collect(cdk.propertyValidator("kinesisFirehoseOutput", CfnApplicationOutputKinesisFirehoseOutputPropertyValidator)(properties.kinesisFirehoseOutput));
  errors.collect(cdk.propertyValidator("kinesisStreamsOutput", CfnApplicationOutputKinesisStreamsOutputPropertyValidator)(properties.kinesisStreamsOutput));
  errors.collect(cdk.propertyValidator("lambdaOutput", CfnApplicationOutputLambdaOutputPropertyValidator)(properties.lambdaOutput));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"OutputProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationOutputOutputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationOutputOutputPropertyValidator(properties).assertSuccess();
  return {
    "DestinationSchema": convertCfnApplicationOutputDestinationSchemaPropertyToCloudFormation(properties.destinationSchema),
    "KinesisFirehoseOutput": convertCfnApplicationOutputKinesisFirehoseOutputPropertyToCloudFormation(properties.kinesisFirehoseOutput),
    "KinesisStreamsOutput": convertCfnApplicationOutputKinesisStreamsOutputPropertyToCloudFormation(properties.kinesisStreamsOutput),
    "LambdaOutput": convertCfnApplicationOutputLambdaOutputPropertyToCloudFormation(properties.lambdaOutput),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnApplicationOutputOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationOutput.OutputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutput.OutputProperty>();
  ret.addPropertyResult("destinationSchema", "DestinationSchema", (properties.DestinationSchema != null ? CfnApplicationOutputDestinationSchemaPropertyFromCloudFormation(properties.DestinationSchema) : undefined));
  ret.addPropertyResult("kinesisFirehoseOutput", "KinesisFirehoseOutput", (properties.KinesisFirehoseOutput != null ? CfnApplicationOutputKinesisFirehoseOutputPropertyFromCloudFormation(properties.KinesisFirehoseOutput) : undefined));
  ret.addPropertyResult("kinesisStreamsOutput", "KinesisStreamsOutput", (properties.KinesisStreamsOutput != null ? CfnApplicationOutputKinesisStreamsOutputPropertyFromCloudFormation(properties.KinesisStreamsOutput) : undefined));
  ret.addPropertyResult("lambdaOutput", "LambdaOutput", (properties.LambdaOutput != null ? CfnApplicationOutputLambdaOutputPropertyFromCloudFormation(properties.LambdaOutput) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationOutputProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationOutputProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationOutputPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationName", cdk.requiredValidator)(properties.applicationName));
  errors.collect(cdk.propertyValidator("applicationName", cdk.validateString)(properties.applicationName));
  errors.collect(cdk.propertyValidator("output", cdk.requiredValidator)(properties.output));
  errors.collect(cdk.propertyValidator("output", CfnApplicationOutputOutputPropertyValidator)(properties.output));
  return errors.wrap("supplied properties not correct for \"CfnApplicationOutputProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationOutputPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationOutputPropsValidator(properties).assertSuccess();
  return {
    "ApplicationName": cdk.stringToCloudFormation(properties.applicationName),
    "Output": convertCfnApplicationOutputOutputPropertyToCloudFormation(properties.output)
  };
}

// @ts-ignore TS6133
function CfnApplicationOutputPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationOutputProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationOutputProps>();
  ret.addPropertyResult("applicationName", "ApplicationName", (properties.ApplicationName != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationName) : undefined));
  ret.addPropertyResult("output", "Output", (properties.Output != null ? CfnApplicationOutputOutputPropertyFromCloudFormation(properties.Output) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Adds a reference data source to an existing application.
 *
 * Amazon Kinesis Analytics reads reference data (that is, an Amazon S3 object) and creates an in-application table within your application. In the request, you provide the source (S3 bucket name and object key name), name of the in-application table to create, and the necessary mapping information that describes how data in Amazon S3 object maps to columns in the resulting in-application table.
 *
 * For conceptual information, see [Configuring Application Input](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/how-it-works-input.html) . For the limits on data sources you can add to your application, see [Limits](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/limits.html) .
 *
 * This operation requires permissions to perform the `kinesisanalytics:AddApplicationOutput` action.
 *
 * @cloudformationResource AWS::KinesisAnalytics::ApplicationReferenceDataSource
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationreferencedatasource.html
 */
export class CfnApplicationReferenceDataSource extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::KinesisAnalytics::ApplicationReferenceDataSource";

  /**
   * Build a CfnApplicationReferenceDataSource from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationReferenceDataSource {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationReferenceDataSourcePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplicationReferenceDataSource(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Name of an existing application.
   */
  public applicationName: string;

  /**
   * The reference data source can be an object in your Amazon S3 bucket.
   */
  public referenceDataSource: cdk.IResolvable | CfnApplicationReferenceDataSource.ReferenceDataSourceProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationReferenceDataSourceProps) {
    super(scope, id, {
      "type": CfnApplicationReferenceDataSource.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "applicationName", this);
    cdk.requireProperty(props, "referenceDataSource", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.applicationName = props.applicationName;
    this.referenceDataSource = props.referenceDataSource;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "applicationName": this.applicationName,
      "referenceDataSource": this.referenceDataSource
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplicationReferenceDataSource.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationReferenceDataSourcePropsToCloudFormation(props);
  }
}

export namespace CfnApplicationReferenceDataSource {
  /**
   * Describes the reference data source by providing the source information (S3 bucket name and object key name), the resulting in-application table name that is created, and the necessary schema to map the data elements in the Amazon S3 object to the in-application table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referencedatasource.html
   */
  export interface ReferenceDataSourceProperty {
    /**
     * Describes the format of the data in the streaming source, and how each data element maps to corresponding columns created in the in-application stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-referencedatasource-referenceschema
     */
    readonly referenceSchema: cdk.IResolvable | CfnApplicationReferenceDataSource.ReferenceSchemaProperty;

    /**
     * Identifies the S3 bucket and object that contains the reference data.
     *
     * Also identifies the IAM role Amazon Kinesis Analytics can assume to read this object on your behalf. An Amazon Kinesis Analytics application loads reference data only once. If the data changes, you call the `UpdateApplication` operation to trigger reloading of data into your application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-referencedatasource-s3referencedatasource
     */
    readonly s3ReferenceDataSource?: cdk.IResolvable | CfnApplicationReferenceDataSource.S3ReferenceDataSourceProperty;

    /**
     * Name of the in-application table to create.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-referencedatasource-tablename
     */
    readonly tableName?: string;
  }

  /**
   * The ReferenceSchema property type specifies the format of the data in the reference source for a SQL-based Amazon Kinesis Data Analytics application.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referenceschema.html
   */
  export interface ReferenceSchemaProperty {
    /**
     * A list of RecordColumn objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referenceschema.html#cfn-kinesisanalytics-applicationreferencedatasource-referenceschema-recordcolumns
     */
    readonly recordColumns: Array<cdk.IResolvable | CfnApplicationReferenceDataSource.RecordColumnProperty> | cdk.IResolvable;

    /**
     * Specifies the encoding of the records in the reference source.
     *
     * For example, UTF-8.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referenceschema.html#cfn-kinesisanalytics-applicationreferencedatasource-referenceschema-recordencoding
     */
    readonly recordEncoding?: string;

    /**
     * Specifies the format of the records on the reference source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-referenceschema.html#cfn-kinesisanalytics-applicationreferencedatasource-referenceschema-recordformat
     */
    readonly recordFormat: cdk.IResolvable | CfnApplicationReferenceDataSource.RecordFormatProperty;
  }

  /**
   * Describes the mapping of each data element in the streaming source to the corresponding column in the in-application stream.
   *
   * Also used to describe the format of the reference data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordcolumn.html
   */
  export interface RecordColumnProperty {
    /**
     * Reference to the data element in the streaming input or the reference data source.
     *
     * This element is required if the [RecordFormatType](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/API_RecordFormat.html#analytics-Type-RecordFormat-RecordFormatTypel) is `JSON` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordcolumn.html#cfn-kinesisanalytics-applicationreferencedatasource-recordcolumn-mapping
     */
    readonly mapping?: string;

    /**
     * Name of the column created in the in-application input stream or reference table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordcolumn.html#cfn-kinesisanalytics-applicationreferencedatasource-recordcolumn-name
     */
    readonly name: string;

    /**
     * Type of column created in the in-application input stream or reference table.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordcolumn.html#cfn-kinesisanalytics-applicationreferencedatasource-recordcolumn-sqltype
     */
    readonly sqlType: string;
  }

  /**
   * Describes the record format and relevant mapping information that should be applied to schematize the records on the stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordformat.html
   */
  export interface RecordFormatProperty {
    /**
     * When configuring application input at the time of creating or updating an application, provides additional mapping information specific to the record format (such as JSON, CSV, or record fields delimited by some delimiter) on the streaming source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordformat.html#cfn-kinesisanalytics-applicationreferencedatasource-recordformat-mappingparameters
     */
    readonly mappingParameters?: cdk.IResolvable | CfnApplicationReferenceDataSource.MappingParametersProperty;

    /**
     * The type of record format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-recordformat.html#cfn-kinesisanalytics-applicationreferencedatasource-recordformat-recordformattype
     */
    readonly recordFormatType: string;
  }

  /**
   * When configuring application input at the time of creating or updating an application, provides additional mapping information specific to the record format (such as JSON, CSV, or record fields delimited by some delimiter) on the streaming source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-mappingparameters.html
   */
  export interface MappingParametersProperty {
    /**
     * Provides additional mapping information when the record format uses delimiters (for example, CSV).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-mappingparameters.html#cfn-kinesisanalytics-applicationreferencedatasource-mappingparameters-csvmappingparameters
     */
    readonly csvMappingParameters?: CfnApplicationReferenceDataSource.CSVMappingParametersProperty | cdk.IResolvable;

    /**
     * Provides additional mapping information when JSON is the record format on the streaming source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-mappingparameters.html#cfn-kinesisanalytics-applicationreferencedatasource-mappingparameters-jsonmappingparameters
     */
    readonly jsonMappingParameters?: cdk.IResolvable | CfnApplicationReferenceDataSource.JSONMappingParametersProperty;
  }

  /**
   * Provides additional mapping information when JSON is the record format on the streaming source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-jsonmappingparameters.html
   */
  export interface JSONMappingParametersProperty {
    /**
     * Path to the top-level parent that contains the records.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-jsonmappingparameters.html#cfn-kinesisanalytics-applicationreferencedatasource-jsonmappingparameters-recordrowpath
     */
    readonly recordRowPath: string;
  }

  /**
   * Provides additional mapping information when the record format uses delimiters, such as CSV.
   *
   * For example, the following sample records use CSV format, where the records use the *'\n'* as the row delimiter and a comma (",") as the column delimiter:
   *
   * `"name1", "address1"`
   *
   * `"name2", "address2"`
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-csvmappingparameters.html
   */
  export interface CSVMappingParametersProperty {
    /**
     * Column delimiter.
     *
     * For example, in a CSV format, a comma (",") is the typical column delimiter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-csvmappingparameters.html#cfn-kinesisanalytics-applicationreferencedatasource-csvmappingparameters-recordcolumndelimiter
     */
    readonly recordColumnDelimiter: string;

    /**
     * Row delimiter.
     *
     * For example, in a CSV format, *'\n'* is the typical row delimiter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-csvmappingparameters.html#cfn-kinesisanalytics-applicationreferencedatasource-csvmappingparameters-recordrowdelimiter
     */
    readonly recordRowDelimiter: string;
  }

  /**
   * Identifies the S3 bucket and object that contains the reference data.
   *
   * Also identifies the IAM role Amazon Kinesis Analytics can assume to read this object on your behalf.
   *
   * An Amazon Kinesis Analytics application loads reference data only once. If the data changes, you call the [UpdateApplication](https://docs.aws.amazon.com/kinesisanalytics/latest/dev/API_UpdateApplication.html) operation to trigger reloading of data into your application.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-s3referencedatasource.html
   */
  export interface S3ReferenceDataSourceProperty {
    /**
     * Amazon Resource Name (ARN) of the S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-s3referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-s3referencedatasource-bucketarn
     */
    readonly bucketArn: string;

    /**
     * Object key name containing reference data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-s3referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-s3referencedatasource-filekey
     */
    readonly fileKey: string;

    /**
     * ARN of the IAM role that the service can assume to read data on your behalf.
     *
     * This role must have permission for the `s3:GetObject` action on the object and trust policy that allows Amazon Kinesis Analytics service principal to assume this role.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisanalytics-applicationreferencedatasource-s3referencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-s3referencedatasource-referencerolearn
     */
    readonly referenceRoleArn: string;
  }
}

/**
 * Properties for defining a `CfnApplicationReferenceDataSource`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationreferencedatasource.html
 */
export interface CfnApplicationReferenceDataSourceProps {
  /**
   * Name of an existing application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationreferencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-applicationname
   */
  readonly applicationName: string;

  /**
   * The reference data source can be an object in your Amazon S3 bucket.
   *
   * Amazon Kinesis Analytics reads the object and copies the data into the in-application table that is created. You provide an S3 bucket, object key name, and the resulting in-application table that is created. You must also provide an IAM role with the necessary permissions that Amazon Kinesis Analytics can assume to read the object from your S3 bucket on your behalf.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisanalytics-applicationreferencedatasource.html#cfn-kinesisanalytics-applicationreferencedatasource-referencedatasource
   */
  readonly referenceDataSource: cdk.IResolvable | CfnApplicationReferenceDataSource.ReferenceDataSourceProperty;
}

/**
 * Determine whether the given properties match those of a `RecordColumnProperty`
 *
 * @param properties - the TypeScript properties of a `RecordColumnProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceRecordColumnPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mapping", cdk.validateString)(properties.mapping));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("sqlType", cdk.requiredValidator)(properties.sqlType));
  errors.collect(cdk.propertyValidator("sqlType", cdk.validateString)(properties.sqlType));
  return errors.wrap("supplied properties not correct for \"RecordColumnProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationReferenceDataSourceRecordColumnPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationReferenceDataSourceRecordColumnPropertyValidator(properties).assertSuccess();
  return {
    "Mapping": cdk.stringToCloudFormation(properties.mapping),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SqlType": cdk.stringToCloudFormation(properties.sqlType)
  };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceRecordColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationReferenceDataSource.RecordColumnProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.RecordColumnProperty>();
  ret.addPropertyResult("mapping", "Mapping", (properties.Mapping != null ? cfn_parse.FromCloudFormation.getString(properties.Mapping) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("sqlType", "SqlType", (properties.SqlType != null ? cfn_parse.FromCloudFormation.getString(properties.SqlType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JSONMappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `JSONMappingParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceJSONMappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("recordRowPath", cdk.requiredValidator)(properties.recordRowPath));
  errors.collect(cdk.propertyValidator("recordRowPath", cdk.validateString)(properties.recordRowPath));
  return errors.wrap("supplied properties not correct for \"JSONMappingParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationReferenceDataSourceJSONMappingParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationReferenceDataSourceJSONMappingParametersPropertyValidator(properties).assertSuccess();
  return {
    "RecordRowPath": cdk.stringToCloudFormation(properties.recordRowPath)
  };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceJSONMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationReferenceDataSource.JSONMappingParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.JSONMappingParametersProperty>();
  ret.addPropertyResult("recordRowPath", "RecordRowPath", (properties.RecordRowPath != null ? cfn_parse.FromCloudFormation.getString(properties.RecordRowPath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CSVMappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `CSVMappingParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceCSVMappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("recordColumnDelimiter", cdk.requiredValidator)(properties.recordColumnDelimiter));
  errors.collect(cdk.propertyValidator("recordColumnDelimiter", cdk.validateString)(properties.recordColumnDelimiter));
  errors.collect(cdk.propertyValidator("recordRowDelimiter", cdk.requiredValidator)(properties.recordRowDelimiter));
  errors.collect(cdk.propertyValidator("recordRowDelimiter", cdk.validateString)(properties.recordRowDelimiter));
  return errors.wrap("supplied properties not correct for \"CSVMappingParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationReferenceDataSourceCSVMappingParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationReferenceDataSourceCSVMappingParametersPropertyValidator(properties).assertSuccess();
  return {
    "RecordColumnDelimiter": cdk.stringToCloudFormation(properties.recordColumnDelimiter),
    "RecordRowDelimiter": cdk.stringToCloudFormation(properties.recordRowDelimiter)
  };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceCSVMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSource.CSVMappingParametersProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.CSVMappingParametersProperty>();
  ret.addPropertyResult("recordColumnDelimiter", "RecordColumnDelimiter", (properties.RecordColumnDelimiter != null ? cfn_parse.FromCloudFormation.getString(properties.RecordColumnDelimiter) : undefined));
  ret.addPropertyResult("recordRowDelimiter", "RecordRowDelimiter", (properties.RecordRowDelimiter != null ? cfn_parse.FromCloudFormation.getString(properties.RecordRowDelimiter) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MappingParametersProperty`
 *
 * @param properties - the TypeScript properties of a `MappingParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceMappingParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("csvMappingParameters", CfnApplicationReferenceDataSourceCSVMappingParametersPropertyValidator)(properties.csvMappingParameters));
  errors.collect(cdk.propertyValidator("jsonMappingParameters", CfnApplicationReferenceDataSourceJSONMappingParametersPropertyValidator)(properties.jsonMappingParameters));
  return errors.wrap("supplied properties not correct for \"MappingParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationReferenceDataSourceMappingParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationReferenceDataSourceMappingParametersPropertyValidator(properties).assertSuccess();
  return {
    "CSVMappingParameters": convertCfnApplicationReferenceDataSourceCSVMappingParametersPropertyToCloudFormation(properties.csvMappingParameters),
    "JSONMappingParameters": convertCfnApplicationReferenceDataSourceJSONMappingParametersPropertyToCloudFormation(properties.jsonMappingParameters)
  };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceMappingParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationReferenceDataSource.MappingParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.MappingParametersProperty>();
  ret.addPropertyResult("csvMappingParameters", "CSVMappingParameters", (properties.CSVMappingParameters != null ? CfnApplicationReferenceDataSourceCSVMappingParametersPropertyFromCloudFormation(properties.CSVMappingParameters) : undefined));
  ret.addPropertyResult("jsonMappingParameters", "JSONMappingParameters", (properties.JSONMappingParameters != null ? CfnApplicationReferenceDataSourceJSONMappingParametersPropertyFromCloudFormation(properties.JSONMappingParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RecordFormatProperty`
 *
 * @param properties - the TypeScript properties of a `RecordFormatProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceRecordFormatPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mappingParameters", CfnApplicationReferenceDataSourceMappingParametersPropertyValidator)(properties.mappingParameters));
  errors.collect(cdk.propertyValidator("recordFormatType", cdk.requiredValidator)(properties.recordFormatType));
  errors.collect(cdk.propertyValidator("recordFormatType", cdk.validateString)(properties.recordFormatType));
  return errors.wrap("supplied properties not correct for \"RecordFormatProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationReferenceDataSourceRecordFormatPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationReferenceDataSourceRecordFormatPropertyValidator(properties).assertSuccess();
  return {
    "MappingParameters": convertCfnApplicationReferenceDataSourceMappingParametersPropertyToCloudFormation(properties.mappingParameters),
    "RecordFormatType": cdk.stringToCloudFormation(properties.recordFormatType)
  };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceRecordFormatPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationReferenceDataSource.RecordFormatProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.RecordFormatProperty>();
  ret.addPropertyResult("mappingParameters", "MappingParameters", (properties.MappingParameters != null ? CfnApplicationReferenceDataSourceMappingParametersPropertyFromCloudFormation(properties.MappingParameters) : undefined));
  ret.addPropertyResult("recordFormatType", "RecordFormatType", (properties.RecordFormatType != null ? cfn_parse.FromCloudFormation.getString(properties.RecordFormatType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReferenceSchemaProperty`
 *
 * @param properties - the TypeScript properties of a `ReferenceSchemaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceReferenceSchemaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("recordColumns", cdk.requiredValidator)(properties.recordColumns));
  errors.collect(cdk.propertyValidator("recordColumns", cdk.listValidator(CfnApplicationReferenceDataSourceRecordColumnPropertyValidator))(properties.recordColumns));
  errors.collect(cdk.propertyValidator("recordEncoding", cdk.validateString)(properties.recordEncoding));
  errors.collect(cdk.propertyValidator("recordFormat", cdk.requiredValidator)(properties.recordFormat));
  errors.collect(cdk.propertyValidator("recordFormat", CfnApplicationReferenceDataSourceRecordFormatPropertyValidator)(properties.recordFormat));
  return errors.wrap("supplied properties not correct for \"ReferenceSchemaProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationReferenceDataSourceReferenceSchemaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationReferenceDataSourceReferenceSchemaPropertyValidator(properties).assertSuccess();
  return {
    "RecordColumns": cdk.listMapper(convertCfnApplicationReferenceDataSourceRecordColumnPropertyToCloudFormation)(properties.recordColumns),
    "RecordEncoding": cdk.stringToCloudFormation(properties.recordEncoding),
    "RecordFormat": convertCfnApplicationReferenceDataSourceRecordFormatPropertyToCloudFormation(properties.recordFormat)
  };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceReferenceSchemaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationReferenceDataSource.ReferenceSchemaProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.ReferenceSchemaProperty>();
  ret.addPropertyResult("recordColumns", "RecordColumns", (properties.RecordColumns != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationReferenceDataSourceRecordColumnPropertyFromCloudFormation)(properties.RecordColumns) : undefined));
  ret.addPropertyResult("recordEncoding", "RecordEncoding", (properties.RecordEncoding != null ? cfn_parse.FromCloudFormation.getString(properties.RecordEncoding) : undefined));
  ret.addPropertyResult("recordFormat", "RecordFormat", (properties.RecordFormat != null ? CfnApplicationReferenceDataSourceRecordFormatPropertyFromCloudFormation(properties.RecordFormat) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3ReferenceDataSourceProperty`
 *
 * @param properties - the TypeScript properties of a `S3ReferenceDataSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketArn", cdk.requiredValidator)(properties.bucketArn));
  errors.collect(cdk.propertyValidator("bucketArn", cdk.validateString)(properties.bucketArn));
  errors.collect(cdk.propertyValidator("fileKey", cdk.requiredValidator)(properties.fileKey));
  errors.collect(cdk.propertyValidator("fileKey", cdk.validateString)(properties.fileKey));
  errors.collect(cdk.propertyValidator("referenceRoleArn", cdk.requiredValidator)(properties.referenceRoleArn));
  errors.collect(cdk.propertyValidator("referenceRoleArn", cdk.validateString)(properties.referenceRoleArn));
  return errors.wrap("supplied properties not correct for \"S3ReferenceDataSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyValidator(properties).assertSuccess();
  return {
    "BucketARN": cdk.stringToCloudFormation(properties.bucketArn),
    "FileKey": cdk.stringToCloudFormation(properties.fileKey),
    "ReferenceRoleARN": cdk.stringToCloudFormation(properties.referenceRoleArn)
  };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationReferenceDataSource.S3ReferenceDataSourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.S3ReferenceDataSourceProperty>();
  ret.addPropertyResult("bucketArn", "BucketARN", (properties.BucketARN != null ? cfn_parse.FromCloudFormation.getString(properties.BucketARN) : undefined));
  ret.addPropertyResult("fileKey", "FileKey", (properties.FileKey != null ? cfn_parse.FromCloudFormation.getString(properties.FileKey) : undefined));
  ret.addPropertyResult("referenceRoleArn", "ReferenceRoleARN", (properties.ReferenceRoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.ReferenceRoleARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReferenceDataSourceProperty`
 *
 * @param properties - the TypeScript properties of a `ReferenceDataSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceReferenceDataSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("referenceSchema", cdk.requiredValidator)(properties.referenceSchema));
  errors.collect(cdk.propertyValidator("referenceSchema", CfnApplicationReferenceDataSourceReferenceSchemaPropertyValidator)(properties.referenceSchema));
  errors.collect(cdk.propertyValidator("s3ReferenceDataSource", CfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyValidator)(properties.s3ReferenceDataSource));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"ReferenceDataSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationReferenceDataSourceReferenceDataSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationReferenceDataSourceReferenceDataSourcePropertyValidator(properties).assertSuccess();
  return {
    "ReferenceSchema": convertCfnApplicationReferenceDataSourceReferenceSchemaPropertyToCloudFormation(properties.referenceSchema),
    "S3ReferenceDataSource": convertCfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyToCloudFormation(properties.s3ReferenceDataSource),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourceReferenceDataSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplicationReferenceDataSource.ReferenceDataSourceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSource.ReferenceDataSourceProperty>();
  ret.addPropertyResult("referenceSchema", "ReferenceSchema", (properties.ReferenceSchema != null ? CfnApplicationReferenceDataSourceReferenceSchemaPropertyFromCloudFormation(properties.ReferenceSchema) : undefined));
  ret.addPropertyResult("s3ReferenceDataSource", "S3ReferenceDataSource", (properties.S3ReferenceDataSource != null ? CfnApplicationReferenceDataSourceS3ReferenceDataSourcePropertyFromCloudFormation(properties.S3ReferenceDataSource) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationReferenceDataSourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationReferenceDataSourceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationReferenceDataSourcePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationName", cdk.requiredValidator)(properties.applicationName));
  errors.collect(cdk.propertyValidator("applicationName", cdk.validateString)(properties.applicationName));
  errors.collect(cdk.propertyValidator("referenceDataSource", cdk.requiredValidator)(properties.referenceDataSource));
  errors.collect(cdk.propertyValidator("referenceDataSource", CfnApplicationReferenceDataSourceReferenceDataSourcePropertyValidator)(properties.referenceDataSource));
  return errors.wrap("supplied properties not correct for \"CfnApplicationReferenceDataSourceProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationReferenceDataSourcePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationReferenceDataSourcePropsValidator(properties).assertSuccess();
  return {
    "ApplicationName": cdk.stringToCloudFormation(properties.applicationName),
    "ReferenceDataSource": convertCfnApplicationReferenceDataSourceReferenceDataSourcePropertyToCloudFormation(properties.referenceDataSource)
  };
}

// @ts-ignore TS6133
function CfnApplicationReferenceDataSourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationReferenceDataSourceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationReferenceDataSourceProps>();
  ret.addPropertyResult("applicationName", "ApplicationName", (properties.ApplicationName != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationName) : undefined));
  ret.addPropertyResult("referenceDataSource", "ReferenceDataSource", (properties.ReferenceDataSource != null ? CfnApplicationReferenceDataSourceReferenceDataSourcePropertyFromCloudFormation(properties.ReferenceDataSource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}