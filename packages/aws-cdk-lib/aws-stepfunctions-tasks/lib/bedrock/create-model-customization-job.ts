import { Construct } from 'constructs';
import * as bedrock from '../../../aws-bedrock';
import * as ec2 from '../../../aws-ec2';
import * as iam from '../../../aws-iam';
import * as kms from '../../../aws-kms';
import * as sfn from '../../../aws-stepfunctions';
import { Aws, Stack, Token } from '../../../core';
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
export interface ITag {
  /**
   * Key for the tag.
   */
  readonly key: string;

  /**
   * Value for the tag.
   */
  readonly value: string;
}

/**
 * VPC configuration
 */
export interface IBedrockCreateModelCustomizationJobVpcConfig {
  /**
   * VPC configuration security groups
   *
   * The maximum number of security groups is 5.
   */
  readonly securityGroups: ec2.ISecurityGroup[];

  /**
   * VPC configuration subnets
   *
   * The maximum number of subnets is 16.
   */
  readonly subnets: ec2.ISubnet[];
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
   * The maximum length is 256 characters and it needs to satisfy the regular expression ^[a-zA-Z0-9](-*[a-zA-Z0-9])*$.
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
   *
   * @default - no encryption
   */
  readonly customModelKmsKey?: kms.IKey;

  /**
   * A name for the resulting custom model.
   *
   * The maximum length is 63 characters and it needs to satisfy the regular expression ^([0-9a-zA-Z][_-]?)+$.
   */
  readonly customModelName: string;

  /**
   * Tags to attach to the resulting custom model.
   *
   * The maximum number of tags is 200.
   *
   * @default - no tags
   */
  readonly customModelTags?: ITag[];

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
   *
   * The maximum length is 63 characters and it needs to satisfy the regular expression ^[a-zA-Z0-9](-*[a-zA-Z0-9\+\-\.])*$.
   */
  readonly jobName: string;

  /**
   * Tags to attach to the job.
   * The maximum number of tags is 200.
   *
   * @default - no tags
   */
  readonly jobTags?: ITag[];

  /**
   * The S3 URI where the output data is stored.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/APIReference/API_OutputDataConfig.html
   */
  readonly outputDataS3Uri: string;

  /**
   * The IAM role that Amazon Bedrock can assume to perform tasks on your behalf.
   *
   * For example, during model training, Amazon Bedrock needs your permission to read input data from an S3 bucket,
   * write model artifacts to an S3 bucket.
   * To pass this role to Amazon Bedrock, the caller of this API must have the iam:PassRole permission.
   *
   * @default - use auto generated role
   */
  readonly role?: iam.IRole;

  /**
   * The S3 URI where the training data is stored.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/APIReference/API_TrainingDataConfig.html
   */
  readonly trainingDataS3Uri: string;

  /**
   * The S3 URI where the validation data is stored.
   *
   * The maximum number of validation data S3 URIs is 10.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/APIReference/API_Validator.html
   */
  readonly validationDataS3Uri: string[];

  /**
   * Configuration parameters for the private Virtual Private Cloud (VPC) that contains the resources you are using for this job.
   *
   * @default - no VPC configuration
   */
  readonly vpcConfig?: IBedrockCreateModelCustomizationJobVpcConfig;
}

/**
 * A Step Functions Task to create model customization in Bedrock.
 */
export class BedrockCreateModelCustomizationJob extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;
  private _role: iam.IRole;

  constructor(scope: Construct, id: string, private readonly props: BedrockCreateModelCustomizationJobProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    this.validateStringLength('clientRequestToken', 1, 256, props.clientRequestToken);
    this.validatePattern('clientRequestToken', /^[a-zA-Z0-9](-*[a-zA-Z0-9])*$/, props.clientRequestToken);
    this.validateStringLength('customModelName', 1, 63, props.customModelName);
    this.validatePattern('customModelName', /^([0-9a-zA-Z][_-]?)+$/, props.customModelName);
    this.validateArrayLength('customModelTags', 0, 200, props.customModelTags);
    this.validateStringLength('jobName', 1, 63, props.jobName);
    this.validatePattern('jobName', /^[a-zA-Z0-9](-*[a-zA-Z0-9\+\-\.])*$/, props.jobName);
    this.validateArrayLength('jobTags', 0, 200, props.jobTags);
    this.validateArrayLength('validationDataS3Uri', 1, 10, props.validationDataS3Uri);
    this.validateArrayLength('securityGroups', 1, 5, props.vpcConfig?.securityGroups);
    this.validateArrayLength('subnets', 1, 16, props.vpcConfig?.subnets);

    validatePatternSupported(this.integrationPattern, BedrockCreateModelCustomizationJob.SUPPORTED_INTEGRATION_PATTERNS);

    this._role = this.renderBedrockCreateModelCustomizationJobRole();
    this.taskPolicies = this.renderPolicyStatements();
  }

  /**
   * The IAM role for the bedrock create model customization job
   */
  public get role(): iam.IRole {
    return this._role;
  }

  /**
   * Configure the IAM role for the bedrock create model customization job
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/model-customization-code-samples.html
   */
  private renderBedrockCreateModelCustomizationJobRole(): iam.IRole {
    if (this.props.role) {
      return this.props.role;
    }
    const stack = Stack.of(this);
    const role = new iam.Role(this, 'BedrockRole', {
      assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
      inlinePolicies: {
        BedrockCreateModelCustomizationJob: new iam.PolicyDocument({
          statements: [
            ...(this.props.vpcConfig ? [
              new iam.PolicyStatement({
                actions: [
                  'ec2:DescribeNetworkInterfaces',
                  'ec2:DescribeVpcs',
                  'ec2:DescribeDhcpOptions',
                  'ec2:DescribeSubnets',
                  'ec2:DescribeSecurityGroups',
                ],
                resources: ['*'],
              }),
              new iam.PolicyStatement({
                actions: ['ec2:CreateNetworkInterface'],
                resources: [
                  stack.formatArn({
                    service: 'ec2',
                    resource: 'network-interface',
                    resourceName: '*',
                  }),
                  stack.formatArn({
                    service: 'ec2',
                    resource: 'security-group',
                    resourceName: '*',
                  }),
                  stack.formatArn({
                    service: 'ec2',
                    resource: 'subnet',
                    resourceName: '*',
                  }),
                ],
              }),
              new iam.PolicyStatement({
                actions: ['ec2:CreateTags'],
                resources: [stack.formatArn({
                  service: 'ec2',
                  resource: 'network-interface',
                  resourceName: '*',
                })],
                conditions: {
                  StringEquals: {
                    'ec2:CreateAction': 'CreateNetworkInterface',
                  },
                },
              }),
              new iam.PolicyStatement({
                actions: [
                  'ec2:CreateNetworkInterfacePermission',
                  'ec2:DeleteNetworkInterface',
                  'ec2:DeleteNetworkInterfacePermission',
                ],
                resources: ['*'],
                conditions: {
                  StringEquals: {
                    'ec2:Subnet': [
                      ...(this.props.vpcConfig
                        ? this.props.vpcConfig.subnets.map((subnet) => subnet.subnetId)
                        : []),
                    ],
                  },
                },
              }),
            ] : []),
            new iam.PolicyStatement({
              actions: ['s3:GetObject'],
              resources: [
                this.s3UriToArn(this.props.trainingDataS3Uri),
                ...(this.props.validationDataS3Uri.map((s3Uri) => this.s3UriToArn(s3Uri))),
              ],
            }),
            new iam.PolicyStatement({
              actions: ['s3:PutObject'],
              resources: [this.s3UriToArn(this.props.outputDataS3Uri)],
            }),
          ],
        }),
      },
    });

    return role;
  }

  private renderPolicyStatements(): iam.PolicyStatement[] {
    const policyStatements = [
      new iam.PolicyStatement({
        actions: [
          'bedrock:CreateModelCustomizationJob',
          'bedrock:TagResource',
        ],
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
        resources: [this._role.roleArn],
      }),
      ...(this.props.customModelKmsKey
        ? [
          new iam.PolicyStatement({
            // TODO - this should be more specific
            actions: ['kms:*'],
            resources: [this.props.customModelKmsKey.keyArn],
          }),
        ]
        : []),
    ];
    return policyStatements;
  }

  private validateStringLength(name: string, min: number, max: number, value?: string): void {
    if (value !== undefined && !Token.isUnresolved(value) && (value.length < min || value.length > max)) {
      throw new Error(`${name} must be between ${min} and ${max} characters long, got: ${value.length}`);
    }
  }

  private validatePattern(name: string, pattern: RegExp, value?: string): void {
    if (value !== undefined && !Token.isUnresolved(value) && !pattern.test(value)) {
      throw new Error(`${name} must match the pattern ${pattern.toString()}, got: ${value}`);
    }
  }

  private validateArrayLength(name: string, min: number, max: number, value?: any[]): void {
    if (value !== undefined && (value.length < min || value.length > max)) {
      throw new Error(`${name} must be between ${min} and ${max} items long, got: ${value.length}`);
    }
  }

  private s3UriToArn(s3Uri: string): string {
    const bucketOnlyPattern = /^s3:\/\/([^\/]+)$/;
    const bucketAndKeyPattern = /^s3:\/\/([^\/]+)\/(.+)$/;
    if (bucketOnlyPattern.test(s3Uri)) {
      const match = s3Uri.match(bucketOnlyPattern);
      if (!match) throw new Error(`Invalid S3 URI: ${s3Uri}`);
      const [, bucket] = match;
      return `arn:${Aws.PARTITION}:s3:::${bucket}`;
    } else if (bucketAndKeyPattern.test(s3Uri)) {
      const match = s3Uri.match(bucketAndKeyPattern);
      if (!match) throw new Error(`Invalid S3 URI: ${s3Uri}`);
      const [, bucket, objectKey] = match;
      return `arn:${Aws.PARTITION}:s3:::${bucket}/${objectKey}`;
    } else {
      throw new Error(`Unsupported S3 URI format: ${s3Uri}`);
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
        CustomModelKmsKeyId: this.props.customModelKmsKey?.keyArn,
        CustomModelName: this.props.customModelName,
        CustomModelTags: this.props.customModelTags?.map((tag) => ({ Key: tag.key, Value: tag.value })),
        HyperParameters: this.props.hyperParameters,
        JobName: this.props.jobName,
        JobTags: this.props.jobTags?.map((tag) => ({ Key: tag.key, Value: tag.value })),
        OutputDataConfig: {
          S3Uri: this.props.outputDataS3Uri,
        },
        RoleArn: this._role.roleArn,
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
