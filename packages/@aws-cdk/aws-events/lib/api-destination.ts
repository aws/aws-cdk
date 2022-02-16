import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { HttpMethod, IConnection } from './connection';
import { CfnApiDestination } from './events.generated';

/**
 * The event API Destination properties
 */
export interface ApiDestinationProps {
  /**
   * The name for the API destination.
   * @default - A unique name will be generated
   */
  readonly apiDestinationName?: string;

  /**
   * A description for the API destination.
   *
   * @default - none
   */
  readonly description?: string;

  /**
   * The ARN of the connection to use for the API destination
   */
  readonly connection: IConnection;

  /**
   * The URL to the HTTP invocation endpoint for the API destination..
   */
  readonly endpoint: string;

  /**
   * The method to use for the request to the HTTP invocation endpoint.
   *
   * @default HttpMethod.POST
   */
  readonly httpMethod?: HttpMethod;

  /**
   * The maximum number of requests per second to send to the HTTP invocation endpoint.
   *
   * @default - Not rate limited
   */
  readonly rateLimitPerSecond?: number;
}

/**
 * Interface for API Destinations
 */
export interface IApiDestination extends IResource {
  /**
   * The Name of the Api Destination created.
   * @attribute
   */
  readonly apiDestinationName: string;

  /**
   * The ARN of the Api Destination created.
   * @attribute
   */
  readonly apiDestinationArn: string;
}

/**
 * Define an EventBridge Api Destination
 *
 * @resource AWS::Events::ApiDestination
 */
export class ApiDestination extends Resource implements IApiDestination {
  /**
   * The Connection to associate with Api Destination
   */
  public readonly connection: IConnection;

  /**
   * The Name of the Api Destination created.
   * @attribute
   */
  public readonly apiDestinationName: string;

  /**
   * The ARN of the Api Destination created.
   * @attribute
   */
  public readonly apiDestinationArn: string;

  constructor(scope: Construct, id: string, props: ApiDestinationProps) {
    super(scope, id, {
      physicalName: props.apiDestinationName,
    });

    this.connection = props.connection;

    let apiDestination = new CfnApiDestination(this, 'ApiDestination', {
      connectionArn: this.connection.connectionArn,
      description: props.description,
      httpMethod: props.httpMethod ?? HttpMethod.POST,
      invocationEndpoint: props.endpoint,
      invocationRateLimitPerSecond: props.rateLimitPerSecond,
      name: this.physicalName,
    });

    this.apiDestinationName = this.getResourceNameAttribute(apiDestination.ref);
    this.apiDestinationArn = apiDestination.attrArn;
  }
}
