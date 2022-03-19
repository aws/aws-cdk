/**
 * An augmented manifest file that provides training data for your custom model.
 * An augmented manifest file is a labeled dataset that is produced by Amazon SageMaker Ground Truth.
 * 
 * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_AugmentedManifestsListItem.html
 */
export interface ComprehendAugmentedManifestsListItem {
  /**
   * The S3 prefix to the annotation files that are referred in the augmented manifest file.
   */
  readonly annotationDataS3Uri?: string;

  /**
   * The JSON attribute that contains the annotations for your training documents.
   * The number of attribute names that you specify depends on whether your augmented
   * manifest file is the output of a single labeling job or a chained labeling job.
   * 
   * If your file is the output of a single labeling job, specify the LabelAttributeName
   * key that was used when the job was created in Ground Truth.
   * 
   * If your file is the output of a chained labeling job, specify the LabelAttributeName
   * key for one or more jobs in the chain. Each LabelAttributeName key provides the annotations
   * from an individual job.
   */
  readonly attributeNames: string[];

  /**
   * The type of augmented manifest. PlainTextDocument or SemiStructuredDocument.
   * If you don't specify, the default is PlainTextDocument.
   * 
   * PLAIN_TEXT_DOCUMENT A document type that represents any unicode text that is encoded in UTF-8.
   * 
   * SEMI_STRUCTURED_DOCUMENT A document type with positional and structural context, like a PDF.
   * For training with Amazon Comprehend, only PDFs are supported. For inference, Amazon Comprehend
   * support PDFs, DOCX and TXT.
   */
  readonly documentType?: string;

  /**
   * The Amazon S3 location of the augmented manifest file.
   */
  readonly s3Uri: string;

  /**
   * The S3 prefix to the source files (PDFs) that are referred to in the augmented manifest file.
   */
  readonly sourceDocumentsS3Uri?: string;

  /**
   * The purpose of the data you've provided in the augmented manifest. You can either train or
   * test this data. If you don't specify, the default is train.
   * 
   * TRAIN - all of the documents in the manifest will be used for training. If no test documents
   * are provided, Amazon Comprehend will automatically reserve a portion of the training documents
   * for testing.
   * 
   * TEST - all of the documents in the manifest will be used for testing.
   */
  readonly split?: string;
}

/**
 * The input properties for training a document classifier.
 * 
 * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_DocumentClassifierInputDataConfig.html
 */
 export interface ComprehendDocumentClassifierInputDataConfig {
  /**
    * A list of augmented manifest files that provide training data for your custom model.
    * An augmented manifest file is a labeled dataset that is produced by Amazon SageMaker Ground Truth.
    * 
    * This parameter is required if you set DataFormat to AUGMENTED_MANIFEST.
    */
  readonly augmentedManifests?: ComprehendAugmentedManifestsListItem[];

  /** 
   * The format of your training data:
   * 
   * COMPREHEND_CSV: A two-column CSV file, where labels are provided in the first column,
   * and documents are provided in the second. If you use this value, you must provide the
   * S3Uri parameter in your request.
   * 
   * AUGMENTED_MANIFEST: A labeled dataset that is produced by Amazon SageMaker Ground Truth.
   * This file is in JSON lines format. Each line is a complete JSON object that contains a
   * training document and its associated labels.
   * 
   * If you use this value, you must provide the AugmentedManifests parameter in your request.
   * 
   * If you don't specify a value, Amazon Comprehend uses COMPREHEND_CSV as the default.
   */
  readonly dataFormat?: string;

  /**
   * Indicates the delimiter used to separate each label for training a multi-label classifier.
   * The default delimiter between labels is a pipe (|). You can use a different character as a
   * delimiter (if it's an allowed character) by specifying it under Delimiter for labels. If the
   * training documents use a delimiter other than the default or the delimiter you specify, the
   * labels on that line will be combined to make a single unique label, such as LABELLABELLABEL.
   */
  readonly labelDelimiter?: string;

  /**
   * The Amazon S3 URI for the input data. The S3 bucket must be in the same region as the API
   * endpoint that you are calling. The URI can point to a single input file or it can provide
   * the prefix for a collection of input files.
   * 
   * For example, if you use the URI S3://bucketName/prefix, if the prefix is a single file,
   * Amazon Comprehend uses that file as input. If more than one file begins with the prefix,
   * Amazon Comprehend uses all of them as input.
   * 
   * This parameter is required if you set DataFormat to COMPREHEND_CSV.
   */
  readonly s3Uri?: string;

  /**
   * The Amazon S3 URI for the input data. The Amazon S3 bucket must be in the same AWS Region
   * as the API endpoint that you are calling. The URI can point to a single input file or it
   * can provide the prefix for a collection of input files.
   */
  readonly testS3Uri?: string;
}

/**
 * Provides output results configuration parameters for custom classifier jobs.
 * 
 * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_DocumentClassifierOutputDataConfig.html
 */
 export interface ComprehendDocumentClassifierOutputDataConfig {
  /**
   * ID for the AWS Key Management Service (KMS) key that Amazon Comprehend uses to encrypt the
   * output results from an analysis job. The KmsKeyId can be one of the following formats:
   * 
   * KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"
   * 
   * Amazon Resource Name (ARN) of a KMS Key: 
   * "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"
   * 
   * KMS Key Alias: "alias/ExampleAlias"
   * 
   * ARN of a KMS Key Alias: "arn:aws:kms:us-west-2:111122223333:alias/ExampleAlias"
   */
  readonly kmsKeyId?: string;

  /**
   * When you use the OutputDataConfig object while creating a custom classifier, you specify the
   * Amazon S3 location where you want to write the confusion matrix. The URI must be in the same
   * region as the API endpoint that you are calling. The location is used as the prefix for the
   * actual location of this output file.
   * 
   * When the custom classifier job is finished, the service creates the output file in a directory
   * specific to the job. The S3Uri field contains the location of the output file, called
   * output.tar.gz. It is a compressed archive that contains the confusion matrix.
   */
  readonly s3Uri?: string;
}

/**
 * A key-value pair that adds as a metadata to a resource used by Amazon Comprehend. For example,
 * a tag with the key-value pair ‘Department’:’Sales’ might be added to a resource to indicate its
 * use by a particular department.
 * 
 * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_Tag.html
 */
export interface ComprehendTag {
  /**
   * The initial part of a key-value pair that forms a tag associated with a given resource. For
   * instance, if you want to show which resources are used by which departments, you might use
   * “Department” as the key portion of the pair, with multiple possible values such as “sales,”
   * “legal,” and “administration.”
   */
  readonly key: string;

  /**
   * The second part of a key-value pair that forms a tag associated with a given resource. For
   * instance, if you want to show which resources are used by which departments, you might use
   * “Department” as the initial (key) portion of the pair, with a value of “sales” to indicate
   * the sales department.
   */
  readonly value?: string;
}

/**
 * Configuration parameters for an optional private Virtual Private Cloud (VPC) containing the
 * resources you are using for the job. For more information, see Amazon VPC.
 * 
 * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_VpcConfig.html
 */
export interface ComprehendVpcConfig {

  /**
   * The ID number for a security group on an instance of your private VPC. Security groups on your
   * VPC function serve as a virtual firewall to control inbound and outbound traffic and provides
   * security for the resources that you’ll be accessing on the VPC. This ID number is preceded by
   * "sg-", for instance: "sg-03b388029b0a285ea". For more information, see Security Groups for your VPC.
   */
  readonly securityGroupIds: string[];

  /**
   * The ID for each subnet being used in your private VPC. This subnet is a subset of the a range of
   * IPv4 addresses used by the VPC and is specific to a given availability zone in the VPC’s region.
   * This ID number is preceded by "subnet-", for instance: "subnet-04ccf456919e69055". For more information,
   * see VPCs and Subnets.
   */
  readonly subnets: string[];
}