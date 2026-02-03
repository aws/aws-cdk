import type { Construct } from 'constructs';
import type { IConnection } from './connection';
import { HttpMethod } from './connection';
import type { IConnectionRef } from './events.generated';
import { CfnApiDestination } from './events.generated';
import { toIConnection } from './private/ref-utils';
import type { IResource } from '../../core';
import { ArnFormat, Resource, Stack, UnscopedValidationError } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { ApiDestinationReference, IApiDestinationRef } from '../../interfaces/generated/aws-events-interfaces.generated';

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
  readonly connection: IConnectionRef;

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
export interface IApiDestination extends IResource, IApiDestinationRef {
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
  readonly connection: IConnectionRef;
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
  ): IApiDestination {
    const apiDestinationName = Stack.of(scope).splitArn(
      attrs.apiDestinationArn, ArnFormat.SLASH_RESOURCE_NAME,
    ).resourceName;

    if (!apiDestinationName) {
      throw new UnscopedValidationError(`Could not extract Api Destionation name from ARN: '${attrs.apiDestinationArn}'`);
    }

    class Import extends Resource implements IApiDestination {
      public readonly apiDestinationArn = attrs.apiDestinationArn;
      public readonly apiDestinationName = apiDestinationName!;
      public readonly apiDestinationArnForPolicy = attrs.apiDestinationArnForPolicy;
      private readonly _importConnection = attrs.connection;

      public get connection(): IConnection {
        return toIConnection(this._importConnection);
      }

      public get apiDestinationRef(): ApiDestinationReference {
        return {
          apiDestinationName: this.apiDestinationName,
          apiDestinationArn: this.apiDestinationArn,
        };
      }
    }

    return new Import(scope, id);
  }
  /**
   * The Connection to associate with Api Destination
   */
  private readonly _connection: IConnectionRef;

  /**
   * The CfnApiDestination resource
   */
  private readonly _resource: CfnApiDestination;

  /**
   * The Name of the Api Destination created.
   * @attribute
   */
  @memoizedGetter
  public get apiDestinationName(): string {
    return this.getResourceNameAttribute(this._resource.ref);
  }

  /**
   * The ARN of the Api Destination created.
   * @attribute
   */
  @memoizedGetter
  public get apiDestinationArn(): string {
    return this._resource.attrArn;
  }

  /**
   * The Amazon Resource Name (ARN) of an API destination in resource format.
   * @attribute
   */
  @memoizedGetter
  public get apiDestinationArnForPolicy(): string | undefined {
    return this._resource.attrArnForPolicy;
  }

  /**
   * The Connection to associate with Api Destination
   */
  public get connection(): IConnection {
    return toIConnection(this._connection);
  }

  public get apiDestinationRef(): ApiDestinationReference {
    return {
      apiDestinationName: this.apiDestinationName,
      apiDestinationArn: this.apiDestinationArn,
    };
  }

  constructor(scope: Construct, id: string, props: ApiDestinationProps) {
    super(scope, id, {
      physicalName: props.apiDestinationName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this._connection = props.connection;

    this._resource = new CfnApiDestination(this, 'ApiDestination', {
      connectionArn: this._connection.connectionRef.connectionArn,
      description: props.description,
      httpMethod: props.httpMethod ?? HttpMethod.POST,
      invocationEndpoint: props.endpoint,
      invocationRateLimitPerSecond: props.rateLimitPerSecond,
      name: this.physicalName,
    });
  }
}
