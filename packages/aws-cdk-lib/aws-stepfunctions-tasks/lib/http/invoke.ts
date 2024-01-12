import { Construct } from 'constructs';
import { IConnection } from '../../../aws-events';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { integrationResourceArn } from '../private/task-utils';

export enum URLEncodingArrayFormat {
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
   * The API apiEndpoint to call.
   */
  readonly apiEndpoint: string;

  /**
   * The HTTP method to use.
   *
   */
  readonly method: string;

  /**
   * The EventBridge Connection to use for authentication.
   *
   */
  readonly connection: IConnection;

  /**
   * The body to send to the HTTP endpoint.
   *
   * @default - No body.
   */
  readonly body?: string;

  /**
   * The headers to send to the HTTP endpoint.
   *
   * @default - No headers.
   */
  readonly headers?: { [key: string]: string };

  /**
   * The query string parameters to send to the HTTP endpoint.
   *
   * @default - No query string parameters.
   */
  readonly queryStringParameters?: { [key: string]: string };

  /**
   * Whether to URL-encode the request body.
   * If set to true, also sets 'content-type' header to 'application/x-www-form-urlencoded'
   *
   * @default - No encoding.
   */
  readonly urlEncodeBody?: boolean;

  /**
   * The format of the array encoding if urlEncodeBody is set to true.
   *
   * @default - ArrayEncodingFormat.INDICES
   */
  readonly arrayEncodingFormat?: URLEncodingArrayFormat;
}

export class HttpInvoke extends sfn.TaskStateBase {
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  constructor(
    scope: Construct,
    id: string,
    private readonly props: HttpInvokeProps,
  ) {
    super(scope, id, props);

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['events:RetrieveConnectionCredentials'],
        resources: [props.connection.connectionArn],
      }),
      new iam.PolicyStatement({
        actions: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
        resources: [props.connection.connectionSecretArn],
      }),
      new iam.PolicyStatement({
        actions: ['states:InvokeHTTPEndpoint'],
        resources: ['*'],
        conditions: {
          StringLike: {
            'states:HTTPEndpoint': props.apiEndpoint,
          },
        },
      }),
    ];
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
      Parameters: sfn.FieldUtils.renderObject({
        Method: this.props.method,
        ApiEndpoint: this.props.apiEndpoint,
        Authentication: {
          ConnectionArn: this.props.connection.connectionArn,
        },
        RequestBody: this.props.body,
        Headers: this.props.headers,
        QueryParameters: this.props.queryStringParameters,
        Transform:
          this.props.urlEncodeBody != null
            ? {
              RequestBodyEncoding: 'URL_ENCODED',
              RequestEncodingOptions: {
                ArrayFormat:
                  this.props.arrayEncodingFormat ??
                  URLEncodingArrayFormat.INDICES,
              },
            }
            : undefined,
      }),
    };
  }
}
