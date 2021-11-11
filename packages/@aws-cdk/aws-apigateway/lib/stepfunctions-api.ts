import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { RestApi, RestApiProps } from '.';
import { RequestContext } from './integrations';
import { StepFunctionsIntegration } from './integrations/stepfunctions';
import { Model } from './model';

/**
 * Propeties for StepFunctionsRestApi
 *
 */
export interface StepFunctionsRestApiProps extends RestApiProps {
/**
 * The default State Machine that handles all requests from this API.
 *
 * This stateMachine will be used as a the default integration for all methods in
 * this API, unless specified otherwise in `addMethod`.
 */
  readonly stateMachine: sfn.IStateMachine;

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
 * Defines an API Gateway REST API with a Synchrounous Express State Machine as a proxy integration.
 */
export class StepFunctionsRestApi extends RestApi {
  constructor(scope: Construct, id: string, props: StepFunctionsRestApiProps) {
    if (props.defaultIntegration) {
      throw new Error('Cannot specify "defaultIntegration" since Step Functions integration is automatically defined');
    }

    if ((props.stateMachine.node.defaultChild as sfn.CfnStateMachine).stateMachineType !== sfn.StateMachineType.EXPRESS) {
      throw new Error('State Machine must be of type "EXPRESS". Please use StateMachineType.EXPRESS as the stateMachineType');
    }

    const apiRole = role(scope, props);
    const methodResp = methodResponse();

    let corsEnabled;

    if (props.defaultCorsPreflightOptions !== undefined) {
      corsEnabled = true;
    } else {
      corsEnabled = false;
    }

    super(scope, id, {
      defaultIntegration: new StepFunctionsIntegration(props.stateMachine, {
        credentialsRole: apiRole,
        corsEnabled: corsEnabled,
        requestContext: props.requestContext,
        action: 'StartSyncExecution',
      }),
      ...props,
    });

    if (!corsEnabled) {
      this.root.addMethod('ANY', new StepFunctionsIntegration(props.stateMachine, {
        credentialsRole: apiRole,
        requestContext: props.requestContext,
        action: 'StartSyncExecution',
      }), {
        methodResponses: [
          ...methodResp,
        ],
      });
    }
  }
}

function role(scope: Construct, props: StepFunctionsRestApiProps): iam.Role {
  const apiName: string = props.stateMachine + '-apiRole';
  const apiRole = new iam.Role(scope, apiName, {
    assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
  });

  apiRole.attachInlinePolicy(
    new iam.Policy(scope, 'AllowStartSyncExecution', {
      statements: [
        new iam.PolicyStatement({
          actions: ['states:StartSyncExecution'],
          effect: iam.Effect.ALLOW,
          resources: [props.stateMachine.stateMachineArn],
        }),
      ],
    }),
  );

  return apiRole;
}

function methodResponse() {
  const methodResp = [
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

  return methodResp;
}