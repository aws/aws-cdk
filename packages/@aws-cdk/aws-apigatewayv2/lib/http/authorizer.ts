import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnAuthorizer } from '../apigatewayv2.generated';

import { IAuthorizer } from '../common';
import { IHttpApi } from './api';

/**
 * Supported HTTP methods
 */
export enum HttpAuthorizerType {
  /** JSON Web Tokens */
  JWT = 'JWT',
  /** Lambda Authorizer */
  LAMBDA = 'REQUEST',
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
 * Reference to an http authorizer
 */
export interface HttpAuthorizerAttributes {
  /**
   * Id of the Authorizer
   */
  readonly authorizerId: string

  /**
   * Type of authorizer
   */
  readonly authorizerType: HttpAuthorizerType
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
export class HttpAuthorizer extends Resource implements IAuthorizer {

  /**
   * Import an existing HTTP Authorizer into this CDK app.
   */
  public static fromAuthorizerAttributes(scope: Construct, id: string, attrs: HttpAuthorizerAttributes): IAuthorizer {
    class Import extends Resource implements IAuthorizer {
      public readonly authorizerId = attrs.authorizerId;
      public readonly authorizerType = attrs.authorizerType;
    }
    return new Import(scope, id);
  }

  public readonly authorizerId: string;

  public readonly authorizerType: HttpAuthorizerType;

  constructor(scope: Construct, id: string, props: HttpAuthorizerProps) {
    super(scope, id);

    this.authorizerType = props.type ?? HttpAuthorizerType.JWT;

    const authorizerName = props.authorizerName ?? id;
    const identitySource = props.identitySource ?? ['$request.header.Authorization'];
    const jwtConfiguration = props.jwtConfiguration;

    if (this.authorizerType === HttpAuthorizerType.JWT && !jwtConfiguration) {
      throw new Error('jwtConfiguration is required for authorizer type of JWT');
    }

    const resource = new CfnAuthorizer(this, 'Resource', {
      name: authorizerName,
      apiId: props.httpApi.httpApiId,
      authorizerType: this.authorizerType,
      identitySource,
      jwtConfiguration,
    });

    this.authorizerId = resource.ref;
  }
}
