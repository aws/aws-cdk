import * as AWSLambda from 'aws-lambda';
/**
 * Serialized form of the physical resource id for use in the operation parameters
 */
export declare const PHYSICAL_RESOURCE_ID_REFERENCE = "PHYSICAL:RESOURCEID:";
/**
 * Flattens a nested object
 *
 * @param object the object to be flattened
 * @returns a flat object with path as keys
 */
export declare function flatten(object: object): {
    [key: string]: any;
};
export declare function forceSdkInstallation(): void;
export declare function handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context): Promise<void>;
