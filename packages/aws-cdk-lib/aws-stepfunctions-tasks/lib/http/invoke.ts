import { Construct } from 'constructs';
import * as events from '../../../aws-events';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { integrationResourceArn } from '../private/task-utils';

/**
 * The style used when applying URL encoding to array values.
 *
 */
export enum ArrayEncodingFormat {
  /**
   * Encode arrays using brackets. For example, {"array": ["a","b","c"]} encodes to "array[]=a&array[]=b&array[]=c"
   */
  BRACKETS = 'BRACKETS',
  /**
   * Encode arrays using commas. For example, {"array": ["a","b","c"]} encodes to "array=a,b,c,d"
   */
  COMMAS = 'COMMAS',
  /**
   * Encode arrays using the index value. For example, {"array": ["a","b","c"]} encodes to "array[0]=a&array[1]=b&array[2]=c"
   */
  INDICES = 'INDICES',
  /**
   * Repeat key for each item in the array. For example, {"array": ["a","b","c"]} encodes to "array[]=a&array[]=b&array[]=c"
   */
  REPEAT = 'REPEAT',
}

/**
 * Properties for calling an external HTTP endpoint with HttpInvoke.
 */
export interface HttpInvokeProps extends sfn.TaskStateBaseProps {
  /**
   * Permissions are granted to call all resources under this path.
   * @example "https://api.example.com"
   *
   */
  readonly apiRoot: string;

  /**
   * The API endpoint to call, relative to `apiRoot`.
   * @example sfn.TaskInput.fromText("path/to/resource")
   *
   */
  readonly apiEndpoint: sfn.TaskInput;

  /**
   * The HTTP method to use.
   * @example sfn.TaskInput.fromText("GET")
   *
   */
  readonly method: sfn.TaskInput;

  /**
   * The EventBridge Connection to use for authentication.
   *
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
   * @default - No additional headers are added to the request.
   * @example sfn.TaskInput.fromObject({ 'Content-Type': 'application/json' })
   */
  readonly headers?: sfn.TaskInput;

  /**
   * The query string parameters to send to the HTTP endpoint.
   *
   * @default - No query string parameters are sent in the request.
   */
  readonly queryStringParameters?: sfn.TaskInput;

  /**
   * When `true`, the HTTP request body is the URL-encoded form data of the `RequestBody` field.
   * When `false` (default), the HTTP request body is the JSON-serialized `RequestBody` field.
   * If set to `true`, also sets 'content-type' header to 'application/x-www-form-urlencoded'.
   *
   * @default - No encoding.
   */
  readonly urlEncodeBody?: boolean;

  /**
   * The format of the array encoding.
   * Only used if `urlEncodeBody` is `true`.
   *
   * @default - ArrayEncodingFormat.INDICES
   */
  readonly arrayEncodingFormat?: ArrayEncodingFormat;
}

/**
 * A Step Functions Task to call a public third-party API.
 *
 */
export class HttpInvoke extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(
    scope: Construct,
    id: string,
    private readonly props: HttpInvokeProps,
  ) {
    super(scope, id, props);

    this.taskPolicies = this.buildTaskPolicyStatements();
  }

  /**
   * Provides the HTTP Invoke service integration task configuration.
  */
  /**
   * @internal
  */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('http', 'invoke'),
      Parameters: sfn.FieldUtils.renderObject(this.buildTaskParameters()),
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
            'states:HTTPEndpoint': `${this.props.apiRoot}*`,
          },
        },
      }),
    ];
  }

  private buildTaskParameters() {
    let headers: { [key: string]: string }| undefined = this.props.headers?.value;

    if (this.props.urlEncodeBody) {
      headers = { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' };
    }

    const urlEncodeTransform = {
      RequestBodyEncoding: 'URL_ENCODED',
      RequestEncodingOptions: this.props.arrayEncodingFormat == null ? undefined : {
        ArrayFormat: this.props.arrayEncodingFormat,
      },
    };

    return {
      ApiEndpoint: `${this.props.apiRoot}/${this.props.apiEndpoint.value}`,
      Authentication: {
        ConnectionArn: this.props.connection.connectionArn,
      },
      Method: this.props.method.value,
      Headers: headers,
      RequestBody: this.props.body?.value,
      QueryParameters: this.props.queryStringParameters?.value,
      Transform: this.props.urlEncodeBody ? urlEncodeTransform : undefined,
    };
  }
}
