import { Construct } from 'constructs';
import { CallApiGatewayEndpointBase } from './base';
import { CallApiGatewayEndpointBaseProps, CallApiGatewayEndpointJsonataBaseProps, CallApiGatewayEndpointJsonPathBaseProps } from './base-types';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';

/**
 * Base properties for calling an HTTP API Endpoint
 */
export interface CallApiGatewayHttpApiEndpointOptions {
  /**
   * The Id of the API to call
   */
  readonly apiId: string;

  /**
   * The Stack in which the API is defined
   */
  readonly apiStack: cdk.Stack;

  /**
   * Name of the stage where the API is deployed to in API Gateway
   * @default '$default'
   */
  readonly stageName?: string;
}

/**
 * Properties for calling an HTTP API Endpoint using JSONPath
 */
export interface CallApiGatewayHttpApiEndpointJsonPathProps extends CallApiGatewayEndpointJsonPathBaseProps, CallApiGatewayHttpApiEndpointOptions {}

/**
 * Properties for calling an HTTP API Endpoint using JSONata
 */
export interface CallApiGatewayHttpApiEndpointJsonataProps extends CallApiGatewayEndpointJsonataBaseProps, CallApiGatewayHttpApiEndpointOptions {}

/**
 * Properties for calling an HTTP API Endpoint
 */
export interface CallApiGatewayHttpApiEndpointProps extends CallApiGatewayEndpointBaseProps, CallApiGatewayHttpApiEndpointOptions {}

/**
 * Call HTTP API endpoint as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-api-gateway.html
 */
export class CallApiGatewayHttpApiEndpoint extends CallApiGatewayEndpointBase {
  /**
   * Call HTTP API endpoint as a Task using JSONPath
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-api-gateway.html
   */
  public static jsonPath(scope: Construct, id: string, props: CallApiGatewayHttpApiEndpointJsonPathProps) {
    return new CallApiGatewayHttpApiEndpoint(scope, id, props);
  }
  /**
   * Call HTTP API endpoint as a Task using JSONata
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-api-gateway.html
   */
  public static jsonata(scope: Construct, id: string, props: CallApiGatewayHttpApiEndpointJsonataProps) {
    return new CallApiGatewayHttpApiEndpoint(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }
  protected readonly taskMetrics?: sfn.TaskMetricsConfig | undefined;
  protected readonly taskPolicies?: iam.PolicyStatement[] | undefined;

  protected readonly apiEndpoint: string;
  protected readonly arnForExecuteApi: string;
  protected readonly stageName?: string;

  constructor(scope: Construct, id: string, private readonly props: CallApiGatewayHttpApiEndpointProps) {
    super(scope, id, props);

    this.apiEndpoint = this.getApiEndpoint();
    this.arnForExecuteApi = this.getArnForExecuteApi();
    this.stageName = props.stageName;

    this.taskPolicies = this.createPolicyStatements();
  }

  private getApiEndpoint(): string {
    const apiStack = this.props.apiStack;
    return `${this.props.apiId}.execute-api.${apiStack.region}.${apiStack.urlSuffix}`;
  }

  private getArnForExecuteApi(): string {
    const { apiId, stageName, method, apiPath } = this.props;

    return this.props.apiStack.formatArn({
      service: 'execute-api',
      resource: apiId,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
      resourceName: `${stageName}/${method}${apiPath}`,
    });
  }
}
