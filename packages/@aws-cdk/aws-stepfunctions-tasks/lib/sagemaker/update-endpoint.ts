import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for updating Amazon SageMaker endpoint
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 * @experimental
 */
export interface SageMakerUpdateEndpointProps extends sfn.TaskStateBaseProps {
  /**
   * The name of the new endpoint configuration
   */
  readonly endpointConfigName: string;
  /**
   * The name of the endpoint whose configuration you want to update.
   */
  readonly endpointName: string;
}

/**
 * A Step Functions Task to update a SageMaker endpoint
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 * @experimental
 */
export class SageMakerUpdateEndpoint extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
  ];
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];
  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: SageMakerUpdateEndpointProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, SageMakerUpdateEndpoint.SUPPORTED_INTEGRATION_PATTERNS);
    this.taskPolicies = this.makePolicyStatements();
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('sagemaker', 'updateEndpoint', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject(this.renderParameters()),
    };
  }

  private renderParameters(): { [key: string]: any } {
    return {
      EndpointConfigName: this.props.endpointConfigName,
      EndpointName: this.props.endpointName,
    };
  }

  private makePolicyStatements(): iam.PolicyStatement[] {
    const stack = cdk.Stack.of(this);
    // https://docs.aws.amazon.com/sagemaker/latest/dg/api-permissions-reference.html
    return [
      new iam.PolicyStatement({
        actions: ['sagemaker:updateEndpoint'],
        resources: [
          stack.formatArn({
            service: 'sagemaker',
            resource: 'endpoint',
            // If the endpoint name comes from input, we cannot target the policy to a particular ARN prefix reliably.
            // SageMaker uses lowercase for resource name in the arn
            resourceName: sfn.JsonPath.isEncodedJsonPath(this.props.endpointName) ? '*' : `${this.props.endpointName.toLowerCase()}`,
          }),
        ],
      }),
    ];
  }
}