import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Token } from '@aws-cdk/core';
import { RequestContextBuilder, RequestContext } from '.';
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
   * You can add requestContext (similar to input requestContext from lambda input)
   * to the input. The 'requestContext' parameter includes account ID, user identity, etc.
   * that can be used by customers that want to know the identity of authorized users on
   * the state machine side. You can individually select the keys you want by setting them to true.
   * The following code defines a REST API like above but also adds 'requestContext' to the input
   * of the State Machine:
   *
   * @example
   *
   *    const stateMachine = new stepFunctions.StateMachine(this, 'StateMachine', ...);
   *    new apigateway.StepFunctionsRestApi(this, 'StepFunctionsRestApi', {
   *      stateMachine: stateMachine,
   *      requestContext: {
   *         accountId: true,
   *         apiId: true,
   *         apiKey: true,
   *         authorizerPrincipalId: true,
   *         caller: true,
   *         cognitoAuthenticationProvider: true,
   *         cognitoAuthenticationType: true,
   *         cognitoIdentityId: true,
   *         cognitoIdentityPoolId: true,
   *         httpMethod: true,
   *         stage: true,
   *         sourceIp: true,
   *         user: true,
   *         userAgent: true,
   *         userArn: true,
   *         requestId: true,
   *         resourceId: true,
   *         resourcePath: true,
   *       },
   *    });
   *
   * @default - all parameters within request context will be set as false
   */
  readonly requestContext?: RequestContext;


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
    let requestContextRequested: boolean = (options.requestContext) ? true: false;

    const integResponse = integrationResponse();
    const requestTemplate = requestTemplates(stateMachine, requestContextRequested, options.requestContext);
    super({
      service: 'states',
      action: options.action,
      options: {
        credentialsRole: options.credentialsRole,
        integrationResponses: integResponse,
        passthroughBehavior: PassthroughBehavior.NEVER,
        requestTemplates: requestTemplate,
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

function requestTemplates(stateMachine: sfn.IStateMachine, includeRequestContext: boolean, requestContextObj: RequestContext | undefined) {
  const templateStr = templateString(stateMachine, includeRequestContext, requestContextObj);

  const requestTemplate: { [contentType:string] : string } =
    {
      'application/json': templateStr,
    };

  return requestTemplate;
}

function templateString(stateMachine: sfn.IStateMachine, includeRequestContext: boolean, requestContextObj: RequestContext | undefined): string {
  let templateStr: string;

  if (includeRequestContext) {
    const requestContextStr = requestContext(requestContextObj);

    const search = '"';
    const replaceWith = '\\"';
    const requestContextStrModified = requestContextStr.split(search).join(replaceWith);
    templateStr = `
    #set($allParams = $input.params())
    {
      "input": "{${requestContextStrModified}}",
      "stateMachineArn": "${stateMachine.stateMachineArn}"
    }`;
  } else {
    templateStr = `
    #set($inputRoot = $input.path('$')) {
        "input": "$util.escapeJavaScript($input.json('$'))",
        "stateMachineArn": "${stateMachine.stateMachineArn}"
      }`;
  }
  return templateStr;
}

function requestContext(requestContextObj: RequestContext | undefined): string {
  const requestContextStr: string = new RequestContextBuilder().with({
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

  return requestContextStr;
}