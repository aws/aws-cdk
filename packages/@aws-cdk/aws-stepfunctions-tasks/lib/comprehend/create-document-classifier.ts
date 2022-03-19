import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { ComprehendDocumentClassifierInputDataConfig, ComprehendDocumentClassifierOutputDataConfig, ComprehendTag, ComprehendVpcConfig } from './base-types';
import { ComprehendMethod, getComprehendResourceArn } from './private/utils';

/**
 * Properties for ComprehendCreateDocumentClassifier Task
 * 
 * @see https://docs.aws.amazon.com/comprehend/latest/dg/API_CreateDocumentClassifier.html
 */
export interface ComprehendCreateDocumentClassifierProps extends sfn.TaskStateBaseProps {
  /**
   * A unique identifier for the request. If you don't set the client request token, 
   * Amazon Comprehend generates one.
   */
  readonly clientRequestToken?: string;

  /**
   * The Amazon Resource Name (ARN) of the AWS Identity and Management (IAM) role 
   * that grants Amazon Comprehend read access to your input data.
   */
  readonly dataAccessRoleArn: string;

  /**
   * The name of the document classifier.
   */
  readonly documentClassifierName: string;

  /**
   * Specifies the format and location of the input data for the job.
   */
  readonly inputDataConfig: ComprehendDocumentClassifierInputDataConfig;

  /**
   * The language of the input documents. You can specify any of the following
   * languages supported by Amazon Comprehend: German ("de"), English ("en"),
   * Spanish ("es"), French ("fr"), Italian ("it"), or Portuguese ("pt"). All
   * documents must be in the same language.
   */
  readonly languageCode: string;

  /**
   * Indicates the mode in which the classifier will be trained. The classifier
   * can be trained in multi-class mode, which identifies one and only one class
   * for each document, or multi-label mode, which identifies one or more labels
   * for each document. In multi-label mode, multiple labels for an individual
   * document are separated by a delimiter. The default delimiter between labels is a pipe (|).
   */
  readonly mode?: string;

  /**
   * ID for the AWS Key Management Service (KMS) key that Amazon Comprehend uses to encrypt
   * trained custom models. The ModelKmsKeyId can be either of the following formats:
   * 
   * KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"
   * 
   * Amazon Resource Name (ARN) of a KMS Key: 
   * "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"
   */
  readonly modelKmsKeyId?: string;

  /**
   * The resource-based policy to attach to your custom document classifier model. You can
   * use this policy to allow another AWS account to import your custom model.
   * 
   * Provide your policy as a JSON body that you enter as a UTF-8 encoded string without line
   * breaks. To provide valid JSON, enclose the attribute names and values in double quotes.
   * If the JSON body is also enclosed in double quotes, then you must escape the double quotes
   * that are inside the policy:
   * 
   * "{\"attribute\": \"value\", \"attribute\": [\"value\"]}"
   * 
   * To avoid escaping quotes, you can use single quotes to enclose the policy and double quotes
   * to enclose the JSON names and values:
   * 
   * '{"attribute": "value", "attribute": ["value"]}'
   */
  readonly modelPolicy?: string;

  /**
   * Enables the addition of output results configuration parameters for custom classifier jobs.
   */
  readonly outputDataConfig?: ComprehendDocumentClassifierOutputDataConfig;

  /**
   * Tags to be associated with the document classifier being created. A tag is a key-value pair
   * that adds as a metadata to a resource used by Amazon Comprehend. For example, a tag with
   * "Sales" as the key might be added to a resource to indicate its use by the sales department.
   */
  readonly tags?: ComprehendTag[];

  /**
   * The version name given to the newly created classifier. Version names can have a maximum of
   * 256 characters. Alphanumeric characters, hyphens (-) and underscores (_) are allowed. The
   * version name must be unique among all models with the same classifier name in the account/AWS Region.
   */
  readonly versionName?: string;

  /**
   * ID for the AWS Key Management Service (KMS) key that Amazon Comprehend uses to encrypt data on
   * the storage volume attached to the ML compute instance(s) that process the analysis job. The
   * VolumeKmsKeyId can be either of the following formats:
   * 
   * KMS Key ID: "1234abcd-12ab-34cd-56ef-1234567890ab"
   * 
   * Amazon Resource Name (ARN) of a KMS Key:
   * "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"
   */
  readonly volumeKmsKeyId?: string;

  /**
   * Configuration parameters for an optional private Virtual Private Cloud (VPC) containing the
   * resources you are using for your custom classifier. For more information, see Amazon VPC.
   */
  readonly VpcConfig?: ComprehendVpcConfig;
}

/**
 * A StepFunctions task to call ComprehendCreateDocumentClassifier
 */
export class ComprehendCreateDocumentClassifier extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: ComprehendCreateDocumentClassifierProps) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['comprehend:createDocumentClassifier'],
        resources: ['*'],
      }),
    ];
  }

  /**
    * @internal
    */
  protected _renderTask(): any {
    return {
      Resource: getComprehendResourceArn(ComprehendMethod.CREATE_DOCUMENT_CLASSIFIER),
      Parameters: sfn.FieldUtils.renderObject({
        DataAccessRoleArn: this.props.dataAccessRoleArn,
        DocumentClassifierName: this.props.documentClassifierName,
        InputDataConfig: this.props.inputDataConfig,
        LanguageCode: this.props.languageCode,
      }),
    };
  }
}


