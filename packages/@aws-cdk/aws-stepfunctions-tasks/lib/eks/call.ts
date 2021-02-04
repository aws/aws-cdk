import * as eks from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for calling a EKS endpoint with EksCall
 * @experimental
 */
export interface EksCallProps extends sfn.TaskStateBaseProps {

  /**
   * The EKS cluster
   */
  readonly cluster: eks.ICluster;

  /**
   * HTTP method ("GET", "POST", "PUT", ...) part of HTTP request
   */
  readonly httpMethod: HttpMethods;

  /**
   * HTTP path of the Kubernetes REST API operation
   */
  readonly httpPath: string;

  /**
   * Query Parameters part of HTTP request
   * @default - no query parameters
   */
  readonly queryParameters?: { [key: string]: string[] };

  /**
   * Request body part of HTTP request
   * @default - No request body
   */
  readonly requestBody?: { [key: string]: any };
}

/**
 * Call a EKS endpoint as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-eks.html
 * @experimental
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
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('eks', 'call', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        ClusterName: this.props.cluster.clusterName,
        CertificateAuthority: this.props.cluster.clusterCertificateAuthorityData,
        Endpoint: this.props.cluster.clusterEndpoint,
        Method: this.props.httpMethod,
        Path: this.props.httpPath,
        QueryParameters: this.props.queryParameters,
        RequestBody: this.props.requestBody,
      }),
    };
  }
}

/**
 * Method type of a EKS call
 */
export enum HttpMethods {
  /**
   * Retrieve data from a server at the specified resource
   */
  GET = 'GET',

  /**
   * Send data to the API endpoint to create or update a resource
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
   * Retrieve data from a server at the specified resource without the response body
   */
  HEAD = 'HEAD'
}