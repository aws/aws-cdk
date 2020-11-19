import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for invoking an API Endpoint with ApiGatewayInvoke
 */
export interface ApiGatewayInvokeProps extends sfn.TaskStateBaseProps {

  /**
   * hostname of an API Gateway URL
   * @example {ApiId}.execute-api.{region}.amazonaws.com
   */
  readonly apiEndpoint: string;

  /**
   * Http method for the API
   */
  readonly method: HttpMethod;

  /**
   * HTTP headers string to list of strings
   * @default - No headers
   */
  readonly headers?: sfn.TaskInput;

  /**
   * Name of the stage where the API is deployed to in API Gateway
   * @default - Required for REST and $default for HTTP
   */
  readonly stage?: string;

  /**
   * Path parameters appended after API endpoint
   * @default - No path
   */
  readonly path?: string;

  /**
   * Query strings string to list of strings
   * @default - No query parameters
   */
  readonly queryParameters?: sfn.TaskInput;

  /**
   * HTTP Request body
   * @default - No requestBody
   */
  readonly requestBody?: sfn.TaskInput;
  /**
   * Authentication methods
   *
   * NO_AUTH: call the API direclty with no authorization method
   *
   * IAM_ROLE: Use the IAM role associated with the current state machine for authorization
   *
   * RESOURCE_POLICY: Use the resource policy of the API for authorization
   *
   * @default - NO_AUTH
   */
  readonly authType?: sfn.TaskInput;

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

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: ApiGatewayInvokeProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, ApiGatewayInvoke.SUPPORTED_INTEGRATION_PATTERNS);
    const authType = this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value;
    if (authType === 'IAM_ROLE') {
      const resource = props.apiEndpoint.split('.', 1)[0] + '/' + (props.stage ? props.stage + '/' : '$default/') + props.method + '/' + (props.path ?? '');

      this.taskPolicies = [
        new iam.PolicyStatement({
          resources: [
            Stack.of(this).formatArn({
              service: 'execute-api',
              resource: resource,
            }),
          ],
          actions: ['execute-api:Invoke'],
        }),
      ];
    } else if (authType === 'RESOURCE_POLICY') {
      if (!sfn.FieldUtils.containsTaskToken(props.headers)) {
        throw new Error('Task Token is required in `headers` Use JsonPath.taskToken to set the token.');
      }
      const resource = props.apiEndpoint.split('.', 1)[0] + '/' + (props.stage ? props.stage + '/' : '') + props.method + '/' + (props.path ? props.path + '/*' : '*');

      this.taskPolicies = [
        new iam.PolicyStatement({
          resources: [
            Stack.of(this).formatArn({
              service: 'execute-api',
              resource: resource,
            }),
          ],
          actions: ['execute-api:Invoke'],
          conditions: {
            StringEquals: {
              'aws:SourceArn': '*',
            },
          },
        }),
      ];
    }
  }

  /**
   * Provides the API Gateway Invoke service integration task configuration
   */
  /**
   * @internal
   */
  protected _renderTask(): any {
    if (this.props.headers && this.props.queryParameters && this.props.requestBody) {
      return {
        Resource: integrationResourceArn('apigateway', 'invoke', this.integrationPattern),
        Parameters: sfn.FieldUtils.renderObject({
          ApiEndpoint: this.props.apiEndpoint,
          Method: this.props.method,
          Headers: this.props.headers ? this.props.headers.value : sfn.TaskInput.fromDataAt('$.Headers').value,
          Stage: this.props.stage,
          Path: this.props.path,
          QueryParameters: this.props.queryParameters ? this.props.queryParameters.value : sfn.TaskInput.fromDataAt('$.QueryParameters').value,
          RequestBody: this.props.requestBody ? this.props.requestBody.value : sfn.TaskInput.fromDataAt('$.RequestBody').value,
          AuthType: (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) === '$' ? (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) : 'NO_AUTH',
        }),
      };
    } else if (this.props.headers && this.props.queryParameters) {
      return {
        Resource: integrationResourceArn('apigateway', 'invoke', this.integrationPattern),
        Parameters: sfn.FieldUtils.renderObject({
          ApiEndpoint: this.props.apiEndpoint,
          Method: this.props.method,
          Headers: this.props.headers ? this.props.headers.value : sfn.TaskInput.fromDataAt('$.Headers').value,
          Stage: this.props.stage,
          Path: this.props.path,
          QueryParameters: this.props.queryParameters ? this.props.queryParameters.value : sfn.TaskInput.fromDataAt('$.QueryParameters').value,
          AuthType: (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) === '$' ? (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) : 'NO_AUTH',
        }),
      };
    } else if (this.props.queryParameters && this.props.requestBody) {
      return {
        Resource: integrationResourceArn('apigateway', 'invoke', this.integrationPattern),
        Parameters: sfn.FieldUtils.renderObject({
          ApiEndpoint: this.props.apiEndpoint,
          Method: this.props.method,
          Stage: this.props.stage,
          Path: this.props.path,
          QueryParameters: this.props.queryParameters ? this.props.queryParameters.value : sfn.TaskInput.fromDataAt('$.QueryParameters').value,
          RequestBody: this.props.requestBody ? this.props.requestBody.value : sfn.TaskInput.fromDataAt('$.RequestBody').value,
          AuthType: (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) === '$' ? (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) : 'NO_AUTH',
        }),
      };
    } else if (this.props.headers && this.props.requestBody) {
      return {
        Resource: integrationResourceArn('apigateway', 'invoke', this.integrationPattern),
        Parameters: sfn.FieldUtils.renderObject({
          ApiEndpoint: this.props.apiEndpoint,
          Method: this.props.method,
          Headers: this.props.headers ? this.props.headers.value : sfn.TaskInput.fromDataAt('$.Headers').value,
          Stage: this.props.stage,
          Path: this.props.path,
          RequestBody: this.props.requestBody ? this.props.requestBody.value : sfn.TaskInput.fromDataAt('$.RequestBody').value,
          AuthType: (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) === '$' ? (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) : 'NO_AUTH',
        }),
      };
    } else if (this.props.headers) {
      return {
        Resource: integrationResourceArn('apigateway', 'invoke', this.integrationPattern),
        Parameters: sfn.FieldUtils.renderObject({
          ApiEndpoint: this.props.apiEndpoint,
          Method: this.props.method,
          Headers: this.props.headers ? this.props.headers.value : sfn.TaskInput.fromDataAt('$.Headers').value,
          Stage: this.props.stage,
          Path: this.props.path,
          AuthType: (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) === '$' ? (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) : 'NO_AUTH',
        }),
      };
    } else if (this.props.queryParameters) {
      return {
        Resource: integrationResourceArn('apigateway', 'invoke', this.integrationPattern),
        Parameters: sfn.FieldUtils.renderObject({
          ApiEndpoint: this.props.apiEndpoint,
          Method: this.props.method,
          Stage: this.props.stage,
          Path: this.props.path,
          QueryParameters: this.props.queryParameters ? this.props.queryParameters.value : sfn.TaskInput.fromDataAt('$.QueryParameters').value,
          AuthType: (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) === '$' ? (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) : 'NO_AUTH',
        }),
      };
    } else if (this.props.requestBody) {
      return {
        Resource: integrationResourceArn('apigateway', 'invoke', this.integrationPattern),
        Parameters: sfn.FieldUtils.renderObject({
          ApiEndpoint: this.props.apiEndpoint,
          Method: this.props.method,
          Stage: this.props.stage,
          Path: this.props.path,
          RequestBody: this.props.requestBody ? this.props.requestBody.value : sfn.TaskInput.fromDataAt('$.RequestBody').value,
          AuthType: (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) === '$' ? (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) : 'NO_AUTH',
        }),
      };
    } else {
      return {
        Resource: integrationResourceArn('apigateway', 'invoke', this.integrationPattern),
        Parameters: sfn.FieldUtils.renderObject({
          ApiEndpoint: this.props.apiEndpoint,
          Method: this.props.method,
          Stage: this.props.stage,
          Path: this.props.path,
          AuthType: (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) === '$' ? (this.props.authType ? this.props.authType.value : sfn.TaskInput.fromDataAt('$.AuthType').value) : 'NO_AUTH',
        }),
      };
    }
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

  /**
   * Send data to the API endpoint to create or udpate a resource
   */
  POST = 'POST',

  /**
   * Send data to the API endpoint to update or create a resource
   */
  PUT = 'PUT',

  /**
   * Delete the resource at the specified endpoint
   */
  DELETE = 'DELETE',

  /**
   * Apply partial modifications to the resource
   */
  PATCH = 'PATCH',

  /**
   * Retreive data from a server at the specified resource without the response body
   */
  HEAD = 'HEAD',

  /**
   * Return data describing what other methods and operations the server supports
   */
  OPTIONS = 'OPTIONS'
}
