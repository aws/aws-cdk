/// <reference types="node" />
import * as https from 'https';
export declare const external: {
    sendHttpRequest: typeof defaultSendHttpRequest;
    log: typeof defaultLog;
    includeStackTraces: boolean;
    userHandlerIndex: string;
};
export type Response = AWSLambda.CloudFormationCustomResourceEvent & HandlerResponse;
export type Handler = (event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) => Promise<HandlerResponse | void>;
export type HandlerResponse = undefined | {
    Data?: any;
    PhysicalResourceId?: string;
    Reason?: string;
    NoEcho?: boolean;
};
export declare function handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context): Promise<void>;
declare function defaultSendHttpRequest(options: https.RequestOptions, responseBody: string): Promise<void>;
declare function defaultLog(fmt: string, ...params: any[]): void;
export interface RetryOptions {
    /** How many retries (will at least try once) */
    readonly attempts: number;
    /** Sleep base, in ms */
    readonly sleep: number;
}
export declare function withRetries<A extends Array<any>, B>(options: RetryOptions, fn: (...xs: A) => Promise<B>): (...xs: A) => Promise<B>;
export {};
