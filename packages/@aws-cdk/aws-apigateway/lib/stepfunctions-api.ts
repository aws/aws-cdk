import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { RestApi, RestApiProps } from '.';
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
   * Check if requestContext is enabled
   * If enabled, requestContext is passed into the input of the State Machine. This requestContext is same as  the lambda input (https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format) requestContext parameter.
   * @default false
   */
  readonly includeRequestContext?: boolean;
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
        includeRequestContext: props.includeRequestContext,
      }),
      ...props,
    });

    if (!corsEnabled) {
      this.root.addMethod('ANY', new StepFunctionsIntegration(props.stateMachine, {
        credentialsRole: apiRole,
        includeRequestContext: props.includeRequestContext,
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