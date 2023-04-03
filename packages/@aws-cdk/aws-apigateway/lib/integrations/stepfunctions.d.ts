import * as sfn from '@aws-cdk/aws-stepfunctions';
import { RequestContext } from '.';
import { AwsIntegration } from './aws';
import { IntegrationOptions } from '../integration';
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
export declare class StepFunctionsIntegration {
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
    static startExecution(stateMachine: sfn.IStateMachine, options?: StepFunctionsExecutionIntegrationOptions): AwsIntegration;
}
