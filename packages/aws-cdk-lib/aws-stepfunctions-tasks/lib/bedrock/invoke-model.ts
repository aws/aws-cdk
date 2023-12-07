import { Construct } from 'constructs';
import * as bedrock from '../../../aws-bedrock';
import * as iam from '../../../aws-iam';
import * as s3 from '../../../aws-s3';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Location to retrieve the input data, prior to calling Bedrock InvokeModel.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-bedrock.html
 */
export interface BedrockInvokeModelInputProps {

  /**
   * S3 object to retrieve the input data from.
   *
   * If the S3 location is not set, then the Body must be set.
   *
   * @default Input data is retrieved from the `body` field
   */
  readonly s3Location?: s3.Location;
}

/**
 * Location where the Bedrock InvokeModel API response is written.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-bedrock.html
 */
export interface BedrockInvokeModelOutputProps {

  /**
   * S3 object where the Bedrock InvokeModel API response is written.
   *
   * If you specify this field, the API response body is replaced with
   * a reference to the Amazon S3 location of the original output.
   *
   * @default Response body is returned in the task result
   */
  readonly s3Location?: s3.Location;
}

/**
 * Properties for invoking a Bedrock Model
 */
export interface BedrockInvokeModelProps extends sfn.TaskStateBaseProps {

  /**
   * The Bedrock model that the task will invoke.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/api-methods-run.html
   */
  readonly model: bedrock.IModel;

  /**
   * The input data for the Bedrock model invocation.
   *
   * The inference parameters contained in the body depend on the Bedrock model being used.
   *
   * The body must be in the format specified in the `contentType` field.
   * For example, if the content type is `application/json`, the body must be
   * JSON formatted.
   *
   * The body must be up to 256 KB in size. For input data that exceeds 256 KB,
   * use `input` instead to retrieve the input data from S3.
   *
   * You must specify either the `body` or the `input` field, but not both.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters.html
   *
   * @default Input data is retrieved from the location specified in the `input` field
   */
  readonly body?: sfn.TaskInput;

  /**
   * The desired MIME type of the inference body in the response.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InvokeModel.html
   * @default 'application/json'
   */
  readonly accept?: string;

  /**
   * The MIME type of the input data in the request.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InvokeModel.html
   * @default 'application/json'
   */
  readonly contentType?: string;

  /**
   * The source location to retrieve the input data from.
   *
   * @default Input data is retrieved from the `body` field
   */
  readonly input?: BedrockInvokeModelInputProps;

  /**
   * The destination location where the API response is written.
   *
   * If you specify this field, the API response body is replaced with a reference to the
   * output location.
   *
   * @default The API response body is returned in the result.
   */
  readonly output?: BedrockInvokeModelOutputProps;
}

/**
 * A Step Functions Task to invoke a model in Bedrock.
 *
 */
export class BedrockInvokeModel extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
  ];

  protected readonly taskMetrics: sfn.TaskMetricsConfig | undefined;
  protected readonly taskPolicies: iam.PolicyStatement[] | undefined;

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: BedrockInvokeModelProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, BedrockInvokeModel.SUPPORTED_INTEGRATION_PATTERNS);

    const isBodySpecified = props.body !== undefined;
    const isInputSpecified = props.input !== undefined && props.input.s3Location !== undefined;

    if (isBodySpecified && isInputSpecified) {
      throw new Error('Either `body` or `input` must be specified, but not both.');
    }
    if (!isBodySpecified && !isInputSpecified) {
      throw new Error('Either `body` or `input` must be specified.');
    }
    if (props.input?.s3Location?.objectVersion !== undefined) {
      throw new Error('Input S3 object version is not supported.');
    }
    if (props.output?.s3Location?.objectVersion !== undefined) {
      throw new Error('Output S3 object version is not supported.');
    }

    this.taskPolicies = this.renderPolicyStatements();
  }

  private renderPolicyStatements(): iam.PolicyStatement[] {
    const policyStatements = [
      new iam.PolicyStatement({
        actions: ['bedrock:InvokeModel'],
        resources: [this.props.model.modelArn],
      }),
    ];

    if (this.props.input !== undefined && this.props.input.s3Location !== undefined) {
      policyStatements.push(
        new iam.PolicyStatement({
          actions: ['s3:GetObject'],
          resources: [
            Stack.of(this).formatArn({
              region: '',
              account: '',
              service: 's3',
              resource: this.props.input?.s3Location?.bucketName,
              resourceName: this.props.input?.s3Location?.objectKey,
            }),
          ],
        }),
      );
    }

    if (this.props.output !== undefined && this.props.output.s3Location !== undefined) {
      policyStatements.push(
        new iam.PolicyStatement({
          actions: ['s3:PutObject'],
          resources: [
            Stack.of(this).formatArn({
              region: '',
              account: '',
              service: 's3',
              resource: this.props.output?.s3Location?.bucketName,
              resourceName: this.props.output?.s3Location?.objectKey,
            }),
          ],
        }),
      );
    }

    return policyStatements;
  }

  /**
   * Provides the Bedrock InvokeModel service integration task configuration
   *
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('bedrock', 'invokeModel'),
      Parameters: sfn.FieldUtils.renderObject({
        ModelId: this.props.model.modelArn,
        Accept: this.props.accept,
        ContentType: this.props.contentType,
        Body: this.props.body?.value,
        Input: this.props.input?.s3Location ? {
          S3Uri: `s3://${this.props.input.s3Location.bucketName}/${this.props.input.s3Location.objectKey}`,
        } : undefined,
        Output: this.props.output?.s3Location ? {
          S3Uri: `s3://${this.props.output.s3Location.bucketName}/${this.props.output.s3Location.objectKey}`,
        } : undefined,
      }),
    };
  }
}
