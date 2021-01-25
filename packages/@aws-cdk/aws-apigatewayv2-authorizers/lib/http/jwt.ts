import {
  HttpAuthorizer,
  HttpAuthorizerType,
  HttpRouteAuthorizerBindOptions,
  HttpRouteAuthorizerConfig,
  IHttpAuthorizer,
  IHttpRouteAuthorizer,
} from '@aws-cdk/aws-apigatewayv2';
import { Resource, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Properties to initialize HttpJwtAuthorizer.
 */
export interface HttpJwtAuthorizerProps {

  /**
   * The name of the authorizer
   * @default 'JwtAuthorizer'
   */
  readonly authorizerName?: string;

  /**
   * The identity source for which authorization is requested.
   *
   * @default ['$request.header.Authorization']
   */
  readonly identitySource?: string[],

  /**
   * A list of the intended recipients of the JWT.
   * A valid JWT must provide an aud that matches at least one entry in this list.
   */
  readonly jwtAudience: string[]

  /**
   * The base domain of the identity provider that issues JWT.
   */
  readonly jwtIssuer: string;
}

/**
 * Authorize Http Api routes on whether the requester is registered as part of
 * an AWS Cognito user pool.
 */
export class HttpJwtAuthorizer implements IHttpRouteAuthorizer {
  /**
   * Import an existing HTTP Jwt Authorizer into this CDK app.
   */
  public static fromHttpJwtAuthorizerId(scope: Construct, id: string, authorizerId: string): IHttpRouteAuthorizer {
    class Import extends Resource implements IHttpRouteAuthorizer {
      private authorizer?: IHttpAuthorizer;

      public bind(): HttpRouteAuthorizerConfig {

        if (!this.authorizer) {
          this.authorizer = HttpAuthorizer.fromHttpAuthorizerAttributes(scope, 'authorizer', { authorizerId, authorizerType: HttpAuthorizerType.JWT });
        }

        return {
          authorizerId: this.authorizer.authorizerId,
          authorizationType: HttpAuthorizerType.JWT,
        };
      }
    }

    return new Import(scope, id);
  }

  private authorizer?: HttpAuthorizer;

  constructor(private readonly props: HttpJwtAuthorizerProps) {
  }

  public bind(options: HttpRouteAuthorizerBindOptions): HttpRouteAuthorizerConfig {
    if (!this.authorizer) {
      const id = this.props.authorizerName && !Token.isUnresolved(this.props.authorizerName) ?
        this.props.authorizerName : 'JwtAuthorizer';

      this.authorizer = new HttpAuthorizer(options.scope, id, {
        httpApi: options.route.httpApi,
        identitySource: this.props.identitySource ?? ['$request.header.Authorization'],
        type: HttpAuthorizerType.JWT,
        authorizerName: this.props.authorizerName,
        jwtAudience: this.props.jwtAudience,
        jwtIssuer: this.props.jwtIssuer,
      });
    }

    return {
      authorizerId: this.authorizer.authorizerId,
      authorizationType: HttpAuthorizerType.JWT,
    };
  }
}