import {
  HttpIntegrationType,
  HttpRouteIntegrationBindOptions,
  HttpRouteIntegrationConfig,
  HttpRouteIntegration,
  PayloadFormatVersion,
  ParameterMapping,
} from '../../../aws-apigatewayv2';
import { ServicePrincipal } from '../../../aws-iam';
import * as lambda from '../../../aws-lambda';
import { IFunction } from '../../../aws-lambda';
import { Duration, Names, Stack } from '../../../core';

// The maximum number of individual route-scoped lambda permissions to be added before they are
// consolidated into a single permission scoped to the API
const LAMBDA_PERMISSION_CONSOLIDATION_THRESHOLD = 10;

/**
 * Lambda Proxy integration properties
 */
export interface HttpLambdaIntegrationProps {
  /**
   * Version of the payload sent to the lambda handler.
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
   * @default PayloadFormatVersion.VERSION_2_0
   */
  readonly payloadFormatVersion?: PayloadFormatVersion;

  /**
   * Specifies how to transform HTTP requests before sending them to the backend
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-parameter-mapping.html
   * @default undefined requests are sent to the backend unmodified
   */
  readonly parameterMapping?: ParameterMapping;

  /**
   * The maximum amount of time an integration will run before it returns without a response.
   * Must be between 50 milliseconds and 29 seconds.
   *
   * @default Duration.seconds(29)
   */
  readonly timeout?: Duration;
}

/**
 * The Lambda Proxy integration resource for HTTP API
 */
export class HttpLambdaIntegration extends HttpRouteIntegration {
  private readonly _id: string;

  /**
   * @param id id of the underlying integration construct
   * @param handler the Lambda handler to integrate with
   * @param props properties to configure the integration
   */
  constructor(
    id: string,
    private readonly handler: IFunction,
    private readonly props: HttpLambdaIntegrationProps = {}) {
    super(id);
    this._id = id;
  }

  protected completeBind(options: HttpRouteIntegrationBindOptions) {
    const route = options.route;

    // Permission prefix is unique to the handler and the API
    const descPrefix = `${Names.nodeUniqueId(this.handler.node)}.${Names.nodeUniqueId(route.httpApi.node)}`;
    const desc = `${descPrefix}.${this._id}`;

    // Find any existing permissions for this handler and this API within the parent stack
    const stack = Stack.of(options.scope);
    const otherHandlerPermissions = stack.node.findAll()
      .filter(c => c instanceof lambda.CfnPermission &&
        c.node.id.startsWith(`ApiPermission.${descPrefix}.`));

    const consolidatedPermission = stack.node.findAll()
      .find(c => c instanceof lambda.CfnPermission && c.node.id.startsWith(`ApiPermission.Any.${descPrefix}`));

    if (otherHandlerPermissions.length >= LAMBDA_PERMISSION_CONSOLIDATION_THRESHOLD) {
      // If there are too many existing permissions, remove them in favour of a single permission scoped to the API
      otherHandlerPermissions.forEach(permission => permission.node.scope?.node?.tryRemoveChild?.(permission.node.id));
      this.handler.addPermission(`ApiPermission.Any.${descPrefix}`, {
        scope: options.scope,
        principal: new ServicePrincipal('apigateway.amazonaws.com'),
        sourceArn: Stack.of(route).formatArn({
          service: 'execute-api',
          resource: route.httpApi.apiId,
          resourceName: '*/*/*',
        }),
      });
    } else if (!consolidatedPermission) {
      // No other permissions exist or below threshold, so scope the permission to the specific route
      this.handler.addPermission(`ApiPermission.${desc}`, {
        scope: options.scope,
        principal: new ServicePrincipal('apigateway.amazonaws.com'),
        sourceArn: Stack.of(route).formatArn({
          service: 'execute-api',
          resource: route.httpApi.apiId,
          resourceName: `*/*${route.path ?? ''}`, // empty string in the case of the catch-all route $default
        }),
      });
    }
  }

  public bind(_options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    return {
      type: HttpIntegrationType.AWS_PROXY,
      uri: this.handler.functionArn,
      payloadFormatVersion: this.props.payloadFormatVersion ?? PayloadFormatVersion.VERSION_2_0,
      parameterMapping: this.props.parameterMapping,
      timeout: this.props.timeout,
    };
  }
}

