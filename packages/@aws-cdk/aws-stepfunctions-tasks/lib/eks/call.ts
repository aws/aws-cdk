import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/** Properties for calling a EKS endpoint with EksCall */
export interface EksCallProps extends sfn.TaskStateBaseProps {

  /** Name of the cluster */
  readonly clusterName: string;

  /** Base 64 encoded certificate data required to communicate with your cluster */
  readonly certificateAuthority: string;

  /** API endpoint to communicate with your cluster */
  readonly endpoint: string;

  /** The HTTP method ("GET", "POST", "PUT", ...) that clients use to call this method */
  readonly httpMethod: MethodType;

  /** Path of cluster */
  readonly path: string;

  /**
   * Path of cluster
   * @default - no query parameters
   */
  readonly queryParameters?: { [key: string]: string[] };

  /**
   * request body of the http method
   * @default - No request body
   */
  readonly requestBody?: { [key: string]: any };
}

/**
 * Call a EKS endpoint as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-eks.html
 */
export class EksCall extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: EksCallProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, EksCall.SUPPORTED_INTEGRATION_PATTERNS);
  }

  /**
   * Provides the EKS Call service integration task configuration
   */
  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('eks', 'call', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        ClusterName: this.props.clusterName,
        CertificateAuthority: this.props.certificateAuthority,
        Endpoint: this.props.endpoint,
        Method: this.props.httpMethod,
        Path: this.props.path,
        QueryParameters: this.props.queryParameters,
        RequestBody: this.props.requestBody,
      }),
    };
  }
}

/** Method type of a EKS call */
export enum MethodType {
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