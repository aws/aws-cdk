/**
 * Request Context interface
 */
export interface RequestContext {
  /**
   * Account ID string
   * @default false
   */
  readonly accountId?: boolean;

  /**
   * Api ID string
   * @default false
   */
  readonly apiId?: boolean;

  /**
   * Api Key string
   * @default false
   */
  readonly apiKey?: boolean;

  /**
   * Authorizer Principal ID string
   * @default false
   */
  readonly authorizerPrincipalId?: boolean;

  /**
   * Caller string
   * @default false
   */
  readonly caller?: boolean;

  /**
   * Cognito Authentication Provider string
   * @default false
   */
  readonly cognitoAuthenticationProvider?: boolean;

  /**
   * Cognito Authentication Type string
   * @default false
   */
  readonly cognitoAuthenticationType?: boolean;

  /**
   * Cognito Identity ID string
   * @default false
   */
  readonly cognitoIdentityId?: boolean;

  /**
   * Cognito Identity Pool ID string
   * @default false
   */
  readonly cognitoIdentityPoolId?: boolean;

  /**
   * Http Method string
   * @default false
   */
  readonly httpMethod?: boolean;

  /**
   * Stage string
   * @default false
   */
  readonly stage?: boolean;

  /**
   * Source IP string
   * @default false
   */
  readonly sourceIp?: boolean;

  /**
   * User string
   * @default false
   */
  readonly user?: boolean;

  /**
   * User Agent string
   * @default false
   */
  readonly userAgent?: boolean;

  /**
   * User Arn string
   * @default false
   */
  readonly userArn?: boolean;

  /**
   * Request ID string
   * @default false
   */
  readonly requestId?: boolean;

  /**
   * Resource ID string
   * @default false
   */
  readonly resourceId?: boolean;

  /**
   * Resource Path string
   * @default false
   */
  readonly resourcePath?: boolean;
}

/**
 * Builder to build Request Context object
 */
export class RequestContextBuilder {

  constructor() {}

  /**
   * Returns the requestContext String
   * @param requestContextInterface
   * @returns requestContextString
   */
  public with(requestContextInterface:RequestContext): string {
    const bodyStr: string = '"body": $util.escapeJavaScript($input.json(\'$\')),';
    const contextStr: string = '"requestContext": {';
    const accountIdStr: string = (requestContextInterface.accountId) ? '"accountId":"$context.identity.accountId",' : '';
    const apiIdStr: string = (requestContextInterface.apiId) ? '"apiId":"$context.apiId",' : '';
    const apiKeyStr: string = (requestContextInterface.apiKey) ? '"apiKey":"$context.identity.apiKey",' : '';
    const authorizerPrincipalIdStr: string = (requestContextInterface.authorizerPrincipalId) ? '"authorizerPrincipalId":"$context.authorizer.principalId",' : '';
    const callerStr: string = (requestContextInterface.caller) ? '"caller":"$context.identity.caller",' : '';
    const cognitoAuthenticationProviderStr: string = (requestContextInterface.cognitoAuthenticationProvider) ? '"cognitoAuthenticationProvider":"$context.identity.cognitoAuthenticationProvider",' : '';
    const cognitoAuthenticationTypeStr: string = (requestContextInterface.cognitoAuthenticationType) ? '"cognitoAuthenticationType":"$context.identity.cognitoAuthenticationType",' : '';
    const cognitoIdentityIdStr: string = (requestContextInterface.cognitoIdentityId) ? '"cognitoIdentityId":"$context.identity.cognitoIdentityId",' : '';
    const cognitoIdentityPoolIdStr: string = (requestContextInterface.cognitoIdentityPoolId) ? '"cognitoIdentityPoolId":"$context.identity.cognitoIdentityPoolId",' : '';
    const httpMethodStr: string = (requestContextInterface.httpMethod) ? '"httpMethod":"$context.httpMethod",' : '';
    const stageStr: string = (requestContextInterface.stage) ? '"stage":"$context.stage",' : '';
    const sourceIpStr: string = (requestContextInterface.sourceIp) ? '"sourceIp":"$context.identity.sourceIp",' : '';
    const userStr: string = (requestContextInterface.user) ? '"user":"$context.identity.user",' : '';
    const userAgentStr: string = (requestContextInterface.userAgent) ? '"userAgent":"$context.identity.userAgent",' : '';
    const userArnStr: string = (requestContextInterface.userArn) ? '"userArn":"$context.identity.userArn",' : '';
    const requestIdStr: string = (requestContextInterface.requestId) ? '"requestId":"$context.requestId",' : '';
    const resourceIdStr: string = (requestContextInterface.resourceId) ? '"resourceId":"$context.resourceId",' : '';
    const resourcePathStr: string = (requestContextInterface.resourcePath) ? '"resourcePath":"$context.resourcePath",' : '';
    const endStr = '}';

    let requestContextString :string = bodyStr + contextStr + accountIdStr + apiIdStr + apiKeyStr +
          authorizerPrincipalIdStr + callerStr + cognitoAuthenticationProviderStr + cognitoAuthenticationTypeStr +
          cognitoIdentityIdStr + cognitoIdentityPoolIdStr + httpMethodStr + stageStr + sourceIpStr + userStr +
          userAgentStr + userArnStr + requestIdStr + resourceIdStr + resourcePathStr + endStr;

    if (requestContextString !== (bodyStr + contextStr + endStr)) {
      //Removing the last comma froom the string only if it has a value inside
      requestContextString = requestContextString.substring(0, requestContextString.length-2) + '}';
    }

    return requestContextString;
  }


}