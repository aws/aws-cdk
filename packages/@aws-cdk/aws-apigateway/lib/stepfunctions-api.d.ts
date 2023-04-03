import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct } from 'constructs';
import { RestApi, RestApiProps } from '.';
import { RequestContext } from './integrations';
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
    /**
     * An IAM role that API Gateway will assume to start the execution of the
     * state machine.
     *
     * @default - a new role is created
     */
    readonly role?: iam.IRole;
}
/**
 * Defines an API Gateway REST API with a Synchrounous Express State Machine as a proxy integration.
 */
export declare class StepFunctionsRestApi extends RestApi {
    constructor(scope: Construct, id: string, props: StepFunctionsRestApiProps);
}
