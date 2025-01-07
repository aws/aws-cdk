import {
  HttpAuthorizer,
  HttpAuthorizerType,
  HttpRouteAuthorizerBindOptions,
  HttpRouteAuthorizerConfig,
  IHttpRouteAuthorizer,
} from '../../../aws-apigatewayv2';

/**
 * Properties to initialize HttpJwtAuthorizer.
 */
export interface HttpJwtAuthorizerProps {

  /**
   * The name of the authorizer
   * @default - same value as `id` passed in the constructor
   */
  readonly authorizerName?: string;

  /**
   * The identity source for which authorization is requested.
   *
   * @default ['$request.header.Authorization']
   */
  readonly identitySource?: string[];

  /**
   * A list of the intended recipients of the JWT.
   * A valid JWT must provide an aud that matches at least one entry in this list.
   */
  readonly jwtAudience: string[];
}

/**
 * Authorize Http Api routes on whether the requester is registered as part of
 * an AWS Cognito user pool.
 */
export class HttpJwtAuthorizer implements IHttpRouteAuthorizer {
  private authorizer?: HttpAuthorizer;
  /**
   * The authorizationType used for JWT Authorizer
   */
  public readonly authorizationType = 'JWT';

  /**
   * Initialize a JWT authorizer to be bound with HTTP route.
   * @param id The id of the underlying construct
   * @param jwtIssuer The base domain of the identity provider that issues JWT
   * @param props Properties to configure the authorizer
   */
  constructor(
    private readonly id: string,
    private readonly jwtIssuer: string,
    private readonly props: HttpJwtAuthorizerProps) {
  }

  /**
   * Return the id of the authorizer if it's been constructed
   */
  public get authorizerId(): string {
    if (!this.authorizer) {
      throw new Error(
        'Cannot access authorizerId until authorizer is attached to a HttpRoute',
      );
    }
    return this.authorizer.authorizerId;
  }

  public bind(options: HttpRouteAuthorizerBindOptions): HttpRouteAuthorizerConfig {
    if (!this.authorizer) {
      this.authorizer = new HttpAuthorizer(options.scope, this.id, {
        httpApi: options.route.httpApi,
        identitySource: this.props.identitySource ?? ['$request.header.Authorization'],
        type: HttpAuthorizerType.JWT,
        authorizerName: this.props.authorizerName ?? this.id,
        jwtAudience: this.props.jwtAudience,
        jwtIssuer: this.jwtIssuer,
      });
    }

    return {
      authorizerId: this.authorizer.authorizerId,
      authorizationType: this.authorizationType,
    };
  }
}
