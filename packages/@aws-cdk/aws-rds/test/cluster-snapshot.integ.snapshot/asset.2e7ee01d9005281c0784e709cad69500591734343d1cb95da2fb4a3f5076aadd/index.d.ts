import type { IsCompleteRequest, IsCompleteResponse, OnEventRequest, OnEventResponse } from '@aws-cdk/custom-resources/lib/provider-framework/types';
export declare function onEventHandler(event: OnEventRequest): Promise<OnEventResponse>;
export declare function isCompleteHandler(event: IsCompleteRequest): Promise<IsCompleteResponse>;
