/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::KinesisFirehose::DeliveryStream` resource specifies an Amazon Kinesis Data Firehose (Kinesis Data Firehose) delivery stream that delivers real-time streaming data to an Amazon Simple Storage Service (Amazon S3), Amazon Redshift, or Amazon Elasticsearch Service (Amazon ES) destination.
 *
 * For more information, see [Creating an Amazon Kinesis Data Firehose Delivery Stream](https://docs.aws.amazon.com/firehose/latest/dev/basic-create.html) in the *Amazon Kinesis Data Firehose Developer Guide* .
 *
 * @cloudformationResource AWS::KinesisFirehose::DeliveryStream
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html
 */
export class CfnDeliveryStream extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::KinesisFirehose::DeliveryStream";

  /**
   * Build a CfnDeliveryStream from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDeliveryStream {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDeliveryStreamPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDeliveryStream(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the delivery stream, such as `arn:aws:firehose:us-east-2:123456789012:deliverystream/delivery-stream-name` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Describes the configuration of a destination in the Serverless offering for Amazon OpenSearch Service.
   */
  public amazonOpenSearchServerlessDestinationConfiguration?: CfnDeliveryStream.AmazonOpenSearchServerlessDestinationConfigurationProperty | cdk.IResolvable;

  /**
   * The destination in Amazon OpenSearch Service.
   */
  public amazonopensearchserviceDestinationConfiguration?: CfnDeliveryStream.AmazonopensearchserviceDestinationConfigurationProperty | cdk.IResolvable;

  /**
   * Specifies the type and Amazon Resource Name (ARN) of the CMK to use for Server-Side Encryption (SSE).
   */
  public deliveryStreamEncryptionConfigurationInput?: CfnDeliveryStream.DeliveryStreamEncryptionConfigurationInputProperty | cdk.IResolvable;

  /**
   * The name of the delivery stream.
   */
  public deliveryStreamName?: string;

  /**
   * The delivery stream type. This can be one of the following values:.
   */
  public deliveryStreamType?: string;

  /**
   * An Amazon ES destination for the delivery stream.
   */
  public elasticsearchDestinationConfiguration?: CfnDeliveryStream.ElasticsearchDestinationConfigurationProperty | cdk.IResolvable;

  /**
   * An Amazon S3 destination for the delivery stream.
   */
  public extendedS3DestinationConfiguration?: CfnDeliveryStream.ExtendedS3DestinationConfigurationProperty | cdk.IResolvable;

  /**
   * Enables configuring Kinesis Firehose to deliver data to any HTTP endpoint destination.
   */
  public httpEndpointDestinationConfiguration?: CfnDeliveryStream.HttpEndpointDestinationConfigurationProperty | cdk.IResolvable;

  /**
   * When a Kinesis stream is used as the source for the delivery stream, a [KinesisStreamSourceConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-kinesisstreamsourceconfiguration.html) containing the Kinesis stream ARN and the role ARN for the source stream.
   */
  public kinesisStreamSourceConfiguration?: cdk.IResolvable | CfnDeliveryStream.KinesisStreamSourceConfigurationProperty;

  /**
   * The configuration for the Amazon MSK cluster to be used as the source for a delivery stream.
   */
  public mskSourceConfiguration?: cdk.IResolvable | CfnDeliveryStream.MSKSourceConfigurationProperty;

  /**
   * An Amazon Redshift destination for the delivery stream.
   */
  public redshiftDestinationConfiguration?: cdk.IResolvable | CfnDeliveryStream.RedshiftDestinationConfigurationProperty;

  /**
   * The `S3DestinationConfiguration` property type specifies an Amazon Simple Storage Service (Amazon S3) destination to which Amazon Kinesis Data Firehose (Kinesis Data Firehose) delivers data.
   */
  public s3DestinationConfiguration?: cdk.IResolvable | CfnDeliveryStream.S3DestinationConfigurationProperty;

  /**
   * The configuration of a destination in Splunk for the delivery stream.
   */
  public splunkDestinationConfiguration?: cdk.IResolvable | CfnDeliveryStream.SplunkDestinationConfigurationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A set of tags to assign to the delivery stream.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDeliveryStreamProps = {}) {
    super(scope, id, {
      "type": CfnDeliveryStream.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.amazonOpenSearchServerlessDestinationConfiguration = props.amazonOpenSearchServerlessDestinationConfiguration;
    this.amazonopensearchserviceDestinationConfiguration = props.amazonopensearchserviceDestinationConfiguration;
    this.deliveryStreamEncryptionConfigurationInput = props.deliveryStreamEncryptionConfigurationInput;
    this.deliveryStreamName = props.deliveryStreamName;
    this.deliveryStreamType = props.deliveryStreamType;
    this.elasticsearchDestinationConfiguration = props.elasticsearchDestinationConfiguration;
    this.extendedS3DestinationConfiguration = props.extendedS3DestinationConfiguration;
    this.httpEndpointDestinationConfiguration = props.httpEndpointDestinationConfiguration;
    this.kinesisStreamSourceConfiguration = props.kinesisStreamSourceConfiguration;
    this.mskSourceConfiguration = props.mskSourceConfiguration;
    this.redshiftDestinationConfiguration = props.redshiftDestinationConfiguration;
    this.s3DestinationConfiguration = props.s3DestinationConfiguration;
    this.splunkDestinationConfiguration = props.splunkDestinationConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::KinesisFirehose::DeliveryStream", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "amazonOpenSearchServerlessDestinationConfiguration": this.amazonOpenSearchServerlessDestinationConfiguration,
      "amazonopensearchserviceDestinationConfiguration": this.amazonopensearchserviceDestinationConfiguration,
      "deliveryStreamEncryptionConfigurationInput": this.deliveryStreamEncryptionConfigurationInput,
      "deliveryStreamName": this.deliveryStreamName,
      "deliveryStreamType": this.deliveryStreamType,
      "elasticsearchDestinationConfiguration": this.elasticsearchDestinationConfiguration,
      "extendedS3DestinationConfiguration": this.extendedS3DestinationConfiguration,
      "httpEndpointDestinationConfiguration": this.httpEndpointDestinationConfiguration,
      "kinesisStreamSourceConfiguration": this.kinesisStreamSourceConfiguration,
      "mskSourceConfiguration": this.mskSourceConfiguration,
      "redshiftDestinationConfiguration": this.redshiftDestinationConfiguration,
      "s3DestinationConfiguration": this.s3DestinationConfiguration,
      "splunkDestinationConfiguration": this.splunkDestinationConfiguration,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDeliveryStream.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDeliveryStreamPropsToCloudFormation(props);
  }
}

export namespace CfnDeliveryStream {
  /**
   * Specifies the type and Amazon Resource Name (ARN) of the CMK to use for Server-Side Encryption (SSE).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-deliverystreamencryptionconfigurationinput.html
   */
  export interface DeliveryStreamEncryptionConfigurationInputProperty {
    /**
     * If you set `KeyType` to `CUSTOMER_MANAGED_CMK` , you must specify the Amazon Resource Name (ARN) of the CMK.
     *
     * If you set `KeyType` to `AWS _OWNED_CMK` , Kinesis Data Firehose uses a service-account CMK.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-deliverystreamencryptionconfigurationinput.html#cfn-kinesisfirehose-deliverystream-deliverystreamencryptionconfigurationinput-keyarn
     */
    readonly keyArn?: string;

    /**
     * Indicates the type of customer master key (CMK) to use for encryption.
     *
     * The default setting is `AWS_OWNED_CMK` . For more information about CMKs, see [Customer Master Keys (CMKs)](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#master_keys) .
     *
     * You can use a CMK of type CUSTOMER_MANAGED_CMK to encrypt up to 500 delivery streams.
     *
     * > To encrypt your delivery stream, use symmetric CMKs. Kinesis Data Firehose doesn't support asymmetric CMKs. For information about symmetric and asymmetric CMKs, see [About Symmetric and Asymmetric CMKs](https://docs.aws.amazon.com/kms/latest/developerguide/symm-asymm-concepts.html) in the AWS Key Management Service developer guide.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-deliverystreamencryptionconfigurationinput.html#cfn-kinesisfirehose-deliverystream-deliverystreamencryptionconfigurationinput-keytype
     */
    readonly keyType: string;
  }

  /**
   * Describes the configuration of the HTTP endpoint destination.
   *
   * Kinesis Firehose supports any custom HTTP endpoint or HTTP endpoints owned by supported third-party service providers, including Datadog, MongoDB, and New Relic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration.html
   */
  export interface HttpEndpointDestinationConfigurationProperty {
    /**
     * The buffering options that can be used before data is delivered to the specified destination.
     *
     * Kinesis Data Firehose treats these options as hints, and it might choose to use more optimal values. The SizeInMBs and IntervalInSeconds parameters are optional. However, if you specify a value for one of them, you must also provide a value for the other.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration-bufferinghints
     */
    readonly bufferingHints?: CfnDeliveryStream.BufferingHintsProperty | cdk.IResolvable;

    /**
     * Describes the Amazon CloudWatch logging options for your delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration-cloudwatchloggingoptions
     */
    readonly cloudWatchLoggingOptions?: CfnDeliveryStream.CloudWatchLoggingOptionsProperty | cdk.IResolvable;

    /**
     * The configuration of the HTTP endpoint selected as the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration-endpointconfiguration
     */
    readonly endpointConfiguration: CfnDeliveryStream.HttpEndpointConfigurationProperty | cdk.IResolvable;

    /**
     * Describes the data processing configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration-processingconfiguration
     */
    readonly processingConfiguration?: cdk.IResolvable | CfnDeliveryStream.ProcessingConfigurationProperty;

    /**
     * The configuration of the request sent to the HTTP endpoint specified as the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration-requestconfiguration
     */
    readonly requestConfiguration?: CfnDeliveryStream.HttpEndpointRequestConfigurationProperty | cdk.IResolvable;

    /**
     * Describes the retry behavior in case Kinesis Data Firehose is unable to deliver data to the specified HTTP endpoint destination, or if it doesn't receive a valid acknowledgment of receipt from the specified HTTP endpoint destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration-retryoptions
     */
    readonly retryOptions?: cdk.IResolvable | CfnDeliveryStream.RetryOptionsProperty;

    /**
     * Kinesis Data Firehose uses this IAM role for all the permissions that the delivery stream needs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration-rolearn
     */
    readonly roleArn?: string;

    /**
     * Describes the S3 bucket backup options for the data that Kinesis Data Firehose delivers to the HTTP endpoint destination.
     *
     * You can back up all documents (AllData) or only the documents that Kinesis Data Firehose could not deliver to the specified HTTP endpoint destination (FailedDataOnly).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration-s3backupmode
     */
    readonly s3BackupMode?: string;

    /**
     * Describes the configuration of a destination in Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration-s3configuration
     */
    readonly s3Configuration: cdk.IResolvable | CfnDeliveryStream.S3DestinationConfigurationProperty;
  }

  /**
   * The configuration of the HTTP endpoint request.
   *
   * Kinesis Firehose supports any custom HTTP endpoint or HTTP endpoints owned by supported third-party service providers, including Datadog, MongoDB, and New Relic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointrequestconfiguration.html
   */
  export interface HttpEndpointRequestConfigurationProperty {
    /**
     * Describes the metadata sent to the HTTP endpoint destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointrequestconfiguration.html#cfn-kinesisfirehose-deliverystream-httpendpointrequestconfiguration-commonattributes
     */
    readonly commonAttributes?: Array<CfnDeliveryStream.HttpEndpointCommonAttributeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Kinesis Data Firehose uses the content encoding to compress the body of a request before sending the request to the destination.
     *
     * For more information, see Content-Encoding in MDN Web Docs, the official Mozilla documentation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointrequestconfiguration.html#cfn-kinesisfirehose-deliverystream-httpendpointrequestconfiguration-contentencoding
     */
    readonly contentEncoding?: string;
  }

  /**
   * Describes the metadata that's delivered to the specified HTTP endpoint destination.
   *
   * Kinesis Firehose supports any custom HTTP endpoint or HTTP endpoints owned by supported third-party service providers, including Datadog, MongoDB, and New Relic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointcommonattribute.html
   */
  export interface HttpEndpointCommonAttributeProperty {
    /**
     * The name of the HTTP endpoint common attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointcommonattribute.html#cfn-kinesisfirehose-deliverystream-httpendpointcommonattribute-attributename
     */
    readonly attributeName: string;

    /**
     * The value of the HTTP endpoint common attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointcommonattribute.html#cfn-kinesisfirehose-deliverystream-httpendpointcommonattribute-attributevalue
     */
    readonly attributeValue: string;
  }

  /**
   * The `S3DestinationConfiguration` property type specifies an Amazon Simple Storage Service (Amazon S3) destination to which Amazon Kinesis Data Firehose (Kinesis Data Firehose) delivers data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-s3destinationconfiguration.html
   */
  export interface S3DestinationConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the Amazon S3 bucket to send data to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-s3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-s3destinationconfiguration-bucketarn
     */
    readonly bucketArn: string;

    /**
     * Configures how Kinesis Data Firehose buffers incoming data while delivering it to the Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-s3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-s3destinationconfiguration-bufferinghints
     */
    readonly bufferingHints?: CfnDeliveryStream.BufferingHintsProperty | cdk.IResolvable;

    /**
     * The CloudWatch logging options for your delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-s3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-s3destinationconfiguration-cloudwatchloggingoptions
     */
    readonly cloudWatchLoggingOptions?: CfnDeliveryStream.CloudWatchLoggingOptionsProperty | cdk.IResolvable;

    /**
     * The type of compression that Kinesis Data Firehose uses to compress the data that it delivers to the Amazon S3 bucket.
     *
     * For valid values, see the `CompressionFormat` content for the [S3DestinationConfiguration](https://docs.aws.amazon.com/firehose/latest/APIReference/API_S3DestinationConfiguration.html) data type in the *Amazon Kinesis Data Firehose API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-s3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-s3destinationconfiguration-compressionformat
     */
    readonly compressionFormat?: string;

    /**
     * Configures Amazon Simple Storage Service (Amazon S3) server-side encryption.
     *
     * Kinesis Data Firehose uses AWS Key Management Service ( AWS KMS) to encrypt the data that it delivers to your Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-s3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-s3destinationconfiguration-encryptionconfiguration
     */
    readonly encryptionConfiguration?: CfnDeliveryStream.EncryptionConfigurationProperty | cdk.IResolvable;

    /**
     * A prefix that Kinesis Data Firehose evaluates and adds to failed records before writing them to S3.
     *
     * This prefix appears immediately following the bucket name. For information about how to specify this prefix, see [Custom Prefixes for Amazon S3 Objects](https://docs.aws.amazon.com/firehose/latest/dev/s3-prefixes.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-s3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-s3destinationconfiguration-erroroutputprefix
     */
    readonly errorOutputPrefix?: string;

    /**
     * A prefix that Kinesis Data Firehose adds to the files that it delivers to the Amazon S3 bucket.
     *
     * The prefix helps you identify the files that Kinesis Data Firehose delivered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-s3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-s3destinationconfiguration-prefix
     */
    readonly prefix?: string;

    /**
     * The ARN of an AWS Identity and Access Management (IAM) role that grants Kinesis Data Firehose access to your Amazon S3 bucket and AWS KMS (if you enable data encryption).
     *
     * For more information, see [Grant Kinesis Data Firehose Access to an Amazon S3 Destination](https://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html#using-iam-s3) in the *Amazon Kinesis Data Firehose Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-s3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-s3destinationconfiguration-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * The `BufferingHints` property type specifies how Amazon Kinesis Data Firehose (Kinesis Data Firehose) buffers incoming data before delivering it to the destination.
   *
   * The first buffer condition that is satisfied triggers Kinesis Data Firehose to deliver the data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-bufferinghints.html
   */
  export interface BufferingHintsProperty {
    /**
     * The length of time, in seconds, that Kinesis Data Firehose buffers incoming data before delivering it to the destination.
     *
     * For valid values, see the `IntervalInSeconds` content for the [BufferingHints](https://docs.aws.amazon.com/firehose/latest/APIReference/API_BufferingHints.html) data type in the *Amazon Kinesis Data Firehose API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-bufferinghints.html#cfn-kinesisfirehose-deliverystream-bufferinghints-intervalinseconds
     */
    readonly intervalInSeconds?: number;

    /**
     * The size of the buffer, in MBs, that Kinesis Data Firehose uses for incoming data before delivering it to the destination.
     *
     * For valid values, see the `SizeInMBs` content for the [BufferingHints](https://docs.aws.amazon.com/firehose/latest/APIReference/API_BufferingHints.html) data type in the *Amazon Kinesis Data Firehose API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-bufferinghints.html#cfn-kinesisfirehose-deliverystream-bufferinghints-sizeinmbs
     */
    readonly sizeInMBs?: number;
  }

  /**
   * The `EncryptionConfiguration` property type specifies the encryption settings that Amazon Kinesis Data Firehose (Kinesis Data Firehose) uses when delivering data to Amazon Simple Storage Service (Amazon S3).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-encryptionconfiguration.html
   */
  export interface EncryptionConfigurationProperty {
    /**
     * The AWS Key Management Service ( AWS KMS) encryption key that Amazon S3 uses to encrypt your data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-encryptionconfiguration.html#cfn-kinesisfirehose-deliverystream-encryptionconfiguration-kmsencryptionconfig
     */
    readonly kmsEncryptionConfig?: cdk.IResolvable | CfnDeliveryStream.KMSEncryptionConfigProperty;

    /**
     * Disables encryption.
     *
     * For valid values, see the `NoEncryptionConfig` content for the [EncryptionConfiguration](https://docs.aws.amazon.com/firehose/latest/APIReference/API_EncryptionConfiguration.html) data type in the *Amazon Kinesis Data Firehose API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-encryptionconfiguration.html#cfn-kinesisfirehose-deliverystream-encryptionconfiguration-noencryptionconfig
     */
    readonly noEncryptionConfig?: string;
  }

  /**
   * The `KMSEncryptionConfig` property type specifies the AWS Key Management Service ( AWS KMS) encryption key that Amazon Simple Storage Service (Amazon S3) uses to encrypt data delivered by the Amazon Kinesis Data Firehose (Kinesis Data Firehose) stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-kmsencryptionconfig.html
   */
  export interface KMSEncryptionConfigProperty {
    /**
     * The Amazon Resource Name (ARN) of the AWS KMS encryption key that Amazon S3 uses to encrypt data delivered by the Kinesis Data Firehose stream.
     *
     * The key must belong to the same region as the destination S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-kmsencryptionconfig.html#cfn-kinesisfirehose-deliverystream-kmsencryptionconfig-awskmskeyarn
     */
    readonly awskmsKeyArn: string;
  }

  /**
   * The `CloudWatchLoggingOptions` property type specifies Amazon CloudWatch Logs (CloudWatch Logs) logging options that Amazon Kinesis Data Firehose (Kinesis Data Firehose) uses for the delivery stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-cloudwatchloggingoptions.html
   */
  export interface CloudWatchLoggingOptionsProperty {
    /**
     * Indicates whether CloudWatch Logs logging is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-cloudwatchloggingoptions.html#cfn-kinesisfirehose-deliverystream-cloudwatchloggingoptions-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The name of the CloudWatch Logs log group that contains the log stream that Kinesis Data Firehose will use.
     *
     * Conditional. If you enable logging, you must specify this property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-cloudwatchloggingoptions.html#cfn-kinesisfirehose-deliverystream-cloudwatchloggingoptions-loggroupname
     */
    readonly logGroupName?: string;

    /**
     * The name of the CloudWatch Logs log stream that Kinesis Data Firehose uses to send logs about data delivery.
     *
     * Conditional. If you enable logging, you must specify this property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-cloudwatchloggingoptions.html#cfn-kinesisfirehose-deliverystream-cloudwatchloggingoptions-logstreamname
     */
    readonly logStreamName?: string;
  }

  /**
   * Describes the retry behavior in case Kinesis Data Firehose is unable to deliver data to the specified HTTP endpoint destination, or if it doesn't receive a valid acknowledgment of receipt from the specified HTTP endpoint destination.
   *
   * Kinesis Firehose supports any custom HTTP endpoint or HTTP endpoints owned by supported third-party service providers, including Datadog, MongoDB, and New Relic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-retryoptions.html
   */
  export interface RetryOptionsProperty {
    /**
     * The total amount of time that Kinesis Data Firehose spends on retries.
     *
     * This duration starts after the initial attempt to send data to the custom destination via HTTPS endpoint fails. It doesn't include the periods during which Kinesis Data Firehose waits for acknowledgment from the specified destination after each attempt.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-retryoptions.html#cfn-kinesisfirehose-deliverystream-retryoptions-durationinseconds
     */
    readonly durationInSeconds?: number;
  }

  /**
   * Describes the configuration of the HTTP endpoint to which Kinesis Firehose delivers data.
   *
   * Kinesis Firehose supports any custom HTTP endpoint or HTTP endpoints owned by supported third-party service providers, including Datadog, MongoDB, and New Relic.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointconfiguration.html
   */
  export interface HttpEndpointConfigurationProperty {
    /**
     * The access key required for Kinesis Firehose to authenticate with the HTTP endpoint selected as the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointconfiguration.html#cfn-kinesisfirehose-deliverystream-httpendpointconfiguration-accesskey
     */
    readonly accessKey?: string;

    /**
     * The name of the HTTP endpoint selected as the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointconfiguration.html#cfn-kinesisfirehose-deliverystream-httpendpointconfiguration-name
     */
    readonly name?: string;

    /**
     * The URL of the HTTP endpoint selected as the destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-httpendpointconfiguration.html#cfn-kinesisfirehose-deliverystream-httpendpointconfiguration-url
     */
    readonly url: string;
  }

  /**
   * The `ProcessingConfiguration` property configures data processing for an Amazon Kinesis Data Firehose delivery stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processingconfiguration.html
   */
  export interface ProcessingConfigurationProperty {
    /**
     * Indicates whether data processing is enabled (true) or disabled (false).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processingconfiguration.html#cfn-kinesisfirehose-deliverystream-processingconfiguration-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The data processors.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processingconfiguration.html#cfn-kinesisfirehose-deliverystream-processingconfiguration-processors
     */
    readonly processors?: Array<cdk.IResolvable | CfnDeliveryStream.ProcessorProperty> | cdk.IResolvable;
  }

  /**
   * The `Processor` property specifies a data processor for an Amazon Kinesis Data Firehose delivery stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processor.html
   */
  export interface ProcessorProperty {
    /**
     * The processor parameters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processor.html#cfn-kinesisfirehose-deliverystream-processor-parameters
     */
    readonly parameters?: Array<cdk.IResolvable | CfnDeliveryStream.ProcessorParameterProperty> | cdk.IResolvable;

    /**
     * The type of processor.
     *
     * Valid values: `Lambda` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processor.html#cfn-kinesisfirehose-deliverystream-processor-type
     */
    readonly type: string;
  }

  /**
   * The `ProcessorParameter` property specifies a processor parameter in a data processor for an Amazon Kinesis Data Firehose delivery stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processorparameter.html
   */
  export interface ProcessorParameterProperty {
    /**
     * The name of the parameter.
     *
     * Currently the following default values are supported: 3 for `NumberOfRetries` and 60 for the `BufferIntervalInSeconds` . The `BufferSizeInMBs` ranges between 0.2 MB and up to 3MB. The default buffering hint is 1MB for all destinations, except Splunk. For Splunk, the default buffering hint is 256 KB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processorparameter.html#cfn-kinesisfirehose-deliverystream-processorparameter-parametername
     */
    readonly parameterName: string;

    /**
     * The parameter value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processorparameter.html#cfn-kinesisfirehose-deliverystream-processorparameter-parametervalue
     */
    readonly parameterValue: string;
  }

  /**
   * The `KinesisStreamSourceConfiguration` property type specifies the stream and role Amazon Resource Names (ARNs) for a Kinesis stream used as the source for a delivery stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-kinesisstreamsourceconfiguration.html
   */
  export interface KinesisStreamSourceConfigurationProperty {
    /**
     * The ARN of the source Kinesis data stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-kinesisstreamsourceconfiguration.html#cfn-kinesisfirehose-deliverystream-kinesisstreamsourceconfiguration-kinesisstreamarn
     */
    readonly kinesisStreamArn: string;

    /**
     * The ARN of the role that provides access to the source Kinesis data stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-kinesisstreamsourceconfiguration.html#cfn-kinesisfirehose-deliverystream-kinesisstreamsourceconfiguration-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * The `RedshiftDestinationConfiguration` property type specifies an Amazon Redshift cluster to which Amazon Kinesis Data Firehose (Kinesis Data Firehose) delivers data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-redshiftdestinationconfiguration.html
   */
  export interface RedshiftDestinationConfigurationProperty {
    /**
     * The CloudWatch logging options for your delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-redshiftdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-redshiftdestinationconfiguration-cloudwatchloggingoptions
     */
    readonly cloudWatchLoggingOptions?: CfnDeliveryStream.CloudWatchLoggingOptionsProperty | cdk.IResolvable;

    /**
     * The connection string that Kinesis Data Firehose uses to connect to the Amazon Redshift cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-redshiftdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-redshiftdestinationconfiguration-clusterjdbcurl
     */
    readonly clusterJdbcurl: string;

    /**
     * Configures the Amazon Redshift `COPY` command that Kinesis Data Firehose uses to load data into the cluster from the Amazon S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-redshiftdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-redshiftdestinationconfiguration-copycommand
     */
    readonly copyCommand: CfnDeliveryStream.CopyCommandProperty | cdk.IResolvable;

    /**
     * The password for the Amazon Redshift user that you specified in the `Username` property.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-redshiftdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-redshiftdestinationconfiguration-password
     */
    readonly password: string;

    /**
     * The data processing configuration for the Kinesis Data Firehose delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-redshiftdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-redshiftdestinationconfiguration-processingconfiguration
     */
    readonly processingConfiguration?: cdk.IResolvable | CfnDeliveryStream.ProcessingConfigurationProperty;

    /**
     * The retry behavior in case Kinesis Data Firehose is unable to deliver documents to Amazon Redshift.
     *
     * Default value is 3600 (60 minutes).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-redshiftdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-redshiftdestinationconfiguration-retryoptions
     */
    readonly retryOptions?: cdk.IResolvable | CfnDeliveryStream.RedshiftRetryOptionsProperty;

    /**
     * The ARN of the AWS Identity and Access Management (IAM) role that grants Kinesis Data Firehose access to your Amazon S3 bucket and AWS KMS (if you enable data encryption).
     *
     * For more information, see [Grant Kinesis Data Firehose Access to an Amazon Redshift Destination](https://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html#using-iam-rs) in the *Amazon Kinesis Data Firehose Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-redshiftdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-redshiftdestinationconfiguration-rolearn
     */
    readonly roleArn: string;

    /**
     * The configuration for backup in Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-redshiftdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-redshiftdestinationconfiguration-s3backupconfiguration
     */
    readonly s3BackupConfiguration?: cdk.IResolvable | CfnDeliveryStream.S3DestinationConfigurationProperty;

    /**
     * The Amazon S3 backup mode.
     *
     * After you create a delivery stream, you can update it to enable Amazon S3 backup if it is disabled. If backup is enabled, you can't update the delivery stream to disable it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-redshiftdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-redshiftdestinationconfiguration-s3backupmode
     */
    readonly s3BackupMode?: string;

    /**
     * The S3 bucket where Kinesis Data Firehose first delivers data.
     *
     * After the data is in the bucket, Kinesis Data Firehose uses the `COPY` command to load the data into the Amazon Redshift cluster. For the Amazon S3 bucket's compression format, don't specify `SNAPPY` or `ZIP` because the Amazon Redshift `COPY` command doesn't support them.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-redshiftdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-redshiftdestinationconfiguration-s3configuration
     */
    readonly s3Configuration: cdk.IResolvable | CfnDeliveryStream.S3DestinationConfigurationProperty;

    /**
     * The Amazon Redshift user that has permission to access the Amazon Redshift cluster.
     *
     * This user must have `INSERT` privileges for copying data from the Amazon S3 bucket to the cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-redshiftdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-redshiftdestinationconfiguration-username
     */
    readonly username: string;
  }

  /**
   * The `CopyCommand` property type configures the Amazon Redshift `COPY` command that Amazon Kinesis Data Firehose (Kinesis Data Firehose) uses to load data into an Amazon Redshift cluster from an Amazon S3 bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-copycommand.html
   */
  export interface CopyCommandProperty {
    /**
     * Parameters to use with the Amazon Redshift `COPY` command.
     *
     * For examples, see the `CopyOptions` content for the [CopyCommand](https://docs.aws.amazon.com/firehose/latest/APIReference/API_CopyCommand.html) data type in the *Amazon Kinesis Data Firehose API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-copycommand.html#cfn-kinesisfirehose-deliverystream-copycommand-copyoptions
     */
    readonly copyOptions?: string;

    /**
     * A comma-separated list of column names.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-copycommand.html#cfn-kinesisfirehose-deliverystream-copycommand-datatablecolumns
     */
    readonly dataTableColumns?: string;

    /**
     * The name of the target table.
     *
     * The table must already exist in the database.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-copycommand.html#cfn-kinesisfirehose-deliverystream-copycommand-datatablename
     */
    readonly dataTableName: string;
  }

  /**
   * Configures retry behavior in case Kinesis Data Firehose is unable to deliver documents to Amazon Redshift.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-redshiftretryoptions.html
   */
  export interface RedshiftRetryOptionsProperty {
    /**
     * The length of time during which Kinesis Data Firehose retries delivery after a failure, starting from the initial request and including the first attempt.
     *
     * The default value is 3600 seconds (60 minutes). Kinesis Data Firehose does not retry if the value of `DurationInSeconds` is 0 (zero) or if the first delivery attempt takes longer than the current value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-redshiftretryoptions.html#cfn-kinesisfirehose-deliverystream-redshiftretryoptions-durationinseconds
     */
    readonly durationInSeconds?: number;
  }

  /**
   * Describes the configuration of a destination in Amazon OpenSearch Service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html
   */
  export interface AmazonopensearchserviceDestinationConfigurationProperty {
    /**
     * The buffering options.
     *
     * If no value is specified, the default values for AmazonopensearchserviceBufferingHints are used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration-bufferinghints
     */
    readonly bufferingHints?: CfnDeliveryStream.AmazonopensearchserviceBufferingHintsProperty | cdk.IResolvable;

    /**
     * Describes the Amazon CloudWatch logging options for your delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration-cloudwatchloggingoptions
     */
    readonly cloudWatchLoggingOptions?: CfnDeliveryStream.CloudWatchLoggingOptionsProperty | cdk.IResolvable;

    /**
     * The endpoint to use when communicating with the cluster.
     *
     * Specify either this ClusterEndpoint or the DomainARN field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration-clusterendpoint
     */
    readonly clusterEndpoint?: string;

    /**
     * Indicates the method for setting up document ID.
     *
     * The supported methods are Kinesis Data Firehose generated document ID and OpenSearch Service generated document ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration-documentidoptions
     */
    readonly documentIdOptions?: CfnDeliveryStream.DocumentIdOptionsProperty | cdk.IResolvable;

    /**
     * The ARN of the Amazon OpenSearch Service domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration-domainarn
     */
    readonly domainArn?: string;

    /**
     * The Amazon OpenSearch Service index name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration-indexname
     */
    readonly indexName: string;

    /**
     * The Amazon OpenSearch Service index rotation period.
     *
     * Index rotation appends a timestamp to the IndexName to facilitate the expiration of old data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration-indexrotationperiod
     */
    readonly indexRotationPeriod?: string;

    /**
     * Describes a data processing configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration-processingconfiguration
     */
    readonly processingConfiguration?: cdk.IResolvable | CfnDeliveryStream.ProcessingConfigurationProperty;

    /**
     * The retry behavior in case Kinesis Data Firehose is unable to deliver documents to Amazon OpenSearch Service.
     *
     * The default value is 300 (5 minutes).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration-retryoptions
     */
    readonly retryOptions?: CfnDeliveryStream.AmazonopensearchserviceRetryOptionsProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the IAM role to be assumed by Kinesis Data Firehose for calling the Amazon OpenSearch Service Configuration API and for indexing documents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration-rolearn
     */
    readonly roleArn: string;

    /**
     * Defines how documents should be delivered to Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration-s3backupmode
     */
    readonly s3BackupMode?: string;

    /**
     * Describes the configuration of a destination in Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration-s3configuration
     */
    readonly s3Configuration: cdk.IResolvable | CfnDeliveryStream.S3DestinationConfigurationProperty;

    /**
     * The Amazon OpenSearch Service type name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration-typename
     */
    readonly typeName?: string;

    /**
     * The details of the VPC of the Amazon OpenSearch Service destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration-vpcconfiguration
     */
    readonly vpcConfiguration?: cdk.IResolvable | CfnDeliveryStream.VpcConfigurationProperty;
  }

  /**
   * Indicates the method for setting up document ID.
   *
   * The supported methods are Kinesis Data Firehose generated document ID and OpenSearch Service generated document ID.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-documentidoptions.html
   */
  export interface DocumentIdOptionsProperty {
    /**
     * When the `FIREHOSE_DEFAULT` option is chosen, Kinesis Data Firehose generates a unique document ID for each record based on a unique internal identifier.
     *
     * The generated document ID is stable across multiple delivery attempts, which helps prevent the same record from being indexed multiple times with different document IDs.
     *
     * When the `NO_DOCUMENT_ID` option is chosen, Kinesis Data Firehose does not include any document IDs in the requests it sends to the Amazon OpenSearch Service. This causes the Amazon OpenSearch Service domain to generate document IDs. In case of multiple delivery attempts, this may cause the same record to be indexed more than once with different document IDs. This option enables write-heavy operations, such as the ingestion of logs and observability data, to consume less resources in the Amazon OpenSearch Service domain, resulting in improved performance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-documentidoptions.html#cfn-kinesisfirehose-deliverystream-documentidoptions-defaultdocumentidformat
     */
    readonly defaultDocumentIdFormat: string;
  }

  /**
   * Describes the buffering to perform before delivering data to the Amazon OpenSearch Service destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicebufferinghints.html
   */
  export interface AmazonopensearchserviceBufferingHintsProperty {
    /**
     * Buffer incoming data for the specified period of time, in seconds, before delivering it to the destination.
     *
     * The default value is 300 (5 minutes).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicebufferinghints.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicebufferinghints-intervalinseconds
     */
    readonly intervalInSeconds?: number;

    /**
     * Buffer incoming data to the specified size, in MBs, before delivering it to the destination.
     *
     * The default value is 5. We recommend setting this parameter to a value greater than the amount of data you typically ingest into the delivery stream in 10 seconds. For example, if you typically ingest data at 1 MB/sec, the value should be 10 MB or higher.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchservicebufferinghints.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicebufferinghints-sizeinmbs
     */
    readonly sizeInMBs?: number;
  }

  /**
   * Configures retry behavior in case Kinesis Data Firehose is unable to deliver documents to Amazon OpenSearch Service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserviceretryoptions.html
   */
  export interface AmazonopensearchserviceRetryOptionsProperty {
    /**
     * After an initial failure to deliver to Amazon OpenSearch Service, the total amount of time during which Kinesis Data Firehose retries delivery (including the first attempt).
     *
     * After this time has elapsed, the failed documents are written to Amazon S3. Default value is 300 seconds (5 minutes). A value of 0 (zero) results in no retries.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserviceretryoptions.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserviceretryoptions-durationinseconds
     */
    readonly durationInSeconds?: number;
  }

  /**
   * The details of the VPC of the Amazon ES destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-vpcconfiguration.html
   */
  export interface VpcConfigurationProperty {
    /**
     * The ARN of the IAM role that you want the delivery stream to use to create endpoints in the destination VPC.
     *
     * You can use your existing Kinesis Data Firehose delivery role or you can specify a new role. In either case, make sure that the role trusts the Kinesis Data Firehose service principal and that it grants the following permissions:
     *
     * - `ec2:DescribeVpcs`
     * - `ec2:DescribeVpcAttribute`
     * - `ec2:DescribeSubnets`
     * - `ec2:DescribeSecurityGroups`
     * - `ec2:DescribeNetworkInterfaces`
     * - `ec2:CreateNetworkInterface`
     * - `ec2:CreateNetworkInterfacePermission`
     * - `ec2:DeleteNetworkInterface`
     *
     * If you revoke these permissions after you create the delivery stream, Kinesis Data Firehose can't scale out by creating more ENIs when necessary. You might therefore see a degradation in performance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-vpcconfiguration.html#cfn-kinesisfirehose-deliverystream-vpcconfiguration-rolearn
     */
    readonly roleArn: string;

    /**
     * The IDs of the security groups that you want Kinesis Data Firehose to use when it creates ENIs in the VPC of the Amazon ES destination.
     *
     * You can use the same security group that the Amazon ES domain uses or different ones. If you specify different security groups here, ensure that they allow outbound HTTPS traffic to the Amazon ES domain's security group. Also ensure that the Amazon ES domain's security group allows HTTPS traffic from the security groups specified here. If you use the same security group for both your delivery stream and the Amazon ES domain, make sure the security group inbound rule allows HTTPS traffic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-vpcconfiguration.html#cfn-kinesisfirehose-deliverystream-vpcconfiguration-securitygroupids
     */
    readonly securityGroupIds: Array<string>;

    /**
     * The IDs of the subnets that Kinesis Data Firehose uses to create ENIs in the VPC of the Amazon ES destination.
     *
     * Make sure that the routing tables and inbound and outbound rules allow traffic to flow from the subnets whose IDs are specified here to the subnets that have the destination Amazon ES endpoints. Kinesis Data Firehose creates at least one ENI in each of the subnets that are specified here. Do not delete or modify these ENIs.
     *
     * The number of ENIs that Kinesis Data Firehose creates in the subnets specified here scales up and down automatically based on throughput. To enable Kinesis Data Firehose to scale up the number of ENIs to match throughput, ensure that you have sufficient quota. To help you calculate the quota you need, assume that Kinesis Data Firehose can create up to three ENIs for this delivery stream for each of the subnets specified here.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-vpcconfiguration.html#cfn-kinesisfirehose-deliverystream-vpcconfiguration-subnetids
     */
    readonly subnetIds: Array<string>;
  }

  /**
   * The configuration for the Amazon MSK cluster to be used as the source for a delivery stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-msksourceconfiguration.html
   */
  export interface MSKSourceConfigurationProperty {
    /**
     * The authentication configuration of the Amazon MSK cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-msksourceconfiguration.html#cfn-kinesisfirehose-deliverystream-msksourceconfiguration-authenticationconfiguration
     */
    readonly authenticationConfiguration: CfnDeliveryStream.AuthenticationConfigurationProperty | cdk.IResolvable;

    /**
     * The ARN of the Amazon MSK cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-msksourceconfiguration.html#cfn-kinesisfirehose-deliverystream-msksourceconfiguration-mskclusterarn
     */
    readonly mskClusterArn: string;

    /**
     * The topic name within the Amazon MSK cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-msksourceconfiguration.html#cfn-kinesisfirehose-deliverystream-msksourceconfiguration-topicname
     */
    readonly topicName: string;
  }

  /**
   * The authentication configuration of the Amazon MSK cluster.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-authenticationconfiguration.html
   */
  export interface AuthenticationConfigurationProperty {
    /**
     * The type of connectivity used to access the Amazon MSK cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-authenticationconfiguration.html#cfn-kinesisfirehose-deliverystream-authenticationconfiguration-connectivity
     */
    readonly connectivity: string;

    /**
     * The ARN of the role used to access the Amazon MSK cluster.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-authenticationconfiguration.html#cfn-kinesisfirehose-deliverystream-authenticationconfiguration-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * The `SplunkDestinationConfiguration` property type specifies the configuration of a destination in Splunk for a Kinesis Data Firehose delivery stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html
   */
  export interface SplunkDestinationConfigurationProperty {
    /**
     * The buffering options.
     *
     * If no value is specified, the default values for Splunk are used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-bufferinghints
     */
    readonly bufferingHints?: cdk.IResolvable | CfnDeliveryStream.SplunkBufferingHintsProperty;

    /**
     * The Amazon CloudWatch logging options for your delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-cloudwatchloggingoptions
     */
    readonly cloudWatchLoggingOptions?: CfnDeliveryStream.CloudWatchLoggingOptionsProperty | cdk.IResolvable;

    /**
     * The amount of time that Kinesis Data Firehose waits to receive an acknowledgment from Splunk after it sends it data.
     *
     * At the end of the timeout period, Kinesis Data Firehose either tries to send the data again or considers it an error, based on your retry settings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-hecacknowledgmenttimeoutinseconds
     */
    readonly hecAcknowledgmentTimeoutInSeconds?: number;

    /**
     * The HTTP Event Collector (HEC) endpoint to which Kinesis Data Firehose sends your data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-hecendpoint
     */
    readonly hecEndpoint: string;

    /**
     * This type can be either `Raw` or `Event` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-hecendpointtype
     */
    readonly hecEndpointType: string;

    /**
     * This is a GUID that you obtain from your Splunk cluster when you create a new HEC endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-hectoken
     */
    readonly hecToken: string;

    /**
     * The data processing configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-processingconfiguration
     */
    readonly processingConfiguration?: cdk.IResolvable | CfnDeliveryStream.ProcessingConfigurationProperty;

    /**
     * The retry behavior in case Kinesis Data Firehose is unable to deliver data to Splunk, or if it doesn't receive an acknowledgment of receipt from Splunk.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-retryoptions
     */
    readonly retryOptions?: cdk.IResolvable | CfnDeliveryStream.SplunkRetryOptionsProperty;

    /**
     * Defines how documents should be delivered to Amazon S3.
     *
     * When set to `FailedEventsOnly` , Kinesis Data Firehose writes any data that could not be indexed to the configured Amazon S3 destination. When set to `AllEvents` , Kinesis Data Firehose delivers all incoming records to Amazon S3, and also writes failed documents to Amazon S3. The default value is `FailedEventsOnly` .
     *
     * You can update this backup mode from `FailedEventsOnly` to `AllEvents` . You can't update it from `AllEvents` to `FailedEventsOnly` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-s3backupmode
     */
    readonly s3BackupMode?: string;

    /**
     * The configuration for the backup Amazon S3 location.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration-s3configuration
     */
    readonly s3Configuration: cdk.IResolvable | CfnDeliveryStream.S3DestinationConfigurationProperty;
  }

  /**
   * The `SplunkRetryOptions` property type specifies retry behavior in case Kinesis Data Firehose is unable to deliver documents to Splunk or if it doesn't receive an acknowledgment from Splunk.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkretryoptions.html
   */
  export interface SplunkRetryOptionsProperty {
    /**
     * The total amount of time that Kinesis Data Firehose spends on retries.
     *
     * This duration starts after the initial attempt to send data to Splunk fails. It doesn't include the periods during which Kinesis Data Firehose waits for acknowledgment from Splunk after each attempt.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkretryoptions.html#cfn-kinesisfirehose-deliverystream-splunkretryoptions-durationinseconds
     */
    readonly durationInSeconds?: number;
  }

  /**
   * The buffering options.
   *
   * If no value is specified, the default values for Splunk are used.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkbufferinghints.html
   */
  export interface SplunkBufferingHintsProperty {
    /**
     * Buffer incoming data for the specified period of time, in seconds, before delivering it to the destination.
     *
     * The default value is 60 (1 minute).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkbufferinghints.html#cfn-kinesisfirehose-deliverystream-splunkbufferinghints-intervalinseconds
     */
    readonly intervalInSeconds?: number;

    /**
     * Buffer incoming data to the specified size, in MBs, before delivering it to the destination.
     *
     * The default value is 5.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-splunkbufferinghints.html#cfn-kinesisfirehose-deliverystream-splunkbufferinghints-sizeinmbs
     */
    readonly sizeInMBs?: number;
  }

  /**
   * The `ExtendedS3DestinationConfiguration` property type configures an Amazon S3 destination for an Amazon Kinesis Data Firehose delivery stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html
   */
  export interface ExtendedS3DestinationConfigurationProperty {
    /**
     * The Amazon Resource Name (ARN) of the Amazon S3 bucket.
     *
     * For constraints, see [ExtendedS3DestinationConfiguration](https://docs.aws.amazon.com/firehose/latest/APIReference/API_ExtendedS3DestinationConfiguration.html) in the *Amazon Kinesis Data Firehose API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-bucketarn
     */
    readonly bucketArn: string;

    /**
     * The buffering option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-bufferinghints
     */
    readonly bufferingHints?: CfnDeliveryStream.BufferingHintsProperty | cdk.IResolvable;

    /**
     * The Amazon CloudWatch logging options for your delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-cloudwatchloggingoptions
     */
    readonly cloudWatchLoggingOptions?: CfnDeliveryStream.CloudWatchLoggingOptionsProperty | cdk.IResolvable;

    /**
     * The compression format.
     *
     * If no value is specified, the default is `UNCOMPRESSED` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-compressionformat
     */
    readonly compressionFormat?: string;

    /**
     * The serializer, deserializer, and schema for converting data from the JSON format to the Parquet or ORC format before writing it to Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-dataformatconversionconfiguration
     */
    readonly dataFormatConversionConfiguration?: CfnDeliveryStream.DataFormatConversionConfigurationProperty | cdk.IResolvable;

    /**
     * The configuration of the dynamic partitioning mechanism that creates targeted data sets from the streaming data by partitioning it based on partition keys.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-dynamicpartitioningconfiguration
     */
    readonly dynamicPartitioningConfiguration?: CfnDeliveryStream.DynamicPartitioningConfigurationProperty | cdk.IResolvable;

    /**
     * The encryption configuration for the Kinesis Data Firehose delivery stream.
     *
     * The default value is `NoEncryption` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-encryptionconfiguration
     */
    readonly encryptionConfiguration?: CfnDeliveryStream.EncryptionConfigurationProperty | cdk.IResolvable;

    /**
     * A prefix that Kinesis Data Firehose evaluates and adds to failed records before writing them to S3.
     *
     * This prefix appears immediately following the bucket name. For information about how to specify this prefix, see [Custom Prefixes for Amazon S3 Objects](https://docs.aws.amazon.com/firehose/latest/dev/s3-prefixes.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-erroroutputprefix
     */
    readonly errorOutputPrefix?: string;

    /**
     * The `YYYY/MM/DD/HH` time format prefix is automatically used for delivered Amazon S3 files.
     *
     * For more information, see [ExtendedS3DestinationConfiguration](https://docs.aws.amazon.com/firehose/latest/APIReference/API_ExtendedS3DestinationConfiguration.html) in the *Amazon Kinesis Data Firehose API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-prefix
     */
    readonly prefix?: string;

    /**
     * The data processing configuration for the Kinesis Data Firehose delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-processingconfiguration
     */
    readonly processingConfiguration?: cdk.IResolvable | CfnDeliveryStream.ProcessingConfigurationProperty;

    /**
     * The Amazon Resource Name (ARN) of the AWS credentials.
     *
     * For constraints, see [ExtendedS3DestinationConfiguration](https://docs.aws.amazon.com/firehose/latest/APIReference/API_ExtendedS3DestinationConfiguration.html) in the *Amazon Kinesis Data Firehose API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-rolearn
     */
    readonly roleArn: string;

    /**
     * The configuration for backup in Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-s3backupconfiguration
     */
    readonly s3BackupConfiguration?: cdk.IResolvable | CfnDeliveryStream.S3DestinationConfigurationProperty;

    /**
     * The Amazon S3 backup mode.
     *
     * After you create a delivery stream, you can update it to enable Amazon S3 backup if it is disabled. If backup is enabled, you can't update the delivery stream to disable it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-extendeds3destinationconfiguration.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration-s3backupmode
     */
    readonly s3BackupMode?: string;
  }

  /**
   * Specifies that you want Kinesis Data Firehose to convert data from the JSON format to the Parquet or ORC format before writing it to Amazon S3.
   *
   * Kinesis Data Firehose uses the serializer and deserializer that you specify, in addition to the column information from the AWS Glue table, to deserialize your input data from JSON and then serialize it to the Parquet or ORC format. For more information, see [Kinesis Data Firehose Record Format Conversion](https://docs.aws.amazon.com/firehose/latest/dev/record-format-conversion.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-dataformatconversionconfiguration.html
   */
  export interface DataFormatConversionConfigurationProperty {
    /**
     * Defaults to `true` .
     *
     * Set it to `false` if you want to disable format conversion while preserving the configuration details.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-dataformatconversionconfiguration.html#cfn-kinesisfirehose-deliverystream-dataformatconversionconfiguration-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * Specifies the deserializer that you want Kinesis Data Firehose to use to convert the format of your data from JSON.
     *
     * This parameter is required if `Enabled` is set to true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-dataformatconversionconfiguration.html#cfn-kinesisfirehose-deliverystream-dataformatconversionconfiguration-inputformatconfiguration
     */
    readonly inputFormatConfiguration?: CfnDeliveryStream.InputFormatConfigurationProperty | cdk.IResolvable;

    /**
     * Specifies the serializer that you want Kinesis Data Firehose to use to convert the format of your data to the Parquet or ORC format.
     *
     * This parameter is required if `Enabled` is set to true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-dataformatconversionconfiguration.html#cfn-kinesisfirehose-deliverystream-dataformatconversionconfiguration-outputformatconfiguration
     */
    readonly outputFormatConfiguration?: cdk.IResolvable | CfnDeliveryStream.OutputFormatConfigurationProperty;

    /**
     * Specifies the AWS Glue Data Catalog table that contains the column information.
     *
     * This parameter is required if `Enabled` is set to true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-dataformatconversionconfiguration.html#cfn-kinesisfirehose-deliverystream-dataformatconversionconfiguration-schemaconfiguration
     */
    readonly schemaConfiguration?: cdk.IResolvable | CfnDeliveryStream.SchemaConfigurationProperty;
  }

  /**
   * Specifies the deserializer you want to use to convert the format of the input data.
   *
   * This parameter is required if `Enabled` is set to true.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-inputformatconfiguration.html
   */
  export interface InputFormatConfigurationProperty {
    /**
     * Specifies which deserializer to use.
     *
     * You can choose either the Apache Hive JSON SerDe or the OpenX JSON SerDe. If both are non-null, the server rejects the request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-inputformatconfiguration.html#cfn-kinesisfirehose-deliverystream-inputformatconfiguration-deserializer
     */
    readonly deserializer?: CfnDeliveryStream.DeserializerProperty | cdk.IResolvable;
  }

  /**
   * The deserializer you want Kinesis Data Firehose to use for converting the input data from JSON.
   *
   * Kinesis Data Firehose then serializes the data to its final format using the `Serializer` . Kinesis Data Firehose supports two types of deserializers: the [Apache Hive JSON SerDe](https://docs.aws.amazon.com/https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-JSON) and the [OpenX JSON SerDe](https://docs.aws.amazon.com/https://github.com/rcongiu/Hive-JSON-Serde) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-deserializer.html
   */
  export interface DeserializerProperty {
    /**
     * The native Hive / HCatalog JsonSerDe.
     *
     * Used by Kinesis Data Firehose for deserializing data, which means converting it from the JSON format in preparation for serializing it to the Parquet or ORC format. This is one of two deserializers you can choose, depending on which one offers the functionality you need. The other option is the OpenX SerDe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-deserializer.html#cfn-kinesisfirehose-deliverystream-deserializer-hivejsonserde
     */
    readonly hiveJsonSerDe?: CfnDeliveryStream.HiveJsonSerDeProperty | cdk.IResolvable;

    /**
     * The OpenX SerDe.
     *
     * Used by Kinesis Data Firehose for deserializing data, which means converting it from the JSON format in preparation for serializing it to the Parquet or ORC format. This is one of two deserializers you can choose, depending on which one offers the functionality you need. The other option is the native Hive / HCatalog JsonSerDe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-deserializer.html#cfn-kinesisfirehose-deliverystream-deserializer-openxjsonserde
     */
    readonly openXJsonSerDe?: cdk.IResolvable | CfnDeliveryStream.OpenXJsonSerDeProperty;
  }

  /**
   * The native Hive / HCatalog JsonSerDe.
   *
   * Used by Kinesis Data Firehose for deserializing data, which means converting it from the JSON format in preparation for serializing it to the Parquet or ORC format. This is one of two deserializers you can choose, depending on which one offers the functionality you need. The other option is the OpenX SerDe.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-hivejsonserde.html
   */
  export interface HiveJsonSerDeProperty {
    /**
     * Indicates how you want Kinesis Data Firehose to parse the date and timestamps that may be present in your input data JSON.
     *
     * To specify these format strings, follow the pattern syntax of JodaTime's DateTimeFormat format strings. For more information, see [Class DateTimeFormat](https://docs.aws.amazon.com/https://www.joda.org/joda-time/apidocs/org/joda/time/format/DateTimeFormat.html) . You can also use the special value `millis` to parse timestamps in epoch milliseconds. If you don't specify a format, Kinesis Data Firehose uses `java.sql.Timestamp::valueOf` by default.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-hivejsonserde.html#cfn-kinesisfirehose-deliverystream-hivejsonserde-timestampformats
     */
    readonly timestampFormats?: Array<string>;
  }

  /**
   * The OpenX SerDe.
   *
   * Used by Kinesis Data Firehose for deserializing data, which means converting it from the JSON format in preparation for serializing it to the Parquet or ORC format. This is one of two deserializers you can choose, depending on which one offers the functionality you need. The other option is the native Hive / HCatalog JsonSerDe.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-openxjsonserde.html
   */
  export interface OpenXJsonSerDeProperty {
    /**
     * When set to `true` , which is the default, Kinesis Data Firehose converts JSON keys to lowercase before deserializing them.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-openxjsonserde.html#cfn-kinesisfirehose-deliverystream-openxjsonserde-caseinsensitive
     */
    readonly caseInsensitive?: boolean | cdk.IResolvable;

    /**
     * Maps column names to JSON keys that aren't identical to the column names.
     *
     * This is useful when the JSON contains keys that are Hive keywords. For example, `timestamp` is a Hive keyword. If you have a JSON key named `timestamp` , set this parameter to `{"ts": "timestamp"}` to map this key to a column named `ts` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-openxjsonserde.html#cfn-kinesisfirehose-deliverystream-openxjsonserde-columntojsonkeymappings
     */
    readonly columnToJsonKeyMappings?: cdk.IResolvable | Record<string, string>;

    /**
     * When set to `true` , specifies that the names of the keys include dots and that you want Kinesis Data Firehose to replace them with underscores.
     *
     * This is useful because Apache Hive does not allow dots in column names. For example, if the JSON contains a key whose name is "a.b", you can define the column name to be "a_b" when using this option.
     *
     * The default is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-openxjsonserde.html#cfn-kinesisfirehose-deliverystream-openxjsonserde-convertdotsinjsonkeystounderscores
     */
    readonly convertDotsInJsonKeysToUnderscores?: boolean | cdk.IResolvable;
  }

  /**
   * Specifies the schema to which you want Kinesis Data Firehose to configure your data before it writes it to Amazon S3.
   *
   * This parameter is required if `Enabled` is set to true.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html
   */
  export interface SchemaConfigurationProperty {
    /**
     * The ID of the AWS Glue Data Catalog.
     *
     * If you don't supply this, the AWS account ID is used by default.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-catalogid
     */
    readonly catalogId?: string;

    /**
     * Specifies the name of the AWS Glue database that contains the schema for the output data.
     *
     * > If the `SchemaConfiguration` request parameter is used as part of invoking the `CreateDeliveryStream` API, then the `DatabaseName` property is required and its value must be specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-databasename
     */
    readonly databaseName?: string;

    /**
     * If you don't specify an AWS Region, the default is the current Region.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-region
     */
    readonly region?: string;

    /**
     * The role that Kinesis Data Firehose can use to access AWS Glue.
     *
     * This role must be in the same account you use for Kinesis Data Firehose. Cross-account roles aren't allowed.
     *
     * > If the `SchemaConfiguration` request parameter is used as part of invoking the `CreateDeliveryStream` API, then the `RoleARN` property is required and its value must be specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-rolearn
     */
    readonly roleArn?: string;

    /**
     * Specifies the AWS Glue table that contains the column information that constitutes your data schema.
     *
     * > If the `SchemaConfiguration` request parameter is used as part of invoking the `CreateDeliveryStream` API, then the `TableName` property is required and its value must be specified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-tablename
     */
    readonly tableName?: string;

    /**
     * Specifies the table version for the output data schema.
     *
     * If you don't specify this version ID, or if you set it to `LATEST` , Kinesis Data Firehose uses the most recent version. This means that any updates to the table are automatically picked up.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-schemaconfiguration.html#cfn-kinesisfirehose-deliverystream-schemaconfiguration-versionid
     */
    readonly versionId?: string;
  }

  /**
   * Specifies the serializer that you want Kinesis Data Firehose to use to convert the format of your data before it writes it to Amazon S3.
   *
   * This parameter is required if `Enabled` is set to true.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-outputformatconfiguration.html
   */
  export interface OutputFormatConfigurationProperty {
    /**
     * Specifies which serializer to use.
     *
     * You can choose either the ORC SerDe or the Parquet SerDe. If both are non-null, the server rejects the request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-outputformatconfiguration.html#cfn-kinesisfirehose-deliverystream-outputformatconfiguration-serializer
     */
    readonly serializer?: cdk.IResolvable | CfnDeliveryStream.SerializerProperty;
  }

  /**
   * The serializer that you want Kinesis Data Firehose to use to convert data to the target format before writing it to Amazon S3.
   *
   * Kinesis Data Firehose supports two types of serializers: the [ORC SerDe](https://docs.aws.amazon.com/https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/orc/OrcSerde.html) and the [Parquet SerDe](https://docs.aws.amazon.com/https://hive.apache.org/javadocs/r1.2.2/api/org/apache/hadoop/hive/ql/io/parquet/serde/ParquetHiveSerDe.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-serializer.html
   */
  export interface SerializerProperty {
    /**
     * A serializer to use for converting data to the ORC format before storing it in Amazon S3.
     *
     * For more information, see [Apache ORC](https://docs.aws.amazon.com/https://orc.apache.org/docs/) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-serializer.html#cfn-kinesisfirehose-deliverystream-serializer-orcserde
     */
    readonly orcSerDe?: cdk.IResolvable | CfnDeliveryStream.OrcSerDeProperty;

    /**
     * A serializer to use for converting data to the Parquet format before storing it in Amazon S3.
     *
     * For more information, see [Apache Parquet](https://docs.aws.amazon.com/https://parquet.apache.org/documentation/latest/) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-serializer.html#cfn-kinesisfirehose-deliverystream-serializer-parquetserde
     */
    readonly parquetSerDe?: cdk.IResolvable | CfnDeliveryStream.ParquetSerDeProperty;
  }

  /**
   * A serializer to use for converting data to the ORC format before storing it in Amazon S3.
   *
   * For more information, see [Apache ORC](https://docs.aws.amazon.com/https://orc.apache.org/docs/) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html
   */
  export interface OrcSerDeProperty {
    /**
     * The Hadoop Distributed File System (HDFS) block size.
     *
     * This is useful if you intend to copy the data from Amazon S3 to HDFS before querying. The default is 256 MiB and the minimum is 64 MiB. Kinesis Data Firehose uses this value for padding calculations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-blocksizebytes
     */
    readonly blockSizeBytes?: number;

    /**
     * The column names for which you want Kinesis Data Firehose to create bloom filters.
     *
     * The default is `null` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-bloomfiltercolumns
     */
    readonly bloomFilterColumns?: Array<string>;

    /**
     * The Bloom filter false positive probability (FPP).
     *
     * The lower the FPP, the bigger the Bloom filter. The default value is 0.05, the minimum is 0, and the maximum is 1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-bloomfilterfalsepositiveprobability
     */
    readonly bloomFilterFalsePositiveProbability?: number;

    /**
     * The compression code to use over data blocks.
     *
     * The default is `SNAPPY` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-compression
     */
    readonly compression?: string;

    /**
     * Represents the fraction of the total number of non-null rows.
     *
     * To turn off dictionary encoding, set this fraction to a number that is less than the number of distinct keys in a dictionary. To always use dictionary encoding, set this threshold to 1.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-dictionarykeythreshold
     */
    readonly dictionaryKeyThreshold?: number;

    /**
     * Set this to `true` to indicate that you want stripes to be padded to the HDFS block boundaries.
     *
     * This is useful if you intend to copy the data from Amazon S3 to HDFS before querying. The default is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-enablepadding
     */
    readonly enablePadding?: boolean | cdk.IResolvable;

    /**
     * The version of the file to write.
     *
     * The possible values are `V0_11` and `V0_12` . The default is `V0_12` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-formatversion
     */
    readonly formatVersion?: string;

    /**
     * A number between 0 and 1 that defines the tolerance for block padding as a decimal fraction of stripe size.
     *
     * The default value is 0.05, which means 5 percent of stripe size.
     *
     * For the default values of 64 MiB ORC stripes and 256 MiB HDFS blocks, the default block padding tolerance of 5 percent reserves a maximum of 3.2 MiB for padding within the 256 MiB block. In such a case, if the available size within the block is more than 3.2 MiB, a new, smaller stripe is inserted to fit within that space. This ensures that no stripe crosses block boundaries and causes remote reads within a node-local task.
     *
     * Kinesis Data Firehose ignores this parameter when `EnablePadding` is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-paddingtolerance
     */
    readonly paddingTolerance?: number;

    /**
     * The number of rows between index entries.
     *
     * The default is 10,000 and the minimum is 1,000.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-rowindexstride
     */
    readonly rowIndexStride?: number;

    /**
     * The number of bytes in each stripe.
     *
     * The default is 64 MiB and the minimum is 8 MiB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-orcserde.html#cfn-kinesisfirehose-deliverystream-orcserde-stripesizebytes
     */
    readonly stripeSizeBytes?: number;
  }

  /**
   * A serializer to use for converting data to the Parquet format before storing it in Amazon S3.
   *
   * For more information, see [Apache Parquet](https://docs.aws.amazon.com/https://parquet.apache.org/documentation/latest/) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html
   */
  export interface ParquetSerDeProperty {
    /**
     * The Hadoop Distributed File System (HDFS) block size.
     *
     * This is useful if you intend to copy the data from Amazon S3 to HDFS before querying. The default is 256 MiB and the minimum is 64 MiB. Kinesis Data Firehose uses this value for padding calculations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-blocksizebytes
     */
    readonly blockSizeBytes?: number;

    /**
     * The compression code to use over data blocks.
     *
     * The possible values are `UNCOMPRESSED` , `SNAPPY` , and `GZIP` , with the default being `SNAPPY` . Use `SNAPPY` for higher decompression speed. Use `GZIP` if the compression ratio is more important than speed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-compression
     */
    readonly compression?: string;

    /**
     * Indicates whether to enable dictionary compression.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-enabledictionarycompression
     */
    readonly enableDictionaryCompression?: boolean | cdk.IResolvable;

    /**
     * The maximum amount of padding to apply.
     *
     * This is useful if you intend to copy the data from Amazon S3 to HDFS before querying. The default is 0.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-maxpaddingbytes
     */
    readonly maxPaddingBytes?: number;

    /**
     * The Parquet page size.
     *
     * Column chunks are divided into pages. A page is conceptually an indivisible unit (in terms of compression and encoding). The minimum value is 64 KiB and the default is 1 MiB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-pagesizebytes
     */
    readonly pageSizeBytes?: number;

    /**
     * Indicates the version of row format to output.
     *
     * The possible values are `V1` and `V2` . The default is `V1` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-parquetserde.html#cfn-kinesisfirehose-deliverystream-parquetserde-writerversion
     */
    readonly writerVersion?: string;
  }

  /**
   * The `DynamicPartitioningConfiguration` property type specifies the configuration of the dynamic partitioning mechanism that creates targeted data sets from the streaming data by partitioning it based on partition keys.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-dynamicpartitioningconfiguration.html
   */
  export interface DynamicPartitioningConfigurationProperty {
    /**
     * Specifies whether dynamic partitioning is enabled for this Kinesis Data Firehose delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-dynamicpartitioningconfiguration.html#cfn-kinesisfirehose-deliverystream-dynamicpartitioningconfiguration-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * Specifies the retry behavior in case Kinesis Data Firehose is unable to deliver data to an Amazon S3 prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-dynamicpartitioningconfiguration.html#cfn-kinesisfirehose-deliverystream-dynamicpartitioningconfiguration-retryoptions
     */
    readonly retryOptions?: cdk.IResolvable | CfnDeliveryStream.RetryOptionsProperty;
  }

  /**
   * Describes the configuration of a destination in the Serverless offering for Amazon OpenSearch Service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration.html
   */
  export interface AmazonOpenSearchServerlessDestinationConfigurationProperty {
    /**
     * The buffering options.
     *
     * If no value is specified, the default values for AmazonopensearchserviceBufferingHints are used.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration-bufferinghints
     */
    readonly bufferingHints?: CfnDeliveryStream.AmazonOpenSearchServerlessBufferingHintsProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration-cloudwatchloggingoptions
     */
    readonly cloudWatchLoggingOptions?: CfnDeliveryStream.CloudWatchLoggingOptionsProperty | cdk.IResolvable;

    /**
     * The endpoint to use when communicating with the collection in the Serverless offering for Amazon OpenSearch Service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration-collectionendpoint
     */
    readonly collectionEndpoint?: string;

    /**
     * The Serverless offering for Amazon OpenSearch Service index name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration-indexname
     */
    readonly indexName: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration-processingconfiguration
     */
    readonly processingConfiguration?: cdk.IResolvable | CfnDeliveryStream.ProcessingConfigurationProperty;

    /**
     * The retry behavior in case Kinesis Data Firehose is unable to deliver documents to the Serverless offering for Amazon OpenSearch Service.
     *
     * The default value is 300 (5 minutes).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration-retryoptions
     */
    readonly retryOptions?: CfnDeliveryStream.AmazonOpenSearchServerlessRetryOptionsProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the IAM role to be assumed by Kinesis Data Firehose for calling the Serverless offering for Amazon OpenSearch Service Configuration API and for indexing documents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration-rolearn
     */
    readonly roleArn: string;

    /**
     * Defines how documents should be delivered to Amazon S3.
     *
     * When it is set to FailedDocumentsOnly, Kinesis Data Firehose writes any documents that could not be indexed to the configured Amazon S3 destination, with AmazonOpenSearchService-failed/ appended to the key prefix. When set to AllDocuments, Kinesis Data Firehose delivers all incoming records to Amazon S3, and also writes failed documents with AmazonOpenSearchService-failed/ appended to the prefix.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration-s3backupmode
     */
    readonly s3BackupMode?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration-s3configuration
     */
    readonly s3Configuration: cdk.IResolvable | CfnDeliveryStream.S3DestinationConfigurationProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration-vpcconfiguration
     */
    readonly vpcConfiguration?: cdk.IResolvable | CfnDeliveryStream.VpcConfigurationProperty;
  }

  /**
   * Describes the buffering to perform before delivering data to the Serverless offering for Amazon OpenSearch Service destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessbufferinghints.html
   */
  export interface AmazonOpenSearchServerlessBufferingHintsProperty {
    /**
     * Buffer incoming data for the specified period of time, in seconds, before delivering it to the destination.
     *
     * The default value is 300 (5 minutes).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessbufferinghints.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserverlessbufferinghints-intervalinseconds
     */
    readonly intervalInSeconds?: number;

    /**
     * Buffer incoming data to the specified size, in MBs, before delivering it to the destination.
     *
     * The default value is 5.
     *
     * We recommend setting this parameter to a value greater than the amount of data you typically ingest into the delivery stream in 10 seconds. For example, if you typically ingest data at 1 MB/sec, the value should be 10 MB or higher.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessbufferinghints.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserverlessbufferinghints-sizeinmbs
     */
    readonly sizeInMBs?: number;
  }

  /**
   * Configures retry behavior in case Kinesis Data Firehose is unable to deliver documents to the Serverless offering for Amazon OpenSearch Service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessretryoptions.html
   */
  export interface AmazonOpenSearchServerlessRetryOptionsProperty {
    /**
     * After an initial failure to deliver to the Serverless offering for Amazon OpenSearch Service, the total amount of time during which Kinesis Data Firehose retries delivery (including the first attempt).
     *
     * After this time has elapsed, the failed documents are written to Amazon S3. Default value is 300 seconds (5 minutes). A value of 0 (zero) results in no retries.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-amazonopensearchserverlessretryoptions.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserverlessretryoptions-durationinseconds
     */
    readonly durationInSeconds?: number;
  }

  /**
   * The `ElasticsearchDestinationConfiguration` property type specifies an Amazon Elasticsearch Service (Amazon ES) domain that Amazon Kinesis Data Firehose (Kinesis Data Firehose) delivers data to.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html
   */
  export interface ElasticsearchDestinationConfigurationProperty {
    /**
     * Configures how Kinesis Data Firehose buffers incoming data while delivering it to the Amazon ES domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-bufferinghints
     */
    readonly bufferingHints?: CfnDeliveryStream.ElasticsearchBufferingHintsProperty | cdk.IResolvable;

    /**
     * The Amazon CloudWatch Logs logging options for the delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-cloudwatchloggingoptions
     */
    readonly cloudWatchLoggingOptions?: CfnDeliveryStream.CloudWatchLoggingOptionsProperty | cdk.IResolvable;

    /**
     * The endpoint to use when communicating with the cluster.
     *
     * Specify either this `ClusterEndpoint` or the `DomainARN` field.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-clusterendpoint
     */
    readonly clusterEndpoint?: string;

    /**
     * Indicates the method for setting up document ID.
     *
     * The supported methods are Kinesis Data Firehose generated document ID and OpenSearch Service generated document ID.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-documentidoptions
     */
    readonly documentIdOptions?: CfnDeliveryStream.DocumentIdOptionsProperty | cdk.IResolvable;

    /**
     * The ARN of the Amazon ES domain.
     *
     * The IAM role must have permissions for `DescribeElasticsearchDomain` , `DescribeElasticsearchDomains` , and `DescribeElasticsearchDomainConfig` after assuming the role specified in *RoleARN* .
     *
     * Specify either `ClusterEndpoint` or `DomainARN` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-domainarn
     */
    readonly domainArn?: string;

    /**
     * The name of the Elasticsearch index to which Kinesis Data Firehose adds data for indexing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-indexname
     */
    readonly indexName: string;

    /**
     * The frequency of Elasticsearch index rotation.
     *
     * If you enable index rotation, Kinesis Data Firehose appends a portion of the UTC arrival timestamp to the specified index name, and rotates the appended timestamp accordingly. For more information, see [Index Rotation for the Amazon ES Destination](https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html#es-index-rotation) in the *Amazon Kinesis Data Firehose Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-indexrotationperiod
     */
    readonly indexRotationPeriod?: string;

    /**
     * The data processing configuration for the Kinesis Data Firehose delivery stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-processingconfiguration
     */
    readonly processingConfiguration?: cdk.IResolvable | CfnDeliveryStream.ProcessingConfigurationProperty;

    /**
     * The retry behavior when Kinesis Data Firehose is unable to deliver data to Amazon ES.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-retryoptions
     */
    readonly retryOptions?: CfnDeliveryStream.ElasticsearchRetryOptionsProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the IAM role to be assumed by Kinesis Data Firehose for calling the Amazon ES Configuration API and for indexing documents.
     *
     * For more information, see [Controlling Access with Amazon Kinesis Data Firehose](https://docs.aws.amazon.com/firehose/latest/dev/controlling-access.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-rolearn
     */
    readonly roleArn: string;

    /**
     * The condition under which Kinesis Data Firehose delivers data to Amazon Simple Storage Service (Amazon S3).
     *
     * You can send Amazon S3 all documents (all data) or only the documents that Kinesis Data Firehose could not deliver to the Amazon ES destination. For more information and valid values, see the `S3BackupMode` content for the [ElasticsearchDestinationConfiguration](https://docs.aws.amazon.com/firehose/latest/APIReference/API_ElasticsearchDestinationConfiguration.html) data type in the *Amazon Kinesis Data Firehose API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-s3backupmode
     */
    readonly s3BackupMode?: string;

    /**
     * The S3 bucket where Kinesis Data Firehose backs up incoming data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-s3configuration
     */
    readonly s3Configuration: cdk.IResolvable | CfnDeliveryStream.S3DestinationConfigurationProperty;

    /**
     * The Elasticsearch type name that Amazon ES adds to documents when indexing data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-typename
     */
    readonly typeName?: string;

    /**
     * The details of the VPC of the Amazon ES destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration-vpcconfiguration
     */
    readonly vpcConfiguration?: cdk.IResolvable | CfnDeliveryStream.VpcConfigurationProperty;
  }

  /**
   * The `ElasticsearchBufferingHints` property type specifies how Amazon Kinesis Data Firehose (Kinesis Data Firehose) buffers incoming data while delivering it to the destination.
   *
   * The first buffer condition that is satisfied triggers Kinesis Data Firehose to deliver the data.
   *
   * ElasticsearchBufferingHints is the property type for the `BufferingHints` property of the [Amazon Kinesis Data Firehose DeliveryStream ElasticsearchDestinationConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration.html) property type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchbufferinghints.html
   */
  export interface ElasticsearchBufferingHintsProperty {
    /**
     * The length of time, in seconds, that Kinesis Data Firehose buffers incoming data before delivering it to the destination.
     *
     * For valid values, see the `IntervalInSeconds` content for the [BufferingHints](https://docs.aws.amazon.com/firehose/latest/APIReference/API_BufferingHints.html) data type in the *Amazon Kinesis Data Firehose API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchbufferinghints.html#cfn-kinesisfirehose-deliverystream-elasticsearchbufferinghints-intervalinseconds
     */
    readonly intervalInSeconds?: number;

    /**
     * The size of the buffer, in MBs, that Kinesis Data Firehose uses for incoming data before delivering it to the destination.
     *
     * For valid values, see the `SizeInMBs` content for the [BufferingHints](https://docs.aws.amazon.com/firehose/latest/APIReference/API_BufferingHints.html) data type in the *Amazon Kinesis Data Firehose API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchbufferinghints.html#cfn-kinesisfirehose-deliverystream-elasticsearchbufferinghints-sizeinmbs
     */
    readonly sizeInMBs?: number;
  }

  /**
   * The `ElasticsearchRetryOptions` property type configures the retry behavior for when Amazon Kinesis Data Firehose (Kinesis Data Firehose) can't deliver data to Amazon Elasticsearch Service (Amazon ES).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchretryoptions.html
   */
  export interface ElasticsearchRetryOptionsProperty {
    /**
     * After an initial failure to deliver to Amazon ES, the total amount of time during which Kinesis Data Firehose re-attempts delivery (including the first attempt).
     *
     * If Kinesis Data Firehose can't deliver the data within the specified time, it writes the data to the backup S3 bucket. For valid values, see the `DurationInSeconds` content for the [ElasticsearchRetryOptions](https://docs.aws.amazon.com/firehose/latest/APIReference/API_ElasticsearchRetryOptions.html) data type in the *Amazon Kinesis Data Firehose API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-elasticsearchretryoptions.html#cfn-kinesisfirehose-deliverystream-elasticsearchretryoptions-durationinseconds
     */
    readonly durationInSeconds?: number;
  }
}

/**
 * Properties for defining a `CfnDeliveryStream`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html
 */
export interface CfnDeliveryStreamProps {
  /**
   * Describes the configuration of a destination in the Serverless offering for Amazon OpenSearch Service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-amazonopensearchserverlessdestinationconfiguration
   */
  readonly amazonOpenSearchServerlessDestinationConfiguration?: CfnDeliveryStream.AmazonOpenSearchServerlessDestinationConfigurationProperty | cdk.IResolvable;

  /**
   * The destination in Amazon OpenSearch Service.
   *
   * You can specify only one destination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-amazonopensearchservicedestinationconfiguration
   */
  readonly amazonopensearchserviceDestinationConfiguration?: CfnDeliveryStream.AmazonopensearchserviceDestinationConfigurationProperty | cdk.IResolvable;

  /**
   * Specifies the type and Amazon Resource Name (ARN) of the CMK to use for Server-Side Encryption (SSE).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-deliverystreamencryptionconfigurationinput
   */
  readonly deliveryStreamEncryptionConfigurationInput?: CfnDeliveryStream.DeliveryStreamEncryptionConfigurationInputProperty | cdk.IResolvable;

  /**
   * The name of the delivery stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-deliverystreamname
   */
  readonly deliveryStreamName?: string;

  /**
   * The delivery stream type. This can be one of the following values:.
   *
   * - `DirectPut` : Provider applications access the delivery stream directly.
   * - `KinesisStreamAsSource` : The delivery stream uses a Kinesis data stream as a source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-deliverystreamtype
   */
  readonly deliveryStreamType?: string;

  /**
   * An Amazon ES destination for the delivery stream.
   *
   * Conditional. You must specify only one destination configuration.
   *
   * If you change the delivery stream destination from an Amazon ES destination to an Amazon S3 or Amazon Redshift destination, update requires [some interruptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-some-interrupt) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-elasticsearchdestinationconfiguration
   */
  readonly elasticsearchDestinationConfiguration?: CfnDeliveryStream.ElasticsearchDestinationConfigurationProperty | cdk.IResolvable;

  /**
   * An Amazon S3 destination for the delivery stream.
   *
   * Conditional. You must specify only one destination configuration.
   *
   * If you change the delivery stream destination from an Amazon Extended S3 destination to an Amazon ES destination, update requires [some interruptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-some-interrupt) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-extendeds3destinationconfiguration
   */
  readonly extendedS3DestinationConfiguration?: CfnDeliveryStream.ExtendedS3DestinationConfigurationProperty | cdk.IResolvable;

  /**
   * Enables configuring Kinesis Firehose to deliver data to any HTTP endpoint destination.
   *
   * You can specify only one destination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-httpendpointdestinationconfiguration
   */
  readonly httpEndpointDestinationConfiguration?: CfnDeliveryStream.HttpEndpointDestinationConfigurationProperty | cdk.IResolvable;

  /**
   * When a Kinesis stream is used as the source for the delivery stream, a [KinesisStreamSourceConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-kinesisstreamsourceconfiguration.html) containing the Kinesis stream ARN and the role ARN for the source stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-kinesisstreamsourceconfiguration
   */
  readonly kinesisStreamSourceConfiguration?: cdk.IResolvable | CfnDeliveryStream.KinesisStreamSourceConfigurationProperty;

  /**
   * The configuration for the Amazon MSK cluster to be used as the source for a delivery stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-msksourceconfiguration
   */
  readonly mskSourceConfiguration?: cdk.IResolvable | CfnDeliveryStream.MSKSourceConfigurationProperty;

  /**
   * An Amazon Redshift destination for the delivery stream.
   *
   * Conditional. You must specify only one destination configuration.
   *
   * If you change the delivery stream destination from an Amazon Redshift destination to an Amazon ES destination, update requires [some interruptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-some-interrupt) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-redshiftdestinationconfiguration
   */
  readonly redshiftDestinationConfiguration?: cdk.IResolvable | CfnDeliveryStream.RedshiftDestinationConfigurationProperty;

  /**
   * The `S3DestinationConfiguration` property type specifies an Amazon Simple Storage Service (Amazon S3) destination to which Amazon Kinesis Data Firehose (Kinesis Data Firehose) delivers data.
   *
   * Conditional. You must specify only one destination configuration.
   *
   * If you change the delivery stream destination from an Amazon S3 destination to an Amazon ES destination, update requires [some interruptions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-update-behaviors.html#update-some-interrupt) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-s3destinationconfiguration
   */
  readonly s3DestinationConfiguration?: cdk.IResolvable | CfnDeliveryStream.S3DestinationConfigurationProperty;

  /**
   * The configuration of a destination in Splunk for the delivery stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-splunkdestinationconfiguration
   */
  readonly splunkDestinationConfiguration?: cdk.IResolvable | CfnDeliveryStream.SplunkDestinationConfigurationProperty;

  /**
   * A set of tags to assign to the delivery stream.
   *
   * A tag is a key-value pair that you can define and assign to AWS resources. Tags are metadata. For example, you can add friendly names and descriptions or other types of information that can help you distinguish the delivery stream. For more information about tags, see [Using Cost Allocation Tags](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html) in the AWS Billing and Cost Management User Guide.
   *
   * You can specify up to 50 tags when creating a delivery stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisfirehose-deliverystream.html#cfn-kinesisfirehose-deliverystream-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `DeliveryStreamEncryptionConfigurationInputProperty`
 *
 * @param properties - the TypeScript properties of a `DeliveryStreamEncryptionConfigurationInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamDeliveryStreamEncryptionConfigurationInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyArn", cdk.validateString)(properties.keyArn));
  errors.collect(cdk.propertyValidator("keyType", cdk.requiredValidator)(properties.keyType));
  errors.collect(cdk.propertyValidator("keyType", cdk.validateString)(properties.keyType));
  return errors.wrap("supplied properties not correct for \"DeliveryStreamEncryptionConfigurationInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamDeliveryStreamEncryptionConfigurationInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamDeliveryStreamEncryptionConfigurationInputPropertyValidator(properties).assertSuccess();
  return {
    "KeyARN": cdk.stringToCloudFormation(properties.keyArn),
    "KeyType": cdk.stringToCloudFormation(properties.keyType)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamDeliveryStreamEncryptionConfigurationInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.DeliveryStreamEncryptionConfigurationInputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.DeliveryStreamEncryptionConfigurationInputProperty>();
  ret.addPropertyResult("keyArn", "KeyARN", (properties.KeyARN != null ? cfn_parse.FromCloudFormation.getString(properties.KeyARN) : undefined));
  ret.addPropertyResult("keyType", "KeyType", (properties.KeyType != null ? cfn_parse.FromCloudFormation.getString(properties.KeyType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpEndpointCommonAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `HttpEndpointCommonAttributeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamHttpEndpointCommonAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributeName", cdk.requiredValidator)(properties.attributeName));
  errors.collect(cdk.propertyValidator("attributeName", cdk.validateString)(properties.attributeName));
  errors.collect(cdk.propertyValidator("attributeValue", cdk.requiredValidator)(properties.attributeValue));
  errors.collect(cdk.propertyValidator("attributeValue", cdk.validateString)(properties.attributeValue));
  return errors.wrap("supplied properties not correct for \"HttpEndpointCommonAttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamHttpEndpointCommonAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamHttpEndpointCommonAttributePropertyValidator(properties).assertSuccess();
  return {
    "AttributeName": cdk.stringToCloudFormation(properties.attributeName),
    "AttributeValue": cdk.stringToCloudFormation(properties.attributeValue)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamHttpEndpointCommonAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.HttpEndpointCommonAttributeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.HttpEndpointCommonAttributeProperty>();
  ret.addPropertyResult("attributeName", "AttributeName", (properties.AttributeName != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeName) : undefined));
  ret.addPropertyResult("attributeValue", "AttributeValue", (properties.AttributeValue != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpEndpointRequestConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `HttpEndpointRequestConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamHttpEndpointRequestConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("commonAttributes", cdk.listValidator(CfnDeliveryStreamHttpEndpointCommonAttributePropertyValidator))(properties.commonAttributes));
  errors.collect(cdk.propertyValidator("contentEncoding", cdk.validateString)(properties.contentEncoding));
  return errors.wrap("supplied properties not correct for \"HttpEndpointRequestConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamHttpEndpointRequestConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamHttpEndpointRequestConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CommonAttributes": cdk.listMapper(convertCfnDeliveryStreamHttpEndpointCommonAttributePropertyToCloudFormation)(properties.commonAttributes),
    "ContentEncoding": cdk.stringToCloudFormation(properties.contentEncoding)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamHttpEndpointRequestConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.HttpEndpointRequestConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.HttpEndpointRequestConfigurationProperty>();
  ret.addPropertyResult("commonAttributes", "CommonAttributes", (properties.CommonAttributes != null ? cfn_parse.FromCloudFormation.getArray(CfnDeliveryStreamHttpEndpointCommonAttributePropertyFromCloudFormation)(properties.CommonAttributes) : undefined));
  ret.addPropertyResult("contentEncoding", "ContentEncoding", (properties.ContentEncoding != null ? cfn_parse.FromCloudFormation.getString(properties.ContentEncoding) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BufferingHintsProperty`
 *
 * @param properties - the TypeScript properties of a `BufferingHintsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamBufferingHintsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("intervalInSeconds", cdk.validateNumber)(properties.intervalInSeconds));
  errors.collect(cdk.propertyValidator("sizeInMBs", cdk.validateNumber)(properties.sizeInMBs));
  return errors.wrap("supplied properties not correct for \"BufferingHintsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamBufferingHintsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamBufferingHintsPropertyValidator(properties).assertSuccess();
  return {
    "IntervalInSeconds": cdk.numberToCloudFormation(properties.intervalInSeconds),
    "SizeInMBs": cdk.numberToCloudFormation(properties.sizeInMBs)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamBufferingHintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.BufferingHintsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.BufferingHintsProperty>();
  ret.addPropertyResult("intervalInSeconds", "IntervalInSeconds", (properties.IntervalInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.IntervalInSeconds) : undefined));
  ret.addPropertyResult("sizeInMBs", "SizeInMBs", (properties.SizeInMBs != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizeInMBs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KMSEncryptionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `KMSEncryptionConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamKMSEncryptionConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awskmsKeyArn", cdk.requiredValidator)(properties.awskmsKeyArn));
  errors.collect(cdk.propertyValidator("awskmsKeyArn", cdk.validateString)(properties.awskmsKeyArn));
  return errors.wrap("supplied properties not correct for \"KMSEncryptionConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamKMSEncryptionConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamKMSEncryptionConfigPropertyValidator(properties).assertSuccess();
  return {
    "AWSKMSKeyARN": cdk.stringToCloudFormation(properties.awskmsKeyArn)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamKMSEncryptionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.KMSEncryptionConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.KMSEncryptionConfigProperty>();
  ret.addPropertyResult("awskmsKeyArn", "AWSKMSKeyARN", (properties.AWSKMSKeyARN != null ? cfn_parse.FromCloudFormation.getString(properties.AWSKMSKeyARN) : undefined));
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
function CfnDeliveryStreamEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsEncryptionConfig", CfnDeliveryStreamKMSEncryptionConfigPropertyValidator)(properties.kmsEncryptionConfig));
  errors.collect(cdk.propertyValidator("noEncryptionConfig", cdk.validateString)(properties.noEncryptionConfig));
  return errors.wrap("supplied properties not correct for \"EncryptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamEncryptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "KMSEncryptionConfig": convertCfnDeliveryStreamKMSEncryptionConfigPropertyToCloudFormation(properties.kmsEncryptionConfig),
    "NoEncryptionConfig": cdk.stringToCloudFormation(properties.noEncryptionConfig)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.EncryptionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.EncryptionConfigurationProperty>();
  ret.addPropertyResult("kmsEncryptionConfig", "KMSEncryptionConfig", (properties.KMSEncryptionConfig != null ? CfnDeliveryStreamKMSEncryptionConfigPropertyFromCloudFormation(properties.KMSEncryptionConfig) : undefined));
  ret.addPropertyResult("noEncryptionConfig", "NoEncryptionConfig", (properties.NoEncryptionConfig != null ? cfn_parse.FromCloudFormation.getString(properties.NoEncryptionConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchLoggingOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLoggingOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamCloudWatchLoggingOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("logStreamName", cdk.validateString)(properties.logStreamName));
  return errors.wrap("supplied properties not correct for \"CloudWatchLoggingOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamCloudWatchLoggingOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamCloudWatchLoggingOptionsPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName),
    "LogStreamName": cdk.stringToCloudFormation(properties.logStreamName)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamCloudWatchLoggingOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.CloudWatchLoggingOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.CloudWatchLoggingOptionsProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addPropertyResult("logStreamName", "LogStreamName", (properties.LogStreamName != null ? cfn_parse.FromCloudFormation.getString(properties.LogStreamName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3DestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `S3DestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamS3DestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketArn", cdk.requiredValidator)(properties.bucketArn));
  errors.collect(cdk.propertyValidator("bucketArn", cdk.validateString)(properties.bucketArn));
  errors.collect(cdk.propertyValidator("bufferingHints", CfnDeliveryStreamBufferingHintsPropertyValidator)(properties.bufferingHints));
  errors.collect(cdk.propertyValidator("cloudWatchLoggingOptions", CfnDeliveryStreamCloudWatchLoggingOptionsPropertyValidator)(properties.cloudWatchLoggingOptions));
  errors.collect(cdk.propertyValidator("compressionFormat", cdk.validateString)(properties.compressionFormat));
  errors.collect(cdk.propertyValidator("encryptionConfiguration", CfnDeliveryStreamEncryptionConfigurationPropertyValidator)(properties.encryptionConfiguration));
  errors.collect(cdk.propertyValidator("errorOutputPrefix", cdk.validateString)(properties.errorOutputPrefix));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"S3DestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamS3DestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamS3DestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BucketARN": cdk.stringToCloudFormation(properties.bucketArn),
    "BufferingHints": convertCfnDeliveryStreamBufferingHintsPropertyToCloudFormation(properties.bufferingHints),
    "CloudWatchLoggingOptions": convertCfnDeliveryStreamCloudWatchLoggingOptionsPropertyToCloudFormation(properties.cloudWatchLoggingOptions),
    "CompressionFormat": cdk.stringToCloudFormation(properties.compressionFormat),
    "EncryptionConfiguration": convertCfnDeliveryStreamEncryptionConfigurationPropertyToCloudFormation(properties.encryptionConfiguration),
    "ErrorOutputPrefix": cdk.stringToCloudFormation(properties.errorOutputPrefix),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamS3DestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.S3DestinationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.S3DestinationConfigurationProperty>();
  ret.addPropertyResult("bucketArn", "BucketARN", (properties.BucketARN != null ? cfn_parse.FromCloudFormation.getString(properties.BucketARN) : undefined));
  ret.addPropertyResult("bufferingHints", "BufferingHints", (properties.BufferingHints != null ? CfnDeliveryStreamBufferingHintsPropertyFromCloudFormation(properties.BufferingHints) : undefined));
  ret.addPropertyResult("cloudWatchLoggingOptions", "CloudWatchLoggingOptions", (properties.CloudWatchLoggingOptions != null ? CfnDeliveryStreamCloudWatchLoggingOptionsPropertyFromCloudFormation(properties.CloudWatchLoggingOptions) : undefined));
  ret.addPropertyResult("compressionFormat", "CompressionFormat", (properties.CompressionFormat != null ? cfn_parse.FromCloudFormation.getString(properties.CompressionFormat) : undefined));
  ret.addPropertyResult("encryptionConfiguration", "EncryptionConfiguration", (properties.EncryptionConfiguration != null ? CfnDeliveryStreamEncryptionConfigurationPropertyFromCloudFormation(properties.EncryptionConfiguration) : undefined));
  ret.addPropertyResult("errorOutputPrefix", "ErrorOutputPrefix", (properties.ErrorOutputPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ErrorOutputPrefix) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RetryOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `RetryOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamRetryOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("durationInSeconds", cdk.validateNumber)(properties.durationInSeconds));
  return errors.wrap("supplied properties not correct for \"RetryOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamRetryOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamRetryOptionsPropertyValidator(properties).assertSuccess();
  return {
    "DurationInSeconds": cdk.numberToCloudFormation(properties.durationInSeconds)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamRetryOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.RetryOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.RetryOptionsProperty>();
  ret.addPropertyResult("durationInSeconds", "DurationInSeconds", (properties.DurationInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpEndpointConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `HttpEndpointConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamHttpEndpointConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessKey", cdk.validateString)(properties.accessKey));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("url", cdk.requiredValidator)(properties.url));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"HttpEndpointConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamHttpEndpointConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamHttpEndpointConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AccessKey": cdk.stringToCloudFormation(properties.accessKey),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamHttpEndpointConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.HttpEndpointConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.HttpEndpointConfigurationProperty>();
  ret.addPropertyResult("accessKey", "AccessKey", (properties.AccessKey != null ? cfn_parse.FromCloudFormation.getString(properties.AccessKey) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProcessorParameterProperty`
 *
 * @param properties - the TypeScript properties of a `ProcessorParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamProcessorParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("parameterName", cdk.requiredValidator)(properties.parameterName));
  errors.collect(cdk.propertyValidator("parameterName", cdk.validateString)(properties.parameterName));
  errors.collect(cdk.propertyValidator("parameterValue", cdk.requiredValidator)(properties.parameterValue));
  errors.collect(cdk.propertyValidator("parameterValue", cdk.validateString)(properties.parameterValue));
  return errors.wrap("supplied properties not correct for \"ProcessorParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamProcessorParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamProcessorParameterPropertyValidator(properties).assertSuccess();
  return {
    "ParameterName": cdk.stringToCloudFormation(properties.parameterName),
    "ParameterValue": cdk.stringToCloudFormation(properties.parameterValue)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamProcessorParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.ProcessorParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.ProcessorParameterProperty>();
  ret.addPropertyResult("parameterName", "ParameterName", (properties.ParameterName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterName) : undefined));
  ret.addPropertyResult("parameterValue", "ParameterValue", (properties.ParameterValue != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProcessorProperty`
 *
 * @param properties - the TypeScript properties of a `ProcessorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamProcessorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("parameters", cdk.listValidator(CfnDeliveryStreamProcessorParameterPropertyValidator))(properties.parameters));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ProcessorProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamProcessorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamProcessorPropertyValidator(properties).assertSuccess();
  return {
    "Parameters": cdk.listMapper(convertCfnDeliveryStreamProcessorParameterPropertyToCloudFormation)(properties.parameters),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamProcessorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.ProcessorProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.ProcessorProperty>();
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getArray(CfnDeliveryStreamProcessorParameterPropertyFromCloudFormation)(properties.Parameters) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProcessingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ProcessingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamProcessingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("processors", cdk.listValidator(CfnDeliveryStreamProcessorPropertyValidator))(properties.processors));
  return errors.wrap("supplied properties not correct for \"ProcessingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamProcessingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamProcessingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Processors": cdk.listMapper(convertCfnDeliveryStreamProcessorPropertyToCloudFormation)(properties.processors)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamProcessingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.ProcessingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.ProcessingConfigurationProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("processors", "Processors", (properties.Processors != null ? cfn_parse.FromCloudFormation.getArray(CfnDeliveryStreamProcessorPropertyFromCloudFormation)(properties.Processors) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpEndpointDestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `HttpEndpointDestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamHttpEndpointDestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bufferingHints", CfnDeliveryStreamBufferingHintsPropertyValidator)(properties.bufferingHints));
  errors.collect(cdk.propertyValidator("cloudWatchLoggingOptions", CfnDeliveryStreamCloudWatchLoggingOptionsPropertyValidator)(properties.cloudWatchLoggingOptions));
  errors.collect(cdk.propertyValidator("endpointConfiguration", cdk.requiredValidator)(properties.endpointConfiguration));
  errors.collect(cdk.propertyValidator("endpointConfiguration", CfnDeliveryStreamHttpEndpointConfigurationPropertyValidator)(properties.endpointConfiguration));
  errors.collect(cdk.propertyValidator("processingConfiguration", CfnDeliveryStreamProcessingConfigurationPropertyValidator)(properties.processingConfiguration));
  errors.collect(cdk.propertyValidator("requestConfiguration", CfnDeliveryStreamHttpEndpointRequestConfigurationPropertyValidator)(properties.requestConfiguration));
  errors.collect(cdk.propertyValidator("retryOptions", CfnDeliveryStreamRetryOptionsPropertyValidator)(properties.retryOptions));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("s3BackupMode", cdk.validateString)(properties.s3BackupMode));
  errors.collect(cdk.propertyValidator("s3Configuration", cdk.requiredValidator)(properties.s3Configuration));
  errors.collect(cdk.propertyValidator("s3Configuration", CfnDeliveryStreamS3DestinationConfigurationPropertyValidator)(properties.s3Configuration));
  return errors.wrap("supplied properties not correct for \"HttpEndpointDestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamHttpEndpointDestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamHttpEndpointDestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BufferingHints": convertCfnDeliveryStreamBufferingHintsPropertyToCloudFormation(properties.bufferingHints),
    "CloudWatchLoggingOptions": convertCfnDeliveryStreamCloudWatchLoggingOptionsPropertyToCloudFormation(properties.cloudWatchLoggingOptions),
    "EndpointConfiguration": convertCfnDeliveryStreamHttpEndpointConfigurationPropertyToCloudFormation(properties.endpointConfiguration),
    "ProcessingConfiguration": convertCfnDeliveryStreamProcessingConfigurationPropertyToCloudFormation(properties.processingConfiguration),
    "RequestConfiguration": convertCfnDeliveryStreamHttpEndpointRequestConfigurationPropertyToCloudFormation(properties.requestConfiguration),
    "RetryOptions": convertCfnDeliveryStreamRetryOptionsPropertyToCloudFormation(properties.retryOptions),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn),
    "S3BackupMode": cdk.stringToCloudFormation(properties.s3BackupMode),
    "S3Configuration": convertCfnDeliveryStreamS3DestinationConfigurationPropertyToCloudFormation(properties.s3Configuration)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamHttpEndpointDestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.HttpEndpointDestinationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.HttpEndpointDestinationConfigurationProperty>();
  ret.addPropertyResult("bufferingHints", "BufferingHints", (properties.BufferingHints != null ? CfnDeliveryStreamBufferingHintsPropertyFromCloudFormation(properties.BufferingHints) : undefined));
  ret.addPropertyResult("cloudWatchLoggingOptions", "CloudWatchLoggingOptions", (properties.CloudWatchLoggingOptions != null ? CfnDeliveryStreamCloudWatchLoggingOptionsPropertyFromCloudFormation(properties.CloudWatchLoggingOptions) : undefined));
  ret.addPropertyResult("endpointConfiguration", "EndpointConfiguration", (properties.EndpointConfiguration != null ? CfnDeliveryStreamHttpEndpointConfigurationPropertyFromCloudFormation(properties.EndpointConfiguration) : undefined));
  ret.addPropertyResult("processingConfiguration", "ProcessingConfiguration", (properties.ProcessingConfiguration != null ? CfnDeliveryStreamProcessingConfigurationPropertyFromCloudFormation(properties.ProcessingConfiguration) : undefined));
  ret.addPropertyResult("requestConfiguration", "RequestConfiguration", (properties.RequestConfiguration != null ? CfnDeliveryStreamHttpEndpointRequestConfigurationPropertyFromCloudFormation(properties.RequestConfiguration) : undefined));
  ret.addPropertyResult("retryOptions", "RetryOptions", (properties.RetryOptions != null ? CfnDeliveryStreamRetryOptionsPropertyFromCloudFormation(properties.RetryOptions) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addPropertyResult("s3BackupMode", "S3BackupMode", (properties.S3BackupMode != null ? cfn_parse.FromCloudFormation.getString(properties.S3BackupMode) : undefined));
  ret.addPropertyResult("s3Configuration", "S3Configuration", (properties.S3Configuration != null ? CfnDeliveryStreamS3DestinationConfigurationPropertyFromCloudFormation(properties.S3Configuration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KinesisStreamSourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisStreamSourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamKinesisStreamSourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kinesisStreamArn", cdk.requiredValidator)(properties.kinesisStreamArn));
  errors.collect(cdk.propertyValidator("kinesisStreamArn", cdk.validateString)(properties.kinesisStreamArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"KinesisStreamSourceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamKinesisStreamSourceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamKinesisStreamSourceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "KinesisStreamARN": cdk.stringToCloudFormation(properties.kinesisStreamArn),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamKinesisStreamSourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.KinesisStreamSourceConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.KinesisStreamSourceConfigurationProperty>();
  ret.addPropertyResult("kinesisStreamArn", "KinesisStreamARN", (properties.KinesisStreamARN != null ? cfn_parse.FromCloudFormation.getString(properties.KinesisStreamARN) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CopyCommandProperty`
 *
 * @param properties - the TypeScript properties of a `CopyCommandProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamCopyCommandPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("copyOptions", cdk.validateString)(properties.copyOptions));
  errors.collect(cdk.propertyValidator("dataTableColumns", cdk.validateString)(properties.dataTableColumns));
  errors.collect(cdk.propertyValidator("dataTableName", cdk.requiredValidator)(properties.dataTableName));
  errors.collect(cdk.propertyValidator("dataTableName", cdk.validateString)(properties.dataTableName));
  return errors.wrap("supplied properties not correct for \"CopyCommandProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamCopyCommandPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamCopyCommandPropertyValidator(properties).assertSuccess();
  return {
    "CopyOptions": cdk.stringToCloudFormation(properties.copyOptions),
    "DataTableColumns": cdk.stringToCloudFormation(properties.dataTableColumns),
    "DataTableName": cdk.stringToCloudFormation(properties.dataTableName)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamCopyCommandPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.CopyCommandProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.CopyCommandProperty>();
  ret.addPropertyResult("copyOptions", "CopyOptions", (properties.CopyOptions != null ? cfn_parse.FromCloudFormation.getString(properties.CopyOptions) : undefined));
  ret.addPropertyResult("dataTableColumns", "DataTableColumns", (properties.DataTableColumns != null ? cfn_parse.FromCloudFormation.getString(properties.DataTableColumns) : undefined));
  ret.addPropertyResult("dataTableName", "DataTableName", (properties.DataTableName != null ? cfn_parse.FromCloudFormation.getString(properties.DataTableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RedshiftRetryOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `RedshiftRetryOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamRedshiftRetryOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("durationInSeconds", cdk.validateNumber)(properties.durationInSeconds));
  return errors.wrap("supplied properties not correct for \"RedshiftRetryOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamRedshiftRetryOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamRedshiftRetryOptionsPropertyValidator(properties).assertSuccess();
  return {
    "DurationInSeconds": cdk.numberToCloudFormation(properties.durationInSeconds)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamRedshiftRetryOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.RedshiftRetryOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.RedshiftRetryOptionsProperty>();
  ret.addPropertyResult("durationInSeconds", "DurationInSeconds", (properties.DurationInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RedshiftDestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `RedshiftDestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamRedshiftDestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLoggingOptions", CfnDeliveryStreamCloudWatchLoggingOptionsPropertyValidator)(properties.cloudWatchLoggingOptions));
  errors.collect(cdk.propertyValidator("clusterJdbcurl", cdk.requiredValidator)(properties.clusterJdbcurl));
  errors.collect(cdk.propertyValidator("clusterJdbcurl", cdk.validateString)(properties.clusterJdbcurl));
  errors.collect(cdk.propertyValidator("copyCommand", cdk.requiredValidator)(properties.copyCommand));
  errors.collect(cdk.propertyValidator("copyCommand", CfnDeliveryStreamCopyCommandPropertyValidator)(properties.copyCommand));
  errors.collect(cdk.propertyValidator("password", cdk.requiredValidator)(properties.password));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("processingConfiguration", CfnDeliveryStreamProcessingConfigurationPropertyValidator)(properties.processingConfiguration));
  errors.collect(cdk.propertyValidator("retryOptions", CfnDeliveryStreamRedshiftRetryOptionsPropertyValidator)(properties.retryOptions));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("s3BackupConfiguration", CfnDeliveryStreamS3DestinationConfigurationPropertyValidator)(properties.s3BackupConfiguration));
  errors.collect(cdk.propertyValidator("s3BackupMode", cdk.validateString)(properties.s3BackupMode));
  errors.collect(cdk.propertyValidator("s3Configuration", cdk.requiredValidator)(properties.s3Configuration));
  errors.collect(cdk.propertyValidator("s3Configuration", CfnDeliveryStreamS3DestinationConfigurationPropertyValidator)(properties.s3Configuration));
  errors.collect(cdk.propertyValidator("username", cdk.requiredValidator)(properties.username));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"RedshiftDestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamRedshiftDestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamRedshiftDestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLoggingOptions": convertCfnDeliveryStreamCloudWatchLoggingOptionsPropertyToCloudFormation(properties.cloudWatchLoggingOptions),
    "ClusterJDBCURL": cdk.stringToCloudFormation(properties.clusterJdbcurl),
    "CopyCommand": convertCfnDeliveryStreamCopyCommandPropertyToCloudFormation(properties.copyCommand),
    "Password": cdk.stringToCloudFormation(properties.password),
    "ProcessingConfiguration": convertCfnDeliveryStreamProcessingConfigurationPropertyToCloudFormation(properties.processingConfiguration),
    "RetryOptions": convertCfnDeliveryStreamRedshiftRetryOptionsPropertyToCloudFormation(properties.retryOptions),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn),
    "S3BackupConfiguration": convertCfnDeliveryStreamS3DestinationConfigurationPropertyToCloudFormation(properties.s3BackupConfiguration),
    "S3BackupMode": cdk.stringToCloudFormation(properties.s3BackupMode),
    "S3Configuration": convertCfnDeliveryStreamS3DestinationConfigurationPropertyToCloudFormation(properties.s3Configuration),
    "Username": cdk.stringToCloudFormation(properties.username)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamRedshiftDestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.RedshiftDestinationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.RedshiftDestinationConfigurationProperty>();
  ret.addPropertyResult("cloudWatchLoggingOptions", "CloudWatchLoggingOptions", (properties.CloudWatchLoggingOptions != null ? CfnDeliveryStreamCloudWatchLoggingOptionsPropertyFromCloudFormation(properties.CloudWatchLoggingOptions) : undefined));
  ret.addPropertyResult("clusterJdbcurl", "ClusterJDBCURL", (properties.ClusterJDBCURL != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterJDBCURL) : undefined));
  ret.addPropertyResult("copyCommand", "CopyCommand", (properties.CopyCommand != null ? CfnDeliveryStreamCopyCommandPropertyFromCloudFormation(properties.CopyCommand) : undefined));
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("processingConfiguration", "ProcessingConfiguration", (properties.ProcessingConfiguration != null ? CfnDeliveryStreamProcessingConfigurationPropertyFromCloudFormation(properties.ProcessingConfiguration) : undefined));
  ret.addPropertyResult("retryOptions", "RetryOptions", (properties.RetryOptions != null ? CfnDeliveryStreamRedshiftRetryOptionsPropertyFromCloudFormation(properties.RetryOptions) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addPropertyResult("s3BackupConfiguration", "S3BackupConfiguration", (properties.S3BackupConfiguration != null ? CfnDeliveryStreamS3DestinationConfigurationPropertyFromCloudFormation(properties.S3BackupConfiguration) : undefined));
  ret.addPropertyResult("s3BackupMode", "S3BackupMode", (properties.S3BackupMode != null ? cfn_parse.FromCloudFormation.getString(properties.S3BackupMode) : undefined));
  ret.addPropertyResult("s3Configuration", "S3Configuration", (properties.S3Configuration != null ? CfnDeliveryStreamS3DestinationConfigurationPropertyFromCloudFormation(properties.S3Configuration) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DocumentIdOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `DocumentIdOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamDocumentIdOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultDocumentIdFormat", cdk.requiredValidator)(properties.defaultDocumentIdFormat));
  errors.collect(cdk.propertyValidator("defaultDocumentIdFormat", cdk.validateString)(properties.defaultDocumentIdFormat));
  return errors.wrap("supplied properties not correct for \"DocumentIdOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamDocumentIdOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamDocumentIdOptionsPropertyValidator(properties).assertSuccess();
  return {
    "DefaultDocumentIdFormat": cdk.stringToCloudFormation(properties.defaultDocumentIdFormat)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamDocumentIdOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.DocumentIdOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.DocumentIdOptionsProperty>();
  ret.addPropertyResult("defaultDocumentIdFormat", "DefaultDocumentIdFormat", (properties.DefaultDocumentIdFormat != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultDocumentIdFormat) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AmazonopensearchserviceBufferingHintsProperty`
 *
 * @param properties - the TypeScript properties of a `AmazonopensearchserviceBufferingHintsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamAmazonopensearchserviceBufferingHintsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("intervalInSeconds", cdk.validateNumber)(properties.intervalInSeconds));
  errors.collect(cdk.propertyValidator("sizeInMBs", cdk.validateNumber)(properties.sizeInMBs));
  return errors.wrap("supplied properties not correct for \"AmazonopensearchserviceBufferingHintsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamAmazonopensearchserviceBufferingHintsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamAmazonopensearchserviceBufferingHintsPropertyValidator(properties).assertSuccess();
  return {
    "IntervalInSeconds": cdk.numberToCloudFormation(properties.intervalInSeconds),
    "SizeInMBs": cdk.numberToCloudFormation(properties.sizeInMBs)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamAmazonopensearchserviceBufferingHintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.AmazonopensearchserviceBufferingHintsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.AmazonopensearchserviceBufferingHintsProperty>();
  ret.addPropertyResult("intervalInSeconds", "IntervalInSeconds", (properties.IntervalInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.IntervalInSeconds) : undefined));
  ret.addPropertyResult("sizeInMBs", "SizeInMBs", (properties.SizeInMBs != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizeInMBs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AmazonopensearchserviceRetryOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `AmazonopensearchserviceRetryOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamAmazonopensearchserviceRetryOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("durationInSeconds", cdk.validateNumber)(properties.durationInSeconds));
  return errors.wrap("supplied properties not correct for \"AmazonopensearchserviceRetryOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamAmazonopensearchserviceRetryOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamAmazonopensearchserviceRetryOptionsPropertyValidator(properties).assertSuccess();
  return {
    "DurationInSeconds": cdk.numberToCloudFormation(properties.durationInSeconds)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamAmazonopensearchserviceRetryOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.AmazonopensearchserviceRetryOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.AmazonopensearchserviceRetryOptionsProperty>();
  ret.addPropertyResult("durationInSeconds", "DurationInSeconds", (properties.DurationInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamVpcConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.requiredValidator)(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"VpcConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamVpcConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamVpcConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn),
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamVpcConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.VpcConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.VpcConfigurationProperty>();
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AmazonopensearchserviceDestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AmazonopensearchserviceDestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamAmazonopensearchserviceDestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bufferingHints", CfnDeliveryStreamAmazonopensearchserviceBufferingHintsPropertyValidator)(properties.bufferingHints));
  errors.collect(cdk.propertyValidator("cloudWatchLoggingOptions", CfnDeliveryStreamCloudWatchLoggingOptionsPropertyValidator)(properties.cloudWatchLoggingOptions));
  errors.collect(cdk.propertyValidator("clusterEndpoint", cdk.validateString)(properties.clusterEndpoint));
  errors.collect(cdk.propertyValidator("documentIdOptions", CfnDeliveryStreamDocumentIdOptionsPropertyValidator)(properties.documentIdOptions));
  errors.collect(cdk.propertyValidator("domainArn", cdk.validateString)(properties.domainArn));
  errors.collect(cdk.propertyValidator("indexName", cdk.requiredValidator)(properties.indexName));
  errors.collect(cdk.propertyValidator("indexName", cdk.validateString)(properties.indexName));
  errors.collect(cdk.propertyValidator("indexRotationPeriod", cdk.validateString)(properties.indexRotationPeriod));
  errors.collect(cdk.propertyValidator("processingConfiguration", CfnDeliveryStreamProcessingConfigurationPropertyValidator)(properties.processingConfiguration));
  errors.collect(cdk.propertyValidator("retryOptions", CfnDeliveryStreamAmazonopensearchserviceRetryOptionsPropertyValidator)(properties.retryOptions));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("s3BackupMode", cdk.validateString)(properties.s3BackupMode));
  errors.collect(cdk.propertyValidator("s3Configuration", cdk.requiredValidator)(properties.s3Configuration));
  errors.collect(cdk.propertyValidator("s3Configuration", CfnDeliveryStreamS3DestinationConfigurationPropertyValidator)(properties.s3Configuration));
  errors.collect(cdk.propertyValidator("typeName", cdk.validateString)(properties.typeName));
  errors.collect(cdk.propertyValidator("vpcConfiguration", CfnDeliveryStreamVpcConfigurationPropertyValidator)(properties.vpcConfiguration));
  return errors.wrap("supplied properties not correct for \"AmazonopensearchserviceDestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamAmazonopensearchserviceDestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamAmazonopensearchserviceDestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BufferingHints": convertCfnDeliveryStreamAmazonopensearchserviceBufferingHintsPropertyToCloudFormation(properties.bufferingHints),
    "CloudWatchLoggingOptions": convertCfnDeliveryStreamCloudWatchLoggingOptionsPropertyToCloudFormation(properties.cloudWatchLoggingOptions),
    "ClusterEndpoint": cdk.stringToCloudFormation(properties.clusterEndpoint),
    "DocumentIdOptions": convertCfnDeliveryStreamDocumentIdOptionsPropertyToCloudFormation(properties.documentIdOptions),
    "DomainARN": cdk.stringToCloudFormation(properties.domainArn),
    "IndexName": cdk.stringToCloudFormation(properties.indexName),
    "IndexRotationPeriod": cdk.stringToCloudFormation(properties.indexRotationPeriod),
    "ProcessingConfiguration": convertCfnDeliveryStreamProcessingConfigurationPropertyToCloudFormation(properties.processingConfiguration),
    "RetryOptions": convertCfnDeliveryStreamAmazonopensearchserviceRetryOptionsPropertyToCloudFormation(properties.retryOptions),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn),
    "S3BackupMode": cdk.stringToCloudFormation(properties.s3BackupMode),
    "S3Configuration": convertCfnDeliveryStreamS3DestinationConfigurationPropertyToCloudFormation(properties.s3Configuration),
    "TypeName": cdk.stringToCloudFormation(properties.typeName),
    "VpcConfiguration": convertCfnDeliveryStreamVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamAmazonopensearchserviceDestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.AmazonopensearchserviceDestinationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.AmazonopensearchserviceDestinationConfigurationProperty>();
  ret.addPropertyResult("bufferingHints", "BufferingHints", (properties.BufferingHints != null ? CfnDeliveryStreamAmazonopensearchserviceBufferingHintsPropertyFromCloudFormation(properties.BufferingHints) : undefined));
  ret.addPropertyResult("cloudWatchLoggingOptions", "CloudWatchLoggingOptions", (properties.CloudWatchLoggingOptions != null ? CfnDeliveryStreamCloudWatchLoggingOptionsPropertyFromCloudFormation(properties.CloudWatchLoggingOptions) : undefined));
  ret.addPropertyResult("clusterEndpoint", "ClusterEndpoint", (properties.ClusterEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterEndpoint) : undefined));
  ret.addPropertyResult("documentIdOptions", "DocumentIdOptions", (properties.DocumentIdOptions != null ? CfnDeliveryStreamDocumentIdOptionsPropertyFromCloudFormation(properties.DocumentIdOptions) : undefined));
  ret.addPropertyResult("domainArn", "DomainARN", (properties.DomainARN != null ? cfn_parse.FromCloudFormation.getString(properties.DomainARN) : undefined));
  ret.addPropertyResult("indexName", "IndexName", (properties.IndexName != null ? cfn_parse.FromCloudFormation.getString(properties.IndexName) : undefined));
  ret.addPropertyResult("indexRotationPeriod", "IndexRotationPeriod", (properties.IndexRotationPeriod != null ? cfn_parse.FromCloudFormation.getString(properties.IndexRotationPeriod) : undefined));
  ret.addPropertyResult("processingConfiguration", "ProcessingConfiguration", (properties.ProcessingConfiguration != null ? CfnDeliveryStreamProcessingConfigurationPropertyFromCloudFormation(properties.ProcessingConfiguration) : undefined));
  ret.addPropertyResult("retryOptions", "RetryOptions", (properties.RetryOptions != null ? CfnDeliveryStreamAmazonopensearchserviceRetryOptionsPropertyFromCloudFormation(properties.RetryOptions) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addPropertyResult("s3BackupMode", "S3BackupMode", (properties.S3BackupMode != null ? cfn_parse.FromCloudFormation.getString(properties.S3BackupMode) : undefined));
  ret.addPropertyResult("s3Configuration", "S3Configuration", (properties.S3Configuration != null ? CfnDeliveryStreamS3DestinationConfigurationPropertyFromCloudFormation(properties.S3Configuration) : undefined));
  ret.addPropertyResult("typeName", "TypeName", (properties.TypeName != null ? cfn_parse.FromCloudFormation.getString(properties.TypeName) : undefined));
  ret.addPropertyResult("vpcConfiguration", "VpcConfiguration", (properties.VpcConfiguration != null ? CfnDeliveryStreamVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthenticationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AuthenticationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamAuthenticationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectivity", cdk.requiredValidator)(properties.connectivity));
  errors.collect(cdk.propertyValidator("connectivity", cdk.validateString)(properties.connectivity));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"AuthenticationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamAuthenticationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamAuthenticationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Connectivity": cdk.stringToCloudFormation(properties.connectivity),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamAuthenticationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.AuthenticationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.AuthenticationConfigurationProperty>();
  ret.addPropertyResult("connectivity", "Connectivity", (properties.Connectivity != null ? cfn_parse.FromCloudFormation.getString(properties.Connectivity) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MSKSourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MSKSourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamMSKSourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationConfiguration", cdk.requiredValidator)(properties.authenticationConfiguration));
  errors.collect(cdk.propertyValidator("authenticationConfiguration", CfnDeliveryStreamAuthenticationConfigurationPropertyValidator)(properties.authenticationConfiguration));
  errors.collect(cdk.propertyValidator("mskClusterArn", cdk.requiredValidator)(properties.mskClusterArn));
  errors.collect(cdk.propertyValidator("mskClusterArn", cdk.validateString)(properties.mskClusterArn));
  errors.collect(cdk.propertyValidator("topicName", cdk.requiredValidator)(properties.topicName));
  errors.collect(cdk.propertyValidator("topicName", cdk.validateString)(properties.topicName));
  return errors.wrap("supplied properties not correct for \"MSKSourceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamMSKSourceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamMSKSourceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AuthenticationConfiguration": convertCfnDeliveryStreamAuthenticationConfigurationPropertyToCloudFormation(properties.authenticationConfiguration),
    "MSKClusterARN": cdk.stringToCloudFormation(properties.mskClusterArn),
    "TopicName": cdk.stringToCloudFormation(properties.topicName)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamMSKSourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.MSKSourceConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.MSKSourceConfigurationProperty>();
  ret.addPropertyResult("authenticationConfiguration", "AuthenticationConfiguration", (properties.AuthenticationConfiguration != null ? CfnDeliveryStreamAuthenticationConfigurationPropertyFromCloudFormation(properties.AuthenticationConfiguration) : undefined));
  ret.addPropertyResult("mskClusterArn", "MSKClusterARN", (properties.MSKClusterARN != null ? cfn_parse.FromCloudFormation.getString(properties.MSKClusterARN) : undefined));
  ret.addPropertyResult("topicName", "TopicName", (properties.TopicName != null ? cfn_parse.FromCloudFormation.getString(properties.TopicName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SplunkRetryOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `SplunkRetryOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamSplunkRetryOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("durationInSeconds", cdk.validateNumber)(properties.durationInSeconds));
  return errors.wrap("supplied properties not correct for \"SplunkRetryOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamSplunkRetryOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamSplunkRetryOptionsPropertyValidator(properties).assertSuccess();
  return {
    "DurationInSeconds": cdk.numberToCloudFormation(properties.durationInSeconds)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamSplunkRetryOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.SplunkRetryOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.SplunkRetryOptionsProperty>();
  ret.addPropertyResult("durationInSeconds", "DurationInSeconds", (properties.DurationInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SplunkBufferingHintsProperty`
 *
 * @param properties - the TypeScript properties of a `SplunkBufferingHintsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamSplunkBufferingHintsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("intervalInSeconds", cdk.validateNumber)(properties.intervalInSeconds));
  errors.collect(cdk.propertyValidator("sizeInMBs", cdk.validateNumber)(properties.sizeInMBs));
  return errors.wrap("supplied properties not correct for \"SplunkBufferingHintsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamSplunkBufferingHintsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamSplunkBufferingHintsPropertyValidator(properties).assertSuccess();
  return {
    "IntervalInSeconds": cdk.numberToCloudFormation(properties.intervalInSeconds),
    "SizeInMBs": cdk.numberToCloudFormation(properties.sizeInMBs)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamSplunkBufferingHintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.SplunkBufferingHintsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.SplunkBufferingHintsProperty>();
  ret.addPropertyResult("intervalInSeconds", "IntervalInSeconds", (properties.IntervalInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.IntervalInSeconds) : undefined));
  ret.addPropertyResult("sizeInMBs", "SizeInMBs", (properties.SizeInMBs != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizeInMBs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SplunkDestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SplunkDestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamSplunkDestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bufferingHints", CfnDeliveryStreamSplunkBufferingHintsPropertyValidator)(properties.bufferingHints));
  errors.collect(cdk.propertyValidator("cloudWatchLoggingOptions", CfnDeliveryStreamCloudWatchLoggingOptionsPropertyValidator)(properties.cloudWatchLoggingOptions));
  errors.collect(cdk.propertyValidator("hecAcknowledgmentTimeoutInSeconds", cdk.validateNumber)(properties.hecAcknowledgmentTimeoutInSeconds));
  errors.collect(cdk.propertyValidator("hecEndpoint", cdk.requiredValidator)(properties.hecEndpoint));
  errors.collect(cdk.propertyValidator("hecEndpoint", cdk.validateString)(properties.hecEndpoint));
  errors.collect(cdk.propertyValidator("hecEndpointType", cdk.requiredValidator)(properties.hecEndpointType));
  errors.collect(cdk.propertyValidator("hecEndpointType", cdk.validateString)(properties.hecEndpointType));
  errors.collect(cdk.propertyValidator("hecToken", cdk.requiredValidator)(properties.hecToken));
  errors.collect(cdk.propertyValidator("hecToken", cdk.validateString)(properties.hecToken));
  errors.collect(cdk.propertyValidator("processingConfiguration", CfnDeliveryStreamProcessingConfigurationPropertyValidator)(properties.processingConfiguration));
  errors.collect(cdk.propertyValidator("retryOptions", CfnDeliveryStreamSplunkRetryOptionsPropertyValidator)(properties.retryOptions));
  errors.collect(cdk.propertyValidator("s3BackupMode", cdk.validateString)(properties.s3BackupMode));
  errors.collect(cdk.propertyValidator("s3Configuration", cdk.requiredValidator)(properties.s3Configuration));
  errors.collect(cdk.propertyValidator("s3Configuration", CfnDeliveryStreamS3DestinationConfigurationPropertyValidator)(properties.s3Configuration));
  return errors.wrap("supplied properties not correct for \"SplunkDestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamSplunkDestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamSplunkDestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BufferingHints": convertCfnDeliveryStreamSplunkBufferingHintsPropertyToCloudFormation(properties.bufferingHints),
    "CloudWatchLoggingOptions": convertCfnDeliveryStreamCloudWatchLoggingOptionsPropertyToCloudFormation(properties.cloudWatchLoggingOptions),
    "HECAcknowledgmentTimeoutInSeconds": cdk.numberToCloudFormation(properties.hecAcknowledgmentTimeoutInSeconds),
    "HECEndpoint": cdk.stringToCloudFormation(properties.hecEndpoint),
    "HECEndpointType": cdk.stringToCloudFormation(properties.hecEndpointType),
    "HECToken": cdk.stringToCloudFormation(properties.hecToken),
    "ProcessingConfiguration": convertCfnDeliveryStreamProcessingConfigurationPropertyToCloudFormation(properties.processingConfiguration),
    "RetryOptions": convertCfnDeliveryStreamSplunkRetryOptionsPropertyToCloudFormation(properties.retryOptions),
    "S3BackupMode": cdk.stringToCloudFormation(properties.s3BackupMode),
    "S3Configuration": convertCfnDeliveryStreamS3DestinationConfigurationPropertyToCloudFormation(properties.s3Configuration)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamSplunkDestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.SplunkDestinationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.SplunkDestinationConfigurationProperty>();
  ret.addPropertyResult("bufferingHints", "BufferingHints", (properties.BufferingHints != null ? CfnDeliveryStreamSplunkBufferingHintsPropertyFromCloudFormation(properties.BufferingHints) : undefined));
  ret.addPropertyResult("cloudWatchLoggingOptions", "CloudWatchLoggingOptions", (properties.CloudWatchLoggingOptions != null ? CfnDeliveryStreamCloudWatchLoggingOptionsPropertyFromCloudFormation(properties.CloudWatchLoggingOptions) : undefined));
  ret.addPropertyResult("hecAcknowledgmentTimeoutInSeconds", "HECAcknowledgmentTimeoutInSeconds", (properties.HECAcknowledgmentTimeoutInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.HECAcknowledgmentTimeoutInSeconds) : undefined));
  ret.addPropertyResult("hecEndpoint", "HECEndpoint", (properties.HECEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.HECEndpoint) : undefined));
  ret.addPropertyResult("hecEndpointType", "HECEndpointType", (properties.HECEndpointType != null ? cfn_parse.FromCloudFormation.getString(properties.HECEndpointType) : undefined));
  ret.addPropertyResult("hecToken", "HECToken", (properties.HECToken != null ? cfn_parse.FromCloudFormation.getString(properties.HECToken) : undefined));
  ret.addPropertyResult("processingConfiguration", "ProcessingConfiguration", (properties.ProcessingConfiguration != null ? CfnDeliveryStreamProcessingConfigurationPropertyFromCloudFormation(properties.ProcessingConfiguration) : undefined));
  ret.addPropertyResult("retryOptions", "RetryOptions", (properties.RetryOptions != null ? CfnDeliveryStreamSplunkRetryOptionsPropertyFromCloudFormation(properties.RetryOptions) : undefined));
  ret.addPropertyResult("s3BackupMode", "S3BackupMode", (properties.S3BackupMode != null ? cfn_parse.FromCloudFormation.getString(properties.S3BackupMode) : undefined));
  ret.addPropertyResult("s3Configuration", "S3Configuration", (properties.S3Configuration != null ? CfnDeliveryStreamS3DestinationConfigurationPropertyFromCloudFormation(properties.S3Configuration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HiveJsonSerDeProperty`
 *
 * @param properties - the TypeScript properties of a `HiveJsonSerDeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamHiveJsonSerDePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("timestampFormats", cdk.listValidator(cdk.validateString))(properties.timestampFormats));
  return errors.wrap("supplied properties not correct for \"HiveJsonSerDeProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamHiveJsonSerDePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamHiveJsonSerDePropertyValidator(properties).assertSuccess();
  return {
    "TimestampFormats": cdk.listMapper(cdk.stringToCloudFormation)(properties.timestampFormats)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamHiveJsonSerDePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.HiveJsonSerDeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.HiveJsonSerDeProperty>();
  ret.addPropertyResult("timestampFormats", "TimestampFormats", (properties.TimestampFormats != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.TimestampFormats) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OpenXJsonSerDeProperty`
 *
 * @param properties - the TypeScript properties of a `OpenXJsonSerDeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamOpenXJsonSerDePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("caseInsensitive", cdk.validateBoolean)(properties.caseInsensitive));
  errors.collect(cdk.propertyValidator("columnToJsonKeyMappings", cdk.hashValidator(cdk.validateString))(properties.columnToJsonKeyMappings));
  errors.collect(cdk.propertyValidator("convertDotsInJsonKeysToUnderscores", cdk.validateBoolean)(properties.convertDotsInJsonKeysToUnderscores));
  return errors.wrap("supplied properties not correct for \"OpenXJsonSerDeProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamOpenXJsonSerDePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamOpenXJsonSerDePropertyValidator(properties).assertSuccess();
  return {
    "CaseInsensitive": cdk.booleanToCloudFormation(properties.caseInsensitive),
    "ColumnToJsonKeyMappings": cdk.hashMapper(cdk.stringToCloudFormation)(properties.columnToJsonKeyMappings),
    "ConvertDotsInJsonKeysToUnderscores": cdk.booleanToCloudFormation(properties.convertDotsInJsonKeysToUnderscores)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamOpenXJsonSerDePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.OpenXJsonSerDeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.OpenXJsonSerDeProperty>();
  ret.addPropertyResult("caseInsensitive", "CaseInsensitive", (properties.CaseInsensitive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CaseInsensitive) : undefined));
  ret.addPropertyResult("columnToJsonKeyMappings", "ColumnToJsonKeyMappings", (properties.ColumnToJsonKeyMappings != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.ColumnToJsonKeyMappings) : undefined));
  ret.addPropertyResult("convertDotsInJsonKeysToUnderscores", "ConvertDotsInJsonKeysToUnderscores", (properties.ConvertDotsInJsonKeysToUnderscores != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ConvertDotsInJsonKeysToUnderscores) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeserializerProperty`
 *
 * @param properties - the TypeScript properties of a `DeserializerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamDeserializerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("hiveJsonSerDe", CfnDeliveryStreamHiveJsonSerDePropertyValidator)(properties.hiveJsonSerDe));
  errors.collect(cdk.propertyValidator("openXJsonSerDe", CfnDeliveryStreamOpenXJsonSerDePropertyValidator)(properties.openXJsonSerDe));
  return errors.wrap("supplied properties not correct for \"DeserializerProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamDeserializerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamDeserializerPropertyValidator(properties).assertSuccess();
  return {
    "HiveJsonSerDe": convertCfnDeliveryStreamHiveJsonSerDePropertyToCloudFormation(properties.hiveJsonSerDe),
    "OpenXJsonSerDe": convertCfnDeliveryStreamOpenXJsonSerDePropertyToCloudFormation(properties.openXJsonSerDe)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamDeserializerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.DeserializerProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.DeserializerProperty>();
  ret.addPropertyResult("hiveJsonSerDe", "HiveJsonSerDe", (properties.HiveJsonSerDe != null ? CfnDeliveryStreamHiveJsonSerDePropertyFromCloudFormation(properties.HiveJsonSerDe) : undefined));
  ret.addPropertyResult("openXJsonSerDe", "OpenXJsonSerDe", (properties.OpenXJsonSerDe != null ? CfnDeliveryStreamOpenXJsonSerDePropertyFromCloudFormation(properties.OpenXJsonSerDe) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InputFormatConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `InputFormatConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamInputFormatConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deserializer", CfnDeliveryStreamDeserializerPropertyValidator)(properties.deserializer));
  return errors.wrap("supplied properties not correct for \"InputFormatConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamInputFormatConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamInputFormatConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Deserializer": convertCfnDeliveryStreamDeserializerPropertyToCloudFormation(properties.deserializer)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamInputFormatConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.InputFormatConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.InputFormatConfigurationProperty>();
  ret.addPropertyResult("deserializer", "Deserializer", (properties.Deserializer != null ? CfnDeliveryStreamDeserializerPropertyFromCloudFormation(properties.Deserializer) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SchemaConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamSchemaConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("catalogId", cdk.validateString)(properties.catalogId));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  errors.collect(cdk.propertyValidator("versionId", cdk.validateString)(properties.versionId));
  return errors.wrap("supplied properties not correct for \"SchemaConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamSchemaConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamSchemaConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CatalogId": cdk.stringToCloudFormation(properties.catalogId),
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "Region": cdk.stringToCloudFormation(properties.region),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn),
    "TableName": cdk.stringToCloudFormation(properties.tableName),
    "VersionId": cdk.stringToCloudFormation(properties.versionId)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamSchemaConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.SchemaConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.SchemaConfigurationProperty>();
  ret.addPropertyResult("catalogId", "CatalogId", (properties.CatalogId != null ? cfn_parse.FromCloudFormation.getString(properties.CatalogId) : undefined));
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addPropertyResult("versionId", "VersionId", (properties.VersionId != null ? cfn_parse.FromCloudFormation.getString(properties.VersionId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OrcSerDeProperty`
 *
 * @param properties - the TypeScript properties of a `OrcSerDeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamOrcSerDePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("blockSizeBytes", cdk.validateNumber)(properties.blockSizeBytes));
  errors.collect(cdk.propertyValidator("bloomFilterColumns", cdk.listValidator(cdk.validateString))(properties.bloomFilterColumns));
  errors.collect(cdk.propertyValidator("bloomFilterFalsePositiveProbability", cdk.validateNumber)(properties.bloomFilterFalsePositiveProbability));
  errors.collect(cdk.propertyValidator("compression", cdk.validateString)(properties.compression));
  errors.collect(cdk.propertyValidator("dictionaryKeyThreshold", cdk.validateNumber)(properties.dictionaryKeyThreshold));
  errors.collect(cdk.propertyValidator("enablePadding", cdk.validateBoolean)(properties.enablePadding));
  errors.collect(cdk.propertyValidator("formatVersion", cdk.validateString)(properties.formatVersion));
  errors.collect(cdk.propertyValidator("paddingTolerance", cdk.validateNumber)(properties.paddingTolerance));
  errors.collect(cdk.propertyValidator("rowIndexStride", cdk.validateNumber)(properties.rowIndexStride));
  errors.collect(cdk.propertyValidator("stripeSizeBytes", cdk.validateNumber)(properties.stripeSizeBytes));
  return errors.wrap("supplied properties not correct for \"OrcSerDeProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamOrcSerDePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamOrcSerDePropertyValidator(properties).assertSuccess();
  return {
    "BlockSizeBytes": cdk.numberToCloudFormation(properties.blockSizeBytes),
    "BloomFilterColumns": cdk.listMapper(cdk.stringToCloudFormation)(properties.bloomFilterColumns),
    "BloomFilterFalsePositiveProbability": cdk.numberToCloudFormation(properties.bloomFilterFalsePositiveProbability),
    "Compression": cdk.stringToCloudFormation(properties.compression),
    "DictionaryKeyThreshold": cdk.numberToCloudFormation(properties.dictionaryKeyThreshold),
    "EnablePadding": cdk.booleanToCloudFormation(properties.enablePadding),
    "FormatVersion": cdk.stringToCloudFormation(properties.formatVersion),
    "PaddingTolerance": cdk.numberToCloudFormation(properties.paddingTolerance),
    "RowIndexStride": cdk.numberToCloudFormation(properties.rowIndexStride),
    "StripeSizeBytes": cdk.numberToCloudFormation(properties.stripeSizeBytes)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamOrcSerDePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.OrcSerDeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.OrcSerDeProperty>();
  ret.addPropertyResult("blockSizeBytes", "BlockSizeBytes", (properties.BlockSizeBytes != null ? cfn_parse.FromCloudFormation.getNumber(properties.BlockSizeBytes) : undefined));
  ret.addPropertyResult("bloomFilterColumns", "BloomFilterColumns", (properties.BloomFilterColumns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.BloomFilterColumns) : undefined));
  ret.addPropertyResult("bloomFilterFalsePositiveProbability", "BloomFilterFalsePositiveProbability", (properties.BloomFilterFalsePositiveProbability != null ? cfn_parse.FromCloudFormation.getNumber(properties.BloomFilterFalsePositiveProbability) : undefined));
  ret.addPropertyResult("compression", "Compression", (properties.Compression != null ? cfn_parse.FromCloudFormation.getString(properties.Compression) : undefined));
  ret.addPropertyResult("dictionaryKeyThreshold", "DictionaryKeyThreshold", (properties.DictionaryKeyThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.DictionaryKeyThreshold) : undefined));
  ret.addPropertyResult("enablePadding", "EnablePadding", (properties.EnablePadding != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnablePadding) : undefined));
  ret.addPropertyResult("formatVersion", "FormatVersion", (properties.FormatVersion != null ? cfn_parse.FromCloudFormation.getString(properties.FormatVersion) : undefined));
  ret.addPropertyResult("paddingTolerance", "PaddingTolerance", (properties.PaddingTolerance != null ? cfn_parse.FromCloudFormation.getNumber(properties.PaddingTolerance) : undefined));
  ret.addPropertyResult("rowIndexStride", "RowIndexStride", (properties.RowIndexStride != null ? cfn_parse.FromCloudFormation.getNumber(properties.RowIndexStride) : undefined));
  ret.addPropertyResult("stripeSizeBytes", "StripeSizeBytes", (properties.StripeSizeBytes != null ? cfn_parse.FromCloudFormation.getNumber(properties.StripeSizeBytes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ParquetSerDeProperty`
 *
 * @param properties - the TypeScript properties of a `ParquetSerDeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamParquetSerDePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("blockSizeBytes", cdk.validateNumber)(properties.blockSizeBytes));
  errors.collect(cdk.propertyValidator("compression", cdk.validateString)(properties.compression));
  errors.collect(cdk.propertyValidator("enableDictionaryCompression", cdk.validateBoolean)(properties.enableDictionaryCompression));
  errors.collect(cdk.propertyValidator("maxPaddingBytes", cdk.validateNumber)(properties.maxPaddingBytes));
  errors.collect(cdk.propertyValidator("pageSizeBytes", cdk.validateNumber)(properties.pageSizeBytes));
  errors.collect(cdk.propertyValidator("writerVersion", cdk.validateString)(properties.writerVersion));
  return errors.wrap("supplied properties not correct for \"ParquetSerDeProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamParquetSerDePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamParquetSerDePropertyValidator(properties).assertSuccess();
  return {
    "BlockSizeBytes": cdk.numberToCloudFormation(properties.blockSizeBytes),
    "Compression": cdk.stringToCloudFormation(properties.compression),
    "EnableDictionaryCompression": cdk.booleanToCloudFormation(properties.enableDictionaryCompression),
    "MaxPaddingBytes": cdk.numberToCloudFormation(properties.maxPaddingBytes),
    "PageSizeBytes": cdk.numberToCloudFormation(properties.pageSizeBytes),
    "WriterVersion": cdk.stringToCloudFormation(properties.writerVersion)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamParquetSerDePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.ParquetSerDeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.ParquetSerDeProperty>();
  ret.addPropertyResult("blockSizeBytes", "BlockSizeBytes", (properties.BlockSizeBytes != null ? cfn_parse.FromCloudFormation.getNumber(properties.BlockSizeBytes) : undefined));
  ret.addPropertyResult("compression", "Compression", (properties.Compression != null ? cfn_parse.FromCloudFormation.getString(properties.Compression) : undefined));
  ret.addPropertyResult("enableDictionaryCompression", "EnableDictionaryCompression", (properties.EnableDictionaryCompression != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableDictionaryCompression) : undefined));
  ret.addPropertyResult("maxPaddingBytes", "MaxPaddingBytes", (properties.MaxPaddingBytes != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxPaddingBytes) : undefined));
  ret.addPropertyResult("pageSizeBytes", "PageSizeBytes", (properties.PageSizeBytes != null ? cfn_parse.FromCloudFormation.getNumber(properties.PageSizeBytes) : undefined));
  ret.addPropertyResult("writerVersion", "WriterVersion", (properties.WriterVersion != null ? cfn_parse.FromCloudFormation.getString(properties.WriterVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SerializerProperty`
 *
 * @param properties - the TypeScript properties of a `SerializerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamSerializerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("orcSerDe", CfnDeliveryStreamOrcSerDePropertyValidator)(properties.orcSerDe));
  errors.collect(cdk.propertyValidator("parquetSerDe", CfnDeliveryStreamParquetSerDePropertyValidator)(properties.parquetSerDe));
  return errors.wrap("supplied properties not correct for \"SerializerProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamSerializerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamSerializerPropertyValidator(properties).assertSuccess();
  return {
    "OrcSerDe": convertCfnDeliveryStreamOrcSerDePropertyToCloudFormation(properties.orcSerDe),
    "ParquetSerDe": convertCfnDeliveryStreamParquetSerDePropertyToCloudFormation(properties.parquetSerDe)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamSerializerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.SerializerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.SerializerProperty>();
  ret.addPropertyResult("orcSerDe", "OrcSerDe", (properties.OrcSerDe != null ? CfnDeliveryStreamOrcSerDePropertyFromCloudFormation(properties.OrcSerDe) : undefined));
  ret.addPropertyResult("parquetSerDe", "ParquetSerDe", (properties.ParquetSerDe != null ? CfnDeliveryStreamParquetSerDePropertyFromCloudFormation(properties.ParquetSerDe) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OutputFormatConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `OutputFormatConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamOutputFormatConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("serializer", CfnDeliveryStreamSerializerPropertyValidator)(properties.serializer));
  return errors.wrap("supplied properties not correct for \"OutputFormatConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamOutputFormatConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamOutputFormatConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Serializer": convertCfnDeliveryStreamSerializerPropertyToCloudFormation(properties.serializer)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamOutputFormatConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDeliveryStream.OutputFormatConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.OutputFormatConfigurationProperty>();
  ret.addPropertyResult("serializer", "Serializer", (properties.Serializer != null ? CfnDeliveryStreamSerializerPropertyFromCloudFormation(properties.Serializer) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DataFormatConversionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DataFormatConversionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamDataFormatConversionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("inputFormatConfiguration", CfnDeliveryStreamInputFormatConfigurationPropertyValidator)(properties.inputFormatConfiguration));
  errors.collect(cdk.propertyValidator("outputFormatConfiguration", CfnDeliveryStreamOutputFormatConfigurationPropertyValidator)(properties.outputFormatConfiguration));
  errors.collect(cdk.propertyValidator("schemaConfiguration", CfnDeliveryStreamSchemaConfigurationPropertyValidator)(properties.schemaConfiguration));
  return errors.wrap("supplied properties not correct for \"DataFormatConversionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamDataFormatConversionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamDataFormatConversionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "InputFormatConfiguration": convertCfnDeliveryStreamInputFormatConfigurationPropertyToCloudFormation(properties.inputFormatConfiguration),
    "OutputFormatConfiguration": convertCfnDeliveryStreamOutputFormatConfigurationPropertyToCloudFormation(properties.outputFormatConfiguration),
    "SchemaConfiguration": convertCfnDeliveryStreamSchemaConfigurationPropertyToCloudFormation(properties.schemaConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamDataFormatConversionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.DataFormatConversionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.DataFormatConversionConfigurationProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("inputFormatConfiguration", "InputFormatConfiguration", (properties.InputFormatConfiguration != null ? CfnDeliveryStreamInputFormatConfigurationPropertyFromCloudFormation(properties.InputFormatConfiguration) : undefined));
  ret.addPropertyResult("outputFormatConfiguration", "OutputFormatConfiguration", (properties.OutputFormatConfiguration != null ? CfnDeliveryStreamOutputFormatConfigurationPropertyFromCloudFormation(properties.OutputFormatConfiguration) : undefined));
  ret.addPropertyResult("schemaConfiguration", "SchemaConfiguration", (properties.SchemaConfiguration != null ? CfnDeliveryStreamSchemaConfigurationPropertyFromCloudFormation(properties.SchemaConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynamicPartitioningConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DynamicPartitioningConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamDynamicPartitioningConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("retryOptions", CfnDeliveryStreamRetryOptionsPropertyValidator)(properties.retryOptions));
  return errors.wrap("supplied properties not correct for \"DynamicPartitioningConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamDynamicPartitioningConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamDynamicPartitioningConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "RetryOptions": convertCfnDeliveryStreamRetryOptionsPropertyToCloudFormation(properties.retryOptions)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamDynamicPartitioningConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.DynamicPartitioningConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.DynamicPartitioningConfigurationProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("retryOptions", "RetryOptions", (properties.RetryOptions != null ? CfnDeliveryStreamRetryOptionsPropertyFromCloudFormation(properties.RetryOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ExtendedS3DestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ExtendedS3DestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamExtendedS3DestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketArn", cdk.requiredValidator)(properties.bucketArn));
  errors.collect(cdk.propertyValidator("bucketArn", cdk.validateString)(properties.bucketArn));
  errors.collect(cdk.propertyValidator("bufferingHints", CfnDeliveryStreamBufferingHintsPropertyValidator)(properties.bufferingHints));
  errors.collect(cdk.propertyValidator("cloudWatchLoggingOptions", CfnDeliveryStreamCloudWatchLoggingOptionsPropertyValidator)(properties.cloudWatchLoggingOptions));
  errors.collect(cdk.propertyValidator("compressionFormat", cdk.validateString)(properties.compressionFormat));
  errors.collect(cdk.propertyValidator("dataFormatConversionConfiguration", CfnDeliveryStreamDataFormatConversionConfigurationPropertyValidator)(properties.dataFormatConversionConfiguration));
  errors.collect(cdk.propertyValidator("dynamicPartitioningConfiguration", CfnDeliveryStreamDynamicPartitioningConfigurationPropertyValidator)(properties.dynamicPartitioningConfiguration));
  errors.collect(cdk.propertyValidator("encryptionConfiguration", CfnDeliveryStreamEncryptionConfigurationPropertyValidator)(properties.encryptionConfiguration));
  errors.collect(cdk.propertyValidator("errorOutputPrefix", cdk.validateString)(properties.errorOutputPrefix));
  errors.collect(cdk.propertyValidator("prefix", cdk.validateString)(properties.prefix));
  errors.collect(cdk.propertyValidator("processingConfiguration", CfnDeliveryStreamProcessingConfigurationPropertyValidator)(properties.processingConfiguration));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("s3BackupConfiguration", CfnDeliveryStreamS3DestinationConfigurationPropertyValidator)(properties.s3BackupConfiguration));
  errors.collect(cdk.propertyValidator("s3BackupMode", cdk.validateString)(properties.s3BackupMode));
  return errors.wrap("supplied properties not correct for \"ExtendedS3DestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamExtendedS3DestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamExtendedS3DestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BucketARN": cdk.stringToCloudFormation(properties.bucketArn),
    "BufferingHints": convertCfnDeliveryStreamBufferingHintsPropertyToCloudFormation(properties.bufferingHints),
    "CloudWatchLoggingOptions": convertCfnDeliveryStreamCloudWatchLoggingOptionsPropertyToCloudFormation(properties.cloudWatchLoggingOptions),
    "CompressionFormat": cdk.stringToCloudFormation(properties.compressionFormat),
    "DataFormatConversionConfiguration": convertCfnDeliveryStreamDataFormatConversionConfigurationPropertyToCloudFormation(properties.dataFormatConversionConfiguration),
    "DynamicPartitioningConfiguration": convertCfnDeliveryStreamDynamicPartitioningConfigurationPropertyToCloudFormation(properties.dynamicPartitioningConfiguration),
    "EncryptionConfiguration": convertCfnDeliveryStreamEncryptionConfigurationPropertyToCloudFormation(properties.encryptionConfiguration),
    "ErrorOutputPrefix": cdk.stringToCloudFormation(properties.errorOutputPrefix),
    "Prefix": cdk.stringToCloudFormation(properties.prefix),
    "ProcessingConfiguration": convertCfnDeliveryStreamProcessingConfigurationPropertyToCloudFormation(properties.processingConfiguration),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn),
    "S3BackupConfiguration": convertCfnDeliveryStreamS3DestinationConfigurationPropertyToCloudFormation(properties.s3BackupConfiguration),
    "S3BackupMode": cdk.stringToCloudFormation(properties.s3BackupMode)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamExtendedS3DestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.ExtendedS3DestinationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.ExtendedS3DestinationConfigurationProperty>();
  ret.addPropertyResult("bucketArn", "BucketARN", (properties.BucketARN != null ? cfn_parse.FromCloudFormation.getString(properties.BucketARN) : undefined));
  ret.addPropertyResult("bufferingHints", "BufferingHints", (properties.BufferingHints != null ? CfnDeliveryStreamBufferingHintsPropertyFromCloudFormation(properties.BufferingHints) : undefined));
  ret.addPropertyResult("cloudWatchLoggingOptions", "CloudWatchLoggingOptions", (properties.CloudWatchLoggingOptions != null ? CfnDeliveryStreamCloudWatchLoggingOptionsPropertyFromCloudFormation(properties.CloudWatchLoggingOptions) : undefined));
  ret.addPropertyResult("compressionFormat", "CompressionFormat", (properties.CompressionFormat != null ? cfn_parse.FromCloudFormation.getString(properties.CompressionFormat) : undefined));
  ret.addPropertyResult("dataFormatConversionConfiguration", "DataFormatConversionConfiguration", (properties.DataFormatConversionConfiguration != null ? CfnDeliveryStreamDataFormatConversionConfigurationPropertyFromCloudFormation(properties.DataFormatConversionConfiguration) : undefined));
  ret.addPropertyResult("dynamicPartitioningConfiguration", "DynamicPartitioningConfiguration", (properties.DynamicPartitioningConfiguration != null ? CfnDeliveryStreamDynamicPartitioningConfigurationPropertyFromCloudFormation(properties.DynamicPartitioningConfiguration) : undefined));
  ret.addPropertyResult("encryptionConfiguration", "EncryptionConfiguration", (properties.EncryptionConfiguration != null ? CfnDeliveryStreamEncryptionConfigurationPropertyFromCloudFormation(properties.EncryptionConfiguration) : undefined));
  ret.addPropertyResult("errorOutputPrefix", "ErrorOutputPrefix", (properties.ErrorOutputPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ErrorOutputPrefix) : undefined));
  ret.addPropertyResult("prefix", "Prefix", (properties.Prefix != null ? cfn_parse.FromCloudFormation.getString(properties.Prefix) : undefined));
  ret.addPropertyResult("processingConfiguration", "ProcessingConfiguration", (properties.ProcessingConfiguration != null ? CfnDeliveryStreamProcessingConfigurationPropertyFromCloudFormation(properties.ProcessingConfiguration) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addPropertyResult("s3BackupConfiguration", "S3BackupConfiguration", (properties.S3BackupConfiguration != null ? CfnDeliveryStreamS3DestinationConfigurationPropertyFromCloudFormation(properties.S3BackupConfiguration) : undefined));
  ret.addPropertyResult("s3BackupMode", "S3BackupMode", (properties.S3BackupMode != null ? cfn_parse.FromCloudFormation.getString(properties.S3BackupMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AmazonOpenSearchServerlessBufferingHintsProperty`
 *
 * @param properties - the TypeScript properties of a `AmazonOpenSearchServerlessBufferingHintsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamAmazonOpenSearchServerlessBufferingHintsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("intervalInSeconds", cdk.validateNumber)(properties.intervalInSeconds));
  errors.collect(cdk.propertyValidator("sizeInMBs", cdk.validateNumber)(properties.sizeInMBs));
  return errors.wrap("supplied properties not correct for \"AmazonOpenSearchServerlessBufferingHintsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamAmazonOpenSearchServerlessBufferingHintsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamAmazonOpenSearchServerlessBufferingHintsPropertyValidator(properties).assertSuccess();
  return {
    "IntervalInSeconds": cdk.numberToCloudFormation(properties.intervalInSeconds),
    "SizeInMBs": cdk.numberToCloudFormation(properties.sizeInMBs)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamAmazonOpenSearchServerlessBufferingHintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.AmazonOpenSearchServerlessBufferingHintsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.AmazonOpenSearchServerlessBufferingHintsProperty>();
  ret.addPropertyResult("intervalInSeconds", "IntervalInSeconds", (properties.IntervalInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.IntervalInSeconds) : undefined));
  ret.addPropertyResult("sizeInMBs", "SizeInMBs", (properties.SizeInMBs != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizeInMBs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AmazonOpenSearchServerlessRetryOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `AmazonOpenSearchServerlessRetryOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamAmazonOpenSearchServerlessRetryOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("durationInSeconds", cdk.validateNumber)(properties.durationInSeconds));
  return errors.wrap("supplied properties not correct for \"AmazonOpenSearchServerlessRetryOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamAmazonOpenSearchServerlessRetryOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamAmazonOpenSearchServerlessRetryOptionsPropertyValidator(properties).assertSuccess();
  return {
    "DurationInSeconds": cdk.numberToCloudFormation(properties.durationInSeconds)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamAmazonOpenSearchServerlessRetryOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.AmazonOpenSearchServerlessRetryOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.AmazonOpenSearchServerlessRetryOptionsProperty>();
  ret.addPropertyResult("durationInSeconds", "DurationInSeconds", (properties.DurationInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AmazonOpenSearchServerlessDestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AmazonOpenSearchServerlessDestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamAmazonOpenSearchServerlessDestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bufferingHints", CfnDeliveryStreamAmazonOpenSearchServerlessBufferingHintsPropertyValidator)(properties.bufferingHints));
  errors.collect(cdk.propertyValidator("cloudWatchLoggingOptions", CfnDeliveryStreamCloudWatchLoggingOptionsPropertyValidator)(properties.cloudWatchLoggingOptions));
  errors.collect(cdk.propertyValidator("collectionEndpoint", cdk.validateString)(properties.collectionEndpoint));
  errors.collect(cdk.propertyValidator("indexName", cdk.requiredValidator)(properties.indexName));
  errors.collect(cdk.propertyValidator("indexName", cdk.validateString)(properties.indexName));
  errors.collect(cdk.propertyValidator("processingConfiguration", CfnDeliveryStreamProcessingConfigurationPropertyValidator)(properties.processingConfiguration));
  errors.collect(cdk.propertyValidator("retryOptions", CfnDeliveryStreamAmazonOpenSearchServerlessRetryOptionsPropertyValidator)(properties.retryOptions));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("s3BackupMode", cdk.validateString)(properties.s3BackupMode));
  errors.collect(cdk.propertyValidator("s3Configuration", cdk.requiredValidator)(properties.s3Configuration));
  errors.collect(cdk.propertyValidator("s3Configuration", CfnDeliveryStreamS3DestinationConfigurationPropertyValidator)(properties.s3Configuration));
  errors.collect(cdk.propertyValidator("vpcConfiguration", CfnDeliveryStreamVpcConfigurationPropertyValidator)(properties.vpcConfiguration));
  return errors.wrap("supplied properties not correct for \"AmazonOpenSearchServerlessDestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamAmazonOpenSearchServerlessDestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamAmazonOpenSearchServerlessDestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BufferingHints": convertCfnDeliveryStreamAmazonOpenSearchServerlessBufferingHintsPropertyToCloudFormation(properties.bufferingHints),
    "CloudWatchLoggingOptions": convertCfnDeliveryStreamCloudWatchLoggingOptionsPropertyToCloudFormation(properties.cloudWatchLoggingOptions),
    "CollectionEndpoint": cdk.stringToCloudFormation(properties.collectionEndpoint),
    "IndexName": cdk.stringToCloudFormation(properties.indexName),
    "ProcessingConfiguration": convertCfnDeliveryStreamProcessingConfigurationPropertyToCloudFormation(properties.processingConfiguration),
    "RetryOptions": convertCfnDeliveryStreamAmazonOpenSearchServerlessRetryOptionsPropertyToCloudFormation(properties.retryOptions),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn),
    "S3BackupMode": cdk.stringToCloudFormation(properties.s3BackupMode),
    "S3Configuration": convertCfnDeliveryStreamS3DestinationConfigurationPropertyToCloudFormation(properties.s3Configuration),
    "VpcConfiguration": convertCfnDeliveryStreamVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamAmazonOpenSearchServerlessDestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.AmazonOpenSearchServerlessDestinationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.AmazonOpenSearchServerlessDestinationConfigurationProperty>();
  ret.addPropertyResult("bufferingHints", "BufferingHints", (properties.BufferingHints != null ? CfnDeliveryStreamAmazonOpenSearchServerlessBufferingHintsPropertyFromCloudFormation(properties.BufferingHints) : undefined));
  ret.addPropertyResult("cloudWatchLoggingOptions", "CloudWatchLoggingOptions", (properties.CloudWatchLoggingOptions != null ? CfnDeliveryStreamCloudWatchLoggingOptionsPropertyFromCloudFormation(properties.CloudWatchLoggingOptions) : undefined));
  ret.addPropertyResult("collectionEndpoint", "CollectionEndpoint", (properties.CollectionEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.CollectionEndpoint) : undefined));
  ret.addPropertyResult("indexName", "IndexName", (properties.IndexName != null ? cfn_parse.FromCloudFormation.getString(properties.IndexName) : undefined));
  ret.addPropertyResult("processingConfiguration", "ProcessingConfiguration", (properties.ProcessingConfiguration != null ? CfnDeliveryStreamProcessingConfigurationPropertyFromCloudFormation(properties.ProcessingConfiguration) : undefined));
  ret.addPropertyResult("retryOptions", "RetryOptions", (properties.RetryOptions != null ? CfnDeliveryStreamAmazonOpenSearchServerlessRetryOptionsPropertyFromCloudFormation(properties.RetryOptions) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addPropertyResult("s3BackupMode", "S3BackupMode", (properties.S3BackupMode != null ? cfn_parse.FromCloudFormation.getString(properties.S3BackupMode) : undefined));
  ret.addPropertyResult("s3Configuration", "S3Configuration", (properties.S3Configuration != null ? CfnDeliveryStreamS3DestinationConfigurationPropertyFromCloudFormation(properties.S3Configuration) : undefined));
  ret.addPropertyResult("vpcConfiguration", "VpcConfiguration", (properties.VpcConfiguration != null ? CfnDeliveryStreamVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ElasticsearchBufferingHintsProperty`
 *
 * @param properties - the TypeScript properties of a `ElasticsearchBufferingHintsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamElasticsearchBufferingHintsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("intervalInSeconds", cdk.validateNumber)(properties.intervalInSeconds));
  errors.collect(cdk.propertyValidator("sizeInMBs", cdk.validateNumber)(properties.sizeInMBs));
  return errors.wrap("supplied properties not correct for \"ElasticsearchBufferingHintsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamElasticsearchBufferingHintsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamElasticsearchBufferingHintsPropertyValidator(properties).assertSuccess();
  return {
    "IntervalInSeconds": cdk.numberToCloudFormation(properties.intervalInSeconds),
    "SizeInMBs": cdk.numberToCloudFormation(properties.sizeInMBs)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamElasticsearchBufferingHintsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.ElasticsearchBufferingHintsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.ElasticsearchBufferingHintsProperty>();
  ret.addPropertyResult("intervalInSeconds", "IntervalInSeconds", (properties.IntervalInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.IntervalInSeconds) : undefined));
  ret.addPropertyResult("sizeInMBs", "SizeInMBs", (properties.SizeInMBs != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizeInMBs) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ElasticsearchRetryOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `ElasticsearchRetryOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamElasticsearchRetryOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("durationInSeconds", cdk.validateNumber)(properties.durationInSeconds));
  return errors.wrap("supplied properties not correct for \"ElasticsearchRetryOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamElasticsearchRetryOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamElasticsearchRetryOptionsPropertyValidator(properties).assertSuccess();
  return {
    "DurationInSeconds": cdk.numberToCloudFormation(properties.durationInSeconds)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamElasticsearchRetryOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.ElasticsearchRetryOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.ElasticsearchRetryOptionsProperty>();
  ret.addPropertyResult("durationInSeconds", "DurationInSeconds", (properties.DurationInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationInSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ElasticsearchDestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ElasticsearchDestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamElasticsearchDestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bufferingHints", CfnDeliveryStreamElasticsearchBufferingHintsPropertyValidator)(properties.bufferingHints));
  errors.collect(cdk.propertyValidator("cloudWatchLoggingOptions", CfnDeliveryStreamCloudWatchLoggingOptionsPropertyValidator)(properties.cloudWatchLoggingOptions));
  errors.collect(cdk.propertyValidator("clusterEndpoint", cdk.validateString)(properties.clusterEndpoint));
  errors.collect(cdk.propertyValidator("documentIdOptions", CfnDeliveryStreamDocumentIdOptionsPropertyValidator)(properties.documentIdOptions));
  errors.collect(cdk.propertyValidator("domainArn", cdk.validateString)(properties.domainArn));
  errors.collect(cdk.propertyValidator("indexName", cdk.requiredValidator)(properties.indexName));
  errors.collect(cdk.propertyValidator("indexName", cdk.validateString)(properties.indexName));
  errors.collect(cdk.propertyValidator("indexRotationPeriod", cdk.validateString)(properties.indexRotationPeriod));
  errors.collect(cdk.propertyValidator("processingConfiguration", CfnDeliveryStreamProcessingConfigurationPropertyValidator)(properties.processingConfiguration));
  errors.collect(cdk.propertyValidator("retryOptions", CfnDeliveryStreamElasticsearchRetryOptionsPropertyValidator)(properties.retryOptions));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("s3BackupMode", cdk.validateString)(properties.s3BackupMode));
  errors.collect(cdk.propertyValidator("s3Configuration", cdk.requiredValidator)(properties.s3Configuration));
  errors.collect(cdk.propertyValidator("s3Configuration", CfnDeliveryStreamS3DestinationConfigurationPropertyValidator)(properties.s3Configuration));
  errors.collect(cdk.propertyValidator("typeName", cdk.validateString)(properties.typeName));
  errors.collect(cdk.propertyValidator("vpcConfiguration", CfnDeliveryStreamVpcConfigurationPropertyValidator)(properties.vpcConfiguration));
  return errors.wrap("supplied properties not correct for \"ElasticsearchDestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamElasticsearchDestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamElasticsearchDestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BufferingHints": convertCfnDeliveryStreamElasticsearchBufferingHintsPropertyToCloudFormation(properties.bufferingHints),
    "CloudWatchLoggingOptions": convertCfnDeliveryStreamCloudWatchLoggingOptionsPropertyToCloudFormation(properties.cloudWatchLoggingOptions),
    "ClusterEndpoint": cdk.stringToCloudFormation(properties.clusterEndpoint),
    "DocumentIdOptions": convertCfnDeliveryStreamDocumentIdOptionsPropertyToCloudFormation(properties.documentIdOptions),
    "DomainARN": cdk.stringToCloudFormation(properties.domainArn),
    "IndexName": cdk.stringToCloudFormation(properties.indexName),
    "IndexRotationPeriod": cdk.stringToCloudFormation(properties.indexRotationPeriod),
    "ProcessingConfiguration": convertCfnDeliveryStreamProcessingConfigurationPropertyToCloudFormation(properties.processingConfiguration),
    "RetryOptions": convertCfnDeliveryStreamElasticsearchRetryOptionsPropertyToCloudFormation(properties.retryOptions),
    "RoleARN": cdk.stringToCloudFormation(properties.roleArn),
    "S3BackupMode": cdk.stringToCloudFormation(properties.s3BackupMode),
    "S3Configuration": convertCfnDeliveryStreamS3DestinationConfigurationPropertyToCloudFormation(properties.s3Configuration),
    "TypeName": cdk.stringToCloudFormation(properties.typeName),
    "VpcConfiguration": convertCfnDeliveryStreamVpcConfigurationPropertyToCloudFormation(properties.vpcConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamElasticsearchDestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStream.ElasticsearchDestinationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStream.ElasticsearchDestinationConfigurationProperty>();
  ret.addPropertyResult("bufferingHints", "BufferingHints", (properties.BufferingHints != null ? CfnDeliveryStreamElasticsearchBufferingHintsPropertyFromCloudFormation(properties.BufferingHints) : undefined));
  ret.addPropertyResult("cloudWatchLoggingOptions", "CloudWatchLoggingOptions", (properties.CloudWatchLoggingOptions != null ? CfnDeliveryStreamCloudWatchLoggingOptionsPropertyFromCloudFormation(properties.CloudWatchLoggingOptions) : undefined));
  ret.addPropertyResult("clusterEndpoint", "ClusterEndpoint", (properties.ClusterEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.ClusterEndpoint) : undefined));
  ret.addPropertyResult("documentIdOptions", "DocumentIdOptions", (properties.DocumentIdOptions != null ? CfnDeliveryStreamDocumentIdOptionsPropertyFromCloudFormation(properties.DocumentIdOptions) : undefined));
  ret.addPropertyResult("domainArn", "DomainARN", (properties.DomainARN != null ? cfn_parse.FromCloudFormation.getString(properties.DomainARN) : undefined));
  ret.addPropertyResult("indexName", "IndexName", (properties.IndexName != null ? cfn_parse.FromCloudFormation.getString(properties.IndexName) : undefined));
  ret.addPropertyResult("indexRotationPeriod", "IndexRotationPeriod", (properties.IndexRotationPeriod != null ? cfn_parse.FromCloudFormation.getString(properties.IndexRotationPeriod) : undefined));
  ret.addPropertyResult("processingConfiguration", "ProcessingConfiguration", (properties.ProcessingConfiguration != null ? CfnDeliveryStreamProcessingConfigurationPropertyFromCloudFormation(properties.ProcessingConfiguration) : undefined));
  ret.addPropertyResult("retryOptions", "RetryOptions", (properties.RetryOptions != null ? CfnDeliveryStreamElasticsearchRetryOptionsPropertyFromCloudFormation(properties.RetryOptions) : undefined));
  ret.addPropertyResult("roleArn", "RoleARN", (properties.RoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.RoleARN) : undefined));
  ret.addPropertyResult("s3BackupMode", "S3BackupMode", (properties.S3BackupMode != null ? cfn_parse.FromCloudFormation.getString(properties.S3BackupMode) : undefined));
  ret.addPropertyResult("s3Configuration", "S3Configuration", (properties.S3Configuration != null ? CfnDeliveryStreamS3DestinationConfigurationPropertyFromCloudFormation(properties.S3Configuration) : undefined));
  ret.addPropertyResult("typeName", "TypeName", (properties.TypeName != null ? cfn_parse.FromCloudFormation.getString(properties.TypeName) : undefined));
  ret.addPropertyResult("vpcConfiguration", "VpcConfiguration", (properties.VpcConfiguration != null ? CfnDeliveryStreamVpcConfigurationPropertyFromCloudFormation(properties.VpcConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDeliveryStreamProps`
 *
 * @param properties - the TypeScript properties of a `CfnDeliveryStreamProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDeliveryStreamPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("amazonOpenSearchServerlessDestinationConfiguration", CfnDeliveryStreamAmazonOpenSearchServerlessDestinationConfigurationPropertyValidator)(properties.amazonOpenSearchServerlessDestinationConfiguration));
  errors.collect(cdk.propertyValidator("amazonopensearchserviceDestinationConfiguration", CfnDeliveryStreamAmazonopensearchserviceDestinationConfigurationPropertyValidator)(properties.amazonopensearchserviceDestinationConfiguration));
  errors.collect(cdk.propertyValidator("deliveryStreamEncryptionConfigurationInput", CfnDeliveryStreamDeliveryStreamEncryptionConfigurationInputPropertyValidator)(properties.deliveryStreamEncryptionConfigurationInput));
  errors.collect(cdk.propertyValidator("deliveryStreamName", cdk.validateString)(properties.deliveryStreamName));
  errors.collect(cdk.propertyValidator("deliveryStreamType", cdk.validateString)(properties.deliveryStreamType));
  errors.collect(cdk.propertyValidator("elasticsearchDestinationConfiguration", CfnDeliveryStreamElasticsearchDestinationConfigurationPropertyValidator)(properties.elasticsearchDestinationConfiguration));
  errors.collect(cdk.propertyValidator("extendedS3DestinationConfiguration", CfnDeliveryStreamExtendedS3DestinationConfigurationPropertyValidator)(properties.extendedS3DestinationConfiguration));
  errors.collect(cdk.propertyValidator("httpEndpointDestinationConfiguration", CfnDeliveryStreamHttpEndpointDestinationConfigurationPropertyValidator)(properties.httpEndpointDestinationConfiguration));
  errors.collect(cdk.propertyValidator("kinesisStreamSourceConfiguration", CfnDeliveryStreamKinesisStreamSourceConfigurationPropertyValidator)(properties.kinesisStreamSourceConfiguration));
  errors.collect(cdk.propertyValidator("mskSourceConfiguration", CfnDeliveryStreamMSKSourceConfigurationPropertyValidator)(properties.mskSourceConfiguration));
  errors.collect(cdk.propertyValidator("redshiftDestinationConfiguration", CfnDeliveryStreamRedshiftDestinationConfigurationPropertyValidator)(properties.redshiftDestinationConfiguration));
  errors.collect(cdk.propertyValidator("s3DestinationConfiguration", CfnDeliveryStreamS3DestinationConfigurationPropertyValidator)(properties.s3DestinationConfiguration));
  errors.collect(cdk.propertyValidator("splunkDestinationConfiguration", CfnDeliveryStreamSplunkDestinationConfigurationPropertyValidator)(properties.splunkDestinationConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDeliveryStreamProps\"");
}

// @ts-ignore TS6133
function convertCfnDeliveryStreamPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDeliveryStreamPropsValidator(properties).assertSuccess();
  return {
    "AmazonOpenSearchServerlessDestinationConfiguration": convertCfnDeliveryStreamAmazonOpenSearchServerlessDestinationConfigurationPropertyToCloudFormation(properties.amazonOpenSearchServerlessDestinationConfiguration),
    "AmazonopensearchserviceDestinationConfiguration": convertCfnDeliveryStreamAmazonopensearchserviceDestinationConfigurationPropertyToCloudFormation(properties.amazonopensearchserviceDestinationConfiguration),
    "DeliveryStreamEncryptionConfigurationInput": convertCfnDeliveryStreamDeliveryStreamEncryptionConfigurationInputPropertyToCloudFormation(properties.deliveryStreamEncryptionConfigurationInput),
    "DeliveryStreamName": cdk.stringToCloudFormation(properties.deliveryStreamName),
    "DeliveryStreamType": cdk.stringToCloudFormation(properties.deliveryStreamType),
    "ElasticsearchDestinationConfiguration": convertCfnDeliveryStreamElasticsearchDestinationConfigurationPropertyToCloudFormation(properties.elasticsearchDestinationConfiguration),
    "ExtendedS3DestinationConfiguration": convertCfnDeliveryStreamExtendedS3DestinationConfigurationPropertyToCloudFormation(properties.extendedS3DestinationConfiguration),
    "HttpEndpointDestinationConfiguration": convertCfnDeliveryStreamHttpEndpointDestinationConfigurationPropertyToCloudFormation(properties.httpEndpointDestinationConfiguration),
    "KinesisStreamSourceConfiguration": convertCfnDeliveryStreamKinesisStreamSourceConfigurationPropertyToCloudFormation(properties.kinesisStreamSourceConfiguration),
    "MSKSourceConfiguration": convertCfnDeliveryStreamMSKSourceConfigurationPropertyToCloudFormation(properties.mskSourceConfiguration),
    "RedshiftDestinationConfiguration": convertCfnDeliveryStreamRedshiftDestinationConfigurationPropertyToCloudFormation(properties.redshiftDestinationConfiguration),
    "S3DestinationConfiguration": convertCfnDeliveryStreamS3DestinationConfigurationPropertyToCloudFormation(properties.s3DestinationConfiguration),
    "SplunkDestinationConfiguration": convertCfnDeliveryStreamSplunkDestinationConfigurationPropertyToCloudFormation(properties.splunkDestinationConfiguration),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDeliveryStreamPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDeliveryStreamProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDeliveryStreamProps>();
  ret.addPropertyResult("amazonOpenSearchServerlessDestinationConfiguration", "AmazonOpenSearchServerlessDestinationConfiguration", (properties.AmazonOpenSearchServerlessDestinationConfiguration != null ? CfnDeliveryStreamAmazonOpenSearchServerlessDestinationConfigurationPropertyFromCloudFormation(properties.AmazonOpenSearchServerlessDestinationConfiguration) : undefined));
  ret.addPropertyResult("amazonopensearchserviceDestinationConfiguration", "AmazonopensearchserviceDestinationConfiguration", (properties.AmazonopensearchserviceDestinationConfiguration != null ? CfnDeliveryStreamAmazonopensearchserviceDestinationConfigurationPropertyFromCloudFormation(properties.AmazonopensearchserviceDestinationConfiguration) : undefined));
  ret.addPropertyResult("deliveryStreamEncryptionConfigurationInput", "DeliveryStreamEncryptionConfigurationInput", (properties.DeliveryStreamEncryptionConfigurationInput != null ? CfnDeliveryStreamDeliveryStreamEncryptionConfigurationInputPropertyFromCloudFormation(properties.DeliveryStreamEncryptionConfigurationInput) : undefined));
  ret.addPropertyResult("deliveryStreamName", "DeliveryStreamName", (properties.DeliveryStreamName != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryStreamName) : undefined));
  ret.addPropertyResult("deliveryStreamType", "DeliveryStreamType", (properties.DeliveryStreamType != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryStreamType) : undefined));
  ret.addPropertyResult("elasticsearchDestinationConfiguration", "ElasticsearchDestinationConfiguration", (properties.ElasticsearchDestinationConfiguration != null ? CfnDeliveryStreamElasticsearchDestinationConfigurationPropertyFromCloudFormation(properties.ElasticsearchDestinationConfiguration) : undefined));
  ret.addPropertyResult("extendedS3DestinationConfiguration", "ExtendedS3DestinationConfiguration", (properties.ExtendedS3DestinationConfiguration != null ? CfnDeliveryStreamExtendedS3DestinationConfigurationPropertyFromCloudFormation(properties.ExtendedS3DestinationConfiguration) : undefined));
  ret.addPropertyResult("httpEndpointDestinationConfiguration", "HttpEndpointDestinationConfiguration", (properties.HttpEndpointDestinationConfiguration != null ? CfnDeliveryStreamHttpEndpointDestinationConfigurationPropertyFromCloudFormation(properties.HttpEndpointDestinationConfiguration) : undefined));
  ret.addPropertyResult("kinesisStreamSourceConfiguration", "KinesisStreamSourceConfiguration", (properties.KinesisStreamSourceConfiguration != null ? CfnDeliveryStreamKinesisStreamSourceConfigurationPropertyFromCloudFormation(properties.KinesisStreamSourceConfiguration) : undefined));
  ret.addPropertyResult("mskSourceConfiguration", "MSKSourceConfiguration", (properties.MSKSourceConfiguration != null ? CfnDeliveryStreamMSKSourceConfigurationPropertyFromCloudFormation(properties.MSKSourceConfiguration) : undefined));
  ret.addPropertyResult("redshiftDestinationConfiguration", "RedshiftDestinationConfiguration", (properties.RedshiftDestinationConfiguration != null ? CfnDeliveryStreamRedshiftDestinationConfigurationPropertyFromCloudFormation(properties.RedshiftDestinationConfiguration) : undefined));
  ret.addPropertyResult("s3DestinationConfiguration", "S3DestinationConfiguration", (properties.S3DestinationConfiguration != null ? CfnDeliveryStreamS3DestinationConfigurationPropertyFromCloudFormation(properties.S3DestinationConfiguration) : undefined));
  ret.addPropertyResult("splunkDestinationConfiguration", "SplunkDestinationConfiguration", (properties.SplunkDestinationConfiguration != null ? CfnDeliveryStreamSplunkDestinationConfigurationPropertyFromCloudFormation(properties.SplunkDestinationConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}