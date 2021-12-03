import { Grant, IGrantable } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnApi } from '../apigatewayv2.generated';
import { IApi } from '../common/api';
import { ApiBase } from '../common/base';
import { WebSocketRoute, WebSocketRouteOptions } from './route';

/**
 * Represents a WebSocket API
 */
export interface IWebSocketApi extends IApi {
}

/**
 * Props for WebSocket API
 */
export interface WebSocketApiProps {
  /**
   * Name for the WebSocket API resource
   * @default - id of the WebSocketApi construct.
   */
  readonly apiName?: string;

  /**
   * The description of the API.
   * @default - none
   */
  readonly description?: string;

  /**
   * The route selection expression for the API
   * @default '$request.body.action'
   */
  readonly routeSelectionExpression?: string;

  /**
   * Options to configure a '$connect' route
   *
   * @default - no '$connect' route configured
   */
  readonly connectRouteOptions?: WebSocketRouteOptions;

  /**
   * Options to configure a '$disconnect' route
   *
   * @default - no '$disconnect' route configured
   */
  readonly disconnectRouteOptions?: WebSocketRouteOptions;

  /**
   * Options to configure a '$default' route
   *
   * @default - no '$default' route configured
   */
  readonly defaultRouteOptions?: WebSocketRouteOptions;
}

/**
 * Create a new API Gateway WebSocket API endpoint.
 * @resource AWS::ApiGatewayV2::Api
 */
export class WebSocketApi extends ApiBase implements IWebSocketApi {
  public readonly apiId: string;
  public readonly apiEndpoint: string;

  /**
   * A human friendly name for this WebSocket API. Note that this is different from `webSocketApiId`.
   */
  public readonly webSocketApiName?: string;

  constructor(scope: Construct, id: string, props?: WebSocketApiProps) {
    super(scope, id);

    this.webSocketApiName = props?.apiName ?? id;

    const resource = new CfnApi(this, 'Resource', {
      name: this.webSocketApiName,
      protocolType: 'WEBSOCKET',
      description: props?.description,
      routeSelectionExpression: props?.routeSelectionExpression ?? '$request.body.action',
    });
    this.apiId = resource.ref;
    this.apiEndpoint = resource.attrApiEndpoint;

    if (props?.connectRouteOptions) {
      this.addRoute('$connect', props.connectRouteOptions);
    }
    if (props?.disconnectRouteOptions) {
      this.addRoute('$disconnect', props.disconnectRouteOptions);
    }
    if (props?.defaultRouteOptions) {
      this.addRoute('$default', props.defaultRouteOptions);
    }
  }

  /**
   * Add a new route
   */
  public addRoute(routeKey: string, options: WebSocketRouteOptions) {
    return new WebSocketRoute(this, `${routeKey}-Route`, {
      webSocketApi: this,
      routeKey,
      ...options,
    });
  }

  /**
   * Grant access to the API Gateway management API for this WebSocket API to an IAM
   * principal (Role/Group/User).
   *
   * @param identity The principal
   */
  public grantManageConnections(identity: IGrantable): Grant {
    const arn = Stack.of(this).formatArn({
      service: 'execute-api',
      resource: this.apiId,
    });

    return Grant.addToPrincipal({
      grantee: identity,
      actions: ['execute-api:ManageConnections'],
      resourceArns: [`${arn}/*/POST/@connections/*`],
    });
  }
}
