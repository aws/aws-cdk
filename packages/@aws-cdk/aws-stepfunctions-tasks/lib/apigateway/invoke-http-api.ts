import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BaseInvokeApiGatewayApi, BaseInvokeApiGatewayApiProps } from './common';

/**
 * Properties for invoking an HTTP API Endpoint
 */
export interface InvokeApiGatewayHttpApiProps extends BaseInvokeApiGatewayApiProps {
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
 * Invoke HTTP API endpoint as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-api-gateway.html
 */
export class InvokeApiGatewayHttpApi extends BaseInvokeApiGatewayApi {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig | undefined;
  protected readonly taskPolicies?: iam.PolicyStatement[] | undefined;

  protected readonly apiEndpoint: string;
  protected readonly arnForExecuteApi: string;
  protected readonly stageName?: string;

  constructor(scope: Construct, id: string, private readonly props: InvokeApiGatewayHttpApiProps) {
    super(scope, id, props);

    this.apiEndpoint = this.getApiEndpoint();
    this.arnForExecuteApi = this.getArnForExecuteApi();

    this.taskPolicies = this.createPolicyStatements();
  }

  private getApiEndpoint(): string {
    const apiStack = cdk.Stack.of(this.props.api);
    return `${this.props.api.httpApiId}.execute-api.${apiStack.region}.${apiStack.urlSuffix}`;
  }

  private getArnForExecuteApi(): string {
    const { api, stageName, method, path } = this.props;

    return cdk.Stack.of(api).formatArn({
      service: 'execute-api',
      resource: api.httpApiId,
      sep: '/',
      resourceName: `${stageName}/${method}${path}`,
    });
  }
}
