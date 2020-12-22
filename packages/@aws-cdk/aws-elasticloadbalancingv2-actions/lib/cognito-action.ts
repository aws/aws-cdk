import * as cognito from '@aws-cdk/aws-cognito';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { Duration } from '@aws-cdk/core';

/**
 * Properties for AuthenticateCognitoAction
 */
export interface AuthenticateCognitoActionProps {
  /**
   * What action to execute next
   *
   * Multiple actions form a linked chain; the chain must always terminate in a
   * (weighted)forward, fixedResponse or redirect action.
   */
  readonly next: elbv2.ListenerAction;

  /**
   * The Amazon Cognito user pool.
   */
  readonly userPool: cognito.IUserPool;

  /**
   * The Amazon Cognito user pool client.
   */
  readonly userPoolClient: cognito.IUserPoolClient;

  /**
   * The domain prefix or fully-qualified domain name of the Amazon Cognito user pool.
   */
  readonly userPoolDomain: cognito.IUserPoolDomain;

  /**
   * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
   *
   * @default - No extra parameters
   */
  readonly authenticationRequestExtraParams?: Record<string, string>;

  /**
   * The behavior if the user is not authenticated.
   *
   * @default UnauthenticatedAction.AUTHENTICATE
   */
  readonly onUnauthenticatedRequest?: elbv2.UnauthenticatedAction;

  /**
   * The set of user claims to be requested from the IdP.
   *
   * To verify which scope values your IdP supports and how to separate multiple values, see the documentation for your IdP.
   *
   * @default "openid"
   */
  readonly scope?: string;

  /**
   * The name of the cookie used to maintain session information.
   *
   * @default "AWSELBAuthSessionCookie"
   */
  readonly sessionCookieName?: string;

  /**
   * The maximum duration of the authentication session.
   *
   * @default Duration.days(7)
   */
  readonly sessionTimeout?: Duration;
}

/**
 * A Listener Action to authenticate with Cognito
 */
export class AuthenticateCognitoAction extends elbv2.ListenerAction {
  /**
   * Authenticate using an identity provide (IdP) that is compliant with OpenID Connect (OIDC)
   */
  constructor(options: AuthenticateCognitoActionProps) {
    super({
      type: 'authenticate-cognito',
      authenticateCognitoConfig: {
        userPoolArn: options.userPool.userPoolArn,
        userPoolClientId: options.userPoolClient.userPoolClientId,
        userPoolDomain: options.userPoolDomain.domainName,
        authenticationRequestExtraParams: options.authenticationRequestExtraParams,
        onUnauthenticatedRequest: options.onUnauthenticatedRequest,
        scope: options.scope,
        sessionCookieName: options.sessionCookieName,
        sessionTimeout: options.sessionTimeout?.toSeconds().toString(),
      },
    }, options.next);
  }
}
