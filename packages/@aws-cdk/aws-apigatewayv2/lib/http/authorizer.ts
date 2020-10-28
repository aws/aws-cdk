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
}

/**
 * Describes an instance of `IHttpAuthorizer`
 */
export interface IHttpAuthorizer extends IAuthorizer {
  /**
   * Type of authorizer
   * @attribute
   */
  readonly authorizerType: HttpAuthorizerType;
}

/**
 * Specifies the configuration of a JWT authorizer
 */
export interface JwtConfiguration {
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
export interface HttpJwtAuthorizerProps extends HttpAuthorizerProps {
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
  readonly jwtConfiguration: JwtConfiguration
}

/**
 * Create a new JwtAuthorizer for Http APIs
 * @resource AWS::ApiGatewayV2::Authorizer
 */
export class HttpJwtAuthorizer extends Resource implements IHttpAuthorizer {

  /**
   * Import an existing HTTP Authorizer into this CDK app.
   */
  public static fromAuthorizerId(scope: Construct, id: string, authorizerId: string): IAuthorizer {
    class Import extends Resource implements IAuthorizer {
      public readonly authorizerId = authorizerId;
    }
    return new Import(scope, id);
  }

  public readonly authorizerId: string;
  public readonly authorizerType: HttpAuthorizerType = HttpAuthorizerType.JWT;
  public readonly identitySource: string[] = ['$request.header.Authorization']

  constructor(scope: Construct, id: string, props: HttpJwtAuthorizerProps) {
    super(scope, id);

    const authorizerName = props.authorizerName ?? id;

    if (props.identitySource) {
      this.identitySource = props.identitySource;
    }

    const resource = new CfnAuthorizer(this, 'Resource', {
      name: authorizerName,
      apiId: props.httpApi.httpApiId,
      authorizerType: this.authorizerType,
      identitySource: this.identitySource,
      jwtConfiguration: props.jwtConfiguration,
    });

    this.authorizerId = resource.ref;
  }
}
