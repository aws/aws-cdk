import * as AWS from 'aws-sdk';
export declare type InvokeFunction = (functionName: string) => Promise<AWS.Lambda.InvocationResponse>;
export declare const invoke: InvokeFunction;
export declare function handler(event: AWSLambda.CloudFormationCustomResourceEvent): Promise<void>;
