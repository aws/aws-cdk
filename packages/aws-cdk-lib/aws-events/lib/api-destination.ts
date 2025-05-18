import { Construct } from 'constructs';
import { HttpMethod, IConnection } from './connection';
import { CfnApiDestination } from './events.generated';
import { ArnFormat, IResource, Resource, Stack, UnscopedValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

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

  /**
   * The Amazon Resource Name (ARN) of an API destination in resource format,
   * so it can be used in the Resource element of IAM permission policy statements.
   * @see https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazoneventbridge.html#amazoneventbridge-resources-for-iam-policies
   * @attribute
   */
  readonly apiDestinationArnForPolicy?: string;
}

/**
 * The properties to import an existing Api Destination
 */
export interface ApiDestinationAttributes {
  /**
   * The ARN of the Api Destination
   */
  readonly apiDestinationArn: string;
  /**
   * The Connection to associate with the Api Destination
   */
  readonly connection: IConnection;
  /**
   * The Amazon Resource Name (ARN) of an API destination in resource format.
   *
   * @default undefined - Imported API destination does not have ARN in resource format
   */
  readonly apiDestinationArnForPolicy?: string;
}

/**
 * Define an EventBridge Api Destination
 *
 * @resource AWS::Events::ApiDestination
 */
@propertyInjectable
export class ApiDestination extends Resource implements IApiDestination {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-events.ApiDestination';

  /**
   * Create an Api Destination construct from an existing Api Destination ARN.
   *
   * @param scope The scope creating construct (usually `this`).
   * @param id The construct's id.
   * @param attrs The Api Destination import attributes.
   */
  public static fromApiDestinationAttributes(
    scope: Construct,
    id: string,
    attrs: ApiDestinationAttributes,
  ): ApiDestination {
    const apiDestinationName = Stack.of(scope).splitArn(
      attrs.apiDestinationArn, ArnFormat.SLASH_RESOURCE_NAME,
    ).resourceName;

    if (!apiDestinationName) {
      throw new UnscopedValidationError(`Could not extract Api Destionation name from ARN: '${attrs.apiDestinationArn}'`);
    }

    class Import extends Resource implements ApiDestination {
      public readonly apiDestinationArn = attrs.apiDestinationArn;
      public readonly apiDestinationName = apiDestinationName!;
      public readonly apiDestinationArnForPolicy = attrs.apiDestinationArnForPolicy;
      public readonly connection = attrs.connection;
    }

    return new Import(scope, id);
  }
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

  /**
   * The Amazon Resource Name (ARN) of an API destination in resource format.
   * @attribute
   */
  public readonly apiDestinationArnForPolicy?: string;

  constructor(scope: Construct, id: string, props: ApiDestinationProps) {
    super(scope, id, {
      physicalName: props.apiDestinationName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

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
    this.apiDestinationArnForPolicy = apiDestination.attrArnForPolicy;
  }
}
