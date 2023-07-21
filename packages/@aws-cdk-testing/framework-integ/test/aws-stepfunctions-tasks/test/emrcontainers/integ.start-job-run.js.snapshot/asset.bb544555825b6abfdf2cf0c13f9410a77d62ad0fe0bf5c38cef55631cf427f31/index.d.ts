import { IsCompleteResponse } from '../../../custom-resources/lib/provider-framework/types';
export declare function onEvent(event: AWSLambda.CloudFormationCustomResourceEvent): Promise<void | import("../../../custom-resources/lib/provider-framework/types").OnEventResponse>;
export declare function isComplete(event: AWSLambda.CloudFormationCustomResourceEvent): Promise<IsCompleteResponse>;
