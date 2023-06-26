/// <reference types="aws-cdk-lib/custom-resources/lib/provider-framework/types" />
export declare function onEvent(event: AWSCDKAsyncCustomResource.OnEventRequest): Promise<void | import("aws-cdk-lib/custom-resources/lib/provider-framework/types").OnEventResponse>;
export declare function putObject(event: AWSCDKAsyncCustomResource.OnEventRequest): Promise<AWSCDKAsyncCustomResource.OnEventResponse>;
export declare function deleteObject(event: AWSCDKAsyncCustomResource.OnEventRequest): Promise<void>;
