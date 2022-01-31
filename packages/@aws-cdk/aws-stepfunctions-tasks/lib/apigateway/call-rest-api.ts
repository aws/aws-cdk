import * as apigateway from '@aws-cdk/aws-apigateway';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CallApiGatewayEndpointBase } from './base';
import { CallApiGatewayEndpointBaseProps } from './base-types';

/**
 * Properties for calling an REST API Endpoint
 */
export interface CallApiGatewayRestApiEndpointProps extends CallApiGatewayEndpointBaseProps {
  /**
   * API to call
   */
  readonly api: apigateway.IRestApi;

  /**
   * Name of the stage where the API is deployed to in API Gateway
   */
  readonly stageName: string;
}

/**
 * Call REST API endpoint as a Task
 *
 * Be aware that the header values must be arrays. When passing the Task Token
 * in the headers field `WAIT_FOR_TASK_TOKEN` integration, use
 * `JsonPath.array()` to wrap the token in an array:
 *
 * ```ts
 * import * as apigateway from '@aws-cdk/aws-apigateway';
 * declare const api: apigateway.RestApi;
 *
 * new tasks.CallApiGatewayRestApiEndpoint(this, 'Endpoint', {
 *   api,
 *   stageName: 'Stage',
 *   method: tasks.HttpMethod.PUT,
 *   integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
 *   headers: sfn.TaskInput.fromObject({
 *     TaskToken: sfn.JsonPath.array(sfn.JsonPath.taskToken),
 *   }),
 * });
 * ```
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-api-gateway.html
 */
export class CallApiGatewayRestApiEndpoint extends CallApiGatewayEndpointBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig | undefined;
  protected readonly taskPolicies?: iam.PolicyStatement[] | undefined;

  protected readonly apiEndpoint: string;
  protected readonly arnForExecuteApi: string;
  protected readonly stageName?: string;

  constructor(scope: Construct, id: string, private readonly props: CallApiGatewayRestApiEndpointProps) {
    super(scope, id, props);

    this.apiEndpoint = this.getApiEndpoint();
    this.arnForExecuteApi = props.api.arnForExecuteApi(props.method, props.apiPath, props.stageName);
    this.stageName = props.stageName;

    this.taskPolicies = this.createPolicyStatements();
  }

  private getApiEndpoint(): string {
    const apiStack = cdk.Stack.of(this.props.api);
    return `${this.props.api.restApiId}.execute-api.${apiStack.region}.${apiStack.urlSuffix}`;
  }
}
