import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { RestApi, RestApiProps } from '.';
import { RequestContext } from './integrations';
import { StepFunctionsIntegration } from './integrations/stepfunctions';
import { Model } from './model';

/**
 * Properties for StepFunctionsRestApi
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

    const stepfunctionsIntegration = StepFunctionsIntegration.startExecution(props.stateMachine, {
      credentialsRole: role(scope, props),
      requestContext: props.requestContext,
      path: props.path?? true,
      querystring: props.querystring?? true,
      headers: props.headers,
    });

    super(scope, id, props);

    this.root.addMethod('ANY', stepfunctionsIntegration, {
      methodResponses: methodResponse(),
    });
  }
}

/**
 * Defines the IAM Role for API Gateway with required permissions
 * to invoke a synchronous execution for the provided state machine
 *
 * @param scope
 * @param props
 * @returns Role - IAM Role
 */
function role(scope: Construct, props: StepFunctionsRestApiProps): iam.Role {
  const roleName: string = 'StartSyncExecutionRole';
  const apiRole = new iam.Role(scope, roleName, {
    assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
  });

  props.stateMachine.grantStartSyncExecution(apiRole);

  return apiRole;
}

/**
 * Defines the method response modelfor each HTTP code response
 * @returns methodResponse
 */
function methodResponse() {
  return [
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
}