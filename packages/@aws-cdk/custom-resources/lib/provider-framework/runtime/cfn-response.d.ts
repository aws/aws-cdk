export declare const CREATE_FAILED_PHYSICAL_ID_MARKER = "AWSCDK::CustomResourceProviderFramework::CREATE_FAILED";
export declare const MISSING_PHYSICAL_ID_MARKER = "AWSCDK::CustomResourceProviderFramework::MISSING_PHYSICAL_ID";
export interface CloudFormationResponseOptions {
    readonly reason?: string;
    readonly noEcho?: boolean;
}
export interface CloudFormationEventContext {
    StackId: string;
    RequestId: string;
    PhysicalResourceId?: string;
    LogicalResourceId: string;
    ResponseURL: string;
    Data?: any;
}
export declare function submitResponse(status: 'SUCCESS' | 'FAILED', event: CloudFormationEventContext, options?: CloudFormationResponseOptions): Promise<void>;
export declare let includeStackTraces: boolean;
export declare function safeHandler(block: (event: any) => Promise<void>): (event: any) => Promise<void>;
export declare class Retry extends Error {
}
