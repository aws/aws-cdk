
import { Construct } from 'constructs';
import * as events from '../../../aws-events';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { FeatureFlags } from '../../../core';
import * as cxapi from '../../../cx-api';
import { integrationResourceArn, isJsonataExpression } from '../private/task-utils';

/**
 * The style used when applying URL encoding to array values.
 */
export enum URLEncodingFormat {
  /**
   * Encode arrays using brackets. For example, {'array': ['a','b','c']} encodes to 'array[]=a&array[]=b&array[]=c'
   */
  BRACKETS = 'BRACKETS',
  /**
   * Encode arrays using commas. For example, {'array': ['a','b','c']} encodes to 'array=a,b,c,d'
   */
  COMMAS = 'COMMAS',
  /**
   * Apply the default URL encoding style (INDICES).
   */
  DEFAULT = 'DEFAULT',
  /**
   * Encode arrays using the index value. For example, {'array': ['a','b','c']} encodes to 'array[0]=a&array[1]=b&array[2]=c'
   */
  INDICES = 'INDICES',
  /**
   * Do not apply URL encoding.
   */
  NONE = 'NONE',
  /**
   * Repeat key for each item in the array. For example, {'array': ['a','b','c']} encodes to 'array[]=a&array[]=b&array[]=c'
   */
  REPEAT = 'REPEAT',
}

/**
 * The StepFunctions parameters for the http:invoke task.
 */
interface TaskParameters {
  ApiEndpoint: string;
  Authentication: {
    ConnectionArn: string;
  };
  Method: string;
  Headers?: { [key: string]: string };
  RequestBody?: string;
  QueryParameters?: { [key: string]: string };
  Transform?: {
    RequestBodyEncoding: string;
    RequestEncodingOptions?: {
      ArrayFormat: string;
    };
  };
}

interface HttpInvokeOptions {
  /**
   * Permissions are granted to call all resources under this path.
   *
   * @example 'https://api.example.com'
   */
  readonly apiRoot: string;

  /**
   * The API endpoint to call, relative to `apiRoot`.
   * @example sfn.TaskInput.fromText('path/to/resource')
   */
  readonly apiEndpoint: sfn.TaskInput;

  /**
   * The HTTP method to use.
   *
   * @example sfn.TaskInput.fromText('GET')
   */
  readonly method: sfn.TaskInput;

  /**
   * The EventBridge Connection to use for authentication.
   */
  readonly connection: events.IConnection;

  /**
   * The body to send to the HTTP endpoint.
   *
   * @default - No body is sent with the request.
   */
  readonly body?: sfn.TaskInput;

  /**
   * The headers to send to the HTTP endpoint.
   *
   * @example sfn.TaskInput.fromObject({ 'Content-Type': 'application/json' })
   *
   * @default - No additional headers are added to the request.
   */
  readonly headers?: sfn.TaskInput;

  /**
   * The query string parameters to send to the HTTP endpoint.
   * @default - No query string parameters are sent in the request.
   */
  readonly queryStringParameters?: sfn.TaskInput;

  /**
   * Determines whether to apply URL encoding to the request body, and which array encoding format to use.
   *
   * `URLEncodingFormat.NONE` passes the JSON-serialized `RequestBody` field as the HTTP request body.
   * Otherwise, the HTTP request body is the URL-encoded form data of the `RequestBody` field using the
   * specified array encoding format, and the `Content-Type` header is set to `application/x-www-form-urlencoded`.
   *
   * @default - URLEncodingFormat.NONE
   */
  readonly urlEncodingFormat?: URLEncodingFormat;
}

/**
 * Properties for calling an external HTTP endpoint with HttpInvoke using JSONPath.
 */
export interface HttpInvokeJsonPathProps extends sfn.TaskStateJsonPathBaseProps, HttpInvokeOptions { }

/**
 * Properties for calling an external HTTP endpoint with HttpInvoke using JSONata.
 */
export interface HttpInvokeJsonataProps extends sfn.TaskStateJsonataBaseProps, HttpInvokeOptions { }

/**
 * Properties for calling an external HTTP endpoint with HttpInvoke.
 */
export interface HttpInvokeProps extends sfn.TaskStateBaseProps, HttpInvokeOptions { }

/**
 * A Step Functions Task to call a public third-party API.
 */
export class HttpInvoke extends sfn.TaskStateBase {
  /**
   * A Step Functions Task to call a public third-party API using JSONPath.
   */
  public static jsonPath(scope: Construct, id: string, props: HttpInvokeJsonPathProps) {
    return new HttpInvoke(scope, id, props);
  }

  /**
   * A Step Functions Task to call a public third-party API using JSONata.
   */
  public static jsonata(scope: Construct, id: string, props: HttpInvokeJsonataProps) {
    return new HttpInvoke(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(scope: Construct, id: string, private readonly props: HttpInvokeProps) {
    super(scope, id, props);

    this.taskPolicies = this.buildTaskPolicyStatements();
  }

  /**
   * Provides the HTTP Invoke service integration task configuration.
   *
   * @internal
   */
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    return {
      Resource: integrationResourceArn('http', 'invoke'),
      ...this._renderParametersOrArguments(this.buildTaskParameters(), queryLanguage),
    };
  }

  protected buildTaskPolicyStatements(): iam.PolicyStatement[] {
    return [
      new iam.PolicyStatement({
        actions: ['events:RetrieveConnectionCredentials'],
        resources: [this.props.connection.connectionArn],
      }),
      new iam.PolicyStatement({
        actions: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
        resources: [this.props.connection.connectionSecretArn],
      }),
      new iam.PolicyStatement({
        actions: ['states:InvokeHTTPEndpoint'],
        resources: ['*'],
        conditions: {
          StringLike: {
            'states:HTTPEndpoint': `${isJsonataExpression(this.props.apiRoot) ? '' : this.props.apiRoot}*`,
          },
        },
      }),
    ];
  }

  private buildTaskParameters() {
    const unJsonata = (v: string) => v.replace(/^{%/, '').replace(/%}$/, '').trim();
    const useJsonata = this.queryLanguage === sfn.QueryLanguage.JSONATA;
    const getStringValue = (v: string) => useJsonata && !isJsonataExpression(v) ? `'${v}'` : unJsonata(v);
    const apiEndpoint = useJsonata ?
      `{% ${getStringValue(this.props.apiRoot)} & '/' & ${getStringValue(this.props.apiEndpoint.value)} %}`
      : FeatureFlags.of(this).isEnabled(cxapi.STEPFUNCTIONS_TASKS_HTTPINVOKE_DYNAMIC_JSONPATH_ENDPOINT) ?
        sfn.JsonPath.format('{}/{}', this.props.apiRoot, this.props.apiEndpoint.value)
        : `${this.props.apiRoot}/${this.props.apiEndpoint.value}`;

    const parameters: TaskParameters = {
      ApiEndpoint: apiEndpoint,
      Authentication: {
        ConnectionArn: this.props.connection.connectionArn,
      },
      Method: this.props.method.value,
      Headers: this.props.headers?.value,
      RequestBody: this.props.body?.value,
      QueryParameters: this.props.queryStringParameters?.value,
    };

    if (this.props.urlEncodingFormat != null && this.props.urlEncodingFormat !== URLEncodingFormat.NONE) {
      parameters.Headers = { ...parameters.Headers, 'Content-Type': 'application/x-www-form-urlencoded' };
      parameters.Transform = {
        RequestBodyEncoding: 'URL_ENCODED',
      };

      if (this.props.urlEncodingFormat !== URLEncodingFormat.DEFAULT) {
        parameters.Transform.RequestEncodingOptions = {
          ArrayFormat: this.props.urlEncodingFormat,
        };
      }
    }

    return parameters;
  }
}
