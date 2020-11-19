import * as apigateway from '@aws-cdk/aws-apigateway';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for invoking an API Endpoint with ApiGatewayInvoke
 */
export interface ApiGatewayInvokeProps extends sfn.TaskStateBaseProps {

  /** API to call */
  readonly api: apigateway.IRestApi;

  /**
   * hostname of an API Gateway URL
   * @example {ApiId}.execute-api.{region}.amazonaws.com
   */
  readonly apiEndpoint: string;

  /** Http method for the API */
  readonly method: HttpMethod;

  /**
   * HTTP request information that does not relate to contents of the request
   * @default - No headers
   * @example
   * Headers: {
   *   type: 1,
   *   value:{
   *     'TaskToken.$': 'States.Array($$.Task.Token)',
   *   }
   * },
   */
  readonly headers?: { [key: string]: any };

  /**
   * Name of the stage where the API is deployed to in API Gateway
   * @default - Required for REST and $default for HTTP
   */
  readonly stageName?: string;

  /**
   * Path parameters appended after API endpoint
   * @default - No path
   */
  readonly path?: string;

  /**
   * Query strings attatched to end of request
   * @default - No query parameters
   * @example
   * "QueryParameters": {
   *   "billId": ["123", "456"]
   * },
   */
  readonly queryParameters?: { [key: string]: any };

  /**
   * HTTP Request body
   * @default - No requestBody
   * @example
   * "RequestBody": {
   *   "billId": ["my-new-bill"]
   * },
   */
  readonly requestBody?: sfn.TaskInput;

  /**
   * Authentication methods
   * @default - NO_AUTH
   */
  readonly authType?: AuthType;

}

/**
 * Invoke an API endpoint as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-api-gateway.html
 */
export class ApiGatewayInvoke extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];
  protected readonly apiEndpoint: string;

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: ApiGatewayInvokeProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, ApiGatewayInvoke.SUPPORTED_INTEGRATION_PATTERNS);

    this.taskPolicies = this.createPolicyStatements();
    this.apiEndpoint = this.createApiEndpoint();
  }

  /**
   * Provides the API Gateway Invoke service integration task configuration
   */
  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('apigateway', 'invoke', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        ApiEndpoint: this.apiEndpoint,
        Method: this.props.method,
        Headers: this.props.headers,
        Stage: this.props.stageName,
        Path: this.props.path,
        QueryParameters: this.props.queryParameters,
        RequestBody: this.props.requestBody,
        AuthType: this.props.authType ? this.props.authType : 'NO_AUTH',
      }),
    };
  }

  /**
   * Gets the "execute-api" ARN
   * @returns The "execute-api" ARN.
   * @default "*" returns the execute API ARN for all methods/resources in
   * this API.
   * @param method The method (default `*`)
   * @param path The resource path. Must start with '/' (default `*`)
   * @param stage The stage (default `*`)
   */
  get arnForExecuteApi() {
    return this.props.api.arnForExecuteApi(this.props.method, this.props.path, this.props.stageName);
  }

  /**
   * Generates the api endpoint
   * @returns The api id
   * @example {ApiId}.execute-api.{region}.amazonaws.com
   */
  private createApiEndpoint(): string {
    const apiStack = cdk.Stack.of(this.props.api);
    return `${this.props.api.restApiId}.execute-api.${apiStack.region}.${apiStack.urlSuffix}`;
  }

  /**
   * This generates the PolicyStatements required by the Task to call invoke.
   */
  private createPolicyStatements(): iam.PolicyStatement[] {
    if (this.props.authType === AuthType.IAM_ROLE) {
      return [
        new iam.PolicyStatement({
          resources: [this.arnForExecuteApi],
          actions: ['ExecuteAPI:Invoke'],
        }),
      ];
    } else if (this.props.authType === AuthType.RESOURCE_POLICY) {
      if (!sfn.FieldUtils.containsTaskToken(this.props.headers)) {
        throw new Error('Task Token is required in `headers` Use JsonPath.taskToken to set the token.');
      }
      return [
        new iam.PolicyStatement({
          resources: [this.arnForExecuteApi],
          actions: ['ExecuteAPI:Invoke'],
          conditions: {
            StringEquals: {
              'aws:SourceArn': '*',
            },
          },
        }),
      ];
    }
    return [];
  }
}

/**
 * Http Methods that API Gateway supports
 */
export enum HttpMethod {
  /**
   * Retreive data from a server at the specified resource
   */
  GET = 'GET',

  /** Send data to the API endpoint to create or udpate a resource */
  POST = 'POST',

  /** Send data to the API endpoint to update or create a resource */
  PUT = 'PUT',

  /** Delete the resource at the specified endpoint */
  DELETE = 'DELETE',

  /** Apply partial modifications to the resource */
  PATCH = 'PATCH',

  /** Retreive data from a server at the specified resource without the response body */
  HEAD = 'HEAD',

  /** Return data describing what other methods and operations the server supports */
  OPTIONS = 'OPTIONS'
}

/**
 * The authentication method used to call the endpoint
 * @default NO_AUTH
 */
export enum AuthType {
  /** Call the API direclty with no authorization method */
  NO_AUTH = 'NO_AUTH',

  /** * Use the IAM role associated with the current state machine for authorization */
  IAM_ROLE = 'IAM_ROLE',

  /** Use the resource policy of the API for authorization */
  RESOURCE_POLICY = 'RESOURCE_POLICY',
}
