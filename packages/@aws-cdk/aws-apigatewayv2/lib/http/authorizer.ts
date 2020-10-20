import { Resource, Lazy } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnAuthorizer } from '../apigatewayv2.generated';

import { HttpAuthorizerAttributes, IHttpAuthorizer } from '../common';
import { IHttpApi } from './api';

/**
 * Supported HTTP methods
 */
export enum HttpAuthorizerType {
  /** JSON Web Tokens */
  JWT = 'JWT',
  /** Lambda Authorizer */
  REQUEST = 'DELETE',
}

/**
 * Specifies the configuration of a JWT authorizer
 */
export interface HttpJwtConfiguration {
  /**
   * A list of the intended recipients of the JWT
   */
  readonly audience: string[]

  /**
   * The base domain of the identity provider that issues JSON Web Tokens.
   */
  readonly issuer: string;
}


/**
 * Properties to initialize an instance of `HttpAuthorizer`.
 */
export interface HttpAuthorizerProps {
  /**
   * Name of the authorizer
   *
   * @default - id of the HttpAuthorizer construct.
   */
  readonly authorizerName?: string

  /**
   * HTTP Api to attach the authorizer to
   */
  readonly httpApi: IHttpApi

  /**
   * The authorizer type. Specify REQUEST for a Lambda function using incoming request parameters.
   * Specify JWT to use JSON Web Tokens (supported only for HTTP APIs).
   *
   * @default JWT
   */
  readonly type?: HttpAuthorizerType;

  /**
   * The identity source for which authorization is requested.
   *
   * @default ['$request.header.Authorization']
   */
  readonly identitySource?: string[],

  /**
   * Configuration of a JWT authorizer.
   * Required for the JWT authorizer type. Supported only for HTTP APIs.
   *
   * @default - No configuration
   */
  readonly jwtConfiguration?: HttpJwtConfiguration
}

/**
 * Create a new Authorizer for Http APIs
 * @resource AWS::ApiGatewayV2::Authorizer
 */
export class HttpAuthorizer extends Resource implements IHttpAuthorizer {

  /**
   * Import an existing HTTP Authorizer into this CDK app.
   */
  public static fromHttpAuthorizerAttributes(scope: Construct, id: string, attrs: HttpAuthorizerAttributes): IHttpAuthorizer {
    class Import extends Resource implements IHttpAuthorizer {
      public readonly authorizerId = attrs.authorizerId;
      public readonly authorizerName = attrs.authorizerName;
    }
    return new Import(scope, id);
  }

  /**
   * A human friendly name for this Authorizer
   */
  public readonly authorizerName: string

  public readonly authorizerId: string

  constructor(scope: Construct, id: string, props: HttpAuthorizerProps) {
    super(scope, id, {
      physicalName: props.authorizerName || Lazy.stringValue({ produce: () => this.node.uniqueId }),
    });

    this.authorizerName = props.authorizerName ?? id;

    const authorizerType = props.type ?? HttpAuthorizerType.JWT;
    const identitySource = props.identitySource ?? ['$request.header.Authorization'];
    const jwtConfiguration = props.jwtConfiguration;

    if (authorizerType === HttpAuthorizerType.JWT && !jwtConfiguration) {
      throw new Error('jwtConfiguration is required for authorizer type of JWT');
    }

    const resource = new CfnAuthorizer(this, 'Resource', {
      name: this.authorizerName,
      apiId: props.httpApi.httpApiId,
      authorizerType,
      identitySource,
      jwtConfiguration,
    });

    this.authorizerId = resource.ref;
  }
}

