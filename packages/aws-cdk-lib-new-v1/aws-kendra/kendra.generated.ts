/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a data source connector that you want to use with an Amazon Kendra index.
 *
 * You specify a name, data source connector type and description for your data source. You also specify configuration information for the data source connector.
 *
 * > `CreateDataSource` does *not* support connectors which [require a `TemplateConfiguration` object](https://docs.aws.amazon.com/kendra/latest/dg/ds-schemas.html) for connecting to Amazon Kendra .
 *
 * @cloudformationResource AWS::Kendra::DataSource
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-datasource.html
 */
export class CfnDataSource extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Kendra::DataSource";

  /**
   * Build a CfnDataSource from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataSource {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDataSourcePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDataSource(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the data source. For example:
   *
   * `arn:aws:kendra:us-west-2:111122223333:index/335c3741-41df-46a6-b5d3-61f85b787884/data-source/b8cae438-6787-4091-8897-684a652bbb0a`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The identifier for the data source. For example:
   *
   * `b8cae438-6787-4091-8897-684a652bbb0a` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Configuration information for altering document metadata and content during the document ingestion process.
   */
  public customDocumentEnrichmentConfiguration?: CfnDataSource.CustomDocumentEnrichmentConfigurationProperty | cdk.IResolvable;

  /**
   * Configuration information for an Amazon Kendra data source.
   */
  public dataSourceConfiguration?: CfnDataSource.DataSourceConfigurationProperty | cdk.IResolvable;

  /**
   * A description for the data source connector.
   */
  public description?: string;

  /**
   * The identifier of the index you want to use with the data source connector.
   */
  public indexId: string;

  /**
   * The code for a language.
   */
  public languageCode?: string;

  /**
   * The name of the data source.
   */
  public name: string;

  /**
   * The Amazon Resource Name (ARN) of a role with permission to access the data source.
   */
  public roleArn?: string;

  /**
   * Sets the frequency that Amazon Kendra checks the documents in your data source and updates the index.
   */
  public schedule?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The type of the data source.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDataSourceProps) {
    super(scope, id, {
      "type": CfnDataSource.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "indexId", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "type", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.customDocumentEnrichmentConfiguration = props.customDocumentEnrichmentConfiguration;
    this.dataSourceConfiguration = props.dataSourceConfiguration;
    this.description = props.description;
    this.indexId = props.indexId;
    this.languageCode = props.languageCode;
    this.name = props.name;
    this.roleArn = props.roleArn;
    this.schedule = props.schedule;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Kendra::DataSource", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "customDocumentEnrichmentConfiguration": this.customDocumentEnrichmentConfiguration,
      "dataSourceConfiguration": this.dataSourceConfiguration,
      "description": this.description,
      "indexId": this.indexId,
      "languageCode": this.languageCode,
      "name": this.name,
      "roleArn": this.roleArn,
      "schedule": this.schedule,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataSource.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDataSourcePropsToCloudFormation(props);
  }
}

export namespace CfnDataSource {
  /**
   * Provides the configuration information for altering document metadata and content during the document ingestion process.
   *
   * For more information, see [Customizing document metadata during the ingestion process](https://docs.aws.amazon.com/kendra/latest/dg/custom-document-enrichment.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-customdocumentenrichmentconfiguration.html
   */
  export interface CustomDocumentEnrichmentConfigurationProperty {
    /**
     * Configuration information to alter document attributes or metadata fields and content when ingesting documents into Amazon Kendra.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-customdocumentenrichmentconfiguration.html#cfn-kendra-datasource-customdocumentenrichmentconfiguration-inlineconfigurations
     */
    readonly inlineConfigurations?: Array<CfnDataSource.InlineCustomDocumentEnrichmentConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Configuration information for invoking a Lambda function in AWS Lambda on the structured documents with their metadata and text extracted.
     *
     * You can use a Lambda function to apply advanced logic for creating, modifying, or deleting document metadata and content. For more information, see [Advanced data manipulation](https://docs.aws.amazon.com/kendra/latest/dg/custom-document-enrichment.html#advanced-data-manipulation) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-customdocumentenrichmentconfiguration.html#cfn-kendra-datasource-customdocumentenrichmentconfiguration-postextractionhookconfiguration
     */
    readonly postExtractionHookConfiguration?: CfnDataSource.HookConfigurationProperty | cdk.IResolvable;

    /**
     * Configuration information for invoking a Lambda function in AWS Lambda on the original or raw documents before extracting their metadata and text.
     *
     * You can use a Lambda function to apply advanced logic for creating, modifying, or deleting document metadata and content. For more information, see [Advanced data manipulation](https://docs.aws.amazon.com/kendra/latest/dg/custom-document-enrichment.html#advanced-data-manipulation) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-customdocumentenrichmentconfiguration.html#cfn-kendra-datasource-customdocumentenrichmentconfiguration-preextractionhookconfiguration
     */
    readonly preExtractionHookConfiguration?: CfnDataSource.HookConfigurationProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of a role with permission to run `PreExtractionHookConfiguration` and `PostExtractionHookConfiguration` for altering document metadata and content during the document ingestion process.
     *
     * For more information, see [IAM roles for Amazon Kendra](https://docs.aws.amazon.com/kendra/latest/dg/iam-roles.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-customdocumentenrichmentconfiguration.html#cfn-kendra-datasource-customdocumentenrichmentconfiguration-rolearn
     */
    readonly roleArn?: string;
  }

  /**
   * Provides the configuration information for applying basic logic to alter document metadata and content when ingesting documents into Amazon Kendra.
   *
   * To apply advanced logic, to go beyond what you can do with basic logic, see [HookConfiguration](https://docs.aws.amazon.com/kendra/latest/dg/API_HookConfiguration.html) .
   *
   * For more information, see [Customizing document metadata during the ingestion process](https://docs.aws.amazon.com/kendra/latest/dg/custom-document-enrichment.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-inlinecustomdocumentenrichmentconfiguration.html
   */
  export interface InlineCustomDocumentEnrichmentConfigurationProperty {
    /**
     * Configuration of the condition used for the target document attribute or metadata field when ingesting documents into Amazon Kendra.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-inlinecustomdocumentenrichmentconfiguration.html#cfn-kendra-datasource-inlinecustomdocumentenrichmentconfiguration-condition
     */
    readonly condition?: CfnDataSource.DocumentAttributeConditionProperty | cdk.IResolvable;

    /**
     * `TRUE` to delete content if the condition used for the target attribute is met.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-inlinecustomdocumentenrichmentconfiguration.html#cfn-kendra-datasource-inlinecustomdocumentenrichmentconfiguration-documentcontentdeletion
     */
    readonly documentContentDeletion?: boolean | cdk.IResolvable;

    /**
     * Configuration of the target document attribute or metadata field when ingesting documents into Amazon Kendra.
     *
     * You can also include a value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-inlinecustomdocumentenrichmentconfiguration.html#cfn-kendra-datasource-inlinecustomdocumentenrichmentconfiguration-target
     */
    readonly target?: CfnDataSource.DocumentAttributeTargetProperty | cdk.IResolvable;
  }

  /**
   * The condition used for the target document attribute or metadata field when ingesting documents into Amazon Kendra.
   *
   * You use this with [DocumentAttributeTarget to apply the condition](https://docs.aws.amazon.com/kendra/latest/dg/API_DocumentAttributeTarget.html) .
   *
   * For example, you can create the 'Department' target field and have it prefill department names associated with the documents based on information in the 'Source_URI' field. Set the condition that if the 'Source_URI' field contains 'financial' in its URI value, then prefill the target field 'Department' with the target value 'Finance' for the document.
   *
   * Amazon Kendra cannot create a target field if it has not already been created as an index field. After you create your index field, you can create a document metadata field using `DocumentAttributeTarget` . Amazon Kendra then will map your newly created metadata field to your index field.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentattributecondition.html
   */
  export interface DocumentAttributeConditionProperty {
    /**
     * The identifier of the document attribute used for the condition.
     *
     * For example, 'Source_URI' could be an identifier for the attribute or metadata field that contains source URIs associated with the documents.
     *
     * Amazon Kendra currently does not support `_document_body` as an attribute key used for the condition.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentattributecondition.html#cfn-kendra-datasource-documentattributecondition-conditiondocumentattributekey
     */
    readonly conditionDocumentAttributeKey: string;

    /**
     * The value used by the operator.
     *
     * For example, you can specify the value 'financial' for strings in the 'Source_URI' field that partially match or contain this value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentattributecondition.html#cfn-kendra-datasource-documentattributecondition-conditiononvalue
     */
    readonly conditionOnValue?: CfnDataSource.DocumentAttributeValueProperty | cdk.IResolvable;

    /**
     * The condition operator.
     *
     * For example, you can use 'Contains' to partially match a string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentattributecondition.html#cfn-kendra-datasource-documentattributecondition-operator
     */
    readonly operator: string;
  }

  /**
   * The value of a document attribute.
   *
   * You can only provide one value for a document attribute.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentattributevalue.html
   */
  export interface DocumentAttributeValueProperty {
    /**
     * A date expressed as an ISO 8601 string.
     *
     * It is important for the time zone to be included in the ISO 8601 date-time format. For example, 2012-03-25T12:30:10+01:00 is the ISO 8601 date-time format for March 25th 2012 at 12:30PM (plus 10 seconds) in Central European Time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentattributevalue.html#cfn-kendra-datasource-documentattributevalue-datevalue
     */
    readonly dateValue?: string;

    /**
     * A long integer value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentattributevalue.html#cfn-kendra-datasource-documentattributevalue-longvalue
     */
    readonly longValue?: number;

    /**
     * A list of strings.
     *
     * The default maximum length or number of strings is 10.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentattributevalue.html#cfn-kendra-datasource-documentattributevalue-stringlistvalue
     */
    readonly stringListValue?: Array<string>;

    /**
     * A string, such as "department".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentattributevalue.html#cfn-kendra-datasource-documentattributevalue-stringvalue
     */
    readonly stringValue?: string;
  }

  /**
   * The target document attribute or metadata field you want to alter when ingesting documents into Amazon Kendra.
   *
   * For example, you can delete customer identification numbers associated with the documents, stored in the document metadata field called 'Customer_ID'. You set the target key as 'Customer_ID' and the deletion flag to `TRUE` . This removes all customer ID values in the field 'Customer_ID'. This would scrub personally identifiable information from each document's metadata.
   *
   * Amazon Kendra cannot create a target field if it has not already been created as an index field. After you create your index field, you can create a document metadata field using `DocumentAttributeTarget` . Amazon Kendra then will map your newly created metadata field to your index field.
   *
   * You can also use this with [DocumentAttributeCondition](https://docs.aws.amazon.com/kendra/latest/dg/API_DocumentAttributeCondition.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentattributetarget.html
   */
  export interface DocumentAttributeTargetProperty {
    /**
     * The identifier of the target document attribute or metadata field.
     *
     * For example, 'Department' could be an identifier for the target attribute or metadata field that includes the department names associated with the documents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentattributetarget.html#cfn-kendra-datasource-documentattributetarget-targetdocumentattributekey
     */
    readonly targetDocumentAttributeKey: string;

    /**
     * The target value you want to create for the target attribute.
     *
     * For example, 'Finance' could be the target value for the target attribute key 'Department'.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentattributetarget.html#cfn-kendra-datasource-documentattributetarget-targetdocumentattributevalue
     */
    readonly targetDocumentAttributeValue?: CfnDataSource.DocumentAttributeValueProperty | cdk.IResolvable;

    /**
     * `TRUE` to delete the existing target value for your specified target attribute key.
     *
     * You cannot create a target value and set this to `TRUE` . To create a target value ( `TargetDocumentAttributeValue` ), set this to `FALSE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentattributetarget.html#cfn-kendra-datasource-documentattributetarget-targetdocumentattributevaluedeletion
     */
    readonly targetDocumentAttributeValueDeletion?: boolean | cdk.IResolvable;
  }

  /**
   * Provides the configuration information for invoking a Lambda function in AWS Lambda to alter document metadata and content when ingesting documents into Amazon Kendra.
   *
   * You can configure your Lambda function using [PreExtractionHookConfiguration](https://docs.aws.amazon.com/kendra/latest/dg/API_CustomDocumentEnrichmentConfiguration.html) if you want to apply advanced alterations on the original or raw documents. If you want to apply advanced alterations on the Amazon Kendra structured documents, you must configure your Lambda function using [PostExtractionHookConfiguration](https://docs.aws.amazon.com/kendra/latest/dg/API_CustomDocumentEnrichmentConfiguration.html) . You can only invoke one Lambda function. However, this function can invoke other functions it requires.
   *
   * For more information, see [Customizing document metadata during the ingestion process](https://docs.aws.amazon.com/kendra/latest/dg/custom-document-enrichment.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-hookconfiguration.html
   */
  export interface HookConfigurationProperty {
    /**
     * The condition used for when a Lambda function should be invoked.
     *
     * For example, you can specify a condition that if there are empty date-time values, then Amazon Kendra should invoke a function that inserts the current date-time.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-hookconfiguration.html#cfn-kendra-datasource-hookconfiguration-invocationcondition
     */
    readonly invocationCondition?: CfnDataSource.DocumentAttributeConditionProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of a role with permission to run a Lambda function during ingestion.
     *
     * For more information, see [IAM roles for Amazon Kendra](https://docs.aws.amazon.com/kendra/latest/dg/iam-roles.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-hookconfiguration.html#cfn-kendra-datasource-hookconfiguration-lambdaarn
     */
    readonly lambdaArn: string;

    /**
     * Stores the original, raw documents or the structured, parsed documents before and after altering them.
     *
     * For more information, see [Data contracts for Lambda functions](https://docs.aws.amazon.com/kendra/latest/dg/custom-document-enrichment.html#cde-data-contracts-lambda) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-hookconfiguration.html#cfn-kendra-datasource-hookconfiguration-s3bucket
     */
    readonly s3Bucket: string;
  }

  /**
   * Provides the configuration information for an Amazon Kendra data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourceconfiguration.html
   */
  export interface DataSourceConfigurationProperty {
    /**
     * Provides the configuration information to connect to Confluence as your data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourceconfiguration.html#cfn-kendra-datasource-datasourceconfiguration-confluenceconfiguration
     */
    readonly confluenceConfiguration?: CfnDataSource.ConfluenceConfigurationProperty | cdk.IResolvable;

    /**
     * Provides the configuration information to connect to a database as your data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourceconfiguration.html#cfn-kendra-datasource-datasourceconfiguration-databaseconfiguration
     */
    readonly databaseConfiguration?: CfnDataSource.DatabaseConfigurationProperty | cdk.IResolvable;

    /**
     * Provides the configuration information to connect to Google Drive as your data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourceconfiguration.html#cfn-kendra-datasource-datasourceconfiguration-googledriveconfiguration
     */
    readonly googleDriveConfiguration?: CfnDataSource.GoogleDriveConfigurationProperty | cdk.IResolvable;

    /**
     * Provides the configuration information to connect to Microsoft OneDrive as your data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourceconfiguration.html#cfn-kendra-datasource-datasourceconfiguration-onedriveconfiguration
     */
    readonly oneDriveConfiguration?: cdk.IResolvable | CfnDataSource.OneDriveConfigurationProperty;

    /**
     * Provides the configuration information to connect to an Amazon S3 bucket as your data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourceconfiguration.html#cfn-kendra-datasource-datasourceconfiguration-s3configuration
     */
    readonly s3Configuration?: cdk.IResolvable | CfnDataSource.S3DataSourceConfigurationProperty;

    /**
     * Provides the configuration information to connect to Salesforce as your data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourceconfiguration.html#cfn-kendra-datasource-datasourceconfiguration-salesforceconfiguration
     */
    readonly salesforceConfiguration?: cdk.IResolvable | CfnDataSource.SalesforceConfigurationProperty;

    /**
     * Provides the configuration information to connect to ServiceNow as your data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourceconfiguration.html#cfn-kendra-datasource-datasourceconfiguration-servicenowconfiguration
     */
    readonly serviceNowConfiguration?: cdk.IResolvable | CfnDataSource.ServiceNowConfigurationProperty;

    /**
     * Provides the configuration information to connect to Microsoft SharePoint as your data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourceconfiguration.html#cfn-kendra-datasource-datasourceconfiguration-sharepointconfiguration
     */
    readonly sharePointConfiguration?: cdk.IResolvable | CfnDataSource.SharePointConfigurationProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourceconfiguration.html#cfn-kendra-datasource-datasourceconfiguration-templateconfiguration
     */
    readonly templateConfiguration?: cdk.IResolvable | CfnDataSource.TemplateConfigurationProperty;

    /**
     * Provides the configuration information required for Amazon Kendra Web Crawler.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourceconfiguration.html#cfn-kendra-datasource-datasourceconfiguration-webcrawlerconfiguration
     */
    readonly webCrawlerConfiguration?: cdk.IResolvable | CfnDataSource.WebCrawlerConfigurationProperty;

    /**
     * Provides the configuration information to connect to Amazon WorkDocs as your data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourceconfiguration.html#cfn-kendra-datasource-datasourceconfiguration-workdocsconfiguration
     */
    readonly workDocsConfiguration?: cdk.IResolvable | CfnDataSource.WorkDocsConfigurationProperty;
  }

  /**
   * Provides the configuration information to connect to Google Drive as your data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-googledriveconfiguration.html
   */
  export interface GoogleDriveConfigurationProperty {
    /**
     * A list of MIME types to exclude from the index. All documents matching the specified MIME type are excluded.
     *
     * For a list of MIME types, see [Using a Google Workspace Drive data source](https://docs.aws.amazon.com/kendra/latest/dg/data-source-google-drive.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-googledriveconfiguration.html#cfn-kendra-datasource-googledriveconfiguration-excludemimetypes
     */
    readonly excludeMimeTypes?: Array<string>;

    /**
     * A list of identifiers or shared drives to exclude from the index.
     *
     * All files and folders stored on the shared drive are excluded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-googledriveconfiguration.html#cfn-kendra-datasource-googledriveconfiguration-excludeshareddrives
     */
    readonly excludeSharedDrives?: Array<string>;

    /**
     * A list of email addresses of the users.
     *
     * Documents owned by these users are excluded from the index. Documents shared with excluded users are indexed unless they are excluded in another way.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-googledriveconfiguration.html#cfn-kendra-datasource-googledriveconfiguration-excludeuseraccounts
     */
    readonly excludeUserAccounts?: Array<string>;

    /**
     * A list of regular expression patterns to exclude certain items in your Google Drive, including shared drives and users' My Drives.
     *
     * Items that match the patterns are excluded from the index. Items that don't match the patterns are included in the index. If an item matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the item isn't included in the index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-googledriveconfiguration.html#cfn-kendra-datasource-googledriveconfiguration-exclusionpatterns
     */
    readonly exclusionPatterns?: Array<string>;

    /**
     * Maps Google Drive data source attributes or field names to Amazon Kendra index field names.
     *
     * To create custom fields, use the `UpdateIndex` API before you map to Google Drive fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The Google Drive data source field names must exist in your Google Drive custom metadata.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-googledriveconfiguration.html#cfn-kendra-datasource-googledriveconfiguration-fieldmappings
     */
    readonly fieldMappings?: Array<CfnDataSource.DataSourceToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of regular expression patterns to include certain items in your Google Drive, including shared drives and users' My Drives.
     *
     * Items that match the patterns are included in the index. Items that don't match the patterns are excluded from the index. If an item matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the item isn't included in the index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-googledriveconfiguration.html#cfn-kendra-datasource-googledriveconfiguration-inclusionpatterns
     */
    readonly inclusionPatterns?: Array<string>;

    /**
     * The Amazon Resource Name (ARN) of a AWS Secrets Manager secret that contains the credentials required to connect to Google Drive.
     *
     * For more information, see [Using a Google Workspace Drive data source](https://docs.aws.amazon.com/kendra/latest/dg/data-source-google-drive.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-googledriveconfiguration.html#cfn-kendra-datasource-googledriveconfiguration-secretarn
     */
    readonly secretArn: string;
  }

  /**
   * Maps a column or attribute in the data source to an index field.
   *
   * You must first create the fields in the index using the [UpdateIndex](https://docs.aws.amazon.com/kendra/latest/dg/API_UpdateIndex.html) operation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourcetoindexfieldmapping.html
   */
  export interface DataSourceToIndexFieldMappingProperty {
    /**
     * The name of the field in the data source.
     *
     * You must first create the index field using the `UpdateIndex` API.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourcetoindexfieldmapping.html#cfn-kendra-datasource-datasourcetoindexfieldmapping-datasourcefieldname
     */
    readonly dataSourceFieldName: string;

    /**
     * The format for date fields in the data source.
     *
     * If the field specified in `DataSourceFieldName` is a date field, you must specify the date format. If the field is not a date field, an exception is thrown.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourcetoindexfieldmapping.html#cfn-kendra-datasource-datasourcetoindexfieldmapping-datefieldformat
     */
    readonly dateFieldFormat?: string;

    /**
     * The name of the index field to map to the data source field.
     *
     * The index field type must match the data source field type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourcetoindexfieldmapping.html#cfn-kendra-datasource-datasourcetoindexfieldmapping-indexfieldname
     */
    readonly indexFieldName: string;
  }

  /**
   * Provides the configuration information required for Amazon Kendra Web Crawler.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerconfiguration.html
   */
  export interface WebCrawlerConfigurationProperty {
    /**
     * Configuration information required to connect to websites using authentication.
     *
     * You can connect to websites using basic authentication of user name and password. You use a secret in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) to store your authentication credentials.
     *
     * You must provide the website host name and port number. For example, the host name of https://a.example.com/page1.html is "a.example.com" and the port is 443, the standard port for HTTPS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerconfiguration.html#cfn-kendra-datasource-webcrawlerconfiguration-authenticationconfiguration
     */
    readonly authenticationConfiguration?: cdk.IResolvable | CfnDataSource.WebCrawlerAuthenticationConfigurationProperty;

    /**
     * The 'depth' or number of levels from the seed level to crawl.
     *
     * For example, the seed URL page is depth 1 and any hyperlinks on this page that are also crawled are depth 2.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerconfiguration.html#cfn-kendra-datasource-webcrawlerconfiguration-crawldepth
     */
    readonly crawlDepth?: number;

    /**
     * The maximum size (in MB) of a web page or attachment to crawl.
     *
     * Files larger than this size (in MB) are skipped/not crawled.
     *
     * The default maximum size of a web page or attachment is set to 50 MB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerconfiguration.html#cfn-kendra-datasource-webcrawlerconfiguration-maxcontentsizeperpageinmegabytes
     */
    readonly maxContentSizePerPageInMegaBytes?: number;

    /**
     * The maximum number of URLs on a web page to include when crawling a website.
     *
     * This number is per web page.
     *
     * As a website’s web pages are crawled, any URLs the web pages link to are also crawled. URLs on a web page are crawled in order of appearance.
     *
     * The default maximum links per page is 100.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerconfiguration.html#cfn-kendra-datasource-webcrawlerconfiguration-maxlinksperpage
     */
    readonly maxLinksPerPage?: number;

    /**
     * The maximum number of URLs crawled per website host per minute.
     *
     * A minimum of one URL is required.
     *
     * The default maximum number of URLs crawled per website host per minute is 300.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerconfiguration.html#cfn-kendra-datasource-webcrawlerconfiguration-maxurlsperminutecrawlrate
     */
    readonly maxUrlsPerMinuteCrawlRate?: number;

    /**
     * Configuration information required to connect to your internal websites via a web proxy.
     *
     * You must provide the website host name and port number. For example, the host name of https://a.example.com/page1.html is "a.example.com" and the port is 443, the standard port for HTTPS.
     *
     * Web proxy credentials are optional and you can use them to connect to a web proxy server that requires basic authentication. To store web proxy credentials, you use a secret in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerconfiguration.html#cfn-kendra-datasource-webcrawlerconfiguration-proxyconfiguration
     */
    readonly proxyConfiguration?: cdk.IResolvable | CfnDataSource.ProxyConfigurationProperty;

    /**
     * A list of regular expression patterns to exclude certain URLs to crawl.
     *
     * URLs that match the patterns are excluded from the index. URLs that don't match the patterns are included in the index. If a URL matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the URL file isn't included in the index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerconfiguration.html#cfn-kendra-datasource-webcrawlerconfiguration-urlexclusionpatterns
     */
    readonly urlExclusionPatterns?: Array<string>;

    /**
     * A list of regular expression patterns to include certain URLs to crawl.
     *
     * URLs that match the patterns are included in the index. URLs that don't match the patterns are excluded from the index. If a URL matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the URL file isn't included in the index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerconfiguration.html#cfn-kendra-datasource-webcrawlerconfiguration-urlinclusionpatterns
     */
    readonly urlInclusionPatterns?: Array<string>;

    /**
     * Specifies the seed or starting point URLs of the websites or the sitemap URLs of the websites you want to crawl.
     *
     * You can include website subdomains. You can list up to 100 seed URLs and up to three sitemap URLs.
     *
     * You can only crawl websites that use the secure communication protocol, Hypertext Transfer Protocol Secure (HTTPS). If you receive an error when crawling a website, it could be that the website is blocked from crawling.
     *
     * *When selecting websites to index, you must adhere to the [Amazon Acceptable Use Policy](https://docs.aws.amazon.com/aup/) and all other Amazon terms. Remember that you must only use Amazon Kendra Web Crawler to index your own webpages, or webpages that you have authorization to index.*
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerconfiguration.html#cfn-kendra-datasource-webcrawlerconfiguration-urls
     */
    readonly urls: cdk.IResolvable | CfnDataSource.WebCrawlerUrlsProperty;
  }

  /**
   * Provides the configuration information to connect to websites that require user authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerauthenticationconfiguration.html
   */
  export interface WebCrawlerAuthenticationConfigurationProperty {
    /**
     * The list of configuration information that's required to connect to and crawl a website host using basic authentication credentials.
     *
     * The list includes the name and port number of the website host.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerauthenticationconfiguration.html#cfn-kendra-datasource-webcrawlerauthenticationconfiguration-basicauthentication
     */
    readonly basicAuthentication?: Array<cdk.IResolvable | CfnDataSource.WebCrawlerBasicAuthenticationProperty> | cdk.IResolvable;
  }

  /**
   * Provides the configuration information to connect to websites that require basic user authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerbasicauthentication.html
   */
  export interface WebCrawlerBasicAuthenticationProperty {
    /**
     * Your secret ARN, which you can create in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html).
     *
     * You use a secret if basic authentication credentials are required to connect to a website. The secret stores your credentials of user name and password.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerbasicauthentication.html#cfn-kendra-datasource-webcrawlerbasicauthentication-credentials
     */
    readonly credentials: string;

    /**
     * The name of the website host you want to connect to using authentication credentials.
     *
     * For example, the host name of https://a.example.com/page1.html is "a.example.com".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerbasicauthentication.html#cfn-kendra-datasource-webcrawlerbasicauthentication-host
     */
    readonly host: string;

    /**
     * The port number of the website host you want to connect to using authentication credentials.
     *
     * For example, the port for https://a.example.com/page1.html is 443, the standard port for HTTPS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerbasicauthentication.html#cfn-kendra-datasource-webcrawlerbasicauthentication-port
     */
    readonly port: number;
  }

  /**
   * Provides the configuration information for a web proxy to connect to website hosts.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-proxyconfiguration.html
   */
  export interface ProxyConfigurationProperty {
    /**
     * Your secret ARN, which you can create in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html).
     *
     * The credentials are optional. You use a secret if web proxy credentials are required to connect to a website host. Amazon Kendra currently support basic authentication to connect to a web proxy server. The secret stores your credentials.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-proxyconfiguration.html#cfn-kendra-datasource-proxyconfiguration-credentials
     */
    readonly credentials?: string;

    /**
     * The name of the website host you want to connect to via a web proxy server.
     *
     * For example, the host name of https://a.example.com/page1.html is "a.example.com".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-proxyconfiguration.html#cfn-kendra-datasource-proxyconfiguration-host
     */
    readonly host: string;

    /**
     * The port number of the website host you want to connect to via a web proxy server.
     *
     * For example, the port for https://a.example.com/page1.html is 443, the standard port for HTTPS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-proxyconfiguration.html#cfn-kendra-datasource-proxyconfiguration-port
     */
    readonly port: number;
  }

  /**
   * Specifies the seed or starting point URLs of the websites or the sitemap URLs of the websites you want to crawl.
   *
   * You can include website subdomains. You can list up to 100 seed URLs and up to three sitemap URLs.
   *
   * You can only crawl websites that use the secure communication protocol, Hypertext Transfer Protocol Secure (HTTPS). If you receive an error when crawling a website, it could be that the website is blocked from crawling.
   *
   * *When selecting websites to index, you must adhere to the [Amazon Acceptable Use Policy](https://docs.aws.amazon.com/aup/) and all other Amazon terms. Remember that you must only use the Amazon Kendra web crawler to index your own webpages, or webpages that you have authorization to index.*
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerurls.html
   */
  export interface WebCrawlerUrlsProperty {
    /**
     * Configuration of the seed or starting point URLs of the websites you want to crawl.
     *
     * You can choose to crawl only the website host names, or the website host names with subdomains, or the website host names with subdomains and other domains that the web pages link to.
     *
     * You can list up to 100 seed URLs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerurls.html#cfn-kendra-datasource-webcrawlerurls-seedurlconfiguration
     */
    readonly seedUrlConfiguration?: cdk.IResolvable | CfnDataSource.WebCrawlerSeedUrlConfigurationProperty;

    /**
     * Configuration of the sitemap URLs of the websites you want to crawl.
     *
     * Only URLs belonging to the same website host names are crawled. You can list up to three sitemap URLs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerurls.html#cfn-kendra-datasource-webcrawlerurls-sitemapsconfiguration
     */
    readonly siteMapsConfiguration?: cdk.IResolvable | CfnDataSource.WebCrawlerSiteMapsConfigurationProperty;
  }

  /**
   * Provides the configuration information of the sitemap URLs to crawl.
   *
   * *When selecting websites to index, you must adhere to the [Amazon Acceptable Use Policy](https://docs.aws.amazon.com/aup/) and all other Amazon terms. Remember that you must only use the Amazon Kendra web crawler to index your own webpages, or webpages that you have authorization to index.*
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlersitemapsconfiguration.html
   */
  export interface WebCrawlerSiteMapsConfigurationProperty {
    /**
     * The list of sitemap URLs of the websites you want to crawl.
     *
     * The list can include a maximum of three sitemap URLs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlersitemapsconfiguration.html#cfn-kendra-datasource-webcrawlersitemapsconfiguration-sitemaps
     */
    readonly siteMaps: Array<string>;
  }

  /**
   * Provides the configuration information of the seed or starting point URLs to crawl.
   *
   * *When selecting websites to index, you must adhere to the [Amazon Acceptable Use Policy](https://docs.aws.amazon.com/aup/) and all other Amazon terms. Remember that you must only use the Amazon Kendra web crawler to index your own webpages, or webpages that you have authorization to index.*
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerseedurlconfiguration.html
   */
  export interface WebCrawlerSeedUrlConfigurationProperty {
    /**
     * The list of seed or starting point URLs of the websites you want to crawl.
     *
     * The list can include a maximum of 100 seed URLs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerseedurlconfiguration.html#cfn-kendra-datasource-webcrawlerseedurlconfiguration-seedurls
     */
    readonly seedUrls: Array<string>;

    /**
     * You can choose one of the following modes:.
     *
     * - `HOST_ONLY` —crawl only the website host names. For example, if the seed URL is "abc.example.com", then only URLs with host name "abc.example.com" are crawled.
     * - `SUBDOMAINS` —crawl the website host names with subdomains. For example, if the seed URL is "abc.example.com", then "a.abc.example.com" and "b.abc.example.com" are also crawled.
     * - `EVERYTHING` —crawl the website host names with subdomains and other domains that the web pages link to.
     *
     * The default mode is set to `HOST_ONLY` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-webcrawlerseedurlconfiguration.html#cfn-kendra-datasource-webcrawlerseedurlconfiguration-webcrawlermode
     */
    readonly webCrawlerMode?: string;
  }

  /**
   * Provides the configuration information to connect to an Amazon S3 bucket.
   *
   * > `S3DataSourceConfiguration` is deprecated. Amazon VPC is not supported if you configure your Amazon S3 connector with this method. Use [TemplateConfiguration](https://docs.aws.amazon.com/kendra/latest/APIReference/API_TemplateConfiguration.html) to configure your Amazon S3 connector instead. See [Amazon S3 template schema](https://docs.aws.amazon.com/kendra/latest/dg/ds-schemas.html#ds-s3-schema) for more details.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-s3datasourceconfiguration.html
   */
  export interface S3DataSourceConfigurationProperty {
    /**
     * Provides the path to the S3 bucket that contains the user context filtering files for the data source.
     *
     * For the format of the file, see [Access control for S3 data sources](https://docs.aws.amazon.com/kendra/latest/dg/s3-acl.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-s3datasourceconfiguration.html#cfn-kendra-datasource-s3datasourceconfiguration-accesscontrollistconfiguration
     */
    readonly accessControlListConfiguration?: CfnDataSource.AccessControlListConfigurationProperty | cdk.IResolvable;

    /**
     * The name of the bucket that contains the documents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-s3datasourceconfiguration.html#cfn-kendra-datasource-s3datasourceconfiguration-bucketname
     */
    readonly bucketName: string;

    /**
     * Specifies document metadata files that contain information such as the document access control information, source URI, document author, and custom attributes.
     *
     * Each metadata file contains metadata about a single document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-s3datasourceconfiguration.html#cfn-kendra-datasource-s3datasourceconfiguration-documentsmetadataconfiguration
     */
    readonly documentsMetadataConfiguration?: CfnDataSource.DocumentsMetadataConfigurationProperty | cdk.IResolvable;

    /**
     * A list of glob patterns (patterns that can expand a wildcard pattern into a list of path names that match the given pattern) for file names and file types that should not be indexed.
     *
     * If a document that matches an inclusion prefix or inclusion pattern also matches an exclusion pattern, the document is not indexed. Examples of glob patterns include:
     *
     * - `/myapp/config/*` - All files inside config directory
     * - `/** /*.png` - All .png files in all directories
     * - `/** /*.{png,ico,md}` - All .png, .ico or .md files in all directories
     * - `/myapp/src/** /*.ts` - All .ts files inside src directory (and all its subdirectories)
     * - `** /!(*.module).ts` - All .ts files but not .module.ts
     * - **.png , *.jpg* will exclude all PNG and JPEG image files in a directory (files with the extensions .png and .jpg).
     * - **internal** will exclude all files in a directory that contain 'internal' in the file name, such as 'internal', 'internal_only', 'company_internal'.
     * - *** /*internal** will exclude all internal-related files in a directory and its subdirectories.
     *
     * For more examples, see [Use of Exclude and Include Filters](https://docs.aws.amazon.com/cli/latest/reference/s3/#use-of-exclude-and-include-filters) in the AWS CLI Command Reference.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-s3datasourceconfiguration.html#cfn-kendra-datasource-s3datasourceconfiguration-exclusionpatterns
     */
    readonly exclusionPatterns?: Array<string>;

    /**
     * A list of glob patterns for documents that should be indexed.
     *
     * If a document that matches an inclusion pattern also matches an exclusion pattern, the document is not indexed.
     *
     * Some [examples](https://docs.aws.amazon.com/cli/latest/reference/s3/#use-of-exclude-and-include-filters) are:
     *
     * - **.txt* will include all text files in a directory (files with the extension .txt).
     * - *** /*.txt* will include all text files in a directory and its subdirectories.
     * - **tax** will include all files in a directory that contain 'tax' in the file name, such as 'tax', 'taxes', 'income_tax'.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-s3datasourceconfiguration.html#cfn-kendra-datasource-s3datasourceconfiguration-inclusionpatterns
     */
    readonly inclusionPatterns?: Array<string>;

    /**
     * A list of S3 prefixes for the documents that should be included in the index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-s3datasourceconfiguration.html#cfn-kendra-datasource-s3datasourceconfiguration-inclusionprefixes
     */
    readonly inclusionPrefixes?: Array<string>;
  }

  /**
   * Specifies access control list files for the documents in a data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-accesscontrollistconfiguration.html
   */
  export interface AccessControlListConfigurationProperty {
    /**
     * Path to the AWS S3 bucket that contains the access control list files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-accesscontrollistconfiguration.html#cfn-kendra-datasource-accesscontrollistconfiguration-keypath
     */
    readonly keyPath?: string;
  }

  /**
   * Document metadata files that contain information such as the document access control information, source URI, document author, and custom attributes.
   *
   * Each metadata file contains metadata about a single document.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentsmetadataconfiguration.html
   */
  export interface DocumentsMetadataConfigurationProperty {
    /**
     * A prefix used to filter metadata configuration files in the AWS S3 bucket.
     *
     * The S3 bucket might contain multiple metadata files. Use `S3Prefix` to include only the desired metadata files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-documentsmetadataconfiguration.html#cfn-kendra-datasource-documentsmetadataconfiguration-s3prefix
     */
    readonly s3Prefix?: string;
  }

  /**
   * Provides the configuration information to connect to Salesforce as your data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforceconfiguration.html
   */
  export interface SalesforceConfigurationProperty {
    /**
     * Configuration information for Salesforce chatter feeds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforceconfiguration.html#cfn-kendra-datasource-salesforceconfiguration-chatterfeedconfiguration
     */
    readonly chatterFeedConfiguration?: cdk.IResolvable | CfnDataSource.SalesforceChatterFeedConfigurationProperty;

    /**
     * Indicates whether Amazon Kendra should index attachments to Salesforce objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforceconfiguration.html#cfn-kendra-datasource-salesforceconfiguration-crawlattachments
     */
    readonly crawlAttachments?: boolean | cdk.IResolvable;

    /**
     * A list of regular expression patterns to exclude certain documents in your Salesforce.
     *
     * Documents that match the patterns are excluded from the index. Documents that don't match the patterns are included in the index. If a document matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the document isn't included in the index.
     *
     * The pattern is applied to the name of the attached file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforceconfiguration.html#cfn-kendra-datasource-salesforceconfiguration-excludeattachmentfilepatterns
     */
    readonly excludeAttachmentFilePatterns?: Array<string>;

    /**
     * A list of regular expression patterns to include certain documents in your Salesforce.
     *
     * Documents that match the patterns are included in the index. Documents that don't match the patterns are excluded from the index. If a document matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the document isn't included in the index.
     *
     * The pattern is applied to the name of the attached file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforceconfiguration.html#cfn-kendra-datasource-salesforceconfiguration-includeattachmentfilepatterns
     */
    readonly includeAttachmentFilePatterns?: Array<string>;

    /**
     * Configuration information for the knowledge article types that Amazon Kendra indexes.
     *
     * Amazon Kendra indexes standard knowledge articles and the standard fields of knowledge articles, or the custom fields of custom knowledge articles, but not both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforceconfiguration.html#cfn-kendra-datasource-salesforceconfiguration-knowledgearticleconfiguration
     */
    readonly knowledgeArticleConfiguration?: cdk.IResolvable | CfnDataSource.SalesforceKnowledgeArticleConfigurationProperty;

    /**
     * The Amazon Resource Name (ARN) of an AWS Secrets Manager secret that contains the key/value pairs required to connect to your Salesforce instance.
     *
     * The secret must contain a JSON structure with the following keys:
     *
     * - authenticationUrl - The OAUTH endpoint that Amazon Kendra connects to get an OAUTH token.
     * - consumerKey - The application public key generated when you created your Salesforce application.
     * - consumerSecret - The application private key generated when you created your Salesforce application.
     * - password - The password associated with the user logging in to the Salesforce instance.
     * - securityToken - The token associated with the user logging in to the Salesforce instance.
     * - username - The user name of the user logging in to the Salesforce instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforceconfiguration.html#cfn-kendra-datasource-salesforceconfiguration-secretarn
     */
    readonly secretArn: string;

    /**
     * The instance URL for the Salesforce site that you want to index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforceconfiguration.html#cfn-kendra-datasource-salesforceconfiguration-serverurl
     */
    readonly serverUrl: string;

    /**
     * Configuration information for processing attachments to Salesforce standard objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforceconfiguration.html#cfn-kendra-datasource-salesforceconfiguration-standardobjectattachmentconfiguration
     */
    readonly standardObjectAttachmentConfiguration?: cdk.IResolvable | CfnDataSource.SalesforceStandardObjectAttachmentConfigurationProperty;

    /**
     * Configuration of the Salesforce standard objects that Amazon Kendra indexes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforceconfiguration.html#cfn-kendra-datasource-salesforceconfiguration-standardobjectconfigurations
     */
    readonly standardObjectConfigurations?: Array<cdk.IResolvable | CfnDataSource.SalesforceStandardObjectConfigurationProperty> | cdk.IResolvable;
  }

  /**
   * Specifies configuration information for indexing a single standard object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcestandardobjectconfiguration.html
   */
  export interface SalesforceStandardObjectConfigurationProperty {
    /**
     * The name of the field in the standard object table that contains the document contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcestandardobjectconfiguration.html#cfn-kendra-datasource-salesforcestandardobjectconfiguration-documentdatafieldname
     */
    readonly documentDataFieldName: string;

    /**
     * The name of the field in the standard object table that contains the document title.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcestandardobjectconfiguration.html#cfn-kendra-datasource-salesforcestandardobjectconfiguration-documenttitlefieldname
     */
    readonly documentTitleFieldName?: string;

    /**
     * Maps attributes or field names of the standard object to Amazon Kendra index field names.
     *
     * To create custom fields, use the `UpdateIndex` API before you map to Salesforce fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The Salesforce data source field names must exist in your Salesforce custom metadata.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcestandardobjectconfiguration.html#cfn-kendra-datasource-salesforcestandardobjectconfiguration-fieldmappings
     */
    readonly fieldMappings?: Array<CfnDataSource.DataSourceToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the standard object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcestandardobjectconfiguration.html#cfn-kendra-datasource-salesforcestandardobjectconfiguration-name
     */
    readonly name: string;
  }

  /**
   * Provides the configuration information for processing attachments to Salesforce standard objects.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcestandardobjectattachmentconfiguration.html
   */
  export interface SalesforceStandardObjectAttachmentConfigurationProperty {
    /**
     * The name of the field used for the document title.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcestandardobjectattachmentconfiguration.html#cfn-kendra-datasource-salesforcestandardobjectattachmentconfiguration-documenttitlefieldname
     */
    readonly documentTitleFieldName?: string;

    /**
     * One or more objects that map fields in attachments to Amazon Kendra index fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcestandardobjectattachmentconfiguration.html#cfn-kendra-datasource-salesforcestandardobjectattachmentconfiguration-fieldmappings
     */
    readonly fieldMappings?: Array<CfnDataSource.DataSourceToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * The configuration information for syncing a Salesforce chatter feed.
   *
   * The contents of the object comes from the Salesforce FeedItem table.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcechatterfeedconfiguration.html
   */
  export interface SalesforceChatterFeedConfigurationProperty {
    /**
     * The name of the column in the Salesforce FeedItem table that contains the content to index.
     *
     * Typically this is the `Body` column.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcechatterfeedconfiguration.html#cfn-kendra-datasource-salesforcechatterfeedconfiguration-documentdatafieldname
     */
    readonly documentDataFieldName: string;

    /**
     * The name of the column in the Salesforce FeedItem table that contains the title of the document.
     *
     * This is typically the `Title` column.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcechatterfeedconfiguration.html#cfn-kendra-datasource-salesforcechatterfeedconfiguration-documenttitlefieldname
     */
    readonly documentTitleFieldName?: string;

    /**
     * Maps fields from a Salesforce chatter feed into Amazon Kendra index fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcechatterfeedconfiguration.html#cfn-kendra-datasource-salesforcechatterfeedconfiguration-fieldmappings
     */
    readonly fieldMappings?: Array<CfnDataSource.DataSourceToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Filters the documents in the feed based on status of the user.
     *
     * When you specify `ACTIVE_USERS` only documents from users who have an active account are indexed. When you specify `STANDARD_USER` only documents for Salesforce standard users are documented. You can specify both.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcechatterfeedconfiguration.html#cfn-kendra-datasource-salesforcechatterfeedconfiguration-includefiltertypes
     */
    readonly includeFilterTypes?: Array<string>;
  }

  /**
   * Provides the configuration information for the knowledge article types that Amazon Kendra indexes.
   *
   * Amazon Kendra indexes standard knowledge articles and the standard fields of knowledge articles, or the custom fields of custom knowledge articles, but not both
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforceknowledgearticleconfiguration.html
   */
  export interface SalesforceKnowledgeArticleConfigurationProperty {
    /**
     * Configuration information for custom Salesforce knowledge articles.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforceknowledgearticleconfiguration.html#cfn-kendra-datasource-salesforceknowledgearticleconfiguration-customknowledgearticletypeconfigurations
     */
    readonly customKnowledgeArticleTypeConfigurations?: Array<cdk.IResolvable | CfnDataSource.SalesforceCustomKnowledgeArticleTypeConfigurationProperty> | cdk.IResolvable;

    /**
     * Specifies the document states that should be included when Amazon Kendra indexes knowledge articles.
     *
     * You must specify at least one state.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforceknowledgearticleconfiguration.html#cfn-kendra-datasource-salesforceknowledgearticleconfiguration-includedstates
     */
    readonly includedStates: Array<string>;

    /**
     * Configuration information for standard Salesforce knowledge articles.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforceknowledgearticleconfiguration.html#cfn-kendra-datasource-salesforceknowledgearticleconfiguration-standardknowledgearticletypeconfiguration
     */
    readonly standardKnowledgeArticleTypeConfiguration?: cdk.IResolvable | CfnDataSource.SalesforceStandardKnowledgeArticleTypeConfigurationProperty;
  }

  /**
   * Provides the configuration information for standard Salesforce knowledge articles.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcestandardknowledgearticletypeconfiguration.html
   */
  export interface SalesforceStandardKnowledgeArticleTypeConfigurationProperty {
    /**
     * The name of the field that contains the document data to index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcestandardknowledgearticletypeconfiguration.html#cfn-kendra-datasource-salesforcestandardknowledgearticletypeconfiguration-documentdatafieldname
     */
    readonly documentDataFieldName: string;

    /**
     * The name of the field that contains the document title.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcestandardknowledgearticletypeconfiguration.html#cfn-kendra-datasource-salesforcestandardknowledgearticletypeconfiguration-documenttitlefieldname
     */
    readonly documentTitleFieldName?: string;

    /**
     * Maps attributes or field names of the knowledge article to Amazon Kendra index field names.
     *
     * To create custom fields, use the `UpdateIndex` API before you map to Salesforce fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The Salesforce data source field names must exist in your Salesforce custom metadata.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcestandardknowledgearticletypeconfiguration.html#cfn-kendra-datasource-salesforcestandardknowledgearticletypeconfiguration-fieldmappings
     */
    readonly fieldMappings?: Array<CfnDataSource.DataSourceToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Provides the configuration information for indexing Salesforce custom articles.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcecustomknowledgearticletypeconfiguration.html
   */
  export interface SalesforceCustomKnowledgeArticleTypeConfigurationProperty {
    /**
     * The name of the field in the custom knowledge article that contains the document data to index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcecustomknowledgearticletypeconfiguration.html#cfn-kendra-datasource-salesforcecustomknowledgearticletypeconfiguration-documentdatafieldname
     */
    readonly documentDataFieldName: string;

    /**
     * The name of the field in the custom knowledge article that contains the document title.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcecustomknowledgearticletypeconfiguration.html#cfn-kendra-datasource-salesforcecustomknowledgearticletypeconfiguration-documenttitlefieldname
     */
    readonly documentTitleFieldName?: string;

    /**
     * Maps attributes or field names of the custom knowledge article to Amazon Kendra index field names.
     *
     * To create custom fields, use the `UpdateIndex` API before you map to Salesforce fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The Salesforce data source field names must exist in your Salesforce custom metadata.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcecustomknowledgearticletypeconfiguration.html#cfn-kendra-datasource-salesforcecustomknowledgearticletypeconfiguration-fieldmappings
     */
    readonly fieldMappings?: Array<CfnDataSource.DataSourceToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-salesforcecustomknowledgearticletypeconfiguration.html#cfn-kendra-datasource-salesforcecustomknowledgearticletypeconfiguration-name
     */
    readonly name: string;
  }

  /**
   * Provides the configuration information to an [Amazon Kendra supported database](https://docs.aws.amazon.com/kendra/latest/dg/data-source-database.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-databaseconfiguration.html
   */
  export interface DatabaseConfigurationProperty {
    /**
     * Information about the database column that provides information for user context filtering.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-databaseconfiguration.html#cfn-kendra-datasource-databaseconfiguration-aclconfiguration
     */
    readonly aclConfiguration?: CfnDataSource.AclConfigurationProperty | cdk.IResolvable;

    /**
     * Information about where the index should get the document information from the database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-databaseconfiguration.html#cfn-kendra-datasource-databaseconfiguration-columnconfiguration
     */
    readonly columnConfiguration: CfnDataSource.ColumnConfigurationProperty | cdk.IResolvable;

    /**
     * Configuration information that's required to connect to a database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-databaseconfiguration.html#cfn-kendra-datasource-databaseconfiguration-connectionconfiguration
     */
    readonly connectionConfiguration: CfnDataSource.ConnectionConfigurationProperty | cdk.IResolvable;

    /**
     * The type of database engine that runs the database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-databaseconfiguration.html#cfn-kendra-datasource-databaseconfiguration-databaseenginetype
     */
    readonly databaseEngineType: string;

    /**
     * Provides information about how Amazon Kendra uses quote marks around SQL identifiers when querying a database data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-databaseconfiguration.html#cfn-kendra-datasource-databaseconfiguration-sqlconfiguration
     */
    readonly sqlConfiguration?: cdk.IResolvable | CfnDataSource.SqlConfigurationProperty;

    /**
     * Provides information for connecting to an Amazon VPC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-databaseconfiguration.html#cfn-kendra-datasource-databaseconfiguration-vpcconfiguration
     */
    readonly vpcConfiguration?: CfnDataSource.DataSourceVpcConfigurationProperty | cdk.IResolvable;
  }

  /**
   * Provides information that configures Amazon Kendra to use a SQL database.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sqlconfiguration.html
   */
  export interface SqlConfigurationProperty {
    /**
     * Determines whether Amazon Kendra encloses SQL identifiers for tables and column names in double quotes (") when making a database query.
     *
     * You can set the value to `DOUBLE_QUOTES` or `NONE` .
     *
     * By default, Amazon Kendra passes SQL identifiers the way that they are entered into the data source configuration. It does not change the case of identifiers or enclose them in quotes.
     *
     * PostgreSQL internally converts uppercase characters to lower case characters in identifiers unless they are quoted. Choosing this option encloses identifiers in quotes so that PostgreSQL does not convert the character's case.
     *
     * For MySQL databases, you must enable the ansi_quotes option when you set this field to `DOUBLE_QUOTES` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sqlconfiguration.html#cfn-kendra-datasource-sqlconfiguration-queryidentifiersenclosingoption
     */
    readonly queryIdentifiersEnclosingOption?: string;
  }

  /**
   * Provides the configuration information that's required to connect to a database.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-connectionconfiguration.html
   */
  export interface ConnectionConfigurationProperty {
    /**
     * The name of the host for the database.
     *
     * Can be either a string (host.subdomain.domain.tld) or an IPv4 or IPv6 address.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-connectionconfiguration.html#cfn-kendra-datasource-connectionconfiguration-databasehost
     */
    readonly databaseHost: string;

    /**
     * The name of the database containing the document data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-connectionconfiguration.html#cfn-kendra-datasource-connectionconfiguration-databasename
     */
    readonly databaseName: string;

    /**
     * The port that the database uses for connections.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-connectionconfiguration.html#cfn-kendra-datasource-connectionconfiguration-databaseport
     */
    readonly databasePort: number;

    /**
     * The Amazon Resource Name (ARN) of credentials stored in AWS Secrets Manager .
     *
     * The credentials should be a user/password pair. For more information, see [Using a Database Data Source](https://docs.aws.amazon.com/kendra/latest/dg/data-source-database.html) . For more information about AWS Secrets Manager , see [What Is AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) in the *AWS Secrets Manager* user guide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-connectionconfiguration.html#cfn-kendra-datasource-connectionconfiguration-secretarn
     */
    readonly secretArn: string;

    /**
     * The name of the table that contains the document data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-connectionconfiguration.html#cfn-kendra-datasource-connectionconfiguration-tablename
     */
    readonly tableName: string;
  }

  /**
   * Provides information about how Amazon Kendra should use the columns of a database in an index.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-columnconfiguration.html
   */
  export interface ColumnConfigurationProperty {
    /**
     * One to five columns that indicate when a document in the database has changed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-columnconfiguration.html#cfn-kendra-datasource-columnconfiguration-changedetectingcolumns
     */
    readonly changeDetectingColumns: Array<string>;

    /**
     * The column that contains the contents of the document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-columnconfiguration.html#cfn-kendra-datasource-columnconfiguration-documentdatacolumnname
     */
    readonly documentDataColumnName: string;

    /**
     * The column that provides the document's identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-columnconfiguration.html#cfn-kendra-datasource-columnconfiguration-documentidcolumnname
     */
    readonly documentIdColumnName: string;

    /**
     * The column that contains the title of the document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-columnconfiguration.html#cfn-kendra-datasource-columnconfiguration-documenttitlecolumnname
     */
    readonly documentTitleColumnName?: string;

    /**
     * An array of objects that map database column names to the corresponding fields in an index.
     *
     * You must first create the fields in the index using the [UpdateIndex](https://docs.aws.amazon.com/kendra/latest/dg/API_UpdateIndex.html) operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-columnconfiguration.html#cfn-kendra-datasource-columnconfiguration-fieldmappings
     */
    readonly fieldMappings?: Array<CfnDataSource.DataSourceToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Provides the configuration information to connect to an Amazon VPC.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourcevpcconfiguration.html
   */
  export interface DataSourceVpcConfigurationProperty {
    /**
     * A list of identifiers of security groups within your Amazon VPC.
     *
     * The security groups should enable Amazon Kendra to connect to the data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourcevpcconfiguration.html#cfn-kendra-datasource-datasourcevpcconfiguration-securitygroupids
     */
    readonly securityGroupIds: Array<string>;

    /**
     * A list of identifiers for subnets within your Amazon VPC.
     *
     * The subnets should be able to connect to each other in the VPC, and they should have outgoing access to the Internet through a NAT device.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-datasourcevpcconfiguration.html#cfn-kendra-datasource-datasourcevpcconfiguration-subnetids
     */
    readonly subnetIds: Array<string>;
  }

  /**
   * Provides information about the column that should be used for filtering the query response by groups.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-aclconfiguration.html
   */
  export interface AclConfigurationProperty {
    /**
     * A list of groups, separated by semi-colons, that filters a query response based on user context.
     *
     * The document is only returned to users that are in one of the groups specified in the `UserContext` field of the [Query](https://docs.aws.amazon.com/kendra/latest/dg/API_Query.html) operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-aclconfiguration.html#cfn-kendra-datasource-aclconfiguration-allowedgroupscolumnname
     */
    readonly allowedGroupsColumnName: string;
  }

  /**
   * Provides the configuration information to connect to Microsoft SharePoint as your data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sharepointconfiguration.html
   */
  export interface SharePointConfigurationProperty {
    /**
     * `TRUE` to index document attachments.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sharepointconfiguration.html#cfn-kendra-datasource-sharepointconfiguration-crawlattachments
     */
    readonly crawlAttachments?: boolean | cdk.IResolvable;

    /**
     * `TRUE` to disable local groups information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sharepointconfiguration.html#cfn-kendra-datasource-sharepointconfiguration-disablelocalgroups
     */
    readonly disableLocalGroups?: boolean | cdk.IResolvable;

    /**
     * The Microsoft SharePoint attribute field that contains the title of the document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sharepointconfiguration.html#cfn-kendra-datasource-sharepointconfiguration-documenttitlefieldname
     */
    readonly documentTitleFieldName?: string;

    /**
     * A list of regular expression patterns.
     *
     * Documents that match the patterns are excluded from the index. Documents that don't match the patterns are included in the index. If a document matches both an exclusion pattern and an inclusion pattern, the document is not included in the index.
     *
     * The regex is applied to the display URL of the SharePoint document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sharepointconfiguration.html#cfn-kendra-datasource-sharepointconfiguration-exclusionpatterns
     */
    readonly exclusionPatterns?: Array<string>;

    /**
     * A list of `DataSourceToIndexFieldMapping` objects that map Microsoft SharePoint attributes or fields to Amazon Kendra index fields.
     *
     * You must first create the index fields using the [UpdateIndex](https://docs.aws.amazon.com/kendra/latest/dg/API_UpdateIndex.html) operation before you map SharePoint attributes. For more information, see [Mapping Data Source Fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sharepointconfiguration.html#cfn-kendra-datasource-sharepointconfiguration-fieldmappings
     */
    readonly fieldMappings?: Array<CfnDataSource.DataSourceToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of regular expression patterns to include certain documents in your SharePoint.
     *
     * Documents that match the patterns are included in the index. Documents that don't match the patterns are excluded from the index. If a document matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the document isn't included in the index.
     *
     * The regex applies to the display URL of the SharePoint document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sharepointconfiguration.html#cfn-kendra-datasource-sharepointconfiguration-inclusionpatterns
     */
    readonly inclusionPatterns?: Array<string>;

    /**
     * The Amazon Resource Name (ARN) of an AWS Secrets Manager secret that contains the user name and password required to connect to the SharePoint instance.
     *
     * For more information, see [Microsoft SharePoint](https://docs.aws.amazon.com/kendra/latest/dg/data-source-sharepoint.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sharepointconfiguration.html#cfn-kendra-datasource-sharepointconfiguration-secretarn
     */
    readonly secretArn: string;

    /**
     * The version of Microsoft SharePoint that you use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sharepointconfiguration.html#cfn-kendra-datasource-sharepointconfiguration-sharepointversion
     */
    readonly sharePointVersion: string;

    /**
     * Information required to find a specific file in an Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sharepointconfiguration.html#cfn-kendra-datasource-sharepointconfiguration-sslcertificates3path
     */
    readonly sslCertificateS3Path?: cdk.IResolvable | CfnDataSource.S3PathProperty;

    /**
     * The Microsoft SharePoint site URLs for the documents you want to index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sharepointconfiguration.html#cfn-kendra-datasource-sharepointconfiguration-urls
     */
    readonly urls: Array<string>;

    /**
     * `TRUE` to use the SharePoint change log to determine which documents require updating in the index.
     *
     * Depending on the change log's size, it may take longer for Amazon Kendra to use the change log than to scan all of your documents in SharePoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sharepointconfiguration.html#cfn-kendra-datasource-sharepointconfiguration-usechangelog
     */
    readonly useChangeLog?: boolean | cdk.IResolvable;

    /**
     * Provides information for connecting to an Amazon VPC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-sharepointconfiguration.html#cfn-kendra-datasource-sharepointconfiguration-vpcconfiguration
     */
    readonly vpcConfiguration?: CfnDataSource.DataSourceVpcConfigurationProperty | cdk.IResolvable;
  }

  /**
   * Information required to find a specific file in an Amazon S3 bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-s3path.html
   */
  export interface S3PathProperty {
    /**
     * The name of the S3 bucket that contains the file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-s3path.html#cfn-kendra-datasource-s3path-bucket
     */
    readonly bucket: string;

    /**
     * The name of the file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-s3path.html#cfn-kendra-datasource-s3path-key
     */
    readonly key: string;
  }

  /**
   * Provides the configuration information to connect to Confluence as your data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceconfiguration.html
   */
  export interface ConfluenceConfigurationProperty {
    /**
     * Configuration information for indexing attachments to Confluence blogs and pages.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceconfiguration.html#cfn-kendra-datasource-confluenceconfiguration-attachmentconfiguration
     */
    readonly attachmentConfiguration?: CfnDataSource.ConfluenceAttachmentConfigurationProperty | cdk.IResolvable;

    /**
     * Configuration information for indexing Confluence blogs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceconfiguration.html#cfn-kendra-datasource-confluenceconfiguration-blogconfiguration
     */
    readonly blogConfiguration?: CfnDataSource.ConfluenceBlogConfigurationProperty | cdk.IResolvable;

    /**
     * A list of regular expression patterns to exclude certain blog posts, pages, spaces, or attachments in your Confluence.
     *
     * Content that matches the patterns are excluded from the index. Content that doesn't match the patterns is included in the index. If content matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the content isn't included in the index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceconfiguration.html#cfn-kendra-datasource-confluenceconfiguration-exclusionpatterns
     */
    readonly exclusionPatterns?: Array<string>;

    /**
     * A list of regular expression patterns to include certain blog posts, pages, spaces, or attachments in your Confluence.
     *
     * Content that matches the patterns are included in the index. Content that doesn't match the patterns is excluded from the index. If content matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the content isn't included in the index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceconfiguration.html#cfn-kendra-datasource-confluenceconfiguration-inclusionpatterns
     */
    readonly inclusionPatterns?: Array<string>;

    /**
     * Configuration information for indexing Confluence pages.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceconfiguration.html#cfn-kendra-datasource-confluenceconfiguration-pageconfiguration
     */
    readonly pageConfiguration?: CfnDataSource.ConfluencePageConfigurationProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of an AWS Secrets Manager secret that contains the user name and password required to connect to the Confluence instance.
     *
     * If you use Confluence Cloud, you use a generated API token as the password.
     *
     * You can also provide authentication credentials in the form of a personal access token. For more information, see [Using a Confluence data source](https://docs.aws.amazon.com/kendra/latest/dg/data-source-confluence.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceconfiguration.html#cfn-kendra-datasource-confluenceconfiguration-secretarn
     */
    readonly secretArn: string;

    /**
     * The URL of your Confluence instance.
     *
     * Use the full URL of the server. For example, *https://server.example.com:port/* . You can also use an IP address, for example, *https://192.168.1.113/* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceconfiguration.html#cfn-kendra-datasource-confluenceconfiguration-serverurl
     */
    readonly serverUrl: string;

    /**
     * Configuration information for indexing Confluence spaces.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceconfiguration.html#cfn-kendra-datasource-confluenceconfiguration-spaceconfiguration
     */
    readonly spaceConfiguration?: CfnDataSource.ConfluenceSpaceConfigurationProperty | cdk.IResolvable;

    /**
     * The version or the type of Confluence installation to connect to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceconfiguration.html#cfn-kendra-datasource-confluenceconfiguration-version
     */
    readonly version: string;

    /**
     * Configuration information for an Amazon Virtual Private Cloud to connect to your Confluence.
     *
     * For more information, see [Configuring a VPC](https://docs.aws.amazon.com/kendra/latest/dg/vpc-configuration.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceconfiguration.html#cfn-kendra-datasource-confluenceconfiguration-vpcconfiguration
     */
    readonly vpcConfiguration?: CfnDataSource.DataSourceVpcConfigurationProperty | cdk.IResolvable;
  }

  /**
   * Configuration of attachment settings for the Confluence data source.
   *
   * Attachment settings are optional, if you don't specify settings attachments, Amazon Kendra won't index them.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceattachmentconfiguration.html
   */
  export interface ConfluenceAttachmentConfigurationProperty {
    /**
     * Maps attributes or field names of Confluence attachments to Amazon Kendra index field names.
     *
     * To create custom fields, use the `UpdateIndex` API before you map to Confluence fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The Confluence data source field names must exist in your Confluence custom metadata.
     *
     * If you specify the `AttachentFieldMappings` parameter, you must specify at least one field mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceattachmentconfiguration.html#cfn-kendra-datasource-confluenceattachmentconfiguration-attachmentfieldmappings
     */
    readonly attachmentFieldMappings?: Array<CfnDataSource.ConfluenceAttachmentToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * `TRUE` to index attachments of pages and blogs in Confluence.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceattachmentconfiguration.html#cfn-kendra-datasource-confluenceattachmentconfiguration-crawlattachments
     */
    readonly crawlAttachments?: boolean | cdk.IResolvable;
  }

  /**
   * Maps attributes or field names of Confluence attachments to Amazon Kendra index field names.
   *
   * To create custom fields, use the `UpdateIndex` API before you map to Confluence fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The Confuence data source field names must exist in your Confluence custom metadata.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceattachmenttoindexfieldmapping.html
   */
  export interface ConfluenceAttachmentToIndexFieldMappingProperty {
    /**
     * The name of the field in the data source.
     *
     * You must first create the index field using the `UpdateIndex` API.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceattachmenttoindexfieldmapping.html#cfn-kendra-datasource-confluenceattachmenttoindexfieldmapping-datasourcefieldname
     */
    readonly dataSourceFieldName: string;

    /**
     * The format for date fields in the data source.
     *
     * If the field specified in `DataSourceFieldName` is a date field you must specify the date format. If the field is not a date field, an exception is thrown.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceattachmenttoindexfieldmapping.html#cfn-kendra-datasource-confluenceattachmenttoindexfieldmapping-datefieldformat
     */
    readonly dateFieldFormat?: string;

    /**
     * The name of the index field to map to the Confluence data source field.
     *
     * The index field type must match the Confluence field type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceattachmenttoindexfieldmapping.html#cfn-kendra-datasource-confluenceattachmenttoindexfieldmapping-indexfieldname
     */
    readonly indexFieldName: string;
  }

  /**
   * Configuration of the page settings for the Confluence data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencepageconfiguration.html
   */
  export interface ConfluencePageConfigurationProperty {
    /**
     * Maps attributes or field names of Confluence pages to Amazon Kendra index field names.
     *
     * To create custom fields, use the `UpdateIndex` API before you map to Confluence fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The Confluence data source field names must exist in your Confluence custom metadata.
     *
     * If you specify the `PageFieldMappings` parameter, you must specify at least one field mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencepageconfiguration.html#cfn-kendra-datasource-confluencepageconfiguration-pagefieldmappings
     */
    readonly pageFieldMappings?: Array<CfnDataSource.ConfluencePageToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Maps attributes or field names of Confluence pages to Amazon Kendra index field names.
   *
   * To create custom fields, use the `UpdateIndex` API before you map to Confluence fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The Confluence data source field names must exist in your Confluence custom metadata.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencepagetoindexfieldmapping.html
   */
  export interface ConfluencePageToIndexFieldMappingProperty {
    /**
     * The name of the field in the data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencepagetoindexfieldmapping.html#cfn-kendra-datasource-confluencepagetoindexfieldmapping-datasourcefieldname
     */
    readonly dataSourceFieldName: string;

    /**
     * The format for date fields in the data source.
     *
     * If the field specified in `DataSourceFieldName` is a date field you must specify the date format. If the field is not a date field, an exception is thrown.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencepagetoindexfieldmapping.html#cfn-kendra-datasource-confluencepagetoindexfieldmapping-datefieldformat
     */
    readonly dateFieldFormat?: string;

    /**
     * The name of the index field to map to the Confluence data source field.
     *
     * The index field type must match the Confluence field type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencepagetoindexfieldmapping.html#cfn-kendra-datasource-confluencepagetoindexfieldmapping-indexfieldname
     */
    readonly indexFieldName: string;
  }

  /**
   * Configuration of blog settings for the Confluence data source.
   *
   * Blogs are always indexed unless filtered from the index by the `ExclusionPatterns` or `InclusionPatterns` fields in the `ConfluenceConfiguration` object.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceblogconfiguration.html
   */
  export interface ConfluenceBlogConfigurationProperty {
    /**
     * Maps attributes or field names of Confluence blogs to Amazon Kendra index field names.
     *
     * To create custom fields, use the `UpdateIndex` API before you map to Confluence fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The Confluence data source field names must exist in your Confluence custom metadata.
     *
     * If you specify the `BlogFieldMappings` parameter, you must specify at least one field mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceblogconfiguration.html#cfn-kendra-datasource-confluenceblogconfiguration-blogfieldmappings
     */
    readonly blogFieldMappings?: Array<CfnDataSource.ConfluenceBlogToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Maps attributes or field names of Confluence blog to Amazon Kendra index field names.
   *
   * To create custom fields, use the `UpdateIndex` API before you map to Confluence fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The Confluence data source field names must exist in your Confluence custom metadata.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceblogtoindexfieldmapping.html
   */
  export interface ConfluenceBlogToIndexFieldMappingProperty {
    /**
     * The name of the field in the data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceblogtoindexfieldmapping.html#cfn-kendra-datasource-confluenceblogtoindexfieldmapping-datasourcefieldname
     */
    readonly dataSourceFieldName: string;

    /**
     * The format for date fields in the data source.
     *
     * If the field specified in `DataSourceFieldName` is a date field you must specify the date format. If the field is not a date field, an exception is thrown.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceblogtoindexfieldmapping.html#cfn-kendra-datasource-confluenceblogtoindexfieldmapping-datefieldformat
     */
    readonly dateFieldFormat?: string;

    /**
     * The name of the index field to map to the Confluence data source field.
     *
     * The index field type must match the Confluence field type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluenceblogtoindexfieldmapping.html#cfn-kendra-datasource-confluenceblogtoindexfieldmapping-indexfieldname
     */
    readonly indexFieldName: string;
  }

  /**
   * Configuration information for indexing Confluence spaces.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencespaceconfiguration.html
   */
  export interface ConfluenceSpaceConfigurationProperty {
    /**
     * `TRUE` to index archived spaces.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencespaceconfiguration.html#cfn-kendra-datasource-confluencespaceconfiguration-crawlarchivedspaces
     */
    readonly crawlArchivedSpaces?: boolean | cdk.IResolvable;

    /**
     * `TRUE` to index personal spaces.
     *
     * You can add restrictions to items in personal spaces. If personal spaces are indexed, queries without user context information may return restricted items from a personal space in their results. For more information, see [Filtering on user context](https://docs.aws.amazon.com/kendra/latest/dg/user-context-filter.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencespaceconfiguration.html#cfn-kendra-datasource-confluencespaceconfiguration-crawlpersonalspaces
     */
    readonly crawlPersonalSpaces?: boolean | cdk.IResolvable;

    /**
     * A list of space keys of Confluence spaces.
     *
     * If you include a key, the blogs, documents, and attachments in the space are not indexed. If a space is in both the `ExcludeSpaces` and the `IncludeSpaces` list, the space is excluded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencespaceconfiguration.html#cfn-kendra-datasource-confluencespaceconfiguration-excludespaces
     */
    readonly excludeSpaces?: Array<string>;

    /**
     * A list of space keys for Confluence spaces.
     *
     * If you include a key, the blogs, documents, and attachments in the space are indexed. Spaces that aren't in the list aren't indexed. A space in the list must exist. Otherwise, Amazon Kendra logs an error when the data source is synchronized. If a space is in both the `IncludeSpaces` and the `ExcludeSpaces` list, the space is excluded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencespaceconfiguration.html#cfn-kendra-datasource-confluencespaceconfiguration-includespaces
     */
    readonly includeSpaces?: Array<string>;

    /**
     * Maps attributes or field names of Confluence spaces to Amazon Kendra index field names.
     *
     * To create custom fields, use the `UpdateIndex` API before you map to Confluence fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The Confluence data source field names must exist in your Confluence custom metadata.
     *
     * If you specify the `SpaceFieldMappings` parameter, you must specify at least one field mapping.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencespaceconfiguration.html#cfn-kendra-datasource-confluencespaceconfiguration-spacefieldmappings
     */
    readonly spaceFieldMappings?: Array<CfnDataSource.ConfluenceSpaceToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Maps attributes or field names of Confluence spaces to Amazon Kendra index field names.
   *
   * To create custom fields, use the `UpdateIndex` API before you map to Confluence fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The Confluence data source field names must exist in your Confluence custom metadata.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencespacetoindexfieldmapping.html
   */
  export interface ConfluenceSpaceToIndexFieldMappingProperty {
    /**
     * The name of the field in the data source.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencespacetoindexfieldmapping.html#cfn-kendra-datasource-confluencespacetoindexfieldmapping-datasourcefieldname
     */
    readonly dataSourceFieldName: string;

    /**
     * The format for date fields in the data source.
     *
     * If the field specified in `DataSourceFieldName` is a date field you must specify the date format. If the field is not a date field, an exception is thrown.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencespacetoindexfieldmapping.html#cfn-kendra-datasource-confluencespacetoindexfieldmapping-datefieldformat
     */
    readonly dateFieldFormat?: string;

    /**
     * The name of the index field to map to the Confluence data source field.
     *
     * The index field type must match the Confluence field type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-confluencespacetoindexfieldmapping.html#cfn-kendra-datasource-confluencespacetoindexfieldmapping-indexfieldname
     */
    readonly indexFieldName: string;
  }

  /**
   * Provides the configuration information to connect to Amazon WorkDocs as your data source.
   *
   * Amazon WorkDocs connector is available in Oregon, North Virginia, Sydney, Singapore and Ireland regions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-workdocsconfiguration.html
   */
  export interface WorkDocsConfigurationProperty {
    /**
     * `TRUE` to include comments on documents in your index.
     *
     * Including comments in your index means each comment is a document that can be searched on.
     *
     * The default is set to `FALSE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-workdocsconfiguration.html#cfn-kendra-datasource-workdocsconfiguration-crawlcomments
     */
    readonly crawlComments?: boolean | cdk.IResolvable;

    /**
     * A list of regular expression patterns to exclude certain files in your Amazon WorkDocs site repository.
     *
     * Files that match the patterns are excluded from the index. Files that don’t match the patterns are included in the index. If a file matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the file isn't included in the index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-workdocsconfiguration.html#cfn-kendra-datasource-workdocsconfiguration-exclusionpatterns
     */
    readonly exclusionPatterns?: Array<string>;

    /**
     * A list of `DataSourceToIndexFieldMapping` objects that map Amazon WorkDocs data source attributes or field names to Amazon Kendra index field names.
     *
     * To create custom fields, use the `UpdateIndex` API before you map to Amazon WorkDocs fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The Amazon WorkDocs data source field names must exist in your Amazon WorkDocs custom metadata.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-workdocsconfiguration.html#cfn-kendra-datasource-workdocsconfiguration-fieldmappings
     */
    readonly fieldMappings?: Array<CfnDataSource.DataSourceToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of regular expression patterns to include certain files in your Amazon WorkDocs site repository.
     *
     * Files that match the patterns are included in the index. Files that don't match the patterns are excluded from the index. If a file matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the file isn't included in the index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-workdocsconfiguration.html#cfn-kendra-datasource-workdocsconfiguration-inclusionpatterns
     */
    readonly inclusionPatterns?: Array<string>;

    /**
     * The identifier of the directory corresponding to your Amazon WorkDocs site repository.
     *
     * You can find the organization ID in the [AWS Directory Service](https://docs.aws.amazon.com/directoryservicev2/) by going to *Active Directory* , then *Directories* . Your Amazon WorkDocs site directory has an ID, which is the organization ID. You can also set up a new Amazon WorkDocs directory in the AWS Directory Service console and enable a Amazon WorkDocs site for the directory in the Amazon WorkDocs console.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-workdocsconfiguration.html#cfn-kendra-datasource-workdocsconfiguration-organizationid
     */
    readonly organizationId: string;

    /**
     * `TRUE` to use the Amazon WorkDocs change log to determine which documents require updating in the index.
     *
     * Depending on the change log's size, it may take longer for Amazon Kendra to use the change log than to scan all of your documents in Amazon WorkDocs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-workdocsconfiguration.html#cfn-kendra-datasource-workdocsconfiguration-usechangelog
     */
    readonly useChangeLog?: boolean | cdk.IResolvable;
  }

  /**
   * Provides the configuration information to connect to OneDrive as your data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-onedriveconfiguration.html
   */
  export interface OneDriveConfigurationProperty {
    /**
     * `TRUE` to disable local groups information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-onedriveconfiguration.html#cfn-kendra-datasource-onedriveconfiguration-disablelocalgroups
     */
    readonly disableLocalGroups?: boolean | cdk.IResolvable;

    /**
     * A list of regular expression patterns to exclude certain documents in your OneDrive.
     *
     * Documents that match the patterns are excluded from the index. Documents that don't match the patterns are included in the index. If a document matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the document isn't included in the index.
     *
     * The pattern is applied to the file name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-onedriveconfiguration.html#cfn-kendra-datasource-onedriveconfiguration-exclusionpatterns
     */
    readonly exclusionPatterns?: Array<string>;

    /**
     * A list of `DataSourceToIndexFieldMapping` objects that map OneDrive data source attributes or field names to Amazon Kendra index field names.
     *
     * To create custom fields, use the `UpdateIndex` API before you map to OneDrive fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The OneDrive data source field names must exist in your OneDrive custom metadata.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-onedriveconfiguration.html#cfn-kendra-datasource-onedriveconfiguration-fieldmappings
     */
    readonly fieldMappings?: Array<CfnDataSource.DataSourceToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of regular expression patterns to include certain documents in your OneDrive.
     *
     * Documents that match the patterns are included in the index. Documents that don't match the patterns are excluded from the index. If a document matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the document isn't included in the index.
     *
     * The pattern is applied to the file name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-onedriveconfiguration.html#cfn-kendra-datasource-onedriveconfiguration-inclusionpatterns
     */
    readonly inclusionPatterns?: Array<string>;

    /**
     * A list of user accounts whose documents should be indexed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-onedriveconfiguration.html#cfn-kendra-datasource-onedriveconfiguration-onedriveusers
     */
    readonly oneDriveUsers: cdk.IResolvable | CfnDataSource.OneDriveUsersProperty;

    /**
     * The Amazon Resource Name (ARN) of an AWS Secrets Manager secret that contains the user name and password to connect to OneDrive.
     *
     * The user name should be the application ID for the OneDrive application, and the password is the application key for the OneDrive application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-onedriveconfiguration.html#cfn-kendra-datasource-onedriveconfiguration-secretarn
     */
    readonly secretArn: string;

    /**
     * The Azure Active Directory domain of the organization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-onedriveconfiguration.html#cfn-kendra-datasource-onedriveconfiguration-tenantdomain
     */
    readonly tenantDomain: string;
  }

  /**
   * User accounts whose documents should be indexed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-onedriveusers.html
   */
  export interface OneDriveUsersProperty {
    /**
     * A list of users whose documents should be indexed.
     *
     * Specify the user names in email format, for example, `username@tenantdomain` . If you need to index the documents of more than 100 users, use the `OneDriveUserS3Path` field to specify the location of a file containing a list of users.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-onedriveusers.html#cfn-kendra-datasource-onedriveusers-onedriveuserlist
     */
    readonly oneDriveUserList?: Array<string>;

    /**
     * The S3 bucket location of a file containing a list of users whose documents should be indexed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-onedriveusers.html#cfn-kendra-datasource-onedriveusers-onedriveusers3path
     */
    readonly oneDriveUserS3Path?: cdk.IResolvable | CfnDataSource.S3PathProperty;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-templateconfiguration.html
   */
  export interface TemplateConfigurationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-templateconfiguration.html#cfn-kendra-datasource-templateconfiguration-template
     */
    readonly template: string;
  }

  /**
   * Provides the configuration information to connect to ServiceNow as your data source.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowconfiguration.html
   */
  export interface ServiceNowConfigurationProperty {
    /**
     * The type of authentication used to connect to the ServiceNow instance.
     *
     * If you choose `HTTP_BASIC` , Amazon Kendra is authenticated using the user name and password provided in the AWS Secrets Manager secret in the `SecretArn` field. If you choose `OAUTH2` , Amazon Kendra is authenticated using the credentials of client ID, client secret, user name and password.
     *
     * When you use `OAUTH2` authentication, you must generate a token and a client secret using the ServiceNow console. For more information, see [Using a ServiceNow data source](https://docs.aws.amazon.com/kendra/latest/dg/data-source-servicenow.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowconfiguration.html#cfn-kendra-datasource-servicenowconfiguration-authenticationtype
     */
    readonly authenticationType?: string;

    /**
     * The ServiceNow instance that the data source connects to.
     *
     * The host endpoint should look like the following: *{instance}.service-now.com.*
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowconfiguration.html#cfn-kendra-datasource-servicenowconfiguration-hosturl
     */
    readonly hostUrl: string;

    /**
     * Configuration information for crawling knowledge articles in the ServiceNow site.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowconfiguration.html#cfn-kendra-datasource-servicenowconfiguration-knowledgearticleconfiguration
     */
    readonly knowledgeArticleConfiguration?: cdk.IResolvable | CfnDataSource.ServiceNowKnowledgeArticleConfigurationProperty;

    /**
     * The Amazon Resource Name (ARN) of the AWS Secrets Manager secret that contains the user name and password required to connect to the ServiceNow instance.
     *
     * You can also provide OAuth authentication credentials of user name, password, client ID, and client secret. For more information, see [Using a ServiceNow data source](https://docs.aws.amazon.com/kendra/latest/dg/data-source-servicenow.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowconfiguration.html#cfn-kendra-datasource-servicenowconfiguration-secretarn
     */
    readonly secretArn: string;

    /**
     * Configuration information for crawling service catalogs in the ServiceNow site.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowconfiguration.html#cfn-kendra-datasource-servicenowconfiguration-servicecatalogconfiguration
     */
    readonly serviceCatalogConfiguration?: cdk.IResolvable | CfnDataSource.ServiceNowServiceCatalogConfigurationProperty;

    /**
     * The identifier of the release that the ServiceNow host is running.
     *
     * If the host is not running the `LONDON` release, use `OTHERS` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowconfiguration.html#cfn-kendra-datasource-servicenowconfiguration-servicenowbuildversion
     */
    readonly serviceNowBuildVersion: string;
  }

  /**
   * Provides the configuration information for crawling service catalog items in the ServiceNow site.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowservicecatalogconfiguration.html
   */
  export interface ServiceNowServiceCatalogConfigurationProperty {
    /**
     * `TRUE` to index attachments to service catalog items.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowservicecatalogconfiguration.html#cfn-kendra-datasource-servicenowservicecatalogconfiguration-crawlattachments
     */
    readonly crawlAttachments?: boolean | cdk.IResolvable;

    /**
     * The name of the ServiceNow field that is mapped to the index document contents field in the Amazon Kendra index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowservicecatalogconfiguration.html#cfn-kendra-datasource-servicenowservicecatalogconfiguration-documentdatafieldname
     */
    readonly documentDataFieldName: string;

    /**
     * The name of the ServiceNow field that is mapped to the index document title field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowservicecatalogconfiguration.html#cfn-kendra-datasource-servicenowservicecatalogconfiguration-documenttitlefieldname
     */
    readonly documentTitleFieldName?: string;

    /**
     * A list of regular expression patterns to exclude certain attachments of catalogs in your ServiceNow.
     *
     * Item that match the patterns are excluded from the index. Items that don't match the patterns are included in the index. If an item matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the item isn't included in the index.
     *
     * The regex is applied to the file name of the attachment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowservicecatalogconfiguration.html#cfn-kendra-datasource-servicenowservicecatalogconfiguration-excludeattachmentfilepatterns
     */
    readonly excludeAttachmentFilePatterns?: Array<string>;

    /**
     * Maps attributes or field names of catalogs to Amazon Kendra index field names.
     *
     * To create custom fields, use the `UpdateIndex` API before you map to ServiceNow fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The ServiceNow data source field names must exist in your ServiceNow custom metadata.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowservicecatalogconfiguration.html#cfn-kendra-datasource-servicenowservicecatalogconfiguration-fieldmappings
     */
    readonly fieldMappings?: Array<CfnDataSource.DataSourceToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A list of regular expression patterns to include certain attachments of catalogs in your ServiceNow.
     *
     * Item that match the patterns are included in the index. Items that don't match the patterns are excluded from the index. If an item matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the item isn't included in the index.
     *
     * The regex is applied to the file name of the attachment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowservicecatalogconfiguration.html#cfn-kendra-datasource-servicenowservicecatalogconfiguration-includeattachmentfilepatterns
     */
    readonly includeAttachmentFilePatterns?: Array<string>;
  }

  /**
   * Provides the configuration information for crawling knowledge articles in the ServiceNow site.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowknowledgearticleconfiguration.html
   */
  export interface ServiceNowKnowledgeArticleConfigurationProperty {
    /**
     * `TRUE` to index attachments to knowledge articles.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowknowledgearticleconfiguration.html#cfn-kendra-datasource-servicenowknowledgearticleconfiguration-crawlattachments
     */
    readonly crawlAttachments?: boolean | cdk.IResolvable;

    /**
     * The name of the ServiceNow field that is mapped to the index document contents field in the Amazon Kendra index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowknowledgearticleconfiguration.html#cfn-kendra-datasource-servicenowknowledgearticleconfiguration-documentdatafieldname
     */
    readonly documentDataFieldName: string;

    /**
     * The name of the ServiceNow field that is mapped to the index document title field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowknowledgearticleconfiguration.html#cfn-kendra-datasource-servicenowknowledgearticleconfiguration-documenttitlefieldname
     */
    readonly documentTitleFieldName?: string;

    /**
     * A list of regular expression patterns applied to exclude certain knowledge article attachments.
     *
     * Attachments that match the patterns are excluded from the index. Items that don't match the patterns are included in the index. If an item matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the item isn't included in the index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowknowledgearticleconfiguration.html#cfn-kendra-datasource-servicenowknowledgearticleconfiguration-excludeattachmentfilepatterns
     */
    readonly excludeAttachmentFilePatterns?: Array<string>;

    /**
     * Maps attributes or field names of knoweldge articles to Amazon Kendra index field names.
     *
     * To create custom fields, use the `UpdateIndex` API before you map to ServiceNow fields. For more information, see [Mapping data source fields](https://docs.aws.amazon.com/kendra/latest/dg/field-mapping.html) . The ServiceNow data source field names must exist in your ServiceNow custom metadata.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowknowledgearticleconfiguration.html#cfn-kendra-datasource-servicenowknowledgearticleconfiguration-fieldmappings
     */
    readonly fieldMappings?: Array<CfnDataSource.DataSourceToIndexFieldMappingProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * A query that selects the knowledge articles to index.
     *
     * The query can return articles from multiple knowledge bases, and the knowledge bases can be public or private.
     *
     * The query string must be one generated by the ServiceNow console. For more information, see [Specifying documents to index with a query](https://docs.aws.amazon.com/kendra/latest/dg/servicenow-query.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowknowledgearticleconfiguration.html#cfn-kendra-datasource-servicenowknowledgearticleconfiguration-filterquery
     */
    readonly filterQuery?: string;

    /**
     * A list of regular expression patterns applied to include knowledge article attachments.
     *
     * Attachments that match the patterns are included in the index. Items that don't match the patterns are excluded from the index. If an item matches both an inclusion and exclusion pattern, the exclusion pattern takes precedence and the item isn't included in the index.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-datasource-servicenowknowledgearticleconfiguration.html#cfn-kendra-datasource-servicenowknowledgearticleconfiguration-includeattachmentfilepatterns
     */
    readonly includeAttachmentFilePatterns?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnDataSource`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-datasource.html
 */
export interface CfnDataSourceProps {
  /**
   * Configuration information for altering document metadata and content during the document ingestion process.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-datasource.html#cfn-kendra-datasource-customdocumentenrichmentconfiguration
   */
  readonly customDocumentEnrichmentConfiguration?: CfnDataSource.CustomDocumentEnrichmentConfigurationProperty | cdk.IResolvable;

  /**
   * Configuration information for an Amazon Kendra data source.
   *
   * The contents of the configuration depend on the type of data source. You can only specify one type of data source in the configuration.
   *
   * You can't specify the `Configuration` parameter when the `Type` parameter is set to `CUSTOM` .
   *
   * The `Configuration` parameter is required for all other data sources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-datasource.html#cfn-kendra-datasource-datasourceconfiguration
   */
  readonly dataSourceConfiguration?: CfnDataSource.DataSourceConfigurationProperty | cdk.IResolvable;

  /**
   * A description for the data source connector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-datasource.html#cfn-kendra-datasource-description
   */
  readonly description?: string;

  /**
   * The identifier of the index you want to use with the data source connector.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-datasource.html#cfn-kendra-datasource-indexid
   */
  readonly indexId: string;

  /**
   * The code for a language.
   *
   * This shows a supported language for all documents in the data source. English is supported by default. For more information on supported languages, including their codes, see [Adding documents in languages other than English](https://docs.aws.amazon.com/kendra/latest/dg/in-adding-languages.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-datasource.html#cfn-kendra-datasource-languagecode
   */
  readonly languageCode?: string;

  /**
   * The name of the data source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-datasource.html#cfn-kendra-datasource-name
   */
  readonly name: string;

  /**
   * The Amazon Resource Name (ARN) of a role with permission to access the data source.
   *
   * You can't specify the `RoleArn` parameter when the `Type` parameter is set to `CUSTOM` .
   *
   * The `RoleArn` parameter is required for all other data sources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-datasource.html#cfn-kendra-datasource-rolearn
   */
  readonly roleArn?: string;

  /**
   * Sets the frequency that Amazon Kendra checks the documents in your data source and updates the index.
   *
   * If you don't set a schedule, Amazon Kendra doesn't periodically update the index.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-datasource.html#cfn-kendra-datasource-schedule
   */
  readonly schedule?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-datasource.html#cfn-kendra-datasource-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The type of the data source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-datasource.html#cfn-kendra-datasource-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `DocumentAttributeValueProperty`
 *
 * @param properties - the TypeScript properties of a `DocumentAttributeValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceDocumentAttributeValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dateValue", cdk.validateString)(properties.dateValue));
  errors.collect(cdk.propertyValidator("longValue", cdk.validateNumber)(properties.longValue));
  errors.collect(cdk.propertyValidator("stringListValue", cdk.listValidator(cdk.validateString))(properties.stringListValue));
  errors.collect(cdk.propertyValidator("stringValue", cdk.validateString)(properties.stringValue));
  return errors.wrap("supplied properties not correct for \"DocumentAttributeValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceDocumentAttributeValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceDocumentAttributeValuePropertyValidator(properties).assertSuccess();
  return {
    "DateValue": cdk.stringToCloudFormation(properties.dateValue),
    "LongValue": cdk.numberToCloudFormation(properties.longValue),
    "StringListValue": cdk.listMapper(cdk.stringToCloudFormation)(properties.stringListValue),
    "StringValue": cdk.stringToCloudFormation(properties.stringValue)
  };
}

// @ts-ignore TS6133
function CfnDataSourceDocumentAttributeValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DocumentAttributeValueProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DocumentAttributeValueProperty>();
  ret.addPropertyResult("dateValue", "DateValue", (properties.DateValue != null ? cfn_parse.FromCloudFormation.getString(properties.DateValue) : undefined));
  ret.addPropertyResult("longValue", "LongValue", (properties.LongValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.LongValue) : undefined));
  ret.addPropertyResult("stringListValue", "StringListValue", (properties.StringListValue != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StringListValue) : undefined));
  ret.addPropertyResult("stringValue", "StringValue", (properties.StringValue != null ? cfn_parse.FromCloudFormation.getString(properties.StringValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DocumentAttributeConditionProperty`
 *
 * @param properties - the TypeScript properties of a `DocumentAttributeConditionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceDocumentAttributeConditionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("conditionDocumentAttributeKey", cdk.requiredValidator)(properties.conditionDocumentAttributeKey));
  errors.collect(cdk.propertyValidator("conditionDocumentAttributeKey", cdk.validateString)(properties.conditionDocumentAttributeKey));
  errors.collect(cdk.propertyValidator("conditionOnValue", CfnDataSourceDocumentAttributeValuePropertyValidator)(properties.conditionOnValue));
  errors.collect(cdk.propertyValidator("operator", cdk.requiredValidator)(properties.operator));
  errors.collect(cdk.propertyValidator("operator", cdk.validateString)(properties.operator));
  return errors.wrap("supplied properties not correct for \"DocumentAttributeConditionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceDocumentAttributeConditionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceDocumentAttributeConditionPropertyValidator(properties).assertSuccess();
  return {
    "ConditionDocumentAttributeKey": cdk.stringToCloudFormation(properties.conditionDocumentAttributeKey),
    "ConditionOnValue": convertCfnDataSourceDocumentAttributeValuePropertyToCloudFormation(properties.conditionOnValue),
    "Operator": cdk.stringToCloudFormation(properties.operator)
  };
}

// @ts-ignore TS6133
function CfnDataSourceDocumentAttributeConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DocumentAttributeConditionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DocumentAttributeConditionProperty>();
  ret.addPropertyResult("conditionDocumentAttributeKey", "ConditionDocumentAttributeKey", (properties.ConditionDocumentAttributeKey != null ? cfn_parse.FromCloudFormation.getString(properties.ConditionDocumentAttributeKey) : undefined));
  ret.addPropertyResult("conditionOnValue", "ConditionOnValue", (properties.ConditionOnValue != null ? CfnDataSourceDocumentAttributeValuePropertyFromCloudFormation(properties.ConditionOnValue) : undefined));
  ret.addPropertyResult("operator", "Operator", (properties.Operator != null ? cfn_parse.FromCloudFormation.getString(properties.Operator) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DocumentAttributeTargetProperty`
 *
 * @param properties - the TypeScript properties of a `DocumentAttributeTargetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceDocumentAttributeTargetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetDocumentAttributeKey", cdk.requiredValidator)(properties.targetDocumentAttributeKey));
  errors.collect(cdk.propertyValidator("targetDocumentAttributeKey", cdk.validateString)(properties.targetDocumentAttributeKey));
  errors.collect(cdk.propertyValidator("targetDocumentAttributeValue", CfnDataSourceDocumentAttributeValuePropertyValidator)(properties.targetDocumentAttributeValue));
  errors.collect(cdk.propertyValidator("targetDocumentAttributeValueDeletion", cdk.validateBoolean)(properties.targetDocumentAttributeValueDeletion));
  return errors.wrap("supplied properties not correct for \"DocumentAttributeTargetProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceDocumentAttributeTargetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceDocumentAttributeTargetPropertyValidator(properties).assertSuccess();
  return {
    "TargetDocumentAttributeKey": cdk.stringToCloudFormation(properties.targetDocumentAttributeKey),
    "TargetDocumentAttributeValue": convertCfnDataSourceDocumentAttributeValuePropertyToCloudFormation(properties.targetDocumentAttributeValue),
    "TargetDocumentAttributeValueDeletion": cdk.booleanToCloudFormation(properties.targetDocumentAttributeValueDeletion)
  };
}

// @ts-ignore TS6133
function CfnDataSourceDocumentAttributeTargetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DocumentAttributeTargetProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DocumentAttributeTargetProperty>();
  ret.addPropertyResult("targetDocumentAttributeKey", "TargetDocumentAttributeKey", (properties.TargetDocumentAttributeKey != null ? cfn_parse.FromCloudFormation.getString(properties.TargetDocumentAttributeKey) : undefined));
  ret.addPropertyResult("targetDocumentAttributeValue", "TargetDocumentAttributeValue", (properties.TargetDocumentAttributeValue != null ? CfnDataSourceDocumentAttributeValuePropertyFromCloudFormation(properties.TargetDocumentAttributeValue) : undefined));
  ret.addPropertyResult("targetDocumentAttributeValueDeletion", "TargetDocumentAttributeValueDeletion", (properties.TargetDocumentAttributeValueDeletion != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TargetDocumentAttributeValueDeletion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InlineCustomDocumentEnrichmentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `InlineCustomDocumentEnrichmentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceInlineCustomDocumentEnrichmentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("condition", CfnDataSourceDocumentAttributeConditionPropertyValidator)(properties.condition));
  errors.collect(cdk.propertyValidator("documentContentDeletion", cdk.validateBoolean)(properties.documentContentDeletion));
  errors.collect(cdk.propertyValidator("target", CfnDataSourceDocumentAttributeTargetPropertyValidator)(properties.target));
  return errors.wrap("supplied properties not correct for \"InlineCustomDocumentEnrichmentConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceInlineCustomDocumentEnrichmentConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceInlineCustomDocumentEnrichmentConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Condition": convertCfnDataSourceDocumentAttributeConditionPropertyToCloudFormation(properties.condition),
    "DocumentContentDeletion": cdk.booleanToCloudFormation(properties.documentContentDeletion),
    "Target": convertCfnDataSourceDocumentAttributeTargetPropertyToCloudFormation(properties.target)
  };
}

// @ts-ignore TS6133
function CfnDataSourceInlineCustomDocumentEnrichmentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.InlineCustomDocumentEnrichmentConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.InlineCustomDocumentEnrichmentConfigurationProperty>();
  ret.addPropertyResult("condition", "Condition", (properties.Condition != null ? CfnDataSourceDocumentAttributeConditionPropertyFromCloudFormation(properties.Condition) : undefined));
  ret.addPropertyResult("documentContentDeletion", "DocumentContentDeletion", (properties.DocumentContentDeletion != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DocumentContentDeletion) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? CfnDataSourceDocumentAttributeTargetPropertyFromCloudFormation(properties.Target) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HookConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `HookConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceHookConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("invocationCondition", CfnDataSourceDocumentAttributeConditionPropertyValidator)(properties.invocationCondition));
  errors.collect(cdk.propertyValidator("lambdaArn", cdk.requiredValidator)(properties.lambdaArn));
  errors.collect(cdk.propertyValidator("lambdaArn", cdk.validateString)(properties.lambdaArn));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.requiredValidator)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.validateString)(properties.s3Bucket));
  return errors.wrap("supplied properties not correct for \"HookConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceHookConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceHookConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "InvocationCondition": convertCfnDataSourceDocumentAttributeConditionPropertyToCloudFormation(properties.invocationCondition),
    "LambdaArn": cdk.stringToCloudFormation(properties.lambdaArn),
    "S3Bucket": cdk.stringToCloudFormation(properties.s3Bucket)
  };
}

// @ts-ignore TS6133
function CfnDataSourceHookConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.HookConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.HookConfigurationProperty>();
  ret.addPropertyResult("invocationCondition", "InvocationCondition", (properties.InvocationCondition != null ? CfnDataSourceDocumentAttributeConditionPropertyFromCloudFormation(properties.InvocationCondition) : undefined));
  ret.addPropertyResult("lambdaArn", "LambdaArn", (properties.LambdaArn != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaArn) : undefined));
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.S3Bucket) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomDocumentEnrichmentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CustomDocumentEnrichmentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceCustomDocumentEnrichmentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("inlineConfigurations", cdk.listValidator(CfnDataSourceInlineCustomDocumentEnrichmentConfigurationPropertyValidator))(properties.inlineConfigurations));
  errors.collect(cdk.propertyValidator("postExtractionHookConfiguration", CfnDataSourceHookConfigurationPropertyValidator)(properties.postExtractionHookConfiguration));
  errors.collect(cdk.propertyValidator("preExtractionHookConfiguration", CfnDataSourceHookConfigurationPropertyValidator)(properties.preExtractionHookConfiguration));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CustomDocumentEnrichmentConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceCustomDocumentEnrichmentConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceCustomDocumentEnrichmentConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "InlineConfigurations": cdk.listMapper(convertCfnDataSourceInlineCustomDocumentEnrichmentConfigurationPropertyToCloudFormation)(properties.inlineConfigurations),
    "PostExtractionHookConfiguration": convertCfnDataSourceHookConfigurationPropertyToCloudFormation(properties.postExtractionHookConfiguration),
    "PreExtractionHookConfiguration": convertCfnDataSourceHookConfigurationPropertyToCloudFormation(properties.preExtractionHookConfiguration),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnDataSourceCustomDocumentEnrichmentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.CustomDocumentEnrichmentConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.CustomDocumentEnrichmentConfigurationProperty>();
  ret.addPropertyResult("inlineConfigurations", "InlineConfigurations", (properties.InlineConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceInlineCustomDocumentEnrichmentConfigurationPropertyFromCloudFormation)(properties.InlineConfigurations) : undefined));
  ret.addPropertyResult("postExtractionHookConfiguration", "PostExtractionHookConfiguration", (properties.PostExtractionHookConfiguration != null ? CfnDataSourceHookConfigurationPropertyFromCloudFormation(properties.PostExtractionHookConfiguration) : undefined));
  ret.addPropertyResult("preExtractionHookConfiguration", "PreExtractionHookConfiguration", (properties.PreExtractionHookConfiguration != null ? CfnDataSourceHookConfigurationPropertyFromCloudFormation(properties.PreExtractionHookConfiguration) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataSourceToIndexFieldMappingProperty`
 *
 * @param properties - the TypeScript properties of a `DataSourceToIndexFieldMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceDataSourceToIndexFieldMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataSourceFieldName", cdk.requiredValidator)(properties.dataSourceFieldName));
  errors.collect(cdk.propertyValidator("dataSourceFieldName", cdk.validateString)(properties.dataSourceFieldName));
  errors.collect(cdk.propertyValidator("dateFieldFormat", cdk.validateString)(properties.dateFieldFormat));
  errors.collect(cdk.propertyValidator("indexFieldName", cdk.requiredValidator)(properties.indexFieldName));
  errors.collect(cdk.propertyValidator("indexFieldName", cdk.validateString)(properties.indexFieldName));
  return errors.wrap("supplied properties not correct for \"DataSourceToIndexFieldMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceDataSourceToIndexFieldMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceDataSourceToIndexFieldMappingPropertyValidator(properties).assertSuccess();
  return {
    "DataSourceFieldName": cdk.stringToCloudFormation(properties.dataSourceFieldName),
    "DateFieldFormat": cdk.stringToCloudFormation(properties.dateFieldFormat),
    "IndexFieldName": cdk.stringToCloudFormation(properties.indexFieldName)
  };
}

// @ts-ignore TS6133
function CfnDataSourceDataSourceToIndexFieldMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DataSourceToIndexFieldMappingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DataSourceToIndexFieldMappingProperty>();
  ret.addPropertyResult("dataSourceFieldName", "DataSourceFieldName", (properties.DataSourceFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DataSourceFieldName) : undefined));
  ret.addPropertyResult("dateFieldFormat", "DateFieldFormat", (properties.DateFieldFormat != null ? cfn_parse.FromCloudFormation.getString(properties.DateFieldFormat) : undefined));
  ret.addPropertyResult("indexFieldName", "IndexFieldName", (properties.IndexFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.IndexFieldName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GoogleDriveConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `GoogleDriveConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceGoogleDriveConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("excludeMimeTypes", cdk.listValidator(cdk.validateString))(properties.excludeMimeTypes));
  errors.collect(cdk.propertyValidator("excludeSharedDrives", cdk.listValidator(cdk.validateString))(properties.excludeSharedDrives));
  errors.collect(cdk.propertyValidator("excludeUserAccounts", cdk.listValidator(cdk.validateString))(properties.excludeUserAccounts));
  errors.collect(cdk.propertyValidator("exclusionPatterns", cdk.listValidator(cdk.validateString))(properties.exclusionPatterns));
  errors.collect(cdk.propertyValidator("fieldMappings", cdk.listValidator(CfnDataSourceDataSourceToIndexFieldMappingPropertyValidator))(properties.fieldMappings));
  errors.collect(cdk.propertyValidator("inclusionPatterns", cdk.listValidator(cdk.validateString))(properties.inclusionPatterns));
  errors.collect(cdk.propertyValidator("secretArn", cdk.requiredValidator)(properties.secretArn));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  return errors.wrap("supplied properties not correct for \"GoogleDriveConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceGoogleDriveConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceGoogleDriveConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ExcludeMimeTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludeMimeTypes),
    "ExcludeSharedDrives": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludeSharedDrives),
    "ExcludeUserAccounts": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludeUserAccounts),
    "ExclusionPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.exclusionPatterns),
    "FieldMappings": cdk.listMapper(convertCfnDataSourceDataSourceToIndexFieldMappingPropertyToCloudFormation)(properties.fieldMappings),
    "InclusionPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.inclusionPatterns),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn)
  };
}

// @ts-ignore TS6133
function CfnDataSourceGoogleDriveConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.GoogleDriveConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.GoogleDriveConfigurationProperty>();
  ret.addPropertyResult("excludeMimeTypes", "ExcludeMimeTypes", (properties.ExcludeMimeTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludeMimeTypes) : undefined));
  ret.addPropertyResult("excludeSharedDrives", "ExcludeSharedDrives", (properties.ExcludeSharedDrives != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludeSharedDrives) : undefined));
  ret.addPropertyResult("excludeUserAccounts", "ExcludeUserAccounts", (properties.ExcludeUserAccounts != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludeUserAccounts) : undefined));
  ret.addPropertyResult("exclusionPatterns", "ExclusionPatterns", (properties.ExclusionPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExclusionPatterns) : undefined));
  ret.addPropertyResult("fieldMappings", "FieldMappings", (properties.FieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceDataSourceToIndexFieldMappingPropertyFromCloudFormation)(properties.FieldMappings) : undefined));
  ret.addPropertyResult("inclusionPatterns", "InclusionPatterns", (properties.InclusionPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InclusionPatterns) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WebCrawlerBasicAuthenticationProperty`
 *
 * @param properties - the TypeScript properties of a `WebCrawlerBasicAuthenticationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceWebCrawlerBasicAuthenticationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("credentials", cdk.requiredValidator)(properties.credentials));
  errors.collect(cdk.propertyValidator("credentials", cdk.validateString)(properties.credentials));
  errors.collect(cdk.propertyValidator("host", cdk.requiredValidator)(properties.host));
  errors.collect(cdk.propertyValidator("host", cdk.validateString)(properties.host));
  errors.collect(cdk.propertyValidator("port", cdk.requiredValidator)(properties.port));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  return errors.wrap("supplied properties not correct for \"WebCrawlerBasicAuthenticationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceWebCrawlerBasicAuthenticationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceWebCrawlerBasicAuthenticationPropertyValidator(properties).assertSuccess();
  return {
    "Credentials": cdk.stringToCloudFormation(properties.credentials),
    "Host": cdk.stringToCloudFormation(properties.host),
    "Port": cdk.numberToCloudFormation(properties.port)
  };
}

// @ts-ignore TS6133
function CfnDataSourceWebCrawlerBasicAuthenticationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.WebCrawlerBasicAuthenticationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.WebCrawlerBasicAuthenticationProperty>();
  ret.addPropertyResult("credentials", "Credentials", (properties.Credentials != null ? cfn_parse.FromCloudFormation.getString(properties.Credentials) : undefined));
  ret.addPropertyResult("host", "Host", (properties.Host != null ? cfn_parse.FromCloudFormation.getString(properties.Host) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WebCrawlerAuthenticationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WebCrawlerAuthenticationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceWebCrawlerAuthenticationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("basicAuthentication", cdk.listValidator(CfnDataSourceWebCrawlerBasicAuthenticationPropertyValidator))(properties.basicAuthentication));
  return errors.wrap("supplied properties not correct for \"WebCrawlerAuthenticationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceWebCrawlerAuthenticationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceWebCrawlerAuthenticationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BasicAuthentication": cdk.listMapper(convertCfnDataSourceWebCrawlerBasicAuthenticationPropertyToCloudFormation)(properties.basicAuthentication)
  };
}

// @ts-ignore TS6133
function CfnDataSourceWebCrawlerAuthenticationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.WebCrawlerAuthenticationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.WebCrawlerAuthenticationConfigurationProperty>();
  ret.addPropertyResult("basicAuthentication", "BasicAuthentication", (properties.BasicAuthentication != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceWebCrawlerBasicAuthenticationPropertyFromCloudFormation)(properties.BasicAuthentication) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProxyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ProxyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceProxyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("credentials", cdk.validateString)(properties.credentials));
  errors.collect(cdk.propertyValidator("host", cdk.requiredValidator)(properties.host));
  errors.collect(cdk.propertyValidator("host", cdk.validateString)(properties.host));
  errors.collect(cdk.propertyValidator("port", cdk.requiredValidator)(properties.port));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  return errors.wrap("supplied properties not correct for \"ProxyConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceProxyConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceProxyConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Credentials": cdk.stringToCloudFormation(properties.credentials),
    "Host": cdk.stringToCloudFormation(properties.host),
    "Port": cdk.numberToCloudFormation(properties.port)
  };
}

// @ts-ignore TS6133
function CfnDataSourceProxyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.ProxyConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ProxyConfigurationProperty>();
  ret.addPropertyResult("credentials", "Credentials", (properties.Credentials != null ? cfn_parse.FromCloudFormation.getString(properties.Credentials) : undefined));
  ret.addPropertyResult("host", "Host", (properties.Host != null ? cfn_parse.FromCloudFormation.getString(properties.Host) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WebCrawlerSiteMapsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WebCrawlerSiteMapsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceWebCrawlerSiteMapsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("siteMaps", cdk.requiredValidator)(properties.siteMaps));
  errors.collect(cdk.propertyValidator("siteMaps", cdk.listValidator(cdk.validateString))(properties.siteMaps));
  return errors.wrap("supplied properties not correct for \"WebCrawlerSiteMapsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceWebCrawlerSiteMapsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceWebCrawlerSiteMapsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "SiteMaps": cdk.listMapper(cdk.stringToCloudFormation)(properties.siteMaps)
  };
}

// @ts-ignore TS6133
function CfnDataSourceWebCrawlerSiteMapsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.WebCrawlerSiteMapsConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.WebCrawlerSiteMapsConfigurationProperty>();
  ret.addPropertyResult("siteMaps", "SiteMaps", (properties.SiteMaps != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SiteMaps) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WebCrawlerSeedUrlConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WebCrawlerSeedUrlConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceWebCrawlerSeedUrlConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("seedUrls", cdk.requiredValidator)(properties.seedUrls));
  errors.collect(cdk.propertyValidator("seedUrls", cdk.listValidator(cdk.validateString))(properties.seedUrls));
  errors.collect(cdk.propertyValidator("webCrawlerMode", cdk.validateString)(properties.webCrawlerMode));
  return errors.wrap("supplied properties not correct for \"WebCrawlerSeedUrlConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceWebCrawlerSeedUrlConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceWebCrawlerSeedUrlConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "SeedUrls": cdk.listMapper(cdk.stringToCloudFormation)(properties.seedUrls),
    "WebCrawlerMode": cdk.stringToCloudFormation(properties.webCrawlerMode)
  };
}

// @ts-ignore TS6133
function CfnDataSourceWebCrawlerSeedUrlConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.WebCrawlerSeedUrlConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.WebCrawlerSeedUrlConfigurationProperty>();
  ret.addPropertyResult("seedUrls", "SeedUrls", (properties.SeedUrls != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SeedUrls) : undefined));
  ret.addPropertyResult("webCrawlerMode", "WebCrawlerMode", (properties.WebCrawlerMode != null ? cfn_parse.FromCloudFormation.getString(properties.WebCrawlerMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WebCrawlerUrlsProperty`
 *
 * @param properties - the TypeScript properties of a `WebCrawlerUrlsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceWebCrawlerUrlsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("seedUrlConfiguration", CfnDataSourceWebCrawlerSeedUrlConfigurationPropertyValidator)(properties.seedUrlConfiguration));
  errors.collect(cdk.propertyValidator("siteMapsConfiguration", CfnDataSourceWebCrawlerSiteMapsConfigurationPropertyValidator)(properties.siteMapsConfiguration));
  return errors.wrap("supplied properties not correct for \"WebCrawlerUrlsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceWebCrawlerUrlsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceWebCrawlerUrlsPropertyValidator(properties).assertSuccess();
  return {
    "SeedUrlConfiguration": convertCfnDataSourceWebCrawlerSeedUrlConfigurationPropertyToCloudFormation(properties.seedUrlConfiguration),
    "SiteMapsConfiguration": convertCfnDataSourceWebCrawlerSiteMapsConfigurationPropertyToCloudFormation(properties.siteMapsConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDataSourceWebCrawlerUrlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.WebCrawlerUrlsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.WebCrawlerUrlsProperty>();
  ret.addPropertyResult("seedUrlConfiguration", "SeedUrlConfiguration", (properties.SeedUrlConfiguration != null ? CfnDataSourceWebCrawlerSeedUrlConfigurationPropertyFromCloudFormation(properties.SeedUrlConfiguration) : undefined));
  ret.addPropertyResult("siteMapsConfiguration", "SiteMapsConfiguration", (properties.SiteMapsConfiguration != null ? CfnDataSourceWebCrawlerSiteMapsConfigurationPropertyFromCloudFormation(properties.SiteMapsConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WebCrawlerConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WebCrawlerConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceWebCrawlerConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationConfiguration", CfnDataSourceWebCrawlerAuthenticationConfigurationPropertyValidator)(properties.authenticationConfiguration));
  errors.collect(cdk.propertyValidator("crawlDepth", cdk.validateNumber)(properties.crawlDepth));
  errors.collect(cdk.propertyValidator("maxContentSizePerPageInMegaBytes", cdk.validateNumber)(properties.maxContentSizePerPageInMegaBytes));
  errors.collect(cdk.propertyValidator("maxLinksPerPage", cdk.validateNumber)(properties.maxLinksPerPage));
  errors.collect(cdk.propertyValidator("maxUrlsPerMinuteCrawlRate", cdk.validateNumber)(properties.maxUrlsPerMinuteCrawlRate));
  errors.collect(cdk.propertyValidator("proxyConfiguration", CfnDataSourceProxyConfigurationPropertyValidator)(properties.proxyConfiguration));
  errors.collect(cdk.propertyValidator("urlExclusionPatterns", cdk.listValidator(cdk.validateString))(properties.urlExclusionPatterns));
  errors.collect(cdk.propertyValidator("urlInclusionPatterns", cdk.listValidator(cdk.validateString))(properties.urlInclusionPatterns));
  errors.collect(cdk.propertyValidator("urls", cdk.requiredValidator)(properties.urls));
  errors.collect(cdk.propertyValidator("urls", CfnDataSourceWebCrawlerUrlsPropertyValidator)(properties.urls));
  return errors.wrap("supplied properties not correct for \"WebCrawlerConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceWebCrawlerConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceWebCrawlerConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AuthenticationConfiguration": convertCfnDataSourceWebCrawlerAuthenticationConfigurationPropertyToCloudFormation(properties.authenticationConfiguration),
    "CrawlDepth": cdk.numberToCloudFormation(properties.crawlDepth),
    "MaxContentSizePerPageInMegaBytes": cdk.numberToCloudFormation(properties.maxContentSizePerPageInMegaBytes),
    "MaxLinksPerPage": cdk.numberToCloudFormation(properties.maxLinksPerPage),
    "MaxUrlsPerMinuteCrawlRate": cdk.numberToCloudFormation(properties.maxUrlsPerMinuteCrawlRate),
    "ProxyConfiguration": convertCfnDataSourceProxyConfigurationPropertyToCloudFormation(properties.proxyConfiguration),
    "UrlExclusionPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.urlExclusionPatterns),
    "UrlInclusionPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.urlInclusionPatterns),
    "Urls": convertCfnDataSourceWebCrawlerUrlsPropertyToCloudFormation(properties.urls)
  };
}

// @ts-ignore TS6133
function CfnDataSourceWebCrawlerConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.WebCrawlerConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.WebCrawlerConfigurationProperty>();
  ret.addPropertyResult("authenticationConfiguration", "AuthenticationConfiguration", (properties.AuthenticationConfiguration != null ? CfnDataSourceWebCrawlerAuthenticationConfigurationPropertyFromCloudFormation(properties.AuthenticationConfiguration) : undefined));
  ret.addPropertyResult("crawlDepth", "CrawlDepth", (properties.CrawlDepth != null ? cfn_parse.FromCloudFormation.getNumber(properties.CrawlDepth) : undefined));
  ret.addPropertyResult("maxContentSizePerPageInMegaBytes", "MaxContentSizePerPageInMegaBytes", (properties.MaxContentSizePerPageInMegaBytes != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxContentSizePerPageInMegaBytes) : undefined));
  ret.addPropertyResult("maxLinksPerPage", "MaxLinksPerPage", (properties.MaxLinksPerPage != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxLinksPerPage) : undefined));
  ret.addPropertyResult("maxUrlsPerMinuteCrawlRate", "MaxUrlsPerMinuteCrawlRate", (properties.MaxUrlsPerMinuteCrawlRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxUrlsPerMinuteCrawlRate) : undefined));
  ret.addPropertyResult("proxyConfiguration", "ProxyConfiguration", (properties.ProxyConfiguration != null ? CfnDataSourceProxyConfigurationPropertyFromCloudFormation(properties.ProxyConfiguration) : undefined));
  ret.addPropertyResult("urlExclusionPatterns", "UrlExclusionPatterns", (properties.UrlExclusionPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.UrlExclusionPatterns) : undefined));
  ret.addPropertyResult("urlInclusionPatterns", "UrlInclusionPatterns", (properties.UrlInclusionPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.UrlInclusionPatterns) : undefined));
  ret.addPropertyResult("urls", "Urls", (properties.Urls != null ? CfnDataSourceWebCrawlerUrlsPropertyFromCloudFormation(properties.Urls) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessControlListConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AccessControlListConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceAccessControlListConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyPath", cdk.validateString)(properties.keyPath));
  return errors.wrap("supplied properties not correct for \"AccessControlListConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceAccessControlListConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceAccessControlListConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "KeyPath": cdk.stringToCloudFormation(properties.keyPath)
  };
}

// @ts-ignore TS6133
function CfnDataSourceAccessControlListConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.AccessControlListConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.AccessControlListConfigurationProperty>();
  ret.addPropertyResult("keyPath", "KeyPath", (properties.KeyPath != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DocumentsMetadataConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DocumentsMetadataConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceDocumentsMetadataConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Prefix", cdk.validateString)(properties.s3Prefix));
  return errors.wrap("supplied properties not correct for \"DocumentsMetadataConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceDocumentsMetadataConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceDocumentsMetadataConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "S3Prefix": cdk.stringToCloudFormation(properties.s3Prefix)
  };
}

// @ts-ignore TS6133
function CfnDataSourceDocumentsMetadataConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DocumentsMetadataConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DocumentsMetadataConfigurationProperty>();
  ret.addPropertyResult("s3Prefix", "S3Prefix", (properties.S3Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3Prefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3DataSourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `S3DataSourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceS3DataSourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessControlListConfiguration", CfnDataSourceAccessControlListConfigurationPropertyValidator)(properties.accessControlListConfiguration));
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("documentsMetadataConfiguration", CfnDataSourceDocumentsMetadataConfigurationPropertyValidator)(properties.documentsMetadataConfiguration));
  errors.collect(cdk.propertyValidator("exclusionPatterns", cdk.listValidator(cdk.validateString))(properties.exclusionPatterns));
  errors.collect(cdk.propertyValidator("inclusionPatterns", cdk.listValidator(cdk.validateString))(properties.inclusionPatterns));
  errors.collect(cdk.propertyValidator("inclusionPrefixes", cdk.listValidator(cdk.validateString))(properties.inclusionPrefixes));
  return errors.wrap("supplied properties not correct for \"S3DataSourceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceS3DataSourceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceS3DataSourceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AccessControlListConfiguration": convertCfnDataSourceAccessControlListConfigurationPropertyToCloudFormation(properties.accessControlListConfiguration),
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "DocumentsMetadataConfiguration": convertCfnDataSourceDocumentsMetadataConfigurationPropertyToCloudFormation(properties.documentsMetadataConfiguration),
    "ExclusionPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.exclusionPatterns),
    "InclusionPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.inclusionPatterns),
    "InclusionPrefixes": cdk.listMapper(cdk.stringToCloudFormation)(properties.inclusionPrefixes)
  };
}

// @ts-ignore TS6133
function CfnDataSourceS3DataSourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.S3DataSourceConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.S3DataSourceConfigurationProperty>();
  ret.addPropertyResult("accessControlListConfiguration", "AccessControlListConfiguration", (properties.AccessControlListConfiguration != null ? CfnDataSourceAccessControlListConfigurationPropertyFromCloudFormation(properties.AccessControlListConfiguration) : undefined));
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("documentsMetadataConfiguration", "DocumentsMetadataConfiguration", (properties.DocumentsMetadataConfiguration != null ? CfnDataSourceDocumentsMetadataConfigurationPropertyFromCloudFormation(properties.DocumentsMetadataConfiguration) : undefined));
  ret.addPropertyResult("exclusionPatterns", "ExclusionPatterns", (properties.ExclusionPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExclusionPatterns) : undefined));
  ret.addPropertyResult("inclusionPatterns", "InclusionPatterns", (properties.InclusionPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InclusionPatterns) : undefined));
  ret.addPropertyResult("inclusionPrefixes", "InclusionPrefixes", (properties.InclusionPrefixes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InclusionPrefixes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SalesforceStandardObjectConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SalesforceStandardObjectConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceSalesforceStandardObjectConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("documentDataFieldName", cdk.requiredValidator)(properties.documentDataFieldName));
  errors.collect(cdk.propertyValidator("documentDataFieldName", cdk.validateString)(properties.documentDataFieldName));
  errors.collect(cdk.propertyValidator("documentTitleFieldName", cdk.validateString)(properties.documentTitleFieldName));
  errors.collect(cdk.propertyValidator("fieldMappings", cdk.listValidator(CfnDataSourceDataSourceToIndexFieldMappingPropertyValidator))(properties.fieldMappings));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"SalesforceStandardObjectConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceSalesforceStandardObjectConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceSalesforceStandardObjectConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DocumentDataFieldName": cdk.stringToCloudFormation(properties.documentDataFieldName),
    "DocumentTitleFieldName": cdk.stringToCloudFormation(properties.documentTitleFieldName),
    "FieldMappings": cdk.listMapper(convertCfnDataSourceDataSourceToIndexFieldMappingPropertyToCloudFormation)(properties.fieldMappings),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnDataSourceSalesforceStandardObjectConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.SalesforceStandardObjectConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.SalesforceStandardObjectConfigurationProperty>();
  ret.addPropertyResult("documentDataFieldName", "DocumentDataFieldName", (properties.DocumentDataFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentDataFieldName) : undefined));
  ret.addPropertyResult("documentTitleFieldName", "DocumentTitleFieldName", (properties.DocumentTitleFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentTitleFieldName) : undefined));
  ret.addPropertyResult("fieldMappings", "FieldMappings", (properties.FieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceDataSourceToIndexFieldMappingPropertyFromCloudFormation)(properties.FieldMappings) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SalesforceStandardObjectAttachmentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SalesforceStandardObjectAttachmentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceSalesforceStandardObjectAttachmentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("documentTitleFieldName", cdk.validateString)(properties.documentTitleFieldName));
  errors.collect(cdk.propertyValidator("fieldMappings", cdk.listValidator(CfnDataSourceDataSourceToIndexFieldMappingPropertyValidator))(properties.fieldMappings));
  return errors.wrap("supplied properties not correct for \"SalesforceStandardObjectAttachmentConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceSalesforceStandardObjectAttachmentConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceSalesforceStandardObjectAttachmentConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DocumentTitleFieldName": cdk.stringToCloudFormation(properties.documentTitleFieldName),
    "FieldMappings": cdk.listMapper(convertCfnDataSourceDataSourceToIndexFieldMappingPropertyToCloudFormation)(properties.fieldMappings)
  };
}

// @ts-ignore TS6133
function CfnDataSourceSalesforceStandardObjectAttachmentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.SalesforceStandardObjectAttachmentConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.SalesforceStandardObjectAttachmentConfigurationProperty>();
  ret.addPropertyResult("documentTitleFieldName", "DocumentTitleFieldName", (properties.DocumentTitleFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentTitleFieldName) : undefined));
  ret.addPropertyResult("fieldMappings", "FieldMappings", (properties.FieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceDataSourceToIndexFieldMappingPropertyFromCloudFormation)(properties.FieldMappings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SalesforceChatterFeedConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SalesforceChatterFeedConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceSalesforceChatterFeedConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("documentDataFieldName", cdk.requiredValidator)(properties.documentDataFieldName));
  errors.collect(cdk.propertyValidator("documentDataFieldName", cdk.validateString)(properties.documentDataFieldName));
  errors.collect(cdk.propertyValidator("documentTitleFieldName", cdk.validateString)(properties.documentTitleFieldName));
  errors.collect(cdk.propertyValidator("fieldMappings", cdk.listValidator(CfnDataSourceDataSourceToIndexFieldMappingPropertyValidator))(properties.fieldMappings));
  errors.collect(cdk.propertyValidator("includeFilterTypes", cdk.listValidator(cdk.validateString))(properties.includeFilterTypes));
  return errors.wrap("supplied properties not correct for \"SalesforceChatterFeedConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceSalesforceChatterFeedConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceSalesforceChatterFeedConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DocumentDataFieldName": cdk.stringToCloudFormation(properties.documentDataFieldName),
    "DocumentTitleFieldName": cdk.stringToCloudFormation(properties.documentTitleFieldName),
    "FieldMappings": cdk.listMapper(convertCfnDataSourceDataSourceToIndexFieldMappingPropertyToCloudFormation)(properties.fieldMappings),
    "IncludeFilterTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.includeFilterTypes)
  };
}

// @ts-ignore TS6133
function CfnDataSourceSalesforceChatterFeedConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.SalesforceChatterFeedConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.SalesforceChatterFeedConfigurationProperty>();
  ret.addPropertyResult("documentDataFieldName", "DocumentDataFieldName", (properties.DocumentDataFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentDataFieldName) : undefined));
  ret.addPropertyResult("documentTitleFieldName", "DocumentTitleFieldName", (properties.DocumentTitleFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentTitleFieldName) : undefined));
  ret.addPropertyResult("fieldMappings", "FieldMappings", (properties.FieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceDataSourceToIndexFieldMappingPropertyFromCloudFormation)(properties.FieldMappings) : undefined));
  ret.addPropertyResult("includeFilterTypes", "IncludeFilterTypes", (properties.IncludeFilterTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludeFilterTypes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SalesforceStandardKnowledgeArticleTypeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SalesforceStandardKnowledgeArticleTypeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceSalesforceStandardKnowledgeArticleTypeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("documentDataFieldName", cdk.requiredValidator)(properties.documentDataFieldName));
  errors.collect(cdk.propertyValidator("documentDataFieldName", cdk.validateString)(properties.documentDataFieldName));
  errors.collect(cdk.propertyValidator("documentTitleFieldName", cdk.validateString)(properties.documentTitleFieldName));
  errors.collect(cdk.propertyValidator("fieldMappings", cdk.listValidator(CfnDataSourceDataSourceToIndexFieldMappingPropertyValidator))(properties.fieldMappings));
  return errors.wrap("supplied properties not correct for \"SalesforceStandardKnowledgeArticleTypeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceSalesforceStandardKnowledgeArticleTypeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceSalesforceStandardKnowledgeArticleTypeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DocumentDataFieldName": cdk.stringToCloudFormation(properties.documentDataFieldName),
    "DocumentTitleFieldName": cdk.stringToCloudFormation(properties.documentTitleFieldName),
    "FieldMappings": cdk.listMapper(convertCfnDataSourceDataSourceToIndexFieldMappingPropertyToCloudFormation)(properties.fieldMappings)
  };
}

// @ts-ignore TS6133
function CfnDataSourceSalesforceStandardKnowledgeArticleTypeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.SalesforceStandardKnowledgeArticleTypeConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.SalesforceStandardKnowledgeArticleTypeConfigurationProperty>();
  ret.addPropertyResult("documentDataFieldName", "DocumentDataFieldName", (properties.DocumentDataFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentDataFieldName) : undefined));
  ret.addPropertyResult("documentTitleFieldName", "DocumentTitleFieldName", (properties.DocumentTitleFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentTitleFieldName) : undefined));
  ret.addPropertyResult("fieldMappings", "FieldMappings", (properties.FieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceDataSourceToIndexFieldMappingPropertyFromCloudFormation)(properties.FieldMappings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SalesforceCustomKnowledgeArticleTypeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SalesforceCustomKnowledgeArticleTypeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceSalesforceCustomKnowledgeArticleTypeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("documentDataFieldName", cdk.requiredValidator)(properties.documentDataFieldName));
  errors.collect(cdk.propertyValidator("documentDataFieldName", cdk.validateString)(properties.documentDataFieldName));
  errors.collect(cdk.propertyValidator("documentTitleFieldName", cdk.validateString)(properties.documentTitleFieldName));
  errors.collect(cdk.propertyValidator("fieldMappings", cdk.listValidator(CfnDataSourceDataSourceToIndexFieldMappingPropertyValidator))(properties.fieldMappings));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"SalesforceCustomKnowledgeArticleTypeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceSalesforceCustomKnowledgeArticleTypeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceSalesforceCustomKnowledgeArticleTypeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DocumentDataFieldName": cdk.stringToCloudFormation(properties.documentDataFieldName),
    "DocumentTitleFieldName": cdk.stringToCloudFormation(properties.documentTitleFieldName),
    "FieldMappings": cdk.listMapper(convertCfnDataSourceDataSourceToIndexFieldMappingPropertyToCloudFormation)(properties.fieldMappings),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnDataSourceSalesforceCustomKnowledgeArticleTypeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.SalesforceCustomKnowledgeArticleTypeConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.SalesforceCustomKnowledgeArticleTypeConfigurationProperty>();
  ret.addPropertyResult("documentDataFieldName", "DocumentDataFieldName", (properties.DocumentDataFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentDataFieldName) : undefined));
  ret.addPropertyResult("documentTitleFieldName", "DocumentTitleFieldName", (properties.DocumentTitleFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentTitleFieldName) : undefined));
  ret.addPropertyResult("fieldMappings", "FieldMappings", (properties.FieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceDataSourceToIndexFieldMappingPropertyFromCloudFormation)(properties.FieldMappings) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SalesforceKnowledgeArticleConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SalesforceKnowledgeArticleConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceSalesforceKnowledgeArticleConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customKnowledgeArticleTypeConfigurations", cdk.listValidator(CfnDataSourceSalesforceCustomKnowledgeArticleTypeConfigurationPropertyValidator))(properties.customKnowledgeArticleTypeConfigurations));
  errors.collect(cdk.propertyValidator("includedStates", cdk.requiredValidator)(properties.includedStates));
  errors.collect(cdk.propertyValidator("includedStates", cdk.listValidator(cdk.validateString))(properties.includedStates));
  errors.collect(cdk.propertyValidator("standardKnowledgeArticleTypeConfiguration", CfnDataSourceSalesforceStandardKnowledgeArticleTypeConfigurationPropertyValidator)(properties.standardKnowledgeArticleTypeConfiguration));
  return errors.wrap("supplied properties not correct for \"SalesforceKnowledgeArticleConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceSalesforceKnowledgeArticleConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceSalesforceKnowledgeArticleConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CustomKnowledgeArticleTypeConfigurations": cdk.listMapper(convertCfnDataSourceSalesforceCustomKnowledgeArticleTypeConfigurationPropertyToCloudFormation)(properties.customKnowledgeArticleTypeConfigurations),
    "IncludedStates": cdk.listMapper(cdk.stringToCloudFormation)(properties.includedStates),
    "StandardKnowledgeArticleTypeConfiguration": convertCfnDataSourceSalesforceStandardKnowledgeArticleTypeConfigurationPropertyToCloudFormation(properties.standardKnowledgeArticleTypeConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDataSourceSalesforceKnowledgeArticleConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.SalesforceKnowledgeArticleConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.SalesforceKnowledgeArticleConfigurationProperty>();
  ret.addPropertyResult("customKnowledgeArticleTypeConfigurations", "CustomKnowledgeArticleTypeConfigurations", (properties.CustomKnowledgeArticleTypeConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceSalesforceCustomKnowledgeArticleTypeConfigurationPropertyFromCloudFormation)(properties.CustomKnowledgeArticleTypeConfigurations) : undefined));
  ret.addPropertyResult("includedStates", "IncludedStates", (properties.IncludedStates != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludedStates) : undefined));
  ret.addPropertyResult("standardKnowledgeArticleTypeConfiguration", "StandardKnowledgeArticleTypeConfiguration", (properties.StandardKnowledgeArticleTypeConfiguration != null ? CfnDataSourceSalesforceStandardKnowledgeArticleTypeConfigurationPropertyFromCloudFormation(properties.StandardKnowledgeArticleTypeConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SalesforceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SalesforceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceSalesforceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("chatterFeedConfiguration", CfnDataSourceSalesforceChatterFeedConfigurationPropertyValidator)(properties.chatterFeedConfiguration));
  errors.collect(cdk.propertyValidator("crawlAttachments", cdk.validateBoolean)(properties.crawlAttachments));
  errors.collect(cdk.propertyValidator("excludeAttachmentFilePatterns", cdk.listValidator(cdk.validateString))(properties.excludeAttachmentFilePatterns));
  errors.collect(cdk.propertyValidator("includeAttachmentFilePatterns", cdk.listValidator(cdk.validateString))(properties.includeAttachmentFilePatterns));
  errors.collect(cdk.propertyValidator("knowledgeArticleConfiguration", CfnDataSourceSalesforceKnowledgeArticleConfigurationPropertyValidator)(properties.knowledgeArticleConfiguration));
  errors.collect(cdk.propertyValidator("secretArn", cdk.requiredValidator)(properties.secretArn));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  errors.collect(cdk.propertyValidator("serverUrl", cdk.requiredValidator)(properties.serverUrl));
  errors.collect(cdk.propertyValidator("serverUrl", cdk.validateString)(properties.serverUrl));
  errors.collect(cdk.propertyValidator("standardObjectAttachmentConfiguration", CfnDataSourceSalesforceStandardObjectAttachmentConfigurationPropertyValidator)(properties.standardObjectAttachmentConfiguration));
  errors.collect(cdk.propertyValidator("standardObjectConfigurations", cdk.listValidator(CfnDataSourceSalesforceStandardObjectConfigurationPropertyValidator))(properties.standardObjectConfigurations));
  return errors.wrap("supplied properties not correct for \"SalesforceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceSalesforceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceSalesforceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ChatterFeedConfiguration": convertCfnDataSourceSalesforceChatterFeedConfigurationPropertyToCloudFormation(properties.chatterFeedConfiguration),
    "CrawlAttachments": cdk.booleanToCloudFormation(properties.crawlAttachments),
    "ExcludeAttachmentFilePatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludeAttachmentFilePatterns),
    "IncludeAttachmentFilePatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.includeAttachmentFilePatterns),
    "KnowledgeArticleConfiguration": convertCfnDataSourceSalesforceKnowledgeArticleConfigurationPropertyToCloudFormation(properties.knowledgeArticleConfiguration),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn),
    "ServerUrl": cdk.stringToCloudFormation(properties.serverUrl),
    "StandardObjectAttachmentConfiguration": convertCfnDataSourceSalesforceStandardObjectAttachmentConfigurationPropertyToCloudFormation(properties.standardObjectAttachmentConfiguration),
    "StandardObjectConfigurations": cdk.listMapper(convertCfnDataSourceSalesforceStandardObjectConfigurationPropertyToCloudFormation)(properties.standardObjectConfigurations)
  };
}

// @ts-ignore TS6133
function CfnDataSourceSalesforceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.SalesforceConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.SalesforceConfigurationProperty>();
  ret.addPropertyResult("chatterFeedConfiguration", "ChatterFeedConfiguration", (properties.ChatterFeedConfiguration != null ? CfnDataSourceSalesforceChatterFeedConfigurationPropertyFromCloudFormation(properties.ChatterFeedConfiguration) : undefined));
  ret.addPropertyResult("crawlAttachments", "CrawlAttachments", (properties.CrawlAttachments != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CrawlAttachments) : undefined));
  ret.addPropertyResult("excludeAttachmentFilePatterns", "ExcludeAttachmentFilePatterns", (properties.ExcludeAttachmentFilePatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludeAttachmentFilePatterns) : undefined));
  ret.addPropertyResult("includeAttachmentFilePatterns", "IncludeAttachmentFilePatterns", (properties.IncludeAttachmentFilePatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludeAttachmentFilePatterns) : undefined));
  ret.addPropertyResult("knowledgeArticleConfiguration", "KnowledgeArticleConfiguration", (properties.KnowledgeArticleConfiguration != null ? CfnDataSourceSalesforceKnowledgeArticleConfigurationPropertyFromCloudFormation(properties.KnowledgeArticleConfiguration) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addPropertyResult("serverUrl", "ServerUrl", (properties.ServerUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ServerUrl) : undefined));
  ret.addPropertyResult("standardObjectAttachmentConfiguration", "StandardObjectAttachmentConfiguration", (properties.StandardObjectAttachmentConfiguration != null ? CfnDataSourceSalesforceStandardObjectAttachmentConfigurationPropertyFromCloudFormation(properties.StandardObjectAttachmentConfiguration) : undefined));
  ret.addPropertyResult("standardObjectConfigurations", "StandardObjectConfigurations", (properties.StandardObjectConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceSalesforceStandardObjectConfigurationPropertyFromCloudFormation)(properties.StandardObjectConfigurations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SqlConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SqlConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceSqlConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("queryIdentifiersEnclosingOption", cdk.validateString)(properties.queryIdentifiersEnclosingOption));
  return errors.wrap("supplied properties not correct for \"SqlConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceSqlConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceSqlConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "QueryIdentifiersEnclosingOption": cdk.stringToCloudFormation(properties.queryIdentifiersEnclosingOption)
  };
}

// @ts-ignore TS6133
function CfnDataSourceSqlConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.SqlConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.SqlConfigurationProperty>();
  ret.addPropertyResult("queryIdentifiersEnclosingOption", "QueryIdentifiersEnclosingOption", (properties.QueryIdentifiersEnclosingOption != null ? cfn_parse.FromCloudFormation.getString(properties.QueryIdentifiersEnclosingOption) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceConnectionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("databaseHost", cdk.requiredValidator)(properties.databaseHost));
  errors.collect(cdk.propertyValidator("databaseHost", cdk.validateString)(properties.databaseHost));
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databasePort", cdk.requiredValidator)(properties.databasePort));
  errors.collect(cdk.propertyValidator("databasePort", cdk.validateNumber)(properties.databasePort));
  errors.collect(cdk.propertyValidator("secretArn", cdk.requiredValidator)(properties.secretArn));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"ConnectionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceConnectionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceConnectionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DatabaseHost": cdk.stringToCloudFormation(properties.databaseHost),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "DatabasePort": cdk.numberToCloudFormation(properties.databasePort),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnDataSourceConnectionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ConnectionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ConnectionConfigurationProperty>();
  ret.addPropertyResult("databaseHost", "DatabaseHost", (properties.DatabaseHost != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseHost) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("databasePort", "DatabasePort", (properties.DatabasePort != null ? cfn_parse.FromCloudFormation.getNumber(properties.DatabasePort) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ColumnConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceColumnConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("changeDetectingColumns", cdk.requiredValidator)(properties.changeDetectingColumns));
  errors.collect(cdk.propertyValidator("changeDetectingColumns", cdk.listValidator(cdk.validateString))(properties.changeDetectingColumns));
  errors.collect(cdk.propertyValidator("documentDataColumnName", cdk.requiredValidator)(properties.documentDataColumnName));
  errors.collect(cdk.propertyValidator("documentDataColumnName", cdk.validateString)(properties.documentDataColumnName));
  errors.collect(cdk.propertyValidator("documentIdColumnName", cdk.requiredValidator)(properties.documentIdColumnName));
  errors.collect(cdk.propertyValidator("documentIdColumnName", cdk.validateString)(properties.documentIdColumnName));
  errors.collect(cdk.propertyValidator("documentTitleColumnName", cdk.validateString)(properties.documentTitleColumnName));
  errors.collect(cdk.propertyValidator("fieldMappings", cdk.listValidator(CfnDataSourceDataSourceToIndexFieldMappingPropertyValidator))(properties.fieldMappings));
  return errors.wrap("supplied properties not correct for \"ColumnConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceColumnConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceColumnConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ChangeDetectingColumns": cdk.listMapper(cdk.stringToCloudFormation)(properties.changeDetectingColumns),
    "DocumentDataColumnName": cdk.stringToCloudFormation(properties.documentDataColumnName),
    "DocumentIdColumnName": cdk.stringToCloudFormation(properties.documentIdColumnName),
    "DocumentTitleColumnName": cdk.stringToCloudFormation(properties.documentTitleColumnName),
    "FieldMappings": cdk.listMapper(convertCfnDataSourceDataSourceToIndexFieldMappingPropertyToCloudFormation)(properties.fieldMappings)
  };
}

// @ts-ignore TS6133
function CfnDataSourceColumnConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ColumnConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ColumnConfigurationProperty>();
  ret.addPropertyResult("changeDetectingColumns", "ChangeDetectingColumns", (properties.ChangeDetectingColumns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ChangeDetectingColumns) : undefined));
  ret.addPropertyResult("documentDataColumnName", "DocumentDataColumnName", (properties.DocumentDataColumnName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentDataColumnName) : undefined));
  ret.addPropertyResult("documentIdColumnName", "DocumentIdColumnName", (properties.DocumentIdColumnName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentIdColumnName) : undefined));
  ret.addPropertyResult("documentTitleColumnName", "DocumentTitleColumnName", (properties.DocumentTitleColumnName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentTitleColumnName) : undefined));
  ret.addPropertyResult("fieldMappings", "FieldMappings", (properties.FieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceDataSourceToIndexFieldMappingPropertyFromCloudFormation)(properties.FieldMappings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataSourceVpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DataSourceVpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceDataSourceVpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.requiredValidator)(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"DataSourceVpcConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceDataSourceVpcConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceDataSourceVpcConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnDataSourceDataSourceVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DataSourceVpcConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DataSourceVpcConfigurationProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
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
function CfnDataSourceAclConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedGroupsColumnName", cdk.requiredValidator)(properties.allowedGroupsColumnName));
  errors.collect(cdk.propertyValidator("allowedGroupsColumnName", cdk.validateString)(properties.allowedGroupsColumnName));
  return errors.wrap("supplied properties not correct for \"AclConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceAclConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceAclConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AllowedGroupsColumnName": cdk.stringToCloudFormation(properties.allowedGroupsColumnName)
  };
}

// @ts-ignore TS6133
function CfnDataSourceAclConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.AclConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.AclConfigurationProperty>();
  ret.addPropertyResult("allowedGroupsColumnName", "AllowedGroupsColumnName", (properties.AllowedGroupsColumnName != null ? cfn_parse.FromCloudFormation.getString(properties.AllowedGroupsColumnName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatabaseConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DatabaseConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceDatabaseConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("aclConfiguration", CfnDataSourceAclConfigurationPropertyValidator)(properties.aclConfiguration));
  errors.collect(cdk.propertyValidator("columnConfiguration", cdk.requiredValidator)(properties.columnConfiguration));
  errors.collect(cdk.propertyValidator("columnConfiguration", CfnDataSourceColumnConfigurationPropertyValidator)(properties.columnConfiguration));
  errors.collect(cdk.propertyValidator("connectionConfiguration", cdk.requiredValidator)(properties.connectionConfiguration));
  errors.collect(cdk.propertyValidator("connectionConfiguration", CfnDataSourceConnectionConfigurationPropertyValidator)(properties.connectionConfiguration));
  errors.collect(cdk.propertyValidator("databaseEngineType", cdk.requiredValidator)(properties.databaseEngineType));
  errors.collect(cdk.propertyValidator("databaseEngineType", cdk.validateString)(properties.databaseEngineType));
  errors.collect(cdk.propertyValidator("sqlConfiguration", CfnDataSourceSqlConfigurationPropertyValidator)(properties.sqlConfiguration));
  errors.collect(cdk.propertyValidator("vpcConfiguration", CfnDataSourceDataSourceVpcConfigurationPropertyValidator)(properties.vpcConfiguration));
  return errors.wrap("supplied properties not correct for \"DatabaseConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceDatabaseConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceDatabaseConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AclConfiguration": convertCfnDataSourceAclConfigurationPropertyToCloudFormation(properties.aclConfiguration),
    "ColumnConfiguration": convertCfnDataSourceColumnConfigurationPropertyToCloudFormation(properties.columnConfiguration),
    "ConnectionConfiguration": convertCfnDataSourceConnectionConfigurationPropertyToCloudFormation(properties.connectionConfiguration),
    "DatabaseEngineType": cdk.stringToCloudFormation(properties.databaseEngineType),
    "SqlConfiguration": convertCfnDataSourceSqlConfigurationPropertyToCloudFormation(properties.sqlConfiguration),
    "VpcConfiguration": convertCfnDataSourceDataSourceVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDataSourceDatabaseConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DatabaseConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DatabaseConfigurationProperty>();
  ret.addPropertyResult("aclConfiguration", "AclConfiguration", (properties.AclConfiguration != null ? CfnDataSourceAclConfigurationPropertyFromCloudFormation(properties.AclConfiguration) : undefined));
  ret.addPropertyResult("columnConfiguration", "ColumnConfiguration", (properties.ColumnConfiguration != null ? CfnDataSourceColumnConfigurationPropertyFromCloudFormation(properties.ColumnConfiguration) : undefined));
  ret.addPropertyResult("connectionConfiguration", "ConnectionConfiguration", (properties.ConnectionConfiguration != null ? CfnDataSourceConnectionConfigurationPropertyFromCloudFormation(properties.ConnectionConfiguration) : undefined));
  ret.addPropertyResult("databaseEngineType", "DatabaseEngineType", (properties.DatabaseEngineType != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseEngineType) : undefined));
  ret.addPropertyResult("sqlConfiguration", "SqlConfiguration", (properties.SqlConfiguration != null ? CfnDataSourceSqlConfigurationPropertyFromCloudFormation(properties.SqlConfiguration) : undefined));
  ret.addPropertyResult("vpcConfiguration", "VpcConfiguration", (properties.VpcConfiguration != null ? CfnDataSourceDataSourceVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3PathProperty`
 *
 * @param properties - the TypeScript properties of a `S3PathProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceS3PathPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  return errors.wrap("supplied properties not correct for \"S3PathProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceS3PathPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceS3PathPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key)
  };
}

// @ts-ignore TS6133
function CfnDataSourceS3PathPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.S3PathProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.S3PathProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SharePointConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SharePointConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceSharePointConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("crawlAttachments", cdk.validateBoolean)(properties.crawlAttachments));
  errors.collect(cdk.propertyValidator("disableLocalGroups", cdk.validateBoolean)(properties.disableLocalGroups));
  errors.collect(cdk.propertyValidator("documentTitleFieldName", cdk.validateString)(properties.documentTitleFieldName));
  errors.collect(cdk.propertyValidator("exclusionPatterns", cdk.listValidator(cdk.validateString))(properties.exclusionPatterns));
  errors.collect(cdk.propertyValidator("fieldMappings", cdk.listValidator(CfnDataSourceDataSourceToIndexFieldMappingPropertyValidator))(properties.fieldMappings));
  errors.collect(cdk.propertyValidator("inclusionPatterns", cdk.listValidator(cdk.validateString))(properties.inclusionPatterns));
  errors.collect(cdk.propertyValidator("secretArn", cdk.requiredValidator)(properties.secretArn));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  errors.collect(cdk.propertyValidator("sharePointVersion", cdk.requiredValidator)(properties.sharePointVersion));
  errors.collect(cdk.propertyValidator("sharePointVersion", cdk.validateString)(properties.sharePointVersion));
  errors.collect(cdk.propertyValidator("sslCertificateS3Path", CfnDataSourceS3PathPropertyValidator)(properties.sslCertificateS3Path));
  errors.collect(cdk.propertyValidator("urls", cdk.requiredValidator)(properties.urls));
  errors.collect(cdk.propertyValidator("urls", cdk.listValidator(cdk.validateString))(properties.urls));
  errors.collect(cdk.propertyValidator("useChangeLog", cdk.validateBoolean)(properties.useChangeLog));
  errors.collect(cdk.propertyValidator("vpcConfiguration", CfnDataSourceDataSourceVpcConfigurationPropertyValidator)(properties.vpcConfiguration));
  return errors.wrap("supplied properties not correct for \"SharePointConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceSharePointConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceSharePointConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CrawlAttachments": cdk.booleanToCloudFormation(properties.crawlAttachments),
    "DisableLocalGroups": cdk.booleanToCloudFormation(properties.disableLocalGroups),
    "DocumentTitleFieldName": cdk.stringToCloudFormation(properties.documentTitleFieldName),
    "ExclusionPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.exclusionPatterns),
    "FieldMappings": cdk.listMapper(convertCfnDataSourceDataSourceToIndexFieldMappingPropertyToCloudFormation)(properties.fieldMappings),
    "InclusionPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.inclusionPatterns),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn),
    "SharePointVersion": cdk.stringToCloudFormation(properties.sharePointVersion),
    "SslCertificateS3Path": convertCfnDataSourceS3PathPropertyToCloudFormation(properties.sslCertificateS3Path),
    "Urls": cdk.listMapper(cdk.stringToCloudFormation)(properties.urls),
    "UseChangeLog": cdk.booleanToCloudFormation(properties.useChangeLog),
    "VpcConfiguration": convertCfnDataSourceDataSourceVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDataSourceSharePointConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.SharePointConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.SharePointConfigurationProperty>();
  ret.addPropertyResult("crawlAttachments", "CrawlAttachments", (properties.CrawlAttachments != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CrawlAttachments) : undefined));
  ret.addPropertyResult("disableLocalGroups", "DisableLocalGroups", (properties.DisableLocalGroups != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableLocalGroups) : undefined));
  ret.addPropertyResult("documentTitleFieldName", "DocumentTitleFieldName", (properties.DocumentTitleFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentTitleFieldName) : undefined));
  ret.addPropertyResult("exclusionPatterns", "ExclusionPatterns", (properties.ExclusionPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExclusionPatterns) : undefined));
  ret.addPropertyResult("fieldMappings", "FieldMappings", (properties.FieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceDataSourceToIndexFieldMappingPropertyFromCloudFormation)(properties.FieldMappings) : undefined));
  ret.addPropertyResult("inclusionPatterns", "InclusionPatterns", (properties.InclusionPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InclusionPatterns) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addPropertyResult("sharePointVersion", "SharePointVersion", (properties.SharePointVersion != null ? cfn_parse.FromCloudFormation.getString(properties.SharePointVersion) : undefined));
  ret.addPropertyResult("sslCertificateS3Path", "SslCertificateS3Path", (properties.SslCertificateS3Path != null ? CfnDataSourceS3PathPropertyFromCloudFormation(properties.SslCertificateS3Path) : undefined));
  ret.addPropertyResult("urls", "Urls", (properties.Urls != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Urls) : undefined));
  ret.addPropertyResult("useChangeLog", "UseChangeLog", (properties.UseChangeLog != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseChangeLog) : undefined));
  ret.addPropertyResult("vpcConfiguration", "VpcConfiguration", (properties.VpcConfiguration != null ? CfnDataSourceDataSourceVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfluenceAttachmentToIndexFieldMappingProperty`
 *
 * @param properties - the TypeScript properties of a `ConfluenceAttachmentToIndexFieldMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceConfluenceAttachmentToIndexFieldMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataSourceFieldName", cdk.requiredValidator)(properties.dataSourceFieldName));
  errors.collect(cdk.propertyValidator("dataSourceFieldName", cdk.validateString)(properties.dataSourceFieldName));
  errors.collect(cdk.propertyValidator("dateFieldFormat", cdk.validateString)(properties.dateFieldFormat));
  errors.collect(cdk.propertyValidator("indexFieldName", cdk.requiredValidator)(properties.indexFieldName));
  errors.collect(cdk.propertyValidator("indexFieldName", cdk.validateString)(properties.indexFieldName));
  return errors.wrap("supplied properties not correct for \"ConfluenceAttachmentToIndexFieldMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceConfluenceAttachmentToIndexFieldMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceConfluenceAttachmentToIndexFieldMappingPropertyValidator(properties).assertSuccess();
  return {
    "DataSourceFieldName": cdk.stringToCloudFormation(properties.dataSourceFieldName),
    "DateFieldFormat": cdk.stringToCloudFormation(properties.dateFieldFormat),
    "IndexFieldName": cdk.stringToCloudFormation(properties.indexFieldName)
  };
}

// @ts-ignore TS6133
function CfnDataSourceConfluenceAttachmentToIndexFieldMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ConfluenceAttachmentToIndexFieldMappingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ConfluenceAttachmentToIndexFieldMappingProperty>();
  ret.addPropertyResult("dataSourceFieldName", "DataSourceFieldName", (properties.DataSourceFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DataSourceFieldName) : undefined));
  ret.addPropertyResult("dateFieldFormat", "DateFieldFormat", (properties.DateFieldFormat != null ? cfn_parse.FromCloudFormation.getString(properties.DateFieldFormat) : undefined));
  ret.addPropertyResult("indexFieldName", "IndexFieldName", (properties.IndexFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.IndexFieldName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfluenceAttachmentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConfluenceAttachmentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceConfluenceAttachmentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attachmentFieldMappings", cdk.listValidator(CfnDataSourceConfluenceAttachmentToIndexFieldMappingPropertyValidator))(properties.attachmentFieldMappings));
  errors.collect(cdk.propertyValidator("crawlAttachments", cdk.validateBoolean)(properties.crawlAttachments));
  return errors.wrap("supplied properties not correct for \"ConfluenceAttachmentConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceConfluenceAttachmentConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceConfluenceAttachmentConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AttachmentFieldMappings": cdk.listMapper(convertCfnDataSourceConfluenceAttachmentToIndexFieldMappingPropertyToCloudFormation)(properties.attachmentFieldMappings),
    "CrawlAttachments": cdk.booleanToCloudFormation(properties.crawlAttachments)
  };
}

// @ts-ignore TS6133
function CfnDataSourceConfluenceAttachmentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ConfluenceAttachmentConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ConfluenceAttachmentConfigurationProperty>();
  ret.addPropertyResult("attachmentFieldMappings", "AttachmentFieldMappings", (properties.AttachmentFieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceConfluenceAttachmentToIndexFieldMappingPropertyFromCloudFormation)(properties.AttachmentFieldMappings) : undefined));
  ret.addPropertyResult("crawlAttachments", "CrawlAttachments", (properties.CrawlAttachments != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CrawlAttachments) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfluencePageToIndexFieldMappingProperty`
 *
 * @param properties - the TypeScript properties of a `ConfluencePageToIndexFieldMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceConfluencePageToIndexFieldMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataSourceFieldName", cdk.requiredValidator)(properties.dataSourceFieldName));
  errors.collect(cdk.propertyValidator("dataSourceFieldName", cdk.validateString)(properties.dataSourceFieldName));
  errors.collect(cdk.propertyValidator("dateFieldFormat", cdk.validateString)(properties.dateFieldFormat));
  errors.collect(cdk.propertyValidator("indexFieldName", cdk.requiredValidator)(properties.indexFieldName));
  errors.collect(cdk.propertyValidator("indexFieldName", cdk.validateString)(properties.indexFieldName));
  return errors.wrap("supplied properties not correct for \"ConfluencePageToIndexFieldMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceConfluencePageToIndexFieldMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceConfluencePageToIndexFieldMappingPropertyValidator(properties).assertSuccess();
  return {
    "DataSourceFieldName": cdk.stringToCloudFormation(properties.dataSourceFieldName),
    "DateFieldFormat": cdk.stringToCloudFormation(properties.dateFieldFormat),
    "IndexFieldName": cdk.stringToCloudFormation(properties.indexFieldName)
  };
}

// @ts-ignore TS6133
function CfnDataSourceConfluencePageToIndexFieldMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ConfluencePageToIndexFieldMappingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ConfluencePageToIndexFieldMappingProperty>();
  ret.addPropertyResult("dataSourceFieldName", "DataSourceFieldName", (properties.DataSourceFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DataSourceFieldName) : undefined));
  ret.addPropertyResult("dateFieldFormat", "DateFieldFormat", (properties.DateFieldFormat != null ? cfn_parse.FromCloudFormation.getString(properties.DateFieldFormat) : undefined));
  ret.addPropertyResult("indexFieldName", "IndexFieldName", (properties.IndexFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.IndexFieldName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfluencePageConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConfluencePageConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceConfluencePageConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("pageFieldMappings", cdk.listValidator(CfnDataSourceConfluencePageToIndexFieldMappingPropertyValidator))(properties.pageFieldMappings));
  return errors.wrap("supplied properties not correct for \"ConfluencePageConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceConfluencePageConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceConfluencePageConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "PageFieldMappings": cdk.listMapper(convertCfnDataSourceConfluencePageToIndexFieldMappingPropertyToCloudFormation)(properties.pageFieldMappings)
  };
}

// @ts-ignore TS6133
function CfnDataSourceConfluencePageConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ConfluencePageConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ConfluencePageConfigurationProperty>();
  ret.addPropertyResult("pageFieldMappings", "PageFieldMappings", (properties.PageFieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceConfluencePageToIndexFieldMappingPropertyFromCloudFormation)(properties.PageFieldMappings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfluenceBlogToIndexFieldMappingProperty`
 *
 * @param properties - the TypeScript properties of a `ConfluenceBlogToIndexFieldMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceConfluenceBlogToIndexFieldMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataSourceFieldName", cdk.requiredValidator)(properties.dataSourceFieldName));
  errors.collect(cdk.propertyValidator("dataSourceFieldName", cdk.validateString)(properties.dataSourceFieldName));
  errors.collect(cdk.propertyValidator("dateFieldFormat", cdk.validateString)(properties.dateFieldFormat));
  errors.collect(cdk.propertyValidator("indexFieldName", cdk.requiredValidator)(properties.indexFieldName));
  errors.collect(cdk.propertyValidator("indexFieldName", cdk.validateString)(properties.indexFieldName));
  return errors.wrap("supplied properties not correct for \"ConfluenceBlogToIndexFieldMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceConfluenceBlogToIndexFieldMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceConfluenceBlogToIndexFieldMappingPropertyValidator(properties).assertSuccess();
  return {
    "DataSourceFieldName": cdk.stringToCloudFormation(properties.dataSourceFieldName),
    "DateFieldFormat": cdk.stringToCloudFormation(properties.dateFieldFormat),
    "IndexFieldName": cdk.stringToCloudFormation(properties.indexFieldName)
  };
}

// @ts-ignore TS6133
function CfnDataSourceConfluenceBlogToIndexFieldMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ConfluenceBlogToIndexFieldMappingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ConfluenceBlogToIndexFieldMappingProperty>();
  ret.addPropertyResult("dataSourceFieldName", "DataSourceFieldName", (properties.DataSourceFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DataSourceFieldName) : undefined));
  ret.addPropertyResult("dateFieldFormat", "DateFieldFormat", (properties.DateFieldFormat != null ? cfn_parse.FromCloudFormation.getString(properties.DateFieldFormat) : undefined));
  ret.addPropertyResult("indexFieldName", "IndexFieldName", (properties.IndexFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.IndexFieldName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfluenceBlogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConfluenceBlogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceConfluenceBlogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("blogFieldMappings", cdk.listValidator(CfnDataSourceConfluenceBlogToIndexFieldMappingPropertyValidator))(properties.blogFieldMappings));
  return errors.wrap("supplied properties not correct for \"ConfluenceBlogConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceConfluenceBlogConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceConfluenceBlogConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BlogFieldMappings": cdk.listMapper(convertCfnDataSourceConfluenceBlogToIndexFieldMappingPropertyToCloudFormation)(properties.blogFieldMappings)
  };
}

// @ts-ignore TS6133
function CfnDataSourceConfluenceBlogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ConfluenceBlogConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ConfluenceBlogConfigurationProperty>();
  ret.addPropertyResult("blogFieldMappings", "BlogFieldMappings", (properties.BlogFieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceConfluenceBlogToIndexFieldMappingPropertyFromCloudFormation)(properties.BlogFieldMappings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfluenceSpaceToIndexFieldMappingProperty`
 *
 * @param properties - the TypeScript properties of a `ConfluenceSpaceToIndexFieldMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceConfluenceSpaceToIndexFieldMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataSourceFieldName", cdk.requiredValidator)(properties.dataSourceFieldName));
  errors.collect(cdk.propertyValidator("dataSourceFieldName", cdk.validateString)(properties.dataSourceFieldName));
  errors.collect(cdk.propertyValidator("dateFieldFormat", cdk.validateString)(properties.dateFieldFormat));
  errors.collect(cdk.propertyValidator("indexFieldName", cdk.requiredValidator)(properties.indexFieldName));
  errors.collect(cdk.propertyValidator("indexFieldName", cdk.validateString)(properties.indexFieldName));
  return errors.wrap("supplied properties not correct for \"ConfluenceSpaceToIndexFieldMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceConfluenceSpaceToIndexFieldMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceConfluenceSpaceToIndexFieldMappingPropertyValidator(properties).assertSuccess();
  return {
    "DataSourceFieldName": cdk.stringToCloudFormation(properties.dataSourceFieldName),
    "DateFieldFormat": cdk.stringToCloudFormation(properties.dateFieldFormat),
    "IndexFieldName": cdk.stringToCloudFormation(properties.indexFieldName)
  };
}

// @ts-ignore TS6133
function CfnDataSourceConfluenceSpaceToIndexFieldMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ConfluenceSpaceToIndexFieldMappingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ConfluenceSpaceToIndexFieldMappingProperty>();
  ret.addPropertyResult("dataSourceFieldName", "DataSourceFieldName", (properties.DataSourceFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DataSourceFieldName) : undefined));
  ret.addPropertyResult("dateFieldFormat", "DateFieldFormat", (properties.DateFieldFormat != null ? cfn_parse.FromCloudFormation.getString(properties.DateFieldFormat) : undefined));
  ret.addPropertyResult("indexFieldName", "IndexFieldName", (properties.IndexFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.IndexFieldName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfluenceSpaceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConfluenceSpaceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceConfluenceSpaceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("crawlArchivedSpaces", cdk.validateBoolean)(properties.crawlArchivedSpaces));
  errors.collect(cdk.propertyValidator("crawlPersonalSpaces", cdk.validateBoolean)(properties.crawlPersonalSpaces));
  errors.collect(cdk.propertyValidator("excludeSpaces", cdk.listValidator(cdk.validateString))(properties.excludeSpaces));
  errors.collect(cdk.propertyValidator("includeSpaces", cdk.listValidator(cdk.validateString))(properties.includeSpaces));
  errors.collect(cdk.propertyValidator("spaceFieldMappings", cdk.listValidator(CfnDataSourceConfluenceSpaceToIndexFieldMappingPropertyValidator))(properties.spaceFieldMappings));
  return errors.wrap("supplied properties not correct for \"ConfluenceSpaceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceConfluenceSpaceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceConfluenceSpaceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CrawlArchivedSpaces": cdk.booleanToCloudFormation(properties.crawlArchivedSpaces),
    "CrawlPersonalSpaces": cdk.booleanToCloudFormation(properties.crawlPersonalSpaces),
    "ExcludeSpaces": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludeSpaces),
    "IncludeSpaces": cdk.listMapper(cdk.stringToCloudFormation)(properties.includeSpaces),
    "SpaceFieldMappings": cdk.listMapper(convertCfnDataSourceConfluenceSpaceToIndexFieldMappingPropertyToCloudFormation)(properties.spaceFieldMappings)
  };
}

// @ts-ignore TS6133
function CfnDataSourceConfluenceSpaceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ConfluenceSpaceConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ConfluenceSpaceConfigurationProperty>();
  ret.addPropertyResult("crawlArchivedSpaces", "CrawlArchivedSpaces", (properties.CrawlArchivedSpaces != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CrawlArchivedSpaces) : undefined));
  ret.addPropertyResult("crawlPersonalSpaces", "CrawlPersonalSpaces", (properties.CrawlPersonalSpaces != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CrawlPersonalSpaces) : undefined));
  ret.addPropertyResult("excludeSpaces", "ExcludeSpaces", (properties.ExcludeSpaces != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludeSpaces) : undefined));
  ret.addPropertyResult("includeSpaces", "IncludeSpaces", (properties.IncludeSpaces != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludeSpaces) : undefined));
  ret.addPropertyResult("spaceFieldMappings", "SpaceFieldMappings", (properties.SpaceFieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceConfluenceSpaceToIndexFieldMappingPropertyFromCloudFormation)(properties.SpaceFieldMappings) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfluenceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ConfluenceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceConfluenceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attachmentConfiguration", CfnDataSourceConfluenceAttachmentConfigurationPropertyValidator)(properties.attachmentConfiguration));
  errors.collect(cdk.propertyValidator("blogConfiguration", CfnDataSourceConfluenceBlogConfigurationPropertyValidator)(properties.blogConfiguration));
  errors.collect(cdk.propertyValidator("exclusionPatterns", cdk.listValidator(cdk.validateString))(properties.exclusionPatterns));
  errors.collect(cdk.propertyValidator("inclusionPatterns", cdk.listValidator(cdk.validateString))(properties.inclusionPatterns));
  errors.collect(cdk.propertyValidator("pageConfiguration", CfnDataSourceConfluencePageConfigurationPropertyValidator)(properties.pageConfiguration));
  errors.collect(cdk.propertyValidator("secretArn", cdk.requiredValidator)(properties.secretArn));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  errors.collect(cdk.propertyValidator("serverUrl", cdk.requiredValidator)(properties.serverUrl));
  errors.collect(cdk.propertyValidator("serverUrl", cdk.validateString)(properties.serverUrl));
  errors.collect(cdk.propertyValidator("spaceConfiguration", CfnDataSourceConfluenceSpaceConfigurationPropertyValidator)(properties.spaceConfiguration));
  errors.collect(cdk.propertyValidator("version", cdk.requiredValidator)(properties.version));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  errors.collect(cdk.propertyValidator("vpcConfiguration", CfnDataSourceDataSourceVpcConfigurationPropertyValidator)(properties.vpcConfiguration));
  return errors.wrap("supplied properties not correct for \"ConfluenceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceConfluenceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceConfluenceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AttachmentConfiguration": convertCfnDataSourceConfluenceAttachmentConfigurationPropertyToCloudFormation(properties.attachmentConfiguration),
    "BlogConfiguration": convertCfnDataSourceConfluenceBlogConfigurationPropertyToCloudFormation(properties.blogConfiguration),
    "ExclusionPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.exclusionPatterns),
    "InclusionPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.inclusionPatterns),
    "PageConfiguration": convertCfnDataSourceConfluencePageConfigurationPropertyToCloudFormation(properties.pageConfiguration),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn),
    "ServerUrl": cdk.stringToCloudFormation(properties.serverUrl),
    "SpaceConfiguration": convertCfnDataSourceConfluenceSpaceConfigurationPropertyToCloudFormation(properties.spaceConfiguration),
    "Version": cdk.stringToCloudFormation(properties.version),
    "VpcConfiguration": convertCfnDataSourceDataSourceVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDataSourceConfluenceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.ConfluenceConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ConfluenceConfigurationProperty>();
  ret.addPropertyResult("attachmentConfiguration", "AttachmentConfiguration", (properties.AttachmentConfiguration != null ? CfnDataSourceConfluenceAttachmentConfigurationPropertyFromCloudFormation(properties.AttachmentConfiguration) : undefined));
  ret.addPropertyResult("blogConfiguration", "BlogConfiguration", (properties.BlogConfiguration != null ? CfnDataSourceConfluenceBlogConfigurationPropertyFromCloudFormation(properties.BlogConfiguration) : undefined));
  ret.addPropertyResult("exclusionPatterns", "ExclusionPatterns", (properties.ExclusionPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExclusionPatterns) : undefined));
  ret.addPropertyResult("inclusionPatterns", "InclusionPatterns", (properties.InclusionPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InclusionPatterns) : undefined));
  ret.addPropertyResult("pageConfiguration", "PageConfiguration", (properties.PageConfiguration != null ? CfnDataSourceConfluencePageConfigurationPropertyFromCloudFormation(properties.PageConfiguration) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addPropertyResult("serverUrl", "ServerUrl", (properties.ServerUrl != null ? cfn_parse.FromCloudFormation.getString(properties.ServerUrl) : undefined));
  ret.addPropertyResult("spaceConfiguration", "SpaceConfiguration", (properties.SpaceConfiguration != null ? CfnDataSourceConfluenceSpaceConfigurationPropertyFromCloudFormation(properties.SpaceConfiguration) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addPropertyResult("vpcConfiguration", "VpcConfiguration", (properties.VpcConfiguration != null ? CfnDataSourceDataSourceVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkDocsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WorkDocsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceWorkDocsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("crawlComments", cdk.validateBoolean)(properties.crawlComments));
  errors.collect(cdk.propertyValidator("exclusionPatterns", cdk.listValidator(cdk.validateString))(properties.exclusionPatterns));
  errors.collect(cdk.propertyValidator("fieldMappings", cdk.listValidator(CfnDataSourceDataSourceToIndexFieldMappingPropertyValidator))(properties.fieldMappings));
  errors.collect(cdk.propertyValidator("inclusionPatterns", cdk.listValidator(cdk.validateString))(properties.inclusionPatterns));
  errors.collect(cdk.propertyValidator("organizationId", cdk.requiredValidator)(properties.organizationId));
  errors.collect(cdk.propertyValidator("organizationId", cdk.validateString)(properties.organizationId));
  errors.collect(cdk.propertyValidator("useChangeLog", cdk.validateBoolean)(properties.useChangeLog));
  return errors.wrap("supplied properties not correct for \"WorkDocsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceWorkDocsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceWorkDocsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CrawlComments": cdk.booleanToCloudFormation(properties.crawlComments),
    "ExclusionPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.exclusionPatterns),
    "FieldMappings": cdk.listMapper(convertCfnDataSourceDataSourceToIndexFieldMappingPropertyToCloudFormation)(properties.fieldMappings),
    "InclusionPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.inclusionPatterns),
    "OrganizationId": cdk.stringToCloudFormation(properties.organizationId),
    "UseChangeLog": cdk.booleanToCloudFormation(properties.useChangeLog)
  };
}

// @ts-ignore TS6133
function CfnDataSourceWorkDocsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.WorkDocsConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.WorkDocsConfigurationProperty>();
  ret.addPropertyResult("crawlComments", "CrawlComments", (properties.CrawlComments != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CrawlComments) : undefined));
  ret.addPropertyResult("exclusionPatterns", "ExclusionPatterns", (properties.ExclusionPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExclusionPatterns) : undefined));
  ret.addPropertyResult("fieldMappings", "FieldMappings", (properties.FieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceDataSourceToIndexFieldMappingPropertyFromCloudFormation)(properties.FieldMappings) : undefined));
  ret.addPropertyResult("inclusionPatterns", "InclusionPatterns", (properties.InclusionPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InclusionPatterns) : undefined));
  ret.addPropertyResult("organizationId", "OrganizationId", (properties.OrganizationId != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationId) : undefined));
  ret.addPropertyResult("useChangeLog", "UseChangeLog", (properties.UseChangeLog != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseChangeLog) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OneDriveUsersProperty`
 *
 * @param properties - the TypeScript properties of a `OneDriveUsersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceOneDriveUsersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("oneDriveUserList", cdk.listValidator(cdk.validateString))(properties.oneDriveUserList));
  errors.collect(cdk.propertyValidator("oneDriveUserS3Path", CfnDataSourceS3PathPropertyValidator)(properties.oneDriveUserS3Path));
  return errors.wrap("supplied properties not correct for \"OneDriveUsersProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceOneDriveUsersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceOneDriveUsersPropertyValidator(properties).assertSuccess();
  return {
    "OneDriveUserList": cdk.listMapper(cdk.stringToCloudFormation)(properties.oneDriveUserList),
    "OneDriveUserS3Path": convertCfnDataSourceS3PathPropertyToCloudFormation(properties.oneDriveUserS3Path)
  };
}

// @ts-ignore TS6133
function CfnDataSourceOneDriveUsersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.OneDriveUsersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.OneDriveUsersProperty>();
  ret.addPropertyResult("oneDriveUserList", "OneDriveUserList", (properties.OneDriveUserList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.OneDriveUserList) : undefined));
  ret.addPropertyResult("oneDriveUserS3Path", "OneDriveUserS3Path", (properties.OneDriveUserS3Path != null ? CfnDataSourceS3PathPropertyFromCloudFormation(properties.OneDriveUserS3Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OneDriveConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `OneDriveConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceOneDriveConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("disableLocalGroups", cdk.validateBoolean)(properties.disableLocalGroups));
  errors.collect(cdk.propertyValidator("exclusionPatterns", cdk.listValidator(cdk.validateString))(properties.exclusionPatterns));
  errors.collect(cdk.propertyValidator("fieldMappings", cdk.listValidator(CfnDataSourceDataSourceToIndexFieldMappingPropertyValidator))(properties.fieldMappings));
  errors.collect(cdk.propertyValidator("inclusionPatterns", cdk.listValidator(cdk.validateString))(properties.inclusionPatterns));
  errors.collect(cdk.propertyValidator("oneDriveUsers", cdk.requiredValidator)(properties.oneDriveUsers));
  errors.collect(cdk.propertyValidator("oneDriveUsers", CfnDataSourceOneDriveUsersPropertyValidator)(properties.oneDriveUsers));
  errors.collect(cdk.propertyValidator("secretArn", cdk.requiredValidator)(properties.secretArn));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  errors.collect(cdk.propertyValidator("tenantDomain", cdk.requiredValidator)(properties.tenantDomain));
  errors.collect(cdk.propertyValidator("tenantDomain", cdk.validateString)(properties.tenantDomain));
  return errors.wrap("supplied properties not correct for \"OneDriveConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceOneDriveConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceOneDriveConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DisableLocalGroups": cdk.booleanToCloudFormation(properties.disableLocalGroups),
    "ExclusionPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.exclusionPatterns),
    "FieldMappings": cdk.listMapper(convertCfnDataSourceDataSourceToIndexFieldMappingPropertyToCloudFormation)(properties.fieldMappings),
    "InclusionPatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.inclusionPatterns),
    "OneDriveUsers": convertCfnDataSourceOneDriveUsersPropertyToCloudFormation(properties.oneDriveUsers),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn),
    "TenantDomain": cdk.stringToCloudFormation(properties.tenantDomain)
  };
}

// @ts-ignore TS6133
function CfnDataSourceOneDriveConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.OneDriveConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.OneDriveConfigurationProperty>();
  ret.addPropertyResult("disableLocalGroups", "DisableLocalGroups", (properties.DisableLocalGroups != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableLocalGroups) : undefined));
  ret.addPropertyResult("exclusionPatterns", "ExclusionPatterns", (properties.ExclusionPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExclusionPatterns) : undefined));
  ret.addPropertyResult("fieldMappings", "FieldMappings", (properties.FieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceDataSourceToIndexFieldMappingPropertyFromCloudFormation)(properties.FieldMappings) : undefined));
  ret.addPropertyResult("inclusionPatterns", "InclusionPatterns", (properties.InclusionPatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InclusionPatterns) : undefined));
  ret.addPropertyResult("oneDriveUsers", "OneDriveUsers", (properties.OneDriveUsers != null ? CfnDataSourceOneDriveUsersPropertyFromCloudFormation(properties.OneDriveUsers) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addPropertyResult("tenantDomain", "TenantDomain", (properties.TenantDomain != null ? cfn_parse.FromCloudFormation.getString(properties.TenantDomain) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TemplateConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceTemplateConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("template", cdk.requiredValidator)(properties.template));
  errors.collect(cdk.propertyValidator("template", cdk.validateString)(properties.template));
  return errors.wrap("supplied properties not correct for \"TemplateConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceTemplateConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceTemplateConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Template": cdk.stringToCloudFormation(properties.template)
  };
}

// @ts-ignore TS6133
function CfnDataSourceTemplateConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.TemplateConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.TemplateConfigurationProperty>();
  ret.addPropertyResult("template", "Template", (properties.Template != null ? cfn_parse.FromCloudFormation.getString(properties.Template) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceNowServiceCatalogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceNowServiceCatalogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceServiceNowServiceCatalogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("crawlAttachments", cdk.validateBoolean)(properties.crawlAttachments));
  errors.collect(cdk.propertyValidator("documentDataFieldName", cdk.requiredValidator)(properties.documentDataFieldName));
  errors.collect(cdk.propertyValidator("documentDataFieldName", cdk.validateString)(properties.documentDataFieldName));
  errors.collect(cdk.propertyValidator("documentTitleFieldName", cdk.validateString)(properties.documentTitleFieldName));
  errors.collect(cdk.propertyValidator("excludeAttachmentFilePatterns", cdk.listValidator(cdk.validateString))(properties.excludeAttachmentFilePatterns));
  errors.collect(cdk.propertyValidator("fieldMappings", cdk.listValidator(CfnDataSourceDataSourceToIndexFieldMappingPropertyValidator))(properties.fieldMappings));
  errors.collect(cdk.propertyValidator("includeAttachmentFilePatterns", cdk.listValidator(cdk.validateString))(properties.includeAttachmentFilePatterns));
  return errors.wrap("supplied properties not correct for \"ServiceNowServiceCatalogConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceServiceNowServiceCatalogConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceServiceNowServiceCatalogConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CrawlAttachments": cdk.booleanToCloudFormation(properties.crawlAttachments),
    "DocumentDataFieldName": cdk.stringToCloudFormation(properties.documentDataFieldName),
    "DocumentTitleFieldName": cdk.stringToCloudFormation(properties.documentTitleFieldName),
    "ExcludeAttachmentFilePatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludeAttachmentFilePatterns),
    "FieldMappings": cdk.listMapper(convertCfnDataSourceDataSourceToIndexFieldMappingPropertyToCloudFormation)(properties.fieldMappings),
    "IncludeAttachmentFilePatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.includeAttachmentFilePatterns)
  };
}

// @ts-ignore TS6133
function CfnDataSourceServiceNowServiceCatalogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.ServiceNowServiceCatalogConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ServiceNowServiceCatalogConfigurationProperty>();
  ret.addPropertyResult("crawlAttachments", "CrawlAttachments", (properties.CrawlAttachments != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CrawlAttachments) : undefined));
  ret.addPropertyResult("documentDataFieldName", "DocumentDataFieldName", (properties.DocumentDataFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentDataFieldName) : undefined));
  ret.addPropertyResult("documentTitleFieldName", "DocumentTitleFieldName", (properties.DocumentTitleFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentTitleFieldName) : undefined));
  ret.addPropertyResult("excludeAttachmentFilePatterns", "ExcludeAttachmentFilePatterns", (properties.ExcludeAttachmentFilePatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludeAttachmentFilePatterns) : undefined));
  ret.addPropertyResult("fieldMappings", "FieldMappings", (properties.FieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceDataSourceToIndexFieldMappingPropertyFromCloudFormation)(properties.FieldMappings) : undefined));
  ret.addPropertyResult("includeAttachmentFilePatterns", "IncludeAttachmentFilePatterns", (properties.IncludeAttachmentFilePatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludeAttachmentFilePatterns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceNowKnowledgeArticleConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceNowKnowledgeArticleConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceServiceNowKnowledgeArticleConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("crawlAttachments", cdk.validateBoolean)(properties.crawlAttachments));
  errors.collect(cdk.propertyValidator("documentDataFieldName", cdk.requiredValidator)(properties.documentDataFieldName));
  errors.collect(cdk.propertyValidator("documentDataFieldName", cdk.validateString)(properties.documentDataFieldName));
  errors.collect(cdk.propertyValidator("documentTitleFieldName", cdk.validateString)(properties.documentTitleFieldName));
  errors.collect(cdk.propertyValidator("excludeAttachmentFilePatterns", cdk.listValidator(cdk.validateString))(properties.excludeAttachmentFilePatterns));
  errors.collect(cdk.propertyValidator("fieldMappings", cdk.listValidator(CfnDataSourceDataSourceToIndexFieldMappingPropertyValidator))(properties.fieldMappings));
  errors.collect(cdk.propertyValidator("filterQuery", cdk.validateString)(properties.filterQuery));
  errors.collect(cdk.propertyValidator("includeAttachmentFilePatterns", cdk.listValidator(cdk.validateString))(properties.includeAttachmentFilePatterns));
  return errors.wrap("supplied properties not correct for \"ServiceNowKnowledgeArticleConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceServiceNowKnowledgeArticleConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceServiceNowKnowledgeArticleConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CrawlAttachments": cdk.booleanToCloudFormation(properties.crawlAttachments),
    "DocumentDataFieldName": cdk.stringToCloudFormation(properties.documentDataFieldName),
    "DocumentTitleFieldName": cdk.stringToCloudFormation(properties.documentTitleFieldName),
    "ExcludeAttachmentFilePatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludeAttachmentFilePatterns),
    "FieldMappings": cdk.listMapper(convertCfnDataSourceDataSourceToIndexFieldMappingPropertyToCloudFormation)(properties.fieldMappings),
    "FilterQuery": cdk.stringToCloudFormation(properties.filterQuery),
    "IncludeAttachmentFilePatterns": cdk.listMapper(cdk.stringToCloudFormation)(properties.includeAttachmentFilePatterns)
  };
}

// @ts-ignore TS6133
function CfnDataSourceServiceNowKnowledgeArticleConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.ServiceNowKnowledgeArticleConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ServiceNowKnowledgeArticleConfigurationProperty>();
  ret.addPropertyResult("crawlAttachments", "CrawlAttachments", (properties.CrawlAttachments != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CrawlAttachments) : undefined));
  ret.addPropertyResult("documentDataFieldName", "DocumentDataFieldName", (properties.DocumentDataFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentDataFieldName) : undefined));
  ret.addPropertyResult("documentTitleFieldName", "DocumentTitleFieldName", (properties.DocumentTitleFieldName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentTitleFieldName) : undefined));
  ret.addPropertyResult("excludeAttachmentFilePatterns", "ExcludeAttachmentFilePatterns", (properties.ExcludeAttachmentFilePatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludeAttachmentFilePatterns) : undefined));
  ret.addPropertyResult("fieldMappings", "FieldMappings", (properties.FieldMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnDataSourceDataSourceToIndexFieldMappingPropertyFromCloudFormation)(properties.FieldMappings) : undefined));
  ret.addPropertyResult("filterQuery", "FilterQuery", (properties.FilterQuery != null ? cfn_parse.FromCloudFormation.getString(properties.FilterQuery) : undefined));
  ret.addPropertyResult("includeAttachmentFilePatterns", "IncludeAttachmentFilePatterns", (properties.IncludeAttachmentFilePatterns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludeAttachmentFilePatterns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServiceNowConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServiceNowConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceServiceNowConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationType", cdk.validateString)(properties.authenticationType));
  errors.collect(cdk.propertyValidator("hostUrl", cdk.requiredValidator)(properties.hostUrl));
  errors.collect(cdk.propertyValidator("hostUrl", cdk.validateString)(properties.hostUrl));
  errors.collect(cdk.propertyValidator("knowledgeArticleConfiguration", CfnDataSourceServiceNowKnowledgeArticleConfigurationPropertyValidator)(properties.knowledgeArticleConfiguration));
  errors.collect(cdk.propertyValidator("secretArn", cdk.requiredValidator)(properties.secretArn));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  errors.collect(cdk.propertyValidator("serviceCatalogConfiguration", CfnDataSourceServiceNowServiceCatalogConfigurationPropertyValidator)(properties.serviceCatalogConfiguration));
  errors.collect(cdk.propertyValidator("serviceNowBuildVersion", cdk.requiredValidator)(properties.serviceNowBuildVersion));
  errors.collect(cdk.propertyValidator("serviceNowBuildVersion", cdk.validateString)(properties.serviceNowBuildVersion));
  return errors.wrap("supplied properties not correct for \"ServiceNowConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceServiceNowConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceServiceNowConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AuthenticationType": cdk.stringToCloudFormation(properties.authenticationType),
    "HostUrl": cdk.stringToCloudFormation(properties.hostUrl),
    "KnowledgeArticleConfiguration": convertCfnDataSourceServiceNowKnowledgeArticleConfigurationPropertyToCloudFormation(properties.knowledgeArticleConfiguration),
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn),
    "ServiceCatalogConfiguration": convertCfnDataSourceServiceNowServiceCatalogConfigurationPropertyToCloudFormation(properties.serviceCatalogConfiguration),
    "ServiceNowBuildVersion": cdk.stringToCloudFormation(properties.serviceNowBuildVersion)
  };
}

// @ts-ignore TS6133
function CfnDataSourceServiceNowConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataSource.ServiceNowConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.ServiceNowConfigurationProperty>();
  ret.addPropertyResult("authenticationType", "AuthenticationType", (properties.AuthenticationType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthenticationType) : undefined));
  ret.addPropertyResult("hostUrl", "HostUrl", (properties.HostUrl != null ? cfn_parse.FromCloudFormation.getString(properties.HostUrl) : undefined));
  ret.addPropertyResult("knowledgeArticleConfiguration", "KnowledgeArticleConfiguration", (properties.KnowledgeArticleConfiguration != null ? CfnDataSourceServiceNowKnowledgeArticleConfigurationPropertyFromCloudFormation(properties.KnowledgeArticleConfiguration) : undefined));
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addPropertyResult("serviceCatalogConfiguration", "ServiceCatalogConfiguration", (properties.ServiceCatalogConfiguration != null ? CfnDataSourceServiceNowServiceCatalogConfigurationPropertyFromCloudFormation(properties.ServiceCatalogConfiguration) : undefined));
  ret.addPropertyResult("serviceNowBuildVersion", "ServiceNowBuildVersion", (properties.ServiceNowBuildVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceNowBuildVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataSourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DataSourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourceDataSourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("confluenceConfiguration", CfnDataSourceConfluenceConfigurationPropertyValidator)(properties.confluenceConfiguration));
  errors.collect(cdk.propertyValidator("databaseConfiguration", CfnDataSourceDatabaseConfigurationPropertyValidator)(properties.databaseConfiguration));
  errors.collect(cdk.propertyValidator("googleDriveConfiguration", CfnDataSourceGoogleDriveConfigurationPropertyValidator)(properties.googleDriveConfiguration));
  errors.collect(cdk.propertyValidator("oneDriveConfiguration", CfnDataSourceOneDriveConfigurationPropertyValidator)(properties.oneDriveConfiguration));
  errors.collect(cdk.propertyValidator("s3Configuration", CfnDataSourceS3DataSourceConfigurationPropertyValidator)(properties.s3Configuration));
  errors.collect(cdk.propertyValidator("salesforceConfiguration", CfnDataSourceSalesforceConfigurationPropertyValidator)(properties.salesforceConfiguration));
  errors.collect(cdk.propertyValidator("serviceNowConfiguration", CfnDataSourceServiceNowConfigurationPropertyValidator)(properties.serviceNowConfiguration));
  errors.collect(cdk.propertyValidator("sharePointConfiguration", CfnDataSourceSharePointConfigurationPropertyValidator)(properties.sharePointConfiguration));
  errors.collect(cdk.propertyValidator("templateConfiguration", CfnDataSourceTemplateConfigurationPropertyValidator)(properties.templateConfiguration));
  errors.collect(cdk.propertyValidator("webCrawlerConfiguration", CfnDataSourceWebCrawlerConfigurationPropertyValidator)(properties.webCrawlerConfiguration));
  errors.collect(cdk.propertyValidator("workDocsConfiguration", CfnDataSourceWorkDocsConfigurationPropertyValidator)(properties.workDocsConfiguration));
  return errors.wrap("supplied properties not correct for \"DataSourceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDataSourceDataSourceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourceDataSourceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ConfluenceConfiguration": convertCfnDataSourceConfluenceConfigurationPropertyToCloudFormation(properties.confluenceConfiguration),
    "DatabaseConfiguration": convertCfnDataSourceDatabaseConfigurationPropertyToCloudFormation(properties.databaseConfiguration),
    "GoogleDriveConfiguration": convertCfnDataSourceGoogleDriveConfigurationPropertyToCloudFormation(properties.googleDriveConfiguration),
    "OneDriveConfiguration": convertCfnDataSourceOneDriveConfigurationPropertyToCloudFormation(properties.oneDriveConfiguration),
    "S3Configuration": convertCfnDataSourceS3DataSourceConfigurationPropertyToCloudFormation(properties.s3Configuration),
    "SalesforceConfiguration": convertCfnDataSourceSalesforceConfigurationPropertyToCloudFormation(properties.salesforceConfiguration),
    "ServiceNowConfiguration": convertCfnDataSourceServiceNowConfigurationPropertyToCloudFormation(properties.serviceNowConfiguration),
    "SharePointConfiguration": convertCfnDataSourceSharePointConfigurationPropertyToCloudFormation(properties.sharePointConfiguration),
    "TemplateConfiguration": convertCfnDataSourceTemplateConfigurationPropertyToCloudFormation(properties.templateConfiguration),
    "WebCrawlerConfiguration": convertCfnDataSourceWebCrawlerConfigurationPropertyToCloudFormation(properties.webCrawlerConfiguration),
    "WorkDocsConfiguration": convertCfnDataSourceWorkDocsConfigurationPropertyToCloudFormation(properties.workDocsConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDataSourceDataSourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSource.DataSourceConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSource.DataSourceConfigurationProperty>();
  ret.addPropertyResult("confluenceConfiguration", "ConfluenceConfiguration", (properties.ConfluenceConfiguration != null ? CfnDataSourceConfluenceConfigurationPropertyFromCloudFormation(properties.ConfluenceConfiguration) : undefined));
  ret.addPropertyResult("databaseConfiguration", "DatabaseConfiguration", (properties.DatabaseConfiguration != null ? CfnDataSourceDatabaseConfigurationPropertyFromCloudFormation(properties.DatabaseConfiguration) : undefined));
  ret.addPropertyResult("googleDriveConfiguration", "GoogleDriveConfiguration", (properties.GoogleDriveConfiguration != null ? CfnDataSourceGoogleDriveConfigurationPropertyFromCloudFormation(properties.GoogleDriveConfiguration) : undefined));
  ret.addPropertyResult("oneDriveConfiguration", "OneDriveConfiguration", (properties.OneDriveConfiguration != null ? CfnDataSourceOneDriveConfigurationPropertyFromCloudFormation(properties.OneDriveConfiguration) : undefined));
  ret.addPropertyResult("s3Configuration", "S3Configuration", (properties.S3Configuration != null ? CfnDataSourceS3DataSourceConfigurationPropertyFromCloudFormation(properties.S3Configuration) : undefined));
  ret.addPropertyResult("salesforceConfiguration", "SalesforceConfiguration", (properties.SalesforceConfiguration != null ? CfnDataSourceSalesforceConfigurationPropertyFromCloudFormation(properties.SalesforceConfiguration) : undefined));
  ret.addPropertyResult("serviceNowConfiguration", "ServiceNowConfiguration", (properties.ServiceNowConfiguration != null ? CfnDataSourceServiceNowConfigurationPropertyFromCloudFormation(properties.ServiceNowConfiguration) : undefined));
  ret.addPropertyResult("sharePointConfiguration", "SharePointConfiguration", (properties.SharePointConfiguration != null ? CfnDataSourceSharePointConfigurationPropertyFromCloudFormation(properties.SharePointConfiguration) : undefined));
  ret.addPropertyResult("templateConfiguration", "TemplateConfiguration", (properties.TemplateConfiguration != null ? CfnDataSourceTemplateConfigurationPropertyFromCloudFormation(properties.TemplateConfiguration) : undefined));
  ret.addPropertyResult("webCrawlerConfiguration", "WebCrawlerConfiguration", (properties.WebCrawlerConfiguration != null ? CfnDataSourceWebCrawlerConfigurationPropertyFromCloudFormation(properties.WebCrawlerConfiguration) : undefined));
  ret.addPropertyResult("workDocsConfiguration", "WorkDocsConfiguration", (properties.WorkDocsConfiguration != null ? CfnDataSourceWorkDocsConfigurationPropertyFromCloudFormation(properties.WorkDocsConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDataSourceProps`
 *
 * @param properties - the TypeScript properties of a `CfnDataSourceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDataSourcePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customDocumentEnrichmentConfiguration", CfnDataSourceCustomDocumentEnrichmentConfigurationPropertyValidator)(properties.customDocumentEnrichmentConfiguration));
  errors.collect(cdk.propertyValidator("dataSourceConfiguration", CfnDataSourceDataSourceConfigurationPropertyValidator)(properties.dataSourceConfiguration));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("indexId", cdk.requiredValidator)(properties.indexId));
  errors.collect(cdk.propertyValidator("indexId", cdk.validateString)(properties.indexId));
  errors.collect(cdk.propertyValidator("languageCode", cdk.validateString)(properties.languageCode));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("schedule", cdk.validateString)(properties.schedule));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnDataSourceProps\"");
}

// @ts-ignore TS6133
function convertCfnDataSourcePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDataSourcePropsValidator(properties).assertSuccess();
  return {
    "CustomDocumentEnrichmentConfiguration": convertCfnDataSourceCustomDocumentEnrichmentConfigurationPropertyToCloudFormation(properties.customDocumentEnrichmentConfiguration),
    "DataSourceConfiguration": convertCfnDataSourceDataSourceConfigurationPropertyToCloudFormation(properties.dataSourceConfiguration),
    "Description": cdk.stringToCloudFormation(properties.description),
    "IndexId": cdk.stringToCloudFormation(properties.indexId),
    "LanguageCode": cdk.stringToCloudFormation(properties.languageCode),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Schedule": cdk.stringToCloudFormation(properties.schedule),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDataSourcePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataSourceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataSourceProps>();
  ret.addPropertyResult("customDocumentEnrichmentConfiguration", "CustomDocumentEnrichmentConfiguration", (properties.CustomDocumentEnrichmentConfiguration != null ? CfnDataSourceCustomDocumentEnrichmentConfigurationPropertyFromCloudFormation(properties.CustomDocumentEnrichmentConfiguration) : undefined));
  ret.addPropertyResult("dataSourceConfiguration", "DataSourceConfiguration", (properties.DataSourceConfiguration != null ? CfnDataSourceDataSourceConfigurationPropertyFromCloudFormation(properties.DataSourceConfiguration) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("indexId", "IndexId", (properties.IndexId != null ? cfn_parse.FromCloudFormation.getString(properties.IndexId) : undefined));
  ret.addPropertyResult("languageCode", "LanguageCode", (properties.LanguageCode != null ? cfn_parse.FromCloudFormation.getString(properties.LanguageCode) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("schedule", "Schedule", (properties.Schedule != null ? cfn_parse.FromCloudFormation.getString(properties.Schedule) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an new set of frequently asked question (FAQ) questions and answers.
 *
 * @cloudformationResource AWS::Kendra::Faq
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-faq.html
 */
export class CfnFaq extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Kendra::Faq";

  /**
   * Build a CfnFaq from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFaq {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFaqPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFaq(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * `arn:aws:kendra:us-west-2:111122223333:index/335c3741-41df-46a6-b5d3-61f85b787884/faq/f61995a6-cd5c-4e99-9cfc-58816d8bfaa7`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The identifier for the FAQ. For example:
   *
   * `f61995a6-cd5c-4e99-9cfc-58816d8bfaa7`
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A description for the FAQ.
   */
  public description?: string;

  /**
   * The format of the input file.
   */
  public fileFormat?: string;

  /**
   * The identifier of the index that contains the FAQ.
   */
  public indexId: string;

  /**
   * The name that you assigned the FAQ when you created or updated the FAQ.
   */
  public name: string;

  /**
   * The Amazon Resource Name (ARN) of a role with permission to access the S3 bucket that contains the FAQ.
   */
  public roleArn: string;

  /**
   * The Amazon Simple Storage Service (Amazon S3) location of the FAQ input data.
   */
  public s3Path: cdk.IResolvable | CfnFaq.S3PathProperty;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnFaqProps) {
    super(scope, id, {
      "type": CfnFaq.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "indexId", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "roleArn", this);
    cdk.requireProperty(props, "s3Path", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.fileFormat = props.fileFormat;
    this.indexId = props.indexId;
    this.name = props.name;
    this.roleArn = props.roleArn;
    this.s3Path = props.s3Path;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Kendra::Faq", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "fileFormat": this.fileFormat,
      "indexId": this.indexId,
      "name": this.name,
      "roleArn": this.roleArn,
      "s3Path": this.s3Path,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFaq.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFaqPropsToCloudFormation(props);
  }
}

export namespace CfnFaq {
  /**
   * Information required to find a specific file in an Amazon S3 bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-faq-s3path.html
   */
  export interface S3PathProperty {
    /**
     * The name of the S3 bucket that contains the file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-faq-s3path.html#cfn-kendra-faq-s3path-bucket
     */
    readonly bucket: string;

    /**
     * The name of the file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-faq-s3path.html#cfn-kendra-faq-s3path-key
     */
    readonly key: string;
  }
}

/**
 * Properties for defining a `CfnFaq`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-faq.html
 */
export interface CfnFaqProps {
  /**
   * A description for the FAQ.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-faq.html#cfn-kendra-faq-description
   */
  readonly description?: string;

  /**
   * The format of the input file.
   *
   * You can choose between a basic CSV format, a CSV format that includes customs attributes in a header, and a JSON format that includes custom attributes.
   *
   * The format must match the format of the file stored in the S3 bucket identified in the S3Path parameter.
   *
   * Valid values are:
   *
   * - `CSV`
   * - `CSV_WITH_HEADER`
   * - `JSON`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-faq.html#cfn-kendra-faq-fileformat
   */
  readonly fileFormat?: string;

  /**
   * The identifier of the index that contains the FAQ.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-faq.html#cfn-kendra-faq-indexid
   */
  readonly indexId: string;

  /**
   * The name that you assigned the FAQ when you created or updated the FAQ.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-faq.html#cfn-kendra-faq-name
   */
  readonly name: string;

  /**
   * The Amazon Resource Name (ARN) of a role with permission to access the S3 bucket that contains the FAQ.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-faq.html#cfn-kendra-faq-rolearn
   */
  readonly roleArn: string;

  /**
   * The Amazon Simple Storage Service (Amazon S3) location of the FAQ input data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-faq.html#cfn-kendra-faq-s3path
   */
  readonly s3Path: cdk.IResolvable | CfnFaq.S3PathProperty;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-faq.html#cfn-kendra-faq-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `S3PathProperty`
 *
 * @param properties - the TypeScript properties of a `S3PathProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFaqS3PathPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  return errors.wrap("supplied properties not correct for \"S3PathProperty\"");
}

// @ts-ignore TS6133
function convertCfnFaqS3PathPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFaqS3PathPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key)
  };
}

// @ts-ignore TS6133
function CfnFaqS3PathPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFaq.S3PathProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFaq.S3PathProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFaqProps`
 *
 * @param properties - the TypeScript properties of a `CfnFaqProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFaqPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("fileFormat", cdk.validateString)(properties.fileFormat));
  errors.collect(cdk.propertyValidator("indexId", cdk.requiredValidator)(properties.indexId));
  errors.collect(cdk.propertyValidator("indexId", cdk.validateString)(properties.indexId));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("s3Path", cdk.requiredValidator)(properties.s3Path));
  errors.collect(cdk.propertyValidator("s3Path", CfnFaqS3PathPropertyValidator)(properties.s3Path));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnFaqProps\"");
}

// @ts-ignore TS6133
function convertCfnFaqPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFaqPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "FileFormat": cdk.stringToCloudFormation(properties.fileFormat),
    "IndexId": cdk.stringToCloudFormation(properties.indexId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "S3Path": convertCfnFaqS3PathPropertyToCloudFormation(properties.s3Path),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnFaqPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFaqProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFaqProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("fileFormat", "FileFormat", (properties.FileFormat != null ? cfn_parse.FromCloudFormation.getString(properties.FileFormat) : undefined));
  ret.addPropertyResult("indexId", "IndexId", (properties.IndexId != null ? cfn_parse.FromCloudFormation.getString(properties.IndexId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("s3Path", "S3Path", (properties.S3Path != null ? CfnFaqS3PathPropertyFromCloudFormation(properties.S3Path) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an Amazon Kendra index.
 *
 * Once the index is active you can add documents to your index using the [BatchPutDocument](https://docs.aws.amazon.com/kendra/latest/dg/BatchPutDocument.html) operation or using one of the supported data sources.
 *
 * @cloudformationResource AWS::Kendra::Index
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-index.html
 */
export class CfnIndex extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Kendra::Index";

  /**
   * Build a CfnIndex from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIndex {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIndexPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIndex(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the index. For example: `arn:aws:kendra:us-west-2:111122223333:index/0123456789abcdef` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The identifier for the index. For example: `f4aeaa10-8056-4b2c-a343-522ca0f41234` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Specifies additional capacity units configured for your Enterprise Edition index.
   */
  public capacityUnits?: CfnIndex.CapacityUnitsConfigurationProperty | cdk.IResolvable;

  /**
   * A description for the index.
   */
  public description?: string;

  /**
   * Specifies the properties of an index field.
   */
  public documentMetadataConfigurations?: Array<CfnIndex.DocumentMetadataConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Indicates whether the index is a Enterprise Edition index or a Developer Edition index.
   */
  public edition: string;

  /**
   * The name of the index.
   */
  public name: string;

  /**
   * An IAM role that gives Amazon Kendra permissions to access your Amazon CloudWatch logs and metrics.
   */
  public roleArn: string;

  /**
   * The identifier of the AWS KMS customer managed key (CMK) to use to encrypt data indexed by Amazon Kendra.
   */
  public serverSideEncryptionConfiguration?: cdk.IResolvable | CfnIndex.ServerSideEncryptionConfigurationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The user context policy.
   */
  public userContextPolicy?: string;

  /**
   * Defines the type of user token used for the index.
   */
  public userTokenConfigurations?: Array<cdk.IResolvable | CfnIndex.UserTokenConfigurationProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIndexProps) {
    super(scope, id, {
      "type": CfnIndex.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "edition", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "roleArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.capacityUnits = props.capacityUnits;
    this.description = props.description;
    this.documentMetadataConfigurations = props.documentMetadataConfigurations;
    this.edition = props.edition;
    this.name = props.name;
    this.roleArn = props.roleArn;
    this.serverSideEncryptionConfiguration = props.serverSideEncryptionConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Kendra::Index", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.userContextPolicy = props.userContextPolicy;
    this.userTokenConfigurations = props.userTokenConfigurations;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "capacityUnits": this.capacityUnits,
      "description": this.description,
      "documentMetadataConfigurations": this.documentMetadataConfigurations,
      "edition": this.edition,
      "name": this.name,
      "roleArn": this.roleArn,
      "serverSideEncryptionConfiguration": this.serverSideEncryptionConfiguration,
      "tags": this.tags.renderTags(),
      "userContextPolicy": this.userContextPolicy,
      "userTokenConfigurations": this.userTokenConfigurations
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIndex.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIndexPropsToCloudFormation(props);
  }
}

export namespace CfnIndex {
  /**
   * Specifies additional capacity units configured for your Enterprise Edition index.
   *
   * You can add and remove capacity units to fit your usage requirements.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-capacityunitsconfiguration.html
   */
  export interface CapacityUnitsConfigurationProperty {
    /**
     * The amount of extra query capacity for an index and [GetQuerySuggestions](https://docs.aws.amazon.com/kendra/latest/dg/API_GetQuerySuggestions.html) capacity.
     *
     * A single extra capacity unit for an index provides 0.1 queries per second or approximately 8,000 queries per day. You can add up to 100 extra capacity units.
     *
     * `GetQuerySuggestions` capacity is five times the provisioned query capacity for an index, or the base capacity of 2.5 calls per second, whichever is higher. For example, the base capacity for an index is 0.1 queries per second, and `GetQuerySuggestions` capacity has a base of 2.5 calls per second. If you add another 0.1 queries per second to total 0.2 queries per second for an index, the `GetQuerySuggestions` capacity is 2.5 calls per second (higher than five times 0.2 queries per second).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-capacityunitsconfiguration.html#cfn-kendra-index-capacityunitsconfiguration-querycapacityunits
     */
    readonly queryCapacityUnits: number;

    /**
     * The amount of extra storage capacity for an index.
     *
     * A single capacity unit provides 30 GB of storage space or 100,000 documents, whichever is reached first. You can add up to 100 extra capacity units.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-capacityunitsconfiguration.html#cfn-kendra-index-capacityunitsconfiguration-storagecapacityunits
     */
    readonly storageCapacityUnits: number;
  }

  /**
   * Provides the identifier of the AWS KMS customer master key (CMK) used to encrypt data indexed by Amazon Kendra.
   *
   * We suggest that you use a CMK from your account to help secure your index. Amazon Kendra doesn't support asymmetric CMKs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-serversideencryptionconfiguration.html
   */
  export interface ServerSideEncryptionConfigurationProperty {
    /**
     * The identifier of the AWS KMS key .
     *
     * Amazon Kendra doesn't support asymmetric keys.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-serversideencryptionconfiguration.html#cfn-kendra-index-serversideencryptionconfiguration-kmskeyid
     */
    readonly kmsKeyId?: string;
  }

  /**
   * Specifies the properties, such as relevance tuning and searchability, of an index field.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-documentmetadataconfiguration.html
   */
  export interface DocumentMetadataConfigurationProperty {
    /**
     * The name of the index field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-documentmetadataconfiguration.html#cfn-kendra-index-documentmetadataconfiguration-name
     */
    readonly name: string;

    /**
     * Provides tuning parameters to determine how the field affects the search results.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-documentmetadataconfiguration.html#cfn-kendra-index-documentmetadataconfiguration-relevance
     */
    readonly relevance?: cdk.IResolvable | CfnIndex.RelevanceProperty;

    /**
     * Provides information about how the field is used during a search.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-documentmetadataconfiguration.html#cfn-kendra-index-documentmetadataconfiguration-search
     */
    readonly search?: cdk.IResolvable | CfnIndex.SearchProperty;

    /**
     * The data type of the index field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-documentmetadataconfiguration.html#cfn-kendra-index-documentmetadataconfiguration-type
     */
    readonly type: string;
  }

  /**
   * Provides information for tuning the relevance of a field in a search.
   *
   * When a query includes terms that match the field, the results are given a boost in the response based on these tuning parameters.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-relevance.html
   */
  export interface RelevanceProperty {
    /**
     * Specifies the time period that the boost applies to.
     *
     * For example, to make the boost apply to documents with the field value within the last month, you would use "2628000s". Once the field value is beyond the specified range, the effect of the boost drops off. The higher the importance, the faster the effect drops off. If you don't specify a value, the default is 3 months. The value of the field is a numeric string followed by the character "s", for example "86400s" for one day, or "604800s" for one week.
     *
     * Only applies to `DATE` fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-relevance.html#cfn-kendra-index-relevance-duration
     */
    readonly duration?: string;

    /**
     * Indicates that this field determines how "fresh" a document is.
     *
     * For example, if document 1 was created on November 5, and document 2 was created on October 31, document 1 is "fresher" than document 2. You can only set the `Freshness` field on one `DATE` type field. Only applies to `DATE` fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-relevance.html#cfn-kendra-index-relevance-freshness
     */
    readonly freshness?: boolean | cdk.IResolvable;

    /**
     * The relative importance of the field in the search.
     *
     * Larger numbers provide more of a boost than smaller numbers.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-relevance.html#cfn-kendra-index-relevance-importance
     */
    readonly importance?: number;

    /**
     * Determines how values should be interpreted.
     *
     * When the `RankOrder` field is `ASCENDING` , higher numbers are better. For example, a document with a rating score of 10 is higher ranking than a document with a rating score of 1.
     *
     * When the `RankOrder` field is `DESCENDING` , lower numbers are better. For example, in a task tracking application, a priority 1 task is more important than a priority 5 task.
     *
     * Only applies to `LONG` and `DOUBLE` fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-relevance.html#cfn-kendra-index-relevance-rankorder
     */
    readonly rankOrder?: string;

    /**
     * An array of key-value pairs for different boosts when they appear in the search result list.
     *
     * For example, if you want to boost query terms that match the "department" field in the result, query terms that match this field are boosted in the result. You can add entries from the department field to boost documents with those values higher.
     *
     * For example, you can add entries to the map with names of departments. If you add "HR", 5 and "Legal",3 those departments are given special attention when they appear in the metadata of a document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-relevance.html#cfn-kendra-index-relevance-valueimportanceitems
     */
    readonly valueImportanceItems?: Array<cdk.IResolvable | CfnIndex.ValueImportanceItemProperty> | cdk.IResolvable;
  }

  /**
   * Specifies a key-value pair of the search boost value for a document when the key is part of the metadata of a document.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-valueimportanceitem.html
   */
  export interface ValueImportanceItemProperty {
    /**
     * The document metadata value used for the search boost.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-valueimportanceitem.html#cfn-kendra-index-valueimportanceitem-key
     */
    readonly key?: string;

    /**
     * The boost value for a document when the key is part of the metadata of a document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-valueimportanceitem.html#cfn-kendra-index-valueimportanceitem-value
     */
    readonly value?: number;
  }

  /**
   * Provides information about how a custom index field is used during a search.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-search.html
   */
  export interface SearchProperty {
    /**
     * Determines whether the field is returned in the query response.
     *
     * The default is `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-search.html#cfn-kendra-index-search-displayable
     */
    readonly displayable?: boolean | cdk.IResolvable;

    /**
     * Indicates that the field can be used to create search facets, a count of results for each value in the field.
     *
     * The default is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-search.html#cfn-kendra-index-search-facetable
     */
    readonly facetable?: boolean | cdk.IResolvable;

    /**
     * Determines whether the field is used in the search.
     *
     * If the `Searchable` field is `true` , you can use relevance tuning to manually tune how Amazon Kendra weights the field in the search. The default is `true` for string fields and `false` for number and date fields.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-search.html#cfn-kendra-index-search-searchable
     */
    readonly searchable?: boolean | cdk.IResolvable;

    /**
     * Determines whether the field can be used to sort the results of a query.
     *
     * The default is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-search.html#cfn-kendra-index-search-sortable
     */
    readonly sortable?: boolean | cdk.IResolvable;
  }

  /**
   * Provides the configuration information for a token.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-usertokenconfiguration.html
   */
  export interface UserTokenConfigurationProperty {
    /**
     * Information about the JSON token type configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-usertokenconfiguration.html#cfn-kendra-index-usertokenconfiguration-jsontokentypeconfiguration
     */
    readonly jsonTokenTypeConfiguration?: cdk.IResolvable | CfnIndex.JsonTokenTypeConfigurationProperty;

    /**
     * Information about the JWT token type configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-usertokenconfiguration.html#cfn-kendra-index-usertokenconfiguration-jwttokentypeconfiguration
     */
    readonly jwtTokenTypeConfiguration?: cdk.IResolvable | CfnIndex.JwtTokenTypeConfigurationProperty;
  }

  /**
   * Provides the configuration information for the JWT token type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-jwttokentypeconfiguration.html
   */
  export interface JwtTokenTypeConfigurationProperty {
    /**
     * The regular expression that identifies the claim.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-jwttokentypeconfiguration.html#cfn-kendra-index-jwttokentypeconfiguration-claimregex
     */
    readonly claimRegex?: string;

    /**
     * The group attribute field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-jwttokentypeconfiguration.html#cfn-kendra-index-jwttokentypeconfiguration-groupattributefield
     */
    readonly groupAttributeField?: string;

    /**
     * The issuer of the token.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-jwttokentypeconfiguration.html#cfn-kendra-index-jwttokentypeconfiguration-issuer
     */
    readonly issuer?: string;

    /**
     * The location of the key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-jwttokentypeconfiguration.html#cfn-kendra-index-jwttokentypeconfiguration-keylocation
     */
    readonly keyLocation: string;

    /**
     * The Amazon Resource Name (arn) of the secret.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-jwttokentypeconfiguration.html#cfn-kendra-index-jwttokentypeconfiguration-secretmanagerarn
     */
    readonly secretManagerArn?: string;

    /**
     * The signing key URL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-jwttokentypeconfiguration.html#cfn-kendra-index-jwttokentypeconfiguration-url
     */
    readonly url?: string;

    /**
     * The user name attribute field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-jwttokentypeconfiguration.html#cfn-kendra-index-jwttokentypeconfiguration-usernameattributefield
     */
    readonly userNameAttributeField?: string;
  }

  /**
   * Provides the configuration information for the JSON token type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-jsontokentypeconfiguration.html
   */
  export interface JsonTokenTypeConfigurationProperty {
    /**
     * The group attribute field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-jsontokentypeconfiguration.html#cfn-kendra-index-jsontokentypeconfiguration-groupattributefield
     */
    readonly groupAttributeField: string;

    /**
     * The user name attribute field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kendra-index-jsontokentypeconfiguration.html#cfn-kendra-index-jsontokentypeconfiguration-usernameattributefield
     */
    readonly userNameAttributeField: string;
  }
}

/**
 * Properties for defining a `CfnIndex`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-index.html
 */
export interface CfnIndexProps {
  /**
   * Specifies additional capacity units configured for your Enterprise Edition index.
   *
   * You can add and remove capacity units to fit your usage requirements.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-index.html#cfn-kendra-index-capacityunits
   */
  readonly capacityUnits?: CfnIndex.CapacityUnitsConfigurationProperty | cdk.IResolvable;

  /**
   * A description for the index.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-index.html#cfn-kendra-index-description
   */
  readonly description?: string;

  /**
   * Specifies the properties of an index field.
   *
   * You can add either a custom or a built-in field. You can add and remove built-in fields at any time. When a built-in field is removed it's configuration reverts to the default for the field. Custom fields can't be removed from an index after they are added.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-index.html#cfn-kendra-index-documentmetadataconfigurations
   */
  readonly documentMetadataConfigurations?: Array<CfnIndex.DocumentMetadataConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Indicates whether the index is a Enterprise Edition index or a Developer Edition index.
   *
   * Valid values are `DEVELOPER_EDITION` and `ENTERPRISE_EDITION` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-index.html#cfn-kendra-index-edition
   */
  readonly edition: string;

  /**
   * The name of the index.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-index.html#cfn-kendra-index-name
   */
  readonly name: string;

  /**
   * An IAM role that gives Amazon Kendra permissions to access your Amazon CloudWatch logs and metrics.
   *
   * This is also the role used when you use the [BatchPutDocument](https://docs.aws.amazon.com/kendra/latest/dg/BatchPutDocument.html) operation to index documents from an Amazon S3 bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-index.html#cfn-kendra-index-rolearn
   */
  readonly roleArn: string;

  /**
   * The identifier of the AWS KMS customer managed key (CMK) to use to encrypt data indexed by Amazon Kendra.
   *
   * Amazon Kendra doesn't support asymmetric CMKs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-index.html#cfn-kendra-index-serversideencryptionconfiguration
   */
  readonly serverSideEncryptionConfiguration?: cdk.IResolvable | CfnIndex.ServerSideEncryptionConfigurationProperty;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-index.html#cfn-kendra-index-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The user context policy.
   *
   * ATTRIBUTE_FILTER
   *
   * - All indexed content is searchable and displayable for all users. If you want to filter search results on user context, you can use the attribute filters of `_user_id` and `_group_ids` or you can provide user and group information in `UserContext` .
   *
   * USER_TOKEN
   *
   * - Enables token-based user access control to filter search results on user context. All documents with no access control and all documents accessible to the user will be searchable and displayable.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-index.html#cfn-kendra-index-usercontextpolicy
   */
  readonly userContextPolicy?: string;

  /**
   * Defines the type of user token used for the index.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kendra-index.html#cfn-kendra-index-usertokenconfigurations
   */
  readonly userTokenConfigurations?: Array<cdk.IResolvable | CfnIndex.UserTokenConfigurationProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CapacityUnitsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CapacityUnitsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIndexCapacityUnitsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("queryCapacityUnits", cdk.requiredValidator)(properties.queryCapacityUnits));
  errors.collect(cdk.propertyValidator("queryCapacityUnits", cdk.validateNumber)(properties.queryCapacityUnits));
  errors.collect(cdk.propertyValidator("storageCapacityUnits", cdk.requiredValidator)(properties.storageCapacityUnits));
  errors.collect(cdk.propertyValidator("storageCapacityUnits", cdk.validateNumber)(properties.storageCapacityUnits));
  return errors.wrap("supplied properties not correct for \"CapacityUnitsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnIndexCapacityUnitsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIndexCapacityUnitsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "QueryCapacityUnits": cdk.numberToCloudFormation(properties.queryCapacityUnits),
    "StorageCapacityUnits": cdk.numberToCloudFormation(properties.storageCapacityUnits)
  };
}

// @ts-ignore TS6133
function CfnIndexCapacityUnitsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIndex.CapacityUnitsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIndex.CapacityUnitsConfigurationProperty>();
  ret.addPropertyResult("queryCapacityUnits", "QueryCapacityUnits", (properties.QueryCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.QueryCapacityUnits) : undefined));
  ret.addPropertyResult("storageCapacityUnits", "StorageCapacityUnits", (properties.StorageCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.StorageCapacityUnits) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ServerSideEncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ServerSideEncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIndexServerSideEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  return errors.wrap("supplied properties not correct for \"ServerSideEncryptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnIndexServerSideEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIndexServerSideEncryptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId)
  };
}

// @ts-ignore TS6133
function CfnIndexServerSideEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIndex.ServerSideEncryptionConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIndex.ServerSideEncryptionConfigurationProperty>();
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ValueImportanceItemProperty`
 *
 * @param properties - the TypeScript properties of a `ValueImportanceItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIndexValueImportanceItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateNumber)(properties.value));
  return errors.wrap("supplied properties not correct for \"ValueImportanceItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnIndexValueImportanceItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIndexValueImportanceItemPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.numberToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnIndexValueImportanceItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIndex.ValueImportanceItemProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIndex.ValueImportanceItemProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getNumber(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RelevanceProperty`
 *
 * @param properties - the TypeScript properties of a `RelevanceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIndexRelevancePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("duration", cdk.validateString)(properties.duration));
  errors.collect(cdk.propertyValidator("freshness", cdk.validateBoolean)(properties.freshness));
  errors.collect(cdk.propertyValidator("importance", cdk.validateNumber)(properties.importance));
  errors.collect(cdk.propertyValidator("rankOrder", cdk.validateString)(properties.rankOrder));
  errors.collect(cdk.propertyValidator("valueImportanceItems", cdk.listValidator(CfnIndexValueImportanceItemPropertyValidator))(properties.valueImportanceItems));
  return errors.wrap("supplied properties not correct for \"RelevanceProperty\"");
}

// @ts-ignore TS6133
function convertCfnIndexRelevancePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIndexRelevancePropertyValidator(properties).assertSuccess();
  return {
    "Duration": cdk.stringToCloudFormation(properties.duration),
    "Freshness": cdk.booleanToCloudFormation(properties.freshness),
    "Importance": cdk.numberToCloudFormation(properties.importance),
    "RankOrder": cdk.stringToCloudFormation(properties.rankOrder),
    "ValueImportanceItems": cdk.listMapper(convertCfnIndexValueImportanceItemPropertyToCloudFormation)(properties.valueImportanceItems)
  };
}

// @ts-ignore TS6133
function CfnIndexRelevancePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIndex.RelevanceProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIndex.RelevanceProperty>();
  ret.addPropertyResult("duration", "Duration", (properties.Duration != null ? cfn_parse.FromCloudFormation.getString(properties.Duration) : undefined));
  ret.addPropertyResult("freshness", "Freshness", (properties.Freshness != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Freshness) : undefined));
  ret.addPropertyResult("importance", "Importance", (properties.Importance != null ? cfn_parse.FromCloudFormation.getNumber(properties.Importance) : undefined));
  ret.addPropertyResult("rankOrder", "RankOrder", (properties.RankOrder != null ? cfn_parse.FromCloudFormation.getString(properties.RankOrder) : undefined));
  ret.addPropertyResult("valueImportanceItems", "ValueImportanceItems", (properties.ValueImportanceItems != null ? cfn_parse.FromCloudFormation.getArray(CfnIndexValueImportanceItemPropertyFromCloudFormation)(properties.ValueImportanceItems) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SearchProperty`
 *
 * @param properties - the TypeScript properties of a `SearchProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIndexSearchPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("displayable", cdk.validateBoolean)(properties.displayable));
  errors.collect(cdk.propertyValidator("facetable", cdk.validateBoolean)(properties.facetable));
  errors.collect(cdk.propertyValidator("searchable", cdk.validateBoolean)(properties.searchable));
  errors.collect(cdk.propertyValidator("sortable", cdk.validateBoolean)(properties.sortable));
  return errors.wrap("supplied properties not correct for \"SearchProperty\"");
}

// @ts-ignore TS6133
function convertCfnIndexSearchPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIndexSearchPropertyValidator(properties).assertSuccess();
  return {
    "Displayable": cdk.booleanToCloudFormation(properties.displayable),
    "Facetable": cdk.booleanToCloudFormation(properties.facetable),
    "Searchable": cdk.booleanToCloudFormation(properties.searchable),
    "Sortable": cdk.booleanToCloudFormation(properties.sortable)
  };
}

// @ts-ignore TS6133
function CfnIndexSearchPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIndex.SearchProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIndex.SearchProperty>();
  ret.addPropertyResult("displayable", "Displayable", (properties.Displayable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Displayable) : undefined));
  ret.addPropertyResult("facetable", "Facetable", (properties.Facetable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Facetable) : undefined));
  ret.addPropertyResult("searchable", "Searchable", (properties.Searchable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Searchable) : undefined));
  ret.addPropertyResult("sortable", "Sortable", (properties.Sortable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Sortable) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DocumentMetadataConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DocumentMetadataConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIndexDocumentMetadataConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("relevance", CfnIndexRelevancePropertyValidator)(properties.relevance));
  errors.collect(cdk.propertyValidator("search", CfnIndexSearchPropertyValidator)(properties.search));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"DocumentMetadataConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnIndexDocumentMetadataConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIndexDocumentMetadataConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Relevance": convertCfnIndexRelevancePropertyToCloudFormation(properties.relevance),
    "Search": convertCfnIndexSearchPropertyToCloudFormation(properties.search),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnIndexDocumentMetadataConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIndex.DocumentMetadataConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIndex.DocumentMetadataConfigurationProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("relevance", "Relevance", (properties.Relevance != null ? CfnIndexRelevancePropertyFromCloudFormation(properties.Relevance) : undefined));
  ret.addPropertyResult("search", "Search", (properties.Search != null ? CfnIndexSearchPropertyFromCloudFormation(properties.Search) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JwtTokenTypeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `JwtTokenTypeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIndexJwtTokenTypeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("claimRegex", cdk.validateString)(properties.claimRegex));
  errors.collect(cdk.propertyValidator("groupAttributeField", cdk.validateString)(properties.groupAttributeField));
  errors.collect(cdk.propertyValidator("issuer", cdk.validateString)(properties.issuer));
  errors.collect(cdk.propertyValidator("keyLocation", cdk.requiredValidator)(properties.keyLocation));
  errors.collect(cdk.propertyValidator("keyLocation", cdk.validateString)(properties.keyLocation));
  errors.collect(cdk.propertyValidator("secretManagerArn", cdk.validateString)(properties.secretManagerArn));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  errors.collect(cdk.propertyValidator("userNameAttributeField", cdk.validateString)(properties.userNameAttributeField));
  return errors.wrap("supplied properties not correct for \"JwtTokenTypeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnIndexJwtTokenTypeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIndexJwtTokenTypeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ClaimRegex": cdk.stringToCloudFormation(properties.claimRegex),
    "GroupAttributeField": cdk.stringToCloudFormation(properties.groupAttributeField),
    "Issuer": cdk.stringToCloudFormation(properties.issuer),
    "KeyLocation": cdk.stringToCloudFormation(properties.keyLocation),
    "SecretManagerArn": cdk.stringToCloudFormation(properties.secretManagerArn),
    "URL": cdk.stringToCloudFormation(properties.url),
    "UserNameAttributeField": cdk.stringToCloudFormation(properties.userNameAttributeField)
  };
}

// @ts-ignore TS6133
function CfnIndexJwtTokenTypeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIndex.JwtTokenTypeConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIndex.JwtTokenTypeConfigurationProperty>();
  ret.addPropertyResult("claimRegex", "ClaimRegex", (properties.ClaimRegex != null ? cfn_parse.FromCloudFormation.getString(properties.ClaimRegex) : undefined));
  ret.addPropertyResult("groupAttributeField", "GroupAttributeField", (properties.GroupAttributeField != null ? cfn_parse.FromCloudFormation.getString(properties.GroupAttributeField) : undefined));
  ret.addPropertyResult("issuer", "Issuer", (properties.Issuer != null ? cfn_parse.FromCloudFormation.getString(properties.Issuer) : undefined));
  ret.addPropertyResult("keyLocation", "KeyLocation", (properties.KeyLocation != null ? cfn_parse.FromCloudFormation.getString(properties.KeyLocation) : undefined));
  ret.addPropertyResult("secretManagerArn", "SecretManagerArn", (properties.SecretManagerArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretManagerArn) : undefined));
  ret.addPropertyResult("url", "URL", (properties.URL != null ? cfn_parse.FromCloudFormation.getString(properties.URL) : undefined));
  ret.addPropertyResult("userNameAttributeField", "UserNameAttributeField", (properties.UserNameAttributeField != null ? cfn_parse.FromCloudFormation.getString(properties.UserNameAttributeField) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `JsonTokenTypeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `JsonTokenTypeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIndexJsonTokenTypeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("groupAttributeField", cdk.requiredValidator)(properties.groupAttributeField));
  errors.collect(cdk.propertyValidator("groupAttributeField", cdk.validateString)(properties.groupAttributeField));
  errors.collect(cdk.propertyValidator("userNameAttributeField", cdk.requiredValidator)(properties.userNameAttributeField));
  errors.collect(cdk.propertyValidator("userNameAttributeField", cdk.validateString)(properties.userNameAttributeField));
  return errors.wrap("supplied properties not correct for \"JsonTokenTypeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnIndexJsonTokenTypeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIndexJsonTokenTypeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "GroupAttributeField": cdk.stringToCloudFormation(properties.groupAttributeField),
    "UserNameAttributeField": cdk.stringToCloudFormation(properties.userNameAttributeField)
  };
}

// @ts-ignore TS6133
function CfnIndexJsonTokenTypeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIndex.JsonTokenTypeConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIndex.JsonTokenTypeConfigurationProperty>();
  ret.addPropertyResult("groupAttributeField", "GroupAttributeField", (properties.GroupAttributeField != null ? cfn_parse.FromCloudFormation.getString(properties.GroupAttributeField) : undefined));
  ret.addPropertyResult("userNameAttributeField", "UserNameAttributeField", (properties.UserNameAttributeField != null ? cfn_parse.FromCloudFormation.getString(properties.UserNameAttributeField) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `UserTokenConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `UserTokenConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIndexUserTokenConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("jsonTokenTypeConfiguration", CfnIndexJsonTokenTypeConfigurationPropertyValidator)(properties.jsonTokenTypeConfiguration));
  errors.collect(cdk.propertyValidator("jwtTokenTypeConfiguration", CfnIndexJwtTokenTypeConfigurationPropertyValidator)(properties.jwtTokenTypeConfiguration));
  return errors.wrap("supplied properties not correct for \"UserTokenConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnIndexUserTokenConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIndexUserTokenConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "JsonTokenTypeConfiguration": convertCfnIndexJsonTokenTypeConfigurationPropertyToCloudFormation(properties.jsonTokenTypeConfiguration),
    "JwtTokenTypeConfiguration": convertCfnIndexJwtTokenTypeConfigurationPropertyToCloudFormation(properties.jwtTokenTypeConfiguration)
  };
}

// @ts-ignore TS6133
function CfnIndexUserTokenConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIndex.UserTokenConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIndex.UserTokenConfigurationProperty>();
  ret.addPropertyResult("jsonTokenTypeConfiguration", "JsonTokenTypeConfiguration", (properties.JsonTokenTypeConfiguration != null ? CfnIndexJsonTokenTypeConfigurationPropertyFromCloudFormation(properties.JsonTokenTypeConfiguration) : undefined));
  ret.addPropertyResult("jwtTokenTypeConfiguration", "JwtTokenTypeConfiguration", (properties.JwtTokenTypeConfiguration != null ? CfnIndexJwtTokenTypeConfigurationPropertyFromCloudFormation(properties.JwtTokenTypeConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnIndexProps`
 *
 * @param properties - the TypeScript properties of a `CfnIndexProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIndexPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("capacityUnits", CfnIndexCapacityUnitsConfigurationPropertyValidator)(properties.capacityUnits));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("documentMetadataConfigurations", cdk.listValidator(CfnIndexDocumentMetadataConfigurationPropertyValidator))(properties.documentMetadataConfigurations));
  errors.collect(cdk.propertyValidator("edition", cdk.requiredValidator)(properties.edition));
  errors.collect(cdk.propertyValidator("edition", cdk.validateString)(properties.edition));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("serverSideEncryptionConfiguration", CfnIndexServerSideEncryptionConfigurationPropertyValidator)(properties.serverSideEncryptionConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("userContextPolicy", cdk.validateString)(properties.userContextPolicy));
  errors.collect(cdk.propertyValidator("userTokenConfigurations", cdk.listValidator(CfnIndexUserTokenConfigurationPropertyValidator))(properties.userTokenConfigurations));
  return errors.wrap("supplied properties not correct for \"CfnIndexProps\"");
}

// @ts-ignore TS6133
function convertCfnIndexPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIndexPropsValidator(properties).assertSuccess();
  return {
    "CapacityUnits": convertCfnIndexCapacityUnitsConfigurationPropertyToCloudFormation(properties.capacityUnits),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DocumentMetadataConfigurations": cdk.listMapper(convertCfnIndexDocumentMetadataConfigurationPropertyToCloudFormation)(properties.documentMetadataConfigurations),
    "Edition": cdk.stringToCloudFormation(properties.edition),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "ServerSideEncryptionConfiguration": convertCfnIndexServerSideEncryptionConfigurationPropertyToCloudFormation(properties.serverSideEncryptionConfiguration),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UserContextPolicy": cdk.stringToCloudFormation(properties.userContextPolicy),
    "UserTokenConfigurations": cdk.listMapper(convertCfnIndexUserTokenConfigurationPropertyToCloudFormation)(properties.userTokenConfigurations)
  };
}

// @ts-ignore TS6133
function CfnIndexPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIndexProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIndexProps>();
  ret.addPropertyResult("capacityUnits", "CapacityUnits", (properties.CapacityUnits != null ? CfnIndexCapacityUnitsConfigurationPropertyFromCloudFormation(properties.CapacityUnits) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("documentMetadataConfigurations", "DocumentMetadataConfigurations", (properties.DocumentMetadataConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnIndexDocumentMetadataConfigurationPropertyFromCloudFormation)(properties.DocumentMetadataConfigurations) : undefined));
  ret.addPropertyResult("edition", "Edition", (properties.Edition != null ? cfn_parse.FromCloudFormation.getString(properties.Edition) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("serverSideEncryptionConfiguration", "ServerSideEncryptionConfiguration", (properties.ServerSideEncryptionConfiguration != null ? CfnIndexServerSideEncryptionConfigurationPropertyFromCloudFormation(properties.ServerSideEncryptionConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("userContextPolicy", "UserContextPolicy", (properties.UserContextPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.UserContextPolicy) : undefined));
  ret.addPropertyResult("userTokenConfigurations", "UserTokenConfigurations", (properties.UserTokenConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnIndexUserTokenConfigurationPropertyFromCloudFormation)(properties.UserTokenConfigurations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}