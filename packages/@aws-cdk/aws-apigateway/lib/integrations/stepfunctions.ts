import * as fs from 'fs';
import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Token } from '@aws-cdk/core';
import { RequestContext } from '.';
import { IntegrationConfig, IntegrationOptions, PassthroughBehavior } from '../integration';
import { Method } from '../method';
import { AwsIntegration } from './aws';
/**
 * Options when configuring Step Functions integration with Rest API
 */
export interface StepFunctionsIntegrationOptions extends IntegrationOptions {
  /**
    * Action for the Step Functions integration. The list of supported API actions can be found
    * on https://docs.aws.amazon.com/step-functions/latest/apireference/API_Operations.html
    * @default 'StartSyncExecution'
    */
  readonly action: string;

  /**
   * Check if cors is enabled
   * @default false
   */
  readonly corsEnabled?: boolean;

  /**
   * Which details of the incoming request must be passed onto the underlying state machine,
   * such as, account id, user identity, request id, etc.
   *
   * @default - all parameters within request context will be set as false
   */
  readonly requestContext?: RequestContext;

  /**
   * Check if querystring is to be included inside the execution input
   * @default false
   */
  readonly queryString?: boolean;

  /**
   * Check if path is to be included inside the execution input
   * @default false
   */
  readonly path?: boolean;

  /**
   * Check if header is to be included inside the execution input
   * @default false
   */
  readonly headers?: boolean;
}
/**
 * Integrates a Synchronous Express State Machine from AWS Step Functions to an API Gateway method.
 *
 * @example
 *
 *    const stateMachine = new sfn.StateMachine(this, 'MyStateMachine', ...);
 *    api.addMethod('GET', new StepFunctionsIntegration(stateMachine));
 */
export class StepFunctionsIntegration extends AwsIntegration {
  private readonly stateMachine: sfn.IStateMachine;
  private readonly action: string;
  constructor(stateMachine: sfn.IStateMachine, options: StepFunctionsIntegrationOptions = { action: 'StartSyncExecution' }) {

    const integResponse = integrationResponse();
    const requestTemplate = requestTemplates(stateMachine, options);
    super({
      service: 'states',
      action: options.action,
      options: {
        credentialsRole: options.credentialsRole,
        integrationResponses: integResponse,
        passthroughBehavior: PassthroughBehavior.NEVER,
        requestTemplates: requestTemplate,
        ...options,
      },
    });

    this.stateMachine = stateMachine;
    this.action = options.action;
  }

  public bind(method: Method): IntegrationConfig {
    const bindResult = super.bind(method);
    const principal = new iam.ServicePrincipal('apigateway.amazonaws.com');

    this.stateMachine.grantExecution(principal, `states:${this.action}`);

    let stateMachineName;

    if (this.stateMachine instanceof sfn.StateMachine) {
      //if not imported, extract the name from the CFN layer to reach the
      //literal value if it is given (rather than a token)
      stateMachineName = (this.stateMachine.node.defaultChild as sfn.CfnStateMachine).stateMachineName;
    } else {
      //imported state machine
      stateMachineName = 'StateMachine-' + (String(this.stateMachine.stack.node.addr));
    }

    let deploymentToken;

    if (stateMachineName !== undefined && !Token.isUnresolved(stateMachineName)) {
      deploymentToken = JSON.stringify({ stateMachineName });
    }
    return {
      ...bindResult,
      deploymentToken,
    };

  }
}

/**
 * Defines the integration response that passes the result, on success,
 * or the error, on failure, from the backend the client.
 *
 * @returns integrationResponse
 */
function integrationResponse() {
  const errorResponse = [
    {
      /**
       * Specifies the regular expression (regex) pattern used to choose
       * an integration response based on the response from the back end.
       * In this case it will match all '4XX' HTTP Errors
       */
      selectionPattern: '4\\d{2}',
      statusCode: '400',
      responseTemplates: {
        'application/json': `{
            "error": "Bad input!"
          }`,
      },
    },
    {
      /**
       * Match all '5XX' HTTP Errors
       */
      selectionPattern: '5\\d{2}',
      statusCode: '500',
      responseTemplates: {
        'application/json': '"error": $input.path(\'$.error\')',
      },
    },
  ];

  const integResponse = [
    {
      statusCode: '200',
      responseTemplates: {
        'application/json': `#set($inputRoot = $input.path('$'))
                #if($input.path('$.status').toString().equals("FAILED"))
                    #set($context.responseOverride.status = 500)
                    { 
                      "error": "$input.path('$.error')",
                      "cause": "$input.path('$.cause')"
                    }
                #else
                    $input.path('$.output')
                #end`,
      },
    },
    ...errorResponse,
  ];

  return integResponse;
}

/**
 * Checks each property of the RequestContext Object to see if request context has
 * a property specified and then return true or false.
 * @param requestContextObj
 * @returns boolean
 */
function checkIncludeRequestContext(requestContextObj: RequestContext | undefined) {

  if (requestContextObj) {
    if (!requestContextObj.accountId && !requestContextObj.apiId && !requestContextObj.apiKey &&
      !requestContextObj.authorizerPrincipalId && !requestContextObj.caller &&
      !requestContextObj.cognitoAuthenticationProvider && !requestContextObj.cognitoAuthenticationType &&
      !requestContextObj.cognitoIdentityId && !requestContextObj.cognitoIdentityPoolId &&
      !requestContextObj.httpMethod && !requestContextObj.stage && !requestContextObj.sourceIp &&
      !requestContextObj.user && !requestContextObj.userAgent &&
      !requestContextObj.userArn && !requestContextObj.requestId &&
      !requestContextObj.resourceId && !requestContextObj.resourcePath) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

/**
 * Defines the request template that will be used for the integration
 * @param stateMachine
 * @param options
 * @returns requestTemplate
 */
function requestTemplates(stateMachine: sfn.IStateMachine, options: StepFunctionsIntegrationOptions) {
  let includeRequestContext: boolean = checkIncludeRequestContext(options.requestContext);
  const templateStr = templateString(stateMachine, includeRequestContext, options);

  const requestTemplate: { [contentType:string] : string } =
    {
      'application/json': templateStr,
    };

  return requestTemplate;
}

/**
 * Reads the VTL template and returns the template string to be used
 * for the request template.
 *
 * @param stateMachine
 * @param includeRequestContext
 * @param options
 * @reutrns templateString
 */
function templateString(_stateMachine: sfn.IStateMachine, _includeRequestContext: boolean, _options: StepFunctionsIntegrationOptions): string {
  let templateStr: string;

  let requestContextStr = '';

  const includeHeader: string = (_options.headers) ? 'true': 'false';
  const includeQueryString: string = (_options.queryString) ? 'true': 'false';
  const includePath: string = (_options.path) ? 'true': 'false';

  if (_includeRequestContext) {
    requestContextStr = requestContext(_options.requestContext);
  }

  templateStr = fs.readFileSync(path.join(__dirname, 'stepfunctions.vtl'), { encoding: 'utf-8' });
  templateStr = templateStr.replace('%STATEMACHINE%', _stateMachine.stateMachineArn);
  templateStr = templateStr.replace('%INCLUDE_HEADERS%', includeHeader);
  templateStr = templateStr.replace('%INCLUDE_QUERYSTRING%', includeQueryString);
  templateStr = templateStr.replace('%INCLUDE_PATH%', includePath);
  templateStr = templateStr.replace('%REQUESTCONTEXT%', requestContextStr);


  return templateStr;
}

/**
 * Builder function that builds the request context string
 * for when request context is asked for the execution input.
 *
 * @param requestContextInterface
 * @returns reqeustContextStr
 */
function requestContextBuilder(requestContextInterface:RequestContext): string {
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

  let requestContextString :string = contextStr + accountIdStr + apiIdStr + apiKeyStr +
        authorizerPrincipalIdStr + callerStr + cognitoAuthenticationProviderStr + cognitoAuthenticationTypeStr +
        cognitoIdentityIdStr + cognitoIdentityPoolIdStr + httpMethodStr + stageStr + sourceIpStr + userStr +
        userAgentStr + userArnStr + requestIdStr + resourceIdStr + resourcePathStr + endStr;

  if (requestContextString !== (contextStr + endStr)) {
    //Removing the last comma froom the string only if it has a value inside
    requestContextString = requestContextString.substring(0, requestContextString.length-2) + '}';
  }
  return requestContextString;
}

function requestContext(requestContextObj: RequestContext | undefined): string {
  const requestContextStr: string = requestContextBuilder({
    accountId: (requestContextObj) ? requestContextObj?.accountId : false,
    apiId: (requestContextObj) ? requestContextObj?.apiId : false,
    apiKey: (requestContextObj) ? requestContextObj?.apiKey : false,
    authorizerPrincipalId: (requestContextObj) ? requestContextObj?.authorizerPrincipalId : false,
    caller: (requestContextObj) ? requestContextObj?.caller : false,
    cognitoAuthenticationProvider: (requestContextObj) ? requestContextObj?.cognitoAuthenticationProvider : false,
    cognitoAuthenticationType: (requestContextObj) ? requestContextObj?.cognitoAuthenticationType : false,
    cognitoIdentityId: (requestContextObj) ? requestContextObj?.cognitoIdentityId : false,
    cognitoIdentityPoolId: (requestContextObj) ? requestContextObj?.cognitoIdentityPoolId : false,
    httpMethod: (requestContextObj) ? requestContextObj?.httpMethod : false,
    stage: (requestContextObj) ? requestContextObj?.stage : false,
    sourceIp: (requestContextObj) ? requestContextObj?.sourceIp : false,
    user: (requestContextObj) ? requestContextObj?.user : false,
    userAgent: (requestContextObj) ? requestContextObj?.userAgent : false,
    userArn: (requestContextObj) ? requestContextObj?.userArn : false,
    requestId: (requestContextObj) ? requestContextObj?.requestId : false,
    resourceId: (requestContextObj) ? requestContextObj?.resourceId : false,
    resourcePath: (requestContextObj) ? requestContextObj?.resourcePath : false,
  });

  const search = '"';
  const replaceWith = '@@';
  const requestContextStrModified = requestContextStr.split(search).join(replaceWith);
  return requestContextStrModified;
}