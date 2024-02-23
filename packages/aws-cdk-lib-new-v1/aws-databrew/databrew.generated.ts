/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specifies a new DataBrew dataset.
 *
 * @cloudformationResource AWS::DataBrew::Dataset
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-dataset.html
 */
export class CfnDataset extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataBrew::Dataset";

  /**
   * Build a CfnDataset from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataset {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDatasetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDataset(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The file format of a dataset that is created from an Amazon S3 file or folder.
   */
  public format?: string;

  /**
   * A set of options that define how DataBrew interprets the data in the dataset.
   */
  public formatOptions?: CfnDataset.FormatOptionsProperty | cdk.IResolvable;

  /**
   * Information on how DataBrew can find the dataset, in either the AWS Glue Data Catalog or Amazon S3 .
   */
  public input: CfnDataset.InputProperty | cdk.IResolvable;

  /**
   * The unique name of the dataset.
   */
  public name: string;

  /**
   * A set of options that defines how DataBrew interprets an Amazon S3 path of the dataset.
   */
  public pathOptions?: cdk.IResolvable | CfnDataset.PathOptionsProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata tags that have been applied to the dataset.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDatasetProps) {
    super(scope, id, {
      "type": CfnDataset.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "input", this);
    cdk.requireProperty(props, "name", this);

    this.format = props.format;
    this.formatOptions = props.formatOptions;
    this.input = props.input;
    this.name = props.name;
    this.pathOptions = props.pathOptions;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataBrew::Dataset", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "format": this.format,
      "formatOptions": this.formatOptions,
      "input": this.input,
      "name": this.name,
      "pathOptions": this.pathOptions,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataset.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDatasetPropsToCloudFormation(props);
  }
}

export namespace CfnDataset {
  /**
   * Represents information on how DataBrew can find data, in either the AWS Glue Data Catalog or Amazon S3.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-input.html
   */
  export interface InputProperty {
    /**
     * Connection information for dataset input files stored in a database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-input.html#cfn-databrew-dataset-input-databaseinputdefinition
     */
    readonly databaseInputDefinition?: CfnDataset.DatabaseInputDefinitionProperty | cdk.IResolvable;

    /**
     * The AWS Glue Data Catalog parameters for the data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-input.html#cfn-databrew-dataset-input-datacataloginputdefinition
     */
    readonly dataCatalogInputDefinition?: CfnDataset.DataCatalogInputDefinitionProperty | cdk.IResolvable;

    /**
     * Contains additional resource information needed for specific datasets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-input.html#cfn-databrew-dataset-input-metadata
     */
    readonly metadata?: cdk.IResolvable | CfnDataset.MetadataProperty;

    /**
     * The Amazon S3 location where the data is stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-input.html#cfn-databrew-dataset-input-s3inputdefinition
     */
    readonly s3InputDefinition?: cdk.IResolvable | CfnDataset.S3LocationProperty;
  }

  /**
   * Connection information for dataset input files stored in a database.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-databaseinputdefinition.html
   */
  export interface DatabaseInputDefinitionProperty {
    /**
     * The table within the target database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-databaseinputdefinition.html#cfn-databrew-dataset-databaseinputdefinition-databasetablename
     */
    readonly databaseTableName?: string;

    /**
     * The AWS Glue Connection that stores the connection information for the target database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-databaseinputdefinition.html#cfn-databrew-dataset-databaseinputdefinition-glueconnectionname
     */
    readonly glueConnectionName: string;

    /**
     * Custom SQL to run against the provided AWS Glue connection.
     *
     * This SQL will be used as the input for DataBrew projects and jobs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-databaseinputdefinition.html#cfn-databrew-dataset-databaseinputdefinition-querystring
     */
    readonly queryString?: string;

    /**
     * An Amazon location that AWS Glue Data Catalog can use as a temporary directory.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-databaseinputdefinition.html#cfn-databrew-dataset-databaseinputdefinition-tempdirectory
     */
    readonly tempDirectory?: cdk.IResolvable | CfnDataset.S3LocationProperty;
  }

  /**
   * Represents an Amazon S3 location (bucket name, bucket owner, and object key) where DataBrew can read input data, or write output from a job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * The Amazon S3 bucket name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-s3location.html#cfn-databrew-dataset-s3location-bucket
     */
    readonly bucket: string;

    /**
     * The unique name of the object in the bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-s3location.html#cfn-databrew-dataset-s3location-key
     */
    readonly key?: string;
  }

  /**
   * Contains additional resource information needed for specific datasets.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-metadata.html
   */
  export interface MetadataProperty {
    /**
     * The Amazon Resource Name (ARN) associated with the dataset.
     *
     * Currently, DataBrew only supports ARNs from Amazon AppFlow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-metadata.html#cfn-databrew-dataset-metadata-sourcearn
     */
    readonly sourceArn?: string;
  }

  /**
   * Represents how metadata stored in the AWS Glue Data Catalog is defined in a DataBrew dataset.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datacataloginputdefinition.html
   */
  export interface DataCatalogInputDefinitionProperty {
    /**
     * The unique identifier of the AWS account that holds the Data Catalog that stores the data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datacataloginputdefinition.html#cfn-databrew-dataset-datacataloginputdefinition-catalogid
     */
    readonly catalogId?: string;

    /**
     * The name of a database in the Data Catalog.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datacataloginputdefinition.html#cfn-databrew-dataset-datacataloginputdefinition-databasename
     */
    readonly databaseName?: string;

    /**
     * The name of a database table in the Data Catalog.
     *
     * This table corresponds to a DataBrew dataset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datacataloginputdefinition.html#cfn-databrew-dataset-datacataloginputdefinition-tablename
     */
    readonly tableName?: string;

    /**
     * An Amazon location that AWS Glue Data Catalog can use as a temporary directory.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datacataloginputdefinition.html#cfn-databrew-dataset-datacataloginputdefinition-tempdirectory
     */
    readonly tempDirectory?: cdk.IResolvable | CfnDataset.S3LocationProperty;
  }

  /**
   * Represents a set of options that define the structure of either comma-separated value (CSV), Excel, or JSON input.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-formatoptions.html
   */
  export interface FormatOptionsProperty {
    /**
     * Options that define how CSV input is to be interpreted by DataBrew.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-formatoptions.html#cfn-databrew-dataset-formatoptions-csv
     */
    readonly csv?: CfnDataset.CsvOptionsProperty | cdk.IResolvable;

    /**
     * Options that define how Excel input is to be interpreted by DataBrew.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-formatoptions.html#cfn-databrew-dataset-formatoptions-excel
     */
    readonly excel?: CfnDataset.ExcelOptionsProperty | cdk.IResolvable;

    /**
     * Options that define how JSON input is to be interpreted by DataBrew.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-formatoptions.html#cfn-databrew-dataset-formatoptions-json
     */
    readonly json?: cdk.IResolvable | CfnDataset.JsonOptionsProperty;
  }

  /**
   * Represents a set of options that define how DataBrew will interpret a Microsoft Excel file when creating a dataset from that file.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-exceloptions.html
   */
  export interface ExcelOptionsProperty {
    /**
     * A variable that specifies whether the first row in the file is parsed as the header.
     *
     * If this value is false, column names are auto-generated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-exceloptions.html#cfn-databrew-dataset-exceloptions-headerrow
     */
    readonly headerRow?: boolean | cdk.IResolvable;

    /**
     * One or more sheet numbers in the Excel file that will be included in the dataset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-exceloptions.html#cfn-databrew-dataset-exceloptions-sheetindexes
     */
    readonly sheetIndexes?: Array<number> | cdk.IResolvable;

    /**
     * One or more named sheets in the Excel file that will be included in the dataset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-exceloptions.html#cfn-databrew-dataset-exceloptions-sheetnames
     */
    readonly sheetNames?: Array<string>;
  }

  /**
   * Represents a set of options that define how DataBrew will read a comma-separated value (CSV) file when creating a dataset from that file.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-csvoptions.html
   */
  export interface CsvOptionsProperty {
    /**
     * A single character that specifies the delimiter being used in the CSV file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-csvoptions.html#cfn-databrew-dataset-csvoptions-delimiter
     */
    readonly delimiter?: string;

    /**
     * A variable that specifies whether the first row in the file is parsed as the header.
     *
     * If this value is false, column names are auto-generated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-csvoptions.html#cfn-databrew-dataset-csvoptions-headerrow
     */
    readonly headerRow?: boolean | cdk.IResolvable;
  }

  /**
   * Represents the JSON-specific options that define how input is to be interpreted by AWS Glue DataBrew .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-jsonoptions.html
   */
  export interface JsonOptionsProperty {
    /**
     * A value that specifies whether JSON input contains embedded new line characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-jsonoptions.html#cfn-databrew-dataset-jsonoptions-multiline
     */
    readonly multiLine?: boolean | cdk.IResolvable;
  }

  /**
   * Represents a set of options that define how DataBrew selects files for a given Amazon S3 path in a dataset.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-pathoptions.html
   */
  export interface PathOptionsProperty {
    /**
     * If provided, this structure imposes a limit on a number of files that should be selected.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-pathoptions.html#cfn-databrew-dataset-pathoptions-fileslimit
     */
    readonly filesLimit?: CfnDataset.FilesLimitProperty | cdk.IResolvable;

    /**
     * If provided, this structure defines a date range for matching Amazon S3 objects based on their LastModifiedDate attribute in Amazon S3 .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-pathoptions.html#cfn-databrew-dataset-pathoptions-lastmodifieddatecondition
     */
    readonly lastModifiedDateCondition?: CfnDataset.FilterExpressionProperty | cdk.IResolvable;

    /**
     * A structure that maps names of parameters used in the Amazon S3 path of a dataset to their definitions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-pathoptions.html#cfn-databrew-dataset-pathoptions-parameters
     */
    readonly parameters?: Array<cdk.IResolvable | CfnDataset.PathParameterProperty> | cdk.IResolvable;
  }

  /**
   * Represents a single entry in the path parameters of a dataset.
   *
   * Each `PathParameter` consists of a name and a parameter definition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-pathparameter.html
   */
  export interface PathParameterProperty {
    /**
     * The path parameter definition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-pathparameter.html#cfn-databrew-dataset-pathparameter-datasetparameter
     */
    readonly datasetParameter: CfnDataset.DatasetParameterProperty | cdk.IResolvable;

    /**
     * The name of the path parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-pathparameter.html#cfn-databrew-dataset-pathparameter-pathparametername
     */
    readonly pathParameterName: string;
  }

  /**
   * Represents a dataset paramater that defines type and conditions for a parameter in the Amazon S3 path of the dataset.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datasetparameter.html
   */
  export interface DatasetParameterProperty {
    /**
     * Optional boolean value that defines whether the captured value of this parameter should be loaded as an additional column in the dataset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datasetparameter.html#cfn-databrew-dataset-datasetparameter-createcolumn
     */
    readonly createColumn?: boolean | cdk.IResolvable;

    /**
     * Additional parameter options such as a format and a timezone.
     *
     * Required for datetime parameters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datasetparameter.html#cfn-databrew-dataset-datasetparameter-datetimeoptions
     */
    readonly datetimeOptions?: CfnDataset.DatetimeOptionsProperty | cdk.IResolvable;

    /**
     * The optional filter expression structure to apply additional matching criteria to the parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datasetparameter.html#cfn-databrew-dataset-datasetparameter-filter
     */
    readonly filter?: CfnDataset.FilterExpressionProperty | cdk.IResolvable;

    /**
     * The name of the parameter that is used in the dataset's Amazon S3 path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datasetparameter.html#cfn-databrew-dataset-datasetparameter-name
     */
    readonly name: string;

    /**
     * The type of the dataset parameter, can be one of a 'String', 'Number' or 'Datetime'.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datasetparameter.html#cfn-databrew-dataset-datasetparameter-type
     */
    readonly type: string;
  }

  /**
   * Represents additional options for correct interpretation of datetime parameters used in the Amazon S3 path of a dataset.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datetimeoptions.html
   */
  export interface DatetimeOptionsProperty {
    /**
     * Required option, that defines the datetime format used for a date parameter in the Amazon S3 path.
     *
     * Should use only supported datetime specifiers and separation characters, all litera a-z or A-Z character should be escaped with single quotes. E.g. "MM.dd.yyyy-'at'-HH:mm".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datetimeoptions.html#cfn-databrew-dataset-datetimeoptions-format
     */
    readonly format: string;

    /**
     * Optional value for a non-US locale code, needed for correct interpretation of some date formats.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datetimeoptions.html#cfn-databrew-dataset-datetimeoptions-localecode
     */
    readonly localeCode?: string;

    /**
     * Optional value for a timezone offset of the datetime parameter value in the Amazon S3 path.
     *
     * Shouldn't be used if Format for this parameter includes timezone fields. If no offset specified, UTC is assumed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-datetimeoptions.html#cfn-databrew-dataset-datetimeoptions-timezoneoffset
     */
    readonly timezoneOffset?: string;
  }

  /**
   * Represents a structure for defining parameter conditions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-filterexpression.html
   */
  export interface FilterExpressionProperty {
    /**
     * The expression which includes condition names followed by substitution variables, possibly grouped and combined with other conditions.
     *
     * For example, "(starts_with :prefix1 or starts_with :prefix2) and (ends_with :suffix1 or ends_with :suffix2)". Substitution variables should start with ':' symbol.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-filterexpression.html#cfn-databrew-dataset-filterexpression-expression
     */
    readonly expression: string;

    /**
     * The map of substitution variable names to their values used in this filter expression.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-filterexpression.html#cfn-databrew-dataset-filterexpression-valuesmap
     */
    readonly valuesMap: Array<CfnDataset.FilterValueProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Represents a single entry in the `ValuesMap` of a `FilterExpression` .
   *
   * A `FilterValue` associates the name of a substitution variable in an expression to its value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-filtervalue.html
   */
  export interface FilterValueProperty {
    /**
     * The value to be associated with the substitution variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-filtervalue.html#cfn-databrew-dataset-filtervalue-value
     */
    readonly value: string;

    /**
     * The substitution variable reference.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-filtervalue.html#cfn-databrew-dataset-filtervalue-valuereference
     */
    readonly valueReference: string;
  }

  /**
   * Represents a limit imposed on number of Amazon S3 files that should be selected for a dataset from a connected Amazon S3 path.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-fileslimit.html
   */
  export interface FilesLimitProperty {
    /**
     * The number of Amazon S3 files to select.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-fileslimit.html#cfn-databrew-dataset-fileslimit-maxfiles
     */
    readonly maxFiles: number;

    /**
     * A criteria to use for Amazon S3 files sorting before their selection.
     *
     * By default uses DESCENDING order, i.e. most recent files are selected first. Anotherpossible value is ASCENDING.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-fileslimit.html#cfn-databrew-dataset-fileslimit-order
     */
    readonly order?: string;

    /**
     * A criteria to use for Amazon S3 files sorting before their selection.
     *
     * By default uses LAST_MODIFIED_DATE as a sorting criteria. Currently it's the only allowed value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-dataset-fileslimit.html#cfn-databrew-dataset-fileslimit-orderedby
     */
    readonly orderedBy?: string;
  }
}

/**
 * Properties for defining a `CfnDataset`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-dataset.html
 */
export interface CfnDatasetProps {
  /**
   * The file format of a dataset that is created from an Amazon S3 file or folder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-dataset.html#cfn-databrew-dataset-format
   */
  readonly format?: string;

  /**
   * A set of options that define how DataBrew interprets the data in the dataset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-dataset.html#cfn-databrew-dataset-formatoptions
   */
  readonly formatOptions?: CfnDataset.FormatOptionsProperty | cdk.IResolvable;

  /**
   * Information on how DataBrew can find the dataset, in either the AWS Glue Data Catalog or Amazon S3 .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-dataset.html#cfn-databrew-dataset-input
   */
  readonly input: CfnDataset.InputProperty | cdk.IResolvable;

  /**
   * The unique name of the dataset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-dataset.html#cfn-databrew-dataset-name
   */
  readonly name: string;

  /**
   * A set of options that defines how DataBrew interprets an Amazon S3 path of the dataset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-dataset.html#cfn-databrew-dataset-pathoptions
   */
  readonly pathOptions?: cdk.IResolvable | CfnDataset.PathOptionsProperty;

  /**
   * Metadata tags that have been applied to the dataset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-dataset.html#cfn-databrew-dataset-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key)
  };
}

// @ts-ignore TS6133
function CfnDatasetS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.S3LocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatabaseInputDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `DatabaseInputDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetDatabaseInputDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("databaseTableName", cdk.validateString)(properties.databaseTableName));
  errors.collect(cdk.propertyValidator("glueConnectionName", cdk.requiredValidator)(properties.glueConnectionName));
  errors.collect(cdk.propertyValidator("glueConnectionName", cdk.validateString)(properties.glueConnectionName));
  errors.collect(cdk.propertyValidator("queryString", cdk.validateString)(properties.queryString));
  errors.collect(cdk.propertyValidator("tempDirectory", CfnDatasetS3LocationPropertyValidator)(properties.tempDirectory));
  return errors.wrap("supplied properties not correct for \"DatabaseInputDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetDatabaseInputDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetDatabaseInputDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "DatabaseTableName": cdk.stringToCloudFormation(properties.databaseTableName),
    "GlueConnectionName": cdk.stringToCloudFormation(properties.glueConnectionName),
    "QueryString": cdk.stringToCloudFormation(properties.queryString),
    "TempDirectory": convertCfnDatasetS3LocationPropertyToCloudFormation(properties.tempDirectory)
  };
}

// @ts-ignore TS6133
function CfnDatasetDatabaseInputDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DatabaseInputDefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DatabaseInputDefinitionProperty>();
  ret.addPropertyResult("databaseTableName", "DatabaseTableName", (properties.DatabaseTableName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseTableName) : undefined));
  ret.addPropertyResult("glueConnectionName", "GlueConnectionName", (properties.GlueConnectionName != null ? cfn_parse.FromCloudFormation.getString(properties.GlueConnectionName) : undefined));
  ret.addPropertyResult("queryString", "QueryString", (properties.QueryString != null ? cfn_parse.FromCloudFormation.getString(properties.QueryString) : undefined));
  ret.addPropertyResult("tempDirectory", "TempDirectory", (properties.TempDirectory != null ? CfnDatasetS3LocationPropertyFromCloudFormation(properties.TempDirectory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetadataProperty`
 *
 * @param properties - the TypeScript properties of a `MetadataProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetMetadataPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sourceArn", cdk.validateString)(properties.sourceArn));
  return errors.wrap("supplied properties not correct for \"MetadataProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetMetadataPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetMetadataPropertyValidator(properties).assertSuccess();
  return {
    "SourceArn": cdk.stringToCloudFormation(properties.sourceArn)
  };
}

// @ts-ignore TS6133
function CfnDatasetMetadataPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.MetadataProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.MetadataProperty>();
  ret.addPropertyResult("sourceArn", "SourceArn", (properties.SourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataCatalogInputDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `DataCatalogInputDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetDataCatalogInputDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  errors.collect(cdk.propertyValidator("tempDirectory", CfnDatasetS3LocationPropertyValidator)(properties.tempDirectory));
  return errors.wrap("supplied properties not correct for \"DataCatalogInputDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetDataCatalogInputDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetDataCatalogInputDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "TableName": cdk.stringToCloudFormation(properties.tableName),
    "TempDirectory": convertCfnDatasetS3LocationPropertyToCloudFormation(properties.tempDirectory)
  };
}

// @ts-ignore TS6133
function CfnDatasetDataCatalogInputDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DataCatalogInputDefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DataCatalogInputDefinitionProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addPropertyResult("tempDirectory", "TempDirectory", (properties.TempDirectory != null ? CfnDatasetS3LocationPropertyFromCloudFormation(properties.TempDirectory) : undefined));
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
function CfnDatasetInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataCatalogInputDefinition", CfnDatasetDataCatalogInputDefinitionPropertyValidator)(properties.dataCatalogInputDefinition));
  errors.collect(cdk.propertyValidator("databaseInputDefinition", CfnDatasetDatabaseInputDefinitionPropertyValidator)(properties.databaseInputDefinition));
  errors.collect(cdk.propertyValidator("metadata", CfnDatasetMetadataPropertyValidator)(properties.metadata));
  errors.collect(cdk.propertyValidator("s3InputDefinition", CfnDatasetS3LocationPropertyValidator)(properties.s3InputDefinition));
  return errors.wrap("supplied properties not correct for \"InputProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetInputPropertyValidator(properties).assertSuccess();
  return {
    "DataCatalogInputDefinition": convertCfnDatasetDataCatalogInputDefinitionPropertyToCloudFormation(properties.dataCatalogInputDefinition),
    "DatabaseInputDefinition": convertCfnDatasetDatabaseInputDefinitionPropertyToCloudFormation(properties.databaseInputDefinition),
    "Metadata": convertCfnDatasetMetadataPropertyToCloudFormation(properties.metadata),
    "S3InputDefinition": convertCfnDatasetS3LocationPropertyToCloudFormation(properties.s3InputDefinition)
  };
}

// @ts-ignore TS6133
function CfnDatasetInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.InputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.InputProperty>();
  ret.addPropertyResult("databaseInputDefinition", "DatabaseInputDefinition", (properties.DatabaseInputDefinition != null ? CfnDatasetDatabaseInputDefinitionPropertyFromCloudFormation(properties.DatabaseInputDefinition) : undefined));
  ret.addPropertyResult("dataCatalogInputDefinition", "DataCatalogInputDefinition", (properties.DataCatalogInputDefinition != null ? CfnDatasetDataCatalogInputDefinitionPropertyFromCloudFormation(properties.DataCatalogInputDefinition) : undefined));
  ret.addPropertyResult("metadata", "Metadata", (properties.Metadata != null ? CfnDatasetMetadataPropertyFromCloudFormation(properties.Metadata) : undefined));
  ret.addPropertyResult("s3InputDefinition", "S3InputDefinition", (properties.S3InputDefinition != null ? CfnDatasetS3LocationPropertyFromCloudFormation(properties.S3InputDefinition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExcelOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `ExcelOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetExcelOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("headerRow", cdk.validateBoolean)(properties.headerRow));
  errors.collect(cdk.propertyValidator("sheetIndexes", cdk.listValidator(cdk.validateNumber))(properties.sheetIndexes));
  errors.collect(cdk.propertyValidator("sheetNames", cdk.listValidator(cdk.validateString))(properties.sheetNames));
  return errors.wrap("supplied properties not correct for \"ExcelOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetExcelOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetExcelOptionsPropertyValidator(properties).assertSuccess();
  return {
    "HeaderRow": cdk.booleanToCloudFormation(properties.headerRow),
    "SheetIndexes": cdk.listMapper(cdk.numberToCloudFormation)(properties.sheetIndexes),
    "SheetNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.sheetNames)
  };
}

// @ts-ignore TS6133
function CfnDatasetExcelOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.ExcelOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.ExcelOptionsProperty>();
  ret.addPropertyResult("headerRow", "HeaderRow", (properties.HeaderRow != null ? cfn_parse.FromCloudFormation.getBoolean(properties.HeaderRow) : undefined));
  ret.addPropertyResult("sheetIndexes", "SheetIndexes", (properties.SheetIndexes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.SheetIndexes) : undefined));
  ret.addPropertyResult("sheetNames", "SheetNames", (properties.SheetNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SheetNames) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CsvOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `CsvOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetCsvOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("delimiter", cdk.validateString)(properties.delimiter));
  errors.collect(cdk.propertyValidator("headerRow", cdk.validateBoolean)(properties.headerRow));
  return errors.wrap("supplied properties not correct for \"CsvOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetCsvOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetCsvOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Delimiter": cdk.stringToCloudFormation(properties.delimiter),
    "HeaderRow": cdk.booleanToCloudFormation(properties.headerRow)
  };
}

// @ts-ignore TS6133
function CfnDatasetCsvOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.CsvOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.CsvOptionsProperty>();
  ret.addPropertyResult("delimiter", "Delimiter", (properties.Delimiter != null ? cfn_parse.FromCloudFormation.getString(properties.Delimiter) : undefined));
  ret.addPropertyResult("headerRow", "HeaderRow", (properties.HeaderRow != null ? cfn_parse.FromCloudFormation.getBoolean(properties.HeaderRow) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JsonOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `JsonOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetJsonOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("multiLine", cdk.validateBoolean)(properties.multiLine));
  return errors.wrap("supplied properties not correct for \"JsonOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetJsonOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetJsonOptionsPropertyValidator(properties).assertSuccess();
  return {
    "MultiLine": cdk.booleanToCloudFormation(properties.multiLine)
  };
}

// @ts-ignore TS6133
function CfnDatasetJsonOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.JsonOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.JsonOptionsProperty>();
  ret.addPropertyResult("multiLine", "MultiLine", (properties.MultiLine != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MultiLine) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FormatOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `FormatOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetFormatOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("csv", CfnDatasetCsvOptionsPropertyValidator)(properties.csv));
  errors.collect(cdk.propertyValidator("excel", CfnDatasetExcelOptionsPropertyValidator)(properties.excel));
  errors.collect(cdk.propertyValidator("json", CfnDatasetJsonOptionsPropertyValidator)(properties.json));
  return errors.wrap("supplied properties not correct for \"FormatOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetFormatOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetFormatOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Csv": convertCfnDatasetCsvOptionsPropertyToCloudFormation(properties.csv),
    "Excel": convertCfnDatasetExcelOptionsPropertyToCloudFormation(properties.excel),
    "Json": convertCfnDatasetJsonOptionsPropertyToCloudFormation(properties.json)
  };
}

// @ts-ignore TS6133
function CfnDatasetFormatOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.FormatOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.FormatOptionsProperty>();
  ret.addPropertyResult("csv", "Csv", (properties.Csv != null ? CfnDatasetCsvOptionsPropertyFromCloudFormation(properties.Csv) : undefined));
  ret.addPropertyResult("excel", "Excel", (properties.Excel != null ? CfnDatasetExcelOptionsPropertyFromCloudFormation(properties.Excel) : undefined));
  ret.addPropertyResult("json", "Json", (properties.Json != null ? CfnDatasetJsonOptionsPropertyFromCloudFormation(properties.Json) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatetimeOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `DatetimeOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetDatetimeOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("format", cdk.requiredValidator)(properties.format));
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  errors.collect(cdk.propertyValidator("localeCode", cdk.validateString)(properties.localeCode));
  errors.collect(cdk.propertyValidator("timezoneOffset", cdk.validateString)(properties.timezoneOffset));
  return errors.wrap("supplied properties not correct for \"DatetimeOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetDatetimeOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetDatetimeOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Format": cdk.stringToCloudFormation(properties.format),
    "LocaleCode": cdk.stringToCloudFormation(properties.localeCode),
    "TimezoneOffset": cdk.stringToCloudFormation(properties.timezoneOffset)
  };
}

// @ts-ignore TS6133
function CfnDatasetDatetimeOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DatetimeOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DatetimeOptionsProperty>();
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addPropertyResult("localeCode", "LocaleCode", (properties.LocaleCode != null ? cfn_parse.FromCloudFormation.getString(properties.LocaleCode) : undefined));
  ret.addPropertyResult("timezoneOffset", "TimezoneOffset", (properties.TimezoneOffset != null ? cfn_parse.FromCloudFormation.getString(properties.TimezoneOffset) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterValueProperty`
 *
 * @param properties - the TypeScript properties of a `FilterValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetFilterValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  errors.collect(cdk.propertyValidator("valueReference", cdk.requiredValidator)(properties.valueReference));
  errors.collect(cdk.propertyValidator("valueReference", cdk.validateString)(properties.valueReference));
  return errors.wrap("supplied properties not correct for \"FilterValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetFilterValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetFilterValuePropertyValidator(properties).assertSuccess();
  return {
    "Value": cdk.stringToCloudFormation(properties.value),
    "ValueReference": cdk.stringToCloudFormation(properties.valueReference)
  };
}

// @ts-ignore TS6133
function CfnDatasetFilterValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.FilterValueProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.FilterValueProperty>();
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addPropertyResult("valueReference", "ValueReference", (properties.ValueReference != null ? cfn_parse.FromCloudFormation.getString(properties.ValueReference) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterExpressionProperty`
 *
 * @param properties - the TypeScript properties of a `FilterExpressionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetFilterExpressionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("expression", cdk.requiredValidator)(properties.expression));
  errors.collect(cdk.propertyValidator("expression", cdk.validateString)(properties.expression));
  errors.collect(cdk.propertyValidator("valuesMap", cdk.requiredValidator)(properties.valuesMap));
  errors.collect(cdk.propertyValidator("valuesMap", cdk.listValidator(CfnDatasetFilterValuePropertyValidator))(properties.valuesMap));
  return errors.wrap("supplied properties not correct for \"FilterExpressionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetFilterExpressionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetFilterExpressionPropertyValidator(properties).assertSuccess();
  return {
    "Expression": cdk.stringToCloudFormation(properties.expression),
    "ValuesMap": cdk.listMapper(convertCfnDatasetFilterValuePropertyToCloudFormation)(properties.valuesMap)
  };
}

// @ts-ignore TS6133
function CfnDatasetFilterExpressionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.FilterExpressionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.FilterExpressionProperty>();
  ret.addPropertyResult("expression", "Expression", (properties.Expression != null ? cfn_parse.FromCloudFormation.getString(properties.Expression) : undefined));
  ret.addPropertyResult("valuesMap", "ValuesMap", (properties.ValuesMap != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetFilterValuePropertyFromCloudFormation)(properties.ValuesMap) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatasetParameterProperty`
 *
 * @param properties - the TypeScript properties of a `DatasetParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetDatasetParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("createColumn", cdk.validateBoolean)(properties.createColumn));
  errors.collect(cdk.propertyValidator("datetimeOptions", CfnDatasetDatetimeOptionsPropertyValidator)(properties.datetimeOptions));
  errors.collect(cdk.propertyValidator("filter", CfnDatasetFilterExpressionPropertyValidator)(properties.filter));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"DatasetParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetDatasetParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetDatasetParameterPropertyValidator(properties).assertSuccess();
  return {
    "CreateColumn": cdk.booleanToCloudFormation(properties.createColumn),
    "DatetimeOptions": convertCfnDatasetDatetimeOptionsPropertyToCloudFormation(properties.datetimeOptions),
    "Filter": convertCfnDatasetFilterExpressionPropertyToCloudFormation(properties.filter),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDatasetDatasetParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DatasetParameterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DatasetParameterProperty>();
  ret.addPropertyResult("createColumn", "CreateColumn", (properties.CreateColumn != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CreateColumn) : undefined));
  ret.addPropertyResult("datetimeOptions", "DatetimeOptions", (properties.DatetimeOptions != null ? CfnDatasetDatetimeOptionsPropertyFromCloudFormation(properties.DatetimeOptions) : undefined));
  ret.addPropertyResult("filter", "Filter", (properties.Filter != null ? CfnDatasetFilterExpressionPropertyFromCloudFormation(properties.Filter) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PathParameterProperty`
 *
 * @param properties - the TypeScript properties of a `PathParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetPathParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("datasetParameter", cdk.requiredValidator)(properties.datasetParameter));
  errors.collect(cdk.propertyValidator("datasetParameter", CfnDatasetDatasetParameterPropertyValidator)(properties.datasetParameter));
  errors.collect(cdk.propertyValidator("pathParameterName", cdk.requiredValidator)(properties.pathParameterName));
  errors.collect(cdk.propertyValidator("pathParameterName", cdk.validateString)(properties.pathParameterName));
  return errors.wrap("supplied properties not correct for \"PathParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetPathParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetPathParameterPropertyValidator(properties).assertSuccess();
  return {
    "DatasetParameter": convertCfnDatasetDatasetParameterPropertyToCloudFormation(properties.datasetParameter),
    "PathParameterName": cdk.stringToCloudFormation(properties.pathParameterName)
  };
}

// @ts-ignore TS6133
function CfnDatasetPathParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.PathParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.PathParameterProperty>();
  ret.addPropertyResult("datasetParameter", "DatasetParameter", (properties.DatasetParameter != null ? CfnDatasetDatasetParameterPropertyFromCloudFormation(properties.DatasetParameter) : undefined));
  ret.addPropertyResult("pathParameterName", "PathParameterName", (properties.PathParameterName != null ? cfn_parse.FromCloudFormation.getString(properties.PathParameterName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilesLimitProperty`
 *
 * @param properties - the TypeScript properties of a `FilesLimitProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetFilesLimitPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxFiles", cdk.requiredValidator)(properties.maxFiles));
  errors.collect(cdk.propertyValidator("maxFiles", cdk.validateNumber)(properties.maxFiles));
  errors.collect(cdk.propertyValidator("order", cdk.validateString)(properties.order));
  errors.collect(cdk.propertyValidator("orderedBy", cdk.validateString)(properties.orderedBy));
  return errors.wrap("supplied properties not correct for \"FilesLimitProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetFilesLimitPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetFilesLimitPropertyValidator(properties).assertSuccess();
  return {
    "MaxFiles": cdk.numberToCloudFormation(properties.maxFiles),
    "Order": cdk.stringToCloudFormation(properties.order),
    "OrderedBy": cdk.stringToCloudFormation(properties.orderedBy)
  };
}

// @ts-ignore TS6133
function CfnDatasetFilesLimitPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.FilesLimitProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.FilesLimitProperty>();
  ret.addPropertyResult("maxFiles", "MaxFiles", (properties.MaxFiles != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxFiles) : undefined));
  ret.addPropertyResult("order", "Order", (properties.Order != null ? cfn_parse.FromCloudFormation.getString(properties.Order) : undefined));
  ret.addPropertyResult("orderedBy", "OrderedBy", (properties.OrderedBy != null ? cfn_parse.FromCloudFormation.getString(properties.OrderedBy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PathOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `PathOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetPathOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filesLimit", CfnDatasetFilesLimitPropertyValidator)(properties.filesLimit));
  errors.collect(cdk.propertyValidator("lastModifiedDateCondition", CfnDatasetFilterExpressionPropertyValidator)(properties.lastModifiedDateCondition));
  errors.collect(cdk.propertyValidator("parameters", cdk.listValidator(CfnDatasetPathParameterPropertyValidator))(properties.parameters));
  return errors.wrap("supplied properties not correct for \"PathOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetPathOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetPathOptionsPropertyValidator(properties).assertSuccess();
  return {
    "FilesLimit": convertCfnDatasetFilesLimitPropertyToCloudFormation(properties.filesLimit),
    "LastModifiedDateCondition": convertCfnDatasetFilterExpressionPropertyToCloudFormation(properties.lastModifiedDateCondition),
    "Parameters": cdk.listMapper(convertCfnDatasetPathParameterPropertyToCloudFormation)(properties.parameters)
  };
}

// @ts-ignore TS6133
function CfnDatasetPathOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.PathOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.PathOptionsProperty>();
  ret.addPropertyResult("filesLimit", "FilesLimit", (properties.FilesLimit != null ? CfnDatasetFilesLimitPropertyFromCloudFormation(properties.FilesLimit) : undefined));
  ret.addPropertyResult("lastModifiedDateCondition", "LastModifiedDateCondition", (properties.LastModifiedDateCondition != null ? CfnDatasetFilterExpressionPropertyFromCloudFormation(properties.LastModifiedDateCondition) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetPathParameterPropertyFromCloudFormation)(properties.Parameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDatasetProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatasetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  errors.collect(cdk.propertyValidator("formatOptions", CfnDatasetFormatOptionsPropertyValidator)(properties.formatOptions));
  errors.collect(cdk.propertyValidator("input", cdk.requiredValidator)(properties.input));
  errors.collect(cdk.propertyValidator("input", CfnDatasetInputPropertyValidator)(properties.input));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("pathOptions", CfnDatasetPathOptionsPropertyValidator)(properties.pathOptions));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDatasetProps\"");
}

// @ts-ignore TS6133
function convertCfnDatasetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetPropsValidator(properties).assertSuccess();
  return {
    "Format": cdk.stringToCloudFormation(properties.format),
    "FormatOptions": convertCfnDatasetFormatOptionsPropertyToCloudFormation(properties.formatOptions),
    "Input": convertCfnDatasetInputPropertyToCloudFormation(properties.input),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PathOptions": convertCfnDatasetPathOptionsPropertyToCloudFormation(properties.pathOptions),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDatasetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatasetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatasetProps>();
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addPropertyResult("formatOptions", "FormatOptions", (properties.FormatOptions != null ? CfnDatasetFormatOptionsPropertyFromCloudFormation(properties.FormatOptions) : undefined));
  ret.addPropertyResult("input", "Input", (properties.Input != null ? CfnDatasetInputPropertyFromCloudFormation(properties.Input) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("pathOptions", "PathOptions", (properties.PathOptions != null ? CfnDatasetPathOptionsPropertyFromCloudFormation(properties.PathOptions) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a new DataBrew job.
 *
 * @cloudformationResource AWS::DataBrew::Job
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html
 */
export class CfnJob extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataBrew::Job";

  /**
   * Build a CfnJob from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnJob {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnJobPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnJob(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Represents a list of JDBC database output objects which defines the output destination for a DataBrew recipe job to write into.
   */
  public databaseOutputs?: Array<CfnJob.DatabaseOutputProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * One or more artifacts that represent the AWS Glue Data Catalog output from running the job.
   */
  public dataCatalogOutputs?: Array<CfnJob.DataCatalogOutputProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A dataset that the job is to process.
   */
  public datasetName?: string;

  /**
   * The Amazon Resource Name (ARN) of an encryption key that is used to protect the job output.
   */
  public encryptionKeyArn?: string;

  /**
   * The encryption mode for the job, which can be one of the following:.
   */
  public encryptionMode?: string;

  /**
   * A sample configuration for profile jobs only, which determines the number of rows on which the profile job is run.
   */
  public jobSample?: cdk.IResolvable | CfnJob.JobSampleProperty;

  /**
   * The current status of Amazon CloudWatch logging for the job.
   */
  public logSubscription?: string;

  /**
   * The maximum number of nodes that can be consumed when the job processes data.
   */
  public maxCapacity?: number;

  /**
   * The maximum number of times to retry the job after a job run fails.
   */
  public maxRetries?: number;

  /**
   * The unique name of the job.
   */
  public name: string;

  /**
   * The location in Amazon S3 where the job writes its output.
   */
  public outputLocation?: cdk.IResolvable | CfnJob.OutputLocationProperty;

  /**
   * One or more artifacts that represent output from running the job.
   */
  public outputs?: Array<cdk.IResolvable | CfnJob.OutputProperty> | cdk.IResolvable;

  /**
   * Configuration for profile jobs.
   */
  public profileConfiguration?: cdk.IResolvable | CfnJob.ProfileConfigurationProperty;

  /**
   * The name of the project that the job is associated with.
   */
  public projectName?: string;

  /**
   * A series of data transformation steps that the job runs.
   */
  public recipe?: cdk.IResolvable | CfnJob.RecipeProperty;

  /**
   * The Amazon Resource Name (ARN) of the role to be assumed for this job.
   */
  public roleArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata tags that have been applied to the job.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The job's timeout in minutes.
   */
  public timeout?: number;

  /**
   * The job type of the job, which must be one of the following:.
   */
  public type: string;

  /**
   * List of validation configurations that are applied to the profile job.
   */
  public validationConfigurations?: Array<cdk.IResolvable | CfnJob.ValidationConfigurationProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnJobProps) {
    super(scope, id, {
      "type": CfnJob.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "roleArn", this);
    cdk.requireProperty(props, "type", this);

    this.databaseOutputs = props.databaseOutputs;
    this.dataCatalogOutputs = props.dataCatalogOutputs;
    this.datasetName = props.datasetName;
    this.encryptionKeyArn = props.encryptionKeyArn;
    this.encryptionMode = props.encryptionMode;
    this.jobSample = props.jobSample;
    this.logSubscription = props.logSubscription;
    this.maxCapacity = props.maxCapacity;
    this.maxRetries = props.maxRetries;
    this.name = props.name;
    this.outputLocation = props.outputLocation;
    this.outputs = props.outputs;
    this.profileConfiguration = props.profileConfiguration;
    this.projectName = props.projectName;
    this.recipe = props.recipe;
    this.roleArn = props.roleArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataBrew::Job", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.timeout = props.timeout;
    this.type = props.type;
    this.validationConfigurations = props.validationConfigurations;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "databaseOutputs": this.databaseOutputs,
      "dataCatalogOutputs": this.dataCatalogOutputs,
      "datasetName": this.datasetName,
      "encryptionKeyArn": this.encryptionKeyArn,
      "encryptionMode": this.encryptionMode,
      "jobSample": this.jobSample,
      "logSubscription": this.logSubscription,
      "maxCapacity": this.maxCapacity,
      "maxRetries": this.maxRetries,
      "name": this.name,
      "outputLocation": this.outputLocation,
      "outputs": this.outputs,
      "profileConfiguration": this.profileConfiguration,
      "projectName": this.projectName,
      "recipe": this.recipe,
      "roleArn": this.roleArn,
      "tags": this.tags.renderTags(),
      "timeout": this.timeout,
      "type": this.type,
      "validationConfigurations": this.validationConfigurations
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnJob.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnJobPropsToCloudFormation(props);
  }
}

export namespace CfnJob {
  /**
   * Represents one or more actions to be performed on a DataBrew dataset.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-recipe.html
   */
  export interface RecipeProperty {
    /**
     * The unique name for the recipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-recipe.html#cfn-databrew-job-recipe-name
     */
    readonly name: string;

    /**
     * The identifier for the version for the recipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-recipe.html#cfn-databrew-job-recipe-version
     */
    readonly version?: string;
  }

  /**
   * Represents a JDBC database output object which defines the output destination for a DataBrew recipe job to write into.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-databaseoutput.html
   */
  export interface DatabaseOutputProperty {
    /**
     * Represents options that specify how and where DataBrew writes the database output generated by recipe jobs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-databaseoutput.html#cfn-databrew-job-databaseoutput-databaseoptions
     */
    readonly databaseOptions: CfnJob.DatabaseTableOutputOptionsProperty | cdk.IResolvable;

    /**
     * The output mode to write into the database.
     *
     * Currently supported option: NEW_TABLE.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-databaseoutput.html#cfn-databrew-job-databaseoutput-databaseoutputmode
     */
    readonly databaseOutputMode?: string;

    /**
     * The AWS Glue connection that stores the connection information for the target database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-databaseoutput.html#cfn-databrew-job-databaseoutput-glueconnectionname
     */
    readonly glueConnectionName: string;
  }

  /**
   * Represents options that specify how and where DataBrew writes the database output generated by recipe jobs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-databasetableoutputoptions.html
   */
  export interface DatabaseTableOutputOptionsProperty {
    /**
     * A prefix for the name of a table DataBrew will create in the database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-databasetableoutputoptions.html#cfn-databrew-job-databasetableoutputoptions-tablename
     */
    readonly tableName: string;

    /**
     * Represents an Amazon S3 location (bucket name and object key) where DataBrew can store intermediate results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-databasetableoutputoptions.html#cfn-databrew-job-databasetableoutputoptions-tempdirectory
     */
    readonly tempDirectory?: cdk.IResolvable | CfnJob.S3LocationProperty;
  }

  /**
   * Represents an Amazon S3 location (bucket name, bucket owner, and object key) where DataBrew can read input data, or write output from a job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * The Amazon S3 bucket name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-s3location.html#cfn-databrew-job-s3location-bucket
     */
    readonly bucket: string;

    /**
     * The AWS account ID of the bucket owner.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-s3location.html#cfn-databrew-job-s3location-bucketowner
     */
    readonly bucketOwner?: string;

    /**
     * The unique name of the object in the bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-s3location.html#cfn-databrew-job-s3location-key
     */
    readonly key?: string;
  }

  /**
   * The location in Amazon S3 or AWS Glue Data Catalog where the job writes its output.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-outputlocation.html
   */
  export interface OutputLocationProperty {
    /**
     * The Amazon S3 bucket name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-outputlocation.html#cfn-databrew-job-outputlocation-bucket
     */
    readonly bucket: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-outputlocation.html#cfn-databrew-job-outputlocation-bucketowner
     */
    readonly bucketOwner?: string;

    /**
     * The unique name of the object in the bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-outputlocation.html#cfn-databrew-job-outputlocation-key
     */
    readonly key?: string;
  }

  /**
   * Configuration for profile jobs.
   *
   * Configuration can be used to select columns, do evaluations, and override default parameters of evaluations. When configuration is undefined, the profile job will apply default settings to all supported columns.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-profileconfiguration.html
   */
  export interface ProfileConfigurationProperty {
    /**
     * List of configurations for column evaluations.
     *
     * ColumnStatisticsConfigurations are used to select evaluations and override parameters of evaluations for particular columns. When ColumnStatisticsConfigurations is undefined, the profile job will profile all supported columns and run all supported evaluations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-profileconfiguration.html#cfn-databrew-job-profileconfiguration-columnstatisticsconfigurations
     */
    readonly columnStatisticsConfigurations?: Array<CfnJob.ColumnStatisticsConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Configuration for inter-column evaluations.
     *
     * Configuration can be used to select evaluations and override parameters of evaluations. When configuration is undefined, the profile job will run all supported inter-column evaluations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-profileconfiguration.html#cfn-databrew-job-profileconfiguration-datasetstatisticsconfiguration
     */
    readonly datasetStatisticsConfiguration?: cdk.IResolvable | CfnJob.StatisticsConfigurationProperty;

    /**
     * Configuration of entity detection for a profile job.
     *
     * When undefined, entity detection is disabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-profileconfiguration.html#cfn-databrew-job-profileconfiguration-entitydetectorconfiguration
     */
    readonly entityDetectorConfiguration?: CfnJob.EntityDetectorConfigurationProperty | cdk.IResolvable;

    /**
     * List of column selectors.
     *
     * ProfileColumns can be used to select columns from the dataset. When ProfileColumns is undefined, the profile job will profile all supported columns.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-profileconfiguration.html#cfn-databrew-job-profileconfiguration-profilecolumns
     */
    readonly profileColumns?: Array<CfnJob.ColumnSelectorProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Selector of a column from a dataset for profile job configuration.
   *
   * One selector includes either a column name or a regular expression.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-columnselector.html
   */
  export interface ColumnSelectorProperty {
    /**
     * The name of a column from a dataset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-columnselector.html#cfn-databrew-job-columnselector-name
     */
    readonly name?: string;

    /**
     * A regular expression for selecting a column from a dataset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-columnselector.html#cfn-databrew-job-columnselector-regex
     */
    readonly regex?: string;
  }

  /**
   * Configuration of evaluations for a profile job.
   *
   * This configuration can be used to select evaluations and override the parameters of selected evaluations.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-statisticsconfiguration.html
   */
  export interface StatisticsConfigurationProperty {
    /**
     * List of included evaluations.
     *
     * When the list is undefined, all supported evaluations will be included.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-statisticsconfiguration.html#cfn-databrew-job-statisticsconfiguration-includedstatistics
     */
    readonly includedStatistics?: Array<string>;

    /**
     * List of overrides for evaluations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-statisticsconfiguration.html#cfn-databrew-job-statisticsconfiguration-overrides
     */
    readonly overrides?: Array<cdk.IResolvable | CfnJob.StatisticOverrideProperty> | cdk.IResolvable;
  }

  /**
   * Override of a particular evaluation for a profile job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-statisticoverride.html
   */
  export interface StatisticOverrideProperty {
    /**
     * A map that includes overrides of an evaluation’s parameters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-statisticoverride.html#cfn-databrew-job-statisticoverride-parameters
     */
    readonly parameters: cdk.IResolvable | Record<string, string>;

    /**
     * The name of an evaluation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-statisticoverride.html#cfn-databrew-job-statisticoverride-statistic
     */
    readonly statistic: string;
  }

  /**
   * Configuration for column evaluations for a profile job.
   *
   * ColumnStatisticsConfiguration can be used to select evaluations and override parameters of evaluations for particular columns.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-columnstatisticsconfiguration.html
   */
  export interface ColumnStatisticsConfigurationProperty {
    /**
     * List of column selectors.
     *
     * Selectors can be used to select columns from the dataset. When selectors are undefined, configuration will be applied to all supported columns.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-columnstatisticsconfiguration.html#cfn-databrew-job-columnstatisticsconfiguration-selectors
     */
    readonly selectors?: Array<CfnJob.ColumnSelectorProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Configuration for evaluations.
     *
     * Statistics can be used to select evaluations and override parameters of evaluations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-columnstatisticsconfiguration.html#cfn-databrew-job-columnstatisticsconfiguration-statistics
     */
    readonly statistics: cdk.IResolvable | CfnJob.StatisticsConfigurationProperty;
  }

  /**
   * Configuration of entity detection for a profile job.
   *
   * When undefined, entity detection is disabled.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-entitydetectorconfiguration.html
   */
  export interface EntityDetectorConfigurationProperty {
    /**
     * Configuration of statistics that are allowed to be run on columns that contain detected entities.
     *
     * When undefined, no statistics will be computed on columns that contain detected entities.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-entitydetectorconfiguration.html#cfn-databrew-job-entitydetectorconfiguration-allowedstatistics
     */
    readonly allowedStatistics?: CfnJob.AllowedStatisticsProperty | cdk.IResolvable;

    /**
     * Entity types to detect. Can be any of the following:.
     *
     * - USA_SSN
     * - EMAIL
     * - USA_ITIN
     * - USA_PASSPORT_NUMBER
     * - PHONE_NUMBER
     * - USA_DRIVING_LICENSE
     * - BANK_ACCOUNT
     * - CREDIT_CARD
     * - IP_ADDRESS
     * - MAC_ADDRESS
     * - USA_DEA_NUMBER
     * - USA_HCPCS_CODE
     * - USA_NATIONAL_PROVIDER_IDENTIFIER
     * - USA_NATIONAL_DRUG_CODE
     * - USA_HEALTH_INSURANCE_CLAIM_NUMBER
     * - USA_MEDICARE_BENEFICIARY_IDENTIFIER
     * - USA_CPT_CODE
     * - PERSON_NAME
     * - DATE
     *
     * The Entity type group USA_ALL is also supported, and includes all of the above entity types except PERSON_NAME and DATE.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-entitydetectorconfiguration.html#cfn-databrew-job-entitydetectorconfiguration-entitytypes
     */
    readonly entityTypes: Array<string>;
  }

  /**
   * Configuration of statistics that are allowed to be run on columns that contain detected entities.
   *
   * When undefined, no statistics will be computed on columns that contain detected entities.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-allowedstatistics.html
   */
  export interface AllowedStatisticsProperty {
    /**
     * One or more column statistics to allow for columns that contain detected entities.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-allowedstatistics.html#cfn-databrew-job-allowedstatistics-statistics
     */
    readonly statistics: Array<string>;
  }

  /**
   * Represents options that specify how and where in Amazon S3 DataBrew writes the output generated by recipe jobs or profile jobs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-output.html
   */
  export interface OutputProperty {
    /**
     * The compression algorithm used to compress the output text of the job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-output.html#cfn-databrew-job-output-compressionformat
     */
    readonly compressionFormat?: string;

    /**
     * The data format of the output of the job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-output.html#cfn-databrew-job-output-format
     */
    readonly format?: string;

    /**
     * Represents options that define how DataBrew formats job output files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-output.html#cfn-databrew-job-output-formatoptions
     */
    readonly formatOptions?: cdk.IResolvable | CfnJob.OutputFormatOptionsProperty;

    /**
     * The location in Amazon S3 where the job writes its output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-output.html#cfn-databrew-job-output-location
     */
    readonly location: cdk.IResolvable | CfnJob.S3LocationProperty;

    /**
     * The maximum number of files to be generated by the job and written to the output folder.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-output.html#cfn-databrew-job-output-maxoutputfiles
     */
    readonly maxOutputFiles?: number;

    /**
     * A value that, if true, means that any data in the location specified for output is overwritten with new output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-output.html#cfn-databrew-job-output-overwrite
     */
    readonly overwrite?: boolean | cdk.IResolvable;

    /**
     * The names of one or more partition columns for the output of the job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-output.html#cfn-databrew-job-output-partitioncolumns
     */
    readonly partitionColumns?: Array<string>;
  }

  /**
   * Represents a set of options that define the structure of comma-separated (CSV) job output.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-outputformatoptions.html
   */
  export interface OutputFormatOptionsProperty {
    /**
     * Represents a set of options that define the structure of comma-separated value (CSV) job output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-outputformatoptions.html#cfn-databrew-job-outputformatoptions-csv
     */
    readonly csv?: CfnJob.CsvOutputOptionsProperty | cdk.IResolvable;
  }

  /**
   * Represents a set of options that define how DataBrew will write a comma-separated value (CSV) file.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-csvoutputoptions.html
   */
  export interface CsvOutputOptionsProperty {
    /**
     * A single character that specifies the delimiter used to create CSV job output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-csvoutputoptions.html#cfn-databrew-job-csvoutputoptions-delimiter
     */
    readonly delimiter?: string;
  }

  /**
   * Configuration for data quality validation.
   *
   * Used to select the Rulesets and Validation Mode to be used in the profile job. When ValidationConfiguration is null, the profile job will run without data quality validation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-validationconfiguration.html
   */
  export interface ValidationConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) for the ruleset to be validated in the profile job.
     *
     * The TargetArn of the selected ruleset should be the same as the Amazon Resource Name (ARN) of the dataset that is associated with the profile job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-validationconfiguration.html#cfn-databrew-job-validationconfiguration-rulesetarn
     */
    readonly rulesetArn: string;

    /**
     * Mode of data quality validation.
     *
     * Default mode is “CHECK_ALL” which verifies all rules defined in the selected ruleset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-validationconfiguration.html#cfn-databrew-job-validationconfiguration-validationmode
     */
    readonly validationMode?: string;
  }

  /**
   * A sample configuration for profile jobs only, which determines the number of rows on which the profile job is run.
   *
   * If a `JobSample` value isn't provided, the default is used. The default value is CUSTOM_ROWS for the mode parameter and 20,000 for the size parameter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-jobsample.html
   */
  export interface JobSampleProperty {
    /**
     * A value that determines whether the profile job is run on the entire dataset or a specified number of rows.
     *
     * This value must be one of the following:
     *
     * - FULL_DATASET - The profile job is run on the entire dataset.
     * - CUSTOM_ROWS - The profile job is run on the number of rows specified in the `Size` parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-jobsample.html#cfn-databrew-job-jobsample-mode
     */
    readonly mode?: string;

    /**
     * The `Size` parameter is only required when the mode is CUSTOM_ROWS.
     *
     * The profile job is run on the specified number of rows. The maximum value for size is Long.MAX_VALUE.
     *
     * Long.MAX_VALUE = 9223372036854775807
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-jobsample.html#cfn-databrew-job-jobsample-size
     */
    readonly size?: number;
  }

  /**
   * Represents options that specify how and where in the AWS Glue Data Catalog DataBrew writes the output generated by recipe jobs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-datacatalogoutput.html
   */
  export interface DataCatalogOutputProperty {
    /**
     * The unique identifier of the AWS account that holds the Data Catalog that stores the data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-datacatalogoutput.html#cfn-databrew-job-datacatalogoutput-catalogid
     */
    readonly catalogId?: string;

    /**
     * The name of a database in the Data Catalog.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-datacatalogoutput.html#cfn-databrew-job-datacatalogoutput-databasename
     */
    readonly databaseName: string;

    /**
     * Represents options that specify how and where DataBrew writes the database output generated by recipe jobs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-datacatalogoutput.html#cfn-databrew-job-datacatalogoutput-databaseoptions
     */
    readonly databaseOptions?: CfnJob.DatabaseTableOutputOptionsProperty | cdk.IResolvable;

    /**
     * A value that, if true, means that any data in the location specified for output is overwritten with new output.
     *
     * Not supported with DatabaseOptions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-datacatalogoutput.html#cfn-databrew-job-datacatalogoutput-overwrite
     */
    readonly overwrite?: boolean | cdk.IResolvable;

    /**
     * Represents options that specify how and where DataBrew writes the Amazon S3 output generated by recipe jobs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-datacatalogoutput.html#cfn-databrew-job-datacatalogoutput-s3options
     */
    readonly s3Options?: cdk.IResolvable | CfnJob.S3TableOutputOptionsProperty;

    /**
     * The name of a table in the Data Catalog.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-datacatalogoutput.html#cfn-databrew-job-datacatalogoutput-tablename
     */
    readonly tableName: string;
  }

  /**
   * Represents options that specify how and where DataBrew writes the Amazon S3 output generated by recipe jobs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-s3tableoutputoptions.html
   */
  export interface S3TableOutputOptionsProperty {
    /**
     * Represents an Amazon S3 location (bucket name and object key) where DataBrew can write output from a job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-job-s3tableoutputoptions.html#cfn-databrew-job-s3tableoutputoptions-location
     */
    readonly location: cdk.IResolvable | CfnJob.S3LocationProperty;
  }
}

/**
 * Properties for defining a `CfnJob`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html
 */
export interface CfnJobProps {
  /**
   * Represents a list of JDBC database output objects which defines the output destination for a DataBrew recipe job to write into.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-databaseoutputs
   */
  readonly databaseOutputs?: Array<CfnJob.DatabaseOutputProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * One or more artifacts that represent the AWS Glue Data Catalog output from running the job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-datacatalogoutputs
   */
  readonly dataCatalogOutputs?: Array<CfnJob.DataCatalogOutputProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * A dataset that the job is to process.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-datasetname
   */
  readonly datasetName?: string;

  /**
   * The Amazon Resource Name (ARN) of an encryption key that is used to protect the job output.
   *
   * For more information, see [Encrypting data written by DataBrew jobs](https://docs.aws.amazon.com/databrew/latest/dg/encryption-security-configuration.html)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-encryptionkeyarn
   */
  readonly encryptionKeyArn?: string;

  /**
   * The encryption mode for the job, which can be one of the following:.
   *
   * - `SSE-KMS` - Server-side encryption with keys managed by AWS KMS .
   * - `SSE-S3` - Server-side encryption with keys managed by Amazon S3.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-encryptionmode
   */
  readonly encryptionMode?: string;

  /**
   * A sample configuration for profile jobs only, which determines the number of rows on which the profile job is run.
   *
   * If a `JobSample` value isn't provided, the default value is used. The default value is CUSTOM_ROWS for the mode parameter and 20,000 for the size parameter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-jobsample
   */
  readonly jobSample?: cdk.IResolvable | CfnJob.JobSampleProperty;

  /**
   * The current status of Amazon CloudWatch logging for the job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-logsubscription
   */
  readonly logSubscription?: string;

  /**
   * The maximum number of nodes that can be consumed when the job processes data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-maxcapacity
   */
  readonly maxCapacity?: number;

  /**
   * The maximum number of times to retry the job after a job run fails.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-maxretries
   */
  readonly maxRetries?: number;

  /**
   * The unique name of the job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-name
   */
  readonly name: string;

  /**
   * The location in Amazon S3 where the job writes its output.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-outputlocation
   */
  readonly outputLocation?: cdk.IResolvable | CfnJob.OutputLocationProperty;

  /**
   * One or more artifacts that represent output from running the job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-outputs
   */
  readonly outputs?: Array<cdk.IResolvable | CfnJob.OutputProperty> | cdk.IResolvable;

  /**
   * Configuration for profile jobs.
   *
   * Configuration can be used to select columns, do evaluations, and override default parameters of evaluations. When configuration is undefined, the profile job will apply default settings to all supported columns.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-profileconfiguration
   */
  readonly profileConfiguration?: cdk.IResolvable | CfnJob.ProfileConfigurationProperty;

  /**
   * The name of the project that the job is associated with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-projectname
   */
  readonly projectName?: string;

  /**
   * A series of data transformation steps that the job runs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-recipe
   */
  readonly recipe?: cdk.IResolvable | CfnJob.RecipeProperty;

  /**
   * The Amazon Resource Name (ARN) of the role to be assumed for this job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-rolearn
   */
  readonly roleArn: string;

  /**
   * Metadata tags that have been applied to the job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The job's timeout in minutes.
   *
   * A job that attempts to run longer than this timeout period ends with a status of `TIMEOUT` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-timeout
   */
  readonly timeout?: number;

  /**
   * The job type of the job, which must be one of the following:.
   *
   * - `PROFILE` - A job to analyze a dataset, to determine its size, data types, data distribution, and more.
   * - `RECIPE` - A job to apply one or more transformations to a dataset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-type
   */
  readonly type: string;

  /**
   * List of validation configurations that are applied to the profile job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-job.html#cfn-databrew-job-validationconfigurations
   */
  readonly validationConfigurations?: Array<cdk.IResolvable | CfnJob.ValidationConfigurationProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `RecipeProperty`
 *
 * @param properties - the TypeScript properties of a `RecipeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobRecipePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"RecipeProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobRecipePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobRecipePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnJobRecipePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJob.RecipeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.RecipeProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
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
function CfnJobS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucketOwner", cdk.validateString)(properties.bucketOwner));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "BucketOwner": cdk.stringToCloudFormation(properties.bucketOwner),
    "Key": cdk.stringToCloudFormation(properties.key)
  };
}

// @ts-ignore TS6133
function CfnJobS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJob.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.S3LocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("bucketOwner", "BucketOwner", (properties.BucketOwner != null ? cfn_parse.FromCloudFormation.getString(properties.BucketOwner) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatabaseTableOutputOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `DatabaseTableOutputOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDatabaseTableOutputOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  errors.collect(cdk.propertyValidator("tempDirectory", CfnJobS3LocationPropertyValidator)(properties.tempDirectory));
  return errors.wrap("supplied properties not correct for \"DatabaseTableOutputOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDatabaseTableOutputOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDatabaseTableOutputOptionsPropertyValidator(properties).assertSuccess();
  return {
    "TableName": cdk.stringToCloudFormation(properties.tableName),
    "TempDirectory": convertCfnJobS3LocationPropertyToCloudFormation(properties.tempDirectory)
  };
}

// @ts-ignore TS6133
function CfnJobDatabaseTableOutputOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJob.DatabaseTableOutputOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.DatabaseTableOutputOptionsProperty>();
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addPropertyResult("tempDirectory", "TempDirectory", (properties.TempDirectory != null ? CfnJobS3LocationPropertyFromCloudFormation(properties.TempDirectory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatabaseOutputProperty`
 *
 * @param properties - the TypeScript properties of a `DatabaseOutputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDatabaseOutputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("databaseOptions", cdk.requiredValidator)(properties.databaseOptions));
  errors.collect(cdk.propertyValidator("databaseOptions", CfnJobDatabaseTableOutputOptionsPropertyValidator)(properties.databaseOptions));
  errors.collect(cdk.propertyValidator("databaseOutputMode", cdk.validateString)(properties.databaseOutputMode));
  errors.collect(cdk.propertyValidator("glueConnectionName", cdk.requiredValidator)(properties.glueConnectionName));
  errors.collect(cdk.propertyValidator("glueConnectionName", cdk.validateString)(properties.glueConnectionName));
  return errors.wrap("supplied properties not correct for \"DatabaseOutputProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDatabaseOutputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDatabaseOutputPropertyValidator(properties).assertSuccess();
  return {
    "DatabaseOptions": convertCfnJobDatabaseTableOutputOptionsPropertyToCloudFormation(properties.databaseOptions),
    "DatabaseOutputMode": cdk.stringToCloudFormation(properties.databaseOutputMode),
    "GlueConnectionName": cdk.stringToCloudFormation(properties.glueConnectionName)
  };
}

// @ts-ignore TS6133
function CfnJobDatabaseOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJob.DatabaseOutputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.DatabaseOutputProperty>();
  ret.addPropertyResult("databaseOptions", "DatabaseOptions", (properties.DatabaseOptions != null ? CfnJobDatabaseTableOutputOptionsPropertyFromCloudFormation(properties.DatabaseOptions) : undefined));
  ret.addPropertyResult("databaseOutputMode", "DatabaseOutputMode", (properties.DatabaseOutputMode != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseOutputMode) : undefined));
  ret.addPropertyResult("glueConnectionName", "GlueConnectionName", (properties.GlueConnectionName != null ? cfn_parse.FromCloudFormation.getString(properties.GlueConnectionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OutputLocationProperty`
 *
 * @param properties - the TypeScript properties of a `OutputLocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobOutputLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucketOwner", cdk.validateString)(properties.bucketOwner));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  return errors.wrap("supplied properties not correct for \"OutputLocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobOutputLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobOutputLocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "BucketOwner": cdk.stringToCloudFormation(properties.bucketOwner),
    "Key": cdk.stringToCloudFormation(properties.key)
  };
}

// @ts-ignore TS6133
function CfnJobOutputLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJob.OutputLocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.OutputLocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("bucketOwner", "BucketOwner", (properties.BucketOwner != null ? cfn_parse.FromCloudFormation.getString(properties.BucketOwner) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ColumnSelectorProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnSelectorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobColumnSelectorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("regex", cdk.validateString)(properties.regex));
  return errors.wrap("supplied properties not correct for \"ColumnSelectorProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobColumnSelectorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobColumnSelectorPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Regex": cdk.stringToCloudFormation(properties.regex)
  };
}

// @ts-ignore TS6133
function CfnJobColumnSelectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJob.ColumnSelectorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.ColumnSelectorProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("regex", "Regex", (properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StatisticOverrideProperty`
 *
 * @param properties - the TypeScript properties of a `StatisticOverrideProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobStatisticOverridePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("parameters", cdk.requiredValidator)(properties.parameters));
  errors.collect(cdk.propertyValidator("parameters", cdk.hashValidator(cdk.validateString))(properties.parameters));
  errors.collect(cdk.propertyValidator("statistic", cdk.requiredValidator)(properties.statistic));
  errors.collect(cdk.propertyValidator("statistic", cdk.validateString)(properties.statistic));
  return errors.wrap("supplied properties not correct for \"StatisticOverrideProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobStatisticOverridePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobStatisticOverridePropertyValidator(properties).assertSuccess();
  return {
    "Parameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
    "Statistic": cdk.stringToCloudFormation(properties.statistic)
  };
}

// @ts-ignore TS6133
function CfnJobStatisticOverridePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJob.StatisticOverrideProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.StatisticOverrideProperty>();
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined));
  ret.addPropertyResult("statistic", "Statistic", (properties.Statistic != null ? cfn_parse.FromCloudFormation.getString(properties.Statistic) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StatisticsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StatisticsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobStatisticsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("includedStatistics", cdk.listValidator(cdk.validateString))(properties.includedStatistics));
  errors.collect(cdk.propertyValidator("overrides", cdk.listValidator(CfnJobStatisticOverridePropertyValidator))(properties.overrides));
  return errors.wrap("supplied properties not correct for \"StatisticsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobStatisticsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobStatisticsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "IncludedStatistics": cdk.listMapper(cdk.stringToCloudFormation)(properties.includedStatistics),
    "Overrides": cdk.listMapper(convertCfnJobStatisticOverridePropertyToCloudFormation)(properties.overrides)
  };
}

// @ts-ignore TS6133
function CfnJobStatisticsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJob.StatisticsConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.StatisticsConfigurationProperty>();
  ret.addPropertyResult("includedStatistics", "IncludedStatistics", (properties.IncludedStatistics != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludedStatistics) : undefined));
  ret.addPropertyResult("overrides", "Overrides", (properties.Overrides != null ? cfn_parse.FromCloudFormation.getArray(CfnJobStatisticOverridePropertyFromCloudFormation)(properties.Overrides) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ColumnStatisticsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnStatisticsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobColumnStatisticsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("selectors", cdk.listValidator(CfnJobColumnSelectorPropertyValidator))(properties.selectors));
  errors.collect(cdk.propertyValidator("statistics", cdk.requiredValidator)(properties.statistics));
  errors.collect(cdk.propertyValidator("statistics", CfnJobStatisticsConfigurationPropertyValidator)(properties.statistics));
  return errors.wrap("supplied properties not correct for \"ColumnStatisticsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobColumnStatisticsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobColumnStatisticsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Selectors": cdk.listMapper(convertCfnJobColumnSelectorPropertyToCloudFormation)(properties.selectors),
    "Statistics": convertCfnJobStatisticsConfigurationPropertyToCloudFormation(properties.statistics)
  };
}

// @ts-ignore TS6133
function CfnJobColumnStatisticsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJob.ColumnStatisticsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.ColumnStatisticsConfigurationProperty>();
  ret.addPropertyResult("selectors", "Selectors", (properties.Selectors != null ? cfn_parse.FromCloudFormation.getArray(CfnJobColumnSelectorPropertyFromCloudFormation)(properties.Selectors) : undefined));
  ret.addPropertyResult("statistics", "Statistics", (properties.Statistics != null ? CfnJobStatisticsConfigurationPropertyFromCloudFormation(properties.Statistics) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AllowedStatisticsProperty`
 *
 * @param properties - the TypeScript properties of a `AllowedStatisticsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobAllowedStatisticsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("statistics", cdk.requiredValidator)(properties.statistics));
  errors.collect(cdk.propertyValidator("statistics", cdk.listValidator(cdk.validateString))(properties.statistics));
  return errors.wrap("supplied properties not correct for \"AllowedStatisticsProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobAllowedStatisticsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobAllowedStatisticsPropertyValidator(properties).assertSuccess();
  return {
    "Statistics": cdk.listMapper(cdk.stringToCloudFormation)(properties.statistics)
  };
}

// @ts-ignore TS6133
function CfnJobAllowedStatisticsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJob.AllowedStatisticsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.AllowedStatisticsProperty>();
  ret.addPropertyResult("statistics", "Statistics", (properties.Statistics != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Statistics) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EntityDetectorConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EntityDetectorConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobEntityDetectorConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedStatistics", CfnJobAllowedStatisticsPropertyValidator)(properties.allowedStatistics));
  errors.collect(cdk.propertyValidator("entityTypes", cdk.requiredValidator)(properties.entityTypes));
  errors.collect(cdk.propertyValidator("entityTypes", cdk.listValidator(cdk.validateString))(properties.entityTypes));
  return errors.wrap("supplied properties not correct for \"EntityDetectorConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobEntityDetectorConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobEntityDetectorConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AllowedStatistics": convertCfnJobAllowedStatisticsPropertyToCloudFormation(properties.allowedStatistics),
    "EntityTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.entityTypes)
  };
}

// @ts-ignore TS6133
function CfnJobEntityDetectorConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJob.EntityDetectorConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.EntityDetectorConfigurationProperty>();
  ret.addPropertyResult("allowedStatistics", "AllowedStatistics", (properties.AllowedStatistics != null ? CfnJobAllowedStatisticsPropertyFromCloudFormation(properties.AllowedStatistics) : undefined));
  ret.addPropertyResult("entityTypes", "EntityTypes", (properties.EntityTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EntityTypes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProfileConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ProfileConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobProfileConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("columnStatisticsConfigurations", cdk.listValidator(CfnJobColumnStatisticsConfigurationPropertyValidator))(properties.columnStatisticsConfigurations));
  errors.collect(cdk.propertyValidator("datasetStatisticsConfiguration", CfnJobStatisticsConfigurationPropertyValidator)(properties.datasetStatisticsConfiguration));
  errors.collect(cdk.propertyValidator("entityDetectorConfiguration", CfnJobEntityDetectorConfigurationPropertyValidator)(properties.entityDetectorConfiguration));
  errors.collect(cdk.propertyValidator("profileColumns", cdk.listValidator(CfnJobColumnSelectorPropertyValidator))(properties.profileColumns));
  return errors.wrap("supplied properties not correct for \"ProfileConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobProfileConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobProfileConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ColumnStatisticsConfigurations": cdk.listMapper(convertCfnJobColumnStatisticsConfigurationPropertyToCloudFormation)(properties.columnStatisticsConfigurations),
    "DatasetStatisticsConfiguration": convertCfnJobStatisticsConfigurationPropertyToCloudFormation(properties.datasetStatisticsConfiguration),
    "EntityDetectorConfiguration": convertCfnJobEntityDetectorConfigurationPropertyToCloudFormation(properties.entityDetectorConfiguration),
    "ProfileColumns": cdk.listMapper(convertCfnJobColumnSelectorPropertyToCloudFormation)(properties.profileColumns)
  };
}

// @ts-ignore TS6133
function CfnJobProfileConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJob.ProfileConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.ProfileConfigurationProperty>();
  ret.addPropertyResult("columnStatisticsConfigurations", "ColumnStatisticsConfigurations", (properties.ColumnStatisticsConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnJobColumnStatisticsConfigurationPropertyFromCloudFormation)(properties.ColumnStatisticsConfigurations) : undefined));
  ret.addPropertyResult("datasetStatisticsConfiguration", "DatasetStatisticsConfiguration", (properties.DatasetStatisticsConfiguration != null ? CfnJobStatisticsConfigurationPropertyFromCloudFormation(properties.DatasetStatisticsConfiguration) : undefined));
  ret.addPropertyResult("entityDetectorConfiguration", "EntityDetectorConfiguration", (properties.EntityDetectorConfiguration != null ? CfnJobEntityDetectorConfigurationPropertyFromCloudFormation(properties.EntityDetectorConfiguration) : undefined));
  ret.addPropertyResult("profileColumns", "ProfileColumns", (properties.ProfileColumns != null ? cfn_parse.FromCloudFormation.getArray(CfnJobColumnSelectorPropertyFromCloudFormation)(properties.ProfileColumns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CsvOutputOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `CsvOutputOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobCsvOutputOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("delimiter", cdk.validateString)(properties.delimiter));
  return errors.wrap("supplied properties not correct for \"CsvOutputOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobCsvOutputOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobCsvOutputOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Delimiter": cdk.stringToCloudFormation(properties.delimiter)
  };
}

// @ts-ignore TS6133
function CfnJobCsvOutputOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJob.CsvOutputOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.CsvOutputOptionsProperty>();
  ret.addPropertyResult("delimiter", "Delimiter", (properties.Delimiter != null ? cfn_parse.FromCloudFormation.getString(properties.Delimiter) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OutputFormatOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `OutputFormatOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobOutputFormatOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("csv", CfnJobCsvOutputOptionsPropertyValidator)(properties.csv));
  return errors.wrap("supplied properties not correct for \"OutputFormatOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobOutputFormatOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobOutputFormatOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Csv": convertCfnJobCsvOutputOptionsPropertyToCloudFormation(properties.csv)
  };
}

// @ts-ignore TS6133
function CfnJobOutputFormatOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJob.OutputFormatOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.OutputFormatOptionsProperty>();
  ret.addPropertyResult("csv", "Csv", (properties.Csv != null ? CfnJobCsvOutputOptionsPropertyFromCloudFormation(properties.Csv) : undefined));
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
function CfnJobOutputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("compressionFormat", cdk.validateString)(properties.compressionFormat));
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  errors.collect(cdk.propertyValidator("formatOptions", CfnJobOutputFormatOptionsPropertyValidator)(properties.formatOptions));
  errors.collect(cdk.propertyValidator("location", cdk.requiredValidator)(properties.location));
  errors.collect(cdk.propertyValidator("location", CfnJobS3LocationPropertyValidator)(properties.location));
  errors.collect(cdk.propertyValidator("maxOutputFiles", cdk.validateNumber)(properties.maxOutputFiles));
  errors.collect(cdk.propertyValidator("overwrite", cdk.validateBoolean)(properties.overwrite));
  errors.collect(cdk.propertyValidator("partitionColumns", cdk.listValidator(cdk.validateString))(properties.partitionColumns));
  return errors.wrap("supplied properties not correct for \"OutputProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobOutputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobOutputPropertyValidator(properties).assertSuccess();
  return {
    "CompressionFormat": cdk.stringToCloudFormation(properties.compressionFormat),
    "Format": cdk.stringToCloudFormation(properties.format),
    "FormatOptions": convertCfnJobOutputFormatOptionsPropertyToCloudFormation(properties.formatOptions),
    "Location": convertCfnJobS3LocationPropertyToCloudFormation(properties.location),
    "MaxOutputFiles": cdk.numberToCloudFormation(properties.maxOutputFiles),
    "Overwrite": cdk.booleanToCloudFormation(properties.overwrite),
    "PartitionColumns": cdk.listMapper(cdk.stringToCloudFormation)(properties.partitionColumns)
  };
}

// @ts-ignore TS6133
function CfnJobOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJob.OutputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.OutputProperty>();
  ret.addPropertyResult("compressionFormat", "CompressionFormat", (properties.CompressionFormat != null ? cfn_parse.FromCloudFormation.getString(properties.CompressionFormat) : undefined));
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addPropertyResult("formatOptions", "FormatOptions", (properties.FormatOptions != null ? CfnJobOutputFormatOptionsPropertyFromCloudFormation(properties.FormatOptions) : undefined));
  ret.addPropertyResult("location", "Location", (properties.Location != null ? CfnJobS3LocationPropertyFromCloudFormation(properties.Location) : undefined));
  ret.addPropertyResult("maxOutputFiles", "MaxOutputFiles", (properties.MaxOutputFiles != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxOutputFiles) : undefined));
  ret.addPropertyResult("overwrite", "Overwrite", (properties.Overwrite != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Overwrite) : undefined));
  ret.addPropertyResult("partitionColumns", "PartitionColumns", (properties.PartitionColumns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PartitionColumns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ValidationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ValidationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobValidationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rulesetArn", cdk.requiredValidator)(properties.rulesetArn));
  errors.collect(cdk.propertyValidator("rulesetArn", cdk.validateString)(properties.rulesetArn));
  errors.collect(cdk.propertyValidator("validationMode", cdk.validateString)(properties.validationMode));
  return errors.wrap("supplied properties not correct for \"ValidationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobValidationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobValidationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "RulesetArn": cdk.stringToCloudFormation(properties.rulesetArn),
    "ValidationMode": cdk.stringToCloudFormation(properties.validationMode)
  };
}

// @ts-ignore TS6133
function CfnJobValidationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJob.ValidationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.ValidationConfigurationProperty>();
  ret.addPropertyResult("rulesetArn", "RulesetArn", (properties.RulesetArn != null ? cfn_parse.FromCloudFormation.getString(properties.RulesetArn) : undefined));
  ret.addPropertyResult("validationMode", "ValidationMode", (properties.ValidationMode != null ? cfn_parse.FromCloudFormation.getString(properties.ValidationMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JobSampleProperty`
 *
 * @param properties - the TypeScript properties of a `JobSampleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobJobSamplePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  errors.collect(cdk.propertyValidator("size", cdk.validateNumber)(properties.size));
  return errors.wrap("supplied properties not correct for \"JobSampleProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobJobSamplePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobJobSamplePropertyValidator(properties).assertSuccess();
  return {
    "Mode": cdk.stringToCloudFormation(properties.mode),
    "Size": cdk.numberToCloudFormation(properties.size)
  };
}

// @ts-ignore TS6133
function CfnJobJobSamplePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJob.JobSampleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.JobSampleProperty>();
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addPropertyResult("size", "Size", (properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3TableOutputOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `S3TableOutputOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobS3TableOutputOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("location", cdk.requiredValidator)(properties.location));
  errors.collect(cdk.propertyValidator("location", CfnJobS3LocationPropertyValidator)(properties.location));
  return errors.wrap("supplied properties not correct for \"S3TableOutputOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobS3TableOutputOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobS3TableOutputOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Location": convertCfnJobS3LocationPropertyToCloudFormation(properties.location)
  };
}

// @ts-ignore TS6133
function CfnJobS3TableOutputOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnJob.S3TableOutputOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.S3TableOutputOptionsProperty>();
  ret.addPropertyResult("location", "Location", (properties.Location != null ? CfnJobS3LocationPropertyFromCloudFormation(properties.Location) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataCatalogOutputProperty`
 *
 * @param properties - the TypeScript properties of a `DataCatalogOutputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobDataCatalogOutputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseOptions", CfnJobDatabaseTableOutputOptionsPropertyValidator)(properties.databaseOptions));
  errors.collect(cdk.propertyValidator("overwrite", cdk.validateBoolean)(properties.overwrite));
  errors.collect(cdk.propertyValidator("s3Options", CfnJobS3TableOutputOptionsPropertyValidator)(properties.s3Options));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"DataCatalogOutputProperty\"");
}

// @ts-ignore TS6133
function convertCfnJobDataCatalogOutputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobDataCatalogOutputPropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "DatabaseOptions": convertCfnJobDatabaseTableOutputOptionsPropertyToCloudFormation(properties.databaseOptions),
    "Overwrite": cdk.booleanToCloudFormation(properties.overwrite),
    "S3Options": convertCfnJobS3TableOutputOptionsPropertyToCloudFormation(properties.s3Options),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnJobDataCatalogOutputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJob.DataCatalogOutputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJob.DataCatalogOutputProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("databaseOptions", "DatabaseOptions", (properties.DatabaseOptions != null ? CfnJobDatabaseTableOutputOptionsPropertyFromCloudFormation(properties.DatabaseOptions) : undefined));
  ret.addPropertyResult("overwrite", "Overwrite", (properties.Overwrite != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Overwrite) : undefined));
  ret.addPropertyResult("s3Options", "S3Options", (properties.S3Options != null ? CfnJobS3TableOutputOptionsPropertyFromCloudFormation(properties.S3Options) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnJobProps`
 *
 * @param properties - the TypeScript properties of a `CfnJobProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnJobPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataCatalogOutputs", cdk.listValidator(CfnJobDataCatalogOutputPropertyValidator))(properties.dataCatalogOutputs));
  errors.collect(cdk.propertyValidator("databaseOutputs", cdk.listValidator(CfnJobDatabaseOutputPropertyValidator))(properties.databaseOutputs));
  errors.collect(cdk.propertyValidator("datasetName", cdk.validateString)(properties.datasetName));
  errors.collect(cdk.propertyValidator("encryptionKeyArn", cdk.validateString)(properties.encryptionKeyArn));
  errors.collect(cdk.propertyValidator("encryptionMode", cdk.validateString)(properties.encryptionMode));
  errors.collect(cdk.propertyValidator("jobSample", CfnJobJobSamplePropertyValidator)(properties.jobSample));
  errors.collect(cdk.propertyValidator("logSubscription", cdk.validateString)(properties.logSubscription));
  errors.collect(cdk.propertyValidator("maxCapacity", cdk.validateNumber)(properties.maxCapacity));
  errors.collect(cdk.propertyValidator("maxRetries", cdk.validateNumber)(properties.maxRetries));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("outputLocation", CfnJobOutputLocationPropertyValidator)(properties.outputLocation));
  errors.collect(cdk.propertyValidator("outputs", cdk.listValidator(CfnJobOutputPropertyValidator))(properties.outputs));
  errors.collect(cdk.propertyValidator("profileConfiguration", CfnJobProfileConfigurationPropertyValidator)(properties.profileConfiguration));
  errors.collect(cdk.propertyValidator("projectName", cdk.validateString)(properties.projectName));
  errors.collect(cdk.propertyValidator("recipe", CfnJobRecipePropertyValidator)(properties.recipe));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("timeout", cdk.validateNumber)(properties.timeout));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("validationConfigurations", cdk.listValidator(CfnJobValidationConfigurationPropertyValidator))(properties.validationConfigurations));
  return errors.wrap("supplied properties not correct for \"CfnJobProps\"");
}

// @ts-ignore TS6133
function convertCfnJobPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnJobPropsValidator(properties).assertSuccess();
  return {
    "DataCatalogOutputs": cdk.listMapper(convertCfnJobDataCatalogOutputPropertyToCloudFormation)(properties.dataCatalogOutputs),
    "DatabaseOutputs": cdk.listMapper(convertCfnJobDatabaseOutputPropertyToCloudFormation)(properties.databaseOutputs),
    "DatasetName": cdk.stringToCloudFormation(properties.datasetName),
    "EncryptionKeyArn": cdk.stringToCloudFormation(properties.encryptionKeyArn),
    "EncryptionMode": cdk.stringToCloudFormation(properties.encryptionMode),
    "JobSample": convertCfnJobJobSamplePropertyToCloudFormation(properties.jobSample),
    "LogSubscription": cdk.stringToCloudFormation(properties.logSubscription),
    "MaxCapacity": cdk.numberToCloudFormation(properties.maxCapacity),
    "MaxRetries": cdk.numberToCloudFormation(properties.maxRetries),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OutputLocation": convertCfnJobOutputLocationPropertyToCloudFormation(properties.outputLocation),
    "Outputs": cdk.listMapper(convertCfnJobOutputPropertyToCloudFormation)(properties.outputs),
    "ProfileConfiguration": convertCfnJobProfileConfigurationPropertyToCloudFormation(properties.profileConfiguration),
    "ProjectName": cdk.stringToCloudFormation(properties.projectName),
    "Recipe": convertCfnJobRecipePropertyToCloudFormation(properties.recipe),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Timeout": cdk.numberToCloudFormation(properties.timeout),
    "Type": cdk.stringToCloudFormation(properties.type),
    "ValidationConfigurations": cdk.listMapper(convertCfnJobValidationConfigurationPropertyToCloudFormation)(properties.validationConfigurations)
  };
}

// @ts-ignore TS6133
function CfnJobPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnJobProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnJobProps>();
  ret.addPropertyResult("databaseOutputs", "DatabaseOutputs", (properties.DatabaseOutputs != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDatabaseOutputPropertyFromCloudFormation)(properties.DatabaseOutputs) : undefined));
  ret.addPropertyResult("dataCatalogOutputs", "DataCatalogOutputs", (properties.DataCatalogOutputs != null ? cfn_parse.FromCloudFormation.getArray(CfnJobDataCatalogOutputPropertyFromCloudFormation)(properties.DataCatalogOutputs) : undefined));
  ret.addPropertyResult("datasetName", "DatasetName", (properties.DatasetName != null ? cfn_parse.FromCloudFormation.getString(properties.DatasetName) : undefined));
  ret.addPropertyResult("encryptionKeyArn", "EncryptionKeyArn", (properties.EncryptionKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionKeyArn) : undefined));
  ret.addPropertyResult("encryptionMode", "EncryptionMode", (properties.EncryptionMode != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionMode) : undefined));
  ret.addPropertyResult("jobSample", "JobSample", (properties.JobSample != null ? CfnJobJobSamplePropertyFromCloudFormation(properties.JobSample) : undefined));
  ret.addPropertyResult("logSubscription", "LogSubscription", (properties.LogSubscription != null ? cfn_parse.FromCloudFormation.getString(properties.LogSubscription) : undefined));
  ret.addPropertyResult("maxCapacity", "MaxCapacity", (properties.MaxCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCapacity) : undefined));
  ret.addPropertyResult("maxRetries", "MaxRetries", (properties.MaxRetries != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxRetries) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("outputLocation", "OutputLocation", (properties.OutputLocation != null ? CfnJobOutputLocationPropertyFromCloudFormation(properties.OutputLocation) : undefined));
  ret.addPropertyResult("outputs", "Outputs", (properties.Outputs != null ? cfn_parse.FromCloudFormation.getArray(CfnJobOutputPropertyFromCloudFormation)(properties.Outputs) : undefined));
  ret.addPropertyResult("profileConfiguration", "ProfileConfiguration", (properties.ProfileConfiguration != null ? CfnJobProfileConfigurationPropertyFromCloudFormation(properties.ProfileConfiguration) : undefined));
  ret.addPropertyResult("projectName", "ProjectName", (properties.ProjectName != null ? cfn_parse.FromCloudFormation.getString(properties.ProjectName) : undefined));
  ret.addPropertyResult("recipe", "Recipe", (properties.Recipe != null ? CfnJobRecipePropertyFromCloudFormation(properties.Recipe) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.Timeout) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("validationConfigurations", "ValidationConfigurations", (properties.ValidationConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnJobValidationConfigurationPropertyFromCloudFormation)(properties.ValidationConfigurations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a new AWS Glue DataBrew project.
 *
 * @cloudformationResource AWS::DataBrew::Project
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-project.html
 */
export class CfnProject extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataBrew::Project";

  /**
   * Build a CfnProject from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnProject {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnProjectPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnProject(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The dataset that the project is to act upon.
   */
  public datasetName: string;

  /**
   * The unique name of a project.
   */
  public name: string;

  /**
   * The name of a recipe that will be developed during a project session.
   */
  public recipeName: string;

  /**
   * The Amazon Resource Name (ARN) of the role that will be assumed for this project.
   */
  public roleArn: string;

  /**
   * The sample size and sampling type to apply to the data.
   */
  public sample?: cdk.IResolvable | CfnProject.SampleProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata tags that have been applied to the project.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnProjectProps) {
    super(scope, id, {
      "type": CfnProject.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "datasetName", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "recipeName", this);
    cdk.requireProperty(props, "roleArn", this);

    this.datasetName = props.datasetName;
    this.name = props.name;
    this.recipeName = props.recipeName;
    this.roleArn = props.roleArn;
    this.sample = props.sample;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataBrew::Project", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "datasetName": this.datasetName,
      "name": this.name,
      "recipeName": this.recipeName,
      "roleArn": this.roleArn,
      "sample": this.sample,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnProject.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnProjectPropsToCloudFormation(props);
  }
}

export namespace CfnProject {
  /**
   * Represents the sample size and sampling type for DataBrew to use for interactive data analysis.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-project-sample.html
   */
  export interface SampleProperty {
    /**
     * The number of rows in the sample.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-project-sample.html#cfn-databrew-project-sample-size
     */
    readonly size?: number;

    /**
     * The way in which DataBrew obtains rows from a dataset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-project-sample.html#cfn-databrew-project-sample-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnProject`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-project.html
 */
export interface CfnProjectProps {
  /**
   * The dataset that the project is to act upon.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-project.html#cfn-databrew-project-datasetname
   */
  readonly datasetName: string;

  /**
   * The unique name of a project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-project.html#cfn-databrew-project-name
   */
  readonly name: string;

  /**
   * The name of a recipe that will be developed during a project session.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-project.html#cfn-databrew-project-recipename
   */
  readonly recipeName: string;

  /**
   * The Amazon Resource Name (ARN) of the role that will be assumed for this project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-project.html#cfn-databrew-project-rolearn
   */
  readonly roleArn: string;

  /**
   * The sample size and sampling type to apply to the data.
   *
   * If this parameter isn't specified, then the sample consists of the first 500 rows from the dataset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-project.html#cfn-databrew-project-sample
   */
  readonly sample?: cdk.IResolvable | CfnProject.SampleProperty;

  /**
   * Metadata tags that have been applied to the project.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-project.html#cfn-databrew-project-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `SampleProperty`
 *
 * @param properties - the TypeScript properties of a `SampleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProjectSamplePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("size", cdk.validateNumber)(properties.size));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"SampleProperty\"");
}

// @ts-ignore TS6133
function convertCfnProjectSamplePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProjectSamplePropertyValidator(properties).assertSuccess();
  return {
    "Size": cdk.numberToCloudFormation(properties.size),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnProjectSamplePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnProject.SampleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProject.SampleProperty>();
  ret.addPropertyResult("size", "Size", (properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnProjectProps`
 *
 * @param properties - the TypeScript properties of a `CfnProjectProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnProjectPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("datasetName", cdk.requiredValidator)(properties.datasetName));
  errors.collect(cdk.propertyValidator("datasetName", cdk.validateString)(properties.datasetName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("recipeName", cdk.requiredValidator)(properties.recipeName));
  errors.collect(cdk.propertyValidator("recipeName", cdk.validateString)(properties.recipeName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("sample", CfnProjectSamplePropertyValidator)(properties.sample));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnProjectProps\"");
}

// @ts-ignore TS6133
function convertCfnProjectPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnProjectPropsValidator(properties).assertSuccess();
  return {
    "DatasetName": cdk.stringToCloudFormation(properties.datasetName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RecipeName": cdk.stringToCloudFormation(properties.recipeName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Sample": convertCfnProjectSamplePropertyToCloudFormation(properties.sample),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnProjectPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnProjectProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnProjectProps>();
  ret.addPropertyResult("datasetName", "DatasetName", (properties.DatasetName != null ? cfn_parse.FromCloudFormation.getString(properties.DatasetName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("recipeName", "RecipeName", (properties.RecipeName != null ? cfn_parse.FromCloudFormation.getString(properties.RecipeName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("sample", "Sample", (properties.Sample != null ? CfnProjectSamplePropertyFromCloudFormation(properties.Sample) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a new AWS Glue DataBrew transformation recipe.
 *
 * @cloudformationResource AWS::DataBrew::Recipe
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-recipe.html
 */
export class CfnRecipe extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataBrew::Recipe";

  /**
   * Build a CfnRecipe from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRecipe {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRecipePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRecipe(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The description of the recipe.
   */
  public description?: string;

  /**
   * The unique name for the recipe.
   */
  public name: string;

  /**
   * A list of steps that are defined by the recipe.
   */
  public steps: Array<cdk.IResolvable | CfnRecipe.RecipeStepProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata tags that have been applied to the recipe.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRecipeProps) {
    super(scope, id, {
      "type": CfnRecipe.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "steps", this);

    this.description = props.description;
    this.name = props.name;
    this.steps = props.steps;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataBrew::Recipe", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "steps": this.steps,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRecipe.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRecipePropsToCloudFormation(props);
  }
}

export namespace CfnRecipe {
  /**
   * Represents a single step from a DataBrew recipe to be performed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipestep.html
   */
  export interface RecipeStepProperty {
    /**
     * The particular action to be performed in the recipe step.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipestep.html#cfn-databrew-recipe-recipestep-action
     */
    readonly action: CfnRecipe.ActionProperty | cdk.IResolvable;

    /**
     * One or more conditions that must be met for the recipe step to succeed.
     *
     * > All of the conditions in the array must be met. In other words, all of the conditions must be combined using a logical AND operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipestep.html#cfn-databrew-recipe-recipestep-conditionexpressions
     */
    readonly conditionExpressions?: Array<CfnRecipe.ConditionExpressionProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Represents a transformation and associated parameters that are used to apply a change to an AWS Glue DataBrew dataset.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-action.html
   */
  export interface ActionProperty {
    /**
     * The name of a valid DataBrew transformation to be performed on the data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-action.html#cfn-databrew-recipe-action-operation
     */
    readonly operation: string;

    /**
     * Contextual parameters for the transformation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-action.html#cfn-databrew-recipe-action-parameters
     */
    readonly parameters?: cdk.IResolvable | Record<string, string>;
  }

  /**
   * Represents an individual condition that evaluates to true or false.
   *
   * Conditions are used with recipe actions. The action is only performed for column values where the condition evaluates to true.
   *
   * If a recipe requires more than one condition, then the recipe must specify multiple `ConditionExpression` elements. Each condition is applied to the rows in a dataset first, before the recipe action is performed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-conditionexpression.html
   */
  export interface ConditionExpressionProperty {
    /**
     * A specific condition to apply to a recipe action.
     *
     * For more information, see [Recipe structure](https://docs.aws.amazon.com/databrew/latest/dg/recipe-structure.html) in the *AWS Glue DataBrew Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-conditionexpression.html#cfn-databrew-recipe-conditionexpression-condition
     */
    readonly condition: string;

    /**
     * A column to apply this condition to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-conditionexpression.html#cfn-databrew-recipe-conditionexpression-targetcolumn
     */
    readonly targetColumn: string;

    /**
     * A value that the condition must evaluate to for the condition to succeed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-conditionexpression.html#cfn-databrew-recipe-conditionexpression-value
     */
    readonly value?: string;
  }

  /**
   * Represents how metadata stored in the AWS Glue Data Catalog is defined in a DataBrew dataset.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-datacataloginputdefinition.html
   */
  export interface DataCatalogInputDefinitionProperty {
    /**
     * The unique identifier of the AWS account that holds the Data Catalog that stores the data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-datacataloginputdefinition.html#cfn-databrew-recipe-datacataloginputdefinition-catalogid
     */
    readonly catalogId?: string;

    /**
     * The name of a database in the Data Catalog.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-datacataloginputdefinition.html#cfn-databrew-recipe-datacataloginputdefinition-databasename
     */
    readonly databaseName?: string;

    /**
     * The name of a database table in the Data Catalog.
     *
     * This table corresponds to a DataBrew dataset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-datacataloginputdefinition.html#cfn-databrew-recipe-datacataloginputdefinition-tablename
     */
    readonly tableName?: string;

    /**
     * Represents an Amazon location where DataBrew can store intermediate results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-datacataloginputdefinition.html#cfn-databrew-recipe-datacataloginputdefinition-tempdirectory
     */
    readonly tempDirectory?: cdk.IResolvable | CfnRecipe.S3LocationProperty;
  }

  /**
   * Represents an Amazon S3 location (bucket name, bucket owner, and object key) where DataBrew can read input data, or write output from a job.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * The Amazon S3 bucket name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-s3location.html#cfn-databrew-recipe-s3location-bucket
     */
    readonly bucket: string;

    /**
     * The unique name of the object in the bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-s3location.html#cfn-databrew-recipe-s3location-key
     */
    readonly key?: string;
  }

  /**
   * Represents information on how DataBrew can find data, in either the AWS Glue Data Catalog or Amazon S3.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-input.html
   */
  export interface InputProperty {
    /**
     * The AWS Glue Data Catalog parameters for the data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-input.html#cfn-databrew-recipe-input-datacataloginputdefinition
     */
    readonly dataCatalogInputDefinition?: CfnRecipe.DataCatalogInputDefinitionProperty | cdk.IResolvable;

    /**
     * The Amazon S3 location where the data is stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-input.html#cfn-databrew-recipe-input-s3inputdefinition
     */
    readonly s3InputDefinition?: cdk.IResolvable | CfnRecipe.S3LocationProperty;
  }

  /**
   * Parameters that are used as inputs for various recipe actions.
   *
   * The parameters are specific to the context in which they're used.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html
   */
  export interface RecipeParametersProperty {
    /**
     * The name of an aggregation function to apply.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-aggregatefunction
     */
    readonly aggregateFunction?: string;

    /**
     * The number of digits used in a counting system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-base
     */
    readonly base?: string;

    /**
     * A case statement associated with a recipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-casestatement
     */
    readonly caseStatement?: string;

    /**
     * A category map used for one-hot encoding.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-categorymap
     */
    readonly categoryMap?: string;

    /**
     * Characters to remove from a step that applies one-hot encoding or tokenization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-charstoremove
     */
    readonly charsToRemove?: string;

    /**
     * Remove any non-word non-punctuation character.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-collapseconsecutivewhitespace
     */
    readonly collapseConsecutiveWhitespace?: string;

    /**
     * The data type of the column.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-columndatatype
     */
    readonly columnDataType?: string;

    /**
     * A range of columns to which a step is applied.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-columnrange
     */
    readonly columnRange?: string;

    /**
     * The number of times a string needs to be repeated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-count
     */
    readonly count?: string;

    /**
     * One or more characters that can be substituted or removed, depending on the context.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-customcharacters
     */
    readonly customCharacters?: string;

    /**
     * A list of words to ignore in a step that applies word tokenization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-customstopwords
     */
    readonly customStopWords?: string;

    /**
     * A list of custom values to use in a step that requires that you provide a value to finish the operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-customvalue
     */
    readonly customValue?: string;

    /**
     * A list of the dataset columns included in a project.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-datasetscolumns
     */
    readonly datasetsColumns?: string;

    /**
     * A value that specifies how many units of time to add or subtract for a date math operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-dateaddvalue
     */
    readonly dateAddValue?: string;

    /**
     * A date format to apply to a date.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-datetimeformat
     */
    readonly dateTimeFormat?: string;

    /**
     * A set of parameters associated with a datetime.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-datetimeparameters
     */
    readonly dateTimeParameters?: string;

    /**
     * Determines whether unmapped rows in a categorical mapping should be deleted.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-deleteotherrows
     */
    readonly deleteOtherRows?: string;

    /**
     * The delimiter to use when parsing separated values in a text file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-delimiter
     */
    readonly delimiter?: string;

    /**
     * The end pattern to locate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-endpattern
     */
    readonly endPattern?: string;

    /**
     * The end position to locate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-endposition
     */
    readonly endPosition?: string;

    /**
     * The end value to locate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-endvalue
     */
    readonly endValue?: string;

    /**
     * A list of word contractions and what they expand to.
     *
     * For eample: *can't* ; *cannot* ; *can not* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-expandcontractions
     */
    readonly expandContractions?: string;

    /**
     * The exponent to apply in an exponential operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-exponent
     */
    readonly exponent?: string;

    /**
     * A value that represents `FALSE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-falsestring
     */
    readonly falseString?: string;

    /**
     * Specifies options to apply to the `GROUP BY` used in an aggregation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-groupbyaggfunctionoptions
     */
    readonly groupByAggFunctionOptions?: string;

    /**
     * The columns to use in the `GROUP BY` clause.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-groupbycolumns
     */
    readonly groupByColumns?: string;

    /**
     * A list of columns to hide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-hiddencolumns
     */
    readonly hiddenColumns?: string;

    /**
     * Indicates that lower and upper case letters are treated equally.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-ignorecase
     */
    readonly ignoreCase?: string;

    /**
     * Indicates if this column is participating in a split transform.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-includeinsplit
     */
    readonly includeInSplit?: string;

    /**
     * The input location to load the dataset from - Amazon S3 or AWS Glue Data Catalog .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-input
     */
    readonly input?: any | cdk.IResolvable;

    /**
     * The number of characters to split by.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-interval
     */
    readonly interval?: string;

    /**
     * Indicates if the content is text.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-istext
     */
    readonly isText?: string;

    /**
     * The keys or columns involved in a join.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-joinkeys
     */
    readonly joinKeys?: string;

    /**
     * The type of join to use, for example, `INNER JOIN` , `OUTER JOIN` , and so on.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-jointype
     */
    readonly joinType?: string;

    /**
     * The columns on the left side of the join.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-leftcolumns
     */
    readonly leftColumns?: string;

    /**
     * The number of times to perform `split` or `replaceBy` in a string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-limit
     */
    readonly limit?: string;

    /**
     * The lower boundary for a value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-lowerbound
     */
    readonly lowerBound?: string;

    /**
     * The type of mappings to apply to construct a new dynamic frame.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-maptype
     */
    readonly mapType?: string;

    /**
     * Determines the manner in which mode value is calculated, in case there is more than one mode value.
     *
     * Valid values: `NONE` | `AVERAGE` | `MINIMUM` | `MAXIMUM`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-modetype
     */
    readonly modeType?: string;

    /**
     * Specifies whether JSON input contains embedded new line characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-multiline
     */
    readonly multiLine?: boolean | cdk.IResolvable;

    /**
     * The number of rows to consider in a window.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-numrows
     */
    readonly numRows?: string;

    /**
     * The number of rows to consider after the current row in a window.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-numrowsafter
     */
    readonly numRowsAfter?: string;

    /**
     * The number of rows to consider before the current row in a window.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-numrowsbefore
     */
    readonly numRowsBefore?: string;

    /**
     * A column to sort the results by.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-orderbycolumn
     */
    readonly orderByColumn?: string;

    /**
     * The columns to sort the results by.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-orderbycolumns
     */
    readonly orderByColumns?: string;

    /**
     * The value to assign to unmapped cells, in categorical mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-other
     */
    readonly other?: string;

    /**
     * The pattern to locate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-pattern
     */
    readonly pattern?: string;

    /**
     * The starting pattern to split between.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-patternoption1
     */
    readonly patternOption1?: string;

    /**
     * The ending pattern to split between.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-patternoption2
     */
    readonly patternOption2?: string;

    /**
     * For splitting by multiple delimiters: A JSON-encoded string that lists the patterns in the format.
     *
     * For example: `[{\"pattern\":\"1\",\"includeInSplit\":true}]`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-patternoptions
     */
    readonly patternOptions?: string;

    /**
     * The size of the rolling window.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-period
     */
    readonly period?: string;

    /**
     * The character index within a string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-position
     */
    readonly position?: string;

    /**
     * If `true` , removes all of the following characters: `.` `.!` `.,` `.?`.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-removeallpunctuation
     */
    readonly removeAllPunctuation?: string;

    /**
     * If `true` , removes all single quotes and double quotes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-removeallquotes
     */
    readonly removeAllQuotes?: string;

    /**
     * If `true` , removes all whitespaces from the value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-removeallwhitespace
     */
    readonly removeAllWhitespace?: string;

    /**
     * If `true` , removes all chraracters specified by `CustomCharacters` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-removecustomcharacters
     */
    readonly removeCustomCharacters?: string;

    /**
     * If `true` , removes all chraracters specified by `CustomValue` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-removecustomvalue
     */
    readonly removeCustomValue?: string;

    /**
     * If `true` , removes the following characters if they occur at the start or end of the value: `.` `!` `,` `?`.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-removeleadingandtrailingpunctuation
     */
    readonly removeLeadingAndTrailingPunctuation?: string;

    /**
     * If `true` , removes single quotes and double quotes from the beginning and end of the value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-removeleadingandtrailingquotes
     */
    readonly removeLeadingAndTrailingQuotes?: string;

    /**
     * If `true` , removes all whitespaces from the beginning and end of the value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-removeleadingandtrailingwhitespace
     */
    readonly removeLeadingAndTrailingWhitespace?: string;

    /**
     * If `true` , removes all uppercase and lowercase alphabetic characters (A through Z;
     *
     * a through z).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-removeletters
     */
    readonly removeLetters?: string;

    /**
     * If `true` , removes all numeric characters (0 through 9).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-removenumbers
     */
    readonly removeNumbers?: string;

    /**
     * If `true` , the source column will be removed after un-nesting that column.
     *
     * (Used with nested column types, such as Map, Struct, or Array.)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-removesourcecolumn
     */
    readonly removeSourceColumn?: string;

    /**
     * If `true` , removes all of the following characters: `!
     *
     * " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-removespecialcharacters
     */
    readonly removeSpecialCharacters?: string;

    /**
     * The columns on the right side of a join.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-rightcolumns
     */
    readonly rightColumns?: string;

    /**
     * The number of rows in the sample.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-samplesize
     */
    readonly sampleSize?: string;

    /**
     * The sampling type to apply to the dataset.
     *
     * Valid values: `FIRST_N` | `LAST_N` | `RANDOM`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-sampletype
     */
    readonly sampleType?: string;

    /**
     * A list of secondary inputs in a UNION transform.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-secondaryinputs
     */
    readonly secondaryInputs?: Array<cdk.IResolvable | CfnRecipe.SecondaryInputProperty> | cdk.IResolvable;

    /**
     * A object value to indicate the second dataset used in a join.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-secondinput
     */
    readonly secondInput?: string;

    /**
     * One or more sheet numbers in the Excel file, which will be included in a dataset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-sheetindexes
     */
    readonly sheetIndexes?: Array<number> | cdk.IResolvable;

    /**
     * Oone or more named sheets in the Excel file, which will be included in a dataset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-sheetnames
     */
    readonly sheetNames?: Array<string>;

    /**
     * A source column needed for an operation, step, or transform.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-sourcecolumn
     */
    readonly sourceColumn?: string;

    /**
     * A source column needed for an operation, step, or transform.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-sourcecolumn1
     */
    readonly sourceColumn1?: string;

    /**
     * A source column needed for an operation, step, or transform.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-sourcecolumn2
     */
    readonly sourceColumn2?: string;

    /**
     * A list of source columns needed for an operation, step, or transform.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-sourcecolumns
     */
    readonly sourceColumns?: string;

    /**
     * The index number of the first column used by an operation, step, or transform.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-startcolumnindex
     */
    readonly startColumnIndex?: string;

    /**
     * The starting pattern to locate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-startpattern
     */
    readonly startPattern?: string;

    /**
     * The starting position to locate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-startposition
     */
    readonly startPosition?: string;

    /**
     * The starting value to locate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-startvalue
     */
    readonly startValue?: string;

    /**
     * Indicates this operation uses stems and lemmas (base words) for word tokenization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-stemmingmode
     */
    readonly stemmingMode?: string;

    /**
     * The total number of transforms in this recipe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-stepcount
     */
    readonly stepCount?: string;

    /**
     * The index ID of a step.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-stepindex
     */
    readonly stepIndex?: string;

    /**
     * Indicates this operation uses stop words as part of word tokenization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-stopwordsmode
     */
    readonly stopWordsMode?: string;

    /**
     * The resolution strategy to apply in resolving ambiguities.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-strategy
     */
    readonly strategy?: string;

    /**
     * The column targeted by this operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-targetcolumn
     */
    readonly targetColumn?: string;

    /**
     * The names to give columns altered by this operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-targetcolumnnames
     */
    readonly targetColumnNames?: string;

    /**
     * The date format to convert to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-targetdateformat
     */
    readonly targetDateFormat?: string;

    /**
     * The index number of an object that is targeted by this operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-targetindex
     */
    readonly targetIndex?: string;

    /**
     * The current timezone that you want to use for dates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-timezone
     */
    readonly timeZone?: string;

    /**
     * A regex expression to use when splitting text into terms, also called words or tokens.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-tokenizerpattern
     */
    readonly tokenizerPattern?: string;

    /**
     * A value to use to represent `TRUE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-truestring
     */
    readonly trueString?: string;

    /**
     * The language that's used in the user-defined function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-udflang
     */
    readonly udfLang?: string;

    /**
     * Specifies a unit of time.
     *
     * For example: `MINUTES` ; `SECONDS` ; `HOURS` ; etc.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-units
     */
    readonly units?: string;

    /**
     * Cast columns as rows, so that each value is a different row in a single column.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-unpivotcolumn
     */
    readonly unpivotColumn?: string;

    /**
     * The upper boundary for a value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-upperbound
     */
    readonly upperBound?: string;

    /**
     * Create a new container to hold a dataset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-usenewdataframe
     */
    readonly useNewDataFrame?: string;

    /**
     * A static value that can be used in a comparison, a substitution, or in another context-specific way.
     *
     * A `Value` can be a number, string, or other datatype, depending on the recipe action in which it's used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-value
     */
    readonly value?: string;

    /**
     * A value that's used by this operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-value1
     */
    readonly value1?: string;

    /**
     * A value that's used by this operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-value2
     */
    readonly value2?: string;

    /**
     * The column that is provided as a value that's used by this operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-valuecolumn
     */
    readonly valueColumn?: string;

    /**
     * The subset of rows currently available for viewing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-recipeparameters.html#cfn-databrew-recipe-recipeparameters-viewframe
     */
    readonly viewFrame?: string;
  }

  /**
   * Represents secondary inputs in a UNION transform.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-secondaryinput.html
   */
  export interface SecondaryInputProperty {
    /**
     * The AWS Glue Data Catalog parameters for the data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-secondaryinput.html#cfn-databrew-recipe-secondaryinput-datacataloginputdefinition
     */
    readonly dataCatalogInputDefinition?: CfnRecipe.DataCatalogInputDefinitionProperty | cdk.IResolvable;

    /**
     * The Amazon S3 location where the data is stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-recipe-secondaryinput.html#cfn-databrew-recipe-secondaryinput-s3inputdefinition
     */
    readonly s3InputDefinition?: cdk.IResolvable | CfnRecipe.S3LocationProperty;
  }
}

/**
 * Properties for defining a `CfnRecipe`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-recipe.html
 */
export interface CfnRecipeProps {
  /**
   * The description of the recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-recipe.html#cfn-databrew-recipe-description
   */
  readonly description?: string;

  /**
   * The unique name for the recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-recipe.html#cfn-databrew-recipe-name
   */
  readonly name: string;

  /**
   * A list of steps that are defined by the recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-recipe.html#cfn-databrew-recipe-steps
   */
  readonly steps: Array<cdk.IResolvable | CfnRecipe.RecipeStepProperty> | cdk.IResolvable;

  /**
   * Metadata tags that have been applied to the recipe.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-recipe.html#cfn-databrew-recipe-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRecipeActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("operation", cdk.requiredValidator)(properties.operation));
  errors.collect(cdk.propertyValidator("operation", cdk.validateString)(properties.operation));
  errors.collect(cdk.propertyValidator("parameters", cdk.hashValidator(cdk.validateString))(properties.parameters));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRecipeActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecipeActionPropertyValidator(properties).assertSuccess();
  return {
    "Operation": cdk.stringToCloudFormation(properties.operation),
    "Parameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters)
  };
}

// @ts-ignore TS6133
function CfnRecipeActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRecipe.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecipe.ActionProperty>();
  ret.addPropertyResult("operation", "Operation", (properties.Operation != null ? cfn_parse.FromCloudFormation.getString(properties.Operation) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConditionExpressionProperty`
 *
 * @param properties - the TypeScript properties of a `ConditionExpressionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRecipeConditionExpressionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("condition", cdk.requiredValidator)(properties.condition));
  errors.collect(cdk.propertyValidator("condition", cdk.validateString)(properties.condition));
  errors.collect(cdk.propertyValidator("targetColumn", cdk.requiredValidator)(properties.targetColumn));
  errors.collect(cdk.propertyValidator("targetColumn", cdk.validateString)(properties.targetColumn));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ConditionExpressionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRecipeConditionExpressionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecipeConditionExpressionPropertyValidator(properties).assertSuccess();
  return {
    "Condition": cdk.stringToCloudFormation(properties.condition),
    "TargetColumn": cdk.stringToCloudFormation(properties.targetColumn),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnRecipeConditionExpressionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRecipe.ConditionExpressionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecipe.ConditionExpressionProperty>();
  ret.addPropertyResult("condition", "Condition", (properties.Condition != null ? cfn_parse.FromCloudFormation.getString(properties.Condition) : undefined));
  ret.addPropertyResult("targetColumn", "TargetColumn", (properties.TargetColumn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetColumn) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RecipeStepProperty`
 *
 * @param properties - the TypeScript properties of a `RecipeStepProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRecipeRecipeStepPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("action", cdk.requiredValidator)(properties.action));
  errors.collect(cdk.propertyValidator("action", CfnRecipeActionPropertyValidator)(properties.action));
  errors.collect(cdk.propertyValidator("conditionExpressions", cdk.listValidator(CfnRecipeConditionExpressionPropertyValidator))(properties.conditionExpressions));
  return errors.wrap("supplied properties not correct for \"RecipeStepProperty\"");
}

// @ts-ignore TS6133
function convertCfnRecipeRecipeStepPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecipeRecipeStepPropertyValidator(properties).assertSuccess();
  return {
    "Action": convertCfnRecipeActionPropertyToCloudFormation(properties.action),
    "ConditionExpressions": cdk.listMapper(convertCfnRecipeConditionExpressionPropertyToCloudFormation)(properties.conditionExpressions)
  };
}

// @ts-ignore TS6133
function CfnRecipeRecipeStepPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRecipe.RecipeStepProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecipe.RecipeStepProperty>();
  ret.addPropertyResult("action", "Action", (properties.Action != null ? CfnRecipeActionPropertyFromCloudFormation(properties.Action) : undefined));
  ret.addPropertyResult("conditionExpressions", "ConditionExpressions", (properties.ConditionExpressions != null ? cfn_parse.FromCloudFormation.getArray(CfnRecipeConditionExpressionPropertyFromCloudFormation)(properties.ConditionExpressions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRecipeProps`
 *
 * @param properties - the TypeScript properties of a `CfnRecipeProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRecipePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("steps", cdk.requiredValidator)(properties.steps));
  errors.collect(cdk.propertyValidator("steps", cdk.listValidator(CfnRecipeRecipeStepPropertyValidator))(properties.steps));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRecipeProps\"");
}

// @ts-ignore TS6133
function convertCfnRecipePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecipePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Steps": cdk.listMapper(convertCfnRecipeRecipeStepPropertyToCloudFormation)(properties.steps),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRecipePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRecipeProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecipeProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("steps", "Steps", (properties.Steps != null ? cfn_parse.FromCloudFormation.getArray(CfnRecipeRecipeStepPropertyFromCloudFormation)(properties.Steps) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
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
function CfnRecipeS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnRecipeS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecipeS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key)
  };
}

// @ts-ignore TS6133
function CfnRecipeS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRecipe.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecipe.S3LocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataCatalogInputDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `DataCatalogInputDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRecipeDataCatalogInputDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  errors.collect(cdk.propertyValidator("tempDirectory", CfnRecipeS3LocationPropertyValidator)(properties.tempDirectory));
  return errors.wrap("supplied properties not correct for \"DataCatalogInputDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnRecipeDataCatalogInputDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecipeDataCatalogInputDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "TableName": cdk.stringToCloudFormation(properties.tableName),
    "TempDirectory": convertCfnRecipeS3LocationPropertyToCloudFormation(properties.tempDirectory)
  };
}

// @ts-ignore TS6133
function CfnRecipeDataCatalogInputDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRecipe.DataCatalogInputDefinitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecipe.DataCatalogInputDefinitionProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addPropertyResult("tempDirectory", "TempDirectory", (properties.TempDirectory != null ? CfnRecipeS3LocationPropertyFromCloudFormation(properties.TempDirectory) : undefined));
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
function CfnRecipeInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataCatalogInputDefinition", CfnRecipeDataCatalogInputDefinitionPropertyValidator)(properties.dataCatalogInputDefinition));
  errors.collect(cdk.propertyValidator("s3InputDefinition", CfnRecipeS3LocationPropertyValidator)(properties.s3InputDefinition));
  return errors.wrap("supplied properties not correct for \"InputProperty\"");
}

// @ts-ignore TS6133
function convertCfnRecipeInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecipeInputPropertyValidator(properties).assertSuccess();
  return {
    "DataCatalogInputDefinition": convertCfnRecipeDataCatalogInputDefinitionPropertyToCloudFormation(properties.dataCatalogInputDefinition),
    "S3InputDefinition": convertCfnRecipeS3LocationPropertyToCloudFormation(properties.s3InputDefinition)
  };
}

// @ts-ignore TS6133
function CfnRecipeInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRecipe.InputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecipe.InputProperty>();
  ret.addPropertyResult("dataCatalogInputDefinition", "DataCatalogInputDefinition", (properties.DataCatalogInputDefinition != null ? CfnRecipeDataCatalogInputDefinitionPropertyFromCloudFormation(properties.DataCatalogInputDefinition) : undefined));
  ret.addPropertyResult("s3InputDefinition", "S3InputDefinition", (properties.S3InputDefinition != null ? CfnRecipeS3LocationPropertyFromCloudFormation(properties.S3InputDefinition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SecondaryInputProperty`
 *
 * @param properties - the TypeScript properties of a `SecondaryInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRecipeSecondaryInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataCatalogInputDefinition", CfnRecipeDataCatalogInputDefinitionPropertyValidator)(properties.dataCatalogInputDefinition));
  errors.collect(cdk.propertyValidator("s3InputDefinition", CfnRecipeS3LocationPropertyValidator)(properties.s3InputDefinition));
  return errors.wrap("supplied properties not correct for \"SecondaryInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnRecipeSecondaryInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecipeSecondaryInputPropertyValidator(properties).assertSuccess();
  return {
    "DataCatalogInputDefinition": convertCfnRecipeDataCatalogInputDefinitionPropertyToCloudFormation(properties.dataCatalogInputDefinition),
    "S3InputDefinition": convertCfnRecipeS3LocationPropertyToCloudFormation(properties.s3InputDefinition)
  };
}

// @ts-ignore TS6133
function CfnRecipeSecondaryInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRecipe.SecondaryInputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecipe.SecondaryInputProperty>();
  ret.addPropertyResult("dataCatalogInputDefinition", "DataCatalogInputDefinition", (properties.DataCatalogInputDefinition != null ? CfnRecipeDataCatalogInputDefinitionPropertyFromCloudFormation(properties.DataCatalogInputDefinition) : undefined));
  ret.addPropertyResult("s3InputDefinition", "S3InputDefinition", (properties.S3InputDefinition != null ? CfnRecipeS3LocationPropertyFromCloudFormation(properties.S3InputDefinition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RecipeParametersProperty`
 *
 * @param properties - the TypeScript properties of a `RecipeParametersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRecipeRecipeParametersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aggregateFunction", cdk.validateString)(properties.aggregateFunction));
  errors.collect(cdk.propertyValidator("base", cdk.validateString)(properties.base));
  errors.collect(cdk.propertyValidator("caseStatement", cdk.validateString)(properties.caseStatement));
  errors.collect(cdk.propertyValidator("categoryMap", cdk.validateString)(properties.categoryMap));
  errors.collect(cdk.propertyValidator("charsToRemove", cdk.validateString)(properties.charsToRemove));
  errors.collect(cdk.propertyValidator("collapseConsecutiveWhitespace", cdk.validateString)(properties.collapseConsecutiveWhitespace));
  errors.collect(cdk.propertyValidator("columnDataType", cdk.validateString)(properties.columnDataType));
  errors.collect(cdk.propertyValidator("columnRange", cdk.validateString)(properties.columnRange));
  errors.collect(cdk.propertyValidator("count", cdk.validateString)(properties.count));
  errors.collect(cdk.propertyValidator("customCharacters", cdk.validateString)(properties.customCharacters));
  errors.collect(cdk.propertyValidator("customStopWords", cdk.validateString)(properties.customStopWords));
  errors.collect(cdk.propertyValidator("customValue", cdk.validateString)(properties.customValue));
  errors.collect(cdk.propertyValidator("datasetsColumns", cdk.validateString)(properties.datasetsColumns));
  errors.collect(cdk.propertyValidator("dateAddValue", cdk.validateString)(properties.dateAddValue));
  errors.collect(cdk.propertyValidator("dateTimeFormat", cdk.validateString)(properties.dateTimeFormat));
  errors.collect(cdk.propertyValidator("dateTimeParameters", cdk.validateString)(properties.dateTimeParameters));
  errors.collect(cdk.propertyValidator("deleteOtherRows", cdk.validateString)(properties.deleteOtherRows));
  errors.collect(cdk.propertyValidator("delimiter", cdk.validateString)(properties.delimiter));
  errors.collect(cdk.propertyValidator("endPattern", cdk.validateString)(properties.endPattern));
  errors.collect(cdk.propertyValidator("endPosition", cdk.validateString)(properties.endPosition));
  errors.collect(cdk.propertyValidator("endValue", cdk.validateString)(properties.endValue));
  errors.collect(cdk.propertyValidator("expandContractions", cdk.validateString)(properties.expandContractions));
  errors.collect(cdk.propertyValidator("exponent", cdk.validateString)(properties.exponent));
  errors.collect(cdk.propertyValidator("falseString", cdk.validateString)(properties.falseString));
  errors.collect(cdk.propertyValidator("groupByAggFunctionOptions", cdk.validateString)(properties.groupByAggFunctionOptions));
  errors.collect(cdk.propertyValidator("groupByColumns", cdk.validateString)(properties.groupByColumns));
  errors.collect(cdk.propertyValidator("hiddenColumns", cdk.validateString)(properties.hiddenColumns));
  errors.collect(cdk.propertyValidator("ignoreCase", cdk.validateString)(properties.ignoreCase));
  errors.collect(cdk.propertyValidator("includeInSplit", cdk.validateString)(properties.includeInSplit));
  errors.collect(cdk.propertyValidator("input", cdk.validateObject)(properties.input));
  errors.collect(cdk.propertyValidator("interval", cdk.validateString)(properties.interval));
  errors.collect(cdk.propertyValidator("isText", cdk.validateString)(properties.isText));
  errors.collect(cdk.propertyValidator("joinKeys", cdk.validateString)(properties.joinKeys));
  errors.collect(cdk.propertyValidator("joinType", cdk.validateString)(properties.joinType));
  errors.collect(cdk.propertyValidator("leftColumns", cdk.validateString)(properties.leftColumns));
  errors.collect(cdk.propertyValidator("limit", cdk.validateString)(properties.limit));
  errors.collect(cdk.propertyValidator("lowerBound", cdk.validateString)(properties.lowerBound));
  errors.collect(cdk.propertyValidator("mapType", cdk.validateString)(properties.mapType));
  errors.collect(cdk.propertyValidator("modeType", cdk.validateString)(properties.modeType));
  errors.collect(cdk.propertyValidator("multiLine", cdk.validateBoolean)(properties.multiLine));
  errors.collect(cdk.propertyValidator("numRows", cdk.validateString)(properties.numRows));
  errors.collect(cdk.propertyValidator("numRowsAfter", cdk.validateString)(properties.numRowsAfter));
  errors.collect(cdk.propertyValidator("numRowsBefore", cdk.validateString)(properties.numRowsBefore));
  errors.collect(cdk.propertyValidator("orderByColumn", cdk.validateString)(properties.orderByColumn));
  errors.collect(cdk.propertyValidator("orderByColumns", cdk.validateString)(properties.orderByColumns));
  errors.collect(cdk.propertyValidator("other", cdk.validateString)(properties.other));
  errors.collect(cdk.propertyValidator("pattern", cdk.validateString)(properties.pattern));
  errors.collect(cdk.propertyValidator("patternOption1", cdk.validateString)(properties.patternOption1));
  errors.collect(cdk.propertyValidator("patternOption2", cdk.validateString)(properties.patternOption2));
  errors.collect(cdk.propertyValidator("patternOptions", cdk.validateString)(properties.patternOptions));
  errors.collect(cdk.propertyValidator("period", cdk.validateString)(properties.period));
  errors.collect(cdk.propertyValidator("position", cdk.validateString)(properties.position));
  errors.collect(cdk.propertyValidator("removeAllPunctuation", cdk.validateString)(properties.removeAllPunctuation));
  errors.collect(cdk.propertyValidator("removeAllQuotes", cdk.validateString)(properties.removeAllQuotes));
  errors.collect(cdk.propertyValidator("removeAllWhitespace", cdk.validateString)(properties.removeAllWhitespace));
  errors.collect(cdk.propertyValidator("removeCustomCharacters", cdk.validateString)(properties.removeCustomCharacters));
  errors.collect(cdk.propertyValidator("removeCustomValue", cdk.validateString)(properties.removeCustomValue));
  errors.collect(cdk.propertyValidator("removeLeadingAndTrailingPunctuation", cdk.validateString)(properties.removeLeadingAndTrailingPunctuation));
  errors.collect(cdk.propertyValidator("removeLeadingAndTrailingQuotes", cdk.validateString)(properties.removeLeadingAndTrailingQuotes));
  errors.collect(cdk.propertyValidator("removeLeadingAndTrailingWhitespace", cdk.validateString)(properties.removeLeadingAndTrailingWhitespace));
  errors.collect(cdk.propertyValidator("removeLetters", cdk.validateString)(properties.removeLetters));
  errors.collect(cdk.propertyValidator("removeNumbers", cdk.validateString)(properties.removeNumbers));
  errors.collect(cdk.propertyValidator("removeSourceColumn", cdk.validateString)(properties.removeSourceColumn));
  errors.collect(cdk.propertyValidator("removeSpecialCharacters", cdk.validateString)(properties.removeSpecialCharacters));
  errors.collect(cdk.propertyValidator("rightColumns", cdk.validateString)(properties.rightColumns));
  errors.collect(cdk.propertyValidator("sampleSize", cdk.validateString)(properties.sampleSize));
  errors.collect(cdk.propertyValidator("sampleType", cdk.validateString)(properties.sampleType));
  errors.collect(cdk.propertyValidator("secondInput", cdk.validateString)(properties.secondInput));
  errors.collect(cdk.propertyValidator("secondaryInputs", cdk.listValidator(CfnRecipeSecondaryInputPropertyValidator))(properties.secondaryInputs));
  errors.collect(cdk.propertyValidator("sheetIndexes", cdk.listValidator(cdk.validateNumber))(properties.sheetIndexes));
  errors.collect(cdk.propertyValidator("sheetNames", cdk.listValidator(cdk.validateString))(properties.sheetNames));
  errors.collect(cdk.propertyValidator("sourceColumn", cdk.validateString)(properties.sourceColumn));
  errors.collect(cdk.propertyValidator("sourceColumn1", cdk.validateString)(properties.sourceColumn1));
  errors.collect(cdk.propertyValidator("sourceColumn2", cdk.validateString)(properties.sourceColumn2));
  errors.collect(cdk.propertyValidator("sourceColumns", cdk.validateString)(properties.sourceColumns));
  errors.collect(cdk.propertyValidator("startColumnIndex", cdk.validateString)(properties.startColumnIndex));
  errors.collect(cdk.propertyValidator("startPattern", cdk.validateString)(properties.startPattern));
  errors.collect(cdk.propertyValidator("startPosition", cdk.validateString)(properties.startPosition));
  errors.collect(cdk.propertyValidator("startValue", cdk.validateString)(properties.startValue));
  errors.collect(cdk.propertyValidator("stemmingMode", cdk.validateString)(properties.stemmingMode));
  errors.collect(cdk.propertyValidator("stepCount", cdk.validateString)(properties.stepCount));
  errors.collect(cdk.propertyValidator("stepIndex", cdk.validateString)(properties.stepIndex));
  errors.collect(cdk.propertyValidator("stopWordsMode", cdk.validateString)(properties.stopWordsMode));
  errors.collect(cdk.propertyValidator("strategy", cdk.validateString)(properties.strategy));
  errors.collect(cdk.propertyValidator("targetColumn", cdk.validateString)(properties.targetColumn));
  errors.collect(cdk.propertyValidator("targetColumnNames", cdk.validateString)(properties.targetColumnNames));
  errors.collect(cdk.propertyValidator("targetDateFormat", cdk.validateString)(properties.targetDateFormat));
  errors.collect(cdk.propertyValidator("targetIndex", cdk.validateString)(properties.targetIndex));
  errors.collect(cdk.propertyValidator("timeZone", cdk.validateString)(properties.timeZone));
  errors.collect(cdk.propertyValidator("tokenizerPattern", cdk.validateString)(properties.tokenizerPattern));
  errors.collect(cdk.propertyValidator("trueString", cdk.validateString)(properties.trueString));
  errors.collect(cdk.propertyValidator("udfLang", cdk.validateString)(properties.udfLang));
  errors.collect(cdk.propertyValidator("units", cdk.validateString)(properties.units));
  errors.collect(cdk.propertyValidator("unpivotColumn", cdk.validateString)(properties.unpivotColumn));
  errors.collect(cdk.propertyValidator("upperBound", cdk.validateString)(properties.upperBound));
  errors.collect(cdk.propertyValidator("useNewDataFrame", cdk.validateString)(properties.useNewDataFrame));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  errors.collect(cdk.propertyValidator("value1", cdk.validateString)(properties.value1));
  errors.collect(cdk.propertyValidator("value2", cdk.validateString)(properties.value2));
  errors.collect(cdk.propertyValidator("valueColumn", cdk.validateString)(properties.valueColumn));
  errors.collect(cdk.propertyValidator("viewFrame", cdk.validateString)(properties.viewFrame));
  return errors.wrap("supplied properties not correct for \"RecipeParametersProperty\"");
}

// @ts-ignore TS6133
function convertCfnRecipeRecipeParametersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRecipeRecipeParametersPropertyValidator(properties).assertSuccess();
  return {
    "AggregateFunction": cdk.stringToCloudFormation(properties.aggregateFunction),
    "Base": cdk.stringToCloudFormation(properties.base),
    "CaseStatement": cdk.stringToCloudFormation(properties.caseStatement),
    "CategoryMap": cdk.stringToCloudFormation(properties.categoryMap),
    "CharsToRemove": cdk.stringToCloudFormation(properties.charsToRemove),
    "CollapseConsecutiveWhitespace": cdk.stringToCloudFormation(properties.collapseConsecutiveWhitespace),
    "ColumnDataType": cdk.stringToCloudFormation(properties.columnDataType),
    "ColumnRange": cdk.stringToCloudFormation(properties.columnRange),
    "Count": cdk.stringToCloudFormation(properties.count),
    "CustomCharacters": cdk.stringToCloudFormation(properties.customCharacters),
    "CustomStopWords": cdk.stringToCloudFormation(properties.customStopWords),
    "CustomValue": cdk.stringToCloudFormation(properties.customValue),
    "DatasetsColumns": cdk.stringToCloudFormation(properties.datasetsColumns),
    "DateAddValue": cdk.stringToCloudFormation(properties.dateAddValue),
    "DateTimeFormat": cdk.stringToCloudFormation(properties.dateTimeFormat),
    "DateTimeParameters": cdk.stringToCloudFormation(properties.dateTimeParameters),
    "DeleteOtherRows": cdk.stringToCloudFormation(properties.deleteOtherRows),
    "Delimiter": cdk.stringToCloudFormation(properties.delimiter),
    "EndPattern": cdk.stringToCloudFormation(properties.endPattern),
    "EndPosition": cdk.stringToCloudFormation(properties.endPosition),
    "EndValue": cdk.stringToCloudFormation(properties.endValue),
    "ExpandContractions": cdk.stringToCloudFormation(properties.expandContractions),
    "Exponent": cdk.stringToCloudFormation(properties.exponent),
    "FalseString": cdk.stringToCloudFormation(properties.falseString),
    "GroupByAggFunctionOptions": cdk.stringToCloudFormation(properties.groupByAggFunctionOptions),
    "GroupByColumns": cdk.stringToCloudFormation(properties.groupByColumns),
    "HiddenColumns": cdk.stringToCloudFormation(properties.hiddenColumns),
    "IgnoreCase": cdk.stringToCloudFormation(properties.ignoreCase),
    "IncludeInSplit": cdk.stringToCloudFormation(properties.includeInSplit),
    "Input": cdk.objectToCloudFormation(properties.input),
    "Interval": cdk.stringToCloudFormation(properties.interval),
    "IsText": cdk.stringToCloudFormation(properties.isText),
    "JoinKeys": cdk.stringToCloudFormation(properties.joinKeys),
    "JoinType": cdk.stringToCloudFormation(properties.joinType),
    "LeftColumns": cdk.stringToCloudFormation(properties.leftColumns),
    "Limit": cdk.stringToCloudFormation(properties.limit),
    "LowerBound": cdk.stringToCloudFormation(properties.lowerBound),
    "MapType": cdk.stringToCloudFormation(properties.mapType),
    "ModeType": cdk.stringToCloudFormation(properties.modeType),
    "MultiLine": cdk.booleanToCloudFormation(properties.multiLine),
    "NumRows": cdk.stringToCloudFormation(properties.numRows),
    "NumRowsAfter": cdk.stringToCloudFormation(properties.numRowsAfter),
    "NumRowsBefore": cdk.stringToCloudFormation(properties.numRowsBefore),
    "OrderByColumn": cdk.stringToCloudFormation(properties.orderByColumn),
    "OrderByColumns": cdk.stringToCloudFormation(properties.orderByColumns),
    "Other": cdk.stringToCloudFormation(properties.other),
    "Pattern": cdk.stringToCloudFormation(properties.pattern),
    "PatternOption1": cdk.stringToCloudFormation(properties.patternOption1),
    "PatternOption2": cdk.stringToCloudFormation(properties.patternOption2),
    "PatternOptions": cdk.stringToCloudFormation(properties.patternOptions),
    "Period": cdk.stringToCloudFormation(properties.period),
    "Position": cdk.stringToCloudFormation(properties.position),
    "RemoveAllPunctuation": cdk.stringToCloudFormation(properties.removeAllPunctuation),
    "RemoveAllQuotes": cdk.stringToCloudFormation(properties.removeAllQuotes),
    "RemoveAllWhitespace": cdk.stringToCloudFormation(properties.removeAllWhitespace),
    "RemoveCustomCharacters": cdk.stringToCloudFormation(properties.removeCustomCharacters),
    "RemoveCustomValue": cdk.stringToCloudFormation(properties.removeCustomValue),
    "RemoveLeadingAndTrailingPunctuation": cdk.stringToCloudFormation(properties.removeLeadingAndTrailingPunctuation),
    "RemoveLeadingAndTrailingQuotes": cdk.stringToCloudFormation(properties.removeLeadingAndTrailingQuotes),
    "RemoveLeadingAndTrailingWhitespace": cdk.stringToCloudFormation(properties.removeLeadingAndTrailingWhitespace),
    "RemoveLetters": cdk.stringToCloudFormation(properties.removeLetters),
    "RemoveNumbers": cdk.stringToCloudFormation(properties.removeNumbers),
    "RemoveSourceColumn": cdk.stringToCloudFormation(properties.removeSourceColumn),
    "RemoveSpecialCharacters": cdk.stringToCloudFormation(properties.removeSpecialCharacters),
    "RightColumns": cdk.stringToCloudFormation(properties.rightColumns),
    "SampleSize": cdk.stringToCloudFormation(properties.sampleSize),
    "SampleType": cdk.stringToCloudFormation(properties.sampleType),
    "SecondInput": cdk.stringToCloudFormation(properties.secondInput),
    "SecondaryInputs": cdk.listMapper(convertCfnRecipeSecondaryInputPropertyToCloudFormation)(properties.secondaryInputs),
    "SheetIndexes": cdk.listMapper(cdk.numberToCloudFormation)(properties.sheetIndexes),
    "SheetNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.sheetNames),
    "SourceColumn": cdk.stringToCloudFormation(properties.sourceColumn),
    "SourceColumn1": cdk.stringToCloudFormation(properties.sourceColumn1),
    "SourceColumn2": cdk.stringToCloudFormation(properties.sourceColumn2),
    "SourceColumns": cdk.stringToCloudFormation(properties.sourceColumns),
    "StartColumnIndex": cdk.stringToCloudFormation(properties.startColumnIndex),
    "StartPattern": cdk.stringToCloudFormation(properties.startPattern),
    "StartPosition": cdk.stringToCloudFormation(properties.startPosition),
    "StartValue": cdk.stringToCloudFormation(properties.startValue),
    "StemmingMode": cdk.stringToCloudFormation(properties.stemmingMode),
    "StepCount": cdk.stringToCloudFormation(properties.stepCount),
    "StepIndex": cdk.stringToCloudFormation(properties.stepIndex),
    "StopWordsMode": cdk.stringToCloudFormation(properties.stopWordsMode),
    "Strategy": cdk.stringToCloudFormation(properties.strategy),
    "TargetColumn": cdk.stringToCloudFormation(properties.targetColumn),
    "TargetColumnNames": cdk.stringToCloudFormation(properties.targetColumnNames),
    "TargetDateFormat": cdk.stringToCloudFormation(properties.targetDateFormat),
    "TargetIndex": cdk.stringToCloudFormation(properties.targetIndex),
    "TimeZone": cdk.stringToCloudFormation(properties.timeZone),
    "TokenizerPattern": cdk.stringToCloudFormation(properties.tokenizerPattern),
    "TrueString": cdk.stringToCloudFormation(properties.trueString),
    "UdfLang": cdk.stringToCloudFormation(properties.udfLang),
    "Units": cdk.stringToCloudFormation(properties.units),
    "UnpivotColumn": cdk.stringToCloudFormation(properties.unpivotColumn),
    "UpperBound": cdk.stringToCloudFormation(properties.upperBound),
    "UseNewDataFrame": cdk.stringToCloudFormation(properties.useNewDataFrame),
    "Value": cdk.stringToCloudFormation(properties.value),
    "Value1": cdk.stringToCloudFormation(properties.value1),
    "Value2": cdk.stringToCloudFormation(properties.value2),
    "ValueColumn": cdk.stringToCloudFormation(properties.valueColumn),
    "ViewFrame": cdk.stringToCloudFormation(properties.viewFrame)
  };
}

// @ts-ignore TS6133
function CfnRecipeRecipeParametersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRecipe.RecipeParametersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRecipe.RecipeParametersProperty>();
  ret.addPropertyResult("aggregateFunction", "AggregateFunction", (properties.AggregateFunction != null ? cfn_parse.FromCloudFormation.getString(properties.AggregateFunction) : undefined));
  ret.addPropertyResult("base", "Base", (properties.Base != null ? cfn_parse.FromCloudFormation.getString(properties.Base) : undefined));
  ret.addPropertyResult("caseStatement", "CaseStatement", (properties.CaseStatement != null ? cfn_parse.FromCloudFormation.getString(properties.CaseStatement) : undefined));
  ret.addPropertyResult("categoryMap", "CategoryMap", (properties.CategoryMap != null ? cfn_parse.FromCloudFormation.getString(properties.CategoryMap) : undefined));
  ret.addPropertyResult("charsToRemove", "CharsToRemove", (properties.CharsToRemove != null ? cfn_parse.FromCloudFormation.getString(properties.CharsToRemove) : undefined));
  ret.addPropertyResult("collapseConsecutiveWhitespace", "CollapseConsecutiveWhitespace", (properties.CollapseConsecutiveWhitespace != null ? cfn_parse.FromCloudFormation.getString(properties.CollapseConsecutiveWhitespace) : undefined));
  ret.addPropertyResult("columnDataType", "ColumnDataType", (properties.ColumnDataType != null ? cfn_parse.FromCloudFormation.getString(properties.ColumnDataType) : undefined));
  ret.addPropertyResult("columnRange", "ColumnRange", (properties.ColumnRange != null ? cfn_parse.FromCloudFormation.getString(properties.ColumnRange) : undefined));
  ret.addPropertyResult("count", "Count", (properties.Count != null ? cfn_parse.FromCloudFormation.getString(properties.Count) : undefined));
  ret.addPropertyResult("customCharacters", "CustomCharacters", (properties.CustomCharacters != null ? cfn_parse.FromCloudFormation.getString(properties.CustomCharacters) : undefined));
  ret.addPropertyResult("customStopWords", "CustomStopWords", (properties.CustomStopWords != null ? cfn_parse.FromCloudFormation.getString(properties.CustomStopWords) : undefined));
  ret.addPropertyResult("customValue", "CustomValue", (properties.CustomValue != null ? cfn_parse.FromCloudFormation.getString(properties.CustomValue) : undefined));
  ret.addPropertyResult("datasetsColumns", "DatasetsColumns", (properties.DatasetsColumns != null ? cfn_parse.FromCloudFormation.getString(properties.DatasetsColumns) : undefined));
  ret.addPropertyResult("dateAddValue", "DateAddValue", (properties.DateAddValue != null ? cfn_parse.FromCloudFormation.getString(properties.DateAddValue) : undefined));
  ret.addPropertyResult("dateTimeFormat", "DateTimeFormat", (properties.DateTimeFormat != null ? cfn_parse.FromCloudFormation.getString(properties.DateTimeFormat) : undefined));
  ret.addPropertyResult("dateTimeParameters", "DateTimeParameters", (properties.DateTimeParameters != null ? cfn_parse.FromCloudFormation.getString(properties.DateTimeParameters) : undefined));
  ret.addPropertyResult("deleteOtherRows", "DeleteOtherRows", (properties.DeleteOtherRows != null ? cfn_parse.FromCloudFormation.getString(properties.DeleteOtherRows) : undefined));
  ret.addPropertyResult("delimiter", "Delimiter", (properties.Delimiter != null ? cfn_parse.FromCloudFormation.getString(properties.Delimiter) : undefined));
  ret.addPropertyResult("endPattern", "EndPattern", (properties.EndPattern != null ? cfn_parse.FromCloudFormation.getString(properties.EndPattern) : undefined));
  ret.addPropertyResult("endPosition", "EndPosition", (properties.EndPosition != null ? cfn_parse.FromCloudFormation.getString(properties.EndPosition) : undefined));
  ret.addPropertyResult("endValue", "EndValue", (properties.EndValue != null ? cfn_parse.FromCloudFormation.getString(properties.EndValue) : undefined));
  ret.addPropertyResult("expandContractions", "ExpandContractions", (properties.ExpandContractions != null ? cfn_parse.FromCloudFormation.getString(properties.ExpandContractions) : undefined));
  ret.addPropertyResult("exponent", "Exponent", (properties.Exponent != null ? cfn_parse.FromCloudFormation.getString(properties.Exponent) : undefined));
  ret.addPropertyResult("falseString", "FalseString", (properties.FalseString != null ? cfn_parse.FromCloudFormation.getString(properties.FalseString) : undefined));
  ret.addPropertyResult("groupByAggFunctionOptions", "GroupByAggFunctionOptions", (properties.GroupByAggFunctionOptions != null ? cfn_parse.FromCloudFormation.getString(properties.GroupByAggFunctionOptions) : undefined));
  ret.addPropertyResult("groupByColumns", "GroupByColumns", (properties.GroupByColumns != null ? cfn_parse.FromCloudFormation.getString(properties.GroupByColumns) : undefined));
  ret.addPropertyResult("hiddenColumns", "HiddenColumns", (properties.HiddenColumns != null ? cfn_parse.FromCloudFormation.getString(properties.HiddenColumns) : undefined));
  ret.addPropertyResult("ignoreCase", "IgnoreCase", (properties.IgnoreCase != null ? cfn_parse.FromCloudFormation.getString(properties.IgnoreCase) : undefined));
  ret.addPropertyResult("includeInSplit", "IncludeInSplit", (properties.IncludeInSplit != null ? cfn_parse.FromCloudFormation.getString(properties.IncludeInSplit) : undefined));
  ret.addPropertyResult("input", "Input", (properties.Input != null ? cfn_parse.FromCloudFormation.getAny(properties.Input) : undefined));
  ret.addPropertyResult("interval", "Interval", (properties.Interval != null ? cfn_parse.FromCloudFormation.getString(properties.Interval) : undefined));
  ret.addPropertyResult("isText", "IsText", (properties.IsText != null ? cfn_parse.FromCloudFormation.getString(properties.IsText) : undefined));
  ret.addPropertyResult("joinKeys", "JoinKeys", (properties.JoinKeys != null ? cfn_parse.FromCloudFormation.getString(properties.JoinKeys) : undefined));
  ret.addPropertyResult("joinType", "JoinType", (properties.JoinType != null ? cfn_parse.FromCloudFormation.getString(properties.JoinType) : undefined));
  ret.addPropertyResult("leftColumns", "LeftColumns", (properties.LeftColumns != null ? cfn_parse.FromCloudFormation.getString(properties.LeftColumns) : undefined));
  ret.addPropertyResult("limit", "Limit", (properties.Limit != null ? cfn_parse.FromCloudFormation.getString(properties.Limit) : undefined));
  ret.addPropertyResult("lowerBound", "LowerBound", (properties.LowerBound != null ? cfn_parse.FromCloudFormation.getString(properties.LowerBound) : undefined));
  ret.addPropertyResult("mapType", "MapType", (properties.MapType != null ? cfn_parse.FromCloudFormation.getString(properties.MapType) : undefined));
  ret.addPropertyResult("modeType", "ModeType", (properties.ModeType != null ? cfn_parse.FromCloudFormation.getString(properties.ModeType) : undefined));
  ret.addPropertyResult("multiLine", "MultiLine", (properties.MultiLine != null ? cfn_parse.FromCloudFormation.getBoolean(properties.MultiLine) : undefined));
  ret.addPropertyResult("numRows", "NumRows", (properties.NumRows != null ? cfn_parse.FromCloudFormation.getString(properties.NumRows) : undefined));
  ret.addPropertyResult("numRowsAfter", "NumRowsAfter", (properties.NumRowsAfter != null ? cfn_parse.FromCloudFormation.getString(properties.NumRowsAfter) : undefined));
  ret.addPropertyResult("numRowsBefore", "NumRowsBefore", (properties.NumRowsBefore != null ? cfn_parse.FromCloudFormation.getString(properties.NumRowsBefore) : undefined));
  ret.addPropertyResult("orderByColumn", "OrderByColumn", (properties.OrderByColumn != null ? cfn_parse.FromCloudFormation.getString(properties.OrderByColumn) : undefined));
  ret.addPropertyResult("orderByColumns", "OrderByColumns", (properties.OrderByColumns != null ? cfn_parse.FromCloudFormation.getString(properties.OrderByColumns) : undefined));
  ret.addPropertyResult("other", "Other", (properties.Other != null ? cfn_parse.FromCloudFormation.getString(properties.Other) : undefined));
  ret.addPropertyResult("pattern", "Pattern", (properties.Pattern != null ? cfn_parse.FromCloudFormation.getString(properties.Pattern) : undefined));
  ret.addPropertyResult("patternOption1", "PatternOption1", (properties.PatternOption1 != null ? cfn_parse.FromCloudFormation.getString(properties.PatternOption1) : undefined));
  ret.addPropertyResult("patternOption2", "PatternOption2", (properties.PatternOption2 != null ? cfn_parse.FromCloudFormation.getString(properties.PatternOption2) : undefined));
  ret.addPropertyResult("patternOptions", "PatternOptions", (properties.PatternOptions != null ? cfn_parse.FromCloudFormation.getString(properties.PatternOptions) : undefined));
  ret.addPropertyResult("period", "Period", (properties.Period != null ? cfn_parse.FromCloudFormation.getString(properties.Period) : undefined));
  ret.addPropertyResult("position", "Position", (properties.Position != null ? cfn_parse.FromCloudFormation.getString(properties.Position) : undefined));
  ret.addPropertyResult("removeAllPunctuation", "RemoveAllPunctuation", (properties.RemoveAllPunctuation != null ? cfn_parse.FromCloudFormation.getString(properties.RemoveAllPunctuation) : undefined));
  ret.addPropertyResult("removeAllQuotes", "RemoveAllQuotes", (properties.RemoveAllQuotes != null ? cfn_parse.FromCloudFormation.getString(properties.RemoveAllQuotes) : undefined));
  ret.addPropertyResult("removeAllWhitespace", "RemoveAllWhitespace", (properties.RemoveAllWhitespace != null ? cfn_parse.FromCloudFormation.getString(properties.RemoveAllWhitespace) : undefined));
  ret.addPropertyResult("removeCustomCharacters", "RemoveCustomCharacters", (properties.RemoveCustomCharacters != null ? cfn_parse.FromCloudFormation.getString(properties.RemoveCustomCharacters) : undefined));
  ret.addPropertyResult("removeCustomValue", "RemoveCustomValue", (properties.RemoveCustomValue != null ? cfn_parse.FromCloudFormation.getString(properties.RemoveCustomValue) : undefined));
  ret.addPropertyResult("removeLeadingAndTrailingPunctuation", "RemoveLeadingAndTrailingPunctuation", (properties.RemoveLeadingAndTrailingPunctuation != null ? cfn_parse.FromCloudFormation.getString(properties.RemoveLeadingAndTrailingPunctuation) : undefined));
  ret.addPropertyResult("removeLeadingAndTrailingQuotes", "RemoveLeadingAndTrailingQuotes", (properties.RemoveLeadingAndTrailingQuotes != null ? cfn_parse.FromCloudFormation.getString(properties.RemoveLeadingAndTrailingQuotes) : undefined));
  ret.addPropertyResult("removeLeadingAndTrailingWhitespace", "RemoveLeadingAndTrailingWhitespace", (properties.RemoveLeadingAndTrailingWhitespace != null ? cfn_parse.FromCloudFormation.getString(properties.RemoveLeadingAndTrailingWhitespace) : undefined));
  ret.addPropertyResult("removeLetters", "RemoveLetters", (properties.RemoveLetters != null ? cfn_parse.FromCloudFormation.getString(properties.RemoveLetters) : undefined));
  ret.addPropertyResult("removeNumbers", "RemoveNumbers", (properties.RemoveNumbers != null ? cfn_parse.FromCloudFormation.getString(properties.RemoveNumbers) : undefined));
  ret.addPropertyResult("removeSourceColumn", "RemoveSourceColumn", (properties.RemoveSourceColumn != null ? cfn_parse.FromCloudFormation.getString(properties.RemoveSourceColumn) : undefined));
  ret.addPropertyResult("removeSpecialCharacters", "RemoveSpecialCharacters", (properties.RemoveSpecialCharacters != null ? cfn_parse.FromCloudFormation.getString(properties.RemoveSpecialCharacters) : undefined));
  ret.addPropertyResult("rightColumns", "RightColumns", (properties.RightColumns != null ? cfn_parse.FromCloudFormation.getString(properties.RightColumns) : undefined));
  ret.addPropertyResult("sampleSize", "SampleSize", (properties.SampleSize != null ? cfn_parse.FromCloudFormation.getString(properties.SampleSize) : undefined));
  ret.addPropertyResult("sampleType", "SampleType", (properties.SampleType != null ? cfn_parse.FromCloudFormation.getString(properties.SampleType) : undefined));
  ret.addPropertyResult("secondaryInputs", "SecondaryInputs", (properties.SecondaryInputs != null ? cfn_parse.FromCloudFormation.getArray(CfnRecipeSecondaryInputPropertyFromCloudFormation)(properties.SecondaryInputs) : undefined));
  ret.addPropertyResult("secondInput", "SecondInput", (properties.SecondInput != null ? cfn_parse.FromCloudFormation.getString(properties.SecondInput) : undefined));
  ret.addPropertyResult("sheetIndexes", "SheetIndexes", (properties.SheetIndexes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getNumber)(properties.SheetIndexes) : undefined));
  ret.addPropertyResult("sheetNames", "SheetNames", (properties.SheetNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SheetNames) : undefined));
  ret.addPropertyResult("sourceColumn", "SourceColumn", (properties.SourceColumn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceColumn) : undefined));
  ret.addPropertyResult("sourceColumn1", "SourceColumn1", (properties.SourceColumn1 != null ? cfn_parse.FromCloudFormation.getString(properties.SourceColumn1) : undefined));
  ret.addPropertyResult("sourceColumn2", "SourceColumn2", (properties.SourceColumn2 != null ? cfn_parse.FromCloudFormation.getString(properties.SourceColumn2) : undefined));
  ret.addPropertyResult("sourceColumns", "SourceColumns", (properties.SourceColumns != null ? cfn_parse.FromCloudFormation.getString(properties.SourceColumns) : undefined));
  ret.addPropertyResult("startColumnIndex", "StartColumnIndex", (properties.StartColumnIndex != null ? cfn_parse.FromCloudFormation.getString(properties.StartColumnIndex) : undefined));
  ret.addPropertyResult("startPattern", "StartPattern", (properties.StartPattern != null ? cfn_parse.FromCloudFormation.getString(properties.StartPattern) : undefined));
  ret.addPropertyResult("startPosition", "StartPosition", (properties.StartPosition != null ? cfn_parse.FromCloudFormation.getString(properties.StartPosition) : undefined));
  ret.addPropertyResult("startValue", "StartValue", (properties.StartValue != null ? cfn_parse.FromCloudFormation.getString(properties.StartValue) : undefined));
  ret.addPropertyResult("stemmingMode", "StemmingMode", (properties.StemmingMode != null ? cfn_parse.FromCloudFormation.getString(properties.StemmingMode) : undefined));
  ret.addPropertyResult("stepCount", "StepCount", (properties.StepCount != null ? cfn_parse.FromCloudFormation.getString(properties.StepCount) : undefined));
  ret.addPropertyResult("stepIndex", "StepIndex", (properties.StepIndex != null ? cfn_parse.FromCloudFormation.getString(properties.StepIndex) : undefined));
  ret.addPropertyResult("stopWordsMode", "StopWordsMode", (properties.StopWordsMode != null ? cfn_parse.FromCloudFormation.getString(properties.StopWordsMode) : undefined));
  ret.addPropertyResult("strategy", "Strategy", (properties.Strategy != null ? cfn_parse.FromCloudFormation.getString(properties.Strategy) : undefined));
  ret.addPropertyResult("targetColumn", "TargetColumn", (properties.TargetColumn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetColumn) : undefined));
  ret.addPropertyResult("targetColumnNames", "TargetColumnNames", (properties.TargetColumnNames != null ? cfn_parse.FromCloudFormation.getString(properties.TargetColumnNames) : undefined));
  ret.addPropertyResult("targetDateFormat", "TargetDateFormat", (properties.TargetDateFormat != null ? cfn_parse.FromCloudFormation.getString(properties.TargetDateFormat) : undefined));
  ret.addPropertyResult("targetIndex", "TargetIndex", (properties.TargetIndex != null ? cfn_parse.FromCloudFormation.getString(properties.TargetIndex) : undefined));
  ret.addPropertyResult("timeZone", "TimeZone", (properties.TimeZone != null ? cfn_parse.FromCloudFormation.getString(properties.TimeZone) : undefined));
  ret.addPropertyResult("tokenizerPattern", "TokenizerPattern", (properties.TokenizerPattern != null ? cfn_parse.FromCloudFormation.getString(properties.TokenizerPattern) : undefined));
  ret.addPropertyResult("trueString", "TrueString", (properties.TrueString != null ? cfn_parse.FromCloudFormation.getString(properties.TrueString) : undefined));
  ret.addPropertyResult("udfLang", "UdfLang", (properties.UdfLang != null ? cfn_parse.FromCloudFormation.getString(properties.UdfLang) : undefined));
  ret.addPropertyResult("units", "Units", (properties.Units != null ? cfn_parse.FromCloudFormation.getString(properties.Units) : undefined));
  ret.addPropertyResult("unpivotColumn", "UnpivotColumn", (properties.UnpivotColumn != null ? cfn_parse.FromCloudFormation.getString(properties.UnpivotColumn) : undefined));
  ret.addPropertyResult("upperBound", "UpperBound", (properties.UpperBound != null ? cfn_parse.FromCloudFormation.getString(properties.UpperBound) : undefined));
  ret.addPropertyResult("useNewDataFrame", "UseNewDataFrame", (properties.UseNewDataFrame != null ? cfn_parse.FromCloudFormation.getString(properties.UseNewDataFrame) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addPropertyResult("value1", "Value1", (properties.Value1 != null ? cfn_parse.FromCloudFormation.getString(properties.Value1) : undefined));
  ret.addPropertyResult("value2", "Value2", (properties.Value2 != null ? cfn_parse.FromCloudFormation.getString(properties.Value2) : undefined));
  ret.addPropertyResult("valueColumn", "ValueColumn", (properties.ValueColumn != null ? cfn_parse.FromCloudFormation.getString(properties.ValueColumn) : undefined));
  ret.addPropertyResult("viewFrame", "ViewFrame", (properties.ViewFrame != null ? cfn_parse.FromCloudFormation.getString(properties.ViewFrame) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a new ruleset that can be used in a profile job to validate the data quality of a dataset.
 *
 * @cloudformationResource AWS::DataBrew::Ruleset
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-ruleset.html
 */
export class CfnRuleset extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataBrew::Ruleset";

  /**
   * Build a CfnRuleset from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRuleset {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRulesetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRuleset(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The description of the ruleset.
   */
  public description?: string;

  /**
   * The name of the ruleset.
   */
  public name: string;

  /**
   * Contains metadata about the ruleset.
   */
  public rules: Array<cdk.IResolvable | CfnRuleset.RuleProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The Amazon Resource Name (ARN) of a resource (dataset) that the ruleset is associated with.
   */
  public targetArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnRulesetProps) {
    super(scope, id, {
      "type": CfnRuleset.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "rules", this);
    cdk.requireProperty(props, "targetArn", this);

    this.description = props.description;
    this.name = props.name;
    this.rules = props.rules;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataBrew::Ruleset", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targetArn = props.targetArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "name": this.name,
      "rules": this.rules,
      "tags": this.tags.renderTags(),
      "targetArn": this.targetArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRuleset.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRulesetPropsToCloudFormation(props);
  }
}

export namespace CfnRuleset {
  /**
   * Represents a single data quality requirement that should be validated in the scope of this dataset.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-rule.html
   */
  export interface RuleProperty {
    /**
     * The expression which includes column references, condition names followed by variable references, possibly grouped and combined with other conditions.
     *
     * For example, `(:col1 starts_with :prefix1 or :col1 starts_with :prefix2) and (:col1 ends_with :suffix1 or :col1 ends_with :suffix2)` . Column and value references are substitution variables that should start with the ':' symbol. Depending on the context, substitution variables' values can be either an actual value or a column name. These values are defined in the SubstitutionMap. If a CheckExpression starts with a column reference, then ColumnSelectors in the rule should be null. If ColumnSelectors has been defined, then there should be no columnn reference in the left side of a condition, for example, `is_between :val1 and :val2` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-rule.html#cfn-databrew-ruleset-rule-checkexpression
     */
    readonly checkExpression: string;

    /**
     * List of column selectors.
     *
     * Selectors can be used to select columns using a name or regular expression from the dataset. Rule will be applied to selected columns.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-rule.html#cfn-databrew-ruleset-rule-columnselectors
     */
    readonly columnSelectors?: Array<CfnRuleset.ColumnSelectorProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A value that specifies whether the rule is disabled.
     *
     * Once a rule is disabled, a profile job will not validate it during a job run. Default value is false.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-rule.html#cfn-databrew-ruleset-rule-disabled
     */
    readonly disabled?: boolean | cdk.IResolvable;

    /**
     * The name of the rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-rule.html#cfn-databrew-ruleset-rule-name
     */
    readonly name: string;

    /**
     * The map of substitution variable names to their values used in a check expression.
     *
     * Variable names should start with a ':' (colon). Variable values can either be actual values or column names. To differentiate between the two, column names should be enclosed in backticks, for example, `":col1": "`Column A`".`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-rule.html#cfn-databrew-ruleset-rule-substitutionmap
     */
    readonly substitutionMap?: Array<cdk.IResolvable | CfnRuleset.SubstitutionValueProperty> | cdk.IResolvable;

    /**
     * The threshold used with a non-aggregate check expression.
     *
     * Non-aggregate check expressions will be applied to each row in a specific column, and the threshold will be used to determine whether the validation succeeds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-rule.html#cfn-databrew-ruleset-rule-threshold
     */
    readonly threshold?: cdk.IResolvable | CfnRuleset.ThresholdProperty;
  }

  /**
   * Selector of a column from a dataset for profile job configuration.
   *
   * One selector includes either a column name or a regular expression.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-columnselector.html
   */
  export interface ColumnSelectorProperty {
    /**
     * The name of a column from a dataset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-columnselector.html#cfn-databrew-ruleset-columnselector-name
     */
    readonly name?: string;

    /**
     * A regular expression for selecting a column from a dataset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-columnselector.html#cfn-databrew-ruleset-columnselector-regex
     */
    readonly regex?: string;
  }

  /**
   * A key-value pair to associate an expression's substitution variable names with their values.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-substitutionvalue.html
   */
  export interface SubstitutionValueProperty {
    /**
     * Value or column name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-substitutionvalue.html#cfn-databrew-ruleset-substitutionvalue-value
     */
    readonly value: string;

    /**
     * Variable name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-substitutionvalue.html#cfn-databrew-ruleset-substitutionvalue-valuereference
     */
    readonly valueReference: string;
  }

  /**
   * The threshold used with a non-aggregate check expression.
   *
   * The non-aggregate check expression will be applied to each row in a specific column. Then the threshold will be used to determine whether the validation succeeds.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-threshold.html
   */
  export interface ThresholdProperty {
    /**
     * The type of a threshold.
     *
     * Used for comparison of an actual count of rows that satisfy the rule to the threshold value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-threshold.html#cfn-databrew-ruleset-threshold-type
     */
    readonly type?: string;

    /**
     * Unit of threshold value.
     *
     * Can be either a COUNT or PERCENTAGE of the full sample size used for validation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-threshold.html#cfn-databrew-ruleset-threshold-unit
     */
    readonly unit?: string;

    /**
     * The value of a threshold.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-databrew-ruleset-threshold.html#cfn-databrew-ruleset-threshold-value
     */
    readonly value: number;
  }
}

/**
 * Properties for defining a `CfnRuleset`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-ruleset.html
 */
export interface CfnRulesetProps {
  /**
   * The description of the ruleset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-ruleset.html#cfn-databrew-ruleset-description
   */
  readonly description?: string;

  /**
   * The name of the ruleset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-ruleset.html#cfn-databrew-ruleset-name
   */
  readonly name: string;

  /**
   * Contains metadata about the ruleset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-ruleset.html#cfn-databrew-ruleset-rules
   */
  readonly rules: Array<cdk.IResolvable | CfnRuleset.RuleProperty> | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-ruleset.html#cfn-databrew-ruleset-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The Amazon Resource Name (ARN) of a resource (dataset) that the ruleset is associated with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-ruleset.html#cfn-databrew-ruleset-targetarn
   */
  readonly targetArn: string;
}

/**
 * Determine whether the given properties match those of a `ColumnSelectorProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnSelectorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRulesetColumnSelectorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("regex", cdk.validateString)(properties.regex));
  return errors.wrap("supplied properties not correct for \"ColumnSelectorProperty\"");
}

// @ts-ignore TS6133
function convertCfnRulesetColumnSelectorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRulesetColumnSelectorPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Regex": cdk.stringToCloudFormation(properties.regex)
  };
}

// @ts-ignore TS6133
function CfnRulesetColumnSelectorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRuleset.ColumnSelectorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleset.ColumnSelectorProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("regex", "Regex", (properties.Regex != null ? cfn_parse.FromCloudFormation.getString(properties.Regex) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SubstitutionValueProperty`
 *
 * @param properties - the TypeScript properties of a `SubstitutionValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRulesetSubstitutionValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  errors.collect(cdk.propertyValidator("valueReference", cdk.requiredValidator)(properties.valueReference));
  errors.collect(cdk.propertyValidator("valueReference", cdk.validateString)(properties.valueReference));
  return errors.wrap("supplied properties not correct for \"SubstitutionValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnRulesetSubstitutionValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRulesetSubstitutionValuePropertyValidator(properties).assertSuccess();
  return {
    "Value": cdk.stringToCloudFormation(properties.value),
    "ValueReference": cdk.stringToCloudFormation(properties.valueReference)
  };
}

// @ts-ignore TS6133
function CfnRulesetSubstitutionValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleset.SubstitutionValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleset.SubstitutionValueProperty>();
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addPropertyResult("valueReference", "ValueReference", (properties.ValueReference != null ? cfn_parse.FromCloudFormation.getString(properties.ValueReference) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ThresholdProperty`
 *
 * @param properties - the TypeScript properties of a `ThresholdProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRulesetThresholdPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("unit", cdk.validateString)(properties.unit));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"ThresholdProperty\"");
}

// @ts-ignore TS6133
function convertCfnRulesetThresholdPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRulesetThresholdPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "Unit": cdk.stringToCloudFormation(properties.unit),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnRulesetThresholdPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleset.ThresholdProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleset.ThresholdProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("unit", "Unit", (properties.Unit != null ? cfn_parse.FromCloudFormation.getString(properties.Unit) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRulesetRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("checkExpression", cdk.requiredValidator)(properties.checkExpression));
  errors.collect(cdk.propertyValidator("checkExpression", cdk.validateString)(properties.checkExpression));
  errors.collect(cdk.propertyValidator("columnSelectors", cdk.listValidator(CfnRulesetColumnSelectorPropertyValidator))(properties.columnSelectors));
  errors.collect(cdk.propertyValidator("disabled", cdk.validateBoolean)(properties.disabled));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("substitutionMap", cdk.listValidator(CfnRulesetSubstitutionValuePropertyValidator))(properties.substitutionMap));
  errors.collect(cdk.propertyValidator("threshold", CfnRulesetThresholdPropertyValidator)(properties.threshold));
  return errors.wrap("supplied properties not correct for \"RuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnRulesetRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRulesetRulePropertyValidator(properties).assertSuccess();
  return {
    "CheckExpression": cdk.stringToCloudFormation(properties.checkExpression),
    "ColumnSelectors": cdk.listMapper(convertCfnRulesetColumnSelectorPropertyToCloudFormation)(properties.columnSelectors),
    "Disabled": cdk.booleanToCloudFormation(properties.disabled),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SubstitutionMap": cdk.listMapper(convertCfnRulesetSubstitutionValuePropertyToCloudFormation)(properties.substitutionMap),
    "Threshold": convertCfnRulesetThresholdPropertyToCloudFormation(properties.threshold)
  };
}

// @ts-ignore TS6133
function CfnRulesetRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRuleset.RuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRuleset.RuleProperty>();
  ret.addPropertyResult("checkExpression", "CheckExpression", (properties.CheckExpression != null ? cfn_parse.FromCloudFormation.getString(properties.CheckExpression) : undefined));
  ret.addPropertyResult("columnSelectors", "ColumnSelectors", (properties.ColumnSelectors != null ? cfn_parse.FromCloudFormation.getArray(CfnRulesetColumnSelectorPropertyFromCloudFormation)(properties.ColumnSelectors) : undefined));
  ret.addPropertyResult("disabled", "Disabled", (properties.Disabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Disabled) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("substitutionMap", "SubstitutionMap", (properties.SubstitutionMap != null ? cfn_parse.FromCloudFormation.getArray(CfnRulesetSubstitutionValuePropertyFromCloudFormation)(properties.SubstitutionMap) : undefined));
  ret.addPropertyResult("threshold", "Threshold", (properties.Threshold != null ? CfnRulesetThresholdPropertyFromCloudFormation(properties.Threshold) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRulesetProps`
 *
 * @param properties - the TypeScript properties of a `CfnRulesetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRulesetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("rules", cdk.requiredValidator)(properties.rules));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnRulesetRulePropertyValidator))(properties.rules));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("targetArn", cdk.requiredValidator)(properties.targetArn));
  errors.collect(cdk.propertyValidator("targetArn", cdk.validateString)(properties.targetArn));
  return errors.wrap("supplied properties not correct for \"CfnRulesetProps\"");
}

// @ts-ignore TS6133
function convertCfnRulesetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRulesetPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Rules": cdk.listMapper(convertCfnRulesetRulePropertyToCloudFormation)(properties.rules),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TargetArn": cdk.stringToCloudFormation(properties.targetArn)
  };
}

// @ts-ignore TS6133
function CfnRulesetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRulesetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRulesetProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnRulesetRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("targetArn", "TargetArn", (properties.TargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a new schedule for one or more AWS Glue DataBrew jobs.
 *
 * Jobs can be run at a specific date and time, or at regular intervals.
 *
 * @cloudformationResource AWS::DataBrew::Schedule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-schedule.html
 */
export class CfnSchedule extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::DataBrew::Schedule";

  /**
   * Build a CfnSchedule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSchedule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSchedulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSchedule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The dates and times when the job is to run.
   */
  public cronExpression: string;

  /**
   * A list of jobs to be run, according to the schedule.
   */
  public jobNames?: Array<string>;

  /**
   * The name of the schedule.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata tags that have been applied to the schedule.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnScheduleProps) {
    super(scope, id, {
      "type": CfnSchedule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "cronExpression", this);
    cdk.requireProperty(props, "name", this);

    this.cronExpression = props.cronExpression;
    this.jobNames = props.jobNames;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::DataBrew::Schedule", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "cronExpression": this.cronExpression,
      "jobNames": this.jobNames,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSchedule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSchedulePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSchedule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-schedule.html
 */
export interface CfnScheduleProps {
  /**
   * The dates and times when the job is to run.
   *
   * For more information, see [Working with cron expressions for recipe jobs](https://docs.aws.amazon.com/databrew/latest/dg/jobs.recipe.html#jobs.cron) in the *AWS Glue DataBrew Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-schedule.html#cfn-databrew-schedule-cronexpression
   */
  readonly cronExpression: string;

  /**
   * A list of jobs to be run, according to the schedule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-schedule.html#cfn-databrew-schedule-jobnames
   */
  readonly jobNames?: Array<string>;

  /**
   * The name of the schedule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-schedule.html#cfn-databrew-schedule-name
   */
  readonly name: string;

  /**
   * Metadata tags that have been applied to the schedule.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-databrew-schedule.html#cfn-databrew-schedule-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnScheduleProps`
 *
 * @param properties - the TypeScript properties of a `CfnScheduleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSchedulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cronExpression", cdk.requiredValidator)(properties.cronExpression));
  errors.collect(cdk.propertyValidator("cronExpression", cdk.validateString)(properties.cronExpression));
  errors.collect(cdk.propertyValidator("jobNames", cdk.listValidator(cdk.validateString))(properties.jobNames));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnScheduleProps\"");
}

// @ts-ignore TS6133
function convertCfnSchedulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSchedulePropsValidator(properties).assertSuccess();
  return {
    "CronExpression": cdk.stringToCloudFormation(properties.cronExpression),
    "JobNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.jobNames),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSchedulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnScheduleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnScheduleProps>();
  ret.addPropertyResult("cronExpression", "CronExpression", (properties.CronExpression != null ? cfn_parse.FromCloudFormation.getString(properties.CronExpression) : undefined));
  ret.addPropertyResult("jobNames", "JobNames", (properties.JobNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.JobNames) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}