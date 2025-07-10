import { Construct } from 'constructs';
import * as eks from '../../../aws-eks';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { ValidationError } from '../../../core';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

interface EksCallOptions {
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
   * For example: /api/v1/namespaces/default/pods
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
  readonly requestBody?: sfn.TaskInput;
}

/**
 * Properties for calling a EKS endpoint with EksCall using JSONPath
 */
export interface EksCallJsonPathProps extends sfn.TaskStateJsonPathBaseProps, EksCallOptions { }

/**
 * Properties for calling a EKS endpoint with EksCall using JSONata
 */
export interface EksCallJsonataProps extends sfn.TaskStateJsonataBaseProps, EksCallOptions { }

/**
 * Properties for calling a EKS endpoint with EksCall
 */
export interface EksCallProps extends sfn.TaskStateBaseProps, EksCallOptions { }

/**
 * Call a EKS endpoint as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-eks.html
 */
export class EksCall extends sfn.TaskStateBase {
  /**
   * Call a EKS endpoint as a Task that using JSONPath
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-eks.html
   */
  public static jsonPath(scope: Construct, id: string, props: EksCallJsonPathProps) {
    return new EksCall(scope, id, props);
  }

  /**
   * Call a EKS endpoint as a Task that using JSONata
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-eks.html
   */
  public static jsonata(scope: Construct, id: string, props: EksCallJsonataProps) {
    return new EksCall(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
  ];

  /** No policies are required due to eks:call is an Http service integration and does not call and EKS API directly
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-eks.html#connect-eks-permissions
   */
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  private readonly clusterEndpoint: string;
  private readonly clusterCertificateAuthorityData: string;

  constructor(scope: Construct, id: string, private readonly props: EksCallProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, EksCall.SUPPORTED_INTEGRATION_PATTERNS);

    try {
      this.clusterEndpoint = this.props.cluster.clusterEndpoint;
    } catch {
      throw new ValidationError('The "clusterEndpoint" property must be specified when using an imported Cluster.', this);
    }

    try {
      this.clusterCertificateAuthorityData = this.props.cluster.clusterCertificateAuthorityData;
    } catch {
      throw new ValidationError('The "clusterCertificateAuthorityData" property must be specified when using an imported Cluster.', this);
    }
  }

  /**
   * Provides the EKS Call service integration task configuration
   * @internal
   */
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    return {
      Resource: integrationResourceArn('eks', 'call', this.integrationPattern),
      ...this._renderParametersOrArguments({
        ClusterName: this.props.cluster.clusterName,
        CertificateAuthority: this.clusterCertificateAuthorityData,
        Endpoint: this.clusterEndpoint,
        Method: this.props.httpMethod,
        Path: this.props.httpPath,
        QueryParameters: this.props.queryParameters,
        RequestBody: this.props.requestBody?.value,
      }, queryLanguage),
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
  HEAD = 'HEAD',
}
