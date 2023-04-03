/// <reference types="node" />
import * as https from 'https';
export declare const MOCK_REQUEST: {
    ResponseURL: string;
    LogicalResourceId: string;
    RequestId: string;
    StackId: string;
};
export declare const MOCK_ON_EVENT_FUNCTION_ARN = "arn:lambda:user:on:event";
export declare const MOCK_IS_COMPLETE_FUNCTION_ARN = "arn:lambda:user:is:complete";
export declare const MOCK_SFN_ARN = "arn:of:state:machine";
export declare let stringifyPayload: boolean;
export declare let onEventImplMock: AWSCDKAsyncCustomResource.OnEventHandler | undefined;
export declare let isCompleteImplMock: AWSCDKAsyncCustomResource.IsCompleteHandler | undefined;
export declare let startStateMachineInput: AWS.StepFunctions.StartExecutionInput | undefined;
export declare let cfnResponse: AWSLambda.CloudFormationCustomResourceResponse;
export declare function setup(): void;
export declare function httpRequestMock(options: https.RequestOptions, body: string): Promise<void>;
export declare function invokeFunctionMock(req: AWS.Lambda.InvocationRequest): Promise<AWS.Lambda.InvocationResponse>;
export declare function prepareForExecution(): void;
export declare function startExecutionMock(req: AWS.StepFunctions.StartExecutionInput): Promise<{
    executionArn: string;
    startDate: Date;
}>;
