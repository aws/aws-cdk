import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for creating an Amazon SageMaker endpoint
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 */
export interface SageMakerCreateEndpointProps extends sfn.TaskStateBaseProps {
  /**
   * The name of an endpoint configuration.
   */
  readonly endpointConfigName: string;
  /**
   * The name of the endpoint. The name must be unique within an AWS Region in your AWS account.
   */
  readonly endpointName: string;
  /**
   * Tags to be applied to the endpoint.
   *
   * @default - No tags
   */
  readonly tags?: sfn.TaskInput;
}

/**
 * A Step Functions Task to create a SageMaker endpoint
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 */
export class SageMakerCreateEndpoint extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
  ];
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];
  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: SageMakerCreateEndpointProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, SageMakerCreateEndpoint.SUPPORTED_INTEGRATION_PATTERNS);
    this.taskPolicies = this.makePolicyStatements();
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('sagemaker', 'createEndpoint', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject(this.renderParameters()),
    };
  }

  private renderParameters(): { [key: string]: any } {
    return {
      EndpointConfigName: this.props.endpointConfigName,
      EndpointName: this.props.endpointName,
      Tags: this.props.tags?.value,
    };
  }

  private makePolicyStatements(): iam.PolicyStatement[] {
    const stack = cdk.Stack.of(this);
    // https://docs.aws.amazon.com/sagemaker/latest/dg/api-permissions-reference.html
    return [
      new iam.PolicyStatement({
        actions: ['sagemaker:createEndpoint'],
        resources: [
          stack.formatArn({
            service: 'sagemaker',
            resource: 'endpoint',
            // If the endpoint name comes from input, we cannot target the policy to a particular ARN prefix reliably.
            // SageMaker uses lowercase for resource name in the arn
            resourceName: sfn.JsonPath.isEncodedJsonPath(this.props.endpointName) ? '*' : `${this.props.endpointName.toLowerCase()}`,
          }),
          stack.formatArn({
            service: 'sagemaker',
            resource: 'endpoint-config',
            // If the endpoint config name comes from input, we cannot target the policy to a particular ARN prefix reliably.
            // SageMaker uses lowercase for resource name in the arn
            resourceName: sfn.JsonPath.isEncodedJsonPath(this.props.endpointConfigName) ? '*' : `${this.props.endpointConfigName.toLowerCase()}`,
          }),
        ],
      }),
      new iam.PolicyStatement({
        actions: ['sagemaker:ListTags'],
        // https://docs.aws.amazon.com/step-functions/latest/dg/sagemaker-iam.html
        resources: ['*'],
      }),
    ];
  }
}