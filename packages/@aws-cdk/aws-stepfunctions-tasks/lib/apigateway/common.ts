import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/** Http Methods that API Gateway supports */
export enum HttpMethod {
  /** Retreive data from a server at the specified resource */
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
 */
export enum AuthType {
  /** Call the API direclty with no authorization method */
  NO_AUTH = 'NO_AUTH',

  /** * Use the IAM role associated with the current state machine for authorization */
  IAM_ROLE = 'IAM_ROLE',

  /** Use the resource policy of the API for authorization */
  RESOURCE_POLICY = 'RESOURCE_POLICY',
}

/**
 * Base ApiGateway Invoke Task Props
 */
export interface BaseInvokeApiGatewayApiProps extends sfn.TaskStateBaseProps {
  /**
   * Http method for the API
   */
  readonly method: HttpMethod;

  /**
   * HTTP request information that does not relate to contents of the request
   * @default - No headers
   */
  readonly headers?: sfn.TaskInput;


  /**
   * Path parameters appended after API endpoint
   * @default - No path
   */
  readonly path?: string;

  /**
   * Query strings attatched to end of request
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
   * @default AuthType.NO_AUTH
   */
  readonly authType?: AuthType;
}

/**
 * Base ApiGateway Invoke Task
 */
export abstract class BaseInvokeApiGatewayApi extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  private readonly baseProps: BaseInvokeApiGatewayApiProps;
  private readonly integrationPattern: sfn.IntegrationPattern;

  protected abstract readonly apiEndpoint: string;
  protected abstract readonly arnForExecuteApi: string;
  protected abstract readonly stageName?: string;

  constructor(scope: Construct, id: string, props: BaseInvokeApiGatewayApiProps) {
    super(scope, id, props);

    this.baseProps = props;
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, BaseInvokeApiGatewayApi.SUPPORTED_INTEGRATION_PATTERNS);
  }

  /**
   * @internal
   */
  protected _renderTask() {
    return {
      Resource: integrationResourceArn('apigateway', 'invoke', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        ApiEndpoint: this.apiEndpoint,
        Method: this.baseProps.method,
        Headers: this.baseProps.headers?.value,
        Stage: this.stageName,
        Path: this.baseProps.path,
        QueryParameters: this.baseProps.queryParameters?.value,
        RequestBody: this.baseProps.requestBody?.value,
        AuthType: this.baseProps.authType ? this.baseProps.authType : 'NO_AUTH',
      }),
    };
  }

  protected createPolicyStatements(): iam.PolicyStatement[] {
    if (this.baseProps.authType === AuthType.IAM_ROLE) {
      return [
        new iam.PolicyStatement({
          resources: [this.arnForExecuteApi],
          actions: ['ExecuteAPI:Invoke'],
        }),
      ];
    } else if (this.baseProps.authType === AuthType.RESOURCE_POLICY) {
      if (!sfn.FieldUtils.containsTaskToken(this.baseProps.headers)) {
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
