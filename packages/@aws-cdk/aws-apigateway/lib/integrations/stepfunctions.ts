import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Token } from '@aws-cdk/core';
import { ExecutionInput, ExecutionInputBuilder } from '.';
import { IntegrationConfig, IntegrationOptions, PassthroughBehavior } from '../integration';
import { Method } from '../method';
import { AwsIntegration } from './aws';

/**
 * Options when configuring Step Functions integration with Rest API
 */
export interface StepFunctionsIntegrationOptions extends IntegrationOptions {
  /**
   * Check if cors is enabled
   * @default false
   */
  readonly corsEnabled?: boolean;

  /**
   * You can add requestContext (similar to input requestContext from lambda input)
   * to the input. The 'requestContext' parameter includes account ID, user identity, etc.
   * that can be used by customers that want to know the identity of authorized users on
   * the state machine side. The following code defines a REST API like above but also
   * adds 'requestContext' to the input of the State Machine:
   *
   * @example
   *
   *    const stateMachine = new stepFunctions.StateMachine(this, 'StateMachine', ...);
   *    new apigateway.StepFunctionsRestApi(this, 'StepFunctionsRestApi', {
   *      stateMachine: stateMachine,
   *      includeRequestContext: true,
   *    });
   *
   * @default false
   */
  readonly includeRequestContext?: boolean;

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

  constructor(stateMachine: sfn.IStateMachine, options: StepFunctionsIntegrationOptions = { }) {

    const integResponse = integrationResponse();
    const requestTemplate = requestTemplates(stateMachine, options.includeRequestContext);
    super({
      service: 'states',
      action: 'StartSyncExecution',
      options: {
        credentialsRole: options.credentialsRole,
        integrationResponses: integResponse,
        passthroughBehavior: PassthroughBehavior.NEVER,
        requestTemplates: requestTemplate,
      },
    });

    this.stateMachine = stateMachine;
  }

  public bind(method: Method): IntegrationConfig {
    const bindResult = super.bind(method);
    const principal = new iam.ServicePrincipal('apigateway.amazonaws.com');

    this.stateMachine.grantExecution(principal, 'states:StartSyncExecution');

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

function requestTemplates(stateMachine: sfn.IStateMachine, includeRequestContext: boolean | undefined) {
  const templateStr = templateString(stateMachine, includeRequestContext);

  const requestTemplate: { [contentType:string] : string } =
    {
      'application/json': templateStr,
    };

  return requestTemplate;
}

function templateString(stateMachine: sfn.IStateMachine, includeRequestContext: boolean | undefined): string {
  let templateStr: string;
  const requestContextStr = requestContext();

  const search = '"';
  const replaceWith = '\\"';
  const requestContextStrModified = requestContextStr.split(search).join(replaceWith);
  if (includeRequestContext) {
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

function requestContext(): string {
  const executionInput: ExecutionInput = new ExecutionInputBuilder('$util.escapeJavaScript($input.json(\'$\'))')
    .withAccountId('"$context.identity.accountId"')
    .withApiId('"$context.apiId"')
    .withApiKey('"$context.identity.apiKey"')
    .withAuthorizerPrincipalId('"$context.authorizer.principalId"')
    .withCaller('"$context.identity.caller"')
    .withCognitoAuthenticationProvider('"$context.identity.cognitoAuthenticationProvider"')
    .withCognitoAuthenticationType('"$context.identity.cognitoAuthenticationType"')
    .withCognitoIdentityId('"$context.identity.cognitoIdentityId"')
    .withCognitoIdentityPoolId('"$context.identity.cognitoIdentityPoolId"')
    .withHttpMethod('"$context.httpMethod"')
    .withStage('"$context.stage"')
    .withSourceIp('"$context.identity.sourceIp"')
    .withUser('"$context.identity.user"')
    .withUserAgent('"$context.identity.userAgent"')
    .withUserArn('"$context.identity.userArn"')
    .withRequestId('"$context.requestId"')
    .withResourceId('"$context.resourceId"')
    .withResourcePath('"$context.resourcePath"')
    .create();

  return executionInput.retrieveAllAsString();
}