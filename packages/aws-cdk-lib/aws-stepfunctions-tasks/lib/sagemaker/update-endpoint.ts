import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import { integrationResourceArn, isJsonPathOrJsonataExpression, validatePatternSupported } from '../private/task-utils';

interface SageMakerUpdateEndpointOptions {
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
 * Properties for updating Amazon SageMaker endpoint using JSONPath
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 */
export interface SageMakerUpdateEndpointJsonPathProps extends sfn.TaskStateJsonPathBaseProps, SageMakerUpdateEndpointOptions {}

/**
 * Properties for updating Amazon SageMaker endpoint using JSONata
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 */
export interface SageMakerUpdateEndpointJsonataProps extends sfn.TaskStateJsonataBaseProps, SageMakerUpdateEndpointOptions {}

/**
 * Properties for updating Amazon SageMaker endpoint
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 */
export interface SageMakerUpdateEndpointProps extends sfn.TaskStateBaseProps, SageMakerUpdateEndpointOptions {}

/**
 * A Step Functions Task to update a SageMaker endpoint
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
 */
export class SageMakerUpdateEndpoint extends sfn.TaskStateBase {
  /**
   * A Step Functions Task using JSONPath to update a SageMaker endpoint
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
   */
  public static jsonPath(scope: Construct, id: string, props: SageMakerUpdateEndpointJsonPathProps) {
    return new SageMakerUpdateEndpoint(scope, id, props);
  }

  /**
   * A Step Functions Task using JSONata to update a SageMaker endpoint
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-sagemaker.html
   */
  public static jsonata(scope: Construct, id: string, props: SageMakerUpdateEndpointJsonataProps) {
    return new SageMakerUpdateEndpoint(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }

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
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    return {
      Resource: integrationResourceArn('sagemaker', 'updateEndpoint', this.integrationPattern),
      ...this._renderParametersOrArguments(this.renderParameters(), queryLanguage),
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
            resourceName: isJsonPathOrJsonataExpression(this.props.endpointName) ? '*' : `${this.props.endpointName.toLowerCase()}`,
          }),
          stack.formatArn({
            service: 'sagemaker',
            resource: 'endpoint-config',
            // If the endpointConfig name comes from input, we cannot target the policy to a particular ARN prefix reliably.
            // SageMaker uses lowercase for resource name in the arn
            resourceName: isJsonPathOrJsonataExpression(this.props.endpointConfigName) ? '*' : `${this.props.endpointConfigName.toLowerCase()}`,
          }),
        ],
      }),
    ];
  }
}
