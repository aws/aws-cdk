import { Construct } from 'constructs';
import * as bedrock from '../../../aws-bedrock';
import * as ec2 from '../../../aws-ec2';
import * as iam from '../../../aws-iam';
import * as kms from '../../../aws-kms';
import * as sfn from '../../../aws-stepfunctions';
import { Stack, Token } from '../../../core';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * The customization type.
 *
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/custom-models.html
 */
export enum CustomizationType {
  /**
   * Fine-tuning
   *
   * Provide labeled data in order to train a model to improve performance on specific tasks.
   */
  FINE_TUNING = 'FINE_TUNING',
  /**
   * Continued pre-training
   *
   * Provide unlabeled data to pre-train a foundation model by familiarizing it with certain types of inputs.
   */
  CONTINUED_PRE_TRAINING = 'CONTINUED_PRE_TRAINING',
}

/**
 * The key/value pair for a tag.
 */
export interface Tag {
  /**
   * Key for the tag.
   */
  key: string;
  /**
   * Value for the tag.
   */
  value: string;
}

/**
 * VPC configuration
 */
export interface BedrockCreateModelCustomizationJobVpcConfig {
  /**
   * VPC configuration security groups
   */
  securityGroups: ec2.ISecurityGroup[];
  /**
   * VPC configuration subnets
   */
  subnets: ec2.ISubnet[];
}

/**
 * Properties for invoking a Bedrock Model
 */
export interface BedrockCreateModelCustomizationJobProps extends sfn.TaskStateBaseProps {
  /**
   * The base model.
   */
  readonly baseModel: bedrock.IModel;
  /**
   * A unique, case-sensitive identifier to ensure that the API request completes no more than one time.
   * If this token matches a previous request, Amazon Bedrock ignores the request, but does not return an error.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/APIReference/Run_Instance_Idempotency.html
   *
   * @default - no client request token
   */
  readonly clientRequestToken?: string;
  /**
   * The customization type.
   *
   * @default FINE_TUNING
   */
  readonly customizationType?: CustomizationType;
  /**
   * The custom model is encrypted at rest using this key.
   */
  readonly kmsKey?: kms.IKey;
  /**
   * A name for the resulting custom model.
   */
  readonly customModelName: string;
  /**
   * Tags to attach to the resulting custom model.
   */
  readonly customModelTags?: Tag[];
  /**
   * Parameters related to tuning the model.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/custom-models-hp.html
   *
   * @default - use default hyperparameters
   */
  readonly hyperParameters?: { [key: string]: string };
  /**
   * A name for the fine-tuning job.
   */
  readonly jobName: string;
  /**
   * Tags to attach to the job.
   */
  readonly jobTags?: Tag[];
  /**
   * The S3 URI where the output data is stored.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/APIReference/API_OutputDataConfig.html
   */
  readonly outputDataS3Uri: string;
  /**
   * The S3 URI where the training data is stored.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/APIReference/API_TrainingDataConfig.html
   */
  readonly trainingDataS3Uri: string;
  /**
   * The S3 URI where the validation data is stored.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/APIReference/API_Validator.html
   */
  readonly validationDataS3Uri: string[];
  /**
   * The IAM role that Amazon Bedrock can assume to perform tasks on your behalf.
   *
   * For example, during model training, Amazon Bedrock needs your permission to read input data from an S3 bucket,
   * write model artifacts to an S3 bucket.
   * To pass this role to Amazon Bedrock, the caller of this API must have the iam:PassRole permission.
   */
  readonly role: iam.IRole;
  /**
   * Configuration parameters for the private Virtual Private Cloud (VPC) that contains the resources you are using for this job.
   */
  readonly vpcConfig?: BedrockCreateModelCustomizationJobVpcConfig;
}

/**
 * A Step Functions Task to create model customization in Bedrock.
 */
export class BedrockCreateModelCustomizationJob extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
  ];

  protected readonly taskMetrics: sfn.TaskMetricsConfig | undefined;
  protected readonly taskPolicies: iam.PolicyStatement[] | undefined;

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: BedrockCreateModelCustomizationJobProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    this.validateStringLength('ClientRequestToken', 1, 256, props.clientRequestToken);
    this.validatePattern('ClientRequestToken', /^[a-zA-Z0-9](-*[a-zA-Z0-9])*$/, props.clientRequestToken);
    this.validateStringLength('CustomModelName', 1, 63, props.customModelName);
    this.validatePattern('CustomModelName', /^([0-9a-zA-Z][_-]?)+$/, props.customModelName);
    this.validateArrayLength('CustomModelTags', 0, 200, props.customModelTags);
    this.validateStringLength('JobName', 1, 63, props.jobName);
    this.validatePattern('JobName', /^[a-zA-Z0-9](-*[a-zA-Z0-9\+\-\.])*$/, props.jobName);
    this.validateArrayLength('JobTags', 0, 200, props.jobTags);
    this.validateArrayLength('ValidationDataS3Uri', 1, 10, props.validationDataS3Uri);
    this.validateArrayLength('SecurityGroups', 1, 5, props.vpcConfig?.securityGroups);
    this.validateArrayLength('Subnets', 1, 16, props.vpcConfig?.subnets);

    validatePatternSupported(this.integrationPattern, BedrockCreateModelCustomizationJob.SUPPORTED_INTEGRATION_PATTERNS);

    this.taskPolicies = this.renderPolicyStatements();
  }

  private renderPolicyStatements(): iam.PolicyStatement[] {
    const policyStatements = [
      new iam.PolicyStatement({
        actions: ['bedrock:CreateModelCustomizationJob'],
        resources: [
          this.props.baseModel.modelArn,
          Stack.of(this).formatArn({
            service: 'bedrock',
            resource: 'custom-model',
            resourceName: '*',
          }),
          Stack.of(this).formatArn({
            service: 'bedrock',
            resource: 'model-customization-job',
            resourceName: '*',
          }),
        ],
      }),
      new iam.PolicyStatement({
        actions: ['iam:PassRole'],
        resources: [this.props.role.roleArn],
      }),
    ];

    return policyStatements;
  }

  private validateStringLength(name: string, min: number, max: number, value?: string): void {
    if (value !== undefined && !Token.isUnresolved(value) && (value.length < min || value.length > max)) {
      throw new Error(`${name} must be between ${min} and ${max} characters long`);
    }
  }

  private validatePattern(name: string, pattern: RegExp, value?: string): void {
    if (value !== undefined && !Token.isUnresolved(value) && !pattern.test(value)) {
      throw new Error(`${name} must match the pattern ${pattern}`);
    }
  }

  private validateArrayLength(name: string, min: number, max: number, value?: any[]): void {
    if (value !== undefined && (value.length < min || value.length > max)) {
      throw new Error(`${name} must be between ${min} and ${max} items long`);
    }
  }

  /**
   * Provides the Bedrock CreateModelCustomizationJob service integration task configuration
   *
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('bedrock', 'createModelCustomizationJob'),
      Parameters: sfn.FieldUtils.renderObject({
        BaseModelIdentifier: this.props.baseModel.modelArn,
        ClientRequestToken: this.props.clientRequestToken,
        CustomizationType: this.props.customizationType,
        CustomModelKmsKeyId: this.props.kmsKey?.keyArn,
        CustomModelName: this.props.customModelName,
        CustomModelTags: this.props.customModelTags?.map((tag) => ({ Key: tag.key, Value: tag.value })),
        HyperParameters: this.props.hyperParameters,
        JobName: this.props.jobName,
        JobTags: this.props.jobTags?.map((tag) => ({ Key: tag.key, Value: tag.value })),
        OutputDataConfig: {
          S3Uri: this.props.outputDataS3Uri,
        },
        RoleArn: this.props.role.roleArn,
        TrainingDataConfig: {
          S3Uri: this.props.trainingDataS3Uri,
        },
        ValidationDataConfig: {
          Validators: this.props.validationDataS3Uri.map((s3Uri) => ({ S3Uri: s3Uri })),
        },
        VpcConfig: this.props.vpcConfig ? {
          SecurityGroupIds: this.props.vpcConfig.securityGroups.map((sg) => sg.securityGroupId),
          SubnetIds: this.props.vpcConfig.subnets.map((subnet) => subnet.subnetId),
        } : undefined,
      }),
    };
  }
}
