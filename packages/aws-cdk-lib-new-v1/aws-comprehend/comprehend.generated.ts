/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * This resource creates and trains a document classifier to categorize documents.
 *
 * You provide a set of training documents that are labeled with the categories that you want to identify. After the classifier is trained you can use it to categorize a set of labeled documents into the categories. For more information, see [Document Classification](https://docs.aws.amazon.com/comprehend/latest/dg/how-document-classification.html) in the Comprehend Developer Guide.
 *
 * @cloudformationResource AWS::Comprehend::DocumentClassifier
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-documentclassifier.html
 */
export class CfnDocumentClassifier extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Comprehend::DocumentClassifier";

  /**
   * Build a CfnDocumentClassifier from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDocumentClassifier {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDocumentClassifierPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDocumentClassifier(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the document classifier.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
   */
  public dataAccessRoleArn: string;

  /**
   * The name of the document classifier.
   */
  public documentClassifierName: string;

  /**
   * Specifies the format and location of the input data for the job.
   */
  public inputDataConfig: CfnDocumentClassifier.DocumentClassifierInputDataConfigProperty | cdk.IResolvable;

  /**
   * The language of the input documents.
   */
  public languageCode: string;

  /**
   * Indicates the mode in which the classifier will be trained.
   */
  public mode?: string;

  /**
   * ID for the AWS KMS key that Amazon Comprehend uses to encrypt trained custom models.
   */
  public modelKmsKeyId?: string;

  /**
   * The resource-based policy to attach to your custom document classifier model.
   */
  public modelPolicy?: string;

  /**
   * Provides output results configuration parameters for custom classifier jobs.
   */
  public outputDataConfig?: CfnDocumentClassifier.DocumentClassifierOutputDataConfigProperty | cdk.IResolvable;

  /**
   * Tags to associate with the document classifier.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * The version name given to the newly created classifier.
   */
  public versionName?: string;

  /**
   * ID for the AWS Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job.
   */
  public volumeKmsKeyId?: string;

  /**
   * Configuration parameters for a private Virtual Private Cloud (VPC) containing the resources you are using for your custom classifier.
   */
  public vpcConfig?: cdk.IResolvable | CfnDocumentClassifier.VpcConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDocumentClassifierProps) {
    super(scope, id, {
      "type": CfnDocumentClassifier.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dataAccessRoleArn", this);
    cdk.requireProperty(props, "documentClassifierName", this);
    cdk.requireProperty(props, "inputDataConfig", this);
    cdk.requireProperty(props, "languageCode", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.dataAccessRoleArn = props.dataAccessRoleArn;
    this.documentClassifierName = props.documentClassifierName;
    this.inputDataConfig = props.inputDataConfig;
    this.languageCode = props.languageCode;
    this.mode = props.mode;
    this.modelKmsKeyId = props.modelKmsKeyId;
    this.modelPolicy = props.modelPolicy;
    this.outputDataConfig = props.outputDataConfig;
    this.tags = props.tags;
    this.versionName = props.versionName;
    this.volumeKmsKeyId = props.volumeKmsKeyId;
    this.vpcConfig = props.vpcConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dataAccessRoleArn": this.dataAccessRoleArn,
      "documentClassifierName": this.documentClassifierName,
      "inputDataConfig": this.inputDataConfig,
      "languageCode": this.languageCode,
      "mode": this.mode,
      "modelKmsKeyId": this.modelKmsKeyId,
      "modelPolicy": this.modelPolicy,
      "outputDataConfig": this.outputDataConfig,
      "tags": this.tags,
      "versionName": this.versionName,
      "volumeKmsKeyId": this.volumeKmsKeyId,
      "vpcConfig": this.vpcConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDocumentClassifier.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDocumentClassifierPropsToCloudFormation(props);
  }
}

export namespace CfnDocumentClassifier {
  /**
   * Provide the location for output data from a custom classifier job.
   *
   * This field is mandatory if you are training a native document model.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifieroutputdataconfig.html
   */
  export interface DocumentClassifierOutputDataConfigProperty {
    /**
     * ID for the AWS Key Management Service (KMS) key that Amazon Comprehend uses to encrypt the output results from an analysis job.
     *
     * The KmsKeyId can be one of the following formats:
     *
     * - KMS Key ID: `"1234abcd-12ab-34cd-56ef-1234567890ab"`
     * - Amazon Resource Name (ARN) of a KMS Key: `"arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"`
     * - KMS Key Alias: `"alias/ExampleAlias"`
     * - ARN of a KMS Key Alias: `"arn:aws:kms:us-west-2:111122223333:alias/ExampleAlias"`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifieroutputdataconfig.html#cfn-comprehend-documentclassifier-documentclassifieroutputdataconfig-kmskeyid
     */
    readonly kmsKeyId?: string;

    /**
     * When you use the `OutputDataConfig` object while creating a custom classifier, you specify the Amazon S3 location where you want to write the confusion matrix and other output files.
     *
     * The URI must be in the same Region as the API endpoint that you are calling. The location is used as the prefix for the actual location of this output file.
     *
     * When the custom classifier job is finished, the service creates the output file in a directory specific to the job. The `S3Uri` field contains the location of the output file, called `output.tar.gz` . It is a compressed archive that contains the confusion matrix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifieroutputdataconfig.html#cfn-comprehend-documentclassifier-documentclassifieroutputdataconfig-s3uri
     */
    readonly s3Uri?: string;
  }

  /**
   * Configuration parameters for an optional private Virtual Private Cloud (VPC) containing the resources you are using for the job.
   *
   * For more information, see [Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-vpcconfig.html
   */
  export interface VpcConfigProperty {
    /**
     * The ID number for a security group on an instance of your private VPC.
     *
     * Security groups on your VPC function serve as a virtual firewall to control inbound and outbound traffic and provides security for the resources that you’ll be accessing on the VPC. This ID number is preceded by "sg-", for instance: "sg-03b388029b0a285ea". For more information, see [Security Groups for your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-vpcconfig.html#cfn-comprehend-documentclassifier-vpcconfig-securitygroupids
     */
    readonly securityGroupIds: Array<string>;

    /**
     * The ID for each subnet being used in your private VPC.
     *
     * This subnet is a subset of the a range of IPv4 addresses used by the VPC and is specific to a given availability zone in the VPC’s Region. This ID number is preceded by "subnet-", for instance: "subnet-04ccf456919e69055". For more information, see [VPCs and Subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-vpcconfig.html#cfn-comprehend-documentclassifier-vpcconfig-subnets
     */
    readonly subnets: Array<string>;
  }

  /**
   * The input properties for training a document classifier.
   *
   * For more information on how the input file is formatted, see [Preparing training data](https://docs.aws.amazon.com/comprehend/latest/dg/prep-classifier-data.html) in the Comprehend Developer Guide.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifierinputdataconfig.html
   */
  export interface DocumentClassifierInputDataConfigProperty {
    /**
     * A list of augmented manifest files that provide training data for your custom model.
     *
     * An augmented manifest file is a labeled dataset that is produced by Amazon SageMaker Ground Truth.
     *
     * This parameter is required if you set `DataFormat` to `AUGMENTED_MANIFEST` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifierinputdataconfig.html#cfn-comprehend-documentclassifier-documentclassifierinputdataconfig-augmentedmanifests
     */
    readonly augmentedManifests?: Array<CfnDocumentClassifier.AugmentedManifestsListItemProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The format of your training data:.
     *
     * - `COMPREHEND_CSV` : A two-column CSV file, where labels are provided in the first column, and documents are provided in the second. If you use this value, you must provide the `S3Uri` parameter in your request.
     * - `AUGMENTED_MANIFEST` : A labeled dataset that is produced by Amazon SageMaker Ground Truth. This file is in JSON lines format. Each line is a complete JSON object that contains a training document and its associated labels.
     *
     * If you use this value, you must provide the `AugmentedManifests` parameter in your request.
     *
     * If you don't specify a value, Amazon Comprehend uses `COMPREHEND_CSV` as the default.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifierinputdataconfig.html#cfn-comprehend-documentclassifier-documentclassifierinputdataconfig-dataformat
     */
    readonly dataFormat?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifierinputdataconfig.html#cfn-comprehend-documentclassifier-documentclassifierinputdataconfig-documentreaderconfig
     */
    readonly documentReaderConfig?: CfnDocumentClassifier.DocumentReaderConfigProperty | cdk.IResolvable;

    /**
     * The S3 location of the training documents.
     *
     * This parameter is required in a request to create a native document model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifierinputdataconfig.html#cfn-comprehend-documentclassifier-documentclassifierinputdataconfig-documents
     */
    readonly documents?: CfnDocumentClassifier.DocumentClassifierDocumentsProperty | cdk.IResolvable;

    /**
     * The type of input documents for training the model.
     *
     * Provide plain-text documents to create a plain-text model, and provide semi-structured documents to create a native document model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifierinputdataconfig.html#cfn-comprehend-documentclassifier-documentclassifierinputdataconfig-documenttype
     */
    readonly documentType?: string;

    /**
     * Indicates the delimiter used to separate each label for training a multi-label classifier.
     *
     * The default delimiter between labels is a pipe (|). You can use a different character as a delimiter (if it's an allowed character) by specifying it under Delimiter for labels. If the training documents use a delimiter other than the default or the delimiter you specify, the labels on that line will be combined to make a single unique label, such as LABELLABELLABEL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifierinputdataconfig.html#cfn-comprehend-documentclassifier-documentclassifierinputdataconfig-labeldelimiter
     */
    readonly labelDelimiter?: string;

    /**
     * The Amazon S3 URI for the input data.
     *
     * The S3 bucket must be in the same Region as the API endpoint that you are calling. The URI can point to a single input file or it can provide the prefix for a collection of input files.
     *
     * For example, if you use the URI `S3://bucketName/prefix` , if the prefix is a single file, Amazon Comprehend uses that file as input. If more than one file begins with the prefix, Amazon Comprehend uses all of them as input.
     *
     * This parameter is required if you set `DataFormat` to `COMPREHEND_CSV` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifierinputdataconfig.html#cfn-comprehend-documentclassifier-documentclassifierinputdataconfig-s3uri
     */
    readonly s3Uri?: string;

    /**
     * This specifies the Amazon S3 location that contains the test annotations for the document classifier.
     *
     * The URI must be in the same AWS Region as the API endpoint that you are calling.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifierinputdataconfig.html#cfn-comprehend-documentclassifier-documentclassifierinputdataconfig-tests3uri
     */
    readonly testS3Uri?: string;
  }

  /**
   * Provides configuration parameters to override the default actions for extracting text from PDF documents and image files.
   *
   * By default, Amazon Comprehend performs the following actions to extract text from files, based on the input file type:
   *
   * - *Word files* - Amazon Comprehend parser extracts the text.
   * - *Digital PDF files* - Amazon Comprehend parser extracts the text.
   * - *Image files and scanned PDF files* - Amazon Comprehend uses the Amazon Textract `DetectDocumentText` API to extract the text.
   *
   * `DocumentReaderConfig` does not apply to plain text files or Word files.
   *
   * For image files and PDF documents, you can override these default actions using the fields listed below. For more information, see [Setting text extraction options](https://docs.aws.amazon.com/comprehend/latest/dg/idp-set-textract-options.html) in the Comprehend Developer Guide.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentreaderconfig.html
   */
  export interface DocumentReaderConfigProperty {
    /**
     * This field defines the Amazon Textract API operation that Amazon Comprehend uses to extract text from PDF files and image files.
     *
     * Enter one of the following values:
     *
     * - `TEXTRACT_DETECT_DOCUMENT_TEXT` - The Amazon Comprehend service uses the `DetectDocumentText` API operation.
     * - `TEXTRACT_ANALYZE_DOCUMENT` - The Amazon Comprehend service uses the `AnalyzeDocument` API operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentreaderconfig.html#cfn-comprehend-documentclassifier-documentreaderconfig-documentreadaction
     */
    readonly documentReadAction: string;

    /**
     * Determines the text extraction actions for PDF files. Enter one of the following values:.
     *
     * - `SERVICE_DEFAULT` - use the Amazon Comprehend service defaults for PDF files.
     * - `FORCE_DOCUMENT_READ_ACTION` - Amazon Comprehend uses the Textract API specified by DocumentReadAction for all PDF files, including digital PDF files.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentreaderconfig.html#cfn-comprehend-documentclassifier-documentreaderconfig-documentreadmode
     */
    readonly documentReadMode?: string;

    /**
     * Specifies the type of Amazon Textract features to apply.
     *
     * If you chose `TEXTRACT_ANALYZE_DOCUMENT` as the read action, you must specify one or both of the following values:
     *
     * - `TABLES` - Returns additional information about any tables that are detected in the input document.
     * - `FORMS` - Returns additional information about any forms that are detected in the input document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentreaderconfig.html#cfn-comprehend-documentclassifier-documentreaderconfig-featuretypes
     */
    readonly featureTypes?: Array<string>;
  }

  /**
   * The location of the training documents.
   *
   * This parameter is required in a request to create a semi-structured document classification model.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifierdocuments.html
   */
  export interface DocumentClassifierDocumentsProperty {
    /**
     * The S3 URI location of the training documents specified in the S3Uri CSV file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifierdocuments.html#cfn-comprehend-documentclassifier-documentclassifierdocuments-s3uri
     */
    readonly s3Uri: string;

    /**
     * The S3 URI location of the test documents included in the TestS3Uri CSV file.
     *
     * This field is not required if you do not specify a test CSV file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-documentclassifierdocuments.html#cfn-comprehend-documentclassifier-documentclassifierdocuments-tests3uri
     */
    readonly testS3Uri?: string;
  }

  /**
   * An augmented manifest file that provides training data for your custom model.
   *
   * An augmented manifest file is a labeled dataset that is produced by Amazon SageMaker Ground Truth.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-augmentedmanifestslistitem.html
   */
  export interface AugmentedManifestsListItemProperty {
    /**
     * The JSON attribute that contains the annotations for your training documents.
     *
     * The number of attribute names that you specify depends on whether your augmented manifest file is the output of a single labeling job or a chained labeling job.
     *
     * If your file is the output of a single labeling job, specify the LabelAttributeName key that was used when the job was created in Ground Truth.
     *
     * If your file is the output of a chained labeling job, specify the LabelAttributeName key for one or more jobs in the chain. Each LabelAttributeName key provides the annotations from an individual job.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-augmentedmanifestslistitem.html#cfn-comprehend-documentclassifier-augmentedmanifestslistitem-attributenames
     */
    readonly attributeNames: Array<string>;

    /**
     * The Amazon S3 location of the augmented manifest file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-augmentedmanifestslistitem.html#cfn-comprehend-documentclassifier-augmentedmanifestslistitem-s3uri
     */
    readonly s3Uri: string;

    /**
     * The purpose of the data you've provided in the augmented manifest.
     *
     * You can either train or test this data. If you don't specify, the default is train.
     *
     * TRAIN - all of the documents in the manifest will be used for training. If no test documents are provided, Amazon Comprehend will automatically reserve a portion of the training documents for testing.
     *
     * TEST - all of the documents in the manifest will be used for testing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-documentclassifier-augmentedmanifestslistitem.html#cfn-comprehend-documentclassifier-augmentedmanifestslistitem-split
     */
    readonly split?: string;
  }
}

/**
 * Properties for defining a `CfnDocumentClassifier`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-documentclassifier.html
 */
export interface CfnDocumentClassifierProps {
  /**
   * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend read access to your input data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-documentclassifier.html#cfn-comprehend-documentclassifier-dataaccessrolearn
   */
  readonly dataAccessRoleArn: string;

  /**
   * The name of the document classifier.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-documentclassifier.html#cfn-comprehend-documentclassifier-documentclassifiername
   */
  readonly documentClassifierName: string;

  /**
   * Specifies the format and location of the input data for the job.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-documentclassifier.html#cfn-comprehend-documentclassifier-inputdataconfig
   */
  readonly inputDataConfig: CfnDocumentClassifier.DocumentClassifierInputDataConfigProperty | cdk.IResolvable;

  /**
   * The language of the input documents.
   *
   * You can specify any of the languages supported by Amazon Comprehend. All documents must be in the same language.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-documentclassifier.html#cfn-comprehend-documentclassifier-languagecode
   */
  readonly languageCode: string;

  /**
   * Indicates the mode in which the classifier will be trained.
   *
   * The classifier can be trained in multi-class (single-label) mode or multi-label mode. Multi-class mode identifies a single class label for each document and multi-label mode identifies one or more class labels for each document. Multiple labels for an individual document are separated by a delimiter. The default delimiter between labels is a pipe (|).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-documentclassifier.html#cfn-comprehend-documentclassifier-mode
   */
  readonly mode?: string;

  /**
   * ID for the AWS KMS key that Amazon Comprehend uses to encrypt trained custom models.
   *
   * The ModelKmsKeyId can be either of the following formats:
   *
   * - KMS Key ID: `"1234abcd-12ab-34cd-56ef-1234567890ab"`
   * - Amazon Resource Name (ARN) of a KMS Key: `"arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-documentclassifier.html#cfn-comprehend-documentclassifier-modelkmskeyid
   */
  readonly modelKmsKeyId?: string;

  /**
   * The resource-based policy to attach to your custom document classifier model.
   *
   * You can use this policy to allow another AWS account to import your custom model.
   *
   * Provide your policy as a JSON body that you enter as a UTF-8 encoded string without line breaks. To provide valid JSON, enclose the attribute names and values in double quotes. If the JSON body is also enclosed in double quotes, then you must escape the double quotes that are inside the policy:
   *
   * `"{\"attribute\": \"value\", \"attribute\": [\"value\"]}"`
   *
   * To avoid escaping quotes, you can use single quotes to enclose the policy and double quotes to enclose the JSON names and values:
   *
   * `'{"attribute": "value", "attribute": ["value"]}'`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-documentclassifier.html#cfn-comprehend-documentclassifier-modelpolicy
   */
  readonly modelPolicy?: string;

  /**
   * Provides output results configuration parameters for custom classifier jobs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-documentclassifier.html#cfn-comprehend-documentclassifier-outputdataconfig
   */
  readonly outputDataConfig?: CfnDocumentClassifier.DocumentClassifierOutputDataConfigProperty | cdk.IResolvable;

  /**
   * Tags to associate with the document classifier.
   *
   * A tag is a key-value pair that adds as a metadata to a resource used by Amazon Comprehend. For example, a tag with "Sales" as the key might be added to a resource to indicate its use by the sales department.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-documentclassifier.html#cfn-comprehend-documentclassifier-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The version name given to the newly created classifier.
   *
   * Version names can have a maximum of 256 characters. Alphanumeric characters, hyphens (-) and underscores (_) are allowed. The version name must be unique among all models with the same classifier name in the AWS account / AWS Region .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-documentclassifier.html#cfn-comprehend-documentclassifier-versionname
   */
  readonly versionName?: string;

  /**
   * ID for the AWS Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on the storage volume attached to the ML compute instance(s) that process the analysis job.
   *
   * The VolumeKmsKeyId can be either of the following formats:
   *
   * - KMS Key ID: `"1234abcd-12ab-34cd-56ef-1234567890ab"`
   * - Amazon Resource Name (ARN) of a KMS Key: `"arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-documentclassifier.html#cfn-comprehend-documentclassifier-volumekmskeyid
   */
  readonly volumeKmsKeyId?: string;

  /**
   * Configuration parameters for a private Virtual Private Cloud (VPC) containing the resources you are using for your custom classifier.
   *
   * For more information, see [Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-documentclassifier.html#cfn-comprehend-documentclassifier-vpcconfig
   */
  readonly vpcConfig?: cdk.IResolvable | CfnDocumentClassifier.VpcConfigProperty;
}

/**
 * Determine whether the given properties match those of a `DocumentClassifierOutputDataConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DocumentClassifierOutputDataConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDocumentClassifierDocumentClassifierOutputDataConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("s3Uri", cdk.validateString)(properties.s3Uri));
  return errors.wrap("supplied properties not correct for \"DocumentClassifierOutputDataConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDocumentClassifierDocumentClassifierOutputDataConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDocumentClassifierDocumentClassifierOutputDataConfigPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "S3Uri": cdk.stringToCloudFormation(properties.s3Uri)
  };
}

// @ts-ignore TS6133
function CfnDocumentClassifierDocumentClassifierOutputDataConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDocumentClassifier.DocumentClassifierOutputDataConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocumentClassifier.DocumentClassifierOutputDataConfigProperty>();
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("s3Uri", "S3Uri", (properties.S3Uri != null ? cfn_parse.FromCloudFormation.getString(properties.S3Uri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDocumentClassifierVpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.requiredValidator)(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnets", cdk.requiredValidator)(properties.subnets));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  return errors.wrap("supplied properties not correct for \"VpcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDocumentClassifierVpcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDocumentClassifierVpcConfigPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets)
  };
}

// @ts-ignore TS6133
function CfnDocumentClassifierVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDocumentClassifier.VpcConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocumentClassifier.VpcConfigProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DocumentReaderConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DocumentReaderConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDocumentClassifierDocumentReaderConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("documentReadAction", cdk.requiredValidator)(properties.documentReadAction));
  errors.collect(cdk.propertyValidator("documentReadAction", cdk.validateString)(properties.documentReadAction));
  errors.collect(cdk.propertyValidator("documentReadMode", cdk.validateString)(properties.documentReadMode));
  errors.collect(cdk.propertyValidator("featureTypes", cdk.listValidator(cdk.validateString))(properties.featureTypes));
  return errors.wrap("supplied properties not correct for \"DocumentReaderConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDocumentClassifierDocumentReaderConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDocumentClassifierDocumentReaderConfigPropertyValidator(properties).assertSuccess();
  return {
    "DocumentReadAction": cdk.stringToCloudFormation(properties.documentReadAction),
    "DocumentReadMode": cdk.stringToCloudFormation(properties.documentReadMode),
    "FeatureTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.featureTypes)
  };
}

// @ts-ignore TS6133
function CfnDocumentClassifierDocumentReaderConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDocumentClassifier.DocumentReaderConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocumentClassifier.DocumentReaderConfigProperty>();
  ret.addPropertyResult("documentReadAction", "DocumentReadAction", (properties.DocumentReadAction != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentReadAction) : undefined));
  ret.addPropertyResult("documentReadMode", "DocumentReadMode", (properties.DocumentReadMode != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentReadMode) : undefined));
  ret.addPropertyResult("featureTypes", "FeatureTypes", (properties.FeatureTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.FeatureTypes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DocumentClassifierDocumentsProperty`
 *
 * @param properties - the TypeScript properties of a `DocumentClassifierDocumentsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDocumentClassifierDocumentClassifierDocumentsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Uri", cdk.requiredValidator)(properties.s3Uri));
  errors.collect(cdk.propertyValidator("s3Uri", cdk.validateString)(properties.s3Uri));
  errors.collect(cdk.propertyValidator("testS3Uri", cdk.validateString)(properties.testS3Uri));
  return errors.wrap("supplied properties not correct for \"DocumentClassifierDocumentsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDocumentClassifierDocumentClassifierDocumentsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDocumentClassifierDocumentClassifierDocumentsPropertyValidator(properties).assertSuccess();
  return {
    "S3Uri": cdk.stringToCloudFormation(properties.s3Uri),
    "TestS3Uri": cdk.stringToCloudFormation(properties.testS3Uri)
  };
}

// @ts-ignore TS6133
function CfnDocumentClassifierDocumentClassifierDocumentsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDocumentClassifier.DocumentClassifierDocumentsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocumentClassifier.DocumentClassifierDocumentsProperty>();
  ret.addPropertyResult("s3Uri", "S3Uri", (properties.S3Uri != null ? cfn_parse.FromCloudFormation.getString(properties.S3Uri) : undefined));
  ret.addPropertyResult("testS3Uri", "TestS3Uri", (properties.TestS3Uri != null ? cfn_parse.FromCloudFormation.getString(properties.TestS3Uri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AugmentedManifestsListItemProperty`
 *
 * @param properties - the TypeScript properties of a `AugmentedManifestsListItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDocumentClassifierAugmentedManifestsListItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributeNames", cdk.requiredValidator)(properties.attributeNames));
  errors.collect(cdk.propertyValidator("attributeNames", cdk.listValidator(cdk.validateString))(properties.attributeNames));
  errors.collect(cdk.propertyValidator("s3Uri", cdk.requiredValidator)(properties.s3Uri));
  errors.collect(cdk.propertyValidator("s3Uri", cdk.validateString)(properties.s3Uri));
  errors.collect(cdk.propertyValidator("split", cdk.validateString)(properties.split));
  return errors.wrap("supplied properties not correct for \"AugmentedManifestsListItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnDocumentClassifierAugmentedManifestsListItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDocumentClassifierAugmentedManifestsListItemPropertyValidator(properties).assertSuccess();
  return {
    "AttributeNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.attributeNames),
    "S3Uri": cdk.stringToCloudFormation(properties.s3Uri),
    "Split": cdk.stringToCloudFormation(properties.split)
  };
}

// @ts-ignore TS6133
function CfnDocumentClassifierAugmentedManifestsListItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDocumentClassifier.AugmentedManifestsListItemProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocumentClassifier.AugmentedManifestsListItemProperty>();
  ret.addPropertyResult("attributeNames", "AttributeNames", (properties.AttributeNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AttributeNames) : undefined));
  ret.addPropertyResult("s3Uri", "S3Uri", (properties.S3Uri != null ? cfn_parse.FromCloudFormation.getString(properties.S3Uri) : undefined));
  ret.addPropertyResult("split", "Split", (properties.Split != null ? cfn_parse.FromCloudFormation.getString(properties.Split) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DocumentClassifierInputDataConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DocumentClassifierInputDataConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDocumentClassifierDocumentClassifierInputDataConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("augmentedManifests", cdk.listValidator(CfnDocumentClassifierAugmentedManifestsListItemPropertyValidator))(properties.augmentedManifests));
  errors.collect(cdk.propertyValidator("dataFormat", cdk.validateString)(properties.dataFormat));
  errors.collect(cdk.propertyValidator("documentReaderConfig", CfnDocumentClassifierDocumentReaderConfigPropertyValidator)(properties.documentReaderConfig));
  errors.collect(cdk.propertyValidator("documentType", cdk.validateString)(properties.documentType));
  errors.collect(cdk.propertyValidator("documents", CfnDocumentClassifierDocumentClassifierDocumentsPropertyValidator)(properties.documents));
  errors.collect(cdk.propertyValidator("labelDelimiter", cdk.validateString)(properties.labelDelimiter));
  errors.collect(cdk.propertyValidator("s3Uri", cdk.validateString)(properties.s3Uri));
  errors.collect(cdk.propertyValidator("testS3Uri", cdk.validateString)(properties.testS3Uri));
  return errors.wrap("supplied properties not correct for \"DocumentClassifierInputDataConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDocumentClassifierDocumentClassifierInputDataConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDocumentClassifierDocumentClassifierInputDataConfigPropertyValidator(properties).assertSuccess();
  return {
    "AugmentedManifests": cdk.listMapper(convertCfnDocumentClassifierAugmentedManifestsListItemPropertyToCloudFormation)(properties.augmentedManifests),
    "DataFormat": cdk.stringToCloudFormation(properties.dataFormat),
    "DocumentReaderConfig": convertCfnDocumentClassifierDocumentReaderConfigPropertyToCloudFormation(properties.documentReaderConfig),
    "DocumentType": cdk.stringToCloudFormation(properties.documentType),
    "Documents": convertCfnDocumentClassifierDocumentClassifierDocumentsPropertyToCloudFormation(properties.documents),
    "LabelDelimiter": cdk.stringToCloudFormation(properties.labelDelimiter),
    "S3Uri": cdk.stringToCloudFormation(properties.s3Uri),
    "TestS3Uri": cdk.stringToCloudFormation(properties.testS3Uri)
  };
}

// @ts-ignore TS6133
function CfnDocumentClassifierDocumentClassifierInputDataConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDocumentClassifier.DocumentClassifierInputDataConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocumentClassifier.DocumentClassifierInputDataConfigProperty>();
  ret.addPropertyResult("augmentedManifests", "AugmentedManifests", (properties.AugmentedManifests != null ? cfn_parse.FromCloudFormation.getArray(CfnDocumentClassifierAugmentedManifestsListItemPropertyFromCloudFormation)(properties.AugmentedManifests) : undefined));
  ret.addPropertyResult("dataFormat", "DataFormat", (properties.DataFormat != null ? cfn_parse.FromCloudFormation.getString(properties.DataFormat) : undefined));
  ret.addPropertyResult("documentReaderConfig", "DocumentReaderConfig", (properties.DocumentReaderConfig != null ? CfnDocumentClassifierDocumentReaderConfigPropertyFromCloudFormation(properties.DocumentReaderConfig) : undefined));
  ret.addPropertyResult("documents", "Documents", (properties.Documents != null ? CfnDocumentClassifierDocumentClassifierDocumentsPropertyFromCloudFormation(properties.Documents) : undefined));
  ret.addPropertyResult("documentType", "DocumentType", (properties.DocumentType != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentType) : undefined));
  ret.addPropertyResult("labelDelimiter", "LabelDelimiter", (properties.LabelDelimiter != null ? cfn_parse.FromCloudFormation.getString(properties.LabelDelimiter) : undefined));
  ret.addPropertyResult("s3Uri", "S3Uri", (properties.S3Uri != null ? cfn_parse.FromCloudFormation.getString(properties.S3Uri) : undefined));
  ret.addPropertyResult("testS3Uri", "TestS3Uri", (properties.TestS3Uri != null ? cfn_parse.FromCloudFormation.getString(properties.TestS3Uri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDocumentClassifierProps`
 *
 * @param properties - the TypeScript properties of a `CfnDocumentClassifierProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDocumentClassifierPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataAccessRoleArn", cdk.requiredValidator)(properties.dataAccessRoleArn));
  errors.collect(cdk.propertyValidator("dataAccessRoleArn", cdk.validateString)(properties.dataAccessRoleArn));
  errors.collect(cdk.propertyValidator("documentClassifierName", cdk.requiredValidator)(properties.documentClassifierName));
  errors.collect(cdk.propertyValidator("documentClassifierName", cdk.validateString)(properties.documentClassifierName));
  errors.collect(cdk.propertyValidator("inputDataConfig", cdk.requiredValidator)(properties.inputDataConfig));
  errors.collect(cdk.propertyValidator("inputDataConfig", CfnDocumentClassifierDocumentClassifierInputDataConfigPropertyValidator)(properties.inputDataConfig));
  errors.collect(cdk.propertyValidator("languageCode", cdk.requiredValidator)(properties.languageCode));
  errors.collect(cdk.propertyValidator("languageCode", cdk.validateString)(properties.languageCode));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  errors.collect(cdk.propertyValidator("modelKmsKeyId", cdk.validateString)(properties.modelKmsKeyId));
  errors.collect(cdk.propertyValidator("modelPolicy", cdk.validateString)(properties.modelPolicy));
  errors.collect(cdk.propertyValidator("outputDataConfig", CfnDocumentClassifierDocumentClassifierOutputDataConfigPropertyValidator)(properties.outputDataConfig));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("versionName", cdk.validateString)(properties.versionName));
  errors.collect(cdk.propertyValidator("volumeKmsKeyId", cdk.validateString)(properties.volumeKmsKeyId));
  errors.collect(cdk.propertyValidator("vpcConfig", CfnDocumentClassifierVpcConfigPropertyValidator)(properties.vpcConfig));
  return errors.wrap("supplied properties not correct for \"CfnDocumentClassifierProps\"");
}

// @ts-ignore TS6133
function convertCfnDocumentClassifierPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDocumentClassifierPropsValidator(properties).assertSuccess();
  return {
    "DataAccessRoleArn": cdk.stringToCloudFormation(properties.dataAccessRoleArn),
    "DocumentClassifierName": cdk.stringToCloudFormation(properties.documentClassifierName),
    "InputDataConfig": convertCfnDocumentClassifierDocumentClassifierInputDataConfigPropertyToCloudFormation(properties.inputDataConfig),
    "LanguageCode": cdk.stringToCloudFormation(properties.languageCode),
    "Mode": cdk.stringToCloudFormation(properties.mode),
    "ModelKmsKeyId": cdk.stringToCloudFormation(properties.modelKmsKeyId),
    "ModelPolicy": cdk.stringToCloudFormation(properties.modelPolicy),
    "OutputDataConfig": convertCfnDocumentClassifierDocumentClassifierOutputDataConfigPropertyToCloudFormation(properties.outputDataConfig),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VersionName": cdk.stringToCloudFormation(properties.versionName),
    "VolumeKmsKeyId": cdk.stringToCloudFormation(properties.volumeKmsKeyId),
    "VpcConfig": convertCfnDocumentClassifierVpcConfigPropertyToCloudFormation(properties.vpcConfig)
  };
}

// @ts-ignore TS6133
function CfnDocumentClassifierPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDocumentClassifierProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDocumentClassifierProps>();
  ret.addPropertyResult("dataAccessRoleArn", "DataAccessRoleArn", (properties.DataAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.DataAccessRoleArn) : undefined));
  ret.addPropertyResult("documentClassifierName", "DocumentClassifierName", (properties.DocumentClassifierName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentClassifierName) : undefined));
  ret.addPropertyResult("inputDataConfig", "InputDataConfig", (properties.InputDataConfig != null ? CfnDocumentClassifierDocumentClassifierInputDataConfigPropertyFromCloudFormation(properties.InputDataConfig) : undefined));
  ret.addPropertyResult("languageCode", "LanguageCode", (properties.LanguageCode != null ? cfn_parse.FromCloudFormation.getString(properties.LanguageCode) : undefined));
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addPropertyResult("modelKmsKeyId", "ModelKmsKeyId", (properties.ModelKmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.ModelKmsKeyId) : undefined));
  ret.addPropertyResult("modelPolicy", "ModelPolicy", (properties.ModelPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.ModelPolicy) : undefined));
  ret.addPropertyResult("outputDataConfig", "OutputDataConfig", (properties.OutputDataConfig != null ? CfnDocumentClassifierDocumentClassifierOutputDataConfigPropertyFromCloudFormation(properties.OutputDataConfig) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("versionName", "VersionName", (properties.VersionName != null ? cfn_parse.FromCloudFormation.getString(properties.VersionName) : undefined));
  ret.addPropertyResult("volumeKmsKeyId", "VolumeKmsKeyId", (properties.VolumeKmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeKmsKeyId) : undefined));
  ret.addPropertyResult("vpcConfig", "VpcConfig", (properties.VpcConfig != null ? CfnDocumentClassifierVpcConfigPropertyFromCloudFormation(properties.VpcConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A flywheel is an AWS resource that orchestrates the ongoing training of a model for custom classification or custom entity recognition.
 *
 * You can create a flywheel to start with an existing trained model, or Comprehend can create and train a new model.
 *
 * When you create the flywheel, Comprehend creates a data lake in your account. The data lake holds the training data and test data for all versions of the model.
 *
 * To use a flywheel with an existing trained model, you specify the active model version. Comprehend copies the model's training data and test data into the flywheel's data lake.
 *
 * To use the flywheel with a new model, you need to provide a dataset for training data (and optional test data) when you create the flywheel.
 *
 * For more information about flywheels, see [Flywheel overview](https://docs.aws.amazon.com/comprehend/latest/dg/flywheels-about.html) in the *Amazon Comprehend Developer Guide* .
 *
 * @cloudformationResource AWS::Comprehend::Flywheel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-flywheel.html
 */
export class CfnFlywheel extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Comprehend::Flywheel";

  /**
   * Build a CfnFlywheel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlywheel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFlywheelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFlywheel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the flywheel.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The Amazon Resource Number (ARN) of the active model version.
   */
  public activeModelArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend permission to access the flywheel data.
   */
  public dataAccessRoleArn: string;

  /**
   * Amazon S3 URI of the data lake location.
   */
  public dataLakeS3Uri: string;

  /**
   * Data security configuration.
   */
  public dataSecurityConfig?: CfnFlywheel.DataSecurityConfigProperty | cdk.IResolvable;

  /**
   * Name for the flywheel.
   */
  public flywheelName: string;

  /**
   * Model type of the flywheel's model.
   */
  public modelType?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Tags associated with the endpoint being created.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Configuration about the model associated with a flywheel.
   */
  public taskConfig?: cdk.IResolvable | CfnFlywheel.TaskConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFlywheelProps) {
    super(scope, id, {
      "type": CfnFlywheel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "dataAccessRoleArn", this);
    cdk.requireProperty(props, "dataLakeS3Uri", this);
    cdk.requireProperty(props, "flywheelName", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.activeModelArn = props.activeModelArn;
    this.dataAccessRoleArn = props.dataAccessRoleArn;
    this.dataLakeS3Uri = props.dataLakeS3Uri;
    this.dataSecurityConfig = props.dataSecurityConfig;
    this.flywheelName = props.flywheelName;
    this.modelType = props.modelType;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Comprehend::Flywheel", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.taskConfig = props.taskConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "activeModelArn": this.activeModelArn,
      "dataAccessRoleArn": this.dataAccessRoleArn,
      "dataLakeS3Uri": this.dataLakeS3Uri,
      "dataSecurityConfig": this.dataSecurityConfig,
      "flywheelName": this.flywheelName,
      "modelType": this.modelType,
      "tags": this.tags.renderTags(),
      "taskConfig": this.taskConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFlywheel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFlywheelPropsToCloudFormation(props);
  }
}

export namespace CfnFlywheel {
  /**
   * Configuration about the model associated with a flywheel.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-taskconfig.html
   */
  export interface TaskConfigProperty {
    /**
     * Configuration required for a document classification model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-taskconfig.html#cfn-comprehend-flywheel-taskconfig-documentclassificationconfig
     */
    readonly documentClassificationConfig?: CfnFlywheel.DocumentClassificationConfigProperty | cdk.IResolvable;

    /**
     * Configuration required for an entity recognition model.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-taskconfig.html#cfn-comprehend-flywheel-taskconfig-entityrecognitionconfig
     */
    readonly entityRecognitionConfig?: CfnFlywheel.EntityRecognitionConfigProperty | cdk.IResolvable;

    /**
     * Language code for the language that the model supports.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-taskconfig.html#cfn-comprehend-flywheel-taskconfig-languagecode
     */
    readonly languageCode: string;
  }

  /**
   * Configuration required for a document classification model.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-documentclassificationconfig.html
   */
  export interface DocumentClassificationConfigProperty {
    /**
     * One or more labels to associate with the custom classifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-documentclassificationconfig.html#cfn-comprehend-flywheel-documentclassificationconfig-labels
     */
    readonly labels?: Array<string>;

    /**
     * Classification mode indicates whether the documents are `MULTI_CLASS` or `MULTI_LABEL` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-documentclassificationconfig.html#cfn-comprehend-flywheel-documentclassificationconfig-mode
     */
    readonly mode: string;
  }

  /**
   * Configuration required for an entity recognition model.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-entityrecognitionconfig.html
   */
  export interface EntityRecognitionConfigProperty {
    /**
     * Up to 25 entity types that the model is trained to recognize.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-entityrecognitionconfig.html#cfn-comprehend-flywheel-entityrecognitionconfig-entitytypes
     */
    readonly entityTypes?: Array<CfnFlywheel.EntityTypesListItemProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * An entity type within a labeled training dataset that Amazon Comprehend uses to train a custom entity recognizer.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-entitytypeslistitem.html
   */
  export interface EntityTypesListItemProperty {
    /**
     * An entity type within a labeled training dataset that Amazon Comprehend uses to train a custom entity recognizer.
     *
     * Entity types must not contain the following invalid characters: \n (line break), \\n (escaped line break, \r (carriage return), \\r (escaped carriage return), \t (tab), \\t (escaped tab), and , (comma).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-entitytypeslistitem.html#cfn-comprehend-flywheel-entitytypeslistitem-type
     */
    readonly type: string;
  }

  /**
   * Data security configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-datasecurityconfig.html
   */
  export interface DataSecurityConfigProperty {
    /**
     * ID for the AWS KMS key that Amazon Comprehend uses to encrypt the data in the data lake.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-datasecurityconfig.html#cfn-comprehend-flywheel-datasecurityconfig-datalakekmskeyid
     */
    readonly dataLakeKmsKeyId?: string;

    /**
     * ID for the AWS KMS key that Amazon Comprehend uses to encrypt trained custom models.
     *
     * The ModelKmsKeyId can be either of the following formats:
     *
     * - KMS Key ID: `"1234abcd-12ab-34cd-56ef-1234567890ab"`
     * - Amazon Resource Name (ARN) of a KMS Key: `"arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-datasecurityconfig.html#cfn-comprehend-flywheel-datasecurityconfig-modelkmskeyid
     */
    readonly modelKmsKeyId?: string;

    /**
     * ID for the AWS KMS key that Amazon Comprehend uses to encrypt the volume.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-datasecurityconfig.html#cfn-comprehend-flywheel-datasecurityconfig-volumekmskeyid
     */
    readonly volumeKmsKeyId?: string;

    /**
     * Configuration parameters for an optional private Virtual Private Cloud (VPC) containing the resources you are using for the job.
     *
     * For more information, see [Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-datasecurityconfig.html#cfn-comprehend-flywheel-datasecurityconfig-vpcconfig
     */
    readonly vpcConfig?: cdk.IResolvable | CfnFlywheel.VpcConfigProperty;
  }

  /**
   * Configuration parameters for an optional private Virtual Private Cloud (VPC) containing the resources you are using for the job.
   *
   * For more information, see [Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-vpcconfig.html
   */
  export interface VpcConfigProperty {
    /**
     * The ID number for a security group on an instance of your private VPC.
     *
     * Security groups on your VPC function serve as a virtual firewall to control inbound and outbound traffic and provides security for the resources that you’ll be accessing on the VPC. This ID number is preceded by "sg-", for instance: "sg-03b388029b0a285ea". For more information, see [Security Groups for your VPC](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-vpcconfig.html#cfn-comprehend-flywheel-vpcconfig-securitygroupids
     */
    readonly securityGroupIds: Array<string>;

    /**
     * The ID for each subnet being used in your private VPC.
     *
     * This subnet is a subset of the a range of IPv4 addresses used by the VPC and is specific to a given availability zone in the VPC’s Region. This ID number is preceded by "subnet-", for instance: "subnet-04ccf456919e69055". For more information, see [VPCs and Subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-comprehend-flywheel-vpcconfig.html#cfn-comprehend-flywheel-vpcconfig-subnets
     */
    readonly subnets: Array<string>;
  }
}

/**
 * Properties for defining a `CfnFlywheel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-flywheel.html
 */
export interface CfnFlywheelProps {
  /**
   * The Amazon Resource Number (ARN) of the active model version.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-flywheel.html#cfn-comprehend-flywheel-activemodelarn
   */
  readonly activeModelArn?: string;

  /**
   * The Amazon Resource Name (ARN) of the IAM role that grants Amazon Comprehend permission to access the flywheel data.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-flywheel.html#cfn-comprehend-flywheel-dataaccessrolearn
   */
  readonly dataAccessRoleArn: string;

  /**
   * Amazon S3 URI of the data lake location.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-flywheel.html#cfn-comprehend-flywheel-datalakes3uri
   */
  readonly dataLakeS3Uri: string;

  /**
   * Data security configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-flywheel.html#cfn-comprehend-flywheel-datasecurityconfig
   */
  readonly dataSecurityConfig?: CfnFlywheel.DataSecurityConfigProperty | cdk.IResolvable;

  /**
   * Name for the flywheel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-flywheel.html#cfn-comprehend-flywheel-flywheelname
   */
  readonly flywheelName: string;

  /**
   * Model type of the flywheel's model.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-flywheel.html#cfn-comprehend-flywheel-modeltype
   */
  readonly modelType?: string;

  /**
   * Tags associated with the endpoint being created.
   *
   * A tag is a key-value pair that adds metadata to the endpoint. For example, a tag with "Sales" as the key might be added to an endpoint to indicate its use by the sales department.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-flywheel.html#cfn-comprehend-flywheel-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Configuration about the model associated with a flywheel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-comprehend-flywheel.html#cfn-comprehend-flywheel-taskconfig
   */
  readonly taskConfig?: cdk.IResolvable | CfnFlywheel.TaskConfigProperty;
}

/**
 * Determine whether the given properties match those of a `DocumentClassificationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DocumentClassificationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlywheelDocumentClassificationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("labels", cdk.listValidator(cdk.validateString))(properties.labels));
  errors.collect(cdk.propertyValidator("mode", cdk.requiredValidator)(properties.mode));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  return errors.wrap("supplied properties not correct for \"DocumentClassificationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlywheelDocumentClassificationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlywheelDocumentClassificationConfigPropertyValidator(properties).assertSuccess();
  return {
    "Labels": cdk.listMapper(cdk.stringToCloudFormation)(properties.labels),
    "Mode": cdk.stringToCloudFormation(properties.mode)
  };
}

// @ts-ignore TS6133
function CfnFlywheelDocumentClassificationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlywheel.DocumentClassificationConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlywheel.DocumentClassificationConfigProperty>();
  ret.addPropertyResult("labels", "Labels", (properties.Labels != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Labels) : undefined));
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EntityTypesListItemProperty`
 *
 * @param properties - the TypeScript properties of a `EntityTypesListItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlywheelEntityTypesListItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"EntityTypesListItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlywheelEntityTypesListItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlywheelEntityTypesListItemPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnFlywheelEntityTypesListItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlywheel.EntityTypesListItemProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlywheel.EntityTypesListItemProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EntityRecognitionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EntityRecognitionConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlywheelEntityRecognitionConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("entityTypes", cdk.listValidator(CfnFlywheelEntityTypesListItemPropertyValidator))(properties.entityTypes));
  return errors.wrap("supplied properties not correct for \"EntityRecognitionConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlywheelEntityRecognitionConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlywheelEntityRecognitionConfigPropertyValidator(properties).assertSuccess();
  return {
    "EntityTypes": cdk.listMapper(convertCfnFlywheelEntityTypesListItemPropertyToCloudFormation)(properties.entityTypes)
  };
}

// @ts-ignore TS6133
function CfnFlywheelEntityRecognitionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlywheel.EntityRecognitionConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlywheel.EntityRecognitionConfigProperty>();
  ret.addPropertyResult("entityTypes", "EntityTypes", (properties.EntityTypes != null ? cfn_parse.FromCloudFormation.getArray(CfnFlywheelEntityTypesListItemPropertyFromCloudFormation)(properties.EntityTypes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TaskConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TaskConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlywheelTaskConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("documentClassificationConfig", CfnFlywheelDocumentClassificationConfigPropertyValidator)(properties.documentClassificationConfig));
  errors.collect(cdk.propertyValidator("entityRecognitionConfig", CfnFlywheelEntityRecognitionConfigPropertyValidator)(properties.entityRecognitionConfig));
  errors.collect(cdk.propertyValidator("languageCode", cdk.requiredValidator)(properties.languageCode));
  errors.collect(cdk.propertyValidator("languageCode", cdk.validateString)(properties.languageCode));
  return errors.wrap("supplied properties not correct for \"TaskConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlywheelTaskConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlywheelTaskConfigPropertyValidator(properties).assertSuccess();
  return {
    "DocumentClassificationConfig": convertCfnFlywheelDocumentClassificationConfigPropertyToCloudFormation(properties.documentClassificationConfig),
    "EntityRecognitionConfig": convertCfnFlywheelEntityRecognitionConfigPropertyToCloudFormation(properties.entityRecognitionConfig),
    "LanguageCode": cdk.stringToCloudFormation(properties.languageCode)
  };
}

// @ts-ignore TS6133
function CfnFlywheelTaskConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlywheel.TaskConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlywheel.TaskConfigProperty>();
  ret.addPropertyResult("documentClassificationConfig", "DocumentClassificationConfig", (properties.DocumentClassificationConfig != null ? CfnFlywheelDocumentClassificationConfigPropertyFromCloudFormation(properties.DocumentClassificationConfig) : undefined));
  ret.addPropertyResult("entityRecognitionConfig", "EntityRecognitionConfig", (properties.EntityRecognitionConfig != null ? CfnFlywheelEntityRecognitionConfigPropertyFromCloudFormation(properties.EntityRecognitionConfig) : undefined));
  ret.addPropertyResult("languageCode", "LanguageCode", (properties.LanguageCode != null ? cfn_parse.FromCloudFormation.getString(properties.LanguageCode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlywheelVpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.requiredValidator)(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnets", cdk.requiredValidator)(properties.subnets));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  return errors.wrap("supplied properties not correct for \"VpcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlywheelVpcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlywheelVpcConfigPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets)
  };
}

// @ts-ignore TS6133
function CfnFlywheelVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFlywheel.VpcConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlywheel.VpcConfigProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataSecurityConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DataSecurityConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlywheelDataSecurityConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataLakeKmsKeyId", cdk.validateString)(properties.dataLakeKmsKeyId));
  errors.collect(cdk.propertyValidator("modelKmsKeyId", cdk.validateString)(properties.modelKmsKeyId));
  errors.collect(cdk.propertyValidator("volumeKmsKeyId", cdk.validateString)(properties.volumeKmsKeyId));
  errors.collect(cdk.propertyValidator("vpcConfig", CfnFlywheelVpcConfigPropertyValidator)(properties.vpcConfig));
  return errors.wrap("supplied properties not correct for \"DataSecurityConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFlywheelDataSecurityConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlywheelDataSecurityConfigPropertyValidator(properties).assertSuccess();
  return {
    "DataLakeKmsKeyId": cdk.stringToCloudFormation(properties.dataLakeKmsKeyId),
    "ModelKmsKeyId": cdk.stringToCloudFormation(properties.modelKmsKeyId),
    "VolumeKmsKeyId": cdk.stringToCloudFormation(properties.volumeKmsKeyId),
    "VpcConfig": convertCfnFlywheelVpcConfigPropertyToCloudFormation(properties.vpcConfig)
  };
}

// @ts-ignore TS6133
function CfnFlywheelDataSecurityConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlywheel.DataSecurityConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlywheel.DataSecurityConfigProperty>();
  ret.addPropertyResult("dataLakeKmsKeyId", "DataLakeKmsKeyId", (properties.DataLakeKmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.DataLakeKmsKeyId) : undefined));
  ret.addPropertyResult("modelKmsKeyId", "ModelKmsKeyId", (properties.ModelKmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.ModelKmsKeyId) : undefined));
  ret.addPropertyResult("volumeKmsKeyId", "VolumeKmsKeyId", (properties.VolumeKmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.VolumeKmsKeyId) : undefined));
  ret.addPropertyResult("vpcConfig", "VpcConfig", (properties.VpcConfig != null ? CfnFlywheelVpcConfigPropertyFromCloudFormation(properties.VpcConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFlywheelProps`
 *
 * @param properties - the TypeScript properties of a `CfnFlywheelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFlywheelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("activeModelArn", cdk.validateString)(properties.activeModelArn));
  errors.collect(cdk.propertyValidator("dataAccessRoleArn", cdk.requiredValidator)(properties.dataAccessRoleArn));
  errors.collect(cdk.propertyValidator("dataAccessRoleArn", cdk.validateString)(properties.dataAccessRoleArn));
  errors.collect(cdk.propertyValidator("dataLakeS3Uri", cdk.requiredValidator)(properties.dataLakeS3Uri));
  errors.collect(cdk.propertyValidator("dataLakeS3Uri", cdk.validateString)(properties.dataLakeS3Uri));
  errors.collect(cdk.propertyValidator("dataSecurityConfig", CfnFlywheelDataSecurityConfigPropertyValidator)(properties.dataSecurityConfig));
  errors.collect(cdk.propertyValidator("flywheelName", cdk.requiredValidator)(properties.flywheelName));
  errors.collect(cdk.propertyValidator("flywheelName", cdk.validateString)(properties.flywheelName));
  errors.collect(cdk.propertyValidator("modelType", cdk.validateString)(properties.modelType));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("taskConfig", CfnFlywheelTaskConfigPropertyValidator)(properties.taskConfig));
  return errors.wrap("supplied properties not correct for \"CfnFlywheelProps\"");
}

// @ts-ignore TS6133
function convertCfnFlywheelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFlywheelPropsValidator(properties).assertSuccess();
  return {
    "ActiveModelArn": cdk.stringToCloudFormation(properties.activeModelArn),
    "DataAccessRoleArn": cdk.stringToCloudFormation(properties.dataAccessRoleArn),
    "DataLakeS3Uri": cdk.stringToCloudFormation(properties.dataLakeS3Uri),
    "DataSecurityConfig": convertCfnFlywheelDataSecurityConfigPropertyToCloudFormation(properties.dataSecurityConfig),
    "FlywheelName": cdk.stringToCloudFormation(properties.flywheelName),
    "ModelType": cdk.stringToCloudFormation(properties.modelType),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TaskConfig": convertCfnFlywheelTaskConfigPropertyToCloudFormation(properties.taskConfig)
  };
}

// @ts-ignore TS6133
function CfnFlywheelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFlywheelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFlywheelProps>();
  ret.addPropertyResult("activeModelArn", "ActiveModelArn", (properties.ActiveModelArn != null ? cfn_parse.FromCloudFormation.getString(properties.ActiveModelArn) : undefined));
  ret.addPropertyResult("dataAccessRoleArn", "DataAccessRoleArn", (properties.DataAccessRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.DataAccessRoleArn) : undefined));
  ret.addPropertyResult("dataLakeS3Uri", "DataLakeS3Uri", (properties.DataLakeS3Uri != null ? cfn_parse.FromCloudFormation.getString(properties.DataLakeS3Uri) : undefined));
  ret.addPropertyResult("dataSecurityConfig", "DataSecurityConfig", (properties.DataSecurityConfig != null ? CfnFlywheelDataSecurityConfigPropertyFromCloudFormation(properties.DataSecurityConfig) : undefined));
  ret.addPropertyResult("flywheelName", "FlywheelName", (properties.FlywheelName != null ? cfn_parse.FromCloudFormation.getString(properties.FlywheelName) : undefined));
  ret.addPropertyResult("modelType", "ModelType", (properties.ModelType != null ? cfn_parse.FromCloudFormation.getString(properties.ModelType) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("taskConfig", "TaskConfig", (properties.TaskConfig != null ? CfnFlywheelTaskConfigPropertyFromCloudFormation(properties.TaskConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}