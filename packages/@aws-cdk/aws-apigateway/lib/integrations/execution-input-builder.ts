/**
 * Builder to build execution input object
 */
export class ExecutionInputBuilder {
  /**
      * Input body string
      */
  private _bodyStr: string;

  /**
      * Context start string
      */
  private _contextStr: string | undefined;

  /**
      * Account ID string
      */
  private _accountIdStr: string | undefined;

  /**
      * Api ID string
      */
  private _apiIdStr: string | undefined;

  /**
      * Api Key string
      */
  private _apiKeyStr: string | undefined;

  /**
      * Authorizer Principal ID string
      */
  private _authorizerPrincipalIdStr: string | undefined;

  /**
      * Caller string
      */
  private _callerStr: string | undefined;

  /**
      * Cognito Authentication Provider string
      */
  private _cognitoAuthenticationProviderStr: string | undefined;

  /**
      * Cognito Authentication Type string
      */
  private _cognitoAuthenticationTypeStr: string | undefined;

  /**
      * Cognito Identity ID string
      */
  private _cognitoIdentityIdStr: string | undefined;

  /**
      * Cognito Identity Pool ID string
      */
  private _cognitoIdentityPoolIdStr: string | undefined;

  /**
      * Http Method string
      */
  private _httpMethodStr: string | undefined;

  /**
      * Stage string
      */
  private _stageStr: string | undefined;

  /**
      * Source IP string
      */
  private _sourceIpStr: string | undefined;

  /**
      * User string
      */
  private _userStr: string | undefined;

  /**
      * User Agent string
      */
  private _userAgentStr: string | undefined;

  /**
      * User Arn string
      */
  private _userArnStr: string | undefined;

  /**
      * Request ID string
      */
  private _requestIdStr: string | undefined;

  /**
      * Resource ID string
      */
  private _resourceIdStr: string | undefined;

  /**
      * Resource Path string
      */
  private _resourcePathStr: string | undefined;

  /**
      * End string
      */
  private _endStr: string | undefined;

  constructor(input: string) {
    this._bodyStr = '"body": ' + input + ',';
  }

  /**
      * set contextStr
      * @param _context
      * @returns ExecutionInputBuilder
      */
  public withContext(_context: string | undefined): ExecutionInputBuilder {
    if (_context == null) {
      this._contextStr = '';
      return this;
    }
    this._contextStr = _context;
    return this;
  }

  /**
      * set accountIdStr
      * @param _accountId
      * @returns ExecutionInputBuilder
      */
  public withAccountId(_accountId: string | undefined): ExecutionInputBuilder {
    if (_accountId == null) {
      this._accountIdStr = '';
      return this;
    }
    this._accountIdStr = '"accountId":' + _accountId + ',';
    return this;
  }

  /**
      * set apiIdStr
      * @param _apiId
      * @returns ExecutionInputBuilder
      */
  public withApiId(_apiId: string | undefined): ExecutionInputBuilder {
    if (_apiId == null) {
      this._apiIdStr = '';
      return this;
    }
    this._apiIdStr = '"apiId":' + _apiId + ',';
    return this;
  }

  /**
      * set apiKeyStr
      * @param _apiKey
      * @returns ExecutionInputBuilder
      */
  public withApiKey(_apiKey: string | undefined): ExecutionInputBuilder {
    if (_apiKey == null) {
      this._apiKeyStr = '';
      return this;
    }
    this._apiKeyStr = '"apiKey":' + _apiKey + ',';
    return this;
  }

  /**
      * set _authorizerPrincipalIdStr
      * @param _authorizerPrincipalId
      * @returns ExecutionInputBuilder
      */
  public withAuthorizerPrincipalId(_authorizerPrincipalId: string | undefined): ExecutionInputBuilder {
    if (_authorizerPrincipalId == null) {
      this._authorizerPrincipalIdStr = '';
      return this;
    }
    this._authorizerPrincipalIdStr = '"authorizerPrincipalId":' + _authorizerPrincipalId + ',';
    return this;
  }

  /**
      * set _callerStr
      * @param _caller
      * @returns ExecutionInputBuilder
      */
  public withCaller(_caller: string | undefined): ExecutionInputBuilder {
    if (_caller == null) {
      this._callerStr = '';
      return this;
    }
    this._callerStr = '"caller":' + _caller + ',';
    return this;
  }

  /**
      * set _cognitoAuthenticationProviderStr
      * @param _cognitoAuthenticationProvider
      * @returns ExecutionInputBuilder
      */
  public withCognitoAuthenticationProvider(_cognitoAuthenticationProvider: string | undefined): ExecutionInputBuilder {
    if (_cognitoAuthenticationProvider == null) {
      this._cognitoAuthenticationProviderStr = '';
      return this;
    }
    this._cognitoAuthenticationProviderStr = '"cognitoAuthenticationProvider":' + _cognitoAuthenticationProvider + ',';
    return this;
  }

  /**
      * set _cognitoAuthenticationTypeStr
      * @param _cognitoAuthenticationType
      * @returns ExecutionInputBuilder
      */
  public withCognitoAuthenticationType(_cognitoAuthenticationType: string | undefined): ExecutionInputBuilder {
    if (_cognitoAuthenticationType == null) {
      this._cognitoAuthenticationTypeStr = '';
      return this;
    }
    this._cognitoAuthenticationTypeStr = '"cognitoAuthenticationType":' + _cognitoAuthenticationType + ',';
    return this;
  }

  /**
      * set _cognitoIdentityIdStr
      * @param _cognitoIdentityId
      * @returns ExecutionInputBuilder
      */
  public withCognitoIdentityId(_cognitoIdentityId: string | undefined): ExecutionInputBuilder {
    if (_cognitoIdentityId == null) {
      this._cognitoIdentityIdStr = '';
      return this;
    }
    this._cognitoIdentityIdStr = '"cognitoIdentityId":' + _cognitoIdentityId + ',';
    return this;
  }

  /**
      * set _cognitoIdentityPoolIdStr
      * @param _cognitoIdentityPoolId
      * @returns ExecutionInputBuilder
      */
  public withCognitoIdentityPoolId(_cognitoIdentityPoolId: string | undefined): ExecutionInputBuilder {
    if (_cognitoIdentityPoolId == null) {
      this._cognitoIdentityPoolIdStr = '';
      return this;
    }
    this._cognitoIdentityPoolIdStr = '"cognitoIdentityPoolId":' + _cognitoIdentityPoolId + ',';
    return this;
  }

  /**
      * set _httpMethodStr
      * @param _httpMethod
      * @returns ExecutionInputBuilder
      */
  public withHttpMethod(_httpMethod: string | undefined): ExecutionInputBuilder {
    if (_httpMethod == null) {
      this._httpMethodStr = '';
      return this;
    }
    this._httpMethodStr = '"httpMethod":' + _httpMethod + ',';
    return this;
  }

  /**
      * set _stageStr
      * @param _stage
      * @returns ExecutionInputBuilder
      */
  public withStage(_stage: string | undefined): ExecutionInputBuilder {
    if (_stage == null) {
      this._stageStr = '';
      return this;
    }
    this._stageStr = '"stage":' + _stage + ',';
    return this;
  }

  /**
      * set _sourceIpStr
      * @param _sourceIp
      * @returns ExecutionInputBuilder
      */
  public withSourceIp(_sourceIp: string | undefined): ExecutionInputBuilder {
    if (_sourceIp == null) {
      this._sourceIpStr = '';
      return this;
    }
    this._sourceIpStr = '"sourceIp":' + _sourceIp + ',';
    return this;
  }

  /**
      * set _userStr
      * @param _user
      * @returns ExecutionInputBuilder
      */
  public withUser(_user: string | undefined): ExecutionInputBuilder {
    if (_user == null) {
      this._userStr = '';
      return this;
    }
    this._userStr = '"user":' + _user + ',';
    return this;
  }

  /**
      * set _userAgentStr
      * @param _userAgent
      * @returns ExecutionInputBuilder
      */

  public withUserAgent(_userAgent: string | undefined): ExecutionInputBuilder {
    if (_userAgent == null) {
      this._userAgentStr = '';
      return this;
    }
    this._userAgentStr = '"userAgent":' + _userAgent + ',';
    return this;
  }

  /**
      * set _userArnStr
      * @param _userArn
      * @returns ExecutionInputBuilder
      */
  public withUserArn(_userArn: string | undefined): ExecutionInputBuilder {
    if (_userArn == null) {
      this._userArnStr = '';
      return this;
    }
    this._userArnStr = '"userArn":' + _userArn + ',';
    return this;
  }

  /**
      * set _requestIdStr
      * @param _requestId
      * @returns ExecutionInputBuilder
      */
  public withRequestId(_requestId: string | undefined): ExecutionInputBuilder {
    if (_requestId == null) {
      this._requestIdStr = '';
      return this;
    }
    this._requestIdStr = '"requestId":' + _requestId + ',';
    return this;
  }

  /**
      * set _resourceIdStr
      * @param _resourceId
      * @returns ExecutionInputBuilder
      */
  public withResourceId(_resourceId: string | undefined): ExecutionInputBuilder {
    if (_resourceId == null) {
      this._resourceIdStr = '';
      return this;
    }
    this._resourceIdStr = '"resourceId":' + _resourceId + ',';
    return this;
  }

  /**
      * set _resourcePathStr
      * @param _resourcePath
      * @returns ExecutionInputBuilder
      */
  public withResourcePath(_resourcePath: string | undefined): ExecutionInputBuilder {
    if (_resourcePath == null) {
      this._resourcePathStr = '';
      return this;
    }
    this._resourcePathStr = '"resourcePath":' + _resourcePath;
    return this;
  }

  /**
      * set _endStr
      * @param _end
      * @returns ExecutionInputBuilder
      */
  public withEnd(_end: string | undefined): ExecutionInputBuilder {
    if ( _end == null) {
      this._endStr = '';
      return this;
    }
    this._endStr = _end;
    return this;
  }

  /**
      * returns _bodystr
      */
  public get retrieveBodyStr() {
    return this._bodyStr;
  }

  /**
      * returns _contextStr
      */
  public get retrieveContextStr() {
    return this._contextStr;
  }

  /**
      * returns _accountIdStr
      */
  public get retrieveAccountIdStr() {
    return this._accountIdStr;
  }

  /**
      * returns _apiIdStr
      */
  public get retrieveApiIdStr() {
    return this._apiIdStr;
  }

  /**
      * returns _apiKeyStr
      */
  public get retrieveApiKeyStr() {
    return this._apiKeyStr;
  }

  /**
      * returns _authorizerPrincipalIdStr
      */
  public get retrieveAuthorizerPrincipalIdStr() {
    return this._authorizerPrincipalIdStr;
  }

  /**
      * returns _callerStr
      */
  public get retrieveCallerStr() {
    return this._callerStr;
  }

  /**
      * returns _cognitoAuthenticationProviderStr
      */
  public get retrieveCognitoAuthenticationProviderStr() {
    return this._cognitoAuthenticationProviderStr;
  }

  /**
      * returns _cognitoAuthenticationTypeStr
      */
  public get retrieveCognitoAuthenticationTypeStr() {
    return this._cognitoAuthenticationTypeStr;
  }

  /**
      * returns _cognitoIdentityIdStr
      */
  public get retrieveCognitoIdentityIdStr() {
    return this._cognitoIdentityIdStr;
  }

  /**
      * returns _cognitoIdentityPoolIdStr
      */
  public get retrieveCognitoIdentityPoolIdStr() {
    return this._cognitoIdentityPoolIdStr;
  }

  /**
      * returns _httpMethodStr
      */
  public get retrieveHttpMethodStr() {
    return this._httpMethodStr;
  }

  /**
      * returns _stageStr
      */
  public get retrieveStageStr() {
    return this._stageStr;
  }

  /**
      * returns _sourceIpStr
      */
  public get retrieveSourceIpStr() {
    return this._sourceIpStr;
  }

  /**
      * returns _userStr
      */
  public get retrieveUserStr() {
    return this._userStr;
  }

  /**
      * returns _userAgentStr
      */
  public get retrieveUserAgentStr() {
    return this._userAgentStr;
  }

  /**
      * returns _userArnStr
      */
  public get retrieveUserArnStr() {
    return this._userArnStr ;
  }

  /**
      * returns _requestIdStr
      */
  public get retrieveRequestIdStr() {
    return this._requestIdStr;
  }

  /**
      * returns _resourceIdStr
      */
  public get retrieveResourceIdStr() {
    return this._resourceIdStr;
  }

  /**
      * returns _resourcePathStr
      */
  public get retrieveResourcePathStr() {
    return this._resourcePathStr;
  }

  /**
      * returns _endstr
      */
  public get retrieveEndStr() {
    return this._endStr;
  }

  /**
      * Returns object
      * @returns ExecutionInput
      */
  public create(): ExecutionInput {
    return new ExecutionInput(this);
  }

}

/**
    * execution input object
    */
export class ExecutionInput {
  /**
      * Input body string
      */
  private _bodyStr: string;

  /**
       * Context start string
       */
  private _contextStr: string | undefined;

  /**
       * Account ID string
       */
  private _accountIdStr: string | undefined;

  /**
       * Api ID string
       */
  private _apiIdStr: string | undefined;

  /**
       * Api Key string
       */
  private _apiKeyStr: string | undefined;

  /**
       * Authorizer Principal ID string
       */
  private _authorizerPrincipalIdStr: string | undefined;

  /**
       * Caller string
       */
  private _callerStr: string | undefined;

  /**
       * Cognito Authentication Provider string
       */
  private _cognitoAuthenticationProviderStr: string | undefined;

  /**
       * Cognito Authentication Type string
       */
  private _cognitoAuthenticationTypeStr: string | undefined;

  /**
       * Cognito Identity ID string
       */
  private _cognitoIdentityIdStr: string | undefined;

  /**
       * Cognito Identity Pool ID string
       */
  private _cognitoIdentityPoolIdStr: string | undefined;

  /**
       * Http Method string
       */
  private _httpMethodStr: string | undefined;

  /**
       * Stage string
       */
  private _stageStr: string | undefined;

  /**
       * Source IP string
       */
  private _sourceIpStr: string | undefined;

  /**
       * User string
       */
  private _userStr: string | undefined;

  /**
       * User Agent string
       */
  private _userAgentStr: string | undefined;

  /**
       * User Arn string
       */
  private _userArnStr: string | undefined;

  /**
       * Request ID string
       */
  private _requestIdStr: string | undefined;

  /**
       * Resource ID string
       */
  private _resourceIdStr: string | undefined;

  /**
       * Resource Path string
       */
  private _resourcePathStr: string | undefined;

  /**
      * End string
      */
  private _endStr: string | undefined;

  constructor(builder: ExecutionInputBuilder) {
    this._bodyStr = builder.retrieveBodyStr;
    this._contextStr = builder.retrieveContextStr;
    this._accountIdStr = builder.retrieveAccountIdStr;
    this._apiIdStr = builder.retrieveApiIdStr;
    this._apiKeyStr = builder.retrieveApiKeyStr;
    this._authorizerPrincipalIdStr = builder.retrieveAuthorizerPrincipalIdStr;
    this._callerStr = builder.retrieveCallerStr;
    this._cognitoAuthenticationProviderStr = builder.retrieveCognitoAuthenticationProviderStr;
    this._cognitoAuthenticationTypeStr = builder.retrieveCognitoAuthenticationTypeStr;
    this._cognitoIdentityIdStr = builder.retrieveCognitoIdentityIdStr;
    this._cognitoIdentityPoolIdStr = builder.retrieveCognitoIdentityPoolIdStr;
    this._httpMethodStr = builder.retrieveHttpMethodStr;
    this._stageStr = builder.retrieveStageStr;
    this._sourceIpStr = builder.retrieveSourceIpStr;
    this._userStr = builder.retrieveUserStr;
    this._userAgentStr = builder.retrieveUserAgentStr;
    this._userArnStr = builder.retrieveUserArnStr;
    this._requestIdStr = builder.retrieveRequestIdStr;
    this._resourceIdStr = builder.retrieveResourceIdStr;
    this._resourcePathStr = builder.retrieveResourcePathStr;
    this._endStr = builder.retrieveEndStr;
  }

  /**
      * returns _bodystr
      */
  public get retrieveBodyStr() {
    return this._bodyStr;
  }

  /**
      * returns _contextStr
      */
  public get retrieveContextStr() {
    return this._contextStr;
  }

  /**
      * returns _accountIdStr
      */
  public get retrieveAccountIdStr() {
    return this._accountIdStr;
  }

  /**
      * returns _apiIdStr
      */
  public get retrieveApiIdStr() {
    return this._apiIdStr;
  }

  /**
      * returns _apiKeyStr
      */
  public get retrieveApiKeyStr() {
    return this._apiKeyStr;
  }

  /**
      * returns _authorizerPrincipalIdStr
      */
  public get retrieveAuthorizerPrincipalIdStr() {
    return this._authorizerPrincipalIdStr;
  }

  /**
      * returns _callerStr
      */
  public get retrieveCallerStr() {
    return this._callerStr;
  }

  /**
      * returns _cognitoAuthenticationProviderStr
      */
  public get retrieveCognitoAuthenticationProviderStr() {
    return this._cognitoAuthenticationProviderStr;
  }

  /**
      * returns _cognitoAuthenticationTypeStr
      */
  public get retrieveCognitoAuthenticationTypeStr() {
    return this._cognitoAuthenticationTypeStr;
  }

  /**
      * returns _cognitoIdentityIdStr
      */
  public get retrieveCognitoIdentityIdStr() {
    return this._cognitoIdentityIdStr;
  }

  /**
      * returns _cognitoIdentityPoolIdStr
      */
  public get retrieveCognitoIdentityPoolIdStr() {
    return this._cognitoIdentityPoolIdStr;
  }

  /**
      * returns _httpMethodStr
      */
  public get retrieveHttpMethodStr() {
    return this._httpMethodStr;
  }

  /**
      * returns _stageStr
      */
  public get retrieveStageStr() {
    return this._stageStr;
  }

  /**
      * returns _sourceIpStr
      */
  public get retrieveSourceIpStr() {
    return this._sourceIpStr;
  }

  /**
      * returns _userStr
      */
  public get retrieveUserStr() {
    return this._userStr;
  }

  /**
      * returns _userAgentStr
      */
  public get retrieveUserAgentStr() {
    return this._userAgentStr;
  }

  /**
      * returns _userArnStr
      */
  public get retrieveUserArnStr() {
    return this._userArnStr ;
  }

  /**
      * returns _requestIdStr
      */
  public get retrieveRequestIdStr() {
    return this._requestIdStr;
  }

  /**
      * returns _resourceIdStr
      */
  public get retrieveResourceIdStr() {
    return this._resourceIdStr;
  }

  /**
      * returns _resourcePathStr
      */
  public get retrieveResourcePathStr() {
    return this._resourcePathStr;
  }

  /**
      * returns _endstr
      */
  public get retrieveEndStr() {
    return this._endStr;
  }

  /**
      * Returns all properties as a single single
      */
  public retrieveAllAsString(): string {
    const executionInputStr :string = this.retrieveBodyStr + this.retrieveContextStr + this.retrieveAccountIdStr +
           this.retrieveApiIdStr + this.retrieveApiKeyStr + this.retrieveAuthorizerPrincipalIdStr +
           this.retrieveCallerStr + this.retrieveCognitoAuthenticationProviderStr +
           this.retrieveCognitoAuthenticationTypeStr + this.retrieveCognitoIdentityIdStr +
           this.retrieveCognitoIdentityPoolIdStr + this.retrieveHttpMethodStr +
           this.retrieveStageStr + this.retrieveSourceIpStr + this.retrieveUserStr + this.retrieveUserAgentStr +
           this.retrieveUserArnStr + this.retrieveRequestIdStr + this.retrieveResourceIdStr + this.retrieveResourcePathStr + this.retrieveEndStr;

    return executionInputStr;
  }
}