/// <reference types="@aws-cdk/custom-resource-handlers/lib/types" />
export declare function onEvent(event: AWSCDKAsyncCustomResource.OnEventRequest): Promise<void | import("@aws-cdk/custom-resource-handlers/lib/types").OnEventResponse>;
export declare function putObject(event: AWSCDKAsyncCustomResource.OnEventRequest): Promise<AWSCDKAsyncCustomResource.OnEventResponse>;
export declare function deleteObject(event: AWSCDKAsyncCustomResource.OnEventRequest): Promise<void>;
