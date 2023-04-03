/// <reference types="node" />
import * as https from 'https';
import * as AWS from 'aws-sdk';
declare function defaultHttpRequest(options: https.RequestOptions, responseBody: string): Promise<unknown>;
declare function defaultStartExecution(req: AWS.StepFunctions.StartExecutionInput): Promise<AWS.StepFunctions.StartExecutionOutput>;
declare function defaultInvokeFunction(req: AWS.Lambda.InvocationRequest): Promise<AWS.Lambda.InvocationResponse>;
export declare let startExecution: typeof defaultStartExecution;
export declare let invokeFunction: typeof defaultInvokeFunction;
export declare let httpRequest: typeof defaultHttpRequest;
export {};
