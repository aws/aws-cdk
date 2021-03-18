import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CallApiGatewayEndpointBase } from './base';
import { CallApiGatewayEndpointBaseProps } from './base-types';

/**
 * Properties for calling an HTTP API Endpoint
 */
export interface CallApiGatewayHttpApiEndpointProps extends CallApiGatewayEndpointBaseProps {
  /**
   * API to call
   */
  readonly api: apigatewayv2.IHttpApi;

  /**
   * Name of the stage where the API is deployed to in API Gateway
   * @default '$default'
   */
  readonly stageName?: string;
}

/**
 * Call HTTP API endpoint as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-api-gateway.html
 */
export class CallApiGatewayHttpApiEndpoint extends CallApiGatewayEndpointBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig | undefined;
  protected readonly taskPolicies?: iam.PolicyStatement[] | undefined;

  protected readonly apiEndpoint: string;
  protected readonly arnForExecuteApi: string;
  protected readonly stageName?: string;

  constructor(scope: Construct, id: string, private readonly props: CallApiGatewayHttpApiEndpointProps) {
    super(scope, id, props);

    this.apiEndpoint = this.getApiEndpoint();
    this.arnForExecuteApi = this.getArnForExecuteApi();

    this.taskPolicies = this.createPolicyStatements();
  }

  private getApiEndpoint(): string {
    const apiStack = cdk.Stack.of(this.props.api);
    return `${this.props.api.apiId}.execute-api.${apiStack.region}.${apiStack.urlSuffix}`;
  }

  private getArnForExecuteApi(): string {
    const { api, stageName, method, apiPath } = this.props;

    return cdk.Stack.of(api).formatArn({
      service: 'execute-api',
      resource: api.apiId,
      sep: '/',
      resourceName: `${stageName}/${method}${apiPath}`,
    });
  }
}
