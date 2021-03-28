import { Resource, Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnApiDestination } from './events.generated';


/**
 * Supported HTTP operations.
 */
export enum HttpMethod {

  /** POST */
  POST = 'POST',
  /** GET */
  GET = 'GET',
  /** HEAD */
  HEAD = 'HEAD',
  /** OPTIONS */
  OPTIONS = 'OPTIONS',
  /** PUT */
  PUT = 'PUT',
  /** PATCH */
  PATCH = 'PATCH',
  /** DELETE */
  DELETE = 'DELETE',

}


/**
 * The event Api Destination base properties
 */
export interface BaseApiDestinationProps {
  /**
   * The ARN of the connection to use for the API destination
   */
  readonly connectionArn: string;
  /**
   * A description for the API destination.
   *
   * @default - none
   */
  readonly description?: string;
  /**
   * The method to use for the request to the HTTP invocation endpoint.
   */
  readonly httpMethod: HttpMethod;
  /**
   * The URL to the HTTP invocation endpoint for the API destination..
   */
  readonly invocationEndpoint: string;
  /**
   * The maximum number of requests per second to send to the HTTP invocation endpoint.
   */
  readonly invocationRateLimit: Duration;
  /**
   * The name for the API destination.
   */
  readonly name: string;
}


/**
 * The event Api Destination properties
 */
export interface ApiDestinationProps extends BaseApiDestinationProps {

}

/**
 * Define an EventBridge Api Destination
 *
 * @resource AWS::Events::ApiDestination
 */
export class ApiDestination extends Resource {
  /**
   * The ARN of the Api Destination created.
   * @attribute
   */
  public readonly apiDestinationArn: string;

  constructor(scope: Construct, id: string, props: ApiDestinationProps) {
    super(scope, id, { physicalName: props.name });

    let apiDestination = new CfnApiDestination(this, 'ApiDestination', {
      connectionArn: props.connectionArn,
      description: props.description,
      httpMethod: props.httpMethod,
      invocationEndpoint: props.invocationEndpoint,
      invocationRateLimitPerSecond: props.invocationRateLimit?.toSeconds(),
      name: this.physicalName,
    });

    this.apiDestinationArn = apiDestination.attrArn;
  }
}
