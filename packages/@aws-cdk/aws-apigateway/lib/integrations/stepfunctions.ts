import * as fs from 'fs';
import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Token } from '@aws-cdk/core';
import { RequestContext } from '.';
import { AwsIntegration } from './aws';
import { IntegrationConfig, IntegrationOptions, PassthroughBehavior } from '../integration';
import { Method } from '../method';
import { Model } from '../model';
/**
 * Options when configuring Step Functions synchronous integration with Rest API
 */
export interface StepFunctionsExecutionIntegrationOptions extends IntegrationOptions {

  /**
   * Which details of the incoming request must be passed onto the underlying state machine,
   * such as, account id, user identity, request id, etc. The execution input will include a new key `requestContext`:
   *
   * {
   *   "body": {},
   *   "requestContext": {
   *       "key": "value"
   *   }
   * }
   *
   * @default - all parameters within request context will be set as false
   */
  readonly requestContext?: RequestContext;

  /**
   * Check if querystring is to be included inside the execution input. The execution input will include a new key `queryString`:
   *
   * {
   *   "body": {},
   *   "querystring": {
   *     "key": "value"
   *   }
   * }
   *
   * @default true
   */
  readonly querystring?: boolean;

  /**
   * Check if path is to be included inside the execution input. The execution input will include a new key `path`:
   *
   * {
   *   "body": {},
   *   "path": {
   *     "resourceName": "resourceValue"
   *   }
   * }
   *
   * @default true
   */
  readonly path?: boolean;

  /**
   * Check if header is to be included inside the execution input. The execution input will include a new key `headers`:
   *
   * {
   *   "body": {},
   *   "headers": {
   *      "header1": "value",
   *      "header2": "value"
   *   }
   * }
   * @default false
   */
  readonly headers?: boolean;

  /**
   * If the whole authorizer object, including custom context values should be in the execution input. The execution input will include a new key `authorizer`:
   *
   * {
   *   "body": {},
   *   "authorizer": {
   *     "key": "value"
   *   }
   * }
   *
   * @default false
   */
  readonly authorizer?: boolean;
}

/**
 * Options to integrate with various StepFunction API
 */
export class StepFunctionsIntegration {
  /**
   * Integrates a Synchronous Express State Machine from AWS Step Functions to an API Gateway method.
   *
   * @example
   *
   *    const stateMachine = new stepfunctions.StateMachine(this, 'MyStateMachine', {
   *       stateMachineType: stepfunctions.StateMachineType.EXPRESS,
   *       definition: stepfunctions.Chain.start(new stepfunctions.Pass(this, 'Pass')),
   *    });
   *
   *    const api = new apigateway.RestApi(this, 'Api', {
   *       restApiName: 'MyApi',
   *    });
   *    api.root.addMethod('GET', apigateway.StepFunctionsIntegration.startExecution(stateMachine));
   */
  public static startExecution(stateMachine: sfn.IStateMachine, options?: StepFunctionsExecutionIntegrationOptions): AwsIntegration {
    return new StepFunctionsExecutionIntegration(stateMachine, options);
  }
}

class StepFunctionsExecutionIntegration extends AwsIntegration {
  private readonly stateMachine: sfn.IStateMachine;
  constructor(stateMachine: sfn.IStateMachine, options: StepFunctionsExecutionIntegrationOptions = {}) {
    super({
      service: 'states',
      action: 'StartSyncExecution',
      options: {
        credentialsRole: options.credentialsRole,
        integrationResponses: integrationResponse(),
        passthroughBehavior: PassthroughBehavior.NEVER,
        requestTemplates: requestTemplates(stateMachine, options),
        ...options,
      },
    });

    this.stateMachine = stateMachine;
  }

  public bind(method: Method): IntegrationConfig {
    const bindResult = super.bind(method);

    const credentialsRole = bindResult.options?.credentialsRole ?? new iam.Role(method, 'StartSyncExecutionRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });
    this.stateMachine.grantStartSyncExecution(credentialsRole);

    let stateMachineName;

    if (this.stateMachine instanceof sfn.StateMachine) {
      const stateMachineType = (this.stateMachine as sfn.StateMachine).stateMachineType;
      if (stateMachineType !== sfn.StateMachineType.EXPRESS) {
        throw new Error('State Machine must be of type "EXPRESS". Please use StateMachineType.EXPRESS as the stateMachineType');
      }

      //if not imported, extract the name from the CFN layer to reach the
      //literal value if it is given (rather than a token)
      stateMachineName = (this.stateMachine.node.defaultChild as sfn.CfnStateMachine).stateMachineName;
    } else {
      //imported state machine
      stateMachineName = `StateMachine-${this.stateMachine.stack.node.addr}`;
    }

    let deploymentToken;

    if (stateMachineName !== undefined && !Token.isUnresolved(stateMachineName)) {
      deploymentToken = JSON.stringify({ stateMachineName });
    }

    for (const methodResponse of METHOD_RESPONSES) {
      method.addMethodResponse(methodResponse);
    }

    return {
      ...bindResult,
      options: {
        ...bindResult.options,
        credentialsRole,
      },
      deploymentToken,
    };
  }
}

/**
 * Defines the integration response that passes the result on success,
 * or the error on failure, from the synchronous execution to the caller.
 *
 * @returns integrationResponse mapping
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
            "error": "Bad request!"
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
        /* eslint-disable */
        'application/json': [
          '#set($inputRoot = $input.path(\'$\'))',
          '#if($input.path(\'$.status\').toString().equals("FAILED"))',
            '#set($context.responseOverride.status = 500)',
            '{',
              '"error": "$input.path(\'$.error\')",',
              '"cause": "$input.path(\'$.cause\')"',
            '}',
          '#else',
            '$input.path(\'$.output\')',
          '#end',
        /* eslint-enable */
        ].join('\n'),
      },
    },
    ...errorResponse,
  ];

  return integResponse;
}

/**
 * Defines the request template that will be used for the integration
 * @param stateMachine
 * @param options
 * @returns requestTemplate
 */
function requestTemplates(stateMachine: sfn.IStateMachine, options: StepFunctionsExecutionIntegrationOptions) {
  const templateStr = templateString(stateMachine, options);

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
function templateString(
  stateMachine: sfn.IStateMachine,
  options: StepFunctionsExecutionIntegrationOptions): string {
  let templateStr: string;

  let requestContextStr = '';

  const includeHeader = options.headers?? false;
  const includeQueryString = options.querystring?? true;
  const includePath = options.path?? true;
  const includeAuthorizer = options.authorizer ?? false;

  if (options.requestContext && Object.keys(options.requestContext).length > 0) {
    requestContextStr = requestContext(options.requestContext);
  }

  templateStr = fs.readFileSync(path.join(__dirname, 'stepfunctions.vtl'), { encoding: 'utf-8' });
  templateStr = templateStr.replace('%STATEMACHINE%', stateMachine.stateMachineArn);
  templateStr = templateStr.replace('%INCLUDE_HEADERS%', String(includeHeader));
  templateStr = templateStr.replace('%INCLUDE_QUERYSTRING%', String(includeQueryString));
  templateStr = templateStr.replace('%INCLUDE_PATH%', String(includePath));
  templateStr = templateStr.replace('%INCLUDE_AUTHORIZER%', String(includeAuthorizer));
  templateStr = templateStr.replace('%REQUESTCONTEXT%', requestContextStr);

  return templateStr;
}

function requestContext(requestContextObj: RequestContext | undefined): string {
  const context = {
    accountId: requestContextObj?.accountId? '$context.identity.accountId': undefined,
    apiId: requestContextObj?.apiId? '$context.apiId': undefined,
    apiKey: requestContextObj?.apiKey? '$context.identity.apiKey': undefined,
    authorizerPrincipalId: requestContextObj?.authorizerPrincipalId? '$context.authorizer.principalId': undefined,
    caller: requestContextObj?.caller? '$context.identity.caller': undefined,
    cognitoAuthenticationProvider: requestContextObj?.cognitoAuthenticationProvider? '$context.identity.cognitoAuthenticationProvider': undefined,
    cognitoAuthenticationType: requestContextObj?.cognitoAuthenticationType? '$context.identity.cognitoAuthenticationType': undefined,
    cognitoIdentityId: requestContextObj?.cognitoIdentityId? '$context.identity.cognitoIdentityId': undefined,
    cognitoIdentityPoolId: requestContextObj?.cognitoIdentityPoolId? '$context.identity.cognitoIdentityPoolId': undefined,
    httpMethod: requestContextObj?.httpMethod? '$context.httpMethod': undefined,
    stage: requestContextObj?.stage? '$context.stage': undefined,
    sourceIp: requestContextObj?.sourceIp? '$context.identity.sourceIp': undefined,
    user: requestContextObj?.user? '$context.identity.user': undefined,
    userAgent: requestContextObj?.userAgent? '$context.identity.userAgent': undefined,
    userArn: requestContextObj?.userArn? '$context.identity.userArn': undefined,
    requestId: requestContextObj?.requestId? '$context.requestId': undefined,
    resourceId: requestContextObj?.resourceId? '$context.resourceId': undefined,
    resourcePath: requestContextObj?.resourcePath? '$context.resourcePath': undefined,
  };

  const contextAsString = JSON.stringify(context);

  // The VTL Template conflicts with double-quotes (") for strings.
  // Before sending to the template, we replace double-quotes (") with @@ and replace it back inside the .vtl file
  const doublequotes = '"';
  const replaceWith = '@@';
  return contextAsString.split(doublequotes).join(replaceWith);
}

/**
 * Method response model for each HTTP code response
 */
const METHOD_RESPONSES = [
  {
    statusCode: '200',
    responseModels: {
      'application/json': Model.EMPTY_MODEL,
    },
  },
  {
    statusCode: '400',
    responseModels: {
      'application/json': Model.ERROR_MODEL,
    },
  },
  {
    statusCode: '500',
    responseModels: {
      'application/json': Model.ERROR_MODEL,
    },
  },
];
